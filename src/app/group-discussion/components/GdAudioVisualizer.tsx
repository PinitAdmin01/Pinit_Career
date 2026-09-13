'use client';

import React, { useEffect, useRef } from 'react';

interface GdAudioVisualizerProps {
  active: boolean;
  isSpeaking?: boolean;
  color?: string;
  height?: number;
  barCount?: number;
}

export default function GdAudioVisualizer({
  active,
  isSpeaking = false,
  color = 'var(--teal)',
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

        const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0.2)');

        ctx.fillStyle = active ? gradient : 'rgba(255, 255, 255, 0.1)';
        ctx.beginPath();
        ctx.roundRect ? ctx.roundRect(x, y, barWidth, barHeight, 2) : ctx.rect(x, y, barWidth, barHeight);
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
      if (ctx) {
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
