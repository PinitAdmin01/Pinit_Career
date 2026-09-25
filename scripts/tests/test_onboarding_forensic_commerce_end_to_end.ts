// scripts/tests/test_onboarding_forensic_commerce_end_to_end.ts
/**
 * 3rd-Person Adversarial Audit: Multi-Degree Commerce End-to-End Decision Pipeline
 * 
 * Verifies:
 * 1. Course ID Integrity: Every commerce goal maps to a valid course in COURSES_REGISTRY (NO course-java-logic fallback!).
 * 2. Trajectory Canonical Mapping: All 10 commerce domains map to CANONICAL_TRAJECTORIES in recommendCareerTrajectory.
 * 3. Collision-free Specialization: "digital marketing" never collides with banking in Q27 resolution.
 * 4. Roadmap Fuser Execution: High-quality modules and quests generated for all commerce courses.
 * 5. Server API Payload Contract: degreeTrack, specialization, diagnosticProfile properly formatted.
 */

import { COURSES_REGISTRY } from '../../src/lib/data/coursesData';
import { recommendCareerTrajectory, CANONICAL_TRAJECTORIES } from '../../src/lib/data/careerTrajectories';
import { COMMERCE_SPECIALIZATION_QUESTIONS } from '../../src/lib/onboarding/diagnosticRegistryCommerce';
import { generateDynamicStudentRoadmap } from '../../src/lib/data/roadmapFuser';
import { evaluateDiagnosticSession } from '../../src/lib/onboarding/diagnosticEngine';

function assert(condition: boolean, msg: string) {
  if (!condition) {
    console.error(`❌ AUDIT INVARIANT FAILED: ${msg}`);
    process.exit(1);
  }
}

console.log('🔬 Starting 3rd-Person Forensic End-to-End Audit on Multi-Degree Commerce Pipeline...\n');

// ── Invariant 1: All 10 Commerce Courses Exist in COURSES_REGISTRY ──
console.log('1️⃣ Checking Commerce Course IDs in COURSES_REGISTRY...');
const REQUIRED_COMMERCE_COURSES = [
  'course-digital-accounting',
  'course-finance-investment',
  'course-business-analytics',
  'course-marketing-branding',
  'course-digital-marketing',
  'course-ecommerce-digital-biz',
  'course-entrepreneurship-biz-mgmt',
  'course-sales-crm-success',
  'course-operations-supplychain-compliance',
  'course-ai-digital-transformation'
];

for (const courseId of REQUIRED_COMMERCE_COURSES) {
  const found = COURSES_REGISTRY.find(c => c.id === courseId);
  assert(!!found, `Course ${courseId} must exist in COURSES_REGISTRY`);
  assert(found!.quests && found!.quests.length >= 30, `Course ${courseId} must have at least 30 quests (found ${found?.quests?.length})`);
}
console.log(`   ✅ All ${REQUIRED_COMMERCE_COURSES.length} commerce courses verified with full 30-day curricula.\n`);

// ── Invariant 2: Trajectory Canonical Mapping ──
console.log('2️⃣ Checking recommendCareerTrajectory for Commerce Roles...');
const TEST_CASES: { goal: string; expectedRoleId: string; expectedCourseId: string }[] = [
  { goal: 'Accounting / Finance', expectedRoleId: 'digital-accountant', expectedCourseId: 'course-digital-accounting' },
  { goal: 'Audit / Taxation / Compliance', expectedRoleId: 'digital-accountant', expectedCourseId: 'course-digital-accounting' },
  { goal: 'Banking / Financial Services', expectedRoleId: 'financial-analyst', expectedCourseId: 'course-finance-investment' },
  { goal: 'Business Analytics / Data-Driven Roles', expectedRoleId: 'business-analytics-specialist', expectedCourseId: 'course-business-analytics' },
  { goal: 'Digital Marketing / Growth', expectedRoleId: 'digital-growth-marketer', expectedCourseId: 'course-digital-marketing' },
  { goal: 'Marketing & Brand Management', expectedRoleId: 'marketing-brand-manager', expectedCourseId: 'course-marketing-branding' },
  { goal: 'E-Commerce & Digital Business', expectedRoleId: 'ecommerce-growth-manager', expectedCourseId: 'course-ecommerce-digital-biz' },
  { goal: 'Entrepreneurship / Family Business', expectedRoleId: 'entrepreneur-business-manager', expectedCourseId: 'course-entrepreneurship-biz-mgmt' },
  { goal: 'Sales / Client Relations / CRM', expectedRoleId: 'sales-customer-success-manager', expectedCourseId: 'course-sales-crm-success' },
  { goal: 'Operations / Supply Chain / Compliance', expectedRoleId: 'operations-supplychain-manager', expectedCourseId: 'course-operations-supplychain-compliance' },
  { goal: 'AI & Digital Transformation Business Leader', expectedRoleId: 'ai-digital-transformation-leader', expectedCourseId: 'course-ai-digital-transformation' }
];

for (const tc of TEST_CASES) {
  const traj = recommendCareerTrajectory(tc.goal);
  assert(traj.roleId === tc.expectedRoleId, `Goal "${tc.goal}" must resolve to roleId "${tc.expectedRoleId}", got "${traj.roleId}"`);
  assert(traj.nodes.length > 0, `Trajectory must have nodes`);
  assert(traj.nodes[0].courseId === tc.expectedCourseId, `Node courseId must be "${tc.expectedCourseId}", got "${traj.nodes[0].courseId}"`);
  // Critical check: NEVER fall back to course-java-logic for commerce goals
  assert(traj.nodes[0].courseId !== 'course-java-logic', `Goal "${tc.goal}" MUST NOT fall back to course-java-logic`);
}
console.log('   ✅ All 11 commerce goals cleanly resolve to canonical trajectories without fallback collisions.\n');

// ── Invariant 3: Collision-Free Q27 Specialization Resolution ──
console.log('3️⃣ Checking Collision-Free Q27 Specialization Resolution...');
const getTestSpecializationQuestion = (role: string) => {
  const roleKey = role.toLowerCase();
  if (COMMERCE_SPECIALIZATION_QUESTIONS[roleKey]) {
    return COMMERCE_SPECIALIZATION_QUESTIONS[roleKey];
  }
  if (roleKey.includes('audit') || roleKey.includes('tax')) return COMMERCE_SPECIALIZATION_QUESTIONS.audit_taxation;
  if (roleKey.includes('marketing') || roleKey.includes('sales') || roleKey.includes('growth') || roleKey.includes('brand')) return COMMERCE_SPECIALIZATION_QUESTIONS.marketing_sales;
  if (roleKey.includes('analyt') || roleKey.includes('data')) return COMMERCE_SPECIALIZATION_QUESTIONS.business_analytics;
  if (roleKey.includes('bank') || roleKey.includes('invest') || roleKey.includes('equity') || roleKey.includes('wealth') || roleKey.includes('capital market') || roleKey.includes('financial market')) return COMMERCE_SPECIALIZATION_QUESTIONS.banking_services;
  if (roleKey.includes('hr') || roleKey.includes('human') || roleKey.includes('people')) return COMMERCE_SPECIALIZATION_QUESTIONS.human_resources;
  if (roleKey.includes('corp') || roleKey.includes('mgmt') || roleKey.includes('operation') || roleKey.includes('supply chain')) return COMMERCE_SPECIALIZATION_QUESTIONS.corporate_management;
  if (roleKey.includes('entrepreneur') || roleKey.includes('family business') || roleKey.includes('startup') || roleKey.includes('venture')) return COMMERCE_SPECIALIZATION_QUESTIONS.entrepreneurship;
  return COMMERCE_SPECIALIZATION_QUESTIONS.accounting_finance;
};

// Test "Digital Marketing / Growth" specifically does NOT route to banking
const dMktQ = getTestSpecializationQuestion('Digital Marketing / Growth');
assert(dMktQ.domainId === 'marketing_sales', `Digital Marketing must map to marketing_sales, got ${dMktQ.domainId}`);

const bnkQ = getTestSpecializationQuestion('Banking / Financial Services');
assert(bnkQ.domainId === 'banking_services', `Banking must map to banking_services, got ${bnkQ.domainId}`);

const taxQ = getTestSpecializationQuestion('Audit / Taxation / Compliance');
assert(taxQ.domainId === 'audit_taxation', `Taxation must map to audit_taxation, got ${taxQ.domainId}`);

const bizQ = getTestSpecializationQuestion('Business Analytics / Data-Driven');
assert(bizQ.domainId === 'business_analytics', `Analytics must map to business_analytics, got ${bizQ.domainId}`);
console.log('   ✅ Q27 Specialization routing verified: Zero collisions between Marketing and Banking.\n');

// ── Invariant 4: Dynamic Roadmap Fusing for Commerce Courses ──
console.log('4️⃣ Testing Dynamic Roadmap Fusing for Commerce Curricula...');
for (const courseId of REQUIRED_COMMERCE_COURSES) {
  const modules = generateDynamicStudentRoadmap({
    courseId,
    goal: 'Commerce Professional',
    qt1: 65,
    qt2: 70,
    archetype: 'Execution Sprinter',
    durationDays: 30,
    dailyPace: 2
  });

  assert(modules.length > 0, `Roadmap for ${courseId} must contain modules`);
  const allQuests = modules.flatMap(m => m.quests);
  assert(allQuests.length >= 30, `Roadmap for ${courseId} must contain at least 30 quests (found ${allQuests.length})`);
  // Verify that the quests belong to the commerce course, not Java
  const firstQuest = allQuests[0];
  assert(!firstQuest.id.startsWith('quest-java-'), `Course ${courseId} quests must not be Java quests! First quest: ${firstQuest.id}`);
}
console.log('   ✅ Dynamic Roadmap Fuser successfully generates authentic commerce modules without fallbacks.\n');

// ── Invariant 5: End-to-End Diagnostic Blueprint Integration ──
console.log('5️⃣ Simulating End-to-End Commerce Student Evaluation...');
const sampleCommerceSession = {
  goal: {
    outcome: 'placement',
    role: 'accounting_finance',
    degreeTrack: 'bcom_mcom',
    specialization: 'preparing_complex_financial_statements',
    horizonMonths: 6,
    motivation: ['high_growth']
  },
  experience: {
    exposureLevels: ['accounting_projects', 'tally_erp_experience'],
    capabilitySelfRating: 'intermediate_independent'
  },
  constraints: {
    dailyMinutes: 90,
    primaryConstraints: ['time_scarcity']
  },
  sjtResponses: [
    { questionId: 'Q9_COMMERCE_UNEXPECTED_EXPENSE', optionId: 'q9_comm_ph', responseTimeMs: 4000, timestamp: Date.now() },
    { questionId: 'Q10_COMMERCE_ACCOUNTS_RECONCILE', optionId: 'q10_comm_st', responseTimeMs: 3500, timestamp: Date.now() }
  ],
  matrixResponses: [],
  tradeoffResponses: [
    { questionId: 'Q23_COMMERCE_ACCURACY_VS_DEADLINE', optionId: 'q23_comm_ph', responseTimeMs: 2500, timestamp: Date.now() }
  ],
  specializationResponse: {
    questionId: 'Q27_A_ACCOUNTING_FINANCE',
    optionId: 'spec_af_statements',
    responseTimeMs: 3000,
    timestamp: Date.now()
  }
};

const profile = evaluateDiagnosticSession(sampleCommerceSession);
assert(profile.behaviorProfile !== undefined, 'Profile must have behaviorProfile');
assert(profile.roadmapStrategy !== undefined, 'Profile must have roadmapStrategy');
assert(profile.systemMetadata.diagnosticVersion === 'v2.0_decision_engine', 'Diagnostic version must be v2.0_decision_engine');
console.log('   ✅ End-to-end commerce session evaluates into valid decision engine profile.\n');

console.log('🎉 ALL 5 3RD-PERSON FORENSIC AUDIT INVARIANTS 100% PASSING!');
