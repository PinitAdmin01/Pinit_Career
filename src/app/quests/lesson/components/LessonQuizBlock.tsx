import React from 'react';
import { toast } from '@/lib/store/useAppStore';

interface LessonQuizBlockProps {
  teacherAccent: string;
  examPassed: boolean;
  examQuestionIndex: number;
  setExamQuestionIndex: React.Dispatch<React.SetStateAction<number>>;
  selectedMcqAnswer: number | null;
  setSelectedMcqAnswer: (val: number | null) => void;
  mcqChecked: boolean;
  setMcqChecked: (val: boolean) => void;
  mcqIsCorrect: boolean;
  setMcqIsCorrect: (val: boolean) => void;
  setExamPassed: (val: boolean) => void;
  playChime: () => void;
  launchConfetti: () => void;
  dynamicQuestions: any[];
  questTitle: string;
}

export function LessonQuizBlock({
  teacherAccent,
  examPassed,
  examQuestionIndex,
  setExamQuestionIndex,
  selectedMcqAnswer,
  setSelectedMcqAnswer,
  mcqChecked,
  setMcqChecked,
  mcqIsCorrect,
  setMcqIsCorrect,
  setExamPassed,
  playChime,
  launchConfetti,
  dynamicQuestions,
  questTitle,
}: LessonQuizBlockProps) {
  if (examPassed) {
    return (
      <div style={{ textAlign: 'center', padding: '16px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 40 }}>🎓</span>
        <h3 style={{ fontSize: 16, fontWeight: 900, color: 'var(--green)' }}>Syllabus Exam Passed!</h3>
        <p style={{ fontSize: 12, color: 'var(--t2)', lineHeight: 1.45, maxWidth: 500, margin: '0 auto' }}>
          Excellent job! You successfully completed the conceptual review and answered all evaluation questions correctly.
        </p>
      </div>
    );
  }

  const canonicalBenchmarkQuestions = [
    {
      question: `Canonical Production Benchmark Q4: In a high-throughput enterprise service, what is the optimal architectural rule for ${questTitle}?`,
      options: [
        `Utilize fast indexed lookups O(1)/O(log N) while managing memory cache overhead cleanly.`,
        `Create uncached raw arrays on every request without checking heap boundaries.`,
        `Disable exception handling to suppress error outputs.`
      ],
      answerIndex: 0,
      explanation: `Enterprise production architecture requires fast O(1)/O(log N) lookup speeds while controlling memory allocations.`
    },
    {
      question: `Canonical System Safety Q5: What is the primary safety rule to prevent runtime null-pointer or memory-leak crashes?`,
      options: [
        `Enforce strict non-null input validation checks and clean resource deallocation before payload return.`,
        `Hide runtime exceptions behind silent try-catch blocks without logging.`,
        `Return dummy 0-byte arrays without tracing the root cause.`
      ],
      answerIndex: 0,
      explanation: `Robust system design requires non-null validation checks, explicit resource cleanup, and detailed error logging.`
    }
  ];

  const hybridExamQuestions = [
    ...dynamicQuestions.slice(0, 3),
    ...canonicalBenchmarkQuestions
  ];

  const question = hybridExamQuestions[examQuestionIndex];
  if (!question) {
    return (
      <div style={{ textAlign: 'center', padding: '12px 0' }}>
        <p style={{ fontSize: 11.5, color: 'var(--t3)' }}>Loading exam questions...</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, textAlign: 'left' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4 style={{ fontSize: 14, fontWeight: 900, color: teacherAccent }}>Syllabus Evaluation Exam</h4>
        <span style={{ fontSize: 10.5, color: 'var(--t3)', fontFamily: 'var(--font-mono)' }}>
          Question {examQuestionIndex + 1} of {hybridExamQuestions.length} ({examQuestionIndex < 3 ? 'AI Dynamic' : 'Canonical Benchmark'})
        </span>
      </div>

      <div style={{
        background: 'var(--accent-light)',
        border: '1px solid var(--border)',
        borderRadius: 16,
        padding: 16,
        boxShadow: 'var(--shadow-sm)'
      }}>
        <p style={{ fontSize: 12, fontWeight: 800, color: 'var(--t1)', marginBottom: 12 }}>
          ❓ {question.question}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {question.options.map((option: string, oIdx: number) => {
            const isSelected = selectedMcqAnswer === oIdx;
            let stateClass = "";
            if (isSelected) stateClass = "selected";
            if (mcqChecked) {
              if (isSelected && oIdx === question.answerIndex) {
                stateClass = "correct";
              } else if (isSelected) {
                stateClass = "incorrect";
              }
            }
            return (
              <button
                key={oIdx}
                data-testid={`mcq-option-${oIdx}`}
                disabled={mcqChecked}
                onClick={() => setSelectedMcqAnswer(oIdx)}
                className={`mcq-option-btn ${stateClass}`}
                style={{
                  textAlign: 'left',
                  padding: '10px 14px',
                  fontSize: 11.5
                }}
              >
                {option}
              </button>
            );
          })}
        </div>

        {!mcqChecked && selectedMcqAnswer !== null && (
          <button
            data-testid="btn-verify-mcq"
            onClick={() => {
              setMcqChecked(true);
              const correct = selectedMcqAnswer === question.answerIndex;
              setMcqIsCorrect(correct);
              if (correct) {
                toast.success("Correct Answer! 🎯", "Conceptual breakdown unlocked below.");
              } else {
                toast.error("Incorrect Choice ⚠️", "Review the concept breakdown below and retry.");
              }
            }}
            className="btn-primary"
            style={{
              padding: '10px 20px',
              fontSize: 12,
              borderRadius: 10,
              background: teacherAccent
            }}
          >
            Verify Choice ➔
          </button>
        )}

        {mcqChecked && (
          <div style={{ marginTop: 8 }}>
            {mcqIsCorrect ? (
              <div>
                <div style={{
                  background: 'rgba(var(--success-rgb),  0.08)',
                  border: '1px solid rgba(var(--success-rgb),  0.3)',
                  borderRadius: 10,
                  padding: 12,
                  fontSize: 11.5,
                  color: 'var(--t1)',
                  lineHeight: 1.5,
                  marginBottom: 12
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 800, color: 'var(--success)', marginBottom: 4 }}>
                    <span>🎯</span>
                    <span>Concept Mastery & Optimal Principle:</span>
                  </div>
                  <div style={{ color: 'var(--t2)', fontSize: 11 }}>
                    {question.explanation || "This solution directly satisfies the architectural requirement and prevents common memory or runtime degradation."}
                  </div>
                </div>
                <button
                  data-testid="btn-next-question"
                  onClick={() => {
                    if (examQuestionIndex + 1 === hybridExamQuestions.length) {
                      setExamPassed(true);
                      playChime();
                      launchConfetti();
                      toast.success("Exam Passed!", "Congratulations on completing the syllabus review.");
                    } else {
                      setExamQuestionIndex(prev => prev + 1);
                      setSelectedMcqAnswer(null);
                      setMcqChecked(false);
                      setMcqIsCorrect(false);
                    }
                  }}
                  className="btn-primary"
                  style={{
                    padding: '8px 18px',
                    fontSize: 11,
                    borderRadius: 8,
                    background: 'var(--green)'
                  }}
                >
                  {examQuestionIndex + 1 === hybridExamQuestions.length ? 'Finish Exam 🎓' : 'Next Question →'}
                </button>
              </div>
            ) : (
              <div>
                <div style={{
                  background: 'rgba(var(--danger-rgb),  0.08)',
                  border: '1px solid rgba(var(--danger-rgb),  0.3)',
                  borderRadius: 10,
                  padding: 12,
                  fontSize: 11.5,
                  color: 'var(--t1)',
                  lineHeight: 1.5,
                  marginBottom: 12
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 800, color: 'var(--danger)', marginBottom: 4 }}>
                    <span>⚠️</span>
                    <span>Why this choice is suboptimal:</span>
                  </div>
                  <div style={{ color: 'var(--t2)', fontSize: 11, marginBottom: 8 }}>
                    The selected option fails to enforce safety invariants or violates algorithmic constraints for this topic.
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, color: 'var(--warning)', fontSize: 10.5 }}>
                    <span>💡 Mental Model Hint:</span>
                    <span>{question.explanation ? question.explanation.slice(0, 90) + '...' : 'Review the core slide concepts and consider the safest architectural invariant.'}</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedMcqAnswer(null);
                    setMcqChecked(false);
                  }}
                  className="btn-primary"
                  style={{
                    padding: '8px 18px',
                    fontSize: 11,
                    borderRadius: 8,
                    background: 'var(--danger)'
                  }}
                >
                  🔄 Try Again
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
