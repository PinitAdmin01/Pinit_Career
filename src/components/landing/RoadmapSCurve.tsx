'use client';

import React, { useState } from 'react';

interface StageInfo {
  level: string;
  days: string;
  title: string;
  desc: string;
  milestoneTitle: string;
  skills: string[];
  icon: string;
}

export default function RoadmapSCurve() {
  const [selectedStage, setSelectedStage] = useState<number>(0);

  const stages: StageInfo[] = [
    {
      level: 'Stage 0',
      days: 'Days 1–5',
      title: 'Everyday Analogies & Syntax Foundations',
      desc: 'Master basic instructions, input buffers, primitive variables, and arithmetic precedence using everyday physical models with zero jargon.',
      milestoneTitle: '⭐ Milestone 1: Interactive Decision Console & Math Parser',
      skills: ['Program Structure', 'Scanner Buffers', 'Primitive Overflow', 'Precedence Rules'],
      icon: '🌱'
    },
    {
      level: 'Stage 1',
      days: 'Days 6–15',
      title: 'Algorithmic Control Flow & Memory Matrices',
      desc: 'Conquer conditionals, while/for iteration traps, 1D contiguous arrays, 2D matrix traversal, and binary search with verified test suites.',
      milestoneTitle: '⭐ Milestone 2 & 3: Financial Utility & Matrix Processing Engine',
      skills: ['Nested Iteration', 'Array Memory Allocation', 'Matrix Search', 'Binary Search Invariants'],
      icon: '⚡'
    },
    {
      level: 'Stage 2',
      days: 'Days 16–25',
      title: 'Enterprise OOP & Decoupled Architecture',
      desc: 'Build robust object-oriented systems with encapsulation, dynamic method dispatch, interface contracts, custom exceptions, and dynamic collections.',
      milestoneTitle: '⭐ Milestone 4 & 5: Payment Gateway Interface & Inventory Engine',
      skills: ['Encapsulation & this', 'Polymorphic Dispatch', 'Interface Contracts', 'Exception Guards', 'HashMaps'],
      icon: '🏛️'
    },
    {
      level: 'Stage 3',
      days: 'Days 26–30',
      title: 'Concurrency, Stream I/O & Capstone Auditing',
      desc: 'Master multithreading race conditions, Java Stream APIs, and synthesize the entire 30 days into a comprehensive enterprise financial auditor.',
      milestoneTitle: '🏆 Day 30 Final Capstone: Ledger Transaction Auditor Suite',
      skills: ['Parallel Threads', 'Race Condition Guards', 'Stream Pipelines', 'Full System Integration'],
      icon: '👑'
    }
  ];

  const current = stages[selectedStage];

  return (
    <section id="s-curve-roadmap" className="lp-section">
      <div className="lp-container">
        
        <div className="lp-section-header">
          <div className="lp-badge-tag emerald">METHODICAL PROGRESSION</div>
          <h2 className="lp-section-title">
            The S-Curve Progression Engine.{' '}
            <span className="lp-gradient-text">Zero Guesswork.</span>
          </h2>
          <p className="lp-section-subtitle">
            A continuous, 4-stage pedagogical trajectory designed for zero student dropout and guaranteed placement readiness.
          </p>
        </div>

        {/* 4-Stage Tab Bar */}
        <div className="s-curve-pipeline">
          {stages.map((stage, idx) => {
            const isSelected = selectedStage === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedStage(idx)}
                className={`s-curve-stage-btn ${isSelected ? 'active' : ''}`}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 20 }}>{stage.icon}</span>
                  <span style={{ fontSize: 10, fontFamily: 'monospace', padding: '2px 6px', borderRadius: 4, background: '#1e293b', color: '#94a3b8' }}>
                    {stage.days}
                  </span>
                </div>

                <div style={{ fontSize: 11, fontWeight: 750, color: '#00a3ff', textTransform: 'uppercase' }}>
                  {stage.level}
                </div>

                <div style={{ fontSize: 13, fontWeight: 750, color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {stage.title}
                </div>
              </button>
            );
          })}
        </div>

        {/* Stage Details Box */}
        <div className="lp-card" style={{ padding: '36px 32px' }}>
          <div className="hero-cockpit-grid">
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className="lp-badge-tag cyan" style={{ margin: 0 }}>
                  {current.level} • {current.days}
                </span>
                <span style={{ fontSize: 11, color: '#64748b', fontFamily: 'monospace' }}>1-Concept Cognitive Budget</span>
              </div>

              <h3 style={{ margin: 0, fontSize: 24, fontWeight: 850, color: '#ffffff' }}>
                {current.title}
              </h3>

              <p style={{ margin: 0, fontSize: 14, color: '#94a3b8', lineHeight: 1.6 }}>
                {current.desc}
              </p>

              <div style={{ padding: '12px 16px', borderRadius: 10, background: 'rgba(0,163,255,0.1)', border: '1px solid rgba(0,163,255,0.25)', color: '#7ecbff', fontSize: 12, fontWeight: 650, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>🏆</span>
                <span>{current.milestoneTitle}</span>
              </div>

              <div style={{ paddingTop: 8 }}>
                <div style={{ fontSize: 11, fontWeight: 750, color: '#64748b', textTransform: 'uppercase', marginBottom: 8 }}>
                  Verified Skills Tested in this Stage:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {current.skills.map((skill, i) => (
                    <span key={i} style={{ padding: '4px 10px', borderRadius: 6, background: '#161f33', border: '1px solid rgba(255,255,255,0.06)', fontSize: 11, color: '#cbd5e1' }}>
                      <span style={{ color: '#10b981', fontWeight: 700 }}>✓</span> {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Stage Verify Mock */}
            <div style={{ padding: 22, borderRadius: 16, background: '#070a12', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: 12, fontSize: 11, fontFamily: 'monospace', color: '#94a3b8' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 10 }}>
                <span style={{ color: '#00a3ff', fontWeight: 700 }}>Stage Verification Suite</span>
                <span style={{ color: '#10b981' }}>PASS 100%</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Socratic Check:</span>
                <span style={{ color: '#e2e8f0' }}>Empathy 3-Step Recovery</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Judge Sandbox:</span>
                <span style={{ color: '#e2e8f0' }}>Isolated 3.0s Timeout</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Assertions Checked:</span>
                <span style={{ color: '#10b981' }}>Multi-Case Hardened</span>
              </div>

              <div style={{ padding: 10, borderRadius: 8, background: '#0e1422', border: '1px solid rgba(255,255,255,0.04)', color: '#cbd5e1' }}>
                <span style={{ color: '#f59e0b', fontWeight: 700 }}>[CERTIFIED]</span> Completed {current.days} proctored milestone challenges with 0 runtime errors.
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
