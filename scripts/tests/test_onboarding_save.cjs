/**
 * Onboarding save (POST /api/auth/onboarding) against a production-like users table.
 *
 *   node scripts/tests/test_onboarding_save.cjs
 *   (from the sandbox: node dark-gracity/claude_sandbox/test_onboarding_save.cjs)
 *
 * Runs the real route (transpiled in-memory) with a fake Supabase client whose users
 * table can lack columns, like production before migration 20260917 was applied.
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

const ROUTE = process.env.ONBOARDING_ROUTE_PATH
  ? path.resolve(process.env.ONBOARDING_ROUTE_PATH)
  : fs.existsSync(path.join(__dirname, 'onboarding-api-route.ts'))
    ? path.join(__dirname, 'onboarding-api-route.ts')
    : path.join(ROOT, 'src/app/api/auth/onboarding/route.ts');

// Every column the route may write. Tests remove some to mimic an out-of-date schema.
const FULL_SCHEMA = [
  'id', 'email', 'role', 'created_at', 'onboarding_step', 'roadmap_generated', 'target_role',
  'career_goal', 'guidance_mentor_id', 'onboarding_answers', 'weak_areas', 'completed_quests',
  'completed_missions', 'updated_at',
];

function createFakeDb({ columns, rows = {}, updateError = null }) {
  const calls = [];
  const unknownColumn = (payload) => Object.keys(payload).find((k) => !columns.includes(k));
  const columnError = (k) => ({ code: 'PGRST204', message: `Could not find the '${k}' column of 'users' in the schema cache` });

  const from = () => {
    const q = { op: 'select', payload: null, id: null, opts: null };
    const chain = {
      select() { return chain; },
      eq(_col, id) { q.id = id; return chain; },
      update(payload) { q.op = 'update'; q.payload = payload; return chain; },
      upsert(payload, opts) { q.op = 'upsert'; q.payload = payload; q.opts = opts; return chain; },
      maybeSingle() {
        calls.push({ op: q.op, keys: q.payload ? Object.keys(q.payload) : [] });
        if (q.op === 'select') return Promise.resolve({ data: rows[q.id] ? { ...rows[q.id] } : null, error: null });
        const missing = unknownColumn(q.payload);
        if (missing) return Promise.resolve({ data: null, error: columnError(missing) });
        if (q.op === 'update') {
          if (updateError) return Promise.resolve({ data: null, error: updateError });
          if (!rows[q.id]) return Promise.resolve({ data: null, error: null });
          rows[q.id] = { ...rows[q.id], ...q.payload };
          return Promise.resolve({ data: { ...rows[q.id] }, error: null });
        }
        const id = q.payload.id;
        rows[id] = { ...(rows[id] || {}), ...q.payload };
        return Promise.resolve({ data: { ...rows[id] }, error: null });
      },
    };
    return chain;
  };
  return { db: { from }, rows, calls };
}

function loadRoute(db) {
  const { outputText } = ts.transpileModule(fs.readFileSync(ROUTE, 'utf8'), {
    fileName: ROUTE,
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
  });
  const mocks = {
    'next/server': { NextResponse: { json: (body, init) => ({ status: (init && init.status) || 200, body }) } },
    '@/lib/server/requireAuth': {
      requireUserFromRequest: async () => ({ user: { id: 'user-1', email: 'student@example.com' }, error: null }),
      getAuthoritativeSupabaseClient: () => db,
      getBearerToken: () => 'token',
    },
    '@supabase/supabase-js': { createClient: () => db },
  };
  const mod = { exports: {} };
  const req = (spec) => {
    if (spec in mocks) return mocks[spec];
    throw new Error(`Unexpected import "${spec}"`);
  };
  new Function('require', 'module', 'exports', outputText)(req, mod, mod.exports);
  return mod.exports;
}

const ONBOARDING_PAYLOAD = {
  guidanceMentorId: 'priya',
  onboardingStep: 3,
  target_role: 'React Frontend Web SDE',
  career_goal: 'Ship production React apps',
  onboardingAnswers: { education: 'B.Tech CSE', hasCompleted: true, qt1_score: 42, mindset_archetype: 'Explorer' },
  roadmapGenerated: true,
};

async function post(db, body = ONBOARDING_PAYLOAD) {
  const { POST } = loadRoute(db);
  return POST({ json: async () => body, headers: new Map() });
}

const results = [];
function assert(cond, msg) { if (!cond) throw new Error(msg); }
async function test(name, fn) {
  const { error, warn } = console;
  console.error = () => {};
  console.warn = () => {};
  try { await fn(); results.push({ ok: true, name }); }
  catch (err) { results.push({ ok: false, name, error: err.message }); }
  finally { console.error = error; console.warn = warn; }
}

(async () => {
  const withoutMigration = FULL_SCHEMA.filter((c) => c !== 'completed_missions' && c !== 'updated_at');

  await test('saves onboarding when completed_missions / updated_at columns are missing', async () => {
    const { db, rows } = createFakeDb({ columns: withoutMigration, rows: { 'user-1': { id: 'user-1', role: 'student' } } });
    const res = await post(db);
    assert(res.status === 200, `status ${res.status}: ${JSON.stringify(res.body)}`);
    const row = rows['user-1'];
    assert(row.onboarding_step === 3 && row.roadmap_generated === true, 'completion flags not saved');
    assert(row.onboarding_answers && row.onboarding_answers.hasCompleted === true, 'answers not saved');
    assert(row.target_role === 'React Frontend Web SDE', 'target_role not saved');
  });

  await test('creates the row for a brand-new user', async () => {
    const { db, rows } = createFakeDb({ columns: FULL_SCHEMA });
    const res = await post(db);
    assert(res.status === 200, `status ${res.status}`);
    assert(rows['user-1'] && rows['user-1'].role === 'student', 'row not created');
  });

  await test('still fails loudly when a core column is missing', async () => {
    const { db } = createFakeDb({ columns: FULL_SCHEMA.filter((c) => c !== 'onboarding_answers'), rows: { 'user-1': { id: 'user-1' } } });
    const res = await post(db);
    assert(res.status === 500, `expected 500, got ${res.status}`);
  });

  await test('a failed update never upserts over an existing account (no role reset)', async () => {
    const { db, rows, calls } = createFakeDb({
      columns: FULL_SCHEMA,
      rows: { 'user-1': { id: 'user-1', role: 'teacher' } },
      updateError: { code: '42501', message: 'permission denied for table users' },
    });
    const res = await post(db);
    assert(res.status === 500, `expected 500, got ${res.status}`);
    assert(!calls.some((c) => c.op === 'upsert'), 'route fell back to upsert');
    assert(rows['user-1'].role === 'teacher', `role changed to ${rows['user-1'].role}`);
  });

  await test('keeps the career role inside onboarding_answers, but never lets the root role through', async () => {
    const { db, rows } = createFakeDb({ columns: FULL_SCHEMA, rows: { 'user-1': { id: 'user-1', role: 'student' } } });
    const res = await post(db, {
      role: 'admin',
      onboardingAnswers: { role: 'React Frontend Web SDE', hasCompleted: true },
    });
    assert(res.status === 200, `status ${res.status}`);
    const row = rows['user-1'];
    assert(row.onboarding_answers.role === 'React Frontend Web SDE', `answers.role is ${JSON.stringify(row.onboarding_answers.role)}`);
    assert(row.role === 'student', `account role changed to ${row.role}`);
  });

  console.log(`Onboarding save tests (route: ${path.relative(ROOT, ROUTE)})\n`);
  for (const r of results) console.log(`  ${r.ok ? 'PASS' : 'FAIL'}  ${r.name}${r.ok ? '' : `\n        -> ${r.error}`}`);
  const failed = results.filter((r) => !r.ok).length;
  console.log(`\n${results.length - failed}/${results.length} passed`);
  process.exit(failed ? 1 : 0);
})();
