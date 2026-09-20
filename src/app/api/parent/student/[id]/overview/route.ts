import { NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;

    const callerId = gated.user!.id;
    const targetStudentId = params.id;
    const admin = getSupabaseAdmin();

    // 1. Check authorization: Is caller admin, self, or linked parent?
    const { data: callerProfile } = await admin
      .from('users')
      .select('role, onboarding_answers')
      .eq('id', callerId)
      .maybeSingle();

    const role = callerProfile?.role || 'student';
    const isSelf = callerId === targetStudentId;
    const isAdmin = role === 'admin' || role === 'superadmin';

    let isLinkedParent = false;
    if (role === 'parent') {
      // Check parent_student_links table
      const { data: link } = await admin
        .from('parent_student_links')
        .select('id')
        .eq('parent_id', callerId)
        .eq('student_id', targetStudentId)
        .maybeSingle();

      if (link) {
        isLinkedParent = true;
      } else {
        // Fallback: check legacy onboarding_answers.linked_students
        const linkedArr = (callerProfile?.onboarding_answers as any)?.linked_students || [];
        if (Array.isArray(linkedArr) && linkedArr.includes(targetStudentId)) {
          isLinkedParent = true;
        }
      }
    }

    if (!isSelf && !isAdmin && !isLinkedParent) {
      return NextResponse.json(
        { ok: false, error: 'FORBIDDEN', message: 'Parent or administrator access required for this student.' },
        { status: 403 }
      );
    }

    // 2. Query student profile with service key
    const { data: student, error: studentErr } = await admin
      .from('users')
      .select('id, display_name, username, email, target_role, ats_score, trust_score, career_dna_score, mission_streak, career_readiness, completed_quests, onboarding_answers, register_number')
      .eq('id', targetStudentId)
      .maybeSingle();

    if (studentErr || !student) {
      return NextResponse.json(
        { ok: false, error: 'STUDENT_NOT_FOUND', message: 'Student profile not found.' },
        { status: 404 }
      );
    }

    const ob = (student.onboarding_answers as Record<string, any>) || {};

    // Authentic scores - NO fabricated defaults (72/75/68)
    const atsScore = typeof student.ats_score === 'number' ? student.ats_score : 0;
    const trustScore = typeof student.trust_score === 'number' ? student.trust_score : 0;
    const careerDnaScore = typeof student.career_dna_score === 'number' ? student.career_dna_score : 0;
    const missionStreak = typeof student.mission_streak === 'number' ? student.mission_streak : 0;
    const careerReadiness = typeof student.career_readiness === 'number' && student.career_readiness > 0
      ? student.career_readiness
      : (atsScore > 0 || trustScore > 0 ? Math.round((atsScore + trustScore) / 2) : 0);

    // 3. Query authentic recent exams from campus_exam_results
    let recentExams: Array<{ exam_name: string; pct: string; score: number; totalMarks: number }> = [];
    try {
      const { data: examsData } = await admin
        .from('campus_exam_results')
        .select('exam_id, score, total_marks, graded_at')
        .eq('student_id', targetStudentId)
        .order('graded_at', { ascending: false })
        .limit(10);

      if (Array.isArray(examsData) && examsData.length > 0) {
        recentExams = examsData.map((e: any) => ({
          exam_name: e.exam_id,
          pct: e.total_marks > 0 ? `${Math.round((e.score / e.total_marks) * 100)}%` : `${e.score}%`,
          score: Number(e.score),
          totalMarks: Number(e.total_marks),
        }));
      }
    } catch {}

    // 4. Mission summary
    const missionSummary = Array.isArray(student.completed_quests) ? student.completed_quests : [];

    // 5. Authentic institutional finance dues
    let finance: { dues: number; waiver: number; fine: number; installments: any[] } = {
      dues: 0,
      waiver: 0,
      fine: 0,
      installments: [],
    };
    try {
      const { data: duesData } = await admin
        .from('finance_dues')
        .select('*')
        .eq('student_id', targetStudentId)
        .maybeSingle();

      if (duesData) {
        finance = {
          dues: Number(duesData.total_term_fees || 0),
          waiver: Number(duesData.scholarship_waiver || 0),
          fine: Number(duesData.fine_levied || 0),
          installments: Array.isArray(duesData.installments) ? duesData.installments : [],
        };
      }
    } catch {}

    // 6. Notifications and advisories
    let notifications: any[] = [];
    try {
      const { data: notifData } = await admin
        .from('notifications')
        .select('id, title, message, type, created_at, read')
        .eq('user_id', targetStudentId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (Array.isArray(notifData)) {
        notifications = notifData;
      }
    } catch {}

    return NextResponse.json({
      ok: true,
      profile: {
        id: student.id,
        displayName: student.display_name || student.username || 'Student',
        email: student.email || '',
        registerNumber: student.register_number || `STD-${student.id.substring(0, 6).toUpperCase()}`,
        rollNo: student.register_number || ob.rollNo || ob.roll_no || `CS-2024-${student.id.substring(0, 4).toUpperCase()}`,
        department: ob.department || ob.dept || 'Computer Science & Engineering',
        semester: ob.semester || 'Semester 4',
        batch: ob.batch || 'Batch of 2026',
        emergencyContact: ob.emergencyContact || ob.parentPhone || ob.phone || 'Not Specified',
        parentDetails: {
          fatherName: ob.fatherName || ob.father_name || '',
          motherName: ob.motherName || ob.mother_name || '',
          parentEmail: ob.parentEmail || ob.parent_email || '',
        },
        career_track: student.target_role || ob.targetRole || 'Software Engineer',
        ats_score: atsScore,
        trust_score: trustScore,
        career_dna_score: careerDnaScore,
        mission_streak: missionStreak,
        career_readiness: careerReadiness,
      },
      recentExams,
      missionSummary,
      finance,
      notifications,
    });
  } catch (err: any) {
    console.error('[Parent Student Overview Exception]:', err?.message);
    return NextResponse.json({ ok: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}
