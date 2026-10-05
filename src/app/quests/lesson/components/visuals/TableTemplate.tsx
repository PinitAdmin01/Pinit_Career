import React from 'react';
import type { TableStep, VisualTone } from '@/lib/types/lessonVisual';
import { getToneColor, getToneBg, getToneTextColor, RenderWithFaintSpaces } from './visualTokens';

interface TableTemplateProps {
  columns: [string, string];
  step: TableStep;
}

export function TableTemplate({ columns, step }: TableTemplateProps): React.ReactElement {
  return (
    <div
      style={{
        width: '100%',
        maxWidth: '560px',
        margin: '0 auto',
        padding: '12px 8px',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
      }}
    >
      {/* Table Header */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
          gap: '12px',
          padding: '8px 14px',
          borderBottom: '1.5px solid var(--border)',
          fontSize: '12px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          color: 'var(--text-muted)',
        }}
      >
        <div>{columns[0]}</div>
        <div>{columns[1]}</div>
      </div>

      {/* Table Rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {step.rows.map((row: { cells: [string, string]; tone: VisualTone }, idx: number) => {
          const tone = row.tone || 'idle';
          const isIdle = tone === 'idle';

          return (
            <div
              key={idx}
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
                gap: '12px',
                padding: '10px 14px',
                borderRadius: '8px',
                border: `1.5px solid ${getToneColor(tone)}`,
                background: getToneBg(tone),
                transition: 'background 300ms ease, border-color 300ms ease, opacity 300ms ease',
                opacity: isIdle ? 0.65 : 1,
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: '13px',
                  color: isIdle ? 'var(--text-muted)' : 'var(--t1)',
                  wordBreak: 'break-word',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <RenderWithFaintSpaces text={row.cells[0]} />
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: '13px',
                  fontWeight: tone === 'ok' || tone === 'data' ? 600 : 400,
                  color: getToneTextColor(tone),
                  wordBreak: 'break-word',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <RenderWithFaintSpaces text={row.cells[1]} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
