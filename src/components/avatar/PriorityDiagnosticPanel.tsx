'use client';

import React from 'react';
import type { PriorityDiagnosticReport } from '@/lib/avatar/priorityBriefing';

export interface PriorityDiagnosticPanelProps {
  report: PriorityDiagnosticReport;
  onNavigate: (path: string) => void;
  onSwitchToChat?: () => void;
}

const IconActivity: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);

const IconCheckCircle: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const IconAlertTriangle: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const IconTarget: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

const IconShieldCheck: React.FC = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <polyline points="9 12 11 14 15 10" />
  </svg>
);

const IconBugAlert: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const IconChevronRight: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

export const PriorityDiagnosticPanel: React.FC<PriorityDiagnosticPanelProps> = ({
  report,
  onNavigate,
  onSwitchToChat,
}) => {
  const telemetryItems: Array<{ label: string; value: string | number; accent?: string }> = [
    { label: 'Lessons', value: report.metrics.completedLessons },
    { label: 'Missions', value: report.metrics.completedMissions },
    { label: 'Active Projects', value: report.metrics.activeProjects },
    { label: 'Career Score', value: report.metrics.careerScore, accent: 'var(--accent)' },
    { label: 'Trust Score', value: report.metrics.trustScore, accent: '#10b981' },
    { label: 'Streak', value: `${report.metrics.missionStreak}d`, accent: '#f59e0b' },
  ];

  return (
    <div
      className="pdp-root"
      style={{
        flex: 1,
        minHeight: 0,
        overflowY: 'auto',
        background: 'var(--bg2)',
        color: 'var(--t1)',
        padding: '16px 18px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
      }}
    >
      {/* 1. Executive Header */}
      <div
        style={{
          background: 'var(--bg3)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          padding: '14px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 12,
            flexWrap: 'wrap',
          }}
        >
          <div style={{ minWidth: 0, flex: 1 }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--accent)',
                fontFamily: 'var(--font-mono)',
                marginBottom: 4,
              }}
            >
              <IconActivity />
              <span>Executive Performance Diagnostic</span>
            </div>
            <h3
              style={{
                margin: 0,
                fontSize: 16,
                fontWeight: 700,
                color: 'var(--t1)',
                fontFamily: 'var(--font-display)',
                lineHeight: 1.25,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {report.studentName}
            </h3>
          </div>

          {onSwitchToChat && (
            <button
              type="button"
              onClick={onSwitchToChat}
              className="pdp-chat-btn"
              style={{
                background: 'var(--accent-light, rgba(99, 102, 241, 0.14))',
                color: 'var(--accent)',
                border: '1px solid rgba(99, 102, 241, 0.35)',
                borderRadius: 8,
                padding: '6px 11px',
                fontSize: 11.5,
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                transition: 'all 0.15s ease',
              }}
            >
              Ask Follow-Up in Chat →
            </button>
          )}
        </div>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px 16px',
            paddingTop: 8,
            borderTop: '1px solid var(--border)',
            fontSize: 11.5,
            color: 'var(--t2)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
            <span style={{ color: 'var(--t3)', fontWeight: 600, textTransform: 'uppercase', fontSize: 10, letterSpacing: '0.05em' }}>
              Target Role
            </span>
            <span style={{ color: 'var(--t1)', fontWeight: 600 }}>{report.targetRole}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
            <span style={{ color: 'var(--t3)', fontWeight: 600, textTransform: 'uppercase', fontSize: 10, letterSpacing: '0.05em' }}>
              Active Track
            </span>
            <span style={{ color: 'var(--t1)', fontWeight: 600 }}>{report.activeCourseTitle}</span>
          </div>
        </div>
      </div>

      {/* 2. Compact 6-Metric Telemetry Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
          gap: 8,
        }}
      >
        {telemetryItems.map((metric) => (
          <div
            key={metric.label}
            style={{
              background: 'var(--bg3)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              padding: '10px 12px',
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
            }}
          >
            <span
              style={{
                fontSize: 10,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: 'var(--t3)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {metric.label}
            </span>
            <span
              style={{
                fontSize: 18,
                fontWeight: 700,
                lineHeight: 1.15,
                color: metric.accent || 'var(--t1)',
                fontVariantNumeric: 'tabular-nums',
                fontFamily: 'var(--font-mono)',
              }}
            >
              {metric.value}
            </span>
          </div>
        ))}
      </div>

      {/* 3. Two-Column Strengths vs Weak Areas & Skill Gaps */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gap: 10,
        }}
      >
        {/* Verified Strong Areas */}
        <section
          aria-label="Verified Strong Areas"
          style={{
            background: 'var(--bg3)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            padding: '12px 13px',
            display: 'flex',
            flexDirection: 'column',
            gap: 9,
            minWidth: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#10b981', fontSize: 11.5, fontWeight: 700 }}>
              <IconCheckCircle />
              <span>Verified Strong Areas</span>
            </div>
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                fontVariantNumeric: 'tabular-nums',
                fontFamily: 'var(--font-mono)',
                color: '#10b981',
                background: 'var(--green-light, rgba(16, 185, 129, 0.14))',
                border: '1px solid rgba(16, 185, 129, 0.28)',
                borderRadius: 999,
                padding: '1px 7px',
              }}
            >
              {report.strongAreas.length}
            </span>
          </div>

          {report.strongAreas.length > 0 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {report.strongAreas.map((area, idx) => (
                <span
                  key={`${area}-${idx}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: 11.5,
                    fontWeight: 500,
                    lineHeight: 1.35,
                    color: 'var(--t1)',
                    background: 'var(--green-light, rgba(16, 185, 129, 0.12))',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: 7,
                    padding: '4px 8px',
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: '#10b981',
                      flexShrink: 0,
                    }}
                  />
                  <span>{area}</span>
                </span>
              ))}
            </div>
          ) : (
            <p style={{ margin: 0, fontSize: 11.5, lineHeight: 1.45, color: 'var(--t3)' }}>
              No benchmarked strengths recorded yet. Complete your first lesson or lab to establish a verified baseline.
            </p>
          )}
        </section>

        {/* Weak Areas & Skill Gaps */}
        <section
          aria-label="Weak Areas and Skill Gaps"
          style={{
            background: 'var(--bg3)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            padding: '12px 13px',
            display: 'flex',
            flexDirection: 'column',
            gap: 9,
            minWidth: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#f59e0b', fontSize: 11.5, fontWeight: 700 }}>
              <IconAlertTriangle />
              <span>Weak Areas &amp; Skill Gaps</span>
            </div>
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                fontVariantNumeric: 'tabular-nums',
                fontFamily: 'var(--font-mono)',
                color: '#f59e0b',
                background: 'var(--amber-light, rgba(245, 158, 11, 0.14))',
                border: '1px solid rgba(245, 158, 11, 0.28)',
                borderRadius: 999,
                padding: '1px 7px',
              }}
            >
              {report.weakAreas.length}
            </span>
          </div>

          {report.weakAreas.length > 0 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {report.weakAreas.map((gap, idx) => (
                <span
                  key={`${gap}-${idx}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: 11.5,
                    fontWeight: 500,
                    lineHeight: 1.35,
                    color: 'var(--t1)',
                    background: 'var(--amber-light, rgba(245, 158, 11, 0.12))',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    borderRadius: 7,
                    padding: '4px 8px',
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: '#f59e0b',
                      flexShrink: 0,
                    }}
                  />
                  <span>{gap}</span>
                </span>
              ))}
            </div>
          ) : (
            <p style={{ margin: 0, fontSize: 11.5, lineHeight: 1.45, color: 'var(--t3)' }}>
              No critical weak areas or role skill gaps are currently flagged.
            </p>
          )}
        </section>
      </div>

      {/* 4. Unresolved AI Mistakes */}
      <section
        data-testid="priority-mistakes-section"
        style={{
          background: 'var(--bg3)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          padding: '13px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: 'var(--t1)' }}>
            <span style={{ color: report.mistakes.length > 0 ? '#f59e0b' : '#10b981', display: 'inline-flex' }}>
              <IconBugAlert />
            </span>
            <span>Unresolved AI Mistakes</span>
          </div>
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              fontVariantNumeric: 'tabular-nums',
              fontFamily: 'var(--font-mono)',
              color: report.mistakes.length > 0 ? '#f59e0b' : '#10b981',
              background:
                report.mistakes.length > 0
                  ? 'var(--amber-light, rgba(245, 158, 11, 0.14))'
                  : 'var(--green-light, rgba(16, 185, 129, 0.14))',
              border: `1px solid ${
                report.mistakes.length > 0
                  ? 'rgba(245, 158, 11, 0.3)'
                  : 'rgba(16, 185, 129, 0.3)'
              }`,
              borderRadius: 999,
              padding: '2px 8px',
            }}
          >
            {report.mistakes.length}
          </span>
        </div>

        {report.mistakes.length === 0 ? (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              alignSelf: 'flex-start',
              padding: '7px 11px',
              borderRadius: 8,
              background: 'var(--green-light, rgba(16, 185, 129, 0.12))',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#10b981',
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            <IconShieldCheck />
            <span>0 Unresolved Mistakes</span>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {report.mistakes.map((mistake, idx) => (
              <button
                key={`${mistake.id}-${idx}`}
                type="button"
                onClick={() => onNavigate('/mirror?tab=twin')}
                className="pdp-mistake-card"
                style={{
                  width: '100%',
                  textAlign: 'left',
                  background: 'var(--bg2)',
                  border: '1px solid var(--border)',
                  borderRadius: 9,
                  padding: '9px 11px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 10,
                  cursor: 'pointer',
                  transition: 'border-color 0.15s ease, background 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0, flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap' }}>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        color: '#f59e0b',
                        background: 'var(--amber-light, rgba(245, 158, 11, 0.15))',
                        border: '1px solid rgba(245, 158, 11, 0.3)',
                        borderRadius: 5,
                        padding: '1px 6px',
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      {mistake.type}
                    </span>
                    <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--t1)' }}>
                      {mistake.module}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: 11.5, lineHeight: 1.4, color: 'var(--t2)' }}>
                    {mistake.description}
                  </p>
                </div>
                <span style={{ color: 'var(--t3)', display: 'inline-flex', flexShrink: 0 }}>
                  <IconChevronRight />
                </span>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* 5. Top Priority Actions */}
      <section
        data-testid="priority-actions-section"
        style={{
          background: 'var(--bg3)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          padding: '13px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: 'var(--t1)' }}>
          <span style={{ color: 'var(--accent)', display: 'inline-flex' }}>
            <IconTarget />
          </span>
          <span>Top Priority Actions</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {report.priorities.map((item) => {
            const isPrimary = item.rank === 1;
            return (
              <div
                key={`${item.rank}-${item.title}`}
                style={{
                  background: 'var(--bg2)',
                  border: isPrimary
                    ? '1px solid rgba(99, 102, 241, 0.38)'
                    : '1px solid var(--border)',
                  borderRadius: 10,
                  padding: '11px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, minWidth: 0, flex: '1 1 200px' }}>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: 26,
                      height: 22,
                      borderRadius: 6,
                      fontSize: 11,
                      fontWeight: 700,
                      fontFamily: 'var(--font-mono)',
                      fontVariantNumeric: 'tabular-nums',
                      flexShrink: 0,
                      background: isPrimary
                        ? 'var(--accent)'
                        : 'var(--bg3)',
                      color: isPrimary ? '#ffffff' : 'var(--t2)',
                      border: isPrimary ? 'none' : '1px solid var(--border)',
                    }}
                  >
                    #{item.rank}
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--t1)', lineHeight: 1.3 }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: 11.5, color: 'var(--t2)', lineHeight: 1.4 }}>
                      {item.reason}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onNavigate(item.href)}
                  className={isPrimary ? 'pdp-cta-primary' : 'pdp-cta-secondary'}
                  style={{
                    background: isPrimary ? 'var(--accent)' : 'var(--bg3)',
                    color: isPrimary ? '#ffffff' : 'var(--t1)',
                    border: isPrimary ? '1px solid transparent' : '1px solid var(--border)',
                    borderRadius: 8,
                    padding: '7px 12px',
                    fontSize: 11.5,
                    fontWeight: 600,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                    transition: 'all 0.15s ease',
                  }}
                >
                  {item.ctaLabel} →
                </button>
              </div>
            );
          })}
        </div>
      </section>

      <style>{`
        .pdp-chat-btn:hover {
          border-color: var(--accent) !important;
          background: rgba(99, 102, 241, 0.22) !important;
        }
        .pdp-mistake-card:hover {
          border-color: rgba(245, 158, 11, 0.45) !important;
        }
        .pdp-cta-primary:hover {
          filter: brightness(1.08);
        }
        .pdp-cta-secondary:hover {
          border-color: var(--accent) !important;
          color: var(--accent) !important;
        }
      `}</style>
    </div>
  );
};
