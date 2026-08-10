'use client';
import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { COURSES_REGISTRY } from '@/lib/data/coursesData';
import { CONCEPT_ANALOGIES_REGISTRY } from '@/lib/data/conceptAnalogies';
import { speakWithAvatar, stopSpeaking, preloadTTS, preloadNextSpeech } from '@/lib/tts';
import { startArchetypeSoundscape, stopArchetypeSoundscape, setSoundscapeDucking, getUserSoundscapeVolume, setUserSoundscapeVolume } from '@/lib/audio/soundscapes';
import { useAuth } from '@/lib/context/AuthContext';
import { useCareerOS } from '@/lib/context/CareerOSContext';
import { api } from '@/lib/api/client';
import { toast } from '@/lib/store/useAppStore';
import PinsGate from '@/components/pins/PinsGate';

const AvatarMentorWidget = dynamic(() => import('@/components/avatar/AvatarMentorWidget'), { ssr: false });

interface Teacher {
  name: string;
  avatar: string;
  color: string;
  accent: string;
  role: string;
}

const TEACHER_METADATA: Record<string, Teacher> = {
  kashyap: { name: 'Kashyap Sir', avatar: '👩‍🎨', color: 'rgba(59, 130, 246, 0.1)', accent: 'var(--accent)', role: 'Staff Systems Architect' },
  karthic: { name: 'Karthic Sir "Nega"', avatar: '👨‍🏫', color: 'rgba(245, 158, 11, 0.1)', accent: 'var(--amber)', role: 'Algorithmic Lead Tutor' },
  maya: { name: 'Ms. Maya', avatar: '👩‍💼', color: 'rgba(239, 68, 68, 0.1)', accent: 'var(--coral)', role: 'Principal Security Auditor' },
  divya: { name: 'Ms. Divya', avatar: '👨‍💼', color: 'rgba(16, 185, 129, 0.1)', accent: 'var(--green)', role: 'Lead UX Engineer' }
};

export default function LessonPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', color: 'var(--t1)' }}>Loading Quest Lesson...</div>}>
      <LessonPageContent />
    </Suspense>
  );
}

function LessonPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const questId = searchParams.get('questId') || '';
  const teacherId = searchParams.get('teacherId') || 'kashyap';
  const { user } = useAuth();
  const { addCompletedQuest, isItemUnlocked, unlockItem, pins } = useCareerOS();
  const userId = user?.id || 'guest';

  const teacher = TEACHER_METADATA[teacherId] || TEACHER_METADATA.kashyap;

  // Search AI-generated roadmap modules in localStorage first across all active course module keys
  let questData: any = null;
  if (typeof window !== 'undefined' && userId) {
    try {
      const moduleKeys = Object.keys(localStorage).filter(k => k.startsWith(`pinit_${userId}_roadmap_modules`));
      for (const key of moduleKeys) {
        const saved = localStorage.getItem(key);
        if (saved) {
          const mods = JSON.parse(saved);
          if (Array.isArray(mods)) {
            for (const mod of mods) {
              const found = (mod.quests || []).find((q: any) => q.id === questId);
              if (found) {
                questData = found;
                break;
              }
            }
          }
        }
        if (questData) break;
      }
    } catch (e) {
      console.error('Failed to load quest from roadmap modules:', e);
    }
  }

  // Fallback to COURSES_REGISTRY if not found in custom generated roadmap
  if (!questData) {
    for (const course of COURSES_REGISTRY) {
      const found = (course.quests || []).find(q => q.id === questId);
      if (found) {
        questData = found;
        break;
      }
    }
  }

  // Final fallback if not found anywhere
  if (!questData) {
    questData = {
      id: questId || 'java-basics-lecture',
      title: 'Quest Class Lesson',
      desc: 'Review core concepts and syllabus requirements with your digital teacher.',
      syllabus: [
        'Understand foundational syntax structures',
        'Verify edge case conditions and loops',
        'Review architecture patterns and optimizations'
      ]
    };
  }



  const syllabus = (questData && Array.isArray(questData.syllabus)) ? questData.syllabus : [];
  const [currentSlide, setCurrentSlide] = useState(0);
  const currentSlideRef = useRef(currentSlide);
  currentSlideRef.current = currentSlide;
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const codeRunIntervalsRef = useRef<{ [key: number]: NodeJS.Timeout }>({});

  // Dynamic slides state
  const [slides, setSlides] = useState<any[]>([]);
  const [slidesLoading, setSlidesLoading] = useState(true);
  
  // Understanding checkpoints per slide
  const [understandingConfirmed, setUnderstandingConfirmed] = useState<Record<number, boolean>>({});
  const [teachingCompleted, setTeachingCompleted] = useState(false);

  // Final Exam slide states
  const [examQuestionIndex, setExamQuestionIndex] = useState(0);
  const [selectedMcqAnswer, setSelectedMcqAnswer] = useState<number | null>(null);
  const [mcqChecked, setMcqChecked] = useState(false);
  const [mcqIsCorrect, setMcqIsCorrect] = useState(false);
  const [examPassed, setExamPassed] = useState(false);

  const [isRecording, setIsRecording] = useState(false);
  const [confettiParticles, setConfettiParticles] = useState<any[]>([]);

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

  // Preload model on mount, and stop speaking when the lesson page is exited/unmounted
  useEffect(() => {
    preloadTTS();
    return () => {
      stopSpeaking();
    };
  }, []);

  // Preload next slide text in the background!
  useEffect(() => {
    if (examPassed) return;
    const slidesLength = slides.length || (syllabus?.length || 0);
    const nextSlideIdx = currentSlide; // Since currentSlide is 1-indexed, slide 1 maps to index 0, so next slide index is currentSlide
    
    if (nextSlideIdx < slidesLength) {
      let nextSpeechText = "";
      if (slides && slides[nextSlideIdx]) {
        const slide = slides[nextSlideIdx];
        nextSpeechText = `Let us explore Slide ${currentSlide + 1}: "${slide.title}". Here are the core concepts: First, ${slide.bulletPoints[0]}. Second, ${slide.bulletPoints[1]}. And third, ${slide.bulletPoints[2]}. Make sure you understand these before proceeding to the coding evaluation!`;
      } else if (syllabus && nextSlideIdx < syllabus.length) {
        const concept = syllabus[nextSlideIdx];
        nextSpeechText = `Let us explore Section ${currentSlide + 1}, where we analyze the core concept of "${concept}". In modern software engineering, mastering this topic is absolutely vital for designing high-performance, lag-free systems. From an architectural perspective, "${concept}" dictates how data structures are arranged in memory and how the processor executes execution paths. If you implement this incorrectly in a production environment, you run the risk of introducing critical memory leaks, type-safety violations, or thread synchronization bottlenecks that can crash client-facing APIs. When writing code for this module, it is a best practice to enforce clean, structured syntax, utilize appropriate variable visibility modifiers, and carefully manage resource cleanup. In your upcoming coding test, you will be asked to implement an algorithm that relies heavily on the mechanics of "${concept}". I recommend that you consider boundary edge cases, check for null or empty inputs, and optimize loop conditions to achieve minimal Big-O complexity. Ensure you have a solid grasp of these mechanics before you unlock the test module. If you have any questions, you can click the interactive chat mode button below to discuss the details with me directly!`;
      }
      
      if (nextSpeechText) {
        preloadNextSpeech(nextSpeechText, teacherId);
      }
    }
  }, [currentSlide, slides, syllabus, teacherId, examPassed]);

  // Autoplay teacher speech when advancing slides or when lesson loads
  useEffect(() => {
    if (examPassed) return;
    const timer = setTimeout(() => {
      playSpeech();
    }, 400);

    return () => {
      clearTimeout(timer);
      stopSpeaking();
    };
  }, [currentSlide, slidesLoading]);



  // Voice recording recognizer
  const startVoiceInput = () => {
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
  };

  // Synthesized chime sound
  const playChime = () => {
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
        
        gain.gain.setValueAtTime(0.15, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(startTime);
        osc.stop(startTime + duration);
      };

      const now = ctx.currentTime;
      playNote(523.25, now, 0.4); // C5
      playNote(659.25, now + 0.15, 0.6); // E5
    } catch (e) {
      console.warn("Web Audio chime failed", e);
    }
  };

  // Confetti launcher
  const launchConfetti = () => {
    const colors = ['#f43f5e', '#ec4899', '#d946ef', '#a855f7', '#8b5cf6', '#6366f1', '#3b82f6', '#0ea5e9', '#06b6d4', '#14b8a6', '#10b981', '#22c55e', '#84cc16', '#eab308', '#f97316'];
    const initialParticles: any[] = [];
    const animatedParticles: any[] = [];

    for (let i = 0; i < 60; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = 50 + Math.random() * 200;
      const targetX = Math.cos(angle) * distance;
      const targetY = Math.sin(angle) * distance;
      const size = 5 + Math.random() * 8;
      const color = colors[Math.floor(Math.random() * colors.length)];

      initialParticles.push({
        id: `confetti-${i}-${Date.now()}`,
        color,
        size,
        transform: 'translate(0px, 0px) rotate(0deg) scale(1)',
        transition: 'all 0s'
      });

      animatedParticles.push({
        id: `confetti-${i}-${Date.now()}`,
        color,
        size,
        transform: `translate(${targetX}px, ${targetY}px) rotate(${Math.random() * 360}deg) scale(0)`,
        transition: 'all 1.2s cubic-bezier(0.1, 0.8, 0.3, 1)'
      });
    }

    setConfettiParticles(initialParticles);
    setTimeout(() => {
      setConfettiParticles(animatedParticles);
    }, 50);
  };

  const [codeRunning, setCodeRunning] = useState<Record<number, boolean>>({});
  const [codeOutputs, setCodeOutputs] = useState<Record<number, string>>({});

  const simulateCodeRun = (slideIdx: number, mockOutput?: string) => {
    if (codeRunning[slideIdx]) return;
    setCodeRunning(prev => ({ ...prev, [slideIdx]: true }));
    setCodeOutputs(prev => ({ ...prev, [slideIdx]: '⏳ Loading compiler dependencies...\n' }));
    
    setTimeout(() => {
      setCodeOutputs(prev => ({ ...prev, [slideIdx]: '⚙️ Javac compiling Solution.java...\n' }));
      
      setTimeout(() => {
        setCodeRunning(prev => ({ ...prev, [slideIdx]: false }));
        const text = mockOutput || "Program execution completed successfully.\nExit code: 0";
        const lines = text.split('\n');
        
        let currentLine = 0;
        setCodeOutputs(prev => ({ ...prev, [slideIdx]: lines[0] }));
        
        const interval = setInterval(() => {
          currentLine++;
          if (currentLine < lines.length) {
            setCodeOutputs(prev => ({
              ...prev,
              [slideIdx]: (prev[slideIdx] || '') + '\n' + lines[currentLine]
            }));
          } else {
            clearInterval(interval);
          }
        }, 180);
        codeRunIntervalsRef.current[slideIdx] = interval;
      }, 700);
    }, 500);
  };

  // Reset MCQ state when switching slides or exam questions
  useEffect(() => {
    setSelectedMcqAnswer(null);
    setMcqChecked(false);
    setMcqIsCorrect(false);
  }, [currentSlide, examQuestionIndex]);

  // Load slides INSTANTLY from static generator (0ms delay, zero network calls)
  useEffect(() => {
    if (!questId) return;

    // Instant static slide generation with rich real-world analogies & code examples
    const rawSyllabus = (syllabus && syllabus.length > 0) ? syllabus : ['Core Foundations & Execution Rules', 'Syntax Breakdown & Memory Boundaries', 'Production Use Case & Best Practices'];
    
    const staticSlides = rawSyllabus.map((topic, index) => {
      const topicLower = topic.toLowerCase();
      let codeSnippet = `# Real-World Production Example: ${topic}\ndef process_data(payload):\n    # 1. Validate incoming data\n    if not payload:\n        return {"status": "error", "message": "Empty payload"}\n    # 2. Process logic for ${topic}\n    result = [item.strip() for item in payload if item]\n    return {"status": "success", "processed_count": len(result)}`;
      
      if (topicLower.includes('function') || topicLower.includes('method')) {
        codeSnippet = `# Function Definition & Execution\ndef calculate_discount(price: float, discount_pct: float = 0.10) -> float:\n    """Calculates final price after applying percentage discount."""\n    savings = price * discount_pct\n    return round(price - savings, 2)\n\n# Execution invocation:\nfinal_amount = calculate_discount(1500.00, 0.15)\nprint(f"Final Total: ₹{final_amount}")  # Output: Final Total: ₹1275.0`;
      } else if (topicLower.includes('loop') || topicLower.includes('iterat')) {
        codeSnippet = `# Iteration & Loop Execution\norder_items = ["Laptop", "Mouse", "Keyboard", "Monitor"]\n\nprint("Processing Order Batch:")\nfor index, item in enumerate(order_items, start=1):\n    print(f" Item #{index}: {item} -> Verified in Warehouse Inventory")`;
      } else if (topicLower.includes('dict') || topicLower.includes('hash') || topicLower.includes('map')) {
        codeSnippet = `# Dictionary & Hash Map Storage\nstudent_profile = {\n    "id": "STU_9942",\n    "name": "Alex Vance",\n    "role": "Full-Stack Engineer",\n    "skills": ["Python", "React", "PostgreSQL"],\n    "ats_score": 92\n}\n\n# Fast O(1) Key Lookup:\nprint(f"Student Skill Count: {len(student_profile['skills'])}")`;
      } else if (topicLower.includes('class') || topicLower.includes('object') || topicLower.includes('oop')) {
        codeSnippet = `# Object-Oriented Programming (OOP) Class Blueprint\nclass UserAccount:\n    def __init__(self, username: str, email: str):\n        self.username = username\n        self.email = email\n        self.pins_balance = 100\n\n    def add_pins(self, amount: int):\n        self.pins_balance += amount\n        return self.pins_balance\n\nuser1 = UserAccount("dev_kashyap", "kashyap@pinit.ai")\nuser1.add_pins(25)\nprint(f"{user1.username} total Pins: {user1.pins_balance}")`;
      }

      return {
        title: topic,
        bulletPoints: [
          `Deconstruct the core logic of ${topic} through step-by-step real-world examples.`,
          `Understand how memory and variables are assigned and cleaned up in memory.`,
          `Apply modern clean-code principles to eliminate bugs and edge-case failures.`
        ],
        codeExample: codeSnippet,
        mockOutput: `[SUCCESS] Output generated for ${topic}\n>>> Execution completed in 0.002s with 0 memory leaks.`,
        mcq: {
          question: `Which of the following best describes the core technical rule of ${topic}?`,
          options: [
            `It acts as a primary building block to organize, control, and execute program logic efficiently.`,
            `It is an optional decorative syntax that has no impact on execution or data flow.`,
            `It should be avoided in production environments because it slows down CPU execution.`
          ],
          answerIndex: 0,
          explanation: `In software engineering, ${topic} provides essential structure. Mastering it ensures your code is fast, readable, and free of runtime errors.`
        }
      };
    });

    setSlides(staticSlides);
    setSlidesLoading(false);
  }, [questId, syllabus]);

  // Client Hydration, Mobile Audio Lock, & Mindset Focus Music State
  const [isHydrated, setIsHydrated] = useState(false);
  const [isAudioUnlocked, setIsAudioUnlocked] = useState(false);
  const [isFocusMusicEnabled, setIsFocusMusicEnabled] = useState(false);
  const [soundscapeVol, setSoundscapeVol] = useState<number>(50);

  useEffect(() => {
    setIsHydrated(true);
    if (typeof window !== 'undefined') {
      setSoundscapeVol(getUserSoundscapeVolume());
      const unlockHandler = () => {
        setIsAudioUnlocked(true);
        window.removeEventListener('pointerdown', unlockHandler);
        window.removeEventListener('keydown', unlockHandler);
      };
      window.addEventListener('pointerdown', unlockHandler);
      window.addEventListener('keydown', unlockHandler);
      return () => {
        window.removeEventListener('pointerdown', unlockHandler);
        window.removeEventListener('keydown', unlockHandler);
      };
    }
  }, []);

  // Mindset Focus Soundscape Management
  useEffect(() => {
    const metaData = (user?.user_metadata as any) || {};
    const arch = metaData.mindset_archetype || 'Pattern Hunter';
    if (isFocusMusicEnabled) {
      startArchetypeSoundscape(arch);
    } else {
      stopArchetypeSoundscape();
    }
    return () => {
      stopArchetypeSoundscape();
    };
  }, [isFocusMusicEnabled, user]);

  // Auto-ducking when AI Teacher speaks
  useEffect(() => {
    if (isFocusMusicEnabled) {
      setSoundscapeDucking(isPlaying);
    }
  }, [isPlaying, isFocusMusicEnabled]);

  // Socratic Interactive Q&A State
  const [isInteractive, setIsInteractive] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [latestAIResponse, setLatestAIResponse] = useState('');
  const [doubtCount, setDoubtCount] = useState(0);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  // Load persistent doubts for this quest on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && userId && questId) {
      try {
        const savedDoubts = localStorage.getItem(`pinit_${userId}_quest_doubts_${questId}`);
        if (savedDoubts) {
          const parsed = JSON.parse(savedDoubts);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setChatMessages(parsed);
          }
        }
      } catch {}
    }
  }, [userId, questId]);

  // Save persistent doubts whenever chatMessages updates
  useEffect(() => {
    if (typeof window !== 'undefined' && userId && questId && chatMessages.length > 0) {
      try {
        localStorage.setItem(`pinit_${userId}_quest_doubts_${questId}`, JSON.stringify(chatMessages.slice(-14)));
      } catch {}
    }
  }, [chatMessages, userId, questId]);

  // Stop speaking on unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  const getNextQuestId = (): string => {
    for (const course of COURSES_REGISTRY) {
      const idx = (course.quests || []).findIndex(q => q.id === questId);
      if (idx !== -1 && idx < course.quests.length - 1) {
        return course.quests[idx + 1].id;
      }
    }
    if (questId.endsWith('-lecture')) {
      return questId.replace('-lecture', '');
    }
    return questId;
  };

  const getProactivePromptText = () => {
    if (currentSlide === 0) {
      const qTitle = questData?.title ? questData.title.replace('Learning: ', '') : 'this lesson';
      return `Now that we have reviewed our quest roadmap for "${qTitle}", what specific concepts are you most excited to master today? Ask me any questions or type your response!`;
    }
    const idx = currentSlide - 1;
    const slidesLength = slides.length || syllabus.length;
    if (idx < slidesLength) {
      const topic = slides[idx]?.title || syllabus[idx] || '';
      return `That covers Section ${currentSlide}: "${topic}". How comfortable are you with this topic? Ask me for a practical coding example, or let me know if you want to dive deeper into any part!`;
    }
    return `We have completed our syllabus review! Are you ready to start the immediate grading test, or is there any topic you'd like to quickly review first?`;
  };

  const triggerProactivePrompt = () => {
    const promptText = getProactivePromptText();
    setIsInteractive(true);
    setLatestAIResponse(promptText);
    setChatMessages([{ role: 'assistant', content: promptText }]);

    setIsPlaying(true);
    speakWithAvatar(
      promptText,
      teacherId,
      () => {
        setIsPlaying(true);
      },
      () => {
        setIsPlaying(false);
      }
    );
  };

  // Stop speaking, reset progress, and AUTO-PLAY when slide changes
  useEffect(() => {
    const slidesLength = slides.length || syllabus.length;
    if (currentSlide < slidesLength + 1) {
      setExamQuestionIndex(0);
      setSelectedMcqAnswer(null);
      setMcqChecked(false);
      setMcqIsCorrect(null);
    }

    if (examPassed) {
      stopSpeaking();
      setIsPlaying(false);
      return;
    }
    stopSpeaking();
    setIsPlaying(false);
    setAudioProgress(0);
    setIsInteractive(false);
    setLatestAIResponse('');
    setTeachingCompleted(false);

    const activeSlideAtStart = currentSlide;
    const playTimer = setTimeout(() => {
      const speakerText = getSpeakerText();
      setIsPlaying(true);
      setAudioProgress(0);

      speakWithAvatar(
        speakerText,
        teacherId,
        () => {
          setIsPlaying(true);
        },
        () => {
          if (activeSlideAtStart === currentSlideRef.current) {
            setIsPlaying(false);
            setAudioProgress(100);
            setTeachingCompleted(true);
          }
        }
      );
    }, 800);

    return () => {
      clearTimeout(playTimer);
      stopSpeaking();
    };
  }, [currentSlide, examPassed]);

  // Scroll to bottom of chat list
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, chatLoading]);

  // Animate progress bar while audio plays
  useEffect(() => {
    if (isPlaying) {
      const textLen = getSpeakerText().length;
      const estimatedDuration = Math.max(3000, textLen * 65);
      const intervalMs = 100;
      const steps = estimatedDuration / intervalMs;
      let currentStep = 0;
      
      timerRef.current = setInterval(() => {
        currentStep++;
        setAudioProgress(Math.min(99, Math.floor((currentStep / steps) * 100)));
      }, intervalMs);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, currentSlide]);

  // Speak function playing ElevenLabs or browser native tts
  const playSpeech = () => {
    stopSpeaking();
    const speakerText = getSpeakerText();
    setIsPlaying(true);
    setAudioProgress(0);

    speakWithAvatar(
      speakerText,
      teacherId,
      () => {
        setIsPlaying(true);
      },
      () => {
        setIsPlaying(false);
        setAudioProgress(100);
        triggerProactivePrompt();
      }
    );
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      stopSpeaking();
      setIsPlaying(false);
    } else {
      playSpeech();
    }
  };

  const handleNextSlide = () => {
    const slidesLength = slides.length || syllabus.length;
    if (currentSlide < slidesLength + 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handlePrevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const meta = (user?.user_metadata as any) || {};
  const studentName = (meta.full_name || meta.name || user?.email?.split('@')[0] || 'Vinay').split(' ')[0];
  const archetype = meta.mindset_archetype || 'Pattern Hunter';

  // Get current dialog script spoken by teacher
  const getSpeakerText = () => {
    if (currentSlide === 0) {
      let welcomeIntro = `Welcome ${studentName}! I am ${teacher.name}, your dedicated career mentor, and I am thrilled to guide you through today's lesson on "${questData.title}".`;
      if (teacherId === 'karthic') {
        welcomeIntro = `Hey ${studentName}! I am ${teacher.name}! Let's crush this lesson on "${questData.title}"! Get ready for high-energy coding!`;
      } else if (teacherId === 'maya') {
        welcomeIntro = `Attention ${studentName}. I am ${teacher.name}. Today we audit "${questData.title}". Pay close attention to system security and memory limits!`;
      } else if (teacherId === 'divya') {
        welcomeIntro = `Welcome ${studentName}! I am ${teacher.name}. Today we explore the beautiful visual architecture of "${questData.title}"!`;
      }
      return `${welcomeIntro} In this session, we will start with real-world examples first, then break down the theory, observe live code execution line-by-line, and resolve any doubts you have in your language. ${studentName}, let us begin by advancing to our first module!`;
    }
    if (currentSlide === (slides.length || syllabus.length) + 1) {
      if (examPassed) {
        return `Stellar work ${studentName}! You have successfully passed the evaluation exam for "${questData.title}". You answered all questions correctly and demonstrated a great grasp of concepts. Great job!`;
      }
      const qText = slides[examQuestionIndex]?.mcq?.question || "Ready for your first question?";
      return `${studentName}, welcome to the final Exam Slide! Here is your question: ${qText}`;
    }
    const idx = currentSlide - 1;
    if (slides && slides[idx]) {
      const slide = slides[idx];
      const titleLower = (slide.title || '').toLowerCase();
      let matchedAnalogy = CONCEPT_ANALOGIES_REGISTRY['python-functions'];
      if (titleLower.includes('loop') || titleLower.includes('iterat')) matchedAnalogy = CONCEPT_ANALOGIES_REGISTRY['python-loops'];
      else if (titleLower.includes('dict') || titleLower.includes('hash') || titleLower.includes('map')) matchedAnalogy = CONCEPT_ANALOGIES_REGISTRY['python-dicts'];
      else if (titleLower.includes('class') || titleLower.includes('oop') || titleLower.includes('object')) matchedAnalogy = CONCEPT_ANALOGIES_REGISTRY['python-classes'];
      else if (titleLower.includes('async') || titleLower.includes('event')) matchedAnalogy = CONCEPT_ANALOGIES_REGISTRY['python-async'];
      else if (titleLower.includes('react') || titleLower.includes('component')) matchedAnalogy = CONCEPT_ANALOGIES_REGISTRY['react-components'];
      else if (titleLower.includes('hook') || titleLower.includes('state')) matchedAnalogy = CONCEPT_ANALOGIES_REGISTRY['react-hooks'];
      else if (titleLower.includes('neural') || titleLower.includes('tensor') || titleLower.includes('ml')) matchedAnalogy = CONCEPT_ANALOGIES_REGISTRY['ml-neural-nets'];
      else if (titleLower.includes('index') || titleLower.includes('sql') || titleLower.includes('db')) matchedAnalogy = CONCEPT_ANALOGIES_REGISTRY['db-indexes'];
      else if (titleLower.includes('docker') || titleLower.includes('container') || titleLower.includes('devops')) matchedAnalogy = CONCEPT_ANALOGIES_REGISTRY['devops-docker'];

      const bp1 = slide.bulletPoints?.[0] || 'Understand core mechanics';
      const bp2 = slide.bulletPoints?.[1] || 'Enforce clean boundaries';

      // 🎭 ZERO-TOKEN TEACHER PERSONA SOUNDING ENGINE
      let personaIntro = `${studentName}, let us explore Section ${currentSlide}: "${slide.title}".`;
      if (teacherId === 'kashyap') {
        personaIntro = `My dear student ${studentName}, in our journey of engineering, let us reflect on Section ${currentSlide}: "${slide.title}".`;
      } else if (teacherId === 'karthic') {
        personaIntro = `Hey ${studentName}! Let's crush this code! Welcome to Section ${currentSlide}: "${slide.title}"! Imagine a super fast factory conveyor belt moving at 100mph!`;
      } else if (teacherId === 'maya') {
        personaIntro = `Attention ${studentName}. Listen carefully to Section ${currentSlide}: "${slide.title}". If you write unverified code here, your production server will crash under load!`;
      } else if (teacherId === 'divya') {
        personaIntro = `Welcome ${studentName}! Look at how clean and elegant Section ${currentSlide}: "${slide.title}" flows visually on screen!`;
      }

      // 🧠 ZERO-TOKEN MINDSET ARCHETYPE ADAPTATION
      let archetypeCallout = `${studentName}, pay close attention to how this topic connects to system architecture!`;
      if (archetype.toLowerCase().includes('pattern') || archetype.toLowerCase().includes('hunter')) {
        archetypeCallout = `${studentName}, since you are a Pattern Hunter, pay close attention to the Big-O memory footprint and underlying logic flow below!`;
      } else if (archetype.toLowerCase().includes('explorer') || archetype.toLowerCase().includes('sprinter')) {
        archetypeCallout = `${studentName}, since you are an Explorer, jump right into the live code sandbox below and experiment with different parameters!`;
      } else if (archetype.toLowerCase().includes('social') || archetype.toLowerCase().includes('communicat')) {
        archetypeCallout = `${studentName}, since you excel at Social IQ, think about how you would explain this architecture in a team design review!`;
      } else {
        archetypeCallout = `${studentName}, since you value stability, notice how boundary checks prevent runtime null-pointer crashes!`;
      }

      // 🗣️ LINE-BY-LINE CODE SPEECH EXPLANATION
      const codeWalkthrough = `Now ${studentName}, look at the code sandbox below: On line 1, we define our function signature. On line 3, we validate incoming input data. And on line 5, we process and return sanitized output with zero memory leaks!`;

      return `${personaIntro} First, here is a real-world example: ${matchedAnalogy.analogy}. In production software systems: ${matchedAnalogy.realWorldUseCase}. Next, here is the core theory: ${bp1}. ${bp2}. ${codeWalkthrough} ${archetypeCallout} ${studentName}, did you understand this concept? Click to proceed or ask me any doubt in your language!`;
    }
    if (idx < syllabus.length) {
      const concept = syllabus[idx];
      return `${studentName}, let us explore Section ${currentSlide}: "${concept}". In modern software engineering, mastering this topic is vital for designing high-performance systems. First, understand how data structures are arranged in memory. Next, observe the execution rules and Big-O efficiency. ${studentName}, did you understand this concept? Click to proceed or ask me any doubt!`;
    }
    return `Stellar work ${studentName}! We have completed our syllabus review for "${questData.title}". You are now fully prepared to demonstrate your technical capabilities in the immediate coding evaluation!`;
  };

  const sendInteractiveMessage = async (text?: string) => {
    const msg = (text || chatInput).trim();
    if (!msg || chatLoading) return;
    setChatInput('');
    stopSpeaking();
    setIsPlaying(false);

    const nextDoubtCount = doubtCount + 1;
    setDoubtCount(nextDoubtCount);

    // 7-Doubt Hard Reteach Guard: Automatically reset quest to Slide 1 if student asks > 7 doubts
    if (nextDoubtCount > 7) {
      const resetMsg = `${studentName}, it seems this topic is a bit tricky right now! Since we have covered 7 doubts in this session, let us restart this quest from the beginning with fresh real-world examples so you get a 100% crystal-clear foundation!`;
      stopSpeaking();
      setIsPlaying(true);
      setLatestAIResponse(resetMsg);
      setChatMessages(prev => [...prev, { role: 'user' as const, content: msg }, { role: 'assistant' as const, content: resetMsg }]);
      speakWithAvatar(
        resetMsg,
        teacherId,
        () => setIsPlaying(true),
        () => {
          setIsPlaying(false);
          setDoubtCount(0);
          setCurrentSlide(0);
          setIsInteractive(false);
          toast.success("Fresh Start Activated", "Restarting lesson from Slide 1 with fresh examples!");
        }
      );
      return;
    }

    const newMessages = [...chatMessages, { role: 'user' as const, content: msg }];
    setChatMessages(newMessages);
    setChatLoading(true);

    const history = newMessages.map(m => ({
      role: m.role,
      content: m.content
    }));

    try {
      const data = await api.post<{ reply: string }>('/api/avatar/chat', {
        message: msg,
        history: history.slice(0, -1),
        teacherId,
        careerContext: { activeQuest: questId }
      });
      const reply = data?.reply || "I'm processing that. Can you rephrase?";
      
      setChatMessages(prev => [...prev, { role: 'assistant' as const, content: reply }]);
      setLatestAIResponse(reply);

      stopSpeaking();
      setIsPlaying(true);
      speakWithAvatar(
        reply,
        teacherId,
        () => setIsPlaying(true),
        () => setIsPlaying(false)
      );
    } catch (err) {
      console.error(err);
      setChatMessages(prev => [...prev, { role: 'assistant' as const, content: "Sorry, I lost connection. Please try again!" }]);
    } finally {
      setChatLoading(false);
    }
  };

  const [unlockedTick, setUnlockedTick] = useState(0);
  const isLastSlide = currentSlide === (slides.length || (syllabus?.length || 0)) + 1;

  if (questId && !isItemUnlocked(`quest:${questId}`)) {
    return (
      <div style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 24, padding: '36px 40px', maxWidth: 440, width: '90%', textAlign: 'center', boxShadow: 'var(--shadow-xl)' }}>
          <div style={{ fontSize: 44, marginBottom: 12 }}>🗺️</div>
          <h3 style={{ fontSize: 20, fontWeight: 900, marginBottom: 8, color: 'var(--t1)' }}>{questData?.title || 'Unlock Quest Session'}</h3>
          <p style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.5, marginBottom: 24 }}>
            Unlocking this quest requires <strong>20 Pins</strong> for <strong>30 minutes</strong> of duration access.
          </p>
          <PinsGate itemKey={`quest:${questId}`} category="quest" onUnlocked={() => setUnlockedTick(t => t + 1)}>
            <button className="btn-primary" style={{ width: '100%', padding: '14px', justifyContent: 'center', fontSize: 14 }}>
              ⚡ Unlock Quest (20 Pins · 30m)
            </button>
          </PinsGate>
          <button onClick={() => router.back()} className="btn-ghost" style={{ width: '100%', marginTop: 12, justifyContent: 'center' }}>
            Back to Roadmap
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      margin: '0',
      padding: '0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg)',
      boxSizing: 'border-box',
      overflow: 'hidden',
      position: 'relative'
    }} className="animate-fade-in">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes wave {
          0% { transform: scaleY(0.3); }
          100% { transform: scaleY(1.5); }
        }
        @keyframes hologramPulse {
          0% { opacity: 0.15; transform: scale(0.95); }
          100% { opacity: 0.35; transform: scale(1.05); }
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
          100% { transform: translateY(0px); }
        }
        @keyframes micPulse {
          0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.5); }
          70% { box-shadow: 0 0 0 8px rgba(239, 68, 68, 0); }
          100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }

        .lesson-card {
          width: 85vw;
          height: 85vh;
          max-width: 1440px;
          max-height: 850px;
          padding: 24px 32px;
          border-radius: 24px;
          border: 1.5px solid var(--border);
          display: flex;
          flex-direction: column;
          gap: 16px;
          background: linear-gradient(135deg, var(--bg2), var(--bg3));
          box-shadow: var(--shadow-xl);
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .avatar-spotlight {
          position: absolute;
          width: 250px;
          height: 250px;
          border-radius: 50%;
          filter: blur(60px);
          opacity: 0.2;
          z-index: 0;
          pointer-events: none;
          animation: hologramPulse 4s ease-in-out infinite alternate;
        }

        .mcq-option-btn {
          text-align: left;
          padding: 10px 14px;
          border-radius: 10px;
          font-size: 11.5px;
          font-weight: 500;
          background: var(--bg2);
          border: 1px solid var(--border);
          color: var(--t2);
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
        }
        .mcq-option-btn:hover:not(:disabled) {
          color: var(--t1);
          border-color: var(--border2);
          background: var(--bg3);
          transform: translateY(-1px);
        }
        .mcq-option-btn:disabled {
          cursor: not-allowed;
        }
        .mcq-option-btn.selected {
          background: var(--accent-light);
          border-color: var(--accent);
          color: var(--t1);
        }
        .mcq-option-btn.correct {
          background: var(--green-light);
          border-color: var(--green);
          color: var(--t1);
        }
        .mcq-option-btn.incorrect {
          background: var(--coral-light);
          border-color: var(--coral);
          color: var(--t1);
        }

        .chat-bubble {
          padding: 8px 12px;
          border-radius: 14px;
          font-size: 12px;
          line-height: 1.45;
          max-width: 85%;
          box-shadow: var(--shadow-sm);
        }
        .chat-bubble.user {
          background: var(--accent);
          color: #ffffff;
          border-bottom-right-radius: 4px;
          align-self: flex-end;
        }
        .chat-bubble.assistant {
          background: var(--bg2);
          color: var(--t1);
          border: 1px solid var(--border);
          border-bottom-left-radius: 4px;
          align-self: flex-start;
        }

        .suggestion-pill {
          white-space: nowrap;
          padding: 6px 12px;
          border-radius: 18px;
          border: 1px solid var(--border);
          background: var(--bg1);
          color: var(--t2);
          font-size: 10.5px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .suggestion-pill:hover {
          color: var(--t1);
          border-color: var(--accent);
          background: var(--accent-light);
          transform: scale(1.02);
        }

        .speaking-pod {
          position: absolute;
          bottom: 16px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 3px;
          z-index: 10;
          background: rgba(15, 23, 42, 0.75);
          backdrop-filter: blur(4px);
          padding: 8px 16px;
          border-radius: 20px;
          border: 1px solid var(--border);
          animation: float 3s ease-in-out infinite;
        }

        .interactive-container {
          display: flex;
          gap: 20px;
          flex: 1;
          min-height: 0;
          overflow: hidden;
          align-items: stretch;
          width: 100%;
        }

        .interactive-left-col {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          overflow: visible;
        }

        .interactive-right-col {
          flex: 1.1;
          display: flex;
          flex-direction: column;
          background: var(--bg1);
          border-radius: 18px;
          border: 1.5px solid var(--border);
          overflow: hidden;
        }

        @media (max-width: 768px) {
          .interactive-container {
            flex-direction: column;
            overflow-y: auto;
            align-items: center;
          }
          .interactive-left-col {
            width: 100%;
            min-height: 220px !important;
            height: 220px !important;
            flex: none !important;
          }
          .interactive-right-col {
            width: 100%;
            flex: none !important;
            min-height: 380px !important;
            height: 380px !important;
          }
        }
      `}} />
      {/* Return Button */}
      <button
        onClick={() => router.push('/quests')}
        style={{
          position: 'absolute',
          top: 24,
          left: 24,
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          padding: '8px 16px',
          color: 'var(--t2)',
          cursor: 'pointer',
          fontSize: 11.5,
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          zIndex: 10,
          transition: 'all 0.2s'
        }}
      >
        ⏮ Return to Quest Roadmap
      </button>

      {/* Main lesson content */}
      {!isHydrated ? (
        <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--t2)', fontSize: 13, fontWeight: 700, gap: 8 }}>
          ⚡ Synchronizing Classroom Environment...
        </div>
      ) : (
        <div className="lesson-card">
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexShrink: 0 }}>
            <div>
              <span style={{
                fontSize: 10,
                background: 'rgba(99,102,241,0.15)',
                color: 'var(--accent)',
                padding: '4px 10px',
                borderRadius: 20,
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Active Class Lesson
              </span>
              <h2 style={{ fontSize: 18, fontWeight: 900, color: 'var(--t1)', marginTop: 4, fontFamily: 'var(--font-display)', letterSpacing: '-0.3px' }}>
                {questData.title}
              </h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <button
                  onClick={() => {
                    const nextState = !isFocusMusicEnabled;
                    setIsFocusMusicEnabled(nextState);
                    if (nextState) {
                      toast.success("Mindset Focus Soundscape Active", "Playing ambient focus audio tailored to your learning archetype!");
                    } else {
                      toast.info("Focus Music Off", "Ambient audio muted.");
                    }
                  }}
                  style={{
                    background: isFocusMusicEnabled ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                    border: `1.5px solid ${isFocusMusicEnabled ? 'var(--accent)' : 'var(--border)'}`,
                    color: isFocusMusicEnabled ? 'var(--accent)' : 'var(--t2)',
                    borderRadius: 10,
                    padding: '4px 10px',
                    fontSize: 10.5,
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    transition: 'all 0.2s'
                  }}
                >
                  🎵 Focus Audio: {isFocusMusicEnabled ? 'ON' : 'OFF'}
                </button>
                {isFocusMusicEnabled && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: 10, padding: '2px 8px' }}>
                    <span style={{ fontSize: 10, color: 'var(--t2)', fontWeight: 700 }}>🔈 {soundscapeVol}%</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={soundscapeVol}
                      onChange={(e) => {
                        const newVol = parseInt(e.target.value, 10);
                        setSoundscapeVol(newVol);
                        setUserSoundscapeVolume(newVol);
                      }}
                      style={{ width: 60, accentColor: 'var(--accent)', cursor: 'pointer' }}
                      title="Adjust Focus Music Volume"
                    />
                  </div>
                )}
              </div>
              {!isAudioUnlocked && (
                <button
                  onClick={() => {
                    setIsAudioUnlocked(true);
                    stopSpeaking();
                    playSpeech();
                    toast.success("Audio Unlocked", "Teacher voice is now active!");
                  }}
                  style={{
                    background: 'rgba(16, 185, 129, 0.2)',
                    border: '1.5px solid #10b981',
                    color: '#10b981',
                    borderRadius: 10,
                    padding: '4px 10px',
                    fontSize: 10.5,
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    animation: 'pulse 1.5s infinite'
                  }}
                >
                  🔊 Tap to Unmute Teacher Voice
                </button>
              )}
              <button
                onClick={() => {
                  stopSpeaking();
                  setIsPlaying(false);
                  setIsInteractive(false);
                  toast.success("Audio Skipped", "Jumping directly to code execution!");
                  const codeEl = document.getElementById('slide-code-execution-block');
                  if (codeEl) {
                    codeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }
                }}
                style={{
                  background: 'rgba(234, 179, 8, 0.15)',
                  border: '1.5px solid rgba(234, 179, 8, 0.4)',
                  color: '#eab308',
                  borderRadius: 10,
                  padding: '4px 10px',
                  fontSize: 10.5,
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  transition: 'all 0.2s'
                }}
              >
                ⚡ Skip Audio & Jump to Code
              </button>
              <span style={{ fontSize: 10, color: 'var(--t3)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                Slide {currentSlide + 1} / {(slides.length || syllabus.length) + 2}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                {[...Array((slides.length || syllabus.length) + 2)].map((_, idx) => {
                  const isCurrent = currentSlide === idx;
                  const isCompleted = currentSlide > idx;
                  const isExam = idx === (slides.length || syllabus.length) + 1;
                  
                  let bg = 'rgba(255,255,255,0.06)';
                  let border = '1px solid rgba(255,255,255,0.1)';
                  let content = '';

                  if (isExam) {
                    bg = examPassed ? 'var(--green)' : 'rgba(234,179,8,0.1)';
                    border = examPassed ? '1px solid var(--green)' : '1px solid rgba(234,179,8,0.4)';
                    content = '⭐';
                  } else if (isCompleted) {
                    bg = '#10b981';
                    border = '1px solid #10b981';
                  } else if (isCurrent) {
                    bg = isInteractive ? '#f59e0b' : 'var(--accent)';
                    border = isInteractive ? '1px solid #f59e0b' : '1px solid var(--accent)';
                  }

                  return (
                    <div
                      key={idx}
                      title={isExam ? 'Exam Stage' : `Slide ${idx + 1}`}
                      style={{
                        height: 12,
                        width: isExam ? 26 : 32,
                        borderRadius: 6,
                        background: bg,
                        border: border,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 8,
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {content}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Split Container Host (Left: 3D standing avatar, Right: Dynamic panel) */}
          <div className="interactive-container">
            {/* Left Column: standing avatar */}
            <div className="interactive-left-col">
              <div className="avatar-spotlight" style={{ background: teacher.accent }} />
              <AvatarMentorWidget
                userId={userId}
                teacherId={teacherId}
                onlyAvatar={true}
                speaking={isPlaying}
                speechText={latestAIResponse || getSpeakerText()}
                activeQuest={questData}
              />
              {isPlaying && (
                <div className="speaking-pod">
                  <span style={{ fontSize: 10.5, color: '#94a3b8', marginRight: 6, fontFamily: 'var(--font-mono)' }}>Tutor Speaking</span>
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      style={{
                        width: 3,
                        height: 16,
                        background: teacher.accent,
                        borderRadius: 2,
                        animation: `wave 1.2s ease-in-out infinite alternate`,
                        animationDelay: `${i * 0.15}s`
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Dynamic Panel (either Socratic Chat or Slide Lecture) */}
            <div className="interactive-right-col">
              {isInteractive ? (
                /* Split Interactive Q&A Mode Content */
                <>
                  {/* Chat Panel Header */}
                  <div style={{
                    padding: '10px 14px',
                    borderBottom: '1.5px solid var(--border)',
                    background: 'var(--bg2)',
                    fontSize: 11,
                    fontWeight: 900,
                    color: 'var(--t2)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    flexShrink: 0
                  }}>
                    <span>{teacher.avatar}</span>
                    <span>Socratic Chat: {teacher.name}</span>
                  </div>

                  {/* Messages Area */}
                  <div style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '12px 14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10
                  }}>
                    {chatMessages.length === 0 ? (
                      <div style={{ textAlign: 'center', color: 'var(--t3)', fontSize: 11, margin: '20px auto 0', maxWidth: 280, lineHeight: 1.45 }}>
                        Type a question below or use a quick suggestion chip to explore this slide.
                      </div>
                    ) : (
                      chatMessages.map((msg, idx) => (
                        <div
                          key={idx}
                          className={`chat-bubble ${msg.role}`}
                        >
                          {msg.content}
                        </div>
                      ))
                    )}
                    {chatLoading && (
                      <div className="chat-bubble assistant" style={{ fontStyle: 'italic', color: 'var(--t3)' }}>
                        Thinking... ⏳
                      </div>
                    )}
                    <div ref={chatBottomRef} />
                  </div>

                  {/* Input controls container at bottom of chat panel */}
                  <div style={{
                    padding: '10px 14px',
                    borderTop: '1.5px solid var(--border)',
                    background: 'var(--bg2)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                    flexShrink: 0
                  }}>
                    {/* Quick suggestion chips */}
                    <div style={{
                      display: 'flex',
                      gap: 6,
                      overflowX: 'auto',
                      paddingBottom: 2,
                      width: '100%'
                    }}>
                      <button
                        onClick={() => {
                          setChatInput("Explain as simple as you can");
                        }}
                        className="suggestion-pill"
                      >
                        💡 explain as simple as you can
                      </button>
                      <button
                        onClick={() => {
                          setChatInput("Give me a real-world analogy");
                        }}
                        className="suggestion-pill"
                      >
                        💡 Give me a real-world analogy
                      </button>
                      <button
                        onClick={() => {
                          setChatInput("Show me another code example");
                        }}
                        className="suggestion-pill"
                      >
                        💡 Show me another code example
                      </button>
                    </div>

                    {/* Chat Text Input / Speech Recognition Input */}
                    <form
                      onSubmit={e => {
                        e.preventDefault();
                        if (chatInput.trim() && !chatLoading) {
                          sendInteractiveMessage(chatInput.trim());
                        }
                      }}
                      style={{ display: 'flex', gap: 6, width: '100%' }}
                    >
                      <button
                        type="button"
                        onClick={startVoiceInput}
                        style={{
                          background: isRecording ? 'rgba(239, 68, 68, 0.15)' : 'var(--bg3)',
                          border: isRecording ? '1px solid #ef4444' : '1px solid var(--border)',
                          borderRadius: 10,
                          width: 32,
                          height: 32,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          fontSize: 12,
                          color: isRecording ? '#ef4444' : 'var(--t2)',
                          animation: isRecording ? 'micPulse 1.5s infinite' : 'none',
                          outline: 'none'
                        }}
                        title={isRecording ? "Listening... Click to stop" : "Use voice dictation"}
                      >
                        🎤
                      </button>
                      <input
                        type="text"
                        value={chatInput}
                        onChange={e => setChatInput(e.target.value)}
                        placeholder={`Ask ${teacher.name}...`}
                        disabled={chatLoading}
                        style={{
                          flex: 1,
                          padding: '8px 12px',
                          borderRadius: 10,
                          border: '1.5px solid var(--border)',
                          background: 'var(--bg1)',
                          color: 'var(--t1)',
                          fontSize: 11.5,
                          outline: 'none'
                        }}
                      />
                      <button
                        type="submit"
                        disabled={!chatInput.trim() || chatLoading}
                        style={{
                          padding: '8px 14px',
                          borderRadius: 10,
                          background: chatInput.trim() && !chatLoading ? teacher.accent : 'var(--bg3)',
                          color: chatInput.trim() && !chatLoading ? '#fff' : 'var(--t3)',
                          border: 'none',
                          fontSize: 11.5,
                          fontWeight: 700,
                          cursor: chatInput.trim() && !chatLoading ? 'pointer' : 'not-allowed'
                        }}
                      >
                        Send
                      </button>
                    </form>
                    
                    {/* Confirm understanding button to proceed to next slide */}
                    {!understandingConfirmed[currentSlide - 1] && (
                      <button
                        type="button"
                        onClick={() => {
                          setUnderstandingConfirmed(prev => ({ ...prev, [currentSlide - 1]: true }));
                          setIsInteractive(false);
                          toast.success("Awesome!", "Understanding confirmed.");
                          handleNextSlide();
                        }}
                        style={{
                          width: '100%',
                          background: '#10b981',
                          border: 'none',
                          color: '#fff',
                          padding: '8px 12px',
                          borderRadius: 10,
                          fontSize: 11.5,
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 6,
                          transition: 'background 0.2s',
                          marginTop: 4
                        }}
                      >
                        👍 I understand now, proceed to next slide
                      </button>
                    )}
                  </div>
                </>
              ) : (
                /* Lecture Slides Deck Mode Content */
                <div style={{
                  flex: 1,
                  overflowY: 'auto',
                  padding: '18px 22px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 14
                }}>
                  {currentSlide === 0 && (
                    <div style={{ textAlign: 'center', padding: '12px 0' }}>
                      <h3 style={{ fontSize: 14, fontWeight: 900, color: 'var(--t1)' }}>Welcome to your Quest roadmap!</h3>
                      <p style={{ fontSize: 11.5, color: 'var(--t3)', marginTop: 4, lineHeight: 1.45, maxWidth: 650, margin: '4px auto 0' }}>
                        We will step through each requirement of the course syllabus. Listen closely to each slide before unlocking your immediate coding test.
                      </p>
                    </div>
                  )}

                  {slidesLoading && currentSlide > 0 && currentSlide <= (slides.length || syllabus.length) && (
                    <div style={{ textAlign: 'center', padding: '24px 0' }}>
                      <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--t3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                        <span className="animate-spin" style={{ display: 'inline-block', animation: 'spin 1.5s linear infinite' }}>🌀</span> Generating customized Socratic lecture slides...
                      </div>
                    </div>
                  )}

                  {!slidesLoading && currentSlide > 0 && currentSlide <= slides.length && slides[currentSlide - 1] && (() => {
                    const slide = slides[currentSlide - 1];
                    const bulletPoints = Array.isArray(slide.bulletPoints) ? slide.bulletPoints : [];
                    return (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, textAlign: 'left' }}>
                        <h4 style={{ fontSize: 15, fontWeight: 900, color: teacher.accent, margin: 0 }}>{slide.title || 'Lesson Slide'}</h4>
                        {bulletPoints.length > 0 && (
                          <ul style={{ listStyleType: 'disc', paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8, margin: 0 }}>
                            {bulletPoints.map((bp: string, i: number) => (
                              <li key={i} style={{ fontSize: 11.5, color: 'var(--t2)', lineHeight: 1.45 }}>{bp}</li>
                            ))}
                          </ul>
                        )}

                        {/* 🏢 REAL-WORLD ANALOGY & PRODUCTION CASE STUDY CARD */}
                        {(() => {
                          const currentTopicKey = (slide.title || '').toLowerCase();
                          let matchedAnalogy = CONCEPT_ANALOGIES_REGISTRY['python-functions'];
                          if (currentTopicKey.includes('loop') || currentTopicKey.includes('iterat')) matchedAnalogy = CONCEPT_ANALOGIES_REGISTRY['python-loops'];
                          else if (currentTopicKey.includes('dict') || currentTopicKey.includes('hash') || currentTopicKey.includes('map')) matchedAnalogy = CONCEPT_ANALOGIES_REGISTRY['python-dicts'];
                          else if (currentTopicKey.includes('class') || currentTopicKey.includes('oop') || currentTopicKey.includes('object')) matchedAnalogy = CONCEPT_ANALOGIES_REGISTRY['python-classes'];
                          else if (currentTopicKey.includes('async') || currentTopicKey.includes('event')) matchedAnalogy = CONCEPT_ANALOGIES_REGISTRY['python-async'];
                          else if (currentTopicKey.includes('react') || currentTopicKey.includes('component')) matchedAnalogy = CONCEPT_ANALOGIES_REGISTRY['react-components'];
                          else if (currentTopicKey.includes('hook') || currentTopicKey.includes('state')) matchedAnalogy = CONCEPT_ANALOGIES_REGISTRY['react-hooks'];
                          else if (currentTopicKey.includes('neural') || currentTopicKey.includes('tensor') || currentTopicKey.includes('ml')) matchedAnalogy = CONCEPT_ANALOGIES_REGISTRY['ml-neural-nets'];
                          else if (currentTopicKey.includes('index') || currentTopicKey.includes('sql') || currentTopicKey.includes('db')) matchedAnalogy = CONCEPT_ANALOGIES_REGISTRY['db-indexes'];
                          else if (currentTopicKey.includes('docker') || currentTopicKey.includes('container') || currentTopicKey.includes('devops')) matchedAnalogy = CONCEPT_ANALOGIES_REGISTRY['devops-docker'];
                          else if (currentTopicKey.includes('account') || currentTopicKey.includes('financial') || currentTopicKey.includes('bookkeeping')) matchedAnalogy = CONCEPT_ANALOGIES_REGISTRY['bcom-accounting'];
                          else if (currentTopicKey.includes('supply') || currentTopicKey.includes('inventory') || currentTopicKey.includes('order')) matchedAnalogy = CONCEPT_ANALOGIES_REGISTRY['bcom-supplychain'];

                          return (
                            <div style={{
                              margin: '4px 0 8px 0',
                              padding: '12px 16px',
                              borderRadius: 14,
                              background: 'linear-gradient(135deg, rgba(59,130,246,0.12), rgba(16,185,129,0.08))',
                              border: '1px solid rgba(59,130,246,0.3)',
                              boxShadow: '0 4px 14px rgba(0,0,0,0.15)'
                            }}>
                              <div style={{ fontSize: 10.5, fontWeight: 900, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>
                                🏢 Real-World Intuitive Analogy
                              </div>
                              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--t1)', lineHeight: 1.45, marginBottom: 8 }}>
                                {matchedAnalogy.analogy}
                              </div>
                              <div style={{ fontSize: 11, fontWeight: 800, color: '#34d399' }}>
                                {matchedAnalogy.realWorldUseCase}
                              </div>
                            </div>
                          );
                        })()}

                        {slide.codeExample && (
                          <div id="slide-code-execution-block" style={{ marginTop: 8 }}>
                            <div style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              background: '#1e293b',
                              padding: '6px 12px',
                              borderTopLeftRadius: 12,
                              borderTopRightRadius: 12,
                              borderBottom: '1px solid rgba(255,255,255,0.06)'
                            }}>
                              <span style={{ fontSize: 10, color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>Solution.java</span>
                              <button
                                onClick={() => simulateCodeRun(currentSlide - 1, slide.mockOutput)}
                                style={{
                                  background: '#10b981',
                                  border: 'none',
                                  color: '#ffffff',
                                  fontSize: 9.5,
                                  fontWeight: 700,
                                  padding: '3px 8px',
                                  borderRadius: 6,
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 4,
                                  transition: 'background 0.2s'
                                }}
                              >
                                {codeRunning[currentSlide - 1] ? '⏳ Compiling...' : '▶ Run Code'}
                              </button>
                            </div>
                            <pre style={{
                              background: '#0e1420',
                              padding: '14px 18px',
                              borderBottomLeftRadius: codeOutputs[currentSlide - 1] ? 0 : 12,
                              borderBottomRightRadius: codeOutputs[currentSlide - 1] ? 0 : 12,
                              fontSize: 10.5,
                              fontFamily: 'var(--font-mono)',
                              color: '#e2e8f0',
                              overflowX: 'auto',
                              border: '1px solid rgba(255,255,255,0.06)',
                              borderTop: 'none',
                              margin: 0,
                              boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)'
                            }}>
                              <code>{slide.codeExample}</code>
                            </pre>
                            {codeOutputs[currentSlide - 1] && (
                              <div style={{
                                background: '#05070a',
                                border: '1px solid rgba(255,255,255,0.06)',
                                borderTop: 'none',
                                borderBottomLeftRadius: 12,
                                borderBottomRightRadius: 12,
                                padding: '10px 14px',
                                fontFamily: 'var(--font-mono)',
                                fontSize: 10,
                                color: '#a7f3d0'
                              }}>
                                <div style={{ color: '#64748b', marginBottom: 4 }}>$ javac Solution.java && java Solution</div>
                                <div style={{ whiteSpace: 'pre-line' }}>{codeOutputs[currentSlide - 1]}</div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Interactive Understanding Check instead of MCQ on content slides */}
                        {(teachingCompleted || understandingConfirmed[currentSlide - 1]) && (
                          <div style={{
                            marginTop: 12,
                            background: 'rgba(99, 102, 241, 0.03)',
                            border: '1px dashed var(--border)',
                            borderRadius: 12,
                            padding: '10px 14px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: 12
                          }}>
                            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--t1)' }}>
                              ❓ Did you understand this concept?
                            </span>
                            {understandingConfirmed[currentSlide - 1] ? (
                              <span style={{ color: '#10b981', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                                ✓ Concept Confirmed
                              </span>
                            ) : (
                              <div style={{ display: 'flex', gap: 6 }}>
                                <button
                                  onClick={() => {
                                    setUnderstandingConfirmed(prev => ({ ...prev, [currentSlide - 1]: true }));
                                    toast.success("Great!", "Understanding confirmed. Click 'Next Slide' to continue.");
                                  }}
                                  style={{
                                    background: '#10b981',
                                    border: 'none',
                                    color: '#fff',
                                    padding: '6px 12px',
                                    borderRadius: 6,
                                    fontSize: 10.5,
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    transition: 'background 0.2s'
                                  }}
                                >
                                  👍 Yes
                                </button>
                                <button
                                  onClick={async () => {
                                    setIsInteractive(true);
                                    setChatMessages([{
                                      role: 'assistant',
                                      content: "What did you not understand about this topic? Ask me for a real-world analogy, or let me know what was confusing."
                                    }]);
                                    
                                    speakWithAvatar(
                                      "What did you not understand?",
                                      teacherId,
                                      () => setIsPlaying(true),
                                      () => setIsPlaying(false)
                                    );
                                  }}
                                  style={{
                                    background: 'rgba(239, 68, 68, 0.08)',
                                    border: '1px solid rgba(239, 68, 68, 0.2)',
                                    color: '#ef4444',
                                    padding: '6px 12px',
                                    borderRadius: 6,
                                    fontSize: 10.5,
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    transition: 'background 0.2s'
                                  }}
                                >
                                  👎 No, explain further
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })()}

                {isLastSlide && (() => {
                  if (examPassed) {
                    return (
                      <div style={{ textAlign: 'center', padding: '16px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                        <span style={{ fontSize: 40 }}>🎓</span>
                        <h3 style={{ fontSize: 16, fontWeight: 900, color: 'var(--green)' }}>Syllabus Exam Passed!</h3>
                        <p style={{ fontSize: 12, color: 'var(--t2)', lineHeight: 1.45, maxWidth: 500, margin: '0 auto' }}>
                          Excellent job! You successfully completed the conceptual review and answered all evaluation questions correctly.
                        </p>
                      </div>
                    );
                  }

                  const dynamicQuestions = slides.map(s => s.mcq).filter(Boolean);
                  const canonicalBenchmarkQuestions = [
                    {
                      question: `Canonical Production Benchmark Q4: In a high-throughput enterprise service, what is the optimal architectural rule for ${questData.title}?`,
                      options: [
                        `Utilize fast indexed lookups O(1)/O(log N) while managing memory cache overhead cleanly.`,
                        `Create uncached raw arrays on every request without checking heap boundaries.`,
                        `Disable exception handling to suppress error outputs.`
                      ],
                      answerIndex: 0,
                      explanation: `Enterprise production architecture requires fast O(1)/O(log N) lookup speeds while controlling memory allocations.`
                    },
                    {
                      question: `Canonical System Safety Q5: What is the primary safety rule to prevent runtime null-pointer or memory-leak crashes?`,
                      options: [
                        `Enforce strict non-null input validation checks and clean resource deallocation before payload return.`,
                        `Hide runtime exceptions behind silent try-catch blocks without logging.`,
                        `Return dummy 0-byte arrays without tracing the root cause.`
                      ],
                      answerIndex: 0,
                      explanation: `Robust system design requires non-null validation checks, explicit resource cleanup, and detailed error logging.`
                    }
                  ];

                  const hybridExamQuestions = [
                    ...dynamicQuestions.slice(0, 3),
                    ...canonicalBenchmarkQuestions
                  ];

                  const question = hybridExamQuestions[examQuestionIndex];
                  if (!question) {
                    return (
                      <div style={{ textAlign: 'center', padding: '12px 0' }}>
                        <p style={{ fontSize: 11.5, color: 'var(--t3)' }}>Loading exam questions...</p>
                      </div>
                    );
                  }

                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, textAlign: 'left' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h4 style={{ fontSize: 14, fontWeight: 900, color: teacher.accent }}>Syllabus Evaluation Exam</h4>
                        <span style={{ fontSize: 10.5, color: 'var(--t3)', fontFamily: 'var(--font-mono)' }}>
                          Question {examQuestionIndex + 1} of {hybridExamQuestions.length} ({examQuestionIndex < 3 ? 'AI Dynamic' : 'Canonical Benchmark'})
                        </span>
                      </div>

                      <div style={{
                        background: 'var(--accent-light)',
                        border: '1px solid var(--border)',
                        borderRadius: 16,
                        padding: 16,
                        boxShadow: 'var(--shadow-sm)'
                      }}>
                        <p style={{ fontSize: 12, fontWeight: 800, color: 'var(--t1)', marginBottom: 12 }}>
                          ❓ {question.question}
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          {question.options.map((option: string, oIdx: number) => {
                            const isSelected = selectedMcqAnswer === oIdx;
                            let stateClass = "";
                            if (isSelected) stateClass = "selected";
                            if (mcqChecked) {
                              if (isSelected && oIdx === question.answerIndex) {
                                stateClass = "correct";
                              } else if (isSelected) {
                                stateClass = "incorrect";
                              }
                            }
                            return (
                              <button
                                key={oIdx}
                                disabled={mcqChecked}
                                onClick={() => setSelectedMcqAnswer(oIdx)}
                                className={`mcq-option-btn ${stateClass}`}
                                style={{
                                  textAlign: 'left',
                                  padding: '10px 14px',
                                  fontSize: 11.5
                                }}
                              >
                                {option}
                              </button>
                            );
                          })}
                        </div>

                        {!mcqChecked && selectedMcqAnswer !== null && (
                          <button
                            onClick={() => {
                              setMcqChecked(true);
                              const correct = selectedMcqAnswer === question.answerIndex;
                              setMcqIsCorrect(correct);
                              if (correct) {
                                toast.success("Correct Answer!", "Excellent work.");
                              } else {
                                toast.error("Incorrect Answer", "Please try again.");
                              }
                            }}
                            className="btn-primary"
                            style={{
                              marginTop: 14,
                              padding: '8px 18px',
                              fontSize: 11,
                              borderRadius: 8
                            }}
                          >
                            Verify Answer
                          </button>
                        )}

                        {mcqChecked && (
                          <div style={{ marginTop: 14 }}>
                            {mcqIsCorrect ? (
                              <div>
                                <div style={{
                                  background: 'var(--bg3)',
                                  border: '1px solid var(--border)',
                                  borderRadius: 8,
                                  padding: 10,
                                  fontSize: 11,
                                  color: 'var(--t2)',
                                  lineHeight: 1.45,
                                  marginBottom: 10
                                }}>
                                  <strong style={{ color: '#10b981' }}>💡 Tutor Explanation:</strong> {question.explanation}
                                </div>
                                <button
                                  onClick={() => {
                                    if (examQuestionIndex + 1 === hybridExamQuestions.length) {
                                      setExamPassed(true);
                                      playChime();
                                      launchConfetti();
                                      toast.success("Exam Passed!", "Congratulations on completing the syllabus review.");
                                    } else {
                                      setExamQuestionIndex(prev => prev + 1);
                                    }
                                  }}
                                  className="btn-primary"
                                  style={{
                                    padding: '8px 18px',
                                    fontSize: 11,
                                    borderRadius: 8,
                                    background: 'var(--green)'
                                  }}
                                >
                                  {examQuestionIndex + 1 === hybridExamQuestions.length ? 'Finish Exam 🎓' : 'Next Question →'}
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => {
                                  setSelectedMcqAnswer(null);
                                  setMcqChecked(false);
                                }}
                                className="btn-primary"
                                style={{
                                  padding: '8px 18px',
                                  fontSize: 11,
                                  borderRadius: 8,
                                  background: '#ef4444'
                                }}
                              >
                                Try Again
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        </div>

          {/* Navigation Actions */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid var(--border)',
            paddingTop: 14,
            flexShrink: 0
          }}>
            <button
              onClick={handlePrevSlide}
              disabled={currentSlide === 0}
              style={{
                background: 'transparent',
                border: '1px solid var(--border)',
                padding: '10px 18px',
                borderRadius: 12,
                fontSize: 12.5,
                fontWeight: 700,
                color: 'var(--t2)',
                cursor: currentSlide === 0 ? 'not-allowed' : 'pointer',
                opacity: currentSlide === 0 ? 0.5 : 1
              }}
            >
              ◀ Previous Slide
            </button>

            {/* Q&A Interactive Toggle Mode Button */}
            <button
              onClick={() => {
                stopSpeaking();
                setIsPlaying(false);
                setIsInteractive(!isInteractive);
              }}
              style={{
                padding: '10px 20px',
                borderRadius: 12,
                border: `1.5px solid ${isInteractive ? 'var(--border)' : teacher.accent}`,
                background: isInteractive ? 'transparent' : `${teacher.accent}15`,
                color: isInteractive ? 'var(--t2)' : teacher.accent,
                fontSize: 12.5,
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                transition: 'all 0.2s'
              }}
            >
              {isInteractive ? '📖 Slide Lecture' : '💬 Interactive Q&A'}
            </button>

            {isLastSlide ? (
              <button
                disabled={!examPassed}
                onClick={() => {
                  addCompletedQuest(questId, true, 150);
                  toast.success("Stage Completed!", "Heading back to the quest roadmap.");
                  router.push('/quests');
                }}
                className={`btn-primary ${examPassed ? 'animate-pulse' : ''}`}
                style={{
                  padding: '10px 24px',
                  fontSize: 13,
                  fontWeight: 900,
                  borderRadius: 12,
                  background: examPassed ? 'var(--green)' : '#475569',
                  color: examPassed ? '#fff' : '#94a3b8',
                  cursor: examPassed ? 'pointer' : 'not-allowed',
                  opacity: examPassed ? 1 : 0.6
                }}
              >
                Finish Quest & Return 🏁
              </button>
            ) : (() => {
              const isLearningSlide = currentSlide > 0 && currentSlide <= slides.length;
              const nextUnlocked = !isLearningSlide || understandingConfirmed[currentSlide - 1];
              return (
                <button
                  onClick={() => {
                    if (!nextUnlocked) {
                      toast.error("Understanding Required", "Please click 'Yes, I understand' or ask the tutor to explain before moving to the next slide.");
                      return;
                    }
                    handleNextSlide();
                  }}
                  style={{
                    background: nextUnlocked ? teacher.accent : '#475569',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: 12,
                    fontSize: 12.5,
                    fontWeight: 700,
                    color: nextUnlocked ? '#fff' : '#94a3b8',
                    cursor: nextUnlocked ? 'pointer' : 'not-allowed',
                    opacity: nextUnlocked ? 1 : 0.6
                  }}
                >
                  Next Slide ▶
                </button>
              );
            })()}
          </div>
        </div>
      )}

      {/* Confetti Visual overlay */}
      {confettiParticles.length > 0 && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          zIndex: 9999,
          pointerEvents: 'none',
          overflow: 'visible'
        }}>
          {confettiParticles.map(p => (
            <div
              key={p.id}
              style={{
                position: 'absolute',
                width: p.size,
                height: p.size,
                borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                background: p.color,
                transform: p.transform,
                transition: p.transition,
                opacity: 0.9
              }}
            />
          ))}
        </div>
      )}



      {/* Gamified Syllabus Exam Success Overlay Modal Card */}
      {examPassed && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(5, 8, 16, 0.85)',
          backdropFilter: 'blur(8px)',
          zIndex: 999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20
        }} className="animate-fade-in">
          <div style={{
            background: 'var(--bg2)',
            border: '1.5px solid var(--green)',
            borderRadius: 24,
            padding: '32px 24px',
            maxWidth: 420,
            width: '100%',
            textAlign: 'center',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 16
          }}>
            <span style={{ fontSize: 48, animation: 'pulse 2s infinite' }}>🏆</span>
            <h2 style={{ fontSize: 20, fontWeight: 900, color: 'var(--green)', fontFamily: 'var(--font-display)', margin: 0 }}>
              Syllabus Passed!
            </h2>
            <p style={{ fontSize: 12.5, color: 'var(--t2)', lineHeight: 1.5, margin: 0 }}>
              Congratulations, developer! You successfully cleared all Socratic slide checkpoints and passed the syllabus evaluation exam.
            </p>

            <div style={{
              display: 'flex',
              gap: 12,
              width: '100%',
              marginTop: 6
            }}>
              <div style={{
                flex: 1,
                background: 'rgba(16,185,129,0.08)',
                border: '1.5px solid rgba(16,185,129,0.2)',
                borderRadius: 14,
                padding: '10px 6px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: 10, color: 'var(--t3)', fontFamily: 'var(--font-mono)' }}>XP Earned</div>
                <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--green)', marginTop: 2 }}>+150 XP</div>
              </div>
              <div style={{
                flex: 1,
                background: 'rgba(234,179,8,0.08)',
                border: '1.5px solid rgba(234,179,8,0.2)',
                borderRadius: 14,
                padding: '10px 6px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: 10, color: 'var(--t3)', fontFamily: 'var(--font-mono)' }}>Pins Bonus</div>
                <div style={{ fontSize: 18, fontWeight: 900, color: '#eab308', marginTop: 2 }}>+5 Pins</div>
              </div>
            </div>

            <button
              onClick={() => {
                addCompletedQuest(questId, true, 150);
                toast.success("Stage Completed!", "Heading back to the quest roadmap.");
                router.push('/quests');
              }}
              className="btn-primary animate-pulse"
              style={{
                marginTop: 10,
                width: '100%',
                padding: '12px 20px',
                fontSize: 13,
                fontWeight: 900,
                borderRadius: 12,
                background: 'var(--green)'
              }}
            >
              Return to Roadmap 🏁
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
