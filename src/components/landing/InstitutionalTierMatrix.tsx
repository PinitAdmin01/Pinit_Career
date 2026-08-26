'use client';

import React from 'react';

export default function InstitutionalTierMatrix({ onOpenLogin }: { onOpenLogin: (role?: 'student' | 'teacher') => void }) {
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
      buttonStyle: { background: '#1e293b', color: '#ffffff' }
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
      buttonStyle: { background: 'linear-gradient(135deg, #00a3ff, #6366f1)', color: '#ffffff', boxShadow: '0 8px 24px rgba(0,163,255,0.4)' }
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
      buttonStyle: { background: '#1e293b', color: '#ffffff', border: '1px solid rgba(99,102,241,0.4)' }
    }
  ];

  return (
    <section id="pricing" className="lp-section">
      <div className="lp-container">
        
        <div className="lp-section-header">
          <div className="lp-badge-tag cyan">TRANSPARENT VALUE</div>
          <h2 className="lp-section-title">
            Transparent Pricing.{' '}
            <span className="lp-gradient-text">Zero Paywalls on Core Learning.</span>
          </h2>
          <p className="lp-section-subtitle">
            Every student deserves access to world-class learning without financial barriers.
          </p>
        </div>

        <div className="tier-matrix-grid">
          {tiers.map((t, idx) => (
            <div key={idx} className={`tier-card ${t.highlight ? 'highlight' : ''}`}>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <span style={{ fontSize: 10, fontWeight: 750, fontFamily: 'monospace', color: t.highlight ? '#a5b4fc' : '#00a3ff', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>
                    {t.tag}
                  </span>
                  <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#ffffff' }}>{t.name}</h3>
                  <p style={{ margin: '6px 0 0', fontSize: 12, color: '#94a3b8', lineHeight: 1.5 }}>{t.desc}</p>
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                  <span style={{ fontSize: 36, fontWeight: 900, color: '#ffffff', fontFamily: 'monospace' }}>{t.price}</span>
                  <span style={{ fontSize: 12, color: '#94a3b8' }}>{t.period}</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: 11, fontWeight: 750, color: '#cbd5e1', textTransform: 'uppercase' }}>What's included:</div>
                  {t.features.map((f, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#cbd5e1' }}>
                      <span style={{ color: '#10b981', fontWeight: 700 }}>✓</span>
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ paddingTop: 20 }}>
                <button
                  type="button"
                  onClick={() => onOpenLogin(t.role)}
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: 12,
                    border: 'none',
                    fontWeight: 750,
                    fontSize: 13,
                    cursor: 'pointer',
                    ...t.buttonStyle
                  }}
                >
                  {t.cta}
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
