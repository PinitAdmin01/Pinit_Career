// src/lib/curriculum/evidenceHasher.ts
// Canonical Serialization and Deterministic SHA-256 Hash Chaining for Evidence Ledger

import { createHash } from 'crypto';
import {
  CanonicalEvidencePayload,
  EvidenceRecord,
  EvidenceChainVerificationReport,
  GENESIS_EVIDENCE_HASH,
} from './evidenceTypes';

/**
 * Deterministic JSON Canonicalizer.
 * Recursively sorts all object keys alphabetically, strips undefined, and formats uniformly.
 */
export function canonicalSerialize(val: any): string {
  function sortKeys(obj: any): any {
    if (obj === null || typeof obj !== 'object') return obj;
    if (Array.isArray(obj)) return obj.map(sortKeys);
    return Object.keys(obj)
      .sort()
      .reduce((acc: any, key) => {
        if (obj[key] !== undefined) {
          acc[key] = sortKeys(obj[key]);
        }
        return acc;
      }, {});
  }
  return JSON.stringify(sortKeys(val));
}

/**
 * Computes a deterministic SHA-256 hash for an evidence record bound to the previous chain block.
 */
export function computeEvidenceHash(
  payload: CanonicalEvidencePayload,
  previousEvidenceHash: string,
  integritySequence: number,
  evidenceId: string,
  schemaVersion: number
): string {
  const canonicalPayloadStr = canonicalSerialize(payload);
  const compositeInput = [
    canonicalPayloadStr,
    previousEvidenceHash,
    integritySequence.toString(),
    evidenceId,
    schemaVersion.toString(),
  ].join(':::');

  return createHash('sha256').update(compositeInput).digest('hex');
}

/**
 * Verifies if an individual evidence record's hash matches its canonical content and chain binding.
 */
export function verifyEvidenceRecordHash(record: EvidenceRecord): boolean {
  if (!record.evidenceHash || !record.previousEvidenceHash || record.integritySequence < 1) {
    return false;
  }

  const payload: CanonicalEvidencePayload = {
    studentId: record.studentId,
    courseId: record.courseId,
    phaseId: record.phaseId,
    monthId: record.monthId,
    weekId: record.weekId,
    packetId: record.packetId,
    dayId: record.dayId,
    competencyId: record.competencyId,
    evidenceType: record.evidenceType,
    provenance: record.provenance,
    assessmentSnapshot: record.assessmentSnapshot,
    artifactReference: record.artifactReference,
    createdAt: record.createdAt,
  };

  const expectedHash = computeEvidenceHash(
    payload,
    record.previousEvidenceHash,
    record.integritySequence,
    record.id,
    record.schemaVersion
  );

  return record.evidenceHash === expectedHash;
}

/**
 * Audits and verifies an entire chronological student evidence chain.
 * Validates:
 * 1. Genesis block has GENESIS_EVIDENCE_HASH.
 * 2. Sequences are strictly 1, 2, 3... without gaps or duplicates.
 * 3. Each block's previousEvidenceHash matches the preceding block's evidenceHash.
 * 4. Each block's internal SHA-256 hash is authentic.
 */
export function verifyStudentEvidenceChain(
  records: EvidenceRecord[],
  studentId: string
): EvidenceChainVerificationReport {
  if (!records || records.length === 0) {
    return {
      studentId,
      totalRecords: 0,
      isValidChain: true,
      verifiedCount: 0,
      formativeCount: 0,
      revokedCount: 0,
    };
  }

  // Sort by sequence to verify chronological chain
  const sorted = [...records].sort((a, b) => a.integritySequence - b.integritySequence);

  let verifiedCount = 0;
  let formativeCount = 0;
  let revokedCount = 0;

  for (let i = 0; i < sorted.length; i++) {
    const current = sorted[i];
    const expectedSeq = i + 1;

    // Check Student Ownership
    if (current.studentId !== studentId) {
      return {
        studentId,
        totalRecords: sorted.length,
        isValidChain: false,
        brokenLinkIndex: i,
        brokenRecordId: current.id,
        tamperReason: `Student ID mismatch: expected '${studentId}', found '${current.studentId}'`,
        verifiedCount,
        formativeCount,
        revokedCount,
      };
    }

    // Check Sequence Continuity
    if (current.integritySequence !== expectedSeq) {
      return {
        studentId,
        totalRecords: sorted.length,
        isValidChain: false,
        brokenLinkIndex: i,
        brokenRecordId: current.id,
        tamperReason: `Sequence break: expected #${expectedSeq}, got #${current.integritySequence}`,
        verifiedCount,
        formativeCount,
        revokedCount,
      };
    }

    // Check Genesis vs Previous Hash Link
    if (i === 0) {
      if (current.previousEvidenceHash !== GENESIS_EVIDENCE_HASH) {
        return {
          studentId,
          totalRecords: sorted.length,
          isValidChain: false,
          brokenLinkIndex: 0,
          brokenRecordId: current.id,
          tamperReason: `Genesis block must link to GENESIS_EVIDENCE_HASH. Found '${current.previousEvidenceHash}'`,
          verifiedCount,
          formativeCount,
          revokedCount,
        };
      }
    } else {
      const prevRecord = sorted[i - 1];
      if (current.previousEvidenceHash !== prevRecord.evidenceHash) {
        return {
          studentId,
          totalRecords: sorted.length,
          isValidChain: false,
          brokenLinkIndex: i,
          brokenRecordId: current.id,
          tamperReason: `Broken chain link at block #${current.integritySequence}: previousEvidenceHash does not match preceding block's hash`,
          verifiedCount,
          formativeCount,
          revokedCount,
        };
      }
    }

    // Check Block Integrity Hash
    if (!verifyEvidenceRecordHash(current)) {
      return {
        studentId,
        totalRecords: sorted.length,
        isValidChain: false,
        brokenLinkIndex: i,
        brokenRecordId: current.id,
        tamperReason: `Tampered block: recalculation of evidenceHash for block #${current.integritySequence} failed`,
        verifiedCount,
        formativeCount,
        revokedCount,
      };
    }

    // Track status counts
    if (current.status === 'VERIFIED') verifiedCount++;
    if (current.sourceType === 'FORMATIVE') formativeCount++;
    if (current.status === 'REVOKED' || current.status === 'INVALIDATED') revokedCount++;
  }

  return {
    studentId,
    totalRecords: sorted.length,
    isValidChain: true,
    verifiedCount,
    formativeCount,
    revokedCount,
  };
}
