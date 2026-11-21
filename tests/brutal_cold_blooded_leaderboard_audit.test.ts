import test from 'node:test';
import assert from 'node:assert';
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const leaderboardPagePath = path.join(ROOT, 'src/app/leaderboard/page.tsx');
const competitionStylesPath = path.join(ROOT, 'src/app/competition-experience.module.css');
const leaderboardRoutePath = path.join(ROOT, 'src/app/api/leaderboard/route.ts');

const leaderboardPage = fs.readFileSync(leaderboardPagePath, 'utf8');
const competitionStyles = fs.readFileSync(competitionStylesPath, 'utf8');
const leaderboardRoute = fs.readFileSync(leaderboardRoutePath, 'utf8');
const competitionNavigation = fs.readFileSync(path.join(ROOT, 'src/components/competition/CompetitionNavigation.tsx'), 'utf8');

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
    leaderboardPage.includes('No Project Squads Found'),
    'Frontend must display an honest empty state when there are no project squads'
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
    leaderboardPage.includes('className={styles.leagueCockpit}') &&
      competitionStyles.includes('.leagueCockpit {') &&
      competitionStyles.includes('padding: 17px clamp(17px, 2.1vw, 27px)') &&
      competitionStyles.includes('@media (max-width: 980px)'),
    'Cockpit HUD must use the shared compact spacing and responsive layout'
  );
  assert.ok(
    competitionStyles.includes('.leagueRankNumber { color: var(--warning, #d97706); font-size: 20px;'),
    'Rank display font must be scaled down to 20px'
  );
  // 3. Dynamic Circles housed inside HUD per Task 1
  assert.ok(
    leaderboardPage.includes('100 Career XP required to join Browns'),
    'Circle 1 must display League Entry Requirement tooltip/popover'
  );
  assert.ok(
    leaderboardPage.includes('Weekly Sprint Reset Clock'),
    'Circle 2 must display Weekly Sprint Reset Clock dial'
  );
  assert.ok(
    competitionNavigation.includes("href: '/leaderboard?mode=global'"),
    'Combined competition navigation must expose global standings'
  );
});

// ── VECTOR 3: RECTIFIED UNRANKED BUG & DYNAMIC USER PERSISTENCE ──────────────
test('BRUTAL VECTOR 3: Anti-unranked logic, Supabase league persistence & active off-cohort search', () => {
  // 1. Supabase persistence in handleJoinLeague
  assert.ok(
    leaderboardPage.includes("fetch('/api/leaderboard/join'"),
    'Join League must use the authenticated server endpoint'
  );
  assert.ok(
    leaderboardPage.includes("pinit:user_profile_updated"),
    'handleJoinLeague must fire pinit:user_profile_updated event'
  );

  // 2. Verified user identity in production; client ID hints stay test-only
  assert.ok(
    leaderboardRoute.includes("process.env.NODE_ENV !== 'production' && process.env.ALLOW_DEV_AUTH_BYPASS === 'true'") &&
      leaderboardRoute.includes("req.headers.get('x-user-id')") &&
      leaderboardRoute.includes("url.searchParams.get('userId')"),
    'API may use client ID hints only in explicitly enabled non-production test mode'
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
    leaderboardPage.includes('setServerCurrentUser(responseCurrentUser);'),
    'Frontend must record the rank-reconciled server current user'
  );
  assert.ok(
    leaderboardPage.includes('setJoinedLeague(true);'),
    'Frontend must reactively sync joinedLeague state'
  );
  assert.ok(
    leaderboardPage.includes('const result = list.filter(entry => {'),
    'Search must filter the returned leaderboard rows, including the server-appended current-user entry'
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
  // Formula: sprint learning XP + sprint Arena Points. ELO only scales the Arena Points awarded for a win.
  assert.ok(
    leaderboardRoute.includes('calculateLeaguePoints(weeklyXp, arenaPoints)'),
    'Backend League Points must combine weekly learning XP and Arena Points'
  );
  assert.ok(leaderboardPage.includes('League Points</th>'), 'Leaderboard must show League Points as the single competition score');
  assert.ok(leaderboardRoute.includes('calculateLeaguePoints(a.weeklyXp, a.arenaPoints ?? 0)'), 'Backend standings must sort by the combined League Points value');

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
    leaderboardRoute.includes('if (b.totalXp !== a.totalXp) return b.totalXp - a.totalXp;'),
    'Tiebreaker stage 3: Lifetime XP'
  );
  assert.ok(
    leaderboardRoute.includes('return a.studentId.localeCompare(b.studentId);'),
    'Tiebreaker stage 4: Stable student ID'
  );

  // Cutoff zones boundary safeguards
  assert.ok(
    leaderboardRoute.includes("activeLeague !== 'ruby' && e.rank <= promotionCutoffRank"),
    'Ruby league champions cannot be promoted'
  );
  assert.ok(
    leaderboardRoute.includes("activeLeague !== 'browns' && demotionCutoffRank > 0 && e.rank >= demotionCutoffRank"),
    'Browns league rookies cannot be demoted'
  );
});

// ── VECTOR 7: FULL-STACK STRUCTURED OBSERVABILITY & TELEMETRY CONTRACT ─────────
test('BRUTAL VECTOR 7: Comprehensive telemetry logging across middleware, middlepoints and client', () => {
  // Backend Ingress & Security Middleware logs
  assert.ok(
    leaderboardRoute.includes('[LEADERBOARD_MIDDLEWARE][Inbound Request]'),
    'Backend must log inbound request with IP, method, and timestamp'
  );
  assert.ok(
    leaderboardRoute.includes('[LEADERBOARD_SECURITY][Adversarial Probe Neutralized]'),
    'Backend must log neutralized malware/XSS/SQLi security threats'
  );

  // Backend Middlepoint Telemetry logs
  assert.ok(
    leaderboardRoute.includes('[LEADERBOARD_MIDDLEPOINT][Auth Resolution]'),
    'Backend must log auth resolution and resolved league'
  );
  assert.ok(
    leaderboardRoute.includes('[LEADERBOARD_MIDDLEPOINT][Cohort Retrieval]'),
    'Backend must log cohort retrieval size and DB status'
  );
  assert.ok(
    leaderboardRoute.includes('[LEADERBOARD_MIDDLEPOINT][Tiebreaker Complete]'),
    'Backend must log tiebreaker sorting completion and top candidate'
  );
  assert.ok(
    leaderboardRoute.includes('[LEADERBOARD_MIDDLEPOINT][Off-Cohort Resolution]'),
    'Backend must log off-cohort user rank and status'
  );
  assert.ok(
    leaderboardRoute.includes('[LEADERBOARD_MIDDLEPOINT][Guild Squads]'),
    'Backend must log authentic guild squads count'
  );

  // Backend Egress Dispatch log
  assert.ok(
    leaderboardRoute.includes('[LEADERBOARD_ENDPOINT][Dispatched]'),
    'Backend must log response dispatch with latencyMs'
  );

  // Frontend Client Telemetry logs
  assert.ok(
    leaderboardPage.includes('[LEADERBOARD_CLIENT][Fetch Inflight]'),
    'Frontend must log fetch inflight parameters'
  );
  assert.ok(
    leaderboardPage.includes('[LEADERBOARD_CLIENT][Fetch Complete]'),
    'Frontend must log fetch completion with clientDurationMs'
  );
  assert.ok(
    leaderboardPage.includes("fetch('/api/leaderboard/join'"),
    'Frontend join action must call the membership endpoint'
  );
  assert.ok(
    leaderboardPage.includes('[LEADERBOARD_CLIENT][Profile Update Event Received]'),
    'Frontend must log real-time profile update event'
  );
  assert.ok(
    leaderboardPage.includes('[LEADERBOARD_CLIENT][Division Switched]'),
    'Frontend must log division vault switch interaction'
  );
});

// ── VECTOR 8: ELO INTEGRITY & NON-NEGATIVE GAIN PROTECTION ─────────────────────
test('BRUTAL VECTOR 8: 100 baseline ELO with non-negative ELO gain protection', () => {
  // ELO Gain is strictly non-negative: Math.max(0, eloRating - 100)
  assert.ok(
    leaderboardRoute.includes('Math.max(0, eloRating - 100)'),
    'Backend must clamp eloGain to 0 minimum so ELO losses below 100 never penalize league score'
  );
  assert.ok(
    leaderboardPage.includes('const userTotalXp = Math.max(') && leaderboardPage.includes('Number.isFinite(Number(cOS?.xp))'),
    'Frontend must use the freshest XP value for entry eligibility'
  );

  // Default baseline ELO is 100 with legacy 1200 sanitization
  assert.ok(
    leaderboardPage.includes('arena_elo') && leaderboardPage.includes('100'),
    'Frontend must recognize the 100 baseline ELO when displaying profile updates'
  );
  assert.ok(
    leaderboardRoute.includes('arena_elo || 100') || leaderboardRoute.includes('isLegacy1200'),
    'Backend off-cohort query must fall back to 100 baseline ELO'
  );
});

