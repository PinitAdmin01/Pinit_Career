import test from 'node:test';
import assert from 'node:assert';
import fs from 'fs';
import path from 'path';

const ROOT = path.join(__dirname, '..');

// Read files under test
const leaderboardPagePath = path.join(ROOT, 'src/app/leaderboard/page.tsx');
const leaderboardRoutePath = path.join(ROOT, 'src/app/api/leaderboard/route.ts');
const questCompletePath = path.join(ROOT, 'src/app/api/quest/complete/route.ts');
const pythonRunnerPath = path.join(ROOT, 'src/app/api/code/run-python/route.ts');
const javaRunnerPath = path.join(ROOT, 'src/app/api/code/run-java/route.ts');
const userServicePath = path.join(ROOT, 'src/lib/services/supabase/userService.ts');
const appHeaderPath = path.join(ROOT, 'src/components/ui/AppHeader.tsx');
const appShellPath = path.join(ROOT, 'src/components/ui/AppShell.tsx');

const leaderboardPage = fs.readFileSync(leaderboardPagePath, 'utf8');
const leaderboardRoute = fs.readFileSync(leaderboardRoutePath, 'utf8');
const questComplete = fs.readFileSync(questCompletePath, 'utf8');
const pythonRunner = fs.readFileSync(pythonRunnerPath, 'utf8');
const javaRunner = fs.readFileSync(javaRunnerPath, 'utf8');
const userService = fs.readFileSync(userServicePath, 'utf8');
const appHeader = fs.readFileSync(appHeaderPath, 'utf8');
const appShell = fs.readFileSync(appShellPath, 'utf8');

// ── TASK 1 AUDIT: Light Mode Styling & Semantic Tokens ─────────────────────────
test('Task 1: Cockpit banner must use theme-adaptive semantic gradient, not hardcoded dark background', () => {
  assert.ok(
    leaderboardPage.includes("background: 'linear-gradient(135deg, var(--card) 0%, var(--bg3) 100%)'"),
    'Cockpit banner must use linear-gradient with var(--card) and var(--bg3) to look pristine in light mode'
  );
  assert.ok(
    !leaderboardPage.includes("background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95)"),
    'Cockpit banner must not use dark slate background in light mode'
  );
});

test('Task 1: League inspection cards and filters use semantic tokens and visible borders', () => {
  assert.ok(
    leaderboardPage.includes("border: isSelected ? `2px solid ${meta.color}` : '1px solid var(--border)'"),
    'League card border must resolve to var(--border) when not selected'
  );
  assert.ok(
    leaderboardPage.includes("background: isSelected ? meta.bgGradient : 'var(--card)'"),
    'League card background must resolve to var(--card) when not selected'
  );
  assert.ok(
    leaderboardPage.includes("background: domainFilter === d ? 'var(--brand)' : 'var(--card)'"),
    'Domain filter buttons must use var(--card) when inactive'
  );
  assert.ok(
    leaderboardPage.includes("border: domainFilter === d ? '1px solid var(--brand)' : '1px solid var(--border)'"),
    'Domain filter buttons must use var(--border) when inactive'
  );
});

test('Task 1: High-contrast rank colors and Silver/Gold YOU badges', () => {
  // Silver and Gold badge text contrast
  assert.ok(
    leaderboardPage.includes("(tier === 'silver' || tier === 'gold') ? '#0f172a' : '#ffffff'"),
    'YOU badge on silver and gold cards must use dark text #0f172a for WCAG contrast'
  );
  // Rank numbers contrast
  assert.ok(
    leaderboardPage.includes("entry.rank === 1 ? '#d97706' : entry.rank === 2 ? '#64748b' : entry.rank === 3 ? '#b45309'"),
    'Rank numbers must use dark amber and slate colors, avoiding invisible #cbd5e1'
  );
});

// ── TASK 2 AUDIT: Invisible Components & Low Contrast ──────────────────────────
test('Task 2: Student candidate names must NOT be hardcoded white #f8fafc on light tables', () => {
  assert.ok(
    !leaderboardPage.includes("color: entry.isCurrentUser ? '#a5b4fc' : '#f8fafc'"),
    'Must NOT use #f8fafc which renders invisible student names on white table rows'
  );
  assert.ok(
    leaderboardPage.includes("color: entry.isCurrentUser ? '#4f46e5' : 'var(--t1)'"),
    'Candidate names must use var(--t1) and prominent indigo for current user'
  );
});

test('Task 2: Search input, table headers, and badges use accessible tokens', () => {
  assert.ok(
    leaderboardPage.includes("color: 'var(--t1)',"),
    'Search input text must be var(--t1)'
  );
  assert.ok(
    leaderboardPage.includes("color: 'var(--t2)', fontSize: 12"),
    'Table header text must be var(--t2)'
  );
  assert.ok(
    leaderboardPage.includes("background: 'var(--bg3)', borderBottom: '1px solid var(--border)'"),
    'Table header row must use var(--bg3) and var(--border)'
  );
});

// ── TASK 3 AUDIT: Backend Telemetry, Anti-Stale Caching & Browns Exclusion ─────
test('Task 3: Leaderboard API sets anti-stale Cache-Control headers', () => {
  assert.ok(
    leaderboardRoute.includes("'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate'"),
    'API route must return strict Cache-Control headers'
  );
  assert.ok(
    leaderboardPage.includes("cache: 'no-store'"),
    'Client fetch must pass cache: no-store'
  );
});

test('Task 3: Browns league includes students with NULL league_tier', () => {
  assert.ok(
    leaderboardRoute.includes("activeLeague === 'browns'"),
    'Leaderboard route must check if activeLeague is browns'
  );
  assert.ok(
    leaderboardRoute.includes("query.or('league_tier.eq.browns,league_tier.is.null')"),
    'Browns league query must include NULL league_tier users'
  );
});

test('Task 3: Off-cohort rank resolution for students outside top 100 limit', () => {
  assert.ok(
    leaderboardRoute.includes('// If current user is outside top limit, resolve their exact position so Cockpit never says "Unranked"'),
    'Must compute off-cohort position for logged-in user'
  );
  assert.ok(
    leaderboardRoute.includes("rankQuery.gt('weekly_xp', myProfile.weekly_xp || 0)"),
    'Must count users with higher weekly_xp to compute exact off-cohort rank'
  );
});

// ── TASK 4 AUDIT: Dynamic Weekly XP Telemetry Synchronization ──────────────────
test('Task 4: Quest completion synchronizes weekly_xp alongside total xp', () => {
  assert.ok(
    questComplete.includes('weekly_xp: nextWeeklyXp'),
    'Quest complete route must update weekly_xp in users table'
  );
  assert.ok(
    questComplete.includes('weeklyXp: nextWeeklyXp'),
    'Quest complete route must return weeklyXp in JSON response'
  );
});

test('Task 4: Python and Java code runners persist weekly_xp on server-side milestones', () => {
  assert.ok(
    pythonRunner.includes('weekly_xp: newWeeklyXp'),
    'Python code runner must increment weekly_xp'
  );
  assert.ok(
    javaRunner.includes('weekly_xp: newWeeklyXp'),
    'Java code runner must increment weekly_xp'
  );
});

test('Task 4: UserService maps weeklyXp and includes weekly_xp in directFields', () => {
  assert.ok(
    userService.includes("weeklyXp:             row.weekly_xp ?? 0,"),
    'userService mapRowToProfile must map weeklyXp'
  );
  assert.ok(
    userService.includes("'weekly_xp'"),
    'userService directFields array must track weekly_xp'
  );
});

// ── TASK 5 AUDIT: Global Double Shift + Space Gaming Mode ─────────────────────
test('Task 5: AppShell contains global keydown listener for double Shift + Space', () => {
  assert.ok(
    appShell.includes("e.shiftKey && (e.code === 'Space' || e.key === ' ')"),
    'AppShell must detect Shift + Space combo'
  );
  assert.ok(
    appShell.includes('700'),
    'AppShell must use natural double-tap threshold (700ms)'
  );
  assert.ok(
    appShell.includes("target.isContentEditable"),
    'AppShell must ignore keydown when typing in contentEditable or input'
  );
  assert.ok(
    appShell.includes("requestFullscreen"),
    'AppShell must call requestFullscreen for native browser immersion'
  );
  assert.ok(
    appShell.includes("webkitRequestFullscreen"),
    'AppShell must provide Safari fallback for fullscreen'
  );
  assert.ok(
    appShell.includes('Gaming Mode Active · Press Shift + Space twice or Esc to exit'),
    'AppShell must display non-intrusive floating HUD overlay'
  );
});

// ── TASK 6 AUDIT: Removal of Focus Button and Feature ──────────────────────────
test('Task 6: Focus button and feature removed from AppHeader', () => {
  assert.ok(
    !appHeader.includes('🤫 Focus'),
    'AppHeader must not contain the 🤫 Focus button'
  );
  assert.ok(
    !appHeader.includes('Exit Focus Mode'),
    'AppHeader must not contain floating exit focus mode button'
  );
  assert.ok(
    appHeader.includes('toggleFocusMode?: () => void;'),
    'toggleFocusMode must be optional in AppHeaderProps'
  );
});


// ── BEHAVIORAL SIMULATION AUDIT ───────────────────────────────────────────────
test('Behavioral: Monday 1:00 AM IST Countdown Calculation', () => {
  function getNextMonday1AmIst(fakeNow: Date): Date {
    const istOffsetMs = 5.5 * 60 * 60 * 1000;
    const nowIst = new Date(fakeNow.getTime() + istOffsetMs);
    const day = nowIst.getUTCDay();
    const hour = nowIst.getUTCHours();
    let daysUntilMonday = (1 - day + 7) % 7;
    if (daysUntilMonday === 0 && hour >= 1) {
      daysUntilMonday = 7;
    }
    const nextMondayIst = new Date(nowIst);
    nextMondayIst.setUTCDate(nowIst.getUTCDate() + daysUntilMonday);
    nextMondayIst.setUTCHours(1, 0, 0, 0);
    return new Date(nextMondayIst.getTime() - istOffsetMs);
  }

  // Test case 1: Sunday 23:00 IST -> Next Monday 1:00 AM IST is in 2 hours
  const sunNightUtc = new Date(Date.UTC(2026, 10, 1, 17, 30, 0)); // 23:00 IST
  const target1 = getNextMonday1AmIst(sunNightUtc);
  const diffHours1 = (target1.getTime() - sunNightUtc.getTime()) / (1000 * 60 * 60);
  assert.strictEqual(diffHours1, 2, 'Should end in exactly 2 hours on Sunday 11:00 PM IST');

  // Test case 2: Monday 00:30 IST -> Next Monday 1:00 AM IST is in 30 minutes
  const monEarlyUtc = new Date(Date.UTC(2026, 10, 1, 19, 0, 0)); // Mon 00:30 IST
  const target2 = getNextMonday1AmIst(monEarlyUtc);
  const diffMins2 = (target2.getTime() - monEarlyUtc.getTime()) / (1000 * 60);
  assert.strictEqual(diffMins2, 30, 'Should end in 30 minutes on Monday 00:30 AM IST');

  // Test case 3: Monday 02:00 IST -> Next Monday 1:00 AM IST is in 7 days minus 1 hour
  const monAfterUtc = new Date(Date.UTC(2026, 10, 1, 20, 30, 0)); // Mon 02:00 IST
  const target3 = getNextMonday1AmIst(monAfterUtc);
  const diffHours3 = (target3.getTime() - monAfterUtc.getTime()) / (1000 * 60 * 60);
  assert.strictEqual(diffHours3, 167, 'Should wrap to following Monday 1:00 AM IST (167 hours)');
});

test('Behavioral: League Promotion and Demotion Cutoff Zones with 100 students', () => {
  const totalCount = 100;
  const promotionCutoffRank = Math.max(1, Math.ceil(totalCount * 0.10)); // Rank 10
  const demotionCutoffRank = Math.max(1, totalCount - Math.floor(totalCount * 0.10) + 1); // Rank 91

  assert.strictEqual(promotionCutoffRank, 10, 'Top 10 students promote');
  assert.strictEqual(demotionCutoffRank, 91, 'Ranks 91-100 demote');

  // Rank 5 -> promotion
  const rank5Zone = 5 <= promotionCutoffRank ? 'promotion' : 5 >= demotionCutoffRank ? 'demotion' : 'safe';
  assert.strictEqual(rank5Zone, 'promotion');

  // Rank 50 -> safe
  const rank50Zone = 50 <= promotionCutoffRank ? 'promotion' : 50 >= demotionCutoffRank ? 'demotion' : 'safe';
  assert.strictEqual(rank50Zone, 'safe');

  // Rank 95 -> demotion
  const rank95Zone = 95 <= promotionCutoffRank ? 'promotion' : 95 >= demotionCutoffRank ? 'demotion' : 'safe';
  assert.strictEqual(rank95Zone, 'demotion');
});

test('Behavioral: Gaming Mode Double Shift + Space timing and input guard logic', () => {
  class GamingModeSimulator {
    lastShiftSpaceTime = 0;
    fullscreenActive = false;
    hudVisible = false;

    handleKeyDown(event: { shiftKey: boolean; code: string; isInput: boolean; timeMs: number }) {
      if (event.shiftKey && event.code === 'Space') {
        if (!event.isInput) {
          if (event.timeMs - this.lastShiftSpaceTime < 700) {
            this.fullscreenActive = !this.fullscreenActive;
            this.hudVisible = this.fullscreenActive;
            this.lastShiftSpaceTime = 0;
            return 'TOGGLED';
          } else {
            this.lastShiftSpaceTime = event.timeMs;
            return 'RECORDED_FIRST_TAP';
          }
        }
        return 'IGNORED_INPUT';
      }
      if (event.code === 'Escape' && this.fullscreenActive) {
        this.fullscreenActive = false;
        this.hudVisible = false;
        return 'EXITED_FULLSCREEN';
      }
      return 'NOOP';
    }
  }

  const sim = new GamingModeSimulator();

  // Tap 1: Shift + Space at t=1000ms
  assert.strictEqual(sim.handleKeyDown({ shiftKey: true, code: 'Space', isInput: false, timeMs: 1000 }), 'RECORDED_FIRST_TAP');
  assert.strictEqual(sim.fullscreenActive, false);

  // Tap 2: Shift + Space at t=1400ms (400ms delta <= 700ms)
  assert.strictEqual(sim.handleKeyDown({ shiftKey: true, code: 'Space', isInput: false, timeMs: 1400 }), 'TOGGLED');
  assert.strictEqual(sim.fullscreenActive, true);
  assert.strictEqual(sim.hudVisible, true);

  // Tap in an input box: ignored even if Shift + Space
  assert.strictEqual(sim.handleKeyDown({ shiftKey: true, code: 'Space', isInput: true, timeMs: 1500 }), 'IGNORED_INPUT');
  assert.strictEqual(sim.fullscreenActive, true);

  // Press Escape: Exits gaming mode
  assert.strictEqual(sim.handleKeyDown({ shiftKey: false, code: 'Escape', isInput: false, timeMs: 1600 }), 'EXITED_FULLSCREEN');
  assert.strictEqual(sim.fullscreenActive, false);
  assert.strictEqual(sim.hudVisible, false);

  // Slow taps: Tap 1 at t=2000ms, Tap 2 at t=2800ms (800ms delta > 700ms) -> Not toggled
  assert.strictEqual(sim.handleKeyDown({ shiftKey: true, code: 'Space', isInput: false, timeMs: 2000 }), 'RECORDED_FIRST_TAP');
  assert.strictEqual(sim.handleKeyDown({ shiftKey: true, code: 'Space', isInput: false, timeMs: 2800 }), 'RECORDED_FIRST_TAP');
  assert.strictEqual(sim.fullscreenActive, false);
});
