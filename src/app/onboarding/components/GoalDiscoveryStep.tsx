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
  initialData?: Partial<GoalDiscoveryData>;
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
        priorExperience: isCommerceStream ? 'Commerce & Finance' : 'Computer Science / Engineering'
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
    } else if (currentQ.id.includes('OUTCOME')) {
      setOutcome('exploring');
    } else if (currentQ.id.includes('ROLE') || currentQ.id.includes('GOAL')) {
      setRole(isCommerceStream ? 'accounting_finance' : 'software_engineer');
    } else if (currentQ.id.includes('HORIZON') || currentQ.id.includes('TIMELINE')) {
      setHorizonMonths(6);
    } else if (currentQ.id.includes('MOTIVATION') || currentQ.id.includes('WORK_INTEREST')) {
      setMotivation(['exploring']);
    } else if (currentQ.id.includes('EXPERIENCE')) {
      setExposureLevels(['none']);
    } else if (currentQ.id.includes('CAPABILITY')) {
      setCapabilitySelfRating('beginner_guided');
    } else if (currentQ.id.includes('TOOLS')) {
      setToolsUsed(['none']);
    } else if (currentQ.id.includes('TIME') || currentQ.id.includes('DAILY_TIME')) {
      setDailyMinutes(60);
    } else if (currentQ.id.includes('CONSTRAINTS')) {
      setPrimaryConstraints(['time_scarcity']);
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
    if (norm === 'other') return 'OTHER / GENERAL';
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
              color: isCommerceStream ? '#38bdf8' : '#34d399',
              background: isCommerceStream ? 'rgba(56, 189, 248, 0.1)' : 'rgba(52, 211, 153, 0.1)',
              border: `1px solid ${isCommerceStream ? 'rgba(56, 189, 248, 0.3)' : 'rgba(52, 211, 153, 0.3)'}`,
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
            background: isCommerceStream
              ? 'linear-gradient(90deg, #0284c7 0%, #38bdf8 100%)'
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

        {/* STEP 1: CAREER GOAL / ROLE SELECTION */}
        {!isDegreeStep && (currentQ.id === 'Q1_OUTCOME' || currentQ.id === 'Q2_COMMERCE_OUTCOME') && currentQ.options.map(opt => {
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

        {/* STEP 2: PRIMARY ROLE / COMMERCE GOAL */}
        {!isDegreeStep && (currentQ.id === 'Q2_PRIMARY_ROLE' || currentQ.id === 'Q1_COMMERCE_GOAL') && currentQ.options.map(opt => {
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

        {/* STEP 3: HORIZON / TIMELINE */}
        {!isDegreeStep && (currentQ.id === 'Q3_HORIZON' || currentQ.id === 'Q3_COMMERCE_TIMELINE') && currentQ.options.map(opt => {
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

        {/* STEP 4: MOTIVATION / WORK INTEREST */}
        {!isDegreeStep && (currentQ.id === 'Q4_MOTIVATION' || currentQ.id === 'Q4_COMMERCE_WORK_INTEREST') && currentQ.options.map(opt => {
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
              <div style={{ fontSize: 13.5, fontWeight: 700, color: isSelected ? 'var(--accent-gold, #f59e0b)' : '#f8fafc' }}>{opt.label}</div>
              <div style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${isSelected ? 'var(--accent-gold, #f59e0b)' : 'rgba(255,255,255,0.2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {isSelected && <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--accent-gold, #f59e0b)' }} />}
              </div>
            </button>
          );
        })}

        {/* STEP 5: PRIOR EXPERIENCE (MULTI-SELECT) */}
        {!isDegreeStep && (currentQ.id === 'Q5_EXPERIENCE' || currentQ.id === 'Q5_COMMERCE_EXPERIENCE') && (
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

        {/* STEP 6: CAPABILITY SELF RATING */}
        {!isDegreeStep && (currentQ.id === 'Q6_CAPABILITY' || currentQ.id === 'Q6_COMMERCE_CAPABILITY') && currentQ.options.map(opt => {
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

        {/* STEP 7: TOOLS PROFICIENCY (COMMERCE) */}
        {!isDegreeStep && currentQ.id === 'Q7_COMMERCE_TOOLS' && (
          <div>
            <div style={{ fontSize: 11.5, color: '#94a3b8', marginBottom: 10 }}>
              Select tools you have actually opened or worked with:
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

        {/* STEP 7 (TECH): TIME / STEP 8 (COMMERCE): DAILY TIME */}
        {!isDegreeStep && (currentQ.id === 'Q7_DAILY_TIME' || currentQ.id === 'Q8_COMMERCE_DAILY_TIME') && currentQ.options.map(opt => {
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

        {/* STEP 8 (TECH): PRIMARY CONSTRAINTS (MAX 3) */}
        {!isDegreeStep && currentQ.id === 'Q8_PRIMARY_CONSTRAINTS' && (
          <div>
            <div style={{ fontSize: 11, color: 'var(--t3, #94a3b8)', marginBottom: 8, fontStyle: 'italic' }}>
              Selected: {primaryConstraints.length} / 3 max
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {currentQ.options.map(opt => {
                const isSelected = primaryConstraints.includes(opt.mappedValue as string);
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => toggleMultiSelect(opt.mappedValue as string, primaryConstraints, setPrimaryConstraints, 3)}
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

        {/* UNIVERSAL FALLBACK: Guarantees ANY unmapped or stream-specific question renders cleanly */}
        {!isDegreeStep && 
          currentQ.id !== 'Q1_OUTCOME' && currentQ.id !== 'Q2_COMMERCE_OUTCOME' &&
          currentQ.id !== 'Q2_PRIMARY_ROLE' && currentQ.id !== 'Q1_COMMERCE_GOAL' &&
          currentQ.id !== 'Q3_HORIZON' && currentQ.id !== 'Q3_COMMERCE_TIMELINE' &&
          currentQ.id !== 'Q4_MOTIVATION' && currentQ.id !== 'Q4_COMMERCE_WORK_INTEREST' &&
          currentQ.id !== 'Q5_EXPERIENCE' && currentQ.id !== 'Q5_COMMERCE_EXPERIENCE' &&
          currentQ.id !== 'Q6_CAPABILITY' && currentQ.id !== 'Q6_COMMERCE_CAPABILITY' &&
          currentQ.id !== 'Q7_COMMERCE_TOOLS' &&
          currentQ.id !== 'Q7_DAILY_TIME' && currentQ.id !== 'Q8_COMMERCE_DAILY_TIME' &&
          currentQ.id !== 'Q8_PRIMARY_CONSTRAINTS' && (
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
              background: isCommerceStream
                ? 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)'
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
