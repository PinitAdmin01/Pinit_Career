'use client';
import React, { useEffect, useRef, useState, useMemo } from 'react';
import Link from 'next/link';
import { DynamicRoleReadiness, StudentSkillProfile } from '@/lib/pathway/competencySchema';

// ── Canvas Hologram ──────────────────────────────────────────────────────────
function CareerTwinHologram({ track }: { track: 'sde' | 'iot' }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let angle = 0;
    let time = 0;
    let isDestroyed = false;
    let isVisible = true;

    let resizeRafId: number;
    const w = 120;
    const h = 142;
    const cx = w / 2;

    const resizeCanvas = () => {
      if (!canvas || isDestroyed) return;
      const rect = canvas.getBoundingClientRect();
      const targetW = rect.width || w;
      const targetH = rect.height || h;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(targetW * dpr);
      canvas.height = Math.round(targetH * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const handleResize = () => {
      cancelAnimationFrame(resizeRafId);
      resizeRafId = requestAnimationFrame(resizeCanvas);
    };

    resizeCanvas();
    window.addEventListener('resize', handleResize);

    // Pause animation when canvas is scrolled off-screen or tab is backgrounded
    let observer: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(([entry]) => {
        const wasVisible = isVisible;
        isVisible = entry.isIntersecting && !document.hidden;
        if (!wasVisible && isVisible && !isDestroyed) {
          cancelAnimationFrame(animationId);
          animationId = requestAnimationFrame(draw);
        }
      }, { threshold: 0.05 });
      observer.observe(canvas);
    }

    const handleVisibilityChange = () => {
      const wasVisible = isVisible;
      isVisible = !document.hidden;
      if (!wasVisible && isVisible && !isDestroyed) {
        cancelAnimationFrame(animationId);
        animationId = requestAnimationFrame(draw);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    interface Particle { x: number; y: number; targetY: number; size: number; alpha: number; speed: number; color: string; active: boolean; }
    interface Ripple { y: number; radius: number; maxRadius: number; color: string; alpha: number; }
    interface MeshNode { x: number; y: number; vx: number; vy: number; baseX: number; baseY: number; radius: number; layer: number; pulsePhase: number; }

    let particles: Particle[] = [];
    let ripples: Ripple[] = [];
    const meshNodes: MeshNode[] = [];

    for (let i = 0; i < 14; i++) {
      const layer = i % 3;
      const nx = 18 + Math.random() * (w - 36);
      const ny = 14 + (i / 14) * (h - 28);
      meshNodes.push({ x: nx, y: ny, baseX: nx, baseY: ny, vx: (Math.random()-0.5)*0.4, vy: (Math.random()-0.5)*0.4, radius: 2 + Math.random()*2, layer, pulsePhase: Math.random()*Math.PI*2 });
    }
    const skillColors = ['rgba(99,102,241,0.8)','rgba(168,85,247,0.8)','rgba(14,165,233,0.8)','rgba(34,197,94,0.8)'];

    const draw = () => {
      if (isDestroyed || !isVisible) return;
      time += 0.03;
      angle += 0.025;
      ctx.clearRect(0, 0, w, h);

      const isLight =
        typeof document !== 'undefined' &&
        (document.documentElement.classList.contains('light') ||
          document.documentElement.getAttribute('data-theme') === 'light');
      const strandPrimary = isLight ? '79, 70, 229' : '99, 102, 241';
      const strandSecondary = isLight ? '124, 58, 237' : '168, 85, 247';

      if (Math.random() < 0.08 && particles.length < 8) {
        particles.push({ x: Math.random() < 0.5 ? 6 : w - 6, y: 18 + Math.random() * (h - 36), targetY: 18 + Math.random() * (h - 36), size: 1.5 + Math.random() * 1.8, alpha: 0.8, speed: 0.6 + Math.random() * 0.8, color: skillColors[Math.floor(Math.random()*skillColors.length)], active: true });
      }

      particles.forEach(p => {
        if (!p.active) return;
        const dx = cx - p.x, dy = p.targetY - p.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 8) {
          p.active = false;
          ripples.push({ y: p.y, radius: 2, maxRadius: 16, color: p.color, alpha: 0.9 });
        } else {
          p.x += (dx/dist)*p.speed;
          p.y += (dy/dist)*p.speed;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
          ctx.fillStyle = p.color; ctx.fill();
        }
      });
      particles = particles.filter(p => p.active);

      ripples.forEach(r => { r.radius += 0.8; r.alpha -= 0.025; if (r.alpha <= 0) return; ctx.beginPath(); ctx.ellipse(cx, r.y, r.radius, r.radius*0.25, 0, 0, Math.PI*2); ctx.strokeStyle = r.color.replace('0.8', String(r.alpha)).replace('0.9', String(r.alpha)); ctx.lineWidth = 1; ctx.stroke(); });
      ripples = ripples.filter(r => r.alpha > 0);

      if (track === 'sde') {
        const numP = 26, rBase = 22 + Math.sin(time*0.5)*3.5;
        for (let i = 0; i < numP; i++) {
          const t = i / numP;
          const y = 12 + t * (h - 24);
          const theta = angle + t * Math.PI * 3.5;
          const x1 = cx + Math.cos(theta) * rBase;
          const x2 = cx - Math.cos(theta) * rBase;
          const alpha = (isLight ? 0.45 : 0.35) + 0.55 * (Math.sin(theta) + 1) / 2;

          if (i % 2 === 0) {
            ctx.beginPath(); ctx.moveTo(x1, y); ctx.lineTo(x2, y);
            ctx.strokeStyle = `rgba(${strandPrimary}, ${alpha * 0.4})`;
            ctx.lineWidth = 1; ctx.stroke();
          }
          ctx.beginPath(); ctx.arc(x1, y, 2.7, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${strandPrimary}, ${alpha})`; ctx.fill();
          ctx.beginPath(); ctx.arc(x2, y, 2.7, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${strandSecondary}, ${alpha})`; ctx.fill();
        }
      } else {
        meshNodes.forEach(node => {
          node.x = node.baseX + Math.sin(time + node.pulsePhase) * 5;
          node.y = node.baseY + Math.cos(time + node.pulsePhase) * 4;
          ctx.beginPath(); ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
          ctx.fillStyle = isLight ? 'rgba(13,148,136,0.88)' : 'rgba(20,184,166,0.85)'; ctx.fill();
        });
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      isDestroyed = true;
      cancelAnimationFrame(animationId);
      cancelAnimationFrame(resizeRafId);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (observer) observer.disconnect();
    };
  }, [track]);

  return (
    <div className="hero-hologram-wrap" style={{ position: 'relative', width: 120, height: 142, flexShrink: 0 }}>
      <canvas ref={canvasRef} style={{ width: 120, height: 142, display: 'block' }} />
    </div>
  );
}

interface Props {
  user: any;
  careerScore?: number;
  trustScore?: number;
  xp?: number;
  onboardingAnswers?: any;
  activeTrack: 'sde' | 'iot';
  onTrackChange?: (t: 'sde' | 'iot') => void;
  skillProfile?: StudentSkillProfile | null;
  roleReadiness?: DynamicRoleReadiness | null;
  liveArena?: { elo: number | null; weeklyXp: number | null; careerXp: number | null; joined?: boolean } | null;
  activeEnrollment?: { planId?: string; track?: string } | null;
  roadmapGenerated?: boolean;
}

export default function DashboardHeaderHUD({
  user,
  careerScore = 0,
  trustScore = 0,
  xp = 0,
  activeTrack,
  onboardingAnswers,
  roleReadiness,
  liveArena,
  activeEnrollment,
  roadmapGenerated = false,
}: Props) {
  const firstName = useMemo(() => {
    return user?.displayName?.trim()?.split(/\s+/)[0] || user?.username?.split('@')[0] || 'Student';
  }, [user]);

  const hasChosenTrack = Boolean(
    activeEnrollment ||
    roadmapGenerated ||
    onboardingAnswers?.hasCompleted ||
    (user as any)?.targetRole ||
    (user as any)?.target_role
  );

  // Honest dynamic track title
  const trackTitle = useMemo(() => {
    if (!hasChosenTrack) return null;
    if ((user as any)?.targetRole || (user as any)?.target_role) return (user as any).targetRole || (user as any).target_role;
    if (onboardingAnswers?.targetRole) return onboardingAnswers.targetRole;
    if (onboardingAnswers?.role && onboardingAnswers?.hasCompleted) return onboardingAnswers.role;
    if (activeEnrollment?.track) return activeEnrollment.track === 'iot' ? 'IoT & Embedded Systems' : 'Full-Stack Software Engineering';
    if (roleReadiness?.targetRole) return roleReadiness.targetRole;
    return activeTrack === 'iot' ? 'IoT & Embedded Systems' : 'Full-Stack Software Engineering';
  }, [hasChosenTrack, user, onboardingAnswers, activeEnrollment, roleReadiness, activeTrack]);

  // Dynamic greeting calculation
  const [greetingInfo, setGreetingInfo] = useState<{ title: string; subtitle: string }>({
    title: `Hello, ${firstName}`,
    subtitle: hasChosenTrack && trackTitle
      ? `Focused on ${trackTitle}. Resume your quests or complete today's drills.`
      : 'Choose a specialization track or start a daily mission to calibrate your skill profile.',
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const storageKey = `pinit_last_dashboard_visit_${user?.id || 'anon'}`;
    const lastVisitStr = localStorage.getItem(storageKey);
    const now = Date.now();
    let daysSinceLast = 0;

    if (lastVisitStr) {
      const lastEpoch = parseInt(lastVisitStr, 10);
      if (!isNaN(lastEpoch) && lastEpoch > 0) {
        daysSinceLast = Math.floor((now - lastEpoch) / (1000 * 60 * 60 * 24));
      }
    }

    try {
      localStorage.setItem(storageKey, now.toString());
    } catch {}

    const hour = new Date().getHours();
    let salutation = 'Good evening';
    if (hour >= 5 && hour < 12) {
      salutation = 'Good morning';
    } else if (hour >= 12 && hour < 17) {
      salutation = 'Good afternoon';
    }

    if (!hasChosenTrack || !trackTitle) {
      setGreetingInfo({
        title: `${salutation}, ${firstName}`,
        subtitle: 'Choose a specialization track or launch a daily mission to calibrate your skill profile.',
      });
    } else if (daysSinceLast >= 2) {
      setGreetingInfo({
        title: `${salutation}, ${firstName}`,
        subtitle: `Welcome back! Resume your ${trackTitle} quests to keep your placement velocity high.`,
      });
    } else {
      setGreetingInfo({
        title: `${salutation}, ${firstName}`,
        subtitle: `Focused on ${trackTitle}. Complete today's priority actions to advance readiness.`,
      });
    }
  }, [firstName, user?.id, hasChosenTrack, trackTitle]);

  // ── Dynamic & Honest Telemetry Baseline ────────────────────────────────────
  // 1. Trust Score: default 100. Deduct 5 if class skipped or suspicious activity; otherwise 100.
  const dynamicTrust = useMemo(() => {
    const profileTrust = (user as any)?.trustScore ?? (user as any)?.trust_score;
    const candidateTrust = (typeof trustScore === 'number' && trustScore > 0 && trustScore !== 100)
      ? trustScore
      : (typeof profileTrust === 'number' && profileTrust > 0 && profileTrust !== 100 ? profileTrust : null);
    if (candidateTrust !== null) {
      return Math.min(100, Math.max(0, Math.round(candidateTrust)));
    }
    if (typeof window !== 'undefined' && user?.id) {
      try {
        const raw = localStorage.getItem(`pinit_attendance_v2_${user.id}`);
        if (raw) {
          const parsed = JSON.parse(raw);
          const skipped = Number(parsed?.missedDays || parsed?.absentCount || 0);
          if (skipped > 0) {
            return Math.max(50, 100 - skipped * 5);
          }
        }
      } catch {}
    }
    return 100; // Honest baseline: 100
  }, [trustScore, user]);

  // 2. Career Score: default 0 (student has not chosen/completed any course yet)
  const dynamicCareer = useMemo(() => {
    if (typeof careerScore === 'number' && careerScore > 0) {
      return Math.min(100, Math.round(careerScore));
    }
    if (hasChosenTrack && roleReadiness?.verifiedCompetenciesCount && roleReadiness.verifiedCompetenciesCount > 0) {
      return Math.min(100, Math.round((roleReadiness.verifiedCompetenciesCount / (roleReadiness.totalRequiredCompetenciesCount || 1)) * 100));
    }
    return 0; // Honest baseline: 0
  }, [careerScore, hasChosenTrack, roleReadiness]);

  // 3. Arena ELO: default 100 (synced dynamically with liveArena, profile & local cache)
  const dynamicElo = useMemo(() => {
    const wins = Number((user as any)?.arena_wins ?? 0);
    if (typeof liveArena?.elo === 'number' && Number.isFinite(liveArena.elo) && liveArena.elo > 0) {
      return Math.round(liveArena.elo);
    }
    const arenaEloVal = (user as any)?.arena_elo;
    if (typeof arenaEloVal === 'number' && Number.isFinite(arenaEloVal) && arenaEloVal > 0) {
      if (!(arenaEloVal === 1200 && wins === 0)) return Math.round(arenaEloVal);
    }
    const legacyElo = (user as any)?.elo ?? (user as any)?.rating;
    if (typeof legacyElo === 'number' && Number.isFinite(legacyElo) && legacyElo > 100) {
      return Math.round(legacyElo);
    }
    if (typeof window !== 'undefined' && user?.id) {
      try {
        const saved = Number(localStorage.getItem(`pinit_user_elo_${user.id}`));
        if (Number.isFinite(saved) && saved > 0 && saved !== 1200) return Math.round(saved);
      } catch {}
    }
    return 100; // Honest baseline: 100
  }, [liveArena?.elo, user]);

  // 4. Weekly EXP: default 0 (synced with liveArena & CareerOS XP)
  const dynamicWeeklyExp = useMemo(() => {
    if (typeof liveArena?.weeklyXp === 'number' && liveArena.weeklyXp > 0) {
      return Math.round(liveArena.weeklyXp);
    }
    const profileWeekly = (user as any)?.weekly_xp ?? (user as any)?.weeklyXp;
    if (typeof profileWeekly === 'number' && profileWeekly > 0) {
      return Math.round(profileWeekly);
    }
    if (typeof xp === 'number' && xp > 0) {
      return Math.round(xp);
    }
    const totalXpVal = (user as any)?.xpTotal ?? (user as any)?.xp;
    if (typeof totalXpVal === 'number' && totalXpVal > 0) {
      return Math.round(totalXpVal);
    }
    return 0; // Honest baseline: 0
  }, [liveArena?.weeklyXp, user, xp]);

  return (
    <div
      className="db-glass"
      data-testid="dashboard-header-hud"
      style={{
        padding: '28px 32px',
        minHeight: 190,
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 16,
      }}
    >
      <style>{`
        .hero-main-layout {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 28px;
          align-items: center;
          position: relative;
          z-index: 1;
        }
        @media (max-width: 980px) {
          .hero-main-layout {
            grid-template-columns: 1fr !important;
            gap: 22px !important;
          }
          .hero-telemetry-suite {
            width: 100% !important;
            justify-content: stretch !important;
          }
        }
        @media (max-width: 640px) {
          .hero-hologram-wrap {
            display: none !important;
          }
        }
        @media (max-width: 480px) {
          .hero-telemetry-suite {
            grid-template-columns: repeat(2, minmax(136px, 1fr)) !important;
            gap: 10px !important;
          }
        }
        .hud-telemetry-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          padding: 13px 16px;
          border-radius: 13px;
          background: var(--hud-card-bg);
          box-shadow: var(--hud-card-shadow);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          text-decoration: none;
          transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.2s ease, box-shadow 0.2s ease;
          min-width: 164px;
        }
        .hud-telemetry-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--hud-card-hover-shadow);
        }
        .hud-card-arrow {
          opacity: 0;
          color: var(--dash-telemetry-label);
          transition: opacity 0.18s ease, transform 0.18s ease;
          flex-shrink: 0;
        }
        .hud-telemetry-card:hover .hud-card-arrow {
          opacity: 0.75;
          transform: translate(1px, -1px);
        }
        .hud-card-trust { border: 1px solid rgba(16, 185, 129, 0.28); }
        .hud-card-trust:hover { border-color: rgba(16, 185, 129, 0.58); }
        .hud-card-career { border: 1px solid rgba(99, 102, 241, 0.28); }
        .hud-card-career:hover { border-color: rgba(99, 102, 241, 0.58); }
        .hud-card-elo { border: 1px solid rgba(6, 182, 212, 0.28); }
        .hud-card-elo:hover { border-color: rgba(6, 182, 212, 0.58); }
        .hud-card-xp { border: 1px solid rgba(245, 158, 11, 0.28); }
        .hud-card-xp:hover { border-color: rgba(245, 158, 11, 0.58); }
      `}</style>

      {/* Subtle ambient depth glows */}
      <div style={{ position: 'absolute', top: -70, right: -50, width: 240, height: 240, background: 'rgba(99,102,241,0.09)', borderRadius: '50%', filter: 'blur(72px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -50, left: -30, width: 180, height: 180, background: 'rgba(6,182,212,0.07)', borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none' }} />

      {/* Main 2-Column Grid: Left (Hologram + Greeting) | Right (4 Telemetry Metrics) */}
      <div className="hero-main-layout">

        {/* Left: Hologram + Greeting + Distinct Quick Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 22, minWidth: 0 }}>
          <CareerTwinHologram track={activeTrack} />

          <div style={{ flex: 1, minWidth: 0 }}>
            <h1
              data-testid="student-greeting"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 28,
                fontWeight: 900,
                color: 'var(--dash-text)',
                letterSpacing: '-0.025em',
                margin: '0 0 6px',
                lineHeight: 1.15,
              }}
            >
              {greetingInfo.title}
            </h1>

            <p style={{ fontSize: 14, color: 'var(--dash-subtext)', margin: '0 0 18px', lineHeight: 1.55, maxWidth: 560 }}>
              {greetingInfo.subtitle}
            </p>

            {/* Distinct Smart Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <Link
                href={hasChosenTrack ? '/quests' : '/missions'}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 7,
                  padding: '9px 18px',
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                  color: '#ffffff',
                  textDecoration: 'none',
                  boxShadow: '0 4px 16px -2px rgba(99, 102, 241, 0.42)',
                  transition: 'transform 0.18s ease, box-shadow 0.18s ease',
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                <span>{hasChosenTrack ? 'Resume Active Quest' : "Start Today's Mission"}</span>
              </Link>
              <Link
                href="/quests"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '9px 16px',
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 600,
                  background: 'var(--dash-subtle-bg)',
                  color: 'var(--dash-text)',
                  border: '1px solid var(--dash-border-strong, var(--dash-inner-border))',
                  textDecoration: 'none',
                  transition: 'border-color 0.18s ease, background 0.18s ease',
                }}
              >
                <span>Explore Courses</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Right: 4 Telemetry Components (Trust Score, Career Score, Arena ELO, Weekly EXP) */}
        <div
          data-testid="header-telemetry-suite"
          className="hero-telemetry-suite"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(164px, 1fr))',
            gap: 12,
            flexShrink: 0,
            justifyContent: 'end',
          }}
        >
          {/* 1. Trust Score (Default 100, Deduct 5 on skip, No / 100) */}
          <Link
            href="/vault"
            className="hud-telemetry-card hud-card-trust"
            aria-label={`Trust Score: ${dynamicTrust}`}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 11, minWidth: 0 }}>
              <div style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.28)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  <polyline points="9 12 11 14 15 10"/>
                </svg>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <span style={{ fontSize: 10.5, fontWeight: 800, color: 'var(--dash-telemetry-label)', letterSpacing: '0.07em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                  TRUST SCORE
                </span>
                <span className="db-tabular" style={{ fontSize: 24, fontWeight: 900, color: 'var(--dash-telemetry-val)', lineHeight: 1.15, marginTop: 1 }}>
                  {dynamicTrust}
                </span>
              </div>
            </div>
            <svg className="hud-card-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>
            </svg>
          </Link>

          {/* 2. Career Score (Default 0, No / 100) */}
          <Link
            href="/quests"
            className="hud-telemetry-card hud-card-career"
            aria-label={`Career Score: ${dynamicCareer}`}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 11, minWidth: 0 }}>
              <div style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: 'rgba(99, 102, 241, 0.12)',
                border: '1px solid rgba(99, 102, 241, 0.28)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
                </svg>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <span style={{ fontSize: 10.5, fontWeight: 800, color: 'var(--dash-telemetry-label)', letterSpacing: '0.07em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                  CAREER SCORE
                </span>
                <span className="db-tabular" style={{ fontSize: 24, fontWeight: 900, color: 'var(--dash-telemetry-val)', lineHeight: 1.15, marginTop: 1 }}>
                  {dynamicCareer}
                </span>
              </div>
            </div>
            <svg className="hud-card-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>
            </svg>
          </Link>

          {/* 3. Arena ELO (Default 100, Live Synced) */}
          <Link
            href="/arena"
            className="hud-telemetry-card hud-card-elo"
            aria-label={`Arena ELO: ${dynamicElo}`}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 11, minWidth: 0 }}>
              <div style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: 'rgba(6, 182, 212, 0.12)',
                border: '1px solid rgba(6, 182, 212, 0.28)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"/>
                  <line x1="13" y1="19" x2="19" y2="13"/>
                  <line x1="16" y1="16" x2="20" y2="20"/>
                  <line x1="19" y1="21" x2="21" y2="19"/>
                  <polyline points="14.5 6.5 18 3 21 3 21 6 17.5 9.5"/>
                  <line x1="5" y1="14" x2="9" y2="18"/>
                  <line x1="7" y1="17" x2="4" y2="20"/>
                  <line x1="3" y1="19" x2="5" y2="21"/>
                </svg>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <span style={{ fontSize: 10.5, fontWeight: 800, color: 'var(--dash-telemetry-label)', letterSpacing: '0.07em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                  ARENA ELO
                </span>
                <span className="db-tabular" style={{ fontSize: 24, fontWeight: 900, color: 'var(--dash-telemetry-val)', lineHeight: 1.15, marginTop: 1 }}>
                  {dynamicElo.toLocaleString()}
                </span>
              </div>
            </div>
            <svg className="hud-card-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>
            </svg>
          </Link>

          {/* 4. Weekly EXP (Default 0, Live Synced) */}
          <Link
            href="/quests"
            className="hud-telemetry-card hud-card-xp"
            aria-label={`Weekly EXP: ${dynamicWeeklyExp}`}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 11, minWidth: 0 }}>
              <div style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: 'rgba(245, 158, 11, 0.12)',
                border: '1px solid rgba(245, 158, 11, 0.28)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                </svg>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <span style={{ fontSize: 10.5, fontWeight: 800, color: 'var(--dash-telemetry-label)', letterSpacing: '0.07em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                  WEEKLY EXP
                </span>
                <span className="db-tabular" style={{ fontSize: 24, fontWeight: 900, color: 'var(--dash-telemetry-val)', lineHeight: 1.15, marginTop: 1 }}>
                  {dynamicWeeklyExp.toLocaleString()}
                </span>
              </div>
            </div>
            <svg className="hud-card-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>
            </svg>
          </Link>
        </div>

      </div>
    </div>
  );
}
