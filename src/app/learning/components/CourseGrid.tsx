'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { card, cardLabel } from './constants';
import { Quest } from '../hooks/useLearningData';
import { CategorizedGap } from '@/lib/learning/learningTwinIntelligence';
import { toast } from '@/lib/store/useAppStore';

interface CourseGridProps {
  activeTab: 'gaps' | 'twin';
  missingSkills: Array<{ name: string; rawName?: string; reason: string; severity: 'High' | 'Medium'; category?: string }>;
  baseMissingSkills: string[];
  categorizedGaps?: CategorizedGap[];
  quests: Quest[];
  cOS: any;
}

export function CourseGrid({
  activeTab,
  missingSkills,
  baseMissingSkills,
  categorizedGaps = [],
  quests,
  cOS,
}: CourseGridProps) {
  // State for inline quick checks: { [gapId]: { selected: number; verified?: boolean } }
  const [quickChecks, setQuickChecks] = useState<Record<string, { selected: number; verified?: boolean }>>({});
  // Active tier filter: 'all' | 'blocker' | 'differentiator' | 'specialization'
  const [tierFilter, setTierFilter] = useState<string>('all');
  // Expanded quick-check panel: { [gapId]: boolean }
  const [expandedCheck, setExpandedCheck] = useState<Record<string, boolean>>({});

  if (activeTab === 'gaps') {
    const filteredGaps = categorizedGaps.filter(g => {
      if (tierFilter === 'all') return true;
      if (tierFilter === 'blocker') return g.tier === 'Critical Blocker';
      if (tierFilter === 'differentiator') return g.tier === 'Competitive Differentiator';
      if (tierFilter === 'specialization') return g.tier === 'Enterprise Specialization';
      return true;
    });

    const handleAnswerQuickCheck = (gap: CategorizedGap, optionIdx: number) => {
      const isCorrect = optionIdx === gap.quickCheck.correctIndex;
      setQuickChecks(prev => ({
        ...prev,
        [gap.id]: { selected: optionIdx, verified: isCorrect }
      }));

      if (isCorrect) {
        toast.success('Competency Verified! (+20 XP)', `You demonstrated solid command of ${gap.name}.`);
        if (cOS && typeof cOS.addXp === 'function') {
          cOS.addXp(20, `Verified Competency: ${gap.name}`);
        }
      } else {
        toast.error('Review Recommended', gap.quickCheck.explanation);
      }
    };

    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1.25fr 1fr', gap: 20, alignItems: 'start' }}>
        {/* Left Column: Categorized Gaps & Interactive Quick Verification */}
        <div style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div style={cardLabel}>🧬 Career DNA Competency Gaps Feed</div>
            <span style={{ fontSize: 11, fontWeight: 800, background: 'var(--coral-light)', color: 'var(--coral)', padding: '2px 8px', borderRadius: 8 }}>
              {filteredGaps.length} Target Gaps
            </span>
          </div>

          <p style={{ fontSize: 13, color: 'var(--t2)', marginBottom: 14 }}>
            Dynamic assessments comparing your Career DNA proofs against current verified recruiter benchmarks:
          </p>

          {/* Tier Filter Buttons */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
            {[
              { id: 'all', label: 'All Gaps' },
              { id: 'blocker', label: '🚨 Critical Blockers' },
              { id: 'differentiator', label: '⚡ Differentiators' },
              { id: 'specialization', label: '💎 Specializations' }
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setTierFilter(t.id)}
                style={{
                  padding: '4px 10px',
                  borderRadius: 6,
                  border: `1px solid ${tierFilter === t.id ? 'var(--accent)' : 'var(--border)'}`,
                  background: tierFilter === t.id ? 'var(--accent)' : 'var(--bg3)',
                  color: tierFilter === t.id ? '#fff' : 'var(--t2)',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {filteredGaps.length === 0 ? (
              <div style={{ padding: 18, textAlign: 'center', color: 'var(--t3)', fontSize: 13, background: 'var(--bg3)', borderRadius: 10, border: '1px dashed var(--border)' }}>
                ✓ No critical skill gaps identified in this tier. All assessed competencies in good standing!
              </div>
            ) : (
              filteredGaps.map(gap => {
                const checkState = quickChecks[gap.id];
                const isOpen = expandedCheck[gap.id];

                return (
                  <div
                    key={gap.id}
                    style={{
                      background: 'var(--bg3)',
                      border: '1.5px solid var(--border)',
                      borderRadius: 12,
                      padding: 14
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <span style={{ fontSize: 14.5, fontWeight: 800, color: 'var(--t1)' }}>{gap.name}</span>
                      <span
                        style={{
                          fontSize: 10.5,
                          fontWeight: 800,
                          background:
                            gap.tier === 'Critical Blocker'
                              ? 'var(--coral-light)'
                              : gap.tier === 'Competitive Differentiator'
                                ? 'var(--amber-light)'
                                : 'var(--accent-light)',
                          color:
                            gap.tier === 'Critical Blocker'
                              ? 'var(--coral)'
                              : gap.tier === 'Competitive Differentiator'
                                ? 'var(--amber)'
                                : 'var(--accent)',
                          padding: '2px 8px',
                          borderRadius: 6
                        }}
                      >
                        {gap.tier}
                      </span>
                    </div>

                    <p style={{ fontSize: 12.5, color: 'var(--t2)', margin: '0 0 8px 0', lineHeight: 1.4 }}>
                      {gap.description}
                    </p>

                    <div
                      style={{
                        fontSize: 11.5,
                        fontWeight: 600,
                        color: gap.tier === 'Critical Blocker' ? 'var(--coral)' : 'var(--accent)',
                        background: 'var(--bg2)',
                        padding: '6px 10px',
                        borderRadius: 6,
                        border: '1px solid var(--border)',
                        marginBottom: 10
                      }}
                    >
                      {gap.impactOnPlacement}
                    </div>

                    {/* Interactive Competency Check Box */}
                    {isOpen && (
                      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 8, padding: 12, marginBottom: 10 }}>
                        <div style={{ fontSize: 11.5, fontWeight: 800, color: 'var(--accent)', marginBottom: 4 }}>
                          🧪 Rapid Competency Verification
                        </div>
                        <p style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--t1)', margin: '0 0 8px 0' }}>
                          {gap.quickCheck.question}
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          {gap.quickCheck.options.map((opt, i) => {
                            const isSelected = checkState?.selected === i;
                            const isAnswered = checkState !== undefined;
                            const isRight = i === gap.quickCheck.correctIndex;

                            let optBg = 'var(--bg3)';
                            let optBorder = 'var(--border)';
                            if (isAnswered && isRight) {
                              optBg = 'var(--green-light)';
                              optBorder = 'var(--green)';
                            } else if (isAnswered && isSelected && !isRight) {
                              optBg = 'var(--coral-light)';
                              optBorder = 'var(--coral)';
                            }

                            return (
                              <button
                                key={i}
                                onClick={() => handleAnswerQuickCheck(gap, i)}
                                style={{
                                  padding: '6px 10px',
                                  borderRadius: 6,
                                  background: optBg,
                                  border: `1px solid ${optBorder}`,
                                  textAlign: 'left',
                                  fontSize: 12,
                                  color: 'var(--t1)',
                                  cursor: 'pointer'
                                }}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                        {checkState?.verified && (
                          <div style={{ marginTop: 8, fontSize: 11.5, color: 'var(--green)', fontWeight: 700 }}>
                            ✓ Verified! {gap.quickCheck.explanation}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Action Bar */}
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <Link
                        href={`/quests?q=${encodeURIComponent(gap.name)}`}
                        style={{
                          padding: '6px 12px',
                          fontSize: 12,
                          fontWeight: 800,
                          background: 'var(--accent)',
                          color: '#fff',
                          borderRadius: 6,
                          textDecoration: 'none'
                        }}
                      >
                        🎯 Bridge in Quests →
                      </Link>
                      <button
                        onClick={() => setExpandedCheck(prev => ({ ...prev, [gap.id]: !prev[gap.id] }))}
                        style={{
                          padding: '6px 12px',
                          fontSize: 12,
                          fontWeight: 700,
                          background: 'var(--bg2)',
                          border: '1px solid var(--border)',
                          borderRadius: 6,
                          color: 'var(--t2)',
                          cursor: 'pointer'
                        }}
                      >
                        {isOpen ? 'Close Check' : '🧪 Test Competency'}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Real-Time JD Placement Gap Matrix */}
        <div style={card}>
          <div style={cardLabel}>Real Time JD Gap Analysis</div>
          <p style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.5, marginBottom: 14 }}>
            Aggregated from 120+ active Tier-1 Job Descriptions in your chosen track:
          </p>

          <div style={{ background: 'var(--bg3)', borderRadius: 12, padding: 16, marginBottom: 16 }}>
            <div style={{ color: 'var(--coral)', fontWeight: 800, fontSize: 13, marginBottom: 8 }}>
              ⚠️ Urgent Core Requirements (Screening Disqualifiers)
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {baseMissingSkills.map(skill => (
                <span
                  key={skill}
                  style={{
                    fontSize: 12,
                    padding: '4px 10px',
                    borderRadius: 20,
                    background: 'var(--coral-light)',
                    color: 'var(--coral)',
                    border: '1px solid rgba(220,38,38,0.2)',
                    fontWeight: 700
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Strategic Gap Bridge Plan */}
          <div style={{ background: 'linear-gradient(135deg, rgba(79,70,229,0.06), rgba(16,185,129,0.06))', border: '1px solid var(--border)', borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', marginBottom: 4 }}>
              💡 Strategic Bridge Recommendation
            </div>
            <p style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.5, margin: 0 }}>
              Closing the top 2 Critical Blockers via Quests raises your portfolio match score from <strong>68% to 88%</strong> and guarantees invitation to live technical screening rounds.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Active Career Quests Grid (used at the bottom of Career Twin tab)
  return (
    <div style={{ marginTop: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <span style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', color: 'var(--t3)', fontFamily: 'var(--font-mono)' }}>
          🏆 Active Career Quests (Twin Advancement Track)
        </span>
        <span style={{ fontSize: 12, color: 'var(--t3)' }}>Complete stages to unlock Twin CTC brackets</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
        {quests.map(quest => {
          const stageResults = quest.stages.map((s, i) => ({
            ...s,
            index: i + 1,
            completed: s.isComplete(cOS),
          }));
          const completedCount = stageResults.filter(s => s.completed).length;
          const pct = Math.round((completedCount / quest.stages.length) * 100);
          const currentStageIdx = stageResults.findIndex(s => !s.completed);

          return (
            <div key={quest.id} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 20, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ background: `linear-gradient(135deg, ${quest.color}14, var(--bg3))`, borderBottom: '1px solid var(--border)', padding: '16px 18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: `${quest.color}22`, border: `1px solid ${quest.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17.5 }}>
                    {quest.icon}
                  </div>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--t1)', margin: 0 }}>{quest.title}</h3>
                    <span style={{ fontSize: 11.5, color: 'var(--t3)' }}>{quest.subtitle}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ flex: 1, height: 5, background: 'var(--bg2)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: quest.color }} />
                  </div>
                  <span style={{ fontSize: 11, color: quest.color, fontWeight: 700 }}>{completedCount}/{quest.stages.length} Stgs</span>
                </div>
              </div>

              <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
                {stageResults.map((s) => (
                  <div key={s.index} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px', borderRadius: 6, background: s.completed ? 'var(--bg3)' : s.index === currentStageIdx + 1 ? `${quest.color}0d` : 'transparent' }}>
                    <span style={{ fontSize: 13 }}>{s.icon}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12.5, fontWeight: s.index === currentStageIdx + 1 ? 700 : 500, color: s.completed ? 'var(--t3)' : 'var(--t1)' }}>
                        Stg {s.index}: {s.title}
                      </div>
                    </div>
                    {s.completed ? (
                      <span style={{ fontSize: 10.5, color: 'var(--green)', fontWeight: 700 }}>✓ Done</span>
                    ) : s.index === currentStageIdx + 1 ? (
                      <Link href={s.href} style={{ fontSize: 11, color: quest.color, textDecoration: 'none', padding: '3px 8px', background: `${quest.color}18`, borderRadius: 4, fontWeight: 700 }}>
                        Start ➔
                      </Link>
                    ) : (
                      <span style={{ fontSize: 11, color: 'var(--t4)' }}>🔒 Locked</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
