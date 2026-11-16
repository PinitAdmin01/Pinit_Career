'use client';
import { useEffect, useRef, useState, useMemo } from 'react';
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
    const w = 120; const h = 140; const cx = w / 2;

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
        const numP = 28, rBase = 22 + Math.sin(time*0.5)*4;
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
          ctx.beginPath(); ctx.arc(x1, y, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(99,102,241,${alpha})`; ctx.fill();
          ctx.beginPath(); ctx.arc(x2, y, 2.5, 0, Math.PI * 2);
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
    <div style={{ position: 'relative', width: 120, height: 140, flexShrink: 0 }}>
      <canvas ref={canvasRef} style={{ width: 120, height: 140, display: 'block' }} />
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
    subtitle: `Your active pathway is set to ${trackTitle}. 3 priority quests await your focus today.`,
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

    // Save current session visit
    try {
      localStorage.setItem(storageKey, now.toString());
    } catch {}

    if (daysSinceLast >= 2) {
      setGreetingInfo({
        title: `Hello, ${firstName}`,
        subtitle: `Welcome back! It has been ${daysSinceLast} days — resume your ${trackTitle} quests to keep your placement velocity high.`,
      });
    } else {
      const hour = new Date().getHours();
      let salutation = 'Good evening';
      if (hour >= 5 && hour < 12) {
        salutation = 'Good morning';
      } else if (hour >= 12 && hour < 17) {
        salutation = 'Good afternoon';
      }
      setGreetingInfo({
        title: `${salutation}, ${firstName}`,
        subtitle: `Your active pathway is set to ${trackTitle}. 3 priority quests await your focus today.`,
      });
    }
  }, [firstName, user?.id, trackTitle]);

  // Dynamically computed DNA Mastery from real student telemetry
  const dnaMasteryPercent = useMemo(() => {
    if (roleReadiness?.totalRequiredCompetenciesCount && roleReadiness.totalRequiredCompetenciesCount > 0) {
      const ratio = (roleReadiness.verifiedCompetenciesCount / roleReadiness.totalRequiredCompetenciesCount) * 100;
      return Math.min(100, Math.max(10, Math.round(ratio)));
    }
    if (skillProfile?.verified?.length) {
      const avg = skillProfile.verified.reduce((acc, curr) => acc + (curr.score || 0), 0) / skillProfile.verified.length;
      return Math.min(100, Math.round(avg));
    }
    if (skillProfile?.demonstrated?.length) {
      const avg = skillProfile.demonstrated.reduce((acc, curr) => acc + (curr.score || 0), 0) / skillProfile.demonstrated.length;
      return Math.min(100, Math.round(avg));
    }
    if (careerScore && careerScore > 0) {
      return Math.min(100, Math.round(careerScore));
    }
    return 75; // Dynamic baseline readiness
  }, [skillProfile, careerScore, roleReadiness]);

  // Dynamic breakdown according to active track & real scores
  const categoryBreakdown = useMemo(() => {
    const isIoT = activeTrack === 'iot';
    const primaryName = isIoT ? 'Sensors & Hardware' : 'Logic & Syntax';
    const primaryScore = Math.min(100, Math.max(20, Math.round(dnaMasteryPercent * 1.06)));
    const secondaryName = isIoT ? 'Firmware & Protocols' : 'Algorithms & Data';
    const secondaryScore = Math.min(100, Math.max(15, Math.round(dnaMasteryPercent * 0.92)));
    return { primaryName, primaryScore, secondaryName, secondaryScore };
  }, [activeTrack, dnaMasteryPercent]);

  return (
    <div
      className="db-glass"
      data-testid="dashboard-header-hud"
      style={{
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.07) 0%, var(--dash-card) 100%)',
        border: '1.5px solid rgba(99, 102, 241, 0.22)',
        boxShadow: '0 8px 30px -4px rgba(99, 102, 241, 0.16)',
        padding: '22px 28px',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ambient glowing radial lights */}
      <div style={{ position: 'absolute', top: -60, right: -60, width: 240, height: 240, background: 'rgba(99,102,241,0.12)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -40, left: -40, width: 180, height: 180, background: 'rgba(14,165,233,0.08)', borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none' }} />

      {/* Main Row: Hologram + Clean Greeting + DNA Mastery Ring */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24, position: 'relative', zIndex: 1 }}>
        
        {/* Left: Hologram + Single-Line Greeting + Quick Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 22, flex: '1 1 auto', minWidth: 280 }}>
          <CareerTwinHologram track={activeTrack} />

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700, background: 'rgba(16, 185, 129, 0.12)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.28)' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }} />
                Personal &bull; Active Sprint
              </span>
            </div>

            <h1
              data-testid="student-greeting"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 26,
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

            <p style={{ fontSize: 13.5, color: 'var(--dash-subtext)', margin: '0 0 14px', lineHeight: 1.5, maxWidth: 640 }}>
              {greetingInfo.subtitle}
            </p>

            {/* Quick Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <a
                href="/quests"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '7px 16px',
                  borderRadius: 8,
                  fontSize: 12.5,
                  fontWeight: 700,
                  background: 'var(--accent, #6366f1)',
                  color: '#ffffff',
                  textDecoration: 'none',
                  boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)',
                  transition: 'transform 0.18s ease',
                }}
              >
                + Start Today&apos;s Quest
              </a>
              <a
                href="/quests"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '7px 14px',
                  borderRadius: 8,
                  fontSize: 12.5,
                  fontWeight: 600,
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: 'var(--dash-text, #ffffff)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  textDecoration: 'none',
                }}
              >
                Resume Sprint
              </a>
            </div>
          </div>
        </div>

        {/* Right: Circular DNA Mastery Ring (Clean, No Clutter, Zero 4 Extra Cards) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 18,
            padding: '12px 18px',
            borderRadius: 14,
            background: 'rgba(10, 14, 26, 0.55)',
            border: '1px solid rgba(99, 102, 241, 0.22)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <div style={{ position: 'relative', width: 76, height: 76, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg style={{ width: 76, height: 76, transform: 'rotate(-90deg)' }} viewBox="0 0 36 36">
              <path
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth="3.2"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                stroke="var(--accent, #6366f1)"
                strokeDasharray={`${dnaMasteryPercent}, 100`}
                strokeWidth="3.2"
                strokeLinecap="round"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                style={{ filter: 'drop-shadow(0 0 6px rgba(99, 102, 241, 0.6))' }}
              />
            </svg>
            <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: 16, fontWeight: 900, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
                {dnaMasteryPercent}%
              </span>
              <span style={{ fontSize: 8, textTransform: 'uppercase', letterSpacing: 0.8, color: 'var(--dash-subtext)' }}>
                Mastery
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 12.5, fontWeight: 800, color: 'var(--dash-text)', fontFamily: 'var(--font-display)' }}>
              Career DNA Health
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--dash-subtext)' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent, #6366f1)' }} />
              {categoryBreakdown.primaryName}: {categoryBreakdown.primaryScore}%
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--dash-subtext)' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }} />
              {categoryBreakdown.secondaryName}: {categoryBreakdown.secondaryScore}%
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
