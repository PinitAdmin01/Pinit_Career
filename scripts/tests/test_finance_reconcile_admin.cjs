/**
 * Fee reconciliation (B6a): repairs every student's installments and reports their payment ids,
 * so only admins may run it (it was open to any signed-in user).
 *
 *   node scripts/tests/test_finance_reconcile_admin.cjs
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
const ROUTE = path.join(ROOT, 'src/app/api/finance/reconcile/route.ts');

function loadRoute(calls) {
  const json = (body, init = {}) => ({ status: init.status || 200, body });
  const out = ts.transpileModule(fs.readFileSync(ROUTE, 'utf8'), {
    fileName: ROUTE, compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
  }).outputText;
  const mod = { exports: {} };
  const mocks = {
    'next/server': { NextResponse: { json } },
    '@/lib/server/requireAdmin': {
      requireAdminFromRequest: async (req) => (req.role === 'admin' ? null : json({ error: req.role ? 'FORBIDDEN' : 'UNAUTHORIZED' }, { status: req.role ? 403 : 401 })),
    },
    '@/lib/server/requireAuth': { requireUserFromRequest: async (req) => (req.role ? { user: { id: 'u' }, error: null } : { user: null, error: json({}, { status: 401 }) }) },
    '@/lib/services/financeService': { financeService: { reconcileFeePayments: async () => { calls.push(1); return { ok: true, report: { discrepancies: [{ userId: 'stu-9', paymentId: 'pay_1' }] } }; } } },
  };
  new Function('require', 'module', 'exports', out)((n) => {
    if (n in mocks) return mocks[n];
    throw new Error(`Unexpected import: ${n}`);
  }, mod, mod.exports);
  return mod.exports;
}

let pass = 0, fail = 0;
async function test(name, fn) {
  let why;
  try { why = await fn(); } catch (e) { why = `threw: ${e.message}`; }
  if (why === true) { pass++; console.log(`  ✓ ${name}`); } else { fail++; console.log(`  ✗ ${name}${why ? ` — ${why}` : ''}`); }
}

(async () => {
  console.log('Fee reconciliation\n');
  await test('a student or teacher cannot run it or see other students\' payments', async () => {
    const calls = [];
    const route = loadRoute(calls);
    const student = await route.GET({ role: 'student' });
    const teacher = await route.POST({ role: 'teacher' });
    return student.status === 403 && teacher.status === 403 && calls.length === 0 ? true : `${student.status}/${teacher.status}, ran ${calls.length}x`;
  });
  await test('an admin runs it', async () => {
    const calls = [];
    const res = await loadRoute(calls).GET({ role: 'admin' });
    return res.status === 200 && calls.length === 1 ? true : `${res.status}`;
  });
  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})();
