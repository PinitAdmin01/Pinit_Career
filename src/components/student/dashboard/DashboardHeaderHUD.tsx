'use client';
import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { DynamicRoleReadiness, StudentSkillProfile } from '@/lib/pathway/competencySchema';

// ── Dynamic job match companies with authentic required skills ───────────────
const COMPANY_SEEDS = [
  { company: 'Swiggy',   role: 'Backend SDE',        path: '/vault',   requiredSkills: ['Go', 'Java', 'SQL', 'Distributed Systems', 'Redis'] },
  { company: 'Razorpay', role: 'Frontend Developer',   path: '/quests', requiredSkills: ['React', 'TypeScript', 'Next.js', 'WebSockets', 'Tailwind'] },
  { company: 'Zoho',     role: 'Product Engineer',     path: '/arena',  requiredSkills: ['Java', 'C++', 'Data Structures', 'OOP', 'DBMS'] },
  { company: 'Zomato',   role: 'DevOps Engineer',      path: '/vault',  requiredSkills: ['Docker', 'Kubernetes', 'CI/CD', 'AWS', 'Linux'] },
  { company: 'Flipkart', role: 'Software Engineer',    path: '/quests', requiredSkills: ['Data Structures', 'Algorithms', 'Java', 'System Design', 'OOP'] },
];

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
    const w = 120; const h = 160; const cx = w / 2;

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
          const y = 18 + t * (h - 36);
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
    <div style={{ position: 'relative', width: 120, height: 160, flexShrink: 0 }}>
      <canvas ref={canvasRef} style={{ width: 120, height: 160, display: 'block' }} />
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
  user, careerScore, trustScore, onboardingAnswers,
  activeTrack, onTrackChange, skillProfile, roleReadiness
}: Props) {
  const [hookIdx, setHookIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isPaused || isHovered) return;
    const interval = setInterval(() => {
      setHookIdx(i => (i + 1) % COMPANY_SEEDS.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused, isHovered]);

  const hook = COMPANY_SEEDS[hookIdx];
  const firstName = user?.displayName?.split(' ')[0] || user?.username?.split('@')[0] || 'Student';
  const trajectory = roleReadiness?.targetRole || onboardingAnswers?.targetRole || onboardingAnswers?.role || 'Full-Stack Software Engineer';

  // Authentic skill match calculation
  const matchPct = useMemo(() => {
    const knownSkills = [
      ...(user?.skill_tags || []),
      ...(skillProfile?.verified || []),
      ...(skillProfile?.demonstrated || []),
    ].map((s: string) => s.toLowerCase());

    if (knownSkills.length === 0) {
      return Math.min(65, Math.max(20, Math.round(careerScore * 0.4 + 15)));
    }
    const matched = hook.requiredSkills.filter(req =>
      knownSkills.some(k => k.includes(req.toLowerCase()) || req.toLowerCase().includes(k))
    ).length;

    const basePct = Math.round((matched / hook.requiredSkills.length) * 100);
    return Math.max(basePct, Math.min(95, Math.round(careerScore * 0.75)));
  }, [hook, user?.skill_tags, skillProfile, careerScore]);

  return (
    <div className="db-glass" style={{
      background: 'var(--dash-banner)',
      padding: '20px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      position: 'relative',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-sm)',
    }}>
      {/* Ambient glowing radial lights */}
      <div style={{ position: 'absolute', top: -60, right: -60, width: 240, height: 240, background: 'rgba(99,102,241,0.12)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -40, left: -40, width: 180, height: 180, background: 'rgba(14,165,233,0.08)', borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none' }} />

      {/* Main Row: Hologram + Cockpit Details + Track Switcher */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20, position: 'relative', zIndex: 1 }}>
        
        {/* Left: Hologram + greeting & match ticker */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, flex: '1 1 auto', minWidth: 0 }}>
          <CareerTwinHologram track={activeTrack} />

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
              <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                🛰️ CAMPUS CAREER COMMAND COCKPIT
              </span>
              <span style={{ fontSize: 10.5, fontFamily: 'var(--font-mono)', padding: '2px 8px', borderRadius: 6, background: 'rgba(16,185,129,0.12)', color: '#10b981', border: '1px solid rgba(16,185,129,0.25)' }}>
                🎯 ₹6.5 - ₹12.0 LPA Campus Benchmark
              </span>
            </div>

            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 900, color: 'var(--dash-text)', letterSpacing: '-0.5px', margin: '0 0 6px' }}>
              System Online: {firstName}
            </h1>

            <p style={{ fontSize: 13, color: 'var(--dash-subtext)', lineHeight: 1.5, margin: '0 0 10px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--green)', display: 'inline-block', boxShadow: '0 0 8px var(--green)', animation: 'hud-pulse 2s infinite ease-in-out' }} />
              Active Pathway &middot; <strong style={{ color: 'var(--dash-text)' }}>{trajectory}</strong>
            </p>

            {/* Dynamic company match carousel */}
            <div
              tabIndex={0}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onFocus={() => setIsHovered(true)}
              onBlur={() => setIsHovered(false)}
              aria-label={`Job match spotlight: ${hook.company} ${hook.role} with ${matchPct}% skill match.`}
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--dash-border)', borderRadius: 10, padding: '8px 12px', maxWidth: 440, outline: 'none' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, marginBottom: 5 }}>
                <span style={{ color: 'var(--dash-subtext)' }}>
                  🏢 <strong>{hook.company}</strong> &middot; {hook.role}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: matchPct >= 75 ? '#10b981' : 'var(--accent)', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
                    {matchPct}% Match
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsPaused(p => !p);
                    }}
                    aria-label={isPaused ? "Play company match" : "Pause company match"}
                    style={{ background: 'none', border: '1px solid var(--dash-border)', borderRadius: 4, color: 'var(--dash-subtext)', fontSize: 10, cursor: 'pointer', padding: '1px 5px', lineHeight: 1 }}
                  >
                    {isPaused ? '▶' : '⏸'}
                  </button>
                </div>
              </div>
              <div style={{ height: 4, background: 'rgba(255,255,255,0.04)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${matchPct}%`, background: `linear-gradient(90deg, var(--accent), ${matchPct >= 75 ? '#10b981' : 'var(--purple)'})`, borderRadius: 2, transition: 'width 0.6s ease' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Track switcher + Composite score engine */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
          <div 
            role="radiogroup" 
            aria-label="Engineering Career Trajectory Track"
            style={{ display: 'flex', background: 'rgba(255,255,255,0.02)', borderRadius: 10, padding: 3, border: '1px solid var(--dash-border)' }}
          >
            {(['sde', 'iot'] as const).map(t => (
              <button
                key={t}
                role="radio"
                aria-checked={activeTrack === t}
                tabIndex={activeTrack === t ? 0 : -1}
                onClick={() => onTrackChange(t)}
                style={{
                  padding: '6px 14px', borderRadius: 8, border: 'none',
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
          <div style={{ fontSize: 11.5, fontFamily: 'var(--font-mono)', color: 'var(--dash-subtext)', textAlign: 'right' }}>
            Placement Readiness Index &middot; <strong style={{ color: 'var(--accent)' }}>{Math.round(careerScore * 0.75 + trustScore * 0.25)}/100</strong>
          </div>
        </div>
      </div>

      {/* Integrated Pathway & Skill Summary Bar (eliminated separate redundant box) */}
      <div style={{
        borderTop: '1px solid var(--dash-border)',
        paddingTop: 12,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
            STATUS:
          </span>
          <span style={{
            fontSize: 11.5,
            fontFamily: 'var(--font-mono)',
            fontWeight: 800,
            padding: '2px 8px',
            borderRadius: 6,
            background: roleReadiness?.status === 'ready_for_interview' || roleReadiness?.status === 'placement_ready' ? 'rgba(16,185,129,0.12)' : 'rgba(59,130,246,0.12)',
            color: roleReadiness?.status === 'ready_for_interview' || roleReadiness?.status === 'placement_ready' ? '#10b981' : '#3b82f6',
            border: `1px solid ${roleReadiness?.status === 'ready_for_interview' || roleReadiness?.status === 'placement_ready' ? 'rgba(16,185,129,0.3)' : 'rgba(59,130,246,0.3)'}`
          }}>
            {(roleReadiness?.status || 'DEVELOPING COMPETENCY').toUpperCase().replace(/_/g, ' ')}
          </span>
          <span style={{ fontSize: 12, color: 'var(--t4)' }}>•</span>
          <span style={{ fontSize: 11.5, fontFamily: 'var(--font-mono)', color: 'var(--t2)' }}>
            ⚡ 9-Month Accelerated Curriculum
          </span>
        </div>

        {/* 3-Tier Skill Summary */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontFamily: 'var(--font-mono)' }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
            <span style={{ color: 'var(--t3)' }}>Verified:</span>
            <strong style={{ color: '#10b981' }}>{skillProfile?.verified.length || 0}</strong>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontFamily: 'var(--font-mono)' }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#3b82f6', display: 'inline-block' }} />
            <span style={{ color: 'var(--t3)' }}>Demonstrated:</span>
            <strong style={{ color: '#3b82f6' }}>{skillProfile?.demonstrated.length || 0}</strong>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontFamily: 'var(--font-mono)' }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--t4)', display: 'inline-block' }} />
            <span style={{ color: 'var(--t3)' }}>Claimed:</span>
            <strong style={{ color: 'var(--t2)' }}>{skillProfile?.claimed.length || 0}</strong>
          </div>

          <Link
            href="/quests?tab=passport"
            style={{
              fontSize: 11.5,
              fontFamily: 'var(--font-mono)',
              fontWeight: 800,
              color: 'var(--accent)',
              textDecoration: 'none',
              padding: '4px 10px',
              borderRadius: 6,
              background: 'rgba(99, 102, 241, 0.12)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              transition: 'all 0.15s ease',
            }}
          >
            Skill Passport ➔
          </Link>
        </div>
      </div>
    </div>
  );
}
