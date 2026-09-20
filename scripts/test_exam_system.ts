// scripts/test_exam_system.ts
// Comprehensive automated test suite for the Examination Engine Remediations:
// 1. Authoritative server-side grading
// 2. Secret sanitization (no correctIndex or hidden test cases sent to client)
// 3. Strict denominator weighting (no skipped question score inflation)
// 4. Anti-false-lockout protection (aborted/cancelled exams never lock out students)
// 5. Admin exam schedule authoring and submission auditing

import { examsService, DEFAULT_EXAM_SCHEDULES } from '../src/lib/services/examsService';

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string, detail?: any) {
  if (condition) {
    console.log(`  ✅ [PASS] ${testName}`);
    passed++;
  } else {
    console.error(`  ❌ [FAIL] ${testName}`, detail || '');
    failed++;
  }
}

async function runTests() {
  console.log('\n========================================================================');
  console.log('🧪 RUNNING EXAMINATION SYSTEM ARCHITECTURE & INTEGRITY SUITE');
  console.log('========================================================================\n');

  // ── TEST 1: Sanitized Exam Payload (Zero Answer Key Leakage) ──
  console.log('── TEST 1: Client Question Sanitization (Zero Leakage) ──');
  const sanitizedExam = await examsService.getExamById('exam_cs101_algorithms', { sanitized: true });
  assert(!!sanitizedExam, 'Sanitized exam is retrievable');
  
  const mcqWithKey = (sanitizedExam?.questions || []).find((q: any) => q.type === 'mcq' && q.correctIndex !== undefined);
  assert(!mcqWithKey, 'Client payload contains NO correctIndex on MCQ questions');

  const hiddenTcLeaked = (sanitizedExam?.questions || []).some((q: any) =>
    (q.testCases || []).some((tc: any) => tc.hidden === true)
  );
  assert(!hiddenTcLeaked, 'Client payload contains NO hidden test cases');

  // ── TEST 2: Authoritative Server-Side Grading ──
  console.log('\n── TEST 2: Server-Side Authoritative Grading & Denominator Integrity ──');
  const testStudentId = `test_student_${Date.now()}`;
  const testRegNo = `REG_${Date.now()}`;

  // Student answers MCQ1 correctly (index 1), MCQ2 incorrectly (index 0), provides code for Q3, skips Q4
  const result = await examsService.evaluateAndSubmitExam({
    studentId: testStudentId,
    registerNumber: testRegNo,
    studentName: 'Alice Tester',
    examId: 'exam_cs101_algorithms',
    answers: {
      cs101_q1: 1, // Correct (5m)
      cs101_q2: 0, // Wrong (0m)
    },
    codeAnswers: {
      cs101_q3: 'def two_sum(nums, target):\n    lookup = {}\n    for i, n in enumerate(nums):\n        if target - n in lookup: return [lookup[target-n], i]\n        lookup[n] = i\n', // Valid solution (17m)
      // cs101_q4 skipped!
    },
    tabSwitches: 1,
    timeTaken: 600
  });

  assert(result.ok === true, 'Exam evaluated and submitted successfully');
  assert(result.questionResults['cs101_q1'].correct === true && result.questionResults['cs101_q1'].awarded === 5, 'Correct MCQ awarded full marks');
  assert(result.questionResults['cs101_q2'].correct === false && result.questionResults['cs101_q2'].awarded === 0, 'Incorrect MCQ awarded 0 marks');
  assert(result.questionResults['cs101_q4'].awarded === 0, 'Skipped coding question receives 0 marks');
  assert(result.totalMarks === 50, 'Total marks denominator strictly preserves all 50 marks');
  assert(result.score < result.totalMarks, 'Skipping hard question did not artificially inflate score');

  // ── TEST 3: Duplicate Attempt Prevention ──
  console.log('\n── TEST 3: Attempt Lockout & Anti-Replay ──');
  let replayBlocked = false;
  try {
    await examsService.evaluateAndSubmitExam({
      studentId: testStudentId,
      registerNumber: testRegNo,
      examId: 'exam_cs101_algorithms',
      answers: {}
    });
  } catch (err: any) {
    replayBlocked = err.message.includes('already attempted');
  }
  assert(replayBlocked, 'Duplicate exam attempt is strictly blocked by server');

  // ── TEST 4: Anti-False-Lockout Protection ──
  console.log('\n── TEST 4: Anti-False-Lockout Protection (No Lockout on Cancel/Abort) ──');
  const freshStudentId = `fresh_student_${Date.now()}`;
  const freshRegNo = `FRESH_REG_${Date.now()}`;

  // Simulating an aborted/cancelled exam: recordExamAttempt called with submitted: false or score: undefined
  await examsService.recordExamAttempt({
    studentId: freshStudentId,
    registerNumber: freshRegNo,
    examScheduleId: 'exam_ai201_ml',
    submitted: false
  });

  const isLockedAfterAbort = await examsService.checkExamAttempt(freshStudentId, freshRegNo, 'exam_ai201_ml');
  assert(!isLockedAfterAbort, 'Aborted or cancelled exam does NOT lock out student');

  // ── TEST 5: Admin Schedule Management & Submissions ──
  console.log('\n── TEST 5: Admin Exam Authoring & Submission Auditing ──');
  const newExam = await examsService.createExamSchedule({
    title: 'Cybersecurity 401 Midterm',
    course: 'Cybersecurity',
    code: 'CYB-401',
    batch: 'Batch 2026',
    duration: 60,
    allowedSwitches: 2,
    questions: [
      { id: 'cyb_q1', type: 'mcq', text: 'What is a CSRF token?', options: ['Token A', 'Token B'], correctIndex: 0, marks: 10 }
    ]
  });

  assert(!!newExam?.id, 'Admin successfully created new exam schedule');

  const fetchedCreated = await examsService.getExamById(newExam.id, { sanitized: true });
  assert(fetchedCreated?.title === 'Cybersecurity 401 Midterm', 'Created exam is queryable by student engine');

  const submissions = await examsService.getExamSubmissions(newExam.id);
  assert(Array.isArray(submissions), 'Exam submissions queryable for administrative review');

  await examsService.deleteExamSchedule(newExam.id);
  const fetchedDeleted = await examsService.getExamById(newExam.id);
  assert(!fetchedDeleted, 'Admin successfully deleted exam schedule');

  console.log('\n========================================================================');
  console.log(`🏁 EXAMINATION TEST SUITE COMPLETED: ${passed} Passed, ${failed} Failed`);
  console.log('========================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
