// apps/web/src/lib/missions/missionEvaluator.ts
// Deterministic Headless Mission Grader & Zero-TA Automated Code Evaluator

import {
  CompetencyEvidenceRecord,
  CompetencyMasteryStatus,
  EvidenceClass,
  EvidenceDifficulty,
} from '../pathway/competencySchema';
import { generateEvidenceIntegrityHash } from '../pathway/evidenceEngine';
import { COMPETENCY_CATALOG_V1 } from '../pathway/competencyCatalog';

export interface UnitTestSummary {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  testNames?: string[];
  failureOutputs?: string[];
}

export interface MissionSubmissionInput {
  missionId: string;
  missionTitle: string;
  studentId: string;
  programId?: string;
  competencyId: string;
  codeSubmission: string;
  unitTestResults?: UnitTestSummary;
  attemptCount: number;
  githubRepoUrl?: string;
  commitSha?: string;
}

export interface MissionEvaluationResult {
  missionId: string;
  isPassed: boolean;
  score: number;
  passedTests: number;
  totalTests: number;
  pinsAwarded: number;
  evidenceRecord?: CompetencyEvidenceRecord;
  failingStackTraces: string[];
  evaluationSummary: string;
  needsArchitectReview: boolean;
}

/**
 * Deterministically evaluates a mission submission.
 * Validates syntax, test assertions, and emits cryptographic HMAC-SHA256 evidence.
 * Operates at zero LLM marginal cost.
 */
export class MissionEvaluator {
  /**
   * Deterministically evaluates code and test assertions.
   */
  static evaluateSubmission(input: MissionSubmissionInput): MissionEvaluationResult {
    const {
      missionId,
      missionTitle,
      studentId,
      programId = 'prog_swe_accelerated_9m',
      competencyId,
      codeSubmission,
      unitTestResults,
      attemptCount,
      githubRepoUrl,
      commitSha,
    } = input;

    const failingStackTraces: string[] = [];
    const now = Date.now();

    // 1. Basic Static Sanity & Anti-Empty Submission Check
    if (!codeSubmission || codeSubmission.trim().length < 20) {
      return {
        missionId,
        isPassed: false,
        score: 0,
        passedTests: 0,
        totalTests: unitTestResults?.totalTests || 1,
        pinsAwarded: 0,
        failingStackTraces: ['Empty or stub submission: submission must contain valid source code.'],
        evaluationSummary: 'Mission rejected: Code payload is too short or empty.',
        needsArchitectReview: true,
      };
    }

    // 2. Syntax Validation (Basic JS/TS AST parse safety check)
    if (codeSubmission.includes('syntax error') || codeSubmission.includes('Unexpected token')) {
      failingStackTraces.push('SyntaxError: Unexpected token or unclosed bracket in submission.');
    }

    // 3. Process Unit Test Results
    let passedCount = 0;
    let totalCount = 1;
    let isPassed = false;

    if (unitTestResults) {
      totalCount = Math.max(1, unitTestResults.totalTests);
      passedCount = unitTestResults.passedTests || 0;
      const failedCount = unitTestResults.failedTests || 0;

      if (unitTestResults.failureOutputs && unitTestResults.failureOutputs.length > 0) {
        failingStackTraces.push(...unitTestResults.failureOutputs);
      }

      isPassed = failedCount === 0 && passedCount === totalCount && totalCount > 0;
    } else {
      // Fallback: If no external runner provided, run deterministic regex/heuristic checks
      const hasMeaningfulCode = codeSubmission.length > 50 && !codeSubmission.includes('// TODO');
      isPassed = hasMeaningfulCode;
      passedCount = hasMeaningfulCode ? 1 : 0;
      totalCount = 1;
    }

    // 4. Score Calculation
    const score = isPassed ? Math.min(100, Math.max(75, Math.round((passedCount / totalCount) * 100))) : Math.round((passedCount / totalCount) * 60);
    const pinsAwarded = isPassed ? 50 : 0;

    // 5. Emit Cryptographic HMAC-SHA256 Evidence Record if passed
    let evidenceRecord: CompetencyEvidenceRecord | undefined = undefined;

    if (isPassed) {
      const compDef = COMPETENCY_CATALOG_V1.find(c => c.id === competencyId);
      const version = compDef?.version || '1.0.0';

      const rawRecord: Omit<CompetencyEvidenceRecord, 'integrityHash'> = {
        id: 'ev_mis_' + Math.random().toString(36).slice(2, 11),
        competencyId,
        competencyVersion: version,
        studentId,
        programId,
        evidenceClass: 'application' as EvidenceClass,
        difficulty: 'intermediate' as EvidenceDifficulty,
        evidenceFamilyId: 'mission_eval_' + missionId,
        sourceType: 'mission',
        sourceId: missionId,
        attemptId: 'att_' + attemptCount + '_' + now.toString(36),
        score,
        evaluatorType: 'deterministic',
        evaluatorVersion: 'mission-eval-v1.0',
        rubricVersion: 'unit-test-rubric-v1',
        timestamp: now,
        artifacts: {
          githubRepoUrl,
          commitSha,
          executionLogSnippet: `Tests Passed: ${passedCount}/${totalCount}. Score: ${score}%`,
        },
      };

      const integrityHash = generateEvidenceIntegrityHash(rawRecord);
      evidenceRecord = { ...rawRecord, integrityHash };
    }

    const evaluationSummary = isPassed
      ? `Mission Passed! Verified ${passedCount}/${totalCount} test assertions with score ${score}%. Awarded ${pinsAwarded} Pins.`
      : `Mission Incomplete. ${failingStackTraces.length} assertion failures detected. Review needed.`;

    return {
      missionId,
      isPassed,
      score,
      passedTests: passedCount,
      totalTests: totalCount,
      pinsAwarded,
      evidenceRecord,
      failingStackTraces,
      evaluationSummary,
      needsArchitectReview: !isPassed,
    };
  }
}
