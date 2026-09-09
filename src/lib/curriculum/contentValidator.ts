// src/lib/curriculum/contentValidator.ts
// Validation Engine for Content Blocks, Day Manifests, and Packet Manifests

import {
  ContentBlock,
  DayContentManifest,
  PacketContentManifest,
} from './contentTypes';
import { CurriculumValidationError } from './validator';

export class ContentValidator {
  /**
   * Validates a single Content Block based on its polymorphic type.
   */
  static validateBlock(block: ContentBlock): void {
    if (!block.id) {
      throw new CurriculumValidationError('Content block must have a valid id', 'INVALID_BLOCK_ID');
    }
    if (!block.title) {
      throw new CurriculumValidationError(`Block ${block.id} must have a title`, 'MISSING_BLOCK_TITLE');
    }
    if (typeof block.order !== 'number' || block.order < 1) {
      throw new CurriculumValidationError(`Block ${block.id} must have a positive order number`, 'INVALID_BLOCK_ORDER');
    }
    if (typeof block.estimatedMinutes !== 'number' || block.estimatedMinutes <= 0) {
      throw new CurriculumValidationError(
        `Block ${block.id} must have a positive estimatedMinutes`,
        'INVALID_BLOCK_ESTIMATED_MINUTES'
      );
    }

    switch (block.type) {
      case 'THEORY':
        if (!block.summary) {
          throw new CurriculumValidationError(`Theory block ${block.id} must have a summary`, 'INCOMPLETE_THEORY_BLOCK');
        }
        break;

      case 'EXAMPLE': {
        const hasCode = Boolean(block.codeSnippet || block.code);
        const hasExplanation = Boolean(block.explanation || block.description);
        if (!hasCode || !hasExplanation) {
          throw new CurriculumValidationError(
            `Example block ${block.id} must have codeSnippet and explanation`,
            'INCOMPLETE_EXAMPLE_BLOCK'
          );
        }
        break;
      }

      case 'GUIDED_PRACTICE': {
        const hasInstructions = Boolean(
          (block.instructions && block.instructions.length > 0) ||
          block.instruction
        );
        const hasOutcome = Boolean(
          block.expectedOutcome ||
          (block.validationCriteria && block.validationCriteria.length > 0)
        );
        if (!hasInstructions || !hasOutcome) {
          throw new CurriculumValidationError(
            `Guided practice block ${block.id} must have instructions and expectedOutcome`,
            'INCOMPLETE_GUIDED_PRACTICE_BLOCK'
          );
        }
        break;
      }

      case 'KNOWLEDGE_CHECK':
        if (!block.diagnosticQuestion || !block.options || block.options.length < 2) {
          throw new CurriculumValidationError(
            `Knowledge check block ${block.id} must have a diagnosticQuestion and at least 2 options`,
            'INCOMPLETE_KNOWLEDGE_CHECK_BLOCK'
          );
        }
        if (block.correctIndex < 0 || block.correctIndex >= block.options.length) {
          throw new CurriculumValidationError(
            `Knowledge check block ${block.id} has invalid correctIndex ${block.correctIndex}`,
            'INVALID_KNOWLEDGE_CHECK_CORRECT_INDEX'
          );
        }
        if (!block.misconceptionIdentified) {
          throw new CurriculumValidationError(
            `Knowledge check block ${block.id} must specify misconceptionIdentified`,
            'MISSING_MISCONCEPTION_DEFINITION'
          );
        }
        break;

      case 'GUIDED_LAB':
        if (!block.task || !block.instructions || block.instructions.length === 0) {
          throw new CurriculumValidationError(
            `Guided lab block ${block.id} must have task and instructions`,
            'INCOMPLETE_GUIDED_LAB_BLOCK'
          );
        }
        break;

      case 'INDEPENDENT_PRACTICE':
        if (!block.task || !block.verificationRequirements || block.verificationRequirements.length === 0) {
          throw new CurriculumValidationError(
            `Independent practice block ${block.id} must have task and verificationRequirements`,
            'INCOMPLETE_INDEPENDENT_PRACTICE_BLOCK'
          );
        }
        break;

      case 'DEBUGGING_CHALLENGE': {
        const hasDesc = Boolean(block.problemDescription || block.description);
        const hasSymptom = Boolean(block.symptom || (block.expectedErrors && block.expectedErrors.length > 0));
        const hasArtifact = Boolean(block.brokenArtifact || block.buggyCode);
        const hasCompetency = Boolean(block.targetCompetencyId);
        if (!hasDesc || !hasSymptom || !hasArtifact || !hasCompetency) {
          throw new CurriculumValidationError(
            `Debugging challenge block ${block.id} must specify problemDescription, symptom, brokenArtifact, and targetCompetencyId`,
            'INCOMPLETE_DEBUGGING_CHALLENGE_BLOCK'
          );
        }
        break;
      }

      case 'TRANSFER_CHALLENGE':
        if (!block.unfamiliarDomainContext || !block.task || !block.targetCompetencyId) {
          throw new CurriculumValidationError(
            `Transfer challenge block ${block.id} must specify unfamiliarDomainContext, task, and targetCompetencyId`,
            'INCOMPLETE_TRANSFER_CHALLENGE_BLOCK'
          );
        }
        break;

      case 'MINI_PROJECT':
        if (!block.problemStatement || !block.specifications || !block.targetCompetencyId) {
          throw new CurriculumValidationError(
            `Mini project block ${block.id} must specify problemStatement, specifications, and targetCompetencyId`,
            'INCOMPLETE_MINI_PROJECT_BLOCK'
          );
        }
        break;

      case 'REFLECTION':
        if (!block.prompt) {
          throw new CurriculumValidationError(`Reflection block ${block.id} must have a prompt`, 'INCOMPLETE_REFLECTION_BLOCK');
        }
        break;

      case 'REFERENCE':
        if (!block.links || block.links.length === 0) {
          throw new CurriculumValidationError(`Reference block ${block.id} must have at least one link`, 'INCOMPLETE_REFERENCE_BLOCK');
        }
        break;
    }
  }

  /**
   * Validates Day Content Manifest.
   */
  static validateDayManifest(day: DayContentManifest, isConsolidation: boolean = false): void {
    if (!day.packetId) throw new CurriculumValidationError('Day manifest must specify packetId', 'MISSING_PACKET_ID');
    if (![1, 2, 3, 4, 5].includes(day.dayNumber)) {
      throw new CurriculumValidationError(`Day manifest dayNumber must be between 1 and 5. Got ${day.dayNumber}`, 'INVALID_DAY_NUMBER');
    }
    if (!day.title) throw new CurriculumValidationError(`Day ${day.dayNumber} must have a title`, 'MISSING_DAY_TITLE');
    if (!day.blocks || day.blocks.length === 0) {
      throw new CurriculumValidationError(`Day ${day.dayNumber} must contain at least one content block`, 'EMPTY_DAY_BLOCKS');
    }

    // Verify day pedagogical intent matching
    if (isConsolidation) {
      if (day.dayNumber === 1 && !['DEBUG', 'UNDERSTAND', 'APPLY'].includes(day.pedagogicalIntent)) {
        throw new CurriculumValidationError(`Consolidation Day 1 pedagogical intent must be 'DEBUG', 'UNDERSTAND' or 'APPLY'`, 'DAY_INTENT_MISMATCH');
      }
      if (day.dayNumber === 2 && !['TRANSFER', 'BUILD', 'APPLY'].includes(day.pedagogicalIntent)) {
        throw new CurriculumValidationError(`Consolidation Day 2 pedagogical intent must be 'TRANSFER', 'BUILD' or 'APPLY'`, 'DAY_INTENT_MISMATCH');
      }
    } else {
      if (day.dayNumber === 1 && day.pedagogicalIntent !== 'UNDERSTAND') {
        throw new CurriculumValidationError(`Day 1 pedagogical intent must be 'UNDERSTAND'`, 'DAY_INTENT_MISMATCH');
      }
      if (day.dayNumber === 2 && !['BUILD', 'APPLY'].includes(day.pedagogicalIntent)) {
        throw new CurriculumValidationError(`Day 2 pedagogical intent must be 'BUILD' or 'APPLY'`, 'DAY_INTENT_MISMATCH');
      }
      if (day.dayNumber === 3 && !['TRANSFER', 'BUILD', 'DEBUG'].includes(day.pedagogicalIntent)) {
        throw new CurriculumValidationError(`Day 3 pedagogical intent must be 'TRANSFER', 'BUILD', or 'DEBUG'`, 'DAY_INTENT_MISMATCH');
      }
      if (day.dayNumber === 4 && !['DEBUG', 'BUILD'].includes(day.pedagogicalIntent)) {
        throw new CurriculumValidationError(`Day 4 pedagogical intent must be 'DEBUG' or 'BUILD'`, 'DAY_INTENT_MISMATCH');
      }
      if (day.dayNumber === 5 && day.pedagogicalIntent !== 'TRANSFER') {
        throw new CurriculumValidationError(`Day 5 pedagogical intent must be 'TRANSFER'`, 'DAY_INTENT_MISMATCH');
      }
    }

    // Validate each block and verify block order
    const seenBlockIds = new Set<string>();
    const seenOrders = new Set<number>();

    for (const block of day.blocks) {
      if (seenBlockIds.has(block.id)) {
        throw new CurriculumValidationError(`Duplicate block id '${block.id}' detected in Day ${day.dayNumber}`, 'DUPLICATE_BLOCK_ID');
      }
      seenBlockIds.add(block.id);

      if (seenOrders.has(block.order)) {
        throw new CurriculumValidationError(
          `Duplicate block order ${block.order} detected in Day ${day.dayNumber}`,
          'DUPLICATE_BLOCK_ORDER'
        );
      }
      seenOrders.add(block.order);

      ContentValidator.validateBlock(block);
    }
  }

  /**
   * Validates a complete 3-day Packet Content Manifest.
   */
  static validatePacketManifest(manifest: PacketContentManifest): void {
    if (!manifest.packetId || !manifest.packetCode) {
      throw new CurriculumValidationError('Packet manifest must specify packetId and packetCode', 'INCOMPLETE_PACKET_MANIFEST');
    }
    if (!manifest.days || manifest.days.length !== 3) {
      throw new CurriculumValidationError(
        `Packet manifest must contain exactly 3 day manifests. Found: ${manifest.days?.length || 0}`,
        'INCOMPLETE_PACKET_DAYS'
      );
    }

    const dayNumbers = manifest.days.map(d => d.dayNumber).sort();
    if (dayNumbers[0] !== 1 || dayNumbers[1] !== 2 || dayNumbers[2] !== 3) {
      throw new CurriculumValidationError(
        `Packet manifest must contain Day 1, Day 2, and Day 3 in sequence. Found: [${dayNumbers.join(', ')}]`,
        'PACKET_DAYS_SEQUENCE_MISMATCH'
      );
    }

    for (const day of manifest.days) {
      if (day.packetId !== manifest.packetId) {
        throw new CurriculumValidationError(
          `Day ${day.dayNumber} packetId '${day.packetId}' does not match manifest packetId '${manifest.packetId}'`,
          'DAY_PACKET_ID_MISMATCH'
        );
      }
      ContentValidator.validateDayManifest(day);
    }
  }

  /**
   * Validates a complete 5-day Development Batch Content Manifest (or partial batch if marked isPartial).
   */
  static validateBatchManifest(manifest: import('./contentTypes').BatchContentManifest): void {
    if (!manifest.batchId || !manifest.batchCode) {
      throw new CurriculumValidationError('Batch manifest must specify batchId and batchCode', 'INCOMPLETE_BATCH_MANIFEST');
    }
    if (!manifest.days || (manifest.isPartial ? manifest.days.length === 0 : manifest.days.length !== 5)) {
      throw new CurriculumValidationError(
        manifest.isPartial
          ? `Partial batch manifest must contain at least 1 day manifest. Found: ${manifest.days?.length || 0}`
          : `Batch manifest must contain exactly 5 day manifests. Found: ${manifest.days?.length || 0}`,
        'INCOMPLETE_BATCH_DAYS'
      );
    }

    const dayNumbers = manifest.days.map(d => d.dayNumber).sort((a, b) => a - b);
    for (let i = 0; i < dayNumbers.length; i++) {
      if (dayNumbers[i] !== i + 1) {
        throw new CurriculumValidationError(
          `Batch manifest must contain Days 1 to ${dayNumbers.length} in sequence. Found: [${dayNumbers.join(', ')}]`,
          'BATCH_DAYS_SEQUENCE_MISMATCH'
        );
      }
    }

    for (const day of manifest.days) {
      if (day.packetId !== manifest.batchId) {
        throw new CurriculumValidationError(
          `Day ${day.dayNumber} packetId '${day.packetId}' does not match batchId '${manifest.batchId}'`,
          'DAY_BATCH_ID_MISMATCH'
        );
      }
      ContentValidator.validateDayManifest(day);
    }
  }

  /**
   * Validates a 2-day Post-Gate Consolidation Block Content Manifest.
   */
  static validateConsolidationBlockManifest(manifest: import('./contentTypes').ConsolidationBlockManifest): void {
    if (!manifest.blockId || !manifest.blockCode) {
      throw new CurriculumValidationError('Consolidation manifest must specify blockId and blockCode', 'INCOMPLETE_CONSOLIDATION_MANIFEST');
    }
    if (!manifest.days || manifest.days.length !== 2) {
      throw new CurriculumValidationError(
        `Consolidation manifest must contain exactly 2 day manifests. Found: ${manifest.days?.length || 0}`,
        'INCOMPLETE_CONSOLIDATION_DAYS'
      );
    }

    const dayNumbers = manifest.days.map(d => d.dayNumber).sort();
    if (dayNumbers[0] !== 1 || dayNumbers[1] !== 2) {
      throw new CurriculumValidationError(
        `Consolidation manifest must contain Days 1 and 2 in sequence. Found: [${dayNumbers.join(', ')}]`,
        'CONSOLIDATION_DAYS_SEQUENCE_MISMATCH'
      );
    }

    for (const day of manifest.days) {
      if (day.packetId !== manifest.blockId) {
        throw new CurriculumValidationError(
          `Day ${day.dayNumber} packetId '${day.packetId}' does not match blockId '${manifest.blockId}'`,
          'DAY_BLOCK_ID_MISMATCH'
        );
      }
      ContentValidator.validateDayManifest(day, true);
    }
  }
}
