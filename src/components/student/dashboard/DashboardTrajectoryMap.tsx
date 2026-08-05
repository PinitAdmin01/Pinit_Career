'use client';
import { useState } from 'react';
import Link from 'next/link';

const TRACKS = [
  { title:'Java Backend Architect',                    icon:'☕', color:'var(--accent)' },
  { title:'Frontend React Engineer',                   icon:'⚛️', color:'var(--teal)' },
  { title:'UI/UX Design Systems & Visual Frontend',    icon:'🎨', color:'var(--amber)' },
  { title:'Data Structures & Algorithmic Optimizations',icon:'🔢', color:'var(--blue)' },
  { title:'Mobile Application Development',            icon:'📱', color:'var(--purple)' },
  { title:'Cybersecurity Specialist & Secure Systems', icon:'🛡️', color:'var(--accent)' },
  { title:'Database Engineering & Query Performance',  icon:'💾', color:'var(--teal)' },
  { title:'High-Scale Distributed System Design',      icon:'🌐', color:'var(--blue)' },
  { title:'Cloud Native AWS Architect',                icon:'☁️', color:'var(--amber)' },
  { title:'DevOps & CI/CD Automation Specialist',      icon:'🚀', color:'var(--green)' },
  { title:'AI Software Engineer',                      icon:'🤖', color:'var(--purple)' },
  { title:'IoT, Firmware & Embedded Systems',          icon:'🔌', color:'var(--teal)' },
  { title:'IoT Wireless Networks',                     icon:'📶', color:'var(--blue)' },
  { title:'Edge AI & TinyML',                          icon:'🧠', color:'var(--purple)' },
  { title:'Industrial IoT Security',                   icon:'🔒', color:'var(--accent)' },
  { title:'3D Graphics & Avatar Animation',            icon:'🔮', color:'var(--accent)' },
  { title:'Blockchain, Web3 & Smart Contracts',        icon:'🪙', color:'var(--amber)' },
  { title:'Fullstack Generalist',                      icon:'💻', color:'var(--green)' },
];

interface Props {
  roadmapGenerated: boolean;
  roadmapModules: any[];
  completedQuests: string[];
  isGeneratingRoadmap: boolean;
  selectedTrajectory: string | null;
  onSelectTrajectory: (t: string) => void;
  onChooseTrajectory: (t: string) => void;
}

export default function DashboardTrajectoryMap({
  roadmapGenerated, roadmapModules, completedQuests,
  isGeneratingRoadmap, selectedTrajectory, onSelectTrajectory, onChooseTrajectory,
}: Props) {
  // Bug 6 Fix: Collapsed by default to reduce cognitive overload
  const [open, setOpen] = useState(false);

  return (
    <div id="trajectory-selector" style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:20, overflow:'hidden', boxShadow:'var(--shadow-sm)' }}>
      {/* Header — always visible, click to expand */}
      <div
        onClick={() => setOpen(o => !o)}
        style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'14px 20px', cursor:'pointer', borderBottom: open ? '1px solid var(--border)' : 'none', transition:'border 0.2s', userSelect:'none' }}
      >
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <span style={{ fontSize:16 }}>🗺️</span>
          <div>
            <div style={{ fontFamily:'var(--font-display)', fontSize:13.5, fontWeight:800, color:'var(--t1)' }}>SDE Trajectory Progress Map</div>
            <div style={{ fontSize:10.5, color:'var(--t3)', fontFamily:'var(--font-mono)', marginTop:1 }}>
              {roadmapGenerated ? '✅ Active Track — click to view progress' : 'Select a trajectory to unlock your quest roadmap'}
            </div>
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <span style={{ fontSize:10, fontFamily:'var(--font-mono)', color:'var(--t3)', background:'var(--bg3)', padding:'2px 8px', borderRadius:6, border:'1px solid var(--border)' }}>
            {roadmapGenerated ? 'Active' : 'Setup Required'}
          </span>
          <span style={{ fontSize:14, color:'var(--t3)', transition:'transform 0.3s ease', transform: open ? 'rotate(180deg)' : 'rotate(0deg)', display:'inline-block' }}>⌄</span>
        </div>
      </div>

      {/* Collapsible body */}
      <div style={{ maxHeight: open ? '1200px' : 0, overflow:'hidden', transition:'max-height 0.4s cubic-bezier(0.4,0,0.2,1)' }}>
        <div style={{ padding:20 }}>
          {roadmapGenerated && roadmapModules.length > 0 ? (
            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
              <p style={{ fontSize:12.5, color:'var(--t2)', margin:0, lineHeight:1.5 }}>Your dynamic roadmap was generated from your profile. Complete quests to clear modules.</p>
              <div style={{ display:'flex', flexDirection:'column', gap:16, maxHeight:300, overflowY:'auto', paddingRight:4 }}>
                {roadmapModules.map((module, mIdx) => {
                  const allQ = module.quests || [];
                  const done = allQ.filter((q: any) => completedQuests.includes(q.id)).length;
                  const isComplete = done === allQ.length && allQ.length > 0;
                  const isActive = !isComplete && (mIdx === 0 || (roadmapModules[mIdx-1]?.quests||[]).every((q:any) => completedQuests.includes(q.id)));
                  const nodeColor = isComplete ? 'var(--green)' : isActive ? 'var(--accent)' : 'var(--bg3)';
                  return (
                    <div key={module.id || mIdx} style={{ display:'flex', gap:14, paddingLeft:16, borderLeft:'1.5px dashed var(--border)', position:'relative', marginLeft:8 }}>
                      <div style={{ position:'absolute', left:-7, top:4, width:13, height:13, borderRadius:'50%', background:nodeColor, border:`2px solid ${isActive ? 'var(--accent-mid)' : 'var(--border)'}`, boxShadow: isActive ? '0 0 8px var(--accent)' : 'none', animation: isActive ? 'hud-pulse 2s infinite ease-in-out' : 'none' }} />
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:6, marginBottom:4 }}>
                          <div>
                            <h4 style={{ fontSize:13, fontWeight:800, color:'var(--t1)', margin:0 }}>{module.title}</h4>
                            <span style={{ fontSize:10, color:'var(--t3)', fontFamily:'var(--font-mono)' }}>{done}/{allQ.length} Quests</span>
                          </div>
                          <span style={{ fontSize:9.5, fontFamily:'var(--font-mono)', fontWeight:700, padding:'2px 8px', borderRadius:6, background: isComplete ? 'var(--green-light)' : isActive ? 'var(--accent-light)' : 'var(--bg3)', color: isComplete ? 'var(--green-mid)' : isActive ? 'var(--accent)' : 'var(--t3)' }}>
                            {isComplete ? '✓ Done' : isActive ? '⚡ Active' : '🔒 Locked'}
                          </span>
                        </div>
                        {isActive && (
                          <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginTop:2 }}>
                            {allQ.map((q: any) => {
                              const done2 = completedQuests.includes(q.id);
                              const catIcon = q.category === 'learning' ? '🎓' : q.category === 'exam' ? '📝' : '💻';
                              return (
                                <Link key={q.id} href={`/quests/${q.id}`} prefetch={false} style={{ textDecoration:'none' }}>
                                  <div style={{ display:'flex', alignItems:'center', gap:5, padding:'4px 10px', borderRadius:7, background: done2 ? 'rgba(5,150,105,0.08)' : 'var(--bg3)', border:`1px solid ${done2 ? 'rgba(5,150,105,0.2)' : 'var(--border)'}`, fontSize:11, fontWeight:600, color: done2 ? 'var(--green-mid)' : 'var(--t1)', cursor:'pointer', transition:'all 0.15s' }}>
                                    <span>{done2 ? '✓' : catIcon}</span><span>{q.title}</span>
                                  </div>
                                </Link>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : isGeneratingRoadmap ? (
            <div style={{ textAlign:'center', padding:'28px 20px', background:'var(--bg3)', borderRadius:14 }}>
              <div style={{ fontSize:28, marginBottom:10, display:'inline-block', animation:'spin 1.5s linear infinite' }}>🗺️</div>
              <div style={{ fontSize:12.5, fontWeight:700, color:'var(--t1)' }}>Generating AI Quest Roadmap…</div>
              <p style={{ fontSize:11, color:'var(--t3)', margin:'4px 0 0' }}>Fusing your strengths and trajectory gaps into a custom socratic quest path.</p>
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <div style={{ padding:'12px 16px', background:'rgba(220,38,38,0.04)', border:'1px solid rgba(220,38,38,0.1)', borderRadius:10, display:'flex', gap:10, alignItems:'center' }}>
                <span style={{ fontSize:20 }}>🔒</span>
                <div>
                  <div style={{ fontSize:12.5, fontWeight:700, color:'var(--t1)' }}>Roadmap Not Configured</div>
                  <p style={{ fontSize:11, color:'var(--t3)', margin:0 }}>Click a trajectory below to generate your custom quest path.</p>
                </div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(190px,1fr))', gap:10 }}>
                {TRACKS.map(track => (
                  <div
                    key={track.title}
                    onClick={() => onChooseTrajectory(track.title)}
                    onMouseEnter={() => onSelectTrajectory(track.title)}
                    style={{ background:'var(--bg3)', border:`1.5px solid ${selectedTrajectory === track.title ? track.color : 'var(--border)'}`, borderRadius:12, padding:14, cursor:'pointer', transition:'all 0.15s', boxShadow: selectedTrajectory === track.title ? `0 0 12px ${track.color}40` : 'none' }}
                  >
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                      <span style={{ fontSize:20 }}>{track.icon}</span>
                      {selectedTrajectory === track.title && <span style={{ width:6, height:6, borderRadius:'50%', background:track.color, boxShadow:`0 0 6px ${track.color}` }} />}
                    </div>
                    <div style={{ fontSize:12.5, fontWeight:800, color:'var(--t1)', marginBottom:8 }}>{track.title}</div>
                    <span style={{ fontSize:10.5, fontWeight:700, color:track.color, fontFamily:'var(--font-mono)' }}>Choose Path ➔</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
