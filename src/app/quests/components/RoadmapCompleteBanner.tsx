'use client';

import React from 'react';
import type { RoadmapProgress } from '@/lib/roadmap/roadmapCompletion';

export interface RoadmapCompleteBannerProps {
  progress: RoadmapProgress;
  onStartProject: () => void;
}

/** Shown on the custom roadmap once every quest is done: the hand-off to the capstone project. */
export function RoadmapCompleteBanner({ progress, onStartProject }: RoadmapCompleteBannerProps) {
  if (!progress.isComplete) return null;

  return (
    <div
      role="status"
      data-testid="roadmap-complete-banner"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        flexWrap: 'wrap',
        padding: '18px 22px',
        marginBottom: 24,
        borderRadius: 16,
        border: '1.5px solid var(--success)',
        background: 'rgba(var(--success-rgb), 0.1)',
      }}
    >
      <div>
        <div style={{ fontSize: 16, fontWeight: 900, color: 'var(--t1)', fontFamily: 'var(--font-display)' }}>
          🎓 Roadmap complete: {progress.completed}/{progress.total} quests done
        </div>
        <div style={{ fontSize: 13, color: 'var(--t3)', marginTop: 4 }}>
          Next step: build your capstone project from what this roadmap taught you.
        </div>
      </div>
      <button
        type="button"
        onClick={onStartProject}
        style={{
          padding: '10px 18px',
          borderRadius: 12,
          border: 'none',
          background: 'var(--success)',
          color: '#fff',
          fontSize: 13,
          fontWeight: 900,
          cursor: 'pointer',
        }}
      >
        Start my project ➔
      </button>
    </div>
  );
}
