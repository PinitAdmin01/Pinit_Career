// scripts/tests/test_roadmap_fuser_decision_engine.ts
/**
 * Automated Validation for Task 6:
 * Downstream Roadmap Fuser, Trade-Off Quest Coaching, and Runtime Misconception Feedback Loop
 */

import {
  generateDynamicStudentRoadmap,
  recordRuntimeMisconception
} from '../../src/lib/data/roadmapFuser';
import {
  evaluateDiagnosticSession,
  CompleteDiagnosticInput,
  RawDiagnosticResponse,
  RawMatrixResponse
} from '../../src/lib/onboarding/diagnosticEngine';

async function runRoadmapFuserIntegrationTests() {
  console.log('=== RUNNING ROADMAP FUSER & LESSON ENGINE INTEGRATION TESTS (TASK 6) ===\n');

  // 1. Generate realistic Diagnostic Profile with High Explorer + Developing Stabilizer (Exploration vs Execution Tradeoff)
  console.log('Test 1: Generating profile with exploration_vs_execution trade-off...');
  const sjtResponses: RawDiagnosticResponse[] = [
    { questionId: 'q9_perf_bug', optionId: 'q9_ex', responseTimeMs: 2500, timestamp: Date.now() },
    { questionId: 'q10_deadline_scope', optionId: 'q10_ex', responseTimeMs: 2700, timestamp: Date.now() },
    { questionId: 'q11_unfamiliar_stack', optionId: 'q11_ex', responseTimeMs: 2400, timestamp: Date.now() },
    { questionId: 'q12_spec_ambiguity', optionId: 'q12_ex', responseTimeMs: 2300, timestamp: Date.now() },
    { questionId: 'q13_code_review_dispute', optionId: 'q13_ex', responseTimeMs: 2900, timestamp: Date.now() },
    { questionId: 'q14_system_crash', optionId: 'q14_ex', responseTimeMs: 2200, timestamp: Date.now() },
    { questionId: 'q15_tech_choice', optionId: 'q15_ex', responseTimeMs: 2100, timestamp: Date.now() },
    { questionId: 'q16_tech_debt', optionId: 'q16_ex', responseTimeMs: 2600, timestamp: Date.now() },
    { questionId: 'q17_team_blocker', optionId: 'q17_ex', responseTimeMs: 2300, timestamp: Date.now() },
    { questionId: 'q18_api_contract_shift', optionId: 'q18_ex', responseTimeMs: 2800, timestamp: Date.now() },
    { questionId: 'q19_onboarding_newbie', optionId: 'q19_ex', responseTimeMs: 2500, timestamp: Date.now() },
    { questionId: 'q20_production_incident', optionId: 'q20_ex', responseTimeMs: 2400, timestamp: Date.now() }
  ];

  const matrixResponses: RawMatrixResponse[] = [
    { scenarioId: 'M1_STARTING_PROJECT', itemId: 'M1_EX', rating: 5, responseTimeMs: 1500, timestamp: Date.now() },
    { scenarioId: 'M2_WHEN_SOMETHING_FAILS', itemId: 'M2_EX', rating: 5, responseTimeMs: 1600, timestamp: Date.now() },
    { scenarioId: 'M3_WORKING_UNDER_UNCERTAINTY', itemId: 'M3_EX', rating: 5, responseTimeMs: 1400, timestamp: Date.now() },
    { scenarioId: 'M4_COMPLETING_IMPORTANT_WORK', itemId: 'M4_EX', rating: 5, responseTimeMs: 1700, timestamp: Date.now() }
  ];

  const tradeoffResponses: RawDiagnosticResponse[] = [
    { questionId: 'Q21_EXPLORE_VS_FINISH', optionId: 'q21_a', responseTimeMs: 2000, timestamp: Date.now() },
    { questionId: 'Q22_DEPTH_VS_SPEED', optionId: 'q22_b', responseTimeMs: 2100, timestamp: Date.now() },
    { questionId: 'Q23_SOLO_VS_CONSULT', optionId: 'q23_a', responseTimeMs: 2200, timestamp: Date.now() },
    { questionId: 'Q24_PLAN_VS_ADAPT', optionId: 'q24_b', responseTimeMs: 1900, timestamp: Date.now() }
  ];

  const input: CompleteDiagnosticInput = {
    goal: {
      outcome: 'internship',
      role: 'full_stack_developer',
      horizonMonths: 6,
      motivation: ['career_placement']
    },
    experience: {
      exposureLevels: ['personal_project'],
      capabilitySelfRating: 'guided_builder'
    },
    constraints: {
      dailyMinutes: 90,
      primaryConstraints: ['college_classes']
    },
    sjtResponses,
    matrixResponses,
    tradeoffResponses
  };

  const profile = evaluateDiagnosticSession(input);
  console.log(`✓ Profile generated. Detected tradeoffs: ${profile.tradeoffs.length} detected.`);
  const hasExploreVsExec = profile.tradeoffs.some(t => t.type === 'exploration_vs_execution');
  if (!hasExploreVsExec) {
    throw new Error('Test 1 Failed: Expected exploration_vs_execution tradeoff not detected.');
  }

  // 2. Fusing into Dynamic Student Roadmap
  console.log('\nTest 2: Fusing profile into Dynamic Student Roadmap...');
  const modules = generateDynamicStudentRoadmap({
    courseId: 'python-fullstack',
    goal: 'Fullstack Engineer',
    qt1: 65,
    qt2: 70,
    diagnosticProfile: profile,
    durationDays: 30,
    dailyPace: 3
  });

  if (!modules || modules.length === 0) {
    throw new Error('Test 2 Failed: No roadmap modules generated.');
  }
  console.log(`✓ Generated ${modules.length} dynamic roadmap modules.`);

  // Invariant A: Module contains Trade-Off Interventions
  const mod0 = modules[0];
  if (!mod0.tradeoffInterventions || mod0.tradeoffInterventions.length === 0) {
    throw new Error('Test 2 Failed: Module missing tradeoffInterventions metadata.');
  }
  console.log(`✓ Module 1 Trade-off Interventions Attached: ${mod0.tradeoffInterventions[0]}`);

  // Invariant B: Quests receive personalized coaching hints
  const questsWithCoaching = mod0.quests.filter(q => q.personalizedHint && q.personalizedHint.includes('Strategy Focus'));
  if (questsWithCoaching.length === 0) {
    throw new Error('Test 2 Failed: No quests received tradeoff strategy focus hints.');
  }
  console.log(`✓ ${questsWithCoaching.length} quests in Module 1 received injected trade-off coaching:`);
  console.log(`  Sample: "${questsWithCoaching[0].personalizedHint}"`);

  // 3. Test Runtime Misconception Feedback Loop
  console.log('\nTest 3: Testing Runtime Misconception Feedback Loop...');
  const initialCount = profile.systemMetadata.misconceptionFeedbackHooks.observedMisconceptions.length;
  if (initialCount !== 0) {
    throw new Error('Test 3 Failed: Initial observed misconceptions must be 0.');
  }

  // Simulate student triggering runtime error MC_JAVA_PASS_BY_VALUE in Monaco workspace
  const updatedProfile1 = recordRuntimeMisconception(profile, 'MC_JAVA_PASS_BY_VALUE');
  if (!updatedProfile1.systemMetadata.misconceptionFeedbackHooks.observedMisconceptions.includes('MC_JAVA_PASS_BY_VALUE')) {
    throw new Error('Test 3 Failed: MC_JAVA_PASS_BY_VALUE not recorded.');
  }
  if (updatedProfile1.systemMetadata.misconceptionFeedbackHooks.adaptiveInterventionsCount !== 1) {
    throw new Error('Test 3 Failed: Adaptive interventions count should be 1.');
  }

  // Simulate student triggering runtime error MC_JAVA_EXECUTION_ORDER in Monaco workspace
  const updatedProfile2 = recordRuntimeMisconception(updatedProfile1, 'MC_JAVA_EXECUTION_ORDER');
  if (!updatedProfile2.systemMetadata.misconceptionFeedbackHooks.observedMisconceptions.includes('MC_JAVA_EXECUTION_ORDER')) {
    throw new Error('Test 3 Failed: MC_JAVA_EXECUTION_ORDER not recorded.');
  }
  if (updatedProfile2.systemMetadata.misconceptionFeedbackHooks.adaptiveInterventionsCount !== 2) {
    throw new Error('Test 3 Failed: Adaptive interventions count should be 2.');
  }

  console.log(`✓ Runtime misconceptions successfully recorded into diagnostic feedback loop:`);
  console.log(`  Recorded: [${updatedProfile2.systemMetadata.misconceptionFeedbackHooks.observedMisconceptions.join(', ')}]`);
  console.log(`  Interventions Count: ${updatedProfile2.systemMetadata.misconceptionFeedbackHooks.adaptiveInterventionsCount}`);
  console.log(`  Telemetry Last Updated: ${new Date(updatedProfile2.systemMetadata.misconceptionFeedbackHooks.lastUpdated).toISOString()}`);

  console.log('\n🎉 TASK 6 VALIDATION SUCCESSFUL: ROADMAP FUSING & LESSON ENGINE INTEGRATION VERIFIED 100%.');
}

runRoadmapFuserIntegrationTests().catch(err => {
  console.error('Task 6 Validation Error:', err);
  process.exit(1);
});
