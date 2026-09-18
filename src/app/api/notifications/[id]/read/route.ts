import { NextRequest, NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { markNotificationRead } from '@/lib/services/supabase/socialService';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';

export const dynamic = 'force-dynamic';

async function handleMarkRead(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const gated = await requireUserFromRequest(req);
    const userId = gated.user?.id;
    if (!userId) {
      return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
    }

    const notificationId = params.id;
    if (!notificationId) {
      return NextResponse.json({ error: 'NOTIFICATION_ID_REQUIRED' }, { status: 400 });
    }

    // Direct database update via admin client
    try {
      const admin = getSupabaseAdmin();
      await admin
        .from('notifications')
        .update({ is_read: true, read: true })
        .eq('id', notificationId)
        .eq('user_id', userId);
    } catch {}

    // Service layer sync & in-memory buffer update
    await markNotificationRead(userId, notificationId);

    return NextResponse.json({ ok: true, id: notificationId }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message || 'INTERNAL_ERROR' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, context: { params: { id: string } }) {
  return handleMarkRead(req, context);
}

export async function POST(req: NextRequest, context: { params: { id: string } }) {
  return handleMarkRead(req, context);
}
