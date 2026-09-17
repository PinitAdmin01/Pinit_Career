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
  return { friendships: [], mockStudents: [], invitations: [], directMessages: [] };
}

function writeDb(data: any) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing friends_db.json:', err);
  }
}

// ── GET: List squad projects & project invitations ──────────────────────────
export async function GET(req: NextRequest) {
  try {
    const db = readDb();
    
    // Filter invitations for projects
    const allProjectInvites = (db.invitations || []).filter((inv: any) => inv.type === 'project');
    const incomingInvites = allProjectInvites.filter((inv: any) => inv.receiverId === 'current_user' || !inv.receiverId);
    const sentInvites = allProjectInvites.filter((inv: any) => inv.sender?.id === 'current_user');

    // Default mock squad projects
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
          { id: 'current_user', name: 'Vinay N', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100', role: 'Squad Lead' },
          { id: 'rahul_shetty', name: 'Rahul Shetty', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100', role: 'ML Engineer' },
          { id: 'aishwarya_rao', name: 'Aishwarya Rao', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100', role: 'UI/UX Lead' }
        ],
        techStack: ['Next.js', 'FastAPI', 'PostgreSQL', 'TailwindCSS'],
        deadline: 'Oct 15, 2026'
      },
      {
        id: 'squad-proj-02',
        title: 'Campus Transit Telemetry & Shuttle Tracker',
        description: 'Realtime GPS telemetry desk and IoT route optimization for campus shuttle buses.',
        role: 'Collaborator',
        status: 'Sprint 2',
        progress: 42,
        repoUrl: 'https://github.com/pinit-campus/transit-telemetry',
        members: [
          { id: 'arjun_nair', name: 'Arjun Nair', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100', role: 'Cloud Architect' },
          { id: 'current_user', name: 'Vinay N', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100', role: 'Frontend Lead' }
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
    const body = await req.json();
    const { studentId, studentName, studentAvatar, projectName, role, message, commitmentHours } = body;
    if (!studentId || !projectName) {
      return NextResponse.json({ ok: false, error: 'studentId and projectName are required' }, { status: 400 });
    }
    if (studentId === 'current_user') {
      return NextResponse.json({ ok: false, error: 'Cannot invite yourself to your own squad project' }, { status: 400 });
    }
    const numHours = Number(commitmentHours ?? 5);
    if (isNaN(numHours) || numHours < 1 || numHours > 60) {
      return NextResponse.json({ ok: false, error: 'Commitment hours must be between 1 and 60 hours per week' }, { status: 400 });
    }
    const dbPreCheck = readDb();
    const isBlocked = (dbPreCheck.blockedUsers || []).some((b: any) => b.studentId === studentId);
    if (isBlocked) {
      return NextResponse.json({ ok: false, error: 'Cannot invite a blocked student' }, { status: 403 });
    }
    const db = readDb();
    if (!db.invitations) db.invitations = [];

    const newInvite = {
      id: `proj-inv-${Date.now()}`,
      type: 'project',
      title: projectName,
      sender: {
        id: 'current_user',
        name: 'Vinay N',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'
      },
      receiverId: studentId,
      receiverName: studentName || 'Student',
      receiverAvatar: studentAvatar,
      role: role || 'Collaborator',
      details: `Role: ${role || 'Collaborator'} • ${commitmentHours || '5'} hrs/week • "${message || 'Join our squad'}"`,
      status: 'pending',
      created_at: new Date().toISOString()
    };

    db.invitations.unshift(newInvite);
    writeDb(db);

    return NextResponse.json({ ok: true, invitation: newInvite });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

// ── PATCH: Accept or Decline a squad project invitation ──────────────────────
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { inviteId, invitationId, action } = body;
    const effectiveId = inviteId || invitationId;
    if (!effectiveId || !['accept', 'decline'].includes(action)) {
      return NextResponse.json({ ok: false, error: 'Invalid inviteId or action' }, { status: 400 });
    }

    const db = readDb();
    const invIndex = (db.invitations || []).findIndex((i: any) => i.id === effectiveId);

    if (invIndex === -1) {
      return NextResponse.json({ ok: false, error: 'Invitation not found' }, { status: 404 });
    }
    if (db.invitations[invIndex].status !== 'pending') {
      return NextResponse.json({ ok: false, error: 'Invitation has already been ' + db.invitations[invIndex].status }, { status: 400 });
    }
    db.invitations[invIndex].status = action === 'accept' ? 'accepted' : 'declined';
    db.invitations[invIndex].responded_at = new Date().toISOString();

    writeDb(db);

    return NextResponse.json({
      ok: true,
      invitation: db.invitations[invIndex],
      message: action === 'accept' ? 'Joined project squad successfully!' : 'Project invitation declined.'
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}