'use client';

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
      icon: '📄',
      color: 'var(--accent)',
      title: ats === 0 ? 'Optimize Resume' : `Resume Score (${ats}/100)`,
      desc: ats === 0
        ? `Upload your resume to map keyword gaps for ${trackName}.`
        : `Close missing technical keywords to reach 80+ benchmark.`,
      href: '/career-builder',
      cta: 'Open Resume Builder →',
      urgency: ats === 0 ? 95 : ats < 55 ? 75 : 10,
    },
    // 2. Mission Streak
    {
      icon: '🔥',
      color: 'var(--amber)',
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
      icon: '🛡️',
      color: 'var(--green)',
      title: trust < 50 ? 'Boost Trust Quotient' : `Trust Score (${Math.round(trust)}/100)`,
      desc: trust < 50
        ? 'Verify a certificate or pass a quick coding quiz to build recruiter trust.'
        : 'Institutional trust is verified. Add more credentials to maintain 90+ standing.',
      href: '/trust',
      cta: 'Verify Credentials →',
      urgency: trust < 50 ? 88 : trust < 70 ? 45 : 8,
    },
    // 4. Mock Interviews
    {
      icon: '🎙️',
      color: 'var(--blue)',
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
      icon: '🗂️',
      color: 'var(--purple)',
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
      icon: '💬',
      color: 'var(--teal)',
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

export default function WhatToDoToday({ profile }: { profile: ActionProfile | null | undefined }) {
  if (!profile) return null;
  const actions = pickActions(profile);

  return (
    <div
      data-testid="what-to-do-today-root"
      className="db-glass"
      style={{
        padding: '18px 22px',
        borderRadius: 16,
        background: 'var(--card, var(--bg2))',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: '0.8px', textTransform: 'uppercase', color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontWeight: 800, marginBottom: 2 }}>
            What to do today
          </div>
          <div style={{ fontSize: 14.5, fontWeight: 700, color: 'var(--t1)' }}>
            3 concise actions personalized to your career progress
          </div>
        </div>
        <Link
          href="/missions"
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: 'var(--accent)',
            textDecoration: 'none',
            fontFamily: 'var(--font-mono)',
            padding: '4px 10px',
            borderRadius: 6,
            background: 'rgba(99,102,241,0.08)',
            border: '1px solid rgba(99,102,241,0.2)',
          }}
        >
          All missions →
        </Link>
      </div>

      {/* Action cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
        {actions.map((action, i) => (
          <Link key={action.href + i} href={action.href} style={{ textDecoration: 'none' }}>
            <div
              style={{
                background: 'var(--bg3)',
                border: `1.5px solid ${action.color}33`,
                borderRadius: 12,
                padding: '14px 16px',
                cursor: 'pointer',
                transition: 'all 0.18s ease',
                borderLeft: `4px solid ${action.color}`,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '100%',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.borderColor = action.color;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = `${action.color}33`;
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 20 }}>{action.icon}</span>
                    <span style={{ fontSize: 11.5, fontWeight: 800, color: action.color, fontFamily: 'var(--font-mono)' }}>
                      Priority {i + 1}
                    </span>
                  </div>
                </div>

                <div style={{ fontWeight: 800, fontSize: 14, color: 'var(--t1)', marginBottom: 4, lineHeight: 1.3 }}>
                  {action.title}
                </div>

                <div style={{ fontSize: 12.5, color: 'var(--t2)', lineHeight: 1.45, marginBottom: 12 }}>
                  {action.desc}
                </div>
              </div>

              <div style={{ fontSize: 12, fontWeight: 800, color: action.color, fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: 4 }}>
                {action.cta}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
