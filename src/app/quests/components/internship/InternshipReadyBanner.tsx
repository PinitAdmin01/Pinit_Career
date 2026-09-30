'use client';

import React from 'react';

interface InternshipReadyBannerProps {
  state: 'ready_to_start' | 'generating' | 'generation_failed';
  onStart?: () => void;
  isStarting?: boolean;
  startError?: string | null;
  onRetryGeneration?: () => void;
  isRetryingGeneration?: boolean;
}

export const InternshipReadyBanner: React.FC<InternshipReadyBannerProps> = ({
  state,
  onStart,
  isStarting,
  startError,
  onRetryGeneration,
  isRetryingGeneration,
}) => {
  if (state === 'generating') {
    return (
      <div
        style={{
          borderRadius: 14,
          padding: '24px 22px',
          background: 'rgba(99, 102, 241, 0.1)',
          border: '1.5px solid rgba(99, 102, 241, 0.35)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: 12,
        }}
      >
        <span style={{ fontSize: 32 }}>⚙️</span>
        <div>
          <h4 style={{ margin: 0, fontSize: 17, fontWeight: 900, color: 'var(--text)' }}>
            Generating Your Simulation Backlog
          </h4>
          <p style={{ margin: '4px 0 0 0', fontSize: 13, color: 'var(--t3)', maxWidth: 480 }}>
            Synthesizing fictional company profile, repository README, and 5 sequential engineering tickets with starter code and unit tests. This takes ~15–30 seconds.
          </p>
        </div>
        <div style={{ fontSize: 12, fontWeight: 800, color: '#818cf8', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span>🔄</span>
          <span>Checking server progress...</span>
        </div>
      </div>
    );
  }

  if (state === 'generation_failed') {
    return (
      <div
        style={{
          borderRadius: 14,
          padding: '20px 22px',
          background: 'rgba(239, 68, 68, 0.08)',
          border: '1.5px solid rgba(239, 68, 68, 0.3)',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 22 }}>⚠️</span>
          <div>
            <h4 style={{ margin: 0, fontSize: 16, fontWeight: 900, color: '#f87171' }}>
              Ticket Generation Timed Out
            </h4>
            <span style={{ fontSize: 12.5, color: 'var(--t3)' }}>
              The server encountered an issue generating your initial backlog. Please try again.
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onRetryGeneration}
          disabled={isRetryingGeneration}
          style={{
            alignSelf: 'flex-start',
            padding: '10px 20px',
            borderRadius: 8,
            border: 'none',
            background: '#ef4444',
            color: '#fff',
            fontSize: 13,
            fontWeight: 800,
            cursor: isRetryingGeneration ? 'not-allowed' : 'pointer',
          }}
        >
          {isRetryingGeneration ? 'Retrying...' : '🔄 Retry Generation'}
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        borderRadius: 14,
        padding: '22px 24px',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(139, 92, 246, 0.08))',
        border: '1.5px solid rgba(99, 102, 241, 0.35)',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 24 }}>🚀</span>
        <div>
          <h4 style={{ margin: 0, fontSize: 17, fontWeight: 900, color: 'var(--text)' }}>
            Ready to Start Your 2-Week Python Job Simulation
          </h4>
          <span style={{ fontSize: 12.5, color: 'var(--t3)' }}>
            Simulated company onboarding · 5 sequential engineering tickets · Automated hidden tests · AI code review
          </span>
        </div>
      </div>

      <ul style={{ margin: 0, paddingLeft: 20, fontSize: 13, color: 'var(--t2)', lineHeight: 1.6 }}>
        <li>Unique AI-generated fictional company profile with production backlog.</li>
        <li>14-day completion window with a one-time 7-day extension option.</li>
        <li>Pass unit tests and server-side hidden checks to unlock each ticket.</li>
        <li>Submit a final stand-up report upon backlog completion to claim your verifiable credential.</li>
      </ul>

      {startError && (
        <div
          style={{
            padding: '10px 14px',
            borderRadius: 8,
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#f87171',
            fontSize: 13,
          }}
        >
          {startError}
        </div>
      )}

      <button
        type="button"
        onClick={onStart}
        disabled={isStarting}
        style={{
          alignSelf: 'flex-start',
          padding: '12px 24px',
          borderRadius: 10,
          border: 'none',
          background: isStarting ? 'var(--bg2)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          color: isStarting ? 'var(--t4)' : '#fff',
          fontSize: 14,
          fontWeight: 800,
          cursor: isStarting ? 'not-allowed' : 'pointer',
          boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <span>{isStarting ? '⏳ Initializing Cohort...' : '⚡ Start Job Simulation Now'}</span>
      </button>
    </div>
  );
};
