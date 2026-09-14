import { NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { validateBody } from '@/lib/server/validate';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';

const PinSpendSchema = z.object({
  featureKey: z.string().optional(),
  cost: z.number().int().positive().max(10000).optional(),
  amount: z.number().int().positive().max(10000).optional(),
  reason: z.string().max(200).optional(),
  itemId: z.string().optional(),
}).refine(data => (data.cost !== undefined || data.amount !== undefined), {
  message: 'Either cost or amount must be provided',
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

    const { data, error } = validateBody(PinSpendSchema, body);
    if (error) return error;

    const spendAmount = data.cost ?? data.amount ?? 0;
    const item = data.featureKey || data.itemId || data.reason || 'feature_unlock';
    const userId = gated.user!.id;

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

    if (!url || !serviceKey) {
      return NextResponse.json({ ok: true, spent: spendAmount, featureKey: item });
    }

    const admin = createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data: spendRes, error: spendErr } = await admin.rpc('spend_pins', {
      p_user_id: userId,
      p_amount: spendAmount,
      p_reason: `Spend on ${item}`,
    });

    if (spendErr) {
      console.error('[Pin Spend] RPC Error:', spendErr.message);
      return NextResponse.json({ ok: false, error: 'DATABASE_ERROR', message: 'Could not process pin deduction.' }, { status: 500 });
    }

    if (!spendRes?.ok) {
      return NextResponse.json(
        { ok: false, error: spendRes?.reason || 'INSUFFICIENT_PINS', currentBalance: spendRes?.current_balance ?? 0 },
        { status: 402 }
      );
    }

    return NextResponse.json({
      ok: true,
      spent: spendAmount,
      newBalance: spendRes.new_balance,
      featureKey: item,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
