'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import PublicNavbar from '@/components/nav/PublicNavbar';
import PublicFooter from '@/components/landing/PublicFooter';
import DynamicSkyCanvas from '@/components/effects/DynamicSkyCanvas';
import '@/styles/landing.css';

export default function HowItWorksPage() {
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

  const steps = [
    {
      step: '01',
      title: 'Cognitive Baseline & Track Selection',
      desc: 'Pick from 36 accredited career roadmaps across Software Engineering, Cloud Architecture, IoT, B.Com Commerce, and Foundational AI. Our 1-concept cognitive budget ensures you never experience burnout.'
    },
    {
      step: '02',
      title: '30 Handcrafted Daily Micro-Quests',
      desc: 'Each day contains 3 structured blocks: (1) Socratic Dialogue with Everyday Metaphors, (2) Interactive Practice with Live Test Assertions, and (3) Proctored Invariant Challenge in an isolated in-browser judge.'
    },
    {
      step: '03',
      title: 'Empathetic 3-Step Socratic Recovery',
      desc: 'When you get stuck, the system does not give generic stack traces. It provides: (1) Conceptual Hint with physical analogy, (2) Structural Invariant Check, and (3) Minimalist Guided Scaffold.'
    },
    {
      step: '04',
      title: '5 Proctored Milestones & Day 30 Capstone',
      desc: 'Every 5 days, conquer a comprehensive milestone project with multi-case assertions. On Day 30, build and deploy an enterprise-grade capstone project audited by AST static analysis.'
    },
    {
      step: '05',
      title: 'Direct Placement & Recruiter Match',
      desc: 'Your verified skill passport and benchmarked Code Wars Elo rating enter the enterprise talent pipeline, allowing hiring managers to interview you based on real proof of work.'
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
            <div className="badge-pill">THE PEDAGOGICAL ENGINE</div>
            <h1 className="hero-title">
              How PinIT Career OS Works:{' '}
              <span className="text-gradient">The S-Curve Method.</span>
            </h1>
            <p className="hero-subtitle" style={{ margin: '16px auto 0' }}>
              Zero jargon. Zero robotic errors. A structured, 5-step journey from first line of code to placement readiness.
            </p>
          </div>

          {/* Timeline of 5 Steps */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 840, margin: '0 auto 60px' }}>
            {steps.map((item) => (
              <div key={item.step} className="glass-card" style={{ padding: 32, display: 'flex', gap: 24, alignItems: 'flex-start' }}>
                <div style={{
                  flexShrink: 0,
                  width: 52,
                  height: 52,
                  borderRadius: 16,
                  background: 'var(--badge-bg)',
                  border: '1.5px solid var(--accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 18,
                  fontWeight: 900,
                  color: 'var(--accent)'
                }}>
                  {item.step}
                </div>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}>{item.title}</h3>
                  <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="glass-card" style={{ padding: '40px 32px', textAlign: 'center', maxWidth: 840, margin: '0 auto' }}>
            <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 12 }}>Begin Day 1 of Your S-Curve Track</h2>
            <p style={{ fontSize: 14.5, color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: 600, margin: '0 auto 24px' }}>
              36 tracks. 1,080 daily quests. 100% free starter pass.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap' }}>
              <Link href="/onboarding" className="pc-btn-primary">
                Select Your Career Roadmap →
              </Link>
              <Link href="/modules" className="pc-btn-outline">
                Explore 54 Modules →
              </Link>
            </div>
          </div>

        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
