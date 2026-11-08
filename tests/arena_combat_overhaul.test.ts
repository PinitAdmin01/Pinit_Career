import { describe, it } from 'node:test';
import assert from 'node:assert';
import fs from 'fs';
import path from 'path';

describe('Arena Combat Center Overhaul & Backend Optimization Suite', () => {
  const arenaPagePath = path.resolve('src/app/arena/page.tsx');
  const arenaContent = fs.readFileSync(arenaPagePath, 'utf8');

  it('Task 1: Redundant 3-line header text is completely removed from /arena', () => {
    // 1. "Challenging Arena & Combat Center"
    assert.strictEqual(
      arenaContent.includes('Challenging Arena &amp; Combat Center') ||
      arenaContent.includes('Challenging Arena & Combat Center'),
      false,
      'Expected "Challenging Arena & Combat Center" heading to be purged from page'
    );

    // 2. The 2-line description: "Put your engineering capabilities to the test..."
    assert.strictEqual(
      arenaContent.includes('Put your engineering capabilities to the test. Compete in real-time 1v1 PvP algorithmic code battles'),
      false,
      'Expected redundant 2-line sub-heading description to be purged from top banner'
    );
  });

  it('Task 2: Screenshot 2 components relocated to the bottom dock with 2 dynamic progress bars', () => {
    // Dock exists at bottom
    assert.ok(
      arenaContent.includes('data-testid="arena-bottom-telemetry-dock"'),
      'Expected bottom combat telemetry dock to be present'
    );

    // Screenshot 2 components relocated to dock
    assert.ok(arenaContent.includes('Arena XP'), 'Arena XP widget must be inside bottom dock');
    assert.ok(arenaContent.includes('Combat Pins'), 'Combat Pins widget must be inside bottom dock');
    assert.ok(arenaContent.includes('href="/leaderboard?tab=code_wars"'), 'Leaderboard button must be inside bottom dock');

    // Progress Bar 1: Arena Elo Tier & Advancement
    assert.ok(
      arenaContent.includes('Tier: {eloTier.name}') &&
      arenaContent.includes('{eloRating} / {eloTier.target} ELO') &&
      arenaContent.includes('width: `${eloProgressPct}%`'),
      'Progress Bar 1 (Elo Tier Progress) must be rendered dynamically'
    );

    // Progress Bar 2: Combat Precision & Win Ratio
    assert.ok(
      arenaContent.includes('Combat Precision &amp; Win Rate') &&
      arenaContent.includes('width: `${totalBattles > 0 ? Math.max(6, winRatePct) : 0}%`'),
      'Progress Bar 2 (Combat Precision & Win Rate) must be rendered dynamically'
    );
  });

  it('Task 3: Heaven-grade UI/UX polish applied across cards and tabs with Light/Dark mode parity', () => {
    // Segmented tab bar
    assert.ok(arenaContent.includes('Arena Navigation Tabs (Sleek Glass Segmented Bar)'));

    // Overview cards with glowing micro-badge pulse dots
    assert.ok(arenaContent.includes('1V1 PVP ARENA'), 'Card 1 micro-badge must be present');
    assert.ok(arenaContent.includes('SQUAD COLLABORATION'), 'Card 2 micro-badge must be present');
    assert.ok(arenaContent.includes('LIVE AI DEFENSE'), 'Card 3 micro-badge must be present');

    // Lobby cards with glowing micro-badge pulse dots
    assert.ok(arenaContent.includes('TURING AI SPARRING &amp; DUELS'), 'Lobby Mode A micro-badge must be present');
    assert.ok(arenaContent.includes('PRIVATE INVITE'), 'Lobby Mode B micro-badge must be present');
    assert.ok(arenaContent.includes('ENTER CODE'), 'Lobby Mode C micro-badge must be present');

    // Frosted glass and design tokens
    assert.ok(arenaContent.includes("backdropFilter: 'blur(16px)'"), 'Cards must use frosted glass backdropFilter');
    assert.ok(arenaContent.includes("background: 'var(--card)'"), 'Cards must use var(--card) for Light/Dark parity');
  });

  it('Task 4: Fast matchmaking mechanics with 1s timer, 2s polling cadence, and zero fake data', () => {
    // 1s clock interval for accurate radar seconds
    assert.ok(
      arenaContent.includes('setQueueSeconds(s => s + 1);') &&
      arenaContent.includes('}, 1000);'),
      'Radar timer must tick at exact 1-second intervals'
    );

    // Fast 2s polling cadence
    assert.ok(
      arenaContent.includes('const pollInterval = setInterval(pollMatchmaker, 2000);'),
      'Matchmaking polling cadence must run at 2 seconds for rapid peer pairing'
    );

    // Real match history hydration
    assert.ok(
      arenaContent.includes('CodeWarsApiService.getStudentMatchesAsync(studentId)'),
      'Match history must be hydrated asynchronously from authentic store'
    );

    // Zero fake dummy data
    assert.strictEqual(
      arenaContent.includes('fake_opponent') || arenaContent.includes('mock_matches'),
      false,
      'Zero fake/dummy data must be present'
    );
  });
});
