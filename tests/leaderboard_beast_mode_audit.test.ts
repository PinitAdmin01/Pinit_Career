import test from 'node:test';
import assert from 'node:assert';
import fs from 'fs';
import path from 'path';

const ROOT = path.join(__dirname, '..');
const leaderboardPagePath = path.join(ROOT, 'src/app/leaderboard/page.tsx');
const leaderboardRoutePath = path.join(ROOT, 'src/app/api/leaderboard/route.ts');

const leaderboardPage = fs.readFileSync(leaderboardPagePath, 'utf8');
const leaderboardRoute = fs.readFileSync(leaderboardRoutePath, 'utf8');

// ── 1. MATHEMATICAL FORMULA & ELO ANTI-INFLATION AUDIT ────────────────────────
test('Leaderboard ELO: Decoupled from artificial XP inflation with logarithmic calibration', () => {
  assert.ok(
    !leaderboardRoute.includes('1200 + Math.round(totalXp / 8)'),
    'Must purge naive totalXp / 8 which gave 2000+ ELO to non-combatants'
  );
  assert.ok(
    leaderboardRoute.includes('Math.min(60, Math.round(Math.sqrt(totalXp) * 0.8))'),
    'Must use soft-capped logarithmic baseline for unranked candidates'
  );
});

test('Leaderboard Score: Dynamic 1.5x competitive weight for weekly league score', () => {
  assert.ok(
    leaderboardRoute.includes('leagueScore = weeklyXp + Math.round(eloGain * 1.5)'),
    'League score must weight competitive arena victories with 1.5x multiplier'
  );
  assert.ok(
    leaderboardPage.includes('entry.weeklyXp + Math.round(Math.max(0, entry.eloRating - 100) * 1.5)'),
    'Frontend must compute synchronized league score with identical formula'
  );
});

test('Leaderboard Comparator: 4-tier deterministic tiebreaker', () => {
  assert.ok(
    leaderboardRoute.includes('if (scoreB !== scoreA) return scoreB - scoreA;'),
    'Tier 1 tiebreaker: leagueScore'
  );
  assert.ok(
    leaderboardRoute.includes('if (b.weeklyXp !== a.weeklyXp) return b.weeklyXp - a.weeklyXp;'),
    'Tier 2 tiebreaker: weeklyXp'
  );
  assert.ok(
    leaderboardRoute.includes('if (b.eloRating !== a.eloRating) return b.eloRating - a.eloRating;'),
    'Tier 3 tiebreaker: eloRating'
  );
  assert.ok(
    leaderboardRoute.includes('return b.totalXp - a.totalXp;'),
    'Tier 4 tiebreaker: totalXp'
  );
});

test('Leaderboard Zones: Adaptive cohort promotion and demotion thresholds', () => {
  assert.ok(
    leaderboardRoute.includes('if (totalCohortCount >= 4 && totalCohortCount < 10)'),
    'Must adapt cutoffs for small cohorts so bottom player demotes'
  );
  assert.ok(
    leaderboardRoute.includes("activeLeague !== 'ruby' && e.rank <= promotionCutoffRank"),
    'Ruby division must not promote players (it is the summit tier)'
  );
  assert.ok(
    leaderboardRoute.includes("activeLeague !== 'browns' && e.rank >= demotionCutoffRank"),
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
test('Podium Showcase: Top 3 pedestal cards with Gold, Silver, and Bronze elevation', () => {
  // Per Task 2, podium showcase is temporarily disabled from rendering
  assert.ok(
    leaderboardPage.includes('Temporarily disabled per Task 2'),
    'Podium showcase must be marked temporarily disabled per Task 2'
  );
  assert.ok(
    leaderboardPage.includes('1st Place · Division Leader'),
    'Pedestal markup must preserve 1st Place title without emojis'
  );
  assert.ok(
    leaderboardPage.includes('2nd Place Contender'),
    'Pedestal markup must preserve 2nd Place title without emojis'
  );
  assert.ok(
    leaderboardPage.includes('3rd Place Challenger'),
    'Pedestal markup must preserve 3rd Place title without emojis'
  );
  assert.ok(
    leaderboardPage.includes("transform: 'scale(1.03)'"),
    'Gold 1st place card must be visually elevated with scale(1.03)'
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
    leaderboardPage.includes('In Demotion Zone! Earn XP to remain in'),
    'Cockpit must render demotion zone banner'
  );
});

test('Responsive Table: Horizontally scrollable container with min-width guard', () => {
  assert.ok(
    leaderboardPage.includes("overflowX: 'auto'"),
    'Table wrapper must have overflowX: auto for responsive mobile and small screen support'
  );
  assert.ok(
    leaderboardPage.includes('minWidth: 840'),
    'Table must enforce minWidth 840 to prevent awkward column squishing'
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
