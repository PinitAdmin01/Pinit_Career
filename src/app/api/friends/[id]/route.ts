import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const admin = getAdminClient();
    const studentId = params.id;

    if (!studentId) {
      return NextResponse.json({ ok: false, error: 'Student ID required' }, { status: 400 });
    }

    const { data: user, error } = await admin
      .from('users')
      .select('id, username, display_name, email, role, onboarding_answers, target_role, career_goal, xp_total, career_dna_score, skill_tags, missions_completed, vault_count, league_tier, created_at')
      .eq('id', studentId)
      .maybeSingle();

    if (error) throw error;
    if (!user) {
      return NextResponse.json({ ok: false, error: 'Student not found' }, { status: 404 });
    }

    const ob = user.onboarding_answers || {};
    const rawSkills = Array.isArray(user.skill_tags) && user.skill_tags.length > 0
      ? user.skill_tags
      : (typeof ob.skills === 'string'
          ? ob.skills.split(',').map((s: string) => s.trim().replace(/^Skills:\s*/i, ''))
          : ['React', 'TypeScript', 'Node.js', 'System Design']);

    const cleanSkills = rawSkills
      .flatMap((s: string) => s.split(/[,.]/))
      .map((s: string) => s.trim())
      .filter((s: string) => s.length > 1 && s.length < 30)
      .slice(0, 8);

    const name = user.display_name || user.username || 'Student Peer';
    const college = ob.education ? ob.education.split('(')[0].trim() : 'Engineering Campus';
    const course = ob.education && ob.education.includes('(') ? ob.education.match(/\(([^)]+)\)/)?.[1] || 'B.Tech' : 'B.Tech CS';

    return NextResponse.json({
      ok: true,
      student: {
        id: user.id,
        name,
        headline: user.target_role || ob.role || 'Software Engineering Student',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + encodeURIComponent(name),
        college,
        course,
        careerGoal: user.career_goal || user.target_role || ob.role || 'Full Stack Software Engineer',
        skills: cleanSkills,
        careerScore: user.career_dna_score || 85,
        xp: user.xp_total || 2100,
        arenaWins: user.missions_completed || 14,
        projectsCount: user.vault_count || 3,
        leagueTier: user.league_tier || 'Silver Sprint',
        online: true,
        memberSince: user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '2026'
      }
    });
  } catch (err: any) {
    console.error('Error fetching student profile:', err);
    return NextResponse.json({ ok: false, error: err?.message || 'Failed to fetch student' }, { status: 500 });
  }
}
