'use client';

import React from 'react';
import { Candidate } from '../hooks/useRecruiterData';
import { ResumeFormData } from '@/components/career/ResumeForm.types';

interface ShortlistPanelProps {
  candidates: Candidate[];
  getCandidateStage: (id: string) => string;
  handleUpdateStage: (candidateId: string, stage: string, candidateName: string) => void;
  viewCandidate: (id: string) => void;
  setViewResumeData: (data: { name: string; resume: ResumeFormData } | null) => void;
  scheduleInterview: (id: string) => void;
  sendContactRequest: (id: string) => void;
}

export default function ShortlistPanel({
  candidates,
  getCandidateStage,
  handleUpdateStage,
  viewCandidate,
  setViewResumeData,
  scheduleInterview,
  sendContactRequest,
}: ShortlistPanelProps) {
  const shortlistedCandidates = candidates.filter(
    (c) => getCandidateStage(c.id) === 'Shortlisted' || getCandidateStage(c.id) === 'Offered' || getCandidateStage(c.id) === 'Hired'
  );

  if (shortlistedCandidates.length === 0) {
    return (
      <div className="empty-state" style={{ padding: 48, textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>★</div>
        <h3 style={{ fontSize: 18, fontWeight: 800, margin: '0 0 6px', color: 'var(--t1)' }}>
          No Shortlisted Candidates Yet
        </h3>
        <p style={{ color: 'var(--t3)', fontSize: 13, maxWidth: 450, margin: '0 auto' }}>
          Explore the Candidates pool and click &ldquo;★ Shortlist Candidate&rdquo; to collect high-signal talent here.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 800, margin: 0, color: 'var(--t1)' }}>
            ★ Shortlisted Talent ({shortlistedCandidates.length})
          </h3>
          <p style={{ fontSize: 12, color: 'var(--t3)', margin: '2px 0 0' }}>
            Pre-screened students queued for final interviews and offers
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
        {shortlistedCandidates.map((c) => {
          const currentStage = getCandidateStage(c.id);
          return (
            <div
              key={c.id}
              className="glass-card card-hover"
              style={{
                borderRadius: 16,
                padding: 18,
                border: '1px solid var(--border)',
                background: 'var(--bg2)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 14,
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div>
                    <h4
                      onClick={() => viewCandidate(c.id)}
                      style={{ fontSize: 15, fontWeight: 800, color: 'var(--t1)', margin: 0, cursor: 'pointer' }}
                    >
                      {c.display_name}
                    </h4>
                    <span style={{ fontSize: 11, color: 'var(--t3)' }}>{c.programType || 'B.Tech CS'}</span>
                  </div>
                  <span
                    className="badge"
                    style={{
                      fontSize: 10,
                      background:
                        currentStage === 'Hired'
                          ? 'rgba(var(--success-rgb), 0.15)'
                          : currentStage === 'Offered'
                          ? 'rgba(var(--brand-rgb), 0.15)'
                          : 'rgba(var(--reward-rgb), 0.15)',
                      color:
                        currentStage === 'Hired'
                          ? 'var(--success)'
                          : currentStage === 'Offered'
                          ? 'var(--accent)'
                          : 'var(--reward)',
                    }}
                  >
                    {currentStage}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                  <div style={{ background: 'var(--bg3)', borderRadius: 8, padding: '6px 10px', flex: 1, textAlign: 'center' }}>
                    <div style={{ fontSize: 9, color: 'var(--t3)', textTransform: 'uppercase' }}>ATS</div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--teal)' }}>{Math.round(c.ats_score)}%</div>
                  </div>
                  <div style={{ background: 'var(--bg3)', borderRadius: 8, padding: '6px 10px', flex: 1, textAlign: 'center' }}>
                    <div style={{ fontSize: 9, color: 'var(--t3)', textTransform: 'uppercase' }}>Trust</div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--green)' }}>{Math.round(c.trust_score)}%</div>
                  </div>
                  <div style={{ background: 'var(--bg3)', borderRadius: 8, padding: '6px 10px', flex: 1, textAlign: 'center' }}>
                    <div style={{ fontSize: 9, color: 'var(--t3)', textTransform: 'uppercase' }}>DNA</div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--purple)' }}>{Math.round(c.career_dna_score)}%</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {(c.skill_tags || []).slice(0, 4).map((s) => (
                    <span
                      key={s}
                      style={{
                        fontSize: 9.5,
                        padding: '2px 6px',
                        background: 'var(--bg3)',
                        borderRadius: 4,
                        border: '1px solid var(--border)',
                        color: 'var(--t2)',
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {c.structured_resume && (
                  <button
                    onClick={() => setViewResumeData({ name: c.display_name, resume: c.structured_resume! })}
                    className="btn-ghost btn-sm"
                    style={{ fontSize: 10.5, flex: 1, justifyContent: 'center' }}
                  >
                    📄 Resume
                  </button>
                )}
                <button
                  onClick={() => scheduleInterview(c.id)}
                  className="btn-ghost btn-sm"
                  style={{ fontSize: 10.5, color: 'var(--teal)', flex: 1, justifyContent: 'center' }}
                >
                  📅 Interview
                </button>
                <button
                  onClick={() => sendContactRequest(c.id)}
                  className="btn-ghost btn-sm"
                  style={{ fontSize: 10.5, flex: 1, justifyContent: 'center' }}
                >
                  ✉ Contact
                </button>
                {currentStage !== 'Hired' && (
                  <button
                    onClick={() => handleUpdateStage(c.id, currentStage === 'Shortlisted' ? 'Offered' : 'Hired', c.display_name)}
                    className="btn-primary btn-sm"
                    style={{ fontSize: 10.5, flex: 1, justifyContent: 'center' }}
                  >
                    {currentStage === 'Shortlisted' ? 'Offer ➔' : 'Hire 🎉'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
