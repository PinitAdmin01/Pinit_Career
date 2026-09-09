/**
 * Single-Source-of-Truth Story Tour Controller.
 * Guarantees that Story Tour runs reliably after onboarding and allows seamless replay.
 */

import { api } from '@/lib/api/client';

export function storyCompletedKey(userId?: string): string {
  const uid = userId && userId !== 'guest' ? userId : 'active_user';
  return `pinit_${uid}_story_completed`;
}

export function storySessionTokenKey(userId?: string): string {
  const uid = userId && userId !== 'guest' ? userId : 'active_user';
  return `pinit_${uid}_just_onboarded`;
}

/**
 * Called exclusively upon completing the final onboarding step.
 * Arms ephemeral single-use session tokens so the tour starts upon landing on the dashboard.
 */
export function markOnboardingStoryPending(userId?: string) {
  if (typeof window === 'undefined') return;
  const uid = userId && userId !== 'guest' ? userId : 'active_user';
  try {
    // If the user already completed the tour in a prior session, allow re-arm only if freshly onboarded
    localStorage.removeItem(storyCompletedKey(uid));
    localStorage.removeItem('pinit_active_user_story_completed');

    // Arm ephemeral one-time session tokens (both user-scoped and session-scoped for hydration resilience)
    sessionStorage.setItem(storySessionTokenKey(uid), 'true');
    sessionStorage.setItem('pinit_session_just_onboarded', 'true');
    sessionStorage.setItem('pinit_story_pending_flag', 'true');
  } catch {}
}

/**
 * Checks if the story tour should execute automatically post-onboarding.
 * Returns true ONLY if:
 * 1. The user has an active ephemeral onboarding token
 * 2. The user has not completed the tour in this specific lifecycle or in the database profile
 */
export function isStoryTourPending(userId?: string, profile?: any): boolean {
  if (typeof window === 'undefined') return false;
  const uid = userId && userId !== 'guest' ? userId : 'active_user';
  try {
    // 1. Check if database profile already confirms story tour was completed
    const profileCompleted = 
      profile?.onboardingAnswers?.storyTourCompleted === true ||
      profile?.onboarding_answers?.storyTourCompleted === true;

    if (profileCompleted) {
      if (localStorage.getItem(storyCompletedKey(uid)) !== 'true') {
        localStorage.setItem(storyCompletedKey(uid), 'true');
      }
      return false;
    }

    // 2. Check if already marked completed in localStorage
    if (localStorage.getItem(storyCompletedKey(uid)) === 'true') {
      return false;
    }

    // 3. Check for one-time ephemeral token
    const tokenActive =
      sessionStorage.getItem(storySessionTokenKey(uid)) === 'true' ||
      sessionStorage.getItem('pinit_session_just_onboarded') === 'true' ||
      sessionStorage.getItem('pinit_story_pending_flag') === 'true';

    if (!tokenActive) return false;

    return true;
  } catch {
    return false;
  }
}

/**
 * Atomically consumes the one-time token and marks the tour completed.
 * Persists status both to localStorage and to Supabase database profile.
 */
export function completeStoryTour(userId?: string) {
  if (typeof window === 'undefined') return;
  const uid = userId && userId !== 'guest' ? userId : 'active_user';
  try {
    // 1. Mark client-side completion
    localStorage.setItem(storyCompletedKey(uid), 'true');
    
    // 2. Burn and purge all pending session tokens
    sessionStorage.removeItem(storySessionTokenKey(uid));
    sessionStorage.removeItem('pinit_session_just_onboarded');
    sessionStorage.removeItem('pinit_story_pending_flag');
    sessionStorage.removeItem('pinit_just_onboarded');
    localStorage.removeItem(`pinit_${uid}_story_pending`);
    localStorage.removeItem('pinit_story_pending_any');

    // 3. Persist tour completion to Supabase profile so new devices don't re-trigger tour
    if (userId && userId !== 'guest' && !userId.startsWith('usr_dev_')) {
      api.post('/api/auth/onboarding', {
        onboardingAnswers: { storyTourCompleted: true }
      }).catch(() => {});
    }
  } catch {}
}

/**
 * Resets story tour completion to allow replaying.
 */
export function resetStoryTour(userId?: string) {
  if (typeof window === 'undefined') return;
  const uid = userId && userId !== 'guest' ? userId : 'active_user';
  try {
    localStorage.removeItem(storyCompletedKey(uid));
    localStorage.removeItem('pinit_active_user_story_completed');
  } catch {}
}

/**
 * Dispatches custom event to trigger story mode instantly.
 */
export function launchStoryTourNow() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('pinit:start_story_mode'));
  }
}

export function consumeJustOnboarded(_userId?: string) {
  // Handled automatically by token burn in completeStoryTour
}
