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

interface ParsedSection {
  title: string;
  lines: string[];
}

export default function MissionsConclusionDetail({ theme, record, onBack }: MissionsConclusionDetailProps) {
  if (!record) return null;

  // Clean structured parser for report sections
  const parseReportSections = (report: string): ParsedSection[] => {
    if (!report) return [];
    const sections: ParsedSection[] = [];
    let cur: ParsedSection | null = null;

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

  // Helper to parse line with bullet and bold key: "• **Key:** Value" or "- **Key:** Value"
  const parseBulletLine = (line: string) => {
    const clean = line.replace(/^[•\s*-]+\s*/, '');
    const boldMatch = clean.match(/^\*\*([^*]+)\*\*:\s*(.*)$/);
    if (boldMatch) {
      return { key: boldMatch[1].trim(), text: boldMatch[2].trim() };
    }
    return { key: null, text: clean.replace(/\*\*/g, '').trim() };
  };

  return (
    <div
      style={{
        background: theme.bgCard,
        border: `1.5px solid ${theme.border}`,
        borderRadius: 24,
        padding: '28px 32px',
        boxShadow: 'var(--shadow-lg)',
      }}
      className="animate-fade-in"
    >
      {/* Top Header & Breadcrumb */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: `1px solid ${theme.border}`,
          paddingBottom: 18,
          marginBottom: 20,
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <button
          onClick={onBack}
          style={{
            background: theme.bgInside,
            border: `1.5px solid ${theme.border}`,
            padding: '9px 18px',
            borderRadius: 12,
            fontSize: 13.5,
            fontWeight: 800,
            cursor: 'pointer',
            color: theme.tPrimary,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: 'var(--shadow-sm)',
            transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--teal)';
            e.currentTarget.style.transform = 'translateX(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = theme.border;
            e.currentTarget.style.transform = 'none';
          }}
        >
          ← Back to History Timeline
        </button>

        <span style={{ fontSize: 12.5, fontFamily: 'var(--font-mono)', color: theme.tTertiary }}>
          Recorded on {record.date || (record.timestamp ? new Date(record.timestamp).toLocaleString() : 'Recent')}
        </span>
      </div>

      {/* Badges Cluster */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 18 }}>
        <span
          style={{
            padding: '6px 14px',
            borderRadius: 10,
            fontSize: 12,
            fontWeight: 800,
            background:
              record.type === 'corporate_comm'
                ? 'rgba(20, 184, 166, 0.12)'
                : record.type === 'daily_mission'
                ? 'rgba(59, 130, 246, 0.12)'
                : 'rgba(168, 85, 247, 0.12)',
            color:
              record.type === 'corporate_comm'
                ? 'var(--teal)'
                : record.type === 'daily_mission'
                ? 'var(--blue)'
                : 'var(--purple)',
            border: `1.5px solid ${
              record.type === 'corporate_comm'
                ? 'rgba(20, 184, 166, 0.3)'
                : record.type === 'daily_mission'
                ? 'rgba(59, 130, 246, 0.3)'
                : 'rgba(168, 85, 247, 0.3)'
            }`,
            fontFamily: 'var(--font-mono)',
            textTransform: 'uppercase',
          }}
        >
          {record.type === 'corporate_comm'
            ? '🎙️ Workplace Comm Session'
            : record.type === 'daily_mission'
            ? '📋 Daily Mission Proof'
            : `🧠 Archetype: ${record.mindsetArchetype || 'Pattern Hunter'}`}
        </span>

        {record.score && (
          <span
            style={{
              padding: '6px 14px',
              borderRadius: 10,
              fontSize: 12,
              fontWeight: 800,
              background: 'rgba(20, 184, 166, 0.12)',
              color: 'var(--teal)',
              border: '1.5px solid rgba(20, 184, 166, 0.3)',
              fontFamily: 'var(--font-mono)',
            }}
          >
            Rating Score: {record.score}/100
          </span>
        )}

        {record.qt2Delta !== undefined && (
          <span
            style={{
              padding: '6px 14px',
              borderRadius: 10,
              fontSize: 12,
              fontWeight: 800,
              background: record.qt2Delta >= 0 ? 'rgba(20, 184, 166, 0.12)' : 'rgba(239, 68, 68, 0.12)',
              color: record.qt2Delta >= 0 ? 'var(--teal)' : 'var(--red)',
              border: `1.5px solid ${
                record.qt2Delta >= 0 ? 'rgba(20, 184, 166, 0.3)' : 'rgba(239, 68, 68, 0.3)'
              }`,
              fontFamily: 'var(--font-mono)',
            }}
          >
            QT2 Delta: {record.qt2Delta >= 0 ? `+${record.qt2Delta}` : record.qt2Delta} pts
          </span>
        )}
      </div>

      {/* Main Title */}
      <h2
        style={{
          fontSize: 24,
          fontWeight: 900,
          color: theme.tPrimary,
          margin: '0 0 20px',
          fontFamily: 'var(--font-display)',
          letterSpacing: '-0.3px',
        }}
      >
        {record.scenarioTitle || record.title || 'Outage Socratic Crisis Simulation'}
      </h2>

      {/* Structured Socratic Report Container */}
      <div
        style={{
          background: theme.bgInside,
          border: `1.5px solid ${theme.border}`,
          borderRadius: 20,
          padding: 24,
          fontSize: 14,
          lineHeight: 1.65,
          color: theme.tSecondary,
          maxHeight: 680,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        {reportSections.length > 0 ? (
          reportSections.map((sec, idx) => {
            const isVerdict = /VERDICT|EVOLUTION SUMMARY|SUMMARY/i.test(sec.title);
            const isStrengths = /STRENGTHS|HANDLED WELL|WHAT YOU HANDLED|HOW YOU HANDLED/i.test(sec.title);
            const isBlindspots = /BLIND SPOTS|WENT WRONG|WHAT WENT WRONG|MISTAKES/i.test(sec.title);
            const isTakeaway = /TAKEAWAY|LEADERSHIP|NEXT STEP|CHALLENGE/i.test(sec.title);
            const isTimeline = /DECISION TIMELINE|TIMELINE|DECISIONS/i.test(sec.title);

            // 1. EXECUTIVE VERDICT & SCORE
            if (isVerdict) {
              // Extract key metrics from lines
              const metrics: { label: string; val: string }[] = [];
              const summaryLines: string[] = [];

              sec.lines.forEach((l) => {
                const match = l.match(/^\*\*([^*]+)\*\*:\s*(.*)$/);
                if (match) {
                  const key = match[1].trim();
                  const val = match[2].trim();
                  if (/Candidate|Rating|Grade|Archetype|Mindset Score Delta/i.test(key)) {
                    metrics.push({ label: key, val });
                  } else {
                    summaryLines.push(val);
                  }
                } else if (l.trim()) {
                  summaryLines.push(l.trim());
                }
              });

              return (
                <div
                  key={idx}
                  style={{
                    background: 'linear-gradient(135deg, rgba(20,184,166,0.12) 0%, rgba(99,102,241,0.08) 100%)',
                    border: '1.5px solid rgba(20,184,166,0.3)',
                    borderRadius: 16,
                    padding: 20,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
                    <span style={{ fontSize: 15, fontWeight: 900, color: 'var(--teal)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span>🏆</span>
                      <span>Executive Verdict &amp; Performance Score</span>
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--teal)', background: 'rgba(20,184,166,0.16)', padding: '4px 12px', borderRadius: 999, border: '1px solid rgba(20,184,166,0.3)' }}>
                      Score: {record.qt2Delta !== undefined ? (record.qt2Delta >= 0 ? `+${record.qt2Delta} pts` : `${record.qt2Delta} pts`) : (record.score ? `${record.score}/100` : '+5 pts')}
                    </span>
                  </div>

                  {metrics.length > 0 && (
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 14 }}>
                      {metrics.map((m, mIdx) => (
                        <div
                          key={mIdx}
                          style={{
                            background: 'color-mix(in srgb, var(--card) 60%, transparent)',
                            border: '1px solid rgba(20,184,166,0.25)',
                            borderRadius: 10,
                            padding: '6px 12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                          }}
                        >
                          <span style={{ fontSize: 11, color: theme.tTertiary, textTransform: 'uppercase', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                            {m.label}:
                          </span>
                          <span style={{ fontSize: 13, fontWeight: 800, color: theme.tPrimary }}>
                            {m.val}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {summaryLines.map((l, lIdx) => (
                    <p key={lIdx} style={{ margin: '0 0 6px', fontSize: 14, color: theme.tPrimary, lineHeight: 1.6, fontWeight: 500 }}>
                      {l.replace(/\*\*/g, '')}
                    </p>
                  ))}
                </div>
              );
            }

            // 2. STRENGTHS (WHAT YOU HANDLED WELL)
            if (isStrengths) {
              return (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(16,185,129,0.08)',
                    border: '1.5px solid rgba(16,185,129,0.25)',
                    borderRadius: 16,
                    padding: 20,
                  }}
                >
                  <h4 style={{ margin: '0 0 12px', fontSize: 14.5, fontWeight: 800, color: '#10b981', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>🟢</span>
                    <span>Key Strengths (What You Handled Well)</span>
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {sec.lines.map((l, lIdx) => {
                      const { key, text } = parseBulletLine(l);
                      return (
                        <div key={lIdx} style={{ fontSize: 13.5, lineHeight: 1.55, color: theme.tPrimary, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                          <span style={{ color: '#10b981', fontWeight: 900, flexShrink: 0, marginTop: 1 }}>✔</span>
                          <div>
                            {key && <strong style={{ color: '#10b981', marginRight: 6 }}>{key}:</strong>}
                            <span>{text}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            }

            // 3. BLIND SPOTS & WHAT WENT WRONG
            if (isBlindspots) {
              return (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(239,68,68,0.08)',
                    border: '1.5px solid rgba(239,68,68,0.25)',
                    borderRadius: 16,
                    padding: 20,
                  }}
                >
                  <h4 style={{ margin: '0 0 12px', fontSize: 14.5, fontWeight: 800, color: '#ef4444', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>🔴</span>
                    <span>Blind Spots &amp; What Went Wrong</span>
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {sec.lines.map((l, lIdx) => {
                      const { key, text } = parseBulletLine(l);
                      return (
                        <div key={lIdx} style={{ fontSize: 13.5, lineHeight: 1.55, color: theme.tPrimary, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                          <span style={{ color: '#ef4444', fontWeight: 900, flexShrink: 0, marginTop: 1 }}>⚠</span>
                          <div>
                            {key && <strong style={{ color: '#ef4444', marginRight: 6 }}>{key}:</strong>}
                            <span>{text}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            }

            // 4. SENIOR LEADERSHIP TAKEAWAY
            if (isTakeaway) {
              return (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(99,102,241,0.08)',
                    border: '1.5px solid rgba(99,102,241,0.25)',
                    borderRadius: 16,
                    padding: 20,
                  }}
                >
                  <h4 style={{ margin: '0 0 10px', fontSize: 14.5, fontWeight: 800, color: '#818cf8', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>🎯</span>
                    <span>Senior Leadership Takeaway</span>
                  </h4>
                  <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: theme.tPrimary, fontWeight: 600, fontStyle: 'italic' }}>
                    &ldquo;{sec.lines.join(' ').replace(/\*\*/g, '').replace(/^"|"$/g, '')}&rdquo;
                  </p>
                </div>
              );
            }

            // 5. DECISION TIMELINE
            if (isTimeline) {
              return (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: `1.5px solid ${theme.border}`,
                    borderRadius: 16,
                    padding: 20,
                  }}
                >
                  <h4 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 800, color: theme.tSecondary, textTransform: 'uppercase', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>📋</span>
                    <span>Decisions Made During Simulation</span>
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {sec.lines.map((l, lIdx) => {
                      const cleanLine = l.replace(/^\d+\.\s*/, '').replace(/^[•\s*-]+\s*/, '').replace(/\*\*/g, '');
                      return (
                        <div
                          key={lIdx}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 10,
                            padding: '8px 12px',
                            background: theme.bgCard,
                            border: `1px solid ${theme.border}`,
                            borderRadius: 10,
                            fontSize: 13,
                            color: theme.tPrimary,
                          }}
                        >
                          <span
                            style={{
                              background: 'rgba(20,184,166,0.12)',
                              color: 'var(--teal)',
                              borderRadius: 6,
                              padding: '2px 7px',
                              fontSize: 11,
                              fontWeight: 800,
                              fontFamily: 'var(--font-mono)',
                              flexShrink: 0,
                            }}
                          >
                            Turn {lIdx + 1}
                          </span>
                          <span style={{ lineHeight: 1.5 }}>{cleanLine}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            }

            // Generic fallback section
            return (
              <div
                key={idx}
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: `1.5px solid ${theme.border}`,
                  borderRadius: 16,
                  padding: 16,
                }}
              >
                <h4 style={{ margin: '0 0 10px', fontSize: 13.5, fontWeight: 800, color: theme.tSecondary, textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                  {sec.title}
                </h4>
                {sec.lines.map((l, lIdx) => (
                  <div key={lIdx} style={{ fontSize: 13, color: theme.tPrimary, margin: '4px 0', lineHeight: 1.55 }}>
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
                margin: '0 0 10px',
              }}
            >
              Candidate Submission Proof:
            </h4>
            <p style={{ fontSize: 14.5, color: theme.tPrimary, fontStyle: 'italic', margin: 0, padding: 16, background: theme.bgCard, borderRadius: 12, border: `1px solid ${theme.border}` }}>
              &ldquo;{record.userSubmission}&rdquo;
            </p>
          </div>
        ) : (
          <p style={{ fontStyle: 'italic', margin: 0 }}>No detailed report text archived for this entry.</p>
        )}
      </div>
    </div>
  );
}
