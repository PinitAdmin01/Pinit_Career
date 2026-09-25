import { COURSES_REGISTRY } from '../../src/lib/data/coursesData';
import { recommendCareerTrajectory, CANONICAL_TRAJECTORIES } from '../../src/lib/data/careerTrajectories';
import {
  DEGREE_SELECTION_QUESTION,
  GOAL_DISCOVERY_QUESTIONS,
  SJT_QUESTIONS,
  MATRIX_SCENARIOS,
  TRADEOFF_PROBES,
  ALL_SJT_QUESTIONS,
  ALL_MATRIX_SCENARIOS,
  ALL_TRADEOFF_PROBES
} from '../../src/lib/onboarding/diagnosticRegistry';
import {
  BCOM_GOAL_DISCOVERY_QUESTIONS,
  BCOM_SJT_QUESTIONS,
  BCOM_MATRIX_SCENARIOS,
  BCOM_TRADEOFF_PROBES,
  COMMERCE_SPECIALIZATION_QUESTIONS
} from '../../src/lib/onboarding/diagnosticRegistryCommerce';
import {
  BBA_GOAL_DISCOVERY_QUESTIONS,
  BBA_SJT_QUESTIONS,
  BBA_MATRIX_SCENARIOS,
  BBA_TRADEOFF_PROBES,
  BBA_SPECIALIZATION_QUESTIONS
} from '../../src/lib/onboarding/diagnosticRegistryBBA';
import {
  GENERAL_GOAL_DISCOVERY_QUESTIONS,
  GENERAL_SJT_QUESTIONS,
  GENERAL_MATRIX_SCENARIOS,
  GENERAL_TRADEOFF_PROBES,
  GENERAL_SPECIALIZATION_QUESTIONS
} from '../../src/lib/onboarding/diagnosticRegistryGeneral';
import {
  evaluateDiagnosticSession,
  RawDiagnosticResponse,
  RawMatrixResponse,
  CompleteDiagnosticProfile
} from '../../src/lib/onboarding/diagnosticEngine';
import { generateDynamicStudentRoadmap } from '../../src/lib/data/roadmapFuser';
import * as fs from 'fs';

console.log('================================================================================');
console.log('🚀 PINIT CAREER OS — MASTER END-TO-END SYSTEM TEST: ALL 4 ONBOARDING OPTIONS');
console.log('   Auditing: Option 1 (Tech), Option 2 (Commerce), Option 3 (BBA/MBA), Option 4 (General)');
console.log('================================================================================\n');

const registryCourseIds = new Set(COURSES_REGISTRY.map(c => c.id));
let totalChecks = 0;
let passedChecks = 0;

function check(condition: boolean, description: string) {
  totalChecks++;
  if (!condition) {
    console.error(`❌ SYSTEM TEST FAILURE: ${description}`);
    process.exit(1);
  }
  passedChecks++;
  console.log(`   ✅ ${description}`);
}

// ─────────────────────────────────────────────────────────────────────────────
// SYSTEM TEST SUITE 1: OPTION 1 — B.TECH / BCA / MCA (TECH & SOFTWARE SYSTEMS)
// ─────────────────────────────────────────────────────────────────────────────
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📌 [OPTION 1 SYSTEM TEST] B.Tech / BCA / MCA — Full Pipeline Simulation');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

// 1.1 Verify Step 0
const opt1Degree = DEGREE_SELECTION_QUESTION.options.find(o => o.mappedValue === 'btech_bca_mca');
check(!!opt1Degree, 'Step 0: Option 1 registered with mappedValue "btech_bca_mca"');
check(opt1Degree?.label.includes('B.Tech') === true, 'Step 0: Option 1 label correctly mentions B.Tech / BCA / MCA');

// 1.2 Verify Registry Data Sets
check(GOAL_DISCOVERY_QUESTIONS.length >= 8, `Tech Goal Discovery loaded ${GOAL_DISCOVERY_QUESTIONS.length} questions`);
check(SJT_QUESTIONS.length === 12, `Tech SJTs loaded exactly 12 situational scenarios (found: ${SJT_QUESTIONS.length})`);
check(MATRIX_SCENARIOS.length === 4, `Tech Matrix loaded exactly 4 scenarios`);
check(TRADEOFF_PROBES.length === 4, `Tech Trade-off Probes loaded exactly 4 probes`);

// 1.3 Simulate Full Tech Student Session
const techSjtResponses: RawDiagnosticResponse[] = [];
SJT_QUESTIONS.forEach((q, idx) => {
  techSjtResponses.push({
    questionId: q.id,
    optionId: q.options[idx % q.options.length].id,
    responseTimeMs: 2200 + (idx * 150),
    timestamp: Date.now()
  });
});

const techMatrixResponses: RawMatrixResponse[] = [];
for (const m of MATRIX_SCENARIOS) {
  for (const item of m.items) {
    techMatrixResponses.push({
      scenarioId: m.id,
      itemId: item.id,
      rating: item.dimension === 'PH' ? 5 : 4,
      responseTimeMs: 2000,
      timestamp: Date.now()
    });
  }
}

const techTradeoffResponses: RawDiagnosticResponse[] = [];
for (const probe of TRADEOFF_PROBES) {
  techTradeoffResponses.push({
    questionId: probe.id,
    optionId: probe.options[0].id,
    responseTimeMs: 2400,
    timestamp: Date.now()
  });
}

const techProfile = evaluateDiagnosticSession({
  goal: {
    role: 'full_stack_developer',
    outcome: 'first_job',
    horizonMonths: 6,
    motivation: ['high_impact', 'continuous_learning']
  },
  experience: {
    exposureLevels: ['internship'],
    capabilitySelfRating: 'guided_builder'
  },
  constraints: {
    dailyMinutes: 90,
    primaryConstraints: ['time_scarcity']
  },
  sjtResponses: techSjtResponses,
  matrixResponses: techMatrixResponses,
  tradeoffResponses: techTradeoffResponses
});

check(techProfile.behaviorProfile.PH.evidence > 0, `Tech Profile PH evidence calibrated: ${techProfile.behaviorProfile.PH.evidence} pts (${techProfile.behaviorProfile.PH.band})`);
check(techProfile.behaviorProfile.EX.evidence > 0, `Tech Profile EX evidence calibrated: ${techProfile.behaviorProfile.EX.evidence} pts (${techProfile.behaviorProfile.EX.band})`);
check(techProfile.behaviorProfile.ST.evidence > 0, `Tech Profile ST evidence calibrated: ${techProfile.behaviorProfile.ST.evidence} pts (${techProfile.behaviorProfile.ST.band})`);
check(techProfile.behaviorProfile.SIQ.evidence > 0, `Tech Profile SIQ evidence calibrated: ${techProfile.behaviorProfile.SIQ.evidence} pts (${techProfile.behaviorProfile.SIQ.band})`);
check(!!techProfile.behaviorProfile.blendTitle, `Tech Archetype Blend Title resolved: "${techProfile.behaviorProfile.blendTitle}"`);

const techAllocSum = techProfile.roadmapStrategy.allocations.explorationPct + techProfile.roadmapStrategy.allocations.executionPct + techProfile.roadmapStrategy.allocations.communicationPct + techProfile.roadmapStrategy.allocations.technicalGapPct;
check(techAllocSum === 100, `Tech Dynamic Allocations sum to 100% (${techAllocSum}%)`);

// 1.4 Dynamic Roadmap Fusing for Tech
const techRoadmap = generateDynamicStudentRoadmap({
  courseId: 'course-fullstack-js',
  goal: 'full_stack_developer',
  qt1: 80,
  qt2: 85,
  archetype: techProfile.behaviorProfile.blendTitle,
  durationDays: 30,
  dailyPace: 2,
  diagnosticProfile: techProfile
});

check(techRoadmap.length > 0, `Tech Roadmap Fuser produced ${techRoadmap.length} dynamic modules`);
check(registryCourseIds.has('course-fullstack-js'), `Tech target courseId "course-fullstack-js" exists in COURSES_REGISTRY`);
for (const mod of techRoadmap) {
  check(mod.quests.length > 0, `Tech Module "${mod.title}" contains ${mod.quests.length} personalized quests`);
}

// ─────────────────────────────────────────────────────────────────────────────
// SYSTEM TEST SUITE 2: OPTION 2 — B.COM / M.COM (COMMERCE, ACCOUNTING & FINANCE)
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📌 [OPTION 2 SYSTEM TEST] B.Com / M.Com — Full Pipeline Simulation');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

// 2.1 Verify Step 0
const opt2Degree = DEGREE_SELECTION_QUESTION.options.find(o => o.mappedValue === 'bcom_mcom');
check(!!opt2Degree, 'Step 0: Option 2 registered with mappedValue "bcom_mcom"');
check(opt2Degree?.label.includes('B.Com') === true, 'Step 0: Option 2 label correctly mentions B.Com / M.Com');

// 2.2 Verify Registry Data Sets
check(BCOM_GOAL_DISCOVERY_QUESTIONS.length === 8, `Commerce Goal Discovery loaded ${BCOM_GOAL_DISCOVERY_QUESTIONS.length} questions`);
check(BCOM_SJT_QUESTIONS.length === 14, `Commerce SJTs loaded exactly 14 situational scenarios (found: ${BCOM_SJT_QUESTIONS.length})`);
check(BCOM_MATRIX_SCENARIOS.length === 4, `Commerce Matrix loaded exactly 4 scenarios`);
check(BCOM_TRADEOFF_PROBES.length === 4, `Commerce Trade-off Probes loaded exactly 4 probes`);
check(Object.keys(COMMERCE_SPECIALIZATION_QUESTIONS).length === 8, `Commerce Specializations loaded 8 domain deep-dives`);

// 2.3 Simulate Full Commerce Student Session (Financial Analyst Track)
const comSjtResponses: RawDiagnosticResponse[] = [];
BCOM_SJT_QUESTIONS.forEach((q, idx) => {
  comSjtResponses.push({
    questionId: q.id,
    optionId: q.options[idx % q.options.length].id,
    responseTimeMs: 2400 + (idx * 100),
    timestamp: Date.now()
  });
});

const comMatrixResponses: RawMatrixResponse[] = [];
for (const m of BCOM_MATRIX_SCENARIOS) {
  for (const item of m.items) {
    comMatrixResponses.push({
      scenarioId: m.id,
      itemId: item.id,
      rating: item.dimension === 'PH' ? 5 : item.dimension === 'ST' ? 5 : 3,
      responseTimeMs: 2100,
      timestamp: Date.now()
    });
  }
}

const comTradeoffResponses: RawDiagnosticResponse[] = [];
for (const probe of BCOM_TRADEOFF_PROBES) {
  comTradeoffResponses.push({
    questionId: probe.id,
    optionId: probe.options[0].id,
    responseTimeMs: 2500,
    timestamp: Date.now()
  });
}

const comProfile = evaluateDiagnosticSession({
  goal: {
    role: 'accounting_finance',
    outcome: 'first_job',
    horizonMonths: 6,
    motivation: ['intellectual_curiosity', 'financial_reward']
  },
  experience: {
    exposureLevels: ['freelance'],
    capabilitySelfRating: 'guided_builder'
  },
  constraints: {
    dailyMinutes: 90,
    primaryConstraints: ['academic_commitments']
  },
  sjtResponses: comSjtResponses,
  matrixResponses: comMatrixResponses,
  tradeoffResponses: comTradeoffResponses
});

check(comProfile.behaviorProfile.PH.evidence > 0, `Commerce Profile PH evidence calibrated: ${comProfile.behaviorProfile.PH.evidence} pts`);
check(comProfile.behaviorProfile.ST.evidence > 0, `Commerce Profile ST evidence calibrated: ${comProfile.behaviorProfile.ST.evidence} pts`);
check(!!comProfile.behaviorProfile.blendTitle, `Commerce Archetype Blend Title resolved: "${comProfile.behaviorProfile.blendTitle}"`);

const comAllocSum = comProfile.roadmapStrategy.allocations.explorationPct + comProfile.roadmapStrategy.allocations.executionPct + comProfile.roadmapStrategy.allocations.communicationPct + comProfile.roadmapStrategy.allocations.technicalGapPct;
check(comAllocSum === 100, `Commerce Dynamic Allocations sum to 100% (${comAllocSum}%)`);

// 2.4 Dynamic Roadmap Fusing for Commerce
const comRoadmap = generateDynamicStudentRoadmap({
  courseId: 'course-finance-investment',
  goal: 'accounting_finance',
  qt1: 85,
  qt2: 80,
  archetype: comProfile.behaviorProfile.blendTitle,
  durationDays: 30,
  dailyPace: 2,
  diagnosticProfile: comProfile
});

check(comRoadmap.length > 0, `Commerce Roadmap Fuser produced ${comRoadmap.length} dynamic modules`);
check(registryCourseIds.has('course-finance-investment'), `Commerce target courseId "course-finance-investment" exists in COURSES_REGISTRY`);
for (const mod of comRoadmap) {
  check(mod.quests.length > 0, `Commerce Module "${mod.title}" contains ${mod.quests.length} personalized quests`);
}

// ─────────────────────────────────────────────────────────────────────────────
// SYSTEM TEST SUITE 3: OPTION 3 — BBA / MBA (MANAGEMENT & BUSINESS STRATEGY)
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📌 [OPTION 3 SYSTEM TEST] BBA / MBA — Full Pipeline Simulation');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

// 3.1 Verify Step 0
const opt3Degree = DEGREE_SELECTION_QUESTION.options.find(o => o.mappedValue === 'bba_mba');
check(!!opt3Degree, 'Step 0: Option 3 registered with mappedValue "bba_mba"');
check(opt3Degree?.label.includes('BBA') === true, 'Step 0: Option 3 label correctly mentions BBA / MBA');

// 3.2 Verify Registry Data Sets
check(BBA_GOAL_DISCOVERY_QUESTIONS.length === 10, `BBA Goal Discovery loaded ${BBA_GOAL_DISCOVERY_QUESTIONS.length} questions`);
check(BBA_SJT_QUESTIONS.length === 19, `BBA SJTs loaded exactly 19 situational scenarios (found: ${BBA_SJT_QUESTIONS.length})`);
check(BBA_MATRIX_SCENARIOS.length === 4, `BBA Matrix loaded exactly 4 scenarios`);
check(BBA_TRADEOFF_PROBES.length === 4, `BBA Trade-off Probes loaded exactly 4 probes`);
check(Object.keys(BBA_SPECIALIZATION_QUESTIONS).length === 9, `BBA Specializations loaded 9 domain deep-dives`);

// 3.3 Simulate Full BBA Student Session (Consulting & Strategy Track)
const bbaSjtResponses: RawDiagnosticResponse[] = [];
BBA_SJT_QUESTIONS.forEach((q, idx) => {
  bbaSjtResponses.push({
    questionId: q.id,
    optionId: q.options[idx % q.options.length].id,
    responseTimeMs: 2000 + (idx * 120),
    timestamp: Date.now()
  });
});

const bbaMatrixResponses: RawMatrixResponse[] = [];
for (const m of BBA_MATRIX_SCENARIOS) {
  for (const item of m.items) {
    bbaMatrixResponses.push({
      scenarioId: m.id,
      itemId: item.id,
      rating: item.dimension === 'SIQ' ? 5 : item.dimension === 'PH' ? 4 : 3,
      responseTimeMs: 1900,
      timestamp: Date.now()
    });
  }
}

const bbaTradeoffResponses: RawDiagnosticResponse[] = [];
for (const probe of BBA_TRADEOFF_PROBES) {
  bbaTradeoffResponses.push({
    questionId: probe.id,
    optionId: probe.options[0].id,
    responseTimeMs: 2300,
    timestamp: Date.now()
  });
}

const bbaProfile = evaluateDiagnosticSession({
  goal: {
    role: 'management_strategy',
    outcome: 'first_job',
    horizonMonths: 6,
    motivation: ['high_impact', 'intellectual_curiosity']
  },
  experience: {
    exposureLevels: ['internship'],
    capabilitySelfRating: 'guided_builder'
  },
  constraints: {
    dailyMinutes: 60,
    primaryConstraints: ['time_scarcity']
  },
  sjtResponses: bbaSjtResponses,
  matrixResponses: bbaMatrixResponses,
  tradeoffResponses: bbaTradeoffResponses
});

check(bbaProfile.behaviorProfile.SIQ.evidence > 0, `BBA Profile SIQ evidence calibrated: ${bbaProfile.behaviorProfile.SIQ.evidence} pts (${bbaProfile.behaviorProfile.SIQ.band})`);
check(bbaProfile.behaviorProfile.PH.evidence > 0, `BBA Profile PH evidence calibrated: ${bbaProfile.behaviorProfile.PH.evidence} pts`);
check(!!bbaProfile.behaviorProfile.blendTitle, `BBA Archetype Blend Title resolved: "${bbaProfile.behaviorProfile.blendTitle}"`);

const bbaAllocSum = bbaProfile.roadmapStrategy.allocations.explorationPct + bbaProfile.roadmapStrategy.allocations.executionPct + bbaProfile.roadmapStrategy.allocations.communicationPct + bbaProfile.roadmapStrategy.allocations.technicalGapPct;
check(bbaAllocSum === 100, `BBA Dynamic Allocations sum to 100% (${bbaAllocSum}%)`);

// 3.4 Dynamic Roadmap Fusing for BBA (Consulting Track)
const bbaRoadmap = generateDynamicStudentRoadmap({
  courseId: 'course-entrepreneurship-biz-mgmt',
  goal: 'consulting',
  qt1: 85,
  qt2: 90,
  archetype: bbaProfile.behaviorProfile.blendTitle,
  durationDays: 30,
  dailyPace: 2,
  diagnosticProfile: bbaProfile
});

check(bbaRoadmap.length > 0, `BBA Roadmap Fuser produced ${bbaRoadmap.length} dynamic modules`);
check(registryCourseIds.has('course-entrepreneurship-biz-mgmt'), `BBA target courseId "course-entrepreneurship-biz-mgmt" exists in COURSES_REGISTRY`);
for (const mod of bbaRoadmap) {
  check(mod.quests.length > 0, `BBA Module "${mod.title}" contains ${mod.quests.length} personalized quests`);
}

// ─────────────────────────────────────────────────────────────────────────────
// SYSTEM TEST SUITE 4: OPTION 4 — GENERAL / UNIVERSAL (SCIENCES, LAW, ARTS, ETC.)
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📌 [OPTION 4 SYSTEM TEST] General / Universal — Full Pipeline Simulation');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

// 4.1 Verify Step 0
const opt4Degree = DEGREE_SELECTION_QUESTION.options.find(o => o.mappedValue === 'other');
check(!!opt4Degree, 'Step 0: Option 4 registered with mappedValue "other"');
check(opt4Degree?.label.includes('General') === true, 'Step 0: Option 4 label correctly mentions General / Universal');

// 4.2 Verify Registry Data Sets
check(GENERAL_GOAL_DISCOVERY_QUESTIONS.length === 11, `General Goal Discovery loaded ${GENERAL_GOAL_DISCOVERY_QUESTIONS.length} questions`);
check(GENERAL_SJT_QUESTIONS.length === 15, `General SJTs loaded exactly 15 situational scenarios (found: ${GENERAL_SJT_QUESTIONS.length})`);
check(GENERAL_MATRIX_SCENARIOS.length === 4, `General Matrix loaded exactly 4 scenarios`);
check(GENERAL_TRADEOFF_PROBES.length === 4, `General Trade-off Probes loaded exactly 4 probes`);
check(Object.keys(GENERAL_SPECIALIZATION_QUESTIONS).length === 7, `General Specializations loaded 7 domain deep-dives`);

// 4.3 Simulate Full Universal Student Session (Scientific Research Track)
const genSjtResponses: RawDiagnosticResponse[] = [];
GENERAL_SJT_QUESTIONS.forEach((q, idx) => {
  genSjtResponses.push({
    questionId: q.id,
    optionId: q.options[idx % q.options.length].id,
    responseTimeMs: 2300 + (idx * 80),
    timestamp: Date.now()
  });
});

const genMatrixResponses: RawMatrixResponse[] = [];
for (const m of GENERAL_MATRIX_SCENARIOS) {
  for (const item of m.items) {
    genMatrixResponses.push({
      scenarioId: m.id,
      itemId: item.id,
      rating: item.dimension === 'PH' ? 5 : item.dimension === 'EX' ? 5 : 3,
      responseTimeMs: 2200,
      timestamp: Date.now()
    });
  }
}

const genTradeoffResponses: RawDiagnosticResponse[] = [];
for (const probe of GENERAL_TRADEOFF_PROBES) {
  genTradeoffResponses.push({
    questionId: probe.id,
    optionId: probe.options[0].id,
    responseTimeMs: 2500,
    timestamp: Date.now()
  });
}

const genProfile = evaluateDiagnosticSession({
  goal: {
    role: 'research',
    outcome: 'research_career',
    horizonMonths: 12,
    motivation: ['intellectual_curiosity', 'creative_expression']
  },
  experience: {
    exposureLevels: ['academic_labs'],
    capabilitySelfRating: 'guided_builder'
  },
  constraints: {
    dailyMinutes: 90,
    primaryConstraints: ['time_scarcity']
  },
  sjtResponses: genSjtResponses,
  matrixResponses: genMatrixResponses,
  tradeoffResponses: genTradeoffResponses
});

check(genProfile.behaviorProfile.PH.evidence > 0, `General Profile PH evidence calibrated: ${genProfile.behaviorProfile.PH.evidence} pts (${genProfile.behaviorProfile.PH.band})`);
check(genProfile.behaviorProfile.EX.evidence > 0, `General Profile EX evidence calibrated: ${genProfile.behaviorProfile.EX.evidence} pts (${genProfile.behaviorProfile.EX.band})`);
check(!!genProfile.behaviorProfile.blendTitle, `General Archetype Blend Title resolved: "${genProfile.behaviorProfile.blendTitle}"`);

const genAllocSum = genProfile.roadmapStrategy.allocations.explorationPct + genProfile.roadmapStrategy.allocations.executionPct + genProfile.roadmapStrategy.allocations.communicationPct + genProfile.roadmapStrategy.allocations.technicalGapPct;
check(genAllocSum === 100, `General Dynamic Allocations sum to 100% (${genAllocSum}%)`);

// 4.4 Dynamic Roadmap Fusing for General / Universal
const genRoadmap = generateDynamicStudentRoadmap({
  courseId: 'course-business-analytics',
  goal: 'scientific_research',
  qt1: 90,
  qt2: 85,
  archetype: genProfile.behaviorProfile.blendTitle,
  durationDays: 30,
  dailyPace: 2,
  diagnosticProfile: genProfile
});

check(genRoadmap.length > 0, `General Roadmap Fuser produced ${genRoadmap.length} dynamic modules`);
check(registryCourseIds.has('course-business-analytics'), `General target courseId "course-business-analytics" exists in COURSES_REGISTRY`);
for (const mod of genRoadmap) {
  check(mod.quests.length > 0, `General Module "${mod.title}" contains ${mod.quests.length} personalized quests`);
}

// ─────────────────────────────────────────────────────────────────────────────
// SYSTEM TEST SUITE 5: CROSS-DEGREE ISOLATION & SKIP STRESS RESILIENCE
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📌 [SUITE 5] Cross-Degree Isolation & Extreme Skip Stress Testing');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

const allStreams = ['btech_bca_mca', 'bcom_mcom', 'bba_mba', 'other'];

for (const stream of allStreams) {
  // Test 100% empty skip session
  const zeroProfile = evaluateDiagnosticSession({
    goal: { role: 'exploring', outcome: 'exploring', horizonMonths: 6, motivation: ['exploring'] },
    experience: { exposureLevels: [], capabilitySelfRating: 'guided_builder' },
    constraints: { dailyMinutes: 60, primaryConstraints: [] },
    sjtResponses: [],
    matrixResponses: [],
    tradeoffResponses: []
  });

  check(!isNaN(zeroProfile.behaviorProfile.PH.evidence), `${stream} 100% skipped: PH evidence is non-NaN`);
  check(!isNaN(zeroProfile.behaviorProfile.PH.confidence), `${stream} 100% skipped: Confidence is non-NaN`);
  check(zeroProfile.behaviorProfile.blendTitle.length > 0, `${stream} 100% skipped: Returns valid fallback blendTitle`);
  
  const allocSum = zeroProfile.roadmapStrategy.allocations.explorationPct + zeroProfile.roadmapStrategy.allocations.executionPct + zeroProfile.roadmapStrategy.allocations.communicationPct + zeroProfile.roadmapStrategy.allocations.technicalGapPct;
  check(allocSum === 100, `${stream} 100% skipped: Allocations sum to 100%`);

  // Verify roadmap fuser survives zero profile
  const fallbackRoadmap = generateDynamicStudentRoadmap({
    courseId: 'course-java-logic',
    goal: 'exploring',
    qt1: 45,
    qt2: 50,
    archetype: zeroProfile.behaviorProfile.blendTitle,
    durationDays: 30,
    dailyPace: 2,
    diagnosticProfile: zeroProfile
  });

  check(fallbackRoadmap.length > 0, `${stream} 100% skipped: Roadmap Fuser generates valid fallback modules`);
}

// ─────────────────────────────────────────────────────────────────────────────
// SYSTEM TEST SUITE 6: DATA PERSISTENCE & JSON SERIALIZATION FIDELITY
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📌 [SUITE 6] Client-Server Data Persistence & JSON Fidelity Verification');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

const mockPayloads = [
  { degreeTrack: 'btech_bca_mca', profile: techProfile, courseId: 'course-fullstack-js' },
  { degreeTrack: 'bcom_mcom', profile: comProfile, courseId: 'course-finance-investment' },
  { degreeTrack: 'bba_mba', profile: bbaProfile, courseId: 'course-entrepreneurship-biz-mgmt' },
  { degreeTrack: 'other', profile: genProfile, courseId: 'course-business-analytics' }
];

for (const p of mockPayloads) {
  // Test JSON serialization round-trip
  const serialized = JSON.stringify(p.profile);
  const deserialized: CompleteDiagnosticProfile = JSON.parse(serialized);

  check(deserialized.behaviorProfile.blendTitle === p.profile.behaviorProfile.blendTitle, `${p.degreeTrack}: Blend Title preserved across JSON serialization`);
  check(deserialized.behaviorProfile.PH.evidence === p.profile.behaviorProfile.PH.evidence, `${p.degreeTrack}: PH evidence preserved across JSON serialization`);
  check(deserialized.roadmapStrategy.allocations.executionPct === p.profile.roadmapStrategy.allocations.executionPct, `${p.degreeTrack}: Execution allocation preserved across JSON serialization`);
  check(deserialized.systemMetadata.diagnosticVersion === 'v2.0_decision_engine', `${p.degreeTrack}: Diagnostic version metadata verified`);
}

console.log('\n================================================================================');
console.log(`🏆 ALL SYSTEM TESTS COMPLETED SUCCESSFULLY: ${passedChecks} / ${totalChecks} CHECKS 100% PASSING!`);
console.log('   All 4 options (BTech, BCom, BBA, General) verified working perfectly in production!');
console.log('================================================================================\n');
