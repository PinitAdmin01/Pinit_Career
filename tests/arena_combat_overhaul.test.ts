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

    // The Arena explains the score and links to the combined standings screen.
    assert.ok(
      arenaContent.includes('data-testid="league-points-rules"'),
      'Expected the League Points rules to be present'
    );
    assert.ok(arenaContent.includes('League Points = Learning XP + Arena Points'));
    assert.ok(arenaContent.includes('href="/leaderboard?mode=global"'), 'Arena must open the global League Points board');
    assert.ok(arenaContent.includes('Arena Points = half your pre-match ELO'));
    assert.ok(arenaContent.includes('ELO never changes placement'));
  });

  it('keeps private-room actions and removes the matchmaking queue card', () => {
    assert.ok(arenaContent.includes('<CompetitionNavigation active="arena"'), 'Arena and standings share the competition navigation');
    assert.ok(arenaContent.includes('Create Private Room'), 'Create Private Room card must be present');
    assert.ok(arenaContent.includes('Join via Code'), 'Join via Code card must be present');
    assert.ok(!arenaContent.includes('Quick Duel'), 'Removed queue matchmaking card must stay absent');
    assert.ok(!arenaContent.includes('Instant Queue'), 'Removed instant-queue action must stay absent');
    assert.ok(arenaContent.includes('PRIVATE INVITE'), 'Lobby Mode B micro-badge must be present');
    assert.ok(arenaContent.includes('ENTER CODE'), 'Lobby Mode C micro-badge must be present');
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
});
