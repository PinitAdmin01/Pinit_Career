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
import { Round2Coding } from '../src/app/interview/components/Round2Coding';
import { Round2CaseStudy } from '../src/app/interview/components/Round2CaseStudy';
import { Round4StarDrill } from '../src/app/interview/components/Round4StarDrill';
import { InterviewResultsView } from '../src/app/interview/components/InterviewResultsView';
import { RadarChart } from '../src/app/interview/components/RadarChart';
import { InterviewVoiceHud } from '../src/app/interview/components/InterviewVoiceHud';
import { Round1Behavioral } from '../src/app/interview/components/Round1Behavioral';
import { getVerdictTone, formatReadinessBadge } from '../src/app/interview/interviewTypes';
import { normalizeAnswerQuality } from '../src/lib/interview/evaluationQuality';

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

test('Deep Tab Audit Round 2: Verdict/Readiness tone, RadarChart 0% label, evaluationQuality aliases, Round1 skip filtering, and Whiteboard/CSS/Security invariants', () => {
  // 1. Verdict & Readiness tone helpers (No Hire must never be green!)
  assert.equal(getVerdictTone('No Hire'), 'negative');
  assert.equal(getVerdictTone('Needs Practice'), 'negative');
  assert.equal(getVerdictTone('Conditional Hire'), 'conditional');
  assert.equal(getVerdictTone('Hire'), 'positive');
  assert.equal(getVerdictTone('Strong Hire'), 'positive');

  assert.deepEqual(formatReadinessBadge('strong'), { label: 'Strong Hire Ready', tone: 'positive' });
  assert.deepEqual(formatReadinessBadge('ready'), { label: 'Interview Ready', tone: 'positive' });
  assert.deepEqual(formatReadinessBadge('developing'), { label: 'Developing Readiness', tone: 'conditional' });
  assert.deepEqual(formatReadinessBadge('not_ready'), { label: 'Not Ready Yet', tone: 'negative' });

  // 2. normalizeAnswerQuality accepts snake_case dimension aliases and normalized whitespace/case while rejecting hallucinations
  const aq = normalizeAnswerQuality(
    {
      question_relevance: 84,
      answer_accuracy: 78,
      evidence: [
        {
          dimension: 'question_relevance',
          quote: 'we sharded postgres by tenant id',
          assessment: 'Directly addresses multi-tenant scaling.'
        },
        {
          dimension: 'answer_accuracy',
          quote: 'we deployed on mars orbital servers',
          assessment: 'Hallucinated quote that must be dropped.'
        }
      ]
    },
    ['We sharded   Postgres by tenant ID to isolate noisy neighbors.']
  );
  assert.ok(aq);
  assert.equal(aq.evidence.length, 1);
  assert.equal(aq.evidence[0].dimension, 'questionRelevance');

  // 3. RadarChart displays true 0% label (not 10%) and overflow:visible
  const zeroRadarHtml = ReactDOMServer.renderToStaticMarkup(
    React.createElement(RadarChart, {
      scores: { logic: 0, systems: 0, comms: 75, solving: 80, star: 60 },
      size: 160,
    })
  );
  assert.ok(zeroRadarHtml.includes('LOGIC (0%)'), 'Zero radar score must display 0%, not 10%');
  assert.ok(zeroRadarHtml.includes('overflow:visible'));

  // 4. InterviewResultsView renders evaluating banner, formatted readiness, and coral No Hire verdict
  const noHireHtml = ReactDOMServer.renderToStaticMarkup(
    React.createElement(InterviewResultsView, {
      evaluationResult: {
        score: 38,
        verdict: 'No Hire',
        readiness: 'not_ready',
        radar: { logic: 35, systems: 30, comms: 45, solving: 40, star: 40 },
      },
      isEvaluating: true,
      activeTopicName: 'Distributed Systems',
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
  assert.ok(noHireHtml.includes('data-testid="results-evaluating-banner"'));
  assert.ok(noHireHtml.includes('Not Ready Yet'));
  assert.ok(!noHireHtml.includes('>not_ready<'));
  assert.ok(noHireHtml.includes('color:var(--coral-mid)'), 'No Hire verdict must render in coral, not green');
  assert.ok(noHireHtml.includes('iv-results-hero'));

  // 5. Round1Behavioral excludes skip turns from progress counter, mirrors webcam, and shows live typing indicator
  const r1Html = ReactDOMServer.renderToStaticMarkup(
    React.createElement(Round1Behavioral, {
      activeTeacher: { id: 'priya', name: 'Ms. Priya', emoji: '👩‍💼', title: 'HR Director' },
      animState: 'thinking',
      showCameraPreview: true,
      videoPreviewRef: { current: null },
      eyeContactScore: 84,
      wpmScore: 132,
      isAvatarSpeaking: false,
      isVoiceListening: false,
      lastInterviewerSpeech: 'Tell me about a scaling trade-off.',
      onProceed: () => {},
      canProceed: false,
      isSendingInterviewMessage: true,
      fillerWordCount: 1,
      messages: [
        { role: 'assistant', content: 'Question 1' },
        { role: 'user', content: 'I would like to skip this question and proceed to the next topic.' },
        { role: 'assistant', content: 'Question 2' },
        { role: 'user', content: 'I would like to skip this question and proceed to the next topic.' },
      ],
      messagesEndRef: { current: null },
      manualTextInput: '',
      setManualTextInput: () => {},
      onSendMessage: () => {},
    })
  );
  assert.ok(r1Html.includes('Progress: 0/3 responses completed'), 'Skipped turns must not inflate Round 1 progress counter');
  assert.ok(r1Html.includes('scaleX(-1)'), 'Self-view webcam PiP must be horizontally mirrored');
  assert.ok(r1Html.includes('iv-subtitle-bar'), 'Round 1 must use height-capped theme-safe subtitle bar');
  assert.ok(r1Html.includes('data-testid="round1-typing-indicator"'), 'Round 1 must render typing indicator while waiting for interviewer reply');

  // 6. Static checks for Whiteboard mouse-connect bug fix, Monaco stale closure fix, Supabase transcript hydration, IDOR fix, and globals.css
  const wbSrc = fs.readFileSync(path.join(ROOT, 'src/components/interview/SystemDesignWhiteboard.tsx'), 'utf8');
  assert.ok(!wbSrc.includes("item.color + '44'"), 'Whiteboard must not concatenate hex alpha to CSS var() strings');
  assert.ok(!wbSrc.includes('window.confirm('), 'Whiteboard preset loader must use inline confirmation instead of window.confirm()');
  assert.ok(wbSrc.includes('deleteLink'), 'Whiteboard must support clicking arrows to delete connections');
  assert.ok(wbSrc.includes('growth_funnel') && wbSrc.includes('erp_ledger'), 'Whiteboard must offer domain-appropriate non-tech workflow presets');

  const r2Src = fs.readFileSync(path.join(ROOT, 'src/app/interview/components/Round2Coding.tsx'), 'utf8');
  assert.ok(r2Src.includes('runCodeAndTestsRef'), 'Round2Coding Monaco Ctrl+Enter command must invoke ref to avoid stale closure');

  const persistSrc = fs.readFileSync(path.join(ROOT, 'src/app/interview/hooks/useInterviewPersistence.ts'), 'utf8');
  assert.ok(persistSrc.includes('row.transcript ||'), 'Supabase session hydration must read row.transcript column');

  const historyApiSrc = fs.readFileSync(path.join(ROOT, 'src/app/api/interview/history/route.ts'), 'utf8');
  assert.ok(historyApiSrc.includes('existingRow.user_id !== userId'), 'Service-role history POST must verify session ownership before updating');

  const cssSrc = fs.readFileSync(path.join(ROOT, 'src/styles/globals.css'), 'utf8');
  assert.ok(!cssSrc.includes(":root.light [data-theme='light'] .iv-canvas-bg"), 'Broken light descendant selector must be fixed to comma selector');
  assert.ok(cssSrc.includes('.iv-setup-grid') && cssSrc.includes('.iv-assist-drawer') && cssSrc.includes('.iv-eval-report'));
});

test('Task 1 & 2 Intent Analysis & Natural Interview Spoken Dialogue Invariants', async () => {
  const { analyzeCandidateTurn, generateProgressiveFallbackQuestion, stripInterviewerSignoff } = await import('../src/app/api/interview/chat/route');
  const { ROUND_INTERVIEWERS } = await import('../src/app/interview/interviewTypes');

  // Roster invariant: Priya is platform mentor only, Round 1 interviewer is Ms. Sneha
  assert.equal(ROUND_INTERVIEWERS.round1_behavioral.id, 'sneha', 'Round 1 interviewer must be sneha');
  assert.equal(ROUND_INTERVIEWERS.round1_behavioral.name, 'Ms. Sneha');
  assert.ok(!Object.values(ROUND_INTERVIEWERS).some(iv => iv.id === 'priya'), 'Priya must never be in ROUND_INTERVIEWERS');

  // Strip interviewer sign-offs and prefixes
  assert.equal(stripInterviewerSignoff('Good point. What was the latency? — Ms. Priya'), 'Good point. What was the latency?');
  assert.equal(stripInterviewerSignoff('Great work! — Mr. Rohan'), 'Great work!');
  assert.equal(stripInterviewerSignoff('How did you scale Kafka? — Ms. Sneha (HR Director)'), 'How did you scale Kafka?');
  assert.equal(stripInterviewerSignoff('Ms. Sneha: Welcome to your interview.'), 'Welcome to your interview.');
  assert.equal(stripInterviewerSignoff('Mr. Rohan: Let us examine the test cases.'), 'Let us examine the test cases.');

  // Substring collision safety: capacity must NOT match cac, rapid must NOT match api
  const analysisCapacity = analyzeCandidateTurn('We evaluated database capacity and memory.', 'Software Engineering');
  assert.notEqual(analysisCapacity.keyTerm, 'cac', 'capacity must not trigger cac keyword');

  const analysisRapid = analyzeCandidateTurn('We practiced rapid prototyping and iteration.', 'Software Engineering');
  assert.notEqual(analysisRapid.keyTerm, 'api', 'rapid must not trigger api keyword');

  // Test 1: "in this scenario I don't know what to do" must classify as 'stuck', never praise or hallucinate success
  const analysis1 = analyzeCandidateTurn("in this scenario I don't know what to do", 'Software Engineering (SDE)');
  assert.equal(analysis1.intent, 'stuck', 'Must classify uncertainty as stuck');

  const reply1 = generateProgressiveFallbackQuestion({
    stage: 'round1_behavioral',
    subTopic: 'Software Engineering (SDE)',
    history: [
      { role: 'assistant', content: 'Tell me about a trade-off.' },
      { role: 'user', content: "in this scenario I don't know what to do" }
    ],
    difficulty: 'normal',
    interviewerName: 'Ms. Sneha'
  });

  assert.ok(!reply1.includes('focusing on focusing on'), 'Must never output duplicate focusing on prefixes');
  assert.ok(!reply1.includes('pragmatic decision'), 'Must never call being stuck a pragmatic decision');
  assert.ok(!reply1.includes('— Ms. Sneha'), 'Must not have robotic trailing sign-off');
  assert.ok(reply1.toLowerCase().includes('fine') || reply1.toLowerCase().includes('worries') || reply1.toLowerCase().includes('pivot') || reply1.toLowerCase().includes('step back'), 'Must provide empathetic pivot');

  // Test 2: "I don't know" must never be praised as a tackled success
  const analysis2 = analyzeCandidateTurn("I don't know", 'Software Engineering (SDE)');
  assert.equal(analysis2.intent, 'stuck');

  const reply2 = generateProgressiveFallbackQuestion({
    stage: 'round1_behavioral',
    subTopic: 'Software Engineering (SDE)',
    history: [
      { role: 'assistant', content: 'What was your metric?' },
      { role: 'user', content: "I don't know" }
    ],
    difficulty: 'normal',
    interviewerName: 'Ms. Sneha'
  });

  assert.ok(!reply2.includes('tackled I don\'t know'), 'Must never praise I don\'t know');
  assert.ok(!reply2.includes('confirmed to you and your team that this decision was a success'), 'Must never hallucinate success for I don\'t know');
  assert.ok(!reply2.endsWith('— Ms. Sneha'), 'Must not end with robotic sign-off');

  // Test 3: Broad intro with incomplete API description classifies as intro with keyTerm api
  const rawCandidateIntro = 'hi I am full stack software developer with a strong focus on software engineering in my recent projects I developed a API key which helps other uses to be there on a';
  const analysis3 = analyzeCandidateTurn(rawCandidateIntro, 'Software Engineering (SDE)');
  assert.equal(analysis3.intent, 'intro', 'Greeting intro should classify as intro');
  assert.equal(analysis3.keyTerm, 'api', 'Detected API in intro');

  const reply3 = generateProgressiveFallbackQuestion({
    stage: 'round1_behavioral',
    subTopic: 'Software Engineering (SDE)',
    history: [
      { role: 'assistant', content: 'Welcome!' },
      { role: 'user', content: rawCandidateIntro }
    ],
    difficulty: 'normal',
    interviewerName: 'Ms. Sneha'
  });

  assert.ok(!reply3.includes('focusing on hi am full stack'), 'Must not produce nonsense word slices');
  assert.ok(reply3.toLowerCase().includes('api') && (reply3.toLowerCase().includes('project') || reply3.toLowerCase().includes('contribution')), 'Must prompt for concrete project details on the API mentioned');
  assert.ok(!reply3.endsWith('— Ms. Sneha'), 'Must not end with robotic sign-off');

  // Test 4: Repeated "hi" (Task 6) must NEVER praise "your initial approach" or "pragmatic decision"
  const hiTurn1 = analyzeCandidateTurn('hi', 'Finance & Accounting (B.Com)');
  assert.equal(hiTurn1.intent, 'greeting');
  const hiTurn2 = analyzeCandidateTurn('hi', 'Finance & Accounting (B.Com)');
  assert.equal(hiTurn2.intent, 'greeting');
  const hiTurn3 = analyzeCandidateTurn('hi', 'Finance & Accounting (B.Com)');
  assert.equal(hiTurn3.intent, 'greeting');

  const replyHi2 = generateProgressiveFallbackQuestion({
    stage: 'round1_behavioral',
    subTopic: 'Finance & Accounting (B.Com)',
    history: [
      { role: 'assistant', content: 'Welcome to your interview.' },
      { role: 'user', content: 'hi' },
      { role: 'assistant', content: 'To get started, please walk me through your background.' },
      { role: 'user', content: 'hi' }
    ],
    difficulty: 'normal',
    interviewerName: 'Ms. Sneha'
  });
  assert.ok(!replyHi2.includes('pragmatic decision'), 'Repeated hi must never be praised as a pragmatic decision');
  assert.ok(!replyHi2.includes('initial approach'), 'Repeated hi must never be called an initial approach');
  assert.ok(!replyHi2.includes('— Ms. Sneha'), 'Must not include trailing signature');

  const replyHi3 = generateProgressiveFallbackQuestion({
    stage: 'round1_behavioral',
    subTopic: 'Finance & Accounting (B.Com)',
    history: [
      { role: 'assistant', content: 'Welcome to your interview.' },
      { role: 'user', content: 'hi' },
      { role: 'assistant', content: 'To get started, please walk me through your background.' },
      { role: 'user', content: 'hi' },
      { role: 'assistant', content: 'Please share your background.' },
      { role: 'user', content: 'hi' }
    ],
    difficulty: 'normal',
    interviewerName: 'Ms. Sneha'
  });
  assert.ok(!replyHi3.includes('tackled'), 'Must never say tackled for repeated hi');
  assert.ok(!replyHi3.includes('initial approach'), 'Must never say initial approach for repeated hi');
  assert.ok(!replyHi3.includes('pragmatic decision'), 'Must never say pragmatic decision for repeated hi');

  // Test 5: Candidate Readiness ("ok im ready") -> Must classify as readiness and welcome to start
  const analysisReady = analyzeCandidateTurn('ok im ready', 'Full-Stack Software Developer');
  assert.equal(analysisReady.intent, 'readiness', 'Must classify "ok im ready" as readiness');
  const replyReady = generateProgressiveFallbackQuestion({
    stage: 'round1_behavioral',
    subTopic: 'Full-Stack Software Developer',
    history: [{ role: 'assistant', content: 'Whenever you are ready, let us begin.' }, { role: 'user', content: 'ok im ready' }],
    difficulty: 'normal',
    interviewerName: 'Ms. Sneha'
  });
  assert.ok(!replyReady.includes('insightful observation around im ready'), 'Must never praise "im ready" as an insightful observation');
  assert.ok(replyReady.includes('dive right in') || replyReady.includes('introduce yourself'), 'Must invite candidate to start');

  // Test 6: Candidate Clarification ("can u exaplin in depth") -> Must classify as clarification
  const analysisClarify = analyzeCandidateTurn('can u exaplin in depth', 'Full-Stack Software Developer');
  assert.equal(analysisClarify.intent, 'clarification', 'Must classify "can u exaplin in depth" as clarification');
  const replyClarify = generateProgressiveFallbackQuestion({
    stage: 'round1_behavioral',
    subTopic: 'Full-Stack Software Developer',
    history: [{ role: 'assistant', content: 'What trade-off did you navigate?' }, { role: 'user', content: 'can u exaplin in depth' }],
    difficulty: 'normal',
    interviewerName: 'Ms. Sneha'
  });
  assert.ok(!replyClarify.includes('approach with u exaplin depth'), 'Must never treat explanation request as an approach');
  assert.ok(replyClarify.includes('simply') || replyClarify.includes('course'), 'Must clarify question gracefully');

  // Test 7: Candidate Coaching Request ("how to answer") -> Must classify as coaching_request
  const analysisCoaching = analyzeCandidateTurn('how to answer', 'Full-Stack Software Developer');
  assert.equal(analysisCoaching.intent, 'coaching_request', 'Must classify "how to answer" as coaching_request');
  const replyCoaching = generateProgressiveFallbackQuestion({
    stage: 'round1_behavioral',
    subTopic: 'Full-Stack Software Developer',
    history: [{ role: 'assistant', content: 'Tell me about a challenge.' }, { role: 'user', content: 'how to answer' }],
    difficulty: 'normal',
    interviewerName: 'Ms. Sneha'
  });
  assert.ok(replyCoaching.includes('STAR'), 'Must provide STAR framework coaching');

  // Test 8: Non-Developer / No-Experience Honesty (Never praise "practical perspective" or ask shipping speed)
  const noExp1 = analyzeCandidateTurn('I have not done any software course or anything project related things', 'Full-Stack Software Developer');
  assert.equal(noExp1.intent, 'no_experience', 'Must classify having done no course/project as no_experience');
  const replyNoExp1 = generateProgressiveFallbackQuestion({
    stage: 'round1_behavioral',
    subTopic: 'Full-Stack Software Developer',
    history: [
      { role: 'assistant', content: 'Could you walk me through your background?' },
      { role: 'user', content: 'I have not done any software course or anything project related things' }
    ],
    difficulty: 'normal',
    interviewerName: 'Ms. Sneha'
  });
  assert.ok(!replyNoExp1.includes('practical perspective'), 'Must never praise lack of experience as a practical perspective');
  assert.ok(!replyNoExp1.includes('shipping speed'), 'Must never ask how they balanced shipping speed');
  assert.ok(!replyNoExp1.includes('deadline pressure'), 'Must never ask about deadline pressure');
  assert.ok(replyNoExp1.toLowerCase().includes('educational background') || replyNoExp1.toLowerCase().includes('honesty') || replyNoExp1.toLowerCase().includes('fine') || replyNoExp1.toLowerCase().includes('starts somewhere'), 'Must respond supportively to honesty about background');

  const noExp2 = analyzeCandidateTurn("I don't have any tried it", 'Full-Stack Software Developer');
  assert.equal(noExp2.intent, 'no_experience', 'Must classify "don\'t have any tried it" as no_experience');

  const noExp3 = analyzeCandidateTurn('I am not a software developer', 'Full-Stack Software Developer');
  assert.equal(noExp3.intent, 'no_experience', 'Must classify "I am not a software developer" as no_experience');

  const noExp4 = analyzeCandidateTurn('I don\'t know I have not done anything till date I am just attending interview right now', 'Full-Stack Software Developer');
  assert.equal(noExp4.intent, 'no_experience', 'Must classify "just attending interview right now" as no_experience');

  // Test 9: Language Barrier & Communication Incomprehension (Never treat Telugu as a project success)
  const lang1 = analyzeCandidateTurn('Telugu you are saying something which are can\'t understand', 'Full-Stack Software Developer');
  assert.equal(lang1.intent, 'language_barrier', 'Must classify Telugu/cannot understand as language_barrier');
  const replyLang1 = generateProgressiveFallbackQuestion({
    stage: 'round1_behavioral',
    subTopic: 'Full-Stack Software Developer',
    history: [
      { role: 'assistant', content: 'Tell me about your technical challenges.' },
      { role: 'user', content: 'Telugu you are saying something which are can\'t understand' }
    ],
    difficulty: 'normal',
    interviewerName: 'Ms. Sneha'
  });
  assert.ok(!replyLang1.includes('highlighting that experience'), 'Must never praise language barrier as an experience');
  assert.ok(!replyLang1.includes('decision was a success'), 'Must never hallucinate success for language barrier');
  assert.ok(replyLang1.toLowerCase().includes('apologize') || replyLang1.toLowerCase().includes('simple') || replyLang1.toLowerCase().includes('reset'), 'Must simplify language and apologize for confusion');

  const lang2 = analyzeCandidateTurn('wait what what', 'Full-Stack Software Developer');
  assert.equal(lang2.intent, 'language_barrier', 'Must classify "wait what what" as language_barrier');
});

test('Task 4 & Task 7: Round 2 Non-Tech Case Study Studio and Skip Challenge integration', () => {
  // Test Round2CaseStudy SSR
  const caseStudyHtml = ReactDOMServer.renderToStaticMarkup(
    React.createElement(Round2CaseStudy, {
      domainStream: 'non_tech',
      currentCodingProb: {
        title: 'Accounting & Forensic Bookkeeping (B.Com)',
        description: 'Case study analysis',
        starterCode: ''
      },
      onProceed: () => {},
      onReviewSolution: () => {},
      onRetryChallenge: () => {},
      canProceed: false,
      codeSubmitted: false,
      codeRunFailed: false,
      codeReviewStarted: false,
      codeReviewQuestionReady: false,
      isSendingInterviewMessage: false,
      lastInterviewerSpeech: 'Welcome to your financial case study.',
      manualTextInput: '',
      setManualTextInput: () => {},
      onSendMessage: () => {},
      selectedLang: 'python',
      setSelectedLang: () => {},
      runCodeAndTests: () => {},
      isRunning: false,
      codeContent: '',
      setCodeContent: () => {},
      codeModifiedRef: { current: false },
      activeTeacher: { id: 'vikram', name: 'Mr. Vikram', emoji: '👨‍⚖️', title: 'Commerce, Finance & Systems Evaluator' },
      animState: 'idle',
      terminalLogs: [],
      setTerminalLogs: () => {},
      onSkipChallenge: () => {}
    })
  );

  assert.ok(caseStudyHtml.includes('APPLIED BUSINESS CASE STUDY'), 'Must render business case study heading');
  assert.ok(caseStudyHtml.includes('Financial Ledger &amp; Balance Data'), 'Must render financial ledger');
  assert.ok(caseStudyHtml.includes('Current Ratio'), 'Must render Current Ratio calculator');
  assert.ok(caseStudyHtml.includes('Quick Ratio'), 'Must render Quick Ratio calculator');
  assert.ok(!caseStudyHtml.includes('def finance_accounting'), 'Must NEVER render Python function stubs');
  assert.ok(!caseStudyHtml.includes('monaco-editor'), 'Must NEVER render Monaco Editor for non-tech case study');
  assert.ok(caseStudyHtml.includes('data-testid="round2-skip-challenge-btn"'), 'Must render Skip Case Study button');

  // Test Round2Coding SSR includes Skip Challenge button when provided
  const codingHtml = ReactDOMServer.renderToStaticMarkup(
    React.createElement(Round2Coding, {
      domainStream: 'tech',
      currentCodingProb: {
        title: 'Software Engineering (SDE) Algorithmic Pipeline',
        description: 'Algorithmic challenge',
        starterCode: 'def solution(): pass',
        testCases: [
          { name: 'Standard Case', tierLabel: '1. Standard Case' },
          { name: 'Large Scale', tierLabel: '2. Large Scale' }
        ]
      },
      onProceed: () => {},
      onReviewSolution: () => {},
      onRetryChallenge: () => {},
      canProceed: false,
      codeSubmitted: false,
      codeRunFailed: false,
      codeReviewStarted: false,
      codeReviewQuestionReady: false,
      isSendingInterviewMessage: false,
      lastInterviewerSpeech: 'Let us examine your code.',
      manualTextInput: '',
      setManualTextInput: () => {},
      onSendMessage: () => {},
      selectedLang: 'python',
      setSelectedLang: () => {},
      runCodeAndTests: () => {},
      isRunning: false,
      codeContent: 'def solution(): pass',
      setCodeContent: () => {},
      codeModifiedRef: { current: false },
      activeTeacher: { id: 'rohan', name: 'Mr. Rohan', emoji: '👨‍💻', title: 'Senior Technical Evaluator' },
      animState: 'idle',
      terminalLogs: [],
      setTerminalLogs: () => {},
      onSkipChallenge: () => {}
    })
  );

  assert.ok(codingHtml.includes('data-testid="round2-skip-challenge-btn"'), 'Must render Skip Challenge button in coding round');
  assert.ok(codingHtml.includes('TEST CASES'), 'Must render friendly TEST CASES label');

  // Test Non-Tech progression labels across Round 1, Round 2, and Header
  const round1NonTechHtml = ReactDOMServer.renderToStaticMarkup(
    React.createElement(Round1Behavioral, {
      domainStream: 'non_tech',
      activeTeacher: { id: 'sneha', name: 'Ms. Sneha', emoji: '👩‍💼', title: 'HR Director' },
      animState: 'idle',
      showCameraPreview: false,
      videoPreviewRef: { current: null },
      eyeContactScore: null,
      wpmScore: null,
      isAvatarSpeaking: false,
      isVoiceListening: false,
      lastInterviewerSpeech: 'Welcome to your behavioral round.',
      onProceed: () => {},
      canProceed: true,
      fillerWordCount: 0,
      messages: [
        { role: 'assistant', content: 'Tell me about yourself.' },
        { role: 'user', content: 'I have 3 years experience in accounting.' },
        { role: 'assistant', content: 'What was a major challenge?' },
        { role: 'user', content: 'Reconciling ledger entries.' },
        { role: 'assistant', content: 'How did you handle deadlines?' },
        { role: 'user', content: 'Prioritized quarterly accounts.' }
      ],
      messagesEndRef: { current: null },
      manualTextInput: '',
      setManualTextInput: () => {},
      onSendMessage: () => {}
    })
  );
  assert.ok(round1NonTechHtml.includes('Continue to case study ➔'), 'Round 1 non-tech must say Continue to case study, not Continue to coding');
  assert.ok(round1NonTechHtml.includes('Ready for Round 2 Case Study!'), 'Round 1 non-tech pill must announce Case Study');

  const headerNonTechHtml = ReactDOMServer.renderToStaticMarkup(
    React.createElement(InterviewSessionHeader, {
      activeTeacher: { id: 'sneha', name: 'Ms. Sneha', emoji: '👩‍💼', title: 'HR Director' },
      activeTopicName: 'Finance & Accounting (B.Com)',
      activeStage: 'round1_behavioral',
      domainStream: 'non_tech',
      elapsedSeconds: 120,
      formatElapsed: (s: number) => `2:00`,
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
      exitInterview: () => {}
    })
  );
  assert.ok(headerNonTechHtml.includes('Case Study'), 'Non-tech header must display Case Study for Round 2');
  assert.ok(headerNonTechHtml.includes('Strategy'), 'Non-tech header must display Strategy for Round 3');
});

test('5-Task Overhaul Verification: Settings Gear UI, Stage Scoping, Mic Lock, Priya Removal, and Gender-Matched 3D Rigs', async () => {
  const { scopeHistoryToStage } = await import('../src/app/api/interview/chat/route');
  const { transcriptForStage } = await import('../src/lib/interview/liveSession');
  const { resolveAvatarModelPaths } = await import('../src/components/avatar/VRoidAvatarEngine');

  // Task 1: Universal Settings Gear & clean top bar (no broken Skip Question button)
  const closedHeader = ReactDOMServer.renderToStaticMarkup(
    React.createElement(InterviewSessionHeader, {
      activeTeacher: { id: 'sneha', name: 'Ms. Sneha', emoji: '👩‍💼', title: 'HR Director' },
      activeTopicName: 'Full-Stack Software Developer',
      activeStage: 'round1_behavioral',
      domainStream: 'tech',
      domainSubTopic: 'software',
      isVoiceListening: false,
      elapsedSeconds: 30,
      formatElapsed: (s: number) => `0:${s}`,
      isScoredStage: true,
      isAssistModeActive: false,
      setIsAssistModeActive: () => {},
      messages: [],
      fetchAssistScript: () => {},
      avatarVolume: 85,
      handleVolumeChange: () => {},
      showCameraPreview: false,
      toggleCameraPreview: () => {},
      isAvatarSpeaking: false,
      interruptSpeech: () => {},
      exitInterview: () => {},
      bargeInEnabled: false,
      setBargeInEnabled: () => {},
      onSkipQuestion: () => {},
    })
  );
  assert.ok(closedHeader.includes('data-testid="header-settings-toggle"'), 'Header must render Settings gear toggle');
  assert.ok(!closedHeader.includes('data-testid="header-skip-btn"'), 'Top header must never render broken Skip Question button');
  assert.ok(!closedHeader.includes('data-testid="header-settings-menu"'), 'Settings popover must stay collapsed by default');

  const openHeader = ReactDOMServer.renderToStaticMarkup(
    React.createElement(InterviewSessionHeader, {
      activeTeacher: { id: 'rohan', name: 'Mr. Rohan', emoji: '👨‍💻', title: 'Tech Evaluator' },
      activeTopicName: 'Full-Stack Software Developer',
      activeStage: 'round2_coding',
      domainStream: 'tech',
      isVoiceListening: false,
      elapsedSeconds: 90,
      formatElapsed: (s: number) => `1:30`,
      isScoredStage: true,
      isAssistModeActive: true,
      setIsAssistModeActive: () => {},
      messages: [],
      fetchAssistScript: () => {},
      avatarVolume: 90,
      handleVolumeChange: () => {},
      showCameraPreview: true,
      toggleCameraPreview: () => {},
      isAvatarSpeaking: false,
      interruptSpeech: () => {},
      exitInterview: () => {},
      bargeInEnabled: false,
      setBargeInEnabled: () => {},
      defaultSettingsOpen: true,
    })
  );
  assert.ok(openHeader.includes('data-testid="header-settings-menu"'), 'Open settings popover must render');
  assert.ok(openHeader.includes('data-testid="header-assist-toggle"'), 'Settings popover must house Assist Mode toggle');
  assert.ok(openHeader.includes('data-testid="header-gaming-mode-toggle"'), 'Settings popover must house Gaming Focus toggle');
  assert.ok(openHeader.includes('data-testid="header-self-view-toggle"'), 'Settings popover must house Self-View toggle');
  assert.ok(openHeader.includes('data-testid="voice-barge-in-toggle"'), 'Settings popover must house Barge-In toggle');
  assert.ok(openHeader.includes('Interviewer Volume'), 'Settings popover must house Volume slider');

  const appShellSrc = fs.readFileSync(path.join(ROOT, 'src/components/ui/AppShell.tsx'), 'utf8');
  assert.ok(appShellSrc.includes('showGamingPill') && !appShellSrc.includes("top: 20,\n          left: '50%'"), 'Fullscreen pill must not overlap top header bar');

  // Task 2: Strict Stage History Scoping prevents Round 1 Python/BCA bleed into Round 3
  const mixedHistory = [
    { role: 'assistant', content: 'Welcome to your Full-Stack Software Developer Corporate Interview! I am Ms. Sneha.' },
    { role: 'user', content: 'I am pursuing BCA and I know Python.' },
    { role: 'assistant', content: 'Welcome to Round 3. I am Mr. Vikram, your systems interviewer.' },
    { role: 'user', content: 'What should I put on the whiteboard?' }
  ];
  const round3Scoped = scopeHistoryToStage(mixedHistory, 'round3_systems');
  assert.equal(round3Scoped.length, 2, 'Round 3 scope must drop all Round 1 Python/BCA turns');
  assert.ok(!round3Scoped.some(m => m.content.includes('pursuing BCA')), 'Round 3 scope must never retain Round 1 BCA message');

  const round4Scoped = scopeHistoryToStage(mixedHistory, 'round4_star');
  assert.equal(round4Scoped.length, 4, 'Round 4 executive review retains full cross-round context');

  const liveTranscript = [
    { role: 'assistant' as const, content: 'Welcome Round 1', stage: 'round1_behavioral', at: '2026-11-21T10:00:00Z' },
    { role: 'user' as const, content: 'I know Python and Flask', stage: 'round1_behavioral', at: '2026-11-21T10:01:00Z' },
    { role: 'assistant' as const, content: '[Round 3: System / Workflow Design begins]', stage: 'round3_systems', at: '2026-11-21T10:05:00Z' },
    { role: 'user' as const, content: 'How do I scale the API?', stage: 'round3_systems', at: '2026-11-21T10:06:00Z' }
  ];
  const r3Live = transcriptForStage({
    id: '00000000-0000-4000-8000-000000000001',
    user_id: 'u1',
    topic: 'Full-Stack Software Developer',
    domain_stream: 'tech',
    status: 'active',
    transcript: liveTranscript,
    evaluation: null,
    created_at: '2026-11-21T10:00:00Z',
    updated_at: '2026-11-21T10:06:00Z',
    evaluated_at: null
  }, 'round3_systems');
  assert.equal(r3Live.length, 2);
  assert.ok(!r3Live.some(t => t.content.includes('Python and Flask')));

  const chatRouteSrc = fs.readFileSync(path.join(ROOT, 'src/app/api/interview/chat/route.ts'), 'utf8');
  assert.ok(chatRouteSrc.includes('STRICT STAGE LOCK') && chatRouteSrc.includes('topologyContext'), 'Chat API must enforce STRICT STAGE LOCK and whiteboard topologyContext');

  // Task 3: Mic lock while interviewer reply is in flight & HUD disabled button
  const voiceHookSrc = fs.readFileSync(path.join(ROOT, 'src/app/interview/hooks/useInterviewVoice.ts'), 'utf8');
  assert.ok(voiceHookSrc.includes('isAwaitingReplyRef') && voiceHookSrc.includes('isMicBlocked') && voiceHookSrc.includes('speechEpochRef'), 'Voice hook must guard async mic restarts with isAwaitingReplyRef, isMicBlocked, and speechEpochRef');

  const sendingHudHtml = ReactDOMServer.renderToStaticMarkup(
    React.createElement(InterviewVoiceHud, {
      isVoiceListening: false,
      isAvatarSpeaking: false,
      isSendingInterviewerReply: true,
      activeTeacher: { id: 'sneha', name: 'Ms. Sneha', emoji: '👩‍💼', title: 'HR Director' },
      liveSpeechTranscript: '',
      stopVoiceListening: () => {},
      startVoiceListening: () => {},
      isSpeechSupported: true,
      isTabInactive: false
    })
  );
  assert.ok(sendingHudHtml.includes('Waiting for reply') && sendingHudHtml.includes('disabled'), 'Voice HUD mic action must disable while awaiting interviewer reply');

  // Task 4 & 5: Priya excluded from AI Interview & strictly gender/persona-matched 3D rigs
  assert.equal(resolveAvatarModelPaths('sneha')[0], '/avatar/avatarsample_j.glb');
  assert.ok(!resolveAvatarModelPaths('sneha').includes('/avatar/avatarsample_u.glb'));
  assert.ok(!resolveAvatarModelPaths('sneha').includes('/avatar/priya.glb'));
  assert.equal(resolveAvatarModelPaths('rohan')[0], '/avatar/avatarsample_v.glb');
  assert.ok(!resolveAvatarModelPaths('rohan').includes('/avatar/avatarsample_m.glb'));
  assert.equal(resolveAvatarModelPaths('vikram')[0], '/avatar/avatarsample_x.glb');
  assert.ok(!resolveAvatarModelPaths('vikram').includes('/avatar/avatarsample_m.glb'));
  assert.ok(!resolveAvatarModelPaths('aisha').includes('/avatar/avatarsample_u.glb'));
  assert.equal(resolveAvatarModelPaths('priya')[0], '/avatar/avatarsample_u.glb');

  const globalAvatarSrc = fs.readFileSync(path.join(ROOT, 'src/components/ui/GlobalAvatar.tsx'), 'utf8');
  assert.ok(globalAvatarSrc.includes('isLessonOrDetail || isInterview || isGroupDiscussion'), 'GlobalAvatar floating pill must hide across entire /interview route');

  const vroidInterviewSrc = fs.readFileSync(path.join(ROOT, 'src/components/avatar/VRoidInterviewAvatar.tsx'), 'utf8');
  assert.ok(vroidInterviewSrc.includes("teacherId = 'sneha'"), 'VRoidInterviewAvatar default teacherId must never be priya');
});
