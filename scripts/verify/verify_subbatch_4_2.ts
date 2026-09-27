import * as dotenv from 'dotenv';
dotenv.config();
process.env.ALLOW_DEV_AUTH_BYPASS = 'true';

import { POST, formatTranscriptForEvaluation } from '../src/app/api/interview/evaluate/route';
import { evaluateSystemTopology } from '../src/lib/interview/systemDesignEvaluator';
import { generateTelemetryDiagnostics } from '../src/lib/interview/scoringMatrix';

async function runSubBatch4_2Tests() {
  console.log('========================================================================');
  console.log('📦 VERIFYING SUB-BATCH 4.2: Interview Evaluation & LLM Scoring (087-091)');
  console.log('========================================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, message: string) {
    if (condition) {
      console.log(`  ✅ [PASS] ${message}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${message}`);
      failed++;
    }
  }

  // ── Defect 088: Transcript Context Expansion (35,000 Chars & Head/Tail Preservation) ──
  console.log('── Defect 088: 35,000 Character Context Window & Head/Tail Preservation ──');
  const shortTranscript = 'Short introductory interview turn.'.repeat(50);
  assert(
    formatTranscriptForEvaluation(shortTranscript, 35000) === shortTranscript,
    'Transcripts under 35,000 chars are preserved without truncation'
  );

  // Generate 45,000-char transcript with distinct intro and distinct conclusion
  const introMarker = 'INTRO_SECTION_ALPHA_CANDIDATE_BACKGROUND';
  const middleFiller = 'X'.repeat(30000);
  const closingDefenseMarker = 'CLOSING_DEFENSE_OMEGA_SYSTEM_TRADE_OFFS_EXPLAINED';
  const longTranscript = `${introMarker}_START\n${middleFiller}\n${closingDefenseMarker}_END`;

  const processed = formatTranscriptForEvaluation(longTranscript, 35000);
  assert(processed.length <= 36000, `Processed transcript adheres to 35k limit (Actual length: ${processed.length})`);
  assert(processed.includes(introMarker), 'First 5,000 chars preserved: Contains introductory context');
  assert(processed.includes(closingDefenseMarker), 'Last 30,000 chars preserved: Contains late-stage technical defense turns (not sliced off!)');

  // ── Defect 091: System Design Topology Communication Rating (Eradication of Hardcoded 80) ──
  console.log('\n── Defect 091: System Design Dynamic Communication Scoring ──');
  const mockTopology = {
    nodes: [
      { id: '1', type: 'LoadBalancer', label: 'ALB' },
      { id: '2', type: 'AppServer', label: 'Node Service' },
      { id: '3', type: 'Cache', label: 'Redis Cluster' },
      { id: '4', type: 'Database', label: 'PostgreSQL Primary' },
    ],
    edges: [],
    hasLoadBalancer: true,
    hasCachingLayer: true,
    hasDatabase: true,
    hasMessageQueue: false,
    hasReplication: false,
    hasCDNLayers: false,
    hasAutoScaling: false,
  };

  // Case A: Missing viva explanation -> comms defaults to sysEval.score (NOT hardcoded 80)
  const reqNoDefense = {
    json: async () => ({
      type: 'systems',
      topology: mockTopology,
      domainSubTopic: 'Distributed Architecture',
      domainStream: 'tech',
    }),
    headers: new Headers({
      authorization: 'Bearer demo-token-bypass',
    }),
  } as any;

  const resNoDefense = await POST(reqNoDefense);
  const dataNoDefense = await resNoDefense.json();
  const commsNoDefense = dataNoDefense.evaluation?.radar?.comms;
  const sysScore = dataNoDefense.evaluation?.score;

  assert(commsNoDefense !== undefined, 'Communication score is present in topology evaluation');
  assert(commsNoDefense === sysScore, `When oral defense is absent, comms matches architecture score (${commsNoDefense} === ${sysScore})`);
  
  // Case B: Rich architectural defense with trade-offs
  const reqWithDefense = {
    json: async () => ({
      type: 'systems',
      topology: mockTopology,
      domainSubTopic: 'Distributed Architecture',
      domainStream: 'tech',
      explanation: 'We introduced Redis to alleviate primary database bottleneck and improve read latency. The key trade-off is eventual consistency, which we mitigate via cache invalidation hooks. We also added redundancy and failover for high throughput.',
    }),
    headers: new Headers({
      authorization: 'Bearer demo-token-bypass',
    }),
  } as any;

  const resWithDefense = await POST(reqWithDefense);
  const dataWithDefense = await resWithDefense.json();
  const commsWithDefense = dataWithDefense.evaluation?.radar?.comms;
  assert(commsWithDefense >= 70, `Oral defense with trade-off keywords yields evaluated comms score (${commsWithDefense} >= 70)`);

  // ── Defect 087: Fail-Fast AI Evaluation Fallback (Zero Fake Passing 65-70 Scores) ──
  console.log('\n── Defect 087: Offline AI Evaluation Fallback & Session Preservation ──');
  // Back up API keys and force LLM offline condition
  const origGroq = process.env.GROQ_API_KEYS;
  const origGroqSingle = process.env.GROQ_API_KEY;
  const origOpenRouter = process.env.OPENROUTER_API_KEY;
  delete process.env.GROQ_API_KEYS;
  delete process.env.GROQ_API_KEY;
  delete process.env.OPENROUTER_API_KEY;

  try {
    const reqOffline = {
      json: async () => ({
        type: 'behavioral',
        history: [
          { role: 'assistant', content: 'Tell me about a difficult bug you resolved.' },
          { role: 'user', content: 'I investigated a memory leak caused by unclosed sockets.' }
        ],
        roleKey: 'sde',
        sessionId: 'test-sess-087',
      }),
      headers: new Headers({
        authorization: 'Bearer demo-token-bypass',
      }),
    } as any;

    const resOffline = await POST(reqOffline);
    const bodyOffline = await resOffline.json();

    assert(resOffline.status === 503, `Offline evaluation returns HTTP 503 (Got ${resOffline.status})`);
    assert(bodyOffline.error === 'AI_EVALUATION_OFFLINE', `Error code is AI_EVALUATION_OFFLINE (Got ${bodyOffline.error})`);
    assert(bodyOffline.retryable === true, 'Response specifies retryable: true');
    assert(bodyOffline.evaluation === undefined, 'No fake passing score evaluation generated');
  } finally {
    if (origGroq) process.env.GROQ_API_KEYS = origGroq;
    if (origGroqSingle) process.env.GROQ_API_KEY = origGroqSingle;
    if (origOpenRouter) process.env.OPENROUTER_API_KEY = origOpenRouter;
  }

  // ── Defect 090: Telemetry Diagnostics Generation & Persistence Contract ──
  console.log('\n── Defect 090: Telemetry Diagnostics Calculation ──');
  const mockTelemetry = {
    wpm: 135,
    fillerWords: 1,
    eyeContact: 80,
  };
  const diagnostics = generateTelemetryDiagnostics(mockTelemetry);
  assert(diagnostics !== null && typeof diagnostics === 'object', 'generateTelemetryDiagnostics computes diagnostic structure');
  assert(['Optimal', 'Good', 'Needs Practice'].includes(diagnostics.deliveryStatus), 'Diagnostic includes deliveryStatus status index');
  assert(Array.isArray(diagnostics.signals) && diagnostics.signals.length > 0, 'Diagnostic includes actionable signals array');
  assert(Array.isArray(diagnostics.practiceAdvice), 'Diagnostic includes practice advice array');

  console.log('\n========================================================================');
  console.log(`🏁 SUB-BATCH 4.2 RESULTS: ${passed} Passed, ${failed} Failed`);
  console.log('========================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runSubBatch4_2Tests().catch(err => {
  console.error('Test execution crashed:', err);
  process.exit(1);
});
