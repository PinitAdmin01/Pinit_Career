import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import fs from 'node:fs';
import path from 'node:path';

import { LessonCompletionModal } from '../src/app/quests/lesson/components/LessonCompletionModal';
import { TodayCourseCard } from '../src/app/quests/components/TodayCourseCard';
import { CompletionScreen } from '../src/components/quests/workspace/WorkspaceSubmitPanel';

test('Task 1: LessonPageContent does NOT render lock screen in normal student flow', () => {
  const lessonPageSource = fs.readFileSync(
    path.join(__dirname, '../src/app/quests/lesson/page.tsx'),
    'utf-8'
  );

  // Strict check ensures lock is only rendered when explicitly requested via search params
  assert.ok(lessonPageSource.includes("const strictLockCompleted = searchParams.get('strictLockCompleted') === 'true';"));
  assert.ok(lessonPageSource.includes('isClassAlreadyCompleted && !allowCompletedBypass && strictLockCompleted'));

  // Backward compatibility tokens for existing tests must remain intact
  assert.ok(lessonPageSource.includes('isClassAlreadyCompleted'));
  assert.ok(lessonPageSource.includes('quest-already-completed-locked'));
  assert.ok(lessonPageSource.includes('btn-completed-return'));
});

test('Task 2: TodayCourseCard and handleLaunchQuest provide zero-latency immediate launch feedback', () => {
  // 1. Verify TodayCourseCard reflects isStarting state
  const idleHtml = renderToStaticMarkup(
    React.createElement(TodayCourseCard, {
      planTitle: '1-Month Fast-Track Sprint',
      summary: {
        next: { title: 'Day 2: Variables and Data Types', kind: 'Lesson', day: 2 },
        day: 2,
        totalDays: 60,
        tasksDone: 3,
        tasksTotal: 192,
        percent: 2,
        nextTest: { title: 'Test: Days 1–5', tasksBefore: 12 },
        project: 'locked',
        tasksLeftBeforeProject: 189,
      },
      onStart: () => {},
      onOpenProject: () => {},
      isStarting: false,
    })
  );
  assert.ok(idleHtml.includes('Start ▶'));
  assert.ok(!idleHtml.includes('disabled'));

  const startingHtml = renderToStaticMarkup(
    React.createElement(TodayCourseCard, {
      planTitle: '1-Month Fast-Track Sprint',
      summary: {
        next: { title: 'Day 2: Variables and Data Types', kind: 'Lesson', day: 2 },
        day: 2,
        totalDays: 60,
        tasksDone: 3,
        tasksTotal: 192,
        percent: 2,
        nextTest: { title: 'Test: Days 1–5', tasksBefore: 12 },
        project: 'locked',
        tasksLeftBeforeProject: 189,
      },
      onStart: () => {},
      onOpenProject: () => {},
      isStarting: true,
    })
  );
  assert.ok(startingHtml.includes('⏳ Starting...'));
  assert.ok(startingHtml.includes('disabled=""'));

  // 2. Verify useQuestProgression debounces in-flight launches and unlocks non-blockingly
  const progressionSource = fs.readFileSync(
    path.join(__dirname, '../src/app/quests/components/useQuestProgression.ts'),
    'utf-8'
  );
  assert.ok(progressionSource.includes('isLaunchingQuestRef'));
  assert.ok(progressionSource.includes('void unlockItem('));
});

test('Task 3: LessonCompletionModal renders "Go to Next Class ➔" beside "Return to Dashboard 🏁"', () => {
  const nextLesson = { id: 'python-lecture2-day-2', title: 'Day 2: Variables and Data Types', isExam: false };
  const htmlLesson = renderToStaticMarkup(
    React.createElement(LessonCompletionModal, {
      examPassed: true,
      confettiParticles: [],
      finishLessonAndReturn: () => {},
      questId: 'python-lecture1-day-1',
      nextQuest: nextLesson,
      onGoToNextQuest: () => {},
    })
  );

  assert.ok(htmlLesson.includes('data-testid="btn-go-to-next-quest"'));
  assert.ok(htmlLesson.includes('Go to Next Class ➔'));
  assert.ok(htmlLesson.includes('data-testid="btn-return-roadmap"'));
  assert.ok(htmlLesson.includes('Return to Dashboard 🏁'));

  // When next quest is an exam/test
  const nextExam = { id: 'course-python-fast-test-1', title: 'Milestone Test 1', isExam: true };
  const htmlExam = renderToStaticMarkup(
    React.createElement(LessonCompletionModal, {
      examPassed: true,
      confettiParticles: [],
      finishLessonAndReturn: () => {},
      questId: 'python-lecture5-day-5',
      nextQuest: nextExam,
      onGoToNextQuest: () => {},
    })
  );

  assert.ok(htmlExam.includes('data-testid="btn-go-to-next-quest"'));
  assert.ok(htmlExam.includes('Go to Next Exam ➔'));
  assert.ok(htmlExam.includes('Return to Dashboard 🏁'));
});

test('Task 3: Workspace CompletionScreen renders "Go to Next Class / Exam" beside return options', () => {
  const html = renderToStaticMarkup(
    React.createElement(CompletionScreen, {
      quest: { id: 'python-lecture1-day-1', title: 'Day 1: Your First Python Program' },
      currentTeacher: { id: 'kashyap', name: 'Kashyap Sir', color: '#6366f1', avatar: '👩‍🎨', role: 'Architect', accent: '#6366f1' },
      category: 'learning',
    })
  );

  assert.ok(html.includes('data-testid="workspace-completion-screen"'));
  assert.ok(html.includes('data-testid="btn-workspace-go-next"'));
  assert.ok(html.includes('Go to Next Exam ➔') || html.includes('Go to Next Class ➔'));
  assert.ok(html.includes('Return to Dashboard 🏁'));
});
