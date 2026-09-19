import { NextResponse } from 'next/server';
import { requireParentUserFromRequest } from '@/lib/server/requireAuth';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';

export async function GET(req: Request) {
  try {
    const gated = await requireParentUserFromRequest(req);
    if (gated.error) return gated.error;

    const parentId = gated.user!.id;
    const admin = getSupabaseAdmin();

    // 1. Query links from parent_student_links table
    let studentIds: string[] = [];
    try {
      const { data: linkRows } = await admin
        .from('parent_student_links')
        .select('student_id')
        .eq('parent_id', parentId);
      if (Array.isArray(linkRows)) {
        studentIds = linkRows.map((r: any) => r.student_id);
      }
    } catch {}

    // 2. Also check parent's onboarding_answers.linked_students for backward compatibility
    const { data: parentProfile } = await admin
      .from('users')
      .select('onboarding_answers')
      .eq('id', parentId)
      .maybeSingle();

    const legacyLinked = (parentProfile?.onboarding_answers as any)?.linked_students || [];
    if (Array.isArray(legacyLinked)) {
      for (const id of legacyLinked) {
        if (id && !studentIds.includes(id)) {
          studentIds.push(id);
        }
      }
    }

    if (studentIds.length === 0) {
      return NextResponse.json({ ok: true, students: [] });
    }

    // 3. Query genuine student user records
    const { data: studentsData, error: studentsErr } = await admin
      .from('users')
      .select('id, display_name, username, email, register_number, ats_score, trust_score, career_dna_score, mission_streak, career_readiness, target_role')
      .in('id', studentIds);

    if (studentsErr) {
      console.warn('[Parent Students Route] Query error:', studentsErr.message);
      return NextResponse.json({ ok: true, students: [] });
    }

    const students = (studentsData || []).map((u: any) => ({
      id: u.id,
      display_name: u.display_name || u.username || 'Student',
      register_number: u.register_number || u.id.slice(0, 8).toUpperCase(),
      email: u.email || '',
      dept: u.target_role || 'Computer Science',
      ats_score: typeof u.ats_score === 'number' ? u.ats_score : 0,
      trust_score: typeof u.trust_score === 'number' ? u.trust_score : 0,
      career_dna_score: typeof u.career_dna_score === 'number' ? u.career_dna_score : 0,
      mission_streak: typeof u.mission_streak === 'number' ? u.mission_streak : 0,
      career_readiness: typeof u.career_readiness === 'number' ? u.career_readiness : 0,
    }));

    return NextResponse.json({ ok: true, students });
  } catch (err: any) {
    console.error('[Parent Students Exception]:', err?.message);
    return NextResponse.json({ ok: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}
