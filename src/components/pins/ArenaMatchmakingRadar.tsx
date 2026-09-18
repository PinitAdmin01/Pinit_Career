'use client';

import React, { useEffect, useState } from 'react';

export interface ArenaMatchmakingRadarProps {
  isQueueing: boolean;
  queueSeconds: number;
  onSwitchToAiSparring: () => void;
  studentPins?: number;
}

interface Blip {
  id: number;
  x: number;
  y: number;
  delay: number;
  size: number;
}

export default function ArenaMatchmakingRadar({
  isQueueing,
  queueSeconds,
  onSwitchToAiSparring,
}: ArenaMatchmakingRadarProps) {
  // Static scattered blip positions
  const [blips] = useState<Blip[]>([
    { id: 1, x: 55, y: 65, delay: 0.2, size: 4 },
    { id: 2, x: 120, y: 50, delay: 1.1, size: 5 },
    { id: 3, x: 130, y: 110, delay: 1.8, size: 4 },
    { id: 4, x: 40, y: 115, delay: 0.7, size: 3.5 },
    { id: 5, x: 95, y: 135, delay: 2.3, size: 4.5 },
    { id: 6, x: 75, y: 35, delay: 1.5, size: 3 },
  ]);

  if (!isQueueing) return null;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '4px 0',
      width: '100%',
      maxWidth: 240,
      margin: '0 auto',
    }}>
      {/* ── Radar Circle Frame ───────────────────────────────────── */}
      <div style={{
        position: 'relative',
        width: 160,
        height: 160,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(30, 27, 75, 0.95) 0%, rgba(15, 23, 42, 0.98) 75%)',
        border: '1.5px solid rgba(99, 102, 241, 0.45)',
        boxShadow: '0 0 20px rgba(99, 102, 241, 0.25), inset 0 0 16px rgba(79, 70, 229, 0.2)',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 12px',
      }}>
        {/* Radar Crosshairs */}
        <div style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: '50%',
          width: 1,
          background: 'rgba(99, 102, 241, 0.25)',
        }} />
        <div style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: '50%',
          height: 1,
          background: 'rgba(99, 102, 241, 0.25)',
        }} />

        {/* Concentric Rings */}
        <div style={{
          position: 'absolute',
          width: 44,
          height: 44,
          borderRadius: '50%',
          border: '1px dashed rgba(99, 102, 241, 0.35)',
        }} />
        <div style={{
          position: 'absolute',
          width: 88,
          height: 88,
          borderRadius: '50%',
          border: '1px solid rgba(99, 102, 241, 0.3)',
        }} />
        <div style={{
          position: 'absolute',
          width: 132,
          height: 132,
          borderRadius: '50%',
          border: '1px solid rgba(99, 102, 241, 0.25)',
        }} />

        {/* Rotating Radar Sweeping Conic Beam */}
        <div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: 'conic-gradient(from 0deg, rgba(99, 102, 241, 0) 0deg, rgba(99, 102, 241, 0) 280deg, rgba(129, 140, 248, 0.15) 330deg, rgba(165, 180, 252, 0.7) 360deg)',
          animation: 'beamSweep 2.2s linear infinite',
          pointerEvents: 'none',
        }} />

        {/* Pulsing Radar Blips (Online peers) */}
        {blips.map((blip) => (
          <div
            key={blip.id}
            style={{
              position: 'absolute',
              left: blip.x,
              top: blip.y,
              width: blip.size,
              height: blip.size,
              borderRadius: '50%',
              background: '#34d399',
              boxShadow: '0 0 8px #34d399',
              animation: 'pulseGlow 2s ease-in-out infinite',
              animationDelay: `${blip.delay}s`,
            }}
          />
        ))}

        {/* Center Origin Dot */}
        <div style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: '#818cf8',
          boxShadow: '0 0 10px #818cf8',
          zIndex: 2,
        }} />
      </div>

      {/* ── Status Info (Normal flow, strictly inside container) ── */}
      <div style={{ textAlign: 'center', marginBottom: 8 }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '3px 10px',
          borderRadius: 20,
          background: 'rgba(99, 102, 241, 0.15)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          color: '#a5b4fc',
          fontSize: 11,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          marginBottom: 6,
        }}>
          <span style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: '#34d399',
            boxShadow: '0 0 6px #34d399',
          }} />
          Searching for Opponent
        </div>

        <div style={{
          fontSize: 18,
          fontWeight: 800,
          fontFamily: 'monospace',
          color: '#fbbf24',
          letterSpacing: '1px',
        }}>
          00:{queueSeconds.toString().padStart(2, '0')} <span style={{ fontSize: 12, color: 'var(--t3)', fontWeight: 500 }}>/ 00:15</span>
        </div>
      </div>

      {/* ── 10s+ Turing AI Sparring Fallback CTA ─────────────────── */}
      {queueSeconds >= 10 && (
        <div style={{
          width: '100%',
          marginTop: 6,
          padding: '10px 12px',
          borderRadius: 10,
          background: 'rgba(245, 158, 11, 0.12)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          textAlign: 'center',
          animation: 'goldImpactShockwave 0.3s ease',
        }}>
          <div style={{ fontSize: 11, color: '#f59e0b', fontWeight: 600, marginBottom: 6 }}>
            No peer found yet.
          </div>
          <button
            onClick={onSwitchToAiSparring}
            style={{
              width: '100%',
              padding: '6px 12px',
              borderRadius: 6,
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              color: '#000',
              fontWeight: 800,
              fontSize: 12,
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            <span>🤖</span> Spar with Turing AI Instead
          </button>
        </div>
      )}
    </div>
  );
}
