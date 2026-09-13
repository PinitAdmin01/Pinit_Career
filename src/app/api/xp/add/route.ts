import { NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { createClient } from '@supabase/supabase-js';

/**
 * Server-Authoritative XP Minting Endpoint (DEF-048).
 * Prevents unverified client-side XP manipulation by strictly validating
 * progression awards and capping individual increments to a maximum of 500 XP.
 */
export async function POST(req: Request) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;

    const body = await req.json().catch(() => ({}));
    const amount = Number(body?.amount);
    const reason = typeof body?.reason === 'string' ? body.reason.trim() : 'XP Award';

    if (!Number.isInteger(amount) || amount <= 0 || amount > 500) {
      return NextResponse.json(
        {
          ok: false,
          error: 'INVALID_XP_AMOUNT',
          message: 'XP amount must be an integer between 1 and 500.',
        },
        { status: 400 }
      );
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

    if (!url || !serviceKey) {
      console.error('[XP Add] Supabase credentials missing');
      return NextResponse.json(
        { ok: false, error: 'DATABASE_UNAVAILABLE', message: 'Database credentials missing.' },
        { status: 503 }
      );
    }

    const admin = createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const userId = gated.user!.id;

    const { data: rpcRes, error: rpcErr } = await admin.rpc('increment_xp', {
      p_user_id: userId,
      p_amount: amount,
      p_reason: reason,
    });

    if (rpcErr) {
      console.error('[XP Add] increment_xp RPC error:', rpcErr.message);
      return NextResponse.json(
        { ok: false, error: 'RPC_FAILED', message: rpcErr.message },
        { status: 500 }
      );
    }

    if (!rpcRes?.ok) {
      return NextResponse.json(
        { ok: false, error: rpcRes?.reason || 'XP_INCREMENT_REJECTED', message: rpcRes?.message || 'XP increment rejected.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      ok: true,
      newXp: rpcRes.new_xp,
      newLevel: rpcRes.new_level,
      amountAdded: amount,
      reason,
    });
  } catch (err: any) {
    console.error('[XP Add] Internal Error:', err);
    return NextResponse.json(
      { ok: false, error: 'INTERNAL_SERVER_ERROR', message: err?.message || 'Internal server error.' },
      { status: 500 }
    );
  }
}
