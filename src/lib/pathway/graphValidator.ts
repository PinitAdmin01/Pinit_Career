// apps/web/src/lib/pathway/graphValidator.ts
// Strict DAG cycle detection, reference validation, weight normalization & level hierarchy checks

import { CompetencyDefinition, LEVEL_RANK } from './competencySchema';

export interface GraphValidationResult {
  valid: boolean;
  duplicateCompetencyIds: string[];
  missingReferences: { competencyId: string; missingPrereqId: string; type: 'prerequisite' | 'recommended' }[];
  selfDependencies: string[];
  duplicatePrerequisites: { competencyId: string; duplicateId: string }[];
  cycles: string[][];
  invalidCrossLevelPrerequisites: { competencyId: string; compLevel: string; prereqId: string; prereqLevel: string }[];
  invalidClassWeights: { competencyId: string; sum: number; reason: string }[];
  invalidEvidenceRequirements: { competencyId: string; reason: string }[];
}

/**
 * Validates the complete competency catalog against all structural, topological,
 * mathematical, evidence-requirement, and level-hierarchy constraints.
 */
export function validateCompetencyCatalog(catalog: CompetencyDefinition[]): GraphValidationResult {
  const compIdMap = new Map<string, CompetencyDefinition>();
  const duplicateCompetencyIds: string[] = [];
  const missingReferences: { competencyId: string; missingPrereqId: string; type: 'prerequisite' | 'recommended' }[] = [];
  const selfDependencies: string[] = [];
  const duplicatePrerequisites: { competencyId: string; duplicateId: string }[] = [];
  const invalidCrossLevelPrerequisites: { competencyId: string; compLevel: string; prereqId: string; prereqLevel: string }[] = [];
  const invalidClassWeights: { competencyId: string; sum: number; reason: string }[] = [];
  const invalidEvidenceRequirements: { competencyId: string; reason: string }[] = [];

  // 1. Validate Competency IDs, Uniqueness, Class Weights & Evidence Requirements
  for (const comp of catalog) {
    if (compIdMap.has(comp.id)) {
      duplicateCompetencyIds.push(comp.id);
    } else {
      compIdMap.set(comp.id, comp);
    }

    // 1a. Validate Class Weights (if specified, must sum to 1.0 within epsilon ±0.001)
    if (comp.classWeights && Object.keys(comp.classWeights).length > 0) {
      const weights = Object.values(comp.classWeights).filter((w): w is number => typeof w === 'number');
      const sum = weights.reduce((acc, val) => acc + val, 0);
      const hasNonPositive = weights.some(w => w <= 0);

      if (hasNonPositive) {
        invalidClassWeights.push({ competencyId: comp.id, sum, reason: 'Contains non-positive weight' });
      } else if (Math.abs(sum - 1.0) > 0.001) {
        invalidClassWeights.push({ competencyId: comp.id, sum, reason: `Weights sum to ${sum.toFixed(4)}, expected 1.0` });
      }
    }

    // 1b. Validate Evidence Requirements
    if (!comp.evidenceRequirements || comp.evidenceRequirements.length === 0) {
      invalidEvidenceRequirements.push({ competencyId: comp.id, reason: 'evidenceRequirements cannot be empty' });
    } else {
      for (const req of comp.evidenceRequirements) {
        if (req.minScore < 0 || req.minScore > 100) {
          invalidEvidenceRequirements.push({ competencyId: comp.id, reason: `minScore ${req.minScore} out of bounds [0, 100]` });
        }
        if (req.minCount <= 0) {
          invalidEvidenceRequirements.push({ competencyId: comp.id, reason: `minCount ${req.minCount} must be >= 1` });
        }
        if (req.minDistinctFamilies !== undefined && req.minDistinctFamilies <= 0) {
          invalidEvidenceRequirements.push({ competencyId: comp.id, reason: `minDistinctFamilies ${req.minDistinctFamilies} must be >= 1` });
        }
      }
    }
  }

  // 2. Validate Prerequisites & Hierarchy Constraints
  const adj = new Map<string, string[]>();
  for (const comp of catalog) {
    const prereqs = comp.prerequisites || [];
    const seenPrereqs = new Set<string>();

    for (const p of prereqs) {
      if (p === comp.id) {
        selfDependencies.push(comp.id);
      }
      if (seenPrereqs.has(p)) {
        duplicatePrerequisites.push({ competencyId: comp.id, duplicateId: p });
      }
      seenPrereqs.add(p);

      const targetPrereq = compIdMap.get(p);
      if (!targetPrereq) {
        missingReferences.push({ competencyId: comp.id, missingPrereqId: p, type: 'prerequisite' });
      } else {
        // Check level hierarchy: A lower-level competency cannot require a strictly higher-level competency
        // unless allowHigherLevelPrerequisite is explicitly set to true.
        const compLevelRank = LEVEL_RANK[comp.level];
        const prereqLevelRank = LEVEL_RANK[targetPrereq.level];
        if (prereqLevelRank > compLevelRank && !comp.allowHigherLevelPrerequisite) {
          invalidCrossLevelPrerequisites.push({
            competencyId: comp.id,
            compLevel: comp.level,
            prereqId: p,
            prereqLevel: targetPrereq.level,
          });
        }
      }
    }
    adj.set(comp.id, prereqs);

    // 2a. Check Recommended Prerequisites
    if (comp.recommendedPrerequisites) {
      for (const rec of comp.recommendedPrerequisites) {
        if (rec === comp.id) {
          selfDependencies.push(comp.id);
        }
        if (!compIdMap.has(rec)) {
          missingReferences.push({ competencyId: comp.id, missingPrereqId: rec, type: 'recommended' });
        }
      }
    }
  }

  // 3. Topological Cycle Detection via DFS Recursion Stack
  const visited = new Set<string>();
  const inStack = new Set<string>();
  const cycles: string[][] = [];

  function dfs(node: string, path: string[]) {
    visited.add(node);
    inStack.add(node);
    path.push(node);

    for (const prereq of adj.get(node) || []) {
      // Ignore missing references in cycle check (already reported)
      if (!compIdMap.has(prereq)) continue;

      if (!visited.has(prereq)) {
        dfs(prereq, [...path]);
      } else if (inStack.has(prereq)) {
        const cycleStartIndex = path.indexOf(prereq);
        cycles.push([...path.slice(cycleStartIndex), prereq]);
      }
    }

    inStack.delete(node);
  }

  for (const comp of catalog) {
    if (!visited.has(comp.id)) {
      dfs(comp.id, []);
    }
  }

  const valid = (
    duplicateCompetencyIds.length === 0 &&
    missingReferences.length === 0 &&
    selfDependencies.length === 0 &&
    duplicatePrerequisites.length === 0 &&
    cycles.length === 0 &&
    invalidCrossLevelPrerequisites.length === 0 &&
    invalidClassWeights.length === 0 &&
    invalidEvidenceRequirements.length === 0
  );

  return {
    valid,
    duplicateCompetencyIds,
    missingReferences,
    selfDependencies,
    duplicatePrerequisites,
    cycles,
    invalidCrossLevelPrerequisites,
    invalidClassWeights,
    invalidEvidenceRequirements,
  };
}
