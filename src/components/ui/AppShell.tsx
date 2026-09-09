'use client';
import { useState, useEffect, useRef, Suspense, lazy, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { useCareerProfile } from '@/lib/hooks/useCareerProfile';
import { useNotifications } from '@/lib/api/hooks';
import { useAppStore, toast } from '@/lib/store/useAppStore';
import { useCareerOS } from '@/lib/context/CareerOSContext';
import PinsBadge from '@/components/pins/PinsBadge';
import LiteChatInterface from '@/components/ui/LiteChatInterface';
import { speakWithAvatar, stopSpeaking } from '@/lib/tts';
import { HomeTab, ExamsTab, ResultsTab, NotesTab, NotificationsTab, ContactTab } from '@/components/dsai/AcademicTabs';
import { ExamEngine, ExamStartModal } from '@/components/_legacy/dsai/ExamEngine.jsx';
import { ToastProvider } from '@/lib/context/ToastContext';
import { useBatches } from '@/lib/context/BatchContext';

// Lazy-load avatar to avoid SSR issues with Three.js / VRoid
const AvatarMentorWidget = lazy(() => import('@/components/avatar/AvatarMentorWidget'));
import PublicEffectsShell from '@/components/effects/PublicEffectsShell';
import GearAudioHub from '@/components/nav/GearAudioHub';

// HelpBot removed - consolidated into GlobalAvatar AI Mentor

const TEACHER_CONFIG: Record<string, { name: string; color: string; emoji: string }> = {
  priya:  { name: 'Ms. Priya',  color: '#4f46e5', emoji: '👩‍💼' },
  anish:  { name: 'Mr. Anish',  color: '#0891b2', emoji: '👨‍💼' },
};

import VoiceRegistrationModal from '@/components/avatar/VoiceRegistrationModal';
import { completeStoryTour, isStoryTourPending, resetStoryTour } from '@/lib/storyTour';
import { matchNavigationIntent } from '@/components/avatar/hooks/useVoiceNavigation';

// ── Story tour: Segment 1 Left Main (10 tabs) → Segment 2 Left Bottom (3 tabs) → Segment 3 Right Sidebar (1 tab) ──
const TOUR_SLIDES = [
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
    route: '/learning',
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

  // ── Segment 2: Left Nav Bottom Hubs ──
  {
    emoji: '🔔',
    title: 'Notifications Hub',
    tabKey: 'notifications',
    route: '/notifications',
    segment: 2,
    segmentLabel: 'SEGMENT 2/3 · ESSENTIAL UTILITIES',
    text: "This is Notifications — your instant dispatch center. Receive real-time alerts for quest rewards, streak milestones, recruiter views, and daily missions.",
  },
  {
    emoji: '⚡',
    title: 'Pins Economy & Upgrades',
    tabKey: 'pricing',
    route: '/pricing',
    segment: 2,
    segmentLabel: 'SEGMENT 2/3 · ESSENTIAL UTILITIES',
    text: "This is Pins & Plans — Pins are your earned currency for consistency. Spend Pins to unlock premium quests, custom skill tests, and advanced AI features.",
  },
  {
    emoji: '👤',
    title: 'Profile & Mentor Settings',
    tabKey: 'profile',
    route: '/profile',
    segment: 2,
    segmentLabel: 'SEGMENT 2/3 · ESSENTIAL UTILITIES',
    text: "This is your Profile — customize career preferences, manage credentials, view your full Career DNA, and select your AI mentor like Priya or Anish.",
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

const TOUR_STEP_ROUTES: Record<number, string> = {
  0: '/dashboard',
  1: '/quests',
  2: '/missions',
  3: '/arena',
  4: '/projects',
  5: '/leaderboard',
  6: '/interview',
  7: '/group-discussion',
  8: '/learning',
  9: '/attention-span',
  10: '/notifications',
  11: '/pricing',
  12: '/profile',
  13: '/dashboard',
};

// ── Build congratulations message from event payload ─────────────────────────
function buildCongratMessage(detail: any, profile: any): { headline: string; body: string; tip: string } {
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

// Global floating avatar component with tab tour, activity congrats, and proper minimize handling
function GlobalAvatar({
  user,
  profile,
  refreshProfile,
  onOpenRightSidebar,
  onExpandLeftNav,
  isRightSidebarOpen = false,
  isLeftSidebarOpen = true,
  onTourSlideChange,
}: {
  user: any;
  profile: any;
  refreshProfile?: () => void;
  onOpenRightSidebar?: () => void;
  onExpandLeftNav?: () => void;
  isRightSidebarOpen?: boolean;
  isLeftSidebarOpen?: boolean;
  onTourSlideChange?: (route: string | null, tabKey: string | null) => void;
}) {
  const cOS = useCareerOS();
  const pathname = usePathname();
  const router = useRouter();
  const cleanPath = pathname?.replace(/\/$/, '') || '';

  const {
    onboardingStep, setOnboardingStep,
    resumeGenerated, roadmapGenerated,
    completedQuests, javaTestPassed
  } = cOS;

  const [mounted, setMounted] = useState(false);
  const [showSpeechBubble, setShowSpeechBubble] = useState(true);
  const [minimized, setMinimized] = useState(true);
  const [isEnlarged, setIsEnlarged] = useState(false);
  const [showVoiceRegModal, setShowVoiceRegModal] = useState(false);

  // ── Tour state ─────────────────────────────────────────────────────────────
  const [tourActive, setTourActive] = useState(false);
  const tourActiveRef = useRef(tourActive);
  tourActiveRef.current = tourActive;
  const [tourStep, setTourStep] = useState(0);
  const [storyLocked, setStoryLocked] = useState(false);
  const lastSpokenTourStepRef = useRef<number | null>(null);

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
  const isExam = cleanPath === '/exams' || cleanPath.startsWith('/exams/');

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
  const [unrecognizedBadge, setUnrecognizedBadge] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
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
        const hasWakeWord = transcript.includes('hey priya') || 
                            transcript.includes('priya') || 
                            transcript.includes('hey anish') || 
                            transcript.includes('anish') || 
                            transcript.includes('hey vikram') || 
                            transcript.includes('hey aisha') || 
                            transcript.includes(`hey ${mentorName}`) || 
                            transcript.includes(mentorName);

        if (!hasWakeWord) return;

        setUnrecognizedBadge(false);
        setMinimized(false);
        resetIdleTimer();
        stopSpeaking();

        // 1. Socratic Guidance Queries ("what to do", "what should I do", "recommendation", "where to go")
        const isWhatToDoQuery = transcript.includes('what to do') || 
                                transcript.includes('what should i do') || 
                                transcript.includes('what next') || 
                                transcript.includes('recommend') || 
                                transcript.includes('where to go') ||
                                transcript.includes('guide me') ||
                                transcript.includes('what should i study');

        if (isWhatToDoQuery) {
          console.log('[VoiceNav] Socratic query detected on route:', cleanPath);
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
          console.log('[VoiceNav] Navigation intent matched:', navResult.displayName, '->', navResult.path);
          speakWithAvatar(`Navigating to ${navResult.displayName}!`, teacherId, () => {}, () => {});
          router.push(navResult.path);
          return;
        }

        // 3. General Wake Word Greeting
        console.log('[VoiceNav] Wake word acknowledged for mentor:', teacher.name);
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
  }, [teacher.name, teacherId, user?.id, resetIdleTimer]);

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
  }, [mounted, user?.id, cleanPath, tourActive, showVoiceRegModal, onExpandLeftNav]);

  // ── Auto-expand appropriate sidebars per tour segment ──────────────────────
  useEffect(() => {
    if (!tourActive) return;
    if (tourStep < 13) {
      // Slides 0 to 12: Main Left Nav & Bottom Items — expand Left Nav
      onExpandLeftNav?.();
    } else if (tourStep === 13) {
      // Slide 13: Academic Portal Right Sidebar — expand Right Sidebar!
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

  // Speak tour slide out loud and automatically switch pages to show corresponding tab
  useEffect(() => {
    if (!tourActive || !TOUR_SLIDES[tourStep]) {
      lastSpokenTourStepRef.current = null;
      return;
    }

    // 1. Navigate to target tab if needed
    const targetRoute = TOUR_STEP_ROUTES[tourStep];
    if (targetRoute && cleanPath !== targetRoute) {
      router.push(targetRoute);
    }

    // 2. Prevent restarting speech if already speaking for this tourStep
    if (lastSpokenTourStepRef.current === tourStep) {
      return;
    }
    lastSpokenTourStepRef.current = tourStep;

    const slide = TOUR_SLIDES[tourStep];
    const speechText = slide.text.replace(/\*\*/g, '').replace(/🎉|🏠|🛠️|🗺|⚡|🎙|🧬|🔬|🎯|💬|🚀|👋|🌅|✨|💙|⚔️|🏆|📖|🧠|🔔|👤|📚/g, '');
    
    stopSpeaking();

    speakWithAvatar(
      speechText,
      teacherId,
      () => {}, // onStart
      () => {
        // Narration completed — wait for user to click Next or Explore
      }
    );
  }, [tourActive, tourStep, teacherId, router, cleanPath]);

  // Speak congratulations out loud when a celebration triggers (ensuring only once per event object)
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

  if (!mounted) return null;

  // ── Tour navigation helpers ───────────────────────────────────────────────
  const openVoiceSegment = () => {
    setTourActive(false);
    stopSpeaking();
    setMinimized(false);
    setShowVoiceRegModal(true);
    if (cleanPath !== '/dashboard') router.push('/dashboard');
  };
  const dismissTour = () => {
    setTourActive(false);
    setStoryLocked(false);
    stopSpeaking();
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

  const triggerCongrats = () => {
    setTourActive(false);
    stopSpeaking();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('pinit:trigger_congrats', {
        detail: {
          type: 'mission',
          title: 'Big Milestone Accomplished!',
          score: 100,
          passed: true,
        }
      }));
    }
  };

  // ── Determine dialogue text ───────────────────────────────────────────────
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
      // ── Post-onboarding: Context-aware tab guide ──
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
        '/pricing': "⚡ **Pins & Plans** — Manage your Pin balance earned through daily activity. Spend Pins to unlock premium quests and advanced AI features.",
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

  // Centered vs Docked Styles
  const isCentered = onboardingStep === 0;

  // ── Congratulations Card ──────────────────────────────────────────────────
  const CongratCard = () => {
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
          onClick={() => {
            setCelebEvent(null);
            stopSpeaking();
          }}
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

  return (
    <>
      {/* Non-blocking soft aura when avatar is active */}
      {isCentered && !minimized && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'transparent',
          pointerEvents: 'none',
          zIndex: 99,
        }} />
      )}

      {/* Minimized Trigger Button */}
      {minimized && !shouldHideVisually && (
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: isRightSidebarOpen ? (isLeftSidebarOpen ? '280px' : '96px') : '50%',
          right: 'auto',
          transform: isRightSidebarOpen ? 'none' : 'translateX(-50%)',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}>
          {unrecognizedBadge && (
            <div style={{
              marginBottom: 6,
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              color: 'var(--text)',
              fontSize: 10,
              fontWeight: 800,
              padding: '4px 10px',
              borderRadius: 20,
              boxShadow: '0 4px 15px rgba(var(--danger-rgb),  0.6)',
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.3px',
              whiteSpace: 'nowrap',
              animation: 'bounce 0.6s infinite alternate',
            }}>
              🔴 Unrecognized Speaker! Voice Access Blocked.
            </div>
          )}
          <button
            onClick={() => setMinimized(false)}
            style={{
              width: 52,
              height: 44,
              borderRadius: '20px 20px 0 0',
              background: unrecognizedBadge ? 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)' : teacher.color,
              border: unrecognizedBadge ? '2px solid #ef4444' : '2px solid var(--accent)',
              borderBottom: 'none',
              cursor: 'pointer',
              fontSize: 22,
              boxShadow: unrecognizedBadge ? '0 -4px 25px rgba(var(--danger-rgb),  0.9)' : `0 -4px 20px ${teacher.color}60`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: unrecognizedBadge ? 1 : 0.55,
              transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '1';
              e.currentTarget.style.transform = 'scale(1.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = unrecognizedBadge ? '1' : '0.55';
              e.currentTarget.style.transform = 'scale(1)';
            }}
            title={unrecognizedBadge ? 'Unrecognized Speaker Detected!' : `Open ${teacher.name}`}
          >
            {unrecognizedBadge ? '🚫' : teacher.emoji}
          </button>
        </div>
      )}

      {/* Main Avatar Container */}
      {!shouldHideVisually && (
        <div
          onMouseEnter={(e) => {
            if (!isEnlarged && !isCentered && !tourActive) {
              e.currentTarget.style.opacity = '1';
            }
          }}
          onMouseLeave={(e) => {
            if (!isEnlarged && !isCentered && !tourActive) {
              e.currentTarget.style.opacity = '0.92';
            }
          }}
          style={tourActive ? {
            position: 'fixed',
            bottom: '18px',
            left: isRightSidebarOpen ? (isLeftSidebarOpen ? '260px' : '84px') : 'auto',
            right: isRightSidebarOpen ? 'auto' : '24px',
            width: '500px',
            maxWidth: 'calc(100vw - 32px)',
            height: '245px',
            maxHeight: '38vh',
            zIndex: 1000,
            borderRadius: 18,
            overflow: 'hidden',
            boxShadow: '0 20px 45px -10px rgba(0,0,0,0.6), 0 0 30px rgba(79,70,229,0.35)',
            border: '2px solid var(--accent)',
            background: 'linear-gradient(145deg, rgba(15,23,42,0.98) 0%, rgba(30,27,75,0.98) 100%)',
            backdropFilter: 'blur(16px)',
            transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease',
            display: minimized ? 'none' : 'flex',
            flexDirection: 'row',
          } : isEnlarged ? {
            position: 'fixed',
            bottom: '24px',
            left: isRightSidebarOpen ? (isLeftSidebarOpen ? '260px' : '84px') : 'auto',
            right: isRightSidebarOpen ? 'auto' : '24px',
            width: '220px',
            height: '280px',
            maxWidth: '22vw',
            maxHeight: '40vh',
            zIndex: 1000,
            borderRadius: 18,
            overflow: 'visible',
            boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5), 0 0 30px rgba(79,70,229,0.3)',
            border: '2px solid var(--accent)',
            background: 'var(--bg2)',
            transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease',
            display: minimized ? 'none' : 'block',
          } : isCentered ? {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '220px',
            height: '280px',
            maxWidth: '20vw',
            maxHeight: '38vh',
            zIndex: 1000,
            borderRadius: 18,
            overflow: 'visible',
            boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5)',
            border: '2px solid var(--accent)',
            background: 'var(--bg2)',
            transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease',
            display: minimized ? 'none' : 'block',
          } : {
            position: 'fixed',
            bottom: '18px',
            left: isRightSidebarOpen ? (isLeftSidebarOpen ? '260px' : '84px') : 'auto',
            right: isRightSidebarOpen ? 'auto' : '24px',
            transform: 'none',
            width: '160px',
            height: '210px',
            maxWidth: '20vw',
            maxHeight: '30vh',
            zIndex: 100,
            borderRadius: 18,
            overflow: 'visible',
            boxShadow: '0 12px 32px rgba(0,0,0,0.45), 0 0 20px rgba(var(--brand-rgb), 0.25)',
            border: '1.5px solid rgba(255,255,255,0.18)',
            background: 'linear-gradient(180deg, rgba(30,27,75,0.92) 0%, rgba(15,23,42,0.98) 100%)',
            backdropFilter: 'blur(16px)',
            transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease',
            display: minimized ? 'none' : 'block',
          }}
        >
          {tourActive ? (
            /* ── Side-by-side Story Tour Mode (60% Story Text & Controls | 40% 3D VRoid Mentor Avatar) ── */
            <>
              {/* Left Side: 58-60% Interactive Story Card */}
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
                      <span style={{ fontSize: 13 }}>{TOUR_SLIDES[tourStep]?.emoji || '✨'}</span>
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
                    {TOUR_SLIDES[tourStep]?.title}
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
                    {TOUR_SLIDES[tourStep]?.text}
                  </div>
                </div>

                {/* Controls toolbar */}
                <div style={{ display: 'flex', gap: 4, marginTop: 6, width: '100%', alignItems: 'center' }}>
                  {tourStep > 0 && (
                    <button
                      onClick={prevTourSlide}
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
                    onClick={replayCurrentSlide}
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
                    onClick={nextTourSlide}
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
                    onClick={dismissTour}
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

              {/* Right Side: 42% 3D VRoid Mentor Avatar */}
              <div style={{
                flex: '0 0 42%',
                width: '42%',
                height: '100%',
                position: 'relative',
                overflow: 'hidden',
                background: 'radial-gradient(circle at 50% 50%, rgba(var(--brand-rgb), 0.2) 0%, rgba(15,23,42,0.8) 100%)',
              }}>
                <div style={{
                  position: 'absolute',
                  top: 6,
                  right: 8,
                  zIndex: 10,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  background: 'rgba(15,23,42,0.7)',
                  backdropFilter: 'blur(6px)',
                  padding: '2px 6px',
                  borderRadius: 10,
                  border: '1px solid rgba(255,255,255,0.1)',
                  fontSize: 9,
                  color: '#22c55e',
                  fontFamily: 'var(--font-mono)',
                }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 5px #22c55e' }} />
                  Live
                </div>
                <Suspense fallback={
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>
                    Loading mentor...
                  </div>
                }>
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
                  />
                </Suspense>
              </div>
            </>
          ) : (
            /* ── Normal Mode (Compact Floating Avatar Box) ── */
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
              {/* Quick floating action bar over avatar */}
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

              {/* 3D WebGL / VRoid Avatar Mentor Container */}
              <div style={{ width: '100%', height: '100%', overflow: 'hidden', borderRadius: isCentered ? 20 : '20px 20px 0 0' }}>
                <Suspense fallback={
                  <div style={{ width: '100%', height: '100%', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>
                    Loading mentor...
                  </div>
                }>
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
                  />
                </Suspense>
              </div>

              {/* Congratulations Overlay */}
              <CongratCard />
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
}


type NavLeaf  = { href: string; icon: string; label: string; badge?: boolean };
type NavGroup = { label: string; icon: string; children: NavLeaf[] };
type NavNode  = NavLeaf | NavGroup;
type NavSection = { section: string; items: NavNode[] };

const isGroup = (n: NavNode): n is NavGroup => 'children' in n;

const STUDENT_NAV: NavSection[] = [
  { section: 'PinIT Career OS', items: [
    { href: '/dashboard', icon: '🏠', label: 'Dashboard' },
    { href: '/quests', icon: '🗺', label: 'Quests & Courses' },
    { href: '/missions', icon: '⚡', label: 'Daily Missions' },
    { href: '/arena', icon: '⚔️', label: 'Challenging Arena' },
    { href: '/projects', icon: '🚀', label: 'Projects & Squads' },
    { href: '/leaderboard', icon: '🏆', label: 'Leaderboard & Leagues' },
    { href: '/interview', icon: '🎙', label: 'AI Interview' },
    { href: '/group-discussion', icon: '💬', label: 'GD Practice' },
    { href: '/learning', icon: '📖', label: 'Learning & Twin' },
    { href: '/attention-span', icon: '🧠', label: 'Attention Span' }
  ]}
];

const RIGHT_NAV: { id: string; href?: string; icon: string; label: string }[] = [
  { id: 'home', icon: '🏠', label: 'Home' },
  { id: 'exams', icon: '📝', label: 'My Exams' },
  { id: 'results', icon: '📊', label: 'My Results' },
  { id: 'notes', icon: '📚', label: 'Study Notes' },
  { id: 'notifications', href: '/notifications', icon: '🔔', label: 'Notifications' },
  
  // Shifted student services:
  { id: 'services', href: '/services', icon: '💼', label: 'Student Services' },
  // Shifted student experience:
  { id: 'library', href: '/library', icon: '📚', label: 'Library Center' },
  { id: 'hostel', href: '/hostel', icon: '🏢', label: 'Hostel Hub' },
  { id: 'transport', href: '/transport', icon: '🚌', label: 'Transit Desk' },
  { id: 'events', href: '/events', icon: '🎉', label: 'Campus Events' },
  { id: 'contact_admin', href: '/grievances', icon: '💬', label: 'Contact Admin' },
  // Shifted from Faculty studio:
  { id: 'research', href: '/research', icon: '🔬', label: 'Research Desk' },
  // Shifted career intelligence:
  { id: 'career_intel', href: '/career-intelligence', icon: '🎯', label: 'Career Intelligence' },
  // Shifted operations:
  { id: 'finance', href: '/finance', icon: '💳', label: 'Finance & Fees' },
  { id: 'infrastructure', href: '/maintenance', icon: '🔧', label: 'Infrastructure' },
  // Shifted intelligence center:
  { id: 'advisor', href: '/advisor', icon: '🧠', label: 'AI Academic Advisor' }
];

const ADMIN_NAV: NavSection[] = [
  { section: 'PinIT Career OS', items: [
    { href: '/admin', icon: '🏠', label: 'Dashboard' },
    { label: 'Campus Core', icon: '🎓', children: [
      { href: '/admin/cohorts', icon: '📊', label: 'Cohort Placement Funnel' },
      { href: '/admissions', icon: '🎟️', label: 'Admissions' },
      { href: '/admin/students', icon: '🧑‍🎓', label: 'Students Directory' },
      { href: '/admin/exams', icon: '📝', label: 'Exam Manager' },
      { href: '/admin?tab=documents', icon: '📄', label: 'Document Vault' },
      { href: '/admin?tab=services', icon: '💼', label: 'Student Services' }
    ]},
    { label: 'Student Experience', icon: '🎒', children: [
      { href: '/admin?tab=library', icon: '📚', label: 'Library' },
      { href: '/admin?tab=hostel', icon: '🏢', label: 'Hostel Desk' },
      { href: '/admin?tab=transport', icon: '🚌', label: 'Transport' },
      { href: '/admin?tab=events', icon: '🎉', label: 'Events Registry' },
      { href: '/admin?tab=broadcast', icon: '🔔', label: 'Broadcast Admin' },
      { href: '/admin?tab=grievances', icon: '⚖️', label: 'Grievance Review' }
    ]},
    { label: 'Faculty Studio', icon: '👨‍🏫', children: [
      { href: '/admin/teacher', icon: '👩‍🏫', label: 'Faculty Manager' },
      { href: '/admin?tab=research', icon: '🔬', label: 'Research Projects' },
      { href: '/quests/teacher-select', icon: '🗺', label: 'Quest Selector' },
      { href: '/admin?tab=hr', icon: '💼', label: 'HR & Clock Logs' }
    ]},
    { label: 'Career Intelligence', icon: '🚀', children: [
      { href: '/career-dna', icon: '🧬', label: 'Career DNA' },
      { href: '/career-builder', icon: '🛠️', label: 'Resume Builder' },
      { href: '/recruiter', icon: '🔍', label: 'ATS Pipelines' },
      { href: '/interview', icon: '🎙', label: 'AI Interview' },
      { href: '/missions', icon: '⚡', label: 'Coding Missions' },
      { href: '/quests', icon: '🗺', label: 'Coding Quests' },
      { href: '/crm', icon: '💼', label: 'Company CRM' }
    ]},
    { label: 'Campus Operations', icon: '🏢', children: [
      { href: '/admin?tab=finance', icon: '💳', label: 'Finance Console' },
      { href: '/admin?tab=procurement', icon: '🛒', label: 'Procurement PO' },
      { href: '/admin?tab=assets', icon: '📦', label: 'Asset Management' },
      { href: '/admin?tab=maintenance', icon: '🔧', label: 'Infrastructure Maintenance' }
    ]},
    { label: 'Administration', icon: '⚙', children: [
      { href: '/admin?tab=users', icon: '👥', label: 'Users & Roles' },
      { href: '/university', icon: '🏫', label: 'Multi-campus Select' }
    ]},
    { label: 'Intelligence Center', icon: '📊', children: [
      { href: '/analytics', icon: '📊', label: 'Analytics' },
      { href: '/university', icon: '📋', label: 'Annual Reports' },
      { href: '/admin?tab=advisor', icon: '🧠', label: 'AI Advisor Logs' }
    ]},
    { label: 'Enterprise', icon: '🌐', children: [
      { href: '/integrations', icon: '🔌', label: 'API Integrations' },
      { href: '/admin/settings', icon: '⚡', label: 'Migration Wizard' },
      { href: '/admin/settings', icon: '🔑', label: 'API Gateway keys' }
    ]}
  ]}
];

const RECRUITER_NAV: NavSection[] = [
  { section: 'Hiring', items: [
    { href: '/recruiter', icon: '🔍', label: 'Candidates' },
    { href: '/analytics', icon: '📊', label: 'Analytics'  },
  ]},
];

const PARENT_NAV: NavSection[] = [
  { section: 'Family', items: [
    { href: '/parent', icon: '👨‍👩‍👧', label: 'My Children' },
  ]},
];

const CONSULTANT_NAV: NavSection[] = [
  { section: 'CRM', items: [
    { href: '/consultant', icon: '🗂', label: 'Student CRM' },
    { href: '/analytics',  icon: '📊', label: 'Analytics'   },
  ]},
];

const TEACHER_NAV: NavSection[] = [
  { section: 'Faculty Workspace', items: [
    { href: '/admin/teacher', icon: '👩‍🏫', label: 'Teacher Panel' },
    { href: '/quests/teacher-select', icon: '🗺', label: 'Quest Selector' },
    { href: '/quests', icon: '⚔️', label: 'Coding Quests' },
    { href: '/learning', icon: '📖', label: 'Learning Roadmaps' },
  ]},
  { section: 'Academic Mentoring', items: [
    { href: '/advisor', icon: '🧠', label: 'AI Advisor Logs' },
    { href: '/portfolio', icon: '👤', label: 'Student Portfolio' },
    { href: '/internships', icon: '🏢', label: 'Internships Review' },
    { href: '/projects', icon: '💼', label: 'Industry Projects & Squads' },
    { href: '/quests?tab=passport', icon: '🎫', label: 'Skill Passport & Transcript' }
  ]}
];

const BOTTOM_NAV: NavLeaf[] = [
  { href: '/notifications', icon: '🔔', label: 'Notifications', badge: true },
  { href: '/pricing',       icon: '⚡', label: 'Pins & Plans'            },
  { href: '/profile',       icon: '👤', label: 'Profile'                    },
];

const PAGE_TITLES: Record<string, string> = {
  '/dashboard':     'Home',          '/resume':        'Resume & ATS',
  '/career-builder': 'Career Builder',
  '/career-assets': 'Career Assets', '/career-dna':   'Career DNA',    '/trust':         'Trust Score',
  '/career-twin':   'Career Twin',   '/missions':      'Daily Missions',
  '/learn':         'Learn',         '/exam':          'Exams',
  '/interview':     'Interview AI',  '/personality':   'Personality',
  '/vault':         'Vault',         '/opportunities': 'Opportunities',
  '/analytics':     'Analytics',     '/sentinel':      'Sentinel',
  '/recruiter':     'Candidates',    '/admin':         'Admin Panel',
  '/admin/exams':   'Exam Manager',  '/admin/teacher': 'Teacher Panel',
  '/admin/students':'Students',      '/consultant':    'Student CRM',
  '/attendance':    'Attendance',    '/parent':        'Parent Portal',
  '/pricing':       'Pins & Plans','/profile':      'Profile',
  '/notifications': 'Notifications', '/leaderboard':   'Leaderboard & Leagues',
  '/applications':  'My Applications',
  '/quests':        'Quests & Courses',
  '/arena':         'Challenging Arena',
  '/projects':      'Projects & Squads',
  '/attention-span': 'Attention Span',
  '/qr-confirm':    'Confirm QR Login',
  '/onboarding':    'Setup',         '/qr-login':      'QR Login',
  '/reset-password':'Reset Password',
};

const PUBLIC_PATHS = ['/', '/login', '/signup', '/reset-password', '/qr-login', '/qr-confirm', '/onboarding', '/privacy', '/terms', '/contact', '/admissions', '/about', '/pricing', '/problem', '/identity', '/how-it-works', '/modules', '/campus-demo', '/university', '/services'];

function getNav(role: string, _pathname: string = ''): NavSection[] {
  // Nav must follow authenticated role only — never privilege by URL path.
  if (role === 'teacher') return TEACHER_NAV;
  if (['admin', 'superadmin'].includes(role)) return ADMIN_NAV;
  if (role === 'recruiter') return RECRUITER_NAV;
  if (role === 'parent') return PARENT_NAV;
  if (role === 'consultant') return CONSULTANT_NAV;
  return STUDENT_NAV;
}

function isPathActive(pathname: string, href: string) {
  if (href === '/') return pathname === href;
  return pathname === href || pathname.startsWith(href + '/');
}

function DsaiAcademicTabWrapper({ tab, student, onStartExam, examCheckLoading }: any) {
  if (!tab) return null;
  const academicStudent = {
    name: student?.displayName || student?.name || 'Student',
    registerNumber: student?.registerNumber || '',
    batch: student?.batch || '',
  };
  try {
    switch (tab) {
      case 'home':
        return <HomeTab student={academicStudent} onStartExam={onStartExam} examCheckLoading={examCheckLoading} />;
      case 'exams':
        return <ExamsTab student={academicStudent} onStartExam={onStartExam} examCheckLoading={examCheckLoading} />;
      case 'results':
        return <ResultsTab student={academicStudent} />;
      case 'notes':
        return <NotesTab student={academicStudent} />;
      case 'notifications':
        return <NotificationsTab student={academicStudent} />;
      case 'contact':
        return <ContactTab student={academicStudent} />;
      default:
        return null;
    }
  } catch (err) {
    console.error("Academic tab render error:", err);
    return null;
  }
}

function SearchParamsHandler({ onTabChange }: { onTabChange: (tab: string | null) => void }) {
  const searchParams = useSearchParams();
  const searchTab = searchParams ? searchParams.get('tab') : null;

  useEffect(() => {
    onTabChange(searchTab);
  }, [searchTab, onTabChange]);

  return null;
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname              = usePathname();
  const router                = useRouter();
  const searchParams          = useSearchParams();
  const { user, loading, logout } = useAuth();
  const { profile, refresh: refreshProfile } = useCareerProfile();
  const { data: notifData }   = useNotifications();
  const wsConnected           = useAppStore(s => s.wsConnected);
  const { colorMap }          = useBatches();

  // Unified Career OS Context nervous system
  const cOS = useCareerOS();
  const { 
    careerScore, 
    dnaScore, 
    trustScore, 
    missionOnlyStreak, 
    onboardingAnswers, 
    vaultItems, 
    completedMissions, 
    jdMissingSkills,
    theme,
    focusMode,
    toggleTheme,
    toggleFocusMode,
    pins,
    onboardingStep,
    isLoaded,
  } = cOS;

  const isRedirectingRef = useRef(false);
  const [collapsed, setCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const [liteUiMode, setLiteUiMode] = useState(false);
  const [isGdCall, setIsGdCall] = useState(false);
  const [isRoleplayParamActive, setIsRoleplayParamActive] = useState(false);
  const [activeTourRoute, setActiveTourRoute] = useState<string | null>(null);
  const [activeTourTabKey, setActiveTourTabKey] = useState<string | null>(null);

  const [activeAcademicTab, setActiveAcademicTab] = useState<string | null>(null);

  // ── Decoupled sidebars: left and right sidebar states operate independently ──
  const toggleLeftSidebar = useCallback((forceCollapse?: boolean) => {
    setCollapsed(prev => (typeof forceCollapse === 'boolean' ? forceCollapse : !prev));
  }, []);

  const toggleRightSidebar = useCallback((forceCollapse?: boolean) => {
    setRightCollapsed(prev => {
      const next = typeof forceCollapse === 'boolean' ? forceCollapse : !prev;
      if (!next) {
        setActiveAcademicTab(current => current || 'home');
      }
      return next;
    });
  }, []);

  const [pendingExam, setPendingExam] = useState<any>(null);
  const [examScreen, setExamScreen] = useState<'dashboard' | 'exam-start' | 'exam'>('dashboard');
  const [examCheckLoading, setExamCheckLoading] = useState(false);

  const handleTabChange = useCallback((searchTab: string | null) => {
    const validAcademicTabs = ['home', 'exams', 'results', 'notes', 'notifications', 'contact', 'study-notes', 'student-services', 'library', 'hostel', 'transit', 'events'];
    if (searchTab && validAcademicTabs.includes(searchTab) && pathname !== '/profile') {
      setActiveAcademicTab(searchTab);
      toggleRightSidebar(false);
    } else {
      setActiveAcademicTab(null);
    }
  }, [pathname, toggleRightSidebar]);

  const handleStartExamRequest = async (examSchedule: any) => {
    if (!user?.registerNumber) {
      toast.warning('Register Number Required', 'Please set your Register Number in Profile settings before attempting exams.');
      return;
    }
    setExamCheckLoading(true);

    try {
      // 1. Check local client cache first
      const studentId = user.id || 'student';
      const localAttemptKey = `pinit_exam_attempt_${studentId}_${examSchedule.id}`;
      const regAttemptKey = user.registerNumber ? `pinit_exam_attempt_${user.registerNumber}_${examSchedule.id}` : null;
      if (typeof window !== 'undefined' && (localStorage.getItem(localAttemptKey) || (regAttemptKey && localStorage.getItem(regAttemptKey)))) {
        toast.warning('Attempt Blocked', 'You have already attempted this exam.');
        return;
      }

      // 2. Check Supabase / Local database via examsService
      const { examsService } = await import('@/lib/services/examsService');
      const attemptedInDb = await examsService.checkExamAttempt(studentId, user.registerNumber, examSchedule.id);
      if (attemptedInDb) {
        toast.warning('Attempt Blocked', 'You have already attempted this exam.');
        return;
      }

      // 3. Check legacy Firebase DB if available (non-blocking fallback)
      try {
        const { DB: dsaiDB } = await import('@/lib/dsaiFirebase');
        const results = await dsaiDB.getAll('exam_results');
        const alreadyDone = results.find(
          (r: any) => r.registerNumber === user.registerNumber && r.examScheduleId === examSchedule.id
        );
        if (alreadyDone) {
          toast.warning('Attempt Blocked', 'You have already attempted this exam.');
          return;
        }
      } catch {
        // Firebase offline or unconfigured — Supabase + local cache is authoritative
      }

      setPendingExam(examSchedule);
      setExamScreen('exam-start');
    } catch (err: any) {
      console.warn('Exam check encountered issue:', err);
      setPendingExam(examSchedule);
      setExamScreen('exam-start');
    } finally {
      setExamCheckLoading(false);
    }
  };

  const handleExamFinished = async (result: any) => {
    const finishedExam = pendingExam;
    setPendingExam(null);
    setExamScreen('dashboard');

    if (finishedExam && user) {
      try {
        const studentId = user.id || 'student';
        const localAttemptKey = `pinit_exam_attempt_${studentId}_${finishedExam.id}`;
        const regAttemptKey = user.registerNumber ? `pinit_exam_attempt_${user.registerNumber}_${finishedExam.id}` : null;
        if (typeof window !== 'undefined') {
          localStorage.setItem(localAttemptKey, JSON.stringify({ timestamp: Date.now(), score: result?.score }));
          if (regAttemptKey) {
            localStorage.setItem(regAttemptKey, JSON.stringify({ timestamp: Date.now(), score: result?.score }));
          }
        }

        const { examsService } = await import('@/lib/services/examsService');
        await examsService.recordExamAttempt({
          studentId,
          registerNumber: user.registerNumber,
          examScheduleId: finishedExam.id,
          score: result?.score,
          passed: result?.passed !== false
        });
        toast.success('Exam Completed! 📝', 'Your exam answers and submission record have been saved.');
      } catch (err) {
        console.warn('Could not persist exam attempt record:', err);
      }
    }
  };

  // Global Study notebook states for Quests & Lessons
  const [questId, setQuestId] = useState<string | null>(null);
  const [notesOpen, setNotesOpen] = useState(false);
  const [notesContent, setNotesContent] = useState('');

  // Extract questId from pathname or query params dynamically
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const qId = params.get('questId') || window.location.pathname.split('/').pop() || null;
      setQuestId(qId);
    }
  }, [pathname]);

  // Dynamically observe search parameter changes for the group discussion call or roleplay active state to toggle full screen
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const checkCallAndRoleplay = () => {
      const activeCall = window.location.pathname.startsWith('/group-discussion') && window.location.search.includes('call=true');
      setIsGdCall(activeCall);

      const activeRoleplay = window.location.pathname.startsWith('/missions') && window.location.search.includes('roleplay=true');
      setIsRoleplayParamActive(activeRoleplay);
    };
    checkCallAndRoleplay();
    window.addEventListener('popstate', checkCallAndRoleplay);
    return () => {
      window.removeEventListener('popstate', checkCallAndRoleplay);
    };
  }, [pathname, searchParams]);

  // Load notes dynamically when questId changes
  useEffect(() => {
    if (questId) {
      const saved = localStorage.getItem(`pinit_lesson_notes_${user?.id || 'anon'}_${questId}`);
      setNotesContent(saved || '');
    } else {
      setNotesContent('');
    }
  }, [questId]);

  const handleNotesChange = (text: string) => {
    setNotesContent(text);
    if (questId) {
      localStorage.setItem(`pinit_lesson_notes_${user?.id || 'anon'}_${questId}`, text);
    }
  };

  const handleSnapshotCode = () => {
    if (typeof window === 'undefined') return;
    const code = (window as any).__activeSlideCode;
    const slideNum = (window as any).__activeSlideNum || 1;
    if (code) {
      const updatedNotes = notesContent + `\n\n[Code Snapshot - Slide ${slideNum}]:\n\`\`\`java\n${code}\n\`\`\`\n`;
      handleNotesChange(updatedNotes);
      toast.success("Snapshot Saved", "Slide code has been added to your notes!");
    } else {
      toast.error("No Code", "This slide does not contain a code snippet.");
    }
  };

  const cleanPath = pathname?.replace(/\/$/, '') || '';
  const isLessonOrDetail = cleanPath.startsWith('/quests/') && cleanPath !== '/quests';
  const isGroupDiscussionCall = isGdCall;
  const isRoleplayActive = isRoleplayParamActive;
  const effectiveFocusMode = focusMode || isLessonOrDetail || isGroupDiscussionCall || isRoleplayActive;

  useEffect(() => {
    if (typeof window !== 'undefined' && user) {
      try {
        const saved = localStorage.getItem(`pinit_${user.id}_lite_ui_mode`);
        if (saved) {
          setLiteUiMode(JSON.parse(saved));
        }
      } catch {}
    }
  }, [user]);

  const isPublic    = pathname === '/' || PUBLIC_PATHS.filter(p => p !== '/').some(p => pathname.startsWith(p));
  const unread      = Array.isArray(notifData) ? notifData.filter((n: any) => !n.is_read).length : 0;
  const isStudent   = !['admin','superadmin','teacher','recruiter','parent','consultant'].includes(user?.role || '');
  const pageTitle   = PAGE_TITLES[pathname] || 'PinIT';

  useEffect(() => { 
    setMobileOpen(false); 
    setActiveAcademicTab(null);
  }, [pathname]);

  useEffect(() => {
    const nav = getNav(user?.role || 'student', pathname);
    const next: Record<string, boolean> = {};
    nav.forEach(sec => {
      sec.items.forEach(item => {
        if (isGroup(item) && item.children.some(c => isPathActive(pathname, c.href))) {
          next[item.label] = true;
        }
      });
    });
    setOpenGroups(prev => ({ ...prev, ...next }));
  }, [pathname, user?.role]);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === '[' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); toggleLeftSidebar(); }
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [toggleLeftSidebar]);

  // Reset redirecting ref on pathname or user change
  useEffect(() => {
    isRedirectingRef.current = false;
  }, [pathname, user]);

  // Redirect students who have not completed onboarding (onboardingStep < 3) to /onboarding
  useEffect(() => {
    if (!loading && isLoaded && user && isStudent && !isPublic && pathname !== '/onboarding') {
      const allowedStudentTabs = [
        '/interview', '/dashboard', '/quests', '/missions', '/learning', '/career-builder',
        '/projects', '/group-discussion', '/attention-span', '/profile', '/notifications',
        '/vault', '/library', '/hostel', '/transport', '/events', '/grievances', '/research',
        '/career-intelligence', '/finance', '/maintenance', '/advisor', '/exams', '/attendance',
        '/alumni', '/documents', '/crm', '/integrations',
      ];
      const isAllowedTab = allowedStudentTabs.some(tab => pathname === tab || pathname.startsWith(tab + '/'));
      if (onboardingStep < 3 && !isAllowedTab) {
        if (isRedirectingRef.current) return;
        isRedirectingRef.current = true;
        console.warn("[AppShell] Redirecting to /onboarding because onboardingStep is:", onboardingStep);
        router.push('/onboarding');
      }
    }
  }, [user, loading, isLoaded, isStudent, isPublic, onboardingStep, router, pathname]);

  // Redirect users who land on a portal that does not match their role
  useEffect(() => {
    if (loading || !user || isPublic) return;
    // Allow users to visit staff portals (RoleGate cards manage demo login internally)
  }, [loading, user, pathname, router, isPublic]);

  // Unauthenticated redirect check — allow landing pages & staff demo portals
  useEffect(() => {
    const isStaffPortal = ['/teacher', '/admin', '/recruiter', '/consultant', '/parent', '/finance', '/services'].some(p => pathname.startsWith(p));
    if (!loading && user === null && !isPublic && !isStaffPortal) {
      router.push('/?login=true');
    }
  }, [user, loading, isPublic, pathname, router]);

  const PUBLIC_SHOWCASE_PATHS = ['/', '/problem', '/identity', '/how-it-works', '/modules', '/pricing', '/campus-demo', '/about', '/contact', '/privacy', '/terms', '/university', '/admissions'];
  const isPublicShowcase = PUBLIC_SHOWCASE_PATHS.some(p => pathname === p || (p !== '/' && pathname.startsWith(p)));
  const isLandingPage = isPublicShowcase || ['/login', '/signup', '/reset-password', '/qr-login', '/qr-confirm', '/onboarding'].some(p => pathname === p || (p !== '/' && pathname.startsWith(p)));
  if (isPublicShowcase) return <PublicEffectsShell>{children}</PublicEffectsShell>;
  if (isLandingPage) return <>{children}</>;

  if (loading) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg)' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontSize:32, marginBottom:12, animation:'spin 1s linear infinite' }}>⬡</div>
        <div style={{ fontFamily:'var(--font-mono)', fontSize:11, color:'var(--t3)' }}>Loading...</div>
      </div>
    </div>
  );

  // If user is null but visiting a staff demo portal, allow rendering the page inside AppShell
  const isStaffPortal = ['/teacher', '/admin', '/recruiter', '/consultant', '/parent', '/finance', '/services'].some(p => pathname.startsWith(p));
  if (user === null && !isStaffPortal) {
    return null;
  }

  const nav = getNav(user?.role || 'student', pathname);
  const toggleGroup = (label: string) => setOpenGroups(prev => ({ ...prev, [label]: !prev[label] }));

  function NavLink({ href, icon, label, badge, indent = false }: NavLeaf & { indent?: boolean }) {
    const active = isPathActive(pathname, href);
    const isTourSpotlight = activeTourRoute && (href === activeTourRoute || (activeTourRoute !== '/dashboard' && href.startsWith(activeTourRoute)));
    return (
      <Link
        href={href}
        title={collapsed ? label : undefined}
        onClick={() => {
          setActiveAcademicTab(null);
        }}
        className={`nav-item${active ? ' active' : ''}${isTourSpotlight ? ' pinit-tour-spotlight' : ''}`}
        style={{
          ...(indent && !collapsed ? { paddingLeft: 32 } : {}),
          ...(isTourSpotlight ? {
            background: 'rgba(var(--brand-rgb), 0.22)',
            border: '1.5px solid var(--accent)',
            boxShadow: '0 0 18px rgba(var(--brand-rgb), 0.6)',
            transform: 'scale(1.02)',
            transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            zIndex: 5,
          } : {})
        }}
      >
        <span className="nav-icon" style={isTourSpotlight ? { transform: 'scale(1.2)', filter: 'drop-shadow(0 0 6px rgba(var(--brand-rgb), 0.8))', transition: 'transform 0.3s' } : undefined}>{icon}</span>
        {!collapsed && <span style={{ flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', fontWeight: isTourSpotlight ? 800 : undefined, color: isTourSpotlight ? '#fff' : undefined }}>{label}</span>}
        {!collapsed && isTourSpotlight && (
          <span style={{ fontSize: 9, fontWeight: 900, background: 'var(--accent)', color: 'var(--text)', padding: '2px 6px', borderRadius: 10, letterSpacing: '0.4px', animation: 'bounce 0.8s infinite alternate' }}>
            👈 HERE
          </span>
        )}
        {!collapsed && badge && unread > 0 && !isTourSpotlight && <span className="nav-badge">{unread > 9 ? '9+' : unread}</span>}
        {collapsed && badge && unread > 0 && (
          <span style={{ position:'absolute', top:5, right:5, width:7, height:7, borderRadius:'50%', background:'var(--coral)', border:'2px solid var(--bg2)' }} />
        )}
      </Link>
    );
  }

  function NavGroupHeader({ group }: { group: NavGroup }) {
    const open = !!openGroups[group.label];
    const hasActiveChild = group.children.some(c => isPathActive(pathname, c.href));

    if (collapsed) {
      return (
        <>
          {group.children.map(c => <NavLink key={c.href} {...c} />)}
        </>
      );
    }

    return (
      <>
        <button
          type="button"
          onClick={() => toggleGroup(group.label)}
          className={`nav-item${hasActiveChild ? ' active' : ''}`}
          style={{ width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}
        >
          <span className="nav-icon">{group.icon}</span>
          <span style={{ flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{group.label}</span>
          <span style={{ fontSize: 10, color: 'var(--t4)', transition: 'transform 0.2s', transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }}>▸</span>
        </button>
        {open && group.children.map(c => <NavLink key={c.href} {...c} indent />)}
      </>
    );
  }

  return (
    <div className="app-shell">
      <Suspense fallback={null}>
        <SearchParamsHandler onTabChange={handleTabChange} />
      </Suspense>
      {mobileOpen && (
        <div onClick={() => setMobileOpen(false)} style={{
          position:'fixed', inset:0, background:'rgba(0,0,0,0.45)',
          zIndex:199, backdropFilter:'blur(3px)',
        }} />
      )}

      {/* ── Sidebar (Distraction-Free Focus mode transition) ── */}
      <aside 
        className={`sidebar${collapsed || effectiveFocusMode || (pathname.startsWith('/admin/teacher') || pathname.startsWith('/teacher')) ? ' collapsed' : ''}${mobileOpen ? ' open' : ''}`}
        style={{
          display: (effectiveFocusMode || pathname.startsWith('/admin/teacher') || pathname.startsWith('/teacher')) ? 'none' : 'flex',
          width: effectiveFocusMode || (pathname.startsWith('/admin/teacher') || pathname.startsWith('/teacher')) ? 0 : (collapsed ? '68px' : 'var(--sidebar-w)'),
          borderRight: effectiveFocusMode || (pathname.startsWith('/admin/teacher') || pathname.startsWith('/teacher')) ? 'none' : '1px solid var(--border)',
          transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1), border 0.25s',
          overflow: 'hidden'
        }}
      >
        {/* Logo */}
        <div className="sidebar-logo">
          <Link
            href="/dashboard"
            onClick={() => setActiveAcademicTab(null)}
            style={{ textDecoration:'none', display:'flex', alignItems:'center', gap:10 }}
          >
            {collapsed || effectiveFocusMode ? (
              <span className="logo-mark logo-mark-img">
                <img src="/brand/pinit-career-logo.png" alt="PINIT CAREER" />
              </span>
            ) : (
              <span className="lp-brand-lockup" style={{ height: 40, padding: '2px 6px' }}>
                <img src="/brand/pinit-career-logo.png" alt="PINIT CAREER" className="lp-brand-logo" style={{ height: 34, maxWidth: 148 }} />
              </span>
            )}
          </Link>
          {!collapsed && !focusMode && (
            <button onClick={() => toggleLeftSidebar(true)} title="Collapse (⌘[)"
              style={{ marginLeft:'auto', background:'none', border:'none', cursor:'pointer', color:'var(--t4)', fontSize:18, padding:'2px 6px', borderRadius:6, lineHeight:1 }}>
              ‹
            </button>
          )}
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          {nav.map(sec => {
            return (
              <div key={sec.section}>
                {!collapsed && !effectiveFocusMode && <div className="nav-section-label">{sec.section}</div>}
                {sec.items.map(item =>
                  isGroup(item)
                    ? <NavGroupHeader key={item.label} group={item} />
                    : <NavLink key={item.href} {...item} />
                )}
              </div>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          {BOTTOM_NAV.map(it => <NavLink key={it.href} {...it} />)}

          {collapsed && !effectiveFocusMode && (
            <button onClick={() => setCollapsed(false)} className="nav-item" style={{ justifyContent:'center', marginTop:6 }} title="Expand (⌘[)">
              <span className="nav-icon">›</span>
            </button>
          )}

          {!collapsed && !effectiveFocusMode && isStudent && (
            <Link href="/pricing" style={{ textDecoration: 'none', display: 'block', marginTop: 4 }}>
              <div style={{
                padding: '7px 10px', borderRadius: 9,
                background: pins < 20 ? 'rgba(220,38,38,0.08)' : 'rgba(79,70,229,0.06)',
                border: `1px solid ${pins < 20 ? 'rgba(220,38,38,0.2)' : 'rgba(79,70,229,0.15)'}`,
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <span style={{ fontSize: 14 }}>⚡</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 800, color: pins < 20 ? 'var(--coral)' : 'var(--accent)', lineHeight: 1 }}>{pins.toLocaleString()} pins</div>
                  <div style={{ fontSize: 9, color: 'var(--t4)', marginTop: 1 }}>{pins < 20 ? '⚠ Low — tap to buy' : 'Click to buy more'}</div>
                </div>
                <span style={{ fontSize: 10, color: 'var(--accent)', fontWeight: 700 }}>+</span>
              </div>
            </Link>
          )}



          {!collapsed && !effectiveFocusMode && (
            <div style={{
              display:'flex', alignItems:'center', gap:9, padding:'9px 10px', marginTop:6,
              borderRadius:9, border:'1px solid var(--border)', background:'var(--bg3)',
            }}>
              <div style={{
                width:30, height:30, borderRadius:'50%', flexShrink:0,
                background:'linear-gradient(135deg,var(--accent),var(--purple))',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:12, fontWeight:800, color: 'var(--text)',
              }}>
                {user?.displayName?.[0]?.toUpperCase() || 'U'}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:12, fontWeight:600, color:'var(--t1)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                  {user?.displayName || 'Faculty / Visitor'}
                </div>
                <div style={{ fontSize:10, color:'var(--t3)', fontFamily:'var(--font-mono)', textTransform:'capitalize' }}>
                  {user?.role || 'Guest'}
                </div>
              </div>
              <button onClick={() => logout().then(() => router.push('/'))}
                title="Logout"
                style={{ background:'none', border:'none', cursor:'pointer', color:'var(--t4)', fontSize:14, padding:4, borderRadius:6, flexShrink:0 }}>
                ⏻
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="main-area">
        {/* Topbar */}
        <header className="topbar" style={{ display: (isLessonOrDetail || isGroupDiscussionCall || isRoleplayActive) ? 'none' : 'flex' }}>
          {/* Mobile burger */}
          <button onClick={() => setMobileOpen(o => !o)}
            className="mobile-menu-btn"
            style={{ background:'none', border:'none', cursor:'pointer', color:'var(--t2)', fontSize:18, padding:4, borderRadius:6, display:'none' }}>
            ☰
          </button>

          {/* If focusMode is active, allow returning with a floating action bar brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {effectiveFocusMode && (
              <div 
                onClick={toggleFocusMode}
                title="Exit Focus Mode"
                style={{ 
                  width: 24, height: 24, borderRadius: 6, 
                  background: 'linear-gradient(135deg, var(--accent) 0%, var(--purple) 100%)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', 
                  fontSize: 10, fontWeight: 800, color: 'white', cursor: 'pointer',
                  fontFamily: 'var(--font-display)', marginRight: 6
                }}
              >
                Pi
              </div>
            )}
            <div className="topbar-title">{pageTitle}</div>
          </div>
          
          <div className="topbar-spacer" />

          {/* Score pills — connected to live CareerOSContext (simpler view in Focus mode) */}
          {isStudent && !effectiveFocusMode && (
            <div className="topbar-scores">
              {[
                { icon:'Career', val:careerScore, color:'var(--teal)' },
                { icon:'DNA', val:dnaScore,    color:'var(--purple)' },
                { icon:'🛡',  val:trustScore,  color:'var(--green)'  },
              ].map(p => (
                <div key={p.icon} className="ts-pill">
                  <span className="ts-dot" style={{ background:p.color }} />
                  {p.icon} <span style={{ color:p.color }}>{Math.round(p.val)}</span>
                </div>
              ))}
              
              {/* Vault Quick-link Icon */}
              <Link href="/vault" title="Vault Secure Area" className="ts-pill" style={{
                textDecoration:'none', borderColor:'var(--accent)'
              }}>
                Vault
              </Link>

              {missionOnlyStreak > 0 && (
                <div className="ts-pill" style={{
                  background:'var(--amber-light)', borderColor:'var(--amber-light)', color:'var(--amber)',
                }}>
                  {missionOnlyStreak}d
                </div>
              )}

              {/* Pin Balance */}
              <PinsBadge size="sm" showLink />
            </div>
          )}

          {/* Theme Switcher & Focus Mode Toggles Control Group */}
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginLeft: 8 }}>
            {/* Lite UI Mode Toggle Button */}
            {isStudent && (
              <button 
                onClick={() => setLiteUiMode(prev => {
                  const next = !prev;
                  if (typeof window !== 'undefined') {
                    localStorage.setItem(`pinit_${user?.id || 'guest'}_lite_ui_mode`, JSON.stringify(next));
                  }
                  toast.info(next ? 'Lite Mode Active 💬' : 'Cockpit Mode Active 🖥️', next ? 'Guided conversational UI loaded.' : 'Standard telemetry graphs restored.');
                  return next;
                })} 
                title={liteUiMode ? 'Switch to Cockpit Dashboard' : 'Switch to Conversational Lite UI'}
                className="topbar-icon-btn"
                style={{
                  background: liteUiMode ? 'var(--teal-light)' : 'var(--bg3)',
                  borderColor: liteUiMode ? 'var(--teal)' : 'var(--border)',
                }}
              >
                {liteUiMode ? '💬' : '🖥️'}
              </button>
            )}

            {/* Theme Toggle Button */}
            <button 
              onClick={toggleTheme} 
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'} 
              className="topbar-icon-btn"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>

            {/* ⚙️ Universal Preferences & Ambience Hub */}
            <GearAudioHub theme={theme} size="sm" />

            {/* Focus Mode Toggle Button (Invisible Mode) - Only for students */}
            {isStudent && (
              <button 
                onClick={toggleFocusMode} 
                title={effectiveFocusMode ? 'Deactivate Focus Mode' : 'Activate Focus Mode'}
                style={{
                  background: effectiveFocusMode ? 'rgba(220,38,38,0.1)' : 'var(--bg3)', 
                  border: effectiveFocusMode ? '1px solid rgba(220,38,38,0.3)' : '1px solid var(--border)', 
                  borderRadius: 20, padding: '3px 12px', display: 'flex', 
                  alignItems: 'center', gap: 4, cursor: 'pointer',
                  fontSize: 10.5, fontWeight: 700, fontFamily: 'var(--font-mono)',
                  color: effectiveFocusMode ? 'var(--coral)' : 'var(--t2)', outline: 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>🤫</span> {!effectiveFocusMode && <span style={{ fontSize: 10 }}>Focus</span>}
              </button>
            )}
          </div>

          {/* WS dot */}
          <div title={wsConnected ? 'Live data' : 'Connecting...'} style={{ display:'flex', alignItems:'center', gap:4 }}>
            <span style={{
              width:6, height:6, borderRadius:'50%',
              background: 'var(--green)',
              display:'inline-block',
              boxShadow: '0 0 0 2px rgba(var(--success-deep-rgb), 0.25)',
              transition:'all 0.3s',
            }} />
          </div>

          {/* Bell */}
          <Link href="/notifications" style={{ position:'relative', color:'var(--t2)', textDecoration:'none', padding:6, borderRadius:8, display:'flex', alignItems:'center' }}>
            🔔
            {unread > 0 && (
              <span style={{
                position:'absolute', top:2, right:2,
                minWidth:14, height:14, borderRadius:7,
                background:'var(--coral)', color:'white',
                fontSize:9, fontWeight:700, fontFamily:'var(--font-mono)',
                display:'flex', alignItems:'center', justifyContent:'center',
                border:'2px solid var(--bg2)', padding:'0 3px',
              }}>
                {unread > 9 ? '9+' : unread}
              </span>
            )}
          </Link>
        </header>

        {/* Content */}
        <main 
          className="page-content animate-fade-in"
          style={{
            padding: (isGroupDiscussionCall || isRoleplayActive) ? '20px' : (isLessonOrDetail ? '0px' : (effectiveFocusMode ? '40px 60px' : '20px 24px')),
            maxWidth: (isGroupDiscussionCall || isRoleplayActive) ? '95%' : (isLessonOrDetail ? '100%' : (effectiveFocusMode ? 960 : '100%')),
            margin: (isLessonOrDetail || isGroupDiscussionCall || isRoleplayActive) ? '0 auto' : (effectiveFocusMode ? '0 auto' : '0'),
            width: '100%',
            transition: 'padding 0.25s, max-width 0.25s'
          }}
        >
          {isStudent && activeAcademicTab && pathname !== '/profile' ? (
            examScreen === 'exam' ? (
              <ToastProvider>
                <ExamEngine
                  exam={pendingExam}
                  student={{
                    name: user?.displayName || user?.username || 'Student',
                    registerNumber: user?.registerNumber || user?.uid || user?.id || '',
                    batch: (user as any)?.batch || 'General Batch',
                  }}
                  onFinish={handleExamFinished}
                />
              </ToastProvider>
            ) : (
              <>
                <DsaiAcademicTabWrapper tab={activeAcademicTab} student={user} onStartExam={handleStartExamRequest} examCheckLoading={examCheckLoading} />
                {pendingExam && examScreen === 'exam-start' && (
                  <ToastProvider>
                    <ExamStartModal
                      exam={pendingExam}
                      student={{
                        name: user?.displayName || user?.username || 'Student',
                        registerNumber: user?.registerNumber || user?.uid || user?.id || '',
                        batch: (user as any)?.batch || 'General Batch',
                      }}
                      onConfirm={() => setExamScreen('exam')}
                      onCancel={() => { setPendingExam(null); setExamScreen('dashboard'); }}
                    />
                  </ToastProvider>
                )}
              </>
            )
          ) : liteUiMode && pathname === '/dashboard' && isStudent ? (
            <LiteChatInterface />
          ) : (
            children
          )}
        </main>
      </div>

      {/* Right Sidebar - hidden on all Quest routes so Quest workspace has 100% full screen space */}
      {isStudent && !effectiveFocusMode && !cleanPath.startsWith('/quests') && (
        <aside
          className={`sidebar right-sidebar${rightCollapsed ? ' collapsed' : ''}`}
          style={{
            width: rightCollapsed ? '68px' : '215px',
            background: 'var(--bg-sidebar)',
            borderLeft: '1px solid var(--border)',
            transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1), border 0.25s',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            position: 'sticky',
            top: 0,
            height: '100vh',
            boxShadow: '-2px 0 12px color-mix(in srgb, var(--accent) 8%, transparent)',
            zIndex: 10
          }}
        >
          {/* Header */}
          {!rightCollapsed ? (
            <div style={{ padding: '16px 14px 12px', borderBottom: '1px solid var(--border)' }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--t1)' }}>BGS Academic</div>
              <div style={{ fontSize: 10, color: 'var(--accent)', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase' }}>Portal</div>
            </div>
          ) : (
            <div style={{ padding: '16px 0 12px', borderBottom: '1px solid var(--border)', textAlign: 'center', fontSize: 12, fontWeight: 900, color: 'var(--accent)' }}>
              BGS
            </div>
          )}

          {/* Student Info Card */}
          {!rightCollapsed ? (
            <div style={{ padding: '14px', borderBottom: '1px solid var(--border)', background: 'linear-gradient(135deg, var(--accent-light), var(--bg2))', textAlign: 'center' }}>
              <div style={{ width: 50, height: 50, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), var(--purple))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px', fontSize: 20, color: 'white', border: '2px solid var(--bg-sidebar)', boxShadow: '0 2px 10px color-mix(in srgb, var(--accent) 20%, transparent)', overflow: 'hidden' }}>
                👤
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 2, color: 'var(--t1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.displayName || 'Student'}</div>
              <div style={{ fontSize: 10, color: 'var(--t3)', marginBottom: 6, fontFamily: 'var(--font-mono)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.username || user?.registerNumber || 'Student'}</div>
              {(() => {
                const batchName = (user as any)?.batch || 'General Batch';
                const rawColor = colorMap[batchName] || 'var(--brand)';
                const safeColor = typeof rawColor === 'string' && rawColor.startsWith('#') ? rawColor : 'var(--brand)';
                return (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: `${safeColor}18`, border: `1px solid ${safeColor}33`, borderRadius: 20, padding: '3px 10px' }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: safeColor, display: 'inline-block' }} />
                    <span style={{ fontSize: 11, fontWeight: 700, color: safeColor }}>{batchName}</span>
                  </div>
                );
              })()}
            </div>
          ) : (
            <div style={{ padding: '14px 0', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'center' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), var(--purple))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: 'white', boxShadow: '0 2px 8px color-mix(in srgb, var(--accent) 18%, transparent)' }}>
                👤
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <nav style={{ flex: 1, padding: '8px 7px', display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto' }}>
            {RIGHT_NAV.map(item => {
              const active = item.href ? isPathActive(pathname, item.href) : activeAcademicTab === item.id;
              const isTourSpotlight = activeTourTabKey === 'academic-sidebar';
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.href) {
                      setActiveAcademicTab(null);
                      const url = new URL(window.location.href);
                      if (url.searchParams.has('tab')) {
                        url.searchParams.delete('tab');
                        window.history.pushState({}, '', url.pathname + (url.search ? url.search : ''));
                      }
                      router.push(item.href);
                    } else {
                      setActiveAcademicTab(item.id);
                      const url = new URL(window.location.href);
                      url.searchParams.set('tab', item.id);
                      window.history.pushState({}, '', url.toString());
                    }
                    setRightCollapsed(false);
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: rightCollapsed ? 'center' : 'flex-start',
                    gap: rightCollapsed ? 0 : 9,
                    padding: '9px 10px',
                    background: isTourSpotlight ? 'rgba(var(--brand-rgb), 0.18)' : (active ? 'rgba(37,99,235,0.08)' : 'transparent'),
                    border: isTourSpotlight ? '1.5px solid var(--accent)' : '1px solid transparent',
                    borderColor: isTourSpotlight ? 'var(--accent)' : (active ? 'rgba(37,99,235,0.15)' : 'transparent'),
                    borderRadius: 9,
                    cursor: 'pointer',
                    color: isTourSpotlight ? '#fff' : (active ? '#1d4ed8' : 'var(--t2)'),
                    fontWeight: (active || isTourSpotlight) ? 700 : 500,
                    fontSize: 13,
                    transition: 'all 0.15s',
                    outline: 'none',
                    textAlign: 'left',
                    flexShrink: 0,
                    boxShadow: isTourSpotlight ? '0 0 16px rgba(var(--brand-rgb), 0.5)' : undefined,
                  }}
                  title={item.label}
                >
                  <span style={{ fontSize: 16, flexShrink: 0, transform: isTourSpotlight ? 'scale(1.15)' : undefined }}>{item.icon}</span>
                  {!rightCollapsed && <span>{item.label}</span>}
                </button>
              );
            })}
          </nav>

          {/* Sidebar Collapse Toggle Button */}
          <div style={{ padding: '8px 7px', borderTop: '1px solid var(--border)' }}>
            <button
              onClick={() => toggleRightSidebar()}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '9px 10px',
                background: 'var(--bg3)',
                border: '1px solid var(--border)',
                borderRadius: 9,
                cursor: 'pointer',
                color: 'var(--t3)',
                fontSize: 14,
                outline: 'none'
              }}
            >
              {rightCollapsed ? '‹' : '›'}
            </button>
          </div>
        </aside>
      )}

      {isStudent && (
        <GlobalAvatar
          user={user}
          profile={profile}
          refreshProfile={refreshProfile}
          onOpenRightSidebar={() => toggleRightSidebar(false)}
          onExpandLeftNav={() => toggleLeftSidebar(false)}
          isRightSidebarOpen={!rightCollapsed}
          isLeftSidebarOpen={!collapsed}
          onTourSlideChange={(route, tabKey) => {
            setActiveTourRoute(route);
            setActiveTourTabKey(tabKey);
          }}
        />
      )}

      {/* Global Study Notebook Drawer for Active Quests / Lessons */}
      {isLessonOrDetail && (
        <>
          {/* Floating Study Notes Toggle Button */}
          <button
            onClick={() => setNotesOpen(!notesOpen)}
            style={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              zIndex: 99999, // Render at top-level z-index
              background: 'linear-gradient(135deg, var(--accent) 0%, var(--purple) 100%)',
              color: 'var(--text)',
              width: 48,
              height: 48,
              borderRadius: '50%',
              border: 'none',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.2)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
              transition: 'transform 0.2s',
              outline: 'none'
            }}
            title="Open Study Notes Drawer"
          >
            {notesOpen ? '✖' : '📓'}
          </button>

          {/* Slide-out Study Notes Drawer */}
          <div style={{
            position: 'fixed',
            top: 0,
            right: notesOpen ? 0 : -340,
            width: 320,
            height: '100vh',
            background: 'color-mix(in srgb, var(--bg) 95%, transparent)',
            backdropFilter: 'blur(10px)',
            borderLeft: '1px solid var(--border)',
            boxShadow: '-4px 0 20px rgba(0,0,0,0.5)',
            zIndex: 99998,
            transition: 'right 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            padding: '24px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            boxSizing: 'border-box'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: 13, fontWeight: 900, color: 'var(--t1)', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: 6, margin: 0 }}>
                <span>📓</span> Study Notebook
              </h3>
              <button
                onClick={() => setNotesOpen(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--t3)', fontSize: 13, cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>
            
            <p style={{ fontSize: 10, color: 'var(--t3)', lineHeight: 1.4, margin: 0 }}>
              Take notes during this quest. They are saved to local storage and carry over between lecture slides and coding assignments automatically!
            </p>

            {pathname === '/quests/lesson' && (
              <button
                onClick={handleSnapshotCode}
                style={{
                  background: 'var(--bg3)',
                  border: '1px solid var(--border)',
                  color: 'var(--t2)',
                  padding: '8px 12px',
                  borderRadius: 8,
                  fontSize: 10.5,
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                  outline: 'none'
                }}
              >
                📷 Snapshot Slide Code
              </button>
            )}

            <textarea
              value={notesContent}
              onChange={e => handleNotesChange(e.target.value)}
              placeholder="Start typing your study notes here..."
              style={{
                flex: 1,
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid var(--border)',
                borderRadius: 12,
                padding: 12,
                color: 'var(--t1)',
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                lineHeight: 1.5,
                resize: 'none',
                outline: 'none'
              }}
            />
          </div>
        </>
      )}

    </div>
  );
}
