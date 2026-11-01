'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { supabase } from '@/lib/supabaseClient';
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
  leagueTier: LeagueTier;
  weeklyXp: number;
  totalXp: number;
  zone: 'promotion' | 'safe' | 'demotion';
  isCurrentUser?: boolean;
}

type TabMode = 'weekly_leagues' | 'global' | 'verified_evidence' | 'code_wars';

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
  const searchParams = useSearchParams();
  const initialMode = (searchParams?.get('mode') as TabMode) || 'weekly_leagues';

  const [activeTab, setActiveTab] = useState<TabMode>(initialMode);
  const [selectedLeague, setSelectedLeague] = useState<LeagueTier>('browns');
  const [currentUserLeague, setCurrentUserLeague] = useState<LeagueTier>('browns');
  const [domainFilter, setDomainFilter] = useState<'all' | 'tech' | 'data' | 'ai'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
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

  // Live 1-second countdown ticker for Monday 1:00 AM IST reset
  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingMs(prev => Math.max(0, prev - 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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

        let authHeader: Record<string, string> = {};
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.access_token) {
            authHeader = { Authorization: `Bearer ${session.access_token}` };
          }
        } catch {}

        const res = await fetch(`/api/leaderboard?${params.toString()}`, {
          headers: {
            ...authHeader,
          },
          cache: 'no-store',
        });
        const data = await res.json();

        if (data.ok && isMounted) {
          setLeaderboard(Array.isArray(data.leaderboard) ? data.leaderboard : []);
          setPromotionCutoff(data.promotionCutoffRank || 1);
          setDemotionCutoff(data.demotionCutoffRank || 1);
          if (typeof data.remainingMs === 'number') {
            setRemainingMs(data.remainingMs);
          }
          if (data.currentUserLeague) {
            setCurrentUserLeague(normalizeLeagueTier(data.currentUserLeague));
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
  }, [activeTab, selectedLeague]);

  // Current user's entry in the leaderboard
  const currentUserEntry = useMemo(() => {
    return leaderboard.find(e => e.isCurrentUser || e.studentId === user?.id) || null;
  }, [leaderboard, user?.id]);

  // Filtered entries by domain and search
  const filteredEntries = useMemo(() => {
    return leaderboard.filter(entry => {
      const matchesSearch = !searchQuery ||
        entry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.college.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.programTitle.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDomain = domainFilter === 'all' ||
        entry.programTitle.toLowerCase().includes(domainFilter);

      return matchesSearch && matchesDomain;
    });
  }, [leaderboard, searchQuery, domainFilter]);

  const activeLeagueMeta = LEAGUE_CONFIGS[selectedLeague];
  const userLeagueMeta = LEAGUE_CONFIGS[currentUserLeague];

  return (
    <div style={{ background: 'transparent', color: 'var(--text)', maxWidth: 1340, margin: '0 auto', padding: '0 0 40px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>

      {/* ── Header Bar ─────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, borderBottom: '1px solid var(--border)', paddingBottom: 16, flexWrap: 'wrap', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <LeagueBadge tier={currentUserLeague} size="sm" glow animate />
          <div>
            <h1 style={{ margin: 0, fontSize: 26.5, fontWeight: 900, letterSpacing: '-0.5px', display: 'flex', alignItems: 'center', gap: 10, color: 'var(--t1)' }}>
              Competency & Weekly Leagues
              <span style={{ fontSize: 12, padding: '3px 10px', borderRadius: 20, background: userLeagueMeta.bgGradient, color: userLeagueMeta.color, border: `1.5px solid ${userLeagueMeta.color}60`, fontWeight: 800 }}>
                {userLeagueMeta.title}
              </span>
            </h1>
            <p style={{ margin: '4px 0 0', fontSize: 14.5, color: 'var(--t2)' }}>
              7-Day Duolingo-Style Sprints · Top 10% Promote · Bottom 10% Demote · Resets Mondays at 1:00 AM IST
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <Link
            href="/arena?tab=code_wars"
            style={{ padding: '8px 16px', borderRadius: 10, background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', color: '#fff', fontSize: 14.5, textDecoration: 'none', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 6 }}
          >
            ⚔️ 1v1 Battle Arena
          </Link>
          <Link
            href="/pins"
            style={{ padding: '8px 16px', borderRadius: 10, background: 'rgba(217,119,6,0.12)', color: '#d97706', fontSize: 14.5, textDecoration: 'none', border: '1px solid rgba(217,119,6,0.35)', boxShadow: 'var(--shadow-sm)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 6 }}
          >
            <PinCoin size={16} glow /> Pins Wallet
          </Link>
        </div>
      </div>

      {/* ── Mode Switcher Tabs ─────────────────────────────────────────── */}
      <div style={{
        display: 'flex',
        gap: 8,
        padding: '6px',
        borderRadius: 14,
        background: 'var(--bg2)',
        border: '1px solid var(--border)',
        marginBottom: 22,
        overflowX: 'auto'
      }}>
        {[
          { id: 'weekly_leagues', label: 'Weekly Ranked Leagues', icon: '⚡' },
          { id: 'global', label: 'Global Rankings', icon: '🏆' },
          { id: 'verified_evidence', label: 'SHA-256 Verified Ledger', icon: '🛡️' },
          { id: 'code_wars', label: 'Code Wars 1v1 Duel Elo', icon: '⚔️' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabMode)}
            style={{
              flex: 1,
              minWidth: 170,
              padding: '11px 16px',
              borderRadius: 10,
              border: activeTab === tab.id ? '1.5px solid var(--accent)' : '1px solid transparent',
              background: activeTab === tab.id
                ? 'var(--accent-light)'
                : 'transparent',
              color: activeTab === tab.id ? 'var(--accent-hover, var(--brand-bright, #4f46e5))' : 'var(--t2)',
              fontWeight: 800,
              fontSize: 14.5,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              transition: 'all 0.15s ease'
            }}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ── Weekly League Cockpit Banner (when weekly_leagues mode active) ── */}
      {activeTab === 'weekly_leagues' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 16,
          padding: '20px 24px',
          borderRadius: 20,
          background: 'linear-gradient(135deg, var(--card) 0%, var(--bg3) 100%)',
          border: `1.5px solid ${userLeagueMeta.color}45`,
          boxShadow: `var(--shadow-md), 0 0 24px ${userLeagueMeta.color}15`,
          marginBottom: 24,
        }}>
          {/* Card 1: Active League & Rank Status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <LeagueBadge tier={currentUserLeague} size="md" glow animate />
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: userLeagueMeta.color }}>
                Your Active League
              </div>
              <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--t1)', margin: '2px 0' }}>
                {userLeagueMeta.title}
              </div>
              <div style={{ fontSize: 13, color: 'var(--t3)' }}>
                {userLeagueMeta.slogan}
              </div>
            </div>
          </div>

          {/* Card 2: Sprint Standing & Promotion Status */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--t3)' }}>
              Current Sprint Position
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 26.5, fontWeight: 900, color: '#d97706' }}>
                {currentUserEntry ? `#${currentUserEntry.rank}` : 'Unranked'}
              </span>
              <span style={{ fontSize: 14.5, color: 'var(--t2)', fontFamily: 'var(--font-mono)' }}>
                {currentUserEntry ? `${currentUserEntry.weeklyXp.toLocaleString()} XP this week` : 'Earn XP to rank!'}
              </span>
            </div>

            <div style={{ marginTop: 6 }}>
              {currentUserEntry?.zone === 'promotion' ? (
                <span style={{ padding: '4px 10px', borderRadius: 8, background: 'rgba(16,185,129,0.15)', border: '1px solid #10b981', color: '#059669', fontSize: 12, fontWeight: 800 }}>
                  ⬆️ In Promotion Zone! Advance to {userLeagueMeta.nextTier ? LEAGUE_CONFIGS[userLeagueMeta.nextTier].title : 'Champions'}
                </span>
              ) : currentUserEntry?.zone === 'demotion' ? (
                <span style={{ padding: '4px 10px', borderRadius: 8, background: 'rgba(239,68,68,0.15)', border: '1px solid #ef4444', color: '#dc2626', fontSize: 12, fontWeight: 800 }}>
                  ⬇️ In Demotion Zone! Earn XP to remain in {userLeagueMeta.title}
                </span>
              ) : (
                <span style={{ padding: '4px 10px', borderRadius: 8, background: 'rgba(99,102,241,0.15)', border: '1px solid #6366f1', color: '#4f46e5', fontSize: 12, fontWeight: 800 }}>
                  ⏸️ Safe Zone — Remaining in {userLeagueMeta.title}
                </span>
              )}
            </div>
          </div>

          {/* Card 3: Sprint Reset Countdown Timer */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--t3)' }}>
              ⏳ Weekly Sprint Ends (Monday 1:00 AM IST)
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 24, fontWeight: 900, color: remainingMs < 86400000 ? '#dc2626' : 'var(--blue, #2563eb)', marginTop: 4 }}>
              {formatCountdown(remainingMs)}
            </div>
            <div style={{ fontSize: 12, color: 'var(--t3)', marginTop: 4 }}>
              Top 10% promote ⬆️ · Bottom 10% demote ⬇️
            </div>
          </div>
        </div>
      )}

      {/* ── 5-League Tier Switcher Bar (when in weekly_leagues mode) ───── */}
      {activeTab === 'weekly_leagues' && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
            Inspect League Division:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 10 }}>
            {ALL_LEAGUES.map(tier => {
              const meta = LEAGUE_CONFIGS[tier];
              const isSelected = selectedLeague === tier;
              const isUserTier = currentUserLeague === tier;
              const count = leagueCounts[tier] || 0;

              return (
                <button
                  key={tier}
                  onClick={() => setSelectedLeague(tier)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '10px 14px',
                    borderRadius: 14,
                    border: isSelected ? `2px solid ${meta.color}` : '1px solid var(--border)',
                    background: isSelected ? meta.bgGradient : 'var(--card)',
                    boxShadow: isSelected ? `0 4px 16px ${meta.glowColor}` : 'var(--shadow-sm)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <LeagueBadge tier={tier} size="xs" glow={isSelected} animate={isSelected} />
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ fontSize: 14.5, fontWeight: 900, color: isSelected ? meta.color : 'var(--t1)', display: 'flex', alignItems: 'center', gap: 6 }}>
                      {meta.title}
                      {isUserTier && <span style={{ fontSize: 10, padding: '1px 5px', borderRadius: 4, background: meta.color, color: '#fff', fontWeight: 900 }}>YOU</span>}
                    </div>
                    <div style={{ fontSize: 11.5, color: 'var(--t3)', marginTop: 2 }}>
                      {count} {count === 1 ? 'Student' : 'Students'}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Filter & Search Bar ────────────────────────────────────────── */}
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
          placeholder="🔍 Search student, role, or college..."
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

      {/* ── Leaderboard Table with Cutoff Dividers ─────────────────────── */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 18, overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 14.5 }}>
          <thead>
            <tr style={{ background: 'var(--bg3)', borderBottom: '1px solid var(--border)', color: 'var(--t2)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              <th style={{ padding: '14px 20px', width: 70 }}>Rank</th>
              <th style={{ padding: '14px 20px' }}>Student Candidate</th>
              <th style={{ padding: '14px 20px' }}>Program Track</th>
              <th style={{ padding: '14px 20px' }}>
                {activeTab === 'weekly_leagues' ? 'Weekly Sprint XP' : activeTab === 'code_wars' ? 'Elo Rating' : 'Verified Skills'}
              </th>
              <th style={{ padding: '14px 20px' }}>
                {activeTab === 'weekly_leagues' ? 'Sprint Zone' : 'Defense Score'}
              </th>
              <th style={{ padding: '14px 20px' }}>Placement Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ padding: 48, textAlign: 'center', color: 'var(--t3)' }}>
                  Loading real-time student leaderboard & leagues...
                </td>
              </tr>
            ) : filteredEntries.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: 48, textAlign: 'center', color: 'var(--t3)' }}>
                  No students found matching this criteria. Earn XP to lead this division!
                </td>
              </tr>
            ) : (
              filteredEntries.map((entry, idx) => {
                const isTop3 = entry.rank <= 3;
                const rankIcon = entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : `#${entry.rank}`;
                const isPromoting = entry.zone === 'promotion';
                const isDemoting = entry.zone === 'demotion';

                // Check if we need to insert the Promotion Cutoff Divider line
                const renderPromotionDivider = activeTab === 'weekly_leagues' &&
                  selectedLeague !== 'ruby' &&
                  idx + 1 === promotionCutoff &&
                  filteredEntries.length >= 2;

                // Check if we need to insert the Demotion Cutoff Divider line
                const renderDemotionDivider = activeTab === 'weekly_leagues' &&
                  selectedLeague !== 'browns' &&
                  idx + 1 === demotionCutoff - 1 &&
                  filteredEntries.length >= 2 &&
                  demotionCutoff > promotionCutoff;

                return (
                  <React.Fragment key={entry.studentId}>
                    <tr
                      style={{
                        borderBottom: '1px solid var(--border)',
                        background: entry.isCurrentUser
                          ? 'rgba(99, 102, 241, 0.12)'
                          : isPromoting
                          ? 'rgba(16, 185, 129, 0.05)'
                          : isDemoting
                          ? 'rgba(239, 68, 68, 0.05)'
                          : 'transparent',
                        transition: 'background 0.15s ease',
                      }}
                    >
                      {/* Rank */}
                      <td style={{ padding: '16px 20px', fontWeight: 900, fontSize: isTop3 ? 17.5 : 14.5, color: entry.rank === 1 ? '#d97706' : entry.rank === 2 ? '#64748b' : entry.rank === 3 ? '#b45309' : 'var(--t3)' }}>
                        {rankIcon}
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

                      {/* Track */}
                      <td style={{ padding: '16px 20px', color: 'var(--t2)' }}>
                        {entry.programTitle}
                      </td>

                      {/* Metric Column: Weekly XP vs Elo vs Skills */}
                      <td style={{ padding: '16px 20px' }}>
                        {activeTab === 'weekly_leagues' ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 15.5, fontWeight: 900, color: '#d97706' }}>
                              +{entry.weeklyXp.toLocaleString()}
                            </span>
                            <span style={{ fontSize: 12, color: 'var(--t3)', fontWeight: 700 }}>XP</span>
                          </div>
                        ) : activeTab === 'code_wars' ? (
                          <span style={{ padding: '4px 8px', borderRadius: 6, background: 'rgba(239,68,68,0.12)', color: '#dc2626', fontWeight: 800, fontSize: 13, border: '1px solid rgba(239,68,68,0.25)' }}>
                            ⚔️ {entry.eloRating} ELO
                          </span>
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ padding: '4px 8px', borderRadius: 6, background: 'rgba(16,185,129,0.12)', color: '#059669', fontWeight: 800, fontSize: 13, border: '1px solid rgba(16,185,129,0.25)' }}>
                              🛡️ {entry.verifiedSkillsCount} Verified
                            </span>
                            <span style={{ fontSize: 12, color: 'var(--t3)' }}>
                              ({entry.demonstratedSkillsCount} dem.)
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Zone / Defense Score */}
                      <td style={{ padding: '16px 20px' }}>
                        {activeTab === 'weekly_leagues' ? (
                          isPromoting ? (
                            <span style={{ padding: '4px 10px', borderRadius: 6, background: 'rgba(16,185,129,0.15)', color: '#059669', fontWeight: 800, fontSize: 12.5, display: 'inline-flex', alignItems: 'center', gap: 4, border: '1px solid rgba(16,185,129,0.3)' }}>
                              ⬆️ Promoting
                            </span>
                          ) : isDemoting ? (
                            <span style={{ padding: '4px 10px', borderRadius: 6, background: 'rgba(239,68,68,0.15)', color: '#dc2626', fontWeight: 800, fontSize: 12.5, display: 'inline-flex', alignItems: 'center', gap: 4, border: '1px solid rgba(239,68,68,0.3)' }}>
                              ⬇️ Demoting
                            </span>
                          ) : (
                            <span style={{ padding: '4px 10px', borderRadius: 6, background: 'var(--bg3)', color: 'var(--t2)', fontWeight: 700, fontSize: 12.5, border: '1px solid var(--border)' }}>
                              ⏸️ Safe Zone
                            </span>
                          )
                        ) : (
                          entry.defenseScore > 0 ? (
                            <span style={{ fontWeight: 700, color: entry.defenseScore >= 75 ? '#10b981' : '#facc15' }}>
                              🎙️ {entry.defenseScore}/100
                            </span>
                          ) : (
                            <span style={{ color: 'var(--text-dim)', fontSize: 13 }}>Pending Viva</span>
                          )
                        )}
                      </td>

                      {/* Placement Status */}
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: 6,
                          fontSize: 12,
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          background: entry.readinessStatus === 'ready_for_interview' ? 'rgba(16,185,129,0.15)' : entry.readinessStatus === 'ready_for_internship' ? 'rgba(2,132,199,0.15)' : 'rgba(217,119,6,0.15)',
                          color: entry.readinessStatus === 'ready_for_interview' ? '#059669' : entry.readinessStatus === 'ready_for_internship' ? '#0284c7' : '#b45309'
                        }}>
                          {entry.readinessStatus.replace(/_/g, ' ')}
                        </span>
                      </td>
                    </tr>

                    {/* ⬆️ PROMOTION ZONE DIVIDER LINE */}
                    {renderPromotionDivider && (
                      <tr>
                        <td colSpan={6} style={{ padding: '0', background: 'rgba(16,185,129,0.12)', borderTop: '2px solid #10b981', borderBottom: '2px solid #10b981' }}>
                          <div style={{ padding: '6px 20px', fontSize: 12, fontWeight: 800, color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'space-between', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                            <span>⬆️ PROMOTION ZONE (Top 10%) — Advance to {activeLeagueMeta.nextTier ? LEAGUE_CONFIGS[activeLeagueMeta.nextTier].title : 'Champions'}</span>
                            <span>Monday 1:00 AM IST</span>
                          </div>
                        </td>
                      </tr>
                    )}

                    {/* ⬇️ DEMOTION ZONE DIVIDER LINE */}
                    {renderDemotionDivider && (
                      <tr>
                        <td colSpan={6} style={{ padding: '0', background: 'rgba(239,68,68,0.12)', borderTop: '2px solid #ef4444', borderBottom: '2px solid #ef4444' }}>
                          <div style={{ padding: '6px 20px', fontSize: 12, fontWeight: 800, color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'space-between', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                            <span>⬇️ DEMOTION ZONE (Bottom 10%) — Risk of falling back to {activeLeagueMeta.prevTier ? LEAGUE_CONFIGS[activeLeagueMeta.prevTier].title : 'Base'}</span>
                            <span>Monday 1:00 AM IST</span>
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
  );
}

export default function LeaderboardPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40, textAlign: 'center', color: 'var(--t3)' }}>Loading Leaderboard & Leagues...</div>}>
      <LeaderboardContent />
    </Suspense>
  );
}
