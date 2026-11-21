import { test } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import {
  AssistModeDrawer,
  buildFallbackAssistData,
  InterviewSessionHeader
} from '../src/app/interview/components';
import { AVATAR_POOL } from '../src/app/interview/interviewTypes';

test('Block 40: buildFallbackAssistData produces stage-aware coaching scripts, bullets, and delivery guides across all 4 rounds', () => {
  const stages = ['round1_behavioral', 'round2_coding', 'round3_systems', 'round4_star'] as const;
  for (const stage of stages) {
    for (const level of ['standard', 'advanced'] as const) {
      const data = buildFallbackAssistData(stage, 'Distributed Ledger Engineering', level, stage === 'round2_coding');
      assert.ok(data.script.length > 30, `Expected non-empty coaching script for ${stage} (${level})`);
      assert.equal(data.bulletPoints.length, 3, `Expected 3 bullet points for ${stage} (${level})`);
      assert.ok(data.deliveryGuide?.pacing, `Expected pacing guide for ${stage} (${level})`);
      assert.ok(data.deliveryGuide?.tone, `Expected tone guide for ${stage} (${level})`);
      assert.ok((data.deliveryGuide?.emphasisWords || []).length >= 3, `Expected emphasis words for ${stage} (${level})`);
    }
  }

  const r3Adv = buildFallbackAssistData('round3_systems', 'Payment Gateway', 'advanced', false);
  assert.ok(r3Adv.script.includes('Payment Gateway'));
  assert.ok(r3Adv.script.includes('API Gateway'));

  const r4Adv = buildFallbackAssistData('round4_star', 'High-Frequency Trading', 'advanced', false);
  assert.ok(r4Adv.script.includes('Situation'));
  assert.ok(r4Adv.script.includes('Result'));
});

test('Block 40: AssistModeDrawer SSR renders offline fallback when assistData is null, Listen button, and live word-match coverage pill', () => {
  const teacher = AVATAR_POOL[0];

  // 1. Null assistData falls back to deterministic coaching script & computes word coverage
  const scriptMarkup = ReactDOMServer.renderToStaticMarkup(
    React.createElement(AssistModeDrawer, {
      isScoredStage: true,
      isCodingRound: false,
      isAssistModeActive: true,
      setIsAssistModeActive: () => {},
      assistScriptLevel: 'standard',
      setAssistScriptLevel: () => {},
      assistTab: 'script',
      setAssistTab: () => {},
      isFetchingAssist: false,
      assistData: null,
      liveSpeechTranscript: 'I have hands on experience in Software Engineering solving real world problems',
      messages: [],
      activeTeacher: teacher,
      difficulty: 'normal',
      fetchAssistScript: () => {},
      speakWithAvatarRaw: () => {},
      setAnimState: () => {}
    })
  );

  assert.ok(scriptMarkup.includes('data-testid="assist-mode-drawer"'));
  assert.ok(scriptMarkup.includes('data-testid="assist-listen-btn"'));
  assert.ok(scriptMarkup.includes('🔊 Listen'));
  assert.ok(scriptMarkup.includes('data-testid="assist-coverage-pill"'));
  assert.ok(scriptMarkup.includes('🎯 Coverage:'));
  assert.ok(!scriptMarkup.includes('No script loaded yet'), 'Expected fallback script to replace empty state');

  // 2. Bullets tab renders fallback bulletPoints
  const bulletsMarkup = ReactDOMServer.renderToStaticMarkup(
    React.createElement(AssistModeDrawer, {
      isScoredStage: true,
      isCodingRound: false,
      isAssistModeActive: true,
      setIsAssistModeActive: () => {},
      assistScriptLevel: 'advanced',
      setAssistScriptLevel: () => {},
      assistTab: 'bullets',
      setAssistTab: () => {},
      isFetchingAssist: false,
      assistData: null,
      liveSpeechTranscript: '',
      messages: [],
      activeTeacher: teacher,
      difficulty: 'hard',
      fetchAssistScript: () => {},
      speakWithAvatarRaw: () => {},
      setAnimState: () => {}
    })
  );
  assert.ok(bulletsMarkup.includes('Highlight one concrete project or milestone'));

  // 3. Delivery tab renders pacing, tone, and emphasis keywords
  const deliveryMarkup = ReactDOMServer.renderToStaticMarkup(
    React.createElement(AssistModeDrawer, {
      isScoredStage: true,
      isCodingRound: false,
      isAssistModeActive: true,
      setIsAssistModeActive: () => {},
      assistScriptLevel: 'advanced',
      setAssistScriptLevel: () => {},
      assistTab: 'delivery',
      setAssistTab: () => {},
      isFetchingAssist: false,
      assistData: null,
      liveSpeechTranscript: '',
      messages: [],
      activeTeacher: teacher,
      difficulty: 'hard',
      fetchAssistScript: () => {},
      speakWithAvatarRaw: () => {},
      setAnimState: () => {}
    })
  );
  assert.ok(deliveryMarkup.includes('Vocal Delivery'));
  assert.ok(deliveryMarkup.includes('Emphasis Keywords'));
  assert.ok(deliveryMarkup.includes('reliability'));
});

test('Block 40: InterviewSessionHeader SSR renders header-assist-toggle button in OFF and ON states', () => {
  const teacher = AVATAR_POOL[0];
  const offMarkup = ReactDOMServer.renderToStaticMarkup(
    React.createElement(InterviewSessionHeader, {
      activeTeacher: teacher,
      activeTopicName: 'Cloud Architecture',
      activeStage: 'round3_systems',
      domainStream: 'tech',
      domainSubTopic: 'cloud',
      isVoiceListening: false,
      elapsedSeconds: 95,
      formatElapsed: (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`,
      isScoredStage: true,
      isAssistModeActive: false,
      setIsAssistModeActive: () => {},
      messages: [],
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

  assert.ok(offMarkup.includes('data-testid="header-settings-toggle"'));
  assert.ok(offMarkup.includes('data-testid="header-assist-toggle"'));
  assert.ok(offMarkup.includes('🎯 Assist Mode: OFF'));

  const onMarkup = ReactDOMServer.renderToStaticMarkup(
    React.createElement(InterviewSessionHeader, {
      activeTeacher: teacher,
      activeTopicName: 'Cloud Architecture',
      activeStage: 'round3_systems',
      domainStream: 'tech',
      domainSubTopic: 'cloud',
      isVoiceListening: true,
      elapsedSeconds: 120,
      formatElapsed: (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`,
      isScoredStage: true,
      isAssistModeActive: true,
      setIsAssistModeActive: () => {},
      messages: [],
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

  assert.ok(onMarkup.includes('🎯 Assist Mode: ON'));
});
