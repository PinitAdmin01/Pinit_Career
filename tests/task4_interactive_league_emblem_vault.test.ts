import test from 'node:test';
import assert from 'node:assert';
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const leaderboardPagePath = path.join(ROOT, 'src/app/leaderboard/page.tsx');
const leaderboardPage = fs.readFileSync(leaderboardPagePath, 'utf8');

test('TASK 4 AUDIT: Bulky static row of 5 league cards is removed from inline page layout', () => {
  assert.strictEqual(
    leaderboardPage.includes('Inspect League Division:'),
    false,
    'Static "Inspect League Division:" text must be removed from inline page flow'
  );
});

test('TASK 4 AUDIT: Active League emblem is an interactive launcher button in the Cockpit HUD', () => {
  assert.ok(
    leaderboardPage.includes('data-testid="interactive-league-emblem-btn"'),
    'Active league emblem must be an interactive launcher button'
  );
  assert.ok(
    leaderboardPage.includes('setIsLeagueModalOpen(true)'),
    'Clicking the league emblem must open the Division Vault modal'
  );
  assert.ok(
    leaderboardPage.includes('Switch ▾'),
    'Emblem launcher must display switch pill indicator'
  );
});

test('TASK 4 AUDIT: Game-dev League Division Vault modal contains all 5 tiers with selection handlers', () => {
  assert.ok(
    leaderboardPage.includes('data-testid="league-division-modal-overlay"'),
    'Modal overlay must be present'
  );
  assert.ok(
    leaderboardPage.includes('data-testid="league-division-modal"'),
    'Modal container must be present'
  );
  assert.ok(
    leaderboardPage.includes('Competitive Division Vault'),
    'Modal must have competitive vault title'
  );
  assert.ok(
    leaderboardPage.includes('data-testid="close-league-modal-btn"'),
    'Modal must have close button'
  );

  const tiers = ['browns', 'silver', 'gold', 'platinum', 'ruby'];
  for (const tier of tiers) {
    assert.ok(
      leaderboardPage.includes(`data-testid={\`select-league-\${tier}\`}`),
      `Division vault must include selection button for ${tier}`
    );
  }
});

test('TASK 4 AUDIT: Selecting a division updates active tier, switches tab if needed, and closes modal', () => {
  assert.ok(
    leaderboardPage.includes('setSelectedLeague(tier);'),
    'Selecting division must update selectedLeague state'
  );
  assert.ok(
    leaderboardPage.includes('setIsLeagueModalOpen(false);'),
    'Selecting division must close modal'
  );
});
