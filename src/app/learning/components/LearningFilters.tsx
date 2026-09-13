'use client';

import React from 'react';

interface LearningFiltersProps {
  activeRole: 'student' | 'faculty';
  setActiveRole: (role: 'student' | 'faculty') => void;
  canAccessFaculty: boolean;
  activeTab: 'mistakes' | 'roadmap' | 'twin' | 'gaps' | 'memory';
  handleTabChange: (tab: 'mistakes' | 'roadmap' | 'twin' | 'gaps' | 'memory') => void;
}

export function LearningFilters({
  activeRole,
  setActiveRole,
  canAccessFaculty,
  activeTab,
  handleTabChange,
}: LearningFiltersProps) {
  return (
    <>
      {/* Header */}
      <div className="page-header" style={{ marginBottom: 20, display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 900, letterSpacing: '-0.5px', marginBottom: 4 }}>
            📖 Learning Roadmap & Digital Career Twin
          </h1>
          <p style={{ color: 'var(--t2)', fontSize: 13.5, margin: 0 }}>
            {activeRole === 'student' && "Continuous personalized path to placement derived dynamically from your Career DNA and learning logs."}
            {activeRole === 'faculty' && "Monitor students struggling with specific curriculum modules and prescribe custom tasks."}
          </p>
        </div>

        {/* Switcher — Faculty Desk only for teacher/admin roles */}
        {canAccessFaculty && (
          <div style={{ display: 'flex', gap: 6, background: 'var(--bg3)', padding: 4, borderRadius: 10, border: '1px solid var(--border)' }}>
            {[
              { id: 'student', label: '🧑‍🎓 Student Portal' },
              { id: 'faculty', label: '👩‍🏫 Faculty Desk' }
            ].map(role => (
              <button
                key={role.id}
                onClick={() => setActiveRole(role.id as any)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 8,
                  border: 'none',
                  background: activeRole === role.id ? 'var(--accent)' : 'transparent',
                  color: activeRole === role.id ? '#fff' : 'var(--t2)',
                  fontSize: 11.5,
                  fontWeight: 800,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {role.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {(activeRole === 'student' || !canAccessFaculty) && (
        <div style={{ display: 'flex', gap: 4, background: 'var(--bg3)', padding: 4, borderRadius: 12, border: '1px solid var(--border)', width: 'fit-content', marginBottom: 24 }}>
          {[
            { id: 'mistakes', label: '⚠️ Mistakes & Remediation' },
            { id: 'roadmap', label: '📖 Growth Roadmap' },
            { id: 'twin', label: '🧬 Career Twin Simulator' },
            { id: 'gaps', label: '🎯 Curriculum Gaps' },
            { id: 'memory', label: '🧠 Spaced Memory (FSRS)' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => handleTabChange(t.id as any)}
              style={{
                padding: '8px 18px',
                border: 'none',
                borderRadius: 8,
                fontSize: 12.5,
                fontWeight: 800,
                cursor: 'pointer',
                background: activeTab === t.id ? 'var(--bg2)' : 'transparent',
                color: activeTab === t.id ? 'var(--accent)' : 'var(--t3)',
                transition: 'all 0.15s'
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}
    </>
  );
}
