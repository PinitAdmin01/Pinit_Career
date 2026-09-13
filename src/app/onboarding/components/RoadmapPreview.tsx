'use client';

import React from 'react';
import { QT2MindsetBreakdown } from '../types';

export interface RoadmapPreviewProps {
  studentType: string;
  targetGoal: string;
  accessReason: string;
  qt2Breakdown: QT2MindsetBreakdown;
  selectedMentor: string;
  setSelectedMentor: (mentor: string) => void;
  onActivateCommandCenter: (studentType: string, targetGoal: string, accessReason: string, blendTitle: string) => void;
  syncing?: boolean;
  syncProgress?: number;
  syncStatus?: string;
  parserLogs?: string[];
  isUploadedFile?: boolean;
}

export default function RoadmapPreview({
  studentType,
  targetGoal,
  accessReason,
  qt2Breakdown,
  selectedMentor,
  setSelectedMentor,
  onActivateCommandCenter,
  syncing = false,
  syncProgress = 0,
  syncStatus = '',
  parserLogs = [],
  isUploadedFile = false
}: RoadmapPreviewProps) {
  return (
    <>
      <div style={{ flex: 1, padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'center', overflowY: 'auto' }}>
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
            <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', background: 'rgba(var(--accent-teal-rgb), 0.1)', color: 'var(--teal)', padding: '3px 8px', borderRadius: 10, fontWeight: 700, textTransform: 'uppercase' }}>
              QT2 Mindset Analysis Complete
            </span>
            <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', background: 'rgba(var(--brand-rgb), 0.15)', color: 'var(--brand-bright)', padding: '3px 8px', borderRadius: 10, fontWeight: 700, textTransform: 'uppercase' }}>
              {studentType.includes('Commerce') || studentType.includes('B.Com') ? '📊 FinTech & Commerce Track (B.Com)' : studentType.includes('Management') || studentType.includes('BBA') ? '📈 Product & Business Track (BBA)' : '💻 Tech & Software Track'}
            </span>
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: 'var(--t1)', marginTop: 6, letterSpacing: '-0.6px' }}>
            {qt2Breakdown.blendTitle}
          </h2>
          <p style={{ fontSize: 12, color: 'var(--t3)', lineHeight: 1.5, marginTop: 4 }}>
            {qt2Breakdown.blendDescription}
          </p>
        </div>

        {/* 4 Quadrants Mindset Breakdown */}
        <div style={{ background: '#111827', border: '1px solid rgba(148,163,184,0.28)', borderRadius: 16, padding: 16, marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 800 }}>
              🧠 QT2 Cognitive Mindset Distribution:
            </div>
            <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', background: 'rgba(var(--brand-rgb), 0.12)', color: 'var(--brand-bright)', border: '1px solid rgba(var(--brand-rgb), 0.25)', borderRadius: 100, padding: '2px 8px', fontWeight: 700 }}>
              Self-Awareness Index: {qt2Breakdown.selfAwarenessScore}%
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: 12, marginBottom: 10 }}>
            {[
              { label: 'Pattern Hunter', icon: '🧩', score: qt2Breakdown.patternHunter, color: 'var(--brand)' },
              { label: 'Stabilizer', icon: '🛡️', score: qt2Breakdown.stabilizer, color: 'var(--green)' },
              { label: 'Social IQ', icon: '🤝', score: qt2Breakdown.socialIQ, color: 'var(--warning)' },
              { label: 'Explorer', icon: '🚀', score: qt2Breakdown.explorer, color: 'var(--accent-cyan)' }
            ].map(quad => (
              <div key={quad.label} style={{ background: '#1e293b', border: '1px solid rgba(148,163,184,0.28)', borderRadius: 12, padding: '10px 12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, fontWeight: 700, marginBottom: 6 }}>
                  <span style={{ color: 'var(--text)' }}>{quad.icon} {quad.label}</span>
                  <span style={{ color: quad.color, fontFamily: 'var(--font-mono)' }}>{quad.score}%</span>
                </div>
                <div style={{ height: 8, background: 'rgba(255,255,255,0.12)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${Math.max(quad.score, 4)}%`, background: quad.color, borderRadius: 4, transition: 'width 0.5s ease' }} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ fontSize: 10.5, color: 'var(--t3)', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>🎯 {qt2Breakdown.selfAwarenessLabel}</span>
          </div>
        </div>

        {/* Confirmed Guidance Mentor Companion */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <label style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '0.6px', fontFamily: 'var(--font-mono)' }}>
              Confirmed AI Guidance Companion
            </label>
            <span style={{ fontSize: 10, color: 'var(--teal)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>✓ Calibrated with Profile</span>
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1.5px solid rgba(var(--brand-rgb), 0.35)',
            borderRadius: 12,
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 4px 16px rgba(0,0,0,0.2)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 28 }}>{selectedMentor === 'priya' ? '👩‍💼' : '👨‍💼'}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--brand-bright)' }}>
                  {selectedMentor === 'priya' ? 'Ms. Priya' : 'Mr. Anish'}
                </div>
                <div style={{ fontSize: 11, color: 'var(--t3)' }}>
                  {selectedMentor === 'priya' ? 'Full-Stack Systems & Analytical Mentor' : 'Interactive UX & Frontend Engineer'}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSelectedMentor(selectedMentor === 'priya' ? 'anish' : 'priya')}
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: 'var(--text-muted)',
                borderRadius: 8,
                padding: '6px 12px',
                fontSize: 11,
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              title="Switch mentor companion"
            >
              Switch to {selectedMentor === 'priya' ? 'Mr. Anish' : 'Ms. Priya'}
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onActivateCommandCenter(studentType, targetGoal, accessReason, qt2Breakdown.blendTitle)}
          style={{
            width: '100%',
            height: 44,
            background: 'linear-gradient(135deg, var(--teal) 0%, var(--accent) 100%)',
            border: 'none',
            borderRadius: 12,
            color: 'var(--card)',
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(var(--accent-teal-rgb), 0.25)'
          }}
        >
          Activate Command Center &middot; Launch OS
        </button>
      </div>

      {/* Syncing / Parsing Terminal Progress Overlay */}
      {syncing && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(3,5,8,0.95)',
          backdropFilter: 'blur(16px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          {/* Glowing Spinner Ring */}
          <div style={{ position: 'relative', width: 100, height: 100, marginBottom: 24 }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '4px solid rgba(var(--brand-rgb),0.1)' }} />
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '4px solid transparent', borderTopColor: 'var(--accent)', animation: 'spin 1.2s linear infinite' }} />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 800, color: 'var(--accent)' }}>
              {syncProgress}%
            </div>
          </div>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 900, color: 'var(--t1)', marginBottom: 4, letterSpacing: '-0.5px' }}>
            {isUploadedFile ? 'Analyzing Resume & Credentials' : 'Orchestrating Trajectory OS'}
          </h2>
          <p style={{ fontSize: 13, color: 'var(--t3)', fontFamily: 'var(--font-mono)', textAlign: 'center', marginBottom: 24 }}>
            {syncStatus}
          </p>

          {/* Terminal Console Logs */}
          {parserLogs.length > 0 && (
            <div style={{
              width: '90%',
              maxWidth: 520,
              background: 'rgba(0,0,0,0.6)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 12,
              padding: 16,
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              color: 'var(--teal)',
              maxHeight: 140,
              overflowY: 'auto'
            }}>
              {parserLogs.map((log, i) => (
                <div key={i} style={{ marginBottom: 4, opacity: i === parserLogs.length - 1 ? 1 : 0.6 }}>
                  &gt; {log}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
