// scripts/test_batch001.ts
// Automated Quality, Pedagogical Intent, Assessment Sanitization & Verification Test Suite for PinIT Batch 001

import {
  BATCH_001_MANIFEST,
  DAY_1_MANIFEST,
  DAY_2_MANIFEST,
  DAY_3_MANIFEST,
  DAY_4_MANIFEST,
  DAY_5_MANIFEST,
  DAY_5_ASSESSMENT,
  COMPETENCY_ID_ENV_FOUNDATIONS,
} from '../src/lib/curriculum/pythonFullStack/batch001';
import { ContentValidator } from '../src/lib/curriculum/contentValidator';
import { AssessmentValidator } from '../src/lib/curriculum/assessmentValidator';
import { assessmentEngine } from '../src/lib/curriculum/assessmentEngine';
import { evidenceLedger } from '../src/lib/curriculum/evidenceLedger';
import { PYTHON_FULLSTACK_COURSE } from '../src/lib/curriculum/pythonFullStack/curriculumSpine';

let testsPassed = 0;
let testsFailed = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    console.log(`  ✅ [PASS] ${testName}`);
    testsPassed++;
  } else {
    console.error(`  ❌ [FAIL] ${testName}${detail ? ` - Detail: ${detail}` : ''}`);
    testsFailed++;
  }
}

async function runBatch001TestSuite() {
  console.log('\n========================================================================');
  console.log('📦 RUNNING PINIT BATCH 001 (DAYS 1–5) VERIFICATION TEST SUITE');
  console.log('========================================================================\n');

  // ── GROUP 1: Batch Manifest & Strict 5-Day Structure ──
  console.log('── GROUP 1: Batch Manifest & Strict 5-Day Structure ──');
  
  assert(BATCH_001_MANIFEST.batchCode === 'P1-M1-W1-BATCH001', 'Batch code is P1-M1-W1-BATCH001');
  assert(BATCH_001_MANIFEST.days.length === 5, 'Batch contains exactly 5 days (Days 1–5)');

  // Run ContentValidator on complete batch
  let batchValidationPassed = false;
  try {
    ContentValidator.validateBatchManifest(BATCH_001_MANIFEST);
    batchValidationPassed = true;
  } catch (err: any) {
    console.error('Validation error:', err);
  }
  assert(batchValidationPassed, 'ContentValidator.validateBatchManifest() passes with 0 validation errors');

  // Verify each day number and pedagogical intent
  assert(DAY_1_MANIFEST.dayNumber === 1 && DAY_1_MANIFEST.pedagogicalIntent === 'UNDERSTAND', 'Day 1 is Day 1 with UNDERSTAND intent');
  assert(DAY_2_MANIFEST.dayNumber === 2 && DAY_2_MANIFEST.pedagogicalIntent === 'APPLY', 'Day 2 is Day 2 with APPLY intent');
  assert(DAY_3_MANIFEST.dayNumber === 3 && DAY_3_MANIFEST.pedagogicalIntent === 'BUILD', 'Day 3 is Day 3 with BUILD intent');
  assert(DAY_4_MANIFEST.dayNumber === 4 && DAY_4_MANIFEST.pedagogicalIntent === 'DEBUG', 'Day 4 is Day 4 with DEBUG intent');
  assert(DAY_5_MANIFEST.dayNumber === 5 && DAY_5_MANIFEST.pedagogicalIntent === 'TRANSFER', 'Day 5 is Day 5 with TRANSFER intent');

  // ── GROUP 2: Pedagogical Content Blocks & Quality Audit ──
  console.log('\n── GROUP 2: Pedagogical Content Blocks & Quality Audit ──');

  const totalBlocks = BATCH_001_MANIFEST.days.reduce((acc, d) => acc + d.blocks.length, 0);
  assert(totalBlocks === 18, `Batch 001 contains 18 comprehensive content blocks across 5 days (Found: ${totalBlocks})`);

  // Day 1: Theory + Examples + Guided Practice + Knowledge Check + References
  const d1Types = DAY_1_MANIFEST.blocks.map(b => b.type);
  assert(d1Types.includes('THEORY') && d1Types.includes('EXAMPLE') && d1Types.includes('GUIDED_PRACTICE') && d1Types.includes('KNOWLEDGE_CHECK'), 'Day 1 contains full pedagogical scaffolding (Theory, Example, Guided Practice, Knowledge Check)');

  // Day 2: Cross-platform commands & PATH
  const d2Theory = DAY_2_MANIFEST.blocks.find(b => b.type === 'THEORY') as any;
  assert(d2Theory.whatItIs.includes('PATH'), 'Day 2 explains PATH environment variable clearly');

  // Day 3: Virtualenv isolation
  const d3Lab = DAY_3_MANIFEST.blocks.find(b => b.type === 'GUIDED_LAB') as any;
  assert(d3Lab.instructions.some((i: string) => i.includes('venv')), 'Day 3 Guided Lab includes Python virtual environment creation instructions');

  // Day 4: Realistic Debugging Challenges with Staged Hints
  const d4DebuggingBlocks = DAY_4_MANIFEST.blocks.filter(b => b.type === 'DEBUGGING_CHALLENGE') as any[];
  assert(d4DebuggingBlocks.length === 2, 'Day 4 contains 2 realistic environment debugging challenges');
  assert(d4DebuggingBlocks[0].hints.length >= 3, 'Debugging Challenge 1 provides staged progressive hints');
  assert(d4DebuggingBlocks[1].hints.length >= 3, 'Debugging Challenge 2 provides staged progressive hints');

  // ── GROUP 3: Day 5 Independent Assessment Invariants ──
  console.log('\n── GROUP 3: Day 5 Independent Assessment Invariants ──');

  let assessmentValidationPassed = false;
  try {
    AssessmentValidator.validateAssessment(DAY_5_ASSESSMENT);
    assessmentValidationPassed = true;
  } catch (err: any) {
    console.error('Assessment validation error:', err);
  }
  assert(assessmentValidationPassed, 'AssessmentValidator.validateAssessment() passes for Day 5 Assessment');

  const rubricSum = DAY_5_ASSESSMENT.items[0].rubricDimensions?.reduce((acc, r) => acc + r.weight, 0) || 0;
  assert(Math.abs(rubricSum - 1.0) < 0.0001, `Day 5 rubric weights sum exactly to 1.0 (Found: ${rubricSum})`);

  // Register in Assessment Engine
  assessmentEngine.registerAssessment(DAY_5_ASSESSMENT);
  const sanitized = assessmentEngine.getSanitizedAssessment(DAY_5_ASSESSMENT.id, DAY_5_ASSESSMENT.version);
  assert(!!sanitized, 'Sanitized Day 5 assessment generated');
  assert((sanitized?.items[0] as any).privateTests === undefined, 'Sanitized payload DOES NOT leak privateTests to client');
  assert((sanitized?.items[0] as any).integrityTests === undefined, 'Sanitized payload DOES NOT leak integrityTests to client');
  assert(sanitized?.items[0].visibleTests?.length === 2, 'Sanitized payload includes visible test cases');

  // ── GROUP 4: Assessment Attempt & Evidence Ledger Chaining ──
  console.log('\n── GROUP 4: Assessment Attempt & Evidence Ledger Chaining ──');

  const studentId = 'student-batch001-alice';
  const attempt = assessmentEngine.createAttempt(studentId, DAY_5_ASSESSMENT.id, DAY_5_ASSESSMENT.version);
  assert(attempt.studentId === studentId, 'Created valid student assessment attempt');

  // Submit and evaluate attempt
  const evalResult = await assessmentEngine.submitAndEvaluateAttempt(attempt.id, {
    'item-diag-01': `def diagnose_environment(check_paths=None):\n    import sys, os, platform\n    return {\n        "python_version": platform.python_version(),\n        "python_major_minor": sys.version_info[:2],\n        "platform_name": sys.platform,\n        "os_name": platform.system(),\n        "executable_path": sys.executable,\n        "cwd": os.getcwd(),\n        "is_virtualenv": sys.prefix != sys.base_prefix,\n        "path_directories_count": len(os.environ.get("PATH", "").split(os.pathsep)),\n        "checked_paths": {},\n        "status": "HEALTHY"\n    }`,
  });

  assert(evalResult.passed === true, 'Attempt evaluation evaluated and passed');
  assert(evalResult.normalizedScore >= 75, `Normalized score ${evalResult.normalizedScore}% meets passing threshold`);

  // Record Evidence in Append-Only Ledger
  const evidence = evidenceLedger.recordAssessmentEvidence({
    studentId,
    courseId: PYTHON_FULLSTACK_COURSE.id,
    phaseId: 'phase-pfs-01',
    monthId: 'month-pfs-01',
    weekId: 'week-pfs-m1-w1',
    packetId: BATCH_001_MANIFEST.batchId,
    dayId: 'day-001-d5',
    competencyId: COMPETENCY_ID_ENV_FOUNDATIONS,
    evidenceType: 'PRACTICAL_RESULT',
    sourceType: 'FORMATIVE',
    assessment: DAY_5_ASSESSMENT,
    attempt,
    result: evalResult,
    provenance: {
      evaluatorType: 'DETERMINISTIC',
      verificationMethod: 'AUTOMATED_DETERMINISTIC',
    },
  });

  assert(evidence.integritySequence === 1, 'Evidence record #1 appended to student ledger');
  assert(evidence.status === 'VERIFIED', 'Evidence status is marked VERIFIED');
  assert(evidence.competencyId === COMPETENCY_ID_ENV_FOUNDATIONS, 'Evidence correctly bound to competency COMP-P1-M1-001');

  const auditReport = evidenceLedger.auditStudentEvidenceChain(studentId);
  assert(auditReport.isValidChain === true, 'Student evidence chain is cryptographically verified');

  console.log('\n========================================================================');
  console.log(`🏁 BATCH 001 TEST SUITE COMPLETE: ${testsPassed} Passed, ${testsFailed} Failed`);
  console.log('========================================================================\n');

  if (testsFailed > 0) {
    process.exit(1);
  }
}

runBatch001TestSuite().catch((err) => {
  console.error('[FATAL ERROR IN BATCH 001 TEST RUNNER]', err);
  process.exit(1);
});
