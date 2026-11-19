import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import ReactDOMServer from 'react-dom/server';

import { extractJsonObject, escapeHtml } from '../src/lib/interview/jsonExtract';
import {
  COMPANY_PROFILES,
  resolveCompanyProfile,
  buildCompanyPromptContext,
} from '../src/lib/interview/companyProfiles';
import {
  computeSpeechBandRms,
  createSpeechBargeInDetector,
} from '../src/lib/interview/voiceActivity';
import {
  extractDefendedTechStack,
  buildQuestionBenchmarks,
  SKIP_TURN_REGEX,
} from '../src/lib/interview/postInterviewInsights';
import { SpeechDebounceManager } from '../src/lib/interview/speechDebounce';
import {
  createSemanticFallbackProblem,
  resolveDynamicCodingProblem,
} from '../src/app/interview/problemGenerator';
import { generateScorecardPrintHtml } from '../src/app/interview/interviewEvaluator';
import { InterviewSessionHeader } from '../src/app/interview/components/InterviewSessionHeader';
import { InterviewSetupView } from '../src/app/interview/components/InterviewSetupView';
import { Round4StarDrill } from '../src/app/interview/components/Round4StarDrill';
import { InterviewResultsView } from '../src/app/interview/components/InterviewResultsView';
import { RadarChart } from '../src/app/interview/components/RadarChart';
import { InterviewVoiceHud } from '../src/app/interview/components/InterviewVoiceHud';

const ROOT = process.cwd();

test('extractJsonObject parses fenced JSON, trailing prose, and braces inside strings cleanly', () => {
  const fenced = 'Here is your output:\n```json\n{"script":"Explain {edge} cases safely","score":92}\n```\nHope that helps!';
  const parsedFenced = extractJsonObject<{ script: string; score: number }>(fenced);
  assert.deepEqual(parsedFenced, { script: 'Explain {edge} cases safely', score: 92 });

  const escapedQuotes = 'Analysis: {"quote":"He said \\"{hello}\\" cleanly","ok":true} -- done';
  const parsedEscaped = extractJsonObject<{ quote: string; ok: boolean }>(escapedQuotes);
  assert.deepEqual(parsedEscaped, { quote: 'He said "{hello}" cleanly', ok: true });

  assert.equal(extractJsonObject('No JSON object present here'), null);
  assert.equal(extractJsonObject('[1, 2, 3]'), null);
});

test('escapeHtml neutralizes HTML, script tags, and quote characters', () => {
  const dirty = `<script>alert("xss")</script> & 'quoted'`;
  const clean = escapeHtml(dirty);
  assert.equal(clean, '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt; &amp; &#39;quoted&#39;');
  assert.equal(escapeHtml(null), '');
});

test('companyProfiles resolves 14 enterprise profiles, aliases, and stage directives', () => {
  assert.equal(COMPANY_PROFILES.length, 14);
  assert.equal(resolveCompanyProfile('AWS')?.name, 'Amazon');
  assert.equal(resolveCompanyProfile('GCP')?.name, 'Google');
  assert.equal(resolveCompanyProfile('standard'), null);

  const amazon = resolveCompanyProfile('Amazon');
  assert.ok(amazon);
  const sysPrompt = buildCompanyPromptContext(amazon, 'round3_systems');
  assert.ok(sysPrompt.includes('TARGET COMPANY SIMULATION: Amazon'));
  assert.ok(sysPrompt.includes('Leadership Principles'));
  assert.ok(sysPrompt.includes(amazon.roundFocus.systems));
});

test('voiceActivity isolates 300-3400 Hz speech bins and enforces sustained barge-in threshold', () => {
  // 48000 Hz sampleRate, 2048 FFT -> ~23.4375 Hz/bin -> speech bins ~12..145
  const bins = new Uint8Array(1024);
  // Put strong energy ONLY inside 300-3400 Hz (~bin 20..60)
  for (let i = 20; i <= 60; i++) bins[i] = 65;
  const speechMetrics = computeSpeechBandRms(bins, 48000, 2048);
  assert.ok(speechMetrics.speechRms > speechMetrics.fullRms);
  assert.ok(speechMetrics.normalizedLevel >= 40);

  // Sub-bass rumble only (bins 0..4 -> <100 Hz)
  const rumbleBins = new Uint8Array(1024);
  for (let i = 0; i <= 4; i++) rumbleBins[i] = 200;
  const rumbleMetrics = computeSpeechBandRms(rumbleBins, 48000, 2048);
  assert.equal(rumbleMetrics.speechRms, 0);

  let triggers = 0;
  const detector = createSpeechBargeInDetector({
    speechThreshold: 20,
    sustainedMs: 300,
    onBargeIn: () => {
      triggers++;
    },
  });

  // Short spike below 300ms must not trigger
  assert.equal(detector.evaluate(35, 1000), false);
  assert.equal(detector.evaluate(35, 1200), false);
  assert.equal(triggers, 0);

  // Sustained >= 300ms triggers once
  assert.equal(detector.evaluate(35, 1320), true);
  assert.equal(detector.evaluate(35, 1500), false);
  assert.equal(triggers, 1);

  // Drop below threshold resets state cleanly
  detector.evaluate(5, 1600);
  detector.evaluate(30, 1700);
  assert.equal(detector.evaluate(30, 2050), true);
  assert.equal(triggers, 2);
});

test('postInterviewInsights extracts defended tech stack and Q&A benchmark comparisons', () => {
  const messages = [
    { role: 'assistant', content: 'How did you reduce p99 latency under load? — Ms. Priya' },
    { role: 'user', content: 'I added Redis caching and PostgreSQL read replicas behind Nginx because database reads spiked p99 to 450ms, reducing latency by 65%.' },
    { role: 'assistant', content: 'What trade-off did you make?' },
    { role: 'user', content: 'I accepted eventual consistency for 30s TTL.' },
  ];

  const stack = extractDefendedTechStack(messages, 'python', {
    nodes: [{ type: 'queue', label: 'Kafka Event Bus' }],
  });
  assert.ok(stack.includes('Python'));
  assert.ok(stack.includes('Redis Cache'));
  assert.ok(stack.includes('SQL'));
  assert.ok(stack.includes('Kafka / Queue'));

  const benchmarks = buildQuestionBenchmarks(messages, 'Distributed Systems', 'tech');
  assert.equal(benchmarks.length, 2);
  assert.ok(benchmarks[0].score > benchmarks[1].score);
  assert.ok(benchmarks[1].missedConcepts.length > 0);
});

test('generateScorecardPrintHtml escapes XSS payloads and includes defended stack + benchmarks', () => {
  const html = generateScorecardPrintHtml({
    activeTopicName: '<script>alert("xss")</script>',
    domainStream: 'tech',
    teacherName: 'Ms. "Priya"',
    evaluationResult: {
      score: 78,
      verdict: 'Conditional Hire',
      defendedTechStack: ['Python', 'Redis Cache'],
      questionBreakdown: [
        {
          question: 'How does caching work?',
          candidateAnswer: 'Used <img src=x onerror=alert(1)> Redis TTL.',
          idealAnswer: 'Use cache-aside with TTL jitter and stampede protection.',
          score: 82,
          feedback: 'Good trade-off mention.',
        },
      ],
      answerQuality: {
        evidence: [
          { dimension: 'reasoning', quote: '<b>unsafe</b> quote', assessment: 'Verified.' },
        ],
      },
    },
    eyeContactScore: 75,
    wpmScore: 130,
    fillerWordCount: 1,
    messages: [],
  });

  assert.equal(html.includes('<script>alert("xss")</script>'), false);
  assert.equal(html.includes('<img src=x onerror=alert(1)>'), false);
  assert.ok(html.includes('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'));
  assert.ok(html.includes('Verified Defended Tech Stack'));
  assert.ok(html.includes('Redis Cache'));
  assert.ok(html.includes('Question-by-Question Benchmark Review'));
});

test('GlobalAvatar and Round2Coding preserve layered isolation invariants', () => {
  const globalAvatarSrc = fs.readFileSync(path.join(ROOT, 'src/components/ui/GlobalAvatar.tsx'), 'utf8');
  assert.ok(globalAvatarSrc.includes('isTaskOrProcessActive'), 'GlobalAvatar must gate wake-word mic on active tasks');
  assert.ok(globalAvatarSrc.includes('minimized && !shouldHideVisually'), 'Minimized pill must hide during /interview');
  assert.ok(globalAvatarSrc.includes('avatar-mentor-widget'), 'Floating avatar widget must carry .avatar-mentor-widget class');

  const headerSrc = fs.readFileSync(path.join(ROOT, 'src/app/interview/components/InterviewSessionHeader.tsx'), 'utf8');
  assert.equal(headerSrc.includes('window.confirm'), false, 'Header must use inline 2-step confirmation instead of window.confirm');

  const round2Src = fs.readFileSync(path.join(ROOT, 'src/app/interview/components/Round2Coding.tsx'), 'utf8');
  assert.ok(round2Src.includes('isFormInputOutsideMonaco'), 'Ctrl+Enter handler must ignore inputs outside Monaco editor');
});

test('Upgraded SSR components render company badge, company preset, 2-col Round 4, and honest ResultsView', () => {
  const headerHtml = ReactDOMServer.renderToStaticMarkup(
    React.createElement(InterviewSessionHeader, {
      activeTeacher: { id: 'priya', name: 'Ms. Priya', emoji: '👩‍💼', title: 'Principal Engineer', accentColor: '#8b5cf6', voiceGender: 'female', style: 'Structured' },
      activeTopicName: 'Distributed Systems',
      activeStage: 'round1_behavioral',
      domainStream: 'tech',
      domainSubTopic: 'systems',
      companyName: 'Amazon',
      isVoiceListening: true,
      elapsedSeconds: 42,
      formatElapsed: (s: number) => `0:${s}`,
      isScoredStage: true,
      isAssistModeActive: false,
      setIsAssistModeActive: () => {},
      messages: [],
      fetchAssistScript: () => {},
      avatarVolume: 0.9,
      handleVolumeChange: () => {},
      showCameraPreview: false,
      toggleCameraPreview: () => {},
      isAvatarSpeaking: false,
      interruptSpeech: () => {},
      exitInterview: () => {},
    })
  );
  assert.ok(headerHtml.includes('data-testid="header-company-badge"'));
  assert.ok(headerHtml.includes('Amazon'));

  const setupHtml = ReactDOMServer.renderToStaticMarkup(
    React.createElement(InterviewSetupView, {
      activeSessionDraft: null,
      resumeActiveSession: () => {},
      discardActiveSession: () => {},
      formatStageLabel: () => 'Round 1',
      interviewMode: 'roadmap',
      setInterviewMode: () => {},
      domainStream: 'tech',
      setDomainStream: () => {},
      domainSubTopic: 'software',
      setDomainSubTopic: () => {},
      customTopicInput: '',
      setCustomTopicInput: () => {},
      difficulty: 'normal',
      setDifficulty: () => {},
      targetCompany: 'Google',
      setTargetCompany: () => {},
      startInterview: () => {},
      sessions: [],
      clearSessionHistory: () => {},
      setSelectedHistorySession: () => {},
    })
  );
  assert.ok(setupHtml.includes('data-testid="company-preset-select"'));
  assert.ok(setupHtml.includes('data-testid="company-preset-summary"'));
  assert.ok(setupHtml.includes('GCA (General Cognitive Ability)'));

  const round4Html = ReactDOMServer.renderToStaticMarkup(
    React.createElement(Round4StarDrill, {
      activeTeacher: { id: 'kiran', name: 'Mr. Kiran', emoji: '👨‍💼', title: 'VP Engineering' },
      animState: 'idle',
      showCameraPreview: false,
      videoPreviewRef: { current: null },
      eyeContactScore: null,
      wpmScore: null,
      lastInterviewerSpeech: 'Tell me about a production outage.',
      finishInterview: () => {},
      canFinishInterview: false,
      manualTextInput: '',
      setManualTextInput: () => {},
      onSendMessage: () => {},
      starStep: 1,
      messages: [{ role: 'assistant', content: 'Walk me through your Task.' }],
    })
  );
  assert.ok(round4Html.includes('iv-round4-layout'));
  assert.ok(round4Html.includes('data-testid="round4-transcript-stream"'));
  assert.ok(round4Html.includes('✅ S — Situation'));
  assert.ok(round4Html.includes('👉 T — Task'));

  const resultsHtml = ReactDOMServer.renderToStaticMarkup(
    React.createElement(InterviewResultsView, {
      evaluationResult: {
        score: 0,
        verdict: 'Needs Practice',
        defendedTechStack: ['Python', 'PostgreSQL'],
        questionBreakdown: [
          {
            question: 'Explain database indexing.',
            candidateAnswer: 'B-trees speed up lookups.',
            idealAnswer: 'B+ trees optimize range scans at the cost of write amplification.',
            score: 68,
            feedback: 'Add write trade-offs.',
            missedConcepts: ['Write amplification'],
          },
        ],
      },
      activeTopicName: 'Backend Engineering',
      codeSubmitted: false,
      latestTopology: null,
      starStep: 0,
      wpmScore: null,
      fillerWordCount: 0,
      eyeContactScore: null,
      startInterview: () => {},
      exportInterviewTranscript: () => {},
      exitInterview: () => {},
    })
  );
  assert.ok(resultsHtml.includes('(0%)'), 'Zero score must display 0%, not inflate to 50%');
  assert.ok(resultsHtml.includes('data-testid="results-tech-stack-badges"'));
  assert.ok(resultsHtml.includes('data-testid="results-question-benchmark"'));
  assert.ok(resultsHtml.includes('Write amplification'));
  assert.ok(resultsHtml.includes('data-testid="print-pdf-btn"'));
});

test('Deep Audit Fix #1, #2, #10: SpeechDebounceManager final-chunk WPM timing, VoiceHud opt-in barge-in toggle, and RadarChart SVG paint server', () => {
  const manager = new SpeechDebounceManager({ silenceThresholdMs: 1800 });
  // First final chunk without a preceding interim chunk must initialize speechStartTimestamp
  manager.handleFinalChunk('We designed a distributed Redis rate limiter');
  const committed = manager.commitSubmission();
  assert.ok(committed);
  assert.ok(committed.metrics.wordCount >= 7);
  manager.reset();

  // Voice HUD renders opt-in Barge-In toggle defaulting to OFF
  const voiceHudHtml = ReactDOMServer.renderToStaticMarkup(
    React.createElement(InterviewVoiceHud, {
      isInterviewActive: true,
      voiceSupport: true,
      isVoiceListening: true,
      isAvatarSpeaking: false,
      activeTeacher: { id: 'priya', name: 'Ms. Priya', emoji: '👩‍💼', title: 'HR Lead' },
      micVolume: 24,
      fillerWordCount: 0,
      liveTranscript: 'Testing voice stream',
      stopVoiceRecognition: () => {},
      startVoiceRecognition: () => {},
      onSkipQuestion: () => {},
      bargeInEnabled: false,
      setBargeInEnabled: () => {},
    })
  );
  assert.ok(voiceHudHtml.includes('data-testid="voice-barge-in-toggle"'));
  assert.ok(voiceHudHtml.includes('Barge-In: OFF'));

  // RadarChart polygon uses url(#radar-grad) fill, not the filter url(#radar-glow)
  const radarHtml = ReactDOMServer.renderToStaticMarkup(
    React.createElement(RadarChart, {
      metrics: [
        { label: 'Technical', score: 82 },
        { label: 'Communication', score: 78 },
        { label: 'Systems', score: 85 },
        { label: 'Problem Solving', score: 80 },
      ],
    })
  );
  assert.ok(radarHtml.includes('fill="url(#radar-grad)"'));
  assert.ok(!radarHtml.includes('fill="url(#radar-glow)"'));
});

test('Deep Audit Fix #7, #8, #9: Skip-turn filtering, full-round company context on results, and C++ starter templates across all tracks', () => {
  assert.ok(SKIP_TURN_REGEX.test('I would like to skip this question and move to the next one.'));
  assert.ok(SKIP_TURN_REGEX.test('[Candidate skipped question]'));

  const messagesWithSkip = [
    { role: 'assistant', content: 'How did you scale PostgreSQL?' },
    { role: 'user', content: 'I would like to skip this question and move to the next one.' },
    { role: 'assistant', content: 'How did you optimize Redis caching?' },
    {
      role: 'user',
      content: 'I implemented Redis cluster pipelining in Python, cutting p99 latency by 42% because of connection pooling.',
    },
  ];
  const benchmarks = buildQuestionBenchmarks(messagesWithSkip, 'Backend Systems');
  assert.equal(benchmarks.length, 1, 'Skipped turns must be excluded from Q&A benchmark matrix');
  assert.ok(benchmarks[0].question.includes('Redis'));

  const amazon = resolveCompanyProfile('Amazon');
  assert.ok(amazon);
  const resultsCompanyCtx = buildCompanyPromptContext(amazon, 'results');
  assert.ok(resultsCompanyCtx.includes('Round 1 Behavioral'));
  assert.ok(resultsCompanyCtx.includes('Round 2 Coding'));
  assert.ok(resultsCompanyCtx.includes('Round 3 Systems'));
  assert.ok(resultsCompanyCtx.includes('Round 4 STAR'));

  // Verify C++ starter code exists across every problem generator track
  const tracks = ['frontend', 'sql database', 'cloud kubernetes', 'machine learning ai', 'quant trading', 'iot embedded', 'cybersecurity', 'corporate finance', 'backend systems'];
  for (const track of tracks) {
    const fallbackProb = createSemanticFallbackProblem(track, 'normal');
    assert.ok(
      typeof fallbackProb.starterCode.cpp === 'string' && fallbackProb.starterCode.cpp.includes('#include'),
      `Missing C++ starter in createSemanticFallbackProblem for track "${track}"`
    );
    const dynamicProb = resolveDynamicCodingProblem('tech', track, 'cpp');
    assert.ok(
      typeof dynamicProb.starterCode === 'string' && dynamicProb.starterCode.includes('#include'),
      `Missing C++ starter in resolveDynamicCodingProblem for track "${track}"`
    );
  }
});

test('Deep Audit Fix #3, #5, #6, #11, #12, #13, #14: Static verification of runtime lifecycle & security guards', () => {
  const whiteboardSrc = fs.readFileSync(
    path.join(ROOT, 'src/components/interview/SystemDesignWhiteboard.tsx'),
    'utf8'
  );
  assert.ok(whiteboardSrc.includes('onTopologyChangeRef'), 'Whiteboard must store onTopologyChange in a ref to prevent 1s timer topology resets');

  const voiceHookSrc = fs.readFileSync(
    path.join(ROOT, 'src/app/interview/hooks/useInterviewVoice.ts'),
    'utf8'
  );
  assert.ok(voiceHookSrc.includes('useState(false)'), 'bargeInEnabled must default to false to prevent speaker self-interruption');
  assert.ok(voiceHookSrc.includes('previewAssistSpeech'), 'useInterviewVoice must expose previewAssistSpeech so assist preview does not hijack interviewer mouth/mic');
  assert.ok(voiceHookSrc.includes('isAssistPreviewSpeakingRef'), 'useInterviewVoice must guard rec.onend and rec.onresult with isAssistPreviewSpeakingRef during assist TTS preview');

  const gazeHookSrc = fs.readFileSync(
    path.join(ROOT, 'src/app/interview/hooks/useInterviewGaze.ts'),
    'utf8'
  );
  assert.ok(gazeHookSrc.includes('isTogglingCameraRef'), 'useInterviewGaze must guard concurrent toggleCameraPreview calls');
  assert.ok(gazeHookSrc.includes('[showCameraPreview, isInterviewActive, activeStage]'), 'Video stream re-bind effect must have explicit dependency array');

  const chatRouteSrc = fs.readFileSync(
    path.join(ROOT, 'src/app/api/interview/chat/route.ts'),
    'utf8'
  );
  assert.ok(chatRouteSrc.includes('negatedPositivePattern'), 'chat/route.ts must detect negated-positive phrases before testing positive verdict');

  const assistRouteSrc = fs.readFileSync(
    path.join(ROOT, 'src/app/api/interview/assist/route.ts'),
    'utf8'
  );
  assert.ok(assistRouteSrc.includes('sanitizedStar'), 'assist/route.ts must sanitize bulletPoints, deliveryGuide, and starBreakdown via sanitizeLLMOutput');
});
