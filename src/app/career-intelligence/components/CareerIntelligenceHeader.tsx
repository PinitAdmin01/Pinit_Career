'use client';

import React from 'react';

interface CareerIntelligenceHeaderProps {
  activeRole: 'student' | 'recruiter' | 'placement' | 'faculty';
  setActiveRole: (role: 'student' | 'recruiter' | 'placement' | 'faculty') => void;
  activeTab: 'tracker' | 'opportunities' | 'applications' | 'projects';
  handleTabChange: (tab: 'tracker' | 'opportunities' | 'applications' | 'projects') => void;
}

export function CareerIntelligenceHeader({
  activeRole,
  setActiveRole,
  activeTab,
  handleTabChange
}: CareerIntelligenceHeaderProps) {
  return (
    <>
      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: 20, display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 900, letterSpacing: '-0.5px', marginBottom: 4 }}>
            💼 Career Intelligence Center
          </h1>
          <p style={{ color: 'var(--t2)', fontSize: 13.5, margin: 0 }}>
            Unified directory covering internships, opportunities, applications pipeline, and industry projects.
          </p>
        </div>

        {/* Demo Switcher */}
        <div style={{ display: 'flex', gap: 6, background: 'var(--bg3)', padding: 4, borderRadius: 10, border: '1px solid var(--border)' }}>
          {[
            { id: 'student', label: '🧑‍🎓 Student' },
            { id: 'recruiter', label: '🏢 Recruiter' },
            { id: 'placement', label: '🎓 Placement' },
            { id: 'faculty', label: '👩‍🏫 Faculty' }
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
      </div>

      {/* Main Segmented Switcher */}
      <div style={{ display: 'flex', gap: 4, background: 'var(--bg3)', padding: 4, borderRadius: 12, border: '1px solid var(--border)', width: 'fit-content', marginBottom: 24 }}>
        {[
          { id: 'tracker', label: '🏢 Internship Tracker' },
          { id: 'opportunities', label: '🎯 Opportunity Radar' },
          { id: 'applications', label: '📋 Application Pipeline' },
          { id: 'projects', label: '💼 Industry Projects' }
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
    </>
  );
}
