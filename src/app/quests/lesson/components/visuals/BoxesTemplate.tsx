import React from 'react';
import type { Node, BoxesStep, VisualTone } from '@/lib/types/lessonVisual';
import { getToneColor, getToneBg, getToneTextColor, RenderWithFaintSpaces } from './visualTokens';

interface BoxesTemplateProps {
  boxes: Node[];
  step: BoxesStep;
  highlightedLabel: string | null;
  onShapeTap?: (label: string) => void;
  showSpaces?: boolean;
}

export function BoxesTemplate({
  boxes,
  step,
  highlightedLabel,
  onShapeTap,
  showSpaces,
}: BoxesTemplateProps): React.ReactElement {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        width: '100%',
        padding: '16px 8px',
      }}
    >
      {boxes.map((box) => {
        const isHighlighted =
          highlightedLabel !== null &&
          highlightedLabel.trim().toLowerCase() === box.label.trim().toLowerCase();

        const rawTone: VisualTone = step.tones[box.id] || 'idle';
        const effectiveTone: VisualTone = isHighlighted ? 'data' : rawTone;
        const isTappable = box.tappable !== false;
        const value = step.values[box.id] ?? '';
        const typeTag = step.types?.[box.id];

        return (
          <div
            key={box.id}
            onClick={isTappable ? () => onShapeTap?.(box.label) : undefined}
            role={isTappable ? 'button' : undefined}
            tabIndex={isTappable ? 0 : undefined}
            onKeyDown={
              isTappable
                ? (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onShapeTap?.(box.label);
                    }
                  }
                : undefined
            }
            aria-label={`Variable ${box.label}: ${value || 'empty'}${typeTag ? ` (${typeTag})` : ''}`}
            style={{
              border: `2px solid ${getToneColor(effectiveTone)}`,
              background: getToneBg(effectiveTone),
              borderRadius: '14px',
              padding: '14px 16px',
              minWidth: '130px',
              maxWidth: '200px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              cursor: isTappable ? 'pointer' : 'default',
              transition: 'background 300ms ease, border-color 300ms ease, box-shadow 300ms ease',
              boxShadow: isHighlighted ? '0 0 0 3px var(--accent)' : undefined,
            }}
          >
            {/* Box Header: Variable Name & Type Badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px',
                borderBottom: `1px solid ${effectiveTone === 'idle' ? 'var(--border)' : getToneColor(effectiveTone)}`,
                paddingBottom: '6px',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: '13px',
                  fontWeight: 700,
                  color: effectiveTone === 'idle' ? 'var(--t1)' : getToneTextColor(effectiveTone),
                }}
              >
                {box.label}
              </span>

              {typeTag && (
                <span
                  style={{
                    fontFamily: 'var(--font-mono, monospace)',
                    fontSize: '11px',
                    fontWeight: 600,
                    padding: '1px 6px',
                    borderRadius: '6px',
                    border: `1px solid ${effectiveTone === 'idle' ? 'var(--border)' : getToneColor(effectiveTone)}`,
                    color: effectiveTone === 'idle' ? 'var(--t2)' : getToneTextColor(effectiveTone),
                    background: 'transparent',
                  }}
                >
                  {typeTag}
                </span>
              )}
            </div>

            {/* Box Value */}
            <div
              style={{
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: '16px',
                fontWeight: 600,
                color: 'var(--t1)',
                textAlign: 'center',
                padding: '6px 4px',
                minHeight: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                wordBreak: 'break-word',
              }}
            >
              {value !== '' ? (
                <RenderWithFaintSpaces text={value} showSpaces={showSpaces} />
              ) : (
                <span style={{ color: 'var(--t2)', fontSize: '13px', fontWeight: 400 }}>
                  (empty)
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
