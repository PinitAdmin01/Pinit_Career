import { NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';
import { computeBonusClaimToCurrent, DAILY_PIN_CAP } from '@/lib/pins/pinWalletRules';

interface ClaimResult {
  ok: boolean;
  error?: string;
  message?: string;
  claimed?: number;
  new_pins?: number;
  remaining_bonus?: number;
}

/**
 * Moves Pins from the Bonus Vault (`bonus_pins`) into Current Pins (`pins`)
 * STRICTLY capped at DAILY_PIN_CAP (120).
 * Enforces the 120 daily cap here before calling the atomic `claim_bonus_pins` RPC
 * (which also enforces the 120 cap under a row lock).
 */
export async function POST(req: Request) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;

    const body = (await req.json().catch(() => ({}))) as { amount?: unknown };
    const requestedAmount =
      typeof body.amount === 'number' && Number.isFinite(body.amount) && body.amount > 0 ? Math.floor(body.amount) : null;

    const admin = getSupabaseAdmin();

    // Enforce the 120 current-pins daily cap before invoking RPC so production works immediately
    // even if a legacy DB RPC without the 120 cap is still live.
    const { data: profile, error: profileErr } = await admin
      .from('users')
      .select('pins, bonus_pins')
      .eq('id', gated.user.id)
      .maybeSingle();

    if (profileErr || !profile) {
      return NextResponse.json(
        { ok: false, error: 'USER_NOT_FOUND', message: 'User profile not found.' },
        { status: 404 }
      );
    }

    const currentPins = typeof profile.pins === 'number' ? profile.pins : 0;
    const currentBonus = typeof profile.bonus_pins === 'number' ? profile.bonus_pins : 0;
    const plan = computeBonusClaimToCurrent(currentPins, currentBonus, requestedAmount, DAILY_PIN_CAP);

    if (!plan.ok) {
      const message =
        plan.error === 'CURRENT_PINS_FULL'
          ? `Your Current Pins are already full (${currentPins}/${DAILY_PIN_CAP}). Spend Current Pins before refilling from your Bonus Vault.`
          : 'No bonus pins available to claim.';
      return NextResponse.json(
        {
          ok: false,
          error: plan.error,
          message,
          currentPins,
          bonusPins: currentBonus,
          dailyCap: DAILY_PIN_CAP,
        },
        { status: 400 }
      );
    }

    const { data, error } = await admin.rpc('claim_bonus_pins', {
      p_user_id: gated.user.id,
      p_amount: plan.claimed,
    });

    if (error) {
      console.error('[ClaimBonus] claim_bonus_pins failed:', error.message);
      return NextResponse.json({ ok: false, error: 'CLAIM_UPDATE_FAILED', message: 'Failed to claim bonus pins.' }, { status: 500 });
    }

    const result = (data ?? {}) as ClaimResult;
    if (!result.ok) {
      const code = result.error || 'CLAIM_FAILED';
      const status = code === 'NO_BONUS_PINS' || code === 'CURRENT_PINS_FULL' ? 400 : code === 'USER_NOT_FOUND' ? 404 : 500;
      return NextResponse.json(
        { ok: false, error: code, message: result.message || 'Could not claim bonus pins.' },
        { status }
      );
    }

    const claimed = result.claimed ?? plan.claimed;
    return NextResponse.json({
      ok: true,
      claimed,
      newPins: result.new_pins ?? plan.newPins,
      remainingBonus: result.remaining_bonus ?? plan.remainingBonus,
      dailyCap: DAILY_PIN_CAP,
      message: `Refilled +${claimed} pins into Current Pins (${result.new_pins ?? plan.newPins}/${DAILY_PIN_CAP})!`,
    });
  } catch (err: unknown) {
    console.error('[ClaimBonus] Server error:', err);
    return NextResponse.json(
      { ok: false, error: 'SERVER_ERROR', message: err instanceof Error ? err.message : 'Server error claiming bonus pins.' },
      { status: 500 }
    );
  }
}
