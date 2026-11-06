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
  const safeTeacher = teacher || {
    name: 'Kashyap Sir',
    avatar: '👩‍🎨',
    accent: 'var(--accent)',
    role: 'Staff Systems Architect',
  };
  const isLearningSlide = currentSlide > 0 && currentSlide <= slidesLength;
  const isPuzzleSlide = currentSlide === slidesLength + 1;
  const isBattleSlide = currentSlide === slidesLength + 2;
  const isTestModeBypass = typeof window !== 'undefined' && window.location.search.includes('testMode=true');
  const isConfirmed = isLearningSlide ? Boolean(understandingConfirmed[currentSlide - 1]) : true;
  const isLocked = isLearningSlide && !isConfirmed && !isTestModeBypass;
  const confirmedCount = Object.values(understandingConfirmed || {}).filter(Boolean).length;

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
        .lesson-nav-label-desktop {
          display: inline;
        }
        .lesson-nav-label-mobile {
          display: none;
        }
        @media (max-width: 639px) {
          .lesson-nav-bar {
            gap: 6px !important;
          }
          .lesson-nav-btn-prev, .lesson-nav-btn-next, .lesson-nav-btn-qa {
            min-width: 80px !important;
            padding: 8px 8px !important;
            font-size: 12px !important;
            justify-content: center !important;
          }
          .lesson-nav-label-desktop {
            display: none !important;
          }
          .lesson-nav-label-mobile {
            display: inline !important;
          }
        }
      `}</style>

      {/* Zone 1 (Left-Down): Clean Classroom Status Tag (2D Cartoon avatar removed per user request) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, minWidth: 0 }}>
        <TeacherAvatarFrame
          userId={userId || "guest"}
          teacherId={teacherId || "kashyap"}
          teacher={safeTeacher}
          isPlaying={Boolean(isPlaying)}
          speechText={speechText || ""}
          questData={questData}
        />
        <div
          data-testid="classroom-topic-pill"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 14px',
            borderRadius: 12,
            background: 'var(--bg2)',
            border: '1px solid var(--border)',
            fontSize: 12.5,
            fontWeight: 700,
            color: 'var(--t2)',
            fontFamily: 'var(--font-mono)',
          }}
        >
          <span style={{ color: safeTeacher.accent || 'var(--accent)', fontSize: 13 }}>⚡</span>
          <span className="lesson-nav-label-desktop">{questData?.title || 'PinIT Classroom'}</span>
          <span className="lesson-nav-label-mobile">Slide {currentSlide + 1}</span>
        </div>
      </div>

      {/* Zone 2 (Middle-Center): Grouped Slide Controls [ Prev ] [ Next / Finish ] [ Interactive Q&A ] */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0, padding: '0 8px' }}>
        {/* Previous Slide Button */}
        <button
          onClick={handlePrevSlide}
          disabled={currentSlide === 0}
          className="lesson-nav-btn lesson-nav-btn-prev"
          data-testid="btn-prev-slide"
          style={{
            background: 'transparent',
            border: '1px solid var(--border)',
            padding: '10px 16px',
            borderRadius: 12,
            fontSize: 13.5,
            fontWeight: 700,
            color: 'var(--t2)',
            cursor: currentSlide === 0 ? 'not-allowed' : 'pointer',
            opacity: currentSlide === 0 ? 0.5 : 1,
            whiteSpace: 'nowrap',
          }}
        >
          <span className="lesson-nav-label-desktop">◀ Previous Slide</span>
          <span className="lesson-nav-label-mobile">◀ Prev</span>
        </button>

        {/* Center Next / Finish Quest Button */}
        {isLastSlide ? (
          <button
            data-testid="btn-finish-quest"
            disabled={!examPassed}
            onClick={finishLessonAndReturn}
            className={`lesson-nav-btn ${examPassed ? 'animate-pulse' : ''}`}
            style={{
              padding: '10px 28px',
              fontSize: 14.5,
              fontWeight: 900,
              borderRadius: 12,
              background: examPassed ? 'var(--green)' : 'var(--border)',
              color: examPassed ? 'var(--t1)' : 'var(--text-muted)',
              cursor: examPassed ? 'pointer' : 'not-allowed',
              opacity: examPassed ? 1 : 0.6,
              border: 'none',
              whiteSpace: 'nowrap',
              boxShadow: examPassed ? '0 0 16px rgba(34, 197, 94, 0.35)' : undefined,
            }}
          >
            <span className="lesson-nav-label-desktop">Finish Quest & Return 🏁</span>
            <span className="lesson-nav-label-mobile">Finish 🏁</span>
          </button>
        ) : (
          <button
            data-testid="btn-next-slide"
            disabled={isLocked}
            onClick={() => {
              if (isLocked) return;
              handleNextSlide();
            }}
            className="lesson-nav-btn lesson-nav-btn-next"
            title={isLocked ? 'Answer the concept check above to unlock the next slide' : 'Next Slide'}
            style={{
              background: isLocked ? 'var(--border)' : (safeTeacher.accent || 'var(--accent)'),
              border: 'none',
              padding: '10px 24px',
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 800,
              color: isLocked ? 'var(--text-muted)' : 'var(--accent-btn-fg, #ffffff)',
              cursor: isLocked ? 'not-allowed' : 'pointer',
              opacity: isLocked ? 0.6 : 1,
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease',
              boxShadow: !isLocked ? '0 0 14px color-mix(in srgb, var(--accent) 28%, transparent)' : undefined,
            }}
          >
            <span className="lesson-nav-label-desktop">
              {isLocked
                ? 'Answer Check 🔒'
                : isPuzzleSlide
                ? '🧩 Puzzle Event'
                : isBattleSlide
                ? '⚔️ 60s Battle'
                : currentSlide === slidesLength
                ? 'Proceed to Puzzle 🧩'
                : 'Next Slide ▶'}
            </span>
            <span className="lesson-nav-label-mobile">
              {isLocked
                ? 'Locked 🔒'
                : isPuzzleSlide
                ? '🧩 Puzzle'
                : isBattleSlide
                ? '⚔️ Battle'
                : 'Next ▶'}
            </span>
          </button>
        )}

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
            padding: '10px 14px',
            borderRadius: 12,
            border: `1.5px solid ${isInteractive ? 'var(--border)' : safeTeacher.accent || 'var(--accent)'}`,
            background: isInteractive ? 'transparent' : 'rgba(var(--brand-rgb), 0.1)',
            color: isInteractive ? 'var(--t2)' : (safeTeacher.accent || 'var(--accent)'),
            fontSize: 13,
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            whiteSpace: 'nowrap',
          }}
        >
          <span className="lesson-nav-label-desktop">{isInteractive ? '📖 Slide Lecture' : '💬 Interactive Q&A'}</span>
          <span className="lesson-nav-label-mobile">{isInteractive ? '📖 Slides' : '💬 Q&A'}</span>
        </button>
      </div>

      {/* Zone 3 (Right-Down): Secondary Progress Indicator */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px', flexShrink: 0 }}>
        {slidesLength > 0 && (
          <span
            data-testid="lesson-check-progress-pill"
            className="lesson-nav-label-desktop"
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: confirmedCount >= slidesLength ? 'var(--success)' : 'var(--t3)',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid var(--border)',
              borderRadius: 999,
              padding: '4px 10px',
              fontFamily: 'var(--font-mono)',
              whiteSpace: 'nowrap',
            }}
          >
            {isPuzzleSlide
              ? '🧩 Synthesis Puzzle'
              : isBattleSlide
              ? '⚡ 60s MCQ Battle'
              : `✓ ${Math.min(confirmedCount, slidesLength)}/${slidesLength} Checks`}
          </span>
        )}
      </div>
    </div>
  );
}
