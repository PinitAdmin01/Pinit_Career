'use client';

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { AVATARS, type GdAvatar } from '../constants';
import { GD_COMMON_RULES } from '@/lib/group-discussion/gdTurnEngine';
import type { GdTurnPhase } from '../hooks/useGdOrchestrator';
import GdAudioVisualizer from './GdAudioVisualizer';

export type { GdAvatar };

const VRoidInterviewAvatar = dynamic(
  () => import('@/components/avatar/VRoidInterviewAvatar'),
  { ssr: false }
);

interface GdMeetGridProps {
  invitedAvatars: string[];
  activeSpeakingAvatar: string | null;
  currentAvatarARoleId: string | null;
  currentAvatarBRoleId: string | null;
  isUserTurn: boolean;
  turnPhase: GdTurnPhase;
  activeTimeAlert: '5min' | '1min' | null;
  turnCount: number;
  hostId: string;
  handRaised: boolean;
  micActive: boolean;
  activeStream?: MediaStream | null;
  callDurationSeconds: number;
  sessionDurationMinutes: number;
  showCoachChips: boolean;
  onToggleCoachChips: () => void;
  audioVolume: number;
  onAudioVolumeChange: (val: number) => void;
  onUserFinishSpeaking: () => void;
  onToggleRaiseHand: () => void;
  onInterjectImmediately: () => void;
  onEndCall: () => void;
  onForceExit: () => void;
}

export default function GdMeetGrid({
  invitedAvatars,
  activeSpeakingAvatar,
  currentAvatarARoleId,
  currentAvatarBRoleId,
  isUserTurn,
  turnPhase,
  activeTimeAlert,
  turnCount,
  hostId,
  handRaised,
  micActive,
  activeStream,
  callDurationSeconds,
  sessionDurationMinutes,
  showCoachChips,
  onToggleCoachChips,
  audioVolume,
  onAudioVolumeChange,
  onUserFinishSpeaking,
  onToggleRaiseHand,
  onInterjectImmediately,
  onEndCall,
  onForceExit,
}: GdMeetGridProps) {
  const [connecting, setConnecting] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [rulesOpen, setRulesOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setConnecting(false), 750);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
        setSettingsOpen(false);
      }
    };
    const onFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('fullscreenchange', onFsChange);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('fullscreenchange', onFsChange);
    };
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {}
  };

  const totalSeconds = Math.max(60, sessionDurationMinutes * 60);
  const remainingSeconds = Math.max(0, totalSeconds - callDurationSeconds);
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const formattedTimer = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const flowSteps: Array<{ id: GdTurnPhase; label: string; icon: string }> = [
    { id: 'host_intro', label: 'Host Rules', icon: '🏛️' },
    { id: 'user', label: 'You Speak', icon: '🧑' },
    { id: 'avatar_a', label: 'Avatar 1 Argues', icon: '🔥' },
    { id: 'avatar_b', label: 'Avatar 2 Bridges', icon: '🤝' },
  ];

  // Dynamic compact grid layout so 4 participants (You + Host + Avatar 1 + Avatar 2) look huge & crisp!
  const totalTiles = invitedAvatars.length + 1;
  const gridCols = totalTiles <= 4 ? 2 : 3;

  if (connecting) {
    return (
      <div
        style={{
          background: '#090d16',
          borderRadius: 22,
          padding: 36,
          minHeight: 460,
          border: '1.5px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 14,
        }}
        className="animate-fade-in"
      >
        <span style={{ fontSize: 42, animation: 'spin 2s linear infinite' }}>🏛️</span>
        <h3 style={{ fontSize: 17, fontWeight: 900, color: 'white', margin: 0 }}>
          Joining Live GD Boardroom...
        </h3>
        <p style={{ fontSize: 12.5, color: 'var(--t3)', margin: 0 }}>
          Connecting Host, Challenger (Groq Key 1), and Diplomat (Groq Key 2).
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }} className="animate-fade-in">
      {/* Compact Header Bar: Live Status + Countdown + Rules + Settings Gear */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 10,
          flexWrap: 'wrap',
          background: 'var(--bg2)',
          border: '1px solid var(--border)',
          borderRadius: 16,
          padding: '9px 14px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 14, fontWeight: 900, color: 'var(--t1)' }}>🏛️ Live GD Panel</span>
          <span
            style={{
              fontSize: 11,
              color: 'var(--t3)',
              background: 'var(--bg3)',
              padding: '2px 8px',
              borderRadius: 6,
              fontWeight: 700,
            }}
          >
            {totalTiles} Seated • Round {turnCount + 1}
          </span>
          {activeTimeAlert && (
            <span
              style={{
                fontSize: 10.5,
                fontWeight: 900,
                padding: '2px 8px',
                borderRadius: 6,
                background: activeTimeAlert === '1min' ? 'rgba(239,68,68,0.18)' : 'rgba(245,158,11,0.18)',
                border: `1px solid ${activeTimeAlert === '1min' ? '#ef4444' : '#f59e0b'}`,
                color: activeTimeAlert === '1min' ? '#fca5a5' : '#fcd34d',
              }}
            >
              {activeTimeAlert === '1min' ? '🚨 1 MIN LEFT' : '🔔 5 MIN CHECK'}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Countdown Pill */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background:
                remainingSeconds <= 60
                  ? 'rgba(239,68,68,0.16)'
                  : remainingSeconds <= 300
                    ? 'rgba(245,158,11,0.16)'
                    : 'rgba(20,184,166,0.14)',
              border: `1.5px solid ${
                remainingSeconds <= 60 ? '#ef4444' : remainingSeconds <= 300 ? '#f59e0b' : 'var(--teal)'
              }`,
              borderRadius: 10,
              padding: '4px 10px',
              fontFamily: 'var(--font-mono)',
              fontWeight: 900,
              color: remainingSeconds <= 60 ? '#fca5a5' : remainingSeconds <= 300 ? '#fcd34d' : 'var(--teal)',
              fontSize: 13,
            }}
          >
            <span>⏱️</span>
            <span>{formattedTimer}</span>
          </div>

          {/* Rules Popover Button */}
          <button
            type="button"
            onClick={() => setRulesOpen(v => !v)}
            style={{
              background: rulesOpen ? 'rgba(20,184,166,0.18)' : 'var(--bg3)',
              border: `1px solid ${rulesOpen ? 'var(--teal)' : 'var(--border)'}`,
              borderRadius: 10,
              padding: '5px 10px',
              fontSize: 11.5,
              fontWeight: 800,
              color: rulesOpen ? 'var(--teal)' : 'var(--t2)',
              cursor: 'pointer',
            }}
          >
            📜 Rules
          </button>

          {/* Universal Settings Gear (Adapted from AI Interview Studio) */}
          <div ref={settingsRef} style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setSettingsOpen(v => !v)}
              style={{
                background: settingsOpen ? 'rgba(99,102,241,0.2)' : 'var(--bg3)',
                border: `1px solid ${settingsOpen ? '#818cf8' : 'var(--border)'}`,
                borderRadius: 10,
                padding: '5px 10px',
                fontSize: 11.5,
                fontWeight: 800,
                color: 'var(--t1)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              ⚙️ Settings
            </button>

            {settingsOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  width: 265,
                  background: '#0f172a',
                  border: '1.5px solid var(--border)',
                  borderRadius: 14,
                  padding: 14,
                  zIndex: 60,
                  boxShadow: '0 16px 40px rgba(0,0,0,0.55)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                }}
              >
                <div style={{ fontSize: 11, fontWeight: 900, color: 'var(--t3)', letterSpacing: '0.5px' }}>
                  GD ROOM CONTROLS
                </div>

                {/* Starter Chips / GD Coach Toggle */}
                <label
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    fontSize: 12.5,
                    color: 'var(--t1)',
                    fontWeight: 700,
                  }}
                >
                  <span>💡 Starter Idea Chips</span>
                  <input
                    type="checkbox"
                    checked={showCoachChips}
                    onChange={onToggleCoachChips}
                    style={{ accentColor: '#14b8a6', width: 16, height: 16 }}
                  />
                </label>

                {/* Speaker Audio Volume */}
                <div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: 12,
                      color: 'var(--t2)',
                      fontWeight: 700,
                      marginBottom: 4,
                    }}
                  >
                    <span>🔊 Panel Voice Volume</span>
                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--teal)' }}>{audioVolume}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={audioVolume}
                    onChange={e => onAudioVolumeChange(Number(e.target.value))}
                    style={{ width: '100%', accentColor: '#14b8a6' }}
                  />
                </div>

                {/* Fullscreen Focus Toggle */}
                <button
                  type="button"
                  onClick={toggleFullscreen}
                  style={{
                    padding: '7px 10px',
                    borderRadius: 9,
                    border: '1px solid var(--border)',
                    background: 'var(--bg3)',
                    color: 'var(--t1)',
                    fontSize: 12,
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  {isFullscreen ? '🗗 Exit Focus Fullscreen' : '⛶ Enter Focus Fullscreen'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Collapsible Common GD Rules Banner */}
      {rulesOpen && (
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.92)',
            border: '1.5px solid rgba(20, 184, 166, 0.4)',
            borderRadius: 14,
            padding: '12px 14px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(175px, 1fr))',
            gap: 8,
          }}
          className="animate-fade-in"
        >
          {GD_COMMON_RULES.map(rule => (
            <div
              key={rule.id}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 10,
                padding: '8px 10px',
              }}
            >
              <div style={{ fontSize: 11.5, fontWeight: 900, color: 'var(--teal)', marginBottom: 2 }}>
                {rule.icon} {rule.title}
              </div>
              <div style={{ fontSize: 10.5, color: 'var(--t3)', lineHeight: 1.35 }}>{rule.detail}</div>
            </div>
          ))}
        </div>
      )}

      {/* Live Turn Control Flow Stepper: Host -> User -> Avatar 1 -> Avatar 2 -> User */}
      <div className="gd-turn-flow-bar">
        {flowSteps.map((s, i) => {
          const isActive =
            turnPhase === s.id || (turnPhase === 'host_time_check' && s.id === 'host_intro');
          return (
            <React.Fragment key={s.id}>
              <div
                className={`gd-flow-pill ${isActive ? 'active' : ''}`}
                style={{
                  background: isActive ? 'rgba(20,184,166,0.18)' : 'rgba(255,255,255,0.03)',
                  border: `1.5px solid ${isActive ? 'var(--teal)' : 'rgba(255,255,255,0.08)'}`,
                  color: isActive ? '#5eead4' : 'var(--t3)',
                }}
              >
                <span>{s.icon}</span>
                <span>{s.label}</span>
              </div>
              {i < flowSteps.length - 1 && (
                <span style={{ color: 'var(--t4)', fontSize: 12, fontWeight: 900 }}>→</span>
              )}
            </React.Fragment>
          );
        })}
        <span style={{ color: 'var(--t4)', fontSize: 11, fontWeight: 800, marginLeft: 'auto' }}>↻ Loop</span>
      </div>

      {/* Participant Video Grid */}
      <div
        className="gd-call-grid-container gd-live-participants"
        style={{
          gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
          gridTemplateRows: totalTiles <= 4 ? 'repeat(2, minmax(0, 1fr))' : undefined,
        }}
      >
        {/* User / Candidate Seat */}
        <div
          className="gd-participant-card"
          style={{
            background: micActive
              ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
              : '#141c2f',
            border: `2.5px solid ${isUserTurn ? '#14b8a6' : micActive ? '#22c55e' : 'rgba(255,255,255,0.12)'}`,
            justifyContent: 'center',
            boxShadow: isUserTurn
              ? '0 0 24px rgba(20, 184, 166, 0.35)'
              : '0 8px 24px rgba(0,0,0,0.3)',
          }}
        >
          {handRaised && (
            <span
              className="gd-role-badge"
              style={{
                left: 'auto',
                right: 8,
                background: 'rgba(249,115,22,0.2)',
                border: '1.5px solid #f97316',
                color: '#fdba74',
              }}
            >
              🙋 HAND RAISED
            </span>
          )}

          {isUserTurn && (
            <span
              className="gd-role-badge"
              style={{
                background: 'rgba(20,184,166,0.22)',
                border: '1.5px solid var(--teal)',
                color: '#5eead4',
                animation: 'pulse 1.5s infinite',
              }}
            >
              🎙️ YOUR FLOOR
            </span>
          )}

          <div
            style={{
              width: 58,
              height: 58,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #0ea5e9 0%, #4f46e5 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 28,
              boxShadow: '0 6px 16px rgba(0,0,0,0.4)',
              border: micActive ? '2.5px solid #22c55e' : '2px solid rgba(255,255,255,0.2)',
            }}
          >
            🎓
          </div>

          <span style={{ fontSize: 13.5, fontWeight: 900, color: 'white', marginTop: 8 }}>
            You (Participant)
          </span>
          <span style={{ fontSize: 10.5, color: 'var(--t3)', marginTop: 2 }}>
            {isUserTurn ? 'Speak or type your next point' : 'Listening to panel response'}
          </span>

          <div style={{ marginTop: 8, width: '75%', display: 'flex', justifyContent: 'center' }}>
            <GdAudioVisualizer active={micActive && isUserTurn} isSpeaking={micActive && isUserTurn} color="#14b8a6" />
          </div>

          <span
            style={{
              fontSize: 9.5,
              color: micActive ? '#4ade80' : 'var(--t4)',
              position: 'absolute',
              bottom: 8,
              fontFamily: 'var(--font-mono)',
              fontWeight: 800,
            }}
          >
            {micActive ? '🟢 MIC LIVE' : '🔴 MIC STANDBY'}
          </span>
        </div>

        {/* Invited Panel Avatars */}
        {invitedAvatars.map(id => {
          const avatar = AVATARS.find(a => a.id === id);
          if (!avatar) return null;
          const isSpeaking = activeSpeakingAvatar === avatar.name;
          const isHost = id === hostId;
          const isAvatarA = currentAvatarARoleId === id && !isHost;
          const isAvatarB = currentAvatarBRoleId === id && !isHost;

          return (
            <div
              key={id}
              className="gd-participant-card"
              style={{
                background: isSpeaking
                  ? 'linear-gradient(135deg, #1b233d 0%, #0d1527 100%)'
                  : '#111827',
                border: `2.5px solid ${
                  isSpeaking
                    ? 'var(--teal)'
                    : isHost
                      ? '#818cf8'
                      : isAvatarA
                        ? '#f97316'
                        : isAvatarB
                          ? '#a855f7'
                          : 'rgba(255,255,255,0.08)'
                }`,
                boxShadow: isSpeaking
                  ? '0 0 22px rgba(20, 184, 166, 0.35)'
                  : 'var(--shadow-md)',
                paddingBottom: 6,
              }}
            >
              {isHost && (
                <div
                  className="gd-role-badge"
                  style={{
                    background: 'rgba(99,102,241,0.25)',
                    border: '1.5px solid #818cf8',
                    color: '#c7d2fe',
                  }}
                >
                  👑 HOST
                </div>
              )}

              {isAvatarA && (
                <div
                  className="gd-role-badge"
                  style={{
                    background: 'rgba(249,115,22,0.22)',
                    border: '1.5px solid #f97316',
                    color: '#fdba74',
                  }}
                >
                  🔥 AVATAR 1 • ARGUES
                </div>
              )}

              {isAvatarB && (
                <div
                  className="gd-role-badge"
                  style={{
                    background: 'rgba(168,85,247,0.22)',
                    border: '1.5px solid #a855f7',
                    color: '#e9d5ff',
                  }}
                >
                  🤝 AVATAR 2 • DIPLOMAT
                </div>
              )}

              {isSpeaking && <div className="gd-speaking-badge">🎙️ SPEAKING</div>}

              {/* 3D VRoid Viewport */}
              <div
                style={{
                  width: '100%',
                  flex: 1,
                  height: totalTiles <= 4 ? 190 : 140,
                  minHeight: 110,
                  maxHeight: totalTiles <= 4 ? 190 : 140,
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: '12px 12px 0 0',
                  background: isSpeaking
                    ? 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)'
                    : '#090d16',
                }}
              >
                <VRoidInterviewAvatar
                  teacherId={avatar.id}
                  animState={isSpeaking ? 'talking' : 'idle'}
                  zoom={1.55}
                  visible={true}
                />
              </div>

              <span style={{ fontSize: 12, fontWeight: 900, color: 'white', marginTop: 4, textAlign: 'center' }}>
                {avatar.name}
              </span>
              <span
                style={{
                  fontSize: 10,
                  color: 'var(--t3)',
                  textAlign: 'center',
                  padding: '0 6px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  width: '94%',
                }}
              >
                {avatar.role}
              </span>
              <span
                style={{
                  fontSize: 9,
                  color: isSpeaking ? 'var(--teal)' : 'var(--t4)',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 800,
                  marginTop: 2,
                }}
              >
                {avatar.styleTag.toUpperCase()}
              </span>
            </div>
          );
        })}
      </div>

      {/* Bottom Action Bar */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {isUserTurn && (
          <button
            type="button"
            onClick={onUserFinishSpeaking}
            className="btn-primary"
            style={{
              flex: 2,
              minWidth: 210,
              padding: '10px 14px',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, var(--teal) 0%, #0284c7 100%)',
              border: 'none',
              color: 'white',
              fontWeight: 900,
              borderRadius: 12,
              cursor: 'pointer',
              fontSize: 13.5,
              boxShadow: '0 0 18px rgba(20, 184, 166, 0.35)',
            }}
          >
            ✋ Done Speaking (Send to Challenger)
          </button>
        )}

        {!isUserTurn && (
          <div style={{ display: 'flex', gap: 8, flex: 2, minWidth: 210 }}>
            <button
              type="button"
              onClick={onToggleRaiseHand}
              style={{
                flex: 1,
                padding: '10px 12px',
                background: handRaised ? 'rgba(249,115,22,0.22)' : 'rgba(59,130,246,0.14)',
                border: `1.5px solid ${handRaised ? '#f97316' : '#3b82f6'}`,
                color: handRaised ? '#fdba74' : '#93c5fd',
                fontWeight: 800,
                borderRadius: 12,
                cursor: 'pointer',
                fontSize: 12.5,
              }}
            >
              {handRaised ? '🙋 Hand Raised' : '🙋 Queue Next'}
            </button>

            {activeSpeakingAvatar && turnPhase !== 'host_intro' && turnPhase !== 'host_time_check' && (
              <button
                type="button"
                onClick={onInterjectImmediately}
                style={{
                  flex: 1,
                  padding: '10px 12px',
                  background: 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)',
                  border: 'none',
                  color: 'white',
                  fontWeight: 900,
                  borderRadius: 12,
                  cursor: 'pointer',
                  fontSize: 12.5,
                }}
              >
                ⚡ Interject Politely
              </button>
            )}
          </div>
        )}

        <button
          type="button"
          onClick={onEndCall}
          style={{
            flex: 1,
            minWidth: 140,
            padding: '10px 14px',
            background: '#ef4444',
            border: 'none',
            color: 'white',
            fontWeight: 800,
            borderRadius: 12,
            cursor: 'pointer',
            fontSize: 13,
          }}
        >
          🛑 End & Score
        </button>

        <button
          type="button"
          onClick={onForceExit}
          style={{
            padding: '10px 14px',
            background: 'transparent',
            border: '1.5px solid rgba(248,113,113,0.55)',
            color: '#fca5a5',
            fontWeight: 800,
            borderRadius: 12,
            cursor: 'pointer',
            fontSize: 13,
          }}
        >
          ❌ Exit
        </button>
      </div>
    </div>
  );
}
