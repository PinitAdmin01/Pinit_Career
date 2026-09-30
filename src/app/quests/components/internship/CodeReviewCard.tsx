'use client';

import React from 'react';
import type { CodeReview } from '@/lib/internships/codeReview';

interface CodeReviewCardProps {
  review: CodeReview | Record<string, unknown> | null;
}

export const CodeReviewCard: React.FC<CodeReviewCardProps> = ({ review }) => {
  if (!review) return null;

  const rev = review as unknown as CodeReview;
  const scores = rev.scores || { correctness: 5, readability: 5, edgeCases: 5, naming: 5 };
  const strengths = Array.isArray(rev.strengths) ? rev.strengths : [];
  const improvements = Array.isArray(rev.improvements) ? rev.improvements : [];

  const scoreItems = [
    { label: 'Correctness', val: scores.correctness },
    { label: 'Readability', val: scores.readability },
    { label: 'Edge Cases', val: scores.edgeCases },
    { label: 'Naming', val: scores.naming },
  ];

  return (
    <div
      style={{
        borderRadius: 14,
        background: 'rgba(15, 23, 42, 0.75)',
        border: '1.5px solid rgba(99, 102, 241, 0.35)',
        padding: '18px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 22 }}>🤖</span>
          <div>
            <h4 style={{ margin: 0, fontSize: 16, fontWeight: 900, color: 'var(--text)' }}>
              Senior AI Code Review
            </h4>
            <span style={{ fontSize: 12, color: 'var(--t3)' }}>
              Automated architectural & stylistic critique · Educational guidance
            </span>
          </div>
        </div>
        <span
          style={{
            fontSize: 11,
            color: 'var(--t4)',
            fontStyle: 'italic',
          }}
        >
          Guidance only · Pass status unaffected
        </span>
      </div>

      {/* Scores Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: 10,
        }}
      >
        {scoreItems.map((item) => (
          <div
            key={item.label}
            style={{
              padding: '10px 12px',
              borderRadius: 10,
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border)',
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, color: 'var(--t3)' }}>
              <span>{item.label}</span>
              <span style={{ fontWeight: 800, color: item.val >= 4 ? '#10b981' : item.val >= 3 ? '#facc15' : '#f87171' }}>
                {item.val}/5
              </span>
            </div>
            <div
              style={{
                height: 6,
                borderRadius: 3,
                background: 'rgba(255, 255, 255, 0.08)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${(item.val / 5) * 100}%`,
                  background: item.val >= 4 ? '#10b981' : item.val >= 3 ? '#facc15' : '#f87171',
                  borderRadius: 3,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Strengths & Improvements */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 12,
        }}
      >
        {strengths.length > 0 && (
          <div
            style={{
              padding: '12px 14px',
              borderRadius: 10,
              background: 'rgba(16, 185, 129, 0.06)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 800, color: '#10b981' }}>
              ✓ Observed Strengths
            </div>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12.5, color: 'var(--t2)', lineHeight: 1.5 }}>
              {strengths.map((str, idx) => (
                <li key={idx}>{str}</li>
              ))}
            </ul>
          </div>
        )}

        {improvements.length > 0 && (
          <div
            style={{
              padding: '12px 14px',
              borderRadius: 10,
              background: 'rgba(234, 179, 8, 0.06)',
              border: '1px solid rgba(234, 179, 8, 0.25)',
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 800, color: '#facc15' }}>
              💡 Areas to Refine
            </div>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12.5, color: 'var(--t2)', lineHeight: 1.5 }}>
              {improvements.map((imp, idx) => (
                <li key={idx}>{imp}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
