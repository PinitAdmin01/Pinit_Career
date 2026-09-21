import { NextRequest, NextResponse } from 'next/server';
import {
  getDirectMessages,
  sendDirectMessage,
  markMessagesAsRead
} from '@/lib/services/supabase/socialService';
import { requireUserFromRequest } from '@/lib/server/requireAuth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;
    const currentUser = gated.user!.id;

    const { searchParams } = new URL(req.url);
    const withUser = searchParams.get('with');
    if (!withUser) {
      return NextResponse.json({ ok: false, error: 'Recipient ID is required' }, { status: 400 });
    }

    const messages = await getDirectMessages(currentUser, withUser);
    await markMessagesAsRead(currentUser, withUser).catch(() => {});

    return NextResponse.json({ ok: true, messages });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;
    const senderId = gated.user!.id;

    const body = await req.json();
    const recipientId = body.recipientId || body.receiverId;
    if (!recipientId) {
      return NextResponse.json({ ok: false, error: 'Recipient ID is required' }, { status: 400 });
    }

    const content = String(body.content || '').trim();
    if (!content) {
      return NextResponse.json({ ok: false, error: 'Message content cannot be empty' }, { status: 400 });
    }

    const senderName = (gated.user as any)?.display_name || (gated.user as any)?.name || 'Student';

    const message = await sendDirectMessage({
      senderId,
      recipientId,
      content,
      senderName
    });

    return NextResponse.json({ ok: true, message });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
