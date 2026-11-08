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

  // Clean structured parser for report sections
  const parseReportSections = (report: string) => {
    if (!report) return [];
    const sections: { title: string; lines: string[] }[] = [];
    let cur: { title: string; lines: string[] } | null = null;

    report.split('\n').forEach((line) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('### ') || trimmed.startsWith('## ') || trimmed.startsWith('#### ')) {
        if (cur) sections.push(cur);
        cur = { title: trimmed.replace(/^#+\s*/, ''), lines: [] };
      } else if (cur) {
        if (trimmed) cur.lines.push(trimmed);
      } else if (trimmed) {
        cur = { title: 'Executive Summary', lines: [trimmed] };
      }
    });
    if (cur) sections.push(cur);
    return sections;
  };

  const reportSections = record.report ? parseReportSections(record.report) : [];

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
          paddingBottom: 14,
          marginBottom: 18,
          flexWrap: 'wrap',
          gap: 10,
        }}
      >
        <button
          onClick={onBack}
          style={{
            background: theme.bgInside,
            border: `1.5px solid ${theme.border}`,
            padding: '8px 16px',
            borderRadius: 10,
            fontSize: 13,
            fontWeight: 800,
            cursor: 'pointer',
            color: theme.tPrimary,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            transition: 'all 0.2s',
          }}
        >
          ← Back to History Timeline
        </button>
        <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: theme.tTertiary }}>
          Recorded on {record.date}
        </span>
      </div>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
        <span
          style={{
            padding: '6px 14px',
            borderRadius: 8,
            fontSize: 12,
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
            ? '📋 Daily Mission Proof'
            : `🧠 Archetype: ${record.mindsetArchetype || 'Pattern Hunter'}`}
        </span>

        {record.score && (
          <span
            style={{
              padding: '6px 14px',
              borderRadius: 8,
              fontSize: 12,
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
              padding: '6px 14px',
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 800,
              background: record.qt2Delta >= 0 ? 'rgba(var(--accent-teal-rgb), 0.12)' : 'rgba(var(--danger-rgb), 0.12)',
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
          fontSize: 22,
          fontWeight: 900,
          color: theme.tPrimary,
          margin: '0 0 16px',
          fontFamily: 'var(--font-display)',
        }}
      >
        {record.title}
      </h2>

      {/* Structured Socratic Report Container */}
      <div
        style={{
          background: theme.bgInside,
          border: `1.5px solid ${theme.border}`,
          borderRadius: 18,
          padding: 20,
          fontSize: 14,
          lineHeight: 1.65,
          color: theme.tSecondary,
          maxHeight: 640,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
        }}
      >
        {reportSections.length > 0 ? (
          reportSections.map((sec, idx) => {
            const isVerdict = /VERDICT/i.test(sec.title);
            const isStrengths = /STRENGTHS|HANDLED WELL/i.test(sec.title);
            const isBlindspots = /BLIND SPOTS|WENT WRONG/i.test(sec.title);
            const isTakeaway = /TAKEAWAY|LEADERSHIP/i.test(sec.title);

            if (isVerdict) {
              return (
                <div
                  key={idx}
                  style={{
                    background: 'linear-gradient(135deg, rgba(20,184,166,0.12) 0%, rgba(99,102,241,0.08) 100%)',
                    border: '1.5px solid rgba(20,184,166,0.3)',
                    borderRadius: 14,
                    padding: 16,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <span style={{ fontSize: 14.5, fontWeight: 900, color: 'var(--teal)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                      🏆 Executive Verdict & Score
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--teal)', background: 'rgba(20,184,166,0.15)', padding: '3px 10px', borderRadius: 999 }}>
                      Score: {record.qt2Delta >= 0 ? `+${record.qt2Delta}` : record.qt2Delta} pts
                    </span>
                  </div>
                  {sec.lines.map((l, lIdx) => (
                    <p key={lIdx} style={{ margin: '0 0 6px', fontSize: 13.5, color: theme.tPrimary, fontWeight: 600 }}>
                      {l.replace(/\*\*/g, '')}
                    </p>
                  ))}
                </div>
              );
            }

            if (isStrengths) {
              return (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(16,185,129,0.08)',
                    border: '1px solid rgba(16,185,129,0.25)',
                    borderRadius: 14,
                    padding: 16,
                  }}
                >
                  <h4 style={{ margin: '0 0 10px', fontSize: 14, fontWeight: 800, color: '#10b981', display: 'flex', alignItems: 'center', gap: 6 }}>
                    🟢 Key Strengths (What You Handled Well)
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {sec.lines.map((l, lIdx) => (
                      <div key={lIdx} style={{ fontSize: 13.5, lineHeight: 1.55, color: theme.tPrimary }}>
                        {l.replace(/^[•\s*-]+\s*/, '✔ ').replace(/\*\*/g, '')}
                      </div>
                    ))}
                  </div>
                </div>
              );
            }

            if (isBlindspots) {
              return (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(239,68,68,0.08)',
                    border: '1px solid rgba(239,68,68,0.25)',
                    borderRadius: 14,
                    padding: 16,
                  }}
                >
                  <h4 style={{ margin: '0 0 10px', fontSize: 14, fontWeight: 800, color: '#ef4444', display: 'flex', alignItems: 'center', gap: 6 }}>
                    🔴 Blind Spots & What Went Wrong
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {sec.lines.map((l, lIdx) => (
                      <div key={lIdx} style={{ fontSize: 13.5, lineHeight: 1.55, color: theme.tPrimary }}>
                        {l.replace(/^[•\s*-]+\s*/, '⚠ ').replace(/\*\*/g, '')}
                      </div>
                    ))}
                  </div>
                </div>
              );
            }

            if (isTakeaway) {
              return (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(99,102,241,0.08)',
                    border: '1px solid rgba(99,102,241,0.25)',
                    borderRadius: 14,
                    padding: 16,
                  }}
                >
                  <h4 style={{ margin: '0 0 8px', fontSize: 14, fontWeight: 800, color: '#818cf8', display: 'flex', alignItems: 'center', gap: 6 }}>
                    🎯 Senior Leadership Takeaway
                  </h4>
                  <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.6, color: theme.tPrimary, fontWeight: 600 }}>
                    {sec.lines.join(' ').replace(/\*\*/g, '')}
                  </p>
                </div>
              );
            }

            return (
              <div
                key={idx}
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: `1px solid ${theme.border}`,
                  borderRadius: 14,
                  padding: 14,
                }}
              >
                <h4 style={{ margin: '0 0 8px', fontSize: 13.5, fontWeight: 800, color: theme.tSecondary, textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                  {sec.title}
                </h4>
                {sec.lines.map((l, lIdx) => (
                  <div key={lIdx} style={{ fontSize: 13, color: theme.tPrimary, margin: '4px 0' }}>
                    {l.replace(/\*\*/g, '')}
                  </div>
                ))}
              </div>
            );
          })
        ) : record.userSubmission ? (
          <div>
            <h4
              style={{
                fontSize: 13.5,
                fontWeight: 800,
                color: 'var(--accent)',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-mono)',
                margin: '0 0 8px',
              }}
            >
              Candidate Submission Proof:
            </h4>
            <p style={{ fontSize: 14.5, color: theme.tPrimary, fontStyle: 'italic', margin: '0 0 14px' }}>
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
