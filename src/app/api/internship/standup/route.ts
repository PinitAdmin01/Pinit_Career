import { NextRequest, NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';
import { countStandupWords } from '@/lib/internships/sprints';

const fail = (status: number, error: string, message: string) =>
  NextResponse.json({ ok: false, error, message }, { status });

export async function POST(req: NextRequest) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;
    const userId = gated.user.id;

    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    const week = Number(body.week || 1);
    const done = typeof body.done === 'string' ? body.done.trim() : '';
    const next = typeof body.next === 'string' ? body.next.trim() : '';
    const blockers = typeof body.blockers === 'string' ? body.blockers.trim() : '';

    if (week < 1 || week > 4) {
      return fail(400, 'INVALID_WEEK', 'Sprint week must be between 1 and 4.');
    }

    if (!done || !next) {
      return fail(
        400,
        'FIELDS_REQUIRED',
        'Both "done" (completed items) and "next" (upcoming items) are required.'
      );
    }

    // 1. Verify word count (FR-T2-6: 30–200 words)
    const wordCount = countStandupWords(done, next, blockers);
    if (wordCount < 30) {
      return fail(
        400,
        'STANDUP_TOO_SHORT',
        `Weekly stand-up is too brief (${wordCount} words). Please write at least 30 words.`
      );
    }

    if (wordCount > 300) {
      return fail(
        400,
        'STANDUP_TOO_LONG',
        `Weekly stand-up is too long (${wordCount} words). Please keep under 250 words.`
      );
    }

    const admin = getSupabaseAdmin();

    // 2. Find active internship enrollment for user
    const { data: enrollment, error: enrErr } = await admin
      .from('internship_enrollments')
      .select('id')
      .eq('student_id', userId)
      .in('status', ['generating', 'active'])
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (enrErr || !enrollment) {
      return fail(
        404,
        'NO_ENROLLMENT',
        'No active internship enrollment found to record stand-up.'
      );
    }

    // 3. Insert stand-up record
    const { data: inserted, error: insertErr } = await admin
      .from('internship_standups')
      .insert({
        internship_enrollment_id: enrollment.id,
        week,
        done,
        next,
        blockers,
      })
      .select('id, internship_enrollment_id, week, done, next, blockers, created_at')
      .single();

    if (insertErr || !inserted) {
      return fail(500, 'SAVE_FAILED', 'Could not record your weekly stand-up.');
    }

    return NextResponse.json({
      ok: true,
      standup: inserted,
      wordCount,
      message: 'Weekly stand-up recorded successfully.',
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return fail(500, 'SERVER_ERROR', message);
  }
}
