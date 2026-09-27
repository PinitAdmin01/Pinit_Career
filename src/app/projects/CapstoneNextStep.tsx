'use client';

import React from 'react';
import type { Project } from '@/lib/data/projectData';
import { getCapstoneNextStep } from '@/lib/interview/capstoneInterview';

export interface CapstoneNextStepProps {
  projects: ReadonlyArray<Project>;
  onStartInterview: (project: Project) => void;
}

/** Roadmap journey card on the Projects page: verified capstone → interview → (certificate). */
export function CapstoneNextStep({ projects, onStartInterview }: CapstoneNextStepProps) {
  const next = getCapstoneNextStep(projects);
  if (!next) return null;

  const isInterview = next.step === 'interview';
  return (
    <div
      role="status"
      data-testid="capstone-next-step"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        flexWrap: 'wrap',
        padding: '16px 20px',
        marginBottom: 20,
        borderRadius: 14,
        border: '1.5px solid var(--accent)',
        background: 'rgba(var(--brand-rgb), 0.08)',
      }}
    >
      <div>
        <div style={{ fontSize: 15, fontWeight: 900, color: 'var(--t1)' }}>
          {isInterview
            ? `🎓 Capstone verified: "${next.project.name}"`
            : `🏅 Capstone interview passed (${next.project.capstoneInterview?.score ?? 0}%)`}
        </div>
        <div style={{ fontSize: 12.5, color: 'var(--t3)', marginTop: 4 }}>
          {isInterview
            ? 'Next step: your capstone interview. Defend this project for your target role. No Pins needed.'
            : 'Your roadmap journey is complete. Your certificate is the final step.'}
        </div>
      </div>
      {isInterview && (
        <button
          type="button"
          onClick={() => onStartInterview(next.project)}
          className="btn-primary"
          style={{ fontSize: 12, padding: '8px 14px' }}
        >
          Start capstone interview ➔
        </button>
      )}
    </div>
  );
}
