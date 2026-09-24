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
  starStep?: number;
  messages?: any[];
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
  starStep = 0,
  messages = [],
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
        {/* 🌟 S-T-A-R Assessment Progression Stepper */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 8,
          background: 'var(--bg3)',
          padding: '8px 12px',
          borderRadius: 12,
          border: '1px solid var(--border)'
        }}>
          {[
            { key: 'S', label: 'Situation', desc: 'Context & Challenge' },
            { key: 'T', label: 'Task', desc: 'Your Role / Target' },
            { key: 'A', label: 'Action', desc: 'Execution & Decisions' },
            { key: 'R', label: 'Result', desc: 'Quantifiable Impact' },
          ].map((step, idx) => {
            const isCurrent = (starStep % 4) === idx;
            const isCompleted = (starStep % 4) > idx || starStep >= 4;
            return (
              <div
                key={step.key}
                style={{
                  padding: '6px 8px',
                  borderRadius: 8,
                  background: isCurrent ? 'var(--accent-light)' : isCompleted ? 'rgba(var(--success-rgb), 0.12)' : 'transparent',
                  border: isCurrent ? '1.5px solid var(--accent)' : isCompleted ? '1px solid var(--success)' : '1px solid transparent',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: 11, fontWeight: 900, color: isCurrent ? 'var(--accent)' : isCompleted ? 'var(--success-bright)' : 'var(--t3)' }}>
                  {step.key} — {step.label}
                </div>
                <div style={{ fontSize: 9.5, color: isCurrent ? 'var(--t1)' : 'var(--t3)', marginTop: 2 }}>
                  {step.desc}
                </div>
              </div>
            );
          })}
        </div>

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

        {/* 🎯 Assist Mode AI Teleprompter Card (Placed Directly Below Response Input for Round 4) */}
        {isAssistModeActive && (
          <div style={{
            marginTop: 4,
            padding: '12px 14px',
            borderRadius: 14,
            background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)',
            border: '1.5px solid var(--reward)',
            boxShadow: '0 4px 16px rgba(var(--reward-rgb), 0.25)',
            display: 'flex',
            flexDirection: 'column',
            gap: 8
          }}>
            {/* Header with Title & Level Selector */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 14 }}>🎯</span>
                <span style={{ fontSize: 11.5, fontWeight: 900, color: 'var(--reward-bright)' }}>AI Teleprompter Script (STAR Answer)</span>
                <span style={{
                  fontSize: 9,
                  padding: '1px 5px',
                  borderRadius: 4,
                  background: 'rgba(var(--reward-rgb), 0.2)',
                  color: 'var(--reward-bright)',
                  fontWeight: 800
                }}>
                  🔒 Avatar cannot see this
                </span>
              </div>

              <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                {setAssistScriptLevel && (
                  <button
                    onClick={() => {
                      const nextLvl = assistScriptLevel === 'standard' ? 'advanced' : 'standard';
                      setAssistScriptLevel(nextLvl);
                      if (fetchAssistScript) fetchAssistScript(lastInterviewerSpeech, nextLvl);
                    }}
                    style={{
                      background: 'rgba(var(--reward-rgb),0.15)',
                      border: '1px solid var(--reward)',
                      color: 'var(--reward-bright)',
                      borderRadius: 6,
                      padding: '2px 6px',
                      fontSize: 9.5,
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    {assistScriptLevel === 'standard' ? '⚡ Beginner' : '🔥 Executive'}
                  </button>
                )}
                {assistData?.script && (
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(assistData.script);
                    }}
                    style={{
                      background: 'rgba(255,255,255,0.1)',
                      border: 'none',
                      color: 'var(--text)',
                      borderRadius: 6,
                      padding: '2px 6px',
                      fontSize: 9.5,
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    📋 Copy
                  </button>
                )}
                {setIsAssistModeActive && (
                  <button
                    onClick={() => setIsAssistModeActive(false)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 11, cursor: 'pointer', padding: '0 2px' }}
                    title="Close Assist Mode"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Tab Selectors */}
            {setAssistTab && (
              <div style={{ display: 'flex', gap: 4 }}>
                {(['script', 'bullets', 'delivery'] as const).map(tabKey => (
                  <button
                    key={tabKey}
                    onClick={() => setAssistTab(tabKey)}
                    style={{
                      flex: 1,
                      padding: '3px 6px',
                      borderRadius: 5,
                      fontSize: 10,
                      fontWeight: 800,
                      background: assistTab === tabKey ? 'var(--reward)' : 'rgba(255,255,255,0.06)',
                      color: assistTab === tabKey ? '#000' : 'var(--text-muted)',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    {tabKey === 'script' ? '📝 Read Aloud' : tabKey === 'bullets' ? '🎯 Key Points' : '🗣️ Pacing'}
                  </button>
                ))}
              </div>
            )}

            {/* Tab Body */}
            {isFetchingAssist ? (
              <div style={{ padding: '8px 0', textAlign: 'center', color: 'var(--reward-bright)', fontSize: 11, fontStyle: 'italic' }}>
                ✨ Crafting spoken STAR answer for this question...
              </div>
            ) : assistData ? (
              <div>
                {assistTab === 'script' && (
                  <div style={{ background: 'rgba(0,0,0,0.45)', borderRadius: 8, padding: '8px 10px', border: '1px solid rgba(var(--reward-rgb),0.2)' }}>
                    <div style={{ fontSize: 12, lineHeight: 1.5, color: 'var(--text)', maxHeight: 120, overflowY: 'auto' }}>
                      &ldquo;
                      {(assistData.script || '').split(' ').map((word: string, wIdx: number) => {
                        const clean = word.toLowerCase().replace(/[^a-z0-9]/g, '');
                        const isMatched = clean.length > 0 && spokenWordSet.has(clean);
                        return (
                          <span
                            key={wIdx}
                            style={{
                              color: isMatched ? 'var(--success-bright)' : 'var(--text)',
                              fontWeight: isMatched ? 800 : 400,
                              textShadow: isMatched ? '0 0 8px rgba(var(--success-rgb),0.8)' : 'none',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            {word}{' '}
                          </span>
                        );
                      })}
                      &rdquo;
                    </div>
                    <div style={{ marginTop: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 9.5, color: 'var(--reward-bright)' }}>
                      <span>🎙️ {liveSpeechTranscript ? '🟢 Spoken words glow green in real time' : 'Read aloud into mic to answer'}</span>
                      <span>{assistData.deliveryGuide?.pacing || '~125 WPM'}</span>
                    </div>
                  </div>
                )}

                {assistTab === 'bullets' && (
                  <div style={{ background: 'rgba(0,0,0,0.45)', borderRadius: 8, padding: '8px 10px', maxHeight: 110, overflowY: 'auto' }}>
                    <ul style={{ margin: 0, paddingLeft: 14, fontSize: 11, lineHeight: 1.5, color: 'var(--text)' }}>
                      {(assistData.bulletPoints || []).map((pt: string, idx: number) => (
                        <li key={idx} style={{ marginBottom: 2 }}>{pt}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {assistTab === 'delivery' && (
                  <div style={{ background: 'rgba(0,0,0,0.45)', borderRadius: 8, padding: '8px 10px', fontSize: 11, display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div><strong>Tone:</strong> {assistData.deliveryGuide?.tone || 'Confident and structured'}</div>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', alignItems: 'center' }}>
                      <strong>Key words:</strong>
                      {(assistData.deliveryGuide?.emphasisWords || []).map((w: string, i: number) => (
                        <span key={i} style={{ background: 'rgba(var(--reward-rgb),0.3)', color: '#e9d5ff', padding: '1px 5px', borderRadius: 4, fontSize: 9.5 }}>
                          {w}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0' }}>
                <span style={{ fontSize: 11, color: 'var(--t3)' }}>No STAR script generated yet.</span>
                {fetchAssistScript && (
                  <button
                    onClick={() => fetchAssistScript(lastInterviewerSpeech, assistScriptLevel)}
                    style={{
                      background: 'var(--reward)',
                      border: 'none',
                      color: '#000',
                      borderRadius: 6,
                      padding: '4px 10px',
                      fontSize: 10,
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    ✨ Generate STAR Script ➔
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default Round4StarDrill;
