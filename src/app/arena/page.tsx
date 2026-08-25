'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCareerOS } from '@/lib/context/CareerOSContext';
import { useAuth } from '@/lib/context/AuthContext';

export default function ChallengingArenaPage() {
  const router = useRouter();
  const { user } = useAuth();
  const cOS = useCareerOS();
  const { xp = 0, pins = 0 } = cOS || {};

  const [activeTab, setActiveTab] = useState<'all' | 'code_wars' | 'hackathons' | 'viva'>('all');

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 16px 60px' }}>
      
      {/* Header Banner */}
      <div style={{
        padding: '24px 28px',
        borderRadius: 20,
        marginBottom: 24,
        background: 'linear-gradient(135deg, rgba(99,102,241,0.14), rgba(236,72,153,0.08))',
        border: '1px solid rgba(99,102,241,0.25)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 16
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <span style={{ fontSize: 28 }}>⚔️</span>
            <h1 style={{ fontSize: 24, fontWeight: 900, color: 'var(--t1)', fontFamily: 'var(--font-display)', margin: 0 }}>
              Challenging Arena & Combat Center
            </h1>
          </div>
          <p style={{ margin: 0, fontSize: 13.5, color: 'var(--t2)', maxWidth: 680, lineHeight: 1.5 }}>
            Put your verified engineering capabilities to the test. Compete in 1v1 PvP algorithmic code battles, join multi-disciplinary hackathon squads, or defend your architecture in AI STAR mock interview vivas.
          </p>
        </div>

        {/* User Arena Telemetry */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ padding: '8px 16px', borderRadius: 12, background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)', textAlign: 'center' }}>
            <div style={{ fontSize: 10.5, fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase' }}>Arena XP</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--t1)', fontFamily: 'var(--font-mono)' }}>⚡ {xp}</div>
          </div>
          <div style={{ padding: '8px 16px', borderRadius: 12, background: 'rgba(234,179,8,0.12)', border: '1px solid rgba(234,179,8,0.25)', textAlign: 'center' }}>
            <div style={{ fontSize: 10.5, fontWeight: 800, color: '#eab308', textTransform: 'uppercase' }}>Combat Pins</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--t1)', fontFamily: 'var(--font-mono)' }}>🪙 {pins}</div>
          </div>
        </div>
      </div>

      {/* Arena Navigation Filter */}
      <div style={{
        display: 'flex',
        gap: 8,
        padding: '6px',
        borderRadius: 14,
        background: 'var(--bg2)',
        border: '1px solid var(--border)',
        marginBottom: 24,
        overflowX: 'auto'
      }}>
        {[
          { id: 'all', label: '🌟 All Combat Modes', count: '3 Modes' },
          { id: 'code_wars', label: '⚔️ 1v1 Code Wars', count: 'Live PvP' },
          { id: 'hackathons', label: '🚀 Hackathon Squads', count: 'Squad Collab' },
          { id: 'viva', label: '🎙️ AI STAR Viva Defenses', count: 'Live Voice' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              flex: 1,
              minWidth: 160,
              padding: '10px 14px',
              borderRadius: 10,
              border: activeTab === tab.id ? '1.5px solid var(--accent)' : '1px solid transparent',
              background: activeTab === tab.id
                ? 'linear-gradient(135deg, rgba(99,102,241,0.22), rgba(168,85,247,0.15))'
                : 'transparent',
              color: activeTab === tab.id ? '#fff' : 'var(--t2)',
              fontWeight: 800,
              fontSize: 12.5,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              transition: 'all 0.15s'
            }}
          >
            <span>{tab.label}</span>
            <span style={{ fontSize: 10, opacity: 0.7, padding: '2px 6px', borderRadius: 6, background: 'rgba(255,255,255,0.08)' }}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Grid of Main Arena Launchers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20 }}>

        {/* 1. Code Wars Launcher Card */}
        {(activeTab === 'all' || activeTab === 'code_wars') && (
          <div style={{
            padding: 24,
            borderRadius: 18,
            background: 'var(--bg2)',
            border: '1.5px solid rgba(239,68,68,0.25)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: 16
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: 32 }}>⚔️</span>
                <span style={{ fontSize: 11, fontWeight: 900, color: '#ef4444', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', padding: '3px 10px', borderRadius: 8 }}>
                  1v1 PVP ARENA
                </span>
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--t1)', margin: '0 0 8px' }}>
                Algorithmic Code Wars
              </h3>
              <p style={{ fontSize: 13, color: 'var(--t3)', lineHeight: 1.5, margin: 0 }}>
                Compete against rival engineers in real-time matchmaking. Solve complex algorithmic challenges, optimize time complexity, and climb the global ELO ladder.
              </p>

              <div style={{ marginTop: 16, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {['Live Sandboxed Tests', 'Elo Ratings', 'Anti-Cheat Guards', 'Multi-Language'].map((tag) => (
                  <span key={tag} style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--t2)', background: 'var(--bg3)', padding: '2px 8px', borderRadius: 6 }}>
                    ✓ {tag}
                  </span>
                ))}
              </div>
            </div>

            <Link
              href="/code-wars"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '12px 18px',
                borderRadius: 12,
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                color: '#fff',
                fontWeight: 800,
                fontSize: 13,
                textDecoration: 'none',
                boxShadow: '0 4px 14px rgba(239,68,68,0.3)',
                transition: 'transform 0.15s'
              }}
            >
              🚀 Enter 1v1 Code Wars Arena ➔
            </Link>
          </div>
        )}

        {/* 2. Hackathon Teams Launcher Card */}
        {(activeTab === 'all' || activeTab === 'hackathons') && (
          <div style={{
            padding: 24,
            borderRadius: 18,
            background: 'var(--bg2)',
            border: '1.5px solid rgba(168,85,247,0.25)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: 16
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: 32 }}>🚀</span>
                <span style={{ fontSize: 11, fontWeight: 900, color: '#a855f7', background: 'rgba(168,85,247,0.12)', border: '1px solid rgba(168,85,247,0.25)', padding: '3px 10px', borderRadius: 8 }}>
                  SQUAD COLLABORATION
                </span>
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--t1)', margin: '0 0 8px' }}>
                Hackathon Squads & Team Hub
              </h3>
              <p style={{ fontSize: 13, color: 'var(--t3)', lineHeight: 1.5, margin: 0 }}>
                Assemble high-performance 3-person squads with Frontend, Backend, and AI Lead roles. Build production-grade capstone products and submit to corporate bounties.
              </p>

              <div style={{ marginTop: 16, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {['Role Slot Allocation', 'Milestone Tracker', 'Team Chat', 'Industry Bounties'].map((tag) => (
                  <span key={tag} style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--t2)', background: 'var(--bg3)', padding: '2px 8px', borderRadius: 6 }}>
                    ✓ {tag}
                  </span>
                ))}
              </div>
            </div>

            <Link
              href="/teams"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '12px 18px',
                borderRadius: 12,
                background: 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)',
                color: '#fff',
                fontWeight: 800,
                fontSize: 13,
                textDecoration: 'none',
                boxShadow: '0 4px 14px rgba(168,85,247,0.3)',
                transition: 'transform 0.15s'
              }}
            >
              👥 Assemble Hackathon Squad ➔
            </Link>
          </div>
        )}

        {/* 3. AI Mock Interview Viva Defenses */}
        {(activeTab === 'all' || activeTab === 'viva') && (
          <div style={{
            padding: 24,
            borderRadius: 18,
            background: 'var(--bg2)',
            border: '1.5px solid rgba(59,130,246,0.25)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: 16
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: 32 }}>🎙️</span>
                <span style={{ fontSize: 11, fontWeight: 900, color: '#3b82f6', background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.25)', padding: '3px 10px', borderRadius: 8 }}>
                  LIVE AI DEFENSE
                </span>
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--t1)', margin: '0 0 8px' }}>
                AI STAR Mock Interview Viva
              </h3>
              <p style={{ fontSize: 13, color: 'var(--t3)', lineHeight: 1.5, margin: 0 }}>
                Face off against strict corporate AI recruiters with full voice-to-voice interaction. Defend your code, build architecture canvases, and answer high-pressure STAR behavioral drills.
              </p>

              <div style={{ marginTop: 16, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {['STAR Methodology', 'System Design Canvas', 'Live Voice STT/TTS', 'Recruiter Personas'].map((tag) => (
                  <span key={tag} style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--t2)', background: 'var(--bg3)', padding: '2px 8px', borderRadius: 6 }}>
                    ✓ {tag}
                  </span>
                ))}
              </div>
            </div>

            <Link
              href="/interview"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '12px 18px',
                borderRadius: 12,
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                color: '#fff',
                fontWeight: 800,
                fontSize: 13,
                textDecoration: 'none',
                boxShadow: '0 4px 14px rgba(59,130,246,0.3)',
                transition: 'transform 0.15s'
              }}
            >
              🎤 Start AI Mock Interview Viva ➔
            </Link>
          </div>
        )}

      </div>

    </div>
  );
}
