/**
 * Roadmap → project hand-off (audit 4b.2) and project evidence on the student's own track (4b.4).
 *
 *   node scripts/tests/test_roadmap_capstone.cjs
 *   (from the sandbox: node dark-gracity/claude_sandbox/test_roadmap_capstone.cjs)
 *   CAPSTONE_SRC=src … runs the same checks against the current src/ files.
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
const USE_SRC = process.env.CAPSTONE_SRC === 'src' || !fs.existsSync(path.join(__dirname, 'roadmapCapstone.ts'));
const pick = (sandboxName, srcRel) => (USE_SRC ? path.join(ROOT, srcRel) : path.join(__dirname, sandboxName));
const FILES = {
  capstone: pick('roadmapCapstone.ts', 'src/lib/projects/roadmapCapstone.ts'),
  evidence: pick('projectEvidence.ts', 'src/lib/projects/projectEvidence.ts'),
  page: pick('projects-page.tsx', 'src/app/projects/page.tsx'),
};
const CATALOG_COMPETENCIES = new Set(
  [...fs.readFileSync(path.join(ROOT, 'src/lib/pathway/competencyCatalog.ts'), 'utf8').matchAll(/id:\s*'(comp_[a-z0-9_]+)'/g)].map((m) => m[1]));
const CATALOG_PROGRAMS = new Set(
  [...fs.readFileSync(path.join(ROOT, 'src/lib/pathway/programEngine.ts'), 'utf8').matchAll(/id:\s*'(prog_[a-z0-9_]+)'/g)].map((m) => m[1]));

function load(file) {
  if (!fs.existsSync(file)) return null;
  const out = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  const mod = { exports: {} };
  new Function('require', 'module', 'exports', out)(() => ({}), mod, mod.exports);
  return mod.exports;
}

let pass = 0, fail = 0;
function test(name, fn) {
  let why;
  try { why = fn(); } catch (e) { why = `threw: ${e.message}`; }
  if (why === true) { pass++; console.log(`  ✓ ${name}`); } else { fail++; console.log(`  ✗ ${name}${why ? ` — ${why}` : ''}`); }
}

console.log(`Roadmap capstone + project evidence (page: ${path.relative(ROOT, FILES.page)})\n`);
const cap = load(FILES.capstone);
const ev = load(FILES.evidence);
const P = (id, status, extra = {}) => ({ id, name: id, level: 'Intermediate', status, ...extra });

test('a finished roadmap gives the project step its course and role', () => {
  if (!cap) return 'src/lib/projects/roadmapCapstone.ts missing';
  if (cap.getRoadmapCapstoneContext({ role: 'Data Analyst' }) !== null) return 'context without a finished roadmap';
  const ctx = cap.getRoadmapCapstoneContext({ role: ' Data Analyst ', roadmap_completed_at: '2026-09-27T10:00:00Z', roadmap_completed_course: 'course-data' });
  return ctx && ctx.goal === 'Data Analyst' && ctx.courseId === 'course-data' ? true : JSON.stringify(ctx);
});

test('the capstone already handed out is reused (started one first), other courses ignored', () => {
  if (!cap) return 'helper missing';
  const ctx = { courseId: 'course-data', completedAt: 'x', goal: 'Data Analyst' };
  const list = [
    P('other', 'In Progress'),
    P('rm_other_course', 'In Progress', { origin: 'roadmap', roadmapCourseId: 'course-web' }),
    P('rm_new', 'Not Started', { origin: 'roadmap', roadmapCourseId: 'course-data' }),
    P('rm_started', 'In Progress', { origin: 'roadmap', roadmapCourseId: 'course-data' }),
  ];
  const got = cap.findRoadmapCapstone(list, ctx);
  if (!got || got.id !== 'rm_started') return `picked ${got && got.id}`;
  return cap.findRoadmapCapstone([P('other', 'Completed')], ctx) === null ? true : 'non-roadmap project picked';
});

test('generated projects are tagged with the roadmap they belong to', () => {
  if (!cap) return 'helper missing';
  const tagged = cap.tagRoadmapCapstones([P('a', 'Not Started')], { courseId: 'course-data', completedAt: 'x', goal: 'g' });
  return tagged[0].origin === 'roadmap' && tagged[0].roadmapCourseId === 'course-data' && tagged[0].id === 'a' ? true : JSON.stringify(tagged[0]);
});

test('project evidence goes to the student\'s own track', () => {
  if (!ev) return 'src/lib/projects/projectEvidence.ts missing';
  const sw = ev.getProjectEvidenceTarget('Full Stack Developer', 'Advanced');
  const data = ev.getProjectEvidenceTarget('Data & Business Analytics Specialist', 'Intermediate');
  const ai = ev.getProjectEvidenceTarget('AI Engineer', 'Advanced');
  const bcom = ev.getProjectEvidenceTarget('Chartered Accountant (Finance & Audit)', 'Intermediate');
  if (!sw || sw.programId !== 'prog_swe_accelerated_9m') return `software → ${JSON.stringify(sw)}`;
  if (!data || data.programId !== 'prog_data_analytics' || !data.competencyId.startsWith('comp_data_')) return `data → ${JSON.stringify(data)}`;
  if (!ai || !ai.competencyId.startsWith('comp_ai_')) return `ai → ${JSON.stringify(ai)}`;
  return bcom === null ? true : `commerce track got software/data evidence: ${JSON.stringify(bcom)}`;
});

test('every evidence id exists in the program and competency catalogs', () => {
  if (!ev) return 'helper missing';
  const badComp = ev.PROJECT_EVIDENCE_IDS.competencies.filter((c) => !CATALOG_COMPETENCIES.has(c));
  const badProg = ev.PROJECT_EVIDENCE_IDS.programs.filter((p) => !CATALOG_PROGRAMS.has(p));
  return badComp.length || badProg.length ? `not in catalog: ${[...badComp, ...badProg].join(', ')}` : true;
});

test('Projects page uses no competency or program id that is missing from the catalogs', () => {
  const src = fs.readFileSync(FILES.page, 'utf8');
  const comps = [...new Set([...src.matchAll(/'(comp_[a-z0-9_]+)'/g)].map((m) => m[1]))].filter((c) => !CATALOG_COMPETENCIES.has(c));
  const progs = [...new Set([...src.matchAll(/'(prog_[a-z0-9_]+)'/g)].map((m) => m[1]))].filter((p) => !CATALOG_PROGRAMS.has(p));
  if (comps.length) return `evidence recorded against competencies that don't exist: ${comps.join(', ')}`;
  return /getProjectEvidenceTarget\(/.test(src) ? true : 'page does not use getProjectEvidenceTarget';
});

test('Projects page hands a finished roadmap its capstone (once) and unlocks for it', () => {
  const src = fs.readFileSync(FILES.page, 'utf8');
  if (!/searchParams\?\.get\('from'\) === 'roadmap'/.test(src)) return 'from=roadmap not handled';
  if (!/findRoadmapCapstone\(/.test(src) || !/handleGenerate(Ref\.current)?\(roadmapCtx\)/.test(src)) return 'capstone not reused/generated';
  if (!/roadmapHandoffRef/.test(src)) return 'no once-only guard';
  if (/onClick=\{handleGenerate\}/.test(src)) return 'button passes the click event into handleGenerate';
  return /\|\| Boolean\(roadmapCtx\)/.test(src) ? true : 'page stays locked after the roadmap';
});

console.log(`\n${pass}/${pass + fail} passed`);
process.exit(fail ? 1 : 0);
