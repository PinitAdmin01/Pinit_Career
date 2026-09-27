/**
 * Bonus vault claim route: atomic RPC, same response shape, a concurrent Pins spend is never undone.
 *
 *   node scripts/tests/test_claim_bonus.cjs
 *   (from the sandbox: node dark-gracity/claude_sandbox/test_claim_bonus.cjs)
 *   CLAIM_BONUS_SRC=src … runs the same checks against the current src/ route.
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
const USE_SRC = process.env.CLAIM_BONUS_SRC === 'src' || !fs.existsSync(path.join(__dirname, 'claim-bonus-route.ts'));
const ROUTE = USE_SRC ? path.join(ROOT, 'src/app/api/pins/claim-bonus/route.ts') : path.join(__dirname, 'claim-bonus-route.ts');
const USER = 'aaaaaaaa-0000-4000-8000-000000000001';

/**
 * In-memory users row + claim_bonus_pins RPC (row-locked, like the SQL).
 * `concurrentSpend` fires on the route's first database call: after a read snapshot is taken
 * (a spend that lands between read and write), or before the RPC (the row lock serialises it).
 */
function createDb({ pins = 50, bonus = 500, rpcError = null, concurrentSpend = 0 } = {}) {
  const user = { id: USER, pins, bonus_pins: bonus, pin_history: [] };
  const calls = { rpc: [], userUpdates: 0 };
  let spent = false;
  const spendOnce = () => { if (concurrentSpend && !spent) { spent = true; user.pins -= concurrentSpend; } };

  const from = (table) => {
    const q = { op: 'select', payload: null };
    const chain = {
      select() { return chain; },
      eq() { return chain; },
      update(p) { q.op = 'update'; q.payload = p; return chain; },
      maybeSingle() {
        const snapshot = JSON.parse(JSON.stringify(user));
        spendOnce();
        return Promise.resolve({ data: table === 'users' ? snapshot : null, error: null });
      },
      then(res, rej) {
        if (q.op === 'update' && table === 'users') { calls.userUpdates++; Object.assign(user, q.payload); }
        return Promise.resolve({ data: null, error: null }).then(res, rej);
      },
    };
    return chain;
  };

  const rpc = async (name, args) => {
    calls.rpc.push({ name, args });
    spendOnce();
    if (rpcError) return { data: null, error: rpcError };
    if (name !== 'claim_bonus_pins') return { data: null, error: { message: `unknown rpc ${name}` } };
    if (user.bonus_pins <= 0) return { data: { ok: false, error: 'NO_BONUS_PINS', message: 'You have no bonus pins available in your vault to claim.' }, error: null };
    const claim = args.p_amount && args.p_amount > 0 ? Math.min(args.p_amount, user.bonus_pins) : user.bonus_pins;
    user.pins += claim;
    user.bonus_pins -= claim;
    user.pin_history.unshift({ source: 'bonus_claim', amount: claim });
    return { data: { ok: true, claimed: claim, new_pins: user.pins, remaining_bonus: user.bonus_pins }, error: null };
  };

  return { client: { from, rpc }, user, calls };
}

function loadRoute(db) {
  const src = fs.readFileSync(ROUTE, 'utf8');
  const out = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true } }).outputText;
  const json = (body, init = {}) => ({ status: init.status || 200, body });
  const mocks = {
    'next/server': { NextResponse: { json } },
    '@/lib/server/requireAuth': {
      requireUserFromRequest: async (req) =>
        req.authed ? { user: { id: USER }, error: null } : { user: null, error: json({ error: 'UNAUTHORIZED' }, { status: 401 }) },
    },
    '@/lib/server/supabaseAdmin': { getSupabaseAdmin: () => db.client },
    '@/lib/utils/transactionId': { generateTxId: () => `tx_${Math.random().toString(36).slice(2)}` },
  };
  const mod = { exports: {} };
  new Function('require', 'module', 'exports', out)((n) => {
    if (n in mocks) return mocks[n];
    throw new Error(`Unexpected import in route: ${n}`);
  }, mod, mod.exports);
  return mod.exports;
}
const request = (body, authed = true) => ({ authed, json: async () => body });

let pass = 0, fail = 0;
async function test(name, fn) {
  try {
    const why = await fn();
    if (why === true) { pass++; console.log(`  ✓ ${name}`); }
    else { fail++; console.log(`  ✗ ${name}${why ? ` — ${why}` : ''}`); }
  } catch (e) { fail++; console.log(`  ✗ ${name} — threw: ${e.message}`); }
}

(async () => {
  console.log(`Bonus vault claim (route: ${path.relative(ROOT, ROUTE)})\n`);

  await test('claim all: same response shape the Pins hook reads', async () => {
    const db = createDb();
    const res = await loadRoute(db).POST(request({}));
    const b = res.body;
    if (res.status !== 200 || !b.ok) return `status ${res.status}`;
    return b.claimed === 500 && b.newPins === 550 && b.remainingBonus === 0 && typeof b.message === 'string' ? true : JSON.stringify(b);
  });

  await test('partial claim uses the requested amount', async () => {
    const db = createDb();
    const res = await loadRoute(db).POST(request({ amount: 120.9 }));
    return res.body.claimed === 120 && db.user.bonus_pins === 380 ? true : JSON.stringify(res.body);
  });

  await test('a Pins spend landing during the claim is not undone', async () => {
    const db = createDb({ pins: 50, bonus: 500, concurrentSpend: 30 });
    await loadRoute(db).POST(request({}));
    // spend 30 then claim 500 → 50 - 30 + 500 = 520 (a stale read-then-write gives 550)
    return db.user.pins === 520 ? true : `pins ${db.user.pins} (expected 520: the spend was undone)`;
  });

  await test('the route never writes balances itself (uses the atomic RPC)', async () => {
    const db = createDb();
    await loadRoute(db).POST(request({}));
    if (db.calls.userUpdates !== 0) return `${db.calls.userUpdates} direct users update(s)`;
    return db.calls.rpc.some((c) => c.name === 'claim_bonus_pins' && c.args.p_user_id === USER) ? true : 'claim_bonus_pins not called';
  });

  await test('empty vault → 400 NO_BONUS_PINS', async () => {
    const res = await loadRoute(createDb({ bonus: 0 })).POST(request({}));
    return res.status === 400 && res.body.error === 'NO_BONUS_PINS' ? true : `${res.status} ${res.body.error}`;
  });

  await test('database error → 500, nothing claimed', async () => {
    const db = createDb({ rpcError: { message: 'connection reset' } });
    const res = await loadRoute(db).POST(request({}));
    return res.status === 500 && db.user.pins === 50 ? true : `${res.status} pins=${db.user.pins}`;
  });

  await test('not logged in → 401', async () => {
    const res = await loadRoute(createDb()).POST(request({}, false));
    return res.status === 401 ? true : `status ${res.status}`;
  });

  console.log(`\n${pass}/${pass + fail} passed`);
  process.exit(fail ? 1 : 0);
})();
