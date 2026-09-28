// scripts/verify/verify_api_parity.ts
// Client ↔ server API parity check (`npm run audit:contracts`).
//
// Every /api/* call the browser makes goes to the app's own server routes under src/app/api:
// request() in src/lib/api/client.ts sends it over the network, and fetch('/api/…') goes there
// directly (src/lib/fetchInterceptor.ts only attaches the auth header). There is no in-browser
// fallback any more, so a client call only works if a route file serves that path and exports the
// HTTP method the caller uses. This script reports:
//
//   1. client calls with no matching route under src/app/api          → fails the check
//   2. client calls using a method the matched route does not export  → fails the check
//   3. the same two problems in code no page can reach (e.g. src/app/_legacy, a private folder
//      Next.js never routes)                                          → listed, does not fail
//   4. server routes no client code names (cron jobs, webhooks, calls from outside the app)
//                                                                     → listed, does not fail

import fs from 'fs';
import path from 'path';

const ROOT = path.resolve(__dirname, '..', '..');
const METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] as const;
type Method = (typeof METHODS)[number];

// Not client call sites: the server routes themselves, the API client (its path handling is
// generic), and course content that quotes example API paths as teaching material.
const NOT_CLIENT_CODE = [
  'src/app/api/',
  'src/lib/api/client.ts',
  'src/lib/fetchInterceptor.ts',
  'src/lib/data/',
  'src/lib/curriculum/',
];

const read = (file: string): string => fs.readFileSync(path.join(ROOT, file), 'utf8');

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true })) {
    const child = `${dir}/${entry.name}`;
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules') walk(child, out);
    } else if (/\.(ts|tsx|js|jsx)$/.test(entry.name)) {
      out.push(child);
    }
  }
  return out;
}

const lineOf = (src: string, index: number): number => src.slice(0, index).split('\n').length;

// ── server routes ────────────────────────────────────────────────────────────

interface Route {
  file: string;
  segments: string[]; // e.g. ['api', 'users', '[id]']
  methods: Set<string>;
}

function exportedMethods(src: string): Set<string> {
  const found = new Set<string>();
  for (const m of src.matchAll(/export\s+(?:async\s+)?function\s+([A-Z]+)\b/g)) found.add(m[1]);
  for (const m of src.matchAll(/export\s+(?:const|let|var)\s+([A-Z]+)\s*[=:]/g)) found.add(m[1]);
  // export { GET, POST } from '…'  /  export { handler as GET }
  for (const m of src.matchAll(/export\s*\{([^}]*)\}/g)) {
    for (const part of m[1].split(',')) {
      const name = part.trim().split(/\s+as\s+/).pop()?.trim();
      if (name) found.add(name);
    }
  }
  return new Set([...found].filter((name) => (METHODS as readonly string[]).includes(name)));
}

function loadRoutes(sources: string[]): Route[] {
  const routes: Route[] = [];
  for (const file of sources) {
    const m = file.match(/^src\/app\/(api(?:\/.*)?)\/route\.(?:ts|tsx|js)$/);
    if (!m) continue;
    const segments = m[1].split('/').filter((s) => !/^\(.*\)$/.test(s)); // (group) is not a URL segment
    routes.push({ file, segments, methods: exportedMethods(read(file)) });
  }
  return routes;
}

/** Specificity score if `route` serves `callSegs`, else -1. Static beats [param] beats [...catchAll]. */
function matchScore(callSegs: string[], routeSegs: string[]): number {
  let score = 0;
  for (let i = 0; i < routeSegs.length; i++) {
    const r = routeSegs[i];
    if (/^\[\[\.\.\..+\]\]$/.test(r)) return score;                               // optional catch-all: 0+ segments
    if (/^\[\.\.\..+\]$/.test(r)) return i < callSegs.length ? score : -1;        // catch-all: 1+ segments
    if (i >= callSegs.length) return -1;
    const c = callSegs[i];
    if (/^\[.+\]$/.test(r)) { score += 2; continue; }                             // [param]: any one segment
    if (c === ':param') { score += 1; continue; }                                 // caller interpolates a static segment
    if (c !== r) return -1;
    score += 3;
  }
  return callSegs.length === routeSegs.length ? score : -1;
}

function findRoute(callPath: string, routes: Route[]): Route | null {
  const callSegs = callPath.split('/').filter(Boolean);
  let best: Route | null = null;
  let bestScore = -1;
  for (const route of routes) {
    const score = matchScore(callSegs, route.segments);
    if (score > bestScore) { best = route; bestScore = score; }
  }
  return best;
}

// ── client call sites ────────────────────────────────────────────────────────

interface CallSite {
  path: string;
  method: Method | null; // null: the path is named but the method can't be read from the code
  file: string;
  index: number;
  line: number;
  direct: boolean; // api.get()/fetch() with the path as a literal first argument
}

function normalisePath(raw: string): string | null {
  let p = raw;
  // A quote inside an interpolation (`/api/x/${id || 'me'}`) cuts the literal off mid-`${`.
  const open = p.lastIndexOf('${');
  if (open >= 0 && p.indexOf('}', open) < 0) p = p.slice(0, open) + ':param';
  p = p.split('?')[0].split('#')[0]
    .replace(/\$\{[^}]*\}/g, ':param')
    // `/api/x${qs}` — the interpolation supplies the query string, not a path segment
    .replace(/(?<!\/):param$/, '')
    .replace(/\/+$/, '');
  if (!p || p === '/api' || /[\s*]/.test(p)) return null;
  return p;
}

/** Text of a call's argument list, starting just after the opening parenthesis. */
function argsText(src: string, openParen: number): string {
  let depth = 0;
  for (let i = openParen; i < src.length && i < openParen + 4000; i++) {
    if (src[i] === '(') depth++;
    else if (src[i] === ')' && --depth === 0) return src.slice(openParen + 1, i);
  }
  return src.slice(openParen + 1, openParen + 4000);
}

function fetchMethod(args: string): Method | null {
  const m = args.match(/\bmethod\s*:\s*(?:(['"`])([A-Za-z]+)\1|([^,}\n]+))/);
  if (!m) return 'GET';
  if (!m[2]) return null; // method comes from a variable
  const verb = m[2].toUpperCase();
  return (METHODS as readonly string[]).includes(verb) ? (verb as Method) : null;
}

function collectCalls(file: string): CallSite[] {
  const src = read(file);
  const calls: CallSite[] = [];
  const claimed = new Set<number>(); // index of the opening quote of literals already recorded

  const add = (raw: string, quoteIndex: number, method: Method | null, direct: boolean) => {
    const p = normalisePath(raw);
    claimed.add(quoteIndex);
    if (p) calls.push({ path: p, method, file, index: quoteIndex, line: lineOf(src, quoteIndex), direct });
  };

  const API_RE = /\bapi\.(get|post|put|patch|delete)\s*(?:<[^()]*?>)?\s*\(\s*([`'"])(\/api\/[^`'"]*)\2/g;
  for (const m of src.matchAll(API_RE)) {
    add(m[3], m.index! + m[0].length - m[3].length - 2, m[1].toUpperCase() as Method, true);
  }
  const FETCH_RE = /\bfetch\s*\(\s*([`'"])(\/api\/[^`'"]*)\1/g;
  for (const m of src.matchAll(FETCH_RE)) {
    const paren = src.indexOf('(', m.index!);
    add(m[2], m.index! + m[0].length - m[2].length - 2, fetchMethod(argsText(src, paren)), true);
  }
  // Any other literal naming an /api path (handed to a helper, EventSource, sendBeacon, …).
  const ANY_RE = /([`'"])(\/api\/[a-zA-Z0-9_\-./[\]:${}?=&]*)\1/g;
  for (const m of src.matchAll(ANY_RE)) {
    if (!claimed.has(m.index!)) add(m[2], m.index!, null, false);
  }
  return calls;
}

// ── reachability ─────────────────────────────────────────────────────────────
// A call in a file no page imports is dead code, not a broken feature. Next.js never routes a
// folder whose name starts with "_" (src/app/_legacy), so its pages are not roots.

function resolveImport(spec: string, fromFile: string, known: Set<string>): string | null {
  if (!spec.startsWith('.') && !spec.startsWith('@/')) return null;
  const base = spec.startsWith('@/')
    ? `src/${spec.slice(2)}`
    : path.posix.normalize(path.posix.join(path.posix.dirname(fromFile), spec));
  for (const ext of ['', '.ts', '.tsx', '.js', '.jsx', '/index.ts', '/index.tsx', '/index.js']) {
    if (known.has(base + ext)) return base + ext;
  }
  return null;
}

const ROUTE_ENTRY_RE = /\/(page|layout|template|error|global-error|loading|not-found|default)\.(tsx?|jsx?)$/;
const isPrivate = (file: string) => /\/_[^/]+\//.test(file.slice('src/app'.length));

/** For each file: the names other reachable files import from it ('*' = all of them). */
function importGraph(sources: string[]) {
  const known = new Set(sources);
  const roots = sources.filter((f) =>
    (f.startsWith('src/app/') && !f.startsWith('src/app/api/') && ROUTE_ENTRY_RE.test(f) && !isPrivate(f))
    || /^src\/(middleware|instrumentation)\.(ts|js)$/.test(f));

  const reachable = new Set<string>();
  const imported = new Map<string, Set<string>>();
  const use = (file: string, name: string) => {
    if (!imported.has(file)) imported.set(file, new Set());
    imported.get(file)!.add(name);
  };
  roots.forEach((f) => use(f, '*')); // Next.js itself uses a route entry's exports

  const queue = [...roots];
  while (queue.length) {
    const file = queue.pop()!;
    if (reachable.has(file)) continue;
    reachable.add(file);
    const src = read(file);
    const follow = (spec: string, names: string[]) => {
      const dep = resolveImport(spec, file, known);
      if (!dep) return;
      names.forEach((n) => use(dep, n));
      if (!reachable.has(dep)) queue.push(dep);
    };
    // import X, { a, b as c } from '…'  /  export { a } from '…'  /  export * from '…'
    for (const m of src.matchAll(/\b(?:import|export)\s+(?:type\s+)?([^'";]*?)\s*from\s*['"]([^'"]+)['"]/g)) {
      const clause = m[1];
      const names: string[] = [];
      if (clause.includes('*')) names.push('*');
      const braces = clause.match(/\{([^}]*)\}/);
      if (braces) {
        for (const part of braces[1].split(',')) {
          const name = part.trim().replace(/^type\s+/, '').split(/\s+as\s+/)[0].trim();
          if (name) names.push(name);
        }
      }
      if (/^\s*[A-Za-z_$][\w$]*/.test(clause.replace(/^type\s+/, '')) && !clause.trim().startsWith('{')) names.push('default');
      follow(m[2], names);
    }
    // import '…' for side effects, import('…'), require('…'): treat every export as used
    for (const m of src.matchAll(/(?:\bimport\s*\(\s*|\brequire\s*\(\s*|\bimport\s+)['"]([^'"]+)['"]/g)) follow(m[1], ['*']);
  }
  return { reachable, imported };
}

// Reachability is per file, which over-reports: src/lib/api/hooks.ts is imported by live pages, but
// several of its hooks are imported by nothing. A call inside an export no reachable file imports
// (and no live export in the same file uses) is as dead as a call inside an unrouted page.
function liveCallFilter(sources: string[]): (call: CallSite) => boolean {
  const { reachable, imported } = importGraph(sources);
  const deadRanges = new Map<string, Array<[number, number]>>();

  const rangesFor = (file: string): Array<[number, number]> => {
    const cached = deadRanges.get(file);
    if (cached) return cached;
    const src = read(file);
    const used = imported.get(file) ?? new Set<string>();
    // A top-level declaration ends where the next line starts in column 0 (other than a closer).
    const topLevel = [...src.matchAll(/^(?![\s})\]]|$)/gm)].map((m) => m.index!);
    const decls = [...src.matchAll(/^export\s+(default\s+)?(?:async\s+)?(?:function\*?|const|let|class)?\s*([A-Za-z_$][\w$]*)?/gm)]
      .map((m) => ({
        name: m[1] ? 'default' : m[2] ?? '',
        start: m.index!,
        end: topLevel.find((i) => i > m.index!) ?? src.length,
      }));
    const live = new Set(decls.filter((d) => used.has('*') || used.has(d.name)));
    // An unimported export is still live if a live export in this file calls it.
    for (let changed = true; changed;) {
      changed = false;
      for (const d of decls) {
        if (live.has(d) || !d.name) continue;
        const word = new RegExp(`\\b${d.name.replace(/\$/g, '\\$')}\\b`);
        if ([...live].some((l) => word.test(src.slice(l.start, l.end)))) { live.add(d); changed = true; }
      }
    }
    const ranges = decls.filter((d) => !live.has(d)).map((d): [number, number] => [d.start, d.end]);
    deadRanges.set(file, ranges);
    return ranges;
  };

  return (call) => reachable.has(call.file)
    && !rangesFor(call.file).some(([start, end]) => call.index >= start && call.index < end);
}

// ── report ───────────────────────────────────────────────────────────────────

interface Problem {
  kind: 'no-route' | 'method';
  path: string;
  method: Method | null;
  route: Route | null;
  sites: CallSite[];
  live: boolean;
}

const where = (s: CallSite) => `${s.file}:${s.line}`;

function verifyApiParity(): number {
  console.log('========================================================================');
  console.log('🔍 CLIENT ↔ SERVER API PARITY');
  console.log('   every /api/* call must have a route under src/app/api that exports its method');
  console.log('========================================================================\n');

  const sources = walk('src');
  const routes = loadRoutes(sources);
  const isLive = liveCallFilter(sources);
  const clientFiles = sources.filter((f) => !NOT_CLIENT_CODE.some((x) => f === x || f.startsWith(x)));
  const calls = clientFiles.flatMap(collectCalls);
  const called = new Set<Route>();

  // Group by path + method so each defect is reported once with all its call sites.
  const problems = new Map<string, Problem>();
  let unknownMethod = 0;
  for (const call of calls) {
    const route = findRoute(call.path, routes);
    let kind: Problem['kind'] | null = null;
    if (!route) {
      // A bare literal that is only a prefix of real routes (`path.startsWith('/api/admin')`)
      // is not a call.
      const isPrefix = routes.some((r) => ('/' + r.segments.join('/')).startsWith(call.path + '/'));
      if (!call.direct && isPrefix) continue;
      kind = 'no-route';
    } else {
      called.add(route);
      if (call.method === null) unknownMethod++;
      else if (!route.methods.has(call.method)) kind = 'method';
    }
    if (!kind) continue;
    const key = `${kind} ${call.method ?? '*'} ${call.path}`;
    const problem = problems.get(key)
      ?? { kind, path: call.path, method: call.method, route, sites: [], live: false };
    problem.sites.push(call);
    problem.live ||= isLive(call);
    problems.set(key, problem);
  }

  const all = [...problems.values()].sort((a, b) => a.path.localeCompare(b.path));
  const live = all.filter((p) => p.live);
  const dead = all.filter((p) => !p.live);
  const noRoute = live.filter((p) => p.kind === 'no-route');
  const badMethod = live.filter((p) => p.kind === 'method');
  const uncalled = routes.filter((r) => !called.has(r)).map((r) => '/' + r.segments.join('/')).sort();
  const distinctPaths = new Set(calls.map((c) => c.path));

  const sitesOf = (p: Problem) => {
    const shown = p.sites.filter((s) => isLive(s) === p.live).slice(0, 3).map(where);
    const more = p.sites.length - shown.length;
    return shown.join(', ') + (more > 0 ? ` (+${more} more)` : '');
  };
  const describe = (p: Problem) => p.kind === 'no-route'
    ? `   - ${p.method ?? ''}${p.method ? ' ' : ''}${p.path}  ← ${sitesOf(p)}`
    : `   - ${p.method} ${p.path}: ${p.route!.file} exports ${[...p.route!.methods].join(', ') || 'no handlers'}  ← ${sitesOf(p)}`;

  console.log(`✅ ${routes.length} route files under src/app/api`);
  console.log(`✅ ${calls.length} client references to ${distinctPaths.size} distinct /api paths in ${clientFiles.length} files`);
  console.log(`   (${unknownMethod} name a routed path without a readable HTTP method; only the path is checked)\n`);

  if (noRoute.length) {
    console.error(`❌ Client calls with no server route (${noRoute.length}):`);
    noRoute.forEach((p) => console.error(describe(p)));
    console.error('');
  }
  if (badMethod.length) {
    console.error(`❌ Client calls using a method the route does not export (${badMethod.length}):`);
    badMethod.forEach((p) => console.error(describe(p)));
    console.error('');
  }
  if (dead.length) {
    console.log(`ℹ️  Same problems in code no page imports — dead code, not failing (${dead.length}):`);
    dead.forEach((p) => console.log(describe(p)));
    console.log('');
  }
  console.log(`ℹ️  Server routes no client code names — cron, webhooks, external callers (${uncalled.length}):`);
  console.log(uncalled.map((r) => `   - ${r}`).join('\n') || '   (none)');
  console.log('');

  console.log('────────────────────────────────────────────────────────────────────────');
  console.log(`❌ Calls with no route        : ${noRoute.length}`);
  console.log(`❌ Calls with wrong method    : ${badMethod.length}`);
  console.log(`ℹ️  Problems in dead code only : ${dead.length}`);
  console.log(`ℹ️  Routes with no client call : ${uncalled.length}`);
  console.log('────────────────────────────────────────────────────────────────────────\n');

  if (noRoute.length || badMethod.length) {
    console.error('🚨 PARITY CHECK FAILED: fix the caller\'s path/method, or add the route under src/app/api.');
    return 1;
  }
  console.log('🎉 Every reachable /api/* call has a server route that exports its method.');
  return 0;
}

try {
  process.exit(verifyApiParity());
} catch (err) {
  console.error('Fatal error running API parity check:', err);
  process.exit(1);
}
