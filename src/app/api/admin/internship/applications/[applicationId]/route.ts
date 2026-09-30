import { NextRequest, NextResponse } from 'next/server';
import { requireAdminUserFromRequest } from '@/lib/server/requireAuth';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';
import { applicationToClient } from '@/lib/internships/toClient';
import { z } from 'zod';

const fail = (status: number, error: string, message: string) =>
  NextResponse.json({ ok: false, error, message }, { status });

const DecisionSchema = z.object({
  status: z.enum(['shortlisted', 'accepted', 'rejected']),
});

/**
 * PATCH /api/admin/internship/applications/[applicationId]
 * Admin updates an application status (shortlist, accept, reject).
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { applicationId: string } }
) {
  try {
    const gated = await requireAdminUserFromRequest(req);
    if (gated.error) return gated.error;

    const appId = params.applicationId;
    if (!appId) return fail(400, 'ID_REQUIRED', 'Application ID is required.');

    const body = await req.json().catch(() => ({}));
    const parsed = DecisionSchema.safeParse(body);
    if (!parsed.success) {
      return fail(400, 'VALIDATION_ERROR', 'Must provide status: shortlisted | accepted | rejected.');
    }

    const admin = getSupabaseAdmin();
    const { data, error } = await admin
      .from('internship_applications')
      .update({ status: parsed.data.status })
      .eq('id', appId)
      .select()
      .single();

    if (error || !data) {
      return fail(404, 'NOT_FOUND', 'Application not found.');
    }

    return NextResponse.json({
      ok: true,
      application: applicationToClient(data),
      message: `Application status updated to "${parsed.data.status}".`,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return fail(500, 'SERVER_ERROR', message);
  }
}
