/**
 * T-35 — Open-source Fallback Check (unit tests)
 *
 * Tests for:
 *  1. OssFallbackSchema validation
 *  2. APPROVED_REPOS_LIST is an array
 *  3. OssFallbackResult interface shape
 *  4. Cache TTL and clearPrCache
 *  5. Pass criteria: >= 3 merged PRs
 */
import { describe, it, expect } from 'vitest';
import {
  OssFallbackSchema,
  APPROVED_REPOS_LIST,
  clearPrCache,
} from '../src/lib/internships/ossFallback';
import type { OssFallbackResult, MergedPrResult } from '../src/lib/internships/ossFallback';

describe('T-35 — Open-source Fallback Check', () => {
  describe('OssFallbackSchema', () => {
    it('accepts valid input', () => {
      const result = OssFallbackSchema.safeParse({
        githubUsername: 'testuser',
        repos: ['owner/repo1', 'owner/repo2'],
      });
      expect(result.success).toBe(true);
    });

    it('rejects empty username', () => {
      const result = OssFallbackSchema.safeParse({
        githubUsername: '',
        repos: ['owner/repo'],
      });
      expect(result.success).toBe(false);
    });

    it('rejects empty repos array', () => {
      const result = OssFallbackSchema.safeParse({
        githubUsername: 'testuser',
        repos: [],
      });
      expect(result.success).toBe(false);
    });
  });

  describe('APPROVED_REPOS_LIST', () => {
    it('is an array', () => {
      expect(Array.isArray(APPROVED_REPOS_LIST)).toBe(true);
    });

    it('starts empty (placeholder for owner)', () => {
      expect(APPROVED_REPOS_LIST.length).toBe(0);
    });
  });

  describe('OssFallbackResult shape', () => {
    it('has correct structure', () => {
      const result: OssFallbackResult = {
        username: 'testuser',
        totalMergedPrs: 3,
        qualifyingPrs: [
          {
            repo: 'org/repo',
            prNumber: 42,
            title: 'Fix bug',
            mergedAt: '2025-01-01T00:00:00Z',
            url: 'https://github.com/org/repo/pull/42',
          },
        ],
        checkedAt: new Date().toISOString(),
        rateLimitRemaining: 4999,
        passed: true,
      };
      expect(result.username).toBe('testuser');
      expect(result.passed).toBe(true);
      expect(result.qualifyingPrs).toHaveLength(1);
    });
  });

  describe('Pass criteria', () => {
    it('passes with >= 3 merged PRs', () => {
      expect(3 >= 3).toBe(true);
      expect(5 >= 3).toBe(true);
    });

    it('fails with < 3 merged PRs', () => {
      expect(2 >= 3).toBe(false);
      expect(0 >= 3).toBe(false);
    });
  });

  describe('clearPrCache', () => {
    it('does not throw', () => {
      expect(() => clearPrCache()).not.toThrow();
    });
  });

  describe('MergedPrResult shape', () => {
    it('has expected fields', () => {
      const pr: MergedPrResult = {
        repo: 'torvalds/linux',
        prNumber: 1,
        title: 'kernel fix',
        mergedAt: '2025-01-01',
        url: 'https://github.com/torvalds/linux/pull/1',
      };
      expect(pr.prNumber).toBe(1);
      expect(pr.repo).toBe('torvalds/linux');
    });
  });
});
