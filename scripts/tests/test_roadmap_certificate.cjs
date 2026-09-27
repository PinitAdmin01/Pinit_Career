/**
 * Roadmap journey certificate (audit 4b.6): issued only when the server can verify the roadmap,
 * the capstone and the signed interview result; publicly verifiable; tamper-evident.
 *
 *   node scripts/tests/test_roadmap_certificate.cjs
 *   (from the sandbox: node dark-gracity/claude_sandbox/test_roadmap_certificate.cjs)
 *   CERT_SRC=src … runs the same checks against the current src/ files.
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
const USE_SRC = process.env.CERT_SRC === 'src' || !fs.existsSync(path.join(__dirname, 'roadmapCertificate.ts'));
const pick = (sandboxName, srcRel) => (USE_SRC ? path.join(ROOT, srcRel) : path.join(__dirname, sandboxName));
const FILES = {
  cert: pick('roadmapCertificate.ts', 'src/lib/certificates/roadmapCertificate.ts'),
  route: pick('certificates-roadmap-route.ts', 'src/app/api/certificates/roadmap/route.ts'),
  verify: pick('verify-route.ts', 'src/app/api/verify/[credentialId]/route.ts'),
  saved: pick('savedProjects.ts', 'src/lib/projects/savedProjects.ts'),
  capstone: pick('capstoneInterview.ts', 'src/lib/interview/capstoneInterview.ts'),
  signature: path.join(ROOT, 'src/lib/interview/evaluationSignature.ts'),
};
process.env.NEXTAUTH_SECRET = 'test-signing-secret';

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
const COURSE = 'course-react-web';
const COURSE_QUESTS = Array.from({ length: 10 }, (_, i) => `react_q${i + 1}`);
const signatureMod = load(FILES.signature, { './scoringMatrix': { ROLE_RUBRIC_VERSION: 'rubric-test' } });
const certMod = load(FILES.cert);
const savedMod = load(FILES.saved);
const capstoneMod = savedMod && load(FILES.capstone, { '@/lib/projects/savedProjects': savedMod });

function createDb(user) {
  const tables = { users: [user], issued_certificates: [] };
  const from = (table) => {
    const q = { op: 'select', filters: [], payload: null };
    const matches = (r) => q.filters.every(([c, v]) => r[c] === v);
    const exec = () => {
      const rows = tables[table];
      if (q.op === 'insert') {
        const dup = rows.some((r) => r.id === q.payload.id || (r.student_id === q.payload.student_id && r.kind === q.payload.kind && r.course_id === q.payload.course_id));
        if (dup) return { data: null, error: { code: '23505', message: 'duplicate key' } };
        rows.push({ revoked: false, ...q.payload });
        return { data: null, error: null };
      }
      const found = rows.filter(matches).map((r) => JSON.parse(JSON.stringify(r)));
      return { data: found[0] || null, error: null };
    };
    const chain = {
      select() { return chain; },
      eq(c, v) { q.filters.push([c, v]); return chain; },
      insert(p) { q.op = 'insert'; q.payload = p; return chain; },
      maybeSingle() { return Promise.resolve(exec()); },
      then(res, rej) { return Promise.resolve(exec()).then(res, rej); },
    };
    return chain;
  };
  return { client: { from }, tables };
}

function loadRoute(db) {
  const json = (body, init = {}) => ({ status: init.status || 200, body });
  return load(FILES.route, {
    'next/server': { NextResponse: { json } },
    '@/lib/server/requireAuth': {
      requireUserFromRequest: async (req) => req.userId ? { user: { id: req.userId }, error: null } : { user: null, error: json({ error: 'UNAUTHORIZED' }, { status: 401 }) },
    },
    '@/lib/server/supabaseAdmin': { getSupabaseAdmin: () => db.client },
    '@/lib/data/coursesData': { COURSES_REGISTRY: [{ id: COURSE, title: 'Full-Stack React Web Development', quests: COURSE_QUESTS.map((id) => ({ id })) }] },
    '@/lib/interview/evaluationSignature': signatureMod,
    '@/lib/interview/capstoneInterview': capstoneMod,
    '@/lib/projects/savedProjects': savedMod,
    '@/lib/certificates/roadmapCertificate': certMod,
  });
}
function loadVerify(db) {
  const json = (body, init = {}) => ({ status: init.status || 200, body });
  return load(FILES.verify, {
    'next/server': { NextResponse: { json } },
    '@/lib/server/supabaseAdmin': { getSupabaseAdmin: () => db.client },
    '@/lib/api/pathwayApi': { PathwayApiService: {} },
    '@/lib/pathway/evidenceEngine': { verifyEvidenceIntegrity: () => true },
    '@/lib/pathway/competencySchema': {},
    '@/lib/certificates/roadmapCertificate': certMod,
  });
}

/** A student who finished the roadmap, the capstone and a signed, passing interview. */
function student({ completed = COURSE_QUESTS, roadmapQuests = COURSE_QUESTS, interview = { score: 82, verdict: 'Hire' }, forgeToken = false, projectStatus = 'Completed' } = {}) {
  const token = signatureMod.createEvaluationSignature(STUDENT, interview.score, interview.verdict);
  const iv = forgeToken ? { score: 99, verdict: 'Hire', evaluationToken: token } : { ...interview, evaluationToken: token };
  return {
    id: STUDENT,
    display_name: 'Asha Rao',
    register_number: 'PIN2026-042',
    completed_quests: completed,
    onboarding_answers: {
      role: 'React Frontend Web SDE',
      roadmap_completed_at: '2026-09-27T08:00:00.000Z',
      roadmap_completed_course: COURSE,
      roadmap_modules: [{ id: 'm1', quests: roadmapQuests.map((id) => ({ id })) }],
      portfolio_projects: [{
        id: 'cap1', name: 'Realtime Chat', level: 'Advanced', status: projectStatus, origin: 'roadmap', roadmapCourseId: COURSE,
        capstoneInterview: { ...iv, passed: iv.score >= 65, completedAt: '2026-09-27T09:00:00.000Z' },
      }],
    },
  };
}
const issue = (db) => loadRoute(db).POST({ userId: STUDENT, json: async () => ({ projectId: 'cap1' }) });

let pass = 0, fail = 0;
async function test(name, fn) {
  const { error } = console; console.error = () => {};
  let why;
  try { why = await fn(); } catch (e) { why = `threw: ${e.message}`; } finally { console.error = error; }
  if (why === true) { pass++; console.log(`  ✓ ${name}`); } else { fail++; console.log(`  ✗ ${name}${why ? ` — ${why}` : ''}`); }
}

(async () => {
  console.log(`Roadmap certificate (${path.relative(ROOT, FILES.cert)})\n`);
  const ready = certMod && fs.existsSync(FILES.route) && capstoneMod;

  await test('roadmap check: real course quests, at least half the course, all done on the server', async () => {
    if (!certMod) return 'src/lib/certificates/roadmapCertificate.ts missing';
    const v = (roadmap, done) => certMod.validateRoadmapForCertificate({ roadmapModules: [{ quests: roadmap.map((id) => ({ id })) }], completedQuests: done, courseQuestIds: COURSE_QUESTS });
    if (!v(COURSE_QUESTS, COURSE_QUESTS).ok) return 'complete roadmap rejected';
    if (v([...COURSE_QUESTS, 'fake_q'], [...COURSE_QUESTS, 'fake_q']).reason !== 'ROADMAP_NOT_IN_COURSE') return 'invented quest accepted';
    if (v(COURSE_QUESTS.slice(0, 2), COURSE_QUESTS).reason !== 'ROADMAP_TOO_SHORT') return 'shrunk roadmap accepted';
    if (v(COURSE_QUESTS, COURSE_QUESTS.slice(0, 9)).reason !== 'ROADMAP_NOT_COMPLETE') return 'unfinished roadmap accepted';
    return v([], []).reason === 'ROADMAP_NOT_VERIFIABLE' ? true : 'empty roadmap accepted';
  });

  await test('a student who finished everything gets one certificate (asking again returns it)', async () => {
    if (!ready) return 'certificate route missing';
    const db = createDb(student());
    const first = await issue(db);
    const second = await issue(db);
    if (first.status !== 200 || !first.body.certificate) return `status ${first.status} ${first.body.error || ''}`;
    if (!/^PIN-RC-[0-9A-F]{12}$/.test(first.body.certificate.id)) return `id ${first.body.certificate.id}`;
    return second.body.certificate.id === first.body.certificate.id && db.tables.issued_certificates.length === 1 ? true : 'issued twice';
  });

  await test('refused when the server-recorded quests are not all done', async () => {
    if (!ready) return 'certificate route missing';
    const db = createDb(student({ completed: COURSE_QUESTS.slice(0, 7) }));
    const res = await issue(db);
    return res.status === 409 && res.body.error === 'ROADMAP_NOT_COMPLETE' && !db.tables.issued_certificates.length ? true : `${res.status} ${res.body.error}`;
  });

  await test('refused for a roadmap shrunk to a few quests', async () => {
    if (!ready) return 'certificate route missing';
    const db = createDb(student({ roadmapQuests: COURSE_QUESTS.slice(0, 3) }));
    const res = await issue(db);
    return res.status === 409 && res.body.error === 'ROADMAP_TOO_SHORT' ? true : `${res.status} ${res.body.error}`;
  });

  await test('refused when the interview result was edited (signature does not match)', async () => {
    if (!ready) return 'certificate route missing';
    const db = createDb(student({ interview: { score: 50, verdict: 'No Hire' }, forgeToken: true }));
    const res = await issue(db);
    return res.status === 403 && res.body.error === 'INTERVIEW_NOT_VERIFIED' && !db.tables.issued_certificates.length ? true : `${res.status} ${res.body.error}`;
  });

  await test('refused when the interview was not passed, or the capstone is unfinished', async () => {
    if (!ready) return 'certificate route missing';
    const failed = await issue(createDb(student({ interview: { score: 40, verdict: 'No Hire' } })));
    const unfinished = await issue(createDb(student({ projectStatus: 'In Progress' })));
    if (failed.body.error !== 'INTERVIEW_NOT_PASSED') return `failed interview → ${failed.body.error}`;
    return unfinished.body.error === 'CAPSTONE_NOT_COMPLETE' ? true : `unfinished capstone → ${unfinished.body.error}`;
  });

  await test('not logged in → 401', async () => {
    if (!ready) return 'certificate route missing';
    const res = await loadRoute(createDb(student())).POST({ userId: null, json: async () => ({ projectId: 'cap1' }) });
    return res.status === 401 ? true : `status ${res.status}`;
  });

  await test('anyone can verify an issued certificate; tampered, revoked or unknown ones fail', async () => {
    if (!ready) return 'certificate route missing';
    const db = createDb(student());
    const id = (await issue(db)).body.certificate.id;
    const verify = loadVerify(db);
    const check = async () => verify.GET({}, { params: { credentialId: id } });
    const ok = await check();
    if (!ok.body.valid || !/Asha Rao/.test(ok.body.document.studentName) || !/Realtime Chat/.test(ok.body.document.purpose)) return `genuine: ${JSON.stringify(ok.body).slice(0, 120)}`;
    db.tables.issued_certificates[0].interview_score = 100;
    if ((await check()).body.valid) return 'tampered score still verifies';
    db.tables.issued_certificates[0].interview_score = 82;
    db.tables.issued_certificates[0].revoked = true;
    if ((await check()).body.valid) return 'revoked certificate still verifies';
    const unknown = await verify.GET({}, { params: { credentialId: 'PIN-RC-000000000000' } });
    return unknown.status === 404 && !unknown.body.valid ? true : 'unknown id verifies';
  });

  console.log(`\n${pass}/${pass + fail} passed`);
  process.exit(fail ? 1 : 0);
})();
