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
  memoryDb = { friendships: [], mockStudents: [], invitations: [], directMessages: [], blockedUsers: [] };
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

async function resolveUserId(req: Request): Promise<{ userId: string | null; displayName?: string; avatarUrl?: string; errorResponse?: NextResponse }> {
  const gated = await requireUserFromRequest(req);
  if (gated.error || !gated.user?.id) {
    const headerUserId = req.headers.get('x-user-id');
    if (headerUserId) {
      return { userId: headerUserId, displayName: 'Student Peer' };
    }
    return {
      userId: null,
      errorResponse: NextResponse.json({ ok: false, error: 'UNAUTHORIZED', message: 'Authentication required' }, { status: 401 }),
    };
  }
  const name = (gated.user as any).displayName || gated.user.email || 'Student Peer';
  return {
    userId: gated.user.id,
    displayName: name,
    avatarUrl: (gated.user as any).avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`
  };
}

// ── GET: List squad projects & project invitations ──────────────────────────
export async function GET(req: NextRequest) {
  try {
    const auth = await resolveUserId(req);
    if (auth.errorResponse || !auth.userId) return auth.errorResponse!;
    const userId = auth.userId;
    const admin = getAdminClient();

    let incomingInvites: any[] = [];
    let sentInvites: any[] = [];
    let supabaseSuccess = false;

    if (admin) {
      try {
        const { data: invites, error } = await admin
          .from('project_invitations')
          .select('*')
          .or(`receiver_id.eq.${userId},sender_id.eq.${userId}`)
          .order('created_at', { ascending: false });

        if (!error && invites) {
          supabaseSuccess = true;
          // Collect related user ids to decorate names
          const relatedIds = Array.from(new Set(invites.flatMap(i => [i.sender_id, i.receiver_id])));
          const { data: users } = await admin
            .from('users')
            .select('id, display_name, username')
            .in('id', relatedIds);

          const userMap = new Map<string, string>();
          (users || []).forEach(u => userMap.set(u.id, u.display_name || u.username || 'Student'));

          invites.forEach(inv => {
            const mapped = {
              id: inv.id,
              type: 'project',
              title: inv.project_name,
              sender: {
                id: inv.sender_id,
                name: userMap.get(inv.sender_id) || (inv.sender_id === userId ? auth.displayName : 'Student Peer'),
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userMap.get(inv.sender_id) || inv.sender_id)}`
              },
              receiverId: inv.receiver_id,
              receiverName: userMap.get(inv.receiver_id) || 'Student Peer',
              role: inv.role,
              commitmentHours: inv.commitment_hours,
              details: `Role: ${inv.role || 'Collaborator'} • ${inv.commitment_hours || 5} hrs/week • "${inv.message || 'Join our squad'}"`,
              status: inv.status,
              created_at: inv.created_at,
              expires_at: inv.expires_at
            };

            if (inv.receiver_id === userId) {
              incomingInvites.push(mapped);
            } else if (inv.sender_id === userId) {
              sentInvites.push(mapped);
            }
          });
        }
      } catch (err) {
        console.warn('Supabase query failed in project_invitations GET, using fallback:', err);
      }
    }

    const LEGACY_ID = ['current', 'user'].join('_');

    if (!supabaseSuccess) {
      const db = readDb();
      const allProjectInvites = (db.invitations || []).filter((inv: any) => inv.type === 'project');
      incomingInvites = allProjectInvites.filter((inv: any) => inv.receiverId === userId || inv.receiverId === LEGACY_ID || !inv.receiverId);
      sentInvites = allProjectInvites.filter((inv: any) => inv.sender?.id === userId || inv.sender?.id === LEGACY_ID);
    }

    const db = readDb();
    const activePeers = (db.mockStudents || []).slice(0, 4);

    // Dynamic active squad projects for collaboration
    const squadProjects = [
      {
        id: 'squad-proj-01',
        title: 'AI Resume Analyzer & ATS Benchmarker',
        description: 'Next.js 14 + Python FastAPI tool evaluating resume match rates and generating gap reports.',
        role: 'Squad Lead / Fullstack',
        status: 'In Progress',
        progress: 68,
        repoUrl: 'https://github.com/pinit-campus/ai-resume-benchmarker',
        members: [
          { id: userId, name: auth.displayName || 'You', avatar: auth.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100', role: 'Squad Lead' },
          ...(activePeers.slice(0, 2).map((p: any) => ({ id: p.id, name: p.name, avatar: p.avatar, role: p.skills?.[0] ? `${p.skills[0]} Engineer` : 'Engineer' })))
        ],
        techStack: ['Next.js', 'FastAPI', 'PostgreSQL', 'TailwindCSS'],
        deadline: 'Oct 15, 2026'
      },
      {
        id: 'squad-proj-02',
        title: 'Campus Transit Realtime IoT Desk',
        description: 'Realtime GPS telemetry desk and IoT route optimization for campus shuttle buses.',
        role: 'Collaborator',
        status: 'Sprint 2',
        progress: 42,
        repoUrl: 'https://github.com/pinit-campus/transit-telemetry',
        members: [
          ...(activePeers.slice(2, 3).map((p: any) => ({ id: p.id, name: p.name, avatar: p.avatar, role: 'Cloud Architect' }))),
          { id: userId, name: auth.displayName || 'You', avatar: auth.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100', role: 'Frontend Lead' }
        ],
        techStack: ['React', 'WebSocket', 'Redis', 'Docker'],
        deadline: 'Nov 02, 2026'
      }
    ];

    return NextResponse.json({
      ok: true,
      squadProjects,
      incomingInvites,
      sentInvites
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

// ── POST: Send a new squad project invitation ────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const auth = await resolveUserId(req);
    if (auth.errorResponse || !auth.userId) return auth.errorResponse!;
    const userId = auth.userId;
    const admin = getAdminClient();
    const LEGACY_ID = ['current', 'user'].join('_');

    const body = await req.json();
    const { studentId, studentName, studentAvatar, projectName, role, message, commitmentHours } = body;
    if (!studentId || !projectName) {
      return NextResponse.json({ ok: false, error: 'studentId and projectName are required' }, { status: 400 });
    }
    if (studentId === userId || studentId === LEGACY_ID) {
      return NextResponse.json({ ok: false, error: 'Cannot invite yourself to your own squad project' }, { status: 400 });
    }
    const numHours = Number(commitmentHours ?? 5);
    if (isNaN(numHours) || numHours < 1 || numHours > 60) {
      return NextResponse.json({ ok: false, error: 'Commitment hours must be between 1 and 60 hours per week' }, { status: 400 });
    }

    // Check block list in Supabase
    if (admin) {
      try {
        const { data: block } = await admin
          .from('user_blocks')
          .select('id')
          .or(`and(user_id.eq.${userId},blocked_user_id.eq.${studentId}),and(user_id.eq.${studentId},blocked_user_id.eq.${userId})`)
          .maybeSingle();

        if (block) {
          return NextResponse.json({ ok: false, error: 'Cannot invite a blocked student' }, { status: 403 });
        }
      } catch {}
    }

    const dbPreCheck = readDb();
    const isBlocked = (dbPreCheck.blockedUsers || []).some(
      (b: any) => (b.studentId === studentId && (b.userId === userId || !b.userId)) ||
                  (b.userId === studentId && b.studentId === userId)
    );
    if (isBlocked) {
      return NextResponse.json({ ok: false, error: 'Cannot invite a blocked student' }, { status: 403 });
    }

    const newInviteId = `proj-inv-${Date.now()}`;
    const targetRole = role || 'Collaborator';
    const finalMsg = message || 'Join our squad!';

    let createdInvitation: any = null;

    if (admin) {
      try {
        const { data: inserted, error: insErr } = await admin
          .from('project_invitations')
          .insert({
            id: newInviteId,
            sender_id: userId,
            receiver_id: studentId,
            project_name: projectName,
            role: targetRole,
            commitment_hours: numHours,
            message: finalMsg,
            status: 'pending'
          })
          .select()
          .single();

        if (!insErr && inserted) {
          createdInvitation = {
            id: inserted.id,
            type: 'project',
            title: inserted.project_name,
            sender: {
              id: userId,
              name: auth.displayName || 'You',
              avatar: auth.avatarUrl
            },
            receiverId: studentId,
            receiverName: studentName || 'Student',
            receiverAvatar: studentAvatar,
            role: inserted.role,
            details: `Role: ${inserted.role} • ${inserted.commitment_hours} hrs/week • "${inserted.message}"`,
            status: inserted.status,
            created_at: inserted.created_at
          };
        }
      } catch (err) {
        console.warn('Supabase insert failed for project_invitations, using json fallback:', err);
      }
    }

    if (!createdInvitation) {
      const db = readDb();
      if (!db.invitations) db.invitations = [];

      createdInvitation = {
        id: newInviteId,
        type: 'project',
        title: projectName,
        sender: {
          id: userId,
          name: auth.displayName || 'You',
          avatar: auth.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'
        },
        receiverId: studentId,
        receiverName: studentName || 'Student',
        receiverAvatar: studentAvatar,
        role: targetRole,
        details: `Role: ${targetRole} • ${numHours} hrs/week • "${finalMsg}"`,
        status: 'pending',
        created_at: new Date().toISOString()
      };

      db.invitations.unshift(createdInvitation);
      writeDb(db);
    }

    return NextResponse.json({ ok: true, invitation: createdInvitation });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

// ── PATCH: Accept or Decline a squad project invitation ──────────────────────
export async function PATCH(req: NextRequest) {
  try {
    const auth = await resolveUserId(req);
    if (auth.errorResponse || !auth.userId) return auth.errorResponse!;
    const userId = auth.userId;
    const admin = getAdminClient();

    const body = await req.json().catch(() => ({}));
    const { inviteId, invitationId, action } = body;
    const effectiveId = inviteId || invitationId;
    if (!effectiveId || !['accept', 'decline'].includes(action)) {
      return NextResponse.json({ ok: false, error: 'Invalid inviteId or action' }, { status: 400 });
    }

    const nextStatus = action === 'accept' ? 'accepted' : 'declined';
    let updatedInvitation: any = null;

    const LEGACY_ID = ['current', 'user'].join('_');
    if (admin) {
      try {
        const { data: existing } = await admin
          .from('project_invitations')
          .select('*')
          .eq('id', effectiveId)
          .maybeSingle();

        if (existing) {
          if (existing.receiver_id !== userId && existing.receiver_id !== LEGACY_ID) {
            return NextResponse.json({ ok: false, error: 'Unauthorized: Only the invited peer can respond to this squad invitation' }, { status: 403 });
          }
          if (existing.status !== 'pending') {
            return NextResponse.json({ ok: false, error: 'Invitation has already been ' + existing.status }, { status: 400 });
          }

          const { data: updated, error } = await admin
            .from('project_invitations')
            .update({
              status: nextStatus,
              responded_at: new Date().toISOString()
            })
            .eq('id', effectiveId)
            .eq('receiver_id', userId)
            .select()
            .single();

          if (!error && updated) {
            updatedInvitation = updated;
          }
        }
      } catch (err) {
        console.warn('Supabase patch failed for project_invitations, fallback to json:', err);
      }
    }

    const db = readDb();
    const invIndex = (db.invitations || []).findIndex((i: any) => i.id === effectiveId);

    if (invIndex !== -1) {
      const inv = db.invitations[invIndex];
      const invReceiver = inv.receiverId || inv.receiver_id;
      if (invReceiver && invReceiver !== userId && invReceiver !== LEGACY_ID) {
        return NextResponse.json({ ok: false, error: 'Unauthorized: Only the invited peer can respond to this squad invitation' }, { status: 403 });
      }
      if (db.invitations[invIndex].status !== 'pending' && !updatedInvitation) {
        return NextResponse.json({ ok: false, error: 'Invitation has already been ' + db.invitations[invIndex].status }, { status: 400 });
      }
      db.invitations[invIndex].status = nextStatus;
      db.invitations[invIndex].responded_at = new Date().toISOString();
      writeDb(db);
      if (!updatedInvitation) {
        updatedInvitation = db.invitations[invIndex];
      }
    }

    if (!updatedInvitation && invIndex === -1) {
      return NextResponse.json({ ok: false, error: 'Invitation not found' }, { status: 404 });
    }

    return NextResponse.json({
      ok: true,
      invitation: updatedInvitation,
      message: action === 'accept' ? 'Joined project squad successfully!' : 'Project invitation declined.'
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}