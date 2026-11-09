import { describe, it, before } from 'node:test';
import assert from 'node:assert';
import {
  calculateEloMatch,
  calculateExpectedScore,
  getKFactor,
  ELO_CONFIG,
} from '../src/lib/arena/eloEngine';
import { ArenaPvPStore, ArenaRoom } from '../src/lib/services/arenaPvPStore';
import { setSupabaseAdminForTests } from '../src/lib/server/supabaseAdmin';

describe('Authoritative Elo & XP Engine (Task 12)', () => {
  before(() => {
    // Provide in-memory mock admin so local test runs instantaneously without socket timeout
    const mockAdmin: any = {
      from: () => ({
        select: () => ({
          eq: () => ({
            maybeSingle: async () => ({
              data: { arena_elo: 1200, arena_wins: 2, arena_losses: 1, xp_total: 400, weekly_xp: 400, pins: 20 },
              error: null,
            }),
          }),
        }),
        update: () => ({
          eq: async () => ({ error: null }),
        }),
        insert: async () => ({ error: null }),
      }),
    };
    setSupabaseAdminForTests(mockAdmin);
  });

  describe('Mathematical Properties & K-Factor Curves', () => {
    it('applies K=32 for cadet ratings (< 1400)', () => {
      assert.strictEqual(getKFactor(1200), 32);
      assert.strictEqual(getKFactor(1399), 32);
    });

    it('applies K=24 for intermediate ratings (1400 - 1800)', () => {
      assert.strictEqual(getKFactor(1400), 24);
      assert.strictEqual(getKFactor(1600), 24);
      assert.strictEqual(getKFactor(1800), 24);
    });

    it('applies K=16 for master ratings (> 1800)', () => {
      assert.strictEqual(getKFactor(1801), 16);
      assert.strictEqual(getKFactor(2200), 16);
    });

    it('calculates 50% expected score for evenly matched combatants', () => {
      const expected = calculateExpectedScore(1200, 1200);
      assert.strictEqual(expected, 0.5);
    });

    it('calculates higher expected win rate for higher rated player', () => {
      const favoriteExp = calculateExpectedScore(1600, 1200);
      const underdogExp = calculateExpectedScore(1200, 1600);
      assert.ok(favoriteExp > 0.9);
      assert.ok(underdogExp < 0.1);
      assert.strictEqual(Math.round((favoriteExp + underdogExp) * 100) / 100, 1);
    });
  });

  describe('1v1 Match Resolution & Reward Allocations (Base 100, 20-Point Transfer)', () => {
    it('awards 20 elo from opponent to winner making 100 vs 100 become 120 vs 80', () => {
      const res = calculateEloMatch({
        hostId: 'player_host_01',
        guestId: 'player_guest_01',
        hostElo: 100,
        guestElo: 100,
        winnerId: 'player_host_01',
      });

      assert.strictEqual(res.hostDelta, 20); // Winner receives +20 from opponent
      assert.strictEqual(res.guestDelta, -20); // Opponent loses -20
      assert.strictEqual(res.hostNewElo, 120);
      assert.strictEqual(res.guestNewElo, 80);

      // Verify Effort Rewards
      assert.strictEqual(res.hostXpAward, ELO_CONFIG.WIN_XP); // 50 XP
      assert.strictEqual(res.guestXpAward, ELO_CONFIG.LOSS_XP); // 15 XP
      assert.strictEqual(res.hostPinsAward, ELO_CONFIG.WIN_PINS); // 20 Pins
      assert.strictEqual(res.guestPinsAward, ELO_CONFIG.LOSS_PINS); // 5 Pins
    });

    it('awards 20 elo when guest defeats host', () => {
      const res = calculateEloMatch({
        hostId: 'host_player',
        guestId: 'guest_player',
        hostElo: 120,
        guestElo: 80,
        winnerId: 'guest_player',
      });

      assert.strictEqual(res.guestDelta, 20);
      assert.strictEqual(res.hostDelta, -20);
      assert.strictEqual(res.guestNewElo, 100);
      assert.strictEqual(res.hostNewElo, 100);
    });

    it('respects Elo floor of 0 so students never drop below floor', () => {
      const res = calculateEloMatch({
        hostId: 'struggling_player',
        guestId: 'strong_player',
        hostElo: 10,
        guestElo: 100,
        winnerId: 'strong_player',
      });

      // 10 - 20 = -10 -> strictly floored at 0
      assert.strictEqual(res.hostDelta, -20);
      assert.strictEqual(res.hostNewElo, 0);
    });

    it('handles draw results accurately', () => {
      const res = calculateEloMatch({
        hostId: 'p1',
        guestId: 'p2',
        hostElo: 100,
        guestElo: 100,
        winnerId: 'draw',
      });

      assert.strictEqual(res.hostDelta, 0);
      assert.strictEqual(res.guestDelta, 0);
      assert.strictEqual(res.hostNewElo, 100);
      assert.strictEqual(res.guestNewElo, 100);
      assert.strictEqual(res.hostXpAward, ELO_CONFIG.DRAW_XP); // 25 XP
      assert.strictEqual(res.guestXpAward, ELO_CONFIG.DRAW_XP);
      assert.strictEqual(res.hostPinsAward, ELO_CONFIG.DRAW_PINS); // 10 Pins
    });
  });

  describe('ArenaPvPStore Idempotent Settlement', () => {
    it('settles a completed room and marks eloApplied as true', async () => {
      const testRoom: ArenaRoom = {
        id: 'test-room-uuid',
        roomCode: 'ARENA-TEST01',
        problemId: 'two-sum',
        difficulty: 'intermediate',
        timeLimitSeconds: 600,
        status: 'completed',
        hostId: 'host_student_123',
        hostName: 'Alice Developer',
        hostReady: true,
        hostProgress: { testsPassed: 5, totalTests: 5, score: 100, submitted: true, code: 'return []' },
        guestId: 'guest_student_456',
        guestName: 'Bob Coder',
        guestReady: true,
        guestProgress: { testsPassed: 3, totalTests: 5, score: 60, submitted: true, code: 'return []' },
        winnerId: 'host_student_123',
        createdAt: Date.now(),
      };

      const settled = await ArenaPvPStore.settleMatch(testRoom);
      assert.strictEqual(settled.eloApplied, true);
      assert.ok(typeof settled.hostEloDelta === 'number');
      assert.ok(typeof settled.guestEloDelta === 'number');
      assert.strictEqual(settled.hostXpAward, 50);
      assert.strictEqual(settled.guestXpAward, 15);

      // Verify Idempotency: Second call does not re-settle or mutate
      const hostDelta1 = settled.hostEloDelta;
      const reSettled = await ArenaPvPStore.settleMatch(settled);
      assert.strictEqual(reSettled.hostEloDelta, hostDelta1);
      assert.strictEqual(reSettled.eloApplied, true);
    });
  });
});
