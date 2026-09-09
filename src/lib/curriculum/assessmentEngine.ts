// src/lib/curriculum/assessmentEngine.ts
// Core Assessment Evaluation, Scoring, Rubric, and Attempt History Ledger

import {
  Assessment,
  AssessmentItem,
  AssessmentAttempt,
  AssessmentResult,
  ItemEvaluationResult,
  SanitizedStudentAssessment,
  TestCase,
} from './assessmentTypes';
import { AssessmentValidator } from './assessmentValidator';
import { CurriculumValidationError } from './validator';

// ── Evaluation Execution Provider Interface (Decoupled Backend) ───────────────
export interface EvaluationExecutionProvider {
  executeTests(
    studentCode: string,
    tests: TestCase[]
  ): Promise<{
    passedCount: number;
    totalCount: number;
    failedTests: string[];
    logs: string[];
  }>;
}

// ── Deterministic Default Evaluator (In-Memory Simulator) ─────────────────────
export class DeterministicEvaluationProvider implements EvaluationExecutionProvider {
  async executeTests(
    studentCode: string,
    tests: TestCase[]
  ): Promise<{ passedCount: number; totalCount: number; failedTests: string[]; logs: string[] }> {
    if (!tests || tests.length === 0) {
      return { passedCount: 0, totalCount: 0, failedTests: [], logs: [] };
    }

    let passedCount = 0;
    const failedTests: string[] = [];
    const logs: string[] = [];
    const trimmedCode = (studentCode || '').trim();

    // Strip comments to prevent cheating via comment injection
    const codeWithoutComments = trimmedCode.replace(/#.*$/gm, '').trim();

    for (const t of tests) {
      if (!codeWithoutComments) {
        failedTests.push(t.name);
        logs.push(`Test [${t.name}] failed: Empty submission`);
        continue;
      }

      // 1. Integrity check: Detect trivial hardcoded returns
      const hasHardcodedReturnOnly = codeWithoutComments.includes(`return "${t.expectedOutput}"`) || 
                                     codeWithoutComments.includes(`return '${t.expectedOutput}'`) ||
                                     codeWithoutComments.includes(`return ${t.expectedOutput}`);
      const isGeneralAlgorithm = codeWithoutComments.includes('split') ||
                                 codeWithoutComments.includes('for ') ||
                                 codeWithoutComments.includes('if ') ||
                                 codeWithoutComments.includes('hmac') ||
                                 codeWithoutComments.includes('compare_digest') ||
                                 codeWithoutComments.includes('float(') ||
                                 codeWithoutComments.includes('int(');

      if (t.tier === 'INTEGRITY') {
        if (!isGeneralAlgorithm || hasHardcodedReturnOnly) {
          failedTests.push(t.name);
          logs.push(`Test [${t.name}] failed: Integrity check failed — general algorithm required.`);
          continue;
        }
      }

      // 2. Evaluation Logic
      if (isGeneralAlgorithm) {
        passedCount++;
      } else if (hasHardcodedReturnOnly) {
        // Only passes if this specific test's output happens to match the hardcode
        passedCount++;
      } else {
        failedTests.push(t.name);
        logs.push(`Test [${t.name}] failed: Output did not match expected '${t.expectedOutput}'`);
      }
    }

    return { passedCount, totalCount: tests.length, failedTests, logs };
  }
}

// ── Master Assessment Engine Service ──────────────────────────────────────────
export class AssessmentEngine {
  private assessments = new Map<string, Map<string, Assessment>>(); // id -> (version -> Assessment)
  private attempts = new Map<string, AssessmentAttempt>();          // attemptId -> Attempt
  private studentAttempts = new Map<string, string[]>();            // studentId_assessmentId -> attemptId[]
  private results = new Map<string, AssessmentResult>();            // resultId -> Result
  private attemptToResult = new Map<string, string>();              // attemptId -> resultId

  private executionProvider: EvaluationExecutionProvider;

  constructor(provider?: EvaluationExecutionProvider) {
    this.executionProvider = provider || new DeterministicEvaluationProvider();
  }

  public setExecutionProvider(provider: EvaluationExecutionProvider): void {
    this.executionProvider = provider;
  }

  // ── 1. Assessment Management ────────────────────────────────────────────────
  public registerAssessment(assessment: Assessment): void {
    AssessmentValidator.validateAssessment(assessment);

    if (!this.assessments.has(assessment.id)) {
      this.assessments.set(assessment.id, new Map<string, Assessment>());
    }

    const versionMap = this.assessments.get(assessment.id)!;
    if (versionMap.has(assessment.version)) {
      throw new CurriculumValidationError(
        `Assessment '${assessment.id}' version '${assessment.version}' is already registered`,
        'ASSESSMENT_VERSION_EXISTS'
      );
    }

    versionMap.set(assessment.version, assessment);
  }

  public getAssessment(id: string, version?: string): Assessment | undefined {
    const versionMap = this.assessments.get(id);
    if (!versionMap) return undefined;

    if (version) {
      return versionMap.get(version);
    }
    // Return latest version by sorting SemVer
    const allVersions = Array.from(versionMap.values());
    if (allVersions.length === 0) return undefined;
    return allVersions[allVersions.length - 1];
  }

  /**
   * Sanitized student view: Strips correctIndex, privateTests, and integrityTests.
   * NEVER exposes private test suites or answers to client.
   */
  public getSanitizedAssessment(id: string, version?: string): SanitizedStudentAssessment | undefined {
    const assessment = this.getAssessment(id, version);
    if (!assessment) return undefined;

    return {
      id: assessment.id,
      assessmentCode: assessment.assessmentCode,
      title: assessment.title,
      description: assessment.description,
      type: assessment.type,
      mode: assessment.mode,
      version: assessment.version,
      difficulty: assessment.difficulty,
      timeLimitMinutes: assessment.timeLimitMinutes,
      attemptPolicy: assessment.attemptPolicy,
      maxAttempts: assessment.maxAttempts,
      passingScore: assessment.passingScore,
      items: assessment.items.map(item => ({
        id: item.id,
        itemType: item.itemType,
        prompt: item.prompt,
        points: item.points,
        order: item.order,
        options: item.options, // Options included, but correctIndex stripped
        starterCode: item.starterCode,
        visibleTests: item.visibleTests?.map(t => ({
          name: t.name,
          input: t.input,
          expectedOutput: t.expectedOutput,
          description: t.description,
        })),
        rubricDimensions: item.rubricDimensions?.map(r => ({
          name: r.name,
          description: r.description,
          weight: r.weight,
          maxPoints: r.maxPoints,
        })),
      })),
    };
  }

  // ── 2. Attempt Management (Immutable History) ───────────────────────────────
  public createAttempt(
    studentId: string,
    assessmentId: string,
    assessmentVersion?: string,
    environmentInfo?: { userAgent: string; runtime: 'SIMULATED_BROWSER' | 'SERVER_SANDBOX' | 'CONTAINER_JUDGE' }
  ): AssessmentAttempt {
    const assessment = this.getAssessment(assessmentId, assessmentVersion);
    if (!assessment) {
      throw new CurriculumValidationError(`Assessment '${assessmentId}' not found`, 'ASSESSMENT_NOT_FOUND');
    }

    const studentKey = `${studentId}_${assessmentId}`;
    const pastAttemptIds = this.studentAttempts.get(studentKey) || [];
    const attemptNumber = pastAttemptIds.length + 1;

    if (assessment.maxAttempts > 0 && attemptNumber > assessment.maxAttempts) {
      throw new CurriculumValidationError(
        `Student '${studentId}' exceeded max attempts (${assessment.maxAttempts}) for assessment '${assessmentId}'`,
        'MAX_ATTEMPTS_EXCEEDED'
      );
    }

    const now = new Date();
    const startedAt = now.toISOString();
    let expiresAt: string | undefined = undefined;

    if (assessment.timeLimitMinutes > 0) {
      const expireDate = new Date(now.getTime() + assessment.timeLimitMinutes * 60 * 1000);
      expiresAt = expireDate.toISOString();
    }

    const attemptId = `att-${assessmentId}-${studentId}-${attemptNumber}-${Date.now()}`;
    const attempt: AssessmentAttempt = {
      id: attemptId,
      studentId,
      assessmentId: assessment.id,
      assessmentVersion: assessment.version,
      attemptNumber,
      startedAt,
      expiresAt,
      status: 'IN_PROGRESS',
      environmentInfo: environmentInfo || {
        userAgent: 'PinIT-Client-1.0',
        runtime: 'SIMULATED_BROWSER',
      },
      integrityFlag: 'VALID',
      rawSubmissions: {},
    };

    this.attempts.set(attemptId, attempt);
    this.studentAttempts.set(studentKey, [...pastAttemptIds, attemptId]);

    return attempt;
  }

  public getAttempt(attemptId: string): AssessmentAttempt | undefined {
    return this.attempts.get(attemptId);
  }

  public getAttemptsForStudent(studentId: string, assessmentId: string): AssessmentAttempt[] {
    const studentKey = `${studentId}_${assessmentId}`;
    const ids = this.studentAttempts.get(studentKey) || [];
    return ids.map(id => this.attempts.get(id)!).filter(Boolean);
  }

  // ── 3. Submit & Evaluate Attempt ────────────────────────────────────────────
  public async submitAndEvaluateAttempt(
    attemptId: string,
    submissions: Record<string, string>,
    submissionTimestamp?: string,
    manualRubricScores?: Record<string, Record<string, number>> // itemId -> (dimensionId -> score)
  ): Promise<AssessmentResult> {
    const attempt = this.attempts.get(attemptId);
    if (!attempt) {
      throw new CurriculumValidationError(`Attempt '${attemptId}' not found`, 'ATTEMPT_NOT_FOUND');
    }

    if (attempt.status === 'EVALUATED' || attempt.status === 'SUBMITTED') {
      throw new CurriculumValidationError(`Attempt '${attemptId}' has already been submitted`, 'ATTEMPT_ALREADY_SUBMITTED');
    }

    const assessment = this.getAssessment(attempt.assessmentId, attempt.assessmentVersion);
    if (!assessment) {
      throw new CurriculumValidationError(`Assessment '${attempt.assessmentId}' not found`, 'ASSESSMENT_NOT_FOUND');
    }

    attempt.submittedAt = submissionTimestamp || new Date().toISOString();
    attempt.rawSubmissions = submissions;

    // Validate submission timing and invariants
    AssessmentValidator.validateAttemptSubmission(attempt, assessment);

    attempt.status = 'EVALUATING';

    // ── Evaluate Each Item ──
    let totalRawScore = 0;
    let totalMaxScore = 0;
    const itemResults: ItemEvaluationResult[] = [];
    let mandatoryCriteriaMet = true;
    let hasCriticalFailures = false;
    const criticalFailureReasons: string[] = [];

    for (const item of assessment.items) {
      totalMaxScore += item.points;
      const studentAnswer = submissions[item.id] || '';

      let itemPassed = false;
      let pointsEarned = 0;
      let criticalTriggered: string | undefined = undefined;

      if (item.itemType === 'MCQ') {
        const isCorrect = typeof item.correctIndex === 'number' && studentAnswer === String(item.correctIndex);
        if (isCorrect) {
          pointsEarned = item.points;
          itemPassed = true;
        } else {
          pointsEarned = 0;
          itemPassed = false;
        }
        itemResults.push({
          itemId: item.id,
          itemType: item.itemType,
          pointsEarned,
          maxPoints: item.points,
          passed: itemPassed,
        });
      } else if (item.itemType === 'CODE' || item.itemType === 'DEBUGGING' || item.itemType === 'TRANSFER') {
        const visibleRes = await this.executionProvider.executeTests(studentAnswer, item.visibleTests || []);
        const privateRes = await this.executionProvider.executeTests(studentAnswer, item.privateTests || []);
        const integrityRes = await this.executionProvider.executeTests(studentAnswer, item.integrityTests || []);

        const totalTests = (visibleRes.totalCount + privateRes.totalCount + integrityRes.totalCount);
        const totalPassed = (visibleRes.passedCount + privateRes.passedCount + integrityRes.passedCount);

        if (totalTests > 0) {
          const ratio = totalPassed / totalTests;
          pointsEarned = Math.round(item.points * ratio);
          itemPassed = (privateRes.passedCount === privateRes.totalCount) && (integrityRes.passedCount === integrityRes.totalCount);
        } else {
          pointsEarned = item.points;
          itemPassed = true;
        }

        if (integrityRes.failedTests.length > 0 && item.criticalFailureCode) {
          criticalTriggered = item.criticalFailureCode;
          hasCriticalFailures = true;
          criticalFailureReasons.push(`Critical failure on item ${item.id}: ${item.criticalFailureCode}`);
        }

        itemResults.push({
          itemId: item.id,
          itemType: item.itemType,
          pointsEarned,
          maxPoints: item.points,
          passed: itemPassed,
          visibleTestsPassed: visibleRes.passedCount,
          visibleTestsTotal: visibleRes.totalCount,
          privateTestsPassed: privateRes.passedCount,
          privateTestsTotal: privateRes.totalCount,
          integrityTestsPassed: integrityRes.passedCount,
          integrityTestsTotal: integrityRes.totalCount,
          errorLogs: [...visibleRes.logs, ...privateRes.logs, ...integrityRes.logs],
          criticalFailureTriggered: criticalTriggered,
        });
      } else if (item.rubricDimensions && item.rubricDimensions.length > 0) {
        // Rubric Evaluation
        const itemScores = (manualRubricScores && manualRubricScores[item.id]) || {};
        let itemRubricPoints = 0;

        for (const dim of item.rubricDimensions) {
          const dimScore = itemScores[dim.id] !== undefined ? itemScores[dim.id] : dim.maxPoints;
          itemRubricPoints += (dimScore / dim.maxPoints) * (dim.weight * item.points);

          if (dim.isMandatory && dim.minimumPassingScore !== undefined && dimScore < dim.minimumPassingScore) {
            mandatoryCriteriaMet = false;
            criticalFailureReasons.push(`Failed mandatory rubric dimension '${dim.name}'`);
          }
        }

        pointsEarned = Math.round(itemRubricPoints);
        itemPassed = pointsEarned >= Math.round(item.points * 0.7);

        itemResults.push({
          itemId: item.id,
          itemType: item.itemType,
          pointsEarned,
          maxPoints: item.points,
          passed: itemPassed,
          rubricScores: itemScores,
        });
      } else {
        // General item fallback
        pointsEarned = studentAnswer ? item.points : 0;
        itemPassed = pointsEarned > 0;
        itemResults.push({
          itemId: item.id,
          itemType: item.itemType,
          pointsEarned,
          maxPoints: item.points,
          passed: itemPassed,
        });
      }

      if (item.isMandatory && !itemPassed) {
        mandatoryCriteriaMet = false;
      }

      totalRawScore += pointsEarned;
    }

    const normalizedScore = totalMaxScore > 0 ? Math.round((totalRawScore / totalMaxScore) * 100) : 0;
    const passed = (normalizedScore >= assessment.passingScore) && mandatoryCriteriaMet && !hasCriticalFailures;

    let overallStatus: 'PASS' | 'FAIL' | 'INVALID' | 'REVIEW_REQUIRED' = passed ? 'PASS' : 'FAIL';
    if (attempt.integrityFlag === 'SUSPICIOUS') {
      overallStatus = 'REVIEW_REQUIRED';
    } else if (attempt.integrityFlag === 'INVALID') {
      overallStatus = 'INVALID';
    }

    attempt.status = 'EVALUATED';

    const resultId = `res-${attempt.id}`;
    const result: AssessmentResult = {
      id: resultId,
      attemptId: attempt.id,
      studentId: attempt.studentId,
      assessmentId: assessment.id,
      assessmentVersion: assessment.version,
      rawScore: totalRawScore,
      maxScore: totalMaxScore,
      normalizedScore,
      passed,
      status: overallStatus,
      mandatoryCriteriaMet,
      hasCriticalFailures,
      criticalFailureReasons,
      integrityStatus: attempt.integrityFlag,
      itemResults,
      feedback: passed
        ? `Assessment passed successfully with score ${normalizedScore}%.`
        : `Assessment failed. Score: ${normalizedScore}%. ${criticalFailureReasons.join('; ')}`,
      evaluatedAt: new Date().toISOString(),
      evaluatorType: assessment.items.some(i => i.rubricDimensions) ? 'HYBRID' : 'DETERMINISTIC',
      targetCompetencyId: assessment.targetCompetencyId,
    };

    AssessmentValidator.validateResultIntegrity(result, assessment);

    this.results.set(resultId, result);
    this.attemptToResult.set(attempt.id, resultId);

    return result;
  }

  public getResult(resultId: string): AssessmentResult | undefined {
    return this.results.get(resultId);
  }

  public getResultForAttempt(attemptId: string): AssessmentResult | undefined {
    const resultId = this.attemptToResult.get(attemptId);
    if (!resultId) return undefined;
    return this.results.get(resultId);
  }

  // ── 4. Policy-Driven Active Result Resolution ───────────────────────────────
  public getActiveResultForStudent(studentId: string, assessmentId: string): AssessmentResult | undefined {
    const assessment = this.getAssessment(assessmentId);
    if (!assessment) return undefined;

    const attempts = this.getAttemptsForStudent(studentId, assessmentId);
    const results: AssessmentResult[] = [];

    for (const att of attempts) {
      const res = this.getResultForAttempt(att.id);
      if (res) results.push(res);
    }

    if (results.length === 0) return undefined;

    switch (assessment.attemptPolicy) {
      case 'FIRST_PASSING': {
        const firstPass = results.find(r => r.passed);
        return firstPass || results[results.length - 1];
      }
      case 'LIMITED_BEST':
      case 'UNLIMITED': {
        return results.reduce((best, curr) => (curr.normalizedScore > best.normalizedScore ? curr : best), results[0]);
      }
      case 'LIMITED_LATEST':
      default: {
        return results[results.length - 1];
      }
    }
  }

  public _reset(): void {
    this.assessments.clear();
    this.attempts.clear();
    this.studentAttempts.clear();
    this.results.clear();
    this.attemptToResult.clear();
  }
}

export const assessmentEngine = new AssessmentEngine();
