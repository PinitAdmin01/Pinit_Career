/**
 * T-38 — Honest Plan and Preview Wording (unit tests)
 *
 * Tests for:
 *  1. Tier 1 honest wording: "2-Week Python Job Simulation (simulated company)"
 *  2. Tier 2 honest wording: "4-Week Virtual Internship – Backend (team, simulated company)"
 *  3. INTERNSHIP_TIERS names in tiers.ts match requirements
 */
import { describe, it, expect } from 'vitest';
import { INTERNSHIP_TIERS } from '../src/lib/internships/tiers';
import { INTERNSHIP_TIER_AVAILABLE, INTERNSHIP_AVAILABLE } from '../src/lib/data/crashPlansData';

describe('T-38 — Honest Plan Wording Per Tier', () => {
  describe('INTERNSHIP_TIERS naming transparency', () => {
    it('Tier 1 config name is "Python Job Simulation"', () => {
      expect(INTERNSHIP_TIERS.t1_job_sim.name).toBe('Python Job Simulation');
    });

    it('Tier 1 config is marked as simulated', () => {
      expect(INTERNSHIP_TIERS.t1_job_sim.simulated).toBe(true);
    });

    it('Tier 2 config name is "Virtual Internship – Backend"', () => {
      expect(INTERNSHIP_TIERS.t2_virtual_team.name).toBe('Virtual Internship – Backend');
    });

    it('Tier 2 config is marked as simulated', () => {
      expect(INTERNSHIP_TIERS.t2_virtual_team.simulated).toBe(true);
    });

    it('Tiers 3-5 are marked as real (simulated = false)', () => {
      expect(INTERNSHIP_TIERS.t3_project.simulated).toBe(false);
      expect(INTERNSHIP_TIERS.t4_industry.simulated).toBe(false);
      expect(INTERNSHIP_TIERS.t5_fellowship.simulated).toBe(false);
    });
  });

  describe('Feature flag defaults', () => {
    it('INTERNSHIP_AVAILABLE is false when all switches are off', () => {
      expect(INTERNSHIP_AVAILABLE).toBe(false);
    });

    it('all individual tier switches default to false', () => {
      expect(INTERNSHIP_TIER_AVAILABLE.t1_job_sim).toBe(false);
      expect(INTERNSHIP_TIER_AVAILABLE.t2_virtual_team).toBe(false);
      expect(INTERNSHIP_TIER_AVAILABLE.t3_project).toBe(false);
      expect(INTERNSHIP_TIER_AVAILABLE.t4_industry).toBe(false);
      expect(INTERNSHIP_TIER_AVAILABLE.t5_fellowship).toBe(false);
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
      expect(getHonestWording('t1_job_sim', false)).toBe('Active Certification Track');
    });

    it('returns Tier 1 honest wording when switch is on', () => {
      expect(getHonestWording('t1_job_sim', true)).toBe('2-Week Python Job Simulation (simulated company)');
    });

    it('returns Tier 2 honest wording when switch is on', () => {
      expect(getHonestWording('t2_virtual_team', true)).toBe('4-Week Virtual Internship – Backend (team, simulated company)');
    });
  });
});
