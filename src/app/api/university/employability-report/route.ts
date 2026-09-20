import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';
import { getEmployabilityReport } from '@/lib/university/analytics';

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
    const report = await getEmployabilityReport(filters, admin);

    return NextResponse.json(report);
  } catch (err: any) {
    console.error('[University Employability API Exception]:', err?.message);
    return NextResponse.json({ report: null, error: err?.message }, { status: 500 });
  }
}
