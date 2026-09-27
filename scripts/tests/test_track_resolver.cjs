/**
 * Onboarding goal → career track / roadmap course (audit 2.3, T12): every onboarding option maps
 * to its own track, and free text matches whole words only (no "ml" in "html", "ui" in "build",
 * "next" in any sentence, "front" in "front office", "data" in "data structures").
 *
 *   node scripts/tests/test_track_resolver.cjs
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
  resolver: path.join(ROOT, 'src/lib/onboarding/trackResolver.ts'),
  wizard: path.join(ROOT, 'src/app/onboarding/hooks/useOnboardingWizard.ts'),
  registries: ['diagnosticRegistry.ts', 'diagnosticRegistryCommerce.ts', 'diagnosticRegistryBBA.ts', 'diagnosticRegistryGeneral.ts']
    .map((f) => path.join(ROOT, 'src/lib/onboarding', f)),
};

function load(file) {
  if (!fs.existsSync(file)) return null;
  const out = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    fileName: file, compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const mod = { exports: {} };
  new Function('require', 'module', 'exports', out)(() => { throw new Error('unexpected import'); }, mod, mod.exports);
  return mod.exports;
}

const mod = load(FILES.resolver);
const label = (goal, profile) => mod.resolveTrackFromGoal(goal, profile).targetRoleLabel;

const L = {
  ai: 'AI & LLM Systems Engineer', analytics: 'Data & Business Analytics Specialist', cyber: 'Cybersecurity Analyst',
  frontend: 'React Frontend Web SDE', devops: 'Cloud & DevOps Engineer', uiux: 'UI/UX Product Designer',
  fullstack: 'Full-Stack Software Developer', accounting: 'Audit, Taxation & Digital Accounting Specialist',
  banking: 'Banking & Financial Services Specialist', investment: 'Investment & Equity Research Analyst',
  hr: 'Human Resources & Talent Lead', digitalMarketing: 'Digital Marketing & Growth Strategist',
  marketing: 'Marketing & Brand Manager', ecommerce: 'E-Commerce & Digital Business Specialist',
  entrepreneur: 'Entrepreneur & Business Manager', sales: 'Sales, Customer Success & CRM Specialist',
  transformation: 'AI & Digital Transformation Business Specialist', finance: 'Financial & Investment Analyst',
  consulting: 'Management Consultant & Business Strategist', product: 'Product Manager (Tech & Business Strategy)',
  operations: 'Operations, Supply Chain & Compliance Specialist', qa: 'QA & Test Automation Engineer',
  research: 'Scientific & Quantitative Research Specialist', policy: 'Public Policy, Compliance & Legal Specialist',
  education: 'Education & Learning Technology Specialist', healthcare: 'Healthcare & Clinical Operations Analyst',
  media: 'Digital Media & Communications Specialist', hardware: 'Core Systems & Hardware Engineer',
  creative: 'Creative & Digital Arts Specialist', iot: 'IoT & Embedded Systems Engineer', mobile: 'Mobile App Developer',
  blockchain: 'Blockchain & Web3 Developer', python: 'Python Backend Developer', dsa: 'Software Engineer (DSA & Problem Solving)', social: 'Social Impact & Non-Profit Program Manager', java: 'Java Backend SDE',
};

let pass = 0, fail = 0;
function test(name, fn) {
  let why;
  try { why = fn(); } catch (e) { why = `threw: ${e.message}`; }
  if (why === true) { pass++; console.log(`  ✓ ${name}`); } else { fail++; console.log(`  ✗ ${name}${why ? ` — ${why}` : ''}`); }
}
const check = (cases) => {
  const bad = cases.find(([goal, want, profile]) => label(goal, profile) !== want);
  return bad ? `"${bad[0]}" → ${label(bad[0], bad[2])} (want ${bad[1]})` : true;
};

console.log('Onboarding goal → career track\n');
if (!mod) { console.log('  ✗ src/lib/onboarding/trackResolver.ts missing'); process.exit(1); }

test('every tech role option has its own track (product manager, digital marketing were wrong)', () => check([
  ['frontend_developer', L.frontend], ['backend_developer', L.java], ['full_stack_developer', L.fullstack],
  ['ai_ml_engineer', L.ai], ['data_analyst', L.analytics], ['ui_ux_designer', L.uiux], ['qa_engineer', L.qa],
  ['cybersecurity', L.cyber], ['cloud_devops', L.devops], ['product_manager', L.product],
  ['financial_analyst', L.finance], ['digital_marketing', L.digitalMarketing],
]));

test('commerce and BBA options', () => check([
  ['accounting_finance', L.accounting], ['banking_services', L.banking], ['audit_taxation', L.accounting],
  ['business_analytics', L.analytics], ['investment_markets', L.investment], ['corporate_management', L.consulting, 'B.Com'],
  ['human_resources', L.hr], ['marketing_sales', L.marketing], ['entrepreneurship', L.entrepreneur], ['higher_education', L.research, 'B.Com'],
  ['management_strategy', L.consulting], ['marketing_growth', L.digitalMarketing], ['sales_bizdev', L.sales],
  ['corporate_finance', L.finance], ['consulting', L.consulting], ['operations_supplychain', L.operations],
  ['product_management', L.product], ['entrepreneurship_startup', L.entrepreneur], ['banking_financial_services', L.banking],
]));

test('general-stream options (business, technology used to fall to Java backend)', () => check([
  ['technology', L.fullstack], ['research', L.research], ['data', L.analytics], ['design', L.uiux], ['media', L.media],
  ['education', L.education], ['healthcare', L.healthcare], ['public_sector', L.policy], ['business', L.entrepreneur],
  ['finance', L.finance], ['marketing', L.marketing], ['operations', L.operations], ['law', L.policy],
  ['engineering', L.hardware], ['scientific', L.research], ['creative', L.creative], ['social_sector', L.social],
]));

test('every option id in the onboarding questions is handled deliberately', () => {
  const ids = new Set();
  for (const file of FILES.registries) {
    const src = fs.readFileSync(file, 'utf8');
    for (const q of ['Q2_PRIMARY_ROLE', 'Q1_COMMERCE_GOAL', 'Q1_BBA_CAREER_DIRECTION', 'Q3_GEN_CAREER_CONSIDERATION']) {
      const i = src.indexOf(`id: '${q}'`);
      if (i < 0) continue;
      const j = src.indexOf("id: 'Q", i + 10);
      for (const m of src.slice(i, j < 0 ? undefined : j).matchAll(/mappedValue: '([^']*)'/g)) ids.add(m[1]);
    }
  }
  const undecided = ['exploring', 'other', 'not_sure', 'government_exams'];
  const fallback = [...ids].filter((id) => !undecided.includes(id) && label(id, 'B.Tech') === L.java && id !== 'backend_developer');
  return ids.size >= 50 && fallback.length === 0 ? true : `${ids.size} ids; falling to the default: ${fallback.join(', ')}`;
});

test('typed goals: short keywords no longer match inside other words', () => {
  const wrong = [
    ['HTML developer', L.ai], ['XML and YAML config work', L.ai], ['I want to build mobile apps', L.uiux],
    ['front office executive', L.frontend], ['what is the next step for me', L.frontend],
    ['data structures and algorithms', L.analytics], ['latest contest winner', L.qa], ['software engineering', L.hardware],
    ['system design expert', L.uiux], ['computer science graduate', L.research],
  ].find(([goal, notWanted]) => label(goal) === notWanted);
  if (wrong) return `"${wrong[0]}" → ${label(wrong[0])}`;
  return check([
    ['HTML developer', L.frontend], ['software engineering', L.java], ['front-end developer', L.frontend],
    ['I want to build mobile apps', L.mobile], ['front office executive', L.operations], ['data structures and algorithms', L.dsa],
  ]);
});

test('typed goals: the intended track is found', () => check([
  ['Machine Learning Engineer', L.ai], ['AI/ML', L.ai], ['GenAI apps', L.ai], ['data science', L.analytics],
  ['Full-Stack web developer', L.fullstack], ['Next.js developer', L.frontend], ['cyber security', L.cyber],
  ['AWS cloud engineer', L.devops], ['UI/UX designer', L.uiux], ['QA tester', L.qa], ['e-commerce', L.ecommerce],
  ['chartered accountant', L.accounting], ['stock market trader', L.investment], ['HR recruiter', L.hr],
  ['SEO specialist', L.digitalMarketing], ['brand manager', L.marketing], ['start a business', L.entrepreneur],
  ['sales executive', L.sales], ['AI transformation consultant', L.transformation], ['fintech', L.finance],
  ['project manager', L.product], ['supply chain', L.operations], ['lawyer', L.policy], ['teacher', L.education],
  ['hospital administration', L.healthcare], ['journalist', L.media], ['robotics', L.hardware],
  ['graphic designer', L.creative], ['NGO work', L.social], ['embedded firmware', L.iot],
  ['React Native developer', L.mobile], ['android apps', L.mobile], ['blockchain developer', L.blockchain], ['smart contracts', L.blockchain],
  ['Python developer', L.python], ['Python for data science', L.analytics], ['leetcode and DSA', L.dsa],
]));

test('a saved role label resolves to its own track (every label)', () => {
  const bad = Object.values(mod.TRACKS).find((t) => label(t.targetRoleLabel) !== t.targetRoleLabel);
  return bad ? `"${bad.targetRoleLabel}" → ${label(bad.targetRoleLabel)}` : true;
});

test('no goal: the degree decides; a goal always wins over the degree', () => check([
  ['exploring', L.finance, 'Commerce (B.Com)'], ['not_sure', L.operations, 'BBA'], ['', L.java, 'B.Tech CS'],
  ['research', L.research, 'B.Com'], ['human_resources', L.hr, 'MBA'],
]));

test('the onboarding wizard uses this resolver (no keyword copy left inside it)', () => {
  const wizard = fs.readFileSync(FILES.wizard, 'utf8');
  if (!/from '@\/lib\/onboarding\/trackResolver'/.test(wizard)) return 'wizard does not import the resolver';
  return /goal\.includes\('ml'\)|const resolveTrackFromGoal = /.test(wizard) ? 'old substring resolver still in the wizard' : true;
});

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
