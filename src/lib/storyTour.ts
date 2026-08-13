/** One-time post-onboarding story tour flags (segment 1–3). */

const PENDING_ANY = 'pinit_story_pending_any';
const JUST_ONBOARDED = 'pinit_just_onboarded';

export function storyPendingKey(userId?: string) {
  return `pinit_${userId || 'guest'}_story_pending`;
}

export function storyCompletedKey(userId?: string) {
  return `pinit_${userId || 'guest'}_story_completed`;
}

export function markOnboardingStoryPending(userId?: string) {
  if (typeof window === 'undefined') return;
  const uid = userId || 'guest';
  try {
    sessionStorage.setItem(JUST_ONBOARDED, 'true');
    localStorage.setItem(storyPendingKey(uid), 'true');
    localStorage.setItem(PENDING_ANY, 'true');
    localStorage.removeItem(storyCompletedKey(uid));
  } catch {}
}

export function isStoryTourPending(userId?: string): boolean {
  if (typeof window === 'undefined') return false;
  const uid = userId || 'guest';
  try {
    const just = sessionStorage.getItem(JUST_ONBOARDED) === 'true';
    const pending =
      localStorage.getItem(storyPendingKey(uid)) === 'true' ||
      localStorage.getItem(PENDING_ANY) === 'true';
    const completed = localStorage.getItem(storyCompletedKey(uid)) === 'true';
    if (just && completed) return true; // first landing after onboarding always wins
    return just || (pending && !completed);
  } catch {
    return false;
  }
}

export function consumeJustOnboarded(userId?: string) {
  if (typeof window === 'undefined') return;
  const uid = userId || 'guest';
  try {
    if (sessionStorage.getItem(JUST_ONBOARDED) === 'true') {
      sessionStorage.removeItem(JUST_ONBOARDED);
      localStorage.setItem(storyPendingKey(uid), 'true');
      localStorage.setItem(PENDING_ANY, 'true');
      localStorage.removeItem(storyCompletedKey(uid));
    }
  } catch {}
}

export function completeStoryTour(userId?: string) {
  if (typeof window === 'undefined') return;
  const uid = userId || 'guest';
  try {
    localStorage.setItem(storyCompletedKey(uid), 'true');
    localStorage.removeItem(storyPendingKey(uid));
    localStorage.removeItem(PENDING_ANY);
    sessionStorage.removeItem(JUST_ONBOARDED);
  } catch {}
}
