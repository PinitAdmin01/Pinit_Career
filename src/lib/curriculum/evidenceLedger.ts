// src/lib/curriculum/evidenceLedger.ts
// Master Persistent Evidence Ledger Service: Append-Only Invariants, Provenance & Audit Trails

import {
  EvidenceRecord,
  EvidenceAuditEvent,
  EvidenceType,
  EvidenceSourceType,
  EvidenceStatus,
  EvidenceProvenance,
  AssessmentSnapshot,
  CanonicalEvidencePayload,
  EvidenceChainVerificationReport,
  GENESIS_EVIDENCE_HASH,
} from './evidenceTypes';
import {
  computeEvidenceHash,
  verifyStudentEvidenceChain,
} from './evidenceHasher';
import { CurriculumValidationError } from './validator';
import { AssessmentResult, AssessmentAttempt, Assessment } from './assessmentTypes';

export interface RecordEvidenceInput {
  studentId: string;
  courseId: string;
  phaseId: string;
  monthId: string;
  weekId: string;
  packetId: string;
  dayId: string;
  competencyId: string;
  evidenceType: EvidenceType;
  sourceType: EvidenceSourceType;
  assessment: Assessment;
  attempt: AssessmentAttempt;
  result: AssessmentResult;
  provenance: Omit<EvidenceProvenance, 'assessmentId' | 'assessmentVersion' | 'attemptId' | 'sourceType'>;
  artifactReference?: string;
  statusOverride?: EvidenceStatus; // If formative, defaults to UNVERIFIED or VERIFIED based on source
}

export class EvidenceLedger {
  // studentId -> EvidenceRecord[] (Chronological Append-Only Chain)
  private studentChains = new Map<string, EvidenceRecord[]>();
  // evidenceId -> EvidenceRecord
  private recordsById = new Map<string, EvidenceRecord>();
  // evidenceHash -> EvidenceRecord (Duplicate prevention)
  private recordsByHash = new Map<string, EvidenceRecord>();
  // evidenceId -> EvidenceAuditEvent[]
  private auditEvents = new Map<string, EvidenceAuditEvent[]>();

  /**
   * Append a new Evidence Record from a completed Assessment Evaluation.
   */
  public recordAssessmentEvidence(input: RecordEvidenceInput): EvidenceRecord {
    const {
      studentId,
      courseId,
      phaseId,
      monthId,
      weekId,
      packetId,
      dayId,
      competencyId,
      evidenceType,
      sourceType,
      assessment,
      attempt,
      result,
      provenance,
      artifactReference,
    } = input;

    if (!studentId || !assessment.id || !attempt.id || !result.id) {
      throw new CurriculumValidationError(
        'Missing required identity coordinates for evidence generation',
        'INCOMPLETE_EVIDENCE_INPUT'
      );
    }

    // Resolve current student chain
    const chain = this.studentChains.get(studentId) || [];
    const sequenceNumber = chain.length + 1;

    // Resolve previous hash
    const previousEvidenceHash = sequenceNumber === 1
      ? GENESIS_EVIDENCE_HASH
      : chain[chain.length - 1].evidenceHash;

    const evidenceId = `evi-${studentId}-${sequenceNumber}-${Date.now()}`;
    const evidenceCode = `EVI-P${assessment.assessmentCode}-S${sequenceNumber}`;
    const createdAt = new Date().toISOString();

    const fullProvenance: EvidenceProvenance = {
      sourceType,
      assessmentId: assessment.id,
      assessmentVersion: assessment.version,
      attemptId: attempt.id,
      evaluationVersion: '1.0.0',
      rubricVersion: assessment.items.some(i => i.rubricDimensions) ? '1.0.0' : undefined,
      evaluatorType: result.evaluatorType,
      verificationMethod: provenance.verificationMethod,
      submissionReference: provenance.submissionReference,
      clientRuntimeInfo: provenance.clientRuntimeInfo,
    };

    const assessmentSnapshot: AssessmentSnapshot = {
      rawScore: result.rawScore,
      maxScore: result.maxScore,
      normalizedScore: result.normalizedScore,
      passed: result.passed,
      mandatoryCriteriaMet: result.mandatoryCriteriaMet,
      hasCriticalFailures: result.hasCriticalFailures,
      criticalFailureReasons: [...result.criticalFailureReasons],
    };

    const canonicalPayload: CanonicalEvidencePayload = {
      studentId,
      courseId,
      phaseId,
      monthId,
      weekId,
      packetId,
      dayId,
      competencyId,
      evidenceType,
      provenance: fullProvenance,
      assessmentSnapshot,
      artifactReference,
      createdAt,
    };

    const schemaVersion = 1;
    const evidenceHash = computeEvidenceHash(
      canonicalPayload,
      previousEvidenceHash,
      sequenceNumber,
      evidenceId,
      schemaVersion
    );

    // Initial Status Determination: Formative vs Summative vs Certification
    let initialStatus: EvidenceStatus = 'UNVERIFIED';
    if (sourceType === 'FORMATIVE') {
      initialStatus = result.passed ? 'VERIFIED' : 'UNVERIFIED';
    } else if (sourceType === 'SUMMATIVE' || sourceType === 'CERTIFICATION') {
      initialStatus = result.passed && !result.hasCriticalFailures && result.mandatoryCriteriaMet ? 'VERIFIED' : 'REJECTED';
    }

    const record: EvidenceRecord = {
      id: evidenceId,
      evidenceCode,
      studentId,
      courseId,
      phaseId,
      monthId,
      weekId,
      packetId,
      dayId,
      competencyId,
      evidenceType,
      sourceType,
      status: initialStatus,
      provenance: fullProvenance,
      assessmentSnapshot,
      artifactReference,
      integritySequence: sequenceNumber,
      previousEvidenceHash,
      evidenceHash,
      schemaVersion,
      createdAt,
      verifiedAt: initialStatus === 'VERIFIED' ? createdAt : undefined,
    };

    // Append to Ledger
    this.appendRecord(record);

    // Record Creation Audit Event
    this.recordAuditEvent({
      eventId: `aud-${evidenceId}-01`,
      evidenceId: record.id,
      eventType: 'EVIDENCE_CREATED',
      timestamp: createdAt,
      actorType: 'SYSTEM_EVALUATOR',
      actorId: 'PinIT-Assessment-Engine',
      details: `Evidence record #${sequenceNumber} generated from assessment ${assessment.assessmentCode} (Score: ${result.normalizedScore}%, Status: ${initialStatus})`,
    });

    return record;
  }

  /**
   * Internal Append-Only Validator & Storage.
   * STRICT GUARANTEE: Forbids mutations, duplicates, and out-of-order sequence insertion.
   */
  private appendRecord(record: EvidenceRecord): void {
    if (this.recordsById.has(record.id)) {
      throw new CurriculumValidationError(
        `Evidence record with id '${record.id}' already exists in ledger. Records are permanent and cannot be overwritten.`,
        'DUPLICATE_EVIDENCE_ID'
      );
    }

    if (this.recordsByHash.has(record.evidenceHash)) {
      throw new CurriculumValidationError(
        `Duplicate evidence hash '${record.evidenceHash}' detected. Cannot append identical block.`,
        'DUPLICATE_EVIDENCE_HASH'
      );
    }

    const chain = this.studentChains.get(record.studentId) || [];
    const expectedSequence = chain.length + 1;

    if (record.integritySequence !== expectedSequence) {
      throw new CurriculumValidationError(
        `Invalid sequence number ${record.integritySequence} for student '${record.studentId}'. Expected ${expectedSequence}.`,
        'INVALID_EVIDENCE_SEQUENCE'
      );
    }

    // Append to state
    this.recordsById.set(record.id, record);
    this.recordsByHash.set(record.evidenceHash, record);
    this.studentChains.set(record.studentId, [...chain, record]);
  }

  /**
   * Forbid direct update of evidence records (Enforces Append-Only model).
   */
  public updateRecord(): never {
    throw new CurriculumValidationError(
      'PERMISSION_DENIED: Evidence ledger records are immutable and cannot be updated. Use superseding events or revocation instead.',
      'EVIDENCE_UPDATE_FORBIDDEN'
    );
  }

  /**
   * Forbid direct deletion of evidence records.
   */
  public deleteRecord(): never {
    throw new CurriculumValidationError(
      'PERMISSION_DENIED: Evidence ledger records are permanent and cannot be deleted.',
      'EVIDENCE_DELETE_FORBIDDEN'
    );
  }

  /**
   * Revoke or invalidate an evidence record through an auditable superseding event.
   */
  public revokeEvidence(
    evidenceId: string,
    reason: string,
    actorId: string,
    newStatus: 'REVOKED' | 'INVALIDATED' = 'REVOKED'
  ): EvidenceAuditEvent {
    const record = this.recordsById.get(evidenceId);
    if (!record) {
      throw new CurriculumValidationError(`Evidence '${evidenceId}' not found`, 'EVIDENCE_NOT_FOUND');
    }

    const timestamp = new Date().toISOString();
    record.status = newStatus;
    record.revokedAt = timestamp;
    record.revocationReason = reason;

    const auditEvent: EvidenceAuditEvent = {
      eventId: `aud-${evidenceId}-rev-${Date.now()}`,
      evidenceId,
      eventType: newStatus === 'REVOKED' ? 'EVIDENCE_REVOKED' : 'EVIDENCE_INVALIDATED',
      timestamp,
      actorType: 'ADMIN_EXAMINER',
      actorId,
      details: `Evidence status transitioned to ${newStatus}. Reason: ${reason}`,
    };

    this.recordAuditEvent(auditEvent);
    return auditEvent;
  }

  /**
   * Retrieve all evidence records for a student with optional filters.
   */
  public getStudentEvidence(
    studentId: string,
    options: { onlyVerified?: boolean; onlyCertification?: boolean } = {}
  ): EvidenceRecord[] {
    const chain = this.studentChains.get(studentId) || [];
    return chain.filter(rec => {
      if (options.onlyVerified && rec.status !== 'VERIFIED') return false;
      if (options.onlyCertification && rec.sourceType !== 'CERTIFICATION') return false;
      return true;
    });
  }

  public getEvidenceById(evidenceId: string): EvidenceRecord | undefined {
    return this.recordsById.get(evidenceId);
  }

  public getAuditTrail(evidenceId: string): EvidenceAuditEvent[] {
    return this.auditEvents.get(evidenceId) || [];
  }

  private recordAuditEvent(event: EvidenceAuditEvent): void {
    const events = this.auditEvents.get(event.evidenceId) || [];
    this.auditEvents.set(event.evidenceId, [...events, event]);
  }

  /**
   * Audits a student's full chronological chain for cryptographic validity.
   */
  public auditStudentEvidenceChain(studentId: string): EvidenceChainVerificationReport {
    const chain = this.studentChains.get(studentId) || [];
    return verifyStudentEvidenceChain(chain, studentId);
  }

  public _reset(): void {
    this.studentChains.clear();
    this.recordsById.clear();
    this.recordsByHash.clear();
    this.auditEvents.clear();
  }
}

export const evidenceLedger = new EvidenceLedger();
