import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  CRASH_COURSE_PLANS,
  INTERNSHIP_AVAILABLE,
  INTERNSHIP_TIER_AVAILABLE,
} from '../src/lib/data/crashPlansData';

const INTERNSHIP_RE = /intern|fellowship|apprentice/i;

describe('internship switches', () => {
  it('all tier switches are false', () => {
    for (const [track, tiers] of Object.entries(INTERNSHIP_TIER_AVAILABLE)) {
      for (const [tier, on] of Object.entries(tiers)) {
        assert.strictEqual(on, false, `${track}.${tier} should be off`);
      }
    }
  });

  it('INTERNSHIP_AVAILABLE is false when all tier switches are off', () => {
    assert.strictEqual(INTERNSHIP_AVAILABLE, false);
  });

  it('no plan in CRASH_COURSE_PLANS has an internship feature when all switches are off', () => {
    for (const plan of CRASH_COURSE_PLANS) {
      for (const feature of plan.features) {
        assert.ok(
          !INTERNSHIP_RE.test(feature),
          `Plan ${plan.id} feature should not mention internship/fellowship/apprentice: "${feature}"`,
        );
      }
      for (const step of plan.journeySteps) {
        assert.ok(
          !INTERNSHIP_RE.test(`${step.title} ${step.subtitle}`),
          `Plan ${plan.id} journey step should not mention internship/fellowship/apprentice: "${step.title} ${step.subtitle}"`,
        );
      }
    }
  });
});
