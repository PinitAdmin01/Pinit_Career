import test from 'node:test';
import assert from 'node:assert';
import fs from 'fs';
import path from 'path';

const ROOT = path.join(__dirname, '..');
const leaderboardPagePath = path.join(ROOT, 'src/app/leaderboard/page.tsx');
const leaderboardRoutePath = path.join(ROOT, 'src/app/api/leaderboard/route.ts');
const leaguePointsPath = path.join(ROOT, 'src/lib/leagues/leaguePoints.ts');

const leaderboardPage = fs.readFileSync(leaderboardPagePath, 'utf8');
const leaderboardRoute = fs.readFileSync(leaderboardRoutePath, 'utf8');
const leaguePoints = fs.readFileSync(leaguePointsPath, 'utf8');

// ── 1. MATHEMATICAL FORMULA & ELO ANTI-INFLATION AUDIT ────────────────────────
test('Arena rating does not inflate League Points; wins award capped rating-scaled Arena Points', () => {
  assert.ok(
    !leaderboardRoute.includes('eloRating - 100) * 1.5'),
    'League score must not be calculated from ELO rating'
  );
  assert.ok(
    leaguePoints.includes('Math.round(safeElo * ARENA_WIN_POINTS_PER_ELO)'),
    'Arena win points must scale from pre-match ELO'
  );
  assert.ok(leaguePoints.includes('ARENA_WIN_POINTS_CAP = 250'));
  assert.ok(leaguePoints.includes('learningXp || 0)) + Math.max(0, Math.round(arenaPoints || 0))'));
  assert.ok(leaderboardRoute.includes('calculateLeaguePoints(weeklyXp, arenaPoints)'));
});

test('Global leaderboard shows one score: League Points', () => {
  assert.ok(
    leaderboardPage.includes('>League Points</th>'),
    'Global leaderboard must show only the combined League Points score'
  );
  assert.ok(
    !leaderboardPage.includes('Weekly XP</th>') && !leaderboardPage.includes('Arena ELO</th>'),
    'Global score table must not expose its component columns'
  );
});

test('Leaderboard ranks by League Points with deterministic tie-breakers', () => {
  assert.ok(
    leaderboardRoute.includes('calculateLeaguePoints(a.weeklyXp, a.arenaPoints ?? 0)'),
    'Primary order must be the sum of sprint Learning XP and Arena Points'
  );
  assert.ok(
    leaderboardRoute.includes('if (b.weeklyXp !== a.weeklyXp) return b.weeklyXp - a.weeklyXp;'),
    'Tier 2 tiebreaker: weeklyXp'
  );
  assert.ok(
    leaderboardRoute.includes('if (b.totalXp !== a.totalXp) return b.totalXp - a.totalXp;'),
    'Career XP is a deterministic tie-breaker only'
  );
  assert.ok(
    leaderboardRoute.includes('return a.studentId.localeCompare(b.studentId);'),
    'Student ID gives a stable final tie-breaker'
  );
});

test('Leaderboard Zones: Adaptive cohort promotion and demotion thresholds', () => {
  assert.ok(
    leaguePoints.includes('memberCount >= 10'),
    'Demotion is disabled until a division has at least 10 ranked players'
  );
  assert.ok(
    leaderboardRoute.includes("activeLeague !== 'ruby' && e.rank <= promotionCutoffRank"),
    'Ruby division must not promote players (it is the summit tier)'
  );
  assert.ok(
    leaderboardRoute.includes("activeLeague !== 'browns'") && leaderboardRoute.includes('e.rank >= demotionCutoffRank'),
    'Browns division must not demote players (it is the entry tier)'
  );
});

// ── 2. MULTI-TIER MOCK COHORT AUDIT ───────────────────────────────────────────
test('Mock Cohorts: All 5 divisions have calibrated cohorts for testing', () => {
  assert.ok(leaderboardRoute.includes('mockCohortsByTier: Record<LeagueTier, any[]> = {'), 'Contains mockCohortsByTier');
  assert.ok(leaderboardRoute.includes('browns: ['), 'Contains Browns cohort');
  assert.ok(leaderboardRoute.includes('silver: ['), 'Contains Silver cohort');
  assert.ok(leaderboardRoute.includes('gold: ['), 'Contains Gold cohort');
  assert.ok(leaderboardRoute.includes('platinum: ['), 'Contains Platinum cohort');
  assert.ok(leaderboardRoute.includes('ruby: ['), 'Contains Ruby cohort');
});

// ── 3. BEAST-TIER UI/UX & PODIUM SHOWCASE AUDIT ──────────────────────────────
test('Podium Showcase: Temporarily removed per Task 2', () => {
  // Per Task 2, podium showcase is temporarily removed from rendering
  assert.ok(
    leaderboardPage.includes('TOP 3 CHAMPIONS PODIUM SHOWCASE (Temporarily removed per Task 2)'),
    'Podium showcase must be marked temporarily removed per Task 2'
  );
  assert.ok(
    !leaderboardPage.includes('2nd Place Contender'),
    'Podium component 2nd Place Contender must be removed per Task 2'
  );
  assert.ok(
    !leaderboardPage.includes('3rd Place Challenger'),
    'Podium component 3rd Place Challenger must be removed per Task 2'
  );
});

test('Cockpit HUD: Live telemetry, dynamic score breakdown, and zone indicators', () => {
  assert.ok(
    leaderboardPage.includes('LIVE SPRINT'),
    'Cockpit standing card must display LIVE SPRINT pill'
  );
  assert.ok(
    leaderboardPage.includes("currentUserEntry ? `#${currentUserEntry.rank}` : 'Unranked'"),
    'Cockpit must render user rank number'
  );
  assert.ok(
    leaderboardPage.includes('In Promotion Zone! Advance to'),
    'Cockpit must render promotion zone banner'
  );
  assert.ok(
    leaderboardPage.includes('In Demotion Zone! Earn League Points to remain in'),
    'Cockpit must render demotion zone banner'
  );
});

test('Responsive Table: Horizontally scrollable container with min-width guard', () => {
  assert.ok(
    leaderboardPage.includes("overflowX: 'auto'"),
    'Table wrapper must have overflowX: auto for responsive mobile and small screen support'
  );
  assert.ok(
    leaderboardPage.includes('minWidth: 720'),
    'Compact four-column League Points table must remain readable on narrow screens'
  );
});

test('User Highlight: Current user row highlighted with accent left border and background', () => {
  assert.ok(
    leaderboardPage.includes("borderLeft: entry.isCurrentUser ? '4px solid #4f46e5' : '4px solid transparent'"),
    'Current user row must have prominent indigo left border'
  );
  assert.ok(
    leaderboardPage.includes("background: entry.isCurrentUser"),
    'Current user row must have dedicated background tint'
  );
});
