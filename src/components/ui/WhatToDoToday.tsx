'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export interface ActionProfile {
  ats_score?: number;
  trust_score?: number;
  career_dna_score?: number;
  mission_streak?: number;
  missions_completed?: number;
  recruiter_visibility?: number;
  vault_count?: number;
  interviews_done?: number;
  weak_areas?: string[];
  skill_tags?: string[];
  xp_total?: number;
  active_track?: 'sde' | 'iot' | string;
  target_role?: string;
}

interface Action {
  icon: string;
  title: string;
  desc: string;
  href: string;
  cta: string;
  color: string;
  bg: string;
  border: string;
  urgency: number;
}

function pickActions(profile: ActionProfile): Action[] {
  const ats = profile?.ats_score || 0;
  const trust = profile?.trust_score || 0;
  const streak = profile?.mission_streak || 0;
  const vault = profile?.vault_count || 0;
  const intDone = profile?.interviews_done || 0;
  const trackName = profile?.active_track === 'iot' ? 'IoT Hardware' : 'SDE Software';

  const candidates: Action[] = [
    // 1. Resume / ATS Optimization
    {
      icon: 'RESUME',
      color: '#6366f1',
      bg: 'rgba(99,102,241,0.12)',
      border: 'rgba(99,102,241,0.25)',
      title: ats === 0 ? 'Optimize Resume' : `Resume Score: ${ats}`,
      desc: ats === 0
        ? `Upload your resume to map keyword gaps for ${trackName}.`
        : `Close missing technical keywords to reach benchmark standing.`,
      href: '/career-builder',
      cta: 'Open Resume Builder →',
      urgency: ats === 0 ? 95 : ats < 55 ? 75 : 10,
    },
    // 2. Mission Streak
    {
      icon: 'STREAK',
      color: '#f59e0b',
      bg: 'rgba(245,158,11,0.12)',
      border: 'rgba(245,158,11,0.25)',
      title: streak === 0 ? 'Start Daily Streak' : `Extend ${streak}-Day Streak`,
      desc: streak === 0
        ? 'Complete a 15-min daily mission to begin building your consistency record.'
        : `Complete today's quick sprint to keep your focus streak alive.`,
      href: '/missions',
      cta: 'Launch Today’s Mission →',
      urgency: streak === 0 ? 90 : streak < 3 ? 60 : 15,
    },
    // 3. Trust Score
    {
      icon: 'TRUST',
      color: '#10b981',
      bg: 'rgba(16,185,129,0.12)',
      border: 'rgba(16,185,129,0.25)',
      title: trust < 50 ? 'Boost Trust Quotient' : `Trust Score: ${Math.round(trust)}`,
      desc: trust < 50
        ? 'Verify a certificate or pass a quick coding quiz to build recruiter trust.'
        : 'Institutional trust is verified. Add more credentials to maintain 90+ standing.',
      href: '/trust',
      cta: 'Verify Credentials →',
      urgency: trust < 50 ? 88 : trust < 70 ? 45 : 8,
    },
    // 4. Mock Interviews
    {
      icon: 'MOCK',
      color: '#3b82f6',
      bg: 'rgba(59,130,246,0.12)',
      border: 'rgba(59,130,246,0.25)',
      title: intDone === 0 ? 'First AI Mock Round' : `Mock Practice (${intDone} Cleared)`,
      desc: intDone === 0
        ? 'Practice a 10-minute technical interview with Priya to build confidence.'
        : 'Take an advanced system design or problem-solving mock round.',
      href: '/interview',
      cta: 'Start Mock Interview →',
      urgency: intDone === 0 ? 82 : intDone < 3 ? 40 : 12,
    },
    // 5. Evidence Vault
    {
      icon: 'VAULT',
      color: '#a855f7',
      bg: 'rgba(168,85,247,0.12)',
      border: 'rgba(168,85,247,0.25)',
      title: vault === 0 ? 'Add Proof to Vault' : `Vault Assets (${vault})`,
      desc: vault === 0
        ? 'Store GitHub repos, degrees, or certifications in your tamper-proof Vault.'
        : 'Your vault credentials back your verified skill score.',
      href: '/vault',
      cta: 'Open Vault →',
      urgency: vault === 0 ? 84 : vault < 3 ? 50 : 15,
    },
    // 6. Group Discussion Boardroom
    {
      icon: 'DEBATE',
      color: '#14b8a6',
      bg: 'rgba(20,184,166,0.12)',
      border: 'rgba(20,184,166,0.25)',
      title: 'AI Boardroom Debate',
      desc: 'Sharpen your technical communication and collaborative argumentation skills.',
      href: '/group-discussion',
      cta: 'Enter Boardroom →',
      urgency: 25,
    },
  ];

  return candidates
    .sort((a, b) => b.urgency - a.urgency)
    .slice(0, 3);
}

export interface WhatToDoTodayProps {
  profile?: ActionProfile | null;
  layout?: 'vertical' | 'horizontal';
  className?: string;
  style?: React.CSSProperties;
}

export default function WhatToDoToday({
  profile,
  layout = 'vertical',
  className = '',
  style = {},
}: WhatToDoTodayProps) {
  const safeProfile = profile || ({} as ActionProfile);
  const actions = pickActions(safeProfile);
  const isVertical = layout === 'vertical';
  const [completedItems, setCompletedItems] = useState<Record<number, boolean>>({ 0: true });

  const toggleComplete = (idx: number) => {
    setCompletedItems(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div
      data-testid="what-to-do-today-root"
      className={`db-glass ${className}`.trim()}
      style={{
        padding: '20px 22px',
        borderRadius: 16,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: isVertical ? 12 : 14 }}>
        <div>
          <div style={{ fontSize: 10.5, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontWeight: 800, marginBottom: 2 }}>
            WHAT TO DO TODAY
          </div>
          <Link
            href="/missions"
            style={{
              fontSize: 14.5,
              fontWeight: 800,
              color: 'var(--t1)',
              fontFamily: 'var(--font-display)',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              textDecoration: 'none',
            }}
          >
            <span>{isVertical ? '3 Priority Actions' : '3 concise actions personalized to your career progress'}</span>
            <span style={{ color: 'var(--t3)', fontSize: 13 }}>&gt;</span>
          </Link>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent)', background: 'rgba(99,102,241,0.1)', padding: '2px 8px', borderRadius: 6, border: '1px solid rgba(99,102,241,0.2)' }}>
            60%
          </span>
          <Link
            href="/missions"
            style={{
              fontSize: 11.5,
              fontWeight: 700,
              color: 'var(--accent)',
              textDecoration: 'none',
              fontFamily: 'var(--font-mono)',
              padding: '4px 10px',
              borderRadius: 6,
              background: 'rgba(99,102,241,0.08)',
              border: '1px solid rgba(99,102,241,0.2)',
              whiteSpace: 'nowrap',
            }}
          >
            All missions →
          </Link>
        </div>
      </div>

      {/* Action cards: vertical flex stack or horizontal grid */}
      <div
        data-testid={isVertical ? 'what-to-do-today-vertical-list' : 'what-to-do-today-horizontal-grid'}
        style={
          isVertical
            ? {
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                flex: 1,
                justifyContent: 'space-between',
              }
            : {
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: 12,
              }
        }
      >
        {actions.map((action, i) => {
          const isDone = !!completedItems[i];
          return (
            <Link
              key={action.href + i}
              href={action.href}
              style={{ textDecoration: 'none', display: 'block', flex: isVertical ? 1 : undefined }}
              data-testid={`action-item-${isVertical ? 'vertical' : 'horizontal'}-${i}`}
            >
              <div
                style={{
                  background: isDone ? 'rgba(16, 185, 129, 0.05)' : 'var(--bg3)',
                  border: `1.5px solid ${isDone ? 'rgba(16, 185, 129, 0.35)' : action.border}`,
                  borderRadius: 12,
                  padding: isVertical ? '10px 14px' : '14px 16px',
                  cursor: 'pointer',
                  transition: 'all 0.18s ease',
                  borderLeft: `4px solid ${isDone ? '#10b981' : action.color}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                  height: '100%',
                  boxSizing: 'border-box',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = isVertical ? 'translateX(3px)' : 'translateY(-2px)';
                  e.currentTarget.style.borderColor = isDone ? '#10b981' : action.color;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.borderColor = isDone ? 'rgba(16, 185, 129, 0.35)' : action.border;
                }}
              >
                {/* Left Checkbox */}
                <button
                  type="button"
                  aria-label={`Toggle action item ${i + 1}`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleComplete(i);
                  }}
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 5,
                    border: `1.5px solid ${isDone ? '#10b981' : 'rgba(255,255,255,0.22)'}`,
                    background: isDone ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255,255,255,0.03)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: 12,
                    fontWeight: 900,
                    color: '#10b981',
                    flexShrink: 0,
                    padding: 0,
                  }}
                >
                  {isDone ? '✓' : ''}
                </button>

                {/* Center Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                    <span style={{ fontSize: 9.5, fontWeight: 900, color: action.color, background: action.bg, padding: '1px 5px', borderRadius: 4, fontFamily: 'var(--font-mono)' }}>
                      {action.icon}
                    </span>
                    <span style={{ fontWeight: 800, fontSize: isVertical ? 12.5 : 13.5, color: isDone ? 'var(--t2)' : 'var(--t1)', textDecoration: isDone ? 'line-through' : 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {action.title}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: 'var(--t3)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {action.desc}
                  </div>
                </div>

                {/* Right Dual XP Badges */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                  <span style={{ fontSize: 10, fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#06b6d4', background: 'rgba(6,182,212,0.12)', border: '1px solid rgba(6,182,212,0.25)', padding: '2px 6px', borderRadius: 4 }}>
                    +50 XP
                  </span>
                  <span style={{ fontSize: 10, fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#f59e0b', background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)', padding: '2px 6px', borderRadius: 4 }}>
                    +100 XP
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
