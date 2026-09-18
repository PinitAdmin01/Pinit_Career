import { NextRequest, NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { markAllNotificationsRead } from '@/lib/services/supabase/socialService';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const gated = await requireUserFromRequest(req);
    const userId = gated.user?.id;
    if (!userId) {
      return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
    }

    // Direct database update via admin client
    try {
      const admin = getSupabaseAdmin();
      await admin
        .from('notifications')
        .update({ is_read: true, read: true })
        .eq('user_id', userId)
        .eq('is_read', false);
    } catch {}

    // Service layer sync & in-memory buffer update
    await markAllNotificationsRead(userId);

    return NextResponse.json({ ok: true, message: 'All notifications marked as read' }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message || 'INTERNAL_ERROR' }, { status: 500 });
  }
}
