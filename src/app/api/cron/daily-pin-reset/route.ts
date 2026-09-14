import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  if (!url || !key) return supabase;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
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

    // First attempt PostgreSQL RPC
    const { data: rpcData, error: rpcError } = await client.rpc('perform_daily_pin_reset');
    if (!rpcError && rpcData) {
      return NextResponse.json({
        ok: true,
        source: 'rpc',
        resetCount: rpcData.reset_count ?? 0,
        timestamp: rpcData.timestamp || new Date().toISOString()
      });
    }

    // Direct table update fallback if RPC is not yet registered
    const { data, error } = await client
      .from('users')
      .update({ pins: 120, last_pin_reset: new Date().toISOString() })
      .lt('pins', 120)
      .select('id');

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      source: 'table_update',
      resetCount: Array.isArray(data) ? data.length : 0,
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message || 'Daily pin reset failed' }, { status: 500 });
  }
}
