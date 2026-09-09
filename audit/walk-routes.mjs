#!/usr/bin/env node
/**
 * Loads every built route against a server that reproduces Firebase Hosting,
 * and records what the app actually does at runtime.
 *
 * Why a local server and not `npm run dev`: `next dev` executes the route
 * handlers in src/app/api/. Production does not — build.js copies
 * .next/server/app into out/ and firebase.json serves out/ statically with a
 * `**` -> /index.html rewrite, so every /api/* request comes back as an HTML
 * page. Verifying against `next dev` tests an application you do not ship.
 * This server applies the same cleanUrls + catch-all rewrite as firebase.json.
 *
 * SIDE EFFECTS: this only loads pages, it never clicks. It does not sign in,
 * so authenticated pages will redirect to /login and their handlers will not
 * run. That is deliberate — an authenticated pass exercises handlers that
 * write to Firestore, which would put junk data in a real project. Pass
 * --authenticated only against a throwaway project.
 *
 * Outputs audit/runtime.json and audit/RUNTIME.md.
 */
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'out');
const PORT = Number(process.env.AUDIT_PORT || 4599);
const PER_ROUTE_MS = Number(process.env.AUDIT_WAIT_MS || 1200);
// Pages retry the CSP-blocked Render hosts before giving up, so a generous
// navigation timeout makes the whole walk hang. Cap each route hard instead.
const NAV_TIMEOUT_MS = Number(process.env.AUDIT_NAV_MS || 8000);
const ROUTE_BUDGET_MS = Number(process.env.AUDIT_ROUTE_MS || 12000);

const withTimeout = (promise, ms, label) => Promise.race([
  promise,
  new Promise((_, reject) => setTimeout(() => reject(new Error(label + ' exceeded ' + ms + 'ms')), ms)),
]);

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  path.join(process.env.LOCALAPPDATA || '', 'Google/Chrome/Application/chrome.exe'),
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/google-chrome',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].filter(Boolean);

const chrome = CHROME_CANDIDATES.find((p) => { try { return fs.existsSync(p); } catch { return false; } });
if (!chrome) {
  console.error('No Chrome found. Set CHROME_PATH to a Chrome or Edge executable.');
  process.exit(1);
}
if (!fs.existsSync(OUT)) {
  console.error('out/ does not exist. Run `npm run build` first.');
  process.exit(1);
}

// ── routes: every page the build produced ───────────────────────────────────
function routes(dir = OUT, prefix = '') {
  const found = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === '_next' || e.name === 'api') continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) found.push(...routes(full, prefix + '/' + e.name));
    else if (e.name.endsWith('.html')) {
      const base = e.name.replace(/\.html$/, '');
      found.push(base === 'index' ? (prefix || '/') : prefix + '/' + base);
    }
  }
  return found;
}
// AUDIT_ROUTES=/vault,/profile limits the walk to specific pages. A full sweep
// of every route is slow because several pages sit retrying the CSP-blocked
// Render hosts, so use this to verify one vertical without waiting for all.
const only = (process.env.AUDIT_ROUTES || '').split(',').map((s) => s.trim()).filter(Boolean);
const ROUTE_LIST = [...new Set(routes())]
  .filter((r) => !r.startsWith('/_not-found') && !r.includes('/404'))
  .filter((r) => only.length === 0 || only.includes(r))
  .sort();

// ── server: firebase.json semantics ─────────────────────────────────────────
const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.bin': 'application/octet-stream',
  '.wasm': 'application/wasm', '.mp3': 'audio/mpeg', '.webm': 'video/webm',
};
const server = http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  const candidates = [
    path.join(OUT, url),
    path.join(OUT, url + '.html'),
    path.join(OUT, url, 'index.html'),
  ];
  for (const c of candidates) {
    if (!c.startsWith(OUT)) break; // traversal guard
    try {
      if (fs.statSync(c).isFile()) {
        res.writeHead(200, { 'Content-Type': MIME[path.extname(c)] || 'application/octet-stream' });
        return fs.createReadStream(c).pipe(res);
      }
    } catch { /* next candidate */ }
  }
  // firebase.json: { "source": "**", "destination": "/index.html" }
  // This is what makes every unmatched /api/* request return an HTML page
  // with status 200 in production.
  res.writeHead(200, { 'Content-Type': 'text/html' });
  fs.createReadStream(path.join(OUT, 'index.html')).pipe(res);
});

// Signals the shim emits when it cannot serve a path. These are the runtime
// counterpart of the static findings in audit/CONTRACTS.md.
const SIGNALS = [
  ['unhandled-api', /\[API\] Unhandled/i],
  ['unhandled-campus', /Unhandled campus path/i],
  ['live-fallback', /\[API Client\].*Falling back to client-side FirestoreRouter/i],
  ['payments-server-required', /PAYMENTS_SERVER_REQUIRED/i],
  ['json-parse-html', /Unexpected token\s*'?</i],
];

await new Promise((r) => server.listen(PORT, r));
const browser = await puppeteer.launch({
  executablePath: chrome,
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});

const results = [];
try {
  for (const route of ROUTE_LIST) {
    const page = await browser.newPage();
    const errors = [];
    const warnings = [];
    const signals = new Set();
    const failed = [];

    const note = (text) => {
      for (const [name, re] of SIGNALS) if (re.test(text)) signals.add(name);
    };
    page.on('console', (m) => {
      const t = m.text();
      note(t);
      if (m.type() === 'error') errors.push(t.slice(0, 300));
      else if (m.type() === 'warning') warnings.push(t.slice(0, 300));
    });
    page.on('pageerror', (e) => { note(String(e)); errors.push('pageerror: ' + String(e.message).slice(0, 300)); });
    page.on('requestfailed', (r) => failed.push(r.url().replace('http://localhost:' + PORT, '') + ' — ' + (r.failure() || {}).errorText));

    let finalUrl = route;
    try {
      await withTimeout((async () => {
        await page.goto('http://localhost:' + PORT + route, { waitUntil: 'domcontentloaded', timeout: NAV_TIMEOUT_MS });
        await new Promise((r) => setTimeout(r, PER_ROUTE_MS));
        finalUrl = new URL(page.url()).pathname;
      })(), ROUTE_BUDGET_MS, 'route budget');
    } catch (e) {
      errors.push('navigation: ' + String(e.message).slice(0, 200));
    }
    try { await withTimeout(page.close(), 5000, 'page close'); } catch { /* leaked tab; browser closes at the end */ }

    results.push({
      route, finalUrl,
      redirected: finalUrl !== route,
      errors: [...new Set(errors)],
      warnings: [...new Set(warnings)],
      signals: [...signals],
      failedRequests: [...new Set(failed)],
    });
    const flag = signals.size ? ' [' + [...signals].join(',') + ']' : '';
    process.stdout.write(
      String(results.length).padStart(3) + '/' + ROUTE_LIST.length + '  ' +
      route.padEnd(34) + errors.length + ' err' + flag + '\n');
  }
} finally {
  await browser.close();
  server.close();
}

// ── report ──────────────────────────────────────────────────────────────────
const distinctErrors = new Map();
for (const r of results) for (const e of r.errors) {
  const key = e.replace(/\d+/g, 'N').slice(0, 160);
  if (!distinctErrors.has(key)) distinctErrors.set(key, { sample: e, routes: [] });
  distinctErrors.get(key).routes.push(r.route);
}
const signalCounts = {};
for (const r of results) for (const s of r.signals) signalCounts[s] = (signalCounts[s] || 0) + 1;

const summary = {
  generated: new Date().toISOString(),
  authenticated: process.argv.includes('--authenticated'),
  routesWalked: results.length,
  routesWithErrors: results.filter((r) => r.errors.length).length,
  routesRedirected: results.filter((r) => r.redirected).length,
  distinctErrors: distinctErrors.size,
  totalErrors: results.reduce((a, r) => a + r.errors.length, 0),
  signalCounts,
};

fs.writeFileSync(path.join(ROOT, 'audit/runtime.json'), JSON.stringify({ summary, results }, null, 2));

const top = [...distinctErrors.entries()].sort((a, b) => b[1].routes.length - a[1].routes.length);
fs.writeFileSync(path.join(ROOT, 'audit/RUNTIME.md'), [
  '# Runtime walk — generated, do not hand-edit',
  '',
  'Regenerate: `npm run build && node audit/walk-routes.mjs`',
  '',
  'Served from `out/` with firebase.json semantics (cleanUrls + `**` -> /index.html),',
  'not `next dev`, so the API routes are inert exactly as they are in production.',
  'Not signed in, so authenticated pages redirect to /login and their handlers do not run.',
  '',
  Object.entries(summary).map(([k, v]) => '- **' + k + '**: ' + (typeof v === 'object' ? JSON.stringify(v) : v)).join('\n'),
  '',
  '**distinctErrors is the progress metric.** It must fall between runs; record it in the commit.',
  '',
  '## Distinct errors (' + top.length + ')',
  '',
  top.length ? top.map(([, v]) =>
    '- **' + v.routes.length + ' route(s)** — `' + v.sample.slice(0, 200).replace(/`/g, "'") + '`\n'
    + '  - ' + v.routes.slice(0, 8).join(', ') + (v.routes.length > 8 ? ' …' : '')).join('\n') : '_none_',
  '',
  '## Per route',
  '',
  '| route | final | errors | signals |',
  '|---|---|---|---|',
  results.map((r) => '| `' + r.route + '` | ' + (r.redirected ? '`' + r.finalUrl + '`' : '—') + ' | '
    + r.errors.length + ' | ' + (r.signals.join(', ') || '—') + ' |').join('\n'),
  '',
].join('\n'));

console.log('\n' + JSON.stringify(summary, null, 2));
console.log('\nwrote audit/runtime.json and audit/RUNTIME.md');
