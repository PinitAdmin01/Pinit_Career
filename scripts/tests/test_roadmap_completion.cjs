/**
 * Custom roadmap completion (audit 4b.1): detected, recorded once, and handed off to the project step.
 *
 *   node scripts/tests/test_roadmap_completion.cjs
 *   (from the sandbox: node dark-gracity/claude_sandbox/test_roadmap_completion.cjs)
 *   ROADMAP_SRC=src … runs the same checks against the current src/ files.
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
const USE_SRC = process.env.ROADMAP_SRC === 'src' || !fs.existsSync(path.join(__dirname, 'roadmapCompletion.ts'));
const pick = (sandboxName, srcRel) => (USE_SRC ? path.join(ROOT, srcRel) : path.join(__dirname, sandboxName));
const FILES = {
  helper: pick('roadmapCompletion.ts', 'src/lib/roadmap/roadmapCompletion.ts'),
  banner: pick('RoadmapCompleteBanner.tsx', 'src/app/quests/components/RoadmapCompleteBanner.tsx'),
  hook: pick('useQuestProgression.ts', 'src/app/quests/components/useQuestProgression.ts'),
  page: pick('quests-page.tsx', 'src/app/quests/page.tsx'),
};

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

// Minimal React for rendering a function component to a plain tree.
const React = { createElement: (type, props, ...children) => ({ type, props: { ...(props || {}), children: children.flat() } }) };
React.default = React;
const textOf = (node) => (node == null || typeof node === 'boolean' ? '' : typeof node !== 'object' ? String(node)
  : (node.props.children || []).map(textOf).join(''));
const findAll = (node, pred, acc = []) => {
  if (node && typeof node === 'object') { if (pred(node)) acc.push(node); (node.props.children || []).forEach((c) => findAll(c, pred, acc)); }
  return acc;
};

const MODULES = [
  { id: 'm1', quests: [{ id: 'q1' }, { id: 'q2' }] },
  { id: 'm2', quests: [{ id: 'q3' }, { id: 'q2' }, null, { id: 42 }] },
];

let pass = 0, fail = 0;
function test(name, fn) {
  let why;
  try { why = fn(); } catch (e) { why = `threw: ${e.message}`; }
  if (why === true) { pass++; console.log(`  ✓ ${name}`); } else { fail++; console.log(`  ✗ ${name}${why ? ` — ${why}` : ''}`); }
}

console.log(`Roadmap completion (${path.relative(ROOT, FILES.helper)})\n`);
const helper = load(FILES.helper);

test('progress counts each roadmap quest once and ignores junk', () => {
  if (!helper) return 'src/lib/roadmap/roadmapCompletion.ts missing';
  const p = helper.getRoadmapProgress(MODULES, ['q1', 'other-course-quest']);
  return p.total === 3 && p.completed === 1 && p.percent === 33 && !p.isComplete && p.nextQuestId === 'q2' ? true : JSON.stringify(p);
});

test('complete only when every quest is done; an empty roadmap is never complete', () => {
  if (!helper) return 'helper missing';
  const full = helper.getRoadmapProgress(MODULES, ['q3', 'q2', 'q1']);
  const empty = helper.getRoadmapProgress([], ['q1']);
  const none = helper.getRoadmapProgress(undefined, undefined);
  if (!full.isComplete || full.percent !== 100 || full.nextQuestId !== null) return `full ${JSON.stringify(full)}`;
  return !empty.isComplete && !none.isComplete ? true : 'empty roadmap counted as complete';
});

test('completion is recorded once per course (a regenerated roadmap records again)', () => {
  if (!helper) return 'helper missing';
  const done = helper.getRoadmapProgress(MODULES, ['q1', 'q2', 'q3']);
  const half = helper.getRoadmapProgress(MODULES, ['q1']);
  const rec = helper.buildRoadmapCompletionRecord(done, 'course-react-web', new Date('2026-09-27T10:00:00Z'));
  if (rec.roadmap_completed_at !== '2026-09-27T10:00:00.000Z' || rec.roadmap_completed_course !== 'course-react-web' || rec.roadmap_completed_quests !== 3) return JSON.stringify(rec);
  if (!helper.shouldRecordRoadmapCompletion(done, {}, 'course-react-web')) return 'first completion not recorded';
  if (helper.shouldRecordRoadmapCompletion(done, rec, 'course-react-web')) return 'recorded twice';
  if (!helper.shouldRecordRoadmapCompletion(done, rec, 'course-devops')) return 'new course roadmap not recorded';
  return !helper.shouldRecordRoadmapCompletion(half, {}, 'course-react-web') ? true : 'incomplete roadmap recorded';
});

test('banner is hidden until the roadmap is complete, then leads to the project', () => {
  const banner = load(FILES.banner, { react: React });
  if (!banner) return 'RoadmapCompleteBanner.tsx missing';
  let started = 0;
  const hidden = banner.RoadmapCompleteBanner({ progress: helper.getRoadmapProgress(MODULES, ['q1']), onStartProject: () => started++ });
  if (hidden !== null) return 'shown before completion';
  const shown = banner.RoadmapCompleteBanner({ progress: helper.getRoadmapProgress(MODULES, ['q1', 'q2', 'q3']), onStartProject: () => started++ });
  const text = textOf(shown);
  const button = findAll(shown, (n) => n.type === 'button')[0];
  if (!/Roadmap complete/.test(text) || !/3\/3/.test(text)) return `text: ${text}`;
  if (!button) return 'no button';
  button.props.onClick();
  return started === 1 ? true : 'button does not start the project step';
});

test('quests hook records completion once, only on the student\'s own roadmap', () => {
  const src = fs.readFileSync(FILES.hook, 'utf8');
  if (!/getRoadmapProgress\(/.test(src)) return 'hook never computes roadmap completion';
  if (!/shouldRecordRoadmapCompletion\(/.test(src) || !/buildRoadmapCompletionRecord\(/.test(src)) return 'completion not recorded';
  if (!/activeSubTab === 'custom_roadmap' && learningPathMode === 'fused_roadmap'/.test(src)) return 'not limited to the custom roadmap';
  return /roadmapCompletionRecordedRef/.test(src) ? true : 'no once-only guard';
});

test('quests page shows the banner on the custom roadmap and routes to projects', () => {
  const src = fs.readFileSync(FILES.page, 'utf8');
  if (!/<RoadmapCompleteBanner/.test(src)) return 'banner not rendered';
  return /router\.push\('\/projects\?from=roadmap'\)/.test(src) && /isOwnRoadmapView/.test(src) ? true : 'wrong wiring';
});

console.log(`\n${pass}/${pass + fail} passed`);
process.exit(fail ? 1 : 0);
