'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import type { AnimState } from '@/components/avatar/VRoidAvatarEngine';
import type { Round4CompletionState } from '@/lib/interview/roundDefenseEngine';
import { AssistModeDrawer } from './AssistModeDrawer';

const VRoidInterviewAvatar = dynamic(
  () => import('@/components/avatar/VRoidInterviewAvatar'),
  { ssr: false }
);

export interface Round4StarDrillProps {
  domainStream?: 'tech' | 'non_tech';
  activeTeacher: { id: string; name: string; emoji: string; title: string };
  animState: AnimState;
  showCameraPreview: boolean;
  videoPreviewRef: React.RefObject<HTMLVideoElement>;
  eyeContactScore: number | null;
  wpmScore: number | null;
  lastInterviewerSpeech: string;
  finishInterview: () => void;
  onSkipRound?: () => void;
  canFinishInterview: boolean;
  isSendingInterviewMessage?: boolean;
  manualTextInput: string;
  setManualTextInput: (val: string) => void;
  onSendMessage: (text: string) => void;
  starStep?: number;
  starCoverage?: { hasS: boolean; hasT: boolean; hasA: boolean; hasR: boolean; count: number };
  round4State?: Round4CompletionState | null;
  messages?: any[];
  messagesEndRef?: React.RefObject<HTMLDivElement>;
  activeTopicName?: string;
  difficulty?: string;
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

export const Round4StarDrill: React.FC<Round4StarDrillProps> = ({
  domainStream = 'tech',
  activeTeacher,
  animState,
  showCameraPreview,
  videoPreviewRef,
  eyeContactScore,
  wpmScore,
  lastInterviewerSpeech,
  finishInterview,
  onSkipRound,
  canFinishInterview,
  isSendingInterviewMessage = false,
  manualTextInput,
  setManualTextInput,
  onSendMessage,
  starStep = 0,
  starCoverage,
  round4State,
  messages = [],
  messagesEndRef,
  activeTopicName = 'Software Engineering',
  difficulty = 'medium',
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
  speakWithAvatarRaw,
  setAnimState,
  isDockedUnderCam = false,
  onToggleDock,
}) => {
  const assistNode = isAssistModeActive ? (
    <AssistModeDrawer
      compact
      isScoredStage={true}
      isCodingRound={false}
      activeStage="round4_star"
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

  const recentMessages = Array.isArray(messages) ? messages.slice(-12) : [];

  return (
    <div
      className="iv-round-layout iv-round4-layout iv-stage-viewport"
      style={{ display: 'grid', gridTemplateColumns: '5.5fr 4.5fr', gap: 16, alignItems: 'stretch' }}
    >
      {/* Left Column: 3D Avatar + Webcam PiP + Eye-Level Docked Assist */}
      <div className="iv-round4-avatar iv-avatar-stage">
        <VRoidInterviewAvatar teacherId={activeTeacher.id} animState={animState} zoom={1.6} />

        {/* Eye-Level Docked Teleprompter Overlay */}
        {isDockedUnderCam && assistNode && (
          <div style={{ position: 'absolute', top: showCameraPreview ? 132 : 16, right: 14, width: 330, maxWidth: 'calc(100% - 28px)', zIndex: 18 }}>
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
              <span style={{
                color: wpmScore !== null
                  ? (wpmScore >= 115 && wpmScore <= 165 ? 'var(--success-bright)' : wpmScore > 165 ? 'var(--warning-bright)' : 'var(--info-bright)')
                  : '#cbd5e1',
                flexShrink: 0
              }}>
                {wpmScore !== null ? `${wpmScore} WPM` : 'Mic Ready'}
              </span>
            </div>
          </div>
        )}

        <div className="iv-subtitle-bar" style={{ textAlign: 'center' }}>
          <strong>{activeTeacher.name}:</strong> {lastInterviewerSpeech}
        </div>
      </div>

      {/* Right Column: STAR Stepper, Transcript Stream, Unified Assist & Input */}
      <div
        className="iv-panel iv-chat-stage iv-round4-content"
        style={{
          padding: '10px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          height: '100%',
          minHeight: 0,
          overflow: 'hidden'
        }}
      >
        <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 10.5, fontWeight: 800, color: 'var(--accent-mid)' }}>ROUND 4 OF 4</span>
              {round4State && (
                <span
                  data-testid="round4-question-limit-pill"
                  style={{
                    fontSize: 10,
                    fontWeight: 800,
                    padding: '1px 7px',
                    borderRadius: 999,
                    fontFamily: 'var(--font-mono)',
                    background: round4State.completed ? 'rgba(34, 197, 94, 0.16)' : 'rgba(99, 102, 241, 0.14)',
                    border: round4State.completed ? '1px solid rgba(34, 197, 94, 0.4)' : '1px solid rgba(129, 140, 248, 0.35)',
                    color: round4State.completed ? 'var(--green-mid)' : 'var(--accent-mid)',
                  }}
                >
                  {round4State.completed
                    ? `✅ Interview Done (${round4State.answeredCount}Q)`
                    : `Q${round4State.questionsAsked}/${round4State.maxQuestions} · ${round4State.accurateCount}/${round4State.earlyPassTarget} Accurate`}
                </span>
              )}
            </div>
            <h2 style={{ fontSize: 13.5, fontWeight: 900, margin: 0, color: 'var(--t1)' }}>
              {domainStream === 'non_tech' ? 'Partner & CFO STAR Deep Dive' : 'Executive STAR Deep Dive'}
            </h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            <button
              onClick={finishInterview}
              disabled={!canFinishInterview || isSendingInterviewMessage}
              className={canFinishInterview ? 'iv-btn-primary' : undefined}
              style={{
                background: canFinishInterview ? undefined : 'var(--bg3)',
                border: canFinishInterview ? undefined : '1px solid var(--border)',
                color: canFinishInterview ? '#ffffff' : 'var(--t3)',
                borderRadius: 8,
                padding: '6px 12px',
                fontSize: 11.5,
                fontWeight: 900,
                cursor: canFinishInterview ? 'pointer' : 'not-allowed',
                flexShrink: 0
              }}
            >
              {round4State?.completed
                ? 'View Final Scorecard ➔'
                : canFinishInterview
                ? 'Complete interview ➔'
                : (starStep >= 4 || (starCoverage?.count ?? 0) >= 3)
                ? 'Waiting for interviewer…'
                : `Q${round4State?.questionsAsked ?? (starStep + 1)} of 4–5 (3/3 wraps early)`}
            </button>
            {!canFinishInterview && onSkipRound && (
              <button
                type="button"
                data-testid="round4-skip-round-btn"
                onClick={onSkipRound}
                title="Skip Round 4 and finish the interview immediately (recorded as skipped)"
                style={{
                  background: 'var(--bg3)',
                  border: '1px solid var(--border)',
                  color: 'var(--t2)',
                  borderRadius: 8,
                  padding: '6px 10px',
                  fontSize: 11.5,
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                ⏭ Skip &amp; Finish
              </button>
            )}
          </div>
        </div>

        {/* 🌟 S-T-A-R Assessment Progression Stepper */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 4,
          background: 'var(--bg3)',
          padding: '4px 6px',
          borderRadius: 10,
          border: '1px solid var(--border)',
          flexShrink: 0
        }}>
          {[
            { key: 'S', label: 'Situation', desc: 'Context & Challenge', detected: starCoverage?.hasS },
            { key: 'T', label: 'Task', desc: 'Your Role / Target', detected: starCoverage?.hasT },
            { key: 'A', label: 'Action', desc: 'Execution & Decisions', detected: starCoverage?.hasA },
            { key: 'R', label: 'Result', desc: 'Quantifiable Impact', detected: starCoverage?.hasR },
          ].map((step, idx) => {
            const isCompleted = starStep >= 4 || idx < starStep || Boolean(step.detected);
            const isCurrent = !isCompleted && starStep < 4 && idx === starStep;
            return (
              <div
                key={step.key}
                data-testid={`star-step-${step.key.toLowerCase()}`}
                style={{
                  padding: '4px 5px',
                  borderRadius: 6,
                  background: isCurrent ? 'var(--accent-light)' : isCompleted ? 'rgba(var(--success-rgb), 0.12)' : 'transparent',
                  border: isCurrent ? '1.5px solid var(--accent)' : isCompleted ? '1px solid var(--success)' : '1px solid transparent',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: 10.5, fontWeight: 900, color: isCurrent ? 'var(--accent)' : isCompleted ? 'var(--success-bright)' : 'var(--t3)' }}>
                  {isCompleted ? '✅ ' : isCurrent ? '👉 ' : ''}{step.key} — {step.label}
                </div>
                <div style={{ fontSize: 9.5, color: isCurrent ? 'var(--t1)' : 'var(--t3)', marginTop: 1 }}>
                  {step.desc}
                </div>
              </div>
            );
          })}
        </div>

        {/* Dynamic Pedagogical STAR Coaching Guidance Pill */}
        <div
          data-testid="star-coaching-pill"
          style={{
            fontSize: 10.5,
            padding: '4px 8px',
            borderRadius: 6,
            background: starStep >= 4 ? 'rgba(34, 197, 94, 0.1)' : 'rgba(168, 85, 247, 0.08)',
            border: starStep >= 4 ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(168, 85, 247, 0.25)',
            color: starStep >= 4 ? 'var(--success-bright)' : 'var(--accent)',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            flexShrink: 0
          }}
        >
          {starStep === 0
            ? (domainStream === 'non_tech'
                ? 'Focus: Frame the commercial, audit, or financial context, balance-sheet stakes, and regulatory constraints.'
                : 'Focus: Set the business & technical context, system scale, and primary constraints.')
            : starStep === 1
            ? (domainStream === 'non_tech'
                ? 'Focus: Define your exact analytical ownership, compliance/credit targets, and stakeholder expectations.'
                : 'Focus: Define your exact engineering responsibility, milestone targets, and success criteria.')
            : starStep === 2
            ? (domainStream === 'non_tech'
                ? 'Focus: Explain the concrete accounting, tax, credit, or financial actions, controls, and trade-offs you drove.'
                : 'Focus: Explain the concrete technical actions, trade-offs, architecture choices, and teamwork.')
            : starStep === 3
            ? (domainStream === 'non_tech'
                ? 'Focus: Quantify measurable business impact — margin bps, ₹ cash flow protected, DSO reduction, or audit sign-off.'
                : 'Focus: Quantify measurable impact — latency drops, uptime gains, revenue unlocked, or error reductions.')
            : 'All 4 STAR quadrants completed! Submit your defense to review your scorecard.'}
        </div>

        {/* Scrollable Round 4 Conversation Stream */}
        <div
          className="scroll-container"
          data-testid="round4-transcript-stream"
          style={{ flex: '1 1 0%', minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6, paddingRight: 4 }}
        >
          {recentMessages.map((m, i) => (
            <div key={i} style={{ alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '88%' }}>
              <div
                className={m.role === 'user' ? 'iv-chat-user' : 'iv-chat-assistant'}
                style={{ padding: '6px 10px', borderRadius: 10, fontSize: 11.5, lineHeight: 1.4 }}
              >
                {m.content}
              </div>
            </div>
          ))}
          {isSendingInterviewMessage && (
            <div className="iv-typing-bubble" data-testid="round4-typing-indicator">
              <span>{activeTeacher.name} is evaluating your STAR defense</span>
              <span className="iv-typing-dots" aria-hidden="true"><span /><span /><span /></span>
            </div>
          )}
          {messagesEndRef && <div ref={messagesEndRef} />}
        </div>

        {/* 🎯 Unified Assist Mode Teleprompter (Inline when not docked under camera) */}
        {!isDockedUnderCam && assistNode && (
          <div style={{ flexShrink: 0 }}>{assistNode}</div>
        )}

        {/* ⌨️ Direct Typed STAR Response Fallback */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!manualTextInput.trim() || isSendingInterviewMessage) return;
            const textToSend = manualTextInput.trim();
            setManualTextInput('');
            console.log('[Interview] ⌨️ Candidate submitted typed STAR response:', textToSend);
            onSendMessage(textToSend);
          }}
          style={{ display: 'flex', gap: 6, flexShrink: 0 }}
        >
          <input
            type="text"
            value={manualTextInput}
            disabled={isSendingInterviewMessage || Boolean(round4State?.completed)}
            onChange={(e) => setManualTextInput(e.target.value)}
            onKeyDown={(e) => {
              if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                if (!manualTextInput.trim() || isSendingInterviewMessage) return;
                const textToSend = manualTextInput.trim();
                setManualTextInput('');
                console.log('[Interview] ⌨️ Candidate submitted typed STAR response via shortcut:', textToSend);
                onSendMessage(textToSend);
              }
            }}
            placeholder={round4State?.completed ? 'Interview complete — finalizing your scorecard…' : 'Or type your STAR response (Situation, Task, Action, Result)... (Enter or Ctrl+↵ to send)'}
            style={{
              flex: 1,
              padding: '9px 12px',
              borderRadius: 10,
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
              padding: '9px 16px',
              borderRadius: 10,
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
  );
};
export default Round4StarDrill;
