import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { computeDeterministicEvaluation } from '../src/app/interview/interviewEvaluator';
import {
  buildQuestionBenchmarks,
  extractDefendedTechStack,
  isTrivialOrNonSubstantiveAnswer,
} from '../src/lib/interview/postInterviewInsights';
import { evaluateSystemTopology } from '../src/lib/interview/systemDesignEvaluator';
import { resolveCaseStudyData } from '../src/app/interview/components/Round2CaseStudy';
import { buildFallbackAssistData } from '../src/app/interview/components/AssistModeDrawer';
import { InterviewResultsView } from '../src/app/interview/components/InterviewResultsView';

const ROOT = process.cwd();

// ─── TASK 1: Zero Fake Floors / Real Evidence-Based Scoring ──────────────────

test('Task 1: Skipping all 4 rounds scores 0% everywhere with zero dummy strengths or fake telemetry', () => {
  const result = computeDeterministicEvaluation({
    messages: [
      { role: 'assistant', content: 'Welcome to your Full-Stack Software Developer Corporate Interview! Tell me about yourself.' },
      { role: 'user', content: '[Candidate skipped round]' },
      { role: 'assistant', content: 'Welcome to Round 2. Your challenge is to solve this algorithm.' },
      { role: 'user', content: '[Candidate skipped round]' },
      { role: 'assistant', content: 'Welcome to Round 3. Architect the production system.' },
      { role: 'user', content: '[Candidate skipped round]' },
      { role: 'assistant', content: 'Welcome to Round 4. Walk me through a STAR example.' },
      { role: 'user', content: '[Candidate skipped round]' },
    ],
    codeSubmitted: false,
    latestTopology: null,
    starStep: 0,
    fillerWordCount: 0,
    eyeContactScore: null,
    wpmScore: null,
    activeTopicName: 'Full-Stack Software Developer',
    domainStream: 'tech',
    archetype: 'Stabilizer',
    tabSwitchCount: 0,
    selectedLang: 'python',
    codeContent: '',
  });

  assert.equal(result.score, 0, `Expected 0% overall score for skipped session, got ${result.score}`);
  assert.equal(result.perRoundScores.round1.score, 0);
  assert.equal(result.perRoundScores.round2.score, 0);
  assert.equal(result.perRoundScores.round3.score, 0);
  assert.equal(result.perRoundScores.round4.score, 0);
  assert.equal(result.perRoundScores.round2.metric.includes('Manual code submitted'), false);
  assert.equal(result.strengths.length, 0, 'Skipped session must not fabricate archetype strengths');
  assert.equal(result.defendedTechStack.length, 0, 'Skipped session must not claim defended tech stack');
  assert.equal(result.coaching.tailoredStrengths.length, 0, 'Must not inject dummy Stabilizer strengths');
  // Speech clarity must say Not Measured when mic was off (not "0 filler words — Crisp vocal delivery")
  const clarityDiag = result.telemetryDiagnostics.signals.find((d: any) => d.metric.toLowerCase().includes('clarity'));
  assert.ok(clarityDiag, 'Delivery diagnostics must include Speech Clarity');
  assert.match(clarityDiag!.value, /Not Measured/i);
  assert.equal(clarityDiag!.status, 'info');
});

test('Task 1: Bare greeting ("hi my name is dev") scores <= 5% overall and <= 10% on Q1 (never 46% / 45%)', () => {
  assert.equal(isTrivialOrNonSubstantiveAnswer('hi my name is dev'), true);
  assert.equal(isTrivialOrNonSubstantiveAnswer('i dont know'), true);

  const messages = [
    { role: 'assistant' as const, content: 'Welcome to your Full-Stack Software Developer Corporate Interview! Walk me through your background and highlight one recent project.' },
    { role: 'user' as const, content: 'hi my name is dev' },
    { role: 'assistant' as const, content: 'Welcome to Round 2. Your challenge is ready.' },
    { role: 'user' as const, content: '[Candidate skipped round]' },
    { role: 'assistant' as const, content: 'Welcome to Round 3. Map the architecture.' },
    { role: 'user' as const, content: '[Candidate skipped round]' },
    { role: 'assistant' as const, content: 'Welcome to Round 4. Give a STAR defense.' },
    { role: 'user' as const, content: '[Candidate skipped round]' },
  ];

  const result = computeDeterministicEvaluation({
    messages,
    codeSubmitted: false,
    latestTopology: null,
    starStep: 0,
    fillerWordCount: 0,
    eyeContactScore: null,
    wpmScore: null,
    activeTopicName: 'Full-Stack Software Developer',
    domainStream: 'tech',
    archetype: 'Stabilizer',
    tabSwitchCount: 0,
    selectedLang: 'python',
    codeContent: '',
  });

  assert.ok(result.score <= 5, `Greeting-only interview must score <= 5%, got ${result.score}`);
  assert.ok(result.perRoundScores.round1.score <= 10, `Round 1 greeting must score <= 10%, got ${result.perRoundScores.round1.score}`);
  assert.equal(result.perRoundScores.round2.score, 0);
  assert.equal(result.perRoundScores.round3.score, 0);
  assert.equal(result.perRoundScores.round4.score, 0);

  const benchmarks = buildQuestionBenchmarks(messages, 'Full-Stack Software Developer', 'tech');
  assert.equal(benchmarks.length, 1);
  assert.ok(benchmarks[0].score <= 10, `Q1 greeting benchmark must score <= 10%, got ${benchmarks[0].score}`);
  assert.equal(benchmarks[0].round, 1);

  const stack = extractDefendedTechStack(messages, 'python', null, false);
  assert.equal(stack.includes('Python'), false, 'Unsubmitted selectedLang must not appear as defended tech');
});

test('Task 1 & 2: Complete substantive interview earns strong real score and 4 structured roundReports', () => {
  const messages = [
    { role: 'assistant' as const, content: 'Welcome to your Full-Stack Software Developer Corporate Interview! Tell me about a project.' },
    { role: 'user' as const, content: 'I built an event-driven billing API using TypeScript, Node.js, PostgreSQL, and Redis because synchronous webhooks caused 40% timeout spikes; switching to idempotent queues cut P99 latency by 62%.' },
    { role: 'assistant' as const, content: 'How did you handle database connection pooling under peak traffic?' },
    { role: 'user' as const, content: 'We deployed PgBouncer transaction pooling with strict 200ms query timeouts and read replicas, preventing pool exhaustion during 5x festive traffic bursts.' },
    { role: 'assistant' as const, content: 'Welcome to Round 2. Implement the threshold optimizer.' },
    { role: 'user' as const, content: 'My O(N) linear pass validates empty inputs first and compares each item against threshold with O(1) auxiliary space so large bursts finish under 2ms.' },
    { role: 'assistant' as const, content: 'Welcome to Round 3. Architect the production system.' },
    { role: 'user' as const, content: 'I placed a Load Balancer in front of stateless API services, added a Redis read-through cache for hot reads, and buffered writes through Kafka into PostgreSQL.' },
    { role: 'assistant' as const, content: 'Welcome to Round 4. Give your executive STAR defense.' },
    { role: 'user' as const, content: 'Situation: our checkout latency jumped 3x during a flash sale. Task: restore SLA under 150ms without downtime. Action: I profiled slow SQL queries, added composite indexes, and enabled Redis caching. Result: P99 latency dropped 58% and conversion recovered by 12%.' },
  ];

  const result = computeDeterministicEvaluation({
    messages,
    codeSubmitted: true,
    latestTopology: {
      nodeCount: 5,
      linkCount: 4,
      nodes: [
        { id: '1', type: 'Client App', label: 'Client App' },
        { id: '2', type: 'Load Balancer', label: 'Load Balancer' },
        { id: '3', type: 'API Microservice', label: 'API Service' },
        { id: '4', type: 'Redis Cache', label: 'Redis Cache' },
        { id: '5', type: 'PostgreSQL DB', label: 'PostgreSQL DB' },
      ],
      links: [
        { fromType: 'Client App', toType: 'Load Balancer', protocol: 'HTTPS/REST' },
        { fromType: 'Load Balancer', toType: 'API Microservice', protocol: 'HTTPS/REST' },
        { fromType: 'API Microservice', toType: 'Redis Cache', protocol: 'Redis Cache' },
        { fromType: 'API Microservice', toType: 'PostgreSQL DB', protocol: 'SQL Query' },
      ],
      hasLoadBalancer: true,
      hasCachingLayer: true,
      hasDatabase: true,
      hasQueue: false,
      isFullyConnected: true,
    },
    starStep: 4,
    fillerWordCount: 1,
    eyeContactScore: 86,
    wpmScore: 132,
    activeTopicName: 'Full-Stack Software Developer',
    domainStream: 'tech',
    archetype: 'Pattern Hunter',
    tabSwitchCount: 0,
    selectedLang: 'typescript',
    codeContent: 'function solve(items: number[], threshold: number) { return items.filter(x => x >= threshold).length; }',
  });

  assert.ok(result.score >= 70, `Substantive full interview should score >= 70%, got ${result.score}`);
  assert.equal(result.roundReports.length, 4);
  assert.deepEqual(
    result.roundReports.map(r => r.roundNumber),
    [1, 2, 3, 4]
  );
  assert.equal(result.roundReports[0].status, 'completed');
  assert.equal(result.roundReports[1].status, 'completed');
  assert.equal(result.roundReports[2].status, 'completed');
  assert.equal(result.roundReports[3].status, 'completed');
  assert.ok(result.roundReports[0].exchanges.length >= 2, 'Round 1 report must contain its Q&A exchanges');
  assert.ok(result.defendedTechStack.includes('TypeScript'), 'Submitted TypeScript should appear in defended stack');
  assert.ok(result.defendedTechStack.includes('Redis Cache'), 'Mentioned Redis should appear in defended stack');
});

// ─── TASK 2 & 3: Organized Executive Conclusion + Interactive Round Sheet ────

test('Task 2 & 3: InterviewResultsView renders Conclusion Overview + clickable Round 1-4 report tabs', () => {
  const evalResult = computeDeterministicEvaluation({
    messages: [
      { role: 'assistant', content: 'Welcome to your Full-Stack Software Developer Corporate Interview!' },
      { role: 'user', content: 'hi my name is dev' },
    ],
    codeSubmitted: false,
    latestTopology: null,
    starStep: 0,
    fillerWordCount: 0,
    eyeContactScore: null,
    wpmScore: null,
    activeTopicName: 'Full-Stack Software Developer',
    domainStream: 'tech',
    archetype: 'Stabilizer',
  });

  const html = ReactDOMServer.renderToStaticMarkup(
    React.createElement(InterviewResultsView, {
      evaluationResult: evalResult,
      activeTopicName: 'Full-Stack Software Developer',
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

  assert.match(html, /data-testid="report-tab-overview"/);
  assert.match(html, /data-testid="report-tab-round1"/);
  assert.match(html, /data-testid="report-tab-round2"/);
  assert.match(html, /data-testid="report-tab-round3"/);
  assert.match(html, /data-testid="report-tab-round4"/);
  assert.match(html, /data-testid="results-readiness-badge"/);
  assert.match(html, /data-testid="print-pdf-btn"/);
  assert.match(html, /Executive Conclusion/);
});

// ─── TASK 4: Realistic B.Com / Commerce Round 2 Case Study ───────────────────

test('Task 4: B.Com case studies use Indian INR context and never leak answers in formulaHint', () => {
  const topics = [
    'Banking & Credit Operations',
    'GST & Statutory Audit',
    'Digital Marketing & Growth',
    'Finance & Accounting (B.Com)',
  ];

  for (const topic of topics) {
    const c = resolveCaseStudyData(topic);
    assert.ok(c.financialTable.some(r => r.value.includes('₹')), `Topic "${topic}" should use INR (₹) financial exhibit`);
    assert.equal(c.metrics.length, 4, `Topic "${topic}" should have 4 quantitative metrics`);
    for (const m of c.metrics) {
      // Ensure formulaHint does NOT plug in the solved numerator/denominator values like "($90) / ($20)"
      assert.equal(
        /\$\d+/.test(m.formulaHint),
        false,
        `Formula hint for ${m.id} must not leak solved dollar amounts: ${m.formulaHint}`
      );
      assert.equal(
        /₹\d+/.test(m.formulaHint),
        false,
        `Formula hint for ${m.id} must not leak solved INR amounts: ${m.formulaHint}`
      );
    }
  }
});

test('Task 4: Non-Tech Round 2 submission bypasses Python/JS code runner and keeps submit button sticky', () => {
  const pageSrc = fs.readFileSync(path.join(ROOT, 'src/app/interview/page.tsx'), 'utf8');
  const caseSrc = fs.readFileSync(path.join(ROOT, 'src/app/interview/components/Round2CaseStudy.tsx'), 'utf8');
  const voiceSrc = fs.readFileSync(path.join(ROOT, 'src/app/interview/hooks/useInterviewVoice.ts'), 'utf8');

  assert.match(pageSrc, /if \(domainStream === 'non_tech'\)/);
  assert.match(caseSrc, /data-testid="case-audit-submit-btn"/);
  assert.match(caseSrc, /flexShrink:\s*0/);
  assert.match(caseSrc, /Enter calculated value/);
  assert.equal(caseSrc.includes('e.g. ${m.expected}'), false, 'Placeholder must never leak expected numeric answer');
  assert.match(voiceSrc, /domainStream\?:\s*'tech'\s*\|\s*'non_tech'/);
  assert.match(voiceSrc, /case analysis coming along/);
});

// ─── TASK 5: Round 3 Business Workflow Canvas & Evaluator Logic ──────────────

test('Task 5: Non-Tech spaghetti links are penalized and never awarded 98/100 (A+)', () => {
  const spaghetti = evaluateSystemTopology(
    {
      nodeCount: 7,
      linkCount: 6,
      nodes: [
        { id: '1', type: 'Target Audience', label: 'Target Audience' },
        { id: '2', type: 'Ad Campaign', label: 'Ad Campaign' },
        { id: '3', type: 'Landing Page', label: 'Landing Page' },
        { id: '4', type: 'Checkout Engine', label: 'Checkout Engine' },
        { id: '5', type: 'Logistics Hub', label: 'Logistics Hub' },
        { id: '6', type: 'Supplier Network', label: 'Supplier Network' },
        { id: '7', type: 'CRM / Support', label: 'CRM / Support' },
      ],
      links: [
        // Illogical stage jumps mimicking user screenshot 4 & 5
        { fromType: 'Target Audience', toType: 'Logistics Hub', protocol: 'HTTPS/REST' },
        { fromType: 'Landing Page', toType: 'Supplier Network', protocol: 'HTTPS/REST' },
        { fromType: 'Ad Campaign', toType: 'CRM / Support', protocol: 'HTTPS/REST' },
        { fromType: 'Supplier Network', toType: 'Target Audience', protocol: 'HTTPS/REST' },
        { fromType: 'Logistics Hub', toType: 'Ad Campaign', protocol: 'HTTPS/REST' },
        { fromType: 'Checkout Engine', toType: 'Target Audience', protocol: 'HTTPS/REST' },
      ],
      hasLoadBalancer: false,
      hasCachingLayer: false,
      hasDatabase: false,
      hasQueue: false,
      isFullyConnected: false,
    },
    'Digital Marketing & Growth',
    'non_tech'
  );

  assert.ok(spaghetti.score < 70, `Spaghetti non-tech workflow must be penalized (< 70), got ${spaghetti.score}`);
  assert.notEqual(spaghetti.grade, 'A+');
  assert.ok(spaghetti.bottlenecks.length >= 1, 'Spaghetti workflow must report concrete bottlenecks');
  assert.equal(spaghetti.spokenFeedback.toLowerCase().includes('client tier'), false, 'Non-tech spoken feedback must not leak tech jargon');
  assert.equal(spaghetti.spokenFeedback.toLowerCase().includes('distributed components'), false);
});

test('Task 5: Cleanly ordered Non-Tech business funnel scores >= 85 with non-tech spoken feedback', () => {
  const cleanFunnel = evaluateSystemTopology(
    {
      nodeCount: 8,
      linkCount: 7,
      nodes: [
        { id: '1', type: 'Target Audience', label: 'Target Audience' },
        { id: '2', type: 'Ad Campaign', label: 'Ad Campaign' },
        { id: '3', type: 'Landing Page', label: 'Landing Page' },
        { id: '4', type: 'Checkout Engine', label: 'Checkout Engine' },
        { id: '5', type: 'Logistics Hub', label: 'Logistics Hub' },
        { id: '6', type: 'Supplier Network', label: 'Supplier Network' },
        { id: '7', type: 'CRM / Support', label: 'CRM / Support' },
        { id: '8', type: 'Retention Loop', label: 'Retention Loop' },
      ],
      links: [
        { fromType: 'Target Audience', toType: 'Ad Campaign', protocol: 'Funnel Flow' },
        { fromType: 'Ad Campaign', toType: 'Landing Page', protocol: 'Funnel Flow' },
        { fromType: 'Landing Page', toType: 'Checkout Engine', protocol: 'Funnel Flow' },
        { fromType: 'Checkout Engine', toType: 'Logistics Hub', protocol: 'SLA Handoff' },
        { fromType: 'Supplier Network', toType: 'Logistics Hub', protocol: 'SLA Handoff' },
        { fromType: 'Logistics Hub', toType: 'CRM / Support', protocol: 'Data Sync' },
        { fromType: 'CRM / Support', toType: 'Retention Loop', protocol: 'KPI Loop' },
      ],
      hasLoadBalancer: false,
      hasCachingLayer: false,
      hasDatabase: false,
      hasQueue: false,
      isFullyConnected: true,
    },
    'Digital Marketing & Growth',
    'non_tech'
  );

  assert.ok(cleanFunnel.score >= 85, `Well-ordered business funnel should score >= 85, got ${cleanFunnel.score}`);
  assert.ok(cleanFunnel.scalabilityRating >= 75, `Clean funnel should earn high growth leverage, got ${cleanFunnel.scalabilityRating}`);
  assert.ok(cleanFunnel.reliabilityRating >= 75, `Clean funnel should earn high ops continuity, got ${cleanFunnel.reliabilityRating}`);
  assert.equal(cleanFunnel.spokenFeedback.toLowerCase().includes('redis'), false);
  assert.equal(cleanFunnel.spokenFeedback.toLowerCase().includes('load balancer'), false);
});

test('Task 5: Whiteboard defaults non_tech protocol to Funnel Flow, and Assist Mode has zero Redis/CDN leaks for non_tech', () => {
  const wbSrc = fs.readFileSync(
    path.join(ROOT, 'src/components/interview/SystemDesignWhiteboard.tsx'),
    'utf8'
  );
  const assistRouteSrc = fs.readFileSync(
    path.join(ROOT, 'src/app/api/interview/assist/route.ts'),
    'utf8'
  );

  assert.match(wbSrc, /domainStream === 'non_tech' \? 'Funnel Flow' : 'HTTPS\/REST'/);
  assert.match(wbSrc, /Business Workflow:/);
  assert.match(wbSrc, /Evaluate Workflow/);
  assert.match(wbSrc, /CRM & Retention/);
  assert.match(assistRouteSrc, /if \(stage === 'round3_systems'\)[\s\S]*if \(stream === 'non_tech'\)/);

  const nonTechAssistR3 = buildFallbackAssistData('round3_systems', 'Digital Marketing & Growth', 'standard', false, '', 'non_tech');
  assert.equal(nonTechAssistR3.script.toLowerCase().includes('redis'), false);
  assert.equal(nonTechAssistR3.script.toLowerCase().includes('load balancer'), false);
  assert.equal(nonTechAssistR3.script.toLowerCase().includes('cdn'), false);
  assert.match(nonTechAssistR3.script, /workflow|funnel|retention/i);

  const nonTechAssistR2 = buildFallbackAssistData('round2_coding', 'Finance & Accounting (B.Com)', 'standard', true, '', 'non_tech');
  assert.equal(nonTechAssistR2.script.toLowerCase().includes('algorithm'), false);
  assert.match(nonTechAssistR2.script, /Exhibit A|financial|ratio/i);
});
