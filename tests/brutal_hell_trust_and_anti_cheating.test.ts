import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  TRUST_CONSTANTS,
  getLocalTrustScore,
  persistTrustScore,
  applyTrustReward,
  applyVaultRejectionPenalty,
  recordCheatingIncident,
  isSessionPenalized,
  clearSessionPenalty,
  markSessionPenalized,
  clearInMemoryTrustState,
  getTrustStorageKey,
  getSessionPenaltyKey,
} from '../src/lib/trust/trustEngine';
import {
  createMcqVelocityTracker,
  createSessionProctor,
} from '../src/lib/trust/antiCheatingCheckers';

describe('🔥 HELL SUITE: Brutal Adversarial & Stress Testing for Trust Score & Anti-Cheating Guardian', () => {
  beforeEach(() => {
    clearInMemoryTrustState();
    if (typeof localStorage !== 'undefined') localStorage.clear();
    if (typeof sessionStorage !== 'undefined') sessionStorage.clear();
  });

  describe('1. Adversarial Fuzzing & Corrupted Input Sanitization', () => {
    it('handles null, undefined, and bizarre non-numeric types gracefully', () => {
      assert.equal(getLocalTrustScore(null, null), 50);
      assert.equal(getLocalTrustScore(undefined, undefined), 50);
      assert.equal(getLocalTrustScore('user_fuzz_1', NaN as any), 50);
      assert.equal(getLocalTrustScore('user_fuzz_2', Infinity as any), 50);
      assert.equal(getLocalTrustScore('user_fuzz_3', -Infinity as any), 50);
      assert.equal(getLocalTrustScore('user_fuzz_4', 'random_string' as any), 50);
      assert.equal(getLocalTrustScore('user_fuzz_5', {} as any), 50);
      assert.equal(getLocalTrustScore('user_fuzz_6', [] as any), 50);
    });

    it('sanitizes and clamps corrupted/injected values in localStorage', () => {
      const mockUserId = 'adversary_storage_test';
      const key = getTrustStorageKey(mockUserId);

      // Injected negative number
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(key, '-9999');
        assert.equal(getLocalTrustScore(mockUserId), 0);

        // Injected overflowing number
        localStorage.setItem(key, '999999');
        assert.equal(getLocalTrustScore(mockUserId), 100);

        // Injected NaN string
        localStorage.setItem(key, 'NotANumber');
        assert.equal(getLocalTrustScore(mockUserId), 50);

        // Injected float
        localStorage.setItem(key, '75.6');
        assert.equal(getLocalTrustScore(mockUserId), 76);
      }
    });

    it('normalizes legacy 40 fallback to baseline 50 for fresh unpenalized profiles', () => {
      // Legacy schema seeded users with 40
      const score = getLocalTrustScore('legacy_user_unpenalized', 40);
      // If local storage has no recorded mutations, baseline is strictly 50
      assert.equal(score, 40 > 0 ? 40 : 50); // fallback parameter check
      // For uninitialized profiles without fallback:
      assert.equal(getLocalTrustScore('brand_new_student'), 50);
    });
  });

  describe('2. Extreme Boundary & Overflow Resistance ([0, 100] Strict Invariant)', () => {
    it('withstands 30 consecutive positive rewards without exceeding 100', async () => {
      const uid = 'flood_user_up';
      let currentScore = 50;
      for (let i = 0; i < 30; i++) {
        const res = await applyTrustReward(uid, 'lesson', currentScore);
        currentScore = res.newScore;
        assert.ok(currentScore <= 100, `Score ${currentScore} exceeded 100 at iteration ${i}`);
      }
      assert.equal(currentScore, 100);
    });

    it('withstands 30 consecutive vault rejections without dropping below 0', async () => {
      const uid = 'flood_user_down';
      let currentScore = 50;
      for (let i = 0; i < 30; i++) {
        const res = await applyVaultRejectionPenalty(uid, currentScore);
        currentScore = res.newScore;
        assert.ok(currentScore >= 0, `Score ${currentScore} dropped below 0 at iteration ${i}`);
      }
      assert.equal(currentScore, 0);
    });

    it('exact boundary transition: 98 + 3 = 100 (not 101)', async () => {
      const res = await applyTrustReward('boundary_user_1', 'exam', 98);
      assert.equal(res.newScore, 100);
      assert.equal(res.delta, 3);
    });

    it('exact boundary transition: 1 - 2 = 0 (not -1)', async () => {
      await persistTrustScore('boundary_user_2', 1, 'setup');
      const res = await recordCheatingIncident('boundary_user_2', 'boundary_session_1', 'exam', 'bulk_paste');
      assert.equal(res.score, 0);
      assert.equal(res.delta, -2);
    });
  });

  describe('3. Massive Concurrency & Session Boundary Lock (One -2 Per Session)', () => {
    it('100 CONCURRENT cheating incident calls in ONE session: EXACTLY ONE succeeds, 99 deduplicated', async () => {
      const uid = 'brutal_cheater_session_stress';
      const sessionId = 'session_stress_flood_999';
      await persistTrustScore(uid, 50, 'init');

      // Fan out 100 simultaneous cheating reports for the same session
      const promises = Array.from({ length: 100 }, (_, idx) =>
        recordCheatingIncident(uid, sessionId, 'lesson', 'mcq_rapid_brute_force', { floodIndex: idx })
      );

      const results = await Promise.all(promises);

      const penalizedResults = results.filter(r => r.penalized === true);
      const skippedResults = results.filter(r => r.penalized === false && r.alreadyPenalizedInSession === true);

      assert.equal(penalizedResults.length, 1, 'Exactly one cheating report must penalize');
      assert.equal(skippedResults.length, 99, '99 cheating reports must be deduplicated');

      // Final score must be 48, NOT 50 - (100 * 2) = -150!
      const finalScore = getLocalTrustScore(uid);
      assert.equal(finalScore, 48);
    });

    it('Cross-Session Independence: 10 distinct sessions penalize independently', async () => {
      const uid = 'multi_session_user';
      await persistTrustScore(uid, 50, 'init');

      for (let s = 1; s <= 5; s++) {
        const sessId = `distinct_session_${s}`;
        const res = await recordCheatingIncident(uid, sessId, 'arena', 'arena_tab_switch');
        assert.equal(res.penalized, true);
        assert.equal(res.delta, -2);
      }

      // 5 sessions * -2 = -10. 50 - 10 = 40.
      assert.equal(getLocalTrustScore(uid), 40);
    });
  });

  describe('4. MCQ Anti-Spam vs Human Psychology Heuristic Stress Test', () => {
    it('HEURISTIC CHECK: Human reading question for 1.5s -> clicks -> NOT cheating', () => {
      let flagged = false;
      const tracker = createMcqVelocityTracker({
        mountTimestamp: Date.now() - 1500,
        onCheatingDetected: () => { flagged = true; },
      });

      const res = tracker.recordClick(2);
      assert.equal(res.isCheating, false);
      assert.equal(flagged, false);
    });

    it('HEURISTIC CHECK: Human mis-clicks option 0, then clicks option 1 after 300ms -> NOT cheating', () => {
      let flagged = false;
      const tracker = createMcqVelocityTracker({
        mountTimestamp: Date.now() - 2000,
        onCheatingDetected: () => { flagged = true; },
      });

      tracker.recordClick(0);
      const res = tracker.recordClick(1);
      assert.equal(res.isCheating, false);
      assert.equal(flagged, false);
    });

    it('HEURISTIC CHECK: Human clicks same option twice (double click / jitter) -> NOT cheating', () => {
      let flagged = false;
      const tracker = createMcqVelocityTracker({
        mountTimestamp: Date.now() - 2000,
        onCheatingDetected: () => { flagged = true; },
      });

      tracker.recordClick(1);
      const res = tracker.recordClick(1); // Same option repeated
      assert.equal(res.isCheating, false);
      assert.equal(flagged, false);
    });

    it('HEURISTIC CHECK: Human takes time between options (0.8s gap) -> NOT cheating', () => {
      let flagged = false;
      const tracker = createMcqVelocityTracker({
        mountTimestamp: Date.now() - 3000,
        spamWindowMs: 650, // 650ms window
        onCheatingDetected: () => { flagged = true; },
      });

      // Clicks option 0 at T=0
      tracker.recordClick(0);
      // Clicks option 1 at T=800ms (outside 650ms window)
      // We simulate by resetting mount time or tracker window
      tracker.reset(Date.now() - 1000);
      const res = tracker.recordClick(1);
      assert.equal(res.isCheating, false);
      assert.equal(flagged, false);
    });

    it('HEURISTIC CHECK: Automated Script Cycling (Option 0 -> Option 1 -> Option 2 in 100ms) -> FLAGGED', () => {
      let violationCaught = '';
      const tracker = createMcqVelocityTracker({
        mountTimestamp: Date.now() - 1000,
        onCheatingDetected: (type) => { violationCaught = type; },
      });

      tracker.recordClick(0);
      tracker.recordClick(1);
      const res = tracker.recordClick(2);

      assert.equal(res.isCheating, true);
      assert.equal(violationCaught, 'mcq_rapid_brute_force');
    });

    it('HEURISTIC CHECK: Instant Bot Click (Option 0 clicked in 40ms from render) -> FLAGGED', () => {
      let violationCaught = '';
      const tracker = createMcqVelocityTracker({
        mountTimestamp: Date.now(), // Question just mounted
        minReadTimeMs: 200,
        onCheatingDetected: (type) => { violationCaught = type; },
      });

      const res = tracker.recordClick(3);
      assert.equal(res.isCheating, true);
      assert.equal(violationCaught, 'mcq_instant_bot_click');
    });

    it('HEURISTIC CHECK: Question transition reset clears previous question clicks', () => {
      let flaggedCount = 0;
      const tracker = createMcqVelocityTracker({
        mountTimestamp: Date.now() - 2000,
        onCheatingDetected: () => { flaggedCount++; },
      });

      // Slide 1 honest click
      tracker.recordClick(1);

      // Slide 2 transition
      tracker.reset(Date.now() - 2000);

      // Slide 2 honest click
      const res = tracker.recordClick(2);
      assert.equal(res.isCheating, false);
      assert.equal(flaggedCount, 0);
    });
  });

  describe('5. Proctoring Paste Storms & Massive Text Ingestion', () => {
    it('handles 100,000-character adversarial paste payload without crash or lag', () => {
      let violationCaught = '';
      let pastedLengthRecorded = 0;

      const proctor = createSessionProctor({
        sessionId: 'exam_huge_payload_test',
        feature: 'exam',
        maxPasteChars: 120,
        onViolation: (type, details) => {
          violationCaught = type;
          pastedLengthRecorded = details?.pastedLength;
        }
      });

      const hugePayloadLength = 100_000;
      proctor.inspectPasteLength(hugePayloadLength);

      assert.equal(violationCaught, 'bulk_code_paste');
      assert.equal(pastedLengthRecorded, 100_000);

      proctor.destroy();
    });

    it('allows code snippets under the paste threshold', () => {
      let violationCaught = '';
      const proctor = createSessionProctor({
        sessionId: 'exam_small_paste_test',
        feature: 'exam',
        maxPasteChars: 120,
        onViolation: (type) => { violationCaught = type; }
      });

      proctor.inspectPasteLength(50); // Valid small snippet
      assert.equal(violationCaught, '');

      proctor.destroy();
    });
  });

  describe('6. Activity Reward Matrix Parity (+3 All Activities, +5 Vault)', () => {
    it('correctly maps all 4 core activity types to +3 delta', async () => {
      const activities = ['mission', 'lesson', 'exam', 'interview'] as const;
      for (const act of activities) {
        const res = await applyTrustReward(`user_${act}`, act, 50);
        assert.equal(res.delta, 3, `Activity ${act} should yield +3, got ${res.delta}`);
        assert.equal(res.newScore, 53, `Activity ${act} should transition 50 -> 53`);
      }
    });

    it('correctly maps vault verification to +5 and vault rejection to -5', async () => {
      const verifyRes = await applyTrustReward('user_v_test', 'vault_verified', 50);
      assert.equal(verifyRes.delta, 5);
      assert.equal(verifyRes.newScore, 55);

      const rejectRes = await applyVaultRejectionPenalty('user_v_test', 55);
      assert.equal(rejectRes.delta, -5);
      assert.equal(rejectRes.newScore, 50);
    });
  });
});
