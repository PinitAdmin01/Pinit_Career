'use client';

import React from 'react';
import Link from 'next/link';
import PublicNavbar from '@/components/nav/PublicNavbar';
import PublicFooter from '@/components/landing/PublicFooter';
import '@/styles/landing.css';

export default function ProblemPage() {
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
      <PublicNavbar />

      <main style={{ padding: '60px 0 100px', position: 'relative', zIndex: 1 }}>
        <div className="container">
          
          {/* Breadcrumb back to landing */}
          <div style={{ marginBottom: 32 }}>
            <Link href="/" style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span>←</span> Back to Home
            </Link>
          </div>

          <div style={{ maxWidth: 840, marginBottom: 56 }}>
            <div style={{ display: 'inline-block', padding: '6px 14px', borderRadius: 999, background: 'rgba(244,63,94,0.12)', border: '1px solid rgba(244,63,94,0.3)', color: '#f43f5e', fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 16 }}>
              Systemic Problem Statement
            </div>
            <h1 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1.15, marginBottom: 18 }}>
              Higher Education is Running on a Broken Currency.
            </h1>
            <p style={{ fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              The intersection of education and recruitment is paralyzed by a fundamental crisis of trust. PDF resumes have zero proof, video learning produces passive illusions, and recruiters spend hundreds of hours filtering noise.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
            {problems.map((p) => (
              <div
                key={p.num}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 20,
                  padding: 32,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: 24,
                  boxShadow: 'var(--card-shadow)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#f43f5e', fontFamily: 'var(--font-mono)' }}>{p.num}</span>
                    <span style={{ padding: '4px 10px', borderRadius: 999, background: 'rgba(244,63,94,0.08)', color: '#f43f5e', fontSize: 11, fontWeight: 750 }}>CRISIS POINT</span>
                  </div>
                  <h3 style={{ margin: 0, fontSize: 19, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.3, marginBottom: 12 }}>
                    {p.title}
                  </h3>
                  <p style={{ margin: 0, fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    {p.desc}
                  </p>
                </div>

                <div style={{ padding: '16px 20px', borderRadius: 12, background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ fontSize: 24, fontWeight: 900, color: '#f43f5e', fontFamily: 'var(--font-mono)' }}>
                    {p.stat}
                  </div>
                  <div style={{ fontSize: 11.5, fontWeight: 650, color: 'var(--text-secondary)', lineHeight: 1.35 }}>
                    {p.statLabel}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 60, textAlign: 'center', padding: '40px 24px', borderRadius: 24, background: 'var(--bg-card)', border: '1px solid var(--border-color)', boxShadow: 'var(--card-shadow)' }}>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 12 }}>
              Ready to replace unverified claims with verifiable proof of work?
            </h2>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', maxWidth: 600, margin: '0 auto 24px' }}>
              Explore how PinIT Career OS establishes an auditable identity passport for every student.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
              <Link href="/identity" className="pc-btn-primary" style={{ padding: '12px 28px', fontSize: 14, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                Explore Career Identity →
              </Link>
              <Link href="/how-it-works" className="pc-btn-secondary" style={{ padding: '12px 24px', fontSize: 14, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                How It Works
              </Link>
            </div>
          </div>

        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
