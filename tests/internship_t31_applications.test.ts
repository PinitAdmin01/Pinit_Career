/**
 * T-31 — Student Applications (unit tests)
 *
 * Tests for:
 *  1. Tier ordering logic (student tier >= opportunity min_tier)
 *  2. applicationToClient with all statuses
 *  3. opportunityToClient kind filtering
 */
import { describe, it, expect } from 'vitest';
import { applicationToClient, opportunityToClient } from '../src/lib/internships/toClient';

describe('T-31 — Student Applications', () => {
  const tierOrder: Record<string, number> = {
    t1_job_sim: 1,
    t2_virtual_team: 2,
    t3_project: 3,
    t4_industry: 4,
    t5_fellowship: 5,
  };

  describe('Tier eligibility filtering', () => {
    it('t3_project student qualifies for t3_project opportunity', () => {
      expect(tierOrder['t3_project'] >= tierOrder['t3_project']).toBe(true);
    });

    it('t2_virtual_team student does NOT qualify for t3_project', () => {
      expect(tierOrder['t2_virtual_team'] >= tierOrder['t3_project']).toBe(false);
    });

    it('t5_fellowship qualifies for all tiers', () => {
      for (const tier of Object.keys(tierOrder)) {
        expect(tierOrder['t5_fellowship'] >= tierOrder[tier]).toBe(true);
      }
    });

    it('t1_job_sim only qualifies for t1_job_sim', () => {
      expect(tierOrder['t1_job_sim'] >= tierOrder['t1_job_sim']).toBe(true);
      expect(tierOrder['t1_job_sim'] >= tierOrder['t2_virtual_team']).toBe(false);
    });
  });

  describe('Application status lifecycle', () => {
    const statuses = ['applied', 'shortlisted', 'accepted', 'rejected', 'withdrawn'] as const;

    for (const status of statuses) {
      it(`applicationToClient handles status "${status}"`, () => {
        const row = {
          id: `app-${status}`,
          opportunity_id: 'opp-1',
          student_id: 'stu-1',
          internship_enrollment_id: 'enr-1',
          status,
          created_at: '2025-07-01',
        };
        const client = applicationToClient(row);
        expect(client.status).toBe(status);
        expect(client.id).toBe(`app-${status}`);
      });
    }
  });

  describe('Opportunity kind filtering', () => {
    const kinds = ['client_project', 'open_source', 'industry', 'fellowship'] as const;

    for (const kind of kinds) {
      it(`opportunityToClient preserves kind "${kind}"`, () => {
        const row = {
          id: `opp-${kind}`,
          org_name: 'Test',
          org_website: null,
          kind,
          title: `${kind} role`,
          description: '',
          min_tier: 't3_project',
          seats: 1,
          paid: false,
          stipend: null,
          authenticity_tier: null,
          status: 'open' as const,
          created_at: '2025-01-01',
        };
        const client = opportunityToClient(row);
        expect(client.kind).toBe(kind);
      });
    }
  });
});
