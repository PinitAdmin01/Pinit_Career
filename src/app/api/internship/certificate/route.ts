import { NextRequest, NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';
import { signRoadmapCertificate } from '@/lib/certificates/roadmapCertificate';
import {
  INTERNSHIP_CERTIFICATE_KIND,
  newInternshipCertificateId,
  isInternshipComplete,
  getInternshipHonestyLabel,
} from '@/lib/certificates/internshipCertificate';
import { enrollmentToClient } from '@/lib/internships/toClient';
import type { InternshipEnrollmentRow, InternshipTaskRow } from '@/lib/internships/types';

interface CertificateRow {
  id: string;
  title: string;
  role: string | null;
  course_id: string | null;
  project_id: string | null;
  project_name: string | null;
  interview_score: number | null;
  issued_at: string;
}

const toClientCert = (row: CertificateRow) => ({
  id: row.id,
  title: row.title,
  role: row.role,
  courseId: row.course_id,
  projectName: row.project_name,
  interviewScore: row.interview_score,
  issuedAt: row.issued_at,
  verifyPath: `/verify/${encodeURIComponent(row.id)}`,
});

const fail = (status: number, error: string, message: string) =>
  NextResponse.json({ ok: false, error, message }, { status });

export async function POST(req: NextRequest) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;
    const studentId = gated.user.id;

    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    const enrollmentId = typeof body.enrollmentId === 'string' ? body.enrollmentId.trim() : '';

    const admin = getSupabaseAdmin();

    // 1. Load the internship enrollment
    let query = admin
      .from('internship_enrollments')
      .select('id, student_id, crash_enrollment_id, tier, track, status, due_at, company_profile, final_report, final_report_check, certificate_id')
      .eq('student_id', studentId);

    if (enrollmentId) {
      query = query.eq('id', enrollmentId);
    } else {
      query = query.in('status', ['active', 'completed']).order('created_at', { ascending: false }).limit(1);
    }

    const { data: rawEnrollment, error: enrollErr } = await query.maybeSingle();

    if (enrollErr || !rawEnrollment) {
      return fail(404, 'ENROLLMENT_NOT_FOUND', 'Active or completed internship enrollment not found.');
    }
    const enrollment = rawEnrollment as unknown as Pick<
      InternshipEnrollmentRow,
      | 'id'
      | 'student_id'
      | 'crash_enrollment_id'
      | 'tier'
      | 'track'
      | 'status'
      | 'due_at'
      | 'company_profile'
      | 'final_report'
      | 'final_report_check'
      | 'certificate_id'
    >;

    // 2. Load all tasks for this enrollment
    const { data: rawTasks, error: tasksErr } = await admin
      .from('internship_tasks')
      .select('id, seq, title, brief, status')
      .eq('internship_enrollment_id', enrollment.id)
      .order('seq', { ascending: true });

    if (tasksErr || !rawTasks) {
      return fail(500, 'TASKS_LOAD_FAILED', 'Could not load internship tasks for verification.');
    }
    const tasks = rawTasks as unknown as Array<
      Pick<InternshipTaskRow, 'id' | 'seq' | 'title' | 'brief' | 'status'>
    >;

    // 2b. If Tier 2, fetch team sprints
    let sprints: Array<{ status?: string | null }> = [];
    if (enrollment.tier === 't2_virtual_team') {
      const { data: member } = await admin
        .from('internship_team_members')
        .select('team_id')
        .eq('student_id', studentId)
        .limit(1)
        .maybeSingle();

      if (member?.team_id) {
        const { data: teamSprints } = await admin
          .from('internship_sprints')
          .select('id, number, status')
          .eq('team_id', member.team_id)
          .order('number', { ascending: true });
        sprints = teamSprints || [];
      } else {
        const { data: enrSprints } = await admin
          .from('internship_sprints')
          .select('id, number, status')
          .eq('internship_enrollment_id', enrollment.id)
          .order('number', { ascending: true });
        sprints = enrSprints || [];
      }
    }

    // 3. Verify that the internship is 100% complete
    if (!isInternshipComplete({ enrollment, tasks, sprints })) {
      if (enrollment.tier === 't2_virtual_team') {
        const passedTasks = tasks.filter((t) => t.status === 'passed').length;
        const approvedSprints = sprints.filter((s) => s.status === 'approved').length;
        const defensePassed = Boolean(
          (enrollment.final_report_check as { defenseResult?: { passed?: boolean } } | null)
            ?.defenseResult?.passed
        );
        return fail(
          409,
          'INTERNSHIP_NOT_COMPLETE',
          `Tier 2 virtual internship is not yet complete: ${passedTasks}/8 tasks passed, ${approvedSprints}/4 sprints approved, defense passed: ${defensePassed}.`
        );
      }

      const passedCount = tasks.filter((t) => t.status === 'passed').length;
      return fail(
        409,
        'INTERNSHIP_NOT_COMPLETE',
        `Internship requirements are not yet complete (${passedCount}/5 tickets passed, final report must be submitted and accepted).`
      );
    }

    const companyProfile = enrollment.company_profile as { name?: string } | null;
    const companyName = companyProfile?.name || 'Fictional Tech Company';
    const honestyMeta = getInternshipHonestyLabel(enrollment.tier, companyName);

    // 4. Update the user_crash_enrollments certificate hash record
    const recordOnCrashEnrollment = async (certId: string, issuedAt: string) => {
      const { data: crashEnrollment } = await admin
        .from('user_crash_enrollments')
        .select('enrollment_id, certificates_issued')
        .eq('enrollment_id', enrollment.crash_enrollment_id)
        .eq('user_id', studentId)
        .maybeSingle();

      const existingCertificates = (crashEnrollment?.certificates_issued || {}) as Record<string, unknown>;
      const updatedCertificates = {
        ...existingCertificates,
        internshipCertHash: certId,
        internshipIssuedAt: issuedAt,
      };

      await admin
        .from('user_crash_enrollments')
        .update({ certificates_issued: updatedCertificates })
        .eq('enrollment_id', enrollment.crash_enrollment_id)
        .eq('user_id', studentId);

      return updatedCertificates;
    };

    // 5. Check if certificate was already issued for this student & tier
    const { data: existingCert } = await admin
      .from('issued_certificates')
      .select('id, title, role, course_id, project_id, project_name, interview_score, issued_at')
      .eq('student_id', studentId)
      .eq('kind', INTERNSHIP_CERTIFICATE_KIND)
      .eq('course_id', enrollment.tier)
      .maybeSingle();

    if (existingCert) {
      const existing = existingCert as CertificateRow;
      await recordOnCrashEnrollment(existing.id, existing.issued_at);
      return NextResponse.json({
        ok: true,
        certificate: toClientCert(existing),
        enrollment: enrollmentToClient({
          ...enrollment,
          status: 'completed',
          certificate_id: existing.id,
        }),
      });
    }

    // 6. Issue new signed certificate
    const certId = newInternshipCertificateId();
    const issuedAt = new Date().toISOString();
    const signature = signRoadmapCertificate({
      id: certId,
      studentId,
      courseId: enrollment.tier,
      projectId: enrollment.id,
      interviewScore: 100,
      issuedAt,
    });

    const certRow = {
      id: certId,
      student_id: studentId,
      kind: INTERNSHIP_CERTIFICATE_KIND,
      title: honestyMeta.title,
      role: honestyMeta.role,
      course_id: enrollment.tier,
      project_id: enrollment.id,
      project_name: companyName,
      interview_score: 100,
      interview_verdict: 'Completed',
      issued_at: issuedAt,
      signature,
      revoked: false,
    };

    const { error: insertErr } = await admin.from('issued_certificates').insert(certRow);
    if (insertErr) {
      console.error('[internship/certificate] insert error:', insertErr.message);
      return fail(500, 'CERTIFICATE_INSERT_FAILED', 'Could not store issued internship certificate.');
    }

    // Update internship enrollment status to 'completed' and attach certificate_id
    await admin
      .from('internship_enrollments')
      .update({
        status: 'completed',
        completed_at: issuedAt,
        certificate_id: certId,
        updated_at: issuedAt,
      })
      .eq('id', enrollment.id);

    // Record on crash enrollment
    await recordOnCrashEnrollment(certId, issuedAt);

    return NextResponse.json({
      ok: true,
      certificate: toClientCert(certRow as CertificateRow),
      enrollment: enrollmentToClient({
        ...enrollment,
        status: 'completed',
        completed_at: issuedAt,
        certificate_id: certId,
      }),
      message: 'Congratulations! Your internship certificate has been issued.',
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return fail(500, 'CERTIFICATE_ISSUE_ERROR', message);
  }
}
