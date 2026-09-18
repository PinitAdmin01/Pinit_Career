import { NextRequest, NextResponse } from 'next/server';
import {
  getDirectMessages,
  sendDirectMessage,
  markMessagesAsRead
} from '@/lib/services/supabase/socialService';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const withUser = searchParams.get('with') || 'priya';
    const currentUser = searchParams.get('userId') || 'current_user';

    const messages = await getDirectMessages(currentUser, withUser);
    await markMessagesAsRead(currentUser, withUser).catch(() => {});

    return NextResponse.json({ ok: true, messages });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      senderId = 'current_user',
      recipientId = 'priya',
      receiverId = 'priya',
      senderName = 'Student',
      recipientName = 'Faculty Mentor',
      content = '',
      message = '',
      role = 'student'
    } = body || {};

    const targetRecipient = recipientId || receiverId;
    const text = content || message || '';

    if (!text.trim()) {
      return NextResponse.json({ ok: false, error: 'Message content cannot be empty' }, { status: 400 });
    }

    const res = await sendDirectMessage({
      sender_id: senderId,
      sender_name: senderName,
      recipient_id: targetRecipient,
      receiver_id: targetRecipient,
      recipient_name: recipientName,
      receiver_name: recipientName,
      content: text.trim(),
      message: text.trim(),
      role
    });

    return NextResponse.json({ ok: true, message: res.message || res });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
