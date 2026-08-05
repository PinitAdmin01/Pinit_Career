import { useState, useEffect, useRef, useCallback } from 'react';
import { usePersonalAvatarMemory }    from './hooks/usePersonalAvatarMemory';
import { useFacialEmotionDetection }  from './hooks/useFacialEmotionDetection';
import { matchBestAlternative, matchNavigationIntent, getGrammarVocabulary } from './hooks/useVoiceNavigation';
import { analyzeVoiceFrames, analyzeVoiceSamples, verifyVoiceSignature, calculateSpectralFeatures, extractMelFilterbank, AcousticFrame, VoicePrint } from './hooks/useVoiceBiometrics';
import { saveVoicePrintToSupabase, getVoicePrintFromSupabase } from '@/lib/supabaseService';
import * as THREE from 'three';
import { speakWithAvatar, stopSpeaking } from '@/lib/tts';
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

const TEACHER_CONFIG: Record<string, { name: string; color: string; emoji: string }> = {
  priya:  { name: 'Ms. Priya',  color: '#4f46e5', emoji: '👩‍💼' },
  aisha:  { name: 'Ms. Aisha',  color: '#7c3aed', emoji: '👩‍🏫' },
  rohan:  { name: 'Mr. Rohan',  color: '#0891b2', emoji: '👨‍💻' },
  vikram: { name: 'Mr. Vikram', color: '#059669', emoji: '👨‍⚖️' },
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

  useEffect(() => {
    voiceFreqRef.current = voiceFreq;
  }, [voiceFreq]);

  useEffect(() => {
    voicePrintRef.current = voicePrint;
  }, [voicePrint]);

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
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
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

      setTimeout(async () => {
        clearInterval(interval);
        stream.getTracks().forEach(t => t.stop());
        audioCtx.close();
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

  const isMinimized = minimized !== undefined ? minimized : localMinimized;
  const setIsMinimized = setMinimized !== undefined ? setMinimized : setLocalMinimized;

  // Initialize 3D Viewport on mount and reload when teacherId changes
  useEffect(() => {
    if (!canvasRef.current) return;
    const scene = new VRoidAvatarEngine();
    sceneRef.current = scene;
    try {
      scene.init(canvasRef.current, teacherId);
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
      scene.dispose();
    };
  }, [teacherId, isMinimized]);

  // Sync AI state animations
  useEffect(() => {
    sceneRef.current?.setState(aiState);
  }, [aiState]);

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
  const emotionAI = useFacialEmotionDetection();
  const teacher   = TEACHER_CONFIG[teacherId] || TEACHER_CONFIG.priya;

  // Load avatar context + ML recommendations on mount
  useEffect(() => {
    if (userId === 'guest') return;
    fetch('/api/avatar/context', { credentials: 'include' })
      .then(r => r.json())
      .then(({ avatarMemory, mlRecommendations }) => {
        if (avatarMemory?.conversationHistory?.length) memory.importMemory(avatarMemory);
        if (mlRecommendations?.length) setMlRecs(mlRecommendations);
      })
      .catch(() => {});
  }, [userId]);

  // Sync career profile to avatar memory
  useEffect(() => {
    if (!careerProfile || userId === 'guest') return;
    memory.storePersonalInfo({
      name: userId, goals: [`Improve Career Score from ${careerProfile.ats_score||0} to 80+`],
      occupation: 'student', interests: careerProfile.weak_areas||[],
      preferences: { atsScore: careerProfile.ats_score, trustScore: careerProfile.trust_score, dnaScore: careerProfile.career_dna_score, streak: careerProfile.mission_streak, teacherId },
    });
    fetch('/api/avatar/memory', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(memory.exportMemory()), credentials: 'include',
    }).catch(() => {});
  }, [careerProfile, userId, teacherId]);

  // Stop speaking on unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  // Greeting on mount
  useEffect(() => {
    if (messages.length > 0) return;
    if (activeQuest) {
      const g = `Hello! I am ${teacher.name}, your mentor for this quest: "${activeQuest.title}". We will cover: ${activeQuest.desc}. What questions do you have about this topic?`;
      setMessages([{ role: 'assistant', content: g }]);
    } else if (careerProfile) {
      const score  = careerProfile?.ats_score||0;
      const streak = careerProfile?.mission_streak||0;
      const g = score < 50
        ? `Hi! I'm ${teacher.name}. Your Career Score is ${score}/100 — let's build it together. What shall we work on?`
        : `Welcome back! Score ${score}/100 · 🔥 ${streak}-day streak. How can I help today?`;
      setMessages([{ role: 'assistant', content: g }]);
    }
  }, [careerProfile, activeQuest, teacher.name]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);

  // Build ML-powered quick prompts
  const quickPrompts = [
    `📊 How do I improve my Career Score from ${careerProfile?.ats_score||0}?`,
    '🎯 What missions should I do today?',
    '📚 What should I study next?',
    '💼 Am I ready for job interviews?',
    ...mlRecs.slice(0,2).map(r => `${r.icon} Show me ${r.label.toLowerCase()} options`),
  ].slice(0, 5);

  const sendMessage = useCallback(async (text?: string) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;
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
    const lower = msg.toLowerCase();

    // 1. Exit conversational mode check
    if (isConversing && (lower.includes('bye') || lower.includes('goodbye') || lower.includes('stop talking') || lower.includes('minimize') || lower.includes('close'))) {
      setIsConversing(false);
      if (onEnlarge) onEnlarge(false);
      const exitReply = `Goodbye! Let me know whenever you want to talk again.`;
      setMessages(prev => [...prev, { role: 'assistant', content: exitReply }]);
      await speakReply(exitReply);
      return;
    }

    // 2. Priority check check
    if (lower.includes('priority') || lower.includes('what to do') || lower.includes('preyourrity') || lower.includes('preyourity')) {
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
    const navResult = matchNavigationIntent(msg);
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


    setLoading(true);

    const emotionalCtx = emotionAI.getEmotionalContext(msg);
    const historyForAPI = memory.getConversationContext(10)
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
          message: msg,
          history: historyForAPI,
          teacherId,
          careerContext: { ...careerProfile, activeQuest }
        }),
      });
      const { reply } = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
      memory.storeConversation(msg, reply, { emotion: emotionalCtx.detectedEmotion, engagement: 0.8 });
      await speakReply(reply);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Connection issue. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, careerProfile, teacherId, memory, emotionAI, onTabShift]);


  async function speakReply(text: string) {
    setSubtitle(text);
    setSubtitleRole('assistant');
    speakWithAvatar(
      text,
      teacherId,
      () => setSpeaking(true),
      () => setSpeaking(false)
    );
  }

  // Keep track of latest speaking/loading states in refs to avoid stale closures in SpeechRecognition handlers
  const speakingRef = useRef(speaking);
  const loadingRef = useRef(loading);
  const conversingRef = useRef(isConversing);
  useEffect(() => {
    speakingRef.current = speaking;
  }, [speaking]);
  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);
  useEffect(() => {
    conversingRef.current = isConversing;
  }, [isConversing]);


  // Background Speech Recognition for Wake Words with Echo Gate
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    // Echo Gate: Disable speech recognition while AI is speaking or loading to prevent feedback loops
    if (speaking || loading) {
      setRecognizing(false);
      return;
    }

    let recognition: any = null;
    let shouldListen = true;

    // Pitch monitoring state (hoisted to effect scope for cleanup access)
    let pitchStream: MediaStream | null = null;
    let pitchAudioCtx: AudioContext | null = null;
    let pitchInterval: ReturnType<typeof setInterval> | null = null;

    const cleanupPitch = () => {
      if (pitchInterval) { clearInterval(pitchInterval); pitchInterval = null; }
      if (pitchStream) { pitchStream.getTracks().forEach(t => t.stop()); pitchStream = null; }
      if (pitchAudioCtx) { pitchAudioCtx.close().catch(() => {}); pitchAudioCtx = null; }
    };

    const startListening = () => {
      if (!shouldListen) return;
      try {
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.maxAlternatives = 5; // Score all 5 alternatives for best navigation match
        
        // Auto-match browser locale for native accent accuracy (e.g., en-IN, en-US, en-GB)
        recognition.lang = navigator.language || 'en-US';

        // Grammar List: expanded vocabulary covering all portal routes + wake words + nav verbs
        const SpeechGrammarList = (window as any).SpeechGrammarList || (window as any).webkitSpeechGrammarList;
        if (SpeechGrammarList) {
          const speechRecognitionList = new SpeechGrammarList();
          const vocab = getGrammarVocabulary();
          const grammar = '#JSGF V1.0; grammar vocab; public <word> = ' + vocab.join(' | ') + ' ;';
          speechRecognitionList.addFromString(grammar, 1);
          recognition.grammars = speechRecognitionList;
        }

        // ── Continuous Acoustic Feature Monitoring via parallel Web Audio AnalyserNode ──
        // Feeds real-time pitch, spectral centroid, and MFCC vectors into acousticFramesRef for biometric identification
        if (!pitchStream) {
          try {
            navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
              if (!shouldListen) { stream.getTracks().forEach(t => t.stop()); return; }
              pitchStream = stream;
              pitchAudioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
              const src = pitchAudioCtx.createMediaStreamSource(stream);
              const analyser = pitchAudioCtx.createAnalyser();
              analyser.fftSize = 2048;
              src.connect(analyser);
              const buf = new Float32Array(analyser.fftSize);
              const freqData = new Float32Array(analyser.frequencyBinCount);
              pitchInterval = setInterval(() => {
                if (speakingRef.current || loadingRef.current) return; // Echo gate
                analyser.getFloatTimeDomainData(buf);
                analyser.getFloatFrequencyData(freqData);
                const pitch = detectPitch(buf, pitchAudioCtx!.sampleRate);
                const { centroid, rolloff } = calculateSpectralFeatures(freqData, pitchAudioCtx!.sampleRate);
                const mfccVector = extractMelFilterbank(freqData, pitchAudioCtx!.sampleRate);

                if (pitch > 0) {
                  pitchHistoryRef.current.push(pitch);
                  acousticFramesRef.current.push({
                    pitch,
                    spectralCentroid: centroid,
                    spectralRolloff: rolloff,
                    mfccVector
                  });
                  // Keep last 30 samples to avoid memory growth
                  if (pitchHistoryRef.current.length > 30) pitchHistoryRef.current.shift();
                  if (acousticFramesRef.current.length > 30) acousticFramesRef.current.shift();
                }
              }, 120);
            }).catch(() => {}); // Mic already granted from STT, but silently fail if not
          } catch {}
        }

        recognition.onstart = () => {
          setRecognizing(true);
        };

        recognition.onresult = (e: any) => {
          // Double guard against AI voice capture
          if (speakingRef.current || loadingRef.current) return;

          // Extract all alternatives for multi-scoring
          const allAlternatives: string[] = [];
          const resultCount = e.results[0]?.length || 0;
          for (let a = 0; a < resultCount; a++) {
            const alt = e.results[0]?.[a]?.transcript;
            if (alt) allAlternatives.push(alt.trim());
          }

          const transcript = allAlternatives[0];
          if (!transcript) return;

          // ── Owner Speaker Biometric Identification Verification Check ──
          if (voicePrintRef.current || voiceFreqRef.current) {
            const target = voicePrintRef.current || voiceFreqRef.current;
            const inputFrames = acousticFramesRef.current.length > 0 ? acousticFramesRef.current : pitchHistoryRef.current;
            const result = verifyVoiceSignature(inputFrames, target);
            console.log(`[Speaker Biometrics] Verification result:`, result);

            if (!result.verified) {
              console.warn("[Voice Lock] Speaker identity mismatch:", result.reason);
              toast.error("Speaker Signature Mismatch 🔐", result.reason);
              speakReply("Voice signature mismatch. Speaker identity does not match the registered owner.");
              return;
            }
          }

          const text = transcript.trim().toLowerCase();
          const activeTeacherKey = teacherId.toLowerCase();
          
          // If we are in active conversation mode, send everything directly without requiring the wake word
          if (conversingRef.current) {
            console.log("[Conversing] Direct speech parsed:", transcript);
            sendMessage(transcript);
            return;
          }

          // Fuzzy phoneme matching for teacher names and default wake word (Priya)
          const cleanText = text.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "").trim();
          const fuzzyMatchPriya = /\b(priya|preya|pria|prea|freeya|freya|riya)\b/i.test(cleanText);
          const fuzzyMatchKashyap = /\b(kashyap|kash|cash\s*up|catch\s*up|ketchup)\b/i.test(cleanText);
          const fuzzyMatchKarthic = /\b(karthic|karthik|kartik|nega|negga)\b/i.test(cleanText);
          const fuzzyMatchMaya = /\b(maya|maia|mya)\b/i.test(cleanText);
          const fuzzyMatchDivya = /\b(divya|divia)\b/i.test(cleanText);

          let matchedWakeWord = false;
          let matchedTeacherKey = '';
          
          if (fuzzyMatchPriya) {
            matchedWakeWord = true;
            matchedTeacherKey = 'priya';
          } else if (fuzzyMatchKashyap) {
            matchedWakeWord = true;
            matchedTeacherKey = 'kashyap';
          } else if (fuzzyMatchKarthic) {
            matchedWakeWord = true;
            matchedTeacherKey = 'karthic';
          } else if (fuzzyMatchMaya) {
            matchedWakeWord = true;
            matchedTeacherKey = 'maya';
          } else if (fuzzyMatchDivya) {
            matchedWakeWord = true;
            matchedTeacherKey = 'divya';
          }

          if (matchedWakeWord) {
            console.log("Fuzzy wake word detected:", transcript, "Matched teacher:", matchedTeacherKey);
            setIsMinimized(false);

            // Strip fuzzy wake word prefixes cleanly from query
            const cleaned = transcript
              .replace(/\b(hey|hi|hello)\b/gi, '')
              .replace(new RegExp(`\\b(${matchedTeacherKey}|priya|preya|pria|prea|freeya|freya|riya|kashyap|kash|cash\\s*up|catch\\s*up|ketchup|karthic|karthik|kartik|nega|negga|maya|maia|mya|divya|divia)\\b`, 'gi'), '')
              .trim();

            if (cleaned.length > 0) {
              // ── Try Voice Navigation Engine first (multi-alternative scoring) ──
              const cleanedAlts = allAlternatives.map(alt =>
                alt.replace(/\b(hey|hi|hello)\b/gi, '')
                   .replace(new RegExp(`\\b(${matchedTeacherKey}|priya|preya|pria|prea|freeya|freya|riya|kashyap|kash|cash\\s*up|catch\\s*up|ketchup|karthic|karthik|kartik|nega|negga|maya|maia|mya|divya|divia)\\b`, 'gi'), '')
                   .trim()
              ).filter(a => a.length > 0);

              const navResult = matchBestAlternative(cleanedAlts.length > 0 ? cleanedAlts : [cleaned]);

              if (navResult.matched && navResult.confidence >= 0.7) {
                // High confidence → navigate immediately with voice confirmation
                console.log(`[VoiceNav] HIGH confidence (${(navResult.confidence * 100).toFixed(0)}%) → ${navResult.path} (${navResult.displayName})`);
                const confirmation = `Sure! Taking you to ${navResult.displayName} now.`;
                setMessages(prev => [...prev, { role: 'user', content: cleaned }]);
                setMessages(prev => [...prev, { role: 'assistant', content: confirmation }]);
                speakReply(confirmation);
                if (onTabShift) {
                  setTimeout(() => { onTabShift(navResult.path); }, 800);
                }
              } else if (navResult.matched && navResult.confidence >= 0.4) {
                // Medium confidence → ask for clarification
                console.log(`[VoiceNav] MEDIUM confidence (${(navResult.confidence * 100).toFixed(0)}%) → asking clarification`);
                const top2 = navResult.candidates.slice(0, 2);
                const clarification = top2.length >= 2
                  ? `I heard "${cleaned}". Did you mean ${top2[0].displayName} or ${top2[1].displayName}?`
                  : `I heard "${cleaned}". Did you mean ${top2[0].displayName}?`;
                setMessages(prev => [...prev, { role: 'user', content: cleaned }]);
                setMessages(prev => [...prev, { role: 'assistant', content: clarification }]);
                speakReply(clarification);
              } else {
                // No navigation match → send to AI chat
                sendMessage(cleaned);
              }
            } else {
              const greeting = `Yes, I am listening! How can I help you today?`;
              setMessages(prev => [...prev, { role: 'assistant', content: greeting }]);
              speakReply(greeting);
            }
          }
        };

        recognition.onerror = (err: any) => {
          if (err.error === 'not-allowed') {
            console.warn("Speech recognition access denied.");
            shouldListen = false;
          }
        };

        recognition.onend = () => {
          setRecognizing(false);
          if (shouldListen) {
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
      // Clean up pitch monitoring
      try { cleanupPitch(); } catch {}
    };
  }, [teacherId, setIsMinimized, sendMessage, speaking, loading]);

  // Auto-close (minimize) timer when not responding/speaking
  useEffect(() => {
    if (onlyAvatar) return;
    if (minimized === false) return;
    // If minimized, do nothing
    if (isMinimized) return;

    // If AI is currently loading or speaking, do not close, and clear any timer
    if (loading || speaking) return;

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
  }, [loading, speaking, isMinimized, input, setIsMinimized, onlyAvatar]);

  if (isMinimized && !onlyAvatar) {
    return (
      <button 
        onClick={() => setIsMinimized(false)} 
        style={{
          position:'fixed', bottom:24, left:'50%', transform:'translateX(-50%)', zIndex:100,
          width:58, height:58, borderRadius:'50%',
          background: teacher.color, border:'none', cursor:'pointer',
          fontSize:26, boxShadow:`0 4px 20px ${teacher.color}60`,
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
                <span style={{ fontSize: 20, marginTop: 4, flexShrink: 0 }}>
                  {teacher.emoji}
                </span>
              )}
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: 14,
                  fontSize: 12.5,
                  lineHeight: 1.5,
                  background: isUser ? teacher.color : 'var(--bg3)',
                  color: isUser ? '#ffffff' : 'var(--t1)',
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
          <div style={{ display: 'flex', gap: 8, alignSelf: 'flex-start', alignItems: 'center', color: 'var(--t3)', fontSize: 12, paddingLeft: 28 }}>
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
              fontSize: 11,
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
            fontSize: 12.5,
            outline: 'none',
          }}
          disabled={loading}
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          style={{
            background: input.trim() && !loading ? teacher.color : 'var(--bg3)',
            color: input.trim() && !loading ? '#ffffff' : 'var(--t3)',
            border: 'none',
            borderRadius: '50%',
            width: 34,
            height: 34,
            cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 14,
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
      <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
        <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
        {aiState !== 'idle' && (
          <div style={{
            position: 'absolute', top: 8, right: 8, fontSize: 9, fontWeight: 700,
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
          <span className="mentor-emoji" style={{ fontSize: '28px', marginRight: '4px' }}>{teacher.emoji}</span>
          <div>
            <p className="mentor-name" style={{ fontSize: '14px' }}>{teacher.name}</p>
            <p className="mentor-subtitle" style={{ fontSize: '10.5px' }}>Career Mentor {speaking ? '🔊' : ''} · {mlRecs.length > 0 ? `${mlRecs.length} ML tips` : 'AI powered'}</p>
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
              style={{ fontSize: 9, background: 'rgba(255,255,255,0.15)', padding: '2px 6px', borderRadius: 4, color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}
              title="Voice lock active (Synced to Supabase). Click to reset."
            >
              🔐 Voice Lock ({voicePrint?.avgPitch || voiceFreq}Hz)
            </span>
          ) : (
            <span 
              onClick={startVoiceRegistration}
              style={{ fontSize: 9, background: isRecordingVoice ? 'var(--coral)' : 'rgba(255,255,255,0.2)', padding: '2px 6px', borderRadius: 4, color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}
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
            <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
            {aiState !== 'idle' && (
              <div style={{
                position: 'absolute', top: 8, right: 8, fontSize: 9, fontWeight: 700,
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
            <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
            {aiState !== 'idle' && (
              <div style={{
                position: 'absolute', top: 8, right: 8, fontSize: 9, fontWeight: 700,
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
