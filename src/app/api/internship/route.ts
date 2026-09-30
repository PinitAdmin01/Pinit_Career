import { NextRequest, NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';
import { taskToClient, enrollmentToClient } from '@/lib/internships/toClient';
import type { InternshipEnrollmentRow, InternshipTaskRow } from '@/lib/internships/types';

const fail = (status: number, error: string, message: string) =>
  NextResponse.json({ ok: false, error, message }, { status });

export async function GET(req: NextRequest) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;
    const userId = gated.user.id;

    const { searchParams } = new URL(req.url);
    const crashEnrollmentId = searchParams.get('crashEnrollmentId') || searchParams.get('enrollmentId') || '';

    const admin = getSupabaseAdmin();

    let query = admin
      .from('internship_enrollments')
      .select('*')
      .eq('student_id', userId)
      .order('created_at', { ascending: false });

    if (crashEnrollmentId) {
      query = query.eq('crash_enrollment_id', crashEnrollmentId);
    }

    const { data: enrollment, error: enrErr } = await query.limit(1).maybeSingle();

    if (enrErr) {
      return fail(500, 'LOOKUP_FAILED', 'Could not fetch your internship enrollment.');
    }

    if (!enrollment) {
      return NextResponse.json({
        ok: true,
        enrollment: null,
        tasks: [],
      });
    }

    // Explicitly query ONLY client-safe columns (never select * and never fetch hidden fields)
    const { data: tasks, error: tasksErr } = await admin
      .from('internship_tasks')
      .select(
        'id, internship_enrollment_id, seq, week, kind, language, title, brief, starter_code, visible_tests, sql_setup, skills, status, attempts, passed_at, created_at'
      )
      .eq('internship_enrollment_id', (enrollment as { id: string }).id)
      .order('seq', { ascending: true });

    if (tasksErr) {
      return fail(500, 'TASK_LOOKUP_FAILED', 'Could not load your internship tickets.');
    }

    const clientEnrollment = enrollmentToClient(enrollment as InternshipEnrollmentRow);
    const clientTasks = ((tasks as unknown as InternshipTaskRow[]) || []).map(taskToClient);

    return NextResponse.json({
      ok: true,
      enrollment: clientEnrollment,
      tasks: clientTasks,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return fail(500, 'SERVER_ERROR', message);
  }
}
