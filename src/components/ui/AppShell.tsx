'use client';

import { useState, useEffect, useRef, Suspense, useCallback } from 'react';
import { isOnboardingComplete, onboardingSignalsOf, readLocalOnboardingSignals } from '@/lib/onboarding/onboardingStatus';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { useCareerProfile } from '@/hooks/useCareerProfile';
import { useNotifications } from '@/lib/api/hooks';
import { useAppStore, toast } from '@/lib/store/useAppStore';
import { useCareerOS } from '@/lib/context/CareerOSContext';
import LiteChatInterface from '@/components/ui/LiteChatInterface';
import { HomeTab, ExamsTab, ResultsTab, NotesTab, NotificationsTab, ContactTab } from '@/components/dsai/AcademicTabs';
import { ToastProvider } from '@/lib/context/ToastContext';
import { useBatches } from '@/lib/context/BatchContext';
import PublicEffectsShell from '@/components/effects/PublicEffectsShell';
import { AppSidebar, RIGHT_NAV, isPathActive } from '@/components/ui/AppSidebar';
import { AppHeader } from '@/components/ui/AppHeader';
import { GlobalAvatar } from '@/components/ui/GlobalAvatar';

// ── Native Exam Engine & Start Modal ──────────────────────────────────────────
const ExamEngine = dynamic(
  () => import('@/components/exam/PinITExamEngine').then((m: any) => m.ExamEngine || m.PinITExamEngine || m.default),
  { ssr: false, loading: () => <div style={{ padding: 40, color: 'var(--t3)', textAlign: 'center' }}>Loading Exam Engine...</div> }
) as any;

const ExamStartModal = dynamic(
  () => import('@/components/exam/PinITExamEngine').then((m: any) => m.ExamStartModal),
  { ssr: false }
) as any;

const PAGE_TITLES: Record<string, string> = {
  '/dashboard':     'Home',          '/resume':        'Resume & ATS',
  '/career-builder': 'Career Builder',
  '/mirror':        'Mirror',
  '/career-assets': 'Career Assets', '/career-dna':   'Career DNA',    '/trust':         'Trust Score',
  '/career-twin':   'Career Twin',   '/missions':      'Daily Missions',
  '/learn':         'Learn',         '/exam':          'Exams',
  '/learning':      'Learning & Career Twin',
  '/group-discussion': 'GD Practice',
  '/friends':       'My Network',
  '/internships':   'Internships',   '/portfolio':     'Portfolio',
  '/passport':      'Skill Passport', '/code-wars':    'Code Wars',
  '/teams':         'Innovation Hub', '/placement':    'Placement',
  '/interview':     'Interview AI',  '/personality':   'Personality',
  '/vault':         'Vault',         '/opportunities': 'Opportunities',
  '/analytics':     'Analytics',     '/sentinel':      'Sentinel',
  '/recruiter':     'Candidates',    '/admin':         'Admin Panel',
  '/admin/exams':   'Exam Manager',  '/admin/teacher': 'Teacher Panel',
  '/admin/students':'Students',      '/consultant':    'Student CRM',
  '/attendance':    'Attendance',    '/parent':        'Parent Portal',
  '/pricing':       'Pins & Plans',  '/profile':       'Profile',
  '/notifications': 'Notifications', '/leaderboard':   'Leaderboard & Leagues',
  '/applications':  'My Applications',
  '/pins':          'Pins & Wallet',
  '/quests':        'Quests & Courses',
  '/arena':         'Challenging Arena',
  '/projects':      'Project & Innovation Hub',
  '/attention-span': 'Attention Span',
  '/qr-confirm':    'Confirm QR Login',
  '/onboarding':    'Setup',         '/qr-login':      'QR Login',
  '/reset-password':'Reset Password',
};

const PUBLIC_PATHS = ['/', '/login', '/signup', '/reset-password', '/qr-login', '/qr-confirm', '/onboarding', '/privacy', '/terms', '/contact', '/admissions', '/about', '/pricing', '/problem', '/identity', '/how-it-works', '/modules', '/campus-demo', '/university', '/services', '/verify', '/passport', '/quests/lesson'];

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
  const [liteUiMode, setLiteUiMode] = useState(false);
  const [isGdCall, setIsGdCall] = useState(false);
  const [isRoleplayParamActive, setIsRoleplayParamActive] = useState(false);
  const [activeTourRoute, setActiveTourRoute] = useState<string | null>(null);
  const [activeTourTabKey, setActiveTourTabKey] = useState<string | null>(null);

  const [activeAcademicTab, setActiveAcademicTab] = useState<string | null>(null);

  // ── Decoupled sidebars: left and right sidebar states operate independently ──
  const toggleLeftSidebar = useCallback((forceCollapse?: boolean) => {
    setCollapsed(prev => {
      const next = typeof forceCollapse === 'boolean' ? forceCollapse : !prev;
      if (!next) {
        setRightCollapsed(true);
      }
      return next;
    });
  }, []);

  const toggleRightSidebar = useCallback((forceCollapse?: boolean) => {
    setRightCollapsed(prev => {
      const next = typeof forceCollapse === 'boolean' ? forceCollapse : !prev;
      if (!next) {
        setActiveAcademicTab(current => current || 'home');
        setCollapsed(true);
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
      const studentId = user.id || 'student';
      const localAttemptKey = `pinit_exam_attempt_${studentId}_${examSchedule.id}`;
      const regAttemptKey = user.registerNumber ? `pinit_exam_attempt_${user.registerNumber}_${examSchedule.id}` : null;
      if (typeof window !== 'undefined') {
        const rawLocal = localStorage.getItem(localAttemptKey) || (regAttemptKey ? localStorage.getItem(regAttemptKey) : null);
        if (rawLocal) {
          try {
            const parsed = JSON.parse(rawLocal);
            // Only block if a valid score exists (legitimate attempt); clear invalid/aborted markers
            if (typeof parsed?.score === 'number') {
              toast.warning('Attempt Blocked', 'You have already attempted this exam.');
              return;
            } else {
              localStorage.removeItem(localAttemptKey);
              if (regAttemptKey) localStorage.removeItem(regAttemptKey);
            }
          } catch {
            localStorage.removeItem(localAttemptKey);
            if (regAttemptKey) localStorage.removeItem(regAttemptKey);
          }
        }
      }

      const { examsService } = await import('@/lib/services/examsService');
      const attemptedInDb = await examsService.checkExamAttempt(studentId, user.registerNumber, examSchedule.id);
      if (attemptedInDb) {
        toast.warning('Attempt Blocked', 'You have already attempted this exam.');
        return;
      }

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
      } catch {}

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

    // Strictly guard attempt recording: only record if legitimately submitted with a numeric score
    if (finishedExam && user && result && result.submitted === true && typeof result.score === 'number') {
      try {
        const studentId = user.id || 'student';
        const localAttemptKey = `pinit_exam_attempt_${studentId}_${finishedExam.id}`;
        const regAttemptKey = user.registerNumber ? `pinit_exam_attempt_${user.registerNumber}_${finishedExam.id}` : null;
        if (typeof window !== 'undefined') {
          localStorage.setItem(localAttemptKey, JSON.stringify({ timestamp: Date.now(), score: result.score, percentage: result.percentage }));
          if (regAttemptKey) {
            localStorage.setItem(regAttemptKey, JSON.stringify({ timestamp: Date.now(), score: result.score, percentage: result.percentage }));
          }
        }

        const { examsService } = await import('@/lib/services/examsService');
        await examsService.recordExamAttempt({
          studentId,
          registerNumber: user.registerNumber,
          examScheduleId: finishedExam.id,
          score: result.score,
          passed: result.passed !== false,
          submitted: true
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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const courseParam = params.get('course') || params.get('prefix');
      const dayParam = params.get('day');
      const lessonKey = courseParam ? `${courseParam}_day_${dayParam || '1'}` : null;
      const qId = params.get('questId') || lessonKey || window.location.pathname.split('/').pop() || null;
      setQuestId(qId);
    }
  }, [pathname, searchParams]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const checkCallAndRoleplay = () => {
      const activeCall = (window.location.pathname.startsWith('/group-discussion') || (window.location.pathname.startsWith('/interview') && window.location.search.includes('tab=gd'))) && window.location.search.includes('call=true');
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

  useEffect(() => {
    if (questId) {
      const saved = localStorage.getItem(`pinit_lesson_notes_${user?.id || 'anon'}_${questId}`);
      setNotesContent(saved || '');
    } else {
      setNotesContent('');
    }
  }, [questId, user?.id]);

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
  const pageTitle   = (() => {
    const clean = (pathname || '').replace(/\/$/, '') || '/';
    if (PAGE_TITLES[clean]) return PAGE_TITLES[clean];
    // Longest-prefix fallback so sub-routes (e.g. /projects/123) inherit their section title
    const match = Object.keys(PAGE_TITLES)
      .filter(k => clean.startsWith(k + '/'))
      .sort((a, b) => b.length - a.length)[0];
    return match ? PAGE_TITLES[match] : 'PinIT';
  })();

  const ob = ((user as any)?.onboardingAnswers || (user as any)?.onboarding_answers || {}) as Record<string, any>;
  const institutionName = (user as any)?.institutionName || (user as any)?.collegeName || ob.college || ob.university || ob.institution || 'Campus Academic';
  const institutionInitials = (user as any)?.institutionInitials || (institutionName ? institutionName.split(' ').map((w: string) => w[0]).join('').slice(0, 4).toUpperCase() : 'HUB');

  useEffect(() => { 
    setMobileOpen(false); 
    setActiveAcademicTab(null);
  }, [pathname]);

  // Sync theme from localStorage on initial portal mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem('pc_theme');
    if (saved === 'light' || saved === 'dark') {
      document.documentElement.setAttribute('data-theme', saved);
      useAppStore.getState().setTheme(saved);
    }
  }, []);

  // ── Global Fullscreen Gaming Mode (Double Shift + Space shortcut) ──────────
  const [showGamingPill, setShowGamingPill] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    let lastShiftSpaceTime = 0;

    const handleFullscreenChange = () => {
      const active = Boolean(document.fullscreenElement || (document as any).webkitFullscreenElement);
      if (active) {
        setShowGamingPill(true);
        const timer = setTimeout(() => setShowGamingPill(false), 3000);
        return () => clearTimeout(timer);
      } else {
        setShowGamingPill(false);
      }
    };

    const handleGlobalKeyDown = async (e: KeyboardEvent) => {
      // Shift + twice Spacebar -> Toggle Fullscreen Gaming Mode
      if (e.shiftKey && (e.code === 'Space' || e.key === ' ')) {
        const target = e.target as HTMLElement | null;
        const isInputField = target && (
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          Boolean(target.isContentEditable) ||
          target.closest('.monaco-editor') !== null
        );
        if (!isInputField) {
          const now = Date.now();
          if (now - lastShiftSpaceTime < 700) {
            e.preventDefault();
            lastShiftSpaceTime = 0;
            try {
              const docAny = document as any;
              const elAny = document.documentElement as any;
              if (document.fullscreenElement || docAny.webkitFullscreenElement) {
                if (document.exitFullscreen) {
                  await document.exitFullscreen();
                } else if (docAny.webkitExitFullscreen) {
                  await docAny.webkitExitFullscreen();
                }
              } else {
                if (elAny.requestFullscreen) {
                  await elAny.requestFullscreen();
                } else if (elAny.webkitRequestFullscreen) {
                  await elAny.webkitRequestFullscreen();
                } else if (elAny.mozRequestFullScreen) {
                  await elAny.mozRequestFullScreen();
                }
              }
            } catch (_err) {
              setShowGamingPill(true);
              setTimeout(() => setShowGamingPill(false), 3000);
            }
          } else {
            lastShiftSpaceTime = now;
          }
        }
      }

      // Escape to exit fullscreen if active
      if (e.code === 'Escape' || e.key === 'Escape') {
        const docAny = document as any;
        if (document.fullscreenElement || docAny.webkitFullscreenElement) {
          if (document.exitFullscreen) {
            document.exitFullscreen().catch(() => {});
          } else if (docAny.webkitExitFullscreen) {
            docAny.webkitExitFullscreen();
          }
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === '[' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); toggleLeftSidebar(); }
      if (e.key === 'Escape' && mobileOpen) { setMobileOpen(false); }
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [toggleLeftSidebar, mobileOpen]);

  useEffect(() => {
    isRedirectingRef.current = false;
  }, [pathname, user]);

  useEffect(() => {
    if (!loading && isLoaded && user && isStudent && !isPublic && pathname !== '/onboarding') {
      // Context step (server value, raised by this device's progress) or any profile/local signal.
      const localSignals = readLocalOnboardingSignals(user.id);
      const onboardingDone = isOnboardingComplete({ onboardingStep }, localSignals)
        || isOnboardingComplete(onboardingSignalsOf(user));

      if (!onboardingDone && pathname !== '/onboarding') {
        if (isRedirectingRef.current) return;
        isRedirectingRef.current = true;
        router.push('/onboarding');
        return;
      }
      const allowedStudentTabs = [
        '/interview', '/dashboard', '/quests', '/missions', '/learning', '/career-builder', '/mirror',
        '/projects', '/group-discussion', '/attention-span', '/profile', '/notifications',
        '/vault', '/library', '/hostel', '/transport', '/events', '/grievances', '/research',
        '/career-intelligence', '/finance', '/maintenance', '/advisor', '/exams', '/attendance',
        '/documents', '/arena', '/leaderboard', '/friends',
        // Missing tabs restored:
        '/career-twin', '/passport', '/portfolio', '/code-wars', '/teams', 
        '/opportunities', '/applications', '/placement', '/internships', '/verify',
        '/pins'
      ];
      const isAllowedTab = allowedStudentTabs.some(tab => pathname === tab || pathname.startsWith(tab + '/'));
      if (!isAllowedTab) {
        if (isRedirectingRef.current) return;
        isRedirectingRef.current = true;
        console.warn("[AppShell] Redirecting to /dashboard because student is not allowed on:", pathname);
        router.push('/dashboard');
      }
    }
  }, [user, loading, isLoaded, isStudent, isPublic, onboardingStep, router, pathname]);

  // Signed out on a private page: immediately replace history state with /login
  useEffect(() => {
    if (!loading && user === null && !isPublic) {
      if (typeof window !== 'undefined') {
        const hasLocalSession = Boolean(
          localStorage.getItem('pinit_current_user') || 
          localStorage.getItem('pinit_user') || 
          localStorage.getItem('pinit_session_token')
        );
        if (hasLocalSession) return;
      }
      const search = typeof window !== 'undefined' ? window.location.search : '';
      if (typeof window !== 'undefined') {
        window.history.replaceState(null, '', '/login');
        window.location.replace('/login');
      } else {
        router.push(`/login?redirect=${encodeURIComponent(`${pathname}${search}`)}`);
      }
    }
  }, [user, loading, isPublic, router, pathname]);

  // Defeat Back-Forward Cache (BFCache): if a protected page is restored from memory cache
  // after the user has logged out, immediately replace with /login.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        const hasSession =
          document.cookie.includes('pinit_session') ||
          document.cookie.includes('sb-') ||
          Boolean(localStorage.getItem('pinit_current_user')) ||
          Object.keys(localStorage).some(k => k.startsWith('sb-') || k.startsWith('pinit_'));
        if (!hasSession && !isPublic) {
          window.history.replaceState(null, '', '/login');
          window.location.replace('/login');
        }
      }
    };
    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, [isPublic]);

  const PUBLIC_SHOWCASE_PATHS = ['/', '/problem', '/identity', '/how-it-works', '/modules', '/pricing', '/campus-demo', '/about', '/contact', '/privacy', '/terms', '/university', '/admissions', '/verify', '/passport'];
  const isPublicShowcase = PUBLIC_SHOWCASE_PATHS.some(p => pathname === p || (p !== '/' && pathname.startsWith(p)));
  const isLandingPage = isPublicShowcase || ['/login', '/signup', '/reset-password', '/qr-login', '/qr-confirm', '/onboarding', '/quests/lesson'].some(p => pathname === p || (p !== '/' && pathname.startsWith(p)));
  if (isPublicShowcase) return <PublicEffectsShell>{children}</PublicEffectsShell>;
  if (isLandingPage) return <>{children}</>;

  if (loading) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg)' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontSize:35, marginBottom:12, animation:'spin 1s linear infinite' }}>⬡</div>
        <div style={{ fontFamily:'var(--font-mono)', fontSize:12, color:'var(--t3)' }}>Loading...</div>
      </div>
    </div>
  );

  if (user === null) {
    return null;
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

      {/* ── Left Sidebar (Decoupled Modular Component) ── */}
      <AppSidebar
          collapsed={collapsed}
          setCollapsed={(val) => {
            const next = typeof val === 'boolean' ? val : !collapsed;
            setCollapsed(next);
            if (!next) setRightCollapsed(true);
          }}
        effectiveFocusMode={effectiveFocusMode}
        focusMode={focusMode}
        pathname={pathname}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        toggleLeftSidebar={toggleLeftSidebar}
        activeTourRoute={activeTourRoute}
        setActiveAcademicTab={setActiveAcademicTab}
        activeAcademicTab={activeAcademicTab}
        currentSearch={searchParams?.toString() || ''}
        forceShowCareerBuilder={Boolean((cOS as any).forceShowCareerBuilder)}
        user={user}
        isStudent={isStudent}
        pins={pins}
        unread={unread}
        logout={logout}
        router={router}
      />

      {/* ── Main Area ── */}
      <div className="main-area">
        {/* Topbar Header (Decoupled Modular Component) */}
        <AppHeader
          isLessonOrDetail={isLessonOrDetail}
          isGroupDiscussionCall={isGroupDiscussionCall}
          isRoleplayActive={isRoleplayActive}
          effectiveFocusMode={effectiveFocusMode}
          toggleFocusMode={toggleFocusMode}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
          pageTitle={pageTitle}
          isStudent={isStudent}
          careerScore={careerScore}
          dnaScore={dnaScore}
          trustScore={trustScore}
          missionOnlyStreak={missionOnlyStreak}
          liteUiMode={liteUiMode}
          setLiteUiMode={setLiteUiMode}
          theme={theme}
          toggleTheme={toggleTheme}
          wsConnected={wsConnected}
          unread={unread}
          userId={user?.id}
        />

        {/* Content */}
        <main 
          className="page-content animate-fade-in"
          style={{
            padding: isLessonOrDetail ? '0px' : ((isGroupDiscussionCall || isRoleplayActive) ? '16px' : (effectiveFocusMode ? '32px 48px' : undefined)),
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
            width: rightCollapsed ? 'var(--sidebar-collapsed-w, 68px)' : 'var(--sidebar-w, 240px)',
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
              <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--t1)' }}>{institutionName}</div>
              <div style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase' }}>Services &amp; Life</div>
            </div>
          ) : (
            <div style={{ padding: '16px 0 12px', borderBottom: '1px solid var(--border)', textAlign: 'center', fontSize: 13, fontWeight: 900, color: 'var(--accent)' }}>
              {institutionInitials}
            </div>
          )}

          {/* Student Info Card */}
          {!rightCollapsed ? (
            <div style={{ padding: '14px', borderBottom: '1px solid var(--border)', background: 'linear-gradient(135deg, var(--accent-light), var(--bg2))', textAlign: 'center' }}>
              <div style={{ width: 50, height: 50, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), var(--purple))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px', fontSize: 22, color: 'white', border: '2px solid var(--bg-sidebar)', boxShadow: '0 2px 10px color-mix(in srgb, var(--accent) 20%, transparent)', overflow: 'hidden' }}>
                👤
              </div>
              {(() => {
                const rawDisp = typeof user?.displayName === 'string' ? user.displayName : (typeof user?.name === 'string' ? user.name : '');
                const rawReal = (user as any)?.fullName || (user as any)?.full_name || (user as any)?.candidateName || (user as any)?.onboardingAnswers?.candidateName || (user as any)?.onboardingAnswers?.fullName;
                const realName = typeof rawReal === 'string' ? rawReal : '';
                const studentName = (rawDisp && !rawDisp.startsWith('usr_') && rawDisp.toLowerCase() !== 'student') ? rawDisp : (realName || rawDisp || 'Student');
                const rawUName = typeof user?.username === 'string' ? user.username : '';
                const pinitId = (user as any)?.pinitId || (user as any)?.pinit_id || (user as any)?.registerNumber || (user as any)?.register_number || '';
                const handleOrRoll = (rawUName && !rawUName.startsWith('usr_')) ? rawUName : (user?.registerNumber || (typeof user?.email === 'string' ? user.email.split('@')[0] : ''));
                return (
                  <>
                    <div style={{ fontSize: 14.5, fontWeight: 700, marginBottom: 2, color: 'var(--t1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{studentName}</div>
                    {pinitId && typeof pinitId === 'string' && pinitId.startsWith('PIN-') ? (
                      <div style={{ fontSize: 10.5, color: 'var(--accent)', marginBottom: 6, fontFamily: 'var(--font-mono)', fontWeight: 800, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', letterSpacing: '0.5px' }}>
                        {pinitId}
                      </div>
                    ) : handleOrRoll ? (
                      <div style={{ fontSize: 11, color: 'var(--t3)', marginBottom: 6, fontFamily: 'var(--font-mono)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{handleOrRoll}</div>
                    ) : null}
                  </>
                );
              })()}
              {(() => {
                const batchName = (user as any)?.batch || 'General Batch';
                const rawColor = colorMap[batchName] || 'var(--brand)';
                const safeColor = typeof rawColor === 'string' && rawColor.startsWith('#') ? rawColor : 'var(--brand)';
                return (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: `${safeColor}18`, border: `1px solid ${safeColor}33`, borderRadius: 20, padding: '3px 10px' }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: safeColor, display: 'inline-block' }} />
                    <span style={{ fontSize: 12, fontWeight: 700, color: safeColor }}>{batchName}</span>
                  </div>
                );
              })()}
            </div>
          ) : (
            <div style={{ padding: '14px 0', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'center' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), var(--purple))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15.5, color: 'white', boxShadow: '0 2px 8px color-mix(in srgb, var(--accent) 18%, transparent)' }}>
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
                    toggleRightSidebar(false);
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
                    fontSize: 14.5,
                    transition: 'all 0.15s',
                    outline: 'none',
                    textAlign: 'left',
                    flexShrink: 0,
                    boxShadow: isTourSpotlight ? '0 0 16px rgba(var(--brand-rgb), 0.5)' : undefined,
                  }}
                  title={item.label}
                >
                  <span style={{ fontSize: 17.5, flexShrink: 0, transform: isTourSpotlight ? 'scale(1.15)' : undefined }}>{item.icon}</span>
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
                fontSize: 15.5,
                outline: 'none'
              }}
            >
              {rightCollapsed ? '‹' : '›'}
            </button>
          </div>
        </aside>
      )}

      {isStudent && !isLandingPage && !isLessonOrDetail && (
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
              zIndex: 99999,
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
              fontSize: 20,
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
              <h3 style={{ fontSize: 14.5, fontWeight: 900, color: 'var(--t1)', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: 6, margin: 0 }}>
                <span>📓</span> Study Notebook
              </h3>
              <button
                onClick={() => setNotesOpen(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--t3)', fontSize: 14.5, cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>
            
            <p style={{ fontSize: 11, color: 'var(--t3)', lineHeight: 1.4, margin: 0 }}>
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
                  fontSize: 11.5,
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
                fontSize: 12,
                lineHeight: 1.5,
                resize: 'none',
                outline: 'none'
              }}
            />
          </div>
        </>
      )}
      {/* 🎮 Global Gaming Mode Floating HUD Pill */}
      {showGamingPill && (
        <div style={{
          position: 'fixed',
          top: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 999999,
          background: 'rgba(15, 23, 42, 0.94)',
          color: '#ffffff',
          padding: '8px 20px',
          borderRadius: 30,
          border: '1.5px solid rgba(99, 102, 241, 0.6)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          fontSize: 13,
          fontWeight: 800,
          pointerEvents: 'none',
          backdropFilter: 'blur(8px)',
          letterSpacing: '0.02em',
        }}>
          <span>🎮</span>
          <span>Gaming Mode Active · Press Shift + Space twice or Esc to exit</span>
        </div>
      )}
    </div>
  );
}
