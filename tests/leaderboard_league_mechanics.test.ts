import test from 'node:test';
import assert from 'node:assert/strict';
import {
  LEAGUE_TIERS,
  LeaguePlayer,
  planWeeklyLeagueMoves,
} from '../src/lib/leagues/weeklyLeague';

test('Block 38: League Tier Progression Hierarchy & Canonical Order', () => {
  assert.deepStrictEqual(
    LEAGUE_TIERS,
    ['browns', 'silver', 'gold', 'platinum', 'ruby'],
    'League tiers must follow canonical ascending prestige order'
  );
});

test('Block 38: Weekly League Mechanics Promotion Cutoff (Top 25%, rounded up)', () => {
  // Create 20 players in silver
  const players: LeaguePlayer[] = Array.from({ length: 20 }, (_, i) => ({
    id: `player_${i + 1}`,
    league_tier: 'silver',
    weekly_xp: (20 - i) * 100, // player_1 has 2000, player_20 has 100
    xp_total: (20 - i) * 1000,
    league_joined_at: '2026-11-01T00:00:00Z',
  }));

  const moves = planWeeklyLeagueMoves(players);

  // Top 25% of 20 = 5 promotions
  const promotions = moves.filter((m) => m.outcome === 'promoted');
  assert.strictEqual(promotions.length, 5, 'Top 25% of 20 players must be promoted');
  assert.strictEqual(promotions[0].id, 'player_1');
  assert.strictEqual(promotions[0].from, 'silver');
  assert.strictEqual(promotions[0].to, 'gold');
  assert.strictEqual(promotions[1].id, 'player_2');
  assert.strictEqual(promotions[4].id, 'player_5');

  // Bottom 10% of 20 = 2 demotions
  const demotions = moves.filter((m) => m.outcome === 'demoted');
  assert.strictEqual(demotions.length, 2, 'Bottom 10% of 20 players must be demoted');
  assert.strictEqual(demotions[0].id, 'player_19');
  assert.strictEqual(demotions[0].from, 'silver');
  assert.strictEqual(demotions[0].to, 'browns');
  assert.strictEqual(demotions[1].id, 'player_20');
});

test('the 25% cutoff rounds up so second place in a six-member league is promoted', () => {
  const players: LeaguePlayer[] = Array.from({ length: 6 }, (_, i) => ({
    id: `six_${i + 1}`,
    league_tier: 'browns',
    weekly_xp: 600 - i * 100,
    xp_total: 1000,
    league_joined_at: '2026-11-01T00:00:00Z',
  }));

  const promotions = planWeeklyLeagueMoves(players).filter(move => move.outcome === 'promoted');
  assert.deepStrictEqual(promotions.map(move => move.id), ['six_1', 'six_2']);
});

test('Block 38: League Mechanics Edge Cases & Apex Tier Invariants', () => {
  // Ruby tier players cannot be promoted higher
  const rubyPlayers: LeaguePlayer[] = Array.from({ length: 15 }, (_, i) => ({
    id: `ruby_${i + 1}`,
    league_tier: 'ruby',
    weekly_xp: (15 - i) * 150,
    xp_total: 10000,
    league_joined_at: '2026-11-01T00:00:00Z',
  }));

  const rubyMoves = planWeeklyLeagueMoves(rubyPlayers);
  const rubyPromotions = rubyMoves.filter((m) => m.outcome === 'promoted');
  assert.strictEqual(rubyPromotions.length, 0, 'Ruby players cannot be promoted above ruby');

  // Browns tier players cannot be demoted lower
  const brownsPlayers: LeaguePlayer[] = Array.from({ length: 15 }, (_, i) => ({
    id: `browns_${i + 1}`,
    league_tier: 'browns',
    weekly_xp: (15 - i) * 50,
    xp_total: 1000,
    league_joined_at: '2026-11-01T00:00:00Z',
  }));

  const brownsMoves = planWeeklyLeagueMoves(brownsPlayers);
  const brownsDemotions = brownsMoves.filter((m) => m.outcome === 'demoted');
  assert.strictEqual(brownsDemotions.length, 0, 'Browns players cannot be demoted below browns');
});

test('weekly movement preview normalizes stored tier casing like the SQL reset function', () => {
  const players: LeaguePlayer[] = [
    { id: 'upper-case-first', league_tier: 'SILVER', weekly_xp: 200, xp_total: 1000, league_joined_at: '2026-11-01T00:00:00Z' },
    { id: 'title-case-second', league_tier: 'Silver', weekly_xp: 100, xp_total: 500, league_joined_at: '2026-11-01T00:00:00Z' },
  ];

  const moves = planWeeklyLeagueMoves(players);
  assert.deepStrictEqual(moves.map(move => ({ id: move.id, from: move.from, to: move.to })), [
    { id: 'upper-case-first', from: 'silver', to: 'gold' },
  ]);
});

test('weekly movement preview excludes players without persisted membership or 100 lifetime XP', () => {
  const players: LeaguePlayer[] = [
    { id: 'joined', league_tier: 'silver', weekly_xp: 500, xp_total: 100, league_joined_at: '2026-11-01T00:00:00Z' },
    { id: 'not-joined', league_tier: 'silver', weekly_xp: 1000, xp_total: 1000 },
    { id: 'null-membership', league_tier: 'silver', weekly_xp: 900, xp_total: 1000, league_joined_at: null },
    { id: 'under-qualified', league_tier: 'silver', weekly_xp: 800, xp_total: 99, league_joined_at: '2026-11-01T00:00:00Z' },
  ];

  assert.deepStrictEqual(planWeeklyLeagueMoves(players), []);
});
