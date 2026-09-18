'use client';

import React, { useState } from 'react';
import { CodeWarsApiService } from '@/lib/api/codeWarsApi';

// ── Simple syntax highlighter: tokenizes code into lines ────────────────────
type TokenizedLine = {
  line: number;
  text: string;
};

function tokenizeCode(code: string): TokenizedLine[] {
  if (!code || code.trim() === '') return [{ line: 1, text: '// Write your solution here...' }];
  const lines = code.split('\n');
  return lines.map((line, i) => ({ line: i + 1, text: line }));
}

// ── Diff engine: compute which lines differ between two code arrays ─────────
function computeDiff(myLines: string[], opponentLines: string[]): (boolean | null)[] {
  const result: (boolean | null)[] = [];
  const maxLen = Math.max(myLines.length, opponentLines.length);

  for (let i = 0; i < maxLen; i++) {
    const myLine = myLines[i] || '';
    const oppLine = opponentLines[i] || '';

    // Strip line number prefix if present (format: "N:code")
    const myContent = myLine.replace(/^\d+:/, '').trim();
    const oppContent = oppLine.replace(/^\d+:/, '').trim();

    // Mark as different if trimmed content differs, or if one has a line and the other doesn't
    const differs = myContent !== oppContent;
    result.push(differs ? true : null); // null = same, true = different
  }

  return result;
}

// ── ArenaCodeDiffViewer component ──────────────────────────────────────────
export interface ArenaCodeDiffViewerProps {
  isOpen: boolean;
  onClose: () => void;
  myCode: string;
  opponentCode: string;
  myScore: {
    passed: boolean;
    testsPassed: number;
    totalTests: number;
    score: number;
    executionTimeMs?: number;
  };
  opponentScore: {
    passed: boolean;
    testsPassed: number;
    totalTests: number;
    score: number;
    executionTimeMs?: number;
  };
  problemId: string;
}

export default function ArenaCodeDiffViewer({
  isOpen,
  onClose,
  myCode,
  opponentCode,
  myScore,
  opponentScore,
  problemId,
}: ArenaCodeDiffViewerProps) {
  // Internal state for tab switching
  const [activeTab, setTab] = useState<'my' | 'opponent'>('my');

  // Determine language from problem's starterCode keys
  const problem = CodeWarsApiService.getProblemById(problemId);
  const lang = problem?.starterCode ? Object.keys(problem.starterCode)[0] : 'typescript';

  // Tokenize both codes into line-numbered entries
  const myLines = tokenizeCode(myCode);
  const oppLines = tokenizeCode(opponentCode);

  // Compute diff flags: true = line differs, null = same
  const diffFlags = computeDiff(
    myLines.map((l) => l.text),
    oppLines.map((l) => l.text)
  );

  if (!isOpen) return null;

  const totalTests = problem?.testCases.length || 5;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.95)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: 24,
      }}
      aria-modal="true"
      aria-labelledby="code-diff-title"
    >
      <div
        style={{
          maxWidth: 960,
          width: '100%',
          background: 'var(--bg2)',
          border: '1px solid var(--border)',
          borderRadius: 20,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          height: '90vh',
        }}
      >
        {/* ── Header Bar ───────────────────────────────────────────────────── */}
        <div
          style={{
            padding: 20,
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'var(--bg3)',
          }}
        >
          <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--t1)' }}>
            <span id="code-diff-title">Code Comparison</span>
            <span style={{ fontSize: 11, textTransform: 'uppercase', color: '#818cf8' }}>
              {problemId}
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              padding: '6px 12px',
              borderRadius: 8,
              background: 'var(--bg3)',
              border: '1px solid var(--border)',
              color: 'var(--t2)',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            ✕ Close
          </button>
        </div>

        {/* ── Score Summary Row ────────────────────────────────────────────── */}
        <div
          style={{
            padding: 16,
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'var(--bg3)',
            fontSize: 12,
            color: 'var(--t3)',
          }}
        >
          <span>
            <strong>{myScore.testsPassed}/{totalTests} Tests Passed</strong>
            {myScore.executionTimeMs !== undefined ? ` • ${myScore.executionTimeMs}ms` : ''}
          </span>
          <span style={{ color: '#f59e0b' }}>
            VS
          </span>
          <span>
            <strong>{opponentScore.testsPassed}/{totalTests} Tests Passed</strong>
            {opponentScore.executionTimeMs !== undefined ? ` • ${opponentScore.executionTimeMs}ms` : ''}
          </span>
        </div>

        {/* ── Code Diff Tabs ───────────────────────────────────────────────── */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid var(--border)',
            background: 'var(--bg3)',
          }}
        >
          <button
            onClick={() => setTab('my')}
            style={{
              padding: '10px 16px',
              border: 'none',
              background: activeTab === 'my' ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
              color: activeTab === 'my' ? '#6366f1' : 'var(--t1)',
              fontWeight: 600,
              fontSize: 12,
              cursor: 'pointer',
              width: '50%',
              borderRight: '1px solid var(--border)',
            }}
          >
            Your Code
          </button>
          <button
            onClick={() => setTab('opponent')}
            style={{
              padding: '10px 16px',
              border: 'none',
              background: activeTab === 'opponent' ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
              color: activeTab === 'opponent' ? '#6366f1' : 'var(--t1)',
              fontWeight: 600,
              fontSize: 12,
              cursor: 'pointer',
              width: '50%',
              borderLeft: '1px solid var(--border)',
            }}
          >
            Opponent's Code
          </button>
        </div>

        {/* ── Code Diff Panes ──────────────────────────────────────────────── */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* Left: My Code ────────────────────────────────────────────────── */}
          <div
            style={{
              width: '50%',
              height: '100%',
              overflow: 'auto',
              borderRight: '1px solid var(--border)',
              flexShrink: 0,
              background: 'var(--bg1)',
            }}
          >
            <div style={{ padding: 16, height: 'calc(100% - 32px)' }}>
              <pre
                style={{
                  margin: 0,
                  fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                  fontSize: 13,
                  lineHeight: 1.5,
                  color: 'var(--t1)',
                  whiteSpace: 'pre-wrap',
                  overflowX: 'auto',
                }}
              >
                {myCode || '// No solution submitted'}
              </pre>
            </div>
          </div>

          {/* Right: Opponent's Code ────────────────────────────────────────── */}
          <div
            style={{
              width: '50%',
              height: '100%',
              overflow: 'auto',
              flexShrink: 0,
              background: 'var(--bg1)',
            }}
          >
            <div style={{ padding: 16, height: 'calc(100% - 32px)' }}>
              <pre
                style={{
                  margin: 0,
                  fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                  fontSize: 13,
                  lineHeight: 1.5,
                  color: 'var(--t1)',
                  whiteSpace: 'pre-wrap',
                  overflowX: 'auto',
                }}
              >
                {opponentCode || '// No solution submitted'}
              </pre>
            </div>
          </div>
        </div>

        {/* ── Diff Highlights Legend ───────────────────────────────────────── */}
        <div
          style={{
            padding: 12,
            borderTop: '1px solid var(--border)',
            background: 'var(--bg3)',
            fontSize: 11,
            color: 'var(--t2)',
          }}
        >
          <p style={{ margin: '4px 0 8px', fontSize: 10 }}>
            <span
              style={{
                display: 'inline-block',
                width: 12,
                height: 12,
                borderRadius: 3,
                background: 'rgba(16, 185, 129, 0.2)',
                border: '1px solid #10b981',
                marginRight: 4,
                verticalAlign: 'middle',
              }}
            >
              ✓
            </span>
            Same implementation
            <span
              style={{
                display: 'inline-block',
                width: 12,
                height: 12,
                borderRadius: 3,
                background: 'rgba(239, 68, 68, 0.2)',
                border: '1px solid #ef4444',
                marginLeft: 4,
                verticalAlign: 'middle',
              }}
            >
              ✗
            </span>
            Different approach
          </p>
          <p style={{ margin: 0, fontSize: 10 }}>
            Lines marked ✓ have similar logic; ✗ lines show where the opponent's algorithm
            diverges — study these to learn optimization and edge-case handling techniques.
          </p>
        </div>
      </div>
    </div>
  );
}