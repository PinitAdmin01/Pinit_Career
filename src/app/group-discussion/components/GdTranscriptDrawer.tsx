'use client';

import React from 'react';
import type { GdMessage, GdTurnPhase } from '../hooks/useGdOrchestrator';

export type GdChatMessage = GdMessage;

interface GdTranscriptDrawerProps {
  selectedConcept: string;
  callDuration: number;
  candidateTurnTimer: number | null;
  isUserTurn: boolean;
  turnPhase: GdTurnPhase;
  inputText: string;
  liveTranscript: string;
  messages: GdChatMessage[];
  loading: boolean;
  suggestedHelperText: string;
  starterPrompts: string[];
  showCoachChips: boolean;
  micActive: boolean;
  onClearHelperText: () => void;
  onInputTextChange: (value: string) => void;
  onToggleMic: () => void;
  onSendMessage: (event: React.FormEvent) => void;
  onQuickSendChip: (text: string) => void;
  onSuggestArgument: () => void;
  onExportTranscript: (format: 'markdown' | 'json') => void;
  bottomRef: React.RefObject<HTMLDivElement>;
}

function isUserMessage(m: GdChatMessage): boolean {
  const r = (m.role || '').toLowerCase();
  return m.tag === 'user' || m.sender === 'You' || r === 'participant' || r === 'candidate' || r === 'sde candidate';
}

export default function GdTranscriptDrawer({
  selectedConcept,
  callDuration,
  candidateTurnTimer,
  isUserTurn,
  turnPhase,
  inputText,
  liveTranscript,
  messages,
  loading,
  suggestedHelperText,
  starterPrompts,
  showCoachChips,
  micActive,
  onClearHelperText,
  onInputTextChange,
  onToggleMic,
  onSendMessage,
  onQuickSendChip,
  onSuggestArgument,
  onExportTranscript,
  bottomRef,
}: GdTranscriptDrawerProps) {
  const phaseStatusText =
    turnPhase === 'host_intro'
      ? 'Host is explaining the topic & room rules...'
      : turnPhase === 'host_time_check'
        ? 'Host time-check announcement...'
        : turnPhase === 'avatar_a'
          ? 'Avatar 1 (Challenger) is responding...'
          : turnPhase === 'avatar_b'
            ? 'Avatar 2 (Diplomat) is bridging both views...'
            : isUserTurn
              ? micActive
                ? 'Mic live — speak naturally or type below.'
                : 'Your floor — unmute mic, type, or tap an idea chip.'
              : 'Listening to the panel...';

  return (
    <div className="gd-chat-panel">
      {/* Compact Header */}
      <div className="gd-chat-header">
        <div style={{ minWidth: 0, flex: 1 }}>
          <span style={{ fontSize: 9.5, fontFamily: 'var(--font-mono)', color: 'var(--t3)', fontWeight: 800 }}>
            LIVE DISCUSSION TRANSCRIPT
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
            <div
              title={selectedConcept}
              style={{
                fontSize: 12.5,
                fontWeight: 900,
                color: 'var(--t1)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {selectedConcept}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          {candidateTurnTimer !== null && isUserTurn && (
            <div
              style={{
                background: 'rgba(20,184,166,0.14)',
                border: '1px solid var(--teal)',
                borderRadius: 6,
                padding: '2px 7px',
                fontSize: 10.5,
                fontWeight: 900,
                fontFamily: 'var(--font-mono)',
                color: 'var(--teal)',
              }}
            >
              FLOOR: {candidateTurnTimer}s
            </div>
          )}
          <button
            type="button"
            onClick={() => onExportTranscript('markdown')}
            style={{
              background: 'rgba(20,184,166,0.1)',
              border: '1px solid var(--teal)',
              borderRadius: 7,
              padding: '4px 8px',
              fontSize: 10.5,
              fontWeight: 800,
              color: 'var(--teal)',
              cursor: 'pointer',
            }}
            title="Download discussion transcript (.md)"
          >
            📥 Minutes
          </button>
        </div>
      </div>

      {/* Message Stream */}
      <div className="gd-chat-messages-scroll">
        {messages.map((m, idx) => {
          const isUser = isUserMessage(m);
          const isTimeCheck = m.tag === 'time_check';
          const isChallenger = m.tag === 'challenger';
          const isDiplomat = m.tag === 'diplomat';
          const isHost = m.tag === 'host';

          const accentBorder = isTimeCheck
            ? '#f59e0b'
            : isChallenger
              ? 'rgba(249,115,22,0.55)'
              : isDiplomat
                ? 'rgba(168,85,247,0.55)'
                : isHost
                  ? 'rgba(129,140,248,0.55)'
                  : 'var(--border)';

          const roleColor = isTimeCheck
            ? '#fcd34d'
            : isChallenger
              ? '#fdba74'
              : isDiplomat
                ? '#e9d5ff'
                : isHost
                  ? '#c7d2fe'
                  : 'var(--t3)';

          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: isUser ? 'flex-end' : 'flex-start',
                gap: 3,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10.5, color: 'var(--t3)' }}>
                <span>{m.emoji}</span>
                <strong style={{ color: 'var(--t1)' }}>{m.sender}</strong>
                <span style={{ color: roleColor, fontWeight: 800 }}>• {m.role}</span>
              </div>
              <div
                className={isUser ? 'gd-chat-bubble-candidate' : 'gd-chat-bubble-avatar'}
                style={
                  isUser
                    ? { lineHeight: 1.48 }
                    : {
                        borderColor: accentBorder,
                        background: isTimeCheck ? 'rgba(245,158,11,0.1)' : 'var(--bg3)',
                        lineHeight: 1.5,
                      }
                }
              >
                {m.content}
              </div>
            </div>
          );
        })}

        {loading && (
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', padding: '4px 6px' }}>
            <span style={{ fontSize: 11.5, color: 'var(--teal)', fontWeight: 700 }}>
              ✨ {turnPhase === 'avatar_a' ? 'Challenger formulating counterpoint...' : 'Diplomat bridging both views...'}
            </span>
          </div>
        )}

        {/* Live Voice Capture Preview */}
        {isUserTurn && liveTranscript.trim() && (
          <div
            style={{
              alignSelf: 'flex-end',
              maxWidth: '88%',
              padding: '8px 12px',
              borderRadius: '12px 12px 2px 12px',
              border: '1.5px dashed var(--teal)',
              background: 'rgba(20,184,166,0.08)',
              color: '#ccfbf1',
              fontSize: 12.5,
              lineHeight: 1.45,
            }}
          >
            <div style={{ fontSize: 9.5, fontWeight: 900, color: 'var(--teal)', marginBottom: 2 }}>
              🎙️ LIVE VOICE PREVIEW
            </div>
            {liveTranscript}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Bottom Controls & Creative Starter Chips */}
      <div style={{ borderTop: '1px solid var(--border)', background: 'var(--bg3)', padding: 10 }}>
        {/* Suggested idea cue */}
        {suggestedHelperText && (
          <div
            style={{
              background: 'rgba(20,184,166,0.08)',
              border: '1px dashed var(--teal)',
              borderRadius: 10,
              padding: '8px 10px',
              marginBottom: 8,
            }}
            className="animate-fade-in"
          >
            <div
              style={{
                fontSize: 9.5,
                fontWeight: 900,
                color: 'var(--teal)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 3,
              }}
            >
              <span>💡 DISCUSSION CUE (SPEAK OR TAP TO USE)</span>
              <button
                type="button"
                onClick={onClearHelperText}
                style={{ background: 'none', border: 'none', color: 'var(--t3)', cursor: 'pointer', fontSize: 11, fontWeight: 900 }}
              >
                ✕
              </button>
            </div>
            <p style={{ margin: 0, fontSize: 11.5, color: 'var(--t1)', lineHeight: 1.4 }}>
              “{suggestedHelperText}”
            </p>
            {isUserTurn && (
              <button
                type="button"
                onClick={() => onInputTextChange(suggestedHelperText)}
                style={{
                  marginTop: 6,
                  padding: '3px 8px',
                  borderRadius: 6,
                  border: '1px solid var(--teal)',
                  background: 'rgba(20,184,166,0.14)',
                  color: 'var(--teal)',
                  fontSize: 10.5,
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                Use in Reply Box
              </button>
            )}
          </div>
        )}

        {/* Clickable Starter / Question Chips (when Coach Chips enabled & User's turn) */}
        {isUserTurn && showCoachChips && starterPrompts.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 8 }}>
            <span style={{ fontSize: 9.5, fontWeight: 900, color: 'var(--t3)', letterSpacing: '0.4px' }}>
              ⚡ QUICK IDEAS & QUESTIONS TO ASK THE PANEL
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {starterPrompts.slice(0, 3).map((chip, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => onQuickSendChip(chip)}
                  style={{
                    textAlign: 'left',
                    padding: '5px 8px',
                    borderRadius: 8,
                    border: '1px solid rgba(20,184,166,0.3)',
                    background: 'rgba(20,184,166,0.06)',
                    color: 'var(--t2)',
                    fontSize: 10.5,
                    lineHeight: 1.3,
                    cursor: 'pointer',
                    maxWidth: '100%',
                  }}
                  title="Click to populate your reply box (edit freely before sending)"
                >
                  {chip.length > 76 ? `${chip.slice(0, 74)}…` : chip}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Status + Mic Row */}
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <div
            role="status"
            aria-live="polite"
            style={{
              flex: 1,
              minWidth: 0,
              padding: '7px 10px',
              borderRadius: 10,
              border: '1px solid var(--border)',
              background: 'var(--bg2)',
              color: isUserTurn && micActive ? 'var(--teal)' : 'var(--t3)',
              fontSize: 11,
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span>{isUserTurn ? (micActive ? '🟢' : '🟡') : '🎧'}</span>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {phaseStatusText}
            </span>
          </div>

          {isUserTurn && (
            <>
              <button
                type="button"
                onClick={onToggleMic}
                aria-label={micActive ? 'Pause microphone' : 'Start microphone'}
                style={{
                  background: micActive ? 'rgba(239,68,68,0.18)' : 'rgba(20,184,166,0.14)',
                  border: `1.5px solid ${micActive ? '#ef4444' : 'var(--teal)'}`,
                  borderRadius: 10,
                  padding: '6px 10px',
                  color: micActive ? '#fca5a5' : 'var(--teal)',
                  cursor: 'pointer',
                  fontSize: 11,
                  fontWeight: 800,
                  whiteSpace: 'nowrap',
                }}
              >
                {micActive ? '⏸ Pause Mic' : '🎙️ Start Mic'}
              </button>
              <button
                type="button"
                onClick={onSuggestArgument}
                style={{
                  background: 'rgba(99,102,241,0.14)',
                  border: '1px solid rgba(129,140,248,0.5)',
                  borderRadius: 10,
                  padding: '6px 9px',
                  color: '#c7d2fe',
                  fontSize: 11,
                  fontWeight: 800,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
                title="Get a creative discussion angle"
              >
                💡 Idea
              </button>
            </>
          )}
        </div>

        {/* Text Reply Form */}
        {isUserTurn && (
          <form onSubmit={onSendMessage} style={{ display: 'flex', gap: 6, marginTop: 8 }}>
            <input
              value={inputText}
              onChange={event => onInputTextChange(event.target.value)}
              aria-label="Type your discussion point or question"
              placeholder="Share your view or ask the panel a question…"
              disabled={loading}
              maxLength={2000}
              style={{
                flex: 1,
                minWidth: 0,
                padding: '9px 12px',
                borderRadius: 10,
                border: '1px solid var(--border)',
                background: 'var(--bg2)',
                color: 'var(--t1)',
                fontSize: 12.5,
                outline: 'none',
              }}
            />
            <button
              type="submit"
              disabled={!inputText.trim() || loading}
              className="btn-primary"
              style={{
                padding: '8px 14px',
                borderRadius: 10,
                border: 'none',
                fontWeight: 900,
                fontSize: 12.5,
                opacity: !inputText.trim() || loading ? 0.45 : 1,
                cursor: !inputText.trim() || loading ? 'not-allowed' : 'pointer',
              }}
            >
              Send →
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
