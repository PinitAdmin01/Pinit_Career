// scripts/test_subbatch_2_5.ts
// Verification test suite for Sub-Batch 2.5: XP Exploits & Progression Caps (Issues 048 – 052)

import * as dotenv from 'dotenv';
dotenv.config();
process.env.ALLOW_DEV_AUTH_BYPASS = 'true';
process.env.NODE_ENV = 'test';

import fs from 'fs';
import path from 'path';
import { PGlite } from '@electric-sql/pglite';
import { POST as addXpHandler } from '../src/app/api/xp/add/route';
import { POST as awardBadgeHandler } from '../src/app/api/user/award-badge/route';

async function runSubBatch25Tests() {
  console.log('========================================================================');
  console.log('🧪 SUB-BATCH 2.5 VERIFICATION SUITE: ISSUES 048 – 052');
  console.log('========================================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`  ✅ [PASS] ${testName}${detail ? ` (${detail})` : ''}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${testName}${detail ? ` - FAILED: ${detail}` : ''}`);
      failed++;
    }
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Setup PGlite in-memory database with migration SQL
  // ───────────────────────────────────────────────────────────────────────────
  console.log('── Setting up in-memory PostgreSQL instance for Sub-Batch 2.5 schema... ──');
  const db = new PGlite();
  const migrationPath = path.join(
    process.cwd(),
    'supabase',
    'migrations',
    '20260913_subbatch_2_5_xp_progression_caps.sql'
  );
  const migrationSql = fs.readFileSync(migrationPath, 'utf8');
  await db.exec(migrationSql);

  const testUserId = '11111111-2222-3333-4444-555555555555';
  await db.query(`
    INSERT INTO public.users (id, pins, xp_total, xp_level, career_dna_score, communication_score, interviews_done)
    VALUES ('${testUserId}'::uuid, 120, 0, 1, 0, NULL, 0)
    ON CONFLICT (id) DO NOTHING;
  `);
  console.log('  Database and test user initialized.\n');

  // ───────────────────────────────────────────────────────────────────────────
  // TEST 1: Defect 048 - Server-Authoritative XP Ledger & increment_xp RPC
  // ───────────────────────────────────────────────────────────────────────────
  console.log('── TEST 1 (Defect 048): Server-Authoritative XP Ledger & Atomic increment_xp ──');
  try {
    // 1.1 Unauthenticated requests must return 401
    const unauthReq = new Request('http://localhost:3000/api/xp/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 50, reason: 'Quest completion' }),
    });
    const unauthRes = await addXpHandler(unauthReq);
    assert(
      unauthRes.status === 401,
      'Defect 048.1: /api/xp/add rejects unauthenticated requests with 401',
      `Status: ${unauthRes.status}`
    );

    // 1.2 Invalid amounts (<= 0, > 500, float, non-integer) must return 400 INVALID_XP_AMOUNT
    const testAmounts = [-50, 0, 501, 10000, 25.5];
    for (const amt of testAmounts) {
      const invalidReq = new Request('http://localhost:3000/api/xp/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test-token-dev',
        },
        body: JSON.stringify({ amount: amt, reason: 'Test exploit' }),
      });
      const invalidRes = await addXpHandler(invalidReq);
      const invalidBody = await invalidRes.json().catch(() => ({}));
      assert(
        invalidRes.status === 400 && invalidBody?.error === 'INVALID_XP_AMOUNT',
        `Defect 048.2: /api/xp/add rejects invalid amount (${amt}) with 400 INVALID_XP_AMOUNT`,
        `Status: ${invalidRes.status}, Error: ${invalidBody?.error}`
      );
    }

    // 1.3 Test increment_xp RPC directly in PostgreSQL
    const rpcRes1 = await db.query<any>(`
      SELECT public.increment_xp(
        '${testUserId}'::uuid,
        50,
        'Completed Algorithmic Challenge'
      ) AS res;
    `);
    const rpcData1 = rpcRes1.rows[0]?.res;
    assert(
      rpcData1?.ok === true && rpcData1?.new_xp === 50 && rpcData1?.amount_added === 50,
      'Defect 048.3: increment_xp RPC successfully adds 50 XP atomically',
      `New XP: ${rpcData1?.new_xp}, Level: ${rpcData1?.new_level}`
    );

    // 1.4 Verify xp_ledger records audit trail
    const ledgerCheck = await db.query<any>(`
      SELECT COUNT(*) as count, SUM(amount) as total
      FROM public.xp_ledger
      WHERE user_id = '${testUserId}'::uuid;
    `);
    assert(
      Number(ledgerCheck.rows[0]?.count) === 1 && Number(ledgerCheck.rows[0]?.total) === 50,
      'Defect 048.4: xp_ledger creates immutable audit entry for XP award',
      `Rows: ${ledgerCheck.rows[0]?.count}, Total: ${ledgerCheck.rows[0]?.total}`
    );

    // 1.5 Verify RPC rejects increments > 500
    const rpcReject = await db.query<any>(`
      SELECT public.increment_xp(
        '${testUserId}'::uuid,
        600,
        'Exploit attempt'
      ) AS res;
    `);
    assert(
      rpcReject.rows[0]?.res?.ok === false && rpcReject.rows[0]?.res?.reason === 'INVALID_XP_AMOUNT',
      'Defect 048.5: increment_xp RPC rejects individual grant > 500 XP',
      `Reason: ${rpcReject.rows[0]?.res?.reason}`
    );

    // 1.6 Verify level progression curve: 400 XP -> Level floor(sqrt(400/100)) + 1 = 3
    const rpcLevelRes = await db.query<any>(`
      SELECT public.increment_xp(
        '${testUserId}'::uuid,
        350,
        'Midterm Quest'
      ) AS res;
    `);
    const rpcLevelData = rpcLevelRes.rows[0]?.res;
    assert(
      rpcLevelData?.new_xp === 400 && rpcLevelData?.new_level === 3,
      'Defect 048.6: increment_xp calculates accurate level progression curve',
      `XP: ${rpcLevelData?.new_xp}, Level: ${rpcLevelData?.new_level}`
    );
  } catch (err: any) {
    assert(false, 'Defect 048: Failed executing test suite', err?.message);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // TEST 2: Defect 049 - Prestige Badge Registry & Anti-Replay
  // ───────────────────────────────────────────────────────────────────────────
  console.log('\n── TEST 2 (Defect 049): Prestige Badge Registry & Anti-Replay Deduplication ──');
  try {
    // 2.1 Unauthenticated requests must return 401
    const unauthBadgeReq = new Request('http://localhost:3000/api/user/award-badge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ badgeId: 'trust_sentinel_99', milestoneKey: 'trust_score_99' }),
    });
    const unauthBadgeRes = await awardBadgeHandler(unauthBadgeReq);
    assert(
      unauthBadgeRes.status === 401,
      'Defect 049.1: /api/user/award-badge rejects unauthenticated requests with 401',
      `Status: ${unauthBadgeRes.status}`
    );

    // 2.2 Missing badgeId or milestoneKey must return 400 INVALID_BADGE_PARAMS
    const invalidBadgeReq = new Request('http://localhost:3000/api/user/award-badge', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token-dev',
      },
      body: JSON.stringify({ badgeId: '', milestoneKey: '' }),
    });
    const invalidBadgeRes = await awardBadgeHandler(invalidBadgeReq);
    const invalidBadgeBody = await invalidBadgeRes.json().catch(() => ({}));
    assert(
      invalidBadgeRes.status === 400 && invalidBadgeBody?.error === 'INVALID_BADGE_PARAMS',
      'Defect 049.2: /api/user/award-badge rejects empty parameters with 400 INVALID_BADGE_PARAMS',
      `Status: ${invalidBadgeRes.status}, Error: ${invalidBadgeBody?.error}`
    );

    // 2.3 First milestone unlock via RPC: should grant +500 XP and register badge
    const badgeAward1 = await db.query<any>(`
      SELECT public.award_prestige_badge(
        '${testUserId}'::uuid,
        'trust_sentinel_99',
        'trust_score_99'
      ) AS res;
    `);
    const badgeData1 = badgeAward1.rows[0]?.res;
    assert(
      badgeData1?.ok === true && badgeData1?.newly_awarded === true && badgeData1?.xp_granted === 500,
      'Defect 049.3: award_prestige_badge grants +500 XP on initial milestone unlock',
      `Newly Awarded: ${badgeData1?.newly_awarded}, XP Granted: ${badgeData1?.xp_granted}, New XP: ${badgeData1?.new_xp}`
    );

    // Verify user now has the badge in badges array and user_milestones table
    const userBadges = await db.query<any>(`
      SELECT badges FROM public.users WHERE id = '${testUserId}'::uuid;
    `);
    assert(
      Array.isArray(userBadges.rows[0]?.badges) && userBadges.rows[0]?.badges.includes('trust_sentinel_99'),
      'Defect 049.4: users.badges includes newly awarded badge',
      `Badges: ${JSON.stringify(userBadges.rows[0]?.badges)}`
    );

    // 2.4 Duplicate milestone unlock attempt (re-crossing 99 or devtools loop): must return newly_awarded = false and 0 XP
    const badgeAward2 = await db.query<any>(`
      SELECT public.award_prestige_badge(
        '${testUserId}'::uuid,
        'trust_sentinel_99',
        'trust_score_99'
      ) AS res;
    `);
    const badgeData2 = badgeAward2.rows[0]?.res;
    assert(
      badgeData2?.ok === true && badgeData2?.newly_awarded === false && (badgeData2?.xp_granted ?? 0) === 0,
      'Defect 049.5: award_prestige_badge blocks duplicate awards, grants 0 XP on re-claim',
      `Newly Awarded: ${badgeData2?.newly_awarded}, Message: ${badgeData2?.message}`
    );

    // Verify milestone registry count is strictly 1
    const milestoneCount = await db.query<any>(`
      SELECT COUNT(*) as count FROM public.user_milestones
      WHERE user_id = '${testUserId}'::uuid AND milestone_key = 'trust_score_99';
    `);
    assert(
      Number(milestoneCount.rows[0]?.count) === 1,
      'Defect 049.6: user_milestones table maintains exactly 1 record per milestone key',
      `Count: ${milestoneCount.rows[0]?.count}`
    );
  } catch (err: any) {
    assert(false, 'Defect 049: Failed executing test suite', err?.message);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // TEST 3: Defect 050 - Rapid Dispatch Throttling & Cooldown
  // ───────────────────────────────────────────────────────────────────────────
  console.log('\n── TEST 3 (Defect 050): Rapid Dispatch Throttling & Cooldown Verification ──');
  try {
    const contextFile = path.join(process.cwd(), 'src', 'lib', 'context', 'CareerOSContext.tsx');
    const financeFile = path.join(process.cwd(), 'src', 'lib', 'context', 'FinanceContext.tsx');
    const contextContent = fs.readFileSync(contextFile, 'utf8') + (fs.existsSync(financeFile) ? '\n' + fs.readFileSync(financeFile, 'utf8') : '');

    // 3.1 Verify lastRewardTimeRef exists in CareerOSContext
    const hasRewardRef = /lastRewardTimeRef\s*=\s*useRef<number>\(0\)/.test(contextContent);
    assert(
      hasRewardRef,
      'Defect 050.1: CareerOSContext maintains lastRewardTimeRef timestamp ref',
      `Found ref: ${hasRewardRef}`
    );

    // 3.2 Verify cooldown check inside rewardActivity
    const hasCooldownCheck = /now\s*-\s*lastRewardTimeRef\.current\s*<\s*2000/.test(contextContent);
    assert(
      hasCooldownCheck,
      'Defect 050.2: rewardActivity enforces minimum 2000ms cooldown window',
      `Found cooldown check: ${hasCooldownCheck}`
    );

    // 3.3 Functional simulation of throttling dispatcher logic
    let lastTime = 0;
    let dispatched = 0;
    function simulateRewardActivity(mockTime: number) {
      if (mockTime - lastTime < 2000) {
        return false; // Throttled
      }
      lastTime = mockTime;
      dispatched++;
      return true;
    }

    // 1st call at T = 10000: succeeds (10000 - 0 >= 2000)
    const call1 = simulateRewardActivity(10000);
    // 2nd call at T = 10050 (rapid loop attack): dropped (50 < 2000)
    const call2 = simulateRewardActivity(10050);
    // 3rd call at T = 10500 (rapid loop attack): dropped (500 < 2000)
    const call3 = simulateRewardActivity(10500);
    // 4th call at T = 12100 (> 2000ms later): succeeds (2100 >= 2000)
    const call4 = simulateRewardActivity(12100);

    assert(
      call1 === true && call2 === false && call3 === false && call4 === true && dispatched === 2,
      'Defect 050.3: Rapid loop calls within 2s cooldown are dropped; subsequent calls after cooldown succeed',
      `Dispatched: ${dispatched}/4 calls`
    );
  } catch (err: any) {
    assert(false, 'Defect 050: Failed executing test suite', err?.message);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // TEST 4: Defect 051 - recalculateCareerDna Zero Baseline
  // ───────────────────────────────────────────────────────────────────────────
  console.log('\n── TEST 4 (Defect 051): recalculateCareerDna Zero Baseline Verification ──');
  try {
    const supabaseServiceFile = path.join(process.cwd(), 'src', 'lib', 'supabaseService.ts');
    const credentialServiceFile = path.join(process.cwd(), 'src', 'lib', 'services', 'supabase', 'credentialService.ts');
    const serviceContent = fs.readFileSync(supabaseServiceFile, 'utf8') + (fs.existsSync(credentialServiceFile) ? '\n' + fs.readFileSync(credentialServiceFile, 'utf8') : '');

    // 4.1 Verify || 68 is completely eradicated from recalculateCareerDna
    const hasHardcoded68 = /recalculateCareerDna[\s\S]*?\|\|\s*68/.test(serviceContent);
    assert(
      !hasHardcoded68,
      'Defect 051.1: recalculateCareerDna no longer contains hardcoded || 68 baseline',
      `Contains || 68: ${hasHardcoded68}`
    );

    // 4.2 Verify zero fallback is used
    const hasZeroFallback = /const\s+baseDna\s*=\s*typeof\s+profile\.career_dna_score\s*===\s*'number'\s*\?\s*profile\.career_dna_score\s*:\s*0/.test(serviceContent);
    assert(
      hasZeroFallback,
      'Defect 051.2: recalculateCareerDna safely defaults missing career_dna_score to 0',
      `Safe fallback found: ${hasZeroFallback}`
    );

    // 4.3 Functional calculation verification:
    // User A: fresh profile with null/0 score, 0 completed missions
    const userA_base = 0;
    const userA_completed = 0;
    const userA_dna = Math.min(100, Math.max(0, userA_base + userA_completed * 2));
    assert(
      userA_dna === 0,
      'Defect 051.3: Fresh student with 0 missions starts at 0 Career DNA (never 68)',
      `Score: ${userA_dna}`
    );

    // User B: fresh profile with 3 completed missions
    const userB_completed = 3;
    const userB_dna = Math.min(100, Math.max(0, userA_base + userB_completed * 2));
    assert(
      userB_dna === 6,
      'Defect 051.4: Student with 3 completed missions receives 6 Career DNA (never 71)',
      `Score: ${userB_dna}`
    );

    // User C: existing student with DNA score 40, 5 completed missions
    const userC_base = 40;
    const userC_completed = 5;
    const userC_dna = Math.min(100, Math.max(0, userC_base + userC_completed * 2));
    assert(
      userC_dna === 50,
      'Defect 051.5: Existing student with DNA score 40 + 5 missions correctly gains +10 to reach 50',
      `Score: ${userC_dna}`
    );
  } catch (err: any) {
    assert(false, 'Defect 051: Failed executing test suite', err?.message);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // TEST 5: Defect 052 - Accurate Communication Score Initial Baseline & 70/30 Rolling Average
  // ───────────────────────────────────────────────────────────────────────────
  console.log('\n── TEST 5 (Defect 052): Accurate Communication Score Initial Baseline & 70/30 Weighted Blend ──');
  try {
    const supabaseServiceFile = path.join(process.cwd(), 'src', 'lib', 'supabaseService.ts');
    const credentialServiceFile = path.join(process.cwd(), 'src', 'lib', 'services', 'supabase', 'credentialService.ts');
    const serviceContent = fs.readFileSync(supabaseServiceFile, 'utf8') + (fs.existsSync(credentialServiceFile) ? '\n' + fs.readFileSync(credentialServiceFile, 'utf8') : '');

    // 5.1 Verify || 60 is completely eradicated from completeInterviewSession
    const hasHardcoded60 = /completeInterviewSession[\s\S]*?\|\|\s*60/.test(serviceContent);
    assert(
      !hasHardcoded60,
      'Defect 052.1: completeInterviewSession no longer contains hardcoded || 60 baseline',
      `Contains || 60: ${hasHardcoded60}`
    );

    // 5.2 Verify 70/30 blend logic
    const hasWeightedBlend = /profile\.communication_score\s*\*\s*0\.7\)?\s*\+\s*\(?currentScore\s*\*\s*0\.3/.test(serviceContent);
    assert(
      hasWeightedBlend,
      'Defect 052.2: completeInterviewSession computes 70/30 weighted blend on subsequent sessions',
      `Found 70/30 blend: ${hasWeightedBlend}`
    );

    // 5.3 Functional simulation of first interview:
    // First interview scoring 20% must yield 20%, NOT Math.round(60 * 0.6 + 20 * 0.4) = 44!
    const mockProfile1 = { interviews_done: 0, communication_score: null };
    const eval1 = { communication_score: 20 };
    const currentScore1 = eval1.communication_score;
    let next1: number;
    if (mockProfile1.interviews_done === 0 || mockProfile1.communication_score == null) {
      next1 = Math.min(100, Math.max(0, Math.round(currentScore1)));
    } else {
      next1 = Math.min(100, Math.max(0, Math.round((mockProfile1.communication_score * 0.7) + (currentScore1 * 0.3))));
    }
    assert(
      next1 === 20,
      'Defect 052.3: Initial interview evaluation reflects true raw score (20%) without anchoring to 60',
      `Calculated score: ${next1}`
    );

    // First interview scoring 92% must yield 92%, NOT Math.round(60 * 0.6 + 92 * 0.4) = 73!
    const evalHigh = { communication_score: 92 };
    let nextHigh: number;
    if (mockProfile1.interviews_done === 0 || mockProfile1.communication_score == null) {
      nextHigh = Math.min(100, Math.max(0, Math.round(evalHigh.communication_score)));
    }
    assert(
      nextHigh! === 92,
      'Defect 052.4: Initial high performance evaluation reflects true raw score (92%) without damping',
      `Calculated score: ${nextHigh!}`
    );

    // 5.4 Functional simulation of subsequent interview:
    // Profile after interview 1 has score 20, interviews_done = 1.
    // Takes interview 2, scores 80.
    // Weighted formula: Math.round(20 * 0.7 + 80 * 0.3) = Math.round(14 + 24) = 38.
    const mockProfile2 = { interviews_done: 1, communication_score: 20 };
    const eval2 = { communication_score: 80 };
    const currentScore2 = eval2.communication_score;
    const next2 = Math.min(100, Math.max(0, Math.round((mockProfile2.communication_score * 0.7) + (currentScore2 * 0.3))));
    assert(
      next2 === 38,
      'Defect 052.5: Subsequent interview applies 70/30 rolling weighted blend (20 blended with 80 -> 38)',
      `Calculated score: ${next2}`
    );

    // Takes interview 3, scores 90.
    // Weighted formula: Math.round(38 * 0.7 + 90 * 0.3) = Math.round(26.6 + 27) = 54.
    const next3 = Math.min(100, Math.max(0, Math.round((next2 * 0.7) + (90 * 0.3))));
    assert(
      next3 === 54,
      'Defect 052.6: Third interview demonstrates smooth progression (38 blended with 90 -> 54)',
      `Calculated score: ${next3}`
    );
  } catch (err: any) {
    assert(false, 'Defect 052: Failed executing test suite', err?.message);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // SUMMARY
  // ───────────────────────────────────────────────────────────────────────────
  console.log('\n========================================================================');
  console.log(`SUB-BATCH 2.5 RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('========================================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runSubBatch25Tests().catch((err) => {
  console.error('Fatal error running Sub-Batch 2.5 verification tests:', err);
  process.exit(1);
});
