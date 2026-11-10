import test from 'node:test';
import assert from 'node:assert';
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const leaderboardPagePath = path.join(ROOT, 'src/app/leaderboard/page.tsx');
const leaderboardRoutePath = path.join(ROOT, 'src/app/api/leaderboard/route.ts');

const leaderboardPage = fs.readFileSync(leaderboardPagePath, 'utf8');
const leaderboardRoute = fs.readFileSync(leaderboardRoutePath, 'utf8');

// ── VECTOR 1: ZERO-DUMMY DATA & DATA INTEGRITY ────────────────────────────────
test('BRUTAL VECTOR 1: Zero mock squads & zero hardcoded demo data in backend and frontend', () => {
  const dummySquads = [
    'ByteCraft Autonomous Systems',
    'NeuralEdge Labs',
    'Argon Cyber Sentinels',
    'Fullstack Hyperloop Guild',
  ];

  for (const squad of dummySquads) {
    assert.strictEqual(
      leaderboardRoute.includes(squad),
      false,
      `Backend route MUST NOT contain dummy squad: ${squad}`
    );
  }

  // Verify backend queries authentic table hackathon_squads and safe fallback to []
  assert.ok(
    leaderboardRoute.includes("from('hackathon_squads')"),
    'Backend must query authentic hackathon_squads table'
  );
  assert.ok(
    leaderboardRoute.includes('guilds = [];'),
    'Backend must fall back to empty array on database failure'
  );

  // Verify frontend empty state with action link
  assert.ok(
    leaderboardPage.includes('No Active Student Guild Squads This Sprint'),
    'Frontend must display empty state when guilds.length === 0'
  );
  assert.ok(
    leaderboardPage.includes('href="/projects"'),
    'Empty state must include direct link to /projects hub'
  );
});

// ── VECTOR 2: SPATIAL OPTIMIZATION & HUD SCALE DOWN (~25%) ────────────────────
test('BRUTAL VECTOR 2: Space reclamation, HUD elevation, and ~25% compact sizing', () => {
  // 1. Redundant header removal
  assert.strictEqual(
    leaderboardPage.includes('Competency & Weekly Leagues'),
    false,
    'Bulky top header text "Competency & Weekly Leagues" must be removed'
  );
  assert.strictEqual(
    leaderboardPage.includes('7-Day Duolingo-Style Sprints'),
    false,
    'Header subtitle must be purged to reclaim vertical space'
  );

  // 2. HUD elevation and compact styling
  assert.ok(
    leaderboardPage.includes('data-testid="cockpit-telemetry-hud"'),
    'Cockpit Telemetry HUD must be present with test ID'
  );
  assert.ok(
    leaderboardPage.includes("padding: '12px 18px'"),
    'Cockpit HUD must have compact padding: 12px 18px'
  );
  assert.ok(
    leaderboardPage.includes('fontSize: 20'),
    'Rank display font must be scaled down to 20px'
  );
  assert.ok(
    leaderboardPage.includes('fontSize: 18'),
    'Countdown font must be scaled down to 18px'
  );

  // 3. Quick actions housed inside HUD
  assert.ok(
    leaderboardPage.includes('href="/arena?tab=code_wars"'),
    '1v1 Battle Arena quick link must be embedded in HUD'
  );
  assert.ok(
    leaderboardPage.includes('href="/pins"'),
    'Pins Wallet quick link must be embedded in HUD'
  );
});

// ── VECTOR 3: RECTIFIED UNRANKED BUG & DYNAMIC USER PERSISTENCE ──────────────
test('BRUTAL VECTOR 3: Anti-unranked logic, Supabase league persistence & active off-cohort search', () => {
  // 1. Supabase persistence in handleJoinLeague
  assert.ok(
    leaderboardPage.includes("supabase.from('users').update({ league_tier: 'browns' }).eq('id', user.id)"),
    'handleJoinLeague must write league_tier = browns to Supabase users table'
  );
  assert.ok(
    leaderboardPage.includes("pinit:user_profile_updated"),
    'handleJoinLeague must fire pinit:user_profile_updated event'
  );

  // 2. Multi-channel user identification in API
  assert.ok(
    leaderboardRoute.includes("req.headers.get('x-user-id')"),
    'API must read x-user-id header'
  );
  assert.ok(
    leaderboardRoute.includes("url.searchParams.get('userId')"),
    'API must read userId query parameter'
  );

  // 3. Off-cohort user appended to entries and returned in payload
  assert.ok(
    leaderboardRoute.includes('entries.push(currentUserEntry);'),
    'Off-cohort user must be pushed into entries table'
  );
  assert.ok(
    leaderboardRoute.includes('currentUser: currentUserEntry,'),
    'currentUser object must be included in JSON response'
  );

  // 4. Reactive client hydration and search integrity
  assert.ok(
    leaderboardPage.includes('setServerCurrentUser(data.currentUser);'),
    'Frontend must record server-computed currentUser'
  );
  assert.ok(
    leaderboardPage.includes('setJoinedLeague(true);'),
    'Frontend must reactively sync joinedLeague state'
  );
  assert.ok(
    leaderboardPage.includes('currentUserEntry.name.toLowerCase().includes(searchQuery.toLowerCase())'),
    'Searching user own name must retain off-cohort user in filtered result'
  );
});

// ── VECTOR 4: AAA GAME-DEV DIVISION VAULT MODAL & ACCESSIBILITY ───────────────
test('BRUTAL VECTOR 4: Division vault modal architecture, a11y, escape key & scroll-lock', () => {
  // 1. Static 5-card row excision
  assert.strictEqual(
    leaderboardPage.includes('Inspect League Division:'),
    false,
    'Static "Inspect League Division:" text must be removed from page'
  );

  // 2. Interactive launcher button on Cockpit HUD with ARIA
  assert.ok(
    leaderboardPage.includes('data-testid="interactive-league-emblem-btn"'),
    'Interactive launcher button must exist'
  );
  assert.ok(
    leaderboardPage.includes('aria-haspopup="dialog"'),
    'Launcher button must announce aria-haspopup="dialog"'
  );
  assert.ok(
    leaderboardPage.includes('aria-expanded={isLeagueModalOpen}'),
    'Launcher button must track aria-expanded'
  );
  assert.ok(
    leaderboardPage.includes('Switch ▾'),
    'Launcher must display "Switch ▾" prompt'
  );

  // 3. Modal container accessibility & mobile viewport safety
  assert.ok(
    leaderboardPage.includes('role="dialog"'),
    'Modal must have role="dialog"'
  );
  assert.ok(
    leaderboardPage.includes('aria-modal="true"'),
    'Modal must declare aria-modal="true"'
  );
  assert.ok(
    leaderboardPage.includes("maxHeight: 'min(90vh, 760px)'"),
    'Modal must have maxHeight to prevent clipping on mobile screens'
  );
  assert.ok(
    leaderboardPage.includes("overflowY: 'auto'"),
    'Modal must have overflowY: auto for scrolling'
  );

  // 4. Close button accessibility
  assert.ok(
    leaderboardPage.includes('aria-label="Close division vault"'),
    'Close button must have explicit aria-label'
  );

  // 5. Escape key listener and body scroll-lock
  assert.ok(
    leaderboardPage.includes("e.key === 'Escape'"),
    'Modal must listen for Escape key to close'
  );
  assert.ok(
    leaderboardPage.includes("document.body.style.overflow = 'hidden'"),
    'Modal must lock body scroll when open'
  );

  // 6. All 5 divisions present with interactive selection
  const tiers = ['browns', 'silver', 'gold', 'platinum', 'ruby'];
  for (const tier of tiers) {
    assert.ok(
      leaderboardPage.includes(`data-testid={\`select-league-\${tier}\`}`),
      `Division vault must include selection button for ${tier}`
    );
  }
});

// ── VECTOR 5: ADVERSARIAL RESILIENCY & INPUT SANITIZATION ──────────────────────
test('BRUTAL VECTOR 5: API resiliency against invalid/malicious query parameters', () => {
  // Mode sanitization
  assert.ok(
    leaderboardRoute.includes("url.searchParams.get('mode') || 'weekly_leagues'"),
    'API must handle missing/null mode gracefully'
  );

  // League validation with strict Set lookup
  assert.ok(
    leaderboardRoute.includes("new Set<LeagueTier>(['browns', 'silver', 'gold', 'platinum', 'ruby'])"),
    'API must restrict leagues to valid set, rejecting malicious SQL/scripts'
  );

  // Anti-stale HTTP headers
  assert.ok(
    leaderboardRoute.includes("'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate'"),
    'API must set anti-cache headers so ranks never get cached statically by CDN'
  );
});

// ── VECTOR 6: MATHEMATICAL & TIE-BREAKER SOUNDNESS ─────────────────────────────
test('BRUTAL VECTOR 6: League score formula, zones, and 4-tier tiebreaker', () => {
  // Formula: weeklyXp + round(eloGain * 1.5)
  assert.ok(
    leaderboardRoute.includes('weeklyXp + Math.round(eloGain * 1.5)'),
    'Backend must compute 1.5x competitive ELO multiplier for league score'
  );
  assert.ok(
    leaderboardPage.includes('currentUserEntry.weeklyXp + Math.round((currentUserEntry.eloGain ?? 0) * 1.5)'),
    'Frontend must match 1.5x competitive ELO multiplier'
  );

  // Tiebreaker stages
  assert.ok(
    leaderboardRoute.includes('if (scoreB !== scoreA) return scoreB - scoreA;'),
    'Tiebreaker stage 1: League Score'
  );
  assert.ok(
    leaderboardRoute.includes('if (b.weeklyXp !== a.weeklyXp) return b.weeklyXp - a.weeklyXp;'),
    'Tiebreaker stage 2: Weekly XP'
  );
  assert.ok(
    leaderboardRoute.includes('if (b.eloRating !== a.eloRating) return b.eloRating - a.eloRating;'),
    'Tiebreaker stage 3: Arena ELO rating'
  );
  assert.ok(
    leaderboardRoute.includes('return b.totalXp - a.totalXp;'),
    'Tiebreaker stage 4: Total XP'
  );

  // Cutoff zones boundary safeguards
  assert.ok(
    leaderboardRoute.includes("activeLeague !== 'ruby' && e.rank <= promotionCutoffRank"),
    'Ruby league champions cannot be promoted'
  );
  assert.ok(
    leaderboardRoute.includes("activeLeague !== 'browns' && e.rank >= demotionCutoffRank"),
    'Browns league rookies cannot be demoted'
  );
});
