/**
 * Global fetch interceptor: plain fetch('/api/…') calls get the signed-in user's Bearer token.
 *
 *   node scripts/tests/test_fetch_interceptor.cjs
 *   (from the sandbox: node dark-gracity/claude_sandbox/test_fetch_interceptor.cjs)
 *   FETCH_INTERCEPTOR_SRC=src … runs the same checks against the current src/lib/fetchInterceptor.ts.
 */
const fs = require('fs');
const path = require('path');

function findRoot(dir) {
  while (!(fs.existsSync(path.join(dir, 'package.json')) && fs.existsSync(path.join(dir, 'src')))) {
    const up = path.dirname(dir);
    if (up === dir) throw new Error('Project root (package.json + src/) not found');
    dir = up;
  }
  return dir;
}

const ROOT = findRoot(__dirname);
const ts = require(require.resolve('typescript', { paths: [ROOT] }));
const USE_SRC = process.env.FETCH_INTERCEPTOR_SRC === 'src' || !fs.existsSync(path.join(__dirname, 'fetchInterceptor.ts'));
const FILE = USE_SRC ? path.join(ROOT, 'src/lib/fetchInterceptor.ts') : path.join(__dirname, 'fetchInterceptor.ts');
const ORIGIN = 'http://localhost:3000';
const TOKEN = 'jwt.user.token';

/** Fresh module + fake window per test. session: 'ok' | 'none' | 'throw'. */
function setup({ session = 'ok' } = {}) {
  const calls = [];
  const response = { marker: 'original-response' };
  const originalFetch = async (input, init) => { calls.push({ input, init }); return response; };
  global.window = { location: { origin: ORIGIN }, fetch: originalFetch };
  const supabase = {
    auth: {
      getSession: async () => {
        if (session === 'throw') throw new Error('storage unavailable');
        return { data: { session: session === 'ok' ? { access_token: TOKEN } : null } };
      },
    },
  };
  const src = fs.readFileSync(FILE, 'utf8');
  const out = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  const mod = { exports: {} };
  const mocks = { './supabaseClient': { supabase }, './api/client': { api: {} } };
  new Function('require', 'module', 'exports', out)((n) => {
    if (n in mocks) return mocks[n];
    throw new Error(`Unexpected import: ${n}`);
  }, mod, mod.exports);
  mod.exports.installFetchInterceptor();
  return { fetch: (...a) => global.window.fetch(...a), calls, response };
}

/** Authorization header actually sent on the last call (init headers win, else Request headers). */
function sentAuth(call) {
  const h = call.init && call.init.headers ? new Headers(call.init.headers)
    : call.input instanceof Request ? call.input.headers : new Headers();
  return h.get('Authorization');
}

let pass = 0, fail = 0;
async function test(name, fn) {
  try {
    const why = await fn();
    if (why === true) { pass++; console.log(`  ✓ ${name}`); }
    else { fail++; console.log(`  ✗ ${name}${why ? ` — ${why}` : ''}`); }
  } catch (e) { fail++; console.log(`  ✗ ${name} — threw: ${e.message}`); }
}

(async () => {
  console.log(`Fetch interceptor (${path.relative(ROOT, FILE)})\n`);

  await test("plain fetch('/api/…') gets the Bearer token", async () => {
    const t = setup();
    await t.fetch('/api/quest/complete', { method: 'POST', body: '{"questId":"q1"}', headers: { 'Content-Type': 'application/json' } });
    const c = t.calls[0];
    if (sentAuth(c) !== `Bearer ${TOKEN}`) return `Authorization = ${sentAuth(c)}`;
    if (c.init.method !== 'POST' || c.init.body !== '{"questId":"q1"}') return 'method/body changed';
    return new Headers(c.init.headers).get('Content-Type') === 'application/json' ? true : 'Content-Type lost';
  });

  await test('GET without init and absolute same-origin URL also get it', async () => {
    const t = setup();
    await t.fetch('/api/interview/history');
    await t.fetch(`${ORIGIN}/api/tts`, { method: 'POST' });
    return t.calls.every((c) => sentAuth(c) === `Bearer ${TOKEN}`) ? true : t.calls.map(sentAuth).join(', ');
  });

  await test('Request object input: token added, method and body kept', async () => {
    const t = setup();
    await t.fetch(new Request(`${ORIGIN}/api/friends/messages`, { method: 'POST', body: 'hello', headers: { 'X-Trace': '1' } }));
    const c = t.calls[0];
    const h = new Headers(c.init.headers);
    if (h.get('Authorization') !== `Bearer ${TOKEN}` || h.get('X-Trace') !== '1') return `headers ${[...h].join(';')}`;
    return c.input instanceof Request && c.input.method === 'POST' && (await c.input.clone().text()) === 'hello' ? true : 'request changed';
  });

  await test('an existing Authorization header is never replaced', async () => {
    const t = setup();
    await t.fetch('/api/pins/spend', { headers: { Authorization: 'Bearer other' } });
    return sentAuth(t.calls[0]) === 'Bearer other' ? true : sentAuth(t.calls[0]);
  });

  await test('other origins (Supabase, CDNs) are untouched', async () => {
    const t = setup();
    await t.fetch('https://abc.supabase.co/rest/v1/users', { headers: { apikey: 'anon' } });
    await t.fetch('https://cdn.example.com/api/x');
    return t.calls.every((c) => !sentAuth(c)) ? true : 'token leaked to another origin';
  });

  await test('non-API same-origin paths are untouched', async () => {
    const t = setup();
    await t.fetch('/_next/data/build/page.json');
    await t.fetch('/apiary');
    return t.calls.every((c) => !sentAuth(c)) ? true : 'token added to a non-API path';
  });

  await test('signed out: request goes through unchanged', async () => {
    const t = setup({ session: 'none' });
    const res = await t.fetch('/api/leaderboard');
    return !sentAuth(t.calls[0]) && res === t.response ? true : 'changed';
  });

  await test('session lookup failure never breaks the request', async () => {
    const t = setup({ session: 'throw' });
    const res = await t.fetch('/api/leaderboard');
    return res === t.response && t.calls.length === 1 ? true : 'request failed';
  });

  await test('response is returned untouched (streams keep streaming)', async () => {
    const t = setup();
    const res = await t.fetch('/api/interview/chat', { method: 'POST', body: '{}' });
    return res === t.response ? true : 'response replaced';
  });

  await test('installing twice wraps fetch only once', async () => {
    const t = setup();
    const wrapped = global.window.fetch;
    const src = fs.readFileSync(FILE, 'utf8');
    return /installed\s*=\s*true/.test(src) && global.window.fetch === wrapped ? true : 'no install guard';
  });

  console.log(`\n${pass}/${pass + fail} passed`);
  process.exit(fail ? 1 : 0);
})();
