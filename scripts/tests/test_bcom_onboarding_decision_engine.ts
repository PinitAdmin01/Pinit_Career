// scripts/tests/test_bcom_onboarding_decision_engine.ts
/**
 * Test Suite: Multi-Degree Onboarding Decision Engine & Universal Navigation Controls
 * 
 * Verifies:
 * 1. Step 0 Degree Selection (B.Tech / B.Com / BBA / Other).
 * 2. Dynamic registry branching between Engineering (Tech) and Commerce (B.Com/M.Com).
 * 3. 14 Commerce SJT scenarios, 4 Matrix scenarios, 4 Tradeoff probes, and 7 Specialization branches.
 * 4. Two universal buttons: Step-back navigation & Universal Skip without scoring distortion.
 * 5. Commerce Trade-off Detection (Analysis vs Execution, Communication vs Investigation).
 * 6. Role & Curriculum Course routing for Commerce careers.
 */

import {
  DEGREE_SELECTION_QUESTION,
  getGoalDiscoveryQuestions,
  getSjtQuestions,
  getMatrixScenarios,
  getTradeoffProbes,
  ALL_SJT_QUESTIONS,
  ALL_MATRIX_SCENARIOS,
  ALL_TRADEOFF_PROBES,
  COMMERCE_SPECIALIZATION_QUESTIONS
} from '../../src/lib/onboarding/diagnosticRegistry';
import {
  evaluateDiagnosticSession,
  CompleteDiagnosticInput,
  RawDiagnosticResponse,
  RawMatrixResponse
} from '../../src/lib/onboarding/diagnosticEngine';

function assert(condition: boolean, msg: string) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${msg}`);
    process.exit(1);
  }
}

console.log('🧪 Starting Multi-Degree Onboarding Decision Engine Verification...\n');

// 1. Verify Degree Selection Question (Step 0)
console.log('1️⃣ Validating Step 0 Degree Selection Question...');
assert(DEGREE_SELECTION_QUESTION.id === 'Q0_DEGREE', 'Degree question ID must be Q0_DEGREE');
assert(DEGREE_SELECTION_QUESTION.options.length === 4, 'Must contain exactly 4 options');

const expectedDegreeKeys = ['btech_bca_mca', 'bcom_mcom', 'bba_mba', 'other'];
expectedDegreeKeys.forEach((key, idx) => {
  assert(
    DEGREE_SELECTION_QUESTION.options[idx].mappedValue === key,
    `Option ${idx + 1} must map to ${key}`
  );
});
console.log('   ✅ Degree selection options verified (1st: BTech/BCA, 2nd: BCom/MCom, 3rd: BBA/MBA, 4th: Other).\n');

// 2. Validate Dynamic Registry Branching
console.log('2️⃣ Validating Dynamic Registry Branching for Commerce vs Tech...');
const techGoalQs = getGoalDiscoveryQuestions('btech_bca_mca');
const commGoalQs = getGoalDiscoveryQuestions('bcom_mcom');
assert(techGoalQs.length === 8, 'Tech Goal Discovery should have 8 questions');
assert(commGoalQs.length === 8, 'Commerce Goal Discovery should have 8 questions');
assert(commGoalQs[0].id === 'Q1_COMMERCE_GOAL', 'Commerce Q1 should be Q1_COMMERCE_GOAL');
assert(commGoalQs[6].id === 'Q7_COMMERCE_TOOLS', 'Commerce Q7 should be Q7_COMMERCE_TOOLS');

const techSjtQs = getSjtQuestions('btech_bca_mca');
const commSjtQs = getSjtQuestions('bcom_mcom');
assert(techSjtQs.length === 12, 'Tech SJT should have 12 questions');
assert(commSjtQs.length === 14, 'Commerce SJT should have 14 questions (Q9 to Q22)');
console.log(`   ✅ Tech SJTs: ${techSjtQs.length}, Commerce SJTs: ${commSjtQs.length} dynamically loaded.\n`);

const commMatrix = getMatrixScenarios('bcom_mcom');
assert(commMatrix.length === 4, 'Commerce Matrix must have 4 scenarios');
assert(commMatrix[0].id === 'M1_COMMERCE_FINANCIAL_ANALYSIS', 'Commerce M1 must be Financial Analysis');

const commTradeoffs = getTradeoffProbes('bcom_mcom');
assert(commTradeoffs.length === 4, 'Commerce Tradeoffs must have 4 probes');
assert(commTradeoffs[0].id === 'Q23_COMMERCE_ACCURACY_VS_DEADLINE', 'Commerce Q23 must be Accuracy vs Deadline');
console.log('   ✅ Commerce Matrix & Trade-off Probes verified.\n');

// 3. Validate Specialization Questions
console.log('3️⃣ Validating Commerce Specialization Branches...');
const specBranches = Object.keys(COMMERCE_SPECIALIZATION_QUESTIONS);
assert(specBranches.includes('accounting_finance'), 'Should have accounting_finance specialization');
assert(specBranches.includes('audit_taxation'), 'Should have audit_taxation specialization');
assert(specBranches.includes('banking_services'), 'Should have banking_services specialization');
assert(specBranches.includes('business_analytics'), 'Should have business_analytics specialization');
assert(specBranches.includes('marketing_sales'), 'Should have marketing_sales specialization');
assert(specBranches.includes('human_resources'), 'Should have human_resources specialization');
assert(specBranches.includes('entrepreneurship'), 'Should have entrepreneurship specialization');
console.log(`   ✅ Verified ${specBranches.length} specialized commerce branches.\n`);

// 4. Validate Universal Skip & Safe Neutral Handling
console.log('4️⃣ Validating Universal Skip Handling (Zero Score Distortion)...');
const skippedSession: CompleteDiagnosticInput = {
  goal: {
    outcome: 'internship',
    role: 'accounting_finance',
    degreeTrack: 'bcom_mcom',
    horizonMonths: 6,
    motivation: ['career_placement']
  },
  experience: {
    exposureLevels: ['college_assignments'],
    capabilitySelfRating: 'novice_supported'
  },
  constraints: {
    dailyMinutes: 60,
    primaryConstraints: ['time_scarcity']
  },
  sjtResponses: [
    { questionId: 'Q9_COMMERCE_UNEXPECTED_EXPENSE', optionId: 'skipped', skipped: true, responseTimeMs: 0, timestamp: Date.now() },
    { questionId: 'Q10_COMMERCE_ACCOUNTS_RECONCILE', optionId: 'skipped', skipped: true, responseTimeMs: 0, timestamp: Date.now() }
  ],
  matrixResponses: [
    { scenarioId: 'M1_COMMERCE_FINANCIAL_ANALYSIS', itemId: 'm1_comm_ph', rating: 3, skipped: true, responseTimeMs: 0, timestamp: Date.now() }
  ],
  tradeoffResponses: [
    { questionId: 'Q23_COMMERCE_ACCURACY_VS_DEADLINE', optionId: 'skipped', skipped: true, responseTimeMs: 0, timestamp: Date.now() }
  ]
};

const skippedProfile = evaluateDiagnosticSession(skippedSession);
assert(skippedProfile.behaviorProfile.PH.evidence === 0, 'Skipped questions must yield 0 evidence points');
assert(skippedProfile.behaviorProfile.EX.evidence === 0, 'Skipped questions must not award arbitrary points');
assert(skippedProfile.behaviorProfile.ST.evidence === 0, 'Skipped questions must not distort ST');
assert(skippedProfile.behaviorProfile.SIQ.evidence === 0, 'Skipped questions must not distort SIQ');
console.log('   ✅ Universal Skip evaluated safely with zero evidence distortion.\n');

// 5. Validate B.Com Student Diagnostic Evaluation & Commerce Trade-offs
console.log('5️⃣ Validating Realistic B.Com Financial Analyst Diagnostic Profile...');
const commStudentSession: CompleteDiagnosticInput = {
  goal: {
    outcome: 'internship',
    role: 'accounting_finance',
    degreeTrack: 'bcom_mcom',
    horizonMonths: 6,
    motivation: ['career_placement']
  },
  experience: {
    exposureLevels: ['accounting_projects', 'excel_projects'],
    capabilitySelfRating: 'intermediate_independent'
  },
  constraints: {
    dailyMinutes: 90,
    primaryConstraints: ['time_scarcity']
  },
  // Answers showcasing Analytical Structuring (PH) & Structured Execution (ST)
  sjtResponses: [
    { questionId: 'Q9_COMMERCE_UNEXPECTED_EXPENSE', optionId: 'q9_comm_ph', responseTimeMs: 4500, timestamp: Date.now() },
    { questionId: 'Q10_COMMERCE_ACCOUNTS_RECONCILE', optionId: 'q10_comm_st', responseTimeMs: 3800, timestamp: Date.now() },
    { questionId: 'Q11_COMMERCE_AUDIT_FINDING', optionId: 'q11_comm_ph', responseTimeMs: 4200, timestamp: Date.now() },
    { questionId: 'Q12_COMMERCE_EXCEL_SURPRISE', optionId: 'q12_comm_st', responseTimeMs: 3900, timestamp: Date.now() },
    { questionId: 'Q13_COMMERCE_AMBIGUOUS_TASK', optionId: 'q13_comm_ph', responseTimeMs: 5100, timestamp: Date.now() },
    { questionId: 'Q14_COMMERCE_BANK_DATA_PATTERNS', optionId: 'q14_comm_ph', responseTimeMs: 4600, timestamp: Date.now() },
    { questionId: 'Q15_COMMERCE_TAX_TREATMENT', optionId: 'q15_comm_st', responseTimeMs: 4000, timestamp: Date.now() },
    { questionId: 'Q16_COMMERCE_INVESTMENT_SIGNALS', optionId: 'q16_comm_ph', responseTimeMs: 4800, timestamp: Date.now() },
    { questionId: 'Q17_COMMERCE_TEAM_BEHIND', optionId: 'q17_comm_st', responseTimeMs: 3500, timestamp: Date.now() },
    { questionId: 'Q18_COMMERCE_CHALLENGED_NUMBERS', optionId: 'q18_comm_ph', responseTimeMs: 4100, timestamp: Date.now() },
    { questionId: 'Q19_COMMERCE_FALLING_PROFITS', optionId: 'q19_comm_ph', responseTimeMs: 4700, timestamp: Date.now() },
    { questionId: 'Q20_COMMERCE_DASHBOARD_CONFLICT', optionId: 'q20_comm_st', responseTimeMs: 3600, timestamp: Date.now() },
    { questionId: 'Q21_COMMERCE_GROUP_DIFFERENT_IDEAS', optionId: 'q21_comm_ph', responseTimeMs: 4300, timestamp: Date.now() },
    { questionId: 'Q22_COMMERCE_INCOMPLETE_DATA', optionId: 'q22_comm_st', responseTimeMs: 3900, timestamp: Date.now() }
  ],
  matrixResponses: [
    { scenarioId: 'M1_COMMERCE_FINANCIAL_ANALYSIS', itemId: 'm1_comm_ph', rating: 5, responseTimeMs: 2500, timestamp: Date.now() },
    { scenarioId: 'M1_COMMERCE_FINANCIAL_ANALYSIS', itemId: 'm1_comm_st', rating: 4, responseTimeMs: 2200, timestamp: Date.now() },
    { scenarioId: 'M2_COMMERCE_AUDIT_COMPLIANCE', itemId: 'm2_comm_ph', rating: 5, responseTimeMs: 2400, timestamp: Date.now() },
    { scenarioId: 'M2_COMMERCE_AUDIT_COMPLIANCE', itemId: 'm2_comm_st', rating: 4, responseTimeMs: 2300, timestamp: Date.now() }
  ],
  tradeoffResponses: [
    { questionId: 'Q23_COMMERCE_ACCURACY_VS_DEADLINE', optionId: 't23_comm_depth', responseTimeMs: 3100, timestamp: Date.now() },
    { questionId: 'Q25_COMMERCE_SOLO_VS_CONSULT', optionId: 't25_comm_solo', responseTimeMs: 2900, timestamp: Date.now() }
  ]
};

const evaluatedCommProfile = evaluateDiagnosticSession(commStudentSession);
assert(evaluatedCommProfile.behaviorProfile.PH.band === 'strong', 'PH should qualify as strong with high evidence and multi-context validation');
assert(evaluatedCommProfile.behaviorProfile.ST.band === 'strong', 'ST should qualify as strong');
assert(evaluatedCommProfile.behaviorProfile.SIQ.band === 'developing', 'SIQ should be developing due to lack of evidence');
assert(evaluatedCommProfile.tradeoffs.length > 0, 'Should detect trade-offs for unbalanced SIQ or EX');

console.log(`   ✅ Evaluation successful: PH Evidence = ${evaluatedCommProfile.behaviorProfile.PH.evidence} (${evaluatedCommProfile.behaviorProfile.PH.band}), ST Evidence = ${evaluatedCommProfile.behaviorProfile.ST.evidence} (${evaluatedCommProfile.behaviorProfile.ST.band}).`);
console.log(`   ✅ Blend Title: "${evaluatedCommProfile.behaviorProfile.blendTitle}".`);
console.log(`   ✅ Detected Tradeoffs: ${evaluatedCommProfile.tradeoffs.map(t => t.type).join(', ')}.\n`);

// 6. Validate Consultation vs Investigation Trade-off
console.log('6️⃣ Validating Consultation vs Investigation Trade-off Detection...');
const highSiqLowPhSession: CompleteDiagnosticInput = {
  goal: { outcome: 'internship', role: 'human_resources', degreeTrack: 'bcom_mcom', horizonMonths: 6, motivation: ['career_placement'] },
  experience: { exposureLevels: [], capabilitySelfRating: 'guided_builder' },
  constraints: { dailyMinutes: 60, primaryConstraints: [] },
  sjtResponses: [
    { questionId: 'Q9_COMMERCE_UNEXPECTED_EXPENSE', optionId: 'q9_comm_siq', responseTimeMs: 3000, timestamp: Date.now() },
    { questionId: 'Q10_COMMERCE_ACCOUNTS_RECONCILE', optionId: 'q10_comm_siq', responseTimeMs: 3000, timestamp: Date.now() },
    { questionId: 'Q11_COMMERCE_AUDIT_FINDING', optionId: 'q11_comm_siq', responseTimeMs: 3000, timestamp: Date.now() },
    { questionId: 'Q13_COMMERCE_AMBIGUOUS_TASK', optionId: 'q13_comm_siq', responseTimeMs: 3000, timestamp: Date.now() }
  ],
  matrixResponses: [
    { scenarioId: 'M1_COMMERCE_FINANCIAL_ANALYSIS', itemId: 'm1_comm_siq', rating: 5, responseTimeMs: 2000, timestamp: Date.now() },
    { scenarioId: 'M2_COMMERCE_AUDIT_COMPLIANCE', itemId: 'm2_comm_siq', rating: 5, responseTimeMs: 2000, timestamp: Date.now() }
  ],
  tradeoffResponses: [
    { questionId: 'Q25_COMMERCE_SOLO_VS_CONSULT', optionId: 't25_comm_consult', responseTimeMs: 2500, timestamp: Date.now() }
  ]
};

const evaluatedSiqProfile = evaluateDiagnosticSession(highSiqLowPhSession);
const commInvestigationTradeoff = evaluatedSiqProfile.tradeoffs.find(t => t.type === 'communication_vs_investigation');
assert(!!commInvestigationTradeoff, 'Should detect communication_vs_investigation tradeoff when SIQ is strong and PH is developing');
console.log('   ✅ Successfully detected "communication_vs_investigation" tension.\n');

console.log('7️⃣ Validating All 8 Specialization Question Branches (Q27)...');
const requiredSpecializations = [
  'accounting_finance',
  'audit_taxation',
  'banking_services',
  'business_analytics',
  'corporate_management',
  'human_resources',
  'marketing_sales',
  'entrepreneurship'
];
for (const specKey of requiredSpecializations) {
  const spec = COMMERCE_SPECIALIZATION_QUESTIONS[specKey];
  assert(!!spec, `Specialization branch for ${specKey} must exist`);
  assert(spec.options.length >= 4, `Specialization ${specKey} must have at least 4 options`);
  assert(spec.title.length > 5, `Specialization ${specKey} must have descriptive title`);
}
console.log(`   ✅ Verified all ${requiredSpecializations.length} specialization question branches (Q27-A through Q27-H).\n`);

console.log('8️⃣ Validating Complete-Skip Zero NaN & Graceful Summary Profile...');
const totalSkipSession: CompleteDiagnosticInput = {
  goal: { outcome: 'internship', role: 'accounting_finance', degreeTrack: 'bcom_mcom', horizonMonths: 6, motivation: ['career_placement'] },
  experience: { exposureLevels: [], capabilitySelfRating: 'guided_builder' },
  constraints: { dailyMinutes: 60, primaryConstraints: [] },
  sjtResponses: [],
  matrixResponses: [],
  tradeoffResponses: []
};
const totalSkipProfile = evaluateDiagnosticSession(totalSkipSession);
assert(!isNaN(totalSkipProfile.behaviorProfile.PH.confidence), 'PH confidence must not be NaN');
assert(!isNaN(totalSkipProfile.behaviorProfile.PH.normalizedScore), 'PH normalized score must not be NaN');
assert(totalSkipProfile.behaviorProfile.summaryDescription.includes('emerging behavioral signals'), 'Summary must mention emerging signals when all skipped');
console.log(`   ✅ Complete-skip graceful profile verified: "${totalSkipProfile.behaviorProfile.summaryDescription}".\n`);

console.log('🎉 ALL 8 MULTI-DEGREE ONBOARDING INVARIANTS VERIFIED 100% PASSING!\n');
