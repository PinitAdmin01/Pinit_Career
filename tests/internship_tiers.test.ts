import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { INTERNSHIP_TIERS, type InternshipTrack } from '../src/lib/internships/tiers';
import {
  PLAN_TIER_TO_INTERNSHIP,
  type InternshipTier,
} from '../src/lib/data/crashPlansData';
import { getCrashPlanByTier } from '../src/lib/data/crashPlansData';

const PLAN_TIERS = ['1m', '3m', '6m', '9m', '12m'] as const;
const TRACKS: InternshipTrack[] = ['python_ai', 'web_fullstack'];

describe('internship tier configuration', () => {
  it('every InternshipTier has a config entry for both tracks', () => {
    const tiers: InternshipTier[] = [
      't1_job_sim', 't2_virtual_team', 't3_project', 't4_industry', 't5_fellowship',
    ];
    for (const track of TRACKS) {
      assert.ok(INTERNSHIP_TIERS[track], `missing track config for ${track}`);
      for (const t of tiers) {
        const config = INTERNSHIP_TIERS[track][t];
        assert.ok(config, `missing config for ${track}.${t}`);
        assert.ok(config.name.length > 0, `${track}.${t} needs a name`);
        assert.ok(config.lengthDays > 0, `${track}.${t} needs lengthDays > 0`);
        assert.ok(config.courseIds.length > 0, `${track}.${t} needs at least one courseId`);
      }
    }
  });

  it('courseIds match the plan modules in crashPlansData for python_ai', () => {
    for (const planTier of PLAN_TIERS) {
      const internshipTier = PLAN_TIER_TO_INTERNSHIP[planTier];
      assert.ok(internshipTier, `no internship tier for plan ${planTier}`);

      const tierConfig = INTERNSHIP_TIERS.python_ai[internshipTier];
      assert.ok(tierConfig, `no config for ${internshipTier}`);

      const plan = getCrashPlanByTier(planTier as '1m' | '3m' | '6m' | '9m' | '12m');
      assert.ok(plan, `plan ${planTier} not found`);

      const pythonModules = plan.modulesByTrack?.python_ai;
      assert.ok(pythonModules, `plan ${planTier} has no python_ai modules`);

      const planCourseIds = pythonModules.map((m) => m.courseId);

      for (const cid of tierConfig.courseIds) {
        assert.ok(
          planCourseIds.includes(cid),
          `Tier ${internshipTier} courseId "${cid}" not found in plan ${planTier} python_ai modules: [${planCourseIds.join(', ')}]`,
        );
      }
    }
  });

  it('courseIds match the plan modules in crashPlansData for web_fullstack', () => {
    for (const planTier of PLAN_TIERS) {
      const internshipTier = PLAN_TIER_TO_INTERNSHIP[planTier];
      assert.ok(internshipTier, `no internship tier for plan ${planTier}`);

      const tierConfig = INTERNSHIP_TIERS.web_fullstack[internshipTier];
      assert.ok(tierConfig, `no config for ${internshipTier}`);

      const plan = getCrashPlanByTier(planTier as '1m' | '3m' | '6m' | '9m' | '12m');
      assert.ok(plan, `plan ${planTier} not found`);

      const webModules = plan.modulesByTrack?.web_fullstack;
      assert.ok(webModules, `plan ${planTier} has no web_fullstack modules`);

      const planCourseIds = webModules.map((m) => m.courseId);

      for (const cid of tierConfig.courseIds) {
        assert.ok(
          planCourseIds.includes(cid),
          `Tier ${internshipTier} courseId "${cid}" not found in plan ${planTier} web_fullstack modules: [${planCourseIds.join(', ')}]`,
        );
      }
    }
  });
});
