import { NextResponse } from 'next/server';
import { requireConsultantUserFromRequest } from '@/lib/server/requireAuth';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const gated = await requireConsultantUserFromRequest(req);
    if (gated.error) return gated.error;

    const studentId = params.id;
    const admin = getSupabaseAdmin();
    const body = await req.json().catch(() => ({}));

    const updatePayload: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (body.status) updatePayload.study_abroad_status = body.status;
    if (body.visa_status || body.visaStatus) updatePayload.visa_status = body.visa_status || body.visaStatus;
    if (body.tasks) updatePayload.tasks = body.tasks;
    if (body.documents) updatePayload.documents = body.documents;

    const { error } = await admin
      .from('users')
      .update(updatePayload)
      .eq('id', studentId);

    if (error) {
      console.warn('[Consultant Update Student] Update notice:', error.message);
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, message: 'Student stage updated.' });
  } catch (err: any) {
    console.error('[Consultant Update Student Exception]:', err?.message);
    return NextResponse.json({ ok: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}
