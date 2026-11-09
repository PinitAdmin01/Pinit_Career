'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCareerOS } from '@/lib/context/CareerOSContext';
import { useAuth } from '@/lib/context/AuthContext';
import { stopSpeaking } from '@/lib/tts';
import { stopArchetypeSoundscape } from '@/lib/audio/soundscapes';
import { sanitizeLLMOutput } from '@/lib/sanitizeLLM';
import { runTestSuite } from '@/lib/code/codeRunner';
import { PathwayApiService } from '@/lib/api/pathwayApi';
import { toast } from '@/lib/store/useAppStore';
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
  Round3SystemDesign,
  Round4StarDrill,
  InterviewResultsView,
  InterviewSetupView,
  AssistModeDrawer,
  buildFallbackAssistData,
  InterviewHistoryModal,
  InterviewSessionHeader,
  InterviewVoiceHud
} from './components';
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
  const isScoredStage = isInterviewActive && ['round1_behavioral', 'round2_coding', 'round3_systems', 'round4_star', 'results'].includes(activeStage);
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
    preloadAvatarGLB([activeTeacher.id, 'priya', 'anish']);
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
      if (!isVisible && isInterviewActiveRef.current) {
        setTabSwitchCount(prev => prev + 1);
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

  // Fullscreen Auto-Hide Sidebars
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (isInterviewActive) document.body.setAttribute('data-interview-active', 'true');
      else document.body.removeAttribute('data-interview-active');
    }
    return () => {
      if (typeof document !== 'undefined') document.body.removeAttribute('data-interview-active');
    };
  }, [isInterviewActive]);

  // WebGL context disposal & soundscape cleanup on unmount
  useEffect(() => {
    return () => {
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
    videoPreviewRef,
    toggleCameraPreview,
    stopCamera
  } = useInterviewGaze(isInterviewActive);

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
  const [codeContent, setCodeContent] = useState('');
  const codeContentRef = useRef(codeContent);
  codeContentRef.current = codeContent;
  const selectedLangRef = useRef(selectedLang);
  selectedLangRef.current = selectedLang;
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [codeSubmitted, setCodeSubmitted] = useState(false);

  useEffect(() => {
    // When switching languages, save current buffer and restore or load new starter
    const prevLang = prevLangRef.current;
    if (prevLang !== selectedLang) {
      if (codeContent) codePerLangRef.current[prevLang] = codeContent;
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
  }, [activeTopicName, selectedLang, getDynamicCodingProblem, codeContent, dynamicProblemData]);

  // Round 3 Whiteboard Topology State
  const [latestTopology, setLatestTopology] = useState<any>(null);
  const [isAnalyzingArchitecture, setIsAnalyzingArchitecture] = useState(false);
  const [architectureEvaluation, setArchitectureEvaluation] = useState<any>(null);
  const [evaluationResult, setEvaluationResult] = useState<any>(null);

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
    setMessages(prev => [...prev, { role: 'assistant', content: nudgeMsg }]);
    speakWithAvatarRef.current(nudgeMsg, activeTeacher.id, () => setAnimState('talking'), () => setAnimState('idle'));
  }, [activeTeacher.id]);

  const {
    isVoiceListening,
    isAvatarSpeaking,
    setIsAvatarSpeaking,
    liveSpeechTranscript,
    wpmScore,
    fillerWordCount,
    setFillerWordCount,
    avatarVolume,
    handleVolumeChange,
    startVoiceListening,
    stopVoiceListening,
    speakWithAvatar,
    interruptSpeech,
    isSpeechSupported,
    flushAndSubmitTranscript
  } = useInterviewVoice({
    isInterviewActive,
    activeStage,
    activeTopicName,
    activeTeacherId: activeTeacher.id,
    difficulty,
    onFinalTranscript: handleFinalSpeechTranscript,
    onSilenceNudge: handleSilenceNudge,
    isTabInactive
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
    tabSwitchCount
  });

  // Assist Mode State
  const [isAssistModeActive, setIsAssistModeActive] = useState(false);
  const [assistData, setAssistData] = useState<any>(null);
  const [isFetchingAssist, setIsFetchingAssist] = useState(false);
  const assistRequestRef = useRef(0);
  const [assistScriptLevel, setAssistScriptLevel] = useState<'standard' | 'advanced'>('standard');
  const [assistTab, setAssistTab] = useState<'script' | 'bullets' | 'delivery'>('script');

  const fetchAssistScript = useCallback(async (questionText: string, level?: 'standard' | 'advanced', stageOverride?: Stage) => {
    const requestId = ++assistRequestRef.current;
    const targetStage = stageOverride || activeStage;
    const targetLevel = level || assistScriptLevel;
    setIsFetchingAssist(true);
    try {
      const headers = await getAuthHeaders();
      const res = await fetch('/api/interview/assist', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          question: questionText,
          stage: targetStage,
          topic: activeTopicName,
          domainStream,
          difficulty,
          scriptLevel: targetLevel,
          isPractice: !isInterviewActive
        })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || `Assist request failed (${res.status}).`);
      if (!data?.script) throw new Error('The assist service returned an empty script.');
      if (requestId === assistRequestRef.current) setAssistData(data);
    } catch (error) {
      console.warn('[Interview Assist] Could not refresh the script:', error);
      if (requestId === assistRequestRef.current) {
        setAssistData((prev: any) =>
          prev || buildFallbackAssistData(targetStage, activeTopicName, targetLevel, targetStage === 'round2_coding')
        );
        toast.error('Assist Mode could not refresh', 'Loaded offline coaching outline. Try Regenerate again in a moment.');
      }
    } finally {
      if (requestId === assistRequestRef.current) setIsFetchingAssist(false);
    }
  }, [isInterviewActive, activeStage, activeTopicName, domainStream, difficulty, assistScriptLevel]);

  const resumeActiveSession = useCallback(() => {
    if (!activeSessionDraft) return;
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
    codePerLangRef.current = {};
    codeModifiedRef.current = Boolean(activeSessionDraft.codeContent);
    setSelectedLang(activeSessionDraft.selectedLang || 'python');
    if (activeSessionDraft.activeStage === 'round2_coding') {
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
    const foundTeacher = AVATAR_POOL.find(a => a.id === activeSessionDraft.activeTeacherId);
    if (foundTeacher) setActiveTeacher(foundTeacher);
    setIsInterviewActive(true);
    toast.success('Interview Session Restored', `Resumed in ${activeSessionDraft.activeTopicName} (${formatStageLabel(activeSessionDraft.activeStage)})`);
  }, [activeSessionDraft, setLiveSessionId, setFillerWordCount, fetchDynamicProblem]);

  const startInterview = async () => {
    stopArchetypeSoundscape();
    const topic = interviewMode === 'custom' && customTopicInput.trim()
      ? customTopicInput.trim()
      : roadmapInterviewTopic(onboardingAnswers?.role, domainStream);

    // Capstone defenses (roadmap journey, certificate course) are free; any other topic needs Pins.
    const isCapstoneRun = (capstone !== null && topic === capstone.topic)
      || (courseDefense !== null && topic === courseDefense.topic);
    const itemKey = `interview:${domainStream}:${topic.toLowerCase().replace(/\s+/g, '_')}`;
    if (!isCapstoneRun && !cOS.isItemUnlocked(itemKey)) {
      const unlocked = await cOS.unlockItem(itemKey, 'interview', `AI Interview: ${topic}`);
      if (!unlocked) {
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
    setStarStep(0);
    setCodingAttempt(0);
    setCodeReviewStarted(false);
    setCodeReviewQuestionReady(false);
    setCodeReviewAnswered(false);
    codeReviewQuestionPendingRef.current = false;
    setArchitectureDefenseAnswered(false);
    architectureQuestionPendingRef.current = false;
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

    const greeting = `Welcome to your ${topic} Corporate Interview! I am ${sessionTeacher.name}, ${sessionTeacher.title}. To kick things off, please introduce yourself, tell me a bit about your academic background, and share your experience with ${topic}.`;

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

    if (isAssistModeActive) {
      fetchAssistScript(greeting, assistScriptLevel);
    }
  };

  const exitInterview = () => {
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
    }
    if (next === 'round3_systems') {
      setArchitectureDefenseAnswered(false);
      architectureQuestionPendingRef.current = false;
      setArchitectureEvaluation(null);
    }
    if (next === 'round4_star') setStarStep(0);
    let stagePrompt = '';
    if (next === 'round2_coding') {
      const prob = await fetchDynamicProblem(activeTopicName, domainStream, selectedLang, codingAttempt);
      stagePrompt = `Welcome to Round 2. I am ${nextTeacher.name}, your technical interviewer. Your challenge is "${prob.title}": ${prob.description} Work through it in the coding workspace. Assist Mode can offer conceptual guidance without giving you code. I will review your solution once you submit it.`;
    } else if (next === 'round3_systems') {
      stagePrompt = `Welcome to Round 3. I am ${nextTeacher.name}, your systems interviewer. Build a system for ${activeTopicName} using the nodes and connections on the canvas. When you are ready, I will review your architecture and ask you to explain one of your design choices.`;
    } else if (next === 'round4_star') {
      const builtNodes = latestTopology?.nodes?.map((n: any) => n.label || n.type).join(', ') || 'distributed tiers';
      stagePrompt = `Welcome to Round 4. I am ${nextTeacher.name}, your executive interviewer. I have reviewed your earlier experience, your coding challenge, and your architecture (${builtNodes}). I will connect all three: why did you choose that implementation, how does it fit the system you designed, and what measurable impact would you expect? Please use specific examples and trade-offs.`;
    }
    if (stagePrompt) {
      postLiveEvent('stage', next);
      setMessages(prev => [...prev, { role: 'assistant', content: stagePrompt }]);
      speakWithAvatar(stagePrompt, nextTeacher.id, () => setAnimState('talking'), () => setAnimState('idle'));
      if (isAssistModeActive) {
        fetchAssistScript(stagePrompt, assistScriptLevel, next);
      }
    }
    } finally {
      stageTransitionRef.current = false;
    }
  };

  const handleSendMessageWithText = async (text: string) => {
    if (!text.trim() || isSendingInterviewMessageRef.current) return;
    const answeringCodeReview = activeStage === 'round2_coding' && codeReviewQuestionPendingRef.current;
    const answeringArchitectureQuestion = activeStage === 'round3_systems' && architectureQuestionPendingRef.current;
    isSendingInterviewMessageRef.current = true;
    setIsSendingInterviewMessage(true);
    stopVoiceListening();
    const newMsgs: Message[] = [...messages, { role: 'user', content: text.trim() }];
    setMessages(newMsgs);

    try {
      const headers = await getAuthHeaders();
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
          telemetry: {
            eyeContact: typeof eyeContactScore === 'number' ? eyeContactScore : undefined,
            wpm: typeof wpmScore === 'number' ? wpmScore : undefined,
            fillerWords: typeof fillerWordCount === 'number' ? fillerWordCount : undefined,
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
      if (activeStage === 'round4_star') setStarStep(prev => prev + 1);
      setMessages([...newMsgs, { role: 'assistant', content: cleanReply }]);
      speakWithAvatar(cleanReply, activeTeacher.id, () => setAnimState('talking'), () => setAnimState('idle'));
      if (isAssistModeActive) {
        void fetchAssistScript(cleanReply, assistScriptLevel);
      }
      if (activeStage === 'round2_coding' && codeSubmitted && !answeringCodeReview) {
        codeReviewQuestionPendingRef.current = true;
        setCodeReviewQuestionReady(true);
      }
      if (answeringCodeReview && data?.roundVerdict === 'PASS') {
        codeReviewQuestionPendingRef.current = false;
        setCodeReviewQuestionReady(false);
        setCodeReviewAnswered(true);
      } else if (answeringCodeReview) {
        codeReviewQuestionPendingRef.current = false;
        setCodeReviewQuestionReady(false);
        setCodeReviewAnswered(false);
        setCodeReviewStarted(false);
        setCodeRunFailed(true);
      }
      if (answeringArchitectureQuestion) {
        architectureQuestionPendingRef.current = false;
        setArchitectureDefenseAnswered(true);
      }
    } catch {
      const fallback = answeringArchitectureQuestion
        ? 'I could not review that defense because the connection failed. Please send your explanation again.'
        : answeringCodeReview
          ? 'I could not review that answer because the connection failed. Please resubmit your solution for review.'
          : activeStage === 'round4_star'
            ? 'I could not review that answer because the connection failed. Please send it again when you are ready.'
            : 'I’m having trouble connecting right now. Please try your response again when the interviewer is back online.';
      setMessages([...newMsgs, { role: 'assistant', content: fallback }]);
      speakWithAvatar(fallback, activeTeacher.id, () => setAnimState('talking'), () => setAnimState('idle'));
      if (isAssistModeActive) {
        fetchAssistScript(fallback, assistScriptLevel);
      }
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
        // Keep this as the pending defense question so a resubmitted explanation is
        // evaluated as the defense response, not treated as an unrelated new turn.
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
    const code = codeContent.trim();
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
          language: selectedLang,
          problemTitle: dynamicProblemData?.title || getDynamicCodingProblem(activeTopicName, selectedLang).title,
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
    setTerminalLogs([`[RUNNER] Compiling ${selectedLang.toUpperCase()} for ${activeTopicName}...`]);
    try {
      let fnName = dynamicProblemData?.functionName ||
                   /def\s+([a-zA-Z0-9_]+)/.exec(codeContent)?.[1] ||
                   /function\s+([a-zA-Z0-9_]+)/.exec(codeContent)?.[1] ||
                   /(?:const|let|var)\s+([a-zA-Z0-9_]+)\s*=/.exec(codeContent)?.[1] ||
                   /(?:public|private|static)?\s*(?:[\w<>\[\]]+\s+)+([a-zA-Z0-9_]+)\s*\(/.exec(codeContent)?.[1] ||
                   'evaluateSolution';
      if (selectedLang === 'javascript' && fnName.includes('_')) {
        fnName = fnName.replace(/_([a-z0-9])/g, (_: string, c: string) => c.toUpperCase());
      }
      const resolvedProb = getDynamicCodingProblem(activeTopicName, selectedLang);
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
      void recordCodeSubmission();
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
    if (!codeSubmitted || codeReviewStarted) return;
    setCodeReviewStarted(true);
    setCodeReviewQuestionReady(false);
    setCodeReviewAnswered(false);
    codeReviewQuestionPendingRef.current = false;
    const reviewRequest = `I have completed the ${currentCodingProb.title} challenge and all local tests passed. Here is my ${selectedLang} solution:\n\n\`\`\`${selectedLang}\n${codeContent}\n\`\`\`\n\nPlease review this code and ask me one focused question about my implementation, complexity, or an edge case. Do not provide a replacement solution.`;
    void recordCodeSubmission();
    void handleSendMessageWithText(reviewRequest);
  };

  const retryWithNewCodingChallenge = () => {
    setCodeReviewStarted(false);
    setCodeReviewQuestionReady(false);
    setCodeReviewAnswered(false);
    codeReviewQuestionPendingRef.current = false;
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
        const nodeLabels = (latestTopology?.nodes || []).map((node: any) => node.label || node.type).filter(Boolean);
        const anchor = nodeLabels[0] || 'the main component';
        const spoken = `${data.evaluation?.spokenFeedback || `Architecture review complete. Grade: ${data.evaluation?.verdict || 'reviewed'}.`} I noticed ${anchor} in your design. Why did you choose it, and what trade-off does it create for the rest of the system?`;
        setArchitectureDefenseAnswered(false);
        architectureQuestionPendingRef.current = true;
        setMessages(prev => [...prev, { role: 'assistant', content: spoken }]);
        speakWithAvatar(spoken, ROUND_INTERVIEWERS.round3_systems.id, () => setAnimState('talking'), () => setAnimState('idle'));
        if (isAssistModeActive) {
          fetchAssistScript(spoken, assistScriptLevel);
        }
      }
    } catch {
      toast.error('Architecture review unavailable', 'Your canvas is still saved. Check your connection and try Evaluate Architecture again.');
    } finally {
      setIsAnalyzingArchitecture(false);
    }
  };

  const finishingRef = useRef(false);
  const finishInterview = async () => {
    if (finishingRef.current) return;
    finishingRef.current = true;
    setActiveStage('results');
    const archetype: MindsetArchetype = cOS?.onboardingAnswers?.mindset_archetype || (user as any)?.mindset_archetype || 'Pattern Hunter';

    const evalResult = computeDeterministicEvaluation({
      messages,
      codeSubmitted,
      latestTopology,
      starStep,
      fillerWordCount,
      eyeContactScore,
      wpmScore,
      activeTopicName,
      domainStream,
      archetype,
      tabSwitchCount
    });

    // Make sure the final version of the code is in the record before it is scored.
    await recordCodeSubmission();
    let resultObj: any = evalResult;
    try {
      const headers = await getAuthHeaders();
      const res = await fetch('/api/interview/evaluate', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          history: messages,
          codingScore: evalResult.solvingScore,
          domainStream,
          domainSubTopic: activeTopicName,
          roleKey: activeTopicName,
          liveSessionId: liveSessionIdRef.current,
          archetype,
          topology: latestTopology,
          telemetry: {
            eyeContact: typeof eyeContactScore === 'number' ? eyeContactScore : undefined,
            wpm: typeof wpmScore === 'number' ? wpmScore : undefined,
            fillerWords: typeof fillerWordCount === 'number' ? fillerWordCount : undefined,
            tabSwitches: tabSwitchCount
          }
        })
      });
      const data = await res.json();
      if (data?.evaluation) {
        resultObj = {
          ...evalResult,
          ...data.evaluation,
          evaluationToken: data.evaluationToken,
          topicEvaluationToken: data.topicEvaluationToken,
          xpAwarded: data.xpAwarded,
          newXp: data.newXp,
          perRoundScores: data.evaluation.perRoundScores || evalResult.perRoundScores
        };
      }
    } catch {}

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
      messages,
      summary: resultObj.summary || '',
      strengths: Array.isArray(resultObj.strengths) ? resultObj.strengths : [resultObj.strengths || 'Good effort'],
      improvements: Array.isArray(resultObj.improvements) ? resultObj.improvements.join('. ') : (resultObj.improvements || ''),
      topology: latestTopology || null
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

  const currentCodingProb = getDynamicCodingProblem(activeTopicName, selectedLang);

  const formatElapsed = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div style={{ padding: isInterviewActive ? '0 4px' : '0 0 32px', maxWidth: 1380, margin: '0 auto', color: 'var(--t1)', fontFamily: 'var(--font-sans)' }}>
      {/* Top Placement Interview Hub Switcher: 1v1 Mock Interview vs GD Practice */}
      {!isInterviewActive && (
        <div
          data-testid="interview-hub-subtabs"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 20,
            padding: '4px',
            background: 'var(--bg2)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            width: 'fit-content'
          }}
        >
          <button
            type="button"
            data-testid="tab-1v1-interview"
            onClick={() => handleHubTabChange('interview')}
            style={{
              padding: '8px 18px',
              borderRadius: 8,
              border: 'none',
              background: hubTab === 'interview' ? 'var(--accent)' : 'transparent',
              color: hubTab === 'interview' ? '#fff' : 'var(--t2)',
              fontWeight: 800,
              fontSize: 13.5,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'all 0.18s ease'
            }}
          >
            
            <span>1v1 Mock Interview</span>
          </button>
          <button
            type="button"
            data-testid="tab-gd-practice"
            onClick={() => handleHubTabChange('gd')}
            style={{
              padding: '8px 18px',
              borderRadius: 8,
              border: 'none',
              background: hubTab === 'gd' ? 'var(--accent)' : 'transparent',
              color: hubTab === 'gd' ? '#fff' : 'var(--t2)',
              fontWeight: 800,
              fontSize: 13.5,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'all 0.18s ease'
            }}
          >
            
            <span>GD Practice (Group Discussion)</span>
          </button>
        </div>
      )}

      {hubTab === 'gd' && !isInterviewActive ? (
        <GroupDiscussionPage embedded={true} />
      ) : !isInterviewActive ? (
        <InterviewSetupView
          activeSessionDraft={activeSessionDraft} resumeActiveSession={resumeActiveSession}
          discardActiveSession={discardActiveSession} formatStageLabel={formatStageLabel}
          interviewMode={interviewMode} setInterviewMode={setInterviewMode}
          domainStream={domainStream} setDomainStream={setDomainStream}
          domainSubTopic={domainSubTopic} setDomainSubTopic={setDomainSubTopic}
          customTopicInput={customTopicInput} setCustomTopicInput={setCustomTopicInput} jdInput={jdInput} setJdInput={setJdInput} jdMatchResult={jdMatchResult}
          difficulty={difficulty} setDifficulty={setDifficulty}
          isAssistModeActive={isAssistModeActive} setIsAssistModeActive={setIsAssistModeActive}
          startInterview={startInterview} sessions={sessions}
          clearSessionHistory={clearSessionHistory} setSelectedHistorySession={setSelectedHistorySession}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Top Session Control Header */}
          <InterviewSessionHeader
            activeTeacher={activeTeacher}
            activeTopicName={activeTopicName}
            activeStage={activeStage}
            domainStream={domainStream}
            domainSubTopic={domainSubTopic}
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

          {/* Hands-Free Voice HUD Banner */}
          <InterviewVoiceHud
            isVoiceListening={isVoiceListening}
            isAvatarSpeaking={isAvatarSpeaking}
            isSendingInterviewerReply={isSendingInterviewMessage}
            activeTeacher={activeTeacher}
            liveSpeechTranscript={liveSpeechTranscript}
            stopVoiceListening={stopVoiceListening}
            startVoiceListening={startVoiceListening}
            isSpeechSupported={isSpeechSupported}
            onDoneSpeaking={flushAndSubmitTranscript}
            isTabInactive={isTabInactive}
          />

          {/* Assist Mode Floating Teleprompter Drawer (Scoped to Round 2 Coding where there is no vertical chat column) */}
          {activeStage === 'round2_coding' && isAssistModeActive && (
            <AssistModeDrawer
              isScoredStage={false}
              isCodingRound
              isAssistModeActive={isAssistModeActive}
              setIsAssistModeActive={setIsAssistModeActive}
              assistScriptLevel={assistScriptLevel}
              setAssistScriptLevel={setAssistScriptLevel}
              assistTab={assistTab}
              setAssistTab={setAssistTab}
              isFetchingAssist={isFetchingAssist}
              assistData={assistData}
              liveSpeechTranscript={liveSpeechTranscript}
              messages={messages}
              activeTeacher={activeTeacher}
              difficulty={difficulty}
              fetchAssistScript={fetchAssistScript}
              speakWithAvatarRaw={speakWithAvatar}
              setAnimState={setAnimState}
            />
          )}

          {/* Round 1: Behavioral */}
          {activeStage === 'round1_behavioral' && (
            <Round1Behavioral
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
              canProceed={messages.filter(message => message.role === 'user').length >= 3}
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
            />
          )}

          {/* Round 2: Technical & Coding */}
          {activeStage === 'round2_coding' && (
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
              }}
              codeModifiedRef={codeModifiedRef}
              activeTeacher={activeTeacher}
              animState={animState}
              terminalLogs={terminalLogs}
              setTerminalLogs={setTerminalLogs}
            />
          )}

          {/* Round 3: Systems Architecture */}
          {activeStage === 'round3_systems' && (
            <Round3SystemDesign
              domainStream={domainStream}
              activeTopicName={activeTopicName}
              onProceed={() => proceedToNextStage('round4_star')}
              canProceed={Boolean(
                architectureDefenseAnswered &&
                Number(architectureEvaluation?.score) >= 60 &&
                (latestTopology?.nodes?.length || 0) > 0
              )}
              setLatestTopology={(topology) => {
                setLatestTopology(topology);
                setArchitectureEvaluation(null);
                setArchitectureDefenseAnswered(false);
                architectureQuestionPendingRef.current = false;
              }}
              analyzeSystemArchitecture={analyzeSystemArchitecture}
              isAnalyzingArchitecture={isAnalyzingArchitecture}
              activeTeacher={activeTeacher}
              animState={animState}
              lastInterviewerSpeech={lastInterviewerSpeech}
              architectureEvaluation={architectureEvaluation}
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
            />
          )}

          {/* Round 4: STAR Assessment */}
          {activeStage === 'round4_star' && (
            <Round4StarDrill
              activeTeacher={activeTeacher}
              animState={animState}
              showCameraPreview={showCameraPreview}
              videoPreviewRef={videoPreviewRef}
              eyeContactScore={eyeContactScore}
              wpmScore={wpmScore}
              lastInterviewerSpeech={lastInterviewerSpeech}
              finishInterview={finishInterview}
              canFinishInterview={starStep >= 4 && !isSendingInterviewMessage && !isAvatarSpeaking}
              isSendingInterviewMessage={isSendingInterviewMessage}
              manualTextInput={manualTextInput}
              setManualTextInput={setManualTextInput}
              onSendMessage={handleSendMessageWithText}
              starStep={starStep}
              messages={messages}
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
            />
          )}

          {/* Results Screen */}
          {activeStage === 'results' && (
            <InterviewResultsView
              evaluationResult={evaluationResult}
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
          )}
        </div>
      )}

      {/* Session History Review Modal */}
      <InterviewHistoryModal
        selectedHistorySession={selectedHistorySession}
        onClose={() => setSelectedHistorySession(null)}
      />
    </div>
  );
}
