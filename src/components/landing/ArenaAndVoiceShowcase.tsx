'use client';

import React from 'react';
import Link from 'next/link';

export default function ArenaAndVoiceShowcase() {
  return (
    <section className="lp-section">
      <div className="lp-container">
        
        <div className="lp-section-header">
          <div className="lp-badge-tag amber">GAMIFIED ARENA & SPEECH LAB</div>
          <h2 className="lp-section-title">
            Code Wars Arena &{' '}
            <span className="lp-gradient-text">AI Voice Interview Studio.</span>
          </h2>
          <p className="lp-section-subtitle">
            Prove your algorithmic speed under pressure and master spoken technical communication with live voice avatars.
          </p>
        </div>

        <div className="showcase-dual-grid">
          
          {/* Module 1: Code Wars Arena */}
          <div className="showcase-card">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 24 }}>⚔️</span>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 750, color: 'var(--text-primary)' }}>Multiplayer Code Wars Arena</h3>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Head-to-Head Algorithmic Duels</div>
                  </div>
                </div>
                <span style={{ padding: '3px 10px', borderRadius: 999, background: 'rgba(245,158,11,0.15)', color: 'var(--accent-amber)', border: '1px solid rgba(245,158,11,0.3)', fontSize: 10.5, fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                  LIVE MATCH
                </span>
              </div>

              <p style={{ margin: 0, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                Compete in real-time coding matches with students worldwide. Solve optimization challenges, pass automated test cases, and raise your global Elo rating.
              </p>

              {/* Match Visualizer */}
              <div style={{ padding: 16, borderRadius: 14, background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: 10, fontSize: 11.5, fontFamily: 'var(--font-mono)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: 8 }}>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>Arjun (1620 Elo)</span>
                  <span style={{ color: 'var(--accent-amber)', fontWeight: 800 }}>VS</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>Elena (1645 Elo)</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: 10.5, marginBottom: 3 }}>
                      <span>Arjun: 4/4 Tests</span>
                      <span style={{ color: 'var(--accent-green)', fontWeight: 700 }}>0.42s</span>
                    </div>
                    <div style={{ width: '100%', height: 5, background: 'var(--bg-card)', borderRadius: 999, overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                      <div style={{ width: '100%', height: '100%', background: 'var(--accent-green)' }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: 10.5, marginBottom: 3 }}>
                      <span>Elena: 3/4 Tests</span>
                      <span style={{ color: 'var(--accent)', fontWeight: 700 }}>0.89s</span>
                    </div>
                    <div style={{ width: '100%', height: 5, background: 'var(--bg-card)', borderRadius: 999, overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                      <div style={{ width: '75%', height: '100%', background: 'var(--accent)' }} />
                    </div>
                  </div>
                </div>

                <div style={{ padding: 8, borderRadius: 8, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', textAlign: 'center', fontSize: 11, color: 'var(--accent-green)', fontWeight: 700 }}>
                  🏆 Victory! +32 Elo Points Awarded
                </div>
              </div>
            </div>

            <Link
              href="/arena?tab=code_wars"
              style={{
                marginTop: 14,
                padding: '12px 18px',
                borderRadius: 12,
                background: 'linear-gradient(135deg, #f59e0b, #ea580c)',
                color: '#ffffff',
                fontWeight: 750,
                fontSize: 13,
                textDecoration: 'none',
                textAlign: 'center',
                display: 'block',
                boxShadow: '0 4px 14px rgba(245,158,11,0.3)'
              }}
            >
              Enter Code Wars Arena →
            </Link>
          </div>

          {/* Module 2: AI Voice Studio */}
          <div className="showcase-card">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 24 }}>🎙️</span>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 750, color: 'var(--text-primary)' }}>AI Avatar Voice Studio</h3>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>24/7 Spoken Technical Mock Interviews</div>
                  </div>
                </div>
                <span style={{ padding: '3px 10px', borderRadius: 999, background: 'rgba(168,85,247,0.15)', color: '#a855f7', border: '1px solid rgba(168,85,247,0.3)', fontSize: 10.5, fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                  VOICE ACTIVE
                </span>
              </div>

              <p style={{ margin: 0, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                Practice live spoken technical interviews with Ms. Maya & Mr. Akash. Get instant evaluations on your technical depth, voice confidence, and clarity.
              </p>

              {/* Voice Mock Box */}
              <div style={{ padding: 16, borderRadius: 14, background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
                    👩‍🏫
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 750, color: 'var(--text-primary)' }}>Ms. Maya • Principal Interviewer</div>
                    <div style={{ fontSize: 10.5, color: 'var(--text-secondary)', fontStyle: 'italic' }}>&ldquo;Explain how Kafka guarantees message ordering across partitions.&rdquo;</div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', borderRadius: 8, background: 'var(--bg-card)', border: '1px solid var(--border-color)', fontSize: 11.5, fontFamily: 'var(--font-mono)' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Speech Confidence:</span>
                  <span style={{ color: 'var(--accent-green)', fontWeight: 700 }}>94% (Very High)</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', borderRadius: 8, background: 'var(--bg-card)', border: '1px solid var(--border-color)', fontSize: 11.5, fontFamily: 'var(--font-mono)' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>BLUF Structure & Clarity:</span>
                  <span style={{ color: 'var(--accent)', fontWeight: 700 }}>91% (Executive)</span>
                </div>
              </div>
            </div>

            <Link
              href="/interview"
              style={{
                marginTop: 14,
                padding: '12px 18px',
                borderRadius: 12,
                background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                color: '#ffffff',
                fontWeight: 750,
                fontSize: 13,
                textDecoration: 'none',
                textAlign: 'center',
                display: 'block',
                boxShadow: '0 4px 14px rgba(124,58,237,0.3)'
              }}
            >
              Launch AI Voice Studio →
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
}
