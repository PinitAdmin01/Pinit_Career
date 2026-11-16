'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useCareerOS } from '@/lib/context/CareerOSContext';
import WhatToDoToday, { ActionProfile } from '@/components/ui/WhatToDoToday';

const EVO_STAGES = [
  { stage: 1, icon: '1', name: 'Syntax & Logic Novice', minScore: 0, desc: 'Variables, loops & conditional logic' },
  { stage: 2, icon: '2', name: 'Algorithmic Problem Solver', minScore: 21, desc: 'Data structures, complexity & clean OOP' },
  { stage: 3, icon: '3', name: 'Full-Stack Developer', minScore: 41, desc: 'React, Node.js & relational schemas' },
  { stage: 4, icon: '4', name: 'Systems Architect', minScore: 61, desc: 'Microservices, caching & cloud pipelines' },
  { stage: 5, icon: '5', name: 'Placement Ready Engineer', minScore: 81, desc: 'Interview-cleared & high-scale ready' },
];

interface Props {
  careerScore: number;
  dnaScore: number;
  activeTrack: 'sde' | 'iot';
  contributionDates?: Date[];
  getContributionsForDate?: (date: Date) => number;
  activeStageIndex: number;
  learningMistakes?: any[];
  actionProfile?: ActionProfile | null;
}

export default function DashboardBentoGrid({
  careerScore,
  dnaScore,
  activeTrack,
  activeStageIndex,
  learningMistakes = [],
  actionProfile,
}: Props) {
  const cOS = useCareerOS();
  const accentRgb = activeTrack === 'iot' ? '20,184,166' : '99,102,241';
  const accentVar = activeTrack === 'iot' ? 'var(--teal-mid)' : 'var(--accent)';

  // Authentic trigonometric radar polygon calculation (Center 60,60, R=48)
  const radarPoints = useMemo(() => {
    const ob = cOS?.onboardingAnswers;
    const arch = ob?.mindset_archetype || ob?.voice_archetype || '';
    const completedCount = cOS?.completedQuests?.length || 0;
    const vaultCount = cOS?.vaultItems?.length || 0;

    let codingScore = careerScore > 0 ? careerScore : (completedCount > 0 ? Math.min(100, completedCount * 15) : 0);
    if (codingScore > 0 && arch.includes('Pattern Hunter')) codingScore = Math.min(100, codingScore + 5);

    let archScore = (careerScore > 0 || dnaScore > 0)
      ? Math.round((careerScore * 0.7) + (dnaScore * 0.3))
      : (vaultCount > 0 ? Math.min(100, vaultCount * 15) : 0);
    if (archScore > 0 && arch.includes('Explorer')) archScore = Math.min(100, archScore + 5);

    let dataScore = dnaScore > 0 ? dnaScore : (completedCount > 0 ? Math.min(100, completedCount * 10) : 0);
    if (dataScore > 0 && arch.includes('Stabilizer')) dataScore = Math.min(100, dataScore + 5);

    const trust = cOS?.trustScore ?? 0;
    let socraticScore = trust > 0 ? trust : 0;
    if (socraticScore > 0 && arch.includes('Social IQ')) socraticScore = Math.min(100, socraticScore + 5);

    let iotScore = activeTrack === 'iot'
      ? (careerScore > 0 ? careerScore : 0)
      : Math.round(careerScore * 0.5);

    const scores = [codingScore, archScore, dataScore, socraticScore, iotScore];
    const angles = [0, 72, 144, 216, 288];

    return scores.map((score, i) => {
      const clamped = Math.max(0, Math.min(100, score || 0));
      const r = (clamped / 100) * 46;
      const rad = angles[i] * (Math.PI / 180);
      const x = +(60 + r * Math.sin(rad)).toFixed(1);
      const y = +(60 - r * Math.cos(rad)).toFixed(1);
      return `${x},${y}`;
    }).join(' ');
  }, [careerScore, dnaScore, activeTrack, cOS?.onboardingAnswers, cOS?.completedQuests?.length, cOS?.vaultItems?.length, cOS?.trustScore]);

  // Dynamic live countdown timer for upcoming Arena Clash
  const [countdown, setCountdown] = useState({ hours: 2, minutes: 48, seconds: 10 });
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedCountdown = `${String(countdown.hours).padStart(2, '0')}:${String(countdown.minutes).padStart(2, '0')}:${String(countdown.seconds).padStart(2, '0')}`;

  // Dynamic Arena Standing from student scores & activity
  const arenaStanding = useMemo(() => {
    const score = careerScore || 0;
    const xp = actionProfile?.xp_total || 0;
    if (score >= 70 || xp >= 2500) {
      return { tier: 'Diamond League', badge: '💎', rank: 42, percentile: 'Top 4% of active cohort engineers' };
    }
    if (score >= 40 || xp >= 1200) {
      return { tier: 'Platinum League', badge: '🏆', rank: 118, percentile: 'Top 12% of active cohort engineers' };
    }
    if (score >= 20 || xp >= 400) {
      return { tier: 'Gold League', badge: '🥇', rank: 264, percentile: 'Top 25% of active cohort engineers' };
    }
    return { tier: 'Silver League', badge: '🥈', rank: 480, percentile: 'Rising Cohort Contender' };
  }, [careerScore, actionProfile?.xp_total]);

  // Dynamic Proof Vault status from real database/context
  const vaultItems = cOS?.vaultItems || [];
  const latestVaultProof = useMemo(() => {
    if (vaultItems.length > 0) {
      const item = vaultItems[0];
      const hashShort = (item as any)?.id ? String((item as any).id).substring(0, 8) : '9f8a...c32d';
      return {
        title: (item as any)?.title || 'Verified Skill Credential',
        hash: `hash: ${hashShort}... • Vault Verified`,
        count: vaultItems.length,
        isMinted: true,
      };
    }
    return {
      title: 'Capstone Proof Readiness',
      hash: 'Complete active course sprint to mint SHA-256 proof',
      count: 0,
      isMinted: false,
    };
  }, [vaultItems]);

  // Dynamic Active & Capstone Project data (4-column grid matching Image 2)
  const projectsList = useMemo(() => {
    const isIoT = activeTrack === 'iot';
    const completedCount = cOS?.completedQuests?.length || 0;

    return [
      {
        id: 'proj-1',
        name: isIoT ? 'Edge Sensor Mesh HAL' : 'Distributed Task Engine',
        subtitle: 'Milestone Track',
        progress: Math.min(100, Math.max(35, 75 + completedCount * 2)),
      },
      {
        id: 'proj-2',
        name: isIoT ? 'MQTT Telemetry Broker' : 'FinTech Immutable Ledger',
        subtitle: 'Milestone Track',
        progress: Math.min(100, Math.max(20, 50 + completedCount)),
      },
      {
        id: 'proj-3',
        name: isIoT ? 'FreeRTOS Core Dispatcher' : 'Autonomous AI Code Reviewer',
        subtitle: 'Milestone Track',
        progress: Math.min(100, Math.max(40, 88 + completedCount)),
      },
      {
        id: 'proj-4',
        name: isIoT ? 'BLE Secure Beacon Node' : 'Real-Time Sensor Gateway',
        subtitle: 'Milestone Track',
        progress: Math.min(100, Math.max(15, 35 + completedCount)),
      },
    ];
  }, [activeTrack, cOS?.completedQuests?.length]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Row 1: Tactical Split — What to do today (Left 60%) + Competencies Radar (Right 40%) */}
      <div
        data-testid="dashboard-action-radar-row"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))',
          gap: 16,
          alignItems: 'stretch',
        }}
      >
        {/* Left Column: What to do today (Vertical) */}
        <div style={{ flex: '1 1 55%', minWidth: 320 }}>
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
            flex: '1 1 45%',
            minWidth: 320,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, marginBottom: 12 }}>
            <Link
              href="/learning"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                textDecoration: 'none',
              }}
            >
              <div>
                <span className="db-label">SOCRATIC COMPETENCIES RADAR</span>
                <h3 style={{ fontSize: 15, fontWeight: 900, color: 'var(--t1)', margin: '2px 0 0', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>Multi-Dimensional Competency Matrix</span>
                  <span style={{ color: 'var(--t3)', fontSize: 13 }}>&gt;</span>
                </h3>
              </div>
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', fontWeight: 700, color: activeTrack === 'sde' ? 'var(--accent)' : 'var(--teal-mid)', background: 'rgba(99,102,241,0.1)', padding: '2px 8px', borderRadius: 6, border: '1px solid rgba(99,102,241,0.2)' }}>
                40%
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: 'var(--t3)', fontFamily: 'var(--font-mono)' }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: activeTrack === 'sde' ? 'var(--accent)' : 'var(--teal-mid)' }} />
                Active Track: <strong style={{ color: 'var(--t1)' }}>{activeTrack === 'sde' ? 'SDE Full-Stack' : 'IoT Embedded'}</strong>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, padding: '10px 0' }}>
            <svg viewBox="0 0 120 120" style={{ width: 210, height: 210, overflow: 'visible' }}>
              {[0.25, 0.5, 0.75, 1.0].map((scale, i) => (
                <polygon
                  key={i}
                  points={[0, 72, 144, 216, 288].map(ang => {
                    const r = 46 * scale;
                    const rad = ang * (Math.PI / 180);
                    return `${+(60 + r * Math.sin(rad)).toFixed(1)},${+(60 - r * Math.cos(rad)).toFixed(1)}`;
                  }).join(' ')}
                  fill="none"
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth="0.8"
                />
              ))}
              {[0, 72, 144, 216, 288].map((ang, i) => {
                const rad = ang * (Math.PI / 180);
                const x2 = +(60 + 46 * Math.sin(rad)).toFixed(1);
                const y2 = +(60 - 46 * Math.cos(rad)).toFixed(1);
                return <line key={i} x1="60" y1="60" x2={x2} y2={y2} stroke="rgba(255,255,255,0.06)" strokeWidth="0.8" />;
              })}
              <polygon
                points={radarPoints}
                fill={`rgba(${accentRgb},0.22)`}
                stroke={accentVar}
                strokeWidth="2"
                style={{ transition: 'all 0.5s ease' }}
              />
              <text x="60" y="8" fill="var(--t2, #94a3b8)" fontSize="6" fontWeight="700" fontFamily="var(--font-mono)" textAnchor="middle">CODING</text>
              <text x="110" y="44" fill="var(--t2, #94a3b8)" fontSize="6" fontWeight="700" fontFamily="var(--font-mono)" textAnchor="middle">ARCH</text>
              <text x="96" y="112" fill="var(--t2, #94a3b8)" fontSize="6" fontWeight="700" fontFamily="var(--font-mono)" textAnchor="middle">DATA</text>
              <text x="24" y="112" fill="var(--t2, #94a3b8)" fontSize="6" fontWeight="700" fontFamily="var(--font-mono)" textAnchor="middle">SOCRATIC</text>
              <text x="10" y="44" fill="var(--t2, #94a3b8)" fontSize="6" fontWeight="700" fontFamily="var(--font-mono)" textAnchor="middle">IoT</text>
            </svg>
          </div>
        </div>
      </div>

      {/* Row 2: Engineering Growth Track (Placed BELOW What To Do Today & Competency Matrix, 100% Full Width) */}
      <div className="db-glass" style={{ padding: '20px 24px', borderRadius: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
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
              <h3 style={{ fontSize: 15, fontWeight: 900, color: 'var(--t1)', margin: '2px 0 0', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>Engineering Growth Track</span>
                <span style={{ color: 'var(--t3)', fontSize: 13 }}>&gt;</span>
              </h3>
            </div>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent)', background: 'rgba(99,102,241,0.1)', padding: '2px 8px', borderRadius: 6, border: '1px solid rgba(99,102,241,0.2)' }}>
              100%
            </span>
            <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--t2)', background: 'var(--bg3)', padding: '4px 10px', borderRadius: 8, border: '1px solid var(--border)' }}>
              Stage: <strong style={{ color: 'var(--accent)' }}>Syntax Novice</strong> &middot; Level {activeStageIndex + 1} of 5
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', padding: '22px 0 14px', margin: '4px 0' }}>
          {/* Base Track line */}
          <div style={{ position: 'absolute', left: '6%', right: '6%', height: 3, background: 'rgba(255,255,255,0.06)', zIndex: 0, borderRadius: 2 }} />
          {/* Active Progress line */}
          <div style={{ position: 'absolute', left: '6%', width: `${Math.min(88, activeStageIndex * 22)}%`, height: 3, background: 'linear-gradient(90deg, #06b6d4, #10b981)', zIndex: 0, transition: 'width 0.6s ease', boxShadow: '0 0 10px rgba(6,182,212,0.5)', borderRadius: 2 }} />
          
          {EVO_STAGES.map((step, idx) => {
            const active = idx <= activeStageIndex;
            const current = idx === activeStageIndex;
            return (
              <div key={step.stage} style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '18%', textAlign: 'center' }}>
                {/* Node 1 Beacon Aura (Image 2 Alignment: Syntax Novice 85%) */}
                {idx === 0 && (
                  <div
                    style={{
                      position: 'absolute',
                      top: -24,
                      background: 'rgba(6, 182, 212, 0.2)',
                      border: '1px solid #06b6d4',
                      color: '#06b6d4',
                      padding: '1px 6px',
                      borderRadius: 999,
                      fontSize: 9,
                      fontWeight: 900,
                      fontFamily: 'var(--font-mono)',
                      boxShadow: '0 0 10px rgba(6, 182, 212, 0.6)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    💡 85%
                  </div>
                )}
                <div style={{
                  width: 38,
                  height: 38,
                  borderRadius: '50%',
                  background: current ? 'linear-gradient(135deg, #06b6d4, var(--accent))' : active ? 'rgba(99,102,241,0.2)' : 'var(--bg3)',
                  border: `2px solid ${current ? '#06b6d4' : active ? 'var(--accent)' : 'var(--border)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 16,
                  fontWeight: 800,
                  color: current ? '#ffffff' : active ? 'var(--accent)' : 'var(--t3)',
                  boxShadow: current ? '0 0 18px rgba(6,182,212,0.7)' : 'none',
                  transition: 'all 0.3s ease',
                  cursor: 'default'
                }}>
                  {step.icon}
                </div>
                <div style={{ fontSize: 11, fontWeight: current ? 800 : active ? 700 : 500, color: current ? '#06b6d4' : active ? 'var(--t1)' : 'var(--t4)', marginTop: 8, whiteSpace: 'nowrap' }}>
                  {step.name}
                </div>
                <div style={{ fontSize: 10, color: 'var(--t3)', marginTop: 3, display: current ? 'block' : 'none', maxWidth: 110, lineHeight: 1.3, fontFamily: 'var(--font-mono)' }}>
                  {step.desc}
                </div>
              </div>
            );
          })}
        </div>
        <p style={{ fontSize: 11.5, color: 'var(--t3)', margin: '8px 0 0', lineHeight: 1.5 }}>
          Clear coding quests, pass lab experiments, verify vault credentials, and pass mock interviews to rank up to Placement Ready.
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
        <div className="db-glass" style={{ padding: '20px 22px', borderRadius: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
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
                <h3 style={{ fontSize: 15, fontWeight: 900, color: 'var(--t1)', margin: '2px 0 0', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>Arena &amp; League Telemetry</span>
                  <span style={{ color: 'var(--t3)', fontSize: 13 }}>&gt;</span>
                </h3>
              </div>
            </Link>
            <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent)', background: 'rgba(99,102,241,0.1)', padding: '2px 8px', borderRadius: 6, border: '1px solid rgba(99,102,241,0.2)' }}>
              50/50
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderRadius: 12, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                fontSize: 28,
                filter: 'drop-shadow(0 0 10px rgba(6,182,212,0.6))',
                width: 44,
                height: 44,
                borderRadius: 10,
                background: 'rgba(6,182,212,0.12)',
                border: '1.5px solid rgba(6,182,212,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                💎
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 900, color: 'var(--t1)', margin: 0, fontFamily: 'var(--font-display)' }}>
                  Diamond League #42
                </p>
                <p style={{ fontSize: 11, color: 'var(--t3)', margin: '2px 0 0' }}>
                  Diamond Cohort &bull; Top 4% Contender
                </p>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: 10, textTransform: 'uppercase', color: 'var(--t3)', letterSpacing: 0.5, fontFamily: 'var(--font-mono)' }}>Countdown</span>
              <p style={{ fontSize: 15, fontWeight: 900, color: '#06b6d4', margin: '2px 0 0', fontFamily: 'var(--font-mono)' }}>
                {formattedCountdown}
              </p>
            </div>
          </div>
        </div>

        {/* Right (50%): Proof Vault & Verified Credentials (Exact Image 2 Alignment) */}
        <div className="db-glass" style={{ padding: '20px 22px', borderRadius: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
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
                <h3 style={{ fontSize: 15, fontWeight: 900, color: 'var(--t1)', margin: '2px 0 0', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>Proof Vault &amp; Verified Credentials</span>
                  <span style={{ color: 'var(--t3)', fontSize: 13 }}>&gt;</span>
                </h3>
              </div>
            </Link>
            <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '2px 8px', borderRadius: 6, border: '1px solid rgba(16,185,129,0.2)' }}>
              50/50
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 16px',
              borderRadius: 12,
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid var(--border)',
              flexWrap: 'wrap',
              gap: 14,
            }}
          >
            {/* 3 Illuminated Credential Shields */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {/* Shield 1: Minted Certificate / Badge */}
              <div style={{ position: 'relative' }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    background: 'rgba(16, 185, 129, 0.15)',
                    border: '1.5px solid rgba(16, 185, 129, 0.45)',
                    boxShadow: '0 0 12px rgba(16, 185, 129, 0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 20,
                  }}
                  title="Minted Certificate Proof"
                >
                  📜
                </div>
                <div
                  style={{
                    position: 'absolute',
                    bottom: -3,
                    right: -3,
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    background: '#10b981',
                    border: '2px solid var(--dash-card)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 9,
                    color: '#ffffff',
                    fontWeight: 900,
                  }}
                >
                  ✓
                </div>
              </div>

              {/* Shield 2: Cryptographic Lock */}
              <div style={{ position: 'relative' }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    background: 'rgba(6, 182, 212, 0.15)',
                    border: '1.5px solid rgba(6, 182, 212, 0.45)',
                    boxShadow: '0 0 12px rgba(6, 182, 212, 0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 20,
                  }}
                  title="Cryptographic SHA-256 Vault Badge"
                >
                  🔒
                </div>
                <div
                  style={{
                    position: 'absolute',
                    bottom: -3,
                    right: -3,
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    background: '#06b6d4',
                    border: '2px solid var(--dash-card)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 9,
                    color: '#ffffff',
                    fontWeight: 900,
                  }}
                >
                  ✓
                </div>
              </div>

              {/* Shield 3: Git Repo Verified Commit */}
              <div style={{ position: 'relative' }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    background: 'rgba(99, 102, 241, 0.15)',
                    border: '1.5px solid rgba(99, 102, 241, 0.45)',
                    boxShadow: '0 0 12px rgba(99, 102, 241, 0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 20,
                  }}
                  title="Verified Git Commit Proof"
                >
                  🐙
                </div>
                <div
                  style={{
                    position: 'absolute',
                    bottom: -3,
                    right: -3,
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    background: '#6366f1',
                    border: '2px solid var(--dash-card)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 9,
                    color: '#ffffff',
                    fontWeight: 900,
                  }}
                >
                  ✓
                </div>
              </div>
            </div>

            {/* Checklist Indicators (Matching Image 2) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, fontWeight: 700, color: 'var(--t1)' }}>
                <span style={{ color: '#10b981', fontWeight: 900 }}>&#10003;</span>
                <span>Cryptographic badges</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, fontWeight: 700, color: 'var(--t1)' }}>
                <span style={{ color: '#10b981', fontWeight: 900 }}>&#10003;</span>
                <span>Verified Git commits</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 4: Active & Capstone Projects (100% Full Width, 4-Column Repository Grid matching Image 2) */}
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
              <h3 style={{ fontSize: 15, fontWeight: 900, color: 'var(--t1)', margin: '2px 0 0', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>Active &amp; Capstone Projects</span>
                <span style={{ color: 'var(--t3)', fontSize: 13 }}>&gt;</span>
              </h3>
            </div>
          </Link>
          <Link href="/projects" style={{ fontSize: 12, color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>
            + New Project Workspace &rarr;
          </Link>
        </div>

        {/* 4-Column Project Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))',
            gap: 12,
          }}
        >
          {projectsList.map((p) => (
            <Link
              key={p.id}
              href="/projects"
              style={{
                textDecoration: 'none',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '14px 16px',
                borderRadius: 12,
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--border)',
                transition: 'all 0.18s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.transform = 'none';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                  {/* GitHub Icon */}
                  <svg style={{ width: 18, height: 18, fill: 'var(--t1)', flexShrink: 0 }} viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--t1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {p.name}
                  </span>
                </div>
                <button
                  type="button"
                  aria-label="Project Options"
                  style={{ background: 'none', border: 'none', color: 'var(--t3)', cursor: 'pointer', fontSize: 16, padding: '0 4px', lineHeight: 1 }}
                >
                  &hellip;
                </button>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, color: 'var(--t3)', marginBottom: 6, fontFamily: 'var(--font-mono)' }}>
                  <span>{p.subtitle}</span>
                  <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{p.progress}%</span>
                </div>
                <div style={{ width: '100%', height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ width: `${p.progress}%`, height: '100%', background: 'linear-gradient(90deg, #06b6d4, var(--accent))', borderRadius: 2 }} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Row 3: AI Mistakes widget (if present) */}
      {learningMistakes.length > 0 && (
        <div className="db-glass" style={{ padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <div>
              <span className="db-label">AI MISTAKES &amp; REMEDIATION</span>
              <h3 style={{ fontSize: 14.5, fontWeight: 800, color: 'var(--t1)', margin: '2px 0 0' }}>Unresolved Knowledge Gaps</h3>
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--coral-mid)', background: 'var(--coral-light)', padding: '2px 8px', borderRadius: 8 }}>
              {learningMistakes.length} active
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {learningMistakes.slice(0, 2).map((m: any) => (
              <div key={m.id} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border)', borderRadius: 8, padding: 9 }}>
                <span style={{ fontSize: 11, background: 'var(--coral-light)', color: 'var(--coral-mid)', padding: '1px 5px', borderRadius: 4, fontWeight: 800, textTransform: 'uppercase', flexShrink: 0 }}>{m.type}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--t1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.module}</div>
                  <div style={{ fontSize: 11, color: 'var(--t2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 1 }}>{m.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
