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
  isSpeechSupported?: boolean;
  onDoneSpeaking?: () => void;
}

export function InterviewVoiceHud({
  isVoiceListening,
  isAvatarSpeaking,
  activeTeacher,
  liveSpeechTranscript,
  stopVoiceListening,
  startVoiceListening,
  isSpeechSupported = true,
  onDoneSpeaking
}: InterviewVoiceHudProps) {
  return (
    <div style={{
      background: !isSpeechSupported
        ? 'rgba(239, 68, 68, 0.1)'
        : isVoiceListening
        ? 'linear-gradient(90deg, rgba(var(--success-rgb),0.15) 0%, rgba(var(--info-rgb),0.15) 100%)'
        : 'var(--bg3)',
      border: '1px solid ' + (!isSpeechSupported ? 'var(--danger)' : isVoiceListening ? 'var(--success)' : 'var(--border)'),
      borderRadius: 12,
      padding: '8px 16px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: 10
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 260 }}>
        <span style={{ fontSize: 16 }}>{!isSpeechSupported ? '⚠️' : isAvatarSpeaking ? '🗣️' : isVoiceListening ? '🎙️' : '🎤'}</span>
        <div>
          <div style={{ fontSize: 12, fontWeight: 900, color: 'var(--t1)' }}>
            {!isSpeechSupported
              ? 'Speech Recognition Not Supported in this Browser'
              : isAvatarSpeaking
              ? `${activeTeacher.name} is Speaking...`
              : isVoiceListening
              ? 'SPOKEN VOICE RECOGNITION ACTIVE'
              : 'Voice Mode Standby'}
          </div>
          <div style={{ fontSize: 11, color: !isSpeechSupported ? 'var(--danger-bright, #ef4444)' : isVoiceListening ? 'var(--success)' : 'var(--t2)', fontWeight: liveSpeechTranscript ? 800 : 600 }}>
            {!isSpeechSupported
              ? 'Web Speech API is not available on this browser. Please use the text input below to submit responses.'
              : isAvatarSpeaking
              ? 'Listening to avatar audio response (Speak anytime to interrupt)...'
              : liveSpeechTranscript
              ? `Hearing your voice: "${liveSpeechTranscript}"`
              : isVoiceListening
              ? '🟢 Microphone active — Speak naturally to answer (or click "Done Speaking")'
              : 'Click "Speak to Avatar" or enable Auto Voice Loop.'}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {liveSpeechTranscript && onDoneSpeaking && (
          <button
            onClick={onDoneSpeaking}
            style={{
              background: 'linear-gradient(135deg, var(--success) 0%, var(--green-mid) 100%)',
              border: 'none',
              color: '#ffffff',
              borderRadius: 8,
              padding: '6px 14px',
              fontSize: 11,
              fontWeight: 900,
              cursor: 'pointer',
              boxShadow: '0 0 10px rgba(var(--success-rgb),0.5)'
            }}
            title="Immediately send what you have spoken without waiting for silence"
          >
            ✅ Done Speaking ➔
          </button>
        )}

        {isVoiceListening && (
          <button
            onClick={stopVoiceListening}
            style={{
              background: 'var(--danger-light)',
              border: '1px solid var(--danger)',
              color: 'var(--danger)',
              borderRadius: 6,
              padding: '5px 10px',
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
          disabled={!isSpeechSupported || isVoiceListening || isAvatarSpeaking}
          style={{
            background: isVoiceListening ? 'var(--success)' : !isSpeechSupported ? 'var(--bg2)' : 'var(--accent)',
            border: 'none',
            color: 'var(--text)',
            borderRadius: 8,
            padding: '6px 14px',
            fontSize: 11,
            fontWeight: 900,
            cursor: !isSpeechSupported || isVoiceListening ? 'default' : 'pointer',
            opacity: !isSpeechSupported ? 0.5 : 1
          }}
        >
          {isVoiceListening ? '🎙️ Listening...' : '🎤 Force Mic Reactivate'}
        </button>
      </div>
    </div>
  );
}

