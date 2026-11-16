import { describe, it, before, after } from 'node:test';
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
  const originalUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const originalServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  before(() => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://127.0.0.1:54321';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-key';
    const mockAdmin: any = {
      rpc: async () => ({
        data: {
          ok: true,
          host_elo_delta: 20,
          guest_elo_delta: -20,
          host_new_elo: 1220,
          guest_new_elo: 1180,
          host_arena_points_award: 250,
          guest_arena_points_award: 0,
        },
        error: null,
      }),
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

  after(() => {
    if (originalUrl === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    else process.env.NEXT_PUBLIC_SUPABASE_URL = originalUrl;
    if (originalServiceKey === undefined) delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    else process.env.SUPABASE_SERVICE_ROLE_KEY = originalServiceKey;
    setSupabaseAdminForTests(null);
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

      assert.strictEqual(res.hostArenaPointsAward, 50);
      assert.strictEqual(res.guestArenaPointsAward, 0);
      assert.strictEqual(res.hostPinsAward, 0);
      assert.strictEqual(res.guestPinsAward, 0);
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

      // ELO cannot be transferred below zero, so a 10-point balance loses only 10.
      assert.strictEqual(res.hostDelta, -10);
      assert.strictEqual(res.hostNewElo, 0);
    });

    it('uses the 100 ELO baseline when either stored rating is null', () => {
      const res = calculateEloMatch({
        hostId: 'new_host',
        guestId: 'new_guest',
        hostElo: null,
        guestElo: null,
        winnerId: 'new_host',
      });
      assert.equal(res.hostCurrentElo, 100);
      assert.equal(res.guestCurrentElo, 100);
      assert.equal(res.hostNewElo, 120);
      assert.equal(res.guestNewElo, 80);
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
      assert.strictEqual(res.hostArenaPointsAward, 0);
      assert.strictEqual(res.guestArenaPointsAward, 0);
      assert.strictEqual(res.hostPinsAward, 0);
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
      assert.strictEqual(settled.hostArenaPointsAward, 250);
      assert.strictEqual(settled.guestArenaPointsAward, 0);

      // Verify Idempotency: Second call does not re-settle or mutate
      const hostDelta1 = settled.hostEloDelta;
      const reSettled = await ArenaPvPStore.settleMatch(settled);
      assert.strictEqual(reSettled.hostEloDelta, hostDelta1);
      assert.strictEqual(reSettled.eloApplied, true);
    });
  });
});
