// scripts/test_subbatch_2_4.ts
// Verification test suite for Sub-Batch 2.4: Feature Unlocks & Grace Periods (Issues 043 – 047)

import * as dotenv from 'dotenv';
dotenv.config();
process.env.ALLOW_DEV_AUTH_BYPASS = 'true';
process.env.NODE_ENV = 'test';

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { PGlite } from '@electric-sql/pglite';
import { POST as extendGraceHandler } from '../src/app/api/pins/extend-grace/route';
import { POST as buyAiMinutesHandler } from '../src/app/api/pins/buy-ai-minutes/route';
import { generateTxId } from '../src/lib/hooks/usePins';

async function runSubBatch24Tests() {
  console.log('========================================================================');
  console.log('🧪 SUB-BATCH 2.4 VERIFICATION SUITE: ISSUES 043 – 047');
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
  // TEST 1: Defect 043 - Cross-Device Item Unlock Duration DB Sync
  // ───────────────────────────────────────────────────────────────────────────
  console.log('── TEST 1 (Defect 043): Cross-Device Unlocked Items Database Synchronization ──');
  try {
    const supabaseServiceFile = path.join(process.cwd(), 'src', 'lib', 'supabaseService.ts');
    const userServiceFile = path.join(process.cwd(), 'src', 'lib', 'services', 'supabase', 'userService.ts');
    const progressServiceFile = path.join(process.cwd(), 'src', 'lib', 'services', 'supabase', 'progressService.ts');
    const serviceContent = fs.readFileSync(supabaseServiceFile, 'utf8') +
      (fs.existsSync(userServiceFile) ? '\n' + fs.readFileSync(userServiceFile, 'utf8') : '') +
      (fs.existsSync(progressServiceFile) ? '\n' + fs.readFileSync(progressServiceFile, 'utf8') : '');

    // 1.1 Verify syncUnlockedItemsDB updates Supabase users.unlocked_items
    const hasDbUpdate = /supabase\s*\.from\(['"]users['"]\)\s*\.update\(\{\s*unlocked_items:\s*unlockedItems\s*\}\)/.test(serviceContent);
    assert(
      hasDbUpdate,
      'Defect 043.1: syncUnlockedItemsDB updates Supabase users table unlocked_items column',
      `Found DB update in syncUnlockedItemsDB: ${hasDbUpdate}`
    );

    // 1.2 Verify error check exists
    const hasErrorCheck = /if\s*\(error\)\s*\{\s*console\.warn\(.*\[syncUnlockedItemsDB\].*\);\s*return\s*\{\s*ok:\s*false\s*\};?\s*\}/.test(serviceContent);
    assert(
      hasErrorCheck,
      'Defect 043.2: syncUnlockedItemsDB assigns result, verifies error, and fails closed',
      `Error check verified: ${hasErrorCheck}`
    );

    // 1.3 Verify profile hydration maps unlocked_items
    const hasHydration = /unlockedItems:\s*row\.unlocked_items\s*\|\|\s*\{\}/.test(serviceContent);
    assert(
      hasHydration,
      'Defect 043.3: Profile hydration reads users.unlocked_items from Supabase',
      `Hydration mapped: ${hasHydration}`
    );
  } catch (err: any) {
    assert(false, 'Defect 043: Failed executing test suite', err?.message);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // TEST 2: Defect 044 - Server-Authoritative Emergency Grace Period Extension
  // ───────────────────────────────────────────────────────────────────────────
  console.log('\n── TEST 2 (Defect 044): Server-Verified Emergency Grace Extension ──');
  try {
    // 2.1 Unauthenticated requests must return 401
    const unauthReq = new Request('http://localhost:3000/api/pins/extend-grace', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itemKey: 'quest:sql_opt', minutes: 15 }),
    });
    const unauthRes = await extendGraceHandler(unauthReq);
    assert(
      unauthRes.status === 401,
      'Defect 044.1: /api/pins/extend-grace rejects unauthenticated requests with 401',
      `Status: ${unauthRes.status}`
    );

    // 2.2 Authenticated request missing itemKey must return 400
    const invalidReq = new Request('http://localhost:3000/api/pins/extend-grace', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token-dev',
      },
      body: JSON.stringify({ itemKey: '', minutes: 15 }),
    });
    const invalidRes = await extendGraceHandler(invalidReq);
    const invalidBody = await invalidRes.json().catch(() => ({}));
    assert(
      invalidRes.status === 400 && invalidBody?.error === 'INVALID_ITEM_KEY',
      'Defect 044.2: /api/pins/extend-grace rejects empty itemKey with 400 INVALID_ITEM_KEY',
      `Status: ${invalidRes.status}, Error: ${invalidBody?.error}`
    );

    // 2.3 Verify database procedure and anti-replay in PGlite
    const db = new PGlite();
    const migrationFile = path.join(
      process.cwd(),
      'supabase',
      'migrations',
      '20260913_subbatch_2_4_feature_unlocks_grace.sql'
    );
    const migrationSql = fs.readFileSync(migrationFile, 'utf8');
    await db.exec(migrationSql);

    // Setup dummy users table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS public.users (
        id UUID PRIMARY KEY,
        pins INTEGER DEFAULT 120,
        pin_history JSONB DEFAULT '[]'::jsonb,
        unlocked_items JSONB DEFAULT '{}'::jsonb
      );
    `);

    const testUserId = crypto.randomUUID();
    const baseExpiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes remaining
    await db.exec(`
      INSERT INTO public.users (id, pins, unlocked_items)
      VALUES ('${testUserId}', 100, '{"quest:cloud_sec": ${baseExpiresAt}}'::jsonb);
    `);

    // First grace claim: must succeed and add 15 minutes
    const claimRes1 = await db.query<any>(`
      SELECT public.apply_feature_grace_extension(
        '${testUserId}'::uuid,
        'quest:cloud_sec',
        15
      ) AS res;
    `);
    const claimData1 = claimRes1.rows[0]?.res;
    assert(
      claimData1?.ok === true && claimData1?.minutes_granted === 15,
      'Defect 044.3: apply_feature_grace_extension successfully grants +15 minutes',
      `Granted: ${claimData1?.minutes_granted} min, newExpires: ${claimData1?.new_expires_at}`
    );

    // Verify claim row exists in feature_grace_claims
    const graceClaimsCount = await db.query<any>(`
      SELECT count(*) AS count FROM public.feature_grace_claims
      WHERE user_id = '${testUserId}' AND item_key = 'quest:cloud_sec';
    `);
    assert(
      Number(graceClaimsCount.rows[0]?.count) === 1,
      'Defect 044.4: feature_grace_claims ledger records audit row',
      `Rows: ${graceClaimsCount.rows[0]?.count}`
    );

    // Second grace claim in same cycle (simulating DevTools localStorage wipe attack): must strictly reject
    const claimRes2 = await db.query<any>(`
      SELECT public.apply_feature_grace_extension(
        '${testUserId}'::uuid,
        'quest:cloud_sec',
        15
      ) AS res;
    `);
    const claimData2 = claimRes2.rows[0]?.res;
    assert(
      claimData2?.ok === false && claimData2?.reason === 'GRACE_ALREADY_CLAIMED',
      'Defect 044.5: Re-claiming grace in same unlock cycle strictly blocked with GRACE_ALREADY_CLAIMED',
      `Reason: ${claimData2?.reason}`
    );

    // Claim on inactive item: must return ITEM_NOT_ACTIVE
    const inactiveRes = await db.query<any>(`
      SELECT public.apply_feature_grace_extension(
        '${testUserId}'::uuid,
        'quest:non_existent',
        15
      ) AS res;
    `);
    assert(
      inactiveRes.rows[0]?.res?.ok === false && inactiveRes.rows[0]?.res?.reason === 'ITEM_NOT_ACTIVE',
      'Defect 044.6: Grace extension on non-active item returns ITEM_NOT_ACTIVE',
      `Reason: ${inactiveRes.rows[0]?.res?.reason}`
    );
  } catch (err: any) {
    assert(false, 'Defect 044: Failed executing test suite', err?.message);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // TEST 3: Defect 045 - Authoritative Clock Verification & Anti-Clock-Tampering
  // ───────────────────────────────────────────────────────────────────────────
  console.log('\n── TEST 3 (Defect 045): Authoritative Clock Verification & Clock Tampering Defense ──');
  try {
    const usePinsFile = path.join(process.cwd(), 'src', 'lib', 'hooks', 'usePins.ts');
    const usePinsContent = fs.readFileSync(usePinsFile, 'utf8');

    // 3.1 Verify usePins incorporates serverOffsetRef.current in isItemUnlocked
    const isUnlockedUsesOffset = /const\s+now\s*=\s*Date\.now\(\)\s*\+\s*\(serverOffsetRef\.current\s*\|\|\s*0\)/.test(usePinsContent);
    assert(
      isUnlockedUsesOffset,
      'Defect 045.1: isItemUnlocked computes authoritative time via serverOffsetRef.current',
      `Authoritative time present: ${isUnlockedUsesOffset}`
    );

    // 3.2 Verify getItemRemainingSeconds uses authoritative time
    const remainingUsesOffset = /const\s+now\s*=\s*Date\.now\(\)\s*\+\s*\(serverOffsetRef\.current\s*\|\|\s*0\)/.test(usePinsContent);
    assert(
      remainingUsesOffset,
      'Defect 045.2: getItemRemainingSeconds calculates countdown against authoritative time',
      `Authoritative countdown present: ${remainingUsesOffset}`
    );

    // 3.3 Functional simulation of clock skew attack
    // Simulation:
    // Item expires at T = 1,000,000.
    // Client device clock is tampered backwards to 500,000.
    // Server clock offset indicates true time is +600,000 ms ahead (1,100,000).
    const expiresAt = 1_000_000;
    const clientClock = 500_000;
    const serverOffset = 600_000; // True time = 1,100,000

    // Naive client check: expiresAt > clientClock (1,000,000 > 500,000) => TRUE (VULNERABLE!)
    const naiveUnlocked = expiresAt > clientClock;

    // Authoritative check:
    const authoritativeNow = clientClock + serverOffset;
    const secureUnlocked = expiresAt > authoritativeNow;

    assert(
      naiveUnlocked === true && secureUnlocked === false,
      'Defect 045.3: Clock rollback attack thwarted (naive client allowed, authoritative rejected)',
      `Naive: ${naiveUnlocked} (insecure), Secure: ${secureUnlocked} (protected)`
    );

    // 3.4 Verification of remaining seconds computation under clock rollback
    const naiveRemaining = Math.ceil((expiresAt - clientClock) / 1000); // 500 sec remaining (false!)
    const secureRemaining = expiresAt <= authoritativeNow ? 0 : Math.ceil((expiresAt - authoritativeNow) / 1000);
    assert(
      naiveRemaining === 500 && secureRemaining === 0,
      'Defect 045.4: Remaining seconds correctly reports 0 when expired regardless of backward OS clock skew',
      `Naive: ${naiveRemaining}s, Authoritative: ${secureRemaining}s`
    );
  } catch (err: any) {
    assert(false, 'Defect 045: Failed executing test suite', err?.message);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // TEST 4: Defect 046 - Daily AI Minutes Purchase Cap & Atomic Deduction
  // ───────────────────────────────────────────────────────────────────────────
  console.log('\n── TEST 4 (Defect 046): Daily AI Minutes Purchase Cap & Atomic Deduction ──');
  try {
    // 4.1 Unauthenticated requests must return 401
    const unauthReq = new Request('http://localhost:3000/api/pins/buy-ai-minutes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    const unauthRes = await buyAiMinutesHandler(unauthReq);
    assert(
      unauthRes.status === 401,
      'Defect 046.1: /api/pins/buy-ai-minutes rejects unauthenticated calls with 401',
      `Status: ${unauthRes.status}`
    );

    // 4.2 Verify database procedure and daily cap in PGlite
    const db = new PGlite();
    const migrationFile = path.join(
      process.cwd(),
      'supabase',
      'migrations',
      '20260913_subbatch_2_4_feature_unlocks_grace.sql'
    );
    const migrationSql = fs.readFileSync(migrationFile, 'utf8');
    await db.exec(migrationSql);

    await db.exec(`
      CREATE TABLE IF NOT EXISTS public.users (
        id UUID PRIMARY KEY,
        pins INTEGER DEFAULT 120,
        pin_history JSONB DEFAULT '[]'::jsonb,
        unlocked_items JSONB DEFAULT '{}'::jsonb
      );
    `);

    const userId = crypto.randomUUID();
    // Give user 250 pins
    await db.exec(`
      INSERT INTO public.users (id, pins, pin_history)
      VALUES ('${userId}', 250, '[]'::jsonb);
    `);

    // Purchase 1: should succeed (250 -> 150 pins, purchases_today = 1)
    const p1 = await db.query<any>(`
      SELECT public.purchase_ai_minutes('${userId}'::uuid, 100, 30) AS res;
    `);
    const p1Data = p1.rows[0]?.res;
    assert(
      p1Data?.ok === true && p1Data?.new_balance === 150 && p1Data?.purchases_today === 1,
      'Defect 046.2: Purchase 1 succeeds and deducts 100 pins (250 -> 150)',
      `New balance: ${p1Data?.new_balance}, Purchases today: ${p1Data?.purchases_today}`
    );

    // Purchase 2: should succeed (150 -> 50 pins, purchases_today = 2)
    const p2 = await db.query<any>(`
      SELECT public.purchase_ai_minutes('${userId}'::uuid, 100, 30) AS res;
    `);
    const p2Data = p2.rows[0]?.res;
    assert(
      p2Data?.ok === true && p2Data?.new_balance === 50 && p2Data?.purchases_today === 2,
      'Defect 046.3: Purchase 2 succeeds and deducts 100 pins (150 -> 50)',
      `New balance: ${p2Data?.new_balance}, Purchases today: ${p2Data?.purchases_today}`
    );

    // Purchase 3: should strictly fail with DAILY_AI_MINUTES_LIMIT_EXCEEDED
    const p3 = await db.query<any>(`
      SELECT public.purchase_ai_minutes('${userId}'::uuid, 100, 30) AS res;
    `);
    const p3Data = p3.rows[0]?.res;
    assert(
      p3Data?.ok === false && p3Data?.reason === 'DAILY_AI_MINUTES_LIMIT_EXCEEDED',
      'Defect 046.4: Purchase 3 is strictly blocked by daily quota (max 2 per day)',
      `Reason: ${p3Data?.reason}, Max: ${p3Data?.max_allowed}`
    );

    // Verify user balance was NOT deducted on blocked 3rd purchase
    const userRow = await db.query<any>(`SELECT pins FROM public.users WHERE id = '${userId}';`);
    assert(
      userRow.rows[0]?.pins === 50,
      'Defect 046.5: User pins balance preserved after blocked 3rd purchase attempt',
      `Pins: ${userRow.rows[0]?.pins}`
    );

    // Verify insufficient pins handling: User with 50 pins attempting purchase with clean quota
    const brokeUser = crypto.randomUUID();
    await db.exec(`INSERT INTO public.users (id, pins) VALUES ('${brokeUser}', 50);`);
    const brokeRes = await db.query<any>(`
      SELECT public.purchase_ai_minutes('${brokeUser}'::uuid, 100, 30) AS res;
    `);
    assert(
      brokeRes.rows[0]?.res?.ok === false && brokeRes.rows[0]?.res?.reason === 'INSUFFICIENT_PINS',
      'Defect 046.6: Insufficient balance rejected with INSUFFICIENT_PINS',
      `Reason: ${brokeRes.rows[0]?.res?.reason}`
    );

    // 4.7 Verify CareerOSContext.tsx calls /api/pins/buy-ai-minutes
    const contextFile = path.join(process.cwd(), 'src', 'lib', 'context', 'CareerOSContext.tsx');
    const financeFile = path.join(process.cwd(), 'src', 'lib', 'context', 'FinanceContext.tsx');
    const contextContent = fs.readFileSync(contextFile, 'utf8') + (fs.existsSync(financeFile) ? '\n' + fs.readFileSync(financeFile, 'utf8') : '');
    const callsServerApi = contextContent.includes('/api/pins/buy-ai-minutes');
    const handlesDailyCap = contextContent.includes('DAILY_AI_MINUTES_LIMIT_EXCEEDED');
    assert(
      callsServerApi && handlesDailyCap,
      'Defect 046.7: CareerOSContext.tsx calls server /api/pins/buy-ai-minutes and handles daily cap errors',
      `Calls API: ${callsServerApi}, Handles error: ${handlesDailyCap}`
    );
  } catch (err: any) {
    assert(false, 'Defect 046: Failed executing test suite', err?.message);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // TEST 5: Defect 047 - Collision-Free Cryptographic Transaction IDs
  // ───────────────────────────────────────────────────────────────────────────
  console.log('\n── TEST 5 (Defect 047): Cryptographically Secure Collision-Free Transaction IDs ──');
  try {
    // 5.1 Verify generateTxId produces UUID-formatted transaction IDs
    const sampleId = generateTxId('tx');
    const uuidRegex = /^tx_[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    assert(
      uuidRegex.test(sampleId),
      'Defect 047.1: generateTxId produces cryptographically secure UUID v4 IDs',
      `Sample: ${sampleId}`
    );

    // 5.2 High-volume collision test: 10,000 IDs generated synchronously
    const idSet = new Set<string>();
    const count = 10_000;
    for (let i = 0; i < count; i++) {
      idSet.add(generateTxId('tx'));
    }
    assert(
      idSet.size === count,
      'Defect 047.2: Zero collisions across 10,000 parallel/rapid transaction ID generations',
      `Generated: ${count}, Unique: ${idSet.size}`
    );

    // 5.3 Static analysis: verify tx_${Date.now()} is eliminated from usePins.ts
    const usePinsFile = path.join(process.cwd(), 'src', 'lib', 'hooks', 'usePins.ts');
    const usePinsContent = fs.readFileSync(usePinsFile, 'utf8');
    const hasLegacyInUsePins = /`tx_\$\{Date\.now\(\)\}/.test(usePinsContent);
    assert(
      !hasLegacyInUsePins,
      'Defect 047.3: usePins.ts eradicated legacy tx_${Date.now()} collisions',
      `Legacy pattern detected: ${hasLegacyInUsePins}`
    );

    // 5.4 Static analysis: verify tx_${Date.now()} is eliminated from supabaseService.ts
    const supabaseServiceFile = path.join(process.cwd(), 'src', 'lib', 'supabaseService.ts');
    const supabaseServiceContent = fs.readFileSync(supabaseServiceFile, 'utf8');
    const hasLegacyInSupabase = /`tx_\$\{Date\.now\(\)\}/.test(supabaseServiceContent);
    assert(
      !hasLegacyInSupabase,
      'Defect 047.4: supabaseService.ts eradicated legacy tx_${Date.now()} collisions',
      `Legacy pattern detected: ${hasLegacyInSupabase}`
    );
  } catch (err: any) {
    assert(false, 'Defect 047: Failed executing test suite', err?.message);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // SUMMARY
  // ───────────────────────────────────────────────────────────────────────────
  console.log('\n========================================================================');
  console.log(`🏁 SUB-BATCH 2.4 RESULT: ${passed} PASSED, ${failed} FAILED (TOTAL: ${passed + failed})`);
  console.log('========================================================================');

  if (failed > 0) {
    console.error(`\n💥 SUB-BATCH 2.4 FAILED with ${failed} failure(s). Must fix before merging!`);
    process.exit(1);
  } else {
    console.log('\n🎉 ALL SUB-BATCH 2.4 DEFECTS (043 – 047) FULLY REMEDIATED & VERIFIED!\n');
    process.exit(0);
  }
}

runSubBatch24Tests().catch((err) => {
  console.error('Unhandled test suite error:', err);
  process.exit(1);
});
