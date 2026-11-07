export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import fs from 'fs';
import path from 'path';

const dbPath = path.resolve(process.cwd(), 'src/lib/data/friends_db.json');

function getLocalData() {
  try {
    if (fs.existsSync(dbPath)) {
      return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    }
  } catch {}
  return { friendships: [], mockStudents: [] };
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
    const headerUserId = req.headers.get('x-user-id');
    if (headerUserId) return { userId: headerUserId };
    return {
      userId: null,
      errorResponse: NextResponse.json({ ok: false, error: 'UNAUTHORIZED', message: 'Authentication required' }, { status: 401 })
    };
  }
  return { userId: gated.user.id };
}

export async function GET(req: NextRequest) {
  try {
    const auth = await resolveUserId(req);
    if (auth.errorResponse || !auth.userId) return auth.errorResponse!;
    const userId = auth.userId;

    const { searchParams } = new URL(req.url);
    const query = (searchParams.get('q') || '').toLowerCase().trim();
    const filter = searchParams.get('filter') || 'all';

    const admin = getAdminClient();
    const relationships = new Map<string, string>();

    // 1. Fetch relationships from Supabase or local
    if (admin) {
      try {
        const { data: friendships } = await admin
          .from('friendships')
          .select('*')
          .or(`requester_id.eq.${userId},addressee_id.eq.${userId}`);

        (friendships || []).forEach(f => {
          const otherId = f.requester_id === userId ? f.addressee_id : f.requester_id;
          if (f.status === 'accepted') {
            relationships.set(otherId, 'friends');
          } else if (f.status === 'pending') {
            relationships.set(otherId, f.requester_id === userId ? 'sent' : 'received');
          }
        });
      } catch (err) {
        console.warn('Supabase search friendships query failed:', err);
      }
    }

    const localData = getLocalData();
    if (relationships.size === 0) {
      for (const f of (localData.friendships || [])) {
        const otherId = f.requester_id === userId ? f.addressee_id : (f.addressee_id === userId ? f.requester_id : null);
        if (otherId) {
          if (f.status === 'accepted') {
            relationships.set(otherId, 'friends');
          } else if (f.status === 'pending') {
            relationships.set(otherId, f.requester_id === userId ? 'sent' : 'received');
          }
        }
      }
    }

    let students: any[] = [];

    // 2. Fetch users from Supabase
    if (admin) {
      try {
        let queryBuilder = admin
          .from('users')
          .select('*')
          .neq('id', userId)
          .limit(50);

        if (query) {
          queryBuilder = queryBuilder.or(`display_name.ilike.%${query}%,username.ilike.%${query}%,target_role.ilike.%${query}%`);
        }

        const { data: users, error } = await queryBuilder;
        if (!error && users && users.length > 0) {
          const nonStudentRoles = new Set(['recruiter', 'consultant', 'parent', 'admin', 'teacher', 'faculty', 'institution_admin', 'super_admin']);
          const testNonStudentRegex = /\b(test recruiter|live recruiter|live consultant|live parent|live admin|recruiter|consultant|faculty|institution_admin)\b/i;

          students = users
            .filter(u => {
              const r = (u.role || '').toLowerCase().trim();
              if (r && nonStudentRoles.has(r)) return false;

              const nameLower = (u.display_name || u.username || '').toLowerCase().trim();
              const emailLower = (u.email || '').toLowerCase().trim();
              if (testNonStudentRegex.test(nameLower) || testNonStudentRegex.test(emailLower)) return false;

              return true;
            })
            .map(u => {
              const ob = u.onboarding_answers || {};
              const rawSkills: any[] = Array.isArray(u.skill_tags) && u.skill_tags.length > 0
                ? u.skill_tags
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
                .slice(0, 5);

              const name = u.display_name || u.username || (u.email ? u.email.split('@')[0] : 'Student');
              return {
                id: u.id,
                name,
                headline: u.target_role || ob.role || 'CareerOS Student',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + encodeURIComponent(name),
                college: (u as any).college_name || (ob.education ? ob.education.split('(')[0].trim() : (ob.college || 'Campus Student')),
                course: (u as any).department || (ob.education && ob.education.includes('(') ? ob.education.match(/\(([^)]+)\)/)?.[1] || 'Degree' : (ob.course || 'Undergraduate')),
                careerGoal: u.career_goal || u.target_role || ob.role || 'Aspiring Professional',
                skills: cleanSkills, // ZERO DUMMY SKILLS: If empty, returns []
                careerScore: u.career_dna_score || 0,
                xp: u.xp_total || 0,
                arenaWins: u.missions_completed || 0,
                projectsCount: u.vault_count || 0,
                online: true
              };
            });
        }
      } catch (err) {
        console.warn('Supabase search users failed:', err);
      }
    }

    // ZERO MOCK / DEMO DATA INVARIANT: Do not fallback to mockStudents

    if (query) {
      students = students.filter((s: any) => {
        const nameMatch = s.name?.toLowerCase().includes(query);
        const headlineMatch = s.headline?.toLowerCase().includes(query);
        const collegeMatch = s.college?.toLowerCase().includes(query);
        const courseMatch = s.course?.toLowerCase().includes(query);
        const goalMatch = s.careerGoal?.toLowerCase().includes(query);
        const skillMatch = s.skills?.some((sk: string) => typeof sk === 'string' && sk.toLowerCase().includes(query));
        return nameMatch || headlineMatch || collegeMatch || courseMatch || goalMatch || skillMatch;
      });
    }

    if (filter === 'college') {
      students = students.filter((s: any) => s.college?.toLowerCase().includes('engineering') || s.college?.toLowerCase().includes('institute'));
    } else if (filter === 'skills') {
      students = students.filter((s: any) => s.skills?.some((sk: string) => ['React', 'TypeScript', 'Node.js', 'Python'].includes(sk)));
    }

    const results = students.map((s: any) => ({
      ...s,
      relationship: relationships.get(s.id) || 'none'
    }));

    return NextResponse.json({ ok: true, results, total: results.length });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Search failed' }, { status: 500 });
  }
}
