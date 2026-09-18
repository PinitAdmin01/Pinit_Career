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

  // ── Tour state ─────────────────────────────────────────────────────────────
  const [tourActive, setTourActive] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const [storyLocked, setStoryLocked] = useState(false);
  const lastSpokenTourStepRef = useRef<number | null>(null);
  const pendingSpeechStepRef = useRef<number | null>(null);
  const tourAdvanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tourFallbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // The route the current tour slide's speech was spoken on. Auto-advance is
  // ONLY permitted when the speech genuinely finishes while still on this
  // route — navigating away / route unmount must NOT fake a completion.
  const expectedRouteRef = useRef<string | null>(null);
  const cleanPathRef = useRef(cleanPath);
  cleanPathRef.current = cleanPath;

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

  useEffect(() => { setMounted(true); }, []);

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

  // ── 3. Wake word listener & Speaker Biometrics ("Hey Priya" / "Priya") ────────
  useEffect(() => {
    if (typeof window === 'undefined' || isOnboardingOrAuth) return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    let recognition: any = null;
    try {
      recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((r: any) => r[0].transcript)
          .join(' ')
          .toLowerCase();

        const mentorName = teacher.name.split(' ')[1]?.toLowerCase() || teacher.name.toLowerCase();
        const hasWakeWord = /\b(hey|hay|hi|hello)\b/i.test(transcript) ||
                            /\b(priya|preya|pria|freya|riya|anish|vikram|kashyap|karthic|maya|divya)\b/i.test(transcript) ||
                            transcript.includes(mentorName);

        if (!hasWakeWord) return;

        setMinimized(false);
        resetIdleTimer();
        stopSpeaking();

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
          if (cleanPath === '/dashboard') {
            advice = "Head to the Missions tab to solve today's gap-closure challenges, or Quests to continue your active learning track!";
          } else if (cleanPath === '/quests') {
            advice = "Explore your active socratic courses to earn Pins and increase your verified skill metrics!";
          } else if (cleanPath === '/missions') {
            advice = "Complete today's daily challenges to close your skill gaps and protect your consistency streak!";
          } else if (cleanPath === '/arena') {
            advice = "Enter a 1v1 speedrun battle or algorithm duel to test your skills against other students!";
          } else if (cleanPath === '/interview') {
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

      recognition.start();
    } catch (err) {
      console.error('Speech recognition listener error:', err);
    }

    return () => {
      if (recognition) {
        try { recognition.stop(); } catch {}
      }
    };
  }, [teacher.name, teacherId, user?.id, resetIdleTimer, cleanPath, router, isOnboardingOrAuth]);

  // ── Auto-start story tour post-onboarding ──────────────────────────────────
  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return;
    if (tourActive || showVoiceRegModal) return;

    if (!isStoryTourPending(user?.id, user)) return;

    if (cleanPath !== '/dashboard') {
      return;
    }

    const t = window.setTimeout(() => {
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
      stopSpeaking();
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
      stopSpeaking();
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
  }, [refreshProfile, onExpandLeftNav, user?.id]);

  // ── Speak current tour slide, then auto-advance on completion ─────────────
  const clearTourAdvanceTimer = useCallback(() => {
    if (tourAdvanceTimerRef.current) {
      clearTimeout(tourAdvanceTimerRef.current);
      tourAdvanceTimerRef.current = null;
    }
    if (tourFallbackTimerRef.current) {
      clearTimeout(tourFallbackTimerRef.current);
      tourFallbackTimerRef.current = null;
    }
  }, []);

  // Stable callback for tour completion — uses refs so it never changes identity
  const openVoiceSegment = useCallback(() => {
    setTourActive(false);
    stopSpeaking();
    setMinimized(false);
    setShowVoiceRegModal(true);
    if (cleanPathRef.current !== '/dashboard') router.push('/dashboard');
  }, [router]);

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

    // IMMEDIATE ROBUST FALLBACK TIMER:
    // Ensures the tour NEVER stalls even if audio playback is blocked, muted, or synthesis times out!
    const safeDuration = Math.max(8000, Math.min(22000, speechText.length * 85 + 3500));
    console.log('[PinIT Tour] ⏱️ Armed auto-advance fallback timer (' + safeDuration + 'ms) for Step ' + (tourStep + 1));
    tourFallbackTimerRef.current = setTimeout(() => {
      console.warn('[PinIT Tour] ⏩ Fallback timer fired for Step ' + (tourStep + 1) + ' ("' + slide.title + '"). Auto-shifting to next tab!');
      advanceTourSlide(true);
    }, safeDuration);

    speakWithAvatar(speechText, teacherId, () => {
      setIsSpeaking(true);
      console.log('[PinIT Tour] 🗣️ Mentor narration started for Step ' + (tourStep + 1));
    }, () => {
      setIsSpeaking(false);
      console.log('[PinIT Tour] 🎙️ Narration completed naturally for Step ' + (tourStep + 1) + '. Auto-advancing to next tab in 2.2s...');
      clearTourAdvanceTimer();
      tourAdvanceTimerRef.current = setTimeout(() => {
        console.log('[PinIT Tour] ⏭️ 2.2s timer elapsed. Transitioning to next tab...');
        advanceTourSlide(true);
      }, 2200);
    });
  }, [tourActive, tourStep, teacherId, router, clearTourAdvanceTimer, advanceTourSlide]);

  // Speak tour slide out loud and automatically switch pages to show corresponding tab
  // NOTE: cleanPath/intentionally excluded from deps — it changes as a side-effect of
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

  if (!mounted || isOnboardingOrAuth) return null;

  const dismissTour = () => {
    setTourActive(false);
    setStoryLocked(false);
    stopSpeaking();
    setIsSpeaking(false);
    completeStoryTour(user?.id);
    if (cleanPath !== '/dashboard') {
      router.push('/dashboard');
    }
  };
  const prevTourSlide = () => {
    if (tourStep > 0) {
      lastSpokenTourStepRef.current = null;
      setTourStep(s => s - 1);
    }
  };
  const nextTourSlide = () => {
    if (tourStep >= TOUR_SLIDES.length - 1) {
      openVoiceSegment();
    } else {
      lastSpokenTourStepRef.current = null;
      setTourStep(s => s + 1);
    }
  };
  const replayCurrentSlide = () => {
    lastSpokenTourStepRef.current = null;
    const slide = TOUR_SLIDES[tourStep];
    if (slide) {
      const speechText = slide.text.replace(/\*\*/g, '').replace(/🎉|🏠|🛠️|🗺|⚡|🎙|🧬|🔬|🎯|💬|🚀|👋|🌅|✨|💙|⚔️|🏆|📖|🧠|🔔|👤|📚/g, '');
      stopSpeaking();
      speakWithAvatar(speechText, teacherId, () => {}, () => {});
    }
  };

  const startStoryMode = () => {
    setCelebEvent(null);
    stopSpeaking();
    resetStoryTour(user?.id);
    onExpandLeftNav?.();
    setStoryLocked(true);
    setTourActive(true);
    setTourStep(0);
    setMinimized(false);
  };

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
            bottom: 24,
            zIndex: 9999,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            background: 'linear-gradient(135deg, rgba(15,23,42,0.92) 0%, rgba(30,27,75,0.92) 100%)',
            backdropFilter: 'blur(12px)',
            border: '1.5px solid rgba(var(--brand-rgb), 0.4)',
            borderRadius: 30,
            padding: '6px 14px 6px 8px',
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
            width: 38,
            height: 38,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--accent), var(--purple))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 18,
            boxShadow: '0 2px 10px rgba(79,70,229,0.5)',
            position: 'relative'
          }}>
            {teacher.emoji}
            <span style={{
              position: 'absolute',
              bottom: 1,
              right: 1,
              width: 9,
              height: 9,
              borderRadius: '50%',
              background: '#22c55e',
              border: '2px solid #0f172a'
            }} />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 800, color: 'var(--text)' }}>
              {teacher.name}
            </div>
            <div style={{ fontSize: 9.5, color: '#a5b4fc', fontFamily: 'var(--font-mono)' }}>
              AI Mentor · Click to Chat
            </div>
          </div>
        </div>
      )}

      {/* ── Expanded floating avatar mentor window ── */}
      {!minimized && !shouldHideVisually && (
        <div style={{
          position: 'fixed',
          bottom: isCentered ? 'auto' : 24,
          top: isCentered ? '50%' : 'auto',
          left: isCentered
            ? '50%'
            : (isRightSidebarOpen && !isLeftSidebarOpen ? 88 : 'auto'),
          right: isCentered
            ? 'auto'
            : (isRightSidebarOpen && !isLeftSidebarOpen ? 'auto' : 24),
          transform: isCentered ? 'translate(-50%, -50%)' : 'none',
          zIndex: 9999,
          width: tourActive ? 560 : (isEnlarged ? 380 : 280),
          height: tourActive ? 320 : (isEnlarged ? 480 : 360),
          background: 'var(--bg2)',
          border: '1px solid var(--border)',
          borderRadius: 20,
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