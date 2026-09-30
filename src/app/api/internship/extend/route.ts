import { NextRequest, NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';
import { checkRateLimit } from '@/lib/server/rateLimit';
import type { InternshipEnrollmentRow } from '@/lib/internships/types';

const fail = (status: number, error: string, message: string) =>
  NextResponse.json({ ok: false, error, message }, { status });

export async function POST(req: NextRequest) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;
    const userId = gated.user.id;

    // Rate limit
    const rl = checkRateLimit(`internship_extend_${userId}`, {
      limit: 5,
      windowMs: 60 * 1000,
    });
    if (!rl.allowed) {
      return fail(
        429,
        'RATE_LIMIT',
        `Extension rate limit reached. Please wait ${rl.resetSec}s before trying again.`
      );
    }

    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    const enrollmentId = typeof body.enrollmentId === 'string' ? body.enrollmentId.trim() : '';

    const admin = getSupabaseAdmin();

    let query = admin
      .from('internship_enrollments')
      .select('id, student_id, status, due_at, extended')
      .eq('student_id', userId);

    if (enrollmentId) {
      query = query.eq('id', enrollmentId);
    } else {
      query = query.eq('status', 'active').order('created_at', { ascending: false }).limit(1);
    }

    const { data: rawEnrollment, error: enrollErr } = await query.maybeSingle();

    if (enrollErr || !rawEnrollment) {
      return fail(404, 'ENROLLMENT_NOT_FOUND', 'Active internship enrollment record not found.');
    }
    const enrollment = rawEnrollment as unknown as Pick<
      InternshipEnrollmentRow,
      'id' | 'student_id' | 'status' | 'due_at' | 'extended'
    >;

    // 1. Only while active
    if (enrollment.status !== 'active') {
      return fail(
        400,
        'NOT_ACTIVE',
        `Only active internships can be extended (current status: ${enrollment.status}).`
      );
    }

    // 2. Extend once
    if (enrollment.extended) {
      return fail(
        400,
        'ALREADY_EXTENDED',
        'This internship has already received its one allowed 7-day extension.'
      );
    }

    // 3. Not already past due_at
    const now = new Date();
    if (enrollment.due_at && now.getTime() > new Date(enrollment.due_at).getTime()) {
      await admin
        .from('internship_enrollments')
        .update({ status: 'expired' })
        .eq('id', enrollment.id);

      return fail(
        400,
        'INTERNSHIP_EXPIRED',
        'Your deadline has already passed. Extensions must be requested before expiration.'
      );
    }

    // 4. Add +7 days to current due_at
    const baseDate = enrollment.due_at ? new Date(enrollment.due_at) : now;
    const newDueDate = new Date(baseDate.getTime() + 7 * 24 * 60 * 60 * 1000);
    const newDueIso = newDueDate.toISOString();

    await admin
      .from('internship_enrollments')
      .update({
        due_at: newDueIso,
        extended: true,
        updated_at: now.toISOString(),
      })
      .eq('id', enrollment.id);

    return NextResponse.json({
      ok: true,
      extended: true,
      dueAt: newDueIso,
      message: 'Your internship deadline has been extended by 7 days.',
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return fail(500, 'EXTENSION_ERROR', message);
  }
}
