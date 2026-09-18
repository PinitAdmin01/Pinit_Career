'use client';

import React, { useState } from 'react';
import { toast } from '@/lib/store/useAppStore';
import { CS } from './types';
import { setUserSoundscapeVolume } from '@/lib/audio/soundscapes';

interface SettingsTabProps {
  soundscapeVol: number;
  setSoundscapeVol: (vol: number) => void;
}

export default function SettingsTab({ soundscapeVol, setSoundscapeVol }: SettingsTabProps) {
  const [calibratedRms, setCalibratedRms] = useState<number | null>(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }} className="animate-fade-in">
      {/* Card 1: Guided Story Mode Replay */}
      <div style={CS.card}>
        <div style={CS.cardTitle}>✨ Career Story Tour & Onboarding Walkthrough</div>
        <div style={{ fontSize: 12, color: 'var(--t3)', marginBottom: 14, lineHeight: 1.5 }}>
          Replay the full interactive guided tour of all platform tabs with your active 3D mentor. This introduces every feature, tab, and gamified mechanism step-by-step.
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg3)', padding: '14px 18px', borderRadius: 12, border: '1px solid var(--border)' }}>
          <div>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)' }}>Launch Tab Tour</span>
            <div style={{ fontSize: 11, color: 'var(--accent)', marginTop: 2 }}>
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
              fontSize: 12.5,
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
      <div style={CS.card}>
        <div style={CS.cardTitle}>🎙️ Voice Registration & Microphone Calibration</div>
        <div style={{ fontSize: 12, color: 'var(--t3)', marginBottom: 14, lineHeight: 1.5 }}>
          Calibrate your microphone sensitivity and verify your speech recognition baseline for AI mock interviews and voice-assisted problem solving.
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, background: 'var(--bg3)', padding: '16px', borderRadius: 12, border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)' }}>Voice Biometric Status</div>
              {calibratedRms !== null ? (
                <div style={{ fontSize: 11, color: 'var(--green)', fontWeight: 600, marginTop: 2 }}>
                  ✓ Microphone active &amp; calibrated ({calibratedRms.toFixed(2)} RMS)
                </div>
              ) : (
                <div style={{ fontSize: 11, color: 'var(--t3)', fontWeight: 500, marginTop: 2 }}>
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
                fontSize: 12,
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
          <div style={{ fontSize: 12, color: 'var(--t3)', marginBottom: 14, lineHeight: 1.5 }}>
            Gamification events trigger celebratory confetti and encouraging mentor remarks upon completing quests, passing mock interviews, or reaching new ranks.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg3)', padding: '14px 18px', borderRadius: 12, border: '1px solid var(--border)' }}>
            <div>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)' }}>Test Celebration FX</span>
              <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 2 }}>
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
                fontSize: 12.5,
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

      {/* Card 4: Soundscape & Background Audio Volume */}
      <div style={CS.card}>
        <div style={CS.cardTitle}>🔊 Audio & Ambient Soundscapes</div>
        <div style={{ fontSize: 12, color: 'var(--t3)', marginBottom: 14, lineHeight: 1.5 }}>
          Adjust the ambient background focus audio and mentor sound effects.
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, background: 'var(--bg3)', padding: '16px', borderRadius: 12, border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, fontWeight: 700, color: 'var(--t1)' }}>
            <span>Ambient Volume</span>
            <span>{Math.round(soundscapeVol * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={soundscapeVol}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              setSoundscapeVol(val);
              setUserSoundscapeVolume(val);
            }}
            style={{ width: '100%', accentColor: 'var(--accent)', cursor: 'pointer' }}
          />
        </div>
      </div>
    </div>
  );
}
