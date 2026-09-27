// scripts/test_program_matrix_fuser.ts
// Exhaustive 360-degree forensic audit runner for Program Engine, Matrix & Roadmap Fuser

import {
  CAREER_PROGRAMS_CATALOG,
  evaluateProgramGraduation,
  evaluateStageProgression,
} from '../src/lib/pathway/programEngine';
import {
  COURSE_COMPETENCY_MATRIX,
  getCompetenciesForCourse,
  getCoursesForCompetency,
  mapQuestToCompetencyEvidence,
} from '../src/lib/pathway/competencyMatrix';
import { generateDynamicStudentRoadmap } from '../src/lib/data/roadmapFuser';
import { CompetencyMasteryStatus, ProgramStage } from '../src/lib/pathway/competencySchema';

console.log('================================================================');
console.log('  PINIT PROGRAM ENGINE, MATRIX & FUSER: 360° FORENSIC AUDIT     ');
console.log('================================================================\n');

let totalTests = 0;
let passedTests = 0;

function assertTest(name: string, condition: boolean, details?: any) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`✅ [PASS] ${name}`);
  } else {
    console.error(`❌ [FAIL] ${name}`, details || '');
    process.exit(1);
  }
}

const sweProgram = CAREER_PROGRAMS_CATALOG.find(p => p.id === 'prog_software_engineering')!;
const dataProgram = CAREER_PROGRAMS_CATALOG.find(p => p.id === 'prog_data_analytics')!;

// ── 1. Program Catalog Structure ─────────────────────────────────────────────
console.log('--- 1. Program Catalog Structure ---');
assertTest('Software Engineering program is defined with 4 distinct semesters', sweProgram.stages.length === 4);
assertTest('Software Engineering has Industry Residency enabled', sweProgram.hasIndustryResidency === true);
assertTest('Data Analytics program is defined with 3 distinct semesters', dataProgram.stages.length === 3);

// ── 2. Stage Progression Gating & Boundary Thresholds ────────────────────────
console.log('\n--- 2. Stage Progression Gating & Thresholds ---');
const sem1 = sweProgram.stages[0];
const sem2 = sweProgram.stages[1];

// 2a. Score strictly below minScore by 0.01
const borderScoreMap = new Map<string, CompetencyMasteryStatus>([
  ['comp_comp_fundamentals_l0', { state: 'demonstrated', compositeScore: 80 } as any],
  ['comp_git_version_control_l1', { state: 'verified', compositeScore: 74.99 } as any], // minScore is 75!
  ['comp_java_syntax_oop_l1', { state: 'demonstrated', compositeScore: 80 } as any],
]);
const evalBorderScore = evaluateStageProgression(sem1, sem2, borderScoreMap);
assertTest('Score of 74.99 strictly fails minScore: 75 requirement', !evalBorderScore.isStageCompleted);
assertTest('Unmet competency details score 74.99 vs minScore 75', evalBorderScore.unmetStageCompetencies.some(u => u.currentScore === 74.99));

// 2b. State hierarchy check (provisional/learning/practice failing demonstrated)
for (const badState of ['locked', 'diagnostic', 'learning', 'practice', 'provisional'] as const) {
  const badStateMap = new Map<string, CompetencyMasteryStatus>([
    ['comp_comp_fundamentals_l0', { state: badState, compositeScore: 90 } as any],
    ['comp_git_version_control_l1', { state: 'verified', compositeScore: 90 } as any],
    ['comp_java_syntax_oop_l1', { state: 'verified', compositeScore: 90 } as any],
  ]);
  const evalBadState = evaluateStageProgression(sem1, sem2, badStateMap);
  assertTest(`Competency in state '${badState}' correctly fails 'demonstrated' stage requirement`, !evalBadState.isStageCompleted);
}

// 2c. verified_needs_review satisfies both demonstrated and verified requirements
const needsReviewMap = new Map<string, CompetencyMasteryStatus>([
  ['comp_comp_fundamentals_l0', { state: 'verified_needs_review', compositeScore: 80 } as any],
  ['comp_git_version_control_l1', { state: 'verified_needs_review', compositeScore: 85 } as any],
  ['comp_java_syntax_oop_l1', { state: 'verified_needs_review', compositeScore: 80 } as any],
]);
const evalNeedsReview = evaluateStageProgression(sem1, sem2, needsReviewMap);
assertTest('State verified_needs_review satisfies stage requirements without revoking progress', evalNeedsReview.isStageCompleted && evalNeedsReview.canAdvanceToNextStage);

// 2d. Final Stage handling (nextStage is undefined)
const sem4 = sweProgram.stages[3];
const finalStagePassedMap = new Map<string, CompetencyMasteryStatus>([
  ['comp_production_engineering_residency_l5', { state: 'verified', compositeScore: 85 } as any],
]);
const evalFinalStage = evaluateStageProgression(sem4, undefined, finalStagePassedMap);
assertTest('Final stage marks isStageCompleted: true', evalFinalStage.isStageCompleted);
assertTest('Final stage marks canAdvanceToNextStage: false when nextStage is undefined', !evalFinalStage.canAdvanceToNextStage && evalFinalStage.nextStageId === undefined);

// 2e. Empty Stage requiredCompetencies edge case
const emptyStage: ProgramStage = {
  id: 'sem_empty',
  title: 'Empty Stage',
  durationMonths: 1,
  stageLevel: 'L1',
  requiredCompetencies: [],
  courseModuleIds: [],
};
const evalEmptyStage = evaluateStageProgression(emptyStage, sem2, new Map());
assertTest('Empty stage requiredCompetencies handles cleanly (progress = 100%)', evalEmptyStage.stageProgressPct === 100);

// ── 3. Program Graduation Evaluation ──────────────────────────────────────────
console.log('\n--- 3. Program Graduation Exit Criteria ---');
const fullMasteryMap = new Map<string, CompetencyMasteryStatus>();
for (const stage of sweProgram.stages) {
  for (const req of stage.requiredCompetencies) {
    fullMasteryMap.set(req.competencyId, {
      state: 'verified',
      compositeScore: 90,
      hasCriticalFailures: false,
    } as any);
  }
}

// 3a. Partial verified percentage below threshold (e.g. 50% verified vs 75% required)
const partialVerifiedMap = new Map<string, CompetencyMasteryStatus>();
let toggle = false;
for (const stage of sweProgram.stages) {
  for (const req of stage.requiredCompetencies) {
    partialVerifiedMap.set(req.competencyId, {
      state: toggle ? 'verified' : 'demonstrated', // Half demonstrated, half verified
      compositeScore: 90,
      hasCriticalFailures: false,
    } as any);
    toggle = !toggle;
  }
}
const gradPartialVerified = evaluateProgramGraduation(sweProgram, partialVerifiedMap, true, true);
assertTest('Graduation fails when verified percentage is below minimum threshold (75%)', !gradPartialVerified.isGraduated);
assertTest('Missing requirement details verified percentage shortfall', gradPartialVerified.missingRequirements.some(m => m.includes('Verified competency')));

// 3b. Fully Qualified Graduate
const gradSuccess = evaluateProgramGraduation(sweProgram, fullMasteryMap, true, true);
assertTest('Student graduates successfully when all criteria are met', gradSuccess.isGraduated);
assertTest('Demonstrated percentage is 100%', gradSuccess.demonstratedPct === 100);
assertTest('Verified percentage is 100%', gradSuccess.verifiedPct === 100);
assertTest('0 missing requirements for qualified graduate', gradSuccess.missingRequirements.length === 0);

// ── 4. Competency Matrix Edge Cases & Fallbacks ───────────────────────────────
console.log('\n--- 4. Competency Matrix Edge Cases ---');
assertTest('getCompetenciesForCourse with non-existent ID returns empty array []', getCompetenciesForCourse('invalid_course_id').length === 0);
assertTest('getCoursesForCompetency with non-existent ID returns empty array []', getCoursesForCompetency('invalid_comp_id').length === 0);
assertTest('mapQuestToCompetencyEvidence with non-existent course returns null', mapQuestToCompetencyEvidence('invalid_course_id', 1, 'q1') === null);

const outOfBoundsDayMapping = mapQuestToCompetencyEvidence('course-java', 999, 'q1');
assertTest('Out of day range (Day 999) returns safe fallback mapping to primary competency', outOfBoundsDayMapping?.competencyId === 'comp_java_syntax_oop_l1');

// ── 5. Roadmap Fuser Boundary Conditions ──────────────────────────────────────
console.log('\n--- 5. Roadmap Fuser Boundary Conditions ---');

// 5a. Non-existent courseId falls back gracefully to default registry course
const fuserInvalidCourse = generateDynamicStudentRoadmap({
  courseId: 'non_existent_course_id',
  durationDays: 30,
});
assertTest('Fuser handles non-existent courseId with graceful fallback', fuserInvalidCourse.length > 0);

// 5b. Pace = 1 vs Pace = 10
const fuserPace1 = generateDynamicStudentRoadmap({
  courseId: 'course-java',
  dailyPace: 1,
  durationDays: 14,
});
assertTest('Fuser generates valid modules with dailyPace = 1', fuserPace1.length > 0);

const fuserPace10 = generateDynamicStudentRoadmap({
  courseId: 'course-java',
  dailyPace: 10,
  durationDays: 90,
});
assertTest('Fuser generates valid modules with dailyPace = 10', fuserPace10.length > 0);

// 5c. Without competencyMasteryStates parameter (backward compatibility)
const fuserNoStates = generateDynamicStudentRoadmap({
  courseId: 'course-java',
  goal: 'Backend Engineer',
});
assertTest('Fuser functions 100% without competencyMasteryStates (pure backward compatibility)', fuserNoStates.length > 0);

console.log('\n================================================================');
console.log(`  🎉 360° FORENSIC AUDIT PASSED: ALL ${passedTests}/${totalTests} TESTS PASSED WITH 0 ERRORS!`);
console.log('================================================================\n');
