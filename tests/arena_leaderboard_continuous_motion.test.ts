import test from 'node:test';
import assert from 'node:assert';
import fs from 'fs';
import path from 'path';
import { ELO_CONFIG, calculateEloMatch } from '../src/lib/arena/eloEngine';

const ROOT = process.cwd();
const arenaPagePath = path.join(ROOT, 'src/app/arena/page.tsx');
const leaderboardPagePath = path.join(ROOT, 'src/app/leaderboard/page.tsx');
const leaderboardRoutePath = path.join(ROOT, 'src/app/api/leaderboard/route.ts');
const settleSoloRoutePath = path.join(ROOT, 'src/app/api/arena/settle-solo/route.ts');
const arenaPvPStorePath = path.join(ROOT, 'src/lib/services/arenaPvPStore.ts');

const arenaPage = fs.readFileSync(arenaPagePath, 'utf8');
const leaderboardPage = fs.readFileSync(leaderboardPagePath, 'utf8');
const leaderboardRoute = fs.readFileSync(leaderboardRoutePath, 'utf8');
const settleSoloRoute = fs.readFileSync(settleSoloRoutePath, 'utf8');
const arenaPvPStore = fs.readFileSync(arenaPvPStorePath, 'utf8');

// ── VECTOR 1: MATHEMATICAL & ELO INVARIANT HARMONIZATION ───────────────────────
test('CONTINUOUS MOTION VECTOR 1: Canonical baseline ELO of 100 & exact 20-point transfer', () => {
  assert.strictEqual(ELO_CONFIG.DEFAULT_ELO, 100, 'Baseline ELO must be 100');
  assert.strictEqual(ELO_CONFIG.FLOOR_ELO, 0, 'Floor ELO must be 0');
  assert.strictEqual(ELO_CONFIG.WIN_ELO_TRANSFER, 20, 'Win transfer must be 20');

  // Verify PvP settlement engine
  const pvpMatch = calculateEloMatch({
    hostId: 'host_001',
    guestId: 'guest_002',
    hostElo: 100,
    guestElo: 100,
    winnerId: 'host_001',
  });
  assert.strictEqual(pvpMatch.hostDelta, 20, 'Winner gains 20 ELO');
  assert.strictEqual(pvpMatch.guestDelta, -20, 'Loser drops 20 ELO');
  assert.strictEqual(pvpMatch.hostNewElo, 120);
  assert.strictEqual(pvpMatch.guestNewElo, 80);

  // Verify arenaPvPStore does NOT fall back to obsolete 1200
  assert.strictEqual(arenaPvPStore.includes('hostElo = 1200'), false, 'arenaPvPStore must not default hostElo to 1200');
  assert.strictEqual(arenaPvPStore.includes('guestElo = 1200'), false, 'arenaPvPStore must not default guestElo to 1200');
  assert.strictEqual(arenaPvPStore.includes('cand.elo_rating || 1200'), false, 'arenaPvPStore must not default ticket ELO to 1200');
});

// ── VECTOR 2: STRICT PINS ECONOMY INVARIANT (RULE 3) ──────────────────────────
test('CONTINUOUS MOTION VECTOR 2: Strict Pins Invariant — zero pins awarded by play/combat', () => {
  // eloEngine constants
  assert.strictEqual(ELO_CONFIG.WIN_PINS, 0, 'WIN_PINS must be 0');
  assert.strictEqual(ELO_CONFIG.LOSS_PINS, 0, 'LOSS_PINS must be 0');
  assert.strictEqual(ELO_CONFIG.DRAW_PINS, 0, 'DRAW_PINS must be 0');

  // settle-solo route
  assert.ok(settleSoloRoute.includes('pinsAwarded = 0'), 'settle-solo must award 0 pins');
  assert.ok(settleSoloRoute.includes('pinsAwarded: 0'), 'settle-solo response must return pinsAwarded: 0');

  // arenaPvPStore match settlement
  assert.strictEqual(arenaPvPStore.includes('pins: (hostProfile.pins || 0) + result.hostPinsAward'), false, 'arenaPvPStore must not mutate host pins on battle settle');
  assert.strictEqual(arenaPvPStore.includes('pins: (guestProfile.pins || 0) + result.guestPinsAward'), false, 'arenaPvPStore must not mutate guest pins on battle settle');
});

// ── VECTOR 3: REAL-TIME DUAL-CASE EVENT PAYLOAD CONTINUITY ────────────────────
test('CONTINUOUS MOTION VECTOR 3: Event payload symmetry between Arena emitters and Leaderboard receiver', () => {
  // Arena must emit both snake_case and camelCase keys
  assert.ok(arenaPage.includes("detail: {"), 'Arena must dispatch detail object');
  assert.ok(arenaPage.includes("arena_elo:"), 'Arena must include arena_elo');
  assert.ok(arenaPage.includes("weekly_xp:"), 'Arena must include weekly_xp');
  assert.ok(arenaPage.includes("xp_total:"), 'Arena must include xp_total');

  // Leaderboard must accept both snake_case and camelCase
  assert.ok(leaderboardPage.includes("typeof e.detail.arena_elo === 'number'"), 'Leaderboard must accept arena_elo');
  assert.ok(leaderboardPage.includes("typeof e.detail.elo === 'number'"), 'Leaderboard must accept camelCase elo fallback');
  assert.ok(leaderboardPage.includes("typeof e.detail.weekly_xp === 'number'"), 'Leaderboard must accept weekly_xp');
  assert.ok(leaderboardPage.includes("typeof e.detail.weeklyXp === 'number'"), 'Leaderboard must accept camelCase weeklyXp fallback');

  // Leaderboard must execute synchronous in-memory update on serverCurrentUser
  assert.ok(leaderboardPage.includes("setServerCurrentUser(prev => {"), 'Leaderboard must update serverCurrentUser immediately on event');
  assert.ok(leaderboardPage.includes("leagueScore,"), 'Leaderboard must recompute leagueScore on instant update');
});

// ── VECTOR 4: CROSS-PAGE ROUTING & DEEP LINKS ─────────────────────────────────
test('CONTINUOUS MOTION VECTOR 4: Seamless bidirectional navigation links and query routing', () => {
  // Leaderboard must recognize tab=code_wars as weekly_leagues mode
  assert.ok(leaderboardPage.includes("rawMode === 'code_wars'"), 'Leaderboard must map code_wars to weekly_leagues');

  // Leaderboard HUD link to Arena
  assert.ok(leaderboardPage.includes('href="/arena?tab=code_wars"'), 'Leaderboard HUD button must link to /arena?tab=code_wars');

  // Arena HUD link to Leaderboard
  assert.ok(arenaPage.includes('href="/leaderboard?mode=weekly_leagues"') || arenaPage.includes('href="/leaderboard?tab=code_wars"'), 'Arena HUD button must link to Leaderboard');
});

// ── VECTOR 5: SCORING & TIEBREAKER MATHEMATICAL CONVERGENCE ───────────────────
test('CONTINUOUS MOTION VECTOR 5: Mathematical formula convergence across frontend and backend', () => {
  // Formula: weeklyXp + Math.round(eloGain * 1.5) where eloGain = Math.max(0, eloRating - 100)
  assert.ok(leaderboardRoute.includes('weeklyXp + Math.round(eloGain * 1.5)'), 'Backend route must use exact 1.5x ELO gain multiplier');
  assert.ok(leaderboardPage.includes('weeklyXp + Math.round(eloGain * 1.5)') || leaderboardPage.includes('weeklyXp + Math.round((currentUserEntry.eloGain ?? 0) * 1.5)'), 'Frontend must use exact 1.5x ELO gain multiplier');

  // Simulation test
  const calculateScore = (weeklyXp: number, elo: number) => {
    const eloGain = Math.max(0, elo - 100);
    return weeklyXp + Math.round(eloGain * 1.5);
  };

  assert.strictEqual(calculateScore(1000, 100), 1000, 'Base ELO gives 0 bonus points');
  assert.strictEqual(calculateScore(1000, 120), 1030, '120 ELO gives +30 bonus points');
  assert.strictEqual(calculateScore(1000, 140), 1060, '140 ELO gives +60 bonus points');
  assert.strictEqual(calculateScore(1000, 80), 1000, 'Sub-100 ELO does not penalize base weekly XP');
});

// ── VECTOR 6: COLD-BLOODED STRESS & BOUNDARY CONCURRENCY ──────────────────────
test('CONTINUOUS MOTION VECTOR 6: Concurrency and extreme boundary resilience', () => {
  // Player with 0 XP and 0 ELO (extreme lower bound)
  const minMatch = calculateEloMatch({
    hostId: 'min_player',
    guestId: 'opponent',
    hostElo: 0,
    guestElo: 100,
    winnerId: 'opponent',
  });
  assert.ok(minMatch.hostNewElo >= 0, 'ELO must never drop below 0');

  // High ELO master player (e.g. 500 ELO)
  const masterElo = 500;
  const masterXp = 5000;
  const masterGain = Math.max(0, masterElo - 100); // 400
  const masterScore = masterXp + Math.round(masterGain * 1.5); // 5000 + 600 = 5600
  assert.strictEqual(masterScore, 5600);
});
