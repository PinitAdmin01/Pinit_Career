import React from 'react';
import { toast } from '@/lib/store/useAppStore';

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
}: LessonNavigationBarProps) {
  const isLearningSlide = currentSlide > 0 && currentSlide <= slidesLength;
  const nextUnlocked = !isLearningSlide || understandingConfirmed[currentSlide - 1];

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderTop: '1px solid var(--border)',
      paddingTop: 14,
      flexShrink: 0
    }}>
      <button
        onClick={handlePrevSlide}
        disabled={currentSlide === 0}
        style={{
          background: 'transparent',
          border: '1px solid var(--border)',
          padding: '10px 18px',
          borderRadius: 12,
          fontSize: 12.5,
          fontWeight: 700,
          color: 'var(--t2)',
          cursor: currentSlide === 0 ? 'not-allowed' : 'pointer',
          opacity: currentSlide === 0 ? 0.5 : 1
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
        style={{
          padding: '10px 20px',
          borderRadius: 12,
          border: `1.5px solid ${isInteractive ? 'var(--border)' : teacher.accent}`,
          background: isInteractive ? 'transparent' : `${teacher.accent}15`,
          color: isInteractive ? 'var(--t2)' : teacher.accent,
          fontSize: 12.5,
          fontWeight: 800,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          transition: 'all 0.2s'
        }}
      >
        {isInteractive ? '📖 Slide Lecture' : '💬 Interactive Q&A'}
      </button>

      {isLastSlide ? (
        <button
          data-testid="btn-finish-quest"
          disabled={!examPassed}
          onClick={finishLessonAndReturn}
          className={`btn-primary ${examPassed ? 'animate-pulse' : ''}`}
          style={{
            padding: '10px 24px',
            fontSize: 13,
            fontWeight: 900,
            borderRadius: 12,
            background: examPassed ? 'var(--green)' : '#475569',
            color: examPassed ? '#fff' : '#94a3b8',
            cursor: examPassed ? 'pointer' : 'not-allowed',
            opacity: examPassed ? 1 : 0.6
          }}
        >
          Finish Quest & Return 🏁
        </button>
      ) : (
        <button
          data-testid="btn-next-slide"
          onClick={() => {
            if (!nextUnlocked) {
              toast.error("Understanding Required", "Please click 'Yes, I understand' or ask the tutor to explain before moving to the next slide.");
              return;
            }
            handleNextSlide();
          }}
          style={{
            background: nextUnlocked ? teacher.accent : '#475569',
            border: 'none',
            padding: '10px 20px',
            borderRadius: 12,
            fontSize: 12.5,
            fontWeight: 700,
            color: nextUnlocked ? '#fff' : '#94a3b8',
            cursor: nextUnlocked ? 'pointer' : 'not-allowed',
            opacity: nextUnlocked ? 1 : 0.6
          }}
        >
          Next Slide ▶
        </button>
      )}
    </div>
  );
}
