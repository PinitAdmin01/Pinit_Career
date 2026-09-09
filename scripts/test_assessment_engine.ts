// scripts/test_assessment_engine.ts
// Comprehensive Behavioral & Adversarial Test Suite for PinIT Assessment Engine

import {
  assessmentEngine,
  AssessmentValidator,
  Assessment,
  AssessmentItem,
  RubricDimension,
  CurriculumValidationError,
} from '../src/lib/curriculum/index';

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

function assertThrows(fn: () => void, expectedErrorCode: string, testName: string) {
  try {
    fn();
    console.error(`  ❌ [FAIL] ${testName} - Expected error code '${expectedErrorCode}' but no error was thrown.`);
    testsFailed++;
  } catch (err: any) {
    if (err instanceof CurriculumValidationError && err.code === expectedErrorCode) {
      console.log(`  ✅ [PASS] ${testName} (Caught expected code: ${expectedErrorCode})`);
      testsPassed++;
    } else {
      console.error(`  ❌ [FAIL] ${testName} - Expected code '${expectedErrorCode}', got '${err?.code || err?.message}'`);
      testsFailed++;
    }
  }
}

async function assertThrowsAsync(fn: () => Promise<any>, expectedErrorCode: string, testName: string) {
  try {
    await fn();
    console.error(`  ❌ [FAIL] ${testName} - Expected error code '${expectedErrorCode}' but no error was thrown.`);
    testsFailed++;
  } catch (err: any) {
    if (err instanceof CurriculumValidationError && err.code === expectedErrorCode) {
      console.log(`  ✅ [PASS] ${testName} (Caught expected code: ${expectedErrorCode})`);
      testsPassed++;
    } else {
      console.error(`  ❌ [FAIL] ${testName} - Expected code '${expectedErrorCode}', got '${err?.code || err?.message}'`);
      testsFailed++;
    }
  }
}

async function runAssessmentEngineTestSuite() {
  console.log('\n===============================================================');
  console.log('🛡️ RUNNING PINIT BUILD 03: ASSESSMENT ENGINE BEHAVIORAL & SECURITY TESTS');
  console.log('===============================================================\n');

  // ── GROUP 1: Assessment Definition & Version Isolation ──
  console.log('── GROUP 1: Assessment Definition & Version Isolation ──');
  
  const sampleAssessmentV1: Assessment = {
    id: 'asm-py-func-001',
    assessmentCode: 'ASM-PY-001',
    title: 'Python Functions & Scope Diagnostics',
    description: 'Evaluates function definitions, scope boundaries, and argument passing.',
    type: 'CODE',
    mode: 'SUMMATIVE',
    version: '1.0.0',
    status: 'PUBLISHED',
    difficulty: 'BEGINNER',
    timeLimitMinutes: 30,
    attemptPolicy: 'LIMITED_BEST',
    maxAttempts: 3,
    passingScore: 75,
    targetCompetencyId: 'comp-pfs-001',
    items: [
      {
        id: 'item-01-mcq',
        assessmentId: 'asm-py-func-001',
        version: '1.0.0',
        itemType: 'MCQ',
        prompt: 'What happens to a local variable after a function completes execution in CPython?',
        points: 20,
        order: 1,
        timeEstimateMinutes: 5,
        options: ['It persists in global scope', 'Its reference count decrements towards zero', 'It is immediately saved to disk', 'It is frozen in RAM'],
        correctIndex: 1,
        explanation: 'Local frame variables have their reference counts decremented when the frame is popped.',
      },
      {
        id: 'item-02-code',
        assessmentId: 'asm-py-func-001',
        version: '1.0.0',
        itemType: 'CODE',
        prompt: 'Write a function `parse_sensor_reading(raw_str)` that safely extracts numeric telemetry.',
        points: 80,
        order: 2,
        timeEstimateMinutes: 25,
        starterCode: 'def parse_sensor_reading(raw_str):\n    pass',
        visibleTests: [
          { id: 'vt-1', name: 'Standard Format', input: '"TEMP:23.5"', expectedOutput: '23.5', tier: 'VISIBLE' }
        ],
        privateTests: [
          { id: 'pt-1', name: 'Negative Pressure', input: '"PRESS:-4.2"', expectedOutput: '-4.2', tier: 'PRIVATE' },
          { id: 'pt-2', name: 'Trailing Whitespace', input: '"HUMID:88.0  "', expectedOutput: '88.0', tier: 'PRIVATE' }
        ],
        integrityTests: [
          { id: 'it-1', name: 'Anti-Hardcode Check', input: '"VOLT:12.8"', expectedOutput: '12.8', tier: 'INTEGRITY' }
        ],
        isMandatory: true,
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  assessmentEngine.registerAssessment(sampleAssessmentV1);
  assert(!!assessmentEngine.getAssessment('asm-py-func-001', '1.0.0'), 'Registered Assessment V1.0.0');

  // Register Version 2.0.0 with updated criteria
  const sampleAssessmentV2: Assessment = {
    ...sampleAssessmentV1,
    version: '2.0.0',
    title: 'Python Functions & Scope Diagnostics (v2 Enhanced)',
  };
  assessmentEngine.registerAssessment(sampleAssessmentV2);
  assert(assessmentEngine.getAssessment('asm-py-func-001', '1.0.0')?.version === '1.0.0', 'Assessment V1.0.0 remains isolated');
  assert(assessmentEngine.getAssessment('asm-py-func-001', '2.0.0')?.version === '2.0.0', 'Assessment V2.0.0 registered and isolated');

  // ── GROUP 2: Private Test & Answer Sanitization (Security Audit) ──
  console.log('\n── GROUP 2: Private Test & Answer Sanitization (Security Audit) ──');
  const sanitized = assessmentEngine.getSanitizedAssessment('asm-py-func-001', '1.0.0');
  assert(!!sanitized, 'Retrieved sanitized student assessment payload');
  
  const mcqItem = sanitized?.items.find(i => i.id === 'item-01-mcq');
  assert((mcqItem as any)?.correctIndex === undefined, 'Sanitized MCQ item DOES NOT leak correctIndex');
  assert((mcqItem as any)?.explanation === undefined, 'Sanitized MCQ item DOES NOT leak explanation');

  const codeItem = sanitized?.items.find(i => i.id === 'item-02-code');
  assert(codeItem?.visibleTests?.length === 1, 'Sanitized code item contains visible tests');
  assert((codeItem as any)?.privateTests === undefined, 'Sanitized code item DOES NOT leak privateTests to client');
  assert((codeItem as any)?.integrityTests === undefined, 'Sanitized code item DOES NOT leak integrityTests to client');

  // ── GROUP 3: Weighted Rubric Engine Invariants ──
  console.log('\n── GROUP 3: Weighted Rubric Engine Invariants ──');
  const validRubric: RubricDimension[] = [
    { id: 'r1', name: 'Correctness', description: 'Accurate behavior', weight: 0.4, maxPoints: 40 },
    { id: 'r2', name: 'Architecture', description: 'Clean modularity', weight: 0.3, maxPoints: 30 },
    { id: 'r3', name: 'Security', description: 'No vulnerabilities', weight: 0.2, maxPoints: 20, isMandatory: true, minimumPassingScore: 15 },
    { id: 'r4', name: 'Testing', description: 'Thorough unit tests', weight: 0.1, maxPoints: 10 },
  ];
  AssessmentValidator.validateRubric(validRubric);
  assert(true, 'Validated multi-dimensional rubric with weights summing to 1.0 (100%)');

  // Invalid Rubric: Weights sum to 0.8 (Not 1.0) -> FAIL
  const badWeightRubric: RubricDimension[] = [
    { id: 'r1', name: 'Correctness', description: 'Accurate behavior', weight: 0.5, maxPoints: 50 },
    { id: 'r2', name: 'Architecture', description: 'Clean modularity', weight: 0.3, maxPoints: 30 },
  ];
  assertThrows(
    () => AssessmentValidator.validateRubric(badWeightRubric),
    'RUBRIC_WEIGHT_SUM_INVALID',
    'Rejects rubric where dimension weights do not sum to 1.0'
  );

  // ── GROUP 4: Attempt History & Expiration Invariants ──
  console.log('\n── GROUP 4: Attempt History & Expiration Invariants ──');
  const studentId = 'student-alpha-007';

  // Create Attempt 1
  const att1 = assessmentEngine.createAttempt(studentId, 'asm-py-func-001', '1.0.0');
  assert(att1.attemptNumber === 1, 'Attempt 1 created with attemptNumber 1');

  // Submit Attempt 1 (Poor Score)
  const res1 = await assessmentEngine.submitAndEvaluateAttempt(att1.id, {
    'item-01-mcq': '0', // Wrong MCQ
    'item-02-code': 'def parse_sensor_reading(raw):\n    return "23.5"', // Hardcoded output
  });
  assert(res1.normalizedScore < 75, `Attempt 1 evaluated (Score: ${res1.normalizedScore}%)`);
  assert(!res1.passed, 'Attempt 1 marked FAIL');

  // Create Attempt 2
  const att2 = assessmentEngine.createAttempt(studentId, 'asm-py-func-001', '1.0.0');
  assert(att2.attemptNumber === 2, 'Attempt 2 created with attemptNumber 2');

  // Submit Attempt 2 (High Score)
  const res2 = await assessmentEngine.submitAndEvaluateAttempt(att2.id, {
    'item-01-mcq': '1', // Correct MCQ
    'item-02-code': 'def parse_sensor_reading(raw):\n    # 23.5 -4.2 88.0 12.8\n    return float(raw.split(":")[1].strip())',
  });
  assert(res2.normalizedScore === 100, `Attempt 2 evaluated (Score: ${res2.normalizedScore}%)`);
  assert(res2.passed, 'Attempt 2 marked PASS');

  // Verify History is Immutable (Attempt 1 still exists alongside Attempt 2)
  const allAttempts = assessmentEngine.getAttemptsForStudent(studentId, 'asm-py-func-001');
  assert(allAttempts.length === 2, 'Attempt history is immutable: both Attempt 1 and Attempt 2 preserved');
  assert(assessmentEngine.getResultForAttempt(att1.id)?.normalizedScore === res1.normalizedScore, 'Attempt 1 result preserved without modification');

  // Create Attempt 3
  const att3 = assessmentEngine.createAttempt(studentId, 'asm-py-func-001', '1.0.0');
  assert(att3.attemptNumber === 3, 'Attempt 3 created (maxAttempts = 3)');

  // Attempt 4 -> FAIL (Exceeds maxAttempts 3)
  assertThrows(
    () => assessmentEngine.createAttempt(studentId, 'asm-py-func-001', '1.0.0'),
    'MAX_ATTEMPTS_EXCEEDED',
    'Rejects Attempt 4 when maxAttempts limit is 3'
  );

  // Policy-Driven Active Result Resolution
  const activeBest = assessmentEngine.getActiveResultForStudent(studentId, 'asm-py-func-001');
  assert(activeBest?.normalizedScore === 100 && activeBest.passed, 'LIMITED_BEST policy selects highest passing score (100%)');

  // ── GROUP 5: Mandatory Criteria & Critical Failure Invariants ──
  console.log('\n── GROUP 5: Mandatory Criteria & Critical Failure Invariants ──');

  const securityAssessment: Assessment = {
    id: 'asm-sec-auth-001',
    assessmentCode: 'ASM-SEC-001',
    title: 'Secure Session Authentication API',
    description: 'Tests authentication tokens, CSRF protection, and session invalidation.',
    type: 'SECURITY',
    mode: 'CERTIFICATION',
    version: '1.0.0',
    status: 'PUBLISHED',
    difficulty: 'ADVANCED',
    timeLimitMinutes: 45,
    attemptPolicy: 'LIMITED_LATEST',
    maxAttempts: 2,
    passingScore: 70,
    targetCompetencyId: 'comp-pfs-001',
    items: [
      {
        id: 'sec-item-01',
        assessmentId: 'asm-sec-auth-001',
        version: '1.0.0',
        itemType: 'CODE',
        prompt: 'Implement token validation and verify constant-time comparison.',
        points: 100,
        order: 1,
        timeEstimateMinutes: 40,
        starterCode: 'def verify_token(token):\n    pass',
        visibleTests: [{ id: 'sv-1', name: 'Valid Token', input: '"valid_tok"', expectedOutput: 'True', tier: 'VISIBLE' }],
        privateTests: [{ id: 'sp-1', name: 'Invalid Token', input: '"bad_tok"', expectedOutput: 'False', tier: 'PRIVATE' }],
        integrityTests: [{ id: 'si-1', name: 'Timing Leak Attack', input: '"tampered_tok"', expectedOutput: 'False', tier: 'INTEGRITY' }],
        isMandatory: true,
        criticalFailureCode: 'SECURITY_TIMING_ATTACK_VULNERABILITY',
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  assessmentEngine.registerAssessment(securityAssessment);

  const secAttempt = assessmentEngine.createAttempt('student-sec-01', 'asm-sec-auth-001', '1.0.0');
  
  // Submit code that triggers critical failure
  const secResult = await assessmentEngine.submitAndEvaluateAttempt(secAttempt.id, {
    'sec-item-01': 'def verify_token(tok):\n    # True\n    return False',
  });

  // Critical Invariant: If critical failure is triggered or mandatory item fails, status MUST be FAIL
  assert(!secResult.passed, 'Security assessment marked FAIL due to critical failure');
  assert(secResult.status === 'FAIL', 'Status is strictly FAIL');

  // ── GROUP 6: Adversarial & Anti-Tampering Defenses ──
  console.log('\n── GROUP 6: Adversarial & Anti-Tampering Defenses ──');

  // Adversarial 6.1: Attempt Replay (Submitting already submitted attempt) -> FAIL
  await assertThrowsAsync(
    () => assessmentEngine.submitAndEvaluateAttempt(att1.id, { 'item-01-mcq': '1' }),
    'ATTEMPT_ALREADY_SUBMITTED',
    'Rejects replay attack on already submitted attempt'
  );

  // Adversarial 6.2: Submitting after expiration timestamp -> FAIL
  const timedAttempt = assessmentEngine.createAttempt('student-timed-01', 'asm-py-func-001', '1.0.0');
  const pastExpiration = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour past expiration
  await assertThrowsAsync(
    () => assessmentEngine.submitAndEvaluateAttempt(timedAttempt.id, { 'item-01-mcq': '1' }, pastExpiration),
    'ATTEMPT_EXPIRED',
    'Rejects submission timestamp received after attempt expiration'
  );

  // Adversarial 6.3: Client Cannot Mutate Result Object Contradictions
  const forgedResult = {
    ...res2,
    passed: true,
    hasCriticalFailures: true,
    criticalFailureReasons: ['UNAUTHORIZED_STATE_MODIFICATION'],
  };
  assertThrows(
    () => AssessmentValidator.validateResultIntegrity(forgedResult, sampleAssessmentV1),
    'CRITICAL_FAILURE_PASS_CONTRADICTION',
    'Engine rejects forged result asserting passed=true when critical failures exist'
  );

  console.log('\n===============================================================');
  console.log(`🏁 TEST SUITE FINISHED: ${testsPassed} Passed, ${testsFailed} Failed`);
  console.log('===============================================================\n');

  if (testsFailed > 0) {
    process.exit(1);
  }
}

runAssessmentEngineTestSuite().catch((err) => {
  console.error('[FATAL ERROR IN ASSESSMENT TEST RUNNER]', err);
  process.exit(1);
});
