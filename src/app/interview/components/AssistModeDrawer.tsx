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
  isCodingRound: boolean = false,
  question: string = '',
  domainStream: 'tech' | 'non_tech' = 'tech'
): AssistData {
  const cleanTopic = (topic || 'Software Engineering').trim();
  const lowerQ = (question || '').toLowerCase();
  const isNonTech = domainStream === 'non_tech';

  if (isCodingRound || stage === 'round2_coding') {
    if (isNonTech) {
      return {
        script:
          level === 'advanced'
            ? `For this ${cleanTopic} case study, verify every Exhibit A line item first, compute the exact ratios with unit consistency, benchmark them against industry hurdles, and defend your Go/No-Go recommendation with downside risk controls.`
            : `Start by checking the Exhibit A figures for ${cleanTopic}, compute each financial metric step by step, and then write a crisp recommendation backed by the numbers and one operational risk mitigation.`,
        bulletPoints: [
          'Double-check units (₹ Lakhs, ₹ Crores, %, multiples) from Exhibit A before computing',
          'Compare each ratio against standard corporate / banking benchmark thresholds',
          'Tie your executive recommendation directly to profitability, cash flow, and risk controls'
        ],
        deliveryGuide: {
          pacing: '120–135 WPM (Clear & commercial)',
          tone: 'Analytical, structured, board-ready',
          emphasisWords: ['unit economics', 'benchmark', 'cash flow', 'risk mitigation']
        }
      };
    }
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
    if (isNonTech) {
      return {
        script:
          level === 'advanced'
            ? `For this ${cleanTopic} workflow, I structured acquisition from Target Audience through Ad Campaign and Landing Page into Checkout, synchronized fulfillment with Logistics and Supplier replenishment SLAs, and closed the post-purchase loop through CRM into Retention to lift LTV/CAC.`
            : `I mapped the ${cleanTopic} business workflow end-to-end from customer acquisition into checkout conversion, fulfillment logistics, and CRM retention so each department hands off cleanly without margin leakage.`,
        bulletPoints: [
          'Trace customer & order flow sequentially: Acquisition ➔ Checkout ➔ Fulfillment ➔ CRM/Retention',
          'Explain the main conversion or SLA handoff bottleneck and how you control it',
          'Tie the retention loop directly to repeat revenue and healthier LTV:CAC unit economics'
        ],
        deliveryGuide: {
          pacing: '120–135 WPM (Executive workflow clarity)',
          tone: 'Commercially grounded, strategic, KPI-driven',
          emphasisWords: ['funnel conversion', 'SLA handoff', 'fulfillment', 'retention loop']
        }
      };
    }
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
    if (isNonTech) {
      return {
        script:
          level === 'advanced'
            ? `In a high-stakes ${cleanTopic} business review (Situation), I was responsible for protecting gross margin and cash flow under rising acquisition costs (Task). I audited the unit-economics variance, instituted strict ROI and credit controls, and aligned stakeholders on weekly KPI gates (Action), recovering 320 bps of operating margin within one quarter (Result).`
            : `In my recent ${cleanTopic} project (Situation), my goal was to resolve a key profitability and compliance gap (Task). I audited the underlying numbers and introduced structured review controls (Action), which improved operational efficiency and margin quality (Result).`,
        bulletPoints: [
          'Situation & Task: Frame the commercial stakes, budget, or compliance pressure clearly',
          'Action: Highlight YOUR quantitative analysis, controls, and stakeholder alignment',
          'Result: Cite measurable business impact (margin bps, ₹ saved, DSO, or conversion lift)'
        ],
        deliveryGuide: {
          pacing: '125–145 WPM (Executive composure)',
          tone: 'Accountable, metric-focused, decisive',
          emphasisWords: ['Situation', 'Task', 'Action', 'Result', 'measurable']
        }
      };
    }
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

  // Round 1 Question-Aware Logic
  if (/\b(trade-?off\w*|differently|alternative\w*|compromise\w*|sacrifice\w*|retrospective\w*|approach differently|looking back|revisit\w*)\b/i.test(lowerQ)) {
    return {
      script: level === 'advanced'
        ? `When balancing trade-offs in ${cleanTopic}, our initial constraint was shipping an MVP rapidly under tight timelines. We chose a unified monolith with synchronous database transactions to iterate fast. In retrospect, the trade-off I would approach differently today is decoupling our event pipeline earlier and introducing asynchronous message queues with idempotent workers. That would have prevented database locking bottlenecks as our concurrency expanded 5x.`
        : `In that scenario for ${cleanTopic}, our primary trade-off was prioritizing delivery speed and simplicity over distributed complexity. We initially built a consolidated service to validate product-market fit quickly. Looking back, the key trade-off I would approach differently is decoupling the data layer earlier and introducing an asynchronous queue for heavy mutations. That would have prevented database connection bottlenecks as user concurrency surged.`,
      bulletPoints: [
        `Acknowledge original architectural trade-off (shipping velocity vs long-term scalability)`,
        `Pinpoint the exact technical evolution you would implement today (e.g. event queues, caching)`,
        `Cite the concrete metric benefit (e.g. eliminating database locks, predictable latency)`
      ],
      deliveryGuide: {
        pacing: '120–135 WPM (Reflective and analytical)',
        tone: 'Self-aware, mature, and engineering-grounded',
        emphasisWords: ['trade-off', 'monolith', 'asynchronous queue', 'idempotent', 'bottlenecks']
      }
    };
  }

  if (/\b(fail\w*|mistake\w*|error\w*|bug\w*|incident\w*|outage\w*|crash\w*|crisis|down|broken|regress\w*)\b/i.test(lowerQ)) {
    return {
      script: `During a critical deployment in ${cleanTopic}, we encountered an unexpected regression under peak production load. I took immediate ownership of the incident, coordinated with our team, and rolled back the change within 4 minutes. After stabilizing the service, I led a blameless post-mortem, identified the missing test coverage in our concurrent pipeline, and implemented automated regression guards so the issue could never recur.`,
      bulletPoints: [
        `Take direct, unreserved ownership of the incident without deflection`,
        `Detail immediate containment actions (circuit breaking, rollback within 4 minutes)`,
        `Demonstrate permanent architectural guards built into the engineering process`
      ],
      deliveryGuide: {
        pacing: '125–130 WPM (Composed and resolute)',
        tone: 'Accountable, crisis-tested, and process-driven',
        emphasisWords: ['ownership', 'circuit breaking', 'post-mortem', 'regression guards']
      }
    };
  }

  if (/\b(conflict\w*|disagree\w*|pushback|differing|friction|cross-functional|stakeholder\w*|clash\w*|alignment)\b/i.test(lowerQ)) {
    return {
      script: `When architecting a core component in ${cleanTopic}, a senior engineer and I had differing perspectives on whether to adopt a synchronous REST model or an event-driven pub/sub queue. Instead of debating theoretically, I proposed a 1-day benchmark spike to measure latency, throughput, and error propagation under simulated load. The telemetry proved the event-driven model provided far superior fault isolation. We aligned on the data, and shipped the milestone ahead of schedule.`,
      bulletPoints: [
        `Frame conflict around objective technical criteria rather than personal opinions`,
        `Use evidence-driven prototypes and telemetry to resolve architectural ambiguity`,
        `Highlight shared team alignment and mutual respect`
      ],
      deliveryGuide: {
        pacing: '120–125 WPM (Collaborative and measured)',
        tone: 'Empathetic, data-backed, and solutions-oriented',
        emphasisWords: ['benchmark', 'telemetry', 'fault isolation', 'aligned on data']
      }
    };
  }

  if (/\b(deadline\w*|pressure\w*|tight|fast|speed|urgent|urgency|timeline\w*|time constraint|balance speed)\b/i.test(lowerQ)) {
    return {
      script: `Under strict delivery pressure for our ${cleanTopic} release, I utilized a MoSCoW prioritization model to isolate critical-path features from non-essential enhancements. I aligned with our product stakeholders on MVP boundaries, automated our core acceptance tests, and maintained continuous deployment. As a result, we hit our launch deadline with zero critical defects and full test coverage on all primary workflows.`,
      bulletPoints: [
        `Demonstrate structured prioritization (MoSCoW framework) under pressure`,
        `Show active communication with product leads to prevent scope creep`,
        `Maintain non-negotiable engineering verification standards`
      ],
      deliveryGuide: {
        pacing: '120–130 WPM (Decisive and structured)',
        tone: 'Disciplined, pragmatic, and high-ownership',
        emphasisWords: ['prioritization', 'critical-path', 'acceptance tests', 'continuous deployment']
      }
    };
  }

  if (/\b(scale|scalable|scalability|scaling|bottleneck\w*|concurrency|throughput|latency|caching|redis|database|queries|capacity)\b/i.test(lowerQ)) {
    return {
      script: `To ensure scalable performance in ${cleanTopic}, I profiled our hot-path database queries and introduced read replicas alongside Redis caching for frequently read metadata. Furthermore, I added connection pooling and rate-limiting at the API gateway layer to prevent thundering herd spikes. This optimization reduced our p99 query latency by 65% and allowed the service to comfortably handle 4x peak traffic surges.`,
      bulletPoints: [
        `Identify specific bottleneck using profiling and latency telemetry`,
        `Introduce multi-tiered caching and connection pooling strategies`,
        `Quantify throughput and p99 latency gains under peak traffic`
      ],
      deliveryGuide: {
        pacing: '125–135 WPM (Confident and analytical)',
        tone: 'Architectural, systems-focused, and evidence-driven',
        emphasisWords: ['read replicas', 'caching', 'connection pooling', 'p99 latency']
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
  compact?: boolean;
  activeStage?: string;
  activeTopicName?: string;
  questionText?: string;
  isDockedUnderCam?: boolean;
  onToggleDock?: () => void;
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
  activeTeacher?: AvatarTeacher;
  difficulty?: string;
  fetchAssistScript: (prompt: string, level?: 'standard' | 'advanced') => void;
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

export const AssistModeDrawer: React.FC<AssistModeDrawerProps> = ({
  isScoredStage: _isScoredStage,
  isCodingRound = false,
  compact = false,
  activeStage,
  activeTopicName = 'Software Engineering',
  questionText,
  isDockedUnderCam = false,
  onToggleDock,
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
  difficulty = 'medium',
  fetchAssistScript,
  speakWithAvatarRaw,
  setAnimState
}) => {
  const spokenWordSet = React.useMemo(() => {
    return new Set(liveSpeechTranscript.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(Boolean));
  }, [liveSpeechTranscript]);

  const lastAssistantQuestion = React.useMemo(() => {
    if (questionText && questionText.trim()) return questionText;
    return messages.filter(m => m.role === 'assistant').slice(-1)[0]?.content || '';
  }, [questionText, messages]);

  const resolvedAssistData = React.useMemo<AssistData>(() => {
    if (assistData && assistData.script) return assistData;
    return buildFallbackAssistData(
      activeStage || (isCodingRound ? 'round2_coding' : 'round1_behavioral'),
      activeTopicName || 'Software Engineering',
      assistScriptLevel,
      isCodingRound,
      lastAssistantQuestion
    );
  }, [assistData, activeStage, activeTopicName, assistScriptLevel, isCodingRound, lastAssistantQuestion]);

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
      className="iv-assist-drawer"
      style={{
        borderRadius: compact ? 8 : 10,
        padding: compact ? '5px 8px' : '8px 10px',
        boxShadow: isDockedUnderCam
          ? '0 8px 24px rgba(var(--reward-rgb), 0.35)'
          : '0 6px 18px rgba(var(--reward-rgb), 0.22)',
        gap: compact ? 3 : 5,
        maxHeight: compact ? 160 : 210,
        overflowY: 'auto',
        boxSizing: 'border-box'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(var(--reward-rgb),0.3)', paddingBottom: compact ? 4 : 6, gap: 4, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: compact ? 13 : 15 }}>🪄</span>
          <div>
            <div style={{ fontSize: compact ? 11 : 12, fontWeight: 900, color: 'var(--reward-bright)', letterSpacing: 0.5 }}>
              {isCodingRound ? 'CODING COACH • HINTS ONLY' : 'ASSIST MODE • INTERVIEW COACH'}
            </div>
            {!compact && (
              <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                {isCodingRound ? 'Plan your approach and test your reasoning. No code or pseudocode.' : 'A tailored response outline and delivery coaching for the current question. (Alt+Space to toggle)'}
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 4, alignItems: 'center', flexWrap: 'wrap' }}>
          {speakWithAvatarRaw && activeTeacher && (
            <button
              data-testid="assist-listen-btn"
              onClick={() => {
                if (resolvedAssistData?.script) {
                  speakWithAvatarRaw(
                    resolvedAssistData.script,
                    activeTeacher.id,
                    () => {},
                    () => {},
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
                borderRadius: 5,
                padding: '2px 6px',
                fontSize: 10,
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              🔊 Listen
            </button>
          )}
          {onToggleDock && (
            <button
              data-testid="assist-dock-btn"
              onClick={onToggleDock}
              title={isDockedUnderCam ? 'Restore beside transcript' : 'Dock directly under your webcam so your eyes stay near the lens'}
              style={{
                background: isDockedUnderCam ? 'var(--reward)' : 'rgba(var(--reward-rgb),0.15)',
                border: '1px solid var(--reward)',
                color: isDockedUnderCam ? '#fff' : 'var(--reward-bright)',
                borderRadius: 5,
                padding: '2px 6px',
                fontSize: 10,
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              {isDockedUnderCam ? '◧ Inline' : '📷 Eye-Level Dock'}
            </button>
          )}

          <button
            data-testid="assist-regenerate-btn"
            onClick={() => {
              fetchAssistScript(lastAssistantQuestion || 'Tell me about yourself and your experience.', assistScriptLevel);
            }}
            disabled={isFetchingAssist}
            style={{
              background: 'rgba(var(--reward-rgb),0.15)',
              border: '1px solid var(--reward)',
              color: 'var(--reward-bright)',
              borderRadius: 5,
              padding: '2px 6px',
              fontSize: 10,
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
              fetchAssistScript(lastAssistantQuestion || 'Tell me about yourself and your experience.', nextLvl);
            }}
            style={{
              background: 'rgba(var(--reward-rgb),0.15)',
              border: '1px solid var(--reward)',
              color: 'var(--reward-bright)',
              borderRadius: 5,
              padding: '2px 6px',
              fontSize: 10,
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            {assistScriptLevel === 'standard' ? '⚡ Beginner Script' : '🔥 Executive Script'}
          </button>

          <button
            onClick={() => {
              if (resolvedAssistData?.script) {
                navigator.clipboard?.writeText(resolvedAssistData.script)
                  .then(() => toast.success('Script Copied! 📋', 'Teleprompter script copied to clipboard.'))
                  .catch(() => toast.info('Copy Unavailable', 'Select the text directly to copy it.'));
              }
            }}
            style={{ background: 'rgba(var(--reward-rgb), 0.18)', border: '1px solid rgba(var(--reward-rgb), 0.35)', color: 'inherit', borderRadius: 5, padding: '2px 6px', fontSize: 10, fontWeight: 800, cursor: 'pointer' }}
          >
            📋 Copy
          </button>

          <button
            onClick={() => setIsAssistModeActive(false)}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 12, cursor: 'pointer', padding: '0 3px' }}
          >
            ✕
          </button>
        </div>
      </div>

      {/* Tab Selectors */}
      <div style={{ display: 'flex', gap: 4 }}>
        <button
          onClick={() => setAssistTab('script')}
          style={{
            flex: 1,
            padding: '4px 6px',
            borderRadius: 5,
            fontSize: 10.5,
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
            padding: '4px 6px',
            borderRadius: 5,
            fontSize: 10.5,
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
            padding: '4px 6px',
            borderRadius: 5,
            fontSize: 10.5,
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
        <div style={{ padding: 10, textAlign: 'center', color: 'var(--reward-bright)', fontSize: 11.5, fontStyle: 'italic' }}>
          {isCodingRound ? '✨ Preparing conceptual hints…' : '✨ Preparing interview coaching…'}
        </div>
      ) : (
        <div>
          {assistTab === 'script' && (
            <div className="iv-assist-surface" style={{ padding: compact ? '5px 7px' : '8px 10px' }}>
              <div style={{ fontSize: compact ? 10.5 : 11.5, lineHeight: 1.35, color: 'inherit', fontWeight: 500, maxHeight: compact ? 68 : 100, overflowY: 'auto' }}>
                {isCodingRound ? resolvedAssistData.script : <>
                &ldquo;
                {resolvedAssistData.script.split(' ').map((word: string, wIdx: number) => {
                  const clean = word.toLowerCase().replace(/[^a-z0-9]/g, '');
                  const isMatched = clean.length > 0 && spokenWordSet.has(clean);
                  return (
                    <span
                      key={wIdx}
                      style={{
                        color: isMatched ? 'var(--success-bright)' : 'inherit',
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
              <div style={{ marginTop: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 6, fontSize: 10, color: 'var(--reward-bright)' }}>
                <span>{isCodingRound ? 'Use these as prompts, not a solution.' : `🎙️ ${liveSpeechTranscript ? '🟢 Reading detected — word matches glow green' : 'Adapt this outline to your own experience'}`}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {!isCodingRound && (
                    <span
                      data-testid="assist-coverage-pill"
                      style={{
                        padding: '1px 6px',
                        borderRadius: 99,
                        background: scriptCoverage.pct >= 50 ? 'rgba(34, 197, 94, 0.18)' : 'rgba(var(--reward-rgb), 0.16)',
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
            <div className="iv-assist-surface" style={{ padding: '6px 10px' }}>
              <ul style={{ margin: 0, paddingLeft: 14, fontSize: 11, lineHeight: 1.45, color: 'inherit' }}>
                {(resolvedAssistData.bulletPoints || []).map((pt, idx) => (
                  <li key={idx} style={{ marginBottom: 3 }}>{pt}</li>
                ))}
              </ul>
            </div>
          )}

          {assistTab === 'delivery' && (
            <div className="iv-assist-surface" style={{ padding: '6px 10px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 8 }}>
              <div>
                <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--reward-bright)', textTransform: 'uppercase' }}>Vocal Delivery</span>
                <div style={{ fontSize: 11, color: 'inherit', marginTop: 3 }}><strong>Pacing:</strong> {resolvedAssistData.deliveryGuide?.pacing}</div>
                <div style={{ fontSize: 11, color: 'inherit', marginTop: 2 }}><strong>Tone:</strong> {resolvedAssistData.deliveryGuide?.tone}</div>
              </div>
              <div>
                <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--reward-bright)', textTransform: 'uppercase' }}>Emphasis Keywords</span>
                <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap', marginTop: 3 }}>
                  {(resolvedAssistData.deliveryGuide?.emphasisWords || []).map((w, i) => (
                    <span key={i} style={{ background: 'rgba(var(--reward-rgb),0.24)', color: 'var(--reward-bright)', padding: '1px 5px', borderRadius: 4, fontSize: 10, fontWeight: 800 }}>
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
