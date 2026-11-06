'use client';

import React from 'react';
import { toast } from '@/lib/store/useAppStore';
import { AvatarTeacher, Message } from '../interviewTypes';

export interface AssistData {
  script: string;
  bulletPoints: string[];
  deliveryGuide?: {
    pacing?: string;
    tone?: string;
    emphasisWords?: string[];
  };
}

export function buildFallbackAssistData(
  stage: string,
  topic: string = 'Software Engineering',
  level: 'standard' | 'advanced' = 'standard',
  isCodingRound: boolean = false
): AssistData {
  const cleanTopic = (topic || 'Software Engineering').trim();
  if (isCodingRound || stage === 'round2_coding') {
    return {
      script:
        level === 'advanced'
          ? `Clarify input constraints and boundary invariants for ${cleanTopic} first, then compare brute-force vs optimal time/space complexity before writing modular, defensive code.`
          : "For " + cleanTopic + ", start by restating problem inputs and edge cases (empty input, single element, duplicates), then outline your step-by-step algorithm before coding.",
      bulletPoints: [
        'Validate null, empty, and single-element boundary inputs first',
        'State target Time Complexity O(N) / O(N log N) and Space Complexity bounds',
        'Trace one concrete example by hand before running the 5-tier test suite'
      ],
      deliveryGuide: {
        pacing: '125–145 WPM (Thoughtful & analytical)',
        tone: 'Structured, collaborative, invariant-driven',
        emphasisWords: ['complexity', 'invariant', 'boundary', 'trade-off']
      }
    };
  }

  if (stage === 'round3_systems') {
    return {
      script:
        level === 'advanced'
          ? `For this ${cleanTopic} architecture, I partitioned ingress traffic through an API Gateway and Load Balancer, isolated hot-path reads with a distributed cache, and decoupled state mutations via an asynchronous queue with idempotent consumers.`
          : `I designed the ${cleanTopic} system from client ingress through load balancing, stateless application services, caching, and primary database storage to prevent single points of failure.`,
      bulletPoints: [
        'Trace request data flow end-to-end from ingress to persistent storage',
        'Explain caching strategy (TTL, eviction, read-through vs write-around)',
        'Highlight failure isolation, replication, and throughput bottlenecks'
      ],
      deliveryGuide: {
        pacing: '130–150 WPM (Architectural clarity)',
        tone: 'Executive systems thinker',
        emphasisWords: ['throughput', 'latency', 'partitioning', 'idempotent']
      }
    };
  }

  if (stage === 'round4_star') {
    return {
      script:
        level === 'advanced'
          ? `In a high-stakes ${cleanTopic} production incident (Situation), I was tasked with restoring SLA compliance under strict latency bounds (Task). I profiled the bottleneck, rolled out a deterministic fix with automated regression guards (Action), reducing p99 latency by 42% with zero customer downtime (Result).`
          : `In my recent ${cleanTopic} project (Situation), my goal was to resolve a critical reliability bottleneck (Task). I implemented systematic validation and automated testing (Action), which improved performance and prevented regressions (Result).`,
      bulletPoints: [
        'Situation & Task: Set concrete context, scale, and business stakes in 2 sentences',
        'Action: Focus on YOUR specific technical decisions and trade-off rationale',
        'Result: Quantify the measurable outcome (latency, reliability, revenue, or defect reduction)'
      ],
      deliveryGuide: {
        pacing: '130–155 WPM (Executive composure)',
        tone: 'Accountable, metric-focused, decisive',
        emphasisWords: ['Situation', 'Task', 'Action', 'Result', 'measurable']
      }
    };
  }

  return {
    script:
      level === 'advanced'
        ? `Throughout my work in ${cleanTopic}, I have focused on building production-grade systems that balance reliability, maintainability, and measurable business impact. Recently, I architected a core workflow that improved execution efficiency while maintaining strict verification standards.`
        : `I have hands-on experience in ${cleanTopic}, where I focus on solving real-world problems through clean design, rigorous testing, and clear communication across technical and business stakeholders.`,
    bulletPoints: [
      `Connect your core background directly to ${cleanTopic} fundamentals`,
      'Highlight one concrete project or milestone with measurable outcomes',
      'Conclude with how your approach aligns with high-ownership engineering teams'
    ],
    deliveryGuide: {
      pacing: '125–150 WPM (Natural & confident)',
      tone: 'Warm, structured, and direct',
      emphasisWords: ['architecture', 'reliability', 'impact', 'ownership']
    }
  };
}

interface AssistModeDrawerProps {
  isScoredStage: boolean;
  isCodingRound?: boolean;
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
  isScoredStage: _isScoredStage,
  isCodingRound = false,
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
  const spokenWordSet = React.useMemo(() => {
    return new Set(liveSpeechTranscript.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(Boolean));
  }, [liveSpeechTranscript]);

  const resolvedAssistData = React.useMemo<AssistData>(() => {
    if (assistData && assistData.script) return assistData;
    return buildFallbackAssistData(
      isCodingRound ? 'round2_coding' : 'round1_behavioral',
      'Software Engineering',
      assistScriptLevel,
      isCodingRound
    );
  }, [assistData, assistScriptLevel, isCodingRound]);

  const scriptCoverage = React.useMemo(() => {
    const words = (resolvedAssistData.script || '')
      .split(/\s+/)
      .map(w => w.toLowerCase().replace(/[^a-z0-9]/g, ''))
      .filter(Boolean);
    if (words.length === 0) return { matched: 0, total: 0, pct: 0 };
    const matched = words.filter(w => spokenWordSet.has(w)).length;
    return {
      matched,
      total: words.length,
      pct: Math.round((matched / words.length) * 100)
    };
  }, [resolvedAssistData.script, spokenWordSet]);

  if (!isAssistModeActive) return null;

  return (
    <div
      data-testid="assist-mode-drawer"
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
          <span style={{ fontSize: 17.5 }}>🪄</span>
          <div>
            <div style={{ fontSize: 14, fontWeight: 900, color: 'var(--reward-bright)', letterSpacing: 0.5 }}>
              {isCodingRound ? 'CODING COACH • HINTS ONLY' : 'ASSIST MODE • INTERVIEW COACH'}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
              {isCodingRound ? 'Plan your approach and test your reasoning. No code or pseudocode.' : 'A tailored response outline and delivery coaching for the current question.'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            data-testid="assist-listen-btn"
            onClick={() => {
              if (resolvedAssistData?.script) {
                speakWithAvatarRaw(
                  resolvedAssistData.script,
                  activeTeacher.id,
                  () => setAnimState('talking'),
                  () => setAnimState('idle'),
                  false,
                  true,
                  difficulty
                );
              }
            }}
            style={{
              background: 'rgba(var(--reward-rgb),0.15)',
              border: '1px solid var(--reward)',
              color: 'var(--reward-bright)',
              borderRadius: 6,
              padding: '3px 8px',
              fontSize: 11,
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            🔊 Listen
          </button>

          <button
            data-testid="assist-regenerate-btn"
            onClick={() => {
              const lastAssistantMsg = messages.filter(m => m.role === 'assistant').slice(-1)[0]?.content;
              fetchAssistScript(lastAssistantMsg || 'Tell me about yourself and your experience.', assistScriptLevel);
            }}
            disabled={isFetchingAssist}
            style={{
              background: 'rgba(var(--reward-rgb),0.15)',
              border: '1px solid var(--reward)',
              color: 'var(--reward-bright)',
              borderRadius: 6,
              padding: '3px 8px',
              fontSize: 11,
              fontWeight: 800,
              cursor: isFetchingAssist ? 'wait' : 'pointer',
              opacity: isFetchingAssist ? 0.6 : 1
            }}
          >
            ↻ Regenerate
          </button>

          <button
            data-testid="assist-level-btn"
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
              fontSize: 11,
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            {assistScriptLevel === 'standard' ? '⚡ Beginner Script' : '🔥 Executive Script'}
          </button>

          <button
            onClick={() => {
              if (resolvedAssistData?.script) {
                navigator.clipboard.writeText(resolvedAssistData.script);
                toast.success('Script Copied! 📋', 'Teleprompter script copied to clipboard.');
              }
            }}
            style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'var(--text)', borderRadius: 6, padding: '3px 8px', fontSize: 11, fontWeight: 800, cursor: 'pointer' }}
          >
            📋 Copy
          </button>

          <button
            onClick={() => setIsAssistModeActive(false)}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 13, cursor: 'pointer', padding: '0 4px' }}
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
            fontSize: 12,
            fontWeight: 800,
            background: assistTab === 'script' ? 'var(--reward)' : 'rgba(255,255,255,0.05)',
            color: assistTab === 'script' ? '#fff' : 'var(--text-muted)',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          {isCodingRound ? '🧭 Approach' : '📝 Answer outline'}
        </button>
        <button
          onClick={() => setAssistTab('bullets')}
          style={{
            flex: 1,
            padding: '6px',
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 800,
            background: assistTab === 'bullets' ? 'var(--reward)' : 'rgba(255,255,255,0.05)',
            color: assistTab === 'bullets' ? '#fff' : 'var(--text-muted)',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          🎯 {isCodingRound ? 'Checklist' : 'Key points'}
        </button>
        <button
          onClick={() => setAssistTab('delivery')}
          style={{
            flex: 1,
            padding: '6px',
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 800,
            background: assistTab === 'delivery' ? 'var(--reward)' : 'rgba(255,255,255,0.05)',
            color: assistTab === 'delivery' ? '#fff' : 'var(--text-muted)',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          🗣️ {isCodingRound ? 'Reasoning' : 'Delivery'}
        </button>
      </div>

      {/* Tab Content */}
      {isFetchingAssist ? (
        <div style={{ padding: 14, textAlign: 'center', color: 'var(--reward-bright)', fontSize: 12.5, fontStyle: 'italic' }}>
          {isCodingRound ? '✨ Preparing conceptual hints…' : '✨ Preparing interview coaching…'}
        </div>
      ) : (
        <div>
          {assistTab === 'script' && (
            <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: 10, padding: '12px 14px', border: '1px solid rgba(var(--reward-rgb),0.2)' }}>
              <div style={{ fontSize: 14.5, lineHeight: 1.6, color: 'var(--text)', fontWeight: 500 }}>
                {isCodingRound ? resolvedAssistData.script : <>
                &ldquo;
                {resolvedAssistData.script.split(' ').map((word: string, wIdx: number) => {
                  const clean = word.toLowerCase().replace(/[^a-z0-9]/g, '');
                  const isMatched = clean.length > 0 && spokenWordSet.has(clean);
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
                </>}
              </div>
              <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, fontSize: 11, color: 'var(--reward-bright)' }}>
                <span>{isCodingRound ? 'Use these as prompts, not a solution.' : `🎙️ ${liveSpeechTranscript ? '🟢 Reading detected — word matches glow green' : 'Adapt this outline to your own experience'}`}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {!isCodingRound && (
                    <span
                      data-testid="assist-coverage-pill"
                      style={{
                        padding: '2px 8px',
                        borderRadius: 99,
                        background: scriptCoverage.pct >= 50 ? 'rgba(34, 197, 94, 0.18)' : 'rgba(255, 255, 255, 0.08)',
                        color: scriptCoverage.pct >= 50 ? 'var(--success-bright, #22c55e)' : 'var(--reward-bright)',
                        fontWeight: 800
                      }}
                    >
                      🎯 Coverage: {scriptCoverage.pct}% ({scriptCoverage.matched}/{scriptCoverage.total} words)
                    </span>
                  )}
                  {!isCodingRound && <span>Pace: {resolvedAssistData.deliveryGuide?.pacing || '~125 WPM'}</span>}
                </div>
              </div>
            </div>
          )}

          {assistTab === 'bullets' && (
            <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: 10, padding: '10px 14px', border: '1px solid rgba(var(--reward-rgb),0.2)' }}>
              <ul style={{ margin: 0, paddingLeft: 16, fontSize: 13, lineHeight: 1.6, color: 'var(--text)' }}>
                {(resolvedAssistData.bulletPoints || []).map((pt, idx) => (
                  <li key={idx} style={{ marginBottom: 4 }}>{pt}</li>
                ))}
              </ul>
            </div>
          )}

          {assistTab === 'delivery' && (
            <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: 10, padding: '10px 14px', border: '1px solid rgba(var(--reward-rgb),0.2)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--reward-bright)', textTransform: 'uppercase' }}>Vocal Delivery</span>
                <div style={{ fontSize: 12.5, color: 'var(--text)', marginTop: 4 }}><strong>Pacing:</strong> {resolvedAssistData.deliveryGuide?.pacing}</div>
                <div style={{ fontSize: 12.5, color: 'var(--text)', marginTop: 2 }}><strong>Tone:</strong> {resolvedAssistData.deliveryGuide?.tone}</div>
              </div>
              <div>
                <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--reward-bright)', textTransform: 'uppercase' }}>Emphasis Keywords</span>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 4 }}>
                  {(resolvedAssistData.deliveryGuide?.emphasisWords || []).map((w, i) => (
                    <span key={i} style={{ background: 'rgba(var(--reward-rgb),0.3)', color: '#e9d5ff', padding: '2px 6px', borderRadius: 4, fontSize: 11, fontWeight: 800 }}>
                      {w}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
