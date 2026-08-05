'use client';
import { useState, useEffect, useRef } from 'react';

interface LevelInfo {
  index: number;
  label: string;
  next: string | null;
  xp: number;
  pct: number;
  color: string;
  emoji: string;
}

function AnimatedNum({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  const raf = useRef<number>();
  useEffect(() => {
    const start = performance.now(), dur = 900;
    const tick = (now: number) => {
      const t = Math.min(1, (now-start)/dur);
      const e = 1 - Math.pow(1-t, 3);
      setDisplay(value * e);
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [value]);
  return <>{Math.round(display)}</>;
}

interface Props {
  xp: number;
  careerScore: number;
  trustScore: number;
  level: LevelInfo;
  isScanning: boolean;
  scanProgress: number;
  scanLogs: string[];
  unverifiedCount: number;
  onStartScan: () => void;
  vaultItemsCount: number;
  userRole?: string;
  onSeedDemo?: () => void;
}

export default function DashboardStatsRow({
  xp, careerScore, trustScore, level,
  isScanning, scanProgress, scanLogs,
  unverifiedCount, onStartScan,
  vaultItemsCount, userRole, onSeedDemo,
}: Props) {
  const trustLevel = Math.floor(trustScore / 20);

  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:16 }}>

      {/* Card 1: XP & Reputation Tier */}
      <div className="db-glass" style={{ padding:20, display:'flex', alignItems:'center', gap:16 }}>
        <div style={{ position:'absolute', top:-30, left:-30, width:120, height:120, background:`rgba(${level.color === 'var(--accent)' ? '99,102,241' : '124,58,237'},0.12)`, borderRadius:'50%', filter:'blur(40px)', pointerEvents:'none' }} />
        <div style={{ position:'relative', zIndex:1, width:72, height:72, flexShrink:0 }}>
          <svg width="72" height="72" viewBox="0 0 36 36" style={{ transform:'rotate(-90deg)' }}>
            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="2.5" />
            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={level.color} strokeDasharray={`${level.pct}, 100`} strokeWidth="2.5" strokeLinecap="round" style={{ transition:'stroke-dasharray 1s ease' }} />
          </svg>
          <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', fontSize:20, lineHeight:1 }}>{level.emoji}</div>
        </div>
        <div style={{ flex:1, zIndex:1, minWidth:0 }}>
          <div style={{ fontSize:9, fontFamily:'var(--font-mono)', fontWeight:800, color:'var(--dash-subtext)', textTransform:'uppercase', letterSpacing:'1px', marginBottom:4 }}>🎓 Reputation Tier</div>
          <div style={{ fontFamily:'var(--font-display)', fontSize:20, fontWeight:900, color:level.color, marginBottom:2 }}>{level.label}</div>
          <div style={{ fontSize:10, color:'var(--t3)', fontFamily:'var(--font-mono)', marginBottom:6 }}>Tier {level.index} · <AnimatedNum value={xp} /> XP</div>
          <div style={{ height:3, background:'var(--bg3)', borderRadius:2, overflow:'hidden' }}>
            <div style={{ height:'100%', width:`${level.pct}%`, background:`linear-gradient(90deg, var(--accent), ${level.color})`, borderRadius:2, transition:'width 0.8s ease' }} />
          </div>
          <div style={{ fontSize:9.5, color:'var(--t4)', fontFamily:'var(--font-mono)', marginTop:4 }}>{level.pct}% to {level.next || 'Max Tier'}</div>
        </div>
      </div>

      {/* Card 2: Career Score circular gauge */}
      <div className="db-glass" style={{ padding:20, display:'flex', alignItems:'center', gap:16, overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-30, right:-30, width:120, height:120, background:'rgba(99,102,241,0.15)', borderRadius:'50%', filter:'blur(40px)', pointerEvents:'none' }} />
        <div style={{ flex:1, zIndex:1, minWidth:0 }}>
          <div style={{ fontSize:9, fontFamily:'var(--font-mono)', fontWeight:800, color:'var(--dash-subtext)', textTransform:'uppercase', letterSpacing:'1px', marginBottom:4 }}>💻 Career Score</div>
          <div style={{ fontFamily:'var(--font-display)', fontSize:28, fontWeight:900, color:'var(--t1)', marginBottom:2 }}>
            <span style={{ color:'var(--accent)' }}><AnimatedNum value={careerScore} /></span>
            <span style={{ fontSize:13, color:'var(--dash-subtext)' }}>/100</span>
          </div>
          <div style={{ fontSize:11, color:'var(--dash-subtext)', display:'flex', flexDirection:'column', gap:3 }}>
            <div>🛡️ Compiler Safety: <strong style={{ color:'var(--green-mid)' }}>98% Compliance</strong></div>
            <div>📊 Logic Score: <strong style={{ color:'var(--accent)' }}>O(N) pass</strong></div>
          </div>
        </div>
        <div style={{ position:'relative', width:80, height:80, flexShrink:0, zIndex:1 }}>
          <svg width="80" height="80" viewBox="0 0 36 36" style={{ transform:'rotate(-90deg)' }}>
            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="2.5" />
            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="var(--accent)" strokeDasharray={`${careerScore}, 100`} strokeWidth="2.5" strokeLinecap="round" style={{ transition:'stroke-dasharray 1s ease' }} />
          </svg>
          <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', fontFamily:'var(--font-display)', fontSize:16, fontWeight:900, color:'var(--t1)' }}>
            {Math.round(careerScore)}
          </div>
        </div>
      </div>

      {/* Card 3: Trust Quotient */}
      <div className="db-glass" style={{ padding:20, display:'flex', flexDirection:'column', gap:10, overflow:'hidden', position:'relative' }}>
        {isScanning && (
          <div style={{ position:'absolute', left:0, width:'100%', height:2, background:'linear-gradient(90deg, transparent, var(--green-mid), transparent)', boxShadow:'0 0 6px var(--green)', animation:'hud-scan 2.5s infinite linear', zIndex:10 }} />
        )}
        <div style={{ position:'absolute', bottom:-30, right:-30, width:120, height:120, background:'rgba(5,150,105,0.1)', borderRadius:'50%', filter:'blur(40px)', pointerEvents:'none' }} />
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', zIndex:1 }}>
          <div>
            <div style={{ fontSize:9, fontFamily:'var(--font-mono)', fontWeight:800, color:'var(--dash-subtext)', textTransform:'uppercase', letterSpacing:'1px' }}>🔐 Trust Quotient</div>
            <div style={{ fontFamily:'var(--font-display)', fontSize:28, fontWeight:900, color:'var(--green-mid)', marginTop:2 }}>
              <AnimatedNum value={trustScore} />%
            </div>
          </div>
          <span style={{ fontSize:10, fontWeight:700, color:'var(--green-mid)', background:'var(--green-light)', padding:'2px 9px', borderRadius:8, border:'1px solid rgba(5,150,105,0.2)', marginTop:2 }}>
            {trustScore >= 70 ? 'High Trust' : 'Moderate'}
          </span>
        </div>
        <div style={{ display:'flex', gap:3, height:5, zIndex:1 }}>
          {[1,2,3,4,5].map(seg => {
            const filled = trustLevel >= seg;
            return (
              <div key={seg} style={{ flex:1, height:'100%', borderRadius:3, background: filled ? 'var(--green-mid)' : 'rgba(255,255,255,0.04)', boxShadow: filled ? '0 0 6px var(--green)' : 'none', transition:'all 0.5s ease' }} />
            );
          })}
        </div>
        <div style={{ zIndex:1 }}>
          {isScanning ? (
            <div style={{ background:'rgba(6,8,14,0.95)', fontFamily:'var(--font-mono)', fontSize:10, borderRadius:8, border:'1px solid var(--border)', padding:10, color:'var(--green-mid)', height:80, overflowY:'auto', lineHeight:1.5 }}>
              {scanLogs.map((log, i) => <div key={i}>{log}</div>)}
              <div style={{ marginTop:4, height:3, background:'rgba(255,255,255,0.03)', borderRadius:2, overflow:'hidden' }}>
                <div style={{ height:'100%', width:`${scanProgress}%`, background:'var(--green-mid)', transition:'width 0.25s linear' }} />
              </div>
            </div>
          ) : unverifiedCount > 0 ? (
            <button onClick={onStartScan} style={{ width:'100%', background:'linear-gradient(135deg, var(--green) 0%, var(--green-mid) 100%)', border:'none', borderRadius:8, padding:'8px', fontSize:11.5, fontWeight:700, color:'white', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
              ⚡ Run AI Trust Audit ({unverifiedCount} Pending)
            </button>
          ) : (
            <div style={{ fontSize:11.5, color:'var(--dash-subtext)' }}>
              ✓ All credentials verified.
              {vaultItemsCount === 0 && userRole === 'admin' && onSeedDemo && (
                <button onClick={onSeedDemo} style={{ marginLeft:8, background:'none', border:'1px solid var(--border)', borderRadius:6, color:'var(--accent)', fontSize:10, padding:'2px 8px', cursor:'pointer' }}>+ Seed Demo</button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
