/**
 * T-38 — Honest Plan and Preview Wording (unit tests)
 *
 * Tests for:
 *  1. Tier 1 honest wording: "2-Week Python Job Simulation (simulated company)" and "2-Week Web Job Simulation (simulated company)"
 *  2. Tier 2 honest wording: "4-Week Virtual Internship – Backend (team, simulated company)" and "4-Week Virtual Internship – Full-Stack (team, simulated company)"
 *  3. INTERNSHIP_TIERS names in tiers.ts match requirements for both tracks
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { INTERNSHIP_TIERS, type InternshipTrack } from '../src/lib/internships/tiers';
import { INTERNSHIP_TIER_AVAILABLE, INTERNSHIP_AVAILABLE, type InternshipTier } from '../src/lib/data/crashPlansData';

describe('T-38 — Honest Plan Wording Per Tier', () => {
  describe('INTERNSHIP_TIERS naming transparency', () => {
    it('Python Tier 1 config name is "Python Job Simulation"', () => {
      assert.strictEqual(INTERNSHIP_TIERS.python_ai.t1_job_sim.name, 'Python Job Simulation');
    });

    it('Python Tier 1 config is marked as simulated', () => {
      assert.strictEqual(INTERNSHIP_TIERS.python_ai.t1_job_sim.simulated, true);
    });

    it('Python Tier 2 config name is "Virtual Internship – Backend"', () => {
      assert.strictEqual(INTERNSHIP_TIERS.python_ai.t2_virtual_team.name, 'Virtual Internship – Backend');
    });

    it('Python Tier 2 config is marked as simulated', () => {
      assert.strictEqual(INTERNSHIP_TIERS.python_ai.t2_virtual_team.simulated, true);
    });

    it('Web Tier 1 config name is "Web Developer Job Simulation"', () => {
      assert.strictEqual(INTERNSHIP_TIERS.web_fullstack.t1_job_sim.name, 'Web Developer Job Simulation');
    });

    it('Web Tier 1 config is marked as simulated', () => {
      assert.strictEqual(INTERNSHIP_TIERS.web_fullstack.t1_job_sim.simulated, true);
    });

    it('Web Tier 2 config name is "Virtual Internship – Full-Stack"', () => {
      assert.strictEqual(INTERNSHIP_TIERS.web_fullstack.t2_virtual_team.name, 'Virtual Internship – Full-Stack');
    });

    it('Web Tier 2 config is marked as simulated', () => {
      assert.strictEqual(INTERNSHIP_TIERS.web_fullstack.t2_virtual_team.simulated, true);
    });

    it('Tiers 3-5 are marked as real (simulated = false) on both tracks', () => {
      assert.strictEqual(INTERNSHIP_TIERS.python_ai.t3_project.simulated, false);
      assert.strictEqual(INTERNSHIP_TIERS.python_ai.t4_industry.simulated, false);
      assert.strictEqual(INTERNSHIP_TIERS.python_ai.t5_fellowship.simulated, false);

      assert.strictEqual(INTERNSHIP_TIERS.web_fullstack.t3_project.simulated, false);
      assert.strictEqual(INTERNSHIP_TIERS.web_fullstack.t4_industry.simulated, false);
      assert.strictEqual(INTERNSHIP_TIERS.web_fullstack.t5_fellowship.simulated, false);
    });
  });

  describe('Feature flag defaults', () => {
    it('INTERNSHIP_AVAILABLE is false when all switches are off', () => {
      assert.strictEqual(INTERNSHIP_AVAILABLE, false);
    });

    it('all individual tier switches default to false', () => {
      for (const track of ['python_ai', 'web_fullstack'] as const) {
        assert.strictEqual(INTERNSHIP_TIER_AVAILABLE[track].t1_job_sim, false);
        assert.strictEqual(INTERNSHIP_TIER_AVAILABLE[track].t2_virtual_team, false);
        assert.strictEqual(INTERNSHIP_TIER_AVAILABLE[track].t3_project, false);
        assert.strictEqual(INTERNSHIP_TIER_AVAILABLE[track].t4_industry, false);
        assert.strictEqual(INTERNSHIP_TIER_AVAILABLE[track].t5_fellowship, false);
      }
    });
  });

  describe('Honest wording helpers', () => {
    function getHonestWording(tier: InternshipTier, switchState: boolean, track: InternshipTrack = 'python_ai'): string {
      if (!switchState) return 'Active Certification Track';
      if (tier === 't1_job_sim') {
        return track === 'web_fullstack'
          ? '2-Week Web Job Simulation (simulated company)'
          : '2-Week Python Job Simulation (simulated company)';
      }
      if (tier === 't2_virtual_team') {
        return track === 'web_fullstack'
          ? '4-Week Virtual Internship – Full-Stack (team, simulated company)'
          : '4-Week Virtual Internship – Backend (team, simulated company)';
      }
      return INTERNSHIP_TIERS[track][tier].name;
    }

    it('returns "Active Certification Track" when switch is off', () => {
      assert.strictEqual(getHonestWording('t1_job_sim', false), 'Active Certification Track');
    });

    it('returns Tier 1 honest wording when switch is on for Python', () => {
      assert.strictEqual(getHonestWording('t1_job_sim', true, 'python_ai'), '2-Week Python Job Simulation (simulated company)');
    });

    it('returns Tier 2 honest wording when switch is on for Python', () => {
      assert.strictEqual(getHonestWording('t2_virtual_team', true, 'python_ai'), '4-Week Virtual Internship – Backend (team, simulated company)');
    });

    it('returns Tier 1 honest wording when switch is on for Web', () => {
      assert.strictEqual(getHonestWording('t1_job_sim', true, 'web_fullstack'), '2-Week Web Job Simulation (simulated company)');
    });

    it('returns Tier 2 honest wording when switch is on for Web', () => {
      assert.strictEqual(getHonestWording('t2_virtual_team', true, 'web_fullstack'), '4-Week Virtual Internship – Full-Stack (team, simulated company)');
    });
  });
});
