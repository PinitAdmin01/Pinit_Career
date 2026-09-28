#!/usr/bin/env node
/**
 * Read-only. Maps every /api/* path the client calls to whatever actually
 * serves it in production.
 *
 * Every /api/* call goes to the app's own server routes under src/app/api:
 * request() in src/lib/api/client.ts sends it over the network, and
 * src/lib/fetchInterceptor.ts only attaches the auth header. A path is served
 * when a route file matches it and exports the method (verdict SERVER);
 * otherwise it is UNHANDLED-404.
 *
 * Until 2026-09-28 the browser also carried its own backend — campusFallback.ts
 * and firestoreRouter() in legacyFirestoreRouter.ts — which this script still
 * evaluates if those files exist (guard conditions are EVALUATED, not
 * pattern-matched). They were removed as unreachable, so those layers are empty.
 *
 * Outputs audit/contracts.json, audit/CONTRACTS.md and audit/LEDGER.md.
 * Writes nothing else.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { matchPair, statementEnd, lineOf } from './lib-scan.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CLIENT = 'src/lib/api/client.ts';
const INTERCEPTOR = 'src/lib/fetchInterceptor.ts';
const CAMPUS = 'src/lib/campusFallback.ts';
const METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

// Course content, not application logic — it embeds example API paths in
// teaching material which would otherwise pollute the call-site list.
const NOT_APP_CODE = ['src/lib/data/', 'src/lib/curriculum/', CLIENT, INTERCEPTOR, CAMPUS, 'src/app/api/'];

const DB_RE = /\bsupabase\s*\.|\.from\s*\(|getDocs\s*\(|getDoc\s*\(|setDoc\s*\(|addDoc\s*\(|updateDoc\s*\(|deleteDoc\s*\(|collection\s*\(|\bfs\.[a-zA-Z_$][\w$]*\s*\(|localJsonDb|table\s*\(/;
const EXT_RE = /callExternalLLM\s*\(|\bfetch\s*\(/;
// Browser-local persistence. Real storage, but per-device: it never reaches
// another browser, another machine, or any report. Worth separating from both
// "writes to the database" and "returns a canned literal".
const LOCAL_RE = /localStorage|sessionStorage|indexedDB/;

const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
// Layers 3 and 4 (campusFallback, firestoreRouter) ran in the browser and were removed on 2026-09-28:
// every /api/* call now goes to the server. A missing file means that layer has no cases.
const readIfExists = (p) => (fs.existsSync(path.join(ROOT, p)) ? read(p) : '');

function walk(dir, out = []) {
  for (const e of fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true })) {
    const rel = dir + '/' + e.name;
    if (e.isDirectory()) { if (e.name !== 'node_modules') walk(rel, out); }
    else if (/\.tsx?$/.test(e.name)) out.push(rel);
  }
  return out;
}
const SOURCES = walk('src');
const APP_CODE = SOURCES.filter((f) => !NOT_APP_CODE.some((x) => f.startsWith(x) || f === x));

// ── 0. reachability: which source files can a visitor actually reach? ───────
// A path called only from a page that is never built is not a defect, it is
// dead code. src/app/_legacy/* is the clearest case here: those pages import
// PinITExamEngine and call /api/exam/*, but `out/_legacy` does not exist, so
// none of it ships. Without this check the ledger sends you to fix features
// nobody can open.
const OUT = path.join(ROOT, 'out');
const builtRoutes = new Set();
(function collect(dir = OUT, prefix = '') {
  if (!fs.existsSync(dir)) return;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === '_next') continue;
    if (e.isDirectory()) { builtRoutes.add(prefix + '/' + e.name); collect(path.join(dir, e.name), prefix + '/' + e.name); }
    else if (e.name.endsWith('.html')) builtRoutes.add(prefix + '/' + e.name.replace(/\.html$/, ''));
  }
})();

const routeOf = (file) => file
  .replace(/^src\/app/, '')
  .replace(/\/(page|layout|template|error|loading|not-found)\.tsx?$/, '')
  .replace(/\/\([^/]+\)/g, '')     // route groups (marketing) are not URL segments
  || '/';

const isBuiltRoute = (r) => {
  if (/\/_[^/]+/.test(r)) return false;         // Next.js never routes a private `_folder`
  if (builtRoutes.size === 0) return true;      // no build to compare against
  if (r === '/' || builtRoutes.has(r)) return true;
  // dynamic segment: /quests/[id] ships if /quests does
  const stripped = r.replace(/\/\[[^\]]+\]/g, '');
  return stripped === '/' || builtRoutes.has(stripped);
};

function resolveImport(spec, fromFile) {
  if (!spec.startsWith('.') && !spec.startsWith('@/')) return null;   // node_modules
  const base = spec.startsWith('@/')
    ? 'src/' + spec.slice(2)
    : path.posix.normalize(path.posix.join(path.posix.dirname(fromFile), spec));
  for (const cand of [base + '.ts', base + '.tsx', base + '/index.ts', base + '/index.tsx', base]) {
    if (SOURCES.includes(cand)) return cand;
  }
  return null;
}

const IMPORT_RE = /(?:from\s*|import\s*\(\s*)['"]([^'"]+)['"]/g;
const roots = SOURCES.filter((f) =>
  /^src\/app\/.*\/(page|layout)\.tsx?$/.test(f) || f === 'src/app/layout.tsx');
const reachableRoots = roots.filter((f) => isBuiltRoute(routeOf(f)));
const reachable = new Set();
{
  const queue = [...reachableRoots];
  while (queue.length) {
    const f = queue.pop();
    if (reachable.has(f)) continue;
    reachable.add(f);
    for (const m of read(f).matchAll(IMPORT_RE)) {
      const r = resolveImport(m[1], f);
      if (r && !reachable.has(r)) queue.push(r);
    }
  }
}
const unbuiltPages = roots.filter((f) => !isBuiltRoute(routeOf(f)));

// ── 1. every /api path the client calls ─────────────────────────────────────
const DIRECT_RE = /(?:fetch|api\.(?:get|post|put|patch|delete))\s*\(\s*([`'"])(\/api\/[^`'"]*)\1/g;
const ANY_RE = /([`'"])(\/api\/[a-zA-Z0-9_\-./[\]:${}]*)\1/g;

// ── 0b. dead exports inside reachable files ────────────────────────────────
// Reachability above is per-file, which over-reports: src/lib/api/hooks.ts is
// imported by several live pages, so every API call in it looked live. But
// usePersonality, useMarkRead and the exam hooks are referenced by nothing
// outside that file. A call inside an export nobody imports is as dead as a
// call inside an unbuilt page.
const identifierFiles = new Map(); // identifier -> Set(files mentioning it)
for (const f of SOURCES) {
  for (const m of read(f).matchAll(/\b[A-Za-z_$][\w$]*\b/g)) {
    if (!identifierFiles.has(m[0])) identifierFiles.set(m[0], new Set());
    identifierFiles.get(m[0]).add(f);
  }
}
const usedOutside = (name, file) => {
  const files = identifierFiles.get(name);
  if (!files) return false;
  for (const f of files) if (f !== file && reachable.has(f)) return true;
  return false;
};

/** Char ranges in `file` belonging to exported symbols nothing else references. */
function deadExportRanges(file) {
  const src = read(file);
  const ranges = [];
  const re = /export\s+(?:async\s+)?(?:function|const|class)\s+([A-Za-z_$][\w$]*)/g;
  for (const m of src.matchAll(re)) {
    if (usedOutside(m[1], file)) continue;
    const open = src.indexOf('{', m.index);
    if (open < 0) continue;
    const end = matchPair(src, open, '{', '}');
    if (end > open) ranges.push({ name: m[1], start: m.index, end });
  }
  return ranges;
}
const deadRangeCache = new Map();
const inDeadExport = (file, idx) => {
  if (!deadRangeCache.has(file)) deadRangeCache.set(file, deadExportRanges(file));
  return deadRangeCache.get(file).some((r) => idx >= r.start && idx <= r.end);
};

const callSites = new Map();
const addCall = (raw, file, line, direct, idx) => {
  const p = raw.split('?')[0]
    .replace(/\$\{[^}]*\}/g, ':param')
    // `/api/x${qs}` where the interpolation supplies the query string leaves a
    // spurious ":param" glued to the last segment — that is not a path segment.
    .replace(/(?<!\/):param$/, '')
    .replace(/\/+$/, '');
  if (!p || p === '/api' || /[*\s]/.test(p)) return;
  if (!callSites.has(p)) callSites.set(p, { direct: [], indirect: [] });
  const live = reachable.has(file) && !inDeadExport(file, idx);
  callSites.get(p)[direct ? 'direct' : 'indirect'].push({ file, line, live });
};
for (const f of APP_CODE) {
  const src = read(f);
  const seen = new Set();
  for (const m of src.matchAll(DIRECT_RE)) { addCall(m[2], f, lineOf(src, m.index), true, m.index); seen.add(m.index + 1); }
  for (const m of src.matchAll(ANY_RE)) { if (!seen.has(m.index)) addCall(m[2], f, lineOf(src, m.index), false, m.index); }
}

// ── 2. layer 1: interceptor exemptions ──────────────────────────────────────
const bypassed = [...read(INTERCEPTOR).matchAll(/!url\.includes\(\s*['"]([^'"]+)['"]\s*\)/g)].map((m) => m[1]);

// ── 3. layer 2: preferLive prefixes (always fail under static hosting) ──────
const clientSrc = read(CLIENT);
// The list was a single inline boolean expression; it is now the named
// LIVE_API_PREFIXES array, which is the dial used to move features off the
// browser shim one at a time. Read either shape so this keeps working.
const preferLiveBlock =
  clientSrc.match(/const\s+LIVE_API_PREFIXES[^=]*=\s*\[([\s\S]*?)\]/) ||
  clientSrc.match(/const\s+preferLive\s*=([^;]+);/);
const preferLive = preferLiveBlock
  ? [...preferLiveBlock[1].matchAll(/['"](\/api\/[^'"]*)['"]/g)].map((m) => m[1])
  : [];

// ── 4. service methods: does this specific call persist anything? ───────────
const serviceDb = new Map(); // "hostelService.getStats" -> bool
for (const f of SOURCES.filter((x) => x.startsWith('src/lib/services/'))) {
  const src = read(f);
  const base = path.basename(f, '.ts');
  const fileTouches = DB_RE.test(src);
  serviceDb.set(base, fileTouches);
  const methodRe = /(?:^|\n)\s*(?:async\s+)?([a-zA-Z_$][\w$]*)\s*\([^)]*\)\s*(?::[^{]+)?\{/g;
  for (const m of src.matchAll(methodRe)) {
    const open = src.indexOf('{', m.index + m[0].length - 1);
    const end = matchPair(src, open, '{', '}');
    if (end < 0) continue;
    serviceDb.set(base + '.' + m[1], DB_RE.test(src.slice(open, end)));
  }
}

// ── 5. layer 3: campusFallback switch ───────────────────────────────────────
const campusSrc = readIfExists(CAMPUS);
const campusPrefixes = (() => {
  const m = campusSrc.match(/const\s+CAMPUS_PREFIXES\s*=\s*\[([\s\S]*?)\]/);
  return m ? [...m[1].matchAll(/['"]([^'"]+)['"]/g)].map((x) => x[1]) : [];
})();
const isCampusApiPath = (p) => {
  if (!campusSrc) return false; // the campus switch was removed; nothing is routed through it
  if (p === '/api/communication/evaluate') return false;
  if (p.startsWith('/api/communication')) return true;
  return campusPrefixes.some((x) => p === x || p.startsWith(x + '/'));
};

const campusCases = new Map(); // path -> {line, verdict, delegate}
if (campusSrc) {
  const swIdx = campusSrc.search(/switch\s*\(\s*cleanPath\s*\)/);
  const open = campusSrc.indexOf('{', swIdx);
  const end = matchPair(campusSrc, open, '{', '}');
  const body = campusSrc.slice(open, end);
  const bodyOffset = open;
  const caseRe = /case\s+['"]([^'"]+)['"]\s*:/g;
  const hits = [...body.matchAll(caseRe)];
  for (let i = 0; i < hits.length; i++) {
    // stacked `case A: case B: <body>` share one body
    let j = i;
    while (j + 1 < hits.length && body.slice(hits[j].index + hits[j][0].length, hits[j + 1].index).trim() === '') j++;
    const codeStart = hits[j].index + hits[j][0].length;
    const codeEnd = j + 1 < hits.length ? hits[j + 1].index : body.length;
    const code = body.slice(codeStart, codeEnd);
    const delegate = (code.match(/([a-zA-Z_$][\w$]*Service)\s*\.\s*([a-zA-Z_$][\w$]*)/) || []);
    const key = delegate[1] ? delegate[1] + '.' + delegate[2] : null;
    const touches = key
      ? (serviceDb.has(key) ? serviceDb.get(key) : !!serviceDb.get(delegate[1]))
      : DB_RE.test(code);
    const literalOnly = !delegate[1] && /return\s*\{/.test(code);
    // A handler that returns an explicit failure explaining it is unavailable
    // is behaving correctly, not faking data. The admin CSV/ERP tools say so
    // outright. That is a known limitation surfaced honestly, and grouping it
    // with handlers that invent numbers would misdirect the work.
    const declines = /\bok\s*:\s*false\b/.test(code) && /\berror\s*:/.test(code);
    campusCases.set(hits[i][1], {
      line: lineOf(campusSrc, bodyOffset + hits[i].index),
      verdict: touches ? 'REAL' : declines ? 'DECLINED' : literalOnly ? 'STUB' : 'COMPUTE',
      delegate: key,
    });
    if (j > i) { for (let k = i; k <= j; k++) campusCases.set(hits[k][1], campusCases.get(hits[i][1])); i = j; }
  }
}

// ── 6. layer 4: firestoreRouter guards ──────────────────────────────────────
const ROUTER_FILE = 'src/lib/api/legacyFirestoreRouter.ts';
const routerSrc = readIfExists(ROUTER_FILE);
const routerStart = routerSrc ? routerSrc.search(/(async\s+)?function\s+firestoreRouter/) : -1;
if (routerSrc && routerStart < 0) throw new Error('firestoreRouter not found in ' + ROUTER_FILE);
const routerBodyOpen = routerSrc ? routerSrc.indexOf('{', routerStart) : 0;
const routerEnd = routerSrc ? matchPair(routerSrc, routerBodyOpen, '{', '}') : 0;

function compileCondition(cond) {
  let fn;
  try {
    fn = new Function('cleanPath', 'method', 'params', 'body', 'isCampusApiPath',
      'try { return !!(' + cond + '); } catch (e) { return null; }');
  } catch { return () => null; }
  return (p, m) => {
    try { return fn(p, m, new URLSearchParams(), {}, isCampusApiPath); } catch { return null; }
  };
}

// A handler that delegates to an imported helper reaches the database just as
// surely as one that calls supabase directly — `return { ok, memory: await
// loadAvatarMemory(uid) }` is not a canned literal. Resolve which imported
// symbols are datastore-backed so delegating handlers are not misread as stubs.
const dbBackedSymbols = new Set();
{
  const moduleTouches = new Map();
  const touches = (file, depth = 0) => {
    if (moduleTouches.has(file)) return moduleTouches.get(file);
    if (depth > 3) return false;
    moduleTouches.set(file, false); // guard against import cycles
    const src = read(file);
    let hit = DB_RE.test(src);
    if (!hit) {
      for (const m of src.matchAll(IMPORT_RE)) {
        const dep = resolveImport(m[1], file);
        if (dep && touches(dep, depth + 1)) { hit = true; break; }
      }
    }
    moduleTouches.set(file, hit);
    return hit;
  };
  const allImportsSrc = clientSrc + '\n' + routerSrc;
  for (const m of allImportsSrc.matchAll(/import\s*\{([^}]+)\}\s*from\s*['"]([^'"]+)['"]/g)) {
    const dep = resolveImport(m[2], ROUTER_FILE) || resolveImport(m[2], CLIENT);
    if (!dep || !touches(dep)) continue;
    for (const raw of m[1].split(',')) {
      const name = raw.trim().split(/\s+as\s+/).pop().trim();
      if (/^[A-Za-z_$][\w$]*$/.test(name)) dbBackedSymbols.add(name);
    }
  }
}
const DB_SYMBOL_RE = dbBackedSymbols.size
  ? new RegExp('\\b(' + [...dbBackedSymbols].join('|') + ')\\s*\\(')
  : null;
const reachesDb = (body) => DB_RE.test(body) || (DB_SYMBOL_RE ? DB_SYMBOL_RE.test(body) : false);

const guards = [];
{
  const seen = [];
  const re = /\bif\s*\(/g;
  let m;
  while ((m = re.exec(routerSrc))) {
    if (m.index < routerBodyOpen) continue;
    if (m.index > routerEnd) break;
    if (seen.some(([a, b]) => m.index > a && m.index < b)) continue;
    const parenOpen = m.index + m[0].length - 1;
    const parenClose = matchPair(routerSrc, parenOpen, '(', ')');
    if (parenClose < 0) continue;
    const cond = routerSrc.slice(parenOpen + 1, parenClose);
    if (!cond.includes('cleanPath')) continue;

    let i = parenClose + 1;
    while (i < routerEnd && /\s/.test(routerSrc[i])) i++;
    const bodyEnd = routerSrc[i] === '{' ? matchPair(routerSrc, i, '{', '}') + 1 : statementEnd(routerSrc, i);
    const body = routerSrc.slice(i, bodyEnd);
    seen.push([m.index, bodyEnd]);

    const touchesDB = reachesDb(body);
    const throwsOnly = /^\s*\{?\s*(?:\/\/[^\n]*\n\s*)*throw\s+new\s+ApiError/.test(body) && !touchesDB;
    const literalMatch = body.match(/return\s*(\{[\s\S]*|\[[\s\S]*)$/);
    const verdict = touchesDB ? 'REAL'
      : throwsOnly ? 'THROWS'
      : LOCAL_RE.test(body) ? 'LOCAL-STORE'
      : EXT_RE.test(body) ? 'EXTERNAL'
      : literalMatch ? 'STUB'
      : 'COMPUTE';

    guards.push({
      idx: guards.length,
      line: lineOf(routerSrc, m.index),
      cond: cond.replace(/\s+/g, ' ').slice(0, 200),
      verdict,
      bodyLines: body.split('\n').length,
      returns: verdict === 'STUB' ? literalMatch[1].replace(/\s+/g, ' ').slice(0, 180) : undefined,
      test: compileCondition(cond),
    });
    re.lastIndex = bodyEnd;
  }
}

// ── 7. the dead route files (the specification for each fix) ────────────────
const routeSpecs = new Map();
for (const f of SOURCES) {
  const m = f.match(/^src\/app(\/api\/.*)\/route\.tsx?$/);
  if (!m) continue;
  const src = read(f);
  // Secrets are usually reached through a helper, not read in the route file.
  // portfolio/verify-exam looked portable because its HMAC signing key lives in
  // lib/portfolio/examToken.ts. Porting that to the browser would ship the
  // service-role key and the answer key with it, so follow imports before
  // calling anything bucket A.
  const SECRET_RE = /process\.env\.([A-Z0-9_]*(?:KEY|SECRET|TOKEN|PASSWORD|CREDENTIAL)[A-Z0-9_]*)/g;
  const secretsIn = (text) => [...text.matchAll(SECRET_RE)]
    .map((x) => x[1])
    .filter((n) => !n.startsWith('NEXT_PUBLIC_')); // public by design, not a secret

  // Authentication is the one thing the browser legitimately does another way:
  // a Supabase session plus row-level security, instead of a service-role key.
  // Nearly every route imports requireAuth, so counting that as "needs a
  // server" would mark the whole API bucket B and say nothing useful. Only a
  // secret needed for the handler's actual work disqualifies it.
  const AUTH_HELPERS = /^src\/lib\/server\//;

  const secrets = new Set(secretsIn(src));
  const secretVia = new Map();
  let authGated = AUTH_HELPERS.test(f);
  const seenDeps = new Set([f]);
  const queue = [f];
  while (queue.length) {
    const cur = queue.pop();
    for (const im of read(cur).matchAll(IMPORT_RE)) {
      const dep = resolveImport(im[1], cur);
      if (!dep || seenDeps.has(dep)) continue;
      seenDeps.add(dep);
      if (AUTH_HELPERS.test(dep)) { authGated = true; continue; } // don't walk into auth
      queue.push(dep);
      for (const s of secretsIn(read(dep))) {
        if (!secrets.has(s)) secretVia.set(s, dep);
        secrets.add(s);
      }
    }
  }

  // `export async function GET`, `export function GET`, `export const GET =`, `export { GET } from '…'`
  const exported = new Set([
    ...[...src.matchAll(/export\s+(?:async\s+)?function\s+([A-Z]+)\b/g)].map((x) => x[1]),
    ...[...src.matchAll(/export\s+(?:const|let|var)\s+([A-Z]+)\s*[=:]/g)].map((x) => x[1]),
    ...[...src.matchAll(/export\s*\{([^}]*)\}/g)].flatMap((x) => x[1].split(',').map((s) => s.trim().split(/\s+as\s+/).pop())),
  ]);
  routeSpecs.set(m[1].replace(/\[\.\.\.(\w+)\]/g, ':$1*').replace(/\[(\w+)\]/g, ':$1'), {
    file: f,
    lines: src.split('\n').length,
    methods: METHODS.filter((x) => exported.has(x)),
    usesSecret: secrets.size > 0,
    secrets: [...secrets],
    secretVia: Object.fromEntries(secretVia),
    authGated,
  });
}

// The route file that serves a called path. `:param` in the called path is an
// interpolation, so it can stand for any one segment; the most specific route
// wins (static segment > [param] > [...catchAll]), as in Next.js.
function serverRoute(p) {
  const call = p.split('/').filter(Boolean);
  let best = null, bestScore = -1;
  for (const [key, spec] of routeSpecs) {
    const route = key.split('/').filter(Boolean);
    let score = 0;
    for (let i = 0; i < route.length && score >= 0; i++) {
      const r = route[i], c = call[i];
      if (r.endsWith('*')) { if (i >= call.length) score = -1; break; }
      if (c === undefined) score = -1;
      else if (r.startsWith(':')) score += 2;
      else if (c === ':param') score += 1;
      else if (c === r) score += 3;
      else score = -1;
    }
    if (score >= 0 && !route[route.length - 1]?.endsWith('*') && route.length !== call.length) score = -1;
    if (score > bestScore) { best = spec; bestScore = score; }
  }
  return best;
}

// ── 8. resolve a path ───────────────────────────────────────────────────────
// Every /api/* call now goes to the server, so after the (now empty) legacy
// browser layers the answer is the route under src/app/api, if there is one.
const reachedGuards = new Set();
function resolve(p, method) {
  if (bypassed.some((b) => p.includes(b))) {
    return { layer: 'interceptor-bypass', verdict: 'BYPASSES-SHIM', where: INTERCEPTOR };
  }
  if (isCampusApiPath(p)) {
    const c = campusCases.get(p);
    return c
      ? { layer: 'campusFallback', verdict: c.verdict, where: 'campusFallback.ts:' + c.line, delegate: c.delegate }
      : { layer: 'campusFallback', verdict: 'CAMPUS-404', where: 'campusFallback.ts default: throws' };
  }
  for (const g of guards) {
    const r = g.test(p, method);
    if (r === true) { reachedGuards.add(g.idx); return { layer: 'firestoreRouter', verdict: g.verdict, where: 'client.ts:' + g.line, returns: g.returns }; }
    if (r === null) { reachedGuards.add(g.idx); return { layer: 'firestoreRouter', verdict: g.verdict, where: 'client.ts:' + g.line, undecidable: true }; }
  }
  const route = serverRoute(p);
  if (route && route.methods.includes(method)) {
    return { layer: 'server', verdict: 'SERVER', where: route.file };
  }
  return route
    ? { layer: 'none', verdict: 'UNHANDLED-404', where: route.file + ' does not export ' + method }
    : { layer: 'none', verdict: 'UNHANDLED-404', where: 'no route under src/app/api' };
}

const RANK = ['UNHANDLED-404', 'CAMPUS-404', 'THROWS', 'BYPASSES-SHIM', 'STUB', 'DECLINED', 'LOCAL-STORE', 'COMPUTE', 'EXTERNAL', 'SERVER', 'REAL'];
const contracts = [...callSites.keys()].sort().map((p) => {
  const perMethod = {};
  for (const m of METHODS) perMethod[m] = resolve(p, m);
  // Guards are commonly written as `path === X && method === 'POST'`, so the
  // four methods nobody calls legitimately fall through to the 404 at the end
  // of the chain. Counting those as the headline verdict would report almost
  // every POST-only endpoint as missing. Judge a path by the methods that DO
  // reach a handler; only call it unhandled when none of them do.
  const handled = METHODS.filter((m) => perMethod[m].layer !== 'none');
  const verdicts = [...new Set((handled.length ? handled : METHODS).map((m) => perMethod[m].verdict))];
  const worst = RANK.find((v) => verdicts.includes(v)) || 'REAL';
  const spec = serverRoute(p);
  // B and C only came from the removed in-browser router's verdicts.
  const bucket = worst === 'REAL' || worst === 'SERVER' ? 'OK'
    : worst === 'EXTERNAL' || worst === 'COMPUTE' ? 'C'
    : worst === 'THROWS' ? 'B'
    : 'A';
  const sites = callSites.get(p);
  const allSites = sites.direct.concat(sites.indirect);
  const liveSites = allSites.filter((s) => s.live);
  return {
    path: p,
    reachable: liveSites.length > 0,
    liveCallSites: liveSites.length,
    status: verdicts.length === 1 ? verdicts[0] : 'MIXED',
    worst, bucket,
    // report the handler for a method that actually reaches one
    layer: (handled.length ? perMethod[handled[0]] : perMethod.GET).layer,
    handler: (handled.length ? perMethod[handled[0]] : perMethod.GET).where,
    handledMethods: handled,
    returns: METHODS.map((m) => perMethod[m].returns).find(Boolean),
    undecidable: METHODS.some((m) => perMethod[m].undecidable),
    preferLive: preferLive.some((x) => p.startsWith(x)),
    perMethod,
    callSites: sites.direct.concat(sites.indirect),
    directCalls: sites.direct.length,
    spec,
  };
});

// ── 9. emit ─────────────────────────────────────────────────────────────────
const counts = (a, k) => a.reduce((o, x) => { o[x[k]] = (o[x[k]] || 0) + 1; return o; }, {});
// DECLINED counts as working: the handler correctly reports that the feature
// needs a real server, rather than pretending to have done something.
const WORKING = new Set(['SERVER', 'REAL', 'EXTERNAL', 'COMPUTE', 'DECLINED', 'LOCAL-STORE']);
// A path can resolve differently per HTTP method (e.g. /api/vault/upload is
// REAL on POST and a stub on everything else). We do not extract the method
// from the call site, so separate "broken no matter how it is called" from
// "broken only on some methods" instead of over-reporting both as broken.
for (const c of contracts) {
  const handled = METHODS.filter((m) => c.perMethod[m].layer !== 'none');
  const judged = handled.length ? handled : METHODS;
  c.brokenOn = judged.filter((m) => !WORKING.has(c.perMethod[m].verdict));
  c.okOn = judged.filter((m) => WORKING.has(c.perMethod[m].verdict));
  c.severity = c.brokenOn.length === 0 ? 'OK'
    : c.okOn.length === 0 ? 'BROKEN'
    : 'PARTIAL';
}
// Only defects a visitor can actually hit are work. The rest is dead code.
const broken = contracts.filter((c) => c.severity === 'BROKEN' && c.reachable);
const partial = contracts.filter((c) => c.severity === 'PARTIAL' && c.reachable);
const deadDefects = contracts.filter((c) => c.severity !== 'OK' && !c.reachable);
const unreached = guards.filter((g) => !reachedGuards.has(g.idx)).map(({ test, ...g }) => g);

// ── feature verticals ───────────────────────────────────────────────────────
// Derived from the path, not hand-maintained, so the rollup cannot drift out
// of sync with the code. A vertical is the unit of work: one page group, one
// set of handlers, one session.
const verticalOf = (p) => {
  const s = p.split('/').filter(Boolean); // ['api', 'v1', 'auth', ...]
  return s[1] === 'v1' ? 'v1-' + (s[2] || '') : (s[1] || 'root');
};
const verticals = {};
for (const c of contracts) {
  const v = verticalOf(c.path);
  (verticals[v] = verticals[v] || { name: v, total: 0, broken: 0, partial: 0, ok: 0, dead: 0, buckets: {}, paths: [] });
  verticals[v].total++;
  const slot = c.severity === 'OK' ? 'ok' : !c.reachable ? 'dead' : c.severity === 'BROKEN' ? 'broken' : 'partial';
  verticals[v][slot]++;
  if (slot === 'broken' || slot === 'partial') {
    verticals[v].buckets[c.bucket] = (verticals[v].buckets[c.bucket] || 0) + 1;
    verticals[v].paths.push({ path: c.path, severity: c.severity, worst: c.worst, bucket: c.bucket, handler: c.handler });
  }
}
const verticalList = Object.values(verticals).sort((a, b) =>
  (b.broken + b.partial) - (a.broken + a.partial) || a.name.localeCompare(b.name));

const summary = {
  generated: new Date().toISOString(),
  appCodeFiles: APP_CODE.length,
  verticals: verticalList.length,
  verticalsWithDefects: verticalList.filter((v) => v.broken + v.partial > 0).length,
  clientCalledPaths: contracts.length,
  reachablePaths: contracts.filter((c) => c.reachable).length,
  brokenOnEveryMethod: broken.length,
  brokenOnSomeMethods: partial.length,
  defectsInDeadCode: deadDefects.length,
  unbuiltPages: unbuiltPages.length,
  reachableSourceFiles: reachable.size,
  guardBranches: guards.length,
  unreachableOrDynamicGuards: unreached.length,
  campusSwitchCases: campusCases.size,
  campusPrefixes: campusPrefixes.length,
  deadRouteFiles: routeSpecs.size,
  interceptorBypasses: bypassed,
  preferLivePrefixes: preferLive.length,
  needsManualCheck: contracts.filter((c) => c.undecidable).length,
  byWorst: counts(contracts, 'worst'),
  byBucket: counts(contracts, 'bucket'),
  byLayer: counts(contracts, 'layer'),
  guardsByVerdict: counts(guards, 'verdict'),
};

fs.writeFileSync(path.join(ROOT, 'audit/contracts.json'), JSON.stringify({
  summary, verticals: verticalList, contracts, unreachableOrDynamicGuards: unreached,
  guards: guards.map(({ test, ...g }) => g),
}, null, 2));

// ── audit/LEDGER.md — the work queue, one row per vertical ──────────────────
// Regenerated every run. Status lives in git history and in the per-vertical
// findings files, not here, so this file can always be rebuilt from the code.
const B = (v) => Object.entries(v.buckets).sort().map(([k, n]) => k + ':' + n).join(' ');
fs.writeFileSync(path.join(ROOT, 'audit/LEDGER.md'), [
  '# Work ledger — generated, do not hand-edit',
  '',
  'Regenerate: `node audit/extract-contracts.mjs`. Status is not stored here —',
  'it is derived from the code, so a vertical leaves this list by being fixed.',
  '',
  'A **vertical** is one session of work: the pages and the routes under',
  '`src/app/api/` that serve them.',
  '',
  '**Bucket** — `A` no server route answers the path (or none exports the method):',
  'add the route under `src/app/api/`, or fix the caller.',
  '',
  '## Remaining (' + verticalList.filter((v) => v.broken + v.partial > 0).length + ' verticals, '
    + broken.length + ' broken + ' + partial.length + ' partial paths)',
  '',
  '| vertical | broken | partial | ok | dead | buckets |',
  '|---|---|---|---|---|---|',
  verticalList.filter((v) => v.broken + v.partial > 0)
    .map((v) => '| `' + v.name + '` | ' + v.broken + ' | ' + v.partial + ' | ' + v.ok + ' | ' + v.dead + ' | ' + B(v) + ' |')
    .join('\n'),
  '',
  '`dead` = the path is only called from code that is never built, so no visitor can',
  'reach it. Not work. ' + deadDefects.length + ' defective paths across the codebase are dead;',
  'they are listed at the end of this file.',
  '',
  '## Clean (' + verticalList.filter((v) => v.broken + v.partial === 0).length + ' verticals)',
  '',
  verticalList.filter((v) => v.broken + v.partial === 0)
    .map((v) => '`' + v.name + '` (' + v.ok + ')').join(' · '),
  '',
  '## Detail',
  '',
  verticalList.filter((v) => v.paths.length).map((v) => [
    '### ' + v.name + ' — ' + v.broken + ' broken, ' + v.partial + ' partial',
    '',
    '| path | severity | verdict | bucket | handler |',
    '|---|---|---|---|---|',
    v.paths.map((p) => '| `' + p.path + '` | ' + p.severity + ' | ' + p.worst + ' | ' + p.bucket + ' | ' + p.handler + ' |').join('\n'),
    '',
  ].join('\n')).join('\n'),
  '',
  '## Defects in dead code — do not fix (' + deadDefects.length + ')',
  '',
  'Every call site for these lives in a file no built page imports. Fixing them',
  'changes nothing a visitor can see. Delete the callers, or leave them.',
  '',
  deadDefects.length
    ? deadDefects.map((c) => '- `' + c.path + '` (' + c.worst + ') — called from '
        + [...new Set(c.callSites.map((s) => s.file))].slice(0, 3).join(', ')).join('\n')
    : '_none_',
  '',
  unbuiltPages.length ? [
    '## Page files that are never built (' + unbuiltPages.length + ')',
    '',
    unbuiltPages.map((f) => '- `' + f + '`').join('\n'),
    '',
  ].join('\n') : '',
].join('\n'));

const row = (c) => '| `' + c.path + '` | ' + c.worst + ' | ' + c.bucket + ' | ' + c.layer + ' | '
  + c.handler + ' | ' + (c.spec ? c.spec.file.replace('src/app', '') : '—') + ' | '
  + c.directCalls + '/' + c.callSites.length + ' |';
const HEAD = '| path | verdict | bucket | layer | handler | spec route | direct/total |\n|---|---|---|---|---|---|---|';

fs.writeFileSync(path.join(ROOT, 'audit/CONTRACTS.md'), [
  '# Contract map — generated, do not hand-edit',
  '', 'Regenerate: `node audit/extract-contracts.mjs`', '',
  Object.entries(summary).map(([k, v]) => '- **' + k + '**: ' + (typeof v === 'object' ? JSON.stringify(v) : v)).join('\n'),
  '',
  '**Verdict** — `SERVER` a route under `src/app/api/` exports the method',
  '· `UNHANDLED-404` no route serves the path, or the route does not export the method.',
  'Methods are not read from call sites here; `npm run audit:contracts` runs',
  '`scripts/verify/verify_api_parity.ts` next, which checks each call\'s method.',
  '',
  '**Bucket** — `OK` a server route answers it · `A` nothing does: add the route or fix the caller.',
  '',
  '## Broken no matter how they are called (' + broken.length + ')',
  '', HEAD, broken.map(row).join('\n'), '',
  '## Broken only on some methods (' + partial.length + ')',
  '',
  'These resolve to a working handler for at least one HTTP method. Confirm which',
  'method the call site actually uses before treating one as a defect.',
  '',
  partial.map((c) => '- `' + c.path + '` — broken on ' + c.brokenOn.join(', ')
    + '; works on ' + c.okOn.join(', ')).join('\n'), '',
  '## All paths (' + contracts.length + ')',
  '', HEAD, contracts.map(row).join('\n'), '',
].join('\n'));

console.log(JSON.stringify(summary, null, 2));
console.log('\nwrote audit/contracts.json and audit/CONTRACTS.md');
