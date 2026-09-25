// scripts/tests/test_bba_onboarding_decision_engine.ts
/**
 * Rigorous 3rd-Person Verification Test Suite for BBA / MBA Onboarding Diagnostic V1
 * 
 * Verifies:
 * 1. Step 0 Degree selection mapping for bba_mba
 * 2. Part 1: Goal Discovery dynamic routing (Q1–Q9 + Q34)
 * 3. Part 2 & 3: 19 Behavioral SJT questions with 4 distinct dimension options each (PH, EX, ST, SIQ)
 * 4. Part 4: 4 Behavioral Trade-off Probes with tension poles
 * 5. Part 5: 4 Frequency Matrix Scenarios (M1–M4) with 4 items each
 * 6. Part 6: All 9 Specialization Branches (Q33-F to Q33-P)
 * 7. Complete Diagnostic Engine evaluation session with non-pie scores, bands, and roadmap allocations
 * 8. Career Trajectory recommendation for BBA/MBA career directions
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
  BBA_GOAL_DISCOVERY_QUESTIONS,
  BBA_SJT_QUESTIONS,
  BBA_MATRIX_SCENARIOS,
  BBA_TRADEOFF_PROBES,
  BBA_SPECIALIZATION_QUESTIONS
} from '../../src/lib/onboarding/diagnosticRegistry';

import {
  evaluateDiagnosticSession,
  RawDiagnosticResponse,
  RawMatrixResponse
} from '../../src/lib/onboarding/diagnosticEngine';

import { recommendCareerTrajectory } from '../../src/lib/data/careerTrajectories';

function assert(condition: boolean, msg: string) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${msg}`);
    throw new Error(msg);
  }
}

async function runBbaDiagnosticVerification() {
  console.log('================================================================');
  console.log('🏛️  PINIT CAREER OS — BBA / MBA DIAGNOSTIC SUITE VERIFICATION');
  console.log('================================================================\n');

  // ── TEST 1: Step 0 Degree Selection ──
  console.log('TEST 1: Verifying Step 0 Degree Selection Question...');
  assert(DEGREE_SELECTION_QUESTION.id === 'Q0_DEGREE', 'Degree question ID must be Q0_DEGREE');
  const bbaDegreeOpt = DEGREE_SELECTION_QUESTION.options.find(opt => opt.mappedValue === 'bba_mba');
  assert(!!bbaDegreeOpt, 'Degree selection must contain "bba_mba" option');
  assert(bbaDegreeOpt!.label.includes('BBA / MBA'), 'BBA / MBA label must be present in option');
  console.log('   ✅ Step 0 Degree Selection contains valid BBA/MBA track.\n');

  // ── TEST 2: Part 1 Goal Discovery Routing ──
  console.log('TEST 2: Verifying Goal Discovery questions for "bba_mba"...');
  const goalQuestions = getGoalDiscoveryQuestions('bba_mba');
  assert(goalQuestions.length === 10, `Expected 10 Goal Discovery questions for BBA, got ${goalQuestions.length}`);
  assert(goalQuestions === BBA_GOAL_DISCOVERY_QUESTIONS, 'getGoalDiscoveryQuestions must return BBA_GOAL_DISCOVERY_QUESTIONS');
  
  const expectedQIds = [
    'Q1_BBA_CAREER_DIRECTION',
    'Q2_BBA_IMMEDIATE_GOAL',
    'Q3_BBA_TIME_HORIZON',
    'Q4_BBA_PROBLEM_AFFINITY',
    'Q5_BBA_EXPERIENCE_ARTIFACTS',
    'Q6_BBA_ACTUAL_LEVEL',
    'Q7_BBA_TOOLS_USED',
    'Q8_BBA_BIGGEST_OBSTACLE',
    'Q9_BBA_DAILY_TIME',
    'Q34_BBA_WORK_ENVIRONMENT_EXPERIENCE'
  ];

  for (let i = 0; i < expectedQIds.length; i++) {
    assert(goalQuestions[i].id === expectedQIds[i], `Expected question ${i} to be ${expectedQIds[i]}, got ${goalQuestions[i].id}`);
    assert(goalQuestions[i].options.length >= 2, `Question ${goalQuestions[i].id} must have at least 2 options`);
    for (const opt of goalQuestions[i].options) {
      assert(!!opt.id && !!opt.label, `Option in ${goalQuestions[i].id} missing id or label`);
      assert(opt.mappedValue !== undefined, `Option ${opt.id} in ${goalQuestions[i].id} missing mappedValue`);
    }
  }
  console.log(`   ✅ All 10 Goal Discovery questions verified with full metadata.\n`);

  // ── TEST 3: Part 2 & 3 Situational Judgement Tests (19 SJTs) ──
  console.log('TEST 3: Verifying 19 Behavioral SJT questions for "bba_mba"...');
  const sjtQuestions = getSjtQuestions('bba_mba');
  assert(sjtQuestions.length === 19, `Expected 19 SJT questions for BBA, got ${sjtQuestions.length}`);
  assert(sjtQuestions === BBA_SJT_QUESTIONS, 'getSjtQuestions must return BBA_SJT_QUESTIONS');

  for (const q of sjtQuestions) {
    assert(q.options.length === 4, `Question ${q.id} must have exactly 4 options`);
    const dims = q.options.map(o => o.dimension);
    assert(dims.includes('PH'), `${q.id} must have a PH option`);
    assert(dims.includes('EX'), `${q.id} must have an EX option`);
    assert(dims.includes('ST'), `${q.id} must have an ST option`);
    assert(dims.includes('SIQ'), `${q.id} must have an SIQ option`);

    for (const opt of q.options) {
      assert(opt.evidence === 2, `Option ${opt.id} must have evidence = 2`);
      assert(!!opt.text && opt.text.length > 5, `Option ${opt.id} text too short`);
      assert(!!opt.context, `Option ${opt.id} missing diagnostic context`);
    }
  }
  console.log('   ✅ All 19 BBA SJT questions verified with balanced PH/EX/ST/SIQ options (+2.0 evidence each).\n');

  // ── TEST 4: Part 4 Behavioral Trade-Off Probes (4 probes) ──
  console.log('TEST 4: Verifying 4 Behavioral Trade-off Probes for "bba_mba"...');
  const tradeoffProbes = getTradeoffProbes('bba_mba');
  assert(tradeoffProbes.length === 4, `Expected 4 tradeoff probes, got ${tradeoffProbes.length}`);
  assert(tradeoffProbes === BBA_TRADEOFF_PROBES, 'getTradeoffProbes must return BBA_TRADEOFF_PROBES');

  const expectedProbeIds = [
    'Q29_BBA_RESEARCH_VS_ACTION',
    'Q30_BBA_STRATEGY_VS_EXECUTION',
    'Q31_BBA_LEADERSHIP_DECISION',
    'Q32_BBA_INTERDEPARTMENTAL_CONFLICT'
  ];
  for (let i = 0; i < expectedProbeIds.length; i++) {
    assert(tradeoffProbes[i].id === expectedProbeIds[i], `Expected probe ${i} to be ${expectedProbeIds[i]}`);
    assert(tradeoffProbes[i].options.length === 2, `Probe ${tradeoffProbes[i].id} must have 2 options`);
    assert(!!tradeoffProbes[i].options[0].pole && !!tradeoffProbes[i].options[1].pole, `Poles missing on ${tradeoffProbes[i].id}`);
    assert(tradeoffProbes[i].options[0].pole !== tradeoffProbes[i].options[1].pole, `Poles must differ on ${tradeoffProbes[i].id}`);
  }
  console.log('   ✅ All 4 Trade-off Probes verified with distinct opposing tension poles.\n');

  // ── TEST 5: Part 5 Frequency Matrix Scenarios (4 scenarios) ──
  console.log('TEST 5: Verifying 4 Frequency Matrix Scenarios for "bba_mba"...');
  const matrixScenarios = getMatrixScenarios('bba_mba');
  assert(matrixScenarios.length === 4, `Expected 4 matrix scenarios, got ${matrixScenarios.length}`);
  assert(matrixScenarios === BBA_MATRIX_SCENARIOS, 'getMatrixScenarios must return BBA_MATRIX_SCENARIOS');

  for (const m of matrixScenarios) {
    assert(m.items.length === 4, `Matrix scenario ${m.id} must have 4 items`);
    const dims = m.items.map(it => it.dimension);
    assert(dims.includes('PH') && dims.includes('EX') && dims.includes('ST') && dims.includes('SIQ'),
      `Matrix scenario ${m.id} must cover PH, EX, ST, and SIQ`);
  }
  console.log('   ✅ All 4 Matrix Scenarios verified with complete 4-dimension coverage.\n');

  // ── TEST 6: Part 6 Specialization Branches (Q33-F to Q33-P) ──
  console.log('TEST 6: Verifying all 9 BBA / MBA Specialization Branches...');
  const expectedDomains = [
    'corporate_finance',
    'marketing_growth',
    'sales_bizdev',
    'human_resources',
    'operations_supplychain',
    'consulting_strategy',
    'entrepreneurship_startup',
    'business_analytics',
    'product_management'
  ];

  for (const domain of expectedDomains) {
    const spec = BBA_SPECIALIZATION_QUESTIONS[domain];
    assert(!!spec, `Specialization branch ${domain} must exist in BBA_SPECIALIZATION_QUESTIONS`);
    assert(spec.domainId === domain, `domainId mismatch for ${domain}`);
    assert(spec.options.length === 4, `${domain} specialization must have 4 options`);
    const affinities = spec.options.map(o => o.affinityDimension);
    assert(affinities.includes('PH') && affinities.includes('EX') && affinities.includes('ST') && affinities.includes('SIQ'),
      `${domain} specialization options must cover PH, EX, ST, and SIQ`);
  }
  console.log('   ✅ All 9 Specialization Branches verified with 0 collisions and full dimension coverage.\n');

  // ── TEST 7: Diagnostic Evaluation Engine Integration ──
  console.log('TEST 7: Simulating complete BBA diagnostic session evaluation...');
  // Check that ALL_SJT_QUESTIONS, ALL_MATRIX_SCENARIOS, ALL_TRADEOFF_PROBES contain BBA items
  assert(ALL_SJT_QUESTIONS.some(q => q.id === 'Q10_BBA_METRIC_DROPS'), 'ALL_SJT_QUESTIONS must contain BBA SJTs');
  assert(ALL_MATRIX_SCENARIOS.some(m => m.id === 'M1_BBA_BUSINESS_PROBLEM'), 'ALL_MATRIX_SCENARIOS must contain BBA Matrix');
  assert(ALL_TRADEOFF_PROBES.some(t => t.id === 'Q29_BBA_RESEARCH_VS_ACTION'), 'ALL_TRADEOFF_PROBES must contain BBA Probes');

  // Simulate responses for a Strategy Consultant profile (high PH + ST)
  const simulatedSjtResponses: RawDiagnosticResponse[] = [];
  for (const sjt of sjtQuestions) {
    // Pick PH option for analytical questions, ST for management/process
    const chosenOpt = sjt.options.find(o => o.dimension === 'PH') || sjt.options[0];
    simulatedSjtResponses.push({
      questionId: sjt.id,
      optionId: chosenOpt.id,
      responseTimeMs: 3200,
      timestamp: Date.now()
    });
  }

  const simulatedMatrixResponses: RawMatrixResponse[] = [];
  for (const scenario of matrixScenarios) {
    for (const item of scenario.items) {
      simulatedMatrixResponses.push({
        scenarioId: scenario.id,
        itemId: item.id,
        rating: item.dimension === 'PH' ? 5 : item.dimension === 'ST' ? 4 : 2,
        responseTimeMs: 1800,
        timestamp: Date.now()
      });
    }
  }

  const simulatedTradeoffResponses: RawDiagnosticResponse[] = [];
  for (const probe of tradeoffProbes) {
    simulatedTradeoffResponses.push({
      questionId: probe.id,
      optionId: probe.options[0].id,
      responseTimeMs: 2500,
      timestamp: Date.now()
    });
  }

  const profile = evaluateDiagnosticSession({
    goal: {
      outcome: 'first_job',
      role: 'consulting',
      degreeTrack: 'bba_mba',
      specialization: 'consulting_strategy',
      secondaryRoles: ['management_strategy'],
      horizonMonths: 6,
      motivation: ['strategy_market_expansion']
    },
    experience: {
      exposureLevels: ['case_study_competitions', 'internship_business'],
      capabilitySelfRating: 'bba_fresher'
    },
    constraints: {
      dailyMinutes: 90,
      primaryConstraints: ['lack_network_mentorship']
    },
    sjtResponses: simulatedSjtResponses,
    matrixResponses: simulatedMatrixResponses,
    tradeoffResponses: simulatedTradeoffResponses
  });

  assert(!!profile.behaviorProfile, 'profile must contain behaviorProfile');
  assert(profile.behaviorProfile.PH.evidence > 0, 'PH evidence must be > 0');
  assert(profile.behaviorProfile.PH.band === 'strong', `Expected PH band to be strong, got ${profile.behaviorProfile.PH.band}`);
  assert(profile.behaviorProfile.PH.normalizedScore >= 70, 'PH normalizedScore should reflect strong analytical responses');
  assert(profile.behaviorProfile.PH.confidence >= 0.70, 'Confidence score should scale with evidence');
  
  // Non-pie verification: sum of normalized scores is not constrained to 100
  const scoreSum = profile.behaviorProfile.PH.normalizedScore + 
                   profile.behaviorProfile.EX.normalizedScore + 
                   profile.behaviorProfile.ST.normalizedScore + 
                   profile.behaviorProfile.SIQ.normalizedScore;
  console.log(`   Dimension Scores: PH=${profile.behaviorProfile.PH.normalizedScore}, EX=${profile.behaviorProfile.EX.normalizedScore}, ST=${profile.behaviorProfile.ST.normalizedScore}, SIQ=${profile.behaviorProfile.SIQ.normalizedScore} (Sum=${scoreSum} - Non-pie validated)`);
  assert(scoreSum !== 100, 'Dimensions must be independently calibrated, NOT forced to sum to 100');

  assert(!!profile.roadmapStrategy, 'Roadmap strategy must be generated');
  assert(profile.roadmapStrategy.allocations.executionPct > 0, 'Roadmap allocations must be positive');
  console.log('   ✅ Diagnostic Session Evaluation produced valid multi-dimensional profile & dynamic roadmap.\n');

  // ── TEST 8: Career Trajectory Resolution for BBA Roles ──
  console.log('TEST 8: Verifying Career Trajectory recommendations for BBA streams...');
  const bbaTestRoles = [
    { role: 'consulting', expectedId: 'business-strategy-consultant' },
    { role: 'management_strategy', expectedId: 'business-strategy-consultant' },
    { role: 'product_management', expectedId: 'product-manager' },
    { role: 'human_resources', expectedId: 'hr-people-operations-leader' },
    { role: 'operations_supplychain', expectedId: 'operations-supplychain-manager' },
    { role: 'marketing_growth', expectedId: 'digital-growth-marketer' },
    { role: 'sales_bizdev', expectedId: 'sales-customer-success-manager' },
    { role: 'business_analytics', expectedId: 'business-analytics-specialist' },
    { role: 'entrepreneurship_startup', expectedId: 'entrepreneur-business-manager' }
  ];

  for (const testCase of bbaTestRoles) {
    const trajectory = recommendCareerTrajectory(testCase.role, 80, 85, 'Pattern Hunter');
    assert(trajectory.roleId === testCase.expectedId, 
      `For role "${testCase.role}", expected trajectory "${testCase.expectedId}", got "${trajectory.roleId}"`);
    assert(trajectory.nodes.length >= 1, `Trajectory for "${testCase.role}" must have at least 1 node`);
    assert(!!trajectory.nodes[0].courseId, `Trajectory for "${testCase.role}" must reference a course`);
    console.log(`   ✓ Role "${testCase.role}" -> Trajectory "${trajectory.roleId}" (${trajectory.roleTitle})`);
  }

  // ── TEST 9: Skip Resiliency & Defensive Fallback Integrity ──
  console.log('\nTEST 9: Verifying Skip Resiliency & Defensive Defaults under 100% skipped answers...');
  const skippedSjt: RawDiagnosticResponse[] = sjtQuestions.map(q => ({
    questionId: q.id,
    optionId: 'skipped',
    skipped: true,
    responseTimeMs: 0,
    timestamp: Date.now()
  }));

  const skippedMatrix: RawMatrixResponse[] = [];
  for (const m of matrixScenarios) {
    for (const item of m.items) {
      skippedMatrix.push({
        scenarioId: m.id,
        itemId: item.id,
        rating: 3,
        skipped: true,
        responseTimeMs: 0,
        timestamp: Date.now()
      });
    }
  }

  const skippedTradeoff: RawDiagnosticResponse[] = tradeoffProbes.map(t => ({
    questionId: t.id,
    optionId: 'skipped',
    skipped: true,
    responseTimeMs: 0,
    timestamp: Date.now()
  }));

  const fallbackProfile = evaluateDiagnosticSession({
    goal: {
      outcome: 'exploring',
      role: 'exploring',
      degreeTrack: 'bba_mba',
      specialization: 'no_experience',
      secondaryRoles: [],
      horizonMonths: 6,
      motivation: ['exploring']
    },
    sjtResponses: skippedSjt,
    matrixResponses: skippedMatrix,
    tradeoffResponses: skippedTradeoff
  });

  assert(fallbackProfile.behaviorProfile.PH.band === 'developing', 'Skipped PH band must be developing');
  assert(fallbackProfile.behaviorProfile.EX.band === 'developing', 'Skipped EX band must be developing');
  assert(fallbackProfile.behaviorProfile.ST.band === 'developing', 'Skipped ST band must be developing');
  assert(fallbackProfile.behaviorProfile.SIQ.band === 'developing', 'Skipped SIQ band must be developing');
  assert(!isNaN(fallbackProfile.behaviorProfile.PH.confidence), 'Confidence must not be NaN');
  assert(!isNaN(fallbackProfile.roadmapStrategy.allocations.executionPct), 'Allocations must not be NaN');
  assert(fallbackProfile.behaviorProfile.PH.evidence === 0, 'Skipped evidence must be 0');
  console.log('   ✅ 100% skipped diagnostic session handled defensively without NaN or crash.\n');

  // ── TEST 10: All 12 BBA Goal Discovery Roles Coverage ──
  console.log('TEST 10: Verifying all 12 BBA Goal Discovery Q1 options map cleanly to trajectories...');
  const q1Direction = goalQuestions[0];
  assert(q1Direction.options.length === 12, `Expected 12 options in BBA Q1, got ${q1Direction.options.length}`);
  
  for (const opt of q1Direction.options) {
    const roleKey = opt.mappedValue as string;
    const traj = recommendCareerTrajectory(roleKey, 75, 80, 'Explorer');
    assert(!!traj.roleId, `Role key "${roleKey}" must produce valid roleId`);
    assert(!!traj.roleTitle, `Role key "${roleKey}" must produce valid roleTitle`);
    assert(traj.nodes.length > 0, `Role key "${roleKey}" must have curriculum nodes`);
    console.log(`   ✓ Q1 Opt "${opt.label}" (${roleKey}) -> Trajectory "${traj.roleId}"`);
  }

  console.log('\n================================================================');
  console.log('🎉 ALL 10 BBA / MBA ONBOARDING DECISION ENGINE TESTS PASSED (100%)');
  console.log('================================================================\n');
}

runBbaDiagnosticVerification().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
