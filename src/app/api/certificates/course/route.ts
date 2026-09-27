import { NextRequest, NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';
import { loadStudentCourse, trainingIncomplete } from '@/lib/server/studentCourse';
import { nextCapstoneSprint, type CapstoneMilestones } from '@/lib/courses/capstoneSprints';
import { signRoadmapCertificate } from '@/lib/certificates/roadmapCertificate';
import { COURSE_CERTIFICATE_KIND, newCourseCertificateId } from '@/lib/certificates/courseCertificate';

interface CertificateRow {
  id: string;
  title: string;
  role: string | null;
  course_id: string | null;
  project_name: string | null;
  interview_score: number | null;
  issued_at: string;
}

const COLUMNS = 'id, title, role, course_id, project_name, interview_score, issued_at';

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
 * Issues the capstone project certificate of the student's certificate course, once the server
 * has every course lesson done and all four capstone sprints approved (only the server records
 * them: /api/quests/capstone). One certificate per student per course; asking again returns it.
 * The certificate id is also recorded on the enrollment (certificates_issued.projectCertHash).
 */
export async function POST(req: NextRequest) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;
    const studentId = gated.user.id;

    const body = (await req.json().catch(() => ({}))) as { enrollmentId?: unknown };
    const enrollmentId = typeof body.enrollmentId === 'string' ? body.enrollmentId : '';
    if (!enrollmentId) return fail(400, 'ENROLLMENT_REQUIRED', 'Which course is this certificate for?');

    const admin = getSupabaseAdmin();
    const course = await loadStudentCourse(admin, studentId, enrollmentId);
    if (!course.ok) return fail(course.status, course.error, course.message);
    const { enrollment, plan } = course;
    if (trainingIncomplete(course)) {
      return fail(409, 'TRAINING_NOT_COMPLETE', `Finish every lesson of your course first (${course.lessonsMissing} left).`);
    }
    const milestones = (enrollment.milestoneProgress || {}) as CapstoneMilestones;
    const pending = nextCapstoneSprint(milestones);
    if (pending !== null) return fail(409, 'CAPSTONE_NOT_COMPLETE', `Complete capstone Sprint ${pending} first.`);

    const recordOnEnrollment = async (id: string, issuedAt: string) => {
      if (enrollment.certificatesIssued?.projectCertHash === id) return enrollment.certificatesIssued;
      const certificatesIssued = { ...(enrollment.certificatesIssued || {}), projectCertHash: id, issuedAt };
      const { error } = await admin
        .from('user_crash_enrollments')
        .update({ certificates_issued: certificatesIssued })
        .eq('enrollment_id', enrollmentId)
        .eq('user_id', studentId);
      if (error) console.error('[certificates/course] could not record the certificate on the enrollment:', error.message);
      return certificatesIssued;
    };
    const respond = async (row: CertificateRow) => {
      const certificatesIssued = await recordOnEnrollment(row.id, row.issued_at);
      return NextResponse.json({ ok: true, certificate: toClient(row), enrollment: { ...enrollment, certificatesIssued } });
    };
    const findExisting = () => admin
      .from('issued_certificates')
      .select(COLUMNS)
      .eq('student_id', studentId)
      .eq('kind', COURSE_CERTIFICATE_KIND)
      .eq('course_id', plan.id)
      .maybeSingle();

    const existing = await findExisting();
    if (existing.data) return respond(existing.data as CertificateRow);

    const id = newCourseCertificateId();
    const issuedAt = new Date().toISOString();
    const score = typeof milestones.sprint4DefenseScore === 'number' ? Math.round(milestones.sprint4DefenseScore) : 0;
    const row = {
      id,
      student_id: studentId,
      kind: COURSE_CERTIFICATE_KIND,
      title: `${plan.title}: Capstone Project Certificate`,
      role: plan.targetRole || null,
      course_id: plan.id,
      project_id: enrollment.enrollmentId,
      project_name: plan.flagshipBuildByTrack?.[enrollment.track]?.title || 'Capstone Project',
      interview_score: score,
      interview_verdict: milestones.sprint4Verdict || null,
      issued_at: issuedAt,
      signature: signRoadmapCertificate({ id, studentId, courseId: plan.id, projectId: enrollment.enrollmentId, interviewScore: score, issuedAt }),
    };
    const { error: insertErr } = await admin.from('issued_certificates').insert(row);
    if (insertErr) {
      // A parallel request issued it first: return that one.
      const again = await findExisting();
      if (again.data) return respond(again.data as CertificateRow);
      console.error('[certificates/course] insert failed:', insertErr.message);
      return fail(500, 'ISSUE_FAILED', 'Could not issue the certificate. Please try again.');
    }
    return respond(row);
  } catch (err: unknown) {
    console.error('[certificates/course] error:', err);
    return fail(500, 'ISSUE_FAILED', 'Could not issue the certificate. Please try again.');
  }
}
