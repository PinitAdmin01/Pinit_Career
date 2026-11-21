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
      className="iv-voice-hud"
      style={{
        background: isTabInactive
          ? 'rgba(234, 179, 8, 0.12)'
          : !isSpeechSupported
          ? 'rgba(239, 68, 68, 0.1)'
          : isVoiceListening
          ? 'linear-gradient(90deg, rgba(var(--success-rgb),0.14) 0%, rgba(var(--info-rgb),0.14) 100%)'
          : 'var(--bg3)',
        border: '1px solid ' + (isTabInactive ? 'var(--warning, #eab308)' : !isSpeechSupported ? 'var(--danger)' : isVoiceListening ? 'var(--success)' : 'var(--border)'),
        boxShadow: isVoiceListening && !isTabInactive ? '0 0 0 1px rgba(16, 185, 129, 0.15), var(--shadow-sm)' : 'none'
      }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0, overflow: 'hidden' }}>
        <span style={{ fontSize: 16, flexShrink: 0 }}>{isTabInactive ? '⏸️' : !isSpeechSupported ? '⚠️' : isAvatarSpeaking ? '🗣️' : isVoiceListening ? '🎙️' : '🎤'}</span>
        <div style={{ minWidth: 0, overflow: 'hidden', flex: 1 }}>
          <div data-testid="interview-voice-hud-title" style={{ fontSize: 12, fontWeight: 900, color: isTabInactive ? 'var(--warning-bright, #eab308)' : 'var(--t1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: 1.2 }}>
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
          <div data-testid="interview-voice-hud-subtitle" style={{ fontSize: 10.5, color: isTabInactive ? 'var(--warning-bright, #eab308)' : !isSpeechSupported ? 'var(--danger-bright, #ef4444)' : isVoiceListening ? 'var(--success)' : 'var(--t2)', fontWeight: liveSpeechTranscript || isTabInactive ? 800 : 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: 1.2 }}>
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

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
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
          disabled={!isSpeechSupported || isVoiceListening || isAvatarSpeaking || isSendingInterviewerReply || isTabInactive}
          style={{
            background: isTabInactive ? 'var(--bg3)' : isVoiceListening ? 'var(--success)' : (!isSpeechSupported || isAvatarSpeaking || isSendingInterviewerReply) ? 'var(--bg2)' : 'var(--accent)',
            border: isTabInactive ? '1px solid rgba(234, 179, 8, 0.4)' : 'none',
            color: isTabInactive ? 'var(--warning-bright, #eab308)' : (!isSpeechSupported || isAvatarSpeaking || isSendingInterviewerReply) ? 'var(--t3)' : '#ffffff',
            borderRadius: 8,
            padding: '6px 14px',
            fontSize: 12,
            fontWeight: 900,
            cursor: !isSpeechSupported || isVoiceListening || isAvatarSpeaking || isSendingInterviewerReply || isTabInactive ? 'default' : 'pointer',
            opacity: (!isSpeechSupported || isAvatarSpeaking || isSendingInterviewerReply) && !isTabInactive ? 0.55 : 1
          }}
        >
          {isTabInactive ? '⏸️ Paused (Tab Inactive)' : isVoiceListening ? '🎙️ Listening...' : isSendingInterviewerReply ? '⏳ Waiting for reply...' : '🎤 Start microphone'}
        </button>
      </div>
    </div>
  );
}

