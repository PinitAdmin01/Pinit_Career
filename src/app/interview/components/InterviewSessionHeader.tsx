'use client';

import React from 'react';
import { AvatarTeacher } from '../interviewTypes';

interface InterviewSessionHeaderProps {
  activeTeacher: AvatarTeacher;
  activeTopicName: string;
  activeStage: string;
  domainStream?: 'tech' | 'non_tech' | string;
  domainSubTopic?: string;
  companyName?: string;
  isVoiceListening?: boolean;
  elapsedSeconds: number;
  formatElapsed: (sec: number) => string;
  isScoredStage: boolean;
  isAssistModeActive: boolean;
  setIsAssistModeActive: React.Dispatch<React.SetStateAction<boolean>>;
  messages: Array<{ role: string; content: string }>;
  fetchAssistScript: (script: string) => void;
  avatarVolume: number;
  handleVolumeChange: (newVol: number) => void;
  showCameraPreview: boolean;
  toggleCameraPreview: () => void;
  isAvatarSpeaking: boolean;
  interruptSpeech: () => void;
  exitInterview: () => void;
  /** @deprecated Removed from top header strip; kept optional for backwards compatibility */
  onSkipQuestion?: () => void;
  isTabInactive?: boolean;
  bargeInEnabled?: boolean;
  setBargeInEnabled?: React.Dispatch<React.SetStateAction<boolean>>;
  defaultSettingsOpen?: boolean;
}

export function InterviewSessionHeader({
  activeTeacher,
  activeTopicName,
  activeStage,
  domainStream,
  domainSubTopic,
  companyName,
  isVoiceListening = false,
  elapsedSeconds,
  formatElapsed,
  isScoredStage: _isScoredStage,
  isAssistModeActive,
  setIsAssistModeActive,
  messages,
  fetchAssistScript,
  avatarVolume,
  handleVolumeChange,
  showCameraPreview,
  toggleCameraPreview,
  isAvatarSpeaking,
  interruptSpeech,
  exitInterview,
  isTabInactive = false,
  bargeInEnabled = false,
  setBargeInEnabled,
  defaultSettingsOpen = false
}: InterviewSessionHeaderProps) {
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [confirmExit, setConfirmExit] = React.useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(defaultSettingsOpen);
  const settingsContainerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!confirmExit) return;
    const t = setTimeout(() => setConfirmExit(false), 4000);
    return () => clearTimeout(t);
  }, [confirmExit]);

  React.useEffect(() => {
    if (!isSettingsOpen || typeof document === 'undefined') return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (settingsContainerRef.current && !settingsContainerRef.current.contains(e.target as Node)) {
        setIsSettingsOpen(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSettingsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isSettingsOpen]);

  React.useEffect(() => {
    if (typeof document === 'undefined') return;
    const updateFs = () => {
      const active = Boolean(document.fullscreenElement || (document as any).webkitFullscreenElement);
      setIsFullscreen(active);
    };
    updateFs();
    document.addEventListener('fullscreenchange', updateFs);
    document.addEventListener('webkitfullscreenchange', updateFs);
    return () => {
      document.removeEventListener('fullscreenchange', updateFs);
      document.removeEventListener('webkitfullscreenchange', updateFs);
    };
  }, []);

  const hasActivePreferences = isAssistModeActive || showCameraPreview || isFullscreen || bargeInEnabled;
  const rounds = [
    { id: 'round1_behavioral', label: 'Background' },
    { id: 'round2_coding', label: domainStream === 'non_tech' ? 'Case Study' : 'Challenge' },
    { id: 'round3_systems', label: domainStream === 'non_tech' ? 'Strategy' : 'Architecture' },
    { id: 'round4_star', label: 'Deep dive' },
  ];
  const activeRoundIndex = rounds.findIndex(round => round.id === activeStage);
  const currentRound = rounds[activeRoundIndex];

  const handleToggleFullscreen = async () => {
    if (typeof document === 'undefined') return;
    const docAny = document as any;
    const elAny = document.documentElement as any;
    try {
      if (document.fullscreenElement || docAny.webkitFullscreenElement) {
        if (document.exitFullscreen) await document.exitFullscreen();
        else if (docAny.webkitExitFullscreen) await docAny.webkitExitFullscreen();
      } else {
        if (elAny.requestFullscreen) await elAny.requestFullscreen();
        else if (elAny.webkitRequestFullscreen) await elAny.webkitRequestFullscreen();
        else if (elAny.mozRequestFullScreen) await elAny.mozRequestFullScreen();
      }
    } catch {}
  };

  return (
    <div className="iv-session-header">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'nowrap', minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0, flex: 1 }}>
          <span style={{ fontSize: 20, flexShrink: 0 }}>{activeTeacher.emoji}</span>
          <div style={{ minWidth: 0, overflow: 'hidden', flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'nowrap', minWidth: 0 }}>
              <span style={{ fontSize: 13.5, fontWeight: 900, color: 'var(--t1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0 }}>
                {activeTeacher.name}{' '}
                <span style={{ fontWeight: 600, color: 'var(--t2)', fontSize: 12 }}>({activeTeacher.title})</span>
              </span>
              {domainSubTopic && (
                <span
                  data-testid="header-track-badge"
                  style={{
                    fontSize: 9.5,
                    fontWeight: 800,
                    padding: '2px 7px',
                    borderRadius: 6,
                    background: domainStream === 'non_tech' ? 'rgba(56, 189, 248, 0.12)' : 'rgba(168, 85, 247, 0.12)',
                    color: domainStream === 'non_tech' ? '#38bdf8' : 'var(--accent)',
                    border: domainStream === 'non_tech' ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid rgba(168, 85, 247, 0.3)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    whiteSpace: 'nowrap',
                    flexShrink: 0
                  }}
                >
                  🎯 {domainSubTopic.replace(/_/g, ' ')}
                </span>
              )}
              {companyName && (
                <span
                  data-testid="header-company-badge"
                  style={{
                    fontSize: 9.5,
                    fontWeight: 800,
                    padding: '2px 7px',
                    borderRadius: 6,
                    background: 'rgba(16, 185, 129, 0.14)',
                    color: 'var(--green-mid)',
                    border: '1px solid rgba(16, 185, 129, 0.35)',
                    letterSpacing: '0.03em',
                    whiteSpace: 'nowrap',
                    flexShrink: 0
                  }}
                >
                  🏢 {companyName}
                </span>
              )}
              <span
                data-testid="header-voice-badge"
                style={{
                  fontSize: 9.5,
                  fontWeight: 800,
                  padding: '2px 7px',
                  borderRadius: 6,
                  background: isTabInactive
                    ? 'rgba(234, 179, 8, 0.15)'
                    : isAvatarSpeaking
                    ? 'rgba(234, 179, 8, 0.15)'
                    : isVoiceListening
                    ? 'rgba(34, 197, 94, 0.15)'
                    : 'var(--bg3)',
                  color: isTabInactive
                    ? 'var(--warning-bright, #eab308)'
                    : isAvatarSpeaking
                    ? 'var(--warning-bright, #eab308)'
                    : isVoiceListening
                    ? 'var(--success-bright, #22c55e)'
                    : 'var(--t3)',
                  border: isTabInactive
                    ? '1px solid rgba(234, 179, 8, 0.4)'
                    : isAvatarSpeaking
                    ? '1px solid rgba(234, 179, 8, 0.4)'
                    : isVoiceListening
                    ? '1px solid rgba(34, 197, 94, 0.4)'
                    : '1px solid var(--border)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  whiteSpace: 'nowrap',
                  flexShrink: 0
                }}
              >
                {isTabInactive ? '⏸️ Paused (Tab Inactive)' : isAvatarSpeaking ? '🗣️ Speaking' : isVoiceListening ? '🎙️ Mic Live' : '💤 Mic Standby'}
              </span>
            </div>
            <div style={{ fontSize: 10.5, color: 'var(--accent-mid)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: 1 }}>
              {currentRound ? `Round ${activeRoundIndex + 1} of ${rounds.length} · ${currentRound.label}` : 'Interview'} · {activeTopicName} · {formatElapsed(elapsedSeconds)}{isTabInactive ? ' · ⏸️ (Paused)' : ''}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'nowrap', flexShrink: 0 }}>
          {isAvatarSpeaking && (
            <button
              type="button"
              onClick={interruptSpeech}
              style={{
                background: 'var(--warning)',
                border: 'none',
                color: '#000',
                borderRadius: 8,
                padding: '6px 12px',
                fontSize: 12,
                fontWeight: 900,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              ✋ Interrupt &amp; Speak
            </button>
          )}

          {/* Universal Settings Gear & Popover */}
          <div ref={settingsContainerRef} style={{ position: 'relative', display: 'inline-block' }}>
            <button
              type="button"
              data-testid="header-settings-toggle"
              aria-expanded={isSettingsOpen}
              aria-haspopup="menu"
              title="Interview Settings (Assist Mode, Fullscreen Focus, Camera Self-View, Audio & Volume)"
              onClick={() => setIsSettingsOpen(prev => !prev)}
              style={{
                background: isSettingsOpen ? 'var(--accent-light)' : 'var(--bg3)',
                border: isSettingsOpen ? '1px solid var(--accent)' : '1px solid var(--border)',
                color: isSettingsOpen ? 'var(--accent)' : 'var(--t1)',
                borderRadius: 8,
                padding: '6px 12px',
                fontSize: 12,
                fontWeight: 800,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                whiteSpace: 'nowrap'
              }}
            >
              <span>⚙️</span>
              <span>Settings</span>
              {hasActivePreferences && (
                <span
                  aria-hidden="true"
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: 'var(--accent)',
                    boxShadow: '0 0 6px var(--accent)'
                  }}
                />
              )}
            </button>

            {isSettingsOpen && (
              <div
                role="menu"
                data-testid="header-settings-menu"
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  zIndex: 80,
                  width: 290,
                  background: 'color-mix(in srgb, var(--bg2, #0f172a) 96%, transparent)',
                  backdropFilter: 'blur(18px)',
                  WebkitBackdropFilter: 'blur(18px)',
                  border: '1px solid var(--border)',
                  borderRadius: 12,
                  padding: 14,
                  boxShadow: '0 16px 40px rgba(0, 0, 0, 0.45)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 900, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--t2)' }}>
                    Interview Controls
                  </span>
                  <button
                    type="button"
                    aria-label="Close settings"
                    onClick={() => setIsSettingsOpen(false)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--t3)',
                      fontSize: 13,
                      fontWeight: 800,
                      cursor: 'pointer',
                      padding: '2px 4px'
                    }}
                  >
                    ✕
                  </button>
                </div>

                {/* Assist Mode Toggle */}
                <button
                  type="button"
                  data-testid="header-assist-toggle"
                  title="Toggle AI Spoken Teleprompter Assist Mode"
                  onClick={() => {
                    const next = !isAssistModeActive;
                    setIsAssistModeActive(next);
                    if (next) {
                      const lastMsg = messages.filter(m => m.role === 'assistant').slice(-1)[0]?.content;
                      if (!lastMsg) {
                        fetchAssistScript(`Provide structured interview coaching for ${activeTopicName} (${activeStage}).`);
                      }
                    }
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 8,
                    background: isAssistModeActive ? 'linear-gradient(135deg, var(--reward) 0%, var(--purple) 100%)' : 'var(--bg3)',
                    border: isAssistModeActive ? '1px solid var(--reward)' : '1px solid var(--border)',
                    color: isAssistModeActive ? '#ffffff' : 'var(--t1)',
                    borderRadius: 8,
                    padding: '8px 12px',
                    fontSize: 12,
                    fontWeight: 800,
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <span>{isAssistModeActive ? '🎯 Assist Mode: ON' : '🎯 Assist Mode: OFF'}</span>
                  <span style={{ fontSize: 10, opacity: 0.85 }}>{isAssistModeActive ? 'Active' : 'Off'}</span>
                </button>

                {/* Fullscreen Gaming Focus Mode Toggle */}
                <button
                  type="button"
                  data-testid="header-gaming-mode-toggle"
                  title={isFullscreen ? 'Exit Fullscreen Gaming Focus (Esc)' : 'Enter Fullscreen Gaming Focus Mode'}
                  onClick={handleToggleFullscreen}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 8,
                    background: isFullscreen ? 'rgba(99, 102, 241, 0.22)' : 'var(--bg3)',
                    border: isFullscreen ? '1px solid var(--purple)' : '1px solid var(--border)',
                    color: isFullscreen ? 'var(--purple-mid, var(--purple))' : 'var(--t1)',
                    borderRadius: 8,
                    padding: '8px 12px',
                    fontSize: 12,
                    fontWeight: 800,
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <span>🎮 {isFullscreen ? 'Gaming Mode: Active' : 'Gaming Focus'}</span>
                  <span style={{ fontSize: 10, opacity: 0.8 }}>{isFullscreen ? 'Fullscreen' : 'Windowed'}</span>
                </button>

                {/* Camera Self-View Toggle */}
                <button
                  type="button"
                  data-testid="header-self-view-toggle"
                  onClick={toggleCameraPreview}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 8,
                    background: showCameraPreview ? 'var(--accent-light)' : 'var(--bg3)',
                    border: showCameraPreview ? '1px solid var(--accent)' : '1px solid var(--border)',
                    color: showCameraPreview ? 'var(--accent)' : 'var(--t1)',
                    borderRadius: 8,
                    padding: '8px 12px',
                    fontSize: 12,
                    fontWeight: 800,
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <span>{showCameraPreview ? '📷 Self-View ON' : '📷 Self-View'}</span>
                  <span style={{ fontSize: 10, opacity: 0.8 }}>{showCameraPreview ? 'Camera Live' : 'Off'}</span>
                </button>

                {/* Voice Barge-In Toggle */}
                {setBargeInEnabled && (
                  <button
                    type="button"
                    data-testid="voice-barge-in-toggle"
                    title="Hands-free voice barge-in (best with headphones; keep OFF on laptop speakers to avoid echo)"
                    onClick={() => setBargeInEnabled(prev => !prev)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      gap: 2,
                      background: bargeInEnabled ? 'rgba(16, 185, 129, 0.16)' : 'var(--bg3)',
                      border: bargeInEnabled ? '1px solid rgba(16, 185, 129, 0.45)' : '1px solid var(--border)',
                      color: bargeInEnabled ? '#34d399' : 'var(--t1)',
                      borderRadius: 8,
                      padding: '8px 12px',
                      fontSize: 12,
                      fontWeight: 800,
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>🎧 Barge-In: {bargeInEnabled ? 'ON' : 'OFF'}</span>
                      <span style={{ fontSize: 10, opacity: 0.8 }}>{bargeInEnabled ? 'Interrupt Live' : 'Tap to Interrupt'}</span>
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--t3)' }}>
                      Best with headphones
                    </span>
                  </button>
                )}

                {/* Interviewer Volume Slider */}
                <div style={{
                  background: 'var(--bg3)',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  padding: '8px 12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11.5, fontWeight: 800, color: 'var(--t2)' }}>
                    <span>🔊 Interviewer Volume</span>
                    <span style={{ color: 'var(--t1)', fontWeight: 900 }}>{avatarVolume}%</span>
                  </div>
                  <input
                    aria-label="Interviewer Volume"
                    type="range"
                    min="0"
                    max="100"
                    value={avatarVolume}
                    onChange={(e) => handleVolumeChange(Number(e.target.value))}
                    style={{ width: '100%', cursor: 'pointer' }}
                  />
                </div>
              </div>
            )}
          </div>

          {confirmExit ? (
            <div style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
              <button
                type="button"
                data-testid="header-exit-confirm"
                onClick={() => {
                  setConfirmExit(false);
                  exitInterview();
                }}
                style={{
                  background: 'var(--coral-mid)',
                  border: '1px solid var(--coral-mid)',
                  color: '#fff',
                  borderRadius: 8,
                  padding: '6px 11px',
                  fontSize: 11.5,
                  fontWeight: 900,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                ✓ Confirm Exit
              </button>
              <button
                type="button"
                onClick={() => setConfirmExit(false)}
                style={{
                  background: 'var(--bg3)',
                  border: '1px solid var(--border)',
                  color: 'var(--t3)',
                  borderRadius: 8,
                  padding: '6px 9px',
                  fontSize: 11.5,
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              data-testid="header-exit-btn"
              onClick={() => setConfirmExit(true)}
              style={{
                background: 'var(--coral-light)',
                border: '1px solid var(--coral-mid)',
                color: 'var(--coral-mid)',
                borderRadius: 8,
                padding: '6px 14px',
                fontSize: 12,
                fontWeight: 800,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              ✕ Exit Session
            </button>
          )}
        </div>
      </div>
      <div aria-label="Interview progress" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 8 }}>
        {rounds.map((round, index) => {
          const complete = activeStage === 'results' || index < activeRoundIndex;
          const current = index === activeRoundIndex;
          return <div key={round.id} style={{ minWidth: 0 }}>
            <div style={{ height: 4, borderRadius: 99, background: complete || current ? 'var(--accent)' : 'var(--bg3)', opacity: current ? 1 : 0.65 }} />
            <div style={{ marginTop: 4, fontSize: 10, fontWeight: current ? 900 : 700, color: current ? 'var(--accent-mid)' : 'var(--t3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {index + 1}. {round.label}
            </div>
          </div>;
        })}
      </div>
    </div>
  );
}
