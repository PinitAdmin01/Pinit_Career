'use client';

import React, { useEffect, useRef } from 'react';

interface DynamicSkyCanvasProps {
  theme: 'dark' | 'light';
  lastToggleTime?: number;
  opacity?: number;
}

// ── Particle Interfaces ────────────────────────────────────────────────────────

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
  baseAlpha: number;
  twinkleSpeed: number;
  color: string;
}

// Layer 1: Atmospheric Tyndall Dust Mote (Glints when intersecting sunbeams)
interface TyndallMote {
  x: number;
  y: number;
  radius: number;
  baseRadius: number;
  alpha: number;
  baseAlpha: number;
  vx: number;
  vy: number;
  phase: number;
  twinkleSpeed: number;
  hue: number;
}

// Layer 2: Rapid Photon Ray Streamers (Streams along sunbeam trajectories)
interface PhotonStreamer {
  dist: number;
  maxDist: number;
  speed: number;
  beamIndex: number;
  angleOffset: number;
  size: number;
  alpha: number;
  trailLength: number;
}

// Layer 3: Sunbeam Shaft Definition
interface SunbeamShaft {
  baseAngle: number;
  currentAngle: number;
  width: number;
  intensity: number;
  swaySpeed: number;
  swayAmp: number;
  breathSpeed: number;
  phase: number;
}

// Layer 4: Solar Flare / Prismatic Lens Glints
interface PrismaticGlint {
  axisDistPercent: number; // 0 = at sun, 1 = bottom-left corner
  radius: number;
  color: string;
  alpha: number;
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
  lastToggleTime = 0,
  opacity = 0.8 // Faded 20% by default for elegant background balance
}: DynamicSkyCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let animationsActive = typeof window !== 'undefined' ? localStorage.getItem('pc_animations_enabled') !== 'false' : true;
    const handleAnimationToggle = (e: any) => {
      if (typeof e.detail?.enabled === 'boolean') {
        animationsActive = e.detail.enabled;
        if (!animationsActive && ctx) {
          ctx.clearRect(0, 0, width, height);
        }
      }
    };
    window.addEventListener('pc_animation_toggle', handleAnimationToggle);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const _c = typeof window !== 'undefined' ? getComputedStyle(document.documentElement) : null; const brandRgb = _c?.getPropertyValue('--brand-rgb')?.trim() || '99, 102, 241'; const warningRgb = _c?.getPropertyValue('--warning-rgb')?.trim() || '245, 158, 11'; const rewardRgb = _c?.getPropertyValue('--reward-rgb')?.trim() || '139, 92, 246';
    const shockwaves: Shockwave[] = [];
    const handleShockwaveEvent = (e: any) => {
      const { x, y } = e.detail || { x: width / 2, y: height / 2 };
      shockwaves.push({
        x,
        y,
        radius: 10,
        maxRadius: Math.min(width, height) * 0.85,
        alpha: 1,
        lineWidth: 6
      });
    };
    window.addEventListener('pc_sky_shockwave', handleShockwaveEvent);

    // ── 1. DARK MODE POOLS ─────────────────────────────────────────────────────
    const starColors = [
      'rgba(255, 255, 255,',
      'rgba(186, 230, 253,', // Ice blue
      'rgba(221, 214, 254,', // Soft violet
      'rgba(254, 240, 138,'  // Pale gold
    ];

    const stars: Star[] = Array.from({ length: 90 }, () => {
      const baseAlpha = Math.random() * 0.5 + 0.25;
      return {
        x: Math.random() * width,
        y: Math.random() * height * 0.85,
        radius: Math.random() * 1.5 + 0.4,
        alpha: baseAlpha,
        baseAlpha,
        twinkleSpeed: (Math.random() * 0.03 + 0.01) * (Math.random() > 0.5 ? 1 : -1),
        color: starColors[Math.floor(Math.random() * starColors.length)]
      };
    });

    const meteors: Meteor[] = Array.from({ length: 36 }, () => ({
      x: Math.random() * (width + 600) - 200,
      y: Math.random() * -height * 1.2,
      length: Math.random() * 180 + 80,
      speed: Math.random() * 420 + 340, // px per sec
      size: Math.random() * 1.6 + 1.0,
      opacity: Math.random() * 0.65 + 0.25
    }));

    // ── 2. LIGHT MODE POOLS (LIVING SUNLIGHT & TYNDALL PARTICLES) ───────────────
    // Sun apex is at top-right corner (width, 0)
    // Angles to bottom-left quadrant span from Math.PI * 0.52 to Math.PI * 0.98
    const minAngle = Math.PI * 0.52;
    const maxAngle = Math.PI * 0.98;

    // 8 Volumetric Breathing Sunbeam Shafts
    const beamCount = 8;
    const sunbeams: SunbeamShaft[] = Array.from({ length: beamCount }, (_, i) => {
      const frac = (i + 0.5) / beamCount;
      const baseAngle = minAngle + frac * (maxAngle - minAngle);
      return {
        baseAngle,
        currentAngle: baseAngle,
        width: 0.13 + Math.random() * 0.07,
        intensity: 0.65 + Math.random() * 0.25,
        swaySpeed: 0.15 + Math.random() * 0.2,
        swayAmp: 0.03 + Math.random() * 0.02,
        breathSpeed: 0.3 + Math.random() * 0.4,
        phase: Math.random() * Math.PI * 2
      };
    });

    // 140 Atmospheric Tyndall Motes (Softly floating dust motes)
    const motes: TyndallMote[] = Array.from({ length: 140 }, () => {
      const r = Math.random() * 1.8 + 0.8;
      const baseAlpha = Math.random() * 0.18 + 0.08;
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        radius: r,
        baseRadius: r,
        alpha: baseAlpha,
        baseAlpha,
        vx: -(Math.random() * 18 + 10), // drifting left (px/sec)
        vy: Math.random() * 22 + 12,    // drifting down (px/sec)
        phase: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 2.2 + 1.0,
        hue: Math.random() * 20 + 38 // 38-58 warm golden amber
      };
    });

    // 160 Rapid Photon Streamers along the beams
    const streamers: PhotonStreamer[] = Array.from({ length: 160 }, () => {
      const bIdx = Math.floor(Math.random() * beamCount);
      const maxDist = Math.hypot(width, height) * 1.05;
      return {
        dist: Math.random() * maxDist,
        maxDist,
        speed: Math.random() * 280 + 180, // px per sec
        beamIndex: bIdx,
        angleOffset: (Math.random() - 0.5) * 0.07,
        size: Math.random() * 1.3 + 0.7,
        alpha: Math.random() * 0.35 + 0.25,
        trailLength: Math.random() * 32 + 16
      };
    });

    // 5 Prismatic Lens Glints along sun axis
    const glints: PrismaticGlint[] = [
      { axisDistPercent: 0.16, radius: 20, color: 'rgba(255, 200, 80,', alpha: 0.16, phase: 0.0 },
      { axisDistPercent: 0.35, radius: 40, color: `rgba(${warningRgb},`, alpha: 0.11, phase: 1.2 },
      { axisDistPercent: 0.52, radius: 64, color: 'rgba(251, 191, 36,', alpha: 0.09, phase: 2.4 },
      { axisDistPercent: 0.72, radius: 30, color: 'rgba(217, 119, 6,', alpha: 0.13, phase: 3.6 },
      { axisDistPercent: 0.88, radius: 18, color: 'rgba(234, 88, 12,', alpha: 0.15, phase: 4.8 }
    ];

    let lastTime = performance.now();
    const startTime = performance.now();
    const effectiveToggleTime = lastToggleTime > 0 ? lastToggleTime : Date.now();

    // ── MAIN RENDER LOOP ───────────────────────────────────────────────────────
    const render = (now: number) => {
      const rawDt = (now - lastTime) / 1000;
      lastTime = now;
      const dt = Math.min(0.05, Math.max(0.001, rawDt));
      const totalElapsed = (now - startTime) / 1000;

      // ── ANIMATIONS TOGGLE CHECK & 3-SECOND DELAY RULE ────────────────────
      if (!animationsActive) {
        ctx.clearRect(0, 0, width, height);
        animFrameIdRef.current = requestAnimationFrame(render);
        return;
      }

      const elapsedSinceToggle = Date.now() - effectiveToggleTime;
      
      if (elapsedSinceToggle < 3000) {
        ctx.clearRect(0, 0, width, height);
        animFrameIdRef.current = requestAnimationFrame(render);
        return;
      }

      // Smooth acceleration ramp over 2.0s with 20% fade factor (opacity)
      const rampElapsed = elapsedSinceToggle - 3000;
      const rampProgress = Math.min(1, rampElapsed / 2000);
      const easeIntensity = rampProgress * rampProgress * opacity;

      ctx.clearRect(0, 0, width, height);

      // ── SHOCKWAVE SYSTEM ────────────────────────────────────────────────────
      if (shockwaves.length > 0) {
        ctx.save();
        ctx.globalCompositeOperation = theme === 'dark' ? 'lighter' : 'source-over';
        for (let i = shockwaves.length - 1; i >= 0; i--) {
          const sw = shockwaves[i];
          sw.radius += (sw.maxRadius - sw.radius) * (3.5 * dt) + (80 * dt);
          sw.alpha -= 0.75 * dt;
          sw.lineWidth = Math.max(1, sw.lineWidth - 2.5 * dt);

          if (sw.alpha <= 0.01 || sw.radius >= sw.maxRadius) {
            shockwaves.splice(i, 1);
            continue;
          }

          const swGrad = ctx.createRadialGradient(sw.x, sw.y, Math.max(0, sw.radius * 0.82), sw.x, sw.y, sw.radius);
          if (theme === 'dark') {
            swGrad.addColorStop(0, 'rgba(0, 163, 255, 0)');
            swGrad.addColorStop(0.75, `rgba(56, 189, 248, ${sw.alpha * 0.75})`);
            swGrad.addColorStop(1, `rgba(${rewardRgb}, ${sw.alpha * 0.45})`);
          } else {
            swGrad.addColorStop(0, 'rgba(255, 230, 120, 0)');
            swGrad.addColorStop(0.75, `rgba(${warningRgb}, ${sw.alpha * 0.65})`);
            swGrad.addColorStop(1, `rgba(217, 119, 6, ${sw.alpha * 0.35})`);
          }

          ctx.strokeStyle = swGrad;
          ctx.lineWidth = sw.lineWidth;
          ctx.beginPath();
          ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.restore();
      }

      // ── THEME RENDERING ─────────────────────────────────────────────────────
      if (theme === 'dark') {
        // ======================================================================
        // 🌌 DARK MODE: DEEP COSMOS, TWINKLING STARS & FAST METEORS
        // ======================================================================
        ctx.save();

        // 1. Render Stars
        stars.forEach((s) => {
          s.alpha += s.twinkleSpeed * (dt * 60);
          if (s.alpha > s.baseAlpha + 0.35 || s.alpha < s.baseAlpha - 0.25) {
            s.twinkleSpeed = -s.twinkleSpeed;
          }
          const finalAlpha = Math.max(0.04, Math.min(1, s.alpha)) * easeIntensity;

          ctx.fillStyle = `${s.color} ${finalAlpha})`;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
          ctx.fill();
        });

        // 2. Render Fast Meteors
        ctx.globalCompositeOperation = 'lighter';
        meteors.forEach((m) => {
          m.x -= m.speed * dt * 0.82;
          m.y += m.speed * dt;

          if (m.y > height + 200 || m.x < -300) {
            m.x = Math.random() * (width + 600) - 100;
            m.y = -Math.random() * 250 - 50;
            m.speed = Math.random() * 420 + 340;
            m.length = Math.random() * 180 + 80;
          }

          const angle = Math.atan2(1, -0.82);
          const tailX = m.x - Math.cos(angle) * m.length;
          const tailY = m.y - Math.sin(angle) * m.length;

          const meteorAlpha = m.opacity * easeIntensity;
          const grad = ctx.createLinearGradient(m.x, m.y, tailX, tailY);
          grad.addColorStop(0, `rgba(255, 255, 255, ${meteorAlpha})`);
          grad.addColorStop(0.2, `rgba(56, 189, 248, ${meteorAlpha * 0.8})`);
          grad.addColorStop(0.65, `rgba(${brandRgb}, ${meteorAlpha * 0.35})`);
          grad.addColorStop(1, `rgba(${brandRgb}, 0)`);

          ctx.strokeStyle = grad;
          ctx.lineWidth = m.size;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(m.x, m.y);
          ctx.lineTo(tailX, tailY);
          ctx.stroke();

          // Luminous Meteor Head Glow
          ctx.fillStyle = `rgba(255, 255, 255, ${meteorAlpha * 0.9})`;
          ctx.beginPath();
          ctx.arc(m.x, m.y, m.size * 1.2, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = `rgba(0, 163, 255, ${meteorAlpha * 0.45})`;
          ctx.beginPath();
          ctx.arc(m.x, m.y, m.size * 2.8, 0, Math.PI * 2);
          ctx.fill();
        });

        ctx.restore();

      } else {
        // ======================================================================
        // ☀️ LIGHT MODE: 25% VISIBLE SUN AT TOP-RIGHT & SOFT TYNDALL RAYS
        // ======================================================================
        ctx.save();
        const sunX = width;
        const sunY = 0;

        // 1. Ambient Warm Golden Atmosphere Glow
        const skyGlow = ctx.createRadialGradient(sunX, sunY, 30, sunX, sunY, Math.max(width, height) * 0.95);
        skyGlow.addColorStop(0, `rgba(251, 191, 36, ${0.28 * easeIntensity})`);
        skyGlow.addColorStop(0.3, `rgba(${warningRgb}, ${0.12 * easeIntensity})`);
        skyGlow.addColorStop(0.7, `rgba(217, 119, 6, ${0.03 * easeIntensity})`);
        skyGlow.addColorStop(1, 'rgba(251, 191, 36, 0)');
        ctx.fillStyle = skyGlow;
        ctx.fillRect(0, 0, width, height);

        const maxDiag = Math.hypot(width, height);

        // 2. Volumetric Breathing Sunbeams (Subtle crepuscular shafts)
        ctx.save();
        sunbeams.forEach((beam) => {
          const sway = Math.sin(totalElapsed * beam.swaySpeed + beam.phase) * beam.swayAmp;
          beam.currentAngle = beam.baseAngle + sway;
          const breath = 0.7 + 0.3 * Math.sin(totalElapsed * beam.breathSpeed + beam.phase * 1.5);
          const currentIntensity = beam.intensity * breath * easeIntensity;

          const rayLen = maxDiag;
          const halfWidth = beam.width * 0.5 * (0.85 + 0.15 * breath);

          ctx.beginPath();
          ctx.moveTo(sunX, sunY);
          ctx.arc(sunX, sunY, rayLen, beam.currentAngle - halfWidth, beam.currentAngle + halfWidth);
          ctx.closePath();

          const rayGrad = ctx.createRadialGradient(sunX, sunY, 40, sunX, sunY, rayLen * 0.85);
          rayGrad.addColorStop(0, `rgba(${warningRgb}, ${0.15 * currentIntensity})`);
          rayGrad.addColorStop(0.35, `rgba(217, 119, 6, ${0.07 * currentIntensity})`);
          rayGrad.addColorStop(0.75, `rgba(251, 191, 36, ${0.02 * currentIntensity})`);
          rayGrad.addColorStop(1, `rgba(${warningRgb}, 0)`);

          ctx.fillStyle = rayGrad;
          ctx.fill();
        });
        ctx.restore();

        // 3. Layer 2: Rapid Photon Streamer Rays (Delicate flowing photon streams)
        ctx.save();
        streamers.forEach((p) => {
          p.dist += p.speed * dt;
          if (p.dist > p.maxDist) {
            p.dist = Math.random() * 40 + 10;
            p.beamIndex = Math.floor(Math.random() * beamCount);
            p.speed = Math.random() * 280 + 180;
          }

          const beam = sunbeams[p.beamIndex];
          const angle = beam.currentAngle + p.angleOffset;
          const px = sunX + Math.cos(angle) * p.dist;
          const py = sunY + Math.sin(angle) * p.dist;

          if (px < -50 || px > width + 50 || py > height + 50) return;

          const tailX = px - Math.cos(angle) * p.trailLength;
          const tailY = py - Math.sin(angle) * p.trailLength;

          const pAlpha = p.alpha * easeIntensity * (1 - (p.dist / p.maxDist) * 0.65);
          const pGrad = ctx.createLinearGradient(px, py, tailX, tailY);
          pGrad.addColorStop(0, `rgba(217, 119, 6, ${pAlpha * 0.85})`);
          pGrad.addColorStop(0.4, `rgba(${warningRgb}, ${pAlpha * 0.65})`);
          pGrad.addColorStop(1, 'rgba(251, 191, 36, 0)');

          ctx.strokeStyle = pGrad;
          ctx.lineWidth = p.size;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(tailX, tailY);
          ctx.stroke();

          // Luminous Amber Core Head
          ctx.fillStyle = `rgba(217, 119, 6, ${pAlpha * 0.85})`;
          ctx.beginPath();
          ctx.arc(px, py, p.size * 0.9, 0, Math.PI * 2);
          ctx.fill();

          // White Spark
          ctx.fillStyle = `rgba(255, 255, 255, ${pAlpha * 0.9})`;
          ctx.beginPath();
          ctx.arc(px, py, p.size * 0.5, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.restore();

        // 4. Layer 1: Soft Atmospheric Tyndall Dust Motes with Gentle Glinting
        ctx.save();
        motes.forEach((m) => {
          m.x += (m.vx + Math.sin(totalElapsed * 1.5 + m.phase) * 6) * dt;
          m.y += (m.vy + Math.cos(totalElapsed * 1.2 + m.phase) * 5) * dt;
          m.phase += dt * m.twinkleSpeed;

          // Wrap-around edges
          if (m.x < -40) m.x = width + 30;
          if (m.x > width + 40) m.x = -20;
          if (m.y > height + 40) m.y = -30;
          if (m.y < -40) m.y = height + 20;

          const dx = m.x - sunX;
          const dy = m.y - sunY;
          const moteAngle = Math.atan2(dy, dx);

          let isIlluminated = false;
          let beamProximity = 0;

          for (let b = 0; b < sunbeams.length; b++) {
            const beam = sunbeams[b];
            const halfW = beam.width * 0.5;
            const diff = Math.abs(moteAngle - beam.currentAngle);
            if (diff < halfW) {
              isIlluminated = true;
              beamProximity = Math.max(beamProximity, (1 - diff / halfW) * beam.intensity);
            }
          }

          const twinkle = 0.75 + 0.25 * Math.sin(m.phase);
          const finalAlpha = m.alpha * twinkle * easeIntensity;

          if (isIlluminated) {
            // ✨ Soft In-Beam Tyndall Glint
            const flareAlpha = Math.min(0.75, finalAlpha * 2.2 * beamProximity);
            const flareRadius = m.radius * (1.4 + beamProximity * 1.2);

            const haloGrad = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, flareRadius * 2.8);
            haloGrad.addColorStop(0, `rgba(255, 255, 255, ${flareAlpha * 0.9})`);
            haloGrad.addColorStop(0.4, `rgba(${warningRgb}, ${flareAlpha * 0.65})`);
            haloGrad.addColorStop(0.8, `rgba(217, 119, 6, ${flareAlpha * 0.25})`);
            haloGrad.addColorStop(1, 'rgba(217, 119, 6, 0)');

            ctx.fillStyle = haloGrad;
            ctx.beginPath();
            ctx.arc(m.x, m.y, flareRadius * 2.8, 0, Math.PI * 2);
            ctx.fill();

            // Subtle Sparkle Cross on high intensity motes
            if (flareAlpha > 0.45) {
              const arm = flareRadius * 2.0;
              ctx.strokeStyle = `rgba(217, 119, 6, ${flareAlpha * 0.65})`;
              ctx.lineWidth = 0.9;
              ctx.beginPath();
              ctx.moveTo(m.x - arm, m.y);
              ctx.lineTo(m.x + arm, m.y);
              ctx.moveTo(m.x, m.y - arm);
              ctx.lineTo(m.x, m.y + arm);
              ctx.stroke();
            }
          } else {
            // Ambient Warm Mote in Shadow
            const shadowAlpha = finalAlpha * 0.65;
            ctx.fillStyle = `rgba(217, 119, 6, ${shadowAlpha})`;
            ctx.beginPath();
            ctx.arc(m.x, m.y, m.radius, 0, Math.PI * 2);
            ctx.fill();
          }
        });
        ctx.restore();

        // 5. Layer 4: Prismatic Lens Glints Along Axis
        ctx.save();
        glints.forEach((g) => {
          const gx = sunX - g.axisDistPercent * width;
          const gy = sunY + g.axisDistPercent * height;
          const gAlpha = (g.alpha * (0.8 + 0.2 * Math.sin(totalElapsed * 0.8 + g.phase))) * easeIntensity;

          const gGrad = ctx.createRadialGradient(gx, gy, 0, gx, gy, g.radius);
          gGrad.addColorStop(0, `${g.color} ${gAlpha * 1.1})`);
          gGrad.addColorStop(0.5, `${g.color} ${gAlpha * 0.5})`);
          gGrad.addColorStop(1, `${g.color} 0)`);

          ctx.fillStyle = gGrad;
          ctx.beginPath();
          ctx.arc(gx, gy, g.radius, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.restore();

        // ======================================================================
        // ☀️ 6. 25% VISIBLE RADIANT SUN DISC AT TOP-RIGHT CORNER APEX (width, 0)
        // Only the bottom-left 25% quadrant shines directly into the viewport!
        // ======================================================================
        ctx.save();
        const sunPulse = 1 + 0.05 * Math.sin(totalElapsed * 1.5);
        
        // (A) Outer Solar Corona & Heat Shimmer (radius 360px)
        const outerCorona = ctx.createRadialGradient(sunX, sunY, 80, sunX, sunY, 360 * sunPulse);
        outerCorona.addColorStop(0, `rgba(255, 240, 150, ${0.45 * easeIntensity})`);
        outerCorona.addColorStop(0.35, `rgba(251, 191, 36, ${0.25 * easeIntensity})`);
        outerCorona.addColorStop(0.7, `rgba(${warningRgb}, ${0.08 * easeIntensity})`);
        outerCorona.addColorStop(1, `rgba(${warningRgb}, 0)`);
        ctx.fillStyle = outerCorona;
        ctx.beginPath();
        ctx.arc(sunX, sunY, 360 * sunPulse, Math.PI * 0.5, Math.PI); // 25% Bottom-Left Quadrant
        ctx.lineTo(sunX, sunY);
        ctx.closePath();
        ctx.fill();

        // (B) Middle Solar Chromosphere (radius 180px)
        const midCorona = ctx.createRadialGradient(sunX, sunY, 30, sunX, sunY, 180 * sunPulse);
        midCorona.addColorStop(0, `rgba(255, 255, 240, ${0.85 * easeIntensity})`);
        midCorona.addColorStop(0.4, `rgba(251, 191, 36, ${0.65 * easeIntensity})`);
        midCorona.addColorStop(0.8, `rgba(${warningRgb}, ${0.35 * easeIntensity})`);
        midCorona.addColorStop(1, 'rgba(217, 119, 6, 0)');
        ctx.fillStyle = midCorona;
        ctx.beginPath();
        ctx.arc(sunX, sunY, 180 * sunPulse, Math.PI * 0.5, Math.PI);
        ctx.lineTo(sunX, sunY);
        ctx.closePath();
        ctx.fill();

        // (C) Radiant Physical Sun Sphere / Core Disc (radius 105px)
        // Sharp, brilliant white-gold celestial body anchored at the apex!
        const sunCore = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, 105);
        sunCore.addColorStop(0, `rgba(255, 255, 255, ${0.98 * easeIntensity})`);
        sunCore.addColorStop(0.45, `rgba(255, 248, 200, ${0.95 * easeIntensity})`);
        sunCore.addColorStop(0.85, `rgba(251, 191, 36, ${0.85 * easeIntensity})`);
        sunCore.addColorStop(1, `rgba(${warningRgb}, ${0.60 * easeIntensity})`);
        ctx.fillStyle = sunCore;
        ctx.beginPath();
        ctx.arc(sunX, sunY, 105, Math.PI * 0.5, Math.PI);
        ctx.lineTo(sunX, sunY);
        ctx.closePath();
        ctx.fill();

        // (D) Solar Limb Edge Flare
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.85 * easeIntensity})`;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(sunX, sunY, 105, Math.PI * 0.5, Math.PI);
        ctx.stroke();

        ctx.restore();

        ctx.restore();
      }

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pc_sky_shockwave', handleShockwaveEvent);
      window.removeEventListener('pc_animation_toggle', handleAnimationToggle);
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
