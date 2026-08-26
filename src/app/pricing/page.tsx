'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import PublicNavbar from '@/components/nav/PublicNavbar';
import PublicFooter from '@/components/landing/PublicFooter';
import DynamicSkyCanvas from '@/components/effects/DynamicSkyCanvas';
import '@/styles/landing.css';

export default function PublicPricingPage() {
  const [themeState, setThemeState] = useState<{ theme: 'dark' | 'light'; lastToggleTime: number }>({
    theme: 'light',
    lastToggleTime: 0
  });

  useEffect(() => {
    const saved = (localStorage.getItem('pc_theme') as 'dark' | 'light') || 'light';
    setThemeState(prev => ({ ...prev, theme: saved }));

    const handleThemeToggle = (e: any) => {
      if (e.detail) {
        setThemeState({
          theme: e.detail.theme,
          lastToggleTime: e.detail.time
        });
      }
    };
    window.addEventListener('pc_theme_toggled', handleThemeToggle);
    return () => window.removeEventListener('pc_theme_toggled', handleThemeToggle);
  }, []);

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: 'Is PinIT Career OS truly free for students?',
      a: 'Yes! The foundational Career OS, all 36 foundation roadmaps, 1,080 handcrafted daily quests, peer Code Wars, and daily missions are 100% free forever. Students earn Pins through active learning and completing daily challenges without ever having to enter a credit card.'
    },
    {
      q: 'What are Pins and how do I earn them?',
      a: 'Pins are the gamified utility currency powering heavy AI speech avatar coaching, deep mock interview grading, and crisis incident rollouts. You earn Pins for free by maintaining daily streaks (+15), passing verified quest exams (+25), completing crisis roleplay missions (+10), and verifying GitHub repository commits (+20).'
    },
    {
      q: 'How does campus institutional licensing work?',
      a: 'For universities and colleges, our Institutional Campus Pass equips your entire placement cell with cohort employability heatmaps, skill gap diagnostics, automated 1-click NAAC Grade A+ / NIRF exports, and direct corporate recruitment pipelines.'
    },
    {
      q: 'Can enterprise recruiters hire directly from PinIT?',
      a: 'Yes! Recruiters access pre-assessed talent portfolios verified by automated AST code audits, Elo rating in Code Wars, and SHA-256 signed skill credentials with a 95%+ AI match precision.'
    }
  ];

  return (
    <div className="landing-page" style={{ position: 'relative', overflowX: 'hidden' }}>
      <DynamicSkyCanvas theme={themeState.theme} lastToggleTime={themeState.lastToggleTime} opacity={0.65} />
      <PublicNavbar />

      <main style={{ padding: '60px 0 100px', position: 'relative', zIndex: 1 }}>
        <div className="container">
          
          {/* Breadcrumb back to landing */}
          <div style={{ marginBottom: 32 }}>
            <Link href="/" style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span>←</span> Back to Landing Page
            </Link>
          </div>

          {/* Section Header */}
          <div style={{ textAlign: 'center', maxWidth: 840, margin: '0 auto 60px' }}>
            <div className="badge-pill">TRANSPARENT PLANS &amp; PIN ECONOMY</div>
            <h1 className="hero-title">
              Predictable Pricing for <span className="text-gradient">Every Ambition.</span>
            </h1>
            <p className="hero-subtitle" style={{ margin: '16px auto 0' }}>
              Zero paywall on foundational learning. Earn pins by building real proof-of-work, or unlock institutional super-powers for your campus.
            </p>
          </div>

          {/* 3 Pricing Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 28, marginBottom: 70 }}>
            
            {/* Tier 1: Student Free */}
            <div className="glass-card" style={{ padding: '36px 30px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderRadius: 24 }}>
              <div>
                <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>STUDENT PASS</span>
                <div style={{ fontSize: 40, fontWeight: 900, color: 'var(--text-primary)', margin: '10px 0 14px' }}>
                  ₹0 <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>/ forever</span>
                </div>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 24, lineHeight: 1.6 }}>
                  Perfect for learners building technical foundations and earning verifiable credentials.
                </p>

                <div style={{ padding: '14px 18px', borderRadius: 14, background: 'var(--badge-bg)', border: '1px solid var(--badge-border)', marginBottom: 24 }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--accent)', marginBottom: 4 }}>🎁 50 SIGNUP BONUS PINS</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Earn +15 Pins daily through streak consistency.</div>
                </div>

                <ul style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
                  {[
                    'All 36 Career Roadmaps (1,080 Quests)',
                    'Multiplayer Code Wars Arena (Elo Duels)',
                    'Cryptographic Proof-of-Work Vault',
                    'Empathetic 3-Step Socratic Recovery Tutors',
                    'Day 30 Capstone Project Verification'
                  ].map((feat) => (
                    <li key={feat} style={{ fontSize: 13.5, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ color: 'var(--accent)', fontWeight: 800 }}>✓</span> {feat}
                    </li>
                  ))}
                </ul>
              </div>

              <Link href="/signup" className="pc-btn-outline" style={{ width: '100%', justifyContent: 'center', textAlign: 'center' }}>
                Start Free Forever
              </Link>
            </div>

            {/* Tier 2: Pro Career Pass */}
            <div className="glass-card" style={{ padding: '36px 30px', border: '2px solid var(--accent)', boxShadow: '0 16px 40px var(--accent-glow)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderRadius: 24, position: 'relative' }}>
              <div style={{ position: 'absolute', top: -14, right: 28, background: 'var(--accent)', color: '#FFFFFF', fontSize: 11, fontWeight: 800, padding: '4px 14px', borderRadius: 999, letterSpacing: '0.05em' }}>
                MOST POPULAR
              </div>

              <div>
                <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase' }}>PRO CAREER ACCELERATOR</span>
                <div style={{ fontSize: 40, fontWeight: 900, color: 'var(--text-primary)', margin: '10px 0 14px' }}>
                  ₹499 <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>/ month</span>
                </div>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 24, lineHeight: 1.6 }}>
                  For ambitious graduates preparing for Tier-1 interviews and global placements.
                </p>

                <div style={{ padding: '14px 18px', borderRadius: 14, background: 'var(--badge-bg)', border: '1px solid var(--badge-border)', marginBottom: 24 }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--accent)', marginBottom: 4 }}>⚡ UNLIMITED AI AVATAR TIME</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>500 monthly bonus pins for heavy mock interviews.</div>
                </div>

                <ul style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
                  {[
                    'Everything in Free Student Pass',
                    '24/7 Voice AI Avatar Mock Interviews',
                    'BLUF & Executive Communication Diagnostics',
                    'Recruiter Priority Invariant Showcase',
                    'Live AST Code Performance Benchmarks'
                  ].map((feat) => (
                    <li key={feat} style={{ fontSize: 13.5, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ color: 'var(--accent)', fontWeight: 800 }}>✓</span> {feat}
                    </li>
                  ))}
                </ul>
              </div>

              <Link href="/onboarding" className="pc-btn-primary" style={{ width: '100%', justifyContent: 'center', textAlign: 'center' }}>
                Unlock Pro Pass →
              </Link>
            </div>

            {/* Tier 3: Institutional Campus Pass */}
            <div className="glass-card" style={{ padding: '36px 30px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderRadius: 24 }}>
              <div>
                <span style={{ fontSize: 12, fontWeight: 800, color: '#F59E0B', textTransform: 'uppercase' }}>COLLEGE &amp; INSTITUTION</span>
                <div style={{ fontSize: 40, fontWeight: 900, color: 'var(--text-primary)', margin: '10px 0 14px' }}>
                  Custom <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>/ campus</span>
                </div>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 24, lineHeight: 1.6 }}>
                  Full campus placement cell command center, NAAC audit reports, and batch heatmaps.
                </p>

                <div style={{ padding: '14px 18px', borderRadius: 14, background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', marginBottom: 24 }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: '#F59E0B', marginBottom: 4 }}>🏛️ 1-CLICK NAAC / NIRF EXPORTS</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Automated accreditation documentation ready.</div>
                </div>

                <ul style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
                  {[
                    'Placement Director Real-Time Command Dashboard',
                    'Departmental Cohort Skill Gap Heatmaps',
                    'Automated Multi-Round Campus Drives',
                    'Verified AST Code Integrity Audits',
                    'Dedicated Institutional Support & Training'
                  ].map((feat) => (
                    <li key={feat} style={{ fontSize: 13.5, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ color: '#F59E0B', fontWeight: 800 }}>✓</span> {feat}
                    </li>
                  ))}
                </ul>
              </div>

              <Link href="/campus-demo" className="pc-btn-outline" style={{ width: '100%', justifyContent: 'center', textAlign: 'center' }}>
                Schedule Campus Walkthrough
              </Link>
            </div>

          </div>

          {/* Pin Economy Explainer */}
          <div className="glass-card" style={{ padding: '48px 36px', marginBottom: 60 }}>
            <div style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto 36px' }}>
              <div className="badge-pill">GAMIFIED MERITOCRACY</div>
              <h2 style={{ fontSize: 26, fontWeight: 900, color: 'var(--text-primary)' }}>The Pin Merit Economy</h2>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginTop: 8 }}>
                We believe financial constraints should never prevent hard-working students from accessing state-of-the-art AI education.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
              <div style={{ padding: 20, borderRadius: 16, background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--accent)', marginBottom: 6 }}>+15 Pins / Day</div>
                <strong style={{ fontSize: 14, color: 'var(--text-primary)', display: 'block', marginBottom: 4 }}>Daily Streak Maintenance</strong>
                <span style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>Log in and complete at least one daily Socratic coding quest block.</span>
              </div>

              <div style={{ padding: 20, borderRadius: 16, background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--accent)', marginBottom: 6 }}>+25 Pins / Test</div>
                <strong style={{ fontSize: 14, color: 'var(--text-primary)', display: 'block', marginBottom: 4 }}>100% Invariant Pass</strong>
                <span style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>Solve all multi-case assertions on the first attempt without guided hints.</span>
              </div>

              <div style={{ padding: 20, borderRadius: 16, background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--accent)', marginBottom: 6 }}>+20 Pins / Repo</div>
                <strong style={{ fontSize: 14, color: 'var(--text-primary)', display: 'block', marginBottom: 4 }}>GitHub Commit Verification</strong>
                <span style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>Push audited capstone commits to your verified public GitHub repo.</span>
              </div>

              <div style={{ padding: 20, borderRadius: 16, background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--accent)', marginBottom: 6 }}>+30 Pins / Win</div>
                <strong style={{ fontSize: 14, color: 'var(--text-primary)', display: 'block', marginBottom: 4 }}>Code Wars Arena Victory</strong>
                <span style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>Defeat peers in real-time algorithmic speed &amp; memory duels.</span>
              </div>
            </div>
          </div>

          {/* FAQ Accordion */}
          <div style={{ maxWidth: 840, margin: '0 auto' }}>
            <h2 style={{ fontSize: 24, fontWeight: 900, textAlign: 'center', marginBottom: 32 }}>Frequently Asked Questions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className="glass-card"
                    style={{ padding: '20px 24px', cursor: 'pointer' }}
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)' }}>{faq.q}</span>
                      <span style={{ fontSize: 18, color: 'var(--accent)' }}>{isOpen ? '−' : '+'}</span>
                    </div>
                    {isOpen && (
                      <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.65, marginTop: 14, margin: '14px 0 0' }}>
                        {faq.a}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </main>

      <PublicFooter />
    </div>
  );
}