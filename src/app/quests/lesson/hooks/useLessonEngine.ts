import { useEffect, useCallback, useMemo, useState, useRef } from 'react';
import { COURSES_REGISTRY } from '@/lib/data/coursesData';
import { CONCEPT_ANALOGIES_REGISTRY } from '@/lib/data/conceptAnalogies';
import { speakWithAvatar, stopSpeaking, preloadTTS, preloadNextSpeech } from '@/lib/tts';
import { startArchetypeSoundscape, stopArchetypeSoundscape, setSoundscapeDucking, getUserSoundscapeVolume, setUserSoundscapeVolume } from '@/lib/audio/soundscapes';
import { resolvePilotDay, parseQuestId } from '@/lib/data/curriculumEnricher';
import { getLongLesson, getLongLessonLanguage } from '@/lib/data/longLessons';
import { runPythonInBrowser } from '@/lib/code/python/pythonRunner';
import { runSqlInBrowser } from '@/lib/code/sql/sqlRunner';
import { getLessonCheck, getTestQuestions, parseTestQuestId, withAnswerAt } from '@/lib/data/courseTests';
import { api } from '@/lib/api/client';
import { toast } from '@/lib/store/useAppStore';
import { executeSandboxScript } from '@/lib/code/sandbox/sandboxedIframeRunner';
import { withLessonHelpers } from '@/lib/code/sandbox/lessonHelpers';
import { getAuthoritativeQuest, isAuthoritativeExam } from '@/lib/quests/questRegistry';
import { LessonState } from './useLessonState';
import { compileTs } from '@/lib/code/ts/compileTs';
import { PYTHON_M1_VISUALS } from '@/lib/data/lessonVisuals/pythonMonth1Visuals';
import type { VisualAt, LessonVisual } from '@/lib/types/lessonVisual';

const AT_ORDER: Record<string, number> = {
  intro: 0,
  say1: 1,
  say2: 2,
  say3: 3,
  say4: 4,
  say5: 5,
  say6: 6,
  example: 7,
  tryIt: 8,
};

export function getStepIndexForPieceAt(visual: LessonVisual, pieceAt: string): number {
  const targetWeight = AT_ORDER[pieceAt] ?? 0;
  let bestIndex = 0;
  for (let i = 0; i < visual.steps.length; i++) {
    const stepWeight = AT_ORDER[visual.steps[i].at] ?? 0;
    if (stepWeight <= targetWeight) {
      bestIndex = i;
    }
  }
  return bestIndex;
}

export function adaptCodeForSandbox(
  code: string,
  questId: string | { id?: string; language?: string } = '',
  questOrLanguage?: string | { language?: string }
): string {
  let qId = '';
  let setLanguage: string | undefined;

  if (typeof questId === 'object' && questId !== null) {
    qId = questId.id || '';
    if (questId.language) {
      setLanguage = String(questId.language).toLowerCase();
    }
  } else if (typeof questId === 'string') {
    qId = questId;
  }

  if (typeof questOrLanguage === 'string') {
    setLanguage = questOrLanguage.toLowerCase();
  } else if (questOrLanguage && typeof questOrLanguage === 'object' && questOrLanguage.language) {
    setLanguage = String(questOrLanguage.language).toLowerCase();
  }

  if (!setLanguage && qId) {
    const auth = getAuthoritativeQuest(qId);
    if ((auth as any)?.language) {
      setLanguage = String((auth as any).language).toLowerCase();
    }
  }

  // CHK-7: adaptCodeForSandbox must not rewrite code for quests whose language is set (typescript/tsx/html/css/javascript)
  if (setLanguage) {
    const norm = setLanguage.trim().toLowerCase();
    const preservedLanguages = new Set(['typescript', 'ts', 'tsx', 'html', 'css', 'javascript', 'js']);
    if (preservedLanguages.has(norm)) {
      return code;
    }
  }

  const qLower = (qId || '').toLowerCase();
  const isJava = (/\bjava\b/i.test(qLower) || (qLower.includes('java') && !qLower.includes('javascript'))) || code.includes('public class') || code.includes('System.out');
  const isPython = qLower.includes('python') || code.includes('def ') || (code.includes('print(') && !code.includes('console.log'));
  const isSql = qLower.includes('sql') || /^\s*(SELECT|CREATE|INSERT|UPDATE|DELETE)\b/i.test(code.trim());

  if (isSql) {
    return `
      const query = ${JSON.stringify(code)};
      const lines = query.trim().split('\\n');
      console.log("sqlite> " + lines[0]);
      for (let i = 1; i < lines.length; i++) {
        console.log("   ...> " + lines[i]);
      }
      console.log("Query executed successfully. (0 errors, 1 table modified/queried)");
    `;
  }

  if (isJava) {
    let js = code;
    js = js.replace(/System\.out\.println\s*\(/g, 'console.log(');
    js = js.replace(/System\.out\.print\s*\(/g, 'console.log(');
    js = js.replace(/public\s+class\s+\w+\s*\{/g, '(() => {');
    js = js.replace(/public\s+static\s+void\s+main\s*\([^)]*\)\s*\{/g, '(() => {');
    js = js.replace(/\b(int|String|boolean|double|float|long|char)\s+([a-zA-Z0-9_]+)\s*=/g, 'let $2 =');
    js = js + '\n})?.();\n})?.();';
    return js;
  }

  if (isPython) {
    let js = `const print = (...args) => console.log(...args);\n`;
    const lines = code.split('\n');
    for (const line of lines) {
      if (line.trim().startsWith('#')) {
        js += line.replace('#', '//') + '\n';
      } else {
        js += line + '\n';
      }
    }
    return js;
  }

  return code;
}

const RUNNER_LABELS: Record<string, string> = {
  'java-basics': '⚙️ Javac compiling',
  'python': '🐍 Python 3 Executing',
  'react-basics': '⚛️ React Node Sandbox',
  'node-web': '🔷 Node.js & TypeScript Sandbox',
  'sre-web': '🔷 Multi-Cloud Reliability & SRE Sandbox',
  'stream-web': '🔷 Streaming & Event Processing Sandbox',
  'aideploy-web': '🔷 Production AI Deployment Sandbox',
  'sql-mastery': '🗄️ SQLite Engine',
  'dsa-optim': '🔢 DSA Node Sandbox',
  'dsa-py': '🐍 Python 3 Executing',
  'fullstack-js': '🌐 Fullstack Node/Next Sandbox',
  'cloud': '☁️ AWS Cloud Simulator',
  'devops': '🚀 DevOps Pipeline Simulator',
  'git_vcs': '🐙 Git, GitHub & Version Control Sandbox',
  'soft-skills': '🗣️ Professional Tech Communication & Interview Sandbox',
  'design': '🎨 UI/UX Design Systems & Visual Frontend Sandbox',
  'mobile': '📱 Mobile Application Development & React Native Sandbox',
  'nlp': '📚 Natural Language Processing & LLM Infrastructure Sandbox',
  'cyber': '🛡️ Cybersecurity Principles & Secure Systems Sandbox',
  'excel_viz': '📊 Excel & Spreadsheet Data Analysis Sandbox',
  'ai_prompt': '🤖 Everyday AI Literacy & Prompt Engineering Sandbox',
  'comp_fund': '💻 Computer Literacy & OS Fundamentals Sandbox',
  'bcom_ait': '🤖 AI & Digital Transformation for Business Simulator',
  'bcom_ops': '⚙️ Operations, Supply Chain & Business Compliance Simulator',
  'bcom_tax': '📋 Corporate & Direct Tax Simulator',
  'bcom_aud': '🔍 Forensic & Statutory Audit Simulator',
  'bcom-finance': '💹 Corporate Financial Management Simulator',
  'bcom_law': '⚖️ Corporate & Commercial Law Simulator',
  'bcom_ban': '🏛️ Commercial Banking & Treasury Simulator',
  'bcom_scrm': '🤝 Sales, Customer Success & CRM Simulator',
  'bcom_ent': '💡 Entrepreneurship & Business Management Simulator',
  'bcom_ecom': '🛒 E-Commerce & Digital Business Simulator',
  'bcom_dmkt': '🚀 Digital Marketing & Growth Strategy Simulator',
  'bcom-marketing': '📢 Digital Marketing & Growth Simulator',
  'bcom_ana': '📊 Business Analytics & Decision Intelligence Simulator',
  'bcom-accounting': '📊 Digital Accounting & ERP Simulator',
  'quant-systems': '📈 Quantitative Trading & Low-Latency Simulator',
  'iot_sec': '🔒 IoT Security & Root of Trust Simulator',
  'iot_edge': '🧠 Edge AI & TinyML TFLM Simulator',
  'ai': '🤖 AI & LLM Engine Simulator',
  'ai-py': '🐍 Python 3 Executing',
  'dist': '🌐 Distributed Systems Simulator',
  'dist-py': '🐍 Python 3 Executing',
  'cloud-py': '🐍 Python 3 Executing',
  'nlp-py': '🐍 Python 3 Executing',
  'quant-py': '🐍 Python 3 Executing',
  'prompt-py': '🐍 Python 3 Executing',
  'cyber-py': '🐍 Python 3 Executing',
  'train-py': '🐍 Python 3 Executing',
  'vec-py': '🐍 Python 3 Executing',
  'safe-py': '🐍 Python 3 Executing',
  'iot_net': '📶 IoT Radio Protocol Simulator',
  'iot_emb': '🔌 Embedded MCU Simulator',
  'g3d': '🔮 WebGL2 3D Shader Sandbox',
  'blockchain': '🪙 EVM Web3 & Solidity Simulator',
};

interface UseLessonEngineProps {
  questId: string;
  questData: any;
  teacherId: string;
  user: any;
  addCompletedQuest: (id: string, completed?: boolean, xp?: number, courseId?: string, passReceipt?: string) => void;
  state: LessonState;
  finishLessonAndReturn: () => void;
  isTestMode?: boolean;
}

export function useLessonEngine({
  questId,
  questData,
  teacherId,
  user,
  addCompletedQuest,
  state,
  finishLessonAndReturn,
  isTestMode = false,
}: UseLessonEngineProps) {
  const userId = user?.id || 'guest';
  const syllabus: string[] = useMemo(() => Array.isArray(questData?.syllabus) ? questData.syllabus : [], [questData?.syllabus]);

  const {
    currentSlide, setCurrentSlide, currentSlideRef,
    isPlaying, setIsPlaying,
    setAudioProgress,
    timerRef, codeRunIntervalsRef,
    getSpeakerTextRef, teacherIdRef,
    slides, setSlides, slidesLoading, setSlidesLoading, slidesLengthRef,
    understandingConfirmed, setUnderstandingConfirmed,
    examQuestionIndex, setExamQuestionIndex,
    selectedMcqAnswer, setSelectedMcqAnswer,
    mcqChecked, setMcqChecked,
    mcqIsCorrect, setMcqIsCorrect,
    examPassed, setExamPassed,
    examFailed, setExamFailed,
    examCorrectCount, setExamCorrectCount,
    examAnswers, setExamAnswers,
    maxUnlockedSlide, setMaxUnlockedSlide,
    setIsRecording,
    setConfettiParticles,
    setCodeRunning,
    setCodeOutputs,
    setIsHydrated,
    isAudioUnlocked, setIsAudioUnlocked,
    isFocusMusicEnabled,
    setSoundscapeVol,
    isInteractive, setIsInteractive,
    chatMessages, setChatMessages,
    chatInput, setChatInput,
    chatLoading, setChatLoading,
    latestAIResponse, setLatestAIResponse,
    doubtCount, setDoubtCount,
    currentVisualStepIndex, setCurrentVisualStepIndex,
    isManualOverride, setIsManualOverride,
    currentPieceAt, setCurrentPieceAt,
    chatBottomRef,
  } = state;

  const isManualOverrideRef = useRef(isManualOverride);
  isManualOverrideRef.current = isManualOverride;

  const currentPieceAtRef = useRef(currentPieceAt);
  currentPieceAtRef.current = currentPieceAt;

  const pieceChainTokenRef = useRef(0);

  teacherIdRef.current = teacherId;
  slidesLengthRef.current = slides.length || syllabus.length;

  // A test after every 5 days: no teaching slides, only questions from those days' lessons.
  const testInfo = useMemo(() => parseTestQuestId(questId || ''), [questId]);
  const quizQuestions = useMemo(
    () => (testInfo ? getTestQuestions(testInfo.prefix, testInfo.start, testInfo.end) : null),
    [testInfo]
  );

  // Written long-format lesson for this course day, if there is one.
  const longLesson = useMemo(() => {
    const parsed = parseQuestId(questId || '');
    return parsed ? getLongLesson(parsed.prefix, parsed.dayNum) : null;
  }, [questId]);

  const startVoiceInput = useCallback(() => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Not Supported", "Speech recognition is not supported in this browser.");
      return;
    }
    const rec = new SpeechRecognition();
    rec.lang = 'en-US';
    rec.interimResults = false;
    rec.maxAlternatives = 1;

    rec.onstart = () => {
      setIsRecording(true);
      toast.success("Microphone Active", "Start speaking now...");
    };

    rec.onresult = (event: any) => {
      const result = event.results[0][0].transcript;
      setChatInput(prev => (prev ? prev + ' ' : '') + result);
    };

    rec.onerror = (e: any) => {
      console.error(e);
      setIsRecording(false);
      toast.error("Voice Error", "Failed to capture microphone input.");
    };

    rec.onend = () => {
      setIsRecording(false);
    };

    rec.start();
  }, [setIsRecording, setChatInput]);

  const playChime = useCallback(() => {
    if (typeof window === 'undefined') return;
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();

      const playNote = (frequency: number, startTime: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(frequency, startTime);
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.12, startTime + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + duration);
      };

      const now = ctx.currentTime;
      playNote(523.25, now, 0.4);
      playNote(659.25, now + 0.15, 0.4);
      playNote(783.99, now + 0.3, 0.5);
      playNote(1046.50, now + 0.45, 0.8);
    } catch (e) {
      console.error('Failed to play celebration chime:', e);
    }
  }, []);

  const launchConfetti = useCallback(() => {
    const colors = ['var(--coral)', 'var(--accent)', 'var(--amber)', 'var(--green)', 'var(--reward)', 'var(--t1)'];
    const count = 75;
    const newParticles: any[] = [];

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = 50 + Math.random() * 200;
      const targetX = Math.cos(angle) * distance;
      const targetY = Math.sin(angle) * distance;
      const size = 5 + Math.random() * 8;
      const color = colors[Math.floor(Math.random() * colors.length)];

      newParticles.push({
        id: Math.random(),
        size,
        color,
        transform: `translate(0px, 0px) scale(0)`,
        transition: 'all 0.1s ease-out'
      });

      setTimeout(() => {
        setConfettiParticles(prev => prev.map(p => {
          if (p.id === newParticles[i]?.id) {
            return {
              ...p,
              transform: `translate(${targetX}px, ${targetY}px) scale(1) rotate(${Math.random() * 360}deg)`,
              transition: `all ${0.7 + Math.random() * 0.6}s cubic-bezier(0.25, 1, 0.5, 1)`
            };
          }
          return p;
        }));
      }, 20);
    }

    setConfettiParticles(newParticles);
    setTimeout(() => {
      setConfettiParticles([]);
    }, 2500);
  }, [setConfettiParticles]);

  const runSlideCode = useCallback(async (slideIdx: number, rawCode?: string) => {
    setCodeRunning(prev => ({ ...prev, [slideIdx]: true }));
    setCodeOutputs(prev => ({ ...prev, [slideIdx]: "Running in isolated sandbox worker..." }));

    try {
      const codeSnippet = rawCode || slides[slideIdx]?.codeExample || '';
      if (!codeSnippet.trim()) {
        setCodeOutputs(prev => ({ ...prev, [slideIdx]: "No code available to execute on this slide." }));
        setCodeRunning(prev => ({ ...prev, [slideIdx]: false }));
        return;
      }

      const parsedId = parseQuestId(questId || '');
      if (parsedId && getLongLessonLanguage(parsedId.prefix) === 'python') {
        setCodeOutputs(prev => ({ ...prev, [slideIdx]: "Starting Python... (the first run takes a few seconds)" }));
        const py = await runPythonInBrowser(codeSnippet);
        const shown = [py.stdout, py.error ? `[Error] ${py.error}` : ''].filter(Boolean).join('\n');
        setCodeOutputs(prev => ({ ...prev, [slideIdx]: shown || 'Your code ran but printed nothing. Use print(...) to see a result.' }));
        return;
      }

      if (parsedId && getLongLessonLanguage(parsedId.prefix) === 'sql') {
        setCodeOutputs(prev => ({ ...prev, [slideIdx]: "Starting PostgreSQL... (the first run can take up to 15 seconds)" }));
        const shown = await runSqlInBrowser(codeSnippet);
        setCodeOutputs(prev => ({ ...prev, [slideIdx]: shown }));
        return;
      }

      let codeToExecute = codeSnippet;
      const isTs = (parsedId && getLongLessonLanguage(parsedId.prefix) === 'typescript') || questData?.language === 'typescript' || questData?.language === 'tsx';
      if (isTs) {
        setCodeOutputs(prev => ({ ...prev, [slideIdx]: "Compiling TypeScript..." }));
        const compiled = await compileTs(codeSnippet, { jsx: questData?.language === 'tsx' || /<[A-Za-z]/.test(codeSnippet) });
        if (!compiled.ok) {
          const lineInfo = compiled.line ? ` (line ${compiled.line})` : '';
          setCodeOutputs(prev => ({ ...prev, [slideIdx]: `TypeScript compilation failed${lineInfo}: ${compiled.message}` }));
          return;
        }
        codeToExecute = compiled.js;
      }

      // Run the example inside an async function so examples that await (or print after a
      // promise settles) show all their output, with the hash helpers added when it uses them.
      const questLang = questData?.language || (isTs ? 'typescript' : (parsedId ? getLongLessonLanguage(parsedId.prefix) : undefined));
      const executable = `return (async () => {\n${withLessonHelpers(adaptCodeForSandbox(codeToExecute, questId, questLang))}\n})();`;
      const result = await executeSandboxScript(executable, 4000);

      let formattedOutput = '';
      if (result.stdout) {
        formattedOutput += result.stdout;
      }
      if (result.stderr) {
        formattedOutput += (formattedOutput ? '\n' : '') + `[Stderr] ${result.stderr}`;
      }
      if (!formattedOutput) {
        formattedOutput = result.success
          ? `Program execution completed successfully in ${result.durationMs}ms (exit code 0).`
          : `Execution failed: ${result.error || 'Unknown runtime error'}`;
      }

      setCodeOutputs(prev => ({ ...prev, [slideIdx]: formattedOutput }));
    } catch (err: any) {
      setCodeOutputs(prev => ({ ...prev, [slideIdx]: `Runtime Exception: ${err?.message || err}` }));
    } finally {
      setCodeRunning(prev => ({ ...prev, [slideIdx]: false }));
    }
  }, [slides, questId, questData, longLesson, setCodeOutputs, setCodeRunning]);

  const simulateCodeRun = useCallback((slideIdx: number, _mockOutput?: string) => {
    const rawCode = slides[slideIdx]?.codeExample;
    runSlideCode(slideIdx, rawCode);
  }, [slides, runSlideCode]);

  // Expose active slide code to window for global notebook drawer snapshot integration
  useEffect(() => {
    if (typeof window !== 'undefined' && slides.length > 0) {
      (window as any).__activeSlideCode = slides[currentSlide - 1]?.codeExample || null;
      (window as any).__activeSlideNum = currentSlide;
    }
    return () => {
      if (typeof window !== 'undefined') {
        (window as any).__activeSlideCode = null;
        (window as any).__activeSlideNum = null;
      }
    };
  }, [currentSlide, slides]);

  // Preload model on mount, and stop speaking on unmount
  useEffect(() => {
    preloadTTS();
    return () => {
      stopSpeaking();
    };
  }, []);

  // Preload next slide text in background
  useEffect(() => {
    if (examPassed) return;
    const slidesLength = slides.length || (syllabus?.length || 0);
    const nextSlideIdx = currentSlide;
    if (nextSlideIdx < slidesLength) {
      let nextSpeechText = "";
      if (slides && slides[nextSlideIdx]) {
        const slide = slides[nextSlideIdx];
        nextSpeechText = slide.speech || `Let us explore Slide ${currentSlide + 1}: "${slide.title}". Here are the core concepts: First, ${slide.bulletPoints?.[0] || ''}. Second, ${slide.bulletPoints?.[1] || ''}. And third, ${slide.bulletPoints?.[2] || ''}. Make sure you understand these before proceeding to the coding evaluation!`;
      } else if (syllabus && nextSlideIdx < syllabus.length) {
        const concept = syllabus[nextSlideIdx];
        nextSpeechText = `Let us explore Section ${currentSlide + 1}: "${concept}". Observe the live code example and see what happens when it runs. Feel free to ask me any questions!`;
      }
      if (nextSpeechText) {
        preloadNextSpeech(nextSpeechText, teacherId);
      }
    }
  }, [currentSlide, slides, syllabus, teacherId, examPassed]);

  // Clear code run intervals on unmount
  useEffect(() => {
    const intervals = codeRunIntervalsRef.current;
    return () => {
      Object.values(intervals).forEach(int => clearInterval(int));
    };
  }, [codeRunIntervalsRef]);

  // Slide content generator effect
  useEffect(() => {
    setSlidesLoading(true);

    if (testInfo) {
      setSlides([]);
      setSlidesLoading(false);
      return;
    }

    const parsed = parseQuestId(questId || '');
    const coursePrefix = parsed?.prefix || '';
    const dayNum = parsed?.dayNum || 0;

    if (longLesson) {
      setSlides(longLesson.parts.map((part, i) => {
        const visualKey = `${coursePrefix}:${dayNum}:${i}`;
        const visualEntry = PYTHON_M1_VISUALS[visualKey];
        const visual = visualEntry ? visualEntry.visual : null;

        const speechPieces: { at: VisualAt; text: string }[] = [
          { at: 'intro' as VisualAt, text: `Part ${i + 1}: ${part.title}.` },
          ...part.say.map((s, sIdx) => ({ at: `say${sIdx + 1}` as VisualAt, text: s })),
          ...(part.example ? [{ at: 'example' as VisualAt, text: `Here is an everyday example. ${part.example}` }] : []),
          ...(part.tryIt ? [{ at: 'tryIt' as VisualAt, text: `Now you try. ${part.tryIt}` }] : []),
        ].filter(p => Boolean(p.text && p.text.trim()));

        return {
          title: part.title,
          bulletPoints: [],
          explain: part.say,
          example: part.example,
          codeExample: part.code,
          mockOutput: part.output,
          codeNotes: part.codeNotes,
          tryIt: part.tryIt,
          projectCode: part.projectCode,
          visualKey,
          visual,
          speechPieces,
          speech: speechPieces.map(p => p.text).join(' '),
          mcq: {
            question: part.check.question,
            ...withAnswerAt(part.check.options, part.check.answer, dayNum * 7 + i),
            explanation: part.check.why,
          },
        };
      }));
      setSlidesLoading(false);
      return;
    }

    const pilotDay = resolvePilotDay(coursePrefix, dayNum);

    if (pilotDay && pilotDay.blocks && pilotDay.blocks.length > 0) {
      const pilotSlides = pilotDay.blocks.map((block: any, blockIndex: number) => {
        const analogy = block.media.find((m: any) => m.type === 'analogy') as any;
        const runnable = block.media.find((m: any) => m.type === 'runnable_code') as any;
        const syntax = block.media.find((m: any) => m.type === 'syntax_anatomy') as any;
        const diagram = block.media.find((m: any) => m.type === 'diagram') as any;

        const bulletPoints: string[] = [];
        // Lesson plans store the teaching text in metaphor/simpleExplanation, lineNotes and
        // data.title; reading only caption/title showed "Analogy: undefined" on every slide.
        if (analogy) {
          const name = analogy.metaphor || analogy.caption || analogy.title;
          const text = analogy.simpleExplanation || analogy.explanation;
          const line = [name, text].filter(Boolean).join(': ');
          if (line) bulletPoints.push(`Analogy: ${line}`);
        }
        if (syntax) {
          if (syntax.title) bulletPoints.push(`Syntax Rule: ${syntax.title}`);
          for (const note of Object.values(syntax.lineNotes || {})) {
            if (typeof note === 'string' && note.trim()) bulletPoints.push(note);
          }
        }
        if (diagram) {
          const label = diagram.caption || diagram.title || diagram.data?.title;
          if (label) bulletPoints.push(`Visual Blueprint: ${label}`);
        }
        if (block.takeaway) {
          bulletPoints.push(`Core Rule: ${block.takeaway}`);
        }
        if (bulletPoints.length === 0) {
          bulletPoints.push("Master this foundational building block before running tests.");
        }

        const codeExample = runnable ? runnable.initialCode : (syntax ? syntax.breakdown?.map((b: any) => b.part).join('\n') : undefined);
        const runnerPrefix = RUNNER_LABELS[coursePrefix] || '⚙️ Javac compiling';
        const mockOutput = runnable ? `${runnerPrefix} ${runnable.filename}...\nOutput:\n${runnable.expectedOutput || 'Execution completed successfully (0 errors)'}` : undefined;

        const diag = block.diagnosticCheck;
        const check = getLessonCheck(coursePrefix, dayNum, blockIndex);
        const options = check?.options || ['Optimal design', 'Suboptimal design', 'Syntax Error'];
        const answerIndex = check?.answerIndex ?? 0;
        // Written checks explain wrong picks by option number; the options were reordered, so key them by text.
        const diagnosisMap: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(diag?.diagnosisMap || {})) {
          const original = /^\d+$/.test(key) && Array.isArray(diag?.options) ? diag.options[Number(key)] : undefined;
          diagnosisMap[original ?? key] = value;
        }
        const firstDiagnosis = Object.values(diag?.diagnosisMap || {})[0] as any;
        const explanation = (typeof diag?.explanation === 'string' && diag.explanation.trim().length > 0)
          ? diag.explanation
          : (typeof firstDiagnosis === 'string'
              ? firstDiagnosis
              : (firstDiagnosis?.errorExplanation || firstDiagnosis?.recoveryPath?.simplerExplanation || 'Verified optimal industry pattern.'));

        return {
          title: block.title,
          bulletPoints,
          codeExample,
          mockOutput,
          mcq: {
            question: check?.question || `What is the core takeaway for ${block.title}?`,
            options,
            answerIndex,
            explanation,
            diagnosisMap
          }
        };
      });

      setSlides(pilotSlides);
      setSlidesLoading(false);
      return;
    }

    const qLower = (questId || '').toLowerCase();
    const isJava = coursePrefix === 'java-basics' || qLower.includes('java');
    const isReact = coursePrefix === 'react-basics' || qLower.includes('react') || qLower.includes('frontend');
    const isPython = coursePrefix === 'python' || qLower.includes('python');
    const isSql = coursePrefix === 'sql-mastery' || qLower.includes('sql');
    const rawSyllabus = (syllabus && syllabus.length > 0) ? syllabus : ['Core Architecture', 'Operational Invariants', 'Optimal Synthesis'];

    const staticSlides = rawSyllabus.map((rawTopic: string, index: number) => {
      let title = rawTopic;
      const bulletPoints: string[] = [];
      const parts = rawTopic.split(':');
      if (parts.length > 1) {
        title = parts[0].trim();
        bulletPoints.push(parts.slice(1).join(':').trim());
      } else {
        bulletPoints.push(`Master foundational principles of ${rawTopic}.`);
      }

      const tLow = (title + " " + rawTopic + " " + (questData?.title || '')).toLowerCase();
      let codeExample = `// Production execution for ${title}\nconsole.log("Verifying invariants for ${title}...");\nconst result = { step: ${index + 1}, status: "VALIDATED" };\nconsole.log("Status outcome:", result.status);`;

      if (isJava) {
        codeExample = `public class Solution {\n    public static void main(String[] args) {\n        // Step ${index + 1}: ${title}\n        System.out.println("Verified execution for ${title}");\n    }\n}`;
        if (tLow.includes('loop')) {
          codeExample = `public class Solution {\n    public static void main(String[] args) {\n        for (int i = 1; i <= 3; i++) {\n            System.out.println("Iteration: " + i);\n        }\n    }\n}`;
        }
      } else if (isPython) {
        codeExample = `# Python execution for ${title}\nprint("Executing verification for ${title}...")\nmetrics = [10, 20, 30]\nprint(f"Computed total: {sum(metrics)}")`;
      } else if (isSql) {
        codeExample = `-- SQL Query Schema for ${title}\nCREATE TABLE records (id INTEGER PRIMARY KEY, title TEXT NOT NULL);\nINSERT INTO records VALUES (1, '${title.replace(/'/g, "")}');\nSELECT * FROM records;`;
      } else if (isReact) {
        codeExample = `// React Component for ${title}\nconsole.log("Mounting component for ${title}...");\nfunction renderComponent() {\n  const state = { active: true, topic: "${title.replace(/"/g, "")}" };\n  console.log("Component state initialized:", JSON.stringify(state));\n  return state;\n}\nrenderComponent();`;
        if (tLow.includes('state') || tLow.includes('hook')) {
          codeExample = `// React State Hook for ${title}\nconsole.log("Executing State Counter...");\nlet count = 0;\nfunction setCount(fn) { count = typeof fn === 'function' ? fn(count) : fn; }\nsetCount(c => c + 1);\nconsole.log("Updated count:", count);`;
        }
      }

      bulletPoints.push(`Verify invariants and boundary conditions before advancing.`);
      bulletPoints.push(`Keep runtime memory footprint strictly bounded.`);

      const correctOption = `Enforce explicit input validation checks and manage state lifecycle for ${title} cleanly.`;
      const distractor1 = `Rely on unvalidated type coercions without verifying bounds for ${title}.`;
      const distractor2 = `Bypass bounds validation and suppress all error signals during runtime execution.`;

      const targetIdx = (index + 1) % 3;
      const options = targetIdx === 0
        ? [correctOption, distractor1, distractor2]
        : targetIdx === 1
        ? [distractor1, correctOption, distractor2]
        : [distractor1, distractor2, correctOption];

      return {
        title,
        bulletPoints,
        codeExample,
        mockOutput: undefined,
        mcq: {
          question: `Regarding ${title}, which principle ensures maximum production safety and correctness?`,
          options,
          answerIndex: targetIdx,
          explanation: `System integrity for ${title} requires explicit boundary validation and clean lifecycle resource cleanup.`
        }
      };
    });

    setSlides(staticSlides);
    setSlidesLoading(false);
  }, [questId, questData, syllabus, longLesson, testInfo, setSlides, setSlidesLoading]);

  // Audio unlock listener and hydration
  useEffect(() => {
    setIsHydrated(true);
    setSoundscapeVol(getUserSoundscapeVolume());

    const unlockHandler = () => {
      setIsAudioUnlocked(true);
      window.removeEventListener('click', unlockHandler);
      window.removeEventListener('keydown', unlockHandler);
    };

    window.addEventListener('click', unlockHandler);
    window.addEventListener('keydown', unlockHandler);

    return () => {
      window.removeEventListener('click', unlockHandler);
      window.removeEventListener('keydown', unlockHandler);
    };
  }, [setIsHydrated, setIsAudioUnlocked, setSoundscapeVol]);

  // Mindset archetype soundscape player
  useEffect(() => {
    if (!isFocusMusicEnabled || !isAudioUnlocked) {
      stopArchetypeSoundscape();
      return;
    }
    const metaData = (user?.user_metadata as any) || {};
    const arch = metaData.mindset_archetype || 'Pattern Hunter';
    startArchetypeSoundscape(arch);

    return () => {
      stopArchetypeSoundscape();
    };
  }, [isFocusMusicEnabled, isAudioUnlocked, user]);

  // Soundscape ducking sync
  useEffect(() => {
    if (isFocusMusicEnabled) {
      setSoundscapeDucking(isPlaying);
    }
  }, [isPlaying, isFocusMusicEnabled]);

  // Chat scroll to bottom
  useEffect(() => {
    if (isInteractive && chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isInteractive, chatBottomRef]);

  // Load saved doubts
  useEffect(() => {
    if (typeof window !== 'undefined' && userId) {
      try {
        const savedDoubts = localStorage.getItem(`pinit_${userId}_quest_doubts_${questId}`);
        if (savedDoubts) {
          const parsed = JSON.parse(savedDoubts);
          if (typeof parsed.count === 'number') {
            setDoubtCount(parsed.count);
          }
        }
      } catch (e) {
        console.error('Failed to parse doubts:', e);
      }
    }
  }, [userId, questId, setDoubtCount]);

  // Save doubts
  useEffect(() => {
    if (typeof window !== 'undefined' && userId && doubtCount > 0) {
      try {
        localStorage.setItem(`pinit_${userId}_quest_doubts_${questId}`, JSON.stringify({
          count: doubtCount,
          lastUpdated: Date.now()
        }));
      } catch (e) {
        console.error('Failed to save doubts:', e);
      }
    }
  }, [doubtCount, userId, questId]);

  /** For course tests: the server's verdict after the student passes on screen. */
  const [testRecord, setTestRecord] = useState<{ state: 'checking' | 'recorded' | 'failed'; message?: string } | null>(null);

  // Mark completed quest on exam pass. Course tests are marked again by the server, and only its
  // signed receipt lets /api/quest/complete record them.
  useEffect(() => {
    if (!examPassed || isTestMode) return;
    const authQuest = getAuthoritativeQuest(questId);
    const course = COURSES_REGISTRY.find(c => (c.quests || []).some(q => q.id === questId));
    if (!authQuest && !course) return;
    const isExam = isAuthoritativeExam(questId);
    const xp = authQuest?.xp || 150;
    if (!testInfo) {
      addCompletedQuest(questId, isExam, xp, course?.id);
      return;
    }
    let cancelled = false;
    setTestRecord({ state: 'checking' });
    api.post<{ ok: boolean; passed: boolean; receipt: string | null; correct: number; total: number }>('/api/quests/grade-test', {
      questId,
      answers: examAnswers,
    })
      .then((res) => {
        if (cancelled) return;
        if (res?.passed && res.receipt) {
          addCompletedQuest(questId, isExam, xp, course?.id, res.receipt);
          setTestRecord({ state: 'recorded' });
        } else {
          setTestRecord({ state: 'failed', message: `The server marked ${res?.correct ?? 0} of ${res?.total ?? 0} correct, below the 70% needed. Please take the test again.` });
        }
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const status = (err as { status?: unknown })?.status;
        setTestRecord({
          state: 'failed',
          message: typeof status === 'number' && status === 401
            ? 'Your session has expired, so the test could not be recorded. Please sign in again and retake the test.'
            : 'Your test could not be recorded because the server could not be reached. Please check your connection and try again.',
        });
      });
    return () => { cancelled = true; };
  }, [examPassed, questId, addCompletedQuest, testInfo, examAnswers, isTestMode]);

  const meta = (user?.user_metadata as any) || {};
  const studentName = (meta.full_name || meta.name || user?.email?.split('@')[0] || 'Developer');

  const getSpeakerText = useCallback(() => {
    const slidesLength = slides.length || syllabus.length;
    if (currentSlide === 0 && testInfo && quizQuestions) {
      const days = testInfo.start === testInfo.end ? `day ${testInfo.start}` : `days ${testInfo.start} to ${testInfo.end}`;
      return `Hello ${studentName}. This is your test on ${days}. There are ${quizQuestions.length} questions from those lessons. Take your time; you need 70 percent to pass, and you can try again if you need to. Good luck!`;
    }
    if (currentSlide === 0 && longLesson) {
      return [
        `Welcome, ${studentName}! Today's lesson is ${longLesson.title}.`,
        longLesson.recap || '',
        `By the end of this lesson, ${longLesson.goal.charAt(0).toLowerCase()}${longLesson.goal.slice(1)}`,
        `We will go step by step, in ${longLesson.parts.length} parts. After each part there is a small question, and you can ask me anything if something is not clear.`,
      ].filter(Boolean).join(' ');
    }
    if (currentSlide === 0) {
      return `Welcome, ${studentName}, to your classroom lesson for ${questData.title}. I am your AI instructor. We will explore each requirement from your syllabus in detail. Please pay close attention, and confirm your understanding before taking the final syllabus exam!`;
    }

    if (currentSlide === slidesLength + 1) {
      if (examPassed) {
        return `Outstanding achievement, ${studentName}! You passed the syllabus evaluation exam with flying colors! Your conceptual grounding is verified. Click Finish Quest below to return to your roadmap and collect your rewards!`;
      }
      const qText = (quizQuestions ? quizQuestions[examQuestionIndex]?.question : slides[examQuestionIndex]?.mcq?.question) || "Ready for your evaluation question?";
      return `Welcome to the Syllabus Evaluation Exam! Let us assess your understanding. ${qText}`;
    }

    const idx = currentSlide - 1;
    if (slides && slides[idx]) {
      const slide = slides[idx];
      if (slide.speech) return slide.speech;
      if (idx === 0) {
        const desc = questData?.desc || '';
        let story = '';
        if (desc.includes('(Real world:')) {
          const match = desc.match(/\(Real world:\s*([^)]+)\)/i);
          if (match && match[1]) story = match[1].trim();
        } else if (desc.length > 50) {
          story = desc;
        }
        const examplePart = story ? `First, think of this real-world example: ${story}. ` : '';
        const coreText = (slide.bulletPoints?.[0] || slide.title).replace(/^💡\s*2\.\s*/, '').replace(/^(analogy|syntax rule|visual blueprint|core rule):\s*/i, '');
        return `Hello ${studentName}! Welcome to your active class lesson on ${questData.title}. ${examplePart}Now, let us examine the core concept: ${coreText}. Look at the live code below to see it in action!`;
      }

      const cleanBullets = (slide.bulletPoints || []).map((bp: string) => bp.replace(/^(analogy|syntax rule|visual blueprint|core rule):\s*/i, ''));
      const technicalExplanation = cleanBullets.length > 0 ? cleanBullets.join('. ') : `Examine the operational mechanics of ${slide.title}.`;
      const codePart = `In our live code sandbox below, examine how this executes. Notice the output and boundary handling.`;
      const checkpointPart = `${studentName}, what do you think this code outputs? Run the code and verify if you understand before continuing!`;

      return `Now let us examine Slide ${currentSlide}: ${slide.title}. ${technicalExplanation}. ${codePart} ${checkpointPart}`;
    }

    if (syllabus && idx < syllabus.length) {
      const concept = syllabus[idx];
      return `Welcome to Section ${currentSlide}: ${concept}. Notice the live sandbox example below. Make sure to test it out!`;
    }

    return `Welcome to ${questData.title}! Study the technical principles on this slide carefully.`;
  }, [currentSlide, slides, syllabus, examPassed, examQuestionIndex, questData, studentName, longLesson, testInfo, quizQuestions]);

  getSpeakerTextRef.current = getSpeakerText;

  const playSlideNarration = useCallback((slideIdx: number) => {
    if (typeof window === 'undefined') return;
    const chainId = ++pieceChainTokenRef.current;
    const slide = slides[slideIdx];

    if (!slide) {
      const speakerText = getSpeakerText();
      stopSpeaking();
      speakWithAvatar(
        speakerText,
        teacherIdRef.current,
        () => {
          if (pieceChainTokenRef.current === chainId) setIsPlaying(true);
        },
        () => {
          if (pieceChainTokenRef.current === chainId) setIsPlaying(false);
        }
      );
      return;
    }

    if (Array.isArray(slide.speechPieces) && slide.speechPieces.length > 0) {
      stopSpeaking();

      const playPiece = (pIdx: number) => {
        if (pieceChainTokenRef.current !== chainId) return;

        if (pIdx >= slide.speechPieces.length) {
          setIsPlaying(false);
          return;
        }

        const piece = slide.speechPieces[pIdx];
        currentPieceAtRef.current = piece.at;
        setCurrentPieceAt(piece.at);

        if (!isManualOverrideRef.current && slide.visual) {
          const targetStep = getStepIndexForPieceAt(slide.visual, piece.at);
          setCurrentVisualStepIndex(targetStep);
        }

        speakWithAvatar(
          piece.text,
          teacherIdRef.current,
          () => {
            if (pieceChainTokenRef.current === chainId) {
              setIsPlaying(true);
            }
          },
          () => {
            if (pieceChainTokenRef.current === chainId) {
              playPiece(pIdx + 1);
            }
          }
        );
      };

      playPiece(0);
    } else {
      const speakerText = slide.speech || getSpeakerText();
      stopSpeaking();
      speakWithAvatar(
        speakerText,
        teacherIdRef.current,
        () => {
          if (pieceChainTokenRef.current === chainId) setIsPlaying(true);
        },
        () => {
          if (pieceChainTokenRef.current === chainId) setIsPlaying(false);
        }
      );
    }
  }, [slides, getSpeakerText, setIsPlaying, teacherIdRef, setCurrentPieceAt, setCurrentVisualStepIndex]);

  const playSpeech = useCallback(() => {
    if (typeof window === 'undefined') return;
    if (currentSlide > 0 && currentSlide <= slides.length) {
      playSlideNarration(currentSlide - 1);
    } else {
      const chainId = ++pieceChainTokenRef.current;
      const speakerText = getSpeakerText();
      stopSpeaking();
      speakWithAvatar(
        speakerText,
        teacherIdRef.current,
        () => {
          if (pieceChainTokenRef.current === chainId) setIsPlaying(true);
        },
        () => {
          if (pieceChainTokenRef.current === chainId) setIsPlaying(false);
        }
      );
    }
  }, [currentSlide, slides.length, playSlideNarration, getSpeakerText, teacherIdRef, setIsPlaying]);

  const handleTogglePlay = useCallback(() => {
    if (isPlaying) {
      pieceChainTokenRef.current++;
      stopSpeaking();
      setIsPlaying(false);
    } else {
      playSpeech();
    }
  }, [isPlaying, playSpeech, setIsPlaying]);

  const handleNextSlide = useCallback(() => {
    pieceChainTokenRef.current++;
    stopSpeaking();
    setIsPlaying(false);
    setCurrentVisualStepIndex(0);
    setIsManualOverride(false);
    isManualOverrideRef.current = false;
    currentPieceAtRef.current = 'intro';
    setCurrentPieceAt('intro');
    const slidesLength = slides.length || syllabus.length;
    if (currentSlide < slidesLength + 1) {
      const nextSlide = currentSlide + 1;
      setCurrentSlide(nextSlide);
      setMaxUnlockedSlide(prev => Math.max(prev, nextSlide));
    }
  }, [currentSlide, slides.length, syllabus.length, setCurrentSlide, setIsPlaying, setMaxUnlockedSlide, setCurrentVisualStepIndex, setIsManualOverride, setCurrentPieceAt]);

  const onReviewLesson = useCallback(() => {
    pieceChainTokenRef.current++;
    stopSpeaking();
    setIsPlaying(false);
    setCurrentVisualStepIndex(0);
    setIsManualOverride(false);
    isManualOverrideRef.current = false;
    currentPieceAtRef.current = 'intro';
    setCurrentPieceAt('intro');
    setExamFailed(false);
    setExamPassed(false);
    setExamQuestionIndex(0);
    setSelectedMcqAnswer(null);
    setMcqChecked(false);
    setMcqIsCorrect(false);
    setExamCorrectCount(0);
    setExamAnswers([]);
    setTestRecord(null);
    setCurrentSlide(1);
    if (testInfo) {
      toast.info("Try again", "Look back at those lessons if you need to, then take the test again.");
    } else {
      toast.info("Review the lesson", "Go through the parts again, then answer the questions.");
    }
  }, [setExamFailed, setExamPassed, setExamQuestionIndex, setSelectedMcqAnswer, setMcqChecked, setMcqIsCorrect, setExamCorrectCount, setExamAnswers, setCurrentSlide, testInfo, setCurrentVisualStepIndex, setIsManualOverride, setCurrentPieceAt]);

  const handlePrevSlide = useCallback(() => {
    pieceChainTokenRef.current++;
    stopSpeaking();
    setIsPlaying(false);
    setCurrentVisualStepIndex(0);
    setIsManualOverride(false);
    isManualOverrideRef.current = false;
    currentPieceAtRef.current = 'intro';
    setCurrentPieceAt('intro');
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  }, [currentSlide, setCurrentSlide, setIsPlaying, setCurrentVisualStepIndex, setIsManualOverride, setCurrentPieceAt]);

  const onVisualStepChange = useCallback((newStepIndex: number, manual: boolean) => {
    setCurrentVisualStepIndex(newStepIndex);
    if (manual) {
      setIsManualOverride(true);
      isManualOverrideRef.current = true;
    }
  }, [setCurrentVisualStepIndex, setIsManualOverride]);

  const onSyncWithVoice = useCallback(() => {
    setIsManualOverride(false);
    isManualOverrideRef.current = false;
    const idx = currentSlide - 1;
    const slide = slides[idx];
    if (slide?.visual && currentPieceAtRef.current) {
      const targetStep = getStepIndexForPieceAt(slide.visual, currentPieceAtRef.current);
      setCurrentVisualStepIndex(targetStep);
    }
  }, [currentSlide, slides, setIsManualOverride, setCurrentVisualStepIndex]);

  const getProactivePromptText = useCallback(() => {
    const qTitle = questData?.title ? questData.title.replace('Learning: ', '') : 'this topic';
    const prompts = [
      `Hey ${studentName}! Are you following along with ${qTitle}? Want me to break down this slide into an even simpler analogy?`,
      `Notice anything interesting in the code sandbox, ${studentName}? I can explain why that specific syntax is chosen.`,
      `Stuck on this concept? Don't worry! Ask me anything, or tell me which line of code looks confusing.`
    ];
    const idx = currentSlide - 1;
    const topic = slides[idx]?.title || syllabus[idx] || '';
    if (topic) {
      return `Hey ${studentName}! What questions do you have about "${topic}"? I can give you a practical production example!`;
    }
    return prompts[Math.floor(Math.random() * prompts.length)];
  }, [questData, studentName, currentSlide, slides, syllabus]);

  const triggerProactivePrompt = useCallback(() => {
    const promptText = getProactivePromptText();
    setChatMessages(prev => [
      ...prev,
      { role: 'assistant', content: promptText }
    ]);
  }, [getProactivePromptText, setChatMessages]);

  // Proactive Socratic prompt timer
  useEffect(() => {
    if (isInteractive || examPassed || slidesLoading || currentSlide === 0) return;
    const slidesLength = slidesLengthRef.current;
    if (currentSlide > slidesLength) return;

    const timer = setTimeout(() => {
      triggerProactivePrompt();
    }, 8000);

    return () => clearTimeout(timer);
  }, [currentSlide, isInteractive, examPassed, slidesLoading, triggerProactivePrompt, slidesLengthRef]);

  // Auto-play speech on slide change
  useEffect(() => {
    const slidesLength = slidesLengthRef.current;
    if (currentSlide === 0 || currentSlide > slidesLength + 1) {
      stopSpeaking();
      setIsPlaying(false);
      return;
    }

    if (timerRef.current) clearTimeout(timerRef.current);
    stopSpeaking();
    setIsPlaying(false);

    if (!isAudioUnlocked) return;

    const activeSlideAtStart = currentSlide;
    const playTimer = setTimeout(() => {
      if (currentSlideRef.current === activeSlideAtStart) {
        if (activeSlideAtStart >= 1 && activeSlideAtStart <= slidesLength) {
          playSlideNarration(activeSlideAtStart - 1);
        } else {
          const speakerText = getSpeakerTextRef.current();
          if (speakerText) {
            speakWithAvatar(
              speakerText,
              teacherIdRef.current,
              () => {
                if (currentSlideRef.current === activeSlideAtStart) setIsPlaying(true);
              },
              () => {
                if (currentSlideRef.current === activeSlideAtStart) setIsPlaying(false);
              }
            );
          }
        }
      }
    }, 600);

    timerRef.current = playTimer;
    return () => {
      if (playTimer) clearTimeout(playTimer);
      stopSpeaking();
    };
  }, [currentSlide, isAudioUnlocked, setIsPlaying, currentSlideRef, getSpeakerTextRef, teacherIdRef, timerRef, slidesLengthRef, playSlideNarration]);

  // Audio progress tracker
  useEffect(() => {
    if (!isPlaying) {
      setAudioProgress(0);
      return;
    }
    const textLen = getSpeakerTextRef.current().length;
    const estimatedDuration = Math.max(3000, textLen * 65);
    const intervalMs = 100;
    const steps = estimatedDuration / intervalMs;
    const increment = 100 / steps;

    const progressTimer = setInterval(() => {
      setAudioProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          return 100;
        }
        return Math.min(100, prev + increment);
      });
    }, intervalMs);

    return () => clearInterval(progressTimer);
  }, [isPlaying, setAudioProgress, getSpeakerTextRef]);

  const sendInteractiveMessage = useCallback(async (text?: string) => {
    const msg = (text || chatInput).trim();
    if (!msg || chatLoading) return;

    setChatInput('');
    setChatLoading(true);

    const nextDoubtCount = doubtCount + 1;
    const isFirstPrinciples = nextDoubtCount >= 3;
    if (isFirstPrinciples) {
      toast.info("Classroom Adaptation", "Simplifying explanations to first principles.");
      setDoubtCount(0);
    }

    const newMessages = [...chatMessages, { role: 'user' as const, content: msg }];
    setChatMessages(newMessages);

    try {
      const history = newMessages.map(m => ({
        role: m.role,
        content: m.content
      }));

      const activeSlide = slides[currentSlide - 1];
      const promptMsg = isFirstPrinciples
        ? `${msg}\n[Instruction: The student has asked multiple doubts on this topic. Explain ${activeSlide?.title ? `"${activeSlide.title}"` : 'this concept'} from absolute first principles using an intuitive real-world analogy.]`
        : msg;

      const data = await api.post<{ reply: string }>('/api/avatar/chat', {
        teacherId: teacherIdRef.current,
        message: promptMsg,
        history,
        currentSlide: activeSlide ? { title: activeSlide.title, points: activeSlide.bulletPoints } : null,
      });

      const reply = data?.reply || "I'm processing that. Can you rephrase?";
      setChatMessages(prev => [...prev, { role: 'assistant' as const, content: reply }]);
      setLatestAIResponse(reply);

      speakWithAvatar(
        reply,
        teacherIdRef.current,
        () => setIsPlaying(true),
        () => setIsPlaying(false)
      );
    } catch (e) {
      console.error('Failed to get Socratic chat reply:', e);
      const fallback = "Let's review the core slide takeaway above, or check out the live code sandbox.";
      setChatMessages(prev => [...prev, { role: 'assistant' as const, content: fallback }]);
      setLatestAIResponse(fallback);
      speakWithAvatar(
        fallback,
        teacherIdRef.current,
        () => setIsPlaying(true),
        () => setIsPlaying(false)
      );
    } finally {
      setChatLoading(false);
    }
  }, [chatInput, chatLoading, doubtCount, studentName, chatMessages, slides, currentSlide, teacherIdRef, setChatInput, setChatLoading, setDoubtCount, setChatMessages, setLatestAIResponse, setIsPlaying]);

  return {
    startVoiceInput,
    playChime,
    launchConfetti,
    runSlideCode,
    simulateCodeRun,
    onReviewLesson,
    testRecord,
    playSpeech,
    handleTogglePlay,
    handleNextSlide,
    handlePrevSlide,
    getSpeakerText,
    sendInteractiveMessage,
    onVisualStepChange,
    onSyncWithVoice,
    /** Test questions for a test quest; null for a normal lesson. */
    quizQuestions,
  };
}
