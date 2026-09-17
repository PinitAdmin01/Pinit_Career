process.env.NODE_ENV = 'test';
process.env.ALLOW_DEV_AUTH_BYPASS = 'true';

import assert from 'assert';
import { GET as analyticsGET, POST as analyticsPOST } from '@/app/api/attention-span/analytics/route';
import { GET as leaderboardGET, POST as leaderboardPOST } from '@/app/api/attention-span/leaderboard/route';
import { GET as progressGET, POST as progressPOST, computeIntegrityHash } from '@/app/api/attention-span/progress/route';
import { sanitizeDisplayName } from '@/lib/attention/progress';

async function runTests() {
  console.log('========================================================================');
  console.log('📦 VERIFYING SUB-BATCH 4.4: Attention-Span Persistence, PII & Rate Limit');
  console.log('========================================================================\n');

  const testUser = 'test_user_001';
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer test-token-${testUser}`,
  };

  // ── 1. Analytics Persistence (Zero in-memory cold start loss) ──
  console.log('── 1. Analytics Persistence: Cold-Start Data Retention ──');
  const postLogRes = await analyticsPOST(
    new Request('http://localhost:3000/api/attention-span/analytics', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        dailyLog: { date: '2026-09-17', focusMinutes: 45, gamesPlayed: 6 },
        monthlySummary: { month: '2026-09', totalFocusHours: 12 },
      }),
    })
  );
  const postLogData = await postLogRes.json();
  assert.strictEqual(postLogData.ok, true, 'Analytics POST must succeed');
  assert.strictEqual(postLogData.analytics.dailyLogs['2026-09-17'].focusMinutes, 45);

  const getLogRes = await analyticsGET(
    new Request('http://localhost:3000/api/attention-span/analytics', {
      method: 'GET',
      headers,
    })
  );
  const getLogData = await getLogRes.json();
  assert.strictEqual(getLogData.ok, true, 'Analytics GET must succeed');
  assert.strictEqual(getLogData.analytics.dailyLogs['2026-09-17'].focusMinutes, 45, 'Analytics must be retrieved from persistent storage');
  console.log('  ✅ [PASS] Analytics logs persist and are retrievable across requests');

  // ── 2. Leaderboard: Zero Email / PII Leakage ──
  console.log('\n── 2. Leaderboard: Zero Email / PII Leakage ──');
  assert.strictEqual(sanitizeDisplayName('alice.student@ivy.edu'), 'Alice.student');
  assert.strictEqual(sanitizeDisplayName('bob@gmail.com'), 'Bob');
  assert.strictEqual(sanitizeDisplayName('Charlie Brown'), 'Charlie Brown');
  assert.strictEqual(sanitizeDisplayName(''), 'Student');
  console.log('  ✅ [PASS] sanitizeDisplayName strictly strips email domains');

  const submitScoreRes = await leaderboardPOST(
    new Request('http://localhost:3000/api/attention-span/leaderboard', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        displayName: 'test.player@stanford.edu',
        accuracyEarned: 85,
      }),
    })
  );
  const submitScoreData = await submitScoreRes.json();
  assert.strictEqual(submitScoreData.ok, true, 'Leaderboard POST must succeed');
  assert.strictEqual(submitScoreData.addedAccuracy, 85, 'Added accuracy must match earned score');

  // Verify that in the leaders list, no leader has an email address (@) in their displayName
  submitScoreData.leaders.forEach((l: any) => {
    assert.ok(!l.displayName.includes('@'), `Leaderboard must never leak email addresses. Found: ${l.displayName}`);
  });
  console.log('  ✅ [PASS] Leaderboard entries never leak student email addresses or @ domains');

  // ── 3. Leaderboard: Rate Limiting & Score Capping ──
  console.log('\n── 3. Leaderboard: Rate Limiting & Per-Submission Capping ──');
  // Attempt to submit inflated score (+500)
  const overCapRes = await leaderboardPOST(
    new Request('http://localhost:3000/api/attention-span/leaderboard', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        accuracyEarned: 500,
      }),
    })
  );
  const overCapData = await overCapRes.json();
  assert.strictEqual(overCapData.addedAccuracy, 100, 'Score submissions must be capped at 100 max points per submission');
  console.log('  ✅ [PASS] Arbitrary score submissions are clamped to 100 max');

  // Exhaust rate limit by sending repeated requests
  let hitRateLimit = false;
  for (let i = 0; i < 20; i++) {
    const res = await leaderboardPOST(
      new Request('http://localhost:3000/api/attention-span/leaderboard', {
        method: 'POST',
        headers,
        body: JSON.stringify({ accuracyEarned: 10 }),
      })
    );
    if (res.status === 429) {
      hitRateLimit = true;
      const data = await res.json();
      assert.strictEqual(data.code, 'RATE_LIMIT_EXCEEDED');
      break;
    }
  }
  assert.strictEqual(hitRateLimit, true, 'Submitting more than 15 scores per minute must trigger HTTP 429 rate limit');
  console.log('  ✅ [PASS] Excessive score submissions are blocked with HTTP 429 RATE_LIMIT_EXCEEDED');

  // ── 4. Leaderboard GET: Authoritative User Rank (No ?userId= probe) ──
  console.log('\n── 4. Leaderboard GET: Authoritative Caller Identity ──');
  const boardRes = await leaderboardGET(
    new Request(`http://localhost:3000/api/attention-span/leaderboard?userId=spoofed_victim_id`, {
      method: 'GET',
      headers,
    })
  );
  const boardData = await boardRes.json();
  assert.strictEqual(boardData.ok, true);
  // User rank must be computed for testUser, not spoofed_victim_id
  const expectedRank = boardData.leaders.findIndex((l: any) => l.userId === testUser) + 1;
  assert.strictEqual(boardData.userRank, expectedRank > 0 ? expectedRank : boardData.leaders.length + 1, 'userRank must belong to authenticated caller');
  console.log('  ✅ [PASS] Leaderboard ignores spoofed ?userId= parameter and preserves caller rank integrity');

  // ── 5. Progress Route: Keyed HMAC & Monotonicity ──
  console.log('\n── 5. Progress Route: Keyed HMAC Integrity & Validation ──');
  const dummyStats = {
    focusFireBest: 450,
    memoryMatrixBest: 12,
    reflexRushBest: 210,
    sequenceSnapBest: 8,
    totalSessions: 15,
    streak: 3,
    lastPlayedDate: '2026-09-17',
    dailyScores: {},
    dailySessions: {},
    completedDifficulties: {},
  };
  const keyedHash = computeIntegrityHash(testUser, dummyStats);
  assert.strictEqual(typeof keyedHash, 'string');
  assert.strictEqual(keyedHash.length, 16, 'HMAC-SHA256 signature must be 16-hex characters');

  // Post progress with biological floor violation (5ms reaction time)
  const progRes = await progressPOST(
    new Request('http://localhost:3000/api/attention-span/progress', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        stats: {
          ...dummyStats,
          reflexRushBest: 5, // Impossible reaction time
          totalSessions: 20,
        },
      }),
    })
  );
  const progData = await progRes.json();
  assert.strictEqual(progData.ok, true);
  assert.strictEqual(progData.stats.reflexRushBest, 80, 'Biologically impossible reaction time must be clamped to 80ms floor');
  assert.strictEqual(progData.stats.totalSessions, 20, 'totalSessions must be preserved');
  console.log('  ✅ [PASS] Progress validation enforces 80ms reaction floor and generates keyed HMAC signature');

  console.log('\n========================================================================');
  console.log('🏁 SUB-BATCH 4.4 RESULTS: All Attention-Span Security Tests Passed (100%)');
  console.log('========================================================================\n');
}

runTests().catch(err => {
  console.error('❌ Sub-batch 4.4 test failure:', err);
  process.exit(1);
});
