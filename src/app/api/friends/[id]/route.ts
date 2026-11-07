import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
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
  return { mockStudents: [] };
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

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const studentId = params.id;

    if (!studentId) {
      return NextResponse.json({ ok: false, error: 'Student ID required' }, { status: 400 });
    }

    const admin = getAdminClient();
    let user: any = null;

    // Check optional viewer auth to compute relationship status
    let viewerId: string | null = null;
    let isSelf = false;
    let relationship: 'friends' | 'sent' | 'received' | 'none' = 'none';

    try {
      const gated = await requireUserFromRequest(req);
      if (!gated.error && gated.user?.id) {
        viewerId = gated.user.id;
        if (viewerId === studentId) {
          isSelf = true;
        }
      }
    } catch {}

    if (viewerId && !isSelf && admin) {
      try {
        const { data: fr } = await admin
          .from('friendships')
          .select('status, requester_id, addressee_id')
          .or(`and(requester_id.eq.${viewerId},addressee_id.eq.${studentId}),and(requester_id.eq.${studentId},addressee_id.eq.${viewerId})`)
          .maybeSingle();

        if (fr) {
          if (fr.status === 'accepted') relationship = 'friends';
          else if (fr.status === 'pending') {
            relationship = fr.requester_id === viewerId ? 'sent' : 'received';
          }
        }
      } catch {}
    }

    if (admin) {
      try {
        const { data, error } = await admin
          .from('users')
          .select('id, username, display_name, email, role, onboarding_answers, target_role, career_goal, xp_total, career_dna_score, skill_tags, missions_completed, vault_count, league_tier, created_at')
          .eq('id', studentId)
          .maybeSingle();

        if (!error && data) {
          user = data;
        }
      } catch (err) {
        console.warn('Supabase query in /api/friends/[id] failed:', err);
      }
    }

    if (viewerId && !isSelf && relationship === 'none') {
      const db = readDb();
      const fr = (db.friendships || []).find((f: any) =>
        (f.requester_id === viewerId && f.addressee_id === studentId) ||
        (f.requester_id === studentId && f.addressee_id === viewerId)
      );
      if (fr) {
        if (fr.status === 'accepted') relationship = 'friends';
        else if (fr.status === 'pending') {
          relationship = fr.requester_id === viewerId ? 'sent' : 'received';
        }
      }
    }

    if (user) {
      const nonStudentRoles = new Set(['recruiter', 'consultant', 'parent', 'admin', 'teacher', 'faculty', 'institution_admin', 'super_admin']);
      const testNonStudentRegex = /\b(test recruiter|live recruiter|live consultant|live parent|live admin|recruiter|consultant|tester)\b/i;
      const r = (user.role || '').toLowerCase().trim();
      const nameLower = (user.display_name || user.username || '').toLowerCase();
      const emailLower = (user.email || '').toLowerCase();

      if ((r && nonStudentRoles.has(r)) || (r && r !== 'student') || testNonStudentRegex.test(nameLower) || testNonStudentRegex.test(emailLower)) {
        return NextResponse.json({ ok: false, error: 'NOT_FOUND', message: 'Student profile not found' }, { status: 404 });
      }

      const ob = user.onboarding_answers || {};
      const rawSkills: any[] = Array.isArray(user.skill_tags) && user.skill_tags.length > 0
        ? user.skill_tags
        : (typeof ob.skills === 'string' && ob.skills.trim().length > 0
            ? [ob.skills]
            : []);

      // Sanitize skills: strip "Skills:" prefix, split on comma/semicolon/newline (preserve Next.js, Node.js)
      const cleanSkills = rawSkills
        .flatMap((item: any) => {
          if (typeof item !== 'string') return [];
          return item
            .replace(/^skills?[\s:-]+/i, '')
            .split(/[,;\n]+/)
            .map((s: string) => s.replace(/^skills?[\s:-]+/i, '').trim())
            .filter((s: string) => s.length > 1 && s.length < 35);
        })
        .filter((s: string, idx: number, arr: string[]) => arr.indexOf(s) === idx)
        .slice(0, 8);

      const name = user.display_name || user.username || 'Student Peer';
      const college = ob.education ? ob.education.split('(')[0].trim() : 'Campus Student';
      const course = ob.education && ob.education.includes('(') ? ob.education.match(/\(([^)]+)\)/)?.[1] || 'Degree' : 'Undergraduate';

      return NextResponse.json({
        ok: true,
        student: {
          id: user.id,
          name,
          headline: user.target_role || ob.role || 'CareerOS Student',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + encodeURIComponent(name),
          college,
          course,
          careerGoal: user.career_goal || user.target_role || ob.role || 'Aspiring Professional',
          skills: cleanSkills,
          careerScore: user.career_dna_score || 0,
          xp: user.xp_total || 0,
          arenaWins: user.missions_completed || 0,
          projectsCount: user.vault_count || 0,
          leagueTier: user.league_tier || 'Bronze',
          online: true,
          relationship,
          isSelf,
          memberSince: user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '2026'
        }
      });
    }

    // ZERO MOCK / DEMO DATA INVARIANT: Return 404 if student does not exist
    return NextResponse.json({ ok: false, error: 'NOT_FOUND', message: 'Student profile not found' }, { status: 404 });
  } catch (err: any) {
    console.error('Error fetching student profile:', err);
    return NextResponse.json({ ok: false, error: err?.message || 'Failed to fetch student' }, { status: 500 });
  }
}
