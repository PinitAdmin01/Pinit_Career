import React from 'react';
import { ConfettiParticle } from '../hooks/useLessonState';
import { getAuthoritativeQuest } from '@/lib/quests/questRegistry';

interface LessonCompletionModalProps {
  examPassed: boolean;
  confettiParticles: ConfettiParticle[];
  finishLessonAndReturn: () => void;
  questId?: string;
  xp?: number;
  pins?: number;
  /** Course tests only: the server's verdict. The pass is not celebrated until it is recorded. */
  testRecord?: { state: 'checking' | 'recorded' | 'failed'; message?: string } | null;
  onRetryTest?: () => void;
  nextQuest?: { id: string; title: string; isExam?: boolean } | null;
  onGoToNextQuest?: () => void;
  isStartingNext?: boolean;
}

export function LessonCompletionModal({
  examPassed,
  confettiParticles,
  finishLessonAndReturn,
  questId,
  xp,
  pins,
  testRecord,
  onRetryTest,
  nextQuest,
  onGoToNextQuest,
  isStartingNext,
}: LessonCompletionModalProps) {
  const checking = testRecord?.state === 'checking';
  const failed = testRecord?.state === 'failed';
  const authQuest = questId ? getAuthoritativeQuest(questId) : null;
  const displayXp = xp ?? authQuest?.xp ?? 150;
  const displayPins = pins ?? authQuest?.pins ?? 5;
  return (
    <>
      {/* Confetti Visual overlay */}
      {confettiParticles.length > 0 && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          zIndex: 9999,
          pointerEvents: 'none',
          overflow: 'visible'
        }}>
          {confettiParticles.map(p => (
            <div
              key={p.id}
              style={{
                position: 'absolute',
                width: p.size,
                height: p.size,
                borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                background: p.color,
                transform: p.transform,
                transition: p.transition,
                opacity: 0.9
              }}
            />
          ))}
        </div>
      )}

      {/* Gamified Syllabus Exam Success Overlay Modal Card */}
      {examPassed && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(5, 8, 16, 0.85)',
          backdropFilter: 'blur(8px)',
          zIndex: 999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20
        }} className="animate-fade-in">
          <div
            data-testid="lesson-completion-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Lesson Completion Modal"
            style={{
              background: 'var(--bg2)',
              border: failed ? '1.5px solid var(--danger)' : '1.5px solid var(--green)',
              borderRadius: 24,
              padding: '32px 24px',
              maxWidth: 420,
              width: '100%',
              textAlign: 'center',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 16
            }}
          >
            <span style={{ fontSize: 53, animation: checking || failed ? undefined : 'pulse 2s infinite' }}>{checking ? '⏳' : failed ? '⚠️' : '🏆'}</span>
            <h2 style={{ fontSize: 22, fontWeight: 900, color: failed ? 'var(--danger)' : 'var(--green)', fontFamily: 'var(--font-display)', margin: 0 }}>
              {checking ? 'Checking your answers…' : failed ? 'Test not recorded' : testRecord ? 'Test Passed!' : 'Syllabus Passed!'}
            </h2>
            <p style={{ fontSize: 14, color: 'var(--t2)', lineHeight: 1.5, margin: 0 }}>
              {checking
                ? 'Your answers are being marked by the server. This only takes a moment.'
                : failed
                  ? testRecord?.message
                  : testRecord
                    ? 'Well done! The server has marked and recorded your test.'
                    : 'Congratulations, developer! You successfully cleared all Socratic slide checkpoints and passed the syllabus evaluation exam.'}
            </p>

            {!checking && !failed && <div style={{
              display: 'flex',
              gap: 12,
              width: '100%',
              marginTop: 6
            }}>
              <div
                data-testid="completion-xp-badge"
                style={{
                  flex: 1,
                  background: 'rgba(var(--success-rgb), 0.08)',
                  border: '1.5px solid rgba(var(--success-rgb), 0.2)',
                  borderRadius: 14,
                  padding: '10px 6px',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: 11, color: 'var(--t3)', fontFamily: 'var(--font-mono)' }}>XP Earned</div>
                <div style={{ fontSize: 20, fontWeight: 900, color: 'var(--green)', marginTop: 2 }}>+{displayXp} XP</div>
              </div>
              <div
                data-testid="completion-pins-badge"
                style={{
                  flex: 1,
                  background: 'rgba(234,179,8,0.08)',
                  border: '1.5px solid rgba(234,179,8,0.2)',
                  borderRadius: 14,
                  padding: '10px 6px',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: 11, color: 'var(--t3)', fontFamily: 'var(--font-mono)' }}>Pins Bonus</div>
                <div style={{ fontSize: 20, fontWeight: 900, color: 'var(--amber)', marginTop: 2 }}>+{displayPins} Pins</div>
              </div>
            </div>}

            {failed && onRetryTest && (
              <button
                data-testid="completion-retry-banner"
                onClick={onRetryTest}
                className="btn-primary"
                style={{ marginTop: 10, width: '100%', padding: '12px 20px', fontSize: 14.5, fontWeight: 900, borderRadius: 12, background: 'var(--accent)' }}
              >
                Take the test again
              </button>
            )}
            {failed && (
              <button
                data-testid="btn-return-roadmap-failed"
                onClick={finishLessonAndReturn}
                style={{ background: 'none', border: 'none', color: 'var(--t3)', fontSize: 13, textDecoration: 'underline', cursor: 'pointer' }}
              >
                Back to the roadmap
              </button>
            )}

            {!checking && !failed && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                  width: '100%',
                  marginTop: 10,
                }}
              >
                {nextQuest && onGoToNextQuest && (
                  <button
                    data-testid="btn-go-to-next-quest"
                    type="button"
                    onClick={onGoToNextQuest}
                    disabled={isStartingNext}
                    className="btn-primary animate-pulse"
                    style={{
                      width: '100%',
                      padding: '13px 20px',
                      fontSize: 15,
                      fontWeight: 900,
                      borderRadius: 12,
                      background: 'var(--accent)',
                      color: '#ffffff',
                      border: 'none',
                      cursor: isStartingNext ? 'wait' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      boxShadow: '0 4px 14px rgba(var(--primary-rgb), 0.35)',
                      opacity: isStartingNext ? 0.75 : 1,
                    }}
                  >
                    {isStartingNext
                      ? '⏳ Loading Next...'
                      : nextQuest.isExam
                      ? 'Go to Next Exam ➔'
                      : 'Go to Next Class ➔'}
                  </button>
                )}
                <button
                  data-testid="btn-return-roadmap"
                  type="button"
                  onClick={finishLessonAndReturn}
                  className="btn-primary"
                  style={{
                    width: '100%',
                    padding: nextQuest ? '11px 18px' : '13px 20px',
                    fontSize: 14,
                    fontWeight: 800,
                    borderRadius: 12,
                    background: nextQuest ? 'var(--bg3)' : 'var(--green)',
                    color: nextQuest ? 'var(--t1)' : '#ffffff',
                    border: nextQuest ? '1px solid var(--border)' : 'none',
                    cursor: 'pointer',
                  }}
                >
                  Return to Dashboard 🏁
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
