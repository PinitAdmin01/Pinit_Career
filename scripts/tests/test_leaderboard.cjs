/**
 * Leaderboard: signed-in users only, students only (no staff/parents/recruiters), never made-up
 * students in production, and the weekly league reset is actually scheduled.
 *
 *   node scripts/tests/test_leaderboard.cjs
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
const ROUTE = path.join(ROOT, 'src/app/api/leaderboard/route.ts');

function createDb(users, { failUsers = false } = {}) {
  const from = (table) => {
    const q = { filters: [], or: null, inF: null };
    const exec = () => {
      if (table === 'users' && failUsers) return { data: null, error: { message: 'relation error' } };
      let rows = table === 'users' ? users : [];
      rows = rows.filter((r) => q.filters.every(([c, v]) => r[c] === v));
      if (q.or === 'role.eq.student,role.is.null') rows = rows.filter((r) => r.role === 'student' || r.role == null);
      if (q.inF) rows = rows.filter((r) => q.inF[1].includes(r[q.inF[0]]));
      return { data: q.single ? rows[0] || null : rows.map((r) => ({ ...r })), error: null };
    };
    const chain = {
      select() { return chain; },
      eq(c, v) { q.filters.push([c, v]); return chain; },
      or(expr) { q.or = expr; return chain; },
      in(c, v) { q.inF = [c, v]; return chain; },
      order() { return chain; },
      limit() { return chain; },
      maybeSingle() { q.single = true; return Promise.resolve(exec()); },
      then(res, rej) { return Promise.resolve(exec()).then(res, rej); },
    };
    return chain;
  };
  return { from };
}

function loadRoute(db) {
  const out = ts.transpileModule(fs.readFileSync(ROUTE, 'utf8'), {
    fileName: ROUTE, compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
  }).outputText;
  const json = (body, init = {}) => ({ status: init.status || 200, body });
  const mod = { exports: {} };
  const mocks = {
    'next/server': { NextResponse: { json } },
    '@/lib/server/requireAuth': {
      requireUserFromRequest: async (req) => (req.userId ? { user: { id: req.userId }, error: null } : { user: null, error: json({ error: 'UNAUTHORIZED' }, { status: 401 }) }),
    },
    '@/lib/server/supabaseAdmin': { getSupabaseAdmin: () => db },
    '@/lib/server/rateLimit': { checkRateLimit: () => ({ allowed: true }), getClientIp: () => '1.1.1.1' },
  };
  new Function('require', 'module', 'exports', out)((n) => {
    if (n in mocks) return mocks[n];
    throw new Error(`Unexpected import: ${n}`);
  }, mod, mod.exports);
  return mod.exports;
}
const get = (db, userId, qs = '') => loadRoute(db).GET({ userId, url: `http://localhost/api/leaderboard${qs}` });

const FAKE_NAMES = /Tanvi Agarwal|Aarav Patel|Diya Sharma|Kabir Verma/;
const S1 = { id: 's1', role: 'student', display_name: 'Asha', league_tier: 'browns', weekly_xp: 300, xp_total: 900 };
const S2 = { id: 's2', role: null, display_name: 'Bala', league_tier: 'browns', weekly_xp: 200, xp_total: 700 };
const ADMIN = { id: 'a1', role: 'admin', display_name: 'Principal', league_tier: 'browns', weekly_xp: 0, xp_total: 0 };
const PARENT = { id: 'p1', role: 'parent', display_name: 'Parent', league_tier: 'browns', weekly_xp: 0, xp_total: 0 };

let pass = 0, fail = 0;
async function test(name, fn) {
  const { error } = console; console.error = () => {};
  let why;
  try { why = await fn(); } catch (e) { why = `threw: ${e.message}`; } finally { console.error = error; }
  if (why === true) { pass++; console.log(`  ✓ ${name}`); } else { fail++; console.log(`  ✗ ${name}${why ? ` — ${why}` : ''}`); }
}

(async () => {
  console.log('Leaderboard\n');
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://supabase.test';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-key';

  await test('signed-out visitors get no student data', async () => {
    const res = await get(createDb([S1, S2]), null);
    return res.status === 401 ? true : `${res.status} (was: everyone's names, colleges and scores)`;
  });

  await test('only students are ranked (no admins or parents), in the list and the league counts', async () => {
    const res = await get(createDb([S1, S2, ADMIN, PARENT]), 's1');
    const names = res.body.leaderboard.map((e) => e.name);
    if (names.includes('Principal') || names.includes('Parent')) return `ranked: ${names}`;
    return names.join() === 'Asha,Bala' && res.body.leagueCounts.browns === 2 ? true : `${names} / counts ${JSON.stringify(res.body.leagueCounts)}`;
  });

  await test('an empty league shows no made-up students', async () => {
    const res = await get(createDb([S1]), 's1', '?league=ruby');
    return res.status === 200 && res.body.leaderboard.length === 0 && !FAKE_NAMES.test(JSON.stringify(res.body)) ? true : JSON.stringify(res.body.leaderboard).slice(0, 150);
  });

  await test('a database error is reported, not covered with made-up students', async () => {
    const res = await get(createDb([S1], { failUsers: true }), 's1');
    return res.status === 503 && !FAKE_NAMES.test(JSON.stringify(res.body)) ? true : `${res.status} ${JSON.stringify(res.body).slice(0, 120)}`;
  });

  await test('the current student is marked as "you" from real data only', async () => {
    const res = await get(createDb([S1, S2]), 's2');
    return res.body.currentUser && res.body.currentUser.name === 'Bala' && res.body.currentUser.rank === 2 ? true : JSON.stringify(res.body.currentUser);
  });

  await test('the weekly league reset (promotions / demotions, weekly XP back to 0) is scheduled', async () => {
    const cfg = JSON.parse(fs.readFileSync(path.join(ROOT, 'vercel.json'), 'utf8'));
    const weekly = (cfg.crons || []).find((c) => c.path === '/api/cron/weekly-league-reset');
    return weekly && weekly.schedule === '30 19 * * 0' ? true : 'not in vercel.json crons (it never ran)';
  });

  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})();
