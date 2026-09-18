import { NextRequest, NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { getNotifications, createNotification, normalizeNotification } from '@/lib/services/supabase/socialService';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const gated = await requireUserFromRequest(req);
    const userId = gated.user?.id;
    if (!userId) {
      return NextResponse.json({ notifications: [] }, { status: 200 });
    }

    // Try reading via server admin or fallback to socialService
    try {
      const admin = getSupabaseAdmin();
      const { data, error } = await admin
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (!error && data && data.length > 0) {
        return NextResponse.json({ notifications: data.map(normalizeNotification) }, { status: 200 });
      }
    } catch {}

    const notifications = await getNotifications(userId);
    return NextResponse.json({ notifications }, { status: 200 });
  } catch {
    return NextResponse.json({ notifications: [] }, { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const gated = await requireUserFromRequest(req);
    const authUser = gated.user;
    if (!authUser?.id) {
      return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const targetUserId = body.userId || authUser.id;
    const { title, message, type = 'info', source = 'system' } = body;

    if (!title || !message) {
      return NextResponse.json({ error: 'TITLE_AND_MESSAGE_REQUIRED' }, { status: 400 });
    }

    const result = await createNotification({
      userId: targetUserId,
      senderId: authUser.id,
      title,
      message,
      type,
      source
    });

    return NextResponse.json(result, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message || 'INTERNAL_ERROR' }, { status: 500 });
  }
}
