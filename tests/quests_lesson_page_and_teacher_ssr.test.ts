import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import {
  resolveTeacher,
  TEACHER_METADATA,
} from '../src/app/quests/lesson/page';
import { TeacherAvatarFrame } from '../src/app/quests/lesson/components/TeacherAvatarFrame';
import { LessonNavigationBar } from '../src/app/quests/lesson/components/LessonNavigationBar';

describe('Quests Lesson Page and Teacher SSR Suite (Block 53 / TASK-341)', () => {
  test('resolveTeacher resolves registered teachers and defaults safely to kashyap', () => {
    const kashyap = resolveTeacher('kashyap');
    assert.equal(kashyap.name, 'Kashyap Sir');
    assert.equal(kashyap.role, 'Staff Systems Architect');
    assert.equal(kashyap.avatar, '👩‍🎨');

    const karthic = resolveTeacher('karthic');
    assert.equal(karthic.name, 'Karthic Sir "Nega"');
    assert.equal(karthic.role, 'Algorithmic Lead Tutor');
    assert.equal(karthic.avatar, '👨‍🏫');

    const maya = resolveTeacher('maya');
    assert.equal(maya.name, 'Ms. Maya');
    assert.equal(maya.role, 'Principal Security Auditor');

    const divya = resolveTeacher('divya');
    assert.equal(divya.name, 'Ms. Divya');
    assert.equal(divya.role, 'Lead UX Engineer');

    // Unknown and undefined fallback
    const fallbackDefault = resolveTeacher();
    assert.equal(fallbackDefault.name, 'Kashyap Sir');

    const fallbackUnknown = resolveTeacher('random-nonexistent-id');
    assert.equal(fallbackUnknown.name, 'Kashyap Sir');
  });

  test('TEACHER_METADATA contains valid color, accent, avatar, and role entries', () => {
    const teacherKeys = Object.keys(TEACHER_METADATA);
    assert.ok(teacherKeys.includes('kashyap'));
    assert.ok(teacherKeys.includes('karthic'));
    assert.ok(teacherKeys.includes('maya'));
    assert.ok(teacherKeys.includes('divya'));

    for (const key of teacherKeys) {
      const teacher = TEACHER_METADATA[key];
      assert.ok(teacher.name.length > 0, `Teacher ${key} should have a name`);
      assert.ok(teacher.avatar.length > 0, `Teacher ${key} should have an avatar`);
      assert.ok(teacher.accent.length > 0, `Teacher ${key} should have an accent color`);
      assert.ok(teacher.role.length > 0, `Teacher ${key} should have a role`);
    }
  });

  test('TeacherAvatarFrame renders docked avatar, tutor name, and status with resilient fallbacks', () => {
    // Normal teacher
    const teacher = resolveTeacher('kashyap');
    const html = renderToStaticMarkup(
      React.createElement(TeacherAvatarFrame, {
        userId: 'student-123',
        teacherId: 'kashyap',
        teacher,
        isPlaying: false,
        speechText: '',
        questData: { id: 'web-q1', title: 'HTML Foundations' },
      })
    );

    assert.ok(html.includes('data-testid="teacher-avatar-dock"'));
    assert.ok(html.includes('data-testid="teacher-avatar-name"'));
    assert.ok(html.includes('Kashyap Sir'));
    assert.ok(html.includes('data-testid="teacher-avatar-status"'));
    assert.ok(html.includes('Tutor'));
    assert.ok(html.includes('data-speech-active="false"'));

    // Speaking state with waveform
    const speakingHtml = renderToStaticMarkup(
      React.createElement(TeacherAvatarFrame, {
        userId: 'student-123',
        teacherId: 'kashyap',
        teacher,
        isPlaying: true,
        speechText: 'Welcome to the quest lesson!',
        questData: null,
      })
    );
    assert.ok(speakingHtml.includes('data-speech-active="true"'));
    assert.ok(speakingHtml.includes('Speaking...'));
    assert.ok(speakingHtml.includes('teacher-avatar-docked-waveform'));

    // Resilient fallback when teacher is undefined
    const fallbackHtml = renderToStaticMarkup(
      React.createElement(TeacherAvatarFrame, {
        userId: 'student-123',
        teacherId: 'unknown',
        teacher: undefined as any,
        isPlaying: false,
        speechText: '',
        questData: null,
      })
    );
    assert.ok(fallbackHtml.includes('data-testid="teacher-avatar-dock"'));
    assert.ok(fallbackHtml.includes('Tutor'));
  });

  test('LessonNavigationBar renders slide controls, topic pill, and completion triggers without 2D avatar dock', () => {
    const teacher = resolveTeacher('karthic');

    // Slide 1 of 5
    const midSlideHtml = renderToStaticMarkup(
      React.createElement(LessonNavigationBar, {
        currentSlide: 1,
        handlePrevSlide: () => {},
        handleNextSlide: () => {},
        stopSpeaking: () => {},
        setIsPlaying: () => {},
        isInteractive: false,
        setIsInteractive: () => {},
        teacher,
        isLastSlide: false,
        examPassed: false,
        finishLessonAndReturn: () => {},
        slidesLength: 4,
        understandingConfirmed: { 0: true },
        teacherId: 'karthic',
      })
    );

    assert.ok(midSlideHtml.includes('data-testid="lesson-nav-bar"'));
    assert.ok(midSlideHtml.includes('data-testid="btn-prev-slide"'));
    assert.ok(midSlideHtml.includes('data-testid="btn-qa-toggle"'));
    assert.ok(midSlideHtml.includes('data-testid="btn-next-slide"'));
    assert.ok(!midSlideHtml.includes('data-testid="teacher-avatar-dock"'));
    assert.ok(midSlideHtml.includes('data-testid="classroom-topic-pill"'));
    assert.ok(midSlideHtml.includes('data-testid="lesson-check-progress-pill"'));

    // Last slide when exam is passed
    const lastSlideHtml = renderToStaticMarkup(
      React.createElement(LessonNavigationBar, {
        currentSlide: 5,
        handlePrevSlide: () => {},
        handleNextSlide: () => {},
        stopSpeaking: () => {},
        setIsPlaying: () => {},
        isInteractive: false,
        setIsInteractive: () => {},
        teacher,
        isLastSlide: true,
        examPassed: true,
        finishLessonAndReturn: () => {},
        slidesLength: 4,
        understandingConfirmed: { 0: true, 1: true, 2: true, 3: true },
        teacherId: 'karthic',
      })
    );

    assert.ok(lastSlideHtml.includes('data-testid="btn-finish-quest"'));
    assert.ok(lastSlideHtml.includes('Finish Quest &amp; Return 🏁'));
  });

  test('LessonPage loading and auth fallbacks render deterministic testids in SSR', () => {
    // Suspense fallback markup
    const loadingFallback = React.createElement(
      'div',
      {
        'data-testid': 'lesson-page-loading',
        style: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' },
      },
      'Loading Quest Lesson...'
    );
    const loadingHtml = renderToStaticMarkup(loadingFallback);
    assert.ok(loadingHtml.includes('data-testid="lesson-page-loading"'));
    assert.ok(loadingHtml.includes('Loading Quest Lesson...'));

    // Authenticating fallback markup
    const authFallback = React.createElement(
      'div',
      {
        'data-testid': 'lesson-auth-loading',
        style: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' },
      },
      'Authenticating...'
    );
    const authHtml = renderToStaticMarkup(authFallback);
    assert.ok(authHtml.includes('data-testid="lesson-auth-loading"'));
    assert.ok(authHtml.includes('Authenticating...'));

    // Unregistered quest fallback markup
    const unregisteredFallback = React.createElement(
      'div',
      { 'data-testid': 'quest-not-found' },
      React.createElement('h2', null, 'Unregistered Quest Lesson'),
      React.createElement('button', { 'data-testid': 'btn-unregistered-return' }, 'Return to Quests Roadmap')
    );
    const unregisteredHtml = renderToStaticMarkup(unregisteredFallback);
    assert.ok(unregisteredHtml.includes('data-testid="quest-not-found"'));
    assert.ok(unregisteredHtml.includes('data-testid="btn-unregistered-return"'));

    // Completed previous class locked fallback markup (Feature 1)
    const completedLockedFallback = React.createElement(
      'div',
      { 'data-testid': 'quest-already-completed-locked' },
      React.createElement('h2', null, 'Class Already Completed'),
      React.createElement('button', { 'data-testid': 'btn-completed-return' }, 'Return to Quests Roadmap')
    );
    const completedHtml = renderToStaticMarkup(completedLockedFallback);
    assert.ok(completedHtml.includes('data-testid="quest-already-completed-locked"'));
    assert.ok(completedHtml.includes('data-testid="btn-completed-return"'));
    assert.ok(completedHtml.includes('Class Already Completed'));
  });

  test('LessonHeader renders Fullscreen Game Mode toggle with Shift+Space shortcut (Feature 2)', () => {
    const { LessonHeader } = require('../src/app/quests/lesson/components/LessonHeader');
    const headerHtml = renderToStaticMarkup(
      React.createElement(LessonHeader, {
        questTitle: 'Python Lecture 1: Day 1',
        isFocusMusicEnabled: false,
        setIsFocusMusicEnabled: () => {},
        soundscapeVol: 50,
        setSoundscapeVol: () => {},
        isAudioUnlocked: true,
        setIsAudioUnlocked: () => {},
        playSpeech: () => {},
        stopSpeaking: () => {},
        setIsPlaying: () => {},
        setIsInteractive: () => {},
        currentSlide: 1,
        setCurrentSlide: () => {},
        totalSlides: 6,
        isInteractive: false,
        examPassed: false,
        isFullscreen: false,
        toggleFullscreen: () => {},
      })
    );

    assert.ok(headerHtml.includes('data-testid="btn-fullscreen-toggle"'));
    assert.ok(headerHtml.includes('Shift + Space x2'));

    // In fullscreen active mode
    const fsHeaderHtml = renderToStaticMarkup(
      React.createElement(LessonHeader, {
        questTitle: 'Python Lecture 1: Day 1',
        isFocusMusicEnabled: false,
        setIsFocusMusicEnabled: () => {},
        soundscapeVol: 50,
        setSoundscapeVol: () => {},
        isAudioUnlocked: true,
        setIsAudioUnlocked: () => {},
        playSpeech: () => {},
        stopSpeaking: () => {},
        setIsPlaying: () => {},
        setIsInteractive: () => {},
        currentSlide: 1,
        setCurrentSlide: () => {},
        totalSlides: 6,
        isInteractive: false,
        examPassed: false,
        isFullscreen: true,
        toggleFullscreen: () => {},
      })
    );

    assert.ok(fsHeaderHtml.includes('Exit Focus (Shift+Esc)'));
  });
});

