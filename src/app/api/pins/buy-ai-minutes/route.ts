import { NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { createClient } from '@supabase/supabase-js';

/**
 * Server-Authoritative AI Minutes Purchase Endpoint (DEF-046).
 * Enforces a strict daily cap of maximum 2 purchases (60 minutes total) per day,
 * and atomically deducts 100 pins via spend_pins RPC before granting AI tokens.
 */
export async function POST(req: Request) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

    if (!url || !serviceKey) {
      console.error('[Buy AI Minutes] Supabase credentials missing');
      return NextResponse.json(
        { ok: false, error: 'DATABASE_UNAVAILABLE', message: 'Database credentials missing.' },
        { status: 503 }
      );
    }

    const admin = createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const userId = gated.user!.id;
    const cost = 100;
    const minutesToGrant = 30;

    // 1. Verify daily limit: max 2 purchases per UTC calendar day
    const startOfDay = new Date();
    startOfDay.setUTCHours(0, 0, 0, 0);

    const { count, error: countErr } = await admin
      .from('ai_minutes_purchases')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('purchased_at', startOfDay.toISOString());

    if (countErr) {
      console.error('[Buy AI Minutes] Failed to check daily purchases:', countErr.message);
      return NextResponse.json(
        { ok: false, error: 'DATABASE_ERROR', message: 'Failed to verify daily purchase quota.' },
        { status: 500 }
      );
    }

    const purchasesToday = count ?? 0;
    if (purchasesToday >= 2) {
      return NextResponse.json(
        {
          ok: false,
          error: 'DAILY_AI_MINUTES_LIMIT_EXCEEDED',
          message: 'Maximum 2 AI extensions (60 minutes total) allowed per day.',
          purchasesToday,
          maxAllowed: 2,
        },
        { status: 429 }
      );
    }

    // 2. Atomically deduct pins via spend_pins RPC (with PostgreSQL FOR UPDATE lock)
    const { data: spendRes, error: spendErr } = await admin.rpc('spend_pins', {
      p_user_id: userId,
      p_amount: cost,
      p_reason: `Extended daily AI by ${minutesToGrant} mins`,
    });

    if (spendErr) {
      console.error('[Buy AI Minutes] spend_pins RPC failed:', spendErr.message);
      return NextResponse.json(
        { ok: false, error: 'RPC_FAILED', message: spendErr.message },
        { status: 500 }
      );
    }

    if (!spendRes?.ok) {
      const reason = spendRes?.reason || 'INSUFFICIENT_PINS';
      const status = reason === 'INSUFFICIENT_PINS' ? 402 : 400;
      return NextResponse.json(
        {
          ok: false,
          error: reason,
          message: reason === 'INSUFFICIENT_PINS'
            ? 'Insufficient pins balance to purchase AI minutes.'
            : 'Pin deduction was rejected.',
          currentBalance: spendRes?.current_balance ?? 0,
          requiredCost: cost,
        },
        { status }
      );
    }

    // 3. Record purchase in append-only audit ledger
    const { error: insertErr } = await admin
      .from('ai_minutes_purchases')
      .insert({
        user_id: userId,
        minutes: minutesToGrant,
        cost_pins: cost,
      });

    if (insertErr) {
      console.error('[Buy AI Minutes] Audit log insert failed:', insertErr.message);
      // Even if audit insert logs an error, pins were deducted; log warning but succeed
    }

    return NextResponse.json({
      ok: true,
      minutesAdded: minutesToGrant,
      purchasesToday: purchasesToday + 1,
      remainingPurchasesToday: 2 - (purchasesToday + 1),
      newBalance: spendRes.new_balance,
      message: `+${minutesToGrant} AI Minutes added to your daily balance.`,
    });
  } catch (err: any) {
    console.error('[Buy AI Minutes] Internal Error:', err);
    return NextResponse.json(
      { ok: false, error: 'INTERNAL_SERVER_ERROR', message: err?.message || 'Internal server error.' },
      { status: 500 }
    );
  }
}
