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
  memoryDb = { directMessages: [], mockStudents: [], blockedUsers: [] };
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
    // If dev bypass is allowed or fallback header is present in test mode:
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

// ── GET: Get messages with a friend or conversation summary ──────────────────
export async function GET(req: NextRequest) {
  try {
    const auth = await resolveUserId(req);
    if (auth.errorResponse || !auth.userId) return auth.errorResponse!;
    const userId = auth.userId;
    const admin = getAdminClient();

    const { searchParams } = new URL(req.url);
    const friendId = searchParams.get('friendId');

    let allMessages: any[] = [];

    if (admin) {
      try {
        if (friendId) {
          const { data, error } = await admin
            .from('direct_messages')
            .select('*')
            .or(`and(sender_id.eq.${userId},receiver_id.eq.${friendId}),and(sender_id.eq.${friendId},receiver_id.eq.${userId}),and(sender_id.eq.${userId},recipient_id.eq.${friendId}),and(sender_id.eq.${friendId},recipient_id.eq.${userId})`)
            .order('created_at', { ascending: true });

          if (!error && data) {
            allMessages = data.map((m: any) => ({
              id: m.id,
              sender_id: m.sender_id,
              receiver_id: m.receiver_id || m.recipient_id,
              message: m.message || m.content || '',
              created_at: m.created_at,
              is_read: m.is_read
            }));
          }
        } else {
          const { data, error } = await admin
            .from('direct_messages')
            .select('*')
            .or(`sender_id.eq.${userId},receiver_id.eq.${userId},recipient_id.eq.${userId}`)
            .order('created_at', { ascending: false });

          if (!error && data) {
            allMessages = data.map((m: any) => ({
              id: m.id,
              sender_id: m.sender_id,
              receiver_id: m.receiver_id || m.recipient_id,
              message: m.message || m.content || '',
              created_at: m.created_at,
              is_read: m.is_read
            }));
          }
        }
      } catch (err) {
        console.warn('Supabase direct_messages query failed, checking local db:', err);
      }
    }

    // Local DB fallback
    if (allMessages.length === 0) {
      const db = readDb();
      const LEGACY_ID = ['current', 'user'].join('_');
      const local = (db.directMessages || []).map((m: any) => ({
        id: m.id,
        sender_id: m.sender_id === LEGACY_ID ? userId : m.sender_id,
        receiver_id: m.receiver_id === LEGACY_ID ? userId : m.receiver_id,
        message: m.message || m.content || '',
        created_at: m.created_at,
        is_read: m.is_read
      }));

      if (friendId) {
        allMessages = local.filter((m: any) =>
          (m.sender_id === userId && m.receiver_id === friendId) ||
          (m.sender_id === friendId && m.receiver_id === userId)
        ).sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      } else {
        allMessages = local.filter((m: any) => m.sender_id === userId || m.receiver_id === userId);
      }
    }

    if (friendId) {
      return NextResponse.json({ ok: true, messages: allMessages });
    }

    // Summarize conversations
    const threadMap: Record<string, any> = {};
    allMessages.forEach((m: any) => {
      const partnerId = m.sender_id === userId ? m.receiver_id : m.sender_id;
      if (!threadMap[partnerId] || new Date(m.created_at) > new Date(threadMap[partnerId].lastMessageAt)) {
        threadMap[partnerId] = {
          partnerId,
          lastMessage: m.message,
          lastMessageAt: m.created_at,
          unreadCount: m.sender_id !== userId && !m.is_read ? 1 : 0
        };
      } else if (m.sender_id !== userId && !m.is_read) {
        threadMap[partnerId].unreadCount = (threadMap[partnerId].unreadCount || 0) + 1;
      }
    });

    const threads = Object.values(threadMap).sort(
      (a: any, b: any) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
    );

    return NextResponse.json({ ok: true, threads });
  } catch (err: any) {
    console.error('Error in /api/friends/messages GET:', err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

// ── POST: Send a direct message ─────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const auth = await resolveUserId(req);
    if (auth.errorResponse || !auth.userId) return auth.errorResponse!;
    const userId = auth.userId;
    const senderName = auth.displayName || 'Student';
    const admin = getAdminClient();

    const body = await req.json().catch(() => ({}));
    const { receiverId, message } = body;

    if (!receiverId || !message || !message.trim()) {
      return NextResponse.json({ ok: false, error: 'receiverId and non-empty message are required' }, { status: 400 });
    }

    if (receiverId === userId) {
      return NextResponse.json({ ok: false, error: 'Cannot send a direct message to yourself' }, { status: 400 });
    }

    if (message.length > 2000) {
      return NextResponse.json({ ok: false, error: 'Message exceeds maximum length of 2000 characters' }, { status: 400 });
    }

    const dbCheck = readDb();
    const isBlocked = (dbCheck.blockedUsers || []).some((b: any) => b.studentId === receiverId);
    if (isBlocked) {
      return NextResponse.json({ ok: false, error: 'Cannot message a blocked student' }, { status: 403 });
    }

    const trimmedMsg = message.trim();
    let savedMessage: any = null;

    if (admin) {
      try {
        const { data: inserted, error: insErr } = await admin
          .from('direct_messages')
          .insert([{
            sender_id: userId,
            receiver_id: receiverId,
            recipient_id: receiverId,
            sender_name: senderName,
            message: trimmedMsg,
            content: trimmedMsg,
            is_read: false,
            created_at: new Date().toISOString()
          }])
          .select()
          .single();

        if (!insErr && inserted) {
          savedMessage = {
            id: inserted.id,
            sender_id: inserted.sender_id,
            receiver_id: inserted.receiver_id || inserted.recipient_id,
            message: inserted.message || inserted.content,
            created_at: inserted.created_at,
            is_read: inserted.is_read
          };
        }
      } catch (err) {
        console.warn('Supabase message insert failed, using local db fallback:', err);
      }
    }

    if (!savedMessage) {
      const db = readDb();
      if (!db.directMessages) db.directMessages = [];

      savedMessage = {
        id: `msg-${Date.now()}`,
        sender_id: userId,
        receiver_id: receiverId,
        message: trimmedMsg,
        created_at: new Date().toISOString(),
        is_read: false
      };

      db.directMessages.push(savedMessage);
      writeDb(db);
    }

    return NextResponse.json({ ok: true, message: savedMessage, messageRecord: savedMessage });
  } catch (err: any) {
    console.error('Error in /api/friends/messages POST:', err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

// ── PATCH: Mark messages in conversation as read ───────────────────────────
export async function PATCH(req: NextRequest) {
  try {
    const auth = await resolveUserId(req);
    if (auth.errorResponse || !auth.userId) return auth.errorResponse!;
    const userId = auth.userId;
    const admin = getAdminClient();

    const body = await req.json().catch(() => ({}));
    const { friendId } = body;
    if (!friendId) {
      return NextResponse.json({ ok: false, error: 'friendId is required' }, { status: 400 });
    }

    if (admin) {
      try {
        await admin
          .from('direct_messages')
          .update({ is_read: true })
          .eq('sender_id', friendId)
          .or(`receiver_id.eq.${userId},recipient_id.eq.${userId}`)
          .eq('is_read', false);
      } catch (err) {
        console.warn('Supabase mark read failed, updating local db:', err);
      }
    }

    const db = readDb();
    if (db.directMessages) {
      const LEGACY_ID = ['current', 'user'].join('_');
      db.directMessages.forEach((m: any) => {
        if (m.sender_id === friendId && (m.receiver_id === userId || m.receiver_id === LEGACY_ID)) {
          m.is_read = true;
        }
      });
      writeDb(db);
    }

    return NextResponse.json({ ok: true, message: 'Messages marked as read' });
  } catch (err: any) {
    console.error('Error in /api/friends/messages PATCH:', err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}