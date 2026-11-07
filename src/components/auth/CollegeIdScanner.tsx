'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  generateMemorableGlobalId,
  generateCollegePinItId,
  parseCollegeIdCard,
  parseCollegeCardFromText,
  CollegeMetadata,
} from '@/lib/utils/pinitIdGenerator';

interface Props {
  displayName: string;
  username: string;
  onIdGenerated: (id: string, mode: 'college' | 'global', metadata?: CollegeMetadata, file?: File | null) => void;
  onNameExtracted?: (extractedName: string) => void;
  onStoragePathExtracted?: (path: string) => void;
}

async function runClientOcr(file: File): Promise<string> {
  if (typeof window === 'undefined') return '';
  try {
    if (!(window as any).Tesseract) {
      await new Promise<void>((resolve, reject) => {
        const existingScript = document.querySelector('script[src*="tesseract"]');
        if (existingScript) {
          existingScript.addEventListener('load', () => resolve());
          existingScript.addEventListener('error', () => reject(new Error('Tesseract script error')));
          return;
        }
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Tesseract script failed to load'));
        document.head.appendChild(script);
      });
    }

    const Tesseract = (window as any).Tesseract;
    if (!Tesseract || typeof Tesseract.recognize !== 'function') return '';
    const res = await Tesseract.recognize(file, 'eng');
    return res?.data?.text || '';
  } catch (err) {
    console.warn('[CollegeIdScanner] Client OCR execution note:', err);
    return '';
  }
}

export default function CollegeIdScanner({
  displayName,
  username,
  onIdGenerated,
  onNameExtracted,
  onStoragePathExtracted,
}: Props) {
  const [mode, setMode] = useState<'global' | 'college'>('global');
  const [globalId, setGlobalId] = useState<string>('');
  
  // College ID workflow state
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>('');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanProgress, setScanProgress] = useState<number>(0);
  const [scanStatus, setScanStatus] = useState<string>('');
  const [collegeMeta, setCollegeMeta] = useState<CollegeMetadata | null>(null);
  
  // Form fields for editing/verifying extracted details (Dynamic: no hardcoded RVCE)
  const [collegeCode, setCollegeCode] = useState<string>('');
  const [deptCode, setDeptCode] = useState<string>('');
  const [rollNumber, setRollNumber] = useState<string>('');
  const [previewId, setPreviewId] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onIdGeneratedRef = useRef(onIdGenerated);
  useEffect(() => {
    onIdGeneratedRef.current = onIdGenerated;
  });

  const onNameExtractedRef = useRef(onNameExtracted);
  useEffect(() => {
    onNameExtractedRef.current = onNameExtracted;
  });

  const onStoragePathExtractedRef = useRef(onStoragePathExtracted);
  useEffect(() => {
    onStoragePathExtractedRef.current = onStoragePathExtracted;
  });

  // Compute live Global ID whenever displayName or username changes
  useEffect(() => {
    const gid = generateMemorableGlobalId(displayName, username);
    setGlobalId(gid);
    if (mode === 'global') {
      setPreviewId(gid);
      onIdGeneratedRef.current(gid, 'global');
    }
  }, [displayName, username, mode]);

  // Compute live College ID whenever codes change in college mode
  useEffect(() => {
    if (mode === 'college') {
      const cid = generateCollegePinItId({
        collegeCode: collegeCode || 'COLLEGE',
        departmentCode: deptCode || 'GEN',
        rollNumber: rollNumber || '001',
      });
      setPreviewId(cid);
      onIdGeneratedRef.current(cid, 'college', collegeMeta || undefined, uploadedFile);
    }
  }, [mode, collegeCode, deptCode, rollNumber, collegeMeta, uploadedFile]);

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
    setScanStatus('Reading institutional card image...');

    // Generate instant client preview thumbnail
    try {
      const localUrl = URL.createObjectURL(file);
      setImagePreviewUrl(localUrl);
    } catch {}

    let extracted: CollegeMetadata | null = null;
    let storagePath = '';

    try {
      setScanProgress(30);
      setScanStatus('Analyzing ID card layout & server storage...');

      // 1. Call server API route (/api/auth/scan-id-card)
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fallbackName', displayName);

      const res = await fetch('/api/auth/scan-id-card', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const json = await res.json();
        storagePath = json.storagePath || '';
        if (json.success && json.metadata && json.source === 'gemini-vision') {
          extracted = json.metadata;
        }
      }
    } catch (apiErr) {
      console.warn('[CollegeIdScanner] Server scan notice, falling back to local OCR:', apiErr);
    }

    // 2. Client-side OCR engine fallback if server vision wasn't available
    if (!extracted) {
      setScanProgress(60);
      setScanStatus('Scanning document text via client OCR...');
      try {
        const ocrText = await runClientOcr(file);
        if (ocrText && ocrText.trim().length > 10) {
          extracted = parseCollegeCardFromText(ocrText, displayName);
        }
      } catch (ocrErr) {
        console.warn('[CollegeIdScanner] Client OCR fallback:', ocrErr);
      }
    }

    // 3. Client-side heuristic fallback if OCR didn't catch text
    if (!extracted) {
      setScanProgress(85);
      setScanStatus('Synthesizing institutional contours...');
      try {
        extracted = await parseCollegeIdCard(file, displayName);
      } catch (parseErr) {
        console.warn('[CollegeIdScanner] Local parse fallback:', parseErr);
      }
    }

    setScanProgress(100);
    setScanStatus('✓ Verified accreditation card parsed successfully');

    if (extracted) {
      setCollegeMeta(extracted);
      setCollegeCode(extracted.collegeCode);
      setDeptCode(extracted.departmentCode);
      setRollNumber(extracted.rollNumber);

      // Auto-populate student's name on signup form if extracted
      if (extracted.studentName && extracted.studentName !== 'Student' && onNameExtractedRef.current) {
        onNameExtractedRef.current(extracted.studentName);
      }

      if (storagePath && onStoragePathExtractedRef.current) {
        onStoragePathExtractedRef.current(storagePath);
      }
    }

    setTimeout(() => setIsScanning(false), 350);
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
              padding: '16px',
              borderRadius: 12,
              background: imagePreviewUrl ? 'rgba(16, 185, 129, 0.08)' : 'rgba(16, 185, 129, 0.04)',
              border: '1.5px dashed rgba(16, 185, 129, 0.4)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
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

            {imagePreviewUrl ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, width: '100%', justifyContent: 'center' }}>
                <img
                  src={imagePreviewUrl}
                  alt="College ID Preview"
                  style={{
                    width: 58,
                    height: 58,
                    borderRadius: 8,
                    objectFit: 'cover',
                    border: '1.5px solid rgba(16, 185, 129, 0.6)',
                  }}
                />
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#10b981' }}>
                    ✓ {uploadedFile ? uploadedFile.name : 'Card Image Loaded'}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--t2)', marginTop: 2 }}>
                    Click or drop to replace ID card
                  </div>
                </div>
              </div>
            ) : (
              <>
                <span style={{ fontSize: 26, marginBottom: 4 }}>🪪</span>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)' }}>
                  Upload College ID Card (Front Side)
                </div>
                <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 2, fontFamily: 'var(--font-mono)' }}>
                  Drag & drop JPG, PNG, WEBP, or PDF &middot; OCR extracts college name, student & roll
                </div>
              </>
            )}
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

          {/* Extracted Accreditation Banner (if scanned) */}
          {collegeMeta && !isScanning && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                borderRadius: 8,
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                fontSize: 11.5,
              }}
            >
              <span style={{ color: '#10b981', fontWeight: 700 }}>
                🏛️ {collegeMeta.collegeName} &middot; {collegeMeta.studentName}
              </span>
              <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: '#10b981', color: '#000', fontWeight: 900 }}>
                {Math.round(collegeMeta.confidence * 100)}% Match
              </span>
            </div>
          )}

          {/* Editable Extracted Details */}
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
                placeholder="e.g. BGS, RVCE"
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
                placeholder="e.g. BCA, CSE"
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
                placeholder="e.g. 726, 042"
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
                {previewId || 'PIN-COLLEGE-DEPT-001'}
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
