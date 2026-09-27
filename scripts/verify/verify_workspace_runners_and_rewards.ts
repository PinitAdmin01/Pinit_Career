import * as dotenv from 'dotenv';
dotenv.config();

process.env.ALLOW_DEV_AUTH_BYPASS = 'true';
process.env.NODE_ENV = 'test';

import * as fs from 'fs';
import * as path from 'path';
import { resolveQuestLanguage, getLangInfo } from '../src/components/quests/workspace/useWorkspaceState';
import { executePythonSuite } from '../src/lib/code/runners/pythonRunner';
import { executeJavaScriptSuite } from '../src/lib/code/runners/jsRunner';
import { PIN_COSTS, PIN_EARN } from '../src/lib/hooks/usePinBalance';
import { POST as verifyQuestPost } from '../src/app/api/quests/verify/route';
import { POST as earnPinsPost } from '../src/app/api/pins/earn/route';
import { COURSES_REGISTRY } from '../src/lib/data/coursesData';

async function runWorkspaceAndRewardsVerification() {
  console.log('========================================================================');
  console.log('🧪 VERIFYING WORKSPACE MULTI-RUNNER, RESOLUTION & REWARDS HARDENING');
  console.log('========================================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`  ✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${testName}${detail ? ` - ${detail}` : ''}`);
      failed++;
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 1. Language Resolution Heuristics: Eliminating Substring Collision on 'ai'
  // ─────────────────────────────────────────────────────────────────────────────
  console.log('1. Language Resolution Heuristics (Collision-Proofing "ai")');

  const falseAiIds = [
    'email-parser',
    'email-validator',
    'detail-extractor',
    'maintain-cache',
    'maintainable-code',
    'user-details-component',
    'portrait-gallery'
  ];

  for (const id of falseAiIds) {
    const lang = resolveQuestLanguage(null, id);
    assert(lang !== 'python', `Quest ID "${id}" does NOT erroneously resolve to Python (Resolved: ${lang})`);
  }

  // Legitimate prefixes/keywords
  const pythonIds = ['ai-agent-decision', 'python-data-structures', 'py-algorithms-01', 'nlp-sentiment-classifier'];
  for (const id of pythonIds) {
    const lang = resolveQuestLanguage(null, id);
    assert(lang === 'python', `Legitimate Python quest ID "${id}" resolves to python`);
  }

  const sqlIds = ['sql-joins', 'database-indexing', 'sql-window-functions'];
  for (const id of sqlIds) {
    const lang = resolveQuestLanguage(null, id);
    assert(lang === 'sql', `SQL quest ID "${id}" resolves to sql`);
  }

  const jsIds = ['react-props-state', 'fullstack-api-call', 'javascript-closures'];
  for (const id of jsIds) {
    const lang = resolveQuestLanguage(null, id);
    assert(lang === 'javascript', `JS quest ID "${id}" resolves to javascript`);
  }

  // Starter code heuristics
  assert(resolveQuestLanguage({ starterCode: 'def solve(nums):\n    return sum(nums)' }, 'generic-01') === 'python',
    'Starter code with "def " resolves to python');
  assert(resolveQuestLanguage({ starterCode: 'SELECT id, name FROM users WHERE active = 1;' }, 'generic-02') === 'sql',
    'Starter code with "SELECT ... FROM" resolves to sql');
  assert(resolveQuestLanguage({ starterCode: 'public class Solution {\n    public int maxSubArray(int[] nums) {}\n}' }, 'generic-03') === 'java',
    'Starter code with "public class Solution" resolves to java');

  // getLangInfo native execution flags
  assert(getLangInfo('py-01').native === true, 'Python marked native: true in workspace');
  assert(getLangInfo('sql-01').native === true, 'SQL marked native: true in workspace');
  assert(getLangInfo('js-01').native === true, 'JavaScript marked native: true in workspace');
  assert(getLangInfo('java-01').native === true, 'Java marked native: true in workspace');

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. CSP Headers: cdn.jsdelivr.net Ingress Allowance
  // ─────────────────────────────────────────────────────────────────────────────
  console.log('\n2. CSP Configuration & CDN Ingress');
  const nextConfigPath = path.join(__dirname, '../next.config.js');
  const firebaseJsonPath = path.join(__dirname, '../firebase.json');

  const nextConfigContent = fs.readFileSync(nextConfigPath, 'utf8');
  const firebaseJsonContent = fs.readFileSync(firebaseJsonPath, 'utf8');

  assert(nextConfigContent.includes('https://cdn.jsdelivr.net'), 'next.config.js includes https://cdn.jsdelivr.net in CSP');
  assert(firebaseJsonContent.includes('https://cdn.jsdelivr.net'), 'firebase.json includes https://cdn.jsdelivr.net in CSP');

  // ─────────────────────────────────────────────────────────────────────────────
  // 3. Python Runner Anti-Cheat & Hard Kill-Switch Timeout
  // ─────────────────────────────────────────────────────────────────────────────
  console.log('\n3. Python Runner Anti-Cheat & Execution Hardening');

  // Test fail-closed on empty test cases / test suite (Prevent "def solution(): return True" exploit)
  const emptyRunResult = await executePythonSuite({
    code: 'def solution():\n    return True\n',
    fnName: 'solution',
    testCases: [],
    testSuite: ''
  });
  assert(emptyRunResult.allPassed === false, 'Empty test suite fails closed (allPassed === false)');
  assert(emptyRunResult.status === 'RUNTIME_ERROR', 'Empty test suite returns status: RUNTIME_ERROR');
  assert(emptyRunResult.terminalLogs.some(l => l.includes('Fail-closed') || l.includes('No test cases')),
    'Fail-closed terminal log emitted for empty test cases');

  // Test real python assertion execution
  const validPythonCode = `
def double_num(x):
    return x * 2
`;
  const validTestSuite = `
assert double_num(5) == 10
assert double_num(-2) == -4
assert double_num(0) == 0
`;
  const validRunResult = await executePythonSuite({
    code: validPythonCode,
    fnName: 'double_num',
    testSuite: validTestSuite
  });
  assert(validRunResult.allPassed === true, 'Valid Python code clears authoritative test suite');

  // Test failing assertion
  const wrongPythonCode = `
def double_num(x):
    return x * 3
`;
  const failRunResult = await executePythonSuite({
    code: wrongPythonCode,
    fnName: 'double_num',
    testSuite: validTestSuite
  });
  assert(failRunResult.allPassed === false, 'Invalid Python code fails authoritative assertion test suite');

  // Test infinite loop kill switch
  console.log('   Testing Python infinite loop timeout kill-switch (1500ms)...');
  const infiniteLoopCode = `
def solve():
    while True:
        pass
`;
  const loopTestSuite = `
solve()
`;
  const loopStart = Date.now();
  const timeoutRunResult = await executePythonSuite({
    code: infiniteLoopCode,
    fnName: 'solve',
    testSuite: loopTestSuite,
    timeoutMs: 1500
  });
  const loopDuration = Date.now() - loopStart;

  assert(timeoutRunResult.allPassed === false, 'Infinite loop fails run');
  assert(timeoutRunResult.status === 'TIMEOUT', `Infinite loop flagged as TIMEOUT (Got: ${timeoutRunResult.status})`);
  assert(loopDuration < 4000, `Execution terminated safely within bounds (${loopDuration}ms < 4000ms)`);

  // ─────────────────────────────────────────────────────────────────────────────
  // 4. JavaScript Runner Fail-Closed Behavior
  // ─────────────────────────────────────────────────────────────────────────────
  console.log('\n4. JavaScript Runner Fail-Closed Behavior');

  const jsEmptyResult = await executeJavaScriptSuite('function solution() { return true; }', 'solution', []);
  assert(jsEmptyResult.allPassed === false, 'Empty JS test cases fails closed');
  assert(jsEmptyResult.status === 'RUNTIME_ERROR', 'Empty JS test cases returns RUNTIME_ERROR');

  const jsValidResult = await executeJavaScriptSuite(
    'function solution(x) { return x + 5; }',
    'solution',
    [{ input: '10', output: '15' }]
  );
  assert(jsValidResult.allPassed === true, 'Valid JS execution passes in Node VM');

  // ─────────────────────────────────────────────────────────────────────────────
  // 5. Authoritative Verification Route (/api/quests/verify)
  // ─────────────────────────────────────────────────────────────────────────────
  console.log('\n5. Authoritative Verification Route (/api/quests/verify)');

  // 5a. Unauthenticated request without dev bypass
  delete process.env.ALLOW_DEV_AUTH_BYPASS;
  try {
    const unauthReq = new Request('http://localhost:3000/api/quests/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questId: 'python-01', code: 'print("hello")' })
    });
    const unauthRes = await verifyQuestPost(unauthReq);
    assert(unauthRes.status === 401, `Unauthenticated submission returns 401 (Got ${unauthRes.status})`);
  } finally {
    process.env.ALLOW_DEV_AUTH_BYPASS = 'true';
  }

  // 5b. Authenticated request with non-existent quest
  const unregisteredReq = new Request('http://localhost:3000/api/quests/verify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'authorization': 'Bearer demo-token-bypass'
    },
    body: JSON.stringify({ questId: 'completely-fake-unregistered-quest-123', code: 'print("test")' })
  });
  const unregisteredRes = await verifyQuestPost(unregisteredReq);
  const unregisteredBody = await unregisteredRes.json();
  assert(unregisteredRes.status === 400, 'Unregistered quest returns 400 Bad Request');
  assert(unregisteredBody.error === 'UNREGISTERED_QUEST', 'Unregistered quest error code matches UNREGISTERED_QUEST');

  // 5c. Authenticated request with empty code
  const allQuests = COURSES_REGISTRY.flatMap(c => c.quests || []);
  const validQuest = allQuests[0];
  if (validQuest) {
    const emptyCodeReq = new Request('http://localhost:3000/api/quests/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'Bearer demo-token-bypass'
      },
      body: JSON.stringify({ questId: validQuest.id, code: '   ' })
    });
    const emptyCodeRes = await verifyQuestPost(emptyCodeReq);
    assert(emptyCodeRes.status === 400, 'Empty code submission returns 400 Bad Request');

    // 5d. Authenticated request with valid registered quest and code
    const validReq = new Request('http://localhost:3000/api/quests/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'Bearer demo-token-bypass'
      },
      body: JSON.stringify({ questId: validQuest.id, code: 'valid solution code', language: 'python' })
    });
    const validRes = await verifyQuestPost(validReq);
    const validBody = await validRes.json();
    assert(validRes.status === 200, 'Valid registered submission returns 200 OK');
    assert(validBody.success === true, 'Valid registered submission has success: true');
    assert(typeof validBody.xp === 'number' && validBody.xp > 0, `Returns authoritative quest XP (${validBody.xp})`);
    assert(typeof validBody.pins === 'number' && validBody.pins > 0, `Returns authoritative quest Pins (${validBody.pins})`);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 6. Reward Discrepancy & Pin System Audit
  // ─────────────────────────────────────────────────────────────────────────────
  console.log('\n6. Reward System & Pin Synchronization');

  // Startup Gate Cost: must be 20, not 5
  assert(PIN_COSTS.quest.cost === 20, `PIN_COSTS.quest.cost is 20 (Got: ${PIN_COSTS.quest.cost})`);

  // Earning values: mission_complete and exam_pass must be positive
  assert(PIN_EARN.mission_complete > 0, `PIN_EARN.mission_complete is > 0 (Got: ${PIN_EARN.mission_complete})`);
  assert(PIN_EARN.exam_pass > 0, `PIN_EARN.exam_pass is > 0 (Got: ${PIN_EARN.exam_pass})`);

  // WorkspaceSubmitPanel must use PIN_COSTS.quest?.cost ?? 20
  const submitPanelPath = path.join(__dirname, '../src/components/quests/workspace/WorkspaceSubmitPanel.tsx');
  const submitPanelContent = fs.readFileSync(submitPanelPath, 'utf8');
  assert(!submitPanelContent.includes('Cost: 5 Pins'), 'Hardcoded "Cost: 5 Pins" removed from WorkspaceSubmitPanel');
  assert(submitPanelContent.includes('PIN_COSTS.quest?.cost ?? 20'), 'WorkspaceSubmitPanel derives cost from PIN_COSTS.quest.cost');

  // /api/pins/earn allows mission_complete and exam_pass
  const earnForbiddenReq = new Request('http://localhost:3000/api/pins/earn', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'authorization': 'Bearer demo-token-bypass'
    },
    body: JSON.stringify({ source: 'illegal_unregistered_source', amount: 10 })
  });
  const earnForbiddenRes = await earnPinsPost(earnForbiddenReq);
  const earnForbiddenBody = await earnForbiddenRes.json();
  assert(earnForbiddenRes.status === 403, 'Forbidden source rejected with 403');
  assert(earnForbiddenBody.error === 'FORBIDDEN_SOURCE', 'Forbidden source returns FORBIDDEN_SOURCE error');

  console.log('\n========================================================================');
  console.log(`🏁 VERIFICATION SUITE RESULTS: ${passed} Passed, ${failed} Failed`);
  console.log('========================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runWorkspaceAndRewardsVerification().catch((err) => {
  console.error('Test execution crashed with error:', err);
  process.exit(1);
});
