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
  eloGain?: number;
  leagueScore?: number;
  leagueTier: LeagueTier;
  weeklyXp: number;
  totalXp: number;
  zone: 'promotion' | 'safe' | 'demotion';
  isCurrentUser?: boolean;
}

export interface GuildLeaderboardEntry {
  rank: number;
  guildId: string;
  guildName: string;
  hackathonTitle: string;
  teamLeadName: string;
  membersCount: number;
  completedProjectsCount: number;
  status: string;
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

    // Local development cohort with realistic XP + ELO distributions across all 5 leagues
    if ((!rawUsers || rawUsers.length === 0) && !DB_CONFIGURED && process.env.NODE_ENV !== 'production') {
      const mockCohortsByTier: Record<LeagueTier, any[]> = {
        browns: [
          { id: currentUserId || 'test_user_001', display_name: 'Tanvi Agarwal (You)', avatar_url: '', college: 'RV College of Engineering', target_role: 'Full Stack Engineer', ats_score: 91, trust_score: 88, career_dna_score: 89, xp_total: 4200, weekly_xp: 1000, league_tier: 'browns', arena_elo: 140, completed_quests: ['q1', 'q2', 'q3'] },
          { id: 'peer_dev_01', display_name: 'Aarav Patel', avatar_url: '', college: 'RV College of Engineering', target_role: 'Full Stack Engineer', ats_score: 88, trust_score: 85, career_dna_score: 86, xp_total: 3450, weekly_xp: 950, league_tier: 'browns', arena_elo: 125, completed_quests: ['q1', 'q2'] },
          { id: 'peer_dev_02', display_name: 'Diya Sharma', avatar_url: '', college: 'BITS Pilani', target_role: 'AI / ML Engineer', ats_score: 84, trust_score: 80, career_dna_score: 82, xp_total: 2890, weekly_xp: 850, league_tier: 'browns', arena_elo: 130, completed_quests: ['q1'] },
          { id: 'peer_dev_03', display_name: 'Kabir Verma', avatar_url: '', college: 'IIT Bombay', target_role: 'DevOps & Cloud Engineer', ats_score: 79, trust_score: 78, career_dna_score: 77, xp_total: 2150, weekly_xp: 720, league_tier: 'browns', arena_elo: 115, completed_quests: ['q1'] },
          { id: 'peer_dev_04', display_name: 'Meera Iyer', avatar_url: '', college: 'NIT Trichy', target_role: 'Data Scientist', ats_score: 75, trust_score: 74, career_dna_score: 75, xp_total: 1650, weekly_xp: 350, league_tier: 'browns', arena_elo: 110, completed_quests: ['q1'] },
          { id: 'peer_dev_05', display_name: 'Rohan Deshmukh', avatar_url: '', college: 'PES University', target_role: 'Full Stack Engineer', ats_score: 70, trust_score: 70, career_dna_score: 71, xp_total: 980, weekly_xp: 120, league_tier: 'browns', arena_elo: 100, completed_quests: [] },
        ],
        silver: [
          { id: currentUserId || 'test_user_001', display_name: 'Tanvi Agarwal (You)', avatar_url: '', college: 'RV College of Engineering', target_role: 'Full Stack Engineer', ats_score: 92, trust_score: 89, career_dna_score: 90, xp_total: 6200, weekly_xp: 1420, league_tier: 'silver', arena_elo: 190, completed_quests: ['q1', 'q2', 'q3', 'q4'] },
          { id: 'silver_peer_01', display_name: 'Vikram Seth', avatar_url: '', college: 'IIT Delhi', target_role: 'Backend Architect', ats_score: 90, trust_score: 88, career_dna_score: 89, xp_total: 5800, weekly_xp: 1350, league_tier: 'silver', arena_elo: 185, completed_quests: ['q1', 'q2', 'q3'] },
          { id: 'silver_peer_02', display_name: 'Ananya Roy', avatar_url: '', college: 'IIT Madras', target_role: 'AI Researcher', ats_score: 88, trust_score: 86, career_dna_score: 87, xp_total: 5100, weekly_xp: 1180, league_tier: 'silver', arena_elo: 170, completed_quests: ['q1', 'q2'] },
          { id: 'silver_peer_03', display_name: 'Karthik Rao', avatar_url: '', college: 'IIIT Hyderabad', target_role: 'Distributed Systems', ats_score: 84, trust_score: 82, career_dna_score: 83, xp_total: 4400, weekly_xp: 920, league_tier: 'silver', arena_elo: 155, completed_quests: ['q1', 'q2'] },
          { id: 'silver_peer_04', display_name: 'Sneha Kulkarni', avatar_url: '', college: 'COEP Pune', target_role: 'Cloud Security', ats_score: 78, trust_score: 76, career_dna_score: 77, xp_total: 3600, weekly_xp: 480, league_tier: 'silver', arena_elo: 145, completed_quests: ['q1'] },
          { id: 'silver_peer_05', display_name: 'Tushar Nambiar', avatar_url: '', college: 'Manipal Univ', target_role: 'Frontend Engineer', ats_score: 74, trust_score: 72, career_dna_score: 73, xp_total: 3100, weekly_xp: 220, league_tier: 'silver', arena_elo: 140, completed_quests: [] },
        ],
        gold: [
          { id: currentUserId || 'test_user_001', display_name: 'Tanvi Agarwal (You)', avatar_url: '', college: 'RV College of Engineering', target_role: 'Full Stack Engineer', ats_score: 95, trust_score: 93, career_dna_score: 94, xp_total: 9400, weekly_xp: 2100, league_tier: 'gold', arena_elo: 270, completed_quests: ['q1', 'q2', 'q3', 'q4', 'q5'] },
          { id: 'gold_peer_01', display_name: 'Devin Vance', avatar_url: '', college: 'Stanford University', target_role: 'Systems Architect', ats_score: 94, trust_score: 92, career_dna_score: 93, xp_total: 8900, weekly_xp: 1980, league_tier: 'gold', arena_elo: 260, completed_quests: ['q1', 'q2', 'q3', 'q4'] },
          { id: 'gold_peer_02', display_name: 'Elena Rostova', avatar_url: '', college: 'ETH Zurich', target_role: 'Quant AI Engineer', ats_score: 93, trust_score: 91, career_dna_score: 92, xp_total: 8300, weekly_xp: 1750, league_tier: 'gold', arena_elo: 250, completed_quests: ['q1', 'q2', 'q3'] },
          { id: 'gold_peer_03', display_name: 'Arjun Singhania', avatar_url: '', college: 'IIT Bombay', target_role: 'Rust / Kernel Dev', ats_score: 89, trust_score: 87, career_dna_score: 88, xp_total: 7600, weekly_xp: 1400, league_tier: 'gold', arena_elo: 235, completed_quests: ['q1', 'q2'] },
          { id: 'gold_peer_04', display_name: 'Zoya Khan', avatar_url: '', college: 'DTU Delhi', target_role: 'MLOps Architect', ats_score: 84, trust_score: 82, career_dna_score: 83, xp_total: 6800, weekly_xp: 850, league_tier: 'gold', arena_elo: 220, completed_quests: ['q1'] },
          { id: 'gold_peer_05', display_name: 'Gaurav Sen', avatar_url: '', college: 'VJTI Mumbai', target_role: 'Full Stack Lead', ats_score: 80, trust_score: 79, career_dna_score: 80, xp_total: 6100, weekly_xp: 410, league_tier: 'gold', arena_elo: 205, completed_quests: [] },
        ],
        platinum: [
          { id: currentUserId || 'test_user_001', display_name: 'Tanvi Agarwal (You)', avatar_url: '', college: 'RV College of Engineering', target_role: 'Full Stack Engineer', ats_score: 97, trust_score: 96, career_dna_score: 96, xp_total: 14500, weekly_xp: 3200, league_tier: 'platinum', arena_elo: 380, completed_quests: ['q1', 'q2', 'q3', 'q4', 'q5', 'q6'] },
          { id: 'plat_peer_01', display_name: 'Kofi Mensah', avatar_url: '', college: 'MIT', target_role: 'Compiler Engineer', ats_score: 96, trust_score: 95, career_dna_score: 95, xp_total: 13800, weekly_xp: 3050, league_tier: 'platinum', arena_elo: 360, completed_quests: ['q1', 'q2', 'q3', 'q4', 'q5'] },
          { id: 'plat_peer_02', display_name: 'Priya Sundaram', avatar_url: '', college: 'NUS Singapore', target_role: 'High-Frequency Trader', ats_score: 95, trust_score: 94, career_dna_score: 94, xp_total: 12900, weekly_xp: 2800, league_tier: 'platinum', arena_elo: 345, completed_quests: ['q1', 'q2', 'q3', 'q4'] },
          { id: 'plat_peer_03', display_name: 'Lucas Silva', avatar_url: '', college: 'USP Brazil', target_role: 'Distributed Cloud Lead', ats_score: 91, trust_score: 90, career_dna_score: 91, xp_total: 11500, weekly_xp: 2100, league_tier: 'platinum', arena_elo: 320, completed_quests: ['q1', 'q2'] },
          { id: 'plat_peer_04', display_name: 'Nandini Das', avatar_url: '', college: 'IIT Kharagpur', target_role: 'AI Infrastructure', ats_score: 87, trust_score: 86, career_dna_score: 87, xp_total: 10200, weekly_xp: 1300, league_tier: 'platinum', arena_elo: 295, completed_quests: ['q1'] },
        ],
        ruby: [
          { id: currentUserId || 'test_user_001', display_name: 'Tanvi Agarwal (You)', avatar_url: '', college: 'RV College of Engineering', target_role: 'Grandmaster Architect', ats_score: 99, trust_score: 98, career_dna_score: 99, xp_total: 24000, weekly_xp: 4800, league_tier: 'ruby', arena_elo: 540, completed_quests: ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7'] },
          { id: 'ruby_peer_01', display_name: 'Siddharth Nair', avatar_url: '', college: 'IIT Bombay', target_role: 'Principal Systems Lead', ats_score: 98, trust_score: 97, career_dna_score: 98, xp_total: 22800, weekly_xp: 4600, league_tier: 'ruby', arena_elo: 510, completed_quests: ['q1', 'q2', 'q3', 'q4', 'q5', 'q6'] },
          { id: 'ruby_peer_02', display_name: 'Chloe Dubois', avatar_url: '', college: 'Polytechnique Paris', target_role: 'Core AI Fellow', ats_score: 97, trust_score: 96, career_dna_score: 97, xp_total: 21500, weekly_xp: 4200, league_tier: 'ruby', arena_elo: 480, completed_quests: ['q1', 'q2', 'q3', 'q4', 'q5'] },
          { id: 'ruby_peer_03', display_name: 'Kenji Takahashi', avatar_url: '', college: 'Univ of Tokyo', target_role: 'Quantum Computing', ats_score: 96, trust_score: 95, career_dna_score: 96, xp_total: 19800, weekly_xp: 3600, league_tier: 'ruby', arena_elo: 450, completed_quests: ['q1', 'q2', 'q3', 'q4'] },
          { id: 'ruby_peer_04', display_name: 'Rhea Chakraborty', avatar_url: '', college: 'IIT Kanpur', target_role: 'Autonomous Robotics', ats_score: 93, trust_score: 92, career_dna_score: 93, xp_total: 18200, weekly_xp: 2200, league_tier: 'ruby', arena_elo: 420, completed_quests: ['q1', 'q2'] },
        ]
      };
      rawUsers = mockCohortsByTier[activeLeague] || mockCohortsByTier.browns;
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
    let promotionCutoffRank = Math.max(1, Math.ceil(totalCohortCount * 0.10));
    let demotionCutoffRank = Math.max(1, totalCohortCount - Math.floor(totalCohortCount * 0.10) + 1);
    if (totalCohortCount >= 4 && totalCohortCount < 10) {
      promotionCutoffRank = 1;
      demotionCutoffRank = totalCohortCount;
    } else if (totalCohortCount >= 10 && demotionCutoffRank <= promotionCutoffRank) {
      demotionCutoffRank = promotionCutoffRank + 1;
    }

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
        : (100 + Math.min(60, Math.round(Math.sqrt(totalXp) * 0.8)));

      const eloGain = Math.max(0, eloRating - 100);
      const leagueScore = weeklyXp + Math.round(eloGain * 1.5);

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
        eloGain,
        leagueScore,
        leagueTier: normTier,
        weeklyXp,
        totalXp,
        zone,
        isCurrentUser: p.id === currentUserId,
      };
    });

    // Sort based on mode rules
    if (mode === 'weekly_leagues') {
      // Task 10: Promotion & Demotion rank determined by League Score (XP + ELO)
      entries.sort((a, b) => {
        const scoreA = a.leagueScore ?? (a.weeklyXp + Math.round((a.eloGain ?? 0) * 1.5));
        const scoreB = b.leagueScore ?? (b.weeklyXp + Math.round((b.eloGain ?? 0) * 1.5));
        if (scoreB !== scoreA) return scoreB - scoreA;
        if (b.weeklyXp !== a.weeklyXp) return b.weeklyXp - a.weeklyXp;
        if (b.eloRating !== a.eloRating) return b.eloRating - a.eloRating;
        return b.totalXp - a.totalXp;
      });
      entries.forEach((e, i) => {
        e.rank = i + 1;
        if (activeLeague !== 'ruby' && e.rank <= promotionCutoffRank && totalCohortCount >= 2) {
          e.zone = 'promotion';
        } else if (activeLeague !== 'browns' && e.rank >= demotionCutoffRank && totalCohortCount >= 2 && e.rank > promotionCutoffRank) {
          e.zone = 'demotion';
        } else {
          e.zone = 'safe';
        }
      });
    } else if (mode === 'global') {
      // Global ranking by total XP
      entries.sort((a, b) => b.totalXp - a.totalXp);
      entries.forEach((e, i) => { e.rank = i + 1; });
    } else if (mode === 'verified_evidence') {
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

            const myRawElo = (myProfile as any).arena_elo;
            const myEloRating = (myRawElo !== undefined && myRawElo !== null && Number(myRawElo) > 0)
              ? Number(myRawElo)
              : (100 + Math.min(60, Math.round(Math.sqrt(myTotalXp) * 0.8)));
            const myEloGain = Math.max(0, myEloRating - 100);
            const myLeagueScore = myWeeklyXp + Math.round(myEloGain * 1.5);

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
              eloRating: myEloRating,
              eloGain: myEloGain,
              leagueScore: myLeagueScore,
              leagueTier: myTier,
              weeklyXp: myWeeklyXp,
              totalXp: myTotalXp,
              zone: (activeLeague !== 'ruby' && myRank <= promotionCutoffRank) ? 'promotion' : (activeLeague !== 'browns' && myRank >= demotionCutoffRank ? 'demotion' : 'safe'),
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

      if (allTiers && allTiers.length > 0) {
        allTiers.forEach((row: any) => {
          const t = (row.league_tier || 'browns').toLowerCase() as LeagueTier;
          if (validLeagues.has(t)) {
            leagueCounts[t] = (leagueCounts[t] || 0) + 1;
          } else {
            leagueCounts.browns += 1;
          }
        });
      } else if (!DB_CONFIGURED) {
        leagueCounts.browns = 36;
        leagueCounts.silver = 24;
        leagueCounts.gold = 16;
        leagueCounts.platinum = 8;
        leagueCounts.ruby = 5;
      }
    } catch {}

    const guilds: GuildLeaderboardEntry[] = [
      {
        rank: 1,
        guildId: 'guild_01',
        guildName: 'ByteCraft Autonomous Systems',
        hackathonTitle: 'Global AI & Cloud Distributed Systems Hackathon',
        teamLeadName: 'Devin Vance',
        membersCount: 4,
        completedProjectsCount: 5,
        status: 'verified'
      },
      {
        rank: 2,
        guildId: 'guild_02',
        guildName: 'NeuralEdge Labs',
        hackathonTitle: 'Decentralized Microservices Summit',
        teamLeadName: 'Elena Rostova',
        membersCount: 3,
        completedProjectsCount: 4,
        status: 'verified'
      },
      {
        rank: 3,
        guildId: 'guild_03',
        guildName: 'Argon Cyber Sentinels',
        hackathonTitle: 'Zero-Trust Collegiate Security Quest',
        teamLeadName: 'Kofi Mensah',
        membersCount: 3,
        completedProjectsCount: 3,
        status: 'verified'
      },
      {
        rank: 4,
        guildId: 'guild_04',
        guildName: 'Fullstack Hyperloop Guild',
        hackathonTitle: 'Open Source Cloud Architecture Sprint',
        teamLeadName: 'Aarav Patel',
        membersCount: 2,
        completedProjectsCount: 2,
        status: 'building'
      }
    ];

    return NextResponse.json({
      ok: true,
      mode,
      activeLeague,
      currentUserLeague,
      leaderboard: entries,
      guilds,
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
