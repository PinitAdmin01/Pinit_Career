import { NextRequest, NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';
import { opportunityToClient, applicationToClient } from '@/lib/internships/toClient';

const fail = (status: number, error: string, message: string) =>
  NextResponse.json({ ok: false, error, message }, { status });

/**
 * GET /api/internship/opportunities
 * Lists open opportunities filtered to the student's current tier.
 */
export async function GET(req: NextRequest) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;
    const user = gated.user;

    const admin = getSupabaseAdmin();

    // Get the student's active internship enrollment to determine their tier
    const { data: enrollment } = await admin
      .from('internship_enrollments')
      .select('id, tier')
      .eq('student_id', user.id)
      .in('status', ['active', 'generating'])
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    const studentTier = enrollment?.tier ?? 't1_job_sim';

    // Tier ordering for min_tier filtering
    const tierOrder: Record<string, number> = {
      t1_job_sim: 1,
      t2_virtual_team: 2,
      t3_project: 3,
      t4_industry: 4,
      t5_fellowship: 5,
    };
    const studentLevel = tierOrder[studentTier] ?? 1;

    // Fetch open opportunities where student's tier >= min_tier
    const { data: opportunities, error } = await admin
      .from('internship_opportunities')
      .select('*')
      .eq('status', 'open')
      .order('created_at', { ascending: false });

    if (error) return fail(500, 'QUERY_FAILED', error.message);

    const filtered = (opportunities || []).filter((opp) => {
      const minLevel = tierOrder[opp.min_tier] ?? 1;
      return studentLevel >= minLevel;
    });

    // Also fetch the student's existing applications
    const { data: apps } = await admin
      .from('internship_applications')
      .select('*')
      .eq('student_id', user.id);

    return NextResponse.json({
      ok: true,
      opportunities: filtered.map(opportunityToClient),
      applications: (apps || []).map(applicationToClient),
      studentTier,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return fail(500, 'SERVER_ERROR', message);
  }
}
