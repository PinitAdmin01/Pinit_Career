'use client';

import React from 'react';
import { InternshipReadyBanner } from './InternshipReadyBanner';
import { InternshipCompletedBanner } from './InternshipCompletedBanner';

export type InternshipPanelState =
  | 'loading'
  | 'not_eligible'
  | 'ready_to_start'
  | 'generating'
  | 'generation_failed'
  | 'active'
  | 'expired'
  | 'completed';

interface InternshipStatusBannerProps {
  state: InternshipPanelState;
  notEligibleReason?: string;
  onStart?: () => void;
  isStarting?: boolean;
  startError?: string | null;
  onRetryGeneration?: () => void;
  isRetryingGeneration?: boolean;
  restarts?: number;
  onRestart?: () => void;
  isRestarting?: boolean;
  certificateId?: string | null;
  hasFinalReport?: boolean;
  onOpenReport?: () => void;
  onViewCertificate?: (certId: string) => void;
  onRequestCertificate?: () => void;
  isRequestingCertificate?: boolean;
}

export const InternshipStatusBanner: React.FC<InternshipStatusBannerProps> = ({
  state,
  notEligibleReason,
  onStart,
  isStarting,
  startError,
  onRetryGeneration,
  isRetryingGeneration,
  restarts = 0,
  onRestart,
  isRestarting,
  certificateId,
  hasFinalReport,
  onOpenReport,
  onViewCertificate,
  onRequestCertificate,
  isRequestingCertificate,
}) => {
  if (state === 'loading') {
    return (
      <div
        style={{
          borderRadius: 14,
          padding: '24px 20px',
          background: 'var(--bg2)',
          border: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
          color: 'var(--t2)',
          fontSize: 14,
          fontWeight: 700,
        }}
      >
        <span style={{ fontSize: 20 }}>🔄</span>
        <span>Loading your internship program status...</span>
      </div>
    );
  }

  if (state === 'not_eligible') {
    return (
      <div
        style={{
          borderRadius: 14,
          padding: '20px 22px',
          background: 'rgba(239, 68, 68, 0.08)',
          border: '1.5px solid rgba(239, 68, 68, 0.3)',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 22 }}>🔒</span>
          <h4 style={{ margin: 0, fontSize: 16, fontWeight: 900, color: '#f87171' }}>
            Internship Access Locked
          </h4>
        </div>
        <p style={{ margin: 0, fontSize: 13.5, color: 'var(--t2)', lineHeight: 1.5 }}>
          {notEligibleReason ||
            'You are not currently eligible to start this internship. Complete your core curriculum and capstone project desk first.'}
        </p>
      </div>
    );
  }

  if (state === 'ready_to_start' || state === 'generating' || state === 'generation_failed') {
    return (
      <InternshipReadyBanner
        state={state}
        onStart={onStart}
        isStarting={isStarting}
        startError={startError}
        onRetryGeneration={onRetryGeneration}
        isRetryingGeneration={isRetryingGeneration}
      />
    );
  }

  if (state === 'expired' || state === 'completed') {
    return (
      <InternshipCompletedBanner
        state={state}
        restarts={restarts}
        onRestart={onRestart}
        isRestarting={isRestarting}
        certificateId={certificateId}
        hasFinalReport={hasFinalReport}
        onOpenReport={onOpenReport}
        onViewCertificate={onViewCertificate}
        onRequestCertificate={onRequestCertificate}
        isRequestingCertificate={isRequestingCertificate}
      />
    );
  }

  return null;
};
