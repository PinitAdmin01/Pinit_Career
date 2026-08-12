'use client';

import React, { useState, useEffect } from 'react';
import { portalService } from '@/lib/services/portalService';

interface Question {
  id: string;
  questionText: string;
  options: string[];
}

interface AssignedExam {
  id: string;
  title: string;
  subject: string;
  durationMins: number;
  totalQuestions: number;
  status: 'pending' | 'completed';
  score?: number;
  questions: Question[];
}

export default function StudentExamPortal() {
  const [exams] = useState<AssignedExam[]>([
    {
      id: 'e1',
      title: 'Mid-Term Assessment: Algorithms & Complexity',
      subject: 'Data Structures',
      durationMins: 30,
      totalQuestions: 5,
      status: 'pending',
      questions: [
        { id: 'q1', questionText: 'What is the average time complexity of QuickSort?', options: ['O(N)', 'O(N log N)', 'O(N^2)', 'O(1)'] },
        { id: 'q2', questionText: 'Which data structure is optimal for Dijkstra\'s shortest path algorithm?', options: ['Queue', 'Min-Priority Queue', 'Stack', 'Array'] }
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
  ]);

  const [activeExam, setActiveExam] = useState<AssignedExam | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [tabSwitches, setTabSwitches] = useState(0);
  const [examSubmitted, setExamSubmitted] = useState(false);

  // Monitor tab switches for exam integrity & dispatch to FraudInspector bridge
  useEffect(() => {
    if (!activeExam || examSubmitted) return;
    const handleVisibility = () => {
      if (document.hidden) {
        setTabSwitches(prev => {
          const nextCount = prev + 1;
          // Dispatch live fraud alert to portalService so Admin FraudInspector receives it
          portalService.dispatchFraudAlert({
            studentName: 'Rahul Sharma (Student)',
            examTitle: activeExam.title,
            tabSwitches: nextCount,
            ipAddress: '192.168.1.15',
            trustScoreImpact: nextCount > 3 ? -20 : -5,
            severity: nextCount > 5 ? 'high' : 'medium'
          });
          return nextCount;
        });
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [activeExam, examSubmitted]);

  function submitExam() {
    setExamSubmitted(true);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {!activeExam ? (
        <>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0, color: 'var(--t1, #0f172a)' }}>📝 Online Exams & Proctored Tests</h2>
            <p style={{ margin: '4px 0 0', fontSize: 14, color: 'var(--t3, #64748b)' }}>Take assigned mid-terms, quizzes, and practical assessments with instant evaluation.</p>
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
                    <span style={{ fontSize: 12, color: '#64748b' }}>⏱️ {exam.durationMins} Mins</span>
                  </div>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>{exam.title}</h3>
                  <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>{exam.subject}</p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: 12 }}>
                  {exam.status === 'completed' ? (
                    <span style={{ fontSize: 14, fontWeight: 800, color: '#16a34a' }}>Score: {exam.score}%</span>
                  ) : (
                    <span style={{ fontSize: 13, color: '#64748b' }}>{exam.totalQuestions} Questions</span>
                  )}

                  {exam.status === 'pending' && (
                    <button
                      onClick={() => { setActiveExam(exam); setAnswers({}); setTabSwitches(0); setExamSubmitted(false); }}
                      style={{ padding: '6px 14px', borderRadius: 6, border: 'none', background: '#3b82f6', color: '#fff', fontWeight: 600, cursor: 'pointer' }}
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
        /* Active Exam Taking Interface */
        <div style={{ background: '#fff', padding: 24, borderRadius: 16, border: '1px solid #cbd5e1', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: 16 }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>{activeExam.title}</h2>
              <span style={{ fontSize: 13, color: '#64748b' }}>{activeExam.subject} • Proctored Assessment</span>
            </div>

            {tabSwitches > 0 && (
              <div style={{ background: '#fee2e2', color: '#dc2626', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
                ⚠️ Warning: {tabSwitches} Tab Switch(es) Logged & Sent to Proctor
              </div>
            )}
          </div>

          {!examSubmitted ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {activeExam.questions.map((q, idx) => (
                <div key={q.id} style={{ background: 'var(--bg3)', padding: 16, borderRadius: 10, border: '1px solid var(--border)' }}>
                  <h4 style={{ margin: '0 0 12px', fontSize: 15, fontWeight: 700 }}>{idx + 1}. {q.questionText}</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    {q.options.map((opt, optIdx) => (
                      <button
                        key={optIdx}
                        onClick={() => setAnswers({ ...answers, [q.id]: optIdx })}
                        style={{
                          padding: '10px 14px',
                          borderRadius: 8,
                          border: `2px solid ${answers[q.id] === optIdx ? '#3b82f6' : '#cbd5e1'}`,
                          background: answers[q.id] === optIdx ? '#eff6ff' : '#fff',
                          color: answers[q.id] === optIdx ? '#1d4ed8' : '#334155',
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
                  style={{ padding: '10px 24px', borderRadius: 8, border: 'none', background: '#16a34a', color: '#fff', fontWeight: 700, cursor: 'pointer' }}
                >
                  ✓ Submit Final Answers
                </button>
              </div>
            </div>
          ) : (
            /* Exam Submitted Result Screen */
            <div style={{ textAlign: 'center', padding: 32 }}>
              <span style={{ fontSize: 48 }}>🎉</span>
              <h2 style={{ margin: '12px 0 4px', fontSize: 24, fontWeight: 800 }}>Assessment Completed!</h2>
              <p style={{ color: '#64748b', fontSize: 14 }}>Your answers have been submitted securely to your instructor.</p>
              
              <div style={{ fontSize: 36, fontWeight: 900, color: '#2563eb', margin: '20px 0' }}>Score: 85%</div>

              <button
                onClick={() => setActiveExam(null)}
                style={{ padding: '10px 24px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}
              >
                Back to Exam List
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
