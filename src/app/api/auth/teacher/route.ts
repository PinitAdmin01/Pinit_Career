import { NextRequest, NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';

const VALID_TEACHERS = new Set([
  // Course Teaching Avatars
  'kashyap', 'karthic', 'maya', 'divya',
  // AI Guidance Mentors
  'priya', 'anish',
  // Legacy / alternate personas
  'arjun', 'vikram', 'ananya', 'rohan', 'kavya', 'meera', 'sanjay'
]);

async function handleTeacherUpdate(req: NextRequest) {
  let body: any = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'INVALID_JSON', message: 'Invalid JSON body' }, { status: 400 });
  }

  const teacherId = String(body.teacherId || body.selectedTeacherId || 'kashyap').trim().toLowerCase();
  if (!teacherId) {
    return NextResponse.json({ error: 'INVALID_TEACHER', message: 'teacherId is required' }, { status: 400 });
  }

  const gated = await requireUserFromRequest(req);
  const cookieUid = req.cookies.get('pinit_uid')?.value;
  const userId = (!gated.error && gated.user?.id) ? gated.user.id : cookieUid;

  if (!userId) {
    return NextResponse.json({ error: 'UNAUTHORIZED', message: 'Authentication required' }, { status: 401 });
  }

  const safeTeacherId = VALID_TEACHERS.has(teacherId) ? teacherId : 'kashyap';

  const admin = getSupabaseAdmin();
  if (admin) {
    try {
      const updates: Record<string, any> = {
        selected_teacher_id: safeTeacherId,
      };
      if (body.guidanceMentorId && VALID_TEACHERS.has(String(body.guidanceMentorId).toLowerCase())) {
        updates.guidance_mentor_id = String(body.guidanceMentorId).toLowerCase();
      }
      await admin
        .from('users')
        .update(updates)
        .eq('id', userId);
    } catch (err: any) {
      console.warn('[/api/auth/teacher] Non-fatal DB update warning:', err?.message || err);
    }
  }

  return NextResponse.json({
    ok: true,
    teacherId: safeTeacherId,
    selectedTeacherId: safeTeacherId,
  });
}

export async function GET(req: NextRequest) {
  const gated = await requireUserFromRequest(req);
  const cookieUid = req.cookies.get('pinit_uid')?.value;
  const userId = (!gated.error && gated.user?.id) ? gated.user.id : cookieUid;

  if (!userId) {
    return NextResponse.json({ error: 'UNAUTHORIZED', message: 'Authentication required' }, { status: 401 });
  }

  const admin = getSupabaseAdmin();
  if (admin) {
    try {
      const { data } = await admin
        .from('users')
        .select('selected_teacher_id, guidance_mentor_id')
        .eq('id', userId)
        .maybeSingle();

      if (data) {
        return NextResponse.json({
          ok: true,
          teacherId: data.selected_teacher_id || 'kashyap',
          selectedTeacherId: data.selected_teacher_id || 'kashyap',
          guidanceMentorId: data.guidance_mentor_id || 'priya',
        });
      }
    } catch (err: any) {
      console.warn('[/api/auth/teacher] GET warning:', err?.message || err);
    }
  }

  return NextResponse.json({
    ok: true,
    teacherId: 'kashyap',
    selectedTeacherId: 'kashyap',
    guidanceMentorId: 'priya',
  });
}

export async function PATCH(req: NextRequest) {
  return handleTeacherUpdate(req);
}

export async function POST(req: NextRequest) {
  return handleTeacherUpdate(req);
}
