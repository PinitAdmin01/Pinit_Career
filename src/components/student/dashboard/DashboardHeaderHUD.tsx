'use client';
import { useEffect, useRef, useState, useMemo } from 'react';
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

    let resizeRafId: number;
    const resizeCanvas = () => {
      if (!canvas || isDestroyed) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
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
      if (isDestroyed) return;
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
  careerScore: number;
  trustScore: number;
  onboardingAnswers: any;
  activeTrack: 'sde' | 'iot';
  onTrackChange: (t: 'sde' | 'iot') => void;
  skillProfile?: StudentSkillProfile | null;
  roleReadiness?: DynamicRoleReadiness | null;
}

export default function DashboardHeaderHUD({
  user,
  careerScore,
  trustScore,
  onboardingAnswers,
  activeTrack,
  onTrackChange,
  roleReadiness,
}: Props) {
  const firstName = useMemo(() => {
    return user?.displayName?.split(' ')[0] || user?.username?.split('@')[0] || 'Student';
  }, [user]);

  const trajectory = roleReadiness?.targetRole || onboardingAnswers?.targetRole || onboardingAnswers?.role || 'Full-Stack Software Engineer';

  // Dynamic greeting calculation:
  // If student returns after >= 2 days: "Hello [Name], it's been [X] days! Welcome back."
  // Else: "Good morning/afternoon/evening, [Name]"
  const [greetingInfo, setGreetingInfo] = useState<{ title: string; subtitle: string }>({
    title: `Hello, ${firstName}`,
    subtitle: 'Welcome to your personalized workspace',
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
        title: `Hello ${firstName}, it's been ${daysSinceLast} days!`,
        subtitle: `Welcome back to your workspace — ready to pick up where you left off?`,
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
        subtitle: 'Ready to continue your career journey today?',
      });
    }
  }, [firstName, user?.id]);

  return (
    <div
      className="db-glass"
      data-testid="dashboard-header-hud"
      style={{
        background: 'var(--dash-banner)',
        padding: '20px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        position: 'relative',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      {/* Ambient glowing radial lights */}
      <div style={{ position: 'absolute', top: -60, right: -60, width: 240, height: 240, background: 'rgba(99,102,241,0.12)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -40, left: -40, width: 180, height: 180, background: 'rgba(14,165,233,0.08)', borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none' }} />

      {/* Main Row: Hologram + Greeting + Trust Button + Track Switcher */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20, position: 'relative', zIndex: 1 }}>
        
        {/* Left: Hologram + Clean Greeting */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, flex: '1 1 auto', minWidth: 0 }}>
          <CareerTwinHologram track={activeTrack} />

          <div style={{ flex: 1, minWidth: 0 }}>
            <h1
              data-testid="student-greeting"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 26,
                fontWeight: 900,
                color: 'var(--dash-text)',
                letterSpacing: '-0.5px',
                margin: '0 0 6px',
              }}
            >
              {greetingInfo.title}
            </h1>

            <p style={{ fontSize: 13.5, color: 'var(--dash-subtext)', margin: '0 0 10px', lineHeight: 1.5 }}>
              {greetingInfo.subtitle}
            </p>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '4px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--dash-border)' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--green)', display: 'inline-block', boxShadow: '0 0 8px var(--green)', animation: 'hud-pulse 2s infinite ease-in-out' }} />
              <span style={{ fontSize: 12.5, color: 'var(--dash-subtext)' }}>
                Active Pathway: <strong style={{ color: 'var(--dash-text)' }}>{trajectory}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Right: Trust Button + Track switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          
          {/* Top Trust button */}
          <Link
            href="/trust"
            data-testid="btn-trust-top"
            aria-label="View institutional Trust Quotient and verification"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 7,
              padding: '8px 16px',
              borderRadius: 10,
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1.5px solid rgba(16, 185, 129, 0.35)',
              color: '#10b981',
              fontWeight: 800,
              fontSize: 13,
              fontFamily: 'var(--font-mono)',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 10px rgba(16,185,129,0.12)',
            }}
          >
            <span style={{ fontSize: 15 }}>🛡️</span>
            <span>Trust</span>
          </Link>

          {/* Track Switcher */}
          <div 
            role="radiogroup" 
            aria-label="Engineering Career Trajectory Track"
            style={{ display: 'flex', background: 'rgba(255,255,255,0.02)', borderRadius: 10, padding: 3, border: '1px solid var(--dash-border)' }}
          >
            {(['sde', 'iot'] as const).map(t => (
              <button
                key={t}
                type="button"
                role="radio"
                aria-checked={activeTrack === t}
                tabIndex={activeTrack === t ? 0 : -1}
                onClick={() => onTrackChange(t)}
                style={{
                  padding: '7px 14px', borderRadius: 8, border: 'none',
                  background: activeTrack === t ? 'var(--bg3)' : 'none',
                  color: activeTrack === t ? (t === 'sde' ? 'var(--accent)' : 'var(--teal-mid)') : 'var(--t2)',
                  fontSize: 12, fontWeight: 800, cursor: 'pointer', transition: 'all 0.15s',
                  fontFamily: 'var(--font-mono)',
                  outline: 'none',
                }}
              >
                {t === 'sde' ? '💻 SDE Software' : '🔌 IoT Hardware'}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
