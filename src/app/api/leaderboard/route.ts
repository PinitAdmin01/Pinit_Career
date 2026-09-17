import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { checkRateLimit, getClientIp } from '@/lib/server/rateLimit';

export const dynamic = 'force-dynamic';

export type LeagueTier = 'browns' | 'silver' | 'gold' | 'platinum' | 'ruby';

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
  eloRating: number;
  leagueTier: LeagueTier;
  weeklyXp: number;
  totalXp: number;
  zone: 'promotion' | 'safe' | 'demotion';
  isCurrentUser?: boolean;
}

function getNextMonday1AmIst(): Date {
  const now = new Date();
  const istOffsetMs = 5.5 * 60 * 60 * 1000;
  const nowIst = new Date(now.getTime() + istOffsetMs);
  
  const day = nowIst.getUTCDay(); // 0=Sun, 1=Mon, ..., 6=Sat
  const hour = nowIst.getUTCHours();
  
  let daysUntilMonday = (1 - day + 7) % 7;
  if (daysUntilMonday === 0 && hour >= 1) {
    daysUntilMonday = 7;
  }
  
  const nextMondayIst = new Date(nowIst);
  nextMondayIst.setUTCDate(nowIst.getUTCDate() + daysUntilMonday);
  nextMondayIst.setUTCHours(1, 0, 0, 0);
  
  return new Date(nextMondayIst.getTime() - istOffsetMs);
}

export async function GET(req: Request) {
  try {
    const ip = getClientIp(req);
    const rl = checkRateLimit(`leaderboard_${ip}`, { limit: 60, windowMs: 60_000 });
    if (!rl.allowed) return NextResponse.json({ error: 'RATE_LIMIT' }, { status: 429 });

    const gated = await requireUserFromRequest(req);
    const currentUserId = gated.user?.id;

    const url = new URL(req.url);
    const mode = url.searchParams.get('mode') || 'weekly_leagues';
    const requestedLeague = (url.searchParams.get('league') || '').toLowerCase().trim() as LeagueTier;
    const validLeagues = new Set<LeagueTier>(['browns', 'silver', 'gold', 'platinum', 'ruby']);

    const admin = getSupabaseAdmin();

    // 1. Fetch current user's profile to know their current league
    let currentUserLeague: LeagueTier = 'browns';
    if (currentUserId) {
      const { data: userProfile } = await admin
        .from('users')
        .select('league_tier')
        .eq('id', currentUserId)
        .maybeSingle();

      if (userProfile?.league_tier && validLeagues.has(userProfile.league_tier.toLowerCase() as LeagueTier)) {
        currentUserLeague = userProfile.league_tier.toLowerCase() as LeagueTier;
      }
    }

    const activeLeague: LeagueTier = validLeagues.has(requestedLeague)
      ? requestedLeague
      : currentUserLeague;

    // 2. Query users based on mode
    let query = admin.from('users').select(
      'id, display_name, avatar_url, college, target_role, ats_score, trust_score, career_dna_score, xp_total, weekly_xp, league_tier, skill_tags, completed_quests'
    );

    if (mode === 'weekly_leagues') {
      query = query.eq('league_tier', activeLeague).order('weekly_xp', { ascending: false }).order('xp_total', { ascending: false });
    } else if (mode === 'code_wars') {
      query = query.order('xp_total', { ascending: false });
    } else {
      query = query.order('xp_total', { ascending: false });
    }

    // Limit to top 100 for responsive cohort evaluation
    query = query.limit(100);

    const { data: rawUsers, error: usersErr } = await query;
    if (usersErr) {
      console.warn('[Leaderboard] Error querying real students:', usersErr.message);
    }

    const data = rawUsers || [];
    const totalCohortCount = data.length;

    // 3. Verified Skills count lookup
    const userIds = data.map(u => u.id);
    const verifiedCountsMap: Record<string, number> = {};

    if (userIds.length > 0) {
      try {
        const { data: masteryData } = await admin
          .from('competency_mastery')
          .select('user_id, status')
          .in('user_id', userIds)
          .eq('status', 'VERIFIED_COMPETENCY');

        if (masteryData) {
          masteryData.forEach(row => {
            verifiedCountsMap[row.user_id] = (verifiedCountsMap[row.user_id] || 0) + 1;
          });
        }
      } catch {}
    }

    // 4. Calculate cutoffs for weekly leagues (Top 10% promote, Bottom 10% demote)
    const promotionCutoffRank = Math.max(1, Math.ceil(totalCohortCount * 0.10));
    const demotionCutoffRank = Math.max(1, totalCohortCount - Math.floor(totalCohortCount * 0.10) + 1);

    // 5. Build authoritative student entries
    const entries: LeaderboardEntry[] = data.map((p, idx) => {
      const rank = idx + 1;
      const verifiedSkills = verifiedCountsMap[p.id] || 0;
      const demonstratedSkills = Array.isArray(p.completed_quests) ? p.completed_quests.length : 0;
      const defense = Math.min(100, Math.max(0, Number(p.ats_score) || 0));
      const totalXp = Number(p.xp_total) || 0;
      const weeklyXp = Number(p.weekly_xp) || 0;
      const trust = Number(p.trust_score) || 0;

      const readiness: LeaderboardEntry['readinessStatus'] = 
        defense >= 80 && trust >= 80 ? 'ready_for_interview' :
        defense >= 65 ? 'ready_for_internship' : 'exploring';

      let zone: LeaderboardEntry['zone'] = 'safe';
      if (activeLeague !== 'ruby' && rank <= promotionCutoffRank && totalCohortCount >= 2) {
        zone = 'promotion';
      } else if (activeLeague !== 'browns' && rank >= demotionCutoffRank && totalCohortCount >= 2 && rank > promotionCutoffRank) {
        zone = 'demotion';
      }

      const displayName = p.display_name || 'Student Candidate';
      const avatarUrl = p.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(displayName)}`;

      const normTier = (p.league_tier && validLeagues.has(p.league_tier.toLowerCase() as LeagueTier))
        ? (p.league_tier.toLowerCase() as LeagueTier)
        : 'browns';

      return {
        rank,
        studentId: p.id,
        name: displayName,
        avatarUrl,
        college: p.college || 'PinIT Career OS Academy',
        programTitle: p.target_role ? `${p.target_role} Track` : 'Software Engineering Track',
        verifiedSkillsCount: verifiedSkills,
        demonstratedSkillsCount: demonstratedSkills,
        defenseScore: defense,
        readinessStatus: readiness,
        learningGainPoints: Math.max(0, Math.round(totalXp / 50)),
        eloRating: 1200 + Math.round(totalXp / 8),
        leagueTier: normTier,
        weeklyXp,
        totalXp,
        zone,
        isCurrentUser: p.id === currentUserId,
      };
    });

    // Sort by mode rules if not weekly leagues
    if (mode === 'verified_evidence') {
      entries.sort((a, b) => {
        if (b.verifiedSkillsCount !== a.verifiedSkillsCount) return b.verifiedSkillsCount - a.verifiedSkillsCount;
        if (b.defenseScore !== a.defenseScore) return b.defenseScore - a.defenseScore;
        return b.totalXp - a.totalXp;
      });
      entries.forEach((e, i) => { e.rank = i + 1; });
    } else if (mode === 'code_wars') {
      entries.sort((a, b) => b.eloRating - a.eloRating);
      entries.forEach((e, i) => { e.rank = i + 1; });
    }

    const currentUserEntry = entries.find(e => e.isCurrentUser) || null;
    const sprintEndsAt = getNextMonday1AmIst();
    const remainingMs = Math.max(0, sprintEndsAt.getTime() - Date.now());

    // 6. Get counts across all 5 leagues
    const leagueCounts: Record<LeagueTier, number> = {
      browns: 0,
      silver: 0,
      gold: 0,
      platinum: 0,
      ruby: 0,
    };

    try {
      const { data: allTiers } = await admin
        .from('users')
        .select('league_tier');

      if (allTiers) {
        allTiers.forEach(row => {
          const t = (row.league_tier || 'browns').toLowerCase() as LeagueTier;
          if (validLeagues.has(t)) {
            leagueCounts[t] = (leagueCounts[t] || 0) + 1;
          } else {
            leagueCounts.browns += 1;
          }
        });
      }
    } catch {}

    return NextResponse.json({
      ok: true,
      mode,
      activeLeague,
      currentUserLeague,
      leaderboard: entries,
      totalCount: entries.length,
      currentUser: currentUserEntry,
      promotionCutoffRank,
      demotionCutoffRank,
      sprintEndsAt: sprintEndsAt.toISOString(),
      remainingMs,
      leagueCounts,
    });
  } catch (err: any) {
    console.error('[Leaderboard] Server Error:', err);
    return NextResponse.json({ ok: false, error: err.message || 'Leaderboard server error' }, { status: 500 });
  }
}
