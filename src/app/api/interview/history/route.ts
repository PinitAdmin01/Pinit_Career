import { NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { createClient } from '@supabase/supabase-js';
import { verifyEvaluationSignature } from '@/lib/interview/evaluationSignature';
import { calculateRoleWeightedScore, normalizeRoleKey, clampScore, InterviewDimensions } from '@/lib/interview/scoringMatrix';

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
    const sessionData = await req.json().catch(() => ({}));

    const claimedScore = Math.round(Number(sessionData?.score) || 0);
    const claimedVerdict = String(sessionData?.verdict || 'Needs Work');
    const token = sessionData?.evaluationToken || sessionData?.evaluation?.evaluationToken;

    const transcriptMessages = Array.isArray(sessionData?.messages) ? sessionData.messages : [];
    const userMessageCount = transcriptMessages.filter((m: any) => m.role === 'user').length;

    // Fail-Closed Guard: If transcript is empty, candidate cannot record a passing score
    if (userMessageCount === 0 && claimedScore > 0) {
      return NextResponse.json(
        {
          error: 'Cannot record a completed session with a non-zero score without candidate responses in the transcript.',
          code: 'EMPTY_TRANSCRIPT_SCORE_REJECTED'
        },
        { status: 400 }
      );
    }

    const isSignatureValid = verifyEvaluationSignature(userId, claimedScore, claimedVerdict, token);

    let authoritativeScore = claimedScore;
    let authoritativeVerdict = claimedVerdict;
    let authoritativeRadar = sessionData?.radar || {};

    if (!isSignatureValid) {
      if (token && typeof token === 'string' && token.trim().length > 0) {
        console.warn(`[Interview History API] Tampered or forged evaluation token for user: ${userId}`);
        return NextResponse.json(
          {
            error: 'Evaluation signature verification failed. The score or verdict does not match server evaluation.',
            code: 'TAMPERED_EVALUATION_TOKEN'
          },
          { status: 403 }
        );
      }

      console.warn(`[Interview History API] Unsigned evaluation for user: ${userId}. Re-evaluating authoritatively.`);
      const roleKey = normalizeRoleKey(sessionData?.domainSubTopic || sessionData?.domainStream || 'general_tech');

      const rawRadar = sessionData?.radar || {};
      const sanitizedDimensions: InterviewDimensions = {
        logic: userMessageCount === 0 ? 0 : Math.min(60, clampScore(rawRadar.logic, 50)),
        systems: userMessageCount === 0 ? 0 : Math.min(60, clampScore(rawRadar.systems, 50)),
        comms: userMessageCount === 0 ? 0 : Math.min(60, clampScore(rawRadar.comms, 50)),
        solving: userMessageCount === 0 ? 0 : Math.min(60, clampScore(rawRadar.solving, 50)),
        star: userMessageCount === 0 ? 0 : Math.min(60, clampScore(rawRadar.star, 50))
      };

      const recalc = calculateRoleWeightedScore(sanitizedDimensions, roleKey);
      authoritativeScore = Math.min(60, recalc.overallScore);
      authoritativeVerdict = 'Unverified - Needs Evaluation';
      authoritativeRadar = recalc.sanitizedDimensions;
    }

    const supabase = getSupabaseServer();
    if (!supabase) {
      console.warn('[Interview History API] Supabase not configured, session verified locally only');
      return NextResponse.json({
        ok: true,
        saved: false,
        warning: 'Database client unavailable',
        score: authoritativeScore,
        verdict: authoritativeVerdict,
        verified: isSignatureValid
      });
    }

    const isValidUuid = typeof sessionData?.id === 'string' &&
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(sessionData.id);

    const isValidUserUuid = typeof userId === 'string' &&
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(userId);

    if (!isValidUserUuid) {
      console.log(`[Interview History API] Non-UUID user ID '${userId}' verified locally without Supabase insert.`);
      return NextResponse.json({
        ok: true,
        saved: false,
        warning: 'Non-UUID user ID; session verified locally',
        score: authoritativeScore,
        verdict: authoritativeVerdict,
        verified: isSignatureValid
      });
    }

    const insertPayload: Record<string, any> = {
      user_id: userId,
      mode: sessionData?.type || 'technical',
      domain: sessionData?.domainSubTopic || sessionData?.domainStream || 'general',
      pressure_mode: sessionData?.difficulty || 'normal',
      persona: 'professional',
      status: 'completed',
      overall_score: authoritativeScore,
      transcript: transcriptMessages,
      evaluation: {
        id: sessionData?.id,
        date: sessionData?.date,
        timestamp: sessionData?.timestamp,
        type: sessionData?.type,
        domainStream: sessionData?.domainStream,
        domainSubTopic: sessionData?.domainSubTopic,
        difficulty: sessionData?.difficulty,
        verdict: authoritativeVerdict,
        score: authoritativeScore,
        radar: authoritativeRadar,
        telemetry: sessionData?.telemetry,
        summary: sessionData?.summary,
        strengths: sessionData?.strengths,
        improvements: sessionData?.improvements,
        topology: sessionData?.topology || null,
        verified: isSignatureValid
      },
      completed_at: new Date().toISOString()
    };

    if (isValidUuid) {
      insertPayload.id = sessionData.id;
    }

    const { data: inserted, error: insertError } = await supabase
      .from('interview_sessions')
      .upsert([insertPayload], { onConflict: 'id' })
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
      timestamp: inserted?.created_at || new Date().toISOString(),
      score: authoritativeScore,
      verdict: authoritativeVerdict,
      verified: isSignatureValid
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
      .limit(20);

    if (error) {
      console.error('[Interview History API] Fetch error:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const formatted = (data || []).map((row: any) => {
      const evalData = row.evaluation || {};
      return {
        id: row.id,
        date: evalData.date || new Date(row.created_at).toLocaleDateString(),
        timestamp: row.created_at,
        type: row.mode || evalData.type || 'technical',
        domainStream: evalData.domainStream || 'tech',
        domainSubTopic: row.domain || evalData.domainSubTopic || '',
        difficulty: row.pressure_mode || evalData.difficulty || 'normal',
        verdict: evalData.verdict || (row.overall_score >= 70 ? 'Pass' : 'Needs Work'),
        score: row.overall_score ?? evalData.score ?? 0,
        radar: evalData.radar || {},
        telemetry: evalData.telemetry || {},
        summary: evalData.summary || '',
        strengths: evalData.strengths || [],
        improvements: evalData.improvements || [],
        topology: evalData.topology || null,
        messages: row.transcript || evalData.messages || [],
        verified: evalData.verified ?? false
      };
    });

    return NextResponse.json({ ok: true, sessions: formatted });
  } catch (err: any) {
    console.error('[Interview History API Error]:', err);
    return NextResponse.json({ error: err.message || 'Failed to fetch session history' }, { status: 500 });
  }
}
