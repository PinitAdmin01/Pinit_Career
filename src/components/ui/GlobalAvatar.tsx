'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo, Suspense, lazy } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useCareerOS } from '@/lib/context/CareerOSContext';
import { speakWithAvatar, stopSpeaking, preloadTTS, setStoryTourAudioLock } from '@/lib/tts';
import VoiceRegistrationModal from '@/components/avatar/VoiceRegistrationModal';
import { completeStoryTour, isStoryTourPending, resetStoryTour } from '@/lib/storyTour';
import { StoryTourEngine, tourRoutePath } from '@/lib/storyTourEngine';
import { matchNavigationIntent } from '@/components/avatar/hooks/useVoiceNavigation';
import { isHyperActiveTrigger } from '@/lib/avatar/wakeWordParser';
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
  onCollapseLeftNav?: () => void;
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
  onCollapseLeftNav,
  isRightSidebarOpen = false,
  isLeftSidebarOpen = true,
  onTourSlideChange,
}) => {
  const cOS = useCareerOS();
  const pathname = usePathname();
  const router = useRouter();
  const cleanPath = pathname?.replace(/\/$/, '') || '';

  const isLessonPage = cleanPath === '/quests/lesson' || cleanPath.startsWith('/quests/lesson');
  const isOnboardingOrAuth = isLessonPage || cleanPath === '/onboarding' || cleanPath.startsWith('/onboarding') || cleanPath === '/login' || cleanPath === '/signup' || cleanPath === '';

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
  const [isCompactViewport, setIsCompactViewport] = useState(false);
  const [hyperActive, setHyperActive] = useState(false);
  const leftSidebarBeforeHyperRef = useRef<boolean>(false);
  const lastHyperTriggerRef = useRef<number>(0);
  const onCollapseLeftNavRef = useRef(onCollapseLeftNav);
  onCollapseLeftNavRef.current = onCollapseLeftNav;
  const isLeftSidebarOpenRef = useRef(isLeftSidebarOpen);
  isLeftSidebarOpenRef.current = isLeftSidebarOpen;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setVoiceListeningActive(localStorage.getItem('pinit_voice_wake_active') === 'true');
    const mq = window.matchMedia('(max-width: 900px)');
    const syncViewport = () => setIsCompactViewport(mq.matches);
    syncViewport();
    mq.addEventListener?.('change', syncViewport);
    return () => mq.removeEventListener?.('change', syncViewport);
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

  const teacherId =
    profile?.guidanceMentorId ||
    (user as any)?.guidanceMentorId ||
    (user as any)?.guidance_mentor_id ||
    (typeof window !== 'undefined' ? localStorage.getItem('pinit_selected_mentor_id') : null) ||
    'priya';
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
  const isExam = cleanPath === '/exams' || cleanPath.startsWith('/exam/');

  // Pause wake-word mic on active voice/exam/lesson routes; keep mentor visible on /missions, /interview lobby, and /attention-span
  // (live interview sessions hide .avatar-mentor-widget / .mentor-widget automatically via body[data-interview-active="true"])
  const isTaskOrProcessActive = isLessonOrDetail || isInterview || isGroupDiscussion || isExam;
  const shouldHideVisually = (isLessonOrDetail || isGroupDiscussion || isExam) && !celebEvent && !tourActive && !showVoiceRegModal && !storyLocked;

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

  // ── 2. Hyper-Active mode lifecycle + 15s auto-dock timer ────────────────────
  const enterHyperActive = useCallback(() => {
    const now = Date.now();
    if (now - lastHyperTriggerRef.current < 800) return;
    lastHyperTriggerRef.current = now;
    leftSidebarBeforeHyperRef.current = isLeftSidebarOpenRef.current;
    onCollapseLeftNavRef.current?.();
    setTourActive(false);
    setMinimized(false);
    setHyperActive(true);
  }, []);

  const exitHyperActive = useCallback((minimizeToPill = false) => {
    stopSpeaking();
    setHyperActive(false);
    setMinimized(minimizeToPill);
    if (leftSidebarBeforeHyperRef.current) {
      leftSidebarBeforeHyperRef.current = false;
      onExpandLeftNavRef.current?.();
    }
  }, []);

  useEffect(() => {
    if (!hyperActive) return;
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        exitHyperActive(false);
      }
    };
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [hyperActive, exitHyperActive]);

  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetIdleTimer = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    if (!minimized && !tourActive && !celebEvent && !hyperActive) {
      idleTimerRef.current = setTimeout(() => {
        setMinimized(true);
      }, 15000);
    }
  }, [minimized, tourActive, celebEvent, hyperActive]);

  useEffect(() => {
    resetIdleTimer();
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [resetIdleTimer]);

  // ── 3. Wake word listener (Strictly Opt-In & Transparent) ─────────────────
  useEffect(() => {
    // Pause wake-word speech recognition during active tasks, story tour, or Hyper-Active chat (prevents dual-mic lock)
    if (typeof window === 'undefined' || isOnboardingOrAuth || !voiceListeningActive || tourActive || isTaskOrProcessActive || hyperActive) return;
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
        const startIdx = typeof event.resultIndex === 'number' ? event.resultIndex : 0;
        const latestSlice = Array.from(event.results).slice(startIdx);
        const transcript = latestSlice
          .map((r: any) => r[0].transcript)
          .join(' ')
          .toLowerCase();

        const mentorName = teacher.name.split(' ')[1]?.toLowerCase() || teacher.name.toLowerCase();

        // 0. Hyper-Active trigger ("hey priya we need to chat/chart/speak/talk")
        if (isHyperActiveTrigger(transcript, mentorName)) {
          stopSpeaking();
          enterHyperActive();
          return;
        }

        // Clean wake words (removed false triggers: freya, riya)
        const hasWakeWord = /\b(hey|hwy|hay|hi|hello)\b/i.test(transcript) ||
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
            advice = "Explore your active socratic courses to earn XP and increase your verified skill metrics!";
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
        speakWithAvatar(`Yes! I am here. Say "we need to chat" for full conversation mode, or ask what to do next.`, teacherId, () => {}, () => {});
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
  }, [teacher.name, teacherId, user?.id, resetIdleTimer, router, isOnboardingOrAuth, voiceListeningActive, tourActive, isTaskOrProcessActive, hyperActive, enterHyperActive]);

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

  const completedQuestsCount = (cOS.completedQuests || []).length;
  const completedMissionsCount = (cOS.completedMissions || []).length;
  const missionStreakVal = cOS.missionStreak || 0;
  const careerScoreVal = cOS.careerScore || 0;
  const xpVal = cOS.xp || 0;

  const hyperCareerProfile = useMemo(
    () => ({
      ...(profile || {}),
      displayName:
        user?.displayName ||
        (user as any)?.name ||
        (user as any)?.full_name ||
        profile?.displayName ||
        profile?.name ||
        profile?.full_name ||
        '',
      completedQuestsCount,
      completedMissionsCount,
      missionStreak: missionStreakVal,
      careerScore: careerScoreVal,
      xp: xpVal,
    }),
    [profile, user, completedQuestsCount, completedMissionsCount, missionStreakVal, careerScoreVal, xpVal]
  );

  if (!mounted || isOnboardingOrAuth) return null;

  const isCentered = onboardingStep === 0;

  let dialogueText = '';
  let showButton = false;
  let buttonText = '';
  let onButtonClick = () => {};

  if (!tourActive && !celebEvent) {
    if (onboardingStep === 0) {
      dialogueText = "Welcome! Ready to map your skills and launch your career sprint?";
      showButton = true;
      buttonText = "Let's Begin!";
      onButtonClick = () => setOnboardingStep(1);
    } else if (onboardingStep === 1) {
      dialogueText = "Dashboard live. Open Digital Studio to initialize your Career Twin.";
    } else if (onboardingStep === 2) {
      dialogueText = "Map your current skills, then pick a track on the Dashboard.";
    } else if (onboardingStep === 3 || onboardingStep === 4) {
      dialogueText = !roadmapGenerated
        ? "Pick your target track below to compile your quest roadmap."
        : "Roadmap ready. Jump into Courses or Daily Missions to build momentum.";
    } else if (onboardingStep === 5) {
      dialogueText = "Strong momentum. Keep clearing quests to verify your Vault credentials.";
    } else {
      const TAB_GUIDES: Record<string, string> = {
        '/dashboard': "Dashboard: Track readiness, active sprint progress, and today's priority actions.",
        '/quests': "Courses: Clear guided lessons and verified code labs to build mastery.",
        '/career-twin': "Career Twin: Compare your current skills against your target role.",
        '/mirror': "Digital Studio: Inspect skill gaps, resume ATS score, and Career Twin.",
        '/learning': "Roadmap: Follow your milestone track and verify core engineering concepts.",
        '/missions': "Daily Missions: Complete quick daily gap-closure challenges to keep your streak.",
        '/arena': "Arena: Compete in live 1v1 coding duels and timed algorithmic sprints.",
        '/projects': "Projects: Ship verifiable portfolio work and track milestone progress.",
        '/leaderboard': "Leaderboard: Track your sprint standing and weekly league promotion.",
        '/interview': "AI Interview: Practice mock rounds with instant scoring and feedback.",
        '/group-discussion': "GD Practice: Sharpen structured arguments in AI boardroom debates.",
        '/attention-span': "Attention Span: Train deep-work focus for timed technical sprints.",
        '/notifications': "Notifications: Review quest rewards, streak alerts, and updates.",
        '/friends': "My Network: Connect with peers for duels and squad projects.",
        '/pins': "Pins & Wallet: Track Pins balance and unlock advanced mentor features.",
        '/profile': "Profile: Manage mentor voice settings, Career DNA, and preferences.",
      };

      const matchedGuide = Object.entries(TAB_GUIDES).find(([path]) => pathname.startsWith(path));
      dialogueText = matchedGuide
        ? matchedGuide[1]
        : "Say 'Hey Priya, we need to chat' anytime to open full conversation mode.";
    }
  }

  const INACTIVE_PILL_OPACITY = 0.4;
  const activeDockLeft = isCompactViewport
    ? 10
    : isLeftSidebarOpen
      ? 'calc(var(--sidebar-w, 232px) + 12px)'
      : 'calc(var(--sidebar-collapsed-w, 64px) + 12px)';

  return (
    <>
      {/* ── Story tour progress line (bottom edge of the window) ── */}
      {tourActive && <StoryTourProgressBar tourStep={tourStep} runKey={tourSlideRun} />}

      {/* ── Floating avatar launcher button (when minimized) ── */}
      {!hyperActive && minimized && !shouldHideVisually && (
        <div
          className="avatar-mentor-widget"
          data-testid="global-avatar-launcher"
          onClick={() => {
            setMinimized(false);
            resetIdleTimer();
          }}
          title="Talk to your AI Career Mentor"
          style={{
            position: 'fixed',
            bottom: 0,
            left: '50%',
            right: 'auto',
            transform: 'translateX(-50%)',
            transformOrigin: 'bottom center',
            zIndex: 9999,
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            width: 'auto',
            height: 'auto',
            minHeight: 0,
            overflow: 'visible',
            background: 'linear-gradient(135deg, rgba(15,23,42,0.94) 0%, rgba(30,27,75,0.94) 100%)',
            backdropFilter: 'blur(12px)',
            border: '1.5px solid rgba(var(--brand-rgb), 0.42)',
            borderBottom: 'none',
            borderRadius: '18px 18px 0 0',
            padding: '6px 14px 6px 8px',
            boxShadow: '0 -4px 24px rgba(0,0,0,0.38), 0 0 18px rgba(var(--brand-rgb), 0.22)',
            opacity: INACTIVE_PILL_OPACITY,
            transition: 'opacity 0.25s ease, transform 0.25s ease, box-shadow 0.2s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.opacity = '1';
            e.currentTarget.style.transform = 'translateX(-50%) scale(1.04)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.opacity = String(INACTIVE_PILL_OPACITY);
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
            fontSize: 15.5,
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
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 800, color: 'var(--text)' }}>
              {teacher.name}
            </div>
            <div style={{ fontSize: 9.5, color: voiceListeningActive ? '#34d399' : '#a5b4fc', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: 4 }}>
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
              fontSize: 11,
              cursor: 'pointer',
              marginLeft: 3,
              color: voiceListeningActive ? '#ef4444' : '#94a3b8'
            }}
          >
            {voiceListeningActive ? '🎙️' : '🔇'}
          </button>
        </div>
      )}

      {/* ── Hyper-Active Centered 65% Stage (Left: 3D Avatar | Right: Live Chat) ── */}
      {hyperActive && !shouldHideVisually && (
        <>
          <div
            data-testid="global-avatar-hyper-backdrop"
            onClick={() => exitHyperActive(false)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9998,
              background: 'rgba(2, 6, 23, 0.58)',
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
            }}
          />
          <div
            className="mentor-widget"
            data-testid="global-avatar-hyper-active"
            role="dialog"
            aria-modal="true"
            aria-label={`${teacher.name} Hyper-Active Conversation`}
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 9999,
              width: 'min(94vw, clamp(720px, 68vw, 1120px))',
              height: 'min(84vh, clamp(480px, 68vh, 740px))',
              background: 'var(--bg2)',
              border: '1px solid rgba(var(--brand-rgb), 0.38)',
              borderRadius: 20,
              boxShadow: '0 28px 80px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.06)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            <Suspense fallback={<div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>Launching Hyper-Active Mentor...</div>}>
              <AvatarMentorWidget
                userId={user?.id}
                careerProfile={hyperCareerProfile}
                teacherId={teacherId}
                minimized={false}
                setMinimized={() => exitHyperActive(true)}
                showSpeechBubble={false}
                setShowSpeechBubble={setShowSpeechBubble}
                onboardingStep={onboardingStep}
                setOnboardingStep={setOnboardingStep}
                onTabShift={(path) => {
                  exitHyperActive(false);
                  router.push(path);
                }}
                onEnlarge={(val) => {
                  if (!val) exitHyperActive(false);
                }}
                isEnlarged={true}
                onlyAvatar={false}
                hyperActive={true}
                autoStartVoice={voiceListeningActive}
                onExitHyperActive={() => exitHyperActive(false)}
                gazeTracking={!pathname.startsWith('/quests/')}
                speaking={isSpeaking}
              />
            </Suspense>
          </div>
        </>
      )}

      {/* ── Expanded floating avatar mentor window (bottom-left when active) ── */}
      {!minimized && !hyperActive && !shouldHideVisually && (
        <div
          className="mentor-widget"
          data-testid="global-avatar-active-window"
          data-story-tour-card={tourActive ? '' : undefined}
          style={{
            position: 'fixed',
            bottom: isCentered ? 'auto' : 0,
            top: isCentered ? '50%' : 'auto',
            left: isCentered || tourActive ? '50%' : activeDockLeft,
            right: 'auto',
            transform: isCentered ? 'translate(-50%, -50%)' : tourActive ? 'translateX(-50%)' : 'none',
            zIndex: 9999,
            width: tourActive ? 'min(420px, calc(100vw - 28px))' : (isEnlarged ? 290 : 232),
            maxWidth: 'calc(100vw - 24px)',
            height: tourActive ? 240 : (isEnlarged ? 372 : 296),
            background: 'var(--bg2)',
            border: '1px solid var(--border)',
            borderBottom: isCentered ? '1px solid var(--border)' : 'none',
            borderRadius: isCentered ? 16 : '16px 16px 0 0',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            display: 'flex',
            flexDirection: tourActive ? 'row' : 'column',
            overflow: 'hidden',
            transition: 'left 0.28s cubic-bezier(0.22, 1, 0.36, 1), width 0.28s cubic-bezier(0.22, 1, 0.36, 1), height 0.28s cubic-bezier(0.22, 1, 0.36, 1), transform 0.28s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
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
                <Suspense fallback={<div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>Loading mentor...</div>}>
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
            <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              {/* Slim single-line header placed above the 3D avatar so it never covers the avatar face */}
              <div
                data-testid="global-avatar-slim-header"
                style={{
                  flexShrink: 0,
                  height: 30,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 6,
                  padding: '0 8px',
                  background: 'rgba(15,23,42,0.92)',
                  borderBottom: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, minWidth: 0, overflow: 'hidden' }}>
                  <span style={{ width: 6, height: 6, flexShrink: 0, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px #22c55e' }} title="Online" />
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 11, fontWeight: 800, color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {teacher.name}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                  <button
                    type="button"
                    data-testid="global-avatar-hyper-btn"
                    onClick={enterHyperActive}
                    title="Open Hyper-Active Chat (or say 'Hey Priya, we need to chat')"
                    style={{
                      background: 'rgba(56,189,248,0.16)',
                      border: '1px solid rgba(56,189,248,0.4)',
                      borderRadius: 5,
                      color: '#bae6fd',
                      fontSize: 9.5,
                      fontWeight: 700,
                      padding: '2px 6px',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-mono)',
                      lineHeight: 1.2,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Chat
                  </button>
                  <button
                    type="button"
                    onClick={startStoryMode}
                    title="Launch Story Tour"
                    style={{
                      background: 'linear-gradient(135deg, var(--accent), var(--purple))',
                      border: 'none',
                      borderRadius: 5,
                      color: '#ffffff',
                      fontSize: 9.5,
                      fontWeight: 700,
                      padding: '2px 6px',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-mono)',
                      lineHeight: 1.2,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Tour
                  </button>
                  <button
                    type="button"
                    onClick={() => setMinimized(true)}
                    title="Minimize Mentor"
                    style={{
                      background: 'rgba(255,255,255,0.1)',
                      border: '1px solid rgba(255,255,255,0.16)',
                      borderRadius: 5,
                      color: '#e2e8f0',
                      fontSize: 11,
                      fontWeight: 700,
                      padding: '1px 6px',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-mono)',
                      lineHeight: 1.2,
                    }}
                  >
                    −
                  </button>
                </div>
              </div>

              {/* Unobstructed 3D avatar canvas region */}
              <div style={{ flex: 1, minHeight: 0, width: '100%', position: 'relative', overflow: 'hidden' }}>
                <Suspense fallback={<div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>Loading mentor...</div>}>
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

              {/* Compact 2-line caption strip docked below the avatar (never covering the avatar body) */}
              {dialogueText && showSpeechBubble && (
                <div
                  data-testid="global-avatar-compact-caption"
                  title={dialogueText}
                  style={{
                    flexShrink: 0,
                    background: 'rgba(15,23,42,0.94)',
                    borderTop: '1px solid rgba(255,255,255,0.08)',
                    padding: '6px 8px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                    <div style={{
                      flex: 1,
                      fontSize: 10.5,
                      color: '#e2e8f0',
                      lineHeight: 1.35,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}>
                      {dialogueText}
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowSpeechBubble(false)}
                      title="Hide caption"
                      aria-label="Hide caption"
                      style={{
                        flexShrink: 0,
                        background: 'transparent',
                        border: 'none',
                        color: 'rgba(148,163,184,0.8)',
                        fontSize: 11,
                        lineHeight: 1,
                        cursor: 'pointer',
                        padding: '1px 2px',
                      }}
                    >
                      ×
                    </button>
                  </div>
                  {showButton && (
                    <button
                      type="button"
                      onClick={onButtonClick}
                      style={{
                        marginTop: 5,
                        width: '100%',
                        padding: '4px 0',
                        borderRadius: 6,
                        border: 'none',
                        background: 'var(--accent)',
                        color: '#ffffff',
                        fontSize: 11,
                        fontWeight: 700,
                        cursor: 'pointer',
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