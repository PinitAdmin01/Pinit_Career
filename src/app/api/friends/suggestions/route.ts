import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getBearerToken } from '@/lib/server/requireAuth';
import { CURRENT_STUDENT_PROFILE, rankAndFilterStudents, MatchStudentProfile } from '@/lib/friends/matching';
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

async function resolveUserId(req: Request, admin: any): Promise<string> {
  const token = getBearerToken(req);
  if (token && admin) {
    try {
      const { data } = await admin.auth.getUser(token);
      if (data?.user?.id) return data.user.id;
    } catch {}
  }
  const headerUserId = req.headers.get('x-user-id');
  if (headerUserId) return headerUserId;
  return 'current_user';
}

export async function GET(req: NextRequest) {
  try {
    const admin = getAdminClient();
    const userId = await resolveUserId(req, admin);
    const { searchParams } = new URL(req.url);
    const filter = (searchParams.get('filter') || 'all') as any;
    const search = (searchParams.get('q') || '').toLowerCase().trim();

    const db = readDb();
    const blockedIds = new Set<string>((db.blockedUsers || []).map((b: any) => b.studentId));

    // 1. Get existing connections (accepted or pending) to exclude
    const connectedIds = new Set<string>();
    if (userId) {
      connectedIds.add(userId);
      if (admin) {
        try {
          const { data: connections } = await admin
            .from('friendships')
            .select('requester_id, addressee_id')
            .or('requester_id.eq.' + userId + ',addressee_id.eq.' + userId);
          (connections || []).forEach((c: any) => {
            if (c.requester_id) connectedIds.add(c.requester_id);
            if (c.addressee_id) connectedIds.add(c.addressee_id);
          });
        } catch {}
      }

      (db.friendships || []).forEach((c: any) => {
        if (c.requester_id === userId && c.addressee_id) connectedIds.add(c.addressee_id);
        if (c.addressee_id === userId && c.requester_id) connectedIds.add(c.requester_id);
      });
    }

    let candidates: MatchStudentProfile[] = [];

    // 2. Fetch real users from Supabase users table if available
    if (admin) {
      try {
        const { data: users, error: uErr } = await admin
          .from('users')
          .select('id, username, display_name, email, role, onboarding_answers, target_role, career_goal, xp_total, career_dna_score, skill_tags, missions_completed, vault_count, league_tier')
          .limit(60);

        if (!uErr && users && users.length > 0) {
          candidates = users
            .filter(u => !connectedIds.has(u.id) && !blockedIds.has(u.id))
            .map(u => {
              const ob = u.onboarding_answers || {};
              const rawSkills = Array.isArray(u.skill_tags) && u.skill_tags.length > 0
                ? u.skill_tags
                : (typeof ob.skills === 'string'
                    ? ob.skills.split(',').map((s: string) => s.trim().replace(/^Skills:\s*/i, ''))
                    : ['React', 'TypeScript', 'Node.js']);

              const cleanSkills = rawSkills
                .flatMap((s: string) => s.split(/[,.]/))
                .map((s: string) => s.trim())
                .filter((s: string) => s.length > 1 && s.length < 25)
                .slice(0, 4);

              const collegeName = ob.education ? ob.education.split('(')[0].trim() : 'Bangalore University';
              const courseName = ob.education && ob.education.includes('(') ? ob.education.match(/\(([^)]+)\)/)?.[1] || 'B.Tech' : 'B.Tech CS';
              const name = u.display_name || u.username || 'Student Peer';

              return {
                id: u.id,
                name,
                headline: u.target_role || ob.role || 'Software Engineering Student',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + encodeURIComponent(name),
                college: collegeName,
                course: courseName,
                skills: cleanSkills.length > 0 ? cleanSkills : ['React', 'Algorithms', 'TypeScript'],
                careerGoal: u.career_goal || u.target_role || ob.role || 'Full Stack Engineer',
                online: true,
                careerScore: u.career_dna_score || 84,
                xp: u.xp_total || 1850,
                arenaWins: u.missions_completed || 12,
                projectsCount: u.vault_count || 3
              };
            });
        }
      } catch (err) {
        console.warn('Supabase suggestions fetch failed, using local mock students:', err);
      }
    }

    // 3. Fallback to db.mockStudents if no candidates from Supabase
    if (candidates.length === 0 && db.mockStudents) {
      candidates = (db.mockStudents as MatchStudentProfile[])
        .filter(s => !connectedIds.has(s.id) && !blockedIds.has(s.id));
    }

    // 4. Rank candidates by affinity
    const ranked = rankAndFilterStudents(CURRENT_STUDENT_PROFILE, candidates, filter);

    // 5. Flatten candidate with match metrics
    const flattened = ranked.map(item => ({
      ...item.student,
      matchPct: item.match.overallMatch,
      matchDetails: item.match.reasonTag,
      match: item.match
    }));

    // 6. Apply real-time search query if provided
    const finalResults = search
      ? flattened.filter(s =>
          s.name.toLowerCase().includes(search) ||
          s.college.toLowerCase().includes(search) ||
          s.course.toLowerCase().includes(search) ||
          s.skills.some(sk => sk.toLowerCase().includes(search))
        )
      : flattened;

    return NextResponse.json({
      ok: true,
      filter,
      searchQuery: search,
      totalMatches: finalResults.length,
      suggestions: finalResults
    });
  } catch (err: any) {
    console.error('Error in /api/friends/suggestions GET:', err);
    return NextResponse.json({ ok: false, error: err?.message || 'Failed to fetch suggestions' }, { status: 500 });
  }
}
