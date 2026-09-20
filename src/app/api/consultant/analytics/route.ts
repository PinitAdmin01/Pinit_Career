import { NextResponse } from 'next/server';
import { requireConsultantUserFromRequest } from '@/lib/server/requireAuth';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';

export async function GET(req: Request) {
  try {
    const gated = await requireConsultantUserFromRequest(req);
    if (gated.error) return gated.error;

    const admin = getSupabaseAdmin();

    // Query students genuine data safely without querying non-existent columns
    const { data: students, error } = await admin
      .from('users')
      .select('id, role, display_name, username, onboarding_answers, trust_score, ats_score')
      .or('role.eq.student,role.is.null');

    if (error) {
      console.warn('[Consultant Analytics] DB query notice:', error.message);
      return NextResponse.json({
        ok: true,
        totalStudents: 0,
        totalRevenue: 0,
        visaApprovalRate: 0,
        offerRate: 0,
        analytics: { totalStudents: 0, totalRevenue: 0, visaApprovalRate: 0, offerRate: 0 },
      });
    }

    const totalStudents = (students || []).length;
    let approvedCount = 0;
    let offeredCount = 0;
    let totalRevenue = 0;

    for (const s of (students || [])) {
      const ob = (s.onboarding_answers as Record<string, any>) || {};
      const visaStatus = (s as any).visa_status || ob.visa_status || ob.visaStatus || 'not_started';
      const appStatus = (s as any).application_status || ob.application_status || ob.applicationStatus || '';
      const fee = Number((s as any).study_abroad_fee || ob.study_abroad_fee || ob.studyAbroadFee) || 0;

      if (visaStatus === 'approved') approvedCount++;
      if (appStatus === 'offered' || appStatus === 'accepted') offeredCount++;
      totalRevenue += fee;
    }

    // Honest mathematical metrics - ZERO artificial floors
    const visaApprovalRate = totalStudents > 0 ? Math.round((approvedCount / totalStudents) * 100) : 0;
    const offerRate = totalStudents > 0 ? Math.round((offeredCount / totalStudents) * 100) : 0;

    const result = {
      ok: true,
      totalStudents,
      totalRevenue,
      visaApprovalRate,
      offerRate,
      analytics: {
        totalStudents,
        totalRevenue,
        visaApprovalRate,
        offerRate,
      },
    };

    return NextResponse.json(result);
  } catch (err: any) {
    console.error('[Consultant Analytics Exception]:', err?.message);
    return NextResponse.json({
      ok: true,
      totalStudents: 0,
      totalRevenue: 0,
      visaApprovalRate: 0,
      offerRate: 0,
      analytics: { totalStudents: 0, totalRevenue: 0, visaApprovalRate: 0, offerRate: 0 },
    });
  }
}
