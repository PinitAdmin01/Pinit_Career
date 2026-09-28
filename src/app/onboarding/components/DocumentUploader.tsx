'use client';

import React, { useRef } from 'react';
import {
  VaultCategory,
  VaultDocumentSlot,
  IdentityAuditReport,
  LiveQTCalibration
} from '@/lib/ats/documentAuditEngine';

export interface DocumentUploaderProps {
  isOpen: boolean;
  onClose: () => void;
  isExpress?: boolean;
  onGoBackFromExpress?: () => void;
  vaultSlots: VaultDocumentSlot[];
  vaultUploading: boolean;
  activeVaultTab: 'resume' | 'academic' | 'achievements' | 'certifications' | 'analytics';
  setActiveVaultTab: (tab: 'resume' | 'academic' | 'achievements' | 'certifications' | 'analytics') => void;
  isDraggingOverDropzone: boolean;
  setIsDraggingOverDropzone: (val: boolean) => void;
  isDraggingOverResume: boolean;
  setIsDraggingOverResume: (val: boolean) => void;
  isVerifyingAll: boolean;
  customAnchorName: string | null;
  setCustomAnchorName: (name: string | null) => void;
  primaryCandidateName: string;
  identityAuditReport: IdentityAuditReport;
  liveQTMetrics: LiveQTCalibration;
  handleUploadToSlot: (file: File, targetCategory: VaultCategory) => Promise<void>;
  handleBatchAutoSortUpload: (files: FileList | File[]) => Promise<void>;
  handleVerifySingleDocument: (docId: string) => Promise<void>;
  handleVerifyAllDocuments: () => Promise<void>;
  handleDeleteSlot: (docId: string) => Promise<void>;
  formatVaultDate: (timestamp?: number) => string;
  // Express form props (if isExpress is true)
  trajectory?: string;
  setTrajectory?: (t: any) => void;
  college?: string;
  setCollege?: (c: string) => void;
  degree?: string;
  setDegree?: (d: string) => void;
  uploadedFile?: File | null;
  dragOver?: boolean;
  handleDragOver?: (e: React.DragEvent) => void;
  handleDragLeave?: (e: React.DragEvent) => void;
  handleDrop?: (e: React.DragEvent) => void;
  handleFileSelect?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleExpressSubmit?: (e: React.FormEvent) => Promise<void>;
}

export default function DocumentUploader(props: DocumentUploaderProps) {
  const {
    isOpen,
    onClose,
    isExpress,
    onGoBackFromExpress,
    vaultSlots,
    vaultUploading,
    activeVaultTab,
    setActiveVaultTab,
    isDraggingOverDropzone,
    setIsDraggingOverDropzone,
    isDraggingOverResume,
    setIsDraggingOverResume,
    isVerifyingAll,
    customAnchorName,
    setCustomAnchorName,
    primaryCandidateName,
    identityAuditReport,
    liveQTMetrics,
    handleUploadToSlot,
    handleBatchAutoSortUpload,
    handleVerifySingleDocument,
    handleVerifyAllDocuments,
    handleDeleteSlot,
    formatVaultDate,
    trajectory,
    setTrajectory,
    college,
    setCollege,
    degree,
    setDegree,
    uploadedFile,
    dragOver,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileSelect,
    handleExpressSubmit
  } = props;

  const fileInputRef = useRef<HTMLInputElement>(null);

  // If in express form mode, render the express form
  if (isExpress) {
    return (
      <div style={{ flex: 1, padding: 28, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        <button
          type="button"
          onClick={onGoBackFromExpress}
          style={{ background: 'transparent', border: 'none', color: 'var(--t3)', cursor: 'pointer', fontSize: 12, alignSelf: 'flex-start', marginBottom: 14 }}
        >
          ← Back
        </button>

        <div style={{ marginBottom: 16 }}>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: 'var(--t1)', marginBottom: 6, letterSpacing: '-0.5px' }}>
            Quick start
          </h2>
          <p style={{ fontSize: 13, color: 'var(--t3)' }}>
            Pick what you want to do, add your college, and upload your resume.
          </p>
        </div>

        {handleExpressSubmit && (
          <form onSubmit={handleExpressSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Trajectory Selector */}
            <div>
              <label style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--t3)', display: 'block', marginBottom: 6 }}>What do you want to do?</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 8 }}>
                {[
                  { id: 'react_frontend', label: 'Making websites', emoji: '🌐' },
                  { id: 'java_sde', label: 'Building app systems', emoji: '⚙️' },
                  { id: 'financial_analyst', label: 'Money and finance', emoji: '📊' },
                  { id: 'business_analyst', label: 'Business and products', emoji: '📈' }
                ].map(t => (
                  <div
                    key={t.id}
                    onClick={() => setTrajectory && setTrajectory(t.id as any)}
                    style={{
                      padding: 10,
                      borderRadius: 10,
                      border: `1.5px solid ${trajectory === t.id ? 'var(--accent)' : 'rgba(255,255,255,0.04)'}`,
                      background: trajectory === t.id ? 'rgba(var(--brand-rgb), 0.08)' : 'rgba(255,255,255,0.01)',
                      cursor: 'pointer',
                      textAlign: 'center',
                      fontSize: 13,
                      fontWeight: 700,
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ fontSize: 20, marginBottom: 4 }}>{t.emoji}</div>
                    <div>{t.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* College Info Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 12 }}>
              <div>
                <label style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--t3)', display: 'block', marginBottom: 6 }}>Your college</label>
                <input
                  type="text"
                  placeholder="e.g. Apex Institute"
                  value={college || ''}
                  onChange={(e) => setCollege && setCollege(e.target.value)}
                  style={{ width: '100%', height: 38, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, padding: '0 12px', fontSize: 14, color: 'var(--t1)', outline: 'none' }}
                />
              </div>
              <div>
                <label style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--t3)', display: 'block', marginBottom: 6 }}>What you study</label>
                <input
                  type="text"
                  placeholder="e.g. B.Com"
                  value={degree || ''}
                  onChange={(e) => setDegree && setDegree(e.target.value)}
                  style={{ width: '100%', height: 38, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, padding: '0 12px', fontSize: 14, color: 'var(--t1)', outline: 'none' }}
                />
              </div>
            </div>

            {/* Drag and Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              style={{
                height: 110,
                borderRadius: 12,
                border: `1.5px dashed ${dragOver ? 'var(--accent)' : uploadedFile ? 'var(--teal)' : 'rgba(255,255,255,0.1)'}`,
                background: dragOver ? 'rgba(var(--brand-rgb), 0.04)' : uploadedFile ? 'rgba(var(--accent-teal-rgb), 0.02)' : 'rgba(255,255,255,0.01)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="application/pdf"
                style={{ display: 'none' }}
              />

              {uploadedFile ? (
                <>
                  <div style={{ fontSize: 26.5, marginBottom: 4 }}>📄</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--teal)' }}>{uploadedFile.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--t2)', marginTop: 2 }}>Tap to change it</div>
                </>
              ) : (
                <>
                  <div style={{ fontSize: 26.5, marginBottom: 4 }}>📥</div>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>Add your resume (PDF)</div>
                  <div style={{ fontSize: 11, color: 'var(--t2)', marginTop: 2 }}>Drop it here or tap to choose</div>
                </>
              )}
            </div>

            <button
              type="submit"
              disabled={!college || !degree || !uploadedFile}
              style={{
                width: '100%',
                height: 42,
                background: 'linear-gradient(135deg, var(--accent) 0%, var(--purple) 100%)',
                border: 'none',
                borderRadius: 10,
                color: 'var(--card)',
                fontWeight: 700,
                cursor: 'pointer',
                opacity: (!college || !degree || !uploadedFile) ? 0.5 : 1,
                transition: 'all 0.15s ease',
                marginTop: 6
              }}
            >
              Start my plan
            </button>
          </form>
        )}
      </div>
    );
  }

  // If Vault modal is not open, render nothing
  if (!isOpen) return null;

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); e.dataTransfer.dropEffect = 'copy'; }}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
          handleBatchAutoSortUpload(e.dataTransfer.files);
        }
      }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        background: 'rgba(2, 6, 19, 0.82)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px 16px'
      }}
    >
      <div style={{
        background: 'radial-gradient(130% 130% at 50% 0%, #0d1322 0%, #080c16 55%, #030712 100%)',
        border: '1px solid rgba(56, 189, 248, 0.22)',
        borderRadius: 24,
        padding: '22px 28px',
        maxWidth: 1180,
        width: '96vw',
        height: '86vh',
        maxHeight: '86vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 32px 80px -20px rgba(0, 0, 0, 0.95), 0 0 0 1px rgba(255, 255, 255, 0.05), 0 0 60px rgba(var(--brand-rgb), 0.15)',
        textAlign: 'left',
        color: 'var(--text)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: 14, flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: 'linear-gradient(135deg, rgba(var(--brand-rgb),0.3) 0%, rgba(var(--accent-teal-rgb),0.2) 100%)',
              border: '1px solid rgba(var(--brand-rgb),0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
              boxShadow: '0 0 20px rgba(var(--brand-rgb),0.25)'
            }}>
              📁
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <h3 style={{ fontSize: 21, fontWeight: 900, margin: 0, color: '#f8fafc', letterSpacing: '-0.02em' }}>
                  Your documents
                </h3>
                <span style={{
                  fontSize: 11,
                  background: 'rgba(56, 189, 248, 0.15)',
                  color: '#38bdf8',
                  border: '1px solid rgba(56, 189, 248, 0.35)',
                  padding: '2px 9px',
                  borderRadius: 100,
                  fontWeight: 800,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#38bdf8', boxShadow: '0 0 6px #38bdf8' }} />
                  Private
                </span>
              </div>
              <p style={{ fontSize: 12.5, color: '#94a3b8', margin: '3px 0 0', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>Drop your resume, marks cards or certificates here</span>
                <span style={{ color: '#475569' }}>•</span>
                <span style={{ color: '#38bdf8' }}>We sort and check them for you</span>
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              type="button"
              onClick={handleVerifyAllDocuments}
              disabled={isVerifyingAll || vaultSlots.length === 0}
              style={{
                background: 'linear-gradient(135deg, rgba(var(--brand-rgb), 0.25) 0%, rgba(var(--accent-teal-rgb), 0.25) 100%)',
                border: '1px solid rgba(var(--brand-rgb), 0.5)',
                borderRadius: 10,
                color: 'var(--text)',
                padding: '7px 14px',
                fontSize: 12.5,
                fontWeight: 800,
                cursor: (isVerifyingAll || vaultSlots.length === 0) ? 'not-allowed' : 'pointer',
                opacity: (isVerifyingAll || vaultSlots.length === 0) ? 0.5 : 1,
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              {isVerifyingAll ? '🔄 Checking…' : '✓ Check all'}
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 10,
                color: '#94a3b8',
                padding: '6px 14px',
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              ✕ Close
            </button>
          </div>
        </div>

        {/* Candidate Identity Anchor Banner */}
        <div style={{
          background: identityAuditReport.overallStatus === 'SENTINEL_CLEAN'
            ? 'linear-gradient(90deg, rgba(16, 185, 129, 0.12) 0%, rgba(56, 189, 248, 0.06) 100%)'
            : (identityAuditReport.overallStatus === 'IDENTITY_MISMATCH_FLAGGED' || identityAuditReport.overallStatus === 'REVIEW_REQUIRED')
            ? 'linear-gradient(90deg, rgba(239, 68, 68, 0.15) 0%, rgba(245, 158, 11, 0.08) 100%)'
            : identityAuditReport.overallStatus === 'UNREADABLE_DOCUMENTS_REJECTED'
            ? 'linear-gradient(90deg, rgba(239, 68, 68, 0.18) 0%, rgba(185, 28, 28, 0.10) 100%)'
            : identityAuditReport.overallStatus === 'PROVISIONAL_PENDING'
            ? 'linear-gradient(90deg, rgba(245, 158, 11, 0.12) 0%, rgba(56, 189, 248, 0.06) 100%)'
            : 'linear-gradient(90deg, rgba(56, 189, 248, 0.08) 0%, rgba(99, 102, 241, 0.05) 100%)',
          border: `1px solid ${
            identityAuditReport.overallStatus === 'SENTINEL_CLEAN' ? 'rgba(16, 185, 129, 0.35)' :
            (identityAuditReport.overallStatus === 'IDENTITY_MISMATCH_FLAGGED' || identityAuditReport.overallStatus === 'REVIEW_REQUIRED') ? 'rgba(239, 68, 68, 0.45)' :
            identityAuditReport.overallStatus === 'UNREADABLE_DOCUMENTS_REJECTED' ? 'rgba(239, 68, 68, 0.55)' :
            identityAuditReport.overallStatus === 'PROVISIONAL_PENDING' ? 'rgba(245, 158, 11, 0.35)' :
            'rgba(56, 189, 248, 0.25)'
          }`,
          borderRadius: 14,
          padding: '10px 16px',
          marginBottom: 12,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 22 }}>
              {identityAuditReport.overallStatus === 'SENTINEL_CLEAN' ? '🛡️' :
               (identityAuditReport.overallStatus === 'IDENTITY_MISMATCH_FLAGGED' || identityAuditReport.overallStatus === 'REVIEW_REQUIRED') ? '⚠️' :
               identityAuditReport.overallStatus === 'UNREADABLE_DOCUMENTS_REJECTED' ? '❌' :
               identityAuditReport.overallStatus === 'PROVISIONAL_PENDING' ? '📄' : '👤'}
            </span>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 800, color: '#94a3b8' }}>
                  Your name:
                </span>
                <span style={{ fontSize: 14.5, fontWeight: 900, color: '#f8fafc' }}>
                  {primaryCandidateName}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const promptName = window.prompt('Your full name, as it is on your documents:', primaryCandidateName);
                    if (promptName && promptName.trim().length > 0) {
                      setCustomAnchorName(promptName.trim());
                    }
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#38bdf8',
                    fontSize: 12,
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  (Edit)
                </button>
              </div>
              <div style={{ fontSize: 12, color: '#cbd5e1', marginTop: 1 }}>
                {identityAuditReport.overallStatus === 'IDENTITY_MISMATCH_FLAGGED' || identityAuditReport.overallStatus === 'REVIEW_REQUIRED'
                  ? `${identityAuditReport.mismatchCount} document(s) show a different name. Please check them.`
                  : identityAuditReport.overallStatus === 'UNREADABLE_DOCUMENTS_REJECTED'
                  ? 'We could not read these documents. Please upload clearer copies.'
                  : identityAuditReport.overallStatus === 'PROVISIONAL_PENDING'
                  ? '1 document added. Add your marks cards to confirm it.'
                  : identityAuditReport.overallStatus === 'SENTINEL_CLEAN'
                  ? `All ${identityAuditReport.totalDocuments} document(s) match your name.`
                  : 'Upload your documents so we can confirm your name.'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
                Checked
              </div>
              <div style={{
                fontSize: 17.5,
                fontWeight: 900,
                color: (identityAuditReport.trustScore || 0) >= 80 ? '#34d399' : (identityAuditReport.trustScore || 0) >= 50 ? '#fbbf24' : '#f87171'
              }}>
                {identityAuditReport.trustScore ?? 0}%
              </div>
            </div>
          </div>
        </div>

        {/* Vault Tabs */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 12, borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 8, flexShrink: 0 }}>
          {[
            { id: 'resume', label: '📄 Resume', count: vaultSlots.filter(s => s.category === 'resume').length },
            { id: 'academic', label: '🎓 Marks cards', count: vaultSlots.filter(s => s.category !== 'resume' && s.category !== 'certification' && s.category !== 'achievement').length },
            { id: 'certifications', label: '📜 Certificates', count: vaultSlots.filter(s => s.category === 'certification').length },
            { id: 'achievements', label: '🏆 Awards', count: vaultSlots.filter(s => s.category === 'achievement').length },
            { id: 'analytics', label: '📊 Summary', count: null }
          ].map(tab => {
            const isActive = activeVaultTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveVaultTab(tab.id as any)}
                style={{
                  background: isActive ? 'rgba(56, 189, 248, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                  border: `1px solid ${isActive ? 'rgba(56, 189, 248, 0.4)' : 'rgba(255, 255, 255, 0.05)'}`,
                  borderRadius: 8,
                  color: isActive ? '#38bdf8' : '#94a3b8',
                  padding: '6px 14px',
                  fontSize: 12.5,
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  transition: 'all 0.15s ease'
                }}
              >
                <span>{tab.label}</span>
                {tab.count !== null && (
                  <span style={{
                    fontSize: 11,
                    background: isActive ? '#38bdf8' : 'rgba(255, 255, 255, 0.08)',
                    color: isActive ? '#030712' : '#cbd5e1',
                    borderRadius: 100,
                    padding: '1px 6px',
                    fontWeight: 900
                  }}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Body */}
        <div style={{ flex: 1, overflowY: 'auto', paddingRight: 4 }}>
          {activeVaultTab === 'resume' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Resume Slot Card */}
              {(() => {
                const resumeDoc = vaultSlots.find(s => s.category === 'resume');
                return (
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: 16,
                    padding: 20
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 26.5 }}>📄</span>
                        <div>
                          <h4 style={{ fontSize: 16.5, fontWeight: 800, margin: 0, color: '#f8fafc' }}>
                            Your resume
                          </h4>
                          <span style={{ fontSize: 12, color: '#94a3b8' }}>
                            We use it to confirm your name and find your skills
                          </span>
                        </div>
                      </div>
                      {resumeDoc && (
                        <span style={{
                          fontSize: 12,
                          fontWeight: 800,
                          padding: '3px 10px',
                          borderRadius: 100,
                          background: resumeDoc.verificationStatus === 'verified' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                          color: resumeDoc.verificationStatus === 'verified' ? '#34d399' : '#fbbf24',
                          border: `1px solid ${resumeDoc.verificationStatus === 'verified' ? 'rgba(16, 185, 129, 0.4)' : 'rgba(245, 158, 11, 0.4)'}`
                        }}>
                          {resumeDoc.verificationStatus === 'verified' ? '✓ Checked' : '⚠️ Not checked yet'}
                        </span>
                      )}
                    </div>

                    {resumeDoc ? (
                      <div style={{
                        background: 'rgba(0, 0, 0, 0.3)',
                        borderRadius: 12,
                        padding: 14,
                        border: '1px solid rgba(255, 255, 255, 0.04)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <div>
                          <div style={{ fontSize: 14.5, fontWeight: 700, color: '#f1f5f9' }}>{resumeDoc.title}</div>
                          <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 3 }}>
                            Added: {formatVaultDate(resumeDoc.uploadedAt)} • Name found: <strong style={{ color: '#38bdf8' }}>{resumeDoc.candidateName}</strong>
                          </div>
                          {resumeDoc.skills && resumeDoc.skills.length > 0 && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 8 }}>
                              {resumeDoc.skills.slice(0, 8).map(sk => (
                                <span key={sk} style={{ fontSize: 11, background: 'rgba(56, 189, 248, 0.1)', color: '#bae6fd', padding: '2px 8px', borderRadius: 4 }}>
                                  {sk}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button
                            type="button"
                            onClick={() => handleVerifySingleDocument(resumeDoc.id)}
                            style={{ background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.3)', color: '#38bdf8', padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                          >
                            Check again
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteSlot(resumeDoc.id)}
                            style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsDraggingOverResume(true); }}
                        onDragLeave={() => setIsDraggingOverResume(false)}
                        onDrop={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setIsDraggingOverResume(false);
                          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                            handleUploadToSlot(e.dataTransfer.files[0], 'resume');
                          }
                        }}
                        style={{
                          border: `1.5px dashed ${isDraggingOverResume ? '#38bdf8' : 'rgba(255,255,255,0.1)'}`,
                          background: isDraggingOverResume ? 'rgba(56, 189, 248, 0.05)' : 'rgba(255,255,255,0.01)',
                          borderRadius: 12,
                          padding: '30px 20px',
                          textAlign: 'center',
                          cursor: 'pointer'
                        }}
                        onClick={() => {
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.accept = 'application/pdf';
                          input.onchange = (e: any) => {
                            if (e.target.files && e.target.files[0]) {
                              handleUploadToSlot(e.target.files[0], 'resume');
                            }
                          };
                          input.click();
                        }}
                      >
                        <div style={{ fontSize: 31, marginBottom: 8 }}>📄</div>
                        <div style={{ fontSize: 14.5, fontWeight: 700, color: '#f1f5f9' }}>
                          Upload your resume
                        </div>
                        <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>
                          Drop your PDF here, or tap to choose it
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}

          {activeVaultTab === 'academic' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
              {[
                { cat: '10th' as VaultCategory, title: '10th marks card' },
                { cat: '12th_puc' as VaultCategory, title: '12th / PUC marks card' },
                { cat: 'sem1' as VaultCategory, title: 'Semester 1 marks card' },
                { cat: 'sem2' as VaultCategory, title: 'Semester 2 marks card' },
                { cat: 'sem3' as VaultCategory, title: 'Semester 3 marks card' },
                { cat: 'sem4' as VaultCategory, title: 'Semester 4 marks card' },
                { cat: 'sem5' as VaultCategory, title: 'Semester 5 marks card' },
                { cat: 'sem6' as VaultCategory, title: 'Semester 6 marks card' },
                { cat: 'sem7' as VaultCategory, title: 'Semester 7 marks card' },
                { cat: 'sem8' as VaultCategory, title: 'Semester 8 marks card' },
              ].map(slot => {
                const doc = vaultSlots.find(s => s.category === slot.cat);
                return (
                  <div key={slot.cat} style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    borderRadius: 12,
                    padding: 14,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 13, fontWeight: 800, color: '#f1f5f9' }}>{slot.title}</span>
                        {doc && (
                          <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: doc.verificationStatus === 'verified' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)', color: doc.verificationStatus === 'verified' ? '#34d399' : '#fbbf24' }}>
                            {doc.verificationStatus === 'verified' ? '✓ Checked' : '⚠️ Not checked'}
                          </span>
                        )}
                      </div>
                      {doc ? (
                        <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 8 }}>
                          <div>File: {doc.title}</div>
                          <div>Marks: <strong style={{ color: '#38bdf8' }}>{doc.scoreOrGpa}</strong></div>
                        </div>
                      ) : (
                        <div style={{ fontSize: 12, color: '#64748b', marginTop: 8 }}>Not yet uploaded</div>
                      )}
                    </div>

                    <div style={{ marginTop: 12, display: 'flex', gap: 6 }}>
                      {doc ? (
                        <button
                          type="button"
                          onClick={() => handleDeleteSlot(doc.id)}
                          style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#f87171', padding: '4px 8px', borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
                        >
                          Remove
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            const input = document.createElement('input');
                            input.type = 'file';
                            input.accept = 'application/pdf,image/*';
                            input.onchange = (e: any) => {
                              if (e.target.files && e.target.files[0]) {
                                handleUploadToSlot(e.target.files[0], slot.cat);
                              }
                            };
                            input.click();
                          }}
                          style={{ background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.2)', color: '#38bdf8', padding: '4px 8px', borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: 'pointer', width: '100%' }}
                        >
                          + Upload
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeVaultTab === 'certifications' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: 14.5, fontWeight: 800, color: '#f1f5f9' }}>Your certificates</span>
                <button
                  type="button"
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'application/pdf,image/*';
                    input.onchange = (e: any) => {
                      if (e.target.files && e.target.files[0]) {
                        handleUploadToSlot(e.target.files[0], 'certification');
                      }
                    };
                    input.click();
                  }}
                  style={{ background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.3)', color: '#38bdf8', padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 800, cursor: 'pointer' }}
                >
                  + Add certificate
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {vaultSlots.filter(s => s.category === 'certification').map(doc => (
                  <div key={doc.id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 10, padding: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: 14.5, fontWeight: 700, color: '#f8fafc' }}>{doc.title}</div>
                      <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>From: {doc.institution}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteSlot(doc.id)}
                      style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#f87171', padding: '4px 8px', borderRadius: 6, fontSize: 11, cursor: 'pointer' }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                {vaultSlots.filter(s => s.category === 'certification').length === 0 && (
                  <div style={{ textAlign: 'center', padding: 30, color: '#64748b', fontSize: 13 }}>
                    No certificates yet. Add any course certificate you have.
                  </div>
                )}
              </div>
            </div>
          )}

          {activeVaultTab === 'achievements' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: 14.5, fontWeight: 800, color: '#f1f5f9' }}>Your awards</span>
                <button
                  type="button"
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'application/pdf,image/*';
                    input.onchange = (e: any) => {
                      if (e.target.files && e.target.files[0]) {
                        handleUploadToSlot(e.target.files[0], 'achievement');
                      }
                    };
                    input.click();
                  }}
                  style={{ background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.3)', color: '#38bdf8', padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 800, cursor: 'pointer' }}
                >
                  + Add award
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {vaultSlots.filter(s => s.category === 'achievement').map(doc => (
                  <div key={doc.id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 10, padding: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: 14.5, fontWeight: 700, color: '#f8fafc' }}>{doc.title}</div>
                      <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{doc.scoreOrGpa}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteSlot(doc.id)}
                      style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#f87171', padding: '4px 8px', borderRadius: 6, fontSize: 11, cursor: 'pointer' }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                {vaultSlots.filter(s => s.category === 'achievement').length === 0 && (
                  <div style={{ textAlign: 'center', padding: 30, color: '#64748b', fontSize: 13 }}>
                    No awards yet. Add prizes from contests, fests or events.
                  </div>
                )}
              </div>
            </div>
          )}

          {activeVaultTab === 'analytics' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: 12, padding: 16 }}>
                <span style={{ fontSize: 12, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Documents</span>
                <div style={{ fontSize: 26.5, fontWeight: 900, color: '#38bdf8', marginTop: 6 }}>{vaultSlots.length}</div>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: 12, padding: 16 }}>
                <span style={{ fontSize: 12, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Checked</span>
                <div style={{ fontSize: 26.5, fontWeight: 900, color: '#34d399', marginTop: 6 }}>
                  {vaultSlots.filter(s => s.verificationStatus === 'verified').length}
                </div>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: 12, padding: 16 }}>
                <span style={{ fontSize: 12, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Name match</span>
                <div style={{ fontSize: 26.5, fontWeight: 900, color: '#a78bfa', marginTop: 6 }}>
                  {identityAuditReport.trustScore ?? 0}%
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
          <div style={{ fontSize: 12, color: '#94a3b8' }}>
            {vaultUploading ? '⏳ Uploading…' : `${vaultSlots.length} document(s) saved.`}
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'linear-gradient(135deg, var(--brand) 0%, var(--accent) 100%)',
              border: 'none',
              color: 'var(--text)',
              padding: '10px 22px',
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(var(--brand-rgb), 0.4)',
              transition: 'all 0.15s ease'
            }}
          >
            {vaultSlots.length > 0 ? `Continue (${vaultSlots.length} added) →` : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
}
