'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { api } from '@/lib/api/client';
import { toast } from '@/lib/store/useAppStore';
import { useCareerOS } from '@/lib/context/CareerOSContext';
import { stopSpeaking } from '@/lib/tts';
import {
  DYNAMIC_SCENARIO_CATALOG,
  CommunicationScenario,
  getScenariosForContext,
} from '@/lib/missions/communicationScenarios';

interface LinguaLabProps {
  streak: number;
  theme: any;
  activeCourseId?: string;
  role?: string;
}

export default function LinguaLab({ streak, theme, activeCourseId, role }: LinguaLabProps) {
  const { onboardingAnswers, setOnboarding, addXp, earnPins } = useCareerOS();

  const [domainFilter, setDomainFilter] = useState<'all' | 'tech' | 'product' | 'client' | 'commerce' | 'career'>('all');
  const [selectedScenarioIdx, setSelectedScenarioIdx] = useState(0);
  const [userText, setUserText] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<any>(null);
  const [activeRewriteTab, setActiveRewriteTab] = useState<'executive' | 'professional' | 'native'>('executive');
  const [copiedRewrite, setCopiedRewrite] = useState(false);

  // Real Web Speech API Dictation
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Dynamically resolve scenarios matching course and domain filter
  const scenarios = useMemo(() => {
    return getScenariosForContext(activeCourseId || onboardingAnswers?.activeCourseId, domainFilter);
  }, [activeCourseId, onboardingAnswers?.activeCourseId, domainFilter]);

  // Keep scenario index in bounds
  const safeIdx = Math.min(selectedScenarioIdx, scenarios.length - 1);
  const scenario: CommunicationScenario = scenarios[safeIdx] || DYNAMIC_SCENARIO_CATALOG[0];

  // Initialize SpeechRecognition on mount
  useEffect(() => {
    const SpeechRecognition =
      typeof window !== 'undefined'
        ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
        : null;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal || typeof event.results[i].isFinal === 'undefined') {
            transcript += event.results[i][0].transcript;
          }
        }
        if (transcript.trim()) {
          setUserText((prev) => (prev ? `${prev} ${transcript.trim()}` : transcript.trim()));
        }
      };

      recognition.onerror = (err: any) => {
        console.warn('SpeechRecognition error:', err?.error);
        setIsListening(false);
        if (err?.error === 'not-allowed') {
          toast.error('Microphone Denied', 'Please grant microphone access to dictate your response.');
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
    };
  }, []);

  const toggleSpeechRecognition = () => {
    if (!recognitionRef.current) {
      toast.error('Browser Unsupported', 'Web Speech recognition is not supported in this browser. Please type your response.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      toast.success('Voice dictation saved!');
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        toast.info('Listening...', 'Speak clearly into your microphone.');
      } catch (err) {
        console.warn('Recognition start failed:', err);
      }
    }
  };

  const handleNextRandomScenario = () => {
    stopSpeaking();
    setUserText('');
    setEvaluationResult(null);
    const nextIdx = (safeIdx + 1) % scenarios.length;
    setSelectedScenarioIdx(nextIdx);
  };

  const handleEvaluateCorporateComm = async () => {
    if (!userText.trim()) {
      toast.error('Input Required', 'Please type or dictate your response first.');
      return;
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    setIsEvaluating(true);
    setEvaluationResult(null);
    setCopiedRewrite(false);

    try {
      const data = await api.post<any>('/api/communication/evaluate', {
        submission: userText,
        scenario: scenario.title,
        situation: scenario.situation,
        prompt: scenario.prompt,
        category: 'speaking',
        difficulty: scenario.difficulty,
        track: scenario.role,
      });

      setEvaluationResult(data);

      const sessionScore = data.scores?.average ?? 70;
      const isDeflective = data.ratingLabel?.includes('Deflective');

      if (isDeflective) {
        toast.warning('Unprofessional Communication', 'Evasive responses damage executive credibility. Review the coach critique.');
      } else {
        toast.success('Corporate Evaluation Complete! 💼', '+50 XP & +10 Pins awarded.');
        addXp(50, 'Real-World Corporate Communication Session');
        earnPins('communication_session', 10, 'Corporate Communication Practice');
      }

      // Save to CareerOS context history
      const history = onboardingAnswers?.communication_history || [];
      const newSession = {
        id: `sess_${Date.now()}`,
        scenario: scenario.title,
        category: 'speaking' as const,
        score: sessionScore,
        timestamp: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        userSubmission: userText,
        scores: data.scores,
        rewrites: data.rewrites,
        feedback: data.feedback,
      };

      const updatedHistory = [newSession, ...history];
      setOnboarding({
        ...onboardingAnswers,
        communication_history: updatedHistory,
      });

      // Patch score to Supabase database profile
      api.patch('/api/auth/profile', {
        communication_score: sessionScore,
      }).catch(() => {});

      // Sync record into LocalStorage history so 3rd Sub-Tab (Conclusion History) shows it instantly
      try {
        const rawSocratic = typeof window !== 'undefined' ? localStorage.getItem('pinit_socratic_history') : null;
        const parsed = rawSocratic ? JSON.parse(rawSocratic) : [];
        const socraticArr = Array.isArray(parsed) ? parsed : [];
        const newHistoryRecord = {
          id: 'comm_' + Date.now(),
          type: 'corporate_comm',
          title: `Corporate Comm: ${scenario.title}`,
          date: new Date().toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
          avatar: 'priya',
          avatarName: 'Ms. Priya (Comm Coach)',
          qt2Delta: sessionScore >= 85 ? 5 : sessionScore >= 60 ? 2 : -2,
          mindsetArchetype: isDeflective ? 'Reactive Escapist' : sessionScore >= 85 ? 'Executive Diplomat' : 'Emerging Communicator',
          score: sessionScore,
          userSubmission: userText,
          rewrites: data.rewrites,
          report: `### Real-World Corporate Rating: ${sessionScore}/100 (${data.ratingLabel || 'Evaluated'})\n\n**Candidate Submission:**\n"${userText}"\n\n### Executive Rewrites:\n* **Executive C-Suite:** "${data.rewrites?.executive}"\n* **Professional Tone:** "${data.rewrites?.professional}"\n* **Native Speaker:** "${data.rewrites?.native}"\n\n### Coach Critique:\n* **Strong Points:** ${data.feedback?.positive || 'Feedback analyzed.'}\n* **Etiquette Rule:** ${data.feedback?.recommendation || scenario.etiquetteTip}`,
        };
        socraticArr.unshift(newHistoryRecord);
        if (typeof window !== 'undefined') {
          localStorage.setItem('pinit_socratic_history', JSON.stringify(socraticArr));
        }
      } catch (err) {
        console.warn('Failed to write to Socratic history:', err);
      }
    } catch (err: any) {
      toast.error('Evaluation Failed', err.message || 'Could not evaluate corporate communication.');
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleCopyRewrite = (text: string) => {
    if (!text) return;
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        setCopiedRewrite(true);
        toast.success('Rewrite Copied! 📋', 'Copied to clipboard.');
        setTimeout(() => setCopiedRewrite(false), 2000);
      }).catch(() => {
        setCopiedRewrite(true);
        toast.info('Copied!', 'Text ready in clipboard.');
        setTimeout(() => setCopiedRewrite(false), 2000);
      });
    } else {
      setCopiedRewrite(true);
      toast.info('Copied!', 'Text ready.');
      setTimeout(() => setCopiedRewrite(false), 2000);
    }
  };

  const scoreAverage = evaluationResult?.scores?.average ?? 0;
  const scoreColor =
    scoreAverage >= 85 ? 'var(--teal)' : scoreAverage >= 70 ? 'var(--accent)' : scoreAverage >= 50 ? 'var(--amber)' : 'var(--red)';

  return (
    <div
      style={{
        background: theme.bgCard,
        border: `1.5px solid ${theme.border}`,
        borderRadius: 24,
        padding: '28px',
        boxShadow: 'var(--shadow-lg)',
        display: 'flex',
        flexDirection: 'column',
        gap: 22,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
      className="animate-fade-in"
    >
      {/* Header Banner */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: `1px solid ${theme.border}`,
          paddingBottom: 16,
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span
              style={{
                fontSize: 11,
                fontFamily: 'var(--font-mono)',
                fontWeight: 800,
                color: 'var(--accent)',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                background: 'rgba(var(--brand-rgb), 0.1)',
                padding: '3px 9px',
                borderRadius: 6,
                border: '1px solid rgba(var(--brand-rgb), 0.2)',
              }}
            >
              ✨ Real-World Corporate Communication Lab
            </span>
            {activeCourseId && (
              <span
                style={{
                  fontSize: 10.5,
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 800,
                  color: 'var(--teal)',
                  background: 'rgba(20,184,166,0.1)',
                  padding: '3px 8px',
                  borderRadius: 6,
                  border: '1px solid rgba(20,184,166,0.25)',
                  textTransform: 'uppercase',
                }}
              >
                Track: {activeCourseId}
              </span>
            )}
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: theme.tPrimary, margin: '6px 0 0', fontFamily: 'var(--font-display)' }}>
            Workplace Communication Simulator 🎙️
          </h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(var(--warning-rgb), 0.1) 0%, rgba(var(--warning-rgb), 0.03) 100%)',
              border: '1px solid rgba(var(--warning-rgb), 0.25)',
              padding: '8px 16px',
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: '0 2px 8px rgba(var(--warning-rgb), 0.1)',
            }}
          >
            <span style={{ fontSize: 17.5 }}>🔥</span>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--amber)', fontWeight: 800 }}>STREAK</span>
              <span style={{ fontSize: 14.5, fontWeight: 900, color: theme.tPrimary }}>{streak} Days</span>
            </div>
          </div>
        </div>
      </div>

      {/* Domain Category Filter Tabs & Next Scenario Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: '🌐 All' },
            { id: 'tech', label: '💻 Tech & Engineering' },
            { id: 'product', label: '⏱️ Scope & Delivery' },
            { id: 'client', label: '🤝 Stakeholders' },
            { id: 'commerce', label: '📊 Commerce & Audit' },
            { id: 'career', label: '💼 Career & Growth' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setDomainFilter(cat.id as any);
                setSelectedScenarioIdx(0);
                setUserText('');
                setEvaluationResult(null);
              }}
              style={{
                padding: '6px 12px',
                borderRadius: 10,
                border: `1px solid ${domainFilter === cat.id ? 'var(--accent)' : theme.border}`,
                background: domainFilter === cat.id ? 'rgba(var(--brand-rgb), 0.14)' : theme.bgInside,
                color: domainFilter === cat.id ? 'var(--accent)' : theme.tSecondary,
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <button
          onClick={handleNextRandomScenario}
          style={{
            background: 'rgba(20,184,166,0.1)',
            border: '1px solid rgba(20,184,166,0.25)',
            color: 'var(--teal)',
            padding: '7px 14px',
            borderRadius: 10,
            fontSize: 12.5,
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <span>🎲 Next Scenario</span>
          <span style={{ fontSize: 11, opacity: 0.7 }}>({safeIdx + 1}/{scenarios.length})</span>
        </button>
      </div>

      {/* Dynamic Scenario Carousel Pills */}
      <div>
        <label
          style={{
            fontSize: 11.5,
            fontWeight: 800,
            textTransform: 'uppercase',
            color: theme.tTertiary,
            fontFamily: 'var(--font-mono)',
            display: 'block',
            marginBottom: 10,
            letterSpacing: '0.6px',
          }}
        >
          Choose Workplace Issue to Solve:
        </label>
        <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 6 }}>
          {scenarios.map((sc, idx) => {
            const isSelected = safeIdx === idx;
            return (
              <button
                key={sc.id}
                onClick={() => {
                  stopSpeaking();
                  setSelectedScenarioIdx(idx);
                  setUserText('');
                  setEvaluationResult(null);
                }}
                style={{
                  padding: '10px 16px',
                  borderRadius: 14,
                  border: `1.5px solid ${isSelected ? 'var(--accent)' : theme.border}`,
                  background: isSelected
                    ? 'linear-gradient(135deg, rgba(var(--brand-rgb), 0.12) 0%, rgba(var(--brand-rgb), 0.04) 100%)'
                    : theme.bgInside,
                  color: isSelected ? 'var(--accent)' : theme.tSecondary,
                  fontSize: 13,
                  fontWeight: isSelected ? 800 : 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  boxShadow: isSelected ? '0 4px 12px rgba(var(--brand-rgb), 0.15)' : 'none',
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                {sc.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Situation Glassmorphic Card */}
      <div
        style={{
          background: theme.bgInside,
          border: `1.5px solid ${theme.border}`,
          borderRadius: 18,
          padding: 20,
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 800,
                color: 'var(--accent)',
                fontFamily: 'var(--font-mono)',
                textTransform: 'uppercase',
                letterSpacing: '0.8px',
              }}
            >
              Domain Context: {scenario.role}
            </span>
            <span
              style={{
                fontSize: 10,
                fontWeight: 800,
                color: theme.tTertiary,
                fontFamily: 'var(--font-mono)',
                border: `1px solid ${theme.border}`,
                padding: '2px 6px',
                borderRadius: 4,
              }}
            >
              {scenario.difficulty}
            </span>
          </div>
          <span
            style={{
              fontSize: 10.5,
              fontWeight: 800,
              background: 'rgba(var(--accent-teal-rgb), 0.1)',
              color: 'var(--teal)',
              border: '1px solid rgba(var(--accent-teal-rgb), 0.2)',
              padding: '2px 8px',
              borderRadius: 6,
              fontFamily: 'var(--font-mono)',
            }}
          >
            {scenario.badge}
          </span>
        </div>
        <h3 style={{ fontSize: 17.5, fontWeight: 800, color: theme.tPrimary, margin: 0 }}>{scenario.title}</h3>
        <p style={{ fontSize: 14.5, color: theme.tSecondary, margin: 0, lineHeight: 1.55 }}>{scenario.situation}</p>

        <div
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: 'var(--teal)',
            background: 'rgba(var(--accent-teal-rgb), 0.06)',
            padding: '10px 14px',
            borderRadius: 12,
            border: '1px solid rgba(var(--accent-teal-rgb), 0.18)',
            marginTop: 4,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <span>👉</span>
          <span>
            <strong>Your Objective:</strong> {scenario.prompt}
          </span>
        </div>
      </div>

      {/* Input Box & Voice Dictation */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label style={{ fontSize: 13, fontWeight: 800, color: theme.tPrimary }}>
            How would you communicate in real life? (Type or Speak)
          </label>

          <button
            onClick={toggleSpeechRecognition}
            style={{
              background: isListening ? 'rgba(239, 68, 68, 0.12)' : 'rgba(var(--brand-rgb), 0.06)',
              border: `1px solid ${isListening ? 'var(--red)' : 'rgba(var(--brand-rgb), 0.2)'}`,
              color: isListening ? 'var(--red)' : 'var(--accent)',
              fontSize: 12.5,
              fontWeight: 800,
              padding: '6px 14px',
              borderRadius: 10,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              transition: 'all 0.2s',
            }}
          >
            🎙️ {isListening ? 'Listening (Click to Stop)' : 'Speak Your Answer (Voice Dictation)'}
          </button>
        </div>

        {isListening && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              borderRadius: 14,
              padding: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
            }}
          >
            <span
              style={{
                fontSize: 12.5,
                fontWeight: 800,
                color: 'var(--red)',
                fontFamily: 'var(--font-mono)',
                animation: 'pulse 1.5s infinite',
              }}
            >
              🔴 MICROPHONE STREAMING ACTIVE — SPEAK FREELY
            </span>
          </div>
        )}

        <textarea
          value={userText}
          onChange={(e) => setUserText(e.target.value)}
          placeholder={scenario.placeholder}
          rows={4}
          style={{
            width: '100%',
            padding: 16,
            borderRadius: 16,
            background: theme.bgInside,
            border: `1.5px solid ${theme.border}`,
            color: theme.tPrimary,
            fontSize: 15,
            outline: 'none',
            resize: 'vertical',
            lineHeight: 1.6,
            boxSizing: 'border-box',
            fontFamily: 'inherit',
          }}
        />
      </div>

      {/* Primary Action Button */}
      <button
        onClick={handleEvaluateCorporateComm}
        disabled={isEvaluating || !userText.trim()}
        style={{
          width: '100%',
          padding: '16px 0',
          borderRadius: 16,
          border: 'none',
          background: userText.trim() ? 'linear-gradient(90deg, var(--accent) 0%, var(--teal) 100%)' : theme.bgInside,
          color: userText.trim() ? '#fff' : theme.tTertiary,
          fontSize: 15.5,
          fontWeight: 900,
          cursor: userText.trim() ? 'pointer' : 'not-allowed',
          boxShadow: userText.trim() ? '0 6px 20px rgba(var(--brand-rgb), 0.3)' : 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {isEvaluating
          ? '🤖 Analyzing Real-World Impact & Generating Executive Rewrites...'
          : '💼 Check Corporate Communication & Get Executive Rewrites ➔'}
      </button>

      {/* AI Evaluation Results Card */}
      {evaluationResult && (
        <div
          style={{
            background:
              scoreAverage < 50
                ? 'rgba(239, 68, 68, 0.04)'
                : 'linear-gradient(135deg, rgba(var(--accent-teal-rgb), 0.04) 0%, rgba(var(--brand-rgb), 0.02) 100%)',
            border: `1.5px solid ${scoreAverage < 50 ? 'rgba(239, 68, 68, 0.3)' : 'rgba(var(--accent-teal-rgb), 0.22)'}`,
            borderRadius: 20,
            padding: 24,
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
            boxShadow: 'var(--shadow-md)',
          }}
          className="animate-fade-in"
        >
          {/* Rating Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: `1px solid ${theme.border}`,
              paddingBottom: 14,
            }}
          >
            <div>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  color: scoreColor,
                  fontFamily: 'var(--font-mono)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.8px',
                }}
              >
                Real-World Corporate Rating
              </span>
              <h3 style={{ fontSize: 18.5, fontWeight: 900, color: theme.tPrimary, margin: '2px 0 0' }}>
                {evaluationResult.ratingLabel ||
                  (scoreAverage >= 88
                    ? '🌟 Executive C-Suite Ready'
                    : scoreAverage >= 72
                    ? '👍 Corporate Ready'
                    : scoreAverage >= 50
                    ? '✏️ Needs Professional Polish'
                    : '🛑 Unprofessional / Deflective')}
              </h3>
            </div>
            <div
              style={{
                background: `${scoreColor}18`,
                border: `2.5px solid ${scoreColor}`,
                width: 58,
                height: 58,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 20,
                fontWeight: 900,
                color: scoreColor,
                boxShadow: `0 0 16px ${scoreColor}33`,
              }}
            >
              {scoreAverage}
            </div>
          </div>

          {/* Multi-Tier Executive Rewording System */}
          <div style={{ background: theme.bgInside, border: `1px solid ${theme.border}`, borderRadius: 16, padding: 18 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: `1px solid ${theme.border}`,
                paddingBottom: 10,
                marginBottom: 12,
                flexWrap: 'wrap',
                gap: 8,
              }}
            >
              <div style={{ display: 'flex', gap: 6 }}>
                <button
                  onClick={() => setActiveRewriteTab('executive')}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 8,
                    border: 'none',
                    background: activeRewriteTab === 'executive' ? 'var(--accent)' : 'transparent',
                    color: activeRewriteTab === 'executive' ? '#fff' : theme.tSecondary,
                    fontSize: 12,
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  👑 EXECUTIVE C-SUITE
                </button>
                <button
                  onClick={() => setActiveRewriteTab('professional')}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 8,
                    border: 'none',
                    background: activeRewriteTab === 'professional' ? 'var(--accent)' : 'transparent',
                    color: activeRewriteTab === 'professional' ? '#fff' : theme.tSecondary,
                    fontSize: 12,
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  💼 PROFESSIONAL
                </button>
                <button
                  onClick={() => setActiveRewriteTab('native')}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 8,
                    border: 'none',
                    background: activeRewriteTab === 'native' ? 'var(--accent)' : 'transparent',
                    color: activeRewriteTab === 'native' ? '#fff' : theme.tSecondary,
                    fontSize: 12,
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  🗣️ NATIVE SPEAKER
                </button>
              </div>

              <button
                onClick={() => {
                  const targetText =
                    activeRewriteTab === 'executive'
                      ? evaluationResult.rewrites?.executive
                      : activeRewriteTab === 'professional'
                      ? evaluationResult.rewrites?.professional
                      : evaluationResult.rewrites?.native;
                  handleCopyRewrite(targetText);
                }}
                style={{
                  background: copiedRewrite ? 'rgba(var(--success-rgb), 0.1)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${copiedRewrite ? 'var(--teal)' : theme.border}`,
                  color: copiedRewrite ? 'var(--teal)' : theme.tSecondary,
                  fontSize: 12,
                  fontWeight: 700,
                  padding: '4px 10px',
                  borderRadius: 8,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                {copiedRewrite ? '✓ Copied to Clipboard!' : '📋 Copy Rewrite'}
              </button>
            </div>

            <p style={{ fontSize: 15, color: theme.tPrimary, fontWeight: 600, fontStyle: 'italic', margin: 0, lineHeight: 1.6 }}>
              &ldquo;
              {activeRewriteTab === 'executive'
                ? evaluationResult.rewrites?.executive
                : activeRewriteTab === 'professional'
                ? evaluationResult.rewrites?.professional
                : evaluationResult.rewrites?.native}
              &rdquo;
            </p>
          </div>

          {/* Feedback & Etiquette Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
            <div
              style={{
                background: scoreAverage < 50 ? 'rgba(239, 68, 68, 0.06)' : 'rgba(var(--success-rgb), 0.06)',
                border: `1px solid ${scoreAverage < 50 ? 'rgba(239, 68, 68, 0.25)' : 'rgba(var(--success-rgb), 0.2)'}`,
                padding: 14,
                borderRadius: 14,
              }}
            >
              <strong
                style={{
                  color: scoreAverage < 50 ? 'var(--red)' : 'var(--success)',
                  fontSize: 12,
                  textTransform: 'uppercase',
                  fontFamily: 'var(--font-mono)',
                  display: 'block',
                  marginBottom: 4,
                }}
              >
                {scoreAverage < 50 ? '⚠️ Critical Critique' : '✓ Strong Points'}
              </strong>
              <p style={{ fontSize: 13, color: theme.tPrimary, margin: 0, lineHeight: 1.5 }}>
                {evaluationResult.feedback?.positive || 'Feedback analyzed.'}
              </p>
            </div>
            <div
              style={{
                background: 'rgba(var(--warning-rgb), 0.06)',
                border: '1px solid rgba(var(--warning-rgb), 0.2)',
                padding: 14,
                borderRadius: 14,
              }}
            >
              <strong
                style={{
                  color: 'var(--amber)',
                  fontSize: 12,
                  textTransform: 'uppercase',
                  fontFamily: 'var(--font-mono)',
                  display: 'block',
                  marginBottom: 4,
                }}
              >
                💡 Real-World Corporate Etiquette Rule
              </strong>
              <p style={{ fontSize: 13, color: theme.tPrimary, margin: 0, lineHeight: 1.5 }}>
                {evaluationResult.feedback?.recommendation || scenario.etiquetteTip}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
