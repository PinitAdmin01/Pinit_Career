#!/usr/bin/env node
/**
 * Read-only. Compares the response headers firebase.json sends in production
 * against what the application actually tries to do in the browser.
 *
 * This is a different defect class from audit/extract-contracts.mjs. The API
 * contract map asks "is there a handler and does it persist anything". This
 * asks "will the browser even allow the call". A Content-Security-Policy that
 * omits a host, or a Permissions-Policy that denies a device, produces exactly
 * the symptom of a stubbed handler — the feature silently does nothing — but
 * no amount of reading src/ will show it, because the cause is in firebase.json.
 *
 * On a Node host the src/middleware.ts headers would apply instead. Under
 * static Firebase hosting middleware does not run, so firebase.json is the
 * only thing setting headers.
 *
 * Outputs audit/HEADERS.md.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => { try { return fs.readFileSync(path.join(ROOT, p), 'utf8'); } catch { return ''; } };

// ── the policy actually served ──────────────────────────────────────────────
const firebaseJson = JSON.parse(read('firebase.json'));
const headerFor = (key) => {
  for (const block of firebaseJson.hosting.headers || []) {
    for (const h of block.headers || []) if (h.key.toLowerCase() === key.toLowerCase()) return h.value;
  }
  return null;
};
const csp = headerFor('Content-Security-Policy') || '';
const permissions = headerFor('Permissions-Policy') || '';
const directive = (name) => {
  const m = csp.match(new RegExp(name + '\\s+([^;]*)'));
  return m ? m[1].trim().split(/\s+/) : null;
};
const connectSrc = directive('connect-src') || [];

// ── what the app tries to reach ─────────────────────────────────────────────
function walk(dir, out = []) {
  for (const e of fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true })) {
    const rel = dir + '/' + e.name;
    if (e.isDirectory()) { if (e.name !== 'node_modules') walk(rel, out); }
    else if (/\.tsx?$/.test(e.name)) out.push(rel);
  }
  return out;
}
// Course content embeds documentation links that are not runtime calls.
const APP = walk('src').filter((f) => !f.startsWith('src/lib/data/') && !f.startsWith('src/lib/curriculum/'));

// Hosts configured through env vars are the ones the app calls at runtime;
// hardcoded https:// literals in app code are mostly prose and doc links.
// Only .env is inlined into the bundle at build time. .env.example is a
// template — its localhost placeholders are not production defects.
const envText = read('.env');
const envHosts = [];
const seenVar = new Set();
for (const m of envText.matchAll(/^(NEXT_PUBLIC_[A-Z0-9_]+)\s*=\s*(https?:\/\/[^\s/]+)/gm)) {
  if (seenVar.has(m[1])) continue;
  seenVar.add(m[1]);
  envHosts.push({ varName: m[1], origin: m[2] });
}
// Hosts reached from app code through a fetch()/new WebSocket() call.
const codeHosts = new Map();
for (const f of APP) {
  const src = read(f);
  for (const m of src.matchAll(/(?:fetch|WebSocket)\s*\(\s*[`'"](https?:\/\/[^`'"/]+)/g)) {
    if (!codeHosts.has(m[1])) codeHosts.set(m[1], f);
  }
}

const cspAllows = (origin) => {
  let host;
  try { host = new URL(origin).host; } catch { return true; }
  return connectSrc.some((src) => {
    if (src === "'self'" || src === '*') return src === '*';
    const bare = src.replace(/^(https?|wss?):\/\//, '').replace(/\/$/, '');
    if (bare.startsWith('*.')) return host.endsWith(bare.slice(1));
    return host === bare;
  });
};

// ── device permissions vs actual usage ──────────────────────────────────────
const deviceUse = { camera: [], microphone: [], geolocation: [] };
for (const f of APP) {
  const src = read(f);
  for (const m of src.matchAll(/getUserMedia\s*\(\s*(\{[\s\S]{0,120}?\})/g)) {
    if (/video\s*:/.test(m[1]) && !/video\s*:\s*false/.test(m[1])) deviceUse.camera.push(f);
    if (/audio\s*:/.test(m[1]) && !/audio\s*:\s*false/.test(m[1])) deviceUse.microphone.push(f);
  }
  if (/geolocation\s*\.\s*(getCurrentPosition|watchPosition)/.test(src)) deviceUse.geolocation.push(f);
}
const permissionAllows = (feature) => {
  const m = permissions.match(new RegExp(feature + '\\s*=\\s*\\(([^)]*)\\)'));
  if (!m) return true;                       // not mentioned -> default allow
  return m[1].trim().length > 0;             // "camera=()" is an empty allowlist
};

// ── findings ────────────────────────────────────────────────────────────────
const findings = [];

for (const { varName, origin } of envHosts) {
  if (/supabase|firebase/i.test(varName) && cspAllows(origin)) continue;
  if (origin.startsWith('http://')) {
    findings.push({
      severity: 'BROKEN', area: 'config', subject: varName,
      detail: 'points at ' + origin + '. A plaintext http:// origin is blocked as mixed content on an https site'
        + (/localhost|127\.0\.0\.1/.test(origin) ? ', and localhost does not exist for a visitor' : '') + '.',
      fix: 'Set ' + varName + ' to the deployed https origin, or remove the feature.',
    });
    continue;
  }
  if (!cspAllows(origin)) {
    findings.push({
      severity: 'BROKEN', area: 'csp', subject: varName,
      detail: origin + ' is not in connect-src, so every request to it is blocked by CSP before it leaves the browser.',
      fix: 'Add ' + origin + ' to connect-src in firebase.json.',
    });
  }
}
for (const [origin, file] of codeHosts) {
  if (envHosts.some((e) => e.origin === origin)) continue;
  if (!cspAllows(origin)) {
    findings.push({
      severity: 'BROKEN', area: 'csp', subject: origin,
      detail: 'called from ' + file + ' but not in connect-src, so the request is blocked by CSP.',
      fix: 'Add ' + origin + ' to connect-src in firebase.json, or route the call through the backend.',
    });
  }
}
for (const [feature, files] of Object.entries(deviceUse)) {
  const uniq = [...new Set(files)];
  if (uniq.length && !permissionAllows(feature)) {
    findings.push({
      severity: 'BROKEN', area: 'permissions-policy', subject: feature,
      detail: 'Permissions-Policy sends ' + feature + '=() — an empty allowlist disables it for the whole origin — '
        + 'but ' + uniq.length + ' file(s) request it: ' + uniq.slice(0, 6).join(', ') + (uniq.length > 6 ? ' …' : '') + '.',
      fix: 'Change ' + feature + '=() to ' + feature + '=(self) in the Permissions-Policy header in firebase.json'
        + ' (src/middleware.ts already intends this, but middleware does not run on static hosting).',
    });
  }
}

// Secrets shipped to the browser. NEXT_PUBLIC_ is inlined into the bundle at
// build time, so anyone who loads the site can read the value.
for (const m of envText.matchAll(/^(NEXT_PUBLIC_[A-Z0-9_]*(?:API_KEY|SECRET|TOKEN|PASSWORD)[A-Z0-9_]*)\s*=\s*(\S+)/gm)) {
  if (/SUPABASE_ANON_KEY|FIREBASE_API_KEY/.test(m[1])) continue; // designed to be public
  findings.push({
    severity: 'SECURITY', area: 'secrets', subject: m[1],
    detail: 'NEXT_PUBLIC_ variables are inlined into the JavaScript bundle at build time. This key is readable by '
      + 'anyone who opens the site, and usable until it is rotated.',
    fix: 'Move the call behind backend/ (NEXT_PUBLIC_BACKEND_URL), drop the NEXT_PUBLIC_ prefix, and rotate the key.',
  });
}

const bySeverity = findings.reduce((a, f) => { a[f.severity] = (a[f.severity] || 0) + 1; return a; }, {});
fs.writeFileSync(path.join(ROOT, 'audit/HEADERS.md'), [
  '# Hosting headers vs. what the app does — generated, do not hand-edit',
  '',
  'Regenerate: `node audit/check-headers.mjs`',
  '',
  'Under static Firebase hosting `src/middleware.ts` does not run, so `firebase.json`',
  'is the only thing setting response headers. A denied host or device produces the',
  'same symptom as a stubbed handler — the feature silently does nothing — but the',
  'cause is in `firebase.json`, not in `src/`.',
  '',
  '- **findings**: ' + findings.length + ' ' + JSON.stringify(bySeverity),
  '- **connect-src**: `' + (connectSrc.join(' ') || '(none)') + '`',
  '- **Permissions-Policy**: `' + (permissions || '(none)') + '`',
  '',
  findings.length ? findings.map((f, i) => [
    '## ' + (i + 1) + '. [' + f.severity + '] ' + f.area + ' — `' + f.subject + '`',
    '',
    f.detail,
    '',
    '**Fix:** ' + f.fix,
    '',
  ].join('\n')).join('\n') : '_No header-level defects found._',
].join('\n'));

console.log('findings: ' + findings.length + ' ' + JSON.stringify(bySeverity));
for (const f of findings) console.log('  [' + f.severity + '] ' + f.area + ' — ' + f.subject);
console.log('\nwrote audit/HEADERS.md');
