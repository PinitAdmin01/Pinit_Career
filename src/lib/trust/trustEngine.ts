/**
 * PinIT Career OS - Trust Score Engine & Session Anti-Cheating Guardian
 *
 * Core Invariants:
 * 1. Default Baseline: 50 (Range: 0 to 100).
 * 2. Activity Rewards:
 *    - Mission completion: +3
 *    - Lesson completion: +3
 *    - Course Exam / Assessment completion: +3
 *    - AI Interview completion: +3
 * 3. Vault Documents:
 *    - Genuine / verified document: +5
 *    - False / rejected document: -5
 * 4. Cheating Penalty:
 *    - Dishonest action detected: -2
 *    - Strict Invariant: ONE penalty per session! Multiple cheating actions
 *      within the same session will only reduce trust score by -2 AT MOST ONCE.
 */

import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/lib/store/useAppStore';

export const TRUST_CONSTANTS = {
  DEFAULT_SCORE: 50,
  MIN_SCORE: 0,
  MAX_SCORE: 100,
  REWARDS: {
    MISSION: 3,
    LESSON: 3,
    EXAM: 3,
    INTERVIEW: 3,
    VAULT_VERIFIED: 5,
  },
  PENALTIES: {
    CHEATING: -2,
    VAULT_REJECTED: -5,
  },
} as const;

export type TrustActivityType = 'mission' | 'lesson' | 'exam' | 'interview' | 'vault_verified';
export type CheatingFeature = 'lesson' | 'exam' | 'interview' | 'arena' | 'vault';

export interface CheatingIncident {
  sessionId: string;
  feature: CheatingFeature;
  violationType: string;
  details?: Record<string, any>;
  timestamp: string;
}

// In-memory session tracking for currently active tab/runtime
const inMemoryPenalizedSessions = new Set<string>();
const inMemoryTrustScores = new Map<string, number>();

/**
 * Storage key helper for a given user's trust score
 */
export function getTrustStorageKey(userId?: string | null): string {
  const safeId = userId && userId !== 'guest' ? userId : 'guest';
  return `pinit_trust_score_${safeId}`;
}

/**
 * Storage key helper for session penalty deduplication
 */
export function getSessionPenaltyKey(sessionId: string): string {
  return `pinit_penalized_session_${sessionId}`;
}

/**
 * Check whether a session has already been penalized for cheating.
 * Ensures the strict invariant: at most one -2 penalty per session.
 */
export function isSessionPenalized(sessionId: string): boolean {
  if (!sessionId) return false;
  if (inMemoryPenalizedSessions.has(sessionId)) return true;

  if (typeof window !== 'undefined') {
    try {
      const persisted = sessionStorage.getItem(getSessionPenaltyKey(sessionId)) ||
                        localStorage.getItem(getSessionPenaltyKey(sessionId));
      if (persisted === 'true') {
        inMemoryPenalizedSessions.add(sessionId);
        return true;
      }
    } catch {
      // Ignore storage errors
    }
  }
  return false;
}

/**
 * Mark a session as penalized so no further penalties can be deducted.
 */
export function markSessionPenalized(sessionId: string): void {
  if (!sessionId) return;
  inMemoryPenalizedSessions.add(sessionId);
  if (typeof window !== 'undefined') {
    try {
      sessionStorage.setItem(getSessionPenaltyKey(sessionId), 'true');
      localStorage.setItem(getSessionPenaltyKey(sessionId), 'true');
    } catch {
      // Ignore storage errors
    }
  }
}

/**
 * Clear session penalty tracking (useful in tests or session reset)
 */
export function clearSessionPenalty(sessionId: string): void {
  if (!sessionId) return;
  inMemoryPenalizedSessions.delete(sessionId);
  if (typeof window !== 'undefined') {
    try {
      sessionStorage.removeItem(getSessionPenaltyKey(sessionId));
      localStorage.removeItem(getSessionPenaltyKey(sessionId));
    } catch {}
  }
}

/**
 * Clear all in-memory trust tracking (useful in tests or session reset)
 */
export function clearInMemoryTrustState(): void {
  inMemoryPenalizedSessions.clear();
  inMemoryTrustScores.clear();
}

/**
 * Retrieve the current trust score from memory, local storage, or profile fallback.
 * Guaranteed to return [0, 100], defaulting strictly to 50.
 */
export function getLocalTrustScore(userId?: string | null, profileFallback?: number | null): number {
  const safeId = userId || 'guest';
  if (inMemoryTrustScores.has(safeId)) {
    return inMemoryTrustScores.get(safeId)!;
  }

  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(getTrustStorageKey(userId));
      if (raw !== null) {
        const val = Number(raw);
        if (Number.isFinite(val)) {
          const clamped = Math.max(TRUST_CONSTANTS.MIN_SCORE, Math.min(TRUST_CONSTANTS.MAX_SCORE, Math.round(val)));
          inMemoryTrustScores.set(safeId, clamped);
          return clamped;
        }
      }
    } catch {}
  }

  if (typeof profileFallback === 'number' && Number.isFinite(profileFallback)) {
    const clamped = Math.max(TRUST_CONSTANTS.MIN_SCORE, Math.min(TRUST_CONSTANTS.MAX_SCORE, Math.round(profileFallback)));
    return clamped;
  }

  return TRUST_CONSTANTS.DEFAULT_SCORE;
}

/**
 * Persist trust score locally and sync to Supabase if authenticated.
 */
export async function persistTrustScore(
  userId: string | null | undefined,
  newScore: number,
  reason: string
): Promise<number> {
  const boundedScore = Math.max(TRUST_CONSTANTS.MIN_SCORE, Math.min(TRUST_CONSTANTS.MAX_SCORE, Math.round(newScore)));
  const safeId = userId || 'guest';
  inMemoryTrustScores.set(safeId, boundedScore);

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(getTrustStorageKey(userId), String(boundedScore));
      // Dispatch custom event for real-time reactivity across components
      window.dispatchEvent(new CustomEvent('pinit-trust-updated', {
        detail: { score: boundedScore, reason, userId: safeId }
      }));
    } catch {}
  }

  // Persist authoritatively to Supabase if authenticated
  if (userId && userId !== 'guest' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId)) {
    try {
      await supabase
        .from('users')
        .update({
          trust_score: boundedScore,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);
    } catch (err) {
      console.warn('[TrustEngine] Supabase update warning:', err);
    }
  }

  return boundedScore;
}

/**
 * Award Trust Score for completing an activity (+3 for mission/lesson/exam/interview, +5 for vault verified).
 */
export async function applyTrustReward(
  userId: string | null | undefined,
  type: TrustActivityType,
  currentScore?: number
): Promise<{ previousScore: number; newScore: number; delta: number }> {
  const cur = typeof currentScore === 'number' ? currentScore : getLocalTrustScore(userId);
  const delta = type === 'vault_verified' ? TRUST_CONSTANTS.REWARDS.VAULT_VERIFIED : TRUST_CONSTANTS.REWARDS.LESSON;
  const next = Math.min(TRUST_CONSTANTS.MAX_SCORE, cur + delta);

  await persistTrustScore(userId, next, `reward_${type}`);

  if (delta > 0 && cur < TRUST_CONSTANTS.MAX_SCORE) {
    toast.success('🛡️ Trust Score Boost', `+${delta} Trust Score earned for genuine ${type} completion!`);
  }

  return { previousScore: cur, newScore: next, delta };
}

/**
 * Deduct Trust Score for rejected/false vault document (-5).
 */
export async function applyVaultRejectionPenalty(
  userId: string | null | undefined,
  currentScore?: number
): Promise<{ previousScore: number; newScore: number; delta: number }> {
  const cur = typeof currentScore === 'number' ? currentScore : getLocalTrustScore(userId);
  const delta = TRUST_CONSTANTS.PENALTIES.VAULT_REJECTED;
  const next = Math.max(TRUST_CONSTANTS.MIN_SCORE, cur + delta);

  await persistTrustScore(userId, next, 'penalty_vault_rejected');
  toast.error('⚠️ Document Verification Failed', `${delta} Trust Score deducted for unverified or invalid documentation.`);

  return { previousScore: cur, newScore: next, delta };
}

/**
 * Record a cheating incident.
 * STRICT INVARIANT: If this session has already been penalized, DO NOT penalize again.
 * Returns whether a penalty was applied and the resulting score.
 */
export async function recordCheatingIncident(
  userId: string | null | undefined,
  sessionId: string,
  feature: CheatingFeature,
  violationType: string,
  details?: Record<string, any>
): Promise<{
  penalized: boolean;
  score: number;
  delta: number;
  incident: CheatingIncident;
  alreadyPenalizedInSession: boolean;
}> {
  const incident: CheatingIncident = {
    sessionId,
    feature,
    violationType,
    details,
    timestamp: new Date().toISOString(),
  };

  const cur = getLocalTrustScore(userId);

  // Check session invariant
  if (isSessionPenalized(sessionId)) {
    // Already deducted -2 for this session. Log for audit, but do NOT deduct again!
    console.warn('[TrustEngine] Cheating detected in session, but session already penalized. Skipping duplicate penalty:', incident);
    return {
      penalized: false,
      score: cur,
      delta: 0,
      incident,
      alreadyPenalizedInSession: true,
    };
  }

  // First infraction in this session: apply -2 penalty and lock session
  markSessionPenalized(sessionId);
  const delta = TRUST_CONSTANTS.PENALTIES.CHEATING; // -2
  const next = Math.max(TRUST_CONSTANTS.MIN_SCORE, cur + delta);

  await persistTrustScore(userId, next, `cheating_${feature}_${violationType}`);

  // Display user warning
  toast.error(
    '⚠️ Academic Integrity Notice',
    `Cheating pattern detected in ${feature} (${violationType.replace(/_/g, ' ')}). -2 Trust Score applied.`
  );

  return {
    penalized: true,
    score: next,
    delta,
    incident,
    alreadyPenalizedInSession: false,
  };
}
