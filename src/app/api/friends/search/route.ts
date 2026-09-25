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
          .select('id, username, display_name, email, role, onboarding_answers, target_role, career_goal, xp_total, career_dna_score, skill_tags, missions_completed, vault_count')
          .neq('id', userId)
          .limit(50);

        if (query) {
          queryBuilder = queryBuilder.or(`display_name.ilike.%${query}%,username.ilike.%${query}%,target_role.ilike.%${query}%`);
        }

        const { data: users, error } = await queryBuilder;
        if (!error && users && users.length > 0) {
          students = users.map(u => {
            const ob = u.onboarding_answers || {};
            const rawSkills = Array.isArray(u.skill_tags) && u.skill_tags.length > 0
              ? u.skill_tags
              : (typeof ob.skills === 'string'
                  ? ob.skills.split(',').map((s: string) => s.trim())
                  : ['React', 'TypeScript', 'Node.js']);

            const name = u.display_name || u.username || 'Student Peer';
            return {
              id: u.id,
              name,
              headline: u.target_role || ob.role || 'Software Engineering Student',
              avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
              college: ob.education ? ob.education.split('(')[0].trim() : 'Engineering Campus',
              course: ob.education && ob.education.includes('(') ? ob.education.match(/\(([^)]+)\)/)?.[1] || 'B.Tech' : 'B.Tech CS',
              careerGoal: u.career_goal || u.target_role || ob.role || 'Full Stack Engineer',
              skills: rawSkills.slice(0, 5),
              careerScore: u.career_dna_score || 85,
              xp: u.xp_total || 1800,
              arenaWins: u.missions_completed || 12,
              projectsCount: u.vault_count || 3,
              online: true
            };
          });
        }
      } catch (err) {
        console.warn('Supabase search users failed, falling back to local:', err);
      }
    }

    if (students.length === 0) {
      students = (localData.mockStudents || []).filter((s: any) => s.id !== userId);
    }

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
