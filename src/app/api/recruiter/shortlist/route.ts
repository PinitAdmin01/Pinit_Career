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

    if (!candidateId) {
      return NextResponse.json({ ok: false, error: 'CANDIDATE_ID_REQUIRED' }, { status: 400 });
    }

    // 1. Record interaction in recruiter_interactions table
    await admin.from('recruiter_interactions').insert({
      recruiter_id: recruiterId,
      candidate_id: candidateId,
      action_type: 'shortlist',
      meta: { timestamp: new Date().toISOString() },
    });

    // 2. Add audit log
    await admin.from('audit_logs').insert({
      actor_id: recruiterId,
      target_id: candidateId,
      action: 'shortlist_candidate',
      meta: { candidateId, timestamp: new Date().toISOString() },
      created_at: new Date().toISOString(),
    });

    // 3. Send real notification to candidate
    try {
      await admin.from('notifications').insert({
        user_id: candidateId,
        sender_id: recruiterId,
        title: 'Profile Shortlisted',
        message: 'A verified recruiter has shortlisted your profile for technical review.',
        type: 'recruiter_shortlist',
        is_read: false,
        read: false,
        created_at: new Date().toISOString(),
      });
    } catch (notifErr: any) {
      console.warn('[Recruiter Shortlist] Notification notice:', notifErr?.message);
    }

    return NextResponse.json({ ok: true, message: 'Candidate successfully shortlisted and notified.' });
  } catch (err: any) {
    console.error('[Recruiter Shortlist Exception]:', err?.message);
    return NextResponse.json({ ok: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}
