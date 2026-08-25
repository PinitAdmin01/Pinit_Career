// apps/web/src/lib/pathway/evidenceEngine.ts
// Strict Evidence Ledger Engine: Provenance, Canonical SHA-256 Hashing & Anti-Gaming Deduplication

import { createHash } from 'crypto';
import {
  CompetencyDefinition,
  CompetencyEvidenceRecord,
  DIFFICULTY_RANK,
  EvidenceClass,
  EvidenceDifficulty,
} from './competencySchema';

export interface QualifiedEvidenceSummary {
  competencyId: string;
  totalRawRecords: number;
  qualifiedIndependentRecords: CompetencyEvidenceRecord[];
  independentSourceCount: number;
  distinctFamilyCount: number;
  classSummaries: Record<EvidenceClass, {
    count: number;
    averageScore: number;
    highestDifficulty: EvidenceDifficulty;
    families: string[];
    sources: string[];
  }>;
  criticalFailures: string[];
}

function canonicalSort(val: any): any {
  if (val === null || typeof val !== 'object') return val;
  if (Array.isArray(val)) return val.map(canonicalSort);
  return Object.keys(val).sort().reduce((acc: any, k) => {
    acc[k] = canonicalSort(val[k]);
    return acc;
  }, {});
}

/**
 * Computes a deterministic canonical SHA-256 integrity hash for an evidence record.
 */
export function generateEvidenceIntegrityHash(record: Omit<CompetencyEvidenceRecord, 'integrityHash'>): string {
  const sortedArtifacts = record.artifacts ? canonicalSort(record.artifacts) : {};

  const canonicalPayload = JSON.stringify({
    competencyId: record.competencyId,
    competencyVersion: record.competencyVersion,
    studentId: record.studentId,
    programId: record.programId,
    evidenceClass: record.evidenceClass,
    difficulty: record.difficulty,
    evidenceFamilyId: record.evidenceFamilyId || '',
    sourceType: record.sourceType,
    sourceId: record.sourceId,
    attemptId: record.attemptId,
    score: record.score,
    evaluatorType: record.evaluatorType,
    evaluatorVersion: record.evaluatorVersion,
    rubricVersion: record.rubricVersion,
    timestamp: record.timestamp,
    artifacts: sortedArtifacts,
  });

  return createHash('sha256').update(canonicalPayload).digest('hex');
}

/**
 * Verifies if an existing evidence record's SHA-256 integrity hash is valid and untampered.
 */
export function verifyEvidenceIntegrity(record: CompetencyEvidenceRecord): boolean {
  if (!record.integrityHash) return false;
  const computed = generateEvidenceIntegrityHash(record);
  return computed === record.integrityHash;
}

/**
 * Processes raw student evidence records with anti-gaming deduplication and difficulty gating.
 * 
 * Anti-Gaming Rules:
 * 1. Deduplication: Multiple attempts on the same `sourceId` are grouped. Only the best attempt is kept.
 * 2. Independent Source Count: Total unique `sourceId` count.
 * 3. Family Diversity: Unique `evidenceFamilyId` count.
 * 4. Critical Failure Extraction: Collects all active critical failure codes.
 */
export function processEvidenceLedger(
  competency: CompetencyDefinition,
  rawRecords: CompetencyEvidenceRecord[]
): QualifiedEvidenceSummary {
  // 1. Filter records strictly belonging to this competency
  const relevantRecords = rawRecords.filter(r => r.competencyId === competency.id);

  // 2. Anti-Gaming: Group attempts by `sourceId` and keep ONLY the highest-scoring qualified attempt
  const bestAttemptBySource = new Map<string, CompetencyEvidenceRecord>();
  for (const record of relevantRecords) {
    const existing = bestAttemptBySource.get(record.sourceId);
    if (!existing || record.score > existing.score) {
      bestAttemptBySource.set(record.sourceId, record);
    }
  }

  const qualifiedRecords = Array.from(bestAttemptBySource.values());

  // 3. Initialize Class Summaries
  const initialClassSummary = (): QualifiedEvidenceSummary['classSummaries'][EvidenceClass] => ({
    count: 0,
    averageScore: 0,
    highestDifficulty: 'basic',
    families: [],
    sources: [],
  });

  const classSummaries: QualifiedEvidenceSummary['classSummaries'] = {
    knowledge: initialClassSummary(),
    application: initialClassSummary(),
    debugging: initialClassSummary(),
    architecture: initialClassSummary(),
    production: initialClassSummary(),
    defense: initialClassSummary(),
  };

  const familySet = new Set<string>();
  const criticalFailuresSet = new Set<string>();

  // 4. Aggregate by Evidence Class
  for (const record of qualifiedRecords) {
    const summary = classSummaries[record.evidenceClass];
    if (!summary) continue;

    summary.count++;
    summary.sources.push(record.sourceId);

    if (record.evidenceFamilyId) {
      familySet.add(record.evidenceFamilyId);
      if (!summary.families.includes(record.evidenceFamilyId)) {
        summary.families.push(record.evidenceFamilyId);
      }
    }

    // Track highest difficulty rank
    if (DIFFICULTY_RANK[record.difficulty] > DIFFICULTY_RANK[summary.highestDifficulty]) {
      summary.highestDifficulty = record.difficulty;
    }

    // Collect Critical Failures
    if (record.criticalFailuresDetected && record.criticalFailuresDetected.length > 0) {
      for (const fail of record.criticalFailuresDetected) {
        criticalFailuresSet.add(fail);
      }
    }
  }

  // 5. Calculate Average Scores per Evidence Class
  for (const evidenceClass of Object.keys(classSummaries) as EvidenceClass[]) {
    const summary = classSummaries[evidenceClass];
    const recordsInClass = qualifiedRecords.filter(r => r.evidenceClass === evidenceClass);
    if (recordsInClass.length > 0) {
      const sum = recordsInClass.reduce((acc, r) => acc + r.score, 0);
      summary.averageScore = sum / recordsInClass.length;
    }
  }

  return {
    competencyId: competency.id,
    totalRawRecords: relevantRecords.length,
    qualifiedIndependentRecords: qualifiedRecords,
    independentSourceCount: qualifiedRecords.length,
    distinctFamilyCount: familySet.size,
    classSummaries,
    criticalFailures: Array.from(criticalFailuresSet),
  };
}
