/**
 * T-32 — Weekly Logs (unit tests)
 *
 * Tests for:
 *  1. WeeklyLogSchema validation
 *  2. WEEKLY_LOG_REQUIREMENTS §4 minimums
 *  3. calculateLogProgress computation
 *  4. weeklyLogToClient converter
 */
import { describe, it, expect } from 'vitest';
import {
  WeeklyLogSchema,
  WEEKLY_LOG_REQUIREMENTS,
  calculateLogProgress,
  weeklyLogToClient,
} from '../src/lib/internships/weeklyLogs';

describe('T-32 — Weekly Logs', () => {
  describe('WeeklyLogSchema', () => {
    it('accepts valid input', () => {
      const result = WeeklyLogSchema.safeParse({
        week: 1,
        hours: 32,
        summary: 'Built the API endpoints for user management.',
        links: ['https://github.com/org/repo/pull/1'],
      });
      expect(result.success).toBe(true);
    });

    it('rejects week 0', () => {
      const result = WeeklyLogSchema.safeParse({ week: 0, hours: 10, summary: 'some summary text here' });
      expect(result.success).toBe(false);
    });

    it('rejects negative hours', () => {
      const result = WeeklyLogSchema.safeParse({ week: 1, hours: -5, summary: 'some summary text here' });
      expect(result.success).toBe(false);
    });

    it('rejects too-short summary', () => {
      const result = WeeklyLogSchema.safeParse({ week: 1, hours: 20, summary: 'hi' });
      expect(result.success).toBe(false);
    });

    it('rejects hours above 80', () => {
      const result = WeeklyLogSchema.safeParse({ week: 1, hours: 81, summary: 'worked very hard this week' });
      expect(result.success).toBe(false);
    });

    it('defaults links to empty array', () => {
      const result = WeeklyLogSchema.safeParse({ week: 3, hours: 25, summary: 'completed feature work' });
      expect(result.success).toBe(true);
      if (result.success) expect(result.data.links).toEqual([]);
    });
  });

  describe('WEEKLY_LOG_REQUIREMENTS', () => {
    it('t3_project: 8 weeks × 30h = 240 total', () => {
      const r = WEEKLY_LOG_REQUIREMENTS['t3_project'];
      expect(r).toBeDefined();
      expect(r.minWeeklyHours).toBe(30);
      expect(r.totalWeeks).toBe(8);
      expect(r.totalHours).toBe(240);
    });

    it('t4_industry: same as t3', () => {
      const r = WEEKLY_LOG_REQUIREMENTS['t4_industry'];
      expect(r.totalHours).toBe(240);
      expect(r.minWeeklyHours).toBe(30);
    });

    it('t5_fellowship: 16 weeks × 15h = 240 total', () => {
      const r = WEEKLY_LOG_REQUIREMENTS['t5_fellowship'];
      expect(r.minWeeklyHours).toBe(15);
      expect(r.totalWeeks).toBe(16);
      expect(r.totalHours).toBe(240);
    });

    it('t1 and t2 have no weekly log requirements', () => {
      expect(WEEKLY_LOG_REQUIREMENTS['t1_job_sim']).toBeUndefined();
      expect(WEEKLY_LOG_REQUIREMENTS['t2_virtual_team']).toBeUndefined();
    });
  });

  describe('calculateLogProgress', () => {
    it('returns 0% for no logs', () => {
      const p = calculateLogProgress('t3_project', []);
      expect(p.totalHours).toBe(0);
      expect(p.percentComplete).toBe(0);
    });

    it('calculates 50% at 120 of 240 hours', () => {
      const logs = [
        { week: 1, hours: 30 },
        { week: 2, hours: 30 },
        { week: 3, hours: 30 },
        { week: 4, hours: 30 },
      ];
      const p = calculateLogProgress('t3_project', logs);
      expect(p.totalHours).toBe(120);
      expect(p.percentComplete).toBe(50);
      expect(p.totalWeeks).toBe(4);
    });

    it('caps at 100%', () => {
      const logs = Array.from({ length: 10 }, (_, i) => ({ week: i + 1, hours: 30 }));
      const p = calculateLogProgress('t3_project', logs);
      expect(p.totalHours).toBe(300);
      expect(p.percentComplete).toBe(100);
    });

    it('returns zeros for unknown tier', () => {
      const p = calculateLogProgress('t1_job_sim', [{ week: 1, hours: 20 }]);
      expect(p.requiredHours).toBe(0);
      expect(p.percentComplete).toBe(0);
    });

    it('marks on track when average is above 80% of minimum', () => {
      const logs = [
        { week: 1, hours: 28 }, // 28 >= 30 * 0.8 = 24
        { week: 2, hours: 25 },
      ];
      const p = calculateLogProgress('t3_project', logs);
      expect(p.onTrack).toBe(true);
    });
  });

  describe('weeklyLogToClient', () => {
    it('converts snake_case row', () => {
      const row = {
        id: 'log-1',
        internship_enrollment_id: 'enr-1',
        week: 3,
        hours: 32,
        summary: 'Implemented auth module',
        links: ['https://github.com/pr/1'],
        created_at: '2025-05-01',
      };
      const client = weeklyLogToClient(row);
      expect(client.id).toBe('log-1');
      expect(client.internshipEnrollmentId).toBe('enr-1');
      expect(client.week).toBe(3);
      expect(client.hours).toBe(32);
      expect(client.links).toEqual(['https://github.com/pr/1']);
    });
  });
});
