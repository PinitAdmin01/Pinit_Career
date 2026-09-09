// src/lib/ats/contradictionEngine.ts
/**
 * ============================================================================
 * STAGE 9: CONTRADICTION ENGINE & AUTHORITATIVE PRECEDENCE ROUTER
 * ============================================================================
 * 
 * Purpose:
 * When a student uploads multiple documents with divergent facts (e.g. Resume
 * states 8.0 GPA, but 8th Semester Marksheet certifies 7.6 CGPA), this engine:
 * 1. Preserves BOTH facts under CONFLICTING_EVIDENCE status (No evidence deletion!).
 * 2. Applies authoritative precedence routing:
 *    INSTITUTION_VERIFIED > CROSS_VALIDATED > THIRD_PARTY_VERIFIED > STRUCTURALLY_VALIDATED > SELF_SUBMITTED
 * 3. Selects the higher authority record for downstream academic analytics.
 */

import { GroundedProvenanceRecord } from './factCheckValidator';

export interface ContradictionRecord {
  field: string;
  factA: {
    value: any;
    sourceDocument: string;
    verificationLevel: string;
  };
  factB: {
    value: any;
    sourceDocument: string;
    verificationLevel: string;
  };
  authoritativeValue: any;
  precedenceRationale: string;
}

const PRECEDENCE_HIERARCHY: Record<string, number> = {
  INSTITUTION_VERIFIED: 5,
  CROSS_VALIDATED: 4,
  THIRD_PARTY_VERIFIED: 3,
  STRUCTURALLY_VALIDATED: 2,
  SELF_SUBMITTED: 1
};

/**
 * Detects contradictions across multiple document provenance records and applies authoritative precedence.
 */
export function evaluateDocumentContradictions(
  records: GroundedProvenanceRecord[]
): {
  contradictions: ContradictionRecord[];
  authoritativeFacts: Map<string, any>;
  hasConflicts: boolean;
} {
  console.log(`\n🔍 [STAGE 9/12 - Contradiction Sentinel]: Evaluating ${records.length} provenance records across collection...`);
  const contradictions: ContradictionRecord[] = [];
  const authoritativeFacts = new Map<string, any>();
  const fieldGroups = new Map<string, GroundedProvenanceRecord[]>();

  for (const r of records) {
    const list = fieldGroups.get(r.field) || [];
    list.push(r);
    fieldGroups.set(r.field, list);
  }

  for (const [field, group] of fieldGroups.entries()) {
    if (group.length <= 1) {
      authoritativeFacts.set(field, group[0].value);
      continue;
    }

    const sorted = [...group].sort((a, b) => {
      const pA = PRECEDENCE_HIERARCHY[a.verificationLevel] || 1;
      const pB = PRECEDENCE_HIERARCHY[b.verificationLevel] || 1;
      return pB - pA;
    });

    const top = sorted[0];
    authoritativeFacts.set(field, top.value);

    for (let i = 1; i < sorted.length; i++) {
      const other = sorted[i];
      if (String(top.value).toLowerCase() !== String(other.value).toLowerCase()) {
        const rationale = `Higher authority source "${top.sourceDocument}" (${top.verificationLevel}) takes precedence over "${other.sourceDocument}" (${other.verificationLevel}) for derived academic metrics.`;
        
        console.warn(`⚠️ [STAGE 9/12 - Conflict Detected on Field "${field}"]:\n   - Authority Fact: "${top.value}" in ${top.sourceDocument}\n   - Subordinate Fact: "${other.value}" in ${other.sourceDocument}\n   - Rationale: ${rationale}`);
        
        contradictions.push({
          field,
          factA: {
            value: top.value,
            sourceDocument: top.sourceDocument,
            verificationLevel: top.verificationLevel
          },
          factB: {
            value: other.value,
            sourceDocument: other.sourceDocument,
            verificationLevel: other.verificationLevel
          },
          authoritativeValue: top.value,
          precedenceRationale: rationale
        });

        other.status = 'CONFLICTING_EVIDENCE';
        top.status = 'CONFLICTING_EVIDENCE';
      }
    }
  }

  console.log(`✅ [STAGE 9/12 - Contradiction Complete]: Found ${contradictions.length} conflicts. Authoritative facts locked for downstream models.`);

  return {
    contradictions,
    authoritativeFacts,
    hasConflicts: contradictions.length > 0
  };
}
