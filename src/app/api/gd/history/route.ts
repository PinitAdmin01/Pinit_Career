import { NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { createClient } from '@supabase/supabase-js';

function getSupabaseServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export async function POST(req: Request) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error || !gated.user?.id) {
      return gated.error || NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = gated.user.id;
    const sessionData = await req.json();

    const supabase = getSupabaseServer();
    if (!supabase) {
      console.warn('[GD History API] Supabase not configured, session recorded locally only');
      return NextResponse.json({ ok: true, saved: false, warning: 'Database client unavailable' });
    }

    let newSession: any = null;
    let fullPayload: any[] | null = null;

    if (Array.isArray(sessionData)) {
      fullPayload = sessionData;
    } else if (sessionData && Array.isArray(sessionData.history_payload)) {
      fullPayload = sessionData.history_payload;
    } else if (sessionData) {
      newSession = sessionData;
    }

    if (newSession) {
      // Fetch existing history list from student_gd_history
      const { data: existingRow } = await supabase
        .from('student_gd_history')
        .select('history_payload')
        .eq('user_id', userId)
        .maybeSingle();

      let currentList: any[] = [];
      if (existingRow?.history_payload && Array.isArray(existingRow.history_payload)) {
        currentList = existingRow.history_payload;
      }

      // Prepend new record, filter duplicates by id, cap at 30
      fullPayload = [newSession, ...currentList.filter((item: any) => item.id !== newSession.id)].slice(0, 30);
    }

    if (fullPayload) {
      const { error: upsertError } = await supabase
        .from('student_gd_history')
        .upsert({
          user_id: userId,
          history_payload: fullPayload,
          updated_at: new Date().toISOString()
        });

      if (upsertError) {
        console.error('[GD History API] Upsert error into student_gd_history:', upsertError.message);
      }
    }

    // Also attempt to store into gd_sessions table if present
    if (newSession) {
      try {
        const isValidUuid = typeof newSession?.id === 'string' &&
          /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(newSession.id);

        const row: Record<string, any> = {
          user_id: userId,
          topic: newSession.topic || newSession.roomName || 'Group Discussion',
          objective: newSession.objective || '',
          difficulty: newSession.difficulty || 'medium',
          domain: newSession.domain || 'general',
          score: Math.round(Number(newSession.report?.score || newSession.score) || 0),
          report: newSession.report || {},
          transcript: newSession.transcript || newSession.messages || [],
          duration_minutes: Number(newSession.durationMinutes) || 0,
          created_at: new Date().toISOString()
        };
        if (isValidUuid) row.id = newSession.id;

        await supabase.from('gd_sessions').upsert([row]);
      } catch {
        // Table may not exist in all environments; student_gd_history is primary
      }
    }

    return NextResponse.json({
      ok: true,
      saved: true,
      sessionId: newSession?.id || (Array.isArray(fullPayload) && fullPayload[0]?.id) || `gd_${Date.now()}`,
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    console.error('[GD History API Error]:', err);
    return NextResponse.json({ error: err.message || 'Failed to record GD session history' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error || !gated.user?.id) {
      return gated.error || NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = gated.user.id;

    const supabase = getSupabaseServer();
    if (!supabase) {
      return NextResponse.json({ ok: true, sessions: [] });
    }

    // 1. Check student_gd_history JSON array
    const { data: gdHistory, error: gdError } = await supabase
      .from('student_gd_history')
      .select('history_payload')
      .eq('user_id', userId)
      .maybeSingle();

    if (!gdError && gdHistory?.history_payload && Array.isArray(gdHistory.history_payload)) {
      return NextResponse.json({
        ok: true,
        sessions: gdHistory.history_payload
      });
    }

    // 2. Fallback check gd_sessions table
    const { data: rows, error: rowsError } = await supabase
      .from('gd_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(30);

    if (!rowsError && rows && rows.length > 0) {
      const sessions = rows.map((r: any) => ({
        id: r.id,
        topic: r.topic,
        objective: r.objective,
        date: new Date(r.created_at).toLocaleDateString(),
        difficulty: r.difficulty,
        domain: r.domain,
        durationMinutes: r.duration_minutes,
        report: r.report,
        transcript: r.transcript
      }));
      return NextResponse.json({ ok: true, sessions });
    }

    return NextResponse.json({ ok: true, sessions: [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch GD session history' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error || !gated.user?.id) {
      return gated.error || NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = gated.user.id;
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Missing session id' }, { status: 400 });
    }

    const supabase = getSupabaseServer();
    if (!supabase) {
      return NextResponse.json({ ok: true, deleted: true, warning: 'Database client unavailable' });
    }

    // 1. Filter from student_gd_history
    const { data: existingRow } = await supabase
      .from('student_gd_history')
      .select('history_payload')
      .eq('user_id', userId)
      .maybeSingle();

    if (existingRow?.history_payload && Array.isArray(existingRow.history_payload)) {
      const filtered = existingRow.history_payload.filter((item: any) => item.id !== id);
      await supabase
        .from('student_gd_history')
        .upsert({
          user_id: userId,
          history_payload: filtered,
          updated_at: new Date().toISOString()
        });
    }

    // 2. Also attempt gd_sessions delete
    try {
      await supabase
        .from('gd_sessions')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);
    } catch {}

    return NextResponse.json({ ok: true, deleted: true, id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to delete GD session history' }, { status: 500 });
  }
}
