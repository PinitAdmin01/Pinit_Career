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
          style={{ background: 'transparent', border: 'none', color: 'var(--t3)', cursor: 'pointer', fontSize: 11, alignSelf: 'flex-start', marginBottom: 14 }}
        >
          ← Go Back
        </button>

        <div style={{ marginBottom: 16 }}>
          <h2 style={{ fontSize: 20, fontWeight: 900, color: 'var(--t1)', marginBottom: 6, letterSpacing: '-0.5px' }}>
            Express Career Setup
          </h2>
          <p style={{ fontSize: 12, color: 'var(--t3)' }}>
            Provide your target trajectory & academic demographics. Then drag & drop your resume PDF to verify.
          </p>
        </div>

        {handleExpressSubmit && (
          <form onSubmit={handleExpressSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Trajectory Selector */}
            <div>
              <label style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--t3)', display: 'block', marginBottom: 6 }}>Target Career Trajectory</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 8 }}>
                {[
                  { id: 'react_frontend', label: 'React Frontend', emoji: '⚛️' },
                  { id: 'java_sde', label: 'Java Backend', emoji: '☕' },
                  { id: 'devops_cloud', label: 'DevOps Cloud', emoji: '☁️' },
                  { id: 'financial_analyst', label: 'FinTech (B.Com)', emoji: '📊' },
                  { id: 'business_analyst', label: 'Product (BBA)', emoji: '📈' }
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
                      fontSize: 12,
                      fontWeight: 700,
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ fontSize: 18, marginBottom: 4 }}>{t.emoji}</div>
                    <div>{t.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* College Info Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 12 }}>
              <div>
                <label style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--t3)', display: 'block', marginBottom: 6 }}>College Name</label>
                <input
                  type="text"
                  placeholder="e.g. Apex Institute"
                  value={college || ''}
                  onChange={(e) => setCollege && setCollege(e.target.value)}
                  style={{ width: '100%', height: 38, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, padding: '0 12px', fontSize: 12.5, color: 'var(--t1)', outline: 'none' }}
                />
              </div>
              <div>
                <label style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--t3)', display: 'block', marginBottom: 6 }}>Degree Major</label>
                <input
                  type="text"
                  placeholder="e.g. B.Tech CSE"
                  value={degree || ''}
                  onChange={(e) => setDegree && setDegree(e.target.value)}
                  style={{ width: '100%', height: 38, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, padding: '0 12px', fontSize: 12.5, color: 'var(--t1)', outline: 'none' }}
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
                  <div style={{ fontSize: 24, marginBottom: 4 }}>📄</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--teal)' }}>{uploadedFile.name}</div>
                  <div style={{ fontSize: 10, color: 'var(--t2)', marginTop: 2 }}>Click or drag to change files</div>
                </>
              ) : (
                <>
                  <div style={{ fontSize: 24, marginBottom: 4 }}>📥</div>
                  <div style={{ fontSize: 12.5, fontWeight: 700 }}>Drag & Drop Resume PDF here</div>
                  <div style={{ fontSize: 10, color: 'var(--t2)', marginTop: 2 }}>or click to browse local files</div>
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
              Analyze Resume & Launch OS
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
              fontSize: 22,
              boxShadow: '0 0 20px rgba(var(--brand-rgb),0.25)'
            }}>
              📁
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <h3 style={{ fontSize: 19, fontWeight: 900, margin: 0, color: '#f8fafc', letterSpacing: '-0.02em' }}>
                  Career Credentials & Document Vault
                </h3>
                <span style={{
                  fontSize: 10,
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
                  SECURE VAULT
                </span>
              </div>
              <p style={{ fontSize: 11.5, color: '#94a3b8', margin: '3px 0 0', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>Drag & drop marks cards, degrees, certifications, or your master resume anywhere</span>
                <span style={{ color: '#475569' }}>•</span>
                <span style={{ color: '#38bdf8' }}>Auto-categorized & cross-verified via regex AI</span>
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
                fontSize: 11.5,
                fontWeight: 800,
                cursor: (isVerifyingAll || vaultSlots.length === 0) ? 'not-allowed' : 'pointer',
                opacity: (isVerifyingAll || vaultSlots.length === 0) ? 0.5 : 1,
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              {isVerifyingAll ? '🔄 Auditing All Credentials...' : '⚡ Audit Entire Vault'}
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
                fontSize: 12,
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
            <span style={{ fontSize: 20 }}>
              {identityAuditReport.overallStatus === 'SENTINEL_CLEAN' ? '🛡️' :
               (identityAuditReport.overallStatus === 'IDENTITY_MISMATCH_FLAGGED' || identityAuditReport.overallStatus === 'REVIEW_REQUIRED') ? '⚠️' :
               identityAuditReport.overallStatus === 'UNREADABLE_DOCUMENTS_REJECTED' ? '❌' :
               identityAuditReport.overallStatus === 'PROVISIONAL_PENDING' ? '📄' : '👤'}
            </span>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 800, color: '#94a3b8' }}>
                  Anchor Candidate Name:
                </span>
                <span style={{ fontSize: 13, fontWeight: 900, color: '#f8fafc' }}>
                  {primaryCandidateName}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const promptName = window.prompt('Set canonical candidate name for vault verification:', primaryCandidateName);
                    if (promptName && promptName.trim().length > 0) {
                      setCustomAnchorName(promptName.trim());
                    }
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#38bdf8',
                    fontSize: 11,
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  (Edit)
                </button>
              </div>
              <div style={{ fontSize: 11, color: '#cbd5e1', marginTop: 1 }}>
                {identityAuditReport.overallStatus === 'IDENTITY_MISMATCH_FLAGGED' || identityAuditReport.overallStatus === 'REVIEW_REQUIRED'
                  ? `${identityAuditReport.mismatchCount} document(s) have detected names that conflict with profile anchor and require verification review.`
                  : identityAuditReport.overallStatus === 'UNREADABLE_DOCUMENTS_REJECTED'
                  ? 'All uploaded documents are unreadable or lack verifiable text. Please upload clear documents.'
                  : identityAuditReport.overallStatus === 'PROVISIONAL_PENDING'
                  ? '1 document submitted (Provisional). Upload additional academic records to elevate trust.'
                  : identityAuditReport.overallStatus === 'SENTINEL_CLEAN'
                  ? `All ${identityAuditReport.totalDocuments} document(s) consistent with profile anchor.`
                  : 'Upload documents to establish verified candidate identity.'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 10, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
                Integrity Score
              </div>
              <div style={{
                fontSize: 16,
                fontWeight: 900,
                color: (identityAuditReport.trustScore || 0) >= 80 ? '#34d399' : (identityAuditReport.trustScore || 0) >= 50 ? '#fbbf24' : '#f87171'
              }}>
                {identityAuditReport.trustScore ?? 0}% Verified
              </div>
            </div>
          </div>
        </div>

        {/* Vault Tabs */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 12, borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 8, flexShrink: 0 }}>
          {[
            { id: 'resume', label: '📄 Master Resume', count: vaultSlots.filter(s => s.category === 'resume').length },
            { id: 'academic', label: '🎓 Academic Marksheets (10th - Sem 8)', count: vaultSlots.filter(s => s.category !== 'resume' && s.category !== 'certification' && s.category !== 'achievement').length },
            { id: 'certifications', label: '📜 Professional Certifications', count: vaultSlots.filter(s => s.category === 'certification').length },
            { id: 'achievements', label: '🏆 Achievements & Hackathons', count: vaultSlots.filter(s => s.category === 'achievement').length },
            { id: 'analytics', label: '📊 Real-Time QT-2 Calibration', count: null }
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
                  fontSize: 11.5,
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
                    fontSize: 10,
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
                        <span style={{ fontSize: 24 }}>📄</span>
                        <div>
                          <h4 style={{ fontSize: 15, fontWeight: 800, margin: 0, color: '#f8fafc' }}>
                            Primary Resume (CV)
                          </h4>
                          <span style={{ fontSize: 11, color: '#94a3b8' }}>
                            Acts as the primary anchor for student identity and skills extraction
                          </span>
                        </div>
                      </div>
                      {resumeDoc && (
                        <span style={{
                          fontSize: 11,
                          fontWeight: 800,
                          padding: '3px 10px',
                          borderRadius: 100,
                          background: resumeDoc.verificationStatus === 'verified' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                          color: resumeDoc.verificationStatus === 'verified' ? '#34d399' : '#fbbf24',
                          border: `1px solid ${resumeDoc.verificationStatus === 'verified' ? 'rgba(16, 185, 129, 0.4)' : 'rgba(245, 158, 11, 0.4)'}`
                        }}>
                          {resumeDoc.verificationStatus === 'verified' ? '✓ Verified Identity' : '⚠️ Provisional Document'}
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
                          <div style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9' }}>{resumeDoc.title}</div>
                          <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 3 }}>
                            Uploaded: {formatVaultDate(resumeDoc.uploadedAt)} • Extracted Name: <strong style={{ color: '#38bdf8' }}>{resumeDoc.candidateName}</strong>
                          </div>
                          {resumeDoc.skills && resumeDoc.skills.length > 0 && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 8 }}>
                              {resumeDoc.skills.slice(0, 8).map(sk => (
                                <span key={sk} style={{ fontSize: 10, background: 'rgba(56, 189, 248, 0.1)', color: '#bae6fd', padding: '2px 8px', borderRadius: 4 }}>
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
                            style={{ background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.3)', color: '#38bdf8', padding: '6px 12px', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
                          >
                            Re-Audit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteSlot(resumeDoc.id)}
                            style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', padding: '6px 12px', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
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
                        <div style={{ fontSize: 28, marginBottom: 8 }}>📄</div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9' }}>
                          Upload Your Primary Resume
                        </div>
                        <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>
                          Drag and drop your PDF resume here, or click to browse local files
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
                { cat: '10th' as VaultCategory, title: '10th Secondary Certificate' },
                { cat: '12th_puc' as VaultCategory, title: '12th / PUC High School' },
                { cat: 'sem1' as VaultCategory, title: 'Semester 1 Marksheet' },
                { cat: 'sem2' as VaultCategory, title: 'Semester 2 Marksheet' },
                { cat: 'sem3' as VaultCategory, title: 'Semester 3 Marksheet' },
                { cat: 'sem4' as VaultCategory, title: 'Semester 4 Marksheet' },
                { cat: 'sem5' as VaultCategory, title: 'Semester 5 Marksheet' },
                { cat: 'sem6' as VaultCategory, title: 'Semester 6 Marksheet' },
                { cat: 'sem7' as VaultCategory, title: 'Semester 7 Marksheet' },
                { cat: 'sem8' as VaultCategory, title: 'Semester 8 Marksheet' },
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
                        <span style={{ fontSize: 12, fontWeight: 800, color: '#f1f5f9' }}>{slot.title}</span>
                        {doc && (
                          <span style={{ fontSize: 9, padding: '2px 6px', borderRadius: 4, background: doc.verificationStatus === 'verified' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)', color: doc.verificationStatus === 'verified' ? '#34d399' : '#fbbf24' }}>
                            {doc.verificationStatus === 'verified' ? '✓ Verified' : '⚠️ Pending'}
                          </span>
                        )}
                      </div>
                      {doc ? (
                        <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 8 }}>
                          <div>File: {doc.title}</div>
                          <div>GPA/Marks: <strong style={{ color: '#38bdf8' }}>{doc.scoreOrGpa}</strong></div>
                        </div>
                      ) : (
                        <div style={{ fontSize: 11, color: '#64748b', marginTop: 8 }}>Not yet uploaded</div>
                      )}
                    </div>

                    <div style={{ marginTop: 12, display: 'flex', gap: 6 }}>
                      {doc ? (
                        <button
                          type="button"
                          onClick={() => handleDeleteSlot(doc.id)}
                          style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#f87171', padding: '4px 8px', borderRadius: 6, fontSize: 10, fontWeight: 700, cursor: 'pointer' }}
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
                          style={{ background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.2)', color: '#38bdf8', padding: '4px 8px', borderRadius: 6, fontSize: 10, fontWeight: 700, cursor: 'pointer', width: '100%' }}
                        >
                          + Upload PDF / Image
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
                <span style={{ fontSize: 13, fontWeight: 800, color: '#f1f5f9' }}>Verified Professional Certifications</span>
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
                  style={{ background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.3)', color: '#38bdf8', padding: '6px 12px', borderRadius: 8, fontSize: 11, fontWeight: 800, cursor: 'pointer' }}
                >
                  + Add Certification Document
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {vaultSlots.filter(s => s.category === 'certification').map(doc => (
                  <div key={doc.id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 10, padding: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#f8fafc' }}>{doc.title}</div>
                      <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>Issuer: {doc.institution}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteSlot(doc.id)}
                      style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#f87171', padding: '4px 8px', borderRadius: 6, fontSize: 10, cursor: 'pointer' }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                {vaultSlots.filter(s => s.category === 'certification').length === 0 && (
                  <div style={{ textAlign: 'center', padding: 30, color: '#64748b', fontSize: 12 }}>
                    No certifications added yet. Upload AWS, Google Cloud, Cisco, or Meta certificates.
                  </div>
                )}
              </div>
            </div>
          )}

          {activeVaultTab === 'achievements' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: '#f1f5f9' }}>Hackathons, Competitions & Publications</span>
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
                  style={{ background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.3)', color: '#38bdf8', padding: '6px 12px', borderRadius: 8, fontSize: 11, fontWeight: 800, cursor: 'pointer' }}
                >
                  + Add Achievement Document
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {vaultSlots.filter(s => s.category === 'achievement').map(doc => (
                  <div key={doc.id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 10, padding: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#f8fafc' }}>{doc.title}</div>
                      <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{doc.scoreOrGpa}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteSlot(doc.id)}
                      style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#f87171', padding: '4px 8px', borderRadius: 6, fontSize: 10, cursor: 'pointer' }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                {vaultSlots.filter(s => s.category === 'achievement').length === 0 && (
                  <div style={{ textAlign: 'center', padding: 30, color: '#64748b', fontSize: 12 }}>
                    No achievements uploaded yet. Add certificates from hackathons, college fests, or publications.
                  </div>
                )}
              </div>
            </div>
          )}

          {activeVaultTab === 'analytics' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: 12, padding: 16 }}>
                <span style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Total Documents</span>
                <div style={{ fontSize: 24, fontWeight: 900, color: '#38bdf8', marginTop: 6 }}>{vaultSlots.length}</div>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: 12, padding: 16 }}>
                <span style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Verified Credentials</span>
                <div style={{ fontSize: 24, fontWeight: 900, color: '#34d399', marginTop: 6 }}>
                  {vaultSlots.filter(s => s.verificationStatus === 'verified').length}
                </div>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: 12, padding: 16 }}>
                <span style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Confidence Index</span>
                <div style={{ fontSize: 24, fontWeight: 900, color: '#a78bfa', marginTop: 6 }}>
                  {identityAuditReport.trustScore ?? 0}%
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
          <div style={{ fontSize: 11, color: '#94a3b8' }}>
            {vaultUploading ? '⏳ Uploading document to secure storage...' : `${vaultSlots.length} credential documents securely cached in candidate profile.`}
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
              fontSize: 12,
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(var(--brand-rgb), 0.4)',
              transition: 'all 0.15s ease'
            }}
          >
            {vaultSlots.length > 0 ? `Continue Diagnostic Onboarding (${vaultSlots.length} Docs Synced) →` : 'Close Vault'}
          </button>
        </div>
      </div>
    </div>
  );
}
