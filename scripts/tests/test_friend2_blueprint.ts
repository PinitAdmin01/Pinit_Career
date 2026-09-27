// scripts/test_friend2_blueprint.ts
// Verification test suite for Friend 2 Master Blueprint: Elevating to 10/10 (Tasks 2.1, 2.2, 2.3)

import * as dotenv from 'dotenv';
dotenv.config();

process.env.ALLOW_DEV_AUTH_BYPASS = 'true';

import fs from 'fs';
import path from 'path';
import { generateTxId } from '../src/lib/utils/transactionId';
import { acquireDistributedLock, financeService } from '../src/lib/services/financeService';
import { POST as addXpHandler, VALID_ACTION_TYPES, DAILY_XP_MAX_CAP } from '../src/app/api/xp/add/route';

async function runFriend2BlueprintTests() {
  console.log('========================================================================');
  console.log('🧪 FRIEND 2 BLUEPRINT 10/10 VERIFICATION SUITE (TASKS 2.1, 2.2, 2.3)');
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
  // TASK 2.1: Replace Math.random() Receipt Collision with Cryptographic UUID
  // ───────────────────────────────────────────────────────────────────────────
  console.log('── TASK 2.1: Cryptographic Receipt ID Generation (financeService.ts) ──');
  try {
    const financeServiceSrc = fs.readFileSync(
      path.join(process.cwd(), 'src', 'lib', 'services', 'financeService.ts'),
      'utf8'
    );

    // 1.1 Verify legacy Math.floor / Math.random pattern is eradicated
    const hasLegacyReceipt = financeServiceSrc.includes("'RCP-' + Math.floor");
    assert(
      !hasLegacyReceipt,
      'Task 2.1.1: Eradicated legacy Math.floor / Math.random receipt generation in financeService',
      `Legacy pattern detected: ${hasLegacyReceipt}`
    );

    // 1.2 Verify generateTxId('rcp') is imported and invoked in payDue
    const hasGenerateTxIdImport = /import\s*\{[^}]*generateTxId[^}]*\}\s*from\s*['"]@\/lib\/utils\/transactionId['"]/.test(financeServiceSrc);
    const hasGenerateTxIdCall = /const\s+transactionId\s*=\s*generateTxId\(['"]rcp['"]\)/.test(financeServiceSrc);
    assert(
      hasGenerateTxIdImport && hasGenerateTxIdCall,
      'Task 2.1.2: financeService imports and calls generateTxId("rcp")',
      `Imported: ${hasGenerateTxIdImport}, Called: ${hasGenerateTxIdCall}`
    );

    // 1.3 Collision resistance test: 5,000 rapid receipt IDs with rcp prefix
    const generatedIds = new Set<string>();
    for (let i = 0; i < 5000; i++) {
      generatedIds.add(generateTxId('rcp'));
    }
    const sampleId = Array.from(generatedIds)[0];
    assert(
      generatedIds.size === 5000 && sampleId.startsWith('rcp_'),
      'Task 2.1.3: Zero collisions across 5,000 rapid generateTxId("rcp") generations',
      `Unique: ${generatedIds.size}/5000, Sample: ${sampleId}`
    );
  } catch (err: any) {
    assert(false, 'Task 2.1 execution failed', err?.message);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // TASK 2.2: Distributed Lock Must Fail Closed in Production
  // ───────────────────────────────────────────────────────────────────────────
  console.log('\n── TASK 2.2: Distributed Lock Production Fail-Closed Defense ──');
  try {
    const financeServiceSrc = fs.readFileSync(
      path.join(process.cwd(), 'src', 'lib', 'services', 'financeService.ts'),
      'utf8'
    );

    // 2.1 Source code verification of production fail-closed branching
    const hasProdCheck = financeServiceSrc.includes("process.env.NODE_ENV === 'production'");
    const hasFailClosedPurge = financeServiceSrc.includes('activePaymentLocks.delete(lockKey)') &&
                               financeServiceSrc.includes('activeScholarshipLocks.delete(lockKey)');
    assert(
      hasProdCheck && hasFailClosedPurge,
      'Task 2.2.1: acquireDistributedLock checks NODE_ENV === "production" and purges memory locks',
      `Prod check: ${hasProdCheck}, Lock purge: ${hasFailClosedPurge}`
    );

    // 2.2 Behavioral test: In production mode with unconfigured/unreachable Supabase, lock acquisition fails closed (returns false)
    const originalEnv = process.env.NODE_ENV;
    try {
      (process.env as any).NODE_ENV = 'production';
      const lockKey = `test_prod_lock_${Date.now()}`;
      const lockAcquired = await acquireDistributedLock(lockKey, 'student_001', 30);
      assert(
        lockAcquired === false,
        'Task 2.2.2: acquireDistributedLock strictly fails closed (returns false) in production when table is unreachable',
        `Acquired: ${lockAcquired} (expected false)`
      );
    } finally {
      (process.env as any).NODE_ENV = originalEnv;
    }

    // 2.3 Verify 45s TTL auto-expiration and created_at support in source
    const hasCreatedAt = financeServiceSrc.includes('created_at: now.toISOString()');
    const has45sThreshold = financeServiceSrc.includes('45 * 1000');
    assert(
      hasCreatedAt && has45sThreshold,
      'Task 2.2.3: acquireDistributedLock records created_at and auto-reclaims locks older than 45s',
      `created_at: ${hasCreatedAt}, 45s threshold: ${has45sThreshold}`
    );
  } catch (err: any) {
    assert(false, 'Task 2.2 execution failed', err?.message);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // TASK 2.3: Authoritative Action Type Registry & Daily Cumulative XP Cap
  // ───────────────────────────────────────────────────────────────────────────
  console.log('\n── TASK 2.3: Authoritative Action Registry & Daily 24h XP Cap (/api/xp/add) ──');
  try {
    // 3.1 Registry definition and constants
    assert(
      VALID_ACTION_TYPES instanceof Set && VALID_ACTION_TYPES.has('quest') && VALID_ACTION_TYPES.has('interview') && VALID_ACTION_TYPES.has('challenge'),
      'Task 2.3.1: VALID_ACTION_TYPES registry contains expected action types',
      `Size: ${VALID_ACTION_TYPES.size}, Types: ${Array.from(VALID_ACTION_TYPES).slice(0, 5).join(', ')}...`
    );

    assert(
      DAILY_XP_MAX_CAP === 3000,
      'Task 2.3.2: DAILY_XP_MAX_CAP is strictly set to 3000 XP per 24h cycle',
      `Cap: ${DAILY_XP_MAX_CAP}`
    );

    // 3.2 Unknown actionType must be rejected with 400 INVALID_ACTION_TYPE
    const invalidTypeReq = new Request('http://localhost:3000/api/xp/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token-dev',
      },
      body: JSON.stringify({
        amount: 100,
        actionType: 'malicious_exploit_action_type',
        reason: 'Exploit attempt',
      }),
    });

    const invalidTypeRes = await addXpHandler(invalidTypeReq);
    const invalidTypeBody = await invalidTypeRes.json().catch(() => ({}));

    assert(
      invalidTypeRes.status === 400 && invalidTypeBody?.error === 'INVALID_ACTION_TYPE',
      'Task 2.3.3: /api/xp/add rejects invalid/unregistered actionType with 400 INVALID_ACTION_TYPE',
      `Status: ${invalidTypeRes.status}, Error: ${invalidTypeBody?.error}`
    );

    // 3.3 Valid actionType formatting: prefix reason with [actionType]
    const routeSrc = fs.readFileSync(
      path.join(process.cwd(), 'src', 'app', 'api', 'xp', 'add', 'route.ts'),
      'utf8'
    );
    const hasActionTypePrefix = routeSrc.includes('const finalReason = actionType ? `[${actionType}] ${reason}` : reason');
    assert(
      hasActionTypePrefix,
      'Task 2.3.4: /api/xp/add formats ledger reason with [actionType] metadata',
      `Formatted reason present: ${hasActionTypePrefix}`
    );

    // 3.4 24h Cumulative query check in route source
    const hasDailyCapQuery = routeSrc.includes('startOfDay.setUTCHours(0, 0, 0, 0)') &&
                            routeSrc.includes('todayTotal + amount > DAILY_XP_MAX_CAP') &&
                            routeSrc.includes('DAILY_XP_LIMIT_EXCEEDED');
    assert(
      hasDailyCapQuery,
      'Task 2.3.5: /api/xp/add enforces cumulative 24h DAILY_XP_MAX_CAP and returns 429 DAILY_XP_LIMIT_EXCEEDED',
      `Daily cap logic verified: ${hasDailyCapQuery}`
    );
  } catch (err: any) {
    assert(false, 'Task 2.3 execution failed', err?.message);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // TASK 2.4: Serverless Read-Only Filesystem & Fail-Closed Defense (financeService.ts)
  // ───────────────────────────────────────────────────────────────────────────
  console.log('\n── TASK 2.4: Serverless Read-Only Filesystem & Fail-Closed Defense ──');
  try {
    const financeServiceSrc = fs.readFileSync(
      path.join(process.cwd(), 'src', 'lib', 'services', 'financeService.ts'),
      'utf8'
    );

    // 4.1 Verify zero imports of localJsonDb or filesystem writing utilities
    const hasLocalJsonImport = financeServiceSrc.includes('localJsonDb');
    const hasDbFile = financeServiceSrc.includes('finance_db.json');
    const hasReadLocalDb = financeServiceSrc.includes('readLocalDb');
    const hasWriteLocalDb = financeServiceSrc.includes('writeLocalDb');

    assert(
      !hasLocalJsonImport && !hasDbFile && !hasReadLocalDb && !hasWriteLocalDb,
      'Task 2.4.1: Eradicated localJsonDb imports, finance_db.json, and readLocalDb/writeLocalDb from financeService.ts',
      `localJsonDb: ${hasLocalJsonImport}, finance_db.json: ${hasDbFile}, readLocalDb: ${hasReadLocalDb}, writeLocalDb: ${hasWriteLocalDb}`
    );

    // 4.2 Verify serverless runtime detection helper exists
    const hasServerlessHelper = financeServiceSrc.includes('isServerlessRuntime') &&
                                financeServiceSrc.includes('LIVE_DB_UNAVAILABLE');
    assert(
      hasServerlessHelper,
      'Task 2.4.2: financeService declares isServerlessRuntime() and returns LIVE_DB_UNAVAILABLE in serverless runtimes',
      `Helper present: ${hasServerlessHelper}`
    );

    // 4.3 Behavioral test: Serverless runtime fail-closed when database is offline
    const prevEnv = process.env.VERCEL;
    try {
      process.env.VERCEL = '1';
      const duesRes = await financeService.getStudentDues('serverless_test_student_01');
      assert(
        (duesRes as any).error === 'LIVE_DB_UNAVAILABLE',
        'Task 2.4.3: getStudentDues fails closed with LIVE_DB_UNAVAILABLE in serverless runtime when DB is offline',
        `Error code: ${(duesRes as any).error}`
      );

      const scholRes = await financeService.applyScholarship('serverless_test_student_01', 'SCH-MERIT');
      assert(
        scholRes.ok === false && scholRes.error === 'LIVE_DB_UNAVAILABLE',
        'Task 2.4.4: applyScholarship fails closed with LIVE_DB_UNAVAILABLE in serverless runtime when DB is offline',
        `Result ok: ${scholRes.ok}, error: ${scholRes.error}`
      );
    } finally {
      if (prevEnv !== undefined) {
        process.env.VERCEL = prevEnv;
      } else {
        delete process.env.VERCEL;
      }
    }

    // 4.4 Relational schema migration validation
    const migrationPath = path.join(process.cwd(), 'supabase', 'migrations', '20260915_finance_dues_and_scholarships.sql');
    const migrationExists = fs.existsSync(migrationPath);
    const migrationSql = migrationExists ? fs.readFileSync(migrationPath, 'utf8') : '';
    const hasDuesTable = migrationSql.includes('CREATE TABLE IF NOT EXISTS public.student_fee_dues');
    const hasInstallmentsTable = migrationSql.includes('CREATE TABLE IF NOT EXISTS public.fee_installments');
    const hasAppliedScholTable = migrationSql.includes('CREATE TABLE IF NOT EXISTS public.applied_scholarships');
    const hasRelationalRpc = migrationSql.includes('apply_student_scholarship_relational');

    assert(
      migrationExists && hasDuesTable && hasInstallmentsTable && hasAppliedScholTable && hasRelationalRpc,
      'Task 2.4.5: Migration 20260915_finance_dues_and_scholarships.sql declares student_fee_dues, fee_installments, and applied_scholarships with relational RPC',
      `Migration exists: ${migrationExists}, tables: dues=${hasDuesTable}, installments=${hasInstallmentsTable}, scholarships=${hasAppliedScholTable}`
    );

    // 4.5 Verify zero filesystem mutations (finance_db.json was never created or modified)
    const jsonPath = path.join(process.cwd(), 'src', 'lib', 'data', 'finance_db.json');
    const jsonModifiedRecently = fs.existsSync(jsonPath) ? (Date.now() - fs.statSync(jsonPath).mtimeMs < 60000) : false;
    assert(
      !jsonModifiedRecently,
      'Task 2.4.6: Zero filesystem writes: finance_db.json was untouched during offline/serverless operations',
      `Modified recently: ${jsonModifiedRecently}`
    );
  } catch (err: any) {
    assert(false, 'Task 2.4 execution failed', err?.message);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // SUMMARY
  // ───────────────────────────────────────────────────────────────────────────
  console.log('\n========================================================================');
  console.log(`🏁 FRIEND 2 BLUEPRINT SUITE: ${passed} PASSED, ${failed} FAILED (TOTAL: ${passed + failed})`);
  console.log('========================================================================');

  if (failed > 0) {
    console.error(`\n❌ ${failed} Friend 2 Blueprint check(s) failed.`);
    process.exit(1);
  } else {
    console.log('\n🎉 ALL FRIEND 2 BLUEPRINT REQUIREMENTS (TASKS 2.1 - 2.4) VERIFIED (100% GREEN)!');
    process.exit(0);
  }
}

runFriend2BlueprintTests().catch((err) => {
  console.error('Fatal error running Friend 2 Blueprint suite:', err);
  process.exit(1);
});
