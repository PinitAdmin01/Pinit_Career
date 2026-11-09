import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireUserFromRequest } from '@/lib/server/requireAuth';

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const collegeName = typeof body.collegeName === 'string' ? body.collegeName.trim() : '';
    const degree = typeof body.degree === 'string' ? body.degree.trim() : 'Undergraduate';
    const department = typeof body.department === 'string' ? body.department.trim() : (typeof body.branch === 'string' ? body.branch.trim() : '');
    const rollNumber = typeof body.rollNumber === 'string' ? body.rollNumber.trim() : '';
    const graduationYear = typeof body.graduationYear === 'string' ? body.graduationYear.trim() : '2026';
    const studentName = typeof body.studentName === 'string' ? body.studentName.trim() : (typeof body.displayName === 'string' ? body.displayName.trim() : '');
    const pinitId = typeof body.pinitId === 'string' ? body.pinitId.trim() : '';

    if (!collegeName || collegeName.length < 2) {
      return NextResponse.json(
        { ok: false, error: 'BAD_REQUEST', message: 'Valid college name is required (min 2 characters).' },
        { status: 400 }
      );
    }

    // Try resolving authenticated user
    let userId: string | null = null;
    try {
      const gated = await requireUserFromRequest(req);
      if (!gated.error && gated.user?.id) {
        userId = gated.user.id;
      }
    } catch {}

    if (!userId) {
      const cookieUid = req.cookies.get('pinit_uid')?.value;
      userId = cookieUid || body.userId || body.studentId || null;
    }

    const admin = getAdminClient();

    // Fallback: search by email or rollNumber if userId is not resolved yet
    if (!userId && admin && (body.email || rollNumber)) {
      try {
        if (body.email) {
          const { data: matched } = await admin.from('users').select('id').eq('email', body.email).maybeSingle();
          if (matched?.id) userId = matched.id;
        }
        if (!userId && rollNumber) {
          const { data: matched } = await admin.from('users').select('id').or(`register_number.eq.${rollNumber},roll_number.eq.${rollNumber}`).maybeSingle();
          if (matched?.id) userId = matched.id;
        }
      } catch {}
    }

    // Calculate institution initials (e.g. "Bangalore University" -> "BU")
    const words = collegeName.split(/\s+/).filter((w: string) => w.length > 0);
    const initials = words.length > 1
      ? words.map((w: string) => w[0].toUpperCase()).slice(0, 4).join('')
      : collegeName.slice(0, 3).toUpperCase();

    if (admin && userId) {
      try {
        const { data: existingUser } = await admin
          .from('users')
          .select('onboarding_answers, display_name, email')
          .eq('id', userId)
          .maybeSingle();

        const existingOb = (existingUser?.onboarding_answers as Record<string, any>) || {};

        const updatedOb = {
          ...existingOb,
          college: collegeName,
          collegeName,
          university: body.university || collegeName,
          institution: collegeName,
          degree,
          department,
          branch: department,
          rollNumber,
          roll_number: rollNumber,
          ...(studentName ? { studentName, displayName: studentName, fullName: studentName } : {}),
          ...(pinitId ? { pinitId, pinit_id: pinitId } : {}),
          ...(body.collegeInfo ? { collegeInfo: body.collegeInfo } : {}),
          graduationYear,
        };

        const directUpdate: Record<string, any> = {
          college_name: collegeName,
          department: department || null,
          roll_number: rollNumber || null,
          onboarding_answers: updatedOb,
          updated_at: new Date().toISOString()
        };
        if (pinitId) directUpdate.pinit_id = pinitId;
        if (studentName) {
          directUpdate.display_name = studentName;
          directUpdate.full_name = studentName;
        }

        let attempts = 0;
        while (attempts < 5) {
          attempts++;
          const { error } = await admin.from('users').update(directUpdate).eq('id', userId);
          if (!error) break;
          const match = /Could not find the '([^']+)' column/i.exec(error.message || '') ||
                        /column "([^"]+)" of relation "users" does not exist/i.exec(error.message || '') ||
                        /column "([^"]+)" does not exist/i.exec(error.message || '');
          if (match && match[1] && match[1] in directUpdate) {
            delete directUpdate[match[1]];
            continue;
          } else {
            console.warn('[connect-college] Supabase update warning:', error.message);
            break;
          }
        }

        // Upsert to student_institutional_profiles table
        try {
          await admin.from('student_institutional_profiles').upsert({
            student_id: userId,
            student_name: studentName || existingUser?.display_name || 'Student',
            email: body.email || existingUser?.email || `${userId}@student.pinit.internal`,
            college_name: collegeName,
            university: body.university || collegeName || 'State Technical University',
            roll_number: rollNumber || '',
            department: department || 'Engineering',
            verification_status: 'verified',
            updated_at: new Date().toISOString()
          }, { onConflict: 'student_id' });
        } catch (instErr) {
          console.warn('[connect-college] Institutional table note:', instErr);
        }
      } catch (dbErr) {
        console.warn('[connect-college] Supabase update error:', dbErr);
      }
    }

    return NextResponse.json({
      ok: true,
      institutionName: collegeName,
      institutionInitials: initials,
      degree,
      department,
      rollNumber,
      graduationYear,
      message: `Successfully connected to ${collegeName}`
    });
  } catch (err: any) {
    console.error('[connect-college] Error:', err);
    return NextResponse.json(
      { ok: false, error: 'SERVER_ERROR', message: err?.message || 'Failed to connect college' },
      { status: 500 }
    );
  }
}
