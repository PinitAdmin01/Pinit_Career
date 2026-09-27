import { NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';
import { checkRateLimit } from '@/lib/server/rateLimit';
import { recordActiveLiveInterview, completeActiveLiveInterview } from '@/lib/interview/activeSessionRegistry';
import { abandonLiveSession, loadActiveLiveSession, startLiveSession } from '@/lib/interview/liveSession';

/**
 * POST /api/interview/start
 * Session lifecycle (start, resume, cancel). On start the server opens the interview record it
 * keeps itself (interview_live_sessions); the page sends its id with every answer and with the
 * final evaluation, so the score comes from what the server recorded. If the record cannot be
 * opened (table not deployed yet), the interview runs as unrecorded practice: no XP, no signed result.
 */
export async function POST(req: Request) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;
    const userId = gated.user.id;

    const body = await req.json().catch(() => ({}));
    const { action = 'start', topic = 'Software Engineering', stage = 'round1_behavioral' } = body;
    const admin = getSupabaseAdmin();

    if (action === 'cancel' || action === 'complete') {
      completeActiveLiveInterview(userId);
      if (action === 'cancel' && body.liveSessionId) await abandonLiveSession(admin, userId, body.liveSessionId);
      return NextResponse.json({ ok: true, active: false });
    }

    recordActiveLiveInterview(userId, topic, stage);

    if (action === 'resume') {
      const found = await loadActiveLiveSession(admin, userId, body.liveSessionId);
      return NextResponse.json({ ok: true, active: true, topic, stage, liveSessionId: found.ok ? found.session.id : null, recorded: found.ok });
    }

    const rl = checkRateLimit(`interview_start_${userId}`, { limit: 20, windowMs: 3_600_000 });
    if (!rl.allowed) {
      return NextResponse.json({ error: 'RATE_LIMIT', message: 'Too many interviews started. Please wait a while.' }, { status: 429 });
    }
    const domainStream = body.domainStream === 'non_tech' ? 'non_tech' : 'tech';
    const session = await startLiveSession(admin, userId, String(topic || 'Software Engineering'), domainStream, body.opening);
    return NextResponse.json({ ok: true, active: true, topic, stage, liveSessionId: session?.id ?? null, recorded: Boolean(session) });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to manage session state' }, { status: 500 });
  }
}
