import { NextResponse } from 'next/server';
import { requireParentUserFromRequest } from '@/lib/server/requireAuth';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';

export async function POST(req: Request) {
  try {
    const gated = await requireParentUserFromRequest(req);
    if (gated.error) return gated.error;

    const parentId = gated.user!.id;
    const admin = getSupabaseAdmin();

    const body = await req.json().catch(() => ({}));
    const registerNumber = (body.registerNumber || body.register_number || '').trim();

    if (!registerNumber) {
      return NextResponse.json(
        { ok: false, error: 'INVALID_REGISTER', message: 'Register number is required.' },
        { status: 400 }
      );
    }

    // 1. Authoritative lookup by exact register_number using service role
    const { data: student, error: lookupErr } = await admin
      .from('users')
      .select('id, display_name, username, email, register_number')
      .eq('register_number', registerNumber)
      .maybeSingle();

    if (lookupErr || !student) {
      return NextResponse.json(
        { ok: false, error: 'STUDENT_NOT_FOUND', message: 'No student found with that exact register number.' },
        { status: 404 }
      );
    }

    // 2. Persist link in parent_student_links table
    const { error: linkInsertErr } = await admin
      .from('parent_student_links')
      .upsert({
        parent_id: parentId,
        student_id: student.id,
        status: 'approved',
        updated_at: new Date().toISOString(),
      }, { onConflict: 'parent_id,student_id' });

    if (linkInsertErr) {
      console.warn('[Parent Link Route] DB link insert notice:', linkInsertErr.message);
    }

    // 3. Update parent profile onboarding_answers.linked_students
    const { data: parentUser } = await admin
      .from('users')
      .select('onboarding_answers')
      .eq('id', parentId)
      .maybeSingle();

    if (parentUser) {
      const answers = (parentUser.onboarding_answers as any) || {};
      const currentLinks = Array.isArray(answers.linked_students) ? [...answers.linked_students] : [];
      if (!currentLinks.includes(student.id)) {
        currentLinks.push(student.id);
        await admin
          .from('users')
          .update({
            onboarding_answers: {
              ...answers,
              linked_students: currentLinks,
            },
          })
          .eq('id', parentId);
      }
    }

    // 4. Send real notification to student
    try {
      await admin.from('notifications').insert({
        user_id: student.id,
        sender_id: parentId,
        title: 'Parent Account Linked',
        message: 'A verified parent account has connected to your academic & career progress dashboard.',
        type: 'parent_link',
        is_read: false,
        read: false,
        created_at: new Date().toISOString(),
      });
    } catch (notifErr: any) {
      console.warn('[Parent Link Route] Notification insert notice:', notifErr?.message);
    }

    // 5. Add audit log entry
    try {
      await admin.from('audit_logs').insert({
        actor_id: parentId,
        target_id: student.id,
        action: 'parent_link_student',
        meta: { registerNumber, studentName: student.display_name || student.email },
        created_at: new Date().toISOString(),
      });
    } catch {}

    const studentName = student.display_name || student.username || student.email || 'student';
    return NextResponse.json({
      ok: true,
      message: `Successfully linked ${studentName} to Parent Portal!`,
      student: {
        id: student.id,
        displayName: studentName,
        registerNumber: student.register_number,
      },
    });
  } catch (err: any) {
    console.error('[Parent Link Exception]:', err?.message);
    return NextResponse.json({ ok: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}
