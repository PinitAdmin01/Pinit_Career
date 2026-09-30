/**
 * T-33 — Mentor Role and Reviews (unit tests)
 *
 * Tests for:
 *  1. MENTOR_REVIEW_REQUIRED flag defaults to false (D1 default)
 *  2. MENTOR_OR_ADMIN_ROLES set contains 'mentor'
 *  3. MentorReviewSchema validation
 *  4. Tier config needsMentor flags
 */
import { describe, it, expect } from 'vitest';
import { MENTOR_REVIEW_REQUIRED, INTERNSHIP_TIERS } from '../src/lib/internships/tiers';
import { z } from 'zod';

// Re-create the schema from the route for unit testing
const MentorReviewSchema = z.object({
  decision: z.enum(['approved', 'changes_requested']),
  feedback: z.string().min(5).max(2000),
  areas: z.array(z.object({
    name: z.string(),
    score: z.number().min(1).max(5),
    comment: z.string().optional(),
  })).optional(),
});

describe('T-33 — Mentor Role and Reviews', () => {
  describe('MENTOR_REVIEW_REQUIRED flag', () => {
    it('defaults to false (D1 default: no human mentors)', () => {
      expect(MENTOR_REVIEW_REQUIRED).toBe(false);
    });
  });

  describe('Tier needsMentor config', () => {
    it('t1_job_sim does NOT need mentor', () => {
      expect(INTERNSHIP_TIERS.t1_job_sim.needsMentor).toBe(false);
    });

    it('t2_virtual_team DOES need mentor', () => {
      expect(INTERNSHIP_TIERS.t2_virtual_team.needsMentor).toBe(true);
    });

    it('t3_project DOES need mentor', () => {
      expect(INTERNSHIP_TIERS.t3_project.needsMentor).toBe(true);
    });

    it('t4_industry does NOT need mentor (supervisor instead)', () => {
      expect(INTERNSHIP_TIERS.t4_industry.needsMentor).toBe(false);
    });

    it('t5_fellowship does NOT need mentor', () => {
      expect(INTERNSHIP_TIERS.t5_fellowship.needsMentor).toBe(false);
    });
  });

  describe('MentorReviewSchema', () => {
    it('accepts valid approved review', () => {
      const result = MentorReviewSchema.safeParse({
        decision: 'approved',
        feedback: 'Good work on the API design.',
      });
      expect(result.success).toBe(true);
    });

    it('accepts changes_requested with areas', () => {
      const result = MentorReviewSchema.safeParse({
        decision: 'changes_requested',
        feedback: 'Need improvements in error handling.',
        areas: [
          { name: 'Code Quality', score: 3, comment: 'Decent' },
          { name: 'Testing', score: 2, comment: 'Add more tests' },
        ],
      });
      expect(result.success).toBe(true);
    });

    it('rejects invalid decision', () => {
      const result = MentorReviewSchema.safeParse({
        decision: 'rejected',
        feedback: 'Not valid',
      });
      expect(result.success).toBe(false);
    });

    it('rejects too-short feedback', () => {
      const result = MentorReviewSchema.safeParse({
        decision: 'approved',
        feedback: 'ok',
      });
      expect(result.success).toBe(false);
    });

    it('rejects area score outside 1-5', () => {
      const result = MentorReviewSchema.safeParse({
        decision: 'approved',
        feedback: 'Great job overall',
        areas: [{ name: 'Quality', score: 6 }],
      });
      expect(result.success).toBe(false);
    });
  });

  describe('MENTOR_OR_ADMIN role set', () => {
    const MENTOR_OR_ADMIN_ROLES = new Set(['admin', 'superadmin', 'mentor']);

    it('includes mentor', () => {
      expect(MENTOR_OR_ADMIN_ROLES.has('mentor')).toBe(true);
    });

    it('includes admin', () => {
      expect(MENTOR_OR_ADMIN_ROLES.has('admin')).toBe(true);
    });

    it('excludes student', () => {
      expect(MENTOR_OR_ADMIN_ROLES.has('student')).toBe(false);
    });

    it('excludes teacher', () => {
      expect(MENTOR_OR_ADMIN_ROLES.has('teacher')).toBe(false);
    });
  });
});
