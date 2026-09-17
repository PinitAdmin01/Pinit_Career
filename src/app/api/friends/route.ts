import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getBearerToken } from '@/lib/server/requireAuth';

export const dynamic = 'force-dynamic';

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
}

async function resolveUserId(req: Request, admin: any): Promise<string> {
  const token = getBearerToken(req);
  if (token) {
    try {
      const { data } = await admin.auth.getUser(token);
      if (data?.user?.id) return data.user.id;
    } catch {}
  }
  // If no auth token, check if header has x-user-id or fallback to demo/first user
  const headerUserId = req.headers.get('x-user-id');
  if (headerUserId) return headerUserId;

  const { data: firstUser } = await admin.from('users').select('id').limit(1).maybeSingle();
  return firstUser?.id || 'eadc572e-443b-4f41-baa0-1f471d70a9aa';
}

export async function GET(req: NextRequest) {
  try {
    const admin = getAdminClient();
    const userId = await resolveUserId(req, admin);

    // Fetch friendships involving the user
    const { data: allFriendships, error: fErr } = await admin
      .from('friendships')
      .select('*')
      .or(`requester_id.eq.${userId},addressee_id.eq.${userId}`);

    if (fErr) throw fErr;

    const accepted = (allFriendships || []).filter(f => f.status === 'accepted');
    const incoming = (allFriendships || []).filter(f => f.status === 'pending' && f.addressee_id === userId);
    const sent = (allFriendships || []).filter(f => f.status === 'pending' && f.requester_id === userId);

    // Collect related user IDs
    const relatedUserIds = new Set<string>();
    accepted.forEach(f => {
      relatedUserIds.add(f.requester_id === userId ? f.addressee_id : f.requester_id);
    });
    incoming.forEach(f => relatedUserIds.add(f.requester_id));
    sent.forEach(f => relatedUserIds.add(f.addressee_id));

    let userProfilesMap = new Map<string, any>();
    if (relatedUserIds.size > 0) {
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
    }

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
    const admin = getAdminClient();
    const userId = await resolveUserId(req, admin);
    const body = await req.json().catch(() => ({}));
    const targetStudentId = body?.targetStudentId;

    if (!targetStudentId) {
      return NextResponse.json({ ok: false, error: 'targetStudentId is required' }, { status: 400 });
    }
    if (targetStudentId === userId) {
      return NextResponse.json({ ok: false, error: 'Cannot send a friend request to yourself' }, { status: 400 });
    }

    // Check if friendship already exists
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

        return NextResponse.json({ ok: true, status: 'accepted', friendship: updated, message: 'Connected as friends!' });
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

    if (insErr) throw insErr;

    return NextResponse.json({ ok: true, status: 'pending', friendship: newFriendship });
  } catch (err: any) {
    console.error('Error in /api/friends POST:', err);
    return NextResponse.json({ ok: false, error: err?.message || 'Failed to send friend request' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const admin = getAdminClient();
    const body = await req.json().catch(() => ({}));
    const { requestId, action } = body;

    if (!requestId || !['accept', 'decline'].includes(action)) {
      return NextResponse.json({ ok: false, error: 'Valid requestId and action (accept/decline) are required' }, { status: 400 });
    }

    const status = action === 'accept' ? 'accepted' : 'declined';
    const { data: updated, error: updErr } = await admin
      .from('friendships')
      .update({ status, updated_at: new Date().toISOString(), responded_at: new Date().toISOString() })
      .eq('id', requestId)
      .select()
      .single();

    if (updErr) throw updErr;

    return NextResponse.json({ ok: true, friendship: updated, action });
  } catch (err: any) {
    console.error('Error in /api/friends PATCH:', err);
    return NextResponse.json({ ok: false, error: err?.message || 'Failed to update friend request' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const admin = getAdminClient();
    const userId = await resolveUserId(req, admin);
    const { searchParams } = new URL(req.url);
    const targetStudentId = searchParams.get('studentId');
    const friendshipId = searchParams.get('friendshipId');

    let query = admin.from('friendships').delete();
    if (friendshipId) {
      query = query.eq('id', friendshipId);
    } else if (targetStudentId) {
      query = query.or(`and(requester_id.eq.${userId},addressee_id.eq.${targetStudentId}),and(requester_id.eq.${targetStudentId},addressee_id.eq.${userId})`);
    } else {
      return NextResponse.json({ ok: false, error: 'friendshipId or studentId required' }, { status: 400 });
    }

    const { error: delErr } = await query;
    if (delErr) throw delErr;

    return NextResponse.json({ ok: true, removed: true });
  } catch (err: any) {
    console.error('Error in /api/friends DELETE:', err);
    return NextResponse.json({ ok: false, error: err?.message || 'Failed to remove friendship' }, { status: 500 });
  }
}
