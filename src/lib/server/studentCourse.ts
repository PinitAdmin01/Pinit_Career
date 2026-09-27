import type { SupabaseClient } from '@supabase/supabase-js';
import { toCourseEnrollment, type CourseEnrollment } from '@/lib/server/courseEnrollments';
import { COURSES_REGISTRY } from '@/lib/data/coursesData';
import { getCrashPlanById, type CrashPlan } from '@/lib/data/crashPlansData';
import { getCrashCourseCurriculum } from '@/lib/courses/crashCourseProgress';

/**
 * A student's certificate course as the server sees it: their own active enrollment, its plan,
 * and how many of the course's lessons are still missing from users.completed_quests (which only
 * the server writes). Shared by the capstone and course-certificate routes.
 */
export type StudentCourse =
  | {
      ok: true;
      enrollment: CourseEnrollment;
      plan: CrashPlan;
      /** The row's updated_at, for compare-and-swap updates. */
      updatedAt: string | null;
      lessonsTotal: number;
      lessonsMissing: number;
      displayName: string | null;
    }
  | { ok: false; status: number; error: string; message: string };

export async function loadStudentCourse(admin: SupabaseClient, userId: string, enrollmentId: string): Promise<StudentCourse> {
  const { data: row, error: rowErr } = await admin
    .from('user_crash_enrollments')
    .select('*')
    .eq('enrollment_id', enrollmentId)
    .eq('user_id', userId)
    .eq('status', 'active')
    .maybeSingle();
  if (rowErr) return { ok: false, status: 503, error: 'ENROLLMENT_LOOKUP_FAILED', message: 'Could not load your course. Please try again.' };
  if (!row) return { ok: false, status: 404, error: 'ENROLLMENT_NOT_FOUND', message: 'No active course enrollment was found.' };
  const enrollment = toCourseEnrollment(row as Parameters<typeof toCourseEnrollment>[0]);

  const plan = getCrashPlanById(enrollment.planId);
  if (!plan) return { ok: false, status: 409, error: 'PLAN_UNKNOWN', message: 'This course is no longer available.' };

  const { data: user, error: userErr } = await admin
    .from('users')
    .select('completed_quests, display_name')
    .eq('id', userId)
    .maybeSingle();
  if (userErr || !user) return { ok: false, status: 503, error: 'PROFILE_UNAVAILABLE', message: 'Could not load your progress. Please try again.' };

  const done = new Set<string>(Array.isArray(user.completed_quests) ? (user.completed_quests as string[]) : []);
  const lessons = getCrashCourseCurriculum(plan, enrollment.track, COURSES_REGISTRY);
  return {
    ok: true,
    enrollment,
    plan,
    updatedAt: typeof (row as { updated_at?: unknown }).updated_at === 'string' ? (row as { updated_at: string }).updated_at : null,
    lessonsTotal: lessons.length,
    lessonsMissing: lessons.filter((l) => !done.has(l.questId)).length,
    displayName: typeof user.display_name === 'string' ? user.display_name : null,
  };
}

export const trainingIncomplete = (course: Extract<StudentCourse, { ok: true }>) =>
  course.lessonsTotal === 0 || course.lessonsMissing > 0;
