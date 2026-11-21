import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import {
  buildFallbackAssistData,
  InterviewSessionHeader,
  InterviewSetupView
} from '../src/app/interview/components';
import { AVATAR_POOL } from '../src/app/interview/interviewTypes';

test('Task 1: Assist Mode Question-Aware Intent & Trade-off Script Generation', async (t) => {
  const screenshotQuestion =
    'You made an insightful observation around scalable APIs. Looking back at that scenario, what is one key technical or process trade-off you would approach differently today? — Ms. Priya';

  await t.test('buildFallbackAssistData recognizes trade-off question and produces tailored retrospective answer', () => {
    const standardAssist = buildFallbackAssistData('round1_behavioral', 'Software Engineering', 'standard', false, screenshotQuestion);
    assert.ok(standardAssist.script, 'Script must not be empty');
    assert.ok(
      standardAssist.script.toLowerCase().includes('trade-off') || standardAssist.script.toLowerCase().includes('tradeoff'),
      'Script must address the architectural trade-off directly'
    );
    assert.ok(
      standardAssist.script.toLowerCase().includes('differently') || standardAssist.script.toLowerCase().includes('retrospect') || standardAssist.script.toLowerCase().includes('decoupling'),
      'Script must address what would be approached differently'
    );
    assert.ok(standardAssist.bulletPoints.length >= 3, 'Must contain at least 3 bullet points');
    assert.ok(standardAssist.deliveryGuide?.pacing, 'Must include pacing advice');

    const advancedAssist = buildFallbackAssistData('round1_behavioral', 'Distributed Systems', 'advanced', false, screenshotQuestion);
    assert.ok(advancedAssist.script.includes('Distributed Systems'));
    assert.ok(advancedAssist.script.toLowerCase().includes('trade-off') || advancedAssist.script.toLowerCase().includes('tradeoff'));
  });

  await t.test('buildFallbackAssistData recognizes failure, deadline, and scalability questions with distinct content', () => {
    const failureQ = 'Tell me about a time a production release failed or caused an outage.';
    const failureAssist = buildFallbackAssistData('round1_behavioral', 'Backend Engineering', 'standard', false, failureQ);
    assert.ok(failureAssist.script.toLowerCase().includes('incident') || failureAssist.script.toLowerCase().includes('rollback') || failureAssist.script.toLowerCase().includes('ownership'));

    const deadlineQ = 'How did you handle a tight project deadline under extreme delivery pressure?';
    const deadlineAssist = buildFallbackAssistData('round1_behavioral', 'Backend Engineering', 'standard', false, deadlineQ);
    assert.ok(deadlineAssist.script.toLowerCase().includes('prioritization') || deadlineAssist.script.toLowerCase().includes('deadline') || deadlineAssist.script.toLowerCase().includes('moscow'));

    const scaleQ = 'How did you diagnose and resolve a severe database latency bottleneck at scale?';
    const scaleAssist = buildFallbackAssistData('round1_behavioral', 'Cloud Systems', 'standard', false, scaleQ);
    assert.ok(scaleAssist.script.toLowerCase().includes('caching') || scaleAssist.script.toLowerCase().includes('replicas') || scaleAssist.script.toLowerCase().includes('latency'));
  });
});

test('Task 2: Gaming Mode Auto-Activation & Strict Fullscreen CSS Invariants', async (t) => {
  await t.test('globals.css hides topbar, app-header, header, and sidebars when data-interview-active is true', () => {
    const cssPath = path.resolve(__dirname, '../src/styles/globals.css');
    const cssContent = fs.readFileSync(cssPath, 'utf-8');

    assert.ok(
      cssContent.includes('body[data-interview-active="true"] .topbar'),
      'globals.css must hide .topbar during active interview'
    );
    assert.ok(
      cssContent.includes('body[data-interview-active="true"] .app-header'),
      'globals.css must hide .app-header during active interview'
    );
    assert.ok(
      cssContent.includes('body[data-interview-active="true"] header'),
      'globals.css must hide header during active interview'
    );
    assert.ok(
      cssContent.includes('html[data-gaming-mode="true"] .topbar'),
      'globals.css must hide .topbar when data-gaming-mode is true'
    );
    assert.ok(
      cssContent.includes('body[data-interview-active="true"] main') && cssContent.includes('width: 100vw !important'),
      'globals.css must expand main to 100vw during active interview'
    );
  });

  await t.test('InterviewSessionHeader renders gaming focus button with proper testid and title', () => {
    const teacher = AVATAR_POOL[0];
    const headerMarkup = ReactDOMServer.renderToStaticMarkup(
      React.createElement(InterviewSessionHeader, {
        activeTeacher: teacher,
        activeTopicName: 'Software Engineering',
        activeStage: 'round1_behavioral',
        domainStream: 'tech',
        isVoiceListening: true,
        elapsedSeconds: 45,
        formatElapsed: (s: number) => '0:45',
        isScoredStage: false,
        isAssistModeActive: true,
        setIsAssistModeActive: () => {},
        messages: [{ role: 'assistant', content: 'What is your trade-off approach?' }],
        fetchAssistScript: () => {},
        avatarVolume: 80,
        handleVolumeChange: () => {},
        showCameraPreview: false,
        toggleCameraPreview: () => {},
        isAvatarSpeaking: false,
        interruptSpeech: () => {},
        exitInterview: () => {},
        defaultSettingsOpen: true
      })
    );

    assert.ok(headerMarkup.includes('data-testid="header-settings-toggle"'));
    assert.ok(headerMarkup.includes('data-testid="header-gaming-mode-toggle"'));
    assert.ok(headerMarkup.includes('🎮'));
    assert.ok(headerMarkup.includes('Gaming Focus') || headerMarkup.includes('Gaming Mode: Active'));
    assert.ok(headerMarkup.includes('data-testid="header-assist-toggle"'));
    assert.ok(headerMarkup.includes('🎯 Assist Mode: ON'));
    assert.ok(!headerMarkup.includes('data-testid="header-skip-btn"'), 'Top header must not render broken Skip Question button');
  });

  await t.test('InterviewSetupView start button has data-testid and start triggers', () => {
    const setupMarkup = ReactDOMServer.renderToStaticMarkup(
      React.createElement(InterviewSetupView, {
        activeSessionDraft: null,
        resumeActiveSession: () => {},
        discardActiveSession: () => {},
        formatStageLabel: () => 'Round 1',
        interviewMode: 'roadmap',
        setInterviewMode: () => {},
        domainStream: 'tech',
        setDomainStream: () => {},
        domainSubTopic: 'Python',
        setDomainSubTopic: () => {},
        customTopicInput: '',
        setCustomTopicInput: () => {},
        jdInput: '',
        setJdInput: () => {},
        jdMatchResult: null,
        difficulty: 'normal',
        setDifficulty: () => {},
        isAssistModeActive: true,
        setIsAssistModeActive: () => {},
        startInterview: () => {},
        sessions: [],
        clearSessionHistory: () => {},
        setSelectedHistorySession: () => {}
      })
    );

    assert.ok(setupMarkup.includes('data-testid="start-interview-btn"'));
    assert.ok(setupMarkup.includes('Start Proactive Voice Interview'));
  });
});
