'use client';

import React from 'react';
import { Candidate, PIPELINE_STAGES } from '../hooks/useRecruiterData';

interface HiringPipelineViewProps {
  candidates: Candidate[];
  getCandidateStage: (id: string) => string;
  handleUpdateStage: (candidateId: string, stage: string, candidateName: string) => void;
  viewCandidate: (id: string) => void;
}

const STAGE_COLORS: Record<string, string> = {
  Submitted: 'var(--t3)',
  'ATS Screened': 'var(--teal)',
  'AI Interviewed': 'var(--blue)',
  Shortlisted: 'var(--purple)',
  Offered: 'var(--amber)',
  Hired: 'var(--green)',
};

export default function HiringPipelineView({
  candidates,
  getCandidateStage,
  handleUpdateStage,
  viewCandidate,
}: HiringPipelineViewProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <h3 style={{ fontSize: 16, fontWeight: 800, margin: 0, color: 'var(--t1)' }}>
          📊 Enterprise Hiring Pipeline (OpenCATS Model)
        </h3>
        <p style={{ fontSize: 12, color: 'var(--t3)', margin: '2px 0 0' }}>
          6-Stage candidate progression from ATS screening to final hire
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${PIPELINE_STAGES.length}, minmax(170px, 1fr))`,
          gap: 12,
          overflowX: 'auto',
          paddingBottom: 12,
        }}
      >
        {PIPELINE_STAGES.map((stage, sIdx) => {
          const inStage = candidates.filter((c) => getCandidateStage(c.id) === stage);
          const stageColor = STAGE_COLORS[stage] || 'var(--accent)';

          return (
            <div
              key={stage}
              style={{
                background: 'var(--bg2)',
                border: '1px solid var(--border)',
                borderRadius: 14,
                padding: 12,
                display: 'flex',
                flexDirection: 'column',
                minHeight: 380,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: `2px solid ${stageColor}`,
                  paddingBottom: 8,
                  marginBottom: 10,
                }}
              >
                <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--t1)', textTransform: 'uppercase' }}>
                  {stage}
                </span>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    padding: '1px 6px',
                    borderRadius: 10,
                    background: 'var(--bg3)',
                    color: stageColor,
                  }}
                >
                  {inStage.length}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1, overflowY: 'auto' }}>
                {inStage.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '24px 8px', color: 'var(--t3)', fontSize: 11 }}>
                    Empty stage
                  </div>
                ) : (
                  inStage.map((c) => (
                    <div
                      key={c.id}
                      style={{
                        background: 'var(--bg3)',
                        border: '1px solid var(--border)',
                        borderRadius: 10,
                        padding: 10,
                        cursor: 'pointer',
                        transition: 'transform 0.15s ease',
                      }}
                      onClick={() => viewCandidate(c.id)}
                    >
                      <div style={{ fontWeight: 700, fontSize: 12, color: 'var(--t1)', marginBottom: 2 }}>
                        {c.display_name}
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--t3)', marginBottom: 6 }}>
                        ATS {Math.round(c.ats_score)}% · Trust {Math.round(c.trust_score)}%
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        {sIdx > 0 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateStage(c.id, PIPELINE_STAGES[sIdx - 1], c.display_name);
                            }}
                            className="btn-ghost btn-sm"
                            style={{ fontSize: 9, padding: '2px 6px' }}
                            title="Move back"
                          >
                            ←
                          </button>
                        )}
                        <div style={{ flex: 1 }} />
                        {sIdx < PIPELINE_STAGES.length - 1 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateStage(c.id, PIPELINE_STAGES[sIdx + 1], c.display_name);
                            }}
                            className="btn-primary btn-sm"
                            style={{ fontSize: 9, padding: '2px 6px' }}
                            title="Advance"
                          >
                            →
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
