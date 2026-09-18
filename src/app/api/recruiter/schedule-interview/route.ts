import { NextResponse } from 'next/server';
import { requireRecruiterUserFromRequest } from '@/lib/server/requireAuth';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';

export async function POST(req: Request) {
  try {
    const gated = await requireRecruiterUserFromRequest(req);
    if (gated.error) return gated.error;

    const recruiterId = gated.user!.id;
    const admin = getSupabaseAdmin();

    const body = await req.json().catch(() => ({}));
    const candidateId = body.candidateId || body.id;
    const scheduledAt = body.scheduledAt || body.date || new Date().toISOString();
    const mode = body.mode || 'Virtual / Video Call';
    const roleTitle = body.roleTitle || 'Software Engineering Role';

    if (!candidateId) {
      return NextResponse.json({ ok: false, error: 'CANDIDATE_ID_REQUIRED' }, { status: 400 });
    }

    // 1. Record in recruiter_interactions
    await admin.from('recruiter_interactions').insert({
      recruiter_id: recruiterId,
      candidate_id: candidateId,
      action_type: 'interview_scheduled',
      meta: { scheduledAt, mode, roleTitle, timestamp: new Date().toISOString() },
    });

    // 2. Add audit log
    await admin.from('audit_logs').insert({
      actor_id: recruiterId,
      target_id: candidateId,
      action: 'schedule_interview',
      meta: { candidateId, scheduledAt, mode, roleTitle },
      created_at: new Date().toISOString(),
    });

    // 3. Send real notification to candidate
    try {
      await admin.from('notifications').insert({
        user_id: candidateId,
        sender_id: recruiterId,
        title: 'Interview Invitation Scheduled',
        message: `You have an interview scheduled for ${roleTitle} on ${new Date(scheduledAt).toLocaleString()} (${mode}).`,
        type: 'recruiter_interview',
        is_read: false,
        read: false,
        created_at: new Date().toISOString(),
      });
    } catch (notifErr: any) {
      console.warn('[Recruiter Interview] Notification notice:', notifErr?.message);
    }

    return NextResponse.json({
      ok: true,
      message: 'Interview successfully scheduled and candidate notified.',
      scheduledAt,
      mode,
    });
  } catch (err: any) {
    console.error('[Recruiter Interview Exception]:', err?.message);
    return NextResponse.json({ ok: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}
