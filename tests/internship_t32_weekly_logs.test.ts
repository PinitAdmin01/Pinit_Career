/**
 * T-32 — Weekly Log & Hour Tracking (unit tests)
 *
 * Tests for:
 *  1. WEEKLY_LOG_REQUIREMENTS config per tier
 *  2. WeeklyLogSchema validation
 *  3. calculateLogProgress calculation
 *  4. weeklyLogToClient conversion
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  WEEKLY_LOG_REQUIREMENTS,
  WeeklyLogSchema,
  calculateLogProgress,
  weeklyLogToClient,
} from '../src/lib/internships/weeklyLogs';

describe('T-32 — Weekly Log & Hour Tracking', () => {
  describe('WEEKLY_LOG_REQUIREMENTS per tier', () => {
    it('t3_project requires 8 weeks and 30 hours/week (240h total)', () => {
      const req = WEEKLY_LOG_REQUIREMENTS.t3_project;
      assert.strictEqual(req.totalWeeks, 8);
      assert.strictEqual(req.minWeeklyHours, 30);
      assert.strictEqual(req.totalHours, 240);
    });

    it('t4_industry requires 8 weeks and 30 hours/week (240h total)', () => {
      const req = WEEKLY_LOG_REQUIREMENTS.t4_industry;
      assert.strictEqual(req.totalWeeks, 8);
      assert.strictEqual(req.minWeeklyHours, 30);
      assert.strictEqual(req.totalHours, 240);
    });

    it('t5_fellowship requires 16 weeks and 15 hours/week (240h total)', () => {
      const req = WEEKLY_LOG_REQUIREMENTS.t5_fellowship;
      assert.strictEqual(req.totalWeeks, 16);
      assert.strictEqual(req.minWeeklyHours, 15);
      assert.strictEqual(req.totalHours, 240);
    });
  });

  describe('WeeklyLogSchema validation', () => {
    it('accepts valid weekly log input', () => {
      const res = WeeklyLogSchema.safeParse({
        week: 1,
        hours: 32,
        summary: 'Built backend REST API endpoints and added unit tests.',
        links: ['https://github.com/example/repo'],
      });
      assert.strictEqual(res.success, true);
    });

    it('rejects week < 1 or > 26', () => {
      assert.strictEqual(WeeklyLogSchema.safeParse({ week: 0, hours: 10, summary: 'Valid summary text' }).success, false);
      assert.strictEqual(WeeklyLogSchema.safeParse({ week: 27, hours: 10, summary: 'Valid summary text' }).success, false);
    });

    it('rejects negative hours or hours > 80', () => {
      assert.strictEqual(WeeklyLogSchema.safeParse({ week: 1, hours: -5, summary: 'Valid summary text' }).success, false);
      assert.strictEqual(WeeklyLogSchema.safeParse({ week: 1, hours: 85, summary: 'Valid summary text' }).success, false);
    });

    it('rejects short summary (< 10 chars)', () => {
      assert.strictEqual(WeeklyLogSchema.safeParse({ week: 1, hours: 30, summary: 'Too short' }).success, false);
    });
  });

  describe('calculateLogProgress', () => {
    it('calculates progress correctly for 4 logs totaling 120h on t3_project', () => {
      const logs = [
        { week: 1, hours: 30 },
        { week: 2, hours: 30 },
        { week: 3, hours: 30 },
        { week: 4, hours: 30 },
      ];
      const prog = calculateLogProgress('t3_project', logs);
      assert.strictEqual(prog.totalWeeks, 4);
      assert.strictEqual(prog.totalHours, 120);
      assert.strictEqual(prog.requiredWeeks, 8);
      assert.strictEqual(prog.requiredHours, 240);
      assert.strictEqual(prog.percentComplete, 50);
      assert.strictEqual(prog.onTrack, true);
    });

    it('returns 100% complete when 8 weeks and 240h reached', () => {
      const logs = Array.from({ length: 8 }, (_, i) => ({ week: i + 1, hours: 30 }));
      const prog = calculateLogProgress('t3_project', logs);
      assert.strictEqual(prog.totalWeeks, 8);
      assert.strictEqual(prog.totalHours, 240);
      assert.strictEqual(prog.percentComplete, 100);
      assert.strictEqual(prog.onTrack, true);
    });
  });

  describe('weeklyLogToClient', () => {
    it('converts DB row to client object', () => {
      const row = {
        id: 'log-100',
        internship_enrollment_id: 'enr-100',
        week: 2,
        hours: 35,
        summary: 'Built API routes',
        links: ['https://example.com'],
        created_at: '2025-01-10T00:00:00Z',
      };
      const client = weeklyLogToClient(row);
      assert.strictEqual(client.id, 'log-100');
      assert.strictEqual(client.week, 2);
      assert.strictEqual(client.hours, 35);
      assert.strictEqual(client.summary, 'Built API routes');
    });
  });
});

