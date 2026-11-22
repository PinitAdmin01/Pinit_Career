'use client';

import React from 'react';
import type { RoundDefenseState } from '@/lib/interview/roundDefenseEngine';

interface DefenseProgressStripProps {
  defenseState?: RoundDefenseState | null;
}

/**
 * Reusable 5-question cross-examination progress strip displayed inside
 * Round 2 (Code / B.Com Case) and Round 3 (Architecture / Business Workflow)
 * interviewer panels so the candidate sees live pass/fail progress per question.
 */
export const DefenseProgressStrip: React.FC<DefenseProgressStripProps> = ({ defenseState }) => {
  if (!defenseState || defenseState.status === 'idle') return null;

  const { totalQuestions, currentQuestionNumber, passedCount, status, records } = defenseState;
  const requiredToPass = defenseState.requiredToPass || 3;
  const slots = Array.from({ length: totalQuestions }, (_, i) => {
    const qNum = i + 1;
    const rec = records.find(r => r.questionNumber === qNum);
    return {
      qNum,
      verdict: rec?.verdict || 'upcoming',
      isCurrent: status === 'in_progress' && qNum === currentQuestionNumber,
    };
  });

  const isEliminated = status === 'eliminated';
  const isPassed = status === 'passed';

  return (
    <div
      data-testid={`defense-progress-round${defenseState.roundNumber}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        padding: '8px 10px',
        borderRadius: 8,
        background: isEliminated
          ? 'rgba(239, 68, 68, 0.12)'
          : isPassed
          ? 'rgba(34, 197, 94, 0.12)'
          : 'rgba(var(--brand-rgb), 0.10)',
        border: isEliminated
          ? '1px solid rgba(239, 68, 68, 0.42)'
          : isPassed
          ? '1px solid rgba(34, 197, 94, 0.42)'
          : '1px solid rgba(var(--brand-rgb), 0.28)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
        <span style={{
          fontSize: 10.5,
          fontWeight: 900,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          color: isEliminated ? 'var(--coral-mid)' : isPassed ? 'var(--green-mid)' : 'var(--accent-mid)',
        }}>
          {isEliminated
            ? '⛔ Defense Failed — Session Ending'
            : isPassed
            ? `✅ Defense Cleared (${passedCount}/${requiredToPass}) — Next Round Unlocked`
            : `🎯 Defense · Q${currentQuestionNumber}/${totalQuestions} (Need ${requiredToPass} Correct)`}
        </span>
        <span style={{ fontSize: 10.5, fontWeight: 800, color: 'var(--t2)', fontFamily: 'var(--font-mono)' }}>
          {passedCount}/{requiredToPass} Cleared
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${totalQuestions}, minmax(0, 1fr))`, gap: 5 }}>
        {slots.map(slot => {
          const passed = slot.verdict === 'passed';
          const failed = slot.verdict === 'failed';
          return (
            <div
              key={slot.qNum}
              title={`Question ${slot.qNum}: ${passed ? 'Cleared' : failed ? 'Not cleared' : slot.isCurrent ? 'Current question' : 'Upcoming'}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 3,
                padding: '3px 4px',
                borderRadius: 6,
                fontSize: 10.5,
                fontWeight: 800,
                fontFamily: 'var(--font-mono)',
                background: passed
                  ? 'rgba(34, 197, 94, 0.18)'
                  : failed
                  ? 'rgba(239, 68, 68, 0.2)'
                  : slot.isCurrent
                  ? 'rgba(var(--brand-rgb), 0.22)'
                  : 'var(--bg2)',
                color: passed
                  ? 'var(--green-mid)'
                  : failed
                  ? 'var(--coral-mid)'
                  : slot.isCurrent
                  ? 'var(--accent-mid)'
                  : 'var(--t3)',
                border: slot.isCurrent
                  ? '1px solid var(--accent)'
                  : passed
                  ? '1px solid rgba(34, 197, 94, 0.4)'
                  : failed
                  ? '1px solid rgba(239, 68, 68, 0.45)'
                  : '1px solid var(--border)',
              }}
            >
              <span>Q{slot.qNum}</span>
              <span>{passed ? '✓' : failed ? '✗' : slot.isCurrent ? '●' : '○'}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DefenseProgressStrip;
