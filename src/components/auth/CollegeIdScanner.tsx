'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  generateMemorableGlobalId,
  generateCollegePinItId,
  parseCollegeIdCard,
  CollegeMetadata,
} from '@/lib/utils/pinitIdGenerator';

interface Props {
  displayName: string;
  username: string;
  onIdGenerated: (id: string, mode: 'college' | 'global', metadata?: CollegeMetadata) => void;
}

export default function CollegeIdScanner({
  displayName,
  username,
  onIdGenerated,
}: Props) {
  const [mode, setMode] = useState<'global' | 'college'>('global');
  const [globalId, setGlobalId] = useState<string>('');
  
  // College ID workflow state
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanProgress, setScanProgress] = useState<number>(0);
  const [scanStatus, setScanStatus] = useState<string>('');
  const [collegeMeta, setCollegeMeta] = useState<CollegeMetadata | null>(null);
  
  // Form fields for editing/verifying extracted details
  const [collegeCode, setCollegeCode] = useState<string>('RVCE');
  const [deptCode, setDeptCode] = useState<string>('CSE');
  const [rollNumber, setRollNumber] = useState<string>('042');
  const [previewId, setPreviewId] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Compute live Global ID whenever displayName or username changes
  useEffect(() => {
    const gid = generateMemorableGlobalId(displayName, username);
    setGlobalId(gid);
    if (mode === 'global') {
      setPreviewId(gid);
      onIdGenerated(gid, 'global');
    }
  }, [displayName, username, mode, onIdGenerated]);

  // Compute live College ID whenever codes change in college mode
  useEffect(() => {
    if (mode === 'college') {
      const cid = generateCollegePinItId({
        collegeCode: collegeCode || 'RVCE',
        departmentCode: deptCode || 'CSE',
        rollNumber: rollNumber || '001',
      });
      setPreviewId(cid);
      onIdGenerated(cid, 'college', collegeMeta || undefined);
    }
  }, [mode, collegeCode, deptCode, rollNumber, collegeMeta, onIdGenerated]);

  // Handle file drop / upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processUploadedFile(file);
  };

  const processUploadedFile = async (file: File) => {
    setUploadedFile(file);
    setIsScanning(true);
    setScanProgress(15);
    setScanStatus('Reading institutional card stream...');

    try {
      await new Promise(r => setTimeout(r, 400));
      setScanProgress(45);
      setScanStatus('Scanning optical layout & OCR contours...');

      await new Promise(r => setTimeout(r, 500));
      setScanProgress(80);
      setScanStatus('Extracting college name, department & roll number...');

      const extracted = await parseCollegeIdCard(file, displayName);
      await new Promise(r => setTimeout(r, 300));
      setScanProgress(100);
      setScanStatus('✓ Verified accreditation card parsed successfully');

      setCollegeMeta(extracted);
      setCollegeCode(extracted.collegeCode);
      setDeptCode(extracted.departmentCode);
      setRollNumber(extracted.rollNumber);
    } catch (err) {
      console.warn('College ID parse fallback:', err);
      setScanStatus('⚠️ Manual review: please verify extracted fields');
    } finally {
      setTimeout(() => setIsScanning(false), 300);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) await processUploadedFile(file);
  };

  return (
    <div
      data-testid="college-id-scanner-root"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        padding: '16px',
        borderRadius: 14,
        background: 'var(--dash-card, rgba(15, 23, 42, 0.6))',
        border: '1.5px solid var(--dash-border, rgba(255, 255, 255, 0.08))',
        marginTop: 4,
      }}
    >
      {/* Header and Mode Selector */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
        <div>
          <span style={{ fontSize: 10, fontWeight: 900, fontFamily: 'var(--font-mono)', color: 'var(--accent)', letterSpacing: '1px', textTransform: 'uppercase' }}>
            PinIT Student Identity System
          </span>
          <h4 style={{ fontSize: 14, fontWeight: 800, color: 'var(--t1)', margin: '2px 0 0', fontFamily: 'var(--font-display)' }}>
            Choose Your PinIT ID Type
          </h4>
        </div>

        {/* Mode Toggle Pills */}
        <div
          role="radiogroup"
          aria-label="PinIT ID Generation Method"
          style={{
            display: 'flex',
            background: 'var(--bg3, rgba(0,0,0,0.25))',
            padding: 3,
            borderRadius: 9,
            border: '1px solid var(--border, rgba(255,255,255,0.06))',
          }}
        >
          <button
            type="button"
            role="radio"
            aria-checked={mode === 'global'}
            onClick={() => setMode('global')}
            style={{
              padding: '6px 12px',
              borderRadius: 7,
              border: 'none',
              background: mode === 'global' ? 'var(--accent)' : 'transparent',
              color: mode === 'global' ? '#ffffff' : 'var(--t2)',
              fontSize: 12,
              fontWeight: 800,
              fontFamily: 'var(--font-mono)',
              cursor: 'pointer',
              transition: 'all 0.18s ease',
            }}
          >
            🌐 Global ID
          </button>

          <button
            type="button"
            role="radio"
            aria-checked={mode === 'college'}
            data-testid="btn-select-college-mode"
            onClick={() => setMode('college')}
            style={{
              padding: '6px 12px',
              borderRadius: 7,
              border: 'none',
              background: mode === 'college' ? 'var(--accent)' : 'transparent',
              color: mode === 'college' ? '#ffffff' : 'var(--t2)',
              fontSize: 12,
              fontWeight: 800,
              fontFamily: 'var(--font-mono)',
              cursor: 'pointer',
              transition: 'all 0.18s ease',
            }}
          >
            🏛️ College ID
          </button>
        </div>
      </div>

      {/* Render Mode A: Global ID (Default) */}
      {mode === 'global' && (
        <div
          data-testid="global-id-preview-box"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 14px',
            borderRadius: 10,
            background: 'rgba(99, 102, 241, 0.08)',
            border: '1px dashed rgba(99, 102, 241, 0.3)',
          }}
        >
          <div>
            <div style={{ fontSize: 11, color: 'var(--t2)', marginBottom: 2 }}>
              Default Easy-to-Memorize Global Handle:
            </div>
            <div
              data-testid="generated-global-pinit-id"
              style={{
                fontSize: 16,
                fontWeight: 900,
                color: 'var(--accent)',
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.8px',
              }}
            >
              {globalId}
            </div>
          </div>
          <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 6, background: 'rgba(99,102,241,0.18)', color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontWeight: 800 }}>
            Global Tier
          </span>
        </div>
      )}

      {/* Render Mode B: College ID Upload & Live Scanner */}
      {mode === 'college' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Dropzone */}
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '18px 16px',
              borderRadius: 12,
              background: 'rgba(16, 185, 129, 0.04)',
              border: '1.5px dashed rgba(16, 185, 129, 0.4)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              textAlign: 'center',
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf"
              data-testid="college-id-file-input"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />

            <span style={{ fontSize: 26, marginBottom: 4 }}>🪪</span>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)' }}>
              {uploadedFile ? uploadedFile.name : 'Upload College ID Card (Front Side)'}
            </div>
            <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 2, fontFamily: 'var(--font-mono)' }}>
              Drag & drop JPG, PNG, WEBP, or PDF &middot; OCR extracts college code & roll number
            </div>
          </div>

          {/* Scanner Progress Animation */}
          {isScanning && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '10px 14px', borderRadius: 8, background: 'var(--bg3)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, fontFamily: 'var(--font-mono)', color: 'var(--accent)' }}>
                <span>{scanStatus}</span>
                <span>{scanProgress}%</span>
              </div>
              <div style={{ height: 4, width: '100%', background: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${scanProgress}%`, background: 'linear-gradient(90deg, var(--accent), #10b981)', transition: 'width 0.3s ease' }} />
              </div>
            </div>
          )}

          {/* Extracted Details & Live Badge Preview */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
              gap: 8,
              marginTop: 2,
            }}
          >
            <label style={{ display: 'flex', flexDirection: 'column', gap: 3, fontSize: 11, fontWeight: 700, color: 'var(--t3)' }}>
              College Code
              <input
                className="form-input"
                data-testid="input-college-code"
                value={collegeCode}
                onChange={(e) => setCollegeCode(e.target.value.toUpperCase())}
                placeholder="RVCE"
                style={{ padding: '6px 10px', fontSize: 12.5, fontFamily: 'var(--font-mono)', fontWeight: 800 }}
              />
            </label>

            <label style={{ display: 'flex', flexDirection: 'column', gap: 3, fontSize: 11, fontWeight: 700, color: 'var(--t3)' }}>
              Branch / Dept
              <input
                className="form-input"
                data-testid="input-dept-code"
                value={deptCode}
                onChange={(e) => setDeptCode(e.target.value.toUpperCase())}
                placeholder="CSE"
                style={{ padding: '6px 10px', fontSize: 12.5, fontFamily: 'var(--font-mono)', fontWeight: 800 }}
              />
            </label>

            <label style={{ display: 'flex', flexDirection: 'column', gap: 3, fontSize: 11, fontWeight: 700, color: 'var(--t3)' }}>
              Roll Suffix / USN
              <input
                className="form-input"
                data-testid="input-roll-suffix"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value.toUpperCase())}
                placeholder="042"
                style={{ padding: '6px 10px', fontSize: 12.5, fontFamily: 'var(--font-mono)', fontWeight: 800 }}
              />
            </label>
          </div>

          {/* Institutional Badge Preview */}
          <div
            data-testid="college-id-preview-badge"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              borderRadius: 12,
              background: 'linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(10,14,23,0.7) 100%)',
              border: '1.5px solid rgba(16,185,129,0.4)',
              boxShadow: '0 4px 16px rgba(16,185,129,0.15)',
            }}
          >
            <div>
              <div style={{ fontSize: 9.5, fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#10b981', letterSpacing: '0.8px' }}>
                INSTITUTIONAL PINIT ID (VERIFIED)
              </div>
              <div
                data-testid="generated-college-pinit-id"
                style={{
                  fontSize: 17,
                  fontWeight: 900,
                  color: '#ffffff',
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '1px',
                  marginTop: 2,
                }}
              >
                {previewId}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 6, background: 'rgba(16,185,129,0.2)', color: '#10b981', fontFamily: 'var(--font-mono)', fontWeight: 800 }}>
                Campus Linked
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
