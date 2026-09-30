/**
 * T-34 — Supervisor Evaluation Link (unit tests)
 *
 * Tests for:
 *  1. generateSupervisorToken returns token + hash pair
 *  2. hashToken matches the generated hash
 *  3. isTokenExpired logic
 *  4. SupervisorLinkSchema validation
 *  5. SupervisorEvaluationSchema — 4 rated areas
 *  6. Token is 64 hex chars (32 bytes)
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  generateSupervisorToken,
  hashToken,
  isTokenExpired,
  SupervisorLinkSchema,
  SupervisorEvaluationSchema,
  SUPERVISOR_TOKEN_EXPIRY_HOURS,
} from '../src/lib/internships/supervisorEval';

describe('T-34 — Supervisor Evaluation Link', () => {
  describe('generateSupervisorToken', () => {
    it('returns a token and hash pair', () => {
      const { token, hash } = generateSupervisorToken();
      assert.ok(token);
      assert.ok(hash);
      assert.notStrictEqual(token, hash);
    });

    it('token is 64 hex characters (32 bytes)', () => {
      const { token } = generateSupervisorToken();
      assert.match(token, /^[a-f0-9]{64}$/);
    });

    it('hash matches hashToken(token)', () => {
      const { token, hash } = generateSupervisorToken();
      assert.strictEqual(hashToken(token), hash);
    });

    it('each call produces a unique token', () => {
      const a = generateSupervisorToken();
      const b = generateSupervisorToken();
      assert.notStrictEqual(a.token, b.token);
      assert.notStrictEqual(a.hash, b.hash);
    });
  });

  describe('hashToken', () => {
    it('produces consistent hash for same input', () => {
      const input = 'test-token-abc123';
      assert.strictEqual(hashToken(input), hashToken(input));
    });

    it('produces 64-char hex string', () => {
      const result = hashToken('any-input');
      assert.match(result, /^[a-f0-9]{64}$/);
    });
  });

  describe('isTokenExpired', () => {
    it('returns true for past date', () => {
      assert.strictEqual(isTokenExpired('2020-01-01T00:00:00Z'), true);
    });

    it('returns false for future date', () => {
      const future = new Date(Date.now() + 3600_000).toISOString();
      assert.strictEqual(isTokenExpired(future), false);
    });
  });

  describe('SUPERVISOR_TOKEN_EXPIRY_HOURS', () => {
    it('is 72 hours', () => {
      assert.strictEqual(SUPERVISOR_TOKEN_EXPIRY_HOURS, 72);
    });
  });

  describe('SupervisorLinkSchema', () => {
    it('accepts valid input', () => {
      const result = SupervisorLinkSchema.safeParse({
        supervisorName: 'John Doe',
        supervisorEmail: 'john@company.com',
      });
      assert.strictEqual(result.success, true);
    });

    it('rejects short name', () => {
      const result = SupervisorLinkSchema.safeParse({
        supervisorName: 'J',
        supervisorEmail: 'j@c.com',
      });
      assert.strictEqual(result.success, false);
    });

    it('rejects invalid email', () => {
      const result = SupervisorLinkSchema.safeParse({
        supervisorName: 'John Doe',
        supervisorEmail: 'not-an-email',
      });
      assert.strictEqual(result.success, false);
    });
  });

  describe('SupervisorEvaluationSchema', () => {
    it('accepts all 4 rated areas with scores 1-5', () => {
      const result = SupervisorEvaluationSchema.safeParse({
        ratings: {
          technicalSkills: 4,
          communication: 3,
          initiative: 5,
          professionalism: 4,
        },
        comments: 'Good intern overall.',
      });
      assert.strictEqual(result.success, true);
    });

    it('rejects score above 5', () => {
      const result = SupervisorEvaluationSchema.safeParse({
        ratings: {
          technicalSkills: 6,
          communication: 3,
          initiative: 5,
          professionalism: 4,
        },
      });
      assert.strictEqual(result.success, false);
    });

    it('rejects score below 1', () => {
      const result = SupervisorEvaluationSchema.safeParse({
        ratings: {
          technicalSkills: 0,
          communication: 3,
          initiative: 5,
          professionalism: 4,
        },
      });
      assert.strictEqual(result.success, false);
    });

    it('requires all 4 areas', () => {
      const result = SupervisorEvaluationSchema.safeParse({
        ratings: {
          technicalSkills: 4,
          communication: 3,
        },
      });
      assert.strictEqual(result.success, false);
    });

    it('comments are optional', () => {
      const result = SupervisorEvaluationSchema.safeParse({
        ratings: {
          technicalSkills: 3,
          communication: 3,
          initiative: 3,
          professionalism: 3,
        },
      });
      assert.strictEqual(result.success, true);
    });
  });
});
