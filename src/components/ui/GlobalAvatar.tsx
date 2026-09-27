'use client';

import React, { useState, useEffect, useRef, useCallback, Suspense, lazy } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useCareerOS } from '@/lib/context/CareerOSContext';
import { speakWithAvatar, stopSpeaking, preloadTTS, setStoryTourAudioLock } from '@/lib/tts';
import VoiceRegistrationModal from '@/components/avatar/VoiceRegistrationModal';
import { completeStoryTour, isStoryTourPending, resetStoryTour } from '@/lib/storyTour';
import { StoryTourEngine, tourRoutePath } from '@/lib/storyTourEngine';
import { matchNavigationIntent } from '@/components/avatar/hooks/useVoiceNavigation';
import {
  StoryTourCard,
  StoryTourProgressBar,
  CongratCard,
  TOUR_SLIDES,
  TOUR_SPEECH_SPEED,
  TOUR_SPEECH_START_DEADLINE_MS,
  buildCongratMessage,
  getTourSlideText,
} from './StoryTourModal';

const AvatarMentorWidget = lazy(() => import('@/components/avatar/AvatarMentorWidget'));

export const TEACHER_CONFIG: Record<string, { name: string; color: string; emoji: string }> = {
  priya:  { name: 'Ms. Priya',  color: '#4f46e5', emoji: '👩‍💼' },
  anish:  { name: 'Mr. Anish',  color: '#0891b2', emoji: '👨‍💼' },
};

export interface GlobalAvatarProps {
  user: any;
  profile: any;
  refreshProfile?: () => void;
  onOpenRightSidebar?: () => void;
  onExpandLeftNav?: () => void;
  isRightSidebarOpen?: boolean;
  isLeftSidebarOpen?: boolean;
  onTourSlideChange?: (route: string | null, tabKey: string | null) => void;
}

// ── Slow parallel auto-scroll while a tour slide is narrated ─────────────────
// `.page-content` is AppShell's scroll container (the window itself never scrolls).
const TOUR_SCROLL_START_DELAY_MS = 700; // let the page paint and narration begin
const TOUR_SCROLL_END_HOLD_MS = 500;    // settle before the next tab
const TOUR_SCROLL_PX_PER_SEC = 160;     // average speed: slow enough to read along

function getTourScroller(): HTMLElement | null {
  return document.querySelector<HTMLElement>('.page-content');
}

function scrollTourPageToTop(): () => void {
  if (typeof window !== 'undefined') {
    getTourScroller()?.scrollTo({ top: 0, behavior: 'smooth' });
  }
  return () => {};
}

function startTourAutoScroll(windowMs: number): () => void {
  if (typeof window === 'undefined') return () => {};
  const initial = getTourScroller();
  if (initial) initial.scrollTop = 0;

  const runMs = windowMs - TOUR_SCROLL_START_DELAY_MS - TOUR_SCROLL_END_HOLD_MS;
  if (runMs < 800) return () => {};
  const maxDistance = (TOUR_SCROLL_PX_PER_SEC * runMs) / 1000;

  let stopped = false;
  let rafId: number | null = null;
  let startTimer: ReturnType<typeof setTimeout> | null = null;

  const stop = () => {
    if (stopped) return;
    stopped = true;
    if (startTimer) clearTimeout(startTimer);
    if (rafId !== null) cancelAnimationFrame(rafId);
    window.removeEventListener('wheel', onUserGesture);
    window.removeEventListener('touchmove', onUserGesture);
    window.removeEventListener('pointerdown', onUserGesture);
  };

  // The user takes over as soon as they scroll or click the page (not the tour card).
  function onUserGesture(e: Event) {
    if (e.target instanceof Element && e.target.closest('[data-story-tour-card]')) return;
    stop();
  }

  window.addEventListener('wheel', onUserGesture, { passive: true });
  window.addEventListener('touchmove', onUserGesture, { passive: true });
  window.addEventListener('pointerdown', onUserGesture, { passive: true });

  startTimer = setTimeout(() => {
    const startedAt = performance.now();
    const frame = (now: number) => {
      if (stopped) return;
      const progress = Math.min(1, Math.max(0, (now - startedAt) / runMs));
      const eased = 0.5 - Math.cos(Math.PI * progress) / 2; // ease-in-out sine: soft start and stop
      const el = getTourScroller();
      if (el) {
        // Re-measured every frame: pages keep growing while their data loads.
        const distance = Math.min(el.scrollHeight - el.clientHeight, maxDistance);
        if (distance > 0) el.scrollTop = distance * eased;
      }
      if (progress < 1) {
        rafId = requestAnimationFrame(frame);
      } else {
        stop();
      }
    };
    rafId = requestAnimationFrame(frame);
  }, TOUR_SCROLL_START_DELAY_MS);

  return stop;
}

export const GlobalAvatar: React.FC<GlobalAvatarProps> = ({
  user,
  profile,
  refreshProfile,
  onOpenRightSidebar,
  onExpandLeftNav,
  isRightSidebarOpen = false,
  isLeftSidebarOpen = true,
  onTourSlideChange,
}) => {
  const cOS = useCareerOS();
  const pathname = usePathname();
  const router = useRouter();
  const cleanPath = pathname?.replace(/\/$/, '') || '';

  const isOnboardingOrAuth = cleanPath === '/onboarding' || cleanPath.startsWith('/onboarding') || cleanPath === '/login' || cleanPath === '/signup' || cleanPath === '';

  const {
    onboardingStep, setOnboardingStep,
    roadmapGenerated,
  } = cOS;

  const [mounted, setMounted] = useState(false);
  const [showSpeechBubble, setShowSpeechBubble] = useState(true);
  const [minimized, setMinimized] = useState(true);
  const [isEnlarged, setIsEnlarged] = useState(false);
  const [showVoiceRegModal, setShowVoiceRegModal] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceListeningActive, setVoiceListeningActive] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setVoiceListeningActive(localStorage.getItem('pinit_voice_wake_active') === 'true');
    }
  }, []);

  const toggleVoiceListening = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setVoiceListeningActive(prev => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem('pinit_voice_wake_active', next ? 'true' : 'false');
      }
      return next;
    });
  };

  // ── Tour state ─────────────────────────────────────────────────────────────
  // The StoryTourEngine owns the tour clock (fixed slot per slide). Narration and
  // scrolling run inside a slot but never advance the tour themselves.
  const [tourActive, setTourActive] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const [tourPaused, setTourPaused] = useState(false);
  const [tourSlideRun, setTourSlideRun] = useState(0);
  const [storyLocked, setStoryLocked] = useState(false);
  const tourEngineRef = useRef<StoryTourEngine | null>(null);
  const tourPreloadingRef = useRef(false);
  const cleanPathRef = useRef(cleanPath);
  cleanPathRef.current = cleanPath;

  // Latest-value refs: the tour engine lives across renders and AppShell passes
  // fresh inline callbacks on every render.
  const routerRef = useRef(router);
  routerRef.current = router;
  const onExpandLeftNavRef = useRef(onExpandLeftNav);
  onExpandLeftNavRef.current = onExpandLeftNav;
  const onOpenRightSidebarRef = useRef(onOpenRightSidebar);
  onOpenRightSidebarRef.current = onOpenRightSidebar;
  const onTourSlideChangeRef = useRef(onTourSlideChange);
  onTourSlideChangeRef.current = onTourSlideChange;

  // ── Congratulations state ──────────────────────────────────────────────────
  const [celebEvent, setCelebEvent] = useState<any>(null);
  const celebTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const spokenCelebRef = useRef<any>(null);

  const teacherId = profile?.guidanceMentorId || 'priya';
  const teacher = TEACHER_CONFIG[teacherId] || TEACHER_CONFIG.priya;
  const teacherIdRef = useRef(teacherId);
  teacherIdRef.current = teacherId;
  const tourTextContext = { name: user?.displayName || '', mentor: teacher.name };
  const tourTextContextRef = useRef(tourTextContext);
  tourTextContextRef.current = tourTextContext;

  // ── 1. Inactive during active tasks & teaching processes ─────────────────────
  const isLessonOrDetail = cleanPath === '/quests/lesson' || (cleanPath.startsWith('/quests/') && cleanPath !== '/quests/teacher-select' && cleanPath !== '/quests');
  const isInterview = cleanPath === '/interview' || cleanPath.startsWith('/interview/');
  const isGroupDiscussion = cleanPath === '/group-discussion' || cleanPath.startsWith('/group-discussion/');
  const isMissions = cleanPath === '/missions' || cleanPath.startsWith('/missions/');
  const isAttentionSpan = cleanPath === '/attention-span' || cleanPath.startsWith('/attention-span/');
  const isExam = cleanPath === '/exams' || cleanPath.startsWith('/exam/');

  // Floating avatar MUST BE STRICTLY INACTIVE & DISCONNECTED during any active task or process!
  const isTaskOrProcessActive = isLessonOrDetail || isInterview || isGroupDiscussion || isMissions || isAttentionSpan || isExam;
  const shouldHideVisually = isTaskOrProcessActive && !celebEvent && !tourActive && !showVoiceRegModal && !storyLocked;

  useEffect(() => {
    if (isTaskOrProcessActive && !tourActive && !celebEvent) {
      stopSpeaking();
    }
  }, [isTaskOrProcessActive, tourActive, celebEvent]);

  useEffect(() => {
    setMounted(true);
    return () => {
      tourEngineRef.current?.stop();
      setStoryTourAudioLock(false);
      stopSpeaking(true);
    };
  }, []);

  // ── 2. Auto-close / auto-dock floating avatar after 15s of inactivity ────────
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetIdleTimer = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    if (!minimized && !tourActive && !celebEvent) {
      idleTimerRef.current = setTimeout(() => {
        setMinimized(true);
      }, 15000);
    }
  }, [minimized, tourActive, celebEvent]);

  useEffect(() => {
    resetIdleTimer();
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [resetIdleTimer]);

  // ── 3. Wake word listener (Strictly Opt-In & Transparent) ─────────────────
  useEffect(() => {
    // Explicitly pause speech recognition while story tour is active or disabled
    if (typeof window === 'undefined' || isOnboardingOrAuth || !voiceListeningActive || tourActive) return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    let recognition: any = null;
    let isMounted = true;
    try {
      recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        if (!isMounted || !voiceListeningActive) return;
        const transcript = Array.from(event.results)
          .map((r: any) => r[0].transcript)
          .join(' ')
          .toLowerCase();

        const mentorName = teacher.name.split(' ')[1]?.toLowerCase() || teacher.name.toLowerCase();
        // Clean wake words (removed false triggers: freya, riya)
        const hasWakeWord = /\b(hey|hay|hi|hello)\b/i.test(transcript) ||
                            /\b(priya|anish|vikram|kashyap|karthic|maya|divya|aisha|rohan|shalini)\b/i.test(transcript) ||
                            transcript.includes(mentorName);

        if (!hasWakeWord) return;

        setMinimized(false);
        resetIdleTimer();
        stopSpeaking();

        const currentActivePath = cleanPathRef.current;

        // 1. Socratic Guidance Queries
        const isWhatToDoQuery = transcript.includes('what to do') ||
                                transcript.includes('what should i do') ||
                                transcript.includes('what next') ||
                                transcript.includes('recommend') ||
                                transcript.includes('where to go') ||
                                transcript.includes('guide me') ||
                                transcript.includes('what should i study');

        if (isWhatToDoQuery) {
          let advice = "I recommend checking your Daily Missions to solve gap-closure challenges and build your streak!";
          if (currentActivePath === '/dashboard') {
            advice = "Head to the Missions tab to solve today's gap-closure challenges, or Quests to continue your active learning track!";
          } else if (currentActivePath === '/quests') {
            advice = "Explore your active socratic courses to earn Pins and increase your verified skill metrics!";
          } else if (currentActivePath === '/missions') {
            advice = "Complete today's daily challenges to close your skill gaps and protect your consistency streak!";
          } else if (currentActivePath === '/arena') {
            advice = "Enter a 1v1 speedrun battle or algorithm duel to test your skills against other students!";
          } else if (currentActivePath === '/interview') {
            advice = "Start a simulated AI technical interview to practice behavioral and algorithmic questions with live feedback!";
          }
          speakWithAvatar(advice, teacherId, () => {}, () => {});
          return;
        }

        // 2. Route Navigation Commands via Precision Vocabulary
        const navResult = matchNavigationIntent(transcript);
        if (navResult.matched && navResult.confidence >= 0.5) {
          speakWithAvatar(`Navigating to ${navResult.displayName}!`, teacherId, () => {}, () => {});
          router.push(navResult.path);
          return;
        }

        // 3. General Wake Word Greeting
        speakWithAvatar(`Yes! I am here. Say "go to missions" or ask "what should I do now?"`, teacherId, () => {}, () => {});
      };

      recognition.onerror = (err: any) => {
        if (err.error === 'not-allowed') {
          console.warn('[PinIT Speech] Permission denied.');
          setVoiceListeningActive(false);
          if (typeof window !== 'undefined') {
            localStorage.setItem('pinit_voice_wake_active', 'false');
          }
        }
      };

      recognition.start();
    } catch {
      // Gracefully ignore startup collision
    }

    return () => {
      isMounted = false;
      if (recognition) {
        try { recognition.stop(); } catch {}
      }
    };
  }, [teacher.name, teacherId, user?.id, resetIdleTimer, router, isOnboardingOrAuth, voiceListeningActive, tourActive]);

  // ── Story tour engine ──────────────────────────────────────────────────────
  // Engine callbacks read the latest render's handlers through this ref.
  const tourHandlersRef = useRef<{
    activate: (index: number) => void;
    arm: (index: number, remainingMs: number) => () => void;
    finish: () => void;
  } | null>(null);

  const getTourEngine = useCallback((): StoryTourEngine => {
    if (!tourEngineRef.current) {
      tourEngineRef.current = new StoryTourEngine(TOUR_SLIDES, {
        getPath: () => cleanPathRef.current,
        navigate: (route) => routerRef.current.push(route),
        onSlideActivated: (index) => tourHandlersRef.current?.activate(index),
        onSlideArmed: (index, remainingMs) => tourHandlersRef.current?.arm(index, remainingMs) ?? (() => {}),
        onPausedChange: (paused) => setTourPaused(paused),
        onFinished: () => tourHandlersRef.current?.finish(),
      });
    }
    return tourEngineRef.current;
  }, []);

  // Warm the TTS cache for every slide in tour order so each tab's narration can
  // start instantly. Sequential on purpose: slide 1 first, free-tier friendly.
  const preloadTourNarration = useCallback(() => {
    if (tourPreloadingRef.current) return;
    tourPreloadingRef.current = true;
    const voiceId = teacherIdRef.current;
    const texts = TOUR_SLIDES.map(slide => getTourSlideText(slide, tourTextContextRef.current));
    void (async () => {
      try {
        for (const text of texts) {
          await preloadTTS(text, voiceId, TOUR_SPEECH_SPEED);
        }
      } finally {
        tourPreloadingRef.current = false;
      }
    })();
  }, []);

  const startTour = useCallback(() => {
    setStoryTourAudioLock(true);
    stopSpeaking(true);
    setCelebEvent(null);
    setStoryLocked(true);
    setTourPaused(false);
    setTourActive(true);
    setMinimized(false);
    const prefetched = new Set<string>();
    TOUR_SLIDES.forEach(slide => {
      const path = tourRoutePath(slide.route);
      if (prefetched.has(path)) return;
      prefetched.add(path);
      routerRef.current.prefetch(path);
    });
    preloadTourNarration();
    getTourEngine().start(0);
  }, [getTourEngine, preloadTourNarration]);

  // Tour closed before voice setup (✕, Escape, or the cancel event).
  const endTour = useCallback((returnHome: boolean) => {
    tourEngineRef.current?.stop();
    setStoryTourAudioLock(false);
    stopSpeaking(true);
    setIsSpeaking(false);
    setTourActive(false);
    setTourPaused(false);
    setStoryLocked(false);
    completeStoryTour(user?.id);
    if (returnHome && cleanPathRef.current !== '/dashboard') {
      routerRef.current.push('/dashboard');
    }
  }, [user?.id]);

  // Last slide finished: hand over to voice registration.
  const openVoiceSegment = useCallback(() => {
    tourEngineRef.current?.stop();
    setStoryTourAudioLock(false);
    stopSpeaking(true);
    setIsSpeaking(false);
    setTourActive(false);
    setTourPaused(false);
    setMinimized(false);
    setShowVoiceRegModal(true);
    if (cleanPathRef.current !== '/dashboard') routerRef.current.push('/dashboard');
  }, []);

  tourHandlersRef.current = {
    activate: (index) => {
      setTourStep(index);
      setTourSlideRun(run => run + 1);
      // AppShell enforces mutual exclusion: opening one sidebar collapses the other.
      if (TOUR_SLIDES[index].segment === 3) {
        onOpenRightSidebarRef.current?.();
      } else {
        onExpandLeftNavRef.current?.();
      }
    },
    arm: (index, remainingMs) => {
      const slide = TOUR_SLIDES[index];
      let live = true;
      console.log('[PinIT Tour] 🎬 Step ' + (index + 1) + '/' + TOUR_SLIDES.length + ': "' + slide.title + '" on ' + cleanPathRef.current + ' (' + remainingMs + 'ms left in slot)');
      speakWithAvatar(
        getTourSlideText(slide, tourTextContextRef.current),
        teacherIdRef.current,
        () => { if (live) setIsSpeaking(true); },
        () => { if (live) setIsSpeaking(false); },
        false,
        true,
        undefined,
        TOUR_SPEECH_SPEED,
        slide.durationMs,
        { force: true, singleShot: true, startDeadlineMs: TOUR_SPEECH_START_DEADLINE_MS },
      );
      const stopScroll = slide.autoScroll ? startTourAutoScroll(remainingMs) : scrollTourPageToTop();
      return () => {
        live = false;
        stopScroll();
        stopSpeaking(true);
        setIsSpeaking(false);
      };
    },
    finish: openVoiceSegment,
  };

  // Arm the current slide (narration + scroll) as soon as its route has rendered.
  useEffect(() => {
    if (tourActive) tourEngineRef.current?.notifyPathChange(cleanPath);
  }, [tourActive, cleanPath]);

  // ── Auto-start story tour post-onboarding ──────────────────────────────────
  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return;
    if (tourActive || showVoiceRegModal) return;

    if (!isStoryTourPending(user?.id, user)) return;

    if (cleanPath !== '/dashboard') {
      return;
    }

    const t = window.setTimeout(() => {
      completeStoryTour(user?.id);
      startTour();
    }, 500);
    return () => window.clearTimeout(t);
  }, [mounted, user, cleanPath, tourActive, showVoiceRegModal, startTour]);

  // ── Broadcast active tour tab for live sidebar spotlighting ────────────────
  useEffect(() => {
    const slide = tourActive ? TOUR_SLIDES[tourStep] : undefined;
    onTourSlideChangeRef.current?.(slide ? slide.route : null, slide ? slide.tabKey : null);
  }, [tourActive, tourStep]);

  // ── Listen for activity completion and story mode trigger events ──────────
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (!detail) return;
      refreshProfile?.();
      if (celebTimerRef.current) clearTimeout(celebTimerRef.current);
      setCelebEvent(detail);
      setMinimized(false);
      celebTimerRef.current = setTimeout(() => setCelebEvent(null), 14000);
    };

    const storyHandler = () => {
      resetStoryTour(user?.id);
      startTour();
    };

    const congratsHandler = (e: Event) => {
      const custom = (e as CustomEvent).detail;
      const testCeleb = custom || {
        type: 'mission',
        title: 'Daily Milestone Accomplished!',
        score: 100,
        passed: true,
      };
      stopSpeaking();
      refreshProfile?.();
      if (celebTimerRef.current) clearTimeout(celebTimerRef.current);
      setCelebEvent(testCeleb);
      setMinimized(false);
    };

    const cancelStoryHandler = () => {
      endTour(false);
      setMinimized(false);
    };

    window.addEventListener('pinit:activity_complete', handler);
    window.addEventListener('pinit:start_story_mode', storyHandler);
    window.addEventListener('pinit:cancel_story_mode', cancelStoryHandler);
    window.addEventListener('pinit:trigger_congrats', congratsHandler);
    return () => {
      window.removeEventListener('pinit:activity_complete', handler);
      window.removeEventListener('pinit:start_story_mode', storyHandler);
      window.removeEventListener('pinit:cancel_story_mode', cancelStoryHandler);
      window.removeEventListener('pinit:trigger_congrats', congratsHandler);
      if (celebTimerRef.current) clearTimeout(celebTimerRef.current);
    };
  }, [refreshProfile, user?.id, startTour, endTour]);

  const dismissTour = useCallback(() => endTour(true), [endTour]);
  const prevTourSlide = useCallback(() => tourEngineRef.current?.prev(), []);
  const nextTourSlide = useCallback(() => tourEngineRef.current?.next(), []);
  const replayCurrentSlide = useCallback(() => tourEngineRef.current?.replay(), []);

  const startStoryMode = useCallback(() => {
    resetStoryTour(user?.id);
    startTour();
  }, [user?.id, startTour]);

  // Speak congratulations out loud when a celebration triggers
  useEffect(() => {
    if (celebEvent && celebEvent !== spokenCelebRef.current) {
      spokenCelebRef.current = celebEvent;
      const msg = buildCongratMessage(celebEvent, profile);
      const textToSpeak = `Well done! ${msg.body} ${msg.tip}`;
      const cleanText = textToSpeak.replace(/\*\*/g, '').replace(/🎉|🏆|💪|🧑‍💻|⚡|🔥|🗺|🎤|💬/g, '');

      stopSpeaking();
      speakWithAvatar(cleanText, teacherId, () => {}, () => {});
    }
  }, [celebEvent, teacherId, profile]);

  // Sync tutorial steps based on current path and state changes
  useEffect(() => {
    if (roadmapGenerated && onboardingStep < 4) {
      setOnboardingStep(4);
    } else if (onboardingStep === 1 && pathname === '/career-twin') {
      setOnboardingStep(2);
    }
  }, [pathname, onboardingStep, roadmapGenerated, setOnboardingStep]);

  // ── Keyboard accessibility for story tour (Arrow keys, Space, Escape) ─────
  useEffect(() => {
    if (!tourActive) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextTourSlide();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevTourSlide();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        dismissTour();
      } else if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        replayCurrentSlide();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [tourActive, nextTourSlide, prevTourSlide, dismissTour, replayCurrentSlide]);

  if (!mounted || isOnboardingOrAuth) return null;

  const isCentered = onboardingStep === 0;

  let dialogueText = '';
  let showButton = false;
  let buttonText = '';
  let onButtonClick = () => {};

  if (!tourActive && !celebEvent) {
    if (onboardingStep === 0) {
      dialogueText = "Welcome! I am your AI Career Mentor. Let's build your career profile, compile your credentials, and design a socratic learning roadmap to qualify for top engineering roles!";
      showButton = true;
      buttonText = "Let's Begin!";
      onButtonClick = () => setOnboardingStep(1);
    } else if (onboardingStep === 1) {
      dialogueText = "Welcome to the Command Center Dashboard! This panel tracks your XP progression, consistency streak, and Career DNA. To start, click on the 'Career Twin' tab to initialize your digital twin profile!";
    } else if (onboardingStep === 2) {
      dialogueText = "We are in the Career Twin studio. Map your current skills against your desired engineering track. When you are ready, return to the Dashboard and choose a Trajectory to build your custom quest roadmap!";
    } else if (onboardingStep === 3 || onboardingStep === 4) {
      if (!roadmapGenerated) {
        dialogueText = "Select your target SDE trajectory on the Dashboard page below to compile your custom quest roadmap!";
      } else {
        dialogueText = "Your custom quest roadmap is compiled! Head to the 'Quests' tab to begin learning or the 'Missions' tab to solve daily gap-closure challenges!";
      }
    } else if (onboardingStep === 5) {
      dialogueText = "Excellent job! You are progressing nicely. Keep completing quests to build your Career DNA and Vault documents!";
    } else {
      const TAB_GUIDES: Record<string, string> = {
        '/dashboard': "🏠 **Home Dashboard** — Your command center! Here you can see your Career Score, active mission streak, XP tier progression, and AI-personalised recommendations. Keep your streak alive with daily missions!",
        '/quests': "🗺 **Quests** — Your socratic learning curriculum! Complete guided coding challenges and theory lessons to earn Pins and verify your mastery.",
        '/career-twin': "🧬 **Career Twin** — Map your Current Self against your Future Self (target role). We'll calculate your alignment percentage and identify exact skill gaps!",
        '/learning': "📖 **Learning & Roadmap** — Track your milestone roadmap, skill competencies, and deep-dive learning modules to qualify for top roles.",
        '/missions': "⚡ **Daily Missions** — 5 personalised micro-challenges generated every day based on your skill gaps. Complete them to maintain your streak and earn bonus XP!",
        '/arena': "⚔️ **Challenging Arena** — Compete in live 1v1 coding face-offs, algorithmic battles, and timed DSA challenges against peers.",
        '/projects': "🚀 **Projects & Squads** — Collaborate on production-grade software and build verifiable portfolio projects for recruiters.",
        '/leaderboard': "🏆 **Leaderboards & Leagues** — Track your global and campus rank, climb through weekly league tiers, and earn sprint promotions.",
        '/interview': "🎙 **AI Interview** — Practice realistic mock interviews with instant AI scoring on coding logic, problem decomposition, and STAR responses.",
        '/group-discussion': "💬 **GD Practice** — Engage in boardroom debates against AI avatars to build speaking confidence and argument structure.",
        '/attention-span': "🧠 **Attention Span** — Gamified cognitive focus exercises to train your endurance and stamina for long engineering sprints.",
        '/notifications': "🔔 **Notifications** — Real-time alerts for quest rewards, streak milestones, recruiter profile views, and mission assignments.",
        '/friends': "👥 **Friends & Network** — Connect with peers, challenge friends to 1v1 Arena Duels, collaborate on Squad Projects, and build your university network.",
        '/pins': "⚡ **Pins & Wallet** — Track your earned Pins balance, recharge, and unlock premium AI features.",
        '/profile': "👤 **Profile** — Manage settings, configure vocal biometrics, inspect your Career DNA genome, and select your AI mentor personality.",
      };

      const matchedGuide = Object.entries(TAB_GUIDES).find(([path]) => pathname.startsWith(path));
      if (matchedGuide) {
        dialogueText = matchedGuide[1];
      } else {
        dialogueText = "🧬 Your Career OS is fully operational! Navigate to any tab and I'll explain how it works. Ask me anything!";
      }
    }
  }

  return (
    <>
      {/* ── Story tour progress line (bottom edge of the window) ── */}
      {tourActive && <StoryTourProgressBar tourStep={tourStep} runKey={tourSlideRun} />}

      {/* ── Floating avatar launcher button (when minimized) ── */}
      {minimized && (
        <div
          onClick={() => {
            setMinimized(false);
            resetIdleTimer();
          }}
          title="Talk to your AI Career Mentor"
          style={{
            position: 'fixed',
            bottom: 18,
            zIndex: 9999,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: 'linear-gradient(135deg, rgba(15,23,42,0.92) 0%, rgba(30,27,75,0.92) 100%)',
            backdropFilter: 'blur(12px)',
            border: '1.5px solid rgba(var(--brand-rgb), 0.4)',
            borderRadius: 24,
            padding: '5px 11px 5px 6px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 20px rgba(var(--brand-rgb), 0.25)',
            
            opacity: 0.4,
            transition: 'opacity 0.3s ease, transform 0.3s ease, box-shadow 0.2s',
            left: '50%',
            right: 'auto',
            transform: 'translateX(-50%)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.opacity = '1';
            e.currentTarget.style.transform = 'translateX(-50%) scale(1.05)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.opacity = '0.4';
            e.currentTarget.style.transform = 'translateX(-50%)';
          }}
        >
          <div style={{
            width: 30,
            height: 30,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--accent), var(--purple))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 14,
            boxShadow: '0 2px 10px rgba(79,70,229,0.5)',
            position: 'relative'
          }}>
            {teacher.emoji}
            <span style={{
              position: 'absolute',
              bottom: 1,
              right: 1,
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: '#22c55e',
              border: '1.5px solid #0f172a'
            }} />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, fontWeight: 800, color: 'var(--text)' }}>
              {teacher.name}
            </div>
            <div style={{ fontSize: 8.5, color: voiceListeningActive ? '#34d399' : '#a5b4fc', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: 4 }}>
              {voiceListeningActive ? (
                <>
                  <span style={{ color: '#ef4444' }}>🎙️</span> Listening
                </>
              ) : (
                <>AI Mentor · Muted</>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={toggleVoiceListening}
            title={voiceListeningActive ? 'Microphone listening active. Click to mute.' : 'Microphone muted. Click to enable voice wake word.'}
            style={{
              background: voiceListeningActive ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.08)',
              border: `1px solid ${voiceListeningActive ? 'rgba(239, 68, 68, 0.5)' : 'rgba(255, 255, 255, 0.15)'}`,
              borderRadius: '50%',
              width: 22,
              height: 22,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 10,
              cursor: 'pointer',
              marginLeft: 3,
              color: voiceListeningActive ? '#ef4444' : '#94a3b8'
            }}
          >
            {voiceListeningActive ? '🎙️' : '🔇'}
          </button>
        </div>
      )}

      {/* ── Expanded floating avatar mentor window ── */}
      {!minimized && !shouldHideVisually && (
        <div data-story-tour-card={tourActive ? '' : undefined} style={{
          position: 'fixed',
          bottom: isCentered ? 'auto' : 18,
          top: isCentered ? '50%' : 'auto',
          left: isCentered
            ? '50%'
            : (isRightSidebarOpen && !isLeftSidebarOpen ? 88 : 'auto'),
          right: isCentered
            ? 'auto'
            : (isRightSidebarOpen && !isLeftSidebarOpen ? 'auto' : 18),
          transform: isCentered ? 'translate(-50%, -50%)' : 'none',
          zIndex: 9999,
          width: tourActive ? 'min(420px, calc(100vw - 28px))' : (isEnlarged ? 285 : 210),
          maxWidth: 'calc(100vw - 24px)',
          height: tourActive ? 240 : (isEnlarged ? 360 : 270),
          background: 'var(--bg2)',
          border: '1px solid var(--border)',
          borderRadius: 16,
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          display: 'flex',
          flexDirection: tourActive ? 'row' : 'column',
          overflow: 'hidden',
          transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
        }}>
          {tourActive ? (
            <>
              <StoryTourCard
                tourStep={tourStep}
                teacher={teacher}
                text={TOUR_SLIDES[tourStep] ? getTourSlideText(TOUR_SLIDES[tourStep], tourTextContext) : undefined}
                paused={tourPaused}
                onPrev={prevTourSlide}
                onNext={nextTourSlide}
                onDismiss={dismissTour}
                onReplay={replayCurrentSlide}
                isSpeaking={isSpeaking}
              />
              <div style={{
                flex: '0 0 42%',
                width: '42%',
                height: '100%',
                position: 'relative',
                overflow: 'hidden',
                background: 'radial-gradient(circle at 50% 50%, rgba(var(--brand-rgb), 0.2) 0%, rgba(15,23,42,0.8) 100%)',
              }}>
                <Suspense fallback={<div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>Loading mentor...</div>}>
                  <AvatarMentorWidget
                    userId={user?.id}
                    careerProfile={profile || undefined}
                    teacherId={teacherId}
                    minimized={minimized}
                    setMinimized={setMinimized}
                    showSpeechBubble={false}
                    setShowSpeechBubble={setShowSpeechBubble}
                    onboardingStep={onboardingStep}
                    setOnboardingStep={setOnboardingStep}
                    onTabShift={(path) => router.push(path)}
                    onEnlarge={(val) => setIsEnlarged(val)}
                    onlyAvatar={true}
                    gazeTracking={false}
                    speaking={isSpeaking}
                  />
                </Suspense>
              </div>
            </>
          ) : (
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
              <div style={{
                position: 'absolute',
                top: 8,
                left: 10,
                right: 10,
                zIndex: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'rgba(15,23,42,0.85)',
                backdropFilter: 'blur(10px)',
                padding: '5px 10px',
                borderRadius: 12,
                border: '1px solid rgba(255,255,255,0.12)',
                boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 13 }}>{teacher.emoji}</span>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 11, fontWeight: 800, color: 'var(--text)' }}>{teacher.name}</span>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px #22c55e' }} title="Online & Listening" />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <button
                    onClick={startStoryMode}
                    title="Launch Story Tour"
                    style={{
                      background: 'linear-gradient(135deg, var(--accent), var(--purple))',
                      border: 'none',
                      borderRadius: 6,
                      color: 'var(--text)',
                      fontSize: 9.5,
                      fontWeight: 800,
                      padding: '2px 7px',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-mono)',
                      lineHeight: 1.3,
                      boxShadow: '0 2px 8px rgba(var(--brand-rgb), 0.4)',
                    }}
                  >
                    ✨ Tour
                  </button>
                  <button
                    onClick={() => setMinimized(true)}
                    title="Dock Floating Avatar"
                    style={{
                      background: 'rgba(255,255,255,0.12)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: 6,
                      color: 'var(--text)',
                      fontSize: 10,
                      fontWeight: 700,
                      padding: '2px 7px',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-mono)',
                      lineHeight: 1.2
                    }}
                  >
                    −
                  </button>
                </div>
              </div>

              <div style={{ width: '100%', height: '100%', overflow: 'hidden', borderRadius: isCentered ? 20 : '20px 20px 0 0' }}>
                <Suspense fallback={<div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>Loading mentor...</div>}>
                  <AvatarMentorWidget
                    userId={user?.id}
                    careerProfile={profile || undefined}
                    teacherId={teacherId}
                    minimized={minimized}
                    setMinimized={setMinimized}
                    showSpeechBubble={false}
                    setShowSpeechBubble={setShowSpeechBubble}
                    onboardingStep={onboardingStep}
                    setOnboardingStep={setOnboardingStep}
                    onTabShift={(path) => router.push(path)}
                    onEnlarge={(val) => setIsEnlarged(val)}
                    onlyAvatar={true}
                    gazeTracking={!pathname.startsWith('/quests/')}
                    speaking={isSpeaking}
                  />
                </Suspense>
              </div>

              {/* Speech bubble overlay when not minimized */}
              {dialogueText && showSpeechBubble && (
                <div style={{
                  position: 'absolute',
                  bottom: 12,
                  left: 12,
                  right: 12,
                  background: 'rgba(15,23,42,0.92)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 14,
                  padding: '10px 12px',
                  zIndex: 10,
                  boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
                }}>
                  <div style={{ fontSize: 11, color: 'var(--text)', lineHeight: 1.45, maxHeight: 90, overflowY: 'auto' }}>
                    {dialogueText}
                  </div>
                  {showButton && (
                    <button
                      onClick={onButtonClick}
                      style={{
                        marginTop: 8,
                        width: '100%',
                        padding: '6px 0',
                        borderRadius: 8,
                        border: 'none',
                        background: 'var(--accent)',
                        color: 'white',
                        fontSize: 11,
                        fontWeight: 800,
                        cursor: 'pointer'
                      }}
                    >
                      {buttonText}
                    </button>
                  )}
                </div>
              )}

              <CongratCard
                celebEvent={celebEvent}
                profile={profile}
                teacher={teacher}
                onClose={() => {
                  setCelebEvent(null);
                  stopSpeaking();
                }}
              />
            </div>
          )}
        </div>
      )}

      <VoiceRegistrationModal
        isOpen={showVoiceRegModal}
        onClose={() => {
          setShowVoiceRegModal(false);
          setStoryLocked(false);
          completeStoryTour(user?.id);
        }}
        userId={user?.id}
        teacherId={teacherId}
        teacherName={teacher.name}
      />
    </>
  );
};