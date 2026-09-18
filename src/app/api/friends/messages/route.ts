import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const DB_PATH = path.join(process.cwd(), 'src', 'lib', 'data', 'friends_db.json');

function readDb() {
  try {
    if (fs.existsSync(DB_PATH)) {
      return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
    }
  } catch (err) {
    console.error('Error reading friends_db.json:', err);
  }
  return { directMessages: [], mockStudents: [] };
}

function writeDb(data: any) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing friends_db.json:', err);
  }
}

// ── GET: Get messages or list of conversations ─────────────────────────────
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const friendId = searchParams.get('friendId');

    const db = readDb();
    const allMessages = db.directMessages || [];

    if (friendId) {
      // Get conversation history with specific friend
      const thread = allMessages.filter(
        (m: any) =>
          (m.sender_id === 'current_user' && m.receiver_id === friendId) ||
          (m.sender_id === friendId && m.receiver_id === 'current_user')
      ).sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

      return NextResponse.json({ ok: true, messages: thread });
    }

    // Otherwise, return all conversation threads summarized
    const threadMap: Record<string, any> = {};
    allMessages.forEach((m: any) => {
      const partnerId = m.sender_id === 'current_user' ? m.receiver_id : m.sender_id;
      if (!threadMap[partnerId] || new Date(m.created_at) > new Date(threadMap[partnerId].lastMessageAt)) {
        threadMap[partnerId] = {
          partnerId,
          lastMessage: m.message,
          lastMessageAt: m.created_at,
          unreadCount: m.sender_id !== 'current_user' && !m.is_read ? 1 : 0
        };
      } else if (m.sender_id !== 'current_user' && !m.is_read) {
        threadMap[partnerId].unreadCount = (threadMap[partnerId].unreadCount || 0) + 1;
      }
    });

    const threads = Object.values(threadMap).sort(
      (a: any, b: any) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
    );

    return NextResponse.json({ ok: true, threads });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

// ── POST: Send a message ───────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { receiverId, message } = body;

    if (!receiverId || !message || !message.trim()) {
      return NextResponse.json({ ok: false, error: 'receiverId and non-empty message are required' }, { status: 400 });
    }

    if (receiverId === 'current_user') {
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

    const db = readDb();
    if (!db.directMessages) db.directMessages = [];

    const newMessage = {
      id: `msg-${Date.now()}`,
      sender_id: 'current_user',
      receiver_id: receiverId,
      message: message.trim(),
      created_at: new Date().toISOString(),
      is_read: false
    };

    db.directMessages.push(newMessage);
    writeDb(db);

    return NextResponse.json({ ok: true, message: newMessage });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

// ── PATCH: Mark messages in conversation as read ───────────────────────────
export async function PATCH(req: NextRequest) {
  try {
    const { friendId } = await req.json();
    if (!friendId) {
      return NextResponse.json({ ok: false, error: 'friendId is required' }, { status: 400 });
    }

    const db = readDb();
    if (db.directMessages) {
      db.directMessages.forEach((m: any) => {
        if (m.sender_id === friendId && m.receiver_id === 'current_user') {
          m.is_read = true;
        }
      });
      writeDb(db);
    }

    return NextResponse.json({ ok: true, message: 'Messages marked as read' });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}