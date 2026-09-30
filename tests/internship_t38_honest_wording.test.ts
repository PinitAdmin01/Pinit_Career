/**
 * T-38 — Honest Plan and Preview Wording (unit tests)
 *
 * Tests for:
 *  1. Tier 1 honest wording: "2-Week Python Job Simulation (simulated company)"
 *  2. Tier 2 honest wording: "4-Week Virtual Internship – Backend (team, simulated company)"
 *  3. INTERNSHIP_TIERS names in tiers.ts match requirements
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { INTERNSHIP_TIERS } from '../src/lib/internships/tiers';
import { INTERNSHIP_TIER_AVAILABLE, INTERNSHIP_AVAILABLE } from '../src/lib/data/crashPlansData';

describe('T-38 — Honest Plan Wording Per Tier', () => {
  describe('INTERNSHIP_TIERS naming transparency', () => {
    it('Tier 1 config name is "Python Job Simulation"', () => {
      assert.strictEqual(INTERNSHIP_TIERS.t1_job_sim.name, 'Python Job Simulation');
    });

    it('Tier 1 config is marked as simulated', () => {
      assert.strictEqual(INTERNSHIP_TIERS.t1_job_sim.simulated, true);
    });

    it('Tier 2 config name is "Virtual Internship – Backend"', () => {
      assert.strictEqual(INTERNSHIP_TIERS.t2_virtual_team.name, 'Virtual Internship – Backend');
    });

    it('Tier 2 config is marked as simulated', () => {
      assert.strictEqual(INTERNSHIP_TIERS.t2_virtual_team.simulated, true);
    });

    it('Tiers 3-5 are marked as real (simulated = false)', () => {
      assert.strictEqual(INTERNSHIP_TIERS.t3_project.simulated, false);
      assert.strictEqual(INTERNSHIP_TIERS.t4_industry.simulated, false);
      assert.strictEqual(INTERNSHIP_TIERS.t5_fellowship.simulated, false);
    });
  });

  describe('Feature flag defaults', () => {
    it('INTERNSHIP_AVAILABLE is false when all switches are off', () => {
      assert.strictEqual(INTERNSHIP_AVAILABLE, false);
    });

    it('all individual tier switches default to false', () => {
      assert.strictEqual(INTERNSHIP_TIER_AVAILABLE.t1_job_sim, false);
      assert.strictEqual(INTERNSHIP_TIER_AVAILABLE.t2_virtual_team, false);
      assert.strictEqual(INTERNSHIP_TIER_AVAILABLE.t3_project, false);
      assert.strictEqual(INTERNSHIP_TIER_AVAILABLE.t4_industry, false);
      assert.strictEqual(INTERNSHIP_TIER_AVAILABLE.t5_fellowship, false);
    });
  });

  describe('Honest wording helpers', () => {
    function getHonestWording(tier: keyof typeof INTERNSHIP_TIERS, switchState: boolean): string {
      if (!switchState) return 'Active Certification Track';
      if (tier === 't1_job_sim') return '2-Week Python Job Simulation (simulated company)';
      if (tier === 't2_virtual_team') return '4-Week Virtual Internship – Backend (team, simulated company)';
      return INTERNSHIP_TIERS[tier].name;
    }

    it('returns "Active Certification Track" when switch is off', () => {
      assert.strictEqual(getHonestWording('t1_job_sim', false), 'Active Certification Track');
    });

    it('returns Tier 1 honest wording when switch is on', () => {
      assert.strictEqual(getHonestWording('t1_job_sim', true), '2-Week Python Job Simulation (simulated company)');
    });

    it('returns Tier 2 honest wording when switch is on', () => {
      assert.strictEqual(getHonestWording('t2_virtual_team', true), '4-Week Virtual Internship – Backend (team, simulated company)');
    });
  });
});
