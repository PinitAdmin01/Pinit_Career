/**
 * Consultant "add student" (T19 / B4d): an existing account is added to the study-abroad
 * pipeline without being overwritten. The route used to upsert the whole profile (role
 * 'student', scores reset), so adding an admin's email turned the admin into a student.
 *
 *   node scripts/tests/test_consultant_add_student.cjs
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
const ROUTE = path.join(ROOT, 'src/app/api/consultant/student/add/route.ts');

function createDb(users, { createUserOk = true } = {}) {
  const writes = [];
  const table = (name) => {
    const q = { op: 'select', payload: null, filters: [] };
    const exec = () => {
      if (name === 'audit_logs') return { data: null, error: null };
      const match = (u) => q.filters.every(([c, v]) => u[c] === v);
      if (q.op === 'update') {
        users.filter(match).forEach((u) => Object.assign(u, q.payload));
        writes.push(['update', q.payload]);
        return { data: null, error: null };
      }
      if (q.op === 'upsert') {
        const existing = users.find((u) => u.id === q.payload.id);
        if (existing) Object.assign(existing, q.payload); else users.push({ ...q.payload });
        writes.push(['upsert', q.payload]);
        return { data: null, error: null };
      }
      return { data: users.find(match) || null, error: null };
    };
    const chain = {
      select() { return chain; },
      eq(c, v) { q.filters.push([c, v]); return chain; },
      update(p) { q.op = 'update'; q.payload = p; return chain; },
      upsert(p) { q.op = 'upsert'; q.payload = p; return chain; },
      insert() { q.op = 'insert'; return chain; },
      maybeSingle() { return Promise.resolve(exec()); },
      then(res, rej) { return Promise.resolve(exec()).then(res, rej); },
    };
    return chain;
  };
  const client = {
    from: table,
    auth: { admin: { createUser: async () => (createUserOk ? { data: { user: { id: 'new-uid' } }, error: null } : { data: null, error: { message: 'boom' } }) } },
  };
  return { client, users, writes };
}

function loadRoute(db) {
  const json = (body, init = {}) => ({ status: init.status || 200, body });
  const out = ts.transpileModule(fs.readFileSync(ROUTE, 'utf8'), {
    fileName: ROUTE, compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
  }).outputText;
  const mod = { exports: {} };
  const mocks = {
    'next/server': { NextResponse: { json } },
    '@/lib/server/requireAuth': { requireConsultantUserFromRequest: async () => ({ user: { id: 'consultant-1', role: 'consultant' }, error: null }) },
    '@/lib/server/supabaseAdmin': { getSupabaseAdmin: () => db.client },
  };
  new Function('require', 'module', 'exports', out)((n) => {
    if (n in mocks) return mocks[n];
    throw new Error(`Unexpected import: ${n}`);
  }, mod, mod.exports);
  return mod.exports;
}
const add = (db, body) => loadRoute(db).POST({ json: async () => body });

let pass = 0, fail = 0;
async function test(name, fn) {
  const { warn, error } = console; console.warn = () => {}; console.error = () => {};
  let why;
  try { why = await fn(); } catch (e) { why = `threw: ${e.message}`; } finally { console.warn = warn; console.error = error; }
  if (why === true) { pass++; console.log(`  ✓ ${name}`); } else { fail++; console.log(`  ✗ ${name}${why ? ` — ${why}` : ''}`); }
}

(async () => {
  console.log('Consultant: add student\n');

  await test('adding a staff member\'s email is refused (was: the admin became a student)', async () => {
    const db = createDb([{ id: 'adm', email: 'boss@college.edu', role: 'admin', ats_score: 90, trust_score: 95 }]);
    const res = await add(db, { email: 'boss@college.edu', displayName: 'X' });
    const admin = db.users[0];
    if (admin.role !== 'admin' || admin.ats_score !== 90 || db.writes.length) return `admin changed: ${JSON.stringify(admin)}`;
    return res.status === 409 && res.body.error === 'NOT_A_STUDENT' ? true : `${res.status} ${JSON.stringify(res.body)}`;
  });

  await test('an existing student joins the pipeline; their profile and scores are kept', async () => {
    const db = createDb([{ id: 'stu', email: 'asha@x.com', role: 'student', display_name: 'Asha', ats_score: 72, trust_score: 80 }]);
    const res = await add(db, { email: 'asha@x.com', displayName: 'Someone Else', targetCountry: 'Canada', phone: '+91 9' });
    const s = db.users[0];
    if (res.status !== 200) return `${res.status} ${JSON.stringify(res.body)}`;
    if (s.display_name !== 'Asha' || s.ats_score !== 72 || s.trust_score !== 80 || s.role !== 'student') return `profile overwritten: ${JSON.stringify(s)}`;
    return s.target_country === 'Canada' && s.study_abroad_status === 'onboarding' && s.phone === '+91 9' ? true : JSON.stringify(s);
  });

  await test('a new student gets an account and a pipeline profile', async () => {
    const db = createDb([]);
    const res = await add(db, { email: 'new@x.com', displayName: 'Nila', programType: 'MBA' });
    const s = db.users.find((u) => u.id === 'new-uid');
    return res.status === 200 && s && s.role === 'student' && s.program_type === 'MBA' && s.visa_status === 'not_started' ? true : `${res.status} ${JSON.stringify(s)}`;
  });

  await test('no sign-in account could be created → error, no orphan profile', async () => {
    const db = createDb([], { createUserOk: false });
    const res = await add(db, { email: 'fail@x.com', displayName: 'N' });
    return res.status === 502 && db.users.length === 0 ? true : `${res.status}, ${db.users.length} profiles`;
  });

  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})();
