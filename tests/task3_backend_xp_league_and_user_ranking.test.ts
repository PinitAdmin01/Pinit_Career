import test from 'node:test';
import assert from 'node:assert';
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const leaderboardPagePath = path.join(ROOT, 'src/app/leaderboard/page.tsx');
const leaderboardRoutePath = path.join(ROOT, 'src/app/api/leaderboard/route.ts');

const leaderboardPage = fs.readFileSync(leaderboardPagePath, 'utf8');
const leaderboardRoute = fs.readFileSync(leaderboardRoutePath, 'utf8');

test('TASK 3 AUDIT: Backend leaderboard extracts user identification from headers and params', () => {
  assert.ok(
    leaderboardRoute.includes("req.headers.get('x-user-id')"),
    'Backend must accept x-user-id header'
  );
  assert.ok(
    leaderboardRoute.includes("url.searchParams.get('userId')"),
    'Backend must accept userId search parameter'
  );
});

test('TASK 3 AUDIT: Backend off-cohort rank computation appends user to entries so they appear in table', () => {
  assert.ok(
    leaderboardRoute.includes('entries.push(currentUserEntry);'),
    'Backend must push off-cohort currentUserEntry into entries'
  );
  assert.ok(
    leaderboardRoute.includes('currentUser: currentUserEntry,'),
    'Backend must return currentUser object in response'
  );
});

test('TASK 3 AUDIT: Frontend joins Browns through the qualified server endpoint', () => {
  assert.ok(
    leaderboardPage.includes("fetch('/api/leaderboard/join'"),
    'handleJoinLeague must persist league membership through the server endpoint'
  );
  assert.ok(leaderboardPage.includes('userTotalXp < 100'), 'Joining requires at least 100 lifetime Career XP');
  assert.ok(
    leaderboardPage.includes("pinit:user_profile_updated"),
    'handleJoinLeague must dispatch pinit:user_profile_updated event'
  );
});

test('TASK 3 AUDIT: Frontend stores serverCurrentUser and ensures user always appears in leaderboard table', () => {
  assert.ok(
    leaderboardPage.includes('setServerCurrentUser(data.currentUser);'),
    'Frontend must save data.currentUser into serverCurrentUser state'
  );
  assert.ok(
    leaderboardPage.includes('return serverCurrentUser;'),
    'currentUserEntry must fall back to serverCurrentUser'
  );
  assert.ok(
    leaderboardPage.includes('params.set(\'userId\', user.id);'),
    'Frontend fetchLeaderboard must pass userId query parameter'
  );
  assert.ok(leaderboardPage.includes('const result = list.filter(entry => {'), 'Search must filter the full leaderboard response');
  assert.ok(leaderboardPage.includes('filteredEntries.map((entry, idx) => {'), 'The current user entry returned by the server must render in the standings table');
});
