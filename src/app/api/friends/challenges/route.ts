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
  return { invitations: [], mockStudents: [] };
}

function writeDb(data: any) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing friends_db.json:', err);
  }
}

// ── GET: Get pending arena challenges and leaderboards ─────────────────────
export async function GET() {
  try {
    const db = readDb();
    const arenaInvites = (db.invitations || []).filter((inv: any) => inv.type === 'arena');
    const pendingChallenges = arenaInvites.filter((inv: any) => inv.status === 'pending');
    const activeDuels = arenaInvites.filter((inv: any) => inv.status === 'accepted');

    const leaderboard = [
      { rank: 1, id: 'pooja_kulkarni', name: 'Pooja Kulkarni', college: 'Mumbai University', arenaWins: 31, xp: 2900, avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100' },
      { rank: 2, id: 'rahul_shetty', name: 'Rahul Shetty', college: 'RVCE', arenaWins: 24, xp: 2950, avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100' },
      { rank: 3, id: 'current_user', name: 'Vinay N (You)', college: 'Bangalore University', arenaWins: 22, xp: 3450, avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100' },
      { rank: 4, id: 'arjun_nair', name: 'Arjun Nair', college: 'NIT Calicut', arenaWins: 19, xp: 2300, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' },
      { rank: 5, id: 'aishwarya_rao', name: 'Aishwarya Rao', college: 'Bangalore University', arenaWins: 18, xp: 3100, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' },
      { rank: 6, id: 'aditya_verma', name: 'Aditya Verma', college: 'VIT Vellore', arenaWins: 17, xp: 3200, avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100' }
    ];

    const headToHead = [
      { id: 'rahul_shetty', name: 'Rahul Shetty', youWins: 3, theyWins: 1, lastTopic: 'Binary Search Trees' },
      { id: 'arjun_nair', name: 'Arjun Nair', youWins: 2, theyWins: 0, lastTopic: 'Linux OS & Threading' },
      { id: 'pooja_kulkarni', name: 'Pooja Kulkarni', youWins: 1, theyWins: 2, lastTopic: 'Dynamic Programming' }
    ];

    return NextResponse.json({
      ok: true,
      pendingChallenges,
      activeDuels,
      leaderboard,
      headToHead
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

// ── POST: Dispatch a 1v1 Arena Challenge ───────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { studentId, studentName, studentAvatar, topic, difficulty, timeLimit, wagerXP, message } = body;

    if (!studentId || !topic) {
      return NextResponse.json({ ok: false, error: 'studentId and topic are required' }, { status: 400 });
    }

    if (studentId === 'current_user') {
      return NextResponse.json({ ok: false, error: 'Cannot challenge yourself to an arena duel' }, { status: 400 });
    }

    const numWager = Number(wagerXP ?? 100);
    if (isNaN(numWager) || numWager < 0 || numWager > 1000) {
      return NextResponse.json({ ok: false, error: 'Wager XP must be a valid number between 0 and 1000 XP' }, { status: 400 });
    }

    const numTime = Number(timeLimit ?? 20);
    if (isNaN(numTime) || numTime < 5 || numTime > 120) {
      return NextResponse.json({ ok: false, error: 'Time limit must be between 5 and 120 minutes' }, { status: 400 });
    }

    const dbCheck = readDb();
    const isBlocked = (dbCheck.blockedUsers || []).some((b: any) => b.studentId === studentId);
    if (isBlocked) {
      return NextResponse.json({ ok: false, error: 'Cannot challenge a blocked student' }, { status: 403 });
    }

    const db = readDb();
    if (!db.invitations) db.invitations = [];

    const newChallenge = {
      id: `arena-duel-${Date.now()}`,
      type: 'arena',
      title: `1v1 Arena Duel: ${topic}`,
      sender: {
        id: 'current_user',
        name: 'Vinay N',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'
      },
      receiverId: studentId,
      receiverName: studentName || 'Student',
      receiverAvatar: studentAvatar,
      details: `Topic: ${topic} (${difficulty || 'Medium'}) • ${timeLimit || 20} mins • Wager: ${wagerXP || 100} XP`,
      message: message || "I challenge you to a 1v1 battle in the Challenging Arena!",
      status: 'pending',
      battleUrl: `/arena?duel_id=arena-duel-${Date.now()}`,
      created_at: new Date().toISOString()
    };

    db.invitations.unshift(newChallenge);
    writeDb(db);

    return NextResponse.json({ ok: true, challenge: newChallenge });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

// ── PATCH: Accept or Decline Challenge ─────────────────────────────────────
export async function PATCH(req: NextRequest) {
  try {
    const { challengeId, action } = await req.json();
    if (!challengeId || !['accept', 'decline'].includes(action)) {
      return NextResponse.json({ ok: false, error: 'Invalid challengeId or action' }, { status: 400 });
    }

    const db = readDb();
    const invIndex = (db.invitations || []).findIndex((i: any) => i.id === challengeId);

    if (invIndex === -1) {
      return NextResponse.json({ ok: false, error: 'Challenge not found' }, { status: 404 });
    }

    if (db.invitations[invIndex].status !== 'pending') {
      return NextResponse.json({ ok: false, error: `Challenge has already been ${db.invitations[invIndex].status}` }, { status: 400 });
    }

    db.invitations[invIndex].status = action === 'accept' ? 'accepted' : 'declined';
    db.invitations[invIndex].responded_at = new Date().toISOString();

    writeDb(db);

    return NextResponse.json({
      ok: true,
      challenge: db.invitations[invIndex],
      battleUrl: db.invitations[invIndex].battleUrl || '/arena',
      message: action === 'accept' ? 'Duel accepted! Launching Challenging Arena battle.' : 'Duel declined.'
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}