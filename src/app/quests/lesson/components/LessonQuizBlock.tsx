import React from 'react';
import { toast } from '@/lib/store/useAppStore';

function getExplanationText(explanation: any): string {
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
}

export function LessonQuizBlock({
  teacherAccent,
  examPassed,
  examFailed,
  setExamFailed,
  examCorrectCount,
  setExamCorrectCount,
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

  const hybridExamQuestions = [
    ...dynamicQuestions.slice(0, 3),
    ...canonicalBenchmarkQuestions
  ];

  if (examPassed) {
    const total = hybridExamQuestions.length;
    const pct = Math.round((examCorrectCount / (total || 1)) * 100);
    return (
      <div style={{ textAlign: 'center', padding: '24px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 42 }}>🎓</span>
        <h3 style={{ fontSize: 18, fontWeight: 900, color: 'var(--green)' }}>Syllabus Exam Passed!</h3>
        <p style={{ fontSize: 12.5, color: 'var(--t2)', lineHeight: 1.5, maxWidth: 500, margin: '0 auto' }}>
          Outstanding performance! You scored <strong style={{ color: 'var(--t1)' }}>{examCorrectCount} / {total} ({pct}%)</strong>, exceeding the 70% passing threshold.
        </p>
        <span style={{
          fontSize: 11,
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
      <div style={{ textAlign: 'center', padding: '24px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
        <span style={{ fontSize: 42 }}>❌</span>
        <h3 style={{ fontSize: 18, fontWeight: 900, color: 'var(--danger)' }}>Evaluation Exam Not Passed</h3>
        <p style={{ fontSize: 12.5, color: 'var(--t2)', lineHeight: 1.5, maxWidth: 480, margin: '0 auto' }}>
          Your score: <strong style={{ color: 'var(--t1)' }}>{examCorrectCount} / {total} ({pct}%)</strong>.
          The passing benchmark is <strong style={{ color: 'var(--warning)' }}>70%</strong>.
          Please review the lesson material and foundational invariants before retaking the evaluation.
        </p>
        <button
          data-testid="btn-review-lesson"
          onClick={onReviewLesson}
          className="btn-primary"
          style={{
            marginTop: 8,
            padding: '10px 24px',
            fontSize: 12,
            fontWeight: 800,
            borderRadius: 10,
            background: 'var(--accent)',
            cursor: 'pointer'
          }}
        >
          📖 Review Lesson Material & Retake
        </button>
      </div>
    );
  }

  const question = hybridExamQuestions[examQuestionIndex];
  if (!question) {
    return (
      <div style={{ textAlign: 'center', padding: '12px 0' }}>
        <p style={{ fontSize: 11.5, color: 'var(--t3)' }}>Loading exam questions...</p>
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
    if (isLastQuestion) {
      setExamCorrectCount(newCorrectCount);
      const total = hybridExamQuestions.length;
      const pct = (newCorrectCount / total) * 100;
      if (pct >= 70) {
        setExamPassed(true);
        playChime();
        launchConfetti();
        toast.success("Exam Passed! 🎯", `Final score: ${newCorrectCount}/${total} (${Math.round(pct)}%).`);
      } else {
        setExamFailed(true);
        toast.error("Exam Not Passed ⚠️", `Final score: ${newCorrectCount}/${total} (${Math.round(pct)}%). 70% required.`);
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
                toast.success("Correct Choice! 🎯", "Optimal invariant verified.");
              } else {
                toast.error("Suboptimal Choice ⚠️", "Review the architectural breakdown below.");
              }
            }}
            className="btn-primary"
            style={{
              marginTop: 12,
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
          <div style={{ marginTop: 12 }}>
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
                    {explanationText || "This solution directly satisfies the architectural requirement and prevents runtime degradation."}
                  </div>
                </div>
                <button
                  data-testid="btn-next-question"
                  onClick={handleNextOrSubmit}
                  className="btn-primary"
                  style={{
                    padding: '8px 18px',
                    fontSize: 11,
                    borderRadius: 8,
                    background: 'var(--green)'
                  }}
                >
                  {isLastQuestion ? 'Submit Final Exam 🎓' : 'Next Question →'}
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
                    <span>Suboptimal Selection:</span>
                  </div>
                  <div style={{ color: 'var(--t2)', fontSize: 11, marginBottom: 6 }}>
                    {targetedErrorText || "The selected option fails to enforce safety invariants or violates optimal system constraints for this topic."}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, color: 'var(--warning)', fontSize: 10.5 }}>
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
                    fontSize: 11,
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
