import { NextRequest, NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';
import { applicationToClient } from '@/lib/internships/toClient';

const fail = (status: number, error: string, message: string) =>
  NextResponse.json({ ok: false, error, message }, { status });

/**
 * POST /api/internship/opportunities/[id]/apply
 * Student applies to an opportunity.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;
    const user = gated.user;

    const opportunityId = params.id;
    if (!opportunityId) {
      return fail(400, 'ID_REQUIRED', 'Opportunity ID is required.');
    }

    const admin = getSupabaseAdmin();

    // 1. Verify opportunity is open
    const { data: opp } = await admin
      .from('internship_opportunities')
      .select('id, status, seats, min_tier')
      .eq('id', opportunityId)
      .maybeSingle();

    if (!opp) return fail(404, 'NOT_FOUND', 'Opportunity not found.');
    if (opp.status !== 'open') {
      return fail(400, 'NOT_OPEN', 'This opportunity is no longer accepting applications.');
    }

    // 2. Get active enrollment
    const { data: enrollment } = await admin
      .from('internship_enrollments')
      .select('id, tier')
      .eq('student_id', user.id)
      .in('status', ['active', 'generating'])
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!enrollment) {
      return fail(400, 'NO_ENROLLMENT', 'You do not have an active internship enrollment.');
    }

    // 3. Check tier eligibility
    const tierOrder: Record<string, number> = {
      t1_job_sim: 1, t2_virtual_team: 2, t3_project: 3,
      t4_industry: 4, t5_fellowship: 5,
    };
    if ((tierOrder[enrollment.tier] ?? 1) < (tierOrder[opp.min_tier] ?? 1)) {
      return fail(403, 'TIER_TOO_LOW', 'Your internship tier does not meet the minimum requirement.');
    }

    // 4. Check for existing application
    const { data: existing } = await admin
      .from('internship_applications')
      .select('id, status')
      .eq('opportunity_id', opportunityId)
      .eq('student_id', user.id)
      .maybeSingle();

    if (existing && existing.status !== 'withdrawn') {
      return fail(409, 'ALREADY_APPLIED', 'You have already applied to this opportunity.');
    }

    // 5. Check remaining seats
    const { count } = await admin
      .from('internship_applications')
      .select('*', { count: 'exact', head: true })
      .eq('opportunity_id', opportunityId)
      .in('status', ['applied', 'shortlisted', 'accepted']);

    if (count !== null && count >= opp.seats) {
      return fail(400, 'SEATS_FULL', 'No seats remaining for this opportunity.');
    }

    // 6. Create application
    const { data, error } = await admin
      .from('internship_applications')
      .insert({
        opportunity_id: opportunityId,
        student_id: user.id,
        internship_enrollment_id: enrollment.id,
        status: 'applied',
      })
      .select()
      .single();

    if (error) return fail(500, 'INSERT_FAILED', error.message);

    return NextResponse.json(
      { ok: true, application: applicationToClient(data) },
      { status: 201 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return fail(500, 'SERVER_ERROR', message);
  }
}

/**
 * DELETE /api/internship/opportunities/[id]/apply
 * Student withdraws their application.
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;
    const user = gated.user;

    const opportunityId = params.id;
    if (!opportunityId) return fail(400, 'ID_REQUIRED', 'Opportunity ID is required.');

    const admin = getSupabaseAdmin();
    const { data, error } = await admin
      .from('internship_applications')
      .update({ status: 'withdrawn' })
      .eq('opportunity_id', opportunityId)
      .eq('student_id', user.id)
      .neq('status', 'withdrawn')
      .select()
      .single();

    if (error || !data) {
      return fail(404, 'NO_APPLICATION', 'No active application found to withdraw.');
    }

    return NextResponse.json({ ok: true, application: applicationToClient(data) });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return fail(500, 'SERVER_ERROR', message);
  }
}
