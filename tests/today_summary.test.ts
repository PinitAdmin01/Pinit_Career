import test from 'node:test';
import assert from 'node:assert/strict';

import { COURSES_REGISTRY } from '../src/lib/data/coursesData';
import { getCrashPlanById } from '../src/lib/data/crashPlansData';
import { getCrashCourseCurriculum, getCrashCourseProgress } from '../src/lib/courses/crashCourseProgress';
import { getTodaySummary } from '../src/lib/courses/todaySummary';

const plan = getCrashPlanById('plan-1m-sprint')!;
const curriculum = getCrashCourseCurriculum(plan, 'web_fullstack', COURSES_REGISTRY);

function summaryAfter(doneCount: number) {
  const done = curriculum.slice(0, doneCount).map((l) => l.questId);
  const progress = getCrashCourseProgress(plan, 'web_fullstack', COURSES_REGISTRY, done, null);
  return getTodaySummary(progress, COURSES_REGISTRY, done, curriculum);
}

test('a new student starts with Day 1\'s lesson, and the first test comes after 15 tasks', () => {
  const s = summaryAfter(0);
  assert.equal(s.next?.kind, 'Lesson');
  assert.equal(s.day, 1);
  assert.equal(s.totalDays, 30);
  assert.equal(s.tasksTotal, 96);
  assert.equal(s.nextTest?.title, 'Test: Days 1–5');
  assert.equal(s.nextTest?.tasksBefore, 15);
  assert.equal(s.project, 'locked');
  assert.equal(s.tasksLeftBeforeProject, 96);
});

test('after the lesson, the next task is practice on the same day', () => {
  const s = summaryAfter(1);
  assert.equal(s.next?.kind, 'Practice');
  assert.equal(s.day, 1);
  assert.ok(s.next?.title.startsWith('Day 1 Practice 1'));
});

test('after Day 5 the test is next and ready now', () => {
  const s = summaryAfter(15);
  assert.equal(s.next?.kind, 'Test');
  assert.equal(s.day, 5);
  assert.equal(s.nextTest?.tasksBefore, 0);
});

test('when every task is done there is no next task and the final project opens', () => {
  const s = summaryAfter(curriculum.length);
  assert.equal(s.next, null);
  assert.equal(s.nextTest, null);
  assert.equal(s.percent, 100);
  assert.equal(s.project, 'open');
});
