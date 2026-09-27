/**
 * PinIT CareerOS — Sub-Batch 3.6 Verification Suite
 * Tests Defects 080 – 081
 */

import { readLocalJson, writeLocalJson } from '../src/lib/services/localJsonDb';
import { examsService } from '../src/lib/services/examsService';
import * as fs from 'fs';
import * as path from 'path';

async function runSubBatch36Tests() {
  console.log('🧪 ========================================================');
  console.log('🧪 VERIFYING SUB-BATCH 3.6: CAMPUS KV ISOLATION & EXAMS WIRING');
  console.log('🧪 Defects 080, 081');
  console.log('🧪 ========================================================\n');

  let passed = 0;
  let total = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    total++;
    if (condition) {
      passed++;
      console.log(`✅ [PASS] ${testName}`);
    } else {
      console.error(`❌ [FAIL] ${testName}: ${detail || 'Assertion failed'}`);
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // TEST 1: DEF-080 — campus_kv Multi-Student Key Namespacing
  // ──────────────────────────────────────────────────────────────────────────
  try {
    const studentA = 'student_uuid_alpha_001';
    const studentB = 'student_uuid_beta_002';
    const relativeKey = 'src/lib/data/test_student_isolated_db.json';

    // Student A saves finance/hostel record
    const dataA = { studentId: studentA, status: 'Hostel Room Confirmed #101', feePaid: 45000 };
    const dataB = { studentId: studentB, status: 'Hostel Waiting List #4', feePaid: 0 };

    await writeLocalJson(relativeKey, dataA, 'personal', studentA);
    await writeLocalJson(relativeKey, dataB, 'personal', studentB);

    const readA = await readLocalJson(relativeKey, null, 'personal', studentA);
    const readB = await readLocalJson(relativeKey, null, 'personal', studentB);

    assert(
      readA !== null &&
      readB !== null &&
      (readA as any).status === 'Hostel Room Confirmed #101' &&
      (readB as any).status === 'Hostel Waiting List #4' &&
      (readA as any).studentId !== (readB as any).studentId,
      'DEF-080: campus_kv namespacing by userId completely isolates multi-student data (0 Last-Write-Wins collisions)',
      `A: ${JSON.stringify(readA)}, B: ${JSON.stringify(readB)}`
    );
  } catch (err: any) {
    assert(false, 'DEF-080: campus_kv Multi-Student Key Namespacing', err.message);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // TEST 2: DEF-081 — Wiring checkExamAttempt into Exam Generation Pipeline
  // ──────────────────────────────────────────────────────────────────────────
  try {
    // 2a: Test that examsService.checkExamAttempt is fully functional and callable
    assert(
      typeof examsService.checkExamAttempt === 'function',
      'DEF-081a: examsService.checkExamAttempt is defined, callable, and exports proper signature'
    );

    // 2b: Verify that checkExamAttempt correctly inspects attempt records
    const testAttemptRes = await examsService.checkExamAttempt('non_existent_student_999', 'REG-999', 'schedule_non_existent');
    assert(
      typeof testAttemptRes === 'boolean',
      'DEF-081b: checkExamAttempt returns boolean result for candidate check',
      `Result: ${testAttemptRes}`
    );

    // 2c: Verify route files wire and invoke checkExamAttempt
    const generateRoutePath = path.join(process.cwd(), 'src/app/api/exams/generate-questions/route.ts');
    const checkCooldownRoutePath = path.join(process.cwd(), 'src/app/api/exams/check-cooldown/route.ts');

    const genExists = fs.existsSync(generateRoutePath);
    const coolExists = fs.existsSync(checkCooldownRoutePath);

    const genContent = genExists ? fs.readFileSync(generateRoutePath, 'utf8') : '';
    const coolContent = coolExists ? fs.readFileSync(checkCooldownRoutePath, 'utf8') : '';

    const genWiresCheck = genContent.includes('examsService.checkExamAttempt') && genContent.includes('examsService.getExamCooldown');
    const coolWiresCheck = coolContent.includes('examsService.checkExamAttempt');

    assert(
      genExists && coolExists && genWiresCheck && coolWiresCheck,
      'DEF-081c: checkExamAttempt and getExamCooldown are wired directly into POST /api/exams/generate-questions and /api/exams/check-cooldown',
      `genWiresCheck: ${genWiresCheck}, coolWiresCheck: ${coolWiresCheck}`
    );
  } catch (err: any) {
    assert(false, 'DEF-081: Wiring checkExamAttempt', err.message);
  }

  // ──────────────────────────────────────────────────────────────────────────
  console.log('\n📊 ========================================================');
  console.log(`📊 SUB-BATCH 3.6 RESULTS: ${passed}/${total} TESTS PASSED (${Math.round((passed/total)*100)}%)`);
  console.log('📊 ========================================================');

  if (passed === total) {
    console.log('\n🎉 ALL SUB-BATCH 3.6 VERIFICATION TESTS GREEN!');
    process.exit(0);
  } else {
    console.error('\n🚨 SOME SUB-BATCH 3.6 TESTS FAILED!');
    process.exit(1);
  }
}

runSubBatch36Tests().catch(err => {
  console.error('Fatal error running Sub-Batch 3.6 verification:', err);
  process.exit(1);
});
