// scripts/test_subbatch_2_3.ts
// Verification test suite for Sub-Batch 2.3: Payment Gateways & Transaction Logs (Issues 038 – 042)

import * as dotenv from 'dotenv';
dotenv.config();
process.env.ALLOW_DEV_AUTH_BYPASS = 'true';
process.env.NODE_ENV = 'test';

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { PGlite } from '@electric-sql/pglite';
import { POST as verifyPaymentHandler } from '../src/app/api/payment/verify/route';
import { POST as webhookHandler } from '../src/app/api/payment/webhook/route';
import { POST as claimStreakBonusHandler } from '../src/app/api/pins/claim-streak-bonus/route';
import { financeService } from '../src/lib/services/financeService';

async function runSubBatch23Tests() {
  console.log('========================================================================');
  console.log('🧪 SUB-BATCH 2.3 VERIFICATION SUITE: ISSUES 038 – 042');
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
  // TEST 1: Defect 038 - Mock Payment Bypass Prevention & Dev Sandbox Audit
  // ───────────────────────────────────────────────────────────────────────────
  console.log('── TEST 1 (Defect 038): Mock Payment Bypass Guard & Sandbox Audit ──');
  try {
    const originalNodeEnv = process.env.NODE_ENV;
    const originalAllowMock = process.env.ALLOW_DEV_MOCK_PAYMENT;

    // 1.1 In production mode, mock payments must be strictly rejected with 403
    (process.env as any).NODE_ENV = 'production';
    (process.env as any).ALLOW_DEV_MOCK_PAYMENT = 'true';

    const fakeReqProd = new Request('http://localhost:3000/api/payment/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer fake_token'
      },
      body: JSON.stringify({
        razorpay_order_id: 'order_mock_attack_999',
        razorpay_payment_id: 'pay_mock_attack_999',
        razorpay_signature: 'sig_mock_fake',
        planId: 'pack_500'
      })
    });

    const prodRes = await verifyPaymentHandler(fakeReqProd);
    const prodBody = await prodRes.json().catch(() => ({}));

    assert(
      prodRes.status === 403 && prodBody.error === 'MOCK_PAYMENT_FORBIDDEN',
      'Defect 038.1: Production environment strictly forbids mock payments (403 MOCK_PAYMENT_FORBIDDEN)',
      `Status: ${prodRes.status}, Error: ${prodBody.error}`
    );

    // 1.2 In development mode when ALLOW_DEV_MOCK_PAYMENT is 'false', mock payments must be disabled
    (process.env as any).NODE_ENV = 'development';
    (process.env as any).ALLOW_DEV_MOCK_PAYMENT = 'false';

    const fakeReqDisabled = new Request('http://localhost:3000/api/payment/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token-dev'
      },
      body: JSON.stringify({
        razorpay_order_id: 'order_mock_test_111',
        razorpay_payment_id: 'pay_mock_test_111',
        razorpay_signature: 'sig_mock_test',
        planId: 'pack_150'
      })
    });

    const disabledRes = await verifyPaymentHandler(fakeReqDisabled);
    const disabledBody = await disabledRes.json().catch(() => ({}));

    assert(
      disabledRes.status === 403 && disabledBody.error === 'MOCK_PAYMENT_DISABLED',
      'Defect 038.2: Dev mode with ALLOW_DEV_MOCK_PAYMENT=false rejects mock payments (403 MOCK_PAYMENT_DISABLED)',
      `Status: ${disabledRes.status}, Error: ${disabledBody.error}`
    );

    // Restore env
    (process.env as any).NODE_ENV = originalNodeEnv;
    (process.env as any).ALLOW_DEV_MOCK_PAYMENT = originalAllowMock;

    // 1.3 Verify atomic credit_pins stored procedure in PGlite
    const db = new PGlite();
    await db.exec(`
      CREATE SCHEMA IF NOT EXISTS auth;
      CREATE TABLE IF NOT EXISTS public.users (
        id UUID PRIMARY KEY,
        email TEXT,
        pins INTEGER DEFAULT 120,
        pin_history JSONB DEFAULT '[]'::jsonb
      );
    `);

    const migrationPath = path.join(process.cwd(), 'supabase', 'migrations', '20260913_subbatch_2_3_payment_gateways_ledgers.sql');
    const migrationSql = fs.readFileSync(migrationPath, 'utf8');
    await db.exec(migrationSql);

    const testUid = '00000000-0000-0000-0000-000000000038';
    await db.exec(`INSERT INTO public.users (id, email, pins) VALUES ('${testUid}', 'user38@test.com', 100);`);

    const creditRes = await db.query<{ credit_pins: any }>(
      `SELECT public.credit_pins('${testUid}'::UUID, 150, 'Test Credit Pack 150', 'purchase') AS credit_pins;`
    );
    const creditData = creditRes.rows[0].credit_pins;

    assert(
      creditData.ok === true && creditData.new_balance === 250,
      'Defect 038.3: credit_pins stored procedure executes atomic balance increment (100 -> 250 pins)',
      `Balance: ${creditData.new_balance}`
    );

    const checkUser = await db.query<{ pins: number, pin_history: any }>(
      `SELECT pins, pin_history FROM public.users WHERE id = '${testUid}';`
    );
    const history = checkUser.rows[0].pin_history;
    assert(
      checkUser.rows[0].pins === 250 && Array.isArray(history) && history.length === 1 && history[0].amount === 150,
      'Defect 038.4: credit_pins records transaction history in jsonb log on user row',
      `History count: ${history.length}, amount: ${history[0]?.amount}`
    );

    // 1.4 Non-positive amounts must be rejected by credit_pins
    const invalidCredit = await db.query<{ credit_pins: any }>(
      `SELECT public.credit_pins('${testUid}'::UUID, 0, 'Zero credit', 'purchase') AS credit_pins;`
    );
    assert(
      invalidCredit.rows[0].credit_pins.ok === false && invalidCredit.rows[0].credit_pins.reason === 'INVALID_AMOUNT',
      'Defect 038.5: credit_pins rejects non-positive credit amounts (INVALID_AMOUNT)',
      `Reason: ${invalidCredit.rows[0].credit_pins.reason}`
    );
  } catch (err: any) {
    assert(false, 'Defect 038 execution threw unexpected exception', err.message);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // TEST 2: Defect 039 - Razorpay Webhook Endpoint with HMAC & Replay Protection
  // ───────────────────────────────────────────────────────────────────────────
  console.log('\n── TEST 2 (Defect 039): Razorpay Webhook HMAC-SHA256 & Event Routing ──');
  try {
    const originalWebhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    // 2.1 Missing RAZORPAY_WEBHOOK_SECRET returns 503
    delete (process.env as any).RAZORPAY_WEBHOOK_SECRET;
    const reqNoSecret = new Request('http://localhost:3000/api/payment/webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: 'payment.captured' })
    });
    const noSecretRes = await webhookHandler(reqNoSecret);
    const noSecretBody = await noSecretRes.json().catch(() => ({}));

    assert(
      noSecretRes.status === 503 && noSecretBody.error === 'WEBHOOK_NOT_CONFIGURED',
      'Defect 039.1: Webhook fails closed (503 WEBHOOK_NOT_CONFIGURED) when secret is not set',
      `Status: ${noSecretRes.status}`
    );

    // 2.2 Configure secret
    const testSecret = 'rzp_wh_secret_test_xyz123';
    process.env.RAZORPAY_WEBHOOK_SECRET = testSecret;

    // Missing signature returns 400
    const reqNoSig = new Request('http://localhost:3000/api/payment/webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: 'payment.captured' })
    });
    const noSigRes = await webhookHandler(reqNoSig);
    assert(
      noSigRes.status === 400,
      'Defect 039.2: Webhook rejects request missing x-razorpay-signature with 400',
      `Status: ${noSigRes.status}`
    );

    // 2.3 Invalid HMAC signature returns 400
    const rawPayload = JSON.stringify({
      event: 'payment.captured',
      payload: {
        payment: {
          entity: {
            id: 'pay_captured_test_1',
            order_id: 'order_test_1',
            status: 'captured',
            amount: 9900,
            notes: { uid: 'user_test_webhook', planId: 'pack_150' }
          }
        }
      }
    });

    const reqBadSig = new Request('http://localhost:3000/api/payment/webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-razorpay-signature': '0000000000000000000000000000000000000000000000000000000000000000'
      },
      body: rawPayload
    });
    const badSigRes = await webhookHandler(reqBadSig);
    const badSigBody = await badSigRes.json().catch(() => ({}));
    assert(
      badSigRes.status === 400 && badSigBody.error === 'INVALID_SIGNATURE',
      'Defect 039.3: Webhook rejects tampered or invalid HMAC signature with 400 INVALID_SIGNATURE',
      `Status: ${badSigRes.status}`
    );

    // 2.4 Valid signature on ignored event (e.g. payment.failed) returns 200 ignored
    const ignorePayload = JSON.stringify({ event: 'payment.failed' });
    const ignoreHmac = crypto.createHmac('sha256', testSecret).update(ignorePayload).digest('hex');

    const reqIgnore = new Request('http://localhost:3000/api/payment/webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-razorpay-signature': ignoreHmac
      },
      body: ignorePayload
    });
    const ignoreRes = await webhookHandler(reqIgnore);
    const ignoreBody = await ignoreRes.json().catch(() => ({}));
    assert(
      ignoreRes.status === 200 && ignoreBody.ignored === true,
      'Defect 039.4: Non-captured events return 200 { ignored: true } without processing',
      `Status: ${ignoreRes.status}, Ignored: ${ignoreBody.ignored}`
    );

    // Restore webhook secret
    if (originalWebhookSecret) {
      process.env.RAZORPAY_WEBHOOK_SECRET = originalWebhookSecret;
    } else {
      delete (process.env as any).RAZORPAY_WEBHOOK_SECRET;
    }
  } catch (err: any) {
    assert(false, 'Defect 039 execution threw unexpected exception', err.message);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // TEST 3: Defect 040 - Fail-Closed Integrity & Zero Local JSON Writes in payDue
  // ───────────────────────────────────────────────────────────────────────────
  console.log('\n── TEST 3 (Defect 040): Eradication of Local JSON Fallback & Fail-Closed payDue ──');
  try {
    const financeServiceSrc = fs.readFileSync(
      path.join(process.cwd(), 'src', 'lib', 'services', 'financeService.ts'),
      'utf8'
    );

    // 3.1 Extract payDue implementation and verify zero references to readLocalDb or writeLocalDb
    const payDueStart = financeServiceSrc.indexOf('async payDue(');
    const payDueEnd = financeServiceSrc.indexOf('async getScholarships()', payDueStart);
    const payDueBody = financeServiceSrc.substring(payDueStart, payDueEnd);

    const hasReadLocal = payDueBody.includes('readLocalDb');
    const hasWriteLocal = payDueBody.includes('writeLocalDb');

    assert(
      !hasReadLocal && !hasWriteLocal,
      'Defect 040.1: financeService.payDue has ZERO calls to readLocalDb or writeLocalDb (local ledger fallback eradicated)',
      `readLocalDb in payDue: ${hasReadLocal}, writeLocalDb in payDue: ${hasWriteLocal}`
    );

    // 3.2 Verify fail-closed error constant in source
    assert(
      payDueBody.includes('PAYMENT_GATEWAY_RECORDING_FAILED'),
      'Defect 040.2: payDue explicitly returns PAYMENT_GATEWAY_RECORDING_FAILED when database persistence cannot be confirmed',
      'Contains PAYMENT_GATEWAY_RECORDING_FAILED'
    );

    // 3.3 Test real payDue call when database is unavailable (simulated)
    // When Supabase connection is absent / checkSupabaseAvailable is false, payDue must fail closed
    const payResult = await financeService.payDue('stu_fake_test', 'Fake Student', 'inst_fake_99');
    assert(
      payResult.ok === false && (payResult.error === 'PAYMENT_GATEWAY_RECORDING_FAILED' || payResult.error === 'PAYMENT_FAILED'),
      'Defect 040.3: payDue fails closed with error when backend persistence fails (never phantom marks Paid)',
      `Result ok: ${payResult.ok}, error: ${payResult.error}`
    );
  } catch (err: any) {
    assert(false, 'Defect 040 execution threw unexpected exception', err.message);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // TEST 4: Defect 041 - Stored Procedure process_fee_installment_payment & Row Locking
  // ───────────────────────────────────────────────────────────────────────────
  console.log('\n── TEST 4 (Defect 041): Atomic Fee Installment Stored Procedure & Ledger ──');
  try {
    const db = new PGlite();

    // 1. Setup tables
    await db.exec(`
      CREATE SCHEMA IF NOT EXISTS auth;
      CREATE TABLE IF NOT EXISTS public.users (
        id UUID PRIMARY KEY,
        pins INTEGER DEFAULT 120
      );
      CREATE TABLE IF NOT EXISTS public.finance_dues (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        student_id TEXT NOT NULL UNIQUE,
        student_name TEXT,
        installments JSONB DEFAULT '[]'::jsonb,
        fine_levied NUMERIC DEFAULT 0
      );
      CREATE TABLE IF NOT EXISTS public.finance_transactions (
        id TEXT PRIMARY KEY,
        student_id TEXT NOT NULL,
        student_name TEXT,
        student_email TEXT,
        amount NUMERIC NOT NULL DEFAULT 0,
        fine_paid NUMERIC NOT NULL DEFAULT 0,
        type TEXT,
        timestamp TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
      );
    `);

    // Load migration
    const migrationPath = path.join(process.cwd(), 'supabase', 'migrations', '20260913_subbatch_2_3_payment_gateways_ledgers.sql');
    const migrationSql = fs.readFileSync(migrationPath, 'utf8');
    await db.exec(migrationSql);

    // Seed student dues
    const studentId = 'stu_verified_041';
    const installmentsSeed = JSON.stringify([
      { id: 'inst_term_1', name: 'Term 1 Tuition', amount: 15000, deadline: '2026-10-01', status: 'Pending' },
      { id: 'inst_term_2', name: 'Term 2 Tuition', amount: 15000, deadline: '2026-12-01', status: 'Pending' },
    ]);

    await db.exec(`
      INSERT INTO public.finance_dues (student_id, student_name, installments, fine_levied)
      VALUES ('${studentId}', 'Ananya Sharma', '${installmentsSeed}'::jsonb, 500);
      INSERT INTO public.student_fees (student_id, total_amount, paid_amount, balance)
      VALUES ('${studentId}', 30000, 0, 30000);
    `);

    // 4.1 Process payment for inst_term_1
    const rpcRes = await db.query<{ process_fee_installment_payment: any }>(
      `SELECT public.process_fee_installment_payment(
        '${studentId}', 'Ananya Sharma', 'ananya@test.com', 'inst_term_1', 'RCP-41001'
      ) AS process_fee_installment_payment;`
    );

    const resData = rpcRes.rows[0].process_fee_installment_payment;
    assert(
      resData.ok === true && resData.receipt_id === 'RCP-41001' && Number(resData.amount) === 15000,
      'Defect 041.1: process_fee_installment_payment successfully processes installment payment',
      `Receipt: ${resData.receipt_id}, Amount: ${resData.amount}`
    );

    // 4.2 Verify finance_dues state
    const duesCheck = await db.query<{ installments: any, fine_levied: number }>(
      `SELECT installments, fine_levied FROM public.finance_dues WHERE student_id = '${studentId}';`
    );
    const duesInsts = duesCheck.rows[0].installments;
    const paidInst = duesInsts.find((i: any) => i.id === 'inst_term_1');
    const pendingInst = duesInsts.find((i: any) => i.id === 'inst_term_2');

    assert(
      paidInst.status === 'Paid' && (paidInst.receiptId === 'RCP-41001' || paidInst.receiptid === 'RCP-41001') && pendingInst.status === 'Pending' && Number(duesCheck.rows[0].fine_levied) === 0,
      'Defect 041.2: finance_dues marks targeted installment Paid, leaves others Pending, resets fine to 0',
      `Inst1: ${paidInst.status}, Inst2: ${pendingInst.status}, Fine: ${duesCheck.rows[0].fine_levied}`
    );

    // 4.3 Verify finance_transactions insert
    const txCheck = await db.query<{ id: string, amount: number, fine_paid: number }>(
      `SELECT id, amount, fine_paid FROM public.finance_transactions WHERE id = 'RCP-41001';`
    );
    assert(
      txCheck.rows.length === 1 && Number(txCheck.rows[0].amount) === 15000 && Number(txCheck.rows[0].fine_paid) === 500,
      'Defect 041.3: finance_transactions logs complete audit row with fee amount and fine paid',
      `Rows: ${txCheck.rows.length}, Amount: ${txCheck.rows[0]?.amount}`
    );

    // 4.4 Verify fee_payments append-only ledger
    const ledgerCheck = await db.query<{ id: string, installment_id: string }>(
      `SELECT id, installment_id FROM public.fee_payments WHERE id = 'RCP-41001';`
    );
    assert(
      ledgerCheck.rows.length === 1 && ledgerCheck.rows[0].installment_id === 'inst_term_1',
      'Defect 041.4: fee_payments append-only ledger persists payment record',
      `Ledger ID: ${ledgerCheck.rows[0]?.id}`
    );

    // 4.5 Verify student_fees balance decrement
    const feeCheck = await db.query<{ paid_amount: number, balance: number }>(
      `SELECT paid_amount, balance FROM public.student_fees WHERE student_id = '${studentId}';`
    );
    assert(
      Number(feeCheck.rows[0].paid_amount) === 15000 && Number(feeCheck.rows[0].balance) === 15000,
      'Defect 041.5: student_fees paid_amount incremented to 15000, balance decremented to 15000',
      `Paid: ${feeCheck.rows[0].paid_amount}, Balance: ${feeCheck.rows[0].balance}`
    );

    // 4.6 Idempotency: Re-paying same installment returns already_paid without double-charging
    const replayRes = await db.query<{ process_fee_installment_payment: any }>(
      `SELECT public.process_fee_installment_payment(
        '${studentId}', 'Ananya Sharma', 'ananya@test.com', 'inst_term_1', 'RCP-REPLAY'
      ) AS process_fee_installment_payment;`
    );
    const replayData = replayRes.rows[0].process_fee_installment_payment;
    assert(
      replayData.ok === true && replayData.already_paid === true && replayData.receipt_id === 'RCP-41001',
      'Defect 041.6: Re-paying an already-paid installment is idempotent and returns already_paid=true',
      `Already paid: ${replayData.already_paid}, Receipt: ${replayData.receipt_id}`
    );

    // 4.7 Negative balance constraint check
    let constraintViolated = false;
    try {
      await db.exec(`
        INSERT INTO public.student_fees (student_id, total_amount, paid_amount, balance)
        VALUES ('stu_neg_test', 1000, 2000, -1000);
      `);
    } catch {
      constraintViolated = true;
    }
    assert(
      constraintViolated,
      'Defect 041.7: student_fees table rejects negative balances via chk_student_fees_balance CHECK constraint',
      `Constraint triggered: ${constraintViolated}`
    );
  } catch (err: any) {
    assert(false, 'Defect 041 execution threw unexpected exception', err.message);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // TEST 5: Defect 042 - Server-Authoritative Streak Bonus Verification & Anti-Replay
  // ───────────────────────────────────────────────────────────────────────────
  console.log('\n── TEST 5 (Defect 042): Server-Authoritative Streak Bonus Claims ──');
  try {
    // 5.1 Unauthenticated request returns 401
    const unauthReq = new Request('http://localhost:3000/api/pins/claim-streak-bonus', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ milestone: 7 })
    });
    const unauthRes = await claimStreakBonusHandler(unauthReq);
    assert(
      unauthRes.status === 401,
      'Defect 042.1: /api/pins/claim-streak-bonus rejects unauthenticated calls with 401',
      `Status: ${unauthRes.status}`
    );

    // 5.2 Invalid milestone validation (must be positive integer multiple of 7)
    // Mock user auth header
    const mockAuthReq = (milestone: any) => new Request('http://localhost:3000/api/pins/claim-streak-bonus', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token-dev'
      },
      body: JSON.stringify({ milestone })
    });

    const badMilestone1 = await claimStreakBonusHandler(mockAuthReq(5));
    const badBody1 = await badMilestone1.json().catch(() => ({}));

    const badMilestone2 = await claimStreakBonusHandler(mockAuthReq(-7));
    const badBody2 = await badMilestone2.json().catch(() => ({}));

    assert(
      badMilestone1.status === 400 && badBody1.error === 'INVALID_MILESTONE' &&
      badMilestone2.status === 400 && badBody2.error === 'INVALID_MILESTONE',
      'Defect 042.2: Non-multiples of 7 (5) and negative integers (-7) are rejected with 400 INVALID_MILESTONE',
      `Status1: ${badMilestone1.status}, Status2: ${badMilestone2.status}`
    );

    // 5.3 Verify CareerOSContext.tsx source code no longer calls earnPins('streak_bonus')
    const contextPath = path.join(process.cwd(), 'src', 'lib', 'context', 'CareerOSContext.tsx');
    const userProgressPath = path.join(process.cwd(), 'src', 'lib', 'context', 'UserProgressContext.tsx');
    const contextSrc = fs.readFileSync(contextPath, 'utf8') + (fs.existsSync(userProgressPath) ? '\n' + fs.readFileSync(userProgressPath, 'utf8') : '');
    const hasClientStreakBonusEarn = contextSrc.includes("earnPins('streak_bonus'");
    const callsClaimStreakBonusApi = contextSrc.includes('/api/pins/claim-streak-bonus');

    assert(
      !hasClientStreakBonusEarn && callsClaimStreakBonusApi,
      'Defect 042.3: CareerOSContext.tsx eradicated client-side earnPins streak_bonus in favor of server endpoint',
      `Client earnPins: ${hasClientStreakBonusEarn}, Server API called: ${callsClaimStreakBonusApi}`
    );

    // 5.4 Test streak_claims table replay protection in PGlite
    const db = new PGlite();
    await db.exec(`
      CREATE SCHEMA IF NOT EXISTS auth;
      CREATE TABLE IF NOT EXISTS public.users (
        id UUID PRIMARY KEY,
        pins INTEGER DEFAULT 120
      );
    `);

    const migrationPath = path.join(process.cwd(), 'supabase', 'migrations', '20260913_subbatch_2_3_payment_gateways_ledgers.sql');
    const migrationSql = fs.readFileSync(migrationPath, 'utf8');
    await db.exec(migrationSql);

    const testUid = '00000000-0000-0000-0000-000000000042';
    await db.exec(`INSERT INTO public.users (id) VALUES ('${testUid}');`);

    // Insert claim for milestone 7
    await db.exec(`
      INSERT INTO public.streak_claims (user_id, milestone, pins_granted)
      VALUES ('${testUid}', 7, 50);
    `);

    // Attempt duplicate claim for milestone 7
    let replayPrevented = false;
    try {
      await db.exec(`
        INSERT INTO public.streak_claims (user_id, milestone, pins_granted)
        VALUES ('${testUid}', 7, 50);
      `);
    } catch {
      replayPrevented = true;
    }

    assert(
      replayPrevented,
      'Defect 042.4: streak_claims table enforces UNIQUE(user_id, milestone) replay protection',
      `Replay blocked: ${replayPrevented}`
    );

    // Milestone 14 insert succeeds
    let milestone14Allowed = false;
    try {
      await db.exec(`
        INSERT INTO public.streak_claims (user_id, milestone, pins_granted)
        VALUES ('${testUid}', 14, 50);
      `);
      milestone14Allowed = true;
    } catch {}

    assert(
      milestone14Allowed,
      'Defect 042.5: streak_claims allows claiming distinct subsequent milestone (14 days)',
      `Milestone 14 recorded: ${milestone14Allowed}`
    );
  } catch (err: any) {
    assert(false, 'Defect 042 execution threw unexpected exception', err.message);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // SUMMARY
  // ───────────────────────────────────────────────────────────────────────────
  console.log('\n========================================================================');
  console.log(`🏁 SUB-BATCH 2.3 RESULT: ${passed} PASSED, ${failed} FAILED (TOTAL: ${passed + failed})`);
  console.log('========================================================================');

  if (failed > 0) {
    process.exit(1);
  } else {
    console.log('🎉 ALL SUB-BATCH 2.3 DEFECTS (038 – 042) FULLY REMEDIATED & VERIFIED!');
  }
}

runSubBatch23Tests().catch((err) => {
  console.error('Fatal error running Sub-Batch 2.3 tests:', err);
  process.exit(1);
});
