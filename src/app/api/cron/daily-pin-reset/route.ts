import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';

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

    // 1. Subscribed students (Basic Plan ₹99 / Pro): daily quota renewal to 120 pins (like Airtel / Jio daily reset at 1:00 AM)
    const { data: subUpdated, error: subError } = await client
      .from('users')
      .update({ pins: 120, last_pin_reset: now })
      .in('subscription_tier', ['pro', 'basic', 'basic_student', 'student'])
      .eq('subscription_status', 'active')
      .select('id');

    if (subError) {
      console.error('[DailyPinReset] Failed to renew subscribed user pins:', subError);
      return NextResponse.json({ ok: false, error: subError.message }, { status: 500 });
    }

    // 2. Free / un-subscribed / expired users: daily active allowance expires at 1:00 AM reset (reset pins to 0)
    // Permanent vault / top-up bonus pins (bonus_pins) are safely preserved and never wiped!
    const { data: freeUpdated, error: freeError } = await client
      .from('users')
      .update({ pins: 0, last_pin_reset: now })
      .or('subscription_status.neq.active,subscription_tier.not.in.("pro","basic","basic_student","student")')
      .gt('pins', 0)
      .select('id');

    if (freeError) {
      console.error('[DailyPinReset] Failed to expire free demo pins:', freeError);
      return NextResponse.json({ ok: false, error: freeError.message }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      source: 'table_update',
      expiredSubsCount: Array.isArray(expiredSubs) ? expiredSubs.length : 0,
      subRenewedCount: Array.isArray(subUpdated) ? subUpdated.length : 0,
      freeExpiredCount: Array.isArray(freeUpdated) ? freeUpdated.length : 0,
      timestamp: now,
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message || 'Daily pin reset failed' }, { status: 500 });
  }
}
