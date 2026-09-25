'use client';

import React from 'react';

export interface TourSlide {
  emoji: string;
  title: string;
  tabKey: string;
  route: string;
  segment: number;
  segmentLabel: string;
  text: string;
}

// ── Story tour: 7 Flagship Platform Hubs (< 30s total runtime) ──
export const TOUR_SLIDES: TourSlide[] = [
  {
    emoji: '🏠',
    title: 'Command Center Dashboard',
    tabKey: 'dashboard',
    route: '/dashboard',
    segment: 1,
    segmentLabel: 'FLAGSHIP HUB 1/7 · DASHBOARD',
    text: "Track your verified skills, daily streak, and career growth.",
  },
  {
    emoji: '🗺',
    title: 'Socratic Quests & Courses',
    tabKey: 'quests',
    route: '/quests',
    segment: 1,
    segmentLabel: 'FLAGSHIP HUB 2/7 · SOCRATIC LEARNING',
    text: "Conquer Socratic quests and challenges to earn career Pins.",
  },
  {
    emoji: '⚡',
    title: 'Daily Missions & Skill Gaps',
    tabKey: 'missions',
    route: '/missions',
    segment: 1,
    segmentLabel: 'FLAGSHIP HUB 3/7 · DAILY MISSIONS',
    text: "Solve daily targeted micro-challenges to close your skill gaps.",
  },
  {
    emoji: '⚔️',
    title: 'Competitive Battle Arena',
    tabKey: 'arena',
    route: '/arena',
    segment: 1,
    segmentLabel: 'FLAGSHIP HUB 4/7 · 1V1 ARENA',
    text: "Compete in live one-on-one duels to outsolve rivals.",
  },
  {
    emoji: '🚀',
    title: 'Industry Squads & Projects',
    tabKey: 'projects',
    route: '/projects',
    segment: 1,
    segmentLabel: 'FLAGSHIP HUB 5/7 · SQUADS & PROJECTS',
    text: "Build recruiter-verified proof of work with collaborative squads.",
  },
  {
    emoji: '🏆',
    title: 'Global & Campus Leagues',
    tabKey: 'leaderboard',
    route: '/leaderboard',
    segment: 1,
    segmentLabel: 'FLAGSHIP HUB 6/7 · LEADERBOARDS',
    text: "Climb campus and global leagues all the way to Grandmaster.",
  },
  {
    emoji: '🎙',
    title: 'AI Mock Interview Studio',
    tabKey: 'interview',
    route: '/interview',
    segment: 1,
    segmentLabel: 'FLAGSHIP HUB 7/7 · AI INTERVIEWS',
    text: "Practice AI mock interviews with real-time feedback.",
  },
];

export const TOUR_STEP_ROUTES: Record<number, string> = {
  0: '/dashboard',
  1: '/quests',
  2: '/missions',
  3: '/arena',
  4: '/projects',
  5: '/leaderboard',
  6: '/interview',
};

// ── Build congratulations message from event payload ─────────────────────────
export function buildCongratMessage(detail: any, profile: any): { headline: string; body: string; tip: string } {
  const score = typeof detail?.score === 'number' ? detail.score : null;
  const passed = detail?.passed !== false;

  const weakAreas = Array.isArray(profile?.weak_areas) && profile.weak_areas.length > 0
    ? profile.weak_areas
    : ['System Design Concepts', 'API Gateways', 'Concurrency Controls'];
  const focusImprove = weakAreas[0];

  let headline = passed ? '🎉 Activity Completed!' : '💪 Keep Practicing!';
  let body = passed ? `Great effort! You achieved a score of ${score || 80}%.` : `You scored ${score || 50}%. Review your weak areas to improve.`;
  let tip = `Focus on improving: ${focusImprove}.`;

  return { headline, body, tip };
}

interface StoryTourCardProps {
  tourStep: number;
  teacher: { name: string; color: string; emoji: string };
  onPrev: () => void;
  onNext: () => void;
  onDismiss: () => void;
  onReplay: () => void;
  isSpeaking?: boolean;
}

export const StoryTourCard: React.FC<StoryTourCardProps> = ({
  tourStep,
  teacher,
  onPrev,
  onNext,
  onDismiss,
  onReplay,
  isSpeaking = false,
}) => {
  const currentSlide = TOUR_SLIDES[tourStep];

  return (
    <div style={{
      flex: '1 1 58%',
      width: '58%',
      minWidth: 0,
      padding: '10px 11px 9px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      borderRight: '1px solid rgba(255,255,255,0.1)',
      background: 'linear-gradient(145deg, rgba(15,23,42,0.95) 0%, rgba(30,27,75,0.95) 100%)',
    }}>
      <div>
        {/* Top Bar: Mentor Name & Step Counter */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ fontSize: 11.5 }}>{currentSlide?.emoji || '✨'}</span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 10, fontWeight: 800, color: 'var(--text)' }}>{teacher.name}</span>
            {isSpeaking && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 1.5, marginLeft: 3 }} title="Mentor Speaking">
                <span style={{ width: 2, height: 6, background: '#38bdf8', borderRadius: 1, opacity: 0.9 }} />
                <span style={{ width: 2, height: 10, background: '#818cf8', borderRadius: 1, opacity: 1 }} />
                <span style={{ width: 2, height: 5, background: '#c084fc', borderRadius: 1, opacity: 0.9 }} />
              </span>
            )}
          </div>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 7.5,
            fontWeight: 800,
            color: '#a5b4fc',
            background: 'rgba(79,70,229,0.25)',
            border: '1px solid rgba(129,140,248,0.35)',
            borderRadius: 16,
            padding: '1px 5px',
            letterSpacing: '0.3px',
          }}>
            STEP {tourStep + 1} / {TOUR_SLIDES.length}
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ width: '100%', height: 2.5, background: 'rgba(255,255,255,0.08)', borderRadius: 2, marginBottom: 5 }}>
          <div style={{
            height: '100%',
            width: `${((tourStep + 1) / TOUR_SLIDES.length) * 100}%`,
            background: 'linear-gradient(90deg, var(--accent), var(--teal))',
            borderRadius: 2,
            transition: 'width 0.35s ease',
          }} />
        </div>

        {/* Slide Title */}
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 10.5,
          fontWeight: 900,
          color: '#f8fafc',
          letterSpacing: '-0.2px',
          lineHeight: 1.2,
          marginBottom: 3,
        }}>
          {currentSlide?.title}
        </div>

        {/* Narration Text */}
        <div style={{
          fontSize: 9.5,
          color: 'var(--text-muted)',
          lineHeight: 1.38,
          fontFamily: 'var(--font-sans)',
          whiteSpace: 'pre-line',
          overflowY: 'auto',
          maxHeight: '75px',
          paddingRight: 2,
        }}>
          {currentSlide?.text}
        </div>
      </div>

      {/* Controls toolbar */}
      <div style={{ display: 'flex', gap: 3.5, marginTop: 4, width: '100%', alignItems: 'center' }}>
        {tourStep > 0 && (
          <button
            onClick={onPrev}
            title="Previous Tab (← Left Arrow)"
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 6,
              color: 'var(--text)',
              fontSize: 8.5,
              fontWeight: 700,
              padding: '4px 6px',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
            }}
          >
            ←
          </button>
        )}

        <button
          onClick={onReplay}
          title="Replay Voice Speech (Spacebar)"
          style={{
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 6,
            color: 'var(--text)',
            fontSize: 8.5,
            fontWeight: 700,
            padding: '4px 6px',
            cursor: 'pointer',
            fontFamily: 'var(--font-mono)',
          }}
        >
          🔊
        </button>

        <button
          onClick={onNext}
          title={tourStep === TOUR_SLIDES.length - 1 ? 'Complete Tour & Open Voice Setup (→ Right Arrow)' : 'Next Tab (→ Right Arrow)'}
          style={{
            flex: 1,
            background: 'linear-gradient(90deg, var(--accent) 0%, var(--purple) 100%)',
            border: 'none',
            borderRadius: 6,
            color: 'var(--text)',
            fontSize: 9,
            fontWeight: 800,
            padding: '4px 0',
            cursor: 'pointer',
            fontFamily: 'var(--font-mono)',
            boxShadow: '0 2px 8px rgba(79,70,229,0.4)',
            transition: 'opacity 0.2s',
          }}
        >
          {tourStep === TOUR_SLIDES.length - 1 ? 'Voice setup →' : 'Next →'}
        </button>

        <button
          onClick={onDismiss}
          title="Exit Tour (Escape)"
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 6,
            color: 'var(--t3)',
            fontSize: 8.5,
            fontWeight: 600,
            padding: '4px 6px',
            cursor: 'pointer',
            fontFamily: 'var(--font-mono)',
          }}
        >
          ✕
        </button>
      </div>
    </div>
  );
};

interface CongratModalProps {
  celebEvent: any;
  profile: any;
  teacher: { name: string; color: string; emoji: string };
  onClose: () => void;
}

export const CongratCard: React.FC<CongratModalProps> = ({
  celebEvent,
  profile,
  teacher,
  onClose,
}) => {
  if (!celebEvent) return null;
  const msg = buildCongratMessage(celebEvent, profile);
  const passed = celebEvent.passed !== false;

  return (
    <div style={{
      position: 'absolute',
      top: 0, left: 0, right: 0, bottom: 0,
      borderRadius: 18,
      background: passed
        ? 'linear-gradient(145deg, rgba(var(--success-deep-rgb), 0.97) 0%, rgba(var(--success-rgb), 0.97) 100%)'
        : 'linear-gradient(145deg, rgba(79,70,229,0.97) 0%, rgba(124,58,237,0.97) 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px 14px',
      gap: 8,
      zIndex: 10,
      backdropFilter: 'blur(8px)',
      boxShadow: passed
        ? '0 0 30px rgba(var(--success-deep-rgb), 0.5), inset 0 1px 1px rgba(255,255,255,0.2)'
        : '0 0 30px rgba(79,70,229,0.5), inset 0 1px 1px rgba(255,255,255,0.2)',
    }}>
      {/* Animated burst */}
      <div style={{ fontSize: 32, animation: 'bounce 0.6s ease infinite alternate', lineHeight: 1 }}>
        {passed ? '🎉' : '💪'}
      </div>
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: 12.5,
        fontWeight: 900,
        color: 'var(--text)',
        textAlign: 'center',
        lineHeight: 1.25,
        letterSpacing: '-0.3px',
      }}>
        {msg.headline}
      </div>
      <div style={{
        fontSize: 10.5,
        color: 'rgba(255,255,255,0.9)',
        textAlign: 'center',
        lineHeight: 1.45,
        fontFamily: 'var(--font-sans)',
      }}>
        {msg.body}
      </div>
      {/* Score pill */}
      {typeof celebEvent.score === 'number' && (
        <div style={{
          background: 'rgba(255,255,255,0.18)',
          border: '1px solid rgba(255,255,255,0.35)',
          borderRadius: 20,
          padding: '2px 12px',
          fontFamily: 'var(--font-mono)',
          fontSize: 12.5,
          fontWeight: 800,
          color: 'var(--text)',
        }}>
          {celebEvent.score}% score
        </div>
      )}
      <div style={{
        fontSize: 10,
        color: 'rgba(255,255,255,0.8)',
        textAlign: 'center',
        lineHeight: 1.4,
        fontStyle: 'italic',
        padding: '0 4px',
      }}>
        💡 {msg.tip}
      </div>
      <button
        onClick={onClose}
        style={{
          marginTop: 2,
          background: 'rgba(255,255,255,0.22)',
          border: '1px solid rgba(255,255,255,0.4)',
          borderRadius: 20,
          color: 'var(--text)',
          fontSize: 10,
          fontWeight: 700,
          padding: '4px 14px',
          cursor: 'pointer',
          fontFamily: 'var(--font-mono)',
          transition: 'background 0.2s',
        }}
      >
        Thanks, {teacher.name.split(' ')[1] || teacher.name}! ✓
      </button>
    </div>
  );
};