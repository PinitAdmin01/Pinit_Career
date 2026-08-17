/**
 * PinIT Shared SM-2 Spaced Repetition (SRS) Engine
 * 
 * Clean-Room TypeScript Implementation for 5 Independent Language Programs:
 * - 🇬🇧 English (`en`)
 * - 🇫🇷 French (`fr`)
 * - 🇪🇸 Spanish (`es`)
 * - 🇩🇪 German (`de`)
 * - 🇯🇵 Japanese (`ja`)
 * 
 * Database Composite Identity: (student_id, language_code, item_id)
 */

import { LanguageCode } from './languageTypes';

export type SrsQuality = 0 | 1 | 2 | 3 | 4 | 5;
export type SrsCardStatus = 'new' | 'learning' | 'review';
export type SrsItemType = 'vocabulary' | 'grammar' | 'kana' | 'kanji';

export interface SrsCardState {
  studentId: string;
  languageCode: LanguageCode;
  itemId: string;
  itemType: SrsItemType;
  easeFactor: number; // default 2.5, min 1.3
  intervalDays: number; // default 1
  repetitions: number; // default 0
  status: SrsCardStatus;
  lastReviewedAt?: string;
  nextReviewAt: string;
  curriculumVersion: string;
}

export const GRADUATION_REPETITIONS = 3;

/**
 * Calculates the next SRS state based on performance rating (0-5)
 */
export function calculateSrsNextReview(
  currentState: Partial<SrsCardState> & { studentId: string; languageCode: LanguageCode; itemId: string; itemType: SrsItemType },
  quality: SrsQuality,
  now: Date = new Date()
): SrsCardState {
  let easeFactor = currentState.easeFactor ?? 2.5;
  let intervalDays = currentState.intervalDays ?? 1;
  let repetitions = currentState.repetitions ?? 0;
  let status: SrsCardStatus = currentState.status ?? 'new';

  if (quality >= 3) {
    // Correct response -> advance schedule
    if (repetitions === 0) {
      intervalDays = 1;
    } else if (repetitions === 1) {
      intervalDays = 6;
    } else {
      intervalDays = Math.round(intervalDays * easeFactor);
    }
    repetitions += 1;

    if (status === 'new') {
      status = 'learning';
    } else if (status === 'learning' && repetitions >= GRADUATION_REPETITIONS) {
      status = 'review';
    }
  } else {
    // Incorrect response -> reset learning streak
    repetitions = 0;
    intervalDays = 1;
    if (status === 'review') {
      status = 'learning';
    } else if (status === 'new') {
      status = 'learning';
    }
  }

  // Update ease factor (SuperMemo SM-2 formula)
  easeFactor += 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02);
  easeFactor = Math.max(1.3, easeFactor);

  const nextReviewMs = now.getTime() + intervalDays * 24 * 60 * 60 * 1000;
  const nextReviewAt = new Date(nextReviewMs).toISOString();

  return {
    studentId: currentState.studentId,
    languageCode: currentState.languageCode,
    itemId: currentState.itemId,
    itemType: currentState.itemType,
    easeFactor: Number(easeFactor.toFixed(2)),
    intervalDays,
    repetitions,
    status,
    lastReviewedAt: now.toISOString(),
    nextReviewAt,
    curriculumVersion: currentState.curriculumVersion || '1.0'
  };
}

/**
 * Filters cards that are due for review as of the given date
 */
export function getDueSrsCards(cards: SrsCardState[], asOf: Date = new Date()): SrsCardState[] {
  const cutoffTime = asOf.getTime();
  return cards.filter(card => {
    const dueTime = new Date(card.nextReviewAt).getTime();
    return dueTime <= cutoffTime;
  });
}
