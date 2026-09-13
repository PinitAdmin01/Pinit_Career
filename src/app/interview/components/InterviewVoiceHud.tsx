'use client';

import React from 'react';
import { AvatarTeacher } from '../interviewTypes';

interface InterviewVoiceHudProps {
  isVoiceListening: boolean;
  isAvatarSpeaking: boolean;
  activeTeacher: AvatarTeacher;
  liveSpeechTranscript: string;
  stopVoiceListening: () => void;
  startVoiceListening: () => void;
}

export function InterviewVoiceHud({
  isVoiceListening,
  isAvatarSpeaking,
  activeTeacher,
  liveSpeechTranscript,
  stopVoiceListening,
  startVoiceListening
}: InterviewVoiceHudProps) {
  return (
    <div style={{
      background: isVoiceListening ? 'linear-gradient(90deg, rgba(var(--success-rgb),0.15) 0%, rgba(var(--info-rgb),0.15) 100%)' : 'var(--bg3)',
      border: '1px solid ' + (isVoiceListening ? 'var(--success)' : 'var(--border)'),
      borderRadius: 12,
      padding: '8px 16px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 16 }}>{isAvatarSpeaking ? '🗣️' : isVoiceListening ? '🎙️' : '🎤'}</span>
        <div>
          <div style={{ fontSize: 12, fontWeight: 900, color: 'var(--t1)' }}>
            {isAvatarSpeaking ? `${activeTeacher.name} is Speaking...` : isVoiceListening ? 'SPOKEN VOICE RECOGNITION ACTIVE' : 'Voice Mode Standby'}
          </div>
          <div style={{ fontSize: 11, color: isVoiceListening ? 'var(--success)' : 'var(--t2)', fontWeight: liveSpeechTranscript ? 800 : 600 }}>
            {isAvatarSpeaking
              ? 'Listening to avatar audio response (Speak anytime to interrupt)...'
              : liveSpeechTranscript
              ? `Hearing your voice: "${liveSpeechTranscript}"`
              : isVoiceListening
              ? '🟢 Microphone active — Speak naturally to answer'
              : 'Click "Speak to Avatar" or enable Auto Voice Loop.'}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {isVoiceListening && (
          <button
            onClick={stopVoiceListening}
            style={{
              background: 'var(--danger-light)',
              border: '1px solid var(--danger)',
              color: 'var(--danger)',
              borderRadius: 6,
              padding: '4px 10px',
              fontSize: 10,
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            🛑 Pause Mic
          </button>
        )}

        <button
          onClick={startVoiceListening}
          disabled={isVoiceListening || isAvatarSpeaking}
          style={{
            background: isVoiceListening ? 'var(--success)' : 'var(--accent)',
            border: 'none',
            color: 'var(--text)',
            borderRadius: 8,
            padding: '6px 14px',
            fontSize: 11,
            fontWeight: 900,
            cursor: isVoiceListening ? 'default' : 'pointer'
          }}
        >
          {isVoiceListening ? '🎙️ Listening...' : '🎤 Force Mic Reactivate'}
        </button>
      </div>
    </div>
  );
}
