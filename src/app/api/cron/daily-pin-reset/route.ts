import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';
import { DAILY_PIN_CAP } from '@/lib/pins/pinWalletRules';

function getAdminClient() {
  return getSupabaseAdmin();
}

export async function GET(req: Request) {
  return handleReset(req);
}

export async function POST(req: Request) {
  return handleReset(req);
}

async function handleReset(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    // Fail-closed authorization: strictly require valid CRON_SECRET
    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'UNAUTHORIZED', message: 'Cron secret required' }, { status: 401 });
    }

    const client = getAdminClient();
    const now = new Date().toISOString();

    // 0. Auto-expire subscriptions that have passed their expiration date
    const { data: expiredSubs } = await client
      .from('users')
      .update({ subscription_status: 'expired' })
      .eq('subscription_status', 'active')
      .not('subscription_expires_at', 'is', null)
      .lt('subscription_expires_at', now)
      .select('id');

    // 1. 1:00 AM IST Daily Reset (19:30 UTC in vercel.json):
    // EVERY user's current `pins` resets strictly to 120 (even if previously > 120 such as 1000, or < 120 such as 0).
    // Permanent Bonus Vault (`bonus_pins`) is unlimited and NEVER touched or reset.
    const { data: resetUsers, error: resetError } = await client
      .from('users')
      .update({ pins: DAILY_PIN_CAP, last_pin_reset: now })
      .not('id', 'is', null)
      .select('id');

    if (resetError) {
      console.error('[DailyPinReset] Failed to reset daily user pins:', resetError);
      return NextResponse.json({ ok: false, error: resetError.message }, { status: 500 });
    }

    const resetCount = Array.isArray(resetUsers) ? resetUsers.length : 0;

    return NextResponse.json({
      ok: true,
      source: 'table_update',
      dailyCap: DAILY_PIN_CAP,
      expiredSubsCount: Array.isArray(expiredSubs) ? expiredSubs.length : 0,
      resetUsersCount: resetCount,
      subRenewedCount: resetCount,
      freeExpiredCount: 0,
      timestamp: now,
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message || 'Daily pin reset failed' }, { status: 500 });
  }
}
