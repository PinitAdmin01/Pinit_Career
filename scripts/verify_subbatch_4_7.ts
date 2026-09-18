// scripts/verify_subbatch_4_7.ts
/**
 * Verification Suite for Issue 30:
 * Identity & Anti-Fraud Check, Trust Score Integrity & Unreadable Document Defenses
 * 
 * Tests:
 * 1. Three EMPTY files probe (sem1.pdf, sem2.pdf, resume.pdf) returns 0 Evidence Trust, 0 QT2, 0 ATS.
 * 2. Zero documents returns trustScore: 0 and AWAITING_UPLOADS (never 100 or SENTINEL_CLEAN).
 * 3. Single document returns trustScore: 40 and PROVISIONAL_PENDING (never 100).
 * 4. Name comparison:
 *    - "Rahul Kumar" vs "Amit Kumar" -> isMatch: false.
 *    - "Priya Sharma" vs "Neha Sharma" -> isMatch: false.
 *    - Any name vs empty string "" -> isMatch: false (confidence: 0).
 *    - "Rohan Sharma" vs "R. Sharma" -> isMatch: true.
 * 5. Mismatch marked as REVIEW_REQUIRED (not fraud).
 * 6. Legitimate documents with extracted content and provenance earn real trust scores.
 */

import {
  checkNameSimilarity,
  auditDocumentCollection,
  calculateLiveQTMetrics,
  VaultDocumentSlot
} from '../src/lib/ats/documentAuditEngine';
import { evaluateQT2Model } from '../src/lib/ats/qt2AnalysisEngine';

let passed = 0;
let failed = 0;

function assert(condition: boolean, msg: string) {
  if (condition) {
    console.log(`  ✅ PASS: ${msg}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${msg}`);
    failed++;
  }
}

export async function runSubbatch4_7Tests(): Promise<{ passed: number; failed: number }> {
  console.log('\n===============================================================');
  console.log('🧪 VERIFYING ISSUE 30: TRUST SCORE INTEGRITY & UNREADABLE DEFENSES');
  console.log('===============================================================\n');

  // Test 1: Probe with three EMPTY files (sem1.pdf, sem2.pdf, resume.pdf)
  console.log('Test 1: Three EMPTY files probe...');
  const emptyDocs: VaultDocumentSlot[] = [
    {
      id: 'doc_sem1',
      category: 'sem1',
      title: '1st Semester University Marksheet',
      fileName: 'sem1.pdf',
      fileSize: '0 KB',
      fileType: 'application/pdf',
      candidateName: 'Candidate',
      scoreOrGpa: '1st Semester University Marksheet',
      skills: [],
      verificationStatus: 'provisional',
      uploadedAt: Date.now()
    },
    {
      id: 'doc_sem2',
      category: 'sem2',
      title: '2nd Semester University Marksheet',
      fileName: 'sem2.pdf',
      fileSize: '0 KB',
      fileType: 'application/pdf',
      candidateName: 'Candidate',
      scoreOrGpa: '2nd Semester University Marksheet',
      skills: [],
      verificationStatus: 'provisional',
      uploadedAt: Date.now()
    },
    {
      id: 'doc_resume',
      category: 'resume',
      title: 'Primary Candidate Master Resume',
      fileName: 'resume.pdf',
      fileSize: '0 KB',
      fileType: 'application/pdf',
      candidateName: 'Candidate',
      scoreOrGpa: 'Academic Credential',
      skills: [],
      verificationStatus: 'provisional',
      uploadedAt: Date.now()
    }
  ];

  const emptyAudit = auditDocumentCollection('Candidate', emptyDocs);
  assert(emptyAudit.trustScore === 0, 'Empty files yield trustScore: 0 (was 100)');
  assert(emptyAudit.overallStatus === 'UNREADABLE_DOCUMENTS_REJECTED', 'Empty files yield overallStatus: UNREADABLE_DOCUMENTS_REJECTED (was SENTINEL_CLEAN)');

  const emptyCalibration = calculateLiveQTMetrics(emptyDocs, emptyAudit);
  assert(emptyCalibration.evidenceTrustScore === 0, 'Empty files yield Evidence Trust: 0 (was 84)');
  assert(emptyCalibration.qt2Score === 0, 'Empty files yield QT2: 0 (was 45)');
  assert(emptyCalibration.atsPresentationScore === 0, 'Empty resume yields ATS: 0 (was 72)');
  assert(emptyCalibration.integrityLevel.includes('Unreadable Files'), 'Empty files yield integrityLevel flagging unreadable files (was Sentinel Clean 100%)');
  assert(emptyCalibration.qt2Evaluation.selfAwarenessIndex === 0, 'Empty files yield selfAwarenessIndex: 0 (was 85)');
  assert(emptyCalibration.qt2Evaluation.selfAwarenessLabel === 'Pending Assessment', 'Self awareness label is Pending Assessment (was High Cognitive Self-Awareness)');

  // Test 2: Zero documents baseline
  console.log('\nTest 2: Zero documents baseline...');
  const zeroAudit = auditDocumentCollection('', []);
  assert(zeroAudit.trustScore === 0, 'Zero documents yields trustScore: 0 (was 100)');
  assert(zeroAudit.overallStatus === 'AWAITING_UPLOADS', 'Zero documents yields overallStatus: AWAITING_UPLOADS (was SENTINEL_CLEAN)');

  const zeroCalibration = calculateLiveQTMetrics([]);
  assert(zeroCalibration.evidenceTrustScore === 0, 'Zero documents yields Evidence Trust: 0');
  assert(zeroCalibration.qt1Score === 0, 'Zero documents yields QT1: 0');
  assert(zeroCalibration.qt2Score === 0, 'Zero documents yields QT2: 0');

  // Test 3: Single document baseline
  console.log('\nTest 3: Single document baseline...');
  const singleEmptyAudit = auditDocumentCollection('Candidate', [emptyDocs[0]]);
  assert(singleEmptyAudit.trustScore === 0, 'Single empty document yields trustScore: 0 (was 100)');

  const singleValidDoc: VaultDocumentSlot = {
    id: 'doc_valid_single',
    category: 'resume',
    title: 'Primary Candidate Master Resume',
    fileName: 'resume.pdf',
    fileSize: '45 KB',
    fileType: 'application/pdf',
    candidateName: 'Rohan Sharma',
    scoreOrGpa: '8.8 GPA',
    skills: ['TypeScript', 'React'],
    verificationStatus: 'verified',
    provenanceRecords: [
      {
        id: 'prov_1',
        field: 'CandidateName',
        value: 'Rohan Sharma',
        sourceDocument: 'resume.pdf',
        documentHash: 'hash1',
        sourcePage: 1,
        sourceCharacterRange: [0, 12],
        sourceSection: 'HEADER_CONTACTS',
        sourceTextSnippet: 'Rohan Sharma',
        confidence: 0.98,
        verificationLevel: 'SELF_SUBMITTED',
        status: 'DOCUMENT_SUPPORTED',
        groundingRule: 'NAME_HEADER_CONTEXT_V1',
        extractionMethod: 'NATIVE_PDF',
        extractionConfidence: 0.98,
        parserVersion: 'v2.1.0',
        groundingVersion: 'v2.1.0',
        modelTimestamp: Date.now()
      }
    ],
    atsScore: 78,
    uploadedAt: Date.now()
  };

  const singleValidAudit = auditDocumentCollection('Rohan Sharma', [singleValidDoc]);
  assert(singleValidAudit.trustScore === 40, 'Single valid document yields baseline trustScore: 40 (was 100)');
  assert(singleValidAudit.overallStatus === 'PROVISIONAL_PENDING', 'Single valid document yields overallStatus: PROVISIONAL_PENDING (was SENTINEL_CLEAN)');

  // Test 4: Name matching probe
  console.log('\nTest 4: Name matching probe...');
  const probe1 = checkNameSimilarity('Rahul Kumar', 'Amit Kumar');
  assert(probe1.isMatch === false, '"Rahul Kumar" vs "Amit Kumar" returns isMatch: false');
  assert(probe1.reason?.includes('same surname') === true, 'Reason flags different given name with same surname');

  const probe2 = checkNameSimilarity('Priya Sharma', 'Neha Sharma');
  assert(probe2.isMatch === false, '"Priya Sharma" vs "Neha Sharma" returns isMatch: false');

  const probeEmptyA = checkNameSimilarity('Rohan Sharma', '');
  assert(probeEmptyA.isMatch === false && probeEmptyA.confidence === 0, 'Name vs empty string returns isMatch: false, confidence: 0 (was true, 100%)');

  const probeEmptyB = checkNameSimilarity('', 'Rohan Sharma');
  assert(probeEmptyB.isMatch === false && probeEmptyB.confidence === 0, 'Empty string vs name returns isMatch: false, confidence: 0 (was true, 100%)');

  const probeInitial = checkNameSimilarity('Rohan Sharma', 'R. Sharma');
  assert(probeInitial.isMatch === true, 'Initial matching ("Rohan Sharma" vs "R. Sharma") returns isMatch: true');

  // Test 5: Identity mismatch marked as REVIEW_REQUIRED (not fraud)
  console.log('\nTest 5: Identity mismatch audit...');
  const conflictDoc: VaultDocumentSlot = {
    ...singleValidDoc,
    id: 'doc_conflict',
    fileName: 'marksheet_friend.pdf',
    candidateName: 'Amit Kumar'
  };
  const conflictAudit = auditDocumentCollection('Rahul Kumar', [singleValidDoc, conflictDoc]);
  assert(conflictAudit.mismatchCount === 1, 'Conflict doc flags mismatchCount: 1');
  assert(conflictAudit.overallStatus === 'REVIEW_REQUIRED', 'Mismatch sets overallStatus: REVIEW_REQUIRED (was IDENTITY_MISMATCH_FLAGGED)');
  assert(conflictAudit.conflictingDocuments[0].reason.includes('review'), 'Conflict reason states review required');

  // Test 6: Legitimate multi-document set with real content
  console.log('\nTest 6: Legitimate multi-document set with real content...');
  const sem1Doc: VaultDocumentSlot = {
    id: 'doc_sem1_valid',
    category: 'sem1',
    title: '1st Semester University Marksheet',
    fileName: 'sem1.pdf',
    fileSize: '32 KB',
    fileType: 'application/pdf',
    candidateName: 'Rohan Sharma',
    scoreOrGpa: '8.4 GPA',
    skills: ['Data Structures'],
    verificationStatus: 'verified',
    provenanceRecords: [
      {
        id: 'prov_sem1',
        field: 'GPA',
        value: '8.4 GPA',
        sourceDocument: 'sem1.pdf',
        documentHash: 'hash_sem1',
        sourcePage: 1,
        sourceCharacterRange: [0, 7],
        sourceSection: 'EDUCATION',
        sourceTextSnippet: 'GPA: 8.4',
        confidence: 0.98,
        verificationLevel: 'SELF_SUBMITTED',
        status: 'DOCUMENT_SUPPORTED',
        groundingRule: 'GPA_EDUCATION_CONTEXT_V2',
        extractionMethod: 'NATIVE_PDF',
        extractionConfidence: 0.98,
        parserVersion: 'v2.1.0',
        groundingVersion: 'v2.1.0',
        modelTimestamp: Date.now()
      }
    ],
    uploadedAt: Date.now()
  };

  const multiAudit = auditDocumentCollection('Rohan Sharma', [singleValidDoc, sem1Doc]);
  assert(multiAudit.trustScore >= 70, 'Multi-document legitimate set yields trustScore >= 70');
  assert(multiAudit.overallStatus === 'SENTINEL_CLEAN', 'Consistent documents yield overallStatus: SENTINEL_CLEAN');

  const multiCalibration = calculateLiveQTMetrics([singleValidDoc, sem1Doc], multiAudit);
  assert(multiCalibration.evidenceTrustScore >= 60, 'Legitimate evidence yields evidenceTrustScore >= 60');
  assert(multiCalibration.atsPresentationScore === 78, 'ATS presentation reflects master resume score (78)');
  assert(multiCalibration.academicAverageGpa === 8.4, 'Academic GPA accurately calculated');

  console.log(`\n===============================================================`);
  console.log(`Subbatch 4_7 Tests Completed: ${passed} passed, ${failed} failed.`);
  console.log(`===============================================================\n`);

  return { passed, failed };
}

if (require.main === module || (typeof process !== 'undefined' && process.argv[1]?.includes('verify_subbatch_4_7'))) {
  runSubbatch4_7Tests().then(({ passed, failed }) => {
    if (failed > 0) process.exit(1);
  });
}
