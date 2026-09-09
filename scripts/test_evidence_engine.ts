// scripts/test_evidence_engine.ts
// Comprehensive Behavioral, Hash-Chaining, Append-Only, and Adversarial Test Suite for Evidence Ledger

import {
  evidenceLedger,
  canonicalSerialize,
  computeEvidenceHash,
  verifyEvidenceRecordHash,
  verifyStudentEvidenceChain,
  EvidenceRecord,
  CanonicalEvidencePayload,
  GENESIS_EVIDENCE_HASH,
  Assessment,
  AssessmentAttempt,
  AssessmentResult,
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

async function runEvidenceEngineTestSuite() {
  console.log('\n========================================================================');
  console.log('⛓️ RUNNING PINIT BUILD 04: EVIDENCE LEDGER & HASH CHAINING TEST SUITE');
  console.log('========================================================================\n');

  // Sample Mock Domain Objects for Evidence Creation
  const dummyAssessment: Assessment = {
    id: 'asm-py-dbg-001',
    assessmentCode: 'ASM-P1-001',
    title: 'CLI Path Parser Diagnostics',
    description: 'Diagnoses path resolution defects',
    type: 'DEBUGGING',
    mode: 'SUMMATIVE',
    version: '1.0.0',
    status: 'PUBLISHED',
    difficulty: 'BEGINNER',
    timeLimitMinutes: 20,
    attemptPolicy: 'LIMITED_BEST',
    maxAttempts: 3,
    passingScore: 75,
    targetCompetencyId: 'comp-pfs-001',
    items: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const dummyAttempt: AssessmentAttempt = {
    id: 'att-studentA-01',
    studentId: 'student-charlie-101',
    assessmentId: 'asm-py-dbg-001',
    assessmentVersion: '1.0.0',
    attemptNumber: 1,
    startedAt: new Date().toISOString(),
    submittedAt: new Date().toISOString(),
    status: 'EVALUATED',
    integrityFlag: 'VALID',
    rawSubmissions: {},
  };

  const dummyResult: AssessmentResult = {
    id: 'res-att-studentA-01',
    attemptId: 'att-studentA-01',
    studentId: 'student-charlie-101',
    assessmentId: 'asm-py-dbg-001',
    assessmentVersion: '1.0.0',
    rawScore: 85,
    maxScore: 100,
    normalizedScore: 85,
    passed: true,
    status: 'PASS',
    mandatoryCriteriaMet: true,
    hasCriticalFailures: false,
    criticalFailureReasons: [],
    integrityStatus: 'VALID',
    itemResults: [],
    feedback: 'Passed with high score',
    evaluatedAt: new Date().toISOString(),
    evaluatorType: 'DETERMINISTIC',
    targetCompetencyId: 'comp-pfs-001',
  };

  // ── GROUP 1: Canonical Serialization & Hash Stability ──
  console.log('── GROUP 1: Canonical Serialization & Hash Stability ──');

  const objA = { z: 1, a: 'test', m: { b: 2, a: 1 } };
  const objB = { a: 'test', m: { a: 1, b: 2 }, z: 1 };
  assert(canonicalSerialize(objA) === canonicalSerialize(objB), 'Canonical JSON produces identical output regardless of key insertion order');

  const payload: CanonicalEvidencePayload = {
    studentId: 'student-charlie-101',
    courseId: 'course-python-fullstack',
    phaseId: 'phase-pfs-01',
    monthId: 'month-pfs-01',
    weekId: 'week-pfs-m1-w1',
    packetId: 'pkt-p1-m1-w1-001',
    dayId: 'day-001-d2',
    competencyId: 'comp-pfs-001',
    evidenceType: 'DEBUGGING_RESULT',
    provenance: {
      sourceType: 'SUMMATIVE',
      assessmentId: 'asm-py-dbg-001',
      assessmentVersion: '1.0.0',
      attemptId: 'att-studentA-01',
      evaluationVersion: '1.0.0',
      evaluatorType: 'DETERMINISTIC',
      verificationMethod: 'AUTOMATED_DETERMINISTIC',
    },
    assessmentSnapshot: {
      rawScore: 85,
      maxScore: 100,
      normalizedScore: 85,
      passed: true,
      mandatoryCriteriaMet: true,
      hasCriticalFailures: false,
      criticalFailureReasons: [],
    },
    createdAt: '2026-09-02T06:00:00.000Z',
  };

  const hash1 = computeEvidenceHash(payload, GENESIS_EVIDENCE_HASH, 1, 'evi-001', 1);
  const hash2 = computeEvidenceHash(payload, GENESIS_EVIDENCE_HASH, 1, 'evi-001', 1);
  assert(hash1 === hash2 && hash1.length === 64, 'SHA-256 hash generation is deterministic and 64-char hex');

  // Modifying score changes hash
  const tamperedPayload = {
    ...payload,
    assessmentSnapshot: { ...payload.assessmentSnapshot, normalizedScore: 99 },
  };
  const tamperedHash = computeEvidenceHash(tamperedPayload, GENESIS_EVIDENCE_HASH, 1, 'evi-001', 1);
  assert(hash1 !== tamperedHash, 'Tampering score by +14 points produces completely different hash');

  // ── GROUP 2: Sequential Hash Chaining in Ledger ──
  console.log('\n── GROUP 2: Sequential Hash Chaining in Ledger ──');
  const studentId = 'student-charlie-101';

  // Record Block 1 (Genesis block)
  const evi1 = evidenceLedger.recordAssessmentEvidence({
    studentId,
    courseId: 'course-python-fullstack',
    phaseId: 'phase-pfs-01',
    monthId: 'month-pfs-01',
    weekId: 'week-pfs-m1-w1',
    packetId: 'pkt-p1-m1-w1-001',
    dayId: 'day-001-d2',
    competencyId: 'comp-pfs-001',
    evidenceType: 'DEBUGGING_RESULT',
    sourceType: 'SUMMATIVE',
    assessment: dummyAssessment,
    attempt: dummyAttempt,
    result: dummyResult,
    provenance: {
      evaluatorType: 'DETERMINISTIC',
      verificationMethod: 'AUTOMATED_DETERMINISTIC',
    },
  });

  assert(evi1.integritySequence === 1, 'Block 1 has sequence = 1');
  assert(evi1.previousEvidenceHash === GENESIS_EVIDENCE_HASH, 'Block 1 links to GENESIS_EVIDENCE_HASH');
  assert(verifyEvidenceRecordHash(evi1), 'Block 1 internal SHA-256 hash is verified');

  // Record Block 2
  const evi2 = evidenceLedger.recordAssessmentEvidence({
    studentId,
    courseId: 'course-python-fullstack',
    phaseId: 'phase-pfs-01',
    monthId: 'month-pfs-01',
    weekId: 'week-pfs-m1-w1',
    packetId: 'pkt-p1-m1-w1-001',
    dayId: 'day-001-d3',
    competencyId: 'comp-pfs-001',
    evidenceType: 'TRANSFER_RESULT',
    sourceType: 'SUMMATIVE',
    assessment: { ...dummyAssessment, id: 'asm-py-trf-001', assessmentCode: 'ASM-P1-002' },
    attempt: { ...dummyAttempt, id: 'att-studentA-02', attemptNumber: 2 },
    result: { ...dummyResult, id: 'res-att-studentA-02', normalizedScore: 92 },
    provenance: {
      evaluatorType: 'DETERMINISTIC',
      verificationMethod: 'AUTOMATED_DETERMINISTIC',
    },
  });

  assert(evi2.integritySequence === 2, 'Block 2 has sequence = 2');
  assert(evi2.previousEvidenceHash === evi1.evidenceHash, 'Block 2 previousEvidenceHash matches Block 1 evidenceHash');
  assert(verifyEvidenceRecordHash(evi2), 'Block 2 internal SHA-256 hash is verified');

  // Record Block 3 (Certification Grade Evidence)
  const evi3 = evidenceLedger.recordAssessmentEvidence({
    studentId,
    courseId: 'course-python-fullstack',
    phaseId: 'phase-pfs-01',
    monthId: 'month-pfs-01',
    weekId: 'week-pfs-m1-w1',
    packetId: 'pkt-p1-m1-w1-001',
    dayId: 'day-001-d3',
    competencyId: 'comp-pfs-001',
    evidenceType: 'SECURITY_RESULT',
    sourceType: 'CERTIFICATION',
    assessment: { ...dummyAssessment, id: 'asm-py-sec-001', assessmentCode: 'ASM-P1-003' },
    attempt: { ...dummyAttempt, id: 'att-studentA-03', attemptNumber: 3 },
    result: { ...dummyResult, id: 'res-att-studentA-03', normalizedScore: 95 },
    provenance: {
      evaluatorType: 'DETERMINISTIC',
      verificationMethod: 'AUTOMATED_DETERMINISTIC',
    },
  });

  assert(evi3.integritySequence === 3, 'Block 3 has sequence = 3');
  assert(evi3.previousEvidenceHash === evi2.evidenceHash, 'Block 3 previousEvidenceHash matches Block 2 evidenceHash');

  // Verify Entire 3-Block Chain
  const auditReport = evidenceLedger.auditStudentEvidenceChain(studentId);
  assert(auditReport.isValidChain === true, 'Entire 3-block student evidence chain is cryptographically valid');
  assert(auditReport.totalRecords === 3, 'Ledger contains 3 chained records');
  assert(auditReport.verifiedCount === 3, 'All 3 records are in VERIFIED state');

  // ── GROUP 3: Tamper Detection & Broken Chain Audit ──
  console.log('\n── GROUP 3: Tamper Detection & Broken Chain Audit ──');

  // Tamper Attack 3.1: Modify score in Block 2
  const tamperedChain: EvidenceRecord[] = [
    { ...evi1 },
    {
      ...evi2,
      assessmentSnapshot: { ...evi2.assessmentSnapshot, normalizedScore: 100 }, // Forged score
    },
    { ...evi3 },
  ];
  const brokenScoreAudit = verifyStudentEvidenceChain(tamperedChain, studentId);
  assert(!brokenScoreAudit.isValidChain, 'Auditor successfully detects tampered score in Block 2');
  assert(brokenScoreAudit.brokenLinkIndex === 1, 'Auditor pinpoints exact broken link index (Index 1 / Block 2)');

  // Tamper Attack 3.2: Break previousEvidenceHash link in Block 3
  const tamperedLinkChain: EvidenceRecord[] = [
    { ...evi1 },
    { ...evi2 },
    { ...evi3, previousEvidenceHash: 'FORGED_INVALID_HASH_00000000000000000000000000000000000000000000' },
  ];
  const brokenLinkAudit = verifyStudentEvidenceChain(tamperedLinkChain, studentId);
  assert(!brokenLinkAudit.isValidChain, 'Auditor successfully detects broken hash link at Block 3');

  // Tamper Attack 3.3: Attempt to inject foreign student record into chain
  const foreignChain: EvidenceRecord[] = [
    { ...evi1 },
    { ...evi2, studentId: 'student-impostor-999' },
    { ...evi3 },
  ];
  const foreignAudit = verifyStudentEvidenceChain(foreignChain, studentId);
  assert(!foreignAudit.isValidChain, 'Auditor rejects chain containing foreign student record');

  // ── GROUP 4: Append-Only & Immutability Enforcement ──
  console.log('\n── GROUP 4: Append-Only & Immutability Enforcement ──');

  assertThrows(
    () => evidenceLedger.updateRecord(),
    'EVIDENCE_UPDATE_FORBIDDEN',
    'Rejects direct update of evidence records (Append-Only enforced)'
  );

  assertThrows(
    () => evidenceLedger.deleteRecord(),
    'EVIDENCE_DELETE_FORBIDDEN',
    'Rejects direct deletion of evidence records'
  );

  // ── GROUP 5: Revocation & Auditable Lifecycle Events ──
  console.log('\n── GROUP 5: Revocation & Auditable Lifecycle Events ──');

  const revEvent = evidenceLedger.revokeEvidence(
    evi2.id,
    'Plagiarism detected in code review audit',
    'examiner-prof-oak',
    'REVOKED'
  );
  assert(revEvent.eventType === 'EVIDENCE_REVOKED', 'Recorded auditable EVIDENCE_REVOKED lifecycle event');

  const updatedEvi2 = evidenceLedger.getEvidenceById(evi2.id);
  assert(updatedEvi2?.status === 'REVOKED', 'Evidence status transitioned to REVOKED');
  assert(updatedEvi2?.revocationReason === 'Plagiarism detected in code review audit', 'Revocation reason preserved');

  const trail = evidenceLedger.getAuditTrail(evi2.id);
  assert(trail.length === 2, 'Audit trail contains both EVIDENCE_CREATED and EVIDENCE_REVOKED events');
  assert(trail[1].actorId === 'examiner-prof-oak', 'Audit trail identifies the examiner');

  // ── GROUP 6: Formative vs Certification Source Isolation ──
  console.log('\n── GROUP 6: Formative vs Certification Source Isolation ──');

  const certOnlyEvidence = evidenceLedger.getStudentEvidence(studentId, { onlyCertification: true });
  assert(certOnlyEvidence.length === 1 && certOnlyEvidence[0].id === evi3.id, 'Query with onlyCertification=true isolates high-stakes certification evidence');

  console.log('\n========================================================================');
  console.log(`🏁 TEST SUITE FINISHED: ${testsPassed} Passed, ${testsFailed} Failed`);
  console.log('========================================================================\n');

  if (testsFailed > 0) {
    process.exit(1);
  }
}

runEvidenceEngineTestSuite().catch((err) => {
  console.error('[FATAL ERROR IN EVIDENCE TEST RUNNER]', err);
  process.exit(1);
});
