import { NextResponse } from 'next/server';
import { requireAdminUserFromRequest } from '@/lib/server/requireAuth';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';

export async function GET(req: Request) {
  try {
    const gated = await requireAdminUserFromRequest(req);
    if (gated.error) return gated.error;

    const admin = getSupabaseAdmin();

    // 1. Quests / Missions stats
    let completedQuestsCount = 0;
    try {
      const { count } = await admin
        .from('quest_completions')
        .select('*', { count: 'exact', head: true });
      completedQuestsCount = count || 0;
    } catch {}

    // 2. Resumes stats
    let totalResumes = 0;
    try {
      const { count } = await admin
        .from('vault_items')
        .select('*', { count: 'exact', head: true });
      totalResumes = count || 0;
    } catch {}

    // 3. Exam results stats
    let totalExamsGraded = 0;
    let passingExamsCount = 0;
    try {
      const { data: examRows } = await admin
        .from('campus_exam_results')
        .select('score, total_marks');
      if (Array.isArray(examRows)) {
        totalExamsGraded = examRows.length;
        passingExamsCount = examRows.filter((e: any) => e.total_marks > 0 && (e.score / e.total_marks) >= 0.6).length;
      }
    } catch {}

    const passingRate = totalExamsGraded > 0 ? Math.round((passingExamsCount / totalExamsGraded) * 100) : 0;

    return NextResponse.json({
      ok: true,
      missions: {
        total_created: completedQuestsCount,
        completed_count: completedQuestsCount,
        active_streaks: 0,
      },
      resumes: {
        total_scanned: totalResumes,
        avg_score: 0,
        enhancements_generated: totalResumes,
      },
      exams: {
        certification_issued: passingExamsCount,
        passing_rate: passingRate,
        active_exams: totalExamsGraded,
      },
      isDemoData: false,
    });
  } catch (err: any) {
    console.error('[Admin Platform Stats Exception]:', err?.message);
    return NextResponse.json({ ok: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}
