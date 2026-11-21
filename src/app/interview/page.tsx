'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCareerOS } from '@/lib/context/CareerOSContext';
import { useAuth } from '@/lib/context/AuthContext';
import { stopSpeaking } from '@/lib/tts';
import { stopArchetypeSoundscape } from '@/lib/audio/soundscapes';
import { sanitizeLLMOutput } from '@/lib/sanitizeLLM';
import { runTestSuite, warmUpCodeRuntime } from '@/lib/code/codeRunner';
import { resolveCompanyProfile, buildCompanyPromptContext } from '@/lib/interview/companyProfiles';
import { unlockSpeechSynthesis } from '@/lib/interview/voiceActivity';
import { SKIP_TURN_REGEX } from '@/lib/interview/postInterviewInsights';
import {
  advanceRoundDefense,
  buildConciseRoundIntro,
  buildDefenseFinalVerdictSpeech,
  createInitialDefenseState,
  evaluateDefenseTurnPass,
  getFallbackDefenseQuestion,
  startRoundDefense,
  type DefenseRoundType,
  type RoundDefenseState,
} from '@/lib/interview/roundDefenseEngine';
import { PathwayApiService } from '@/lib/api/pathwayApi';
import { toast } from '@/lib/store/useAppStore';
import { applyTrustReward, recordCheatingIncident } from '@/lib/trust/trustEngine';
import { preloadAvatarGLB } from '@/components/avatar/VRoidInterviewAvatar';
import { MindsetArchetype } from '@/lib/interview/scoringMatrix';

import {
  Stage,
  Message,
  InterviewSessionRecord,
  formatStageLabel,
  AVATAR_POOL,
  ROUND_INTERVIEWERS,
  safeFormatDate,
  getAuthHeaders
} from './interviewTypes';
import {
  createSemanticFallbackProblem,
  resolveDynamicCodingProblem
} from './problemGenerator';
import {
  Round1Behavioral,
  Round2Coding,
  Round2CaseStudy,
  Round3SystemDesign,
  Round4StarDrill,
  InterviewResultsView,
  InterviewSetupView,
  AssistModeDrawer,
  buildFallbackAssistData,
  InterviewHistoryModal,
  InterviewSessionHeader,
  InterviewVoiceHud,
  VaultDefenseRoom
} from './components';
import { resolveCaseStudyData } from './components/Round2CaseStudy';
import { loadPendingVaultDefense } from '@/lib/vault/vaultDefenseEngine';
import { useInterviewGaze } from './hooks/useInterviewGaze';
import { useInterviewVoice } from './hooks/useInterviewVoice';
import { useInterviewPersistence } from './hooks/useInterviewPersistence';
import { computeDeterministicEvaluation, exportInterviewTranscriptFile } from './interviewEvaluator';
import {
  getCapstoneInterviewPlan,
  recordCapstoneInterview,
  roadmapInterviewTopic,
} from '@/lib/interview/capstoneInterview';
import { getSavedCareerProjects } from '@/lib/projects/savedProjects';
import { getProjectEvidenceTarget } from '@/lib/projects/projectEvidence';
import { crashCourseEnrollmentService } from '@/lib/services/crashCourseEnrollmentService';
import { getCrashPlanById } from '@/lib/data/crashPlansData';
import { courseDefenseTopic, nextCapstoneSprint, type CapstoneMilestones } from '@/lib/courses/capstoneSprints';
import GroupDiscussionPage from '@/app/group-discussion/page';
import {
  generateJdInterviewContext,
  type JdMatchResult
} from '@/lib/interview/jdMatch';

const SUBTOPIC_LABELS: Record<string, string> = {
  software: 'Software Engineering (SDE)',
  ai_ml: 'AI, Machine Learning & LLM Systems',
  systems: 'Cloud & Distributed Systems',
  embedded: 'Embedded Systems & IoT Engineering',
  cyber: 'Cybersecurity & Secure Systems',
  quant: 'Quantitative Systems & Algorithmic Trading',
  data: 'Data Science & Analytics',
  finance: 'Finance & Accounting (B.Com)',
  audit_gst: 'Statutory Audit & GST Taxation (B.Com)',
  banking_credit: 'Banking, Credit Appraisal & Treasury (B.Com)',
  marketing: 'Digital Marketing & Growth',
  bba: 'Business Strategy & Product',
  hr: 'HR & Talent Management',
  operations: 'Supply Chain & Operations',
};

export default function InterviewPage() {
  const searchParams = useSearchParams();
  const cOS = useCareerOS();
  const { user } = useAuth();
  const { applyServerXp, earnPins, onboardingAnswers, saveCareerProjects } = cOS;

  const [hubTab, setHubTab] = useState<'interview' | 'gd'>('interview');

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'gd') setHubTab('gd');
    else if (tabParam === 'interview') setHubTab('interview');
  }, [searchParams]);

  const handleHubTabChange = (nextTab: 'interview' | 'gd') => {
    setHubTab(nextTab);
    if (typeof window !== 'undefined') {
      try {
        const url = new URL(window.location.href);
        if (nextTab === 'gd') url.searchParams.set('tab', 'gd');
        else url.searchParams.delete('tab');
        window.history.replaceState({}, '', url.pathname + (url.search ? url.search : ''));
      } catch {}
    }
  };

  const [interviewMode, setInterviewMode] = useState<'roadmap' | 'custom' | 'jd'>('roadmap');
  const [jdInput, setJdInput] = useState('');
  const [jdMatchResult, setJdMatchResult] = useState<JdMatchResult | null>(null);
  const [jdPromptContext, setJdPromptContext] = useState<string>('');
  const [customTopicInput, setCustomTopicInput] = useState('');
  const [activeTopicName, setActiveTopicName] = useState('Software Engineering');
  const [domainStream, setDomainStream] = useState<'tech' | 'non_tech'>('tech');
  const [domainSubTopic, setDomainSubTopic] = useState<string>('software');
  const [targetCompany, setTargetCompany] = useState<string>('');
  const [isAssistDocked, setIsAssistDocked] = useState<boolean>(false);
  const round4StartMsgIndexRef = useRef<number>(0);
  const [round4StartMsgIndex, setRound4StartMsgIndex] = useState<number>(0);
  const userPickedSubTopicRef = useRef<boolean>(false);

  useEffect(() => {
    if (interviewMode !== 'jd' || !jdInput.trim()) {
      setJdMatchResult(null);
      setJdPromptContext('');
      return;
    }
    const context = generateJdInterviewContext(jdInput, onboardingAnswers);
    setJdMatchResult(context.matchResult);
    setJdPromptContext(context.promptContext);
    if (context.focus.primaryTopic && context.matchResult.analyzable) {
      setActiveTopicName(context.focus.primaryTopic);
      if (context.focus.difficultyRecommendation) {
        setDifficulty(context.focus.difficultyRecommendation);
      }
    }
  }, [interviewMode, jdInput, onboardingAnswers]);

  useEffect(() => {
    const modeParam = searchParams.get('mode');
    const projectParam = searchParams.get('project');
    const courseParam = searchParams.get('course');

    if (modeParam === 'project_viva' && projectParam) {
      setInterviewMode('custom');
      setCustomTopicInput(`Capstone Project Viva: ${decodeURIComponent(projectParam)} (${decodeURIComponent(courseParam || '')})`);
      setActiveTopicName(`Capstone Viva: ${decodeURIComponent(projectParam)}`);
      setDomainStream('tech');
    }
  }, [searchParams]);

  // Roadmap journey: /interview?mode=capstone&projectId=… defends the student's verified roadmap
  // capstone for their career role. Part of the journey, so no Pins are charged for it.
  const [capstone, setCapstone] = useState<{ projectId: string; topic: string } | null>(null);
  const capstoneWarnedRef = useRef(false);
  const savedProjectsSource = (onboardingAnswers as Record<string, unknown> | undefined)?.portfolio_projects;
  useEffect(() => {
    if (searchParams.get('mode') !== 'capstone') return;
    const plan = getCapstoneInterviewPlan(onboardingAnswers as Record<string, unknown> | undefined, searchParams.get('projectId'));
    if (!plan.ok) {
      setCapstone(null);
      if (savedProjectsSource !== undefined && !capstoneWarnedRef.current) {
        capstoneWarnedRef.current = true;
        toast.warning('Capstone interview unavailable', plan.reason === 'NOT_VERIFIED'
          ? 'Verify and complete your roadmap capstone project first.'
          : 'This interview is for a completed roadmap capstone project.');
      }
      return;
    }
    setInterviewMode('custom');
    setCustomTopicInput(plan.topic);
    setActiveTopicName(plan.topic);
    setDomainStream(getProjectEvidenceTarget(plan.role, 'Beginner') ? 'tech' : 'non_tech');
    setCapstone({ projectId: plan.project.id, topic: plan.topic });
  }, [searchParams, onboardingAnswers, savedProjectsSource]);

  // Certificate course: /interview?mode=course_defense is capstone Sprint 4, the oral defense of
  // the course project. Free for the enrolled student; the server records the (signed) result.
  const [courseDefense, setCourseDefense] = useState<{ enrollmentId: string; topic: string } | null>(null);
  useEffect(() => {
    if (searchParams.get('mode') !== 'course_defense') return;
    let cancelled = false;
    crashCourseEnrollmentService.getActiveEnrollment().then((enrollment) => {
      if (cancelled) return;
      const plan = enrollment ? getCrashPlanById(enrollment.planId) : undefined;
      if (!enrollment || !plan) {
        toast.warning('Capstone defense unavailable', 'This interview is for students enrolled in a certificate course.');
        return;
      }
      const pending = nextCapstoneSprint(enrollment.milestoneProgress as CapstoneMilestones);
      if (pending !== 4) {
        toast.warning('Capstone defense not open yet', pending === null
          ? 'Your capstone is already complete.'
          : `Complete capstone Sprint ${pending} first.`);
        return;
      }
      const topic = courseDefenseTopic(plan, enrollment.track);
      setInterviewMode('custom');
      setCustomTopicInput(topic);
      setActiveTopicName(topic);
      setDomainStream('tech');
      setCourseDefense({ enrollmentId: enrollment.enrollmentId, topic });
    });
    return () => { cancelled = true; };
  }, [searchParams]);

  const [isInterviewActive, setIsInterviewActive] = useState(false);
  const [activeStage, setActiveStage] = useState<Stage>('round1_behavioral');

  // Voice action deep-links: `/interview?autostart=interview` & `/interview?tab=gd&autostart=gd`
  // Opens a ready-to-confirm launch modal for 1v1 interview (never silently spending Pins) or
  // advances the GD boardroom to panelist confirmation.
  const [showVoiceInterviewModal, setShowVoiceInterviewModal] = useState(false);
  const [gdAutostartRequested, setGdAutostartRequested] = useState(false);
  const voiceAutostartHandledRef = useRef<string | null>(null);

  useEffect(() => {
    const autostart = searchParams.get('autostart');
    if (autostart !== 'interview' && autostart !== 'gd') {
      voiceAutostartHandledRef.current = null;
      return;
    }
    if (voiceAutostartHandledRef.current === autostart) return;
    voiceAutostartHandledRef.current = autostart;

    if (autostart === 'gd') {
      setHubTab('gd');
      setGdAutostartRequested(true);
    } else if (!isInterviewActive) {
      setHubTab('interview');
      setShowVoiceInterviewModal(true);
    }

    if (typeof window !== 'undefined') {
      try {
        const url = new URL(window.location.href);
        url.searchParams.delete('autostart');
        window.history.replaceState({}, '', url.pathname + (url.search ? url.search : ''));
      } catch {}
    }
  }, [searchParams, isInterviewActive]);
  const isScoredStage = isInterviewActive && ['round1_behavioral', 'round2_coding', 'round3_systems', 'round4_star'].includes(activeStage);
  const selectedCompanyProfile = useMemo(() => resolveCompanyProfile(targetCompany), [targetCompany]);
  const companyContext = useMemo(() => buildCompanyPromptContext(selectedCompanyProfile, activeStage), [selectedCompanyProfile, activeStage]);
  const [difficulty, setDifficulty] = useState<'easy' | 'normal' | 'hard'>('normal');
  const [animState, setAnimState] = useState<'idle' | 'listening' | 'thinking' | 'talking'>('idle');
  const [manualTextInput, setManualTextInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSendingInterviewMessage, setIsSendingInterviewMessage] = useState(false);
  const [starStep, setStarStep] = useState<number>(0);
  const stageTransitionRef = useRef(false);
  const [codeReviewStarted, setCodeReviewStarted] = useState(false);
  const [codeReviewQuestionReady, setCodeReviewQuestionReady] = useState(false);
  const [codeReviewAnswered, setCodeReviewAnswered] = useState(false);
  const codeReviewQuestionPendingRef = useRef(false);
  const [architectureDefenseAnswered, setArchitectureDefenseAnswered] = useState(false);
  const architectureQuestionPendingRef = useRef(false);
  const [codeRunFailed, setCodeRunFailed] = useState(false);

  // Interview panelists rotate by round; mentor/teaching avatars are managed elsewhere.
  const [activeTeacher, setActiveTeacher] = useState(ROUND_INTERVIEWERS.round1_behavioral);

  useEffect(() => {
    preloadAvatarGLB([activeTeacher.id, 'sneha', 'rohan', 'vikram', 'aisha']);
  }, [activeTeacher.id]);

  const selectRandomTeacherForSession = useCallback(() => {
    const chosen = ROUND_INTERVIEWERS.round1_behavioral;
    setActiveTeacher(chosen);
    return chosen;
  }, []);

  // Elapsed Session Timer & Tab Inactivity Sync (pauses when browser tab is hidden/blurred)
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [isTabInactive, setIsTabInactive] = useState(false);
  const tabVisibleRef = useRef(true);
  const isInterviewActiveRef = useRef(isInterviewActive);
  const activeStageRef = useRef<Stage>(activeStage);
  activeStageRef.current = activeStage;

  useEffect(() => {
    isInterviewActiveRef.current = isInterviewActive;
  }, [isInterviewActive]);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const hidden = document.visibilityState === 'hidden';
      tabVisibleRef.current = !hidden;
      setIsTabInactive(hidden);
    }
    const onVisibilityChange = () => {
      const isVisible = document.visibilityState === 'visible';
      tabVisibleRef.current = isVisible;
      setIsTabInactive(!isVisible);
      if (!isVisible && isInterviewActiveRef.current && activeStageRef.current !== 'results') {
        setTabSwitchCount(prev => prev + 1);
        const sessId = liveSessionIdRef.current || `interview_sess_${Date.now()}`;
        recordCheatingIncident(user?.id, sessId, 'interview', 'interview_tab_switch').catch(() => {});
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (isInterviewActive && activeStage !== 'results') {
      const interval = setInterval(() => {
        if (tabVisibleRef.current) setElapsedSeconds(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isInterviewActive, activeStage]);

  // Fullscreen Auto-Hide Sidebars & Gaming Mode Synchronization
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (isInterviewActive) {
        document.body.setAttribute('data-interview-active', 'true');
        document.documentElement.setAttribute('data-gaming-mode', 'true');
        (window as any).__pinitInterviewActive = true;
        window.dispatchEvent(new CustomEvent('pinit-interview-toggle', { detail: { active: true } }));
      } else {
        document.body.removeAttribute('data-interview-active');
        document.documentElement.removeAttribute('data-gaming-mode');
        (window as any).__pinitInterviewActive = false;
        window.dispatchEvent(new CustomEvent('pinit-interview-toggle', { detail: { active: false } }));
      }
    }
    return () => {
      if (typeof window !== 'undefined') {
        document.body.removeAttribute('data-interview-active');
        document.documentElement.removeAttribute('data-gaming-mode');
        (window as any).__pinitInterviewActive = false;
        window.dispatchEvent(new CustomEvent('pinit-interview-toggle', { detail: { active: false } }));
      }
    };
  }, [isInterviewActive]);

  // WebGL context disposal, timer & soundscape cleanup on unmount
  useEffect(() => {
    return () => {
      if (eliminationTimerRef.current) {
        clearTimeout(eliminationTimerRef.current);
        eliminationTimerRef.current = null;
      }
      stopSpeaking();
      stopArchetypeSoundscape();
      if (typeof document !== 'undefined') {
        const canvases = document.querySelectorAll('.vroid-canvas, [data-avatar-canvas="true"]');
        canvases.forEach(canvas => {
          try {
            const gl = (canvas as HTMLCanvasElement).getContext('webgl') || (canvas as HTMLCanvasElement).getContext('webgl2');
            if (gl) {
              const ext = gl.getExtension('WEBGL_lose_context');
              if (ext) ext.loseContext();
            }
          } catch {}
        });
      }
    };
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Optical Gaze Tracking Hook
  const {
    showCameraPreview,
    eyeContactScore,
    setEyeContactScore,
    videoPreviewRef,
    toggleCameraPreview,
    stopCamera
  } = useInterviewGaze(isInterviewActive, activeStage);

  // Dynamic Generative Problem Cache
  const [dynamicProblemData, setDynamicProblemData] = useState<any>(null);
  const [latestTestOutcomes, setLatestTestOutcomes] = useState<any[]>([]);
  const [codingAttempt, setCodingAttempt] = useState(0);
  const dynamicProblemCacheRef = useRef<Map<string, any>>(new Map());
  const dynamicProblemRequestRef = useRef(0);

  const fetchDynamicProblem = useCallback(async (topicName: string, stream: string = 'tech', lang: string = 'python', variation: number = codingAttempt) => {
    const cacheKey = `${topicName}:${stream}:${difficulty}:${variation}`;
    const requestId = ++dynamicProblemRequestRef.current;
    if (dynamicProblemCacheRef.current.has(cacheKey)) {
      const cached = dynamicProblemCacheRef.current.get(cacheKey);
      setDynamicProblemData(cached);
      return cached;
    }
    try {
      const headers = await getAuthHeaders();
      const res = await fetch('/api/interview/generate-problem', {
        method: 'POST',
        headers,
          body: JSON.stringify({ topic: topicName, domainStream: stream, language: lang, difficulty, variation })
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.title && data?.starterCode && (lang !== 'sql' || (typeof data.testSuite === 'string' && data.testSuite.includes('-- CHECKS --')))) {
          dynamicProblemCacheRef.current.set(cacheKey, data);
          if (requestId === dynamicProblemRequestRef.current) setDynamicProblemData(data);
          return data;
        }
      }
    } catch {}
    const fallback = createSemanticFallbackProblem(topicName, difficulty);
    dynamicProblemCacheRef.current.set(cacheKey, fallback);
    if (requestId === dynamicProblemRequestRef.current) setDynamicProblemData(fallback);
    return fallback;
  }, [difficulty, codingAttempt]);

  const getDynamicCodingProblem = useCallback((topic: string, lang: string) => {
    const cached = dynamicProblemCacheRef.current.get(`${topic}:${domainStream}:${difficulty}:${codingAttempt}`);
    return resolveDynamicCodingProblem(topic, domainStream, lang, cached);
  }, [domainStream, difficulty, codingAttempt]);

  // Round 2 Code Workspace State
  const codeModifiedRef = useRef(false);
  const codePerLangRef = useRef<Record<string, string>>({});
  const prevLangRef = useRef<'java' | 'python' | 'javascript' | 'sql' | 'cpp'>('python');
  const [selectedLang, setSelectedLang] = useState<'java' | 'python' | 'javascript' | 'sql' | 'cpp'>('python');
  const [codeContent, setCodeContentState] = useState('');
  const codeContentRef = useRef(codeContent);
  codeContentRef.current = codeContent;
  // Synchronously update ref before React render so immediate callers (like B.Com Case submit) always read the fresh memo
  const setCodeContent = useCallback((val: string) => {
    codeContentRef.current = val;
    setCodeContentState(val);
  }, []);
  const selectedLangRef = useRef(selectedLang);
  selectedLangRef.current = selectedLang;
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [codeSubmitted, setCodeSubmitted] = useState(false);

  useEffect(() => {
    // When switching languages, save current buffer and restore or load new starter
    const prevLang = prevLangRef.current;
    const currentCodeSnapshot = codeContentRef.current;
    if (prevLang !== selectedLang) {
      if (currentCodeSnapshot) codePerLangRef.current[prevLang] = currentCodeSnapshot;
      prevLangRef.current = selectedLang;
      if (codePerLangRef.current[selectedLang]) {
        setCodeContent(codePerLangRef.current[selectedLang]);
        return;
      }
    } else if (codeModifiedRef.current) {
      return;
    }

    const dynamicProb = getDynamicCodingProblem(activeTopicName, selectedLang);
    if (dynamicProb.starterCode) {
      setCodeContent(dynamicProb.starterCode);
    }
  }, [activeTopicName, selectedLang, getDynamicCodingProblem, dynamicProblemData]);

  // Eagerly warm up in-browser WASM/worker runtimes when entering Round 2 Coding
  useEffect(() => {
    if (isInterviewActive && activeStage === 'round2_coding') {
      void warmUpCodeRuntime(selectedLang);
    }
  }, [isInterviewActive, activeStage, selectedLang]);

  // Round 3 Whiteboard Topology State
  const [latestTopology, setLatestTopology] = useState<any>(null);
  const [isAnalyzingArchitecture, setIsAnalyzingArchitecture] = useState(false);
  const [architectureEvaluation, setArchitectureEvaluation] = useState<any>(null);
  const [evaluationResult, setEvaluationResult] = useState<any>(null);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);

  // Reusable 5-Question Post-Submission Defense State (Round 2 & Round 3, Tech & B.Com)
  const [round2Defense, setRound2DefenseState] = useState<RoundDefenseState>(() => createInitialDefenseState(2, 'code'));
  const round2DefenseRef = useRef<RoundDefenseState>(round2Defense);
  const setRound2Defense = useCallback((next: RoundDefenseState) => {
    round2DefenseRef.current = next;
    setRound2DefenseState(next);
  }, []);

  const [round3Defense, setRound3DefenseState] = useState<RoundDefenseState>(() => createInitialDefenseState(3, 'architecture'));
  const round3DefenseRef = useRef<RoundDefenseState>(round3Defense);
  const setRound3Defense = useCallback((next: RoundDefenseState) => {
    round3DefenseRef.current = next;
    setRound3DefenseState(next);
  }, []);

  const eliminationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clearEliminationTimer = useCallback(() => {
    if (eliminationTimerRef.current) {
      clearTimeout(eliminationTimerRef.current);
      eliminationTimerRef.current = null;
    }
  }, []);

  // Server-recorded interview (T22): the id of the record the server keeps of this interview. Every
  // answer and the final evaluation carry it, so the score comes from what the server recorded.
  const [liveSessionId, setLiveSessionIdState] = useState<string | null>(null);
  const liveSessionIdRef = useRef<string | null>(null);
  const setLiveSessionId = useCallback((id: string | null) => {
    liveSessionIdRef.current = id;
    setLiveSessionIdState(id);
  }, []);
  const postLiveEvent = useCallback((event: 'stage' | 'skip', stage: Stage) => {
    const id = liveSessionIdRef.current;
    if (!id) return;
    getAuthHeaders()
      .then((headers) => fetch('/api/interview/chat', { method: 'POST', headers, body: JSON.stringify({ liveSessionId: id, event, stage }) }))
      .catch(() => {});
  }, []);

  const handleSendMessageWithTextRef = useRef<(text: string) => Promise<void>>((async () => {}) as any);
  const isSendingInterviewMessageRef = useRef(false);
  const speakWithAvatarRef = useRef<(text: string, teacherId: string, onStart: () => void, onEnd: () => void) => void>(() => {});

  // Speech Recognition & TTS Hook
  const handleFinalSpeechTranscript = useCallback((finalText: string) => {
    handleSendMessageWithTextRef.current(finalText);
  }, []);

  const handleSilenceNudge = useCallback((nudgeMsg: string) => {
    setMessages(prev => {
      const userTurns = prev.filter(m => m.role === 'user' && !SKIP_TURN_REGEX.test(m.content.trim()));
      const isRound1Complete = activeStage === 'round1_behavioral' && (userTurns.length >= 3 || userTurns.filter(m => m.content.trim().split(/\s+/).length >= 10).length >= 2);

      const targetMsg = isRound1Complete
        ? (domainStream === 'non_tech'
            ? "You've completed the screening intro! Whenever you're ready, click 'Continue to Case Study' to start Round 2."
            : "You've completed the behavioral intro! Whenever you're ready, click 'Continue to coding' to start Round 2.")
        : nudgeMsg;

      // Deduplication: Never append or speak the exact same silence nudge consecutively
      if (prev.length > 0 && prev[prev.length - 1].content === targetMsg) {
        return prev;
      }

      speakWithAvatarRef.current(targetMsg, activeTeacher.id, () => setAnimState('talking'), () => setAnimState('idle'));
      return [...prev, { role: 'assistant', content: targetMsg }];
    });
  }, [activeTeacher.id, activeStage, domainStream]);

  const {
    isVoiceListening,
    isAvatarSpeaking,
    setIsAvatarSpeaking,
    liveSpeechTranscript,
    wpmScore,
    fillerWordCount,
    setFillerWordCount,
    micAudioLevel,
    bargeInEnabled,
    setBargeInEnabled,
    avatarVolume,
    handleVolumeChange,
    startVoiceListening,
    stopVoiceListening,
    pauseVoiceListening,
    speakWithAvatar,
    previewAssistSpeech,
    interruptSpeech,
    isSpeechSupported,
    flushAndSubmitTranscript
  } = useInterviewVoice({
    isInterviewActive,
    activeStage,
    activeTopicName,
    activeTeacherId: activeTeacher.id,
    domainStream,
    difficulty,
    onFinalTranscript: handleFinalSpeechTranscript,
    onSilenceNudge: handleSilenceNudge,
    isTabInactive,
    isSendingInterviewerReply: isSendingInterviewMessage
  });
  speakWithAvatarRef.current = speakWithAvatar;

  // Persist the live voice metrics alongside the rest of the in-progress interview draft.
  const {
    sessions,
    selectedHistorySession,
    setSelectedHistorySession,
    activeSessionDraft,
    setActiveSessionDraft,
    saveSessionHistory,
    clearSessionHistory,
    discardActiveSession,
    clearDraft
  } = useInterviewPersistence({
    userId: user?.id,
    isInterviewActive,
    activeStage,
    activeTopicName,
    domainStream,
    domainSubTopic,
    difficulty,
    starStep,
    messages,
    codeContent,
    selectedLang,
    codingAttempt,
    codingProblem: dynamicProblemData,
    elapsedSeconds,
    fillerWordCount,
    activeTeacherId: activeTeacher.id,
    latestTopology,
    liveSessionId,
    tabSwitchCount,
    targetCompany,
    round4StartMsgIndex
  });

  // Assist Mode State
  const [isAssistModeActive, setIsAssistModeActive] = useState(false);
  const [assistData, setAssistData] = useState<any>(null);
  const [isFetchingAssist, setIsFetchingAssist] = useState(false);
  const assistRequestRef = useRef(0);
  const lastFetchedAssistKeyRef = useRef<string>('');
  const messagesRef = useRef(messages);
  messagesRef.current = messages;
  const [assistScriptLevel, setAssistScriptLevel] = useState<'standard' | 'advanced'>('standard');
  const [assistTab, setAssistTab] = useState<'script' | 'bullets' | 'delivery'>('script');

  // Alt + Space global shortcut to toggle Assist Mode during scored interview rounds
  useEffect(() => {
    if (!isInterviewActive || !isScoredStage || typeof window === 'undefined') return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.code === 'Space') {
        const target = e.target as HTMLElement | null;
        const inField = Boolean(
          target &&
          (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT' || target.closest('.monaco-editor'))
        );
        if (inField) return;
        e.preventDefault();
        setIsAssistModeActive(prev => !prev);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isInterviewActive, isScoredStage]);

  const fetchAssistScript = useCallback(async (questionText: string, level?: 'standard' | 'advanced', stageOverride?: Stage, force: boolean = true) => {
    const targetStage = stageOverride || activeStage;
    const targetLevel = level || assistScriptLevel;

    const cleanQuestion = String(questionText || '')
      .replace(/\s*—\s*(?:Ms\.|Mr\.)?\s*[\w\s]+$/i, '')
      .replace(/^(?:Ms\.|Mr\.)?\s*[\w\s]+:\s*/i, '')
      .trim();

    const finalQuestion = cleanQuestion || (
      targetStage === 'round2_coding'
        ? (domainStream === 'non_tech'
            ? `How do you compute the Exhibit A financial indicators and defend your business recommendation for ${activeTopicName}?`
            : 'How would you approach solving this problem under time and space constraints?')
        : targetStage === 'round3_systems'
        ? (domainStream === 'non_tech'
            ? `How would you design the end-to-end business workflow and operating funnel for ${activeTopicName}?`
            : 'How would you design this system architecture end-to-end?')
        : targetStage === 'round4_star'
        ? (domainStream === 'non_tech'
            ? `Describe a high-stakes commercial or financial challenge in ${activeTopicName} using Situation, Task, Action, and Result.`
            : 'Describe a high-stakes engineering situation, task, action, and measurable result.')
        : `Tell me about your background and experience with ${activeTopicName}.`
    );

    const dedupKey = `${targetStage}:${activeTopicName}:${targetLevel}:${cleanQuestion}`;
    if (!force && cleanQuestion && lastFetchedAssistKeyRef.current === dedupKey) {
      return;
    }
    if (cleanQuestion) {
      lastFetchedAssistKeyRef.current = dedupKey;
    }

    const requestId = ++assistRequestRef.current;
    setIsFetchingAssist(true);

    const recentContext = (messagesRef.current || [])
      .slice(-4)
      .map(m => `${m.role === 'user' ? 'Candidate' : 'Interviewer'}: ${m.content}`)
      .join('\n');

    try {
      const headers = await getAuthHeaders();
      const res = await fetch('/api/interview/assist', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          question: finalQuestion,
          stage: targetStage,
          topic: activeTopicName,
          domainStream,
          difficulty,
          scriptLevel: targetLevel,
          recentContext,
          jdContext: jdPromptContext,
          companyContext,
          isPractice: !isInterviewActive
        })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || `Assist request failed (${res.status}).`);
      if (!data?.script) throw new Error('The assist service returned an empty script.');
      if (requestId === assistRequestRef.current) setAssistData(data);
    } catch (error) {
      console.warn('[Interview Assist] Could not refresh the script via API, using question-aware fallback:', error);
      if (requestId === assistRequestRef.current) {
        const fallbackData = buildFallbackAssistData(
          targetStage,
          activeTopicName,
          targetLevel,
          targetStage === 'round2_coding',
          finalQuestion,
          domainStream
        );
        setAssistData(fallbackData);
      }
    } finally {
      if (requestId === assistRequestRef.current) setIsFetchingAssist(false);
    }
  }, [isInterviewActive, activeStage, activeTopicName, domainStream, difficulty, assistScriptLevel, jdPromptContext, companyContext]);

  // 🎯 Unified Reactive Assist Mode Synchronization:
  // Automatically crafts a tailored coaching script whenever the interviewer's question changes or Assist Mode is enabled
  const lastAssistantMessage = useMemo(() => {
    const assistantMsgs = messages.filter(m => m.role === 'assistant');
    return assistantMsgs.length > 0 ? assistantMsgs[assistantMsgs.length - 1].content : '';
  }, [messages]);

  useEffect(() => {
    if (!isInterviewActive || !isAssistModeActive || !lastAssistantMessage) return;
    const clean = lastAssistantMessage
      .replace(/\s*—\s*(?:Ms\.|Mr\.)?\s*[\w\s]+$/i, '')
      .replace(/^(?:Ms\.|Mr\.)?\s*[\w\s]+:\s*/i, '')
      .trim();
    if (!clean) return;
    const lower = clean.toLowerCase();
    if (
      lower.includes('having trouble connecting') ||
      lower.includes('could not review that') ||
      lower.includes('connection failed')
    ) {
      return;
    }
    void fetchAssistScript(clean, assistScriptLevel, undefined, false);
  }, [isInterviewActive, isAssistModeActive, lastAssistantMessage, assistScriptLevel, fetchAssistScript]);

  const resumeActiveSession = useCallback(() => {
    if (!activeSessionDraft) return;
    try { unlockSpeechSynthesis(); } catch {}
    const restoredR4Idx = Number(activeSessionDraft.round4StartMsgIndex) || 0;
    round4StartMsgIndexRef.current = restoredR4Idx;
    setRound4StartMsgIndex(restoredR4Idx);
    if (typeof activeSessionDraft.targetCompany === 'string') {
      setTargetCompany(activeSessionDraft.targetCompany);
    }
    setActiveTopicName(activeSessionDraft.activeTopicName);
    setDomainStream(activeSessionDraft.domainStream);
    if (activeSessionDraft.domainSubTopic) setDomainSubTopic(activeSessionDraft.domainSubTopic);
    setActiveStage(activeSessionDraft.activeStage);
    setDifficulty(activeSessionDraft.difficulty);
    setStarStep(activeSessionDraft.starStep || 0);
    setMessages(activeSessionDraft.messages || []);
    setFillerWordCount(activeSessionDraft.fillerWordCount || 0);
    setCodeContent(activeSessionDraft.codeContent || '');
    setCodeSubmitted(false);
    setArchitectureEvaluation(null);
    setLatestTopology(activeSessionDraft.latestTopology || null);
    setRound2Defense(createInitialDefenseState(2, activeSessionDraft.domainStream === 'non_tech' ? 'case' : 'code'));
    setRound3Defense(createInitialDefenseState(3, activeSessionDraft.domainStream === 'non_tech' ? 'workflow' : 'architecture'));
    codePerLangRef.current = {};
    codeModifiedRef.current = Boolean(activeSessionDraft.codeContent);
    setSelectedLang(activeSessionDraft.selectedLang || 'python');
    if (activeSessionDraft.activeStage === 'round2_coding' && activeSessionDraft.domainStream !== 'non_tech') {
      const resumedAttempt = Math.max(0, Number(activeSessionDraft.codingAttempt) || 0);
      setCodingAttempt(resumedAttempt);
      const savedProblem = activeSessionDraft.codingProblem;
      if (savedProblem?.title && savedProblem?.starterCode) {
        const cacheKey = `${activeSessionDraft.activeTopicName}:${activeSessionDraft.domainStream}:${activeSessionDraft.difficulty}:${resumedAttempt}`;
        dynamicProblemCacheRef.current.set(cacheKey, savedProblem);
        setDynamicProblemData(savedProblem);
      } else {
        void fetchDynamicProblem(activeSessionDraft.activeTopicName, activeSessionDraft.domainStream, activeSessionDraft.selectedLang || 'python', resumedAttempt);
      }
    }
    setElapsedSeconds(activeSessionDraft.elapsedSeconds || 0);
    setTabSwitchCount(activeSessionDraft.tabSwitchCount || 0);
    const resumedId = activeSessionDraft.liveSessionId ?? null;
    setLiveSessionId(resumedId);
    if (resumedId) {
      getAuthHeaders()
        .then((headers) => fetch('/api/interview/start', {
          method: 'POST',
          headers,
          body: JSON.stringify({ action: 'resume', liveSessionId: resumedId, topic: activeSessionDraft.activeTopicName, stage: activeSessionDraft.activeStage }),
        }))
        .then((r) => r.json())
        .then((d) => { if (!d?.recorded) setLiveSessionId(null); })
        .catch(() => {});
    }
    const requestedId = String(activeSessionDraft.activeTeacherId || '').toLowerCase().trim();
    const stageKey = activeSessionDraft.activeStage as Exclude<Stage, 'results'>;
    const foundTeacher = requestedId !== 'priya'
      ? AVATAR_POOL.find(a => a.id === requestedId)
      : undefined;
    setActiveTeacher(foundTeacher || ROUND_INTERVIEWERS[stageKey] || ROUND_INTERVIEWERS.round1_behavioral);

    // 🎮 Auto-activate Gaming Mode (Browser Fullscreen & Focus Mode) on resume gesture
    if (typeof window !== 'undefined') {
      try {
        const docAny = document as any;
        const elAny = document.documentElement as any;
        const hasActiveGesture = typeof navigator !== 'undefined' && 'userActivation' in navigator
          ? Boolean((navigator as any).userActivation?.isActive)
          : true;
        if (hasActiveGesture && !document.fullscreenElement && !docAny.webkitFullscreenElement) {
          if (elAny.requestFullscreen) {
            elAny.requestFullscreen().catch(() => {});
          } else if (elAny.webkitRequestFullscreen) {
            elAny.webkitRequestFullscreen().catch(() => {});
          } else if (elAny.mozRequestFullScreen) {
            elAny.mozRequestFullScreen().catch(() => {});
          }
        }
      } catch {}
      (window as any).__pinitInterviewActive = true;
      window.dispatchEvent(new CustomEvent('pinit-interview-toggle', { detail: { active: true } }));
      document.body.setAttribute('data-interview-active', 'true');
      document.documentElement.setAttribute('data-gaming-mode', 'true');
    }

    setIsInterviewActive(true);
    toast.success('Interview Session Restored', `Resumed in ${activeSessionDraft.activeTopicName} (${formatStageLabel(activeSessionDraft.activeStage)})`);
  }, [activeSessionDraft, setLiveSessionId, setFillerWordCount, fetchDynamicProblem]);

  const startInterview = async () => {
    if (interviewMode === 'custom' && !customTopicInput.trim()) {
      toast.warning('Topic Required', 'Please enter a custom topic or capstone project before starting your interview.');
      return;
    }
    if (interviewMode === 'jd' && !jdInput.trim()) {
      toast.warning('Job Description Required', 'Paste a target job description first so the panel can tailor questions to the role.');
      return;
    }

    stopArchetypeSoundscape();
    try { unlockSpeechSynthesis(); } catch {}
    round4StartMsgIndexRef.current = 0;
    setRound4StartMsgIndex(0);
    lastFetchedAssistKeyRef.current = '';
    lastTopologySignatureRef.current = '';
    setIsEvaluating(false);

    // 🎮 Auto-activate Gaming Mode (Browser Fullscreen & Focus Mode) synchronously inside user click gesture
    if (typeof window !== 'undefined') {
      try {
        const docAny = document as any;
        const elAny = document.documentElement as any;
        const hasActiveGesture = typeof navigator !== 'undefined' && 'userActivation' in navigator
          ? Boolean((navigator as any).userActivation?.isActive)
          : true;
        if (hasActiveGesture && !document.fullscreenElement && !docAny.webkitFullscreenElement) {
          if (elAny.requestFullscreen) {
            elAny.requestFullscreen().catch(() => {});
          } else if (elAny.webkitRequestFullscreen) {
            elAny.webkitRequestFullscreen().catch(() => {});
          } else if (elAny.mozRequestFullScreen) {
            elAny.mozRequestFullScreen().catch(() => {});
          }
        }
      } catch {}
      (window as any).__pinitInterviewActive = true;
      window.dispatchEvent(new CustomEvent('pinit-interview-toggle', { detail: { active: true } }));
      document.body.setAttribute('data-interview-active', 'true');
      document.documentElement.setAttribute('data-gaming-mode', 'true');
    }

    const topic = interviewMode === 'jd' && jdMatchResult?.analyzable && activeTopicName
      ? activeTopicName
      : interviewMode === 'custom' && customTopicInput.trim()
      ? customTopicInput.trim()
      : (userPickedSubTopicRef.current || !onboardingAnswers?.role)
      ? (SUBTOPIC_LABELS[domainSubTopic] || roadmapInterviewTopic(onboardingAnswers?.role, domainStream))
      : roadmapInterviewTopic(onboardingAnswers?.role, domainStream);

    // Capstone defenses (roadmap journey, certificate course) are free; any other topic needs Pins.
    const isCapstoneRun = (capstone !== null && topic === capstone.topic)
      || (courseDefense !== null && topic === courseDefense.topic);
    const itemKey = `interview:${domainStream}:${topic.toLowerCase().replace(/\s+/g, '_')}`;
    if (!isCapstoneRun && !cOS.isItemUnlocked(itemKey)) {
      if ((cOS.pins ?? 0) < 25) {
        if (typeof window !== 'undefined') {
          try {
            if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
          } catch {}
          document.body.removeAttribute('data-interview-active');
          document.documentElement.removeAttribute('data-gaming-mode');
          (window as any).__pinitInterviewActive = false;
          window.dispatchEvent(new CustomEvent('pinit-interview-toggle', { detail: { active: false } }));
        }
        const curPins = cOS.pins ?? 0;
        const vaultPins = cOS.bonusPins ?? 0;
        toast.error(
          'Insufficient Current Pins',
          vaultPins > 0
            ? `You need 25 Current Pins to start this interview (you have ${curPins}/120). Refill Current Pins from your ${vaultPins.toLocaleString()} Bonus Vault pins first!`
            : `You need 25 Current Pins to start this interview (you have ${curPins}/120). Daily pins reset to 120 at 1:00 AM IST or buy pins in the Pins store.`
        );
        return;
      }
      const unlocked = await cOS.unlockItem(itemKey, 'interview', `AI Interview: ${topic}`);
      if (!unlocked) {
        if (typeof window !== 'undefined') {
          try {
            if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
          } catch {}
          document.body.removeAttribute('data-interview-active');
          document.documentElement.removeAttribute('data-gaming-mode');
          (window as any).__pinitInterviewActive = false;
          window.dispatchEvent(new CustomEvent('pinit-interview-toggle', { detail: { active: false } }));
        }
        toast.error('Insufficient Pins', 'You need Pins to start this corporate interview session. Top up your Pins in the Pins store or claim your daily bonus!');
        return;
      }
    }

    const sessionTeacher = selectRandomTeacherForSession();
    setActiveTopicName(topic);
    setIsInterviewActive(true);
    setActiveStage('round1_behavioral');
    setCodeSubmitted(false);
    setTerminalLogs([]);
    setElapsedSeconds(0);
    setTabSwitchCount(0);
    setEyeContactScore(null);
    setStarStep(0);
    setCodingAttempt(0);
    setCodeReviewStarted(false);
    setCodeReviewQuestionReady(false);
    setCodeReviewAnswered(false);
    codeReviewQuestionPendingRef.current = false;
    setArchitectureDefenseAnswered(false);
    architectureQuestionPendingRef.current = false;
    clearEliminationTimer();
    setRound2Defense(createInitialDefenseState(2, domainStream === 'non_tech' ? 'case' : 'code'));
    setRound3Defense(createInitialDefenseState(3, domainStream === 'non_tech' ? 'workflow' : 'architecture'));
    setCodeRunFailed(false);
    setEvaluationResult(null);
    finishingRef.current = false;
    setArchitectureEvaluation(null);
    setLatestTopology(null);
    setCodeSubmitted(false);
    setCodeContent('');
    setTerminalLogs([]);
    codePerLangRef.current = {};
    codeModifiedRef.current = false;
    lastRecordedCodeRef.current = '';
    dynamicProblemRequestRef.current += 1;
    setDynamicProblemData(null);

    const companyIntro = selectedCompanyProfile
      ? ` This session simulates a ${selectedCompanyProfile.name} hiring loop (${selectedCompanyProfile.interviewStyle}).`
      : '';
    const jdProbeIntro = interviewMode === 'jd' && jdMatchResult?.analyzable && jdMatchResult.missing_skills.length > 0
      ? ` Based on your target job description, we will pay special attention to ${jdMatchResult.missing_skills.slice(0, 2).join(' and ')}.`
      : '';
    const difficultyPromptEnd = domainStream === 'non_tech'
      ? (difficulty === 'hard'
          ? `Let's treat this like a live Big-4 / Tier-1 Corporate panel: briefly introduce your B.Com background and walk me through the toughest financial, audit, or commercial decision you analyzed.`
          : difficulty === 'easy'
          ? `To warm up, tell me about your commerce background, your favourite accounting or business subject, and what excites you about ${topic}.`
          : `To kick off our corporate panel, please introduce your B.Com/commerce background and walk me through one accounting, finance, tax, or business case you have worked on in ${topic}.`)
      : (difficulty === 'hard'
          ? `Please keep your introduction concise—focus directly on the highest-stakes ${topic} problem you personally owned and the measurable outcome.`
          : difficulty === 'easy'
          ? `To warm up, tell me a bit about your background and what excites you most about ${topic}.`
          : `To kick things off, please introduce yourself, walk me through your background, and highlight one recent project in ${topic}.`);

    const greeting = `Welcome to your ${topic} Corporate Interview! I am ${sessionTeacher.name}, ${sessionTeacher.title}.${companyIntro}${jdProbeIntro} ${difficultyPromptEnd}`;

    // The server opens its record of this interview (the topic is fixed from here on).
    let recordedId: string | null = null;
    try {
      const headers = await getAuthHeaders();
      const res = await fetch('/api/interview/start', {
        method: 'POST',
        headers,
        body: JSON.stringify({ action: 'start', topic, stage: 'round1_behavioral', domainStream, opening: greeting })
      });
      const data = await res.json().catch(() => ({}));
      recordedId = typeof data?.liveSessionId === 'string' ? data.liveSessionId : null;
    } catch {}
    setLiveSessionId(recordedId);
    if (!recordedId) {
      toast.info('Practice interview', 'This interview could not be recorded on the server, so it will not earn XP or count as a capstone defense.');
    }

    setMessages([{ role: 'assistant', content: greeting }]);
    speakWithAvatar(greeting, sessionTeacher.id, () => setAnimState('talking'), () => setAnimState('idle'));
  };

  const exitInterview = () => {
    clearEliminationTimer();
    stopSpeaking();
    stopVoiceListening();
    stopCamera();
    setAnimState('idle');
    setIsInterviewActive(false);
    setActiveStage('round1_behavioral');
    setAssistData(null);
    clearDraft();
    const closingId = liveSessionIdRef.current;
    setLiveSessionId(null);

    // 🎮 Deactivate Fullscreen Gaming Mode on interview exit
    if (typeof window !== 'undefined') {
      try {
        const docAny = document as any;
        if (document.fullscreenElement || docAny.webkitFullscreenElement) {
          if (document.exitFullscreen) {
            document.exitFullscreen().catch(() => {});
          } else if (docAny.webkitExitFullscreen) {
            docAny.webkitExitFullscreen().catch(() => {});
          }
        }
      } catch {}
      (window as any).__pinitInterviewActive = false;
      window.dispatchEvent(new CustomEvent('pinit-interview-toggle', { detail: { active: false } }));
      document.body.removeAttribute('data-interview-active');
      document.documentElement.removeAttribute('data-gaming-mode');
    }

    // Notify server of session conclusion / cancellation
    try {
      getAuthHeaders().then(headers => {
        fetch('/api/interview/start', {
          method: 'POST',
          headers,
          body: JSON.stringify({ action: 'cancel', liveSessionId: closingId })
        }).catch(() => {});
      }).catch(() => {});
    } catch {}
  };

  const proceedToNextStage = async (next: Stage) => {
    if (next === 'results' || stageTransitionRef.current) return;
    stageTransitionRef.current = true;
    try {
    const nextTeacher = ROUND_INTERVIEWERS[next];
    setActiveTeacher(nextTeacher);
    setActiveStage(next);
    if (next === 'round2_coding') {
      setCodeReviewStarted(false);
      setCodeReviewQuestionReady(false);
      setCodeReviewAnswered(false);
      codeReviewQuestionPendingRef.current = false;
      setCodeRunFailed(false);
      setRound2Defense(createInitialDefenseState(2, domainStream === 'non_tech' ? 'case' : 'code'));
    }
    if (next === 'round3_systems') {
      setArchitectureDefenseAnswered(false);
      architectureQuestionPendingRef.current = false;
      setArchitectureEvaluation(null);
      setRound3Defense(createInitialDefenseState(3, domainStream === 'non_tech' ? 'workflow' : 'architecture'));
    }
    if (next === 'round4_star') {
      const r4Idx = messagesRef.current.length;
      round4StartMsgIndexRef.current = r4Idx;
      setRound4StartMsgIndex(r4Idx);
      setStarStep(0);
    }
    let stagePrompt = '';
    const companyRoundCue = selectedCompanyProfile ? ` We will evaluate this against ${selectedCompanyProfile.name}'s ${selectedCompanyProfile.interviewStyle} bar.` : '';
    if (next === 'round2_coding') {
      if (domainStream === 'non_tech') {
        const bcomCase = resolveCaseStudyData(activeTopicName);
        stagePrompt = buildConciseRoundIntro({
          roundNumber: 2,
          domainStream: 'non_tech',
          teacherName: nextTeacher.name,
          topic: activeTopicName,
          companyCue: companyRoundCue,
          problemTitle: bcomCase.company,
        });
      } else {
        void warmUpCodeRuntime(selectedLang);
        const prob = await fetchDynamicProblem(activeTopicName, domainStream, selectedLang, codingAttempt);
        stagePrompt = buildConciseRoundIntro({
          roundNumber: 2,
          domainStream: 'tech',
          teacherName: nextTeacher.name,
          topic: activeTopicName,
          companyCue: companyRoundCue,
          problemTitle: prob.title,
        });
      }
    } else if (next === 'round3_systems') {
      stagePrompt = buildConciseRoundIntro({
        roundNumber: 3,
        domainStream,
        teacherName: nextTeacher.name,
        topic: activeTopicName,
        companyCue: companyRoundCue,
      });
    } else if (next === 'round4_star') {
      const builtNodes = latestTopology?.nodes?.map((n: any) => n.label || n.type).join(', ') || (domainStream === 'non_tech' ? 'business workflow stages' : 'distributed tiers');
      stagePrompt = `Welcome to Round 4. I am ${nextTeacher.name}, your executive interviewer.${companyRoundCue} I have reviewed your background, your Round 2 solution, and your Round 3 design (${builtNodes}). Connect all three using concrete STAR evidence: why did you choose that approach, what trade-offs did it create, and what measurable impact did you achieve?`;
    }
    if (stagePrompt) {
      postLiveEvent('stage', next);
      setMessages(prev => [...prev, { role: 'assistant', content: stagePrompt }]);
      speakWithAvatar(stagePrompt, nextTeacher.id, () => setAnimState('talking'), () => setAnimState('idle'));
    }
    } finally {
      stageTransitionRef.current = false;
    }
  };

  const buildCurrentArtifactSummary = (stageTarget: Stage): string => {
    if (stageTarget === 'round2_coding') {
      const snippet = (codeContentRef.current || '').trim().slice(0, 1400);
      if (domainStream === 'non_tech') {
        const bcomCase = resolveCaseStudyData(activeTopicName);
        return `B.Com Case Study: ${bcomCase.company}\n${snippet || 'Submitted quantitative calculations & executive case memo.'}`;
      }
      return `Coding Challenge: ${currentCodingProb.title} (${selectedLangRef.current})\n${snippet || 'Submitted verified solution.'}`;
    }
    const topologyNodes = Array.isArray(latestTopology?.nodes) ? latestTopology.nodes : [];
    const topologyLinks = Array.isArray(latestTopology?.links) ? latestTopology.links : [];
    const nodesStr = topologyNodes.map((n: any) => n.label || n.type).filter(Boolean).join(', ');
    const linksStr = topologyLinks.map((l: any) => `${l.fromType} -> ${l.toType} (${l.protocol || 'flow'})`).join('; ');
    return `${domainStream === 'non_tech' ? 'Business Workflow' : 'System Architecture'} for ${activeTopicName} | Nodes (${topologyNodes.length}): ${nodesStr || 'none'} | Links (${topologyLinks.length}): ${linksStr || 'none'}`;
  };

  const finishInterviewRef = useRef<(opts?: { eliminatedInRound?: 2 | 3; eliminationReason?: string }) => Promise<void>>(async () => {});

  const triggerForcefulElimination = (roundNumber: 2 | 3, reason: string | undefined, spokenVerdict: string, teacherId: string) => {
    clearEliminationTimer();
    let ended = false;
    const concludeNow = () => {
      if (ended) return;
      ended = true;
      clearEliminationTimer();
      void finishInterviewRef.current({ eliminatedInRound: roundNumber, eliminationReason: reason });
    };
    speakWithAvatar(
      spokenVerdict,
      teacherId,
      () => setAnimState('talking'),
      () => {
        setAnimState('idle');
        eliminationTimerRef.current = setTimeout(concludeNow, 1200);
      }
    );
    // Safety net in case speech synthesis is muted or unavailable (generous 12s so full spoken verdict never cuts off)
    eliminationTimerRef.current = setTimeout(concludeNow, 12000);
  };

  const startDefenseCrossExam = async (
    roundNumber: 2 | 3,
    roundType: DefenseRoundType,
    artifactSummary: string,
    submissionNotice: string,
    prefixSpeech?: string
  ) => {
    if (isSendingInterviewMessageRef.current) return;
    isSendingInterviewMessageRef.current = true;
    setIsSendingInterviewMessage(true);
    stopVoiceListening();
    const targetStage: Stage = roundNumber === 2 ? 'round2_coding' : 'round3_systems';
    const teacher = ROUND_INTERVIEWERS[targetStage];
    const baseMsgs: Message[] = [...messagesRef.current, { role: 'user', content: submissionNotice }];
    setMessages(baseMsgs);

    let q1Text = '';
    try {
      const headers = await getAuthHeaders();
      const res = await fetch('/api/interview/chat', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          liveSessionId: liveSessionIdRef.current,
          message: submissionNotice,
          interviewerId: teacher.id,
          stage: targetStage,
          history: baseMsgs,
          difficulty,
          customTopic: activeTopicName,
          domainStream,
          domainSubTopic: activeTopicName,
          jdContext: jdPromptContext,
          companyContext,
          topologyContext: roundNumber === 3 ? artifactSummary : undefined,
          defenseMode: {
            phase: 'start',
            questionNumber: 1,
            totalQuestions: 5,
            roundType,
            artifactSummary,
          },
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data?.reply) {
        q1Text = sanitizeLLMOutput(data.reply);
      }
    } catch {}

    if (!q1Text) {
      q1Text = getFallbackDefenseQuestion({
        roundType,
        questionNumber: 1,
        topic: activeTopicName,
        artifactHint: artifactSummary.slice(0, 80),
      });
    }

    const fullOpening = prefixSpeech ? `${prefixSpeech} ${q1Text}` : q1Text;
    const started = startRoundDefense(roundNumber, roundType, q1Text);
    if (roundNumber === 2) {
      setRound2Defense(started);
      codeReviewQuestionPendingRef.current = true;
      setCodeReviewQuestionReady(true);
      setCodeReviewAnswered(false);
    } else {
      setRound3Defense(started);
      architectureQuestionPendingRef.current = true;
      setArchitectureDefenseAnswered(false);
    }

    setMessages([...baseMsgs, { role: 'assistant', content: fullOpening }]);
    speakWithAvatar(fullOpening, teacher.id, () => setAnimState('talking'), () => setAnimState('idle'));
    isSendingInterviewMessageRef.current = false;
    setIsSendingInterviewMessage(false);
  };

  const handleSendMessageWithText = async (text: string) => {
    if (!text.trim() || isSendingInterviewMessageRef.current) return;
    const isSkipTurn = SKIP_TURN_REGEX.test(text.trim());
    const activeRound2Defense = activeStage === 'round2_coding' && round2DefenseRef.current.status === 'in_progress'
      ? round2DefenseRef.current
      : null;
    const activeRound3Defense = activeStage === 'round3_systems' && round3DefenseRef.current.status === 'in_progress'
      ? round3DefenseRef.current
      : null;
    const activeDefense = activeRound2Defense || activeRound3Defense;
    const answeringCodeReview = activeStage === 'round2_coding' && codeReviewQuestionPendingRef.current && !activeDefense;
    const answeringArchitectureQuestion = activeStage === 'round3_systems' && architectureQuestionPendingRef.current && !activeDefense;
    isSendingInterviewMessageRef.current = true;
    setIsSendingInterviewMessage(true);
    stopVoiceListening();
    const newMsgs: Message[] = [...messagesRef.current, { role: 'user', content: text.trim() }];
    setMessages(newMsgs);

    try {
      const headers = await getAuthHeaders();
      const topologyNodes = Array.isArray(latestTopology?.nodes) ? latestTopology.nodes : [];
      const topologyLinks = Array.isArray(latestTopology?.links) ? latestTopology.links : [];
      const topologyContext = activeStage === 'round3_systems'
        ? (topologyNodes.length > 0
            ? `Nodes (${topologyNodes.length}): ${topologyNodes.map((n: any) => n.label || n.type).filter(Boolean).join(', ')}; Links: ${topologyLinks.length}`
            : 'Empty whiteboard (0 nodes placed yet)')
        : undefined;
      const artifactSummary = activeDefense ? buildCurrentArtifactSummary(activeStage) : undefined;
      const res = await fetch('/api/interview/chat', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          liveSessionId: liveSessionIdRef.current,
          message: text.trim(),
          interviewerId: activeTeacher.id,
          stage: activeStage,
          history: newMsgs,
          difficulty,
          customTopic: activeTopicName,
          domainStream,
          domainSubTopic: activeTopicName,
          reviewDecision: answeringCodeReview,
          defenseMode: activeDefense
            ? {
                phase: 'answer',
                questionNumber: activeDefense.currentQuestionNumber,
                totalQuestions: activeDefense.totalQuestions,
                roundType: activeDefense.roundType,
                artifactSummary,
              }
            : undefined,
          jdContext: jdPromptContext,
          companyContext,
          topologyContext,
          telemetry: {
            eyeContact: typeof eyeContactScore === 'number' ? eyeContactScore : undefined,
            wpm: typeof wpmScore === 'number' && wpmScore > 0 ? wpmScore : undefined,
            fillerWords: (typeof wpmScore === 'number' && wpmScore > 0) || fillerWordCount > 0 ? fillerWordCount : undefined,
            tabSwitches: tabSwitchCount
          }
        })
      });
      const data = await res.json();
      if (res.status === 409) {
        setLiveSessionId(null);
        toast.error('Interview ended', data?.message || 'This interview can no longer continue. Please start a new one.');
        return;
      }
      if (!res.ok) throw new Error(data?.message || `The interviewer request failed (${res.status}).`);
      const cleanReply = sanitizeLLMOutput(data?.reply);
      if (!cleanReply) throw new Error('The interviewer returned an empty reply.');

      // ── 5-Question Post-Submission Defense Progression (Round 2 & Round 3, Tech & B.Com) ──
      if (activeDefense) {
        const llmGrade: 'PASS' | 'FAIL' | null =
          data?.defenseGrade === 'PASS' ? 'PASS' : data?.defenseGrade === 'FAIL' ? 'FAIL' : null;
        const evalTurn = evaluateDefenseTurnPass(text.trim(), llmGrade);
        const nextDefense = advanceRoundDefense(
          activeDefense,
          text.trim(),
          evalTurn.passed,
          evalTurn.reason,
          cleanReply
        );

        if (activeDefense.roundNumber === 2) {
          setRound2Defense(nextDefense);
        } else {
          setRound3Defense(nextDefense);
        }

        if (nextDefense.status === 'in_progress') {
          setMessages([...newMsgs, { role: 'assistant', content: cleanReply }]);
          speakWithAvatar(cleanReply, activeTeacher.id, () => setAnimState('talking'), () => setAnimState('idle'));
        } else if (nextDefense.status === 'passed') {
          const passSpeech = buildDefenseFinalVerdictSpeech(nextDefense);
          setMessages([...newMsgs, { role: 'assistant', content: passSpeech }]);
          speakWithAvatar(passSpeech, activeTeacher.id, () => setAnimState('talking'), () => setAnimState('idle'));
          if (nextDefense.roundNumber === 2) {
            codeReviewQuestionPendingRef.current = false;
            setCodeReviewQuestionReady(false);
            setCodeReviewAnswered(true);
          } else {
            architectureQuestionPendingRef.current = false;
            setArchitectureDefenseAnswered(true);
          }
        } else {
          // ELIMINATED: Did not pass all 5 defense questions — avatar announces rejection & forcefully ends session!
          const failSpeech = buildDefenseFinalVerdictSpeech(nextDefense);
          setMessages([...newMsgs, { role: 'assistant', content: failSpeech }]);
          if (nextDefense.roundNumber === 2) {
            codeReviewQuestionPendingRef.current = false;
            setCodeReviewQuestionReady(false);
            setCodeReviewAnswered(false);
          } else {
            architectureQuestionPendingRef.current = false;
            setArchitectureDefenseAnswered(false);
          }
          toast.error(
            `Did Not Advance Past Round ${nextDefense.roundNumber}`,
            nextDefense.eliminationReason || 'You did not clear all 5 defense questions.'
          );
          triggerForcefulElimination(nextDefense.roundNumber, nextDefense.eliminationReason, failSpeech, activeTeacher.id);
        }
        return;
      }

      if (activeStage === 'round4_star' && !isSkipTurn) setStarStep(prev => prev + 1);
      setMessages([...newMsgs, { role: 'assistant', content: cleanReply }]);
      speakWithAvatar(cleanReply, activeTeacher.id, () => setAnimState('talking'), () => setAnimState('idle'));
      if (activeStage === 'round2_coding' && codeSubmitted && !answeringCodeReview) {
        codeReviewQuestionPendingRef.current = true;
        setCodeReviewQuestionReady(true);
      }
      if (answeringCodeReview && isSkipTurn) {
        codeReviewQuestionPendingRef.current = false;
        setCodeReviewQuestionReady(false);
        setCodeReviewStarted(false);
      } else if (answeringCodeReview && !isSkipTurn && data?.roundVerdict === 'PASS') {
        codeReviewQuestionPendingRef.current = false;
        setCodeReviewQuestionReady(false);
        setCodeReviewAnswered(true);
      } else if (answeringCodeReview && !isSkipTurn) {
        codeReviewQuestionPendingRef.current = false;
        setCodeReviewQuestionReady(false);
        setCodeReviewAnswered(false);
        setCodeReviewStarted(false);
        setCodeRunFailed(true);
      }
      if (answeringArchitectureQuestion && isSkipTurn) {
        architectureQuestionPendingRef.current = false;
      } else if (answeringArchitectureQuestion && !isSkipTurn) {
        architectureQuestionPendingRef.current = false;
        setArchitectureDefenseAnswered(true);
      }
    } catch {
      if (activeDefense) {
        // Offline deterministic fallback keeps the 5-question defense running without losing progress
        const evalTurn = evaluateDefenseTurnPass(text.trim(), null);
        const nextNum = activeDefense.currentQuestionNumber + 1;
        const fallbackQ = nextNum <= activeDefense.totalQuestions
          ? getFallbackDefenseQuestion({
              roundType: activeDefense.roundType,
              questionNumber: nextNum,
              topic: activeTopicName,
            })
          : undefined;
        const nextDefense = advanceRoundDefense(activeDefense, text.trim(), evalTurn.passed, evalTurn.reason, fallbackQ);
        if (activeDefense.roundNumber === 2) setRound2Defense(nextDefense);
        else setRound3Defense(nextDefense);

        if (nextDefense.status === 'in_progress' && fallbackQ) {
          setMessages([...newMsgs, { role: 'assistant', content: fallbackQ }]);
          speakWithAvatar(fallbackQ, activeTeacher.id, () => setAnimState('talking'), () => setAnimState('idle'));
        } else if (nextDefense.status === 'passed') {
          const passSpeech = buildDefenseFinalVerdictSpeech(nextDefense);
          setMessages([...newMsgs, { role: 'assistant', content: passSpeech }]);
          speakWithAvatar(passSpeech, activeTeacher.id, () => setAnimState('talking'), () => setAnimState('idle'));
          if (nextDefense.roundNumber === 2) {
            codeReviewQuestionPendingRef.current = false;
            setCodeReviewQuestionReady(false);
            setCodeReviewAnswered(true);
          } else {
            architectureQuestionPendingRef.current = false;
            setArchitectureDefenseAnswered(true);
          }
        } else {
          const failSpeech = buildDefenseFinalVerdictSpeech(nextDefense);
          setMessages([...newMsgs, { role: 'assistant', content: failSpeech }]);
          triggerForcefulElimination(nextDefense.roundNumber, nextDefense.eliminationReason, failSpeech, activeTeacher.id);
        }
        return;
      }
      const fallback = answeringArchitectureQuestion
        ? 'I could not review that defense because the connection failed. Please send your explanation again.'
        : answeringCodeReview
          ? 'I could not review that answer because the connection failed. Please resubmit your solution for review.'
          : activeStage === 'round4_star'
            ? 'I could not review that answer because the connection failed. Please send it again when you are ready.'
            : 'I’m having trouble connecting right now. Please try your response again when the interviewer is back online.';
      setMessages([...newMsgs, { role: 'assistant', content: fallback }]);
      speakWithAvatar(fallback, activeTeacher.id, () => setAnimState('talking'), () => setAnimState('idle'));
      if (activeStage === 'round2_coding' && codeSubmitted) {
        codeReviewQuestionPendingRef.current = false;
        setCodeReviewQuestionReady(false);
        setCodeReviewStarted(false);
      }
      if (answeringCodeReview) {
        codeReviewQuestionPendingRef.current = false;
        setCodeReviewQuestionReady(false);
        setCodeReviewAnswered(false);
        setCodeReviewStarted(false);
        setCodeRunFailed(false);
      }
      if (answeringArchitectureQuestion) {
        architectureQuestionPendingRef.current = true;
        setArchitectureDefenseAnswered(false);
      }
      if (activeStage === 'round4_star') {
        toast.error('Answer was not reviewed', 'The interviewer could not connect. Please send your answer again.');
      }
    } finally {
      isSendingInterviewMessageRef.current = false;
      setIsSendingInterviewMessage(false);
    }
  };
  handleSendMessageWithTextRef.current = handleSendMessageWithText;

  // The code the student submits is recorded in the server's interview record, so the evaluator
  // judges the code itself (the in-browser test run below is feedback for the student only).
  const lastRecordedCodeRef = useRef('');
  const recordCodeSubmission = async () => {
    const id = liveSessionIdRef.current;
    const code = codeContentRef.current.trim();
    if (!id || !code || !codeModifiedRef.current || code === lastRecordedCodeRef.current) return;
    try {
      const headers = await getAuthHeaders();
      const res = await fetch('/api/interview/chat', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          liveSessionId: id,
          event: 'code',
          stage: 'round2_coding',
          code,
          language: domainStream === 'non_tech' ? 'case_study' : selectedLangRef.current,
          problemTitle: domainStream === 'non_tech'
            ? resolveCaseStudyData(activeTopicName).company
            : (dynamicProblemData?.title || getDynamicCodingProblem(activeTopicName, selectedLangRef.current).title),
        }),
      });
      if (!res.ok) throw new Error(`Code recording failed (${res.status}).`);
      lastRecordedCodeRef.current = code;
    } catch (error) {
      console.warn('[Interview] Could not record the submitted code:', error);
    }
  };

  const runCodeAndTests = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setCodeRunFailed(false);
    setCodeSubmitted(false);

    // Non-Tech / B.Com Case Study submission: NEVER run the Python/JS compiler on a financial case memo!
    // Automatically launches the 5-question panel cross-examination directly on the submitted case desk.
    if (domainStream === 'non_tech') {
      try {
        void recordCodeSubmission();
        setCodeRunFailed(false);
        setCodeSubmitted(true);
        setCodeReviewStarted(true);
        setCodeReviewAnswered(false);
        const caseSummary = buildCurrentArtifactSummary('round2_coding');
        const caseTitle = resolveCaseStudyData(activeTopicName).company;
        void startDefenseCrossExam(
          2,
          'case',
          caseSummary,
          `I have submitted my B.Com corporate case desk for "${caseTitle}". Please begin my 5-question panel cross-examination based on my journal entry, ratios, and board recommendation.`
        );
      } finally {
        setIsRunning(false);
      }
      return;
    }

    setTerminalLogs([`[RUNNER] Compiling ${selectedLang.toUpperCase()} for ${activeTopicName}...`]);
    try {
      const resolvedProb = getDynamicCodingProblem(activeTopicName, selectedLang);
      let fnName = dynamicProblemData?.functionName ||
                   resolvedProb?.functionName ||
                   /def\s+([a-zA-Z0-9_]+)/.exec(codeContent)?.[1] ||
                   /function\s+([a-zA-Z0-9_]+)/.exec(codeContent)?.[1] ||
                   /(?:const|let|var)\s+([a-zA-Z0-9_]+)\s*=/.exec(codeContent)?.[1] ||
                   /(?:public|private|static)?\s*(?:[\w<>\[\]]+\s+)+([a-zA-Z0-9_]+)\s*\(/.exec(codeContent)?.[1] ||
                   'evaluateSolution';
      if (
        fnName.includes('_') &&
        (selectedLang === 'javascript' ||
          ((selectedLang === 'java' || selectedLang === 'cpp') && !codeContent.includes(fnName)))
      ) {
        fnName = fnName.replace(/_([a-z0-9])/g, (_: string, c: string) => c.toUpperCase());
      }
      const generatedTestCases = Array.isArray(dynamicProblemData?.testCases) && dynamicProblemData.testCases.length > 0
        ? dynamicProblemData.testCases
        : (Array.isArray(resolvedProb?.testCases) && resolvedProb.testCases.length > 0 ? resolvedProb.testCases : null);
      const testCases = (generatedTestCases || [
        { input: '([10, 20, 30, 40], 25)', output: '2', expectedOutput: '2', name: '[T1: Standard] Nominal throughput check', tier: 'standard', tierLabel: 'T1: Standard' },
        { input: '([100, 200, 300, 400, 500, 600, 700, 800, 900, 1000], 500)', output: '5', expectedOutput: '5', name: '[T2: Scale] Throughput burst sequence', tier: 'scale', tierLabel: 'T2: Scale' },
        { input: '([], 0)', output: '0', expectedOutput: '0', name: '[T3: Zero/Empty] Empty sequence zero-check', tier: 'zero_empty', tierLabel: 'T3: Zero/Empty' },
        { input: '([-50, -20, 0, 10], -10)', output: '2', expectedOutput: '2', name: '[T4: Edge/Negative] Negative values boundary', tier: 'edge_case', tierLabel: 'T4: Edge/Negative' },
        { input: '([15, 15, 15, 15], 15)', output: '0', expectedOutput: '0', name: '[T5: Complexity Bounds] Strict inequality boundary', tier: 'complexity', tierLabel: 'T5: Complexity' }
      ]).map((testCase: any) => ({
        ...testCase,
        output: String(testCase.output ?? testCase.expectedOutput ?? ''),
        expectedOutput: String(testCase.expectedOutput ?? testCase.output ?? '')
      }));
      const result = await runTestSuite(codeContent, selectedLang as any, {
        functionName: fnName,
        testCases,
        testSuite: selectedLang === 'sql'
          ? (dynamicProblemData?.testSuite || resolvedProb.testSuite)
          : undefined,
        timeoutMs: 5000
      });
      setLatestTestOutcomes(result.testOutcomes || []);
      setTerminalLogs(prev => [...prev, ...result.terminalLogs]);
      void recordCodeSubmission();
      if (result.testOutcomes && result.testOutcomes.length > 0) {
        setTerminalLogs(prev => [
          ...prev,
          '\n--- 5-TIER BOUNDARY EVALUATION RESULTS ---',
          ...result.testOutcomes.map((o, idx) => {
            const mark = o.passed ? '✅' : '❌';
            const name = o.testCaseName || `Tier ${idx + 1}`;
            return `  ${mark} ${name}: ${o.passed ? 'PASSED' : `FAILED (Expected ${o.expectedOutput}, got ${o.actualOutput || 'error'})`}`;
          })
        ]);
      }
      const codeIsUnchanged = codeContentRef.current === codeContent && selectedLangRef.current === selectedLang;
      setCodeRunFailed(!result.allPassed || !codeIsUnchanged);
      if (result.allPassed && codeIsUnchanged) {
        setCodeSubmitted(true);
        setTerminalLogs(prev => [...prev, `\n✅ [PASSED] All ${result.passedTests} boundary tiers verified!`]);
      } else {
        setCodeSubmitted(false);
        if (result.allPassed) {
          setTerminalLogs(prev => [...prev, '\n⚠️ Code or language changed during execution. Run tests again for the current solution.']);
        }
      }
    } catch (e: any) {
      setCodeRunFailed(true);
      setTerminalLogs(prev => [...prev, `[ERROR] Execution failed: ${e?.message || 'Syntax error'}`]);
    } finally {
      setIsRunning(false);
    }
  };

  const reviewCodingSolution = () => {
    if (!codeSubmitted || codeReviewStarted || round2DefenseRef.current.status === 'in_progress') return;
    setCodeReviewStarted(true);
    setCodeReviewQuestionReady(false);
    setCodeReviewAnswered(false);
    codeReviewQuestionPendingRef.current = false;
    const roundType: DefenseRoundType = domainStream === 'non_tech' ? 'case' : 'code';
    const artifactSummary = buildCurrentArtifactSummary('round2_coding');
    const submissionNotice = domainStream === 'non_tech'
      ? `I have submitted my corporate case desk for "${resolveCaseStudyData(activeTopicName).company}". Please start my 5-question panel cross-examination.`
      : `I have completed the ${currentCodingProb.title} challenge in ${selectedLang} and passed all boundary tests. Please start my 5-question code defense.`;
    void recordCodeSubmission();
    void startDefenseCrossExam(2, roundType, artifactSummary, submissionNotice);
  };

  const retryWithNewCodingChallenge = () => {
    setCodeReviewStarted(false);
    setCodeReviewQuestionReady(false);
    setCodeReviewAnswered(false);
    codeReviewQuestionPendingRef.current = false;
    setRound2Defense(createInitialDefenseState(2, domainStream === 'non_tech' ? 'case' : 'code'));
    setCodeSubmitted(false);
    setCodeRunFailed(false);
    setCodeContent('');
    setTerminalLogs([]);
    setLatestTestOutcomes([]);
    setDynamicProblemData(null);
    codeModifiedRef.current = false;
    codePerLangRef.current = {};
    lastRecordedCodeRef.current = '';
    const nextAttempt = codingAttempt + 1;
    setCodingAttempt(nextAttempt);
    void fetchDynamicProblem(activeTopicName, domainStream, selectedLang, nextAttempt);
  };

  const handleRequestCodingHint = (level: 1 | 2 | 3) => {
    const prob = getDynamicCodingProblem(activeTopicName, selectedLang);
    const tierPrompt =
      level === 1
        ? `Tier 1 gentle structural direction hint (NO code) for coding problem "${prob.title}": ${prob.description}`
        : level === 2
        ? `Tier 2 algorithm & data-structure time/space complexity hint (NO code) for "${prob.title}" in ${selectedLang}`
        : `Tier 3 invariant & boundary edge-case walkthrough hint (NO code) for "${prob.title}": ${prob.description}`;
    setIsAssistModeActive(true);
    setAssistTab('bullets');
    void fetchAssistScript(tierPrompt, level === 3 ? 'advanced' : assistScriptLevel, 'round2_coding', true);
  };

  const analyzeSystemArchitecture = async () => {
    setIsAnalyzingArchitecture(true);
    try {
      const headers = await getAuthHeaders();
      const res = await fetch('/api/interview/evaluate', {
        method: 'POST',
        headers,
        body: JSON.stringify({ type: 'systems', topology: latestTopology, domainStream, domainSubTopic: activeTopicName })
      });
      if (!res.ok) throw new Error(`Architecture review failed (${res.status}).`);
      if (res.ok) {
        const data = await res.json();
        if (!data?.evaluation) throw new Error('Architecture review returned no evaluation.');
        setArchitectureEvaluation(data.evaluation);
        const nodeCount = Array.isArray(latestTopology?.nodes) ? latestTopology.nodes.length : 0;
        const evalScore = Number(data.evaluation?.score || 0);
        const defaultFeedback = domainStream === 'non_tech'
          ? `Business workflow scored ${evalScore}/100 (${data.evaluation?.verdict || 'reviewed'}).`
          : `Architecture scored ${evalScore}/100 (${data.evaluation?.verdict || 'reviewed'}).`;
        const feedbackIntro = data.evaluation?.spokenFeedback || defaultFeedback;

        if (nodeCount > 0 && evalScore >= 60) {
          // Canvas meets the 60/100 bar -> launch the 5-question cross-examination!
          const roundType: DefenseRoundType = domainStream === 'non_tech' ? 'workflow' : 'architecture';
          const artifactSummary = buildCurrentArtifactSummary('round3_systems');
          const submissionNotice = domainStream === 'non_tech'
            ? `I have built and evaluated my ${activeTopicName} business workflow (${nodeCount} stages, ${evalScore}/100). Please start my 5-question workflow defense.`
            : `I have built and evaluated my ${activeTopicName} system architecture (${nodeCount} nodes, ${evalScore}/100). Please start my 5-question architecture defense.`;
          void startDefenseCrossExam(3, roundType, artifactSummary, submissionNotice, feedbackIntro);
        } else {
          // Canvas blank or below 60/100 -> ask candidate to improve canvas before defense begins
          setArchitectureDefenseAnswered(false);
          architectureQuestionPendingRef.current = false;
          setRound3Defense(createInitialDefenseState(3, domainStream === 'non_tech' ? 'workflow' : 'architecture'));
          const repairPrompt = `${feedbackIntro} Please address the bottlenecks on the canvas and re-evaluate to reach at least 60 out of 100 before we start the 5-question defense.`;
          setMessages(prev => [...prev, { role: 'assistant', content: repairPrompt }]);
          speakWithAvatar(repairPrompt, ROUND_INTERVIEWERS.round3_systems.id, () => setAnimState('talking'), () => setAnimState('idle'));
        }
      }
    } catch {
      toast.error(
        domainStream === 'non_tech' ? 'Workflow review unavailable' : 'Architecture review unavailable',
        domainStream === 'non_tech'
          ? 'Your canvas is still saved. Check your connection and try Evaluate Workflow again.'
          : 'Your canvas is still saved. Check your connection and try Evaluate Architecture again.'
      );
    } finally {
      setIsAnalyzingArchitecture(false);
    }
  };

  const lastTopologySignatureRef = useRef<string>('');
  const handleTopologyChange = useCallback((topology: any) => {
    setLatestTopology(topology);
    const sig = JSON.stringify({
      nodes: (topology?.nodes || []).map((n: any) => `${n.id}:${n.type}:${n.label}`),
      links: (topology?.links || []).map((l: any) => `${l.fromType}->${l.toType}:${l.protocol}`)
    });
    if (sig !== lastTopologySignatureRef.current) {
      lastTopologySignatureRef.current = sig;
      setArchitectureEvaluation(null);
      setArchitectureDefenseAnswered(false);
      architectureQuestionPendingRef.current = false;
      if (round3DefenseRef.current.status !== 'eliminated') {
        setRound3Defense(createInitialDefenseState(3, domainStream === 'non_tech' ? 'workflow' : 'architecture'));
      }
    }
  }, [domainStream, setRound3Defense]);

  const finishingRef = useRef(false);
  const finishInterview = async (opts?: { eliminatedInRound?: 2 | 3; eliminationReason?: string }) => {
    if (finishingRef.current) return;
    finishingRef.current = true;
    clearEliminationTimer();
    setIsEvaluating(true);
    stopSpeaking();
    stopVoiceListening();
    stopCamera();
    setIsAssistModeActive(false);
    if (typeof document !== 'undefined') {
      try {
        if (document.fullscreenElement) {
          document.exitFullscreen?.().catch(() => {});
        }
      } catch {}
    }
    const archetype: MindsetArchetype = cOS?.onboardingAnswers?.mindset_archetype || (user as any)?.mindset_archetype || 'Pattern Hunter';
    const finalMessages = messagesRef.current;

    const evalResult = computeDeterministicEvaluation({
      messages: finalMessages,
      codeSubmitted,
      latestTopology,
      starStep,
      fillerWordCount,
      eyeContactScore,
      wpmScore,
      activeTopicName,
      domainStream,
      archetype,
      tabSwitchCount,
      selectedLang,
      codeContent: codeContentRef.current,
      eliminatedInRound: opts?.eliminatedInRound,
      eliminationReason: opts?.eliminationReason,
    });

    setEvaluationResult(evalResult);
    setActiveStage('results');

    // Make sure the final version of the code is in the record before it is scored.
    await recordCodeSubmission();
    let resultObj: any = evalResult;
    let serverEvaluated = false;
    const fullCompanyContext = buildCompanyPromptContext(selectedCompanyProfile, 'results');
    try {
      const headers = await getAuthHeaders();
      const res = await fetch('/api/interview/evaluate', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          history: finalMessages,
          codingScore: evalResult.solvingScore,
          domainStream,
          domainSubTopic: activeTopicName,
          roleKey: activeTopicName,
          selectedLang,
          jdContext: jdPromptContext,
          companyContext: fullCompanyContext,
          liveSessionId: liveSessionIdRef.current,
          archetype,
          topology: latestTopology,
          telemetry: {
            eyeContact: typeof eyeContactScore === 'number' ? eyeContactScore : undefined,
            wpm: typeof wpmScore === 'number' && wpmScore > 0 ? wpmScore : undefined,
            fillerWords: (typeof wpmScore === 'number' && wpmScore > 0) || fillerWordCount > 0 ? fillerWordCount : undefined,
            tabSwitches: tabSwitchCount
          }
        })
      });
      const data = await res.json();
      if (data?.evaluation) {
        serverEvaluated = true;
        resultObj = {
          ...evalResult,
          ...data.evaluation,
          verdict: opts?.eliminatedInRound ? evalResult.verdict : data.evaluation.verdict,
          readiness: opts?.eliminatedInRound ? evalResult.readiness : data.evaluation.readiness,
          summary: opts?.eliminatedInRound ? evalResult.summary : data.evaluation.summary,
          eliminatedInRound: opts?.eliminatedInRound,
          eliminationReason: opts?.eliminationReason,
          evaluationToken: data.evaluationToken,
          topicEvaluationToken: data.topicEvaluationToken,
          xpAwarded: data.xpAwarded,
          newXp: data.newXp,
          perRoundScores: data.evaluation.perRoundScores || evalResult.perRoundScores,
          roundReports: evalResult.roundReports
        };
      }
    } catch {}

    setIsEvaluating(false);
    if (!serverEvaluated) {
      toast.info('Local Rubric Used', 'AI grading service was temporarily unreachable, so your scorecard was calculated using the deterministic rubric.');
    }
    setEvaluationResult(resultObj);
    clearDraft();
    setLiveSessionId(null); // scored: the server record is closed

    // Roadmap capstone: keep the result on the project (the next step, the certificate, needs it).
    if (capstone && activeTopicName === capstone.topic) {
      const saved = getSavedCareerProjects(onboardingAnswers as Record<string, unknown> | undefined);
      saveCareerProjects(recordCapstoneInterview(saved, capstone.projectId, {
        score: resultObj.score,
        verdict: resultObj.verdict,
        completedAt: new Date().toISOString(),
        evaluationToken: resultObj.evaluationToken,
        topic: capstone.topic,
        topicEvaluationToken: resultObj.topicEvaluationToken,
      }));
    }
    // Certificate course: send the signed defense result to the server, which records Sprint 4.
    if (courseDefense && activeTopicName === courseDefense.topic) {
      try {
        const headers = await getAuthHeaders();
        const res = await fetch('/api/quests/capstone', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            enrollmentId: courseDefense.enrollmentId,
            sprint: 4,
            score: resultObj.score,
            verdict: resultObj.verdict,
            topicToken: resultObj.topicEvaluationToken,
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (res.ok && data?.approved) {
          toast.success('Capstone complete', 'Your defense is recorded. Get your certificate from your course page.');
        } else if (res.ok) {
          toast.info('Capstone defense recorded', data?.message || 'Not passed yet. You can take the defense again.');
        } else {
          toast.error('Capstone defense not recorded', data?.message || 'Please try again.');
        }
      } catch {
        toast.error('Capstone defense not recorded', 'Could not reach the server. Please try again.');
      }
    }
    // The server grants the interview XP when it evaluates a pass (max 3 a day); show what it granted.
    if (typeof resultObj.xpAwarded === 'number' && resultObj.xpAwarded > 0) {
      applyServerXp(resultObj.newXp, resultObj.xpAwarded, 'Completed AI Interview');
    }
    // Award +3 Trust Score for completing the AI Interview (baseline 50, max 100)
    applyTrustReward(user?.id, 'interview').catch(() => {});
    // Interview verdict recorded; pins are not earned via gameplay

    const { dateStr, isoStr } = safeFormatDate();
    const sessionRecord: InterviewSessionRecord = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `sess-${Date.now()}`,
      evaluationToken: resultObj.evaluationToken,
      date: dateStr,
      timestamp: isoStr,
      type: `${domainStream === 'non_tech' ? 'Non-Tech' : 'Tech'}: ${activeTopicName}`,
      domainStream,
      domainSubTopic: activeTopicName,
      difficulty,
      verdict: resultObj.verdict,
      score: resultObj.score,
      radar: resultObj.radar,
      telemetry: {
        eyeContact: typeof eyeContactScore === 'number' ? eyeContactScore : null,
        wpm: typeof wpmScore === 'number' ? wpmScore : null,
        fillerWords: typeof fillerWordCount === 'number' ? fillerWordCount : null,
        tabSwitches: tabSwitchCount
      },
      messages: finalMessages,
      summary: resultObj.summary || '',
      strengths: Array.isArray(resultObj.strengths) ? resultObj.strengths : [resultObj.strengths || 'Good effort'],
      improvements: Array.isArray(resultObj.improvements) ? resultObj.improvements.join('. ') : (resultObj.improvements || ''),
      topology: latestTopology || null,
      targetCompany: selectedCompanyProfile?.name || targetCompany || '',
      defendedTechStack: Array.isArray(resultObj.defendedTechStack) ? resultObj.defendedTechStack : [],
      questionBreakdown: Array.isArray(resultObj.questionBreakdown) ? resultObj.questionBreakdown : [],
      answerQuality: resultObj.answerQuality || null
    };

    saveSessionHistory(sessionRecord);

    if (resultObj.score >= 65) {
      try {
        PathwayApiService.recordEvidence({
          id: `ev_interview_${sessionRecord.id}`,
          competencyId: domainStream === 'non_tech' ? 'comp_comm_star_interview_l2' : 'comp_production_engineering_residency_l5',
          competencyVersion: '1.0.0',
          studentId: user?.id || 'student_defense_id',
          programId: 'prog_swe_accelerated_9m',
          evidenceClass: 'defense',
          difficulty: difficulty === 'hard' ? 'production' : difficulty === 'normal' ? 'advanced' : 'intermediate',
          evidenceFamilyId: `interview_${activeTopicName.toLowerCase().replace(/\s+/g, '_')}`,
          sourceType: 'capstone_defense',
          sourceId: sessionRecord.id,
          attemptId: `att_${sessionRecord.id}`,
          score: Math.min(100, Math.max(65, resultObj.score)),
          evaluatorType: 'ai',
          evaluatorVersion: 'vroid-ai-interviewer-v2',
          rubricVersion: 'rubric-star-defense-v1',
          timestamp: Date.now(),
          artifacts: { executionLogSnippet: `Verdict: ${resultObj.verdict} (${resultObj.score}%)` }
        }).catch(() => {});
      } catch {}
    }
  };
  finishInterviewRef.current = finishInterview;

  const handleSkipRound = async () => {
    if (
      stageTransitionRef.current ||
      finishingRef.current ||
      round2DefenseRef.current.status === 'eliminated' ||
      round3DefenseRef.current.status === 'eliminated'
    ) return;
    stopSpeaking();
    isSendingInterviewMessageRef.current = false;
    setIsSendingInterviewMessage(false);
    codeReviewQuestionPendingRef.current = false;
    architectureQuestionPendingRef.current = false;

    postLiveEvent('skip', activeStage);
    setMessages(prev => [...prev, { role: 'user', content: '[Candidate skipped round]' }]);

    if (activeStage === 'round1_behavioral') {
      toast.info('Round 1 Skipped', 'Advancing directly to Round 2.');
      await proceedToNextStage('round2_coding');
    } else if (activeStage === 'round2_coding') {
      toast.info('Round 2 Skipped', 'Advancing directly to Round 3.');
      await proceedToNextStage('round3_systems');
    } else if (activeStage === 'round3_systems') {
      toast.info('Round 3 Skipped', 'Advancing directly to Round 4 Deep Dive.');
      await proceedToNextStage('round4_star');
    } else if (activeStage === 'round4_star') {
      toast.info('Round 4 Skipped', 'Finalizing your interview scorecard.');
      await finishInterview();
    }
  };

  const exportInterviewTranscript = (format: 'markdown' | 'json' | 'pdf' = 'markdown') => {
    exportInterviewTranscriptFile({
      format, activeTopicName, domainStream,
      teacherName: activeTeacher.name,
      evaluationResult, eyeContactScore, wpmScore, fillerWordCount,
      codeContent, selectedLang, latestTopology, messages,
      tabSwitchCount
    });
  };

  const lastInterviewerSpeech = useMemo(() => {
    const assistantMsgs = messages.filter(m => m.role === 'assistant');
    return assistantMsgs.length > 0 ? assistantMsgs[assistantMsgs.length - 1].content : 'Welcome to your interview!';
  }, [messages]);

  const userResponses = useMemo(
    () => messages.filter(m => m.role === 'user' && !SKIP_TURN_REGEX.test(m.content.trim())),
    [messages]
  );

  const hasSubstantiveRound1 = useMemo(() => {
    const substantiveTurns = userResponses.filter(m => m.content.trim().split(/\s+/).filter(Boolean).length >= 10);
    return substantiveTurns.length >= 2 || userResponses.length >= 3;
  }, [userResponses]);

  const starCoverage = useMemo(() => {
    const startIdx = round4StartMsgIndex || round4StartMsgIndexRef.current;
    const scopedMsgs = startIdx > 0 && startIdx < messages.length
      ? messages.slice(startIdx).filter(m => m.role === 'user' && !SKIP_TURN_REGEX.test(m.content.trim()))
      : userResponses;
    const allText = scopedMsgs.map(m => m.content.toLowerCase()).join(' ');
    const hasS = /situation|context|problem|challenge|project|working on|scenario/.test(allText);
    const hasT = /task|goal|needed to|objective|responsible|requirement|deliverable/.test(allText);
    const hasA = /action|i built|i implemented|i designed|i created|i refactored|i led|i used|i engineered|i audited|i reconciled|i calculated|i analyzed|i prepared|i reversed|i proposed|i reviewed|i negotiated/.test(allText);
    const hasR = /result|impact|improved|reduced|increased|delivered|metric|outcome|%|latency|throughput|saved|recovered|margin|cash flow|bps|lakh|crore|₹|\$|dso|roas|unqualified|sanctioned/.test(allText);
    const count = [hasS, hasT, hasA, hasR].filter(Boolean).length;
    return { hasS, hasT, hasA, hasR, count };
  }, [messages, userResponses, round4StartMsgIndex]);

  const currentCodingProb = getDynamicCodingProblem(activeTopicName, selectedLang);

  const formatElapsed = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const isVaultVerifyMode = searchParams.get('mode') === 'vault_verify';
  const vaultDocId = searchParams.get('docId');
  const pendingVaultChallenge = useMemo(
    () => (isVaultVerifyMode ? loadPendingVaultDefense(vaultDocId) : null),
    [isVaultVerifyMode, vaultDocId]
  );

  if (isVaultVerifyMode) {
    return (
      <VaultDefenseRoom
        user={user}
        cOS={cOS}
        docId={vaultDocId}
        initialChallenge={pendingVaultChallenge}
      />
    );
  }

  return (
    <div
      className={isInterviewActive ? 'iv-session-shell' : undefined}
      style={{
        padding: isInterviewActive ? '8px 14px 10px' : '0 0 32px',
        maxWidth: isInterviewActive ? '100vw' : 1380,
        margin: isInterviewActive ? '0' : '0 auto',
        height: isInterviewActive ? '100dvh' : 'auto',
        maxHeight: isInterviewActive ? '100dvh' : 'none',
        overflow: isInterviewActive ? 'hidden' : 'visible',
        color: 'var(--t1)',
        fontFamily: 'var(--font-sans)'
      }}
    >
      {/* Top Placement Interview Hub Switcher: 1v1 Mock Interview vs GD Practice */}
      {!isInterviewActive && (
        <div
          data-testid="interview-hub-subtabs"
          className="iv-hub-switcher"
          style={{ marginBottom: 20 }}
        >
          <button
            type="button"
            data-testid="tab-1v1-interview"
            data-active={hubTab === 'interview' ? 'true' : 'false'}
            className="iv-hub-tab"
            onClick={() => handleHubTabChange('interview')}
          >
            <span>🎙️</span>
            <span>1v1 Mock Interview</span>
          </button>
          <button
            type="button"
            data-testid="tab-gd-practice"
            data-active={hubTab === 'gd' ? 'true' : 'false'}
            className="iv-hub-tab"
            onClick={() => handleHubTabChange('gd')}
          >
            <span>👥</span>
            <span>GD Practice (Group Discussion)</span>
          </button>
        </div>
      )}

      {hubTab === 'gd' && !isInterviewActive ? (
        <GroupDiscussionPage embedded={true} autoStartGd={gdAutostartRequested} />
      ) : !isInterviewActive ? (
        <InterviewSetupView
          activeSessionDraft={activeSessionDraft} resumeActiveSession={resumeActiveSession}
          discardActiveSession={discardActiveSession} formatStageLabel={formatStageLabel}
          interviewMode={interviewMode} setInterviewMode={setInterviewMode}
          domainStream={domainStream}
          setDomainStream={(stream) => {
            userPickedSubTopicRef.current = true;
            setDomainStream(stream);
          }}
          domainSubTopic={domainSubTopic}
          setDomainSubTopic={(sub) => {
            userPickedSubTopicRef.current = true;
            setDomainSubTopic(sub);
          }}
          customTopicInput={customTopicInput} setCustomTopicInput={setCustomTopicInput} jdInput={jdInput} setJdInput={setJdInput} jdMatchResult={jdMatchResult}
          difficulty={difficulty} setDifficulty={setDifficulty}
          targetCompany={targetCompany} setTargetCompany={setTargetCompany}
          isAssistModeActive={isAssistModeActive} setIsAssistModeActive={setIsAssistModeActive}
          startInterview={startInterview} sessions={sessions}
          clearSessionHistory={clearSessionHistory} setSelectedHistorySession={setSelectedHistorySession}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, height: '100%', flex: '1 1 0%', minHeight: 0, overflow: 'hidden' }}>
          {/* Top Session Control Header */}
          <InterviewSessionHeader
            activeTeacher={activeTeacher}
            activeTopicName={activeTopicName}
            activeStage={activeStage}
            domainStream={domainStream}
            domainSubTopic={domainSubTopic}
            companyName={selectedCompanyProfile?.name}
            isVoiceListening={isVoiceListening}
            elapsedSeconds={elapsedSeconds}
            formatElapsed={formatElapsed}
            isScoredStage={isScoredStage}
            isAssistModeActive={isAssistModeActive}
            setIsAssistModeActive={setIsAssistModeActive}
            messages={messages}
            fetchAssistScript={fetchAssistScript}
            avatarVolume={avatarVolume}
            handleVolumeChange={handleVolumeChange}
            showCameraPreview={showCameraPreview}
            toggleCameraPreview={toggleCameraPreview}
            isAvatarSpeaking={isAvatarSpeaking}
            interruptSpeech={interruptSpeech}
            exitInterview={exitInterview}
            isTabInactive={isTabInactive}
            bargeInEnabled={bargeInEnabled}
            setBargeInEnabled={setBargeInEnabled}
          />

          {/* Backgrounded Tab Paused Banner */}
          {isTabInactive && (
            <div
              data-testid="interview-paused-tab-indicator"
              style={{
                background: 'rgba(234, 179, 8, 0.12)',
                border: '1px solid rgba(234, 179, 8, 0.4)',
                borderRadius: 12,
                padding: '10px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 18 }}>⏸️</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 900, color: 'var(--warning-bright, #eab308)' }}>
                    Interview Paused (Tab Inactive)
                  </div>
                  <div style={{ fontSize: 11.5, color: 'var(--t2)', fontWeight: 600 }}>
                    Microphone and session timer are paused while this tab is backgrounded. Switching back will automatically resume.
                  </div>
                </div>
              </div>
              <span style={{
                fontSize: 10.5,
                fontWeight: 800,
                padding: '3px 8px',
                borderRadius: 6,
                background: 'rgba(234, 179, 8, 0.2)',
                color: '#eab308',
                textTransform: 'uppercase',
                letterSpacing: '0.04em'
              }}>
                Paused
              </span>
            </div>
          )}

          {/* Hands-Free Voice HUD Banner (Active Rounds 1-4 Only) */}
          {activeStage !== 'results' && (
            <InterviewVoiceHud
              isVoiceListening={isVoiceListening}
              isAvatarSpeaking={isAvatarSpeaking}
              isSendingInterviewerReply={isSendingInterviewMessage}
              activeTeacher={activeTeacher}
              liveSpeechTranscript={liveSpeechTranscript}
              stopVoiceListening={pauseVoiceListening}
              startVoiceListening={startVoiceListening}
              isSpeechSupported={isSpeechSupported}
              onDoneSpeaking={flushAndSubmitTranscript}
              isTabInactive={isTabInactive}
              micAudioLevel={micAudioLevel}
            />
          )}

          {/* Round 1: Behavioral */}
          {activeStage === 'round1_behavioral' && (
            <Round1Behavioral
              domainStream={domainStream}
              activeTeacher={activeTeacher}
              animState={animState}
              showCameraPreview={showCameraPreview}
              videoPreviewRef={videoPreviewRef}
              eyeContactScore={eyeContactScore}
              wpmScore={wpmScore}
              isAvatarSpeaking={isAvatarSpeaking}
              isVoiceListening={isVoiceListening}
              lastInterviewerSpeech={lastInterviewerSpeech}
              onProceed={() => proceedToNextStage('round2_coding')}
              onSkipRound={handleSkipRound}
              canProceed={hasSubstantiveRound1}
              isSendingInterviewMessage={isSendingInterviewMessage}
              fillerWordCount={fillerWordCount}
              messages={messages}
              messagesEndRef={messagesEndRef}
              manualTextInput={manualTextInput}
              setManualTextInput={setManualTextInput}
              onSendMessage={handleSendMessageWithText}
              isAssistModeActive={isAssistModeActive}
              setIsAssistModeActive={setIsAssistModeActive}
              assistData={assistData}
              isFetchingAssist={isFetchingAssist}
              assistTab={assistTab}
              setAssistTab={setAssistTab}
              assistScriptLevel={assistScriptLevel}
              setAssistScriptLevel={setAssistScriptLevel}
              fetchAssistScript={fetchAssistScript}
              liveSpeechTranscript={liveSpeechTranscript}
              activeTopicName={activeTopicName}
              difficulty={difficulty}
              speakWithAvatarRaw={previewAssistSpeech}
              setAnimState={setAnimState}
              isDockedUnderCam={isAssistDocked}
              onToggleDock={() => setIsAssistDocked(v => !v)}
            />
          )}

          {/* Round 2: Technical & Coding (Tech) or Financial Case Study (Non-Tech) */}
          {activeStage === 'round2_coding' && (
            domainStream === 'non_tech' ? (
              <Round2CaseStudy
                domainStream={domainStream}
                currentCodingProb={currentCodingProb}
                testOutcomes={latestTestOutcomes}
                onProceed={() => proceedToNextStage('round3_systems')}
                onReviewSolution={reviewCodingSolution}
                onRetryChallenge={retryWithNewCodingChallenge}
                canProceed={codeSubmitted && codeReviewAnswered}
                codeSubmitted={codeSubmitted}
                codeRunFailed={codeRunFailed}
                codeReviewStarted={codeReviewStarted}
                codeReviewQuestionReady={codeReviewQuestionReady}
                defenseState={round2Defense}
                isSendingInterviewMessage={isSendingInterviewMessage}
                lastInterviewerSpeech={lastInterviewerSpeech}
                manualTextInput={manualTextInput}
                setManualTextInput={setManualTextInput}
                onSendMessage={handleSendMessageWithText}
                selectedLang={selectedLang}
                setSelectedLang={setSelectedLang}
                runCodeAndTests={runCodeAndTests}
                isRunning={isRunning}
                codeContent={codeContent}
                setCodeContent={setCodeContent}
                codeModifiedRef={codeModifiedRef}
                activeTeacher={activeTeacher}
                animState={animState}
                terminalLogs={terminalLogs}
                setTerminalLogs={setTerminalLogs}
                onRequestHint={handleRequestCodingHint}
                onSkipChallenge={handleSkipRound}
                isAssistModeActive={isAssistModeActive}
                setIsAssistModeActive={setIsAssistModeActive}
                assistData={assistData}
                isFetchingAssist={isFetchingAssist}
                assistTab={assistTab}
                setAssistTab={setAssistTab}
                assistScriptLevel={assistScriptLevel}
                setAssistScriptLevel={setAssistScriptLevel}
                fetchAssistScript={fetchAssistScript}
                liveSpeechTranscript={liveSpeechTranscript}
                messages={messages}
                difficulty={difficulty}
                speakWithAvatarRaw={previewAssistSpeech}
                setAnimState={setAnimState}
              />
            ) : (
              <Round2Coding
                domainStream={domainStream}
                currentCodingProb={currentCodingProb}
                testOutcomes={latestTestOutcomes}
                onProceed={() => proceedToNextStage('round3_systems')}
                onReviewSolution={reviewCodingSolution}
                onRetryChallenge={retryWithNewCodingChallenge}
                canProceed={codeSubmitted && codeReviewAnswered}
                codeSubmitted={codeSubmitted}
                codeRunFailed={codeRunFailed}
                codeReviewStarted={codeReviewStarted}
                codeReviewQuestionReady={codeReviewQuestionReady}
                defenseState={round2Defense}
                isSendingInterviewMessage={isSendingInterviewMessage}
                lastInterviewerSpeech={lastInterviewerSpeech}
                manualTextInput={manualTextInput}
                setManualTextInput={setManualTextInput}
                onSendMessage={handleSendMessageWithText}
                selectedLang={selectedLang}
                setSelectedLang={(lang) => {
                  setSelectedLang(lang);
                  setCodeSubmitted(false);
                  setCodeRunFailed(false);
                  setCodeReviewStarted(false);
                  setCodeReviewQuestionReady(false);
                  setCodeReviewAnswered(false);
                  setLatestTestOutcomes([]);
                  codeReviewQuestionPendingRef.current = false;
                  if (round2DefenseRef.current.status !== 'eliminated') {
                    setRound2Defense(createInitialDefenseState(2, 'code'));
                  }
                }}
                runCodeAndTests={runCodeAndTests}
                isRunning={isRunning}
                codeContent={codeContent}
                setCodeContent={(value) => {
                  setCodeContent(value);
                  setCodeSubmitted(false);
                  setCodeRunFailed(false);
                  setCodeReviewStarted(false);
                  setCodeReviewQuestionReady(false);
                  setCodeReviewAnswered(false);
                  codeReviewQuestionPendingRef.current = false;
                  if (round2DefenseRef.current.status !== 'eliminated') {
                    setRound2Defense(createInitialDefenseState(2, 'code'));
                  }
                }}
                codeModifiedRef={codeModifiedRef}
                activeTeacher={activeTeacher}
                animState={animState}
                terminalLogs={terminalLogs}
                setTerminalLogs={setTerminalLogs}
                onRequestHint={handleRequestCodingHint}
                onSkipChallenge={handleSkipRound}
                isAssistModeActive={isAssistModeActive}
                setIsAssistModeActive={setIsAssistModeActive}
                assistData={assistData}
                isFetchingAssist={isFetchingAssist}
                assistTab={assistTab}
                setAssistTab={setAssistTab}
                assistScriptLevel={assistScriptLevel}
                setAssistScriptLevel={setAssistScriptLevel}
                fetchAssistScript={fetchAssistScript}
                liveSpeechTranscript={liveSpeechTranscript}
                messages={messages}
                difficulty={difficulty}
                speakWithAvatarRaw={previewAssistSpeech}
                setAnimState={setAnimState}
              />
            )
          )}

          {/* Round 3: Systems Architecture */}
          {activeStage === 'round3_systems' && (
            <Round3SystemDesign
              domainStream={domainStream}
              activeTopicName={activeTopicName}
              onProceed={() => proceedToNextStage('round4_star')}
              onSkipRound={handleSkipRound}
              canProceed={Boolean(
                architectureDefenseAnswered &&
                Number(architectureEvaluation?.score) >= 60 &&
                (latestTopology?.nodes?.length || 0) > 0
              )}
              setLatestTopology={handleTopologyChange}
              analyzeSystemArchitecture={analyzeSystemArchitecture}
              isAnalyzingArchitecture={isAnalyzingArchitecture}
              activeTeacher={activeTeacher}
              animState={animState}
              lastInterviewerSpeech={lastInterviewerSpeech}
              architectureEvaluation={architectureEvaluation}
              defenseState={round3Defense}
              manualTextInput={manualTextInput}
              setManualTextInput={setManualTextInput}
              onSendMessage={handleSendMessageWithText}
              isSendingInterviewMessage={isSendingInterviewMessage}
              isAssistModeActive={isAssistModeActive}
              setIsAssistModeActive={setIsAssistModeActive}
              assistData={assistData}
              isFetchingAssist={isFetchingAssist}
              assistTab={assistTab}
              setAssistTab={setAssistTab}
              assistScriptLevel={assistScriptLevel}
              setAssistScriptLevel={setAssistScriptLevel}
              fetchAssistScript={fetchAssistScript}
              liveSpeechTranscript={liveSpeechTranscript}
              messages={messages}
              difficulty={difficulty}
              speakWithAvatarRaw={previewAssistSpeech}
              setAnimState={setAnimState}
            />
          )}

          {/* Round 4: STAR Assessment */}
          {activeStage === 'round4_star' && (
            <Round4StarDrill
              domainStream={domainStream}
              activeTeacher={activeTeacher}
              animState={animState}
              showCameraPreview={showCameraPreview}
              videoPreviewRef={videoPreviewRef}
              eyeContactScore={eyeContactScore}
              wpmScore={wpmScore}
              lastInterviewerSpeech={lastInterviewerSpeech}
              finishInterview={() => { void finishInterview(); }}
              onSkipRound={handleSkipRound}
              canFinishInterview={(starStep >= 4 || starCoverage.count >= 3) && !isSendingInterviewMessage && !isAvatarSpeaking}
              isSendingInterviewMessage={isSendingInterviewMessage}
              manualTextInput={manualTextInput}
              setManualTextInput={setManualTextInput}
              onSendMessage={handleSendMessageWithText}
              starStep={starStep}
              starCoverage={starCoverage}
              messages={messages}
              messagesEndRef={messagesEndRef}
              isAssistModeActive={isAssistModeActive}
              setIsAssistModeActive={setIsAssistModeActive}
              assistData={assistData}
              isFetchingAssist={isFetchingAssist}
              assistTab={assistTab}
              setAssistTab={setAssistTab}
              assistScriptLevel={assistScriptLevel}
              setAssistScriptLevel={setAssistScriptLevel}
              fetchAssistScript={fetchAssistScript}
              liveSpeechTranscript={liveSpeechTranscript}
              activeTopicName={activeTopicName}
              difficulty={difficulty}
              speakWithAvatarRaw={previewAssistSpeech}
              setAnimState={setAnimState}
              isDockedUnderCam={isAssistDocked}
              onToggleDock={() => setIsAssistDocked(v => !v)}
            />
          )}

          {/* Results Screen (Scrollable Scorecard & Insights View) */}
          {activeStage === 'results' && (
            <div style={{ flex: '1 1 0%', minHeight: 0, overflowY: 'auto', paddingRight: 4 }}>
              <InterviewResultsView
                evaluationResult={evaluationResult}
                isEvaluating={isEvaluating}
                activeTopicName={activeTopicName}
                codeSubmitted={codeSubmitted}
                latestTopology={latestTopology}
                starStep={starStep}
                wpmScore={wpmScore}
                fillerWordCount={fillerWordCount}
                eyeContactScore={eyeContactScore}
                startInterview={startInterview}
                exportInterviewTranscript={exportInterviewTranscript}
                exitInterview={exitInterview}
              />
            </div>
          )}
        </div>
      )}

      {/* Session History Review Modal */}
      <InterviewHistoryModal
        selectedHistorySession={selectedHistorySession}
        onClose={() => setSelectedHistorySession(null)}
      />

      {showVoiceInterviewModal && !isInterviewActive && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Confirm AI Mock Interview Launch"
          data-testid="interview-voice-launch-modal"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1200,
            background: 'rgba(2, 6, 23, 0.72)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
          }}
          onClick={() => setShowVoiceInterviewModal(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 460,
              background: 'var(--bg2)',
              border: '1.5px solid var(--accent)',
              borderRadius: 20,
              padding: 26,
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.45)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                🎙️ Voice Launch Ready
              </span>
              <button
                type="button"
                onClick={() => setShowVoiceInterviewModal(false)}
                aria-label="Close modal"
                style={{ background: 'none', border: 'none', color: 'var(--t3)', fontSize: 18, cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>
            <h3 style={{ margin: '0 0 8px', fontSize: 20, fontWeight: 900, color: 'var(--t1)' }}>
              Start AI Mock Interview?
            </h3>
            <p style={{ margin: '0 0 18px', fontSize: 13.5, lineHeight: 1.55, color: 'var(--t2)' }}>
              Topic ready: <strong>{activeTopicName}</strong> ({difficulty}). Confirm to unlock your 4-round panel interview (25 Pins unless already unlocked or capstone defense).
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setShowVoiceInterviewModal(false)}
                style={{
                  padding: '10px 16px',
                  borderRadius: 10,
                  border: '1px solid var(--border)',
                  background: 'var(--bg3)',
                  color: 'var(--t2)',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Customize Setup
              </button>
              <button
                type="button"
                data-testid="interview-voice-confirm-launch-btn"
                onClick={() => {
                  setShowVoiceInterviewModal(false);
                  void startInterview();
                }}
                className="btn-primary"
                style={{
                  padding: '10px 20px',
                  borderRadius: 10,
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                🎙️ Start Interview Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
