/**
 * Certificate-course capstone (audit T9, owner decision "auto-check on server"): the four sprints
 * are checked and recorded only by the server, in order, after every course lesson is done.
 *
 *   node scripts/tests/test_capstone_sprints.cjs
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
  route: path.join(ROOT, 'src/app/api/quests/capstone/route.ts'),
  sprints: path.join(ROOT, 'src/lib/courses/capstoneSprints.ts'),
  progress: path.join(ROOT, 'src/lib/courses/crashCourseProgress.ts'),
  probe: path.join(ROOT, 'src/lib/server/publicUrlProbe.ts'),
  enrollments: path.join(ROOT, 'src/lib/server/courseEnrollments.ts'),
  signature: path.join(ROOT, 'src/lib/interview/evaluationSignature.ts'),
  capstone: path.join(ROOT, 'src/lib/interview/capstoneInterview.ts'),
  saved: path.join(ROOT, 'src/lib/projects/savedProjects.ts'),
  enrollmentRoute: path.join(ROOT, 'src/app/api/quests/enrollment/route.ts'),
  enrollmentService: path.join(ROOT, 'src/lib/services/crashCourseEnrollmentService.ts'),
  evaluateRoute: path.join(ROOT, 'src/app/api/interview/evaluate/route.ts'),
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
    if (['crypto', 'dns', 'https', 'net'].includes(n)) return require(n);
    throw new Error(`Unexpected import in ${path.basename(file)}: ${n}`);
  }, mod, mod.exports);
  return mod.exports;
}

const STUDENT = 'aaaaaaaa-0000-4000-8000-000000000001';
const OTHER = 'bbbbbbbb-0000-4000-8000-000000000002';
const LESSONS = ['c1_q1', 'c1_q2', 'c2_q1'];
const PLAN = {
  id: 'plan-test', title: 'Test Accelerator',
  modulesByTrack: { web_fullstack: [{ month: 2, courseId: 'c2' }, { month: 1, courseId: 'c1' }], python_ai: [] },
  flagshipBuildByTrack: { web_fullstack: { title: 'Realtime Chat Engine' }, python_ai: { title: 'RAG Assistant' } },
};
const REGISTRY = [
  { id: 'c1', quests: [{ id: 'c1_q1' }, { id: 'c1_q2' }] },
  { id: 'c2', quests: [{ id: 'c2_q1' }] },
];
const plansMock = { INTERNSHIP_AVAILABLE: false, getCrashPlanById: (id) => (id === PLAN.id ? PLAN : undefined) };

const signatureMod = load(FILES.signature, { './scoringMatrix': { ROLE_RUBRIC_VERSION: 'rubric-test' } });
const sprintsMod = load(FILES.sprints);
const progressMod = load(FILES.progress, { '@/lib/data/crashPlansData': plansMock });
const savedMod = load(FILES.saved);
const capstoneMod = load(FILES.capstone, { '@/lib/projects/savedProjects': savedMod });
const enrollmentsMod = load(FILES.enrollments);

/** Fake https for the probe: `responses[url]` = status, [status, location], or an error code string. */
function fakeHttps(responses) {
  return {
    request(url, _opts, cb) {
      const handlers = {};
      const req = {
        on(ev, fn) { handlers[ev] = fn; return req; },
        destroy() {},
        end() {
          const r = responses[url.toString()];
          setImmediate(() => {
            if (r === undefined || typeof r === 'string') {
              const err = new Error(r || 'ECONNREFUSED'); err.code = r || 'ECONNREFUSED';
              return handlers.error && handlers.error(err);
            }
            const [status, location] = Array.isArray(r) ? r : [r, undefined];
            cb({ statusCode: status, headers: location ? { location } : {}, destroy() {} });
          });
        },
      };
      return req;
    },
  };
}

/** Fake probe for the route: `results[url]` = ProbeResult (default: found). */
function fakeProbe(results, calls) {
  const real = load(FILES.probe);
  return {
    parsePublicHttpsUrl: real.parsePublicHttpsUrl,
    probePublicUrl: async (url) => { calls.push(url); return results[url] || { ok: true, status: 200, finalUrl: url }; },
  };
}

function createDb({ completed = LESSONS, milestones = {}, owner = STUDENT } = {}) {
  const tables = {
    users: [{ id: STUDENT, completed_quests: completed }],
    user_crash_enrollments: [{
      enrollment_id: 'enr-1', user_id: owner, plan_id: PLAN.id, track: 'web_fullstack', amount_paid: 0,
      payment_id: 'pay-1', order_id: '', payment_method: 'pins', status: 'active', enrolled_at: '2026-09-01T00:00:00Z',
      current_sprint: 1, daily_learning_hours_target: 1, reward_pins_credited: 0, pins_deducted: 1000,
      milestone_progress: { sprint1Approved: false, sprint2Approved: false, sprint3RepoUrl: null, sprint3LiveUrl: null, sprint4DefenseScore: null, ...milestones },
      certificates_issued: {}, updated_at: '2026-09-01T00:00:00.000001+00:00',
    }],
  };
  let stamp = 1;
  const from = (table) => {
    const q = { op: 'select', filters: [], payload: null };
    const matches = (r) => q.filters.every(([c, v]) => r[c] === v);
    const exec = () => {
      const rows = tables[table].filter(matches);
      if (q.op === 'update') {
        rows.forEach((r) => Object.assign(r, JSON.parse(JSON.stringify(q.payload)), { updated_at: `2026-09-27T00:00:0${stamp++}Z` }));
      }
      return { data: rows[0] ? JSON.parse(JSON.stringify(rows[0])) : null, error: null };
    };
    const chain = {
      select() { return chain; },
      eq(c, v) { q.filters.push([c, v]); return chain; },
      update(p) { q.op = 'update'; q.payload = p; return chain; },
      maybeSingle() { return Promise.resolve(exec()); },
      then(res, rej) { return Promise.resolve(exec()).then(res, rej); },
    };
    return chain;
  };
  return { client: { from }, tables, row: () => tables.user_crash_enrollments[0] };
}

function submit(db, body, { userId = STUDENT, probeResults = {}, calls = [] } = {}) {
  const json = (b, init = {}) => ({ status: init.status || 200, body: b });
  const route = load(FILES.route, {
    'next/server': { NextResponse: { json } },
    '@/lib/server/requireAuth': {
      requireUserFromRequest: async (req) => req.userId ? { user: { id: req.userId }, error: null } : { user: null, error: json({ error: 'UNAUTHORIZED' }, { status: 401 }) },
    },
    '@/lib/server/supabaseAdmin': { getSupabaseAdmin: () => db.client },
    '@/lib/server/rateLimit': { checkRateLimit: () => ({ allowed: true }) },
    '@/lib/server/courseEnrollments': enrollmentsMod,
    '@/lib/server/publicUrlProbe': fakeProbe(probeResults, calls),
    '@/lib/data/coursesData': { COURSES_REGISTRY: REGISTRY },
    '@/lib/data/crashPlansData': plansMock,
    '@/lib/courses/crashCourseProgress': progressMod,
    '@/lib/courses/capstoneSprints': sprintsMod,
    '@/lib/interview/evaluationSignature': signatureMod,
    '@/lib/interview/capstoneInterview': capstoneMod,
  });
  return route.POST({ userId, json: async () => ({ enrollmentId: 'enr-1', ...body }) });
}

const REPO = 'https://github.com/asha/chat-engine';
const SPRINT1 = { sprint: 1, repoUrl: REPO, designUrl: `${REPO}/blob/main/docs/architecture.md` };
const SPRINT2 = { sprint: 2, apiUrl: `${REPO}/tree/main/src/api` };
const SPRINT3 = { sprint: 3, liveUrl: 'https://chat-engine.vercel.app' };
const DONE_1_2_3 = {
  sprint1Approved: true, sprint1RepoUrl: REPO, sprint2Approved: true, sprint3RepoUrl: REPO, sprint3LiveUrl: SPRINT3.liveUrl,
};
const defenseTopic = () => sprintsMod.courseDefenseTopic(PLAN, 'web_fullstack');
const defense = (score, verdict, topic = defenseTopic()) => ({
  sprint: 4, score, verdict, topicToken: signatureMod.createTopicEvaluationSignature(STUDENT, score, verdict, topic),
});

let pass = 0, fail = 0;
async function test(name, fn) {
  const { error } = console; console.error = () => {};
  let why;
  try { why = await fn(); } catch (e) { why = `threw: ${e.message}`; } finally { console.error = error; }
  if (why === true) { pass++; console.log(`  ✓ ${name}`); } else { fail++; console.log(`  ✗ ${name}${why ? ` — ${why}` : ''}`); }
}

(async () => {
  console.log('Certificate-course capstone sprints\n');
  const ready = fs.existsSync(FILES.route) && sprintsMod && enrollmentsMod;

  await test('GitHub links: repo, or a file/folder inside it; nothing else', async () => {
    if (!sprintsMod) return 'src/lib/courses/capstoneSprints.ts missing';
    const p = sprintsMod.parseGithubLink;
    const repo = p('https://github.com/Asha/chat-engine.git/');
    if (!repo || repo.isPath || repo.repoUrl !== 'https://github.com/Asha/chat-engine') return `repo → ${JSON.stringify(repo)}`;
    const file = p(`${REPO}/blob/main/docs/a.md?plain=1#L3`);
    if (!file || !file.isPath || file.url !== `${REPO}/blob/main/docs/a.md`) return `file → ${JSON.stringify(file)}`;
    for (const bad of ['http://github.com/a/b', 'https://gitlab.com/a/b', 'https://github.com/a', 'https://github.com/settings/profile',
      `${REPO}/issues/1`, 'https://github.com.evil.io/a/b', 'https://user@github.com/a/b', 'not a url']) {
      if (p(bad)) return `accepted ${bad}`;
    }
    if (!sprintsMod.sameGithubRepo(p('https://github.com/ASHA/Chat-Engine'), file)) return 'same repo (other case) not matched';
    return true;
  });

  await test('sprints unlock in order; defense topic comes from the course', async () => {
    if (!sprintsMod) return 'src/lib/courses/capstoneSprints.ts missing';
    const n = sprintsMod.nextCapstoneSprint;
    if (n({}) !== 1 || n({ sprint1Approved: true }) !== 2 || n({ sprint1Approved: true, sprint2Approved: true }) !== 3) return 'order wrong';
    if (n(DONE_1_2_3) !== 4 || n({ ...DONE_1_2_3, sprint4DefenseScore: 80 }) !== null) return 'sprint 3/4 wrong';
    if (n({ sprint2Approved: true, sprint3RepoUrl: REPO, sprint3LiveUrl: 'x', sprint4DefenseScore: 90 }) !== 1) return 'skipped sprint 1 counted';
    return defenseTopic() === 'Capstone Defense: Realtime Chat Engine (Test Accelerator)' ? true : defenseTopic();
  });

  await test('live URL guard: only public https hosts (no internal/cloud-metadata addresses)', async () => {
    const probe = load(FILES.probe);
    if (!probe) return 'src/lib/server/publicUrlProbe.ts missing';
    for (const ip of ['127.0.0.1', '10.1.2.3', '172.16.0.9', '192.168.1.1', '169.254.169.254', '100.64.0.1', '0.0.0.0', '::1', 'fc00::1', 'fe80::1', '::ffff:127.0.0.1', '::ffff:7f00:1', '64:ff9b::7f00:1', '64:ff9b::a9fe:a9fe', '2002:0a00:0001::1']) {
      if (!probe.isNonPublicAddress(ip)) return `${ip} treated as public`;
    }
    for (const ip of ['8.8.8.8', '76.76.21.21', '2606:4700:4700::1111', '64:ff9b::14cf:4952', '::ffff:8.8.8.8']) if (probe.isNonPublicAddress(ip)) return `${ip} treated as private`;
    for (const bad of ['http://app.vercel.app', 'https://127.0.0.1', 'https://[::1]/', 'https://localhost', 'https://a:b@app.io',
      'https://app.io:8080', 'https://db.internal', 'https://intranet', 'ftp://app.io']) {
      if (probe.parsePublicHttpsUrl(bad)) return `accepted ${bad}`;
    }
    return probe.parsePublicHttpsUrl('https://chat-engine.vercel.app/') ? true : 'rejected a normal https site';
  });

  await test('live URL guard: DNS answers pointing inside the network are refused', async () => {
    const answers = { 'rebind.example.com': [{ address: '10.0.0.5', family: 4 }], 'ok.example.com': [{ address: '76.76.21.21', family: 4 }] };
    const dnsMock = { lookup: (h, _o, cb) => cb(null, answers[h] || []) };
    const probe = load(FILES.probe, { dns: dnsMock });
    const run = (h, all) => new Promise((r) => probe.publicOnlyLookup(h, { all }, (err, addr) => r({ err, addr })));
    const bad = await run('rebind.example.com', false);
    if (!bad.err || bad.err.code !== 'ENOTPUBLIC') return 'private DNS answer allowed';
    const good = await run('ok.example.com', false);
    return !good.err && good.addr === '76.76.21.21' ? true : `public answer refused: ${good.err && good.err.code}`;
  });

  await test('probe: 404 = not found, redirects to internal hosts refused, 200/403 = up, 5xx = down', async () => {
    const mk = (responses) => load(FILES.probe, { https: fakeHttps(responses) }).probePublicUrl;
    const u = 'https://chat-engine.vercel.app/';
    if ((await mk({ [u]: 404 })(u)).reason !== 'NOT_FOUND') return '404 not reported';
    if ((await mk({ [u]: [302, 'http://169.254.169.254/latest/meta-data'] })(u)).reason !== 'NOT_PUBLIC') return 'redirect to metadata followed';
    if ((await mk({ [u]: [301, '/home'], 'https://chat-engine.vercel.app/home': 200 })(u)).ok !== true) return 'same-site redirect not followed';
    if ((await mk({ [u]: 403 })(u)).ok !== true) return '403 (bot wall) treated as down';
    if ((await mk({ [u]: 503 })(u)).reason !== 'UNREACHABLE') return '503 treated as up';
    return (await mk({ [u]: 'ENOTPUBLIC' })(u)).reason === 'NOT_PUBLIC' ? true : 'blocked lookup not reported';
  });

  await test('no sprint before every course lesson is done (server-recorded quests)', async () => {
    if (!ready) return 'src/app/api/quests/capstone/route.ts missing';
    const db = createDb({ completed: ['c1_q1', 'c1_q2', 'other_course_q'] });
    const res = await submit(db, SPRINT1);
    return res.status === 409 && res.body.error === 'TRAINING_NOT_COMPLETE' && !db.row().milestone_progress.sprint1Approved ? true : `${res.status} ${res.body.error}`;
  });

  await test('sprint 1: public repo + design file in it → approved and saved; sprint 2 before 1 is locked', async () => {
    if (!ready) return 'route missing';
    const early = await submit(createDb(), SPRINT2);
    if (early.body.error !== 'SPRINT_LOCKED') return `sprint 2 first → ${early.status} ${early.body.error}`;
    const db = createDb();
    const calls = [];
    const res = await submit(db, SPRINT1, { calls });
    const m = db.row().milestone_progress;
    if (res.status !== 200 || !res.body.approved) return `${res.status} ${res.body.error}`;
    if (!calls.includes(REPO) || !calls.includes(SPRINT1.designUrl)) return `links not checked: ${calls}`;
    if (!m.sprint1Approved || m.sprint1RepoUrl !== REPO || db.row().current_sprint !== 2) return JSON.stringify(m);
    const again = await submit(db, SPRINT1);
    return again.body.error === 'SPRINT_ALREADY_APPROVED' ? true : `resubmit → ${again.body.error}`;
  });

  await test('sprint 1 refused: private/missing repo, design outside the repo, GitHub down (nothing saved)', async () => {
    if (!ready) return 'route missing';
    const db = createDb();
    const missing = await submit(db, SPRINT1, { probeResults: { [REPO]: { ok: false, reason: 'NOT_FOUND', status: 404 } } });
    if (missing.status !== 422 || missing.body.error !== 'GITHUB_NOT_FOUND') return `missing repo → ${missing.status} ${missing.body.error}`;
    const other = await submit(db, { ...SPRINT1, designUrl: 'https://github.com/someone/else/blob/main/a.md' });
    if (other.body.error !== 'INVALID_DESIGN_URL') return `design elsewhere → ${other.body.error}`;
    const down = await submit(db, SPRINT1, { probeResults: { [REPO]: { ok: false, reason: 'RATE_LIMITED', status: 429 } } });
    if (down.status !== 503) return `GitHub down → ${down.status}`;
    return db.row().milestone_progress.sprint1Approved === false ? true : 'saved anyway';
  });

  await test('sprints 2-3: API code in the same repo; live URL must respond and not be GitHub', async () => {
    if (!ready) return 'route missing';
    const db = createDb({ milestones: { sprint1Approved: true, sprint1RepoUrl: REPO } });
    const wrongRepo = await submit(db, { sprint: 2, apiUrl: 'https://github.com/else/x/tree/main/api' });
    if (wrongRepo.body.error !== 'INVALID_API_URL') return `API elsewhere → ${wrongRepo.body.error}`;
    const ok2 = await submit(db, SPRINT2);
    if (!ok2.body.approved || !db.row().milestone_progress.sprint2Approved) return `sprint 2 → ${ok2.status} ${ok2.body.error}`;
    const gh = await submit(db, { sprint: 3, liveUrl: REPO });
    if (gh.body.error !== 'INVALID_LIVE_URL') return `GitHub as live URL → ${gh.body.error}`;
    const dead = await submit(db, SPRINT3, { probeResults: { [`${SPRINT3.liveUrl}/`]: { ok: false, reason: 'NOT_FOUND', status: 404 } } });
    if (dead.status !== 422 || db.row().milestone_progress.sprint3LiveUrl) return `dead site → ${dead.status} ${dead.body.error}`;
    const ok3 = await submit(db, SPRINT3);
    const m = db.row().milestone_progress;
    return ok3.body.approved && m.sprint3RepoUrl === REPO && m.sprint3LiveUrl && db.row().current_sprint === 4 ? true : JSON.stringify(m);
  });

  await test('sprint 4: only a PinIT-signed result of THIS course defense counts; a fail is recorded, not approved', async () => {
    if (!ready) return 'route missing';
    const db = createDb({ milestones: DONE_1_2_3 });
    const generic = await submit(db, { sprint: 4, score: 95, verdict: 'Hire', topicToken: signatureMod.createEvaluationSignature(STUDENT, 95, 'Hire') });
    if (generic.status !== 403) return `other interview token → ${generic.status}`;
    const otherTopic = await submit(db, defense(95, 'Hire', 'Software Engineering (SDE)'));
    if (otherTopic.status !== 403) return `other topic → ${otherTopic.status}`;
    const edited = await submit(db, { ...defense(40, 'No Hire'), score: 95, verdict: 'Hire' });
    if (edited.status !== 403) return `edited score → ${edited.status}`;
    const failed = await submit(db, defense(52, 'No Hire'));
    const m = db.row().milestone_progress;
    if (failed.status !== 200 || failed.body.approved || typeof m.sprint4DefenseScore === 'number' || m.sprint4LastAttempt.score !== 52) return `fail → ${JSON.stringify(failed.body)}`;
    const passed = await submit(db, defense(78, 'Hire'));
    if (!passed.body.approved || db.row().milestone_progress.sprint4DefenseScore !== 78) return `pass → ${JSON.stringify(passed.body)}`;
    const e = passed.body.enrollment;
    if (!progressMod.isCapstoneComplete(e)) return 'capstone not complete after sprint 4';
    const after = await submit(db, defense(90, 'Hire'));
    return after.body.error === 'CAPSTONE_ALREADY_COMPLETE' ? true : `after completion → ${after.body.error}`;
  });

  await test("another student's enrollment → 404; not logged in → 401", async () => {
    if (!ready) return 'route missing';
    const theirs = await submit(createDb({ owner: OTHER }), SPRINT1);
    if (theirs.status !== 404) return `other student → ${theirs.status}`;
    const anon = await submit(createDb(), SPRINT1, { userId: null });
    return anon.status === 401 ? true : `anon → ${anon.status}`;
  });

  await test('the old unchecked milestone PATCH is gone; the interview returns a topic-bound token', async () => {
    const route = fs.readFileSync(FILES.enrollmentRoute, 'utf8');
    if (/export\s+async\s+function\s+PATCH/.test(route)) return 'PATCH /api/quests/enrollment still writes milestones';
    if (/updateSprintMilestone/.test(fs.readFileSync(FILES.enrollmentService, 'utf8'))) return 'client can still send milestones';
    const evaluate = fs.readFileSync(FILES.evaluateRoute, 'utf8');
    return /topicEvaluationToken/.test(evaluate) && /createTopicEvaluationSignature/.test(evaluate) ? true : 'evaluate route has no topic token';
  });

  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})();
