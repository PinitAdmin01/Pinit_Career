'use client';

import React from 'react';
import { Internship, CompanyProbability, TopCandidate, RiskStudent } from '../hooks/useCareerIntelligenceData';
import { card, cardLabel } from './constants';

interface InternshipTrackerTabProps {
  activeRole: 'student' | 'recruiter' | 'placement' | 'faculty';
  trackerSubTab: 'current' | 'completed';
  setTrackerSubTab: (tab: 'current' | 'completed') => void;
  internships: Internship[];
  probabilities: CompanyProbability[];
  mentees: Internship[];
  approveWeekLog: (menteeId: string, weekNum: number) => void;
  topCandidates: TopCandidate[];
  riskStudents: RiskStudent[];
}

export function InternshipTrackerTab({
  activeRole,
  trackerSubTab,
  setTrackerSubTab,
  internships,
  probabilities,
  mentees,
  approveWeekLog,
  topCandidates,
  riskStudents
}: InternshipTrackerTabProps) {
  return (
    <div>
      {activeRole === 'student' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 20, alignItems: 'start' }}>
          <div style={card}>
            <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={cardLabel}>🏢 Live Internships</div>
              <div style={{ display: 'flex', gap: 4, background: 'var(--bg3)', padding: 3, borderRadius: 8, border: '1px solid var(--border)' }}>
                <button
                  onClick={() => setTrackerSubTab('current')}
                  style={{
                    padding: '4px 10px',
                    fontSize: 11,
                    fontWeight: 700,
                    border: 'none',
                    borderRadius: 6,
                    cursor: 'pointer',
                    background: trackerSubTab === 'current' ? 'var(--bg2)' : 'transparent',
                    color: trackerSubTab === 'current' ? 'var(--accent)' : 'var(--t2)'
                  }}
                >
                  Current
                </button>
                <button
                  onClick={() => setTrackerSubTab('completed')}
                  style={{
                    padding: '4px 10px',
                    fontSize: 11,
                    fontWeight: 700,
                    border: 'none',
                    borderRadius: 6,
                    cursor: 'pointer',
                    background: trackerSubTab === 'completed' ? 'var(--bg2)' : 'transparent',
                    color: trackerSubTab === 'completed' ? 'var(--accent)' : 'var(--t2)'
                  }}
                >
                  Completed
                </button>
              </div>
            </div>

            {internships.filter(i => i.completed === (trackerSubTab === 'completed')).map(internship => (
              <div key={internship.id} style={{ display: 'flex', flexDirection: 'column', gap: 14, background: 'var(--bg3)', padding: 16, borderRadius: 14, border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ fontSize: 15, fontWeight: 900, margin: 0 }}>{internship.company}</h3>
                    <span style={{ fontSize: 12, color: 'var(--t3)' }}>{internship.role}</span>
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--green)', fontWeight: 800 }}>{internship.performance}% Performance</span>
                </div>

                <div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--t3)', marginBottom: 6 }}>TASKS REGISTER</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {internship.tasks.map(t => (
                      <div key={t.id} style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg2)', padding: '6px 10px', borderRadius: 6, border: '1px solid var(--border)' }}>
                        <span style={{ fontSize: 12, color: 'var(--t2)' }}>{t.name}</span>
                        <span style={{ fontSize: 10, fontWeight: 800, color: t.status === 'Approved' ? 'var(--green)' : t.status === 'Review' ? 'var(--amber)' : 'var(--t3)' }}>{t.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={card}>
            <div style={cardLabel}>🔮 AI Placement Predictor</div>
            <p style={{ fontSize: 12.5, color: 'var(--t2)', lineHeight: 1.5, marginBottom: 16 }}>
              Simulated matching models mapping your current trust, streak, and mock exam matrices to standard hiring thresholds.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {probabilities.map(p => (
                <div key={p.company} style={{ background: 'var(--bg3)', padding: 14, borderRadius: 12, border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 800 }}>{p.company}</span>
                    <span style={{ fontSize: 12, color: p.color, fontWeight: 800 }}>{p.pct}% Probability</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {p.reasons.map((r, idx) => (
                      <div key={idx} style={{ fontSize: 11.5, color: 'var(--t3)' }}>• {r}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeRole === 'faculty' && (
        <div style={card}>
          <div style={cardLabel}>Faculty Mentoring Dashboard</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {mentees.map(mentee => (
              <div key={mentee.id} style={{ background: 'var(--bg3)', padding: 16, borderRadius: 12, border: '1px solid var(--border)', display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800 }}>{mentee.studentName}</div>
                  <div style={{ fontSize: 12, color: 'var(--t3)' }}>{mentee.company} — {mentee.role}</div>
                </div>
                {mentee.reviews.map(r => (
                  <div key={r.week} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={{ fontSize: 12, color: 'var(--t2)' }}>Week {r.week}: {r.text}</span>
                    {r.status === 'Pending' ? (
                      <button
                        onClick={() => approveWeekLog(mentee.id, r.week)}
                        style={{ padding: '6px 12px', fontSize: 11, background: 'var(--accent)', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 800 }}
                      >
                        Approve Log
                      </button>
                    ) : (
                      <span style={{ fontSize: 11, color: 'var(--green)', fontWeight: 800 }}>✓ Verified</span>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {(activeRole === 'recruiter' || activeRole === 'placement') && (
        <div style={card}>
          <div style={cardLabel}>Hiring & Risk Management</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div>
              <h4 style={{ fontSize: 13, fontWeight: 850, marginBottom: 10 }}>Top Candidate Matches</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {topCandidates.map(c => (
                  <div key={c.reg} style={{ background: 'var(--bg3)', padding: 12, borderRadius: 10, border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, fontWeight: 800, marginBottom: 4 }}>
                      <span>{c.name}</span>
                      <span style={{ color: 'var(--green)' }}>{c.matchPct}% Match</span>
                    </div>
                    <div style={{ fontSize: 11.5, color: 'var(--t3)' }}>CGPA: {c.cgpa} · Skills: {c.skills.join(', ')}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: 13, fontWeight: 850, marginBottom: 10 }}>Placement Gaps Alert (At Risk)</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {riskStudents.map(c => (
                  <div key={c.reg} style={{ background: 'var(--bg3)', padding: 12, borderRadius: 10, border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, fontWeight: 800, marginBottom: 4 }}>
                      <span>{c.name}</span>
                      <span style={{ color: 'var(--coral)' }}>High Risk</span>
                    </div>
                    <div style={{ fontSize: 11.5, color: 'var(--t3)' }}>Gaps: {c.riskReasons.join(', ')}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
