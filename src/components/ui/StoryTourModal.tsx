'use client';

import React, { useEffect, useRef } from 'react';
import { useAppStore } from '@/lib/store/useAppStore';

export interface TourSlide {
  emoji: string;
  title: string;
  tabKey: string;
  route: string;
  /** 1 = left main nav, 2 = left bottom nav, 3 = right academic drawer. */
  segment: number;
  segmentLabel: string;
  /** Narration and card copy. `{name}` / `{mentor}` are filled by getTourSlideText. */
  text: string;
  /** Fixed slot length. The tour advances on this clock, never on speech end. */
  durationMs: number;
  /** Slowly scroll the page while the slide is narrated. */
  autoScroll: boolean;
}

// ── Tour pacing ──────────────────────────────────────────────────────────────
// 8s intro + 14 left-sidebar tabs × 5s + 12s academics sidebar + 5s wrap-up = 95s.
// Every line must be speakable
// inside its slot at ~14 chars/s (neural voice) after the start deadline —
// enforced by scripts/tests/test_story_mode_timeline.cjs.
export const TOUR_TAB_MS = 5_000;
export const TOUR_INTRO_MS = 8_000;
/** The right (academics) sidebar gets one overview slide, not one per tab. */
export const TOUR_ACADEMICS_MS = 12_000;
export const TOUR_OUTRO_MS = 5_000;
/** Neural narration speed; preloading must use the same value to hit the cache. */
export const TOUR_SPEECH_SPEED = 1.0;
/** If neural audio hasn't started by then, the slide is narrated with WebSpeech. */
export const TOUR_SPEECH_START_DEADLINE_MS = 700;

// ── Story tour: intro → 10 main hubs → 4 utilities → academics sidebar overview → wrap-up ──
export const TOUR_SLIDES: TourSlide[] = [
  {
    emoji: '👋',
    title: 'Welcome to PinIT Career OS',
    tabKey: 'dashboard',
    route: '/dashboard',
    segment: 1,
    segmentLabel: 'INTRO',
    text: "Hi {name}! I'm {mentor}, your AI career mentor. Let me show you around, tab by tab.",
    durationMs: TOUR_INTRO_MS,
    autoScroll: false,
  },

  // ── Segment 1: Main Platform Navigation ──
  {
    emoji: '🏠',
    title: 'Command Center Dashboard',
    tabKey: 'dashboard',
    route: '/dashboard',
    segment: 1,
    segmentLabel: 'TAB 1/14 · DASHBOARD',
    text: 'Dashboard: your Career Score, streak and next steps.',
    durationMs: TOUR_TAB_MS,
    autoScroll: true,
  },
  {
    emoji: '🗺',
    title: 'Quests & Courses',
    tabKey: 'quests',
    route: '/quests',
    segment: 1,
    segmentLabel: 'TAB 2/14 · QUESTS',
    text: 'Quests and Courses: guided lessons that earn Pins.',
    durationMs: TOUR_TAB_MS,
    autoScroll: true,
  },
  {
    emoji: '⚡',
    title: 'Daily Missions',
    tabKey: 'missions',
    route: '/missions',
    segment: 1,
    segmentLabel: 'TAB 3/14 · DAILY MISSIONS',
    text: 'Daily Missions: five quick challenges on your gaps.',
    durationMs: TOUR_TAB_MS,
    autoScroll: true,
  },
  {
    emoji: '⚔️',
    title: 'Challenging Arena',
    tabKey: 'arena',
    route: '/arena',
    segment: 1,
    segmentLabel: 'TAB 4/14 · 1V1 ARENA',
    text: 'Arena: live one-on-one coding duels against peers.',
    durationMs: TOUR_TAB_MS,
    autoScroll: true,
  },
  {
    emoji: '🚀',
    title: 'Projects & Squads',
    tabKey: 'projects',
    route: '/projects',
    segment: 1,
    segmentLabel: 'TAB 5/14 · PROJECTS',
    text: 'Projects: team up in squads to build verified work.',
    durationMs: TOUR_TAB_MS,
    autoScroll: true,
  },
  {
    emoji: '🏆',
    title: 'Leaderboard & Leagues',
    tabKey: 'leaderboard',
    route: '/leaderboard',
    segment: 1,
    segmentLabel: 'TAB 6/14 · LEADERBOARDS',
    text: 'Leaderboards: climb weekly campus and global leagues.',
    durationMs: TOUR_TAB_MS,
    autoScroll: true,
  },
  {
    emoji: '🎙',
    title: 'AI Interview',
    tabKey: 'interview',
    route: '/interview',
    segment: 1,
    segmentLabel: 'TAB 7/14 · AI INTERVIEW',
    text: 'AI Interview: mock interviews with instant feedback.',
    durationMs: TOUR_TAB_MS,
    autoScroll: true,
  },
  {
    emoji: '💬',
    title: 'GD Practice',
    tabKey: 'group-discussion',
    route: '/group-discussion',
    segment: 1,
    segmentLabel: 'TAB 8/14 · GD PRACTICE',
    text: 'GD Practice: group discussions with AI panelists.',
    durationMs: TOUR_TAB_MS,
    autoScroll: true,
  },
  {
    emoji: '📖',
    title: 'Learning & Career Twin',
    tabKey: 'learning',
    route: '/learning',
    segment: 1,
    segmentLabel: 'TAB 9/14 · LEARNING & TWIN',
    text: 'Learning and Twin: your roadmap and skill gaps.',
    durationMs: TOUR_TAB_MS,
    autoScroll: true,
  },
  {
    emoji: '🧠',
    title: 'Attention Span',
    tabKey: 'attention-span',
    route: '/attention-span',
    segment: 1,
    segmentLabel: 'TAB 10/14 · ATTENTION SPAN',
    text: 'Attention Span: games that train deep focus.',
    durationMs: TOUR_TAB_MS,
    autoScroll: true,
  },

  // ── Segment 2: Left Nav Bottom Utilities ──
  {
    emoji: '👥',
    title: 'Friends & Network',
    tabKey: 'friends',
    route: '/friends',
    segment: 2,
    segmentLabel: 'TAB 11/14 · FRIENDS',
    text: 'Friends: connect with peers and team up for duels.',
    durationMs: TOUR_TAB_MS,
    autoScroll: true,
  },
  {
    emoji: '⚡',
    title: 'Pins & Wallet',
    tabKey: 'pins',
    route: '/pins',
    segment: 2,
    segmentLabel: 'TAB 12/14 · PINS & WALLET',
    text: 'Pins and Wallet: your balance and premium unlocks.',
    durationMs: TOUR_TAB_MS,
    autoScroll: true,
  },
  {
    emoji: '🔔',
    title: 'Notifications',
    tabKey: 'notifications',
    route: '/notifications',
    segment: 2,
    segmentLabel: 'TAB 13/14 · NOTIFICATIONS',
    text: 'Notifications: rewards, streaks and challenges.',
    durationMs: TOUR_TAB_MS,
    autoScroll: true,
  },
  {
    emoji: '👤',
    title: 'Profile & Career DNA',
    tabKey: 'profile',
    route: '/profile',
    segment: 2,
    segmentLabel: 'TAB 14/14 · PROFILE',
    text: 'Profile: your credentials, goals and AI mentor.',
    durationMs: TOUR_TAB_MS,
    autoScroll: true,
  },

  // ── Segment 3: Right Academics Sidebar (one overview, not per tab) ──
  {
    emoji: '📚',
    title: 'Academics Sidebar',
    tabKey: 'academic-sidebar',
    route: '/dashboard',
    segment: 3,
    segmentLabel: 'ACADEMICS SIDEBAR',
    text: 'This is your Academics sidebar, your campus hub. Take exams, see results and study notes, and reach library, hostel, transport, events and fees.',
    durationMs: TOUR_ACADEMICS_MS,
    autoScroll: false,
  },

  {
    emoji: '🎉',
    title: "You're All Set",
    tabKey: 'dashboard',
    route: '/dashboard',
    segment: 1,
    segmentLabel: 'WRAP-UP',
    text: "That's the tour! Now let's set up your voice.",
    durationMs: TOUR_OUTRO_MS,
    autoScroll: false,
  },
];

export const TOUR_TOTAL_MS = TOUR_SLIDES.reduce((total, slide) => total + slide.durationMs, 0);

/** Share of the whole tour (0..1) at the start and end of a slide's slot. */
export function getTourProgressRange(step: number): { from: number; to: number } {
  const startMs = TOUR_SLIDES.slice(0, step).reduce((total, slide) => total + slide.durationMs, 0);
  const slideMs = TOUR_SLIDES[step]?.durationMs ?? 0;
  return { from: startMs / TOUR_TOTAL_MS, to: (startMs + slideMs) / TOUR_TOTAL_MS };
}

/** Fills `{name}` (dropped cleanly when unknown) and `{mentor}` in a slide's text. */
export function getTourSlideText(slide: TourSlide, ctx: { name?: string; mentor?: string }): string {
  const name = (ctx.name || '').split('@')[0].trim().split(/\s+/)[0].slice(0, 20);
  return slide.text
    .replace(/(,\s*|\s+)\{name\}/g, name ? `$1${name}` : '')
    .replace(/\{mentor\}/g, ctx.mentor || 'Priya');
}

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
  /** Personalised narration text; defaults to the slide's raw text. */
  text?: string;
  /** Auto-advance is on hold because the user left the slide's page. */
  paused?: boolean;
  onPrev: () => void;
  onNext: () => void;
  onDismiss: () => void;
  onReplay: () => void;
  isSpeaking?: boolean;
}

export const StoryTourCard: React.FC<StoryTourCardProps> = ({
  tourStep,
  teacher,
  text,
  paused = false,
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
            <span style={{ fontSize: 12.5 }}>{currentSlide?.emoji || '✨'}</span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 11, fontWeight: 800, color: 'var(--text)' }}>{teacher.name}</span>
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
            fontSize: 8.5,
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
          fontSize: 11.5,
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
          fontSize: 10.5,
          color: 'var(--text-muted)',
          lineHeight: 1.38,
          fontFamily: 'var(--font-sans)',
          whiteSpace: 'pre-line',
          overflowY: 'auto',
          maxHeight: '75px',
          paddingRight: 2,
        }}>
          {text ?? currentSlide?.text}
        </div>

        {paused && (
          <div style={{
            marginTop: 4,
            fontFamily: 'var(--font-mono)',
            fontSize: 9,
            fontWeight: 700,
            color: '#fbbf24',
          }}>
            Paused. Press Next to continue the tour.
          </div>
        )}
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
              fontSize: 9.5,
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
            fontSize: 9.5,
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
            fontSize: 10,
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
            fontSize: 9.5,
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

// ── YouTube-style tour progress line pinned to the very bottom of the window ──
const TOUR_PROGRESS_COLORS = {
  dark: { fill: '#004b5b', track: 'rgba(255,255,255,0.18)' },
  light: { fill: '#fcb001', track: 'rgba(0,0,0,0.12)' },
} as const;

interface StoryTourProgressBarProps {
  tourStep: number;
  /** Changes on every slide activation (including replay) to restart the fill. */
  runKey: number;
}

export const StoryTourProgressBar: React.FC<StoryTourProgressBarProps> = ({ tourStep, runKey }) => {
  const fillRef = useRef<HTMLDivElement>(null);
  const { from, to } = getTourProgressRange(tourStep);
  const colors = TOUR_PROGRESS_COLORS[useAppStore(s => s.theme)];

  // Fill grows linearly across the slide's slot, in step with the engine's clock.
  // At the slot end it holds, so a pause or hidden tab freezes it on the boundary.
  useEffect(() => {
    const el = fillRef.current;
    const slide = TOUR_SLIDES[tourStep];
    if (!el || !slide) return;
    if (typeof el.animate !== 'function') {
      el.style.transform = `scaleX(${to})`;
      return;
    }
    const animation = el.animate(
      [{ transform: `scaleX(${from})` }, { transform: `scaleX(${to})` }],
      { duration: slide.durationMs, easing: 'linear', fill: 'forwards' },
    );
    return () => animation.cancel();
  }, [tourStep, runKey, from, to]);

  return (
    <div
      role="progressbar"
      aria-label="Story tour progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(from * 100)}
      style={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        height: 4,
        zIndex: 100000,
        background: colors.track,
        pointerEvents: 'none',
      }}
    >
      <div
        ref={fillRef}
        style={{
          width: '100%',
          height: '100%',
          background: colors.fill,
          transformOrigin: 'left center',
          transform: `scaleX(${from})`,
        }}
      />
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
      <div style={{ fontSize: 35, animation: 'bounce 0.6s ease infinite alternate', lineHeight: 1 }}>
        {passed ? '🎉' : '💪'}
      </div>
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: 14,
        fontWeight: 900,
        color: 'var(--text)',
        textAlign: 'center',
        lineHeight: 1.25,
        letterSpacing: '-0.3px',
      }}>
        {msg.headline}
      </div>
      <div style={{
        fontSize: 11.5,
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
          fontSize: 14,
          fontWeight: 800,
          color: 'var(--text)',
        }}>
          {celebEvent.score}% score
        </div>
      )}
      <div style={{
        fontSize: 11,
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
          fontSize: 11,
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
