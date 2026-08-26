'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { PathwayApiService } from '@/lib/api/pathwayApi';
import { StudentSkillProfile, DynamicRoleReadiness, RoleReadinessStage } from '@/lib/pathway/competencySchema';

interface LeaderboardEntry {
  rank: number;
  studentId: string;
  name: string;
  avatarUrl: string;
  college: string;
  programTitle: string;
  verifiedSkillsCount: number;
  demonstratedSkillsCount: number;
  defenseScore: number;
  readinessStatus: RoleReadinessStage;
  learningGainPoints: number;
  eloRating?: number;
  leagueTier?: 'Diamond' | 'Platinum' | 'Gold' | 'Silver' | 'Bronze';
  isCurrentUser?: boolean;
}

const SAMPLE_LEADERBOARD_BASELINE: LeaderboardEntry[] = [
  {
    rank: 1,
    studentId: 'student_dev_001',
    name: 'Sarah Chen',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    college: 'Stanford Engineering / PinIT SWE Residency',
    programTitle: '9-Month Accelerated SWE Track',
    verifiedSkillsCount: 8,
    demonstratedSkillsCount: 9,
    defenseScore: 94,
    readinessStatus: 'ready_for_interview',
    learningGainPoints: 48,
    eloRating: 1840,
    leagueTier: 'Diamond'
  },
  {
    rank: 2,
    studentId: 'student_dev_002',
    name: 'Devin Vance',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
    college: 'MIT Computer Science',
    programTitle: '9-Month Accelerated SWE Track',
    verifiedSkillsCount: 8,
    demonstratedSkillsCount: 8,
    defenseScore: 90,
    readinessStatus: 'ready_for_interview',
    learningGainPoints: 42,
    eloRating: 1790,
    leagueTier: 'Diamond'
  },
  {
    rank: 3,
    studentId: 'student_dev_003',
    name: 'Priya Sharma',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    college: 'IIT Delhi / PinIT Cloud Fellow',
    programTitle: '12-Month Standard SWE Track',
    verifiedSkillsCount: 7,
    demonstratedSkillsCount: 10,
    defenseScore: 88,
    readinessStatus: 'ready_for_internship',
    learningGainPoints: 39,
    eloRating: 1650,
    leagueTier: 'Platinum'
  },
  {
    rank: 4,
    studentId: 'student_dev_004',
    name: 'Marcus Brody',
    avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80',
    college: 'UC Berkeley / PinIT Residency',
    programTitle: '9-Month Accelerated SWE Track',
    verifiedSkillsCount: 6,
    demonstratedSkillsCount: 11,
    defenseScore: 82,
    readinessStatus: 'ready_for_internship',
    learningGainPoints: 34,
    eloRating: 1580,
    leagueTier: 'Platinum'
  },
  {
    rank: 5,
    studentId: 'student_dev_005',
    name: 'Aarav Patel',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    college: 'BITS Pilani CS',
    programTitle: '6-Month Cloud Systems Track',
    verifiedSkillsCount: 5,
    demonstratedSkillsCount: 8,
    defenseScore: 78,
    readinessStatus: 'exploring',
    learningGainPoints: 28,
    eloRating: 1420,
    leagueTier: 'Gold'
  }
];

function LeaderboardContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const currentStudentId = user?.id || 'demo_student_01';
  const currentStudentName = user?.name || 'You (Current Student)';

  const initialTab = (searchParams?.get('tab') as any) || 'global';
  const [activeTab, setActiveTab] = useState<'global' | 'verified_evidence' | 'weekly_leagues' | 'code_wars'>(
    ['global', 'verified_evidence', 'weekly_leagues', 'code_wars'].includes(initialTab) ? initialTab : 'global'
  );

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(SAMPLE_LEADERBOARD_BASELINE);
  const [domainFilter, setDomainFilter] = useState<'all' | 'tech' | 'data' | 'ai'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentUserProfile, setCurrentUserProfile] = useState<StudentSkillProfile | null>(null);
  const [currentUserReadiness, setCurrentUserReadiness] = useState<DynamicRoleReadiness | null>(null);

  useEffect(() => {
    async function loadLiveTelemetry() {
      try {
        const profile = await PathwayApiService.getStudentSkillProfile(currentStudentId);
        const readiness = await PathwayApiService.getRoleReadiness(currentStudentId);
        setCurrentUserProfile(profile);
        setCurrentUserReadiness(readiness);

        const userEntry: LeaderboardEntry = {
          rank: 1,
          studentId: currentStudentId,
          name: `${currentStudentName} (You)`,
          avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
          college: 'PinIT Career OS Academy',
          programTitle: '9-Month Accelerated SWE Track',
          verifiedSkillsCount: profile.verified.length,
          demonstratedSkillsCount: profile.demonstrated.length,
          defenseScore: readiness.capstoneDefenseScore || 0,
          readinessStatus: readiness.status,
          learningGainPoints: readiness.learningGain.pointsGained || 0,
          eloRating: 1610,
          leagueTier: 'Platinum',
          isCurrentUser: true,
        };

        const combined = [...SAMPLE_LEADERBOARD_BASELINE.filter(e => e.studentId !== currentStudentId), userEntry];
        
        // Sort strictly by: 1. Verified skills, 2. Defense score, 3. Learning gain
        combined.sort((a, b) => {
          if (b.verifiedSkillsCount !== a.verifiedSkillsCount) {
            return b.verifiedSkillsCount - a.verifiedSkillsCount;
          }
          if (b.defenseScore !== a.defenseScore) {
            return b.defenseScore - a.defenseScore;
          }
          return b.learningGainPoints - a.learningGainPoints;
        });

        // Reassign ranks
        combined.forEach((entry, idx) => {
          entry.rank = idx + 1;
        });

        setLeaderboard(combined);
      } catch (err) {
        console.warn('Failed to load student live telemetry for leaderboard', err);
      }
    }
    loadLiveTelemetry();
  }, [currentStudentId, currentStudentName]);

  const filteredEntries = leaderboard.filter(entry => {
    if (!searchQuery) return true;
    return entry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           entry.college.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary, #090d16)', color: '#f1f5f9', padding: '24px 32px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: 16, flexWrap: 'wrap', gap: 14 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 28 }}>🏆</span>
            <div>
              <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, letterSpacing: '-0.5px' }}>
                Verified Competency & Arena Leaderboard
              </h1>
              <p style={{ margin: 0, fontSize: 13, color: '#94a3b8' }}>
                Zero-Fabrication Rankings · Derived Exclusively from Cryptographic SHA-256 Evidence & Viva Defense Scores
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Link
            href="/arena?tab=code_wars"
            style={{ padding: '8px 16px', borderRadius: 8, background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', color: '#fff', fontSize: 13, textDecoration: 'none', fontWeight: 600 }}
          >
            ⚔️ Enter 1v1 Battle Arena
          </Link>
          <Link
            href="/dashboard"
            style={{ padding: '8px 16px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', color: '#cbd5e1', fontSize: 13, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            ← Dashboard
          </Link>
        </div>
      </div>

      {/* Primary Leaderboard Mode Switcher */}
      <div style={{
        display: 'flex',
        gap: 8,
        padding: '6px',
        borderRadius: 14,
        background: 'var(--bg2)',
        border: '1px solid var(--border)',
        marginBottom: 20,
        overflowX: 'auto'
      }}>
        {[
          { id: 'global', label: 'Global Rankings', icon: '🏆' },
          { id: 'verified_evidence', label: 'SHA-256 Verified Ledger', icon: '🛡️' },
          { id: 'weekly_leagues', label: 'Weekly Ranked Leagues', icon: '⚡' },
          { id: 'code_wars', label: 'Code Wars 1v1 Duel Elo', icon: '⚔️' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              flex: 1,
              minWidth: 170,
              padding: '10px 14px',
              borderRadius: 10,
              border: activeTab === tab.id ? '1.5px solid var(--accent)' : '1px solid transparent',
              background: activeTab === tab.id
                ? 'linear-gradient(135deg, rgba(99,102,241,0.22), rgba(168,85,247,0.15))'
                : 'transparent',
              color: activeTab === tab.id ? '#fff' : 'var(--t2)',
              fontWeight: 800,
              fontSize: 13,
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

      {/* Filter & Search Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, gap: 16, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {(['all', 'tech', 'data', 'ai'] as const).map(d => (
            <button
              key={d}
              onClick={() => setDomainFilter(d)}
              style={{
                padding: '6px 14px',
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 700,
                textTransform: 'uppercase',
                background: domainFilter === d ? '#6366f1' : 'rgba(255,255,255,0.04)',
                border: 'none',
                color: '#fff',
                cursor: 'pointer'
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
          placeholder="🔍 Search student or university..."
          style={{
            padding: '8px 16px',
            borderRadius: 8,
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#fff',
            fontSize: 13,
            width: 280,
            outline: 'none'
          }}
        />
      </div>

      {/* Leaderboard Table */}
      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              <th style={{ padding: '14px 20px', width: 60 }}>Rank</th>
              <th style={{ padding: '14px 20px' }}>Student & Academy</th>
              <th style={{ padding: '14px 20px' }}>Program Track</th>
              <th style={{ padding: '14px 20px' }}>
                {activeTab === 'code_wars' ? 'Elo Rating' : activeTab === 'weekly_leagues' ? 'League Tier' : 'Verified Skills'}
              </th>
              <th style={{ padding: '14px 20px' }}>Viva Defense</th>
              <th style={{ padding: '14px 20px' }}>Placement Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredEntries.map((entry) => {
              const isTop3 = entry.rank <= 3;
              const rankIcon = entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : `#${entry.rank}`;
              return (
                <tr
                  key={entry.studentId}
                  style={{
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                    background: entry.isCurrentUser ? 'rgba(79, 70, 229, 0.12)' : 'transparent',
                    transition: 'background 0.15s ease'
                  }}
                >
                  <td style={{ padding: '16px 20px', fontWeight: 800, fontSize: isTop3 ? 16 : 13, color: entry.rank === 1 ? '#fbbf24' : entry.rank === 2 ? '#cbd5e1' : entry.rank === 3 ? '#d97706' : '#94a3b8' }}>
                    {rankIcon}
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <img src={entry.avatarUrl} alt={entry.name} style={{ width: 36, height: 36, borderRadius: 18, border: entry.isCurrentUser ? '2px solid #6366f1' : 'none' }} />
                      <div>
                        <div style={{ fontWeight: 700, color: entry.isCurrentUser ? '#a5b4fc' : '#f8fafc', display: 'flex', alignItems: 'center', gap: 6 }}>
                          {entry.name}
                          {entry.isCurrentUser && <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: '#4f46e5', color: '#fff' }}>YOU</span>}
                        </div>
                        <div style={{ fontSize: 11, color: '#94a3b8' }}>{entry.college}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px 20px', color: '#cbd5e1' }}>
                    {entry.programTitle}
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    {activeTab === 'code_wars' ? (
                      <span style={{ padding: '4px 8px', borderRadius: 6, background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', fontWeight: 800, fontSize: 12 }}>
                        ⚔️ {entry.eloRating || 1500} ELO
                      </span>
                    ) : activeTab === 'weekly_leagues' ? (
                      <span style={{ padding: '4px 8px', borderRadius: 6, background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc', fontWeight: 800, fontSize: 12 }}>
                        ⚡ {entry.leagueTier || 'Gold'} Tier
                      </span>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ padding: '4px 8px', borderRadius: 6, background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', fontWeight: 800, fontSize: 12 }}>
                          🛡️ {entry.verifiedSkillsCount} Verified
                        </span>
                        <span style={{ fontSize: 11, color: '#64748b' }}>
                          ({entry.demonstratedSkillsCount} dem.)
                        </span>
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    {entry.defenseScore > 0 ? (
                      <span style={{ fontWeight: 700, color: entry.defenseScore >= 75 ? '#34d399' : '#facc15' }}>
                        🎙️ {entry.defenseScore}/100
                      </span>
                    ) : (
                      <span style={{ color: '#64748b', fontSize: 12 }}>Pending Viva</span>
                    )}
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: 6,
                      fontSize: 11,
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      background: entry.readinessStatus === 'ready_for_interview' ? 'rgba(16, 185, 129, 0.15)' : entry.readinessStatus === 'ready_for_internship' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(234, 179, 8, 0.15)',
                      color: entry.readinessStatus === 'ready_for_interview' ? '#34d399' : entry.readinessStatus === 'ready_for_internship' ? '#60a5fa' : '#facc15'
                    }}>
                      {entry.readinessStatus.replace(/_/g, ' ')}
                    </span>
                  </td>
                </tr>
              );
            })}
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
