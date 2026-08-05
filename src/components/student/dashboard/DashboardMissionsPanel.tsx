'use client';
import Link from 'next/link';
import MissionCard from '@/components/ui/MissionCard';
import ActivityFeed from '@/components/ui/ActivityFeed';

interface NextStep {
  title: string;
  desc: string;
  href: string;
  icon: string;
  color: string;
}

interface Props {
  pendingMissions: any[];
  nextStep: NextStep;
  userId?: string;
}

export default function DashboardMissionsPanel({ pendingMissions, nextStep, userId }: Props) {
  return (
    <div style={{ display:'grid', gridTemplateColumns:'minmax(0,1fr) minmax(0,1.6fr) minmax(0,1fr)', gap:16 }}>

      {/* Col 1: Next Step Card */}
      <div className="db-glass" style={{ padding:20, display:'flex', flexDirection:'column', gap:12 }}>
        <div>
          <span style={{ fontSize:8.5, fontFamily:'var(--font-mono)', fontWeight:800, color:'var(--accent)', textTransform:'uppercase', letterSpacing:'1.5px', display:'block' }}>🚦 NEXT PRIORITY</span>
          <h3 style={{ fontSize:13.5, fontWeight:800, color:'var(--t1)', margin:'4px 0 0' }}>Your Best Next Move</h3>
        </div>
        <Link href={nextStep.href} style={{ textDecoration:'none', flex:1 }}>
          <div style={{ padding:16, borderRadius:12, background:`${nextStep.color}14`, border:`1.5px solid ${nextStep.color}30`, display:'flex', flexDirection:'column', gap:10, height:'100%', transition:'all 0.15s', cursor:'pointer' }}
            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform='translateY(-2px)'; (e.currentTarget as HTMLDivElement).style.boxShadow=`0 6px 16px ${nextStep.color}30`; }}
            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform='translateY(0)'; (e.currentTarget as HTMLDivElement).style.boxShadow='none'; }}
          >
            <span style={{ fontSize:28 }}>{nextStep.icon}</span>
            <div style={{ fontSize:13, fontWeight:800, color:'var(--t1)', lineHeight:1.35 }}>{nextStep.title}</div>
            <div style={{ fontSize:11.5, color:'var(--t2)', lineHeight:1.5, flex:1 }}>{nextStep.desc}</div>
            <span style={{ fontSize:11.5, fontWeight:700, color:nextStep.color, fontFamily:'var(--font-mono)' }}>Take Action ➔</span>
          </div>
        </Link>
      </div>

      {/* Col 2: SDE Missions */}
      <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:20, overflow:'hidden', boxShadow:'var(--shadow-sm)' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'14px 18px', borderBottom:'1px solid var(--border)' }}>
          <h3 style={{ fontFamily:'var(--font-display)', fontSize:14, fontWeight:800, color:'var(--t1)', margin:0, display:'flex', alignItems:'center', gap:8 }}>
            ⚡ SDE Practice Missions
          </h3>
          <Link href="/missions" style={{ fontSize:10.5, color:'var(--accent)', textDecoration:'none', fontWeight:600, fontFamily:'var(--font-mono)' }}>Solve All ➔</Link>
        </div>
        <div style={{ padding:14, display:'flex', flexDirection:'column', gap:10 }}>
          {pendingMissions.length === 0 ? (
            <div style={{ textAlign:'center', padding:'20px 14px', background:'var(--bg3)', borderRadius:12, border:'1px dashed var(--border)' }}>
              <div style={{ fontSize:24, marginBottom:6 }}>🎉</div>
              <div style={{ fontSize:12.5, fontWeight:700, color:'var(--t1)', marginBottom:2 }}>All Daily Missions Cleared!</div>
              <p style={{ fontSize:11, color:'var(--t3)', margin:'0 auto 10px', lineHeight:1.4 }}>Excellent commitment — all gaps resolved today.</p>
              <Link href="/opportunities" style={{ fontSize:11.5, fontWeight:700, color:'var(--accent)', textDecoration:'none', fontFamily:'var(--font-mono)' }}>🎯 Match SDE Openings ➔</Link>
            </div>
          ) : (
            pendingMissions.slice(0,2).map((m: any) => (
              <div key={m.id} style={{ position:'relative' }}>
                <MissionCard mission={m} onComplete={() => {}} />
                {m.target_gap && (
                  <div style={{ position:'absolute', bottom:12, right:140, fontSize:10, fontFamily:'var(--font-mono)', background:'var(--bg3)', border:'1px solid var(--border)', padding:'1px 6px', borderRadius:5, color:'var(--t2)' }}>
                    Gap: <span style={{ color:'var(--accent)', fontWeight:700 }}>{m.target_gap}</span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Col 3: Live Activity Feed */}
      <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:20, padding:16, boxShadow:'var(--shadow-sm)' }}>
        <span style={{ fontSize:12.5, fontWeight:800, color:'var(--t1)', fontFamily:'var(--font-display)', marginBottom:10, display:'flex', alignItems:'center', gap:6 }}>
          <span style={{ width:7, height:7, borderRadius:'50%', background:'var(--green)', display:'inline-block', boxShadow:'0 0 6px var(--green)', animation:'hud-pulse 2s infinite ease-in-out' }} />
          Live Activity
        </span>
        <ActivityFeed userId={userId} />
      </div>
    </div>
  );
}
