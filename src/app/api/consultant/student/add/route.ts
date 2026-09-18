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

    // 1. Check if user already exists in users table
    const { data: existingUser } = await admin
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (existingUser) {
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
    }

    if (!targetUid) {
      targetUid = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : '00000000-0000-0000-0000-' + Date.now().toString().padStart(12, '0');
    }

    // 3. Upsert genuine student profile into users table via service role
    const now = new Date().toISOString();
    await admin.from('users').upsert({
      id: targetUid,
      email,
      display_name: displayName,
      username: email.split('@')[0],
      phone: studentData.phone || null,
      role: 'student',
      target_country: studentData.targetCountry || 'USA',
      program_type: studentData.programType || 'Masters',
      target_universities: Array.isArray(studentData.targetUniversities) ? studentData.targetUniversities : [],
      study_abroad_status: 'onboarding',
      visa_status: 'not_started',
      tasks: [],
      documents: [],
      ats_score: 0,
      trust_score: 50,
      career_dna_score: 50,
      mission_streak: 0,
      created_at: now,
      updated_at: now,
    }, { onConflict: 'id' });

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
