import React from 'react';
import type { TableStep, VisualTone } from '@/lib/types/lessonVisual';
import { getToneColor, getToneBg, getToneTextColor, RenderWithFaintSpaces } from './visualTokens';

interface TableTemplateProps {
  columns: [string, string];
  step: TableStep;
  showSpaces?: boolean;
}

export function TableTemplate({ columns, step, showSpaces }: TableTemplateProps): React.ReactElement {
  return (
    <div
      className="visual-table-container"
      style={{
        width: '100%',
        maxWidth: '560px',
        margin: '0 auto',
        padding: '8px 4px',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
      }}
    >
      <style>{`
        .visual-table-header {
          display: grid;
          grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
          gap: 10px;
          padding: 8px 12px;
          border-bottom: 1.5px solid var(--border);
          font-size: 11.5px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-muted);
        }
        .visual-table-row {
          display: grid;
          grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
          gap: 10px;
          padding: 8px 12px;
        }
        .visual-table-cell {
          font-family: var(--font-mono, monospace);
          font-size: 13px;
          overflow-wrap: break-word;
          word-break: normal;
          white-space: normal;
          line-height: 1.35;
          display: flex;
          flex-direction: column;
          justify-content: center;
          min-width: 80px;
        }
        .visual-table-cell-label {
          display: none;
          font-size: 10px;
          font-family: var(--font-sans, system-ui);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-muted);
          margin-bottom: 2px;
        }
        @media (max-width: 479px) {
          .visual-table-header {
            display: none !important;
          }
          .visual-table-row {
            display: flex !important;
            flex-direction: column !important;
            gap: 6px !important;
            padding: 8px 10px !important;
          }
          .visual-table-cell {
            width: 100% !important;
            font-size: 12px !important;
          }
          .visual-table-cell-label {
            display: block !important;
          }
        }
      `}</style>

      {/* Table Header for >= 480px */}
      <div className="visual-table-header">
        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{columns[0]}</div>
        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{columns[1]}</div>
      </div>

      {/* Table Rows (Cards under 480px) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {step.rows.map((row: { cells: [string, string]; tone: VisualTone }, idx: number) => {
          const tone = row.tone || 'idle';
          const isIdle = tone === 'idle';

          return (
            <div
              key={idx}
              className="visual-table-row"
              style={{
                borderRadius: '8px',
                border: `1.5px solid ${getToneColor(tone)}`,
                background: getToneBg(tone),
                transition: 'background 300ms ease, border-color 300ms ease, opacity 300ms ease',
                opacity: isIdle ? 0.65 : 1,
              }}
            >
              <div
                className="visual-table-cell"
                style={{
                  color: isIdle ? 'var(--text-muted)' : 'var(--t1)',
                }}
              >
                <span className="visual-table-cell-label">{columns[0]}</span>
                <div>
                  <RenderWithFaintSpaces text={row.cells[0]} showSpaces={showSpaces} />
                </div>
              </div>
              <div
                className="visual-table-cell"
                style={{
                  fontWeight: tone === 'ok' || tone === 'data' ? 600 : 400,
                  color: getToneTextColor(tone),
                }}
              >
                <span className="visual-table-cell-label">{columns[1]}</span>
                <div>
                  <RenderWithFaintSpaces text={row.cells[1]} showSpaces={showSpaces} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
