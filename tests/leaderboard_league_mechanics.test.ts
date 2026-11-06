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

test('Block 38: Weekly League Mechanics Promotion Cutoff (Top 10%)', () => {
  // Create 20 players in silver
  const players: LeaguePlayer[] = Array.from({ length: 20 }, (_, i) => ({
    id: `player_${i + 1}`,
    league_tier: 'silver',
    weekly_xp: (20 - i) * 100, // player_1 has 2000, player_20 has 100
    xp_total: (20 - i) * 1000,
  }));

  const moves = planWeeklyLeagueMoves(players);

  // Top 10% of 20 = 2 promotions
  const promotions = moves.filter((m) => m.outcome === 'promoted');
  assert.strictEqual(promotions.length, 2, 'Top 10% of 20 players must be promoted');
  assert.strictEqual(promotions[0].id, 'player_1');
  assert.strictEqual(promotions[0].from, 'silver');
  assert.strictEqual(promotions[0].to, 'gold');
  assert.strictEqual(promotions[1].id, 'player_2');

  // Bottom 10% of 20 = 2 demotions
  const demotions = moves.filter((m) => m.outcome === 'demoted');
  assert.strictEqual(demotions.length, 2, 'Bottom 10% of 20 players must be demoted');
  assert.strictEqual(demotions[0].id, 'player_19');
  assert.strictEqual(demotions[0].from, 'silver');
  assert.strictEqual(demotions[0].to, 'browns');
  assert.strictEqual(demotions[1].id, 'player_20');
});

test('Block 38: League Mechanics Edge Cases & Apex Tier Invariants', () => {
  // Ruby tier players cannot be promoted higher
  const rubyPlayers: LeaguePlayer[] = Array.from({ length: 15 }, (_, i) => ({
    id: `ruby_${i + 1}`,
    league_tier: 'ruby',
    weekly_xp: (15 - i) * 150,
    xp_total: 10000,
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
  }));

  const brownsMoves = planWeeklyLeagueMoves(brownsPlayers);
  const brownsDemotions = brownsMoves.filter((m) => m.outcome === 'demoted');
  assert.strictEqual(brownsDemotions.length, 0, 'Browns players cannot be demoted below browns');
});
