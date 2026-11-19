'use client';

import React from 'react';
import { AvatarTeacher } from '../interviewTypes';

interface InterviewVoiceHudProps {
  isVoiceListening: boolean;
  isAvatarSpeaking: boolean;
  isSendingInterviewerReply?: boolean;
  activeTeacher: AvatarTeacher;
  liveSpeechTranscript: string;
  stopVoiceListening: () => void;
  startVoiceListening: () => void;
  isSpeechSupported?: boolean;
  onDoneSpeaking?: () => void;
  isTabInactive?: boolean;
  micAudioLevel?: number;
  bargeInEnabled?: boolean;
  setBargeInEnabled?: React.Dispatch<React.SetStateAction<boolean>>;
}

export function InterviewVoiceHud({
  isVoiceListening,
  isAvatarSpeaking,
  isSendingInterviewerReply = false,
  activeTeacher,
  liveSpeechTranscript,
  stopVoiceListening,
  startVoiceListening,
  isSpeechSupported = true,
  onDoneSpeaking,
  isTabInactive = false,
  micAudioLevel = 0,
  bargeInEnabled = false,
  setBargeInEnabled
}: InterviewVoiceHudProps) {
  return (
    <div
      data-testid="interview-voice-hud-root"
      style={{
        background: isTabInactive
          ? 'rgba(234, 179, 8, 0.12)'
          : !isSpeechSupported
          ? 'rgba(239, 68, 68, 0.1)'
          : isVoiceListening
          ? 'linear-gradient(90deg, rgba(var(--success-rgb),0.15) 0%, rgba(var(--info-rgb),0.15) 100%)'
          : 'var(--bg3)',
        border: '1px solid ' + (isTabInactive ? 'var(--warning, #eab308)' : !isSpeechSupported ? 'var(--danger)' : isVoiceListening ? 'var(--success)' : 'var(--border)'),
        borderRadius: 12,
        padding: '8px 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 10
      }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 260 }}>
        <span style={{ fontSize: 17.5 }}>{isTabInactive ? '⏸️' : !isSpeechSupported ? '⚠️' : isAvatarSpeaking ? '🗣️' : isVoiceListening ? '🎙️' : '🎤'}</span>
        <div>
          <div data-testid="interview-voice-hud-title" style={{ fontSize: 13, fontWeight: 900, color: isTabInactive ? 'var(--warning-bright, #eab308)' : 'var(--t1)' }}>
            {isTabInactive
              ? 'Interview Paused (Tab Inactive)'
              : !isSpeechSupported
              ? 'Speech Recognition Not Supported in this Browser'
            : isSendingInterviewerReply
              ? 'Interviewer is thinking…'
              : isAvatarSpeaking
              ? `${activeTeacher.name} is Speaking...`
              : isVoiceListening
              ? 'SPOKEN VOICE RECOGNITION ACTIVE'
              : 'Voice Mode Standby'}
          </div>
          <div data-testid="interview-voice-hud-subtitle" style={{ fontSize: 12, color: isTabInactive ? 'var(--warning-bright, #eab308)' : !isSpeechSupported ? 'var(--danger-bright, #ef4444)' : isVoiceListening ? 'var(--success)' : 'var(--t2)', fontWeight: liveSpeechTranscript || isTabInactive ? 800 : 600 }}>
            {isTabInactive
              ? 'Session timer and microphone are paused while this tab is backgrounded. Switching back will automatically resume.'
              : !isSpeechSupported
              ? 'Web Speech API is not available on this browser. Please use the text input below to submit responses.'
              : isSendingInterviewerReply
              ? 'Your response was sent. You can keep preparing while the interviewer replies.'
              : isAvatarSpeaking
              ? 'The interviewer is speaking. Use “Interrupt & Speak” when you’re ready to answer.'
              : liveSpeechTranscript
              ? `Hearing your voice: "${liveSpeechTranscript}"`
              : isVoiceListening
              ? '🟢 Microphone active — Speak naturally to answer (or click "Done Speaking")'
              : 'Start the microphone here, or let hands-free voice mode resume after the interviewer speaks.'}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {isVoiceListening && !isTabInactive && (
          <div
            data-testid="voice-level-meter"
            title="Live 300-3400 Hz speech band activity"
            style={{
              width: 54,
              height: 8,
              borderRadius: 99,
              background: 'rgba(255,255,255,0.1)',
              overflow: 'hidden',
              border: '1px solid rgba(34, 197, 94, 0.35)'
            }}
          >
            <div
              style={{
                width: `${Math.max(8, Math.min(100, micAudioLevel))}%`,
                height: '100%',
                borderRadius: 99,
                background: micAudioLevel > 45 ? 'var(--success-bright, #22c55e)' : 'var(--accent)',
                transition: 'width 0.08s linear'
              }}
            />
          </div>
        )}

        {setBargeInEnabled && !isTabInactive && (
          <button
            type="button"
            data-testid="voice-barge-in-toggle"
            onClick={() => setBargeInEnabled(prev => !prev)}
            title="Hands-free voice barge-in (recommended with headphones; keep OFF on laptop speakers to prevent echo)"
            style={{
              background: bargeInEnabled ? 'rgba(16, 185, 129, 0.16)' : 'var(--bg2)',
              border: bargeInEnabled ? '1px solid rgba(16, 185, 129, 0.45)' : '1px solid var(--border)',
              color: bargeInEnabled ? '#34d399' : 'var(--t3)',
              borderRadius: 6,
              padding: '5px 9px',
              fontSize: 11,
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            🎧 Barge-In: {bargeInEnabled ? 'ON' : 'OFF'}
          </button>
        )}

        {liveSpeechTranscript && onDoneSpeaking && !isTabInactive && (
          <button
            onClick={onDoneSpeaking}
            style={{
              background: 'linear-gradient(135deg, var(--success) 0%, var(--green-mid) 100%)',
              border: 'none',
              color: '#ffffff',
              borderRadius: 8,
              padding: '6px 14px',
              fontSize: 12,
              fontWeight: 900,
              cursor: 'pointer',
              boxShadow: '0 0 10px rgba(var(--success-rgb),0.5)'
            }}
            title="Immediately send what you have spoken without waiting for silence"
          >
            ✅ Done Speaking ➔
          </button>
        )}

        {isVoiceListening && !isTabInactive && (
          <button
            onClick={stopVoiceListening}
            style={{
              background: 'var(--danger-light)',
              border: '1px solid var(--danger)',
              color: 'var(--danger)',
              borderRadius: 6,
              padding: '5px 10px',
              fontSize: 11,
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            🛑 Pause Mic
          </button>
        )}

        <button
          data-testid="interview-voice-hud-action-btn"
          onClick={startVoiceListening}
          disabled={!isSpeechSupported || isVoiceListening || isAvatarSpeaking || isTabInactive}
          style={{
            background: isTabInactive ? 'var(--bg3)' : isVoiceListening ? 'var(--success)' : !isSpeechSupported ? 'var(--bg2)' : 'var(--accent)',
            border: isTabInactive ? '1px solid rgba(234, 179, 8, 0.4)' : 'none',
            color: isTabInactive ? 'var(--warning-bright, #eab308)' : 'var(--text)',
            borderRadius: 8,
            padding: '6px 14px',
            fontSize: 12,
            fontWeight: 900,
            cursor: !isSpeechSupported || isVoiceListening || isAvatarSpeaking || isTabInactive ? 'default' : 'pointer',
            opacity: !isSpeechSupported ? 0.5 : 1
          }}
        >
          {isTabInactive ? '⏸️ Paused (Tab Inactive)' : isVoiceListening ? '🎙️ Listening...' : '🎤 Start microphone'}
        </button>
      </div>
    </div>
  );
}

