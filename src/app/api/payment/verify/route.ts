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

    // Development / Demo Sandbox verification bypass
    if (razorpay_order_id.startsWith('order_mock_') && (process.env.NODE_ENV !== 'production' || process.env.ALLOW_DEV_MOCK_PAYMENT === 'true')) {
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
    if (url && serviceKey && notesPlanId === 'pro') {
      const admin = createClient(url, serviceKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      });
      await admin
        .from('users')
        .update({ subscription_tier: 'pro' })
        .eq('id', gated.user!.id);
    }

    // Pin grants must be server-recorded; client must not mint. Without service role, report pins for display only as 0.
    if (url && serviceKey && pinsGranted > 0) {
      const admin = createClient(url, serviceKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      });
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

    return NextResponse.json({
      ok: true,
      verified: true,
      planId: notesPlanId,
      paymentId: razorpay_payment_id,
      pinsGranted: serviceKey ? pinsGranted : 0,
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
