'use client';

import React from 'react';
import type { Project } from '@/lib/data/projectData';
import { getCapstoneNextStep } from '@/lib/interview/capstoneInterview';

export interface CapstoneNextStepProps {
  projects: ReadonlyArray<Project>;
  onStartInterview: (project: Project) => void;
  onGetCertificate?: (project: Project) => void;
  onViewCertificate?: (certificateId: string) => void;
  issuing?: boolean;
}

/** Roadmap journey card on the Projects page: verified capstone → interview → certificate. */
export function CapstoneNextStep({ projects, onStartInterview, onGetCertificate, onViewCertificate, issuing = false }: CapstoneNextStepProps) {
  const next = getCapstoneNextStep(projects);
  if (!next) return null;

  const isInterview = next.step === 'interview';
  const certificateId = next.project.certificateId;
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
            : certificateId
              ? `Certificate ${certificateId} issued. Anyone can verify it online.`
              : 'Your roadmap journey is complete. Get your verifiable certificate.'}
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
      {!isInterview && certificateId && onViewCertificate && (
        <button
          type="button"
          onClick={() => onViewCertificate(certificateId)}
          className="btn-primary"
          style={{ fontSize: 12, padding: '8px 14px' }}
        >
          View certificate ➔
        </button>
      )}
      {!isInterview && !certificateId && onGetCertificate && (
        <button
          type="button"
          disabled={issuing}
          onClick={() => onGetCertificate(next.project)}
          className="btn-primary"
          style={{ fontSize: 12, padding: '8px 14px', opacity: issuing ? 0.6 : 1 }}
        >
          {issuing ? 'Issuing…' : 'Get my certificate ➔'}
        </button>
      )}
    </div>
  );
}
