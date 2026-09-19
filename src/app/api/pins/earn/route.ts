import { NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { createClient } from '@supabase/supabase-js';

const ALLOWED_SOURCES = new Set([
  'streak_bonus',
  'admin_grant',
  'mission_complete',
  'exam_pass',
  'interview_session',
  'study_session',
  'onboarding_complete',
  'vault_verify',
  'daily_login',
  'communication_session',
  'ai_interview',
  'course_enrollment',
]);

const MAX_EARN_LIMITS: Record<string, number> = {
  streak_bonus: 50,
  admin_grant: 1000,
  mission_complete: 30,
  exam_pass: 50,
  interview_session: 30,
  study_session: 20,
  onboarding_complete: 100,
  vault_verify: 30,
  daily_login: 20,
  communication_session: 20,
  ai_interview: 30,
  course_enrollment: 200,
};

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

    const maxAllowed = MAX_EARN_LIMITS[source] || 50;
    if (!Number.isFinite(amount) || amount <= 0 || amount > maxAllowed) {
      return NextResponse.json(
        { ok: false, error: 'INVALID_AMOUNT', message: `Amount must be between 1 and ${maxAllowed} for ${source}.` },
        { status: 400 }
      );
    }

    const admin = createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    let newBalance: number | null = null;
    const { data: rpcRes, error: rpcErr } = await admin.rpc('credit_pins', {
      p_user_id: gated.user!.id,
      p_amount: amount,
      p_reason: `Earned via ${source.replace(/_/g, ' ')}`,
      p_source: source,
    });

    if (!rpcErr && rpcRes?.ok && typeof rpcRes.new_balance === 'number') {
      newBalance = rpcRes.new_balance;
    } else {
      // Fallback: direct table update if RPC is missing
      const { data: userRow } = await admin.from('users').select('pins').eq('id', gated.user!.id).maybeSingle();
      newBalance = (userRow?.pins || 0) + amount;
      await admin.from('users').update({ pins: newBalance }).eq('id', gated.user!.id);
    }

    return NextResponse.json({
      ok: true,
      credited: amount,
      source,
      newBalance,
    });
  } catch (err: any) {
    console.error('[pins/earn] Internal error:', err);
    return NextResponse.json({ ok: false, error: err.message || 'Server error' }, { status: 500 });
  }
}
