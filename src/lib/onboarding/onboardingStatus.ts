/**
 * One rule for "has this student finished onboarding?" (login page, app shell, …).
 *
 * Finished means the wizard reached its last step: onboarding_step >= 3, roadmap_generated, or
 * onboarding_answers.hasCompleted (the server derives the first two from the third when missing:
 * /api/auth/me). The profile from the server is checked first; this device's saved progress is a
 * fallback for a student who just finished and whose profile has not refreshed yet. Having *some*
 * answers saved does not count: a student who stopped halfway goes back to onboarding.
 */

export interface OnboardingSignals {
  onboardingStep?: unknown;
  roadmapGenerated?: unknown;
  hasCompleted?: unknown;
}

const COMPLETE_STEP = 3;

function signalsSayComplete(s: OnboardingSignals | null | undefined): boolean {
  if (!s) return false;
  const step = Number(s.onboardingStep);
  return (Number.isFinite(step) && step >= COMPLETE_STEP) || s.roadmapGenerated === true || s.roadmapGenerated === 'true' || s.hasCompleted === true;
}

export function isOnboardingComplete(
  server: OnboardingSignals | null | undefined,
  local?: OnboardingSignals | null
): boolean {
  return signalsSayComplete(server) || signalsSayComplete(local);
}

/** The onboarding fields of a signed-in user's profile (camelCase or database names). */
export function onboardingSignalsOf(profile: unknown): OnboardingSignals | null {
  if (!profile || typeof profile !== 'object') return null;
  const p = profile as Record<string, unknown>;
  const answers = (p.onboardingAnswers ?? p.onboarding_answers) as { hasCompleted?: unknown } | null | undefined;
  return {
    onboardingStep: p.onboardingStep ?? p.onboarding_step,
    roadmapGenerated: p.roadmapGenerated ?? p.roadmap_generated,
    hasCompleted: answers && typeof answers === 'object' ? answers.hasCompleted : undefined,
  };
}

/** This device's saved onboarding progress for the user (written by the onboarding wizard). */
export function readLocalOnboardingSignals(userId: string | null | undefined): OnboardingSignals | null {
  if (!userId || typeof window === 'undefined') return null;
  try {
    const answers = JSON.parse(window.localStorage.getItem(`pinit_${userId}_onboarding_answers`) || '{}') as { hasCompleted?: unknown };
    return {
      onboardingStep: window.localStorage.getItem(`pinit_${userId}_ob_step`),
      roadmapGenerated: window.localStorage.getItem(`pinit_${userId}_road_gen`),
      hasCompleted: answers?.hasCompleted,
    };
  } catch {
    return null;
  }
}
