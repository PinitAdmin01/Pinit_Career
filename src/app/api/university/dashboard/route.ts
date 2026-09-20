import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';
import { getUniversityDashboard } from '@/lib/university/analytics';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const college = searchParams.get('college') || undefined;
    const department = searchParams.get('department') || undefined;
    const batchYearStr = searchParams.get('batchYear');
    const batchYear = batchYearStr && !isNaN(Number(batchYearStr)) ? Number(batchYearStr) : undefined;

    const filters = { college, department, batchYear };
    const admin = getSupabaseAdmin();
    const dashboard = await getUniversityDashboard(filters, admin);

    return NextResponse.json(dashboard);
  } catch (err: any) {
    console.error('[University Dashboard API Exception]:', err?.message);
    return NextResponse.json(
      {
        placementStats: {
          total_students: 0,
          placement_ready: 0,
          ats_qualified: 0,
          avg_ats: 0,
          avg_trust: 0,
          avg_dna: 0,
          engaged_students: 0,
        },
        topStudents: [],
        deptStats: [],
        dataAvailable: { students: false, departments: false },
        error: err?.message,
      },
      { status: 500 }
    );
  }
}
