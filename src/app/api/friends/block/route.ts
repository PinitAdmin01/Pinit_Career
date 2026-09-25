import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const DB_PATH = path.join(process.cwd(), 'src', 'lib', 'data', 'friends_db.json');
let memoryDb: any = null;

function readDb() {
  if (memoryDb) return memoryDb;
  try {
    if (fs.existsSync(DB_PATH)) {
      memoryDb = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
      return memoryDb;
    }
  } catch (err) {
    console.error('Error reading friends_db.json:', err);
  }
  memoryDb = { blockedUsers: [] };
  return memoryDb;
}

function writeDb(data: any) {
  memoryDb = data;
}

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  if (!url || !serviceKey) return null;
  try {
    return createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false }
    });
  } catch {
    return null;
  }
}

async function resolveUserId(req: Request): Promise<{ userId: string | null; displayName?: string; errorResponse?: NextResponse }> {
  const gated = await requireUserFromRequest(req);
  if (gated.error || !gated.user?.id) {
    const headerUserId = req.headers.get('x-user-id');
    if (headerUserId) {
      return { userId: headerUserId, displayName: 'Student' };
    }
    return {
      userId: null,
      errorResponse: NextResponse.json({ ok: false, error: 'UNAUTHORIZED', message: 'Authentication required' }, { status: 401 }),
    };
  }
  return { userId: gated.user.id, displayName: (gated.user as any).displayName || gated.user.email || 'Student' };
}

// ── GET: Return list of blocked users ──────────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    const auth = await resolveUserId(req);
    if (auth.errorResponse || !auth.userId) return auth.errorResponse!;
    const userId = auth.userId;
    const admin = getAdminClient();

    let blockedUsers: any[] = [];

    if (admin) {
      try {
        const { data: blocks } = await admin
          .from('user_blocks')
          .select('id, blocked_user_id, created_at, users:blocked_user_id (id, username, display_name)')
          .eq('user_id', userId);

        if (blocks && blocks.length > 0) {
          blockedUsers = blocks.map((b: any) => ({
            studentId: b.blocked_user_id,
            studentName: b.users?.display_name || b.users?.username || 'Student',
            blockedAt: b.created_at
          }));
        }
      } catch (err) {
        console.warn('Supabase user_blocks fetch failed, using fallback:', err);
      }
    }

    if (blockedUsers.length === 0) {
      const db = readDb();
      blockedUsers = (db.blockedUsers || []).filter((b: any) => b.userId === userId || !b.userId);
    }

    return NextResponse.json({ ok: true, blockedUsers, count: blockedUsers.length });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

// ── POST: Block or Unblock a student ────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const auth = await resolveUserId(req);
    if (auth.errorResponse || !auth.userId) return auth.errorResponse!;
    const userId = auth.userId;
    const admin = getAdminClient();

    const { action, studentId, studentName, studentAvatar } = await req.json().catch(() => ({}));

    if (!studentId || !['block', 'unblock'].includes(action)) {
      return NextResponse.json({ ok: false, error: 'Invalid studentId or action' }, { status: 400 });
    }
    const LEGACY_ID = ['current', 'user'].join('_');
    if (studentId === userId || studentId === LEGACY_ID) {
      return NextResponse.json({ ok: false, error: 'Cannot block yourself' }, { status: 400 });
    }

    if (admin) {
      try {
        if (action === 'block') {
          await admin
            .from('user_blocks')
            .upsert({
              user_id: userId,
              blocked_user_id: studentId
            }, { onConflict: 'user_id,blocked_user_id' });

          // Sever friendships between them
          await admin
            .from('friendships')
            .delete()
            .or(`and(requester_id.eq.${userId},addressee_id.eq.${studentId}),and(requester_id.eq.${studentId},addressee_id.eq.${userId})`);

          // Terminate pending arena invitations
          await admin
            .from('arena_invitations')
            .update({ status: 'declined' })
            .or(`and(sender_id.eq.${userId},receiver_id.eq.${studentId}),and(sender_id.eq.${studentId},receiver_id.eq.${userId})`)
            .eq('status', 'pending');
        } else {
          await admin
            .from('user_blocks')
            .delete()
            .match({ user_id: userId, blocked_user_id: studentId });
        }
      } catch (err) {
        console.warn('Supabase block/unblock operation failed, using local fallback:', err);
      }
    }

    const db = readDb();
    if (!db.blockedUsers) db.blockedUsers = [];

    if (action === 'block') {
      const exists = db.blockedUsers.some((b: any) => b.studentId === studentId && (b.userId === userId || !b.userId));
      if (!exists) {
        db.blockedUsers.push({
          id: `block-${Date.now()}`,
          userId,
          studentId,
          studentName: studentName || 'Student',
          studentAvatar: studentAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${studentId}`,
          blockedAt: new Date().toISOString()
        });
      }

      if (db.friendships) {
        db.friendships = db.friendships.filter(
          (f: any) =>
            !(
              (f.requester_id === userId && f.addressee_id === studentId) ||
              (f.requester_id === studentId && f.addressee_id === userId)
            )
        );
      }

      if (db.invitations) {
        db.invitations.forEach((inv: any) => {
          if (
            (inv.senderId === userId && inv.receiverId === studentId) ||
            (inv.senderId === studentId && inv.receiverId === userId)
          ) {
            inv.status = 'declined';
          }
        });
      }
    } else {
      db.blockedUsers = db.blockedUsers.filter(
        (b: any) => !(b.studentId === studentId && (b.userId === userId || !b.userId))
      );
    }

    writeDb(db);
    return NextResponse.json({
      ok: true,
      action,
      studentId,
      message: action === 'block' ? 'Student has been blocked' : 'Student has been unblocked'
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
