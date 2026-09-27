import { NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';

interface ClaimResult {
  ok: boolean;
  error?: string;
  message?: string;
  claimed?: number;
  new_pins?: number;
  remaining_bonus?: number;
}

/**
 * Moves Pins from the bonus vault into the active balance.
 * One atomic RPC (row lock + balance + pin_history), so a concurrent Pins spend can't be
 * overwritten by a stale read-then-write. claim_bonus_pins is executable by service_role only.
 */
export async function POST(req: Request) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;

    const body = (await req.json().catch(() => ({}))) as { amount?: unknown };
    const requestedAmount =
      typeof body.amount === 'number' && Number.isFinite(body.amount) && body.amount > 0 ? Math.floor(body.amount) : null;

    const admin = getSupabaseAdmin();
    const { data, error } = await admin.rpc('claim_bonus_pins', {
      p_user_id: gated.user.id,
      p_amount: requestedAmount,
    });

    if (error) {
      console.error('[ClaimBonus] claim_bonus_pins failed:', error.message);
      return NextResponse.json({ ok: false, error: 'CLAIM_UPDATE_FAILED', message: 'Failed to claim bonus pins.' }, { status: 500 });
    }

    const result = (data ?? {}) as ClaimResult;
    if (!result.ok) {
      const code = result.error || 'CLAIM_FAILED';
      const status = code === 'NO_BONUS_PINS' ? 400 : code === 'USER_NOT_FOUND' ? 404 : 500;
      return NextResponse.json(
        { ok: false, error: code, message: result.message || 'Could not claim bonus pins.' },
        { status }
      );
    }

    const claimed = result.claimed ?? 0;
    return NextResponse.json({
      ok: true,
      claimed,
      newPins: result.new_pins,
      remainingBonus: result.remaining_bonus,
      message: `Successfully claimed +${claimed} pins into active balance!`,
    });
  } catch (err: unknown) {
    console.error('[ClaimBonus] Server error:', err);
    return NextResponse.json(
      { ok: false, error: 'SERVER_ERROR', message: err instanceof Error ? err.message : 'Server error claiming bonus pins.' },
      { status: 500 }
    );
  }
}
