'use client';

import React from 'react';
import { ResearchItem } from './usePortfolioData';

interface ResearchSectionProps {
  researchPapers: ResearchItem[];
  toggleVerification?: (type: 'research', id: string) => void;
}

export function ResearchSection({ researchPapers, toggleVerification }: ResearchSectionProps) {
  return (
    <div>
      <h3 style={{ margin: '0 0 12px 0', fontSize: 15, fontWeight: 800 }}>Scientific Papers & Preprints</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {researchPapers.length === 0 ? (
          <p style={{ fontSize: 13, color: 'var(--t3)', margin: '8px 0' }}>No research papers or preprints registered yet.</p>
        ) : (
          researchPapers.map(r => (
            <div key={r.id} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', padding: 12, borderRadius: 10 }}>
              <h4 style={{ margin: '0 0 4px 0', fontSize: 13, fontWeight: 800 }}>{r.title}</h4>
              <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center', fontSize: 11.5, color: 'var(--t3)' }}>
                <span>Journal: {r.journal}</span>
                <span
                  onClick={() => toggleVerification && toggleVerification('research', r.id)}
                  style={{
                    color: r.verified ? 'var(--green)' : 'var(--amber)',
                    fontWeight: 700,
                    cursor: toggleVerification ? 'pointer' : 'default'
                  }}
                >
                  {r.verified ? '✓ Verified' : 'Awaiting Audit'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
