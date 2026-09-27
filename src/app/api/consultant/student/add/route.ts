import { NextResponse } from 'next/server';
import { requireConsultantUserFromRequest } from '@/lib/server/requireAuth';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';

export async function POST(req: Request) {
  try {
    const gated = await requireConsultantUserFromRequest(req);
    if (gated.error) return gated.error;

    const consultantId = gated.user!.id;
    const admin = getSupabaseAdmin();

    const studentData = await req.json().catch(() => ({}));
    const email = studentData.email ? String(studentData.email).trim().toLowerCase() : `student_${Date.now()}@pinit.app`;
    const displayName = studentData.displayName || studentData.name || 'Student User';

    let targetUid = '';
    const now = new Date().toISOString();
    const studyAbroadFields = {
      phone: studentData.phone || null,
      target_country: studentData.targetCountry || 'USA',
      program_type: studentData.programType || 'Masters',
      target_universities: Array.isArray(studentData.targetUniversities) ? studentData.targetUniversities : [],
    };

    // 1. Check if user already exists in users table
    const { data: existingUser } = await admin
      .from('users')
      .select('id, role, study_abroad_status')
      .eq('email', email)
      .maybeSingle();

    if (existingUser) {
      // An existing account is only added to the pipeline, never overwritten: this route used to
      // upsert the whole profile (role 'student', scores reset), so "adding" an admin's email
      // turned that admin into a student.
      const role = String(existingUser.role || 'student');
      if (role !== 'student') {
        return NextResponse.json(
          { ok: false, error: 'NOT_A_STUDENT', message: 'That email belongs to a staff account, not a student.' },
          { status: 409 }
        );
      }
      const { error: joinErr } = await admin
        .from('users')
        .update({
          ...studyAbroadFields,
          study_abroad_status: existingUser.study_abroad_status || 'onboarding',
          updated_at: now,
        })
        .eq('id', existingUser.id);
      if (joinErr) {
        console.error('[Consultant Add Student] Could not add existing student:', joinErr.message);
        return NextResponse.json({ ok: false, error: 'SAVE_FAILED', message: 'Could not add the student. Please try again.' }, { status: 500 });
      }
      targetUid = existingUser.id;
    } else {
      // 2. Provision new user using authoritative server admin API
      // This completely prevents overwriting the consultant's own browser auth session!
      const randomPassword = 'PinIT_' + Math.random().toString(36).slice(-8) + '!' + Math.random().toString(36).slice(-8).toUpperCase();
      if (process.env.ALLOW_DEV_AUTH_BYPASS === 'true' && process.env.NODE_ENV !== 'production' && !process.env.SUPABASE_URL) {
        targetUid = 'stu_test_' + Date.now().toString(36);
      } else {
        try {
          const { data: createdAuthUser, error: createAuthErr } = await admin.auth.admin.createUser({
            email,
            password: randomPassword,
            email_confirm: true,
            user_metadata: {
              display_name: displayName,
              role: 'student',
            },
          });

          if (createdAuthUser?.user) {
            targetUid = createdAuthUser.user.id;
          } else if (createAuthErr) {
            console.warn('[Consultant Add Student] Admin createUser notice:', createAuthErr.message);
          }
        } catch (authExc: any) {
          console.warn('[Consultant Add Student] Admin auth exception:', authExc?.message);
        }
      }

      // No account could be created: stop (a profile without a sign-in account is unusable).
      if (!targetUid) {
        return NextResponse.json(
          { ok: false, error: 'ACCOUNT_CREATE_FAILED', message: 'The student account could not be created. Please try again.' },
          { status: 502 }
        );
      }

      // 3. New student: profile with the study-abroad fields (service role)
      const { error: profileErr } = await admin.from('users').upsert({
        id: targetUid,
        email,
        display_name: displayName,
        username: email.split('@')[0],
        role: 'student',
        ...studyAbroadFields,
        study_abroad_status: 'onboarding',
        visa_status: 'not_started',
        tasks: [],
        documents: [],
        created_at: now,
        updated_at: now,
      }, { onConflict: 'id' });
      if (profileErr) {
        console.error('[Consultant Add Student] Profile save failed:', profileErr.message);
        return NextResponse.json({ ok: false, error: 'SAVE_FAILED', message: 'The student account was created but its profile could not be saved.' }, { status: 500 });
      }
    }

    // 4. Record audit log
    try {
      await admin.from('audit_logs').insert({
        actor_id: consultantId,
        target_id: targetUid,
        action: 'consultant_add_student',
        meta: { studentEmail: email, studentName: displayName },
        created_at: now,
      });
    } catch {}

    return NextResponse.json({
      ok: true,
      message: 'Student account created and added to pipeline.',
      student: {
        id: targetUid,
        email,
        displayName,
      },
    });
  } catch (err: any) {
    console.error('[Consultant Add Student Exception]:', err?.message);
    return NextResponse.json({ ok: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}
