// apps/web/src/lib/pathway/masteryEngine.ts
// Gated Multi-Class Mastery Engine: Gating, Composite Scoring & Lifecycle State Machine

import {
  CompetencyDefinition,
  CompetencyEvidenceRecord,
  CompetencyMasteryStatus,
  DIFFICULTY_RANK,
  EvidenceClass,
  MasteryState,
} from './competencySchema';
import { processEvidenceLedger, QualifiedEvidenceSummary } from './evidenceEngine';

export const MASTERY_POLICY_VERSION = 'policy-v1.0.0';

export interface MasteryEvaluationOptions {
  competency: CompetencyDefinition;
  rawEvidenceRecords: CompetencyEvidenceRecord[];
  prerequisiteMasteryStates?: Record<string, MasteryState>;
  fsrsRecallWeak?: boolean;
  policyVersion?: string;
}

/**
 * Evaluates student competency mastery using strict multi-class evidence gates,
 * difficulty thresholds, anti-gaming diversity rules, and prerequisite DAG constraints.
 */
export function evaluateCompetencyMastery(options: MasteryEvaluationOptions): CompetencyMasteryStatus {
  const {
    competency,
    rawEvidenceRecords,
    prerequisiteMasteryStates = {},
    fsrsRecallWeak = false,
    policyVersion = MASTERY_POLICY_VERSION,
  } = options;

  // 1. Process evidence ledger with anti-gaming deduplication
  const evidenceSummary = processEvidenceLedger(competency, rawEvidenceRecords);
  const blockedBy: string[] = [];

  // 2. Check Prerequisite Constraints
  let prerequisitesSatisfied = true;
  for (const prereqId of competency.prerequisites) {
    const prereqState = prerequisiteMasteryStates[prereqId];
    const isPrereqPassed = prereqState === 'demonstrated' || prereqState === 'verified' || prereqState === 'verified_needs_review';

    if (!isPrereqPassed) {
      prerequisitesSatisfied = false;
      blockedBy.push(`Prerequisite not met: [${prereqId}] (current state: ${prereqState || 'locked'})`);
    }
  }

  // 3. Evaluate Gated Evidence Requirements
  const classBreakdown: CompetencyMasteryStatus['classBreakdown'] = {
    knowledge: { averageScore: 0, evidenceCount: 0, highestDifficulty: 'basic', gateSatisfied: false },
    application: { averageScore: 0, evidenceCount: 0, highestDifficulty: 'basic', gateSatisfied: false },
    debugging: { averageScore: 0, evidenceCount: 0, highestDifficulty: 'basic', gateSatisfied: false },
    architecture: { averageScore: 0, evidenceCount: 0, highestDifficulty: 'basic', gateSatisfied: false },
    production: { averageScore: 0, evidenceCount: 0, highestDifficulty: 'basic', gateSatisfied: false },
    defense: { averageScore: 0, evidenceCount: 0, highestDifficulty: 'basic', gateSatisfied: false },
  };

  // Populate actual evidence data into breakdown
  for (const ec of Object.keys(classBreakdown) as EvidenceClass[]) {
    const summary = evidenceSummary.classSummaries[ec];
    classBreakdown[ec].averageScore = summary.averageScore;
    classBreakdown[ec].evidenceCount = summary.count;
    classBreakdown[ec].highestDifficulty = summary.highestDifficulty;
  }

  let allGatesPassed = true;

  for (const req of competency.evidenceRequirements) {
    const summary = evidenceSummary.classSummaries[req.evidenceClass];
    const breakdown = classBreakdown[req.evidenceClass];

    // Check count
    const countPassed = summary.count >= req.minCount;
    // Check score
    const scorePassed = summary.averageScore >= req.minScore;
    // Check difficulty rank
    const reqDifficultyRank = DIFFICULTY_RANK[req.minimumDifficulty];
    const actualDifficultyRank = DIFFICULTY_RANK[summary.highestDifficulty];
    const difficultyPassed = actualDifficultyRank >= reqDifficultyRank;
    // Check family diversity
    const familiesPassed = req.minDistinctFamilies ? summary.families.length >= req.minDistinctFamilies : true;

    // Check source types if specified
    let sourceTypesPassed = true;
    if (req.requiredSourceTypes && req.requiredSourceTypes.length > 0) {
      const qualifyingSourceTypes = evidenceSummary.qualifiedIndependentRecords
        .filter(r => r.evidenceClass === req.evidenceClass)
        .map(r => r.sourceType);
      sourceTypesPassed = req.requiredSourceTypes.every(st => qualifyingSourceTypes.includes(st));
    }

    const gatePassed = countPassed && scorePassed && difficultyPassed && familiesPassed && sourceTypesPassed;
    breakdown.gateSatisfied = gatePassed;

    if (!gatePassed) {
      allGatesPassed = false;
      const reasons: string[] = [];
      if (!countPassed) reasons.push(`needs ${req.minCount} independent tasks (has ${summary.count})`);
      if (!scorePassed) reasons.push(`avg score ${summary.averageScore}/${req.minScore}`);
      if (!difficultyPassed) reasons.push(`requires ${req.minimumDifficulty} difficulty (highest is ${summary.highestDifficulty})`);
      if (!familiesPassed) reasons.push(`needs ${req.minDistinctFamilies} problem families (has ${summary.families.length})`);
      if (!sourceTypesPassed) reasons.push(`missing required source type (${req.requiredSourceTypes?.join(', ')})`);

      blockedBy.push(`Gate [${req.evidenceClass}]: ${reasons.join(', ')}`);
    }
  }

  // 4. Critical Failure Enforcement
  let hasCriticalFailures = false;
  if (competency.criticalFailureRules && competency.criticalFailureRules.length > 0) {
    for (const rule of competency.criticalFailureRules) {
      if (evidenceSummary.criticalFailures.includes(rule.code) && rule.blocksMastery) {
        hasCriticalFailures = true;
        blockedBy.push(`Critical failure detected: ${rule.description} (${rule.code})`);
      }
    }
  }

  // 5. Verification Requirements Evaluation
  let verificationSatisfied = false;
  if (competency.verificationRequirements) {
    const vReq = competency.verificationRequirements;
    let artifactsPassed = true;
    let evaluatorsPassed = true;
    let defensePassed = true;

    const allArtifacts = evidenceSummary.qualifiedIndependentRecords.flatMap(r => {
      const list: string[] = [];
      if (r.artifacts?.githubRepoUrl || r.artifacts?.repoUrl) list.push('github_repo');
      if (r.artifacts?.commitSha) list.push('commit_sha');
      if (r.artifacts?.diagramUrl || (r.artifacts as any)?.whiteboard_diagram) list.push('whiteboard_diagram');
      if (r.artifacts?.executionLogSnippet || r.artifacts?.liveUrl) list.push('live_url');
      return list;
    });

    if (vReq.requiredArtifacts && vReq.requiredArtifacts.length > 0) {
      artifactsPassed = vReq.requiredArtifacts.every(art => allArtifacts.includes(art));
    }

    if (vReq.requiredEvaluatorTypes && vReq.requiredEvaluatorTypes.length > 0) {
      const activeEvaluators = evidenceSummary.qualifiedIndependentRecords.map(r => r.evaluatorType);
      evaluatorsPassed = vReq.requiredEvaluatorTypes.some(et => activeEvaluators.includes(et));
    }

    if (vReq.minDefenseScore !== undefined) {
      const defenseScore = evidenceSummary.classSummaries.defense.averageScore;
      defensePassed = defenseScore >= vReq.minDefenseScore;
    }

    verificationSatisfied = artifactsPassed && evaluatorsPassed && defensePassed;
  } else {
    // If no specific verification requirements, presence of valid external artifacts yields verified
    const hasExternalCommit = evidenceSummary.qualifiedIndependentRecords.some(r => !!r.artifacts?.commitSha);
    verificationSatisfied = hasExternalCommit;
  }

  // 6. Calculate Normalized Gated Composite Score
  let compositeScore = 0;
  const activeWeights: Partial<Record<EvidenceClass, number>> = {};

  if (competency.classWeights && Object.keys(competency.classWeights).length > 0) {
    // Use defined class weights normalized over active classes
    const classes = Object.keys(competency.classWeights) as EvidenceClass[];
    const totalWeight = classes.reduce((sum, c) => sum + (competency.classWeights?.[c] || 0), 0);

    if (totalWeight > 0) {
      for (const c of classes) {
        activeWeights[c] = (competency.classWeights[c] || 0) / totalWeight;
      }
    }
  } else {
    // Default fallback: Equal weights among classes with evidence
    const classesWithEvidence = (Object.keys(classBreakdown) as EvidenceClass[]).filter(c => classBreakdown[c].evidenceCount > 0);
    const weightPerClass = classesWithEvidence.length > 0 ? 1 / classesWithEvidence.length : 0;
    for (const c of classesWithEvidence) {
      activeWeights[c] = weightPerClass;
    }
  }

  for (const c of Object.keys(activeWeights) as EvidenceClass[]) {
    const weight = activeWeights[c] || 0;
    const avgScore = classBreakdown[c].averageScore;
    compositeScore += weight * avgScore;
  }

  compositeScore = Math.round(compositeScore * 100) / 100;

  // 7. Determine Final Mastery State
  let state: MasteryState = 'locked';

  if (!prerequisitesSatisfied) {
    state = 'locked';
  } else if (hasCriticalFailures) {
    state = 'provisional';
  } else if (allGatesPassed) {
    if (verificationSatisfied) {
      state = fsrsRecallWeak ? 'verified_needs_review' : 'verified';
    } else {
      state = 'demonstrated';
    }
  } else {
    // Intermediate in-progress states
    const knowledgePassed = classBreakdown.knowledge.gateSatisfied || classBreakdown.knowledge.evidenceCount > 0;
    const applicationPassed = classBreakdown.application.gateSatisfied || classBreakdown.application.evidenceCount > 0;

    if (knowledgePassed && applicationPassed) {
      state = 'provisional';
    } else if (knowledgePassed) {
      state = 'practice';
    } else if (evidenceSummary.totalRawRecords > 0) {
      state = 'learning';
    } else {
      state = 'learning';
    }
  }

  // Calculate Evidence Coverage Pct
  const totalRequiredGates = competency.evidenceRequirements.length;
  const passedGatesCount = competency.evidenceRequirements.filter(req => classBreakdown[req.evidenceClass].gateSatisfied).length;
  const evidenceCoveragePct = totalRequiredGates > 0 ? Math.round((passedGatesCount / totalRequiredGates) * 100) : 100;

  const latestQualifiedEvidenceAt = evidenceSummary.qualifiedIndependentRecords.reduce(
    (max, r) => Math.max(max, r.timestamp),
    0
  );

  return {
    competencyId: competency.id,
    competencyVersion: competency.version,
    masteryPolicyVersion: policyVersion,
    state,
    compositeScore,
    evidenceCoveragePct,
    independentEvidenceCount: evidenceSummary.independentSourceCount,
    distinctFamilyCount: evidenceSummary.distinctFamilyCount,
    latestQualifiedEvidenceAt,
    nextReviewAt: fsrsRecallWeak ? Date.now() : undefined,
    classBreakdown,
    allGatesPassed,
    hasCriticalFailures,
    blockedBy: blockedBy.length > 0 ? blockedBy : undefined,
    lastUpdated: Date.now(),
  };
}
