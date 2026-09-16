import { NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import { PLAN_PRICES_PAISE } from '../create-order/route';

export async function POST(req: Request) {
  try {
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

    const isMock = razorpay_order_id.startsWith('order_mock_') || razorpay_payment_id.startsWith('pay_mock_');
    if (isMock && process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { ok: false, error: 'MOCK_PAYMENT_FORBIDDEN', message: 'Mock payments are strictly forbidden in production.' },
        { status: 403 }
      );
    }

    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;

    // Development / Demo Sandbox verification bypass — strictly disabled in production
    if (isMock) {
      if (process.env.ALLOW_DEV_MOCK_PAYMENT !== 'true') {
        return NextResponse.json(
          { ok: false, error: 'MOCK_PAYMENT_DISABLED', message: 'Mock payments are disabled in this environment.' },
          { status: 403 }
        );
      }

      const planId = clientPlanId || 'pack_150';
      let pinsGranted = 0;
      if (planId === 'pack_50') pinsGranted = 50;
      else if (planId === 'pack_150') pinsGranted = 150;
      else if (planId === 'pack_500') pinsGranted = 500;
      else if (planId === 'pack_1200') pinsGranted = 1200;
      else if (planId === 'pro') pinsGranted = 0; // 500 bonus pins deposited into vault
      else if (planId === 'pack_custom') {
        const customPins = Number(body.customPins);
        pinsGranted = Number.isFinite(customPins) && customPins >= 100 && customPins <= 5000
          ? Math.floor(customPins) : 0;
      }

      const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
      const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

      if (url && serviceKey) {
        const admin = createClient(url, serviceKey, {
          auth: { persistSession: false, autoRefreshToken: false },
        });

        // Check if payment has already been credited
        const { data: existingPayment } = await admin
          .from('processed_payments')
          .select('payment_id')
          .eq('payment_id', razorpay_payment_id)
          .maybeSingle();

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
          plan_id: planId,
          pins_granted: planId === 'pro' ? 500 : pinsGranted,
        });

        if (insertErr) {
          if (insertErr.code === '23505') {
            return NextResponse.json(
              {
                ok: false,
                error: 'PAYMENT_ALREADY_PROCESSED',
                message: 'This payment transaction has already been verified and credited.',
              },
              { status: 409 }
            );
          }
          return NextResponse.json(
            {
              ok: false,
              error: 'REPLAY_RECORD_FAILED',
              message: 'Failed to record payment verification state. Transaction refused.',
            },
            { status: 503 }
          );
        }

        if (planId === 'pro') {
          const nowMs = Date.now();
          const expiresAt = new Date(nowMs + 30 * 24 * 60 * 60 * 1000).toISOString();
          const { data: current } = await admin
            .from('users')
            .select('pins, bonus_pins')
            .eq('id', gated.user!.id)
            .maybeSingle();

          const currentBonus = typeof current?.bonus_pins === 'number' ? current.bonus_pins : 0;
          const currentPins = typeof current?.pins === 'number' ? current.pins : 0;

          await admin
            .from('users')
            .update({
              subscription_tier: 'pro',
              subscription_started_at: new Date(nowMs).toISOString(),
              subscription_expires_at: expiresAt,
              subscription_status: 'active',
              has_purchased_plan: true,
              pins: Math.max(currentPins, 120),
              bonus_pins: currentBonus + 500,
            })
            .eq('id', gated.user!.id);
        }

        // Atomically credit pins in DB via credit_pins RPC
        if (pinsGranted > 0) {
          const { error: rpcErr } = await admin.rpc('credit_pins', {
            p_user_id: gated.user!.id,
            p_amount: pinsGranted,
            p_reason: `Sandbox payment credit (${planId})`,
            p_source: 'purchase',
          });

          if (rpcErr) {
            console.warn('[Payment] credit_pins RPC failed during sandbox verify, fallback update:', rpcErr);
            const { data: profile } = await admin
              .from('users')
              .select('pins')
              .eq('id', gated.user!.id)
              .maybeSingle();

            const current = typeof profile?.pins === 'number' ? profile.pins : 0;
            await admin
              .from('users')
              .update({ pins: current + pinsGranted })
              .eq('id', gated.user!.id);
          }
        }
      }

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
    else if (notesPlanId === 'pack_1200') pinsGranted = 1200;
    else if (notesPlanId === 'pro') pinsGranted = 0; // 500 bonus pins deposited into vault
    else if (notesPlanId === 'pack_custom') {
      // Re-read from server-side order notes — never from client body
      const notesCustomPins = Number(order?.notes?.customPins);
      pinsGranted = Number.isFinite(notesCustomPins) && notesCustomPins >= 100 && notesCustomPins <= 5000
        ? Math.floor(notesCustomPins) : 0;
    }

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
      pins_granted: notesPlanId === 'pro' ? 500 : pinsGranted,
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

    let nextDailyPins = 120;
    let nextBonusPins = 500;

    if (notesPlanId === 'pro') {
      // Record a REAL subscription period, not just a tier flag.
      const PRO_PERIOD_DAYS = 30;
      const nowMs = Date.now();

      const { data: current, error: userFetchErr } = await admin
        .from('users')
        .select('pins, bonus_pins, subscription_expires_at')
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

      const currentBonus = typeof current?.bonus_pins === 'number' ? current.bonus_pins : 0;
      const currentPins = typeof current?.pins === 'number' ? current.pins : 0;
      // Jio/Airtel model: Activate 120 daily pins if below 120, and deposit 500 into bonus_pins vault!
      nextDailyPins = Math.max(currentPins, 120);
      nextBonusPins = currentBonus + 500;

      const { error: updateErr } = await admin
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
    if (pinsGranted > 0 && notesPlanId !== 'pro') {
      const { error: rpcErr } = await admin.rpc('credit_pins', {
        p_user_id: gated.user!.id,
        p_amount: pinsGranted,
        p_reason: `Purchase plan ${notesPlanId} (${razorpay_payment_id})`,
        p_source: 'purchase',
      });

      if (rpcErr) {
        console.warn('[Payment] credit_pins RPC failed, falling back to direct update:', rpcErr);
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
    }

    return NextResponse.json({
      ok: true,
      verified: true,
      planId: notesPlanId,
      paymentId: razorpay_payment_id,
      dailyPins: notesPlanId === 'pro' ? nextDailyPins : undefined,
      bonusPinsGranted: notesPlanId === 'pro' ? 500 : 0,
      totalBonusPins: notesPlanId === 'pro' ? nextBonusPins : undefined,
      pinsGranted: notesPlanId === 'pro' ? 0 : pinsGranted,
      message:
        notesPlanId === 'pro'
          ? 'Pro plan verified. 120 Daily Pins activated & 500 Bonus Pins deposited to Vault.'
          : pinsGranted
            ? `Payment verified. ${pinsGranted} pins granted.`
            : 'Payment verified.',
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message || 'Server error' }, { status: 500 });
  }
}
