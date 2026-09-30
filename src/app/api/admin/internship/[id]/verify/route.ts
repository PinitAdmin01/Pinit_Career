import { NextRequest, NextResponse } from 'next/server';
import { requireAdminUserFromRequest } from '@/lib/server/requireAuth';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';
import { newInternshipCertificateId } from '@/lib/certificates/internshipCertificate';
import { INTERNSHIP_TIERS } from '@/lib/internships/tiers';
import type { InternshipTier } from '@/lib/data/crashPlansData';

const fail = (status: number, error: string, message: string) =>
  NextResponse.json({ ok: false, error, message }, { status });

/**
 * POST /api/admin/internship/[id]/verify
 * Admin verifies a Tier 4–5 (or Tier 3) external/industry internship.
 * 1. Sets enrollment.status = 'completed', completed_at, certificate_id.
 * 2. Writes a verified row to public.internship_records.
 * 3. Returns the certificate ID and verified record.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const gated = await requireAdminUserFromRequest(req);
    if (gated.error) return gated.error;
    const adminUser = gated.user;

    const enrollmentId = params.id;
    if (!enrollmentId) return fail(400, 'ID_REQUIRED', 'Enrollment ID is required.');

    const admin = getSupabaseAdmin();

    // 1. Fetch enrollment
    const { data: enrollment, error: enrErr } = await admin
      .from('internship_enrollments')
      .select('*')
      .eq('id', enrollmentId)
      .maybeSingle();

    if (enrErr || !enrollment) {
      return fail(404, 'ENROLLMENT_NOT_FOUND', 'Internship enrollment not found.');
    }

    const tierKey = enrollment.tier as InternshipTier;
    const tierConfig = INTERNSHIP_TIERS[tierKey];
    if (!tierConfig) {
      return fail(400, 'INVALID_TIER', `Unknown tier "${enrollment.tier}".`);
    }

    const now = new Date();
    const nowIso = now.toISOString();
    const todayDate = now.toISOString().split('T')[0];
    const startDate = enrollment.started_at
      ? new Date(enrollment.started_at).toISOString().split('T')[0]
      : todayDate;

    const certId = enrollment.certificate_id || newInternshipCertificateId();

    // Extract company name and role title
    const companyProfile = (enrollment.company_profile as Record<string, unknown>) || {};
    const companyName = String(companyProfile.companyName || companyProfile.name || 'Partner Company');
    const roleTitle = tierConfig.name;

    // 2. Update enrollment status to completed
    const { data: updatedEnrollment, error: updateErr } = await admin
      .from('internship_enrollments')
      .update({
        status: 'completed',
        completed_at: nowIso,
        certificate_id: certId,
        updated_at: nowIso,
      })
      .eq('id', enrollmentId)
      .select()
      .single();

    if (updateErr) {
      return fail(500, 'UPDATE_FAILED', updateErr.message);
    }

    // 3. Write verified row to internship_records
    const { data: record, error: recErr } = await admin
      .from('internship_records')
      .insert({
        student_id: enrollment.student_id,
        company_name: companyName,
        role: roleTitle,
        start_date: startDate,
        end_date: todayDate,
        stipend: 0,
        status: 'completed',
        description: `Verified ${tierConfig.name} via PinIT Internship OS.`,
        verified: true,
        verified_by: adminUser.id,
        verified_at: nowIso,
      })
      .select()
      .single();

    if (recErr) {
      // If internship_records insert fails, log but don't fail completion
      console.error('Failed to write internship_records row:', recErr);
    }

    return NextResponse.json({
      ok: true,
      enrollment: updatedEnrollment,
      certificateId: certId,
      internshipRecord: record || null,
      message: `Successfully verified and completed ${tierConfig.name}.`,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return fail(500, 'SERVER_ERROR', message);
  }
}
