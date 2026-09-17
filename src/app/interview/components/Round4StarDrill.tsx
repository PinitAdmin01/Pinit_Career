'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import type { AnimState } from '@/components/avatar/VRoidAvatarEngine';

const VRoidInterviewAvatar = dynamic(
  () => import('@/components/avatar/VRoidInterviewAvatar'),
  { ssr: false }
);

export interface Round4StarDrillProps {
  activeTeacher: { id: string; name: string; emoji: string; title: string };
  animState: AnimState;
  showCameraPreview: boolean;
  videoPreviewRef: React.RefObject<HTMLVideoElement>;
  eyeContactScore: number | null;
  wpmScore: number | null;
  lastInterviewerSpeech: string;
  isVoiceListening: boolean;
  startVoiceListening: () => void;
  finishInterview: () => void;
  manualTextInput: string;
  setManualTextInput: (val: string) => void;
  onSendMessage: (text: string) => void;
}

export const Round4StarDrill: React.FC<Round4StarDrillProps> = ({
  activeTeacher,
  animState,
  showCameraPreview,
  videoPreviewRef,
  eyeContactScore,
  wpmScore,
  lastInterviewerSpeech,
  isVoiceListening,
  startVoiceListening,
  finishInterview,
  manualTextInput,
  setManualTextInput,
  onSendMessage,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
      <div style={{ width: '85%', height: 480, background: 'var(--bg3)', borderRadius: 20, border: '1px solid var(--border)', overflow: 'hidden', position: 'relative', boxShadow: 'var(--shadow-lg)' }}>
        <VRoidInterviewAvatar teacherId={activeTeacher.id} animState={animState} zoom={1.6} />

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

        <div style={{ position: 'absolute', bottom: 16, left: '5%', right: '5%', background: 'rgba(0,0,0,0.80)', backdropFilter: 'blur(8px)', padding: '10px 16px', borderRadius: 12, color: 'var(--text)', fontSize: 12.5, lineHeight: 1.4, textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
          <strong>{activeTeacher.name}:</strong> {lastInterviewerSpeech}
        </div>
      </div>

      <div style={{ width: '85%', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button
            onClick={startVoiceListening}
            style={{
              flex: 1,
              background: isVoiceListening ? 'var(--danger)' : 'linear-gradient(135deg, var(--success) 0%, var(--success-deep) 100%)',
              border: 'none', color: 'var(--text)', borderRadius: 12, padding: '12px', fontSize: 12.5, fontWeight: 900, cursor: 'pointer',
              boxShadow: isVoiceListening ? '0 0 16px rgba(var(--danger-rgb),0.6)' : 'var(--shadow-md)'
            }}
          >
            {isVoiceListening ? '🎙️ Listening to Your Voice... (Speak Now)' : '🎤 Click to Speak STAR Response'}
          </button>

          <button onClick={finishInterview} style={{ background: 'var(--accent)', border: 'none', color: 'var(--text)', borderRadius: 12, padding: '12px 18px', fontSize: 12.5, fontWeight: 900, cursor: 'pointer' }}>
            View Results ➔
          </button>
        </div>

        {/* ⌨️ Direct Typed STAR Response Fallback */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!manualTextInput.trim()) return;
            const textToSend = manualTextInput.trim();
            setManualTextInput('');
            console.log('[Interview] ⌨️ Candidate submitted typed STAR response:', textToSend);
            onSendMessage(textToSend);
          }}
          style={{ display: 'flex', gap: 6 }}
        >
          <input
            type="text"
            value={manualTextInput}
            onChange={(e) => setManualTextInput(e.target.value)}
            placeholder="Or type your STAR response (Situation, Task, Action, Result)..."
            style={{
              flex: 1,
              padding: '10px 14px',
              borderRadius: 10,
              border: '1px solid var(--border)',
              background: 'var(--bg3)',
              color: 'var(--t1)',
              fontSize: 12
            }}
          />
          <button
            type="submit"
            disabled={!manualTextInput.trim()}
            style={{
              padding: '10px 18px',
              borderRadius: 10,
              border: 'none',
              background: manualTextInput.trim() ? 'var(--accent)' : 'var(--bg2)',
              color: manualTextInput.trim() ? 'var(--text)' : 'var(--t3)',
              fontSize: 12,
              fontWeight: 800,
              cursor: manualTextInput.trim() ? 'pointer' : 'default'
            }}
          >
            Send ➔
          </button>
        </form>
      </div>
    </div>
  );
};
export default Round4StarDrill;
