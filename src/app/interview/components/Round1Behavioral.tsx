'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import type { AnimState } from '@/components/avatar/VRoidAvatarEngine';

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
  fillerWordCount: number;
  messages: Message[];
  messagesEndRef: React.RefObject<HTMLDivElement>;
  startVoiceListening: () => void;
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
  fillerWordCount,
  messages,
  messagesEndRef,
  startVoiceListening,
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
}) => {
  const spokenWordSet = React.useMemo(() => {
    return new Set(liveSpeechTranscript.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(Boolean));
  }, [liveSpeechTranscript]);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '6fr 4fr', gap: 16, alignItems: 'stretch' }}>
      {/* Left 60%: 3D VRoid Avatar Viewport */}
      <div style={{
        height: isAssistModeActive ? 640 : 500,
        background: 'var(--bg3)',
        borderRadius: 20,
        border: '1px solid var(--border)',
        overflow: 'hidden',
        position: 'relative',
        boxShadow: 'var(--shadow-md)',
        transition: 'height 0.3s ease'
      }}>
        <VRoidInterviewAvatar teacherId={activeTeacher.id} animState={animState} zoom={1.65} />

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

        {/* Avatar Status Badge */}
        <div style={{
          position: 'absolute', top: 14, left: 14, padding: '6px 14px', borderRadius: 100,
          background: isAvatarSpeaking ? 'var(--accent)' : isVoiceListening ? 'var(--danger)' : 'var(--green)',
          backdropFilter: 'blur(8px)', color: 'var(--text)', fontSize: 11, fontWeight: 800,
          display: 'flex', alignItems: 'center', gap: 6, boxShadow: 'var(--shadow-md)'
        }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff', display: 'inline-block' }} />
          {isAvatarSpeaking ? `${activeTeacher.name} is Speaking...` : isVoiceListening ? '🎙️ Listening (Speak Now)...' : '🎤 Voice Ready'}
        </div>

        {/* Inverted Subtitle Fixed: Strictly displays interviewer's speech */}
        <div style={{
          position: 'absolute', bottom: 14, left: 14, right: 14, padding: '10px 16px',
          background: 'rgba(0,0,0,0.80)', backdropFilter: 'blur(10px)', borderRadius: 12,
          color: 'var(--text)', fontSize: 12, lineHeight: 1.4, border: '1px solid rgba(255,255,255,0.12)'
        }}>
          <strong>{activeTeacher.name}:</strong> {lastInterviewerSpeech}
        </div>
      </div>

      {/* Right 40%: Scrollable Transcript, Teleprompter & Input */}
      <div className="iv-panel" style={{
        padding: 18,
        height: isAssistModeActive ? 640 : 500,
        display: 'flex',
        flexDirection: 'column',
        transition: 'height 0.3s ease'
      }}>
        <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: 8, marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: 10.5, fontWeight: 800, color: 'var(--accent-mid)' }}>ROUND 1 OF 4</span>
            <h2 style={{ fontSize: 14, fontWeight: 900, margin: 0, color: 'var(--t1)' }}>Behavioral & Background Intro</h2>
          </div>
          <button onClick={onProceed} style={{ background: 'var(--accent)', border: 'none', color: 'var(--text)', borderRadius: 8, padding: '6px 12px', fontSize: 11, fontWeight: 800, cursor: 'pointer' }}>
            Proceed to Round 2 ➔
          </button>
        </div>

        {/* Telemetry Bar */}
        <div style={{ background: 'var(--bg3)', borderRadius: 10, padding: '8px 12px', border: '1px solid var(--border)', marginBottom: 10, display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
          <div>👀 Eye Contact: <strong style={{ color: eyeContactScore !== null ? 'var(--green-mid)' : 'var(--t3)' }}>{eyeContactScore !== null ? `${eyeContactScore}%` : 'Cam Off'}</strong></div>
          <div>⚡ Pace: <strong style={{ color: 'var(--accent-mid)' }}>{wpmScore !== null ? `${wpmScore} WPM` : 'Mic Off'}</strong></div>
          <div>💬 Fillers: <strong style={{ color: 'var(--green-mid)' }}>{wpmScore !== null ? fillerWordCount : 'N/A'}</strong></div>
        </div>

        {/* Transcript Stream */}
        <div className="scroll-container" style={{ flex: 1, minHeight: 120, maxHeight: isAssistModeActive ? 220 : 'none', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10, paddingRight: 4 }}>
          {messages.map((m, i) => (
            <div key={i} style={{ alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '88%' }}>
              <div className={m.role === 'user' ? 'iv-chat-user' : 'iv-chat-assistant'} style={{ padding: '10px 14px', borderRadius: 14, fontSize: 12, lineHeight: 1.5 }}>
                {m.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* 🎯 Assist Mode AI Teleprompter Card (Placed Directly Below Chat) */}
        {isAssistModeActive && (
          <div style={{
            marginTop: 8,
            marginBottom: 8,
            padding: '10px 12px',
            borderRadius: 12,
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
                <span style={{ fontSize: 11.5, fontWeight: 900, color: 'var(--reward-bright)' }}>AI Teleprompter Script</span>
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
                ✨ Crafting spoken answer for this question...
              </div>
            ) : assistData ? (
              <div>
                {assistTab === 'script' && (
                  <div style={{ background: 'rgba(0,0,0,0.45)', borderRadius: 8, padding: '8px 10px', border: '1px solid rgba(var(--reward-rgb),0.2)' }}>
                    <div style={{ fontSize: 12, lineHeight: 1.5, color: 'var(--text)', maxHeight: 110, overflowY: 'auto' }}>
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
                      <span>🎙️ {liveSpeechTranscript ? '🟢 Word matches glow green as you speak' : 'Read aloud into mic to practice'}</span>
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
                <span style={{ fontSize: 11, color: 'var(--t3)' }}>No script generated yet.</span>
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
                    ✨ Generate Answer Script ➔
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button
            onClick={startVoiceListening}
            style={{
              width: '100%',
              background: isVoiceListening ? 'var(--danger)' : 'linear-gradient(135deg, var(--accent) 0%, var(--purple) 100%)',
              border: 'none', color: 'var(--text)', borderRadius: 10, padding: '10px', fontSize: 12, fontWeight: 900, cursor: 'pointer',
              boxShadow: isVoiceListening ? '0 0 14px rgba(var(--danger-rgb),0.7)' : 'var(--shadow-sm)'
            }}
          >
            {isVoiceListening ? '🎙️ Listening to Voice... (Speak Now)' : '🎤 Click to Speak Response'}
          </button>

          {/* ⌨️ Direct Typed Response Fallback for Noisy Environments */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!manualTextInput.trim()) return;
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
              onChange={(e) => setManualTextInput(e.target.value)}
              placeholder="Or type your response here..."
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: 8,
                border: '1px solid var(--border)',
                background: 'var(--bg3)',
                color: 'var(--t1)',
                fontSize: 11.5
              }}
            />
            <button
              type="submit"
              disabled={!manualTextInput.trim()}
              style={{
                padding: '8px 14px',
                borderRadius: 8,
                border: 'none',
                background: manualTextInput.trim() ? 'var(--accent)' : 'var(--bg2)',
                color: manualTextInput.trim() ? 'var(--text)' : 'var(--t3)',
                fontSize: 11.5,
                fontWeight: 800,
                cursor: manualTextInput.trim() ? 'pointer' : 'default'
              }}
            >
              Send ➔
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Round1Behavioral;
