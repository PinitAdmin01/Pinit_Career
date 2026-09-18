import { NextRequest, NextResponse } from 'next/server';
import {
  getTeacherInbox,
  sendDirectMessage,
  markMessagesAsRead
} from '@/lib/services/supabase/socialService';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const teacherId = searchParams.get('teacherId') || 'priya';

    const messages = await getTeacherInbox(teacherId);
    return NextResponse.json({ ok: true, messages });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      studentId,
      replyText,
      teacherName = 'Faculty Mentor',
      teacherId = 'priya'
    } = body || {};

    if (!studentId || !replyText || !replyText.trim()) {
      return NextResponse.json(
        { ok: false, error: 'studentId and replyText are required' },
        { status: 400 }
      );
    }

    const res = await sendDirectMessage({
      sender_id: teacherId,
      sender_name: teacherName,
      receiver_id: studentId,
      recipient_id: studentId,
      receiver_name: 'Student',
      recipient_name: 'Student',
      content: replyText.trim(),
      message: replyText.trim(),
      role: 'teacher'
    });

    await markMessagesAsRead(teacherId, studentId).catch(() => {});

    return NextResponse.json({ ok: true, message: res.message || res });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
