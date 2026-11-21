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
import CompetitionNavigation from '@/components/competition/CompetitionNavigation';
import {
  encodeConfirmedLeagueMembership,
  isConfirmedLeagueMembershipCacheValue,
  shouldApplyLeagueMembershipSnapshot,
} from '@/lib/competition/leagueMembershipSnapshot';
import { rankLeagueEntries } from '@/lib/leagues/leaguePoints';
import styles from '../competition-experience.module.css';

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
  arenaPoints?: number;
  leaguePoints?: number;
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
  finalScore: number | null;
  teamLeadName: string;
  membersCount: number;
  completedProjectsCount: number;
  status: string;
}

export type TabMode = 'campus' | 'global' | 'guild';

const ALL_LEAGUES: LeagueTier[] = ['browns', 'silver', 'gold', 'platinum', 'ruby'];

function hasStoredLeagueMembership(userId?: string | null): boolean {
  if (!userId || typeof window === 'undefined') return false;
  try {
    const value = localStorage.getItem(`pinit_joined_league_${userId}`);
    return isConfirmedLeagueMembershipCacheValue(value);
  } catch {
    return false;
  }
}

function storeLeagueMembership(userId: string | null | undefined, joined: boolean, joinedAt?: string | null): void {
  if (!userId || typeof window === 'undefined') return;
  try {
    const key = `pinit_joined_league_${userId}`;
    if (joined) localStorage.setItem(key, encodeConfirmedLeagueMembership(joinedAt));
    else localStorage.removeItem(key);
  } catch {
    // Server state remains authoritative when browser storage is unavailable.
  }
}

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
  const membershipUserId = user?.id || null;
  const profileLeagueJoinedAt = (user as any)?.league_joined_at;
  const latestMembershipUserIdRef = useRef<string | null>(membershipUserId);
  latestMembershipUserIdRef.current = membershipUserId;
  const cOS = useCareerOS();
  const searchParams = useSearchParams();

  // Mode initial state (supports both ?mode= and ?tab= cross-links from Arena)
  const rawMode = searchParams?.get('mode') || searchParams?.get('tab');
  const initialMode: TabMode =
    rawMode === 'guild' || rawMode === 'guild_projects' ? 'guild' :
    rawMode === 'campus' || rawMode === 'region_college' ? 'campus' :
    'global';

  const [activeTab, setActiveTab] = useState<TabMode>(initialMode);
  const [selectedLeague, setSelectedLeague] = useState<LeagueTier>('browns');
  const [currentUserLeague, setCurrentUserLeague] = useState<LeagueTier>('browns');
  const [isLeagueModalOpen, setIsLeagueModalOpen] = useState(false);
  const hasManuallySelectedRef = useRef(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [serverCurrentUser, setServerCurrentUser] = useState<LeaderboardEntry | null>(null);
  const [guilds, setGuilds] = useState<GuildLeaderboardEntry[]>([]);
  const [guildsLoadError, setGuildsLoadError] = useState<string | null>(null);
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
  const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(null);
  const loadedQueryKeyRef = useRef<string | null>(null);
  const [joiningLeague, setJoiningLeague] = useState(false);
  const [currentUserHasJoined, setCurrentUserHasJoined] = useState(false);
  const [serverCareerXp, setServerCareerXp] = useState<number | null>(null);
  const joinAttemptUserIdRef = useRef<string | null>(null);
  const membershipRevisionRef = useRef(0);
  const membershipStatusRef = useRef<{ userId: string; joined: boolean } | null>(null);

  const [showXpReqTooltip, setShowXpReqTooltip] = useState(false);
  const [showResetTooltip, setShowResetTooltip] = useState(false);
  const xpReqRef = useRef<HTMLDivElement>(null);
  const resetClockRef = useRef<HTMLDivElement>(null);

  // Auto-dismiss popovers when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (xpReqRef.current && !xpReqRef.current.contains(e.target as Node)) {
        setShowXpReqTooltip(false);
      }
      if (resetClockRef.current && !resetClockRef.current.contains(e.target as Node)) {
        setShowResetTooltip(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-heal legacy 1200 database rows in Supabase
  useEffect(() => {
    if (user?.id && (user as any)?.arena_elo === 1200 && !(user as any)?.arena_wins) {
      Promise.resolve(supabase.from('users').update({ arena_elo: 100 }).eq('id', user.id)).catch(() => {});
    }
  }, [user]);

  // Entry uses lifetime Career XP. Take the freshest available source so a
  // temporarily stale client context cannot keep a qualified learner locked out.
  const userTotalXp = Math.max(
    Number.isFinite(Number(cOS?.xp)) ? Number(cOS.xp) : 0,
    Number((user as any)?.xp_total || (user as any)?.xp || 0),
    serverCareerXp ?? 0,
  );

  const [joinedLeague, setJoinedLeague] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return hasStoredLeagueMembership(user?.id) || Boolean((user as any)?.league_joined_at);
  });
  const membershipUserIdRef = useRef<string | null>(membershipUserId);
  const joinedForCurrentAccount = membershipStatusRef.current?.userId === membershipUserId
    ? membershipStatusRef.current.joined
    : membershipUserIdRef.current === membershipUserId
      ? joinedLeague || currentUserHasJoined
      : Boolean(profileLeagueJoinedAt) || hasStoredLeagueMembership(membershipUserId);

  const handleJoinLeague = async () => {
    const joiningUserId = user?.id;
    if (!joiningUserId || joinAttemptUserIdRef.current === joiningUserId) return;
    if (userTotalXp < 100) {
      toast.error('League Locked', `You need 100 lifetime Career XP to join Browns. You currently have ${userTotalXp} XP.`);
      return;
    }
    joinAttemptUserIdRef.current = joiningUserId;
    membershipRevisionRef.current += 1;
    setJoiningLeague(true);
    let joinConfirmed = false;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        toast.error('Session expired', 'Sign in again, then retry joining Browns League.');
        return;
      }
      if (latestMembershipUserIdRef.current !== joiningUserId || session.user?.id !== joiningUserId) return;
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
      };
      const controller = new AbortController();
      const requestTimeout = window.setTimeout(() => controller.abort(), 15_000);
      let response: Response;
      try {
        response = await fetch('/api/leaderboard/join', {
          method: 'POST',
          headers,
          body: '{}',
          signal: controller.signal,
        });
      } finally {
        window.clearTimeout(requestTimeout);
      }
      const result = await response.json().catch(() => null);
      if (latestMembershipUserIdRef.current !== joiningUserId) return;
      if (!response.ok || !result?.ok) {
        const message = result?.error === 'LEAGUE_ENTRY_LOCKED'
          ? 'Reach 100 Career XP to unlock Browns League.'
          : result?.error === 'STUDENTS_ONLY'
            ? 'Only student accounts can join a ranked league.'
            : result?.error === 'LEAGUE_JOIN_NOT_PERSISTED' || result?.error === 'LEAGUE_JOIN_STATUS_UNAVAILABLE'
              ? 'We could not confirm your membership was saved. Refresh the page and check before retrying.'
              : response.status === 401
                ? 'Your sign-in expired. Sign in again, then retry.'
                : 'Please try again in a moment.';
        toast.error('Could not join league', message);
        return;
      }
      if (result.currentUserHasJoined !== true || typeof result.joinedAt !== 'string') {
        toast.error('Could not confirm your join', 'Refresh the page to check your league status before retrying.');
        return;
      }
      membershipRevisionRef.current += 1;
      membershipStatusRef.current = { userId: joiningUserId, joined: true };
      joinConfirmed = true;
      const joinedTier = normalizeLeagueTier(result.leagueTier);
      const joinedTierTitle = `${joinedTier.charAt(0).toUpperCase()}${joinedTier.slice(1)}`;
      setJoinedLeague(true);
      setCurrentUserHasJoined(true);
      setCurrentUserLeague(joinedTier);
      setSelectedLeague(joinedTier);
      setServerCareerXp(Number(result.careerXp) || userTotalXp);
      storeLeagueMembership(joiningUserId, true, result.joinedAt);
      window.dispatchEvent(new CustomEvent('pinit:user_profile_updated', {
        detail: { user_id: joiningUserId, league_tier: result.leagueTier, league_joined_at: result.joinedAt },
      }));
      setRefreshTrigger(prev => prev + 1);
      toast.success(
        result.alreadyJoined ? `You’re already in ${joinedTierTitle} League` : 'You joined Browns League',
        result.alreadyJoined ? 'Your membership is active.' : 'Your first sprint starts now. Climb by earning League Points.',
      );
    } catch {
      if (latestMembershipUserIdRef.current === joiningUserId) {
        toast.error('Could not join league', 'Please check your league status, then retry if needed.');
      }
    } finally {
      if (joinAttemptUserIdRef.current === joiningUserId) {
        joinAttemptUserIdRef.current = null;
        if (latestMembershipUserIdRef.current === joiningUserId) {
          setJoiningLeague(false);
          if (!joinConfirmed) setRefreshTrigger(prev => prev + 1);
        }
      }
    }
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

  // Refresh live standings on focus, return-to-tab, and a light 30-second cadence.
  // Hidden tabs pause polling; the currently displayed table stays in place while data refreshes.
  useEffect(() => {
    const requestRefresh = () => {
      if (document.visibilityState === 'visible') setRefreshTrigger(previous => previous + 1);
    };
    const timer = window.setInterval(requestRefresh, 30_000);
    window.addEventListener('focus', requestRefresh);
    document.addEventListener('visibilitychange', requestRefresh);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener('focus', requestRefresh);
      document.removeEventListener('visibilitychange', requestRefresh);
    };
  }, []);

  // Synchronize joinedLeague reactively when user hydrates or server profile arrives
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const userId = membershipUserId;
    const accountChanged = membershipUserIdRef.current !== userId;
    membershipUserIdRef.current = userId;

    if (accountChanged) {
      membershipRevisionRef.current += 1;
      membershipStatusRef.current = null;
      joinAttemptUserIdRef.current = null;
      setJoiningLeague(false);
      setServerCareerXp(null);
      setServerCurrentUser(null);
      setCurrentUserLeague('browns');
    }

    // currentUserHasJoined belongs to the account used by the previous fetch.
    // Don't carry it across sign-in changes; rehydrate from this account's own
    // profile or account-scoped confirmation instead.
    const savedServerStatus = membershipStatusRef.current;
    const hasJoined = savedServerStatus?.userId === userId
      ? savedServerStatus.joined
      : Boolean(profileLeagueJoinedAt) ||
        hasStoredLeagueMembership(userId) ||
        (!accountChanged && currentUserHasJoined);
    setJoinedLeague(hasJoined);
    if (accountChanged || hasJoined !== currentUserHasJoined) {
      setCurrentUserHasJoined(hasJoined);
    }
  }, [membershipUserId, profileLeagueJoinedAt, currentUserHasJoined]);

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
        const eventUserId = typeof e.detail.user_id === 'string' ? e.detail.user_id : null;
        if (eventUserId && eventUserId !== latestMembershipUserIdRef.current) return;
        if (e.detail.league_joined_at && membershipUserId && eventUserId === membershipUserId) {
          if (membershipStatusRef.current?.userId !== membershipUserId || !membershipStatusRef.current.joined) {
            membershipRevisionRef.current += 1;
          }
          membershipStatusRef.current = { userId: membershipUserId, joined: true };
          storeLeagueMembership(membershipUserId, true, e.detail.league_joined_at);
          setJoinedLeague(true);
          setCurrentUserHasJoined(true);
        }
        const updatedElo = typeof e.detail.arena_elo === 'number' 
          ? e.detail.arena_elo 
          : (typeof e.detail.elo === 'number' ? e.detail.elo : undefined);
        const updatedWeeklyXp = typeof e.detail.weekly_xp === 'number' 
          ? e.detail.weekly_xp 
          : (typeof e.detail.weeklyXp === 'number' ? e.detail.weeklyXp : undefined);
        const updatedArenaPoints = typeof e.detail.weekly_arena_points === 'number'
          ? e.detail.weekly_arena_points
          : (typeof e.detail.arenaPoints === 'number' ? e.detail.arenaPoints : undefined);
        const updatedTotalXp = typeof e.detail.xp_total === 'number' 
          ? e.detail.xp_total 
          : (typeof e.detail.totalXp === 'number' ? e.detail.totalXp : (typeof e.detail.xp === 'number' ? e.detail.xp : undefined));

        if (typeof updatedTotalXp === 'number') setServerCareerXp(updatedTotalXp);

        if (user) {
          if (typeof updatedElo === 'number') (user as any).arena_elo = updatedElo;
          if (typeof updatedWeeklyXp === 'number') (user as any).weekly_xp = updatedWeeklyXp;
          if (typeof updatedArenaPoints === 'number') (user as any).weekly_arena_points = updatedArenaPoints;
          if (typeof updatedTotalXp === 'number') (user as any).xp_total = updatedTotalXp;
        }

        // Keep the visible score, row order, and rank in one optimistic update.
        // Updating only the HUD score used to leave the table's old rank in place.
        const currentUserRow = leaderboard.find(entry => entry.studentId === membershipUserId);
        if (currentUserRow) {
          const nextEntries = rankLeagueEntries(
            leaderboard.map(entry => entry.studentId === membershipUserId
              ? {
                  ...entry,
                  weeklyXp: typeof updatedWeeklyXp === 'number' ? updatedWeeklyXp : entry.weeklyXp,
                  arenaPoints: typeof updatedArenaPoints === 'number' ? updatedArenaPoints : (entry.arenaPoints || 0),
                  eloRating: typeof updatedElo === 'number' ? updatedElo : entry.eloRating,
                  totalXp: typeof updatedTotalXp === 'number' ? updatedTotalXp : entry.totalXp,
                }
              : entry),
            normalizeLeagueTier(selectedLeague),
            promotionCutoff,
            demotionCutoff,
          );
          const nextCurrentUser = nextEntries.find(entry => entry.studentId === membershipUserId) || null;
          setLeaderboard(nextEntries);
          if (nextCurrentUser) setServerCurrentUser(nextCurrentUser);
        } else {
          setServerCurrentUser(prev => {
            if (!prev) return null;
            const weeklyXp = typeof updatedWeeklyXp === 'number' ? updatedWeeklyXp : prev.weeklyXp;
            const arenaPoints = typeof updatedArenaPoints === 'number' ? updatedArenaPoints : (prev.arenaPoints || 0);
            const totalXp = typeof updatedTotalXp === 'number' ? updatedTotalXp : prev.totalXp;
            return {
              ...prev,
              weeklyXp,
              arenaPoints,
              leaguePoints: weeklyXp + arenaPoints,
              totalXp,
            };
          });
        }
      }
      setRefreshTrigger(prev => prev + 1);
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('pinit:user_profile_updated', handleProfileUpdate as EventListener);
      return () => window.removeEventListener('pinit:user_profile_updated', handleProfileUpdate as EventListener);
    }
  }, [user, membershipUserId, leaderboard, selectedLeague, promotionCutoff, demotionCutoff]);

  // Fetch real leaderboard telemetry from server
  useEffect(() => {
    let isMounted = true;
    const queryKey = `${membershipUserId || 'guest'}:${activeTab}:${selectedLeague}`;
    async function fetchLeaderboard() {
      const requestUserId = membershipUserId;
      const membershipRevisionAtStart = membershipRevisionRef.current;
      if (loadedQueryKeyRef.current !== queryKey) setLoading(true);
      try {
        const params = new URLSearchParams({
          mode: activeTab === 'guild' ? 'guild_projects' : 'weekly_leagues',
          league: selectedLeague,
        });
        if (membershipUserId) {
          params.set('userId', membershipUserId);
        }

        let authHeader: Record<string, string> = {};
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.access_token) {
            authHeader = { Authorization: `Bearer ${session.access_token}` };
          }
        } catch {}

        console.log('[LEADERBOARD_CLIENT][Fetch Inflight]', {
          mode: activeTab === 'guild' ? 'guild_projects' : 'weekly_leagues',
          league: selectedLeague,
          userId: membershipUserId || 'guest',
        });
        const clientStartTime = performance.now();

        const res = await fetch(`/api/leaderboard?${params.toString()}`, {
          headers: {
            ...authHeader,
            ...(membershipUserId ? { 'x-user-id': membershipUserId } : {}),
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
          loadedQueryKeyRef.current = queryKey;
          setLastUpdatedAt(new Date());
          const responseEntries: LeaderboardEntry[] = Array.isArray(data.leaderboard) ? data.leaderboard : [];
          const apiResolvedUserMatches = requestUserId
            ? data.currentUserId === requestUserId
            : !data.currentUserId;
          const hasConfirmedJoin = Boolean(requestUserId && (
            hasStoredLeagueMembership(requestUserId) ||
            (membershipStatusRef.current?.userId === requestUserId && membershipStatusRef.current.joined) ||
            (membershipUserId === requestUserId && Boolean(profileLeagueJoinedAt))
          ) && apiResolvedUserMatches);
          let responseCurrentUser: LeaderboardEntry | null = apiResolvedUserMatches ? (data.currentUser || null) : null;
          const viewingTier = normalizeLeagueTier(data.activeLeague || selectedLeague);

          // The current-user snapshot is fetched separately from the cohort.
          // Reconcile it into the row before ranking so a newer score cannot be
          // rendered beside an older rank from the cohort query.
          if (apiResolvedUserMatches && requestUserId && data.currentUserStats) {
            const currentUserIndex = responseEntries.findIndex(entry => entry.studentId === requestUserId);
            if (currentUserIndex >= 0) {
              const existing = responseEntries[currentUserIndex];
              const weeklyXp = Math.max(0, Number(data.currentUserStats.weeklyXp ?? existing.weeklyXp) || 0);
              const arenaPoints = Math.max(0, Number(data.currentUserStats.arenaPoints ?? existing.arenaPoints) || 0);
              responseEntries[currentUserIndex] = {
                ...existing,
                weeklyXp,
                arenaPoints,
                leaguePoints: weeklyXp + arenaPoints,
                eloRating: Math.max(0, Number(data.currentUserStats.arenaElo ?? existing.eloRating) || 100),
                totalXp: Math.max(0, Number(data.currentUserTotalXp) || existing.totalXp || 0),
                isCurrentUser: true,
              };
            }
          }

          // A join POST is verified against the saved profile before it succeeds.
          // If a following leaderboard read is briefly stale, keep the confirmed
          // member visible and calculate their position from the same League Points
          // ordering while the server catches up.
          const currentTier = normalizeLeagueTier(data.currentUserLeague);
          const viewingCurrentTier = normalizeLeagueTier(data.activeLeague || selectedLeague) === currentTier;
          if (
            activeTab !== 'guild' && requestUserId && hasConfirmedJoin && viewingCurrentTier &&
            !responseEntries.some(entry => entry.studentId === requestUserId)
          ) {
            const stats = data.currentUserStats || {};
            const weeklyXp = Math.max(0, Number(stats.weeklyXp ?? (user as any)?.weekly_xp ?? (user as any)?.weeklyXp) || 0);
            const arenaPoints = Math.max(0, Number(stats.arenaPoints ?? (user as any)?.weekly_arena_points ?? (user as any)?.arenaPoints) || 0);
            const totalXp = Math.max(0, Number(data.currentUserTotalXp) || Number((user as any)?.xp_total) || Number(cOS?.xp) || 0);
            const leaguePoints = weeklyXp + arenaPoints;
            const name = (user as any)?.display_name || (user as any)?.full_name || (user as any)?.name || 'Student Candidate';
            const ownEntry: LeaderboardEntry = {
              rank: 0,
              studentId: requestUserId,
              name,
              avatarUrl: (user as any)?.avatar_url || '',
              college: (user as any)?.college || (cOS as any)?.onboardingAnswers?.college || 'PinIT Career OS Academy',
              programTitle: (user as any)?.target_role ? `${(user as any).target_role} Track` : 'Software Engineering Track',
              verifiedSkillsCount: 0,
              demonstratedSkillsCount: Array.isArray((user as any)?.completed_quests) ? (user as any).completed_quests.length : 0,
              defenseScore: 0,
              readinessStatus: 'exploring',
              learningGainPoints: Math.max(0, Math.round(totalXp / 50)),
              eloRating: Math.max(0, Number(stats.arenaElo ?? (user as any)?.arena_elo) || 100),
              arenaPoints,
              leaguePoints,
              leagueTier: currentTier,
              weeklyXp,
              totalXp,
              zone: 'safe',
              isCurrentUser: true,
            };
            responseEntries.push(ownEntry);
            responseCurrentUser = ownEntry;
          }

          const rankedEntries = activeTab === 'guild'
            ? responseEntries
            : rankLeagueEntries(
                responseEntries,
                viewingTier,
                Number(data.promotionCutoffRank) || 0,
                Number(data.demotionCutoffRank) || 0,
              );
          const rankedCurrentUser = requestUserId
            ? rankedEntries.find(entry => entry.studentId === requestUserId)
            : null;
          if (rankedCurrentUser) responseCurrentUser = rankedCurrentUser;
          setLeaderboard(rankedEntries);
          setServerCurrentUser(responseCurrentUser);
          if (typeof data.currentUserHasJoined === 'boolean') {
            // Ignore responses from another account and don't let a negative,
            // possibly lagging read undo a join already confirmed by the server.
            const responseStillMatchesAccount = requestUserId && requestUserId === latestMembershipUserIdRef.current && apiResolvedUserMatches;
            const responseIsCurrent = membershipRevisionAtStart === membershipRevisionRef.current;
            const snapshotIsSafeToApply = requestUserId && shouldApplyLeagueMembershipSnapshot(
              requestUserId,
              data.currentUserHasJoined,
              hasStoredLeagueMembership(requestUserId) ||
                (membershipStatusRef.current?.userId === requestUserId && membershipStatusRef.current.joined) ||
                (membershipUserId === requestUserId && Boolean(profileLeagueJoinedAt)),
            );
            if (responseStillMatchesAccount && responseIsCurrent && snapshotIsSafeToApply) {
              membershipStatusRef.current = { userId: requestUserId, joined: data.currentUserHasJoined };
              storeLeagueMembership(requestUserId, data.currentUserHasJoined);
              setCurrentUserHasJoined(data.currentUserHasJoined);
              setJoinedLeague(data.currentUserHasJoined);
            }
          }
          if (apiResolvedUserMatches && Number.isFinite(data.currentUserTotalXp)) {
            setServerCareerXp(Number(data.currentUserTotalXp));
          }
          if (Array.isArray(data.guilds)) {
            setGuilds(data.guilds);
            setGuildsLoadError(typeof data.guildsLoadError === 'string' ? data.guildsLoadError : null);
          }
          setPromotionCutoff(Number.isFinite(data.promotionCutoffRank) ? data.promotionCutoffRank : 0);
          setDemotionCutoff(Number.isFinite(data.demotionCutoffRank) ? data.demotionCutoffRank : 0);
          if (typeof data.remainingMs === 'number') {
            setRemainingMs(data.remainingMs);
          }
          if (apiResolvedUserMatches && data.currentUserLeague) {
            const userTier = normalizeLeagueTier(data.currentUserLeague);
            setCurrentUserLeague(userTier);
            if (data.currentUserHasJoined && !hasManuallySelectedRef.current && userTier !== 'browns') {
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
  }, [activeTab, selectedLeague, membershipUserId, refreshTrigger]);

  // User's college for Regional filter
  const userCollege = (user as any)?.college || (cOS as any)?.onboardingAnswers?.college || 'RV College of Engineering';

  // Current user's entry in the leaderboard
  const currentUserEntry = useMemo(() => {
    const fromTable = leaderboard.find(e => e.isCurrentUser || e.studentId === user?.id);
    if (fromTable) return fromTable;
    return serverCurrentUser;
  }, [leaderboard, serverCurrentUser, user?.id]);

  // Filtered entries by domain, search, and region/college
  const filteredEntries = useMemo(() => {
    let list = leaderboard;

    if (activeTab === 'campus') {
      const matchCollege = list.filter(e => e.college.toLowerCase().includes(userCollege.toLowerCase()) || userCollege.toLowerCase().includes(e.college.toLowerCase()));
      list = matchCollege.map((entry, index) => ({ ...entry, rank: index + 1, zone: 'safe' as const }));
    }

    const result = list.filter(entry => {
      const matchesSearch = !searchQuery ||
        entry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.college.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.programTitle.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesSearch;
    });
    return result;
  }, [leaderboard, searchQuery, activeTab, userCollege]);

  const filteredGuilds = useMemo(() => {
    const term = searchQuery.trim().toLowerCase();
    if (!term) return guilds;
    return guilds.filter(guild =>
      guild.guildName.toLowerCase().includes(term) ||
      guild.hackathonTitle.toLowerCase().includes(term) ||
      guild.teamLeadName.toLowerCase().includes(term) ||
      guild.status.toLowerCase().includes(term)
    );
  }, [guilds, searchQuery]);

  const activeLeagueMeta = LEAGUE_CONFIGS[selectedLeague];
  const userLeagueMeta = LEAGUE_CONFIGS[currentUserLeague];

  return (
    <div className={styles.competitionPage}>

      <CompetitionNavigation active="leaderboard" />

      {/* ── TOP ELEVATED COCKPIT TELEMETRY HUD (25% Compact Scale) ──────── */}
      <div
        data-testid="cockpit-telemetry-hud"
        className={styles.leagueCockpit}
        style={{ '--league-color': userLeagueMeta.color } as React.CSSProperties}
      >
        {/* Card 1: Active League & Interactive Division Selector Trigger */}
        <button
          type="button"
          className={`pinit-emblem-launcher ${styles.leagueDivisionButton}`}
          data-testid="interactive-league-emblem-btn"
          onClick={() => setIsLeagueModalOpen(true)}
          title="Click to inspect all competitive divisions"
          aria-haspopup="dialog"
          aria-expanded={isLeagueModalOpen}
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
              <span>{joinedForCurrentAccount && selectedLeague === currentUserLeague ? 'Active Division' : 'Viewing Division'}</span>
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
        <div className={styles.leagueStanding}>
          <div className={styles.leagueStandingHeader}>
            <span>Individual league standing</span>
            <span className={styles.liveSprint}>LIVE SPRINT</span>
          </div>
          <div className={styles.leagueRankLine}>
            <span key={currentUserEntry?.rank ?? 'unranked'} className={`${styles.leagueRankNumber} ${styles.metricValueChanged}`}>
              {currentUserEntry ? `#${currentUserEntry.rank}` : 'Unranked'}
            </span>
            <span key={currentUserEntry?.leaguePoints ?? 0} className={`${styles.leaguePoints} ${styles.metricValueChanged}`}>
              {currentUserEntry
                ? `${(currentUserEntry.leaguePoints || 0).toLocaleString()} League Points`
                : (joinedForCurrentAccount ? `Inspecting ${activeLeagueMeta.title}` : 'Join Browns to start your sprint')}
            </span>
          </div>

          <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            {currentUserEntry?.zone === 'promotion' ? (
              <span className={`${styles.zoneLabel} ${styles.zonePromotion}`}>
                In Promotion Zone! Advance to {userLeagueMeta.nextTier ? LEAGUE_CONFIGS[userLeagueMeta.nextTier].title : 'Champions'}
              </span>
            ) : currentUserEntry?.zone === 'demotion' ? (
              <span className={`${styles.zoneLabel} ${styles.zoneDemotion}`}>
                In Demotion Zone! Earn League Points to remain in {userLeagueMeta.title}
              </span>
            ) : (
              <span className={styles.zoneLabel}>
                Safe Zone — Remaining in {userLeagueMeta.title}
              </span>
            )}
          </div>
        </div>

        {/* Right Section: Two Dynamic Circles Side-by-Side (Task 1) */}
        <div className={styles.leagueClockGroup}>
          {/* Career XP needed to unlock Browns membership. */}
          {userTotalXp < 100 && (
            <div ref={xpReqRef} style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => {
                  setShowXpReqTooltip(prev => !prev);
                  setShowResetTooltip(false);
                }}
                title="100 Career XP required to join Browns"
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
                      Career XP
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
                    maxWidth: 'calc(100vw - 40px)',
                    padding: '12px 14px',
                    borderRadius: 12,
                    background: 'var(--card)',
                    border: '1.5px solid rgba(245, 158, 11, 0.4)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ fontSize: 11.5, fontWeight: 800, color: '#f59e0b', marginBottom: 4 }}>
                    100 Career XP required to join Browns
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--t2)', lineHeight: 1.4 }}>
                    Earn <strong>{Math.max(0, 100 - userTotalXp)} more Career XP</strong> through learning activities. Current: {userTotalXp}/100 Career XP.
                  </div>
                  <div style={{ marginTop: 8, height: 4, borderRadius: 2, background: 'rgba(245, 158, 11, 0.2)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${Math.min(100, (userTotalXp / 100) * 100)}%`, background: '#f59e0b' }} />
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <Link
                      href="/quests"
                      style={{
                        display: 'inline-block',
                        fontSize: 11,
                        fontWeight: 700,
                        color: '#f59e0b',
                        textDecoration: 'underline',
                      }}
                    >
                      Continue learning quests →
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Circle 2: Reset Clock to promote or demote users */}
          <div ref={resetClockRef} style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => {
                setShowResetTooltip(prev => !prev);
                setShowXpReqTooltip(false);
              }}
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
                  maxWidth: 'calc(100vw - 40px)',
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
                  Sprint resets Monday at 1:00 AM IST. The top 25% (rounded up, at least one eligible member) promote; the bottom 10% demote when a division has 10+ members. Browns and Ruby are the league edges.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Career XP league entry gate ─────────────────────────────────── */}
      {userTotalXp < 100 ? (
        <div
          data-testid="league-100xp-gate"
          className={styles.qualificationBanner}
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
                100 Career XP required to join Browns
              </div>
              <div style={{ fontSize: 13.5, color: 'var(--t2)', marginTop: 2 }}>
                You can browse every division now. Join Browns after reaching 100 lifetime Career XP.
              </div>
            </div>
          </div>

          <div style={{ minWidth: 220 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 700, color: '#eab308', marginBottom: 4 }}>
              <span>League Qualification</span>
              <span>{userTotalXp} / 100 Career XP</span>
            </div>
            <div style={{ height: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 999, overflow: 'hidden' }}>
              <div
                className={styles.qualificationProgress}
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
      ) : !joinedForCurrentAccount ? (
        <div
          data-testid="league-qualified-banner"
          className={styles.qualifiedBanner}
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
                100 Career XP reached — Browns is unlocked
              </div>
              <div style={{ fontSize: 13.5, color: 'var(--t2)', marginTop: 2 }}>
                Join Browns to start your first ranked sprint. Your league position is decided by League Points rank.
              </div>
            </div>
          </div>

          <button
            onClick={handleJoinLeague}
            disabled={joiningLeague || !user?.id}
            data-testid="join-league-btn"
            style={{
              padding: '10px 22px',
              borderRadius: 10,
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#fff',
              fontSize: 14,
              fontWeight: 800,
              border: 'none',
              cursor: joiningLeague ? 'wait' : 'pointer',
              opacity: joiningLeague ? 0.75 : 1,
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
            }}
          >
            {!user?.id ? 'Sign in to join' : joiningLeague ? 'Joining…' : 'Join Browns League'}
          </button>
        </div>
      ) : null}

      {/* Three clear leaderboard scopes, with search beside the tabs. */}
      <div className={styles.leaderboardToolbar}>
        <div className={styles.scopeTabs} role="tablist" aria-label="Leaderboard scope">
          {[
            { id: 'campus', label: 'Campus' },
            { id: 'global', label: 'Global' },
            { id: 'guild', label: 'Guild' },
          ].map(tab => (
            <button
              key={tab.id}
              data-testid={`subtab-${tab.id}`}
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id as TabMode)}
              className={`${styles.scopeTab} ${activeTab === tab.id ? styles.scopeTabSelected : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <input
          type="search"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          aria-label={activeTab === 'guild' ? 'Search guilds' : 'Search leaderboard'}
          placeholder={activeTab === 'guild' ? 'Search guilds or projects…' : 'Search students or campus…'}
          className={styles.searchField}
        />
        <span className={styles.liveBoardStatus} role="status" aria-live="polite">
          <span className={styles.liveBoardDot} aria-hidden="true" />
          {loading
            ? lastUpdatedAt ? 'Updating live standings' : 'Loading live standings'
            : lastUpdatedAt ? `Live · Updated ${lastUpdatedAt.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}` : 'Live standings'}
        </span>
      </div>

      {activeTab === 'global' && (
        <div className={styles.rulesNote}>
          League Points decide rank within each division. At reset, the top 25% (rounded up, at least one eligible member) advance; the bottom 10% move down when a division has at least 10 members. Browns has no lower league, Ruby has no higher league, and ELO never changes league placement.
        </div>
      )}

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
                const isUserTier = joinedForCurrentAccount && currentUserLeague === tier;
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
                      if (activeTab !== 'global') {
                        setActiveTab('global');
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

      {/* ── TOP 3 CHAMPIONS PODIUM SHOWCASE (Temporarily removed per Task 2) ── */}

            {/* ── TAB CONTENT: GUILD PROJECTS TABLE ──────────────────────────── */}
      {activeTab === 'guild' ? (
        <div data-testid="guild-projects-table-container" className={styles.boardShell}>
          <div className={styles.rulesNote} style={{ margin: '16px 16px 0' }}>
            This is separate from your individual League rank. The Guild board currently ranks engineering squads from Projects &amp; Hackathons; persistent player clans and Guild Points are not implemented yet.
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', minWidth: 900, borderCollapse: 'collapse', textAlign: 'left', fontSize: 14.5 }}>
              <thead>
                <tr style={{ background: 'var(--bg3)', borderBottom: '1px solid var(--border)', color: 'var(--t2)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  <th style={{ padding: '14px 20px', width: 90 }}>Squad Rank</th>
                  <th style={{ padding: '14px 20px' }}>Project Squad</th>
                  <th style={{ padding: '14px 20px' }}>Hackathon Theme</th>
                  <th style={{ padding: '14px 20px' }}>Team Lead</th>
                  <th style={{ padding: '14px 20px' }}>Members</th>
                  <th style={{ padding: '14px 20px' }}>Projects Completed</th>
                  <th style={{ padding: '14px 20px' }}>Squad Score</th>
                  <th style={{ padding: '14px 20px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {guildsLoadError ? (
                  <tr>
                    <td colSpan={8} role="alert" style={{ padding: '56px 20px', textAlign: 'center', color: 'var(--danger, #ef4444)' }}>
                      {guildsLoadError}
                    </td>
                  </tr>
                ) : guilds.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ padding: '56px 20px', textAlign: 'center' }}>
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
                          No Project Squads Found
                        </div>
                        <p style={{ fontSize: 13, color: 'var(--t3)', lineHeight: 1.6, margin: 0 }}>
                          Create an engineering squad in Projects &amp; Hackathons, then complete verified milestones to appear on this board.
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
                ) : filteredGuilds.length === 0 ? (
                  <tr><td colSpan={8} style={{ padding: '48px 20px', textAlign: 'center', color: 'var(--t3)' }}>No project squads match this search.</td></tr>
                ) : (
                  filteredGuilds.map((guild) => (
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
                      <td style={{ padding: '16px 20px', color: 'var(--t1)', fontFamily: 'var(--font-mono)', fontWeight: 800 }}>
                        {guild.finalScore == null ? '—' : guild.finalScore.toLocaleString()}
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
        /* ── CAMPUS / GLOBAL LEAGUE POINTS TABLE ── */
        <div className={styles.boardShell}>
          <div style={{ overflowX: 'auto' }}>
            <table className={styles.boardTable}>
              <thead>
                <tr style={{ background: 'var(--bg3)', borderBottom: '1px solid var(--border)', color: 'var(--t2)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  <th style={{ padding: '14px 20px', width: 70 }}>Rank</th>
                  <th style={{ padding: '14px 20px' }}>Student</th>
                  <th style={{ padding: '14px 20px', textAlign: 'right' }}>League Points</th>
                  <th style={{ padding: '14px 20px' }}>{activeTab === 'global' ? 'Sprint Zone' : 'Board'}</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} style={{ padding: 48, textAlign: 'center', color: 'var(--t3)' }}>
                      Loading League Points…
                    </td>
                  </tr>
                ) : filteredEntries.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ padding: 48, textAlign: 'center', color: 'var(--t3)' }}>
                      {activeTab === 'campus'
                        ? 'No ranked students from your campus in this division yet.'
                        : 'No students found in this division.'}
                    </td>
                  </tr>
                ) : (
                  filteredEntries.map((entry, idx) => {
                    const isTop3 = entry.rank <= 3;
                    const rankLabel = `#${entry.rank}`;
                    const isPromoting = entry.zone === 'promotion';
                    const isDemoting = entry.zone === 'demotion';

                    // Cutoff lines for weekly leagues
                    const renderPromotionDivider = activeTab === 'global' &&
                      selectedLeague !== 'ruby' &&
                      entry.rank === promotionCutoff &&
                      filteredEntries.length >= 2;

                    const renderDemotionDivider = activeTab === 'global' &&
                      selectedLeague !== 'browns' &&
                      demotionCutoff > 0 &&
                      entry.rank === demotionCutoff - 1 &&
                      filteredEntries.length >= 2 &&
                      demotionCutoff > promotionCutoff;

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
                            <span key={`rank-${entry.rank}`} className={styles.boardValue}>{rankLabel}</span>
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

                          {/* One score is shown: League Points */}
                          <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                            <span key={`points-${entry.leaguePoints || 0}`} className={styles.boardValue} style={{ fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 900, color: '#10b981' }}>
                              {(entry.leaguePoints || 0).toLocaleString()}
                            </span>
                          </td>

                          {/* Promotion and demotion are shown only on the Global ladder. */}
                          <td style={{ padding: '16px 20px' }}>
                            {activeTab === 'global' ? (
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
                              <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--t3)' }}>
                                Campus board
                              </span>
                            )}
                          </td>
                        </tr>

                        {/* Promotion Divider */}
                        {renderPromotionDivider && (
                          <tr>
                  <td colSpan={4} style={{ padding: 0 }}>
                              <div style={{ height: 2, background: 'repeating-linear-gradient(90deg, #10b981, #10b981 8px, transparent 8px, transparent 16px)' }} />
                              <div style={{ padding: '4px 20px', background: 'rgba(16,185,129,0.1)', color: '#059669', fontSize: 11.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                Promotion Cutoff Line — Top 25% (rounded up) advance by rank
                              </div>
                            </td>
                          </tr>
                        )}

                        {/* Demotion Divider */}
                        {renderDemotionDivider && (
                          <tr>
                  <td colSpan={4} style={{ padding: 0 }}>
                              <div style={{ height: 2, background: 'repeating-linear-gradient(90deg, #ef4444, #ef4444 8px, transparent 8px, transparent 16px)' }} />
                              <div style={{ padding: '4px 20px', background: 'rgba(239,68,68,0.1)', color: '#dc2626', fontSize: 11.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                Demotion Cutoff Line — Bottom 10% move down by rank
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
