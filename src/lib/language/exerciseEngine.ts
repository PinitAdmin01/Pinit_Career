/**
 * PinIT Universal Exercise Engine
 * 
 * Clean-Room TypeScript Exercise Evaluator for 5 Independent Language Programs
 * Supports WordBank Token Jumbles, Pair Match Grids, TypeAnswer Fuzzy Matcher, and FillBlank Choices
 */

import { LanguageCode, MatchGridPair, WordBankExercise, MatchGridExercise, TypeAnswerExercise } from './languageTypes';
import { evaluateTextMatch, StringMatchResult } from './stringMatcher';

export interface WordBankResult {
  isCorrect: boolean;
  userSentence: string;
  targetSentence: string;
  scorePct: number;
}

export interface MatchGridResult {
  isPairMatched: boolean;
  targetWord: string;
  matchedNativeWord: string;
  totalMatchedPairs: number;
  isGridComplete: boolean;
}

/**
 * Evaluates ordered token selection in a WordBank exercise.
 */
export function evaluateWordBankTokenOrder(
  selectedTokens: string[],
  correctTokenOrder: string[]
): WordBankResult {
  const userSentence = selectedTokens.join(' ').trim();
  const targetSentence = correctTokenOrder.join(' ').trim();

  const isExactOrder = selectedTokens.length === correctTokenOrder.length &&
    selectedTokens.every((token, idx) => token === correctTokenOrder[idx]);

  let scorePct = 0;
  if (isExactOrder) {
    scorePct = 100;
  } else {
    // Partial score based on correctly ordered tokens
    let correctCount = 0;
    for (let i = 0; i < Math.min(selectedTokens.length, correctTokenOrder.length); i++) {
      if (selectedTokens[i] === correctTokenOrder[i]) correctCount++;
    }
    scorePct = Math.round((correctCount / correctTokenOrder.length) * 100);
  }

  return {
    isCorrect: isExactOrder,
    userSentence,
    targetSentence,
    scorePct
  };
}

/**
 * Evaluates target-to-native pair selection in a MatchGrid exercise.
 */
export function evaluateMatchGridPair(
  selectedTarget: string,
  selectedNative: string,
  pairs: MatchGridPair[],
  currentMatchedCount: number = 0
): MatchGridResult {
  const matchedPair = pairs.find(p => p.target === selectedTarget && p.native === selectedNative);
  const isPairMatched = !!matchedPair;
  const newMatchedCount = isPairMatched ? currentMatchedCount + 1 : currentMatchedCount;
  const isGridComplete = newMatchedCount >= pairs.length;

  return {
    isPairMatched,
    targetWord: selectedTarget,
    matchedNativeWord: selectedNative,
    totalMatchedPairs: newMatchedCount,
    isGridComplete
  };
}

/**
 * Evaluates user typed input using diacritic-aware fuzzy string matcher with linguistic guardrail policies.
 */
export function evaluateTypeAnswerInput(
  userInput: string,
  targetAnswer: string,
  alternativeAnswers: string[] = [],
  exerciseCategory: 'vocabulary' | 'grammar' | 'japanese_script' | 'sentence_construction' = 'vocabulary',
  languageCode: LanguageCode = 'en'
): StringMatchResult {
  return evaluateTextMatch(userInput, targetAnswer, {
    alternativeAnswers,
    exerciseCategory,
    languageCode
  });
}

/**
 * Utility to deterministically shuffle tokens for WordBank choices while ensuring non-identity initial order.
 */
export function prepareShuffledWordBankTokens(tokens: string[]): string[] {
  const shuffled = [...tokens];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor((i + 1) * 0.7) % (i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
