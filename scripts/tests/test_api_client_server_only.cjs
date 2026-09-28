/**
 * The API client sends every /api/* call to the app's own server routes. There is no in-browser
 * fallback router any more: a server error is reported as an error (never answered by a mock), and
 * a path outside /api/ is refused.
 *
 * Run: node scripts/tests/test_api_client_server_only.cjs
 */
const fs = require('fs');
const path = require('path');
const ts = require('typescript');

const ROOT = path.join(__dirname, '..', '..');
let passed = 0;
let failed = 0;
async function test(name, fn) {
  try {
    const r = await fn();
    if (r === true) { passed++; console.log('  ✓ ' + name); }
    else { failed++; console.log('  ✗ ' + name + ' — ' + r); }
  } catch (e) { failed++; console.log('  ✗ ' + name + ' — threw ' + (e && e.stack || e)); }
}

function loadClient() {
  const src = fs.readFileSync(path.join(ROOT, 'src/lib/api/client.ts'), 'utf8');
  const js = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  const mod = { exports: {} };
  const requireMock = (spec) => {
    if (spec === '@/lib/supabaseClient') return { supabase: { auth: { getSession: async () => ({ data: { session: { access_token: 'tok' } } }) } } };
    if (spec === '@/lib/sanitizeLLM') return { sanitizeLLMOutput: (s) => s };
    throw new Error('unexpected import ' + spec);
  };
  new Function('module', 'exports', 'require', js)(mod, mod.exports, requireMock);
  return mod.exports;
}

(async () => {
  console.log('\nAPI client: server routes only\n');
  const { api, ApiError } = loadClient();
  const calls = [];
  const respond = { status: 200, json: { ok: true } };
  global.fetch = async (url, init) => {
    calls.push({ url, init });
    return { ok: respond.status < 400, status: respond.status, json: async () => respond.json, text: async () => JSON.stringify(respond.json) };
  };

  await test('an /api/ call goes to the server with the session token', async () => {
    calls.length = 0; respond.status = 200; respond.json = { ok: true, data: 1 };
    const res = await api.get('/api/leaderboard?scope=global');
    const c = calls[0];
    if (!c || c.url !== '/api/leaderboard?scope=global') return JSON.stringify(calls);
    if (c.init.headers.Authorization !== 'Bearer tok') return 'no bearer token';
    return res && res.data === 1 ? true : JSON.stringify(res);
  });

  await test('a server error is reported, not answered by a local fallback', async () => {
    calls.length = 0; respond.status = 404; respond.json = { error: 'NOT_FOUND', message: 'nope' };
    try { await api.post('/api/missions/today', {}); return 'resolved instead of failing'; }
    catch (e) {
      if (!(e instanceof ApiError)) return 'not an ApiError: ' + e;
      return e.status === 404 && calls.length === 1 ? true : `status ${e.status}, ${calls.length} request(s)`;
    }
  });

  await test('a path outside /api/ is refused without a request', async () => {
    calls.length = 0;
    try { await api.get('/v1/auth/session'); return 'resolved'; }
    catch (e) {
      if (!(e instanceof ApiError)) return 'not an ApiError: ' + e;
      return e.status === 404 && e.code === 'UNKNOWN_API_PATH' && calls.length === 0 ? true : `${e.status} ${e.code}, ${calls.length} request(s)`;
    }
  });

  await test('the in-browser router is gone and nothing imports it', async () => {
    if (fs.existsSync(path.join(ROOT, 'src/lib/api/legacyFirestoreRouter.ts'))) return 'router file still exists';
    const client = fs.readFileSync(path.join(ROOT, 'src/lib/api/client.ts'), 'utf8');
    return /legacyFirestoreRouter|firestoreRouter/.test(client) ? 'client still references the router' : true;
  });

  console.log(`\n${passed} passed, ${failed} failed\n`);
  process.exit(failed ? 1 : 0);
})();
