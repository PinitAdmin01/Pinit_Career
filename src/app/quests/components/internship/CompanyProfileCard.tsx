'use client';

import React, { useState } from 'react';
import type { CompanyProfile } from '@/lib/internships/companyProfile';

interface CompanyProfileCardProps {
  profile: Record<string, unknown> | null;
}

export const CompanyProfileCard: React.FC<CompanyProfileCardProps> = ({ profile }) => {
  const [expanded, setExpanded] = useState(false);

  if (!profile) return null;

  const name = String(profile.name || 'Simulated Partner');
  const industry = String(profile.industry || 'Technology & Engineering');
  const readme = String(profile.readme || '');

  return (
    <div
      style={{
        borderRadius: 14,
        background: 'var(--bg2)',
        border: '1.5px solid rgba(99, 102, 241, 0.25)',
        padding: '16px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        position: 'relative',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 20 }}>🏢</span>
            <h3 style={{ margin: 0, fontSize: 17, fontWeight: 900, color: 'var(--text)' }}>
              {name}
            </h3>
            <span
              style={{
                fontSize: 11,
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: 6,
                background: 'rgba(99, 102, 241, 0.15)',
                color: '#818cf8',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              {industry}
            </span>
          </div>
          <span style={{ fontSize: 12, color: 'var(--t3)' }}>
            Assigned Fictional Host Organization · Backlog Host
          </span>
        </div>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '4px 10px',
            borderRadius: 8,
            background: 'rgba(234, 179, 8, 0.1)',
            border: '1px solid rgba(234, 179, 8, 0.3)',
            color: '#facc15',
            fontSize: 11.5,
            fontWeight: 700,
          }}
        >
          <span>⚠️</span>
          <span>Simulated Company</span>
        </div>
      </div>

      {readme && (
        <div
          style={{
            fontSize: 13,
            lineHeight: 1.6,
            color: 'var(--t2)',
            background: 'rgba(15, 23, 42, 0.5)',
            border: '1px solid var(--border)',
            borderRadius: 10,
            padding: '12px 14px',
            position: 'relative',
          }}
        >
          <div
            style={{
              maxHeight: expanded ? 'none' : '72px',
              overflow: 'hidden',
              whiteSpace: 'pre-line',
            }}
          >
            {readme}
          </div>
          {readme.length > 200 && (
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              style={{
                marginTop: 6,
                background: 'none',
                border: 'none',
                color: '#818cf8',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                padding: 0,
              }}
            >
              {expanded ? '▲ Collapse company README' : '▼ Read full company onboarding README'}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
