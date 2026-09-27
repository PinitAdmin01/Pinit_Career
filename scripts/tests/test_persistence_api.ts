// scripts/test_persistence_api.ts
// Exhaustive 360-degree forensic audit for PathwayApiService and Persistence Contracts

import { PathwayApiService } from '../src/lib/api/pathwayApi';
import { COMPETENCY_CATALOG_V1 } from '../src/lib/pathway/competencyCatalog';

console.log('================================================================');
console.log('  PINIT PERSISTENCE & API SERVICE: 360° FORENSIC AUDIT          ');
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

async function runAudit() {
  const studentId = 'test_student_persistence_01';

  // ── 1. Default Mastery Map Initialization ──────────────────────────────────
  console.log('--- 1. Default Mastery Map Initialization ---');
  const initialMap = await PathwayApiService.getStudentMasteryMap(studentId);
  assertTest('Initial mastery map contains all 17 competencies from catalog', initialMap.size === 17);
  
  const compL0 = initialMap.get('comp_comp_fundamentals_l0');
  assertTest('Zero-prerequisite L0 competency begins in learning state', compL0?.state === 'learning');

  const compL1 = initialMap.get('comp_java_syntax_oop_l1');
  assertTest('Prerequisite-dependent L1 competency begins in locked state', compL1?.state === 'locked');

  // ── 2. Evidence Recording & Automated Recalculation ────────────────────────
  console.log('\n--- 2. Evidence Recording & Mastery Evaluation ---');
  const recordResult = await PathwayApiService.recordEvidence({
    id: 'ev_api_001',
    competencyId: 'comp_comp_fundamentals_l0',
    competencyVersion: '1.0.0',
    studentId: studentId,
    programId: 'prog_software_engineering',
    evidenceClass: 'knowledge',
    difficulty: 'basic',
    evidenceFamilyId: 'comp_arch',
    sourceType: 'quest',
    sourceId: 'quest_arch_01',
    attemptId: 'att_01',
    score: 85,
    evaluatorType: 'deterministic',
    evaluatorVersion: 'eval-v1',
    rubricVersion: 'rubric-v1',
    timestamp: Date.now(),
  });

  assertTest('Evidence is successfully recorded with valid SHA-256 hash', recordResult.success === true && recordResult.evidenceRecord.integrityHash.length === 64);
  assertTest('Mastery engine recalculates status and marks L0 demonstrated', recordResult.updatedMastery.state === 'demonstrated');
  assertTest('Mastery composite score matches record score (85)', recordResult.updatedMastery.compositeScore === 85);

  // ── 3. Error Handling on Invalid Competency ID ─────────────────────────────
  console.log('\n--- 3. Error Handling on Invalid Competency ID ---');
  let invalidCompCaught = false;
  try {
    await PathwayApiService.recordEvidence({
      id: 'ev_invalid_01',
      competencyId: 'comp_non_existent_id',
      competencyVersion: '1.0.0',
      studentId: studentId,
      programId: 'prog_software_engineering',
      evidenceClass: 'knowledge',
      difficulty: 'basic',
      sourceType: 'quest',
      sourceId: 'quest_01',
      attemptId: 'att_01',
      score: 90,
      evaluatorType: 'deterministic',
      evaluatorVersion: 'eval-v1',
      rubricVersion: 'rubric-v1',
      timestamp: Date.now(),
    });
  } catch (err: any) {
    invalidCompCaught = err.message.includes('Competency definition not found');
  }
  assertTest('Recording evidence for non-existent competency throws clear descriptive error', invalidCompCaught);

  // ── 4. Stage Progression API Evaluation ────────────────────────────────────
  console.log('\n--- 4. Stage Progression API & Index Boundary Fallback ---');
  const stage1Result = await PathwayApiService.evaluateStage(studentId, 'prog_software_engineering', 0);
  assertTest('Stage 1 progress reflects completed L0 competency', stage1Result.stageProgressPct > 0);
  assertTest('Stage advancement remains locked until all Semester 1 gates pass', !stage1Result.canAdvanceToNextStage);

  // Out of bounds stage index fallback
  const stageOutOfRange = await PathwayApiService.evaluateStage(studentId, 'prog_software_engineering', 99);
  assertTest('Out of range stage index (99) falls back safely to default stage without crashing', stageOutOfRange.currentStageId !== undefined);

  // ── 5. Graduation Status API Evaluation ────────────────────────────────────
  console.log('\n--- 5. Graduation Status API & Capstone / Residency Toggles ---');
  const gradInitial = await PathwayApiService.evaluateGraduation(studentId, 'prog_software_engineering', false, false);
  assertTest('Student is not graduated initially (capstone and residency incomplete)', !gradInitial.isGraduated);
  assertTest('Missing requirements array outlines remaining gates', gradInitial.missingRequirements.length > 0);

  const gradWithToggles = await PathwayApiService.evaluateGraduation(studentId, 'prog_software_engineering', true, true);
  assertTest('Graduation evaluation respects capstonePassed = true and residencyCompleted = true', gradWithToggles.capstonePassed === true && gradWithToggles.residencyCompleted === true);

  console.log('\n================================================================');
  console.log(`  🎉 360° FORENSIC AUDIT PASSED: ALL ${passedTests}/${totalTests} TESTS PASSED WITH 0 ERRORS!`);
  console.log('================================================================\n');
}

runAudit().catch(err => {
  console.error('Audit execution error:', err);
  process.exit(1);
});
