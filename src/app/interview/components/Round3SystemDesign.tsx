'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import type { AnimState } from '@/components/avatar/VRoidAvatarEngine';
import { AssistModeDrawer } from './AssistModeDrawer';

const VRoidInterviewAvatar = dynamic(
  () => import('@/components/avatar/VRoidInterviewAvatar'),
  { ssr: false }
);

const SystemDesignWhiteboard = dynamic(
  () => import('@/components/interview/SystemDesignWhiteboard'),
  { ssr: false }
);

export interface Round3SystemDesignProps {
  domainStream: 'tech' | 'non_tech';
  activeTopicName: string;
  onProceed: () => void;
  onSkipRound?: () => void;
  canProceed?: boolean;
  setLatestTopology: (topo: any) => void;
  analyzeSystemArchitecture: () => void;
  isAnalyzingArchitecture: boolean;
  activeTeacher: { id: string; name: string; emoji: string; title: string };
  animState: AnimState;
  lastInterviewerSpeech: string;
  architectureEvaluation?: any;
  manualTextInput?: string;
  setManualTextInput?: (val: string) => void;
  onSendMessage?: (text: string) => void;
  isSendingInterviewMessage?: boolean;
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
  messages?: Array<{ role: 'user' | 'assistant'; content: string }>;
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
}

export const Round3SystemDesign: React.FC<Round3SystemDesignProps> = ({
  domainStream,
  activeTopicName,
  onProceed,
  onSkipRound,
  canProceed = false,
  setLatestTopology,
  analyzeSystemArchitecture,
  isAnalyzingArchitecture,
  activeTeacher,
  animState,
  lastInterviewerSpeech,
  architectureEvaluation,
  manualTextInput = '',
  setManualTextInput,
  onSendMessage,
  isSendingInterviewMessage = false,
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
  messages = [],
  difficulty = 'medium',
  speakWithAvatarRaw,
  setAnimState,
}) => {
  return (
    <div className="iv-round-layout iv-round3-layout iv-stage-viewport" style={{ display: 'grid', gridTemplateColumns: '7.2fr 2.8fr', gap: 12, alignItems: 'stretch' }}>
      <div className="iv-panel" style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8, height: '100%', minHeight: 0, overflowY: 'auto' }}>
        <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: 11.5, fontWeight: 800, color: 'var(--teal-mid)' }}>ROUND 3 OF 4</span>
            <h2 style={{ fontSize: 15.5, fontWeight: 900, margin: 0, color: 'var(--t1)' }}>
              {domainStream === 'non_tech' ? 'Business Workflow Canvas:' : 'System Architecture Canvas:'} {activeTopicName}
            </h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            {canProceed ? (
              <button onClick={onProceed} className="iv-btn-primary" style={{ borderRadius: 8, padding: '7px 12px', fontSize: 12 }}>
                Continue to deep dive ➔
              </button>
            ) : onSkipRound && (
              <button
                type="button"
                data-testid="round3-skip-round-btn"
                onClick={onSkipRound}
                title="Skip Round 3 and move directly to Round 4 (recorded as skipped)"
                style={{
                  background: 'var(--bg3)',
                  border: '1px solid var(--border)',
                  color: 'var(--t2)',
                  borderRadius: 8,
                  padding: '7px 12px',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                ⏭ Skip Round
              </button>
            )}
          </div>
        </div>

        <div
          data-testid="round3-progress-banner"
          style={{
            padding: '7px 12px',
            borderRadius: 8,
            fontSize: 12,
            fontWeight: 700,
            background: canProceed
              ? 'rgba(34, 197, 94, 0.12)'
              : architectureEvaluation && Number(architectureEvaluation.score) < 60
              ? 'rgba(245, 158, 11, 0.12)'
              : 'rgba(var(--brand-rgb), 0.08)',
            border: canProceed
              ? '1px solid rgba(34, 197, 94, 0.35)'
              : architectureEvaluation && Number(architectureEvaluation.score) < 60
              ? '1px solid rgba(245, 158, 11, 0.45)'
              : '1px solid rgba(var(--brand-rgb), 0.22)',
            color: canProceed ? 'var(--green-mid)' : 'var(--t1)'
          }}
        >
          {canProceed
            ? (domainStream === 'non_tech'
                ? '✅ Business Workflow & Strategy Defense Verified — Ready for Round 4 Executive Defense!'
                : '✅ Architecture & Trade-Off Defense Verified — Ready for Round 4 STAR Defense!')
            : architectureEvaluation && Number(architectureEvaluation.score) < 60
            ? `⚠️ ${domainStream === 'non_tech' ? 'Workflow' : 'Topology'} score (${architectureEvaluation.score}/100) is below the 60/100 threshold. Address the bottlenecks below and re-evaluate.`
            : architectureEvaluation
            ? `💬 Step 2 of 2: Answer ${activeTeacher.name}'s ${domainStream === 'non_tech' ? 'business strategy' : 'architectural trade-off'} question on the right to unlock Round 4.`
            : (domainStream === 'non_tech'
                ? '📐 Step 1 of 2: Connect workflow components on the canvas and click "Evaluate Workflow" to inspect your design.'
                : '📐 Step 1 of 2: Place components on the canvas and click "Evaluate Architecture" to inspect your topology.')}
        </div>

        <SystemDesignWhiteboard
          domainStream={domainStream}
          activeTopic={activeTopicName}
          onTopologyChange={setLatestTopology}
          onAnalyze={analyzeSystemArchitecture}
          isAnalyzing={isAnalyzingArchitecture}
        />

        {/* 📊 Architecture Evaluation Scorecard (Renders when analysis completes) */}
        {architectureEvaluation && (
          <div className="iv-eval-report">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: 14.5, fontWeight: 900, color: 'inherit' }}>Architecture Evaluation Report</h4>
                  <span style={{ fontSize: 12, opacity: 0.78 }}>{architectureEvaluation.summary || 'Architecture verified.'}</span>
                </div>
              </div>
              <div style={{
                padding: '4px 12px',
                borderRadius: 8,
                background: 'var(--accent-light)',
                color: 'var(--accent)',
                fontWeight: 900,
                fontSize: 15.5
              }}>
                Grade: {architectureEvaluation.verdict || 'A'} ({architectureEvaluation.score ?? 85}/100)
              </div>
            </div>

            {/* Radar / Metrics Bar */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 8, fontSize: 12 }}>
              {architectureEvaluation.radar && Object.entries(architectureEvaluation.radar).map(([metric, val]: any) => (
                <div key={metric} style={{ background: 'rgba(var(--brand-rgb), 0.08)', padding: '6px 10px', borderRadius: 6, border: '1px solid var(--border)' }}>
                  <div style={{ opacity: 0.72, textTransform: 'uppercase', fontSize: 10.5, fontWeight: 700 }}>{metric}</div>
                  <div style={{ fontWeight: 800, color: 'inherit', marginTop: 2 }}>{val} / 100</div>
                </div>
              ))}
            </div>

            {/* Strengths, Weaknesses / Bottlenecks & Recommendations */}
            {architectureEvaluation.strengths && (
              <div style={{ fontSize: 12, color: 'var(--green-mid)', lineHeight: 1.4 }}>
                <strong>Architectural Strengths:</strong> {Array.isArray(architectureEvaluation.strengths) ? architectureEvaluation.strengths.join('; ') : architectureEvaluation.strengths}
              </div>
            )}
            {architectureEvaluation.weaknesses && (
              <div style={{ fontSize: 12, color: 'var(--coral-mid)', lineHeight: 1.4 }}>
                <strong>Bottlenecks identified:</strong> {Array.isArray(architectureEvaluation.weaknesses) ? architectureEvaluation.weaknesses.join('; ') : architectureEvaluation.weaknesses}
              </div>
            )}
            {architectureEvaluation.improvements && (
              <div style={{ fontSize: 12, color: 'var(--teal-mid)', lineHeight: 1.4 }}>
                <strong>Recommendations:</strong> {architectureEvaluation.improvements}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right 28%: Avatar Viewport, Review Comments & Defense Input */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, height: '100%', minHeight: 0, overflow: 'hidden' }}>
        {/* Avatar Viewport (Medium/Normal Size: 125px) */}
        <div style={{ height: 125, flexShrink: 0, background: 'var(--bg3)', borderRadius: 12, border: '1px solid var(--border)', overflow: 'hidden', position: 'relative' }}>
          <VRoidInterviewAvatar teacherId={activeTeacher.id} animState={animState} zoom={1.5} />
          <div style={{ position: 'absolute', bottom: 5, left: 6, padding: '2px 7px', borderRadius: 5, background: 'rgba(10, 14, 26, 0.78)', color: '#f8fafc', fontSize: 10.5, fontWeight: 800 }}>
            {activeTeacher.emoji} {activeTeacher.name}
          </div>
        </div>

        {/* Panel Container for Feedback, Assist, and Defense Input */}
        <div className="iv-panel" style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {/* Interviewer Feedback Card */}
          <div style={{
            padding: '8px 10px',
            borderRadius: 8,
            background: 'var(--bg3)',
            border: '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column',
            gap: 4
          }}>
            <div style={{ fontSize: 10.5, fontWeight: 800, color: 'var(--t3)', letterSpacing: 0.5, textTransform: 'uppercase' }}>
              Interviewer Feedback & Questions
            </div>
            <div style={{ fontSize: 12, color: 'var(--t1)', lineHeight: 1.4, overflowY: 'auto', maxHeight: 100 }}>
              <strong>{activeTeacher.name}:</strong> {lastInterviewerSpeech}
            </div>
          </div>

          {isSendingInterviewMessage && (
            <div className="iv-typing-bubble" style={{ padding: '6px 10px', margin: 0 }}>
              <span style={{ fontSize: 11 }}>{activeTeacher.name} is evaluating your defense</span>
              <span className="iv-typing-dots" aria-hidden="true"><span /><span /><span /></span>
            </div>
          )}

          {/* 🎯 Unified Assist Mode AI Teleprompter for Round 3 (Compact & Contained) */}
          {isAssistModeActive && (
            <div style={{ maxHeight: 185, flexShrink: 1, overflowY: 'auto' }}>
              <AssistModeDrawer
                compact
                isScoredStage={true}
                isCodingRound={false}
                activeStage="round3_systems"
                activeTopicName={activeTopicName}
                questionText={lastInterviewerSpeech}
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
            </div>
          )}

          {/* ⌨️ Architectural Defense Typed Input Fallback */}
          {setManualTextInput && onSendMessage && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!manualTextInput.trim() || isSendingInterviewMessage) return;
                const textToSend = manualTextInput.trim();
                setManualTextInput('');
                onSendMessage(textToSend);
              }}
              style={{ marginTop: 'auto', display: 'flex', gap: 6, paddingTop: 4 }}
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
                    onSendMessage(textToSend);
                  }
                }}
                placeholder="Type your architecture defense... (Enter or Ctrl+↵ to send)"
                style={{
                  flex: 1,
                  padding: '7px 10px',
                  borderRadius: 6,
                  border: '1px solid var(--border)',
                  background: 'var(--bg3)',
                  color: 'var(--t1)',
                  fontSize: 11.5
                }}
              />
              <button
                type="submit"
                disabled={!manualTextInput.trim() || isSendingInterviewMessage}
                style={{
                  padding: '7px 12px',
                  borderRadius: 6,
                  border: 'none',
                  background: manualTextInput.trim() ? 'var(--accent)' : 'var(--bg2)',
                  color: manualTextInput.trim() ? '#ffffff' : 'var(--t3)',
                  fontSize: 11.5,
                  fontWeight: 800,
                  cursor: manualTextInput.trim() ? 'pointer' : 'default',
                  flexShrink: 0
                }}
              >
                {isSendingInterviewMessage ? 'Reviewing…' : 'Send ➔'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
export default Round3SystemDesign;
