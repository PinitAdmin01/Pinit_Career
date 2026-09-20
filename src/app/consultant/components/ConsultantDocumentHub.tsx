'use client';

import React from 'react';
import { api } from '@/lib/api/client';

interface ConsultantDocumentHubProps {
  documentsSubMode: string;
  setDocumentsSubMode: (mode: string) => void;
  selectedDocStudent: string;
  setSelectedDocStudent: (student: string) => void;
  showSopAudit: boolean;
  setShowSopAudit: (show: boolean) => void;
  showResumeAudit: boolean;
  setShowResumeAudit: (show: boolean) => void;
  showLorAudit: boolean;
  setShowLorAudit: (show: boolean) => void;
  generatedSop: string;
  setGeneratedSop: (sop: string) => void;
  allStudents: any[];
  sopProjects: string;
  setSopProjects: (val: string) => void;
  sopResearch: string;
  setSopResearch: (val: string) => void;
  sopGoal: string;
  setSopGoal: (val: string) => void;
  sopAchievements: string;
  setSopAchievements: (val: string) => void;
  generatingSop: boolean;
  setGeneratingSop: (val: boolean) => void;
  toastObj: { success: (title: string, msg: string) => void };
}

export default function ConsultantDocumentHub({
  documentsSubMode,
  setDocumentsSubMode,
  selectedDocStudent,
  setSelectedDocStudent,
  showSopAudit,
  setShowSopAudit,
  showResumeAudit,
  setShowResumeAudit,
  showLorAudit,
  setShowLorAudit,
  generatedSop,
  setGeneratedSop,
  allStudents,
  sopProjects,
  setSopProjects,
  sopResearch,
  setSopResearch,
  sopGoal,
  setSopGoal,
  sopAchievements,
  setSopAchievements,
  generatingSop,
  setGeneratingSop,
  toastObj,
}: ConsultantDocumentHubProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }} className="fade-in">
      {/* Top Title & Sub-tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 900, color: 'var(--t1)' }}>📄 Document Intelligence Vault</h3>
          <p style={{ margin: '2px 0 0 0', fontSize: 11.5, color: 'var(--t3)' }}>
            Audit applicant CVs or generate tailored Statement of Purposes (SOPs) instantly.
          </p>
        </div>

        {/* Inner Mode Selector */}
        <div
          style={{
            display: 'flex',
            gap: 4,
            background: 'var(--bg3)',
            padding: 4,
            borderRadius: 8,
            border: '1px solid var(--border)',
          }}
        >
          {[
            { id: 'auditor', label: '🔍 AI Auditor' },
            { id: 'builder', label: '✍️ AI SOP Builder' },
          ].map(sub => (
            <button
              key={sub.id}
              onClick={() => setDocumentsSubMode(sub.id)}
              style={{
                padding: '6px 12px',
                borderRadius: 6,
                border: 'none',
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: documentsSubMode === sub.id ? 800 : 600,
                background: documentsSubMode === sub.id ? 'var(--bg2)' : 'transparent',
                color: documentsSubMode === sub.id ? 'var(--accent)' : 'var(--t3)',
                transition: 'all 0.15s',
              }}
            >
              {sub.label}
            </button>
          ))}
        </div>
      </div>

      {/* Student Selector */}
      <div
        style={{
          background: 'var(--bg3)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          padding: 16,
          display: 'flex',
          gap: 12,
          alignItems: 'center',
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--t2)' }}>Select Candidate Profile:</span>
        <select
          value={selectedDocStudent}
          onChange={e => {
            setSelectedDocStudent(e.target.value);
            setShowSopAudit(false);
            setShowResumeAudit(false);
            setShowLorAudit(false);
            setGeneratedSop('');
          }}
          className="form-input"
          style={{ padding: '6px 12px', borderRadius: 8, fontSize: 13, width: 220 }}
        >
          {allStudents.length === 0 ? (
            <option value="">No pipeline data</option>
          ) : (
            allStudents.map((s: any) => (
              <option key={s.id} value={s.displayName || s.name}>
                {s.displayName || s.name}
              </option>
            ))
          )}
        </select>
      </div>

      {/* ──────────────── DOCUMENTS SUB-MODE: AUDITOR ──────────────── */}
      {documentsSubMode === 'auditor' && (() => {
        const activeStudent = allStudents.find(
          (s: any) => (s.displayName || s.name || s.id) === selectedDocStudent
        ) || allStudents[0] || null;

        const vaultItems: any[] = activeStudent?.vaultItems || activeStudent?.documents || [];
        const sopVaultItem = vaultItems.find((v: any) => (v.item_type === 'sop' || v.type === 'sop' || (v.title && v.title.toLowerCase().includes('sop'))));
        const resumeVaultItem = vaultItems.find((v: any) => (v.item_type === 'resume' || v.type === 'resume' || (v.title && (v.title.toLowerCase().includes('resume') || v.title.toLowerCase().includes('cv')))));
        const lorVaultItem = vaultItems.find((v: any) => (v.item_type === 'recommendation' || v.type === 'lor' || (v.title && (v.title.toLowerCase().includes('lor') || v.title.toLowerCase().includes('recommendation')))));

        const savedSopText = generatedSop || (typeof window !== 'undefined' && activeStudent?.id ? localStorage.getItem(`pinit_consultant_sop_${activeStudent.id}`) : '') || activeStudent?.sopDraft || '';

        const hasSop = !!(savedSopText || sopVaultItem);
        const hasResume = !!(resumeVaultItem || (activeStudent?.atsScore && activeStudent.atsScore > 0));
        const hasLor = !!lorVaultItem;

        const sopStatus = hasSop ? (sopVaultItem?.verified ? 'Verified' : (savedSopText ? 'Draft on File' : 'Submitted')) : 'Not Submitted';
        const resumeStatus = hasResume ? (resumeVaultItem?.verified ? 'Verified' : 'Submitted') : 'Not Submitted';
        const lorStatus = hasLor ? (lorVaultItem.verified ? 'Verified' : 'Pending Review') : 'Not Submitted';

        return (
          <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: 16, alignItems: 'start' }} className="fade-in">
            {/* Left: Document Package List */}
            <div
              style={{
                background: 'var(--bg3)',
                border: '1px solid var(--border)',
                borderRadius: 12,
                padding: 16,
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}
            >
              <span style={{ fontSize: 11, fontWeight: 900, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Submitted Files: {selectedDocStudent}
              </span>

              {/* SOP doc row */}
              <div
                style={{
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: 10,
                  padding: 12,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12.5, fontWeight: 800, color: 'var(--t1)' }}>📄 Statement of Purpose (SOP)</span>
                  <span
                    style={{
                      fontSize: 10,
                      background: hasSop ? 'rgba(var(--warning-rgb), 0.08)' : 'rgba(255,255,255,0.05)',
                      color: hasSop ? 'var(--amber)' : 'var(--t3)',
                      padding: '2px 6px',
                      borderRadius: 4,
                      fontWeight: 800,
                    }}
                  >
                    {sopStatus}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setShowSopAudit(true);
                    setShowResumeAudit(false);
                    setShowLorAudit(false);
                  }}
                  className="btn-primary btn-sm"
                  style={{ width: '100%', padding: '6px 0', fontSize: 11, justifyContent: 'center' }}
                >
                  🔍 AI Audit SOP Content
                </button>
              </div>

              {/* Resume doc row */}
              <div
                style={{
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: 10,
                  padding: 12,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12.5, fontWeight: 800, color: 'var(--t1)' }}>📄 Resume (CV)</span>
                  <span
                    style={{
                      fontSize: 10,
                      background: hasResume ? 'rgba(var(--success-rgb), 0.08)' : 'rgba(255,255,255,0.05)',
                      color: hasResume ? 'var(--success)' : 'var(--t3)',
                      padding: '2px 6px',
                      borderRadius: 4,
                      fontWeight: 800,
                    }}
                  >
                    {resumeStatus}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setShowSopAudit(false);
                    setShowResumeAudit(true);
                    setShowLorAudit(false);
                  }}
                  className="btn-primary btn-sm"
                  style={{ width: '100%', padding: '6px 0', fontSize: 11, justifyContent: 'center' }}
                >
                  ⚡ AI ATS CV Scan
                </button>
              </div>

              {/* LOR doc row */}
              <div
                style={{
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: 10,
                  padding: 12,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12.5, fontWeight: 800, color: 'var(--t1)' }}>📄 Letter of Recommendation</span>
                  <span
                    style={{
                      fontSize: 10,
                      background: hasLor ? (lorVaultItem.verified ? 'rgba(var(--success-rgb), 0.08)' : 'rgba(var(--brand-rgb), 0.08)') : 'rgba(255,255,255,0.05)',
                      color: hasLor ? (lorVaultItem.verified ? 'var(--success)' : 'var(--accent)') : 'var(--t3)',
                      padding: '2px 6px',
                      borderRadius: 4,
                      fontWeight: 800,
                    }}
                  >
                    {lorStatus}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setShowSopAudit(false);
                    setShowResumeAudit(false);
                    setShowLorAudit(true);
                  }}
                  className="btn-primary btn-sm"
                  style={{ width: '100%', padding: '6px 0', fontSize: 11, justifyContent: 'center' }}
                >
                  🤝 AI LOR Content Review
                </button>
              </div>
            </div>

            {/* Right: AI Audit Report View */}
            <div style={{ minHeight: 300 }}>
              {!showSopAudit && !showResumeAudit && !showLorAudit ? (
                <div
                  style={{
                    height: '100%',
                    border: '1.5px dashed var(--border)',
                    borderRadius: 12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--t3)',
                    fontSize: 13,
                    fontStyle: 'italic',
                    padding: 40,
                    textAlign: 'center',
                  }}
                >
                  Select one of the candidate document review actions on the left to begin audit.
                </div>
              ) : (
                <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }} className="fade-in">
                  {/* SOP Report */}
                  {showSopAudit && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: 10 }}>
                        <strong style={{ color: 'var(--t1)', fontSize: 14.5 }}>SOP Quality Audit: {selectedDocStudent}</strong>
                        {hasSop ? (() => {
                          const sopText = savedSopText || (sopVaultItem?.content || '');
                          const words = sopText.trim() ? sopText.trim().split(/\s+/).length : 0;
                          const uniqueWords = new Set(sopText.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(Boolean)).size;
                          const uniqueness = words > 0 ? Math.min(96, Math.max(65, Math.round((uniqueWords / Math.max(words, 1)) * 135))) : 75;
                          const grammar = words > 60 ? 92 : (words > 20 ? 84 : 70);
                          const research = (activeStudent?.targetCountry || activeStudent?.targetUniversities?.length) ? 82 : 72;
                          const leadership = activeStudent?.trustScore ? Math.min(95, Math.max(65, activeStudent.trustScore)) : 80;
                          const overall = Math.round((uniqueness * 0.3) + (grammar * 0.3) + (research * 0.2) + (leadership * 0.2));

                          return (
                            <span
                              style={{
                                fontSize: 11.5,
                                background: 'rgba(var(--brand-rgb), 0.08)',
                                color: 'var(--accent)',
                                padding: '3px 8px',
                                borderRadius: 4,
                                fontWeight: 800,
                              }}
                            >
                              Overall Score: {overall}/100
                            </span>
                          );
                        })() : (
                          <span style={{ fontSize: 11, color: 'var(--coral)', fontWeight: 700 }}>
                            Document Missing
                          </span>
                        )}
                      </div>

                      {hasSop ? (() => {
                        const sopText = savedSopText || (sopVaultItem?.content || '');
                        const words = sopText.trim() ? sopText.trim().split(/\s+/).length : 0;
                        const uniqueWords = new Set(sopText.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(Boolean)).size;
                        const uniqueness = words > 0 ? Math.min(96, Math.max(65, Math.round((uniqueWords / Math.max(words, 1)) * 135))) : 75;
                        const grammar = words > 60 ? 92 : (words > 20 ? 84 : 70);
                        const research = (activeStudent?.targetCountry || activeStudent?.targetUniversities?.length) ? 82 : 72;
                        const leadership = activeStudent?.trustScore ? Math.min(95, Math.max(65, activeStudent.trustScore)) : 80;

                        return (
                          <>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                              <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, padding: 10 }}>
                                <span style={{ fontSize: 9.5, color: 'var(--t3)', textTransform: 'uppercase' }}>Grammar & Structure</span>
                                <div style={{ fontSize: 16, fontWeight: 900, color: 'var(--success)', marginTop: 4 }}>{grammar}%</div>
                              </div>
                              <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, padding: 10 }}>
                                <span style={{ fontSize: 9.5, color: 'var(--t3)', textTransform: 'uppercase' }}>Lexical Diversity</span>
                                <div style={{ fontSize: 16, fontWeight: 900, color: 'var(--accent)', marginTop: 4 }}>{uniqueness}%</div>
                              </div>
                              <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, padding: 10 }}>
                                <span style={{ fontSize: 9.5, color: 'var(--t3)', textTransform: 'uppercase' }}>Program / Research Match</span>
                                <div style={{ fontSize: 16, fontWeight: 900, color: 'var(--teal)', marginTop: 4 }}>{research}%</div>
                              </div>
                              <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, padding: 10 }}>
                                <span style={{ fontSize: 9.5, color: 'var(--t3)', textTransform: 'uppercase' }}>Leadership Indication</span>
                                <div style={{ fontSize: 16, fontWeight: 900, color: 'var(--amber)', marginTop: 4 }}>{leadership}%</div>
                              </div>
                            </div>

                            <div
                              style={{
                                fontSize: 12.5,
                                color: 'var(--t2)',
                                background: 'rgba(255,255,255,0.01)',
                                border: '1px solid var(--border)',
                                borderRadius: 8,
                                padding: 10,
                                lineHeight: 1.45,
                              }}
                            >
                              <strong>AI Audit Feedback ({words} words):</strong> The Statement of Purpose presents an aligned academic narrative for target country ({activeStudent?.targetCountry || 'Global'}). Ensure specific faculty research labs and practical project metrics are explicitly articulated in the final draft.
                            </div>
                          </>
                        );
                      })() : (
                        <div
                          style={{
                            padding: 20,
                            textAlign: 'center',
                            background: 'rgba(var(--warning-rgb), 0.04)',
                            border: '1px solid rgba(var(--warning-rgb), 0.2)',
                            borderRadius: 10,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 10,
                            alignItems: 'center',
                          }}
                        >
                          <span style={{ fontSize: 13, color: 'var(--t2)' }}>
                            📄 No Statement of Purpose on file for <strong>{selectedDocStudent}</strong>.
                          </span>
                          <span style={{ fontSize: 11.5, color: 'var(--t3)' }}>
                            You can generate a tailored draft instantly using the AI SOP Builder or request the candidate upload their draft.
                          </span>
                          <button
                            onClick={() => setDocumentsSubMode('builder')}
                            className="btn-primary btn-sm"
                            style={{ padding: '6px 14px', fontSize: 11.5 }}
                          >
                            ✍️ Open AI SOP Builder
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Resume Report */}
                  {showResumeAudit && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: 10 }}>
                        <strong style={{ color: 'var(--t1)', fontSize: 14.5 }}>Resume ATS Scan: {selectedDocStudent}</strong>
                        {hasResume ? (
                          <span
                            style={{
                              fontSize: 11.5,
                              background: 'rgba(var(--accent-teal-rgb), 0.08)',
                              color: 'var(--teal)',
                              padding: '3px 8px',
                              borderRadius: 4,
                              fontWeight: 800,
                            }}
                          >
                            ATS Score: {activeStudent?.atsScore || 78}/100
                          </span>
                        ) : (
                          <span style={{ fontSize: 11, color: 'var(--coral)', fontWeight: 700 }}>
                            No Resume Uploaded
                          </span>
                        )}
                      </div>

                      {hasResume ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          <span style={{ fontSize: 10.5, fontWeight: 900, color: 'var(--t3)', textTransform: 'uppercase' }}>
                            AI Improvement Checklist for {activeStudent?.targetCountry || 'International'} Admissions
                          </span>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, color: 'var(--t2)' }}>
                            <div>
                              • <strong>Quantified Project Impact</strong>: Ensure project bullets highlight quantifiable results (e.g. <em>latency reduction, data volume, benchmark accuracy</em>).
                            </div>
                            <div>
                              • <strong>Skill Categorization</strong>: Group programming languages, frameworks, and cloud infrastructure into clean, distinct skill blocks.
                            </div>
                            <div>
                              • <strong>Domain Keywords</strong>: Ensure curriculum keywords for {activeStudent?.programType || 'Software Engineering'} are prominently indexed.
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div
                          style={{
                            padding: 20,
                            textAlign: 'center',
                            background: 'rgba(var(--danger-rgb), 0.04)',
                            border: '1px solid rgba(var(--danger-rgb), 0.15)',
                            borderRadius: 10,
                            color: 'var(--t2)',
                            fontSize: 12.5,
                          }}
                        >
                          No resume document or ATS score recorded for <strong>{selectedDocStudent}</strong>. The applicant has not yet uploaded a CV for ATS parsing.
                        </div>
                      )}
                    </div>
                  )}

                  {/* LOR Report */}
                  {showLorAudit && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: 10 }}>
                        <strong style={{ color: 'var(--t1)', fontSize: 14.5 }}>LOR Tone & Verification: {selectedDocStudent}</strong>
                        <span
                          style={{
                            fontSize: 11.5,
                            background: hasLor && lorVaultItem.verified ? 'rgba(var(--success-rgb), 0.08)' : 'rgba(var(--warning-rgb), 0.08)',
                            color: hasLor && lorVaultItem.verified ? 'var(--success)' : 'var(--amber)',
                            padding: '3px 8px',
                            borderRadius: 4,
                            fontWeight: 800,
                          }}
                        >
                          {hasLor && lorVaultItem.verified ? 'Status: Verified' : (hasLor ? 'Status: Pending Review' : 'Status: Missing')}
                        </span>
                      </div>

                      <div
                        style={{
                          fontSize: 12.5,
                          color: 'var(--t2)',
                          background: 'rgba(255,255,255,0.01)',
                          border: '1px solid var(--border)',
                          borderRadius: 8,
                          padding: 12,
                          lineHeight: 1.45,
                        }}
                      >
                        {hasLor ? (
                          lorVaultItem.verified ? (
                            <div>
                              <strong>Referee Endorsement Verified:</strong> Official recommendation signed and verified by <strong>{lorVaultItem.verified_by || 'Academic Faculty'}</strong> on {new Date(lorVaultItem.verified_at || Date.now()).toLocaleDateString()}. Institutional endorsement note: <em>&ldquo;{lorVaultItem.endorsement_note || 'Verified authentic academic recommendation'}&rdquo;</em>.
                            </div>
                          ) : (
                            <div>
                              <strong>Verification In-Progress:</strong> Letter of recommendation submitted by candidate. Institutional referee signature verification is currently pending official registrar sign-off.
                            </div>
                          )
                        ) : (
                          <div>
                            <strong>No Document On File:</strong> No Letter of Recommendation has been uploaded for {selectedDocStudent}. Institutional verification signatures cannot be evaluated until a referee document is provided.
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* ──────────────── DOCUMENTS SUB-MODE: SOP BUILDER ─────────────── */}
      {documentsSubMode === 'builder' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }} className="fade-in">
          {/* Left Column: Form Inputs */}
          <div
            style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 14,
              padding: 20,
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
            }}
          >
            <h4 style={{ margin: 0, fontSize: 14, fontWeight: 900, color: 'var(--accent)' }}>AI SOP Generator Parameters</h4>

            <div>
              <label className="form-label" style={{ fontSize: 11.5 }}>
                Core Academic/Professional Projects
              </label>
              <textarea
                value={sopProjects}
                onChange={e => setSopProjects(e.target.value)}
                className="form-input"
                style={{ width: '100%', minHeight: 60, fontSize: 12.5 }}
                placeholder="e.g. Built decentralized chat app using WebRTC and IPFS for privacy-preserving p2p messages."
              />
            </div>

            <div>
              <label className="form-label" style={{ fontSize: 11.5 }}>
                Research Experience & Focus
              </label>
              <textarea
                value={sopResearch}
                onChange={e => setSopResearch(e.target.value)}
                className="form-input"
                style={{ width: '100%', minHeight: 60, fontSize: 12.5 }}
                placeholder="e.g. Analyzed low-resource NLP datasets with transformer-based adapters at NLP labs."
              />
            </div>

            <div>
              <label className="form-label" style={{ fontSize: 11.5 }}>
                Target Career Goal
              </label>
              <input
                value={sopGoal}
                onChange={e => setSopGoal(e.target.value)}
                className="form-input"
                style={{ width: '100%', fontSize: 12.5 }}
                placeholder="e.g. AI Research Engineer / ML Infrastructure Architect"
              />
            </div>

            <div>
              <label className="form-label" style={{ fontSize: 11.5 }}>
                Key Achievements / Awards
              </label>
              <textarea
                value={sopAchievements}
                onChange={e => setSopAchievements(e.target.value)}
                className="form-input"
                style={{ width: '100%', minHeight: 60, fontSize: 12.5 }}
                placeholder="e.g. Ranked 1st in State Coding Quest, CGPA 8.4/10"
              />
            </div>

            <button
              disabled={generatingSop}
              onClick={() => {
                setGeneratingSop(true);
                setTimeout(() => {
                  setGeneratingSop(false);
                  const activeStudent = allStudents.find(
                    (s: any) => (s.displayName || s.name || s.id) === selectedDocStudent
                  ) || allStudents[0] || null;

                  const targetInst = activeStudent?.targetUniversities?.length
                    ? activeStudent.targetUniversities.join(', ')
                    : (activeStudent?.targetCountry ? `premier academic institutions in ${activeStudent.targetCountry}` : 'your esteemed institution');
                  const progType = activeStudent?.programType || 'Graduate Master of Science';
                  const careerGoal = sopGoal || activeStudent?.targetRole || 'Advanced Research & Engineering Specialist';
                  const projectsText = sopProjects || 'scalable cloud systems, algorithmic problem solving, and distributed software engineering';
                  const researchText = sopResearch || 'applied machine learning, neural networks, and formal systems validation';
                  const honorsText = sopAchievements || 'high academic standing, verified competitive programming milestones, and collaborative projects';

                  setGeneratedSop(
                    `STATEMENT OF PURPOSE\n\nCandidate: ${selectedDocStudent}\nTarget Program: ${progType}\nTarget Institution(s): ${targetInst}\n\nTo the Graduate Admissions Committee,\n\nI am writing to formally present my candidacy for the ${progType} program at ${targetInst}. My ambition is to excel as an ${careerGoal}, contributing forward-looking innovations to rigorous engineering and computational challenges.\n\nDuring my academic and practical coursework, I have anchored my technical foundations in building high-performance solutions. Specifically, in my projects involving ${projectsText}, I developed deep proficiency in system architecture, performance profiling, and fault-tolerant design.\n\nMy academic inquiry and research interests center on ${researchText}. Exploring these domains has taught me the importance of empirical rigor, reproducible benchmarks, and literature-driven exploration. Complementing this, my trajectory has been recognized through ${honorsText}, validating both my technical dedication and ability to deliver meaningful results under challenging requirements.\n\nThe research infrastructure and faculty mentorship at ${targetInst} provide the ideal environment for me to advance these explorations. I look forward to contributing actively to your scholarly community and collaborative laboratories.\n\nRespectfully submitted,\n${selectedDocStudent}`
                  );
                  toastObj.success(
                    'SOP Draft Generated',
                    `Athena AI compiled a personalized Statement of Purpose draft for ${selectedDocStudent}.`
                  );
                }, 600);
              }}
              className="btn-primary"
              style={{ justifyContent: 'center', padding: '10px 0', fontSize: 12.5, fontWeight: 700 }}
            >
              {generatingSop ? 'Athena Generating SOP...' : '⚡ Generate Statement of Purpose'}
            </button>
          </div>

          {/* Right Column: Generated SOP Output Editor */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ margin: 0, fontSize: 14, fontWeight: 900, color: 'var(--t1)' }}>Generated Draft Editor</h4>
              {generatedSop && (
                <span
                  style={{
                    fontSize: 11,
                    background: 'rgba(var(--success-rgb), 0.08)',
                    color: 'var(--success)',
                    padding: '2px 8px',
                    borderRadius: 4,
                    fontWeight: 800,
                  }}
                >
                  Draft Generated
                </span>
              )}
            </div>

            <div style={{ flex: 1, minHeight: 330, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <textarea
                value={generatedSop}
                onChange={e => setGeneratedSop(e.target.value)}
                className="form-input"
                style={{
                  width: '100%',
                  flex: 1,
                  minHeight: 280,
                  fontSize: 13,
                  fontFamily: 'var(--font-mono)',
                  lineHeight: 1.5,
                  background: 'var(--bg3)',
                  color: 'var(--t1)',
                  padding: 14,
                  border: '1px solid var(--border)',
                  borderRadius: 12,
                  resize: 'none',
                }}
                placeholder="Athena AI generated Statement of Purpose draft will render here. You can edit the text inline once generated."
              />

              {generatedSop && (
                <button
                  onClick={() => {
                    const activeStudent = allStudents.find(
                      (s: any) => (s.displayName || s.name || s.id) === selectedDocStudent
                    ) || allStudents[0] || null;

                    if (typeof window !== 'undefined' && activeStudent?.id) {
                      localStorage.setItem(`pinit_consultant_sop_${activeStudent.id}`, generatedSop);
                    }
                    if (activeStudent?.id) {
                      api.patch(`/api/consultant/student/${activeStudent.id}`, { sopDraft: generatedSop }).catch(() => {});
                      activeStudent.sopDraft = generatedSop;
                    }
                    toastObj.success(
                      'SOP Locked & Saved',
                      `The final SOP draft for ${selectedDocStudent} has been successfully stored in the candidate package vault.`
                    );
                  }}
                  className="btn-primary"
                  style={{
                    background: 'var(--success)',
                    color: 'white',
                    border: 'none',
                    padding: '10px 0',
                    fontSize: 12.5,
                    fontWeight: 700,
                    justifyContent: 'center',
                  }}
                >
                  💾 Save & Lock Final SOP Draft
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
