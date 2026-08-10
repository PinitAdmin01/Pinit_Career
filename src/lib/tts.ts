// TTS Library & Audio Engine (WebSpeech Native API + Persona Vocal Signatures)
import { synthesizeVoice } from "./smartVoiceRouter";
let currentSpeechId = 0;
let activeSource: AudioBufferSourceNode | null = null;
let isNeuralReady = true;

const preloadedAudioCacheMap = new Map<string, { buffer: Float32Array; sampleRate: number; teacherId: string }>();

function getAudioContext(sampleRate = 24000): AudioContext {
  if (typeof window === 'undefined') return {} as any;
  const win = window as any;
  if (!win._sharedAudioCtx || win._sharedAudioCtx.state === 'closed') {
    win._sharedAudioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate });
  }
  if (win._sharedAudioCtx.state === 'suspended') {
    win._sharedAudioCtx.resume().catch(() => {});
  }
  return win._sharedAudioCtx;
}

export function stopSpeaking() {
  currentSpeechId++;
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    try {
      window.speechSynthesis.cancel();
    } catch {}
  }
  if (activeSource) {
    try {
      activeSource.stop();
      activeSource.disconnect();
    } catch {}
    activeSource = null;
  }
}

const KOKORO_VOICE_MAP: Record<string, string> = {
  kashyap:  'am_adam',
  divya:    'af_bella',
  priya:    'af_nicole',
  maya:     'af_sarah',
  anish:    'am_michael',
  karthic:  'am_karthic',
  vikram:   'am_echo',
  shalini:  'af_sky',
  aditya:   'am_fenrir',
  neha:     'af_river',
  rajesh:   'am_onyx',
  abhijit:  'am_eric',
  sneha:    'af_jessica',
  rohan:    'am_liam',
  aisha:    'af_aoede'
};

const PERSONA_VOCAL_MATRIX: Record<string, { pitch: number; rateMultiplier: number }> = {
  kashyap:  { pitch: 0.88, rateMultiplier: 1.10 },
  divya:    { pitch: 1.15, rateMultiplier: 1.20 },
  priya:    { pitch: 1.08, rateMultiplier: 1.15 },
  maya:     { pitch: 0.96, rateMultiplier: 1.05 },
  anish:    { pitch: 1.02, rateMultiplier: 1.14 },
  karthic:  { pitch: 0.92, rateMultiplier: 1.18 },
  vikram:   { pitch: 0.84, rateMultiplier: 1.08 },
  aditya:   { pitch: 1.06, rateMultiplier: 1.22 },
  neha:     { pitch: 1.12, rateMultiplier: 1.18 },
  shalini:  { pitch: 1.10, rateMultiplier: 1.12 },
  rajesh:   { pitch: 0.90, rateMultiplier: 1.08 },
  abhijit:  { pitch: 0.86, rateMultiplier: 1.05 },
  sneha:    { pitch: 1.14, rateMultiplier: 1.18 },
  rohan:    { pitch: 0.89, rateMultiplier: 1.15 },
  aisha:    { pitch: 1.05, rateMultiplier: 1.10 }
};

function enhanceTextIntonation(text: string): string {
  let enhanced = text;
  enhanced = enhanced.replace(/\b(important|critical|essential|key|must|danger|catch)\b/gi, '$1!');
  enhanced = enhanced.replace(/\?/g, '?');
  return enhanced;
}

function detectVibe(text: string): 'happy' | 'motivational' | 'teaching' | 'neutral' {
  const lower = text.toLowerCase();
  if (lower.includes('great') || lower.includes('awesome') || lower.includes('excellent') || lower.includes('fantastic')) return 'happy';
  if (lower.includes('let\'s') || lower.includes('together') || lower.includes('challenge') || lower.includes('build')) return 'motivational';
  if (lower.includes('because') || lower.includes('concept') || lower.includes('means') || lower.includes('step')) return 'teaching';
  return 'neutral';
}

function getCleanCacheKey(text: string): string {
  let sanitized = text
    .replace(/^\[.*?\]:\s?/, '')
    .replace(/^[a-zA-Z\s\.\-]+:\s?/, '')
    .replace(/\*.*?\*/g, '')
    .replace(/\[.*?\]/g, '')
    .replace(/\(.*?\)/g, '');
  return sanitized.replace(/[✦🤖👋🎯💼🔐🔬⚡✨✓⬡*`_#]/g, '').trim();
}

function fallbackWebSpeech(
  cleanText: string,
  teacherId: string,
  onStart: () => void,
  onEnd: () => void,
  vibe: 'happy' | 'motivational' | 'teaching' | 'neutral' = 'neutral',
  speechId = currentSpeechId,
  difficulty?: 'easy' | 'normal' | 'hard',
  speedMultiplier = 1.0,
  maxDurationMs = 6800
) {
  if (speechId !== currentSpeechId) return;
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    if (speechId === currentSpeechId) onStart();
    const estimatedDuration = Math.min(maxDurationMs, Math.max(1800, cleanText.length * 35));
    setTimeout(() => {
      if (speechId === currentSpeechId) onEnd();
    }, estimatedDuration);
    return;
  }

  try {
    window.speechSynthesis.cancel();
  } catch {}

  const utterance = new SpeechSynthesisUtterance(cleanText);
  let maxDurationTimer: any = null;

  const cleanupAndEnd = () => {
    if (maxDurationTimer) clearTimeout(maxDurationTimer);
    if (speechId === currentSpeechId) {
      try { window.speechSynthesis.cancel(); } catch {}
      onEnd();
    }
  };

  utterance.onstart = () => {
    if (speechId === currentSpeechId) {
      onStart();
      maxDurationTimer = setTimeout(() => {
        cleanupAndEnd();
      }, maxDurationMs);
    }
  };
  utterance.onend = () => {
    cleanupAndEnd();
  };
  utterance.onerror = () => {
    cleanupAndEnd();
  };

  const speak = () => {
    if (speechId !== currentSpeechId) return;
    const voices = window.speechSynthesis.getVoices();
    const isFemale = !['anish', 'rohan', 'vikram', 'aditya', 'rajesh', 'abhijit', 'kashyap', 'karthic'].includes(teacherId.toLowerCase());
    
    let voice = voices.find(v => 
      v.lang.startsWith('en') && 
      (isFemale ? v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('zira') || v.name.toLowerCase().includes('samantha') || v.name.toLowerCase().includes('google us') : 
                 v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('david') || v.name.toLowerCase().includes('google uk'))
    );

    if (!voice) {
      voice = voices.find(v => v.lang.startsWith('en'));
    }

    if (voice) {
      utterance.voice = voice;
    }

    const vocalPersona = PERSONA_VOCAL_MATRIX[teacherId.toLowerCase()] || { pitch: isFemale ? 1.1 : 0.95, rateMultiplier: 1.15 };

    let targetRate = (difficulty === 'easy' ? 1.05 : difficulty === 'hard' ? 1.35 : 1.18) * speedMultiplier * vocalPersona.rateMultiplier;
    utterance.rate = targetRate;
    utterance.pitch = vocalPersona.pitch;

    if (speechId === currentSpeechId) {
      try {
        window.speechSynthesis.resume();
      } catch {}
      setTimeout(() => {
        if (speechId === currentSpeechId) {
          try { window.speechSynthesis.resume(); } catch {}
          window.speechSynthesis.speak(utterance);
        }
      }, 30);
    }
  };

  if (window.speechSynthesis.getVoices().length === 0) {
    let spoken = false;
    let timer: any = null;
    const safeSpeak = () => {
      if (spoken) return;
      spoken = true;
      if (timer) clearTimeout(timer);
      try { window.speechSynthesis.removeEventListener('voiceschanged', safeSpeak); } catch {}
      speak();
    };
    window.speechSynthesis.addEventListener('voiceschanged', safeSpeak, { once: true });
    timer = setTimeout(safeSpeak, 150);
  } else {
    speak();
  }
}

export async function generateTTSAudio(text: string, teacherId: string, vibe = 'neutral', difficulty?: 'easy' | 'normal' | 'hard', speedMultiplier = 1.0): Promise<{ buffer: Float32Array; sampleRate: number }> {
  const baseSpeed = difficulty === 'easy' ? 0.95 : difficulty === 'hard' ? 1.3 : 1.1;
  const targetSpeed = baseSpeed * speedMultiplier;

  const voice = KOKORO_VOICE_MAP[teacherId.toLowerCase()] || 'af_heart';
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 2500);

  try {
    const response = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        voice,
        language: 'en',
        speed: targetSpeed,
        emotion: vibe,
        context: 'avatar',
        version: 'v2.0',
      }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`TTS route returned status ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const ctx = getAudioContext();
    const audioBuf = await ctx.decodeAudioData(arrayBuffer);
    const buffer = audioBuf.getChannelData(0);
    return { buffer, sampleRate: audioBuf.sampleRate };
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

const STATIC_AUDIO_MAPPING: Record<string, string> = {
  "welcome to your personal diagnostic assessment first are you a college student a fresh graduate or a working professional": "step0.wav",
  "got it next what is your dream job do you want to build websites work with clouds or build software": "step1.wav",
  "nice choice why did you join today are you looking for a job wanting to learn new skills or preparing for an interview": "step2.wav",
  "understood next question how much coding experience do you have are you a beginner intermediate or advanced coder": "step3.wav",
  "understood how do you prefer to learn do you like reading articles watching videos or writing code hands on": "step4.wav",
  "last question how many hours per week can you dedicate to learning five hours ten hours or more": "step5.wav",
  "fantastic next let s load your identity discovery slides to establish your cognitive styles": "step6.wav"
};

function normalizeKeyForStatic(key: string): string {
  return key.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ').trim();
}

export async function speakWithAvatar(
  text: string,
  teacherId: string,
  onStart: () => void,
  onEnd: () => void,
  isMuted = false,
  useNeural = true,
  difficulty?: 'easy' | 'normal' | 'hard',
  speedMultiplier = 1.0,
  maxDurationMs = 15000
) {
  stopSpeaking();
  const mySpeechId = currentSpeechId;
  if (isMuted || !text) return;

  let sanitized = text
    .replace(/^\[.*?\]:\s?/, '')
    .replace(/^[a-zA-Z\s\.\-]+:\s?/, '')
    .replace(/\*.*?\*/g, '')
    .replace(/\[.*?\]/g, '')
    .replace(/\(.*?\)/g, '');

  const cleanText = sanitized.replace(/[✦🤖👋🎯💼🔐🔬⚡✨✓⬡*`_#]/g, '').trim();
  if (!cleanText) return;

  // Calculate dynamic maximum duration based on character count (150ms per character, minimum 12 seconds)
  const dynamicMaxDurationMs = Math.max(maxDurationMs, Math.max(12000, cleanText.length * 150));

  const enhancedText = enhanceTextIntonation(cleanText);
  const vibe = detectVibe(enhancedText);

  // Attempt Smart Hybrid Voice Router (IndexedDB -> WASM -> Cloud FastAPI)
  if (useNeural) {
    try {
      const voice = KOKORO_VOICE_MAP[teacherId.toLowerCase()] || 'af_bella';
      const result = await synthesizeVoice({
        text: cleanText,
        voice,
        speed: speedMultiplier
      });

      if (mySpeechId === currentSpeechId) {
        const ctx = getAudioContext();
        const audioBuf = await ctx.decodeAudioData(result.audioBuffer.slice(0));
        
        const source = ctx.createBufferSource();
        source.buffer = audioBuf;
        source.connect(ctx.destination);
        activeSource = source;

        let maxDurationTimer: ReturnType<typeof setTimeout> | null = null;
        let ended = false;
        const finish = () => {
          if (ended) return;
          ended = true;
          if (maxDurationTimer) clearTimeout(maxDurationTimer);
          if (activeSource === source) activeSource = null;
          if (mySpeechId === currentSpeechId) {
            onEnd();
          }
        };

        source.onended = finish;

        onStart();
        source.start(0);
        maxDurationTimer = setTimeout(() => {
          try { source.stop(); } catch {}
          finish();
        }, dynamicMaxDurationMs);
        return;
      }
    } catch (err) {
      console.warn('[PinIT Voice System] Render Kokoro Server error, activating Natural Human Voice fallback:', err);
      if (mySpeechId === currentSpeechId) {
        fallbackWebSpeech(cleanText, teacherId, onStart, onEnd, vibe, mySpeechId, difficulty, speedMultiplier, dynamicMaxDurationMs);
        return;
      }
    }
  }

  // Tier 2: Instant Native Human Speech Fallback
  if (mySpeechId === currentSpeechId) {
    fallbackWebSpeech(cleanText, teacherId, onStart, onEnd, vibe, mySpeechId, difficulty, speedMultiplier, maxDurationMs);
  }
}

export async function preloadTTS(text?: string, teacherId: string = 'priya') {
  if (typeof window === 'undefined' || !text) return;
  const sanitized = text.replace(/^[a-zA-Z\s\.\-]+:\s?/, '').replace(/[✦🤖👋🎯💼🔐🔬⚡✨✓⬡*`_#]/g, '').trim();
  if (!sanitized) return;

  try {
    const voice = KOKORO_VOICE_MAP[teacherId.toLowerCase()] || 'af_bella';
    await synthesizeVoice({
      text: sanitized,
      voice,
      speed: 1.0
    });
    console.log(`[PinIT Preloader] ⚡ Successfully preloaded Render audio into IndexedDB for "${sanitized.slice(0, 30)}..."`);
  } catch (err) {
    console.warn('[PinIT Preloader] Audio preload deferred:', err);
  }
}

export function preloadNextSpeech(text: string, teacherId: string) {
  preloadTTS(text, teacherId);
}

export function preloadMultipleSpeeches(
  speeches: string[] | Array<{ text: string; teacherId: string }>,
  defaultTeacherId: string = 'priya'
) {
  if (!Array.isArray(speeches)) return;
  speeches.forEach(s => {
    if (typeof s === 'string') {
      preloadTTS(s, defaultTeacherId);
    } else if (s && typeof s === 'object' && s.text) {
      preloadTTS(s.text, s.teacherId || defaultTeacherId);
    }
  });
}
