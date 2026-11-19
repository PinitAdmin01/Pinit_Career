'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import type { AnimState } from '@/components/avatar/VRoidAvatarEngine';
import { SKIP_TURN_REGEX } from '@/lib/interview/postInterviewInsights';
import { AssistModeDrawer } from './AssistModeDrawer';

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
  canProceed: boolean;
  isSendingInterviewMessage?: boolean;
  fillerWordCount: number;
  messages: Message[];
  messagesEndRef: React.RefObject<HTMLDivElement>;
  manualTextInput: string;
  setManualTextInput: (val: string) => void;
  onSendMessage: (text: string) => void;
  isAssistModeActive?: boolean;
  setIsAssistModeActive?: (val: boolean) => void;
  assistData?: any;
  isFetchingAssist?: boolean;
  assistTab?: 'script' | 'bullets' | 'delivery';
  setAssistTab?: (tab: 'script' | 'bullets' | 'delivery') => void;
  assistScriptLevel?: 'standard' | 'advanced';
  setAssistScriptLevel?: (lvl: 'standard' | 'advanced') => void;
  fetchAssistScript?: (q: string, lvl?: 'standard' | 'advanced') => void;
  liveSpeechTranscript?: string;
  activeTopicName?: string;
  difficulty?: string;
  speakWithAvatarRaw?: (
    text: string,
    teacherId: string,
    onStart: () => void,
    onEnd: () => void,
    allowMicRestart: boolean,
    isAssistScript: boolean,
    diff: string
  ) => void;
  setAnimState?: (state: 'idle' | 'talking' | 'thinking') => void;
  isDockedUnderCam?: boolean;
  onToggleDock?: () => void;
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
  canProceed,
  isSendingInterviewMessage = false,
  fillerWordCount,
  messages,
  messagesEndRef,
  manualTextInput,
  setManualTextInput,
  onSendMessage,
  isAssistModeActive = false,
  setIsAssistModeActive,
  assistData,
  isFetchingAssist = false,
  assistTab = 'script',
  setAssistTab,
  assistScriptLevel = 'standard',
  setAssistScriptLevel,
  fetchAssistScript,
  liveSpeechTranscript = '',
  activeTopicName = 'Software Engineering',
  difficulty = 'medium',
  speakWithAvatarRaw,
  setAnimState,
  isDockedUnderCam = false,
  onToggleDock,
}) => {
  const userResponseCount = React.useMemo(() => {
    return messages.filter(m => m.role === 'user' && !SKIP_TURN_REGEX.test(m.content.trim())).length;
  }, [messages]);

  const wpmCadenceLabel = wpmScore !== null
    ? `${wpmScore} WPM (${wpmScore < 115 ? 'Paced' : wpmScore <= 165 ? 'Optimal' : 'Fast'})`
    : 'Mic Inactive';

  const assistNode = isAssistModeActive ? (
    <AssistModeDrawer
      compact
      isScoredStage={true}
      isCodingRound={false}
      activeStage="round1_behavioral"
      activeTopicName={activeTopicName}
      questionText={lastInterviewerSpeech}
      isDockedUnderCam={isDockedUnderCam}
      onToggleDock={onToggleDock}
      isAssistModeActive={isAssistModeActive}
      setIsAssistModeActive={setIsAssistModeActive || (() => {})}
      assistScriptLevel={assistScriptLevel}
      setAssistScriptLevel={setAssistScriptLevel || (() => {})}
      assistTab={assistTab}
      setAssistTab={setAssistTab || (() => {})}
      isFetchingAssist={isFetchingAssist}
      assistData={assistData ?? null}
      liveSpeechTranscript={liveSpeechTranscript}
      messages={messages as any}
      activeTeacher={activeTeacher as any}
      difficulty={difficulty}
      fetchAssistScript={fetchAssistScript || (() => {})}
      speakWithAvatarRaw={speakWithAvatarRaw}
      setAnimState={setAnimState}
    />
  ) : null;

  return (
    <div className="iv-round-layout iv-round1-layout iv-stage-viewport" style={{ display: 'grid', gridTemplateColumns: '6fr 4fr', gap: 16, alignItems: 'stretch' }}>
      {/* Left 60%: 3D VRoid Avatar Viewport */}
      <div className="iv-round1-avatar iv-avatar-stage">
        <VRoidInterviewAvatar teacherId={activeTeacher.id} animState={animState} zoom={1.65} />

        {isDockedUnderCam && assistNode && (
          <div style={{ position: 'absolute', top: showCameraPreview ? 132 : 54, right: 14, width: 330, maxWidth: 'calc(100% - 28px)', zIndex: 18 }}>
            {assistNode}
          </div>
        )}

        {/* Floating Candidate Camera PiP Preview (Mirrored Self-View + Compact Eye Contact & Pace HUD) */}
        {showCameraPreview && (
          <div className="iv-pip-frame">
            <video
              ref={videoPreviewRef}
              autoPlay
              muted
              playsInline
              style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }}
            />
            <div className="iv-pip-hud">
              <span style={{ color: eyeContactScore !== null ? (eyeContactScore >= 60 ? 'var(--success-bright)' : 'var(--warning-bright)') : '#cbd5e1', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                📷 {eyeContactScore !== null ? (eyeContactScore >= 60 ? 'Centered' : 'Adjust') : 'Scanning'}
              </span>
              <span style={{ color: wpmScore !== null ? (wpmScore >= 115 && wpmScore <= 165 ? 'var(--success-bright)' : 'var(--warning-bright)') : 'var(--info-bright)', flexShrink: 0 }}>
                {wpmScore !== null ? `${wpmScore} WPM` : 'Mic Ready'}
              </span>
            </div>
          </div>
        )}

        {/* Avatar Status Badge */}
        <div style={{
          position: 'absolute', top: 14, left: 14, padding: '6px 14px', borderRadius: 100,
          background: isAvatarSpeaking ? 'var(--accent)' : isVoiceListening ? 'var(--danger)' : 'var(--green)',
          backdropFilter: 'blur(8px)', color: '#ffffff', fontSize: 12, fontWeight: 800,
          display: 'flex', alignItems: 'center', gap: 7, boxShadow: 'var(--shadow-md)'
        }}>
          <span className={isAvatarSpeaking || isVoiceListening ? 'iv-pulse-dot' : undefined} style={isAvatarSpeaking || isVoiceListening ? undefined : { width: 8, height: 8, borderRadius: '50%', background: '#fff', display: 'inline-block' }} />
          {isAvatarSpeaking ? `${activeTeacher.name} is Speaking...` : isVoiceListening ? '🎙️ Listening (Speak Now)...' : '🎤 Voice Ready'}
        </div>

        {/* Inverted Subtitle Fixed: Strictly displays interviewer's speech with max-height scroll cap */}
        <div className="iv-subtitle-bar">
          <strong>{activeTeacher.name}:</strong> {lastInterviewerSpeech}
        </div>
      </div>

      {/* Right 40%: Scrollable Transcript, Teleprompter & Input */}
      <div className="iv-panel iv-chat-stage" style={{
        padding: 18,
        display: 'flex',
        flexDirection: 'column',
      }}>
        <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: 8, marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: 11.5, fontWeight: 800, color: 'var(--accent-mid)' }}>ROUND 1 OF 4</span>
            <h2 style={{ fontSize: 15.5, fontWeight: 900, margin: 0, color: 'var(--t1)' }}>Behavioral &amp; Background Intro</h2>
          </div>
          {canProceed && <button onClick={onProceed} className="iv-btn-primary" style={{ borderRadius: 8, padding: '7px 12px', fontSize: 12 }}>
            Continue to coding ➔
          </button>}
        </div>

        <div
          data-testid="round1-progress-pill"
          style={{
            marginBottom: 8,
            padding: '6px 10px',
            borderRadius: 8,
            fontSize: 11.5,
            fontWeight: 700,
            background: canProceed ? 'rgba(34, 197, 94, 0.12)' : 'rgba(var(--brand-rgb), 0.08)',
            border: canProceed ? '1px solid rgba(34, 197, 94, 0.35)' : '1px solid rgba(var(--brand-rgb), 0.22)',
            color: canProceed ? 'var(--green-mid)' : 'var(--t2)'
          }}
        >
          {canProceed
            ? '✅ 3/3 Behavioral responses complete — Ready for Round 2 Coding!'
            : `💬 Progress: ${Math.min(3, userResponseCount)}/3 responses completed — answer ${Math.max(1, 3 - userResponseCount)} more topic-specific question${3 - userResponseCount === 1 ? '' : 's'} to unlock Round 2.`}
        </div>

        {/* Telemetry Bar */}
        <div style={{ background: 'var(--bg3)', borderRadius: 10, padding: '8px 12px', border: '1px solid var(--border)', marginBottom: 10, display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
          <div>👀 Eye Contact: <strong style={{ color: eyeContactScore !== null ? 'var(--green-mid)' : 'var(--t3)' }}>{eyeContactScore !== null ? `${eyeContactScore}%` : 'Cam Off'}</strong></div>
          <div>⚡ Pace: <strong style={{ color: wpmScore !== null ? (wpmScore >= 115 && wpmScore <= 165 ? 'var(--green-mid)' : 'var(--amber-mid)') : 'var(--accent-mid)' }}>{wpmScore !== null ? wpmCadenceLabel : 'Mic Off'}</strong></div>
          <div>💬 Fillers: <strong style={{ color: 'var(--green-mid)' }}>{wpmScore !== null || fillerWordCount > 0 ? fillerWordCount : 'N/A'}</strong></div>
        </div>

        {/* Transcript Stream */}
        <div className="scroll-container" style={{ flex: 1, minHeight: 96, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10, paddingRight: 4 }}>
          {messages.map((m, i) => (
            <div key={i} style={{ alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '88%' }}>
              <div className={m.role === 'user' ? 'iv-chat-user' : 'iv-chat-assistant'} style={{ padding: '10px 14px', borderRadius: 14, fontSize: 13, lineHeight: 1.5 }}>
                {m.content}
              </div>
            </div>
          ))}
          {isSendingInterviewMessage && (
            <div className="iv-typing-bubble" data-testid="round1-typing-indicator">
              <span>{activeTeacher.name} is reviewing your answer</span>
              <span className="iv-typing-dots" aria-hidden="true"><span /><span /><span /></span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* 🎯 Assist Mode AI Teleprompter (Unified Component) */}
        {!isDockedUnderCam && assistNode && (
          <div style={{ marginTop: 8, marginBottom: 4 }}>
            {assistNode}
          </div>
        )}

        <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {/* ⌨️ Direct Typed Response Fallback for Noisy Environments */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!manualTextInput.trim() || isSendingInterviewMessage) return;
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
              disabled={isSendingInterviewMessage}
              onChange={(e) => setManualTextInput(e.target.value)}
              onKeyDown={(e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                  e.preventDefault();
                  if (!manualTextInput.trim() || isSendingInterviewMessage) return;
                  const textToSend = manualTextInput.trim();
                  setManualTextInput('');
                  console.log('[Interview] ⌨️ Candidate submitted typed response via shortcut:', textToSend);
                  onSendMessage(textToSend);
                }
              }}
              placeholder="Or type your response here... (Enter or Ctrl+↵ to send)"
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: 8,
                border: '1px solid var(--border)',
                background: 'var(--bg3)',
                color: 'var(--t1)',
                fontSize: 12.5
              }}
            />
            <button
              type="submit"
              disabled={!manualTextInput.trim() || isSendingInterviewMessage}
              style={{
                padding: '8px 14px',
                borderRadius: 8,
                border: 'none',
                background: manualTextInput.trim() ? 'var(--accent)' : 'var(--bg2)',
                color: manualTextInput.trim() ? '#ffffff' : 'var(--t3)',
                fontSize: 12.5,
                fontWeight: 800,
                cursor: manualTextInput.trim() ? 'pointer' : 'default'
              }}
            >
              {isSendingInterviewMessage ? 'Thinking…' : 'Send ➔'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Round1Behavioral;
