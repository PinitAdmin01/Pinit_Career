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
    assert.ok(arenaContent.includes('PvP wins add Arena Points to your League Points. AI practice never changes your competitive stats.'));
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

  it('keeps AI practice reward-free and does not force the app into gaming mode', () => {
    const appShell = fs.readFileSync(path.resolve('src/components/ui/AppShell.tsx'), 'utf8');
    const codeWarsService = fs.readFileSync(path.resolve('src/lib/api/codeWarsApi.ts'), 'utf8');
    const evaluateRoute = fs.readFileSync(path.resolve('src/app/api/code/evaluate/route.ts'), 'utf8');
    const globalStyles = fs.readFileSync(path.resolve('src/styles/globals.css'), 'utf8');

    assert.ok(arenaContent.includes('Turing AI Practice'), 'The lobby must identify the bot match as practice');
    assert.ok(arenaContent.includes('Practice results never change your ELO, Arena Points, XP, or ranked stats.'));
    assert.ok(arenaContent.includes('rewardEligible: Boolean(activeRoom)'), 'Only private PvP submissions can earn rewards');
    assert.ok(arenaContent.includes('TURING AI PRACTICE · RATINGS UNCHANGED'));
    assert.ok(arenaContent.includes("soloMatch ? 'ELO · NO CHANGE' : 'ELO RATING'"));
    assert.ok(arenaContent.includes("soloMatch ? 'ARENA POINTS · NONE' : 'ARENA POINTS'"));
    assert.ok(arenaContent.includes('10 Pin entry fee was charged when the match started'));

    assert.ok(!arenaContent.includes('data-arena-active'));
    assert.ok(!arenaContent.includes('pinit-arena-duel-toggle'));
    assert.ok(!appShell.includes('isArenaDuelActive'));
    assert.ok(!appShell.includes('pinit-arena-duel-toggle'));
    assert.ok(!globalStyles.includes('data-arena-active'));
    assert.ok(!arenaContent.includes('GAMING MODE ACTIVE · 100% IMMERSIVE'));
    assert.ok(arenaContent.includes('rootAny.requestFullscreen'), 'Fullscreen remains available through the explicit user control');
    assert.ok(arenaContent.includes('aria-pressed={isArenaFullscreen}'), 'The fullscreen control reflects the browser state');

    assert.ok(codeWarsService.includes('rewardEligible?: boolean'));
    assert.ok(codeWarsService.includes('if (passed) {'), 'Practice wins must remain wins in match history');
    assert.ok(codeWarsService.includes('if (rewardEligible) {'), 'Practice passes must skip portfolio evidence');
    assert.ok(evaluateRoute.includes(".from('arena_solo_matches')"));
    assert.ok(evaluateRoute.includes("rewardEligible = false"), 'The server must deny rewards for bot matches and failed match verification');
    assert.ok(evaluateRoute.includes('MATCH_PROBLEM_MISMATCH'), 'A client cannot evaluate a different challenge under a saved practice match');
    assert.ok(evaluateRoute.includes('hasOwnProperty.call(CODEWARS_PROBLEM_REGISTRY'), 'Inherited property names must not pass problem validation');
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
      arenaContent.includes('aria-pressed={isArenaFullscreen}') &&
      arenaContent.includes('webkitfullscreenchange'),
      'The explicit fullscreen control must reflect actual browser fullscreen state'
    );
  });
});
