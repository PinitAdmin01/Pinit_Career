'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/context/AuthContext';
import { useCareerOS } from '@/lib/context/CareerOSContext';
import WhatToDoToday, { ActionProfile } from '@/components/ui/WhatToDoToday';
import {
  getSavedCareerProjects,
  isStudentEngagedProject,
  computeHonestProjectProgress,
} from '@/lib/projects/savedProjects';
import { DynamicRoleReadiness, StudentSkillProfile } from '@/lib/pathway/competencySchema';
import type { Project } from '@/lib/data/projectData';

const EVO_STAGES = [
  { stage: 1, icon: '1', name: 'Syntax Novice', minScore: 0, desc: 'Variables, loops & conditional logic' },
  { stage: 2, icon: '2', name: 'Algorithmic Solver', minScore: 21, desc: 'Data structures, complexity & OOP' },
  { stage: 3, icon: '3', name: 'Full Stack Developer', minScore: 41, desc: 'React, Node.js & relational schemas' },
  { stage: 4, icon: '4', name: 'Systems Architect', minScore: 61, desc: 'Microservices, caching & cloud pipelines' },
  { stage: 5, icon: '5', name: 'Placement Ready', minScore: 81, desc: 'Interview-cleared & high-scale ready' },
];

interface LiveArenaSummary {
  elo: number | null;
  rank: number | null;
  league: string | null;
  weeklyXp: number | null;
  careerXp: number | null;
  matchesPlayed: number;
  sprintEndsAt?: string | null;
  joined: boolean;
}

interface Props {
  careerScore: number;
  dnaScore: number;
  activeTrack: 'sde' | 'iot';
  contributionDates?: Date[];
  getContributionsForDate?: (date: Date) => number;
  activeStageIndex: number;
  learningMistakes?: any[];
  actionProfile?: ActionProfile | null;
  liveArena?: LiveArenaSummary | null;
  independentProjects?: Project[];
  activeEnrollment?: { planId?: string; track?: string } | null;
  skillProfile?: StudentSkillProfile | null;
  roleReadiness?: DynamicRoleReadiness | null;
}

function formatLeagueTitle(rawLeague: string | null | undefined): string {
  const map: Record<string, string> = {
    browns: 'Bronze',
    bronze: 'Bronze',
    silver: 'Silver',
    gold: 'Gold',
    platinum: 'Platinum',
    diamond: 'Diamond',
    ruby: 'Ruby',
  };
  const key = (rawLeague || 'browns').toLowerCase();
  return `${map[key] || 'Bronze'} League`;
}

export default function DashboardBentoGrid({
  careerScore = 0,
  dnaScore = 0,
  activeTrack,
  activeStageIndex = 0,
  learningMistakes = [],
  actionProfile,
  liveArena,
  independentProjects = [],
  activeEnrollment,
  skillProfile,
  roleReadiness,
}: Props) {
  const { user } = useAuth();
  const cOS = useCareerOS();
  const [hoveredAxis, setHoveredAxis] = useState<number | null>(null);
  const accentRgb = activeTrack === 'iot' ? '20,184,166' : '99,102,241';
  const accentVar = activeTrack === 'iot' ? 'var(--teal-mid, #14b8a6)' : 'var(--accent, #6366f1)';

  const hasChosenTrack = Boolean(
    activeEnrollment ||
    cOS?.roadmapGenerated ||
    (cOS?.onboardingAnswers as any)?.hasCompleted ||
    (user as any)?.targetRole ||
    (user as any)?.target_role
  );

  // Authentic 5-Axis Competencies Radar computation (0 across all axes until real work is verified)
  const radarAxes = useMemo(() => {
    const completedCount = cOS?.completedQuests?.length || 0;
    const vaultCount = cOS?.vaultItems?.length || 0;
    const verifiedSkills = skillProfile?.verified?.length || 0;
    const demoSkills = skillProfile?.demonstrated?.length || 0;
    const interviewsDone = Number(actionProfile?.interviews_done || 0);
    const hasActivity = careerScore > 0 || dnaScore > 0 || completedCount > 0 || vaultCount > 0 || verifiedSkills > 0 || demoSkills > 0 || interviewsDone > 0;

    const codingScore = careerScore > 0
      ? Math.min(100, Math.round(careerScore))
      : Math.min(100, completedCount * 15 + verifiedSkills * 12);

    const archScore = hasActivity
      ? Math.min(100, Math.round((careerScore * 0.65) + (dnaScore * 0.25) + (demoSkills * 6) + (vaultCount * 10)))
      : 0;

    const dataScore = dnaScore > 0
      ? Math.min(100, Math.round(dnaScore))
      : Math.min(100, completedCount * 10 + verifiedSkills * 8);

    const socraticScore = hasActivity
      ? Math.min(100, Math.round((interviewsDone * 20) + (careerScore * 0.5) + (cOS?.trustScore && careerScore > 0 ? cOS.trustScore * 0.3 : 0)))
      : 0;

    const iotScore = activeTrack === 'iot'
      ? Math.min(100, Math.round(careerScore > 0 ? careerScore : completedCount * 14))
      : Math.min(100, Math.round(careerScore * 0.5));

    return [
      { key: 'CODING', label: 'Coding', score: codingScore },
      { key: 'ARCH', label: 'Arch', score: archScore },
      { key: 'DATA', label: 'Data', score: dataScore },
      { key: 'SOCRATIC', label: 'Socratic', score: socraticScore },
      { key: 'IoT', label: 'IoT', score: iotScore },
    ];
  }, [careerScore, dnaScore, activeTrack, cOS?.completedQuests?.length, cOS?.vaultItems?.length, cOS?.trustScore, skillProfile, actionProfile?.interviews_done]);

  // Authentic trigonometric radar polygon calculation (Center 60,60, R=46)
  const radarGeometry = useMemo(() => {
    const angles = [0, 72, 144, 216, 288];
    const isCleanZero = radarAxes.every(a => a.score === 0);

    const vertices = radarAxes.map((axis, i) => {
      const clamped = isCleanZero ? 10 : Math.max(6, Math.min(100, axis.score || 0));
      const r = (clamped / 100) * 46;
      const rad = angles[i] * (Math.PI / 180);
      return {
        x: +(60 + r * Math.sin(rad)).toFixed(1),
        y: +(60 - r * Math.cos(rad)).toFixed(1),
      };
    });

    return {
      points: vertices.map(v => `${v.x},${v.y}`).join(' '),
      vertices,
      isCleanZero,
    };
  }, [radarAxes]);

  // Deterministic live countdown to next daily Arena cycle (local midnight)
  const [formattedCountdown, setFormattedCountdown] = useState('--:--:--');
  useEffect(() => {
    const computeRemaining = () => {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);
      const diffSec = Math.max(0, Math.floor((midnight.getTime() - now.getTime()) / 1000));
      const h = String(Math.floor(diffSec / 3600)).padStart(2, '0');
      const m = String(Math.floor((diffSec % 3600) / 60)).padStart(2, '0');
      const s = String(diffSec % 60).padStart(2, '0');
      setFormattedCountdown(`${h}:${m}:${s}`);
    };
    computeRemaining();
    const timer = setInterval(computeRemaining, 1000);
    return () => clearInterval(timer);
  }, []);

  // Honest Dynamic Arena Standing synced to /api/leaderboard + user profile
  const arenaStanding = useMemo(() => {
    const wins = Number((user as any)?.arena_wins ?? 0);
    const rawUserElo = liveArena?.elo ?? (user as any)?.arena_elo ?? (user as any)?.elo ?? (user as any)?.rating ?? 100;
    const sanitizedElo = rawUserElo === 1200 && wins === 0 ? 100 : Math.max(100, Math.round(rawUserElo));
    const matchesPlayed = liveArena?.matchesPlayed ?? Number((user as any)?.arena_matches ?? 0);
    const joined = Boolean(liveArena?.joined || matchesPlayed > 0 || sanitizedElo > 100);

    if (joined) {
      const leagueName = formatLeagueTitle(liveArena?.league || (user as any)?.league_tier);
      const rankStr = liveArena?.rank ? `#${liveArena.rank}` : '';
      return {
        tier: leagueName,
        rank: rankStr,
        elo: sanitizedElo,
        subtitle: `${matchesPlayed} ${matchesPlayed === 1 ? 'match' : 'matches'} played · ${sanitizedElo} ELO`,
        isRanked: true,
      };
    }

    return {
      tier: 'Unranked • Placement',
      rank: '100 ELO',
      elo: 100,
      subtitle: '0 matches played • Enter Arena to establish ranking',
      isRanked: false,
    };
  }, [liveArena, user]);

  // Dynamic Proof Vault status
  const vaultItems = useMemo(() => cOS?.vaultItems || [], [cOS?.vaultItems]);
  const hasVaultItems = vaultItems.length > 0;
  const verifiedCommitCount = useMemo(() => {
    return vaultItems.filter((v: any) => v.type === 'commit' || v.verified).length;
  }, [vaultItems]);

  // Merged Authentic Active & Independent Projects (strictly excludes untouched catalog templates; deduped by id)
  const savedProjects = useMemo(() => {
    const activeSaved = getSavedCareerProjects(cOS?.onboardingAnswers as any).filter((p) => isStudentEngagedProject(p));
    const list = Array.isArray(activeSaved) ? [...activeSaved] : [];
    const seenIds = new Set(list.map((p: any) => p?.id).filter(Boolean));
    for (const ip of independentProjects) {
      if (ip && ip.id && !seenIds.has(ip.id) && isStudentEngagedProject(ip)) {
        seenIds.add(ip.id);
        list.push(ip);
      }
    }
    return list;
  }, [cOS?.onboardingAnswers, independentProjects]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Row 1: Tactical Split — What to do today (Left 50%) + Competencies Radar (Right 50%) */}
      <div
        data-testid="dashboard-action-radar-row"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
          gap: 16,
          alignItems: 'stretch',
        }}
      >
        {/* Left Column: What to do today (Vertical) */}
        <div style={{ flex: '1 1 50%', minWidth: 320 }}>
          <WhatToDoToday profile={actionProfile} layout="vertical" />
        </div>

        {/* Right Column: Socratic Competencies Radar card */}
        <div
          data-testid="competencies-radar-card"
          className="db-glass"
          style={{
            padding: '20px 22px',
            borderRadius: 16,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            flex: '1 1 50%',
            minWidth: 320,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, marginBottom: 8 }}>
            <Link
              href="/mirror?tab=twin"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                textDecoration: 'none',
              }}
            >
              <div>
                <span className="db-label">SOCRATIC COMPETENCIES RADAR</span>
                <h3 style={{ fontSize: 15, fontWeight: 900, color: 'var(--dash-text, var(--t1))', margin: '2px 0 0', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>Multi-Dimensional Competency Matrix</span>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" style={{ color: 'var(--t3)' }}>
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </h3>
              </div>
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span
                className="db-tabular"
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: careerScore > 0 ? accentVar : 'var(--dash-subtext)',
                  background: careerScore > 0 ? `rgba(${accentRgb},0.12)` : 'var(--dash-subtle-bg)',
                  padding: '3px 8px',
                  borderRadius: 6,
                  border: `1px solid ${careerScore > 0 ? `rgba(${accentRgb},0.25)` : 'var(--dash-inner-border)'}`,
                }}
              >
                {careerScore > 0 ? `${Math.round(careerScore)}%` : 'Baseline'}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: 'var(--t3)', fontFamily: 'var(--font-mono)' }}>
                <span style={{ width: 7, height: 7, borderRadius: 2, background: hasChosenTrack ? accentVar : 'var(--t3)' }} />
                Track: <strong style={{ color: 'var(--dash-text, var(--t1))' }}>{hasChosenTrack ? (activeTrack === 'iot' ? 'IoT Embedded' : 'SDE Full-Stack') : 'Not Enrolled'}</strong>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, padding: '8px 0 4px' }}>
            <svg viewBox="0 0 120 120" style={{ width: 218, height: 204, overflow: 'visible' }}>
              {[0.25, 0.5, 0.75, 1.0].map((scale, i) => (
                <polygon
                  key={i}
                  points={[0, 72, 144, 216, 288].map(ang => {
                    const r = 46 * scale;
                    const rad = ang * (Math.PI / 180);
                    return `${+(60 + r * Math.sin(rad)).toFixed(1)},${+(60 - r * Math.cos(rad)).toFixed(1)}`;
                  }).join(' ')}
                  fill="none"
                  stroke="var(--dash-radar-grid, var(--border2))"
                  strokeWidth="0.8"
                />
              ))}
              {[0, 72, 144, 216, 288].map((ang, i) => {
                const rad = ang * (Math.PI / 180);
                const x2 = +(60 + 46 * Math.sin(rad)).toFixed(1);
                const y2 = +(60 - 46 * Math.cos(rad)).toFixed(1);
                return <line key={i} x1="60" y1="60" x2={x2} y2={y2} stroke="var(--dash-radar-grid, var(--border2))" strokeWidth="0.8" />;
              })}
              <polygon
                points={radarGeometry.points}
                fill={`rgba(${accentRgb},0.22)`}
                stroke={accentVar}
                strokeWidth="2"
                style={{ transition: 'all 0.4s ease' }}
              />
              {radarGeometry.vertices.map((pt, idx) => (
                <circle
                  key={idx}
                  cx={pt.x}
                  cy={pt.y}
                  r={hoveredAxis === idx ? 3.5 : 2.1}
                  fill={hoveredAxis === idx ? '#06b6d4' : accentVar}
                  stroke="var(--dash-card, #0f1524)"
                  strokeWidth="0.9"
                  style={{ transition: 'all 0.2s ease' }}
                />
              ))}
              <text x="60" y="6" fill={hoveredAxis === 0 ? accentVar : 'var(--dash-radar-label, #94a3b8)'} fontSize="6.5" fontWeight="800" fontFamily="var(--font-mono)" textAnchor="middle">CODING</text>
              <text x="112" y="44" fill={hoveredAxis === 1 ? accentVar : 'var(--dash-radar-label, #94a3b8)'} fontSize="6.5" fontWeight="800" fontFamily="var(--font-mono)" textAnchor="middle">ARCH</text>
              <text x="97" y="114" fill={hoveredAxis === 2 ? accentVar : 'var(--dash-radar-label, #94a3b8)'} fontSize="6.5" fontWeight="800" fontFamily="var(--font-mono)" textAnchor="middle">DATA</text>
              <text x="23" y="114" fill={hoveredAxis === 3 ? accentVar : 'var(--dash-radar-label, #94a3b8)'} fontSize="6.5" fontWeight="800" fontFamily="var(--font-mono)" textAnchor="middle">SOCRATIC</text>
              <text x="8" y="44" fill={hoveredAxis === 4 ? accentVar : 'var(--dash-radar-label, #94a3b8)'} fontSize="6.5" fontWeight="800" fontFamily="var(--font-mono)" textAnchor="middle">IoT</text>
            </svg>
          </div>

          {/* 5-Axis Interactive Numeric Telemetry Strip */}
          <div
            data-testid="radar-axis-telemetry"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
              gap: 6,
              paddingTop: 10,
              marginTop: 4,
              borderTop: '1px solid var(--dash-inner-border, var(--border))',
            }}
          >
            {radarAxes.map((axis, idx) => (
              <div
                key={axis.key}
                onMouseEnter={() => setHoveredAxis(idx)}
                onMouseLeave={() => setHoveredAxis(null)}
                style={{
                  textAlign: 'center',
                  padding: '5px 4px',
                  borderRadius: 8,
                  background: hoveredAxis === idx ? 'rgba(99,102,241,0.12)' : 'transparent',
                  cursor: 'default',
                  transition: 'background 0.15s ease',
                }}
              >
                <div style={{ fontSize: 10, color: 'var(--t3)', fontWeight: 600 }}>{axis.label}</div>
                <div className="db-tabular" style={{ fontSize: 12.5, fontWeight: 800, color: hoveredAxis === idx ? accentVar : 'var(--dash-text, var(--t1))', marginTop: 1 }}>
                  {axis.score}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Engineering Growth Track (Dead-level 5-column aligned timeline) */}
      <div className="db-glass" style={{ padding: '20px 24px', borderRadius: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
          <Link
            href="/career-builder"
            style={{
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <div>
              <span className="db-label">ENGINEERING GROWTH TRACK</span>
              <h3 style={{ fontSize: 15, fontWeight: 900, color: 'var(--dash-text, var(--t1))', margin: '2px 0 0', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>Engineering Growth Track</span>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" style={{ color: 'var(--t3)' }}>
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </h3>
            </div>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              className="db-tabular"
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: 'var(--accent-mid, var(--accent))',
                background: 'rgba(99,102,241,0.12)',
                padding: '3px 8px',
                borderRadius: 6,
                border: '1px solid rgba(99,102,241,0.24)',
              }}
            >
              {careerScore > 0 ? `${Math.round(careerScore)}%` : '0%'}
            </span>
            <div
              className="db-tabular"
              style={{
                fontSize: 12,
                color: 'var(--dash-subtext, var(--t2))',
                background: 'var(--dash-subtle-bg, var(--bg3))',
                padding: '4px 10px',
                borderRadius: 8,
                border: '1px solid var(--dash-inner-border, var(--border))',
              }}
            >
              Stage: <strong style={{ color: 'var(--accent-mid, var(--accent))' }}>{EVO_STAGES[activeStageIndex]?.name || 'Syntax Novice'}</strong> &middot; Level {activeStageIndex + 1} of 5
            </div>
          </div>
        </div>

        <div style={{ overflowX: 'auto', padding: '4px 2px 6px' }}>
          <div
            style={{
              minWidth: 560,
              display: 'grid',
              gridTemplateColumns: 'repeat(5, minmax(108px, 1fr))',
              gap: 8,
              position: 'relative',
              alignItems: 'start',
            }}
          >
            {/* Base Track line locked to exact vertical center of 38px circle (top: 19px) */}
            <div
              style={{
                position: 'absolute',
                top: 19,
                left: '10%',
                right: '10%',
                height: 3,
                transform: 'translateY(-50%)',
                background: 'var(--dash-rail-bg, var(--border2))',
                zIndex: 0,
                borderRadius: 999,
              }}
            />
            {/* Active Progress line: 0% if careerScore === 0 */}
            <div
              style={{
                position: 'absolute',
                top: 19,
                left: '10%',
                width: careerScore > 0 ? `${Math.min(80, Math.max(4, activeStageIndex * 20))}%` : '0%',
                height: 3,
                transform: 'translateY(-50%)',
                background: 'linear-gradient(90deg, #06b6d4, #10b981)',
                zIndex: 0,
                transition: 'width 0.6s ease',
                boxShadow: careerScore > 0 ? '0 0 10px rgba(6,182,212,0.5)' : 'none',
                borderRadius: 999,
              }}
            />

            {EVO_STAGES.map((step, idx) => {
              const isCompleted = careerScore > 0 && idx < activeStageIndex;
              const isCurrent = idx === (careerScore > 0 ? activeStageIndex : 0);

              return (
                <div key={step.stage} style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '0 4px' }}>
                  <div
                    className="db-tabular"
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: '50%',
                      background: isCurrent && careerScore > 0
                        ? 'linear-gradient(135deg, #06b6d4, #6366f1)'
                        : isCompleted
                        ? 'rgba(16, 185, 129, 0.16)'
                        : 'var(--dash-card, var(--bg3))',
                      border: `2px solid ${isCurrent && careerScore > 0 ? '#06b6d4' : isCompleted ? '#10b981' : isCurrent ? 'var(--accent)' : 'var(--dash-border-strong, var(--border))'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 13.5,
                      fontWeight: 900,
                      color: isCurrent && careerScore > 0 ? '#ffffff' : isCompleted ? '#10b981' : isCurrent ? 'var(--accent-mid, var(--accent))' : 'var(--t3)',
                      boxShadow: isCurrent && careerScore > 0 ? '0 0 18px rgba(6,182,212,0.55)' : 'none',
                      transition: 'all 0.25s ease',
                    }}
                  >
                    {isCompleted ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      step.icon
                    )}
                  </div>
                  <div
                    style={{
                      fontSize: 11.5,
                      fontWeight: isCurrent ? 800 : isCompleted ? 700 : 500,
                      color: isCurrent ? (careerScore > 0 ? '#06b6d4' : 'var(--dash-text, var(--t1))') : isCompleted ? 'var(--dash-text, var(--t1))' : 'var(--t3)',
                      marginTop: 8,
                      lineHeight: 1.25,
                      whiteSpace: 'normal',
                    }}
                  >
                    {step.name}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--t3)', marginTop: 3, display: isCurrent ? 'block' : 'none', maxWidth: 130, lineHeight: 1.3 }}>
                    {step.desc}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <p style={{ fontSize: 11.5, color: 'var(--t3)', margin: '8px 0 0', lineHeight: 1.5 }}>
          Clear coding quests, pass lab experiments, verify vault credentials, and pass mock interviews to advance toward Placement Ready.
        </p>
      </div>

      {/* Row 3: Arena & League Telemetry (50%) + Proof Vault & Credentials (50%) */}
      <div
        data-testid="dashboard-telemetry-row"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
          gap: 16,
          alignItems: 'stretch',
        }}
      >
        {/* Left (50%): Arena & League Telemetry */}
        <div className="db-glass" style={{ padding: '20px 22px', borderRadius: 16, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <Link
              href="/arena"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                textDecoration: 'none',
              }}
            >
              <div>
                <span className="db-label">CHALLENGING ARENA &amp; LEAGUES</span>
                <h3 style={{ fontSize: 15, fontWeight: 900, color: 'var(--dash-text, var(--t1))', margin: '2px 0 0', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>Arena &amp; League Telemetry</span>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" style={{ color: 'var(--t3)' }}>
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </h3>
              </div>
            </Link>
            <span
              className="db-tabular"
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: '#06b6d4',
                background: 'rgba(6,182,212,0.12)',
                padding: '3px 9px',
                borderRadius: 7,
                border: '1px solid rgba(6,182,212,0.28)',
              }}
            >
              {arenaStanding.isRanked ? `${arenaStanding.elo} ELO` : 'Placement'}
            </span>
          </div>

          <Link
            href="/arena"
            className="db-well db-well-interactive"
            style={{
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 16px',
              gap: 12,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
              <div style={{
                width: 44,
                height: 44,
                borderRadius: 11,
                background: 'rgba(6,182,212,0.12)',
                border: '1px solid rgba(6,182,212,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"/>
                  <line x1="13" y1="19" x2="19" y2="13"/>
                  <line x1="16" y1="16" x2="20" y2="20"/>
                  <line x1="19" y1="21" x2="21" y2="19"/>
                  <polyline points="14.5 6.5 18 3 21 3 21 6 17.5 9.5"/>
                  <line x1="5" y1="14" x2="9" y2="18"/>
                  <line x1="7" y1="17" x2="4" y2="20"/>
                  <line x1="3" y1="19" x2="5" y2="21"/>
                </svg>
              </div>
              <div style={{ minWidth: 0 }}>
                <p style={{ fontSize: 14, fontWeight: 900, color: 'var(--dash-text, var(--t1))', margin: 0, fontFamily: 'var(--font-display)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {arenaStanding.tier} {arenaStanding.isRanked ? arenaStanding.rank : ''}
                </p>
                <p style={{ fontSize: 11.5, color: 'var(--t3)', margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {arenaStanding.subtitle}
                </p>
              </div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <span className="db-tabular" style={{ fontSize: 10, textTransform: 'uppercase', color: 'var(--t3)', letterSpacing: 0.6, fontWeight: 700 }}>Next Cycle</span>
              <p className="db-tabular" style={{ fontSize: 15, fontWeight: 900, color: '#06b6d4', margin: '2px 0 0' }}>
                {formattedCountdown}
              </p>
            </div>
          </Link>
        </div>

        {/* Right (50%): Proof Vault & Verified Credentials */}
        <div className="db-glass" style={{ padding: '20px 22px', borderRadius: 16, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <Link
              href="/vault"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                textDecoration: 'none',
              }}
            >
              <div>
                <span className="db-label">PROOF VAULT &amp; CREDENTIALS</span>
                <h3 style={{ fontSize: 15, fontWeight: 900, color: 'var(--dash-text, var(--t1))', margin: '2px 0 0', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>Proof Vault &amp; Verified Credentials</span>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" style={{ color: 'var(--t3)' }}>
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </h3>
              </div>
            </Link>
            <span
              className="db-tabular"
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: '#10b981',
                background: 'rgba(16,185,129,0.12)',
                padding: '3px 9px',
                borderRadius: 7,
                border: '1px solid rgba(16,185,129,0.26)',
              }}
            >
              {vaultItems.length} of 3 Minted
            </span>
          </div>

          <Link
            href="/vault"
            className="db-well db-well-interactive"
            style={{
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '13px 16px',
              flexWrap: 'wrap',
              gap: 14,
            }}
          >
            {/* 3 Labeled Credential Slots (SVG Icons, No Emojis) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {/* Slot 1: Capstone Credential */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 10,
                    background: hasVaultItems ? 'rgba(16, 185, 129, 0.16)' : 'var(--dash-card)',
                    border: hasVaultItems ? '1.5px solid rgba(16, 185, 129, 0.5)' : '1.5px dashed var(--dash-border-strong, var(--border2))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  title="Capstone Credential"
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={hasVaultItems ? '#10b981' : 'var(--t3)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                  </svg>
                </div>
                <span className="db-tabular" style={{ fontSize: 10, fontWeight: 700, color: hasVaultItems ? 'var(--dash-text)' : 'var(--t3)' }}>Capstone</span>
              </div>

              {/* Slot 2: Cryptographic Badge */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 10,
                    background: vaultItems.length > 1 ? 'rgba(6, 182, 212, 0.16)' : 'var(--dash-card)',
                    border: vaultItems.length > 1 ? '1.5px solid rgba(6, 182, 212, 0.5)' : '1.5px dashed var(--dash-border-strong, var(--border2))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  title="Cryptographic SHA-256 Badge"
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={vaultItems.length > 1 ? '#06b6d4' : 'var(--t3)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </div>
                <span className="db-tabular" style={{ fontSize: 10, fontWeight: 700, color: vaultItems.length > 1 ? 'var(--dash-text)' : 'var(--t3)' }}>SHA-256</span>
              </div>

              {/* Slot 3: Git Verified Commit */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 10,
                    background: vaultItems.length > 2 ? 'rgba(99, 102, 241, 0.16)' : 'var(--dash-card)',
                    border: vaultItems.length > 2 ? '1.5px solid rgba(99, 102, 241, 0.5)' : '1.5px dashed var(--dash-border-strong, var(--border2))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  title="Verified Git Commit Proof"
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={vaultItems.length > 2 ? '#6366f1' : 'var(--t3)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="4"/>
                    <line x1="1.05" y1="12" x2="7" y2="12"/>
                    <line x1="17.01" y1="12" x2="22.96" y2="12"/>
                  </svg>
                </div>
                <span className="db-tabular" style={{ fontSize: 10, fontWeight: 700, color: vaultItems.length > 2 ? 'var(--dash-text)' : 'var(--t3)' }}>Git Proof</span>
              </div>
            </div>

            {/* Vector Checklist Indicators (Zero unicode bullets) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 700, color: 'var(--dash-text, var(--t1))' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={hasVaultItems ? '#10b981' : 'var(--t3)'} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9" />
                  {hasVaultItems ? <polyline points="9 12 11 14 15 10" /> : null}
                </svg>
                <span>Cryptographic badges ({vaultItems.length}/1)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 700, color: 'var(--dash-text, var(--t1))' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={verifiedCommitCount > 0 ? '#10b981' : 'var(--t3)'} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9" />
                  {verifiedCommitCount > 0 ? <polyline points="9 12 11 14 15 10" /> : null}
                </svg>
                <span>Verified Git commits ({verifiedCommitCount} verified)</span>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Row 4: Active & Capstone Projects (100% Full Width, Dynamic & Empty State) */}
      <div className="db-glass" style={{ padding: '20px 24px', borderRadius: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, marginBottom: 14 }}>
          <Link
            href="/projects"
            style={{
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <div>
              <span className="db-label">ACTIVE &amp; CAPSTONE PROJECTS</span>
              <h3 style={{ fontSize: 15, fontWeight: 900, color: 'var(--dash-text, var(--t1))', margin: '2px 0 0', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>Active &amp; Capstone Projects</span>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" style={{ color: 'var(--t3)' }}>
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </h3>
            </div>
          </Link>
          <Link href="/projects" style={{ fontSize: 12, color: 'var(--accent-mid, var(--accent))', textDecoration: 'none', fontWeight: 700 }}>
            + New Project Workspace &rarr;
          </Link>
        </div>

        {/* Dynamic Project Display: Empty State or Active Projects */}
        {savedProjects.length === 0 ? (
          <div
            className="db-well"
            style={{
              padding: '22px 20px',
              borderRadius: 12,
              border: '1.5px dashed var(--dash-border-accent, rgba(99, 102, 241, 0.35))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 16,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{
                width: 44,
                height: 44,
                borderRadius: 11,
                background: 'rgba(99, 102, 241, 0.12)',
                border: '1px solid rgba(99, 102, 241, 0.28)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="var(--accent-mid, var(--accent))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 800, color: 'var(--dash-text, var(--t1))', margin: 0, fontFamily: 'var(--font-display)' }}>
                  No Active Project Workspaces
                </p>
                <p style={{ fontSize: 12, color: 'var(--dash-subtext, var(--t3))', margin: '3px 0 0', maxWidth: 540, lineHeight: 1.45 }}>
                  You have not initialized a capstone repository yet. Select from our industry-grade architecture blueprints or link your GitHub repo to start building proof of work.
                </p>
              </div>
            </div>
            <Link
              href="/projects"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '9px 18px',
                borderRadius: 9,
                background: 'rgba(99, 102, 241, 0.14)',
                border: '1px solid rgba(99, 102, 241, 0.34)',
                color: 'var(--accent-mid, var(--accent))',
                fontSize: 12.5,
                fontWeight: 700,
                textDecoration: 'none',
                fontFamily: 'var(--font-display)',
                transition: 'all 0.18s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--accent)';
                e.currentTarget.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(99, 102, 241, 0.14)';
                e.currentTarget.style.color = 'var(--accent-mid, var(--accent))';
              }}
            >
              + Initialize Project Workspace &rarr;
            </Link>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))',
              gap: 12,
            }}
          >
            {savedProjects.map((p: any) => {
              const progressVal = computeHonestProjectProgress(p);
              const stackSubtitle = p.category
                || (Array.isArray(p.techStack)
                  ? p.techStack.slice(0, 2).join(' · ')
                  : typeof p.techStack === 'string' && p.techStack.trim()
                    ? p.techStack.split(',').map((s: string) => s.trim()).filter(Boolean).slice(0, 2).join(' · ')
                    : (p.level || 'Project Workspace'));
              return (
                <Link
                  key={p.id}
                  href="/projects"
                  className="db-well db-well-interactive"
                  style={{
                    textDecoration: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '15px 16px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                      <svg style={{ width: 17, height: 17, fill: 'var(--dash-text, var(--t1))', flexShrink: 0 }} viewBox="0 0 24 24">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                      </svg>
                      <span style={{ fontSize: 13.5, fontWeight: 800, color: 'var(--dash-text, var(--t1))', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {p.name || p.title || 'Capstone Project'}
                      </span>
                    </div>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" style={{ color: 'var(--t3)', flexShrink: 0 }}>
                      <line x1="7" y1="17" x2="17" y2="7" />
                      <polyline points="7 7 17 7 17 17" />
                    </svg>
                  </div>

                  <div>
                    <div className="db-tabular" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, color: 'var(--t3)', marginBottom: 6 }}>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '75%' }}>
                        {stackSubtitle}
                      </span>
                      <span style={{ color: 'var(--accent-mid, var(--accent))', fontWeight: 700 }}>{progressVal}%</span>
                    </div>
                    <div style={{ width: '100%', height: 5, background: 'var(--dash-rail-bg, var(--border))', borderRadius: 999, overflow: 'hidden' }}>
                      <div style={{ width: `${progressVal}%`, height: '100%', background: 'linear-gradient(90deg, #06b6d4, #6366f1)', borderRadius: 999 }} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Row 5: AI Mistakes widget (if present) */}
      {learningMistakes.length > 0 && (
        <div className="db-glass" style={{ padding: '20px 24px', borderRadius: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, marginBottom: 14 }}>
            <div>
              <span className="db-label" style={{ color: 'var(--coral-mid, #f87171)' }}>AI MISTAKES &amp; REMEDIATION</span>
              <h3 style={{ fontSize: 15, fontWeight: 900, color: 'var(--dash-text, var(--t1))', margin: '2px 0 0', fontFamily: 'var(--font-display)' }}>Unresolved Knowledge Gaps</h3>
            </div>
            <Link
              href="/mirror?tab=twin"
              className="db-tabular"
              style={{
                fontSize: 11.5,
                fontWeight: 700,
                color: 'var(--coral-mid, #f87171)',
                background: 'var(--coral-light, rgba(220,38,38,0.12))',
                border: '1px solid rgba(220,38,38,0.28)',
                padding: '4px 10px',
                borderRadius: 7,
                textDecoration: 'none',
              }}
            >
              {learningMistakes.length} active · Remediate &rarr;
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: 10 }}>
            {learningMistakes.slice(0, 4).map((m: any) => (
              <Link
                key={m.id}
                href="/mirror?tab=twin"
                className="db-well db-well-interactive"
                style={{
                  textDecoration: 'none',
                  display: 'flex',
                  gap: 10,
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '11px 14px',
                }}
              >
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', minWidth: 0, flex: 1 }}>
                  <span className="db-tabular" style={{ fontSize: 10.5, background: 'var(--coral-light)', color: 'var(--coral-mid)', padding: '2px 6px', borderRadius: 5, fontWeight: 800, textTransform: 'uppercase', flexShrink: 0, marginTop: 1 }}>
                    {m.type}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--dash-text, var(--t1))', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.module}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--dash-subtext, var(--t2))', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 2 }}>{m.description}</div>
                  </div>
                </div>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" style={{ color: 'var(--t3)', flexShrink: 0 }}>
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
