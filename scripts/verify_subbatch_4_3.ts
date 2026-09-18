// scripts/verify_subbatch_4_3.ts
// Automated Verification Suite for Sub-Batch 4.3: Interview Questions, Problems, Assist, History & Chat

import * as dotenv from 'dotenv';
dotenv.config();

process.env.ALLOW_DEV_AUTH_BYPASS = 'true';
process.env.NEXTAUTH_SECRET = 'test-secret-key-for-hmac-verification';

import assert from 'assert';
import { POST as generateQuestionsRoute } from '../src/app/api/interview/generate-questions/route';
import {
  isUserInActiveLiveInterview,
  recordActiveLiveInterview,
  completeActiveLiveInterview,
  clearAllActiveSessionsForTesting
} from '../src/lib/interview/activeSessionRegistry';
import {
  createEvaluationSignature,
  verifyEvaluationSignature
} from '../src/lib/interview/evaluationSignature';
import { generateProgressiveFallbackQuestion } from '../src/app/api/interview/chat/route';
import { POST as assistRoute } from '../src/app/api/interview/assist/route';
import { POST as historyRoute } from '../src/app/api/interview/history/route';

async function runTests() {
  console.log('========================================================================');
  console.log('📦 VERIFYING SUB-BATCH 4.3: Questions, Problems, Assist, History & Chat');
  console.log('========================================================================\n');

  let passed = 0;
  let failed = 0;

  function pass(label: string) {
    console.log(`  ✅ [PASS] ${label}`);
    passed++;
  }

  function fail(label: string, err: any) {
    console.error(`  ❌ [FAIL] ${label}:`, err?.message || err);
    failed++;
  }

  const authHeaders = {
    authorization: 'Bearer test-token-bypass-001',
    'x-dev-user-id': 'test_user_001'
  };

  // -------------------------------------------------------------------------
  // Test 1: Generate Questions - No Solutions in Starter Code & Difficulty Respected
  // -------------------------------------------------------------------------
  console.log('── 1. Question Generator: No Leaked Solutions & Difficulty Respected ──');
  try {
    // 1.1 Easy Tech Questions
    const reqEasy = new Request('http://localhost/api/interview/generate-questions', {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ domainStream: 'tech', difficulty: 'easy' })
    });
    const resEasy = await generateQuestionsRoute(reqEasy);
    const dataEasy = await resEasy.json();
    assert.strictEqual(resEasy.status, 200);
    assert.strictEqual(dataEasy.difficulty, 'easy');
    assert.ok(Array.isArray(dataEasy.questions) && dataEasy.questions.length > 0);

    // Verify starter code does NOT contain working solutions
    for (const q of dataEasy.questions) {
      assert.ok(!q.defaultCode.includes('new StringBuilder(s).reverse()'), 'Easy starter code leaked reverse solution!');
      assert.ok(!q.defaultCode.includes('for(int val : arr) if(val > max)'), 'Easy starter code leaked findMax solution!');
      assert.ok(q.defaultCode.includes('// TODO: Implement your solution here'), 'Missing TODO stub in starter code');
    }
    pass('Easy technical questions have stubbed starter code without leaked solutions');

    // 1.2 Hard Tech Questions differs from Easy
    const reqHard = new Request('http://localhost/api/interview/generate-questions', {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ domainStream: 'tech', difficulty: 'hard' })
    });
    const resHard = await generateQuestionsRoute(reqHard);
    const dataHard = await resHard.json();
    assert.strictEqual(resHard.status, 200);
    assert.strictEqual(dataHard.difficulty, 'hard');
    assert.notStrictEqual(dataEasy.questions[0].title, dataHard.questions[0].title);
    assert.ok(dataHard.questions[0].title.includes('Hard'), 'Hard question does not carry Hard difficulty title');
    pass('Difficulty parameter is respected: Easy vs Hard technical question sets differ');

    // 1.3 Non-tech difficulty selection
    const reqNonTech = new Request('http://localhost/api/interview/generate-questions', {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ domainStream: 'non_tech', domainSubTopic: 'finance', difficulty: 'hard' })
    });
    const resNonTech = await generateQuestionsRoute(reqNonTech);
    const dataNonTech = await resNonTech.json();
    assert.strictEqual(dataNonTech.difficulty, 'hard');
    assert.ok(dataNonTech.questions[0].title.includes('LBO') || dataNonTech.questions[0].title.includes('Leveraged Buyout'));
    pass('Non-tech difficulty parameter selects tailored financial models (e.g. LBO for Hard)');
  } catch (err) {
    fail('Question generator validation failed', err);
  }

  // -------------------------------------------------------------------------
  // Test 2: Dynamic Problem Fallback - Stubbed Starter Code & Machine-Checkable Test Cases
  // -------------------------------------------------------------------------
  console.log('\n── 2. Dynamic Problem Fallback: Stubbed Code & Valid Test Cases ──');
  try {
    const problemRouteSource = await import('../src/app/api/interview/generate-problem/route');
    assert.ok(problemRouteSource.POST, 'POST exported from generate-problem');

    const reqProb = new Request('http://localhost/api/interview/generate-problem', {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ topic: 'Distributed Ingestion Engine', domainStream: 'tech', difficulty: 'normal' })
    });
    const resProb = await problemRouteSource.POST(reqProb);
    const probData = await resProb.json();

    assert.ok(probData.success || probData.title);
    const pythonCode = probData.starterCode?.python || '';
    const jsCode = probData.starterCode?.javascript || '';

    // Verify starter code does NOT contain solution algorithms
    assert.ok(!pythonCode.includes('valid_records = [x for x in items if x >= threshold]'), 'Leaked Python solution in starter code!');
    assert.ok(!jsCode.includes('items.filter(x => x >= threshold)'), 'Leaked JS solution in starter code!');
    assert.ok(pythonCode.includes('TODO') || pythonCode.includes('pass') || pythonCode.includes('return 0'), 'Python code missing clean stub');
    pass('Problem generator fallback produces clean function stubs without solution algorithms');

    // Verify testCases are machine-checkable (tuples and clean expected outputs)
    assert.ok(Array.isArray(probData.testCases) && probData.testCases.length >= 3);
    for (const tc of probData.testCases) {
      assert.ok(tc.input.startsWith('(') && tc.input.endsWith(')'), `Input '${tc.input}' is not an argument tuple`);
      assert.ok(!tc.expectedOutput.includes('count='), `Expected output '${tc.expectedOutput}' is prose rather than raw literal`);
      assert.ok(!tc.expectedOutput.includes('Handled Zero'), `Expected output '${tc.expectedOutput}' is prose description`);
    }
    pass('Problem generator testCases use standard argument tuples and machine-checkable literals');
  } catch (err) {
    fail('Dynamic problem generator test failed', err);
  }

  // -------------------------------------------------------------------------
  // Test 3: Assist Panel Gate - Anti-Cheat Live Interview Gating
  // -------------------------------------------------------------------------
  console.log('\n── 3. Assist Panel Gate: Active Live Interview Anti-Cheat ──');
  try {
    clearAllActiveSessionsForTesting();
    const testUserId = 'test_user_001';

    // Before interview starts: user is NOT in an active live interview
    assert.strictEqual(isUserInActiveLiveInterview(testUserId), false);

    // Live interview starts: candidate communicates in chat
    recordActiveLiveInterview(testUserId, 'Distributed Systems', 'round1_behavioral');
    assert.strictEqual(isUserInActiveLiveInterview(testUserId), true);
    pass('Active session registry detects live interview in progress');

    // Candidate attempts to bypass assist restriction by sending isPractice: true
    const cheatReq = new Request('http://localhost/api/interview/assist', {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        question: 'How do you design a distributed lock in Redis?',
        stage: 'round1_behavioral',
        topic: 'Distributed Systems',
        isPractice: true // ATTEMPTED CHEAT BYPASS
      })
    });

    const cheatRes = await assistRoute(cheatReq);
    const cheatData = await cheatRes.json();
    assert.strictEqual(cheatRes.status, 403, `Expected HTTP 403 but got ${cheatRes.status}`);
    assert.strictEqual(cheatData.code, 'ACTIVE_LIVE_INTERVIEW_IN_PROGRESS');
    pass('Assist route rejects spoofed isPractice: true with HTTP 403 during active live interview');

    // Completing the live interview clears the lock
    completeActiveLiveInterview(testUserId);
    assert.strictEqual(isUserInActiveLiveInterview(testUserId), false);
    pass('Completing the interview unlocks practice mode');
  } catch (err) {
    fail('Assist panel gate test failed', err);
  }

  // -------------------------------------------------------------------------
  // Test 4: Interview History - Cryptographic HMAC Signature & Tamper Defense
  // -------------------------------------------------------------------------
  console.log('\n── 4. Interview History: HMAC Evaluation Signature & Tamper Defense ──');
  try {
    const studentId = 'test_user_001';

    // 4.1 Signature generation and verification
    const validSig = createEvaluationSignature(studentId, 85, 'Hire');
    assert.ok(typeof validSig === 'string' && validSig.length === 64);
    assert.strictEqual(verifyEvaluationSignature(studentId, 85, 'Hire', validSig), true);
    assert.strictEqual(verifyEvaluationSignature(studentId, 99, 'Hire', validSig), false, 'Tampered score verified as valid!');
    assert.strictEqual(verifyEvaluationSignature(studentId, 85, 'Needs Work', validSig), false, 'Tampered verdict verified as valid!');
    pass('HMAC signature accurately binds studentId, score, and verdict');

    // 4.2 Empty transcript cannot claim score
    const emptyHistoryReq = new Request('http://localhost/api/interview/history', {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        score: 95,
        verdict: 'Exemplary',
        messages: [] // EMPTY TRANSCRIPT
      })
    });
    const emptyHistoryRes = await historyRoute(emptyHistoryReq);
    assert.strictEqual(emptyHistoryRes.status, 400);
    const emptyData = await emptyHistoryRes.json();
    assert.strictEqual(emptyData.code, 'EMPTY_TRANSCRIPT_SCORE_REJECTED');
    pass('History route rejects client claiming non-zero score with empty transcript (HTTP 400)');

    // 4.3 Unsigned spoofed score is authoritatively recalculated
    const spoofReq = new Request('http://localhost/api/interview/history', {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        score: 100, // SPOOFED SCORE
        verdict: 'Hire',
        radar: { logic: 40, systems: 40, comms: 40, solving: 40, star: 40 },
        messages: [{ role: 'user', content: 'Candidate spoken response.' }]
      })
    });
    const spoofRes = await historyRoute(spoofReq);
    const spoofData = await spoofRes.json();
    assert.strictEqual(spoofRes.status, 200);
    assert.notStrictEqual(spoofData.score, 100, 'Server accepted spoofed 100 score!');
    assert.strictEqual(spoofData.score, 40, `Authoritative recalculation expected 40, got ${spoofData.score}`);
    assert.strictEqual(spoofData.verified, false);
    pass('Unsigned score is recalculated authoritatively (100 spoof capped to real 40)');
  } catch (err) {
    fail('Interview history HMAC test failed', err);
  }

  // -------------------------------------------------------------------------
  // Test 5: Chat Route - Progressive Fallback Engine
  // -------------------------------------------------------------------------
  console.log('\n── 5. Chat Route: Progressive Fallback Conversation Engine ──');
  try {
    const topic = 'Distributed Systems';
    const interviewerName = 'Marcus Brody';

    // Turn 1
    const q1 = generateProgressiveFallbackQuestion({
      stage: 'round1_behavioral',
      subTopic: topic,
      history: [{ role: 'user', content: 'I am excited for this interview.' }],
      difficulty: 'normal',
      interviewerName
    });

    // Turn 2
    const q2 = generateProgressiveFallbackQuestion({
      stage: 'round1_behavioral',
      subTopic: topic,
      history: [
        { role: 'user', content: 'I am excited for this interview.' },
        { role: 'assistant', content: q1 },
        { role: 'user', content: 'My biggest challenge was fixing database deadlocks.' }
      ],
      difficulty: 'normal',
      interviewerName
    });

    // Turn 3
    const q3 = generateProgressiveFallbackQuestion({
      stage: 'round1_behavioral',
      subTopic: topic,
      history: [
        { role: 'user', content: 'I am excited for this interview.' },
        { role: 'assistant', content: q1 },
        { role: 'user', content: 'My biggest challenge was fixing database deadlocks.' },
        { role: 'assistant', content: q2 },
        { role: 'user', content: 'We resolved conflicts by having design review RFCs.' }
      ],
      difficulty: 'normal',
      interviewerName
    });

    assert.notStrictEqual(q1, q2, 'Turn 1 and Turn 2 asked identical question!');
    assert.notStrictEqual(q2, q3, 'Turn 2 and Turn 3 asked identical question!');
    assert.notStrictEqual(q1, q3, 'Turn 1 and Turn 3 asked identical question!');

    assert.ok(q1.includes('demanding challenge') || q1.includes('background'));
    assert.ok(q2.includes('conflicting priorities') || q2.includes('stakeholders'));
    assert.ok(q3.includes('did not go as expected') || q3.includes('initial plan'));
    pass('Progressive fallback asks sequentially distinct, logically advancing questions');

    // Systems round progression
    const qSys = generateProgressiveFallbackQuestion({
      stage: 'round3_systems',
      subTopic: topic,
      history: [{ role: 'user', content: 'Here is my architecture.' }],
      difficulty: 'normal',
      interviewerName
    });
    assert.ok(qSys.includes('data flow') || qSys.includes('edge gateway') || qSys.includes('persistent'));
    pass('Stage-specific questions adapt to systems topology and architectural trade-offs');
  } catch (err) {
    fail('Chat progressive fallback test failed', err);
  }

  console.log('\n========================================================================');
  console.log(`🏁 SUB-BATCH 4.3 RESULTS: ${passed} Passed, ${failed} Failed`);
  console.log('========================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(e => {
  console.error('Fatal sub-batch 4.3 test runner error:', e);
  process.exit(1);
});
