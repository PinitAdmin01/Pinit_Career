/**
 * XP integrity (audit T3d/T3b): the browser can report only small XP (max 50 each, 500 a day, no
 * "proof" field that lifts it); bigger rewards are granted by the server where it verified the
 * activity (interview evaluation, signed project audit, server-judged Code Wars first clear); the
 * app shows the XP the server saved.
 *
 *   node scripts/tests/test_xp_integrity.cjs
 *   (the real code judge is exercised by: npx tsx scripts/tests/test_code_judge.ts)
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
const FILES = {
  xpAdd: path.join(ROOT, 'src/app/api/xp/add/route.ts'),
  xpGrant: path.join(ROOT, 'src/lib/server/xpGrant.ts'),
  projectReward: path.join(ROOT, 'src/lib/github/projectReward.ts'),
  projectXp: path.join(ROOT, 'src/app/api/projects/xp/route.ts'),
  judge: path.join(ROOT, 'src/lib/server/codeWarsJudge.ts'),
  evaluate: path.join(ROOT, 'src/app/api/interview/evaluate/route.ts'),
  codeEvaluate: path.join(ROOT, 'src/app/api/code/evaluate/route.ts'),
  context: path.join(ROOT, 'src/lib/context/UserProgressContext.tsx'),
  interviewPage: path.join(ROOT, 'src/app/interview/page.tsx'),
  projectsPage: path.join(ROOT, 'src/app/projects/page.tsx'),
  arenaPage: path.join(ROOT, 'src/app/arena/page.tsx'),
  ingest: path.join(ROOT, 'src/app/api/github/ingest/route.ts'),
};
process.env.NEXTAUTH_SECRET = 'test-signing-secret';
process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://supabase.test';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-key';

function load(file, mocks = {}) {
  if (!fs.existsSync(file)) return null;
  const out = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    fileName: file, compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
  }).outputText;
  const mod = { exports: {} };
  new Function('require', 'module', 'exports', out)((n) => {
    if (n in mocks) return mocks[n];
    if (n === 'crypto') return require('crypto');
    throw new Error(`Unexpected import in ${path.basename(file)}: ${n}`);
  }, mod, mod.exports);
  return mod.exports;
}

const STUDENT = 'aaaaaaaa-0000-4000-8000-000000000001';
const OTHER = 'bbbbbbbb-0000-4000-8000-000000000002';

/** users + xp_ledger, with increment_xp behaving like the database function (1..500 per call). */
function createDb({ ledger = [] } = {}) {
  const tables = { users: [{ id: STUDENT, xp_total: 1000 }, { id: OTHER, xp_total: 0 }], xp_ledger: [...ledger] };
  const rpcCalls = [];
  const from = (table) => {
    const q = { filters: [], gte: null, limit: null };
    const exec = () => {
      let rows = tables[table].filter((r) => q.filters.every(([c, v]) => r[c] === v));
      if (q.gte) rows = rows.filter((r) => r[q.gte[0]] >= q.gte[1]);
      if (q.limit) rows = rows.slice(0, q.limit);
      return { data: rows.map((r) => ({ ...r })), error: null };
    };
    const chain = {
      select() { return chain; },
      eq(c, v) { q.filters.push([c, v]); return chain; },
      gte(c, v) { q.gte = [c, v]; return chain; },
      limit(n) { q.limit = n; return chain; },
      then(res, rej) { return Promise.resolve(exec()).then(res, rej); },
    };
    return chain;
  };
  const rpc = async (name, args) => {
    rpcCalls.push([name, args]);
    if (name !== 'increment_xp') return { data: null, error: { message: 'unknown rpc' } };
    if (!(args.p_amount > 0 && args.p_amount <= 500)) return { data: { ok: false, reason: 'INVALID_XP_AMOUNT' }, error: null };
    const user = tables.users.find((u) => u.id === args.p_user_id);
    user.xp_total += args.p_amount;
    tables.xp_ledger.push({ user_id: args.p_user_id, amount: args.p_amount, reason: args.p_reason, created_at: new Date().toISOString() });
    return { data: { ok: true, new_xp: user.xp_total, new_level: Math.floor(user.xp_total / 1000) + 1 }, error: null };
  };
  return { client: { from, rpc }, tables, rpcCalls };
}

const json = (body, init = {}) => ({ status: init.status || 200, body });
const auth = {
  requireUserFromRequest: async (req) => req.userId ? { user: { id: req.userId }, error: null } : { user: null, error: json({ error: 'UNAUTHORIZED' }, { status: 401 }) },
};
const req = (userId, body) => ({ userId, json: async () => body, headers: { get: () => null } });

const xpGrant = load(FILES.xpGrant);
const projectReward = load(FILES.projectReward);

function addXp(db, userId, body) {
  const route = load(FILES.xpAdd, {
    'next/server': { NextResponse: { json } },
    '@/lib/server/requireAuth': auth,
    '@supabase/supabase-js': { createClient: () => db.client },
    '@/lib/server/rateLimit': { checkRateLimit: () => ({ allowed: true }), getClientIp: () => '1.2.3.4' },
    '@/lib/server/validate': { validateBody: () => ({}) },
    zod: { z: {} },
  });
  return route.POST(req(userId, body));
}

function claimProjectXp(db, userId, body) {
  const route = load(FILES.projectXp, {
    'next/server': { NextResponse: { json } },
    '@/lib/server/requireAuth': auth,
    '@/lib/server/supabaseAdmin': { getSupabaseAdmin: () => db.client },
    '@/lib/server/xpGrant': xpGrant,
    '@/lib/github/projectReward': projectReward,
  });
  return route.POST(req(userId, body));
}

const REPO = 'https://github.com/asha/chat-engine';
const signed = (userId, score, authored, repoUrl = REPO) => ({
  repoUrl, score, authored, rewardToken: projectReward.signProjectReward({ userId, repoUrl, score, authored }),
});

let pass = 0, fail = 0;
async function test(name, fn) {
  const { error, warn } = console; console.error = () => {}; console.warn = () => {};
  let why;
  try { why = await fn(); } catch (e) { why = `threw: ${e.message}`; } finally { console.error = error; console.warn = warn; }
  if (why === true) { pass++; console.log(`  ✓ ${name}`); } else { fail++; console.log(`  ✗ ${name}${why ? ` — ${why}` : ''}`); }
}

(async () => {
  console.log('XP integrity\n');

  await test('browser-reported XP: at most 50 per award; a "proofToken" no longer lifts the limit', async () => {
    const db = createDb();
    const big = await addXp(db, STUDENT, { amount: 3000 / 6, reason: 'mint', proofToken: 'anything' });
    if (big.status !== 400 || db.tables.xp_ledger.length) return `500 XP with a proof string → ${big.status} (${db.tables.xp_ledger.length} grants)`;
    const fifty1 = await addXp(db, STUDENT, { amount: 51, reason: 'x', verifiedProof: true });
    if (fifty1.status !== 400) return `51 XP → ${fifty1.status}`;
    const ok = await addXp(db, STUDENT, { amount: 40, reason: 'Daily Focus Quest' });
    const row = db.tables.xp_ledger[0];
    if (ok.status !== 200 || ok.body.newXp !== 1040) return `40 XP → ${ok.status} ${JSON.stringify(ok.body)}`;
    return row && row.reason.startsWith('[client:general]') ? true : `ledger reason ${row && row.reason}`;
  });

  await test('browser-reported XP: at most 500 a day; interview/project XP cannot be minted here', async () => {
    const today = new Date().toISOString();
    const db = createDb({ ledger: Array.from({ length: 10 }, () => ({ user_id: STUDENT, amount: 48, reason: '[client:general] x', created_at: today })) });
    const over = await addXp(db, STUDENT, { amount: 30, reason: 'x' });
    if (over.status !== 429 || over.body.error !== 'CLIENT_XP_DAILY_LIMIT') return `over the daily limit → ${over.status} ${over.body.error}`;
    const within = await addXp(db, STUDENT, { amount: 20, reason: 'x' });
    if (within.status !== 200) return `within the limit → ${within.status}`;
    const serverOnly = createDb({ ledger: [{ user_id: STUDENT, amount: 500, reason: '[project] https://github.com/a/b', created_at: today }] });
    const stillOk = await addXp(serverOnly, STUDENT, { amount: 50, reason: 'x' });
    if (stillOk.status !== 200) return 'server-granted XP counted against the browser limit';
    for (const actionType of ['interview', 'project', 'quest']) {
      const r = await addXp(createDb(), STUDENT, { amount: 10, reason: 'x', actionType });
      if (r.status !== 403) return `actionType ${actionType} → ${r.status}`;
    }
    return true;
  });

  await test('server grants: large rewards are split into ≤500 calls; today / once-only lookups', async () => {
    if (!xpGrant) return 'src/lib/server/xpGrant.ts missing';
    const db = createDb();
    const g = await xpGrant.grantXp(db.client, STUDENT, 1000, '[project] https://github.com/a/b');
    if (!g.ok || g.newXp !== 2000 || db.rpcCalls.length !== 2 || db.rpcCalls.some(([, a]) => a.p_amount > 500)) return JSON.stringify({ g, calls: db.rpcCalls.length });
    await xpGrant.grantXp(db.client, STUDENT, 150, '[interview] Passed AI interview: SDE');
    const interviews = await xpGrant.todaysXp(db.client, STUDENT, '[interview]');
    if (!interviews || interviews.count !== 1 || interviews.total !== 150) return `todaysXp ${JSON.stringify(interviews)}`;
    const once = await xpGrant.xpAlreadyGranted(db.client, STUDENT, '[project] https://github.com/a/b');
    const never = await xpGrant.xpAlreadyGranted(db.client, OTHER, '[project] https://github.com/a/b');
    return once === true && never === false ? true : `once=${once} never=${never}`;
  });

  await test('project XP: only for the audit the server signed for this student; score bar is the server\'s', async () => {
    if (!projectReward || !fs.existsSync(FILES.projectXp)) return 'project XP route missing';
    const db = createDb();
    const forged = await claimProjectXp(db, STUDENT, { repoUrl: REPO, score: 95, authored: true, rewardToken: 'a'.repeat(64) });
    if (forged.status !== 403) return `forged token → ${forged.status}`;
    const edited = await claimProjectXp(db, STUDENT, { ...signed(STUDENT, 60, false), score: 95, authored: true });
    if (edited.status !== 403) return `edited score/authorship → ${edited.status}`;
    const someoneElses = await claimProjectXp(db, STUDENT, signed(OTHER, 95, true));
    if (someoneElses.status !== 403) return `another student's audit → ${someoneElses.status}`;
    const low = await claimProjectXp(db, STUDENT, signed(STUDENT, 70, true));
    if (low.status !== 409 || low.body.error !== 'SCORE_TOO_LOW') return `score 70 → ${low.status} ${low.body.error}`;
    return db.tables.xp_ledger.length === 0 ? true : 'XP granted by a refused claim';
  });

  await test('project XP: 1000 authored / 250 reference, once per repository (any spelling of its URL)', async () => {
    if (!projectReward || !fs.existsSync(FILES.projectXp)) return 'project XP route missing';
    const db = createDb();
    const first = await claimProjectXp(db, STUDENT, signed(STUDENT, 92, true));
    if (first.status !== 200 || first.body.xpAwarded !== 1000 || first.body.newXp !== 2000) return `authored → ${JSON.stringify(first.body)}`;
    const again = await claimProjectXp(db, STUDENT, signed(STUDENT, 92, true, 'https://github.com/Asha/Chat-Engine.git'));
    if (again.body.xpAwarded !== 0 || !again.body.alreadyAwarded) return `second claim → ${JSON.stringify(again.body)}`;
    const ref = await claimProjectXp(db, STUDENT, signed(STUDENT, 85, false, 'https://github.com/other/lib/tree/main'));
    if (ref.body.xpAwarded !== 250) return `reference → ${JSON.stringify(ref.body)}`;
    return db.tables.users[0].xp_total === 2250 ? true : `xp_total ${db.tables.users[0].xp_total}`;
  });

  await test('interview and Code Wars XP are granted by the server where it evaluated / judged', async () => {
    const evaluate = fs.readFileSync(FILES.evaluate, 'utf8');
    if (!/grantXp\(admin, gated\.user\.id, INTERVIEW_PASS_XP/.test(evaluate) || !/today\.count < INTERVIEW_XP_PER_DAY/.test(evaluate)) return 'evaluate route does not grant the interview XP (with a daily limit)';
    if (!/verdict === 'Hire' \|\| finalEvaluation\.verdict === 'Conditional Hire'/.test(evaluate)) return 'interview XP not tied to a pass';
    const code = fs.readFileSync(FILES.codeEvaluate, 'utf8');
    if ((code.match(/evalRes\.passed \? await firstClearXp|judged\.passed \? await firstClearXp/g) || []).length !== 2) return 'code evaluate does not grant first-clear XP on a judged pass';
    const judge = fs.readFileSync(FILES.judge, 'utf8');
    if (!/\[arena\] first clear: \$\{problemId\}/.test(judge) || !/xpAlreadyGranted/.test(judge)) return 'first-clear XP is not once per problem';
    const ingest = fs.readFileSync(FILES.ingest, 'utf8');
    return /rewardToken = signProjectReward\(\{ userId: gated\.user\.id/.test(ingest) ? true : 'audit result not signed for the student';
  });

  await test('the app shows the XP the server saved (no local-only XP for signed-in students)', async () => {
    const ctx = fs.readFileSync(FILES.context, 'utf8');
    if (/Math\.max\(prev, serverXp\)/.test(ctx)) return 'a higher local XP still overrides the server total';
    if (!/setXpState\(serverXp\)/.test(ctx)) return 'server XP not applied on load';
    const addXpBody = ctx.slice(ctx.indexOf('const addXp = useCallback'), ctx.indexOf('const completeMission'));
    if (/\.catch\(\(\) => \{\}\)/.test(addXpBody)) return 'addXp still ignores a refused award';
    if (!/applyServerXp\(res\?\.newXp/.test(addXpBody)) return 'addXp does not show the saved total';
    const pages = [FILES.interviewPage, FILES.projectsPage, FILES.arenaPage].map((f) => fs.readFileSync(f, 'utf8'));
    if (pages.some((p) => /addXp\((150|earnedXp|activeProblem\.xpReward)/.test(p))) return 'a page still adds big XP locally';
    return pages.every((p) => /applyServerXp\(/.test(p)) ? true : 'a page does not show the server-granted XP';
  });

  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})();
