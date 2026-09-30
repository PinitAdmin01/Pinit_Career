'use client';

import React from 'react';

interface InternshipCompletedBannerProps {
  state: 'completed' | 'expired';
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

export const InternshipCompletedBanner: React.FC<InternshipCompletedBannerProps> = ({
  state,
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
  if (state === 'expired') {
    const canRestart = restarts < 1;
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
          <span style={{ fontSize: 22 }}>⌛</span>
          <div>
            <h4 style={{ margin: 0, fontSize: 16, fontWeight: 900, color: '#ef4444' }}>
              Internship Period Expired
            </h4>
            <p style={{ margin: '3px 0 0 0', fontSize: 13, color: 'var(--t2)' }}>
              The 14-day deadline (plus extensions) for this internship cohort has lapsed.
            </p>
          </div>
        </div>

        {canRestart ? (
          <div>
            <p style={{ margin: '0 0 10px 0', fontSize: 12.5, color: 'var(--t3)' }}>
              You are allowed <strong>one restart</strong> with newly generated company tickets and a fresh 14-day window.
            </p>
            <button
              type="button"
              onClick={onRestart}
              disabled={isRestarting}
              style={{
                padding: '10px 20px',
                borderRadius: 8,
                border: 'none',
                background: isRestarting ? 'var(--bg2)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: '#fff',
                fontSize: 13,
                fontWeight: 800,
                cursor: isRestarting ? 'not-allowed' : 'pointer',
              }}
            >
              {isRestarting ? 'Restarting...' : '🔄 Restart Simulation (Final Attempt)'}
            </button>
          </div>
        ) : (
          <div style={{ fontSize: 12.5, color: 'var(--t3)' }}>
            This internship has reached the maximum permitted restarts (1). Contact an academic advisor if you require further accommodations.
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      style={{
        borderRadius: 14,
        padding: '22px 24px',
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(6, 182, 212, 0.08))',
        border: '1.5px solid rgba(16, 185, 129, 0.35)',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 26 }}>🎓</span>
        <div>
          <h4 style={{ margin: 0, fontSize: 17, fontWeight: 900, color: '#10b981' }}>
            Simulation Successfully Completed!
          </h4>
          <span style={{ fontSize: 12.5, color: 'var(--t3)' }}>
            All 5 engineering tickets solved · Final stand-up report accepted
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {certificateId ? (
          <button
            type="button"
            onClick={() => onViewCertificate?.(certificateId)}
            style={{
              padding: '10px 20px',
              borderRadius: 8,
              border: 'none',
              background: '#10b981',
              color: '#fff',
              fontSize: 13,
              fontWeight: 800,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span>📜 View Verifiable Certificate</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onRequestCertificate}
            disabled={isRequestingCertificate}
            style={{
              padding: '10px 20px',
              borderRadius: 8,
              border: 'none',
              background: '#10b981',
              color: '#fff',
              fontSize: 13,
              fontWeight: 800,
              cursor: isRequestingCertificate ? 'not-allowed' : 'pointer',
            }}
          >
            {isRequestingCertificate ? 'Issuing...' : '🎓 Claim Verifiable Certificate'}
          </button>
        )}

        {hasFinalReport && onOpenReport && (
          <button
            type="button"
            onClick={onOpenReport}
            style={{
              padding: '10px 18px',
              borderRadius: 8,
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border)',
              color: 'var(--text)',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            📋 Review Stand-Up Report
          </button>
        )}
      </div>
    </div>
  );
};
