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
      console.warn('[Interview History API] Supabase not configured, session recorded locally only');
      return NextResponse.json({ ok: true, saved: false, warning: 'Database client unavailable' });
    }

    const isValidUuid = typeof sessionData?.id === 'string' &&
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(sessionData.id);

    const insertPayload: Record<string, any> = {
      user_id: userId,
      mode: sessionData?.type || 'technical',
      domain: sessionData?.domainSubTopic || sessionData?.domainStream || 'general',
      pressure_mode: sessionData?.difficulty || 'normal',
      persona: 'professional',
      status: 'completed',
      overall_score: Math.round(Number(sessionData?.score) || 0),
      transcript: Array.isArray(sessionData?.messages) ? sessionData.messages : [],
      evaluation: {
        id: sessionData?.id,
        date: sessionData?.date,
        timestamp: sessionData?.timestamp,
        type: sessionData?.type,
        domainStream: sessionData?.domainStream,
        domainSubTopic: sessionData?.domainSubTopic,
        difficulty: sessionData?.difficulty,
        verdict: sessionData?.verdict,
        score: sessionData?.score,
        radar: sessionData?.radar,
        telemetry: sessionData?.telemetry,
        summary: sessionData?.summary,
        strengths: sessionData?.strengths,
        improvements: sessionData?.improvements,
        topology: sessionData?.topology || null,
      },
      completed_at: new Date().toISOString()
    };

    if (isValidUuid) {
      insertPayload.id = sessionData.id;
    }

    const { data: inserted, error: insertError } = await supabase
      .from('interview_sessions')
      .insert([insertPayload])
      .select('id, created_at')
      .single();

    if (insertError) {
      console.error('[Interview History API] Insert error:', insertError.message);
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      saved: true,
      sessionId: inserted?.id || sessionData?.id,
      timestamp: inserted?.created_at || new Date().toISOString()
    });
  } catch (err: any) {
    console.error('[Interview History API Error]:', err);
    return NextResponse.json({ error: err.message || 'Failed to record session history' }, { status: 500 });
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

    const { data, error } = await supabase
      .from('interview_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(30);

    if (error) {
      console.error('[Interview History API] Fetch error:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const sessions = (data || []).map((row: any) => {
      const evalData = row.evaluation || {};
      return {
        id: evalData.id || row.id,
        date: evalData.date || new Date(row.created_at).toLocaleDateString(),
        timestamp: evalData.timestamp || row.created_at,
        type: row.mode || evalData.type || 'technical',
        domainStream: evalData.domainStream || 'tech',
        domainSubTopic: row.domain || evalData.domainSubTopic || '',
        difficulty: row.pressure_mode || evalData.difficulty || 'normal',
        verdict: evalData.verdict || (row.overall_score >= 70 ? 'Pass' : 'Needs Practice'),
        score: row.overall_score || 0,
        radar: evalData.radar || { logic: 0, systems: 0, comms: 0, solving: 0, star: 0 },
        telemetry: evalData.telemetry || { eyeContact: 0, wpm: 0, fillerWords: 0, tabSwitches: 0 },
        messages: row.transcript || [],
        summary: evalData.summary || '',
        strengths: evalData.strengths || [],
        improvements: evalData.improvements || '',
        topology: evalData.topology || row.topology || null,
      };
    });

    return NextResponse.json({
      ok: true,
      sessions
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch session history' }, { status: 500 });
  }
}
