import React from 'react';
import type { CompareStep } from '@/lib/types/lessonVisual';
import { getToneColor, getToneBg, getToneTextColor, RenderWithFaintSpaces } from './visualTokens';

interface CompareTemplateProps {
  leftLabel: string;
  rightLabel: string;
  step: CompareStep;
  showSpaces?: boolean;
}

export function CompareTemplate({
  leftLabel,
  rightLabel,
  step,
  showSpaces,
}: CompareTemplateProps): React.ReactElement {
  const renderPanel = (label: string, panel: CompareStep['left']) => {
    const tone = panel.tone || 'idle';

    return (
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          padding: '14px',
          borderRadius: '12px',
          border: `1.5px solid ${getToneColor(tone)}`,
          background: getToneBg(tone),
          transition: 'background 300ms ease, border-color 300ms ease',
          minWidth: '180px',
        }}
      >
        {/* Panel Header */}
        <div
          style={{
            fontFamily: 'var(--font-mono, monospace)',
            fontSize: '13px',
            fontWeight: 700,
            color: getToneTextColor(tone),
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            borderBottom: `1px solid ${tone === 'idle' ? 'var(--border)' : getToneColor(tone)}`,
            paddingBottom: '6px',
          }}
        >
          {label}
        </div>

        {/* Panel Code */}
        <div
          style={{
            fontFamily: 'var(--font-mono, monospace)',
            fontSize: '13px',
            background: 'var(--bg1)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            padding: '8px 10px',
            color: 'var(--t1)',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          <RenderWithFaintSpaces text={panel.code} showSpaces={showSpaces} />
        </div>

        {/* Panel Result */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontFamily: 'var(--font-mono, monospace)',
            fontSize: '13px',
            fontWeight: 600,
            color: getToneTextColor(tone),
            padding: '6px 8px',
            borderRadius: '6px',
            background: 'rgba(0, 0, 0, 0.25)',
          }}
        >
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Result:
          </span>
          <RenderWithFaintSpaces text={panel.result} showSpaces={showSpaces} />
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: '14px',
        width: '100%',
        maxWidth: '540px',
        margin: '0 auto',
        padding: '12px 8px',
      }}
    >
      {renderPanel(leftLabel, step.left)}
      {renderPanel(rightLabel, step.right)}
    </div>
  );
}
