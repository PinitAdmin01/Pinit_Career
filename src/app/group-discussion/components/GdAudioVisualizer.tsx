'use client';

import React, { useEffect, useRef } from 'react';

interface GdAudioVisualizerProps {
  active: boolean;
  isSpeaking?: boolean;
  color?: string;
  height?: number;
  barCount?: number;
}

function resolveCanvasColor(inputColor?: string): string {
  if (!inputColor) return '#0891b2';
  const trimmed = inputColor.trim();
  if (trimmed.includes('var(')) {
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      try {
        const varMatch = trimmed.match(/var\((--[^)]+)\)/);
        if (varMatch && varMatch[1]) {
          const propName = varMatch[1].trim();
          const docVal = getComputedStyle(document.documentElement).getPropertyValue(propName).trim();
          if (docVal && (docVal.startsWith('#') || docVal.startsWith('rgb'))) return docVal;
          if (document.body) {
            const bodyVal = getComputedStyle(document.body).getPropertyValue(propName).trim();
            if (bodyVal && (bodyVal.startsWith('#') || bodyVal.startsWith('rgb'))) return bodyVal;
          }
        }
      } catch {}
    }
    if (trimmed.includes('--danger') || trimmed.includes('--rose') || trimmed.includes('--red')) return '#ef4444';
    if (trimmed.includes('--accent') || trimmed.includes('--primary') || trimmed.includes('--blue')) return '#0284c7';
    if (trimmed.includes('--amber') || trimmed.includes('--warning') || trimmed.includes('--orange')) return '#f59e0b';
    if (trimmed.includes('--green') || trimmed.includes('--emerald')) return '#10b981';
    if (trimmed.includes('--teal')) return '#0891b2';
    if (trimmed.includes('--purple')) return '#a855f7';
    return '#0891b2';
  }
  if (trimmed.startsWith('#') || trimmed.startsWith('rgb')) return trimmed;
  return '#0891b2';
}

export default function GdAudioVisualizer({
  active,
  isSpeaking = false,
  color = '#14b8a6',
  height = 36,
  barCount = 28
}: GdAudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let phase = 0;
    const safeColor = resolveCanvasColor(color);

    const render = () => {
      const width = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, width, h);

      const barWidth = Math.max(2, (width / barCount) - 2);

      for (let i = 0; i < barCount; i++) {
        let barHeight = 4;
        if (active) {
          const wave = Math.sin(phase + i * 0.45) * 0.5 + 0.5;
          const randomFactor = isSpeaking ? (Math.sin(phase * 2 + i * 0.8) * 0.3 + 0.7) : 0.3;
          barHeight = Math.max(4, wave * (h - 6) * randomFactor);
        }

        const x = i * (barWidth + 2);
        const y = (h - barHeight) / 2;

        try {
          const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
          gradient.addColorStop(0, safeColor);
          gradient.addColorStop(1, 'rgba(255, 255, 255, 0.2)');
          ctx.fillStyle = active ? gradient : 'rgba(255, 255, 255, 0.1)';
        } catch {
          ctx.fillStyle = active ? '#0891b2' : 'rgba(255, 255, 255, 0.1)';
        }

        ctx.beginPath();
        if (typeof ctx.roundRect === 'function') {
          ctx.roundRect(x, y, barWidth, barHeight, 2);
        } else {
          ctx.rect(x, y, barWidth, barHeight);
        }
        ctx.fill();
      }

      phase += active ? (isSpeaking ? 0.18 : 0.08) : 0.02;
      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      if (ctx && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };
  }, [active, isSpeaking, color, barCount]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height }}>
      <canvas
        ref={canvasRef}
        width={180}
        height={height}
        style={{
          width: '100%',
          maxWidth: 220,
          height,
          display: 'block'
        }}
      />
    </div>
  );
}
