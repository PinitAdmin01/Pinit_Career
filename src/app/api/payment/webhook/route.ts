import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import { fulfilCardCoursePurchase, isCoursePlanId, normalizeTrack } from '@/lib/server/courseEnrollments';

/**
 * Razorpay server-to-server webhook endpoint.
 * Handles asynchronous payment events (e.g. payment.captured) to ensure
 * reliable pin crediting and subscription provisioning even if client disconnects.
 */
export async function POST(req: Request) {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || '';
    if (!webhookSecret) {
      console.error('[Razorpay Webhook] RAZORPAY_WEBHOOK_SECRET is not configured');
      return NextResponse.json(
        { ok: false, error: 'WEBHOOK_NOT_CONFIGURED' },
        { status: 503 }
      );
    }

    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature') || '';

    if (!signature) {
      return NextResponse.json(
        { ok: false, error: 'MISSING_SIGNATURE' },
        { status: 400 }
      );
    }

    // Cryptographic HMAC-SHA256 verification using timing-safe comparison
    const expected = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex');

    const a = Buffer.from(expected, 'utf8');
    const b = Buffer.from(signature, 'utf8');

    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
      console.error('[Razorpay Webhook] Invalid signature received');
      return NextResponse.json(
        { ok: false, error: 'INVALID_SIGNATURE' },
        { status: 400 }
      );
    }

    let payload: any;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json(
        { ok: false, error: 'MALFORMED_JSON' },
        { status: 400 }
      );
    }

    // We only process payment.captured events
    if (payload.event !== 'payment.captured') {
      return NextResponse.json({ ok: true, ignored: true, event: payload.event }, { status: 200 });
    }

    const payment = payload.payload?.payment?.entity;
    if (!payment) {
      return NextResponse.json(
        { ok: false, error: 'MISSING_PAYMENT_ENTITY' },
        { status: 400 }
      );
    }

    const paymentId = String(payment.id || '');
    const orderId = String(payment.order_id || '');
    const status = String(payment.status || '');
    const notesUid = String(payment.notes?.uid || '');
    const notesPlanId = String(payment.notes?.planId || '');
    const notesInstallmentId = String(payment.notes?.installmentId || '');
    const isFeeInstallment = notesPlanId.startsWith('installment_') || Boolean(notesInstallmentId);

    if (status !== 'captured') {
      return NextResponse.json({ ok: true, ignored: true, status }, { status: 200 });
    }

    if (!notesUid) {
      console.warn('[Razorpay Webhook] Payment captured but missing notes.uid:', paymentId);
      return NextResponse.json(
        { ok: false, error: 'MISSING_USER_ID' },
        { status: 400 }
      );
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

    if (!url || !serviceKey) {
      console.error('[Razorpay Webhook] Supabase credentials missing');
      return NextResponse.json(
        { ok: false, error: 'DATABASE_UNAVAILABLE' },
        { status: 503 }
      );
    }

    const admin = createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    // 1. Replay guard check
    const { data: existingPayment, error: selectErr } = await admin
      .from('processed_payments')
      .select('payment_id')
      .eq('payment_id', paymentId)
      .maybeSingle();

    if (selectErr) {
      console.error('[Razorpay Webhook] Failed to query processed_payments:', selectErr);
      return NextResponse.json(
        { ok: false, error: 'REPLAY_GUARD_ERROR' },
        { status: 500 }
      );
    }

    // Course plans: enroll the student even if their browser never called /verify.
    // Idempotent by payment id, so verify and webhook can arrive in either order.
    const fulfilCoursePlan = async () => {
      const fulfilled = await fulfilCardCoursePurchase(admin, {
        userId: notesUid,
        planId: notesPlanId,
        track: normalizeTrack(payment.notes?.track),
        paymentId,
        orderId,
        amountPaid: Number(payment.amount || 0) / 100,
      });
      if (fulfilled.error || !fulfilled.enrollment) {
        console.error('[Razorpay Webhook] Course enrollment failed:', paymentId, fulfilled.error);
        return NextResponse.json({ ok: false, error: 'COURSE_ENROLLMENT_FAILED' }, { status: 500 });
      }
      return NextResponse.json({ ok: true, processed: true, type: 'course', paymentId, enrollmentId: fulfilled.enrollment.enrollmentId });
    };

    if (existingPayment) {
      if (isCoursePlanId(notesPlanId)) return fulfilCoursePlan();
      if (isFeeInstallment) {
        const installmentId = notesInstallmentId || notesPlanId.replace('installment_', '').trim();
        const { financeService } = await import('@/lib/services/financeService');
        const dues = await financeService.getStudentDues(notesUid);
        const inst = (dues.installments || []).find((i: any) => String(i.id) === installmentId);
        if (!inst || inst.status !== 'Paid') {
          const studentName = payment.notes?.studentName || payment.notes?.name || payment.email || 'Student';
          const studentEmail = payment.email || payment.notes?.email || '';
          await financeService.payDue(notesUid, studentName, installmentId, studentEmail, paymentId);
        }
      }
      return NextResponse.json({
        ok: true,
        already_processed: true,
        paymentId
      });
    }

    // 2. Fee Installment handling: mark installment paid FIRST, then record processed_payments
    if (isFeeInstallment) {
      const installmentId = notesInstallmentId || notesPlanId.replace('installment_', '').trim();
      const studentName = payment.notes?.studentName || payment.notes?.name || payment.email || 'Student';
      const studentEmail = payment.email || payment.notes?.email || '';

      const { financeService } = await import('@/lib/services/financeService');
      const feeResult = await financeService.payDue(
        notesUid,
        studentName,
        installmentId,
        studentEmail,
        paymentId
      );

      if (!feeResult || !feeResult.ok) {
        console.error('[Razorpay Webhook] Fee installment update failed:', feeResult);
        return NextResponse.json(
          { ok: false, error: 'FEE_PAYMENT_RECONCILIATION_FAILED', details: feeResult },
          { status: 500 }
        );
      }

      await admin.from('processed_payments').upsert({
        payment_id: paymentId,
        order_id: orderId,
        user_id: notesUid,
        plan_id: `installment_${installmentId}`,
        pins_granted: 0,
      });

      return NextResponse.json({
        ok: true,
        processed: true,
        type: 'installment',
        paymentId,
        installmentId,
        receiptId: feeResult.receiptId || paymentId
      });
    }

    // Determine pins to grant
    let pinsGranted = 0;
    const isSubscriptionPlan = notesPlanId === 'pro' || notesPlanId === 'basic_student' || notesPlanId === 'student_99';
    if (notesPlanId === 'pack_100') pinsGranted = 100;
    else if (notesPlanId === 'pack_300') pinsGranted = 300;
    else if (notesPlanId === 'pack_500') pinsGranted = 500;
    else if (notesPlanId === 'pack_1000') pinsGranted = 1000;
    else if (notesPlanId === 'pack_50') pinsGranted = 50;
    else if (notesPlanId === 'pack_150') pinsGranted = 150;
    else if (notesPlanId === 'pack_1200') pinsGranted = 1200;
    else if (notesPlanId === 'pack_custom') {
      const customVal = Number(payment.notes?.customPins);
      pinsGranted = Number.isFinite(customVal) && customVal >= 100 && customVal <= 10000 ? Math.floor(customVal) : 0;
    }

    // 3. Insert into processed_payments (atomic lock against concurrent processing)
    const { error: insertErr } = await admin.from('processed_payments').insert({
      payment_id: paymentId,
      order_id: orderId,
      user_id: notesUid,
      plan_id: notesPlanId,
      pins_granted: notesPlanId === 'pro' ? 500 : pinsGranted,
    });

    if (insertErr) {
      if (insertErr.code === '23505') {
        if (isCoursePlanId(notesPlanId)) return fulfilCoursePlan();
        return NextResponse.json({
          ok: true,
          already_processed: true,
          paymentId
        });
      }
      console.error('[Razorpay Webhook] Failed to insert processed_payments:', insertErr);
      return NextResponse.json(
        { ok: false, error: 'REPLAY_RECORD_FAILED' },
        { status: 500 }
      );
    }

    if (isCoursePlanId(notesPlanId)) return fulfilCoursePlan();

    // 3. Subscription handling (Airtel/Jio daily reset model: 120 daily pins + permanent vault)
    if (isSubscriptionPlan) {
      const SUB_PERIOD_DAYS = 30;
      const nowMs = Date.now();
      const subTier = notesPlanId === 'pro' ? 'pro' : 'basic';

      const { data: current } = await admin
        .from('users')
        .select('pins, bonus_pins, subscription_expires_at')
        .eq('id', notesUid)
        .maybeSingle();

      const existingExpiryMs = current?.subscription_expires_at
        ? new Date(current.subscription_expires_at).getTime()
        : 0;

      const extendFromMs =
        Number.isFinite(existingExpiryMs) && existingExpiryMs > nowMs
          ? existingExpiryMs
          : nowMs;

      const expiresAt = new Date(
        extendFromMs + SUB_PERIOD_DAYS * 24 * 60 * 60 * 1000
      ).toISOString();

      const currentBonus = typeof current?.bonus_pins === 'number' ? current.bonus_pins : 0;
      const currentPins = typeof current?.pins === 'number' ? current.pins : 0;
      const nextDailyPins = Math.max(currentPins, 120);
      const nextBonusPins = notesPlanId === 'pro' ? currentBonus + 500 : currentBonus;

      await admin
        .from('users')
        .update({
          subscription_tier: subTier,
          subscription_started_at: new Date(nowMs).toISOString(),
          subscription_expires_at: expiresAt,
          subscription_status: 'active',
          has_purchased_plan: true,
          pins: nextDailyPins,
          bonus_pins: nextBonusPins,
        })
        .eq('id', notesUid);
    }

    // 4. Pin credit handling: deposit individual purchases into Permanent Vault (bonus_pins)
    // so Airtel-style 1:00 AM daily reset (which renews daily quota) never touches or expires them!
    if (pinsGranted > 0 && !isSubscriptionPlan) {
      const { data: profile, error: profileErr } = await admin
        .from('users')
        .select('bonus_pins, pin_history')
        .eq('id', notesUid)
        .maybeSingle();

      if (!profileErr && profile) {
        const currentBonus = typeof profile.bonus_pins === 'number' ? profile.bonus_pins : 0;
        const nextBonus = currentBonus + pinsGranted;
        const txId = 'tx_buy_webhook_' + Date.now();
        const newTx = {
          id: txId,
          type: 'earn',
          amount: pinsGranted,
          reason: `Webhook credit ${notesPlanId} (${paymentId})`,
          source: 'purchase',
          timestamp: Date.now(),
        };
        const currentHist = Array.isArray(profile.pin_history) ? profile.pin_history : [];

        await admin
          .from('users')
          .update({
            bonus_pins: nextBonus,
            pin_history: [newTx, ...currentHist].slice(0, 100),
          })
          .eq('id', notesUid);
      }
    }

    return NextResponse.json({
      ok: true,
      processed: true,
      paymentId,
      pinsGranted,
      planId: notesPlanId
    });
  } catch (err: any) {
    console.error('[Razorpay Webhook] Internal server error:', err);
    return NextResponse.json(
      { ok: false, error: err?.message || 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
