// src/app/onboarding/components/BehavioralDiagnosticStep.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  getSjtQuestions,
  getMatrixScenarios,
  getTradeoffProbes,
  MATRIX_SCALE_CONFIG,
  SJTQuestion,
  MatrixScenario,
  TradeoffProbe,
  SJTOption,
  COMMERCE_SPECIALIZATION_QUESTIONS
} from '@/lib/onboarding/diagnosticRegistry';
import { SpecializationQuestion } from '@/lib/onboarding/diagnosticRegistryCommerce';
import {
  RawDiagnosticResponse,
  RawMatrixResponse
} from '@/lib/onboarding/diagnosticEngine';

export interface BehavioralDiagnosticResults {
  sjtResponses: RawDiagnosticResponse[];
  matrixResponses: RawMatrixResponse[];
  tradeoffResponses: RawDiagnosticResponse[];
  specializationResponse?: RawDiagnosticResponse;
}

export interface BehavioralDiagnosticStepProps {
  onComplete: (results: BehavioralDiagnosticResults) => void;
  onGoBack?: () => void;
  onBack?: () => void;
  goalAnswers?: any;
}

type DiagnosticPhase = 'SJT' | 'MATRIX' | 'TRADEOFF' | 'SPECIALIZATION';

export default function BehavioralDiagnosticStep({
  onComplete,
  onGoBack,
  onBack,
  goalAnswers
}: BehavioralDiagnosticStepProps) {
  // Stream-specific question sets
  const degreeTrack = goalAnswers?.degreeTrack || 'btech_bca_mca';
  const isCommerceStream = degreeTrack.includes('bcom') || degreeTrack.includes('mcom') || degreeTrack.includes('commerce');

  const activeSjtQuestions: SJTQuestion[] = getSjtQuestions(degreeTrack);
  const activeMatrixScenarios: MatrixScenario[] = getMatrixScenarios(degreeTrack);
  const activeTradeoffProbes: TradeoffProbe[] = getTradeoffProbes(degreeTrack);

  // Commerce Specialization Question (Q27) resolution
  const getSpecializationQuestion = (): SpecializationQuestion | null => {
    if (!isCommerceStream) return null;
    const roleKey = (goalAnswers?.role || 'accounting_finance').toLowerCase();
    if (COMMERCE_SPECIALIZATION_QUESTIONS[roleKey]) {
      return COMMERCE_SPECIALIZATION_QUESTIONS[roleKey];
    }
    if (roleKey.includes('audit') || roleKey.includes('tax')) return COMMERCE_SPECIALIZATION_QUESTIONS.audit_taxation;
    if (roleKey.includes('bank') || roleKey.includes('invest') || roleKey.includes('market')) return COMMERCE_SPECIALIZATION_QUESTIONS.banking_services;
    if (roleKey.includes('analyt') || roleKey.includes('data')) return COMMERCE_SPECIALIZATION_QUESTIONS.business_analytics;
    if (roleKey.includes('corp') || roleKey.includes('mgmt') || roleKey.includes('operations')) return COMMERCE_SPECIALIZATION_QUESTIONS.corporate_management;
    if (roleKey.includes('hr') || roleKey.includes('human')) return COMMERCE_SPECIALIZATION_QUESTIONS.human_resources;
    if (roleKey.includes('market') || roleKey.includes('sale')) return COMMERCE_SPECIALIZATION_QUESTIONS.marketing_sales;
    if (roleKey.includes('entrepreneur') || roleKey.includes('business')) return COMMERCE_SPECIALIZATION_QUESTIONS.entrepreneurship;
    return COMMERCE_SPECIALIZATION_QUESTIONS.accounting_finance;
  };
  const activeSpecializationQ = getSpecializationQuestion();

  const [phase, setPhase] = useState<DiagnosticPhase>('SJT');
  const [sjtIndex, setSjtIndex] = useState(0);
  const [matrixIndex, setMatrixIndex] = useState(0);
  const [tradeoffIndex, setTradeoffIndex] = useState(0);

  const [sjtResponses, setSjtResponses] = useState<RawDiagnosticResponse[]>([]);
  const [matrixResponses, setMatrixResponses] = useState<RawMatrixResponse[]>([]);
  const [tradeoffResponses, setTradeoffResponses] = useState<RawDiagnosticResponse[]>([]);
  const [specializationResponse, setSpecializationResponse] = useState<RawDiagnosticResponse | undefined>();

  // Tactile selection and debounce state
  const [selectedOptId, setSelectedOptId] = useState<string | null>(null);
  const [isAdvancing, setIsAdvancing] = useState<boolean>(false);

  // Latency timer
  const questionStartTimeRef = useRef<number>(Date.now());
  useEffect(() => {
    questionStartTimeRef.current = Date.now();
    // Restore previous selection if user stepped back to this question
    if (phase === 'SJT') {
      const q = activeSjtQuestions[sjtIndex];
      const prev = sjtResponses.find(r => r.questionId === q?.id);
      setSelectedOptId(prev && !prev.skipped ? prev.optionId : null);
    } else if (phase === 'TRADEOFF') {
      const q = activeTradeoffProbes[tradeoffIndex];
      const prev = tradeoffResponses.find(r => r.questionId === q?.id);
      setSelectedOptId(prev && !prev.skipped ? prev.optionId : null);
    } else {
      setSelectedOptId(null);
    }
    setIsAdvancing(false);
  }, [phase, sjtIndex, matrixIndex, tradeoffIndex]);

  // Shuffled options for current SJT to avoid position bias
  const currentSjt: SJTQuestion = activeSjtQuestions[sjtIndex] || activeSjtQuestions[0];
  const [shuffledSjtOptions, setShuffledSjtOptions] = useState<SJTOption[]>([]);

  useEffect(() => {
    if (currentSjt) {
      const copy = [...currentSjt.options];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      setShuffledSjtOptions(copy);
    }
  }, [sjtIndex, phase, degreeTrack]);

  // Universal Navigation: Go back to previous question
  const handleUniversalPrev = () => {
    if (phase === 'SJT') {
      if (sjtIndex > 0) {
        setSjtIndex(prev => prev - 1);
      } else if (onGoBack) {
        onGoBack();
      } else if (onBack) {
        onBack();
      }
    } else if (phase === 'MATRIX') {
      if (matrixIndex > 0) {
        setMatrixIndex(prev => prev - 1);
      } else {
        setPhase('SJT');
        setSjtIndex(activeSjtQuestions.length - 1);
      }
    } else if (phase === 'TRADEOFF') {
      if (tradeoffIndex > 0) {
        setTradeoffIndex(prev => prev - 1);
      } else {
        setPhase('MATRIX');
        setMatrixIndex(activeMatrixScenarios.length - 1);
      }
    } else if (phase === 'SPECIALIZATION') {
      setPhase('TRADEOFF');
      setTradeoffIndex(activeTradeoffProbes.length - 1);
    }
  };

  // Universal Navigation: I Don't Know / Skip Question
  const handleUniversalSkip = () => {
    if (isAdvancing) return;

    if (phase === 'SJT') {
      const skipRecord: RawDiagnosticResponse = {
        questionId: currentSjt.id,
        optionId: 'skipped',
        skipped: true,
        responseTimeMs: 0,
        timestamp: Date.now()
      };
      const updated = [...sjtResponses.filter(r => r.questionId !== currentSjt.id), skipRecord];
      setSjtResponses(updated);

      if (sjtIndex < activeSjtQuestions.length - 1) {
        setSjtIndex(prev => prev + 1);
      } else {
        setPhase('MATRIX');
        setMatrixIndex(0);
      }
    } else if (phase === 'MATRIX') {
      const now = Date.now();
      const skipItems: RawMatrixResponse[] = currentMatrix.items.map(item => ({
        scenarioId: currentMatrix.id,
        itemId: item.id,
        rating: 3, // neutral
        skipped: true,
        responseTimeMs: 0,
        timestamp: now
      }));
      const updated = [
        ...matrixResponses.filter(r => r.scenarioId !== currentMatrix.id),
        ...skipItems
      ];
      setMatrixResponses(updated);

      if (matrixIndex < activeMatrixScenarios.length - 1) {
        setMatrixIndex(prev => prev + 1);
      } else {
        setPhase('TRADEOFF');
        setTradeoffIndex(0);
      }
    } else if (phase === 'TRADEOFF') {
      const skipRecord: RawDiagnosticResponse = {
        questionId: currentTradeoff.id,
        optionId: 'skipped',
        skipped: true,
        responseTimeMs: 0,
        timestamp: Date.now()
      };
      const updated = [...tradeoffResponses.filter(r => r.questionId !== currentTradeoff.id), skipRecord];
      setTradeoffResponses(updated);

      if (tradeoffIndex < activeTradeoffProbes.length - 1) {
        setTradeoffIndex(prev => prev + 1);
      } else {
        if (isCommerceStream && activeSpecializationQ) {
          setPhase('SPECIALIZATION');
        } else {
          onComplete({
            sjtResponses,
            matrixResponses,
            tradeoffResponses: updated
          });
        }
      }
    } else if (phase === 'SPECIALIZATION') {
      const skipRecord: RawDiagnosticResponse = {
        questionId: activeSpecializationQ?.questionId || 'Q27_SPECIALIZATION',
        optionId: 'skipped',
        skipped: true,
        responseTimeMs: 0,
        timestamp: Date.now()
      };
      onComplete({
        sjtResponses,
        matrixResponses,
        tradeoffResponses,
        specializationResponse: skipRecord
      });
    }
  };

  // Handle SJT choice with tactile feedback
  const handleSelectSjtOption = (optId: string) => {
    if (isAdvancing) return;
    setSelectedOptId(optId);
    setIsAdvancing(true);

    const latency = Date.now() - questionStartTimeRef.current;
    const newRecord: RawDiagnosticResponse = {
      questionId: currentSjt.id,
      optionId: optId,
      responseTimeMs: latency,
      timestamp: Date.now()
    };

    setTimeout(() => {
      const updated = [...sjtResponses.filter(r => r.questionId !== currentSjt.id), newRecord];
      setSjtResponses(updated);

      if (sjtIndex < activeSjtQuestions.length - 1) {
        setSjtIndex(prev => prev + 1);
      } else {
        // Move to Matrix phase
        setPhase('MATRIX');
        setMatrixIndex(0);
      }
    }, 160);
  };

  // Matrix State for current Scenario
  const currentMatrix: MatrixScenario = activeMatrixScenarios[matrixIndex] || activeMatrixScenarios[0];
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
  }, [matrixIndex, phase, degreeTrack]);

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

    if (matrixIndex < activeMatrixScenarios.length - 1) {
      setMatrixIndex(prev => prev + 1);
    } else {
      // Move to Trade-Off phase
      setPhase('TRADEOFF');
      setTradeoffIndex(0);
    }
  };

  // Handle Trade-Off Probe with tactile feedback
  const currentTradeoff: TradeoffProbe = activeTradeoffProbes[tradeoffIndex] || activeTradeoffProbes[0];

  const handleSelectTradeoffOption = (optId: string) => {
    if (isAdvancing) return;
    setSelectedOptId(optId);
    setIsAdvancing(true);

    const latency = Date.now() - questionStartTimeRef.current;
    const newRecord: RawDiagnosticResponse = {
      questionId: currentTradeoff.id,
      optionId: optId,
      responseTimeMs: latency,
      timestamp: Date.now()
    };

    setTimeout(() => {
      const updated = [...tradeoffResponses.filter(r => r.questionId !== currentTradeoff.id), newRecord];
      setTradeoffResponses(updated);

      if (tradeoffIndex < activeTradeoffProbes.length - 1) {
        setTradeoffIndex(prev => prev + 1);
      } else {
        if (isCommerceStream && activeSpecializationQ) {
          setPhase('SPECIALIZATION');
        } else {
          // Completed all behavioral phases!
          onComplete({
            sjtResponses,
            matrixResponses,
            tradeoffResponses: updated
          });
        }
      }
    }, 160);
  };

  // Handle Specialization Option Selection (Q27)
  const handleSelectSpecializationOption = (optId: string) => {
    if (isAdvancing) return;
    setSelectedOptId(optId);
    setIsAdvancing(true);

    const latency = Date.now() - questionStartTimeRef.current;
    const specRecord: RawDiagnosticResponse = {
      questionId: activeSpecializationQ?.questionId || 'Q27_SPECIALIZATION',
      optionId: optId,
      responseTimeMs: latency,
      timestamp: Date.now()
    };

    setTimeout(() => {
      onComplete({
        sjtResponses,
        matrixResponses,
        tradeoffResponses,
        specializationResponse: specRecord
      });
    }, 160);
  };

  // Keyboard accessibility listeners (1-4, a-d, Enter)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || isAdvancing) return;

      const key = e.key.toLowerCase();
      if (phase === 'SJT') {
        const keyIndexMap: Record<string, number> = { '1': 0, 'a': 0, '2': 1, 'b': 1, '3': 2, 'c': 2, '4': 3, 'd': 3 };
        const idx = keyIndexMap[key];
        if (typeof idx === 'number' && shuffledSjtOptions[idx]) {
          e.preventDefault();
          handleSelectSjtOption(shuffledSjtOptions[idx].id);
        }
      } else if (phase === 'MATRIX') {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleNextMatrixScenario();
        }
      } else if (phase === 'TRADEOFF') {
        const keyIndexMap: Record<string, number> = { '1': 0, 'a': 0, '2': 1, 'b': 1 };
        const idx = keyIndexMap[key];
        if (typeof idx === 'number' && currentTradeoff?.options[idx]) {
          e.preventDefault();
          handleSelectTradeoffOption(currentTradeoff.options[idx].id);
        }
      } else if (phase === 'SPECIALIZATION') {
        const keyIndexMap: Record<string, number> = { '1': 0, 'a': 0, '2': 1, 'b': 1, '3': 2, 'c': 2, '4': 3, 'd': 3, '5': 4, 'e': 4, '6': 5, 'f': 5 };
        const idx = keyIndexMap[key];
        if (typeof idx === 'number' && activeSpecializationQ?.options[idx]) {
          e.preventDefault();
          handleSelectSpecializationOption(activeSpecializationQ.options[idx].id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, sjtIndex, matrixIndex, tradeoffIndex, shuffledSjtOptions, currentTradeoff, activeSpecializationQ, isAdvancing, currentMatrixRatings]);

  return (
    <div style={{ flex: 1, padding: '24px 32px', display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto' }}>
      {/* Top Phase Breadcrumb */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <button
          type="button"
          onClick={handleUniversalPrev}
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 8,
            color: 'var(--text-muted, #94a3b8)',
            fontSize: 12,
            fontWeight: 700,
            padding: '6px 14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#f8fafc';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-muted, #94a3b8)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
          }}
        >
          ← Previous Question
        </button>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {/* Degree Stream Badge */}
          <span style={{
            fontSize: 10,
            fontFamily: 'var(--font-mono, monospace)',
            padding: '3px 10px',
            borderRadius: 100,
            fontWeight: 800,
            background: isCommerceStream ? 'rgba(56, 189, 248, 0.12)' : 'rgba(52, 211, 153, 0.12)',
            color: isCommerceStream ? '#38bdf8' : '#34d399',
            border: `1px solid ${isCommerceStream ? 'rgba(56, 189, 248, 0.3)' : 'rgba(52, 211, 153, 0.3)'}`
          }}>
            {isCommerceStream ? 'COMMERCE & FINANCE' : 'ENGINEERING & TECH'}
          </span>

          {/* Phase 1 Badge */}
          <span style={{
            fontSize: 10,
            fontFamily: 'var(--font-mono, monospace)',
            padding: '3px 10px',
            borderRadius: 100,
            fontWeight: 800,
            background: phase === 'SJT' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255,255,255,0.04)',
            color: phase === 'SJT' ? '#a5b4fc' : '#64748b'
          }}>
            1. SCENARIOS ({sjtIndex + 1}/{activeSjtQuestions.length})
          </span>

          {/* Phase 2 Badge */}
          <span style={{
            fontSize: 10,
            fontFamily: 'var(--font-mono, monospace)',
            padding: '3px 10px',
            borderRadius: 100,
            fontWeight: 800,
            background: phase === 'MATRIX' ? 'rgba(20, 184, 166, 0.2)' : 'rgba(255,255,255,0.04)',
            color: phase === 'MATRIX' ? '#5eead4' : '#64748b'
          }}>
            2. FREQUENCY ({matrixIndex + 1}/{activeMatrixScenarios.length})
          </span>

          {/* Phase 3 Badge */}
          <span style={{
            fontSize: 10,
            fontFamily: 'var(--font-mono, monospace)',
            padding: '3px 10px',
            borderRadius: 100,
            fontWeight: 800,
            background: phase === 'TRADEOFF' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255,255,255,0.04)',
            color: phase === 'TRADEOFF' ? '#fcd34d' : '#64748b'
          }}>
            3. TRADEOFFS ({tradeoffIndex + 1}/{activeTradeoffProbes.length})
          </span>

          {/* Phase 4 Badge (Commerce Focus) */}
          {isCommerceStream && activeSpecializationQ && (
            <span style={{
              fontSize: 10,
              fontFamily: 'var(--font-mono, monospace)',
              padding: '3px 10px',
              borderRadius: 100,
              fontWeight: 800,
              background: phase === 'SPECIALIZATION' ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255,255,255,0.04)',
              color: phase === 'SPECIALIZATION' ? '#38bdf8' : '#64748b'
            }}>
              4. FOCUS (Q27)
            </span>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ width: '100%', height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, marginBottom: 20, overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            background: isCommerceStream
              ? 'linear-gradient(90deg, #0284c7 0%, #38bdf8 100%)'
              : 'linear-gradient(90deg, var(--brand, #6366f1) 0%, var(--teal, #14b8a6) 100%)',
            transition: 'width 0.3s ease',
            width: (() => {
              const totalCount = activeSjtQuestions.length + activeMatrixScenarios.length + activeTradeoffProbes.length + (isCommerceStream && activeSpecializationQ ? 1 : 0);
              if (phase === 'SJT') return `${((sjtIndex + 1) / totalCount) * 100}%`;
              if (phase === 'MATRIX') return `${((activeSjtQuestions.length + matrixIndex + 1) / totalCount) * 100}%`;
              if (phase === 'TRADEOFF') return `${((activeSjtQuestions.length + activeMatrixScenarios.length + tradeoffIndex + 1) / totalCount) * 100}%`;
              return '100%';
            })()
          }}
        />
      </div>

      {/* ============================================================== */}
      {/* PHASE 1: SITUATIONAL JUDGEMENT TESTS (SJT)                      */}
      {/* ============================================================== */}
      {phase === 'SJT' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginBottom: 18 }}>
            <span style={{ fontSize: 11, fontFamily: 'var(--font-mono, monospace)', color: isCommerceStream ? '#38bdf8' : 'var(--brand-bright, #818cf8)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>
              {isCommerceStream ? 'COMMERCE & BUSINESS SCENARIO' : 'ENGINEERING & SYSTEMS SCENARIO'} &middot; {sjtIndex + 1} OF {activeSjtQuestions.length}
            </span>
            <h2 style={{ fontSize: 21, fontWeight: 900, color: 'var(--t1, #f8fafc)', letterSpacing: '-0.5px', marginTop: 4, marginBottom: 8 }}>
              {currentSjt.title}
            </h2>
            <div style={{ padding: '14px 18px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, marginBottom: 8 }}>
              <p style={{ fontSize: 13.5, color: '#f1f5f9', lineHeight: 1.6, margin: 0 }}>
                {currentSjt.scenario}
              </p>
            </div>
            <p style={{ fontSize: 12.5, color: '#94a3b8', fontStyle: 'italic', margin: 0 }}>
              💡 {currentSjt.instruction}
            </p>
          </div>

          <h3 style={{ fontSize: 14, fontWeight: 800, color: 'var(--t1, #f8fafc)', marginBottom: 12 }}>
            {currentSjt.prompt}
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1, marginBottom: 20 }}>
            {shuffledSjtOptions.map((opt, idx) => {
              const isSelected = selectedOptId === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  disabled={isAdvancing}
                  onClick={() => handleSelectSjtOption(opt.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 20px',
                    borderRadius: 14,
                    background: isSelected
                      ? isCommerceStream ? 'rgba(56, 189, 248, 0.16)' : 'rgba(99, 102, 241, 0.16)'
                      : 'rgba(255,255,255,0.02)',
                    border: `1.5px solid ${isSelected ? (isCommerceStream ? '#38bdf8' : 'var(--brand-bright, #818cf8)') : 'rgba(255,255,255,0.06)'}`,
                    textAlign: 'left',
                    cursor: isAdvancing ? 'default' : 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: isSelected ? `0 0 16px ${isCommerceStream ? 'rgba(56, 189, 248, 0.3)' : 'rgba(99, 102, 241, 0.3)'}` : 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (!isAdvancing && !isSelected) {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                      e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isAdvancing && !isSelected) {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                      e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      background: isSelected ? (isCommerceStream ? '#38bdf8' : 'var(--brand, #6366f1)') : 'rgba(255,255,255,0.06)',
                      color: isSelected ? '#030508' : '#94a3b8',
                      fontFamily: 'var(--font-mono, monospace)',
                      fontSize: 11,
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {idx + 1}
                    </span>
                    <span style={{ fontSize: 13.5, color: isSelected ? '#ffffff' : '#f1f5f9', lineHeight: 1.5, fontWeight: isSelected ? 700 : 500 }}>
                      {opt.text}
                    </span>
                  </div>
                  <div style={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    border: `2px solid ${isSelected ? (isCommerceStream ? '#38bdf8' : 'var(--brand-bright, #818cf8)') : 'rgba(255,255,255,0.2)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginLeft: 12
                  }}>
                    {isSelected && <div style={{ width: 10, height: 10, borderRadius: '50%', background: isCommerceStream ? '#38bdf8' : 'var(--brand-bright, #818cf8)' }} />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* PHASE 2: BEHAVIORAL FREQUENCY MATRIX                           */}
      {/* ============================================================== */}
      {phase === 'MATRIX' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginBottom: 18 }}>
            <span style={{ fontSize: 11, fontFamily: 'var(--font-mono, monospace)', color: 'var(--teal, #14b8a6)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>
              FREQUENCY PATTERN MATRIX &middot; {matrixIndex + 1} OF {activeMatrixScenarios.length}
            </span>
            <h2 style={{ fontSize: 21, fontWeight: 900, color: 'var(--t1, #f8fafc)', letterSpacing: '-0.5px', marginTop: 4, marginBottom: 8 }}>
              {currentMatrix.title}
            </h2>
            <div style={{ padding: '14px 18px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, marginBottom: 8 }}>
              <p style={{ fontSize: 13.5, color: '#f1f5f9', lineHeight: 1.6, margin: 0 }}>
                {currentMatrix.scenario}
              </p>
            </div>
            <p style={{ fontSize: 12, color: '#94a3b8', fontStyle: 'italic', margin: 0 }}>
              Rate how often you actually do each behavior (1 = Almost never, 5 = Almost always):
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, flex: 1, marginBottom: 24 }}>
            {currentMatrix.items.map((item) => {
              const currentRating = currentMatrixRatings[item.id] || 3;
              return (
                <div
                  key={item.id}
                  style={{
                    padding: '14px 18px',
                    borderRadius: 14,
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10
                  }}
                >
                  <div style={{ fontSize: 13.5, color: '#f1f5f9', lineHeight: 1.5, fontWeight: 600 }}>
                    {item.statement}
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {[1, 2, 3, 4, 5].map((num) => {
                      const isSelected = currentRating === num;
                      const cfg = (MATRIX_SCALE_CONFIG as any)[num];
                      return (
                        <button
                          key={num}
                          type="button"
                          onClick={() => handleRateMatrixItem(item.id, num)}
                          style={{
                            flex: 1,
                            minWidth: 80,
                            padding: '8px 10px',
                            borderRadius: 8,
                            background: isSelected ? 'rgba(20, 184, 166, 0.2)' : 'rgba(255,255,255,0.03)',
                            border: `1px solid ${isSelected ? 'var(--teal, #14b8a6)' : 'rgba(255,255,255,0.08)'}`,
                            color: isSelected ? 'var(--teal, #14b8a6)' : '#94a3b8',
                            fontSize: 11.5,
                            fontWeight: isSelected ? 800 : 600,
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 2
                          }}
                        >
                          <span style={{ fontSize: 13, fontWeight: 900 }}>{num}</span>
                          <span style={{ fontSize: 10 }}>{cfg?.label || ''}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* PHASE 3: TRADE-OFF BALANCING PROBES                            */}
      {/* ============================================================== */}
      {phase === 'TRADEOFF' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginBottom: 18 }}>
            <span style={{ fontSize: 11, fontFamily: 'var(--font-mono, monospace)', color: 'var(--accent-gold, #f59e0b)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>
              TRADE-OFF BALANCING PROBE &middot; {tradeoffIndex + 1} OF {activeTradeoffProbes.length}
            </span>
            <h2 style={{ fontSize: 21, fontWeight: 900, color: 'var(--t1, #f8fafc)', letterSpacing: '-0.5px', marginTop: 4, marginBottom: 8 }}>
              {currentTradeoff.title}
            </h2>
            <div style={{ padding: '14px 18px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, marginBottom: 8 }}>
              <p style={{ fontSize: 13.5, color: '#f1f5f9', lineHeight: 1.6, margin: 0 }}>
                {currentTradeoff.scenario}
              </p>
            </div>
            <p style={{ fontSize: 12.5, color: '#94a3b8', fontStyle: 'italic', margin: 0 }}>
              ⚡ Neither choice is wrong. Choose your genuine operating instinct under pressure.
            </p>
          </div>

          <h3 style={{ fontSize: 14, fontWeight: 800, color: 'var(--t1, #f8fafc)', marginBottom: 12 }}>
            {currentTradeoff.prompt}
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1, marginBottom: 20 }}>
            {currentTradeoff.options.map((opt, idx) => {
              const isSelected = selectedOptId === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  disabled={isAdvancing}
                  onClick={() => handleSelectTradeoffOption(opt.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px 22px',
                    borderRadius: 14,
                    background: isSelected ? 'rgba(245, 158, 11, 0.16)' : 'rgba(255,255,255,0.02)',
                    border: `1.5px solid ${isSelected ? 'var(--accent-gold, #f59e0b)' : 'rgba(255,255,255,0.06)'}`,
                    textAlign: 'left',
                    cursor: isAdvancing ? 'default' : 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: isSelected ? '0 0 16px rgba(245, 158, 11, 0.3)' : 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (!isAdvancing && !isSelected) {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                      e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isAdvancing && !isSelected) {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                      e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <span style={{
                      width: 26,
                      height: 26,
                      borderRadius: '50%',
                      background: isSelected ? 'var(--accent-gold, #f59e0b)' : 'rgba(255,255,255,0.06)',
                      color: isSelected ? '#030508' : '#94a3b8',
                      fontFamily: 'var(--font-mono, monospace)',
                      fontSize: 12,
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {idx === 0 ? 'A' : 'B'}
                    </span>
                    <span style={{ fontSize: 13.5, color: isSelected ? '#ffffff' : '#f1f5f9', lineHeight: 1.5, fontWeight: isSelected ? 700 : 500 }}>
                      {opt.text}
                    </span>
                  </div>
                  <div style={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    border: `2px solid ${isSelected ? 'var(--accent-gold, #f59e0b)' : 'rgba(255,255,255,0.2)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginLeft: 12
                  }}>
                    {isSelected && <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--accent-gold, #f59e0b)' }} />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* PHASE 4: COMMERCE SPECIALIZATION & FOCUS (Q27)                  */}
      {/* ============================================================== */}
      {phase === 'SPECIALIZATION' && activeSpecializationQ && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginBottom: 18 }}>
            <span style={{ fontSize: 11, fontFamily: 'var(--font-mono, monospace)', color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>
              COMMERCE SPECIALIZATION &middot; DOMAIN DEEP-DIVE
            </span>
            <h2 style={{ fontSize: 21, fontWeight: 900, color: 'var(--t1, #f8fafc)', letterSpacing: '-0.5px', marginTop: 4, marginBottom: 8 }}>
              {activeSpecializationQ.title}
            </h2>
            <div style={{ padding: '14px 18px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, marginBottom: 8 }}>
              <p style={{ fontSize: 13.5, color: '#f1f5f9', lineHeight: 1.6, margin: 0 }}>
                {activeSpecializationQ.subtitle}
              </p>
            </div>
            <div style={{ fontSize: 12, color: 'var(--accent, #38bdf8)', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>🎯</span>
              <span>Select the specific challenge or capability that best represents where you want to excel:</span>
            </div>
          </div>

          {/* Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1, marginBottom: 20 }}>
            {activeSpecializationQ.options.map((opt, idx) => {
              const isSelected = selectedOptId === opt.id;
              const isPulsing = isAdvancing && isSelected;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleSelectSpecializationOption(opt.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 18px',
                    borderRadius: 12,
                    background: isSelected ? 'rgba(56, 189, 248, 0.14)' : 'rgba(255,255,255,0.02)',
                    border: `1.5px solid ${isSelected ? '#38bdf8' : 'rgba(255,255,255,0.07)'}`,
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    transform: isPulsing ? 'scale(0.99)' : 'none',
                    boxShadow: isSelected ? '0 0 16px rgba(56, 189, 248, 0.25)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <span style={{
                      width: 26,
                      height: 26,
                      borderRadius: '50%',
                      background: isSelected ? '#38bdf8' : 'rgba(255,255,255,0.06)',
                      color: isSelected ? '#030508' : '#94a3b8',
                      fontFamily: 'var(--font-mono, monospace)',
                      fontSize: 12,
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span style={{ fontSize: 13.5, color: isSelected ? '#ffffff' : '#f1f5f9', lineHeight: 1.5, fontWeight: isSelected ? 700 : 500 }}>
                      {opt.label}
                    </span>
                  </div>
                  <div style={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    border: `2px solid ${isSelected ? '#38bdf8' : 'rgba(255,255,255,0.2)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginLeft: 12
                  }}>
                    {isSelected && <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#38bdf8' }} />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Navigation Footer with the 2 Mandatory Universal Buttons */}
      <div style={{
        paddingTop: 16,
        borderTop: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 12
      }}>
        {/* Universal Button 1: Go back to previous question */}
        <button
          type="button"
          onClick={handleUniversalPrev}
          style={{
            padding: '10px 20px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 10,
            color: '#cbd5e1',
            fontSize: 12.5,
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
            e.currentTarget.style.color = '#ffffff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
            e.currentTarget.style.color = '#cbd5e1';
          }}
        >
          ← Go back to previous question
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Universal Button 2: I don't know / Skip for every question */}
          <button
            type="button"
            onClick={handleUniversalSkip}
            style={{
              padding: '10px 18px',
              background: 'transparent',
              border: '1px dashed rgba(255,255,255,0.2)',
              borderRadius: 10,
              color: 'var(--text-muted, #94a3b8)',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)';
              e.currentTarget.style.color = '#f8fafc';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
              e.currentTarget.style.color = 'var(--text-muted, #94a3b8)';
            }}
          >
            ⏭️ I don't know / Skip
          </button>

          {/* If in Matrix phase, provide explicitly labeled Next Scenario button */}
          {phase === 'MATRIX' && (
            <button
              type="button"
              onClick={handleNextMatrixScenario}
              style={{
                padding: '10px 22px',
                background: 'linear-gradient(135deg, var(--teal, #14b8a6) 0%, #0d9488 100%)',
                border: 'none',
                borderRadius: 10,
                color: '#030508',
                fontSize: 12.5,
                fontWeight: 900,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              {matrixIndex < activeMatrixScenarios.length - 1 ? 'Next Scenario ➔' : 'Proceed to Trade-offs ➔'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
