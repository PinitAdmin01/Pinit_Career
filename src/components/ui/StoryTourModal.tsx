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

// ── Story tour: Segment 1 Left Main (10 tabs) → Segment 2 Left Bottom (3 tabs) → Segment 3 Right Sidebar (1 tab) ──
export const TOUR_SLIDES: TourSlide[] = [
  // ── Segment 1: Main Platform Navigation ──
  {
    emoji: '🏠',
    title: 'Command Center Dashboard',
    tabKey: 'dashboard',
    route: '/dashboard',
    segment: 1,
    segmentLabel: 'SEGMENT 1/3 · MAIN HUBS',
    text: "This is your Home Dashboard — your command center! Track your Career Score, XP tiers, consistency streak, and daily AI mentor recommendations.",
  },
  {
    emoji: '🗺',
    title: 'Quests & Socratic Courses',
    tabKey: 'quests',
    route: '/quests',
    segment: 1,
    segmentLabel: 'SEGMENT 1/3 · MAIN HUBS',
    text: "This is Quests & Courses — structured engineering paths. Complete socratic theory lessons and coding challenges to earn Pins and raise verified skill metrics.",
  },
  {
    emoji: '⚡',
    title: 'Daily Missions & Skill Gaps',
    tabKey: 'missions',
    route: '/missions',
    segment: 1,
    segmentLabel: 'SEGMENT 1/3 · MAIN HUBS',
    text: "This is Daily Missions — five fresh micro-challenges generated every day targeted at your skill gaps. Solve them daily to defend your streak and earn bonus XP.",
  },
  {
    emoji: '⚔️',
    title: 'Challenging Arena (1v1 Battles)',
    tabKey: 'arena',
    route: '/arena',
    segment: 1,
    segmentLabel: 'SEGMENT 1/3 · MAIN HUBS',
    text: "This is Challenging Arena — step into live 1-on-1 coding battles and DSA showdowns! Test your algorithmic speed, outcode opponents, and climb the battle rankings.",
  },
  {
    emoji: '🚀',
    title: 'Projects & Industry Squads',
    tabKey: 'projects',
    route: '/projects',
    segment: 1,
    segmentLabel: 'SEGMENT 1/3 · MAIN HUBS',
    text: "This is Projects & Squads — collaborate on production-ready software systems with peers. Everything you build provides verifiable proof-of-work for recruiters.",
  },
  {
    emoji: '🏆',
    title: 'Leaderboards & League Tiers',
    tabKey: 'leaderboard',
    route: '/leaderboard',
    segment: 1,
    segmentLabel: 'SEGMENT 1/3 · MAIN HUBS',
    text: "This is Leaderboards & Leagues — see how your performance ranks campus-wide and globally. Earn promotions from Bronze to Grandmaster in weekly sprints.",
  },
  {
    emoji: '🎙',
    title: 'AI Mock Interview Studio',
    tabKey: 'interview',
    route: '/interview',
    segment: 1,
    segmentLabel: 'SEGMENT 1/3 · MAIN HUBS',
    text: "This is AI Interview — live 1-on-1 technical and behavioral mock interviews with instant feedback on algorithm efficiency, code structure, and STAR responses.",
  },
  {
    emoji: '💬',
    title: 'GD Practice Arena',
    tabKey: 'group-discussion',
    route: '/group-discussion',
    segment: 1,
    segmentLabel: 'SEGMENT 1/3 · MAIN HUBS',
    text: "This is GD Practice — boardroom debates against AI avatars. Train your speech articulation, argument formulation, and leadership confidence.",
  },
  {
    emoji: '📖',
    title: 'Learning & Career Twin',
    tabKey: 'learning',
    route: '/learning?tab=twin',
    segment: 1,
    segmentLabel: 'SEGMENT 1/3 · MAIN HUBS',
    text: "This is Learning & Career Twin — compare your skills against dream engineering tracks. Our AI diagnoses your gaps and generates customized learning roadmaps.",
  },
  {
    emoji: '🧠',
    title: 'Attention Span Trainer',
    tabKey: 'attention-span',
    route: '/attention-span',
    segment: 1,
    segmentLabel: 'SEGMENT 1/3 · MAIN HUBS',
    text: "This is Attention Span — gamified cognitive endurance exercises. Train your deep focus, reaction speed, and stamina for long software development sessions.",
  },

  // ── Segment 2: Left Nav Bottom Hubs (In exact ordered sequence) ──
  {
    emoji: '👥',
    title: 'Friends & Collaboration Hub',
    tabKey: 'friends',
    route: '/friends',
    segment: 2,
    segmentLabel: 'SEGMENT 2/3 · ESSENTIAL UTILITIES',
    text: "This is Friends & Student Network — discover peers, send requests, chat directly, and team up for 1-on-1 arena duels and collaborative squad projects.",
  },
  {
    emoji: '⚡',
    title: 'Pins Economy & Wallet',
    tabKey: 'pins',
    route: '/pins',
    segment: 2,
    segmentLabel: 'SEGMENT 2/3 · ESSENTIAL UTILITIES',
    text: "This is Pins & Wallet — track your earned Pins balance, unlock advanced AI mock interviews, and access premium socratic quests.",
  },
  {
    emoji: '🔔',
    title: 'Notifications Hub',
    tabKey: 'notifications',
    route: '/notifications',
    segment: 2,
    segmentLabel: 'SEGMENT 2/3 · ESSENTIAL UTILITIES',
    text: "This is Notifications — your instant dispatch center. Receive real-time alerts for quest rewards, streak milestones, and peer challenges.",
  },
  {
    emoji: '👤',
    title: 'Profile & Career DNA',
    tabKey: 'profile',
    route: '/profile',
    segment: 2,
    segmentLabel: 'SEGMENT 2/3 · ESSENTIAL UTILITIES',
    text: "This is your Profile — view your verified credentials, manage career goals, view your full Career DNA, and select your AI mentor.",
  },

  // ── Segment 3: Academic Right Sidebar Drawer ──
  {
    emoji: '📚',
    title: 'Academic Portal & Exam Hub',
    tabKey: 'academic-sidebar',
    route: '/dashboard',
    segment: 3,
    segmentLabel: 'SEGMENT 3/3 · ACADEMIC DRAWER',
    text: "This is the Academic Portal on your right sidebar! Open it anytime to take scheduled proctored exams, check official results, view study notes, and browse campus services.",
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
  7: '/group-discussion',
  8: '/learning?tab=twin',
  9: '/attention-span',
  10: '/friends',
  11: '/pins',
  12: '/notifications',
  13: '/profile',
  14: '/dashboard',
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
}

export const StoryTourCard: React.FC<StoryTourCardProps> = ({
  tourStep,
  teacher,
  onPrev,
  onNext,
  onDismiss,
  onReplay,
}) => {
  const currentSlide = TOUR_SLIDES[tourStep];

  return (
    <div style={{
      flex: '1 1 58%',
      width: '58%',
      minWidth: 0,
      padding: '14px 14px 12px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      borderRight: '1px solid rgba(255,255,255,0.1)',
      background: 'linear-gradient(145deg, rgba(15,23,42,0.95) 0%, rgba(30,27,75,0.95) 100%)',
    }}>
      <div>
        {/* Top Bar: Mentor Name & Step Counter */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ fontSize: 13 }}>{currentSlide?.emoji || '✨'}</span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 11, fontWeight: 800, color: 'var(--text)' }}>{teacher.name}</span>
          </div>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 8.5,
            fontWeight: 800,
            color: '#a5b4fc',
            background: 'rgba(79,70,229,0.25)',
            border: '1px solid rgba(129,140,248,0.35)',
            borderRadius: 20,
            padding: '2px 7px',
            letterSpacing: '0.4px',
          }}>
            STEP {tourStep + 1} / {TOUR_SLIDES.length}
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ width: '100%', height: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 2, marginBottom: 7 }}>
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
          fontSize: 12,
          fontWeight: 900,
          color: '#f8fafc',
          letterSpacing: '-0.2px',
          lineHeight: 1.2,
          marginBottom: 4,
        }}>
          {currentSlide?.title}
        </div>

        {/* Narration Text */}
        <div style={{
          fontSize: 10.5,
          color: 'var(--text-muted)',
          lineHeight: 1.45,
          fontFamily: 'var(--font-sans)',
          whiteSpace: 'pre-line',
          overflowY: 'auto',
          maxHeight: '80px',
          paddingRight: 4,
        }}>
          {currentSlide?.text}
        </div>
      </div>

      {/* Controls toolbar */}
      <div style={{ display: 'flex', gap: 4, marginTop: 6, width: '100%', alignItems: 'center' }}>
        {tourStep > 0 && (
          <button
            onClick={onPrev}
            title="Previous Tab"
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 7,
              color: 'var(--text)',
              fontSize: 9.5,
              fontWeight: 700,
              padding: '5px 8px',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
            }}
          >
            ←
          </button>
        )}

        <button
          onClick={onReplay}
          title="Replay Voice Speech"
          style={{
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 7,
            color: 'var(--text)',
            fontSize: 9.5,
            fontWeight: 700,
            padding: '5px 8px',
            cursor: 'pointer',
            fontFamily: 'var(--font-mono)',
          }}
        >
          🔊
        </button>

        <button
          onClick={onNext}
          style={{
            flex: 1,
            background: 'linear-gradient(90deg, var(--accent) 0%, var(--purple) 100%)',
            border: 'none',
            borderRadius: 7,
            color: 'var(--text)',
            fontSize: 10,
            fontWeight: 800,
            padding: '5px 0',
            cursor: 'pointer',
            fontFamily: 'var(--font-mono)',
            boxShadow: '0 2px 10px rgba(79,70,229,0.4)',
            transition: 'opacity 0.2s',
          }}
        >
          {tourStep === TOUR_SLIDES.length - 1 ? 'Voice setup →' : 'Next →'}
        </button>

        <button
          onClick={onDismiss}
          title="Exit Tour"
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 7,
            color: 'var(--t3)',
            fontSize: 9.5,
            fontWeight: 600,
            padding: '5px 7px',
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