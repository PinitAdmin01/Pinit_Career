'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import type { AnimState } from '@/components/avatar/VRoidAvatarEngine';

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
  setLatestTopology: (topo: any) => void;
  analyzeSystemArchitecture: () => void;
  isAnalyzingArchitecture: boolean;
  activeTeacher: { id: string; name: string; emoji: string; title: string };
  animState: AnimState;
  isVoiceListening: boolean;
  startVoiceListening: () => void;
  lastInterviewerSpeech: string;
  architectureEvaluation?: any;
  manualTextInput?: string;
  setManualTextInput?: (val: string) => void;
  onSendMessage?: (text: string) => void;
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
}

export const Round3SystemDesign: React.FC<Round3SystemDesignProps> = ({
  domainStream,
  activeTopicName,
  onProceed,
  setLatestTopology,
  analyzeSystemArchitecture,
  isAnalyzingArchitecture,
  activeTeacher,
  animState,
  isVoiceListening,
  startVoiceListening,
  lastInterviewerSpeech,
  architectureEvaluation,
  manualTextInput = '',
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
}) => {
  const spokenWordSet = React.useMemo(() => {
    return new Set(liveSpeechTranscript.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(Boolean));
  }, [liveSpeechTranscript]);
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '7.2fr 2.8fr', gap: 16, alignItems: 'stretch' }}>
      <div className="iv-panel" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: 11.5, fontWeight: 800, color: 'var(--teal-mid)' }}>ROUND 3 OF 4</span>
            <h2 style={{ fontSize: 15.5, fontWeight: 900, margin: 0, color: 'var(--t1)' }}>
              {domainStream === 'non_tech' ? 'Business Workflow Canvas:' : 'System Architecture Canvas:'} {activeTopicName}
            </h2>
          </div>
          <button onClick={onProceed} style={{ background: 'var(--accent)', border: 'none', color: 'var(--text)', borderRadius: 8, padding: '6px 12px', fontSize: 12, fontWeight: 800, cursor: 'pointer' }}>
            Proceed to Round 4 ➔
          </button>
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
          <div style={{
            marginTop: 8,
            padding: '14px 16px',
            borderRadius: 12,
            background: 'linear-gradient(135deg, rgba(20, 24, 39, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
            border: '1.5px solid var(--accent)',
            boxShadow: '0 4px 18px rgba(var(--brand-rgb), 0.2)',
            display: 'flex',
            flexDirection: 'column',
            gap: 10
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 20 }}>🏛️</span>
                <div>
                  <h4 style={{ margin: 0, fontSize: 14.5, fontWeight: 900, color: 'var(--t1)' }}>Architecture Evaluation Report</h4>
                  <span style={{ fontSize: 12, color: 'var(--t3)' }}>{architectureEvaluation.summary || 'Architecture verified.'}</span>
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
                <div key={metric} style={{ background: 'rgba(255,255,255,0.04)', padding: '6px 10px', borderRadius: 6, border: '1px solid var(--border)' }}>
                  <div style={{ color: 'var(--t3)', textTransform: 'uppercase', fontSize: 10.5, fontWeight: 700 }}>{metric}</div>
                  <div style={{ fontWeight: 800, color: 'var(--t1)', marginTop: 2 }}>{val} / 100</div>
                </div>
              ))}
            </div>

            {/* Weaknesses / Bottlenecks & Recommendations */}
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ height: 190, background: 'var(--bg3)', borderRadius: 16, border: '1px solid var(--border)', overflow: 'hidden', position: 'relative' }}>
          <VRoidInterviewAvatar teacherId={activeTeacher.id} animState={animState} zoom={1.6} />
          <div style={{ position: 'absolute', bottom: 6, left: 6, padding: '3px 8px', borderRadius: 6, background: 'rgba(0,0,0,0.65)', color: 'var(--text)', fontSize: 11, fontWeight: 800 }}>
            {activeTeacher.emoji} {activeTeacher.name}
          </div>
        </div>

        <button
          onClick={startVoiceListening}
          style={{
            width: '100%',
            background: isVoiceListening ? 'var(--danger)' : 'linear-gradient(135deg, var(--accent) 0%, var(--purple) 100%)',
            border: 'none', color: 'var(--text)', borderRadius: 10, padding: '9px 12px', fontSize: 12.5, fontWeight: 900, cursor: 'pointer',
            boxShadow: isVoiceListening ? '0 0 12px rgba(var(--danger-rgb),0.7)' : 'var(--shadow-sm)'
          }}
        >
          {isVoiceListening ? '🎙️ Listening... (Speak Now)' : '🎤 Speak Architecture Defense'}
        </button>

        <div className="iv-panel" style={{ flex: 1, padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--t3)' }}>INTERVIEWER FEEDBACK & QUESTIONS</div>
          <div style={{ fontSize: 12.5, color: 'var(--t1)', lineHeight: 1.4, overflowY: 'auto', maxHeight: 150 }}>
            <strong>{activeTeacher.name}:</strong> {lastInterviewerSpeech}
          </div>

          {/* 🎯 Assist Mode AI Teleprompter Card for Round 3 (Architectural Defense Script) */}
          {isAssistModeActive && (
            <div style={{
              padding: '8px 10px',
              borderRadius: 10,
              background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)',
              border: '1.5px solid var(--reward)',
              boxShadow: '0 4px 14px rgba(var(--reward-rgb), 0.2)',
              display: 'flex',
              flexDirection: 'column',
              gap: 6
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ fontSize: 13 }}>🎯</span>
                  <span style={{ fontSize: 11.5, fontWeight: 900, color: 'var(--reward-bright)' }}>Defense Teleprompter</span>
                </div>
                <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                  {assistData?.script && (
                    <button
                      onClick={() => navigator.clipboard.writeText(assistData.script)}
                      style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'var(--text)', borderRadius: 4, padding: '2px 5px', fontSize: 10, fontWeight: 800, cursor: 'pointer' }}
                    >
                      📋 Copy
                    </button>
                  )}
                  {setIsAssistModeActive && (
                    <button
                      onClick={() => setIsAssistModeActive(false)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 11, cursor: 'pointer', padding: '0 2px' }}
                      title="Close"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {isFetchingAssist ? (
                <div style={{ padding: '6px 0', textAlign: 'center', color: 'var(--reward-bright)', fontSize: 11, fontStyle: 'italic' }}>
                  ✨ Crafting defense script...
                </div>
              ) : assistData?.script ? (
                <div style={{ background: 'rgba(0,0,0,0.45)', borderRadius: 6, padding: '6px 8px' }}>
                  <div style={{ fontSize: 12, lineHeight: 1.4, color: 'var(--text)', maxHeight: 100, overflowY: 'auto' }}>
                    &ldquo;
                    {assistData.script.split(' ').map((word: string, wIdx: number) => {
                      const clean = word.toLowerCase().replace(/[^a-z0-9]/g, '');
                      const isMatched = clean.length > 0 && spokenWordSet.has(clean);
                      return (
                        <span
                          key={wIdx}
                          style={{
                            color: isMatched ? 'var(--success-bright)' : 'var(--text)',
                            fontWeight: isMatched ? 800 : 400,
                            textShadow: isMatched ? '0 0 6px rgba(var(--success-rgb),0.8)' : 'none'
                          }}
                        >
                          {word}{' '}
                        </span>
                      );
                    })}
                    &rdquo;
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 11, color: 'var(--t3)' }}>No defense script ready.</span>
                  {fetchAssistScript && (
                    <button
                      onClick={() => fetchAssistScript(lastInterviewerSpeech, assistScriptLevel)}
                      style={{ background: 'var(--reward)', border: 'none', color: '#000', borderRadius: 4, padding: '2px 8px', fontSize: 10.5, fontWeight: 800, cursor: 'pointer' }}
                    >
                      ✨ Generate Script
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ⌨️ Architectural Defense Typed Input Fallback */}
          {setManualTextInput && onSendMessage && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!manualTextInput.trim()) return;
                const textToSend = manualTextInput.trim();
                setManualTextInput('');
                onSendMessage(textToSend);
              }}
              style={{ marginTop: 'auto', display: 'flex', gap: 6 }}
            >
              <input
                type="text"
                value={manualTextInput}
                onChange={(e) => setManualTextInput(e.target.value)}
                placeholder="Type your architecture defense..."
                style={{
                  flex: 1,
                  padding: '7px 10px',
                  borderRadius: 6,
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
                  padding: '7px 12px',
                  borderRadius: 6,
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
          )}
        </div>
      </div>
    </div>
  );
};
export default Round3SystemDesign;
