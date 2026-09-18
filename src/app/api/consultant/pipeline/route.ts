import { NextResponse } from 'next/server';
import { requireConsultantUserFromRequest } from '@/lib/server/requireAuth';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';

export async function GET(req: Request) {
  try {
    const gated = await requireConsultantUserFromRequest(req);
    if (gated.error) return gated.error;

    const admin = getSupabaseAdmin();

    const { data: users, error } = await admin
      .from('users')
      .select('id, display_name, username, email, phone, program_type, target_country, target_universities, study_abroad_status, visa_status, tasks, documents')
      .or('role.eq.student,role.is.null');

    const pipeline: Record<string, any[]> = {
      onboarding: [],
      document_collection: [],
      application: [],
      visa: [],
      pre_departure: [],
      completed: [],
    };

    if (error || !users) {
      return NextResponse.json({ ok: true, pipeline, stats: { total: 0, active: 0 } });
    }

    for (const s of users) {
      const status = s.study_abroad_status || 'onboarding';
      const studentObj = {
        _id: s.id,
        id: s.id,
        displayName: s.display_name || s.username || 'Student',
        email: s.email || '',
        phone: s.phone || '',
        targetCountry: s.target_country || 'USA',
        programType: s.program_type || 'Masters',
        visa_status: s.visa_status || 'not_started',
        status,
        tasks: Array.isArray(s.tasks) ? s.tasks : [],
        documents: Array.isArray(s.documents) ? s.documents : [],
        vaultItems: [],
      };

      if (pipeline[status]) {
        pipeline[status].push(studentObj);
      } else {
        pipeline.onboarding.push(studentObj);
      }
    }

    const total = users.length;
    const active = users.filter((u: any) => u.study_abroad_status !== 'completed').length;

    return NextResponse.json({ ok: true, pipeline, stats: { total, active } });
  } catch (err: any) {
    console.error('[Consultant Pipeline Exception]:', err?.message);
    return NextResponse.json({
      ok: false,
      pipeline: { onboarding: [], document_collection: [], application: [], visa: [], pre_departure: [], completed: [] },
      stats: { total: 0, active: 0 },
    });
  }
}
