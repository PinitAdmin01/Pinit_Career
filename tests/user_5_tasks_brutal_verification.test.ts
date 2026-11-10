import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

const leaderboardPage = fs.readFileSync(path.resolve('src/app/leaderboard/page.tsx'), 'utf8');
const arenaPage = fs.readFileSync(path.resolve('src/app/arena/page.tsx'), 'utf8');
const leaderboardRoute = fs.readFileSync(path.resolve('src/app/api/leaderboard/route.ts'), 'utf8');
const settleSoloRoute = fs.readFileSync(path.resolve('src/app/api/arena/settle-solo/route.ts'), 'utf8');
const portalService = fs.readFileSync(path.resolve('src/lib/services/portalService.ts'), 'utf8');
const friendDrawer = fs.readFileSync(path.resolve('src/components/friends/FriendProfileDrawer.tsx'), 'utf8');

// ── TASK 1: COCKPIT HUD BUTTONS REPLACED WITH 2 DYNAMIC CIRCLES ───────────────
test('TASK 1: Removal of old buttons and replacement with 2 dynamic circles side by side', () => {
  // 1. Old buttons removed from HUD
  assert.ok(!leaderboardPage.includes('1v1 Battle Arena</Link>'), 'Old 1v1 Battle Arena button must be removed from HUD');
  assert.ok(!leaderboardPage.includes('Pins Wallet</Link>'), 'Old Pins Wallet button must be removed from HUD');

  // 2. Circle 1: Vanishes when requirement is met (userTotalXp >= 100)
  assert.ok(
    leaderboardPage.includes('userTotalXp < 100 && ('),
    'Circle 1 must conditionally render when userTotalXp < 100 and vanish when requirement is met'
  );
  assert.ok(
    leaderboardPage.includes('League Entry Requirement: 100 XP Needed to Join'),
    'Circle 1 must display exact popover copy on click'
  );
  assert.ok(
    leaderboardPage.includes('strokeDashoffset={138.23 * (1 - Math.min(1, Math.max(0, userTotalXp / 100)))}'),
    'Circle 1 must render dynamic SVG progress ring calibrated to 100 XP'
  );

  // 3. Circle 2: Reset Clock to promote or demote users
  assert.ok(
    leaderboardPage.includes('Weekly Sprint Reset Clock'),
    'Circle 2 must render Weekly Sprint Reset Clock dial'
  );
  assert.ok(
    leaderboardPage.includes('Sprint resets Monday at 1:00 AM IST. Top 10% promote to higher league; bottom 10% demote.'),
    'Circle 2 popover must explain promote and demote rules on click'
  );
});

// ── TASK 2: TEMPORARILY REMOVE TOP 3 PODIUM SHOWCASE ──────────────────────────
test('TASK 2: Top 3 Podium Showcase is cleanly removed from rendering without fake flags', () => {
  assert.ok(
    leaderboardPage.includes('TOP 3 CHAMPIONS PODIUM SHOWCASE (Temporarily removed per Task 2)'),
    'Top 3 Podium Showcase must be documented as temporarily removed per Task 2'
  );
  assert.ok(
    !leaderboardPage.includes('2nd Place Contender'),
    'Podium DOM elements (2nd Place Contender) must be completely excised from JSX'
  );
  assert.ok(
    !leaderboardPage.includes('3rd Place Challenger'),
    'Podium DOM elements (3rd Place Challenger) must be completely excised from JSX'
  );
  assert.ok(
    !leaderboardPage.includes('false && activeTab !=='),
    'Zero fake-flag boolean hacks allowed in JSX'
  );
});

// ── TASK 3: 30% REDUCTION OF SUB-TABS & COMPLETE EMOJI PURGE ──────────────────
test('TASK 3: Sub-tabs 30% reduction and ZERO unicode emojis across entire leaderboard', () => {
  // 1. Sub-tabs reduced dimensions
  assert.ok(leaderboardPage.includes('minWidth: 125'), 'Sub-tab buttons must be reduced to 125px min-width');
  assert.ok(leaderboardPage.includes("padding: '7px 12px'"), 'Sub-tab button padding must be reduced to 7px 12px');
  assert.ok(leaderboardPage.includes('fontSize: 12'), 'Sub-tab font size must be reduced to 12px');

  // 2. Sub-tab labels have zero emojis
  const subtabsDefinition = `[
          { id: 'region_college', label: 'Region / College' },
          { id: 'global', label: 'Global Leaderboard' },
          { id: 'guild_projects', label: 'Guild Projects' },
          { id: 'weekly_leagues', label: 'League Promotion & Demotion' },
        ]`;
  assert.ok(leaderboardPage.includes(subtabsDefinition), 'Sub-tabs must have no icon property and clean text labels');

  // 3. Complete regex scan for any unicode emojis in leaderboard/page.tsx
  const emojiRegex = /[\u{1F000}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
  const lines = leaderboardPage.split('\n');
  const violations: string[] = [];
  lines.forEach((line, idx) => {
    if (emojiRegex.test(line)) {
      violations.push(`Line ${idx + 1}: ${line.trim()}`);
    }
  });

  assert.strictEqual(
    violations.length,
    0,
    `Found emojis in leaderboard/page.tsx:\n${violations.join('\n')}`
  );
});

// ── TASK 4: 100 BASELINE STARTING ELO & LEGACY 1200 SANITIZATION ──────────────
test('TASK 4: Starting ELO is 100 and legacy 1200 default is sanitized across all services', () => {
  // 1. Backend Leaderboard route sanitization
  assert.ok(
    leaderboardRoute.includes('isLegacy1200 = rawElo === 1200 && (!(p as any).arena_wins || (p as any).arena_wins === 0)'),
    'Backend must detect legacy 1200 default for 0-win profiles'
  );
  assert.ok(
    leaderboardRoute.includes('isMyLegacy1200 = myRawElo === 1200'),
    'Backend must detect legacy 1200 for current user profile'
  );

  // 2. Solo settle route sanitization
  assert.ok(
    settleSoloRoute.includes('data.arena_elo === 1200 && (!data.arena_wins || data.arena_wins === 0)'),
    'Settle solo route must normalize legacy 1200 ELO to 100'
  );

  // 3. Portal service sanitization
  assert.ok(
    portalService.includes('(u.arena_elo === 1200 && !(u.arena_wins)) ? 100 : (u.arena_elo || 100)'),
    'portalService must sanitize legacy 1200 to 100'
  );

  // 4. Friend profile drawer sanitization
  assert.ok(
    friendDrawer.includes('(raw === 1200 && !(student.arenaWins)) ? 100 :'),
    'FriendProfileDrawer must sanitize legacy 1200 to 100'
  );

  // 5. Leaderboard frontend clientElo sanitization
  assert.ok(
    leaderboardPage.includes('(rawUserElo === 1200 && !(user as any).arena_wins) ? 100 :'),
    'Leaderboard page must normalize clientElo to 100 for 0-win users'
  );

  // 6. Arena page baseline & auto-healing
  assert.ok(
    arenaPage.includes('saved === 1200'),
    'Arena page must cleanse localStorage 1200 cached ELO to 100'
  );
  assert.ok(
    arenaPage.includes('isLegacy1200 = rawUserElo === 1200 && !(user as any)?.arena_wins'),
    'Arena page must identify legacy 1200 ELO'
  );
  assert.ok(
    arenaPage.includes("supabase.from('users').update({ arena_elo: 100 }).eq('id', user.id)"),
    'Arena page must auto-heal legacy 1200 in Supabase users table'
  );
});

// ── TASK 5: REMOVAL OF ALL COMBAT MODES TAB & OVERVIEW CARDS ──────────────────
test('TASK 5: Complete removal of "All Combat Modes" tab and its overview cards', () => {
  // 1. Tab definition in Arena
  assert.ok(
    !arenaPage.includes("{ id: 'all', label: 'All Combat Modes'"),
    'Tab "All Combat Modes" must be purged from Arena tabs'
  );

  // 2. activeTab default
  assert.ok(
    arenaPage.includes("initialTab") && arenaPage.includes("'code_wars'"),
    'Arena initialTab must default to code_wars'
  );
  assert.ok(
    arenaPage.includes("const [activeTab, setActiveTab] = useState<'code_wars' | 'hackathons' | 'viva'>(initialTab)"),
    'Arena activeTab must only support code_wars, hackathons, viva'
  );

  // 3. Removal of Card 1 overview
  assert.ok(
    !arenaPage.includes('Open 1v1 Code Wars Arena →'),
    'Overview Card 1 button "Open 1v1 Code Wars Arena ->" must be removed'
  );

  // 4. Zero references to activeTab === 'all'
  assert.ok(
    !arenaPage.includes("activeTab === 'all'"),
    'Arena page must have zero references to activeTab === all'
  );
});
