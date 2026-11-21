import { NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { createClient } from '@supabase/supabase-js';
import { DAILY_PIN_CAP, splitCreditIntoWallets } from '@/lib/pins/pinWalletRules';

const ALLOWED_SOURCES = new Set([
  'streak_bonus',
  'admin_grant',
  'daily_login',
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

    // Strict role check: admin_grant requires genuine admin role
    if (source === 'admin_grant' && (gated.user as any)?.role !== 'admin' && (gated.user as any)?.role !== 'superadmin') {
      return NextResponse.json(
        { ok: false, error: 'FORBIDDEN', message: 'Only administrators can issue admin pin grants.' },
        { status: 403 }
      );
    }

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

    // Fill Current Pins up to 120 daily cap first; overflow goes to unlimited Bonus Vault.
    const { data: userRow } = await admin
      .from('users')
      .select('pins, bonus_pins, pin_history')
      .eq('id', gated.user!.id)
      .maybeSingle();

    const currentPins = typeof userRow?.pins === 'number' ? userRow.pins : 0;
    const currentBonus = typeof userRow?.bonus_pins === 'number' ? userRow.bonus_pins : 0;
    const split = splitCreditIntoWallets(currentPins, currentBonus, amount, DAILY_PIN_CAP);
    const txId = 'tx_earn_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
    const newTx = {
      id: txId,
      type: 'earn',
      amount,
      reason: `Earned via ${source.replace(/_/g, ' ')} (+${split.toCurrent} current, +${split.toBonus} bonus)`,
      source,
      timestamp: Date.now(),
    };
    const currentHist = Array.isArray(userRow?.pin_history) ? userRow.pin_history : [];

    const { error: updateErr } = await admin
      .from('users')
      .update({
        pins: split.newPins,
        bonus_pins: split.newBonus,
        pin_history: [newTx, ...currentHist].slice(0, 100),
      })
      .eq('id', gated.user!.id);

    if (updateErr) {
      console.error('[pins/earn] Failed to update wallets:', updateErr);
      return NextResponse.json({ ok: false, error: 'PIN_CREDIT_FAILED' }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      credited: amount,
      source,
      newBalance: split.newPins,
      newBonusBalance: split.newBonus,
      creditedToCurrent: split.toCurrent,
      creditedToBonus: split.toBonus,
    });
  } catch (err: any) {
    console.error('[pins/earn] Internal error:', err);
    return NextResponse.json({ ok: false, error: err.message || 'Server error' }, { status: 500 });
  }
}
