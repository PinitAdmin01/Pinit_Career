'use client';

import React, { useState } from 'react';

interface InternshipDeadlineBannerProps {
  dueAt: string | null;
  extended: boolean;
  status: string;
  onRequestExtension?: () => Promise<void>;
  isRequestingExtension?: boolean;
}

export const InternshipDeadlineBanner: React.FC<InternshipDeadlineBannerProps> = ({
  dueAt,
  extended,
  status,
  onRequestExtension,
  isRequestingExtension = false,
}) => {
  const [confirming, setConfirming] = useState(false);

  if (status !== 'active' && status !== 'expired') return null;

  let timeDisplay = 'No deadline recorded';
  let isPast = false;
  let isUrgent = false;

  if (dueAt) {
    const dueDate = new Date(dueAt);
    const now = Date.now();
    const diffMs = dueDate.getTime() - now;

    if (diffMs <= 0) {
      isPast = true;
      timeDisplay = 'Simulation period ended';
    } else {
      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      timeDisplay = `${days}d ${hours}h remaining`;
      if (days < 3) isUrgent = true;
    }
  }

  const handleRequest = async () => {
    if (!onRequestExtension) return;
    setConfirming(false);
    await onRequestExtension();
  };

  return (
    <div
      style={{
        borderRadius: 12,
        background: isPast
          ? 'rgba(239, 68, 68, 0.08)'
          : isUrgent
          ? 'rgba(245, 158, 11, 0.08)'
          : 'rgba(99, 102, 241, 0.08)',
        border: `1px solid ${
          isPast
            ? 'rgba(239, 68, 68, 0.3)'
            : isUrgent
            ? 'rgba(245, 158, 11, 0.3)'
            : 'rgba(99, 102, 241, 0.25)'
        }`,
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 18 }}>{isPast ? '⏰' : isUrgent ? '⏳' : '📅'}</span>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--text)' }}>
              {isPast ? 'Deadline Expired' : 'Cohort Window:'}
            </span>
            <span
              style={{
                fontSize: 13,
                fontWeight: 900,
                color: isPast ? '#ef4444' : isUrgent ? '#f59e0b' : '#818cf8',
              }}
            >
              {timeDisplay}
            </span>
          </div>
          {dueAt && (
            <div style={{ fontSize: 11.5, color: 'var(--t3)' }}>
              Due: {new Date(dueAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {extended ? (
          <span
            style={{
              fontSize: 11.5,
              fontWeight: 700,
              padding: '4px 10px',
              borderRadius: 6,
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#10b981',
            }}
          >
            ✓ 7-Day Extension Applied
          </span>
        ) : onRequestExtension && !isPast ? (
          confirming ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 12, color: 'var(--t2)' }}>Add 7 days?</span>
              <button
                type="button"
                onClick={handleRequest}
                disabled={isRequestingExtension}
                style={{
                  padding: '4px 10px',
                  borderRadius: 6,
                  background: '#6366f1',
                  color: '#fff',
                  border: 'none',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: isRequestingExtension ? 'not-allowed' : 'pointer',
                }}
              >
                {isRequestingExtension ? 'Extending...' : 'Confirm'}
              </button>
              <button
                type="button"
                onClick={() => setConfirming(false)}
                style={{
                  padding: '4px 8px',
                  borderRadius: 6,
                  background: 'transparent',
                  color: 'var(--t3)',
                  border: '1px solid var(--border)',
                  fontSize: 12,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirming(true)}
              style={{
                padding: '6px 12px',
                borderRadius: 8,
                background: 'rgba(99, 102, 241, 0.15)',
                border: '1px solid rgba(99, 102, 241, 0.35)',
                color: '#818cf8',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              + Request 7-Day Extension
            </button>
          )
        ) : null}
      </div>
    </div>
  );
};
