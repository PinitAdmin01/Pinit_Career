export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getBearerToken } from '@/lib/server/requireAuth';
import { createClient } from '@supabase/supabase-js';

const dbPath = path.resolve(process.cwd(), 'src/lib/data/friends_db.json');

function getLocalData() {
  try {
    if (fs.existsSync(dbPath)) {
      return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    }
  } catch (err) {
    console.error('Error reading friends_db.json:', err);
  }
  return { friendships: [], mockStudents: [], invitations: [], directMessages: [] };
}

function saveLocalData(data: any) {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving friends_db.json:', err);
  }
}

export async function GET(req: Request) {
  try {
    const token = getBearerToken(req);
    let userId = 'current_user';

    // If Supabase token is present, resolve userId
    if (token) {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
      const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
      if (url && anon) {
        const client = createClient(url, anon);
        const { data } = await client.auth.getUser(token);
        if (data?.user?.id) userId = data.user.id;
      }
    }

    const localData = getLocalData();
    const studentsMap = new Map(localData.mockStudents.map((s: any) => [s.id, s]));

    // 1. Accepted Friends
    const acceptedFriendships = localData.friendships.filter(
      (f: any) => f.status === 'accepted' && (f.requester_id === userId || f.addressee_id === userId || f.requester_id === 'current_user' || f.addressee_id === 'current_user')
    );

    const friends = acceptedFriendships.map((f: any) => {
      const otherId = (f.requester_id === userId || f.requester_id === 'current_user') ? f.addressee_id : f.requester_id;
      return {
        friendshipId: f.id,
        connectedAt: f.updated_at,
        student: studentsMap.get(otherId) || {
          id: otherId,
          name: 'Student Peer',
          headline: 'PinIT Career Fellow',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + otherId,
          college: 'Engineering Campus',
          skills: ['Coding', 'Algorithms'],
          online: false
        }
      };
    });

    // 2. Incoming Pending Requests
    const incomingRequests = localData.friendships
      .filter((f: any) => f.status === 'pending' && (f.addressee_id === userId || f.addressee_id === 'current_user'))
      .map((f: any) => ({
        requestId: f.id,
        createdAt: f.created_at,
        sender: studentsMap.get(f.requester_id) || {
          id: f.requester_id,
          name: 'Student Peer',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + f.requester_id,
          college: 'Engineering Campus'
        }
      }));

    // 3. Sent Pending Requests
    const sentRequests = localData.friendships
      .filter((f: any) => f.status === 'pending' && (f.requester_id === userId || f.requester_id === 'current_user'))
      .map((f: any) => ({
        requestId: f.id,
        createdAt: f.created_at,
        recipient: studentsMap.get(f.addressee_id) || {
          id: f.addressee_id,
          name: 'Student Peer',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + f.addressee_id,
          college: 'Engineering Campus'
        }
      }));

    return NextResponse.json({
      ok: true,
      friends,
      incomingRequests,
      sentRequests,
      invitations: localData.invitations || [],
      counts: {
        friends: friends.length,
        incoming: incomingRequests.length,
        sent: sentRequests.length,
        invitations: (localData.invitations || []).length
      }
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Failed to fetch friends network' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const targetStudentId = body?.targetStudentId;
    if (!targetStudentId) {
      return NextResponse.json({ ok: false, error: 'targetStudentId is required' }, { status: 400 });
    }

    const localData = getLocalData();
    const existing = localData.friendships.find(
      (f: any) =>
        (f.requester_id === 'current_user' && f.addressee_id === targetStudentId) ||
        (f.requester_id === targetStudentId && f.addressee_id === 'current_user')
    );

    if (existing) {
      return NextResponse.json({ ok: true, status: existing.status, message: 'Friendship already exists' });
    }

    const newFriendship = {
      id: 'f-' + Date.now(),
      requester_id: 'current_user',
      addressee_id: targetStudentId,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    localData.friendships.push(newFriendship);
    saveLocalData(localData);

    return NextResponse.json({ ok: true, friendship: newFriendship });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Failed to send friend request' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const targetStudentId = searchParams.get('studentId');
    const friendshipId = searchParams.get('friendshipId');

    const localData = getLocalData();
    const initialLen = localData.friendships.length;

    localData.friendships = localData.friendships.filter((f: any) => {
      if (friendshipId && f.id === friendshipId) return false;
      if (targetStudentId && (f.requester_id === targetStudentId || f.addressee_id === targetStudentId)) return false;
      return true;
    });

    saveLocalData(localData);
    return NextResponse.json({ ok: true, removed: initialLen !== localData.friendships.length });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Failed to remove friendship' }, { status: 500 });
  }
}
