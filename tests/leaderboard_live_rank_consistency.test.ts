import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { rankLeagueEntries } from '../src/lib/leagues/leaguePoints';

const root = path.join(__dirname, '..');

type Entry = {
  rank: number;
  studentId: string;
  weeklyXp: number;
  arenaPoints: number;
  leaguePoints: number;
  totalXp: number;
  zone: 'promotion' | 'safe' | 'demotion';
};

function entry(studentId: string, weeklyXp: number, arenaPoints: number, totalXp = 0): Entry {
  return { rank: 0, studentId, weeklyXp, arenaPoints, leaguePoints: -999, totalXp, zone: 'safe' };
}

test('visible rank follows the League Points shown in the same row', () => {
  const ranked = rankLeagueEntries([
    entry('vinay', 400, 0),
    entry('sanskar', 150, 0),
    entry('student', 150, 0),
    entry('arjun', 100, 0),
    entry('student-2', 100, 0),
    entry('current-user', 150, 50),
  ], 'browns', 1, 0);

  const currentUser = ranked.find(row => row.studentId === 'current-user');
  assert.equal(currentUser?.leaguePoints, 200);
  assert.equal(currentUser?.rank, 2);
  assert.deepEqual(ranked.map(row => row.rank), [1, 2, 3, 4, 5, 6]);
  assert.deepEqual(ranked.map(row => row.leaguePoints), [400, 200, 150, 150, 100, 100]);
});

test('equal League Points use stable weekly XP, career XP, then student ID tie-breakers', () => {
  const ranked = rankLeagueEntries([
    entry('lower-weekly', 100, 100, 900),
    entry('higher-career', 150, 50, 1200),
    entry('higher-weekly', 180, 20, 500),
    entry('same-score-a', 150, 50, 1200),
  ], 'silver', 1, 4);

  assert.deepEqual(ranked.map(row => row.studentId), [
    'higher-weekly',
    'higher-career',
    'same-score-a',
    'lower-weekly',
  ]);
  assert.deepEqual(ranked.map(row => row.zone), ['promotion', 'safe', 'safe', 'demotion']);
});

test('API and live client refresh recalculate the row order after a score update', () => {
  const route = fs.readFileSync(path.join(root, 'src/app/api/leaderboard/route.ts'), 'utf8');
  const page = fs.readFileSync(path.join(root, 'src/app/leaderboard/page.tsx'), 'utf8');

  assert.match(route, /entries\.push\(currentUserEntry\);[\s\S]*rankLeagueEntries\(/);
  assert.match(page, /leaguePoints: weeklyXp \+ arenaPoints,[\s\S]*rankLeagueEntries\(/);
  assert.match(page, /Keep the visible score, row order, and rank in one optimistic update/);
});
