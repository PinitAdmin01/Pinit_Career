'use client';
import { useEffect, useRef, useState, useCallback } from 'react';

// ── Dynamic job match companies ──────────────────────────────────────────────
// Bug 3 Fix: match % is now derived from careerScore + trustScore, not hardcoded
const COMPANY_SEEDS = [
  { company: 'Swiggy',   role: 'Backend SDE',      path: '/vault',   offset: 0  },
  { company: 'Razorpay', role: 'Frontend Developer', path: '/quests', offset: -5 },
  { company: 'Zomato',   role: 'DevOps Engineer',    path: '/vault',  offset: +5 },
  { company: 'Flipkart', role: 'Software Engineer',  path: '/quests', offset: +2 },
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

    // Bug 4 Fix: debounce resize via requestAnimationFrame — no layout thrashing
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
    interface Pulse { yOffset: number; speed: number; color: string; }
    interface Ripple { y: number; radius: number; maxRadius: number; color: string; alpha: number; }
    interface MeshNode { x: number; y: number; vx: number; vy: number; baseX: number; baseY: number; radius: number; layer: number; pulsePhase: number; }

    let particles: Particle[] = [];
    const DNA_pulses: Pulse[] = [
      { yOffset: 0.1, speed: 0.008, color: 'rgba(99,102,241,0.9)' },
      { yOffset: 0.5, speed: 0.012, color: 'rgba(168,85,247,0.9)' },
    ];
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

      // Spawn particles
      if (Math.random() < 0.08 && particles.length < 8) {
        particles.push({ x: Math.random() < 0.5 ? 5 : w-5, y: 20+Math.random()*(h-40), targetY: 20+Math.random()*(h-40), size: 1.5+Math.random()*2, alpha: 0.8, speed: 0.6+Math.random()*0.8, color: skillColors[Math.floor(Math.random()*skillColors.length)], active: true });
      }

      // Bug 1 Fix: Never splice inside forEach — set flag then filter once
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
      particles = particles.filter(p => p.active); // single clean pass

      // Ripples
      ripples.forEach(r => { r.radius += 0.8; r.alpha -= 0.025; if (r.alpha <= 0) return; ctx.beginPath(); ctx.ellipse(cx, r.y, r.radius, r.radius*0.25, 0, 0, Math.PI*2); ctx.strokeStyle = r.color.replace('0.8', String(r.alpha)).replace('0.9', String(r.alpha)); ctx.lineWidth = 1; ctx.stroke(); });
      ripples = ripples.filter(r => r.alpha > 0);

      if (track === 'sde') {
        const numP = 30, rBase = 22 + Math.sin(time*0.5)*4;
        ctx.beginPath();
        for (let i = 0; i < numP; i++) { const t=i/numP, y=15+t*(h-30), theta=t*Math.PI*5+angle, x1=cx+Math.sin(theta)*rBase; if(i===0) ctx.moveTo(x1,y); else ctx.lineTo(x1,y); }
        ctx.strokeStyle='rgba(99,102,241,0.45)'; ctx.lineWidth=1.8; ctx.stroke();
        ctx.beginPath();
        for (let i = 0; i < numP; i++) { const t=i/numP, y=15+t*(h-30), theta=t*Math.PI*5+angle, x2=cx-Math.sin(theta)*rBase; if(i===0) ctx.moveTo(x2,y); else ctx.lineTo(x2,y); }
        ctx.strokeStyle='rgba(168,85,247,0.45)'; ctx.lineWidth=1.8; ctx.stroke();
        for (let i = 0; i < numP; i++) {
          const t=i/numP, y=15+t*(h-30), theta=t*Math.PI*5+angle;
          const x1=cx+Math.sin(theta)*rBase, x2=cx-Math.sin(theta)*rBase, z1=Math.cos(theta);
          if (i%2===0) { ctx.beginPath(); ctx.moveTo(x1,y); ctx.lineTo(x2,y); ctx.strokeStyle=`rgba(14,165,233,${0.15+(z1+1)*0.2})`; ctx.lineWidth=1.2; ctx.stroke(); ctx.beginPath(); ctx.arc(cx,y,1.5,0,Math.PI*2); ctx.fillStyle=`rgba(255,255,255,${0.15+(z1+1)*0.2+0.2})`; ctx.fill(); }
          const s1=2+(z1+1)*1.2, a1=0.4+(z1+1)*0.3; ctx.beginPath(); ctx.arc(x1,y,s1,0,Math.PI*2); ctx.fillStyle=`rgba(99,102,241,${a1})`; ctx.fill();
          const s2=2+(-z1+1)*1.2, a2=0.4+(-z1+1)*0.3; ctx.beginPath(); ctx.arc(x2,y,s2,0,Math.PI*2); ctx.fillStyle=`rgba(168,85,247,${a2})`; ctx.fill();
        }
        DNA_pulses.forEach(pulse => { pulse.yOffset+=pulse.speed; if(pulse.yOffset>1) pulse.yOffset=0; const py=15+pulse.yOffset*(h-30), pTheta=pulse.yOffset*Math.PI*5+angle, px=cx+Math.sin(pTheta)*rBase; ctx.beginPath(); ctx.arc(px,py,4.5,0,Math.PI*2); ctx.fillStyle=pulse.color; ctx.fill(); });
      } else {
        meshNodes.forEach((node, i) => {
          node.x += node.vx + Math.sin(time+node.pulsePhase)*0.2;
          node.y += node.vy + Math.cos(time*0.8+node.pulsePhase)*0.2;
          if (Math.abs(node.x-node.baseX) > 12) node.vx *= -1;
          if (Math.abs(node.y-node.baseY) > 12) node.vy *= -1;
          for (let j=i+1; j<meshNodes.length; j++) { const o=meshNodes[j], dx=o.x-node.x, dy=o.y-node.y, dist=Math.sqrt(dx*dx+dy*dy); if(dist<45){ const al=(1-dist/45)*0.5; ctx.beginPath(); ctx.moveTo(node.x,node.y); ctx.lineTo(o.x,o.y); ctx.strokeStyle=`rgba(14,165,233,${al})`; ctx.lineWidth=1; ctx.stroke(); if((i+j)%3===0){const pt=((time*1.5+i)%1),pkX=node.x+dx*pt,pkY=node.y+dy*pt; ctx.beginPath(); ctx.arc(pkX,pkY,1.5,0,Math.PI*2); ctx.fillStyle='rgba(34,197,94,0.9)'; ctx.fill();} } }
          ctx.beginPath(); ctx.arc(node.x,node.y,node.radius,0,Math.PI*2); ctx.fillStyle=node.layer===0?'#6366f1':node.layer===1?'#0ea5e9':'#14b8a6'; ctx.fill();
          if(i%4===0){const pr=node.radius+(Math.sin(time*3+i)+1)*3; ctx.beginPath(); ctx.arc(node.x,node.y,pr,0,Math.PI*2); ctx.strokeStyle='rgba(14,165,233,0.4)'; ctx.lineWidth=0.8; ctx.stroke();}
        });
      }
      animationId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      isDestroyed = true;
      cancelAnimationFrame(resizeRafId);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, [track]);

  return (
    <div style={{ position: 'relative', width: 120, height: 160, flexShrink: 0 }}>
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
    </div>
  );
}

// ── Props ────────────────────────────────────────────────────────────────────
interface DashboardHeaderHUDProps {
  user: any;
  careerScore: number;
  trustScore: number;
  onboardingAnswers: any;
  activeTrack: 'sde' | 'iot';
  onTrackChange: (t: 'sde' | 'iot') => void;
}

// ── Component ────────────────────────────────────────────────────────────────
export default function DashboardHeaderHUD({
  user, careerScore, trustScore, onboardingAnswers, activeTrack, onTrackChange,
}: DashboardHeaderHUDProps) {
  const [hookIdx, setHookIdx] = useState(0);

  // Bug 3 Fix: dynamic match % driven by live scores + company-specific offset
  const getDynamicMatch = useCallback((offset: number) =>
    Math.max(40, Math.min(99, Math.round(careerScore * 0.8 + trustScore * 0.2) + offset)),
  [careerScore, trustScore]);

  useEffect(() => {
    const t = setInterval(() => setHookIdx(i => (i + 1) % COMPANY_SEEDS.length), 4500);
    return () => clearInterval(t);
  }, []);

  const hook = COMPANY_SEEDS[hookIdx];
  const matchPct = getDynamicMatch(hook.offset);
  const firstName = user?.displayName?.split(' ')[0] || 'Candidate';
  const trajectory = (onboardingAnswers as any)?.role || 'Unconfigured';

  return (
    <div style={{
      padding: '24px 28px',
      background: 'var(--dash-banner)',
      border: '1px solid var(--dash-border)',
      borderRadius: 24,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 16,
      flexWrap: 'wrap',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-sm)',
    }}>
      {/* Ambient glow */}
      <div style={{ position:'absolute', top:-60, right:-60, width:220, height:220, background:'rgba(99,102,241,0.12)', borderRadius:'50%', filter:'blur(80px)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:-40, left:-40, width:160, height:160, background:'rgba(14,165,233,0.08)', borderRadius:'50%', filter:'blur(60px)', pointerEvents:'none' }} />

      {/* Left: Hologram + greeting */}
      <div style={{ position:'relative', zIndex:1, display:'flex', alignItems:'center', gap:20, flex:'1 1 auto', minWidth:0 }}>
        <CareerTwinHologram track={activeTrack} />

        <div style={{ flex:1, minWidth:0 }}>
          <span style={{ fontSize:9, fontFamily:'var(--font-mono)', fontWeight:800, color:'var(--accent)', textTransform:'uppercase', letterSpacing:'2px', display:'block', marginBottom:4 }}>
            🛰️ SDE &amp; IoT Unified Cockpit
          </span>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:22, fontWeight:900, color:'var(--dash-text)', letterSpacing:'-0.5px', margin:'0 0 6px' }}>
            System Online: {firstName}
          </h1>
          <p style={{ fontSize:12, color:'var(--dash-subtext)', lineHeight:1.6, margin:'0 0 12px', display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ width:7, height:7, borderRadius:'50%', background:'var(--green)', display:'inline-block', boxShadow:'0 0 8px var(--green)', animation:'hud-pulse 2s infinite ease-in-out' }} />
            Target Trajectory &middot; <strong style={{ color:'var(--dash-text)' }}>{trajectory}</strong>
          </p>

          {/* Dynamic job match progress */}
          <div style={{ background:'rgba(255,255,255,0.02)', border:'1px solid var(--dash-border)', borderRadius:10, padding:'8px 12px', maxWidth:420 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', fontSize:11, marginBottom:5 }}>
              <span style={{ color:'var(--dash-subtext)' }}>
                🎯 <strong>{hook.company}</strong> &middot; {hook.role}
              </span>
              <span style={{ color: matchPct >= 75 ? 'var(--teal-mid)' : 'var(--accent-mid)', fontWeight:800, fontFamily:'var(--font-mono)' }}>
                {matchPct}% Match
              </span>
            </div>
            <div style={{ height:4, background:'rgba(255,255,255,0.04)', borderRadius:2, overflow:'hidden' }}>
              <div style={{ height:'100%', width:`${matchPct}%`, background:`linear-gradient(90deg, var(--accent), ${matchPct >= 75 ? 'var(--teal)' : 'var(--purple)'})`, borderRadius:2, transition:'width 0.6s cubic-bezier(0.4,0,0.2,1)' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Right: Track toggle */}
      <div style={{ position:'relative', zIndex:1, display:'flex', flexDirection:'column', alignItems:'flex-end', gap:10 }}>
        <div style={{ display:'flex', background:'rgba(255,255,255,0.02)', borderRadius:10, padding:3, border:'1px solid var(--dash-border)' }}>
          {(['sde','iot'] as const).map(t => (
            <button
              key={t}
              onClick={() => onTrackChange(t)}
              style={{
                padding:'5px 14px', borderRadius:8, border:'none',
                background: activeTrack === t ? 'var(--bg3)' : 'none',
                color: activeTrack === t ? (t==='sde' ? 'var(--accent)' : 'var(--teal-mid)') : 'var(--t2)',
                fontSize:10.5, fontWeight:700, cursor:'pointer', transition:'all 0.15s',
                fontFamily:'var(--font-mono)',
              }}
            >
              {t === 'sde' ? '💻 SDE Software' : '🔌 IoT Hardware'}
            </button>
          ))}
        </div>
        <div style={{ fontSize:10, fontFamily:'var(--font-mono)', color:'var(--dash-subtext)', textAlign:'right' }}>
          Score Engine &middot; <span style={{ color:'var(--accent)', fontWeight:700 }}>{Math.round(careerScore * 0.8 + trustScore * 0.2)}/100</span>
        </div>
      </div>
    </div>
  );
}
