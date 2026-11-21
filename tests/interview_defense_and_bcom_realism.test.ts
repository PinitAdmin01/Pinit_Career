import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import {
  advanceRoundDefense,
  buildConciseRoundIntro,
  buildDefenseFinalVerdictSpeech,
  DEFENSE_TOTAL_QUESTIONS,
  evaluateDefenseTurnPass,
  getFallbackDefenseQuestion,
  startRoundDefense,
} from '../src/lib/interview/roundDefenseEngine';
import { computeDeterministicEvaluation } from '../src/app/interview/interviewEvaluator';
import { InterviewResultsView } from '../src/app/interview/components/InterviewResultsView';
import { Round2CaseStudy, resolveCaseStudyData } from '../src/app/interview/components/Round2CaseStudy';
import { Round4StarDrill } from '../src/app/interview/components/Round4StarDrill';
import { formatReadinessBadge, getVerdictTone } from '../src/app/interview/interviewTypes';
import { evaluateSystemTopology } from '../src/lib/interview/systemDesignEvaluator';

const ROOT = process.cwd();

// ─── TASK 1 & TASK 3: 5-Question Post-Submission Defense & Forceful Elimination ──

test('Task 1 & 3: Answering all 5 defense questions substantively unlocks next round (passed)', () => {
  let state = startRoundDefense(2, 'code', 'Q1: Explain complexity');
  assert.equal(state.totalQuestions, DEFENSE_TOTAL_QUESTIONS);
  assert.equal(state.currentQuestionNumber, 1);
  assert.equal(state.status, 'in_progress');

  const answers = [
    'The loop runs in O(N) time and O(1) space because it makes a single linear pass over the array.',
    'If the array is empty it returns 0 safely, and exact threshold equality is handled by >=.',
    'At 10 million items I would stream chunks or partition across workers to prevent memory pressure.',
    'For concurrent API calls the function is pure with no shared mutable state, preventing race conditions.',
    'I would add property-based boundary tests for negative numbers, duplicates, and max integer thresholds.',
  ];

  for (let i = 0; i < 5; i++) {
    const check = evaluateDefenseTurnPass(answers[i], 'PASS');
    assert.equal(check.passed, true, `Substantive answer ${i + 1} should pass`);
    state = advanceRoundDefense(state, answers[i], check.passed, check.reason, `Q${i + 2}`);
  }

  assert.equal(state.status, 'passed');
  assert.equal(state.passedCount, 5);
  assert.equal(state.failedCount, 0);
  const speech = buildDefenseFinalVerdictSpeech(state);
  assert.match(speech, /5 out of 5|qualified for Round 3/i);
});

test('Task 1 & 3: Failing any defense question ("i dont know" / bluff) triggers elimination after Q5', () => {
  let state = startRoundDefense(3, 'architecture', 'Q1: Explain bottleneck');

  const answers = [
    'The Load Balancer distributes traffic across stateless API servers so no single instance becomes a bottleneck.',
    'i dont know', // Fails Q2 even if LLM were lenient!
    'Redis caching absorbs hot read spikes with a 60s TTL to protect the primary PostgreSQL database.',
    'Kafka buffers asynchronous writes so downstream workers stay decoupled with idempotent retries.',
    'I would track P99 latency, error rate, and queue lag with alerting thresholds.',
  ];

  for (let i = 0; i < 5; i++) {
    // Even if LLM mistakenly returned PASS on "i dont know", deterministic anti-bluff guard MUST fail it!
    const check = evaluateDefenseTurnPass(answers[i], 'PASS');
    if (i === 1) {
      assert.equal(check.passed, false, '"i dont know" must ALWAYS fail defense grading');
    }
    state = advanceRoundDefense(state, answers[i], check.passed, check.reason, `Q${i + 2}`);
  }

  assert.equal(state.status, 'eliminated');
  assert.equal(state.passedCount, 4);
  assert.equal(state.failedCount, 1);
  assert.ok(state.eliminationReason && state.eliminationReason.includes('4/5'));

  const verdictSpeech = buildDefenseFinalVerdictSpeech(state);
  assert.match(verdictSpeech, /not moving forward|concluding this interview session/i);
});

test('Task 1: Eliminated session produces Eliminated verdict & renders elimination banner in ResultsView', () => {
  const evalResult = computeDeterministicEvaluation({
    messages: [
      { role: 'assistant', content: 'Welcome to your Full-Stack Software Developer Corporate Interview!' },
      { role: 'user', content: 'I built a TypeScript and PostgreSQL invoicing service that cut API latency by 40%.' },
    ],
    codeSubmitted: true,
    latestTopology: null,
    starStep: 0,
    fillerWordCount: 0,
    eyeContactScore: null,
    wpmScore: null,
    activeTopicName: 'Full-Stack Software Developer',
    domainStream: 'tech',
    archetype: 'Pattern Hunter',
    eliminatedInRound: 2,
    eliminationReason: 'Cleared 3/5 defense questions in Round 2 (Code Review Defense); all 5 questions are required to advance.',
  });

  assert.equal(evalResult.verdict, 'Eliminated in Round 2');
  assert.equal(evalResult.readiness, 'Did Not Advance');

  const html = ReactDOMServer.renderToStaticMarkup(
    React.createElement(InterviewResultsView, {
      evaluationResult: evalResult,
      activeTopicName: 'Full-Stack Software Developer',
      codeSubmitted: true,
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

  assert.match(html, /data-testid="results-elimination-banner"/);
  assert.match(html, /Did Not Advance Past Round 2/);
});

test('Task 1 & 3: Concise round intros and 5-question fallbacks are strictly domain-aware (zero coding leaks for B.Com)', () => {
  const techR2Intro = buildConciseRoundIntro({
    roundNumber: 2,
    domainStream: 'tech',
    teacherName: 'Mr. Rohan',
    topic: 'Full-Stack Software Developer',
    problemTitle: 'Threshold Optimizer',
  });
  assert.match(techR2Intro, /5 questions on your code/i);

  const bcomR2Intro = buildConciseRoundIntro({
    roundNumber: 2,
    domainStream: 'non_tech',
    teacherName: 'Mr. Rohan',
    topic: 'Finance & Accounting (B.Com)',
    problemTitle: 'Apex Horizon FY25 Audit',
  });
  assert.match(bcomR2Intro, /5 focused questions/i);
  assert.equal(/\bcode\b|\balgorithm\b/i.test(bcomR2Intro), false);

  const bcomR3Intro = buildConciseRoundIntro({
    roundNumber: 3,
    domainStream: 'non_tech',
    teacherName: 'Mr. Vikram',
    topic: 'Finance & Accounting (B.Com)',
  });
  assert.match(bcomR3Intro, /5 questions on your design/i);

  for (let q = 1; q <= 5; q++) {
    const caseQ = getFallbackDefenseQuestion({ roundType: 'case', questionNumber: q, topic: 'Finance & Accounting (B.Com)' });
    const wfQ = getFallbackDefenseQuestion({ roundType: 'workflow', questionNumber: q, topic: 'Finance & Accounting (B.Com)' });
    assert.equal(/redis|load balancer|o\(n\)|python/i.test(caseQ), false, `B.Com Case Q${q} must not leak tech terms`);
    assert.equal(/redis|load balancer|o\(n\)|python/i.test(wfQ), false, `B.Com Workflow Q${q} must not leak tech terms`);
  }
});

// ─── TASK 2: Creative Real-Life B.Com Interview (India & Global) ─────────────

test('Task 2: All 4 B.Com tracks include India + Global standards, Exhibit B memos, Red-Flag/Journal entries, and Verdict pills', () => {
  const tracks = [
    'Banking & Credit Operations',
    'GST & Statutory Audit',
    'Digital Marketing & Growth',
    'Finance & Accounting (B.Com)',
  ];

  for (const track of tracks) {
    const c = resolveCaseStudyData(track);
    assert.ok(c.jurisdictionTag.length > 5, `${track} must specify real-world India/Global jurisdiction context`);
    assert.ok(c.memos.length >= 2, `${track} must include Exhibit B internal memos`);
    assert.ok(c.redFlagOptions.length >= 3, `${track} must include 3+ red-flag/journal options`);
    assert.equal(c.redFlagOptions.filter(o => o.isCorrect).length, 1, `${track} must have exactly 1 correct red-flag/journal entry`);
    assert.ok(c.verdictOptions.length >= 3, `${track} must include formal panel verdict options`);
    assert.equal(c.metrics.length, 4);
  }
});

test('Task 2 & 3: Round2CaseStudy SSR renders Case Folder Tabs, Red-Flag Journal section, and 5-Q Defense strip', () => {
  const defense = startRoundDefense(2, 'case', 'Question 1 of 5: Explain why Ind AS 115 requires reversing the ₹35L invoice.');
  const html = ReactDOMServer.renderToStaticMarkup(
    React.createElement(Round2CaseStudy, {
      domainStream: 'non_tech',
      currentCodingProb: {
        title: 'Finance & Accounting (B.Com)',
        description: 'Corporate Case Desk',
        starterCode: '',
      },
      onProceed: () => {},
      onReviewSolution: () => {},
      onRetryChallenge: () => {},
      canProceed: false,
      codeSubmitted: true,
      codeRunFailed: false,
      codeReviewStarted: true,
      codeReviewQuestionReady: true,
      defenseState: defense,
      isSendingInterviewMessage: false,
      lastInterviewerSpeech: defense.records[0].question,
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
      activeTeacher: { id: 'rohan', name: 'Mr. Rohan', emoji: '👨‍💻', title: 'Corporate Evaluator' },
      animState: 'idle',
      terminalLogs: [],
      setTerminalLogs: () => {},
      onSkipChallenge: () => {},
    })
  );

  assert.match(html, /data-testid="bcom-tab-workbench"/);
  assert.match(html, /data-testid="bcom-tab-exhibit_a"/);
  assert.match(html, /data-testid="bcom-tab-exhibit_b"/);
  assert.match(html, /data-testid="bcom-red-flag-section"/);
  assert.match(html, /data-testid="defense-progress-round2"/);
  assert.match(html, /Question 1 of 5/);
  assert.match(html, /Ind AS 115 \/ IFRS 15/);
});

test('Task 2 & 3: Round 3 B.Com Finance & Audit workflow evaluates accurately and penalizes spaghetti links', () => {
  const cleanFinanceFlow = evaluateSystemTopology(
    {
      nodeCount: 6,
      linkCount: 5,
      nodes: [
        { id: '1', type: 'Invoice / Voucher Intake', label: 'Invoice Intake' },
        { id: '2', type: '3-Way Match & Audit', label: '3-Way Match & Audit' },
        { id: '3', type: 'GST / Tax Engine', label: 'GST / GSTR-2B Engine' },
        { id: '4', type: 'General Ledger (Dr=Cr)', label: 'Double-Entry General Ledger' },
        { id: '5', type: 'Treasury & Bank Recon', label: 'Bank Recon & Treasury' },
        { id: '6', type: 'Financial Reporting (Ind AS/IFRS)', label: 'Ind AS / IFRS Reporting' },
      ],
      links: [
        { fromType: 'Invoice / Voucher Intake', toType: '3-Way Match & Audit', protocol: 'SLA Handoff' },
        { fromType: '3-Way Match & Audit', toType: 'GST / Tax Engine', protocol: 'Data Sync' },
        { fromType: 'GST / Tax Engine', toType: 'General Ledger (Dr=Cr)', protocol: 'Ledger Entry' },
        { fromType: 'General Ledger (Dr=Cr)', toType: 'Treasury & Bank Recon', protocol: 'Data Sync' },
        { fromType: 'General Ledger (Dr=Cr)', toType: 'Financial Reporting (Ind AS/IFRS)', protocol: 'KPI Loop' },
      ],
      hasLoadBalancer: false,
      hasCachingLayer: false,
      hasDatabase: false,
      hasQueue: false,
      isFullyConnected: true,
    },
    'Finance & Accounting (B.Com)',
    'non_tech'
  );

  assert.ok(cleanFinanceFlow.score >= 85, `Clean B.Com Finance & Audit workflow must score >= 85, got ${cleanFinanceFlow.score}`);

  const spaghettiFinanceFlow = evaluateSystemTopology(
    {
      nodeCount: 5,
      linkCount: 4,
      nodes: [
        { id: '1', type: 'Invoice / Voucher Intake', label: 'Invoice Intake' },
        { id: '2', type: '3-Way Match & Audit', label: '3-Way Match & Audit' },
        { id: '3', type: 'GST / Tax Engine', label: 'GST / Tax Engine' },
        { id: '4', type: 'General Ledger (Dr=Cr)', label: 'General Ledger' },
        { id: '5', type: 'Financial Reporting (Ind AS/IFRS)', label: 'Financial Reporting' },
      ],
      links: [
        { fromType: 'Invoice / Voucher Intake', toType: 'General Ledger (Dr=Cr)', protocol: 'Ledger Entry' },
        { fromType: 'General Ledger (Dr=Cr)', toType: 'Invoice / Voucher Intake', protocol: 'Ledger Entry' },
        { fromType: 'GST / Tax Engine', toType: 'Invoice / Voucher Intake', protocol: 'Data Sync' },
        { fromType: '3-Way Match & Audit', toType: 'Financial Reporting (Ind AS/IFRS)', protocol: 'KPI Loop' },
      ],
      hasLoadBalancer: false,
      hasCachingLayer: false,
      hasDatabase: false,
      hasQueue: false,
      isFullyConnected: true,
    },
    'Finance & Accounting (B.Com)',
    'non_tech'
  );

  assert.ok(spaghettiFinanceFlow.score < 60, `Spaghetti B.Com Finance workflow must be penalized (< 60), got ${spaghettiFinanceFlow.score}`);
});

test('Task 1 & 3: page.tsx and chat/route.ts wire 5-question defense and forceful elimination end-to-end', () => {
  const pageSrc = fs.readFileSync(path.join(ROOT, 'src/app/interview/page.tsx'), 'utf8');
  const chatSrc = fs.readFileSync(path.join(ROOT, 'src/app/api/interview/chat/route.ts'), 'utf8');

  assert.match(pageSrc, /startDefenseCrossExam\(/);
  assert.match(pageSrc, /triggerForcefulElimination\(/);
  assert.match(pageSrc, /defenseState=\{round2Defense\}/);
  assert.match(pageSrc, /defenseState=\{round3Defense\}/);
  assert.match(chatSrc, /DEFENSE_GRADE:\(PASS\|FAIL\)/);
  assert.match(chatSrc, /Ind AS \/ IFRS/);
});

test('Deep Audit Invariants: Elimination badge tone, Round 4 B.Com STAR cues, B.Com setup tracks, and voice domainStream sync', () => {
  assert.equal(getVerdictTone('Eliminated in Round 2'), 'negative');
  assert.equal(getVerdictTone('Eliminated in Round 3'), 'negative');
  assert.equal(formatReadinessBadge('Did Not Advance').tone, 'negative');

  const r4Html = ReactDOMServer.renderToStaticMarkup(
    React.createElement(Round4StarDrill, {
      domainStream: 'non_tech',
      activeTeacher: { id: 'aisha', name: 'Ms. Aisha', emoji: '👩‍🏫', title: 'Executive STAR & Case Evaluator' },
      animState: 'idle',
      showCameraPreview: false,
      videoPreviewRef: { current: null },
      eyeContactScore: null,
      wpmScore: null,
      lastInterviewerSpeech: 'Defend your FY25 audit recommendation.',
      finishInterview: () => {},
      canFinishInterview: false,
      manualTextInput: '',
      setManualTextInput: () => {},
      onSendMessage: () => {},
      starStep: 1,
    })
  );
  assert.match(r4Html, /analytical ownership|compliance\/credit/i);
  assert.equal(/engineering responsibility/i.test(r4Html), false, 'B.Com Round 4 must not show engineering cues');

  const setupSrc = fs.readFileSync(path.join(ROOT, 'src/app/interview/components/InterviewSetupView.tsx'), 'utf8');
  assert.match(setupSrc, /audit_gst/);
  assert.match(setupSrc, /banking_credit/);

  const voiceSrc = fs.readFileSync(path.join(ROOT, 'src/app/interview/hooks/useInterviewVoice.ts'), 'utf8');
  assert.match(voiceSrc, /\[activeStage, activeTopicName, domainStream, onSilenceNudge/);
});
