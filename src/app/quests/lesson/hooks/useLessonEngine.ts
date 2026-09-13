import { useEffect, useCallback, useMemo } from 'react';
import { COURSES_REGISTRY } from '@/lib/data/coursesData';
import { CONCEPT_ANALOGIES_REGISTRY } from '@/lib/data/conceptAnalogies';
import { speakWithAvatar, stopSpeaking, preloadTTS, preloadNextSpeech } from '@/lib/tts';
import { startArchetypeSoundscape, stopArchetypeSoundscape, setSoundscapeDucking, getUserSoundscapeVolume, setUserSoundscapeVolume } from '@/lib/audio/soundscapes';
import { resolvePilotDay, parseQuestId } from '@/lib/data/curriculumEnricher';
import { api } from '@/lib/api/client';
import { toast } from '@/lib/store/useAppStore';
import { LessonState } from './useLessonState';

const RUNNER_LABELS: Record<string, string> = {
  'java-basics': '⚙️ Javac compiling',
  'python': '🐍 Python 3 Executing',
  'react-basics': '⚛️ React Node Sandbox',
  'sql-mastery': '🗄️ SQLite Engine',
  'dsa-optim': '🔢 DSA Node Sandbox',
  'fullstack-js': '🌐 Fullstack Node/Next Sandbox',
  'cloud-native': '☁️ AWS Cloud Simulator',
  'devops': '🚀 DevOps Pipeline Simulator',
  'git_vcs': '🐙 Git, GitHub & Version Control Sandbox',
  'softskills': '🗣️ Professional Tech Communication & Interview Sandbox',
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
  'bcom_fin': '💹 Corporate Financial Management Simulator',
  'bcom_law': '⚖️ Corporate & Commercial Law Simulator',
  'bcom_ban': '🏛️ Commercial Banking & Treasury Simulator',
  'bcom_scrm': '🤝 Sales, Customer Success & CRM Simulator',
  'bcom_ent': '💡 Entrepreneurship & Business Management Simulator',
  'bcom_ecom': '🛒 E-Commerce & Digital Business Simulator',
  'bcom_dmkt': '🚀 Digital Marketing & Growth Strategy Simulator',
  'bcom_mkt': '📢 Digital Marketing & Growth Simulator',
  'bcom_ana': '📊 Business Analytics & Decision Intelligence Simulator',
  'bcom_acc': '📊 Digital Accounting & ERP Simulator',
  'quant': '📈 Quantitative Trading & Low-Latency Simulator',
  'iot_sec': '🔒 IoT Security & Root of Trust Simulator',
  'iot_edge': '🧠 Edge AI & TinyML TFLM Simulator',
  'ai': '🤖 AI & LLM Engine Simulator',
  'dist': '🌐 Distributed Systems Simulator',
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
  addCompletedQuest: (id: string, completed?: boolean, xp?: number, courseId?: string) => void;
  state: LessonState;
  finishLessonAndReturn: () => void;
}

export function useLessonEngine({
  questId,
  questData,
  teacherId,
  user,
  addCompletedQuest,
  state,
  finishLessonAndReturn,
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
    chatBottomRef,
  } = state;

  teacherIdRef.current = teacherId;
  slidesLengthRef.current = slides.length || syllabus.length;

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
    const colors = ['#f43f5e', '#ec4899', '#d946ef', '#a855f7', 'var(--reward)', '#3b82f6', '#10b981'];
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

  const simulateCodeRun = useCallback((slideIdx: number, mockOutput?: string) => {
    setCodeRunning(prev => ({ ...prev, [slideIdx]: true }));
    setCodeOutputs(prev => ({ ...prev, [slideIdx]: "" }));

    const text = mockOutput || "Program execution completed successfully.\nMemory allocated: 12MB\nExit code 0";
    const lines = text.split('\n');
    let lineIdx = 0;

    if (codeRunIntervalsRef.current[slideIdx]) {
      clearInterval(codeRunIntervalsRef.current[slideIdx]);
    }

    const interval = setInterval(() => {
      if (lineIdx < lines.length) {
        const currentLine = lines[lineIdx];
        setCodeOutputs(prev => ({
          ...prev,
          [slideIdx]: (prev[slideIdx] ? prev[slideIdx] + '\n' : '') + currentLine
        }));
        lineIdx++;
      } else {
        clearInterval(interval);
        setCodeRunning(prev => ({ ...prev, [slideIdx]: false }));
      }
    }, 350);

    codeRunIntervalsRef.current[slideIdx] = interval;
  }, [setCodeOutputs, setCodeRunning, codeRunIntervalsRef]);

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
        nextSpeechText = `Let us explore Slide ${currentSlide + 1}: "${slide.title}". Here are the core concepts: First, ${slide.bulletPoints?.[0] || ''}. Second, ${slide.bulletPoints?.[1] || ''}. And third, ${slide.bulletPoints?.[2] || ''}. Make sure you understand these before proceeding to the coding evaluation!`;
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

    const parsed = parseQuestId(questId || '');
    const coursePrefix = parsed?.prefix || '';
    const dayNum = parsed?.dayNum || 0;
    const pilotDay = resolvePilotDay(coursePrefix, dayNum);

    if (pilotDay && pilotDay.blocks && pilotDay.blocks.length > 0) {
      const pilotSlides = pilotDay.blocks.map((block: any) => {
        const analogy = block.media.find((m: any) => m.type === 'analogy') as any;
        const runnable = block.media.find((m: any) => m.type === 'runnable_code') as any;
        const syntax = block.media.find((m: any) => m.type === 'syntax_anatomy') as any;
        const diagram = block.media.find((m: any) => m.type === 'diagram') as any;

        const bulletPoints: string[] = [];
        if (analogy) {
          bulletPoints.push(`Analogy: ${analogy.caption || analogy.title}`);
        }
        if (syntax) {
          bulletPoints.push(`Syntax Rule: ${syntax.title}`);
        }
        if (diagram) {
          bulletPoints.push(`Visual Blueprint: ${diagram.caption || diagram.title}`);
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
        const options = diag?.options || (diag?.expectedStringOutput ? [diag.expectedStringOutput, 'null', 'undefined'] : ['Optimal design', 'Suboptimal design', 'Syntax Error']);
        const answerIndex = diag?.correctIndex !== undefined ? diag.correctIndex : 0;
        const explanation = (Object.values(diag?.diagnosisMap || {})[0] as any) || 'Verified optimal industry pattern.';

        return {
          title: block.title,
          bulletPoints,
          codeExample,
          mockOutput,
          mcq: {
            question: diag?.questionPrompt || `What is the core takeaway for ${block.title}?`,
            options,
            answerIndex,
            explanation
          }
        };
      });

      setSlides(pilotSlides);
      setSlidesLoading(false);
      return;
    }

    const isJava = coursePrefix === 'java-basics';
    const isReact = coursePrefix === 'react-basics';
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
      let codeExample = isJava ? `public class Solution {\n    public static void main(String[] args) {\n        // Step ${index + 1}: ${title}\n        System.out.println("Executing verified invariant for ${title}...");\n    }\n}` : `// Execution Sandbox for ${title}\nfunction executeStep() {\n    return "Status: Optimal";\n}`;
      let mockOutput = isJava ? `⚙️ Javac compiling Solution.java...\nExecuting verified invariant for ${title}...\nProcess finished with exit code 0` : `Running Sandbox...\nStatus: Optimal\nExit code 0`;

      if (isJava && tLow.includes('loop')) {
        codeExample = `public class Solution {\n    public static void main(String[] args) {\n        for (int i = 1; i <= 3; i++) {\n            System.out.println("Iteration: " + i);\n        }\n    }\n}`;
        mockOutput = `⚙️ Javac compiling Solution.java...\nIteration: 1\nIteration: 2\nIteration: 3\nProcess finished with exit code 0`;
      } else if (isReact && tLow.includes('state')) {
        codeExample = `export default function Counter() {\n    const [count, setCount] = useState(0);\n    return <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>;\n}`;
        mockOutput = `⚛️ React Sandbox Loaded.\nComponent render passed 100% tests.`;
      }

      bulletPoints.push(`Verify invariants and boundary conditions before advancing.`);
      bulletPoints.push(`Keep runtime memory footprint strictly bounded.`);

      return {
        title,
        bulletPoints,
        codeExample,
        mockOutput,
        mcq: {
          question: `Regarding ${title}, which principle ensures maximum production safety?`,
          options: [
            `Enforce explicit input validation checks and manage state lifecycle cleanly.`,
            `Rely exclusively on unvalidated type coercions at runtime.`,
            `Bypass bounds validation and suppress all error signals.`
          ],
          answerIndex: 0,
          explanation: `System integrity requires explicit boundary validation and clean lifecycle resource cleanup.`
        }
      };
    });

    setSlides(staticSlides);
    setSlidesLoading(false);
  }, [questId, questData, syllabus, setSlides, setSlidesLoading]);

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

  // Mark completed quest on exam pass
  useEffect(() => {
    if (examPassed) {
      const course = COURSES_REGISTRY.find(c => (c.quests || []).some(q => q.id === questId));
      if (course) {
        addCompletedQuest(questId, true, 150, course.id);
      }
    }
  }, [examPassed, questId, addCompletedQuest]);

  const meta = (user?.user_metadata as any) || {};
  const studentName = (meta.full_name || meta.name || user?.email?.split('@')[0] || 'Developer');

  const getSpeakerText = useCallback(() => {
    const slidesLength = slides.length || syllabus.length;
    if (currentSlide === 0) {
      return `Welcome, ${studentName}, to your classroom lesson for ${questData.title}. I am your AI instructor. We will explore each requirement from your syllabus in detail. Please pay close attention, and confirm your understanding before taking the final syllabus exam!`;
    }

    if (currentSlide === slidesLength + 1) {
      if (examPassed) {
        return `Outstanding achievement, ${studentName}! You passed the syllabus evaluation exam with flying colors! Your conceptual grounding is verified. Click Finish Quest below to return to your roadmap and collect your rewards!`;
      }
      const qText = slides[examQuestionIndex]?.mcq?.question || "Ready for your evaluation question?";
      return `Welcome to the Syllabus Evaluation Exam! Let us assess your understanding. ${qText}`;
    }

    const idx = currentSlide - 1;
    if (slides && slides[idx]) {
      const slide = slides[idx];
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
  }, [currentSlide, slides, syllabus, examPassed, examQuestionIndex, questData, studentName]);

  getSpeakerTextRef.current = getSpeakerText;

  const playSpeech = useCallback(() => {
    if (typeof window === 'undefined') return;
    const speakerText = getSpeakerText();
    stopSpeaking();

    speakWithAvatar(
      speakerText,
      teacherIdRef.current,
      () => {
        setIsPlaying(true);
      },
      () => {
        setIsPlaying(false);
      }
    );
  }, [getSpeakerText, setIsPlaying, teacherIdRef]);

  const handleTogglePlay = useCallback(() => {
    if (isPlaying) {
      stopSpeaking();
      setIsPlaying(false);
    } else {
      playSpeech();
    }
  }, [isPlaying, playSpeech, setIsPlaying]);

  const handleNextSlide = useCallback(() => {
    stopSpeaking();
    setIsPlaying(false);
    const slidesLength = slides.length || syllabus.length;
    if (currentSlide < slidesLength + 1) {
      setCurrentSlide(prev => prev + 1);
    }
  }, [currentSlide, slides.length, syllabus.length, setCurrentSlide, setIsPlaying]);

  const handlePrevSlide = useCallback(() => {
    stopSpeaking();
    setIsPlaying(false);
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  }, [currentSlide, setCurrentSlide, setIsPlaying]);

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
    setDoubtCount(nextDoubtCount);

    if (nextDoubtCount >= 3) {
      toast.info("Classroom Adaptation", "Simplifying explanations to first principles.");
      const resetMsg = `${studentName}, it seems this topic is a bit tricky — let me step back and explain it from absolute first principles using a simple real-world analogy.`;
      setChatMessages(prev => [
        ...prev,
        { role: 'user' as const, content: msg },
        { role: 'assistant' as const, content: resetMsg }
      ]);
      setLatestAIResponse(resetMsg);
      speakWithAvatar(
        resetMsg,
        teacherIdRef.current,
        () => setIsPlaying(true),
        () => setIsPlaying(false)
      );
      setDoubtCount(0);
      setChatLoading(false);
      return;
    }

    const newMessages = [...chatMessages, { role: 'user' as const, content: msg }];
    setChatMessages(newMessages);

    try {
      const history = newMessages.map(m => ({
        role: m.role,
        content: m.content
      }));

      const activeSlide = slides[currentSlide - 1];
      const data = await api.post<{ reply: string }>('/api/avatar/chat', {
        teacherId: teacherIdRef.current,
        message: msg,
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
    simulateCodeRun,
    playSpeech,
    handleTogglePlay,
    handleNextSlide,
    handlePrevSlide,
    getSpeakerText,
    sendInteractiveMessage,
  };
}
