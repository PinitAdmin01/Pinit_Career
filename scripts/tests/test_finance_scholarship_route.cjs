/**
 * Scholarship waivers (T19 / B4b): a waiver lowers what a student owes, so only the finance
 * office (admin) can apply one, for a chosen student. Students used to apply any scholarship
 * (up to ₹15,000) to their own dues with no eligibility check.
 *
 *   node scripts/tests/test_finance_scholarship_route.cjs
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
const ROUTE = path.join(ROOT, 'src/app/api/finance/apply-scholarship/route.ts');

function loadRoute(calls) {
  const json = (body, init = {}) => ({ status: init.status || 200, body });
  const out = ts.transpileModule(fs.readFileSync(ROUTE, 'utf8'), {
    fileName: ROUTE, compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
  }).outputText;
  const mod = { exports: {} };
  const deny = (status, error) => ({ user: null, error: json({ error }, { status }) });
  const mocks = {
    'next/server': { NextResponse: { json } },
    '@/lib/services/financeService': {
      financeService: { applyScholarship: async (studentId, scholarshipId) => { calls.push([studentId, scholarshipId]); return { ok: true, waiver: 15000 }; } },
    },
    '@/lib/server/requireAuth': {
      requireAdminUserFromRequest: async (req) => (!req.userId ? deny(401, 'UNAUTHORIZED')
        : req.role === 'admin' ? { user: { id: req.userId, role: 'admin' }, error: null } : deny(403, 'FORBIDDEN')),
      requireUserFromRequest: async (req) => (req.userId ? { user: { id: req.userId }, error: null } : deny(401, 'UNAUTHORIZED')),
    },
  };
  new Function('require', 'module', 'exports', out)((n) => {
    if (n in mocks) return mocks[n];
    throw new Error(`Unexpected import: ${n}`);
  }, mod, mod.exports);
  return mod.exports;
}
const post = (route, { userId, role, body }) => route.POST({ userId, role, json: async () => body });

let pass = 0, fail = 0;
async function test(name, fn) {
  let why;
  try { why = await fn(); } catch (e) { why = `threw: ${e.message}`; }
  if (why === true) { pass++; console.log(`  ✓ ${name}`); } else { fail++; console.log(`  ✗ ${name}${why ? ` — ${why}` : ''}`); }
}

(async () => {
  console.log('Scholarship waivers\n');

  await test('a student cannot apply a scholarship to their own fees', async () => {
    const calls = [];
    const res = await post(loadRoute(calls), { userId: 'stu-1', role: 'student', body: { scholarshipId: 'SCH-MERIT' } });
    if (calls.length) return `waiver applied for ${calls[0][0]}`;
    return res.status === 403 && res.body.error === 'FINANCE_OFFICE_ONLY' && /finance office/.test(res.body.message) ? true : `${res.status} ${JSON.stringify(res.body)}`;
  });

  await test('the finance office applies a scholarship for the chosen student', async () => {
    const calls = [];
    const res = await post(loadRoute(calls), { userId: 'adm-1', role: 'admin', body: { studentId: 'stu-1', scholarshipId: 'SCH-MERIT' } });
    return res.status === 200 && calls.length === 1 && calls[0][0] === 'stu-1' && calls[0][1] === 'SCH-MERIT' ? true : `${res.status} ${JSON.stringify(calls)}`;
  });

  await test('the student must be named (no waiver for the admin\'s own account by default)', async () => {
    const calls = [];
    const res = await post(loadRoute(calls), { userId: 'adm-1', role: 'admin', body: { scholarshipId: 'SCH-MERIT' } });
    return res.status === 400 && calls.length === 0 ? true : `${res.status} ${JSON.stringify(calls)}`;
  });

  await test('signed out → 401', async () => {
    const res = await post(loadRoute([]), { body: { scholarshipId: 'SCH-MERIT' } });
    return res.status === 401 ? true : `${res.status}`;
  });

  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})();
