'use client';

import React from 'react';
import { toast } from '@/lib/store/useAppStore';
import { AvatarTeacher, Message } from '../interviewTypes';

interface AssistData {
  script: string;
  bulletPoints: string[];
  deliveryGuide?: {
    pacing?: string;
    tone?: string;
    emphasisWords?: string[];
  };
}

interface AssistModeDrawerProps {
  isScoredStage: boolean;
  isAssistModeActive: boolean;
  setIsAssistModeActive: (active: boolean) => void;
  assistScriptLevel: 'standard' | 'advanced';
  setAssistScriptLevel: (lvl: 'standard' | 'advanced') => void;
  assistTab: 'script' | 'bullets' | 'delivery';
  setAssistTab: (tab: 'script' | 'bullets' | 'delivery') => void;
  isFetchingAssist: boolean;
  assistData: AssistData | null;
  liveSpeechTranscript: string;
  messages: Message[];
  activeTeacher: AvatarTeacher;
  difficulty: string;
  fetchAssistScript: (prompt: string, level?: 'standard' | 'advanced') => void;
  speakWithAvatarRaw: (
    text: string,
    teacherId: string,
    onStart: () => void,
    onEnd: () => void,
    allowMicRestart: boolean,
    isAssistScript: boolean,
    diff: string
  ) => void;
  setAnimState: (state: 'idle' | 'talking' | 'thinking') => void;
}

export const AssistModeDrawer: React.FC<AssistModeDrawerProps> = ({
  isScoredStage,
  isAssistModeActive,
  setIsAssistModeActive,
  assistScriptLevel,
  setAssistScriptLevel,
  assistTab,
  setAssistTab,
  isFetchingAssist,
  assistData,
  liveSpeechTranscript,
  messages,
  activeTeacher,
  difficulty,
  fetchAssistScript,
  speakWithAvatarRaw,
  setAnimState
}) => {
  if (isScoredStage || !isAssistModeActive) return null;

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)',
        border: '1.5px solid var(--reward)',
        borderRadius: 14,
        padding: '14px 16px',
        boxShadow: '0 8px 24px rgba(var(--reward-rgb), 0.25)',
        display: 'flex',
        flexDirection: 'column',
        gap: 10
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(var(--reward-rgb),0.3)', paddingBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 16 }}>🪄</span>
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 900, color: 'var(--reward-bright)', letterSpacing: 0.5 }}>
              ASSIST MODE TELEPROMPTER &amp; VOCAL SCRIPT
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
              Word-for-word spoken response script &amp; vocal coaching tailored to the current question
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => {
              if (assistData?.script) {
                speakWithAvatarRaw(assistData.script, activeTeacher.id, () => setAnimState('talking'), () => setAnimState('idle'), false, true, difficulty);
              }
            }}
            style={{
              background: 'rgba(var(--reward-rgb),0.2)',
              border: '1px solid var(--reward)',
              color: 'var(--reward-bright)',
              borderRadius: 6,
              padding: '3px 8px',
              fontSize: 10,
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            🔊 Listen Sample Voice
          </button>

          <button
            onClick={() => {
              const nextLvl = assistScriptLevel === 'standard' ? 'advanced' : 'standard';
              setAssistScriptLevel(nextLvl);
              const lastAssistantMsg = messages.filter(m => m.role === 'assistant').slice(-1)[0]?.content;
              if (lastAssistantMsg) fetchAssistScript(lastAssistantMsg, nextLvl);
            }}
            style={{
              background: 'rgba(var(--reward-rgb),0.15)',
              border: '1px solid var(--reward)',
              color: 'var(--reward-bright)',
              borderRadius: 6,
              padding: '3px 8px',
              fontSize: 10,
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            {assistScriptLevel === 'standard' ? '⚡ Beginner Script' : '🔥 Executive Script'}
          </button>

          <button
            onClick={() => {
              if (assistData?.script) {
                navigator.clipboard.writeText(assistData.script);
                toast.success('Script Copied! 📋', 'Teleprompter script copied to clipboard.');
              }
            }}
            style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'var(--text)', borderRadius: 6, padding: '3px 8px', fontSize: 10, fontWeight: 800, cursor: 'pointer' }}
          >
            📋 Copy
          </button>

          <button
            onClick={() => setIsAssistModeActive(false)}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 12, cursor: 'pointer', padding: '0 4px' }}
          >
            ✕
          </button>
        </div>
      </div>

      {/* Tab Selectors */}
      <div style={{ display: 'flex', gap: 6 }}>
        <button
          onClick={() => setAssistTab('script')}
          style={{
            flex: 1,
            padding: '6px',
            borderRadius: 6,
            fontSize: 11,
            fontWeight: 800,
            background: assistTab === 'script' ? 'var(--reward)' : 'rgba(255,255,255,0.05)',
            color: assistTab === 'script' ? '#fff' : 'var(--text-muted)',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          📝 Word-for-Word Script
        </button>
        <button
          onClick={() => setAssistTab('bullets')}
          style={{
            flex: 1,
            padding: '6px',
            borderRadius: 6,
            fontSize: 11,
            fontWeight: 800,
            background: assistTab === 'bullets' ? 'var(--reward)' : 'rgba(255,255,255,0.05)',
            color: assistTab === 'bullets' ? '#fff' : 'var(--text-muted)',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          🎯 Bullet Anchors
        </button>
        <button
          onClick={() => setAssistTab('delivery')}
          style={{
            flex: 1,
            padding: '6px',
            borderRadius: 6,
            fontSize: 11,
            fontWeight: 800,
            background: assistTab === 'delivery' ? 'var(--reward)' : 'rgba(255,255,255,0.05)',
            color: assistTab === 'delivery' ? '#fff' : 'var(--text-muted)',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          🗣️ How to Speak (Guide)
        </button>
      </div>

      {/* Tab Content */}
      {isFetchingAssist ? (
        <div style={{ padding: 14, textAlign: 'center', color: 'var(--reward-bright)', fontSize: 11.5, fontStyle: 'italic' }}>
          ✨ Generating tailored high-scoring speech script...
        </div>
      ) : assistData ? (
        <div>
          {assistTab === 'script' && (
            <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: 10, padding: '12px 14px', border: '1px solid rgba(var(--reward-rgb),0.2)' }}>
              <div style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--text)', fontWeight: 500 }}>
                &ldquo;
                {assistData.script.split(' ').map((word: string, wIdx: number) => {
                  const clean = word.toLowerCase().replace(/[^a-z0-9]/g, '');
                  const isMatched = clean.length > 2 && liveSpeechTranscript.toLowerCase().includes(clean);
                  return (
                    <span
                      key={wIdx}
                      style={{
                        color: isMatched ? 'var(--success-bright)' : 'var(--text)',
                        fontWeight: isMatched ? 800 : 500,
                        textShadow: isMatched ? '0 0 10px rgba(var(--success-rgb),0.7)' : 'none',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {word}{' '}
                    </span>
                  );
                })}
                &rdquo;
              </div>
              <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 10, color: 'var(--reward-bright)' }}>
                <span>🎙️ {liveSpeechTranscript ? '🟢 Reading detected — word matches glow green' : 'Read this script out loud into your microphone'}</span>
                <span>Pace: {assistData.deliveryGuide?.pacing || '~125 WPM'}</span>
              </div>
            </div>
          )}

          {assistTab === 'bullets' && (
            <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: 10, padding: '10px 14px', border: '1px solid rgba(var(--reward-rgb),0.2)' }}>
              <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12, lineHeight: 1.6, color: 'var(--text)' }}>
                {(assistData.bulletPoints || []).map((pt, idx) => (
                  <li key={idx} style={{ marginBottom: 4 }}>{pt}</li>
                ))}
              </ul>
            </div>
          )}

          {assistTab === 'delivery' && (
            <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: 10, padding: '10px 14px', border: '1px solid rgba(var(--reward-rgb),0.2)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--reward-bright)', textTransform: 'uppercase' }}>Vocal Delivery</span>
                <div style={{ fontSize: 11.5, color: 'var(--text)', marginTop: 4 }}><strong>Pacing:</strong> {assistData.deliveryGuide?.pacing}</div>
                <div style={{ fontSize: 11.5, color: 'var(--text)', marginTop: 2 }}><strong>Tone:</strong> {assistData.deliveryGuide?.tone}</div>
              </div>
              <div>
                <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--reward-bright)', textTransform: 'uppercase' }}>Emphasis Keywords</span>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 4 }}>
                  {(assistData.deliveryGuide?.emphasisWords || []).map((w, i) => (
                    <span key={i} style={{ background: 'rgba(var(--reward-rgb),0.3)', color: '#e9d5ff', padding: '2px 6px', borderRadius: 4, fontSize: 10, fontWeight: 800 }}>
                      {w}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div style={{ padding: 10, color: 'var(--text-muted)', fontSize: 11, textAlign: 'center' }}>
          No script loaded yet. Click &lsquo;Regenerate Script&rsquo; or wait for the next question.
        </div>
      )}
    </div>
  );
};
