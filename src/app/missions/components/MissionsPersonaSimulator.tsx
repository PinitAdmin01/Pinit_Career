'use client';

import React, { useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { stopSpeaking } from '@/lib/tts';
import { RoleplayScenario, RoleplayHistoryEntry } from '../hooks/useMissionsState';

const VRoidInterviewAvatar = dynamic(() => import('@/components/avatar/VRoidInterviewAvatar'), { ssr: false });

interface MissionsPersonaSimulatorProps {
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
  roleplayScenario: RoleplayScenario | null;
  roleplayHistory: RoleplayHistoryEntry[];
  roleplayLoading: boolean;
  animState: 'idle' | 'listening' | 'thinking' | 'talking';
  evaluationReport: string;
  evaluationLoading: boolean;
  timerCount: number;
  selectedChoiceIdx: number | null;
  qt2Delta: number;
  sessionElapsed: number;
  handleSelectChoice: (choiceIdx: number) => void;
  updateRoleplayActive: (active: boolean) => void;
  setEvaluationReport: (report: string) => void;
  triggerEvaluation?: (history: RoleplayHistoryEntry[]) => void;
  setActiveTab?: (tab: 'evolve' | 'language' | 'history') => void;
}

export default function MissionsPersonaSimulator({
  theme,
  roleplayScenario,
  roleplayHistory,
  roleplayLoading,
  animState,
  evaluationReport,
  evaluationLoading,
  timerCount,
  selectedChoiceIdx,
  qt2Delta,
  sessionElapsed,
  handleSelectChoice,
  updateRoleplayActive,
  setEvaluationReport,
  triggerEvaluation,
  setActiveTab,
}: MissionsPersonaSimulatorProps) {
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [roleplayHistory, roleplayLoading]);

  // Keyboard shortcut listener for options (1-4, A-D)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedChoiceIdx !== null || roleplayLoading || evaluationLoading || evaluationReport) return;
      const choices = roleplayScenario?.choices || [];
      if (!choices.length) return;

      const key = e.key.toUpperCase();
      let idx = -1;
      if (key === '1' || key === 'A') idx = 0;
      else if (key === '2' || key === 'B') idx = 1;
      else if (key === '3' || key === 'C') idx = 2;
      else if (key === '4' || key === 'D') idx = 3;

      if (idx >= 0 && idx < choices.length) {
        handleSelectChoice(idx);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [roleplayScenario, selectedChoiceIdx, roleplayLoading, evaluationLoading, evaluationReport, handleSelectChoice]);

  // Clean structured parser for evaluation report sections
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

  const reportSections = parseReportSections(evaluationReport);

  return (
    <div
      style={{
        width: '100%',
        minHeight: 'calc(100vh - 32px)',
        margin: '0 auto',
        background: theme.bg,
        color: theme.tPrimary,
        padding: '16px 20px',
        borderRadius: '24px',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
      className="animate-fade-in"
    >
      {/* Active 3D Roleplay Workspace Banner */}
      <div
        style={{
          flex: 1,
          background: theme.bgCard,
          border: `1.5px solid ${theme.border}`,
          borderRadius: '24px',
          padding: '22px 24px',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
          boxSizing: 'border-box',
          transition: 'all 0.3s',
        }}
      >
        {/* Top Header Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: `1px solid ${theme.border}`,
            paddingBottom: 12,
            flexWrap: 'wrap',
            gap: 10,
          }}
        >
          <div>
            <h2
              style={{
                fontSize: 18,
                fontWeight: 900,
                color: 'var(--accent)',
                margin: 0,
                textTransform: 'uppercase',
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.5px',
              }}
            >
              ⚡ {roleplayScenario?.scenarioTitle || 'Synthesizing Crisis...'}
            </h2>
            <span style={{ fontSize: 12, color: theme.tSecondary }}>
              Mindset scaling active: Onboarding QT2 index
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span
              style={{
                background: 'rgba(99, 102, 241, 0.12)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                color: '#818cf8',
                fontSize: 11,
                fontWeight: 700,
                padding: '4px 10px',
                borderRadius: 999,
                fontFamily: 'var(--font-mono)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
              }}
            >
              🎮 GAMING MODE ACTIVE · 100% IMMERSIVE
            </span>
            <button
              type="button"
              onClick={() => {
                if (typeof document !== 'undefined') {
                  if (!document.fullscreenElement) {
                    document.documentElement.requestFullscreen().catch(() => {});
                  } else {
                    document.exitFullscreen().catch(() => {});
                  }
                }
              }}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: `1px solid ${theme.border}`,
                padding: '5px 12px',
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                color: theme.tPrimary,
                transition: 'all 0.2s ease-out',
              }}
              title="Toggle Fullscreen"
            >
              ⛶ Fullscreen
            </button>
            <button
              type="button"
              onClick={() => {
                if (
                  window.confirm(
                    'Are you sure you want to abort this mindset simulation session? Your progress will not be saved.'
                  )
                ) {
                  if (typeof document !== 'undefined' && document.fullscreenElement) {
                    document.exitFullscreen().catch(() => {});
                  }
                  stopSpeaking();
                  updateRoleplayActive(false);
                }
              }}
              style={{
                background: 'rgba(var(--danger-rgb), 0.05)',
                border: '1px solid rgba(var(--danger-rgb), 0.2)',
                padding: '5px 12px',
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                color: 'var(--red)',
                transition: 'all 0.2s ease-out',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(var(--danger-rgb), 0.12)';
                e.currentTarget.style.borderColor = 'var(--red)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(var(--danger-rgb), 0.05)';
                e.currentTarget.style.borderColor = 'rgba(var(--danger-rgb), 0.2)';
              }}
            >
              ✕ Abort Session
            </button>
          </div>
        </div>

        {/* Main Grid: Responsive 2-column layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 1.8fr',
            gap: 20,
            alignItems: 'start',
          }}
        >
          {/* Left Column Container: 3D Feed + Situation Summary */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Left Column: 3D Telemetry Feed */}
            <div
              style={{
                height: 380,
                background: theme.bgInside,
                border: `1.5px solid ${theme.border}`,
                borderRadius: 16,
                padding: 14,
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--red)',
                    letterSpacing: '0.6px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: 'var(--red)',
                      boxShadow: '0 0 8px var(--red)',
                    }}
                  />
                  LIVE FEED
                </span>
                <span
                  className={timerCount < 8 ? 'timer-pulse-low' : ''}
                  style={{
                    fontSize: 12.5,
                    fontWeight: 800,
                    fontFamily: 'var(--font-mono)',
                    color: timerCount < 8 ? 'var(--red)' : 'var(--accent)',
                    transition: 'all 0.25s ease-out',
                    display: 'inline-block',
                  }}
                >
                  ⏱ {timerCount}s left
                </span>
              </div>

              {/* Progress countdown bar */}
              <div style={{ height: 4, background: theme.border, borderRadius: 2, overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${Math.min(100, Math.max(0, (timerCount / 45) * 100))}%`,
                    background: timerCount < 8 ? 'var(--red)' : 'var(--accent)',
                    transition: 'width 1s linear',
                  }}
                />
              </div>

              {/* VRoid Avatar Container */}
              <div
                className={
                  animState === 'listening'
                    ? 'avatar-border-listening'
                    : animState === 'thinking'
                    ? 'avatar-border-thinking'
                    : animState === 'talking'
                    ? 'avatar-border-talking'
                    : 'avatar-border-idle'
                }
                style={{
                  flex: 1,
                  borderRadius: 12,
                  overflow: 'hidden',
                  background: '#0a0a0a',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                }}
              >
                {roleplayScenario?.activeAvatar ? (
                  <VRoidInterviewAvatar
                    teacherId={roleplayScenario.activeAvatar}
                    animState={animState}
                    zoom={1.45}
                    visible={true}
                  />
                ) : (
                  <div
                    style={{
                      display: 'flex',
                      height: '100%',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: theme.tTertiary,
                      fontSize: 14.5,
                      fontWeight: 700,
                    }}
                  >
                    Syncing 3D Node...
                  </div>
                )}
              </div>

              {/* Avatar identity footer */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ fontSize: 13.5, fontWeight: 800, color: theme.tPrimary }}>
                  {roleplayScenario?.avatarName || 'Scanning...'}
                </span>
                <span style={{ fontSize: 11, color: theme.tTertiary, fontFamily: 'var(--font-mono)' }}>
                  {roleplayScenario?.avatarRole || 'Limbic Sensor Active'}
                </span>
              </div>
            </div>

            {/* Situation Summary Panel */}
            <div
              className="summary-container-glow"
              style={{
                background: theme.bgInside,
                border: `1px solid ${theme.border}`,
                borderRadius: 16,
                padding: 14,
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                maxHeight: 180,
                overflow: 'hidden',
                transition: 'all 0.3s ease-out',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                  paddingBottom: 6,
                }}
              >
                <span
                  style={{
                    fontSize: 10.5,
                    fontWeight: 900,
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--accent)',
                    letterSpacing: '0.6px',
                  }}
                >
                  📋 SITUATION SUMMARY
                </span>
                <span
                  style={{
                    fontSize: 10.5,
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--accent)',
                    fontWeight: 700,
                  }}
                >
                  ⏳ {Math.floor(sessionElapsed / 60).toString().padStart(2, '0')}:
                  {(sessionElapsed % 60).toString().padStart(2, '0')} / 15:00 Simulation
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, lineHeight: 1.45 }}>
                <div>
                  <strong
                    style={{
                      color: theme.tSecondary,
                      fontSize: 11,
                      display: 'block',
                      textTransform: 'uppercase',
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    Phase {Math.min(5, Math.floor(roleplayHistory.filter((h) => h.role === 'user').length / 2) + 1)} of 5 • Turn {roleplayHistory.filter((h) => h.role === 'user').length + 1} of 10
                  </strong>
                  <span style={{ color: theme.tPrimary, fontWeight: 600 }}>
                    {roleplayScenario?.scenarioTitle || 'Synthesizing scenario parameters...'}
                  </span>
                </div>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: 6 }}>
                  <strong
                    style={{
                      color: theme.tSecondary,
                      fontSize: 11,
                      display: 'block',
                      textTransform: 'uppercase',
                      fontFamily: 'var(--font-mono)',
                      marginBottom: 2,
                    }}
                  >
                    Decisions Logged ({roleplayHistory.filter((h) => h.role === 'user').length})
                  </strong>
                  {roleplayHistory.filter((h) => h.role === 'user').length === 0 ? (
                    <span style={{ color: theme.tTertiary, fontStyle: 'italic', fontSize: 11.5 }}>
                      Awaiting candidate's first action response...
                    </span>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 68, overflowY: 'auto' }}>
                      {roleplayHistory
                        .filter((h) => h.role === 'user')
                        .map((c, i) => (
                          <div key={i} style={{ display: 'flex', gap: 4, color: theme.tPrimary, fontSize: 11.5 }}>
                            <span style={{ color: 'var(--accent)', fontWeight: 800 }}>{i + 1}.</span>
                            <span
                              style={{
                                textOverflow: 'ellipsis',
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                                maxWidth: 220,
                              }}
                              title={c.content}
                            >
                              {c.content}
                            </span>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Dialogue Console & Interactive Choice / Evaluation Stage */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, minHeight: 0 }}>
            {/* Chat Bubble Logs */}
            <div
              style={{
                height: 310,
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                background: theme.bgInside,
                borderRadius: 16,
                padding: 14,
                border: `1px solid ${theme.border}`,
              }}
            >
              {roleplayHistory.map((h, i) => {
                const isUser = h.role === 'user';
                let speakerName = 'Candidate';
                let bubbleText = h.content;

                if (!isUser) {
                  const match = h.content.match(/^([^:]+):\s*(.*)$/);
                  if (match) {
                    speakerName = match[1].trim();
                    bubbleText = match[2].trim();
                    if (bubbleText.startsWith("'") && bubbleText.endsWith("'")) {
                      bubbleText = bubbleText.slice(1, -1);
                    } else if (bubbleText.startsWith('"') && bubbleText.endsWith('"')) {
                      bubbleText = bubbleText.slice(1, -1);
                    }
                  } else {
                    speakerName = roleplayScenario?.avatarName || 'System Mentor';
                  }
                }

                return (
                  <div
                    key={i}
                    style={{
                      alignSelf: isUser ? 'flex-end' : 'flex-start',
                      maxWidth: '86%',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 3,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: isUser ? 'var(--teal)' : 'var(--accent)',
                        alignSelf: isUser ? 'flex-end' : 'flex-start',
                        textTransform: 'uppercase',
                        fontFamily: 'var(--font-mono)',
                        letterSpacing: '0.5px',
                      }}
                    >
                      {isUser ? '👤 You' : `🎙️ ${speakerName}`}
                    </span>
                    <div
                      style={{
                        background: isUser ? 'rgba(var(--accent-teal-rgb), 0.08)' : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${isUser ? 'rgba(var(--accent-teal-rgb), 0.18)' : theme.border}`,
                        padding: '10px 14px',
                        borderRadius: '16px',
                        borderTopRightRadius: isUser ? '4px' : '16px',
                        borderTopLeftRadius: isUser ? '16px' : '4px',
                      }}
                    >
                      <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.5, color: theme.tPrimary }}>
                        {bubbleText}
                      </p>
                    </div>
                  </div>
                );
              })}
              {roleplayLoading && (
                <div style={{ color: theme.tTertiary, fontSize: 13, fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span className="animate-spin">⏳</span> Synthesizing dynamic branch parameters...
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Interactive Choices or Socratic Report Panel */}
            <div>
              {evaluationLoading ? (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <span style={{ fontSize: 26.5, display: 'block', marginBottom: 8 }} className="animate-spin">
                    🔄
                  </span>
                  <span style={{ fontSize: 14.5, fontWeight: 700, color: 'var(--accent)' }}>
                    Compiling Socratic Evolution Report...
                  </span>
                  <p style={{ fontSize: 12, color: theme.tTertiary, marginTop: 4 }}>
                    Analyzing natural blindness metrics and System 1/2 triggers against strategic literatures.
                  </p>
                </div>
              ) : evaluationReport ? (
                /* Human-Understandable Socratic Evaluation Report View */
                <div
                  style={{
                    background: 'rgba(var(--accent-teal-rgb), 0.03)',
                    border: '1.5px solid rgba(var(--accent-teal-rgb), 0.22)',
                    borderRadius: 16,
                    padding: 16,
                  }}
                >
                  <h3
                    style={{
                      margin: '0 0 10px',
                      fontSize: 15.5,
                      fontWeight: 800,
                      color: 'var(--teal)',
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span>🧠 Socratic Evolution Report</span>
                    <span>Score: {qt2Delta > 0 ? `+${qt2Delta}` : qt2Delta} points</span>
                  </h3>

                  {/* Scrollable Report Content */}
                  <div
                    style={{
                      maxHeight: 280,
                      overflowY: 'auto',
                      paddingRight: 4,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 10,
                      fontSize: 13,
                      lineHeight: 1.6,
                      color: theme.tSecondary,
                    }}
                    className="socratic-report-content"
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
                                border: '1px solid rgba(20,184,166,0.3)',
                                borderRadius: 12,
                                padding: 12,
                              }}
                            >
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                                <span style={{ fontSize: 13.5, fontWeight: 900, color: 'var(--teal)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                                  🏆 Executive Verdict & Score
                                </span>
                              </div>
                              {sec.lines.map((l, lIdx) => (
                                <p key={lIdx} style={{ margin: '0 0 4px', fontSize: 13, color: theme.tPrimary, fontWeight: 600 }}>
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
                                borderRadius: 12,
                                padding: 12,
                              }}
                            >
                              <h4 style={{ margin: '0 0 6px', fontSize: 13, fontWeight: 800, color: '#10b981', display: 'flex', alignItems: 'center', gap: 6 }}>
                                🟢 Key Strengths (What You Handled Well)
                              </h4>
                              {sec.lines.map((l, lIdx) => (
                                <div key={lIdx} style={{ fontSize: 12.5, lineHeight: 1.5, color: theme.tPrimary, margin: '2px 0' }}>
                                  {l.replace(/^[•\s*-]+\s*/, '✔ ').replace(/\*\*/g, '')}
                                </div>
                              ))}
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
                                borderRadius: 12,
                                padding: 12,
                              }}
                            >
                              <h4 style={{ margin: '0 0 6px', fontSize: 13, fontWeight: 800, color: '#ef4444', display: 'flex', alignItems: 'center', gap: 6 }}>
                                🔴 Blind Spots & What Went Wrong
                              </h4>
                              {sec.lines.map((l, lIdx) => (
                                <div key={lIdx} style={{ fontSize: 12.5, lineHeight: 1.5, color: theme.tPrimary, margin: '2px 0' }}>
                                  {l.replace(/^[•\s*-]+\s*/, '⚠ ').replace(/\*\*/g, '')}
                                </div>
                              ))}
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
                                borderRadius: 12,
                                padding: 12,
                              }}
                            >
                              <h4 style={{ margin: '0 0 4px', fontSize: 13, fontWeight: 800, color: '#818cf8', display: 'flex', alignItems: 'center', gap: 6 }}>
                                🎯 Senior Leadership Takeaway
                              </h4>
                              <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.5, color: theme.tPrimary, fontWeight: 600 }}>
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
                              borderRadius: 12,
                              padding: 10,
                            }}
                          >
                            <h4 style={{ margin: '0 0 4px', fontSize: 12.5, fontWeight: 800, color: theme.tSecondary, textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                              {sec.title}
                            </h4>
                            {sec.lines.map((l, lIdx) => (
                              <div key={lIdx} style={{ fontSize: 12, color: theme.tPrimary, margin: '2px 0' }}>
                                {l.replace(/\*\*/g, '')}
                              </div>
                            ))}
                          </div>
                        );
                      })
                    ) : (
                      evaluationReport.split('\n').map((line, idx) => (
                        <p key={idx} style={{ margin: '0 0 8px' }}>
                          {line}
                        </p>
                      ))
                    )}
                  </div>

                  {/* Task 4: PINNED Save & Return Action Buttons Bar (Permanently Visible outside scroll) */}
                  <div
                    style={{
                      display: 'flex',
                      gap: 10,
                      marginTop: 12,
                      paddingTop: 12,
                      borderTop: `1px solid ${theme.border}`,
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        if (typeof document !== 'undefined' && document.fullscreenElement) {
                          document.exitFullscreen().catch(() => {});
                        }
                        stopSpeaking();
                        updateRoleplayActive(false);
                        setEvaluationReport('');
                        setActiveTab?.('history');
                        if (typeof window !== 'undefined') {
                          window.history.pushState(null, '', '/missions?tab=history');
                        }
                      }}
                      className="btn-primary"
                      style={{
                        flex: 1,
                        padding: '10px 14px',
                        fontSize: 13,
                        fontWeight: 800,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6,
                        background: 'var(--teal)',
                        color: '#000',
                        border: 'none',
                        borderRadius: 10,
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(20, 184, 166, 0.25)',
                      }}
                    >
                      💾 Save & View History
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (typeof document !== 'undefined' && document.fullscreenElement) {
                          document.exitFullscreen().catch(() => {});
                        }
                        stopSpeaking();
                        updateRoleplayActive(false);
                        setEvaluationReport('');
                        setActiveTab?.('evolve');
                        if (typeof window !== 'undefined') {
                          window.history.pushState(null, '', '/missions?tab=evolve');
                        }
                      }}
                      className="btn-primary btn-sm"
                      style={{
                        flex: 1,
                        padding: '10px 14px',
                        fontSize: 13,
                        fontWeight: 700,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6,
                        background: theme.bgInside,
                        border: `1px solid ${theme.border}`,
                        color: theme.tPrimary,
                        borderRadius: 10,
                        cursor: 'pointer',
                      }}
                    >
                      Return to Command Center
                    </button>
                  </div>
                </div>
              ) : roleplayScenario && roleplayScenario.isEnded ? (
                <div
                  style={{
                    background: 'rgba(20, 184, 166, 0.08)',
                    border: '1.5px solid rgba(20, 184, 166, 0.3)',
                    borderRadius: 14,
                    padding: '16px 20px',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 10,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="animate-spin" style={{ fontSize: 16 }}>🔄</span>
                    <span style={{ fontSize: 13.5, fontWeight: 800, color: 'var(--teal)' }}>
                      Crisis Simulation Concluded · Generating Mindset Report...
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: 12, color: theme.tSecondary }}>
                    Synthesizing your decisions into leadership competencies and cognitive archetype.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      if (triggerEvaluation) {
                        triggerEvaluation(roleplayHistory);
                      }
                    }}
                    className="btn-primary"
                    style={{
                      padding: '8px 18px',
                      fontSize: 12.5,
                      fontWeight: 800,
                      borderRadius: 8,
                      cursor: 'pointer',
                      background: 'var(--teal)',
                      color: '#000',
                      border: 'none',
                      marginTop: 4,
                    }}
                  >
                    View Evolution Report Now ➔
                  </button>
                </div>
              ) : roleplayScenario && roleplayScenario.choices && roleplayScenario.choices.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                    <span
                      style={{
                        fontSize: 12.5,
                        fontWeight: 800,
                        color: theme.tPrimary,
                      }}
                    >
                      👉 Choose how you would respond:
                    </span>
                    <span style={{ fontSize: 11, color: theme.tTertiary, fontFamily: 'var(--font-mono)' }}>
                      Keys: 1-4 or A-D
                    </span>
                  </div>
                  {roleplayScenario.choices.map((c, idx) => (
                    <button
                      key={idx}
                      disabled={selectedChoiceIdx !== null || roleplayLoading}
                      onClick={() => handleSelectChoice(idx)}
                      style={{
                        background: selectedChoiceIdx === idx ? 'rgba(var(--accent-teal-rgb), 0.08)' : theme.bgInside,
                        border: `1px solid ${selectedChoiceIdx === idx ? 'var(--teal)' : theme.border}`,
                        borderRadius: 12,
                        padding: '11px 15px',
                        textAlign: 'left',
                        fontSize: 13.5,
                        cursor: (selectedChoiceIdx !== null || roleplayLoading) ? 'not-allowed' : 'pointer',
                        color: theme.tPrimary,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        opacity: (selectedChoiceIdx !== null || roleplayLoading) && selectedChoiceIdx !== idx ? 0.5 : 1,
                        transition: 'all 0.2s',
                        boxShadow: selectedChoiceIdx === idx ? '0 0 12px rgba(20, 184, 166, 0.2)' : 'none',
                      }}
                      className="choice-card"
                    >
                      <span
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: '50%',
                          background: selectedChoiceIdx === idx ? 'var(--teal)' : theme.bgCard,
                          border: `1.5px solid ${selectedChoiceIdx === idx ? 'var(--teal)' : theme.border}`,
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 11,
                          fontWeight: 900,
                          color: selectedChoiceIdx === idx ? '#000' : theme.tSecondary,
                          flexShrink: 0,
                        }}
                      >
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span style={{ flex: 1, lineHeight: 1.45 }}>{c.text}</span>
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
