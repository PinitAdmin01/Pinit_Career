/**
 * PinIT Multi-Language Placement Engine — Version 1.0
 * 
 * Deterministically evaluates a student's starting level for any of the 5 languages:
 * - Vocabulary (30% weight)
 * - Grammar (30% weight)
 * - Listening (20% weight)
 * - Speaking Transcript Analysis (20% weight)
 * 
 * CRITICAL RULE: Placement calculations are 100% controlled by PinIT TypeScript logic. Zero LLM level assignment.
 * DOWNGRADE PROTECTION: Retaking placement will NEVER downgrade a student's highest unlocked level.
 */

import { LanguageCode, LanguageLevel, PlacementAssessmentResult, PLACEMENT_VERSION } from './languageTypes';

export interface PlacementAnswersInput {
  languageCode: LanguageCode;
  vocabScore: number; // 0 - 100
  grammarScore: number; // 0 - 100
  listeningScore: number; // 0 - 100
  speakingScore: number; // 0 - 100
}

export const LEVEL_HIERARCHY: LanguageLevel[] = ['PRE_A1', 'A1', 'A2', 'B1', 'B2'];

export function calculatePlacementResult(
  input: PlacementAnswersInput,
  currentHighestUnlockedLevel: LanguageLevel = 'PRE_A1'
): PlacementAssessmentResult {
  const { languageCode, vocabScore, grammarScore, listeningScore, speakingScore } = input;

  const compositeScore =
    vocabScore * 0.30 +
    grammarScore * 0.30 +
    listeningScore * 0.20 +
    speakingScore * 0.20;

  let assessedLevel: LanguageLevel = 'PRE_A1';
  if (compositeScore >= 80) {
    assessedLevel = 'B2';
  } else if (compositeScore >= 65) {
    assessedLevel = 'B1';
  } else if (compositeScore >= 50) {
    assessedLevel = 'A2';
  } else if (compositeScore >= 30) {
    assessedLevel = 'A1';
  } else {
    assessedLevel = 'PRE_A1';
  }

  const currentIndex = LEVEL_HIERARCHY.indexOf(currentHighestUnlockedLevel);
  const assessedIndex = LEVEL_HIERARCHY.indexOf(assessedLevel);

  let recommendedStartLevel: LanguageLevel = assessedLevel;

  if (assessedIndex < currentIndex) {
    recommendedStartLevel = currentHighestUnlockedLevel;
  }

  const confidenceScore = Math.round(Math.min(100, compositeScore + 10));

  return {
    placementVersion: PLACEMENT_VERSION,
    languageCode,
    recommendedStartLevel,
    assessedLevel,
    vocabularyScore: Math.round(vocabScore),
    grammarScore: Math.round(grammarScore),
    listeningScore: Math.round(listeningScore),
    speakingScore: Math.round(speakingScore),
    confidenceScore,
    assessedAt: new Date().toISOString()
  };
}
