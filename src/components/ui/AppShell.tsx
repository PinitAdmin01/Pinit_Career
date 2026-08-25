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

// HelpBot removed - consolidated into GlobalAvatar AI Mentor

const TEACHER_CONFIG: Record<string, { name: string; color: string; emoji: string }> = {
  priya:  { name: 'Ms. Priya',  color: '#4f46e5', emoji: '👩‍💼' },
  anish:  { name: 'Mr. Anish',  color: '#0891b2', emoji: '👨‍💼' },
};

import VoiceRegistrationModal from '@/components/avatar/VoiceRegistrationModal';
import { completeStoryTour, isStoryTourPending } from '@/lib/storyTour';

// ── Story tour: Segment 1 left nav (2-line each) → Segment 2 right sidebar ──
const TOUR_SLIDES = [
  {
    emoji: '🏠',
    title: 'Dashboard',
    segment: 1,
    text: "This is your Home Dashboard — already open. It shows Career Score, XP tier, streaks, and mentor recommendations.\nUse it to track progress and jump into the next skill module.",
  },
  {
    emoji: '🗺',
    title: 'Quests',
    segment: 1,
    text: "This is Quests — sequenced theory lessons plus hands-on challenges.\nComplete them to earn Pins and raise your verified skill score.",
  },
  {
    emoji: '⚡',
    title: 'Missions',
    segment: 1,
    text: "This is Daily Missions — five fresh micro-challenges each day from your skill gaps.\nSolve them to keep your streak and earn bonus XP.",
  },
  {
    emoji: '🚀',
    title: 'Projects',
    segment: 1,
    text: "This is Projects — real production-style tasks recruiters can inspect.\nShip work here to build verified proof on your portfolio.",
  },
  {
    emoji: '🎙',
    title: 'AI Interview',
    segment: 1,
    text: "This is AI Interview — live 1-on-1 mock interviews with instant feedback.\nPractice algorithms, problem solving, and STAR answers here.",
  },
  {
    emoji: '💬',
    title: 'GD Practice',
    segment: 1,
    text: "This is GD Practice — boardroom debates against AI avatars.\nTrain communication, argument structure, and speaking confidence.",
  },
  {
    emoji: '📖',
    title: 'Learning & Twin',
    segment: 1,
    text: "This is Learning & Twin — compare your skills to the target role.\nGenerate a roadmap that closes the exact gaps we found.",
  },
  {
    emoji: '🧠',
    title: 'Attention Span',
    segment: 1,
    text: "This is Attention Span — focus games that build coding stamina.\nTrain reaction speed and endurance for long work sessions.",
  },
  {
    emoji: '📚',
    title: 'Right Sidebar',
    segment: 2,
    text: "This is the right sidebar, which is used for academic purposes.\nOpen it for exams, results, study notes, notifications, and campus services.",
  },
];

const TOUR_STEP_ROUTES: Record<number, string> = {
  0: '/dashboard',
  1: '/quests',
  2: '/missions',
  3: '/projects',
  4: '/interview',
  5: '/group-discussion',
  6: '/learning',
  7: '/attention-span',
  8: '/attention-span',
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
}: {
  user: any;
  profile: any;
  refreshProfile?: () => void;
  onOpenRightSidebar?: () => void;
  onExpandLeftNav?: () => void;
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
  const unrecognizedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
                            transcript.includes(`hey ${mentorName}`) || 
                            transcript.includes(mentorName);

        if (hasWakeWord) {
          // Speech recognition already matched the wake phrase. This path has no live
          // acoustic frames — verifyVoiceSignature([]) always returns verified:false after
          // registration. Skip biometric fail when frames are unavailable.
          setUnrecognizedBadge(false);
          setMinimized(false);
          resetIdleTimer();
          stopSpeaking();
          speakWithAvatar(`Yes! I am here. How can I help you?`, teacherId, () => {}, () => {});
        }
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

  // ── Compulsory 3-segment story tour after first onboarding (strictly once) ──
  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return;
    if (tourActive || showVoiceRegModal) return;
    if (!user?.id) return;

    if (!isStoryTourPending(user.id)) return;

    if (cleanPath !== '/dashboard') {
      return;
    }

    // Burn token immediately to prevent any double-trigger race conditions
    completeStoryTour(user.id);

    const t = window.setTimeout(() => {
      onExpandLeftNav?.();
      setStoryLocked(true);
      setTourActive(true);
      setTourStep(0);
      setMinimized(false);
    }, 600);
    return () => window.clearTimeout(t);
  }, [mounted, user?.id, cleanPath, tourActive, showVoiceRegModal, onExpandLeftNav]);

  // ── Segment 2: Open Right Sidebar Drawer when reaching step 8 ─────────────
  useEffect(() => {
    if (tourActive && tourStep === 8) {
      onOpenRightSidebar?.();
    }
  }, [tourActive, tourStep, onOpenRightSidebar]);

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
  }, [refreshProfile]);

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
    const speechText = slide.text.replace(/\*\*/g, '').replace(/🎉|🏠|🛠️|🗺|⚡|🎙|🧬|🔬|🎯|💬|🚀|👋|🌅|✨|💙/g, '');
    
    stopSpeaking();

    // Fallback auto-advance: if audio is blocked or ends without callback, advance after 10s
    const fallbackTimer = setTimeout(() => {
      if (tourActiveRef.current && lastSpokenTourStepRef.current === tourStep) {
        if (tourStep >= TOUR_SLIDES.length - 1) {
          openVoiceSegment();
        } else {
          lastSpokenTourStepRef.current = null;
          setTourStep(prev => prev + 1);
        }
      }
    }, 10000);

    speakWithAvatar(
      speechText,
      teacherId,
      () => {}, // onStart
      () => {
        clearTimeout(fallbackTimer);
        // When avatar finishes speaking about this tab, auto-advance to next tab after a 1.2s pause!
        setTimeout(() => {
          if (tourActiveRef.current) {
            if (tourStep >= TOUR_SLIDES.length - 1) {
              openVoiceSegment();
            } else {
              lastSpokenTourStepRef.current = null;
              setTourStep(prev => prev + 1);
            }
          }
        }, 1200);
      }
    );

    return () => clearTimeout(fallbackTimer);
  }, [tourActive, tourStep, teacherId, router]);

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
      const speechText = slide.text.replace(/\*\*/g, '').replace(/🎉|🏠|🛠️|🗺|⚡|🎙|🧬|🔬|🎯|💬|🚀|👋|🌅|✨|💙/g, '');
      stopSpeaking();
      speakWithAvatar(speechText, teacherId, () => {}, () => {});
    }
  };

  const startStoryMode = () => {
    setCelebEvent(null);
    stopSpeaking();
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
        '/dashboard': "🏠 **Home Dashboard** — Your command center! Here you can see your Career Score (combines DNA, Trust, and Quest metrics), active mission streak, XP tier progression, and AI-personalised next-step recommendations. Keep your streak alive by completing daily missions!",
        '/quests': "🗺 **Quests** — Your socratic learning path! Each quest is a guided coding challenge or theory lesson. Complete quests in order to unlock the next module. Spend Pins to access premium quests. Your progress here directly boosts your Career Score!",
        '/career-twin': "🧬 **Career Twin** — Take the onboarding assessment to map your Current Self against your Future Self (target role). I'll calculate an alignment percentage and identify exactly which skills, certifications, and experiences you need to bridge the gap!",
        '/missions': "⚡ **Daily Missions** — Every day, 5 personalised micro-challenges are generated based on your skill gaps and career trajectory. Complete them to maintain your streak, earn XP and Trust points, and use the Custom Skill Trainer to request missions on any topic you want to master!",
        '/career-dna': "🔬 **Career DNA** — A deep diagnostic of your professional genome. View skill radar charts, competency breakdowns, learning velocity metrics, and personalised growth recommendations derived from all your Career OS activity!",
        '/opportunities': "🎯 **Opportunities** — AI-matched job listings ranked by how closely your actual verified skills match each role's requirements. Higher Career Scores and Trust metrics push you higher in recruiter search results!",
        '/notifications': "🔔 **Notifications** — System alerts for quest completions, streak milestones, recruiter views, and new mission assignments. Check here to stay updated on your career progress!",
        '/pricing': "⚡ **Pins & Plans** — Pins are your in-app currency earned through daily logins, quest completions, and mission streaks. Spend Pins to unlock premium AI features like advanced quests!",
        '/profile': "👤 **Profile** — Manage your account settings, select your AI mentor personality (Priya, Aisha, Rohan, or Vikram), configure notification preferences, and view your cumulative career statistics!",
        '/vault': "🗂️ **Vault** — Your secure document storage. Upload certifications, project evidence, and course badges. These feed into your Trust Score calculation to verify your profile!",
      };

      const matchedGuide = Object.entries(TAB_GUIDES).find(([path]) => pathname.startsWith(path));
      if (matchedGuide) {
        dialogueText = matchedGuide[1];
      } else {
        dialogueText = "🧬 Your Career OS is fully operational! Navigate to any tab and I'll explain how it works. Track your trust index, complete daily missions, launch custom skill training, or explore recruiter-matched opportunities. Ask me anything!";
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
        borderRadius: 20,
        background: passed
          ? 'linear-gradient(145deg, rgba(5,150,105,0.97) 0%, rgba(16,185,129,0.97) 100%)'
          : 'linear-gradient(145deg, rgba(79,70,229,0.97) 0%, rgba(124,58,237,0.97) 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px 18px',
        gap: 10,
        zIndex: 10,
        backdropFilter: 'blur(8px)',
        boxShadow: passed
          ? '0 0 30px rgba(5,150,105,0.5), inset 0 1px 1px rgba(255,255,255,0.2)'
          : '0 0 30px rgba(79,70,229,0.5), inset 0 1px 1px rgba(255,255,255,0.2)',
      }}>
        {/* Animated burst */}
        <div style={{ fontSize: 36, animation: 'bounce 0.6s ease infinite alternate', lineHeight: 1 }}>
          {passed ? '🎉' : '💪'}
        </div>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 13,
          fontWeight: 900,
          color: '#fff',
          textAlign: 'center',
          lineHeight: 1.3,
          letterSpacing: '-0.3px',
        }}>
          {msg.headline}
        </div>
        <div style={{
          fontSize: 11,
          color: 'rgba(255,255,255,0.88)',
          textAlign: 'center',
          lineHeight: 1.55,
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
            padding: '3px 14px',
            fontFamily: 'var(--font-mono)',
            fontSize: 14,
            fontWeight: 800,
            color: '#fff',
          }}>
            {celebEvent.score}% score
          </div>
        )}
        <div style={{
          fontSize: 10.5,
          color: 'rgba(255,255,255,0.75)',
          textAlign: 'center',
          lineHeight: 1.45,
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
            marginTop: 4,
            background: 'rgba(255,255,255,0.22)',
            border: '1px solid rgba(255,255,255,0.4)',
            borderRadius: 20,
            color: '#fff',
            fontSize: 10.5,
            fontWeight: 700,
            padding: '5px 16px',
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

  // ── Tour Overlay ──────────────────────────────────────────────────────────
  const TourOverlay = () => {
    if (!tourActive) return null;
    const slide = TOUR_SLIDES[tourStep];
    const isLast = tourStep === TOUR_SLIDES.length - 1;
    return (
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        borderRadius: 20,
        background: 'linear-gradient(145deg, rgba(15,23,42,0.97) 0%, rgba(30,27,75,0.97) 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px 18px',
        gap: 10,
        zIndex: 10,
        backdropFilter: 'blur(8px)',
      }}>
        {/* slide emoji */}
        <div style={{ fontSize: 32, lineHeight: 1, filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.4))' }}>
          {slide.emoji}
        </div>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 9,
          fontWeight: 800,
          letterSpacing: '0.6px',
          color: '#a5b4fc',
          background: 'rgba(79,70,229,0.2)',
          border: '1px solid rgba(129,140,248,0.35)',
          borderRadius: 20,
          padding: '3px 10px',
        }}>
          {tourStep >= 8 ? 'SEGMENT 2/3 · ACADEMIC SIDEBAR' : 'SEGMENT 1/3 · LEFT SIDEBAR'}
        </div>
        {/* slide counter */}
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 9,
          fontWeight: 700,
          color: '#94a3b8',
          letterSpacing: '1px',
          textTransform: 'uppercase',
        }}>
          STORY MODE · STEP {tourStep + 1} / {TOUR_SLIDES.length}
        </div>
        {/* progress bar */}
        <div style={{ width: '100%', height: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 2 }}>
          <div style={{
            height: '100%',
            width: `${((tourStep + 1) / TOUR_SLIDES.length) * 100}%`,
            background: 'linear-gradient(90deg, var(--accent), var(--teal))',
            borderRadius: 2,
            transition: 'width 0.35s ease',
          }} />
        </div>
        {/* title */}
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 13,
          fontWeight: 900,
          color: '#f8fafc',
          textAlign: 'center',
          letterSpacing: '-0.3px',
        }}>
          {slide.title}
        </div>
        {/* body */}
        <div style={{
          fontSize: 11.5,
          color: '#e2e8f0',
          textAlign: 'center',
          lineHeight: 1.65,
          fontFamily: 'var(--font-sans)',
          whiteSpace: 'pre-line',
        }}>
          {slide.text}
        </div>
        {/* controls toolbar */}
        <div style={{ display: 'flex', gap: 6, marginTop: 4, width: '100%', alignItems: 'center' }}>
          {tourStep > 0 && (
            <button
              onClick={prevTourSlide}
              title="Previous Tab"
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: 8,
                color: '#fff',
                fontSize: 10,
                fontWeight: 700,
                padding: '6px 10px',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
              }}
            >
              ← Prev
            </button>
          )}

          <button
            onClick={replayCurrentSlide}
            title="Replay Voice Speech"
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 8,
              color: '#fff',
              fontSize: 10,
              fontWeight: 700,
              padding: '6px 10px',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
            }}
          >
            🔊 Voice
          </button>

          <button
            onClick={nextTourSlide}
            style={{
              flex: 1,
              background: 'linear-gradient(90deg, var(--accent) 0%, var(--purple) 100%)',
              border: 'none',
              borderRadius: 8,
              color: '#fff',
              fontSize: 11,
              fontWeight: 800,
              padding: '6px 0',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
              boxShadow: '0 2px 12px rgba(79,70,229,0.4)',
              transition: 'opacity 0.2s',
            }}
          >
            {isLast ? 'Voice setup →' : 'Next →'}
          </button>

          <button
            onClick={dismissTour}
            title="Exit Tour"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 8,
              color: 'var(--t3)',
              fontSize: 10,
              fontWeight: 600,
              padding: '6px 8px',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
            }}
          >
            ✖
          </button>
        </div>
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
        <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {unrecognizedBadge && (
            <div style={{
              marginBottom: 6,
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              color: '#ffffff',
              fontSize: 10,
              fontWeight: 800,
              padding: '4px 10px',
              borderRadius: 20,
              boxShadow: '0 4px 15px rgba(239, 68, 68, 0.6)',
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
              boxShadow: unrecognizedBadge ? '0 -4px 25px rgba(239, 68, 68, 0.9)' : `0 -4px 20px ${teacher.color}60`,
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
            if (!isEnlarged && !isCentered) {
              e.currentTarget.style.opacity = '1';
            }
          }}
          onMouseLeave={(e) => {
            if (!isEnlarged && !isCentered) {
              e.currentTarget.style.opacity = '0.92';
            }
          }}
          style={isEnlarged ? {
            position: 'fixed',
            bottom: '24px',
            right: '24px',
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
            right: '24px',
            left: 'auto',
            transform: 'none',
            width: '150px',
            height: '195px',
            maxWidth: '18vw',
            maxHeight: '28vh',
            zIndex: 100,
            borderRadius: 18,
            overflow: 'visible',
            boxShadow: '0 12px 32px rgba(0,0,0,0.45), 0 0 20px rgba(99,102,241,0.25)',
            border: '1.5px solid rgba(255,255,255,0.18)',
            background: 'linear-gradient(180deg, rgba(30,27,75,0.92) 0%, rgba(15,23,42,0.98) 100%)',
            backdropFilter: 'blur(16px)',
            transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease',
            display: minimized ? 'none' : 'block',
          }}
        >
          {/* Optional Speech Bubble above Avatar */}
          {showSpeechBubble && dialogueText && !tourActive && !celebEvent && (
            <div style={{
              position: 'absolute',
              bottom: '102%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '260px',
              maxWidth: '85vw',
              background: 'rgba(15,23,42,0.95)',
              border: '1px solid rgba(129,140,248,0.4)',
              borderRadius: 14,
              padding: '10px 14px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
              backdropFilter: 'blur(12px)',
              zIndex: 110,
              fontSize: 11.5,
              lineHeight: 1.5,
              color: '#e2e8f0',
              fontFamily: 'var(--font-sans)',
              animation: 'fadeIn 0.25s ease-out'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontSize: 10, fontWeight: 800, color: '#a5b4fc', fontFamily: 'var(--font-mono)' }}>
                  {teacher.name.toUpperCase()} · MENTOR GUIDANCE
                </span>
                <button
                  onClick={() => setShowSpeechBubble(false)}
                  style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: 11, padding: 0 }}
                  title="Dismiss message"
                >
                  ✕
                </button>
              </div>
              <div style={{ fontSize: 11, color: '#f1f5f9' }}>
                {dialogueText.replace(/\*\*/g, '')}
              </div>
              {/* Pointer triangle */}
              <div style={{
                position: 'absolute',
                top: '100%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: 0,
                height: 0,
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent',
                borderTop: '6px solid rgba(15,23,42,0.95)'
              }} />
            </div>
          )}

          {/* Relative wrapper so overlays can be positioned inside */}
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
              background: 'rgba(15,23,42,0.75)',
              backdropFilter: 'blur(10px)',
              padding: '5px 12px',
              borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.12)',
              boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 13 }}>{teacher.emoji}</span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 11, fontWeight: 800, color: '#fff' }}>{teacher.name}</span>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px #22c55e' }} title="Online & Listening" />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <button
                  onClick={() => setMinimized(true)}
                  title="Dock Floating Avatar"
                  style={{
                    background: 'rgba(255,255,255,0.12)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: 6,
                    color: '#fff',
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
                <div style={{ width: '100%', height: '100%', background: 'var(--card)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--t3)' }}>
                  Loading mentor...
                </div>
              }>
                <AvatarMentorWidget
                  userId={user?.id}
                  careerProfile={profile || undefined}
                  teacherId={teacherId}
                  minimized={minimized}
                  setMinimized={setMinimized}
                  showSpeechBubble={tourActive || !!celebEvent ? false : showSpeechBubble}
                  setShowSpeechBubble={setShowSpeechBubble}
                  onboardingStep={onboardingStep}
                  setOnboardingStep={setOnboardingStep}
                  onTabShift={(path) => router.push(path)}
                  onEnlarge={(val) => setIsEnlarged(val)}
                  onlyAvatar={true}
                />
              </Suspense>
            </div>

            {/* Tour Overlay — rendered on top of the 3D widget */}
            <TourOverlay />

            {/* Congratulations Overlay */}
            <CongratCard />
          </div>
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
    { href: '/quests', icon: '🗺', label: 'Quests' },
    { href: '/missions', icon: '⚡', label: 'Missions' },
    { href: '/arena', icon: '⚔️', label: 'Challenging Arena' },
    { href: '/projects', icon: '🚀', label: 'Projects' },
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
    { href: '/projects', icon: '💼', label: 'Industry Projects' },
    { href: '/passport', icon: '🎫', label: 'Skill Passport' }
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
  '/notifications': 'Notifications', '/leaderboard':   'Leaderboard',
  '/applications':  'My Applications',
  '/quests':        'Career Quests',
  '/attention-span': 'Attention Span',
  '/qr-confirm':    'Confirm QR Login',
  '/onboarding':    'Setup',         '/qr-login':      'QR Login',
  '/reset-password':'Reset Password',
};

const PUBLIC_PATHS = ['/', '/login', '/signup', '/reset-password', '/qr-login', '/qr-confirm', '/onboarding', '/privacy', '/terms', '/contact', '/admissions', '/about', '/pricing', '/services', '/teacher', '/admin', '/recruiter', '/consultant', '/parent', '/finance'];

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

  // ── 1st Rule: If left sidebar is collapsed, right sidebar must expand, and vice versa ──
  const toggleLeftSidebar = useCallback((forceCollapse?: boolean) => {
    setCollapsed(prev => {
      const nextCollapsed = typeof forceCollapse === 'boolean' ? forceCollapse : !prev;
      setRightCollapsed(!nextCollapsed);
      return nextCollapsed;
    });
  }, []);

  const toggleRightSidebar = useCallback((forceCollapse?: boolean) => {
    setRightCollapsed(prev => {
      const nextRightCollapsed = typeof forceCollapse === 'boolean' ? forceCollapse : !prev;
      setCollapsed(!nextRightCollapsed);
      return nextRightCollapsed;
    });
  }, []);

  const [activeAcademicTab, setActiveAcademicTab] = useState<string | null>(null);
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
    const { DB: dsaiDB } = await import('@/lib/dsaiFirebase');
    try {
      const results = await dsaiDB.getAll('exam_results');
      const alreadyDone = results.find(
        (r: any) => r.registerNumber === user.registerNumber && r.examScheduleId === examSchedule.id
      );
      if (alreadyDone) {
        toast.warning('Attempt Blocked', 'You have already attempted this exam.');
        return;
      }
      setPendingExam(examSchedule);
      setExamScreen('exam-start');
    } catch (err: any) {
      toast.error('Error checking exam', err.message);
    } finally {
      setExamCheckLoading(false);
    }
  };

  const handleExamFinished = async (result: any) => {
    setPendingExam(null);
    setExamScreen('dashboard');
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

  const isLandingPage = ['/', '/login', '/signup', '/reset-password', '/qr-login', '/qr-confirm', '/onboarding', '/privacy', '/terms', '/contact', '/admissions', '/about', '/pricing'].some(p => pathname === p || (p !== '/' && pathname.startsWith(p)));
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
    return (
      <Link
        href={href}
        title={collapsed ? label : undefined}
        onClick={() => {
          setActiveAcademicTab(null);
        }}
        className={`nav-item${active ? ' active' : ''}`}
        style={indent && !collapsed ? { paddingLeft: 32 } : undefined}
      >
        <span className="nav-icon">{icon}</span>
        {!collapsed && <span style={{ flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{label}</span>}
        {!collapsed && badge && unread > 0 && <span className="nav-badge">{unread > 9 ? '9+' : unread}</span>}
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
            <button onClick={() => { setCollapsed(false); setRightCollapsed(true); }} className="nav-item" style={{ justifyContent:'center', marginTop:6 }} title="Expand (⌘[)">
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
                fontSize:12, fontWeight:800, color:'#fff',
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
              boxShadow: '0 0 0 2px rgba(5,150,105,0.25)',
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
                const rawColor = colorMap[batchName] || '#6366f1';
                const safeColor = typeof rawColor === 'string' && rawColor.startsWith('#') ? rawColor : '#6366f1';
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
                    background: active ? 'rgba(37,99,235,0.08)' : 'transparent',
                    border: '1px solid transparent',
                    borderColor: active ? 'rgba(37,99,235,0.15)' : 'transparent',
                    borderRadius: 9,
                    cursor: 'pointer',
                    color: active ? '#1d4ed8' : 'var(--t2)',
                    fontWeight: active ? 700 : 500,
                    fontSize: 13,
                    transition: 'all 0.15s',
                    outline: 'none',
                    textAlign: 'left',
                    flexShrink: 0
                  }}
                  title={item.label}
                >
                  <span style={{ fontSize: 16, flexShrink: 0 }}>{item.icon}</span>
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
              color: '#fff',
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
