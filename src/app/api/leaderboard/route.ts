import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { requireUserFromRequest } from '@/lib/server/requireAuth';

export interface LeaderboardEntry {
  rank: number;
  studentId: string;
  name: string;
  avatarUrl: string;
  college: string;
  programTitle: string;
  verifiedSkillsCount: number;
  demonstratedSkillsCount: number;
  defenseScore: number;
  readinessStatus: 'exploring' | 'skills_in_progress' | 'ready_for_interview' | 'ready_for_internship' | 'placed';
  learningGainPoints: number;
  eloRating?: number;
  leagueTier?: 'Diamond' | 'Platinum' | 'Gold' | 'Silver' | 'Bronze';
  isCurrentUser?: boolean;
}

export async function GET(req: Request) {
  try {
    const gated = await requireUserFromRequest(req);
    const currentUserId = gated.user?.id;

    const url = new URL(req.url);
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get('limit') || '50', 10)));
    const offset = (page - 1) * limit;

    let realEntries: LeaderboardEntry[] = [];
    let totalCount = 0;

    try {
      // Query canonical 'users' table with exact total count and pagination range
      const { data, count, error } = await supabase
        .from('users')
        .select('id, display_name, avatar_url, college, target_role, ats_score, trust_score, career_dna_score, xp_total, skill_tags, completed_quests', { count: 'exact' })
        .order('xp_total', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        console.warn('[Leaderboard] Error querying users:', error.message);
      }

      totalCount = count ?? (data ? data.length : 0);

      if (data && data.length > 0) {
        const userIds = data.map(u => u.id);

        // Defect 104: Count verified skills from mastery tables, NOT unverified skill_tags.length
        const verifiedCountsMap: Record<string, number> = {};

        try {
          const { data: masteryData } = await supabase
            .from('competency_mastery')
            .select('user_id, status')
            .in('user_id', userIds)
            .eq('status', 'VERIFIED_COMPETENCY');

          if (masteryData) {
            masteryData.forEach(row => {
              verifiedCountsMap[row.user_id] = (verifiedCountsMap[row.user_id] || 0) + 1;
            });
          }
        } catch {
          // Fallback to student_competency_mastery
          try {
            const { data: studentMastery } = await supabase
              .from('student_competency_mastery')
              .select('student_id, state')
              .in('student_id', userIds)
              .in('state', ['VERIFIED_COMPETENCY', 'verified', 'mastered']);

            if (studentMastery) {
              studentMastery.forEach(row => {
                verifiedCountsMap[row.student_id] = (verifiedCountsMap[row.student_id] || 0) + 1;
              });
            }
          } catch {
            // Ledger unavailable
          }
        }

        realEntries = data.map(p => {
          const verifiedSkills = verifiedCountsMap[p.id] || 0;
          const demonstratedSkills = Array.isArray(p.completed_quests) ? p.completed_quests.length : 0;
          
          // Defect 105: Eradicate artificial 65 score floor
          const defense = Math.min(100, Math.max(0, Number(p.ats_score) || 0));
          const xp = Number(p.xp_total) || 0;
          const trust = Number(p.trust_score) || 0;

          const readiness: LeaderboardEntry['readinessStatus'] = 
            defense >= 80 && trust >= 80 ? 'ready_for_interview' :
            defense >= 65 ? 'ready_for_internship' : 'exploring';

          const tier: LeaderboardEntry['leagueTier'] =
            xp >= 4000 ? 'Diamond' :
            xp >= 2500 ? 'Platinum' :
            xp >= 1500 ? 'Gold' :
            xp >= 500 ? 'Silver' : 'Bronze';

          // Defect 103: Dynamic unique avatar per student using Dicebear SVG seed
          const displayName = p.display_name || 'Student';
          const avatarUrl = p.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(displayName)}`;

          return {
            rank: 0,
            studentId: p.id,
            name: displayName,
            avatarUrl,
            college: p.college || 'PinIT Career OS Academy',
            programTitle: p.target_role ? `${p.target_role} Track` : 'Engineering Track',
            verifiedSkillsCount: verifiedSkills,
            demonstratedSkillsCount: demonstratedSkills,
            defenseScore: defense,
            readinessStatus: readiness,
            learningGainPoints: Math.max(0, Math.round(xp / 50)),
            eloRating: 1200 + Math.round(xp / 8),
            leagueTier: tier,
            isCurrentUser: p.id === currentUserId,
          };
        });
      }
    } catch (err: any) {
      console.error('[Leaderboard] Failed to fetch leaderboard data:', err?.message);
    }

    // Defect 102: Purged baseline cohort entirely. Only real authenticated students exist.
    if (realEntries.length === 0) {
      return NextResponse.json({
        ok: true,
        leaderboard: [],
        page,
        limit,
        totalPages: 0,
        totalCount: 0,
        currentUserRank: null,
        totalRealStudents: 0,
        message: 'Be the first on the leaderboard!'
      });
    }

    // Sort strictly by: 1. Verified skills, 2. Defense score, 3. Learning gain
    realEntries.sort((a, b) => {
      if (b.verifiedSkillsCount !== a.verifiedSkillsCount) {
        return b.verifiedSkillsCount - a.verifiedSkillsCount;
      }
      if (b.defenseScore !== a.defenseScore) {
        return b.defenseScore - a.defenseScore;
      }
      return b.learningGainPoints - a.learningGainPoints;
    });

    // Reassign ranks based on page offset
    let currentUserRank: number | null = null;
    realEntries.forEach((entry, idx) => {
      entry.rank = offset + idx + 1;
      if (entry.isCurrentUser) {
        currentUserRank = entry.rank;
      }
    });

    const totalPages = Math.max(1, Math.ceil(totalCount / limit));

    return NextResponse.json({
      ok: true,
      leaderboard: realEntries,
      page,
      limit,
      totalPages,
      totalCount,
      currentUserRank,
      totalRealStudents: totalCount,
    });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
