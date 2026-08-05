'use client';

import React from 'react';
import { useCareerOS } from '@/lib/context/CareerOSContext';
import { useAuth } from '@/lib/context/AuthContext';

interface QuestsHeroHeaderProps {
  trajectory: any;
  onOpenRoadmapModal: () => void;
  showCourseLibrary: boolean;
  onToggleCourseLibrary: () => void;
  onOpenNotesModal: () => void;
}

export function QuestsHeroHeader({
  trajectory,
  onOpenRoadmapModal,
  showCourseLibrary,
  onToggleCourseLibrary,
  onOpenNotesModal
}: QuestsHeroHeaderProps) {
  const { user } = useAuth();
  const userName = (user as any)?.user_metadata?.full_name || (user as any)?.name || user?.email?.split('@')[0] || 'Developer';

  return (
    <div className="glass-card-premium" style={{
      padding: '24px 28px',
      borderRadius: 22,
      marginBottom: 20,
      background: 'linear-gradient(135deg, rgba(16,185,129,0.06), rgba(99,102,241,0.04))',
      border: '1px solid var(--border)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
        
        {/* Left: Welcome & Target Role */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <h1 style={{ fontSize: 17, fontWeight: 900, color: 'var(--t1)', fontFamily: 'var(--font-display)', margin: 0 }}>
            👋 Welcome, {userName}!
          </h1>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)', padding: '2px 8px', borderRadius: 12, fontSize: 10.5, fontWeight: 800, color: 'var(--accent)' }}>
            <span>{trajectory.icon}</span>
            <span>Target Role: {trajectory.roleTitle}</span>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button
            onClick={onOpenRoadmapModal}
            style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              border: 'none',
              borderRadius: 8,
              padding: '5px 12px',
              color: '#fff',
              fontSize: 11,
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(16,185,129,0.2)'
            }}
            className="btn-glow"
          >
            ✨ Generate Custom AI Roadmap
          </button>

          <button
            onClick={onToggleCourseLibrary}
            style={{
              background: showCourseLibrary ? 'var(--accent)' : 'rgba(255,255,255,0.05)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: '5px 12px',
              color: showCourseLibrary ? '#fff' : 'var(--t2)',
              fontSize: 11,
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            {showCourseLibrary ? '🗺️ View Roadmap View' : '📚 All 20 Courses'}
          </button>

          <button
            onClick={onOpenNotesModal}
            style={{
              background: 'rgba(56,189,248,0.12)',
              border: '1px solid rgba(56,189,248,0.3)',
              borderRadius: 8,
              padding: '5px 12px',
              color: '#38bdf8',
              fontSize: 11,
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            📖 View Simple Notes
          </button>
        </div>
      </div>
    </div>
  );
}
