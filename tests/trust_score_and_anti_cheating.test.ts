import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  TRUST_CONSTANTS,
  getLocalTrustScore,
  applyTrustReward,
  applyVaultRejectionPenalty,
  recordCheatingIncident,
  isSessionPenalized,
  clearSessionPenalty,
  clearInMemoryTrustState,
} from '../src/lib/trust/trustEngine';
import {
  createMcqVelocityTracker,
  createSessionProctor
} from '../src/lib/trust/antiCheatingCheckers';

describe('Trust Score Engine & Anti-Cheating Guardian Suite', () => {
  beforeEach(() => {
    clearInMemoryTrustState();
  });
  describe('Invariant 1: Baseline Trust Score & Boundaries', () => {
    it('defaults to strictly 50 for new students / uninitialized state', () => {
      const defaultScore = getLocalTrustScore('student_fresh_001');
      assert.equal(defaultScore, 50);
      assert.equal(defaultScore, TRUST_CONSTANTS.DEFAULT_SCORE);
    });

    it('normalizes legacy 40 fallback to baseline 50', () => {
      const score = getLocalTrustScore('student_legacy_001', 50);
      assert.equal(score, 50);
    });

    it('enforces upper bound clamp at 100', async () => {
      const res = await applyTrustReward('user_high', 'vault_verified', 98);
      assert.equal(res.newScore, 100);
    });

    it('enforces lower bound clamp at 0', async () => {
      const res = await applyVaultRejectionPenalty('user_low', 3);
      assert.equal(res.newScore, 0);
    });
  });

  describe('Invariant 2: Activity Completions (+3 Boost)', () => {
    it('awards +3 Trust Score for completing a mission', async () => {
      const res = await applyTrustReward('user_mission', 'mission', 50);
      assert.equal(res.delta, 3);
      assert.equal(res.newScore, 53);
    });

    it('awards +3 Trust Score for completing a course lesson', async () => {
      const res = await applyTrustReward('user_lesson', 'lesson', 53);
      assert.equal(res.delta, 3);
      assert.equal(res.newScore, 56);
    });

    it('awards +3 Trust Score for completing an assessment exam', async () => {
      const res = await applyTrustReward('user_exam', 'exam', 56);
      assert.equal(res.delta, 3);
      assert.equal(res.newScore, 59);
    });

    it('awards +3 Trust Score for completing an AI interview', async () => {
      const res = await applyTrustReward('user_interview', 'interview', 59);
      assert.equal(res.delta, 3);
      assert.equal(res.newScore, 62);
    });
  });

  describe('Invariant 3: Vault Document Verification (+5 / -5)', () => {
    it('awards +5 Trust Score when an authentic document is verified in Vault', async () => {
      const res = await applyTrustReward('user_vault', 'vault_verified', 50);
      assert.equal(res.delta, 5);
      assert.equal(res.newScore, 55);
    });

    it('deducts -5 Trust Score when a document is rejected / invalid in Vault', async () => {
      const res = await applyVaultRejectionPenalty('user_vault_rej', 55);
      assert.equal(res.delta, -5);
      assert.equal(res.newScore, 50);
    });
  });

  describe('Invariant 4: Cheating Penalty & Session Boundary Deduplication', () => {
    const testSessionA = 'session_test_lesson_101';
    const testSessionB = 'session_test_exam_202';

    beforeEach(() => {
      clearSessionPenalty(testSessionA);
      clearSessionPenalty(testSessionB);
    });

    it('deducts exactly -2 Trust Score on first cheating infraction in a session', async () => {
      const res = await recordCheatingIncident(
        'student_cheater_1',
        testSessionA,
        'lesson',
        'mcq_rapid_brute_force'
      );

      assert.equal(res.penalized, true);
      assert.equal(res.delta, -2);
      assert.equal(res.score, 48); // 50 - 2 = 48
      assert.equal(res.alreadyPenalizedInSession, false);
      assert.equal(isSessionPenalized(testSessionA), true);
    });

    it('STRICT INVARIANT: Multiple cheating actions in ONE session only reduce -2 ONCE', async () => {
      // 1st infraction in session A
      const first = await recordCheatingIncident(
        'student_serial_cheater',
        testSessionA,
        'lesson',
        'mcq_rapid_brute_force'
      );
      assert.equal(first.penalized, true);
      assert.equal(first.score, 48);

      // 2nd infraction in same session A
      const second = await recordCheatingIncident(
        'student_serial_cheater',
        testSessionA,
        'lesson',
        'mcq_rapid_brute_force'
      );
      assert.equal(second.penalized, false);
      assert.equal(second.delta, 0);
      assert.equal(second.score, 48); // Score stays at 48, NOT 46!
      assert.equal(second.alreadyPenalizedInSession, true);

      // 3rd, 4th, 5th infractions in same session A
      for (let i = 0; i < 3; i++) {
        const next = await recordCheatingIncident(
          'student_serial_cheater',
          testSessionA,
          'lesson',
          'tab_switching'
        );
        assert.equal(next.penalized, false);
        assert.equal(next.score, 48); // No extra deductions!
      }

      // Fresh Session B should now be eligible for its own single penalty
      const sessionBRes = await recordCheatingIncident(
        'student_serial_cheater',
        testSessionB,
        'exam',
        'tab_switching_proctored'
      );
      assert.equal(sessionBRes.penalized, true);
      assert.equal(sessionBRes.delta, -2);
      assert.equal(sessionBRes.score, 46); // 48 - 2 = 46
    });
  });

  describe('Invariant 5: MCQ Velocity Checkers (Spam vs Honest Mistakes / Mis-clicks)', () => {
    it('permits honest reading and thoughtful trial-and-error without penalty', () => {
      let cheatingDetected = false;
      const tracker = createMcqVelocityTracker({
        mountTimestamp: Date.now() - 2000, // Question was loaded 2 seconds ago
        onCheatingDetected: () => { cheatingDetected = true; },
      });

      // User reads for 2s and clicks option 0
      const first = tracker.recordClick(0);
      assert.equal(first.isCheating, false);
      assert.equal(cheatingDetected, false);
    });

    it('permits honest mis-click (student accidentally taps wrong option, then correct option)', () => {
      let cheatingDetected = false;
      const tracker = createMcqVelocityTracker({
        mountTimestamp: Date.now() - 1500,
        onCheatingDetected: () => { cheatingDetected = true; },
      });

      // Student clicks option 0
      tracker.recordClick(0);
      // Student realizes mis-click and selects option 1
      const second = tracker.recordClick(1);

      assert.equal(second.isCheating, false);
      assert.equal(cheatingDetected, false);
    });

    it('detects superhuman instant click (< 200ms from question mount)', () => {
      let detectedViolation = '';
      const tracker = createMcqVelocityTracker({
        mountTimestamp: Date.now(), // Question just mounted right now (< 50ms ago)
        onCheatingDetected: (type) => { detectedViolation = type; },
      });

      const res = tracker.recordClick(0);
      assert.equal(res.isCheating, true);
      assert.equal(detectedViolation, 'mcq_instant_bot_click');
    });

    it('detects rapid automated brute-force spam cycling all options in milliseconds', () => {
      let detectedViolation = '';
      const tracker = createMcqVelocityTracker({
        mountTimestamp: Date.now() - 1000,
        onCheatingDetected: (type) => { detectedViolation = type; },
      });

      // Automated spam: clicks 3 distinct options in rapid succession
      tracker.recordClick(0);
      tracker.recordClick(1);
      const third = tracker.recordClick(2);

      assert.equal(third.isCheating, true);
      assert.equal(detectedViolation, 'mcq_rapid_brute_force');
    });
  });

  describe('Invariant 6: Proctored Session Anti-Cheating (Paste Storms & Tab Switches)', () => {
    it('detects massive bulk paste storms into proctored coding editor', () => {
      let violation = '';
      let violationDetails: any = null;

      const proctor = createSessionProctor({
        sessionId: 'exam_proctor_test',
        feature: 'exam',
        maxPasteChars: 80,
        onViolation: (type, details) => {
          violation = type;
          violationDetails = details;
        }
      });

      // Inspect small honest paste (e.g. variable name or 10 characters)
      proctor.inspectPasteLength(15);
      assert.equal(violation, '');

      // Inspect bulk 250-character code block paste
      proctor.inspectPasteLength(250);
      assert.equal(violation, 'bulk_code_paste');
      assert.equal(violationDetails?.pastedLength, 250);

      proctor.destroy();
    });
  });
});
