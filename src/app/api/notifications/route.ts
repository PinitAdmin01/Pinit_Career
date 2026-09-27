import { NextRequest, NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { normalizeNotification } from '@/lib/services/supabase/socialService';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';

export const dynamic = 'force-dynamic';

/** Roles that may notify other users (same set as the database's campus_is_staff()). */
const STAFF_ROLES = new Set(['admin', 'superadmin', 'teacher', 'faculty']);
const MAX_TITLE = 120;
const MAX_MESSAGE = 1000;

const text = (v: unknown, max: number): string => (typeof v === 'string' ? v.trim().slice(0, max) : '');

/** The caller's own notifications, newest first. No demo fallback: an empty inbox stays empty. */
export async function GET(req: NextRequest) {
  const gated = await requireUserFromRequest(req);
  const userId = gated.user?.id;
  if (!userId) {
    return NextResponse.json({ notifications: [] }, { status: 200 });
  }

  const { data, error } = await getSupabaseAdmin()
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error('[notifications] read failed:', error.message);
    return NextResponse.json({ notifications: [], error: 'NOTIFICATIONS_UNAVAILABLE' }, { status: 500 });
  }
  return NextResponse.json({ notifications: (data ?? []).map(normalizeNotification) }, { status: 200 });
}

/**
 * Create a notification. Anyone may notify themselves; only staff may notify another user.
 * The sender is always the caller (never taken from the request).
 */
export async function POST(req: NextRequest) {
  try {
    const gated = await requireUserFromRequest(req);
    const authUser = gated.user;
    if (!authUser?.id) {
      return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
    }

    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    const title = text(body.title, MAX_TITLE);
    const message = text(body.message, MAX_MESSAGE);
    if (!title || !message) {
      return NextResponse.json({ error: 'TITLE_AND_MESSAGE_REQUIRED' }, { status: 400 });
    }
    const targetUserId = text(body.userId, 64) || authUser.id;
    const admin = getSupabaseAdmin();

    if (targetUserId !== authUser.id) {
      const { data: caller } = await admin.from('users').select('role').eq('id', authUser.id).maybeSingle();
      if (!STAFF_ROLES.has(String(caller?.role || ''))) {
        return NextResponse.json(
          { ok: false, error: 'FORBIDDEN_TARGET', message: 'You can only create notifications for yourself.' },
          { status: 403 }
        );
      }
    }

    const { data: row, error } = await admin
      .from('notifications')
      .insert({
        user_id: targetUserId,
        sender_id: authUser.id,
        title,
        message,
        type: text(body.type, 30) || 'info',
        source: text(body.source, 40) || 'system',
        is_read: false,
        read: false,
      })
      .select()
      .single();

    if (error) {
      const notFound = error.code === '23503' || error.code === '22P02';
      console.error('[notifications] create failed:', error.message);
      return NextResponse.json(
        { ok: false, error: notFound ? 'USER_NOT_FOUND' : 'CREATE_FAILED' },
        { status: notFound ? 404 : 500 }
      );
    }
    return NextResponse.json({ ok: true, notification: normalizeNotification(row) }, { status: 200 });
  } catch (err: unknown) {
    return NextResponse.json({ ok: false, error: err instanceof Error ? err.message : 'INTERNAL_ERROR' }, { status: 500 });
  }
}
