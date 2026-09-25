// src/app/onboarding/components/GoalDiscoveryStep.tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
  DEGREE_SELECTION_QUESTION,
  getGoalDiscoveryQuestions,
  GoalDiscoveryQuestion
} from '@/lib/onboarding/diagnosticRegistry';

export interface GoalDiscoveryData {
  degreeTrack: string;
  outcome: string;
  role: string;
  secondaryRoles: string[];
  horizonMonths: number;
  motivation: string[];
  exposureLevels: string[];
  capabilitySelfRating: string;
  dailyMinutes: number;
  primaryConstraints: string[];
  toolsUsed?: string[];
  specialization?: string;
  rawGoalText?: string;
  priorExperience?: string;
}

export interface GoalDiscoveryStepProps {
  initialData?: Partial<GoalDiscoveryData> | null;
  onComplete: (data: GoalDiscoveryData) => void;
  onGoBack?: () => void;
  onBack?: () => void;
}

export default function GoalDiscoveryStep({
  initialData,
  onComplete,
  onGoBack,
  onBack
}: GoalDiscoveryStepProps) {
  // Step 0: Degree Selection; Steps 1..8: Goal Discovery questions
  const [currentIdx, setCurrentIdx] = useState(0);

  // Form State
  const [degreeTrack, setDegreeTrack] = useState<string>(initialData?.degreeTrack || 'btech_bca_mca');
  const [outcome, setOutcome] = useState<string>(initialData?.outcome || 'internship');
  const [role, setRole] = useState<string>(initialData?.role || 'full_stack_developer');
  const [secondaryRoles, setSecondaryRoles] = useState<string[]>(initialData?.secondaryRoles || []);
  const [horizonMonths, setHorizonMonths] = useState<number>(initialData?.horizonMonths ?? 6);
  const [motivation, setMotivation] = useState<string[]>(initialData?.motivation || ['career_placement']);
  const [exposureLevels, setExposureLevels] = useState<string[]>(initialData?.exposureLevels || []);
  const [capabilitySelfRating, setCapabilitySelfRating] = useState<string>(initialData?.capabilitySelfRating || 'guided_builder');
  const [dailyMinutes, setDailyMinutes] = useState<number>(initialData?.dailyMinutes ?? 90);
  const [primaryConstraints, setPrimaryConstraints] = useState<string[]>(initialData?.primaryConstraints || []);
  const [toolsUsed, setToolsUsed] = useState<string[]>(initialData?.toolsUsed || []);
  const [specialization, setSpecialization] = useState<string>(initialData?.specialization || '');

  // Tactile feedback state
  const [activePulseOptId, setActivePulseOptId] = useState<string | null>(null);

  // Dynamically assemble question set: Step 0 is ALWAYS degree selection, followed by stream-specific questions
  const streamQuestions = getGoalDiscoveryQuestions(degreeTrack);
  const activeQuestions: GoalDiscoveryQuestion[] = [
    DEGREE_SELECTION_QUESTION,
    ...streamQuestions
  ];

  const currentQ: GoalDiscoveryQuestion = activeQuestions[currentIdx] || activeQuestions[0];
  const isDegreeStep = currentIdx === 0;
  const isCommerceStream = degreeTrack.includes('bcom') || degreeTrack.includes('mcom') || degreeTrack.includes('commerce');
  const isBbaStream = degreeTrack.includes('bba') || degreeTrack.includes('mba') || degreeTrack.includes('management');
  const isGeneralStream = degreeTrack.includes('other') || degreeTrack.includes('general') || degreeTrack.includes('universal') || degreeTrack.includes('non-tech');

  // Handle Advancing to Next Question
  const handleNext = () => {
    if (currentIdx < activeQuestions.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      onComplete({
        degreeTrack,
        outcome,
        role,
        secondaryRoles,
        horizonMonths,
        motivation,
        exposureLevels,
        capabilitySelfRating,
        dailyMinutes,
        primaryConstraints,
        toolsUsed,
        specialization,
        priorExperience: isBbaStream
          ? 'Business & Management'
          : isCommerceStream
          ? 'Commerce & Finance'
          : isGeneralStream
          ? 'Interdisciplinary & General Studies'
          : 'Computer Science / Engineering'
      });
    }
  };

  // Button 1: Go Back to Previous Question
  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(prev => prev - 1);
    } else if (onGoBack) {
      onGoBack();
    } else if (onBack) {
      onBack();
    }
  };

  // Button 2: I Don't Know / Skip Question
  const handleSkip = () => {
    // Apply safe neutral defaults for skipped question so the student is never blocked
    if (isDegreeStep) {
      setDegreeTrack('btech_bca_mca');
    } else if (currentQ.id.includes('STUDY_IDENTITY')) {
      setSpecialization('science_research');
    } else if (currentQ.id.includes('OUTCOME') || currentQ.id.includes('IMMEDIATE_GOAL') || currentQ.id.includes('PRIMARY_OBJECTIVE')) {
      setOutcome('exploring');
    } else if (currentQ.id.includes('ROLE') || currentQ.id.includes('GOAL') || currentQ.id.includes('CAREER_DIRECTION') || currentQ.id.includes('CAREER_CONSIDERATION')) {
      setRole(isBbaStream ? 'management_strategy' : isCommerceStream ? 'accounting_finance' : isGeneralStream ? 'technology' : 'software_engineer');
    } else if (currentQ.id.includes('HORIZON') || currentQ.id.includes('TIMELINE') || currentQ.id.includes('SUCCESS_OUTCOME')) {
      setHorizonMonths(6);
    } else if (currentQ.id.includes('MOTIVATION') || currentQ.id.includes('WORK_INTEREST') || currentQ.id.includes('PROBLEM_AFFINITY')) {
      setMotivation(['exploring']);
    } else if (currentQ.id.includes('EXPERIENCE') || currentQ.id.includes('ARTIFACTS')) {
      setExposureLevels(['none']);
    } else if (currentQ.id.includes('CAPABILITY') || currentQ.id.includes('EXPERIENCE_LEVEL') || currentQ.id.includes('PRACTICAL_ABILITY')) {
      setCapabilitySelfRating(isBbaStream ? 'bba_fresher' : 'beginner_guided');
    } else if (currentQ.id.includes('TOOLS') || currentQ.id.includes('METHODS')) {
      setToolsUsed(['none']);
    } else if (currentQ.id.includes('TIME') || currentQ.id.includes('DAILY_TIME') || currentQ.id.includes('DAILY_AVAILABILITY')) {
      setDailyMinutes(60);
    } else if (currentQ.id.includes('CONSTRAINTS') || currentQ.id.includes('OBSTACLE') || currentQ.id.includes('HARDEST_AREAS')) {
      setPrimaryConstraints(['time_scarcity']);
    } else if (currentQ.id.includes('PROFESSIONAL_CONTEXT') || currentQ.id.includes('WORK_ENVIRONMENT')) {
      setSpecialization('no_experience');
    }

    handleNext();
  };

  // Keyboard Navigation: Enter advances, number keys 1-9 select options
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'Enter') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'Backspace' || e.key === 'ArrowLeft') {
        if (e.altKey || currentIdx > 0) {
          e.preventDefault();
          handlePrev();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIdx, degreeTrack, outcome, role, secondaryRoles, horizonMonths, motivation, exposureLevels, capabilitySelfRating, dailyMinutes, primaryConstraints, toolsUsed]);

  // Multi-select toggle helper
  const toggleMultiSelect = (val: string, currentList: string[], setter: (v: string[]) => void, maxSelections?: number) => {
    if (currentList.includes(val)) {
      setter(currentList.filter(item => item !== val));
    } else {
      if (maxSelections && currentList.length >= maxSelections) {
        setter([...currentList.slice(1), val]);
      } else {
        setter([...currentList, val]);
      }
    }
  };

  // Tactile selection trigger
  const triggerTactile = (optId: string, action: () => void) => {
    setActivePulseOptId(optId);
    setTimeout(() => {
      setActivePulseOptId(null);
      action();
    }, 120);
  };

  const getDegreeBadgeLabel = (track: string) => {
    const norm = (track || '').toLowerCase();
    if (norm.includes('bcom') || norm.includes('mcom') || norm.includes('commerce') || norm.includes('finance')) return 'B.COM / M.COM';
    if (norm.includes('bba') || norm.includes('mba') || norm.includes('management')) return 'BBA / MBA';
    if (norm.includes('other') || norm.includes('general') || norm.includes('universal') || norm.includes('non-tech')) return 'OTHER / GENERAL';
    return 'B.TECH / BCA / MCA';
  };

  return (
    <div style={{ flex: 1, padding: '24px 32px', display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto' }}>
      {/* Top Breadcrumb & Step Indicators */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <button
          type="button"
          onClick={handlePrev}
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
          ← {currentIdx === 0 ? 'Back to Setup' : 'Previous Question'}
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Degree Badge (Shown after Step 0 selection) */}
          {!isDegreeStep && degreeTrack && (
            <span style={{
              fontSize: 11,
              fontFamily: 'var(--font-mono, monospace)',
              color: isBbaStream ? '#f59e0b' : isCommerceStream ? '#38bdf8' : isGeneralStream ? '#c084fc' : '#34d399',
              background: isBbaStream ? 'rgba(245, 158, 11, 0.1)' : isCommerceStream ? 'rgba(56, 189, 248, 0.1)' : isGeneralStream ? 'rgba(192, 132, 252, 0.12)' : 'rgba(52, 211, 153, 0.1)',
              border: `1px solid ${isBbaStream ? 'rgba(245, 158, 11, 0.3)' : isCommerceStream ? 'rgba(56, 189, 248, 0.3)' : isGeneralStream ? 'rgba(192, 132, 252, 0.35)' : 'rgba(52, 211, 153, 0.3)'}`,
              borderRadius: 100,
              padding: '3px 10px',
              fontWeight: 800
            }}>
              {getDegreeBadgeLabel(degreeTrack)}
            </span>
          )}

          <div style={{
            fontSize: 11,
            fontFamily: 'var(--font-mono, monospace)',
            color: 'var(--accent, #38bdf8)',
            background: 'rgba(56, 189, 248, 0.12)',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            borderRadius: 100,
            padding: '3px 12px',
            fontWeight: 800
          }}>
            QUESTION {currentIdx + 1} OF {activeQuestions.length}
          </div>
        </div>
      </div>

      {/* Progress Line */}
      <div style={{ width: '100%', height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, marginBottom: 20, overflow: 'hidden' }}>
        <div
          style={{
            width: `${((currentIdx + 1) / activeQuestions.length) * 100}%`,
            height: '100%',
            background: isBbaStream
              ? 'linear-gradient(90deg, #d97706 0%, #f59e0b 100%)'
              : isCommerceStream
              ? 'linear-gradient(90deg, #0284c7 0%, #38bdf8 100%)'
              : isGeneralStream
              ? 'linear-gradient(90deg, #7c3aed 0%, #c084fc 100%)'
              : 'linear-gradient(90deg, var(--brand, #6366f1) 0%, var(--teal, #14b8a6) 100%)',
            transition: 'width 0.3s ease'
          }}
        />
      </div>

      {/* Question Header */}
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 21, fontWeight: 900, color: 'var(--t1, #f8fafc)', letterSpacing: '-0.5px', marginBottom: 6 }}>
          {currentQ.title}
        </h2>
        <p style={{ fontSize: 13, color: 'var(--t3, #94a3b8)', lineHeight: 1.5 }}>
          {currentQ.subtitle}
        </p>
      </div>

      {/* Options Rendering */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1, marginBottom: 24 }}>
        {/* STEP 0: DEGREE SELECTION */}
        {isDegreeStep && currentQ.options.map(opt => {
          const isSelected = degreeTrack === opt.mappedValue;
          const isPulsing = activePulseOptId === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => {
                triggerTactile(opt.id, () => {
                  setDegreeTrack(opt.mappedValue as string);
                  if (opt.mappedValue === 'bcom_mcom') {
                    setRole('accounting_finance');
                  } else if (opt.mappedValue === 'bba_mba') {
                    setRole('management_strategy');
                  } else if (opt.mappedValue === 'other') {
                    setRole('technology');
                    setSpecialization('science_research');
                  } else {
                    setRole('full_stack_developer');
                  }
                  setTimeout(handleNext, 140);
                });
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                borderRadius: 14,
                background: isSelected ? 'rgba(56, 189, 248, 0.12)' : 'rgba(255,255,255,0.02)',
                border: `1.5px solid ${isSelected ? '#38bdf8' : 'rgba(255,255,255,0.07)'}`,
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                transform: isPulsing ? 'scale(0.99)' : 'none',
                boxShadow: isSelected ? '0 0 16px rgba(56, 189, 248, 0.2)' : 'none'
              }}
            >
              <div>
                <div style={{ fontSize: 14.5, fontWeight: 800, color: isSelected ? '#38bdf8' : '#f8fafc' }}>
                  {opt.label}
                </div>
                {opt.description && (
                  <div style={{ fontSize: 12, color: 'var(--t3, #94a3b8)', marginTop: 3 }}>
                    {opt.description}
                  </div>
                )}
              </div>
              <div style={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                border: `2px solid ${isSelected ? '#38bdf8' : 'rgba(255,255,255,0.2)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {isSelected && <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#38bdf8' }} />}
              </div>
            </button>
          );
        })}

        {/* STEP: GENERAL STUDY FIELD / SPECIALIZATION */}
        {!isDegreeStep && currentQ.id === 'Q1_GEN_STUDY_IDENTITY' && currentQ.options.map(opt => {
          const isSelected = specialization === opt.mappedValue;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => {
                triggerTactile(opt.id, () => {
                  setSpecialization(opt.mappedValue as string);
                  setTimeout(handleNext, 140);
                });
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '13px 18px',
                borderRadius: 12,
                background: isSelected ? 'rgba(192, 132, 252, 0.12)' : 'rgba(255,255,255,0.02)',
                border: `1.5px solid ${isSelected ? '#c084fc' : 'rgba(255,255,255,0.06)'}`,
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 800, color: isSelected ? '#c084fc' : '#f8fafc' }}>{opt.label}</div>
                {opt.description && <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{opt.description}</div>}
              </div>
              <div style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${isSelected ? '#c084fc' : 'rgba(255,255,255,0.2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {isSelected && <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#c084fc' }} />}
              </div>
            </button>
          );
        })}

        {/* STEP 1: CAREER GOAL / ROLE SELECTION */}
        {!isDegreeStep && (currentQ.id === 'Q1_OUTCOME' || currentQ.id === 'Q2_COMMERCE_OUTCOME' || currentQ.id === 'Q2_BBA_IMMEDIATE_GOAL' || currentQ.id === 'Q2_GEN_PRIMARY_OBJECTIVE') && currentQ.options.map(opt => {
          const isSelected = outcome === opt.mappedValue;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => {
                triggerTactile(opt.id, () => {
                  setOutcome(opt.mappedValue as string);
                  setTimeout(handleNext, 140);
                });
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 18px',
                borderRadius: 12,
                background: isSelected ? 'rgba(56, 189, 248, 0.1)' : 'rgba(255,255,255,0.02)',
                border: `1.5px solid ${isSelected ? 'var(--accent, #38bdf8)' : 'rgba(255,255,255,0.06)'}`,
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: isSelected ? 'var(--accent, #38bdf8)' : '#f8fafc' }}>
                  {opt.label}
                </div>
                {opt.description && <div style={{ fontSize: 11.5, color: '#94a3b8', marginTop: 2 }}>{opt.description}</div>}
              </div>
              <div style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${isSelected ? 'var(--accent, #38bdf8)' : 'rgba(255,255,255,0.2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {isSelected && <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--accent, #38bdf8)' }} />}
              </div>
            </button>
          );
        })}

        {/* STEP 2: PRIMARY ROLE / COMMERCE GOAL / BBA DIRECTION / GENERAL CAREER */}
        {!isDegreeStep && (currentQ.id === 'Q2_PRIMARY_ROLE' || currentQ.id === 'Q1_COMMERCE_GOAL' || currentQ.id === 'Q1_BBA_CAREER_DIRECTION' || currentQ.id === 'Q3_GEN_CAREER_CONSIDERATION') && currentQ.options.map(opt => {
          const isSelected = role === opt.mappedValue;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => {
                triggerTactile(opt.id, () => {
                  setRole(opt.mappedValue as string);
                  setTimeout(handleNext, 140);
                });
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 18px',
                borderRadius: 12,
                background: isSelected ? 'rgba(129, 140, 248, 0.12)' : 'rgba(255,255,255,0.02)',
                border: `1.5px solid ${isSelected ? 'var(--brand-bright, #818cf8)' : 'rgba(255,255,255,0.06)'}`,
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 800, color: isSelected ? 'var(--brand-bright, #818cf8)' : '#f8fafc' }}>{opt.label}</div>
                {opt.description && <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{opt.description}</div>}
              </div>
              <div style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${isSelected ? 'var(--brand-bright, #818cf8)' : 'rgba(255,255,255,0.2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {isSelected && <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--brand-bright, #818cf8)' }} />}
              </div>
            </button>
          );
        })}

        {/* STEP: GENERAL SUCCESS OUTCOME (6–12 MONTHS) */}
        {!isDegreeStep && currentQ.id === 'Q4_GEN_SUCCESS_OUTCOME' && currentQ.options.map(opt => {
          const isSelected = secondaryRoles.includes(opt.mappedValue as string);
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => {
                triggerTactile(opt.id, () => {
                  setSecondaryRoles([opt.mappedValue as string]);
                  setTimeout(handleNext, 140);
                });
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '13px 18px',
                borderRadius: 12,
                background: isSelected ? 'rgba(56, 189, 248, 0.12)' : 'rgba(255,255,255,0.02)',
                border: `1.5px solid ${isSelected ? '#38bdf8' : 'rgba(255,255,255,0.06)'}`,
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 800, color: isSelected ? '#38bdf8' : '#f8fafc' }}>{opt.label}</div>
                {opt.description && <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{opt.description}</div>}
              </div>
              <div style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${isSelected ? '#38bdf8' : 'rgba(255,255,255,0.2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {isSelected && <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#38bdf8' }} />}
              </div>
            </button>
          );
        })}

        {/* STEP: GENERAL MOTIVATION PROFILE (MULTI-SELECT UP TO 3) */}
        {!isDegreeStep && currentQ.id === 'Q5_GEN_MOTIVATION_PROFILE' && (
          <div>
            <div style={{ fontSize: 11.5, color: '#94a3b8', marginBottom: 10 }}>
              Select up to 3 motivations ({motivation.length}/3 selected):
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 8 }}>
              {currentQ.options.map(opt => {
                const isSelected = motivation.includes(opt.mappedValue as string);
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => toggleMultiSelect(opt.mappedValue as string, motivation, setMotivation, 3)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      borderRadius: 10,
                      background: isSelected ? 'rgba(245, 158, 11, 0.12)' : 'rgba(255,255,255,0.02)',
                      border: `1.5px solid ${isSelected ? '#f59e0b' : 'rgba(255,255,255,0.06)'}`,
                      textAlign: 'left',
                      cursor: 'pointer'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 12.5, fontWeight: 700, color: isSelected ? '#f59e0b' : '#f8fafc' }}>{opt.label}</div>
                      {opt.description && <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{opt.description}</div>}
                    </div>
                    <span style={{ fontSize: 13, color: '#f59e0b' }}>{isSelected ? '✓' : ''}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP: GENERAL GOAL CERTAINTY (1–5) */}
        {!isDegreeStep && currentQ.id === 'Q6_GEN_GOAL_CERTAINTY' && currentQ.options.map(opt => {
          const isSelected = horizonMonths === Number(opt.mappedValue);
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => {
                triggerTactile(opt.id, () => {
                  setHorizonMonths(Number(opt.mappedValue));
                  setTimeout(handleNext, 140);
                });
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 18px',
                borderRadius: 12,
                background: isSelected ? 'rgba(99, 102, 241, 0.12)' : 'rgba(255,255,255,0.02)',
                border: `1.5px solid ${isSelected ? '#818cf8' : 'rgba(255,255,255,0.06)'}`,
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: isSelected ? '#818cf8' : '#f8fafc' }}>{opt.label}</div>
                {opt.description && <div style={{ fontSize: 11.5, color: '#94a3b8', marginTop: 2 }}>{opt.description}</div>}
              </div>
              <div style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${isSelected ? '#818cf8' : 'rgba(255,255,255,0.2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {isSelected && <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#818cf8' }} />}
              </div>
            </button>
          );
        })}

        {/* STEP 3: HORIZON / TIMELINE */}
        {!isDegreeStep && (currentQ.id === 'Q3_HORIZON' || currentQ.id === 'Q3_COMMERCE_TIMELINE' || currentQ.id === 'Q3_BBA_TIME_HORIZON') && currentQ.options.map(opt => {
          const isSelected = horizonMonths === Number(opt.mappedValue);
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => {
                triggerTactile(opt.id, () => {
                  setHorizonMonths(Number(opt.mappedValue));
                  setTimeout(handleNext, 140);
                });
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 18px',
                borderRadius: 12,
                background: isSelected ? 'rgba(20, 184, 166, 0.12)' : 'rgba(255,255,255,0.02)',
                border: `1.5px solid ${isSelected ? 'var(--teal, #14b8a6)' : 'rgba(255,255,255,0.06)'}`,
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: isSelected ? 'var(--teal, #14b8a6)' : '#f8fafc' }}>{opt.label}</div>
                {opt.description && <div style={{ fontSize: 11.5, color: '#94a3b8', marginTop: 2 }}>{opt.description}</div>}
              </div>
              <div style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${isSelected ? 'var(--teal, #14b8a6)' : 'rgba(255,255,255,0.2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {isSelected && <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--teal, #14b8a6)' }} />}
              </div>
            </button>
          );
        })}

        {/* STEP 4: MOTIVATION / WORK INTEREST / BBA PROBLEM AFFINITY (SINGLE SELECT) */}
        {!isDegreeStep && (currentQ.id === 'Q4_MOTIVATION' || currentQ.id === 'Q4_COMMERCE_WORK_INTEREST' || currentQ.id === 'Q4_BBA_PROBLEM_AFFINITY') && currentQ.options.map(opt => {
          const isSelected = motivation.includes(opt.mappedValue as string);
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => {
                triggerTactile(opt.id, () => {
                  setMotivation([opt.mappedValue as string]);
                  setTimeout(handleNext, 140);
                });
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 18px',
                borderRadius: 12,
                background: isSelected ? 'rgba(245, 158, 11, 0.12)' : 'rgba(255,255,255,0.02)',
                border: `1.5px solid ${isSelected ? 'var(--accent-gold, #f59e0b)' : 'rgba(255,255,255,0.06)'}`,
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: isSelected ? 'var(--accent-gold, #f59e0b)' : '#f8fafc' }}>{opt.label}</div>
                {opt.description && <div style={{ fontSize: 11.5, color: '#94a3b8', marginTop: 2 }}>{opt.description}</div>}
              </div>
              <div style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${isSelected ? 'var(--accent-gold, #f59e0b)' : 'rgba(255,255,255,0.2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {isSelected && <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--accent-gold, #f59e0b)' }} />}
              </div>
            </button>
          );
        })}

        {/* STEP 5: PRIOR EXPERIENCE / ARTIFACTS / OUTSIDE CLASSROOM (MULTI-SELECT) */}
        {!isDegreeStep && (currentQ.id === 'Q5_EXPERIENCE' || currentQ.id === 'Q5_COMMERCE_EXPERIENCE' || currentQ.id === 'Q5_BBA_EXPOSURE_ARTIFACTS' || currentQ.id === 'Q5_BBA_EXPERIENCE_ARTIFACTS' || currentQ.id === 'Q8_GEN_EXPERIENCE_OUTSIDE') && (
          <div>
            <div style={{ fontSize: 11.5, color: '#94a3b8', marginBottom: 10 }}>
              Select all that apply to you:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 8 }}>
              {currentQ.options.map(opt => {
                const isSelected = exposureLevels.includes(opt.mappedValue as string);
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => toggleMultiSelect(opt.mappedValue as string, exposureLevels, setExposureLevels)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      borderRadius: 10,
                      background: isSelected ? 'rgba(56, 189, 248, 0.12)' : 'rgba(255,255,255,0.02)',
                      border: `1.5px solid ${isSelected ? '#38bdf8' : 'rgba(255,255,255,0.06)'}`,
                      textAlign: 'left',
                      cursor: 'pointer'
                    }}
                  >
                    <span style={{ fontSize: 12.5, fontWeight: 600, color: isSelected ? '#38bdf8' : '#f8fafc' }}>{opt.label}</span>
                    <span style={{ fontSize: 13, color: '#38bdf8' }}>{isSelected ? '✓' : ''}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 6: CAPABILITY / EXPERIENCE LEVEL / PRACTICAL ABILITY */}
        {!isDegreeStep && (currentQ.id === 'Q6_CAPABILITY' || currentQ.id === 'Q6_COMMERCE_CAPABILITY' || currentQ.id === 'Q6_BBA_EXPERIENCE_LEVEL' || currentQ.id === 'Q6_BBA_ACTUAL_LEVEL' || currentQ.id === 'Q7_GEN_PRACTICAL_ABILITY') && currentQ.options.map(opt => {
          const isSelected = capabilitySelfRating === opt.mappedValue;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => {
                triggerTactile(opt.id, () => {
                  setCapabilitySelfRating(opt.mappedValue as string);
                  setTimeout(handleNext, 140);
                });
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 18px',
                borderRadius: 12,
                background: isSelected ? 'rgba(99, 102, 241, 0.12)' : 'rgba(255,255,255,0.02)',
                border: `1.5px solid ${isSelected ? 'var(--brand, #6366f1)' : 'rgba(255,255,255,0.06)'}`,
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: isSelected ? 'var(--brand, #6366f1)' : '#f8fafc' }}>{opt.label}</div>
                {opt.description && <div style={{ fontSize: 11.5, color: '#94a3b8', marginTop: 2 }}>{opt.description}</div>}
              </div>
              <div style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${isSelected ? 'var(--brand, #6366f1)' : 'rgba(255,255,255,0.2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {isSelected && <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--brand, #6366f1)' }} />}
              </div>
            </button>
          );
        })}

        {/* STEP 7: TOOLS PROFICIENCY (COMMERCE, BBA & GENERAL) */}
        {!isDegreeStep && (currentQ.id === 'Q7_COMMERCE_TOOLS' || currentQ.id === 'Q7_BBA_TOOLS_USED' || currentQ.id === 'Q9_GEN_TOOLS_METHODS') && (
          <div>
            <div style={{ fontSize: 11.5, color: '#94a3b8', marginBottom: 10 }}>
              Select tools and methods you have actually used:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 8 }}>
              {currentQ.options.map(opt => {
                const isSelected = toolsUsed.includes(opt.mappedValue as string);
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => toggleMultiSelect(opt.mappedValue as string, toolsUsed, setToolsUsed)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 14px',
                      borderRadius: 10,
                      background: isSelected ? 'rgba(56, 189, 248, 0.12)' : 'rgba(255,255,255,0.02)',
                      border: `1.5px solid ${isSelected ? '#38bdf8' : 'rgba(255,255,255,0.06)'}`,
                      textAlign: 'left',
                      cursor: 'pointer'
                    }}
                  >
                    <span style={{ fontSize: 12.5, fontWeight: 600, color: isSelected ? '#38bdf8' : '#f8fafc' }}>{opt.label}</span>
                    <span style={{ fontSize: 13, color: '#38bdf8' }}>{isSelected ? '✓' : ''}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP: DAILY TIME (TECH Q7, COMMERCE Q8, BBA Q9, GENERAL Q11) */}
        {!isDegreeStep && (currentQ.id === 'Q7_DAILY_TIME' || currentQ.id === 'Q8_COMMERCE_DAILY_TIME' || currentQ.id === 'Q9_BBA_DAILY_TIME' || currentQ.id === 'Q11_GEN_DAILY_AVAILABILITY') && currentQ.options.map(opt => {
          const isSelected = dailyMinutes === Number(opt.mappedValue);
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => {
                triggerTactile(opt.id, () => {
                  setDailyMinutes(Number(opt.mappedValue));
                  setTimeout(handleNext, 140);
                });
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 18px',
                borderRadius: 12,
                background: isSelected ? 'rgba(20, 184, 166, 0.12)' : 'rgba(255,255,255,0.02)',
                border: `1.5px solid ${isSelected ? 'var(--teal, #14b8a6)' : 'rgba(255,255,255,0.06)'}`,
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: isSelected ? 'var(--teal, #14b8a6)' : '#f8fafc' }}>{opt.label}</div>
                {opt.description && <div style={{ fontSize: 11.5, color: '#94a3b8', marginTop: 2 }}>{opt.description}</div>}
              </div>
              <div style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${isSelected ? 'var(--teal, #14b8a6)' : 'rgba(255,255,255,0.2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {isSelected && <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--teal, #14b8a6)' }} />}
              </div>
            </button>
          );
        })}

        {/* STEP: PRIMARY CONSTRAINTS / OBSTACLES (TECH Q8 MAX 3, BBA Q8 MAX 2, GENERAL Q10 MAX 3) */}
        {!isDegreeStep && (currentQ.id === 'Q8_PRIMARY_CONSTRAINTS' || currentQ.id === 'Q8_BBA_PRIMARY_OBSTACLE' || currentQ.id === 'Q8_BBA_BIGGEST_OBSTACLE' || currentQ.id === 'Q10_GEN_HARDEST_AREAS') && (
          <div>
            <div style={{ fontSize: 11, color: 'var(--t3, #94a3b8)', marginBottom: 8, fontStyle: 'italic' }}>
              Selected: {primaryConstraints.length} / {currentQ.id.includes('BBA') ? '2' : '3'} max
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {currentQ.options.map(opt => {
                const isSelected = primaryConstraints.includes(opt.mappedValue as string);
                const maxAllowed = currentQ.id.includes('BBA') ? 2 : 3;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => toggleMultiSelect(opt.mappedValue as string, primaryConstraints, setPrimaryConstraints, maxAllowed)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      borderRadius: 12,
                      background: isSelected ? 'rgba(239, 68, 68, 0.14)' : 'rgba(255,255,255,0.02)',
                      border: `1.5px solid ${isSelected ? '#f87171' : 'rgba(255,255,255,0.06)'}`,
                      textAlign: 'left',
                      cursor: 'pointer'
                    }}
                  >
                    <span style={{ fontSize: 13, fontWeight: 700, color: isSelected ? '#f87171' : '#f8fafc' }}>{opt.label}</span>
                    <span style={{ fontSize: 13, color: '#f87171' }}>{isSelected ? '✓' : ''}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP: PROFESSIONAL CONTEXT ADAPTATION (BBA Q34) */}
        {!isDegreeStep && (currentQ.id === 'Q34_BBA_PROFESSIONAL_CONTEXT' || currentQ.id === 'Q34_BBA_WORK_ENVIRONMENT_EXPERIENCE') && currentQ.options.map(opt => {
          const isSelected = specialization === opt.mappedValue;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => {
                triggerTactile(opt.id, () => {
                  setSpecialization(opt.mappedValue as string);
                  setTimeout(handleNext, 140);
                });
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 18px',
                borderRadius: 12,
                background: isSelected ? 'rgba(56, 189, 248, 0.12)' : 'rgba(255,255,255,0.02)',
                border: `1.5px solid ${isSelected ? '#38bdf8' : 'rgba(255,255,255,0.06)'}`,
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: isSelected ? '#38bdf8' : '#f8fafc' }}>{opt.label}</div>
                {opt.description && <div style={{ fontSize: 11.5, color: '#94a3b8', marginTop: 2 }}>{opt.description}</div>}
              </div>
              <div style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${isSelected ? '#38bdf8' : 'rgba(255,255,255,0.2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {isSelected && <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#38bdf8' }} />}
              </div>
            </button>
          );
        })}

        {/* UNIVERSAL FALLBACK: Guarantees ANY unmapped or stream-specific question renders cleanly */}
        {!isDegreeStep && 
          !currentQ.id.includes('_GEN_') &&
          currentQ.id !== 'Q1_OUTCOME' && currentQ.id !== 'Q2_COMMERCE_OUTCOME' && currentQ.id !== 'Q2_BBA_IMMEDIATE_GOAL' &&
          currentQ.id !== 'Q2_PRIMARY_ROLE' && currentQ.id !== 'Q1_COMMERCE_GOAL' && currentQ.id !== 'Q1_BBA_CAREER_DIRECTION' &&
          currentQ.id !== 'Q3_HORIZON' && currentQ.id !== 'Q3_COMMERCE_TIMELINE' && currentQ.id !== 'Q3_BBA_TIME_HORIZON' &&
          currentQ.id !== 'Q4_MOTIVATION' && currentQ.id !== 'Q4_COMMERCE_WORK_INTEREST' && currentQ.id !== 'Q4_BBA_PROBLEM_AFFINITY' &&
          currentQ.id !== 'Q5_EXPERIENCE' && currentQ.id !== 'Q5_COMMERCE_EXPERIENCE' && currentQ.id !== 'Q5_BBA_EXPOSURE_ARTIFACTS' && currentQ.id !== 'Q5_BBA_EXPERIENCE_ARTIFACTS' &&
          currentQ.id !== 'Q6_CAPABILITY' && currentQ.id !== 'Q6_COMMERCE_CAPABILITY' && currentQ.id !== 'Q6_BBA_EXPERIENCE_LEVEL' && currentQ.id !== 'Q6_BBA_ACTUAL_LEVEL' &&
          currentQ.id !== 'Q7_COMMERCE_TOOLS' && currentQ.id !== 'Q7_BBA_TOOLS_USED' &&
          currentQ.id !== 'Q7_DAILY_TIME' && currentQ.id !== 'Q8_COMMERCE_DAILY_TIME' && currentQ.id !== 'Q9_BBA_DAILY_TIME' &&
          currentQ.id !== 'Q8_PRIMARY_CONSTRAINTS' && currentQ.id !== 'Q8_BBA_PRIMARY_OBSTACLE' && currentQ.id !== 'Q8_BBA_BIGGEST_OBSTACLE' &&
          currentQ.id !== 'Q34_BBA_PROFESSIONAL_CONTEXT' && currentQ.id !== 'Q34_BBA_WORK_ENVIRONMENT_EXPERIENCE' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {currentQ.options.map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    triggerTactile(opt.id, () => {
                      setTimeout(handleNext, 140);
                    });
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 18px',
                    borderRadius: 12,
                    background: 'rgba(255,255,255,0.02)',
                    border: '1.5px solid rgba(255,255,255,0.07)',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#f8fafc' }}>{opt.label}</div>
                    {opt.description && <div style={{ fontSize: 11.5, color: '#94a3b8', marginTop: 2 }}>{opt.description}</div>}
                  </div>
                </button>
              ))}
            </div>
        )}
      </div>

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
          onClick={handlePrev}
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
            onClick={handleSkip}
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

          {/* Continue / Next Button */}
          <button
            type="button"
            onClick={handleNext}
            style={{
              padding: '10px 24px',
              background: isBbaStream
                ? 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)'
                : isCommerceStream
                ? 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)'
                : isGeneralStream
                ? 'linear-gradient(135deg, #7c3aed 0%, #c084fc 100%)'
                : 'linear-gradient(135deg, var(--brand, #6366f1) 0%, var(--teal, #14b8a6) 100%)',
              border: 'none',
              borderRadius: 10,
              color: '#030508',
              fontSize: 12.5,
              fontWeight: 900,
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            {currentIdx === activeQuestions.length - 1 ? 'Proceed to Behavioral Assessment ➔' : 'Continue ➔'}
          </button>
        </div>
      </div>
    </div>
  );
}
