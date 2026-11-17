import test from 'node:test';
import assert from 'node:assert';
import fs from 'fs';
import path from 'path';
import { ELO_CONFIG, calculateEloMatch } from '../src/lib/arena/eloEngine';
import { arenaPointsForResult, calculateLeaguePoints } from '../src/lib/leagues/leaguePoints';

const ROOT = process.cwd();
const arenaPagePath = path.join(ROOT, 'src/app/arena/page.tsx');
const leaderboardPagePath = path.join(ROOT, 'src/app/leaderboard/page.tsx');
const competitionStylesPath = path.join(ROOT, 'src/app/competition-experience.module.css');
const leaderboardRoutePath = path.join(ROOT, 'src/app/api/leaderboard/route.ts');
const settleSoloRoutePath = path.join(ROOT, 'src/app/api/arena/settle-solo/route.ts');
const arenaPvPStorePath = path.join(ROOT, 'src/lib/services/arenaPvPStore.ts');
const competitionNavigationPath = path.join(ROOT, 'src/components/competition/CompetitionNavigation.tsx');

const arenaPage = fs.readFileSync(arenaPagePath, 'utf8');
const leaderboardPage = fs.readFileSync(leaderboardPagePath, 'utf8');
const competitionStyles = fs.readFileSync(competitionStylesPath, 'utf8');
const leaderboardRoute = fs.readFileSync(leaderboardRoutePath, 'utf8');
const settleSoloRoute = fs.readFileSync(settleSoloRoutePath, 'utf8');
const arenaPvPStore = fs.readFileSync(arenaPvPStorePath, 'utf8');
const competitionNavigation = fs.readFileSync(competitionNavigationPath, 'utf8');

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
  assert.ok(settleSoloRoute.includes('pinsAwarded: 0'), 'settle-solo response must return pinsAwarded: 0');
  assert.ok(fs.readFileSync(path.join(ROOT, 'supabase/migrations/20261116010000_league_points_and_join_state.sql'), 'utf8').includes("'pinsAwarded', 0"), 'Atomic solo settlement must persist a zero-Pin award');

  // arenaPvPStore match settlement
  assert.strictEqual(arenaPvPStore.includes('pins: (hostProfile.pins || 0) + result.hostPinsAward'), false, 'arenaPvPStore must not mutate host pins on battle settle');
  assert.strictEqual(arenaPvPStore.includes('pins: (guestProfile.pins || 0) + result.guestPinsAward'), false, 'arenaPvPStore must not mutate guest pins on battle settle');
});

// ── VECTOR 3: REAL-TIME DUAL-CASE EVENT PAYLOAD CONTINUITY ────────────────────
test('CONTINUOUS MOTION VECTOR 3: Event payload symmetry between Arena emitters and Leaderboard receiver', () => {
  // Arena must emit both snake_case and camelCase keys
  assert.ok(arenaPage.includes("detail: {"), 'Arena must dispatch detail object');
  assert.ok(arenaPage.includes("arena_elo:"), 'Arena must include arena_elo');
  assert.ok(arenaPage.includes("weekly_arena_points:"), 'Arena must include the new sprint Arena Points total');

  // Leaderboard must accept both snake_case and camelCase
  assert.ok(leaderboardPage.includes("typeof e.detail.arena_elo === 'number'"), 'Leaderboard must accept arena_elo');
  assert.ok(leaderboardPage.includes("typeof e.detail.elo === 'number'"), 'Leaderboard must accept camelCase elo fallback');
  assert.ok(leaderboardPage.includes("typeof e.detail.weekly_arena_points === 'number'"), 'Leaderboard must accept weekly_arena_points');
  assert.ok(leaderboardPage.includes("typeof e.detail.arenaPoints === 'number'"), 'Leaderboard must accept camelCase Arena Points fallback');

  // Leaderboard must execute synchronous in-memory update on serverCurrentUser
  assert.ok(leaderboardPage.includes("setServerCurrentUser(prev => {"), 'Leaderboard must update serverCurrentUser immediately on event');
  assert.ok(leaderboardPage.includes('leaguePoints: weeklyXp + arenaPoints'), 'Leaderboard must recompute the combined League Points immediately');
});

// ── VECTOR 4: CROSS-PAGE ROUTING & DEEP LINKS ─────────────────────────────────
test('CONTINUOUS MOTION VECTOR 4: Seamless bidirectional navigation links and query routing', () => {
  assert.ok(competitionNavigation.includes("href: '/arena'"), 'Competition navigation must link to Arena');
  assert.ok(competitionNavigation.includes("href: '/leaderboard?mode=global'"), 'Competition navigation must link to global League standings');
  assert.ok(arenaPage.includes('href="/leaderboard?mode=global"'), 'Arena rules panel must link to standings');
  assert.ok(leaderboardPage.includes('<CompetitionNavigation active="leaderboard"'), 'Leaderboard must use the shared competition navigation');
});

// ── VECTOR 5: SCORING & TIEBREAKER MATHEMATICAL CONVERGENCE ───────────────────
test('CONTINUOUS MOTION VECTOR 5: Mathematical formula convergence across frontend and backend', () => {
  assert.ok(leaderboardRoute.includes('calculateLeaguePoints(weeklyXp, arenaPoints)'), 'Backend must rank by Weekly Learning XP plus Arena Points');
  assert.ok(leaderboardPage.includes('leaguePoints: weeklyXp + arenaPoints'), 'Frontend live updates must use the same sum');
  assert.strictEqual(calculateLeaguePoints(1000, 250), 1250);
  assert.strictEqual(calculateLeaguePoints(200, 100), 300);
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

  assert.strictEqual(arenaPointsForResult(500, 'win'), 250, 'A 500 ELO win earns the 250-point cap');
  assert.strictEqual(arenaPointsForResult(200, 'win'), 100, 'A 200 ELO win earns 100 Arena Points');
  assert.strictEqual(arenaPointsForResult(500, 'loss'), 0, 'Losses do not earn Arena Points');
  assert.strictEqual(calculateLeaguePoints(500, arenaPointsForResult(500, 'win')), 750);
});

// ── VECTOR 7: LIVE UI REFRESH & RESPONSIVE MOTION ─────────────────────────────
test('CONTINUOUS MOTION VECTOR 7: Arena and standings visibly react to fresh values', () => {
  assert.ok(arenaPage.includes('window.setInterval(refreshWhenVisible, 30_000)'), 'Arena standings must refresh on a visible-tab cadence');
  assert.ok(arenaPage.includes("window.addEventListener('pinit:user_profile_updated'"), 'Arena summary must react immediately to profile updates');
  assert.ok(leaderboardPage.includes('window.setInterval(requestRefresh, 30_000)'), 'Leaderboard must refresh on a visible-tab cadence');
  assert.ok(leaderboardPage.includes('loadedQueryKeyRef.current !== queryKey'), 'A scope/league change must load matching rows instead of reusing stale rows');
  assert.ok(leaderboardPage.includes('key={`points-${entry.leaguePoints || 0}`}'), 'League Point changes must trigger the value update motion');
  assert.ok(!arenaPage.includes('RATED MATCH'), 'The removed badge above VS must stay removed');
  assert.ok(competitionStyles.includes('@media (prefers-reduced-motion: reduce)'), 'Motion must honor reduced-motion preferences');
});
