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

        // Identify current user if signed in (bearer token or cookie fallback)
    let currentUserId: string | null = null;
    try {
      const gated = await requireUserFromRequest(req);
      if (!gated.error && gated.user?.id) {
        currentUserId = gated.user.id;
      }
    } catch {}

    if (!currentUserId) {
      const cookieHeader = req.headers.get('cookie') || '';
      const uidMatch = cookieHeader.match(/pinit_uid=([^;]+)/);
      if (uidMatch && uidMatch[1]) {
        currentUserId = decodeURIComponent(uidMatch[1].trim());
      }
    }

    const url = new URL(req.url);
    const mode = url.searchParams.get('mode') || 'weekly_leagues';
    const requestedLeague = (url.searchParams.get('league') || '').toLowerCase().trim() as LeagueTier;
    const validLeagues = new Set<LeagueTier>(['browns', 'silver', 'gold', 'platinum', 'ruby']);

    const DB_CONFIGURED = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
    let admin: any = null;
    try {
      admin = getSupabaseAdmin();
    } catch {}

    // 1. Fetch current user's profile to know their current league
    let currentUserLeague: LeagueTier = 'browns';
    if (currentUserId && admin) {
      try {
        const { data: userProfile } = await admin
          .from('users')
          .select('league_tier')
          .eq('id', currentUserId)
          .maybeSingle();

        if (userProfile?.league_tier && validLeagues.has(userProfile.league_tier.toLowerCase() as LeagueTier)) {
          currentUserLeague = userProfile.league_tier.toLowerCase() as LeagueTier;
        }
      } catch {}
    }

    const activeLeague: LeagueTier = validLeagues.has(requestedLeague)
      ? requestedLeague
      : currentUserLeague;

    // 2. Query users based on mode
    let rawUsers: any[] | null = null;
    if (admin) {
      try {
        // Students only (staff, parents, recruiters are not ranked).
        let query = admin.from('users').select(
          'id, display_name, avatar_url, college, target_role, ats_score, trust_score, career_dna_score, xp_total, weekly_xp, league_tier, skill_tags, completed_quests, arena_elo'
        ).or('role.eq.student,role.is.null');

        if (mode === 'weekly_leagues') {
          if (activeLeague === 'browns') {
            query = query.or('league_tier.eq.browns,league_tier.is.null');
          } else {
            query = query.eq('league_tier', activeLeague);
          }
          query = query.order('weekly_xp', { ascending: false }).order('xp_total', { ascending: false });
        } else if (mode === 'code_wars') {
          query = query.order('arena_elo', { ascending: false }).order('xp_total', { ascending: false });
        } else {
          query = query.order('xp_total', { ascending: false });
        }

        query = query.limit(100);

        const { data, error: usersErr } = await query;
        if (usersErr && DB_CONFIGURED) {
          console.error('[Leaderboard] users query failed:', usersErr.message);
          return NextResponse.json({ ok: false, error: 'LEADERBOARD_UNAVAILABLE', message: 'The leaderboard is unavailable right now.' }, { status: 503 });
        }
        rawUsers = data || [];
      } catch {}
    }

    // Local development without a database only: a sample cohort. In production an empty league
    // stays empty (it used to show made-up students, including a fake "(You)" entry).
    if ((!rawUsers || rawUsers.length === 0) && !DB_CONFIGURED && process.env.NODE_ENV !== 'production') {
      rawUsers = [
        { id: currentUserId || 'test_user_001', display_name: 'Tanvi Agarwal (You)', avatar_url: '', college: 'RV College of Engineering', target_role: 'Full Stack Engineer', ats_score: 91, trust_score: 88, career_dna_score: 89, xp_total: 4200, weekly_xp: 620, league_tier: activeLeague, arena_elo: 1480, completed_quests: ['q1', 'q2', 'q3'] },
        { id: 'peer_dev_01', display_name: 'Aarav Patel', avatar_url: '', college: 'IIT Bombay', target_role: 'Full Stack Engineer', ats_score: 88, trust_score: 85, career_dna_score: 86, xp_total: 3450, weekly_xp: 510, league_tier: activeLeague, arena_elo: 1420, completed_quests: ['q1', 'q2'] },
        { id: 'peer_dev_02', display_name: 'Diya Sharma', avatar_url: '', college: 'BITS Pilani', target_role: 'AI / ML Engineer', ats_score: 84, trust_score: 80, career_dna_score: 82, xp_total: 2890, weekly_xp: 430, league_tier: activeLeague, arena_elo: 1380, completed_quests: ['q1'] },
        { id: 'peer_dev_03', display_name: 'Kabir Verma', avatar_url: '', college: 'NIT Trichy', target_role: 'DevOps & Cloud Engineer', ats_score: 79, trust_score: 78, career_dna_score: 77, xp_total: 2150, weekly_xp: 320, league_tier: activeLeague, arena_elo: 1310, completed_quests: ['q1'] },
      ];
    }

    const data = rawUsers || [];
    const totalCohortCount = data.length;

    // 3. Verified Skills count lookup
    const userIds = data.map(u => u.id);
    const verifiedCountsMap: Record<string, number> = {};

    if (userIds.length > 0) {
      try {
        // Verified competencies live in student_competency_mastery (competency engine).
        const { data: masteryData } = await admin
          .from('student_competency_mastery')
          .select('student_id, state')
          .in('student_id', userIds)
          .eq('state', 'verified');

        if (masteryData) {
          masteryData.forEach((row: { student_id: string }) => {
            verifiedCountsMap[row.student_id] = (verifiedCountsMap[row.student_id] || 0) + 1;
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

      const rawElo = (p as any).arena_elo;
      const eloRating = (rawElo !== undefined && rawElo !== null && Number(rawElo) > 0)
        ? Number(rawElo)
        : (1200 + Math.round(totalXp / 8));

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
        eloRating,
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
      entries.sort((a, b) => {
        if (b.eloRating !== a.eloRating) return b.eloRating - a.eloRating;
        return b.totalXp - a.totalXp;
      });
      entries.forEach((e, i) => { e.rank = i + 1; });
    }

    let currentUserEntry = entries.find(e => e.isCurrentUser) || null;

    // If current user is outside top limit, resolve their exact position so Cockpit never says "Unranked"
    if (!currentUserEntry && currentUserId && admin) {
      try {
        const { data: myProfile } = await admin
          .from('users')
          .select('id, display_name, avatar_url, college, target_role, ats_score, trust_score, xp_total, weekly_xp, league_tier, completed_quests, arena_elo')
          .eq('id', currentUserId)
          .maybeSingle();

        if (myProfile) {
          const myTier = (myProfile.league_tier && validLeagues.has(myProfile.league_tier.toLowerCase() as LeagueTier))
            ? (myProfile.league_tier.toLowerCase() as LeagueTier)
            : 'browns';

          if (myTier === activeLeague) {
            let rankQuery = admin
              .from('users')
              .select('id', { count: 'exact', head: true })
              .or('role.eq.student,role.is.null');

            if (activeLeague === 'browns') {
              rankQuery = rankQuery.or('league_tier.eq.browns,league_tier.is.null');
            } else {
              rankQuery = rankQuery.eq('league_tier', activeLeague);
            }
            rankQuery = rankQuery.gt('weekly_xp', myProfile.weekly_xp || 0);

            const { count: higherCount } = await rankQuery;
            const myRank = (higherCount || 0) + 1;
            const myWeeklyXp = Number(myProfile.weekly_xp) || 0;
            const myTotalXp = Number(myProfile.xp_total) || 0;
            const myDefense = Math.min(100, Math.max(0, Number(myProfile.ats_score) || 0));

            currentUserEntry = {
              rank: myRank,
              studentId: myProfile.id,
              name: myProfile.display_name || 'Student Candidate',
              avatarUrl: myProfile.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(myProfile.display_name || 'Student')}`,
              college: myProfile.college || 'PinIT Career OS Academy',
              programTitle: myProfile.target_role ? `${myProfile.target_role} Track` : 'Software Engineering Track',
              verifiedSkillsCount: 0,
              demonstratedSkillsCount: Array.isArray(myProfile.completed_quests) ? myProfile.completed_quests.length : 0,
              defenseScore: myDefense,
              readinessStatus: myDefense >= 80 ? 'ready_for_interview' : 'exploring',
              learningGainPoints: Math.max(0, Math.round(myTotalXp / 50)),
              eloRating: Number(myProfile.arena_elo) || (1200 + Math.round(myTotalXp / 8)),
              leagueTier: myTier,
              weeklyXp: myWeeklyXp,
              totalXp: myTotalXp,
              zone: myRank <= promotionCutoffRank ? 'promotion' : (activeLeague !== 'browns' && myRank >= demotionCutoffRank ? 'demotion' : 'safe'),
              isCurrentUser: true,
            };
          }
        }
      } catch (err) {
        console.warn('[Leaderboard] Failed to resolve off-cohort rank:', err);
      }
    }
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
        .select('league_tier')
        .or('role.eq.student,role.is.null');

      if (allTiers) {
        allTiers.forEach((row: any) => {
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
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    });
  } catch (err: any) {
    console.error('[Leaderboard] Server Error:', err);
    return NextResponse.json({ ok: false, error: err.message || 'Leaderboard server error' }, { status: 500 });
  }
}
