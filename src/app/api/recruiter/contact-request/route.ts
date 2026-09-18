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
    const message = body.message || 'A recruiter has expressed interest in your profile and requested contact.';

    if (!candidateId) {
      return NextResponse.json({ ok: false, error: 'CANDIDATE_ID_REQUIRED' }, { status: 400 });
    }

    // 1. Record in recruiter_interactions
    await admin.from('recruiter_interactions').insert({
      recruiter_id: recruiterId,
      candidate_id: candidateId,
      action_type: 'contact_request',
      meta: { message, timestamp: new Date().toISOString() },
    });

    // 2. Add audit log
    await admin.from('audit_logs').insert({
      actor_id: recruiterId,
      target_id: candidateId,
      action: 'contact_request',
      meta: { candidateId, message, timestamp: new Date().toISOString() },
      created_at: new Date().toISOString(),
    });

    // 3. Send real notification to candidate
    try {
      await admin.from('notifications').insert({
        user_id: candidateId,
        sender_id: recruiterId,
        title: 'Recruiter Contact Request',
        message,
        type: 'recruiter_contact',
        is_read: false,
        read: false,
        created_at: new Date().toISOString(),
      });
    } catch (notifErr: any) {
      console.warn('[Recruiter Contact] Notification notice:', notifErr?.message);
    }

    return NextResponse.json({ ok: true, message: 'Contact request sent to candidate.' });
  } catch (err: any) {
    console.error('[Recruiter Contact Exception]:', err?.message);
    return NextResponse.json({ ok: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}
