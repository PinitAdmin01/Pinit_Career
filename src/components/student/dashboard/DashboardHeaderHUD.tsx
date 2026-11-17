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
    const resizeCanvas = () => {
      if (!canvas || isDestroyed) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };
    const handleResize = () => {
      cancelAnimationFrame(resizeRafId);
      resizeRafId = requestAnimationFrame(resizeCanvas);
    };

    resizeCanvas();
    window.addEventListener('resize', handleResize);

    // Performance optimization: pause animation when canvas is scrolled off-screen or tab is backgrounded
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
    const w = 130; const h = 152; const cx = w / 2;

    for (let i = 0; i < 14; i++) {
      const layer = i % 3;
      const nx = 20 + Math.random() * (w - 40);
      const ny = 15 + (i / 14) * (h - 30);
      meshNodes.push({ x: nx, y: ny, baseX: nx, baseY: ny, vx: (Math.random()-0.5)*0.4, vy: (Math.random()-0.5)*0.4, radius: 2 + Math.random()*2, layer, pulsePhase: Math.random()*Math.PI*2 });
    }
    const skillColors = ['rgba(99,102,241,0.8)','rgba(168,85,247,0.8)','rgba(14,165,233,0.8)','rgba(34,197,94,0.8)'];

    const draw = () => {
      if (isDestroyed || !isVisible) return;
      time += 0.03;
      angle += 0.025;
      ctx.clearRect(0, 0, w, h);

      if (Math.random() < 0.08 && particles.length < 8) {
        particles.push({ x: Math.random() < 0.5 ? 5 : w-5, y: 20+Math.random()*(h-40), targetY: 20+Math.random()*(h-40), size: 1.5+Math.random()*2, alpha: 0.8, speed: 0.6+Math.random()*0.8, color: skillColors[Math.floor(Math.random()*skillColors.length)], active: true });
      }

      particles.forEach(p => {
        if (!p.active) return;
        const dx = cx - p.x, dy = p.targetY - p.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 8) {
          p.active = false;
          ripples.push({ y: p.y, radius: 2, maxRadius: 18, color: p.color, alpha: 0.9 });
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
        const numP = 28, rBase = 24 + Math.sin(time*0.5)*4;
        for (let i = 0; i < numP; i++) {
          const t = i / numP;
          const y = 14 + t * (h - 28);
          const theta = angle + t * Math.PI * 3.5;
          const x1 = cx + Math.cos(theta) * rBase;
          const x2 = cx - Math.cos(theta) * rBase;
          const alpha = 0.35 + 0.55 * (Math.sin(theta) + 1) / 2;

          if (i % 2 === 0) {
            ctx.beginPath(); ctx.moveTo(x1, y); ctx.lineTo(x2, y);
            ctx.strokeStyle = `rgba(99,102,241,${alpha * 0.4})`;
            ctx.lineWidth = 1; ctx.stroke();
          }
          ctx.beginPath(); ctx.arc(x1, y, 2.8, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(99,102,241,${alpha})`; ctx.fill();
          ctx.beginPath(); ctx.arc(x2, y, 2.8, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(168,85,247,${alpha})`; ctx.fill();
        }
      } else {
        meshNodes.forEach(node => {
          node.x = node.baseX + Math.sin(time + node.pulsePhase) * 6;
          node.y = node.baseY + Math.cos(time + node.pulsePhase) * 4;
          ctx.beginPath(); ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(20,184,166,0.85)'; ctx.fill();
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
    <div style={{ position: 'relative', width: 120, height: 142, flexShrink: 0 }}>
      <canvas ref={canvasRef} style={{ width: 120, height: 142, display: 'block' }} />
    </div>
  );
}

interface Props {
  user: any;
  careerScore?: number;
  trustScore?: number;
  onboardingAnswers?: any;
  activeTrack: 'sde' | 'iot';
  onTrackChange?: (t: 'sde' | 'iot') => void;
  skillProfile?: StudentSkillProfile | null;
  roleReadiness?: DynamicRoleReadiness | null;
}

export default function DashboardHeaderHUD({
  user,
  careerScore = 0,
  trustScore = 0,
  activeTrack,
  onboardingAnswers,
  roleReadiness,
  skillProfile,
}: Props) {
  const firstName = useMemo(() => {
    return user?.displayName?.trim()?.split(/\s+/)[0] || user?.username?.split('@')[0] || 'Student';
  }, [user]);

  // Dynamic track title
  const trackTitle = useMemo(() => {
    if (roleReadiness?.targetRole) return roleReadiness.targetRole;
    if (onboardingAnswers?.targetRole) return onboardingAnswers.targetRole;
    return activeTrack === 'iot' ? 'IoT & Embedded Systems' : 'Full-Stack Software Engineering';
  }, [roleReadiness, onboardingAnswers, activeTrack]);

  // Dynamic greeting calculation
  const [greetingInfo, setGreetingInfo] = useState<{ title: string; subtitle: string }>({
    title: `Hello, ${firstName}`,
    subtitle: `Your active pathway is set to ${trackTitle}. Explore career programs or resume your daily drills.`,
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

    if (daysSinceLast >= 2) {
      setGreetingInfo({
        title: `${salutation}, ${firstName}`,
        subtitle: `Welcome back! Resume your ${trackTitle} quests to keep your placement velocity high.`,
      });
    } else {
      setGreetingInfo({
        title: `${salutation}, ${firstName}`,
        subtitle: `Your active pathway is set to ${trackTitle}. Start your first quest to accelerate your career readiness.`,
      });
    }
  }, [firstName, user?.id, trackTitle]);

  // ── Dynamic & Honest Telemetry Baseline ────────────────────────────────────
  // 1. Trust Score: default 100. Deduct 5 if class skipped or suspicious activity; otherwise 100.
  const dynamicTrust = useMemo(() => {
    if (typeof trustScore === 'number' && trustScore > 0 && trustScore !== 100) {
      return Math.min(100, Math.max(0, Math.round(trustScore)));
    }
    // Check local attendance deductions
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
    return 100;
  }, [trustScore, user?.id]);

  // 2. Career Score: default 0 (student has not chosen/completed any course yet)
  const dynamicCareer = useMemo(() => {
    if (typeof careerScore === 'number' && careerScore > 0) {
      return Math.min(100, Math.round(careerScore));
    }
    if (roleReadiness?.verifiedCompetenciesCount && roleReadiness.verifiedCompetenciesCount > 0) {
      return Math.min(100, Math.round((roleReadiness.verifiedCompetenciesCount / (roleReadiness.totalRequiredCompetenciesCount || 1)) * 100));
    }
    return 0; // Honest baseline: 0
  }, [careerScore, roleReadiness]);

  // 3. Arena ELO: default 100 (student has not entered competitive arena matchmaking yet)
  const dynamicElo = useMemo(() => {
    const eloVal = (user as any)?.elo ?? (user as any)?.rating;
    if (typeof eloVal === 'number' && eloVal > 100) {
      return Math.round(eloVal);
    }
    return 100; // Honest baseline: 100
  }, [user]);

  // 4. Weekly EXP: default 0 (student has not logged activity this week)
  const dynamicWeeklyExp = useMemo(() => {
    const xpVal = (user as any)?.weekly_xp ?? (user as any)?.xp;
    if (typeof xpVal === 'number' && xpVal > 0) {
      return xpVal;
    }
    return 0; // Honest baseline: 0
  }, [user]);

  return (
    <div
      className="db-glass"
      data-testid="dashboard-header-hud"
      style={{
        padding: '28px 32px',
        minHeight: 185,
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
        @media (max-width: 960px) {
          .hero-main-layout {
            grid-template-columns: 1fr !important;
            gap: 22px !important;
          }
          .hero-telemetry-suite {
            width: 100% !important;
            justify-content: stretch !important;
          }
        }
        .hud-telemetry-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 13px 16px;
          border-radius: 14px;
          background: var(--hud-card-bg);
          box-shadow: var(--hud-card-shadow);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          text-decoration: none;
          transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
          min-width: 164px;
        }
        .hud-telemetry-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--hud-card-hover-shadow);
        }
        .hud-card-trust {
          border: 1.5px solid rgba(16, 185, 129, 0.3);
        }
        .hud-card-trust:hover {
          border-color: rgba(16, 185, 129, 0.6);
        }
        .hud-card-career {
          border: 1.5px solid rgba(99, 102, 241, 0.3);
        }
        .hud-card-career:hover {
          border-color: rgba(99, 102, 241, 0.6);
        }
        .hud-card-elo {
          border: 1.5px solid rgba(6, 182, 212, 0.3);
        }
        .hud-card-elo:hover {
          border-color: rgba(6, 182, 212, 0.6);
        }
        .hud-card-xp {
          border: 1.5px solid rgba(245, 158, 11, 0.3);
        }
        .hud-card-xp:hover {
          border-color: rgba(245, 158, 11, 0.6);
        }
      `}</style>

      {/* Ambient glowing radial lights */}
      <div style={{ position: 'absolute', top: -60, right: -60, width: 260, height: 260, background: 'rgba(99,102,241,0.12)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -40, left: -40, width: 200, height: 200, background: 'rgba(14,165,233,0.08)', borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none' }} />

      {/* Main 2-Column Grid: Left (Hologram + Greeting) | Right (4 Telemetry Metrics) */}
      <div className="hero-main-layout">
        
        {/* Left: Hologram + Single-Line Greeting + Quick Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 22, minWidth: 0 }}>
          <CareerTwinHologram track={activeTrack} />

          <div style={{ flex: 1, minWidth: 0 }}>
            <h1
              data-testid="student-greeting"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 27,
                fontWeight: 900,
                color: 'var(--dash-text)',
                letterSpacing: '-0.5px',
                margin: '0 0 6px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {greetingInfo.title}
            </h1>

            <p style={{ fontSize: 14, color: 'var(--dash-subtext)', margin: '0 0 16px', lineHeight: 1.55, maxWidth: 580 }}>
              {greetingInfo.subtitle}
            </p>

            {/* Quick Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <Link
                href="/quests"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 18px',
                  borderRadius: 9,
                  fontSize: 13,
                  fontWeight: 700,
                  background: 'var(--accent, #6366f1)',
                  color: '#ffffff',
                  textDecoration: 'none',
                  boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)',
                  transition: 'transform 0.18s ease',
                }}
              >
                + Start Today&apos;s Quest
              </Link>
              <Link
                href="/quests"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 16px',
                  borderRadius: 9,
                  fontSize: 13,
                  fontWeight: 600,
                  background: 'var(--dash-subtle-bg, rgba(255, 255, 255, 0.05))',
                  color: 'var(--dash-text, #ffffff)',
                  border: '1px solid var(--dash-inner-border, rgba(255, 255, 255, 0.12))',
                  textDecoration: 'none',
                }}
              >
                Explore Courses
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
            gap: 14,
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
            <div style={{
              width: 42,
              height: 42,
              borderRadius: 11,
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.28)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              {/* SVG Shield Icon (No Emojis) */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <polyline points="9 12 11 14 15 10"/>
              </svg>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
              <span style={{ fontSize: 10.5, fontWeight: 800, color: 'var(--dash-telemetry-label)', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                TRUST SCORE
              </span>
              <span style={{ fontSize: 22, fontWeight: 900, color: 'var(--dash-telemetry-val)', fontFamily: 'var(--font-mono)', lineHeight: 1.15 }}>
                {dynamicTrust}
              </span>
            </div>
          </Link>

          {/* 2. Career Score (Default 0, No / 100) */}
          <Link
            href="/quests"
            className="hud-telemetry-card hud-card-career"
            aria-label={`Career Score: ${dynamicCareer}`}
          >
            <div style={{
              width: 42,
              height: 42,
              borderRadius: 11,
              background: 'rgba(99, 102, 241, 0.12)',
              border: '1px solid rgba(99, 102, 241, 0.28)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              {/* SVG Compass / Target Icon (No Emojis) */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
              </svg>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
              <span style={{ fontSize: 10.5, fontWeight: 800, color: 'var(--dash-telemetry-label)', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                CAREER SCORE
              </span>
              <span style={{ fontSize: 22, fontWeight: 900, color: 'var(--dash-telemetry-val)', fontFamily: 'var(--font-mono)', lineHeight: 1.15 }}>
                {dynamicCareer}
              </span>
            </div>
          </Link>

          {/* 3. Arena ELO (Default 100, Placement, No Fake Rating) */}
          <Link
            href="/arena"
            className="hud-telemetry-card hud-card-elo"
            aria-label={`Arena ELO: ${dynamicElo}`}
          >
            <div style={{
              width: 42,
              height: 42,
              borderRadius: 11,
              background: 'rgba(6, 182, 212, 0.12)',
              border: '1px solid rgba(6, 182, 212, 0.28)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              {/* SVG Swords Icon (No Emojis) */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
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
              <span style={{ fontSize: 10.5, fontWeight: 800, color: 'var(--dash-telemetry-label)', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                ARENA ELO
              </span>
              <span style={{ fontSize: 22, fontWeight: 900, color: 'var(--dash-telemetry-val)', fontFamily: 'var(--font-mono)', lineHeight: 1.15 }}>
                {dynamicElo}
              </span>
            </div>
          </Link>

          {/* 4. Weekly EXP (Default 0, No Fake Numbers) */}
          <Link
            href="/quests"
            className="hud-telemetry-card hud-card-xp"
            aria-label={`Weekly EXP: ${dynamicWeeklyExp}`}
          >
            <div style={{
              width: 42,
              height: 42,
              borderRadius: 11,
              background: 'rgba(245, 158, 11, 0.12)',
              border: '1px solid rgba(245, 158, 11, 0.28)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              {/* SVG Lightning Bolt Icon (No Emojis) */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
              <span style={{ fontSize: 10.5, fontWeight: 800, color: 'var(--dash-telemetry-label)', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                WEEKLY EXP
              </span>
              <span style={{ fontSize: 22, fontWeight: 900, color: 'var(--dash-telemetry-val)', fontFamily: 'var(--font-mono)', lineHeight: 1.15 }}>
                {dynamicWeeklyExp}
              </span>
            </div>
          </Link>
        </div>

      </div>
    </div>
  );
}
