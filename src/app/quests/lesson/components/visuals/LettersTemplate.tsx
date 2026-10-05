import React from 'react';
import type { LettersStep, VisualTone } from '@/lib/types/lessonVisual';
import { getToneColor, getToneBg, getToneTextColor, RenderWithFaintSpaces } from './visualTokens';

interface LettersTemplateProps {
  text: string;
  step: LettersStep;
  showSpaces?: boolean;
}

export function LettersTemplate({ text, step, showSpaces }: LettersTemplateProps): React.ReactElement {
  const chars = text.split('');
  const len = chars.length;

  // Resolve pointer index
  let normalizedPointerIndex: number | null = null;
  let isPointerOutOfRange = false;
  if (step.pointer !== undefined) {
    if (step.pointer < 0) {
      normalizedPointerIndex = len + step.pointer;
    } else if (step.pointer < len) {
      normalizedPointerIndex = step.pointer;
    } else {
      isPointerOutOfRange = true;
    }
  }

  const isInRange = (i: number): boolean => {
    if (!step.range) return false;
    const [start, stop] = step.range;
    return i >= start && i < stop;
  };

  const isRangeStopCell = (i: number): boolean => {
    if (!step.range) return false;
    return i === step.range[1];
  };

  // When step.range is undefined and all cells are data (e.g. 3.3 step 3)
  const allCellsAreData = step.range === undefined && step.tone === 'data' && step.pointer === undefined;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '20px',
        width: '100%',
        padding: '16px 8px',
      }}
    >
      {/* Cells row with pointer and indices */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start',
          justifyContent: 'center',
          gap: '6px',
          overflowX: 'auto',
          maxWidth: '100%',
          paddingBottom: '8px',
        }}
      >
        {chars.map((ch, i) => {
          const inRange = isInRange(i);
          const isStop = isRangeStopCell(i);
          const hasPointer = normalizedPointerIndex === i;

          let cellTone: VisualTone = 'idle';
          if (allCellsAreData || inRange) {
            cellTone = step.tone;
          } else if (hasPointer) {
            cellTone = step.tone;
          } else if (isStop) {
            cellTone = 'idle';
          }

          const positiveIndex = i;
          const negativeIndex = i - len;

          return (
            <div
              key={i}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                minWidth: '40px',
              }}
            >
              {/* Pointer indicator above cell */}
              <div
                style={{
                  height: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {hasPointer && (
                  <svg width="14" height="14" viewBox="0 0 14 14" aria-label="pointer">
                    <path
                      d="M 7 12 L 7 2 M 3 6 L 7 2 L 11 6"
                      fill="none"
                      stroke={getToneColor(step.tone)}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>

              {/* Character Box */}
              <div
                style={{
                  width: '42px',
                  height: '46px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '8px',
                  border: `2px solid ${
                    inRange || allCellsAreData || hasPointer
                      ? getToneColor(cellTone)
                      : 'var(--border)'
                  }`,
                  background:
                    inRange || allCellsAreData || hasPointer
                      ? getToneBg(cellTone)
                      : isStop
                      ? 'transparent'
                      : 'var(--bg2, transparent)',
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: '18px',
                  fontWeight: 700,
                  color: inRange || allCellsAreData || hasPointer ? 'var(--t1)' : 'var(--t2)',
                  transition: 'background 300ms ease, border-color 300ms ease, color 300ms ease',
                }}
              >
                {ch === ' ' ? <RenderWithFaintSpaces text=" " showSpaces={showSpaces} /> : ch}
              </div>

              {/* Positive index */}
              <span
                style={{
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: hasPointer || inRange ? getToneTextColor(cellTone) : 'var(--t1)',
                }}
              >
                {positiveIndex}
              </span>

              {/* Negative index */}
              <span
                style={{
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: '11px',
                  color: 'var(--text-muted)',
                }}
              >
                {negativeIndex}
              </span>
            </div>
          );
        })}

        {/* Out of range pointer slot (e.g. index 10 in Priya) */}
        {isPointerOutOfRange && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              minWidth: '50px',
              marginLeft: '8px',
            }}
          >
            {/* Pointer indicator */}
            <div
              style={{
                height: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" aria-label="error pointer">
                <path
                  d="M 7 12 L 7 2 M 3 6 L 7 2 L 11 6"
                  fill="none"
                  stroke="var(--coral)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Out-of-bounds cell */}
            <div
              style={{
                width: '50px',
                height: '46px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '8px',
                border: '2px dashed var(--coral)',
                background: 'color-mix(in srgb, var(--coral) 12%, transparent)',
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: '11px',
                fontWeight: 700,
                color: 'var(--coral)',
                textAlign: 'center',
              }}
            >
              out of range
            </div>

            {/* Pointer index */}
            <span
              style={{
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: '12px',
                fontWeight: 700,
                color: 'var(--coral)',
              }}
            >
              [{step.pointer}]
            </span>
          </div>
        )}
      </div>

      {/* Result Display Box */}
      <div
        style={{
          border: `2px solid ${getToneColor(step.tone)}`,
          background: getToneBg(step.tone),
          borderRadius: '10px',
          padding: '10px 18px',
          fontFamily: 'var(--font-mono, monospace)',
          fontSize: '15px',
          fontWeight: 600,
          color: getToneTextColor(step.tone),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: '220px',
          transition: 'background 300ms ease, border-color 300ms ease, color 300ms ease',
        }}
      >
        <RenderWithFaintSpaces text={step.result} showSpaces={showSpaces} />
      </div>
    </div>
  );
}
