'use client';

import React, { useState } from 'react';

interface FinalReportModalProps {
  enrollmentId: string;
  onClose: () => void;
  onReportAccepted: () => void;
  existingReport?: string | null;
}

export const FinalReportModal: React.FC<FinalReportModalProps> = ({
  enrollmentId,
  onClose,
  onReportAccepted,
  existingReport,
}) => {
  const [report, setReport] = useState(existingReport || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const wordCount = report.trim() ? report.trim().split(/\s+/).filter(Boolean).length : 0;
  const isTooShort = wordCount < 100;
  const isTooLong = wordCount > 300;
  const isValidLength = !isTooShort && !isTooLong;

  const handleSubmit = async () => {
    if (!isValidLength || isSubmitting) return;
    setIsSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch('/api/internship/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enrollmentId, report }),
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        setErrorMsg(data.message || 'Report submission failed.');
        return;
      }

      setSuccessMsg(data.message || 'Report accepted!');
      setTimeout(() => {
        onReportAccepted();
        onClose();
      }, 1500);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Network error submitting report.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 120,
        background: 'rgba(5, 7, 15, 0.88)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
    >
      <div
        style={{
          background: 'var(--bg)',
          border: '1.5px solid rgba(16, 185, 129, 0.35)',
          borderRadius: 20,
          width: '100%',
          maxWidth: 680,
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: 26,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border)', paddingBottom: 14 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 24 }}>📝</span>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: 'var(--text)' }}>
                Final Stand-Up Report
              </h3>
            </div>
            <p style={{ margin: '4px 0 0 0', fontSize: 12.5, color: 'var(--t3)' }}>
              100–300 words required · Evaluated by AI for relevance to your completed backlog
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: 20, color: 'var(--t3)', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>

        <div style={{ padding: '12px 16px', borderRadius: 10, background: 'var(--bg2)', border: '1px solid var(--border)', fontSize: 13, color: 'var(--t2)', lineHeight: 1.5 }}>
          <strong>Prompt Guidelines:</strong>
          <ul style={{ margin: '6px 0 0 0', paddingLeft: 18 }}>
            <li>Summarize what features and bug fixes you built across the 5 tickets.</li>
            <li>Highlight one challenging engineering problem you solved.</li>
            <li>State what improvements or refactoring you would tackle next.</li>
          </ul>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label style={{ fontSize: 12.5, fontWeight: 800, color: 'var(--text)' }}>
              Your Stand-Up Summary
            </label>
            <span
              style={{
                fontSize: 12,
                fontWeight: 800,
                color: isValidLength ? '#10b981' : isTooShort ? '#facc15' : '#ef4444',
              }}
            >
              {wordCount} / 300 words {isTooShort ? `(need at least 100)` : isTooLong ? `(too long)` : '✓ Length valid'}
            </span>
          </div>

          <textarea
            value={report}
            onChange={(e) => setReport(e.target.value)}
            disabled={!!existingReport && !errorMsg}
            placeholder="Over the course of this simulation, I implemented... The most challenging issue was... Given additional time, I would refactor..."
            rows={8}
            style={{
              width: '100%',
              boxSizing: 'border-box',
              resize: 'vertical',
              background: '#0e1420',
              padding: '14px 16px',
              borderRadius: 12,
              fontSize: 13.5,
              lineHeight: 1.6,
              color: 'var(--text)',
              border: `1px solid ${isValidLength ? 'rgba(16, 185, 129, 0.3)' : 'var(--border)'}`,
              outline: 'none',
              fontFamily: 'inherit',
            }}
          />
        </div>

        {errorMsg && (
          <div style={{ padding: '10px 14px', borderRadius: 8, background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', fontSize: 13 }}>
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div style={{ padding: '10px 14px', borderRadius: 8, background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.35)', color: '#10b981', fontSize: 13, fontWeight: 800 }}>
            ✓ {successMsg}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 4 }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              background: 'transparent',
              border: '1px solid var(--border)',
              color: 'var(--t3)',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>

          {!existingReport && (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!isValidLength || isSubmitting}
              style={{
                padding: '10px 20px',
                borderRadius: 8,
                border: 'none',
                background: isValidLength && !isSubmitting ? '#10b981' : 'var(--bg2)',
                color: isValidLength && !isSubmitting ? '#fff' : 'var(--t4)',
                fontSize: 13.5,
                fontWeight: 800,
                cursor: isValidLength && !isSubmitting ? 'pointer' : 'not-allowed',
                boxShadow: isValidLength ? '0 4px 14px rgba(16, 185, 129, 0.35)' : 'none',
              }}
            >
              {isSubmitting ? 'Verifying Relevance...' : 'Submit Report →'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinalReportModal;
