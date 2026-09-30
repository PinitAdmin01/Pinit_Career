import test from 'node:test';
import assert from 'node:assert/strict';

import { COURSES_REGISTRY } from '../src/lib/data/coursesData';
import { getCrashPlanById } from '../src/lib/data/crashPlansData';
import {
  getCrashCourseCurriculum,
  getCrashCourseProgress,
  resolvePlanInternshipTier,
  isInternshipTierAvailable,
} from '../src/lib/courses/crashCourseProgress';
import type { CrashCourseEnrollment } from '../src/lib/services/crashCourseEnrollmentService';

const plan1m = getCrashPlanById('plan-1m-sprint')!;
const plan3m = getCrashPlanById('plan-3m-accelerator')!;
const curriculum1m = getCrashCourseCurriculum(plan1m, 'python_ai', COURSES_REGISTRY);
const allQuests1m = curriculum1m.map((l) => l.questId);

const mockPassedCapstoneEnrollment = {
  enrollmentId: 'enr-1m-test',
  planId: 'plan-1m-sprint',
  track: 'python_ai' as const,
  milestoneProgress: {
    sprint1Approved: true,
    sprint2Approved: true,
    sprint3RepoUrl: 'https://github.com/test/repo',
    sprint4DefenseScore: 90,
  },
  certificatesIssued: {},
};

test('resolvePlanInternshipTier maps plan tiers correctly', () => {
  assert.equal(resolvePlanInternshipTier({ tier: '1m' }), 't1_job_sim');
  assert.equal(resolvePlanInternshipTier({ tier: '3m' }), 't2_virtual_team');
  assert.equal(resolvePlanInternshipTier({ tier: '6m' }), 't3_project');
  assert.equal(resolvePlanInternshipTier({ tier: '9m' }), 't4_industry');
  assert.equal(resolvePlanInternshipTier({ tier: '12m' }), 't5_fellowship');
  assert.equal(resolvePlanInternshipTier(null, { planId: 'plan-1m-sprint' }), 't1_job_sim');
});

test('isInternshipTierAvailable respects overrides and per-tier settings', () => {
  // By default all tier switches are false (C8)
  assert.equal(isInternshipTierAvailable(plan1m), false);
  assert.equal(isInternshipTierAvailable(plan3m), false);

  // Override t1_job_sim to true
  assert.equal(isInternshipTierAvailable(plan1m, null, { t1_job_sim: true }), true);
  // Other tiers remain false
  assert.equal(isInternshipTierAvailable(plan3m, null, { t1_job_sim: true }), false);
});

test('tier OFF: internship phase is locked, graduation unlocks directly after capstone', () => {
  const progress = getCrashCourseProgress(
    plan1m,
    'python_ai',
    COURSES_REGISTRY,
    allQuests1m, // all lessons done
    mockPassedCapstoneEnrollment as any,
    { tierSwitchOverride: { t1_job_sim: false } }
  );

  assert.equal(progress.capstoneComplete, true);
  assert.equal(progress.phases.training, 'completed');
  assert.equal(progress.phases.capstone, 'completed');
  // Internship phase is locked when tier switch is off
  assert.equal(progress.phases.internship, 'locked');
  // Graduation phase opens immediately after capstone
  assert.equal(progress.phases.graduation, 'active');
});

test('tier ON: internship phase is active after capstone, graduation locked until internship completes', () => {
  const progress = getCrashCourseProgress(
    plan1m,
    'python_ai',
    COURSES_REGISTRY,
    allQuests1m, // all lessons done
    mockPassedCapstoneEnrollment as any,
    { tierSwitchOverride: { t1_job_sim: true } }
  );

  assert.equal(progress.capstoneComplete, true);
  assert.equal(progress.phases.training, 'completed');
  assert.equal(progress.phases.capstone, 'completed');
  // Internship phase is active now that capstone is complete
  assert.equal(progress.phases.internship, 'active');
  // Graduation is locked until internship completes
  assert.equal(progress.phases.graduation, 'locked');
});

test('tier ON: once internship certificate is issued, internship is completed and graduation is active', () => {
  const completedInternshipEnrollment = {
    ...mockPassedCapstoneEnrollment,
    certificatesIssued: {
      internshipCertHash: 'hash-pin-in-12345',
    },
  };

  const progress = getCrashCourseProgress(
    plan1m,
    'python_ai',
    COURSES_REGISTRY,
    allQuests1m,
    completedInternshipEnrollment as any,
    { tierSwitchOverride: { t1_job_sim: true } }
  );

  assert.equal(progress.internshipComplete, true);
  assert.equal(progress.phases.internship, 'completed');
  assert.equal(progress.phases.graduation, 'active');
});
