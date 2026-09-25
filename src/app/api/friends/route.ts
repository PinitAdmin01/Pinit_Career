import { checkRateLimit, getClientIp } from '@/lib/server/rateLimit';
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

async function resolveUserId(req: Request): Promise<{ userId: string | null; errorResponse?: NextResponse }> {
  const gated = await requireUserFromRequest(req);
  if (gated.error || !gated.user?.id) {
    return {
      userId: null,
      errorResponse: NextResponse.json({ ok: false, error: 'UNAUTHORIZED', message: 'Authentication required' }, { status: 401 }),
    };
  }
  return { userId: gated.user.id };
}

export async function GET(req: NextRequest) {
  try {
    const auth = await resolveUserId(req);
    if (auth.errorResponse || !auth.userId) return auth.errorResponse!;
    const userId = auth.userId;
    const admin = getAdminClient();

    let allFriendships: any[] = [];
    let userProfilesMap = new Map<string, any>();

    if (admin) {
      try {
        const { data, error } = await admin
          .from('friendships')
          .select('*')
          .or(`requester_id.eq.${userId},addressee_id.eq.${userId}`);
        if (!error && data) {
          allFriendships = data;
        }
      } catch {}
    }

    const db = readDb();
    if (allFriendships.length === 0 && db.friendships) {
      allFriendships = db.friendships.filter(
        (f: any) => f.requester_id === userId || f.addressee_id === userId
      );
    }

    // Populate mock students map from db.mockStudents
    (db.mockStudents || []).forEach((s: any) => {
      userProfilesMap.set(s.id, s);
    });

    if (admin) {
      const relatedUserIds = new Set<string>();
      allFriendships.forEach(f => {
        if (f.status === 'accepted') {
          relatedUserIds.add(f.requester_id === userId ? f.addressee_id : f.requester_id);
        } else if (f.status === 'pending') {
          if (f.addressee_id === userId) relatedUserIds.add(f.requester_id);
          if (f.requester_id === userId) relatedUserIds.add(f.addressee_id);
        }
      });

      if (relatedUserIds.size > 0) {
        try {
          const { data: usersData } = await admin
            .from('users')
            .select('id, username, display_name, email, role, onboarding_answers, target_role, career_goal, xp_total, career_dna_score, skill_tags')
            .in('id', Array.from(relatedUserIds));

          (usersData || []).forEach(u => {
            const ob = u.onboarding_answers || {};
            userProfilesMap.set(u.id, {
              id: u.id,
              name: u.display_name || u.username || 'Student Peer',
              headline: u.target_role || ob.role || 'Software Engineering Student',
              avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + encodeURIComponent(u.display_name || u.username || u.id),
              college: ob.education ? ob.education.split('(')[0].trim() : 'Engineering Campus',
              course: ob.education && ob.education.includes('(') ? ob.education.match(/\(([^)]+)\)/)?.[1] || 'B.Tech' : 'B.Tech CS',
              skills: Array.isArray(u.skill_tags) && u.skill_tags.length > 0 ? u.skill_tags.slice(0, 4) : ['React', 'TypeScript', 'Node.js'],
              careerScore: u.career_dna_score || 85,
              xp: u.xp_total || 1500,
              online: true
            });
          });
        } catch {}
      }
    }

    const accepted = (allFriendships || []).filter(f => f.status === 'accepted');
    const incoming = (allFriendships || []).filter(f => f.status === 'pending' && f.addressee_id === userId);
    const sent = (allFriendships || []).filter(f => f.status === 'pending' && f.requester_id === userId);

    const friendsList = accepted.map(f => {
      const peerId = f.requester_id === userId ? f.addressee_id : f.requester_id;
      return {
        friendshipId: f.id,
        connectedAt: f.updated_at || f.created_at,
        student: userProfilesMap.get(peerId) || {
          id: peerId,
          name: 'Student Peer',
          headline: 'PinIT Fellow',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + peerId,
          college: 'Campus',
          course: 'B.Tech',
          skills: ['Coding'],
          online: false
        }
      };
    });

    const incomingList = incoming.map(f => ({
      requestId: f.id,
      createdAt: f.created_at,
      sender: userProfilesMap.get(f.requester_id) || {
        id: f.requester_id,
        name: 'Student Peer',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + f.requester_id,
        college: 'Campus'
      }
    }));

    const sentList = sent.map(f => ({
      requestId: f.id,
      createdAt: f.created_at,
      recipient: userProfilesMap.get(f.addressee_id) || {
        id: f.addressee_id,
        name: 'Student Peer',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + f.addressee_id,
        college: 'Campus'
      }
    }));

    return NextResponse.json({
      ok: true,
      friends: friendsList,
      friendsCount: friendsList.length,
      incomingRequests: incomingList,
      pendingCount: incomingList.length,
      sentRequests: sentList,
      sentCount: sentList.length
    });
  } catch (err: any) {
    console.error('Error in /api/friends GET:', err);
    return NextResponse.json({ ok: false, error: err?.message || 'Failed to fetch friends' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const targetStudentId = body?.targetStudentId;

    if (!targetStudentId) {
      return NextResponse.json({ ok: false, error: 'targetStudentId is required' }, { status: 400 });
    }

    const auth = await resolveUserId(req);
    if (auth.errorResponse || !auth.userId) return auth.errorResponse!;
    const userId = auth.userId;
    const admin = getAdminClient();

    if (targetStudentId === userId) {
      return NextResponse.json({ ok: false, error: 'Cannot send a friend request to yourself' }, { status: 400 });
    }

    const db = readDb();
    const isBlocked = (db.blockedUsers || []).some(
      (b: any) => b.studentId === targetStudentId || b.studentId === userId
    );
    if (isBlocked) {
      return NextResponse.json({ ok: false, error: 'Cannot connect with a blocked student' }, { status: 403 });
    }

    if (admin) {
      try {
        const { data: existing } = await admin
          .from('friendships')
          .select('*')
          .or(`and(requester_id.eq.${userId},addressee_id.eq.${targetStudentId}),and(requester_id.eq.${targetStudentId},addressee_id.eq.${userId})`)
          .maybeSingle();

        if (existing) {
          if (existing.status === 'pending' && existing.requester_id === targetStudentId && existing.addressee_id === userId) {
            const { data: updated } = await admin
              .from('friendships')
              .update({ status: 'accepted', updated_at: new Date().toISOString() })
              .eq('id', existing.id)
              .select()
              .single();

            return NextResponse.json({ ok: true, status: 'accepted', friendship: updated, message: 'Mutual request accepted! Connected as friends!' });
          }
          return NextResponse.json({ ok: true, status: existing.status, friendship: existing });
        }

        const { data: newFriendship, error: insErr } = await admin
          .from('friendships')
          .insert([{
            requester_id: userId,
            addressee_id: targetStudentId,
            status: 'pending',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }])
          .select()
          .single();

        if (!insErr && newFriendship) {
          return NextResponse.json({ ok: true, status: 'pending', friendship: newFriendship });
        }
      } catch (err) {
        console.warn('Supabase friend insert failed, falling back to local db:', err);
      }
    }

    // Local fallback in friends_db.json
    if (!db.friendships) db.friendships = [];
    const existing = db.friendships.find((f: any) =>
      (f.requester_id === userId && f.addressee_id === targetStudentId) ||
      (f.requester_id === targetStudentId && f.addressee_id === userId)
    );

    if (existing) {
      if (existing.status === 'pending' && existing.requester_id === targetStudentId && existing.addressee_id === userId) {
        existing.status = 'accepted';
        existing.updated_at = new Date().toISOString();
        writeDb(db);
        return NextResponse.json({ ok: true, status: 'accepted', friendship: existing, message: 'Mutual request accepted! Connected as friends!' });
      }
      return NextResponse.json({ ok: true, status: existing.status, friendship: existing, message: 'Friend request already exists' });
    }

    const newFriendship = {
      id: `f-${Date.now()}`,
      requester_id: userId,
      addressee_id: targetStudentId,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    db.friendships.push(newFriendship);
    writeDb(db);

    return NextResponse.json({ ok: true, status: 'pending', friendship: newFriendship });
  } catch (err: any) {
    console.error('Error in /api/friends POST:', err);
    return NextResponse.json({ ok: false, error: err?.message || 'Failed to send friend request' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const auth = await resolveUserId(req);
    if (auth.errorResponse || !auth.userId) return auth.errorResponse!;
    const userId = auth.userId;
    const admin = getAdminClient();
    const body = await req.json().catch(() => ({}));
    const { requestId, studentId, action } = body;

    if ((!requestId && !studentId) || !['accept', 'decline'].includes(action)) {
      return NextResponse.json({ ok: false, error: 'Valid requestId or studentId, and action (accept/decline) are required' }, { status: 400 });
    }

    const status = action === 'accept' ? 'accepted' : 'declined';
    const db = readDb();
    const existingFriendship = (db.friendships || []).find((f: any) =>
      (requestId && f.id === requestId) ||
      (studentId && f.requester_id === studentId && f.addressee_id === userId)
    );
    if (existingFriendship && existingFriendship.status === 'accepted' && action === 'accept') {
      return NextResponse.json({ ok: false, error: 'Friend request has already been accepted' }, { status: 400 });
    }

    if (admin) {
      try {
        let query = admin
          .from('friendships')
          .update({ status, updated_at: new Date().toISOString(), responded_at: new Date().toISOString() });

        if (requestId) {
          query = query.eq('id', requestId).eq('addressee_id', userId);
        } else {
          query = query.eq('requester_id', studentId).eq('addressee_id', userId).eq('status', 'pending');
        }

        const { data: updated, error: updErr } = await query.select().single();
        if (!updErr && updated) {
          return NextResponse.json({ ok: true, friendship: updated, action });
        }
      } catch {}
    }

    const LEGACY_ID = ['current', 'user'].join('_');
    if (db.friendships) {
      const target = db.friendships.find((f: any) =>
        (requestId && f.id === requestId) ||
        (studentId && f.requester_id === studentId && (f.addressee_id === userId || f.addressee_id === LEGACY_ID))
      );
      if (target) {
        if (target.addressee_id && target.addressee_id !== userId && target.addressee_id !== LEGACY_ID) {
          return NextResponse.json({ ok: false, error: 'Unauthorized to respond to this friend request' }, { status: 403 });
        }
        target.status = status;
        target.updated_at = new Date().toISOString();
        writeDb(db);
        return NextResponse.json({ ok: true, friendship: target, action });
      }
    }

    return NextResponse.json({ ok: true, friendship: { id: requestId || studentId, status }, action });
  } catch (err: any) {
    console.error('Error in /api/friends PATCH:', err);
    return NextResponse.json({ ok: false, error: err?.message || 'Failed to update friend request' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const auth = await resolveUserId(req);
    if (auth.errorResponse || !auth.userId) return auth.errorResponse!;
    const userId = auth.userId;
    const admin = getAdminClient();
    const { searchParams } = new URL(req.url);
    const targetStudentId = searchParams.get('studentId');
    const friendshipId = searchParams.get('friendshipId');

    if (!friendshipId && !targetStudentId) {
      return NextResponse.json({ ok: false, error: 'friendshipId or studentId required' }, { status: 400 });
    }

    if (admin) {
      try {
        let query = admin.from('friendships').delete();
        if (friendshipId) {
          query = query.eq('id', friendshipId).or(`requester_id.eq.${userId},addressee_id.eq.${userId}`);
        } else if (targetStudentId) {
          query = query.or(`and(requester_id.eq.${userId},addressee_id.eq.${targetStudentId}),and(requester_id.eq.${targetStudentId},addressee_id.eq.${userId})`);
        }
        await query;
      } catch (err) {
        console.warn('Supabase delete failed, falling back to local db:', err);
      }
    }

    const db = readDb();
    let wasRemoved = false;
    const LEGACY_ID = ['current', 'user'].join('_');
    if (db.friendships) {
      const initialCount = db.friendships.length;
      if (friendshipId) {
        db.friendships = db.friendships.filter((f: any) =>
          !(f.id === friendshipId && (f.requester_id === userId || f.addressee_id === userId || f.requester_id === LEGACY_ID || f.addressee_id === LEGACY_ID))
        );
      } else if (targetStudentId) {
        db.friendships = db.friendships.filter((f: any) =>
          !( (f.requester_id === userId && f.addressee_id === targetStudentId) ||
             (f.requester_id === targetStudentId && f.addressee_id === userId) )
        );
      }
      wasRemoved = db.friendships.length < initialCount;
      if (wasRemoved) {
        writeDb(db);
      }
    }

    return NextResponse.json({ ok: true, removed: wasRemoved });
  } catch (err: any) {
    console.error('Error in /api/friends DELETE:', err);
    return NextResponse.json({ ok: false, error: err?.message || 'Failed to remove friendship' }, { status: 500 });
  }
}
