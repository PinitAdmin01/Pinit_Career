// scripts/test_master_regression_sweep.ts
// Comprehensive 360-Degree Regression Sweep for PinIT Career OS & Phase 1 Deliverables

import { COMPETENCY_CATALOG_V1 } from '../src/lib/pathway/competencyCatalog';
import {
  CAREER_PROGRAMS_CATALOG,
  calculateDynamicRoleReadiness,
  evaluateProgramGraduation,
  evaluateStageProgression,
} from '../src/lib/pathway/programEngine';
import {
  CompetencyEvidenceRecord,
  CompetencyMasteryStatus,
  DynamicRoleReadiness,
} from '../src/lib/pathway/competencySchema';
import {
  generateEvidenceIntegrityHash,
  processEvidenceLedger,
  verifyEvidenceIntegrity,
} from '../src/lib/pathway/evidenceEngine';
import {
  evaluateCompetencyMastery,
  MASTERY_POLICY_VERSION,
} from '../src/lib/pathway/masteryEngine';
import { generateDynamicStudentRoadmap } from '../src/lib/data/roadmapFuser';
import { PathwayApiService } from '../src/lib/api/pathwayApi';

console.log('================================================================');
console.log('  PINIT MASTER 360° COMPREHENSIVE REGRESSION & INTEGRITY SWEEP  ');
console.log('================================================================\n');

let totalTests = 0;
let passedTests = 0;

function assertSweep(name: string, condition: boolean, details?: any) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  🛡️ [PASS] ${name}`);
  } else {
    console.error(`  ❌ [FAIL] ${name}`, details || '');
    process.exit(1);
  }
}

// ── 1. Program Catalog Invariants across all 4 Programs ───────────────────────
console.log('--- 1. Program Catalog Invariants across all 4 Programs ---');
for (const prog of CAREER_PROGRAMS_CATALOG) {
  assertSweep(`Program [${prog.id}] has valid non-empty title and targetRole`, !!prog.title && !!prog.targetRole);
  assertSweep(`Program [${prog.id}] has at least 2 stages`, prog.stages.length >= 2);
  assertSweep(`Program [${prog.id}] has positive duration months`, prog.recommendedDurationMonths.standard > 0);
  for (const st of prog.stages) {
    assertSweep(`Stage [${st.id}] in [${prog.id}] has requiredCompetencies`, st.requiredCompetencies.length > 0);
    assertSweep(`Stage [${st.id}] in [${prog.id}] durationMonths > 0`, st.durationMonths > 0);
    for (const req of st.requiredCompetencies) {
      assertSweep(`Required comp [${req.competencyId}] in [${st.id}] exists in Catalog V1`,
        COMPETENCY_CATALOG_V1.some(c => c.id === req.competencyId));
    }
  }
}

// ── 2. Boundary & Edge Case Evaluation of calculateDynamicRoleReadiness ────────
console.log('\n--- 2. calculateDynamicRoleReadiness Boundary Testing ---');
const prog9m = CAREER_PROGRAMS_CATALOG.find(p => p.id === 'prog_swe_accelerated_9m')!;

// 2a. Completely empty mastery map and 0 evidence records
const emptyReadiness = calculateDynamicRoleReadiness(prog9m, new Map(), []);
assertSweep('Empty inputs evaluate safely to status: "exploring"', emptyReadiness.status === 'exploring');
assertSweep('Empty inputs produce verifiedCount: 0', emptyReadiness.verifiedCompetenciesCount === 0);
assertSweep('Empty inputs produce learningGain baseline: undefined', emptyReadiness.learningGain.baselineDiagnosticScore === undefined);
assertSweep('Empty inputs produce pointsGained: undefined', emptyReadiness.learningGain.pointsGained === undefined);
assertSweep('Empty inputs produce 0 key artifacts', emptyReadiness.keyProjectArtifacts.length === 0);
assertSweep('Empty inputs produce freshness: 0 days', emptyReadiness.assessmentFreshnessDays === 0);

// 2b. Partial progress (3 out of 8 competencies verified)
const partialMastery = new Map<string, CompetencyMasteryStatus>();
for (let i = 0; i < 3; i++) {
  const req = prog9m.stages[0].requiredCompetencies[i];
  partialMastery.set(req.competencyId, {
    state: req.requiredState,
    compositeScore: 85,
    latestQualifiedEvidenceAt: Date.now() - 86400000 * 2, // 2 days ago
  } as any);
}
const partialReadiness = calculateDynamicRoleReadiness(prog9m, partialMastery, [
  { sourceType: 'diagnostic', score: 40 } as any,
  { sourceType: 'quest', score: 85 } as any,
]);
assertSweep('Partial progress (3/8) evaluates to status: "in_progress"', partialReadiness.status === 'in_progress');
assertSweep('Partial progress verifiedCount is exactly 3', partialReadiness.verifiedCompetenciesCount === 3);
assertSweep('Baseline 40 is correctly extracted', partialReadiness.learningGain.baselineDiagnosticScore === 40);
assertSweep('Assessment freshness reflects 2 days ago', partialReadiness.assessmentFreshnessDays === 2);

// 2c. Internship threshold (70% verified, e.g. 6/8 competencies)
for (let i = 3; i < 6; i++) {
  const stageIdx = i < prog9m.stages[0].requiredCompetencies.length ? 0 : 1;
  const compIdx = stageIdx === 0 ? i : i - prog9m.stages[0].requiredCompetencies.length;
  const req = prog9m.stages[stageIdx].requiredCompetencies[compIdx];
  partialMastery.set(req.competencyId, {
    state: req.requiredState,
    compositeScore: 85,
    latestQualifiedEvidenceAt: Date.now() - 86400000 * 5,
  } as any);
}
const internReadiness = calculateDynamicRoleReadiness(prog9m, partialMastery, [
  { sourceType: 'diagnostic', score: 50 } as any,
]);
assertSweep('75% verified competencies unlocks status: "ready_for_internship"', internReadiness.status === 'ready_for_internship');

// 2d. 100% verified BUT failing oral defense (Score: 60/100, below 75)
for (const st of prog9m.stages) {
  for (const req of st.requiredCompetencies) {
    partialMastery.set(req.competencyId, {
      state: req.requiredState,
      compositeScore: 88,
      latestQualifiedEvidenceAt: Date.now() - 3600000,
    } as any);
  }
}
const failingDefenseReadiness = calculateDynamicRoleReadiness(prog9m, partialMastery, [
  { sourceType: 'diagnostic', score: 45 } as any,
  { evidenceClass: 'defense', sourceType: 'capstone_defense', score: 60, evaluatorVersion: 'Board-v1' } as any,
]);
assertSweep('100% competencies + failing defense score (60) strictly blocks "ready_for_interview"',
  failingDefenseReadiness.status !== 'ready_for_interview');

// 2e. 100% verified + passing oral defense (Score: 88/100)
const passingDefenseReadiness = calculateDynamicRoleReadiness(prog9m, partialMastery, [
  { sourceType: 'diagnostic', score: 45 } as any,
  {
    evidenceClass: 'defense',
    sourceType: 'capstone_defense',
    score: 88,
    evaluatorVersion: 'Lead-Reviewer-v1',
    artifacts: { commitSha: 'sha_final_capstone_test' },
  } as any,
]);
assertSweep('100% competencies + passing defense score (88) unlocks "ready_for_interview"',
  passingDefenseReadiness.status === 'ready_for_interview');
assertSweep('Defense score 88 is accurately captured', passingDefenseReadiness.capstoneDefenseScore === 88);
assertSweep('Reviewer Lead-Reviewer-v1 is captured', passingDefenseReadiness.capstoneDefenseEvaluator === 'Lead-Reviewer-v1');

// ── 3. Stage Progression Boundary Sweep for all 4 Programs ────────────────────
console.log('\n--- 3. Stage Progression Boundary Sweep across All Programs ---');
for (const prog of CAREER_PROGRAMS_CATALOG) {
  for (let i = 0; i < prog.stages.length; i++) {
    const current = prog.stages[i];
    const next = prog.stages[i + 1];

    // Empty mastery map
    const emptyResult = evaluateStageProgression(current, next, new Map());
    assertSweep(`Empty map on [${prog.id}] stage [${current.id}] is not completed`, !emptyResult.isStageCompleted);
    assertSweep(`Empty map on [${prog.id}] stage [${current.id}] cannot advance`, !emptyResult.canAdvanceToNextStage);

    // Full mastery map
    const fullMap = new Map<string, CompetencyMasteryStatus>();
    for (const req of current.requiredCompetencies) {
      fullMap.set(req.competencyId, {
        state: req.requiredState,
        compositeScore: req.minScore + 5,
      } as any);
    }
    const fullResult = evaluateStageProgression(current, next, fullMap);
    assertSweep(`Satisfied requirements on [${prog.id}] stage [${current.id}] marks isStageCompleted: true`,
      fullResult.isStageCompleted);
    if (next) {
      assertSweep(`Satisfied requirements on [${prog.id}] stage [${current.id}] unlocks canAdvanceToNextStage: true`,
        fullResult.canAdvanceToNextStage);
      assertSweep(`Next stage ID matches [${next.id}]`, fullResult.nextStageId === next.id);
    } else {
      assertSweep(`Final stage on [${prog.id}] canAdvanceToNextStage: false`, !fullResult.canAdvanceToNextStage);
    }
  }
}

// ── 4. Roadmap Fuser Boundary Testing ─────────────────────────────────────────
console.log('\n--- 4. Roadmap Fuser Boundary & Param Sweep ---');
const testPaces = [1, 2, 3, 5, 10];
const testDurations = [14, 30, 60, 90, 180, 365];
for (const pace of testPaces) {
  const roadmap = generateDynamicStudentRoadmap({
    courseId: 'course-fullstack',
    dailyPace: pace,
    qt1: 85,
    qt2: 90,
  });
  assertSweep(`Roadmap generated with pace ${pace} has non-empty modules`, roadmap.length > 0);
  assertSweep(`Roadmap quests have competency tags`, roadmap[0].quests[0].competencyTag !== undefined);
}

for (const dur of testDurations) {
  const roadmap = generateDynamicStudentRoadmap({
    courseId: 'course-java',
    durationDays: dur,
    qt1: 45, // Low knowledge -> triggers reinforcement
  });
  assertSweep(`Roadmap with duration ${dur} days handles reinforcement tags cleanly`,
    roadmap[0].quests.some(q => q.reinforcementNeeded === true));
}

// ── 5. Evidence Engine Cryptographic & Fuzzing Tamper Resistance ───────────────
console.log('\n--- 5. Cryptographic Evidence Ledger Tamper Resistance ---');
const authenticRecord: Omit<CompetencyEvidenceRecord, 'integrityHash'> = {
  id: 'ev_sweep_01',
  competencyId: 'comp_git_version_control_l1',
  competencyVersion: '1.0.0',
  studentId: 'student_sweep_01',
  programId: 'prog_swe_accelerated_9m',
  evidenceClass: 'application',
  difficulty: 'basic',
  evidenceFamilyId: 'fam_git_01',
  sourceType: 'project',
  sourceId: 'proj_git_01',
  attemptId: 'att_01',
  score: 95,
  evaluatorType: 'deterministic',
  evaluatorVersion: 'eval-v1',
  rubricVersion: 'rubric-v1',
  timestamp: 1700000000000,
  artifacts: { commitSha: 'sha_authentic_commit' },
};

const hash = generateEvidenceIntegrityHash(authenticRecord);
const validRecord: CompetencyEvidenceRecord = { ...authenticRecord, integrityHash: hash };
assertSweep('Authentic record passes integrity check', verifyEvidenceIntegrity(validRecord));

// Fuzz 8 distinct fields to ensure all tamper vectors fail
const tamperVectors = [
  { field: 'score', val: 95.00001 },
  { field: 'studentId', val: 'student_impersonator' },
  { field: 'programId', val: 'prog_tampered' },
  { field: 'evidenceClass', val: 'production' },
  { field: 'difficulty', val: 'production' },
  { field: 'evaluatorVersion', val: 'eval-v2' },
  { field: 'timestamp', val: 1700000000001 },
  { field: 'sourceType', val: 'bug_lab' },
];

for (const t of tamperVectors) {
  const tampered = { ...validRecord, [t.field]: t.val };
  assertSweep(`Tampering with field [${t.field}] is caught and rejected`, !verifyEvidenceIntegrity(tampered));
}

console.log('\n================================================================');
console.log(`  🎉 360° MASTER REGRESSION AUDIT: ALL ${passedTests}/${totalTests} TESTS PASSED WITH 0 REGRESSIONS!`);
console.log('================================================================\n');
