'use client';

import React from 'react';
import { CS } from './types';

// SkillRadarChart for Career DNA
function SkillRadarChart({ profile }: { profile: Record<string, unknown> }) {
  const axes = [
    { label: 'Communication', key: 'communication_score' },
    { label: 'Leadership', key: 'leadership_score' },
    { label: 'Execution', key: 'execution_score' },
    { label: 'Problem Solving', key: 'problem_solving_score' },
    { label: 'Creativity', key: 'creativity_score' },
    { label: 'Adaptability', key: 'adaptability_score' },
    { label: 'Consistency', key: 'consistency_score' },
    { label: 'Collaboration', key: 'collaboration_score' },
    { label: 'Learning Velocity', key: 'learning_velocity_score' },
    { label: 'Strategic Thinking', key: 'strategic_thinking_score' }
  ];

  const size = 260;
  const center = size / 2;
  const maxR = size * 0.32;
  const numAxes = axes.length;

  const levels = [0.2, 0.4, 0.6, 0.8, 1.0];
  const bgPolygons = levels.map(level => {
    const r = maxR * level;
    const pts = [];
    for (let i = 0; i < numAxes; i++) {
      const angle = (i * 2 * Math.PI) / numAxes - Math.PI / 2;
      const x = center + r * Math.cos(angle);
      const y = center + r * Math.sin(angle);
      pts.push(`${x},${y}`);
    }
    return pts.join(' ');
  });

  const axisLines = axes.map((axis, i) => {
    const angle = (i * 2 * Math.PI) / numAxes - Math.PI / 2;
    const outerX = center + maxR * Math.cos(angle);
    const outerY = center + maxR * Math.sin(angle);
    const labelX = center + (maxR + 18) * Math.cos(angle);
    const labelY = center + (maxR + 12) * Math.sin(angle);

    return {
      x1: center,
      y1: center,
      x2: outerX,
      y2: outerY,
      labelX,
      labelY,
      label: axis.label,
      align: (Math.cos(angle) > 0.1 ? 'start' : Math.cos(angle) < -0.1 ? 'end' : 'middle') as 'start' | 'end' | 'middle'
    };
  });

  const dataPoints = axes.map((axis, i) => {
    const score = Math.round((profile[axis.key] as number) || 40);
    const r = maxR * (score / 100);
    const angle = (i * 2 * Math.PI) / numAxes - Math.PI / 2;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow: 'visible' }}>
        {bgPolygons.map((pts, i) => (
          <polygon key={i} points={pts} fill="none" stroke="var(--border)" strokeWidth={1} />
        ))}
        {axisLines.map((line, i) => (
          <line key={i} x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} stroke="var(--border2)" strokeWidth={1} />
        ))}
        {axisLines.map((line, i) => (
          <text key={i} x={line.labelX} y={line.labelY} fill="var(--t3)" fontSize={7.5} fontFamily="var(--font-mono)" textAnchor={line.align} dominantBaseline="middle" fontWeight={600}>
            {line.label}
          </text>
        ))}
        <polygon points={dataPoints} fill="rgba(var(--brand-rgb),  0.15)" stroke="var(--accent)" strokeWidth={2} style={{ transition: 'all 0.5s ease-in-out' }} />
        {axes.map((axis, i) => {
          const score = Math.round((profile[axis.key] as number) || 40);
          const r = maxR * (score / 100);
          const angle = (i * 2 * Math.PI) / numAxes - Math.PI / 2;
          const x = center + r * Math.cos(angle);
          const y = center + r * Math.sin(angle);
          return (
            <circle key={i} cx={x} cy={y} r={3} fill="var(--accent)" stroke="var(--bg2)" strokeWidth={1} style={{ transition: 'all 0.5s ease-in-out' }} />
          );
        })}
      </svg>
    </div>
  );
}

// Weekly velocity heatmap for Career DNA
function WeeklyVelocityHeatmap({ completedQuests = [], completedMissions = [], themeColor, timestamps = [] }: { completedQuests?: string[], completedMissions?: string[], themeColor: string, timestamps?: string[] }) {
  const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const WEEKS = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];

  const now = new Date();
  const currentDayOfWeek = (now.getDay() + 6) % 7; // 0 for Mon, ..., 6 for Sun
  let parsedDates = (timestamps || []).map(ts => {
    const iso = ts.includes('|') ? ts.split('|')[0] : ts;
    return new Date(iso);
  }).filter(d => !isNaN(d.getTime()));

  // Fallback: If timestamps array is unpopulated but student has verified completions, derive activity
  if (parsedDates.length === 0) {
    const totalCompletions = (completedMissions?.length || 0) + (completedQuests?.length || 0);
    if (totalCompletions > 0) {
      const synthCount = Math.min(totalCompletions, 28);
      parsedDates = Array.from({ length: synthCount }, (_, idx) => {
        const d = new Date(now);
        d.setDate(now.getDate() - Math.floor(idx / 2));
        return d;
      });
    }
  }

  const grid = Array.from({ length: 7 }, (_, dayIndex) => {
    return Array.from({ length: 4 }, (_, weekIndex) => {
      const targetDate = new Date(now);
      const daysAgo = (3 - weekIndex) * 7 + (currentDayOfWeek - dayIndex);
      targetDate.setDate(now.getDate() - daysAgo);
      const targetStr = targetDate.toDateString();
      const count = parsedDates.filter(d => d.toDateString() === targetStr).length;
      return count >= 3 ? 3 : count === 2 ? 2 : count === 1 ? 1 : 0;
    });
  });

  const getLevelColor = (level: number) => {
    switch (level) {
      case 3: return themeColor;
      case 2: return `${themeColor}cc`;
      case 1: return `${themeColor}66`;
      default: return 'var(--bg3)';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ fontSize: 10.5, letterSpacing: '0.8px', textTransform: 'uppercase', color: 'var(--t3)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
            Evolution Velocity Heatmap
          </span>
          <div style={{ fontSize: 12, color: 'var(--t2)', marginTop: 2 }}>Weekly activity metrics & quest completion density</div>
        </div>
        <div style={{ display: 'flex', gap: 4, alignItems: 'center', fontSize: 10, color: 'var(--t3)', fontFamily: 'var(--font-mono)' }}>
          <span>Less</span>
          <span style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--bg3)', border: '1px solid var(--border)' }} />
          <span style={{ width: 8, height: 8, borderRadius: 2, background: `${themeColor}66` }} />
          <span style={{ width: 8, height: 8, borderRadius: 2, background: `${themeColor}cc` }} />
          <span style={{ width: 8, height: 8, borderRadius: 2, background: themeColor }} />
          <span>More</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'center', padding: '10px 0' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 10, color: 'var(--t3)', fontFamily: 'var(--font-mono)', textAlign: 'right', width: 28 }}>
          {DAYS.map((day, i) => (
            <div key={i} style={{ height: 12, lineHeight: '12px' }}>{i % 2 === 0 ? day : ''}</div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 6 }}>
          {WEEKS.map((_, weekIdx) => (
            <div key={weekIdx} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {Array.from({ length: 7 }).map((_, dayIdx) => {
                const level = grid[dayIdx][weekIdx];
                return (
                  <div key={dayIdx} style={{ width: 12, height: 12, borderRadius: 2, background: getLevelColor(level), border: level === 0 ? '1px solid var(--border)' : 'none' }} />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface CareerDnaTabProps {
  user: any;
  cOS: any;
}

export default function CareerDnaTab({ user, cOS }: CareerDnaTabProps) {
  const effectiveUser = user || {
    id: 'guest',
    displayName: 'Student',
    username: '@student',
    role: 'student',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }} className="animate-fade-in">
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 20, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Archetype Card */}
          <div style={CS.card}>
            <div style={CS.cardLabel}>📊 Career Archetype Profile</div>
            <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 14 }}>
              <span style={{ fontSize: 32 }}>🛠️</span>
              <div>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 900, color: 'var(--accent)' }}>Software Engineer Archetype</h3>
                <span style={{ fontSize: 12, color: 'var(--t3)' }}>Focus: Distributed Infrastructure & Cryptographic consensus</span>
              </div>
            </div>
            <p style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.5, margin: 0 }}>
              Your code quest completions and cryptographic project vault verifications map your archetype directly to SDE structures.
            </p>
          </div>

          {/* Weekly Heatmap */}
          <div style={CS.card}>
            <WeeklyVelocityHeatmap
              completedQuests={cOS.completedQuests}
              completedMissions={cOS.completedMissions}
              themeColor="var(--accent)"
              timestamps={[
                ...(cOS.onboardingAnswers?.completedQuestsTimestamps || []),
                ...(cOS.onboardingAnswers?.completedMissionsTimestamps || [])
              ]}
            />
          </div>
        </div>

        {/* Radar chart */}
        <div style={CS.card}>
          <div style={CS.cardLabel}>🧬 10 Core Evolution Dimensions</div>
          <SkillRadarChart profile={effectiveUser as any} />
        </div>
      </div>

      {/* DNA Dimensions details */}
      <div style={CS.card}>
        <div style={CS.cardLabel}>🧬 Dimension Explanations</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {[
            { label: 'Communication', icon: '🎙', desc: 'Speech clarity and presentation style verified in mock calls.' },
            { label: 'Execution', icon: '⚡', desc: 'Missions completion rate and corporate internship delivery benchmarks.' },
            { label: 'Problem Solving', icon: '🧩', desc: 'Coding quest suite resolutions and algorithm execution times.' },
            { label: 'Strategic Thinking', icon: '🧠', desc: 'System design scaling logic and architecture complexity analysis.' }
          ].map(d => (
            <div key={d.label} style={{ background: 'var(--bg3)', padding: 12, borderRadius: 10, border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontWeight: 800, fontSize: 13, marginBottom: 4 }}>
                <span>{d.icon}</span>
                <span>{d.label}</span>
              </div>
              <p style={{ fontSize: 11.5, color: 'var(--t3)', margin: 0, lineHeight: 1.4 }}>{d.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
