function formatStudentName(u: any): string {
  const rawDisplayName = (u.display_name || '').trim();
  const isGeneric = !rawDisplayName || /^(student|campus student|user|student peer)$/i.test(rawDisplayName);
  
  if (!isGeneric) {
    return rawDisplayName;
  }

  // Check username
  const rawUsername = (u.username || '').trim();
  if (rawUsername && !/^(student|user|admin)$/i.test(rawUsername)) {
    const cleanUser = rawUsername.replace(/^usr_/i, '');
    const parts = cleanUser.split(/[._-]+/).filter((p: string) => p.length > 0 && !/^[0-9a-f]{6,}$/i.test(p));
    if (parts.length > 0) {
      return parts.map((s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()).join(' ');
    }
  }

  // Check email prefix
  if (u.email && typeof u.email === 'string') {
    let prefix = u.email.split('@')[0].trim();
    prefix = prefix.replace(/^usr_/i, '');
    const parts = prefix.split(/[._-]+/).filter((p: string) => p.length > 0 && !/^[0-9a-f]{6,}$/i.test(p) && !/^(student|test|demo)$/i.test(p));
    if (parts.length > 0) {
      return parts.map((s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()).join(' ');
    }
  }

  // Check institutional register number
  const reg = (u.register_number || u.roll_number || '').trim();
  if (reg) {
    const lastDigits = reg.match(/(\d+)$/)?.[1];
    const deptMatch = reg.match(/PIN-[A-Z]+-([A-Z]+)-/i)?.[1];
    if (lastDigits && deptMatch) {
      return `Student (${deptMatch} #${lastDigits})`;
    }
    if (lastDigits) {
      return `Student Peer #${lastDigits}`;
    }
  }

  // Distinguish by track role & ID
  const role = u.target_role || u.career_goal;
  const shortId = (u.id || '').replace(/-/g, '').slice(0, 4).toUpperCase();
  if (role) {
    const cleanRole = role.replace(/_/g, ' ').replace(/\b(developer|engineer)\b/i, '').trim();
    const capitalizedRole = cleanRole.split(' ').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    return `${capitalizedRole || 'Campus'} Peer #${shortId}`;
  }

  return `Campus Peer #${shortId || '01'}`;
}

function resolveStudentEducation(u: any, ob: any): { college: string; course: string } {
  const isDiscipline = /engineering|computer science|information technology|bca|mca|b\.?tech|b\.?com|bba|mba|data science|artificial intelligence/i.test(ob.education || '');

  let rawCollege = (u.college_name || ob.college || ob.university || ob.institution || '').trim();
  let rawCourse = (u.department || ob.degree || ob.courseTrack || ob.branch || ob.course || '').trim();

  if (!rawCollege) {
    if (isDiscipline) {
      rawCollege = 'Campus Directory';
      rawCourse = rawCourse || ob.education;
    } else if (ob.education) {
      rawCollege = ob.education;
    } else {
      rawCollege = 'Campus Directory';
    }
  }

  if (!rawCourse) {
    rawCourse = isDiscipline ? ob.education : 'Undergraduate';
  }

  if (rawCourse.toLowerCase() === 'computer science / engineering') {
    rawCourse = 'B.Tech CS / Engineering';
  }

  return {
    college: rawCollege,
    course: rawCourse
  };
}

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
              if (userId && u.id === userId) return false;
              const r = (u.role || '').toLowerCase().trim();
              if (r && nonStudentRoles.has(r)) return false;

              const nameLower = (u.display_name || u.username || '').toLowerCase().trim();
              const emailLower = (u.email || '').toLowerCase().trim();
              if (testNonStudentRegex.test(nameLower) || testNonStudentRegex.test(emailLower)) return false;

              // TASK 2 INVARIANT: Include ALL authentic users in the database, even if incomplete or brand new.
              return true;
            })
            .map(u => {
              let ob = u.onboarding_answers || {};
              if (typeof ob === 'string') { try { ob = JSON.parse(ob); } catch { ob = {}; } }
              // ZERO DUMMY SKILLS INVARIANT:
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
                .slice(0, 5);

              const { college: collegeName, course: courseName } = resolveStudentEducation(u, ob);
              const name = formatStudentName(u);

              const displaySkills = [...cleanSkills];
              if (displaySkills.length === 0 && (u.target_role || ob.role)) {
                const roleSlug = String(u.target_role || ob.role).toLowerCase();
                if (roleSlug.includes('full') || roleSlug.includes('stack')) displaySkills.push('Full-Stack Track');
                else if (roleSlug.includes('ai') || roleSlug.includes('llm') || roleSlug.includes('data')) displaySkills.push('AI/ML Track');
                else if (roleSlug.includes('cyber')) displaySkills.push('Cybersecurity Track');
                else if (roleSlug.includes('cloud') || roleSlug.includes('devops')) displaySkills.push('DevOps Track');
                else displaySkills.push('General Track');
              }

              return {
                id: u.id,
                name,
                headline: u.target_role || ob.role || 'CareerOS Student',
                avatar: (typeof u.avatar_url === 'string' && u.avatar_url.trim().length > 0) ? u.avatar_url : ('https://api.dicebear.com/7.x/avataaars/svg?seed=' + encodeURIComponent(u.id || name)),
                college: collegeName,
                course: courseName,
                careerGoal: u.career_goal || u.target_role || ob.role || 'Aspiring Professional',
                skills: displaySkills,
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
