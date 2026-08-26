'use client';

import React, { useState } from 'react';

type WorldRole = 'students' | 'colleges' | 'recruiters';

export default function ThreeWorldsPortal({ onOpenLogin }: { onOpenLogin: (role?: 'student' | 'teacher' | 'recruiter') => void }) {
  const [activeRole, setActiveRole] = useState<WorldRole>('students');

  const worldData = {
    students: {
      tag: 'STUDENT TRANSFORMATION ENGINE',
      title: 'Stop Sending 500 Resumes. Let Companies Discover Your Proof of Work.',
      subtitle: 'Build real systems, master algorithmic invariants, and earn verifiable cryptographic badges with 24/7 AI Socratic Voice Mentors.',
      bulletPoints: [
        { title: 'Zero Paywall Learning', desc: 'All 36 foundation roadmaps, 1,080 days, and daily quests are 100% free forever.' },
        { title: 'Empathetic Socratic Diagnosis', desc: 'No robotic error codes; get 3-step recovery ladders with real-world physical analogies.' },
        { title: 'Multiplayer Arena Battles', desc: 'Compete in live algorithmic Code Wars, raise your Elo ranking, and climb the leaderboard.' },
        { title: 'Tamper-Proof Skill Passport', desc: 'Share your verifiable portfolio hash directly with hiring managers.' }
      ],
      ctaText: 'Start Student Journey (Free)',
      ctaRole: 'student' as const,
      metric: '100,000+ Students Guided',
      mockSnippet: {
        header: 'Arjun Sharma • Software Engineering',
        status: '30/30 Days Complete • Java Capstone',
        badge: 'Top 5% Elo Rank #482',
        highlights: ['✓ 61/61 Assertions Passed', '✓ 24/7 Voice AI Feedback', '✓ Hashed Proof of Work']
      }
    },
    colleges: {
      tag: 'INSTITUTIONAL PLACEMENT COCKPIT',
      title: 'Real-Time Employability Analytics & Automated Campus Drives.',
      subtitle: 'Empower placement directors and deans with deep student readiness insights, automated mock interview studios, and verifiable accreditation metrics.',
      bulletPoints: [
        { title: 'Live 0-100% Employability Index', desc: 'Measure cohort skill progression in real-time across DSA, System Design, and Communication.' },
        { title: 'Automated AI Interview Studio', desc: 'Run 10,000+ concurrent audio mock interviews with instant rubrics and speech confidence scoring.' },
        { title: 'Integrated Placement CRM', desc: 'Track recruiter job postings, shortlist candidates by verified test scores, and manage campus drives.' },
        { title: 'NAAC / NBA Accreditation Ready', desc: 'Export verifiable proof-of-work audits and continuous student learning records in 1-click.' }
      ],
      ctaText: 'Explore Campus Demo Portal',
      ctaRole: 'teacher' as const,
      metric: '500+ Partner Campuses',
      mockSnippet: {
        header: 'Apex Institute of Technology • Placement Cell',
        status: 'Cohort 2026 • 84.2% Avg Placement Ready',
        badge: 'Top Tier 1 Campus Index',
        highlights: ['✓ 1,240 Students Active', '✓ 98.4% Mock Interview Pass', '✓ 42 Enterprise Recruiters Connected']
      }
    },
    recruiters: {
      tag: 'ENTERPRISE TALENT ACQUISITION',
      title: 'Zero Resume Screening Fatigue. Hire Verified Top 5% Talent Directly.',
      subtitle: 'Stop filtering keyword-stuffed PDF resumes. Filter candidates by actual code execution benchmarks, system architecture projects, and Elo rankings.',
      bulletPoints: [
        { title: 'Benchmark-Driven Shortlisting', desc: 'Filter candidates by real code execution results across 330+ multi-case test assertions.' },
        { title: '95%+ Candidate Matching Accuracy', desc: 'AI matching algorithm aligns verified candidate abilities directly with your tech stack.' },
        { title: 'Live GitHub Commit Verification', desc: 'Inspect real pull requests and architectural decisions without waiting for tech rounds.' },
        { title: 'Zero Friction Hiring Pipeline', desc: 'Send direct interview invites to pre-assessed candidates with full score audit trails.' }
      ],
      ctaText: 'Access Recruiter Talent Portal',
      ctaRole: 'recruiter' as const,
      metric: '95% Screening Time Saved',
      mockSnippet: {
        header: 'Enterprise Recruiter Console',
        status: 'Talent Pool: 14,200+ Verified Engineers',
        badge: 'Direct Candidate Pipeline',
        highlights: ['✓ 0 Unverified Claims', '✓ Benchmarked Code Scores', '✓ Instant Interview Scheduling']
      }
    }
  };

  const current = worldData[activeRole];

  return (
    <section id="audiences" className="lp-section" style={{ background: '#080c16', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="lp-container">
        
        <div className="lp-section-header">
          <div className="lp-badge-tag cyan">ECOSYSTEM CONNECTIVITY</div>
          <h2 className="lp-section-title">
            One Platform.{' '}
            <span className="lp-gradient-text">Three Worlds Connected.</span>
          </h2>
          <p className="lp-section-subtitle">
            Bridging the historic divide between what students learn, what colleges measure, and what enterprise recruiters hire.
          </p>
        </div>

        {/* 3-Role Master Toggle */}
        <div className="three-worlds-toggle">
          <button
            type="button"
            onClick={() => setActiveRole('students')}
            className={`three-worlds-btn ${activeRole === 'students' ? 'active' : ''}`}
          >
            🎓 For Students
          </button>
          <button
            type="button"
            onClick={() => setActiveRole('colleges')}
            className={`three-worlds-btn ${activeRole === 'colleges' ? 'active' : ''}`}
          >
            🏛️ For Colleges
          </button>
          <button
            type="button"
            onClick={() => setActiveRole('recruiters')}
            className={`three-worlds-btn ${activeRole === 'recruiters' ? 'active' : ''}`}
          >
            💼 For Recruiters
          </button>
        </div>

        {/* Dynamic Card */}
        <div className="lp-card" style={{ padding: '40px 36px' }}>
          <div className="hero-cockpit-grid">
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="lp-badge-tag cyan" style={{ margin: 0 }}>
                {current.tag}
              </div>

              <h3 style={{ margin: 0, fontSize: 26, fontWeight: 850, color: '#ffffff', lineHeight: 1.2 }}>
                {current.title}
              </h3>

              <p style={{ margin: 0, fontSize: 14, color: '#94a3b8', lineHeight: 1.6 }}>
                {current.subtitle}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, paddingTop: 8 }}>
                {current.bulletPoints.map((bp, i) => (
                  <div key={i} style={{ padding: 12, borderRadius: 12, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ fontSize: 12, fontWeight: 750, color: '#7ecbff', marginBottom: 2 }}>✓ {bp.title}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.4 }}>{bp.desc}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 16, paddingTop: 12 }}>
                <button
                  type="button"
                  onClick={() => onOpenLogin(current.ctaRole)}
                  className="btn-primary-hero"
                >
                  <span>{current.ctaText}</span>
                  <span>→</span>
                </button>
                <span style={{ fontSize: 12, fontFamily: 'monospace', color: '#64748b' }}>
                  {current.metric}
                </span>
              </div>
            </div>

            {/* Right Preview Box */}
            <div style={{ padding: 24, borderRadius: 16, background: '#070a12', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 750, color: '#ffffff' }}>{current.mockSnippet.header}</div>
                  <div style={{ fontSize: 10, color: '#94a3b8' }}>{current.mockSnippet.status}</div>
                </div>
                <span style={{ padding: '2px 8px', borderRadius: 999, background: 'rgba(16,185,129,0.15)', color: '#6ee7b7', border: '1px solid rgba(16,185,129,0.3)', fontSize: 10, fontFamily: 'monospace' }}>
                  {current.mockSnippet.badge}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {current.mockSnippet.highlights.map((h, i) => (
                  <div key={i} style={{ padding: '10px 14px', borderRadius: 8, background: '#0e1422', border: '1px solid rgba(255,255,255,0.04)', fontSize: 11, color: '#e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
                    <span>{h}</span>
                    <span style={{ color: '#00a3ff', fontFamily: 'monospace', fontSize: 10 }}>VERIFIED</span>
                  </div>
                ))}
              </div>

              <div style={{ padding: 10, borderRadius: 8, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)', textAlign: 'center', fontSize: 11, color: '#a5b4fc', fontFamily: 'monospace' }}>
                ⚡ Integrated into PinIT Career OS
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
