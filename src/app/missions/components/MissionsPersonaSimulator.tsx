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
  setActiveTab?: (tab: 'evolve' | 'language' | 'history' | 'comm') => void;
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

  const parseBulletLine = (line: string) => {
    const clean = line.replace(/^[•\s*-]+\s*/, '');
    const boldMatch = clean.match(/^\*\*([^*]+)\*\*:\s*(.*)$/);
    if (boldMatch) {
      return { key: boldMatch[1].trim(), text: boldMatch[2].trim() };
    }
    return { key: null, text: clean.replace(/\*\*/g, '').trim() };
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
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      className="animate-fade-in"
    >
      <style>{`
        @keyframes live-pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.85); }
        }
        @keyframes timer-urgency-blink {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.7; }
        }
        .live-dot-pulse {
          animation: live-pulse-dot 1.4s ease-in-out infinite;
        }
        .timer-urgency-pulse {
          animation: timer-urgency-blink 0.8s ease-in-out infinite;
        }
        .simulator-choice-card {
          transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .simulator-choice-card:hover:not(:disabled) {
          transform: translateY(-2px);
          border-color: var(--teal) !important;
          box-shadow: 0 6px 20px rgba(20, 184, 166, 0.16);
        }
        .simulator-choice-card:active:not(:disabled) {
          transform: translateY(0);
        }
        .custom-thin-scroll::-webkit-scrollbar {
          width: 5px;
        }
        .custom-thin-scroll::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 999px;
        }
        .custom-thin-scroll::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.12);
          border-radius: 999px;
        }
        .custom-thin-scroll::-webkit-scrollbar-thumb:hover {
          background: var(--teal);
        }
      `}</style>

      {/* Active 3D Roleplay Workspace Banner */}
      <div
        style={{
          flex: 1,
          background: theme.bgCard,
          border: `1.5px solid ${theme.border}`,
          borderRadius: '24px',
          padding: '24px 28px',
          boxShadow: '0 20px 50px -12px rgba(0,0,0,0.5)',
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
          boxSizing: 'border-box',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Top Header Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: `1px solid ${theme.border}`,
            paddingBottom: 14,
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span
                style={{
                  fontSize: 18,
                  fontWeight: 900,
                  color: 'var(--accent)',
                  margin: 0,
                  textTransform: 'uppercase',
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '0.6px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                ⚡ {roleplayScenario?.scenarioTitle || 'Synthesizing Crisis...'}
              </span>
            </div>
            <span style={{ fontSize: 12.5, color: theme.tSecondary, fontWeight: 500 }}>
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
                fontWeight: 800,
                padding: '5px 12px',
                borderRadius: 999,
                fontFamily: 'var(--font-mono)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                letterSpacing: '0.5px',
                boxShadow: '0 0 12px rgba(99,102,241,0.15)',
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
                padding: '6px 14px',
                borderRadius: 10,
                fontSize: 12.5,
                fontWeight: 700,
                cursor: 'pointer',
                color: theme.tPrimary,
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
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
                background: 'rgba(var(--danger-rgb), 0.06)',
                border: '1px solid rgba(var(--danger-rgb), 0.25)',
                padding: '6px 14px',
                borderRadius: 10,
                fontSize: 12.5,
                fontWeight: 700,
                cursor: 'pointer',
                color: 'var(--red)',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(var(--danger-rgb), 0.15)';
                e.currentTarget.style.borderColor = 'var(--red)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(var(--danger-rgb), 0.06)';
                e.currentTarget.style.borderColor = 'rgba(var(--danger-rgb), 0.25)';
                e.currentTarget.style.transform = 'translateY(0)';
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
                borderRadius: 18,
                padding: 16,
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                position: 'relative',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 900,
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--red)',
                    letterSpacing: '0.8px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <span
                    className="live-dot-pulse"
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: 'var(--red)',
                      boxShadow: '0 0 10px #ef4444',
                    }}
                  />
                  LIVE FEED
                </span>
                <span
                  className={timerCount < 8 ? 'timer-urgency-pulse' : ''}
                  style={{
                    fontSize: 12.5,
                    fontWeight: 800,
                    fontFamily: 'var(--font-mono)',
                    color: timerCount < 8 ? 'var(--red)' : 'var(--accent)',
                    transition: 'all 0.25s ease-out',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
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
                    borderRadius: 2,
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
                  borderRadius: 14,
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
                <span style={{ fontSize: 14, fontWeight: 900, color: theme.tPrimary, letterSpacing: '-0.2px' }}>
                  {roleplayScenario?.avatarName || 'Scanning...'}
                </span>
                <span style={{ fontSize: 11.5, color: theme.tTertiary, fontFamily: 'var(--font-mono)' }}>
                  {roleplayScenario?.avatarRole || 'Limbic Sensor Active'}
                </span>
              </div>
            </div>

            {/* Situation Summary Panel */}
            <div
              className="summary-container-glow"
              style={{
                background: theme.bgInside,
                border: `1.5px solid ${theme.border}`,
                borderRadius: 18,
                padding: 16,
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                maxHeight: 180,
                overflow: 'hidden',
                transition: 'all 0.3s ease-out',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                  paddingBottom: 8,
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 900,
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--accent)',
                    letterSpacing: '0.8px',
                  }}
                >
                  📋 SITUATION SUMMARY
                </span>
                <span
                  style={{
                    fontSize: 11,
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--accent)',
                    fontWeight: 800,
                  }}
                >
                  ⏳ {Math.floor(sessionElapsed / 60).toString().padStart(2, '0')}:
                  {(sessionElapsed % 60).toString().padStart(2, '0')} / 15:00 Simulation
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12.5, lineHeight: 1.45 }}>
                <div>
                  <strong
                    style={{
                      color: theme.tSecondary,
                      fontSize: 11,
                      display: 'block',
                      textTransform: 'uppercase',
                      fontFamily: 'var(--font-mono)',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Phase {Math.min(5, Math.floor(roleplayHistory.filter((h) => h.role === 'user').length / 2) + 1)} of 5 • Turn {roleplayHistory.filter((h) => h.role === 'user').length + 1} of 10
                  </strong>
                  <span style={{ color: theme.tPrimary, fontWeight: 700 }}>
                    {roleplayScenario?.scenarioTitle || 'Synthesizing scenario parameters...'}
                  </span>
                </div>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 6 }}>
                  <strong
                    style={{
                      color: theme.tSecondary,
                      fontSize: 11,
                      display: 'block',
                      textTransform: 'uppercase',
                      fontFamily: 'var(--font-mono)',
                      marginBottom: 4,
                      letterSpacing: '0.5px',
                    }}
                  >
                    Decisions Logged ({roleplayHistory.filter((h) => h.role === 'user').length})
                  </strong>
                  {roleplayHistory.filter((h) => h.role === 'user').length === 0 ? (
                    <span style={{ color: theme.tTertiary, fontStyle: 'italic', fontSize: 11.5 }}>
                      Awaiting candidate's first action response...
                    </span>
                  ) : (
                    <div className="custom-thin-scroll" style={{ display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 68, overflowY: 'auto', paddingRight: 4 }}>
                      {roleplayHistory
                        .filter((h) => h.role === 'user')
                        .map((c, i) => (
                          <div key={i} style={{ display: 'flex', gap: 6, color: theme.tPrimary, fontSize: 11.5 }}>
                            <span style={{ color: 'var(--accent)', fontWeight: 800 }}>{i + 1}.</span>
                            <span
                              style={{
                                textOverflow: 'ellipsis',
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                                maxWidth: 240,
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minHeight: 0 }}>
            {/* Chat Bubble Logs */}
            <div
              className="custom-thin-scroll"
              style={{
                height: 310,
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                background: theme.bgInside,
                borderRadius: 18,
                padding: 16,
                border: `1.5px solid ${theme.border}`,
                boxShadow: 'var(--shadow-sm)',
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
                      maxWidth: '88%',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 4,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 10.5,
                        fontWeight: 800,
                        color: isUser ? 'var(--teal)' : 'var(--accent)',
                        alignSelf: isUser ? 'flex-end' : 'flex-start',
                        textTransform: 'uppercase',
                        fontFamily: 'var(--font-mono)',
                        letterSpacing: '0.6px',
                      }}
                    >
                      {isUser ? '👤 You' : `🎙️ ${speakerName}`}
                    </span>
                    <div
                      style={{
                        background: isUser ? 'linear-gradient(135deg, rgba(20,184,166,0.12) 0%, rgba(99,102,241,0.08) 100%)' : 'rgba(255,255,255,0.035)',
                        border: `1.5px solid ${isUser ? 'rgba(20,184,166,0.3)' : theme.border}`,
                        padding: '12px 16px',
                        borderRadius: '16px',
                        borderTopRightRadius: isUser ? '4px' : '16px',
                        borderTopLeftRadius: isUser ? '16px' : '4px',
                        boxShadow: isUser ? '0 4px 14px rgba(20,184,166,0.12)' : 'none',
                      }}
                    >
                      <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.55, color: theme.tPrimary }}>
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
                <div style={{ textAlign: 'center', padding: '24px 0', background: theme.bgInside, borderRadius: 16, border: `1.5px solid ${theme.border}` }}>
                  <span style={{ fontSize: 28, display: 'block', marginBottom: 8 }} className="animate-spin">
                    🔄
                  </span>
                  <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--accent)' }}>
                    Compiling Socratic Evolution Report...
                  </span>
                  <p style={{ fontSize: 12.5, color: theme.tTertiary, marginTop: 4 }}>
                    Analyzing natural blindness metrics and System 1/2 triggers against strategic literatures.
                  </p>
                </div>
              ) : evaluationReport ? (
                /* Human-Understandable Socratic Evaluation Report View */
                <div
                  style={{
                    background: 'rgba(var(--accent-teal-rgb), 0.03)',
                    border: '1.5px solid rgba(var(--accent-teal-rgb), 0.22)',
                    borderRadius: 18,
                    padding: 18,
                    boxShadow: 'var(--shadow-md)',
                  }}
                >
                  <h3
                    style={{
                      margin: '0 0 12px',
                      fontSize: 16,
                      fontWeight: 800,
                      color: 'var(--teal)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span>🧠 Socratic Evolution Report</span>
                    <span style={{ fontSize: 13, background: 'rgba(20,184,166,0.15)', padding: '3px 10px', borderRadius: 999 }}>
                      Score: {qt2Delta > 0 ? `+${qt2Delta}` : qt2Delta} points
                    </span>
                  </h3>

                  {/* Scrollable Report Content */}
                  <div
                    className="custom-thin-scroll"
                    style={{
                      maxHeight: 280,
                      overflowY: 'auto',
                      paddingRight: 6,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 12,
                      fontSize: 13,
                      lineHeight: 1.6,
                      color: theme.tSecondary,
                    }}
                  >
                    {reportSections.length > 0 ? (
                      reportSections.map((sec, idx) => {
                        const isVerdict = /VERDICT|EVOLUTION SUMMARY|SUMMARY/i.test(sec.title);
                        const isStrengths = /STRENGTHS|HANDLED WELL|WHAT YOU HANDLED|HOW YOU HANDLED/i.test(sec.title);
                        const isBlindspots = /BLIND SPOTS|WENT WRONG|WHAT WENT WRONG|MISTAKES/i.test(sec.title);
                        const isTakeaway = /TAKEAWAY|LEADERSHIP|NEXT STEP|CHALLENGE/i.test(sec.title);
                        const isTimeline = /DECISION TIMELINE|TIMELINE|DECISIONS/i.test(sec.title);

                        if (isVerdict) {
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
                                borderRadius: 14,
                                padding: 14,
                              }}
                            >
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, flexWrap: 'wrap', gap: 6 }}>
                                <span style={{ fontSize: 13.5, fontWeight: 900, color: 'var(--teal)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                                  🏆 Executive Verdict & Score
                                </span>
                              </div>

                              {metrics.length > 0 && (
                                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
                                  {metrics.map((m, mIdx) => (
                                    <div
                                      key={mIdx}
                                      style={{
                                        background: 'rgba(0,0,0,0.25)',
                                        border: '1px solid rgba(20,184,166,0.2)',
                                        borderRadius: 8,
                                        padding: '4px 8px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 5,
                                      }}
                                    >
                                      <span style={{ fontSize: 10.5, color: theme.tTertiary, textTransform: 'uppercase', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                                        {m.label}:
                                      </span>
                                      <span style={{ fontSize: 12, fontWeight: 800, color: theme.tPrimary }}>
                                        {m.val}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {summaryLines.map((l, lIdx) => (
                                <p key={lIdx} style={{ margin: '0 0 4px', fontSize: 12.5, color: theme.tPrimary, lineHeight: 1.55, fontWeight: 500 }}>
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
                                border: '1.5px solid rgba(16,185,129,0.25)',
                                borderRadius: 14,
                                padding: 14,
                              }}
                            >
                              <h4 style={{ margin: '0 0 8px', fontSize: 13.5, fontWeight: 800, color: '#10b981', display: 'flex', alignItems: 'center', gap: 6 }}>
                                🟢 Key Strengths (What You Handled Well)
                              </h4>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                {sec.lines.map((l, lIdx) => {
                                  const { key, text } = parseBulletLine(l);
                                  return (
                                    <div key={lIdx} style={{ fontSize: 12.5, lineHeight: 1.5, color: theme.tPrimary, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                                      <span style={{ color: '#10b981', fontWeight: 900, flexShrink: 0 }}>✔</span>
                                      <div>
                                        {key && <strong style={{ color: '#10b981', marginRight: 4 }}>{key}:</strong>}
                                        <span>{text}</span>
                                      </div>
                                    </div>
                                  );
                                })}
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
                                border: '1.5px solid rgba(239,68,68,0.25)',
                                borderRadius: 14,
                                padding: 14,
                              }}
                            >
                              <h4 style={{ margin: '0 0 8px', fontSize: 13.5, fontWeight: 800, color: '#ef4444', display: 'flex', alignItems: 'center', gap: 6 }}>
                                🔴 Blind Spots & What Went Wrong
                              </h4>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                {sec.lines.map((l, lIdx) => {
                                  const { key, text } = parseBulletLine(l);
                                  return (
                                    <div key={lIdx} style={{ fontSize: 12.5, lineHeight: 1.5, color: theme.tPrimary, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                                      <span style={{ color: '#ef4444', fontWeight: 900, flexShrink: 0 }}>⚠</span>
                                      <div>
                                        {key && <strong style={{ color: '#ef4444', marginRight: 4 }}>{key}:</strong>}
                                        <span>{text}</span>
                                      </div>
                                    </div>
                                  );
                                })}
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
                                border: '1.5px solid rgba(99,102,241,0.25)',
                                borderRadius: 14,
                                padding: 14,
                              }}
                            >
                              <h4 style={{ margin: '0 0 6px', fontSize: 13.5, fontWeight: 800, color: '#818cf8', display: 'flex', alignItems: 'center', gap: 6 }}>
                                🎯 Senior Leadership Takeaway
                              </h4>
                              <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.5, color: theme.tPrimary, fontWeight: 600, fontStyle: 'italic' }}>
                                &ldquo;{sec.lines.join(' ').replace(/\*\*/g, '').replace(/^"|"$/g, '')}&rdquo;
                              </p>
                            </div>
                          );
                        }

                        if (isTimeline) {
                          return (
                            <div
                              key={idx}
                              style={{
                                background: 'rgba(255,255,255,0.02)',
                                border: `1.5px solid ${theme.border}`,
                                borderRadius: 14,
                                padding: 14,
                              }}
                            >
                              <h4 style={{ margin: '0 0 8px', fontSize: 13, fontWeight: 800, color: theme.tSecondary, textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                                📋 Decisions Made During Simulation
                              </h4>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                {sec.lines.map((l, lIdx) => {
                                  const cleanLine = l.replace(/^\d+\.\s*/, '').replace(/^[•\s*-]+\s*/, '').replace(/\*\*/g, '');
                                  return (
                                    <div key={lIdx} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: theme.tPrimary }}>
                                      <span style={{ background: 'rgba(20,184,166,0.12)', color: 'var(--teal)', borderRadius: 4, padding: '2px 6px', fontSize: 10, fontWeight: 800, fontFamily: 'var(--font-mono)', flexShrink: 0 }}>
                                        Turn {lIdx + 1}
                                      </span>
                                      <span>{cleanLine}</span>
                                    </div>
                                  );
                                })}
                              </div>
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
                              padding: 12,
                            }}
                          >
                            <h4 style={{ margin: '0 0 6px', fontSize: 13, fontWeight: 800, color: theme.tSecondary, textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                              {sec.title}
                            </h4>
                            {sec.lines.map((l, lIdx) => (
                              <div key={lIdx} style={{ fontSize: 12.5, color: theme.tPrimary, margin: '3px 0' }}>
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
                      gap: 12,
                      marginTop: 14,
                      paddingTop: 14,
                      borderTop: `1.5px solid ${theme.border}`,
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
                        padding: '11px 16px',
                        fontSize: 13.5,
                        fontWeight: 800,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        background: 'var(--teal)',
                        color: '#000',
                        border: 'none',
                        borderRadius: 12,
                        cursor: 'pointer',
                        boxShadow: '0 4px 14px rgba(20, 184, 166, 0.3)',
                        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
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
                        padding: '11px 16px',
                        fontSize: 13.5,
                        fontWeight: 700,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        background: theme.bgInside,
                        border: `1.5px solid ${theme.border}`,
                        color: theme.tPrimary,
                        borderRadius: 12,
                        cursor: 'pointer',
                        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
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
                    borderRadius: 16,
                    padding: '20px 24px',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 12,
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="animate-spin" style={{ fontSize: 18 }}>🔄</span>
                    <span style={{ fontSize: 14.5, fontWeight: 800, color: 'var(--teal)' }}>
                      Crisis Simulation Concluded · Generating Mindset Report...
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: 12.5, color: theme.tSecondary }}>
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
                      padding: '10px 22px',
                      fontSize: 13.5,
                      fontWeight: 800,
                      borderRadius: 10,
                      cursor: 'pointer',
                      background: 'var(--teal)',
                      color: '#000',
                      border: 'none',
                      marginTop: 4,
                      boxShadow: '0 4px 14px rgba(20, 184, 166, 0.3)',
                    }}
                  >
                    View Evolution Report Now ➔
                  </button>
                </div>
              ) : roleplayScenario && roleplayScenario.choices && roleplayScenario.choices.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 800,
                        color: theme.tPrimary,
                        letterSpacing: '-0.2px',
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
                        background: selectedChoiceIdx === idx ? 'rgba(var(--accent-teal-rgb), 0.12)' : theme.bgInside,
                        border: `1.5px solid ${selectedChoiceIdx === idx ? 'var(--teal)' : theme.border}`,
                        borderRadius: 14,
                        padding: '12px 16px',
                        textAlign: 'left',
                        fontSize: 14,
                        cursor: (selectedChoiceIdx !== null || roleplayLoading) ? 'not-allowed' : 'pointer',
                        color: theme.tPrimary,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        opacity: (selectedChoiceIdx !== null || roleplayLoading) && selectedChoiceIdx !== idx ? 0.45 : 1,
                        boxShadow: selectedChoiceIdx === idx ? '0 0 16px rgba(20, 184, 166, 0.25)' : 'none',
                      }}
                      className="simulator-choice-card"
                    >
                      <span
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: '8px',
                          background: selectedChoiceIdx === idx ? 'var(--teal)' : theme.bgCard,
                          border: `1.5px solid ${selectedChoiceIdx === idx ? 'var(--teal)' : theme.border}`,
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 11.5,
                          fontWeight: 900,
                          fontFamily: 'var(--font-mono)',
                          color: selectedChoiceIdx === idx ? '#000' : theme.tSecondary,
                          flexShrink: 0,
                          boxShadow: selectedChoiceIdx === idx ? '0 2px 8px rgba(20, 184, 166, 0.4)' : 'none',
                        }}
                      >
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span style={{ flex: 1, lineHeight: 1.45, fontWeight: 500 }}>{c.text}</span>
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
