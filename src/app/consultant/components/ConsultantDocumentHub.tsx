'use client';

import React from 'react';

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
      {documentsSubMode === 'auditor' && (
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
              Submitted Files
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
                    background: 'rgba(var(--warning-rgb), 0.08)',
                    color: 'var(--amber)',
                    padding: '2px 6px',
                    borderRadius: 4,
                    fontWeight: 800,
                  }}
                >
                  Draft 2
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
                    background: 'rgba(var(--success-rgb), 0.08)',
                    color: 'var(--success)',
                    padding: '2px 6px',
                    borderRadius: 4,
                    fontWeight: 800,
                  }}
                >
                  Completed
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
                    background: 'rgba(var(--brand-rgb), 0.08)',
                    color: 'var(--accent)',
                    padding: '2px 6px',
                    borderRadius: 4,
                    fontWeight: 800,
                  }}
                >
                  Locked
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
                Click one of the AI Audit actions on the left to begin instant document auditing.
              </div>
            ) : (
              <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }} className="fade-in">
                {/* SOP Report */}
                {showSopAudit && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: 10 }}>
                      <strong style={{ color: 'var(--t1)', fontSize: 14.5 }}>SOP Quality Audit: {selectedDocStudent}</strong>
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
                        Overall Score: 87/100
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, padding: 10 }}>
                        <span style={{ fontSize: 9.5, color: 'var(--t3)', textTransform: 'uppercase' }}>Grammar Score</span>
                        <div style={{ fontSize: 16, fontWeight: 900, color: 'var(--success)', marginTop: 4 }}>92%</div>
                      </div>
                      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, padding: 10 }}>
                        <span style={{ fontSize: 9.5, color: 'var(--t3)', textTransform: 'uppercase' }}>Uniqueness Index</span>
                        <div style={{ fontSize: 16, fontWeight: 900, color: 'var(--accent)', marginTop: 4 }}>81%</div>
                      </div>
                      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, padding: 10 }}>
                        <span style={{ fontSize: 9.5, color: 'var(--t3)', textTransform: 'uppercase' }}>Research Alignment</span>
                        <div style={{ fontSize: 16, fontWeight: 900, color: 'var(--teal)', marginTop: 4 }}>78%</div>
                      </div>
                      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, padding: 10 }}>
                        <span style={{ fontSize: 9.5, color: 'var(--t3)', textTransform: 'uppercase' }}>Leadership Indication</span>
                        <div style={{ fontSize: 16, fontWeight: 900, color: 'var(--amber)', marginTop: 4 }}>91%</div>
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
                      <strong>AI Summary Feedback:</strong> The Statement of Purpose shows high grammatical consistency and a strong leadership narrative. However, the academic research section needs more alignment with specific faculty labs.
                    </div>
                  </div>
                )}

                {/* Resume Report */}
                {showResumeAudit && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: 10 }}>
                      <strong style={{ color: 'var(--t1)', fontSize: 14.5 }}>Resume ATS Scan: {selectedDocStudent}</strong>
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
                        ATS Score: 82/100
                      </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <span style={{ fontSize: 10.5, fontWeight: 900, color: 'var(--t3)', textTransform: 'uppercase' }}>
                        AI Improvement Checklist
                      </span>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, color: 'var(--t2)' }}>
                        <div>
                          • <strong>Metrics & Impact</strong>: Add metric indicators in project descriptions (e.g. <em>improved API speed by 20%</em>).
                        </div>
                        <div>
                          • <strong>Skills format</strong>: Separate language skills from frameworks in discrete tables.
                        </div>
                        <div>
                          • <strong>Keywords match</strong>: Add matching keywords for the AI/ML Software Engineering role.
                        </div>
                      </div>
                    </div>
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
                          background: 'rgba(var(--success-rgb), 0.08)',
                          color: 'var(--success)',
                          padding: '3px 8px',
                          borderRadius: 4,
                          fontWeight: 800,
                        }}
                      >
                        Tone: Excellent
                      </span>
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
                      <strong>Recommender Audit:</strong> Letter presents a highly detailed, professional endorsement of technical capabilities, confirming student's core roleplay strengths in university projects. Verification signatures match institutional registry.
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

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
                  setGeneratedSop(
                    `STATEMENT OF PURPOSE\n\nTo the Admissions Committee,\n\nI am writing to express my eager candidacy for the Graduate Master program at your prestigious institution. My ultimate career goal is to work as an ${
                      sopGoal || 'AI Research Specialist'
                    } driving advancements in decentralized software technologies.\n\nThroughout my undergraduate batch work, my primary project focus lay in designing distributed modules, notably: ${
                      sopProjects || 'building decentralized and scalable systems'
                    }. This academic project solidifies my hands-on knowledge in systems design. Furthermore, my research in ${
                      sopResearch || 'machine learning models'
                    } teaches me the rigors of formal validation. Guided by my cumulative achievements, including: ${
                      sopAchievements || 'academic honors'
                    }, I am confident that I can excel inside your premium labs.\n\nI look forward to contributing to your academic community.\n\nSincerely,\n${selectedDocStudent}`
                  );
                  toastObj.success(
                    'SOP Draft Generated',
                    'Athena AI successfully mapped your inputs into a tailored Statement of Purpose draft.'
                  );
                }, 1200);
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
                    toastObj.success(
                      'SOP Locked & Saved',
                      'The final SOP draft has been successfully saved to the candidate package vault.'
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
