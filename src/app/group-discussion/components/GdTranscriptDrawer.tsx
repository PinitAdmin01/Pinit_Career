'use client';

import React from 'react';

export interface GdChatMessage {
  sender: string;
  role: string;
  content: string;
  emoji: string;
}

interface GdTranscriptDrawerProps {
  selectedConcept: string;
  callDuration: number;
  candidateTurnTimer: number | null;
  messages: GdChatMessage[];
  loading: boolean;
  suggestedHelperText: string;
  micActive: boolean;
  handRaised: boolean;
  onClearHelperText: () => void;
  onToggleMic: () => void;
  onSuggestArgument: () => void;
  onToggleRaiseHand: () => void;
  onExportTranscript: (format: 'markdown' | 'json') => void;
  bottomRef: React.RefObject<HTMLDivElement>;
}

export default function GdTranscriptDrawer({
  selectedConcept,
  callDuration,
  candidateTurnTimer,
  messages,
  loading,
  suggestedHelperText,
  micActive,
  handRaised,
  onClearHelperText,
  onToggleMic,
  onSuggestArgument,
  onToggleRaiseHand,
  onExportTranscript,
  bottomRef
}: GdTranscriptDrawerProps) {
  return (
    <div className="gd-chat-panel">
      {/* Window Header */}
      <div className="gd-chat-window-header">
        <div>
          <span style={{ fontSize: 9, fontFamily: 'var(--font-mono)', color: 'var(--t3)' }}>BOARD OBJECTIVE</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              fontSize: 11.5,
              fontWeight: 900,
              color: 'var(--t1)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: 140
            }}>
              {selectedConcept}
            </div>
            <div className="gd-timer-badge-active">
              <span>⏱️</span>
              <span>{Math.floor(callDuration / 60).toString().padStart(2, '0')}:{(callDuration % 60).toString().padStart(2, '0')}</span>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {candidateTurnTimer !== null && (
            <div className="gd-user-turn-badge">
              🎙️ USER TURN: {candidateTurnTimer}s
            </div>
          )}
          <button
            onClick={() => onExportTranscript('markdown')}
            style={{
              background: 'rgba(var(--accent-teal-rgb),  0.1)',
              border: '1px solid var(--teal)',
              borderRadius: 6,
              padding: '3px 8px',
              fontSize: 10,
              fontWeight: 800,
              color: 'var(--teal)',
              cursor: 'pointer'
            }}
            title="Export discussion transcript as Markdown minutes"
          >
            📥 Minutes
          </button>
        </div>
      </div>

      {/* Message List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {messages.map((m, idx) => (
          <div
            key={idx}
            className="gd-bubble-container"
            style={{ alignItems: m.role === 'SDE Candidate' ? 'flex-end' : 'flex-start' }}
          >
            <div className="gd-bubble-meta">
              <span>{m.emoji}</span>
              <strong>{m.sender}</strong>
              <span>({m.role})</span>
            </div>
            <div 
              className="gd-chat-bubble"
              style={{
                background: m.role === 'SDE Candidate' ? 'var(--accent)' : 'var(--bg3)',
                color: m.role === 'SDE Candidate' ? 'white' : 'var(--t1)'
              }}
            >
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', gap: 4, alignItems: 'center', padding: 4 }}>
            <span style={{ fontSize: 10, color: 'var(--t3)' }}>⚡ Avatars thinking...</span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input & Controls bar */}
      <div style={{ borderTop: '1px solid var(--border)', background: 'var(--bg3)', padding: 10 }}>
        {/* Reading script prompt card */}
        {suggestedHelperText && (
          <div style={{
            background: 'rgba(var(--accent-teal-rgb),  0.05)',
            border: '1.5px dashed var(--teal)',
            borderRadius: 12,
            padding: '10px 14px',
            marginBottom: 8,
            position: 'relative'
          }} className="animate-fade-in">
            <div style={{
              fontSize: 9,
              fontWeight: 900,
              color: 'var(--teal)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 4
            }}>
              <span>📖 SUGGESTED ARGUMENT (READ THIS ALOUD)</span>
              <button
                onClick={onClearHelperText}
                style={{ background: 'none', border: 'none', color: 'var(--t4)', cursor: 'pointer', fontSize: 11, fontWeight: 900 }}
              >
                ✕
              </button>
            </div>
            <p style={{ margin: 0, fontSize: 11, color: 'var(--t1)', lineHeight: 1.4 }}>
              "{suggestedHelperText}"
            </p>
          </div>
        )}

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button
            type="button"
            onClick={onToggleMic}
            style={{
              background: micActive ? 'rgba(var(--danger-rgb),  0.2)' : 'rgba(var(--accent-teal-rgb),  0.1)',
              border: `1.5px solid ${micActive ? 'var(--coral)' : 'var(--teal)'}`,
              borderRadius: '50%',
              width: 34,
              height: 34,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: 14,
              transition: 'all 0.2s',
              outline: 'none'
            }}
            title={micActive ? 'Mute Microphone' : 'Unmute Microphone (Speak to Boardroom)'}
          >
            {micActive ? '🎙️' : '🔇'}
          </button>
          
          <div style={{
            flex: 1,
            padding: '8px 12px',
            borderRadius: 16,
            border: '1px solid var(--border)',
            background: 'var(--bg2)',
            color: micActive ? 'var(--teal)' : 'var(--t3)',
            fontSize: 10.5,
            fontWeight: 800,
            fontFamily: 'var(--font-mono)',
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}>
            <span style={{ animation: micActive ? 'pulse 1.5s infinite' : 'none' }}>
              {micActive ? '🟢' : '🔴'}
            </span>
            {micActive ? "LIVE CAPTURE: Speak into your microphone..." : "VOICE TRANSMISSION MUTED"}
          </div>

          <button
            type="button"
            onClick={onSuggestArgument}
            style={{
              background: 'rgba(var(--accent-teal-rgb),  0.1)',
              border: '1.5px solid var(--teal)',
              borderRadius: 12,
              padding: '8px 12px',
              color: 'var(--teal)',
              fontSize: 10,
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              whiteSpace: 'nowrap'
            }}
            title="Generate a technical talking point helper"
          >
            🎲 Suggest Point
          </button>

          <button
            type="button"
            onClick={onToggleRaiseHand}
            style={{
              background: handRaised ? 'rgba(249, 115, 22, 0.15)' : 'rgba(255, 255, 255, 0.05)',
              border: `1.5px solid ${handRaised ? 'var(--orange)' : 'var(--border)'}`,
              borderRadius: 12,
              padding: '8px 12px',
              color: handRaised ? 'var(--orange)' : 'var(--t2)',
              fontSize: 10,
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              whiteSpace: 'nowrap'
            }}
            title="Raise hand to request speaking in the next turn chance"
          >
            {handRaised ? '🙋 Hand Raised' : '🙋 Raise Hand'}
          </button>
        </div>

        {micActive && (
          <div style={{ fontSize: 8.5, color: 'var(--coral)', textAlign: 'center', marginTop: 4, fontFamily: 'var(--font-mono)' }}>
            🔴 MICROPHONE IS RECORDING IN REAL-TIME
          </div>
        )}
      </div>
    </div>
  );
}
