/**
 * Roadmap capstone → interview (audit 4b.5): the finished capstone leads to an interview about that
 * project and the student's role; its result is kept for the certificate step.
 *
 *   node scripts/tests/test_capstone_interview.cjs
 *   (from the sandbox: node dark-gracity/claude_sandbox/test_capstone_interview.cjs)
 *   CAPSTONE_INTERVIEW_SRC=src … runs the same checks against the current src/ files.
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
const USE_SRC = process.env.CAPSTONE_INTERVIEW_SRC === 'src' || !fs.existsSync(path.join(__dirname, 'capstoneInterview.ts'));
const pick = (sandboxName, srcRel) => (USE_SRC ? path.join(ROOT, srcRel) : path.join(__dirname, sandboxName));
const FILES = {
  helper: pick('capstoneInterview.ts', 'src/lib/interview/capstoneInterview.ts'),
  saved: pick('savedProjects.ts', 'src/lib/projects/savedProjects.ts'),
  card: pick('CapstoneNextStep.tsx', 'src/app/projects/CapstoneNextStep.tsx'),
  interview: pick('interview-page.tsx', 'src/app/interview/page.tsx'),
  projects: pick('projects-page.tsx', 'src/app/projects/page.tsx'),
};

const React = { createElement: (type, props, ...children) => ({ type, props: { ...(props || {}), children: children.flat() } }) };
React.default = React;
const textOf = (n) => (n == null || typeof n === 'boolean' ? '' : typeof n !== 'object' ? String(n) : (n.props.children || []).map(textOf).join(''));
const findAll = (n, pred, acc = []) => { if (n && typeof n === 'object') { if (pred(n)) acc.push(n); (n.props.children || []).forEach((c) => findAll(c, pred, acc)); } return acc; };

function load(file, mocks = {}) {
  if (!fs.existsSync(file)) return null;
  const out = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    fileName: file,
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.React, esModuleInterop: true },
  }).outputText;
  const mod = { exports: {} };
  new Function('require', 'module', 'exports', out)((n) => {
    if (n in mocks) return mocks[n];
    throw new Error(`Unexpected import in ${path.basename(file)}: ${n}`);
  }, mod, mod.exports);
  return mod.exports;
}

let pass = 0, fail = 0;
function test(name, fn) {
  let why;
  try { why = fn(); } catch (e) { why = `threw: ${e.message}`; }
  if (why === true) { pass++; console.log(`  ✓ ${name}`); } else { fail++; console.log(`  ✗ ${name}${why ? ` — ${why}` : ''}`); }
}

console.log(`Capstone interview (${path.relative(ROOT, FILES.helper)})\n`);
const saved = load(FILES.saved);
const helper = saved ? load(FILES.helper, { '@/lib/projects/savedProjects': saved }) : null;
const P = (id, status, extra = {}) => ({ id, name: `Project ${id}`, level: 'Advanced', status, ...extra });
const answers = (projects) => ({ role: 'Data Analyst', portfolio_projects: projects });

test('"roadmap" interview topic is the student\'s own role', () => {
  if (!helper) return 'src/lib/interview/capstoneInterview.ts missing';
  if (helper.roadmapInterviewTopic(' Cloud & DevOps Engineer ', 'tech') !== 'Cloud & DevOps Engineer') return 'role not used';
  return helper.roadmapInterviewTopic('', 'non_tech') === 'Finance & Accounting (B.Com)' ? true : 'no fallback';
});

test('only a completed roadmap capstone unlocks the capstone interview', () => {
  if (!helper) return 'helper missing';
  const list = [P('a', 'Completed'), P('b', 'In Progress', { origin: 'roadmap' }), P('c', 'Completed', { origin: 'roadmap' })];
  const r = (id) => helper.getCapstoneInterviewPlan(answers(list), id);
  if (r('zzz').reason !== 'NOT_FOUND') return 'missing project accepted';
  if (r('a').reason !== 'NOT_ROADMAP_CAPSTONE') return 'non-roadmap project accepted';
  if (r('b').reason !== 'NOT_VERIFIED') return 'unfinished capstone accepted';
  const ok = r('c');
  return ok.ok && ok.topic.includes('Data Analyst') && ok.topic.includes('Project c') ? true : JSON.stringify(ok);
});

test('interview result is kept on the capstone; a pass is never overwritten by a later fail', () => {
  if (!helper) return 'helper missing';
  const list = [P('c', 'Completed', { origin: 'roadmap' }), P('x', 'Completed')];
  const failed = helper.recordCapstoneInterview(list, 'c', { score: 40, verdict: 'Needs Practice', completedAt: 't1' });
  if (failed[0].capstoneInterview.passed !== false) return 'fail marked passed';
  const passed = helper.recordCapstoneInterview(failed, 'c', { score: 78, verdict: 'Hire', completedAt: 't2', evaluationToken: 'tok' });
  if (!passed[0].capstoneInterview.passed || passed[0].capstoneInterview.evaluationToken !== 'tok') return 'pass not recorded';
  const later = helper.recordCapstoneInterview(passed, 'c', { score: 30, verdict: 'No Hire', completedAt: 't3' });
  if (!later[0].capstoneInterview.passed) return 'later fail overwrote the pass';
  return later[1].capstoneInterview === undefined ? true : 'other project touched';
});

test('Projects page next step: interview after the capstone, then certificate', () => {
  if (!helper) return 'helper missing';
  if (helper.getCapstoneNextStep([P('a', 'Completed')]) !== null) return 'step without a roadmap capstone';
  const iv = helper.getCapstoneNextStep([P('c', 'Completed', { origin: 'roadmap' })]);
  const cert = helper.getCapstoneNextStep([P('c', 'Completed', { origin: 'roadmap', capstoneInterview: { passed: true, score: 80 } })]);
  return iv.step === 'interview' && cert.step === 'certificate' ? true : `${iv && iv.step} / ${cert && cert.step}`;
});

test('next-step card offers the capstone interview', () => {
  const card = helper && load(FILES.card, { react: React, '@/lib/interview/capstoneInterview': helper });
  if (!card) return 'CapstoneNextStep.tsx missing';
  if (card.CapstoneNextStep({ projects: [P('a', 'Completed')], onStartInterview() {} }) !== null) return 'shown without a capstone';
  let started = null;
  const node = card.CapstoneNextStep({ projects: [P('c', 'Completed', { origin: 'roadmap' })], onStartInterview: (p) => { started = p.id; } });
  const button = findAll(node, (n) => n.type === 'button')[0];
  if (!button || !/capstone interview/i.test(textOf(node))) return 'no interview call to action';
  button.props.onClick();
  return started === 'c' ? true : 'button does not start the interview for the capstone';
});

test('interview page: role topic, capstone mode, free only for the capstone, result saved', () => {
  const src = fs.readFileSync(FILES.interview, 'utf8');
  if (/:\s*\(domainStream === 'non_tech' \? 'Finance & Accounting \(B\.Com\)' : 'Software Engineering \(SDE\)'\)/.test(src)) return 'roadmap mode still uses a hard-coded generic topic';
  if (!/searchParams\.get\('mode'\) !== 'capstone'/.test(src) || !/getCapstoneInterviewPlan\(/.test(src)) return 'capstone mode not handled';
  if (!/!isCapstoneRun && !cOS\.isItemUnlocked/.test(src)) return 'capstone not free / other topics not charged';
  return /recordCapstoneInterview\(/.test(src) ? true : 'result not saved on the capstone';
});

test('Projects page shows the next step and navigates in-app (no full reload)', () => {
  const src = fs.readFileSync(FILES.projects, 'utf8');
  if (/<a\s+href=\{`\/interview/.test(src)) return 'interview opened with a full page reload (<a href>)';
  return /<CapstoneNextStep/.test(src) && /capstoneInterviewPath\(/.test(src) ? true : 'next-step card not wired';
});

console.log(`\n${pass}/${pass + fail} passed`);
process.exit(fail ? 1 : 0);
