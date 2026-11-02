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
  isUserTurn: boolean;
  inputText: string;
  messages: GdChatMessage[];
  loading: boolean;
  suggestedHelperText: string;
  micActive: boolean;
  onClearHelperText: () => void;
  onInputTextChange: (value: string) => void;
  onToggleMic: () => void;
  onSendMessage: (event: React.FormEvent) => void;
  onSuggestArgument: () => void;
  onExportTranscript: (format: 'markdown' | 'json') => void;
  bottomRef: React.RefObject<HTMLDivElement>;
}

export default function GdTranscriptDrawer({
  selectedConcept,
  callDuration,
  candidateTurnTimer,
  isUserTurn,
  inputText,
  messages,
  loading,
  suggestedHelperText,
  micActive,
  onClearHelperText,
  onInputTextChange,
  onToggleMic,
  onSendMessage,
  onSuggestArgument,
  onExportTranscript,
  bottomRef
}: GdTranscriptDrawerProps) {
  return (
    <div className="gd-chat-panel">
      {/* Window Header */}
      <div className="gd-chat-window-header">
        <div>
          <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--t3)' }}>BOARD OBJECTIVE</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              fontSize: 12.5,
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
              
              <span>{Math.floor(callDuration / 60).toString().padStart(2, '0')}:{(callDuration % 60).toString().padStart(2, '0')}</span>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {candidateTurnTimer !== null && (
            <div className="gd-user-turn-badge">
              USER TURN: {candidateTurnTimer}s
            </div>
          )}
          <button
            onClick={() => onExportTranscript('markdown')}
            style={{
              background: 'rgba(var(--accent-teal-rgb),  0.1)',
              border: '1px solid var(--teal)',
              borderRadius: 6,
              padding: '3px 8px',
              fontSize: 11,
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
            <span style={{ fontSize: 11, color: 'var(--t3)' }}>Avatars thinking...</span>
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
              fontSize: 10,
              fontWeight: 900,
              color: 'var(--teal)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 4
            }}>
              <span>OPTIONAL DISCUSSION PROMPT</span>
              <button
                onClick={onClearHelperText}
                style={{ background: 'none', border: 'none', color: 'var(--t4)', cursor: 'pointer', fontSize: 12, fontWeight: 900 }}
              >
                ✕
              </button>
            </div>
            <p style={{ margin: 0, fontSize: 12, color: 'var(--t1)', lineHeight: 1.4 }}>
              Use this as a cue, then respond in your own words: “{suggestedHelperText}”
            </p>
          </div>
        )}

        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <div role="status" aria-live="polite" style={{
            flex: 1,
            minWidth: 180,
            padding: '8px 12px',
            borderRadius: 16,
            border: '1px solid var(--border)',
            background: 'var(--bg2)',
            color: isUserTurn && micActive ? 'var(--teal)' : 'var(--t3)',
            fontSize: 11.5,
            fontWeight: 800,
            fontFamily: 'var(--font-mono)',
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}>
            <span style={{ animation: micActive ? 'pulse 1.5s infinite' : 'none' }}>
              {micActive ? '🟢' : '🔴'}
            </span>
            {isUserTurn ? (micActive ? 'Listening — speak naturally, or type below.' : 'Your turn — turn on the mic or type below.') : 'Listening to the panel discussion.'}
          </div>

          {isUserTurn && (
            <>
              <button
                type="button"
                onClick={onToggleMic}
                aria-label={micActive ? 'Turn microphone off' : 'Turn microphone on'}
                title={micActive ? 'Turn microphone off' : 'Turn microphone on'}
                style={{
                  background: micActive ? 'rgba(var(--danger-rgb), 0.2)' : 'rgba(var(--accent-teal-rgb), 0.1)',
                  border: `1.5px solid ${micActive ? 'var(--coral)' : 'var(--teal)'}`,
                  borderRadius: 12,
                  minWidth: 42,
                  height: 40,
                  cursor: 'pointer',
                  fontSize: 17
                }}
              >
                {micActive ? 'Active' : 'Mute'}
              </button>
              <button
                type="button"
                onClick={onSuggestArgument}
                style={{
                  background: 'rgba(var(--accent-teal-rgb), 0.1)',
                  border: '1.5px solid var(--teal)',
                  borderRadius: 12,
                  padding: '8px 12px',
                  color: 'var(--teal)',
                  fontSize: 11,
                  fontWeight: 800,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
                title="Get an optional prompt to help shape your own point"
              >
                Need an idea?
              </button>
            </>
          )}
        </div>

        {isUserTurn && (
          <form onSubmit={onSendMessage} style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <input
              value={inputText}
              onChange={event => onInputTextChange(event.target.value)}
              aria-label="Type your discussion response"
              placeholder="Or type your response here…"
              disabled={loading}
              maxLength={2000}
              style={{
                flex: 1,
                minWidth: 0,
                padding: '10px 12px',
                borderRadius: 12,
                border: '1px solid var(--border)',
                background: 'var(--bg2)',
                color: 'var(--t1)',
                fontSize: 13
              }}
            />
            <button
              type="submit"
              disabled={!inputText.trim() || loading}
              className="btn-primary"
              style={{ padding: '8px 14px', borderRadius: 12, border: 'none', fontWeight: 800, opacity: !inputText.trim() || loading ? 0.5 : 1 }}
            >
              Send
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
