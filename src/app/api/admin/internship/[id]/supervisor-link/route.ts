import { NextRequest, NextResponse } from 'next/server';
import { requireAdminUserFromRequest } from '@/lib/server/requireAuth';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';
import {
  SupervisorLinkSchema,
  generateSupervisorToken,
  SUPERVISOR_TOKEN_EXPIRY_HOURS,
} from '@/lib/internships/supervisorEval';

const fail = (status: number, error: string, message: string) =>
  NextResponse.json({ ok: false, error, message }, { status });

/**
 * POST /api/admin/internship/[id]/supervisor-link
 * Creates a one-time supervisor evaluation link (NFR-SEC-4).
 * Returns the raw token URL (only shown once).
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const gated = await requireAdminUserFromRequest(req);
    if (gated.error) return gated.error;

    const enrollmentId = params.id;
    if (!enrollmentId) return fail(400, 'ID_REQUIRED', 'Enrollment ID is required.');

    const body = await req.json().catch(() => ({}));
    const parsed = SupervisorLinkSchema.safeParse(body);
    if (!parsed.success) {
      const issues = parsed.error.issues.map((i) => i.message).join('; ');
      return fail(400, 'VALIDATION_ERROR', issues);
    }

    const admin = getSupabaseAdmin();

    // Verify enrollment exists
    const { data: enrollment } = await admin
      .from('internship_enrollments')
      .select('id, tier')
      .eq('id', enrollmentId)
      .maybeSingle();

    if (!enrollment) {
      return fail(404, 'ENROLLMENT_NOT_FOUND', 'Internship enrollment not found.');
    }

    // Check no existing unexpired evaluation
    const { data: existing } = await admin
      .from('internship_supervisor_evaluations')
      .select('id, submitted_at, token_expires_at')
      .eq('internship_enrollment_id', enrollmentId)
      .is('submitted_at', null)
      .maybeSingle();

    if (existing) {
      const expires = new Date(existing.token_expires_at);
      if (expires.getTime() > Date.now()) {
        return fail(409, 'LINK_EXISTS', 'An active evaluation link already exists.');
      }
    }

    // Generate token
    const { token, hash } = generateSupervisorToken();
    const expiresAt = new Date(
      Date.now() + SUPERVISOR_TOKEN_EXPIRY_HOURS * 60 * 60 * 1000
    ).toISOString();

    const { error } = await admin
      .from('internship_supervisor_evaluations')
      .insert({
        internship_enrollment_id: enrollmentId,
        supervisor_name: parsed.data.supervisorName,
        supervisor_email: parsed.data.supervisorEmail,
        token_hash: hash,
        token_expires_at: expiresAt,
      });

    if (error) return fail(500, 'INSERT_FAILED', error.message);

    // Build the one-time URL (shown to admin only once)
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://pinit.in';
    const evaluationUrl = `${baseUrl}/api/internship/supervisor/${token}`;

    return NextResponse.json(
      {
        ok: true,
        evaluationUrl,
        expiresAt,
        message: 'Supervisor link created. Share this URL with the supervisor (shown only once).',
      },
      { status: 201 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return fail(500, 'SERVER_ERROR', message);
  }
}
