'use client';

import React from 'react';
import Image from 'next/image';

export interface OnboardingIntroProps {
  mode: 'CHOOSE_GUIDE' | 'INTENT_SELECTION';
  selectedMentor: string;
  setSelectedMentor: (mentor: string) => void;
  onStartDeepDiagnostics: () => void;
  onOpenVault: () => void;
  onOpenExpress: () => void;
  onFastComplete?: () => void;
  isAdmin?: boolean;
  syncing?: boolean;
  // INTENT_SELECTION specific props
  voiceConfidence?: number | null;
  voiceArticulation?: number | null;
  voiceArchetype?: string | null;
  onChangeGuide?: () => void;
  onRepeatVoice?: () => void;
  onSkipOnboarding?: () => void;
}

export default function OnboardingIntro({
  mode,
  selectedMentor,
  setSelectedMentor,
  onStartDeepDiagnostics,
  onOpenVault,
  onOpenExpress,
  onFastComplete,
  isAdmin = false,
  syncing = false,
  voiceConfidence = null,
  voiceArticulation = null,
  voiceArchetype = null,
  onChangeGuide,
  onRepeatVoice,
  onSkipOnboarding
}: OnboardingIntroProps) {
  if (mode === 'CHOOSE_GUIDE') {
    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: '#030508', color: 'var(--text)', display: 'flex', flexDirection: 'column', overflowY: 'auto', padding: '60px 24px' }}>
        {/* Dynamic Background Mesh Orbits */}
        <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(var(--brand-rgb),0.1) 0%, transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(var(--accent-cyan-rgb),0.06) 0%, transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: '95%', width: '95%', margin: '0 auto', zIndex: 10, textAlign: 'center' }}>
          {/* Logo Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 40 }}>
            <span className="lp-brand-lockup" style={{ height: 48, padding: '3px 8px' }}>
              <Image src="/brand/pinit-career-logo.png" alt="PINIT CAREER" width={180} height={40} className="lp-brand-logo" style={{ height: 40, maxWidth: 180, width: 'auto', objectFit: 'contain' }} priority />
            </span>
          </div>

          <div style={{ marginBottom: 48 }}>
            <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 700, display: 'block', marginBottom: 12 }}>
              Career Diagnostic Onboarding
            </span>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-1.5px', color: 'var(--text)', marginBottom: 16 }}>
              Choose Your Guidance Mentor
            </h1>
            <p style={{ fontSize: 15, color: 'var(--t3)', maxWidth: 600, margin: '0 auto', lineHeight: 1.6, marginBottom: 16 }}>
              Select the personal AI guide that will calibrate your career roadmap, analyze your communication DNA, and lead your socratic assessments.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={onOpenVault}
                style={{
                  background: 'linear-gradient(135deg, var(--brand) 0%, var(--accent) 100%)',
                  border: 'none',
                  borderRadius: 100,
                  color: 'var(--card)',
                  fontSize: 12,
                  fontWeight: 800,
                  padding: '8px 20px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  boxShadow: '0 4px 16px rgba(var(--brand-rgb), 0.4)',
                  transition: 'transform 0.15s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                📁 Vault (Upload Resume & Docs)
              </button>
              <button
                type="button"
                onClick={onOpenExpress}
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(56, 189, 248, 0.4)',
                  borderRadius: 100,
                  color: '#bae6fd',
                  fontSize: 12,
                  fontWeight: 800,
                  padding: '8px 20px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                  transition: 'transform 0.15s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                ⚡ Express Route (1-Min Fast Track)
              </button>
              {isAdmin && onFastComplete && (
                <button
                  type="button"
                  onClick={onFastComplete}
                  disabled={syncing}
                  style={{
                    background: 'linear-gradient(135deg, var(--green) 0%, var(--green) 100%)',
                    border: 'none',
                    borderRadius: 100,
                    color: 'var(--card)',
                    fontSize: 12,
                    fontWeight: 800,
                    padding: '8px 20px',
                    cursor: syncing ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    boxShadow: '0 4px 16px rgba(var(--success-rgb), 0.4)',
                    transition: 'transform 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  ⚡ 1-Click Fast Complete (Admin Dev)
                </button>
              )}
              <div style={{
                fontSize: 11,
                fontFamily: 'var(--font-mono)',
                color: 'var(--teal)',
                background: 'rgba(var(--accent-teal-rgb), 0.1)',
                border: '1px solid rgba(var(--accent-teal-rgb), 0.25)',
                borderRadius: 100,
                padding: '6px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontWeight: 700
              }}>
                ✨ 3D Avatars & Voices Preloaded (0ms Lag)
              </div>
            </div>
          </div>

          {/* Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginBottom: 48 }}>
            {/* Ms. Priya */}
            <div
              onClick={() => {
                setSelectedMentor('priya');
                onStartDeepDiagnostics();
              }}
              style={{
                background: 'rgba(10, 15, 26, 0.4)',
                border: '1.5px solid rgba(255, 255, 255, 0.06)',
                borderRadius: 24,
                padding: 36,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent)';
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(var(--brand-rgb), 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
              }}
            >
              <div style={{ fontSize: 48, marginBottom: 20 }}>👩‍💼</div>
              <h2 style={{ fontSize: 22, fontWeight: 900, color: 'var(--t1)', marginBottom: 4 }}>Ms. Priya</h2>
              <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: 16 }}>
                Full-Stack Systems Mentor
              </span>
              <p style={{ fontSize: 13.5, color: 'var(--t3)', lineHeight: 1.6, margin: 0 }}>
                Specialized in systems design, databases, backend infrastructure, and interview preparation. Prefers analytical structure and deep socratic drilling.
              </p>
            </div>

            {/* Mr. Anish */}
            <div
              onClick={() => {
                setSelectedMentor('anish');
                onStartDeepDiagnostics();
              }}
              style={{
                background: 'rgba(10, 15, 26, 0.4)',
                border: '1.5px solid rgba(255, 255, 255, 0.06)',
                borderRadius: 24,
                padding: 36,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--teal)';
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(var(--accent-teal-rgb), 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
              }}
            >
              <div style={{ fontSize: 48, marginBottom: 20 }}>👨‍💼</div>
              <h2 style={{ fontSize: 22, fontWeight: 900, color: 'var(--t1)', marginBottom: 4 }}>Mr. Anish</h2>
              <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--teal)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: 16 }}>
                Interactive UX & Frontend Engineer
              </span>
              <p style={{ fontSize: 13.5, color: 'var(--t3)', lineHeight: 1.6, margin: 0 }}>
                Specialized in React, Next.js, responsive layouts, user experience, design systems, and rapid prototyping. Focuses on visual feedback and hands-on building.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // mode === 'INTENT_SELECTION'
  return (
    <div style={{ flex: 1, padding: '24px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'center', overflowY: 'auto' }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, letterSpacing: '-0.5px', color: 'var(--text)', marginBottom: 8 }}>
          Choose Your Diagnostic Track
        </h2>
        <p style={{ fontSize: 12.5, color: 'var(--t3)', lineHeight: 1.5 }}>
          Your session is initialized. Select your diagnostic track to calibrate your career blueprint.
        </p>
      </div>

      {/* Selection cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
        {/* Express Route Card */}
        <div
          onClick={onOpenExpress}
          style={{
            padding: 16,
            borderRadius: 14,
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.05)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            position: 'relative'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(var(--brand-rgb), 0.04)';
            e.currentTarget.style.borderColor = 'rgba(var(--brand-rgb), 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <span style={{ fontSize: 16 }}>⚡</span>
            <h3 style={{ fontSize: 14, fontWeight: 800, color: 'var(--t1)', margin: 0 }}>Express Route (1 Min)</h3>
          </div>
          <p style={{ fontSize: 11.5, color: 'var(--t3)', lineHeight: 1.4, margin: 0 }}>
            Upload resume PDF directly to extract baseline skills.
          </p>
        </div>

        {/* Deep Diagnostic Card */}
        <div
          onClick={onStartDeepDiagnostics}
          style={{
            padding: 16,
            borderRadius: 14,
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.05)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            position: 'relative'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(var(--accent-cyan-rgb), 0.04)';
            e.currentTarget.style.borderColor = 'rgba(var(--accent-cyan-rgb), 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <span style={{ fontSize: 16 }}>🔬</span>
            <h3 style={{ fontSize: 14, fontWeight: 800, color: 'var(--t1)', margin: 0 }}>Deep Evolution (15 Min)</h3>
          </div>
          <p style={{ fontSize: 11.5, color: 'var(--t3)', lineHeight: 1.4, margin: 0 }}>
            Complete full diagnostic profiling and assessments.
          </p>
        </div>
      </div>

      {/* Real-time Voice Analytics Card */}
      {voiceConfidence !== null && (
        <div style={{ background: 'rgba(var(--brand-rgb), 0.05)', border: '1.5px solid rgba(var(--brand-rgb), 0.2)', borderRadius: 14, padding: 14, marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ fontSize: 11.5, fontWeight: 800, color: 'var(--brand-bright)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>🎙️ Realtime Voice DNA:</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5 }}>
            <span style={{ color: 'var(--t3)' }}>Confidence Index:</span>
            <span style={{ color: 'var(--t1)', fontWeight: 700 }}>{voiceConfidence}%</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5 }}>
            <span style={{ color: 'var(--t3)' }}>Articulation Score:</span>
            <span style={{ color: 'var(--t1)', fontWeight: 700 }}>{voiceArticulation}%</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5 }}>
            <span style={{ color: 'var(--t3)' }}>Vocal Archetype:</span>
            <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{voiceArchetype}</span>
          </div>
        </div>
      )}

      {/* Utility buttons: Go Back and Repeat Voice */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <button
          type="button"
          onClick={onChangeGuide}
          style={{
            height: 38,
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 10,
            color: 'var(--border2)',
            fontSize: 12,
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.15s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
          }}
        >
          ← Change Guide
        </button>
        <button
          type="button"
          onClick={onRepeatVoice}
          style={{
            height: 38,
            background: 'rgba(var(--brand-rgb), 0.15)',
            border: '1px solid rgba(var(--brand-rgb), 0.3)',
            borderRadius: 10,
            color: 'var(--brand-bright)',
            fontSize: 12,
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.15s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(var(--brand-rgb), 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(var(--brand-rgb), 0.15)';
          }}
        >
          🎙️ Repeat Voice
        </button>
      </div>
    </div>
  );
}
