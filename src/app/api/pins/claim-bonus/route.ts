import { NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';
import { generateTxId } from '@/lib/utils/transactionId';

export async function POST(req: Request) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;

    const body = await req.json().catch(() => ({}));
    const requestedAmount = typeof body.amount === 'number' ? Math.floor(body.amount) : null;

    const admin = getSupabaseAdmin();

    // 1. Fetch current balance, bonus pins, and history from users table
    const { data: profile, error: fetchErr } = await admin
      .from('users')
      .select('pins, bonus_pins, pin_history')
      .eq('id', gated.user.id)
      .maybeSingle();

    if (fetchErr) {
      console.error('[ClaimBonus] Failed to fetch user profile:', fetchErr);
      return NextResponse.json({ ok: false, error: 'USER_LOOKUP_FAILED', message: 'Failed to lookup user profile.' }, { status: 500 });
    }

    const currentBonus = typeof profile?.bonus_pins === 'number' ? profile.bonus_pins : 0;
    const currentPins = typeof profile?.pins === 'number' ? profile.pins : 0;

    if (currentBonus <= 0) {
      return NextResponse.json({
        ok: false,
        error: 'NO_BONUS_PINS',
        message: 'You have no bonus pins available in your vault to claim.',
      }, { status: 400 });
    }

    // Default to claiming all available bonus pins, or the requested positive amount
    const toClaim = requestedAmount && requestedAmount > 0
      ? Math.min(requestedAmount, currentBonus)
      : currentBonus;

    const newBonus = currentBonus - toClaim;
    const newPins = currentPins + toClaim;

    // 2. Prepare transaction log entry
    const newTx = {
      id: generateTxId(),
      amount: toClaim,
      type: 'earn',
      source: 'bonus_claim',
      reason: `Claimed +${toClaim} pins from Bonus Vault`,
      timestamp: Date.now(),
    };

    const currentHistory = Array.isArray(profile?.pin_history) ? profile.pin_history : [];
    const updatedHistory = [newTx, ...currentHistory].slice(0, 100);

    // 3. Atomically update users table
    const { error: updateErr } = await admin
      .from('users')
      .update({
        pins: newPins,
        bonus_pins: newBonus,
        pin_history: updatedHistory,
      })
      .eq('id', gated.user.id);

    if (updateErr) {
      console.error('[ClaimBonus] Failed to update balance:', updateErr);
      return NextResponse.json({ ok: false, error: 'CLAIM_UPDATE_FAILED', message: 'Failed to claim bonus pins.' }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      claimed: toClaim,
      newPins,
      remainingBonus: newBonus,
      message: `Successfully claimed +${toClaim} pins into active balance!`,
    });
  } catch (err: any) {
    console.error('[ClaimBonus] Server error:', err);
    return NextResponse.json({ ok: false, error: 'SERVER_ERROR', message: err.message || 'Server error claiming bonus pins.' }, { status: 500 });
  }
}
