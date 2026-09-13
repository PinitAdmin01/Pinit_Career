'use client';

import React from 'react';

interface MissionsConclusionDetailProps {
  theme: {
    bg: string;
    bgCard: string;
    bgInside: string;
    border: string;
    tPrimary: string;
    tSecondary: string;
    tTertiary: string;
    accentLight: string;
  };
  record: any;
  onBack: () => void;
}

export default function MissionsConclusionDetail({ theme, record, onBack }: MissionsConclusionDetailProps) {
  if (!record) return null;

  return (
    <div
      style={{
        background: theme.bgCard,
        border: `1.5px solid ${theme.border}`,
        borderRadius: '24px',
        padding: '24px',
        boxShadow: 'var(--shadow-lg)',
      }}
      className="animate-fade-in"
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: `1px solid ${theme.border}`,
          paddingBottom: 12,
          marginBottom: 16,
        }}
      >
        <button
          onClick={onBack}
          style={{
            background: theme.bgInside,
            border: `1px solid ${theme.border}`,
            padding: '8px 14px',
            borderRadius: 10,
            fontSize: 12,
            fontWeight: 700,
            cursor: 'pointer',
            color: theme.tPrimary,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          ← Back to History Timeline
        </button>
        <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: theme.tTertiary }}>
          Recorded on {record.date}
        </span>
      </div>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
        <span
          style={{
            padding: '5px 12px',
            borderRadius: 8,
            fontSize: 11,
            fontWeight: 800,
            background:
              record.type === 'corporate_comm'
                ? 'rgba(var(--accent-teal-rgb), 0.1)'
                : record.type === 'daily_mission'
                ? 'rgba(var(--info-rgb), 0.1)'
                : 'rgba(168,85,247,0.1)',
            color:
              record.type === 'corporate_comm'
                ? 'var(--teal)'
                : record.type === 'daily_mission'
                ? 'var(--blue)'
                : 'var(--purple)',
            border: `1px solid ${
              record.type === 'corporate_comm'
                ? 'rgba(var(--accent-teal-rgb), 0.25)'
                : record.type === 'daily_mission'
                ? 'rgba(var(--info-rgb), 0.25)'
                : 'rgba(168,85,247,0.25)'
            }`,
          }}
        >
          {record.type === 'corporate_comm'
            ? '🎙️ Corporate Comm Session'
            : record.type === 'daily_mission'
            ? '📅 Daily Mission Proof'
            : `🧬 Archetype: ${record.mindsetArchetype || 'Pattern Hunter'}`}
        </span>

        {record.score && (
          <span
            style={{
              padding: '5px 12px',
              borderRadius: 8,
              fontSize: 11,
              fontWeight: 800,
              background: 'rgba(var(--accent-teal-rgb), 0.1)',
              color: 'var(--teal)',
              border: '1px solid rgba(var(--accent-teal-rgb), 0.25)',
            }}
          >
            Rating Score: {record.score}/100
          </span>
        )}

        {record.qt2Delta !== undefined && (
          <span
            style={{
              padding: '5px 12px',
              borderRadius: 8,
              fontSize: 11,
              fontWeight: 800,
              background: record.qt2Delta >= 0 ? 'rgba(var(--accent-teal-rgb), 0.1)' : 'rgba(var(--danger-rgb), 0.1)',
              color: record.qt2Delta >= 0 ? 'var(--teal)' : 'var(--red)',
              border: `1px solid ${
                record.qt2Delta >= 0 ? 'rgba(var(--accent-teal-rgb), 0.25)' : 'rgba(var(--danger-rgb), 0.25)'
              }`,
            }}
          >
            QT2 Delta: {record.qt2Delta >= 0 ? `+${record.qt2Delta}` : record.qt2Delta} pts
          </span>
        )}
      </div>

      <h2
        style={{
          fontSize: 19,
          fontWeight: 900,
          color: theme.tPrimary,
          margin: '0 0 14px',
          fontFamily: 'var(--font-display)',
        }}
      >
        {record.title}
      </h2>

      <div
        style={{
          background: theme.bgInside,
          border: `1px solid ${theme.border}`,
          borderRadius: 18,
          padding: 20,
          fontSize: 13,
          lineHeight: 1.65,
          color: theme.tSecondary,
          maxHeight: 520,
          overflowY: 'auto',
        }}
      >
        {record.report ? (
          record.report.split('\n').map((line: string, idx: number) => {
            if (line.startsWith('### ')) {
              return (
                <h4
                  key={idx}
                  style={{
                    margin: '16px 0 6px',
                    color: 'var(--accent)',
                    fontWeight: 800,
                    fontSize: 13.5,
                    textTransform: 'uppercase',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {line.replace('### ', '')}
                </h4>
              );
            }
            if (line.startsWith('## ')) {
              return (
                <h3 key={idx} style={{ margin: '20px 0 8px', color: theme.tPrimary, fontWeight: 800, fontSize: 15 }}>
                  {line.replace('## ', '')}
                </h3>
              );
            }
            if (line.startsWith('* ')) {
              return (
                <li key={idx} style={{ marginLeft: 16, marginBottom: 4, color: theme.tPrimary }}>
                  {line.replace('* ', '')}
                </li>
              );
            }
            return (
              <p key={idx} style={{ margin: '0 0 10px' }}>
                {line}
              </p>
            );
          })
        ) : record.userSubmission ? (
          <div>
            <h4
              style={{
                fontSize: 12,
                fontWeight: 800,
                color: 'var(--accent)',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-mono)',
                margin: '0 0 6px',
              }}
            >
              Candidate Submission Proof:
            </h4>
            <p style={{ fontSize: 13, color: theme.tPrimary, fontStyle: 'italic', margin: '0 0 14px' }}>
              &ldquo;{record.userSubmission}&rdquo;
            </p>
          </div>
        ) : (
          <p style={{ fontStyle: 'italic' }}>No detailed report text archived for this entry.</p>
        )}
      </div>
    </div>
  );
}
