import test from 'node:test';
import assert from 'node:assert/strict';
import {
  findTeamSizes,
  formTeams,
  type TeamQueueEntry,
} from '../src/lib/internships/teams';

function makeQueue(count: number, baseDate: Date, offsetDaysPerStudent = 0): TeamQueueEntry[] {
  return Array.from({ length: count }, (_, i) => {
    const joined = new Date(baseDate.getTime() + i * offsetDaysPerStudent * 24 * 60 * 60 * 1000);
    return {
      studentId: `student-${i + 1}`,
      enrollmentId: `enrollment-${i + 1}`,
      joinedQueueAt: joined.toISOString(),
      track: 'python_ai',
      displayName: `Student ${i + 1}`,
    };
  });
}

test('findTeamSizes calculates optimal partitions for bounded team sizes', () => {
  assert.deepEqual(findTeamSizes(0), []);
  assert.deepEqual(findTeamSizes(1), []);
  assert.deepEqual(findTeamSizes(2), []);
  assert.deepEqual(findTeamSizes(3), [3]);
  assert.deepEqual(findTeamSizes(4), [4]);
  assert.deepEqual(findTeamSizes(5), [4]);
  assert.deepEqual(findTeamSizes(6), [3, 3]);
  assert.deepEqual(findTeamSizes(7), [4, 3]);
  assert.deepEqual(findTeamSizes(8), [4, 4]);
  assert.deepEqual(findTeamSizes(9), [3, 3, 3]);
  assert.deepEqual(findTeamSizes(10), [4, 3, 3]);
  assert.deepEqual(findTeamSizes(11), [4, 4, 3]);
  assert.deepEqual(findTeamSizes(12), [4, 4, 4]);
});

test('T-24: 1 student - stays in queue if < 7 days, goes solo if >= 7 days', () => {
  const now = new Date('2026-10-15T12:00:00Z');

  // Case A: Joined 3 days ago (< 7 days) -> Remains in leftovers queue
  const recentQueue: TeamQueueEntry[] = [
    {
      studentId: 's1',
      enrollmentId: 'e1',
      joinedQueueAt: new Date('2026-10-12T12:00:00Z').toISOString(),
    },
  ];
  const resRecent = formTeams(recentQueue, 7, 3, 4, { now });
  assert.equal(resRecent.teams.length, 0, 'No team should be formed yet');
  assert.equal(resRecent.leftovers.length, 1, 'Should remain in leftovers queue');
  assert.equal(resRecent.leftovers[0].studentId, 's1');

  // Case B: Joined 8 days ago (>= 7 days) -> Leftover goes solo
  const expiredQueue: TeamQueueEntry[] = [
    {
      studentId: 's1',
      enrollmentId: 'e1',
      joinedQueueAt: new Date('2026-10-07T10:00:00Z').toISOString(),
    },
  ];
  const resExpired = formTeams(expiredQueue, 7, 3, 4, { now });
  assert.equal(resExpired.teams.length, 1, 'Should form 1 solo team');
  assert.equal(resExpired.teams[0].isSolo, true, 'Team should be solo');
  assert.equal(resExpired.teams[0].members.length, 1, 'Solo team has 1 member');
  assert.equal(resExpired.teams[0].members[0].studentId, 's1');
  assert.equal(resExpired.leftovers.length, 0, 'Leftovers queue should be empty');
});

test('T-24: 3 students - immediately form 1 collaborative team of 3', () => {
  const now = new Date('2026-10-15T12:00:00Z');
  const queue = makeQueue(3, new Date('2026-10-14T10:00:00Z'));

  const res = formTeams(queue, 7, 3, 4, { now });

  assert.equal(res.teams.length, 1, 'Exactly 1 team formed');
  assert.equal(res.teams[0].isSolo, false, 'Collaborative team');
  assert.equal(res.teams[0].members.length, 3, 'Team size is 3');
  assert.equal(res.leftovers.length, 0, 'Zero leftovers');
});

test('T-24: 5 students - forms 1 team of 4, remaining student stays or goes solo based on 7-day rule', () => {
  const now = new Date('2026-10-15T12:00:00Z');

  // Case A: All 5 joined within 2 days (< 7 days)
  const recentQueue = makeQueue(5, new Date('2026-10-14T10:00:00Z'));
  const resRecent = formTeams(recentQueue, 7, 3, 4, { now });

  assert.equal(resRecent.teams.length, 1, '1 team formed');
  assert.equal(resRecent.teams[0].isSolo, false);
  assert.equal(resRecent.teams[0].members.length, 4, '1 team of 4 formed');
  assert.equal(resRecent.leftovers.length, 1, '1 student left waiting in queue');
  assert.equal(resRecent.leftovers[0].studentId, 'student-5');

  // Case B: The 5th student joined 9 days ago (>= 7 days)
  const mixedQueue: TeamQueueEntry[] = [
    { studentId: 's1', enrollmentId: 'e1', joinedQueueAt: '2026-10-14T10:00:00Z' },
    { studentId: 's2', enrollmentId: 'e2', joinedQueueAt: '2026-10-14T11:00:00Z' },
    { studentId: 's3', enrollmentId: 'e3', joinedQueueAt: '2026-10-14T12:00:00Z' },
    { studentId: 's4', enrollmentId: 'e4', joinedQueueAt: '2026-10-14T13:00:00Z' },
    // 5th student joined 9 days ago
    { studentId: 's5', enrollmentId: 'e5', joinedQueueAt: '2026-10-06T10:00:00Z' },
  ];
  const resMixed = formTeams(mixedQueue, 7, 3, 4, { now });

  // Note: s5 is the oldest, so FIFO puts s5 into the collaborative team of 4!
  // The leftover student will be s4 (who joined recently), so s4 waits.
  assert.equal(resMixed.teams.length, 1);
  assert.equal(resMixed.teams[0].members.some((m) => m.studentId === 's5'), true, 'Oldest student s5 prioritized');
  assert.equal(resMixed.leftovers.length, 1);
  assert.equal(resMixed.leftovers[0].studentId, 's4');
});

test('T-24: 7 students - forms 2 collaborative teams (sizes 4 and 3)', () => {
  const now = new Date('2026-10-15T12:00:00Z');
  const queue = makeQueue(7, new Date('2026-10-13T10:00:00Z'));

  const res = formTeams(queue, 7, 3, 4, { now });

  assert.equal(res.teams.length, 2, 'Exactly 2 teams formed');
  assert.equal(res.teams[0].isSolo, false);
  assert.equal(res.teams[1].isSolo, false);

  const teamSizes = res.teams.map((t) => t.members.length).sort((a, b) => b - a);
  assert.deepEqual(teamSizes, [4, 3], 'Teams of 4 and 3 formed');
  assert.equal(res.leftovers.length, 0, 'Zero leftovers');
});

test('T-24: 8 students - forms 2 collaborative teams of 4', () => {
  const now = new Date('2026-10-15T12:00:00Z');
  const queue = makeQueue(8, new Date('2026-10-12T10:00:00Z'));

  const res = formTeams(queue, 7, 3, 4, { now });

  assert.equal(res.teams.length, 2, 'Exactly 2 teams formed');
  assert.equal(res.teams[0].isSolo, false);
  assert.equal(res.teams[1].isSolo, false);
  assert.equal(res.teams[0].members.length, 4, 'Team 1 has 4 members');
  assert.equal(res.teams[1].members.length, 4, 'Team 2 has 4 members');
  assert.equal(res.leftovers.length, 0, 'Zero leftovers');
});

test('T-24: FIFO sorting prioritizes students waiting longest', () => {
  const now = new Date('2026-10-15T12:00:00Z');
  const unsortedQueue: TeamQueueEntry[] = [
    { studentId: 'late-3', enrollmentId: 'e3', joinedQueueAt: '2026-10-14T10:00:00Z' },
    { studentId: 'early-1', enrollmentId: 'e1', joinedQueueAt: '2026-10-10T10:00:00Z' },
    { studentId: 'mid-2', enrollmentId: 'e2', joinedQueueAt: '2026-10-12T10:00:00Z' },
    { studentId: 'newest-4', enrollmentId: 'e4', joinedQueueAt: '2026-10-15T09:00:00Z' },
  ];

  const res = formTeams(unsortedQueue, 7, 3, 4, { now });

  assert.equal(res.teams.length, 1);
  assert.equal(res.teams[0].members.length, 4);
  const orderedIds = res.teams[0].members.map((m) => m.studentId);
  assert.deepEqual(orderedIds, ['early-1', 'mid-2', 'late-3', 'newest-4'], 'Strict FIFO ordering');
});
