/**
 * Certificate course (quests sub-tab 1) has its own progress (audit 4a.2, 4a.3, 4a.4).
 *
 *   node scripts/tests/test_crash_course_progress.cjs
 *
 * - progress counts only the lessons of the plan's own courses (not quests done elsewhere)
 * - "Continue" opens the course's next lesson (not the custom roadmap tab)
 * - phases unlock in order from real data; locked phases have disabled actions;
 *   no fake fellowship desk; sharing/QR only once the credentials exist
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
  helper: path.join(ROOT, 'src/lib/courses/crashCourseProgress.ts'),
  stepper: path.join(ROOT, 'src/app/quests/components/VerticalCheckpointStepper.tsx'),
  drawer: path.join(ROOT, 'src/app/quests/components/TrackSelectorDrawer.tsx'),
  page: path.join(ROOT, 'src/app/quests/page.tsx'),
};

function load(file, mocks = {}) {
  if (!fs.existsSync(file)) return null;
  const out = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    fileName: file, compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.React, esModuleInterop: true },
  }).outputText;
  const mod = { exports: {} };
  new Function('require', 'module', 'exports', out)((n) => {
    if (n in mocks) return mocks[n];
    throw new Error(`Unexpected import in ${path.basename(file)}: ${n}`);
  }, mod, mod.exports);
  return mod.exports;
}
const React = { createElement: (type, props, ...children) => ({ type, props: { ...(props || {}), children: children.flat() } }) };
React.default = React;
const render = (el) => (el && typeof el.type === 'function' ? render(el.type(el.props)) : el);
const findAll = (n, pred, acc = []) => { if (n && typeof n === 'object') { if (pred(n)) acc.push(n); (n.props.children || []).forEach((c) => findAll(render(c), pred, acc)); } return acc; };
const textOf = (n) => (n == null || typeof n === 'boolean' ? '' : typeof n !== 'object' ? String(n) : (render(n).props.children || []).map(textOf).join(''));

const PLAN = {
  id: 'plan-test', trainingDurationMonths: 2, trainingDurationDays: 60,
  modulesByTrack: {
    web_fullstack: [{ month: 2, courseId: 'course-b' }, { month: 1, courseId: 'course-a' }],
    python_ai: [{ month: 1, courseId: 'course-py' }],
  },
  flagshipBuildByTrack: { web_fullstack: { title: 'SaaS', tech: ['Next.js'] }, python_ai: { title: 'RAG', tech: ['Python'] } },
};
const REGISTRY = [
  { id: 'course-a', quests: [{ id: 'a1' }, { id: 'a2' }] },
  { id: 'course-b', quests: [{ id: 'b1' }, { id: 'a2' }] },
  { id: 'course-py', quests: [{ id: 'p1' }] },
];
const ENROLL = (extra = {}) => ({ milestoneProgress: { sprint1Approved: false, sprint2Approved: false }, certificatesIssued: {}, ...extra });

let pass = 0, fail = 0;
function test(name, fn) {
  let why;
  try { why = fn(); } catch (e) { why = `threw: ${e.message}`; }
  if (why === true) { pass++; console.log(`  ✓ ${name}`); } else { fail++; console.log(`  ✗ ${name}${why ? ` — ${why}` : ''}`); }
}

console.log('Certificate course progress\n');
const helper = load(FILES.helper);

test('curriculum = the plan\'s own courses, in month order, each lesson once', () => {
  if (!helper) return 'src/lib/courses/crashCourseProgress.ts missing';
  const ids = helper.getCrashCourseCurriculum(PLAN, 'web_fullstack', REGISTRY).map((l) => l.questId).join(',');
  return ids === 'a1,a2,b1' ? true : ids;
});

test('quests done elsewhere do not count toward the course', () => {
  if (!helper) return 'helper missing';
  const p = helper.getCrashCourseProgress(PLAN, 'web_fullstack', REGISTRY, ['a1', 'roadmap_q1', 'roadmap_q2', 'standalone_q9'], ENROLL());
  return p.completed === 1 && p.total === 3 && p.percent === 33 && p.next.questId === 'a2' ? true : JSON.stringify({ c: p.completed, t: p.total, n: p.next });
});

test('phases unlock in order from real data', () => {
  if (!helper) return 'helper missing';
  const phases = (done, enr) => Object.values(helper.getCrashCourseProgress(PLAN, 'web_fullstack', REGISTRY, done, enr).phases).join(',');
  const all = ['a1', 'a2', 'b1'];
  const cases = [
    [phases(['a1'], ENROLL()), 'active,locked,locked,locked'],
    [phases(all, ENROLL()), 'completed,active,locked,locked'],
    [phases(all, ENROLL({ certificatesIssued: { projectCertHash: 'h' } })), 'completed,completed,active,locked'],
    [phases(all, ENROLL({ certificatesIssued: { projectCertHash: 'h', internshipCertHash: 'i' } })), 'completed,completed,completed,completed'],
    [phases(['a1'], ENROLL({ certificatesIssued: { projectCertHash: 'h', internshipCertHash: 'i' } })), 'active,locked,locked,locked'],
  ];
  const bad = cases.find(([got, want]) => got !== want);
  return bad ? `got ${bad[0]}, want ${bad[1]}` : true;
});

test('capstone passes on approved sprints + defense score, not on a partial one', () => {
  if (!helper) return 'helper missing';
  const ok = helper.isCapstoneComplete(ENROLL({ milestoneProgress: { sprint1Approved: true, sprint2Approved: true, sprint3RepoUrl: 'gh', sprint4DefenseScore: 72 } }));
  const low = helper.isCapstoneComplete(ENROLL({ milestoneProgress: { sprint1Approved: true, sprint2Approved: true, sprint3RepoUrl: 'gh', sprint4DefenseScore: 40 } }));
  return ok && !low && !helper.isCapstoneComplete(null) ? true : `ok=${ok} low=${low}`;
});

function renderStepper(progress) {
  const stepper = load(FILES.stepper, { react: React, '@/lib/data/crashPlansData': { getCrashPlanById: () => PLAN } });
  const calls = [];
  const node = render(React.createElement(stepper.VerticalCheckpointStepper, {
    planId: 'plan-test', activeTrack: 'web_fullstack', progress,
    onOpenPracticeTest: () => calls.push('test'), onOpenCapstoneDesk: () => calls.push('capstone'),
    onOpenQrModal: () => calls.push('qr'), onOpenPreviewCredentials: () => calls.push('preview'),
    onContinueTodayQuest: () => calls.push('continue'),
  }));
  const buttons = findAll(node, (n) => n.type === 'button').map((b) => ({ label: textOf(b), disabled: !!b.props.disabled, click: b.props.onClick }));
  return { node, buttons, calls, text: textOf(node) };
}

test('timeline: locked phases have disabled actions; no fake fellowship desk; no QR before credentials', () => {
  if (!helper) return 'helper missing';
  const { buttons, text } = renderStepper(helper.getCrashCourseProgress(PLAN, 'web_fullstack', REGISTRY, ['a1'], ENROLL()));
  const capstone = buttons.find((b) => /Capstone Desk/.test(b.label));
  if (!capstone || !capstone.disabled) return 'capstone desk usable before the lessons are done';
  if (buttons.some((b) => /Fellowship Desk/.test(b.label))) return 'fellowship button still opens the capstone desk';
  if (buttons.some((b) => /Share & Verify/.test(b.label))) return 'QR sharing offered before any credential exists';
  if (!/1 of 3 course lessons completed/.test(text)) return 'progress text not from the course curriculum';
  return buttons.some((b) => /Sample/.test(b.label)) ? true : 'sample preview not labelled as a sample';
});

test('timeline: after graduation the credentials can be shared', () => {
  if (!helper) return 'helper missing';
  const p = helper.getCrashCourseProgress(PLAN, 'web_fullstack', REGISTRY, ['a1', 'a2', 'b1'], ENROLL({ certificatesIssued: { projectCertHash: 'h', internshipCertHash: 'i' } }));
  const { buttons, calls } = renderStepper(p);
  const qr = buttons.find((b) => /Share & Verify/.test(b.label));
  if (!qr || qr.disabled) return 'no QR sharing after graduation';
  qr.click();
  return calls.includes('qr') ? true : 'QR button does nothing';
});

test('"Continue" opens the course\'s next lesson, not the custom roadmap tab', () => {
  const drawer = fs.readFileSync(FILES.drawer, 'utf8');
  const page = fs.readFileSync(FILES.page, 'utf8');
  if (/onContinueTodayQuest=\{\(\) => \{\s*handleSubTabChange\('custom_roadmap'\)/.test(drawer)) return 'still switches to the custom roadmap tab';
  if (!/getCrashCourseProgress\(/.test(drawer) || !/progress=\{courseProgress\}/.test(drawer)) return 'drawer does not use the course progress';
  if (!/handleLaunchQuest\(quest as unknown as Quest, next\.courseId\)/.test(drawer)) return 'next lesson not launched';
  return /handleLaunchQuest=\{prog\.handleLaunchQuest\}/.test(page) ? true : 'quests page does not pass the launcher';
});

console.log(`\n${pass}/${pass + fail} passed`);
process.exit(fail ? 1 : 0);
