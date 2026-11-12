import { NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';

/**
 * [FIX-STAGE: wave1c-pins-balance-api]
 * GET /api/pins/balance
 * Authoritative Pin balance & transaction history endpoint consumed by usePinBalance().
 * Eliminates client-side 404 console errors and returns combined spendable + bonus vault pins.
 */
export async function GET(req: Request) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error) {
      console.warn('[PinIT][Fix:PinsBalanceAPI] Unauthorized balance request rejected');
      return gated.error;
    }

    const userId = gated.user.id;
    const admin = getSupabaseAdmin();
    const { data, error } = await admin
      .from('users')
      .select('pins, bonus_pins, pin_history, unlocked_items')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('[PinIT][Fix:PinsBalanceAPI] DB lookup failed:', error.message);
      if (process.env.ALLOW_DEV_AUTH_BYPASS === 'true' && process.env.NODE_ENV !== 'production') {
        console.warn(`[PinIT][Fix:PinsBalanceAPI] Dev bypass returning degraded zero balance for ${userId.slice(0, 8)}...`);
        return NextResponse.json({
          ok: true,
          pins: 0,
          dailyPins: 0,
          bonusPins: 0,
          transactions: [],
          unlockedItems: [],
          degraded: true,
        });
      }
      return NextResponse.json(
        { ok: false, error: 'BALANCE_FETCH_FAILED', message: 'Failed to load pin balance.' },
        { status: 500 }
      );
    }

    if (!data) {
      console.warn(`[PinIT][Fix:PinsBalanceAPI] User row missing for ${userId.slice(0, 8)}..., returning zero balance`);
      return NextResponse.json({
        ok: true,
        pins: 0,
        dailyPins: 0,
        bonusPins: 0,
        transactions: [],
        unlockedItems: [],
      });
    }

    const dailyPins = typeof data.pins === 'number' && Number.isFinite(data.pins) ? data.pins : 0;
    const bonusPins = typeof data.bonus_pins === 'number' && Number.isFinite(data.bonus_pins) ? data.bonus_pins : 0;
    const totalPins = dailyPins + bonusPins;
    const transactions = Array.isArray(data.pin_history) ? data.pin_history : [];
    const unlockedItems = Array.isArray(data.unlocked_items) ? data.unlocked_items : [];

    console.log(
      `[PinIT][Fix:PinsBalanceAPI] Served balance user=${userId.slice(0, 8)}... pins=${totalPins} (daily=${dailyPins}, bonus=${bonusPins}, tx=${transactions.length})`
    );

    return NextResponse.json({
      ok: true,
      pins: totalPins,
      dailyPins,
      bonusPins,
      transactions,
      unlockedItems,
    });
  } catch (err: unknown) {
    console.error('[PinIT][Fix:PinsBalanceAPI] Unexpected error:', err);
    return NextResponse.json(
      {
        ok: false,
        error: 'SERVER_ERROR',
        message: err instanceof Error ? err.message : 'Server error loading pin balance.',
      },
      { status: 500 }
    );
  }
}
