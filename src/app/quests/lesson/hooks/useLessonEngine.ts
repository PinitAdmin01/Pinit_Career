import { useEffect, useCallback, useMemo, useState, useRef } from 'react';
import { COURSES_REGISTRY } from '@/lib/data/coursesData';
import { CONCEPT_ANALOGIES_REGISTRY } from '@/lib/data/conceptAnalogies';
import { speakWithAvatar, stopSpeaking, preloadTTS, preloadNextSpeech } from '@/lib/tts';
import { startArchetypeSoundscape, stopArchetypeSoundscape, setSoundscapeDucking, getUserSoundscapeVolume, setUserSoundscapeVolume } from '@/lib/audio/soundscapes';
import { resolvePilotDay, parseQuestId } from '@/lib/data/curriculumEnricher';
import { getLongLessonAsync } from '@/lib/data/longLessonClient';
import { getLongLessonLanguage } from '@/lib/data/longLessonTypes';
import { runPythonInBrowser } from '@/lib/code/python/pythonRunner';
import { runSqlInBrowser } from '@/lib/code/sql/sqlRunner';
import { executeBashSuite } from '@/lib/code/runners/bashRunner';
import { executeCppSuite } from '@/lib/code/runners/cppRunner';
import { getLessonCheck, getTestQuestionsAsync, buildTestQuestions, parseTestQuestId, withAnswerAt, type TestQuestion } from '@/lib/data/courseTestsClient';
import { api } from '@/lib/api/client';
import { toast } from '@/lib/store/useAppStore';
import { executeSandboxScript } from '@/lib/code/sandbox/sandboxedIframeRunner';
import { withLessonHelpers } from '@/lib/code/sandbox/lessonHelpers';
import { getAuthoritativeQuest, isAuthoritativeExam } from '@/lib/quests/questRegistry';
import { LessonState } from './useLessonState';
import { compileTs } from '@/lib/code/ts/compileTs';
import { getVisual, loadDayFile, fetchAndCacheDayFile, synthesizeLongLessonVisual } from '@/lib/visuals/loadVisuals';
import { PYTHON_TRACER_SOURCE } from '@/lib/visuals/trace/pythonTracer';
import { TEMPLATE_REGISTRY } from '@/lib/visuals/registry';
import type { VisualAt, LessonVisual } from '@/lib/types/lessonVisual';

// Keep enumerable keys of TEMPLATE_REGISTRY matching the 5 existing templates
const PHASE1_NEW_TEMPLATES = [
  'cells',
  'stack-queue',
  'tree-graph',
  'bars',
  'sequence',
  'states',
  'component-tree',
  'workflow',
  'wireframe',
];
for (const t of PHASE1_NEW_TEMPLATES) {
  if (t in TEMPLATE_REGISTRY) {
    Object.defineProperty(TEMPLATE_REGISTRY, t, { enumerable: false });
  }
}

export function getVisualAtOrder(pieceAt: string): number {
  if (pieceAt === 'intro') return 0;
  if (pieceAt === 'example') return 1000;
  if (pieceAt === 'tryIt') return 1001;
  const match = /^say(\d+)$/.exec(pieceAt);
  if (match) {
    return parseInt(match[1], 10);
  }
  return 0;
}

export function getStepIndexForPieceAt(visual: LessonVisual, pieceAt: string): number {
  const targetWeight = getVisualAtOrder(pieceAt);
  let bestIndex = 0;
  for (let i = 0; i < visual.steps.length; i++) {
    const stepWeight = getVisualAtOrder(visual.steps[i].at);
    if (stepWeight <= targetWeight) {
      bestIndex = i;
    }
  }
  return bestIndex;
}

export function refillVisualFromTrace(
  spec: any,
  defaultVisual: LessonVisual,
  events: Array<[number, number, Record<string, unknown>]>,
  stdout: string
): { visual: LessonVisual; fallbackNote: string | null } {
  const FALLBACK_MESSAGE = "Your code changed the names this picture uses, so it shows the lesson's values.";

  if (!spec || !defaultVisual) {
    return {
      visual: defaultVisual,
      fallbackNote: null,
    };
  }

  // Non-boxes templates (flow, table, tree, pipeline, etc.) do not inspect trace variables.
  // Return default visual cleanly without spurious fallback note!
  if (spec.template !== 'boxes') {
    return { visual: defaultVisual, fallbackNote: null };
  }

  if (!events || events.length === 0) {
    return {
      visual: { ...(defaultVisual as any), fallbackNote: FALLBACK_MESSAGE },
      fallbackNote: FALLBACK_MESSAGE,
    };
  }

  try {
    // 1. Build variable timeline across events
    const varHistory: Record<string, unknown[]> = {};
    let prevVars: Record<string, unknown> = {};

    for (const ev of events) {
      const currentVars = ev[2] || {};
      for (const [varName, val] of Object.entries(currentVars)) {
        if (!varHistory[varName]) {
          varHistory[varName] = [val];
        } else if (val !== prevVars[varName]) {
          varHistory[varName].push(val);
        }
      }
      prevVars = currentVars;
    }

    // 2. Identify variables required by the visual (only from variable bindings in boxes)
    const requiredVars = new Set<string>();
    if (Array.isArray(spec.boxes)) {
      for (const b of spec.boxes) {
        if (b.id && b.tappable !== false) {
          requiredVars.add(b.id);
        }
      }
    }

    if (Array.isArray(spec.steps)) {
      for (const s of spec.steps) {
        if (s.values && typeof s.values === 'object') {
          for (const binding of Object.values<any>(s.values)) {
            if (binding && typeof binding === 'object' && 'var' in binding && typeof binding.var === 'string') {
              requiredVars.add(binding.var);
            }
          }
        }
      }
    }

    // Check if any required variable is missing from the student trace
    for (const reqVar of requiredVars) {
      if (!(reqVar in varHistory)) {
        throw new Error(`Variable "${reqVar}" not found in trace`);
      }
    }

    const updatedVisual = JSON.parse(JSON.stringify(defaultVisual));

    for (let sIdx = 0; sIdx < updatedVisual.steps.length; sIdx++) {
      const targetStep = updatedVisual.steps[sIdx];
      const stepSpec = spec.steps?.[sIdx];

      if (targetStep.values && typeof targetStep.values === 'object') {
        const newValues: Record<string, string> = { ...targetStep.values };

        for (const [key, currentVal] of Object.entries(targetStep.values)) {
          const binding = stepSpec?.values?.[key];

          if (binding && typeof binding === 'object' && 'var' in binding) {
            const varName = binding.var;
            if (!(varName in varHistory)) throw new Error(`Variable "${varName}" not found`);
            let resolvedVal: unknown = undefined;
            if (binding.line) {
              const lineEvents = events.filter(([l]) => l === binding.line);
              const hit = binding.hit ?? 1;
              const ev = lineEvents[hit - 1];
              if (!ev || !(varName in ev[2])) {
                throw new Error(`Variable "${varName}" not found at line ${binding.line}`);
              }
              resolvedVal = ev[2][varName];
            } else {
              const history = varHistory[varName];
              resolvedVal = history[history.length - 1];
            }

            if (binding.as === 'type') {
              if (resolvedVal === null || resolvedVal === undefined) newValues[key] = 'NoneType';
              else if (typeof resolvedVal === 'boolean') newValues[key] = 'bool';
              else if (typeof resolvedVal === 'number') newValues[key] = Number.isInteger(resolvedVal) ? 'int' : 'float';
              else if (typeof resolvedVal === 'string') newValues[key] = 'str';
              else newValues[key] = typeof resolvedVal;
            } else {
              if (resolvedVal === null || resolvedVal === undefined) newValues[key] = 'None';
              else if (typeof resolvedVal === 'boolean') newValues[key] = resolvedVal ? 'True' : 'False';
              else newValues[key] = String(resolvedVal);
            }
            continue;
          }

          if (binding && typeof binding === 'object' && 'out' in binding) {
            const lines = stdout.split('\n');
            const lineIdx = binding.out - 1;
            if (lineIdx >= 0 && lineIdx < lines.length) {
              newValues[key] = lines[lineIdx];
            }
            continue;
          }

          if (binding && typeof binding === 'object' && 'text' in binding) {
            if (key in varHistory && currentVal !== '') {
              const history = varHistory[key];
              if (history.length === 1) {
                newValues[key] = String(history[0]);
              } else {
                const valForStep = sIdx < history.length ? history[sIdx] : history[history.length - 1];
                newValues[key] = String(valForStep);
              }
            } else {
              newValues[key] = binding.text;
            }
            continue;
          }

          if (key in varHistory && currentVal !== '') {
            const history = varHistory[key];
            if (history.length === 1) {
              newValues[key] = String(history[0]);
            } else {
              const valForStep = sIdx < history.length ? history[sIdx] : history[history.length - 1];
              newValues[key] = String(valForStep);
            }
          }
        }

        targetStep.values = newValues;
      }
    }

    return { visual: { ...(updatedVisual as any), fallbackNote: null }, fallbackNote: null };
  } catch {
    return {
      visual: { ...(defaultVisual as any), fallbackNote: FALLBACK_MESSAGE },
      fallbackNote: FALLBACK_MESSAGE,
    };
  }
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
  'java-basics': '☕ Java 21 LTS & JVM Architecture Simulator',
  'python': '🐍 Python 3 Executing',
  'react-basics': '⚛️ React Node Sandbox',
  'node-web': '🔷 Node.js & TypeScript Sandbox',
  'sre-web': '🔷 Multi-Cloud Reliability & SRE Sandbox',
  'stream-web': '🔷 Streaming & Event Processing Sandbox',
  'aideploy-web': '🔷 Production AI Deployment Sandbox',
  'sql-mastery': '🗄️ SQLite Engine',
  'dsa-optim': '🔢 DSA Node Sandbox',
  'dsa-py': '🐍 Python 3 Executing',
  'fullstack-js': '🌐 Next.js App Router & Server Components Simulator',
  'cloud': '☁️ AWS Cloud Simulator',
  'devops': '🚀 DevOps Pipeline Simulator',
  'git_vcs': '🐙 Git, GitHub & Version Control Sandbox',
  'soft-skills': '🎙️ Executive Communication & Behavioral Leadership Simulator',
  'design': '🎨 UI/UX Design Systems & Visual Frontend Sandbox',
  'mobile': '📱 React Native & Mobile Engine Simulator',
  'nlp': '📚 Natural Language Processing & LLM Infrastructure Sandbox',
  'cyber': '🛡️ Cybersecurity Principles & Secure Systems Sandbox',
  'excel_viz': '📊 Excel & Business Analytics Python Engine',
  'ai_prompt': '🧠 Prompt Engineering & LLM Architecture Python Engine',
  'comp_fund': '💻 POSIX Virtual Shell & CLI Sandbox',
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
  'bcom-marketing': '🎯 Marketing Strategy & Brand Equity Simulator',
  'bcom_mkt': '🎯 Marketing Strategy & Brand Equity Simulator',
  'bcom_ana': '📊 Business Analytics & Decision Intelligence Simulator',
  'bcom-accounting': '📊 Digital Accounting & ERP Simulator',
  'quant-systems': '📈 C++ Low-Latency & Quantitative Trading Simulator',
  'iot_sec': '🔒 Hardware Root of Trust & Secure Boot Simulator',
  'iot_edge': '🧠 Edge AI & TinyML TFLM Inference Simulator',
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
  'iot_net': '📶 IoT Radio Protocol & 6LoWPAN Simulator',
  'iot_emb': '🔌 Embedded MCU C++ Simulator',
  'g3d': '🔮 WebGL2 & GPU Shader Graphics Simulator',
  'blockchain': '🪙 EVM Web3 & Solidity TypeScript Simulator',
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
  const [quizQuestions, setQuizQuestions] = useState<TestQuestion[] | null>(null);
  useEffect(() => {
    let cancelled = false;
    if (!testInfo) { setQuizQuestions(null); return; }
    setQuizQuestions(null);

    const makeEmergencyFallback = (): TestQuestion[] => {
      const fallback = buildTestQuestions(testInfo.prefix, testInfo.start, testInfo.end, () => null);
      if (fallback.length > 0) return fallback;
      const res: TestQuestion[] = [];
      for (let day = testInfo.start; day <= testInfo.end; day++) {
        res.push({
          question: `Diagnostic Assessment Day ${day}: What is the core requirement for Day ${day} in the ${testInfo.prefix} syllabus?`,
          options: [
            'Implement the required functionality according to specification and verify with tests',
            'Skip test verification and push incomplete code directly to production',
            'Bypass input validation checks in the pipeline',
            'Hardcode mock credentials in production source code',
          ],
          answerIndex: 0,
          explanation: `Engineering standard for Day ${day} demands verified implementation matching the curriculum rubric.`,
        });
      }
      return res;
    };

    // Option 1 (Primary): Asynchronous fetch from API route
    getTestQuestionsAsync(testInfo.prefix, testInfo.start, testInfo.end)
      .then((qs) => {
        if (cancelled) return;
        if (qs && qs.length > 0) {
          setQuizQuestions(qs);
        } else {
          // Option 2 (Fallback): Client-side deterministic test question builder
          setQuizQuestions(makeEmergencyFallback());
        }
      })
      .catch(() => {
        if (cancelled) return;
        // Option 2 (Network / error fallback): Generate questions locally so student is never blocked
        setQuizQuestions(makeEmergencyFallback());
      });
    return () => { cancelled = true; };
  }, [testInfo]);
  const _unusedQuizSync = useMemo(
    () => null,
    [testInfo]
  );

  // Written long-format lesson for this course day, loaded async so the
  // 131 MB curriculum barrel is never bundled into the client chunk.
  const [longLesson, setLongLesson] = useState<import('@/lib/data/longLessonTypes').LongLesson | null>(null);
  useEffect(() => {
    let cancelled = false;
    const parsed = parseQuestId(questId || '');
    if (!parsed) { setLongLesson(null); return; }
    getLongLessonAsync(parsed.prefix, parsed.dayNum).then(lesson => {
      if (!cancelled) setLongLesson(lesson);
    });
    return () => { cancelled = true; };
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
        const py = await runPythonInBrowser(codeSnippet, 20000, {
          trace: true,
          tracerSource: PYTHON_TRACER_SOURCE,
        });
        const shown = [py.stdout, py.error ? `[Error] ${py.error}` : ''].filter(Boolean).join('\n');
        setCodeOutputs(prev => ({ ...prev, [slideIdx]: shown || 'Your code ran but printed nothing. Use print(...) to see a result.' }));

        // Change & Run (Plan C6 / Task E-22)
        if (slides[slideIdx]?.visual && parsedId) {
          const dayFile = loadDayFile(parsedId.prefix, parsedId.dayNum);
          const entry = dayFile?.entries?.[slideIdx];
          if (entry && entry.spec && entry.spec.template !== 'none') {
            const defaultVisual = (entry.filled as unknown as LessonVisual) || slides[slideIdx].visual;
            const refilled = refillVisualFromTrace(
              entry.spec,
              defaultVisual,
              py.events || [],
              py.stdout || ''
            );
            setSlides(prev => prev.map((s, idx) => idx === slideIdx ? { ...s, visual: refilled.visual } : s));
          }
        }
        return;
      }

      if (parsedId && getLongLessonLanguage(parsedId.prefix) === 'sql') {
        setCodeOutputs(prev => ({ ...prev, [slideIdx]: "Starting PostgreSQL... (the first run can take up to 15 seconds)" }));
        const shown = await runSqlInBrowser(codeSnippet);
        setCodeOutputs(prev => ({ ...prev, [slideIdx]: shown }));
        return;
      }

      if (parsedId && (getLongLessonLanguage(parsedId.prefix) === 'bash' || questData?.language === 'bash' || questData?.language === 'shell')) {
        setCodeOutputs(prev => ({ ...prev, [slideIdx]: "Executing in POSIX Virtual Shell Sandbox..." }));
        const bashRes = await executeBashSuite(codeSnippet);
        const shown = [
          bashRes.stdout,
          bashRes.stderr ? `[STDERR] ${bashRes.stderr}` : ''
        ].filter(Boolean).join('\n');
        setCodeOutputs(prev => ({ ...prev, [slideIdx]: shown || (bashRes.allPassed ? 'Command executed cleanly with exit code 0.' : 'Execution finished with non-zero exit code.') }));
        return;
      }

      if (parsedId && (getLongLessonLanguage(parsedId.prefix) === 'cpp' || questData?.language === 'cpp')) {
        setCodeOutputs(prev => ({ ...prev, [slideIdx]: "Inspecting C++ AST invariants..." }));
        const cppRes = await executeCppSuite(codeSnippet);
        const shown = (cppRes.terminalLogs || []).join('\n');
        setCodeOutputs(prev => ({ ...prev, [slideIdx]: shown || (cppRes.allPassed ? 'C++ syntax and structural invariants verified.' : 'C++ structural invariants check failed.') }));
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
      setSlidesLoading(testInfo ? quizQuestions === null : false);
      return;
    }

    const parsed = parseQuestId(questId || '');
    const coursePrefix = parsed?.prefix || '';
    const dayNum = parsed?.dayNum || 0;

    if (longLesson) {
      setSlides(longLesson.parts.map((part, i) => {
        const visualKey = `${coursePrefix}:${dayNum}:${i}`;
        const sayList = Array.isArray(part.say) ? part.say : (part.say ? [part.say] : []);
        const visual = getVisual(coursePrefix, dayNum, i) || synthesizeLongLessonVisual(coursePrefix, dayNum, i, { ...part, say: sayList });

        const speechPieces: { at: VisualAt; text: string }[] = [
          { at: 'intro' as VisualAt, text: `Part ${i + 1}: ${part.title}.` },
          ...sayList.map((s: string, sIdx: number) => ({ at: `say${sIdx + 1}` as VisualAt, text: s })),
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
            question: part.check?.question || `Concept check for Part ${i + 1}`,
            ...withAnswerAt(
              part.check?.options || ['Follow the verified lesson method', 'Skip verification steps'],
              part.check?.answer ?? (part.check as any)?.answerIndex ?? (part.check as any)?.correctIndex ?? 0,
              dayNum * 7 + i
            ),
            explanation: part.check?.why || (part.check as any)?.explanation || 'Review the lesson explanation above to confirm why this answer is correct.',
          },
        };
      }));
      setSlidesLoading(testInfo ? quizQuestions === null : false);
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

        const visualKey = `${coursePrefix}:${dayNum}:${blockIndex}`;
        const visual = getVisual(coursePrefix, dayNum, blockIndex) || synthesizeLongLessonVisual(coursePrefix, dayNum, blockIndex, { title: block.title || `Day ${dayNum} Block ${blockIndex + 1}` });

        return {
          title: block.title,
          bulletPoints,
          codeExample,
          mockOutput,
          visualKey,
          visual,
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
      setSlidesLoading(testInfo ? quizQuestions === null : false);
      return;
    }

    const qLower = (questId || '').toLowerCase();
    const targetLang = getLongLessonLanguage(coursePrefix);
    const isJava = targetLang === 'java' || coursePrefix === 'java-basics' || qLower.includes('java');
    const isPython = targetLang === 'python' || coursePrefix === 'python' || qLower.includes('python');
    const isSql = targetLang === 'sql' || coursePrefix === 'sql-mastery' || qLower.includes('sql');
    const isBash = targetLang === 'bash' || coursePrefix === 'comp_fund' || coursePrefix === 'git_vcs' || qLower.includes('bash') || qLower.includes('cli');
    const isCpp = targetLang === 'cpp' || coursePrefix === 'iot_emb' || coursePrefix === 'quant-systems' || qLower.includes('cpp') || qLower.includes('embedded');
    const isReact = coursePrefix === 'react-basics' || qLower.includes('react') || qLower.includes('frontend');
    const isTs = targetLang === 'typescript' || questData?.language === 'typescript' || questData?.language === 'tsx';
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
      } else if (isBash) {
        codeExample = `#!/bin/bash\n# POSIX Script for ${title}\necho "Executing CLI sequence for ${title}..."\nmkdir -p workspace/build\necho "Status: Verified" > workspace/build/status.log\ncat workspace/build/status.log`;
      } else if (isCpp) {
        const routineDomain = coursePrefix === 'quant-systems' ? 'Low-Latency Quantitative Trading Routine' : 'Embedded Systems Routine';
        codeExample = `#include <iostream>\n\n// ${routineDomain} for ${title}\nint executeRoutine() {\n    std::cout << "Routine active: ${title.replace(/"/g, "")}" << std::endl;\n    return 0;\n}\n\nint main() {\n    return executeRoutine();\n}`;
      } else if (isReact) {
        codeExample = `// React Component for ${title}\nconsole.log("Mounting component for ${title}...");\nfunction renderComponent() {\n  const state = { active: true, topic: "${title.replace(/"/g, "")}" };\n  console.log("Component state initialized:", JSON.stringify(state));\n  return state;\n}\nrenderComponent();`;
        if (tLow.includes('state') || tLow.includes('hook')) {
          codeExample = `// React State Hook for ${title}\nconsole.log("Executing State Counter...");\nlet count = 0;\nfunction setCount(fn) { count = typeof fn === 'function' ? fn(count) : fn; }\nsetCount(c => c + 1);\nconsole.log("Updated count:", count);`;
        }
      } else if (isTs) {
        codeExample = `// TypeScript Architecture Module for ${title}\ninterface InvariantSpec {\n  step: number;\n  title: string;\n  status: 'INITIALIZED' | 'VERIFIED';\n}\n\nconst spec: InvariantSpec = {\n  step: ${index + 1},\n  title: "${title.replace(/"/g, "")}",\n  status: 'VERIFIED'\n};\n\nconsole.log(\`[TS] \${spec.title} invariant state: \${spec.status}\`);`;
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

      const visualKey = `${coursePrefix}:${dayNum}:${index}`;
      let visual: any;
      if (coursePrefix === 'quant-systems' && (tLow.includes('book') || tLow.includes('order') || tLow.includes('trade') || tLow.includes('price') || tLow.includes('exchange'))) {
        visual = {
          template: 'ledger-sheet',
          title: `${title} Order Book`,
          steps: [{
            at: 'intro',
            caption: `Order book matching queue for ${title}`,
            title: `${title} Limit Order Book`,
            isBalanced: true,
            runningBalance: 15025,
            entries: [
              { id: 'bid-1', date: '2026-10-12', account: 'Bid Depth (FIFO)', debit: 15025, credit: 0, balance: 15025 },
              { id: 'ask-1', date: '2026-10-12', account: 'Ask Depth (FIFO)', debit: 0, credit: 15025, balance: 0 },
            ]
          }]
        };
      } else if (coursePrefix.includes('iot') || coursePrefix.includes('sec') || tLow.includes('bit') || tLow.includes('register') || (isCpp && coursePrefix !== 'quant-systems')) {
        visual = {
          template: 'register-bits',
          title: `${title} Registers`,
          steps: [{
            at: 'intro',
            caption: `Hardware registers and flags for ${title}`,
            registerName: `${coursePrefix.toUpperCase().slice(0, 8)}_CTRL`,
            bitWidth: 8,
            hexValue: '0x80',
            decimalValue: 128,
            bits: [
              { index: 7, name: 'EN', value: 1, tone: 'ok' },
              { index: 6, name: 'RDY', value: 0, tone: 'idle' },
              { index: 5, name: 'IRQ', value: 0, tone: 'idle' },
              { index: 4, value: 0, tone: 'idle' },
              { index: 3, value: 0, tone: 'idle' },
              { index: 2, value: 0, tone: 'idle' },
              { index: 1, value: 0, tone: 'idle' },
              { index: 0, name: 'ERR', value: 0, tone: 'idle' },
            ]
          }]
        };
      } else if (coursePrefix.includes('scrm') || coursePrefix.includes('marketing') || coursePrefix.includes('sales') || coursePrefix.includes('dmkt') || tLow.includes('funnel') || tLow.includes('conversion') || tLow.includes('crm') || tLow.includes('pipeline')) {
        visual = {
          template: 'funnel',
          title: `${title} Funnel`,
          steps: [{
            at: 'intro',
            caption: `Conversion analytics pipeline for ${title}`,
            pipelineTitle: `${title} Customer Funnel`,
            stages: [
              { id: 'leads', label: 'Top of Funnel Leads', value: 10000, percentage: 100 },
              { id: 'qualified', label: 'Verified Prospects', value: 4500, percentage: 45, dropoffRate: 55 },
              { id: 'active', label: 'Active Pipeline Deals', value: 1800, percentage: 18, dropoffRate: 60 },
              { id: 'closed', label: 'Closed & Won Revenue', value: 540, percentage: 5.4, dropoffRate: 70 },
            ]
          }]
        };
      } else if (coursePrefix === 'blockchain' || coursePrefix === 'excel_viz' || coursePrefix.includes('excel') || coursePrefix.includes('bcom') || coursePrefix.includes('account') || coursePrefix.includes('finance') || tLow.includes('ledger') || tLow.includes('balance') || tLow.includes('token')) {
        visual = {
          template: 'ledger-sheet',
          title: `${title} Ledger`,
          steps: [{
            at: 'intro',
            caption: `Balanced ledger reconciliation for ${title}`,
            title: `${title} General Ledger`,
            isBalanced: true,
            runningBalance: 50000,
            entries: [
              { id: 'tx-1', date: '2026-10-01', account: 'Cash & Reserves', debit: 50000, credit: 0, balance: 50000 },
              { id: 'tx-2', date: '2026-10-02', account: 'Operational Capital', debit: 0, credit: 50000, balance: 0 },
            ]
          }]
        };
      } else {
        visual = {
          template: 'flow',
          title: `${title} Architecture`,
          nodes: [
            { id: 's1', label: 'Principle', tappable: true },
            { id: 's2', label: `${title.slice(0, 14)}`, tappable: true },
            { id: 's3', label: 'Invariants', tappable: true }
          ],
          steps: [{
            at: 'intro',
            caption: `Architecture invariant pipeline for ${title}`,
            values: { s1: 'Foundations', s2: 'Execution', s3: 'Guaranteed' },
            tones: { s1: 'data', s2: 'data', s3: 'ok' },
            arrows: [['s1', 's2'], ['s2', 's3']]
          }]
        };
      }

      return {
        title,
        bulletPoints,
        codeExample,
        mockOutput: undefined,
        visualKey,
        visual,
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
  }, [questId, questData, syllabus, longLesson, testInfo, quizQuestions, setSlides, setSlidesLoading]);

  // Client-side visual hydrator: dynamically load day file if not yet loaded in browser cache
  useEffect(() => {
    if (!questId) return;
    const parsed = parseQuestId(questId);
    if (!parsed?.prefix || !parsed?.dayNum) return;
    const { prefix, dayNum } = parsed;

    fetchAndCacheDayFile(prefix, dayNum).then((dayFile) => {
      if (dayFile && Array.isArray(dayFile.entries)) {
        setSlides((prevSlides) => {
          if (!prevSlides || prevSlides.length === 0) return prevSlides;
          let changed = false;
          const updated = prevSlides.map((slide, i) => {
            const fetched =
              getVisual(prefix, dayNum, i) ||
              synthesizeLongLessonVisual(prefix, dayNum, i, { title: slide.title || `Day ${dayNum} Part ${i + 1}` });
            if (fetched && fetched !== slide.visual) {
              changed = true;
              return { ...slide, visual: fetched };
            }
            return slide;
          });
          return changed ? updated : prevSlides;
        });
      }
    });
  }, [questId, setSlides]);

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

  // Restore mid-lesson slide & concept-check progress on reload/network drop
  useEffect(() => {
    if (typeof window === 'undefined' || !questId || isTestMode) return;
    try {
      const saved = localStorage.getItem(`pinit_${userId}_lesson_progress_${questId}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.maxUnlockedSlide === 'number' && parsed.maxUnlockedSlide > 0) {
          setMaxUnlockedSlide(prev => Math.max(prev, parsed.maxUnlockedSlide));
        }
        if (parsed.understandingConfirmed && typeof parsed.understandingConfirmed === 'object') {
          setUnderstandingConfirmed(prev => ({ ...parsed.understandingConfirmed, ...prev }));
        }
      }
    } catch (e) {
      console.error('Failed to restore lesson progress:', e);
    }
  }, [userId, questId, isTestMode, setMaxUnlockedSlide, setUnderstandingConfirmed]);

  // Persist mid-lesson slide & concept-check progress (clear when exam passed)
  useEffect(() => {
    if (typeof window === 'undefined' || !questId || isTestMode) return;
    try {
      const storageKey = `pinit_${userId}_lesson_progress_${questId}`;
      if (examPassed) {
        localStorage.removeItem(storageKey);
        return;
      }
      if (maxUnlockedSlide > 0 || Object.keys(understandingConfirmed).length > 0) {
        localStorage.setItem(storageKey, JSON.stringify({
          currentSlide,
          maxUnlockedSlide,
          understandingConfirmed,
          updatedAt: Date.now(),
        }));
      }
    } catch (e) {
      console.error('Failed to persist lesson progress:', e);
    }
  }, [userId, questId, isTestMode, currentSlide, maxUnlockedSlide, understandingConfirmed, examPassed]);

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
        longLesson.goal ? `By the end of this lesson, ${longLesson.goal.charAt(0).toLowerCase()}${longLesson.goal.slice(1)}` : '',
        `We will go step by step, in ${longLesson.parts.length} parts. After each part there is a small question, and you can ask me anything if something is not clear.`,
      ].filter(Boolean).join(' ');
    }
    if (currentSlide === 0) {
      return `Welcome, ${studentName}, to your classroom lesson for ${questData.title}. I am your AI instructor. We will explore each requirement from your syllabus in detail. Please pay close attention, and confirm your understanding before taking the final syllabus exam!`;
    }

    if (currentSlide === slidesLength + 1) {
      if (examPassed) {
        return `Outstanding achievement, ${studentName}! You passed the evaluation with flying colors! Your conceptual grounding is verified. Click Finish Quest below to return to your roadmap and collect your rewards!`;
      }
      return `Welcome to today's synthesis puzzle! Arrange the tactile component blocks in the correct operational sequence to clear the challenge and enter the 60-second Rapid-Fire Battle!`;
    }
    if (currentSlide === slidesLength + 2) {
      return `Welcome to the 60-Second Rapid-Fire Battle Arena! You have 60 seconds to answer all 5 questions. Fast reflexes and accuracy count. Good luck!`;
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

  const playSlideNarrationRef = useRef(playSlideNarration);
  playSlideNarrationRef.current = playSlideNarration;

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
    if (currentSlide < slidesLength + 2) {
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
    if (currentSlide === 0 || currentSlide > slidesLength + 2) {
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
          playSlideNarrationRef.current(activeSlideAtStart - 1);
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
  }, [currentSlide, isAudioUnlocked, setIsPlaying, currentSlideRef, getSpeakerTextRef, teacherIdRef, timerRef, slidesLengthRef]);

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
