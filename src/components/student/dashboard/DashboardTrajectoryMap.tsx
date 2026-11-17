'use client';
import { useState } from 'react';
import Link from 'next/link';

const TRACKS = [
  { title:'Java Backend Architect',                    code:'JAVA', color:'var(--accent)' },
  { title:'Frontend React Engineer',                   code:'REACT', color:'var(--teal)' },
  { title:'UI/UX Design Systems & Visual Frontend',    code:'DESIGN', color:'var(--amber)' },
  { title:'Data Structures & Algorithmic Optimizations',code:'DSA', color:'var(--blue)' },
  { title:'Mobile Application Development',            code:'MOBILE', color:'var(--purple)' },
  { title:'Cybersecurity Specialist & Secure Systems', code:'SEC', color:'var(--accent)' },
  { title:'Database Engineering & Query Performance',  code:'DATA', color:'var(--teal)' },
  { title:'High-Scale Distributed System Design',      code:'DISTRIB', color:'var(--blue)' },
  { title:'Cloud Native AWS Architect',                code:'CLOUD', color:'var(--amber)' },
  { title:'DevOps & CI/CD Automation Specialist',      code:'DEVOPS', color:'var(--green)' },
  { title:'AI Software Engineer',                      code:'AI', color:'var(--purple)' },
  { title:'IoT, Firmware & Embedded Systems',          code:'EMBED', color:'var(--teal)' },
  { title:'IoT Wireless Networks',                     code:'MESH', color:'var(--blue)' },
  { title:'Edge AI & TinyML',                          code:'TINYML', color:'var(--purple)' },
  { title:'Industrial IoT Security',                   code:'IIOT', color:'var(--accent)' },
  { title:'3D Graphics & Avatar Animation',            code:'3D', color:'var(--accent)' },
  { title:'Fullstack Generalist',                      code:'FULL', color:'var(--green)' },
  { title:'Digital Accountant & Taxation Specialist',  code:'ACC', color:'var(--green)' },
  { title:'Financial Analyst & Investment Specialist', code:'FIN', color:'var(--blue)' },
  { title:'Business Analytics & Decision Intelligence Specialist', code:'ANALYTICS', color:'var(--purple)' },
  { title:'Marketing & Brand Manager',                 code:'BRAND', color:'var(--amber)' },
  { title:'Digital Marketing & Growth Strategist',     code:'DMKT', color:'var(--teal)' },
  { title:'E-Commerce & Digital Business Specialist',  code:'ECOM', color:'var(--accent)' },
  { title:'Entrepreneur & Business Manager',           code:'VENTURE', color:'var(--amber)' },
  { title:'Sales, Customer Success & CRM Specialist',  code:'CRM', color:'var(--green)' },
  { title:'Operations, Supply Chain & Compliance Specialist', code:'OPS', color:'var(--blue)' },
  { title:'AI & Digital Transformation Business Specialist', code:'AI-BIZ', color:'var(--purple)' },
  { title:'Management Consultant & Business Strategist', code:'CONSULT', color:'var(--amber)' },
  { title:'Product Manager (Tech & Business Strategy)', code:'PROD', color:'var(--teal)' },
  { title:'Human Resources & People Operations Specialist', code:'HR', color:'var(--purple)' },
  { title:'Scientific & Quantitative Research Specialist', code:'RESEARCH', color:'var(--purple)' },
  { title:'Public Policy, Compliance & Legal Specialist', code:'LEGAL', color:'var(--blue)' },
  { title:'Education & Learning Technology Specialist', code:'EDTECH', color:'var(--teal)' },
  { title:'Healthcare & Clinical Operations Analyst',   code:'HEALTH', color:'var(--green)' },
  { title:'Digital Media & Communications Specialist', code:'MEDIA', color:'var(--amber)' },
  { title:'Core Systems & Hardware Engineer',          code:'HW', color:'var(--amber)' },
  { title:'Creative & Digital Arts Specialist',        code:'ARTS', color:'var(--accent)' },
  { title:'Social Impact & Non-Profit Program Manager', code:'IMPACT', color:'var(--teal)' },
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
  const [open, setOpen] = useState(false);

  return (
    <div id="trajectory-selector" className="db-glass" style={{ background:'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, var(--dash-card) 100%)', border:'1.5px solid rgba(99, 102, 241, 0.22)', borderRadius:16, overflow:'hidden', boxShadow:'0 8px 30px -4px rgba(99, 102, 241, 0.16)' }}>
      {/* Header — always visible, click to expand */}
      <div
        role="button"
        tabIndex={0}
        aria-expanded={open}
        aria-controls="trajectory-body"
        aria-label="Toggle SDE Trajectory Progress Map"
        onClick={() => setOpen(o => !o)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setOpen(o => !o);
          }
        }}
        style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'14px 20px', cursor:'pointer', borderBottom: open ? '1px solid var(--border)' : 'none', transition:'border 0.2s', userSelect:'none' }}
      >
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          {/* SVG Map Icon (No Emojis) */}
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(99, 102, 241, 0.12)', border: '1px solid rgba(99, 102, 241, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
              <line x1="8" y1="2" x2="8" y2="18"/>
              <line x1="16" y1="6" x2="16" y2="22"/>
            </svg>
          </div>
          <div>
            <div style={{ fontFamily:'var(--font-display)', fontSize:15, fontWeight:800, color:'var(--t1)' }}>SDE Trajectory Progress Map</div>
            <div style={{ fontSize:11.5, color:'var(--t3)', fontFamily:'var(--font-mono)', marginTop:1 }}>
              {roadmapGenerated ? 'Active Track — click to view progress' : 'Select a trajectory to unlock your quest roadmap'}
            </div>
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <span style={{ fontSize:11, fontFamily:'var(--font-mono)', color:'var(--t3)', background:'var(--bg3)', padding:'2px 8px', borderRadius:6, border:'1px solid var(--border)' }}>
            {roadmapGenerated ? 'Active' : 'Setup Required'}
          </span>
          <span style={{ fontSize:15.5, color:'var(--t3)', transition:'transform 0.3s ease', transform: open ? 'rotate(180deg)' : 'rotate(0deg)', display:'inline-block' }}>⌄</span>
        </div>
      </div>

      {/* Collapsible body */}
      <div id="trajectory-body" style={{ maxHeight: open ? '1200px' : 0, overflow:'hidden', transition:'max-height 0.4s cubic-bezier(0.4,0,0.2,1)' }}>
        <div style={{ padding:20 }}>
          {roadmapGenerated && roadmapModules.length > 0 ? (
            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
              <p style={{ fontSize:14, color:'var(--t2)', margin:0, lineHeight:1.5 }}>Your dynamic roadmap was generated from your profile. Complete quests to clear modules.</p>
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
                            <h4 style={{ fontSize:14.5, fontWeight:800, color:'var(--t1)', margin:0 }}>{module.title}</h4>
                            <span style={{ fontSize:11, color:'var(--t3)', fontFamily:'var(--font-mono)' }}>{done}/{allQ.length} Quests</span>
                          </div>
                          <span style={{ fontSize:10.5, fontFamily:'var(--font-mono)', fontWeight:700, padding:'2px 8px', borderRadius:6, background: isComplete ? 'var(--green-light)' : isActive ? 'var(--accent-light)' : 'var(--bg3)', color: isComplete ? 'var(--green-mid)' : isActive ? 'var(--accent)' : 'var(--t3)' }}>
                            {isComplete ? 'Done' : isActive ? 'Active' : 'Locked'}
                          </span>
                        </div>
                        {isActive && (
                          <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginTop:2 }}>
                            {allQ.map((q: any) => {
                              const done2 = completedQuests.includes(q.id);
                              return (
                                <Link key={q.id} href={`/quests/lesson?questId=${q.id}`} prefetch={false} style={{ textDecoration:'none' }}>
                                  <div style={{ display:'flex', alignItems:'center', gap:5, padding:'4px 10px', borderRadius:7, background: done2 ? 'rgba(5,150,105,0.08)' : 'var(--bg3)', border:`1px solid ${done2 ? 'rgba(5,150,105,0.2)' : 'var(--border)'}`, fontSize:12, fontWeight:600, color: done2 ? 'var(--green-mid)' : 'var(--t1)', cursor:'pointer', transition:'all 0.15s' }}>
                                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: done2 ? 'var(--green-mid)' : 'var(--accent)' }} />
                                    <span>{q.title}</span>
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
              <div style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid var(--accent)', borderTopColor: 'transparent', animation:'spin 1s linear infinite', margin: '0 auto 10px' }} />
              <div style={{ fontSize:14, fontWeight:700, color:'var(--t1)' }}>Generating AI Quest Roadmap…</div>
              <p style={{ fontSize:12, color:'var(--t3)', margin:'4px 0 0' }}>Fusing your strengths and trajectory gaps into a custom socratic quest path.</p>
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <div style={{ padding:'12px 16px', background:'rgba(220,38,38,0.04)', border:'1px solid rgba(220,38,38,0.1)', borderRadius:10, display:'flex', gap:10, alignItems:'center' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--coral-mid, #f87171)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <div>
                  <div style={{ fontSize:14, fontWeight:700, color:'var(--t1)' }}>Roadmap Not Configured</div>
                  <p style={{ fontSize:12, color:'var(--t3)', margin:0 }}>Click a trajectory below to generate your custom quest path.</p>
                </div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(190px,1fr))', gap:10 }}>
                {TRACKS.map(track => (
                  <div
                    key={track.title}
                    role="button"
                    tabIndex={0}
                    aria-label={`Select ${track.title} trajectory`}
                    onClick={() => onChooseTrajectory(track.title)}
                    onMouseEnter={() => onSelectTrajectory(track.title)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onChooseTrajectory(track.title);
                      }
                    }}
                    style={{ background:'var(--bg3)', border:`1.5px solid ${selectedTrajectory === track.title ? track.color : 'var(--border)'}`, borderRadius:12, padding:14, cursor:'pointer', transition:'all 0.15s', boxShadow: selectedTrajectory === track.title ? `0 0 12px ${track.color}40` : 'none', outline: 'none' }}
                  >
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems: 'center', marginBottom:8 }}>
                      <span style={{ fontSize:10, fontWeight: 900, fontFamily: 'var(--font-mono)', padding: '2px 6px', borderRadius: 4, background: `${track.color}18`, color: track.color, border: `1px solid ${track.color}33` }}>
                        {track.code}
                      </span>
                      {selectedTrajectory === track.title && <span style={{ width:6, height:6, borderRadius:'50%', background:track.color, boxShadow:`0 0 6px ${track.color}` }} />}
                    </div>
                    <div style={{ fontSize:13.5, fontWeight:800, color:'var(--t1)', marginBottom:8, lineHeight: 1.3 }}>{track.title}</div>
                    <span style={{ fontSize:11.5, fontWeight:700, color:track.color, fontFamily: 'var(--font-mono)' }}>Choose Path →</span>
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
