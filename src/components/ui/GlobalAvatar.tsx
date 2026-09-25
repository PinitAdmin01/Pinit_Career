'use client';

import React, { useState, useEffect, useRef, useCallback, Suspense, lazy } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useCareerOS } from '@/lib/context/CareerOSContext';
import { speakWithAvatar, stopSpeaking } from '@/lib/tts';
import VoiceRegistrationModal from '@/components/avatar/VoiceRegistrationModal';
import { completeStoryTour, isStoryTourPending, resetStoryTour } from '@/lib/storyTour';
import { matchNavigationIntent } from '@/components/avatar/hooks/useVoiceNavigation';
import { StoryTourCard, CongratCard, TOUR_SLIDES, TOUR_STEP_ROUTES, buildCongratMessage } from './StoryTourModal';

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

// ── Auto-scroll utility for parallel page showcase during tour narration ─────
function startAutoScroll(durationMs: number): () => void {
  if (typeof window === 'undefined') return () => {};
  let cancelled = false;
  let rafId: number | null = null;
  let timerId: ReturnType<typeof setTimeout> | null = null;

  // Immediate reset to top on both .page-content and window
  const pageEl = document.querySelector('.page-content') as HTMLElement | null;
  if (pageEl) {
    pageEl.scrollTop = 0;
  }
  window.scrollTo({ top: 0, behavior: 'instant' });

  // Yield gracefully if user manually interacts with page (wheel, touch, pointer)
  const stopOnUserGesture = () => {
    cancelled = true;
    if (timerId) clearTimeout(timerId);
    if (rafId) cancelAnimationFrame(rafId);
    cleanupGestureListeners();
  };

  const cleanupGestureListeners = () => {
    window.removeEventListener('wheel', stopOnUserGesture);
    window.removeEventListener('touchmove', stopOnUserGesture);
    window.removeEventListener('pointerdown', stopOnUserGesture);
  };

  window.addEventListener('wheel', stopOnUserGesture, { passive: true });
  window.addEventListener('touchmove', stopOnUserGesture, { passive: true });
  window.addEventListener('pointerdown', stopOnUserGesture, { passive: true });

  // Delay starting downward scroll until route has rendered content (~200ms)
  timerId = setTimeout(() => {
    if (cancelled) return;
    const startTime = performance.now();
    const runDuration = Math.max(1400, durationMs - 300);

    const step = (now: number) => {
      if (cancelled) return;
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / runDuration);

      // Smooth ease-in-out curve
      const ease = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      const targetEl = (document.querySelector('.page-content') as HTMLElement | null) || null;
      if (targetEl && targetEl.scrollHeight > targetEl.clientHeight) {
        const maxScroll = targetEl.scrollHeight - targetEl.clientHeight;
        targetEl.scrollTop = maxScroll * ease;
      } else {
        const docScroll = (document.scrollingElement || document.documentElement).scrollHeight - window.innerHeight;
        if (docScroll > 15) {
          window.scrollTo(0, docScroll * ease);
        }
      }

      if (progress < 1) {
        rafId = requestAnimationFrame(step);
      } else {
        cleanupGestureListeners();
      }
    };

    rafId = requestAnimationFrame(step);
  }, 200);

  return () => {
    cancelled = true;
    if (timerId) clearTimeout(timerId);
    if (rafId) cancelAnimationFrame(rafId);
    cleanupGestureListeners();
  };
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
  const [tourActive, setTourActive] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const [storyLocked, setStoryLocked] = useState(false);
  const lastSpokenTourStepRef = useRef<number | null>(null);
  const pendingSpeechStepRef = useRef<number | null>(null);
  const tourAdvanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tourFallbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cancelAutoScrollRef = useRef<(() => void) | null>(null);
  // The route the current tour slide's speech was spoken on. Auto-advance is
  // ONLY permitted when the speech genuinely finishes while still on this
  // route — navigating away / route unmount must NOT fake a completion.
  const expectedRouteRef = useRef<string | null>(null);
  const cleanPathRef = useRef(cleanPath);
  cleanPathRef.current = cleanPath;

  const clearTourAdvanceTimer = useCallback(() => {
    if (cancelAutoScrollRef.current) {
      cancelAutoScrollRef.current();
      cancelAutoScrollRef.current = null;
    }
    if (tourAdvanceTimerRef.current) {
      clearTimeout(tourAdvanceTimerRef.current);
      tourAdvanceTimerRef.current = null;
    }
    if (tourFallbackTimerRef.current) {
      clearTimeout(tourFallbackTimerRef.current);
      tourFallbackTimerRef.current = null;
    }
  }, []);

  // ── Congratulations state ──────────────────────────────────────────────────
  const [celebEvent, setCelebEvent] = useState<any>(null);
  const celebTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const spokenCelebRef = useRef<any>(null);

  const teacherId = profile?.guidanceMentorId || 'priya';
  const teacher = TEACHER_CONFIG[teacherId] || TEACHER_CONFIG.priya;

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
      if (typeof window !== 'undefined') {
        (window as any).__PINIT_STORY_TOUR_ACTIVE = false;
      }
      clearTourAdvanceTimer();
      stopSpeaking(true);
    };
  }, [clearTourAdvanceTimer]);

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

  // ── Auto-start story tour post-onboarding ──────────────────────────────────
  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return;
    if (tourActive || showVoiceRegModal) return;

    if (!isStoryTourPending(user?.id, user)) return;

    if (cleanPath !== '/dashboard') {
      return;
    }

    const t = window.setTimeout(() => {
      if (typeof window !== 'undefined') {
        (window as any).__PINIT_STORY_TOUR_ACTIVE = true;
      }
      onExpandLeftNav?.();
      setStoryLocked(true);
      setTourActive(true);
      setTourStep(0);
      setMinimized(false);
      completeStoryTour(user?.id);
    }, 500);
    return () => window.clearTimeout(t);
  }, [mounted, user, cleanPath, tourActive, showVoiceRegModal, onExpandLeftNav]);

  // ── Auto-expand appropriate sidebars per tour segment ──────────────────────
  useEffect(() => {
    if (!tourActive || !TOUR_SLIDES[tourStep]) return;
    const seg = TOUR_SLIDES[tourStep].segment;
    if (seg === 1 || seg === 2) {
      onExpandLeftNav?.();
    } else if (seg === 3) {
      onOpenRightSidebar?.();
    }
  }, [tourActive, tourStep, onExpandLeftNav, onOpenRightSidebar]);

  // ── Broadcast active tour tab for live sidebar spotlighting ────────────────
  useEffect(() => {
    if (tourActive && TOUR_SLIDES[tourStep]) {
      onTourSlideChange?.(TOUR_SLIDES[tourStep].route, TOUR_SLIDES[tourStep].tabKey);
    } else {
      onTourSlideChange?.(null, null);
    }
  }, [tourActive, tourStep, onTourSlideChange]);

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
      if (typeof window !== 'undefined') {
        (window as any).__PINIT_STORY_TOUR_ACTIVE = true;
      }
      clearTourAdvanceTimer();
      stopSpeaking(true);
      resetStoryTour(user?.id);
      onExpandLeftNav?.();
      setStoryLocked(true);
      setTourActive(true);
      setTourStep(0);
      setMinimized(false);
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
      if (typeof window !== 'undefined') {
        (window as any).__PINIT_STORY_TOUR_ACTIVE = false;
      }
      clearTourAdvanceTimer();
      stopSpeaking(true);
      setTourActive(false);
      setStoryLocked(false);
      setMinimized(false);
      completeStoryTour(user?.id);
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
  }, [refreshProfile, onExpandLeftNav, user?.id, clearTourAdvanceTimer]);

  // ── Speak current tour slide, then auto-advance on completion ─────────────
  // Stable callback for tour completion — uses refs so it never changes identity
  const openVoiceSegment = useCallback(() => {
    if (typeof window !== 'undefined') {
      (window as any).__PINIT_STORY_TOUR_ACTIVE = false;
    }
    clearTourAdvanceTimer();
    setTourActive(false);
    stopSpeaking(true);
    setMinimized(false);
    setShowVoiceRegModal(true);
    if (cleanPathRef.current !== '/dashboard') router.push('/dashboard');
  }, [router, clearTourAdvanceTimer]);

  const advanceTourSlide = useCallback((_auto = false) => {
    clearTourAdvanceTimer();
    setTourStep((s) => {
      const next = s + 1;
      if (next >= TOUR_SLIDES.length) {
        console.log('[PinIT Tour] 🏆 Reached final slide (' + TOUR_SLIDES.length + ' steps completed). Transitioning to Voice Registration...');
        if (typeof window !== 'undefined') {
          (window as any).__PINIT_STORY_TOUR_ACTIVE = false;
        }
        openVoiceSegment();
        return s;
      }
      if (typeof window !== 'undefined') {
        (window as any).__PINIT_STORY_TOUR_ACTIVE = true;
      }
      console.log('[PinIT Tour] ⏭️ Advancing slide from Step ' + (s + 1) + ' -> Step ' + (next + 1) + ' (' + TOUR_SLIDES[next]?.title + ') [auto=' + _auto + ']');
      return next;
    });
  }, [openVoiceSegment, clearTourAdvanceTimer]);

  const speakCurrentTourSlide = useCallback(() => {
    if (!tourActive || !TOUR_SLIDES[tourStep]) {
      pendingSpeechStepRef.current = null;
      clearTourAdvanceTimer();
      return;
    }
    pendingSpeechStepRef.current = tourStep;

    // Explicitly lock audio protection so mounting pages (/missions, /leaderboard, /interview) cannot abort tour speech
    if (typeof window !== 'undefined') {
      (window as any).__PINIT_STORY_TOUR_ACTIVE = true;
    }

    const slide = TOUR_SLIDES[tourStep];
    const targetRoute = TOUR_STEP_ROUTES[tourStep];
    console.log('[PinIT Tour] 🎬 Step ' + (tourStep + 1) + '/' + TOUR_SLIDES.length + ': "' + slide.title + '" -> targetRoute: ' + targetRoute);

    if (targetRoute && cleanPathRef.current !== targetRoute) {
      console.log('[PinIT Tour] 🚀 Routing to tab: ' + targetRoute);
      router.push(targetRoute);
    }

    const speechText = slide.text.replace(/\*\*/g, '').replace(/🎉|🏠|🛠️|🗺|⚡|🎙|🧬|🔬|🎯|💬|🚀|👋|🌅|✨|💙|⚔️|🏆|📖|🧠|🔔|👤|📚/g, '');

    // Stop any prior speech (force = true)
    stopSpeaking(true);

    expectedRouteRef.current = targetRoute || cleanPathRef.current;
    clearTourAdvanceTimer();

    // Parallel smooth auto-scroll: showcase tab content from top to bottom
    const approxDurationMs = Math.max(2200, Math.min(3800, speechText.length * 52 + 500));
    cancelAutoScrollRef.current = startAutoScroll(approxDurationMs);

    // Dynamic fallback timer (strictly bounded to guarantee tour finishes < 30s)
    const safeDuration = Math.max(4500, Math.min(6500, speechText.length * 55 + 1000));
    tourFallbackTimerRef.current = setTimeout(() => {
      console.warn('[PinIT Tour] ⏩ Fallback timer fired for Step ' + (tourStep + 1) + ' ("' + slide.title + '"). Auto-shifting to next tab!');
      advanceTourSlide(true);
    }, safeDuration);

    speakWithAvatar(speechText, teacherId, () => {
      setIsSpeaking(true);
      console.log('[PinIT Tour] 🗣️ Mentor narration started for Step ' + (tourStep + 1));
    }, () => {
      setIsSpeaking(false);
      if (cancelAutoScrollRef.current) {
        cancelAutoScrollRef.current();
        cancelAutoScrollRef.current = null;
      }
      clearTourAdvanceTimer();
      console.log('[PinIT Tour] 🎙️ Narration completed for Step ' + (tourStep + 1) + '. Auto-advancing in 400ms...');

      const scheduleAdvance = () => {
        tourAdvanceTimerRef.current = setTimeout(() => {
          advanceTourSlide(true);
        }, 400);
      };

      if (typeof document !== 'undefined' && document.hidden) {
        const onVisible = () => {
          if (!document.hidden) {
            document.removeEventListener('visibilitychange', onVisible);
            scheduleAdvance();
          }
        };
        document.addEventListener('visibilitychange', onVisible);
      } else {
        scheduleAdvance();
      }
    });
  }, [tourActive, tourStep, teacherId, router, clearTourAdvanceTimer, advanceTourSlide]);

  // Speak tour slide out loud and automatically switch pages to show corresponding tab
  // NOTE: cleanPath intentionally excluded from deps — it changes as a side-effect of
  //       router.push() below and must NOT re-trigger this effect (that caused skipped slides).
  useEffect(() => {
    if (!tourActive || !TOUR_SLIDES[tourStep]) {
      pendingSpeechStepRef.current = null;
      lastSpokenTourStepRef.current = null;
      clearTourAdvanceTimer();
      return;
    }
    speakCurrentTourSlide();
  }, [tourActive, tourStep, speakCurrentTourSlide, clearTourAdvanceTimer]);

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

  const dismissTour = useCallback(() => {
    if (typeof window !== 'undefined') {
      (window as any).__PINIT_STORY_TOUR_ACTIVE = false;
    }
    clearTourAdvanceTimer();
    setTourActive(false);
    setStoryLocked(false);
    stopSpeaking(true);
    setIsSpeaking(false);
    completeStoryTour(user?.id);
    if (cleanPathRef.current !== '/dashboard') {
      router.push('/dashboard');
    }
  }, [clearTourAdvanceTimer, user?.id, router]);

  const prevTourSlide = useCallback(() => {
    if (tourStep > 0) {
      clearTourAdvanceTimer();
      stopSpeaking(true);
      lastSpokenTourStepRef.current = null;
      setTourStep(s => s - 1);
    }
  }, [tourStep, clearTourAdvanceTimer]);

  const nextTourSlide = useCallback(() => {
    clearTourAdvanceTimer();
    stopSpeaking(true);
    if (tourStep >= TOUR_SLIDES.length - 1) {
      openVoiceSegment();
    } else {
      lastSpokenTourStepRef.current = null;
      setTourStep(s => s + 1);
    }
  }, [tourStep, clearTourAdvanceTimer, openVoiceSegment]);

  const replayCurrentSlide = useCallback(() => {
    lastSpokenTourStepRef.current = null;
    clearTourAdvanceTimer();
    stopSpeaking(true);
    speakCurrentTourSlide();
  }, [clearTourAdvanceTimer, speakCurrentTourSlide]);

  const startStoryMode = useCallback(() => {
    if (typeof window !== 'undefined') {
      (window as any).__PINIT_STORY_TOUR_ACTIVE = true;
    }
    setCelebEvent(null);
    clearTourAdvanceTimer();
    stopSpeaking(true);
    resetStoryTour(user?.id);
    onExpandLeftNav?.();
    setStoryLocked(true);
    setTourActive(true);
    setTourStep(0);
    setMinimized(false);
  }, [clearTourAdvanceTimer, user?.id, onExpandLeftNav]);

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
        <div style={{
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