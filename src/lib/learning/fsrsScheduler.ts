'use client';

/**
 * FSRS-4.5 Spaced Repetition Memory Engine
 * Implements the Free Spaced Repetition Scheduler algorithm for optimal retention.
 */

export enum Rating {
  Again = 1,
  Hard = 2,
  Good = 3,
  Easy = 4
}

export enum State {
  New = 0,
  Learning = 1,
  Review = 2,
  Relearning = 3
}

export interface FSRSCard {
  cardId: string;
  due: number; // timestamp in ms
  stability: number; // days
  difficulty: number; // 1 to 10 scale
  elapsed_days: number;
  scheduled_days: number;
  reps: number;
  lapses: number;
  state: State;
  last_review: number; // timestamp in ms
}

export interface FSRSParameters {
  request_retention: number; // e.g. 0.9 (90% target retention)
  maximum_interval: number; // e.g. 36500 days
  w: number[]; // 17 default FSRS-4.5 weights
}

export const DEFAULT_FSRS_PARAMS: FSRSParameters = {
  request_retention: 0.9,
  maximum_interval: 36500,
  w: [
    0.4072, 1.1827, 3.1262, 15.4722, // Initial stabilities for Again, Hard, Good, Easy
    7.2102, 0.5316, 1.0651, 0.0234,  // Difficulty parameters
    1.6160, 0.1544, 1.0824,          // Stability decay & recall parameters
    1.9813, 0.0953, 0.2975, 2.2042,  // Failure parameters
    0.2407, 2.9466                   // Hard / Easy modifiers
  ]
};

const FACTOR = 19 / 81;
const DECAY = -0.5;

export function createEmptyCard(cardId: string, now = Date.now()): FSRSCard {
  return {
    cardId,
    due: now,
    stability: 0,
    difficulty: 0,
    elapsed_days: 0,
    scheduled_days: 0,
    reps: 0,
    lapses: 0,
    state: State.New,
    last_review: now
  };
}

/**
 * Calculates current recall probability R(t, S)
 */
export function calculateRetention(card: FSRSCard, now = Date.now()): number {
  if (card.state === State.New || card.stability === 0) return 0;
  const elapsedDays = Math.max(0, (now - card.last_review) / (1000 * 60 * 60 * 24));
  return Math.pow(1 + (FACTOR * elapsedDays) / (9 * card.stability), DECAY);
}

/**
 * Core FSRS-4.5 scheduling transition function
 */
export function scheduleNextReview(
  card: FSRSCard,
  rating: Rating,
  params: FSRSParameters = DEFAULT_FSRS_PARAMS,
  now = Date.now()
): FSRSCard {
  const w = params.w;
  const elapsedDays = card.state === State.New ? 0 : Math.max(0, (now - card.last_review) / (1000 * 60 * 60 * 24));

  let nextStability: number;
  let nextDifficulty: number;
  let nextState: State;
  let lapses = card.lapses;

  if (card.state === State.New) {
    // Initial ratings
    const initIdx = rating - 1;
    nextStability = Math.max(0.1, w[initIdx]);
    nextDifficulty = Math.min(10, Math.max(1, w[4] - Math.exp(w[5] * (rating - 1)) + 1));
    nextState = rating === Rating.Again ? State.Learning : State.Review;
    if (rating === Rating.Again) lapses += 1;
  } else {
    // Current difficulty update
    const currentD = card.difficulty || 5;
    const deltaD = -w[6] * (rating - 3);
    const meanReversion = w[7] * (w[4] - currentD);
    nextDifficulty = Math.min(10, Math.max(1, currentD + deltaD + meanReversion));

    // Calculate stability update
    const currentR = calculateRetention(card, now);

    if (rating === Rating.Again) {
      // Memory Lapse
      nextStability = Math.max(
        0.1,
        w[11] * Math.pow(nextDifficulty, -w[12]) * (Math.pow(card.stability + 1, w[13]) - 1) * Math.exp((1 - currentR) * w[14])
      );
      nextState = State.Relearning;
      lapses += 1;
    } else {
      // Successful Recall
      const hardBonus = rating === Rating.Hard ? w[15] : 1.0;
      const easyBonus = rating === Rating.Easy ? w[16] : 1.0;
      const recallFactor = Math.exp(w[8]) * (11 - nextDifficulty) * Math.pow(card.stability, -w[9]) * (Math.exp((1 - currentR) * w[10]) - 1);
      nextStability = Math.max(0.1, card.stability * (1 + recallFactor * hardBonus * easyBonus));
      nextState = State.Review;
    }
  }

  // Interval calculation for target retention
  const targetR = params.request_retention;
  const intervalDays = Math.min(
    params.maximum_interval,
    Math.max(1, Math.round((9 * nextStability / FACTOR) * (Math.pow(targetR, 1 / DECAY) - 1)))
  );

  const nextDue = now + intervalDays * (1000 * 60 * 60 * 24);

  return {
    cardId: card.cardId,
    due: nextDue,
    stability: Number(nextStability.toFixed(4)),
    difficulty: Number(nextDifficulty.toFixed(4)),
    elapsed_days: elapsedDays,
    scheduled_days: intervalDays,
    reps: card.reps + 1,
    lapses,
    state: nextState,
    last_review: now
  };
}

/**
 * Returns cards that are due for review
 */
export function getDueCards(cards: FSRSCard[], now = Date.now()): FSRSCard[] {
  return cards.filter(card => card.due <= now);
}
