import { NextResponse } from 'next/server';
import { requireRecruiterUserFromRequest } from '@/lib/server/requireAuth';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';

export async function GET(req: Request) {
  try {
    const gated = await requireRecruiterUserFromRequest(req);
    if (gated.error) return gated.error;

    const admin = getSupabaseAdmin();

    // Query genuine students who have opted into recruiter visibility
    const { data: users, error } = await admin
      .from('users')
      .select('id, display_name, username, email, ats_score, trust_score, career_dna_score, career_track, register_number, skills, program_type, recruiter_visibility, recruiter_visible')
      .or('recruiter_visible.eq.true,recruiter_visibility.gt.0');

    if (error) {
      console.warn('[Recruiter Pipeline Route] Database query notice:', error.message);
      return NextResponse.json({ ok: true, pipeline: [] });
    }

    const pipeline = (users || []).map((u: any) => {
      const atsScore = typeof u.ats_score === 'number' ? u.ats_score : 0;
      const trustScore = typeof u.trust_score === 'number' ? u.trust_score : 0;
      const dnaScore = typeof u.career_dna_score === 'number' ? u.career_dna_score : 0;
      const matchScore = (atsScore > 0 || trustScore > 0) ? Math.round((atsScore + trustScore) / 2) : 0;

      return {
        id: u.id,
        displayName: u.display_name || u.username || 'Candidate',
        display_name: u.display_name || u.username || 'Candidate',
        email: u.email || '',
        ats_score: atsScore,
        trust_score: trustScore,
        career_dna_score: dnaScore,
        match_score: matchScore,
        target_role: u.career_track || 'Software Engineer',
        register_number: u.register_number || (u.id ? u.id.slice(0, 8).toUpperCase() : 'CANDIDATE'),
        skill_tags: Array.isArray(u.skills) ? u.skills : [],
        programType: u.program_type || 'Computer Science',
        recruiter_visibility: u.recruiter_visibility ?? 80,
      };
    });

    return NextResponse.json({ ok: true, pipeline });
  } catch (err: any) {
    console.error('[Recruiter Pipeline Exception]:', err?.message);
    return NextResponse.json({ ok: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}
