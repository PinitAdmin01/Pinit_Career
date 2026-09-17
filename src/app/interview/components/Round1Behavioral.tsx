'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import type { AnimState } from '@/components/avatar/VRoidAvatarEngine';

const VRoidInterviewAvatar = dynamic(
  () => import('@/components/avatar/VRoidInterviewAvatar'),
  { ssr: false }
);

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface Round1BehavioralProps {
  activeTeacher: { id: string; name: string; emoji: string; title: string };
  animState: AnimState;
  showCameraPreview: boolean;
  videoPreviewRef: React.RefObject<HTMLVideoElement>;
  eyeContactScore: number | null;
  wpmScore: number | null;
  isAvatarSpeaking: boolean;
  isVoiceListening: boolean;
  lastInterviewerSpeech: string;
  onProceed: () => void;
  fillerWordCount: number;
  messages: Message[];
  messagesEndRef: React.RefObject<HTMLDivElement>;
  startVoiceListening: () => void;
  manualTextInput: string;
  setManualTextInput: (val: string) => void;
  onSendMessage: (text: string) => void;
}

export const Round1Behavioral: React.FC<Round1BehavioralProps> = ({
  activeTeacher,
  animState,
  showCameraPreview,
  videoPreviewRef,
  eyeContactScore,
  wpmScore,
  isAvatarSpeaking,
  isVoiceListening,
  lastInterviewerSpeech,
  onProceed,
  fillerWordCount,
  messages,
  messagesEndRef,
  startVoiceListening,
  manualTextInput,
  setManualTextInput,
  onSendMessage,
}) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '6fr 4fr', gap: 16, alignItems: 'stretch' }}>
      {/* Left 60%: 3D VRoid Avatar Viewport */}
      <div style={{ height: 500, background: 'var(--bg3)', borderRadius: 20, border: '1px solid var(--border)', overflow: 'hidden', position: 'relative', boxShadow: 'var(--shadow-md)' }}>
        <VRoidInterviewAvatar teacherId={activeTeacher.id} animState={animState} zoom={1.65} />

        {/* Floating Candidate Camera PiP Preview (IV-UX-03: Live Eye Contact & Vocal Pace HUD) */}
        {showCameraPreview && (
          <div style={{
            position: 'absolute', top: 14, right: 14, width: 140, height: 105,
            borderRadius: 12, overflow: 'hidden', border: '2px solid var(--accent)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.6)', background: '#000', zIndex: 20
          }}>
            <video ref={videoPreviewRef} autoPlay muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{
              position: 'absolute', bottom: 3, left: 3, right: 3,
              background: 'rgba(0,0,0,0.78)', backdropFilter: 'blur(4px)',
              borderRadius: 6, padding: '2px 6px', fontSize: 8.5, color: 'var(--text)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 800
            }}>
              <span style={{ color: eyeContactScore !== null ? (eyeContactScore >= 60 ? 'var(--success-bright)' : 'var(--warning-bright)') : 'var(--text-muted)' }}>
                📷 {eyeContactScore !== null ? (eyeContactScore >= 60 ? 'Presence: Centered' : 'Presence: Adjust Angle') : 'Detecting...'}
              </span>
              <span style={{ color: 'var(--info-bright)' }}>⚡ {wpmScore !== null ? `${wpmScore} WPM` : 'Mic Inactive'}</span>
            </div>
          </div>
        )}

        {/* Avatar Status Badge */}
        <div style={{
          position: 'absolute', top: 14, left: 14, padding: '6px 14px', borderRadius: 100,
          background: isAvatarSpeaking ? 'var(--accent)' : isVoiceListening ? 'var(--danger)' : 'var(--green)',
          backdropFilter: 'blur(8px)', color: 'var(--text)', fontSize: 11, fontWeight: 800,
          display: 'flex', alignItems: 'center', gap: 6, boxShadow: 'var(--shadow-md)'
        }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff', display: 'inline-block' }} />
          {isAvatarSpeaking ? `${activeTeacher.name} is Speaking...` : isVoiceListening ? '🎙️ Listening (Speak Now)...' : '🎤 Voice Ready'}
        </div>

        {/* Inverted Subtitle Fixed: Strictly displays interviewer's speech */}
        <div style={{
          position: 'absolute', bottom: 14, left: 14, right: 14, padding: '10px 16px',
          background: 'rgba(0,0,0,0.80)', backdropFilter: 'blur(10px)', borderRadius: 12,
          color: 'var(--text)', fontSize: 12, lineHeight: 1.4, border: '1px solid rgba(255,255,255,0.12)'
        }}>
          <strong>{activeTeacher.name}:</strong> {lastInterviewerSpeech}
        </div>
      </div>

      {/* Right 40%: Scrollable Transcript & Telemetry */}
      <div className="iv-panel" style={{ padding: 18, height: 500, display: 'flex', flexDirection: 'column' }}>
        <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: 8, marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: 10.5, fontWeight: 800, color: 'var(--accent-mid)' }}>ROUND 1 OF 4</span>
            <h2 style={{ fontSize: 14, fontWeight: 900, margin: 0, color: 'var(--t1)' }}>Behavioral & Background Intro</h2>
          </div>
          <button onClick={onProceed} style={{ background: 'var(--accent)', border: 'none', color: 'var(--text)', borderRadius: 8, padding: '6px 12px', fontSize: 11, fontWeight: 800, cursor: 'pointer' }}>
            Proceed to Round 2 ➔
          </button>
        </div>

        {/* Telemetry Bar */}
        <div style={{ background: 'var(--bg3)', borderRadius: 10, padding: '8px 12px', border: '1px solid var(--border)', marginBottom: 10, display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
          <div>👀 Eye Contact: <strong style={{ color: eyeContactScore !== null ? 'var(--green-mid)' : 'var(--t3)' }}>{eyeContactScore !== null ? `${eyeContactScore}%` : 'Cam Off'}</strong></div>
          <div>⚡ Pace: <strong style={{ color: 'var(--accent-mid)' }}>{wpmScore !== null ? `${wpmScore} WPM` : 'Mic Off'}</strong></div>
          <div>💬 Fillers: <strong style={{ color: 'var(--green-mid)' }}>{wpmScore !== null ? fillerWordCount : 'N/A'}</strong></div>
        </div>

        {/* Transcript Stream */}
        <div className="scroll-container" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10, paddingRight: 4 }}>
          {messages.map((m, i) => (
            <div key={i} style={{ alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '88%' }}>
              <div className={m.role === 'user' ? 'iv-chat-user' : 'iv-chat-assistant'} style={{ padding: '10px 14px', borderRadius: 14, fontSize: 12, lineHeight: 1.5 }}>
                {m.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button
            onClick={startVoiceListening}
            style={{
              width: '100%',
              background: isVoiceListening ? 'var(--danger)' : 'linear-gradient(135deg, var(--accent) 0%, var(--purple) 100%)',
              border: 'none', color: 'var(--text)', borderRadius: 10, padding: '10px', fontSize: 12, fontWeight: 900, cursor: 'pointer',
              boxShadow: isVoiceListening ? '0 0 14px rgba(var(--danger-rgb),0.7)' : 'var(--shadow-sm)'
            }}
          >
            {isVoiceListening ? '🎙️ Listening to Voice... (Speak Now)' : '🎤 Click to Speak Response'}
          </button>

          {/* ⌨️ Direct Typed Response Fallback for Noisy Environments */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!manualTextInput.trim()) return;
              const textToSend = manualTextInput.trim();
              setManualTextInput('');
              console.log('[Interview] ⌨️ Candidate submitted typed response:', textToSend);
              onSendMessage(textToSend);
            }}
            style={{ display: 'flex', gap: 6 }}
          >
            <input
              type="text"
              value={manualTextInput}
              onChange={(e) => setManualTextInput(e.target.value)}
              placeholder="Or type your response here..."
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: 8,
                border: '1px solid var(--border)',
                background: 'var(--bg3)',
                color: 'var(--t1)',
                fontSize: 11.5
              }}
            />
            <button
              type="submit"
              disabled={!manualTextInput.trim()}
              style={{
                padding: '8px 14px',
                borderRadius: 8,
                border: 'none',
                background: manualTextInput.trim() ? 'var(--accent)' : 'var(--bg2)',
                color: manualTextInput.trim() ? 'var(--text)' : 'var(--t3)',
                fontSize: 11.5,
                fontWeight: 800,
                cursor: manualTextInput.trim() ? 'pointer' : 'default'
              }}
            >
              Send ➔
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Round1Behavioral;
