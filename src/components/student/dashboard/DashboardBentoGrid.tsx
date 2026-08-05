'use client';

const EVO_STAGES = [
  { stage:1, name:'🌱 Primitive Coder',       minScore:0,  desc:'Syntax primitives & variable scopes' },
  { stage:2, name:'🔨 Toolmaker Builder',      minScore:21, desc:'Class structure & verified certifications' },
  { stage:3, name:'🏹 Homo Sapien Dev',        minScore:41, desc:'Complex React hooks & full-stack APIs' },
  { stage:4, name:'🤖 Cybernetic Engineer',    minScore:61, desc:'Realtime AI mock exams & secure proctoring' },
  { stage:5, name:'🧦 Transcendent Archon',    minScore:81, desc:'System design scaling & collaborative panels' },
];

interface Props {
  careerScore: number;
  dnaScore: number;
  activeTrack: 'sde' | 'iot';
  contributionDates: Date[];
  getContributionsForDate: (date: Date) => number;
  activeStageIndex: number;
  learningMistakes?: any[];
}

export default function DashboardBentoGrid({
  careerScore, dnaScore, activeTrack,
  contributionDates, getContributionsForDate,
  activeStageIndex, learningMistakes = [],
}: Props) {
  const accentRgb = activeTrack === 'iot' ? '20,184,166' : '99,102,241';
  const accentVar = activeTrack === 'iot' ? 'var(--teal-mid)' : 'var(--accent)';

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16 }}>

      {/* Row 1: Evolution Timeline (full width) */}
      <div className="db-glass" style={{ padding:'18px 24px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:8, marginBottom:14 }}>
          <div>
            <span className="db-label">🧬 HUMAN EVOLUTION PROGRESSION</span>
            <h3 style={{ fontSize:13.5, fontWeight:800, color:'var(--t1)', margin:'2px 0 0' }}>
              Stage: <span style={{ color:'var(--accent)' }}>{EVO_STAGES[activeStageIndex].name}</span> &middot; {activeStageIndex + 1} of 5
            </h3>
          </div>
          <div style={{ fontSize:11, fontFamily:'var(--font-mono)', color:'var(--t2)' }}>
            DNA Score: <strong style={{ color:'var(--accent)' }}>{careerScore}</strong>/100
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', position:'relative', padding:'10px 0', margin:'4px 0' }}>
          {/* Track line */}
          <div style={{ position:'absolute', left:'5%', right:'5%', height:3, background:'rgba(255,255,255,0.04)', zIndex:0 }} />
          <div style={{ position:'absolute', left:'5%', width:`${Math.min(90, activeStageIndex * 22.5)}%`, height:3, background:'var(--accent)', zIndex:0, transition:'width 0.6s ease', boxShadow:'0 0 8px var(--accent-glow)' }} />
          {EVO_STAGES.map((step, idx) => {
            const active = idx <= activeStageIndex;
            const current = idx === activeStageIndex;
            return (
              <div key={step.stage} style={{ position:'relative', zIndex:1, display:'flex', flexDirection:'column', alignItems:'center', width:'18%', textAlign:'center' }}>
                <div style={{ width:34, height:34, borderRadius:'50%', background: current ? 'var(--accent)' : active ? 'var(--accent-light)' : 'var(--bg3)', border:`2px solid ${active ? 'var(--accent)' : 'var(--border)'}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, boxShadow: current ? '0 0 12px var(--accent-glow)' : 'none', transition:'all 0.3s ease' }}>
                  {step.name.split(' ')[0]}
                </div>
                <div style={{ fontSize:9.5, fontWeight:700, color: current ? 'var(--accent)' : active ? 'var(--t1)' : 'var(--t4)', marginTop:6, whiteSpace:'nowrap' }}>
                  {step.name.split(' ').slice(1).join(' ')}
                </div>
                <div style={{ fontSize:9, color:'var(--t4)', marginTop:2, display: current ? 'block' : 'none', maxWidth:90, lineHeight:1.3 }}>
                  {step.desc}
                </div>
              </div>
            );
          })}
        </div>
        <p style={{ fontSize:10.5, color:'var(--t3)', margin:0, lineHeight:1.45 }}>
          Solve missions, pass theory classes, verify vault files, and clear recruiter exams to evolve your status.
        </p>
      </div>

      {/* Row 2: Radar + Heatmap */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:16 }}>

        {/* Radar chart — Bug 5 Fix: fluid viewBox scaling, no fixed px text positions */}
        <div className="db-glass" style={{ padding:20 }}>
          <span className="db-label">📊 SOCRATIC COMPETENCIES RADAR</span>
          <h3 style={{ fontSize:13, fontWeight:800, color:'var(--t1)', margin:'2px 0 14px' }}>Multi-Dimensional Skills</h3>
          <div style={{ display:'flex', justifyContent:'center', alignItems:'center' }}>
            {/* Bug 5 Fix: width=100% + viewBox ensures no label clipping on small screens */}
            <svg
              width="100%"
              viewBox="0 0 120 120"
              preserveAspectRatio="xMidYMid meet"
              style={{ maxWidth:220 }}
            >
              {/* Pentagon grid rings */}
              {[0.2,0.4,0.6,0.8,1.0].map(level => {
                const r = 48 * level;
                const pts = [
                  `60,${60-r}`,
                  `${60+r*Math.sin(72*Math.PI/180)},${60-r*Math.cos(72*Math.PI/180)}`,
                  `${60+r*Math.sin(144*Math.PI/180)},${60-r*Math.cos(144*Math.PI/180)}`,
                  `${60-r*Math.sin(144*Math.PI/180)},${60-r*Math.cos(144*Math.PI/180)}`,
                  `${60-r*Math.sin(72*Math.PI/180)},${60-r*Math.cos(72*Math.PI/180)}`,
                ].join(' ');
                return <polygon key={level} points={pts} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.6" />;
              })}
              {/* Axes */}
              {[0,72,144,216,288].map(a => {
                const x=60+48*Math.sin(a*Math.PI/180), y=60-48*Math.cos(a*Math.PI/180);
                return <line key={a} x1="60" y1="60" x2={x} y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="0.6" />;
              })}
              {/* Data polygon */}
              {activeTrack === 'sde' ? (
                <polygon points="60,17 81,36 77,82 30,72 42,44" fill={`rgba(${accentRgb},0.15)`} stroke={accentVar} strokeWidth="1.5" />
              ) : (
                <polygon points="60,24 88,33 72,80 30,68 14,20" fill="rgba(20,184,166,0.15)" stroke="var(--teal-mid)" strokeWidth="1.5" />
              )}
              {/* Labels — relative to viewBox center (60,60), won't clip at any size */}
              <text x="60" y="9"  fontSize="5.5" textAnchor="middle" fill="var(--t3)" fontWeight="700">CODING</text>
              <text x="113" y="42" fontSize="5.5" textAnchor="start"  fill="var(--t3)" fontWeight="700">ARCH</text>
              <text x="95"  y="115" fontSize="5.5" textAnchor="middle" fill="var(--t3)" fontWeight="700">DATA</text>
              <text x="18"  y="115" fontSize="5.5" textAnchor="middle" fill="var(--t3)" fontWeight="700">SOCRATIC</text>
              <text x="2"   y="42" fontSize="5.5" textAnchor="start"  fill="var(--t3)" fontWeight="700">IoT</text>
            </svg>
          </div>
          <div style={{ display:'flex', justifyContent:'center', gap:16, marginTop:10, fontSize:10, color:'var(--t3)' }}>
            <span style={{ display:'flex', alignItems:'center', gap:4 }}><span style={{ width:8, height:8, borderRadius:2, background: activeTrack==='sde' ? 'var(--accent)' : 'var(--teal-mid)' }} />Current</span>
          </div>
        </div>

        {/* Heatmap */}
        <div className="db-glass" style={{ padding:20 }}>
          <span className="db-label">🔥 SOCRATIC CONTRIBUTION TRACKER</span>
          <h3 style={{ fontSize:13, fontWeight:800, color:'var(--t1)', margin:'2px 0 14px' }}>Learning Activity Heatmap</h3>
          <style>{`
            .db-hcell { position: relative; }
            .db-hcell:hover::after { content: attr(data-tip); position:absolute; bottom:140%; left:50%; transform:translateX(-50%); background:#111827; color:#f3f4f6; border:1px solid rgba(255,255,255,0.08); padding:3px 7px; border-radius:4px; font-size:9px; font-family:var(--font-mono); white-space:nowrap; z-index:9999; pointer-events:none; }
          `}</style>
          <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
            {/* Month row */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(12,1fr)', gap:4, paddingLeft:24, fontSize:8.5, color:'var(--t3)', fontFamily:'var(--font-mono)' }}>
              {Array.from({length:12}).map((_,ci) => {
                const ws = contributionDates[ci*7];
                const show = ci===0 || (ws && ws.getMonth() !== contributionDates[(ci-1)*7]?.getMonth());
                return <div key={ci} style={{ visibility: show ? 'visible' : 'hidden' }}>{ws ? ws.toLocaleString('default',{month:'short'}) : ''}</div>;
              })}
            </div>
            <div style={{ display:'flex', gap:4, alignItems:'flex-start' }}>
              {/* Day labels */}
              <div style={{ display:'flex', flexDirection:'column', justifyContent:'space-between', height:104, fontSize:8.5, color:'var(--t3)', paddingRight:4, fontFamily:'var(--font-mono)', lineHeight:'12px' }}>
                <span>Sun</span><span>Tue</span><span>Thu</span><span>Sat</span>
              </div>
              {/* Grid */}
              <div style={{ display:'grid', gridTemplateRows:'repeat(7,1fr)', gridAutoFlow:'column', gap:3.5, flex:1, height:104 }}>
                {contributionDates.map((date, idx) => {
                  const cnt = getContributionsForDate(date);
                  const lv = cnt===0?0:cnt===1?1:cnt===2?2:3;
                  const fut = date > new Date();
                  let bg = fut ? 'rgba(255,255,255,0.01)' : lv===0 ? 'rgba(255,255,255,0.03)' : lv===1 ? `rgba(${accentRgb},0.15)` : lv===2 ? `rgba(${accentRgb},0.45)` : accentVar;
                  const tip = fut ? 'Future' : `${cnt} contribution${cnt!==1?'s':''} on ${date.toLocaleDateString('default',{month:'short',day:'numeric',year:'numeric'})}`;
                  return <div key={idx} data-tip={tip} className="db-hcell" style={{ aspectRatio:'1', background:bg, border:'1px solid var(--border)', borderRadius:2, cursor: fut?'default':'pointer' }} />;
                })}
              </div>
            </div>
            {/* Legend */}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', fontSize:9.5, color:'var(--t4)', marginTop:4, fontFamily:'var(--font-mono)' }}>
              <span>Less active</span>
              <div style={{ display:'flex', gap:3 }}>
                {[0,1,2,3].map(lv => <div key={lv} style={{ width:9, height:9, borderRadius:2, background: lv===0?'rgba(255,255,255,0.03)':lv===1?`rgba(${accentRgb},0.15)`:lv===2?`rgba(${accentRgb},0.45)`:accentVar, border: lv===0?'1px solid var(--border)':'none' }} />)}
              </div>
              <span>More active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: AI Mistakes widget */}
      {learningMistakes.length > 0 && (
        <div className="db-glass" style={{ padding:20 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
            <div>
              <span className="db-label">⚠️ AI MISTAKES & REMEDIATION</span>
              <h3 style={{ fontSize:13, fontWeight:800, color:'var(--t1)', margin:'2px 0 0' }}>Unresolved Knowledge Gaps</h3>
            </div>
            <span style={{ fontSize:10, fontWeight:700, color:'var(--coral-mid)', background:'var(--coral-light)', padding:'2px 8px', borderRadius:8 }}>
              {learningMistakes.length} active
            </span>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {learningMistakes.slice(0,2).map((m: any) => (
              <div key={m.id} style={{ display:'flex', gap:8, alignItems:'flex-start', background:'rgba(255,255,255,0.01)', border:'1px solid var(--border)', borderRadius:8, padding:9 }}>
                <span style={{ fontSize:10, background:'var(--coral-light)', color:'var(--coral-mid)', padding:'1px 5px', borderRadius:4, fontWeight:800, textTransform:'uppercase', flexShrink:0 }}>{m.type}</span>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:11, fontWeight:700, color:'var(--t1)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{m.module}</div>
                  <div style={{ fontSize:10, color:'var(--t2)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', marginTop:1 }}>{m.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
