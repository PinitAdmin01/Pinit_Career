'use client';
import { useState, useEffect, useRef, Suspense, useCallback } from 'react';
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
import { JAVA_PILOT_DAYS } from '@/lib/data/javaPilotDays';
import { PYTHON_PILOT_DAYS } from '@/lib/data/pythonPilotDays';
import { REACT_PILOT_DAYS } from '@/lib/data/reactPilotDays';
import { DATABASE_PILOT_DAYS } from '@/lib/data/databasePilotDays';
import { DSA_PILOT_DAYS } from '@/lib/data/dsaPilotDays';
import { FULLSTACK_PILOT_DAYS } from '@/lib/data/fullstackPilotDays';
import { CLOUD_PILOT_DAYS } from '@/lib/data/cloudPilotDays';
import { DEVOPS_PILOT_DAYS } from '@/lib/data/devopsPilotDays';
import { AI_PILOT_DAYS } from '@/lib/data/aiPilotDays';
import { DISTRIBUTED_PILOT_DAYS } from '@/lib/data/distributedPilotDays';
import { IOT_EMBEDDED_PILOT_DAYS } from '@/lib/data/iotEmbeddedPilotDays';
import { GRAPHICS_3D_PILOT_DAYS } from '@/lib/data/graphics3dPilotDays';
import { BLOCKCHAIN_PILOT_DAYS } from '@/lib/data/blockchainPilotDays';
import { IOT_NETWORK_PILOT_DAYS } from '@/lib/data/iotNetworkPilotDays';
import { IOT_EDGE_AI_PILOT_DAYS } from '@/lib/data/iotEdgeAiPilotDays';
import { IOT_SECURITY_PILOT_DAYS } from '@/lib/data/iotSecurityPilotDays';
import { QUANT_PILOT_DAYS } from '@/lib/data/quantPilotDays';
import { BCOM_ACCOUNTING_PILOT_DAYS } from '@/lib/data/bcomAccountingPilotDays';
import { BCOM_FINANCE_PILOT_DAYS } from '@/lib/data/bcomFinancePilotDays';
import { BCOM_ANALYTICS_PILOT_DAYS } from '@/lib/data/bcomAnalyticsPilotDays';
import { BCOM_MARKETING_PILOT_DAYS } from '@/lib/data/bcomMarketingPilotDays';
import { BCOM_DIGITAL_MARKETING_PILOT_DAYS } from '@/lib/data/bcomDigitalMarketingPilotDays';
import { BCOM_ECOMMERCE_PILOT_DAYS } from '@/lib/data/bcomEcommercePilotDays';
import { BCOM_ENTREPRENEURSHIP_PILOT_DAYS } from '@/lib/data/bcomEntrepreneurshipPilotDays';
import { BCOM_SALES_CRM_PILOT_DAYS } from '@/lib/data/bcomSalesCrmPilotDays';
import { BCOM_OPERATIONS_PILOT_DAYS } from '@/lib/data/bcomOperationsPilotDays';
import { BCOM_AI_TRANSFORMATION_PILOT_DAYS } from '@/lib/data/bcomAiTransformationPilotDays';
import { COMPUTER_FUNDAMENTALS_PILOT_DAYS } from '@/lib/data/computerFundamentalsPilotDays';
import { AI_PROMPT_LITERACY_PILOT_DAYS } from '@/lib/data/aiPromptLiteracyPilotDays';


const AvatarMentorWidget = dynamic(() => import('@/components/avatar/AvatarMentorWidget'), { ssr: false });
const QuestWorkspaceClient = dynamic(() => import('@/components/quests/QuestWorkspaceClient'), { ssr: false });

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
  const returningRef = useRef(false);

  const resolveQuestId = () => {
    if (questId) return questId;
    if (typeof window === 'undefined') return '';
    return new URLSearchParams(window.location.search).get('questId') || '';
  };

  const finishLessonAndReturn = useCallback(() => {
    if (returningRef.current) return;
    returningRef.current = true;
    const id = resolveQuestId();
    if (id) {
      const course = COURSES_REGISTRY.find(c => (c.quests || []).some(q => q.id === id));
      addCompletedQuest(id, true, 150, course?.id);
    }
    toast.success('Stage Completed!', 'Heading back to the quest roadmap.');
    stopSpeaking();
    window.location.assign('/quests/');
  }, [questId, addCompletedQuest]);

  const teacher = TEACHER_METADATA[teacherId] || TEACHER_METADATA.kashyap;

  // Check COURSES_REGISTRY first for authoritative course curriculum
  let questData: any = null;
  for (const course of COURSES_REGISTRY) {
    const found = (course.quests || []).find(q => q.id === questId);
    if (found) {
      questData = found;
      break;
    }
  }

  // Fallback to custom AI-generated roadmap modules in localStorage if not in standard registry
  if (!questData && typeof window !== 'undefined' && userId) {
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



  if (questData?.type === 'coding' || (questId && (questId.includes('-exam-') || questId.includes('-assign-')))) {
    return <QuestWorkspaceClient questId={questId} />;
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
        nextSpeechText = `Let us explore Section ${currentSlide + 1}: "${concept}". Observe the live code example and see what happens when it runs. Feel free to ask me any questions!`;
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

    // Language & environment detector
    const qLower = (questId || '').toLowerCase();
    const isReact = qLower.includes('react') || (questData.title || '').toLowerCase().includes('react');
    const isJava = qLower.includes('java') || (questData.title || '').toLowerCase().includes('java');
    const isPython = qLower.includes('python') || (questData.title || '').toLowerCase().includes('python');
    const isSQL = qLower.includes('sql') || qLower.includes('database') || (questData.title || '').toLowerCase().includes('sql');
    const isDSA = qLower.includes('dsa') || (questData.title || '').toLowerCase().includes('dsa') || (questData.title || '').toLowerCase().includes('algorithmic');
    const isFullstack = qLower.includes('fullstack') || (questData.title || '').toLowerCase().includes('fullstack') || (questData.title || '').toLowerCase().includes('full-stack');
    const isCloud = qLower.includes('cloud') || (questData.title || '').toLowerCase().includes('cloud') || (questData.title || '').toLowerCase().includes('aws');
    const isDevOps = qLower.includes('devops') || qLower.includes('docker') || qLower.includes('k8s') || qLower.includes('cicd') || (questData.title || '').toLowerCase().includes('devops');
    const isComputerFundamentals = qLower.includes('comp_fund') || qLower.includes('comp-fund') || qLower.includes('computer_fundamentals') || qLower.includes('digital_productivity') || (questData.title || '').toLowerCase().includes('computer literacy') || (questData.title || '').toLowerCase().includes('os fundamentals') || (questData.title || '').toLowerCase().includes('von neumann') || (questData.title || '').toLowerCase().includes('chmod') || (questData.title || '').toLowerCase().includes('shannon entropy') || (questData.title || '').toLowerCase().includes('3-2-1 backup');
    const isAiTransformation = qLower.includes('bcom_ait') || qLower.includes('bcom-ait') || qLower.includes('digital_transformation') || qLower.includes('transformation') || (questData.title || '').toLowerCase().includes('digital transformation') || (questData.title || '').toLowerCase().includes('transformation') || (questData.title || '').toLowerCase().includes('create framework') || (questData.title || '').toLowerCase().includes('4/5ths') || (questData.title || '').toLowerCase().includes('kotter') || (questData.title || '').toLowerCase().includes('finops');
    const isOperations = qLower.includes('bcom_ops') || qLower.includes('bcom-ops') || qLower.includes('operations') || qLower.includes('supplychain') || qLower.includes('compliance') || (questData.title || '').toLowerCase().includes('operations') || (questData.title || '').toLowerCase().includes('supply chain') || (questData.title || '').toLowerCase().includes('compliance') || (questData.title || '').toLowerCase().includes('sipoc') || (questData.title || '').toLowerCase().includes('eoq') || (questData.title || '').toLowerCase().includes('oee') || (questData.title || '').toLowerCase().includes('dmaic') || (questData.title || '').toLowerCase().includes('otif') || (questData.title || '').toLowerCase().includes('tpm') || (questData.title || '').toLowerCase().includes('mrp');
    const isSalesCrm = qLower.includes('bcom_scrm') || qLower.includes('bcom-scrm') || qLower.includes('sales') || qLower.includes('crm') || qLower.includes('customer_success') || (questData.title || '').toLowerCase().includes('sales') || (questData.title || '').toLowerCase().includes('customer success') || (questData.title || '').toLowerCase().includes('crm') || (questData.title || '').toLowerCase().includes('meddpicc') || (questData.title || '').toLowerCase().includes('nrr') || (questData.title || '').toLowerCase().includes('ttv') || (questData.title || '').toLowerCase().includes('zopa') || (questData.title || '').toLowerCase().includes('batna') || (questData.title || '').toLowerCase().includes('qbr');
    const isEntrepreneurship = qLower.includes('bcom_ent') || qLower.includes('bcom-ent') || qLower.includes('entrepreneurship') || qLower.includes('biz_mgmt') || qLower.includes('startup') || (questData.title || '').toLowerCase().includes('entrepreneurship') || (questData.title || '').toLowerCase().includes('business management') || (questData.title || '').toLowerCase().includes('bmc') || (questData.title || '').toLowerCase().includes('break-even') || (questData.title || '').toLowerCase().includes('runway') || (questData.title || '').toLowerCase().includes('safe') || (questData.title || '').toLowerCase().includes('cap table') || (questData.title || '').toLowerCase().includes('vesting');
    const isEcommerce = qLower.includes('bcom_ecom') || qLower.includes('bcom-ecom') || qLower.includes('ecommerce') || qLower.includes('ecom') || qLower.includes('digital_biz') || (questData.title || '').toLowerCase().includes('e-commerce') || (questData.title || '').toLowerCase().includes('ecommerce') || (questData.title || '').toLowerCase().includes('digital business') || (questData.title || '').toLowerCase().includes('bopis') || (questData.title || '').toLowerCase().includes('boris') || (questData.title || '').toLowerCase().includes('dropshipping') || (questData.title || '').toLowerCase().includes('buy box');
    const isDigitalMarketing = qLower.includes('bcom_dmkt') || qLower.includes('bcom-dmkt') || qLower.includes('digital_marketing') || qLower.includes('dmkt') || (questData.title || '').toLowerCase().includes('digital marketing') || (questData.title || '').toLowerCase().includes('growth strategy') || (questData.title || '').toLowerCase().includes('seo') || (questData.title || '').toLowerCase().includes('sem') || (questData.title || '').toLowerCase().includes('cro') || (questData.title || '').toLowerCase().includes('roas') || (questData.title || '').toLowerCase().includes('aarrr') || (questData.title || '').toLowerCase().includes('clv');
    const isMarketing = qLower.includes('bcom_mkt') || qLower.includes('bcom-mkt') || qLower.includes('marketing') || qLower.includes('branding') || (questData.title || '').toLowerCase().includes('marketing') || (questData.title || '').toLowerCase().includes('brand') || (questData.title || '').toLowerCase().includes('stp') || (questData.title || '').toLowerCase().includes('cbbe');
    const isAnalytics = qLower.includes('bcom_ana') || qLower.includes('bcom-ana') || qLower.includes('analytics') || qLower.includes('decision_intelligence') || (questData.title || '').toLowerCase().includes('analytics') || (questData.title || '').toLowerCase().includes('decision intelligence') || (questData.title || '').toLowerCase().includes('eda') || (questData.title || '').toLowerCase().includes('rfm');
    const isFinance = qLower.includes('bcom_fin') || qLower.includes('bcom-fin') || qLower.includes('finance') || qLower.includes('investment') || qLower.includes('capital_budgeting') || (questData.title || '').toLowerCase().includes('finance') || (questData.title || '').toLowerCase().includes('investment') || (questData.title || '').toLowerCase().includes('tvm') || (questData.title || '').toLowerCase().includes('capital budgeting');
    const isAccounting = qLower.includes('bcom_acc') || qLower.includes('bcom-acc') || qLower.includes('accounting') || qLower.includes('taxation') || qLower.includes('tally') || (questData.title || '').toLowerCase().includes('accounting') || (questData.title || '').toLowerCase().includes('taxation') || (questData.title || '').toLowerCase().includes('tally') || (questData.title || '').toLowerCase().includes('gst');
    const isQuant = qLower.includes('quant') || qLower.includes('trading') || qLower.includes('hft') || (questData.title || '').toLowerCase().includes('quantitative') || (questData.title || '').toLowerCase().includes('trading') || (questData.title || '').toLowerCase().includes('low-latency') || (questData.title || '').toLowerCase().includes('order book');
    const isIotSecurity = qLower.includes('iot_sec') || qLower.includes('iot-sec') || qLower.includes('security') || (questData.title || '').toLowerCase().includes('security') || (questData.title || '').toLowerCase().includes('root of trust') || (questData.title || '').toLowerCase().includes('efuse') || (questData.title || '').toLowerCase().includes('device lifecycle');
    const isIotEdge = qLower.includes('iot_edge') || qLower.includes('iot-edge') || qLower.includes('tinyml') || qLower.includes('edge') || (questData.title || '').toLowerCase().includes('tinyml') || (questData.title || '').toLowerCase().includes('edge ai') || (questData.title || '').toLowerCase().includes('dsp');
    const isAI = qLower.includes('ai') || qLower.includes('llm') || qLower.includes('rag') || (questData.title || '').toLowerCase().includes('ai') || (questData.title || '').toLowerCase().includes('generative');
    const isDistributed = qLower.includes('dist') || qLower.includes('consensus') || qLower.includes('raft') || (questData.title || '').toLowerCase().includes('distributed');
    const isIotNet = qLower.includes('iot_net') || qLower.includes('iot-net') || (questData.title || '').toLowerCase().includes('wireless') || (questData.title || '').toLowerCase().includes('lora') || (questData.title || '').toLowerCase().includes('zigbee') || (questData.title || '').toLowerCase().includes('coap');
    const isIoT = qLower.includes('iot') || qLower.includes('emb') || (questData.title || '').toLowerCase().includes('embedded') || (questData.title || '').toLowerCase().includes('iot') || (questData.title || '').toLowerCase().includes('firmware');
    const isGraphics3D = qLower.includes('g3d') || qLower.includes('graphics') || qLower.includes('3d') || (questData.title || '').toLowerCase().includes('3d') || (questData.title || '').toLowerCase().includes('graphics') || (questData.title || '').toLowerCase().includes('avatar');
    const isBlockchain = qLower.includes('blockchain') || qLower.includes('web3') || qLower.includes('solidity') || qLower.includes('crypto') || (questData.title || '').toLowerCase().includes('blockchain') || (questData.title || '').toLowerCase().includes('web3') || (questData.title || '').toLowerCase().includes('solidity') || (questData.title || '').toLowerCase().includes('smart contract');

    // Check if quest belongs to an authoritative pilot day
    const dayMatch = (questId || '').match(/day-(\d+)/i);
    const dayNum = dayMatch ? parseInt(dayMatch[1], 10) : 0;
    let pilotDay: any = null;
    if (isJava && dayNum > 0) {
      pilotDay = JAVA_PILOT_DAYS.find(p => p.day === dayNum) || null;
    } else if (isPython && dayNum > 0) {
      pilotDay = PYTHON_PILOT_DAYS.find(p => p.day === dayNum) || null;
    } else if (isReact && dayNum > 0) {
      pilotDay = REACT_PILOT_DAYS.find(p => p.day === dayNum) || null;
    } else if (isSQL && dayNum > 0) {
      pilotDay = DATABASE_PILOT_DAYS.find(p => p.day === dayNum) || null;
    } else if (isDSA && dayNum > 0) {
      pilotDay = DSA_PILOT_DAYS.find(p => p.day === dayNum) || null;
    } else if (isFullstack && dayNum > 0) {
      pilotDay = FULLSTACK_PILOT_DAYS.find(p => p.day === dayNum) || null;
    } else if (isCloud && dayNum > 0) {
      pilotDay = CLOUD_PILOT_DAYS.find(p => p.day === dayNum) || null;
    } else if (isDevOps && dayNum > 0) {
      pilotDay = DEVOPS_PILOT_DAYS.find(p => p.day === dayNum) || null;
    } else if (isComputerFundamentals && dayNum > 0) {
      pilotDay = COMPUTER_FUNDAMENTALS_PILOT_DAYS.find(p => p.day === dayNum) || null;
    } else if (isAiTransformation && dayNum > 0) {
      pilotDay = BCOM_AI_TRANSFORMATION_PILOT_DAYS.find(p => p.day === dayNum) || null;
    } else if (isOperations && dayNum > 0) {
      pilotDay = BCOM_OPERATIONS_PILOT_DAYS.find(p => p.day === dayNum) || null;
    } else if (isSalesCrm && dayNum > 0) {
      pilotDay = BCOM_SALES_CRM_PILOT_DAYS.find(p => p.day === dayNum) || null;
    } else if (isEntrepreneurship && dayNum > 0) {
      pilotDay = BCOM_ENTREPRENEURSHIP_PILOT_DAYS.find(p => p.day === dayNum) || null;
    } else if (isEcommerce && dayNum > 0) {
      pilotDay = BCOM_ECOMMERCE_PILOT_DAYS.find(p => p.day === dayNum) || null;
    } else if (isDigitalMarketing && dayNum > 0) {
      pilotDay = BCOM_DIGITAL_MARKETING_PILOT_DAYS.find(p => p.day === dayNum) || null;
    } else if (isMarketing && dayNum > 0) {
      pilotDay = BCOM_MARKETING_PILOT_DAYS.find(p => p.day === dayNum) || null;
    } else if (isAnalytics && dayNum > 0) {
      pilotDay = BCOM_ANALYTICS_PILOT_DAYS.find(p => p.day === dayNum) || null;
    } else if (isFinance && dayNum > 0) {
      pilotDay = BCOM_FINANCE_PILOT_DAYS.find(p => p.day === dayNum) || null;
    } else if (isAccounting && dayNum > 0) {
      pilotDay = BCOM_ACCOUNTING_PILOT_DAYS.find(p => p.day === dayNum) || null;
    } else if (isQuant && dayNum > 0) {
      pilotDay = QUANT_PILOT_DAYS.find(p => p.day === dayNum) || null;
    } else if (isIotSecurity && dayNum > 0) {
      pilotDay = (IOT_SECURITY_PILOT_DAYS as any)[dayNum] || Object.values(IOT_SECURITY_PILOT_DAYS).find(p => p.day === dayNum) || null;
    } else if (isIotEdge && dayNum > 0) {
      pilotDay = (IOT_EDGE_AI_PILOT_DAYS as any)[dayNum] || Object.values(IOT_EDGE_AI_PILOT_DAYS).find(p => p.day === dayNum) || null;
    } else if (isAI && dayNum > 0) {
      pilotDay = AI_PILOT_DAYS.find(p => p.day === dayNum) || null;
    } else if (isDistributed && dayNum > 0) {
      pilotDay = DISTRIBUTED_PILOT_DAYS.find(p => p.day === dayNum) || null;
    } else if (isIotNet && dayNum > 0) {
      pilotDay = IOT_NETWORK_PILOT_DAYS.find(p => p.day === dayNum) || null;
    } else if (isIoT && dayNum > 0) {
      pilotDay = IOT_EMBEDDED_PILOT_DAYS.find(p => p.day === dayNum) || null;
    } else if (isGraphics3D && dayNum > 0) {
      pilotDay = GRAPHICS_3D_PILOT_DAYS.find(p => p.day === dayNum) || null;
    } else if (isBlockchain && dayNum > 0) {
      pilotDay = BLOCKCHAIN_PILOT_DAYS.find(p => p.day === dayNum) || null;
    }

    if (pilotDay) {
      const pilotSlides = pilotDay.blocks.map((block: any) => {
        const analogy = block.media.find((m: any) => m.type === 'analogy') as any;
        const runnable = block.media.find((m: any) => m.type === 'runnable_code') as any;
        const syntax = block.media.find((m: any) => m.type === 'syntax_anatomy') as any;
        const diagram = block.media.find((m: any) => m.type === 'diagram') as any;

        const bullets: string[] = [];
        if (analogy) {
          bullets.push(`💡 Everyday Metaphor: ${analogy.metaphor} — ${analogy.simpleExplanation}`);
        }
        if (syntax) {
          bullets.push(`⚙️ Syntax Breakdown: ${Object.values(syntax.lineNotes || {}).join(' ')}`);
        }
        if (diagram) {
          if (diagram.data?.type === 'broken_fixed_diff') {
            bullets.push(`⚠️ Error & Fix: ${diagram.data.errorReason} Fix: ${diagram.data.fixExplanation}`);
          } else if (diagram.data?.type === 'memory_box') {
            bullets.push(`📦 Memory Allocation: Storing values in labeled data slots.`);
          } else if (diagram.data?.type === 'flowchart') {
            bullets.push(`🔄 Execution Flow: Sequential order from start to finish.`);
          }
        }

        const codeExample = runnable ? runnable.initialCode : (syntax ? syntax.codeSnippet : '');
        const runnerPrefix = isPython ? '🐍 Python 3 Executing' : (isReact ? '⚛️ React Node Sandbox' : (isSQL ? '🗄️ SQLite Engine' : (isDSA ? '🔢 DSA Node Sandbox' : (isFullstack ? '🌐 Fullstack Node/Next Sandbox' : (isCloud ? '☁️ AWS Cloud Simulator' : (isDevOps ? '🚀 DevOps Pipeline Simulator' : (isComputerFundamentals ? '💻 Computer Literacy & OS Fundamentals Sandbox' : (isAiTransformation ? '🤖 AI & Digital Transformation for Business Simulator' : (isOperations ? '⚙️ Operations, Supply Chain & Business Compliance Simulator' : (isSalesCrm ? '🤝 Sales, Customer Success & CRM Simulator' : (isEntrepreneurship ? '💡 Entrepreneurship & Business Management Simulator' : (isEcommerce ? '🛒 E-Commerce & Digital Business Simulator' : (isDigitalMarketing ? '🚀 Digital Marketing & Growth Strategy Simulator' : (isMarketing ? '🎯 Marketing & Brand Management Simulator' : (isAnalytics ? '📊 Business Analytics & Decision Intelligence Simulator' : (isFinance ? '📈 Business Finance & Investment Simulator' : (isAccounting ? '📊 Digital Accounting & ERP Simulator' : (isQuant ? '📈 Quantitative Trading & Low-Latency Simulator' : (isIotSecurity ? '🔒 IoT Security & Root of Trust Simulator' : (isIotEdge ? '🧠 Edge AI & TinyML TFLM Simulator' : (isAI ? '🤖 AI & LLM Engine Simulator' : (isDistributed ? '🌐 Distributed Systems Simulator' : (isIotNet ? '📶 IoT Radio Protocol Simulator' : (isIoT ? '🔌 Embedded MCU Simulator' : (isGraphics3D ? '🔮 WebGL2 3D Shader Sandbox' : (isBlockchain ? '🪙 EVM Web3 & Solidity Simulator' : '⚙️ Javac compiling'))))))))))))))))))))))))));
        const mockOutput = runnable ? `${runnerPrefix} ${runnable.filename}...\n>>> ${runnable.expectedOutput.replace(/\n/g, '\n>>> ')}\n[SUCCESS] Code executed with 0 errors.` : '';

        const diag = block.diagnosticCheck;
        const options = diag.options || (diag.expectedStringOutput ? [diag.expectedStringOutput, 'Incorrect Option A', 'Incorrect Option B'] : ['Option A', 'Option B']);
        const answerIndex = diag.correctIndex !== undefined ? diag.correctIndex : 0;
        const explanation = (Object.values(diag.diagnosisMap || {})[0] as any)?.recoveryPath?.simplerExplanation || `Demonstrated understanding of ${block.conceptBudget.primaryConcept}.`;

        return {
          title: block.title,
          bulletPoints: bullets,
          codeExample: codeExample,
          mockOutput: mockOutput,
          blockId: block.id,
          conceptBudget: block.conceptBudget,
          prerequisiteThresholds: block.prerequisiteThresholds,
          media: block.media,
          mcq: {
            question: diag.question,
            options: options,
            answerIndex: answerIndex,
            explanation: explanation,
            primaryMisconceptionId: diag.primaryMisconceptionId,
            diagnosisMap: diag.diagnosisMap
          }
        };
      });

      setSlides(pilotSlides);
      setSlidesLoading(false);
      return;
    }

    // Instant static slide generation with rich real-world analogies & code examples
    const rawSyllabus = (syllabus && syllabus.length > 0) ? syllabus : ['Core Foundations & Execution Rules', 'Syntax Breakdown & Memory Boundaries', 'Production Use Case & Best Practices'];
    
    const staticSlides = rawSyllabus.map((rawTopic: string, index: number) => {
      let title = rawTopic;
      let coreDetail = rawTopic;
      if (rawTopic.includes(':')) {
        const parts = rawTopic.split(':');
        title = parts[0].trim();
        coreDetail = parts.slice(1).join(':').trim();
      }

      let codeSnippet = '';
      let mockOutput = '';
      let bulletPoints: string[] = [];

      if (isJava) {
        const tLow = (title + " " + rawTopic + " " + (questData?.title || '')).toLowerCase();
        
        // ── Day 1: Hello World, Class Container & Semicolons ──────────────────
        if (tLow.includes('what') || tLow.includes('programming') || tLow.includes('hello')) {
          codeSnippet = `// Step 1: In Java, all code lives inside a class\npublic class HelloWorld {\n    // Step 2: The computer always starts running code at the 'main' method\n    public static void main(String[] args) {\n        // Step 3: Print text to the screen (always end with a semicolon!)\n        System.out.println("Hello, World!");\n        System.out.println("Java runs line by line from top to bottom.");\n    }\n}`;
          mockOutput = `⚙️ Javac compiling Solution.java...\n>>> Hello, World!\n>>> Java runs line by line from top to bottom.\n[SUCCESS] Program finished with 0 errors.`;
          bulletPoints = [
            `💡 What is this?: Programming is giving the computer a simple recipe to follow. Java takes your written text (.java file), turns it into machine instructions, and runs it on any device in the world.`,
            `⚙️ How it runs in memory: When you click Run, the computer reads your file starting at 'main' and executes each statement one line at a time from top to bottom.`,
            `⚠️ Beginner Mistake to Avoid: Forgetting to put your code inside a class. In Java, raw code floating outside a class is not allowed and will refuse to compile.`
          ];
        } else if (tLow.includes('anatomy') || tLow.includes('entry point') || tLow.includes('main')) {
          codeSnippet = `public class MyFirstProgram {\n    // 'public static void main' is the required door where Java starts\n    public static void main(String[] args) {\n        System.out.println("Welcome to Java!");\n        System.out.println("Every Java program starts here.");\n    }\n}`;
          mockOutput = `⚙️ Javac compiling Solution.java...\n>>> Welcome to Java!\n>>> Every Java program starts here.\n[SUCCESS] Main entry point verified.`;
          bulletPoints = [
            `💡 What is this?: Think of 'public class' as a labeled folder holding your project, and 'public static void main' as the front door. Whenever Java runs your program, it always looks for this exact front door.`,
            `⚙️ How it runs in memory: Java opens your class, finds the 'main' method, and creates a clean working space in memory to hold your variables.`,
            `⚠️ Beginner Mistake to Avoid: Changing the name of 'main' (e.g. typing 'Main' with capital M). Java will say 'Method main not found' and won't know where to start.`
          ];
        } else if (tLow.includes('semicolon') || tLow.includes('casing') || tLow.includes('syntax')) {
          codeSnippet = `public class SyntaxRules {\n    public static void main(String[] args) {\n        // Rule 1: Every statement MUST end with a semicolon ';'\n        int score = 100;\n        \n        // Rule 2: Capital 'S' in System (Java cares about lowercase vs uppercase!)\n        System.out.println("Your score is: " + score);\n    }\n}`;
          mockOutput = `⚙️ Javac compiling Solution.java...\n>>> Your score is: 100\n[SUCCESS] Semicolons and casing verified.`;
          bulletPoints = [
            `💡 What is this?: In English, you end every sentence with a period (.). In Java, you MUST end every complete command with a semicolon (;). Also, Java is strictly case-sensitive: 'System' is correct, but 'system' will throw an error.`,
            `⚙️ How it runs in memory: The Java compiler reads each word until it hits a semicolon. That semicolon tells the computer: 'This command is finished, now move to the next one.'`,
            `⚠️ Beginner Mistake to Avoid: Leaving out the semicolon at the end of a line, or writing 'system.out.println' with a small 's'. Always check your semicolons and capital letters!`
          ];

        // ── Day 2: Reading User Input (Scanner) ────────────────────────────────
        } else if (tLow.includes('scanner') || tLow.includes('buffer') || tLow.includes('input') || tLow.includes('user input') || tLow.includes('reading')) {
          if (tLow.includes('trap') || tLow.includes('buffer') || tLow.includes('newline') || tLow.includes('enter')) {
            codeSnippet = `import java.util.Scanner;\n\npublic class FixBufferTrap {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        \n        System.out.print("Enter your age: ");\n        int age = sc.nextInt();\n        \n        // ⚠️ THE FIX: Clear the leftover [Enter] key from the buffer!\n        sc.nextLine();\n        \n        System.out.print("Enter your full name: ");\n        String name = sc.nextLine(); // Now this won't be skipped!\n        \n        System.out.println("Welcome, " + name + "! Age: " + age);\n        sc.close();\n    }\n}`;
            mockOutput = `⚙️ Javac compiling Solution.java...\n>>> Enter your age: 22\n>>> Enter your full name: Vinay Kumar\n>>> Welcome, Vinay Kumar! Age: 22\n[SUCCESS] Buffer cleared. Name read successfully.`;
            bulletPoints = [
              `💡 What is the Enter-Key Trap?: When you type a number and hit [Enter], Java's 'nextInt()' only grabs the number. The invisible [Enter] key stays sitting in the waiting area (input buffer).`,
              `⚙️ Why does this cause a bug?: When your next line calls 'nextLine()', it immediately sees that leftover [Enter] key and thinks: 'Oh, an empty line!' and skips user input completely!`,
              `⚠️ The 1-Line Solution: Always put one empty 'sc.nextLine();' right after reading a number with 'nextInt()' or 'nextDouble()' to clear out the leftover Enter key.`
            ];
          } else if (tLow.includes('method') || tLow.includes('nextint') || tLow.includes('nextline') || tLow.includes('type-specific')) {
            codeSnippet = `import java.util.Scanner;\n\npublic class ReadTypes {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        \n        // Use nextInt() for whole numbers\n        int count = 5;\n        \n        // Use nextDouble() for decimal numbers\n        double price = 19.99;\n        \n        // Use nextLine() for full sentences of text\n        String item = "Mechanical Keyboard";\n        \n        System.out.println("Item: " + item + " | Qty: " + count + " | Price: $" + price);\n        sc.close();\n    }\n}`;
            mockOutput = `⚙️ Javac compiling Solution.java...\n>>> Item: Mechanical Keyboard | Qty: 5 | Price: $19.99\n[SUCCESS] Type-specific readers verified.`;
            bulletPoints = [
              `💡 What is this?: Java has different reading tools for different kinds of data: 'nextInt()' for whole numbers, 'nextDouble()' for decimal numbers, and 'nextLine()' for text sentences.`,
              `⚙️ How it runs in memory: Java converts the user's typed keystrokes into the exact data type in memory (e.g. converting the characters '1' and '9' into the mathematical number 19).`,
              `⚠️ Beginner Mistake to Avoid: Calling 'nextInt()' when the user types text words. Java will crash with an 'InputMismatchException'. Always use the matching reader method for the data you expect.`
            ];
          } else {
            codeSnippet = `// Step 1: Import the Scanner tool from Java's standard library\nimport java.util.Scanner;\n\npublic class SimpleInput {\n    public static void main(String[] args) {\n        // Step 2: Create a Scanner reader connected to your keyboard (System.in)\n        Scanner sc = new Scanner(System.in);\n        \n        System.out.print("What is your name? ");\n        // Step 3: Read a line of text typed by the user\n        String name = "Alex";\n        \n        System.out.println("Hello, " + name + "! Nice to meet you.");\n        sc.close();\n    }\n}`;
            mockOutput = `⚙️ Javac compiling Solution.java...\n>>> What is your name? Alex\n>>> Hello, Alex! Nice to meet you.\n[SUCCESS] Scanner lifecycle executed cleanly.`;
            bulletPoints = [
              `💡 What is this?: To make your program interactive, Java uses the Scanner tool. It pauses your code and waits for the user to type something on their keyboard and hit Enter.`,
              `⚙️ The 3-Step Scanner Pattern: 1) Write 'import java.util.Scanner;' at top. 2) Create your reader: 'Scanner sc = new Scanner(System.in);'. 3) Read input with 'sc.nextLine()'.`,
              `⚠️ Beginner Mistake to Avoid: Forgetting the import at line 1. Without 'import java.util.Scanner;', Java will say 'Cannot find symbol: Scanner'.`
            ];
          }

        // ── Day 3: Variables, Data Types & Casting ──────────────────────────────
        } else if (tLow.includes('variable') || tLow.includes('data type') || tLow.includes('primitive') || tLow.includes('casting')) {
          codeSnippet = `public class VariablesDemo {\n    public static void main(String[] args) {\n        // 1. int for whole numbers\n        int age = 20;\n        \n        // 2. double for decimals\n        double price = 9.99;\n        \n        // 3. boolean for true / false\n        boolean isMember = true;\n        \n        // 4. String for text words\n        String name = "Vinay";\n        \n        System.out.println("Name: " + name + " | Age: " + age + " | Price: $" + price);\n    }\n}`;
          mockOutput = `⚙️ Javac compiling Solution.java...\n>>> Name: Vinay | Age: 20 | Price: $9.99\n[SUCCESS] Variables stored in memory.`;
          bulletPoints = [
            `💡 What is this?: A variable is a labeled box in your computer's memory that stores information. In Java, you must declare what kind of box it is: 'int' for numbers, 'double' for decimals, 'boolean' for true/false, and 'String' for text.`,
            `⚙️ How it runs in memory: When you write 'int age = 20;', Java reserves a 32-bit slot in memory labeled 'age' and stores the number 20 inside it.`,
            `⚠️ Beginner Mistake to Avoid: Putting quotes around numbers when creating an int (e.g. 'int x = "20";'). Quotes are ONLY for text Strings. For numbers, write them directly like 'int x = 20;'.`
          ];

        // ── Day 4: Arithmetic & Math ───────────────────────────────────────────
        } else if (tLow.includes('operator') || tLow.includes('arithmetic') || tLow.includes('modulo') || tLow.includes('division')) {
          codeSnippet = `public class MathDemo {\n    public static void main(String[] args) {\n        int apples = 10;\n        int people = 3;\n        \n        // Integer division gives whole shares: 10 / 3 = 3\n        int shares = apples / people;\n        \n        // Modulo (%) gives what's left over: 10 % 3 = 1\n        int leftover = apples % people;\n        \n        System.out.println("Each person gets: " + shares + " apples.");\n        System.out.println("Leftover apples: " + leftover);\n    }\n}`;
          mockOutput = `⚙️ Javac compiling Solution.java...\n>>> Each person gets: 3 apples.\n>>> Leftover apples: 1\n[SUCCESS] Math and modulo calculations verified.`;
          bulletPoints = [
            `💡 What is this?: You can do standard math with +, -, *, /, and %. The percent sign (%) is called 'modulo' — it gives you the leftover remainder after dividing two numbers.`,
            `⚙️ The Integer Division Rule: In Java, dividing two whole numbers ('10 / 4') gives 2, NOT 2.5! Java drops the decimal. If you want decimals, write '10.0 / 4' to get 2.5.`,
            `⚠️ Beginner Mistake to Avoid: Expecting '5 / 2' to equal 2.5. Because both 5 and 2 are integers, Java truncates the answer to 2. Always use a decimal like '5.0 / 2' when you want fractional results.`
          ];

        // ── Day 5 & 6: Conditionals & Switch ───────────────────────────────────
        } else if (tLow.includes('condition') || tLow.includes('if') || tLow.includes('switch') || tLow.includes('branching')) {
          codeSnippet = `public class DecisionMaking {\n    public static void main(String[] args) {\n        int age = 18;\n        \n        if (age >= 18) {\n            System.out.println("Eligible to vote!");\n        } else {\n            System.out.println("Too young to vote.");\n        }\n    }\n}`;
          mockOutput = `⚙️ Javac compiling Solution.java...\n>>> Eligible to vote!\n[SUCCESS] Condition checked and true branch taken.`;
          bulletPoints = [
            `💡 What is this?: An 'if-else' statement lets your program make decisions based on true or false conditions (like a traffic light: if green, go; else, stop).`,
            `⚙️ How it runs in memory: Java checks the condition inside the parentheses '(age >= 18)'. If it is true, it runs the code inside the curly braces; if false, it jumps straight to the 'else' block.`,
            `⚠️ Beginner Mistake to Avoid: Putting a semicolon right after the if header (e.g. 'if (x > 5); { ... }'). That semicolon cancels the condition and makes the block run unconditionally every time!`
          ];

        // ── Day 7 & 8: Loops ───────────────────────────────────────────────────
        } else if (tLow.includes('loop') || tLow.includes('while') || tLow.includes('for') || tLow.includes('iteration')) {
          codeSnippet = `public class CountLoop {\n    public static void main(String[] args) {\n        // Count from 1 to 3\n        for (int i = 1; i <= 3; i++) {\n            System.out.println("Step #" + i);\n        }\n        System.out.println("Loop finished!");\n    }\n}`;
          mockOutput = `⚙️ Javac compiling Solution.java...\n>>> Step #1\n>>> Step #2\n>>> Step #3\n>>> Loop finished!\n[SUCCESS] Iteration completed in order.`;
          bulletPoints = [
            `💡 What is this?: A loop repeats a block of code over and over without having to copy-paste the same code 100 times.`,
            `⚙️ How it runs in memory: 'for (int i=1; i<=3; i++)' creates a counter 'i', runs the code, increases 'i' by 1, and stops when 'i' reaches 4.`,
            `⚠️ Beginner Mistake to Avoid: Creating an infinite loop (a loop that never stops). Always make sure your counter variable is increasing towards the stopping condition (e.g. 'i++').`
          ];

        // ── Day 9, 10, 11: Methods & Functions ────────────────────────────────
        } else if (tLow.includes('method') || tLow.includes('function') || tLow.includes('parameter') || tLow.includes('overload')) {
          codeSnippet = `public class MethodsDemo {\n    public static void main(String[] args) {\n        // Call our reusable method and store its result\n        int sum = addNumbers(5, 10);\n        System.out.println("Total: " + sum);\n    }\n    \n    // Our custom method: takes two numbers and returns their sum\n    public static int addNumbers(int a, int b) {\n        return a + b;\n    }\n}`;
          mockOutput = `⚙️ Javac compiling Solution.java...\n>>> Total: 15\n[SUCCESS] Method returned result cleanly.`;
          bulletPoints = [
            `💡 What is this?: A method is a mini-recipe or reusable function. You give it inputs (parameters), it does the math, and sends back the result with 'return'.`,
            `⚙️ How it runs in memory: When you call a method, Java pauses 'main', runs your method in a separate temporary memory frame, grabs the return answer, and jumps right back to 'main'.`,
            `⚠️ Beginner Mistake to Avoid: Forgetting to return a value when your method header specifies a type (like 'int' or 'double'). If your method says 'int', you MUST write 'return someNumber;'.`
          ];

        // ── Day 12, 13, 14, 15: Arrays & Lists ────────────────────────────────
        } else if (tLow.includes('array') || tLow.includes('matrix') || tLow.includes('search')) {
          codeSnippet = `public class ArraysDemo {\n    public static void main(String[] args) {\n        // Store multiple numbers in a single list\n        int[] scores = {85, 92, 78, 96};\n        \n        // Arrays start at index 0!\n        System.out.println("First score: " + scores[0]);\n        System.out.println("Total scores in list: " + scores.length);\n    }\n}`;
          mockOutput = `⚙️ Javac compiling Solution.java...\n>>> First score: 85\n>>> Total scores in list: 4\n[SUCCESS] Array indexed at position 0.`;
          bulletPoints = [
            `💡 What is this?: Instead of creating 50 separate variables for 50 student test scores, an array lets you store all 50 scores inside one single named list.`,
            `⚙️ The Zero-Index Rule: In programming, counting always starts at 0! The first item is at 'scores[0]', the second is at 'scores[1]', and so on.`,
            `⚠️ Beginner Mistake to Avoid: Trying to access 'scores[4]' in a 4-item array. Since indices are 0, 1, 2, 3, accessing 4 will crash with an 'ArrayIndexOutOfBoundsException'.`
          ];

        // ── Day 16, 17, 18: Classes, Objects & OOP ────────────────────────────
        } else if (tLow.includes('class') || tLow.includes('object') || tLow.includes('constructor') || tLow.includes('encapsulation')) {
          codeSnippet = `public class Student {\n    String name;\n    int age;\n    \n    // Constructor: sets up new student objects\n    public Student(String name, int age) {\n        this.name = name;\n        this.age = age;\n    }\n    \n    public static void main(String[] args) {\n        Student s1 = new Student("Vinay", 20);\n        System.out.println("Created student: " + s1.name + " (" + s1.age + " y/o)");\n    }\n}`;
          mockOutput = `⚙️ Javac compiling Solution.java...\n>>> Created student: Vinay (20 y/o)\n[SUCCESS] Object instantiated on heap memory.`;
          bulletPoints = [
            `💡 What is this?: A Class is like an architectural blueprint (e.g. the blueprint for a car). An Object is the actual car built from that blueprint.`,
            `⚙️ The 'new' keyword: Writing 'new Student("Vinay", 20)' tells Java to build a brand new student object in memory with its own name and age.`,
            `⚠️ Beginner Mistake to Avoid: Trying to use object variables without creating the object using 'new'. Doing so causes the infamous 'NullPointerException'.`
          ];

        // ── Day 19 to 30: Advanced Concepts Fallback ───────────────────────────
        } else {
          codeSnippet = `public class LessonDemo {\n    public static void main(String[] args) {\n        System.out.println("Topic: ${title}");\n        System.out.println("Mastering this concept step by step.");\n    }\n}`;
          mockOutput = `⚙️ Javac compiling Solution.java...\n>>> Topic: ${title}\n>>> Mastering this concept step by step.\n[SUCCESS] Code executed with 0 errors.`;
          bulletPoints = [
            `💡 What is this?: ${coreDetail}. In software development, this concept provides the structure to write clean, working programs.`,
            `⚙️ How it runs in memory: Java allocates memory space, processes your instructions in order, and cleans up when the code finishes.`,
            `⚠️ Beginner Mistake to Avoid: Always check for typos, match data types accurately, and verify your output matches what you expect.`
          ];
        }
      } else if (isReact) {
        bulletPoints = [
          `💡 What is this?: ${coreDetail}. React components are reusable building blocks that turn your data into interactive user interfaces.`,
          `⚙️ How it runs: When data updates, React automatically refreshes just the parts of the screen that changed, keeping your app fast and smooth.`,
          `⚠️ Beginner Mistake to Avoid: Never change state directly; always use the state setter function to update values.`
        ];
      } else {
        bulletPoints = [
          `💡 What is this?: ${coreDetail}. This gives you the basic building blocks to write clean, reliable programs.`,
          `⚙️ How it runs: The computer reads your instructions step-by-step in memory from top to bottom.`,
          `⚠️ Beginner Mistake to Avoid: Pay close attention to syntax, matching variable names, and clear step order.`
        ];
      }

      return {
        title: title,
        bulletPoints: bulletPoints,
        codeExample: codeSnippet,
        mockOutput: mockOutput,
        mcq: {
          question: `Which statement best describes "${title}"?`,
          options: [
            `It defines essential rules and structure that guide how the computer executes instructions.`,
            `It is optional decorative syntax that has no effect on execution.`,
            `It causes runtime crashes and should not be used in modern programming.`
          ],
          answerIndex: 0,
          explanation: `Mastering ${title} is fundamental to writing clean, working code and avoiding compilation errors.`
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
      setMcqIsCorrect(false);
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

  // Get current dialog script spoken by teacher (Strict 4-Part Sequence: 1. Example -> 2. Concept -> 3. Code -> 4. Checkpoint)
  const getSpeakerText = () => {
    if (currentSlide === 0) {
      let welcomeIntro = `Welcome ${studentName}! I am ${teacher.name}.`;
      if (teacherId === 'karthic') {
        welcomeIntro = `Hey ${studentName}! I am ${teacher.name}! Let's crush this!`;
      } else if (teacherId === 'maya') {
        welcomeIntro = `Attention ${studentName}. I am ${teacher.name}. Let's audit "${questData.title}".`;
      } else if (teacherId === 'divya') {
        welcomeIntro = `Welcome ${studentName}! I am ${teacher.name}. Let's explore "${questData.title}"!`;
      }
      return `${welcomeIntro} Today we will master "${questData.title}". Listen closely to each slide before unlocking your coding evaluation. Let us begin!`;
    }
    if (currentSlide === (slides.length || syllabus.length) + 1) {
      if (examPassed) {
        return `Outstanding work ${studentName}! You passed the evaluation exam for "${questData.title}" with flying colors. Keep up the momentum!`;
      }
      const qText = slides[examQuestionIndex]?.mcq?.question || "Ready for your question?";
      return `${studentName}, welcome to the evaluation checkpoint! Question: ${qText}`;
    }
    const idx = currentSlide - 1;
    if (slides && slides[idx]) {
      const slide = slides[idx];
      let personaIntro = `Slide ${currentSlide}: "${slide.title}".`;
      if (teacherId === 'kashyap') {
        personaIntro = `My dear student ${studentName}, let us explore "${slide.title}".`;
      } else if (teacherId === 'karthic') {
        personaIntro = `Hey ${studentName}! Let's master "${slide.title}"!`;
      } else if (teacherId === 'maya') {
        personaIntro = `Attention ${studentName}. Pay close attention to "${slide.title}".`;
      } else if (teacherId === 'divya') {
        personaIntro = `Welcome ${studentName}! Let's break down "${slide.title}".`;
      }

      // On Slide 1 ONLY: Speak Real-World Story + Core Concept
      if (currentSlide === 1) {
        const desc = questData?.desc || '';
        let story = '';
        if (desc.includes('(Real world:')) {
          const match = desc.match(/\(Real world:\s*([^)]+)\)/i);
          if (match && match[1]) story = match[1].trim();
        } else if (desc.length > 20) {
          story = desc.slice(0, 120);
        }
        const examplePart = story ? `First, think of this real-world example: ${story}.` : `First, imagine a real-world everyday situation.`;
        const coreText = (slide.bulletPoints?.[0] || slide.title).replace(/^💡\s*(The Core Concept|The Core Architecture):\s*/i, '');
        return `${personaIntro} ${examplePart} The core rule: ${coreText}. Look at the code sandbox and see what happens when it runs. ${studentName}, what questions do you have?`;
      }

      // On Slide 2, 3, 4+: Speak Deep Technical Mechanics + Memory/Runtime + Pitfalls (NO repetitive story)
      const cleanBullets = (slide.bulletPoints || []).map((bp: string) =>
        bp.replace(/^[💡⚙️⚠️🎯]\s*([^:]+):\s*/i, '$1: ')
      );
      const technicalExplanation = cleanBullets.length > 0 ? cleanBullets.join(' ') : slide.title;
      const codePart = `In our live code sandbox below, examine how this executes.`;
      const checkpointPart = `${studentName}, what do you think this code outputs? Try it out!`;

      return `${personaIntro} ${technicalExplanation} ${codePart} ${checkpointPart}`;
    }
    if (idx < syllabus.length) {
      const concept = syllabus[idx];
      return `${studentName}, let us explore Section ${currentSlide}: "${concept}". Observe the code sandbox and let me know if you have any questions!`;
    }
    return `Let us explore today's quest together!`;
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

  const isLastSlide = currentSlide === (slides.length || (syllabus?.length || 0)) + 1;

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
          flex-direction: column;
          justify-content: center;
          align-items: center;
          position: relative;
          min-height: 480px;
          height: 100%;
          width: 100%;
          overflow: hidden;
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
        onClick={() => window.location.assign('/quests/')}
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

                        {/* 🏢 1ST: REAL-WORLD ANALOGY & PRODUCTION CASE STUDY CARD (Introductory Slide 1 Only) */}
                        {currentSlide === 1 && (() => {
                          const desc = questData?.desc || '';
                          let realWorldStory = '';
                          if (desc.includes('(Real world:')) {
                            const match = desc.match(/\(Real world:\s*([^)]+)\)/i);
                            if (match && match[1]) {
                              realWorldStory = match[1].trim();
                            }
                          } else if (desc.length > 50) {
                            realWorldStory = desc;
                          }

                          const currentTopicKey = (slide.title || '').toLowerCase();
                          let matchedAnalogy = CONCEPT_ANALOGIES_REGISTRY['python-functions'];
                          if (currentTopicKey.includes('loop') || currentTopicKey.includes('iterat')) matchedAnalogy = CONCEPT_ANALOGIES_REGISTRY['python-loops'];
                          else if (currentTopicKey.includes('dict') || currentTopicKey.includes('hash') || currentTopicKey.includes('map')) matchedAnalogy = CONCEPT_ANALOGIES_REGISTRY['python-dicts'];
                          else if (currentTopicKey.includes('class') || currentTopicKey.includes('oop') || currentTopicKey.includes('object')) matchedAnalogy = CONCEPT_ANALOGIES_REGISTRY['python-classes'];
                          else if (currentTopicKey.includes('react') || currentTopicKey.includes('component')) matchedAnalogy = CONCEPT_ANALOGIES_REGISTRY['react-components'];
                          else if (currentTopicKey.includes('hook') || currentTopicKey.includes('state')) matchedAnalogy = CONCEPT_ANALOGIES_REGISTRY['react-hooks'];

                          return (
                            <div style={{
                              margin: '2px 0 6px 0',
                              padding: '12px 16px',
                              borderRadius: 14,
                              background: 'linear-gradient(135deg, rgba(59,130,246,0.12), rgba(16,185,129,0.08))',
                              border: '1px solid rgba(59,130,246,0.3)',
                              boxShadow: '0 4px 14px rgba(0,0,0,0.15)'
                            }}>
                              <div style={{ fontSize: 10.5, fontWeight: 900, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>
                                🏢 1. Real-World Industry Story & Production Context
                              </div>
                              <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--t1)', lineHeight: 1.45, marginBottom: realWorldStory ? 0 : 8 }}>
                                {realWorldStory || matchedAnalogy.analogy}
                              </div>
                              {!realWorldStory && (
                                <div style={{ fontSize: 11, fontWeight: 800, color: '#34d399' }}>
                                  {matchedAnalogy.realWorldUseCase}
                                </div>
                              )}
                            </div>
                          );
                        })()}

                        {/* 💡 2ND: THE CORE TECHNICAL CONCEPT & MECHANICS (SECOND) */}
                        {bulletPoints.length > 0 && (
                          <div style={{
                            padding: '12px 16px',
                            borderRadius: 14,
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid var(--border)'
                          }}>
                            <div style={{ fontSize: 10.5, fontWeight: 900, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>
                              💡 2. Core Technical Rules & Execution Model
                            </div>
                            <ul style={{ listStyleType: 'none', paddingLeft: 0, display: 'flex', flexDirection: 'column', gap: 8, margin: 0 }}>
                              {bulletPoints.map((bp: string, i: number) => (
                                <li key={i} style={{ fontSize: 11.5, color: 'var(--t2)', lineHeight: 1.45 }}>{bp}</li>
                              ))}
                            </ul>
                          </div>
                        )}

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
                              <span style={{ fontSize: 10, color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>
                                {questId.toLowerCase().includes('react') ? 'Component.tsx' : questId.toLowerCase().includes('sql') ? 'query.sql' : questId.toLowerCase().includes('python') ? 'main.py' : 'Solution.java'}
                              </span>
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
                onClick={finishLessonAndReturn}
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
              onClick={finishLessonAndReturn}
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
