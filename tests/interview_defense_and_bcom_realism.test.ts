import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import {
  advanceRoundDefense,
  advanceRound4State,
  buildConciseRoundIntro,
  buildDefenseFinalVerdictSpeech,
  buildRound4CompletionSpeech,
  createInitialRound4State,
  DEFENSE_REQUIRED_PASS_COUNT,
  DEFENSE_TOTAL_QUESTIONS,
  evaluateDefenseTurnPass,
  evaluateRound4AnswerAccuracy,
  getFallbackDefenseQuestion,
  startRoundDefense,
} from '../src/lib/interview/roundDefenseEngine';
import { computeDeterministicEvaluation } from '../src/app/interview/interviewEvaluator';
import { InterviewResultsView } from '../src/app/interview/components/InterviewResultsView';
import { Round2CaseStudy, resolveCaseStudyData } from '../src/app/interview/components/Round2CaseStudy';
import { Round4StarDrill } from '../src/app/interview/components/Round4StarDrill';
import { formatReadinessBadge, getVerdictTone } from '../src/app/interview/interviewTypes';
import { evaluateSystemTopology } from '../src/lib/interview/systemDesignEvaluator';
import {
  buildInterviewPortfolioEntries,
  calculateInterviewWeeklyXp,
  isSuccessfulInterviewForCareerSync,
  mergeInterviewIntoResumeContent,
} from '../src/lib/interview/interviewRewards';

const ROOT = process.cwd();

// ─── TASK 1 & TASK 4: 3-of-5 Post-Submission Defense & Forceful Elimination ──

test('Task 1 & 4: Answering 3 defense questions accurately unlocks next round immediately (Tech & B.Com)', () => {
  // Tech Round 2: 3/3 right away qualifies immediately
  let state = startRoundDefense(2, 'code', 'Q1: Explain complexity');
  assert.equal(state.totalQuestions, DEFENSE_TOTAL_QUESTIONS);
  assert.equal(state.requiredToPass, DEFENSE_REQUIRED_PASS_COUNT);
  assert.equal(state.currentQuestionNumber, 1);
  assert.equal(state.status, 'in_progress');

  const answers = [
    'The loop runs in O(N) time and O(1) space because it makes a single linear pass over the array.',
    'If the array is empty it returns 0 safely, and exact threshold equality is handled by >=.',
    'At 10 million items I would stream chunks or partition across workers to prevent memory pressure.',
  ];

  for (let i = 0; i < 3; i++) {
    const check = evaluateDefenseTurnPass(answers[i], 'PASS');
    assert.equal(check.passed, true, `Substantive answer ${i + 1} should pass`);
    state = advanceRoundDefense(state, answers[i], check.passed, check.reason, `Q${i + 2}`);
  }

  assert.equal(state.status, 'passed', 'Clearing 3 correct answers must immediately qualify for next round');
  assert.equal(state.passedCount, 3);
  assert.equal(state.failedCount, 0);
  const speech = buildDefenseFinalVerdictSpeech(state);
  assert.match(speech, /3-of-5|qualified for Round 3/i);

  // B.Com Round 2 Case Study: 2 misses + 3 accurate answers across Q1-Q5 STILL qualifies!
  let bcomState = startRoundDefense(2, 'case', 'Q1: Explain Ind AS 115 revenue cutoff');
  const bcomAnswers = [
    'i dont know',
    'Under Ind AS 115 we reverse premature billing because control has not transferred to the customer yet.',
    'skip',
    'DSO jumped above 95 days which squeezes working capital and increases bad-debt provision risk.',
    'We must reconcile GSTR-2B against the purchase register to protect Input Tax Credit compliance.',
  ];
  for (let i = 0; i < 5; i++) {
    const check = evaluateDefenseTurnPass(bcomAnswers[i], 'PASS');
    bcomState = advanceRoundDefense(bcomState, bcomAnswers[i], check.passed, check.reason, `Q${i + 2}`);
  }
  assert.equal(bcomState.status, 'passed', 'B.Com candidate clearing 3 of 5 questions must advance');
  assert.equal(bcomState.passedCount, 3);
  assert.equal(bcomState.failedCount, 2);
});

test('Task 1 & 4: Failing 3 defense questions (cannot reach 3/5) triggers elimination in Round 2 & 3', () => {
  let state = startRoundDefense(3, 'architecture', 'Q1: Explain bottleneck');

  const answers = [
    'The Load Balancer distributes traffic across stateless API servers so no single instance becomes a bottleneck.',
    'i dont know', // Fail 1
    'skip',        // Fail 2
    'no idea',     // Fail 3 -> mathematically impossible to reach 3/5 (max possible 2/5)
  ];

  for (let i = 0; i < answers.length; i++) {
    const check = evaluateDefenseTurnPass(answers[i], 'PASS');
    if (i >= 1) {
      assert.equal(check.passed, false, `Bluff/refusal answer "${answers[i]}" must fail even if LLM is lenient`);
    }
    state = advanceRoundDefense(state, answers[i], check.passed, check.reason, `Q${i + 2}`);
  }

  assert.equal(state.status, 'eliminated');
  assert.equal(state.passedCount, 1);
  assert.equal(state.failedCount, 3);
  assert.ok(state.eliminationReason && state.eliminationReason.includes('at least 3 of 5'));

  const verdictSpeech = buildDefenseFinalVerdictSpeech(state);
  assert.match(verdictSpeech, /not moving forward|concluding this interview session/i);
});

test('Task 2 & 4: Round 4 stops early at 3/3 accurate answers and hard-caps at 4-5 questions (Tech & B.Com)', () => {
  // Case A: Tech 3/3 full accuracy -> stops immediately after Q3 with closing speech
  let techR4 = createInitialRound4State();
  const strongTech = [
    'In our checkout microservice, P99 latency spiked to 900ms under flash traffic, so I implemented Redis caching and reduced P99 latency by 65%.',
    'My task was to prevent duplicate billing during retries, so I designed idempotency keys in PostgreSQL with row locks and achieved 0 duplicate charges.',
    'To handle 10x scale, I decoupled order writes via Kafka queues with dead-letter retries, improving throughput by 4x and maintaining 99.99% SLA uptime.',
  ];
  for (const ans of strongTech) {
    const ev = evaluateRound4AnswerAccuracy(ans, 'PASS');
    assert.equal(ev.accurate, true, `Strong STAR answer should pass accuracy: "${ans}"`);
    techR4 = advanceRound4State(techR4, ans, ev.accurate, ev.reason);
  }
  assert.equal(techR4.completed, true, 'Must stop immediately at Q3 when first 3 answers are fully accurate');
  assert.equal(techR4.completionReason, 'early_excellence');
  assert.equal(techR4.answeredCount, 3);
  assert.match(buildRound4CompletionSpeech(techR4, 'tech'), /interview is done/i);

  // Case B: B.Com 1 weak + 3 strong -> wraps cleanly at Q4 (4 questions)
  let bcomR4 = createInitialRound4State();
  const bcomAnswers = [
    'ok yes',
    'During statutory audit of ₹120 Cr revenue, I identified Ind AS 115 premature cutoff billing and led a ₹8 Cr rectification journal entry protecting compliance.',
    'When working capital DSO stretched by 35 days, I restructured receivable aging controls and recovered ₹15 Cr cash flow within one quarter.',
    'To prevent GSTR-2B Input Tax Credit mismatches, I implemented automated vendor reconciliation that reduced ITC leakage by 92% before quarterly filing.',
  ];
  for (const ans of bcomAnswers) {
    const ev = evaluateRound4AnswerAccuracy(ans, 'PASS');
    bcomR4 = advanceRound4State(bcomR4, ans, ev.accurate, ev.reason);
  }
  assert.equal(bcomR4.completed, true, 'Must complete at Q4 once 3 accurate answers are achieved');
  assert.equal(bcomR4.completionReason, 'standard_limit');
  assert.equal(bcomR4.answeredCount, 4);
  assert.match(buildRound4CompletionSpeech(bcomR4, 'non_tech'), /interview is done/i);

  // Case C: Weak answers across Q1-Q5 -> hard cap at 5 questions (never asks Q6!)
  let capR4 = createInitialRound4State();
  for (let i = 0; i < 5; i++) {
    const ev = evaluateRound4AnswerAccuracy('not sure about that', 'FAIL');
    assert.equal(ev.accurate, false);
    capR4 = advanceRound4State(capR4, 'not sure about that', ev.accurate, ev.reason);
  }
  assert.equal(capR4.completed, true, 'Must hard-stop at 5 questions');
  assert.equal(capR4.completionReason, 'max_limit');
  assert.equal(capR4.answeredCount, 5);
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
  assert.match(bcomR2Intro, /3 of 5 focused panel questions/i);
  assert.equal(/\bcode\b|\balgorithm\b/i.test(bcomR2Intro), false);

  const bcomR3Intro = buildConciseRoundIntro({
    roundNumber: 3,
    domainStream: 'non_tech',
    teacherName: 'Mr. Vikram',
    topic: 'Finance & Accounting (B.Com)',
  });
  assert.match(bcomR3Intro, /3 of 5 panel questions on your design/i);

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

  // Task 2 & 3 UI verification: Round 4 question-limit pill & Executive Results CSS
  const r4CompletedHtml = ReactDOMServer.renderToStaticMarkup(
    React.createElement(Round4StarDrill, {
      domainStream: 'non_tech',
      activeTeacher: { id: 'aisha', name: 'Ms. Aisha', emoji: '👩‍🏫', title: 'Executive STAR & Case Evaluator' },
      animState: 'idle',
      showCameraPreview: false,
      videoPreviewRef: { current: null },
      eyeContactScore: null,
      wpmScore: null,
      lastInterviewerSpeech: 'Your interview is done.',
      finishInterview: () => {},
      canFinishInterview: true,
      manualTextInput: '',
      setManualTextInput: () => {},
      onSendMessage: () => {},
      starStep: 3,
      round4State: {
        questionsAsked: 3,
        answeredCount: 3,
        accurateCount: 3,
        maxQuestions: 5,
        earlyPassTarget: 3,
        completed: true,
        completionReason: 'early_excellence',
        records: [],
      },
    })
  );
  assert.match(r4CompletedHtml, /data-testid="round4-question-limit-pill"/);
  assert.match(r4CompletedHtml, /Partner &amp; CFO STAR Deep Dive/);
  assert.match(r4CompletedHtml, /Interview Done/);

  const resHtml = ReactDOMServer.renderToStaticMarkup(
    React.createElement(InterviewResultsView, {
      evaluationResult: {
        score: 67,
        verdict: 'Conditional Hire',
        readiness: 'Developing Readiness',
        roleName: 'Software Development Engineer',
        summary: '3/4 rounds completed.',
        radar: { logic: 75, systems: 75, comms: 60, solving: 86, star: 83 },
        perRoundScores: {
          round1: { score: 0, status: 'skipped', verdict: 'Skipped' },
          round2: { score: 86, status: 'completed', verdict: 'Verified & Defended' },
          round3: { score: 75, status: 'completed', verdict: 'A' },
          round4: { score: 83, status: 'completed', verdict: 'Exemplary STAR' },
        },
        strengths: ['Strong coding defense'],
        improvements: ['Complete Round 1'],
      },
      activeTopicName: 'Full-Stack Software Developer',
      codeSubmitted: true,
      latestTopology: { nodes: [{ id: '1' }] },
      starStep: 3,
      wpmScore: null,
      fillerWordCount: 0,
      eyeContactScore: null,
      startInterview: () => {},
      exportInterviewTranscript: () => {},
      exitInterview: () => {},
    })
  );
  assert.match(resHtml, /iv-res-shell/);
  assert.match(resHtml, /iv-res-hero--conditional/);
  assert.match(resHtml, /iv-res-radar-card/);
  assert.match(resHtml, /iv-res-round-card/);
  assert.match(resHtml, /Grade A/, 'Bare grade "A" must render cleanly as "Grade A"');
  assert.match(resHtml, /data-testid="results-rewards-strip"/);
  assert.match(resHtml, /\+250 Weekly XP/, '67% score must display +250 Weekly XP');
  assert.match(resHtml, /data-testid="results-portfolio-sync-badge"/);
  assert.match(resHtml, /data-testid="results-resume-sync-badge"/);
});

test('Weekly XP Tiers & Resume/Portfolio Career Sync Invariants (Tech & B.Com)', () => {
  // Exact boundary table requested by user
  assert.equal(calculateInterviewWeeklyXp(100).xp, 1000, '100% -> 1000 XP');
  assert.equal(calculateInterviewWeeklyXp(99).xp, 500, '99% -> 500 XP');
  assert.equal(calculateInterviewWeeklyXp(90).xp, 500, '90% -> 500 XP');
  assert.equal(calculateInterviewWeeklyXp(89).xp, 350, '89% -> 350 XP');
  assert.equal(calculateInterviewWeeklyXp(75).xp, 350, '75% -> 350 XP');
  assert.equal(calculateInterviewWeeklyXp(74).xp, 250, '74% -> 250 XP');
  assert.equal(calculateInterviewWeeklyXp(60).xp, 250, '60% -> 250 XP');
  assert.equal(calculateInterviewWeeklyXp(59).xp, 220, '59% -> 220 XP');
  assert.equal(calculateInterviewWeeklyXp(50).xp, 220, '50% -> 220 XP');
  assert.equal(calculateInterviewWeeklyXp(49).xp, 120, '49% -> 120 XP');
  assert.equal(calculateInterviewWeeklyXp(35).xp, 120, '35% -> 120 XP');
  assert.equal(calculateInterviewWeeklyXp(34).xp, 0, '34% -> 0 XP');
  assert.equal(calculateInterviewWeeklyXp(0).xp, 0, '0% -> 0 XP');
  assert.equal(calculateInterviewWeeklyXp(85, { eliminated: true }).xp, 0, 'Eliminated -> 0 XP');

  // Career sync gate (Portfolio & Resume)
  assert.equal(isSuccessfulInterviewForCareerSync(50), true);
  assert.equal(isSuccessfulInterviewForCareerSync(49), false);
  assert.equal(isSuccessfulInterviewForCareerSync(80, { eliminated: true }), false);

  // Portfolio & Resume entry synthesis (B.Com / Non-Tech puts defended skills in professional bucket, deduped!)
  const input = {
    userId: 'u_123',
    sessionId: 'sess_bcom_01',
    topic: 'Finance & Accounting (B.Com)',
    roleName: 'Chartered Accounting & Financial Analyst',
    domainStream: 'non_tech' as const,
    score: 92,
    verdict: 'Strong Hire',
    defendedSkills: ['Ind AS 115', 'GST ITC Reconciliation', 'DSCR'],
    completedAtIso: '2026-11-22T10:00:00.000Z',
  };
  const entries = buildInterviewPortfolioEntries(input);
  assert.equal(entries.achievement.verified, true);
  assert.equal(entries.certificate.assessmentPassed, true);
  assert.equal(entries.certificate.score, 92);
  assert.equal(entries.timeline.category, 'milestone');

  const mergedOnce = mergeInterviewIntoResumeContent({ skills: { professional: 'Tally Prime, DSCR' } }, input);
  const mergedTwice = mergeInterviewIntoResumeContent(mergedOnce, input);
  assert.equal(mergedTwice.certificates.length, 1, 'Repeated sync must deduplicate resume certificates');
  assert.equal(mergedTwice.verifiedInterviews.length, 1, 'Repeated sync must deduplicate verifiedInterviews');
  assert.match(mergedTwice.skills.professional, /Tally Prime/);
  assert.match(mergedTwice.skills.professional, /Ind AS 115/);
  assert.equal((mergedTwice.skills.professional.match(/DSCR/g) || []).length, 1, 'Skills must deduplicate cleanly');
});
