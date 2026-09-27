/**
 * Code Wars match save: rows really reach codewars_matches (20260822 schema), history is kept,
 * and a student cannot overwrite another student's match.
 *
 *   node scripts/tests/test_codewars_matches.cjs
 *   (from the sandbox: node dark-gracity/claude_sandbox/test_codewars_matches.cjs)
 *   CODEWARS_SRC=src … runs the same checks against the current src/ route.
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
const USE_SRC = process.env.CODEWARS_SRC === 'src' || !fs.existsSync(path.join(__dirname, 'codewars-matches-route.ts'));
const ROUTE = USE_SRC ? path.join(ROOT, 'src/app/api/codewars/matches/route.ts') : path.join(__dirname, 'codewars-matches-route.ts');
const A = 'aaaaaaaa-0000-4000-8000-000000000001';
const B = 'bbbbbbbb-0000-4000-8000-000000000002';

// codewars_matches as created by 20260822_phase2_phase3_ecosystem.sql (what production has).
const COLUMNS = new Set(['id', 'student_id', 'problem_id', 'mode', 'opponent_name', 'opponent_progress_pct', 'status', 'score',
  'time_spent_seconds', 'execution_logs', 'evidence_record_id', 'started_at', 'created_at']);
const NOT_NULL = ['id', 'student_id', 'problem_id', 'mode', 'status', 'started_at'];
const CHECKS = { mode: ['1v1_duel', 'solo_speedrun', 'boss_challenge'], status: ['active', 'victory', 'defeat', 'timeout'] };

function createDb() {
  const tables = {
    users: [{ id: A, onboarding_answers: { role: 'SDE' }, xp_total: 10 }, { id: B, onboarding_answers: {}, xp_total: 0 }],
    codewars_matches: [],
    competency_evidence_records: [{ id: 'ev_real' }],
  };
  const validate = (row) => {
    const unknown = Object.keys(row).find((k) => !COLUMNS.has(k));
    if (unknown) return { code: 'PGRST204', message: `Could not find the '${unknown}' column of 'codewars_matches' in the schema cache` };
    const missing = NOT_NULL.find((k) => row[k] === undefined || row[k] === null);
    if (missing) return { code: '23502', message: `null value in column "${missing}" violates not-null constraint` };
    for (const [col, allowed] of Object.entries(CHECKS)) if (!allowed.includes(row[col])) return { code: '23514', message: `check constraint on ${col}` };
    if (row.evidence_record_id && !tables.competency_evidence_records.some((e) => e.id === row.evidence_record_id)) {
      return { code: '23503', message: 'evidence_record_id foreign key violation' };
    }
    return null;
  };
  const from = (table) => {
    const q = { op: 'select', filters: [], payload: null };
    const matches = (r) => q.filters.every(([c, v]) => r[c] === v);
    const exec = (mode) => {
      const rows = tables[table];
      if (q.op === 'upsert') {
        const err = table === 'codewars_matches' ? validate(q.payload) : null;
        if (err) return { data: null, error: err };
        const i = rows.findIndex((r) => r.id === q.payload.id);
        if (i >= 0) rows[i] = { ...rows[i], ...q.payload }; else rows.push({ ...q.payload });
        return { data: null, error: null };
      }
      if (q.op === 'update') { rows.filter(matches).forEach((r) => Object.assign(r, JSON.parse(JSON.stringify(q.payload)))); return { data: null, error: null }; }
      const found = rows.filter(matches).map((r) => JSON.parse(JSON.stringify(r)));
      return mode === 'many' ? { data: found, error: null } : { data: found[0] || null, error: null };
    };
    const chain = {
      select() { return chain; },
      eq(c, v) { q.filters.push([c, v]); return chain; },
      upsert(p) { q.op = 'upsert'; q.payload = p; return chain; },
      update(p) { q.op = 'update'; q.payload = p; return chain; },
      maybeSingle() { return Promise.resolve(exec('one')); },
      then(res, rej) { return Promise.resolve(exec('many')).then(res, rej); },
    };
    return chain;
  };
  return { client: { from }, tables };
}

function loadRoute(db) {
  const out = ts.transpileModule(fs.readFileSync(ROUTE, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true } }).outputText;
  const json = (body, init = {}) => ({ status: init.status || 200, body });
  const mocks = {
    'next/server': { NextResponse: { json } },
    '@/lib/server/requireAuth': {
      requireUserFromRequest: async (req) => req.userId ? { user: { id: req.userId }, error: null } : { user: null, error: json({ error: 'UNAUTHORIZED' }, { status: 401 }) },
    },
    '@/lib/server/supabaseAdmin': { getSupabaseAdmin: () => db.client },
  };
  const mod = { exports: {} };
  new Function('require', 'module', 'exports', out)((n) => { if (n in mocks) return mocks[n]; throw new Error(`Unexpected import: ${n}`); }, mod, mod.exports);
  return mod.exports;
}
const request = (userId, body) => ({ userId, json: async () => body });
const MATCH = {
  id: 'match_1', problemId: 'war_tree_lca_01', mode: '1v1_duel', studentId: 'client-says-someone-else',
  opponent: { id: 'bot', name: 'Shadow Bot', avatarUrl: '', progressPct: 72.4, completed: false, timeElapsedSeconds: 300 },
  startedAt: 1790000000000, status: 'victory', timeSpentSeconds: 412, score: 88, executionLogs: 'ok', evidenceRecordId: 'ev_missing',
};

let pass = 0, fail = 0;
async function test(name, fn) {
  const { error } = console; console.error = () => {};
  let why;
  try { why = await fn(); } catch (e) { why = `threw: ${e.message}`; } finally { console.error = error; }
  if (why === true) { pass++; console.log(`  ✓ ${name}`); } else { fail++; console.log(`  ✗ ${name}${why ? ` — ${why}` : ''}`); }
}

(async () => {
  console.log(`Code Wars matches (route: ${path.relative(ROOT, ROUTE)})\n`);

  await test('a finished match is saved to codewars_matches with the real columns', async () => {
    const db = createDb();
    const res = await loadRoute(db).POST(request(A, MATCH));
    const row = db.tables.codewars_matches[0];
    if (res.status !== 200) return `status ${res.status}`;
    if (!row) return 'no row saved (insert rejected by the table)';
    if (row.student_id !== A || row.problem_id !== 'war_tree_lca_01' || row.mode !== '1v1_duel' || row.status !== 'victory') return JSON.stringify(row);
    return row.started_at === 1790000000000 && row.score === 88 && row.time_spent_seconds === 412 && row.opponent_progress_pct === 72 ? true : JSON.stringify(row);
  });

  await test('owner comes from the login, not the request body', async () => {
    const db = createDb();
    await loadRoute(db).POST(request(A, MATCH));
    const hist = db.tables.users.find((u) => u.id === A).onboarding_answers.codewars_history;
    return db.tables.codewars_matches[0]?.student_id === A && hist[0].studentId === A ? true : 'body studentId trusted';
  });

  await test('unknown evidence id does not break the save', async () => {
    const db = createDb();
    await loadRoute(db).POST(request(A, MATCH));
    const row = db.tables.codewars_matches[0];
    return row && row.evidence_record_id === null ? true : `row ${row ? row.evidence_record_id : 'missing'}`;
  });

  await test('real evidence id is kept', async () => {
    const db = createDb();
    await loadRoute(db).POST(request(A, { ...MATCH, evidenceRecordId: 'ev_real' }));
    return db.tables.codewars_matches[0]?.evidence_record_id === 'ev_real' ? true : 'dropped';
  });

  await test("a student cannot overwrite another student's match (403)", async () => {
    const db = createDb();
    const route = loadRoute(db);
    await route.POST(request(B, { ...MATCH, status: 'defeat', score: 10 }));
    if (!db.tables.codewars_matches.length) return 'setup: B match not saved';
    const res = await route.POST(request(A, { ...MATCH, status: 'victory', score: 100 }));
    const row = db.tables.codewars_matches[0];
    if (res.status !== 403) return `status ${res.status}`;
    return row.student_id === B && row.status === 'defeat' ? true : 'victim row changed';
  });

  await test('bad mode / status are normalised; missing problem → 400', async () => {
    const db = createDb();
    const route = loadRoute(db);
    await route.POST(request(A, { ...MATCH, id: 'm2', mode: 'hacker_mode', status: 'win!!' }));
    const row = db.tables.codewars_matches.find((r) => r.id === 'm2');
    const bad = await route.POST(request(A, { id: 'm3' }));
    if (!row || row.mode !== '1v1_duel' || row.status !== 'active') return `row ${JSON.stringify(row)}`;
    return bad.status === 400 ? true : `missing problem → ${bad.status}`;
  });

  await test('history still saved and returned by GET', async () => {
    const db = createDb();
    const route = loadRoute(db);
    await route.POST(request(A, MATCH));
    await route.POST(request(A, { ...MATCH, id: 'match_2' }));
    const res = await route.GET(request(A));
    const ids = (res.body.matches || []).map((m) => m.id).join(',');
    return ids === 'match_2,match_1' ? true : ids;
  });

  await test('not logged in → 401', async () => {
    const route = loadRoute(createDb());
    const p = await route.POST(request(null, MATCH));
    const g = await route.GET(request(null));
    return p.status === 401 && g.status === 401 ? true : `${p.status}/${g.status}`;
  });

  console.log(`\n${pass}/${pass + fail} passed`);
  process.exit(fail ? 1 : 0);
})();
