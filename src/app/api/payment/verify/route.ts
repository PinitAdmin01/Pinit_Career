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

      const planId = clientPlanId || 'pack_100';
      let pinsGranted = 0;
      const isSubscriptionPlan = planId === 'pro' || planId === 'basic_student' || planId === 'student_99';
      if (planId === 'pack_100') pinsGranted = 100;
      else if (planId === 'pack_300') pinsGranted = 300;
      else if (planId === 'pack_500') pinsGranted = 500;
      else if (planId === 'pack_1000') pinsGranted = 1000;
      else if (planId === 'pack_50') pinsGranted = 50;
      else if (planId === 'pack_150') pinsGranted = 150;
      else if (planId === 'pack_1200') pinsGranted = 1200;
      else if (isSubscriptionPlan) pinsGranted = 0; // Subscriptions get daily 120 quota renewal
      else if (planId === 'pack_custom') {
        const customPins = Number(body.customPins);
        pinsGranted = Number.isFinite(customPins) && customPins >= 100 && customPins <= 10000
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

        if (planId === 'pro' || planId === 'basic_student' || planId === 'student_99') {
          const nowMs = Date.now();
          const expiresAt = new Date(nowMs + 30 * 24 * 60 * 60 * 1000).toISOString();
          const tier = planId === 'pro' ? 'pro' : 'basic';
          const { data: current } = await admin
            .from('users')
            .select('pins, bonus_pins')
            .eq('id', gated.user!.id)
            .maybeSingle();

          const currentBonus = typeof current?.bonus_pins === 'number' ? current.bonus_pins : 0;
          const currentPins = typeof current?.pins === 'number' ? current.pins : 0;
          const bonusToAdd = planId === 'pro' ? 500 : 0;

          await admin
            .from('users')
            .update({
              subscription_tier: tier,
              subscription_started_at: new Date(nowMs).toISOString(),
              subscription_expires_at: expiresAt,
              subscription_status: 'active',
              has_purchased_plan: true,
              pins: Math.max(currentPins, 120),
              bonus_pins: currentBonus + bonusToAdd,
            })
            .eq('id', gated.user!.id);
        }

        // Deposit individual pin purchases into bonus_pins (Permanent Vault)
        // so Airtel-style 1:00 AM daily reset never wipes individual purchases!
        if (pinsGranted > 0 && !isSubscriptionPlan) {
          const { data: profile } = await admin
            .from('users')
            .select('bonus_pins, pin_history')
            .eq('id', gated.user!.id)
            .maybeSingle();

          const currentBonus = typeof profile?.bonus_pins === 'number' ? profile.bonus_pins : 0;
          const nextBonus = currentBonus + pinsGranted;
          const txId = 'tx_buy_sandbox_' + Date.now();
          const newTx = {
            id: txId,
            type: 'earn',
            amount: pinsGranted,
            reason: `Sandbox purchase (${planId})`,
            source: 'purchase',
            timestamp: Date.now(),
          };
          const currentHist = Array.isArray(profile?.pin_history) ? profile.pin_history : [];

          await admin
            .from('users')
            .update({
              bonus_pins: nextBonus,
              pin_history: [newTx, ...currentHist].slice(0, 100),
            })
            .eq('id', gated.user!.id);
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
    const isSubscriptionPlan = notesPlanId === 'pro' || notesPlanId === 'basic_student' || notesPlanId === 'student_99';
    if (notesPlanId === 'pack_100') pinsGranted = 100;
    else if (notesPlanId === 'pack_300') pinsGranted = 300;
    else if (notesPlanId === 'pack_500') pinsGranted = 500;
    else if (notesPlanId === 'pack_1000') pinsGranted = 1000;
    else if (notesPlanId === 'pack_50') pinsGranted = 50;
    else if (notesPlanId === 'pack_150') pinsGranted = 150;
    else if (notesPlanId === 'pack_1200') pinsGranted = 1200;
    else if (isSubscriptionPlan) pinsGranted = 0; // Subscriptions get daily 120 quota renewal
    else if (notesPlanId === 'pack_custom') {
      // Re-read from server-side order notes — never from client body
      const notesCustomPins = Number(order?.notes?.customPins);
      pinsGranted = Number.isFinite(notesCustomPins) && notesCustomPins >= 100 && notesCustomPins <= 10000
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

    const isSub = notesPlanId === 'pro' || notesPlanId === 'basic_student' || notesPlanId === 'student_99';
    if (isSub) {
      // Record a REAL subscription period, not just a tier flag.
      const SUB_PERIOD_DAYS = 30;
      const nowMs = Date.now();
      const subTier = notesPlanId === 'pro' ? 'pro' : 'basic';

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
        extendFromMs + SUB_PERIOD_DAYS * 24 * 60 * 60 * 1000
      ).toISOString();

      const currentBonus = typeof current?.bonus_pins === 'number' ? current.bonus_pins : 0;
      const currentPins = typeof current?.pins === 'number' ? current.pins : 0;
      // Airtel/Jio model: Activate 120 daily pins if below 120; deposit 500 into bonus vault for pro
      nextDailyPins = Math.max(currentPins, 120);
      nextBonusPins = notesPlanId === 'pro' ? currentBonus + 500 : currentBonus;

      const { error: updateErr } = await admin
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
        .eq('id', gated.user!.id);

      if (updateErr) {
        console.error(`[Payment] Failed to update user ${subTier} status:`, updateErr);
        return NextResponse.json({ ok: false, error: 'SUBSCRIPTION_UPDATE_FAILED' }, { status: 500 });
      }

      console.log(
        `[Payment] Subscription (${subTier}) period recorded for user ${gated.user!.id} — expires ${expiresAt}` +
        (existingExpiryMs > nowMs ? ' (extended from existing period)' : ' (new period)')
      );
    }

    // Individual pin purchases (1 Rs = 10 pins) are deposited into the Permanent Vault (bonus_pins)
    // so Airtel-style 1:00 AM daily reset (which renews daily quota) never touches or expires them!
    if (pinsGranted > 0 && !isSub) {
      const { data: profile, error: profileErr } = await admin
        .from('users')
        .select('bonus_pins, pin_history')
        .eq('id', gated.user!.id)
        .maybeSingle();

      if (profileErr) {
        console.error('[Payment] Failed to query user profile for bonus pins:', profileErr);
        return NextResponse.json({ ok: false, error: 'USER_LOOKUP_FAILED' }, { status: 500 });
      }

      const currentBonus = typeof profile?.bonus_pins === 'number' ? profile.bonus_pins : 0;
      const nextBonus = currentBonus + pinsGranted;
      const txId = 'tx_buy_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
      const newTx = {
        id: txId,
        type: 'earn',
        amount: pinsGranted,
        reason: `Purchase plan ${notesPlanId} (${razorpay_payment_id})`,
        source: 'purchase',
        timestamp: Date.now(),
      };
      const currentHist = Array.isArray(profile?.pin_history) ? profile.pin_history : [];

      const { error: pinErr } = await admin
        .from('users')
        .update({
          bonus_pins: nextBonus,
          pin_history: [newTx, ...currentHist].slice(0, 100),
        })
        .eq('id', gated.user!.id);

      if (pinErr) {
        console.error('[Payment] Failed to credit bonus pins:', pinErr);
        return NextResponse.json({ ok: false, error: 'PIN_CREDIT_FAILED' }, { status: 500 });
      }
    }

    const isBasicStudent = notesPlanId === 'basic_student' || notesPlanId === 'student_99';
    const isPro = notesPlanId === 'pro';

    return NextResponse.json({
      ok: true,
      verified: true,
      planId: notesPlanId,
      paymentId: razorpay_payment_id,
      dailyPins: isSub ? nextDailyPins : undefined,
      bonusPinsGranted: isPro ? 500 : (!isSub ? pinsGranted : 0),
      totalBonusPins: isSub ? nextBonusPins : undefined,
      pinsGranted: !isSub ? pinsGranted : 0,
      message: isPro
        ? 'Pro Pass verified! 120 Daily Pins activated & 500 Bonus Pins deposited to Permanent Vault.'
        : isBasicStudent
          ? 'Basic Student Pass verified! 120 Daily Pins activated (resets daily at 1:00 AM IST).'
          : pinsGranted
            ? `Top-up verified! +${pinsGranted} Pins added to your Permanent Vault (never expires).`
            : 'Payment verified successfully.',
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message || 'Server error' }, { status: 500 });
  }
}
