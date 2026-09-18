// scripts/test_subbatch_2_2.ts
// Verification test suite for Sub-Batch 2.2: Time Integrity, Scholarships & Financial Analytics (Issues 033 – 037)

import * as dotenv from 'dotenv';
dotenv.config();

import fs from 'fs';
import path from 'path';
import { PGlite } from '@electric-sql/pglite';
import { GET as getTimeHandler, OPTIONS as optionsTimeHandler } from '../src/app/api/time/route';
import { consecutiveCalendarStreak } from '../src/lib/missions/streak';

async function runSubBatch22Tests() {
  console.log('========================================================================');
  console.log('🧪 SUB-BATCH 2.2 VERIFICATION SUITE: ISSUES 033 – 037');
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
  // TEST 1: Defect 033 - Client Clock Manipulation for 1:00 AM Pin Refresh
  // ───────────────────────────────────────────────────────────────────────────
  console.log('── TEST 1 (Defect 033): Server-Side Daily Pin Reset & Client Effect Removal ──');
  try {
    const db = new PGlite();

    // 1. Setup base users table
    await db.exec(`
      CREATE SCHEMA IF NOT EXISTS auth;
      CREATE TABLE IF NOT EXISTS auth.users (id UUID PRIMARY KEY, email TEXT);
      CREATE TABLE IF NOT EXISTS public.users (
        id UUID PRIMARY KEY,
        email TEXT,
        pins INTEGER DEFAULT 120,
        last_pin_reset TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
      );
    `);

    // 2. Load migration
    const migrationPath = path.join(process.cwd(), 'supabase', 'migrations', '20260913_subbatch_2_2_time_scholarships_analytics.sql');
    const migrationSql = fs.readFileSync(migrationPath, 'utf8');
    await db.exec(migrationSql);

    // 3. Seed test users: User A (40 pins), User B (150 pins), User C (0 pins)
    const uA = '00000000-0000-0000-0000-00000000033a';
    const uB = '00000000-0000-0000-0000-00000000033b';
    const uC = '00000000-0000-0000-0000-00000000033c';

    await db.exec(`
      INSERT INTO public.users (id, email, pins) VALUES ('${uA}', 'a@pinit.in', 40);
      INSERT INTO public.users (id, email, pins) VALUES ('${uB}', 'b@pinit.in', 150);
      INSERT INTO public.users (id, email, pins) VALUES ('${uC}', 'c@pinit.in', 0);
    `);

    // 4. Execute RPC perform_daily_pin_reset
    const rpcRes = await db.query<{ perform_daily_pin_reset: any }>(
      `SELECT public.perform_daily_pin_reset() AS perform_daily_pin_reset;`
    );
    const resetData = rpcRes.rows[0].perform_daily_pin_reset;
    assert(resetData.ok === true && resetData.reset_count === 2, 'perform_daily_pin_reset resets exactly users with pins < 120', `Reset count: ${resetData.reset_count}`);

    // Verify balances
    const checkA = await db.query<any>(`SELECT pins FROM public.users WHERE id = '${uA}';`);
    const checkB = await db.query<any>(`SELECT pins FROM public.users WHERE id = '${uB}';`);
    const checkC = await db.query<any>(`SELECT pins FROM public.users WHERE id = '${uC}';`);

    assert(checkA.rows[0].pins === 120, 'User with 40 pins reset to 120', `Pins: ${checkA.rows[0].pins}`);
    assert(checkB.rows[0].pins === 150, 'User with 150 pins preserved above 120', `Pins: ${checkB.rows[0].pins}`);
    assert(checkC.rows[0].pins === 120, 'User with 0 pins reset to 120', `Pins: ${checkC.rows[0].pins}`);

    // AST / File check: vercel.json cron configuration
    const vercelJsonPath = path.join(process.cwd(), 'vercel.json');
    const vercelJson = JSON.parse(fs.readFileSync(vercelJsonPath, 'utf8'));
    const dailyCron = (vercelJson.crons || []).find((c: any) => c.path === '/api/cron/daily-pin-reset');
    assert(dailyCron && dailyCron.schedule === '30 19 * * *', 'vercel.json configures daily pin reset cron at 01:00 IST (19:30 UTC)', dailyCron?.schedule);

    // AST check: usePins.ts does NOT contain client-side check1AMReset
    const usePinsSrc = fs.readFileSync(path.join(process.cwd(), 'src', 'lib', 'hooks', 'usePins.ts'), 'utf8');
    assert(!usePinsSrc.includes('const check1AMReset = () =>'), 'usePins.ts client-side check1AMReset effect has been eradicated');

    // AST check: CareerOSContext.tsx does NOT contain client-side check1AMReset
    const careerContextSrc = fs.readFileSync(path.join(process.cwd(), 'src', 'lib', 'context', 'CareerOSContext.tsx'), 'utf8');
    assert(!careerContextSrc.includes('check1AMReset'), 'CareerOSContext.tsx client-side check1AMReset effect has been eradicated');
  } catch (err: any) {
    assert(false, 'Test 1 exception', err.message);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // TEST 2: Defect 034 - Side-Channel Ping to Financial Endpoint for Time Sync
  // ───────────────────────────────────────────────────────────────────────────
  console.log('\n── TEST 2 (Defect 034): Dedicated /api/time Endpoint & No Financial Route Ping ──');
  try {
    // 1. Dynamic route invocation
    const getRes = await getTimeHandler();
    assert(getRes.status === 200, '/api/time returns HTTP 200');

    const serverHeader = getRes.headers.get('x-server-time');
    const cacheHeader = getRes.headers.get('cache-control');
    assert(!!serverHeader && !isNaN(Number(serverHeader)), 'x-server-time header present and numeric', `Time: ${serverHeader}`);
    assert(cacheHeader?.includes('no-store'), 'Cache-Control header prevents stale time caching', cacheHeader || '');

    const body = await getRes.json();
    const diff = Math.abs(Date.now() - body.epochMs);
    assert(diff < 5000, 'epochMs in body matches current system clock within 5s', `Diff: ${diff}ms`);

    const optionsRes = await optionsTimeHandler();
    assert(optionsRes.status === 204 && optionsRes.headers.get('x-server-time') !== null, '/api/time OPTIONS returns 204 with x-server-time header');

    // 2. AST audit: fetchServerTimeOffset in supabaseService.ts
    const progressServiceFile = path.join(process.cwd(), 'src', 'lib', 'services', 'supabase', 'progressService.ts');
    const supabaseServiceSrc = fs.readFileSync(path.join(process.cwd(), 'src', 'lib', 'supabaseService.ts'), 'utf8') + (fs.existsSync(progressServiceFile) ? '\n' + fs.readFileSync(progressServiceFile, 'utf8') : '');
    assert(
      supabaseServiceSrc.includes("fetch('/api/time'"),
      'fetchServerTimeOffset queries /api/time'
    );
    assert(
      !supabaseServiceSrc.includes("fetch('/api/pins/spend'"),
      'fetchServerTimeOffset completely eradicated pings to /api/pins/spend'
    );
  } catch (err: any) {
    assert(false, 'Test 2 exception', err.message);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // TEST 3: Defect 035 - In-Memory Scholarship Award Mutex Failure
  // ───────────────────────────────────────────────────────────────────────────
  console.log('\n── TEST 3 (Defect 035): Unique Scholarship Cycle Constraint & Atomic Stored Procedure ──');
  try {
    const db = new PGlite();

    // 1. Setup base schema
    await db.exec(`
      CREATE SCHEMA IF NOT EXISTS auth;
      CREATE TABLE IF NOT EXISTS auth.users (id UUID PRIMARY KEY, email TEXT);
      CREATE TABLE IF NOT EXISTS public.finance_dues (
        student_id TEXT PRIMARY KEY,
        total_term_fees NUMERIC DEFAULT 65000,
        scholarship_waiver NUMERIC DEFAULT 0,
        fine_levied NUMERIC DEFAULT 0,
        installments JSONB DEFAULT '[]'::jsonb
      );
    `);

    // 2. Load migration
    const migrationPath = path.join(process.cwd(), 'supabase', 'migrations', '20260913_subbatch_2_2_time_scholarships_analytics.sql');
    const migrationSql = fs.readFileSync(migrationPath, 'utf8');
    await db.exec(migrationSql);

    // 3. Seed student with dues
    const studentId = 'stu-35';
    await db.exec(`
      INSERT INTO public.finance_dues (student_id, total_term_fees, scholarship_waiver, installments)
      VALUES (
        '${studentId}',
        65000,
        0,
        '[{"id": "INST-01", "name": "Term 1", "amount": 45000, "status": "Pending"}, {"id": "INST-02", "name": "Term 2", "amount": 20000, "status": "Pending"}]'::jsonb
      );
    `);

    // 4. First disbursement: Apply SCH-MERIT (15000 waiver)
    const res1 = await db.query<{ apply_student_scholarship: any }>(
      `SELECT public.apply_student_scholarship($1, $2, $3, $4) AS apply_student_scholarship;`,
      [studentId, 'SCH-MERIT', 15000, '2026-2027']
    );
    const d1 = res1.rows[0].apply_student_scholarship;
    assert(d1.ok === true && d1.waiver === 15000, 'First scholarship award successfully disbursed', `Waiver: ${d1.waiver}`);

    // Verify finance_dues was updated and installment 1 was discounted
    const checkDues = await db.query<any>(`SELECT scholarship_waiver, installments FROM public.finance_dues WHERE student_id = '${studentId}';`);
    assert(Number(checkDues.rows[0].scholarship_waiver) === 15000, 'Dues row has scholarship_waiver = 15000');
    const inst1Amount = checkDues.rows[0].installments[0].amount;
    assert(inst1Amount === 30000, 'Installment 1 reduced from 45000 to 30000', `Amount: ${inst1Amount}`);

    // 5. Concurrent attempt: Apply second scholarship in same cycle -> Must be blocked by RPC
    const res2 = await db.query<{ apply_student_scholarship: any }>(
      `SELECT public.apply_student_scholarship($1, $2, $3, $4) AS apply_student_scholarship;`,
      [studentId, 'SCH-SPORTS', 8000, '2026-2027']
    );
    const d2 = res2.rows[0].apply_student_scholarship;
    assert(d2.ok === false && d2.already_applied === true, 'Duplicate scholarship award blocked by database RPC', d2.message);

    // 6. Direct SQL insertion with duplicate cycle -> Must fail with unique constraint violation
    let uniqueConstraintCaught = false;
    try {
      await db.exec(`
        INSERT INTO public.scholarships (student_id, scholarship_id, academic_cycle, amount, status)
        VALUES ('${studentId}', 'SCH-DIRECT-HACK', '2026-2027', 50000, 'DISBURSED');
      `);
    } catch (e: any) {
      uniqueConstraintCaught = e.message.includes('uq_student_scholarship_cycle') || e.message.includes('unique');
    }
    assert(uniqueConstraintCaught, 'Database UNIQUE(student_id, academic_cycle) constraint enforces single disbursement per cycle');

    // AST check: financeService.ts uses distributed student lock
    const financeServiceSrc = fs.readFileSync(path.join(process.cwd(), 'src', 'lib', 'services', 'financeService.ts'), 'utf8');
    assert(
      financeServiceSrc.includes("const lockKey = `schol:${studentId}`;"),
      'financeService.applyScholarship locks on student ID across serverless containers'
    );
    assert(
      financeServiceSrc.includes("supabase.rpc('apply_student_scholarship'"),
      'financeService.applyScholarship delegates to apply_student_scholarship PostgreSQL RPC'
    );
  } catch (err: any) {
    assert(false, 'Test 3 exception', err.message);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // TEST 4: Defect 036 - Unbounded Finance Admin Analytics Query
  // ───────────────────────────────────────────────────────────────────────────
  console.log('\n── TEST 4 (Defect 036): Database Aggregation RPC & Bounded Query Limits ──');
  try {
    const db = new PGlite();

    // 1. Setup base schema
    await db.exec(`
      CREATE SCHEMA IF NOT EXISTS auth;
      CREATE TABLE IF NOT EXISTS public.finance_dues (
        student_id TEXT PRIMARY KEY,
        total_term_fees NUMERIC DEFAULT 0,
        scholarship_waiver NUMERIC DEFAULT 0,
        fine_levied NUMERIC DEFAULT 0,
        installments JSONB DEFAULT '[]'::jsonb
      );

      CREATE TABLE IF NOT EXISTS public.finance_transactions (
        id TEXT PRIMARY KEY,
        student_id TEXT,
        student_name TEXT,
        student_email TEXT,
        amount NUMERIC,
        fine_paid NUMERIC,
        type TEXT,
        timestamp TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
      );
    `);

    // 2. Load migration
    const migrationPath = path.join(process.cwd(), 'supabase', 'migrations', '20260913_subbatch_2_2_time_scholarships_analytics.sql');
    const migrationSql = fs.readFileSync(migrationPath, 'utf8');
    await db.exec(migrationSql);

    // 3. Seed transactions and dues
    await db.exec(`
      INSERT INTO public.finance_dues (student_id, total_term_fees, scholarship_waiver)
      VALUES ('s1', 50000, 10000), ('s2', 60000, 0);

      INSERT INTO public.finance_transactions (id, student_id, amount, fine_paid, type)
      VALUES 
        ('tx-1', 's1', 20000, 500, 'Fee installment'),
        ('tx-2', 's1', 15000, 0, 'Fee installment'),
        ('tx-3', 's2', 30000, 1000, 'Fee installment');
    `);

    // 4. Test RPC get_finance_dashboard_aggregates
    const aggRes = await db.query<{ get_finance_dashboard_aggregates: any }>(
      `SELECT public.get_finance_dashboard_aggregates() AS get_finance_dashboard_aggregates;`
    );
    const agg = aggRes.rows[0].get_finance_dashboard_aggregates;

    // Total collected = (20000+500) + (15000+0) + (30000+1000) = 66500
    // Fines collected = 500 + 0 + 1000 = 1500
    // Total transactions = 3
    // Total fees after waiver = (50000-10000) + 60000 = 100000. Dues outstanding = 100000 - 65000 (base amount) = 35000
    assert(agg.collected === 66500, 'Aggregate total collected matches expected SQL SUM(amount + fine_paid)', `Collected: ${agg.collected}`);
    assert(agg.fines_collected === 1500, 'Aggregate fines collected matches expected SQL SUM(fine_paid)', `Fines: ${agg.fines_collected}`);
    assert(agg.transaction_count === 3, 'Aggregate transaction count matches expected SQL COUNT(*)', `Count: ${agg.transaction_count}`);

    // AST check: getAdminStats queries RPC and applies .limit(50)
    const financeServiceSrc = fs.readFileSync(path.join(process.cwd(), 'src', 'lib', 'services', 'financeService.ts'), 'utf8');
    assert(
      financeServiceSrc.includes("supabase.rpc('get_finance_dashboard_aggregates')"),
      'financeService.getAdminStats invokes get_finance_dashboard_aggregates RPC'
    );
    assert(
      financeServiceSrc.includes(".limit(50)"),
      'financeService.getAdminStats caps transaction fetching to .limit(50) preventing memory exhaustion'
    );
    assert(
      !financeServiceSrc.includes("select('*');"),
      'Unbounded select(*) over all transactions has been completely eliminated'
    );
  } catch (err: any) {
    assert(false, 'Test 4 exception', err.message);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // TEST 5: Defect 037 - Client-Side Streak Decay Manipulation
  // ───────────────────────────────────────────────────────────────────────────
  console.log('\n── TEST 5 (Defect 037): Server-Side Streak Dynamic Computation & Client Writes Stripped ──');
  try {
    // 1. Verify consecutiveCalendarStreak algorithm
    const now = new Date();
    const today = new Date(now).toISOString();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
    const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString();
    const fourDaysAgo = new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString();

    // Active 3-day streak: today + yesterday + 2 days ago
    const active3 = consecutiveCalendarStreak([today, yesterday, twoDaysAgo]);
    assert(active3 === 3, 'consecutiveCalendarStreak returns 3 for 3 consecutive days including today', `Streak: ${active3}`);

    // Gap yesterday: today + 2 days ago -> streak is 1 (yesterday missed, previous days decayed!)
    const gapStreak = consecutiveCalendarStreak([today, twoDaysAgo]);
    assert(gapStreak === 1, 'consecutiveCalendarStreak returns 1 when yesterday was missed (auto-decayed)', `Streak: ${gapStreak}`);

    // Inactive: 4 days ago -> streak is 0
    const decayed0 = consecutiveCalendarStreak([fourDaysAgo]);
    assert(decayed0 === 0, 'consecutiveCalendarStreak returns 0 when no activity in past 48h', `Streak: ${decayed0}`);

    // Empty list
    assert(consecutiveCalendarStreak([]) === 0, 'consecutiveCalendarStreak returns 0 for empty list');

    // 2. AST check: client-side streak decay effect removed from CareerOSContext.tsx
    const careerContextSrc = fs.readFileSync(path.join(process.cwd(), 'src', 'lib', 'context', 'CareerOSContext.tsx'), 'utf8');
    assert(
      !careerContextSrc.includes('Streak Decayed 📉'),
      'CareerOSContext.tsx does not execute client-side streak decay toast or effect'
    );
    assert(
      !careerContextSrc.includes("api.post('/api/auth/onboarding', { mission_streak:"),
      'CareerOSContext.tsx does not dispatch client-side mission_streak mutations to /api/auth/onboarding'
    );

    // 3. AST check: /api/auth/onboarding strips mission_streak
    const clientSrc = fs.readFileSync(path.join(process.cwd(), 'src', 'lib', 'api', 'client.ts'), 'utf8');
    assert(
      clientSrc.includes('delete raw.mission_streak;'),
      '/api/auth/onboarding strips raw.mission_streak from client request payloads'
    );
    assert(
      clientSrc.includes('delete answers.mission_streak;'),
      '/api/auth/onboarding strips answers.mission_streak from nested answers payloads'
    );
    assert(
      clientSrc.includes('consecutiveCalendarStreak('),
      '/api/auth/onboarding GET evaluates streak dynamically via consecutiveCalendarStreak'
    );

    // 4. AST check: stripSelfServicePrivileges strips mission_streak
    const userServiceFile = path.join(process.cwd(), 'src', 'lib', 'services', 'supabase', 'userService.ts');
    const supabaseServiceSrc = fs.readFileSync(path.join(process.cwd(), 'src', 'lib', 'supabaseService.ts'), 'utf8') + (fs.existsSync(userServiceFile) ? '\n' + fs.readFileSync(userServiceFile, 'utf8') : '');
    assert(
      supabaseServiceSrc.includes('delete row.mission_streak;'),
      'stripSelfServicePrivileges deletes row.mission_streak from unprivileged user writes'
    );
  } catch (err: any) {
    assert(false, 'Test 5 exception', err.message);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // SUMMARY
  // ───────────────────────────────────────────────────────────────────────────
  console.log('\n========================================================================');
  console.log(`🏁 SUB-BATCH 2.2 SUMMARY: ${passed} PASSED / ${failed} FAILED`);
  console.log('========================================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runSubBatch22Tests().catch((e) => {
  console.error('Fatal test runner error:', e);
  process.exit(1);
});
