'use client';

import React from 'react';
import Link from 'next/link';
import { card, cardLabel } from './constants';
import { Quest } from '../hooks/useLearningData';

interface CourseGridProps {
  activeTab: 'gaps' | 'twin';
  missingSkills: Array<{ name: string; reason: string; severity: 'High' | 'Medium' }>;
  baseMissingSkills: string[];
  quests: Quest[];
  cOS: any;
}

export function CourseGrid({
  activeTab,
  missingSkills,
  baseMissingSkills,
  quests,
  cOS,
}: CourseGridProps) {
  if (activeTab === 'gaps') {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: 20, alignItems: 'start' }}>
        <div style={card}>
          <div style={cardLabel}>🧬 Career DNA Gaps Feed</div>
          <p style={{ fontSize: 11.5, color: 'var(--t3)', marginBottom: 12 }}>
            Dynamic assessments have identified the following missing skills in your portfolio matches:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {missingSkills.map(skill => (
              <div key={skill.name} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: 12 }}>
                <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 700 }}>{skill.name}</span>
                  <span style={{
                    fontSize: 9.5, fontWeight: 800,
                    background: skill.severity === 'High' ? 'var(--coral-light)' : 'var(--amber-light)',
                    color: skill.severity === 'High' ? 'var(--coral)' : 'var(--amber)',
                    padding: '2px 6px', borderRadius: 4
                  }}>{skill.severity} Priority</span>
                </div>
                <p style={{ fontSize: 11.5, color: 'var(--t3)', margin: 0 }}>{skill.reason}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={card}>
          <div style={cardLabel}>Real Time JD Gap Analysis</div>
          <div style={{ background: 'var(--bg3)', borderRadius: 14, padding: 16, marginBottom: 16 }}>
            <div style={{ color: 'var(--coral)', fontWeight: 700, fontSize: 12, marginBottom: 8 }}>⚠️ Urgent Missing Skills (Close these first)</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {baseMissingSkills.map(skill => (
                <span key={skill} style={{ fontSize: 11, padding: '4px 10px', borderRadius: 20, background: 'var(--coral-light)', color: 'var(--coral)', border: '1px solid rgba(220,38,38,0.15)', fontWeight: 600 }}>{skill}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Active Career Quests Grid (used in Career Twin tab)
  return (
    <div style={{ marginTop: 20 }}>
      <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--t3)', fontFamily: 'var(--font-mono)', marginBottom: 14, display: 'block' }}>🏆 Active Career Quests</span>
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
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: `${quest.color}22`, border: `1px solid ${quest.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>{quest.icon}</div>
                  <div>
                    <h3 style={{ fontSize: 14.5, fontWeight: 800, color: 'var(--t1)', margin: 0 }}>{quest.title}</h3>
                    <span style={{ fontSize: 10.5, color: 'var(--t3)' }}>{quest.subtitle}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ flex: 1, height: 5, background: 'var(--bg2)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: quest.color }} />
                  </div>
                  <span style={{ fontSize: 10, color: quest.color, fontWeight: 700 }}>{completedCount}/{quest.stages.length} Stgs</span>
                </div>
              </div>

              <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
                {stageResults.map((s) => (
                  <div key={s.index} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px', borderRadius: 6, background: s.completed ? 'var(--bg3)' : s.index === currentStageIdx + 1 ? `${quest.color}0d` : 'transparent' }}>
                    <span style={{ fontSize: 12 }}>{s.icon}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 11.5, fontWeight: s.index === currentStageIdx + 1 ? 700 : 500, color: s.completed ? 'var(--t3)' : 'var(--t1)' }}>Stg {s.index}: {s.title}</div>
                    </div>
                    {s.completed ? (
                      <span style={{ fontSize: 9.5, color: 'var(--green)', fontWeight: 700 }}>✓ Done</span>
                    ) : s.index === currentStageIdx + 1 ? (
                      <Link href={s.href} style={{ fontSize: 10, color: quest.color, textDecoration: 'none', padding: '3px 8px', background: `${quest.color}18`, borderRadius: 4, fontWeight: 700 }}>Start ➔</Link>
                    ) : (
                      <span style={{ fontSize: 10, color: 'var(--t4)' }}>🔒 Locked</span>
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
