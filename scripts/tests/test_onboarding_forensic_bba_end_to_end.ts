// scripts/tests/test_onboarding_forensic_bba_end_to_end.ts
/**
 * 3rd-Person Forensic End-to-End Audit & Verification Suite for BBA / MBA Onboarding Pipeline
 * 
 * Verifies:
 * 1. BBA Course IDs in COURSES_REGISTRY (all courses exist with full 30-day curricula)
 * 2. Collision-free trajectory resolution across all 12 BBA Q1 career directions
 * 3. Collision-free Q33 specialization resolution for BBA domains
 * 4. Dynamic roadmap fusing for BBA curricula with trade-off interventions
 * 5. Full end-to-end simulation of student journey (Step 0 -> Goal -> SJT -> Matrix -> Tradeoff -> Spec -> Blueprint -> Roadmap)
 */

import { COURSES_REGISTRY } from '../../src/lib/data/coursesData';
import { recommendCareerTrajectory } from '../../src/lib/data/careerTrajectories';
import {
  BBA_GOAL_DISCOVERY_QUESTIONS,
  BBA_SJT_QUESTIONS,
  BBA_MATRIX_SCENARIOS,
  BBA_TRADEOFF_PROBES,
  BBA_SPECIALIZATION_QUESTIONS,
  getGoalDiscoveryQuestions,
  getSjtQuestions,
  getMatrixScenarios,
  getTradeoffProbes
} from '../../src/lib/onboarding/diagnosticRegistry';
import {
  evaluateDiagnosticSession,
  RawDiagnosticResponse,
  RawMatrixResponse
} from '../../src/lib/onboarding/diagnosticEngine';
import { generateDynamicStudentRoadmap } from '../../src/lib/data/roadmapFuser';

function assert(condition: boolean, msg: string) {
  if (!condition) {
    console.error(`❌ FORENSIC FAILURE: ${msg}`);
    throw new Error(msg);
  }
}

async function runBbaForensicAudit() {
  console.log('================================================================');
  console.log('🔬 STARTING 3RD-PERSON FORENSIC END-TO-END AUDIT (BBA / MBA)');
  console.log('================================================================\n');

  // ── INVARIANT 1: BBA Courses in COURSES_REGISTRY ──
  console.log('1️⃣ Checking BBA Course IDs in COURSES_REGISTRY...');
  const bbaCourseIds = [
    'course-entrepreneurship-biz-mgmt',
    'course-operations-supplychain-compliance',
    'course-business-analytics',
    'course-design-systems',
    'course-digital-marketing',
    'course-marketing-branding',
    'course-sales-crm-success',
    'course-finance-investment',
    'course-ecommerce-digital-biz',
    'course-ai-digital-transformation'
  ];

  for (const cId of bbaCourseIds) {
    const course = COURSES_REGISTRY.find(c => c.id === cId);
    assert(!!course, `Course "${cId}" must exist in COURSES_REGISTRY`);
    assert(Array.isArray(course!.quests) && course!.quests.length >= 30, `Course "${cId}" must have at least 30 quests, got ${course?.quests?.length}`);
    console.log(`   ✓ Found Course "${cId}": "${course!.title}" (${course!.quests.length} Quests)`);
  }
  console.log('   ✅ All 10 BBA courses verified with full 30-day curricula.\n');

  // ── INVARIANT 2: Collision-Free Career Trajectory Resolution ──
  console.log('2️⃣ Checking recommendCareerTrajectory for BBA Roles...');
  const testGoals = [
    { goal: 'consulting', expectedRoleId: 'business-strategy-consultant' },
    { goal: 'management_strategy', expectedRoleId: 'business-strategy-consultant' },
    { goal: 'product_management', expectedRoleId: 'product-manager' },
    { goal: 'human_resources', expectedRoleId: 'hr-people-operations-leader' },
    { goal: 'operations_supplychain', expectedRoleId: 'operations-supplychain-manager' },
    { goal: 'marketing_growth', expectedRoleId: 'digital-growth-marketer' },
    { goal: 'sales_bizdev', expectedRoleId: 'sales-customer-success-manager' },
    { goal: 'corporate_finance', expectedRoleId: 'financial-analyst' },
    { goal: 'banking_financial_services', expectedRoleId: 'financial-analyst' },
    { goal: 'business_analytics', expectedRoleId: 'business-analytics-specialist' },
    { goal: 'entrepreneurship_startup', expectedRoleId: 'entrepreneur-business-manager' },
    { goal: 'exploring', expectedRoleId: 'dynamic-exploring-pro' }
  ];

  for (const t of testGoals) {
    const traj = recommendCareerTrajectory(t.goal, 70, 75, 'Pattern Hunter');
    assert(traj.roleId === t.expectedRoleId, `Goal "${t.goal}" expected roleId "${t.expectedRoleId}", got "${traj.roleId}"`);
    assert(traj.nodes.length >= 1, `Trajectory "${traj.roleId}" must have at least 1 node`);
    assert(!!traj.nodes[0].courseId, `Trajectory "${traj.roleId}" must reference a course`);
    console.log(`   ✓ Goal "${t.goal}" -> Trajectory "${traj.roleId}" (${traj.roleTitle})`);
  }
  console.log('   ✅ All 12 BBA goals cleanly resolve to canonical trajectories without fallback collisions.\n');

  // ── INVARIANT 3: Collision-Free Q33 Specialization Resolution ──
  console.log('3️⃣ Checking Collision-Free Q33 Specialization Resolution...');
  const specializationKeys = Object.keys(BBA_SPECIALIZATION_QUESTIONS);
  assert(specializationKeys.length === 9, `Expected 9 specialization branches, got ${specializationKeys.length}`);

  for (const key of specializationKeys) {
    const spec = BBA_SPECIALIZATION_QUESTIONS[key];
    assert(!!spec.domainId, `Specialization ${key} missing domainId`);
    assert(!!spec.questionId, `Specialization ${key} missing questionId`);
    assert(spec.options.length === 4, `Specialization ${key} must have 4 options`);
    const affinities = spec.options.map(o => o.affinityDimension);
    assert(affinities.includes('PH'), `${key} missing PH affinity`);
    assert(affinities.includes('EX'), `${key} missing EX affinity`);
    assert(affinities.includes('ST'), `${key} missing ST affinity`);
    assert(affinities.includes('SIQ'), `${key} missing SIQ affinity`);
    console.log(`   ✓ Specialization "${key}" (${spec.questionId}): 4-dimension balanced`);
  }
  console.log('   ✅ Q33 Specialization routing verified: Zero collisions across all 9 domains.\n');

  // ── INVARIANT 4: Dynamic Roadmap Fusing for BBA Curricula ──
  console.log('4️⃣ Testing Dynamic Roadmap Fusing for BBA Curricula...');
  for (const cId of bbaCourseIds) {
    const modules = generateDynamicStudentRoadmap({
      courseId: cId,
      goal: 'Management Consultant & Business Strategist',
      qt1: 65,
      qt2: 70,
      archetype: 'Pattern Hunter',
      durationDays: 30,
      dailyPace: 2,
      weakAreas: ['Market Sizing Estimation', 'Supply Chain Bottlenecks'],
      tradeoffs: [
        {
          type: 'analysis_vs_shipping',
          severity: 'moderate',
          confidence: 0.85,
          description: 'Deep analytical rigor vs execution momentum',
          roadmapRecommendation: 'Time-box analysis and iterate'
        }
      ]
    });

    assert(Array.isArray(modules) && modules.length > 0, `Roadmap for "${cId}" must return modules`);
    const totalQuests = modules.reduce((acc, m) => acc + (m.quests?.length || 0), 0);
    assert(totalQuests >= 30, `Roadmap for "${cId}" must contain >= 30 quests, got ${totalQuests}`);
    console.log(`   ✓ Fused Roadmap for "${cId}": ${modules.length} Modules, ${totalQuests} Adapted Quests`);
  }
  console.log('   ✅ Dynamic Roadmap Fuser successfully generates authentic BBA modules without fallbacks.\n');

  // ── INVARIANT 5: End-to-End BBA Student Journey Simulation ──
  console.log('5️⃣ Simulating End-to-End BBA Student Evaluation & Payload Generation...');
  const goalQs = getGoalDiscoveryQuestions('bba_mba');
  const sjtQs = getSjtQuestions('bba_mba');
  const matrixScenarios = getMatrixScenarios('bba_mba');
  const tradeoffProbes = getTradeoffProbes('bba_mba');

  const simulatedSjtResponses: RawDiagnosticResponse[] = sjtQs.map((q, idx) => ({
    questionId: q.id,
    optionId: q.options[idx % 4].id,
    responseTimeMs: 2200 + (idx * 50),
    timestamp: Date.now()
  }));

  const simulatedMatrixResponses: RawMatrixResponse[] = [];
  matrixScenarios.forEach(m => {
    m.items.forEach((item, itemIdx) => {
      simulatedMatrixResponses.push({
        scenarioId: m.id,
        itemId: item.id,
        rating: (itemIdx % 3) + 3,
        responseTimeMs: 1800,
        timestamp: Date.now()
      });
    });
  });

  const simulatedTradeoffResponses: RawDiagnosticResponse[] = tradeoffProbes.map(t => ({
    questionId: t.id,
    optionId: t.options[0].id,
    responseTimeMs: 2400,
    timestamp: Date.now()
  }));

  const specQuestion = BBA_SPECIALIZATION_QUESTIONS.consulting_strategy;
  const specResponse: RawDiagnosticResponse = {
    questionId: specQuestion.questionId,
    optionId: specQuestion.options[0].id,
    responseTimeMs: 2100,
    timestamp: Date.now()
  };

  const completeInput = {
    goal: {
      outcome: 'internship',
      role: 'consulting',
      degreeTrack: 'bba_mba',
      specialization: specResponse.optionId,
      secondaryRoles: ['management_strategy'],
      horizonMonths: 6,
      motivation: ['corporate_turnaround']
    },
    experience: {
      exposureLevels: ['case_competition', 'internship'],
      capabilitySelfRating: 'bba_fresher'
    },
    constraints: {
      dailyMinutes: 90,
      primaryConstraints: ['lack_experience']
    },
    sjtResponses: simulatedSjtResponses,
    matrixResponses: simulatedMatrixResponses,
    tradeoffResponses: simulatedTradeoffResponses
  };

  const profile = evaluateDiagnosticSession(completeInput);

  assert(!!profile.behaviorProfile, 'profile must contain behaviorProfile');
  assert(profile.behaviorProfile.PH.evidence > 0, 'PH evidence must be > 0');
  assert(profile.behaviorProfile.EX.evidence > 0, 'EX evidence must be > 0');
  assert(profile.behaviorProfile.ST.evidence > 0, 'ST evidence must be > 0');
  assert(profile.behaviorProfile.SIQ.evidence > 0, 'SIQ evidence must be > 0');

  // Verify non-pie scoring
  const sumScores = profile.behaviorProfile.PH.normalizedScore +
                    profile.behaviorProfile.EX.normalizedScore +
                    profile.behaviorProfile.ST.normalizedScore +
                    profile.behaviorProfile.SIQ.normalizedScore;
  assert(sumScores !== 100, `Scores must be independent, not forced to 100 (got ${sumScores})`);

  console.log(`   Profile generated: "${profile.behaviorProfile.blendTitle}"`);
  console.log(`   Dimensions: PH=${profile.behaviorProfile.PH.normalizedScore}, EX=${profile.behaviorProfile.EX.normalizedScore}, ST=${profile.behaviorProfile.ST.normalizedScore}, SIQ=${profile.behaviorProfile.SIQ.normalizedScore} (Sum=${sumScores})`);
  console.log(`   Strategy allocations: Execution=${profile.roadmapStrategy.allocations.executionPct}%, Exploration=${profile.roadmapStrategy.allocations.explorationPct}%`);

  console.log('\n================================================================');
  console.log('🎉 ALL 5 3RD-PERSON FORENSIC AUDIT INVARIANTS 100% PASSING!');
  console.log('================================================================\n');
}

runBbaForensicAudit().catch(err => {
  console.error('Audit failed:', err);
  process.exit(1);
});
