'use client';

import React from 'react';
import { useCareerOS } from '@/lib/context/CareerOSContext';

interface QuestsActivityGridProps {
  activeCourseObj: any;
  overallPct: number;
}

export function QuestsActivityGrid({ activeCourseObj, overallPct }: QuestsActivityGridProps) {
  const { completedQuests } = useCareerOS();

  return (
    <div style={{
      marginBottom: 32,
      background: 'var(--bg2)',
      border: '1px solid var(--border)',
      borderRadius: 20,
      padding: '20px 24px'
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
        
        {/* Left: 30-Day Contribution Grid */}
        <div>
          <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--t2)', marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>🔥 30-Day Contribution Intensity Grid</span>
            <span style={{ fontSize: 10.5, color: 'var(--green)', fontFamily: 'var(--font-mono)' }}>
              {completedQuests.length} Quests Completed
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 6 }}>
            {Array.from({ length: 30 }).map((_, i) => {
              const dayNum = i + 1;
              const isCleared = completedQuests.some(qId => qId.includes(`day-${dayNum}`) || qId.includes(`day${dayNum}`));
              return (
                <div
                  key={i}
                  title={`Day ${dayNum}: ${isCleared ? 'Cleared ✓' : 'Pending'}`}
                  style={{
                    aspectRatio: '1',
                    borderRadius: 6,
                    background: isCleared ? 'linear-gradient(135deg, #10b981, #059669)' : 'var(--bg3)',
                    border: isCleared ? 'none' : '1px solid var(--border)',
                    boxShadow: isCleared ? '0 2px 6px rgba(16,185,129,0.3)' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 9,
                    fontWeight: 800,
                    color: isCleared ? '#fff' : 'var(--t4)'
                  }}
                >
                  {dayNum}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Dynamic Skill Mastery Heatmap Bars */}
        <div>
          <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--t2)', marginBottom: 10 }}>
            🧠 Real-Time Skill Mastery Heatmap
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {(() => {
              const dynamicSkills = [
                {
                  name: `🚀 ${activeCourseObj.title.split('(')[0].trim()} Core Engine`,
                  pct: Math.min(100, overallPct + (completedQuests.length > 0 ? 10 : 0)),
                  color: 'var(--teal)'
                },
                {
                  name: `🧮 Data Structures & Algorithmic Problem Solving`,
                  pct: Math.min(100, Math.round(completedQuests.length * 6.5)),
                  color: 'var(--accent)'
                },
                {
                  name: `💾 Architecture, APIs & System Optimization`,
                  pct: Math.min(100, Math.round(completedQuests.length * 5)),
                  color: 'var(--purple)'
                }
              ];

              return dynamicSkills.map(s => (
                <div key={s.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 700, color: 'var(--t2)', marginBottom: 2 }}>
                    <span>{s.name}</span>
                    <span>{s.pct}%</span>
                  </div>
                  <div style={{ height: 5, background: 'var(--bg3)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ width: `${s.pct}%`, height: '100%', background: s.color, transition: 'width 0.4s' }} />
                  </div>
                </div>
              ));
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}
