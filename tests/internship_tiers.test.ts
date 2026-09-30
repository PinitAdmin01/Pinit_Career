import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { INTERNSHIP_TIERS } from '../src/lib/internships/tiers';
import {
  PLAN_TIER_TO_INTERNSHIP,
  type InternshipTier,
} from '../src/lib/data/crashPlansData';

// We import the raw ALL_CRASH_COURSE_PLANS indirectly via the exported plans.
// The module-level constant applies withoutInternship, but the modulesByTrack
// is never stripped, so we can read it from any exported plan list.
// However we need the raw plans. We re-import the file and read ALL plans.
// Since ALL_CRASH_COURSE_PLANS is not exported, we use the plan getter.
import { getCrashPlanByTier } from '../src/lib/data/crashPlansData';

const PLAN_TIERS = ['1m', '3m', '6m', '9m', '12m'] as const;

describe('internship tier configuration', () => {
  it('every InternshipTier has a config entry', () => {
    const tiers: InternshipTier[] = [
      't1_job_sim', 't2_virtual_team', 't3_project', 't4_industry', 't5_fellowship',
    ];
    for (const t of tiers) {
      assert.ok(INTERNSHIP_TIERS[t], `missing config for ${t}`);
      assert.ok(INTERNSHIP_TIERS[t].name.length > 0, `${t} needs a name`);
      assert.ok(INTERNSHIP_TIERS[t].lengthDays > 0, `${t} needs lengthDays > 0`);
      assert.ok(INTERNSHIP_TIERS[t].courseIds.length > 0, `${t} needs at least one courseId`);
    }
  });

  it('courseIds match the plan modules in crashPlansData for python_ai', () => {
    for (const planTier of PLAN_TIERS) {
      const internshipTier = PLAN_TIER_TO_INTERNSHIP[planTier];
      assert.ok(internshipTier, `no internship tier for plan ${planTier}`);

      const tierConfig = INTERNSHIP_TIERS[internshipTier];
      assert.ok(tierConfig, `no config for ${internshipTier}`);

      // getCrashPlanByTier may return the withoutInternship version, but
      // modulesByTrack is preserved, so this still works.
      const plan = getCrashPlanByTier(planTier as '1m' | '3m' | '6m' | '9m' | '12m');
      assert.ok(plan, `plan ${planTier} not found`);

      const pythonModules = plan.modulesByTrack?.python_ai;
      assert.ok(pythonModules, `plan ${planTier} has no python_ai modules`);

      const planCourseIds = pythonModules.map((m) => m.courseId);

      // Every courseId in the tier config must appear in the plan's python_ai modules
      for (const cid of tierConfig.courseIds) {
        assert.ok(
          planCourseIds.includes(cid),
          `Tier ${internshipTier} courseId "${cid}" not found in plan ${planTier} python_ai modules: [${planCourseIds.join(', ')}]`,
        );
      }
    }
  });
});
