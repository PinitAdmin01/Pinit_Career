import { COURSES_REGISTRY } from '../../src/lib/data/coursesData';
import { CANONICAL_TRAJECTORIES, recommendCareerTrajectory } from '../../src/lib/data/careerTrajectories';
import { DEGREE_SELECTION_QUESTION, ALL_GOAL_DISCOVERY_QUESTIONS, ALL_SJT_QUESTIONS } from '../../src/lib/onboarding/diagnosticRegistry';
import { evaluateDiagnosticSession } from '../../src/lib/onboarding/diagnosticEngine';
import { BCOM_GOAL_DISCOVERY_QUESTIONS } from '../../src/lib/onboarding/diagnosticRegistryCommerce';
import { BBA_GOAL_DISCOVERY_QUESTIONS } from '../../src/lib/onboarding/diagnosticRegistryBBA';
import { GENERAL_GOAL_DISCOVERY_QUESTIONS } from '../../src/lib/onboarding/diagnosticRegistryGeneral';
import * as fs from 'fs';

console.log('================================================================');
console.log('🔬 MASTER 3RD-PERSON FORENSIC QUALITY AUDIT & ADVERSARIAL SWEEP');
console.log('================================================================\n');

const registryCourseIds = new Set(COURSES_REGISTRY.map(c => c.id));
let totalAssertions = 0;
let passedAssertions = 0;

function assert(condition: boolean, msg: string) {
  totalAssertions++;
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${msg}`);
    process.exit(1);
  }
  passedAssertions++;
  console.log(`   ✅ ${msg}`);
}

// ── TEST 1: API ROUTE FILE INVENTORY & INTEGRITY ────────────────────────────
console.log('1️⃣ Checking API Routes Required by Onboarding & Dashboard...');
const requiredRoutes = [
  'src/app/api/auth/onboarding/route.ts',
  'src/app/api/career-builder/generate/route.ts',
  'src/app/api/vault/upload/route.ts',
  'src/app/api/vault/delete/route.ts',
  'src/app/api/stt/route.ts',
];

for (const r of requiredRoutes) {
  assert(fs.existsSync(r), `Route file exists: ${r}`);
}

// ── TEST 2: STEP 0 DEGREE SELECTION MULTI-DEGREE EQUALITY ────────────────────
console.log('\n2️⃣ Verifying Step 0 Degree Selection Completeness...');
assert(DEGREE_SELECTION_QUESTION.options.length === 4, 'Step 0 contains exactly 4 degree streams');
const degreeValues = DEGREE_SELECTION_QUESTION.options.map(o => o.mappedValue);
assert(degreeValues.includes('btech_bca_mca'), 'Option 1: BTech / BCA / MCA present');
assert(degreeValues.includes('bcom_mcom'), 'Option 2: B.Com / M.Com present');
assert(degreeValues.includes('bba_mba'), 'Option 3: BBA / MBA present');
assert(degreeValues.includes('other'), 'Option 4: General / Universal present');

// ── TEST 3: GOAL DISCOVERY QUESTIONS ACROSS ALL 4 STREAMS ───────────────────
console.log('\n3️⃣ Verifying Goal Discovery Sets Across All 4 Streams...');
assert(BCOM_GOAL_DISCOVERY_QUESTIONS.length >= 8, `Commerce stream has ${BCOM_GOAL_DISCOVERY_QUESTIONS.length} questions`);
assert(BBA_GOAL_DISCOVERY_QUESTIONS.length >= 10, `BBA stream has ${BBA_GOAL_DISCOVERY_QUESTIONS.length} questions`);
assert(GENERAL_GOAL_DISCOVERY_QUESTIONS.length >= 11, `General stream has ${GENERAL_GOAL_DISCOVERY_QUESTIONS.length} questions`);

// ── TEST 4: ALL 21 GENERAL CAREER FIELDS RESOLVE TO VALID REGISTRY COURSES ──
console.log('\n4️⃣ Verifying All 21 General Career Fields in Q3...');
const q3 = GENERAL_GOAL_DISCOVERY_QUESTIONS.find(q => q.id === 'Q3_GEN_CAREER_CONSIDERATION');
assert(!!q3, 'Q3_GEN_CAREER_CONSIDERATION found in General Registry');
assert(q3!.options.length === 21, `Q3 contains all 21 career options (found: ${q3!.options.length})`);

for (const opt of q3!.options) {
  const traj = recommendCareerTrajectory(opt.mappedValue as string, 70, 75, 'Pattern Hunter');
  assert(!!traj && traj.nodes.length > 0, `Option "${opt.label}" (${opt.mappedValue}) produces valid trajectory`);
  for (const node of traj.nodes) {
    assert(registryCourseIds.has(node.courseId), `Node ${node.nodeId} courseId "${node.courseId}" exists in COURSES_REGISTRY`);
  }
}

// ── TEST 5: ALL 12 BBA CAREER DIRECTIONS RESOLVE TO VALID COURSES ───────────
console.log('\n5️⃣ Verifying All 12 BBA Career Directions in Q1...');
const bbaQ1 = BBA_GOAL_DISCOVERY_QUESTIONS.find(q => q.id === 'Q1_BBA_CAREER_DIRECTION');
assert(!!bbaQ1, 'Q1_BBA_CAREER_DIRECTION found in BBA Registry');
assert(bbaQ1!.options.length === 12, `BBA Q1 contains all 12 direction options (found: ${bbaQ1!.options.length})`);

for (const opt of bbaQ1!.options) {
  const traj = recommendCareerTrajectory(opt.mappedValue as string, 70, 75, 'Pattern Hunter');
  assert(!!traj && traj.nodes.length > 0, `BBA Option "${opt.label}" (${opt.mappedValue}) produces valid trajectory`);
  for (const node of traj.nodes) {
    assert(registryCourseIds.has(node.courseId), `Node ${node.nodeId} courseId "${node.courseId}" exists in COURSES_REGISTRY`);
  }
}

// ── TEST 6: ALL 10 COMMERCE CAREER GOALS RESOLVE TO VALID COURSES ───────────
console.log('\n6️⃣ Verifying All 10 Commerce Career Goals in Q1...');
const comQ1 = BCOM_GOAL_DISCOVERY_QUESTIONS.find(q => q.id === 'Q1_COMMERCE_GOAL');
assert(!!comQ1, 'Q1_COMMERCE_GOAL found in Commerce Registry');
assert(comQ1!.options.length === 12, `Commerce Q1 contains all 12 goal options (found: ${comQ1!.options.length})`);

for (const opt of comQ1!.options) {
  const traj = recommendCareerTrajectory(opt.mappedValue as string, 70, 75, 'Pattern Hunter');
  assert(!!traj && traj.nodes.length > 0, `Commerce Option "${opt.label}" (${opt.mappedValue}) produces valid trajectory`);
  for (const node of traj.nodes) {
    assert(registryCourseIds.has(node.courseId), `Node ${node.nodeId} courseId "${node.courseId}" exists in COURSES_REGISTRY`);
  }
}

// ── TEST 7: DASHBOARD TRACK_MAP ALIGNMENT WITH TRAJECTORY TITLES ───────────
console.log('\n7️⃣ Verifying Dashboard TRACK_MAP & Trajectory Map Synchronization...');
const dashboardContent = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');
const trajMapContent = fs.readFileSync('src/components/student/dashboard/DashboardTrajectoryMap.tsx', 'utf8');

const expectedTracks = [
  'Scientific & Quantitative Research Specialist',
  'Public Policy, Compliance & Legal Specialist',
  'Education & Learning Technology Specialist',
  'Healthcare & Clinical Operations Analyst',
  'Digital Media & Communications Specialist',
  'Core Systems & Hardware Engineer',
  'Creative & Digital Arts Specialist',
  'Social Impact & Non-Profit Program Manager',
  'Management Consultant & Business Strategist',
  'Product Manager (Tech & Business Strategy)',
  'Human Resources & People Operations Specialist',
  'Digital Accountant & Taxation Specialist',
  'Financial Analyst & Investment Specialist',
  'Business Analytics & Decision Intelligence Specialist',
  'Marketing & Brand Manager',
  'Digital Marketing & Growth Strategist',
  'E-Commerce & Digital Business Specialist',
  'Entrepreneur & Business Manager',
  'Sales, Customer Success & CRM Specialist',
  'Operations, Supply Chain & Compliance Specialist',
  'AI & Digital Transformation Business Specialist'
];

for (const track of expectedTracks) {
  assert(dashboardContent.includes(track), `dashboard/page.tsx TRACK_MAP includes "${track}"`);
  assert(trajMapContent.includes(track), `DashboardTrajectoryMap.tsx TRACKS includes "${track}"`);
}

// ── TEST 8: ADVERSARIAL FULL-CYCLE EVALUATION (ZERO NaN, RESILIENT PROFILES) ─
console.log('\n8️⃣ Running Multi-Degree Adversarial Diagnostic Simulations...');
const sampleStreams: Array<'btech_bca_mca' | 'bcom_mcom' | 'bba_mba' | 'other'> = ['btech_bca_mca', 'bcom_mcom', 'bba_mba', 'other'];

for (const stream of sampleStreams) {
  // Test 100% empty skip simulation
  const emptyRes = evaluateDiagnosticSession({
    degreeTrack: stream,
    goal: { role: 'exploring', horizonMonths: 6, motivation: ['exploring'] },
    sjtAnswers: {},
    matrixRatings: {},
    tradeoffAnswers: {},
    latenciesMs: {}
  });

  assert(typeof emptyRes.behaviorProfile.PH.evidence === 'number' && !isNaN(emptyRes.behaviorProfile.PH.evidence), `${stream}: PH is valid number`);
  assert(typeof emptyRes.behaviorProfile.EX.evidence === 'number' && !isNaN(emptyRes.behaviorProfile.EX.evidence), `${stream}: EX is valid number`);
  assert(typeof emptyRes.behaviorProfile.ST.evidence === 'number' && !isNaN(emptyRes.behaviorProfile.ST.evidence), `${stream}: ST is valid number`);
  assert(typeof emptyRes.behaviorProfile.SIQ.evidence === 'number' && !isNaN(emptyRes.behaviorProfile.SIQ.evidence), `${stream}: SIQ is valid number`);

  const sumAllocations =
    emptyRes.roadmapStrategy.allocations.explorationPct +
    emptyRes.roadmapStrategy.allocations.executionPct +
    emptyRes.roadmapStrategy.allocations.communicationPct +
    emptyRes.roadmapStrategy.allocations.technicalGapPct;

  assert(sumAllocations === 100, `${stream}: Dynamic Roadmap Allocations sum to exactly 100% (${sumAllocations}%)`);
}

console.log('\n================================================================');
console.log(`🎉 MASTER AUDIT COMPLETE: ${passedAssertions} / ${totalAssertions} INVARIANTS 100% VERIFIED!`);
console.log('================================================================');
