import { NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import { PLAN_PRICES_PAISE } from '../create-order/route';

export async function POST(req: Request) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;

    const body = await req.json().catch(() => ({}));
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      planId: clientPlanId,
    } = body as {
      razorpay_order_id?: string;
      razorpay_payment_id?: string;
      razorpay_signature?: string;
      planId?: string;
    };

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { ok: false, error: 'Missing Razorpay order/payment/signature fields.' },
        { status: 400 }
      );
    }

    // Development / Demo Sandbox verification bypass — strictly disabled in production
    if (
      razorpay_order_id.startsWith('order_mock_') &&
      process.env.NODE_ENV !== 'production' &&
      process.env.ALLOW_DEV_MOCK_PAYMENT === 'true'
    ) {
      const planId = clientPlanId || 'pack_150';
      let pinsGranted = 0;
      if (planId === 'pack_50') pinsGranted = 50;
      else if (planId === 'pack_150') pinsGranted = 150;
      else if (planId === 'pack_500') pinsGranted = 500;

      return NextResponse.json({
        ok: true,
        planId,
        pinsGranted,
        isMock: true,
        message: 'Sandbox payment verified successfully.'
      });
    }

    const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '';
    const keySecret = process.env.RAZORPAY_KEY_SECRET || '';
    if (!keySecret || !keyId) {
      return NextResponse.json(
        { ok: false, error: 'PAYMENTS_NOT_CONFIGURED' },
        { status: 503 }
      );
    }

    const expected = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    const a = Buffer.from(expected, 'utf8');
    const b = Buffer.from(String(razorpay_signature), 'utf8');
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
      return NextResponse.json({ ok: false, error: 'INVALID_SIGNATURE' }, { status: 400 });
    }

    // Re-fetch order from Razorpay and bind to authenticated user + catalog plan/amount.
    const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    const orderRes = await fetch(`https://api.razorpay.com/v1/orders/${razorpay_order_id}`, {
      headers: { Authorization: `Basic ${auth}` },
    });
    if (!orderRes.ok) {
      return NextResponse.json({ ok: false, error: 'ORDER_LOOKUP_FAILED' }, { status: 502 });
    }
    const order = await orderRes.json();
    const notesUid = String(order?.notes?.uid || '');
    const notesPlanId = String(order?.notes?.planId || '');
    const catalogAmount = PLAN_PRICES_PAISE[notesPlanId];

    if (!notesUid || notesUid !== gated.user!.id) {
      return NextResponse.json({ ok: false, error: 'ORDER_USER_MISMATCH' }, { status: 403 });
    }
    if (!catalogAmount || Number(order.amount) !== catalogAmount) {
      return NextResponse.json({ ok: false, error: 'ORDER_AMOUNT_MISMATCH' }, { status: 400 });
    }
    if (clientPlanId && String(clientPlanId) !== notesPlanId) {
      return NextResponse.json({ ok: false, error: 'PLAN_MISMATCH' }, { status: 400 });
    }

    let pinsGranted = 0;
    if (notesPlanId === 'pack_50') pinsGranted = 50;
    else if (notesPlanId === 'pack_150') pinsGranted = 150;
    else if (notesPlanId === 'pack_500') pinsGranted = 500;

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

    if (!url || !serviceKey) {
      console.error('[Payment] Supabase URL or Service Role Key missing during payment verification');
      return NextResponse.json(
        {
          ok: false,
          error: 'PAYMENT_VERIFICATION_UNAVAILABLE',
          message: 'Payment verification service is currently unavailable. Please contact support.',
        },
        { status: 503 }
      );
    }

    const admin = createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    // IDEMPOTENCY / ANTI-REPLAY: Check if payment has already been credited
    const { data: existingPayment, error: selectErr } = await admin
      .from('processed_payments')
      .select('payment_id')
      .eq('payment_id', razorpay_payment_id)
      .maybeSingle();

    if (selectErr) {
      console.error('[Payment] Failed to query processed_payments replay guard:', selectErr);
      return NextResponse.json(
        {
          ok: false,
          error: 'REPLAY_GUARD_UNAVAILABLE',
          message: 'Payment processing system unavailable. Transaction verification refused.',
        },
        { status: 503 }
      );
    }

    if (existingPayment) {
      return NextResponse.json(
        {
          ok: false,
          error: 'PAYMENT_ALREADY_PROCESSED',
          message: 'This payment transaction has already been verified and credited.',
        },
        { status: 409 }
      );
    }

    // Record transaction to prevent future replay
    const { error: insertErr } = await admin.from('processed_payments').insert({
      payment_id: razorpay_payment_id,
      order_id: razorpay_order_id,
      user_id: gated.user!.id,
      plan_id: notesPlanId,
      pins_granted: pinsGranted,
    });

    if (insertErr) {
      if (insertErr.code === '23505') {
        // Concurrent replay detected
        return NextResponse.json(
          {
            ok: false,
            error: 'PAYMENT_ALREADY_PROCESSED',
            message: 'This payment transaction has already been verified and credited.',
          },
          { status: 409 }
        );
      }
      console.error('[Payment] Failed to record in processed_payments:', insertErr);
      return NextResponse.json(
        {
          ok: false,
          error: 'REPLAY_RECORD_FAILED',
          message: 'Failed to record payment verification state. Transaction refused.',
        },
        { status: 503 }
      );
    }

    if (notesPlanId === 'pro') {
      // Record a REAL subscription period, not just a tier flag.
      const PRO_PERIOD_DAYS = 30;
      const nowMs = Date.now();

      const { data: current, error: userFetchErr } = await admin
        .from('users')
        .select('subscription_expires_at')
        .eq('id', gated.user!.id)
        .maybeSingle();

      if (userFetchErr) {
        console.error('[Payment] Failed to query user subscription state:', userFetchErr);
        return NextResponse.json({ ok: false, error: 'USER_LOOKUP_FAILED' }, { status: 500 });
      }

      const existingExpiryMs = current?.subscription_expires_at
        ? new Date(current.subscription_expires_at).getTime()
        : 0;

      // Extend from the later of (now, existing expiry).
      const extendFromMs =
        Number.isFinite(existingExpiryMs) && existingExpiryMs > nowMs
          ? existingExpiryMs
          : nowMs;

      const expiresAt = new Date(
        extendFromMs + PRO_PERIOD_DAYS * 24 * 60 * 60 * 1000
      ).toISOString();

      const { error: updateErr } = await admin
        .from('users')
        .update({
          subscription_tier: 'pro',
          subscription_started_at: new Date(nowMs).toISOString(),
          subscription_expires_at: expiresAt,
          subscription_status: 'active',
        })
        .eq('id', gated.user!.id);

      if (updateErr) {
        console.error('[Payment] Failed to update user pro status:', updateErr);
        return NextResponse.json({ ok: false, error: 'SUBSCRIPTION_UPDATE_FAILED' }, { status: 500 });
      }

      console.log(
        `[Payment] Pro period recorded for user ${gated.user!.id} — expires ${expiresAt}` +
        (existingExpiryMs > nowMs ? ' (extended from existing period)' : ' (new period)')
      );
    }

    // Pin grants must be server-recorded; client must not mint.
    if (pinsGranted > 0) {
      const { data: profile, error: profileErr } = await admin
        .from('users')
        .select('pins')
        .eq('id', gated.user!.id)
        .maybeSingle();

      if (profileErr) {
        console.error('[Payment] Failed to query user pins:', profileErr);
        return NextResponse.json({ ok: false, error: 'USER_LOOKUP_FAILED' }, { status: 500 });
      }

      const current = typeof profile?.pins === 'number' ? profile.pins : 0;
      const { error: pinErr } = await admin
        .from('users')
        .update({ pins: current + pinsGranted })
        .eq('id', gated.user!.id);

      if (pinErr) {
        console.error('[Payment] Failed to credit pins:', pinErr);
        return NextResponse.json({ ok: false, error: 'PIN_CREDIT_FAILED' }, { status: 500 });
      }
    }

    return NextResponse.json({
      ok: true,
      verified: true,
      planId: notesPlanId,
      paymentId: razorpay_payment_id,
      pinsGranted,
      message:
        notesPlanId === 'pro'
          ? 'Pro plan verified.'
          : pinsGranted
            ? `Payment verified. ${pinsGranted} pins granted.`
            : 'Payment verified.',
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message || 'Server error' }, { status: 500 });
  }
}
