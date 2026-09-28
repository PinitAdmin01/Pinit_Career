'use client';

import React, { useState } from 'react';
import Link from 'next/link';

type WorldRole = 'students' | 'colleges' | 'recruiters';

export default function ThreeWorldsPortalRevamp({ onOpenLogin }: { onOpenLogin?: (role?: 'student' | 'teacher' | 'recruiter') => void }) {
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
      metric: 'Active Platform Cohorts'
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
      metric: 'Institutional Partners (Q3 Pilot)'
    },
    recruiters: {
      tag: 'ENTERPRISE TALENT ACQUISITION',
      title: 'Zero Resume Screening Fatigue. Hire Verified Top 5% Talent Directly.',
      subtitle: 'Stop filtering keyword-stuffed PDF resumes. Filter candidates by actual code execution benchmarks, system architecture projects, and Elo rankings.',
      bulletPoints: [
        { title: 'Benchmark-Driven Shortlisting', desc: 'Filter candidates by real code execution results across 330+ multi-case test assertions.' },
        { title: 'Verified Candidate Matching', desc: 'AI matching algorithm aligns verified candidate abilities directly with your tech stack.' },
        { title: 'Live GitHub Commit Verification', desc: 'Inspect real pull requests and architectural decisions without waiting for tech rounds.' },
        { title: 'Zero Friction Hiring Pipeline', desc: 'Send direct interview invites to pre-assessed candidates with full score audit trails.' }
      ],
      ctaText: 'Access Recruiter Talent Portal',
      ctaRole: 'recruiter' as const,
      metric: 'Partner Recruiters'
    }
  };

  const current = worldData[activeRole];

  return (
    <section id="audiences" className="lp-section">
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
        <div className="glass-card" style={{ padding: '36px', borderRadius: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', alignItems: 'center' }}>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="lp-badge-tag cyan" style={{ margin: 0 }}>
                {current.tag}
              </div>

              <h3 style={{ margin: 0, fontSize: 26.5, fontWeight: 850, color: 'var(--text-primary)', lineHeight: 1.25 }}>
                {current.title}
              </h3>

              <p style={{ margin: 0, fontSize: 15.5, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {current.subtitle}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, paddingTop: 8 }}>
                {current.bulletPoints.map((bp, i) => (
                  <div key={i} style={{ padding: 12, borderRadius: 12, background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: 13, fontWeight: 750, color: 'var(--accent)', marginBottom: 2 }}>✓ {bp.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.4 }}>{bp.desc}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 16, paddingTop: 12, flexWrap: 'wrap' }}>
                <Link
                  href={current.ctaRole === 'teacher' ? '/campus-demo' : current.ctaRole === 'recruiter' ? '/recruiter' : '/login'}
                  className="pc-btn-primary"
                  style={{ padding: '12px 24px', fontSize: '15.5px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                >
                  <span>{current.ctaText}</span>
                  <span>→</span>
                </Link>
                <span style={{ fontSize: 13, fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)' }}>
                  {current.metric}
                </span>
              </div>
            </div>

            {/* Right Preview Box — explicitly labelled as a sample simulation */}
            <div style={{ padding: 24, borderRadius: 18, background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 14.5, fontWeight: 750, color: 'var(--text-primary)' }}>
                    {activeRole === 'students' ? 'Sample Student Profile' : activeRole === 'colleges' ? 'Sample Placement Cell HUD' : 'Sample Recruiter Console'}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Interactive Preview — not a live user</div>
                </div>
                <span style={{ padding: '3px 10px', borderRadius: 999, background: 'rgba(245,158,11,0.15)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.3)', fontSize: 11.5, fontFamily: 'var(--font-mono)' }}>
                  {activeRole === 'students' ? 'Simulated Profile' : activeRole === 'colleges' ? 'Sample HUD' : 'Demo Console'}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {activeRole === 'students' ? (
                  <>
                    <div style={{ padding: '10px 14px', borderRadius: 10, background: 'var(--bg-card)', border: '1px solid var(--border-color)', fontSize: 13, color: 'var(--text-primary)', display: 'flex', justifyContent: 'space-between' }}>
                      <span>100 Quests Completed</span>
                      <span style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontSize: 11.5, fontWeight: 700 }}>[SIMULATED]</span>
                    </div>
                    <div style={{ padding: '10px 14px', borderRadius: 10, background: 'var(--bg-card)', border: '1px solid var(--border-color)', fontSize: 13, color: 'var(--text-primary)', display: 'flex', justifyContent: 'space-between' }}>
                      <span>GitHub Commits Verified</span>
                      <span style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontSize: 11.5, fontWeight: 700 }}>[SIMULATED]</span>
                    </div>
                    <div style={{ padding: '10px 14px', borderRadius: 10, background: 'var(--bg-card)', border: '1px solid var(--border-color)', fontSize: 13, color: 'var(--text-primary)', display: 'flex', justifyContent: 'space-between' }}>
                      <span>Skill Passport Hash</span>
                      <span style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontSize: 11.5, fontWeight: 700 }}>[SIMULATED]</span>
                    </div>
                  </>
                ) : activeRole === 'colleges' ? (
                  <>
                    <div style={{ padding: '10px 14px', borderRadius: 10, background: 'var(--bg-card)', border: '1px solid var(--border-color)', fontSize: 13, color: 'var(--text-primary)', display: 'flex', justifyContent: 'space-between' }}>
                      <span>1,240 Students Active</span>
                      <span style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontSize: 11.5, fontWeight: 700 }}>[SAMPLE DATA]</span>
                    </div>
                    <div style={{ padding: '10px 14px', borderRadius: 10, background: 'var(--bg-card)', border: '1px solid var(--border-color)', fontSize: 13, color: 'var(--text-primary)', display: 'flex', justifyContent: 'space-between' }}>
                      <span>42 Enterprise Recruiters</span>
                      <span style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontSize: 11.5, fontWeight: 700 }}>[SAMPLE DATA]</span>
                    </div>
                    <div style={{ padding: '10px 14px', borderRadius: 10, background: 'var(--bg-card)', border: '1px solid var(--border-color)', fontSize: 13, color: 'var(--text-primary)', display: 'flex', justifyContent: 'space-between' }}>
                      <span>98.4% Mock Interview Pass</span>
                      <span style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontSize: 11.5, fontWeight: 700 }}>[SAMPLE DATA]</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ padding: '10px 14px', borderRadius: 10, background: 'var(--bg-card)', border: '1px solid var(--border-color)', fontSize: 13, color: 'var(--text-primary)', display: 'flex', justifyContent: 'space-between' }}>
                      <span>Talent Pool: Verified Engineers</span>
                      <span style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontSize: 11.5, fontWeight: 700 }}>[DEMO]</span>
                    </div>
                    <div style={{ padding: '10px 14px', borderRadius: 10, background: 'var(--bg-card)', border: '1px solid var(--border-color)', fontSize: 13, color: 'var(--text-primary)', display: 'flex', justifyContent: 'space-between' }}>
                      <span>Benchmark Code Scores</span>
                      <span style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontSize: 11.5, fontWeight: 700 }}>[DEMO]</span>
                    </div>
                    <div style={{ padding: '10px 14px', borderRadius: 10, background: 'var(--bg-card)', border: '1px solid var(--border-color)', fontSize: 13, color: 'var(--text-primary)', display: 'flex', justifyContent: 'space-between' }}>
                      <span>Instant Interview Scheduling</span>
                      <span style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontSize: 11.5, fontWeight: 700 }}>[DEMO]</span>
                    </div>
                  </>
                )}
              </div>

              <div style={{ padding: 10, borderRadius: 10, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)', textAlign: 'center', fontSize: 12.5, color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                ⚡ Interactive Simulation Preview
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}