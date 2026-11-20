import { describe, it } from 'node:test';
import assert from 'node:assert';
import fs from 'fs';
import path from 'path';

describe('Arena lobby, standings link, and scoring rules', () => {
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

  it('keeps the lobby focused on duels and links directly to League Point standings', () => {
    // Bottom dock purged per explicit user prompt
    assert.strictEqual(
      arenaContent.includes('data-testid="arena-bottom-telemetry-dock"'),
      false,
      'Expected bottom combat telemetry dock to be purged per user order'
    );

    // The Arena keeps score details brief and links to the combined standings screen.
    assert.ok(
      arenaContent.includes('data-testid="arena-league-note"'),
      'Expected the concise Arena standings note to be present'
    );
    assert.ok(arenaContent.includes('href="/leaderboard?mode=global"'), 'Arena must open the global League Points board');
    assert.ok(arenaContent.includes('Arena wins add Arena Points to your League Points.'));
  });

  it('keeps private-room actions and removes the matchmaking queue card', () => {
    assert.ok(arenaContent.includes('<CompetitionNavigation active="arena"'), 'Arena and standings share the competition navigation');
    assert.ok(arenaContent.includes('Challenge a friend'), 'Private battle card must be present');
    assert.ok(arenaContent.includes('Join a battle'), 'Room-code join card must be present');
    assert.ok(!arenaContent.includes('Quick Duel'), 'Removed queue matchmaking card must stay absent');
    assert.ok(!arenaContent.includes('Instant Queue'), 'Removed instant-queue action must stay absent');
    assert.ok(arenaContent.includes('PRIVATE BATTLE'), 'Private-room micro-badge must be present');
    assert.ok(arenaContent.includes('INVITE CODE'), 'Room-code micro-badge must be present');
    assert.ok(arenaContent.includes("background: 'var(--card)'"), 'Cards must use var(--card) for Light/Dark parity');
  });

  it('hydrates real match history without reintroducing fake queue state', () => {
    assert.ok(
      arenaContent.includes('CodeWarsApiService.getStudentMatchesAsync(studentId)'),
      'Match history must be hydrated asynchronously from authentic store'
    );
    assert.ok(!arenaContent.includes('setQueueSeconds'), 'Removed queue timer must stay absent');
    assert.ok(!arenaContent.includes('pollMatchmaker'), 'Removed matchmaking polling must stay absent');
    assert.strictEqual(
      arenaContent.includes('fake_opponent') || arenaContent.includes('mock_matches'),
      false,
      'Zero fake/dummy data must be present'
    );
  });

  it('never enters or exits browser fullscreen when a match starts or state changes', () => {
    assert.ok(
      !arenaContent.includes('pinit-arena-duel-toggle') && !arenaContent.includes('__pinitArenaDuelActive'),
      'Arena match state must not control global gaming or focus mode'
    );
    assert.ok(
      arenaContent.includes('requestFullscreen.call(rootAny)'),
      'Fullscreen should only be requested from the explicit Arena control'
    );
    assert.ok(
      !/useEffect\(\(\) => \{[\s\S]*?requestFullscreen[\s\S]*?\}, \[activeRoom, soloMatch\]\);/.test(arenaContent),
      'A match-state effect must not request browser fullscreen'
    );
    assert.ok(
      arenaContent.includes("title={isArenaFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}"),
      'The player must retain a visible, intentional fullscreen control'
    );
    assert.ok(
      arenaContent.includes('setIsArenaFullscreen(Boolean(document.fullscreenElement || docAny.webkitFullscreenElement))') &&
      arenaContent.includes('🎮 FULLSCREEN ACTIVE · PRESS ESC TO EXIT'),
      'Fullscreen status shown to the player must follow the browser state'
    );
  });
});
