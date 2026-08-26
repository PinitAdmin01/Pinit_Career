'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import PublicNavbar from '@/components/nav/PublicNavbar';
import PublicFooter from '@/components/landing/PublicFooter';
import DynamicSkyCanvas from '@/components/effects/DynamicSkyCanvas';
import '@/styles/landing.css';

export default function ProblemPage() {
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

  const problems = [
    {
      num: '01',
      title: 'The PDF Resume is an Unverified Claim',
      desc: 'Anyone can copy-paste keywords, list 20 technologies, and claim expertise on a 1-page PDF. Recruiters know this, which is why 95% of applications are filtered by automated ATS parsers before a human ever looks at them.',
      stat: '95%',
      statLabel: 'Automatic Rejection Rate'
    },
    {
      num: '02',
      title: 'Video Courses Produce Passive Illusions of Competence',
      desc: 'Watching a 40-hour tutorial video feels like learning, but writing code in a blank editor triggers immediate mental blocks. Without real-time compilation, live test assertions, and active retrieval, retention drops to less than 15%.',
      stat: '85%',
      statLabel: 'Knowledge Decay in 14 Days'
    },
    {
      num: '03',
      title: 'Placement Cells Operate with Blind Visibility',
      desc: 'Universities measure placement readiness through outdated CGPA and attendance sheets, with zero real-time visibility into whether their graduating cohort can solve algorithmic invariants or construct distributed systems.',
      stat: '78%',
      statLabel: 'Graduates Unprepared for Tier-1 Tech Rounds'
    },
    {
      num: '04',
      title: 'Recruiter Screening Fatigue & False Positives',
      desc: 'Talent acquisition teams receive 3,000 resumes per open junior role. Sifting through keyword-stuffed claims wastes hundreds of engineering interview hours on candidates who cannot write basic control flow.',
      stat: '42 hrs',
      statLabel: 'Average Engineering Time Wasted Per Hire'
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
            <div className="badge-pill">THE STRUCTURAL CRISIS</div>
            <h1 className="hero-title">
              Why Traditional Hiring & Placement is{' '}
              <span className="text-gradient">Fundamentally Broken.</span>
            </h1>
            <p style={{ fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.65, marginTop: 16 }}>
              The 20-year-old tradition of submitting PDF resumes into black-box ATS algorithms is failing students, universities, and enterprise recruiters alike.
            </p>
          </div>

          {/* 4 Structural Crises Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, marginBottom: 60 }}>
            {problems.map((prob) => (
              <div key={prob.num} className="glass-card" style={{ padding: 32, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 800, color: 'var(--accent)' }}>CRISIS {prob.num}</span>
                    <span style={{ fontSize: 20, fontWeight: 900, color: '#EF4444' }}>{prob.stat}</span>
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 12 }}>{prob.title}</h3>
                  <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{prob.desc}</p>
                </div>
                <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border-color)', fontSize: 11.5, color: 'var(--text-tertiary)', fontWeight: 600 }}>
                  Metric: {prob.statLabel}
                </div>
              </div>
            ))}
          </div>

          {/* The Solution Callout */}
          <div className="glass-card" style={{ padding: '40px 32px', textAlign: 'center', maxWidth: 840, margin: '0 auto' }}>
            <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 12 }}>The PinitCareer Paradigm Shift</h2>
            <p style={{ fontSize: 14.5, color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: 640, margin: '0 auto 24px' }}>
              Replace unverified PDF claims with cryptographic proof-of-work, real-time AI mentorship, and verified test assertions.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap' }}>
              <Link href="/identity" className="pc-btn-primary">
                Explore Career Identity →
              </Link>
              <Link href="/" className="pc-btn-outline">
                Back to Overview
              </Link>
            </div>
          </div>

        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
