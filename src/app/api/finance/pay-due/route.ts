import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import { financeService } from '@/lib/services/financeService';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { validateBody } from '@/lib/server/validate';
import { z } from 'zod';

const PayDueSchema = z.object({
  installmentId: z.string().min(1, 'installmentId is required'),
  paymentId: z.string().optional(),
  razorpay_payment_id: z.string().optional(),
  orderId: z.string().optional(),
  razorpay_order_id: z.string().optional(),
  signature: z.string().optional(),
  razorpay_signature: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;

    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'INVALID_JSON', message: 'Malformed JSON payload' }, { status: 400 });
    }

    const { data, error } = validateBody(PayDueSchema, body);
    if (error) return error;

    const { installmentId } = data;
    const paymentId = (data.razorpay_payment_id || data.paymentId || '').trim();
    const orderId = (data.razorpay_order_id || data.orderId || '').trim();
    const signature = (data.razorpay_signature || data.signature || '').trim();

    // DEF-C2: Enforce that payment ID is strictly provided
    if (!paymentId) {
      return NextResponse.json(
        {
          ok: false,
          error: 'PAYMENT_ID_REQUIRED',
          message: 'A verified Razorpay payment ID is strictly required to mark dues as paid.',
        },
        { status: 400 }
      );
    }

    const isMock = orderId.startsWith('order_mock_') || paymentId.startsWith('pay_mock_');

    if (isMock) {
      if (process.env.NODE_ENV === 'production') {
        return NextResponse.json(
          {
            ok: false,
            error: 'MOCK_PAYMENT_FORBIDDEN',
            message: 'Mock payments are strictly forbidden in production.',
          },
          { status: 403 }
        );
      }

      if (process.env.ALLOW_DEV_MOCK_PAYMENT !== 'true') {
        return NextResponse.json(
          {
            ok: false,
            error: 'MOCK_PAYMENT_DISABLED',
            message: 'Mock payments are disabled in this environment.',
          },
          { status: 403 }
        );
      }
    } else {
      // Live Razorpay payment verification
      if (!orderId || !signature) {
        return NextResponse.json(
          {
            ok: false,
            error: 'PAYMENT_VERIFICATION_FAILED',
            message: 'Razorpay order ID and cryptographic signature are required for payment verification.',
          },
          { status: 400 }
        );
      }

      const keySecret = process.env.RAZORPAY_KEY_SECRET;
      const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

      if (!keySecret || !keyId) {
        console.error('[Pay Due] Razorpay credentials missing during payment verification');
        return NextResponse.json(
          {
            ok: false,
            error: 'PAYMENTS_NOT_CONFIGURED',
            message: 'Razorpay server credentials are not configured.',
          },
          { status: 503 }
        );
      }

      // Verify HMAC-SHA256 signature
      const expected = crypto
        .createHmac('sha256', keySecret)
        .update(`${orderId}|${paymentId}`)
        .digest('hex');

      const sigBuffer = Buffer.from(signature, 'utf8');
      const expectedBuffer = Buffer.from(expected, 'utf8');

      if (sigBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
        return NextResponse.json(
          {
            ok: false,
            error: 'INVALID_SIGNATURE',
            message: 'Cryptographic payment signature mismatch. Tampering detected.',
          },
          { status: 400 }
        );
      }

      // Validate order directly with Razorpay API
      const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
      const orderRes = await fetch(`https://api.razorpay.com/v1/orders/${orderId}`, {
        headers: { Authorization: `Basic ${auth}` },
      });

      if (!orderRes.ok) {
        console.error(`[Pay Due] Razorpay order lookup failed for order ${orderId}`);
        return NextResponse.json(
          {
            ok: false,
            error: 'ORDER_LOOKUP_FAILED',
            message: 'Failed to verify order details with payment gateway.',
          },
          { status: 502 }
        );
      }

      const order = await orderRes.json();
      const notesUid = String(order?.notes?.uid || '');
      const notesInstId = String(order?.notes?.installmentId || '');
      const notesPlanId = String(order?.notes?.planId || '');

      if (notesUid && notesUid !== gated.user!.id) {
        return NextResponse.json(
          {
            ok: false,
            error: 'ORDER_USER_MISMATCH',
            message: 'Order was created for a different user account.',
          },
          { status: 403 }
        );
      }

      if (notesInstId && notesInstId !== installmentId && notesPlanId !== `installment_${installmentId}`) {
        return NextResponse.json(
          {
            ok: false,
            error: 'ORDER_INSTALLMENT_MISMATCH',
            message: 'Order was created for a different installment.',
          },
          { status: 400 }
        );
      }

      // Verify fee amount matches database
      const dues = await financeService.getStudentDues(gated.user!.id);
      const matchingInst = (dues.installments || []).find((i: any) => String(i.id) === installmentId);
      if (!matchingInst) {
        return NextResponse.json(
          {
            ok: false,
            error: 'INSTALLMENT_NOT_FOUND',
            message: 'Fee installment not found for student.',
          },
          { status: 404 }
        );
      }

      const expectedPaise = Math.round(Number(matchingInst.amount) * 100);
      if (Number(order.amount) !== expectedPaise) {
        return NextResponse.json(
          {
            ok: false,
            error: 'ORDER_AMOUNT_MISMATCH',
            message: 'Paid order amount does not match authoritative installment fee balance.',
          },
          { status: 400 }
        );
      }
    }

    // Replay Protection: Lock payment ID in processed_payments
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

    if (url && serviceKey) {
      const admin = createClient(url, serviceKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      });

      const { data: existingPayment } = await admin
        .from('processed_payments')
        .select('payment_id')
        .eq('payment_id', paymentId)
        .maybeSingle();

      if (existingPayment) {
        return NextResponse.json(
          {
            ok: false,
            error: 'PAYMENT_ALREADY_PROCESSED',
            message: 'This payment transaction has already been verified and recorded.',
          },
          { status: 409 }
        );
      }

      const { error: insertErr } = await admin.from('processed_payments').insert({
        payment_id: paymentId,
        order_id: orderId || `order_${Date.now()}`,
        user_id: gated.user!.id,
        plan_id: `installment_${installmentId}`,
        pins_granted: 0,
      });

      if (insertErr) {
        if (insertErr.code === '23505') {
          return NextResponse.json(
            {
              ok: false,
              error: 'PAYMENT_ALREADY_PROCESSED',
              message: 'This payment transaction has already been verified and recorded.',
            },
            { status: 409 }
          );
        }
        console.error('[Pay Due] Failed to record payment in processed_payments:', insertErr);
        return NextResponse.json(
          {
            ok: false,
            error: 'REPLAY_RECORD_FAILED',
            message: 'Failed to record payment verification state. Transaction refused.',
          },
          { status: 503 }
        );
      }
    }

    const studentId = gated.user!.id;
    const studentName = gated.user!.email || 'Student';

    const result = await financeService.payDue(
      studentId,
      studentName,
      installmentId,
      gated.user!.email,
      paymentId
    );

    return NextResponse.json(result);
  } catch (err: any) {
    console.error('[Pay Due] Error:', err);
    return NextResponse.json({ ok: false, error: err.message || 'Server error' }, { status: 500 });
  }
}
