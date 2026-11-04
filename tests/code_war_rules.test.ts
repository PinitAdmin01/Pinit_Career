import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import {
  ARENA_RULES_CONFIG,
  checkRunCooldown,
  calculateBattleScore,
  resolveMatchWinner,
  createCombatEvent,
} from '../src/lib/arena/codeWarRules';
import { ArenaPvPStore, ArenaRoom } from '../src/lib/services/arenaPvPStore';
import { setSupabaseAdminForTests } from '../src/lib/server/supabaseAdmin';

describe('Task 15: Code War Arena Rules & Dynamic Competitive Mechanics', () => {
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
            data: { arena_elo: 1200, arena_wins: 3, arena_losses: 1, xp_total: 500, weekly_xp: 500, pins: 25 },
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

  describe('Rule 1: Blitz Speed & First Blood Mechanics', () => {
    it('resolves match immediately with First Blood when a combatant clears all test cases first', () => {
      const resolution = resolveMatchWinner({
        hostId: 'student_host_1',
        guestId: 'student_guest_2',
        hostStats: {
          testsPassed: 5,
          totalTests: 5,
          score: 850,
          submitted: true,
          submissionAttempts: 1,
          failedAttempts: 0,
          timeSpentSeconds: 120,
          timeRemainingSeconds: 480,
        },
        guestStats: {
          testsPassed: 5,
          totalTests: 5,
          score: 800,
          submitted: true,
          submissionAttempts: 2,
          failedAttempts: 1,
          timeSpentSeconds: 180,
          timeRemainingSeconds: 420,
        },
        firstBloodClaimedBy: 'student_host_1',
      });

      assert.strictEqual(resolution.winnerId, 'student_host_1');
      assert.strictEqual(resolution.isDraw, false);
      assert.match(resolution.winReason, /First Blood/i);
    });

    it('awards victory to guest when guest claims First Blood', () => {
      const resolution = resolveMatchWinner({
        hostId: 'student_host_1',
        guestId: 'student_guest_2',
        hostStats: {
          testsPassed: 5,
          totalTests: 5,
          score: 820,
          submitted: true,
          submissionAttempts: 2,
          failedAttempts: 1,
          timeSpentSeconds: 210,
          timeRemainingSeconds: 390,
        },
        guestStats: {
          testsPassed: 5,
          totalTests: 5,
          score: 890,
          submitted: true,
          submissionAttempts: 1,
          failedAttempts: 0,
          timeSpentSeconds: 140,
          timeRemainingSeconds: 460,
        },
        firstBloodClaimedBy: 'student_guest_2',
      });

      assert.strictEqual(resolution.winnerId, 'student_guest_2');
      assert.strictEqual(resolution.isDraw, false);
      assert.match(resolution.winReason, /First Blood/i);
    });
  });

  describe('Rule 2: Anti-Spam Tactical Cooldown', () => {
    it('allows initial execution when no prior run timestamp exists', () => {
      const cooldown = checkRunCooldown(undefined);
      assert.strictEqual(cooldown.allowed, true);
      assert.strictEqual(cooldown.remainingCooldownMs, 0);
      assert.strictEqual(cooldown.remainingCooldownSeconds, 0);
    });

    it('blocks rapid execution within 3000ms cooldown window and returns remaining seconds', () => {
      const now = Date.now();
      const lastRun = now - 1200; // 1.2s ago
      const cooldown = checkRunCooldown(lastRun, now);

      assert.strictEqual(cooldown.allowed, false);
      assert.strictEqual(cooldown.remainingCooldownMs, 1800);
      assert.strictEqual(cooldown.remainingCooldownSeconds, 2);
    });

    it('allows execution once 3000ms cooldown window has fully elapsed', () => {
      const now = Date.now();
      const lastRun = now - 3500; // 3.5s ago
      const cooldown = checkRunCooldown(lastRun, now);

      assert.strictEqual(cooldown.allowed, true);
      assert.strictEqual(cooldown.remainingCooldownMs, 0);
      assert.strictEqual(cooldown.remainingCooldownSeconds, 0);
    });
  });

  describe('Rule 3: Clean Execution vs Submission Penalties', () => {
    it('awards full 100 clean bonus when passed with 0 failed submission attempts', () => {
      const score = calculateBattleScore({
        testsPassed: 5,
        totalTests: 5,
        timeRemainingSeconds: 300,
        timeLimitSeconds: 600,
        submissionAttempts: 1,
        failedAttempts: 0,
      });

      assert.strictEqual(score.testsPassed, 5);
      assert.strictEqual(score.cleanBonus, ARENA_RULES_CONFIG.CLEAN_CODE_SCORE_BONUS);
      assert.strictEqual(score.penalties, 0);
      assert.ok(score.totalScore > 800, `Expected high score > 800, got ${score.totalScore}`);
    });

    it('deducts 30 points per failed submission attempt and halves clean bonus on 1 failure', () => {
      const score = calculateBattleScore({
        testsPassed: 5,
        totalTests: 5,
        timeRemainingSeconds: 300,
        timeLimitSeconds: 600,
        submissionAttempts: 2,
        failedAttempts: 1,
      });

      assert.strictEqual(score.cleanBonus, 50); // Halved from 100
      assert.strictEqual(score.penalties, 30);  // 1 * 30
    });

    it('nullifies clean bonus and applies multiple deductions on repeated failed attempts', () => {
      const score = calculateBattleScore({
        testsPassed: 3,
        totalTests: 5,
        timeRemainingSeconds: 150,
        timeLimitSeconds: 600,
        submissionAttempts: 4,
        failedAttempts: 3,
      });

      assert.strictEqual(score.cleanBonus, 0);
      assert.strictEqual(score.penalties, 90); // 3 * 30
      assert.ok(score.totalScore >= 0, 'Score must not drop below 0');
    });
  });

  describe('Rule 4: Pressure Surge Protocol (<90s)', () => {
    it('applies 15% Clutch Point Multiplier to test score during final 90 seconds', () => {
      const standardScore = calculateBattleScore({
        testsPassed: 5,
        totalTests: 5,
        timeRemainingSeconds: 120, // Outside surge
        timeLimitSeconds: 600,
        failedAttempts: 0,
        isSurgeActive: false,
      });

      const surgeScore = calculateBattleScore({
        testsPassed: 5,
        totalTests: 5,
        timeRemainingSeconds: 45, // Inside surge (<90s)
        timeLimitSeconds: 600,
        failedAttempts: 0,
        isSurgeActive: true,
      });

      assert.strictEqual(surgeScore.isSurgeActive, true);
      assert.strictEqual(standardScore.testScore, 700);
      assert.strictEqual(surgeScore.testScore, 805); // 700 * 1.15 = 805
    });
  });

  describe('Rule 5: Deterministic Tie-Breaker Protocol', () => {
    it('tie-breaks by higher test completion count when neither cleared all', () => {
      const resolution = resolveMatchWinner({
        hostId: 'host_alpha',
        guestId: 'guest_beta',
        hostStats: {
          testsPassed: 4,
          totalTests: 5,
          score: 650,
          submitted: true,
          submissionAttempts: 1,
          failedAttempts: 0,
          timeSpentSeconds: 300,
          timeRemainingSeconds: 300,
        },
        guestStats: {
          testsPassed: 3,
          totalTests: 5,
          score: 550,
          submitted: true,
          submissionAttempts: 1,
          failedAttempts: 0,
          timeSpentSeconds: 250,
          timeRemainingSeconds: 350,
        },
      });

      assert.strictEqual(resolution.winnerId, 'host_alpha');
      assert.strictEqual(resolution.isDraw, false);
      assert.match(resolution.winReason, /Test Accuracy/i);
    });

    it('tie-breaks by Battle Score when test counts are equal', () => {
      const resolution = resolveMatchWinner({
        hostId: 'host_alpha',
        guestId: 'guest_beta',
        hostStats: {
          testsPassed: 3,
          totalTests: 5,
          score: 580, // Higher score due to faster time
          submitted: true,
          submissionAttempts: 1,
          failedAttempts: 0,
          timeSpentSeconds: 200,
          timeRemainingSeconds: 400,
        },
        guestStats: {
          testsPassed: 3,
          totalTests: 5,
          score: 490, // Lower score due to slower time and penalty
          submitted: true,
          submissionAttempts: 2,
          failedAttempts: 1,
          timeSpentSeconds: 380,
          timeRemainingSeconds: 220,
        },
      });

      assert.strictEqual(resolution.winnerId, 'host_alpha');
      assert.strictEqual(resolution.isDraw, false);
      assert.match(resolution.winReason, /Efficiency Tie-Break/i);
    });

    it('declares an honorable draw when all metrics are strictly identical', () => {
      const resolution = resolveMatchWinner({
        hostId: 'host_alpha',
        guestId: 'guest_beta',
        hostStats: {
          testsPassed: 3,
          totalTests: 5,
          score: 500,
          submitted: true,
          submissionAttempts: 1,
          failedAttempts: 0,
          timeSpentSeconds: 300,
          timeRemainingSeconds: 300,
        },
        guestStats: {
          testsPassed: 3,
          totalTests: 5,
          score: 500,
          submitted: true,
          submissionAttempts: 1,
          failedAttempts: 0,
          timeSpentSeconds: 300,
          timeRemainingSeconds: 300,
        },
      });

      assert.strictEqual(resolution.winnerId, 'draw');
      assert.strictEqual(resolution.isDraw, true);
      assert.match(resolution.winReason, /Honorable Stalemate/i);
    });
  });

  describe('Rule 6: Live Combat Telemetry Events', () => {
    it('creates urgent First Blood combat event with bonus badges', () => {
      const evt = createCombatEvent('first_blood', {
        actorName: 'Vinay',
        actorId: 'usr_vinay',
        testTotal: 5,
      });

      assert.strictEqual(evt.type, 'first_blood');
      assert.strictEqual(evt.severity, 'urgent');
      assert.strictEqual(evt.badge, '+25 XP / +5 Elo');
      assert.match(evt.title, /FIRST BLOOD/i);
    });

    it('creates passing streak combat events', () => {
      const evt = createCombatEvent('streak', {
        actorName: 'Priya',
        actorId: 'usr_priya',
        streakCount: 3,
      });

      assert.strictEqual(evt.type, 'streak');
      assert.strictEqual(evt.severity, 'success');
      assert.match(evt.title, /3X PASSING STREAK/i);
    });
  });

  describe('Rule 7: Authoritative Store Settlement with Rule Bonuses', () => {
    it('settles match and applies First Blood and Clean Submission bonuses to winner', async () => {
      const testRoom: ArenaRoom = {
        id: 'room_rules_101',
        roomCode: 'RULES7',
        problemId: 'war_two_sum_01',
        difficulty: 'basic',
        timeLimitSeconds: 600,
        status: 'completed',
        hostId: 'host_champion',
        hostName: 'Champion',
        hostReady: true,
        hostProgress: {
          testsPassed: 5,
          totalTests: 5,
          score: 950,
          submitted: true,
          code: 'function twoSum() {}',
          submissionAttempts: 1,
          failedAttempts: 0,
        },
        guestId: 'guest_challenger',
        guestName: 'Challenger',
        guestReady: true,
        guestProgress: {
          testsPassed: 3,
          totalTests: 5,
          score: 500,
          submitted: true,
          code: 'function twoSum() {}',
          submissionAttempts: 2,
          failedAttempts: 1,
        },
        winnerId: 'host_champion',
        firstBloodClaimedBy: 'host_champion',
        cleanBonusAwardedTo: 'host_champion',
        tieBreakerReason: 'First Blood! Conquered all test cases before opponent.',
        createdAt: Date.now(),
        startedAt: Date.now() - 150000,
        endedAt: Date.now(),
      };

      const settled = await ArenaPvPStore.settleMatch(testRoom);

      assert.strictEqual(settled.eloApplied, true);
      // Winner base XP (50) + First Blood (25) + Clean Submission (15) = 90 XP
      assert.strictEqual(settled.hostXpAward, 90);
      // Winner base Elo delta (>0) + First Blood (5)
      assert.ok((settled.hostEloDelta || 0) >= 20, `Expected hostEloDelta >= 20, got ${settled.hostEloDelta}`);
    });
  });
});
