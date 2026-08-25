'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import ActivityFeed from '@/components/ui/ActivityFeed';
import { DailyMissionSlot, WorkloadBand } from '@/lib/pathway/competencySchema';
import { PathwayApiService } from '@/lib/api/pathwayApi';

interface NextStep {
  title: string;
  desc: string;
  href: string;
  icon: string;
  color: string;
}

interface Props {
  pendingMissions?: any[];
  nextStep: NextStep;
  userId?: string;
}

const CATEGORY_META: Record<string, { icon: string; color: string; label: string }> = {
  learn: { icon: '📘', color: '#3b82f6', label: 'LEARN' },
  practice: { icon: '✍️', color: '#8b5cf6', label: 'PRACTICE' },
  build: { icon: '🔨', color: '#10b981', label: 'BUILD' },
  debug: { icon: '🐛', color: '#ef4444', label: 'DEBUG' },
  career: { icon: '💼', color: '#f59e0b', label: 'CAREER' },
  communication: { icon: '🗣️', color: '#06b6d4', label: 'SPEAK' },
  review: { icon: '🔄', color: '#6366f1', label: 'REVIEW' },
};

export default function DashboardMissionsPanel({ nextStep, userId }: Props) {
  const [workloadBand, setWorkloadBand] = useState<WorkloadBand>('standard');
  const [coreMissions, setCoreMissions] = useState<DailyMissionSlot[]>([]);
  const [optionalMissions, setOptionalMissions] = useState<DailyMissionSlot[]>([]);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadMissions() {
      setLoading(true);
      try {
        const data = await PathwayApiService.getDynamicDailyMissions(userId || 'guest_student', workloadBand);
        if (isMounted) {
          setCoreMissions(data.coreMissions);
          setOptionalMissions(data.optionalMissions);
        }
      } catch (err) {
        console.warn('Failed to fetch dynamic missions:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadMissions();
    return () => { isMounted = false; };
  }, [userId, workloadBand]);

  const toggleComplete = (id: string) => {
    setCompletedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div style={{ display:'grid', gridTemplateColumns:'minmax(0,1fr) minmax(0,1.8fr) minmax(0,1fr)', gap:16 }}>

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

      {/* Col 2: Dynamic Daily Missions (3 Core + 0-2 Optional) */}
      <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:20, overflow:'hidden', boxShadow:'var(--shadow-sm)' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 18px', borderBottom:'1px solid var(--border)', flexWrap:'wrap', gap:8 }}>
          <div>
            <h3 style={{ fontFamily:'var(--font-display)', fontSize:14, fontWeight:800, color:'var(--t1)', margin:0, display:'flex', alignItems:'center', gap:8 }}>
              ⚡ Today&apos;s Workload Missions
            </h3>
            <span style={{ fontSize:10.5, color:'var(--t3)', fontFamily:'var(--font-mono)' }}>
              {workloadBand === 'exam_pause' ? '1 Maintenance Task' : `${coreMissions.length} Core ${optionalMissions.length > 0 ? `+ ${optionalMissions.length} Optional` : ''}`}
            </span>
          </div>

          {/* Workload Band Mode Switcher */}
          <div style={{ display:'flex', background:'var(--bg3)', borderRadius:8, padding:2, border:'1px solid var(--border)' }}>
            {(['standard', 'light', 'exam_pause'] as WorkloadBand[]).map(band => (
              <button
                key={band}
                onClick={() => setWorkloadBand(band)}
                style={{
                  padding:'3px 8px',
                  fontSize:10,
                  fontFamily:'var(--font-mono)',
                  fontWeight: workloadBand === band ? 800 : 500,
                  color: workloadBand === band ? '#fff' : 'var(--t3)',
                  background: workloadBand === band ? 'var(--accent)' : 'transparent',
                  border:'none',
                  borderRadius:6,
                  cursor:'pointer',
                  transition:'all 0.15s ease',
                  textTransform:'capitalize',
                }}
              >
                {band === 'exam_pause' ? 'Exam ⏸️' : band}
              </button>
            ))}
          </div>
        </div>

        <div style={{ padding:14, display:'flex', flexDirection:'column', gap:10 }}>
          {loading ? (
            <div style={{ textAlign:'center', padding:20, color:'var(--t3)', fontSize:12 }}>Loading dynamic workload...</div>
          ) : (
            <>
              {/* 3 Core Slots */}
              {coreMissions.map((m) => {
                const meta = CATEGORY_META[m.category] || { icon: '⚡', color: '#6366f1', label: 'CORE' };
                const done = completedIds.has(m.id);
                return (
                  <div
                    key={m.id}
                    style={{
                      display:'flex',
                      alignItems:'center',
                      gap:12,
                      padding:'10px 14px',
                      borderRadius:12,
                      background: done ? 'rgba(16, 185, 129, 0.08)' : 'var(--bg3)',
                      border: `1px solid ${done ? '#10b98140' : 'var(--border)'}`,
                      transition:'all 0.15s ease',
                    }}
                  >
                    <button
                      onClick={() => toggleComplete(m.id)}
                      style={{
                        width:24,
                        height:24,
                        borderRadius:6,
                        border: `1.5px solid ${done ? '#10b981' : 'var(--border2)'}`,
                        background: done ? '#10b981' : 'transparent',
                        color:'#fff',
                        display:'flex',
                        alignItems:'center',
                        justifyContent:'center',
                        fontSize:12,
                        fontWeight:800,
                        cursor:'pointer',
                      }}
                    >
                      {done ? '✓' : ''}
                    </button>
                    <span style={{ fontSize:18 }}>{meta.icon}</span>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                        <span style={{ fontSize:9, fontFamily:'var(--font-mono)', fontWeight:800, color: meta.color, background:`${meta.color}15`, padding:'1px 5px', borderRadius:4 }}>
                          {meta.label}
                        </span>
                        <span style={{ fontSize:10, color:'var(--t3)', fontFamily:'var(--font-mono)' }}>⏱️ {m.estDurationMinutes}m</span>
                        <span style={{ fontSize:10, color:'var(--accent)', fontFamily:'var(--font-mono)', fontWeight:700 }}>+{m.xpReward} XP</span>
                      </div>
                      <div style={{ fontSize:12.5, fontWeight:700, color:'var(--t1)', textDecoration: done ? 'line-through' : 'none', marginTop:2 }}>
                        {m.title}
                      </div>
                    </div>
                    <Link
                      href="/quests"
                      style={{
                        fontSize:10.5,
                        fontFamily:'var(--font-mono)',
                        fontWeight:700,
                        color: meta.color,
                        textDecoration:'none',
                        padding:'4px 8px',
                        borderRadius:6,
                        background:`${meta.color}15`,
                        border:`1px solid ${meta.color}30`,
                      }}
                    >
                      Start ➔
                    </Link>
                  </div>
                );
              })}

              {/* Optional Missions Section (if present) */}
              {optionalMissions.length > 0 && (
                <div style={{ marginTop:6, borderTop:'1px dashed var(--border)', paddingTop:8 }}>
                  <div style={{ fontSize:9.5, fontFamily:'var(--font-mono)', color:'var(--t3)', fontWeight:700, marginBottom:6, textTransform:'uppercase' }}>
                    💡 Optional Habit Boosters (No Penalty)
                  </div>
                  <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                    {optionalMissions.map((m) => {
                      const meta = CATEGORY_META[m.category] || { icon: '✨', color: '#f59e0b', label: 'OPTIONAL' };
                      const done = completedIds.has(m.id);
                      return (
                        <div
                          key={m.id}
                          style={{
                            display:'flex',
                            alignItems:'center',
                            gap:10,
                            padding:'8px 12px',
                            borderRadius:10,
                            background: done ? 'rgba(16, 185, 129, 0.05)' : 'rgba(255,255,255,0.02)',
                            border: `1px solid ${done ? '#10b98130' : 'var(--border)'}`,
                            opacity: done ? 0.6 : 0.9,
                          }}
                        >
                          <button
                            onClick={() => toggleComplete(m.id)}
                            style={{
                              width:20,
                              height:20,
                              borderRadius:5,
                              border: `1.5px solid ${done ? '#10b981' : 'var(--border2)'}`,
                              background: done ? '#10b981' : 'transparent',
                              color:'#fff',
                              display:'flex',
                              alignItems:'center',
                              justifyContent:'center',
                              fontSize:10,
                              cursor:'pointer',
                            }}
                          >
                            {done ? '✓' : ''}
                          </button>
                          <span style={{ fontSize:15 }}>{meta.icon}</span>
                          <div style={{ flex:1, minWidth:0 }}>
                            <div style={{ fontSize:11.5, fontWeight:600, color:'var(--t1)', textDecoration: done ? 'line-through' : 'none' }}>
                              {m.title}
                            </div>
                          </div>
                          <span style={{ fontSize:9.5, color:'var(--accent)', fontFamily:'var(--font-mono)' }}>+{m.xpReward} XP</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
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

