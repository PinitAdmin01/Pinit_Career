import { NextRequest, NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';
import { COURSES_REGISTRY } from '@/lib/data/coursesData';
import { verifyEvaluationSignature } from '@/lib/interview/evaluationSignature';
import { isCapstoneInterviewPassed } from '@/lib/interview/capstoneInterview';
import { getSavedCareerProjects } from '@/lib/projects/savedProjects';
import {
  ROADMAP_CERTIFICATE_KIND,
  newRoadmapCertificateId,
  signRoadmapCertificate,
  validateRoadmapForCertificate,
} from '@/lib/certificates/roadmapCertificate';

interface CertificateRow {
  id: string;
  title: string;
  role: string | null;
  course_id: string | null;
  project_name: string | null;
  interview_score: number | null;
  issued_at: string;
}

const toClient = (row: CertificateRow) => ({
  id: row.id,
  title: row.title,
  role: row.role,
  courseId: row.course_id,
  projectName: row.project_name,
  interviewScore: row.interview_score,
  issuedAt: row.issued_at,
  verifyPath: `/verify/${encodeURIComponent(row.id)}`,
});

const fail = (status: number, error: string, message: string) => NextResponse.json({ ok: false, error, message }, { status });

/**
 * Issues the roadmap journey certificate once the server has verified: the roadmap is complete
 * (server-recorded quests), the capstone project is a completed roadmap capstone, and the capstone
 * interview was passed with a result the server signed. One certificate per student per roadmap
 * course; asking again returns the same certificate.
 */
export async function POST(req: NextRequest) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;
    const studentId = gated.user.id;

    const body = (await req.json().catch(() => ({}))) as { projectId?: unknown };
    const projectId = typeof body.projectId === 'string' ? body.projectId : '';
    if (!projectId) return fail(400, 'PROJECT_REQUIRED', 'Which capstone project is this certificate for?');

    const admin = getSupabaseAdmin();
    const { data: user, error: userErr } = await admin
      .from('users')
      .select('display_name, onboarding_answers, completed_quests')
      .eq('id', studentId)
      .maybeSingle();
    if (userErr || !user) return fail(500, 'PROFILE_UNAVAILABLE', 'Could not load your profile.');

    const answers = (user.onboarding_answers || {}) as Record<string, unknown>;
    const courseId = typeof answers.roadmap_completed_course === 'string' ? answers.roadmap_completed_course : '';
    if (!courseId) return fail(409, 'ROADMAP_NOT_COMPLETE', 'Finish every quest in your roadmap first.');

    const course = COURSES_REGISTRY.find((c) => c.id === courseId);
    const roadmap = validateRoadmapForCertificate({
      roadmapModules: answers.roadmap_modules,
      completedQuests: user.completed_quests,
      courseQuestIds: course ? course.quests.map((q) => q.id) : [],
    });
    if (!roadmap.ok) {
      const messages: Record<string, string> = {
        ROADMAP_NOT_VERIFIABLE: 'This roadmap cannot be verified for a certificate.',
        ROADMAP_NOT_IN_COURSE: 'Your roadmap contains quests that are not part of its course.',
        ROADMAP_TOO_SHORT: 'Your roadmap must cover at least half of its course.',
        ROADMAP_NOT_COMPLETE: `Finish every quest in your roadmap first (${roadmap.missing ?? 0} left).`,
      };
      return fail(409, roadmap.reason, messages[roadmap.reason]);
    }

    const project = getSavedCareerProjects(answers).find((p) => p.id === projectId);
    if (!project || project.origin !== 'roadmap' || project.status !== 'Completed') {
      return fail(409, 'CAPSTONE_NOT_COMPLETE', 'Complete and verify your roadmap capstone project first.');
    }
    const interview = project.capstoneInterview;
    if (!interview || !isCapstoneInterviewPassed(interview.verdict, interview.score)) {
      return fail(409, 'INTERVIEW_NOT_PASSED', 'Pass your capstone interview first.');
    }
    if (!verifyEvaluationSignature(studentId, interview.score, interview.verdict, interview.evaluationToken)) {
      return fail(403, 'INTERVIEW_NOT_VERIFIED', 'This interview result was not issued by PinIT.');
    }

    const existing = await admin
      .from('issued_certificates')
      .select('id, title, role, course_id, project_name, interview_score, issued_at')
      .eq('student_id', studentId)
      .eq('kind', ROADMAP_CERTIFICATE_KIND)
      .eq('course_id', courseId)
      .maybeSingle();
    if (existing.data) return NextResponse.json({ ok: true, certificate: toClient(existing.data as CertificateRow) });

    const role = typeof answers.role === 'string' && answers.role.trim() ? answers.role.trim() : null;
    const id = newRoadmapCertificateId();
    const issuedAt = new Date().toISOString();
    const row = {
      id,
      student_id: studentId,
      kind: ROADMAP_CERTIFICATE_KIND,
      title: `${course?.title || courseId} Roadmap: Capstone Certificate`,
      role,
      course_id: courseId,
      project_id: project.id,
      project_name: project.name,
      interview_score: Math.round(interview.score),
      interview_verdict: interview.verdict,
      issued_at: issuedAt,
      signature: signRoadmapCertificate({ id, studentId, courseId, projectId: project.id, interviewScore: interview.score, issuedAt }),
    };
    const { error: insertErr } = await admin.from('issued_certificates').insert(row);
    if (insertErr) {
      // A parallel request issued it first: return that one.
      const again = await admin
        .from('issued_certificates')
        .select('id, title, role, course_id, project_name, interview_score, issued_at')
        .eq('student_id', studentId)
        .eq('kind', ROADMAP_CERTIFICATE_KIND)
        .eq('course_id', courseId)
        .maybeSingle();
      if (again.data) return NextResponse.json({ ok: true, certificate: toClient(again.data as CertificateRow) });
      console.error('[certificates/roadmap] insert failed:', insertErr.message);
      return fail(500, 'ISSUE_FAILED', 'Could not issue the certificate. Please try again.');
    }

    return NextResponse.json({ ok: true, certificate: toClient(row) });
  } catch (err: unknown) {
    console.error('[certificates/roadmap] error:', err);
    return fail(500, 'ISSUE_FAILED', err instanceof Error ? err.message : 'Could not issue the certificate.');
  }
}
