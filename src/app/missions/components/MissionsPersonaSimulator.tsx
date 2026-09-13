'use client';

import React from 'react';
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
}: MissionsPersonaSimulatorProps) {
  return (
    <div
      style={{
        maxWidth: '100%',
        margin: '0 auto',
        background: theme.bg,
        color: theme.tPrimary,
        padding: '20px',
        borderRadius: '24px',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
      className="animate-fade-in"
    >
      {/* Active 3D Roleplay Workspace Banner */}
      <div
        style={{
          background: theme.bgCard,
          border: `1.5px solid ${theme.border}`,
          borderRadius: '24px',
          padding: '24px',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
          transition: 'all 0.3s',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: `1px solid ${theme.border}`,
            paddingBottom: 12,
          }}
        >
          <div>
            <h2
              style={{
                fontSize: 16,
                fontWeight: 900,
                color: 'var(--accent)',
                margin: 0,
                textTransform: 'uppercase',
                fontFamily: 'var(--font-mono)',
              }}
            >
              ⚡ {roleplayScenario?.scenarioTitle || 'Synthesizing Crisis...'}
            </h2>
            <span style={{ fontSize: 11, color: theme.tSecondary }}>
              Mindset scaling active: Onboarding QT2 index
            </span>
          </div>
          <button
            onClick={() => {
              if (
                window.confirm(
                  'Are you sure you want to abort this mindset simulation session? Your progress will not be saved.'
                )
              ) {
                updateRoleplayActive(false);
                stopSpeaking();
              }
            }}
            style={{
              background: 'rgba(var(--danger-rgb), 0.05)',
              border: '1px solid rgba(var(--danger-rgb), 0.2)',
              padding: '5px 12px',
              borderRadius: 8,
              fontSize: 11,
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
            ❌ Abort Session
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: 20, minHeight: 380 }}>
          {/* Left Column Container: 3D Feed + Situation Summary */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Left Column: 3D Telemetry Feed */}
            <div
              style={{
                height: 380,
                background: theme.bgInside,
                border: `1px solid ${theme.border}`,
                borderRadius: 16,
                padding: 14,
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span
                  style={{
                    fontSize: 9.5,
                    fontWeight: 800,
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--red)',
                    letterSpacing: '0.6px',
                  }}
                >
                  🔴 LIVE FEED
                </span>
                <span
                  className={timerCount < 8 ? 'timer-pulse-low' : ''}
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: timerCount < 8 ? 'var(--red)' : 'var(--accent)',
                    transition: 'all 0.25s ease-out',
                    display: 'inline-block',
                  }}
                >
                  {timerCount}s left
                </span>
              </div>

              {/* Progress countdown bar */}
              <div style={{ height: 4, background: theme.border, borderRadius: 2, overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${(timerCount / 25) * 100}%`,
                    background: timerCount < 8 ? 'var(--red)' : 'var(--accent)',
                    transition: 'width 1s linear',
                  }}
                />
              </div>

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
                      fontSize: 13,
                    }}
                  >
                    Syncing 3D Node...
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: theme.tPrimary }}>
                  {roleplayScenario?.avatarName || 'Scanning...'}
                </span>
                <span style={{ fontSize: 9.5, color: theme.tTertiary, fontFamily: 'var(--font-mono)' }}>
                  {roleplayScenario?.avatarRole || 'Limbic Sensor Active'}
                </span>
              </div>
            </div>

            {/* Situation Summary (Conclusion) Panel */}
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
                transition: 'all 0.3s ease-out',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: `1px solid rgba(255,255,255,0.06)`,
                  paddingBottom: 6,
                }}
              >
                <span
                  style={{
                    fontSize: 9.5,
                    fontWeight: 900,
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--accent)',
                    letterSpacing: '0.6px',
                  }}
                >
                  📋 SITUATION SUMMARY
                </span>
                <span style={{ fontSize: 9.5, fontFamily: 'var(--font-mono)', color: theme.tTertiary }}>
                  ⏳ {Math.floor(sessionElapsed / 60).toString().padStart(2, '0')}:
                  {(sessionElapsed % 60).toString().padStart(2, '0')} elapsed
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 11, lineHeight: 1.45 }}>
                <div>
                  <strong
                    style={{
                      color: theme.tSecondary,
                      fontSize: 10,
                      display: 'block',
                      textTransform: 'uppercase',
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    Crisis Context
                  </strong>
                  <span style={{ color: theme.tPrimary }}>
                    {roleplayScenario?.scenarioTitle || 'Synthesizing scenario parameters...'}
                  </span>
                </div>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: 6 }}>
                  <strong
                    style={{
                      color: theme.tSecondary,
                      fontSize: 10,
                      display: 'block',
                      textTransform: 'uppercase',
                      fontFamily: 'var(--font-mono)',
                      marginBottom: 2,
                    }}
                  >
                    Decisions Logged ({roleplayHistory.filter((h) => h.role === 'user').length})
                  </strong>
                  {roleplayHistory.filter((h) => h.role === 'user').length === 0 ? (
                    <span style={{ color: theme.tTertiary, fontStyle: 'italic' }}>
                      Awaiting candidate's first action response...
                    </span>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 90, overflowY: 'auto' }}>
                      {roleplayHistory
                        .filter((h) => h.role === 'user')
                        .map((c, i) => (
                          <div key={i} style={{ display: 'flex', gap: 4, color: theme.tPrimary }}>
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

          {/* Right Column: Dialogue Console */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 16 }}>
            {/* Chat Bubble Logs */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                maxHeight: 280,
                paddingRight: 6,
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
                      maxWidth: '85%',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 3,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 9,
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
                      <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.5, color: theme.tPrimary }}>
                        {bubbleText}
                      </p>
                    </div>
                  </div>
                );
              })}
              {roleplayLoading && (
                <div style={{ color: theme.tTertiary, fontSize: 12, fontStyle: 'italic' }}>
                  ✏️ Synthesizing dynamic branch parameters...
                </div>
              )}
            </div>

            {/* Interactive Choices Panel */}
            <div>
              {evaluationLoading ? (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <span style={{ fontSize: 24, display: 'block', marginBottom: 8 }} className="animate-spin">
                    🔄
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent)' }}>
                    Compiling Socratic Evolution Report...
                  </span>
                  <p style={{ fontSize: 11, color: theme.tTertiary, marginTop: 4 }}>
                    Analyzing natural blindness metrics and System 1/2 triggers against strategic literatures.
                  </p>
                </div>
              ) : evaluationReport ? (
                /* Socratic report display box */
                <div
                  style={{
                    background: 'rgba(var(--accent-teal-rgb), 0.03)',
                    border: `1.5px solid rgba(var(--accent-teal-rgb), 0.18)`,
                    borderRadius: 16,
                    padding: 16,
                    maxHeight: 280,
                    overflowY: 'auto',
                  }}
                >
                  <h3
                    style={{
                      margin: '0 0 10px',
                      fontSize: 14,
                      fontWeight: 800,
                      color: 'var(--teal)',
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span>🧠 Socratic Evolution Report</span>
                    <span>Score: {qt2Delta > 0 ? `+${qt2Delta}` : qt2Delta} points</span>
                  </h3>
                  <div
                    style={{ fontSize: 12, lineHeight: 1.6, color: theme.tSecondary }}
                    className="socratic-report-content"
                  >
                    {evaluationReport.split('\n').map((line, idx) => (
                      <p key={idx} style={{ margin: '0 0 8px' }}>
                        {line}
                      </p>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      updateRoleplayActive(false);
                      setEvaluationReport('');
                      stopSpeaking();
                    }}
                    className="btn-primary btn-sm"
                    style={{ width: '100%', marginTop: 12, justifyContent: 'center' }}
                  >
                    Return to Command Center
                  </button>
                </div>
              ) : roleplayScenario && roleplayScenario.choices && roleplayScenario.choices.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.8px',
                      color: theme.tTertiary,
                      fontFamily: 'var(--font-mono)',
                      display: 'block',
                      marginBottom: 2,
                    }}
                  >
                    Select Tactical Response (System 2 check):
                  </span>
                  {roleplayScenario.choices.map((c, idx) => (
                    <button
                      key={idx}
                      disabled={selectedChoiceIdx !== null}
                      onClick={() => handleSelectChoice(idx)}
                      style={{
                        background: selectedChoiceIdx === idx ? 'rgba(var(--accent-teal-rgb), 0.08)' : theme.bgInside,
                        border: `1px solid ${selectedChoiceIdx === idx ? 'var(--teal)' : theme.border}`,
                        borderRadius: 12,
                        padding: '10px 14px',
                        textAlign: 'left',
                        fontSize: 12,
                        cursor: 'pointer',
                        color: theme.tPrimary,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        opacity: selectedChoiceIdx !== null && selectedChoiceIdx !== idx ? 0.5 : 1,
                        transition: 'all 0.2s',
                      }}
                      className="choice-card"
                    >
                      <span
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: '50%',
                          background: theme.bgCard,
                          border: `1.5px solid ${selectedChoiceIdx === idx ? 'var(--teal)' : theme.border}`,
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 9,
                          fontWeight: 800,
                          color: selectedChoiceIdx === idx ? 'var(--teal)' : theme.tSecondary,
                        }}
                      >
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span style={{ flex: 1 }}>{c.text}</span>
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
