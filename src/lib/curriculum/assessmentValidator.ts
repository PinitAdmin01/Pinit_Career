// src/lib/curriculum/assessmentValidator.ts
// Strict Runtime Validation for Assessments, Rubrics, Attempts, and Results

import {
  Assessment,
  AssessmentItem,
  AssessmentAttempt,
  AssessmentResult,
  RubricDimension,
} from './assessmentTypes';
import { CurriculumValidationError } from './validator';

export class AssessmentValidator {
  /**
   * Validates a Rubric specification and verifies weights sum to 1.0.
   */
  static validateRubric(dimensions: RubricDimension[]): void {
    if (!dimensions || dimensions.length === 0) {
      throw new CurriculumValidationError('Rubric must define at least one dimension', 'EMPTY_RUBRIC_DIMENSIONS');
    }

    let totalWeight = 0;
    const seenNames = new Set<string>();

    for (const dim of dimensions) {
      if (!dim.id || !dim.name) {
        throw new CurriculumValidationError('Rubric dimension must have id and name', 'INVALID_RUBRIC_DIMENSION');
      }
      if (seenNames.has(dim.name)) {
        throw new CurriculumValidationError(`Duplicate rubric dimension '${dim.name}' detected`, 'DUPLICATE_RUBRIC_DIMENSION');
      }
      seenNames.add(dim.name);

      if (typeof dim.weight !== 'number' || dim.weight <= 0 || dim.weight > 1) {
        throw new CurriculumValidationError(
          `Rubric dimension '${dim.name}' weight must be between 0 and 1. Received ${dim.weight}`,
          'INVALID_RUBRIC_WEIGHT'
        );
      }
      if (typeof dim.maxPoints !== 'number' || dim.maxPoints <= 0) {
        throw new CurriculumValidationError(
          `Rubric dimension '${dim.name}' maxPoints must be greater than 0. Received ${dim.maxPoints}`,
          'INVALID_RUBRIC_MAX_POINTS'
        );
      }
      totalWeight += dim.weight;
    }

    // Weight sum check with epsilon tolerance
    if (Math.abs(totalWeight - 1.0) > 0.001) {
      throw new CurriculumValidationError(
        `Rubric dimension weights must sum to 1.0 (100%). Current sum: ${totalWeight.toFixed(4)}`,
        'RUBRIC_WEIGHT_SUM_INVALID'
      );
    }
  }

  /**
   * Validates an individual Assessment Item.
   */
  static validateItem(item: AssessmentItem): void {
    if (!item.id || !item.assessmentId) {
      throw new CurriculumValidationError('Assessment item must have valid id and assessmentId', 'INVALID_ITEM_ID');
    }
    if (typeof item.points !== 'number' || item.points <= 0) {
      throw new CurriculumValidationError(`Item ${item.id} points must be greater than 0`, 'INVALID_ITEM_POINTS');
    }
    if (typeof item.order !== 'number' || item.order < 1) {
      throw new CurriculumValidationError(`Item ${item.id} order must be at least 1`, 'INVALID_ITEM_ORDER');
    }

    if (item.itemType === 'MCQ') {
      if (!item.options || item.options.length < 2) {
        throw new CurriculumValidationError(`MCQ item ${item.id} must have at least 2 options`, 'INSUFFICIENT_MCQ_OPTIONS');
      }
      if (typeof item.correctIndex !== 'number' || item.correctIndex < 0 || item.correctIndex >= item.options.length) {
        throw new CurriculumValidationError(
          `MCQ item ${item.id} correctIndex ${item.correctIndex} is out of bounds`,
          'INVALID_MCQ_CORRECT_INDEX'
        );
      }
    }

    if (item.rubricDimensions && item.rubricDimensions.length > 0) {
      AssessmentValidator.validateRubric(item.rubricDimensions);
    }
  }

  /**
   * Validates a complete Assessment definition.
   */
  static validateAssessment(assessment: Assessment): void {
    if (!assessment.id || !assessment.assessmentCode) {
      throw new CurriculumValidationError('Assessment must have valid id and assessmentCode', 'INVALID_ASSESSMENT_ID');
    }
    if (!assessment.title) {
      throw new CurriculumValidationError('Assessment must have a title', 'MISSING_ASSESSMENT_TITLE');
    }
    if (typeof assessment.passingScore !== 'number' || assessment.passingScore < 0 || assessment.passingScore > 100) {
      throw new CurriculumValidationError(
        `Assessment passingScore must be between 0 and 100. Received ${assessment.passingScore}`,
        'INVALID_PASSING_SCORE'
      );
    }
    if (typeof assessment.timeLimitMinutes !== 'number' || assessment.timeLimitMinutes < 0) {
      throw new CurriculumValidationError('Assessment timeLimitMinutes must be non-negative', 'INVALID_TIME_LIMIT');
    }
    if (!assessment.items || assessment.items.length === 0) {
      throw new CurriculumValidationError('Assessment must contain at least one assessment item', 'EMPTY_ASSESSMENT_ITEMS');
    }

    const seenItemIds = new Set<string>();
    const seenOrders = new Set<number>();

    for (const item of assessment.items) {
      if (item.assessmentId !== assessment.id) {
        throw new CurriculumValidationError(
          `Item ${item.id} assessmentId '${item.assessmentId}' does not match parent assessment '${assessment.id}'`,
          'ITEM_ASSESSMENT_MISMATCH'
        );
      }
      if (seenItemIds.has(item.id)) {
        throw new CurriculumValidationError(`Duplicate item id '${item.id}' in assessment`, 'DUPLICATE_ITEM_ID');
      }
      seenItemIds.add(item.id);

      if (seenOrders.has(item.order)) {
        throw new CurriculumValidationError(`Duplicate item order ${item.order} in assessment`, 'DUPLICATE_ITEM_ORDER');
      }
      seenOrders.add(item.order);

      AssessmentValidator.validateItem(item);
    }
  }

  /**
   * Validates an Attempt submission before evaluation.
   */
  static validateAttemptSubmission(attempt: AssessmentAttempt, assessment: Assessment): void {
    if (!attempt.id || !attempt.studentId) {
      throw new CurriculumValidationError('Attempt must have valid id and studentId', 'INVALID_ATTEMPT_IDENTITY');
    }
    if (attempt.assessmentId !== assessment.id) {
      throw new CurriculumValidationError(
        `Attempt assessmentId '${attempt.assessmentId}' does not match assessment '${assessment.id}'`,
        'ATTEMPT_ASSESSMENT_MISMATCH'
      );
    }
    if (typeof attempt.attemptNumber !== 'number' || attempt.attemptNumber < 1) {
      throw new CurriculumValidationError(`Invalid attemptNumber ${attempt.attemptNumber}`, 'INVALID_ATTEMPT_NUMBER');
    }

    // Attempt Limit Check
    if (assessment.maxAttempts > 0 && attempt.attemptNumber > assessment.maxAttempts) {
      throw new CurriculumValidationError(
        `Attempt ${attempt.attemptNumber} exceeds maximum allowed attempts (${assessment.maxAttempts})`,
        'MAX_ATTEMPTS_EXCEEDED'
      );
    }

    // Expiration Check (Timed Assessments)
    if (attempt.expiresAt && attempt.submittedAt) {
      const submitTime = new Date(attempt.submittedAt).getTime();
      const expireTime = new Date(attempt.expiresAt).getTime();
      // Allow 5 second network latency buffer
      if (submitTime > expireTime + 5000) {
        throw new CurriculumValidationError(
          `Attempt submitted at ${attempt.submittedAt} after expiration time ${attempt.expiresAt}`,
          'ATTEMPT_EXPIRED'
        );
      }
    }
  }

  /**
   * Validates final Assessment Result integrity.
   * GUARANTEE: If mandatory criteria failed or a critical failure is present,
   * passStatus MUST be 'FAIL' regardless of raw numeric score.
   */
  static validateResultIntegrity(result: AssessmentResult, assessment: Assessment): void {
    if (!result.id || !result.attemptId) {
      throw new CurriculumValidationError('Result must specify id and attemptId', 'INVALID_RESULT_IDENTITY');
    }

    // Critical Invariant: If critical failures triggered, cannot pass
    if (result.hasCriticalFailures && result.passed) {
      throw new CurriculumValidationError(
        `Result cannot be marked passed when critical failures are present: ${result.criticalFailureReasons.join(', ')}`,
        'CRITICAL_FAILURE_PASS_CONTRADICTION'
      );
    }

    // Critical Invariant: If mandatory criteria not met, cannot pass
    if (!result.mandatoryCriteriaMet && result.passed) {
      throw new CurriculumValidationError(
        'Result cannot be marked passed when mandatory criteria were not satisfied',
        'MANDATORY_CRITERIA_PASS_CONTRADICTION'
      );
    }

    // Score verification
    if (result.normalizedScore < assessment.passingScore && result.passed) {
      throw new CurriculumValidationError(
        `Result score (${result.normalizedScore}) below passing threshold (${assessment.passingScore}) cannot be marked passed`,
        'SCORE_PASS_THRESHOLD_CONTRADICTION'
      );
    }
  }
}
