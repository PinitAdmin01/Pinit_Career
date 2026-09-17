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
  InterviewHistoryModal,
  InterviewSessionHeader,
  InterviewVoiceHud
} from './components';
import { useInterviewGaze } from './hooks/useInterviewGaze';
import { useInterviewVoice } from './hooks/useInterviewVoice';
import { useInterviewPersistence } from './hooks/useInterviewPersistence';
import { computeDeterministicEvaluation, exportInterviewTranscriptFile } from './interviewEvaluator';

export default function InterviewPage() {
  const searchParams = useSearchParams();
  const cOS = useCareerOS();
  const { user } = useAuth();
  const { addXp, earnPins } = cOS;

  const [interviewMode, setInterviewMode] = useState<'roadmap' | 'custom'>('roadmap');
  const [customTopicInput, setCustomTopicInput] = useState('');
  const [activeTopicName, setActiveTopicName] = useState('Software Engineering');
  const [domainStream, setDomainStream] = useState<'tech' | 'non_tech'>('tech');
  const [domainSubTopic, setDomainSubTopic] = useState<string>('software');

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

  const [isInterviewActive, setIsInterviewActive] = useState(false);
  const [activeStage, setActiveStage] = useState<Stage>('round1_behavioral');
  const isScoredStage = isInterviewActive && ['round1_behavioral', 'round2_coding', 'round3_systems', 'round4_star', 'results'].includes(activeStage);
  const [difficulty, setDifficulty] = useState<'easy' | 'normal' | 'hard'>('normal');
  const [animState, setAnimState] = useState<'idle' | 'listening' | 'thinking' | 'talking'>('idle');
  const [manualTextInput, setManualTextInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [starStep, setStarStep] = useState<number>(0);

  // Maintain consistent avatar across all rounds
  const [activeTeacher, setActiveTeacher] = useState(AVATAR_POOL[0]);

  useEffect(() => {
    preloadAvatarGLB([activeTeacher.id, 'priya', 'anish']);
  }, [activeTeacher.id]);

  const selectRandomTeacherForSession = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * AVATAR_POOL.length);
    const chosen = AVATAR_POOL[randomIndex];
    setActiveTeacher(chosen);
    return chosen;
  }, []);

  // Elapsed Session Timer
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  useEffect(() => {
    if (isInterviewActive && activeStage !== 'results') {
      const interval = setInterval(() => setElapsedSeconds(prev => prev + 1), 1000);
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

  // Master WebGL context disposal & soundscape cleanup on unmount (Task 4.4 guarantee)
  useEffect(() => {
    return () => {
      stopSpeaking();
      stopArchetypeSoundscape();
      if (typeof document !== 'undefined') {
        const canvases = document.querySelectorAll('canvas');
        canvases.forEach(canvas => {
          try {
            const gl = canvas.getContext('webgl') || canvas.getContext('webgl2');
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
  const dynamicProblemCacheRef = useRef<Map<string, any>>(new Map());

  const fetchDynamicProblem = useCallback(async (topicName: string, stream: string = 'tech', lang: string = 'python') => {
    const cacheKey = `${topicName}:${stream}`;
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
        body: JSON.stringify({ topic: topicName, domainStream: stream, language: lang, difficulty })
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.title && data?.starterCode) {
          dynamicProblemCacheRef.current.set(cacheKey, data);
          setDynamicProblemData(data);
          return data;
        }
      }
    } catch {}
    const fallback = createSemanticFallbackProblem(topicName, difficulty);
    dynamicProblemCacheRef.current.set(cacheKey, fallback);
    setDynamicProblemData(fallback);
    return fallback;
  }, [difficulty]);

  const getDynamicCodingProblem = useCallback((topic: string, lang: string) => {
    const cached = dynamicProblemCacheRef.current.get(`${topic}:${domainStream}`);
    return resolveDynamicCodingProblem(topic, domainStream, lang, cached);
  }, [domainStream]);

  // Round 2 Code Workspace State
  const codeModifiedRef = useRef(false);
  const [showHint, setShowHint] = useState(false);
  const [selectedLang, setSelectedLang] = useState<'java' | 'python' | 'javascript' | 'sql'>('python');
  const [codeContent, setCodeContent] = useState('');
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [codeSubmitted, setCodeSubmitted] = useState(false);

  useEffect(() => {
    if (codeModifiedRef.current) return;
    const dynamicProb = getDynamicCodingProblem(activeTopicName, selectedLang);
    if (dynamicProb.starterCode) setCodeContent(dynamicProb.starterCode);
  }, [activeTopicName, selectedLang, getDynamicCodingProblem]);

  // Round 3 Whiteboard Topology State
  const [latestTopology, setLatestTopology] = useState<any>(null);
  const [isAnalyzingArchitecture, setIsAnalyzingArchitecture] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<any>(null);

  // Persistence Hook
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
    elapsedSeconds,
    fillerWordCount: 0,
    activeTeacherId: activeTeacher.id,
    latestTopology
  });

  const handleSendMessageWithTextRef = useRef<(text: string) => Promise<void>>((async () => {}) as any);
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
    autoVoiceLoop,
    setAutoVoiceLoop,
    isVoiceListening,
    isAvatarSpeaking,
    setIsAvatarSpeaking,
    liveSpeechTranscript,
    wpmScore,
    fillerWordCount,
    avatarVolume,
    handleVolumeChange,
    startVoiceListening,
    stopVoiceListening,
    speakWithAvatar,
    interruptSpeech
  } = useInterviewVoice({
    isInterviewActive,
    activeStage,
    activeTopicName,
    activeTeacherId: activeTeacher.id,
    difficulty,
    onFinalTranscript: handleFinalSpeechTranscript,
    onSilenceNudge: handleSilenceNudge
  });
  speakWithAvatarRef.current = speakWithAvatar;

  // Assist Mode State
  const [isAssistModeActive, setIsAssistModeActive] = useState(false);
  const [assistData, setAssistData] = useState<any>(null);
  const [isFetchingAssist, setIsFetchingAssist] = useState(false);
  const [assistScriptLevel, setAssistScriptLevel] = useState<'standard' | 'advanced'>('standard');
  const [assistTab, setAssistTab] = useState<'script' | 'bullets' | 'delivery'>('script');

  const fetchAssistScript = useCallback(async (questionText: string, level?: 'standard' | 'advanced') => {
    if (isScoredStage) return;
    setIsFetchingAssist(true);
    try {
      const headers = await getAuthHeaders();
      const res = await fetch('/api/interview/assist', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          question: questionText,
          stage: activeStage,
          topic: activeTopicName,
          domainStream,
          difficulty,
          scriptLevel: level || assistScriptLevel,
          isPractice: !isInterviewActive
        })
      });
      const data = await res.json();
      if (data?.script) setAssistData(data);
    } catch {} finally {
      setIsFetchingAssist(false);
    }
  }, [isInterviewActive, isScoredStage, activeStage, activeTopicName, domainStream, difficulty, assistScriptLevel]);

  const resumeActiveSession = useCallback(() => {
    if (!activeSessionDraft) return;
    setActiveTopicName(activeSessionDraft.activeTopicName);
    setDomainStream(activeSessionDraft.domainStream);
    if (activeSessionDraft.domainSubTopic) setDomainSubTopic(activeSessionDraft.domainSubTopic);
    setActiveStage(activeSessionDraft.activeStage);
    setDifficulty(activeSessionDraft.difficulty);
    setStarStep(activeSessionDraft.starStep || 0);
    setMessages(activeSessionDraft.messages || []);
    setCodeContent(activeSessionDraft.codeContent || '');
    setSelectedLang(activeSessionDraft.selectedLang || 'python');
    setElapsedSeconds(activeSessionDraft.elapsedSeconds || 0);
    if (activeSessionDraft.latestTopology) setLatestTopology(activeSessionDraft.latestTopology);
    const foundTeacher = AVATAR_POOL.find(a => a.id === activeSessionDraft.activeTeacherId);
    if (foundTeacher) setActiveTeacher(foundTeacher);
    setIsInterviewActive(true);
    toast.success('Interview Session Restored', `Resumed in ${activeSessionDraft.activeTopicName}`);
  }, [activeSessionDraft]);

  const startInterview = async () => {
    stopArchetypeSoundscape();
    const topic = interviewMode === 'custom' && customTopicInput.trim()
      ? customTopicInput.trim()
      : (domainStream === 'non_tech' ? 'Finance & Accounting (B.Com)' : 'Software Engineering (SDE)');

    const itemKey = `interview:${domainStream}:${topic.toLowerCase().replace(/\s+/g, '_')}`;
    if (!cOS.isItemUnlocked(itemKey)) {
      cOS.unlockItem(itemKey, 'interview', `AI Interview: ${topic}`);
    }

    const sessionTeacher = selectRandomTeacherForSession();
    setActiveTopicName(topic);
    setIsInterviewActive(true);
    setActiveStage('round1_behavioral');
    setIsAssistModeActive(false);
    setAssistData(null);
    setShowHint(false);
    setCodeSubmitted(false);
    setTerminalLogs([]);
    setElapsedSeconds(0);
    setStarStep(0);
    setEvaluationResult(null);
    codeModifiedRef.current = false;

    const greeting = `Welcome to your ${topic} Corporate Interview! I am ${sessionTeacher.name}, ${sessionTeacher.title}. To kick things off, please introduce yourself, tell me a bit about your academic background, and share your experience with ${topic}.`;
    setMessages([{ role: 'assistant', content: greeting }]);
    speakWithAvatar(greeting, sessionTeacher.id, () => setAnimState('talking'), () => setAnimState('idle'));

    // Server-Authoritative anti-cheat session registration
    try {
      getAuthHeaders().then(headers => {
        fetch('/api/interview/start', {
          method: 'POST',
          headers,
          body: JSON.stringify({ action: 'start', topic, stage: 'round1_behavioral' })
        }).catch(() => {});
      }).catch(() => {});
    } catch {}
  };

  const exitInterview = () => {
    stopSpeaking();
    stopVoiceListening();
    stopCamera();
    setAnimState('idle');
    setIsInterviewActive(false);
    setActiveStage('round1_behavioral');
    setAssistData(null);
    setIsAssistModeActive(false);
    clearDraft();

    // Notify server of session conclusion / cancellation
    try {
      getAuthHeaders().then(headers => {
        fetch('/api/interview/start', {
          method: 'POST',
          headers,
          body: JSON.stringify({ action: 'cancel' })
        }).catch(() => {});
      }).catch(() => {});
    } catch {}
  };

  const proceedToNextStage = (next: Stage) => {
    setActiveStage(next);
    setShowHint(false);
    if (['round2_coding', 'round3_systems', 'round4_star', 'results'].includes(next)) {
      setIsAssistModeActive(false);
      setAssistData(null);
    }
    let stagePrompt = '';
    if (next === 'round2_coding') {
      const prob = getDynamicCodingProblem(activeTopicName, selectedLang);
      stagePrompt = `Round 2: Technical Assessment for ${activeTopicName}. Challenge: "${prob.title}". Implement your solution in the Monaco editor.`;
    } else if (next === 'round3_systems') {
      stagePrompt = `Round 3: System Architecture Canvas for ${activeTopicName}. Design a scalable architecture topology for ${activeTopicName} and evaluate nodes.`;
    } else if (next === 'round4_star') {
      const builtNodes = latestTopology?.nodes?.map((n: any) => n.label || n.type).join(', ') || 'distributed tiers';
      stagePrompt = `Round 4: Executive Review & STAR Assessment. Looking at your system whiteboard with ${builtNodes}, what trade-offs did you prioritize for ${activeTopicName}?`;
    }
    if (stagePrompt) {
      setMessages(prev => [...prev, { role: 'assistant', content: stagePrompt }]);
      speakWithAvatar(stagePrompt, activeTeacher.id, () => setAnimState('talking'), () => setAnimState('idle'));
    }
  };

  const skipQuestion = () => {
    stopSpeaking();
    const skipMsg = `Moving on to our next question for ${activeTopicName}. How do you approach reliability and edge-case handling?`;
    setMessages(prev => [...prev, { role: 'user', content: '[Candidate skipped question]' }, { role: 'assistant', content: skipMsg }]);
    speakWithAvatar(skipMsg, activeTeacher.id, () => setAnimState('talking'), () => setAnimState('idle'));
  };

  const handleSendMessageWithText = async (text: string) => {
    if (!text.trim()) return;
    const newMsgs: Message[] = [...messages, { role: 'user', content: text.trim() }];
    setMessages(newMsgs);
    if (activeStage === 'round4_star') setStarStep(prev => prev + 1);

    try {
      const headers = await getAuthHeaders();
      const res = await fetch('/api/interview/chat', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          message: text.trim(),
          interviewerId: activeTeacher.id,
          stage: activeStage,
          history: newMsgs,
          difficulty,
          customTopic: activeTopicName,
          domainStream,
          domainSubTopic: activeTopicName,
          telemetry: {
            eyeContact: typeof eyeContactScore === 'number' ? eyeContactScore : undefined,
            wpm: typeof wpmScore === 'number' ? wpmScore : undefined,
            fillerWords: typeof wpmScore === 'number' ? fillerWordCount : undefined
          }
        })
      });
      const data = await res.json();
      const cleanReply = sanitizeLLMOutput(data?.reply);
      if (cleanReply) {
        setMessages([...newMsgs, { role: 'assistant', content: cleanReply }]);
        speakWithAvatar(cleanReply, activeTeacher.id, () => setAnimState('talking'), () => setAnimState('idle'));
      }
    } catch {
      const fallback = `Thank you for sharing! In your work with ${activeTopicName}, how do you evaluate production trade-offs?`;
      setMessages([...newMsgs, { role: 'assistant', content: fallback }]);
      speakWithAvatar(fallback, activeTeacher.id, () => setAnimState('talking'), () => setAnimState('idle'));
    }
  };
  handleSendMessageWithTextRef.current = handleSendMessageWithText;

  const runCodeAndTests = async () => {
    setIsRunning(true);
    setTerminalLogs([`[RUNNER] Compiling ${selectedLang.toUpperCase()} for ${activeTopicName}...`]);
    try {
      let fnName = dynamicProblemData?.functionName ||
                   /def\s+([a-zA-Z0-9_]+)/.exec(codeContent)?.[1] ||
                   /function\s+([a-zA-Z0-9_]+)/.exec(codeContent)?.[1] ||
                   'evaluateSolution';
      if (selectedLang === 'javascript' && fnName.includes('_')) {
        fnName = fnName.replace(/_([a-z0-9])/g, (_: string, c: string) => c.toUpperCase());
      }
      let testCases = dynamicProblemData?.testCases || [
        { input: '[10, 20, 30]', output: 'Optimal', name: 'Standard Case', verify: (r: any) => Boolean(r) }
      ];
      const result = await runTestSuite(codeContent, selectedLang as any, {
        functionName: fnName,
        testCases,
        sqlConfig: {
          query: codeContent,
          schemaSql: 'CREATE TABLE employees (id INT, salary INT); INSERT INTO employees VALUES (1, 90000);',
          expectedColumns: ['id'],
          expectedRows: [[1]]
        },
        timeoutMs: 5000
      });
      setTerminalLogs(prev => [...prev, ...result.terminalLogs]);
      if (result.allPassed || result.passedTests > 0) {
        setCodeSubmitted(true);
        setTerminalLogs(prev => [...prev, `\n✅ [PASSED] ${result.passedTests} tests verified!`]);
      }
    } catch (e: any) {
      setTerminalLogs(prev => [...prev, `[ERROR] Execution failed: ${e?.message || 'Syntax error'}`]);
    } finally {
      setIsRunning(false);
    }
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
      if (res.ok) {
        const data = await res.json();
        const spoken = data.evaluation?.spokenFeedback || `Architecture review complete. Grade: ${data.evaluation?.verdict || 'A'}.`;
        setMessages(prev => [...prev, { role: 'assistant', content: spoken }]);
        speakWithAvatar(spoken, activeTeacher.id, () => setAnimState('talking'), () => setAnimState('idle'));
      }
    } catch {
      const fallback = `Architecture evaluated. To optimize ${activeTopicName}, consider adding async messaging and caching layers.`;
      setMessages(prev => [...prev, { role: 'assistant', content: fallback }]);
      speakWithAvatar(fallback, activeTeacher.id, () => setAnimState('talking'), () => setAnimState('idle'));
    } finally {
      setIsAnalyzingArchitecture(false);
    }
  };

  const finishInterview = async () => {
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
      archetype
    });

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
          archetype,
          telemetry: {
            eyeContact: typeof eyeContactScore === 'number' ? eyeContactScore : undefined,
            wpm: typeof wpmScore === 'number' ? wpmScore : undefined,
            fillerWords: typeof wpmScore === 'number' ? fillerWordCount : undefined
          }
        })
      });
      const data = await res.json();
      if (data?.evaluation) {
        resultObj = {
          ...evalResult,
          ...data.evaluation,
          evaluationToken: data.evaluationToken,
          perRoundScores: data.evaluation.perRoundScores || evalResult.perRoundScores
        };
      }
    } catch {}

    setEvaluationResult(resultObj);
    clearDraft();
    if (resultObj.verdict === 'Hire' || resultObj.verdict === 'Conditional Hire') {
      addXp(150, 'Completed AI Interview');
      earnPins('ai_interview');
    }

    const { dateStr, isoStr } = safeFormatDate();
    const sessionRecord: InterviewSessionRecord = {
      id: `sess-${Date.now()}`,
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
        fillerWords: typeof wpmScore === 'number' ? fillerWordCount : null,
        tabSwitches: 0
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

  const exportInterviewTranscript = (format: 'markdown' | 'json' = 'markdown') => {
    exportInterviewTranscriptFile({
      format, activeTopicName, domainStream,
      teacherName: activeTeacher.name,
      evaluationResult, eyeContactScore, wpmScore, fillerWordCount,
      codeContent, selectedLang, latestTopology, messages
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
    <div style={{ padding: isInterviewActive ? '6px 16px' : '24px 36px', maxWidth: 1400, margin: '0 auto', color: 'var(--t1)', fontFamily: 'var(--font-sans)' }}>
      {!isInterviewActive ? (
        <InterviewSetupView
          activeSessionDraft={activeSessionDraft} resumeActiveSession={resumeActiveSession}
          discardActiveSession={discardActiveSession} formatStageLabel={formatStageLabel}
          interviewMode={interviewMode} setInterviewMode={setInterviewMode}
          domainStream={domainStream} setDomainStream={setDomainStream}
          domainSubTopic={domainSubTopic} setDomainSubTopic={setDomainSubTopic}
          customTopicInput={customTopicInput} setCustomTopicInput={setCustomTopicInput}
          difficulty={difficulty} setDifficulty={setDifficulty}
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
            autoVoiceLoop={autoVoiceLoop}
            setAutoVoiceLoop={setAutoVoiceLoop}
            skipQuestion={skipQuestion}
            exitInterview={exitInterview}
          />

          {/* Hands-Free Voice HUD Banner */}
          <InterviewVoiceHud
            isVoiceListening={isVoiceListening}
            isAvatarSpeaking={isAvatarSpeaking}
            activeTeacher={activeTeacher}
            liveSpeechTranscript={liveSpeechTranscript}
            stopVoiceListening={stopVoiceListening}
            startVoiceListening={startVoiceListening}
          />

          {/* Assist Mode Teleprompter Drawer */}
          <AssistModeDrawer
            isScoredStage={isScoredStage}
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
              fillerWordCount={fillerWordCount}
              messages={messages}
              messagesEndRef={messagesEndRef}
              startVoiceListening={startVoiceListening}
              manualTextInput={manualTextInput}
              setManualTextInput={setManualTextInput}
              onSendMessage={handleSendMessageWithText}
            />
          )}

          {/* Round 2: Technical & Coding */}
          {activeStage === 'round2_coding' && (
            <Round2Coding
              domainStream={domainStream}
              currentCodingProb={currentCodingProb}
              showHint={showHint}
              setShowHint={setShowHint}
              onProceed={() => proceedToNextStage('round3_systems')}
              selectedLang={selectedLang}
              setSelectedLang={setSelectedLang}
              runCodeAndTests={runCodeAndTests}
              isRunning={isRunning}
              codeContent={codeContent}
              setCodeContent={setCodeContent}
              codeModifiedRef={codeModifiedRef}
              activeTeacher={activeTeacher}
              animState={animState}
              isVoiceListening={isVoiceListening}
              startVoiceListening={startVoiceListening}
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
              setLatestTopology={setLatestTopology}
              analyzeSystemArchitecture={analyzeSystemArchitecture}
              isAnalyzingArchitecture={isAnalyzingArchitecture}
              activeTeacher={activeTeacher}
              animState={animState}
              isVoiceListening={isVoiceListening}
              startVoiceListening={startVoiceListening}
              lastInterviewerSpeech={lastInterviewerSpeech}
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
              isVoiceListening={isVoiceListening}
              startVoiceListening={startVoiceListening}
              finishInterview={finishInterview}
              manualTextInput={manualTextInput}
              setManualTextInput={setManualTextInput}
              onSendMessage={handleSendMessageWithText}
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
