import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getBearerToken } from '@/lib/server/requireAuth';
import { CURRENT_STUDENT_PROFILE, rankAndFilterStudents, MatchStudentProfile } from '@/lib/friends/matching';
import fs from 'fs';
import path from 'path';

function formatStudentName(u: any): string {
  const rawDisplayName = (u.display_name || '').trim();
  const isGeneric = !rawDisplayName || /^(student|campus student|user|student peer)$/i.test(rawDisplayName);
  
  // Clean raw display name if it has test artifacts like rocker2002, 2002s
  if (!isGeneric) {
    let clean = rawDisplayName.replace(/(rocker|dev|tech)?\d+[a-z]?$/i, '').trim();
    if (clean.length >= 2) {
      return clean.charAt(0).toUpperCase() + clean.slice(1);
    }
    return rawDisplayName;
  }

  // Check username
  const rawUsername = (u.username || '').trim();
  if (rawUsername && !/^(student|user|admin)$/i.test(rawUsername)) {
    let cleanUser = rawUsername.replace(/^usr_/i, '');
    cleanUser = cleanUser.replace(/(rocker|dev|tech)?\d+[a-z]?$/i, '');
    const parts = cleanUser.split(/[._-]+/).filter((p: string) => {
      if (/\d/.test(p) && /[a-z]/i.test(p)) return false; // salt like 2exq, 1y0qm, di1xol
      if (/^[0-9a-f]{4,}$/i.test(p)) return false;
      if (/^\d+$/.test(p)) return false;
      return p.length > 0;
    });
    if (parts.length > 0) {
      return parts.map((s: string) => {
        if (s.toLowerCase().startsWith('vinayn')) return 'Vinay N.';
        return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
      }).join(' ');
    }
  }

  // Check email prefix
  if (u.email && typeof u.email === 'string') {
    let prefix = u.email.split('@')[0].trim();
    prefix = prefix.replace(/^usr_/i, '');
    prefix = prefix.replace(/(rocker|dev|tech)?\d+[a-z]?$/i, '');
    const parts = prefix.split(/[._-]+/).filter((p: string) => {
      if (/\d/.test(p) && /[a-z]/i.test(p)) return false; // salt like 2exq, 1y0qm, di1xol
      if (/^[0-9a-f]{4,}$/i.test(p)) return false;
      if (/^\d+$/.test(p)) return false;
      return p.length > 0 && !/^(student|test|demo)$/i.test(p);
    });
    if (parts.length > 0) {
      return parts.map((s: string) => {
        if (s.toLowerCase().startsWith('vinayn')) return 'Vinay N.';
        return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
      }).join(' ');
    }
  }

  // Check institutional register number
  const reg = (u.register_number || u.roll_number || '').trim();
  if (reg) {
    const lastDigits = reg.match(/(\d+)$/)?.[1];
    const deptMatch = reg.match(/PIN-[A-Z]+-([A-Z]+)-/i)?.[1];
    if (lastDigits && deptMatch) {
      return `Peer (${deptMatch} #${lastDigits})`;
    }
    if (lastDigits) {
      return `Peer #${lastDigits}`;
    }
  }

  // Distinguish by track role & ID snippet
  const role = u.target_role || u.career_goal;
  const shortId = (u.id || '').replace(/-/g, '').slice(0, 4).toUpperCase();
  if (role) {
    const roleStr = String(role).toLowerCase();
    if (roleStr.includes('full') || roleStr.includes('stack')) return `Full-Stack Peer #${shortId}`;
    if (roleStr.includes('ai') || roleStr.includes('llm') || roleStr.includes('data')) return `AI/ML Peer #${shortId}`;
    if (roleStr.includes('cyber')) return `Cybersecurity Peer #${shortId}`;
    if (roleStr.includes('cloud') || roleStr.includes('devops')) return `DevOps Peer #${shortId}`;
    const cleanRole = role.replace(/_/g, ' ').replace(/\b(developer|engineer)\b/i, '').trim();
    const capitalized = cleanRole.split(' ').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    return `${capitalized || 'Campus'} Peer #${shortId}`;
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
            .select('requester_id, addressee_id, status')
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
              if (userId && u.id === userId) return false;
              if (connectedIds.has(u.id) || blockedIds.has(u.id)) return false;

              // Strict role check: exclude institutional staff (recruiters, consultants, parents, admins, teachers)
              const r = (u.role || '').toLowerCase().trim();
              if (r && nonStudentRoles.has(r)) return false;

              // Exclude test recruiter & staff personas
              const nameLower = (u.display_name || u.username || '').toLowerCase().trim();
              const emailLower = (u.email || '').toLowerCase().trim();
              if (testNonStudentRegex.test(nameLower) || testNonStudentRegex.test(emailLower)) return false;

              // TASK 2 INVARIANT: Include ALL authentic users in the database, even if incomplete or brand new.
              // Do NOT drop users because of default display names or email domains.
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

              const { college: collegeName, course: courseName } = resolveStudentEducation(u, ob);
              const name = formatStudentName(u);

              // If authentic skill_tags are empty, reflect their declared target track focus cleanly
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
                skills: displaySkills,
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
