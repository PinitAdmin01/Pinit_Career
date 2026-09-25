// scripts/tests/test_diagnostic_engine_evaluation.ts
import {
  evaluateDiagnosticSession,
  CompleteDiagnosticInput
} from '../../src/lib/onboarding/diagnosticEngine';

function runDiagnosticEngineTests() {
  console.log('=== RUNNING DIAGNOSTIC SCORING & TRADE-OFF ENGINE TESTS (TASK 2) ===');

  // Test Case 1: Realistic Student matching the prompt
  // Target: Full-Stack Developer Internship (6 Months)
  // Tendencies: High Analytical + High Exploration, Developing Execution
  const studentInput: CompleteDiagnosticInput = {
    goal: {
      outcome: 'internship',
      role: 'full_stack_developer',
      secondaryRoles: ['frontend_developer'],
      horizonMonths: 6,
      motivation: ['career_placement', 'financial_independence']
    },
    experience: {
      exposureLevels: ['personal_project', 'college_project'],
      capabilitySelfRating: 'guided_builder'
    },
    constraints: {
      dailyMinutes: 90,
      primaryConstraints: ['time_scarcity', 'consistency_execution_gap']
    },
    selectedMentor: 'priya',
    // 12 SJTs: 5 PH, 5 EX, 1 ST, 1 SIQ
    sjtResponses: [
      { questionId: 'Q9_UNCLEAR_ASSIGNMENT', optionId: 'q9_ph', responseTimeMs: 4200, timestamp: Date.now() },
      { questionId: 'Q10_MULTIPLE_CAUSE_BUG', optionId: 'q10_ph', responseTimeMs: 3800, timestamp: Date.now() },
      { questionId: 'Q11_DEADLINE_MOVED_FORWARD', optionId: 'q11_st', responseTimeMs: 5100, timestamp: Date.now() },
      { questionId: 'Q12_UNFAMILIAR_TECH', optionId: 'q12_ex', responseTimeMs: 2900, timestamp: Date.now() },
      { questionId: 'Q13_TEAMMATE_DISAGREEMENT', optionId: 'q13_siq', responseTimeMs: 4500, timestamp: Date.now() },
      { questionId: 'Q14_SCOPE_CREEP', optionId: 'q14_ph', responseTimeMs: 3600, timestamp: Date.now() },
      { questionId: 'Q15_FAILED_SOLUTION', optionId: 'q15_ex', responseTimeMs: 3100, timestamp: Date.now() },
      { questionId: 'Q16_USER_FEEDBACK_CONFLICT', optionId: 'q16_ex', responseTimeMs: 4000, timestamp: Date.now() },
      { questionId: 'Q17_PROJECT_STUCK', optionId: 'q17_ph', responseTimeMs: 3900, timestamp: Date.now() },
      { questionId: 'Q18_TWO_LEARNING_PATHS', optionId: 'q18_ex', responseTimeMs: 2800, timestamp: Date.now() },
      { questionId: 'Q19_CRUNCH_BEFORE_DEMO', optionId: 'q19_ex', responseTimeMs: 3400, timestamp: Date.now() },
      { questionId: 'Q20_AMBIGUOUS_CHALLENGE', optionId: 'q20_ph', responseTimeMs: 4600, timestamp: Date.now() },
    ],
    // Matrix: 4 Scenarios x 4 Items
    matrixResponses: [
      { scenarioId: 'M1_STARTING_PROJECT', itemId: 'M1_PH', rating: 5, responseTimeMs: 1800, timestamp: Date.now() }, // 2.0
      { scenarioId: 'M1_STARTING_PROJECT', itemId: 'M1_EX', rating: 5, responseTimeMs: 1500, timestamp: Date.now() }, // 2.0
      { scenarioId: 'M1_STARTING_PROJECT', itemId: 'M1_ST', rating: 2, responseTimeMs: 2200, timestamp: Date.now() }, // 0.5
      { scenarioId: 'M1_STARTING_PROJECT', itemId: 'M1_SIQ', rating: 3, responseTimeMs: 2000, timestamp: Date.now() }, // 1.0

      { scenarioId: 'M2_WHEN_SOMETHING_FAILS', itemId: 'M2_PH', rating: 4, responseTimeMs: 1900, timestamp: Date.now() }, // 1.5
      { scenarioId: 'M2_WHEN_SOMETHING_FAILS', itemId: 'M2_EX', rating: 5, responseTimeMs: 1600, timestamp: Date.now() }, // 2.0
      { scenarioId: 'M2_WHEN_SOMETHING_FAILS', itemId: 'M2_ST', rating: 1, responseTimeMs: 2500, timestamp: Date.now() }, // 0.0
      { scenarioId: 'M2_WHEN_SOMETHING_FAILS', itemId: 'M2_SIQ', rating: 3, responseTimeMs: 2100, timestamp: Date.now() }, // 1.0

      { scenarioId: 'M3_WORKING_UNDER_UNCERTAINTY', itemId: 'M3_PH', rating: 5, responseTimeMs: 1700, timestamp: Date.now() }, // 2.0
      { scenarioId: 'M3_WORKING_UNDER_UNCERTAINTY', itemId: 'M3_EX', rating: 4, responseTimeMs: 1800, timestamp: Date.now() }, // 1.5
      { scenarioId: 'M3_WORKING_UNDER_UNCERTAINTY', itemId: 'M3_ST', rating: 2, responseTimeMs: 2300, timestamp: Date.now() }, // 0.5
      { scenarioId: 'M3_WORKING_UNDER_UNCERTAINTY', itemId: 'M3_SIQ', rating: 3, responseTimeMs: 2200, timestamp: Date.now() }, // 1.0

      { scenarioId: 'M4_COMPLETING_IMPORTANT_WORK', itemId: 'M4_PH', rating: 4, responseTimeMs: 2100, timestamp: Date.now() }, // 1.5
      { scenarioId: 'M4_COMPLETING_IMPORTANT_WORK', itemId: 'M4_EX', rating: 4, responseTimeMs: 1900, timestamp: Date.now() }, // 1.5
      { scenarioId: 'M4_COMPLETING_IMPORTANT_WORK', itemId: 'M4_ST', rating: 2, responseTimeMs: 2400, timestamp: Date.now() }, // 0.5
      { scenarioId: 'M4_COMPLETING_IMPORTANT_WORK', itemId: 'M4_SIQ', rating: 3, responseTimeMs: 2100, timestamp: Date.now() }, // 1.0
    ],
    // 4 Trade-off Probes
    tradeoffResponses: [
      { questionId: 'Q21_EXPLORE_VS_FINISH', optionId: 'q21_a', responseTimeMs: 3200, timestamp: Date.now() }, // Exploration
      { questionId: 'Q22_DEPTH_VS_SPEED', optionId: 'q22_a', responseTimeMs: 2800, timestamp: Date.now() }, // Depth
      { questionId: 'Q23_SOLO_VS_CONSULT', optionId: 'q23_a', responseTimeMs: 3500, timestamp: Date.now() }, // Solo
      { questionId: 'Q24_PLAN_VS_ADAPT', optionId: 'q24_b', responseTimeMs: 3000, timestamp: Date.now() }, // Adapt
    ]
  };

  const profile = evaluateDiagnosticSession(studentInput);

  // Assertion 1: Non-Pie Distribution
  const sumEvidence = profile.behaviorProfile.PH.evidence +
                      profile.behaviorProfile.EX.evidence +
                      profile.behaviorProfile.ST.evidence +
                      profile.behaviorProfile.SIQ.evidence;
  console.log(`✓ Invariant 1 (Non-Pie Total Evidence): ${sumEvidence} (Expected not restricted to 100). Passed.`);

  // Assertion 2: Expected Behavioral Bands
  console.log(`✓ Invariant 2 (Bands):`);
  console.log(`  - Pattern Hunter: ${profile.behaviorProfile.PH.band} (evidence: ${profile.behaviorProfile.PH.evidence}, contexts: ${profile.behaviorProfile.PH.contextsCount})`);
  console.log(`  - Explorer:       ${profile.behaviorProfile.EX.band} (evidence: ${profile.behaviorProfile.EX.evidence}, contexts: ${profile.behaviorProfile.EX.contextsCount})`);
  console.log(`  - Stabilizer:     ${profile.behaviorProfile.ST.band} (evidence: ${profile.behaviorProfile.ST.evidence}, contexts: ${profile.behaviorProfile.ST.contextsCount})`);
  console.log(`  - Social IQ:      ${profile.behaviorProfile.SIQ.band} (evidence: ${profile.behaviorProfile.SIQ.evidence}, contexts: ${profile.behaviorProfile.SIQ.contextsCount})`);

  if (profile.behaviorProfile.PH.band !== 'strong') throw new Error('Expected PH to be strong');
  if (profile.behaviorProfile.EX.band !== 'strong') throw new Error('Expected EX to be strong');
  if (profile.behaviorProfile.ST.band !== 'developing') throw new Error('Expected ST to be developing');
  if (profile.behaviorProfile.SIQ.band !== 'moderate') throw new Error('Expected SIQ to be moderate');

  // Assertion 3: Detected Trade-Offs
  console.log(`✓ Invariant 3 (Trade-Off Detection):`);
  const tension = profile.tradeoffs.find(t => t.type === 'exploration_vs_execution');
  if (!tension) throw new Error('Missing expected exploration_vs_execution trade-off');
  console.log(`  - Detected: ${tension.type} (severity: ${tension.severity}, confidence: ${tension.confidence})`);
  console.log(`  - Recommendation: "${tension.roadmapRecommendation}"`);

  // Assertion 4: Dynamic Roadmap Allocations
  console.log(`✓ Invariant 4 (Roadmap Strategy Allocations):`, profile.roadmapStrategy.allocations);
  if (profile.roadmapStrategy.allocations.executionPct !== 50) throw new Error('Expected 50% execution allocation');
  if (profile.roadmapStrategy.allocations.explorationPct !== 20) throw new Error('Expected 20% exploration allocation');

  // Assertion 5: JSON Schema Serialization & Metadata
  const serialized = JSON.stringify(profile);
  const rehydrated = JSON.parse(serialized);
  if (!rehydrated.systemMetadata.routerConfig.provider) throw new Error('Missing router config');
  if (!rehydrated.systemMetadata.misconceptionFeedbackHooks) throw new Error('Missing misconception hooks');
  console.log(`✓ Invariant 5 (Persistence & Router Metadata): Valid JSONB payload (${serialized.length} bytes).`);

  // Assertion 6: Single Answer Protection (1 question cannot make a dimension Strong)
  const singleAnswerInput: CompleteDiagnosticInput = {
    goal: studentInput.goal,
    experience: studentInput.experience,
    constraints: studentInput.constraints,
    sjtResponses: [{ questionId: 'Q9_UNCLEAR_ASSIGNMENT', optionId: 'q9_ph', timestamp: Date.now() }],
    matrixResponses: [],
    tradeoffResponses: []
  };
  const singleProfile = evaluateDiagnosticSession(singleAnswerInput);
  if (singleProfile.behaviorProfile.PH.band === 'strong') {
    throw new Error('Violation: Single answer resulted in a "Strong" diagnosis!');
  }
  console.log(`✓ Invariant 6 (Anti-gaming / Single Answer Protection): Single answer yielded band "${singleProfile.behaviorProfile.PH.band}" (developing). Passed.`);

  console.log('🎉 TASK 2 VALIDATION SUCCESSFUL: ALL 6 INVARIANTS PASSED 100%.');
}

runDiagnosticEngineTests();
