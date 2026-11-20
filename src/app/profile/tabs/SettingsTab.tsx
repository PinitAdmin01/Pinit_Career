'use client';

import React, { useState } from 'react';
import { toast } from '@/lib/store/useAppStore';
import { CS } from './types';

interface SettingsTabProps {
  soundscapeVol: number;
  setSoundscapeVol: (vol: number) => void;
  onLogout?: () => void;
  loggingOut?: boolean;
}

// Ambient volume is controlled once, in PreferencesTab (0–100%). Props kept for API compatibility.
export default function SettingsTab({ onLogout, loggingOut }: SettingsTabProps) {
  const [calibratedRms, setCalibratedRms] = useState<number | null>(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }} className="animate-fade-in">
      {/* Card 1: Guided Story Mode Replay */}
      <div style={CS.card}>
        <div style={CS.cardTitle}>✨ Career Story Tour & Onboarding Walkthrough</div>
        <div style={{ fontSize: 13, color: 'var(--t3)', marginBottom: 14, lineHeight: 1.5 }}>
          Replay the full interactive guided tour of all platform tabs with your active 3D mentor. This introduces every feature, tab, and gamified mechanism step-by-step.
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg3)', padding: '14px 18px', borderRadius: 12, border: '1px solid var(--border)' }}>
          <div>
            <span style={{ fontSize: 14.5, fontWeight: 700, color: 'var(--t1)' }}>Launch Tab Tour</span>
            <div style={{ fontSize: 12, color: 'var(--accent)', marginTop: 2 }}>
              Interactive voice-guided tour with your 3D Avatar
            </div>
          </div>
          <button
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('pinit:start_story_mode'));
                toast.success('Story Tour Started', 'Your 3D mentor is now guiding you through the platform tabs.');
              }
            }}
            style={{
              background: 'linear-gradient(135deg, var(--accent), var(--purple))',
              color: 'var(--text)',
              border: 'none',
              borderRadius: 10,
              padding: '8px 18px',
              fontSize: 14,
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(var(--brand-rgb), 0.3)',
              transition: 'all 0.15s'
            }}
          >
            🚀 Replay Story Tour
          </button>
        </div>
      </div>

      {/* Card 2: Voice Registration & Microphone Calibration */}
      <div id="profile-section-voice" style={{ ...CS.card, scrollMarginTop: 88 }}>
        <div style={CS.cardTitle}>🎙️ Voice Registration & Microphone Calibration</div>
        <div style={{ fontSize: 13, color: 'var(--t3)', marginBottom: 14, lineHeight: 1.5 }}>
          Calibrate your microphone sensitivity and verify your speech recognition baseline for AI mock interviews and voice-assisted problem solving.
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, background: 'var(--bg3)', padding: '16px', borderRadius: 12, border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
            <div>
              <div style={{ fontSize: 14.5, fontWeight: 700, color: 'var(--t1)' }}>Voice Biometric Status</div>
              {calibratedRms !== null ? (
                <div style={{ fontSize: 12, color: 'var(--green)', fontWeight: 600, marginTop: 2 }}>
                  ✓ Microphone active &amp; calibrated ({calibratedRms.toFixed(2)} RMS)
                </div>
              ) : (
                <div style={{ fontSize: 12, color: 'var(--t3)', fontWeight: 500, marginTop: 2 }}>
                  Microphone baseline uncalibrated for current session
                </div>
              )}
            </div>
            <button
              onClick={async () => {
                try {
                  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                  const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
                  const ctx = new AudioCtx();
                  const analyser = ctx.createAnalyser();
                  analyser.fftSize = 256;
                  const src = ctx.createMediaStreamSource(stream);
                  src.connect(analyser);
                  const buf = new Uint8Array(analyser.fftSize);
                  setTimeout(() => {
                    analyser.getByteTimeDomainData(buf);
                    let sum = 0;
                    for (let i = 0; i < buf.length; i++) {
                      const n = (buf[i] - 128) / 128;
                      sum += n * n;
                    }
                    const rms = Math.sqrt(sum / buf.length);
                    setCalibratedRms(rms);
                    stream.getTracks().forEach(t => t.stop());
                    ctx.close().catch(() => {});
                    toast.info('Microphone Checked', `Audio input level sampled (${rms.toFixed(2)} RMS). Speech recognition ready.`);
                  }, 400);
                } catch {
                  toast.error('Microphone Inaccessible', 'Could not access audio device. Please check browser permissions.');
                }
              }}
              style={{
                background: 'var(--bg2)',
                color: 'var(--t1)',
                border: '1px solid var(--border)',
                borderRadius: 10,
                padding: '8px 16px',
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              🎙️ Test Audio Level
            </button>
          </div>
        </div>
      </div>

      {/* Card 3: Celebration & Milestone Event Testing (Dev/Staging Only) */}
      {process.env.NODE_ENV !== 'production' && (
        <div style={CS.card}>
          <div style={CS.cardTitle}>🎉 Milestone Celebration FX (Dev Only)</div>
          <div style={{ fontSize: 13, color: 'var(--t3)', marginBottom: 14, lineHeight: 1.5 }}>
            Gamification events trigger celebratory confetti and encouraging mentor remarks upon completing quests, passing mock interviews, or reaching new ranks.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg3)', padding: '14px 18px', borderRadius: 12, border: '1px solid var(--border)' }}>
            <div>
              <span style={{ fontSize: 14.5, fontWeight: 700, color: 'var(--t1)' }}>Test Celebration FX</span>
              <div style={{ fontSize: 12, color: 'var(--t3)', marginTop: 2 }}>
                Triggers confetti burst and audio celebration
              </div>
            </div>
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(new CustomEvent('pinit:trigger_congrats'));
                  toast.success('Celebration Triggered', 'Milestone event executed with confetti FX.');
                }
              }}
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: 'var(--text)',
                border: 'none',
                borderRadius: 10,
                padding: '8px 18px',
                fontSize: 14,
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(var(--success-rgb), 0.3)',
                transition: 'all 0.15s'
              }}
            >
              🎉 Test Celebration
            </button>
          </div>
        </div>
      )}

      {/* Card 5: Session & Sign Out */}
      {onLogout && (
        <div style={{ ...CS.card, borderColor: 'rgba(var(--danger-rgb), 0.25)' }}>
          <div style={{ ...CS.cardTitle, color: 'var(--coral)' }}>🚪 Session &amp; Sign Out</div>
          <div style={{ fontSize: 13, color: 'var(--t3)', marginBottom: 14, lineHeight: 1.5 }}>
            Securely sign out of PinIT Career OS on this browser. All cached profile data, active session keys, and query memory will be cleared.
          </div>
          <button
            type="button"
            data-testid="settings-logout-btn"
            onClick={onLogout}
            disabled={loggingOut}
            className="btn-ghost btn-sm"
            style={{
              color: 'var(--coral)',
              borderColor: 'rgba(var(--danger-rgb), 0.35)',
              background: 'rgba(var(--danger-rgb), 0.08)',
              fontWeight: 700,
              cursor: loggingOut ? 'not-allowed' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            {loggingOut ? 'Signing out...' : '⏻ Sign Out Account'}
          </button>
        </div>
      )}
    </div>
  );
}
