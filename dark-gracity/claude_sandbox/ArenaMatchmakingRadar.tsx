'use client';

// ─────────────────────────────────────────────────────────────────────────────
// ArenaMatchmakingRadar — E-Sports Radar/Scanning Widget for 1v1 Quick Match
// ─────────────────────────────────────────────────────────────────────────────
// Target destination: src/components/pins/ArenaMatchmakingRadar.tsx
//
// Animated radar/sonar widget that appears when a student queues for 1v1 Quick Match.
// Shows pulsing concentric rings, a sweeping radar beam, and scanning dots representing
// online engineers. Displays a countdown timer and a big button to switch to "🤖 Spar
// with Turing Benchmark AI" after the 15-second search timeout.
//
// Props: None (fully self-contained, listens to global state via context or parent props).
//
// Usage (in ArenaContent page.tsx, inside the Quick Match lobby):
//   <ArenaMatchmakingRadar
//     isQueueing={isQueueing}
//     queueSeconds={queueSeconds}
//     onSwitchToAiSparring={handleStartSoloSparring}
//   />
// ─────────────────────────────────────────────────────────────────────────────

import React, { useEffect, useRef, useState } from 'react';

/**
 * Radar scan states
 */
type RadarState = 'scanning' | 'timeout' | 'ai_sparring';

/**
 * Engineer / opponent dot with position and animation phase
 */
interface Engineer {
  id: number;
  angle: number;
  distance: number;
  speed: number;
}

/**
 * Radar configuration
 */
const RADAR_CONFIG = {
  // Ring radii as percentages of the radar container width
  ringRadii: [0.3, 0.55, 0.8] as const,
  // Beam sweep speed in degrees per ms (slower = smoother)
  beamSpeedDegPerMs: 0.08,
  // Dot density (how many engineers scanning)
  dotCount: 12,
  // Pulse animation duration in ms
  pulseDuration: 2000,
  // Scan completion timeout in seconds (15s after which AI sparring appears)
  scanTimeoutSeconds: 15,
  // Hover pulse enlargement factor
  hoverScale: 1.15,
} as const;

/**
 * ArenaMatchmakingRadar - Rad scanning widget
 * Shows pulsing rings, sweeping beam, and engineering dots for the Quick Match queue.
 */
export interface ArenaMatchmakingRadarProps {
  isQueueing: boolean;
  queueSeconds: number;
  /** Called when the AI Sparring button is clicked */
  onSwitchToAiSparring: () => void;
  /** Optional: current student's pins display */
  studentPins?: number;
}

export default function ArenaMatchmakingRadar({
  isQueueing,
  queueSeconds,
  onSwitchToAiSparring,
  studentPins,
}: ArenaMatchmakingRadarProps) {
  const radarRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<RadarState>('scanning');
  const [engineers, setEngineers] = useState<Engineer[]>([]);
  const radarAngleRef = useRef<number>(0);
  const pulsePhaseRef = useRef<number>(0);

  // ── Initialize engineer positions on mount ─────────────────────────────
  useEffect(() => {
    if (!isQueueing) return;

    const count = RADAR_CONFIG.dotCount;
    const engineers: Engineer[] = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radiusIndex = i % 3;
      const radius = RADAR_CONFIG.ringRadii[radiusIndex];
      engineers.push({
        id: i,
        angle,
        distance: radius,
        speed: 0.5 + (Math.random() * 0.3),
      });
    }
    setEngineers(engineers);
  }, [isQueueing]);

  // ── State transitions ─────────────────────────────────────────────────
  useEffect(() => {
    if (!isQueueing) {
      setState('scanning');
      radarAngleRef.current = 0;
      pulsePhaseRef.current = 0;
      return;
    }

    // If we've been queueing for >= timeout seconds, show AI sparring option
    const timeoutMs = RADAR_CONFIG.scanTimeoutSeconds * 1000;
    const queueStart = queueSeconds * 1000;

    if (queueSeconds >= RADAR_CONFIG.scanTimeoutSeconds && state !== 'ai_sparring') {
      setState('timeout');
    } else if (queueSeconds < RADAR_CONFIG.scanTimeoutSeconds && state === 'timeout') {
      // Reset back to scanning if user acts before timeout completes
      setState('scanning');
    } else {
      setState('scanning');
    }
  }, [isQueueing, queueSeconds, state]);

  // ── Radar beam sweep animation ────────────────────────────────────────
  useEffect(() => {
    if (state !== 'scanning') return;

    const handleAnimation = () => {
      if (state !== 'scanning') return;
      radarAngleRef.current = (radarAngleRef.current + RADAR_CONFIG.beamSpeedDegPerMs) % 360;
      pulsePhaseRef.current = (pulsePhaseRef.current + 16) % RADAR_CONFIG.pulseDuration;
      requestAnimationFrame(handleAnimation);
    };

    requestAnimationFrame(handleAnimation);
  }, [state]);

  // ── Engineer positions update (rotating dots) ─────────────────────────
  useEffect(() => {
    if (state !== 'scanning') return;

    const updateEngineers = () => {
      if (state !== 'scanning') return;

      const angleStep = (Math.PI * 2) / engineers.length;
      const timeFactor = Date.now() / 500; // rotate every 500ms

      const updated = engineers.map((eng, i) => {
        const baseAngle = eng.angle;
        const offset = (timeFactor * eng.speed) % (Math.PI * 2);
        const currentAngle = (baseAngle + offset) % (Math.PI * 2);
        const ringIdx = Math.floor(i / (engineers.length / 3));
        const radius = RADAR_CONFIG.ringRadii[ringIdx % 3];
        const pulse = Math.abs(Math.sin((Date.now() / 300 + i) % RADAR_CONFIG.pulseDuration)) * 0.2 + 0.8;
        const distance = radius * pulse;

        return {
          ...eng,
          angle: currentAngle,
          distance,
        };
      });

      setEngineers(updated);
      requestAnimationFrame(updateEngineers);
    };

    updateEngineers();
    const id = setInterval(updateEngineers, 50);
    return () => clearInterval(id);
  }, [engineers, state]);

  // ── Countdown timer logic ─────────────────────────────────────────────
  const remainingSeconds = Math.max(0, RADAR_CONFIG.scanTimeoutSeconds - queueSeconds);

  if (!isQueueing || state === 'ai_sparring') {
    return null;
  }

  return (
    <div
      ref={radarRef}
      style={{
        position: 'relative',
        inset: 'auto',
        margin: '0 auto',
        width: isQueueing ? 360 : 0,
        height: isQueueing ? 360 : 0,
        minWidth: 300,
        minHeight: 300,
        // Center it in the quick-match card
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      aria-role="status"
      aria-label={`Matchmaking radar scanning — ${remainingSeconds}s remaining`}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 200 200"
        style={{
          width: '100%',
          height: '100%',
        }}
      >
        {/* ── Background concentric rings ───────────────────────────────── */}
        <g stroke="rgba(99, 102, 241, 0.4)" strokeWidth={1} fill="none">
          {RADAR_CONFIG.ringRadii.map((radius, i) => {
            const percent = radius * 100;
            return (
              <circle
                key={i}
                cx={100}
                cy={100}
                r={percent}
                style={{
                  strokeDasharray: '8 8',
                  strokeWidth: i === 2 ? 2 : 1,
                  opacity: 0.3 + i * 0.15,
                  animation: `ringPulse ${RADAR_CONFIG.pulseDuration}ms ease-in-out infinite`,
                }}
              />
            );
          })}
        </g>

        {/* ── Scanning dots (engineers) ─────────────────────────────────── */}
        {engineers.map((eng) => {
          const x = 100 + eng.distance * 90 * Math.cos(eng.angle);
          const y = 100 + eng.distance * 90 * Math.sin(eng.angle);
          const size = 6 + Math.sin(pulsePhaseRef.current / 2 + eng.id) * 4;

          return (
            <circle
              key={eng.id}
              cx={x}
              cy={y}
              r={size}
              fill="rgba(245, 158, 11, 0.8)"
              style={{
                transition: `opacity 0.2s, transform 0.2s`,
                opacity: 0.7 + Math.random() * 0.3,
              }}
            />
          );
        })}

        {/* ── Radar dish outer ring ─────────────────────────────────────── */}
        <circle
          cx={100}
          cy={100}
          r={90}
          fill="none"
          stroke="rgba(99, 102, 241, 0.6)"
          strokeWidth={2}
        />

        {/* ── Rotating radar beam ───────────────────────────────────────── */}
        <g transform-origin="100 100">
          <line
            x1={100}
            y1={100}
            x2={100 + 90 * Math.cos((radarAngleRef.current * Math.PI) / 180)}
            y2={100 - 90 * Math.sin((radarAngleRef.current * Math.PI) / 180)}
            stroke="rgba(245, 158, 11, 0.9)"
            strokeWidth={3}
            strokeLinecap="round"
            style={{ animation: `beamSweep ${RADAR_CONFIG.pulseDuration / 2}s linear infinite` }}
          />
          {/* Arrowhead at beam tip */}
          <polygon
            points={[
              100 + 85 * Math.cos((radarAngleRef.current * Math.PI) / 180),
              100 - 85 * Math.sin((radarAngleRef.current * Math.PI) / 180),
              100 + 80 * Math.cos(((radarAngleRef.current + 30) * Math.PI) / 180),
              100 - 80 * Math.sin(((radarAngleRef.current + 30) * Math.PI) / 180),
              100 + 80 * Math.cos(((radarAngleRef.current - 30) * Math.PI) / 180),
              100 - 80 * Math.sin(((radarAngleRef.current - 30) * Math.PI) / 180),
            ]}
            fill="rgba(245, 158, 11, 0.9)"
          />
        </g>

        {/* ── Center glowing node ───────────────────────────────────────── */}
        <circle
          cx={100}
          cy={100}
          r={6}
          fill="rgba(99, 102, 241, 0.8)"
        />
      </svg>

      {/* ── Pulse glow overlay ──────────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          border: `4px solid rgba(245, 158, 11, 0.4)`,
          opacity: 0.4 + Math.sin(pulsePhaseRef.current / 2) * 0.2,
          animation: `pulseGlow ${RADAR_CONFIG.pulseDuration / 2}ms ease-in-out infinite`,
          pointerEvents: 'none',
        }}
      />

      {/* ── Search timer & AI Sparring button ───────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          bottom: -80,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
          color: 'var(--t2)',
        }}
      >
        <div style={{ fontSize: 12, textTransform: 'uppercase', color: '#818cf8' }}>
          SEARCHING FOR OPPONENT
        </div>
        <div style={{ fontSize: 36, fontWeight: 900, color: '#f59e0b' }}>
          {remainingSeconds}
        </div>
        <div style={{ fontSize: 11, textTransform: 'uppercase', color: '#a5b4fc' }}>
          {queueSeconds} / {RADAR_CONFIG.scanTimeoutSeconds}s
        </div>
      </div>

      {/* ── AI Sparring Call-to-Action ───────────────────────────────────── */}
      {state === 'timeout' && (
        <div
          style={{
            position: 'absolute',
            top: 10,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'linear-gradient(135deg, #f59e0b 0%, #eab308 100%)',
            border: 'none',
            color: '#000',
            fontWeight: 700,
            fontSize: 12,
            textTransform: 'uppercase',
            padding: '8px 20px',
            borderRadius: 20,
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(245, 158, 11, 0.35)',
            animation: 'pulse 1s ease-in-out infinite',
            pointerEvents: 'auto',
            zIndex: 10,
          }}
          onClick={onSwitchToAiSparring}
        >
          🤖 Spar with Turing Benchmark AI
        </div>
      )}
    </div>
  );
}

// ── Companion CSS Keyframes (merge into src/components/pins/pins.css) ─────────────

/*
@keyframes ringPulse {
  0%, 100% { opacity: 0.3 + 0.15 * 2; }
  50% { opacity: 0.3 + 0.15 * 0; }
}

@keyframes beamSweep {
  to { transform: rotate(360deg); }
}

@keyframes pulseGlow {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.6; }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.08); }
}
*/