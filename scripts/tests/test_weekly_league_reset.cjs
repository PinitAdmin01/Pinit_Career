/**
 * Weekly league reset (cron): when the database function is unavailable, the Node fallback uses the
 * same rules as public.evaluate_weekly_leagues() (Phase B6b) — students only, every move decided from
 * one snapshot, an empty weekly XP counts as 0, totals are the players actually moved.
 * Same week of players as dark-gracity/claude_sandbox/test_phase_b6b_weekly_leagues_sql.mjs.
 *
 *   node scripts/tests/test_weekly_league_reset.cjs
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
const ROUTE = path.join(ROOT, 'src/app/api/cron/weekly-league-reset/route.ts');
const LIB = path.join(ROOT, 'src/lib/leagues/weeklyLeague.ts');

function transpile(file, mocks) {
  const out = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    fileName: file, compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
  }).outputText;
  const mod = { exports: {} };
  const req = (spec) => {
    if (spec in mocks) return mocks[spec];
    throw new Error('unexpected import ' + spec);
  };
  new Function('module', 'exports', 'require', out)(mod, mod.exports, req);
  return mod.exports;
}
const league = transpile(LIB, {});

/** Fake service-role client: users table with select/or/in/order/range and update/eq/neq. */
function createDb(users, { rpc = { data: null, error: { message: 'function public.evaluate_weekly_leagues() does not exist' } } } = {}) {
  const log = { ranges: [], updates: 0, rpcCalls: 0 };
  const from = (table) => {
    if (table !== 'users') throw new Error('unexpected table ' + table);
    const q = { or: null, inF: null, range: null, patch: null, eq: null, neq: null, orders: [] };
    const exec = () => {
      if (q.patch) {
        log.updates++;
        for (const u of users) {
          if (q.eq && u[q.eq[0]] !== q.eq[1]) continue;
          if (q.neq && u[q.neq[0]] === q.neq[1]) continue;
          Object.assign(u, JSON.parse(JSON.stringify(q.patch)));
        }
        return { data: null, error: null };
      }
      let rows = users;
      if (q.or === 'role.eq.student,role.is.null') rows = rows.filter((r) => r.role === 'student' || r.role == null);
      else if (q.or) throw new Error('unexpected or ' + q.or);
      if (q.inF) rows = rows.filter((r) => q.inF[1].includes(r[q.inF[0]]));
      if (q.eq) rows = rows.filter((r) => r[q.eq[0]] === q.eq[1]);
      // Postgres ordering: NULLs sort first when descending, last when ascending
      const cmp = (a, b) => {
        for (const [c, asc] of q.orders) {
          const x = a[c], y = b[c];
          if (x === y) continue;
          if (x == null) return asc ? 1 : -1;
          if (y == null) return asc ? -1 : 1;
          return (x < y ? -1 : 1) * (asc ? 1 : -1);
        }
        return 0;
      };
      rows = [...rows].sort(cmp);
      // Like the real API: at most 1000 rows per request
      if (q.range) { log.ranges.push(q.range); rows = rows.slice(q.range[0], Math.min(q.range[1] + 1, q.range[0] + 1000)); }
      else rows = rows.slice(0, 1000);
      return { data: rows.map((r) => JSON.parse(JSON.stringify(r))), error: null };
    };
    const chain = {
      select() { return chain; },
      or(expr) { q.or = expr; return chain; },
      in(c, v) { q.inF = [c, v]; return chain; },
      order(c, o) { q.orders.push([c, !o || o.ascending !== false]); return chain; },
      range(a, b) { q.range = [a, b]; return chain; },
      update(p) { q.patch = p; return chain; },
      eq(c, v) { q.eq = [c, v]; return chain; },
      neq(c, v) { q.neq = [c, v]; return chain; },
      then(res, rej) { return Promise.resolve(exec()).then(res, rej); },
    };
    return chain;
  };
  return { from, rpc: async () => { log.rpcCalls++; return rpc; }, log };
}

function loadRoute(db) {
  const json = (body, init = {}) => ({ status: init.status || 200, body });
  return transpile(ROUTE, {
    'next/server': { NextResponse: { json } },
    '@/lib/server/supabaseAdmin': { getSupabaseAdmin: () => db },
    '@/lib/leagues/weeklyLeague': league,
  });
}
const cronReq = (secret = 'cron-secret') => ({ headers: { get: (h) => (h.toLowerCase() === 'authorization' ? `Bearer ${secret}` : null) } });

const uid = (ch, n) => `${ch.repeat(8)}-0000-0000-0000-${String(n).padStart(12, '0')}`;
const T = '44444444-4444-4444-4444-444444444444';
const A = '88888888-8888-8888-8888-888888888888';
function week() {
  const p = (id, role, tier, weekly) => ({ id, role, league_tier: tier, weekly_xp: weekly, xp_total: 1000, league_history: [] });
  return [
    p(uid('b', 1), 'student', 'browns', 50), p(uid('b', 2), null, 'browns', 10),
    p(T, 'teacher', 'browns', 999), p(A, 'admin', 'browns', 500),
    p(uid('c', 1), 'student', 'silver', null), p(uid('c', 2), 'student', 'silver', 40),
    ...Array.from({ length: 10 }, (_, i) => p(uid('d', i + 1), 'student', 'gold', 10 * (i + 1))),
    ...Array.from({ length: 10 }, (_, i) => p(uid('e', i + 1), 'student', 'platinum', 110 + 10 * i)),
    ...Array.from({ length: 10 }, (_, i) => p(uid('f', i + 1), 'student', 'ruby', 510 + 10 * i)),
  ];
}

let passed = 0;
let failed = 0;
async function test(name, fn) {
  try {
    const r = await fn();
    if (r === true) { passed++; console.log('  ✓ ' + name); }
    else { failed++; console.log('  ✗ ' + name + ' — ' + r); }
  } catch (e) { failed++; console.log('  ✗ ' + name + ' — threw ' + (e && e.stack || e)); }
}

(async () => {
  console.log('\nWeekly league reset\n');
  process.env.CRON_SECRET = 'cron-secret';

  await test('without the cron secret nothing runs', async () => {
    const db = createDb(week()); const route = loadRoute(db);
    const res = await route.GET(cronReq('wrong'));
    return res.status === 401 && db.log.rpcCalls === 0 && db.log.updates === 0 ? true : JSON.stringify(res);
  });

  await test('when the database function runs, the fallback does not', async () => {
    const db = createDb(week(), { rpc: { data: { ok: true, total_promoted: 4 }, error: null } }); const route = loadRoute(db);
    const res = await route.POST(cronReq());
    return res.body.source === 'stored_procedure' && db.log.updates === 0 ? true : JSON.stringify(res.body);
  });

  await test('fallback: same results as the database function (students only, one snapshot)', async () => {
    const users = week(); const db = createDb(users); const route = loadRoute(db);
    const res = await route.GET(cronReq());
    const by = Object.fromEntries(users.map((u) => [u.id, u]));
    const t = (ch, n) => by[uid(ch, n)].league_tier;
    const problems = [];
    if (res.body.source !== 'batch_fallback' || res.body.totalPromoted !== 4 || res.body.totalDemoted !== 3) problems.push('totals ' + JSON.stringify(res.body));
    if (by[T].league_tier !== 'browns' || by[A].league_tier !== 'browns' || by[T].league_history.length) problems.push('staff moved');
    if (t('b', 1) !== 'silver' || t('b', 2) !== 'browns') problems.push('browns');
    if (t('c', 2) !== 'gold' || t('c', 1) !== 'silver') problems.push('silver (empty weekly XP)');
    if (t('d', 10) !== 'platinum' || t('d', 1) !== 'silver') problems.push('gold');
    if (t('e', 10) !== 'ruby' || t('e', 1) !== 'gold') problems.push('platinum');
    if (t('f', 1) !== 'platinum' || by[uid('f', 1)].league_history.length !== 1) problems.push('ruby demoted twice or promoted back');
    if (!users.every((u) => u.weekly_xp === 0 && u.last_league_eval)) problems.push('weekly reset');
    const h = by[uid('e', 10)].league_history[0];
    if (!h || h.outcome !== 'promoted' || h.from !== 'platinum' || h.to !== 'ruby' || h.weekly_xp !== 200) problems.push('history ' + JSON.stringify(h));
    return problems.length ? problems.join('; ') : true;
  });

  await test('fallback reads every student, not just the first 1000', async () => {
    const users = Array.from({ length: 2500 }, (_, i) => ({ id: `aaaaaaaa-0000-0000-0000-${String(i).padStart(12, '0')}`, role: 'student', league_tier: 'browns', weekly_xp: i, xp_total: 0, league_history: [] }));
    const db = createDb(users); const route = loadRoute(db);
    const res = await route.GET(cronReq());
    // 2500 in browns: the top 250 (weekly XP 2250..2499) are promoted; browns never demotes
    const promoted = users.filter((u) => u.league_tier === 'silver');
    return db.log.ranges.length === 3 && promoted.length === 250 && promoted.every((u) => u.league_history[0].weekly_xp >= 2250) && res.body.totalPromoted === 250
      ? true : `ranges ${JSON.stringify(db.log.ranges)}, promoted ${promoted.length}`;
  });

  await test('cutoffs use whole numbers (30 players: 3 up, 3 down — not 4 from 30 * 0.1)', async () => {
    const players = Array.from({ length: 30 }, (_, i) => ({ id: 'p' + String(i).padStart(2, '0'), league_tier: 'gold', weekly_xp: i, xp_total: 0 }));
    const moves = league.planWeeklyLeagueMoves(players);
    const up = moves.filter((m) => m.outcome === 'promoted').length; const down = moves.filter((m) => m.outcome === 'demoted').length;
    return up === 3 && down === 3 ? true : `${up} up, ${down} down`;
  });

  await test('small tiers: 2–9 players promote one and demote nobody; a lone player stays', async () => {
    const two = league.planWeeklyLeagueMoves([{ id: 'a', league_tier: 'gold', weekly_xp: 5, xp_total: 0 }, { id: 'b', league_tier: 'gold', weekly_xp: 1, xp_total: 0 }]);
    const one = league.planWeeklyLeagueMoves([{ id: 'a', league_tier: 'gold', weekly_xp: 5, xp_total: 0 }]);
    return two.length === 1 && two[0].id === 'a' && two[0].to === 'platinum' && one.length === 0 ? true : JSON.stringify({ two, one });
  });

  console.log(`\n${passed} passed, ${failed} failed\n`);
  process.exit(failed ? 1 : 0);
})();
