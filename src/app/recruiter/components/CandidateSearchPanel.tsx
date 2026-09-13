'use client';

import React from 'react';
import { Candidate, PIPELINE_STAGES } from '../hooks/useRecruiterData';
import { ResumeFormData } from '@/components/career/ResumeForm.types';

interface CandidateSearchPanelProps {
  analytics: Record<string, number>;
  filters: { minTrust: string; minAts: string; domain: string };
  setFilters: React.Dispatch<React.SetStateAction<{ minTrust: string; minAts: string; domain: string }>>;
  fetchCandidates: () => void;
  loading: boolean;
  candidates: Candidate[];
  selectedCandidate: Candidate | null;
  setSelectedCandidate: (c: Candidate | null) => void;
  viewCandidate: (id: string) => void;
  setViewResumeData: (data: { name: string; resume: ResumeFormData } | null) => void;
  getCandidateStage: (candidateId: string) => string;
  handleUpdateStage: (candidateId: string, stage: string, candidateName: string) => void;
  candidateNotesMap: Record<string, Array<{ text: string; date: string; author: string }>>;
  newNoteText: string;
  setNewNoteText: (val: string) => void;
  handleAddRecruiterNote: (candidateId: string) => void;
  logActivity: (action: string, meta?: any) => void;
  triggerToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
  shortlist: (id: string) => void;
  sendContactRequest: (id: string) => void;
  scheduleInterview: (candidateId: string) => void;
}

export default function CandidateSearchPanel({
  analytics,
  filters,
  setFilters,
  fetchCandidates,
  loading,
  candidates,
  selectedCandidate,
  setSelectedCandidate,
  viewCandidate,
  setViewResumeData,
  getCandidateStage,
  handleUpdateStage,
  candidateNotesMap,
  newNoteText,
  setNewNoteText,
  handleAddRecruiterNote,
  logActivity,
  triggerToast,
  shortlist,
  sendContactRequest,
  scheduleInterview,
}: CandidateSearchPanelProps) {
  const filteredCandidates = candidates.filter((c) => {
    if (filters.minTrust && (c.trust_score || 0) < Number(filters.minTrust)) return false;
    if (filters.minAts && (c.ats_score || 0) < Number(filters.minAts)) return false;
    if (filters.domain) {
      const d = filters.domain.toLowerCase();
      const matchesName = (c.display_name || '').toLowerCase().includes(d);
      const matchesSkills =
        Array.isArray(c.skill_tags) && c.skill_tags.some((s: string) => s.toLowerCase().includes(d));
      if (!matchesName && !matchesSkills) return false;
    }
    return true;
  });

  return (
    <>
      {/* Analytics Widgets */}
      <div className="metric-grid" style={{ marginBottom: 20 }}>
        {[
          { label: 'Total Candidates', value: analytics.total_students || 0, icon: '👥', color: 'var(--accent)' },
          { label: 'Avg ATS Score', value: analytics.avg_ats || 0, icon: '🎯', color: 'var(--teal)' },
          { label: 'Avg Trust Score', value: analytics.avg_trust || 0, icon: '🛡', color: 'var(--green)' },
          { label: 'Avg Career DNA', value: analytics.avg_dna || 0, icon: '🧬', color: 'var(--purple)' },
        ].map((s) => (
          <div key={s.label} className="metric-card">
            <div className="metric-label">
              {s.icon} {s.label}
            </div>
            <div className="metric-value" style={{ color: s.color, fontSize: 24 }}>
              {s.value}
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          placeholder="Min Trust Score"
          value={filters.minTrust}
          onChange={(e) => setFilters((f) => ({ ...f, minTrust: e.target.value }))}
          className="form-input"
          style={{ width: 150 }}
        />
        <input
          placeholder="Min ATS Score"
          value={filters.minAts}
          onChange={(e) => setFilters((f) => ({ ...f, minAts: e.target.value }))}
          className="form-input"
          style={{ width: 150 }}
        />
        <input
          placeholder="Domain / Skill (e.g. React)"
          value={filters.domain}
          onChange={(e) => setFilters((f) => ({ ...f, domain: e.target.value }))}
          className="form-input"
          style={{ width: 180 }}
        />
        <button onClick={fetchCandidates} className="btn-primary">
          Search Candidates
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selectedCandidate ? '1fr 380px' : '1fr', gap: 20 }}>
        {/* Candidate List */}
        <div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: 48, color: 'var(--t3)' }}>Searching repository...</div>
          ) : filteredCandidates.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">👥</div>
              <div className="empty-title">No candidate match</div>
              <div className="empty-desc">Adjust filters or check skill keywords.</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {filteredCandidates.map((c, i) => (
                <div
                  key={c.id}
                  onClick={() => viewCandidate(c.id)}
                  className="glass-card card-hover"
                  style={{
                    background: selectedCandidate?.id === c.id ? 'rgba(var(--brand-rgb), 0.08)' : 'var(--bg2)',
                    border: `1px solid ${selectedCandidate?.id === c.id ? 'var(--accent)' : 'var(--border)'}`,
                    borderRadius: 14,
                    padding: '16px 20px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    flexWrap: 'wrap',
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: i < 3 ? 'linear-gradient(135deg, var(--accent), var(--teal))' : 'var(--bg3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 12,
                      fontWeight: 800,
                      color: i < 3 ? 'white' : 'var(--t3)',
                      boxShadow: i < 3 ? '0 0 10px rgba(var(--brand-rgb), 0.3)' : 'none',
                      flexShrink: 0,
                    }}
                    className="flex items-center justify-center"
                  >
                    #{i + 1}
                  </div>

                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontWeight: 800, fontSize: 14.5, color: 'var(--t1)' }}>{c.display_name}</span>
                      <span
                        style={{
                          fontSize: 10,
                          background: 'var(--accent-light)',
                          color: 'var(--accent)',
                          padding: '1px 5px',
                          borderRadius: 4,
                          fontWeight: 700,
                        }}
                      >
                        {c.programType || 'B.Tech CS'}
                      </span>
                      <span style={{ fontSize: 10.5, color: 'var(--t3)', fontFamily: 'var(--font-mono)' }}>
                        (🎯 {c.missions_done || 0} quests · 🎙 {c.interviews_done || 0} interviews)
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {(c.skill_tags || []).slice(0, 4).map((s) => (
                        <span
                          key={s}
                          style={{
                            fontSize: 10,
                            padding: '2px 7px',
                            borderRadius: 4,
                            background: 'var(--bg3)',
                            color: 'var(--t2)',
                            border: '1px solid var(--border)',
                            fontFamily: 'var(--font-mono)',
                          }}
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 12, flexShrink: 0, alignItems: 'center' }}>
                    {[
                      {
                        label: 'ATS Match',
                        value: c.ats_score,
                        color: 'var(--teal)',
                        glow: 'rgba(var(--accent-teal-rgb), 0.1)',
                      },
                      {
                        label: 'Trust Verification',
                        value: c.trust_score,
                        color: 'var(--green)',
                        glow: 'rgba(var(--success-rgb), 0.1)',
                      },
                      {
                        label: 'Career DNA',
                        value: c.career_dna_score,
                        color: 'var(--accent)',
                        glow: 'rgba(var(--brand-rgb), 0.1)',
                      },
                    ].map((s) => (
                      <div
                        key={s.label}
                        style={{
                          background: 'rgba(10, 15, 30, 0.4)',
                          border: `1px solid ${s.color}33`,
                          boxShadow: `0 0 8px ${s.glow}`,
                          borderRadius: 10,
                          padding: '6px 12px',
                          textAlign: 'center',
                          minWidth: 70,
                        }}
                      >
                        <div
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: 15,
                            fontWeight: 800,
                            color: s.color,
                          }}
                        >
                          {Math.round(s.value)}%
                        </div>
                        <div
                          style={{
                            fontSize: 8.5,
                            color: 'var(--t3)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.4px',
                            fontWeight: 600,
                          }}
                        >
                          {s.label.split(' ')[0]}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Candidate Side Drawer */}
        {selectedCandidate && (
          <div
            style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 14,
              padding: 20,
              height: 'fit-content',
              maxHeight: 'calc(100vh - 80px)',
              overflowY: 'auto',
              position: 'sticky',
              top: 20,
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--accent), var(--purple))',
                    color: 'var(--text)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: 15,
                  }}
                >
                  {selectedCandidate.display_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 800, color: 'var(--t1)' }}>
                    {selectedCandidate.display_name}
                  </div>
                  {selectedCandidate.programType && (
                    <span
                      style={{
                        fontSize: 10,
                        background: 'var(--accent-light)',
                        color: 'var(--accent)',
                        padding: '1px 6px',
                        borderRadius: 4,
                        fontWeight: 700,
                      }}
                    >
                      {selectedCandidate.programType}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => setSelectedCandidate(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--t3)', fontSize: 16 }}
              >
                ✕
              </button>
            </div>

            {/* Contact Information */}
            {(selectedCandidate.email || selectedCandidate.phone) && (
              <div
                style={{
                  background: 'var(--bg3)',
                  borderRadius: 8,
                  padding: '10px 12px',
                  marginBottom: 14,
                  fontSize: 11,
                }}
              >
                <div
                  style={{
                    fontSize: 9.5,
                    color: 'var(--t3)',
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                    fontWeight: 700,
                    marginBottom: 4,
                  }}
                >
                  Contact Info
                </div>
                {selectedCandidate.email && (
                  <div style={{ color: 'var(--t1)', marginBottom: 2 }}>✉️ {selectedCandidate.email}</div>
                )}
                {selectedCandidate.phone && <div style={{ color: 'var(--t1)' }}>📞 {selectedCandidate.phone}</div>}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
              {[
                { l: 'ATS Match', v: `${Math.round(selectedCandidate.ats_score)}%`, c: 'var(--teal)' },
                { l: 'Trust Score', v: `${Math.round(selectedCandidate.trust_score)}%`, c: 'var(--green)' },
                { l: 'Career DNA', v: `${Math.round(selectedCandidate.career_dna_score)}%`, c: 'var(--purple)' },
                { l: 'Interviews', v: selectedCandidate.interviews_done, c: 'var(--blue)' },
              ].map((s) => (
                <div key={s.l} style={{ background: 'var(--bg3)', borderRadius: 8, padding: '8px 12px' }}>
                  <div style={{ fontSize: 9, color: 'var(--t3)', letterSpacing: 0.5, marginBottom: 3 }}>{s.l}</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: s.c }}>{s.v}</div>
                </div>
              ))}
            </div>

            {/* Skill Tags */}
            {selectedCandidate.skill_tags && selectedCandidate.skill_tags.length > 0 && (
              <div style={{ marginBottom: 14 }}>
                <div
                  style={{
                    fontSize: 10,
                    color: 'var(--t3)',
                    letterSpacing: 1,
                    textTransform: 'uppercase',
                    marginBottom: 6,
                    fontWeight: 700,
                  }}
                >
                  Key Verified Skills
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {selectedCandidate.skill_tags.map((skill) => (
                    <span
                      key={skill}
                      style={{
                        fontSize: 10,
                        padding: '3px 8px',
                        borderRadius: 4,
                        background: 'var(--bg3)',
                        color: 'var(--t1)',
                        border: '1px solid var(--border)',
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Completed Missions */}
            {selectedCandidate.recent_missions && selectedCandidate.recent_missions.length > 0 && (
              <div style={{ marginBottom: 14 }}>
                <div
                  style={{
                    fontSize: 10,
                    color: 'var(--t3)',
                    letterSpacing: 1,
                    textTransform: 'uppercase',
                    marginBottom: 6,
                    fontWeight: 700,
                  }}
                >
                  Recent Completed Missions
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {selectedCandidate.recent_missions.map((m, idx) => (
                    <div
                      key={idx}
                      style={{
                        fontSize: 11,
                        background: 'var(--bg3)',
                        padding: '6px 10px',
                        borderRadius: 6,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <span style={{ color: 'var(--t1)' }}>🎯 {m.title}</span>
                      <span className="badge badge-green" style={{ fontSize: 9, padding: '1px 4px' }}>
                        {m.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Proof Vault items */}
            <div style={{ marginBottom: 14 }}>
              <div
                style={{
                  fontSize: 10,
                  color: 'var(--t3)',
                  letterSpacing: 1,
                  textTransform: 'uppercase',
                  marginBottom: 6,
                  fontWeight: 700,
                }}
              >
                Verified Proof Vault
              </div>
              {!selectedCandidate.vaultItems || selectedCandidate.vaultItems.length === 0 ? (
                <div style={{ fontSize: 11, color: 'var(--t3)', fontStyle: 'italic' }}>
                  No document proofs attached yet.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {selectedCandidate.vaultItems.map((item: any) => (
                    <div
                      key={item.id}
                      style={{
                        background: 'var(--bg3)',
                        border: '1px solid var(--border)',
                        borderRadius: 8,
                        padding: '8px 10px',
                        fontSize: 11,
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 600 }}>📄 {item.label || item.type}</span>
                        <span
                          className={`badge ${item.status === 'verified' ? 'badge-green' : 'badge-coral'}`}
                          style={{ fontSize: 9, padding: '1px 5px' }}
                        >
                          {item.status || 'pending'}
                        </span>
                      </div>
                      {item.fileUrl && (
                        <a
                          href={item.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            display: 'inline-block',
                            marginTop: 4,
                            color: 'var(--accent)',
                            textDecoration: 'underline',
                          }}
                        >
                          View Document
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 6-Stage Pipeline Status Bar */}
            <div style={{ marginBottom: 14 }}>
              <div
                style={{
                  fontSize: 10,
                  color: 'var(--t3)',
                  letterSpacing: 1,
                  textTransform: 'uppercase',
                  marginBottom: 6,
                  fontWeight: 700,
                }}
              >
                Hiring Stage Pipeline:{' '}
                <span style={{ color: 'var(--accent)' }}>{getCandidateStage(selectedCandidate.id)}</span>
              </div>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {PIPELINE_STAGES.map((stg) => {
                  const isActive = getCandidateStage(selectedCandidate.id) === stg;
                  return (
                    <button
                      key={stg}
                      onClick={() => handleUpdateStage(selectedCandidate.id, stg, selectedCandidate.display_name)}
                      style={{
                        fontSize: 9.5,
                        padding: '3px 8px',
                        borderRadius: 4,
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: isActive ? 800 : 500,
                        background: isActive ? 'var(--accent)' : 'var(--bg3)',
                        color: isActive ? 'var(--text)' : 'var(--t2)',
                      }}
                    >
                      {stg}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Recruiter Notes Drawer */}
            <div style={{ marginBottom: 14 }}>
              <div
                style={{
                  fontSize: 10,
                  color: 'var(--t3)',
                  letterSpacing: 1,
                  textTransform: 'uppercase',
                  marginBottom: 6,
                  fontWeight: 700,
                }}
              >
                Internal Recruiter Notes
              </div>
              <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                <input
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  placeholder="Add evaluation note..."
                  className="form-input"
                  style={{ flex: 1, fontSize: 11, padding: '6px 10px' }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddRecruiterNote(selectedCandidate.id);
                  }}
                />
                <button
                  onClick={() => handleAddRecruiterNote(selectedCandidate.id)}
                  className="btn-primary"
                  style={{ fontSize: 11, padding: '6px 10px' }}
                >
                  Save
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 120, overflowY: 'auto' }}>
                {(candidateNotesMap[selectedCandidate.id] || []).map((note, nIdx) => (
                  <div
                    key={nIdx}
                    style={{
                      background: 'var(--bg3)',
                      borderRadius: 6,
                      padding: '6px 8px',
                      fontSize: 10.5,
                      border: '1px solid var(--border)',
                    }}
                  >
                    <div style={{ color: 'var(--t1)' }}>{note.text}</div>
                    <div style={{ color: 'var(--t3)', fontSize: 9, marginTop: 2 }}>
                      {note.author} · {note.date}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {selectedCandidate.structured_resume && (
                <button
                  onClick={() =>
                    setViewResumeData({
                      name: selectedCandidate.display_name,
                      resume: selectedCandidate.structured_resume!,
                    })
                  }
                  className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center', background: 'var(--purple)', color: 'var(--text)' }}
                >
                  📄 View Full Resume
                </button>
              )}
              <button
                onClick={() => {
                  // Replaced Math.random with crypto.randomUUID()
                  const refId = `REF-INV-2026-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
                  logActivity('INTERVIEW_DISPATCH', {
                    candidateId: selectedCandidate.id,
                    candidateName: selectedCandidate.display_name,
                    refId,
                  });
                  triggerToast(`Sent formal interview invitation to ${selectedCandidate.display_name} (Ref #${refId})`, 'success');
                }}
                className="btn-primary"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, var(--success), var(--success-deep))',
                  color: 'var(--text)',
                }}
              >
                ✉️ Dispatch AI Interview Invitation
              </button>
              <button
                onClick={() => shortlist(selectedCandidate.id)}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                ★ Shortlist Candidate
              </button>
              <button
                onClick={() => sendContactRequest(selectedCandidate.id)}
                className="btn-ghost"
                style={{ width: '100%', justifyContent: 'center', background: 'var(--bg3)' }}
              >
                ✉ Send Contact Request
              </button>
              <button
                onClick={() => scheduleInterview(selectedCandidate.id)}
                className="btn-ghost"
                style={{ width: '100%', justifyContent: 'center', color: 'var(--teal)', background: 'var(--bg3)' }}
              >
                📅 Schedule Interview
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
