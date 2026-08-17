/**
 * PinIT Multi-Language Idempotent XP Engine
 * 
 * Enforces EXACTLY-ONCE XP awards per lesson per language per student.
 */

import { LanguageCode, LanguageModuleType } from './languageTypes';

export const XP_REWARD_MAP: Record<LanguageModuleType, number> = {
  Vocabulary: 30,
  Grammar: 30,
  Listening: 30,
  Speaking: 40,
  KanaScript: 40,
  InteractiveExercises: 35
};

export interface AwardXpResult {
  awarded: boolean;
  amount: number;
  message: string;
}

export function awardLessonXp(
  lessonId: string,
  moduleType: LanguageModuleType,
  completedLessonIds: string[],
  addXpFn: (amount: number) => void,
  languageCode: LanguageCode = 'en'
): AwardXpResult {
  const ledgerKey = `${languageCode}_${lessonId}`;

  // Idempotency Check
  if (completedLessonIds.includes(lessonId) || completedLessonIds.includes(ledgerKey)) {
    return {
      awarded: false,
      amount: 0,
      message: 'XP for this lesson has already been awarded.'
    };
  }

  const xpAmount = XP_REWARD_MAP[moduleType] || 30;
  addXpFn(xpAmount);

  return {
    awarded: true,
    amount: xpAmount,
    message: `+${xpAmount} XP Awarded!`
  };
}
