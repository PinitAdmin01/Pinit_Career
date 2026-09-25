/**
 * scripts/tests/test_onboarding_forensic_deep_audit.ts
 * 
 * Deep Forensic Validation & Stress Testing for PinIT Career OS Onboarding Decision Engine
 * Tests edge cases, missing data resilience, type safety, latency calculations,
 * and end-to-end data fuser integration.
 */

import {
  evaluateDiagnosticSession,
  CompleteDiagnosticInput,
  CompleteDiagnosticProfile,
  GoalDiscoveryAnswers,
  DiagnosticAnswerSession,
  DIMENSION_LABELS,
  ARCHETYPE_NAMES
} from '../../src/lib/onboarding/diagnosticEngine';
import {
  SJT_QUESTIONS,
  MATRIX_SCENARIOS,
  TRADEOFF_PROBES,
  GOAL_DISCOVERY_QUESTIONS
} from '../../src/lib/onboarding/diagnosticRegistry';
import {
  generateDynamicStudentRoadmap,
  recordRuntimeMisconception
} from '../../src/lib/data/roadmapFuser';

function assert(condition: boolean, msg: string) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${msg}`);
    process.exit(1);
  }
  console.log(`✓ ${msg}`);
}

async function runForensicDeepAudit() {
  console.log('===========================================================');
  console.log('🔬 STARTING DEEP FORENSIC ONBOARDING DECISION ENGINE AUDIT');
  console.log('===========================================================\n');

  // TEST 1: Defensive Resiliency Against Empty / Nullish Inputs
  console.log('--- TEST 1: Defensive Fallbacks for Partial & Empty Inputs ---');
  const emptyInput: any = {
    sjtResponses: [],
    matrixResponses: [],
    tradeoffResponses: []
  };

  const emptyProfile = evaluateDiagnosticSession(emptyInput);
  assert(emptyProfile !== null && typeof emptyProfile === 'object', 'Empty input returns a valid object');
  assert(emptyProfile.goal.role === 'full_stack_developer', 'Safe fallback goal.role populated');
  assert(emptyProfile.goal.horizonMonths === 6, 'Safe fallback goal.horizonMonths populated');
  assert(Array.isArray(emptyProfile.goal.motivation), 'Safe fallback goal.motivation is an array');
  assert(Array.isArray(emptyProfile.experience.exposureLevels), 'Safe fallback experience.exposureLevels is an array');
  assert(emptyProfile.experience.parsedExperienceLevel === 'fresher', 'Empty exposure maps to "fresher"');
  assert(emptyProfile.constraints.dailyMinutes === 90, 'Safe fallback constraints.dailyMinutes populated');
  assert(emptyProfile.systemMetadata.rawAuditTrail.averageLatencyMs === 0, 'Empty latencies yield 0ms avg (not NaN)');
  assert(!isNaN(emptyProfile.systemMetadata.rawAuditTrail.averageLatencyMs), 'Average latency is guaranteed not NaN');
  assert(emptyProfile.roadmapStrategy.allocations.explorationPct +
         emptyProfile.roadmapStrategy.allocations.executionPct +
         emptyProfile.roadmapStrategy.allocations.communicationPct +
         emptyProfile.roadmapStrategy.allocations.technicalGapPct === 100,
         'Roadmap allocations sum to 100% on empty input');

  // TEST 2: Extreme Latencies & Timing Telemetry
  console.log('\n--- TEST 2: Latency Telemetry & Timing Stress Test ---');
  const weirdLatenciesInput: CompleteDiagnosticInput = {
    goal: {
      outcome: 'placement',
      role: 'ai_engineer',
      horizonMonths: 12,
      motivation: ['high_package', 'deep_tech']
    },
    experience: {
      exposureLevels: ['internship', 'freelance'],
      capabilitySelfRating: 'independent_builder'
    },
    constraints: {
      dailyMinutes: 120,
      primaryConstraints: ['college_classes']
    },
    sjtResponses: [
      { questionId: 'SJT_01', optionId: 'SJT_01_PH', responseTimeMs: 0, timestamp: Date.now() },
      { questionId: 'SJT_02', optionId: 'SJT_02_PH', responseTimeMs: -500, timestamp: Date.now() }, // Negative latency
      { questionId: 'SJT_03', optionId: 'SJT_03_PH', responseTimeMs: undefined, timestamp: Date.now() }, // Undefined latency
      { questionId: 'SJT_04', optionId: 'SJT_04_PH', responseTimeMs: 45000, timestamp: Date.now() }, // 45s latency
    ],
    matrixResponses: [
      { scenarioId: 'M1', itemId: 'M1_A', rating: 5, responseTimeMs: 1200, timestamp: Date.now() }
    ],
    tradeoffResponses: [
      { questionId: 'T1', optionId: 'T1_A', responseTimeMs: 3400, timestamp: Date.now() }
    ]
  };

  const weirdProfile = evaluateDiagnosticSession(weirdLatenciesInput);
  assert(!isNaN(weirdProfile.systemMetadata.rawAuditTrail.averageLatencyMs), 'Weird latencies handle without NaN');
  assert(weirdProfile.systemMetadata.rawAuditTrail.averageLatencyMs > 0, 'Computed valid positive avg latency');
  assert(weirdProfile.experience.parsedExperienceLevel === 'experienced', 'Freelance + internship maps to "experienced"');

  // TEST 3: All 12 SJT Questions Answered with Unanimous Strategy (Bias Resistance)
  console.log('\n--- TEST 3: Unanimous Dimension Strategy & Non-Pie Band Validation ---');
  const unanimousPhInput: CompleteDiagnosticInput = {
    goal: {
      outcome: 'internship',
      role: 'backend_engineer',
      horizonMonths: 6,
      motivation: ['skill_acquisition']
    },
    experience: {
      exposureLevels: ['academic_labs'],
      capabilitySelfRating: 'curious_starter'
    },
    constraints: {
      dailyMinutes: 60,
      primaryConstraints: ['exam_season']
    },
    sjtResponses: SJT_QUESTIONS.map(q => {
      const phOpt = q.options.find(o => o.dimension === 'PH')!;
      return {
        questionId: q.id,
        optionId: phOpt.id,
        responseTimeMs: 3500,
        timestamp: Date.now()
      };
    }),
    matrixResponses: MATRIX_SCENARIOS.flatMap(m => {
      return m.items.map(item => ({
        scenarioId: m.id,
        itemId: item.id,
        rating: item.dimension === 'PH' ? 5 : (item.dimension === 'ST' ? 1 : 2),
        responseTimeMs: 800,
        timestamp: Date.now()
      }));
    }),
    tradeoffResponses: TRADEOFF_PROBES.map(t => ({
      questionId: t.id,
      optionId: t.options[0].id,
      responseTimeMs: 2000,
      timestamp: Date.now()
    }))
  };

  const unanimousProfile = evaluateDiagnosticSession(unanimousPhInput);
  assert(unanimousProfile.behaviorProfile.PH.band === 'strong', 'PH achieves "strong" with 12 SJTs + matrix ratings');
  assert(unanimousProfile.behaviorProfile.PH.evidence >= 24, `PH accumulated heavy evidence: ${unanimousProfile.behaviorProfile.PH.evidence}`);
  assert(unanimousProfile.behaviorProfile.PH.contextsCount >= 5, `PH observed across ${unanimousProfile.behaviorProfile.PH.contextsCount} distinct contexts`);
  assert(unanimousProfile.behaviorProfile.ST.band === 'developing', 'ST rated low in matrix stays in "developing" band');
  assert(unanimousProfile.behaviorProfile.dominantArchetype === 'Pattern Hunter', 'Dominant archetype resolved to Pattern Hunter');
  assert(unanimousProfile.tradeoffs.length > 0, 'Tensions detected for extreme analytical profile');

  // TEST 4: Tradeoff Invariant & Remediation Strategy Allocation
  console.log('\n--- TEST 4: Tradeoff Remediation & Roadmap Effort Allocation ---');
  const explorerProfileInput: CompleteDiagnosticInput = {
    goal: { outcome: 'startup', role: 'full_stack_developer', horizonMonths: 3, motivation: ['portfolio'] },
    experience: { exposureLevels: [], capabilitySelfRating: 'guided_builder' },
    constraints: { dailyMinutes: 90, primaryConstraints: [] },
    sjtResponses: SJT_QUESTIONS.map(q => {
      const exOpt = q.options.find(o => o.dimension === 'EX')!;
      return { questionId: q.id, optionId: exOpt.id, responseTimeMs: 2500, timestamp: Date.now() };
    }),
    matrixResponses: MATRIX_SCENARIOS.flatMap(m => m.items.map(item => ({
      scenarioId: m.id,
      itemId: item.id,
      rating: item.dimension === 'EX' ? 5 : 1,
      responseTimeMs: 700,
      timestamp: Date.now()
    }))),
    tradeoffResponses: TRADEOFF_PROBES.map(t => ({
      questionId: t.id,
      optionId: t.options.find(o => o.favorsDimension === 'EX')?.id || t.options[0].id,
      responseTimeMs: 1500,
      timestamp: Date.now()
    }))
  };

  const explorerProfile = evaluateDiagnosticSession(explorerProfileInput);
  const detectedExplorationVsExecution = explorerProfile.tradeoffs.find(t => t.type === 'exploration_vs_execution');
  assert(detectedExplorationVsExecution !== undefined, 'Detected high tension: exploration_vs_execution');
  assert(explorerProfile.roadmapStrategy.allocations.executionPct === 50, 'Allocated boosted 50% execution to counter scope sprawl');
  assert(explorerProfile.roadmapStrategy.allocations.explorationPct === 20, 'Timeboxed exploration to 20%');

  // TEST 5: Downstream Roadmap Fuser Integration
  console.log('\n--- TEST 5: Downstream Roadmap Fuser Integration ---');
  const fusedRoadmap = generateDynamicStudentRoadmap({
    courseId: 'java-enterprise',
    archetype: explorerProfile.behaviorProfile.dominantArchetype,
    qt1: 65,
    qt2: 70,
    targetRole: explorerProfile.goal.role,
    careerGoal: 'Build high-scale fintech backend',
    dailyPace: 2,
    durationDays: 30,
    diagnosticProfile: explorerProfile,
    tradeoffs: explorerProfile.tradeoffs,
    roadmapStrategy: explorerProfile.roadmapStrategy
  });

  assert(fusedRoadmap.length > 0, `Generated ${fusedRoadmap.length} dynamic roadmap modules`);
  const firstModule = fusedRoadmap[0];
  assert(firstModule.tradeoffInterventions !== undefined && firstModule.tradeoffInterventions.length > 0,
         'Tradeoff interventions attached to Phase 1 module');
  assert(firstModule.allocationsTag !== undefined && firstModule.allocationsTag.includes('50% Build'),
         'Allocations tag includes 50% Build');
  const questWithStrategy = firstModule.quests.find(q =>
    (q.personalizedHint && q.personalizedHint.includes('🎯 Strategy Focus')) ||
    (q.desc && q.desc.includes('🎯 Strategy Focus'))
  );
  assert(questWithStrategy !== undefined, 'Daily quest contains injected tradeoff coaching hint');

  // TEST 6: Misconception Feedback Loop Ingestion
  console.log('\n--- TEST 6: Misconception Telemetry & Feedback Loop ---');
  let monitoredProfile = explorerProfile;
  monitoredProfile = recordRuntimeMisconception(monitoredProfile, 'MC_JAVA_REFERENCE_MUTATION');
  monitoredProfile = recordRuntimeMisconception(monitoredProfile, 'MC_JAVA_ARRAY_INDEX_OOB');
  monitoredProfile = recordRuntimeMisconception(monitoredProfile, 'MC_JAVA_REFERENCE_MUTATION'); // Duplicate check

  assert(monitoredProfile.systemMetadata.misconceptionFeedbackHooks.observedMisconceptions.length === 2,
         'Recorded 2 unique runtime misconceptions without duplicate accumulation');
  assert(monitoredProfile.systemMetadata.misconceptionFeedbackHooks.adaptiveInterventionsCount === 3,
         'Intervention count incremented correctly to 3');
  assert(monitoredProfile.systemMetadata.misconceptionFeedbackHooks.lastUpdated > 0,
         'Timestamp updated on error recording');

  console.log('\n===========================================================');
  console.log('🎉 ALL 6 DEEP FORENSIC AUDIT TESTS PASSED 100%!');
  console.log('===========================================================');
}

runForensicDeepAudit().catch(err => {
  console.error('Fatal audit failure:', err);
  process.exit(1);
});
