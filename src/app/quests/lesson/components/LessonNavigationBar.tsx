import React from 'react';
import { TeacherAvatarFrame, type LessonQuestData } from './TeacherAvatarFrame';

interface LessonNavigationBarProps {
  currentSlide: number;
  handlePrevSlide: () => void;
  handleNextSlide: () => void;
  stopSpeaking: () => void;
  setIsPlaying: (playing: boolean) => void;
  isInteractive: boolean;
  setIsInteractive: React.Dispatch<React.SetStateAction<boolean>>;
  teacher: any;
  isLastSlide: boolean;
  examPassed: boolean;
  finishLessonAndReturn: () => void;
  slidesLength: number;
  understandingConfirmed: Record<number, boolean>;
  setUnderstandingConfirmed?: React.Dispatch<React.SetStateAction<Record<number, boolean>>>;
  userId?: string;
  teacherId?: string;
  isPlaying?: boolean;
  speechText?: string;
  questData?: LessonQuestData | null;
}

export function LessonNavigationBar({
  currentSlide,
  handlePrevSlide,
  handleNextSlide,
  stopSpeaking,
  setIsPlaying,
  isInteractive,
  setIsInteractive,
  teacher,
  isLastSlide,
  examPassed,
  finishLessonAndReturn,
  slidesLength,
  understandingConfirmed,
  setUnderstandingConfirmed,
  userId,
  teacherId,
  isPlaying,
  speechText,
  questData,
}: LessonNavigationBarProps) {
  const isLearningSlide = currentSlide > 0 && currentSlide <= slidesLength;

  return (
    <div
      className="lesson-nav-bar"
      data-testid="lesson-nav-bar"
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '8px',
        borderTop: '1px solid var(--border)',
        paddingTop: 12,
        flexShrink: 0,
        position: 'relative',
        zIndex: 20,
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <style>{`
        .lesson-nav-btn {
          font-family: inherit;
          transition: all 0.2s ease;
        }
        @media (max-width: 639px) {
          .lesson-nav-btn-prev, .lesson-nav-btn-next {
            padding: 8px 12px !important;
            font-size: 13px !important;
          }
          .lesson-nav-btn-qa {
            padding: 8px 10px !important;
            font-size: 12px !important;
          }
        }
      `}</style>

      {/* Left controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 1, minWidth: 0 }}>
        <button
          onClick={handlePrevSlide}
          disabled={currentSlide === 0}
          className="lesson-nav-btn lesson-nav-btn-prev"
          data-testid="btn-prev-slide"
          style={{
            background: 'transparent',
            border: '1px solid var(--border)',
            padding: '10px 18px',
            borderRadius: 12,
            fontSize: 14,
            fontWeight: 700,
            color: 'var(--t2)',
            cursor: currentSlide === 0 ? 'not-allowed' : 'pointer',
            opacity: currentSlide === 0 ? 0.5 : 1,
            whiteSpace: 'nowrap',
          }}
        >
          ◀ Previous Slide
        </button>

        {/* Q&A Interactive Toggle Mode Button */}
        <button
          onClick={() => {
            stopSpeaking();
            setIsPlaying(false);
            setIsInteractive(prev => !prev);
          }}
          className="lesson-nav-btn lesson-nav-btn-qa"
          data-testid="btn-qa-toggle"
          style={{
            padding: '10px 16px',
            borderRadius: 12,
            border: `1.5px solid ${isInteractive ? 'var(--border)' : teacher.accent || 'var(--accent)'}`,
            background: isInteractive ? 'transparent' : 'rgba(var(--brand-rgb), 0.1)',
            color: isInteractive ? 'var(--t2)' : (teacher.accent || 'var(--accent)'),
            fontSize: 13.5,
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            whiteSpace: 'nowrap',
          }}
        >
          {isInteractive ? '📖 Slide Lecture' : '💬 Interactive Q&A'}
        </button>
      </div>

      {/* Center: Docked Teacher Avatar Frame */}
      <TeacherAvatarFrame
        userId={userId || 'guest'}
        teacherId={teacherId || 'kashyap'}
        teacher={teacher}
        isPlaying={Boolean(isPlaying)}
        speechText={speechText || ''}
        questData={questData}
      />

      {/* Right controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        {isLastSlide ? (
          <button
            data-testid="btn-finish-quest"
            disabled={!examPassed}
            onClick={finishLessonAndReturn}
            className={`lesson-nav-btn ${examPassed ? 'animate-pulse' : ''}`}
            style={{
              padding: '10px 24px',
              fontSize: 14.5,
              fontWeight: 900,
              borderRadius: 12,
              background: examPassed ? 'var(--green)' : 'var(--border)',
              color: examPassed ? 'var(--t1)' : 'var(--text-muted)',
              cursor: examPassed ? 'pointer' : 'not-allowed',
              opacity: examPassed ? 1 : 0.6,
              border: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            Finish Quest & Return 🏁
          </button>
        ) : (
          <button
            data-testid="btn-next-slide"
            onClick={() => {
              if (setUnderstandingConfirmed && isLearningSlide && !understandingConfirmed[currentSlide - 1]) {
                setUnderstandingConfirmed(prev => ({ ...prev, [currentSlide - 1]: true }));
              }
              handleNextSlide();
            }}
            className="lesson-nav-btn lesson-nav-btn-next"
            style={{
              background: teacher.accent || 'var(--accent)',
              border: 'none',
              padding: '10px 20px',
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 700,
              color: 'var(--t1)',
              cursor: 'pointer',
              opacity: 1,
              whiteSpace: 'nowrap',
            }}
          >
            Next Slide ▶
          </button>
        )}
      </div>
    </div>
  );
}
