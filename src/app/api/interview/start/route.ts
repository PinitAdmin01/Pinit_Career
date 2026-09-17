import { NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { recordActiveLiveInterview, completeActiveLiveInterview } from '@/lib/interview/activeSessionRegistry';

/**
 * POST /api/interview/start
 * Authoritatively tracks session lifecycle (start, resume, cancel).
 * Ensures anti-cheat checks are active before question 1.
 */
export async function POST(req: Request) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;

    const body = await req.json().catch(() => ({}));
    const { action = 'start', topic = 'Software Engineering', stage = 'round1_behavioral' } = body;

    if (action === 'cancel' || action === 'complete') {
      completeActiveLiveInterview(gated.user.id);
      return NextResponse.json({ ok: true, active: false });
    }

    recordActiveLiveInterview(gated.user.id, topic, stage);
    return NextResponse.json({ ok: true, active: true, topic, stage });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to manage session state' }, { status: 500 });
  }
}
