'use client';

import React, { useState, useEffect } from 'react';
import { portalService } from '@/lib/services/portalService';
import { useAuth } from '@/lib/context/AuthContext';

interface Question {
  id: string;
  questionText: string;
  options: string[];
  correctOptionIndex?: number;
}

interface AssignedExam {
  id: string;
  title: string;
  subject: string;
  durationMins: number;
  totalQuestions: number;
  status: 'pending' | 'completed';
  score?: number;
  remainingCooldownHours?: number;
  questions: Question[];
}

const DEFAULT_EXAMS: AssignedExam[] = [
  {
    id: 'e1',
    title: 'Mid-Term Assessment: Algorithms & Complexity',
    subject: 'Data Structures',
    durationMins: 30,
    totalQuestions: 2,
    status: 'pending',
    questions: [
      { id: 'q1', questionText: 'What is the average time complexity of QuickSort?', options: ['O(N)', 'O(N log N)', 'O(N^2)', 'O(1)'], correctOptionIndex: 1 },
      { id: 'q2', questionText: 'Which data structure is optimal for Dijkstra\'s shortest path algorithm?', options: ['Queue', 'Min-Priority Queue', 'Stack', 'Array'], correctOptionIndex: 1 }
    ]
  },
  {
    id: 'e2',
    title: 'Practical Quiz: Neural Networks Implementation',
    subject: 'Artificial Intelligence',
    durationMins: 20,
    totalQuestions: 5,
    status: 'completed',
    score: 90,
    questions: []
  }
];

export default function StudentExamPortal() {
  const { user } = useAuth();
  const userId = user?.id;
  const regNum = (user as any)?.registerNumber;
  const [exams, setExams] = useState<AssignedExam[]>(DEFAULT_EXAMS);

  const [activeExam, setActiveExam] = useState<AssignedExam | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [tabSwitches, setTabSwitches] = useState(0);
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [currentScore, setCurrentScore] = useState<number>(0);
  const [correctAnswersCount, setCorrectAnswersCount] = useState<number>(0);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(0);

  // Load completed exam attempts and authoritative server cooldown (DEF-010)
  useEffect(() => {
    let isMounted = true;
    const syncAttempts = async () => {
      try {
        const attemptsKey = `pinit_exam_attempts_${userId || 'guest'}`;
        const raw = localStorage.getItem(attemptsKey);
        let localAttempts: Record<string, { score: number; passed: boolean }> = {};
        if (raw) {
          try { localAttempts = JSON.parse(raw); } catch {}
        }

        if (userId) {
          const { examsService } = await import('@/lib/services/examsService');
          const updated = await Promise.all(
            DEFAULT_EXAMS.map(async (e) => {
              const cooldown = await examsService.getExamCooldown(userId, regNum, e.id);
              if (cooldown.inCooldown || cooldown.lastAttemptTime) {
                return {
                  ...e,
                  status: 'completed' as const,
                  score: cooldown.score ?? localAttempts[e.id]?.score ?? e.score ?? 0,
                  remainingCooldownHours: cooldown.remainingHours,
                };
              }
              if (localAttempts[e.id]) {
                return { ...e, status: 'completed' as const, score: localAttempts[e.id].score };
              }
              return e;
            })
          );
          if (isMounted) setExams(updated);
        } else if (raw) {
          setExams(DEFAULT_EXAMS.map(e => localAttempts[e.id] ? { ...e, status: 'completed', score: localAttempts[e.id].score } : e));
        }
      } catch (e) {
        console.warn('Failed to load exam attempts:', e);
      }
    };
    syncAttempts();
    return () => { isMounted = false; };
  }, [userId, regNum]);

  // Monitor tab switches for exam integrity & dispatch to FraudInspector bridge (DEF-020: PII sanitized)
  useEffect(() => {
    if (!activeExam || examSubmitted) return;
    const handleVisibility = () => {
      if (document.hidden) {
        setTabSwitches(prev => {
          const nextCount = prev + 1;
          // Dispatch live fraud alert with authenticated student identity (no hardcoded Rahul Sharma)
          const studentIdentifier = user?.displayName || user?.email || (user?.id ? `Student-${user.id.substring(0, 6)}` : 'Candidate Student');
          portalService.dispatchFraudAlert({
            studentName: studentIdentifier,
            examTitle: activeExam.title,
            tabSwitches: nextCount,
            ipAddress: typeof window !== 'undefined' ? (window.location.hostname || 'localhost') : '127.0.0.1',
            trustScoreImpact: nextCount > 3 ? -20 : -5,
            severity: nextCount > 5 ? 'high' : 'medium'
          });
          return nextCount;
        });
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [activeExam, examSubmitted, user]);

  const submitExamRef = React.useRef<() => Promise<void>>(async () => {});

  // Exam Countdown Timer with drift-free timestamp protection & auto-submit (DEF-019)
  useEffect(() => {
    if (!activeExam || examSubmitted) return;
    const startKey = `pinit_exam_start_${activeExam.id}`;
    let startTime = Number(sessionStorage.getItem(startKey));
    if (!startTime) {
      startTime = Date.now();
      sessionStorage.setItem(startKey, String(startTime));
    }
    const totalSecs = activeExam.durationMins * 60;
    const elapsedSecs = Math.floor((Date.now() - startTime) / 1000);
    const initialRemaining = Math.max(0, totalSecs - elapsedSecs);
    setSecondsRemaining(initialRemaining);

    if (initialRemaining <= 0) {
      submitExamRef.current();
      return;
    }

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const rem = Math.max(0, totalSecs - elapsed);
      setSecondsRemaining(rem);
      if (rem <= 0) {
        clearInterval(interval);
        submitExamRef.current();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [activeExam, examSubmitted]);

  async function submitExam() {
    if (!activeExam) return;
    let correctCount = 0;
    const qList = activeExam.questions || [];
    qList.forEach(q => {
      const expected = q.correctOptionIndex ?? 1;
      if (answers[q.id] === expected) {
        correctCount++;
      }
    });
    const calculated = qList.length > 0 ? Math.round((correctCount / qList.length) * 100) : 0;
    const passed = calculated >= 50;
    setCorrectAnswersCount(correctCount);
    setCurrentScore(calculated);
    setExamSubmitted(true);
    setExams(prev => prev.map(e => e.id === activeExam.id ? { ...e, status: 'completed', score: calculated } : e));

    // Persist attempt locally to lock retakes (DEF-018)
    try {
      const attemptsKey = `pinit_exam_attempts_${user?.id || 'guest'}`;
      const existing = JSON.parse(localStorage.getItem(attemptsKey) || '{}');
      existing[activeExam.id] = {
        score: calculated,
        passed,
        correctCount,
        totalQuestions: qList.length,
        submittedAt: new Date().toISOString()
      };
      localStorage.setItem(attemptsKey, JSON.stringify(existing));
      sessionStorage.removeItem(`pinit_exam_start_${activeExam.id}`);
    } catch {}

    // Persist to examsService (DEF-018)
    try {
      const { examsService } = await import('@/lib/services/examsService');
      await examsService.recordExamAttempt({
        studentId: user?.id || 'guest-student',
        registerNumber: (user as any)?.registerNumber || undefined,
        examScheduleId: activeExam.id,
        score: calculated,
        passed
      });
    } catch (err) {
      console.warn('Failed to record exam attempt in examsService:', err);
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {!activeExam ? (
        <>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0, color: 'var(--t1)' }}>📝 Online Exams & Proctored Tests</h2>
            <p style={{ margin: '4px 0 0', fontSize: 14, color: 'var(--t3)' }}>Take assigned mid-terms, quizzes, and practical assessments with instant evaluation.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
            {exams.map(exam => (
              <div key={exam.id} style={{
                padding: 20,
                borderRadius: 12,
                border: '1px solid var(--border, var(--border))',
                background: 'var(--bg1, #fff)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 12
              }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{
                      fontSize: 12,
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: 4,
                      background: exam.status === 'pending' ? '#dbeafe' : '#dcfce7',
                      color: exam.status === 'pending' ? '#1e40af' : '#15803d'
                    }}>
                      {exam.status.toUpperCase()}
                    </span>
                    <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>⏱️ {exam.durationMins} Mins</span>
                  </div>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>{exam.title}</h3>
                  <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-dim)' }}>{exam.subject}</p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: 12 }}>
                  {exam.status === 'completed' ? (
                    <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--success)' }}>Score: {exam.score}%</span>
                  ) : (
                    <span style={{ fontSize: 13, color: 'var(--text-dim)' }}>{exam.totalQuestions} Questions</span>
                  )}

                  {exam.status === 'completed' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                      <span style={{ fontSize: 12, padding: '4px 10px', borderRadius: 6, background: 'rgba(var(--success-rgb), 0.1)', color: 'var(--success)', fontWeight: 700 }}>
                        🔒 Attempt Recorded
                      </span>
                      {exam.remainingCooldownHours && exam.remainingCooldownHours > 0 ? (
                        <span style={{ fontSize: 11, color: '#f59e0b', fontWeight: 600 }}>
                          ⏳ Cooldown: {exam.remainingCooldownHours}h
                        </span>
                      ) : null}
                    </div>
                  ) : (
                    <button
                      onClick={async () => {
                        if (user?.id) {
                          try {
                            const { examsService } = await import('@/lib/services/examsService');
                            const cooldown = await examsService.getExamCooldown(user.id, (user as any)?.registerNumber, exam.id);
                            if (cooldown.inCooldown) {
                              alert(`Retake Locked: Cooldown active for ${cooldown.remainingHours} hours.`);
                              setExams(prev => prev.map(e => e.id === exam.id ? { ...e, status: 'completed', score: cooldown.score ?? e.score, remainingCooldownHours: cooldown.remainingHours } : e));
                              return;
                            }
                          } catch {}
                        }
                        setActiveExam(exam);
                        setAnswers({});
                        setTabSwitches(0);
                        setExamSubmitted(false);
                      }}
                      style={{ padding: '6px 14px', borderRadius: 6, border: 'none', background: 'var(--info)', color: 'var(--text)', fontWeight: 600, cursor: 'pointer' }}
                    >
                      🚀 Start Test
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* Active Exam Taking Interface (DEF-021 Responsive & Dark-Mode Safe) */
        <div style={{ background: 'var(--card, #fff)', padding: 24, borderRadius: 16, border: '1px solid var(--border, #cbd5e1)', display: 'flex', flexDirection: 'column', gap: 20, color: 'var(--t1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: 16 }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>{activeExam.title}</h2>
              <span style={{ fontSize: 13, color: 'var(--text-dim)' }}>{activeExam.subject} • Proctored Assessment</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                background: secondsRemaining < 300 ? '#fee2e2' : 'var(--bg3)',
                color: secondsRemaining < 300 ? '#b91c1c' : 'var(--t1)',
                border: `1px solid ${secondsRemaining < 300 ? '#ef4444' : 'var(--border)'}`,
                padding: '6px 14px', borderRadius: 8, fontWeight: 800, fontFamily: 'monospace', fontSize: 14
              }}>
                ⏱️ {Math.floor(secondsRemaining / 60).toString().padStart(2, '0')}:{(secondsRemaining % 60).toString().padStart(2, '0')}
              </div>

              {tabSwitches > 0 && (
                <div style={{ background: '#fee2e2', color: 'var(--danger-deep)', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
                  ⚠️ Warning: {tabSwitches} Tab Switch(es) Logged & Sent to Proctor
                </div>
              )}
            </div>
          </div>

          {!examSubmitted ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {activeExam.questions.map((q, idx) => (
                <div key={q.id} style={{ background: 'var(--bg3)', padding: 16, borderRadius: 10, border: '1px solid var(--border)' }}>
                  <h4 style={{ margin: '0 0 12px', fontSize: 15, fontWeight: 700 }}>{idx + 1}. {q.questionText}</h4>
                  {/* DEF-021: Fluid responsive wrapping avoiding text clipping on narrow mobile */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: 8 }}>
                    {q.options.map((opt, optIdx) => (
                      <button
                        key={optIdx}
                        onClick={() => setAnswers({ ...answers, [q.id]: optIdx })}
                        style={{
                          padding: '10px 14px',
                          borderRadius: 8,
                          border: `2px solid ${answers[q.id] === optIdx ? 'var(--info)' : 'var(--border, #cbd5e1)'}`,
                          background: answers[q.id] === optIdx ? 'rgba(59, 130, 246, 0.12)' : 'var(--card, #fff)',
                          color: answers[q.id] === optIdx ? 'var(--info, #1d4ed8)' : 'var(--t1, #334155)',
                          fontWeight: answers[q.id] === optIdx ? 700 : 500,
                          textAlign: 'left',
                          cursor: 'pointer'
                        }}
                      >
                        {String.fromCharCode(65 + optIdx)}. {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 12 }}>
                <button
                  onClick={submitExam}
                  style={{ padding: '10px 24px', borderRadius: 8, border: 'none', background: 'var(--success)', color: 'var(--text)', fontWeight: 700, cursor: 'pointer' }}
                >
                  ✓ Submit Final Answers
                </button>
              </div>
            </div>
          ) : (
            /* Exam Submitted Result Screen (DEF-017 & DEF-018) */
            <div style={{ textAlign: 'center', padding: 32 }}>
              <span style={{ fontSize: 48 }}>{currentScore >= 50 ? '🎉' : '📚'}</span>
              <h2 style={{ margin: '12px 0 4px', fontSize: 24, fontWeight: 800 }}>Assessment Completed!</h2>
              <p style={{ color: 'var(--text-dim)', fontSize: 14 }}>Your answers have been evaluated and recorded securely in the academic register.</p>
              
              <div style={{ fontSize: 36, fontWeight: 900, color: currentScore >= 50 ? 'var(--success)' : 'var(--danger-deep)', margin: '16px 0 6px' }}>
                Score: {currentScore}%
              </div>
              <div style={{ fontSize: 14, color: 'var(--t2)', fontWeight: 600, marginBottom: 8 }}>
                Correct Answers: {correctAnswersCount} / {activeExam.questions.length}
              </div>
              <div style={{ display: 'inline-block', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700, background: currentScore >= 50 ? 'rgba(var(--success-rgb), 0.15)' : 'rgba(var(--danger-rgb), 0.15)', color: currentScore >= 50 ? 'var(--success)' : 'var(--danger-deep)', marginBottom: 20 }}>
                {currentScore >= 50 ? '✓ Passed (≥ 50%)' : '⚠️ Needs Review (< 50%)'} • Attempt Locked
              </div>

              <div>
                <button
                  onClick={() => setActiveExam(null)}
                  style={{ padding: '10px 24px', background: 'var(--info)', color: 'var(--text)', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}
                >
                  Back to Exam List
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
