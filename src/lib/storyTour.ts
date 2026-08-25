/**
 * Single-Source-of-Truth Story Tour Controller.
 * Guarantees that Story Tour runs STRICTLY ONCE per user after onboarding completion.
 */

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
 * Arms an ephemeral single-use session token for the authenticated user.
 */
export function markOnboardingStoryPending(userId?: string) {
  if (typeof window === 'undefined') return;
  const uid = userId && userId !== 'guest' ? userId : 'active_user';
  try {
    // If the user already completed the tour in a prior lifetime, do not re-arm
    if (localStorage.getItem(storyCompletedKey(uid)) === 'true') {
      return;
    }
    // Arm ephemeral one-time session token
    sessionStorage.setItem(storySessionTokenKey(uid), 'true');
    // Clear any obsolete legacy keys to prevent ghost triggers
    localStorage.removeItem('pinit_story_pending_any');
    sessionStorage.removeItem('pinit_just_onboarded');
  } catch {}
}

/**
 * Checks if the story tour should execute.
 * Returns true ONLY if:
 * 1. The user has an active ephemeral onboarding token
 * 2. The user has NEVER completed the story tour previously
 */
export function isStoryTourPending(userId?: string): boolean {
  if (typeof window === 'undefined') return false;
  const uid = userId && userId !== 'guest' ? userId : 'active_user';
  try {
    // 1. Permanent Hard Stop: If already completed, never auto-run again
    if (localStorage.getItem(storyCompletedKey(uid)) === 'true') {
      return false;
    }

    // 2. Check for one-time ephemeral token
    const tokenActive = sessionStorage.getItem(storySessionTokenKey(uid)) === 'true';
    return tokenActive;
  } catch {
    return false;
  }
}

/**
 * Atomically consumes the one-time token and permanently marks the tour completed.
 * Executed the very millisecond the tour is initiated.
 */
export function completeStoryTour(userId?: string) {
  if (typeof window === 'undefined') return;
  const uid = userId && userId !== 'guest' ? userId : 'active_user';
  try {
    // 1. Permanently lock client-side completion
    localStorage.setItem(storyCompletedKey(uid), 'true');
    localStorage.setItem('pinit_active_user_story_completed', 'true');
    
    // 2. Burn and purge all pending tokens
    sessionStorage.removeItem(storySessionTokenKey(uid));
    sessionStorage.removeItem('pinit_just_onboarded');
    localStorage.removeItem(`pinit_${uid}_story_pending`);
    localStorage.removeItem('pinit_story_pending_any');
  } catch {}
}

export function consumeJustOnboarded(_userId?: string) {
  // Handled automatically by token burn in completeStoryTour
}
