'use client';

import React from 'react';
import type { CodeReview } from '@/lib/internships/codeReview';
import { CodeReviewCard } from './CodeReviewCard';

interface TicketTerminalOutputProps {
  localOutput: string | null;
  submitResult: {
    passed: boolean;
    output: string;
    attempts: number;
    aiReview?: CodeReview | null;
  } | null;
}

export const TicketTerminalOutput: React.FC<TicketTerminalOutputProps> = ({
  localOutput,
  submitResult,
}) => {
  if (!localOutput && !submitResult) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div
        style={{
          background: '#05070a',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 12,
          padding: '12px 16px',
          fontFamily: 'var(--font-mono)',
          fontSize: 12,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-dim)', marginBottom: 8, fontSize: 11 }}>
          <span>$ verification_runner</span>
          {submitResult ? (
            <span style={{ color: submitResult.passed ? '#10b981' : '#ef4444', fontWeight: 800 }}>
              {submitResult.passed ? '✓ All Tests Passed' : '✖ Verification Failed'} (Attempt #{submitResult.attempts})
            </span>
          ) : (
            <span style={{ color: '#818cf8' }}>Local Sandbox</span>
          )}
        </div>
        <div style={{ whiteSpace: 'pre-wrap', color: submitResult?.passed ? '#a7f3d0' : '#fca5a5' }}>
          {submitResult ? submitResult.output : localOutput}
        </div>
      </div>

      {submitResult?.aiReview && (
        <CodeReviewCard review={submitResult.aiReview} />
      )}
    </div>
  );
};
