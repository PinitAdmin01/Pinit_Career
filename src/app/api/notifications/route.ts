import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getBearerToken } from '@/lib/server/requireAuth';

function getSupabaseClient(token?: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  if (!url || !anon) return null;
  return createClient(url, anon, {
    global: token ? { headers: { Authorization: `Bearer ${token}` } } : undefined,
    auth: { persistSession: false, autoRefreshToken: false }
  });
}

export async function GET(req: NextRequest) {
  const token = getBearerToken(req);
  if (!token) {
    return NextResponse.json({ notifications: [] }, { status: 200 });
  }

  const supabase = getSupabaseClient(token);
  if (!supabase) {
    return NextResponse.json({ notifications: [] }, { status: 200 });
  }

  try {
    const { data: { user }, error: userErr } = await supabase.auth.getUser(token);
    if (userErr || !user?.id) {
      return NextResponse.json({ notifications: [] }, { status: 200 });
    }

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      return NextResponse.json({ notifications: [] }, { status: 200 });
    }

    return NextResponse.json({ notifications: data || [] }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ notifications: [] }, { status: 200 });
  }
}
