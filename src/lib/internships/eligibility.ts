import {
  PLAN_TIER_TO_INTERNSHIP,
  INTERNSHIP_TIER_AVAILABLE,
  type InternshipTier,
  type CrashPlan,
} from '../data/crashPlansData';
import { isCapstoneComplete } from '../courses/crashCourseProgress';
import type { CrashCourseEnrollment } from '../services/crashCourseEnrollmentService';

export interface CheckEligibilityOptions {
  enrollment?:
    | Pick<CrashCourseEnrollment, 'milestoneProgress' | 'certificatesIssued'>
    | { milestoneProgress?: Record<string, unknown> | null; certificatesIssued?: Record<string, unknown> | null }
    | null;
  plan?: Pick<CrashPlan, 'tier'> | null;
  track?: string | null;
  activeInternship?: boolean;
  tierSwitchOverride?: Partial<Record<InternshipTier, boolean>>;
}

export type EligibilityErrorCode =
  | 'NO_INTERNSHIP_TIER'
  | 'TRACK_NOT_ELIGIBLE'
  | 'CAPSTONE_NOT_COMPLETE'
  | 'TIER_NOT_AVAILABLE'
  | 'ALREADY_ACTIVE';

export type EligibilityResult =
  | {
      ok: true;
      tier: InternshipTier;
    }
  | {
      ok: false;
      error: EligibilityErrorCode;
      message: string;
    };

/**
 * Checks whether a student is eligible to start an internship tier (C3).
 *
 * Requirements (FR-ELIG-1 to FR-ELIG-5):
 * 1. Plan tier must map to an internship tier (own tier only, e.g. 1m -> t1_job_sim).
 * 2. Only the 'python_ai' track is eligible in this version.
 * 3. The capstone must be complete (verified via isCapstoneComplete).
 * 4. The tier switch in INTERNSHIP_TIER_AVAILABLE must be on.
 * 5. One active internship per student per crash enrollment.
 */
export function checkInternshipEligibility(
  opts: CheckEligibilityOptions
): EligibilityResult {
  const { enrollment, plan, track, activeInternship, tierSwitchOverride } = opts;

  // 1. Own tier only: plan must map to an internship tier
  if (!plan?.tier || !PLAN_TIER_TO_INTERNSHIP[plan.tier]) {
    return {
      ok: false,
      error: 'NO_INTERNSHIP_TIER',
      message: 'This course plan does not include an internship program.',
    };
  }

  const tier = PLAN_TIER_TO_INTERNSHIP[plan.tier];

  // 2. Track check: python_ai only
  if (track !== 'python_ai') {
    return {
      ok: false,
      error: 'TRACK_NOT_ELIGIBLE',
      message: 'Only the Python AI track is currently eligible for the internship program.',
    };
  }

  // 3. Capstone complete check (isCapstoneComplete)
  if (!isCapstoneComplete(enrollment as unknown as Pick<CrashCourseEnrollment, 'milestoneProgress' | 'certificatesIssued'>)) {
    return {
      ok: false,
      error: 'CAPSTONE_NOT_COMPLETE',
      message: 'You must successfully complete your course capstone before starting the internship.',
    };
  }

  // 4. Tier switch check (cannot be started if switch is off)
  const isSwitchOn = tierSwitchOverride?.[tier] ?? INTERNSHIP_TIER_AVAILABLE[tier];
  if (!isSwitchOn) {
    return {
      ok: false,
      error: 'TIER_NOT_AVAILABLE',
      message: `The ${tier} internship is not currently open for enrollment.`,
    };
  }

  // 5. No active internship for this crash enrollment
  if (activeInternship) {
    return {
      ok: false,
      error: 'ALREADY_ACTIVE',
      message: 'You already have an active internship for this course enrollment.',
    };
  }

  return {
    ok: true,
    tier,
  };
}
