'use client';

import React, { useState, useEffect } from 'react';
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
  id: string;
  icon: string;
  title: string;
  desc: string;
  href: string;
  cta: string;
  xp: string;
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
  const trackName = profile?.target_role || (profile?.active_track === 'iot' ? 'IoT Hardware' : 'your target track');

  const candidates: Action[] = [
    // 1. Resume / ATS Optimization
    {
      id: 'resume',
      icon: 'RESUME',
      color: '#6366f1',
      bg: 'rgba(99,102,241,0.12)',
      border: 'rgba(99,102,241,0.25)',
      title: ats === 0 ? 'Optimize Resume' : `Resume Score: ${ats}`,
      desc: ats === 0
        ? `Upload your resume to map keyword gaps for ${trackName}.`
        : `Close missing technical keywords to reach benchmark standing.`,
      href: '/career-builder',
      cta: 'Open Resume Builder',
      xp: '+50 XP',
      urgency: ats === 0 ? 95 : ats < 55 ? 75 : 10,
    },
    // 2. Mission Streak
    {
      id: 'streak',
      icon: 'STREAK',
      color: '#f59e0b',
      bg: 'rgba(245,158,11,0.12)',
      border: 'rgba(245,158,11,0.25)',
      title: streak === 0 ? 'Start Daily Streak' : `Extend ${streak}-Day Streak`,
      desc: streak === 0
        ? 'Complete a 15-min daily mission to begin building your consistency record.'
        : `Complete today's quick sprint to keep your focus streak alive.`,
      href: '/missions',
      cta: "Launch Today's Mission",
      xp: '+35 XP',
      urgency: streak === 0 ? 90 : streak < 3 ? 60 : 15,
    },
    // 3. Trust Score
    {
      id: 'trust',
      icon: 'TRUST',
      color: '#10b981',
      bg: 'rgba(16,185,129,0.12)',
      border: 'rgba(16,185,129,0.25)',
      title: trust < 50 ? 'Boost Trust Quotient' : `Trust Standing: ${Math.round(trust)}`,
      desc: trust < 50
        ? 'Verify a certificate or pass a quick coding quiz to build recruiter trust.'
        : 'Institutional trust is active. Keep attendance clean to preserve 90+ standing.',
      href: '/trust',
      cta: 'Verify Credentials',
      xp: '+40 XP',
      urgency: trust < 50 ? 88 : trust < 70 ? 45 : 8,
    },
    // 4. Mock Interviews
    {
      id: 'mock',
      icon: 'MOCK',
      color: '#3b82f6',
      bg: 'rgba(59,130,246,0.12)',
      border: 'rgba(59,130,246,0.25)',
      title: intDone === 0 ? 'First AI Mock Round' : `Mock Practice (${intDone} Cleared)`,
      desc: intDone === 0
        ? 'Practice a 10-minute technical interview with Ms. Priya to calibrate confidence.'
        : 'Take an advanced system design or problem-solving mock round.',
      href: '/interview',
      cta: 'Start Mock Interview',
      xp: '+75 XP',
      urgency: intDone === 0 ? 82 : intDone < 3 ? 40 : 12,
    },
    // 5. Evidence Vault
    {
      id: 'vault',
      icon: 'VAULT',
      color: '#a855f7',
      bg: 'rgba(168,85,247,0.12)',
      border: 'rgba(168,85,247,0.25)',
      title: vault === 0 ? 'Add Proof to Vault' : `Vault Assets (${vault})`,
      desc: vault === 0
        ? 'Store GitHub repos, degrees, or certifications in your tamper-proof Vault.'
        : 'Your vault credentials back your verified skill score.',
      href: '/vault',
      cta: 'Open Vault',
      xp: '+60 XP',
      urgency: vault === 0 ? 84 : vault < 3 ? 50 : 15,
    },
    // 6. Group Discussion Boardroom
    {
      id: 'debate',
      icon: 'DEBATE',
      color: '#14b8a6',
      bg: 'rgba(20,184,166,0.12)',
      border: 'rgba(20,184,166,0.25)',
      title: 'AI Boardroom Debate',
      desc: 'Sharpen your technical communication and collaborative argumentation skills.',
      href: '/group-discussion',
      cta: 'Enter Boardroom',
      xp: '+45 XP',
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

  // Honest baseline: 0 items pre-checked on initial render; persisted per day in localStorage
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>({});
  const todayKey = typeof window !== 'undefined'
    ? `pinit_daily_actions_${new Date().toISOString().slice(0, 10)}`
    : 'pinit_daily_actions';

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const saved = localStorage.getItem(todayKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') setCompletedItems(parsed);
      }
    } catch {}
  }, [todayKey]);

  const toggleComplete = (actionId: string) => {
    setCompletedItems(prev => {
      const next = { ...prev, [actionId]: !prev[actionId] };
      if (typeof window !== 'undefined') {
        try { localStorage.setItem(todayKey, JSON.stringify(next)); } catch {}
      }
      return next;
    });
  };

  const doneCount = actions.filter(a => Boolean(completedItems[a.id])).length;

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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: isVertical ? 14 : 16 }}>
        <div>
          <span className="db-label" style={{ marginBottom: 2 }}>WHAT TO DO TODAY</span>
          <Link
            href="/missions"
            style={{
              fontSize: 15,
              fontWeight: 800,
              color: 'var(--dash-text, var(--t1))',
              fontFamily: 'var(--font-display)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              textDecoration: 'none',
            }}
          >
            <span>{isVertical ? '3 Priority Actions' : '3 concise actions personalized to your career progress'}</span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" style={{ color: 'var(--t3)' }}>
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Link>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            data-testid="actions-done-pill"
            className="db-tabular"
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: doneCount === actions.length ? '#10b981' : 'var(--dash-subtext, var(--t2))',
              background: doneCount === actions.length ? 'rgba(16,185,129,0.12)' : 'var(--dash-subtle-bg, var(--bg3))',
              padding: '3px 9px',
              borderRadius: 7,
              border: `1px solid ${doneCount === actions.length ? 'rgba(16,185,129,0.32)' : 'var(--dash-inner-border, var(--border))'}`,
            }}
          >
            {doneCount}/{actions.length} Done
          </span>
          <Link
            href="/missions"
            className="db-tabular"
            style={{
              fontSize: 11.5,
              fontWeight: 700,
              color: 'var(--accent-mid, var(--accent))',
              textDecoration: 'none',
              padding: '4px 10px',
              borderRadius: 7,
              background: 'rgba(99,102,241,0.10)',
              border: '1px solid rgba(99,102,241,0.24)',
              whiteSpace: 'nowrap',
            }}
          >
            All missions &rarr;
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
          const isDone = Boolean(completedItems[action.id]);
          return (
            <Link
              key={action.id + '-' + i}
              href={action.href}
              style={{ textDecoration: 'none', display: 'block', flex: isVertical ? 1 : undefined }}
              data-testid={`action-item-${isVertical ? 'vertical' : 'horizontal'}-${i}`}
            >
              <div
                style={{
                  background: isDone ? 'rgba(16, 185, 129, 0.08)' : 'var(--dash-subtle-bg, var(--bg3))',
                  border: `1px solid ${isDone ? 'rgba(16, 185, 129, 0.35)' : 'var(--dash-inner-border, var(--border))'}`,
                  borderRadius: 12,
                  padding: isVertical ? '12px 15px' : '14px 16px',
                  cursor: 'pointer',
                  transition: 'transform 0.18s ease, border-color 0.18s ease, background 0.18s ease',
                  borderLeft: `3.5px solid ${isDone ? '#10b981' : action.color}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                  height: '100%',
                  boxSizing: 'border-box',
                  boxShadow: 'var(--hud-card-shadow, 0 2px 8px -1px rgba(0,0,0,0.05))',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = isVertical ? 'translateX(3px)' : 'translateY(-2px)';
                  e.currentTarget.style.borderColor = isDone ? '#10b981' : action.color;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.borderColor = isDone ? 'rgba(16, 185, 129, 0.35)' : 'var(--dash-inner-border, var(--border))';
                  e.currentTarget.style.borderLeftColor = isDone ? '#10b981' : action.color;
                }}
              >
                {/* Left Checkbox */}
                <button
                  type="button"
                  aria-label={`Toggle action item ${i + 1}`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleComplete(action.id);
                  }}
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 6,
                    border: `1.5px solid ${isDone ? '#10b981' : 'var(--dash-border-strong, var(--border2))'}`,
                    background: isDone ? 'rgba(16, 185, 129, 0.22)' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#10b981',
                    flexShrink: 0,
                    padding: 0,
                    transition: 'all 0.15s ease',
                  }}
                >
                  {isDone ? (
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : null}
                </button>

                {/* Center Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                    <span
                      className="db-tabular"
                      style={{
                        fontSize: 9.5,
                        fontWeight: 900,
                        color: action.color,
                        background: action.bg,
                        padding: '1.5px 6px',
                        borderRadius: 4,
                        letterSpacing: '0.04em',
                        flexShrink: 0,
                      }}
                    >
                      {action.icon}
                    </span>
                    <span
                      style={{
                        fontWeight: 800,
                        fontSize: isVertical ? 13 : 13.5,
                        color: isDone ? 'var(--dash-subtext, var(--t2))' : 'var(--dash-text, var(--t1))',
                        textDecoration: isDone ? 'line-through' : 'none',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {action.title}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: 11.5,
                      color: 'var(--dash-subtext, var(--t3))',
                      lineHeight: 1.4,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {action.desc}
                  </div>
                </div>

                {/* Right Single Contextual XP Reward + Subtle Chevron */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  <span
                    className="db-tabular"
                    style={{
                      fontSize: 10.5,
                      fontWeight: 800,
                      color: '#06b6d4',
                      background: 'rgba(6,182,212,0.12)',
                      border: '1px solid rgba(6,182,212,0.26)',
                      padding: '2.5px 7px',
                      borderRadius: 6,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {action.xp}
                  </span>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" style={{ color: 'var(--t3)', opacity: 0.7 }}>
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
