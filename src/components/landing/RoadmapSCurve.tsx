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
          <div className="lp-badge-tag cyan">METHODICAL PROGRESSION</div>
          <h2 className="lp-section-title">
            The S-Curve Progression Engine.{' '}
            <span className="lp-gradient-text">Zero Guesswork.</span>
          </h2>
          <p className="lp-section-subtitle">
            A continuous, 4-stage pedagogical trajectory designed for zero student dropout and guaranteed placement readiness.
          </p>
        </div>

        {/* 4-Stage Tab Bar */}
        <div className="scurve-nav-bar">
          {stages.map((stage, idx) => {
            const isSelected = selectedStage === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedStage(idx)}
                className={`scurve-stage-btn ${isSelected ? 'active' : ''}`}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontSize: 20 }}>{stage.icon}</span>
                  <span style={{ fontSize: 10.5, fontFamily: 'var(--font-mono)', padding: '2px 7px', borderRadius: 4, background: 'var(--bg-secondary)', color: 'var(--text-secondary)', border: '1px solid var(--border-color)' }}>
                    {stage.days}
                  </span>
                </div>

                <div style={{ fontSize: 11, fontWeight: 750, color: 'var(--accent)', textTransform: 'uppercase', marginBottom: 2 }}>
                  {stage.level}
                </div>

                <div style={{ fontSize: 13, fontWeight: 750, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {stage.title}
                </div>
              </button>
            );
          })}
        </div>

        {/* Stage Details Box */}
        <div className="glass-card" style={{ padding: '36px', borderRadius: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', alignItems: 'center' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className="lp-badge-tag cyan" style={{ margin: 0 }}>
                  {current.level} • {current.days}
                </span>
                <span style={{ fontSize: 11.5, color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>1-Concept Cognitive Budget</span>
              </div>

              <h3 style={{ margin: 0, fontSize: 24, fontWeight: 850, color: 'var(--text-primary)', lineHeight: 1.3 }}>
                {current.title}
              </h3>

              <p style={{ margin: 0, fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {current.desc}
              </p>

              <div style={{ padding: '12px 16px', borderRadius: 12, background: 'var(--bg-secondary)', border: '1px solid var(--accent)', color: 'var(--accent)', fontSize: 12.5, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>🏆</span>
                <span>{current.milestoneTitle}</span>
              </div>

              <div style={{ paddingTop: 8 }}>
                <div style={{ fontSize: 11, fontWeight: 750, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: 8 }}>
                  Verified Skills Tested in this Stage:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {current.skills.map((skill, i) => (
                    <span key={i} style={{ padding: '4px 10px', borderRadius: 8, background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', fontSize: 11.5, color: 'var(--text-primary)' }}>
                      <span style={{ color: 'var(--accent-green)', fontWeight: 700 }}>✓</span> {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Stage Verify Mock */}
            <div style={{ padding: 22, borderRadius: 18, background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: 12, fontSize: 11.5, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: 10 }}>
                <span style={{ color: 'var(--accent)', fontWeight: 700 }}>Stage Verification Suite</span>
                <span style={{ color: 'var(--accent-green)', fontWeight: 700 }}>PASS 100%</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Socratic Check:</span>
                <span style={{ color: 'var(--text-primary)' }}>Empathy 3-Step Recovery</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Judge Sandbox:</span>
                <span style={{ color: 'var(--text-primary)' }}>Isolated 3.0s Timeout</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Assertions Checked:</span>
                <span style={{ color: 'var(--accent-green)' }}>Multi-Case Hardened</span>
              </div>

              <div style={{ padding: 10, borderRadius: 10, background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>
                <span style={{ color: 'var(--accent-amber)', fontWeight: 700 }}>[CERTIFIED]</span> Completed {current.days} proctored milestone challenges with 0 runtime errors.
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
