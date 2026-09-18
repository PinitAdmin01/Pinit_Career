import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

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

    if (existingPayment) {
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
    if (notesPlanId === 'pack_50') pinsGranted = 50;
    else if (notesPlanId === 'pack_150') pinsGranted = 150;
    else if (notesPlanId === 'pack_500') pinsGranted = 500;
    else if (notesPlanId === 'pack_1200') pinsGranted = 1200;

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

    // 3. Pro Subscription handling (Jio/Airtel model: 120 daily pins + 500 bonus pins vault)
    if (notesPlanId === 'pro') {
      const PRO_PERIOD_DAYS = 30;
      const nowMs = Date.now();

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
        extendFromMs + PRO_PERIOD_DAYS * 24 * 60 * 60 * 1000
      ).toISOString();

      const currentBonus = typeof current?.bonus_pins === 'number' ? current.bonus_pins : 0;
      const currentPins = typeof current?.pins === 'number' ? current.pins : 0;
      const nextDailyPins = Math.max(currentPins, 120);
      const nextBonusPins = currentBonus + 500;

      await admin
        .from('users')
        .update({
          subscription_tier: 'pro',
          subscription_started_at: new Date(nowMs).toISOString(),
          subscription_expires_at: expiresAt,
          subscription_status: 'active',
          has_purchased_plan: true,
          pins: nextDailyPins,
          bonus_pins: nextBonusPins,
        })
        .eq('id', notesUid);
    }

    // 4. Pin credit handling via atomic credit_pins RPC
    if (pinsGranted > 0 && notesPlanId !== 'pro') {
      const { error: rpcErr } = await admin.rpc('credit_pins', {
        p_user_id: notesUid,
        p_amount: pinsGranted,
        p_reason: `Webhook credit plan ${notesPlanId} (${paymentId})`,
        p_source: 'purchase',
      });

      if (rpcErr) {
        console.warn('[Razorpay Webhook] credit_pins RPC failed, falling back to direct update:', rpcErr);
        const { data: profile } = await admin
          .from('users')
          .select('pins')
          .eq('id', notesUid)
          .maybeSingle();

        const current = typeof profile?.pins === 'number' ? profile.pins : 0;
        await admin
          .from('users')
          .update({ pins: current + pinsGranted })
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
