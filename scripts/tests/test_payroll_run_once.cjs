/**
 * HR payroll runs once per month (T19 / B4c): the month is claimed in payroll_runs before
 * payroll runs, so two clicks at once cannot both run it; a run that paid nobody gives the
 * month back.
 *
 *   node scripts/tests/test_payroll_run_once.cjs
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
const ROUTE = path.join(ROOT, 'src/app/api/hr/run-payroll/route.ts');
process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://supabase.test';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-key';

/** payroll_runs with a unique period_key, like the database. */
function createDb() {
  const runs = [];
  const client = {
    from: () => {
      const q = { op: null, payload: null, filters: [] };
      const chain = {
        select() { q.op = q.op || 'select'; return chain; },
        insert(p) { q.op = 'insert'; q.payload = p; return chain; },
        delete() { q.op = 'delete'; return chain; },
        eq(c, v) { q.filters.push([c, v]); return chain; },
        maybeSingle() { return chain.then((r) => r); },
        then(res, rej) {
          return new Promise((r) => setImmediate(r)).then(() => {
            if (q.op === 'insert') {
              if (runs.some((x) => x.period_key === q.payload.period_key)) return { data: null, error: { code: '23505', message: 'duplicate key' } };
              runs.push({ ...q.payload });
              return { data: null, error: null };
            }
            const match = (x) => q.filters.every(([c, v]) => x[c] === v);
            if (q.op === 'delete') {
              for (let i = runs.length - 1; i >= 0; i--) if (match(runs[i])) runs.splice(i, 1);
              return { data: null, error: null };
            }
            return { data: runs.find(match) || null, error: null };
          }).then(res, rej);
        },
      };
      return chain;
    },
  };
  return { client, runs };
}

function loadRoute(db, payroll) {
  const json = (body, init = {}) => ({ status: init.status || 200, body });
  const out = ts.transpileModule(fs.readFileSync(ROUTE, 'utf8'), {
    fileName: ROUTE, compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
  }).outputText;
  const mod = { exports: {} };
  const mocks = {
    'next/server': { NextResponse: { json } },
    '@/lib/services/hrService': { hrService: { runPayroll: payroll } },
    '@/lib/server/requireAdmin': { requireAdminFromRequest: async () => null },
    '@/lib/server/rateLimit': { checkRateLimit: () => ({ allowed: true }), getClientIp: () => '1.1.1.1' },
    '@supabase/supabase-js': { createClient: () => db.client },
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
  console.log('Payroll runs once per month\n');

  await test('two clicks at the same moment: payroll runs once', async () => {
    const db = createDb();
    let paid = 0;
    const route = loadRoute(db, async () => { paid++; return { ok: true }; });
    const [a, b] = await Promise.all([route.POST({}), route.POST({})]);
    const statuses = [a.status, b.status].sort().join(',');
    return paid === 1 && statuses === '200,409' ? true : `ran ${paid}x, statuses ${statuses}`;
  });

  await test('after a successful run the month is closed', async () => {
    const db = createDb();
    const route = loadRoute(db, async () => ({ ok: true }));
    await route.POST({});
    const again = await route.POST({});
    return again.status === 409 && again.body.error === 'ALREADY_RUN' ? true : `${again.status}`;
  });

  await test('a run that paid nobody (payroll not connected yet) gives the month back', async () => {
    const db = createDb();
    const route = loadRoute(db, async () => ({ ok: false, error: 'PAYROLL_GATEWAY_NOT_CONFIGURED' }));
    const first = await route.POST({});
    if (db.runs.length !== 0) return 'month stays claimed after a failed run';
    const second = await route.POST({});
    return first.body.ok === false && second.status !== 409 ? true : `second → ${second.status}`;
  });

  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})();
