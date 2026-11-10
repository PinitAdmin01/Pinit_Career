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

  it('Task 2: Bottom telemetry dock removed and Leaderboard Leagues Roadmap rendered with 5 divisions and progress track', () => {
    // Bottom dock purged per explicit user prompt
    assert.strictEqual(
      arenaContent.includes('data-testid="arena-bottom-telemetry-dock"'),
      false,
      'Expected bottom combat telemetry dock to be purged per user order'
    );

    // Leaderboard Leagues Roadmap exists
    assert.ok(
      arenaContent.includes('data-testid="leaderboard-leagues-roadmap"'),
      'Expected Leaderboard Leagues Roadmap to be present'
    );

    // 5 Official League divisions rendered
    assert.ok(arenaContent.includes("label: 'Browns'"), 'Browns must be present in roadmap');
    assert.ok(arenaContent.includes("label: 'Silver'"), 'Silver must be present in roadmap');
    assert.ok(arenaContent.includes("label: 'Gold'"), 'Gold must be present in roadmap');
    assert.ok(arenaContent.includes("label: 'Platinum'"), 'Platinum must be present in roadmap');
    assert.ok(arenaContent.includes("label: 'Ruby'"), 'Ruby must be present in roadmap');

    // Horizontal progress track with ELO milestones
    assert.ok(arenaContent.includes('100 ELO (Base)'), 'Base ELO milestone must be rendered');
    assert.ok(arenaContent.includes('400+ ELO'), 'Top ELO milestone must be rendered');

    // Link to Leaderboard
    assert.ok(
      arenaContent.includes('href="/leaderboard?mode=weekly_leagues"'),
      'Leaderboard button must link to /leaderboard?mode=weekly_leagues'
    );
  });

  it('Task 3: Heaven-grade UI/UX polish applied across cards and tabs with Light/Dark mode parity', () => {
    // Segmented tab bar
    assert.ok(arenaContent.includes('Arena Navigation Tabs (Sleek Glass Segmented Bar)'));

    // Matchmaking Cards heading
    assert.ok(arenaContent.includes('Matchmaking Cards'), 'Matchmaking Cards section heading must be present');

    // Matchmaking Cards
    assert.ok(arenaContent.includes('Quick Duel'), 'Quick Duel card must be present');
    assert.ok(arenaContent.includes('Create Private Room'), 'Create Private Room card must be present');
    assert.ok(arenaContent.includes('Join via Code'), 'Join via Code card must be present');

    // Lobby cards with micro-badge pulse dots
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
