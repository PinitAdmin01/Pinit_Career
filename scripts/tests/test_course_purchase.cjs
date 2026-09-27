/**
 * Course purchase: Pins and Razorpay (verify + webhook) against an in-memory Supabase.
 *
 *   node scripts/tests/test_course_purchase.cjs
 *   (from the sandbox: node dark-gracity/claude_sandbox/test_course_purchase.cjs)
 *   COURSE_PURCHASE_SRC=src … runs the same checks against the current src/ routes.
 *
 * Real route code (transpiled in-memory); Supabase tables, unique indexes and the
 * spend_pins / credit_pins RPCs are simulated; Razorpay order lookup is mocked;
 * signatures are real HMACs. The filesystem is in-memory, so nothing is written to disk.
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

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
const USE_SRC = process.env.COURSE_PURCHASE_SRC === 'src' || !fs.existsSync(path.join(__dirname, 'quests-enrollment-route.ts'));
const SRC = (sandboxName, srcRel) => (USE_SRC ? path.join(ROOT, srcRel) : path.join(__dirname, sandboxName));
const FILES = {
  helper: SRC('courseEnrollments.ts', 'src/lib/server/courseEnrollments.ts'),
  enrollment: SRC('quests-enrollment-route.ts', 'src/app/api/quests/enrollment/route.ts'),
  verify: SRC('payment-verify-route.ts', 'src/app/api/payment/verify/route.ts'),
  createOrder: SRC('payment-create-order-route.ts', 'src/app/api/payment/create-order/route.ts'),
  webhook: SRC('payment-webhook-route.ts', 'src/app/api/payment/webhook/route.ts'),
};

const USER = '8f14e45f-ceea-467a-9f6e-5b7c1a2d3e4f';
const PLAN = 'plan-3m-accelerator';
const PIN_COST = 1200;
const REWARD = 350;
const KEY_SECRET = 'test_key_secret';
const WEBHOOK_SECRET = 'test_webhook_secret';

// ── In-memory Supabase ───────────────────────────────────────────────────────
function createDb({ pins = 5000, insertError = null, spendRpcError = null } = {}) {
  const tables = { user_crash_enrollments: [], processed_payments: [], users: [{ id: USER, pins, pin_history: [] }] };
  const calls = { spend: [], credit: [], enrollmentInserts: 0 };

  const uniqueViolation = (table, row) => {
    if (table === 'processed_payments') return tables.processed_payments.some((r) => r.payment_id === row.payment_id);
    if (table === 'user_crash_enrollments') {
      return tables.user_crash_enrollments.some((r) =>
        (row.status === 'active' && r.status === 'active' && r.user_id === row.user_id && r.plan_id === row.plan_id) ||
        (row.payment_method === 'razorpay' && r.payment_method === 'razorpay' && r.payment_id === row.payment_id));
    }
    return false;
  };

  const from = (table) => {
    const q = { op: 'select', filters: [], payload: null };
    const matches = (r) => q.filters.every(([c, v]) => r[c] === v);
    const exec = (mode) => {
      const rows = tables[table] || (tables[table] = []);
      if (q.op === 'insert' || q.op === 'upsert') {
        if (table === 'user_crash_enrollments') calls.enrollmentInserts++;
        if (q.op === 'insert' && table === 'user_crash_enrollments' && insertError) return { data: null, error: insertError };
        if (q.op === 'insert' && uniqueViolation(table, q.payload)) return { data: null, error: { code: '23505', message: 'duplicate key value' } };
        const row = { ...q.payload };
        rows.push(row);
        return { data: mode === 'many' ? [row] : row, error: null };
      }
      if (q.op === 'update') {
        rows.filter(matches).forEach((r) => Object.assign(r, q.payload));
        return { data: null, error: null };
      }
      const found = rows.filter(matches).sort((a, b) => String(b.enrolled_at || '').localeCompare(String(a.enrolled_at || '')));
      if (mode === 'many') return { data: found, error: null };
      return { data: found[0] || null, error: null };
    };
    const chain = {
      select() { return chain; },
      eq(c, v) { q.filters.push([c, v]); return chain; },
      order() { return chain; },
      limit() { return chain; },
      insert(p) { q.op = 'insert'; q.payload = p; return chain; },
      upsert(p) { q.op = 'upsert'; q.payload = p; return chain; },
      update(p) { q.op = 'update'; q.payload = p; return chain; },
      maybeSingle() { return Promise.resolve(exec('maybe')); },
      single() { return Promise.resolve(exec('single')); },
      then(res, rej) { return Promise.resolve(exec('many')).then(res, rej); },
    };
    return chain;
  };

  const rpc = async (name, args) => {
    const user = tables.users.find((u) => u.id === args.p_user_id);
    if (name === 'spend_pins') {
      calls.spend.push(args);
      if (spendRpcError === 'throw') throw new Error('fetch failed: pins service unreachable');
      if (spendRpcError) return { data: null, error: spendRpcError };
      if (user.pins < args.p_amount) return { data: { ok: false, reason: 'INSUFFICIENT_PINS', current_balance: user.pins }, error: null };
      user.pins -= args.p_amount;
      return { data: { ok: true, new_balance: user.pins }, error: null };
    }
    if (name === 'credit_pins') {
      calls.credit.push(args);
      user.pins += args.p_amount;
      return { data: { ok: true, new_balance: user.pins }, error: null };
    }
    return { data: null, error: { message: `unknown rpc ${name}` } };
  };

  return { client: { from, rpc }, tables, calls, user: tables.users[0] };
}

// ── Module loading ───────────────────────────────────────────────────────────
function memoryFs() {
  const files = new Map();
  return {
    existsSync: (p) => files.has(p),
    readFileSync: (p) => { if (!files.has(p)) throw new Error('ENOENT'); return files.get(p); },
    writeFileSync: (p, data) => { files.set(p, String(data)); },
    mkdirSync: () => {},
    files,
  };
}

function loadRoutes({ db, authed = true, order = null }) {
  const memFs = memoryFs();
  const cache = new Map();
  const auth = {
    requireUserFromRequest: async () => (authed
      ? { user: { id: USER, email: 'student@example.com' }, error: null }
      : { user: null, error: { status: 401, body: { error: 'UNAUTHORIZED' } } }),
    getBearerToken: () => 'token',
  };
  const shared = {
    'next/server': { NextResponse: { json: (body, init) => ({ status: (init && init.status) || 200, body }) } },
    '@supabase/supabase-js': { createClient: () => db.client },
    '@/lib/server/requireAuth': auth,
    '@/lib/services/financeService': { financeService: {} },
    fs: memFs,
    path,
    crypto,
  };
  const load = (file) => {
    if (cache.has(file)) return cache.get(file).exports;
    const { outputText } = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
      fileName: file,
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
    });
    const mod = { exports: {} };
    cache.set(file, mod);
    const req = (spec) => {
      if (spec in shared) return shared[spec];
      if (spec === '@/lib/server/courseEnrollments') return load(FILES.helper);
      if (spec === '../create-order/route') return load(FILES.createOrder);
      throw new Error(`Unexpected import "${spec}" from ${path.basename(file)}`);
    };
    new Function('require', 'module', 'exports', outputText)(req, mod, mod.exports);
    return mod.exports;
  };
  globalThis.fetch = async () => ({ ok: true, json: async () => order });
  return { enrollment: load(FILES.enrollment), verify: load(FILES.verify), webhook: load(FILES.webhook), memFs };
}

const request = (body, headers = {}) => ({
  json: async () => body,
  text: async () => JSON.stringify(body),
  headers: { get: (k) => headers[k.toLowerCase()] ?? null },
});

function razorpayOrder(overrides = {}) {
  return { id: 'order_1', amount: 999900, notes: { uid: USER, planId: PLAN, track: 'python_ai' }, ...overrides };
}
function signedVerifyBody(paymentId = 'pay_1', orderId = 'order_1', planId = PLAN) {
  const sig = crypto.createHmac('sha256', KEY_SECRET).update(`${orderId}|${paymentId}`).digest('hex');
  return { razorpay_order_id: orderId, razorpay_payment_id: paymentId, razorpay_signature: sig, planId };
}
function webhookRequest(paymentId = 'pay_1', orderId = 'order_1') {
  const body = {
    event: 'payment.captured',
    payload: { payment: { entity: { id: paymentId, order_id: orderId, status: 'captured', amount: 999900, notes: { uid: USER, planId: PLAN, track: 'python_ai' } } } },
  };
  const raw = JSON.stringify(body);
  const signature = crypto.createHmac('sha256', WEBHOOK_SECRET).update(raw).digest('hex');
  return { json: async () => body, text: async () => raw, headers: { get: (k) => (k.toLowerCase() === 'x-razorpay-signature' ? signature : null) } };
}

function setEnv({ supabase = true, production = true } = {}) {
  process.env.NODE_ENV = production ? 'production' : 'development';
  process.env.NEXT_PUBLIC_SUPABASE_URL = supabase ? 'https://example.supabase.co' : '';
  process.env.SUPABASE_SERVICE_ROLE_KEY = supabase ? 'service-role' : '';
  process.env.RAZORPAY_KEY_ID = 'rzp_test_1';
  process.env.RAZORPAY_KEY_SECRET = KEY_SECRET;
  process.env.RAZORPAY_WEBHOOK_SECRET = WEBHOOK_SECRET;
}

const activeEnrollments = (db) => db.tables.user_crash_enrollments.filter((r) => r.user_id === USER && r.status === 'active');

// ── Runner ───────────────────────────────────────────────────────────────────
const results = [];
function assert(cond, msg) { if (!cond) throw new Error(msg); }
async function test(name, fn) {
  const { log, warn, error } = console;
  console.log = () => {}; console.warn = () => {}; console.error = () => {};
  try { await fn(); results.push({ ok: true, name }); }
  catch (err) { results.push({ ok: false, name, error: err.message }); }
  finally { console.log = log; console.warn = warn; console.error = error; }
}

(async () => {
  const pinsBody = { planId: PLAN, track: 'web_fullstack', paymentMethod: 'pins', amountPaid: PIN_COST };

  await test('Pins: purchase charges once and creates the enrollment', async () => {
    setEnv();
    const db = createDb();
    const { enrollment } = loadRoutes({ db });
    const res = await enrollment.POST(request(pinsBody));
    assert(res.status === 200 && res.body.ok, `status ${res.status}: ${JSON.stringify(res.body)}`);
    assert(db.calls.spend.length === 1 && db.user.pins === 5000 - PIN_COST, `pins now ${db.user.pins}, spends ${db.calls.spend.length}`);
    assert(activeEnrollments(db).length === 1, `${activeEnrollments(db).length} active enrollments`);
    assert(res.body.enrollment.planId === PLAN && res.body.enrollment.pinsDeducted === PIN_COST, 'enrollment payload wrong');
  });

  await test('Pins: the "Launch Workspace" re-send is not charged again', async () => {
    setEnv();
    const db = createDb();
    const { enrollment } = loadRoutes({ db });
    await enrollment.POST(request(pinsBody));
    const launchResend = { enrollmentId: 'enr-client', userId: 'current-user', planId: PLAN, track: 'web_fullstack', paymentMethod: 'pins', status: 'active' };
    const res = await enrollment.POST(request(launchResend));
    assert(db.calls.spend.length === 1, `charged ${db.calls.spend.length} times`);
    assert(db.user.pins === 5000 - PIN_COST, `balance ${db.user.pins}`);
    assert(activeEnrollments(db).length === 1, `${activeEnrollments(db).length} active enrollments`);
    assert(res.status === 200, `second call status ${res.status}`);
  });

  await test('Card: the enrollment endpoint refuses unverified "razorpay" enrollments', async () => {
    setEnv();
    const db = createDb();
    const { enrollment } = loadRoutes({ db });
    const res = await enrollment.POST(request({ planId: PLAN, track: 'web_fullstack', paymentMethod: 'razorpay', paymentId: 'pay_fake' }));
    assert(res.status >= 400, `accepted with status ${res.status}`);
    assert(activeEnrollments(db).length === 0, 'enrollment created without payment');
    assert(db.calls.credit.length === 0, 'reward pins credited without payment');
  });

  await test('Pins: a pins-service error charges nothing and enrolls nothing', async () => {
    setEnv();
    for (const failure of [{ message: 'rpc unavailable' }, 'throw']) {
      const db = createDb({ spendRpcError: failure });
      const { enrollment } = loadRoutes({ db });
      const res = await enrollment.POST(request(pinsBody));
      const kind = failure === 'throw' ? 'thrown' : 'returned';
      assert(res.status >= 400, `${kind} error: status ${res.status}`);
      assert(activeEnrollments(db).length === 0, `${kind} error: enrolled without payment`);
    }
  });

  await test('Pins: insufficient balance is refused (402), no enrollment', async () => {
    setEnv();
    const db = createDb({ pins: 100 });
    const { enrollment } = loadRoutes({ db });
    const res = await enrollment.POST(request(pinsBody));
    assert(res.status === 402, `status ${res.status}`);
    assert(activeEnrollments(db).length === 0 && db.user.pins === 100, 'charged or enrolled');
  });

  await test('Pins: if saving the enrollment fails after charging, the pins are refunded', async () => {
    setEnv();
    const db = createDb({ insertError: { code: '42P01', message: 'relation "user_crash_enrollments" does not exist' } });
    const { enrollment } = loadRoutes({ db });
    const res = await enrollment.POST(request(pinsBody));
    assert(res.status === 500, `status ${res.status}`);
    assert(db.user.pins === 5000, `balance ${db.user.pins} (not refunded)`);
    assert(db.calls.credit.some((c) => c.p_amount === PIN_COST), 'no refund credit');
  });

  await test('Production without Supabase refuses instead of using local files', async () => {
    setEnv({ supabase: false, production: true });
    const db = createDb();
    const { enrollment, memFs } = loadRoutes({ db });
    const res = await enrollment.POST(request(pinsBody));
    assert(res.status === 503, `status ${res.status}`);
    assert(memFs.files.size === 0, 'wrote to the serverless filesystem');
  });

  await test('Unauthenticated requests are rejected (GET and POST)', async () => {
    setEnv();
    const db = createDb();
    const { enrollment } = loadRoutes({ db, authed: false });
    const post = await enrollment.POST(request(pinsBody));
    const get = await enrollment.GET(request({}));
    assert(post.status === 401 && get.status === 401, `POST ${post.status}, GET ${get.status}`);
  });

  await test('GET returns the enrollment in the shape the client reads (camelCase)', async () => {
    setEnv();
    const db = createDb();
    const { enrollment } = loadRoutes({ db });
    await enrollment.POST(request(pinsBody));
    const res = await enrollment.GET(request({}));
    assert(res.status === 200 && res.body.enrollment, `status ${res.status}`);
    assert(res.body.enrollment.planId === PLAN && res.body.enrollment.track === 'web_fullstack', `got ${JSON.stringify(res.body.enrollment).slice(0, 120)}`);
  });

  await test('Card: verify enrolls using the Razorpay order (plan, track, amount) and credits the reward once', async () => {
    setEnv();
    const db = createDb();
    const { verify } = loadRoutes({ db, order: razorpayOrder() });
    const res = await verify.POST(request(signedVerifyBody()));
    assert(res.status === 200 && res.body.enrollment, `status ${res.status}: ${JSON.stringify(res.body)}`);
    const e = res.body.enrollment;
    assert(e.planId === PLAN && e.track === 'python_ai' && e.amountPaid === 9999 && e.paymentMethod === 'razorpay', `enrollment ${JSON.stringify(e).slice(0, 160)}`);
    assert(db.calls.credit.filter((c) => c.p_amount === REWARD).length === 1, 'reward not credited exactly once');
  });

  await test('Card: retrying verify returns the same enrollment, no second reward', async () => {
    setEnv();
    const db = createDb();
    const { verify } = loadRoutes({ db, order: razorpayOrder() });
    const first = await verify.POST(request(signedVerifyBody()));
    const second = await verify.POST(request(signedVerifyBody()));
    assert(second.status === 200 && second.body.enrollment, `retry status ${second.status}: ${JSON.stringify(second.body)}`);
    assert(second.body.enrollment.enrollmentId === first.body.enrollment.enrollmentId, 'different enrollment on retry');
    assert(activeEnrollments(db).length === 1, `${activeEnrollments(db).length} enrollments`);
    assert(db.calls.credit.length === 1, `reward credited ${db.calls.credit.length} times`);
  });

  await test('Card: webhook arriving first, then verify → one enrollment, verify succeeds (no 409)', async () => {
    setEnv();
    const db = createDb();
    const { verify, webhook } = loadRoutes({ db, order: razorpayOrder() });
    const hook = await webhook.POST(webhookRequest());
    assert(hook.status === 200, `webhook status ${hook.status}: ${JSON.stringify(hook.body)}`);
    const res = await verify.POST(request(signedVerifyBody()));
    assert(res.status === 200 && res.body.enrollment, `verify after webhook: ${res.status} ${JSON.stringify(res.body)}`);
    assert(activeEnrollments(db).length === 1, `${activeEnrollments(db).length} enrollments`);
    assert(db.calls.credit.length === 1, `reward credited ${db.calls.credit.length} times`);
  });

  await test('Card: the webhook alone enrolls a student whose browser never verified', async () => {
    setEnv();
    const db = createDb();
    const { webhook } = loadRoutes({ db, order: razorpayOrder() });
    const res = await webhook.POST(webhookRequest('pay_2', 'order_2'));
    assert(res.status === 200, `status ${res.status}`);
    assert(activeEnrollments(db).length === 1, 'webhook did not enroll');
  });

  await test('Card: a tampered signature enrolls nothing', async () => {
    setEnv();
    const db = createDb();
    const { verify } = loadRoutes({ db, order: razorpayOrder() });
    const body = { ...signedVerifyBody(), razorpay_signature: 'f'.repeat(64) };
    const res = await verify.POST(request(body));
    assert(res.status === 400, `status ${res.status}`);
    assert(activeEnrollments(db).length === 0, 'enrolled on a bad signature');
  });

  console.log(`Course purchase tests (${USE_SRC ? 'current src/ routes' : 'sandbox drafts'})\n`);
  for (const r of results) console.log(`  ${r.ok ? 'PASS' : 'FAIL'}  ${r.name}${r.ok ? '' : `\n        -> ${r.error}`}`);
  const failed = results.filter((r) => !r.ok).length;
  console.log(`\n${results.length - failed}/${results.length} passed`);
  process.exit(failed ? 1 : 0);
})();
