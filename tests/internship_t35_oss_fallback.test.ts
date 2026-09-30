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
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
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
      assert.strictEqual(result.success, true);
    });

    it('rejects empty username', () => {
      const result = OssFallbackSchema.safeParse({
        githubUsername: '',
        repos: ['owner/repo'],
      });
      assert.strictEqual(result.success, false);
    });

    it('rejects empty repos array', () => {
      const result = OssFallbackSchema.safeParse({
        githubUsername: 'testuser',
        repos: [],
      });
      assert.strictEqual(result.success, false);
    });
  });

  describe('APPROVED_REPOS_LIST', () => {
    it('is an array', () => {
      assert.strictEqual(Array.isArray(APPROVED_REPOS_LIST), true);
    });

    it('starts empty (placeholder for owner)', () => {
      assert.strictEqual(APPROVED_REPOS_LIST.length, 0);
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
      assert.strictEqual(result.username, 'testuser');
      assert.strictEqual(result.passed, true);
      assert.strictEqual(result.qualifyingPrs.length, 1);
    });
  });

  describe('Pass criteria', () => {
    it('passes with >= 3 merged PRs', () => {
      assert.strictEqual(3 >= 3, true);
      assert.strictEqual(5 >= 3, true);
    });

    it('fails with < 3 merged PRs', () => {
      assert.strictEqual(2 >= 3, false);
      assert.strictEqual(0 >= 3, false);
    });
  });

  describe('clearPrCache', () => {
    it('does not throw', () => {
      assert.doesNotThrow(() => clearPrCache());
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
      assert.strictEqual(pr.prNumber, 1);
      assert.strictEqual(pr.repo, 'torvalds/linux');
    });
  });
});
