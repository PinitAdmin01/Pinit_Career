'use client';

import React from 'react';
import Link from 'next/link';

export default function InstitutionalTierMatrix({ onOpenLogin }: { onOpenLogin?: (role?: 'student' | 'teacher') => void }) {
  const tiers = [
    {
      name: 'Student Sovereign Tier',
      tag: '100% FREE FOREVER',
      price: '₹0',
      period: '/ forever',
      desc: 'Complete access to all 36 career tracks, 1,080 handcrafted days, and daily Socratic quests.',
      highlight: false,
      features: [
        'All 36 Engineering & Business Tracks',
        '1,080 Handcrafted Socratic Days',
        '3,250+ In-Browser Interactive Sandboxes',
        'Daily Code Wars & Community Leaderboard',
        'Basic Career Readiness Score Tracking'
      ],
      cta: 'Start Learning (Free)',
      role: 'student' as const,
      buttonStyle: { background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }
    },
    {
      name: 'Career Passport Pro',
      tag: 'MOST POPULAR FOR JOB SEEKERS',
      price: '₹499',
      period: '/ month',
      desc: 'For ambitious students targeting Top 5% Tier 1 enterprise placements with verified credentials.',
      highlight: true,
      features: [
        'Everything in Free Tier',
        'Unlimited AI Avatar Voice Mock Interviews',
        'Cryptographic Tamper-Proof Skill Passport',
        'Direct Recruiter Matchmaking Pipeline',
        'Deep AST Code Quality & Invariant Audits',
        'Priority Technical Doubt Resolution'
      ],
      cta: 'Claim Career Passport',
      role: 'student' as const,
      buttonStyle: { background: 'var(--accent)', color: '#ffffff', boxShadow: '0 8px 24px var(--accent-glow)' }
    },
    {
      name: 'Campus Institutional License',
      tag: 'FOR UNIVERSITIES & COLLEGES',
      price: 'Custom',
      period: '/ campus',
      desc: 'Turn your university into an elite placement powerhouse with cohort analytics and automated drives.',
      highlight: false,
      features: [
        'Full Placement Cell CRM & Student Dashboard',
        'Campus-Wide 0-100% Employability Indexing',
        'Automated 10,000+ Concurrent Mock Interviews',
        'NAAC / NBA Accreditation Audit Exports',
        'White-Label Institutional Branding',
        'Dedicated Enterprise Relationship Manager'
      ],
      cta: 'Request Campus Demo',
      role: 'teacher' as const,
      buttonStyle: { background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }
    }
  ];

  return (
    <section id="pricing" className="lp-section">
      <div className="lp-container">
        
        <div className="lp-section-header">
          <div className="lp-badge-tag cyan">TRANSPARENT VALUE</div>
          <h2 className="lp-section-title">
            Simple Pricing for{' '}
            <span className="lp-gradient-text">Students &amp; Institutions.</span>
          </h2>
          <p className="lp-section-subtitle">
            Zero hidden fees. Zero student paywalls for core learning. Enterprise tooling scaled for universities.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
          {tiers.map((tier, i) => (
            <div
              key={i}
              className={`glass-card ${tier.highlight ? 'pinit-way' : ''}`}
              style={{
                padding: 32,
                borderRadius: 22,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: tier.highlight ? '2px solid var(--accent)' : '1px solid var(--border-color)',
                boxShadow: tier.highlight ? '0 12px 36px var(--accent-glow)' : 'var(--card-shadow)',
                position: 'relative'
              }}
            >
              <div>
                <span style={{ fontSize: 10.5, fontWeight: 800, padding: '4px 10px', borderRadius: 999, background: tier.highlight ? 'rgba(0,163,255,0.15)' : 'var(--bg-secondary)', color: tier.highlight ? 'var(--accent)' : 'var(--text-secondary)', border: '1px solid var(--border-color)' }}>
                  {tier.tag}
                </span>

                <h3 style={{ margin: '14px 0 6px', fontSize: 20, fontWeight: 800, color: 'var(--text-primary)' }}>
                  {tier.name}
                </h3>

                <p style={{ margin: 0, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, minHeight: 40 }}>
                  {tier.desc}
                </p>

                <div style={{ margin: '20px 0', display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <span style={{ fontSize: 32, fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                    {tier.price}
                  </span>
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                    {tier.period}
                  </span>
                </div>

                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {tier.features.map((f, fi) => (
                    <div key={fi} style={{ fontSize: 12.5, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ color: 'var(--accent-green)', fontWeight: 800 }}>✓</span>
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                href={tier.role === 'teacher' ? '/campus-demo' : '/login'}
                style={{
                  ...tier.buttonStyle,
                  width: '100%',
                  marginTop: 24,
                  padding: '12px 18px',
                  borderRadius: 12,
                  fontSize: 13.5,
                  fontWeight: 750,
                  textDecoration: 'none',
                  display: 'inline-block',
                  textAlign: 'center',
                  cursor: 'pointer',
                  border: 'none',
                  transition: 'transform 0.2s ease'
                }}
              >
                {tier.cta} →
              </Link>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
