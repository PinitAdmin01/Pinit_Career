import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';
import {
  SupervisorEvaluationSchema,
  hashToken,
  isTokenExpired,
} from '@/lib/internships/supervisorEval';

const fail = (status: number, error: string, message: string) =>
  NextResponse.json({ ok: false, error, message }, { status });

/**
 * GET /api/internship/supervisor/[token]
 * Shows the evaluation form (no login required). Validates token.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const rawToken = params.token;
    if (!rawToken || rawToken.length < 32) {
      return fail(400, 'INVALID_TOKEN', 'Invalid or missing evaluation token.');
    }

    const tokenHash = hashToken(rawToken);
    const admin = getSupabaseAdmin();

    const { data: evaluation } = await admin
      .from('internship_supervisor_evaluations')
      .select('id, supervisor_name, token_expires_at, submitted_at, internship_enrollment_id')
      .eq('token_hash', tokenHash)
      .maybeSingle();

    if (!evaluation) {
      return fail(404, 'TOKEN_NOT_FOUND', 'Evaluation not found. The link may be invalid.');
    }

    if (evaluation.submitted_at) {
      return fail(410, 'ALREADY_SUBMITTED', 'This evaluation has already been submitted.');
    }

    if (isTokenExpired(evaluation.token_expires_at)) {
      return fail(410, 'TOKEN_EXPIRED', 'This evaluation link has expired.');
    }

    // Get student info for context
    const { data: enrollment } = await admin
      .from('internship_enrollments')
      .select('id, tier, track')
      .eq('id', evaluation.internship_enrollment_id)
      .maybeSingle();

    return NextResponse.json({
      ok: true,
      evaluation: {
        id: evaluation.id,
        supervisorName: evaluation.supervisor_name,
        tier: enrollment?.tier,
        track: enrollment?.track,
      },
      ratingAreas: [
        { key: 'technicalSkills', label: 'Technical Skills', description: 'Quality of code, problem-solving, technical knowledge' },
        { key: 'communication', label: 'Communication', description: 'Verbal and written communication, clarity, responsiveness' },
        { key: 'initiative', label: 'Initiative & Ownership', description: 'Proactiveness, taking responsibility, independent work' },
        { key: 'professionalism', label: 'Professionalism', description: 'Punctuality, conduct, teamwork, work ethic' },
      ],
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return fail(500, 'SERVER_ERROR', message);
  }
}

/**
 * POST /api/internship/supervisor/[token]
 * Submits the evaluation (no login required).
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const rawToken = params.token;
    if (!rawToken || rawToken.length < 32) {
      return fail(400, 'INVALID_TOKEN', 'Invalid or missing evaluation token.');
    }

    const tokenHash = hashToken(rawToken);
    const admin = getSupabaseAdmin();

    // 1. Find evaluation by hash
    const { data: evaluation } = await admin
      .from('internship_supervisor_evaluations')
      .select('id, token_expires_at, submitted_at')
      .eq('token_hash', tokenHash)
      .maybeSingle();

    if (!evaluation) {
      return fail(404, 'TOKEN_NOT_FOUND', 'Evaluation not found.');
    }

    if (evaluation.submitted_at) {
      return fail(410, 'ALREADY_SUBMITTED', 'This evaluation has already been submitted.');
    }

    if (isTokenExpired(evaluation.token_expires_at)) {
      return fail(410, 'TOKEN_EXPIRED', 'This evaluation link has expired.');
    }

    // 2. Validate body
    const body = await req.json().catch(() => ({}));
    const parsed = SupervisorEvaluationSchema.safeParse(body);
    if (!parsed.success) {
      const issues = parsed.error.issues.map((i) => i.message).join('; ');
      return fail(400, 'VALIDATION_ERROR', issues);
    }

    // 3. Submit
    const { error } = await admin
      .from('internship_supervisor_evaluations')
      .update({
        ratings: parsed.data.ratings,
        comments: parsed.data.comments || null,
        submitted_at: new Date().toISOString(),
      })
      .eq('id', evaluation.id);

    if (error) return fail(500, 'UPDATE_FAILED', error.message);

    return NextResponse.json({
      ok: true,
      message: 'Thank you! Your evaluation has been submitted successfully.',
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return fail(500, 'SERVER_ERROR', message);
  }
}
