import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { checkInternshipEligibility } from '../src/lib/internships/eligibility';

describe('internship eligibility checks (checkInternshipEligibility)', () => {
  const completedCapstoneEnrollment = {
    milestoneProgress: {
      sprint1Approved: true,
      sprint2Approved: true,
      sprint3RepoUrl: 'https://github.com/student/capstone-repo',
      sprint4DefenseScore: 85,
    },
    certificatesIssued: {},
  };

  it('fails with NO_INTERNSHIP_TIER when plan has no mapped tier (e.g. 24m or invalid)', () => {
    const res = checkInternshipEligibility({
      enrollment: completedCapstoneEnrollment,
      plan: { tier: '24m' },
      track: 'python_ai',
      tierSwitchOverride: { t1_job_sim: true },
    });

    assert.strictEqual(res.ok, false);
    if (!res.ok) {
      assert.strictEqual(res.error, 'NO_INTERNSHIP_TIER');
    }
  });

  it('fails with TRACK_NOT_ELIGIBLE when track is web_fullstack', () => {
    const res = checkInternshipEligibility({
      enrollment: completedCapstoneEnrollment,
      plan: { tier: '1m' },
      track: 'web_fullstack',
      tierSwitchOverride: { t1_job_sim: true },
    });

    assert.strictEqual(res.ok, false);
    if (!res.ok) {
      assert.strictEqual(res.error, 'TRACK_NOT_ELIGIBLE');
    }
  });

  it('fails with CAPSTONE_NOT_COMPLETE when capstone is unfinished', () => {
    const incompleteEnrollment = {
      milestoneProgress: {
        sprint1Approved: true,
        sprint2Approved: false, // sprint 2 not approved
        sprint3RepoUrl: null,
        sprint4DefenseScore: null,
      },
      certificatesIssued: {},
    };

    const res = checkInternshipEligibility({
      enrollment: incompleteEnrollment,
      plan: { tier: '1m' },
      track: 'python_ai',
      tierSwitchOverride: { t1_job_sim: true },
    });

    assert.strictEqual(res.ok, false);
    if (!res.ok) {
      assert.strictEqual(res.error, 'CAPSTONE_NOT_COMPLETE');
    }
  });

  it('fails with TIER_NOT_AVAILABLE when switch is off (default in production)', () => {
    // Note: INTERNSHIP_TIER_AVAILABLE is all false in production
    const res = checkInternshipEligibility({
      enrollment: completedCapstoneEnrollment,
      plan: { tier: '1m' },
      track: 'python_ai',
    });

    assert.strictEqual(res.ok, false);
    if (!res.ok) {
      assert.strictEqual(res.error, 'TIER_NOT_AVAILABLE');
    }
  });

  it('fails with ALREADY_ACTIVE when student already has an active internship', () => {
    const res = checkInternshipEligibility({
      enrollment: completedCapstoneEnrollment,
      plan: { tier: '1m' },
      track: 'python_ai',
      activeInternship: true,
      tierSwitchOverride: { t1_job_sim: true },
    });

    assert.strictEqual(res.ok, false);
    if (!res.ok) {
      assert.strictEqual(res.error, 'ALREADY_ACTIVE');
    }
  });

  it('succeeds for 1m plan and returns t1_job_sim when all conditions are satisfied', () => {
    const res = checkInternshipEligibility({
      enrollment: completedCapstoneEnrollment,
      plan: { tier: '1m' },
      track: 'python_ai',
      activeInternship: false,
      tierSwitchOverride: { t1_job_sim: true },
    });

    assert.strictEqual(res.ok, true);
    if (res.ok) {
      assert.strictEqual(res.tier, 't1_job_sim');
    }
  });

  it('correctly maps 3m, 6m, 9m, and 12m plans to their respective tiers', () => {
    const plansToTiers: Record<string, string> = {
      '3m': 't2_virtual_team',
      '6m': 't3_project',
      '9m': 't4_industry',
      '12m': 't5_fellowship',
    };

    for (const [planTier, expectedInternshipTier] of Object.entries(plansToTiers)) {
      const res = checkInternshipEligibility({
        enrollment: completedCapstoneEnrollment,
        plan: { tier: planTier },
        track: 'python_ai',
        tierSwitchOverride: { [expectedInternshipTier]: true },
      });

      assert.strictEqual(res.ok, true);
      if (res.ok) {
        assert.strictEqual(res.tier, expectedInternshipTier);
      }
    }
  });
});
