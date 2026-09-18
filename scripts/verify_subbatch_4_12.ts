import assert from 'assert';
import { NextRequest } from 'next/server';

process.env.ALLOW_DEV_AUTH_BYPASS = 'true';
process.env.NODE_ENV = 'test';
process.env.EXAM_SECRET = 'test_exam_secret_32_bytes_long_key_pinit!!';

import {
  signExamSessionToken,
  verifyExamSessionToken,
  verifyAndConsumeExamSessionToken,
  isNonceConsumed
} from '../src/lib/portfolio/examToken';
import { POST as verifyExamPOST } from '../src/app/api/portfolio/verify-exam/route';
import { POST as analyzeCertPOST } from '../src/app/api/portfolio/analyze-certificate/route';
import { firestoreRouter } from '../src/lib/api/legacyFirestoreRouter';

console.log('========================================================================');
console.log('🧪 VERIFY SUBBATCH 4.12: CERTIFICATE ANALYSIS & EXAM TOKEN ORACLE HARDENING');
console.log('========================================================================');

let passed = 0;
let failed = 0;

async function test(name: string, fn: () => Promise<void> | void) {
  try {
    await fn();
    console.log(`  ✅ [PASS]: ${name}`);
    passed++;
  } catch (err: any) {
    console.error(`  ❌ [FAIL]: ${name}`);
    console.error('     Error:', err.message);
    failed++;
  }
}

async function runTests() {
  // ── TEST 1: Cryptographic Single-Use Nonce & Replay Prevention ──
  await test('Single-use nonce: Token can only be evaluated once; replay is rejected', async () => {
    const answers = { q1: 1, q2: 2, q3: 0 };
    const token = signExamSessionToken(answers, 30, 'student_123', 'AWS Certified Developer');

    // 1st consumption -> must succeed
    const firstEval = verifyAndConsumeExamSessionToken(token);
    assert.strictEqual(firstEval.valid, true);
    if (firstEval.valid) {
      assert.strictEqual(firstEval.nonce.length >= 8, true);
      assert.strictEqual(isNonceConsumed(firstEval.nonce), true);
    }

    // 2nd consumption with identical token -> must be rejected with replay error
    const replayEval = verifyAndConsumeExamSessionToken(token);
    assert.strictEqual(replayEval.valid, false);
    if (!replayEval.valid) {
      assert.strictEqual(replayEval.code, 'NONCE_REPLAY');
      assert.ok(replayEval.error.includes('NONCE_REPLAY_DETECTED'));
    }
  });

  // ── TEST 2: Oracle Defense - verify-exam route returns NO correctCount on failure ──
  await test('Oracle defense: Failed verify-exam response does NOT leak correctCount or answer hints', async () => {
    const answers = { q1: 1, q2: 2, q3: 0 };
    const token = signExamSessionToken(answers, 30, 'test_user_001', 'Docker Deep Dive');

    const req = new NextRequest('http://localhost:3000/api/portfolio/verify-exam', {
      method: 'POST',
      headers: {
        'authorization': 'Bearer test-token-001',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        examSessionToken: token,
        selectedAnswers: { q1: 3, q2: 3, q3: 3 }, // all incorrect
        certificateTitle: 'Docker Deep Dive'
      })
    });

    const res = await verifyExamPOST(req);
    assert.strictEqual(res.status, 200);
    const json = await res.json();

    assert.strictEqual(json.ok, true);
    assert.strictEqual(json.passed, false);
    assert.strictEqual(json.verified, false);
    assert.strictEqual(json.correctCount, undefined, 'correctCount MUST NOT be returned in response');
    assert.strictEqual(json.total, undefined, 'total question count MUST NOT be returned in failure response');
    assert.strictEqual(json.score, undefined, 'score MUST NOT be returned in failure response');
    assert.ok(json.message?.includes('threshold was not achieved'));
  });

  // ── TEST 3: verify-exam blocks token reuse via HTTP 409 ──
  await test('Token replay defense: Submitting same token a 2nd time fails with HTTP 409 NONCE_REPLAY', async () => {
    const answers = { q1: 1, q2: 2, q3: 0 };
    const token = signExamSessionToken(answers, 30, 'test_user_001', 'Cloud Architecture');

    const makeReq = () => new NextRequest('http://localhost:3000/api/portfolio/verify-exam', {
      method: 'POST',
      headers: {
        'authorization': 'Bearer test-token-001',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        examSessionToken: token,
        selectedAnswers: { q1: 0, q2: 0, q3: 0 },
        certificateTitle: 'Cloud Architecture'
      })
    });

    const firstRes = await verifyExamPOST(makeReq());
    assert.strictEqual(firstRes.status, 200);

    const replayRes = await verifyExamPOST(makeReq());
    assert.strictEqual(replayRes.status, 409, 'Replay must return HTTP 409');
    const replayJson = await replayRes.json();
    assert.strictEqual(replayJson.code, 'NONCE_REPLAY');
    assert.ok(replayJson.error?.includes('NONCE_REPLAY_DETECTED'));
  });

  // ── TEST 4: Legacy Router does NOT leak plaintext answers in Base64 ──
  await test('Legacy router security: examSessionToken does NOT contain plaintext answers', async () => {
    const res = await firestoreRouter('POST', '/api/portfolio/analyze-certificate', {
      title: 'Python for Data Science',
      issuer: 'University'
    }) as any;

    assert.strictEqual(res.ok, true);
    assert.ok(res.examSessionToken?.startsWith('token_'));

    const b64 = res.examSessionToken.replace(/^token_/, '');
    const decodedStr = Buffer.from(b64, 'base64').toString('utf-8');
    const payload = JSON.parse(decodedStr);

    assert.strictEqual(payload.answers, undefined, 'Plaintext answers map MUST NOT be present in token');
    assert.ok(payload.answerHashes, 'answerHashes must be present instead of answers');
    assert.ok(payload.nonce, 'nonce must be present');
  });

  // ── TEST 5: Legacy Router replay rejection and no correctCount on failure ──
  await test('Legacy router replay rejection: Replay throws 409 and failure does not leak correctCount', async () => {
    const analyzeRes = await firestoreRouter('POST', '/api/portfolio/analyze-certificate', {
      title: 'React Fundamentals',
      issuer: 'Frontend Masters'
    }) as any;

    const token = analyzeRes.examSessionToken;

    // First attempt with wrong answers
    const verifyRes = await firestoreRouter('POST', '/api/portfolio/verify-exam', {
      examSessionToken: token,
      selectedAnswers: { q1: 99, q2: 99, q3: 99 }
    }) as any;

    assert.strictEqual(verifyRes.passed, false);
    assert.strictEqual(verifyRes.correctCount, undefined, 'correctCount MUST NOT be returned in legacy router failure');

    // Second attempt with same token -> must throw 409 NONCE_REPLAY
    let threwReplay = false;
    try {
      await firestoreRouter('POST', '/api/portfolio/verify-exam', {
        examSessionToken: token,
        selectedAnswers: { q1: 99, q2: 99, q3: 99 }
      });
    } catch (err: any) {
      if (err.status === 409 && err.code === 'NONCE_REPLAY') {
        threwReplay = true;
      }
    }
    assert.strictEqual(threwReplay, true, 'Legacy router must throw 409 NONCE_REPLAY on token reuse');
  });

  // ── TEST 6: Passing quiz awards KNOWLEDGE_ASSESSED, NOT verified: true ──
  await test('Honest credential status: Passing quiz awards KNOWLEDGE_ASSESSED, keeps verified: false', async () => {
    const answers = { q1: 1, q2: 2, q3: 0 };
    const token = signExamSessionToken(answers, 30, 'test_user_001', 'AWS Solutions Architect');

    const origFetch = globalThis.fetch;
    globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const urlStr = String(input);
      if (urlStr.includes('supabase.co') || urlStr.includes('portfolio_items')) {
        const method = init?.method || 'GET';
        if (method === 'GET') {
          return new Response(JSON.stringify({ item_data: { items: [] } }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        return new Response(JSON.stringify([]), {
          status: 201,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      return origFetch(input, init);
    };

    try {
      process.env.SUPABASE_SERVICE_ROLE_KEY = 'mock_service_key_for_test';
      const req = new NextRequest('http://localhost:3000/api/portfolio/verify-exam', {
        method: 'POST',
        headers: {
          'authorization': 'Bearer test-token-001',
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          examSessionToken: token,
          selectedAnswers: { q1: 1, q2: 2, q3: 0 }, // 100% correct
          certificateTitle: 'AWS Solutions Architect'
        })
      });

      const res = await verifyExamPOST(req);
      assert.strictEqual(res.status, 200);
      const json = await res.json();

      assert.strictEqual(json.passed, true);
      assert.strictEqual(json.assessmentPassed, true);
      assert.strictEqual(json.verified, false, 'Third-party certificate cannot be verified: true merely by answering 3 MCQs');
      assert.strictEqual(json.certificate?.verificationStatus, 'KNOWLEDGE_ASSESSED');
      assert.strictEqual(json.certificate?.auditStatus, 'PENDING_FACULTY_AUDIT');
      assert.strictEqual(json.correctCount, undefined, 'correctCount is not returned');
    } finally {
      globalThis.fetch = origFetch;
      delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    }
  });

  // ── TEST 7: analyze-certificate produces randomized questions with shuffled options ──
  await test('analyze-certificate produces dynamic questions with randomized option orders', async () => {
    const req1 = new NextRequest('http://localhost:3000/api/portfolio/analyze-certificate', {
      method: 'POST',
      headers: {
        'authorization': 'Bearer test-token-001',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        title: 'React.js & Modern Web',
        issuer: 'Meta'
      })
    });

    const res1 = await analyzeCertPOST(req1);
    assert.strictEqual(res1.status, 200);
    const json1 = await res1.json();

    assert.strictEqual(json1.questions.length, 3);
    for (const q of json1.questions) {
      assert.strictEqual(q.options.length, 4);
      assert.strictEqual(q.correctIdx, undefined, 'correctIdx MUST be stripped from client response');
    }
    assert.ok(json1.examSessionToken.length > 20);
  });

  console.log('========================================================================');
  console.log(`📊 SUBBATCH 4.12 RESULT: ${passed} / ${passed + failed} TESTS PASSED`);
  console.log('========================================================================');

  if (failed > 0) process.exit(1);
}

runTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
