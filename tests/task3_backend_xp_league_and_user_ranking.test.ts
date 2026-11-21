import test from 'node:test';
import assert from 'node:assert';
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const leaderboardPagePath = path.join(ROOT, 'src/app/leaderboard/page.tsx');
const leaderboardRoutePath = path.join(ROOT, 'src/app/api/leaderboard/route.ts');

const leaderboardPage = fs.readFileSync(leaderboardPagePath, 'utf8');
const leaderboardRoute = fs.readFileSync(leaderboardRoutePath, 'utf8');

test('TASK 3 AUDIT: Leaderboard uses verified identity in production and fences local ID fallback', () => {
  assert.ok(
    leaderboardRoute.includes('const gated = await requireUserFromRequest(req);'),
    'Backend must identify the current user from a verified session'
  );
  assert.ok(
    leaderboardRoute.includes("process.env.NODE_ENV !== 'production' && process.env.ALLOW_DEV_AUTH_BYPASS === 'true'"),
    'Client-supplied IDs are allowed only in explicitly enabled non-production test mode'
  );
  assert.ok(
    leaderboardRoute.includes("req.headers.get('x-user-id')") && leaderboardRoute.includes("url.searchParams.get('userId')"),
    'Local test identity fallbacks remain available inside the non-production guard'
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
    leaderboardPage.includes('setServerCurrentUser(responseCurrentUser);'),
    'Frontend must save the rank-reconciled API current user into serverCurrentUser state'
  );
  assert.ok(
    leaderboardPage.includes('return serverCurrentUser;'),
    'currentUserEntry must fall back to serverCurrentUser'
  );
  assert.ok(
    leaderboardPage.includes("params.set('userId', membershipUserId);"),
    'Frontend may pass its identity hint, while the production server trusts only the verified bearer session'
  );
  assert.ok(leaderboardPage.includes('const result = list.filter(entry => {'), 'Search must filter the full leaderboard response');
  assert.ok(leaderboardPage.includes('filteredEntries.map((entry, idx) => {'), 'The current user entry returned by the server must render in the standings table');
});
