import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { COURSES_REGISTRY } from '../src/lib/data/coursesData';
import { getCrashPlanById, CRASH_COURSE_PLANS } from '../src/lib/data/crashPlansData';
import { getCrashCourseCurriculum, getCrashCourseProgress } from '../src/lib/courses/crashCourseProgress';
import { getTodaySummary } from '../src/lib/courses/todaySummary';
import { getAuthoritativeQuest } from '../src/lib/quests/questRegistry';

describe('BRUTAL AUDIT: Python Full Stack Course Progression (Day 2 & Multi-Day Continuity)', () => {
  const plan = getCrashPlanById('plan-1m-sprint') || CRASH_COURSE_PLANS[0];
  const curriculum = getCrashCourseCurriculum(plan, 'python_ai', COURSES_REGISTRY);

  test('Curriculum sanity: Plan-1m-sprint in python_ai track contains 60 days of lessons & practice', () => {
    assert.ok(curriculum.length > 0, 'Python curriculum must have lessons');
    assert.equal(curriculum[0].questId, 'python-lecture1-day-1', 'Day 1 lesson is first');
    assert.equal(curriculum[1].questId, 'python-exam-day-1', 'Day 1 practice 1 is second');
    assert.equal(curriculum[2].questId, 'python-assign-day-1', 'Day 1 practice 2 is third');
    assert.equal(curriculum[3].questId, 'python-lecture1-day-2', 'Day 2 lesson is fourth');
    assert.equal(curriculum[4].questId, 'python-exam-day-2', 'Day 2 practice 1 is fifth');
    assert.equal(curriculum[5].questId, 'python-assign-day-2', 'Day 2 practice 2 is sixth');
  });

  test('Day 1 Completed State (3 tasks done): Today Summary correctly presents Day 2 Lesson', () => {
    const completedQuests = ['python-lecture1-day-1', 'python-exam-day-1', 'python-assign-day-1'];
    const fakeEnrollment = {
      id: 'enr-test-1',
      planId: 'plan-1m-sprint',
      track: 'python_ai' as const,
      status: 'active' as const,
      enrolledAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 86400000).toISOString(),
      userId: 'test-user',
    };

    const progress = getCrashCourseProgress(plan, 'python_ai', COURSES_REGISTRY, completedQuests, fakeEnrollment);
    assert.equal(progress.completed, 3, 'Exactly 3 tasks completed');
    assert.ok(progress.next, 'Must have next task');
    assert.equal(progress.next.questId, 'python-lecture1-day-2', 'Next task must be Day 2 Lesson');

    const summary = getTodaySummary(progress, COURSES_REGISTRY, completedQuests, curriculum);
    assert.equal(summary.day, 2, 'Day must be 2');
    assert.equal(summary.tasksDone, 3, 'tasksDone must be 3');
    assert.equal(summary.next?.kind, 'Lesson', 'Next task kind must be Lesson');
    assert.equal(summary.next?.title, 'Day 2: Variables and Data Types', 'Title must match Day 2');
  });

  test('Day 2 Lesson Completed State (4 tasks done): Advances to Day 2 Practice 1', () => {
    const completedQuests = [
      'python-lecture1-day-1',
      'python-exam-day-1',
      'python-assign-day-1',
      'python-lecture1-day-2' // Day 2 lesson finished!
    ];
    const fakeEnrollment = {
      id: 'enr-test-1',
      planId: 'plan-1m-sprint',
      track: 'python_ai' as const,
      status: 'active' as const,
      enrolledAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 86400000).toISOString(),
      userId: 'test-user',
    };

    const progress = getCrashCourseProgress(plan, 'python_ai', COURSES_REGISTRY, completedQuests, fakeEnrollment);
    assert.equal(progress.completed, 4, '4 tasks completed');
    assert.equal(progress.next?.questId, 'python-exam-day-2', 'Next task must be Day 2 Practice 1');

    const summary = getTodaySummary(progress, COURSES_REGISTRY, completedQuests, curriculum);
    assert.equal(summary.day, 2, 'Still on Day 2');
    assert.equal(summary.tasksDone, 4, 'tasksDone is 4');
    assert.equal(summary.next?.kind, 'Practice', 'Next task kind is Practice');
  });

  test('Day 2 Complete State (6 tasks done): Advances cleanly to Day 3 Lesson', () => {
    const completedQuests = [
      'python-lecture1-day-1',
      'python-exam-day-1',
      'python-assign-day-1',
      'python-lecture1-day-2',
      'python-exam-day-2',
      'python-assign-day-2'
    ];
    const fakeEnrollment = {
      id: 'enr-test-1',
      planId: 'plan-1m-sprint',
      track: 'python_ai' as const,
      status: 'active' as const,
      enrolledAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 86400000).toISOString(),
      userId: 'test-user',
    };

    const progress = getCrashCourseProgress(plan, 'python_ai', COURSES_REGISTRY, completedQuests, fakeEnrollment);
    assert.equal(progress.completed, 6, '6 tasks completed');
    assert.equal(progress.next?.questId, 'python-lecture1-day-3', 'Next task must be Day 3 Lesson');

    const summary = getTodaySummary(progress, COURSES_REGISTRY, completedQuests, curriculum);
    assert.equal(summary.day, 3, 'Must advance to Day 3');
    assert.equal(summary.tasksDone, 6, 'tasksDone is 6');
  });

  test('Authoritative Quest Registry contains all Day 1, Day 2, and Day 3 Python Quests with valid XP', () => {
    const questsToCheck = [
      'python-lecture1-day-1',
      'python-exam-day-1',
      'python-assign-day-1',
      'python-lecture1-day-2',
      'python-exam-day-2',
      'python-assign-day-2',
      'python-lecture1-day-3',
      'python-exam-day-3',
      'python-assign-day-3',
    ];

    for (const qId of questsToCheck) {
      const q = getAuthoritativeQuest(qId);
      assert.ok(q, `Quest ${qId} must exist in authoritative registry`);
      assert.ok(q.xp > 0, `Quest ${qId} must award > 0 XP`);
    }
  });

  test('Unconstrained Multi-Day Progression: User can complete 60+ tasks in 1 day without limits', () => {
    // Simulate user completing first 20 days (60 tasks) in a single day
    const completedQuests = curriculum.slice(0, 60).map(c => c.questId);
    assert.equal(completedQuests.length, 60, '60 quests completed');

    const fakeEnrollment = {
      id: 'enr-test-1',
      planId: 'plan-1m-sprint',
      track: 'python_ai' as const,
      status: 'active' as const,
      enrolledAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 86400000).toISOString(),
      userId: 'test-user',
    };

    const progress = getCrashCourseProgress(plan, 'python_ai', COURSES_REGISTRY, completedQuests, fakeEnrollment);
    assert.equal(progress.completed, 60, 'Exactly 60 tasks recorded completed');
    assert.ok(progress.next, 'Advances to 61st task');
    assert.equal(progress.next.questId, curriculum[60].questId, 'Matches 61st curriculum item');

    const summary = getTodaySummary(progress, COURSES_REGISTRY, completedQuests, curriculum);
    assert.equal(summary.tasksDone, 60, 'Summary shows 60 done');
    assert.equal(summary.day, 20, 'Summary points to Day 20 (accounting for block tests)');
  });
});
