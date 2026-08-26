'use client';

import React, { useEffect, useRef } from 'react';

interface DynamicSkyCanvasProps {
  theme: 'dark' | 'light';
  lastToggleTime: number; // 0 on initial load, timestamp on toggle
  opacity?: number;
}

interface Meteor {
  x: number;
  y: number;
  length: number;
  speed: number;
  size: number;
  opacity: number;
}

interface Star {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  twinkleSpeed: number;
}

interface BokehOrb {
  x: number;
  y: number;
  radius: number;
  baseRadius: number;
  alpha: number;
  speedY: number;
  speedX: number;
  phase: number;
}

interface Shockwave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  lineWidth: number;
}

export default function DynamicSkyCanvas({
  theme,
  lastToggleTime,
  opacity = 1
}: DynamicSkyCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Shockwave collection
    const shockwaves: Shockwave[] = [];
    const handleShockwaveEvent = (e: any) => {
      const { x, y } = e.detail || { x: width / 2, y: height / 2 };
      shockwaves.push({
        x,
        y,
        radius: 10,
        maxRadius: Math.min(width, height) * 0.75,
        alpha: 1,
        lineWidth: 6
      });
    };
    window.addEventListener('pc_sky_shockwave', handleShockwaveEvent);

    // 1. Initial State Pools
    const stars: Star[] = Array.from({ length: 90 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height * 0.8,
      radius: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.7 + 0.3,
      twinkleSpeed: (Math.random() * 0.02 + 0.008) * (Math.random() > 0.5 ? 1 : -1)
    }));

    // 5% Faster balanced meteor speed
    const meteors: Meteor[] = Array.from({ length: 45 }, () => ({
      x: Math.random() * (width + 600) - 200,
      y: Math.random() * -height,
      length: Math.random() * 180 + 100,
      speed: Math.random() * 8.5 + 7.0, // Perfectly balanced 5% faster
      size: Math.random() * 2 + 1.2,
      opacity: Math.random() * 0.75 + 0.25
    }));

    const orbs: BokehOrb[] = Array.from({ length: 32 }, () => {
      const r = Math.random() * 45 + 20;
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        radius: r,
        baseRadius: r,
        alpha: Math.random() * 0.18 + 0.06,
        speedY: -(Math.random() * 0.3 + 0.15),
        speedX: (Math.random() - 0.5) * 0.2,
        phase: Math.random() * Math.PI * 2
      };
    });

    let sunAngle = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Render shockwaves if any exist
      if (shockwaves.length > 0) {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        for (let i = shockwaves.length - 1; i >= 0; i--) {
          const sw = shockwaves[i];
          sw.radius += (sw.maxRadius - sw.radius) * 0.06 + 2;
          sw.alpha *= 0.95;
          sw.lineWidth = Math.max(1, sw.lineWidth * 0.97);

          if (sw.alpha < 0.01 || sw.radius >= sw.maxRadius) {
            shockwaves.splice(i, 1);
            continue;
          }

          const swGrad = ctx.createRadialGradient(sw.x, sw.y, sw.radius * 0.85, sw.x, sw.y, sw.radius);
          if (theme === 'dark') {
            swGrad.addColorStop(0, `rgba(0, 163, 255, 0)`);
            swGrad.addColorStop(0.8, `rgba(0, 220, 255, ${sw.alpha * 0.8})`);
            swGrad.addColorStop(1, `rgba(124, 58, 237, ${sw.alpha * 0.5})`);
          } else {
            swGrad.addColorStop(0, `rgba(255, 200, 50, 0)`);
            swGrad.addColorStop(0.8, `rgba(255, 170, 0, ${sw.alpha * 0.7})`);
            swGrad.addColorStop(1, `rgba(255, 120, 0, ${sw.alpha * 0.3})`);
          }

          ctx.strokeStyle = swGrad;
          ctx.lineWidth = sw.lineWidth;
          ctx.beginPath();
          ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.restore();
      }

      // If user hasn't toggled yet, keep background calm & clean
      if (lastToggleTime === 0) {
        animFrameIdRef.current = requestAnimationFrame(render);
        return;
      }

      const elapsed = Date.now() - lastToggleTime;

      // Rule: Wait exactly 3.0s before animation begins
      if (elapsed < 3000) {
        animFrameIdRef.current = requestAnimationFrame(render);
        return;
      }

      // Smooth acceleration ramp over 2.5s (slow to fast)
      const rampElapsed = elapsed - 3000;
      const intensity = Math.min(1, rampElapsed / 2500) * opacity;
      const easeIntensity = intensity * intensity;

      if (theme === 'dark') {
        // ====================================================================
        // 🌌 DARK MODE: SERENE & CALM NEON BLUE METEOR SHOWER (10% SLOWER MORE)
        // ====================================================================
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';

        // 1. Twinkling Ambient Stars
        stars.forEach((st) => {
          st.alpha += st.twinkleSpeed;
          if (st.alpha > 0.95 || st.alpha < 0.2) st.twinkleSpeed = -st.twinkleSpeed;
          ctx.fillStyle = `rgba(180, 225, 255, ${st.alpha * easeIntensity * 0.85})`;
          ctx.beginPath();
          ctx.arc(st.x, st.y, st.radius, 0, Math.PI * 2);
          ctx.fill();
        });

        // 2. Streaking Meteors (Diagonally down-left / 52 degrees)
        const angle = (52 * Math.PI) / 180;
        const cosA = Math.cos(angle);
        const sinA = Math.sin(angle);

        meteors.forEach((m) => {
          const currentSpeed = m.speed * (0.35 + easeIntensity * 0.65);
          m.x -= currentSpeed * cosA;
          m.y += currentSpeed * sinA;

          // Reset meteor when it flies off screen
          if (m.x < -250 || m.y > height + 250) {
            m.x = Math.random() * (width + 500) + 100;
            m.y = Math.random() * -300 - 50;
            m.length = Math.random() * 180 + 100;
            m.speed = Math.random() * 8.5 + 7.0; // Perfectly balanced 5% faster
            m.opacity = Math.random() * 0.75 + 0.25;
          }

          const tailX = m.x + m.length * cosA;
          const tailY = m.y - m.length * sinA;

          // Glowing Linear Gradient Trail
          const grad = ctx.createLinearGradient(m.x, m.y, tailX, tailY);
          const meteorAlpha = m.opacity * easeIntensity;
          grad.addColorStop(0, `rgba(255, 255, 255, ${meteorAlpha})`);
          grad.addColorStop(0.15, `rgba(0, 163, 255, ${meteorAlpha * 0.95})`);
          grad.addColorStop(0.55, `rgba(37, 99, 235, ${meteorAlpha * 0.55})`);
          grad.addColorStop(1, 'rgba(0, 50, 180, 0)');

          ctx.strokeStyle = grad;
          ctx.lineWidth = m.size;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(m.x, m.y);
          ctx.lineTo(tailX, tailY);
          ctx.stroke();

          // Luminous Meteor Head Glow
          ctx.fillStyle = `rgba(255, 255, 255, ${meteorAlpha * 0.95})`;
          ctx.beginPath();
          ctx.arc(m.x, m.y, m.size * 1.4, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = `rgba(0, 163, 255, ${meteorAlpha * 0.65})`;
          ctx.beginPath();
          ctx.arc(m.x, m.y, m.size * 3.8, 0, Math.PI * 2);
          ctx.fill();
        });

        ctx.restore();
      } else {
        // ====================================================================
        // ☀️ LIGHT MODE: RADIANT GOLDEN SUNLIGHT (25% BOTTOM-LEFT QUADRANT AT TOP-RIGHT APEX)
        // ====================================================================
        ctx.save();
        ctx.globalCompositeOperation = 'source-over';

        sunAngle += 0.001;
        // Sun center is at the EXACT top-right corner apex (width, 0)
        // so ONLY the bottom-left 25% quadrant shines into the viewport!
        const sunX = width;
        const sunY = 0;

        // 1. Ambient Warm Golden Atmosphere
        const skyGlow = ctx.createRadialGradient(sunX, sunY, 10, sunX, sunY, width * 0.9);
        skyGlow.addColorStop(0, `rgba(255, 220, 120, ${0.38 * easeIntensity})`);
        skyGlow.addColorStop(0.35, `rgba(255, 180, 60, ${0.16 * easeIntensity})`);
        skyGlow.addColorStop(0.75, `rgba(255, 150, 40, ${0.05 * easeIntensity})`);
        skyGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = skyGlow;
        ctx.fillRect(0, 0, width, height);

        // 2. Volumetric Rotating Sunbeams emanating from (width, 0)
        const rayCount = 14;
        ctx.save();
        ctx.translate(sunX, sunY);
        ctx.rotate(sunAngle);
        for (let i = 0; i < rayCount; i++) {
          const rayAngle = (i * Math.PI * 2) / rayCount;
          const rayWidth = (Math.PI * 2) / (rayCount * 3.5);

          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.arc(0, 0, Math.max(width, height) * 1.4, rayAngle - rayWidth, rayAngle + rayWidth);
          ctx.closePath();

          const rayGrad = ctx.createRadialGradient(0, 0, 40, 0, 0, Math.max(width, height) * 1.2);
          rayGrad.addColorStop(0, `rgba(255, 245, 180, ${0.3 * easeIntensity})`);
          rayGrad.addColorStop(0.4, `rgba(255, 200, 80, ${0.12 * easeIntensity})`);
          rayGrad.addColorStop(1, 'rgba(255, 180, 40, 0)');
          ctx.fillStyle = rayGrad;
          ctx.fill();
        }
        ctx.restore();

        // 3. Glowing Solar Core & Corona (Only bottom-left quadrant visible)
        const coreGrad = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, 180);
        coreGrad.addColorStop(0, `rgba(255, 255, 255, ${0.98 * easeIntensity})`);
        coreGrad.addColorStop(0.25, `rgba(255, 240, 160, ${0.8 * easeIntensity})`);
        coreGrad.addColorStop(0.6, `rgba(255, 185, 60, ${0.4 * easeIntensity})`);
        coreGrad.addColorStop(1, 'rgba(255, 160, 40, 0)');
        ctx.fillStyle = coreGrad;
        ctx.beginPath();
        ctx.arc(sunX, sunY, 180, 0, Math.PI * 2);
        ctx.fill();

        // 4. Floating Warm Golden Bokeh Orbs
        orbs.forEach((orb) => {
          orb.y += orb.speedY;
          orb.x += orb.speedX + Math.sin(orb.phase) * 0.25;
          orb.phase += 0.015;

          if (orb.y < -orb.radius * 2) {
            orb.y = height + orb.radius;
            orb.x = Math.random() * width;
          }

          const orbGrad = ctx.createRadialGradient(
            orb.x,
            orb.y,
            orb.radius * 0.1,
            orb.x,
            orb.y,
            orb.radius
          );
          const orbAlpha = orb.alpha * easeIntensity;
          orbGrad.addColorStop(0, `rgba(255, 245, 200, ${orbAlpha * 1.5})`);
          orbGrad.addColorStop(0.6, `rgba(255, 200, 90, ${orbAlpha * 0.8})`);
          orbGrad.addColorStop(1, `rgba(255, 170, 50, 0)`);

          ctx.fillStyle = orbGrad;
          ctx.beginPath();
          ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
          ctx.fill();
        });

        ctx.restore();
      }

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pc_sky_shockwave', handleShockwaveEvent);
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [theme, lastToggleTime, opacity]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0
      }}
      aria-hidden="true"
    />
  );
}
