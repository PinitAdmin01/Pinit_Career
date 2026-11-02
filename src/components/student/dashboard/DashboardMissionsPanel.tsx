'use client';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import ActivityFeed from '@/components/ui/ActivityFeed';
import { DailyMissionSlot, WorkloadBand } from '@/lib/pathway/competencySchema';
import { PathwayApiService } from '@/lib/api/pathwayApi';
import { useCareerOS } from '@/lib/context/CareerOSContext';
import { computePlacementReadiness } from '@/lib/pathway/placementPredictor';

interface NextStep {
  title: string;
  desc: string;
  href: string;
  icon: string;
  color: string;
}

interface Props {
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
  const cOS = useCareerOS();
  const [workloadBand, setWorkloadBand] = useState<WorkloadBand>('standard');
  const [coreMissions, setCoreMissions] = useState<DailyMissionSlot[]>([]);
  const [optionalMissions, setOptionalMissions] = useState<DailyMissionSlot[]>([]);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [rightTab, setRightTab] = useState<'placement' | 'activity'>('placement');

  const careerScore = cOS?.careerScore || 0;
  const verifiedCount = (cOS?.vaultItems || []).filter(v => v.verified).length;
  const completedQuestsCount = cOS?.completedQuests?.length || 0;

  const placementTiers = useMemo(() => {
    return computePlacementReadiness(careerScore, verifiedCount, completedQuestsCount);
  }, [careerScore, verifiedCount, completedQuestsCount]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const key = `pinit_${userId || 'anon'}_daily_missions_completed`;
    try {
      const saved = localStorage.getItem(key);
      const fromLocal: string[] = saved ? JSON.parse(saved) : [];
      const fromContext: string[] = cOS?.completedMissions || [];
      const merged = new Set([...fromLocal, ...fromContext]);
      setCompletedIds(merged);
    } catch {}
  }, [userId, cOS?.completedMissions]);

  useEffect(() => {
    let isMounted = true;
    async function loadMissions() {
      if (!userId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const data = await PathwayApiService.getDynamicDailyMissions(userId, workloadBand);
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

  function getMissionHref(m: DailyMissionSlot): string {
    if (m.sourceId && m.sourceId.startsWith('/')) return m.sourceId;
    switch (m.category) {
      case 'practice':
      case 'debug':
        return '/arena';
      case 'build':
        return '/projects';
      case 'career':
        return '/vault';
      case 'communication':
        return '/interview';
      case 'review':
        return '/exams';
      case 'learn':
      default:
        return '/quests';
    }
  }

  const toggleComplete = (id: string) => {
    const next = new Set(completedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setCompletedIds(next);

    if (typeof window !== 'undefined') {
      try {
        const arr = Array.from(next);
        localStorage.setItem(`pinit_${userId || 'anon'}_daily_missions_completed`, JSON.stringify(arr));
      } catch {}
    }
  };

  return (
    <div className="db-missions-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>

      {/* Col 1: Actionable Next Priority */}
      <div className="db-glass" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <span style={{ fontSize: 9.5, fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1.5px', display: 'block' }}>
            🚦 NEXT PRIORITY
          </span>
          <h3 style={{ fontSize: 16, fontWeight: 900, color: 'var(--t1)', margin: '4px 0 0', fontFamily: 'var(--font-display)' }}>
            Your Best Next Move
          </h3>
        </div>

        <Link href={nextStep.href} style={{ textDecoration: 'none', flex: 1, display: 'flex' }}>
          <div style={{
            padding: 18,
            borderRadius: 14,
            background: `${nextStep.color}12`,
            border: `1.5px solid ${nextStep.color}35`,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            width: '100%',
            transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            cursor: 'pointer'
          }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
              (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 24px ${nextStep.color}25`;
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
              (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 32 }}>{nextStep.icon}</span>
              <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', padding: '2px 8px', borderRadius: 6, background: `${nextStep.color}20`, color: nextStep.color, fontWeight: 800 }}>
                High ROI
              </span>
            </div>
            <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--t1)', lineHeight: 1.35 }}>
              {nextStep.title}
            </div>
            <div style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.5, flex: 1 }}>
              {nextStep.desc}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: `1px solid ${nextStep.color}25`, paddingTop: 10, marginTop: 4 }}>
              <span style={{ fontSize: 11.5, color: 'var(--t3)', fontFamily: 'var(--font-mono)' }}>Est. 15-20 mins</span>
              <span style={{ fontSize: 13, fontWeight: 800, color: nextStep.color, fontFamily: 'var(--font-mono)' }}>
                Take Action ➔
              </span>
            </div>
          </div>
        </Link>
      </div>

      {/* Col 2: Dynamic Daily Workload Missions */}
      <div className="db-glass" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', borderBottom: '1px solid var(--border)', flexWrap: 'wrap', gap: 8 }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 15.5, fontWeight: 900, color: 'var(--t1)', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
              Today&apos;s Workload Missions
            </h3>
            <span style={{ fontSize: 11, color: 'var(--t3)', fontFamily: 'var(--font-mono)' }}>
              {workloadBand === 'exam_pause' ? '1 Maintenance Task' : `${coreMissions.length} Core ${optionalMissions.length > 0 ? `+ ${optionalMissions.length} Optional` : ''}`}
            </span>
          </div>

          {/* Workload Band Switcher */}
          <div style={{ display: 'flex', background: 'var(--bg3)', borderRadius: 8, padding: 2, border: '1px solid var(--border)' }}>
            {(['standard', 'light', 'exam_pause'] as WorkloadBand[]).map(band => (
              <button
                key={band}
                onClick={() => setWorkloadBand(band)}
                style={{
                  padding: '4px 9px',
                  borderRadius: 6,
                  border: 'none',
                  background: workloadBand === band ? 'var(--accent)' : 'transparent',
                  color: workloadBand === band ? '#fff' : 'var(--t3)',
                  fontSize: 10.5,
                  fontWeight: 800,
                  cursor: 'pointer',
                  fontFamily: 'var(--font-mono)',
                  transition: 'all 0.15s ease',
                }}
              >
                {band === 'standard' ? 'Standard' : band === 'light' ? 'Light' : 'Exam ⏸'}
              </button>
            ))}
          </div>
        </div>

        <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
          {loading ? (
            <div style={{ padding: '30px 0', textAlign: 'center', color: 'var(--t3)', fontSize: 13, fontFamily: 'var(--font-mono)' }}>
              Calibrating today&apos;s curriculum missions...
            </div>
          ) : coreMissions.length === 0 ? (
            <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--t3)', fontSize: 13 }}>
              All daily missions completed! Great job.
            </div>
          ) : (
            coreMissions.map((m) => {
              const meta = CATEGORY_META[m.category] || { icon: '📘', color: '#3b82f6', label: 'TASK' };
              const done = completedIds.has(m.id);
              return (
                <div
                  key={m.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '10px 14px',
                    borderRadius: 12,
                    background: done ? 'rgba(16, 185, 129, 0.08)' : 'var(--bg3)',
                    border: `1px solid ${done ? '#10b98140' : 'var(--border)'}`,
                    transition: 'all 0.15s ease',
                  }}
                >
                  <button
                    onClick={() => toggleComplete(m.id)}
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 6,
                      border: `1.5px solid ${done ? '#10b981' : 'var(--border2)'}`,
                      background: done ? '#10b981' : 'transparent',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 12,
                      fontWeight: 800,
                      cursor: 'pointer',
                      flexShrink: 0
                    }}
                  >
                    {done ? '✓' : ''}
                  </button>
                  <span style={{ fontSize: 18 }}>{meta.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 9.5, fontFamily: 'var(--font-mono)', fontWeight: 800, color: meta.color, background: `${meta.color}15`, padding: '1px 5px', borderRadius: 4 }}>
                        {meta.label}
                      </span>
                      <span style={{ fontSize: 10.5, color: 'var(--t3)', fontFamily: 'var(--font-mono)' }}>{m.estDurationMinutes}m</span>
                      <span style={{ fontSize: 10.5, color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>+{m.xpReward} XP</span>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)', textDecoration: done ? 'line-through' : 'none', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {m.title}
                    </div>
                  </div>
                  <Link
                    href={getMissionHref(m)}
                    style={{
                      fontSize: 11,
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700,
                      color: meta.color,
                      textDecoration: 'none',
                      padding: '4px 8px',
                      borderRadius: 6,
                      background: `${meta.color}15`,
                      border: `1px solid ${meta.color}30`,
                      flexShrink: 0
                    }}
                  >
                    Start ➔
                  </Link>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Col 3: Tier 3 Placement Readiness & Salary Predictor (Replaced Empty Dead Space) */}
      <div className="db-glass" style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span className="db-label">💼 CAMPUS PLACEMENT BENCHMARK</span>
            <h3 style={{ fontSize: 15, fontWeight: 900, color: 'var(--t1)', margin: '2px 0 0', fontFamily: 'var(--font-display)' }}>
              Campus Placement Predictor
            </h3>
          </div>
          <div style={{ display: 'flex', background: 'var(--bg3)', borderRadius: 6, padding: 2, border: '1px solid var(--border)' }}>
            <button
              onClick={() => setRightTab('placement')}
              style={{
                fontSize: 10,
                padding: '3px 8px',
                borderRadius: 4,
                border: 'none',
                background: rightTab === 'placement' ? 'var(--accent)' : 'transparent',
                color: rightTab === 'placement' ? '#fff' : 'var(--t3)',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700
              }}
            >
              Drives
            </button>
            <button
              onClick={() => setRightTab('activity')}
              style={{
                fontSize: 10,
                padding: '3px 8px',
                borderRadius: 4,
                border: 'none',
                background: rightTab === 'activity' ? 'var(--accent)' : 'transparent',
                color: rightTab === 'activity' ? '#fff' : 'var(--t3)',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700
              }}
            >
              Activity
            </button>
          </div>
        </div>

        {rightTab === 'placement' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
            {placementTiers.map((tier, idx) => (
              <div
                key={idx}
                style={{
                  padding: '10px 12px',
                  borderRadius: 10,
                  background: 'var(--bg3)',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--t1)' }}>{tier.tierName}</span>
                    <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: tier.color, background: `${tier.color}15`, padding: '1px 5px', borderRadius: 4, fontWeight: 700 }}>
                      {tier.targetCtc}
                    </span>
                  </div>
                  <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', fontWeight: 800, color: tier.color }}>
                    {tier.readinessPct}%
                  </span>
                </div>

                {/* Progress Bar */}
                <div style={{ height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${tier.readinessPct}%`, background: tier.color, borderRadius: 2, transition: 'width 0.8s ease' }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 10.5, color: 'var(--t3)', fontFamily: 'var(--font-mono)' }}>
                  <span>{tier.companies.slice(0, 3).join(', ')}</span>
                  <span style={{ color: tier.readinessPct >= 75 ? '#10b981' : 'var(--t3)', fontWeight: 600 }}>{tier.status}</span>
                </div>
              </div>
            ))}

            <Link
              href="/interview"
              style={{
                marginTop: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                padding: '8px',
                borderRadius: 8,
                background: 'rgba(99,102,241,0.12)',
                border: '1px solid rgba(99,102,241,0.25)',
                color: 'var(--accent)',
                textDecoration: 'none',
                fontSize: 12,
                fontWeight: 800,
                fontFamily: 'var(--font-mono)'
              }}
            >
              Practice AI Campus Mock Drive ➔
            </Link>
          </div>
        ) : (
          <div style={{ flex: 1, minHeight: 200 }}>
            <ActivityFeed userId={userId} />
          </div>
        )}
      </div>

    </div>
  );
}
