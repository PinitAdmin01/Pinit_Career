import React, { useState } from 'react';
import type { LessonVisual } from '@/lib/types/lessonVisual';
import { FlowTemplate } from './FlowTemplate';
import { BoxesTemplate } from './BoxesTemplate';
import { TableTemplate } from './TableTemplate';
import { LettersTemplate } from './LettersTemplate';
import { CompareTemplate } from './CompareTemplate';

export interface VisualStageProps {
  visual: LessonVisual;
  currentStepIndex: number;
  onStepChange: (newStepIndex: number, manual: boolean) => void;
  isManualOverride: boolean;
  onSyncWithVoice: () => void;
  highlightedLabel: string | null;
  onShapeTap: (label: string) => void;
}

export function VisualStage({
  visual,
  currentStepIndex,
  onStepChange,
  isManualOverride,
  onSyncWithVoice,
  highlightedLabel,
  onShapeTap,
}: VisualStageProps): React.ReactElement {
  const [isMobileCollapsed, setIsMobileCollapsed] = useState(false);

  const totalSteps = visual.steps.length;
  // Ensure current step index is within bounds
  const safeStepIndex = Math.min(Math.max(0, currentStepIndex), totalSteps - 1);
  const currentStep = visual.steps[safeStepIndex];

  const handlePrev = () => {
    if (safeStepIndex > 0) {
      onStepChange(safeStepIndex - 1, true);
    }
  };

  const handleNext = () => {
    if (safeStepIndex < totalSteps - 1) {
      onStepChange(safeStepIndex + 1, true);
    }
  };

  const renderTemplate = () => {
    switch (visual.template) {
      case 'flow':
        return (
          <FlowTemplate
            nodes={visual.nodes}
            step={visual.steps[safeStepIndex]}
            highlightedLabel={highlightedLabel}
            onShapeTap={onShapeTap}
            showSpaces={visual.showSpaces}
          />
        );
      case 'boxes':
        return (
          <BoxesTemplate
            boxes={visual.boxes}
            step={visual.steps[safeStepIndex]}
            highlightedLabel={highlightedLabel}
            onShapeTap={onShapeTap}
            showSpaces={visual.showSpaces}
          />
        );
      case 'table':
        return (
          <TableTemplate
            columns={visual.columns}
            step={visual.steps[safeStepIndex]}
            showSpaces={visual.showSpaces}
          />
        );
      case 'letters':
        return (
          <LettersTemplate
            text={visual.text}
            step={visual.steps[safeStepIndex]}
            showSpaces={visual.showSpaces}
          />
        );
      case 'compare':
        return (
          <CompareTemplate
            leftLabel={visual.leftLabel}
            rightLabel={visual.rightLabel}
            step={visual.steps[safeStepIndex]}
            showSpaces={visual.showSpaces}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="visual-stage-root"
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: 'var(--bg1)',
        border: '1.5px solid var(--border)',
        borderRadius: '18px',
        padding: '18px 20px',
        overflow: 'hidden',
        position: 'relative',
        boxShadow: 'var(--shadow-md, 0 4px 6px -1px rgba(0, 0, 0, 0.1))',
      }}
    >
      <style>{`
        .visual-stage-root * {
          box-sizing: border-box;
        }
        @media (prefers-reduced-motion: reduce) {
          .visual-stage-root * {
            transition: none !important;
            animation: none !important;
          }
        }
        @media (max-width: 1023px) {
          .visual-stage-root {
            max-height: ${isMobileCollapsed ? '54px' : '260px'} !important;
            height: ${isMobileCollapsed ? '54px' : '260px'} !important;
            overflow-y: hidden !important;
            padding: 8px 10px !important;
          }
          .visual-stage-body {
            display: ${isMobileCollapsed ? 'none' : 'flex'} !important;
          }
          .visual-stage-canvas {
            min-height: 0 !important;
            flex: 1 1 auto !important;
            overflow-y: auto !important;
            padding: 4px 0 !important;
          }
          .visual-stage-footer {
            flex-shrink: 0 !important;
            padding-top: 6px !important;
            gap: 6px !important;
          }
          .visual-stage-caption {
            font-size: 13px !important;
            line-height: 1.3 !important;
            min-height: 18px !important;
          }
          .stage-nav-btn {
            padding: 4px 10px !important;
            font-size: 11.5px !important;
          }
        }
        .step-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--border);
          transition: background 300ms ease, transform 300ms ease;
          cursor: pointer;
        }
        .step-dot.active {
          background: var(--accent);
          transform: scale(1.3);
        }
        .stage-nav-btn {
          background: var(--bg2);
          border: 1px solid var(--border);
          color: var(--t1);
          padding: 6px 14px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: background 150ms ease, border-color 150ms ease, opacity 150ms ease;
        }
        .stage-nav-btn:hover:not(:disabled) {
          background: var(--bg3);
          border-color: var(--accent);
        }
        .stage-nav-btn:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }
      `}</style>

      {/* Header: Title and Step Indicator / Mobile Collapse */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--border)',
          paddingBottom: '10px',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--badge-visual-text, var(--accent))',
              background: 'var(--badge-visual-bg, color-mix(in srgb, var(--accent) 12%, transparent))',
              padding: '2px 8px',
              borderRadius: '6px',
              flexShrink: 0,
            }}
          >
            Visual
          </span>
          <h3
            style={{
              margin: 0,
              fontSize: '15px',
              fontWeight: 600,
              color: 'var(--t1)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
            title={visual.title}
          >
            {visual.title}
          </h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <span
            style={{
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '12px',
              color: 'var(--text-muted)',
            }}
          >
            {safeStepIndex + 1}/{totalSteps}
          </span>
          {/* Mobile Collapse Toggle */}
          <button
            onClick={() => setIsMobileCollapsed((prev) => !prev)}
            className="hidden-desktop"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              fontSize: '12px',
              padding: '2px 4px',
            }}
            aria-label={isMobileCollapsed ? 'Expand visual' : 'Collapse visual'}
          >
            {isMobileCollapsed ? '▾' : '▴'}
          </button>
        </div>
      </div>

      {/* Visual Canvas Body */}
      <div
        className="visual-stage-body visual-stage-canvas"
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '140px',
          overflowY: 'auto',
          padding: '8px 0',
        }}
      >
        {renderTemplate()}
      </div>

      {/* Footer: One-line Caption & Navigation Controls */}
      <div
        className="visual-stage-body visual-stage-footer"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          borderTop: '1px solid var(--border)',
          paddingTop: '10px',
        }}
      >
        {/* Caption (aria-live="polite", at least 15px) */}
        <div
          aria-live="polite"
          className="visual-stage-caption"
          style={{
            fontSize: '15px',
            lineHeight: 1.4,
            color: 'var(--t1)',
            textAlign: 'center',
            minHeight: '22px',
            fontWeight: 500,
          }}
        >
          {currentStep?.caption || ''}
        </div>

        {/* Step Controls: Back, Step Dots, Next, and optional "Sync with voice" */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <button
            type="button"
            className="stage-nav-btn"
            onClick={handlePrev}
            disabled={safeStepIndex === 0}
            aria-label="Previous step"
          >
            ◀ Back
          </button>

          {/* Dots & Sync */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {visual.steps.map((_step: unknown, idx: number) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onStepChange(idx, true)}
                  className={`step-dot ${idx === safeStepIndex ? 'active' : ''}`}
                  aria-label={`Go to step ${idx + 1}`}
                  style={{ border: 'none', padding: 0 }}
                />
              ))}
            </div>

            {isManualOverride && (
              <button
                type="button"
                onClick={onSyncWithVoice}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--accent)',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  padding: '2px 4px',
                }}
              >
                Sync with voice
              </button>
            )}
          </div>

          <button
            type="button"
            className="stage-nav-btn"
            onClick={handleNext}
            disabled={safeStepIndex === totalSteps - 1}
            aria-label="Next step"
          >
            Next ▶
          </button>
        </div>
      </div>
    </div>
  );
}
