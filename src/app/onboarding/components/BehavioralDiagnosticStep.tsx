// src/app/onboarding/components/BehavioralDiagnosticStep.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  SJT_QUESTIONS,
  MATRIX_SCENARIOS,
  MATRIX_SCALE_CONFIG,
  TRADEOFF_PROBES,
  SJTQuestion,
  MatrixScenario,
  TradeoffProbe,
  SJTOption
} from '@/lib/onboarding/diagnosticRegistry';
import {
  RawDiagnosticResponse,
  RawMatrixResponse
} from '@/lib/onboarding/diagnosticEngine';

export interface BehavioralDiagnosticResults {
  sjtResponses: RawDiagnosticResponse[];
  matrixResponses: RawMatrixResponse[];
  tradeoffResponses: RawDiagnosticResponse[];
}

export interface BehavioralDiagnosticStepProps {
  onComplete: (results: BehavioralDiagnosticResults) => void;
  onGoBack?: () => void;
}

type DiagnosticPhase = 'SJT' | 'MATRIX' | 'TRADEOFF';

export default function BehavioralDiagnosticStep({
  onComplete,
  onGoBack
}: BehavioralDiagnosticStepProps) {
  const [phase, setPhase] = useState<DiagnosticPhase>('SJT');
  const [sjtIndex, setSjtIndex] = useState(0);
  const [matrixIndex, setMatrixIndex] = useState(0);
  const [tradeoffIndex, setTradeoffIndex] = useState(0);

  const [sjtResponses, setSjtResponses] = useState<RawDiagnosticResponse[]>([]);
  const [matrixResponses, setMatrixResponses] = useState<RawMatrixResponse[]>([]);
  const [tradeoffResponses, setTradeoffResponses] = useState<RawDiagnosticResponse[]>([]);

  // Latency timer
  const questionStartTimeRef = useRef<number>(Date.now());
  useEffect(() => {
    questionStartTimeRef.current = Date.now();
  }, [phase, sjtIndex, matrixIndex, tradeoffIndex]);

  // Shuffled options for current SJT to avoid position bias
  const currentSjt: SJTQuestion = SJT_QUESTIONS[sjtIndex];
  const [shuffledSjtOptions, setShuffledSjtOptions] = useState<SJTOption[]>([]);

  useEffect(() => {
    if (currentSjt) {
      // Deterministic but pseudo-random shuffle per question id
      const copy = [...currentSjt.options];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      setShuffledSjtOptions(copy);
    }
  }, [sjtIndex]);

  // Handle SJT choice
  const handleSelectSjtOption = (optId: string) => {
    const latency = Date.now() - questionStartTimeRef.current;
    const newRecord: RawDiagnosticResponse = {
      questionId: currentSjt.id,
      optionId: optId,
      responseTimeMs: latency,
      timestamp: Date.now()
    };

    const updated = [...sjtResponses.filter(r => r.questionId !== currentSjt.id), newRecord];
    setSjtResponses(updated);

    if (sjtIndex < SJT_QUESTIONS.length - 1) {
      setSjtIndex(prev => prev + 1);
    } else {
      // Move to Matrix phase
      setPhase('MATRIX');
      setMatrixIndex(0);
    }
  };

  // Matrix State for current Scenario
  const currentMatrix: MatrixScenario = MATRIX_SCENARIOS[matrixIndex];
  const [currentMatrixRatings, setCurrentMatrixRatings] = useState<Record<string, number>>({});

  useEffect(() => {
    if (currentMatrix) {
      const existing: Record<string, number> = {};
      for (const item of currentMatrix.items) {
        const found = matrixResponses.find(r => r.itemId === item.id);
        if (found) existing[item.id] = found.rating;
      }
      setCurrentMatrixRatings(existing);
    }
  }, [matrixIndex]);

  const handleRateMatrixItem = (itemId: string, rating: number) => {
    setCurrentMatrixRatings(prev => ({ ...prev, [itemId]: rating }));
  };

  const handleNextMatrixScenario = () => {
    const latency = Date.now() - questionStartTimeRef.current;
    const now = Date.now();
    const newItems: RawMatrixResponse[] = currentMatrix.items.map(item => ({
      scenarioId: currentMatrix.id,
      itemId: item.id,
      rating: currentMatrixRatings[item.id] || 3,
      responseTimeMs: Math.round(latency / 4),
      timestamp: now
    }));

    const updated = [
      ...matrixResponses.filter(r => r.scenarioId !== currentMatrix.id),
      ...newItems
    ];
    setMatrixResponses(updated);

    if (matrixIndex < MATRIX_SCENARIOS.length - 1) {
      setMatrixIndex(prev => prev + 1);
    } else {
      // Move to Trade-Off phase
      setPhase('TRADEOFF');
      setTradeoffIndex(0);
    }
  };

  // Handle Trade-Off Probe
  const currentTradeoff: TradeoffProbe = TRADEOFF_PROBES[tradeoffIndex];

  const handleSelectTradeoffOption = (optId: string) => {
    const latency = Date.now() - questionStartTimeRef.current;
    const newRecord: RawDiagnosticResponse = {
      questionId: currentTradeoff.id,
      optionId: optId,
      responseTimeMs: latency,
      timestamp: Date.now()
    };

    const updated = [...tradeoffResponses.filter(r => r.questionId !== currentTradeoff.id), newRecord];
    setTradeoffResponses(updated);

    if (tradeoffIndex < TRADEOFF_PROBES.length - 1) {
      setTradeoffIndex(prev => prev + 1);
    } else {
      // Completed all 3 behavioral phases!
      onComplete({
        sjtResponses,
        matrixResponses,
        tradeoffResponses: updated
      });
    }
  };

  return (
    <div style={{ flex: 1, padding: '24px 32px', display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto' }}>
      {/* Top Phase Breadcrumb */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <button
          type="button"
          onClick={() => {
            if (phase === 'SJT' && sjtIndex > 0) setSjtIndex(prev => prev - 1);
            else if (phase === 'MATRIX') {
              if (matrixIndex > 0) setMatrixIndex(prev => prev - 1);
              else { setPhase('SJT'); setSjtIndex(SJT_QUESTIONS.length - 1); }
            } else if (phase === 'TRADEOFF') {
              if (tradeoffIndex > 0) setTradeoffIndex(prev => prev - 1);
              else { setPhase('MATRIX'); setMatrixIndex(MATRIX_SCENARIOS.length - 1); }
            } else if (onGoBack) {
              onGoBack();
            }
          }}
          style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
        >
          ← Back
        </button>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{
            fontSize: 10,
            fontFamily: 'var(--font-mono)',
            padding: '3px 10px',
            borderRadius: 100,
            fontWeight: 800,
            background: phase === 'SJT' ? 'rgba(var(--brand-rgb), 0.2)' : 'rgba(255,255,255,0.04)',
            color: phase === 'SJT' ? 'var(--brand-bright)' : 'var(--t3)'
          }}>
            1. SITUATIONAL ({sjtIndex + 1}/12)
          </span>
          <span style={{
            fontSize: 10,
            fontFamily: 'var(--font-mono)',
            padding: '3px 10px',
            borderRadius: 100,
            fontWeight: 800,
            background: phase === 'MATRIX' ? 'rgba(var(--teal-rgb, 20, 184, 166), 0.2)' : 'rgba(255,255,255,0.04)',
            color: phase === 'MATRIX' ? 'var(--teal)' : 'var(--t3)'
          }}>
            2. FREQUENCY ({phase === 'MATRIX' ? matrixIndex + 1 : 0}/4)
          </span>
          <span style={{
            fontSize: 10,
            fontFamily: 'var(--font-mono)',
            padding: '3px 10px',
            borderRadius: 100,
            fontWeight: 800,
            background: phase === 'TRADEOFF' ? 'rgba(var(--coral-rgb, 244, 63, 94), 0.2)' : 'rgba(255,255,255,0.04)',
            color: phase === 'TRADEOFF' ? 'var(--coral)' : 'var(--t3)'
          }}>
            3. TRADE-OFFS ({phase === 'TRADEOFF' ? tradeoffIndex + 1 : 0}/4)
          </span>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          PHASE 1: SITUATIONAL JUDGEMENT TESTS (Q9 – Q20)
         ───────────────────────────────────────────────────────────── */}
      {phase === 'SJT' && currentSjt && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginBottom: 20 }}>
            <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--brand-bright)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 800 }}>
              {currentSjt.title}
            </span>
            <h3 style={{ fontSize: 18, fontWeight: 900, color: 'var(--t1)', marginTop: 4, marginBottom: 8, letterSpacing: '-0.3px' }}>
              {currentSjt.scenario}
            </h3>
            <p style={{ fontSize: 12, color: 'var(--t3)', fontStyle: 'italic' }}>
              {currentSjt.instruction}
            </p>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12, justifyContent: 'center' }}>
            {shuffledSjtOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSelectSjtOption(opt.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '16px 20px',
                  borderRadius: 14,
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1.5px solid rgba(255, 255, 255, 0.06)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  color: 'var(--t1)',
                  fontSize: 13.5,
                  fontWeight: 600,
                  lineHeight: 1.5,
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(var(--brand-rgb), 0.14)';
                  e.currentTarget.style.borderColor = 'var(--brand-bright)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
                }}
              >
                {opt.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          PHASE 2: BEHAVIORAL FREQUENCY MATRIX (M1 – M4)
         ───────────────────────────────────────────────────────────── */}
      {phase === 'MATRIX' && currentMatrix && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginBottom: 18 }}>
            <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--teal)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 800 }}>
              {currentMatrix.title}
            </span>
            <h3 style={{ fontSize: 17, fontWeight: 900, color: 'var(--t1)', marginTop: 4, marginBottom: 4 }}>
              {currentMatrix.scenario}
            </h3>
            <p style={{ fontSize: 12, color: 'var(--t3)' }}>
              In situations like this, how often do you actually take each approach? Rate each independently:
            </p>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14, justifyContent: 'center' }}>
            {currentMatrix.items.map((item) => {
              const currentRating = currentMatrixRatings[item.id] || 0;
              return (
                <div
                  key={item.id}
                  style={{
                    padding: '14px 16px',
                    borderRadius: 14,
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.06)'
                  }}
                >
                  <p style={{ fontSize: 13, fontWeight: 650, color: 'var(--t1)', marginBottom: 10, lineHeight: 1.4 }}>
                    {item.statement}
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6 }}>
                    {[1, 2, 3, 4, 5].map((val) => {
                      const isSelected = currentRating === val;
                      const label = (MATRIX_SCALE_CONFIG as any)[val]?.label || `${val}`;
                      return (
                        <button
                          key={val}
                          type="button"
                          onClick={() => handleRateMatrixItem(item.id, val)}
                          style={{
                            padding: '8px 4px',
                            borderRadius: 8,
                            border: `1.5px solid ${isSelected ? 'var(--teal)' : 'rgba(255, 255, 255, 0.08)'}`,
                            background: isSelected ? 'rgba(var(--teal-rgb, 20, 184, 166), 0.2)' : 'rgba(255, 255, 255, 0.02)',
                            color: isSelected ? 'var(--teal)' : 'var(--t3)',
                            fontSize: 10.5,
                            fontWeight: isSelected ? 800 : 600,
                            cursor: 'pointer',
                            textAlign: 'center',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <div>{val}</div>
                          <div style={{ fontSize: 9, opacity: 0.8, marginTop: 2 }}>{label}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ paddingTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={handleNextMatrixScenario}
              style={{
                padding: '10px 24px',
                background: 'linear-gradient(135deg, var(--teal) 0%, var(--accent) 100%)',
                border: 'none',
                borderRadius: 10,
                color: 'var(--card)',
                fontSize: 12.5,
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(var(--teal-rgb, 20, 184, 166), 0.25)'
              }}
            >
              Save & Next Scenario ➔
            </button>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          PHASE 3: DIRECT TRADE-OFF PROBES (Q21 – Q24)
         ───────────────────────────────────────────────────────────── */}
      {phase === 'TRADEOFF' && currentTradeoff && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginBottom: 20 }}>
            <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--coral)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 800 }}>
              {currentTradeoff.title} &middot; Probe {tradeoffIndex + 1} of 4
            </span>
            <h3 style={{ fontSize: 18, fontWeight: 900, color: 'var(--t1)', marginTop: 4, marginBottom: 4 }}>
              {currentTradeoff.scenario}
            </h3>
            <p style={{ fontSize: 12, color: 'var(--t3)' }}>
              {currentTradeoff.prompt} (Both choices have valid merit — choose what reflects your instinct)
            </p>
          </div>

          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14, alignItems: 'center' }}>
            {currentTradeoff.options.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSelectTradeoffOption(opt.id)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  padding: '24px 20px',
                  borderRadius: 16,
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1.5px solid rgba(255, 255, 255, 0.08)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  color: 'var(--t1)',
                  fontSize: 14,
                  fontWeight: 650,
                  lineHeight: 1.5,
                  minHeight: 140,
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(var(--coral-rgb, 244, 63, 94), 0.14)';
                  e.currentTarget.style.borderColor = 'var(--coral)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                }}
              >
                <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--coral)', textTransform: 'uppercase', marginBottom: 8, fontWeight: 800 }}>
                  Option {opt.id.slice(-1).toUpperCase()}
                </div>
                <div>{opt.text}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
