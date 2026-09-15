import { NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { createClient } from '@supabase/supabase-js';

const ALLOWED_SOURCES = new Set(['streak_bonus', 'admin_grant']);

export async function POST(req: Request) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
    if (!url || !serviceKey) {
      return NextResponse.json(
        { ok: false, error: 'SERVICE_UNAVAILABLE', message: 'Database not configured.' },
        { status: 503 }
      );
    }

    let body: any = {};
    try { body = await req.json(); } catch { /* ignore */ }

    const source = String(body.source || '').trim();
    const amount = Number(body.amount);

    // Block: 'purchase' is handled exclusively by /api/payment/verify (anti self-credit)
    if (!ALLOWED_SOURCES.has(source)) {
      return NextResponse.json(
        { ok: false, error: 'FORBIDDEN_SOURCE', message: `Source '${source}' cannot be self-credited. Purchase credits are handled by payment verification.` },
        { status: 403 }
      );
    }

    if (!Number.isFinite(amount) || amount <= 0 || amount > 10000) {
      return NextResponse.json(
        { ok: false, error: 'INVALID_AMOUNT', message: 'Amount must be between 1 and 10,000.' },
        { status: 400 }
      );
    }

    const admin = createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data: rpcRes, error: rpcErr } = await admin.rpc('credit_pins', {
      p_user_id: gated.user!.id,
      p_amount: amount,
      p_reason: `Earned via ${source.replace(/_/g, ' ')}`,
      p_source: source,
    });

    if (rpcErr) {
      console.error('[pins/earn] credit_pins RPC error:', rpcErr.message);
      return NextResponse.json(
        { ok: false, error: 'DATABASE_ERROR', message: rpcErr.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      credited: amount,
      source,
      newBalance: rpcRes?.new_balance ?? null,
    });
  } catch (err: any) {
    console.error('[pins/earn] Internal error:', err);
    return NextResponse.json({ ok: false, error: err.message || 'Server error' }, { status: 500 });
  }
}
