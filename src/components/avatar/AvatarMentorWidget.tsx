import { useState, useEffect, useRef, useCallback } from 'react';
import { usePersonalAvatarMemory }    from './hooks/usePersonalAvatarMemory';
import { useFacialEmotionDetection }  from './hooks/useFacialEmotionDetection';
import { matchBestAlternative, matchNavigationIntent, getGrammarVocabulary } from './hooks/useVoiceNavigation';
import { parseWakeWord } from '@/lib/avatar/wakeWordParser';
import { isNextTaskIntent, isValidSnapshotTimestamp, getAuthoritativeNextTask } from '@/lib/avatar/deterministicAdvisor';
// Lazy-loaded on demand: import('@/lib/data/coursesData')
import { analyzeVoiceFrames, analyzeVoiceSamples, verifyVoiceSignature, calculateSpectralFeatures, extractMelFilterbank, AcousticFrame, VoicePrint } from './hooks/useVoiceBiometrics';
import { saveVoicePrintToSupabase, getVoicePrintFromSupabase } from '@/lib/supabaseService';
import * as THREE from 'three';
import { speakWithAvatar, stopSpeaking } from '@/lib/tts';
import { sanitizeLLMOutput } from '@/lib/sanitizeLLM';
import { toast } from '@/lib/store/useAppStore';
import { VRoidAvatarEngine, AnimState } from './VRoidAvatarEngine';


interface CareerProfile {
  ats_score?: number; trust_score?: number; career_dna_score?: number;
  mission_streak?: number; weak_areas?: string[]; [key: string]: unknown;
}
interface MLRec { content_type: string; type: string; label: string; icon: string; relevance: number; }
interface Props {
  userId?: string;
  careerProfile?: CareerProfile;
  teacherId?: string;
  minimized?: boolean;
  setMinimized?: (m: boolean) => void;
  showSpeechBubble?: boolean;
  setShowSpeechBubble?: (s: boolean) => void;
  onboardingStep?: number;
  setOnboardingStep?: (s: number) => void;
  activeQuest?: any;
  onlyAvatar?: boolean;
  speaking?: boolean;
  speechText?: string;
  onTabShift?: (path: string) => void;
  onEnlarge?: (enlarged: boolean) => void;
  isEnlarged?: boolean;
  gazeTracking?: boolean;
}




// Autocorrelation Pitch Detector (YIN-based thresholding approach)
function detectPitch(buffer: Float32Array, sampleRate: number): number {
  const SIZE = buffer.length;
  let rms = 0;

  for (let i = 0; i < SIZE; i++) {
    const val = buffer[i];
    rms += val * val;
  }
  rms = Math.sqrt(rms / SIZE);
  if (rms < 0.008) return -1; // Silent frame

  // Trim silent ends of the frame
  let r1 = 0;
  let r2 = SIZE - 1;
  const thres = 0.002;
  for (let i = 0; i < SIZE / 2; i++) {
    if (Math.abs(buffer[i]) > thres) { r1 = i; break; }
  }
  for (let i = SIZE - 1; i >= SIZE / 2; i--) {
    if (Math.abs(buffer[i]) > thres) { r2 = i; break; }
  }

  const buf = buffer.subarray(r1, r2);
  const len = buf.length;
  if (len < 256) return -1; // Not enough samples

  // Autocorrelation calculation
  const c = new Float32Array(len);
  for (let i = 0; i < len; i++) {
    for (let j = 0; j < len - i; j++) {
      c[i] += buf[j] * buf[j + i];
    }
  }

  // Find peak
  let d = 0;
  while (d < len - 1 && c[d] > c[d + 1]) d++;
  
  let maxval = -1;
  let maxpos = -1;
  for (let i = d; i < len; i++) {
    if (c[i] > maxval) {
      maxval = c[i];
      maxpos = i;
    }
  }

  if (maxpos <= 0) return -1;

  const T0 = maxpos;
  const pitch = sampleRate / T0;
  
  if (pitch >= 75 && pitch <= 350) {
    return pitch;
  }
  return -1;
}

const TEACHER_CONFIG: Record<string, { name: string; color: string; emoji: string; domain?: string }> = {
  priya:   { name: 'Ms. Priya',          color: '#4f46e5', emoji: '👩‍💼', domain: 'Career & Professional Growth' },
  anish:   { name: 'Mr. Anish',          color: '#0284c7', emoji: '👨‍💻', domain: 'Applied Systems & Strategy' },
  aisha:   { name: 'Ms. Aisha',          color: 'var(--purple)', emoji: '👩‍🏫', domain: 'Analytics & Strategic Reasoning' },
  vikram:  { name: 'Mr. Vikram',         color: 'var(--success-deep)', emoji: '👨‍⚖️', domain: 'Finance, Commerce & Corporate Ethics' },
  kashyap: { name: 'Kashyap Sir',        color: 'var(--warning)', emoji: '👨‍🏫', domain: 'Logical & Systems Foundations' },
  karthic: { name: 'Karthic Sir',        color: '#e11d48', emoji: '⚔️', domain: 'Competitive Arena, Speedrun & 1v1 Duels' },
  maya:    { name: 'Ms. Maya',           color: '#ec4899', emoji: '🎨', domain: 'Design Systems & Quality Assurance' },
  divya:   { name: 'Ms. Divya',          color: 'var(--accent-cyan)', emoji: '☁️', domain: 'Cloud Architecture & Operations' },
  rohan:   { name: 'Mr. Rohan',          color: '#0891b2', emoji: '🛡️', domain: 'Security & Enterprise Architecture' },
  shalini: { name: 'Ms. Shalini',        color: 'var(--reward)', emoji: '🗣️', domain: 'Soft Skills, Articulation & Communication' },
  default: { name: 'Mentor',             color: 'var(--brand)', emoji: '🎓', domain: 'Multidisciplinary Career Mentor' },
};

export default function AvatarMentorWidget({
  userId = 'guest',
  careerProfile,
  teacherId = 'priya',
  minimized,
  setMinimized,
  showSpeechBubble,
  setShowSpeechBubble,
  onboardingStep,
  setOnboardingStep,
  activeQuest,
  onlyAvatar = false,
  speaking: externalSpeaking,
  speechText,
  onTabShift,
  onEnlarge,
  isEnlarged = false,
  gazeTracking = true,
}: Props) {
  const [input,          setInput]          = useState('');
  const [messages,       setMessages]       = useState<Array<{ role: string; content: string }>>([]);
  const [loading,        setLoading]        = useState(false);
  const [speaking,       setSpeaking]       = useState(false);
  const [localMinimized, setLocalMinimized] = useState(true);
  const [mlRecs,         setMlRecs]         = useState<MLRec[]>([]);
  const [voiceFreq,      setVoiceFreq]      = useState<number | null>(null);
  const [voicePrint,     setVoicePrint]     = useState<VoicePrint | null>(null);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [isConversing,   setIsConversing]   = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef  = useRef<VRoidAvatarEngine | null>(null);
  const [aiState, setAiState] = useState<AnimState>('idle');

  const pitchHistoryRef = useRef<number[]>([]);
  const acousticFramesRef = useRef<AcousticFrame[]>([]);
  const voiceFreqRef = useRef<number | null>(null);
  const voicePrintRef = useRef<VoicePrint | null>(null);
  const micDeniedRef = useRef<boolean>(false);
  const voiceRegStreamRef = useRef<MediaStream | null>(null);
  const voiceRegAudioCtxRef = useRef<AudioContext | null>(null);
  const voiceRegIntervalRef = useRef<any>(null);
  const voiceRegTimeoutRef = useRef<any>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);
  // Voice input deduplication & debounce guards
  const lastSentMsgRef = useRef<string>('');
  const lastSentTimeRef = useRef<number>(0);
  const speechDebounceTimerRef = useRef<any>(null);

  const [speechCooldown, setSpeechCooldown] = useState(false);
  const speechCooldownTimerRef = useRef<any>(null);

  useEffect(() => {
    voiceFreqRef.current = voiceFreq;
  }, [voiceFreq]);

  useEffect(() => {
    voicePrintRef.current = voicePrint;
  }, [voicePrint]);

  // Post-speech 400ms acoustic echo cooldown to prevent mic feedback loop
  useEffect(() => {
    if (speaking) {
      setSpeechCooldown(true);
      if (speechCooldownTimerRef.current) clearTimeout(speechCooldownTimerRef.current);
    } else {
      speechCooldownTimerRef.current = setTimeout(() => {
        setSpeechCooldown(false);
      }, 400);
    }
    return () => {
      if (speechCooldownTimerRef.current) clearTimeout(speechCooldownTimerRef.current);
    };
  }, [speaking]);

  // Sync voice print from Supabase & localStorage on load
  useEffect(() => {
    if (typeof window !== 'undefined' && userId) {
      // 1. Read local storage cache for instant startup
      const savedLocal = localStorage.getItem(`pinit_${userId}_voice_print_data`);
      if (savedLocal) {
        try {
          const parsed = JSON.parse(savedLocal);
          setVoicePrint(parsed);
          setVoiceFreq(parsed.avgPitch);
        } catch {}
      } else {
        const savedFreq = localStorage.getItem(`pinit_${userId}_voice_print_freq`);
        if (savedFreq) setVoiceFreq(parseFloat(savedFreq));
      }

      // 2. Fetch latest registered voice print from Supabase across all portals
      getVoicePrintFromSupabase(userId).then(sbPrint => {
        if (sbPrint) {
          console.log('[VoiceBiometrics] Loaded voice print from Supabase for user:', userId, sbPrint);
          setVoicePrint(sbPrint);
          const pitchVal = typeof sbPrint === 'number' ? sbPrint : sbPrint.avgPitch;
          setVoiceFreq(pitchVal);
          localStorage.setItem(`pinit_${userId}_voice_print_data`, JSON.stringify(sbPrint));
          localStorage.setItem(`pinit_${userId}_voice_print_freq`, pitchVal.toString());
        }
      }).catch(err => {
        console.warn('[VoiceBiometrics] Could not sync voice print from Supabase:', err);
      });
    }
  }, [userId]);

  // Background audio tracking disabled on mount to ensure instant 0ms widget opening
  useEffect(() => {
    // Only initialized on demand when voice recording is triggered
  }, []);

  const startVoiceRegistration = async () => {
    if (typeof window === 'undefined') return;
    setIsRecordingVoice(true);
    toast.info("Analyzing Multi-Feature Voice Signature 🎙️", "Please speak clearly into your mic for 3.5 seconds...");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      voiceRegStreamRef.current = stream;
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      voiceRegAudioCtxRef.current = audioCtx;
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);

      const bufferLength = analyser.fftSize;
      const dataArray = new Float32Array(bufferLength);
      const freqData = new Float32Array(analyser.frequencyBinCount);
      const frames: AcousticFrame[] = [];

      const interval = setInterval(() => {
        analyser.getFloatTimeDomainData(dataArray);
        analyser.getFloatFrequencyData(freqData);
        const pitch = detectPitch(dataArray, audioCtx.sampleRate);
        const { centroid, rolloff } = calculateSpectralFeatures(freqData, audioCtx.sampleRate);
        const mfccVector = extractMelFilterbank(freqData, audioCtx.sampleRate);

        if (pitch > 0) {
          frames.push({
            pitch,
            spectralCentroid: centroid,
            spectralRolloff: rolloff,
            mfccVector
          });
        }
      }, 70);
      voiceRegIntervalRef.current = interval;

      const timeout = setTimeout(async () => {
        clearInterval(interval);
        voiceRegIntervalRef.current = null;
        stream.getTracks().forEach(t => t.stop());
        voiceRegStreamRef.current = null;
        try { audioCtx.close(); } catch {}
        voiceRegAudioCtxRef.current = null;
        voiceRegTimeoutRef.current = null;
        setIsRecordingVoice(false);

        const analyzedPrint = analyzeVoiceFrames(frames);
        if (analyzedPrint) {
          setVoicePrint(analyzedPrint);
          setVoiceFreq(analyzedPrint.avgPitch);
          localStorage.setItem(`pinit_${userId}_voice_print_data`, JSON.stringify(analyzedPrint));
          localStorage.setItem(`pinit_${userId}_voice_print_freq`, analyzedPrint.avgPitch.toString());

          // Persist multi-feature voice print to Supabase
          if (userId && userId !== 'guest') {
            await saveVoicePrintToSupabase(userId, analyzedPrint);
          }

          toast.success("Biometric Voice Signature Saved to Supabase! 🔐", `Locked acoustic fingerprint (Pitch: ${analyzedPrint.avgPitch}Hz, Timbre Fc: ${analyzedPrint.spectralCentroid}Hz).`);
          speakReply(`Biometric voice signature successfully analyzed and saved to Supabase at ${analyzedPrint.avgPitch} Hertz! Speaker identification lock is now active across all portals.`);
        } else {
          toast.error("Registration Failed", "Could not analyze clear voice biometrics. Please speak clearly in a quiet room.");
        }
      }, 3500);
      voiceRegTimeoutRef.current = timeout;

    } catch (err) {
      console.warn("Failed voice registration:", err);
      toast.error("Microphone Error", "Could not access microphone for voice registration.");
      setIsRecordingVoice(false);
    }
  };

  // Voice recognition & Subtitle states

  const [recognizing, setRecognizing] = useState(false);
  const [subtitle, setSubtitle] = useState('');
  const [subtitleRole, setSubtitleRole] = useState<'user' | 'assistant' | 'system' | null>(null);
  const recognitionRef = useRef<any>(null);

  // onlyAvatar embeds the 3D teacher in a page (e.g. the lesson screen), which has no minimise
  // control. localMinimized starts true, so without this the 3D scene was never initialised there.
  const isMinimized = onlyAvatar ? false : minimized !== undefined ? minimized : localMinimized;
  const setIsMinimized = setMinimized !== undefined ? setMinimized : setLocalMinimized;

  // Initialize 3D Viewport on mount and reload when teacherId changes
  useEffect(() => {
    if (!canvasRef.current || isMinimized) return;
    const scene = new VRoidAvatarEngine();
    sceneRef.current = scene;
    try {
      scene.init(canvasRef.current, teacherId);
      rendererRef.current = scene.renderer;
      if (scene.raf) animFrameRef.current = scene.raf;
      scene.setState('wave');
      if (typeof window !== 'undefined') {
        (window as any).mentorAvatarScene = scene;
      }
    } catch (e) {
      console.warn("Failed to initialize WebGL avatar engine:", e);
    }
    const timer = setTimeout(() => {
      try {
        scene.setState('idle');
      } catch {}
    }, 2800);
    
    const ro = new ResizeObserver(e => {
      const el = e[0];
      if (el) scene.resize(el.contentRect.width, el.contentRect.height);
    });
    ro.observe(canvasRef.current);
    
    return () => {
      clearTimeout(timer);
      ro.disconnect();

      // 1. Dispose all scene objects (geometries + materials + textures)
      if (sceneRef.current) {
        sceneRef.current.traverse((object: THREE.Object3D) => {
          const mesh = object as THREE.Mesh;
          if (mesh.geometry) mesh.geometry.dispose();
          if (mesh.material) {
            const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
            materials.forEach((mat: THREE.Material) => {
              // Dispose all texture maps on the material
              Object.values(mat).forEach((val) => {
                if (val && typeof (val as THREE.Texture).dispose === 'function') {
                  (val as THREE.Texture).dispose();
                }
              });
              mat.dispose();
            });
          }
        });
        sceneRef.current.dispose();
      }

      // 2. Dispose renderer and force WebGL context release
      if (rendererRef.current) {
        rendererRef.current.dispose();
        // No forceContextLoss(): the next mentor's context is created right after, and forcing the loss
        // here made that new context start lost on some GPUs (see VRoidAvatarEngine.dispose).
        // The canvas is React's (keyed by mentor below); removing it here made React crash later.
      }

      // 3. Stop all microphone tracks
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track: MediaStreamTrack) => track.stop());
        streamRef.current = null;
      }
      if (voiceRegStreamRef.current) {
        try {
          voiceRegStreamRef.current.getTracks().forEach((track: MediaStreamTrack) => track.stop());
        } catch {}
        voiceRegStreamRef.current = null;
      }
      if (voiceRegAudioCtxRef.current && voiceRegAudioCtxRef.current.state !== 'closed') {
        try {
          voiceRegAudioCtxRef.current.close().catch(() => {});
        } catch {}
        voiceRegAudioCtxRef.current = null;
      }
      if (voiceRegIntervalRef.current) {
        clearInterval(voiceRegIntervalRef.current);
        voiceRegIntervalRef.current = null;
      }
      if (voiceRegTimeoutRef.current) {
        clearTimeout(voiceRegTimeoutRef.current);
        voiceRegTimeoutRef.current = null;
      }

      // 4. Cancel animation frame
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      if (scene.raf) {
        cancelAnimationFrame(scene.raf);
      }

      if (typeof window !== 'undefined' && (window as any).mentorAvatarScene === scene) {
        (window as any).mentorAvatarScene = null;
      }
      sceneRef.current = null;
      rendererRef.current = null;
    };
  }, [teacherId, isMinimized]);

  // Sync AI state animations
  useEffect(() => {
    sceneRef.current?.setState(aiState);
  }, [aiState]);

  // Sync interactive gaze tracking state
  useEffect(() => {
    sceneRef.current?.setGazeTracking(gazeTracking);
  }, [gazeTracking]);

  // Drive AI state animation from chat lifecycle
  useEffect(() => {
    if (loading) {
      setAiState('thinking');
    } else if (speaking) {
      setAiState('talking');
    } else {
      setAiState('idle');
    }
  }, [loading, speaking]);

  // Sync speaking state from props if provided
  useEffect(() => {
    if (externalSpeaking !== undefined) {
      setSpeaking(externalSpeaking);
    }
  }, [externalSpeaking]);

  // Silence speech on minimize
  useEffect(() => {
    if (isMinimized) {
      stopSpeaking();
      setSpeaking(false);
    }
  }, [isMinimized]);

  const memory    = usePersonalAvatarMemory(userId);
  const memoryRef = useRef(memory);
  memoryRef.current = memory;

  const emotionAI = useFacialEmotionDetection();
  const emotionAIRef = useRef(emotionAI);
  emotionAIRef.current = emotionAI;

  const teacher   = TEACHER_CONFIG[teacherId] || TEACHER_CONFIG.priya;
  const hasGreetedRef = useRef(false);

  // Load avatar context + ML recommendations on mount
  useEffect(() => {
    if (userId === 'guest') return;
    fetch('/api/avatar/context', { credentials: 'include' })
      .then(r => r.json())
      .then(({ avatarMemory, mlRecommendations }) => {
        // Gate on what is actually persisted. exportMemory deliberately sends
        // conversationHistory as [] (transcripts are not stored), so keying the
        // restore off its length meant memory was never restored at all.
        if (avatarMemory?.memories?.length || avatarMemory?.persona) memoryRef.current.importMemory(avatarMemory);
        if (mlRecommendations?.length) setMlRecs(mlRecommendations);
      })
      .catch(() => {});
  }, [userId]);

  // Sync career profile to avatar memory
  useEffect(() => {
    if (!careerProfile || userId === 'guest') return;
    memoryRef.current.storePersonalInfo({
      name: userId, goals: [`Improve Career Score from ${careerProfile.ats_score||0} to 80+`],
      occupation: 'student', interests: careerProfile.weak_areas||[],
      preferences: { atsScore: careerProfile.ats_score, trustScore: careerProfile.trust_score, dnaScore: careerProfile.career_dna_score, streak: careerProfile.mission_streak, teacherId },
    });
    fetch('/api/avatar/memory', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(memoryRef.current.exportMemory()), credentials: 'include',
    }).catch(() => {});
  }, [careerProfile, userId, teacherId]);

  // Stop speaking and release voice media resources on unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
      if (voiceRegStreamRef.current) {
        try {
          voiceRegStreamRef.current.getTracks().forEach((track: MediaStreamTrack) => track.stop());
        } catch {}
        voiceRegStreamRef.current = null;
      }
      if (voiceRegAudioCtxRef.current && voiceRegAudioCtxRef.current.state !== 'closed') {
        try {
          voiceRegAudioCtxRef.current.close().catch(() => {});
        } catch {}
        voiceRegAudioCtxRef.current = null;
      }
      if (voiceRegIntervalRef.current) {
        clearInterval(voiceRegIntervalRef.current);
        voiceRegIntervalRef.current = null;
      }
      if (voiceRegTimeoutRef.current) {
        clearTimeout(voiceRegTimeoutRef.current);
        voiceRegTimeoutRef.current = null;
      }
    };
  }, []);

  // Greeting on mount
  useEffect(() => {
    if (hasGreetedRef.current || messages.length > 0) return;
    if (activeQuest) {
      const g = `Hello! I am ${teacher.name}, your mentor for this quest: "${activeQuest.title}". We will cover: ${activeQuest.desc}. What questions do you have about this topic?`;
      setMessages([{ role: 'assistant', content: g }]);
      hasGreetedRef.current = true;
    } else if (careerProfile) {
      const score  = careerProfile?.ats_score||0;
      const streak = careerProfile?.mission_streak||0;
      const g = score < 50
        ? `Hi! I'm ${teacher.name}. Your Career Score is ${score}/100 — let's build it together. What shall we work on?`
        : `Welcome back! Score ${score}/100 · 🔥 ${streak}-day streak. How can I help today?`;
      setMessages([{ role: 'assistant', content: g }]);
      hasGreetedRef.current = true;
    }
  }, [careerProfile, activeQuest, teacher.name, messages.length]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);

  // Build ML-powered quick prompts
  const quickPrompts = [
    '🎯 What should I study next?',
    `📊 How do I improve my Career Score from ${careerProfile?.ats_score||0}?`,
    '⚡ What missions should I do today?',
    '💼 Am I ready for job interviews?',
    ...mlRecs.slice(0,2).map(r => `${r.icon} Show me ${r.label.toLowerCase()} options`),
  ].slice(0, 5);

  const speakReply = useCallback(async (text: string) => {
    setSubtitle(text);
    setSubtitleRole('assistant');
    speakWithAvatar(
      text,
      teacherId,
      () => setSpeaking(true),
      () => setSpeaking(false)
    );
  }, [teacherId]);

  const sendMessage = useCallback(async (text?: string) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;

    // Deduplication guard: ignore identical messages dispatched within 1500ms
    const now = Date.now();
    if (lastSentMsgRef.current === msg.toLowerCase() && now - lastSentTimeRef.current < 1500) {
      return;
    }
    lastSentMsgRef.current = msg.toLowerCase();
    lastSentTimeRef.current = now;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: msg }]);
    setMessages(prev => {
      // Limit local chat memory length
      if (prev.length > 50) return prev.slice(prev.length - 50);
      return prev;
    });
    setSubtitle(msg);
    setSubtitleRole('user');

    // ── Client-side navigation & conversational command parser ──
    const wakeResult = parseWakeWord(msg, teacherId);
    if (wakeResult.hasWakeWord && wakeResult.isStandaloneWake) {
      const greeting = `Yes, I am listening! How can I help you today?`;
      setMessages(prev => [...prev, { role: 'assistant', content: greeting }]);
      await speakReply(greeting);
      return;
    }

    const effectiveMsg = (wakeResult.hasWakeWord && wakeResult.command ? wakeResult.command : msg).trim();
    const lower = effectiveMsg.toLowerCase();

    // 1. Exit conversational mode check
    if (isConversing && (lower.includes('bye') || lower.includes('goodbye') || lower.includes('stop talking') || lower.includes('minimize') || lower.includes('close'))) {
      setIsConversing(false);
      if (onEnlarge) onEnlarge(false);
      const exitReply = `Goodbye! Let me know whenever you want to talk again.`;
      setMessages(prev => [...prev, { role: 'assistant', content: exitReply }]);
      await speakReply(exitReply);
      return;
    }

    // 2. Priority check (only when not asking for deterministic next curriculum task)
    if (!isNextTaskIntent(effectiveMsg) && (lower.includes('priority') || lower.includes('what to do') || lower.includes('preyourrity') || lower.includes('preyourity'))) {
      const recommendation = (() => {
        const streak = careerProfile?.mission_streak || 0;
        const trust = careerProfile?.trust_score || 0;
        const vault = careerProfile?.vault_count || 0;

        if (streak === 0) {
          return {
            title: "Start your daily mission streak",
            desc: "Complete one mission today to start building your streak, which directly raises your Career DNA score.",
            targetPath: "/missions",
            tab: "Missions"
          };
        }
        if (trust < 50) {
          return {
            title: "Build your Trust Score",
            desc: "Verify a skill or add a document to your vault to make your profile visible to active SDE recruiters.",
            targetPath: "/vault",
            tab: "Vault"
          };
        }
        if (vault === 0) {
          return {
            title: "Add your first vault document",
            desc: "Upload certifications or project proof to verify your skills and raise your trust index.",
            targetPath: "/vault",
            tab: "Vault"
          };
        }
        return {
          title: "Maintain your daily streak",
          desc: "Today's missions are ready. Complete a challenge to build your consistency metric.",
          targetPath: "/missions",
          tab: "Missions"
        };
      })();

      const reply = `Your top career priority right now is to ${recommendation.title}. ${recommendation.desc} Shifting you to the ${recommendation.tab} tab now.`;
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
      await speakReply(reply);
      if (onTabShift) {
        setTimeout(() => {
          onTabShift(recommendation.targetPath);
        }, 1200);
      }
      return;
    }

    // 3. Start Quest / Start Mission check
    if (lower.includes('start mission') || lower.includes('begin mission') || lower.includes('play mission')) {
      const reply = "Sure, starting your daily boardroom crisis roleplay mission now! Loading Socratic simulation.";
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
      await speakReply(reply);
      if (onTabShift) {
        setTimeout(() => {
          onTabShift('/missions?roleplay=true');
        }, 800);
      }
      return;
    }

    if (lower.includes('start quest') || lower.includes('begin quest') || lower.includes('play quest')) {
      const reply = "Sure! Opening your custom quest learning roadmap now. Select a quest module to begin.";
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
      await speakReply(reply);
      if (onTabShift) {
        setTimeout(() => {
          onTabShift('/quests');
        }, 800);
      }
      return;
    }

    // 4. Conversational talk mode check
    if (lower.includes('talk with u') || lower.includes('want to talk') || lower.includes('chat with u') || lower.includes('talk to you')) {
      setIsConversing(true);
      if (onEnlarge) onEnlarge(true);
      const talkReply = `Yes, I am here! What do you want to talk about? Let me help you prepare for SDE roleplays, or brainstorm your next system design concepts. Just speak up, I am listening!`;
      setMessages(prev => [...prev, { role: 'assistant', content: talkReply }]);
      await speakReply(talkReply);
      return;
    }

    // ── Voice Navigation Engine — exhaustive route matching with confidence scoring ──
    const navResult = matchNavigationIntent(effectiveMsg);
    if (navResult.matched && navResult.confidence >= 0.7) {
      // High confidence → navigate immediately with voice confirmation
      console.log(`[VoiceNav] sendMessage HIGH confidence (${(navResult.confidence * 100).toFixed(0)}%) → ${navResult.path} (${navResult.displayName})`);
      const confirmation = `Sure! Shifting you to ${navResult.displayName} now.`;
      setMessages(prev => [...prev, { role: 'assistant', content: confirmation }]);
      await speakReply(confirmation);
      if (onTabShift) {
        setTimeout(() => {
          onTabShift(navResult.path);
        }, 800);
      }
      return; // Complete local intercept, bypass server call
    } else if (navResult.matched && navResult.confidence >= 0.4) {
      // Medium confidence → ask for clarification before navigating
      console.log(`[VoiceNav] sendMessage MEDIUM confidence (${(navResult.confidence * 100).toFixed(0)}%) → clarifying`);
      const top2 = navResult.candidates.slice(0, 2);
      const clarification = top2.length >= 2
        ? `I'm not sure if you meant ${top2[0].displayName} or ${top2[1].displayName}. Which one would you like?`
        : `Did you mean ${top2[0].displayName}? Just say yes to confirm.`;
      setMessages(prev => [...prev, { role: 'assistant', content: clarification }]);
      await speakReply(clarification);
      return;
    }


    // 0ms Client-Side Session Micro-Cache (5-min TTL)
    const sessionCacheKey = `pinit_cache_${teacherId}_${effectiveMsg.toLowerCase()}`;
    if (typeof window !== 'undefined') {
      try {
        const cachedRaw = sessionStorage.getItem(sessionCacheKey);
        if (cachedRaw) {
          const parsedCache = JSON.parse(cachedRaw);
          if (Date.now() - parsedCache.timestamp < 5 * 60 * 1000 && parsedCache.reply) {
            setMessages(prev => [...prev, { role: 'assistant', content: parsedCache.reply }]);
            await speakReply(parsedCache.reply);
            return;
          }
        }
      } catch {}
    }

    setLoading(true);

    const emotionalCtx = emotionAIRef.current.getEmotionalContext(effectiveMsg);
    const historyForAPI = memoryRef.current.getConversationContext(10)
      .map((c: { userMessage?: string; avatarResponse?: string; role?: string; content?: string }) =>
        c.userMessage
          ? [{ role:'user', content:c.userMessage }, { role:'assistant', content:c.avatarResponse }]
          : [{ role:c.role, content:c.content }]
      ).flat().filter((m: {content?:string}) => m.content);

    try {
      const res = await fetch('/api/avatar/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          message: effectiveMsg,
          history: historyForAPI,
          teacherId,
          careerContext: { ...careerProfile, activeQuest }
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const errMsg = data?.message || data?.error || 'Unable to get response from mentor. Please try again.';
        setMessages(prev => [...prev, { role: 'assistant', content: errMsg }]);
        await speakReply(errMsg);
        return;
      }
      const reply = data?.reply || '';
      const cleanReply = sanitizeLLMOutput(reply);
      setMessages(prev => [...prev, { role: 'assistant', content: cleanReply }]);
      memoryRef.current.storeConversation(effectiveMsg, cleanReply, { emotion: emotionalCtx.detectedEmotion, engagement: 0.8 });
      
      // Persist to 5-min session cache for 0ms repeat answers
      if (typeof window !== 'undefined' && cleanReply) {
        try {
          sessionStorage.setItem(sessionCacheKey, JSON.stringify({ reply: cleanReply, timestamp: Date.now() }));
        } catch {}
      }

      // Persist verified progress snapshot locally if advisor answered
      if (typeof window !== 'undefined' && userId && data?.advisorResult) {
        try {
          const activeCourseId = careerProfile?.activeCourseId || careerProfile?.courseId || 'fullstack-mastery';
          const localDoneRaw = localStorage.getItem(`pinit_${userId}_completed_quests`) || localStorage.getItem('pinit_completed_quests');
          const localDone = localDoneRaw ? JSON.parse(localDoneRaw) : [];
          const snap = {
            userId,
            courseId: data.advisorResult.courseId || activeCourseId,
            completedQuestIds: Array.isArray(localDone) ? localDone : [],
            syncedAt: Date.now(),
          };
          localStorage.setItem(`pinit_${userId}_verified_progress`, JSON.stringify(snap));
        } catch {}
      }

      await speakReply(cleanReply);
    } catch {
      if (isNextTaskIntent(effectiveMsg)) {
        let fallbackMessage = "I cannot verify your latest progress while offline. Please reconnect to confirm your next task.";
        try {
          let snapshotToUse: any = null;
          const cached = localStorage.getItem(`pinit_${userId}_verified_progress`);
          if (cached) {
            const parsed = JSON.parse(cached);
            if (isValidSnapshotTimestamp(parsed.syncedAt, 24 * 60 * 60 * 1000)) {
              snapshotToUse = parsed;
            }
          }
          // Secondary bridge: construct from locally verified completed quests if primary snapshot absent
          if (!snapshotToUse) {
            const localQuestsRaw = localStorage.getItem(`pinit_${userId}_completed_quests`) || localStorage.getItem('pinit_completed_quests');
            if (localQuestsRaw) {
              const questsArr = JSON.parse(localQuestsRaw);
              if (Array.isArray(questsArr)) {
                const activeCourseId = careerProfile?.activeCourseId || careerProfile?.courseId || 'fullstack-mastery';
                snapshotToUse = {
                  userId: userId || 'local_student',
                  courseId: activeCourseId,
                  completedQuestIds: questsArr,
                  syncedAt: Date.now(),
                };
              }
            }
          }

          if (snapshotToUse) {
            const { COURSES_REGISTRY } = await import('@/lib/data/coursesData');
            const course = COURSES_REGISTRY.find(c => c.id === snapshotToUse.courseId) || COURSES_REGISTRY[0];
            const localCurriculum = (course?.quests || []).map(q => ({
              questId: q.id,
              courseId: course?.id || snapshotToUse.courseId,
              title: q.title
            }));
            const localAdvisor = getAuthoritativeNextTask(snapshotToUse, snapshotToUse.userId, localCurriculum);
            if (localAdvisor.status === 'VERIFIED_TASK' || localAdvisor.status === 'COURSE_COMPLETED') {
              const syncDate = new Date(snapshotToUse.syncedAt).toLocaleTimeString();
              fallbackMessage = `${localAdvisor.speechText} (Offline Snapshot synced at ${syncDate})`;
            }
          }
        } catch {}
        setMessages(prev => [...prev, { role: 'assistant', content: fallbackMessage }]);
        await speakReply(fallbackMessage);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: 'Connection issue. Please try again.' }]);
      }
    } finally {
      setLoading(false);
    }
  }, [input, loading, isConversing, onEnlarge, careerProfile, onTabShift, teacherId, activeQuest, speakReply, userId]);

  // Keep track of latest speaking/loading states in refs to avoid stale closures in SpeechRecognition handlers
  const speakingRef = useRef(speaking);
  const loadingRef = useRef(loading);
  const conversingRef = useRef(isConversing);
  const sendMessageRef = useRef(sendMessage);
  const speakReplyRef = useRef(speakReply);
  const onTabShiftRef = useRef(onTabShift);

  useEffect(() => {
    speakingRef.current = speaking;
  }, [speaking]);
  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);
  useEffect(() => {
    conversingRef.current = isConversing;
  }, [isConversing]);
  useEffect(() => {
    sendMessageRef.current = sendMessage;
  }, [sendMessage]);
  useEffect(() => {
    speakReplyRef.current = speakReply;
  }, [speakReply]);
  useEffect(() => {
    onTabShiftRef.current = onTabShift;
  }, [onTabShift]);


  // Opt-in Conversational Speech Recognition with Echo Gate
  useEffect(() => {
    if (typeof window === 'undefined' || onlyAvatar) return;
    if (micDeniedRef.current) return;
    // Only listen when active conversational mode is enabled by the user
    if (!isConversing) {
      setRecognizing(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    // Echo Gate: Disable speech recognition while AI is speaking, loading, or in 400ms cooldown to prevent feedback loops
    if (speaking || loading || speechCooldown) {
      setRecognizing(false);
      return;
    }

    let recognition: any = null;
    let shouldListen = true;

    const startListening = () => {
      if (!shouldListen || !conversingRef.current) return;
      try {
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.maxAlternatives = 5;
        
        // Auto-match browser locale for native accent accuracy
        recognition.lang = navigator.language || 'en-US';

        const SpeechGrammarList = (window as any).SpeechGrammarList || (window as any).webkitSpeechGrammarList;
        if (SpeechGrammarList) {
          const speechRecognitionList = new SpeechGrammarList();
          const vocab = getGrammarVocabulary();
          const grammar = '#JSGF V1.0; grammar vocab; public <word> = ' + vocab.join(' | ') + ' ;';
          speechRecognitionList.addFromString(grammar, 1);
          recognition.grammars = speechRecognitionList;
        }

        recognition.onstart = () => {
          setRecognizing(true);
        };

        recognition.onresult = (e: any) => {
          // Double guard against AI voice capture
          if (speakingRef.current || loadingRef.current || speechCooldown) return;

          const allAlternatives: string[] = [];
          const resultCount = e.results[0]?.length || 0;
          for (let a = 0; a < resultCount; a++) {
            const alt = e.results[0]?.[a]?.transcript;
            if (alt) allAlternatives.push(alt.trim());
          }

          const transcript = allAlternatives[0];
          if (!transcript) return;

          // Advisory speaker verification (non-blocking)
          if (voicePrintRef.current || voiceFreqRef.current) {
            const target = voicePrintRef.current || voiceFreqRef.current;
            const inputFrames = acousticFramesRef.current.length > 0 ? acousticFramesRef.current : pitchHistoryRef.current;
            if (inputFrames.length > 0) {
              const result = verifyVoiceSignature(inputFrames, target);
              console.log(`[Speaker Biometrics] Verification result:`, result);
            }
          }

          const text = transcript.trim().toLowerCase();

          // In active conversation mode, dispatch speech to AI mentor with 300ms debounce
          if (conversingRef.current) {
            console.log("[Conversing] Direct speech parsed:", transcript);
            if (speechDebounceTimerRef.current) {
              clearTimeout(speechDebounceTimerRef.current);
            }
            speechDebounceTimerRef.current = setTimeout(() => {
              if (!speakingRef.current && !loadingRef.current) {
                sendMessageRef.current(transcript);
              }
            }, 300);
            return;
          }

          // Use robust word-boundary wake-word parser (resilient to commas, collisions, standalone wake words)
          const parsed = parseWakeWord(transcript, teacherId);

          if (parsed.hasWakeWord) {
            console.log("Wake word detected:", transcript, "Matched mentor:", parsed.mentor);
            setIsMinimized(false);

            if (parsed.isStandaloneWake) {
              const greeting = `Yes, I am listening! How can I help you today?`;
              setMessages(prev => [...prev, { role: 'assistant', content: greeting }]);
              speakReplyRef.current(greeting);
              return;
            }

            const cleaned = parsed.command;
            if (cleaned.length > 0) {
              const navResult = matchBestAlternative([cleaned]);

              if (navResult.matched && navResult.confidence >= 0.7) {
                const confirmation = `Sure! Taking you to ${navResult.displayName} now.`;
                setMessages(prev => [...prev, { role: 'user', content: cleaned }]);
                setMessages(prev => [...prev, { role: 'assistant', content: confirmation }]);
                speakReplyRef.current(confirmation);
                if (onTabShiftRef.current) {
                  const navTarget = onTabShiftRef.current;
                  setTimeout(() => { navTarget(navResult.path); }, 800);
                }
              } else if (navResult.matched && navResult.confidence >= 0.4) {
                const top2 = navResult.candidates.slice(0, 2);
                const clarification = top2.length >= 2
                  ? `I heard "${cleaned}". Did you mean ${top2[0].displayName} or ${top2[1].displayName}?`
                  : `I heard "${cleaned}". Did you mean ${top2[0].displayName}?`;
                setMessages(prev => [...prev, { role: 'user', content: cleaned }]);
                setMessages(prev => [...prev, { role: 'assistant', content: clarification }]);
                speakReplyRef.current(clarification);
              } else {
                sendMessageRef.current(cleaned);
              }
            } else {
              const greeting = `Yes, I am listening! How can I help you today?`;
              setMessages(prev => [...prev, { role: 'assistant', content: greeting }]);
              speakReplyRef.current(greeting);
            }
          }
        };

        recognition.onerror = (err: any) => {
          if (err.error === 'not-allowed') {
            console.warn("Speech recognition access denied.");
            toast.error("Microphone Blocked 🎤", "Microphone access was denied. Please allow microphone permissions in your browser address bar.");
            shouldListen = false;
            micDeniedRef.current = true;
            setIsConversing(false);
          }
        };

        recognition.onend = () => {
          setRecognizing(false);
          // Only restart if active conversing mode is still explicitly enabled
          if (shouldListen && conversingRef.current) {
            setTimeout(startListening, 300);
          }
        };

        recognition.start();
      } catch (err) {
        console.error("Speech recognition startup error:", err);
      }
    };

    startListening();

    return () => {
      shouldListen = false;
      if (recognition) {
        try {
          recognition.stop();
        } catch {}
      }
    };
  }, [teacherId, setIsMinimized, speaking, loading, isConversing, speechCooldown]);

  // Auto-close (minimize) timer when not responding/speaking
  useEffect(() => {
    if (onlyAvatar) return;
    if (minimized === false) return;
    // If minimized, do nothing
    if (isMinimized) return;

    // If AI is currently loading or speaking, or in active voice conversation, do not close, and clear any timer
    if (loading || speaking || isConversing) return;

    // If the user has typed something, don't close
    if (input.trim().length > 0) return;

    // Otherwise, set a timeout to close/minimize the widget after 8 seconds of silence/inactivity
    console.log("Starting auto-close timer...");
    const timer = setTimeout(() => {
      console.log("Auto-close timer expired. Minimizing widget.");
      setIsMinimized(true);
    }, 8000); // 8 seconds of inactivity

    return () => {
      clearTimeout(timer);
    };
  }, [loading, speaking, isMinimized, input, setIsMinimized, onlyAvatar, minimized, isConversing]);

  if (isMinimized && !onlyAvatar) {
    return (
      <button 
        onClick={() => setIsMinimized(false)} 
        style={{
          position:'fixed', bottom:24, left:'50%', transform:'translateX(-50%)', zIndex:100,
          width:58, height:58, borderRadius:'50%',
          background: teacher.color, border:'none', cursor:'pointer',
          fontSize:28.5, boxShadow:`0 4px 20px ${teacher.color}60`,
          display:'flex', alignItems:'center', justifyContent:'center',
          opacity: 0.75,
          transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateX(-50%) scale(1.08)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.75'; e.currentTarget.style.transform = 'translateX(-50%) scale(1)'; }}
        title={`Open ${teacher.name}`}
      >
        {teacher.emoji}
      </button>
    );
  }

  const renderChatPanel = (
    <div style={{ flex: isEnlarged ? 1.4 : 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--bg2)' }}>
      {/* Messages List Container */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 14px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {messages.map((m, i) => {
          const isUser = m.role === 'user';
          return (
            <div
              key={i}
              style={{
                display: 'flex',
                justifyContent: isUser ? 'flex-end' : 'flex-start',
                alignItems: 'flex-start',
                gap: 8,
                maxWidth: '85%',
                alignSelf: isUser ? 'flex-end' : 'flex-start',
              }}
            >
              {!isUser && (
                <span style={{ fontSize: 22, marginTop: 4, flexShrink: 0 }}>
                  {teacher.emoji}
                </span>
              )}
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: 14,
                  fontSize: 14,
                  lineHeight: 1.5,
                  background: isUser ? teacher.color : 'var(--bg3)',
                  color: isUser ? 'var(--text)' : 'var(--t1)',
                  border: isUser ? 'none' : '1px solid var(--border)',
                  boxShadow: 'var(--shadow-sm)',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {m.content}
              </div>
            </div>
          );
        })}
        {loading && (
          <div style={{ display: 'flex', gap: 8, alignSelf: 'flex-start', alignItems: 'center', color: 'var(--t3)', fontSize: 13, paddingLeft: 28 }}>
            <span>{teacher.emoji}</span>
            <div style={{
              background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 14, padding: '10px 16px', display: 'flex', gap: 4, alignItems: 'center'
            }}>
              <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: 'var(--t3)', animation: 'pulse 1.2s infinite ease-in-out' }}></span>
              <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: 'var(--t3)', animation: 'pulse 1.2s infinite ease-in-out 0.2s' }}></span>
              <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: 'var(--t3)', animation: 'pulse 1.2s infinite ease-in-out 0.4s' }}></span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick Suggestion Prompts */}
      <div style={{
        display: 'flex',
        gap: 6,
        padding: '8px 12px',
        overflowX: 'auto',
        borderTop: '1px solid var(--border)',
        background: 'var(--bg3)',
        flexShrink: 0,
        scrollbarWidth: 'none',
      }}>
        {quickPrompts.map((promptText, i) => (
          <button
            key={i}
            type="button"
            onClick={() => {
              const cleanedText = promptText.replace(/^[^a-zA-Z0-9]+/, '').trim();
              sendMessage(cleanedText);
            }}
            style={{
              whiteSpace: 'nowrap',
              padding: '6px 12px',
              borderRadius: 20,
              border: '1px solid var(--border)',
              background: 'var(--bg2)',
              color: 'var(--t2)',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            className="quick-prompt-pill"
          >
            {promptText}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <form
        onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
        style={{
          display: 'flex',
          gap: 8,
          padding: 10,
          borderTop: '1px solid var(--border)',
          background: 'var(--bg2)',
          alignItems: 'center',
          flexShrink: 0,
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask ${teacher.name} a question...`}
          style={{
            flex: 1,
            padding: '9px 14px',
            borderRadius: 20,
            border: '1px solid var(--border)',
            background: 'var(--bg3)',
            color: 'var(--t1)',
            fontSize: 14,
            outline: 'none',
          }}
          disabled={loading}
        />
        <button
          type="button"
          onClick={() => {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            if (!SpeechRecognition) {
              toast.info("Voice Input Notice 🎙️", "Live speech recognition is optimized for Chrome & Edge. Switched to instant text mode.");
              return;
            }
            setIsConversing(prev => !prev);
          }}
          title={isConversing ? 'Mute voice conversation' : 'Start voice conversation'}
          style={{
            background: isConversing ? 'rgba(239, 68, 68, 0.2)' : 'var(--bg3)',
            color: isConversing ? '#ef4444' : 'var(--t2)',
            border: `1px solid ${isConversing ? 'rgba(239, 68, 68, 0.5)' : 'var(--border)'}`,
            borderRadius: '50%',
            width: 34,
            height: 34,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 15.5,
            transition: 'all 0.15s',
          }}
        >
          {isConversing ? '🎙️' : '🎤'}
        </button>
        <button
          type="submit"
          disabled={!input.trim() || loading}
          style={{
            background: input.trim() && !loading ? teacher.color : 'var(--bg3)',
            color: input.trim() && !loading ? 'var(--text)' : 'var(--t3)',
            border: 'none',
            borderRadius: '50%',
            width: 34,
            height: 34,
            cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 15.5,
            transition: 'all 0.15s',
            boxShadow: input.trim() && !loading ? `0 2px 8px ${teacher.color}40` : 'none',
          }}
        >
          ➔
        </button>
      </form>
      
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(0.6); opacity: 0.4; }
          50% { transform: scale(1.1); opacity: 1; }
        }
        .quick-prompt-pill:hover {
          border-color: var(--accent) !important;
          color: var(--accent) !important;
          background: var(--accent-light) !important;
        }
      `}</style>
    </div>
  );

  if (onlyAvatar) {
    return (
      <div style={{ position: 'relative', width: '100%', height: '100%', flex: 1, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <canvas key={teacherId} ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
        {aiState !== 'idle' && (
          <div style={{
            position: 'absolute', top: 8, right: 8, fontSize: 10, fontWeight: 700,
            padding: '2px 6px', borderRadius: 4, background: 'rgba(0,0,0,0.6)',
            color: aiState === 'talking' ? '#a5b4fc' : aiState === 'thinking' ? '#fde68a' : '#86efac',
            backdropFilter: 'blur(4px)', fontFamily: 'var(--font-mono)', zIndex: 10
          }}>
            {aiState === 'talking' ? '🎙 Speaking' : aiState === 'thinking' ? '💭 Thinking' : aiState === 'listening' ? '👂 Listening' : aiState === 'wave' ? '👋 Hi there' : '✓ Active'}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="avatar-mentor-widget" style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg2)' }}>
      {/* Header */}
      <div className="mentor-header" style={{ background: `linear-gradient(135deg, ${teacher.color}, ${teacher.color}cc)`, flexShrink: 0, padding: '12px 16px' }}>
        <div className="mentor-info">
          <span className="mentor-emoji" style={{ fontSize: '31px', marginRight: '4px' }}>{teacher.emoji}</span>
          <div>
            <p className="mentor-name" style={{ fontSize: '15.5px' }}>{teacher.name}</p>
            <p className="mentor-subtitle" style={{ fontSize: '11.5px' }}>Career Mentor {speaking ? '🔊' : ''} · {mlRecs.length > 0 ? `${mlRecs.length} ML tips` : 'AI powered'}</p>
          </div>
        </div>
        <div className="mentor-controls" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {voiceFreq || voicePrint ? (
            <span 
              onClick={() => {
                if (confirm("Reset voice lock signature from Supabase and local storage?")) {
                  localStorage.removeItem(`pinit_${userId}_voice_print_freq`);
                  localStorage.removeItem(`pinit_${userId}_voice_print_data`);
                  setVoiceFreq(null);
                  setVoicePrint(null);
                  if (userId && userId !== 'guest') {
                    saveVoicePrintToSupabase(userId, null);
                  }
                  toast.info("Voice Lock Reset", "Owner voice lock disabled.");
                }
              }}
              style={{ fontSize: 10, background: 'rgba(255,255,255,0.15)', padding: '2px 6px', borderRadius: 4, color: 'var(--text)', cursor: 'pointer', fontWeight: 'bold' }}
              title="Voice lock active (Synced to Supabase). Click to reset."
            >
              🔐 Voice Lock ({voicePrint?.avgPitch || voiceFreq}Hz)
            </span>
          ) : (
            <span 
              onClick={startVoiceRegistration}
              style={{ fontSize: 10, background: isRecordingVoice ? 'var(--coral)' : 'rgba(255,255,255,0.2)', padding: '2px 6px', borderRadius: 4, color: 'var(--text)', cursor: 'pointer', fontWeight: 'bold' }}
              title="Click to analyze and register your voice signature into Supabase"
            >
              {isRecordingVoice ? '🎙️ Analyzing...' : '🎙️ Register Voice'}
            </span>
          )}
          <button onClick={() => setIsMinimized(true)} className="minimize-btn" title="Minimize">_</button>
        </div>
      </div>

      {isEnlarged ? (
        /* Horizontal Split Pane for Enlarged View */
        <div style={{ flex: 1, display: 'flex', flexDirection: 'row', overflow: 'hidden' }}>
          {/* Left Column: Avatar Canvas */}
          <div style={{ position: 'relative', flex: 1.1, background: 'var(--bg3)', overflow: 'hidden', borderRight: '1px solid var(--border)' }}>
            <canvas key={teacherId} ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
            {aiState !== 'idle' && (
              <div style={{
                position: 'absolute', top: 8, right: 8, fontSize: 10, fontWeight: 700,
                padding: '2px 6px', borderRadius: 4, background: 'rgba(0,0,0,0.6)',
                color: aiState === 'talking' ? '#a5b4fc' : aiState === 'thinking' ? '#fde68a' : '#86efac',
                backdropFilter: 'blur(4px)', fontFamily: 'var(--font-mono)'
              }}>
                {aiState === 'talking' ? '🎙 Speaking' : aiState === 'thinking' ? '💭 Thinking' : aiState === 'listening' ? '👂 Listening' : aiState === 'wave' ? '👋 Hi there' : '✓ Active'}
              </div>
            )}
          </div>

          {/* Right Column: Chat Panel */}
          {renderChatPanel}
        </div>
      ) : (
        /* Vertical Stack Pane for Default/Docked View */
        <>
          {/* 3D WebGL Avatar Viewport - top */}
          <div style={{ position: 'relative', height: 200, background: 'var(--bg3)', overflow: 'hidden', flexShrink: 0, borderBottom: '1px solid var(--border)' }}>
            <canvas key={teacherId} ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
            {aiState !== 'idle' && (
              <div style={{
                position: 'absolute', top: 8, right: 8, fontSize: 10, fontWeight: 700,
                padding: '2px 6px', borderRadius: 4, background: 'rgba(0,0,0,0.6)',
                color: aiState === 'talking' ? '#a5b4fc' : aiState === 'thinking' ? '#fde68a' : '#86efac',
                backdropFilter: 'blur(4px)', fontFamily: 'var(--font-mono)'
              }}>
                {aiState === 'talking' ? '🎙 Speaking' : aiState === 'thinking' ? '💭 Thinking' : aiState === 'listening' ? '👂 Listening' : aiState === 'wave' ? '👋 Hi there' : '✓ Active'}
              </div>
            )}
          </div>
          {/* Chat Panel - bottom */}
          {renderChatPanel}
        </>
      )}
    </div>
  );

}
