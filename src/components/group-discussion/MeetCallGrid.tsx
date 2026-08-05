'use client';

import { useState, useEffect } from 'react';

interface Avatar {
  id: string;
  name: string;
  emoji: string;
  role: string;
  color: string;
  trait: 'proactive' | 'reactive' | 'silent' | 'aggressive';
  description: string;
}

interface MeetCallGridProps {
  invitedAvatars: string[];
  avatarsList: Avatar[];
  activeSpeakingAvatar: string | null;
  currentAvatarARoleId?: string | null;
  currentAvatarBRoleId?: string | null;
  isUserTurn?: boolean;
  onUserFinishSpeaking?: () => void;
  onToggleRaiseHand?: () => void;
  onEndCall: () => void;
  onForceExit: () => void;
  hostId: string;
  handRaised: boolean;
  micActive?: boolean;
  callDurationSeconds?: number;
}

export default function MeetCallGrid({
  invitedAvatars,
  avatarsList,
  activeSpeakingAvatar,
  currentAvatarARoleId,
  currentAvatarBRoleId,
  isUserTurn,
  onUserFinishSpeaking,
  onToggleRaiseHand,
  onEndCall,
  onForceExit,
  hostId,
  handRaised,
  micActive,
  callDurationSeconds = 0
}: MeetCallGridProps) {
  const [connecting, setConnecting] = useState(true);

  // Fast 1-second boardroom sync connection simulation
  useEffect(() => {
    const timer = setTimeout(() => setConnecting(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Format 10-minute countdown time remaining: 600 - callDurationSeconds
  const remainingSeconds = Math.max(0, 600 - callDurationSeconds);
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const formattedTimer = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  if (connecting) {
    return (
      <div style={{
        background: '#090d16',
        borderRadius: 24,
        padding: 40,
        aspectRatio: '16/9',
        minHeight: 420,
        border: '1.5px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16
      }} className="animate-fade-in">
        <span style={{ fontSize: 44, animation: 'spin 2s linear infinite' }}>⚙️</span>
        <h3 style={{ fontSize: 16, fontWeight: 900, color: 'white', margin: 0, letterSpacing: '0.5px' }}>
          Initializing 9-Member Boardroom Sync...
        </h3>
        <p style={{ fontSize: 11, color: 'var(--t3)', margin: 0 }}>
          Calibrating audio channels and routing multi-agent streams for 10-minute session.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }} className="animate-fade-in">
      
      {/* Top Header Bar with 10-Min Countdown Timer */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'var(--bg2)',
        border: '1px solid var(--border)',
        borderRadius: 16,
        padding: '10px 16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 900, color: 'var(--t1)' }}>
            🏛️ 9-Member Boardroom
          </span>
          <span style={{ fontSize: 10, color: 'var(--t3)', background: 'var(--bg3)', padding: '2px 8px', borderRadius: 6, fontWeight: 700 }}>
            {invitedAvatars.length + 1} Participants Active
          </span>
        </div>

        {/* Countdown Timer Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          background: remainingSeconds <= 60 ? 'rgba(239, 68, 68, 0.15)' : remainingSeconds <= 300 ? 'rgba(245, 158, 11, 0.15)' : 'rgba(20, 184, 166, 0.15)',
          border: `1.5px solid ${remainingSeconds <= 60 ? 'var(--red)' : remainingSeconds <= 300 ? 'var(--orange)' : 'var(--teal)'}`,
          borderRadius: 10,
          padding: '4px 12px',
          fontFamily: 'var(--font-mono)',
          fontWeight: 900,
          color: remainingSeconds <= 60 ? 'var(--red)' : remainingSeconds <= 300 ? 'var(--orange)' : 'var(--teal)',
          fontSize: 13
        }}>
          <span>⏱️ GD REMAINING:</span>
          <span>{formattedTimer}</span>
        </div>
      </div>

      {/* Boardroom Participant Grid (9 Cards) */}
      {/* Boardroom Participant Grid (Strict 3x3 Matrix - 9 Cards) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridTemplateRows: 'repeat(3, 1fr)',
        gap: 10,
        background: '#090d16',
        borderRadius: 24,
        padding: 14,
        height: 'calc(100vh - 180px)',
        minHeight: 560,
        border: '1.5px solid var(--border)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        
        {/* Candidate / User Card */}
        <div style={{
          background: micActive ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' : '#1e293b',
          borderRadius: 16,
          border: `2.5px solid ${isUserTurn ? 'var(--coral)' : micActive ? 'var(--green)' : 'var(--accent)'}`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          minHeight: 155,
          position: 'relative',
          boxShadow: isUserTurn ? '0 0 24px rgba(239, 68, 68, 0.45)' : micActive ? '0 0 20px rgba(34,197,94,0.4)' : '0 8px 24px rgba(0,0,0,0.3)',
          transition: 'all 0.25s ease'
        }}>
          {handRaised && (
            <span style={{
              position: 'absolute',
              top: 10,
              right: 10,
              background: 'rgba(249,115,22,0.2)',
              border: '1.5px solid var(--orange)',
              borderRadius: 6,
              padding: '2px 7px',
              fontSize: 8.5,
              fontWeight: 900,
              color: 'var(--orange)',
              fontFamily: 'var(--font-mono)'
            }}>
              🙋 RAISED HAND
            </span>
          )}

          {isUserTurn && (
            <span style={{
              position: 'absolute',
              top: 10,
              left: 10,
              background: 'rgba(239,68,68,0.2)',
              border: '1.5px solid var(--coral)',
              borderRadius: 6,
              padding: '2px 7px',
              fontSize: 8.5,
              fontWeight: 900,
              color: 'var(--coral)',
              fontFamily: 'var(--font-mono)',
              animation: 'pulse 1.5s infinite'
            }}>
              🎙️ YOUR TURN
            </span>
          )}
          
          <div style={{
            width: 52,
            height: 52,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 26,
            boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
            border: micActive ? '2px solid var(--green)' : '2px solid rgba(255,255,255,0.2)'
          }}>
            🎓
          </div>

          <span style={{ fontSize: 11.5, fontWeight: 900, color: 'white', marginTop: 8 }}>You (Candidate)</span>
          
          <span style={{
            fontSize: 8.5,
            color: micActive ? 'var(--green)' : 'var(--t4)',
            position: 'absolute',
            bottom: 8,
            fontFamily: 'var(--font-mono)',
            fontWeight: 800
          }}>
            {micActive ? '🟢 MIC ACTIVE' : '🔴 MIC MUTED'}
          </span>
        </div>

        {/* Invited Avatars Cards */}
        {invitedAvatars.map(id => {
          const avatar = avatarsList.find(a => a.id === id);
          if (!avatar) return null;
          const isSpeaking = activeSpeakingAvatar === avatar.name;
          const isAvatarA = currentAvatarARoleId === id;
          const isAvatarB = currentAvatarBRoleId === id;

          return (
            <div
              key={id}
              style={{
                background: isSpeaking ? 'linear-gradient(135deg, #1b233d 0%, #0d1527 100%)' : '#111827',
                borderRadius: 16,
                border: `2.5px solid ${isSpeaking ? 'var(--teal)' : isAvatarA ? '#3b82f6' : isAvatarB ? '#8b5cf6' : 'rgba(255,255,255,0.08)'}`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                position: 'relative',
                boxShadow: isSpeaking ? '0 0 20px rgba(20,184,166,0.35)' : 'var(--shadow-md)',
                transition: 'all 0.25s ease',
                overflow: 'hidden',
                paddingBottom: 6,
                height: '100%',
                minHeight: 155
              }}
            >
              {id === hostId && (
                <div style={{
                  position: 'absolute',
                  top: 8,
                  left: 8,
                  background: 'rgba(79,70,229,0.25)',
                  border: '1.5px solid #4f46e5',
                  borderRadius: 6,
                  padding: '1px 6px',
                  fontSize: 7.5,
                  fontWeight: 900,
                  color: '#818cf8',
                  fontFamily: 'var(--font-mono)',
                  zIndex: 10
                }}>
                  👑 HOST
                </div>
              )}

              {isAvatarA && id !== hostId && (
                <div style={{
                  position: 'absolute',
                  top: 8,
                  left: 8,
                  background: 'rgba(59,130,246,0.25)',
                  border: '1.5px solid #3b82f6',
                  borderRadius: 6,
                  padding: '1px 6px',
                  fontSize: 7.5,
                  fontWeight: 900,
                  color: '#60a5fa',
                  fontFamily: 'var(--font-mono)',
                  zIndex: 10
                }}>
                  🔵 AVATAR A
                </div>
              )}

              {isAvatarB && id !== hostId && (
                <div style={{
                  position: 'absolute',
                  top: 8,
                  left: 8,
                  background: 'rgba(139,92,246,0.25)',
                  border: '1.5px solid #8b5cf6',
                  borderRadius: 6,
                  padding: '1px 6px',
                  fontSize: 7.5,
                  fontWeight: 900,
                  color: '#c084fc',
                  fontFamily: 'var(--font-mono)',
                  zIndex: 10
                }}>
                  🟣 AVATAR B
                </div>
              )}

              {isSpeaking && (
                <div style={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  background: 'rgba(20,184,166,0.25)',
                  border: '1.5px solid var(--teal)',
                  borderRadius: 6,
                  padding: '1px 6px',
                  fontSize: 7.5,
                  fontWeight: 900,
                  color: 'var(--teal)',
                  fontFamily: 'var(--font-mono)',
                  zIndex: 10
                }}>
                  🎙️ SPEAKING
                </div>
              )}

              {/* Avatar Profile Box */}
              <div style={{
                width: '100%',
                flex: 1,
                minHeight: 60,
                maxHeight: 90,
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '12px 12px 0 0',
                background: isSpeaking ? 'linear-gradient(135deg, #1e1b4b 0%, #1e293b 100%)' : '#0f172a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  background: avatar.color || '#4f46e5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 22,
                  boxShadow: isSpeaking ? '0 0 16px rgba(20,184,166,0.5)' : '0 4px 12px rgba(0,0,0,0.3)',
                  transition: 'all 0.3s ease',
                  transform: isSpeaking ? 'scale(1.08)' : 'scale(1.0)'
                }}>
                  {avatar.emoji}
                </div>

                {/* Animated Speech Soundwaves */}
                {isSpeaking && (
                  <div style={{
                    position: 'absolute',
                    bottom: 4,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3
                  }}>
                    <div style={{ width: 3, height: 10, background: 'var(--teal)', borderRadius: 2, animation: 'bounce 0.6s infinite ease-in-out' }} />
                    <div style={{ width: 3, height: 15, background: 'var(--teal)', borderRadius: 2, animation: 'bounce 0.6s infinite 0.15s ease-in-out' }} />
                    <div style={{ width: 3, height: 7, background: 'var(--teal)', borderRadius: 2, animation: 'bounce 0.6s infinite 0.3s ease-in-out' }} />
                    <div style={{ width: 3, height: 12, background: 'var(--teal)', borderRadius: 2, animation: 'bounce 0.6s infinite 0.45s ease-in-out' }} />
                  </div>
                )}
              </div>

              <span style={{ fontSize: 'clamp(9.5px, 1.1vw, 11px)', fontWeight: 800, color: 'white', marginTop: 2, textAlign: 'center' }}>
                {avatar.name}
              </span>
              <span style={{
                fontSize: 'clamp(7.5px, 0.9vw, 9px)',
                color: 'var(--t3)',
                marginTop: 1,
                textAlign: 'center',
                padding: '0 4px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                width: '92%'
              }}>
                {avatar.role}
              </span>
              
              <span style={{
                fontSize: 'clamp(7px, 0.8vw, 8px)',
                color: isSpeaking ? 'var(--teal)' : 'var(--t4)',
                fontFamily: 'var(--font-mono)',
                fontWeight: 800,
                marginTop: 'auto',
                marginBottom: 4
              }}>
                {avatar.trait.toUpperCase()} MODE
              </span>
            </div>
          );
        })}
      </div>

      {/* Control Buttons */}
      <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
        {/* Interactive "Done Speaking / Pass Turn" button for user during turn */}
        {isUserTurn && onUserFinishSpeaking && (
          <button
            onClick={onUserFinishSpeaking}
            className="btn-primary"
            style={{
              flex: 2,
              padding: 10,
              justifyContent: 'center',
              background: 'linear-gradient(135deg, var(--teal) 0%, var(--accent) 100%)',
              border: 'none',
              color: '#fff',
              fontWeight: 900,
              borderRadius: 12,
              cursor: 'pointer',
              fontSize: 13,
              boxShadow: '0 0 16px rgba(20,184,166,0.4)',
              animation: 'pulse 2s infinite'
            }}
          >
            ✋ Done Speaking (Pass Turn to Avatar A)
          </button>
        )}

        {/* Interactive "Raise Hand to Interject Next" button for user while avatars are speaking */}
        {!isUserTurn && (
          <button
            onClick={onToggleRaiseHand}
            className="btn-primary"
            style={{
              flex: 2,
              padding: 10,
              justifyContent: 'center',
              background: handRaised ? 'rgba(249, 115, 22, 0.25)' : 'rgba(59, 130, 246, 0.15)',
              border: handRaised ? '1.5px solid var(--orange)' : '1.5px solid #3b82f6',
              color: handRaised ? 'var(--orange)' : '#60a5fa',
              fontWeight: 900,
              borderRadius: 12,
              cursor: 'pointer',
              fontSize: 13
            }}
          >
            {handRaised ? '🙋 Hand Raised (You speak next after avatar)' : '🙋 Raise Hand to Interject Next'}
          </button>
        )}

        <button
          onClick={onEndCall}
          className="btn-primary"
          style={{
            flex: 1,
            padding: 10,
            justifyContent: 'center',
            background: 'var(--red)',
            border: 'none',
            color: '#fff',
            fontWeight: 800,
            borderRadius: 12,
            cursor: 'pointer',
            fontSize: 13
          }}
        >
          🛑 End & Report
        </button>
        <button
          onClick={onForceExit}
          className="btn-ghost"
          style={{
            flex: 1,
            padding: 10,
            justifyContent: 'center',
            border: '1.5px solid var(--coral)',
            color: 'var(--coral)',
            fontWeight: 800,
            borderRadius: 12,
            cursor: 'pointer',
            fontSize: 13
          }}
        >
          ❌ Leave Meeting
        </button>
      </div>
    </div>
  );
}
