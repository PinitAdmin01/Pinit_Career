'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import PublicNavbar from '@/components/nav/PublicNavbar';
import PublicFooter from '@/components/landing/PublicFooter';
import DynamicSkyCanvas from '@/components/effects/DynamicSkyCanvas';
import '@/styles/landing.css';

export default function IdentityPage() {
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

  const pillars = [
    {
      icon: '🧬',
      title: 'Career DNA Vector',
      desc: 'Multidimensional cognitive and technical profiling measuring reasoning speed, problem decomposition, algorithmic patience, and structural clarity.'
    },
    {
      icon: '🛡️',
      title: 'Cryptographic Skill Passport',
      desc: 'Every solved milestone generates a tamper-proof SHA-256 assertion hash linked directly to your sovereign identity and verifiable by any employer.'
    },
    {
      icon: '👩‍🏫',
      title: 'Socratic BLUF Voice Diagnostic',
      desc: 'Speech-based AI interviews that evaluate Bottom Line Up Front (BLUF) communication, technical depth, executive poise, and structured delivery.'
    },
    {
      icon: '⚡',
      title: 'Multiplayer Arena Elo Score',
      desc: 'Live competitive algorithmic duels that benchmark your real-time coding latency, test passing speed, and accuracy against global peers.'
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

          <div style={{ textAlign: 'center', maxWidth: 840, margin: '0 auto 60px' }}>
            <div className="badge-pill">SOVEREIGN CAREER IDENTITY</div>
            <h1 className="hero-title">
              Your Real Skills.{' '}
              <span className="text-gradient">Cryptographically Verified.</span>
            </h1>
            <p className="hero-subtitle" style={{ margin: '16px auto 0' }}>
              We don&apos;t help students find jobs. We help them discover who they are and prove their competence through audited code execution.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, marginBottom: 60 }}>
            {pillars.map((pillar, idx) => (
              <div key={idx} className="gain-card" style={{ padding: 32, textAlign: 'left' }}>
                <div style={{ fontSize: 36, marginBottom: 16 }}>{pillar.icon}</div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 10 }}>{pillar.title}</h3>
                <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{pillar.desc}</p>
              </div>
            ))}
          </div>

          {/* Verification CTA */}
          <div className="glass-card" style={{ padding: '40px 32px', textAlign: 'center', maxWidth: 840, margin: '0 auto' }}>
            <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 12 }}>Ready to Unlock Your Career DNA?</h2>
            <p style={{ fontSize: 14.5, color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: 600, margin: '0 auto 24px' }}>
              Complete the 20-minute diagnostic and claim your sovereign cryptographic credential.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap' }}>
              <Link href="/onboarding" className="pc-btn-primary">
                Start Career DNA Assessment →
              </Link>
              <Link href="/how-it-works" className="pc-btn-outline">
                How It Works →
              </Link>
            </div>
          </div>

        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
