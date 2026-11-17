import assert from 'node:assert';
import { getFallbackAssistScript } from '../../src/app/api/interview/assist/route';
import { buildFallbackAssistData } from '../../src/app/interview/components/AssistModeDrawer';

console.log('🧪 Running PinIT Question-Aware Assist Mode Verification Suite...\n');

// 1. Screenshot reproduction case: Trade-off question
const screenshotQuestion = "You made an insightful observation around scalable APIs. Looking back at that scenario, what is one key technical or process trade-off you would approach differently today? — Ms. Priya";

const assistTradeoffStandard = getFallbackAssistScript('round1_behavioral', 'Python', 'tech', 'standard', screenshotQuestion);
assert.strictEqual(assistTradeoffStandard.success, true);
assert.ok(
  !assistTradeoffStandard.script.includes('Hi! I am a full-stack software engineer with a strong focus on python'),
  'FAIL: Still returned the static introductory speech for a trade-off question!'
);
assert.ok(
  assistTradeoffStandard.script.toLowerCase().includes('trade-off') || assistTradeoffStandard.script.toLowerCase().includes('tradeoff'),
  'FAIL: Assist script must explicitly address the trade-off constraint'
);
assert.ok(
  assistTradeoffStandard.bulletPoints.some(b => b.toLowerCase().includes('trade-off') || b.toLowerCase().includes('architectural')),
  'FAIL: Bullet points must include trade-off advice'
);
console.log('  ✅ [PASS] Screenshot Question: Generated targeted trade-off script instead of bio');

// 2. Executive Level Trade-off
const assistTradeoffAdvanced = getFallbackAssistScript('round1_behavioral', 'Python', 'tech', 'advanced', screenshotQuestion);
assert.strictEqual(assistTradeoffAdvanced.success, true);
assert.ok(
  assistTradeoffAdvanced.script.includes('decoupling') || assistTradeoffAdvanced.script.includes('asynchronous') || assistTradeoffAdvanced.script.includes('locking'),
  'FAIL: Executive trade-off script should discuss architectural patterns'
);
console.log('  ✅ [PASS] Executive Level Trade-off: Discusses advanced architectural patterns');

// 3. Client Drawer Fallback Parity
const clientFallback = buildFallbackAssistData('round1_behavioral', 'Python', 'standard', false, screenshotQuestion);
assert.ok(
  !clientFallback.script.includes('Throughout my work in Python, I have focused on building production-grade systems'),
  'FAIL: Client fallback should not default to generic intro for trade-off'
);
assert.ok(
  clientFallback.script.toLowerCase().includes('trade-off'),
  'FAIL: Client fallback must produce trade-off script when offline'
);
console.log('  ✅ [PASS] Client Fallback Parity: buildFallbackAssistData returns trade-off script');

// 4. Incident / Bug / Outage Question
const failureQuestion = "Tell me about a time a production bug or outage occurred under your watch.";
const failureScript = getFallbackAssistScript('round1_behavioral', 'Cloud Systems', 'tech', 'standard', failureQuestion);
assert.ok(
  failureScript.script.toLowerCase().includes('incident') || failureScript.script.toLowerCase().includes('rollback') || failureScript.script.toLowerCase().includes('regression'),
  'FAIL: Did not produce incident response script for failure question'
);
console.log('  ✅ [PASS] Incident Question: Generated incident ownership and post-mortem script');

// 5. Conflict Question
const conflictQuestion = "Describe a situation where you had a strong technical disagreement with a team member.";
const conflictScript = getFallbackAssistScript('round1_behavioral', 'Software Engineering', 'tech', 'standard', conflictQuestion);
assert.ok(
  conflictScript.script.toLowerCase().includes('disagreed') || conflictScript.script.toLowerCase().includes('differing') || conflictScript.script.toLowerCase().includes('benchmark'),
  'FAIL: Did not produce conflict resolution script'
);
console.log('  ✅ [PASS] Conflict Question: Generated data-driven alignment and consensus script');

// 6. Genuine Intro Question
const introQuestion = "Welcome! Could you please introduce yourself and your background?";
const introScript = getFallbackAssistScript('round1_behavioral', 'Python', 'tech', 'standard', introQuestion);
assert.ok(
  introScript.script.includes('Hi! I am a full-stack software engineer') || introScript.script.includes('software engineer'),
  'FAIL: Intro question should still return clean professional introduction'
);
console.log('  ✅ [PASS] Intro Question: Produces crisp professional introduction');

// 7. Deadline & Speed vs Quality Question
const deadlineQuestion = "Under tight deadline pressure, how did you balance technical excellence against shipping speed?";
const deadlineScript = getFallbackAssistScript('round1_behavioral', 'Python', 'tech', 'standard', deadlineQuestion);
assert.ok(
  deadlineScript.script.toLowerCase().includes('deadline') || deadlineScript.script.toLowerCase().includes('prioritization') || deadlineScript.script.toLowerCase().includes('critical-path'),
  'FAIL: Did not produce deadline & prioritization script'
);
console.log('  ✅ [PASS] Deadline Question: Generates prioritization and scoping script');

// 8. Scalability & Latency Question
const scaleQuestion = "How do you approach database read bottlenecks and high-concurrency scaling?";
const scaleScript = getFallbackAssistScript('round1_behavioral', 'Python', 'tech', 'standard', scaleQuestion);
assert.ok(
  scaleScript.script.toLowerCase().includes('caching') || scaleScript.script.toLowerCase().includes('redis') || scaleScript.script.toLowerCase().includes('bottleneck'),
  'FAIL: Did not produce scalability script'
);
console.log('  ✅ [PASS] Scalability Question: Generates caching and concurrency script');

// 9. Metrics & Verification Question
const metricsQuestion = "What measurable signal or feedback confirmed to you that this decision was a success?";
const metricsScript = getFallbackAssistScript('round1_behavioral', 'Python', 'tech', 'standard', metricsQuestion);
assert.ok(
  metricsScript.script.toLowerCase().includes('telemetry') || metricsScript.script.toLowerCase().includes('metric') || metricsScript.script.toLowerCase().includes('kpi'),
  'FAIL: Did not produce telemetry/metrics script'
);
console.log('  ✅ [PASS] Metrics Question: Generates telemetry signal and validation script');

console.log('\n========================================');
console.log('All 9 Question-Aware Assist Tests Passed! (100%)');
console.log('========================================\n');
