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
    const department = typeof body.department === 'string' ? body.department.trim() : '';
    const rollNumber = typeof body.rollNumber === 'string' ? body.rollNumber.trim() : '';
    const graduationYear = typeof body.graduationYear === 'string' ? body.graduationYear.trim() : '2026';

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

    // Calculate institution initials (e.g. "Bangalore University" -> "BU")
    const words = collegeName.split(/\s+/).filter((w: string) => w.length > 0);
    const initials = words.length > 1
      ? words.map((w: string) => w[0].toUpperCase()).slice(0, 4).join('')
      : collegeName.slice(0, 3).toUpperCase();

    const admin = getAdminClient();
    if (admin && userId) {
      try {
        const { data: existingUser } = await admin
          .from('users')
          .select('onboarding_answers')
          .eq('id', userId)
          .maybeSingle();

        const existingOb = (existingUser?.onboarding_answers as Record<string, any>) || {};

        const updatedOb = {
          ...existingOb,
          college: collegeName,
          university: collegeName,
          institution: collegeName,
          degree,
          department,
          rollNumber,
          graduationYear,
        };

        await admin
          .from('users')
          .update({
            college_name: collegeName,
            department: department || null,
            roll_number: rollNumber || null,
            onboarding_answers: updatedOb,
            updated_at: new Date().toISOString()
          })
          .eq('id', userId);
      } catch (dbErr) {
        console.warn('[connect-college] Supabase update warning:', dbErr);
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
