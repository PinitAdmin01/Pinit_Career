/**
 * Internship records: no self-verification, no writing another student's record,
 * table rows returned in the shape the page reads, client uses the authenticated api.
 *
 *   node scripts/tests/test_internships.cjs
 *   (from the sandbox: node dark-gracity/claude_sandbox/test_internships.cjs)
 *   INTERNSHIPS_SRC=src … runs the same checks against the current src/ files.
 *
 * Real route code (transpiled in-memory) against an in-memory Supabase (users + internship_records).
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
const USE_SRC = process.env.INTERNSHIPS_SRC === 'src' || !fs.existsSync(path.join(__dirname, 'internships-route.ts'));
const ROUTE = USE_SRC ? path.join(ROOT, 'src/app/api/internships/route.ts') : path.join(__dirname, 'internships-route.ts');
const CLIENT = USE_SRC ? path.join(ROOT, 'src/lib/api/pathwayApi.ts') : path.join(__dirname, 'pathwayApi.ts');

const A = 'aaaaaaaa-0000-4000-8000-000000000001';
const B = 'bbbbbbbb-0000-4000-8000-000000000002';

// ── In-memory Supabase ───────────────────────────────────────────────────────
function createDb({ tableMissing = false } = {}) {
  const tables = {
    users: [
      { id: A, onboarding_answers: { role: 'Data Analyst', internships: [] } },
      { id: B, onboarding_answers: { internships: [] } },
    ],
    internship_records: [],
  };
  const from = (table) => {
    const q = { op: 'select', filters: [], payload: null };
    const matches = (r) => q.filters.every(([c, v]) => r[c] === v);
    const exec = (mode) => {
      if (table === 'internship_records' && tableMissing) {
        return { data: null, error: { code: '42P01', message: 'relation "internship_records" does not exist' } };
      }
      const rows = tables[table];
      if (q.op === 'upsert') {
        const i = rows.findIndex((r) => r.id === q.payload.id);
        if (i >= 0) rows[i] = { ...rows[i], ...q.payload };
        else rows.push({ created_at: new Date().toISOString(), ...q.payload });
        return { data: null, error: null };
      }
      if (q.op === 'update') {
        rows.filter(matches).forEach((r) => Object.assign(r, JSON.parse(JSON.stringify(q.payload))));
        return { data: null, error: null };
      }
      const found = rows.filter(matches).map((r) => JSON.parse(JSON.stringify(r)));
      return mode === 'many' ? { data: found, error: null } : { data: found[0] || null, error: null };
    };
    const chain = {
      select() { return chain; },
      eq(c, v) { q.filters.push([c, v]); return chain; },
      order() { return chain; },
      upsert(p) { q.op = 'upsert'; q.payload = p; return chain; },
      update(p) { q.op = 'update'; q.payload = p; return chain; },
      maybeSingle() { return Promise.resolve(exec('one')); },
      then(res, rej) { return Promise.resolve(exec('many')).then(res, rej); },
    };
    return chain;
  };
  return { client: { from }, tables };
}

// ── Module loading ───────────────────────────────────────────────────────────
function loadRoute(db) {
  const src = fs.readFileSync(ROUTE, 'utf8');
  const out = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true } }).outputText;
  const json = (body, init = {}) => ({ status: init.status || 200, body });
  const mocks = {
    'next/server': { NextResponse: { json } },
    '@/lib/server/requireAuth': {
      requireUserFromRequest: async (req) =>
        req.userId ? { user: { id: req.userId }, error: null } : { user: null, error: json({ error: 'UNAUTHORIZED' }, { status: 401 }) },
    },
    '@/lib/server/supabaseAdmin': { getSupabaseAdmin: () => db.client },
    '@/lib/pathway/competencySchema': {},
  };
  const mod = { exports: {} };
  const req = (name) => {
    if (name in mocks) return mocks[name];
    throw new Error(`Unexpected import in route: ${name}`);
  };
  new Function('require', 'module', 'exports', out)(req, mod, mod.exports);
  return mod.exports;
}

const request = (userId, body) => ({ userId, headers: new Map(), json: async () => { if (body === undefined) throw new Error('no body'); return body; } });

// ── Tests ────────────────────────────────────────────────────────────────────
let pass = 0, fail = 0;
async function test(name, fn) {
  try {
    const why = await fn();
    if (why === true) { pass++; console.log(`  ✓ ${name}`); }
    else { fail++; console.log(`  ✗ ${name}${why ? ` — ${why}` : ''}`); }
  } catch (e) { fail++; console.log(`  ✗ ${name} — threw: ${e.message}`); }
}
const answersOf = (db, id) => db.tables.users.find((u) => u.id === id).onboarding_answers.internships;
const recordOf = (res) => res.body.record || {};

(async () => {
  console.log(`Internship records (route: ${path.relative(ROOT, ROUTE)})\n`);

  await test('student cannot self-verify (verified / isVerified / verifiedBy ignored)', async () => {
    const db = createDb();
    const res = await loadRoute(db).POST(request(A, {
      id: 'intern_1', companyName: 'Acme', role: 'SDE Intern', startDate: '2026-06-01',
      verified: true, isVerified: true, verifiedBy: 'Dean of Placements', skillsUsed: ['react'],
    }));
    const row = db.tables.internship_records.find((r) => r.id === 'intern_1');
    const saved = answersOf(db, A).find((r) => r.id === 'intern_1');
    if (res.status !== 200) return `status ${res.status}`;
    if (!row || row.verified !== false || row.verified_by) return `table row verified=${row && row.verified} by=${row && row.verified_by}`;
    if (!saved || saved.isVerified !== false || saved.verified || saved.verifiedBy) return `answers entry isVerified=${saved && saved.isVerified}`;
    if (recordOf(res).isVerified !== false) return 'response record isVerified is not false';
    return true;
  });

  await test("student cannot overwrite another student's record by id (403)", async () => {
    const db = createDb();
    const route = loadRoute(db);
    await route.POST(request(B, { id: 'intern_b', companyName: 'Globex', role: 'Analyst', startDate: '2026-05-01' }));
    const res = await route.POST(request(A, { id: 'intern_b', companyName: 'Hijacked', role: 'CEO', startDate: '2026-05-01' }));
    const row = db.tables.internship_records.find((r) => r.id === 'intern_b');
    if (res.status !== 403) return `status ${res.status}`;
    if (row.student_id !== B || row.company_name !== 'Globex') return `victim row changed: ${row.student_id} / ${row.company_name}`;
    if (answersOf(db, A).some((r) => r.id === 'intern_b')) return 'record copied into attacker answers';
    return true;
  });

  await test('editing an own record updates it and resets verification', async () => {
    const db = createDb();
    const route = loadRoute(db);
    await route.POST(request(A, { id: 'intern_2', companyName: 'Acme', role: 'Intern', startDate: '2026-01-10' }));
    Object.assign(db.tables.internship_records.find((r) => r.id === 'intern_2'), { verified: true, verified_by: 'coordinator-1' });
    const res = await route.POST(request(A, { id: 'intern_2', companyName: 'Acme Corp', role: 'Intern', startDate: '2026-01-10' }));
    const row = db.tables.internship_records.find((r) => r.id === 'intern_2');
    const entries = answersOf(db, A).filter((r) => r.id === 'intern_2');
    if (res.status !== 200) return `status ${res.status}`;
    if (row.company_name !== 'Acme Corp' || row.verified !== false) return `row ${row.company_name} verified=${row.verified}`;
    if (entries.length !== 1 || entries[0].companyName !== 'Acme Corp') return `answers entries ${entries.length}`;
    return true;
  });

  await test('invalid dates are rejected (400) and nothing is written', async () => {
    const db = createDb();
    const res = await loadRoute(db).POST(request(A, { id: 'intern_3', companyName: 'X', startDate: 'last summer' }));
    if (res.status !== 400) return `status ${res.status}`;
    if (db.tables.internship_records.length || answersOf(db, A).length) return 'something was written';
    return true;
  });

  await test('GET: a self-set "verified" in the profile answers is not trusted', async () => {
    const db = createDb();
    answersOf(db, A).push({ id: 'legacy_1', studentId: A, companyName: 'Self Co', role: 'Lead', startDate: '2025-01-01', isVerified: true, verified: true, verifiedBy: 'me', skillsUsed: [], projectDescription: 'x', type: 'campus_internship', createdAt: 1 });
    const res = await loadRoute(db).GET(request(A));
    const rec = (res.body.internships || []).find((r) => r.id === 'legacy_1');
    if (!rec) return 'record missing';
    return rec.isVerified === false && !rec.verified && !rec.verifiedBy ? true : `isVerified=${rec.isVerified}`;
  });

  await test('GET: server verification is shown, details come from the profile', async () => {
    const db = createDb();
    answersOf(db, A).push({ id: 'intern_4', studentId: A, companyName: 'Initech', role: 'Intern', startDate: '2026-02-01', isVerified: false, skillsUsed: ['sql'], projectDescription: 'Built the TPS dashboard', mentorName: 'Bill', type: 'campus_internship', createdAt: 2 });
    db.tables.internship_records.push({ id: 'intern_4', student_id: A, company_name: 'Initech', role: 'Intern', start_date: '2026-02-01', end_date: null, description: 'short', skills_used: ['sql'], verified: true, verified_by: 'coordinator-1', created_at: '2026-02-02T00:00:00Z' });
    const res = await loadRoute(db).GET(request(A));
    const list = res.body.internships || [];
    const rec = list.find((r) => r.id === 'intern_4');
    if (list.filter((r) => r.id === 'intern_4').length !== 1) return `appears ${list.filter((r) => r.id === 'intern_4').length} times`;
    if (!rec || rec.isVerified !== true || rec.verifiedBy !== 'coordinator-1') return `isVerified=${rec && rec.isVerified}`;
    if (rec.projectDescription !== 'Built the TPS dashboard' || rec.mentorName !== 'Bill') return 'profile details lost';
    return true;
  });

  await test('GET: table-only rows come back in the shape the page reads (camelCase)', async () => {
    const db = createDb();
    db.tables.internship_records.push({ id: 'intern_5', student_id: A, company_name: 'Hooli', role: 'PM Intern', start_date: '2026-03-01', end_date: '2026-05-31', description: 'Roadmaps', skills_used: ['jira'], verified: false, verified_by: null, created_at: '2026-03-01T00:00:00Z' });
    const res = await loadRoute(db).GET(request(A));
    const rec = (res.body.internships || []).find((r) => r.id === 'intern_5');
    if (!rec) return 'record missing';
    if (rec.companyName !== 'Hooli' || rec.startDate !== '2026-03-01' || rec.isVerified !== false || !Array.isArray(rec.skillsUsed)) {
      return `got keys ${Object.keys(rec).join(',')}`;
    }
    return true;
  });

  await test("GET never returns another student's records", async () => {
    const db = createDb();
    db.tables.internship_records.push({ id: 'intern_b2', student_id: B, company_name: 'Other', role: 'x', start_date: '2026-01-01', verified: true });
    const res = await loadRoute(db).GET(request(A));
    return (res.body.internships || []).some((r) => r.id === 'intern_b2') ? 'leaked' : true;
  });

  await test('not logged in → 401 (GET and POST)', async () => {
    const route = loadRoute(createDb());
    const g = await route.GET(request(null));
    const p = await route.POST(request(null, { companyName: 'X' }));
    return g.status === 401 && p.status === 401 ? true : `${g.status}/${p.status}`;
  });

  await test('table unavailable → record still saved to the profile and listed', async () => {
    const db = createDb({ tableMissing: true });
    const route = loadRoute(db);
    const res = await route.POST(request(A, { id: 'intern_6', companyName: 'Umbrella', role: 'Intern', startDate: '2026-04-01' }));
    const list = (await route.GET(request(A))).body.internships || [];
    if (res.status !== 200) return `status ${res.status}`;
    return list.some((r) => r.id === 'intern_6' && r.isVerified === false) ? true : 'not listed';
  });

  await test('client uses the authenticated api (no plain fetch to /api/internships)', async () => {
    const src = fs.readFileSync(CLIENT, 'utf8');
    if (/fetch\(\s*['"`]\/api\/internships/.test(src)) return 'plain fetch still present (no Bearer token → 401)';
    if (!/api\.post<[^>]*>\(\s*['"`]\/api\/internships/.test(src) && !/api\.post\(\s*['"`]\/api\/internships/.test(src)) return 'api.post not used';
    if (!/api\.get<[^>]*>\(\s*['"`]\/api\/internships/.test(src) && !/api\.get\(\s*['"`]\/api\/internships/.test(src)) return 'api.get not used';
    return true;
  });

  console.log(`\n${pass}/${pass + fail} passed`);
  process.exit(fail ? 1 : 0);
})();
