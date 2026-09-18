'use client';

import React from 'react';
import { AvatarTeacher } from '../interviewTypes';

interface InterviewSessionHeaderProps {
  activeTeacher: AvatarTeacher;
  activeTopicName: string;
  activeStage: string;
  elapsedSeconds: number;
  formatElapsed: (sec: number) => string;
  isScoredStage: boolean;
  isAssistModeActive: boolean;
  setIsAssistModeActive: React.Dispatch<React.SetStateAction<boolean>>;
  messages: Array<{ role: string; content: string }>;
  fetchAssistScript: (script: string) => void;
  avatarVolume: number;
  handleVolumeChange: (newVol: number) => void;
  showCameraPreview: boolean;
  toggleCameraPreview: () => void;
  isAvatarSpeaking: boolean;
  interruptSpeech: () => void;
  autoVoiceLoop: boolean;
  setAutoVoiceLoop: React.Dispatch<React.SetStateAction<boolean>>;
  skipQuestion: () => void;
  exitInterview: () => void;
}

export function InterviewSessionHeader({
  activeTeacher,
  activeTopicName,
  activeStage,
  elapsedSeconds,
  formatElapsed,
  isScoredStage,
  isAssistModeActive,
  setIsAssistModeActive,
  messages,
  fetchAssistScript,
  avatarVolume,
  handleVolumeChange,
  showCameraPreview,
  toggleCameraPreview,
  isAvatarSpeaking,
  interruptSpeech,
  autoVoiceLoop,
  setAutoVoiceLoop,
  skipQuestion,
  exitInterview
}: InterviewSessionHeaderProps) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px 18px',
      background: 'var(--bg2)',
      borderRadius: 14,
      border: '1px solid var(--border)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 20 }}>{activeTeacher.emoji}</span>
        <div>
          <div style={{ fontSize: 13, fontWeight: 900, color: 'var(--t1)' }}>
            {activeTeacher.name} ({activeTeacher.title})
          </div>
          <div style={{ fontSize: 10, color: 'var(--accent-mid)' }}>
            Topic: {activeTopicName} • Stage: {activeStage.replace('_', ' ').toUpperCase()} • ⏱️ {formatElapsed(elapsedSeconds)}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <button
            disabled={isScoredStage}
            title={isScoredStage ? 'Assist Mode is disabled during scored rounds' : 'Practice Mode — AI Teleprompter'}
            onClick={() => {
              const next = !isAssistModeActive;
              setIsAssistModeActive(next);
              if (next) {
                const lastMsg = messages.filter(m => m.role === 'assistant').slice(-1)[0]?.content;
                if (lastMsg) fetchAssistScript(lastMsg);
              }
            }}
            style={{
              background: isScoredStage ? 'var(--bg2)' : isAssistModeActive ? 'linear-gradient(135deg, var(--brand) 0%, var(--reward) 100%)' : 'var(--bg3)',
              border: isScoredStage ? '1px solid var(--border)' : isAssistModeActive ? '1px solid var(--reward)' : '1px solid var(--border)',
              color: isScoredStage ? 'var(--t3)' : isAssistModeActive ? 'var(--text)' : 'var(--t2)',
              borderRadius: 8,
              padding: '5px 12px',
              fontSize: 11,
              fontWeight: 900,
              cursor: isScoredStage ? 'not-allowed' : 'pointer',
              opacity: isScoredStage ? 0.5 : 1
            }}
          >
            {isScoredStage ? '🔒 Practice Only' : isAssistModeActive ? '🪄 Assist Mode ACTIVE' : '🪄 Assist Mode'}
          </button>
        </div>

        {/* Inline Avatar Volume Slider */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          background: 'var(--bg3)',
          padding: '4px 10px',
          borderRadius: 8,
          border: '1px solid var(--border)'
        }}>
          <span style={{ fontSize: 11 }}>🔊</span>
          <input
            type="range"
            min="0"
            max="100"
            value={avatarVolume}
            onChange={(e) => handleVolumeChange(Number(e.target.value))}
            style={{ width: 60, cursor: 'pointer' }}
          />
          <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--t2)', minWidth: 28 }}>{avatarVolume}%</span>
        </div>

        <button
          onClick={toggleCameraPreview}
          style={{
            background: showCameraPreview ? 'var(--accent-light)' : 'var(--bg3)',
            border: showCameraPreview ? '1px solid var(--accent)' : '1px solid var(--border)',
            color: showCameraPreview ? 'var(--accent)' : 'var(--t2)',
            borderRadius: 8,
            padding: '5px 12px',
            fontSize: 11,
            fontWeight: 800,
            cursor: 'pointer'
          }}
        >
          {showCameraPreview ? '📷 Self-View ON' : '📷 Self-View'}
        </button>

        {isAvatarSpeaking && (
          <button
            onClick={interruptSpeech}
            style={{
              background: 'var(--warning)',
              border: 'none',
              color: '#000',
              borderRadius: 8,
              padding: '5px 12px',
              fontSize: 11,
              fontWeight: 900,
              cursor: 'pointer'
            }}
          >
            ✋ Interrupt &amp; Speak
          </button>
        )}

        <button
          onClick={() => setAutoVoiceLoop(a => !a)}
          style={{
            background: autoVoiceLoop ? 'var(--green-light)' : 'var(--bg3)',
            border: autoVoiceLoop ? '1px solid var(--green)' : '1px solid var(--border)',
            color: autoVoiceLoop ? 'var(--green)' : 'var(--t2)',
            borderRadius: 8,
            padding: '5px 12px',
            fontSize: 11,
            fontWeight: 800,
            cursor: 'pointer'
          }}
        >
          {autoVoiceLoop ? '🔄 Voice Loop ACTIVE' : '⏸️ Auto Voice Paused'}
        </button>

        <button
          onClick={skipQuestion}
          style={{
            background: 'var(--amber-light)',
            border: '1px solid var(--amber)',
            color: 'var(--amber-mid)',
            borderRadius: 8,
            padding: '5px 12px',
            fontSize: 11,
            fontWeight: 800,
            cursor: 'pointer'
          }}
        >
          ⏩ Skip Question
        </button>

        <button
          onClick={exitInterview}
          style={{
            background: 'var(--coral-light)',
            border: '1px solid var(--coral-mid)',
            color: 'var(--coral-mid)',
            borderRadius: 8,
            padding: '5px 14px',
            fontSize: 11,
            fontWeight: 800,
            cursor: 'pointer'
          }}
        >
          ✕ Exit Session
        </button>
      </div>
    </div>
  );
}
