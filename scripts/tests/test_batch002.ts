// scripts/test_batch002.ts
// Automated Quality, Pedagogical Progression, Assessment Sanitization & Verification Test Suite for PinIT Batch 002

import {
  BATCH_002_MANIFEST,
  DAY_6_MANIFEST,
  DAY_7_MANIFEST,
  DAY_8_MANIFEST,
  DAY_9_MANIFEST,
  DAY_10_MANIFEST,
  DAY_10_ASSESSMENT,
  COMPETENCY_ID_SYNTAX_MODEL,
} from '../src/lib/curriculum/pythonFullStack/batch002';
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

async function runBatch002TestSuite() {
  console.log('\n========================================================================');
  console.log('📦 RUNNING PINIT BATCH 002 (DAYS 6–10) VERIFICATION TEST SUITE');
  console.log('========================================================================\n');

  // ── GROUP 1: Batch Manifest & Strict 5-Day Structure ──
  console.log('── GROUP 1: Batch Manifest & Strict 5-Day Structure ──');
  
  assert(BATCH_002_MANIFEST.batchCode === 'P1-M1-W2-BATCH002', 'Batch code is P1-M1-W2-BATCH002');
  assert(BATCH_002_MANIFEST.days.length === 5, 'Batch contains exactly 5 days (Days 6–10)');

  // Run ContentValidator on complete batch
  let batchValidationPassed = false;
  try {
    ContentValidator.validateBatchManifest(BATCH_002_MANIFEST);
    batchValidationPassed = true;
  } catch (err: any) {
    console.error('Validation error:', err);
  }
  assert(batchValidationPassed, 'ContentValidator.validateBatchManifest() passes with 0 validation errors');

  // Verify each day number and pedagogical intent
  assert(DAY_6_MANIFEST.dayNumber === 1 && DAY_6_MANIFEST.pedagogicalIntent === 'UNDERSTAND', 'Day 6 is Day 1 of batch with UNDERSTAND intent');
  assert(DAY_7_MANIFEST.dayNumber === 2 && DAY_7_MANIFEST.pedagogicalIntent === 'APPLY', 'Day 7 is Day 2 of batch with APPLY intent');
  assert(DAY_8_MANIFEST.dayNumber === 3 && DAY_8_MANIFEST.pedagogicalIntent === 'BUILD', 'Day 8 is Day 3 of batch with BUILD intent');
  assert(DAY_9_MANIFEST.dayNumber === 4 && DAY_9_MANIFEST.pedagogicalIntent === 'DEBUG', 'Day 9 is Day 4 of batch with DEBUG intent');
  assert(DAY_10_MANIFEST.dayNumber === 5 && DAY_10_MANIFEST.pedagogicalIntent === 'TRANSFER', 'Day 10 is Day 5 of batch with TRANSFER intent');

  // ── GROUP 2: Pedagogical Content Blocks & Quality Audit ──
  console.log('\n── GROUP 2: Pedagogical Content Blocks & Quality Audit ──');

  const totalBlocks = BATCH_002_MANIFEST.days.reduce((acc, d) => acc + d.blocks.length, 0);
  assert(totalBlocks === 18, `Batch 002 contains 18 comprehensive content blocks across 5 days (Found: ${totalBlocks})`);

  // Day 6: Theory + Example + Guided Practice + Knowledge Check + Reference
  const d6Theory = DAY_6_MANIFEST.blocks.find(b => b.type === 'THEORY') as any;
  assert(d6Theory.mentalModel.includes('Name Tag'), 'Day 6 teaches Name-to-Object binding reference model');

  // Day 7: Precedence and division semantics
  const d7Theory = DAY_7_MANIFEST.blocks.find(b => b.type === 'THEORY') as any;
  assert(d7Theory.summary.includes('division'), 'Day 7 teaches division and operator precedence');

  // Day 8: Loop state machine
  const d8Lab = DAY_8_MANIFEST.blocks.find(b => b.type === 'GUIDED_LAB') as any;
  assert(d8Lab.instructions.some((i: string) => i.includes('running_sum')), 'Day 8 Guided Lab includes accumulator pattern');

  // Day 9: Realistic Debugging Challenges with Staged Hints
  const d9DebuggingBlocks = DAY_9_MANIFEST.blocks.filter(b => b.type === 'DEBUGGING_CHALLENGE') as any[];
  assert(d9DebuggingBlocks.length === 2, 'Day 9 contains 2 realistic control-flow/state debugging challenges');
  assert(d9DebuggingBlocks[0].hints.length >= 3, 'Debugging Challenge 1 provides staged progressive hints');
  assert(d9DebuggingBlocks[1].hints.length >= 3, 'Debugging Challenge 2 provides staged progressive hints');

  // ── GROUP 3: Day 10 Independent Assessment Invariants ──
  console.log('\n── GROUP 3: Day 10 Independent Assessment Invariants ──');

  let assessmentValidationPassed = false;
  try {
    AssessmentValidator.validateAssessment(DAY_10_ASSESSMENT);
    assessmentValidationPassed = true;
  } catch (err: any) {
    console.error('Assessment validation error:', err);
  }
  assert(assessmentValidationPassed, 'AssessmentValidator.validateAssessment() passes for Day 10 Assessment');

  const rubricSum = DAY_10_ASSESSMENT.items[0].rubricDimensions?.reduce((acc, r) => acc + r.weight, 0) || 0;
  assert(Math.abs(rubricSum - 1.0) < 0.0001, `Day 10 rubric weights sum exactly to 1.0 (Found: ${rubricSum})`);

  // Register in Assessment Engine
  assessmentEngine.registerAssessment(DAY_10_ASSESSMENT);
  const sanitized = assessmentEngine.getSanitizedAssessment(DAY_10_ASSESSMENT.id, DAY_10_ASSESSMENT.version);
  assert(!!sanitized, 'Sanitized Day 10 assessment generated');
  assert((sanitized?.items[0] as any).privateTests === undefined, 'Sanitized payload DOES NOT leak privateTests to client');
  assert((sanitized?.items[0] as any).integrityTests === undefined, 'Sanitized payload DOES NOT leak integrityTests to client');
  assert(sanitized?.items[0].visibleTests?.length === 2, 'Sanitized payload includes visible test cases');

  // ── GROUP 4: Assessment Attempt & Evidence Ledger Chaining ──
  console.log('\n── GROUP 4: Assessment Attempt & Evidence Ledger Chaining ──');

  const studentId = 'student-batch002-bob';
  const attempt = assessmentEngine.createAttempt(studentId, DAY_10_ASSESSMENT.id, DAY_10_ASSESSMENT.version);
  assert(attempt.studentId === studentId, 'Created valid student assessment attempt');

  // Submit and evaluate attempt
  const evalResult = await assessmentEngine.submitAndEvaluateAttempt(attempt.id, {
    'item-syntax-01': `def validate_telemetry_stream(raw_stream):\n    if not raw_stream:\n        return {"total_records": 0, "valid_records": 0, "anomaly_records": 0, "cumulative_weight": 0.0, "max_temperature": 0.0, "stream_status": "CRITICAL"}\n    lines = [l.strip() for l in raw_stream.strip().split('\\n') if l.strip()]\n    if not lines:\n        return {"total_records": 0, "valid_records": 0, "anomaly_records": 0, "cumulative_weight": 0.0, "max_temperature": 0.0, "stream_status": "CRITICAL"}\n    total = len(lines)\n    valid = 0\n    anomalies = 0\n    cum_weight = 0.0\n    max_temp = None\n    for line in lines:\n        parts = line.split(',')\n        if len(parts) != 4:\n            anomalies += 1\n            continue\n        try:\n            temp = float(parts[1])\n            weight = float(parts[2])\n            status = parts[3].strip()\n        except ValueError:\n            anomalies += 1\n            continue\n        if -20.0 <= temp <= 85.0 and 0.0 < weight <= 1000.0 and status == "OK":\n            valid += 1\n            cum_weight += weight\n            if max_temp is None or temp > max_temp:\n                max_temp = temp\n        else:\n            anomalies += 1\n    if anomalies == 0 and total > 0:\n        stream_status = "NORMAL"\n    elif 1 <= anomalies <= 2:\n        stream_status = "DEGRADED"\n    else:\n        stream_status = "CRITICAL"\n    return {\n        "total_records": total,\n        "valid_records": valid,\n        "anomaly_records": anomalies,\n        "cumulative_weight": round(cum_weight, 2),\n        "max_temperature": max_temp if max_temp is not None else 0.0,\n        "stream_status": stream_status\n    }`,
  });

  assert(evalResult.passed === true, 'Attempt evaluation evaluated and passed');
  assert(evalResult.normalizedScore >= 75, `Normalized score ${evalResult.normalizedScore}% meets passing threshold`);

  // Record Evidence in Append-Only Ledger
  const evidence = evidenceLedger.recordAssessmentEvidence({
    studentId,
    courseId: PYTHON_FULLSTACK_COURSE.id,
    phaseId: 'phase-pfs-01',
    monthId: 'month-pfs-01',
    weekId: 'week-pfs-m1-w2',
    packetId: BATCH_002_MANIFEST.batchId,
    dayId: 'day-002-d10',
    competencyId: COMPETENCY_ID_SYNTAX_MODEL,
    evidenceType: 'PRACTICAL_RESULT',
    sourceType: 'FORMATIVE',
    assessment: DAY_10_ASSESSMENT,
    attempt,
    result: evalResult,
    provenance: {
      evaluatorType: 'DETERMINISTIC',
      verificationMethod: 'AUTOMATED_DETERMINISTIC',
    },
  });

  assert(evidence.integritySequence === 1, 'Evidence record #1 appended to student ledger');
  assert(evidence.sourceType === 'FORMATIVE', 'Evidence correctly labeled FORMATIVE');
  assert(evidence.competencyId === COMPETENCY_ID_SYNTAX_MODEL, 'Evidence correctly bound to competency COMP-P1-M1-002');

  const auditReport = evidenceLedger.auditStudentEvidenceChain(studentId);
  assert(auditReport.isValidChain === true, 'Student evidence chain is cryptographically verified');

  console.log('\n========================================================================');
  console.log(`🏁 BATCH 002 TEST SUITE COMPLETE: ${testsPassed} Passed, ${testsFailed} Failed`);
  console.log('========================================================================\n');

  if (testsFailed > 0) {
    process.exit(1);
  }
}

runBatch002TestSuite().catch((err) => {
  console.error('[FATAL ERROR IN BATCH 002 TEST RUNNER]', err);
  process.exit(1);
});
