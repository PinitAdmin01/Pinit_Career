'use client';

import React from 'react';

export default function ComparisonSplit() {
  const comparisons = [
    {
      dimension: 'Proof of Competence',
      oldWay: 'Unverified self-reported bullet points on a static PDF resume.',
      pinitWay: 'Cryptographically hashed test assertions, live GitHub commits & 30-day capstones.',
      icon: '🛡️'
    },
    {
      dimension: 'Learning & Mastery',
      oldWay: 'Passive 50-hour video courses with 92% student dropout rates.',
      pinitWay: 'Active Socratic AI voice mentors with 0 jargon and empathetic 3-step recovery ladders.',
      icon: '🧠'
    },
    {
      dimension: 'Recruiter Screening',
      oldWay: 'Black-box ATS algorithms discarding 95% of candidates based on keywords.',
      pinitWay: 'Direct candidate-to-job matching based on actual code execution benchmarks & Elo rank.',
      icon: '⚡'
    },
    {
      dimension: 'Skill Credentialing',
      oldWay: 'Static course completion PNG certificates with zero auditability.',
      pinitWay: 'Tamper-proof verifiable Skill Passports validated by enterprise hiring managers.',
      icon: '🏆'
    }
  ];

  return (
    <section className="lp-section" style={{ background: '#070a14', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="lp-container">
        
        <div className="lp-section-header">
          <div className="lp-badge-tag cyan">PARADIGM SHIFT</div>
          <h2 className="lp-section-title">
            The Resume is Broken.{' '}
            <span className="lp-gradient-text">Welcome to the Career OS.</span>
          </h2>
          <p className="lp-section-subtitle">
            Why the 20-year-old tradition of sending PDF resumes to ATS black holes is finally obsolete.
          </p>
        </div>

        <div className="comparison-grid">
          
          {/* ❌ The Broken Old Way */}
          <div className="comparison-card old-way">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(244,63,94,0.2)', paddingBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 24 }}>📄</span>
                <div>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 750, color: '#fca5a5' }}>The Broken Old Way</h3>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>Static PDF Resumes & ATS Black Holes</div>
                </div>
              </div>
              <span style={{ padding: '4px 10px', borderRadius: 999, background: 'rgba(244,63,94,0.15)', border: '1px solid rgba(244,63,94,0.3)', color: '#f87171', fontSize: 11, fontWeight: 700 }}>
                95% Rejection
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {comparisons.map((c, i) => (
                <div key={i} className="comparison-item">
                  <span style={{ color: '#f43f5e', fontSize: 14, fontWeight: 700 }}>✕</span>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#fecdd3', marginBottom: 2 }}>{c.dimension}</div>
                    <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.4 }}>{c.oldWay}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ padding: 12, borderRadius: 10, background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.15)', textAlign: 'center', fontSize: 11, color: '#fda4af', fontStyle: 'italic' }}>
              "Spent 6 months sending 400 resumes, received 3 automated rejection emails."
            </div>
          </div>

          {/* ✅ The PinIT Way */}
          <div className="comparison-card pinit-way">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(0,163,255,0.25)', paddingBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 24 }}>⚡</span>
                <div>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 750, color: '#ffffff' }}>The PinIT Career OS Way</h3>
                  <div style={{ fontSize: 11, color: '#7ecbff' }}>Verifiable Identity & Socratic Intelligence</div>
                </div>
              </div>
              <span style={{ padding: '4px 10px', borderRadius: 999, background: 'rgba(0,163,255,0.15)', border: '1px solid rgba(0,163,255,0.4)', color: '#7ecbff', fontSize: 11, fontWeight: 700 }}>
                Top 5% Placement
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {comparisons.map((c, i) => (
                <div key={i} className="comparison-item" style={{ borderColor: 'rgba(0,163,255,0.2)' }}>
                  <span style={{ color: '#10b981', fontSize: 14, fontWeight: 700 }}>✓</span>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#7ecbff', marginBottom: 2 }}>{c.icon} {c.dimension}</div>
                    <div style={{ fontSize: 12, color: '#e2e8f0', lineHeight: 1.4 }}>{c.pinitWay}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ padding: 12, borderRadius: 10, background: 'rgba(0,163,255,0.1)', border: '1px solid rgba(0,163,255,0.3)', textAlign: 'center', fontSize: 11, color: '#7ecbff' }}>
              ⚡ Recruiter Match: "Candidate completed 30-Day Java & Distributed Systems Capstone with 100% test assertions passed."
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
