import test from 'node:test';
import assert from 'node:assert';
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const leaderboardPagePath = path.join(ROOT, 'src/app/leaderboard/page.tsx');
const leaderboardRoutePath = path.join(ROOT, 'src/app/api/leaderboard/route.ts');

const leaderboardPage = fs.readFileSync(leaderboardPagePath, 'utf8');
const leaderboardRoute = fs.readFileSync(leaderboardRoutePath, 'utf8');

test('TASK 1 AUDIT: Backend leaderboard route purges all hardcoded dummy guilds', () => {
  const dummySquadNames = [
    'ByteCraft Autonomous Systems',
    'NeuralEdge Labs',
    'Argon Cyber Sentinels',
    'Fullstack Hyperloop Guild',
    'guild_01',
    'guild_02',
    'guild_03',
    'guild_04'
  ];

  for (const dummy of dummySquadNames) {
    assert.strictEqual(
      leaderboardRoute.includes(dummy),
      false,
      `Leaderboard route must not contain hardcoded dummy squad: "${dummy}"`
    );
  }
});

test('TASK 1 AUDIT: Backend queries authentic hackathon_squads table or defaults to empty array', () => {
  assert.ok(
    leaderboardRoute.includes("from('hackathon_squads')"),
    'Backend must query authentic hackathon_squads table'
  );
  assert.ok(
    leaderboardRoute.includes('let guilds: GuildLeaderboardEntry[] = [];'),
    'Backend must initialize guilds as an empty array []'
  );
  assert.ok(
    leaderboardRoute.includes('guilds = [];'),
    'Backend must fall back to empty array [] on error'
  );
});

test('TASK 1 AUDIT: Frontend leaderboard renders empty state with link to projects when squads list is empty', () => {
  assert.ok(
    leaderboardPage.includes('guilds.length === 0 ? ('),
    'Frontend must check guilds.length === 0'
  );
  assert.ok(
    leaderboardPage.includes('No Active Student Guild Squads This Sprint'),
    'Frontend must render informative empty state message'
  );
  assert.ok(
    leaderboardPage.includes('href="/projects"'),
    'Frontend must provide direct navigation to /projects'
  );
});
