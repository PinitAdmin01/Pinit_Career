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

async function resolveUserId(req: Request, admin: any): Promise<string | null> {
  const token = getBearerToken(req);
  if (token && admin) {
    try {
      const { data } = await admin.auth.getUser(token);
      if (data?.user?.id) return data.user.id;
    } catch {}
  }
  const headerUserId = req.headers.get('x-user-id');
  if (headerUserId) return headerUserId;
  return null;
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
            if (c.status === 'accepted') {
              if (c.requester_id) connectedIds.add(c.requester_id);
              if (c.addressee_id) connectedIds.add(c.addressee_id);
            }
          });
        } catch {}
      }

      (db.friendships || []).forEach((c: any) => {
        if (c.status === 'accepted') {
          if (c.requester_id === userId && c.addressee_id) connectedIds.add(c.addressee_id);
          if (c.addressee_id === userId && c.requester_id) connectedIds.add(c.requester_id);
        }
      });
    }

    let candidates: MatchStudentProfile[] = [];

    // 2. Fetch real student users from Supabase users table if available
    if (admin) {
      try {
        const { data: users, error: uErr } = await admin
          .from('users')
          .select('*')
          .limit(100);

        if (!uErr && users && users.length > 0) {
          const nonStudentRoles = new Set(['recruiter', 'consultant', 'parent', 'admin', 'teacher', 'faculty', 'institution_admin', 'super_admin']);
          const testNonStudentRegex = /\b(test recruiter|live recruiter|live consultant|live parent|live admin|recruiter|consultant|faculty|institution_admin)\b/i;

          candidates = users
            .filter(u => {
              if (connectedIds.has(u.id) || blockedIds.has(u.id)) return false;

              // Strict role check: exclude institutional staff (recruiters, consultants, parents, admins, teachers)
              const r = (u.role || '').toLowerCase().trim();
              if (r && nonStudentRoles.has(r)) return false;

              // Exclude test recruiter & staff personas
              const nameLower = (u.display_name || u.username || '').toLowerCase().trim();
              const emailLower = (u.email || '').toLowerCase().trim();
              if (testNonStudentRegex.test(nameLower) || testNonStudentRegex.test(emailLower)) return false;

              // ZERO DUMMY / DEMO DATA INVARIANT:
              // Exclude uninitialized placeholder accounts with generic name 'student' or demo test emails
              if (!nameLower || nameLower === 'student' || nameLower === 'student peer' || nameLower === 'campus student') return false;
              if (/\b(test|demo|dummy|sample|placeholder)\b/i.test(nameLower)) return false;
              if (emailLower.includes('@pinit.in') || emailLower.includes('@example.com') || /\b(test|demo)\b/i.test(emailLower)) return false;

              return true;
            })
            .map(u => {
              let ob = u.onboarding_answers || {};
              if (typeof ob === 'string') { try { ob = JSON.parse(ob); } catch { ob = {}; } }
              // ZERO DUMMY SKILLS INVARIANT:
              // Only display authentic skills explicitly added by the student to skill_tags or skills.
              // Never fall back to onboarding track template strings (onboardingSkillsBoilerplate). If empty, returns [].
              const rawSkills: any[] = Array.isArray(u.skill_tags) && u.skill_tags.length > 0
                ? u.skill_tags
                : (Array.isArray(u.skills) && u.skills.length > 0
                    ? u.skills
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
                .slice(0, 4);

              const collegeName = u.college_name || (ob.education ? ob.education.split('(')[0].trim() : (ob.college || 'Campus Student'));
              const courseName = u.department || (ob.education && ob.education.includes('(') ? ob.education.match(/\(([^)]+)\)/)?.[1] || 'Degree' : (ob.course || 'Undergraduate'));
              const name = u.display_name || u.username || (u.email ? u.email.split('@')[0] : 'Campus Peer');

              return {
                id: u.id,
                name,
                headline: u.target_role || ob.role || 'CareerOS Student',
                avatar: (typeof u.avatar_url === 'string' && u.avatar_url.trim().length > 0) ? u.avatar_url : ('https://api.dicebear.com/7.x/avataaars/svg?seed=' + encodeURIComponent(u.id || name)),
                college: collegeName,
                course: courseName,
                skills: cleanSkills, // ZERO DUMMY SKILLS: If user has no skills, return empty array []
                careerGoal: u.career_goal || u.target_role || ob.role || 'Aspiring Professional',
                online: true,
                careerScore: u.career_dna_score || 0,
                xp: u.xp_total || 0,
                arenaWins: u.missions_completed || 0,
                projectsCount: u.vault_count || 0
              };
            });
        }
      } catch (err) {
        console.warn('Supabase suggestions fetch failed:', err);
      }
    }

    // 3. ZERO MOCK / DEMO DATA INVARIANT: If no live registered student peers exist, return empty array.
    // Do NOT fall back to db.mockStudents.
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
          (s.name || '').toLowerCase().includes(search) ||
          (s.college || '').toLowerCase().includes(search) ||
          (s.course || '').toLowerCase().includes(search) ||
          (Array.isArray(s.skills) && s.skills.some(sk => typeof sk === 'string' && sk.toLowerCase().includes(search)))
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
