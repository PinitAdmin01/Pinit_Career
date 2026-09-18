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

    // 1. Paid Pro users: daily quota renewal to 120 pins (like Jio / Airtel daily reset)
    const { data: proUpdated, error: proError } = await client
      .from('users')
      .update({ pins: 120, last_pin_reset: now })
      .eq('subscription_tier', 'pro')
      .eq('subscription_status', 'active')
      .select('id');

    if (proError) {
      console.error('[DailyPinReset] Failed to renew pro user pins:', proError);
      return NextResponse.json({ ok: false, error: proError.message }, { status: 500 });
    }

    // 2. Free / demo users: demo pins vanish after daily reset (reset pins to 0)
    const { data: freeUpdated, error: freeError } = await client
      .from('users')
      .update({ pins: 0, last_pin_reset: now })
      .neq('subscription_tier', 'pro')
      .gt('pins', 0)
      .select('id');

    if (freeError) {
      console.error('[DailyPinReset] Failed to expire free demo pins:', freeError);
      return NextResponse.json({ ok: false, error: freeError.message }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      source: 'table_update',
      proRenewedCount: Array.isArray(proUpdated) ? proUpdated.length : 0,
      freeExpiredCount: Array.isArray(freeUpdated) ? freeUpdated.length : 0,
      timestamp: now,
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message || 'Daily pin reset failed' }, { status: 500 });
  }
}
