import React from 'react';
import { ConfettiParticle } from '../hooks/useLessonState';

interface LessonCompletionModalProps {
  examPassed: boolean;
  confettiParticles: ConfettiParticle[];
  finishLessonAndReturn: () => void;
}

export function LessonCompletionModal({
  examPassed,
  confettiParticles,
  finishLessonAndReturn,
}: LessonCompletionModalProps) {
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
          <div style={{
            background: 'var(--bg2)',
            border: '1.5px solid var(--green)',
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
          }}>
            <span style={{ fontSize: 48, animation: 'pulse 2s infinite' }}>🏆</span>
            <h2 style={{ fontSize: 20, fontWeight: 900, color: 'var(--green)', fontFamily: 'var(--font-display)', margin: 0 }}>
              Syllabus Passed!
            </h2>
            <p style={{ fontSize: 12.5, color: 'var(--t2)', lineHeight: 1.5, margin: 0 }}>
              Congratulations, developer! You successfully cleared all Socratic slide checkpoints and passed the syllabus evaluation exam.
            </p>

            <div style={{
              display: 'flex',
              gap: 12,
              width: '100%',
              marginTop: 6
            }}>
              <div style={{
                flex: 1,
                background: 'rgba(var(--success-rgb), 0.08)',
                border: '1.5px solid rgba(var(--success-rgb), 0.2)',
                borderRadius: 14,
                padding: '10px 6px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: 10, color: 'var(--t3)', fontFamily: 'var(--font-mono)' }}>XP Earned</div>
                <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--green)', marginTop: 2 }}>+150 XP</div>
              </div>
              <div style={{
                flex: 1,
                background: 'rgba(234,179,8,0.08)',
                border: '1.5px solid rgba(234,179,8,0.2)',
                borderRadius: 14,
                padding: '10px 6px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: 10, color: 'var(--t3)', fontFamily: 'var(--font-mono)' }}>Pins Bonus</div>
                <div style={{ fontSize: 18, fontWeight: 900, color: '#eab308', marginTop: 2 }}>+5 Pins</div>
              </div>
            </div>

            <button
              onClick={finishLessonAndReturn}
              className="btn-primary animate-pulse"
              style={{
                marginTop: 10,
                width: '100%',
                padding: '12px 20px',
                fontSize: 13,
                fontWeight: 900,
                borderRadius: 12,
                background: 'var(--green)'
              }}
            >
              Return to Roadmap 🏁
            </button>
          </div>
        </div>
      )}
    </>
  );
}
