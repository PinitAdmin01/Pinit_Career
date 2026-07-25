/**
 * Unified Text-to-Speech Utility for PinIT Career OS
 * Runs local neural network engines directly on the main thread for Incognito compatibility.
 */

// ── Voice Mappings ──────────────────────────────────────────────────────────
const KOKORO_VOICE_MAP: Record<string, string> = {
  // Mentors (2)
  priya:    'af_heart',   // Warm, sweet US Female (Career Mentor)
  anish:    'am_liam',    // Clear, friendly US Male (Career Mentor)

  // Teachers (4)
  kashyap:  'am_fenrir',   // Clean US Male (matching sora.glb)
  karthic:  'am_karthic',  // Professional US Male (matching sora.glb)
  maya:     'bf_emma',     // Professional UK Female (matching yuki.glb)
  divya:    'af_nicole',   // Creative US Female (matching mika.glb)
  
  // Aliases & Variations
  'ms. maya':     'bf_emma',
  'ms. divya':    'af_nicole',
  'ms. priya':    'af_heart',
  'kashyap sir':  'am_fenrir',
  'karthic sir':  'am_karthic',
  
  // Legacy Teachers / Fallbacks
  aisha:    'af_sky',     // Friendly US Female
  rohan:    'am_fenrir',  // Clean US Male

  // Interviewers (7)
  vikram:   'bm_lewis',   // Serious UK Male (Strict & Time-conscious)
  shalini:  'bf_isabella',// Professional UK Female (Silent Observer)
  aditya:   'am_adam',    // Wise US Male (System Design Purist)
  neha:     'af_bella',   // Energetic US Female (High-Stress Driller)
  rajesh:   'am_liam',    // Friendly US Male (Legacy Defender)
  sneha:    'af_sarah',   // Warm, socratic US Female (Empathy-First Socratic)
  abhijit:  'bm_george',  // UK Male (Bored Executive)
};

const KITTEN_VOICE_MAP: Record<string, string> = {
  // Mentors (2)
  priya:    'Bella',
  anish:    'Hugo',

  // Teachers (4)
  kashyap:  'Jasper',
  karthic:  'Bruno',
  maya:     'Luna',
  divya:    'Rosie',
  
  // Legacy Teachers / Fallbacks
  aisha:    'Luna',
  rohan:    'Jasper',

  // Interviewers (7)
  vikram:   'Bruno',
  shalini:  'Luna',
  aditya:   'Hugo',
  neha:     'Kiki',
  rajesh:   'Leo',
  sneha:    'Bella',
  abhijit:  'Jasper',
};

// ── Active audio references ──────────────────────────────────────────────────
let activeAudio: HTMLAudioElement | null = null;
let globalAudioCtx: AudioContext | null = null;
let activeSource: AudioBufferSourceNode | null = null;
let activeUtterance: SpeechSynthesisUtterance | null = null;

function getAudioContext(sampleRate = 24000): AudioContext {
  if (typeof window === 'undefined') {
    throw new Error('Web Audio not available server-side');
  }
  if (!globalAudioCtx) {
    globalAudioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate });
  }
  if (globalAudioCtx.state === 'suspended') {
    globalAudioCtx.resume().catch(() => {});
  }
  return globalAudioCtx;
}

// ── Preloaded Speech Cache ───────────────────────────────────────────────────
interface PreloadedAudio {
  text: string;
  teacherId: string;
  buffer: Float32Array;
  sampleRate: number;
}
let preloadedAudio: PreloadedAudio | null = null;

/**
 * Post-processes the input text to inject natural pauses (commas, ellipses)
 * and pacing hints that make local neural TTS (Kokoro/Kitten) sound highly human and realistic.
 */
export function enhanceTextIntonation(text: string): string {
  let enhanced = text;

  // Add pauses before conjunctions to make it sound conversational and natural
  enhanced = enhanced.replace(/\b(but|because|although|however|therefore)\b/gi, ', $1');
  
  // Replace double hyphens or colons with natural conversational pauses
  enhanced = enhanced.replace(/\s*--\s*/g, '... ');
  enhanced = enhanced.replace(/:\s+/g, '... ');

  // Clean up any double punctuation errors
  enhanced = enhanced.replace(/,\s*,/g, ',');
  enhanced = enhanced.replace(/\.\.\.\s*\./g, '...');
  
  return enhanced;
}

export function preloadTTS() {
  // No-op: Render Cloud backend is always preloaded
}

// Cache Map to store preloaded audio buffers for multiple upcoming dialogues
interface CachedSpeech {
  buffer: Float32Array;
  sampleRate: number;
  teacherId: string;
}

const preloadedAudioCacheMap = new Map<string, CachedSpeech>();

export function getCleanCacheKey(text: string): string {
  let sanitized = text
    .replace(/^\[.*?\]:\s?/, '')
    .replace(/^[a-zA-Z\s\.\-]+:\s?/, '');

  sanitized = sanitized
    .replace(/\*.*?\*/g, '')
    .replace(/\[.*?\]/g, '')
    .replace(/\(.*?\)/g, '');

  return sanitized.replace(/[✦🤖👋🎯💼🔐🔬⚡✨✓⬡*`_#]/g, '').trim().toLowerCase();
}

function addToCache(cleanKey: string, val: CachedSpeech) {
  if (preloadedAudioCacheMap.size >= 25) {
    const firstKey = preloadedAudioCacheMap.keys().next().value;
    if (firstKey) preloadedAudioCacheMap.delete(firstKey);
  }
  preloadedAudioCacheMap.set(cleanKey, val);
}

/**
 * Pre-generates the audio buffer for the specified dialogue text silently in the background and stores it in cache Map.
 */
export async function preloadNextSpeech(text: string, teacherId: string, difficulty?: 'easy' | 'normal' | 'hard') {
  if (!text) return;
  try {
    const cleanKey = getCleanCacheKey(text);
    if (!cleanKey) return;
    if (preloadedAudioCacheMap.has(cleanKey)) return;

    const enhancedText = enhanceTextIntonation(cleanKey);
    const vibe = detectVibe(enhancedText);

    console.log(`[TTS] Preloading speech in background for key: "${cleanKey.substring(0, 35)}..."`);
    const res = await generateTTSAudio(enhancedText, teacherId, vibe, difficulty);
    addToCache(cleanKey, { buffer: res.buffer, sampleRate: res.sampleRate, teacherId });
    console.log(`[TTS] Preload complete for key: "${cleanKey.substring(0, 35)}..."`);
  } catch (err: any) {
    console.warn("[TTS] Background preloading failed:", err.message);
  }
}

/**
 * Preloads multiple dialogue options concurrently.
 */
export async function preloadMultipleSpeeches(texts: string[], teacherId: string, difficulty?: 'easy' | 'normal' | 'hard') {
  if (!texts || texts.length === 0) return;
  console.log(`[TTS] Preloading ${texts.length} speech variations in background...`);
  texts.forEach(t => {
    preloadNextSpeech(t, teacherId, difficulty).catch(() => {});
  });
}

let isNeuralReady = true;
let currentSpeechId = 0;

export function stopSpeaking() {
  currentSpeechId++;
  if (activeAudio) {
    try { activeAudio.pause(); } catch {}
    activeAudio = null;
  }
  if (activeSource) {
    try { activeSource.stop(); } catch {}
    activeSource = null;
  }
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    try { window.speechSynthesis.cancel(); } catch {}
  }
  activeUtterance = null;
}

export function detectVibe(text: string): 'happy' | 'motivational' | 'teaching' | 'neutral' {
  const lower = text.toLowerCase();
  
  if (/\b(congrats|congratulations|great|awesome|excellent|brilliant|correct|success|perfect|wonderful|wow|hurray|nice job|spot on|superb|well done|outstanding|delighted|perfectly)\b/i.test(lower)) {
    return 'happy';
  }
  if (/\b(try again|incorrect|wrong|mistake|no worries|don't worry|keep going|almost|close but|let's fix|correcting|no problem|improve|don't give up|never give up|challenge|fail|failure|bad results|difficult)\b/i.test(lower)) {
    return 'motivational';
  }
  if (/\b(define|definition|explanation|concept|learn|tutorial|study|exercise|syntax|code|theory|fundamental|architect|module|lesson|training|teaching)\b/i.test(lower)) {
    return 'teaching';
  }
  return 'neutral';
}

function playCloudAudioUrl(url: string, onStart: () => void, onEnd: () => void) {
  if (activeAudio) {
    try { activeAudio.pause(); } catch {}
  }
  const audio = new Audio(url);
  activeAudio = audio;
  audio.onplay = () => onStart();
  audio.onended = () => {
    activeAudio = null;
    onEnd();
  };
  audio.onerror = () => {
    activeAudio = null;
    onEnd();
  };
  audio.play().catch(() => {
    activeAudio = null;
    onEnd();
  });
}

function fallbackWebSpeech(
  cleanText: string,
  teacherId: string,
  onStart: () => void,
  onEnd: () => void,
  vibe: 'happy' | 'motivational' | 'teaching' | 'neutral' = 'neutral',
  speechId = currentSpeechId,
  difficulty?: 'easy' | 'normal' | 'hard'
) {
  if (speechId !== currentSpeechId) return;
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    console.log('[TTS] Simulating audio timing to protect system resources (no speech synth)...');
    if (speechId === currentSpeechId) onStart();
    const estimatedDuration = Math.min(6000, Math.max(1800, cleanText.length * 48));
    setTimeout(() => {
      if (speechId === currentSpeechId) onEnd();
    }, estimatedDuration);
    return;
  }

  // Cancel any currently speaking utterances
  try {
    window.speechSynthesis.cancel();
  } catch {}

  const utterance = new SpeechSynthesisUtterance(cleanText);

  // Set up events
  utterance.onstart = () => {
    if (speechId === currentSpeechId) onStart();
  };
  utterance.onend = () => {
    if (speechId === currentSpeechId) onEnd();
  };
  utterance.onerror = () => {
    if (speechId === currentSpeechId) onEnd();
  };

  const speak = () => {
    if (speechId !== currentSpeechId) return;
    const voices = window.speechSynthesis.getVoices();
    const isFemale = !['anish', 'rohan', 'vikram', 'aditya', 'rajesh', 'abhijit'].includes(teacherId.toLowerCase());
    
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

    // easy -> slow/smooth (0.85); hard -> fast/rough (1.25); normal -> default based on vibe
    let targetRate = difficulty === 'easy' ? 0.85 : difficulty === 'hard' ? 1.25 : (vibe === 'happy' ? 1.05 : vibe === 'motivational' ? 0.95 : 1.0);
    utterance.rate = targetRate;
    utterance.pitch = isFemale ? 1.1 : 0.95;

    if (speechId === currentSpeechId) {
      window.speechSynthesis.speak(utterance);
    }
  };

  if (window.speechSynthesis.getVoices().length === 0) {
    window.speechSynthesis.onvoiceschanged = speak;
  } else {
    speak();
  }
}

export async function generateTTSAudio(text: string, teacherId: string, vibe = 'neutral', difficulty?: 'easy' | 'normal' | 'hard'): Promise<{ buffer: Float32Array; sampleRate: number }> {
  // easy -> smooth/patient (0.95 speed); hard -> aggressive/rapid (1.3 speed); normal -> default (1.1 speed)
  const targetSpeed = difficulty === 'easy' ? 0.95 : difficulty === 'hard' ? 1.3 : 1.1;

  const response = await fetch('https://pinit-backend-v8pd.onrender.com/api/tts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text,
      voice: KOKORO_VOICE_MAP[teacherId.toLowerCase()] || 'af_heart',
      speed: targetSpeed
    })
  });

  if (!response.ok) {
    throw new Error(`Render TTS server returned status ${response.status}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const ctx = getAudioContext();
  const audioBuf = await ctx.decodeAudioData(arrayBuffer);
  const buffer = audioBuf.getChannelData(0);
  return { buffer, sampleRate: audioBuf.sampleRate };
}

export async function speakWithAvatar(
  text: string,
  teacherId: string,
  onStart: () => void,
  onEnd: () => void,
  isMuted = false,
  useNeural = true,
  difficulty?: 'easy' | 'normal' | 'hard'
) {
  stopSpeaking();
  const mySpeechId = currentSpeechId; // stopSpeaking() already incremented currentSpeechId!
  if (isMuted || !text) return;

  let sanitized = text
    .replace(/^\[.*?\]:\s?/, '')
    .replace(/^[a-zA-Z\s\.\-]+:\s?/, '');

  sanitized = sanitized
    .replace(/\*.*?\*/g, '')
    .replace(/\[.*?\]/g, '')
    .replace(/\(.*?\)/g, '');

  const cleanText = sanitized.replace(/[✦🤖👋🎯💼🔐🔬⚡✨✓⬡*`_#]/g, '').trim();
  if (!cleanText) return;

  const enhancedText = enhanceTextIntonation(cleanText);
  const vibe = detectVibe(enhancedText);

  // Play immediately if we have a match in our preloaded cache Map!
  const cleanKey = getCleanCacheKey(text);
  if (useNeural && isNeuralReady && preloadedAudioCacheMap.has(cleanKey)) {
    const match = preloadedAudioCacheMap.get(cleanKey);
    if (match && match.teacherId === teacherId) {
      if (mySpeechId !== currentSpeechId) return;
      try {
        console.log(`[TTS] Playing instantly from cache Map! 🚀 Key: "${cleanKey.substring(0, 35)}..."`);
        const { buffer, sampleRate } = match;
        preloadedAudioCacheMap.delete(cleanKey); // Consume cache once played
        
        const ctx = getAudioContext(sampleRate);
        const audioBuf = ctx.createBuffer(1, buffer.length, sampleRate);
        audioBuf.copyToChannel(buffer as any, 0);

        const source = ctx.createBufferSource();
        activeSource = source;
        source.buffer = audioBuf;

        source.connect(ctx.destination);
        source.onended = () => {
          if (activeSource === source) activeSource = null;
          if (mySpeechId === currentSpeechId) onEnd();
        };
        if (mySpeechId === currentSpeechId) onStart();
        source.start(0);
        return;
      } catch (err: any) {
        console.warn('[TTS] Failed to play from preload cache map:', err.message);
      }
    }
  }

  // Local Web Worker (Kokoro / KittenTTS Nano) - Offline, browser-native execution
  if (useNeural && isNeuralReady) {
    try {
      // Race worker generation against a 10.0s timeout to prevent hanging the UI
      const workerPromise = generateTTSAudio(enhancedText, teacherId, vibe, difficulty);
      const timeoutPromise = new Promise<{ buffer: Float32Array; sampleRate: number }>((_, reject) =>
        setTimeout(() => reject(new Error('Neural TTS timeout')), 10000)
      );

      const { buffer, sampleRate } = await Promise.race([workerPromise, timeoutPromise]);
      if (mySpeechId !== currentSpeechId) {
        console.log("[TTS] Discarding superseded voice response.");
        return;
      }

      const ctx = getAudioContext(sampleRate);
      const audioBuf = ctx.createBuffer(1, buffer.length, sampleRate);
      audioBuf.copyToChannel(buffer as any, 0);

      const source = ctx.createBufferSource();
      activeSource = source;
      source.buffer = audioBuf;

      source.connect(ctx.destination);
      source.onended = () => {
        if (activeSource === source) activeSource = null;
        if (mySpeechId === currentSpeechId) onEnd();
      };
      if (mySpeechId === currentSpeechId) onStart();
      source.start(0);
      return;
    } catch (err: any) {
      console.warn('[TTS] Render Cloud TTS generation failed:', err.message);
    }
  }

  // If neural speech fails or is not ready, trigger onEnd to prevent locking UI states
  if (mySpeechId === currentSpeechId) {
    onEnd();
  }
}

// Auto-initialize background worker & preload TTS engine immediately on script load
if (typeof window !== 'undefined') {
  preloadTTS();
}

