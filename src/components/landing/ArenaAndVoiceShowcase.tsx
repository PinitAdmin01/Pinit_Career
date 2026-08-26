'use client';

import React from 'react';
import Link from 'next/link';

export default function ArenaAndVoiceShowcase() {
  return (
    <section className="lp-section" style={{ background: '#070a14', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
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
                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 750, color: '#ffffff' }}>Multiplayer Code Wars Arena</h3>
                    <div style={{ fontSize: 11, color: '#94a3b8' }}>Head-to-Head Algorithmic Duels</div>
                  </div>
                </div>
                <span style={{ padding: '2px 8px', borderRadius: 999, background: 'rgba(245,158,11,0.15)', color: '#fcd34d', border: '1px solid rgba(245,158,11,0.3)', fontSize: 10, fontFamily: 'monospace' }}>
                  LIVE MATCH
                </span>
              </div>

              <p style={{ margin: 0, fontSize: 12, color: '#94a3b8', lineHeight: 1.5 }}>
                Compete in real-time coding matches with students worldwide. Solve optimization challenges, pass automated test cases, and raise your global Elo rating.
              </p>

              {/* Match Visualizer */}
              <div style={{ padding: 14, borderRadius: 12, background: '#05070d', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: 10, fontSize: 11, fontFamily: 'monospace' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 8 }}>
                  <span style={{ color: '#e2e8f0' }}>Arjun (1620 Elo)</span>
                  <span style={{ color: '#f59e0b', fontWeight: 700 }}>VS</span>
                  <span style={{ color: '#e2e8f0' }}>Elena (1645 Elo)</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: 10, marginBottom: 2 }}>
                      <span>Arjun: 4/4 Tests</span>
                      <span style={{ color: '#10b981' }}>0.42s</span>
                    </div>
                    <div style={{ width: '100%', height: 4, background: '#1e293b', borderRadius: 999, overflow: 'hidden' }}>
                      <div style={{ width: '100%', height: '100%', background: '#10b981' }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: 10, marginBottom: 2 }}>
                      <span>Elena: 3/4 Tests</span>
                      <span style={{ color: '#00a3ff' }}>0.89s</span>
                    </div>
                    <div style={{ width: '100%', height: 4, background: '#1e293b', borderRadius: 999, overflow: 'hidden' }}>
                      <div style={{ width: '75%', height: '100%', background: '#00a3ff' }} />
                    </div>
                  </div>
                </div>

                <div style={{ padding: 6, borderRadius: 6, background: '#0e1422', textAlign: 'center', fontSize: 10, color: '#6ee7b7' }}>
                  🏆 Victory! +32 Elo Points Awarded
                </div>
              </div>
            </div>

            <Link
              href="/arena?tab=code_wars"
              style={{
                padding: '12px 18px',
                borderRadius: 12,
                background: 'linear-gradient(135deg, #f59e0b, #ea580c)',
                color: '#ffffff',
                fontWeight: 750,
                fontSize: 13,
                textDecoration: 'none',
                textAlign: 'center',
                display: 'block'
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
                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 750, color: '#ffffff' }}>AI Avatar Voice Studio</h3>
                    <div style={{ fontSize: 11, color: '#94a3b8' }}>24/7 Spoken Technical Mock Interviews</div>
                  </div>
                </div>
                <span style={{ padding: '2px 8px', borderRadius: 999, background: 'rgba(168,85,247,0.15)', color: '#d8b4fe', border: '1px solid rgba(168,85,247,0.3)', fontSize: 10, fontFamily: 'monospace' }}>
                  VOICE ACTIVE
                </span>
              </div>

              <p style={{ margin: 0, fontSize: 12, color: '#94a3b8', lineHeight: 1.5 }}>
                Practice live spoken technical interviews with Ms. Maya & Mr. Akash. Get instant evaluations on your technical depth, voice confidence, and clarity.
              </p>

              {/* Voice Mock Box */}
              <div style={{ padding: 14, borderRadius: 12, background: '#05070d', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
                    👩‍🏫
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#ffffff' }}>Ms. Maya • Principal Interviewer</div>
                    <div style={{ fontSize: 10, color: '#94a3b8', fontStyle: 'italic' }}>"Explain how Kafka guarantees message ordering across partitions."</div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', borderRadius: 8, background: '#0e1422', fontSize: 11, fontFamily: 'monospace' }}>
                  <span style={{ color: '#cbd5e1' }}>Speech Confidence:</span>
                  <span style={{ color: '#10b981', fontWeight: 700 }}>94% (Very High)</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', borderRadius: 8, background: '#0e1422', fontSize: 11, fontFamily: 'monospace' }}>
                  <span style={{ color: '#cbd5e1' }}>BLUF Structure & Clarity:</span>
                  <span style={{ color: '#00a3ff', fontWeight: 700 }}>91% (Executive)</span>
                </div>
              </div>
            </div>

            <Link
              href="/interview"
              style={{
                padding: '12px 18px',
                borderRadius: 12,
                background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                color: '#ffffff',
                fontWeight: 750,
                fontSize: 13,
                textDecoration: 'none',
                textAlign: 'center',
                display: 'block'
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
