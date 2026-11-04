import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import {
  ARENA_RULES_CONFIG,
  checkRunCooldown,
  calculateBattleScore,
  resolveMatchWinner,
  createCombatEvent,
} from '../src/lib/arena/codeWarRules';
import { calculateStudentKnowledge } from '../src/lib/arena/knowledgeEngine';
import { calculateEloMatch } from '../src/lib/arena/eloEngine';
import { ArenaPvPStore, ArenaRoom } from '../src/lib/services/arenaPvPStore';
import { judgeCodeWarsSubmission } from '../src/lib/server/codeWarsJudge';
import { validateVmCodeSecurity } from '../src/lib/server/codeWarsSandbox';
import { BattleAudio } from '../src/lib/arena/battleAudio';
import { setSupabaseAdminForTests } from '../src/lib/server/supabaseAdmin';

describe('Adversarial Red-Team Audit: Code War Arena & Rules Engine Under Extreme Duress', () => {
  before(() => {
    // Provide in-memory mock admin with clean table routing
    const mockAdmin: any = {
      from: (table: string) => {
        if (table === 'arena_rooms' || table === 'arena_room_submissions' || table === 'arena_matchmaking_queue') {
          const roomQb: any = {
            select: () => roomQb,
            eq: () => roomQb,
            neq: () => roomQb,
            gte: () => roomQb,
            order: () => roomQb,
            limit: () => roomQb,
            maybeSingle: async () => ({ data: null, error: new Error('offline_test') }),
            update: () => roomQb,
            insert: async () => ({ error: new Error('offline_test') }),
            upsert: async () => ({ error: new Error('offline_test') }),
            delete: () => roomQb,
            then: (resolve: any) => resolve({ data: null, error: new Error('offline_test') }),
          };
          return roomQb;
        }

        const userQb: any = {
          select: () => userQb,
          eq: () => userQb,
          maybeSingle: async () => ({
            data: { arena_elo: 1000, arena_wins: 0, arena_losses: 0, xp_total: 100, weekly_xp: 100, pins: 10 },
            error: null,
          }),
          update: () => userQb,
          insert: async () => ({ error: null }),
          upsert: async () => ({ error: null }),
          then: (resolve: any) => resolve({ data: [], error: null }),
        };
        return userQb;
      },
    };
    setSupabaseAdminForTests(mockAdmin);
  });

  describe('Vector 1: Malicious AST & Sandbox Breakout Prevention', () => {
    it('blocks process, require, and child_process injection attempts before VM execution', async () => {
      const maliciousCodes = [
        'const fs = require("fs"); fs.readFileSync("/etc/passwd");',
        'process.exit(1);',
        'const cp = child_process.execSync("whoami");',
        'globalThis.pwned = true;',
        'const f = new Function("return process")();',
        'Object.prototype.polluted = true;',
        'function twoSum() { return ({}).__proto__.constructor("return process")(); }',
      ];

      for (const attack of maliciousCodes) {
        const security = validateVmCodeSecurity(attack);
        assert.strictEqual(security.safe, false, `Expected attack to be flagged as unsafe: ${attack}`);

        const result = await judgeCodeWarsSubmission('war_two_sum_01', attack, 'typescript');
        assert.strictEqual(result.ok, false);
        if (!result.ok) {
          assert.strictEqual(result.error, 'SECURITY_VIOLATION');
        }
      }
    });

    it('rejects empty, whitespace-only, or non-string submissions immediately', async () => {
      const invalidInputs = ['', '   \n\t  ', null as any, undefined as any, 12345 as any];

      for (const input of invalidInputs) {
        const result = await judgeCodeWarsSubmission('war_two_sum_01', input, 'typescript');
        assert.strictEqual(result.ok, false);
        if (!result.ok) {
          assert.strictEqual(result.error, 'CODE_REQUIRED');
        }
      }
    });

    it('handles synchronous infinite loops by terminating the worker thread within timeout', async () => {
      const infiniteLoopCode = `
        function twoSum(nums, target) {
          while (true) {}
          return [0, 1];
        }
      `;

      const start = Date.now();
      const result = await judgeCodeWarsSubmission('war_two_sum_01', infiniteLoopCode, 'typescript');
      const duration = Date.now() - start;

      assert.strictEqual(result.ok, true);
      if (result.ok) {
        assert.strictEqual(result.passed, false);
        assert.strictEqual(result.testsPassed, 0);
        assert.ok(result.error?.includes('timed out') || result.error?.includes('limit exceeded'));
      }
      // Guarantee that execution did not hang forever and terminated around the 2.5s threshold
      assert.ok(duration < 5000, `Execution took ${duration}ms, expected < 5000ms`);
    });
  });

  describe('Vector 2: Rapid-Fire Tactical Cooldown Stress Test', () => {
    it('blocks rapid-fire clicking (50 consecutive calls in 1ms) after initial trigger', () => {
      const now = Date.now();
      // First execution sets timestamp
      const initial = checkRunCooldown(undefined, now);
      assert.strictEqual(initial.allowed, true);

      // Simulate 50 rapid spam calls immediately following the initial execution
      for (let i = 0; i < 50; i++) {
        const spammed = checkRunCooldown(now, now);
        assert.strictEqual(spammed.allowed, false);
        assert.strictEqual(spammed.remainingCooldownMs, ARENA_RULES_CONFIG.RUN_COOLDOWN_MS);
        assert.strictEqual(spammed.remainingCooldownSeconds, 3);
      }
    });

    it('properly transitions allowed state from false to true as time increments', () => {
      const baseTime = Date.now();
      assert.strictEqual(checkRunCooldown(baseTime, baseTime + 500).allowed, false);
      assert.strictEqual(checkRunCooldown(baseTime, baseTime + 1500).allowed, false);
      assert.strictEqual(checkRunCooldown(baseTime, baseTime + 2999).allowed, false);
      assert.strictEqual(checkRunCooldown(baseTime, baseTime + 3000).allowed, true);
      assert.strictEqual(checkRunCooldown(baseTime, baseTime + 6000).allowed, true);
    });
  });

  describe('Vector 3: Extreme & Adversarial Score Input Hardening', () => {
    it('handles negative, zero, and out-of-bound score parameters gracefully', () => {
      const bizarreInputs = [
        { testsPassed: -10, totalTests: -5, timeRemainingSeconds: -100, timeLimitSeconds: -600, failedAttempts: 50 },
        { testsPassed: 9999, totalTests: 5, timeRemainingSeconds: 9999, timeLimitSeconds: 600, failedAttempts: 0 },
        { testsPassed: 0, totalTests: 0, timeRemainingSeconds: 0, timeLimitSeconds: 0, failedAttempts: 100 },
      ];

      for (const params of bizarreInputs) {
        const score = calculateBattleScore(params);
        assert.ok(score.totalScore >= 0, `Total score ${score.totalScore} must be >= 0`);
        assert.ok(score.totalScore <= ARENA_RULES_CONFIG.MAX_SCORE, `Total score ${score.totalScore} must be <= 1000`);
        assert.ok(!isNaN(score.totalScore), 'Score must never be NaN');
        assert.ok(!isNaN(score.testScore), 'Test score must never be NaN');
        assert.ok(!isNaN(score.timeScore), 'Time score must never be NaN');
      }
    });
  });

  describe('Vector 4: Stalemate, Tie-Breakers & Zero-Test Edge Cases', () => {
    it('resolves tie when both players fail all 0/5 tests without crashing', () => {
      const resolution = resolveMatchWinner({
        hostId: 'host_player',
        guestId: 'guest_player',
        hostStats: {
          testsPassed: 0,
          totalTests: 5,
          score: 0,
          submitted: true,
          submissionAttempts: 3,
          failedAttempts: 3,
          timeSpentSeconds: 600,
          timeRemainingSeconds: 0,
        },
        guestStats: {
          testsPassed: 0,
          totalTests: 5,
          score: 0,
          submitted: true,
          submissionAttempts: 2,
          failedAttempts: 2,
          timeSpentSeconds: 600,
          timeRemainingSeconds: 0,
        },
      });

      assert.strictEqual(resolution.winnerId, 'draw');
      assert.strictEqual(resolution.isDraw, true);
      assert.match(resolution.winReason, /Honorable Stalemate/i);
    });

    it('awards victory to higher tests passed even if loser was 100x faster', () => {
      const resolution = resolveMatchWinner({
        hostId: 'slow_accurate_player',
        guestId: 'blazing_fast_incomplete_player',
        hostStats: {
          testsPassed: 4,
          totalTests: 5,
          score: 650,
          submitted: true,
          submissionAttempts: 1,
          failedAttempts: 0,
          timeSpentSeconds: 580, // took almost full 10 mins
          timeRemainingSeconds: 20,
        },
        guestStats: {
          testsPassed: 2,
          totalTests: 5,
          score: 450,
          submitted: true,
          submissionAttempts: 1,
          failedAttempts: 0,
          timeSpentSeconds: 30, // submitted in 30 seconds
          timeRemainingSeconds: 570,
        },
      });

      // Accuracy always trumps speed when test count is asymmetric
      assert.strictEqual(resolution.winnerId, 'slow_accurate_player');
      assert.strictEqual(resolution.isDraw, false);
      assert.match(resolution.winReason, /Test Accuracy/i);
    });
  });

  describe('Vector 5: Cross-Language Head-to-Head Parity', () => {
    it('correctly evaluates Palindrome in TypeScript and Python with symmetric results', async () => {
      const tsValidPalindrome = `
        function isPalindrome(s: string): boolean {
          const cleaned = s.toLowerCase().replace(/[^a-z0-9]/g, '');
          return cleaned === cleaned.split('').reverse().join('');
        }
      `;

      const pyValidPalindrome = `
def is_palindrome(s: str) -> bool:
    cleaned = ''.join(c.lower() for c in s if c.isalnum())
    return cleaned == cleaned[::-1]
      `;

      const tsRes = await judgeCodeWarsSubmission('war_valid_palindrome_02', tsValidPalindrome, 'typescript');
      assert.strictEqual(tsRes.ok, true);
      if (tsRes.ok) {
        assert.strictEqual(tsRes.passed, true);
        assert.strictEqual(tsRes.testsPassed, 5);
      }

      const pyRes = await judgeCodeWarsSubmission('war_valid_palindrome_02', pyValidPalindrome, 'python');
      assert.strictEqual(pyRes.ok, true);
      if (pyRes.ok) {
        assert.strictEqual(pyRes.passed, true);
        assert.strictEqual(pyRes.testsPassed, 5);
      }
    });
  });

  describe('Vector 6: Empirical Knowledge Calibration Boundary Hardening', () => {
    it('handles complete zero/null profile without throwing NaN or undefined', () => {
      const zeroKnowledge = calculateStudentKnowledge({
        xpTotal: 0,
        arenaElo: 0,
        completedQuests: [],
        careerDnaScore: 0,
        missionsCompleted: 0,
      });

      assert.strictEqual(zeroKnowledge.tier, 'novice');
      assert.strictEqual(zeroKnowledge.recommendedDifficulty, 'basic');
      assert.ok(zeroKnowledge.score >= 0 && zeroKnowledge.score <= 30);
      assert.ok(!isNaN(zeroKnowledge.score));
    });

    it('clamps super-veteran student profile to maximum 100 Knowledge Score', () => {
      const titanKnowledge = calculateStudentKnowledge({
        xpTotal: 100000,
        arenaElo: 2800,
        completedQuests: Array.from({ length: 60 }, (_, i) => `quest_capstone_exam_day_${i + 1}`),
        careerDnaScore: 100,
        atsScore: 100,
        missionsCompleted: 50,
      });

      assert.strictEqual(titanKnowledge.tier, 'master');
      assert.strictEqual(titanKnowledge.recommendedDifficulty, 'advanced');
      assert.strictEqual(titanKnowledge.score, 100);
    });
  });

  describe('Vector 7: Rating Floor & Authoritative Settlement Invariants', () => {
    it('strictly defends the 1000 Elo rating floor against repeated catastrophic losses', () => {
      const match = calculateEloMatch({
        hostId: 'cadet_underdog',
        guestId: 'grandmaster',
        hostElo: 1000,
        guestElo: 2200,
        winnerId: 'grandmaster',
      });

      assert.strictEqual(match.hostCurrentElo, 1000);
      assert.strictEqual(match.hostNewElo, 1000, 'Cadet rating must never drop below 1000 floor');
    });

    it('settles room with Clean Execution and First Blood bonuses applied atomically', async () => {
      const testRoom: ArenaRoom = {
        id: 'room_audit_firstblood_clean',
        roomCode: 'AUDIT99',
        problemId: 'war_reverse_string_03',
        difficulty: 'basic',
        timeLimitSeconds: 600,
        status: 'completed',
        hostId: 'combatant_alpha',
        hostName: 'Alpha',
        hostReady: true,
        hostProgress: {
          testsPassed: 5,
          totalTests: 5,
          score: 980,
          submitted: true,
          code: 'function reverseWords() {}',
          submissionAttempts: 1,
          failedAttempts: 0,
        },
        guestId: 'combatant_beta',
        guestName: 'Beta',
        guestReady: true,
        guestProgress: {
          testsPassed: 4,
          totalTests: 5,
          score: 600,
          submitted: true,
          code: 'function reverseWords() {}',
          submissionAttempts: 2,
          failedAttempts: 1,
        },
        winnerId: 'combatant_alpha',
        firstBloodClaimedBy: 'combatant_alpha',
        cleanBonusAwardedTo: 'combatant_alpha',
        tieBreakerReason: 'First Blood! Conquered all test cases before opponent.',
        createdAt: Date.now(),
        startedAt: Date.now() - 90000,
        endedAt: Date.now(),
      };

      const settled = await ArenaPvPStore.settleMatch(testRoom);

      assert.strictEqual(settled.eloApplied, true);
      // Base Win XP (50) + First Blood (25) + Clean Submission (15) = 90 XP
      assert.strictEqual(settled.hostXpAward, 90);
      // Base Loss XP (15)
      assert.strictEqual(settled.guestXpAward, 15);
      // Winner receives positive Elo delta
      assert.ok((settled.hostEloDelta || 0) > 0);
    });
  });

  describe('Vector 8: Audio Synthesizer Headless / Node Resilience', () => {
    it('safely tolerates execution in headless/Node environment without window.AudioContext', () => {
      // In Node.js testing, window is undefined. None of the audio methods should throw.
      assert.doesNotThrow(() => {
        BattleAudio.playBattleStart();
        BattleAudio.playTestPassed(1);
        BattleAudio.playTestPassed(5);
        BattleAudio.playTestFailed();
        BattleAudio.playSurgePulse();
        BattleAudio.playFirstBlood();
        BattleAudio.playVictory();
        BattleAudio.playDefeat();
        BattleAudio.playCooldownWarning();
      });

      const initialMuted = BattleAudio.isMuted();
      BattleAudio.setMuted(true);
      assert.strictEqual(BattleAudio.isMuted(), true);
      BattleAudio.setMuted(false);
      assert.strictEqual(BattleAudio.isMuted(), false);
      BattleAudio.setMuted(initialMuted);
    });
  });
});
