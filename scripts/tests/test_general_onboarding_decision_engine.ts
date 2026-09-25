// scripts/tests/test_general_onboarding_decision_engine.ts
/**
 * Rigorous 3rd-Person Forensic Verification Test Suite for
 * Option 4: Universal / General Onboarding Diagnostic V1
 * (For students outside BCA/MCA/BTech, B.Com/M.Com, and BBA/MBA)
 * 
 * Verifies:
 * 1. Step 0 Degree Selection mapping for 'other' / general
 * 2. Parts A, B, C: Goal Discovery dynamic routing (Q1–Q11)
 * 3. Part D: 15 Universal SJT questions with 4 balanced dimension options each (PH, EX, ST, SIQ)
 * 4. Part E: 4 Universal Frequency Matrix Scenarios (M1–M4) with 4 items each
 * 5. Part F: 4 Universal Trade-off Probes (Q27–Q30) with opposing poles
 * 6. Part G: All 7 Degree-Neutral Specialization Branches (Q31 across Science, Engineering, Arts, Design, Law, Education, Health)
 * 7. Complete Diagnostic Engine evaluation session with non-pie scores, bands, archetype, and confidence calibration
 * 8. Zero-crash Skip Resilience on 100% skipped diagnostic session
 * 9. Career Trajectory recommendation for General / Universal career directions
 * 10. Coverage of all Q3 Universal Career Considerations mapping cleanly to trajectories
 */

import {
  DEGREE_SELECTION_QUESTION,
  getGoalDiscoveryQuestions,
  getSjtQuestions,
  getMatrixScenarios,
  getTradeoffProbes,
  GENERAL_GOAL_DISCOVERY_QUESTIONS,
  GENERAL_SJT_QUESTIONS,
  GENERAL_MATRIX_SCENARIOS,
  GENERAL_TRADEOFF_PROBES,
  GENERAL_SPECIALIZATION_QUESTIONS
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

async function runGeneralDiagnosticVerification() {
  console.log('================================================================');
  console.log('🌐 PINIT CAREER OS — UNIVERSAL / GENERAL DIAGNOSTIC V1 VERIFICATION');
  console.log('================================================================\n');

  // ── TEST 1: Step 0 Degree Selection ──
  console.log('TEST 1: Verifying Step 0 Degree Selection Question Option 4...');
  assert(DEGREE_SELECTION_QUESTION.id === 'Q0_DEGREE', 'Degree question ID must be Q0_DEGREE');
  const otherDegreeOpt = DEGREE_SELECTION_QUESTION.options.find(opt => opt.mappedValue === 'other');
  assert(!!otherDegreeOpt, 'Degree selection must contain "other" option for general/universal degrees');
  assert(otherDegreeOpt!.label.includes('General') || otherDegreeOpt!.label.includes('Universal'), 'General / Universal label must be present');
  console.log('   ✅ Step 0 Degree Selection contains valid Option 4 (General/Universal).\n');

  // ── TEST 2: Parts A, B, C Goal Discovery Routing ──
  console.log('TEST 2: Verifying Goal Discovery questions for "other"...');
  const goalQuestions = getGoalDiscoveryQuestions('other');
  assert(goalQuestions.length === 11, `Expected 11 Goal Discovery questions for General stream, got ${goalQuestions.length}`);
  assert(goalQuestions === GENERAL_GOAL_DISCOVERY_QUESTIONS, 'getGoalDiscoveryQuestions must return GENERAL_GOAL_DISCOVERY_QUESTIONS');

  const expectedQIds = [
    'Q1_GEN_STUDY_IDENTITY',
    'Q2_GEN_PRIMARY_OBJECTIVE',
    'Q3_GEN_CAREER_CONSIDERATION',
    'Q4_GEN_SUCCESS_OUTCOME',
    'Q5_GEN_MOTIVATION_PROFILE',
    'Q6_GEN_GOAL_CERTAINTY',
    'Q7_GEN_PRACTICAL_ABILITY',
    'Q8_GEN_EXPERIENCE_OUTSIDE',
    'Q9_GEN_TOOLS_METHODS',
    'Q10_GEN_HARDEST_AREAS',
    'Q11_GEN_DAILY_AVAILABILITY'
  ];

  for (let i = 0; i < expectedQIds.length; i++) {
    assert(goalQuestions[i].id === expectedQIds[i], `Expected question ${i} to be ${expectedQIds[i]}, got ${goalQuestions[i].id}`);
    assert(goalQuestions[i].options.length >= 2, `Question ${goalQuestions[i].id} must have at least 2 options`);
    for (const opt of goalQuestions[i].options) {
      assert(!!opt.id && !!opt.label, `Option in ${goalQuestions[i].id} missing id or label`);
      assert(opt.mappedValue !== undefined, `Option ${opt.id} in ${goalQuestions[i].id} missing mappedValue`);
    }
  }
  console.log('   ✅ All 11 Goal Discovery questions verified with full metadata and mappings.\n');

  // ── TEST 3: Part D Universal Situational Judgement Tests (15 SJTs: Q12–Q26) ──
  console.log('TEST 3: Verifying 15 Universal SJT questions for "other"...');
  const sjtQuestions = getSjtQuestions('other');
  assert(sjtQuestions.length === 15, `Expected 15 SJT questions for General, got ${sjtQuestions.length}`);
  assert(sjtQuestions === GENERAL_SJT_QUESTIONS, 'getSjtQuestions must return GENERAL_SJT_QUESTIONS');

  for (const q of sjtQuestions) {
    assert(q.options.length === 4, `Question ${q.id} must have exactly 4 options`);
    const dims = q.options.map(o => o.dimension);
    assert(dims.includes('PH'), `${q.id} must have a PH option`);
    assert(dims.includes('EX'), `${q.id} must have an EX option`);
    assert(dims.includes('ST'), `${q.id} must have an ST option`);
    assert(dims.includes('SIQ'), `${q.id} must have an SIQ option`);

    // Ensure all options have valid evidence weight (+2)
    for (const opt of q.options) {
      assert(opt.evidence === 2, `Option ${opt.id} in ${q.id} must have evidence === 2`);
      assert(!!opt.text && opt.text.length > 5, `Option ${opt.id} in ${q.id} text is too short or empty`);
      assert(!!opt.context, `Option ${opt.id} in ${q.id} missing diagnostic context`);
    }
  }
  console.log('   ✅ All 15 Universal SJT questions strictly balanced across PH, EX, ST, SIQ (+2.0 each).\n');

  // ── TEST 4: Part E Universal Frequency Matrix Scenarios (M1–M4) ──
  console.log('TEST 4: Verifying 4 Universal Frequency Matrix Scenarios...');
  const matrixScenarios = getMatrixScenarios('other');
  assert(matrixScenarios.length === 4, `Expected 4 Matrix scenarios for General, got ${matrixScenarios.length}`);
  assert(matrixScenarios === GENERAL_MATRIX_SCENARIOS, 'getMatrixScenarios must return GENERAL_MATRIX_SCENARIOS');

  const expectedMatrixIds = ['M1_GEN_PROBLEM_SOLVING', 'M2_GEN_LEARNING', 'M3_GEN_PROJECT_WORK', 'M4_GEN_UNCERTAINTY'];
  for (let i = 0; i < expectedMatrixIds.length; i++) {
    assert(matrixScenarios[i].id === expectedMatrixIds[i], `Expected scenario ${i} to be ${expectedMatrixIds[i]}`);
    assert(matrixScenarios[i].items.length === 4, `Scenario ${matrixScenarios[i].id} must have exactly 4 items`);
    const itemDims = matrixScenarios[i].items.map(it => it.dimension);
    assert(itemDims.includes('PH'), `${matrixScenarios[i].id} missing PH item`);
    assert(itemDims.includes('EX'), `${matrixScenarios[i].id} missing EX item`);
    assert(itemDims.includes('ST'), `${matrixScenarios[i].id} missing ST item`);
    assert(itemDims.includes('SIQ'), `${matrixScenarios[i].id} missing SIQ item`);
  }
  console.log('   ✅ All 4 Universal Frequency Matrix Scenarios verified with complete 4-dimension items.\n');

  // ── TEST 5: Part F Universal Trade-off Probes (Q27–Q30) ──
  console.log('TEST 5: Verifying 4 Universal Trade-off Probes...');
  const tradeoffProbes = getTradeoffProbes('other');
  assert(tradeoffProbes.length === 4, `Expected 4 Trade-off probes for General, got ${tradeoffProbes.length}`);
  assert(tradeoffProbes === GENERAL_TRADEOFF_PROBES, 'getTradeoffProbes must return GENERAL_TRADEOFF_PROBES');

  const expectedTradeoffs = [
    { id: 'Q27_GEN_UNDERSTANDING_VS_PROGRESS', type: 'depth_vs_speed' },
    { id: 'Q28_GEN_EXPLORATION_VS_COMPLETION', type: 'explore_vs_finish' },
    { id: 'Q29_GEN_INDEPENDENT_VS_CONSULTING', type: 'solo_vs_consult' },
    { id: 'Q30_GEN_PLAN_VS_ADAPTATION', type: 'plan_vs_adapt' }
  ];

  for (let i = 0; i < expectedTradeoffs.length; i++) {
    const probe = tradeoffProbes[i];
    assert(probe.id === expectedTradeoffs[i].id, `Expected probe ${i} to be ${expectedTradeoffs[i].id}`);
    assert(probe.tradeoffType === expectedTradeoffs[i].type, `Probe ${probe.id} incorrect tradeoffType`);
    assert(probe.options.length === 2, `Probe ${probe.id} must have exactly 2 options`);
    assert(probe.options[0].pole !== probe.options[1].pole, `Probe ${probe.id} poles must oppose each other`);
  }
  console.log('   ✅ All 4 Universal Trade-off Probes verified with binary psychological tension.\n');

  // ── TEST 6: Part G Degree-Neutral Specialization Branches (Q31 across 7 domains) ──
  console.log('TEST 6: Verifying 7 Degree Specialization Branches (Q31)...');
  const specKeys = Object.keys(GENERAL_SPECIALIZATION_QUESTIONS);
  assert(specKeys.length === 7, `Expected 7 specialization branches, got ${specKeys.length}`);

  const expectedSpecBranches = [
    'science_research',
    'engineering_technical',
    'arts_humanities',
    'design_creative',
    'law',
    'education',
    'healthcare_life_sciences'
  ];

  for (const branch of expectedSpecBranches) {
    assert(branch in GENERAL_SPECIALIZATION_QUESTIONS, `Specialization branch ${branch} must exist`);
    const q = GENERAL_SPECIALIZATION_QUESTIONS[branch];
    assert(q.questionId.startsWith('Q31_'), `${branch} questionId must start with Q31_, got ${q.questionId}`);
    assert(q.options.length >= 4, `${branch} must have at least 4 options`);
    for (const opt of q.options) {
      assert(!!opt.id && !!opt.label, `Option in ${branch} missing id or label`);
    }
  }
  console.log('   ✅ All 7 Specialization questions verified across Science, Engineering, Arts, Design, Law, Education, and Health.\n');

  // ── TEST 7: Diagnostic Engine Execution Simulation ──
  console.log('TEST 7: Executing full Diagnostic Engine simulation for a Universal/General student...');
  const simulatedSjtResponses: RawDiagnosticResponse[] = [];
  for (const q of sjtQuestions) {
    const chosenOpt = q.options.find(o => o.dimension === 'PH') || q.options[0];
    simulatedSjtResponses.push({
      questionId: q.id,
      optionId: chosenOpt.id,
      responseTimeMs: 3200,
      timestamp: Date.now()
    });
  }

  const simulatedMatrixResponses: RawMatrixResponse[] = [];
  for (const m of matrixScenarios) {
    for (const item of m.items) {
      simulatedMatrixResponses.push({
        scenarioId: m.id,
        itemId: item.id,
        rating: item.dimension === 'PH' ? 5 : 3,
        responseTimeMs: 2100,
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

  const simulatedSpecializationResponse: RawDiagnosticResponse = {
    questionId: 'Q31_SPECIALIZATION',
    optionId: 'gen_sci_research',
    responseTimeMs: 1800,
    timestamp: Date.now()
  };

  const profile = evaluateDiagnosticSession({
    goal: {
      outcome: 'entry_role',
      role: 'spec_gen_science',
      degreeTrack: 'other',
      specialization: 'spec_gen_science',
      secondaryRoles: ['data_analyst'],
      horizonMonths: 6,
      motivation: ['master_field']
    },
    experience: {
      exposureLevels: ['academic_labs', 'personal_projects'],
      capabilitySelfRating: 'guided_builder'
    },
    constraints: {
      dailyMinutes: 90,
      primaryConstraints: ['lack_direction']
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

  // ── TEST 8: Zero-Crash Skip Resilience ──
  console.log('TEST 8: Testing skip resilience across all phases (100% skipped answers)...');
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
      degreeTrack: 'other',
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

  // ── TEST 9: Career Trajectory Resolution for General Streams ──
  console.log('TEST 9: Verifying Career Trajectory recommendations for General streams...');
  const generalTestRoles = [
    'scientific_research',
    'engineering_technology',
    'design_media_arts',
    'business_management',
    'public_policy_law',
    'education_academic',
    'healthcare_life_sciences'
  ];

  for (const roleKey of generalTestRoles) {
    const trajectory = recommendCareerTrajectory(roleKey, 80, 85, 'Pattern Hunter');
    assert(!!trajectory.roleId, `For role "${roleKey}", expected trajectory roleId`);
    assert(trajectory.nodes.length >= 1, `Trajectory for "${roleKey}" must have at least 1 node`);
    assert(!!trajectory.nodes[0].courseId, `Trajectory for "${roleKey}" must reference a course`);
    console.log(`   ✓ Role "${roleKey}" -> Trajectory "${trajectory.roleId}" (${trajectory.roleTitle})`);
  }

  // ── TEST 10: All 12 Q3 Universal Career Considerations Coverage ──
  console.log('\nTEST 10: Verifying all 12 Universal Career Considerations in Q3 map cleanly to trajectories...');
  const q3Consideration = goalQuestions.find(q => q.id === 'Q3_GEN_CAREER_CONSIDERATION');
  assert(!!q3Consideration, 'Q3_GEN_CAREER_CONSIDERATION must exist');
  assert(q3Consideration!.options.length === 21, `Expected 21 options in Q3, got ${q3Consideration!.options.length}`);

  for (const opt of q3Consideration!.options) {
    const roleKey = opt.mappedValue as string;
    const traj = recommendCareerTrajectory(roleKey, 75, 80, 'Explorer');
    assert(!!traj.roleId, `Role key "${roleKey}" must produce valid roleId`);
    assert(!!traj.roleTitle, `Role key "${roleKey}" must produce valid roleTitle`);
    assert(traj.nodes.length > 0, `Role key "${roleKey}" must have curriculum nodes`);
    console.log(`   ✓ Q3 Opt "${opt.label}" (${roleKey}) -> Trajectory "${traj.roleId}"`);
  }

  console.log('\n================================================================');
  console.log('🎉 ALL 10 UNIVERSAL / GENERAL ONBOARDING DIAGNOSTIC TESTS PASSED (100%)');
  console.log('================================================================\n');
}

runGeneralDiagnosticVerification().catch(err => {
  console.error('\n❌ VERIFICATION FAILED:', err);
  process.exit(1);
});
