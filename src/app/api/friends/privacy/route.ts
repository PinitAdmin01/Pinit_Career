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
  return { friendships: [], mockStudents: [], invitations: [], directMessages: [], privacySettings: {}, blockedUsers: [] };
}

function writeDb(data: any) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing friends_db.json:', err);
  }
}

// ── GET: Return privacy settings and blocked users ──────────────────────────
export async function GET() {
  try {
    const db = readDb();
    const settings = db.privacySettings || {
      whoCanSendRequests: 'everyone',
      profileVisibility: 'public',
      showOnlineBeacon: true,
      showInSuggestions: true
    };
    const blockedUsers = db.blockedUsers || [];

    return NextResponse.json({ ok: true, settings, blockedUsers });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

// ── PUT: Update privacy settings ────────────────────────────────────────────
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const db = readDb();

    db.privacySettings = {
      ...db.privacySettings,
      ...body
    };

    writeDb(db);
    return NextResponse.json({ ok: true, settings: db.privacySettings });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

// ── POST: Block or Unblock a student ────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const { action, studentId, studentName, studentAvatar } = await req.json();

    if (!studentId || !['block', 'unblock'].includes(action)) {
      return NextResponse.json({ ok: false, error: 'Invalid studentId or action' }, { status: 400 });
    }
    if (studentId === 'current_user') {
      return NextResponse.json({ ok: false, error: 'Cannot block yourself' }, { status: 400 });
    }

    const db = readDb();
    if (!db.blockedUsers) db.blockedUsers = [];

    if (action === 'block') {
      // Add to blocked list if not already present
      if (!db.blockedUsers.some((b: any) => b.studentId === studentId)) {
        db.blockedUsers.push({
          studentId,
          studentName: studentName || 'Student',
          studentAvatar: studentAvatar || '',
          blockedAt: new Date().toISOString()
        });
      }

      // Automatically terminate any existing friendships or pending requests
      db.friendships = (db.friendships || []).filter(
        (f: any) => !(
          (f.requester_id === 'current_user' && f.addressee_id === studentId) ||
          (f.requester_id === studentId && f.addressee_id === 'current_user')
        )
      );

      // Remove any invitations between them
      db.invitations = (db.invitations || []).filter(
        (i: any) => !(
          (i.sender?.id === 'current_user' && i.receiverId === studentId) ||
          (i.sender?.id === studentId && i.receiverId === 'current_user')
        )
      );

      writeDb(db);
      return NextResponse.json({ ok: true, message: `Blocked ${studentName || 'student'}. Removed from connections.` });
    } else {
      // Unblock
      db.blockedUsers = db.blockedUsers.filter((b: any) => b.studentId !== studentId);
      writeDb(db);
      return NextResponse.json({ ok: true, message: `Unblocked ${studentName || 'student'}.` });
    }
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
