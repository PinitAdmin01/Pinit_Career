import { NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import crypto from 'crypto';
import { financeService } from '@/lib/services/financeService';

/** Server-defined catalog only — client amounts are never trusted. */
export const PLAN_PRICES_PAISE: Record<string, number> = {
  pro: 49900,
  pack_50: 4900,
  pack_150: 9900,
  pack_500: 24900,
  pack_1200: 49900,
  // pack_custom: computed dynamically — NOT listed here; handled below
};

/** Custom pin pack: ₹1 per 3 pins, min 100, max 5000 pins */
export function customPinsToPaise(pins: number): number {
  const clamped = Math.max(100, Math.min(5000, Math.floor(pins)));
  return Math.ceil(clamped / 3) * 100; // paise
}

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
    let orderAmount = PLAN_PRICES_PAISE[planId];
    let installmentRecord: any = null;

    if (!orderAmount && planId.startsWith('installment_')) {
      const installmentId = planId.replace('installment_', '').trim();
      const dues = await financeService.getStudentDues(gated.user!.id);
      installmentRecord = (dues.installments || []).find(
        (inst: any) => String(inst.id) === installmentId
      );

      if (!installmentRecord) {
        return NextResponse.json(
          {
            error: 'INSTALLMENT_NOT_FOUND',
            message: 'Fee installment not found for authenticated student.',
          },
          { status: 404 }
        );
      }

      if (installmentRecord.status === 'Paid') {
        return NextResponse.json(
          {
            error: 'INSTALLMENT_ALREADY_PAID',
            message: 'This fee installment has already been marked as paid.',
          },
          { status: 400 }
        );
      }

      const instAmount = Number(installmentRecord.amount || 0);
      if (instAmount <= 0) {
        return NextResponse.json(
          {
            error: 'INVALID_INSTALLMENT_AMOUNT',
            message: 'Installment amount must be greater than zero.',
          },
          { status: 400 }
        );
      }

      // Authoritative conversion of installment rupee amount to paise
      orderAmount = Math.round(instAmount * 100);
    }

    if (!orderAmount && planId === 'pack_custom') {
      const rawPins = Number(body.customPins);
      if (!Number.isFinite(rawPins) || rawPins < 100 || rawPins > 5000) {
        return NextResponse.json(
          { error: 'INVALID_CUSTOM_PINS', message: 'Custom pins must be between 100 and 5,000.' },
          { status: 400 }
        );
      }
      const clampedPins = Math.floor(rawPins);
      orderAmount = customPinsToPaise(clampedPins);
      // Will be added to notes below so verify can re-read server-side
      (body as any)._customPins = clampedPins;
    }

    if (!orderAmount) {
      return NextResponse.json(
        {
          error: 'UNKNOWN_PLAN',
          message: 'Only catalog plans or valid fee installments can be purchased. Client-supplied amounts are rejected.',
        },
        { status: 400 }
      );

    }

    const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '';
    const keySecret = process.env.RAZORPAY_KEY_SECRET || '';

    if (!keyId || !keySecret) {
      if (process.env.NODE_ENV !== 'production' || process.env.ALLOW_DEV_MOCK_PAYMENT === 'true') {
        const mockOrderId = `order_mock_${crypto.randomUUID()}`;
        return NextResponse.json({
          orderId: mockOrderId,
          amount: orderAmount,
          currency: 'INR',
          keyId: 'rzp_test_mock',
          isMock: true,
          planId,
          uid: gated.user!.id,
          ...(installmentRecord ? { installmentId: installmentRecord.id } : {}),
          ...((body as any)._customPins ? { customPins: (body as any)._customPins } : {}),
        });
      }
      return NextResponse.json(
        {
          error: 'PAYMENTS_NOT_CONFIGURED',
          message: 'Razorpay server credentials are not configured. Orders cannot be created.',
        },
        { status: 503 }
      );
    }

    const notes: Record<string, string> = {
      uid: gated.user!.id,
      planId,
    };
    if (installmentRecord) {
      notes.installmentId = String(installmentRecord.id);
    }
    if (planId === 'pack_custom' && (body as any)._customPins) {
      notes.customPins = String((body as any)._customPins);
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
        notes,
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
