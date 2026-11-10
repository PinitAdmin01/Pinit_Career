'use client';

import React, { useState, useEffect, useMemo, useRef, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { useCareerOS } from '@/lib/context/CareerOSContext';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/lib/store/useAppStore';
import LeagueBadge, { LeagueTier, LEAGUE_CONFIGS, normalizeLeagueTier } from '@/components/pins/LeagueBadge';
import PinCoin from '@/components/pins/PinCoin';

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

// Task 10: 4 Sub-Tabs: Region/College, Global, Guild Projects, and League Promotion/Demotion
export type TabMode = 'region_college' | 'global' | 'guild_projects' | 'weekly_leagues';

const ALL_LEAGUES: LeagueTier[] = ['browns', 'silver', 'gold', 'platinum', 'ruby'];

function formatCountdown(ms: number): string {
  if (ms <= 0) return 'Resetting sprint...';
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }
  return `${hours}h ${minutes}m ${seconds}s`;
}

function LeaderboardContent() {
  const { user } = useAuth();
  const cOS = useCareerOS();
  const searchParams = useSearchParams();

  // Mode initial state (supports both ?mode= and ?tab= cross-links from Arena)
  const rawMode = searchParams?.get('mode') || searchParams?.get('tab');
  const initialMode: TabMode =
    rawMode === 'global' ? 'global' :
    rawMode === 'guild_projects' ? 'guild_projects' :
    (rawMode === 'weekly_leagues' || rawMode === 'code_wars') ? 'weekly_leagues' :
    rawMode === 'region_college' ? 'region_college' :
    'weekly_leagues';

  const [activeTab, setActiveTab] = useState<TabMode>(initialMode);
  const [selectedLeague, setSelectedLeague] = useState<LeagueTier>('browns');
  const [currentUserLeague, setCurrentUserLeague] = useState<LeagueTier>('browns');
  const [isLeagueModalOpen, setIsLeagueModalOpen] = useState(false);
  const hasManuallySelectedRef = useRef(false);
  const [domainFilter, setDomainFilter] = useState<'all' | 'tech' | 'data' | 'ai'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [serverCurrentUser, setServerCurrentUser] = useState<LeaderboardEntry | null>(null);
  const [guilds, setGuilds] = useState<GuildLeaderboardEntry[]>([]);
  const [promotionCutoff, setPromotionCutoff] = useState(1);
  const [demotionCutoff, setDemotionCutoff] = useState(1);
  const [remainingMs, setRemainingMs] = useState(0);
  const [leagueCounts, setLeagueCounts] = useState<Record<LeagueTier, number>>({
    browns: 0,
    silver: 0,
    gold: 0,
    platinum: 0,
    ruby: 0,
  });
  const [loading, setLoading] = useState(true);

  const [showXpReqTooltip, setShowXpReqTooltip] = useState(false);
  const [showResetTooltip, setShowResetTooltip] = useState(false);

  // Task 10: 100 XP League Gate State
  const userTotalXp = typeof cOS?.xp === 'number' && Number.isFinite(cOS.xp)
    ? cOS.xp
    : Number((user as any)?.xp_total || (user as any)?.xp || 0);

  const [joinedLeague, setJoinedLeague] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const stored = localStorage.getItem(`pinit_joined_league_${user?.id || 'default'}`);
    return stored === 'true' || Boolean((user as any)?.league_tier);
  });

  const handleJoinLeague = async () => {
    console.log('[LEADERBOARD_CLIENT][Join League Triggered]', { userId: user?.id, userTotalXp });
    if (userTotalXp < 100) {
      toast.error('League Locked', `You need 100 XP to join the Weekly Ranked League. You currently have ${userTotalXp} XP.`);
      return;
    }
    setJoinedLeague(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem(`pinit_joined_league_${user?.id || 'default'}`, 'true');
    }

    // Persist league tier to Supabase database
    if (user?.id) {
      try {
        await supabase.from('users').update({ league_tier: 'browns' }).eq('id', user.id);
        console.log('[LEADERBOARD_CLIENT][Persisted league_tier: browns to Supabase]');
      } catch (err) {
        console.warn('[Leaderboard] Failed to persist league_tier to Supabase:', err);
      }
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('pinit:user_profile_updated', {
        detail: { league_tier: 'browns' }
      }));
    }
    setRefreshTrigger(prev => prev + 1);
    toast.success('Joined Weekly Ranked League!', 'Welcome to the Browns Division. Climb the ranks with Weekly XP & 1v1 Code Wars!');
  };

  // Live 1-second countdown ticker for Monday 1:00 AM IST reset
  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingMs(prev => Math.max(0, prev - 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Real-time synchronization trigger when combat matches settle
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Synchronize joinedLeague reactively when user hydrates or server profile arrives
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if ((user as any)?.league_tier || serverCurrentUser?.leagueTier) {
      setJoinedLeague(true);
      return;
    }
    if (user?.id) {
      const stored = localStorage.getItem(`pinit_joined_league_${user.id}`);
      if (stored === 'true') {
        setJoinedLeague(true);
      }
    }
  }, [user, serverCurrentUser]);

  // Modal Escape key listener and body scroll-lock
  useEffect(() => {
    if (!isLeagueModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsLeagueModalOpen(false);
      }
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isLeagueModalOpen]);

  useEffect(() => {
    const handleProfileUpdate = (e: any) => {
      console.log('[LEADERBOARD_CLIENT][Profile Update Event Received]', e?.detail);
      if (e?.detail) {
        if (e.detail.league_tier) {
          setJoinedLeague(true);
        }
        const updatedElo = typeof e.detail.arena_elo === 'number' 
          ? e.detail.arena_elo 
          : (typeof e.detail.elo === 'number' ? e.detail.elo : undefined);
        const updatedWeeklyXp = typeof e.detail.weekly_xp === 'number' 
          ? e.detail.weekly_xp 
          : (typeof e.detail.weeklyXp === 'number' ? e.detail.weeklyXp : undefined);
        const updatedTotalXp = typeof e.detail.xp_total === 'number' 
          ? e.detail.xp_total 
          : (typeof e.detail.totalXp === 'number' ? e.detail.totalXp : (typeof e.detail.xp === 'number' ? e.detail.xp : undefined));

        if (user) {
          if (typeof updatedElo === 'number') (user as any).arena_elo = updatedElo;
          if (typeof updatedWeeklyXp === 'number') (user as any).weekly_xp = updatedWeeklyXp;
          if (typeof updatedTotalXp === 'number') (user as any).xp_total = updatedTotalXp;
        }

        // Instant HUD recalculation with 0ms latency
        setServerCurrentUser(prev => {
          if (!prev) return null;
          const elo = typeof updatedElo === 'number' ? updatedElo : prev.eloRating;
          const weeklyXp = typeof updatedWeeklyXp === 'number' ? updatedWeeklyXp : prev.weeklyXp;
          const totalXp = typeof updatedTotalXp === 'number' ? updatedTotalXp : prev.totalXp;
          const eloGain = Math.max(0, elo - 100);
          const leagueScore = weeklyXp + Math.round(eloGain * 1.5);
          return {
            ...prev,
            eloRating: elo,
            eloGain,
            weeklyXp,
            totalXp,
            leagueScore,
          };
        });
      }
      setRefreshTrigger(prev => prev + 1);
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('pinit:user_profile_updated', handleProfileUpdate as EventListener);
      return () => window.removeEventListener('pinit:user_profile_updated', handleProfileUpdate as EventListener);
    }
  }, [user]);

  // Fetch real leaderboard telemetry from server
  useEffect(() => {
    let isMounted = true;
    async function fetchLeaderboard() {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          mode: activeTab,
          league: selectedLeague,
        });
        if (user?.id) {
          params.set('userId', user.id);
        }

        let authHeader: Record<string, string> = {};
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.access_token) {
            authHeader = { Authorization: `Bearer ${session.access_token}` };
          }
        } catch {}

        console.log('[LEADERBOARD_CLIENT][Fetch Inflight]', {
          mode: activeTab,
          league: selectedLeague,
          userId: user?.id || 'guest',
        });
        const clientStartTime = performance.now();

        const res = await fetch(`/api/leaderboard?${params.toString()}`, {
          headers: {
            ...authHeader,
            ...(user?.id ? { 'x-user-id': user.id } : {}),
          },
          cache: 'no-store',
        });
        const data = await res.json();
        const clientDuration = Math.round(performance.now() - clientStartTime);

        console.log('[LEADERBOARD_CLIENT][Fetch Complete]', {
          ok: data.ok,
          entries: data.leaderboard?.length,
          guilds: data.guilds?.length,
          userRank: data.currentUser?.rank,
          clientDurationMs: clientDuration,
        });

        if (data.ok && isMounted) {
          setLeaderboard(Array.isArray(data.leaderboard) ? data.leaderboard : []);
          if (data.currentUser) {
            setServerCurrentUser(data.currentUser);
          }
          if (Array.isArray(data.guilds)) {
            setGuilds(data.guilds);
          }
          setPromotionCutoff(data.promotionCutoffRank || 1);
          setDemotionCutoff(data.demotionCutoffRank || 1);
          if (typeof data.remainingMs === 'number') {
            setRemainingMs(data.remainingMs);
          }
          if (data.currentUserLeague) {
            const userTier = normalizeLeagueTier(data.currentUserLeague);
            setCurrentUserLeague(userTier);
            if (!hasManuallySelectedRef.current && userTier !== 'browns') {
              setSelectedLeague(userTier);
            }
          }
          if (data.leagueCounts) {
            setLeagueCounts(data.leagueCounts);
          }
        }
      } catch (err) {
        console.error('[Leaderboard] Failed to fetch data:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchLeaderboard();
    return () => { isMounted = false; };
  }, [activeTab, selectedLeague, user?.id, refreshTrigger]);

  // User's college for Regional filter
  const userCollege = (user as any)?.college || (cOS as any)?.onboardingAnswers?.college || 'RV College of Engineering';

  // Current user's entry in the leaderboard
  const currentUserEntry = useMemo(() => {
    const fromTable = leaderboard.find(e => e.isCurrentUser || e.studentId === user?.id);
    if (fromTable) return fromTable;
    if (serverCurrentUser) return serverCurrentUser;

    if (user?.id) {
      const clientXp = Number((user as any).weekly_xp) || Number((cOS as any)?.dna?.experience) || (userTotalXp > 0 ? userTotalXp : 0);
      const rawUserElo = Number((user as any).arena_elo);
      const clientElo = (rawUserElo === 1200 && !(user as any).arena_wins) ? 100 : (rawUserElo > 0 ? rawUserElo : 100);
      const clientEloGain = Math.max(0, clientElo - 100);
      const clientLeagueScore = clientXp + Math.round(clientEloGain * 1.5);
      const userName = typeof user.name === 'string' ? user.name : ((user as any).display_name || 'Student Candidate');
      return {
        rank: 1,
        studentId: user.id,
        name: userName,
        avatarUrl: user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(userName)}`,
        college: userCollege,
        programTitle: 'Engineering Track',
        verifiedSkillsCount: 0,
        demonstratedSkillsCount: 0,
        defenseScore: 75,
        readinessStatus: 'exploring',
        learningGainPoints: Math.round(clientXp / 50),
        eloRating: clientElo,
        eloGain: clientEloGain,
        leagueScore: clientLeagueScore,
        leagueTier: currentUserLeague,
        weeklyXp: clientXp,
        totalXp: userTotalXp,
        zone: 'safe',
        isCurrentUser: true,
      } as LeaderboardEntry;
    }
    return null;
  }, [leaderboard, serverCurrentUser, user, cOS, userCollege, currentUserLeague, userTotalXp]);

  // Filtered entries by domain, search, and region/college
  const filteredEntries = useMemo(() => {
    let list = leaderboard;

    // Filter by Region/College if activeTab === 'region_college'
    if (activeTab === 'region_college') {
      const matchCollege = list.filter(e => e.college.toLowerCase().includes(userCollege.toLowerCase()) || userCollege.toLowerCase().includes(e.college.toLowerCase()));
      // If at least one matching college student exists, scope to college; otherwise show all regional peers
      if (matchCollege.length > 0) {
        list = matchCollege;
      }
    }

    const result = list.filter(entry => {
      const matchesSearch = !searchQuery ||
        entry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.college.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.programTitle.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDomain = domainFilter === 'all' ||
        entry.programTitle.toLowerCase().includes(domainFilter);

      return matchesSearch && matchesDomain;
    });

    if (currentUserEntry && !result.some(e => e.studentId === currentUserEntry.studentId || e.isCurrentUser)) {
      const matchesSearch = !searchQuery ||
        currentUserEntry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        currentUserEntry.college.toLowerCase().includes(searchQuery.toLowerCase()) ||
        currentUserEntry.programTitle.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDomain = domainFilter === 'all' || currentUserEntry.programTitle.toLowerCase().includes(domainFilter);
      if (matchesSearch && matchesDomain) {
        result.push(currentUserEntry);
      }
    }

    return result;
  }, [leaderboard, searchQuery, domainFilter, activeTab, userCollege, currentUserEntry]);

  const activeLeagueMeta = LEAGUE_CONFIGS[selectedLeague];
  const userLeagueMeta = LEAGUE_CONFIGS[currentUserLeague];

  return (
    <div style={{ background: 'transparent', color: 'var(--text)', maxWidth: 1340, margin: '0 auto', padding: '0 0 40px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>

      {/* ── TOP ELEVATED COCKPIT TELEMETRY HUD (25% Compact Scale) ──────── */}
      <div
        data-testid="cockpit-telemetry-hud"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 12,
          padding: '12px 18px',
          borderRadius: 14,
          background: 'linear-gradient(135deg, var(--card) 0%, var(--bg3) 100%)',
          border: `1.5px solid ${userLeagueMeta.color}45`,
          boxShadow: `var(--shadow-sm), 0 0 16px ${userLeagueMeta.color}15`,
          marginBottom: 16,
          alignItems: 'center',
        }}
      >
        {/* Card 1: Active League & Interactive Division Selector Trigger */}
        <button
          type="button"
          className="pinit-emblem-launcher"
          data-testid="interactive-league-emblem-btn"
          onClick={() => setIsLeagueModalOpen(true)}
          title="Click to inspect all competitive divisions"
          aria-haspopup="dialog"
          aria-expanded={isLeagueModalOpen}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            background: 'transparent',
            border: 'none',
            padding: '4px 8px',
            margin: '-4px -8px',
            borderRadius: 12,
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            outline: 'none',
          }}
        >
          <div style={{ position: 'relative' }}>
            <LeagueBadge tier={selectedLeague} size="sm" glow animate />
            <div
              style={{
                position: 'absolute',
                bottom: -2,
                right: -2,
                width: 15,
                height: 15,
                borderRadius: 8,
                background: activeLeagueMeta.color,
                color: (selectedLeague === 'silver' || selectedLeague === 'gold') ? '#0f172a' : '#ffffff',
                fontSize: 9,
                fontWeight: 900,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 0 8px ${activeLeagueMeta.color}`,
              }}
            >
              ⇄
            </div>
          </div>
          <div>
            <div style={{ fontSize: 10.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: activeLeagueMeta.color, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>Active Division</span>
              <span style={{ fontSize: 9.5, padding: '1px 5px', borderRadius: 4, background: `${activeLeagueMeta.color}22`, border: `1px solid ${activeLeagueMeta.color}50`, textTransform: 'none' }}>
                Switch ▾
              </span>
            </div>
            <div style={{ fontSize: 16.5, fontWeight: 900, color: 'var(--t1)', margin: '1px 0' }}>
              {activeLeagueMeta.title}
            </div>
            <div style={{ fontSize: 11.5, color: 'var(--t3)' }}>
              {activeLeagueMeta.slogan}
            </div>
          </div>
        </button>

        {/* Card 2: Sprint Standing & Promotion Status */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: 10.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--t3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>Current Sprint Standing ($XP + ELO$)</span>
            <span style={{ fontSize: 9.5, padding: '1px 6px', borderRadius: 4, background: 'rgba(99, 102, 241, 0.12)', color: 'var(--accent, #4f46e5)', fontWeight: 800 }}>LIVE SPRINT</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 900, color: '#d97706' }}>
              {currentUserEntry ? `#${currentUserEntry.rank}` : 'Unranked'}
            </span>
            <span style={{ fontSize: 12, color: 'var(--t2)', fontFamily: 'var(--font-mono)' }}>
              {currentUserEntry
                ? `${currentUserEntry.weeklyXp.toLocaleString()} XP + ${currentUserEntry.eloGain ?? 0} ELO Gain`
                : 'Earn XP & Duel in Code Wars!'}
            </span>
            {currentUserEntry && (
              <span style={{ fontSize: 11, fontWeight: 800, padding: '1px 6px', borderRadius: 4, background: 'rgba(16, 185, 129, 0.12)', color: '#059669', fontFamily: 'var(--font-mono)' }}>
                {(currentUserEntry.leagueScore ?? (currentUserEntry.weeklyXp + Math.round((currentUserEntry.eloGain ?? 0) * 1.5))).toLocaleString()} pts
              </span>
            )}
          </div>

          <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            {currentUserEntry?.zone === 'promotion' ? (
              <span style={{ padding: '2px 8px', borderRadius: 6, background: 'rgba(16,185,129,0.15)', border: '1px solid #10b981', color: '#059669', fontSize: 10.5, fontWeight: 800, boxShadow: '0 0 10px rgba(16,185,129,0.18)' }}>
                In Promotion Zone! Advance to {userLeagueMeta.nextTier ? LEAGUE_CONFIGS[userLeagueMeta.nextTier].title : 'Champions'}
              </span>
            ) : currentUserEntry?.zone === 'demotion' ? (
              <span style={{ padding: '2px 8px', borderRadius: 6, background: 'rgba(239,68,68,0.15)', border: '1px solid #ef4444', color: '#dc2626', fontSize: 10.5, fontWeight: 800, boxShadow: '0 0 10px rgba(239,68,68,0.18)' }}>
                In Demotion Zone! Earn XP to remain in {userLeagueMeta.title}
              </span>
            ) : (
              <span style={{ padding: '2px 8px', borderRadius: 6, background: 'rgba(99,102,241,0.15)', border: '1px solid #6366f1', color: '#4f46e5', fontSize: 10.5, fontWeight: 800 }}>
                Safe Zone — Remaining in {userLeagueMeta.title}
              </span>
            )}
          </div>
        </div>

        {/* Right Section: Two Dynamic Circles Side-by-Side (Task 1) */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 16 }}>
          {/* Circle 1: League Entry Requirement: 100 XP Needed to Join (Vanishes when requirement met) */}
          {(userTotalXp < 100 && !joinedLeague) && (
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setShowXpReqTooltip(prev => !prev)}
                title="League Entry Requirement: 100 XP Needed to Join"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                <div style={{ position: 'relative', width: 54, height: 54 }}>
                  <svg width="54" height="54" viewBox="0 0 54 54">
                    <circle
                      cx="27"
                      cy="27"
                      r="22"
                      fill="none"
                      stroke="rgba(245, 158, 11, 0.2)"
                      strokeWidth="4"
                    />
                    <circle
                      cx="27"
                      cy="27"
                      r="22"
                      fill="none"
                      stroke="url(#xpReqGradient)"
                      strokeWidth="4"
                      strokeDasharray={138.23}
                      strokeDashoffset={138.23 * (1 - Math.min(1, Math.max(0, userTotalXp / 100)))}
                      strokeLinecap="round"
                      transform="rotate(-90 27 27)"
                      style={{ transition: 'stroke-dashoffset 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}
                    />
                    <defs>
                      <linearGradient id="xpReqGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#eab308" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    pointerEvents: 'none',
                  }}>
                    <span style={{ fontSize: 11, fontWeight: 900, color: '#f59e0b', fontFamily: 'var(--font-mono)', lineHeight: 1 }}>
                      {userTotalXp}
                    </span>
                    <span style={{ fontSize: 8, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase', lineHeight: 1, marginTop: 1 }}>
                      100 XP
                    </span>
                  </div>
                </div>
                <span style={{ fontSize: 9, fontWeight: 800, color: '#f59e0b', marginTop: 4, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  Entry Req
                </span>
              </button>

              {/* Popover on click */}
              {showXpReqTooltip && (
                <div
                  data-testid="xp-requirement-popover"
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: 8,
                    zIndex: 100,
                    width: 240,
                    padding: '12px 14px',
                    borderRadius: 12,
                    background: 'var(--card)',
                    border: '1.5px solid rgba(245, 158, 11, 0.4)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ fontSize: 11.5, fontWeight: 800, color: '#f59e0b', marginBottom: 4 }}>
                    League Entry Requirement: 100 XP Needed to Join
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--t2)', lineHeight: 1.4 }}>
                    Earn <strong>{Math.max(0, 100 - userTotalXp)} more XP</strong> in Quests or Code Wars to unlock Ranked Leagues. Current: {userTotalXp}/100 XP.
                  </div>
                  <div style={{ marginTop: 8, height: 4, borderRadius: 2, background: 'rgba(245, 158, 11, 0.2)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${Math.min(100, (userTotalXp / 100) * 100)}%`, background: '#f59e0b' }} />
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <Link
                      href="/arena?tab=code_wars"
                      style={{
                        display: 'inline-block',
                        fontSize: 11,
                        fontWeight: 700,
                        color: '#f59e0b',
                        textDecoration: 'underline',
                      }}
                    >
                      Duel in 1v1 Code Wars →
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Circle 2: Reset Clock to promote or demote users */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setShowResetTooltip(prev => !prev)}
              title="Weekly Sprint Reset Clock: Promote & Demote"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              <div style={{ position: 'relative', width: 54, height: 54 }}>
                <svg width="54" height="54" viewBox="0 0 54 54">
                  <circle
                    cx="27"
                    cy="27"
                    r="22"
                    fill="none"
                    stroke="rgba(56, 189, 248, 0.2)"
                    strokeWidth="4"
                  />
                  <circle
                    cx="27"
                    cy="27"
                    r="22"
                    fill="none"
                    stroke="url(#resetClockGradient)"
                    strokeWidth="4"
                    strokeDasharray={138.23}
                    strokeDashoffset={138.23 * (1 - Math.min(1, Math.max(0, remainingMs / (7 * 24 * 60 * 60 * 1000))))}
                    strokeLinecap="round"
                    transform="rotate(-90 27 27)"
                    style={{ transition: 'stroke-dashoffset 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}
                  />
                  <defs>
                    <linearGradient id="resetClockGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor={remainingMs < 86400000 ? '#ef4444' : '#38bdf8'} />
                      <stop offset="100%" stopColor={remainingMs < 86400000 ? '#f43f5e' : '#6366f1'} />
                    </linearGradient>
                  </defs>
                </svg>
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  pointerEvents: 'none',
                }}>
                  <span style={{ fontSize: 11, fontWeight: 900, color: remainingMs < 86400000 ? '#ef4444' : '#38bdf8', fontFamily: 'var(--font-mono)', lineHeight: 1 }}>
                    {Math.floor(remainingMs / 86400000)}d
                  </span>
                  <span style={{ fontSize: 8.5, fontWeight: 700, color: 'var(--t3)', fontFamily: 'var(--font-mono)', lineHeight: 1, marginTop: 1 }}>
                    {Math.floor((remainingMs % 86400000) / 3600000)}h
                  </span>
                </div>
              </div>
              <span style={{ fontSize: 9, fontWeight: 800, color: remainingMs < 86400000 ? '#ef4444' : '#38bdf8', marginTop: 4, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                Reset Clock
              </span>
            </button>

            {/* Popover on click */}
            {showResetTooltip && (
              <div
                data-testid="reset-clock-popover"
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: 8,
                  zIndex: 100,
                  width: 250,
                  padding: '12px 14px',
                  borderRadius: 12,
                  background: 'var(--card)',
                  border: '1.5px solid rgba(56, 189, 248, 0.4)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                  textAlign: 'left',
                }}
              >
                <div style={{ fontSize: 11.5, fontWeight: 800, color: '#38bdf8', marginBottom: 4 }}>
                  Weekly Sprint Reset Clock
                </div>
                <div style={{ fontSize: 12, fontWeight: 900, color: 'var(--t1)', fontFamily: 'var(--font-mono)', marginBottom: 4 }}>
                  {formatCountdown(remainingMs)}
                </div>
                <div style={{ fontSize: 10.5, color: 'var(--t2)', lineHeight: 1.4 }}>
                  Sprint resets Monday at 1:00 AM IST. Top 10% promote to higher league; bottom 10% demote.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Task 10: 100 XP League Entry Gate & Qualification Banner ───── */}
      {userTotalXp < 100 ? (
        <div
          data-testid="league-100xp-gate"
          style={{
            padding: '20px 24px',
            borderRadius: 16,
            background: 'rgba(234, 179, 8, 0.08)',
            border: '1.5px dashed rgba(234, 179, 8, 0.35)',
            marginBottom: 24,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: 'rgba(234, 179, 8, 0.12)',
              border: '1.5px solid rgba(234, 179, 8, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#eab308" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#eab308' }}>
                League Entry Requirement: 100 XP Needed to Join
              </div>
              <div style={{ fontSize: 13.5, color: 'var(--t2)', marginTop: 2 }}>
                You can view players across all divisions, but cannot join the competitive ranked league until reaching 100 XP.
              </div>
            </div>
          </div>

          <div style={{ minWidth: 220 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 700, color: '#eab308', marginBottom: 4 }}>
              <span>League Qualification</span>
              <span>{userTotalXp} / 100 XP</span>
            </div>
            <div style={{ height: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 999, overflow: 'hidden' }}>
              <div
                style={{
                  width: `${Math.min(100, Math.round((userTotalXp / 100) * 100))}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #eab308, #ca8a04)',
                  borderRadius: 999,
                }}
              />
            </div>
          </div>
        </div>
      ) : !joinedLeague ? (
        <div
          data-testid="league-qualified-banner"
          style={{
            padding: '20px 24px',
            borderRadius: 16,
            background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.12) 0%, rgba(16, 185, 129, 0.08) 100%)',
            border: '1.5px solid rgba(34, 197, 94, 0.35)',
            marginBottom: 24,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: 'rgba(34, 197, 94, 0.12)',
              border: '1.5px solid rgba(34, 197, 94, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#22c55e' }}>
                You Have Reached 100+ XP! League Entry Unlocked
              </div>
              <div style={{ fontSize: 13.5, color: 'var(--t2)', marginTop: 2 }}>
                You are now eligible to join the competitive Weekly Ranked League. Join now to enter this sprint!
              </div>
            </div>
          </div>

          <button
            onClick={handleJoinLeague}
            data-testid="join-league-btn"
            style={{
              padding: '10px 22px',
              borderRadius: 10,
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#fff',
              fontSize: 14,
              fontWeight: 800,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
            }}
          >
            Join Ranked League Now
          </button>
        </div>
      ) : null}

      {/* ── Mode Switcher Sub-Tabs (Reduced by 30%, Emojis Purged per Task 3) ── */}
      <div style={{
        display: 'flex',
        gap: 6,
        padding: '4px',
        borderRadius: 10,
        background: 'var(--bg2)',
        border: '1px solid var(--border)',
        marginBottom: 16,
        overflowX: 'auto'
      }}>
        {[
          { id: 'region_college', label: 'Region / College' },
          { id: 'global', label: 'Global Leaderboard' },
          { id: 'guild_projects', label: 'Guild Projects' },
          { id: 'weekly_leagues', label: 'League Promotion & Demotion' },
        ].map(tab => (
          <button
            key={tab.id}
            data-testid={`subtab-${tab.id}`}
            onClick={() => setActiveTab(tab.id as TabMode)}
            style={{
              flex: 1,
              minWidth: 125,
              padding: '7px 12px',
              borderRadius: 8,
              border: activeTab === tab.id ? '1.5px solid var(--accent)' : '1px solid transparent',
              background: activeTab === tab.id
                ? 'var(--accent-light)'
                : 'transparent',
              color: activeTab === tab.id ? 'var(--accent-hover, var(--brand-bright, #4f46e5))' : 'var(--t2)',
              fontWeight: 800,
              fontSize: 12,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease'
            }}
          >
            <span>{tab.label}</span>
          </button>
        ))}
      </div>



      {/* ── Interactive Game-Dev League Division Vault Modal ──────────── */}
      {isLeagueModalOpen && (
        <div
          data-testid="league-division-modal-overlay"
          onClick={() => setIsLeagueModalOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(3, 7, 18, 0.78)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
            animation: 'pinitOverlayFade 0.2s ease-out',
          }}
        >
          <style>{`
            @keyframes pinitOverlayFade {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes pinitVaultEntrance {
              from { opacity: 0; transform: scale(0.95) translateY(10px); }
              to { opacity: 1; transform: scale(1) translateY(0); }
            }
            .pinit-vault-tier-card:hover {
              transform: translateY(-4px);
              box-shadow: 0 10px 28px rgba(0,0,0,0.4) !important;
            }
            .pinit-emblem-launcher:hover {
              background: rgba(255, 255, 255, 0.05) !important;
              transform: scale(1.02);
            }
          `}</style>
          <div
            data-testid="league-division-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Competitive Division Vault"
            onClick={e => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: 960,
              maxHeight: 'min(90vh, 760px)',
              overflowY: 'auto',
              background: 'linear-gradient(145deg, var(--card) 0%, var(--bg3) 100%)',
              border: `1.5px solid ${activeLeagueMeta.color}60`,
              borderRadius: 22,
              padding: '24px 28px',
              boxShadow: `0 20px 60px rgba(0, 0, 0, 0.6), 0 0 40px ${activeLeagueMeta.color}25`,
              position: 'relative',
              animation: 'pinitVaultEntrance 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  background: 'rgba(99, 102, 241, 0.12)',
                  border: '1.5px solid rgba(99, 102, 241, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                </div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--t1)', letterSpacing: '-0.3px' }}>
                    Competitive Division Vault
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--t2)', marginTop: 2 }}>
                    Select any league division to inspect live sprint contenders, rankings, and promotion brackets.
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsLeagueModalOpen(false)}
                data-testid="close-league-modal-btn"
                aria-label="Close division vault"
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid var(--border)',
                  color: 'var(--t2)',
                  width: 34,
                  height: 34,
                  borderRadius: 17,
                  cursor: 'pointer',
                  fontSize: 15,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.15s ease',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {/* 5 League Division Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 12 }}>
              {ALL_LEAGUES.map(tier => {
                const meta = LEAGUE_CONFIGS[tier];
                const isSelected = selectedLeague === tier;
                const isUserTier = currentUserLeague === tier;
                const count = leagueCounts[tier] || 0;

                return (
                  <button
                    key={tier}
                    type="button"
                    className="pinit-vault-tier-card"
                    data-testid={`select-league-${tier}`}
                    onClick={() => {
                      console.log('[LEADERBOARD_CLIENT][Division Switched]', { from: selectedLeague, to: tier });
                      setSelectedLeague(tier);
                      hasManuallySelectedRef.current = true;
                      setIsLeagueModalOpen(false);
                      if (activeTab !== 'weekly_leagues') {
                        setActiveTab('weekly_leagues');
                      }
                      toast.info(`Inspecting ${meta.title}`, `Loaded ${meta.title} sprint ladder.`);
                    }}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 12,
                      padding: '18px 14px',
                      borderRadius: 16,
                      border: isSelected ? `2px solid ${meta.color}` : '1px solid var(--border)',
                      background: isSelected ? meta.bgGradient : 'var(--card)',
                      boxShadow: isSelected ? `0 6px 24px ${meta.glowColor}` : 'var(--shadow-sm)',
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                      position: 'relative',
                    }}
                  >
                    {isUserTier && (
                      <div style={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        fontSize: 10,
                        padding: '2px 6px',
                        borderRadius: 4,
                        background: meta.color,
                        color: (tier === 'silver' || tier === 'gold') ? '#0f172a' : '#ffffff',
                        fontWeight: 900,
                        letterSpacing: '0.04em',
                      }}>
                        YOU
                      </div>
                    )}
                    <LeagueBadge tier={tier} size="md" glow={isSelected} animate={isSelected} />
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 900, color: isSelected ? meta.color : 'var(--t1)' }}>
                        {meta.title}
                      </div>
                      <div style={{ fontSize: 11.5, color: 'var(--t3)', marginTop: 4 }}>
                        {count} {count === 1 ? 'Student' : 'Students'}
                      </div>
                      <div style={{ fontSize: 11, color: isSelected ? meta.color : 'var(--t2)', marginTop: 8, fontWeight: 700 }}>
                        {isSelected ? '● Active View' : 'Inspect Division →'}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── Filter & Search Bar ────────────────────────────────────────── */}
      {activeTab !== 'guild_projects' && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, gap: 16, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: 8 }}>
            {(['all', 'tech', 'data', 'ai'] as const).map(d => (
              <button
                key={d}
                onClick={() => setDomainFilter(d)}
                style={{
                  padding: '7px 16px',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  background: domainFilter === d ? 'var(--brand)' : 'var(--card)',
                  border: domainFilter === d ? '1px solid var(--brand)' : '1px solid var(--border)',
                  color: domainFilter === d ? '#ffffff' : 'var(--t2)',
                  boxShadow: 'var(--shadow-sm)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {d === 'all' ? 'All Tracks' : `${d} Domain`}
              </button>
            ))}
          </div>

          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search student, role, or college..."
            style={{
              padding: '8px 16px',
              borderRadius: 10,
              background: 'var(--card)',
              border: '1px solid var(--border)',
              color: 'var(--t1)',
              boxShadow: 'var(--shadow-sm)',
              fontSize: 14.5,
              width: 300,
              outline: 'none',
            }}
          />
        </div>
      )}

      {/* ── TOP 3 CHAMPIONS PODIUM SHOWCASE (Temporarily disabled per Task 2) ── */}
      {false && activeTab !== 'guild_projects' && filteredEntries.length >= 3 && !loading && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 16,
          marginBottom: 24,
          alignItems: 'end',
        }}>
          {/* Rank 2: Silver Pedestal (Left) */}
          {filteredEntries[1] && (
            <div style={{
              background: 'linear-gradient(180deg, rgba(148, 163, 184, 0.12) 0%, var(--card) 100%)',
              border: '1.5px solid rgba(148, 163, 184, 0.4)',
              borderRadius: 20,
              padding: '24px 20px 20px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative',
              boxShadow: 'var(--shadow-md), 0 0 24px rgba(148, 163, 184, 0.15)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}>
              <div style={{
                position: 'absolute',
                top: -12,
                padding: '4px 14px',
                borderRadius: 20,
                background: 'linear-gradient(135deg, #94a3b8, #64748b)',
                color: '#ffffff',
                fontSize: 11.5,
                fontWeight: 900,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                boxShadow: '0 2px 10px rgba(148, 163, 184, 0.4)',
              }}>
                2nd Place Contender
              </div>
              <div style={{ position: 'relative', marginTop: 6, marginBottom: 12 }}>
                <Image
                  src={filteredEntries[1].avatarUrl}
                  alt={filteredEntries[1].name}
                  width={68}
                  height={68}
                  style={{
                    width: 68,
                    height: 68,
                    borderRadius: 34,
                    border: '3px solid #94a3b8',
                    boxShadow: '0 0 16px rgba(148, 163, 184, 0.5)',
                    objectFit: 'cover',
                  }}
                  unoptimized
                />
              </div>
              <div style={{ fontSize: 16.5, fontWeight: 900, color: filteredEntries[1].isCurrentUser ? '#4f46e5' : 'var(--t1)', display: 'flex', alignItems: 'center', gap: 6 }}>
                {filteredEntries[1].name}
                {filteredEntries[1].isCurrentUser && (
                  <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 4, background: '#4f46e5', color: '#fff', fontWeight: 900 }}>YOU</span>
                )}
              </div>
              <div style={{ fontSize: 12.5, color: 'var(--t3)', marginTop: 2, marginBottom: 12 }}>
                {filteredEntries[1].college}
              </div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', width: '100%' }}>
                <span style={{ padding: '4px 10px', borderRadius: 8, background: 'rgba(217, 119, 6, 0.12)', color: '#d97706', fontSize: 12.5, fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
                  +{activeTab === 'weekly_leagues' ? filteredEntries[1].weeklyXp.toLocaleString() : filteredEntries[1].totalXp.toLocaleString()} XP
                </span>
                {activeTab === 'weekly_leagues' && (
                  <span style={{ padding: '4px 10px', borderRadius: 8, background: 'rgba(239, 68, 68, 0.12)', color: '#dc2626', fontSize: 12.5, fontWeight: 800, border: '1px solid rgba(239, 68, 68, 0.25)' }}>
                    {filteredEntries[1].eloRating} ELO
                  </span>
                )}
                {activeTab === 'weekly_leagues' && (
                  <span style={{ padding: '4px 10px', borderRadius: 8, background: 'rgba(16, 185, 129, 0.15)', color: '#059669', fontSize: 12.5, fontWeight: 900, fontFamily: 'var(--font-mono)' }}>
                    {(filteredEntries[1].leagueScore ?? (filteredEntries[1].weeklyXp + Math.round(Math.max(0, filteredEntries[1].eloRating - 100) * 1.5))).toLocaleString()} pts
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Rank 1: Gold Pedestal (Center - Elevated!) */}
          {filteredEntries[0] && (
            <div style={{
              background: 'linear-gradient(180deg, rgba(245, 158, 11, 0.18) 0%, var(--card) 100%)',
              border: '2px solid rgba(245, 158, 11, 0.65)',
              borderRadius: 22,
              padding: '30px 22px 24px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative',
              boxShadow: 'var(--shadow-lg), 0 0 36px rgba(245, 158, 11, 0.25)',
              transform: 'scale(1.03)',
              zIndex: 2,
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}>
              <div style={{
                position: 'absolute',
                top: -14,
                padding: '5px 18px',
                borderRadius: 20,
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: '#ffffff',
                fontSize: 12,
                fontWeight: 900,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                boxShadow: '0 4px 16px rgba(245, 158, 11, 0.5)',
              }}>
                1st Place · Division Leader
              </div>
              <div style={{ position: 'relative', marginTop: 4, marginBottom: 12 }}>
                <Image
                  src={filteredEntries[0].avatarUrl}
                  alt={filteredEntries[0].name}
                  width={80}
                  height={80}
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 40,
                    border: '3.5px solid #f59e0b',
                    boxShadow: '0 0 24px rgba(245, 158, 11, 0.65)',
                    objectFit: 'cover',
                  }}
                  unoptimized
                />
              </div>
              <div style={{ fontSize: 18, fontWeight: 900, color: filteredEntries[0].isCurrentUser ? '#4f46e5' : 'var(--t1)', display: 'flex', alignItems: 'center', gap: 6 }}>
                {filteredEntries[0].name}
                {filteredEntries[0].isCurrentUser && (
                  <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 4, background: '#4f46e5', color: '#fff', fontWeight: 900 }}>YOU</span>
                )}
              </div>
              <div style={{ fontSize: 13, color: 'var(--t3)', marginTop: 2, marginBottom: 14 }}>
                {filteredEntries[0].college}
              </div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', width: '100%' }}>
                <span style={{ padding: '5px 12px', borderRadius: 8, background: 'rgba(217, 119, 6, 0.15)', color: '#d97706', fontSize: 13.5, fontWeight: 900, fontFamily: 'var(--font-mono)' }}>
                  +{activeTab === 'weekly_leagues' ? filteredEntries[0].weeklyXp.toLocaleString() : filteredEntries[0].totalXp.toLocaleString()} XP
                </span>
                {activeTab === 'weekly_leagues' && (
                  <span style={{ padding: '5px 12px', borderRadius: 8, background: 'rgba(239, 68, 68, 0.15)', color: '#dc2626', fontSize: 13.5, fontWeight: 900, border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                    {filteredEntries[0].eloRating} ELO
                  </span>
                )}
                {activeTab === 'weekly_leagues' && (
                  <span style={{ padding: '5px 14px', borderRadius: 8, background: 'rgba(16, 185, 129, 0.2)', color: '#059669', fontSize: 13.5, fontWeight: 900, fontFamily: 'var(--font-mono)', border: '1px solid rgba(16, 185, 129, 0.35)' }}>
                    {(filteredEntries[0].leagueScore ?? (filteredEntries[0].weeklyXp + Math.round(Math.max(0, filteredEntries[0].eloRating - 100) * 1.5))).toLocaleString()} pts
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Rank 3: Bronze Pedestal (Right) */}
          {filteredEntries[2] && (
            <div style={{
              background: 'linear-gradient(180deg, rgba(217, 119, 6, 0.12) 0%, var(--card) 100%)',
              border: '1.5px solid rgba(217, 119, 6, 0.4)',
              borderRadius: 20,
              padding: '24px 20px 20px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative',
              boxShadow: 'var(--shadow-md), 0 0 24px rgba(217, 119, 6, 0.15)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}>
              <div style={{
                position: 'absolute',
                top: -12,
                padding: '4px 14px',
                borderRadius: 20,
                background: 'linear-gradient(135deg, #d97706, #b45309)',
                color: '#ffffff',
                fontSize: 11.5,
                fontWeight: 900,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                boxShadow: '0 2px 10px rgba(217, 119, 6, 0.4)',
              }}>
                3rd Place Challenger
              </div>
              <div style={{ position: 'relative', marginTop: 6, marginBottom: 12 }}>
                <Image
                  src={filteredEntries[2].avatarUrl}
                  alt={filteredEntries[2].name}
                  width={68}
                  height={68}
                  style={{
                    width: 68,
                    height: 68,
                    borderRadius: 34,
                    border: '3px solid #d97706',
                    boxShadow: '0 0 16px rgba(217, 119, 6, 0.5)',
                    objectFit: 'cover',
                  }}
                  unoptimized
                />
              </div>
              <div style={{ fontSize: 16.5, fontWeight: 900, color: filteredEntries[2].isCurrentUser ? '#4f46e5' : 'var(--t1)', display: 'flex', alignItems: 'center', gap: 6 }}>
                {filteredEntries[2].name}
                {filteredEntries[2].isCurrentUser && (
                  <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 4, background: '#4f46e5', color: '#fff', fontWeight: 900 }}>YOU</span>
                )}
              </div>
              <div style={{ fontSize: 12.5, color: 'var(--t3)', marginTop: 2, marginBottom: 12 }}>
                {filteredEntries[2].college}
              </div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', width: '100%' }}>
                <span style={{ padding: '4px 10px', borderRadius: 8, background: 'rgba(217, 119, 6, 0.12)', color: '#d97706', fontSize: 12.5, fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
                  +{activeTab === 'weekly_leagues' ? filteredEntries[2].weeklyXp.toLocaleString() : filteredEntries[2].totalXp.toLocaleString()} XP
                </span>
                {activeTab === 'weekly_leagues' && (
                  <span style={{ padding: '4px 10px', borderRadius: 8, background: 'rgba(239, 68, 68, 0.12)', color: '#dc2626', fontSize: 12.5, fontWeight: 800, border: '1px solid rgba(239, 68, 68, 0.25)' }}>
                    {filteredEntries[2].eloRating} ELO
                  </span>
                )}
                {activeTab === 'weekly_leagues' && (
                  <span style={{ padding: '4px 10px', borderRadius: 8, background: 'rgba(16, 185, 129, 0.15)', color: '#059669', fontSize: 12.5, fontWeight: 900, fontFamily: 'var(--font-mono)' }}>
                    {(filteredEntries[2].leagueScore ?? (filteredEntries[2].weeklyXp + Math.round(Math.max(0, filteredEntries[2].eloRating - 100) * 1.5))).toLocaleString()} pts
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── TAB CONTENT: GUILD PROJECTS TABLE ──────────────────────────── */}
      {activeTab === 'guild_projects' ? (
        <div data-testid="guild-projects-table-container" style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 18, overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', minWidth: 840, borderCollapse: 'collapse', textAlign: 'left', fontSize: 14.5 }}>
              <thead>
                <tr style={{ background: 'var(--bg3)', borderBottom: '1px solid var(--border)', color: 'var(--t2)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  <th style={{ padding: '14px 20px', width: 70 }}>Rank</th>
                  <th style={{ padding: '14px 20px' }}>Guild / Engineering Squad</th>
                  <th style={{ padding: '14px 20px' }}>Hackathon Theme</th>
                  <th style={{ padding: '14px 20px' }}>Team Lead</th>
                  <th style={{ padding: '14px 20px' }}>Members</th>
                  <th style={{ padding: '14px 20px' }}>Projects Completed</th>
                  <th style={{ padding: '14px 20px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {guilds.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: '56px 20px', textAlign: 'center' }}>
                      <div style={{ maxWidth: 460, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                        <div style={{
                          width: 52,
                          height: 52,
                          borderRadius: 26,
                          background: 'rgba(56, 189, 248, 0.12)',
                          border: '1.5px solid rgba(56, 189, 248, 0.3)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                          </svg>
                        </div>
                        <div style={{ fontSize: 16.5, fontWeight: 800, color: 'var(--t1)' }}>
                          No Active Student Guild Squads This Sprint
                        </div>
                        <p style={{ fontSize: 13, color: 'var(--t3)', lineHeight: 1.6, margin: 0 }}>
                          Form an engineering squad in the Projects & Hackathon Hub, collaborate on distributed systems, and ship verified milestones to claim the top rank on the Guild Leaderboard.
                        </p>
                        <Link
                          href="/projects"
                          style={{
                            marginTop: 8,
                            padding: '9px 20px',
                            borderRadius: 10,
                            background: 'linear-gradient(135deg, #0284c7, #2563eb)',
                            color: '#ffffff',
                            fontSize: 13,
                            fontWeight: 700,
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 8,
                            boxShadow: '0 2px 10px rgba(37, 99, 235, 0.25)',
                          }}
                        >
                          Launch Squad in Projects Hub →
                        </Link>
                      </div>
                    </td>
                  </tr>
                ) : (
                  guilds.map((guild) => (
                    <tr key={guild.guildId} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '16px 20px', fontWeight: 900, color: guild.rank === 1 ? '#d97706' : guild.rank === 2 ? '#64748b' : guild.rank === 3 ? '#b45309' : 'var(--t3)' }}>
                        #{guild.rank}
                      </td>
                      <td style={{ padding: '16px 20px', fontWeight: 800, color: 'var(--t1)' }}>
                        {guild.guildName}
                      </td>
                      <td style={{ padding: '16px 20px', color: 'var(--t2)', fontSize: 13.5 }}>
                        {guild.hackathonTitle}
                      </td>
                      <td style={{ padding: '16px 20px', color: '#38bdf8', fontWeight: 700 }}>
                        {guild.teamLeadName}
                      </td>
                      <td style={{ padding: '16px 20px', color: 'var(--t2)' }}>
                        {guild.membersCount} Contributors
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{ padding: '4px 10px', borderRadius: 8, background: 'rgba(56, 189, 248, 0.12)', color: '#38bdf8', fontWeight: 900, fontSize: 14 }}>
                          {guild.completedProjectsCount} Projects
                        </span>
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{ fontSize: 11, fontWeight: 800, padding: '3px 8px', borderRadius: 6, background: guild.status === 'verified' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(234, 179, 8, 0.15)', color: guild.status === 'verified' ? '#22c55e' : '#eab308', textTransform: 'uppercase' }}>
                          {guild.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* ── STUDENT CANDIDATES LEADERBOARD TABLE (Region / Global / Weekly) ── */
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 18, overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', minWidth: 840, borderCollapse: 'collapse', textAlign: 'left', fontSize: 14.5 }}>
              <thead>
                <tr style={{ background: 'var(--bg3)', borderBottom: '1px solid var(--border)', color: 'var(--t2)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  <th style={{ padding: '14px 20px', width: 70 }}>Rank</th>
                  <th style={{ padding: '14px 20px' }}>Student Candidate</th>
                  <th style={{ padding: '14px 20px' }}>
                    {activeTab === 'region_college' ? 'Collegiate Affiliation' : 'Program Track'}
                  </th>
                  <th style={{ padding: '14px 20px' }}>
                    {activeTab === 'weekly_leagues' ? 'Weekly XP' : 'Total XP'}
                  </th>
                  {activeTab === 'weekly_leagues' && (
                    <th style={{ padding: '14px 20px' }}>Arena ELO</th>
                  )}
                  <th style={{ padding: '14px 20px' }}>
                    {activeTab === 'weekly_leagues' ? 'League Score (XP + ELO)' : 'Defense Score'}
                  </th>
                  <th style={{ padding: '14px 20px' }}>
                    {activeTab === 'weekly_leagues' ? 'Sprint Zone' : 'Placement Status'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} style={{ padding: 48, textAlign: 'center', color: 'var(--t3)' }}>
                      Loading real-time student leaderboard & leagues...
                    </td>
                  </tr>
                ) : filteredEntries.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: 48, textAlign: 'center', color: 'var(--t3)' }}>
                      No students found matching this criteria. Earn XP to lead this division!
                    </td>
                  </tr>
                ) : (
                  filteredEntries.map((entry, idx) => {
                    const isTop3 = entry.rank <= 3;
                    const rankLabel = `#${entry.rank}`;
                    const isPromoting = entry.zone === 'promotion';
                    const isDemoting = entry.zone === 'demotion';

                    // Cutoff lines for weekly leagues
                    const renderPromotionDivider = activeTab === 'weekly_leagues' &&
                      selectedLeague !== 'ruby' &&
                      idx + 1 === promotionCutoff &&
                      filteredEntries.length >= 2;

                    const renderDemotionDivider = activeTab === 'weekly_leagues' &&
                      selectedLeague !== 'browns' &&
                      idx + 1 === demotionCutoff - 1 &&
                      filteredEntries.length >= 2 &&
                      demotionCutoff > promotionCutoff;

                    const calculatedLeagueScore = entry.leagueScore ?? (entry.weeklyXp + Math.round(Math.max(0, entry.eloRating - 100) * 1.5));

                    return (
                      <React.Fragment key={entry.studentId}>
                        <tr
                          style={{
                            borderBottom: '1px solid var(--border)',
                            borderLeft: entry.isCurrentUser ? '4px solid #4f46e5' : '4px solid transparent',
                            background: entry.isCurrentUser
                              ? 'rgba(99, 102, 241, 0.12)'
                              : isPromoting
                              ? 'rgba(16, 185, 129, 0.05)'
                              : isDemoting
                              ? 'rgba(239, 68, 68, 0.05)'
                              : 'transparent',
                            transition: 'background 0.15s ease, transform 0.15s ease',
                          }}
                        >
                          {/* Rank */}
                          <td style={{ padding: '16px 20px', fontWeight: 900, fontSize: isTop3 ? 16 : 14, color: entry.rank === 1 ? '#d97706' : entry.rank === 2 ? '#64748b' : entry.rank === 3 ? '#b45309' : 'var(--t3)' }}>
                            {rankLabel}
                          </td>

                          {/* Student Candidate & Avatar */}
                          <td style={{ padding: '16px 20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                              <Image
                                src={entry.avatarUrl}
                                alt={entry.name}
                                width={38}
                                height={38}
                                style={{
                                  width: 38,
                                  height: 38,
                                  borderRadius: 19,
                                  border: entry.isCurrentUser ? '2.5px solid #4f46e5' : isPromoting ? '2px solid #10b981' : '1px solid var(--border)',
                                  objectFit: 'cover'
                                }}
                                unoptimized
                              />
                              <div>
                                <div style={{ fontWeight: 800, color: entry.isCurrentUser ? '#4f46e5' : 'var(--t1)', display: 'flex', alignItems: 'center', gap: 6 }}>
                                  {entry.name}
                                  {entry.isCurrentUser && (
                                    <span style={{ fontSize: 10.5, padding: '2px 7px', borderRadius: 5, background: '#4f46e5', color: '#fff', fontWeight: 900 }}>
                                      YOU
                                    </span>
                                  )}
                                </div>
                                <div style={{ fontSize: 12, color: 'var(--t3)' }}>{entry.college}</div>
                              </div>
                            </div>
                          </td>

                          {/* Program / College Track */}
                          <td style={{ padding: '16px 20px', color: 'var(--t2)' }}>
                            {activeTab === 'region_college' ? entry.college : entry.programTitle}
                          </td>

                          {/* XP Column */}
                          <td style={{ padding: '16px 20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 15.5, fontWeight: 900, color: '#d97706' }}>
                                +{activeTab === 'weekly_leagues' ? entry.weeklyXp.toLocaleString() : entry.totalXp.toLocaleString()}
                              </span>
                              <span style={{ fontSize: 12, color: 'var(--t3)', fontWeight: 700 }}>XP</span>
                            </div>
                          </td>

                          {/* Arena ELO (Weekly leagues) */}
                          {activeTab === 'weekly_leagues' && (
                            <td style={{ padding: '16px 20px' }}>
                              <span style={{ padding: '4px 8px', borderRadius: 6, background: 'rgba(239,68,68,0.12)', color: '#dc2626', fontWeight: 800, fontSize: 13, border: '1px solid rgba(239,68,68,0.25)' }}>
                                {entry.eloRating} ELO
                              </span>
                            </td>
                          )}

                          {/* League Score (XP + ELO) or Defense Score */}
                          <td style={{ padding: '16px 20px' }}>
                            {activeTab === 'weekly_leagues' ? (
                              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 15, fontWeight: 900, color: '#10b981' }}>
                                {calculatedLeagueScore.toLocaleString()} pts
                              </span>
                            ) : (
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <span style={{ padding: '4px 8px', borderRadius: 6, background: 'rgba(16,185,129,0.12)', color: '#059669', fontWeight: 800, fontSize: 13, border: '1px solid rgba(16,185,129,0.25)' }}>
                                  {entry.defenseScore}% Defense
                                </span>
                              </div>
                            )}
                          </td>

                          {/* Zone / Placement */}
                          <td style={{ padding: '16px 20px' }}>
                            {activeTab === 'weekly_leagues' ? (
                              isPromoting ? (
                                <span style={{ padding: '4px 10px', borderRadius: 6, background: 'rgba(16,185,129,0.15)', color: '#059669', fontWeight: 800, fontSize: 12.5, display: 'inline-flex', alignItems: 'center', gap: 4, border: '1px solid rgba(16,185,129,0.3)' }}>
                                  Promoting
                                </span>
                              ) : isDemoting ? (
                                <span style={{ padding: '4px 10px', borderRadius: 6, background: 'rgba(239,68,68,0.15)', color: '#dc2626', fontWeight: 800, fontSize: 12.5, display: 'inline-flex', alignItems: 'center', gap: 4, border: '1px solid rgba(239,68,68,0.3)' }}>
                                  Demoting
                                </span>
                              ) : (
                                <span style={{ padding: '4px 10px', borderRadius: 6, background: 'rgba(99,102,241,0.12)', color: '#4f46e5', fontWeight: 700, fontSize: 12.5, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                  Safe Zone
                                </span>
                              )
                            ) : (
                              <span style={{ fontSize: 12.5, fontWeight: 700, color: entry.readinessStatus === 'ready_for_interview' ? '#059669' : '#38bdf8' }}>
                                {entry.readinessStatus === 'ready_for_interview' ? 'Interview Ready' : 'In Progress'}
                              </span>
                            )}
                          </td>
                        </tr>

                        {/* Promotion Divider */}
                        {renderPromotionDivider && (
                          <tr>
                            <td colSpan={7} style={{ padding: 0 }}>
                              <div style={{ height: 2, background: 'repeating-linear-gradient(90deg, #10b981, #10b981 8px, transparent 8px, transparent 16px)' }} />
                              <div style={{ padding: '4px 20px', background: 'rgba(16,185,129,0.1)', color: '#059669', fontSize: 11.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                Promotion Cutoff Line — Top 10% advance to higher league
                              </div>
                            </td>
                          </tr>
                        )}

                        {/* Demotion Divider */}
                        {renderDemotionDivider && (
                          <tr>
                            <td colSpan={7} style={{ padding: 0 }}>
                              <div style={{ height: 2, background: 'repeating-linear-gradient(90deg, #ef4444, #ef4444 8px, transparent 8px, transparent 16px)' }} />
                              <div style={{ padding: '4px 20px', background: 'rgba(239,68,68,0.1)', color: '#dc2626', fontSize: 11.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                Demotion Cutoff Line — Bottom 10% demote to lower league
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}

export default function LeaderboardPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40, textAlign: 'center', color: 'var(--t3)' }}>Loading Leaderboard & Leagues...</div>}>
      <LeaderboardContent />
    </Suspense>
  );
}
