import { NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import crypto from 'crypto';

/** Server-defined catalog only — client amounts are never trusted. */
export const PLAN_PRICES_PAISE: Record<string, number> = {
  pro: 49900,
  pack_50: 4900,
  pack_150: 9900,
  pack_500: 24900,
};

/**
 * Create a Razorpay order server-side when keys are configured.
 * Fail closed when secrets are missing or planId is unknown.
 */
export async function POST(req: Request) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;

    const body = await req.json().catch(() => ({}));
    const planId = String(body.planId || '').trim();
    const orderAmount = PLAN_PRICES_PAISE[planId];

    if (!orderAmount) {
      return NextResponse.json(
        {
          error: 'UNKNOWN_PLAN',
          message: 'Only catalog plans can be purchased. Client-supplied amounts are rejected.',
        },
        { status: 400 }
      );
    }

    const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '';
    const keySecret = process.env.RAZORPAY_KEY_SECRET || '';

    if (!keyId || !keySecret) {
      return NextResponse.json(
        {
          error: 'PAYMENTS_NOT_CONFIGURED',
          message: 'Razorpay server credentials are not configured. Orders cannot be created.',
        },
        { status: 503 }
      );
    }

    const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    const rpRes = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: orderAmount,
        currency: 'INR',
        receipt: `pinit_${gated.user!.id.slice(0, 8)}_${Date.now()}`,
        notes: { uid: gated.user!.id, planId },
      }),
    });

    if (!rpRes.ok) {
      const errText = await rpRes.text();
      return NextResponse.json(
        { error: 'RAZORPAY_ORDER_FAILED', message: errText.slice(0, 300) },
        { status: 502 }
      );
    }

    const order = await rpRes.json();
    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency || 'INR',
      keyId,
      planId,
      uid: gated.user!.id,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

export function hmacSha256(secret: string, payload: string) {
  return crypto.createHmac('sha256', secret).update(payload).digest('hex');
}
