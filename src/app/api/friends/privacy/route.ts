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
  memoryDb = { friendships: [], mockStudents: [], invitations: [], directMessages: [], privacySettings: {}, blockedUsers: [] };
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
  return { userId: gated.user.id, displayName: gated.user.displayName || gated.user.email || 'Student' };
}

const DEFAULT_SETTINGS = {
  whoCanSendRequests: 'everyone',
  profileVisibility: 'public',
  showOnlineBeacon: true,
  showInSuggestions: true,
  allowChallenges: true,
  allowSquadInvites: true
};

// ── GET: Return privacy settings and blocked users ──────────────────────────
export async function GET(req: NextRequest) {
  try {
    const auth = await resolveUserId(req);
    if (auth.errorResponse || !auth.userId) return auth.errorResponse!;
    const userId = auth.userId;
    const admin = getAdminClient();

    let settings = { ...DEFAULT_SETTINGS };
    let blockedUsers: any[] = [];
    let supabaseSuccess = false;

    if (admin) {
      try {
        const { data: privData } = await admin
          .from('user_privacy_settings')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();

        if (privData) {
          settings = {
            whoCanSendRequests: privData.who_can_send_requests || 'everyone',
            profileVisibility: privData.profile_visibility || 'public',
            showOnlineBeacon: privData.show_online_beacon ?? true,
            showInSuggestions: privData.show_in_suggestions ?? true,
            allowChallenges: privData.allow_challenges ?? true,
            allowSquadInvites: privData.allow_squad_invites ?? true
          };
        }

        const { data: blocks } = await admin
          .from('user_blocks')
          .select('id, blocked_user_id, created_at')
          .eq('user_id', userId);

        if (blocks && blocks.length > 0) {
          const blockedIds = blocks.map(b => b.blocked_user_id);
          const { data: users } = await admin
            .from('users')
            .select('id, display_name, username')
            .in('id', blockedIds);

          const userMap = new Map<string, string>();
          (users || []).forEach(u => userMap.set(u.id, u.display_name || u.username || 'Student'));

          blockedUsers = blocks.map(b => ({
            studentId: b.blocked_user_id,
            studentName: userMap.get(b.blocked_user_id) || 'Student',
            studentAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userMap.get(b.blocked_user_id) || b.blocked_user_id)}`,
            blockedAt: b.created_at
          }));
        }

        supabaseSuccess = true;
      } catch (err) {
        console.warn('Supabase privacy query failed, falling back to local db:', err);
      }
    }

    if (!supabaseSuccess) {
      const db = readDb();
      const userSettings = db.userPrivacySettings?.[userId] || db.privacySettings || DEFAULT_SETTINGS;
      settings = { ...DEFAULT_SETTINGS, ...userSettings };
      blockedUsers = (db.blockedUsers || []).filter((b: any) => b.userId === userId || !b.userId);
    }

    return NextResponse.json({ ok: true, settings, blockedUsers });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

// ── PUT: Update privacy settings ────────────────────────────────────────────
export async function PUT(req: NextRequest) {
  try {
    const auth = await resolveUserId(req);
    if (auth.errorResponse || !auth.userId) return auth.errorResponse!;
    const userId = auth.userId;
    const admin = getAdminClient();

    const body = await req.json();

    if (admin) {
      try {
        await admin
          .from('user_privacy_settings')
          .upsert({
            user_id: userId,
            who_can_send_requests: body.whoCanSendRequests || 'everyone',
            profile_visibility: body.profileVisibility || 'public',
            show_online_beacon: body.showOnlineBeacon ?? true,
            show_in_suggestions: body.showInSuggestions ?? true,
            allow_challenges: body.allowChallenges ?? true,
            allow_squad_invites: body.allowSquadInvites ?? true,
            updated_at: new Date().toISOString()
          }, { onConflict: 'user_id' });
      } catch (err) {
        console.warn('Supabase upsert user_privacy_settings failed:', err);
      }
    }

    const db = readDb();
    if (!db.userPrivacySettings) db.userPrivacySettings = {};
    db.userPrivacySettings[userId] = {
      ...(db.userPrivacySettings[userId] || db.privacySettings || DEFAULT_SETTINGS),
      ...body
    };
    db.privacySettings = db.userPrivacySettings[userId];
    writeDb(db);

    return NextResponse.json({ ok: true, settings: db.userPrivacySettings[userId] });
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

    const { action, studentId, studentName, studentAvatar } = await req.json();

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
            .delete()
            .or(`and(sender_id.eq.${userId},receiver_id.eq.${studentId}),and(sender_id.eq.${studentId},receiver_id.eq.${userId})`)
            .eq('status', 'pending');

          // Terminate pending project invitations
          await admin
            .from('project_invitations')
            .delete()
            .or(`and(sender_id.eq.${userId},receiver_id.eq.${studentId}),and(sender_id.eq.${studentId},receiver_id.eq.${userId})`)
            .eq('status', 'pending');
        } else {
          await admin
            .from('user_blocks')
            .delete()
            .match({ user_id: userId, blocked_user_id: studentId });
        }
      } catch (err) {
        console.warn('Supabase user_blocks operation failed, falling back to local json:', err);
      }
    }

    const db = readDb();
    if (!db.blockedUsers) db.blockedUsers = [];

    if (action === 'block') {
      if (!db.blockedUsers.some((b: any) => b.studentId === studentId && (b.userId === userId || !b.userId))) {
        db.blockedUsers.push({
          userId,
          studentId,
          studentName: studentName || 'Student',
          studentAvatar: studentAvatar || '',
          blockedAt: new Date().toISOString()
        });
      }

      // Sever friendships
      db.friendships = (db.friendships || []).filter(
        (f: any) => !(
          (f.requester_id === userId && f.addressee_id === studentId) ||
          (f.requester_id === studentId && f.addressee_id === userId)
        )
      );

      // Sever invitations
      db.invitations = (db.invitations || []).filter(
        (i: any) => !(
          (i.sender?.id === userId && i.receiverId === studentId) ||
          (i.sender?.id === studentId && i.receiverId === userId)
        )
      );

      writeDb(db);
      return NextResponse.json({ ok: true, message: `Blocked ${studentName || 'student'}. Removed from connections.` });
    } else {
      db.blockedUsers = db.blockedUsers.filter((b: any) => !(b.studentId === studentId && (b.userId === userId || !b.userId)));
      writeDb(db);
      return NextResponse.json({ ok: true, message: `Unblocked ${studentName || 'student'}.` });
    }
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
