// src/lib/curriculum/evidenceTypes.ts
// Single Source of Truth for PinIT Evidence Engine Architecture

export type EvidenceType = 
  | 'ASSESSMENT_RESULT'
  | 'CODE_SUBMISSION'
  | 'DEBUGGING_RESULT'
  | 'TRANSFER_RESULT'
  | 'PROJECT_RESULT'
  | 'SECURITY_RESULT'
  | 'PRACTICAL_RESULT'
  | 'VIVA_RESULT'
  | 'DEPLOYMENT_RESULT'
  | 'CODE_REVIEW_RESULT';

export type EvidenceSourceType = 
  | 'FORMATIVE'        // Client/practice execution (NOT valid for certification gates)
  | 'SUMMATIVE'        // Supervised assessment
  | 'CERTIFICATION'    // High-stakes audited gate assessment
  | 'IMPORT'           // Verified external credential
  | 'MANUAL_REVIEW';   // Human examiner review

export type EvidenceStatus = 
  | 'UNVERIFIED'
  | 'VERIFIED'
  | 'REJECTED'
  | 'INVALIDATED'
  | 'REVOKED'
  | 'UNDER_REVIEW';

export type EvidenceAuditEventType = 
  | 'EVIDENCE_CREATED'
  | 'EVIDENCE_VERIFIED'
  | 'EVIDENCE_INVALIDATED'
  | 'EVIDENCE_REVOKED'
  | 'EVIDENCE_SUPERSEDED';

export const GENESIS_EVIDENCE_HASH = 'GENESIS_ROOT_PINIT_CAREEROS_00000000000000000000000000000000';

// ── Evidence Provenance Metadata ──────────────────────────────────────────────
export interface EvidenceProvenance {
  sourceType: EvidenceSourceType;
  assessmentId: string;
  assessmentVersion: string;
  attemptId: string;
  evaluationVersion: string;
  rubricVersion?: string;
  evaluatorType: 'DETERMINISTIC' | 'RUBRIC' | 'MANUAL' | 'HYBRID';
  submissionReference?: string;    // Secure URL or SHA-256 hash of submitted artifact
  verificationMethod: 'AUTOMATED_DETERMINISTIC' | 'SANDBOX_EXECUTION' | 'HUMAN_AUDIT' | 'HYBRID_VERIFICATION';
  clientRuntimeInfo?: {
    userAgent: string;
    runtime: string;
  };
}

// ── Authoritative Assessment Snapshot at Creation Time ────────────────────────
export interface AssessmentSnapshot {
  rawScore: number;
  maxScore: number;
  normalizedScore: number;         // 0 - 100
  passed: boolean;
  mandatoryCriteriaMet: boolean;
  hasCriticalFailures: boolean;
  criticalFailureReasons: string[];
}

// ── Canonical Evidence Payload (Hashed into Tamper-Evident Chain) ──────────────
export interface CanonicalEvidencePayload {
  studentId: string;
  courseId: string;
  phaseId: string;
  monthId: string;
  weekId: string;
  packetId: string;
  dayId: string;
  competencyId: string;
  evidenceType: EvidenceType;
  provenance: EvidenceProvenance;
  assessmentSnapshot: AssessmentSnapshot;
  artifactReference?: string;
  createdAt: string;               // ISO-8601 UTC
}

// ── Complete Immutable Evidence Record ────────────────────────────────────────
export interface EvidenceRecord {
  id: string;                      // Stable UUID e.g. 'evi-001-studentA'
  evidenceCode: string;            // Deterministic code e.g. 'EVI-P1-M1-W1-001'
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
  status: EvidenceStatus;
  
  // Provenance & Snapshot
  provenance: EvidenceProvenance;
  assessmentSnapshot: AssessmentSnapshot;
  artifactReference?: string;
  
  // Tamper-Evident Hash Chain
  integritySequence: number;       // 1, 2, 3... strictly sequential per student
  previousEvidenceHash: string;    // HASH(N-1) or GENESIS_EVIDENCE_HASH
  evidenceHash: string;            // SHA-256(canonicalPayload + prevHash + seq + id + schemaVersion)
  schemaVersion: number;           // Current: 1
  
  // Timestamps
  createdAt: string;               // ISO-8601 UTC
  verifiedAt?: string;             // ISO-8601 UTC
  revokedAt?: string;              // If revoked
  revocationReason?: string;
  supersedingEvidenceId?: string;  // If superseded by a newer record
}

// ── Auditable Lifecycle Event ─────────────────────────────────────────────────
export interface EvidenceAuditEvent {
  eventId: string;
  evidenceId: string;
  eventType: EvidenceAuditEventType;
  timestamp: string;
  actorType: 'STUDENT' | 'SYSTEM_EVALUATOR' | 'ADMIN_EXAMINER';
  actorId: string;
  details: string;
  metadata?: Record<string, any>;
}

// ── Independent Chain Verification Report ─────────────────────────────────────
export interface EvidenceChainVerificationReport {
  studentId: string;
  totalRecords: number;
  isValidChain: boolean;
  brokenLinkIndex?: number;
  brokenRecordId?: string;
  tamperReason?: string;
  verifiedCount: number;
  formativeCount: number;
  revokedCount: number;
}
