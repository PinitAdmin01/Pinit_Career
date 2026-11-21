import React, { useRef, useEffect } from 'react';
import { toast } from '@/lib/store/useAppStore';
import { createMcqVelocityTracker } from '@/lib/trust/antiCheatingCheckers';
import { recordCheatingIncident } from '@/lib/trust/trustEngine';

export function getExplanationText(explanation: any): string {
  if (!explanation) return '';
  if (typeof explanation === 'string') return explanation;
  if (typeof explanation === 'object') {
    return (
      explanation.errorExplanation ||
      explanation.recoveryPath?.simplerExplanation ||
      explanation.recoveryPath?.guidedFixPrompt ||
      explanation.explanation ||
      explanation.message ||
      ''
    );
  }
  return String(explanation);
}

interface LessonQuizBlockProps {
  teacherAccent: string;
  examPassed: boolean;
  examFailed: boolean;
  setExamFailed: (val: boolean) => void;
  examCorrectCount: number;
  setExamCorrectCount: React.Dispatch<React.SetStateAction<number>>;
  /** Records the option chosen for each question, in order. */
  setExamAnswers?: React.Dispatch<React.SetStateAction<(number | null)[]>>;
  onReviewLesson: () => void;
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
  /** Heading above the questions, e.g. "Quick check" or "Test: Days 1–5". */
  quizTitle?: string;
}

export function LessonQuizBlock({
  teacherAccent,
  examPassed,
  examFailed,
  setExamFailed,
  examCorrectCount,
  setExamCorrectCount,
  setExamAnswers,
  onReviewLesson,
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
  quizTitle = 'Quick check',
}: LessonQuizBlockProps) {
  const canonicalBenchmarkQuestions = [
    {
      question: `Canonical Production Benchmark Q4: In a high-throughput enterprise service, what is the optimal architectural rule for ${questTitle}?`,
      options: [
        `Create uncached raw heap allocations on every request without checking boundaries.`,
        `Utilize fast indexed lookups O(1)/O(log N) while managing memory cache overhead cleanly.`,
        `Disable exception handling and suppress error outputs.`
      ],
      answerIndex: 1,
      explanation: `Enterprise production architecture requires fast O(1)/O(log N) lookup speeds while controlling memory allocations.`
    },
    {
      question: `Canonical System Safety Q5: What is the primary safety rule to prevent runtime null-pointer or memory-leak crashes in ${questTitle}?`,
      options: [
        `Hide runtime exceptions behind silent try-catch blocks without logging.`,
        `Return dummy 0-byte arrays without tracing the root cause.`,
        `Enforce strict non-null input validation checks and clean resource deallocation before payload return.`
      ],
      answerIndex: 2,
      explanation: `Robust system design requires non-null validation checks, explicit resource cleanup, and detailed error logging.`
    }
  ];

  // The lesson's (or test's) own questions. The two generic benchmark questions are only a fallback
  // for content that has no questions at all; they used to be added to every quiz in every course.
  const hybridExamQuestions = dynamicQuestions.length > 0 ? dynamicQuestions : canonicalBenchmarkQuestions;

  if (examPassed) {
    const total = hybridExamQuestions.length;
    const pct = Math.round((examCorrectCount / (total || 1)) * 100);
    return (
      <div data-testid="quiz-passed-banner" style={{ textAlign: 'center', padding: '24px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 46 }}>🎓</span>
        <h3 style={{ fontSize: 20, fontWeight: 900, color: 'var(--green)' }}>Passed!</h3>
        <p style={{ fontSize: 14, color: 'var(--t2)', lineHeight: 1.5, maxWidth: 500, margin: '0 auto' }}>
          Well done! You scored <strong style={{ color: 'var(--t1)' }}>{examCorrectCount} / {total} ({pct}%)</strong>. You needed 70%.
        </p>
        <span style={{
          fontSize: 12,
          fontWeight: 800,
          color: 'var(--success)',
          background: 'rgba(var(--success-rgb), 0.1)',
          padding: '4px 12px',
          borderRadius: 20,
          border: '1px solid rgba(var(--success-rgb), 0.3)'
        }}>
          Verified Knowledge Invariant Achieved
        </span>
      </div>
    );
  }

  if (examFailed) {
    const total = hybridExamQuestions.length;
    const pct = Math.round((examCorrectCount / (total || 1)) * 100);
    return (
      <div data-testid="quiz-failed-banner" style={{ textAlign: 'center', padding: '24px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
        <span style={{ fontSize: 46 }}>❌</span>
        <h3 style={{ fontSize: 20, fontWeight: 900, color: 'var(--danger)' }}>Not passed yet</h3>
        <p style={{ fontSize: 14, color: 'var(--t2)', lineHeight: 1.5, maxWidth: 480, margin: '0 auto' }}>
          Your score: <strong style={{ color: 'var(--t1)' }}>{examCorrectCount} / {total} ({pct}%)</strong>.
          You need <strong style={{ color: 'var(--warning)' }}>70%</strong> to pass.
          Look back at the lesson, then try again. Mistakes are how you learn.
        </p>
        <button
          data-testid="btn-review-lesson"
          onClick={onReviewLesson}
          className="btn-primary"
          style={{
            marginTop: 8,
            padding: '10px 24px',
            fontSize: 13,
            fontWeight: 800,
            borderRadius: 10,
            background: 'var(--accent)',
            cursor: 'pointer'
          }}
        >
          📖 Review and try again
        </button>
      </div>
    );
  }

  const question = hybridExamQuestions[examQuestionIndex];

  // Anti-Cheating Guardian: Tracks click velocity to stop brute force cycling
  const mcqVelocityTrackerRef = useRef<ReturnType<typeof createMcqVelocityTracker> | null>(null);
  const quizSessionIdRef = useRef<string>(`quiz_${Date.now()}`);

  useEffect(() => {
    if (!mcqVelocityTrackerRef.current) {
      mcqVelocityTrackerRef.current = createMcqVelocityTracker({
        onCheatingDetected: (violationType, details) => {
          recordCheatingIncident('student', quizSessionIdRef.current, 'lesson', violationType, details);
        }
      });
    } else {
      mcqVelocityTrackerRef.current.reset();
    }
  }, [examQuestionIndex]);

  if (!question) {
    return (
      <div style={{ textAlign: 'center', padding: '12px 0' }}>
        <p style={{ fontSize: 12.5, color: 'var(--t3)' }}>Loading exam questions...</p>
      </div>
    );
  }

  const explanationText = getExplanationText(question?.explanation);
  let targetedErrorText = '';
  if (question?.diagnosisMap && selectedMcqAnswer !== null) {
    const candidate = question.diagnosisMap[String(selectedMcqAnswer)] ||
      question.diagnosisMap[question.options?.[selectedMcqAnswer]] ||
      Object.values(question.diagnosisMap)[0];
    targetedErrorText = getExplanationText(candidate);
  }

  const isLastQuestion = examQuestionIndex + 1 === hybridExamQuestions.length;

  const handleNextOrSubmit = () => {
    const newCorrectCount = examCorrectCount + (mcqIsCorrect ? 1 : 0);
    setExamAnswers?.((prev) => {
      const next = prev.slice(0, examQuestionIndex);
      next[examQuestionIndex] = selectedMcqAnswer;
      return next;
    });
    if (isLastQuestion) {
      setExamCorrectCount(newCorrectCount);
      const total = hybridExamQuestions.length;
      const pct = (newCorrectCount / total) * 100;
      if (pct >= 70) {
        setExamPassed(true);
        playChime();
        launchConfetti();
        toast.success("Passed! 🎯", `Final score: ${newCorrectCount}/${total} (${Math.round(pct)}%).`);
      } else {
        setExamFailed(true);
        toast.error("Not passed yet", `Final score: ${newCorrectCount}/${total} (${Math.round(pct)}%). 70% required.`);
      }
    } else {
      if (mcqIsCorrect) {
        setExamCorrectCount(newCorrectCount);
      }
      setExamQuestionIndex(prev => prev + 1);
      setSelectedMcqAnswer(null);
      setMcqChecked(false);
      setMcqIsCorrect(false);
    }
  };

  const progressPct = Math.round(((examQuestionIndex + (mcqChecked ? 1 : 0)) / Math.max(1, hybridExamQuestions.length)) * 100);

  return (
    <div data-testid="lesson-quiz-block" style={{ display: 'flex', flexDirection: 'column', gap: 14, textAlign: 'left' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
        <h4 style={{ fontSize: 15.5, fontWeight: 900, color: teacherAccent, margin: 0 }}>{quizTitle}</h4>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            data-testid="quiz-score-pill"
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: 'var(--t2)',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--border)',
              borderRadius: 999,
              padding: '3px 10px',
              fontFamily: 'var(--font-mono)',
            }}
          >
            🎯 Score: {examCorrectCount}/{examQuestionIndex} • Pass: 70%
          </span>
          <span style={{ fontSize: 11.5, color: 'var(--t3)', fontFamily: 'var(--font-mono)' }}>
            Question {examQuestionIndex + 1} of {hybridExamQuestions.length}
          </span>
        </div>
      </div>

      <div
        data-testid="quiz-progress-bar"
        style={{
          width: '100%',
          height: 6,
          borderRadius: 999,
          background: 'rgba(255,255,255,0.06)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${progressPct}%`,
            height: '100%',
            background: teacherAccent || 'var(--accent)',
            transition: 'width 0.25s ease',
          }}
        />
      </div>

      <div style={{
        background: 'var(--accent-light)',
        border: '1px solid var(--border)',
        borderRadius: 16,
        padding: 16,
        boxShadow: 'var(--shadow-sm)'
      }}>
        <p data-testid="quiz-question-text" style={{ fontSize: 13, fontWeight: 800, color: 'var(--t1)', marginBottom: 12 }}>
          ❓ {question.question}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {(question.options || []).map((option: string, oIdx: number) => {
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
                onClick={() => {
                  mcqVelocityTrackerRef.current?.recordClick(oIdx);
                  setSelectedMcqAnswer(oIdx);
                }}
                className={`mcq-option-btn ${stateClass}`}
                style={{
                  textAlign: 'left',
                  padding: '10px 14px',
                  fontSize: 12.5
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
                toast.success("Correct Choice! 🎯", "Optimal invariant verified.");
              } else {
                toast.error("Suboptimal Choice ⚠️", "Review the architectural breakdown below.");
              }
            }}
            className="btn-primary"
            style={{
              marginTop: 12,
              padding: '10px 20px',
              fontSize: 13,
              borderRadius: 10,
              background: teacherAccent
            }}
          >
            Verify Choice ➔
          </button>
        )}

        {mcqChecked && (
          <div style={{ marginTop: 12 }}>
            {mcqIsCorrect ? (
              <div>
                <div data-testid="quiz-explanation-box" style={{
                  background: 'rgba(var(--success-rgb),  0.08)',
                  border: '1px solid rgba(var(--success-rgb),  0.3)',
                  borderRadius: 10,
                  padding: 12,
                  fontSize: 12.5,
                  color: 'var(--t1)',
                  lineHeight: 1.5,
                  marginBottom: 12
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 800, color: 'var(--success)', marginBottom: 4 }}>
                    <span>🎯</span>
                    <span>Concept Mastery & Optimal Principle:</span>
                  </div>
                  <div style={{ color: 'var(--t2)', fontSize: 12 }}>
                    {explanationText || "This solution directly satisfies the architectural requirement and prevents runtime degradation."}
                  </div>
                </div>
                <button
                  data-testid="btn-next-question"
                  onClick={handleNextOrSubmit}
                  className="btn-primary"
                  style={{
                    padding: '8px 18px',
                    fontSize: 12,
                    borderRadius: 8,
                    background: 'var(--green)'
                  }}
                >
                  {isLastQuestion ? 'Submit Final Exam 🎓' : 'Next Question →'}
                </button>
              </div>
            ) : (
              <div>
                <div data-testid="quiz-error-box" style={{
                  background: 'rgba(var(--danger-rgb),  0.08)',
                  border: '1px solid rgba(var(--danger-rgb),  0.3)',
                  borderRadius: 10,
                  padding: 12,
                  fontSize: 12.5,
                  color: 'var(--t1)',
                  lineHeight: 1.5,
                  marginBottom: 12
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 800, color: 'var(--danger)', marginBottom: 4 }}>
                    <span>⚠️</span>
                    <span>Suboptimal Selection:</span>
                  </div>
                  <div style={{ color: 'var(--t2)', fontSize: 12, marginBottom: 6 }}>
                    {targetedErrorText || "The selected option fails to enforce safety invariants or violates optimal system constraints for this topic."}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, color: 'var(--warning)', fontSize: 11.5 }}>
                    <span>💡 Principle:</span>
                    <span>{explanationText || 'System integrity requires explicit boundary validation and clean resource deallocation.'}</span>
                  </div>
                </div>
                <button
                  data-testid="btn-next-question"
                  onClick={handleNextOrSubmit}
                  className="btn-primary"
                  style={{
                    padding: '8px 18px',
                    fontSize: 12,
                    borderRadius: 8,
                    background: 'var(--accent)'
                  }}
                >
                  {isLastQuestion ? 'Submit Final Exam 🎓' : 'Next Question →'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
