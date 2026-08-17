/**
 * PinIT Voice Cache — Unified 4-Tier Client
 *
 * ┌────────────────────────────────────────────────────────────┐
 * │  Tier 0 — Static pre-rendered audio  (0ms, /audio/*)      │
 * │  Tier 1 — Browser IndexedDB          (~1ms, offline)       │
 * │  Tier 2 — Redis via /api/tts route   (1–5ms, server)       │
 * │  Tier 3 — Kokoro generation           (1–4s, on miss)      │
 * └────────────────────────────────────────────────────────────┘
 *
 * Usage:
 *   import { playCachedSpeech, computeVoiceHash } from '@/lib/voiceCache';
 *   await playCachedSpeech({ text: "Hello", voice: "af_heart" });
 */

// ── Constants ─────────────────────────────────────────────────────────────────
// DB_NAME and STORE_NAME are imported from voiceCacheDB.ts (single source of truth).
// Do NOT redefine them here.
import { computeVoiceCacheKey, DB_NAME, STORE_NAME } from './voiceCacheDB';



export interface VoiceCacheRequest {
  text:        string;
  voice:       string;           // Kokoro voice ID or mentor name
  language?:   string;           // 'en' | 'hi' | 'kn' | 'ta' | 'te'
  speed?:      number;           // 0.5–2.0, default 1.0
  emotion?:    string;           // 'happy' | 'motivational' | 'teaching' | 'neutral'
  context?:    string;           // 'avatar' | 'lesson' | 'interview' | 'mission' | 'gd'
  staticFile?: string;           // Optional: e.g. '/audio/priya/step0.wav'
}

export interface VoiceCacheResult {
  audio:       HTMLAudioElement;
  cacheStatus: 'STATIC' | 'IDB_HIT' | 'REDIS_HIT' | 'CDN_HIT' | 'GENERATED';
  cacheKey:    string;
  engine?:     string;
  duration?:   number;
}


// ── SHA-256 Hash — delegates to the canonical implementation in voiceCacheDB.ts ──
// This ensures frontend and backend always produce the same key for the same input.

/**
 * Computes a deterministic SHA-256 voice cache key.
 * Delegates to computeVoiceCacheKey (voiceCacheDB.ts) — single source of truth.
 * Extra params (language, emotion, version, sampleRate) accepted for call-site
 * compatibility but the canonical key is voice + speed + normalized_text.
 */
export async function computeVoiceHash(
  text:        string,
  voice:       string,
  _language  = 'en',
  speed      = 1.0,
  _emotion   = 'neutral',
  _version   = 'pinit_v2',
  _sampleRate = 24000,
): Promise<string> {
  return computeVoiceCacheKey(text, voice, speed);
}


// ── IndexedDB Cache (Tier 1) ───────────────────────────────────────────────────

function openIDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror   = () => reject(req.error);
  });
}

async function getFromIDB(key: string): Promise<Blob | null> {
  try {
    const db = await openIDB();
    return new Promise(resolve => {
      const tx    = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req   = store.get(key);
      req.onsuccess = () => resolve((req.result as Blob) || null);
      req.onerror   = () => resolve(null);
    });
  } catch {
    return null;
  }
}

async function saveToIDB(key: string, blob: Blob): Promise<void> {
  try {
    const db = await openIDB();
    const tx  = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(blob, key);
  } catch {
    // Non-critical — storage may be full
  }
}

export async function clearIDBCache(): Promise<void> {
  try {
    const db = await openIDB();
    const tx  = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).clear();
  } catch {}
}

// ── Static Pre-rendered Audio Map (Tier 0) ────────────────────────────────────
// Add more entries as pre-rendered WAV files are generated.

const STATIC_AUDIO_MAP: Record<string, string> = {
  'welcome to your personal diagnostic assessment first are you a college student a fresh graduate or a working professional': '/audio/priya/step0.wav',
  'got it next what is your dream job do you want to build websites work with clouds or build software':                       '/audio/priya/step1.wav',
  'nice choice why did you join today are you looking for a job wanting to learn new skills or preparing for an interview':     '/audio/priya/step2.wav',
  'understood next question how much coding experience do you have are you a beginner intermediate or advanced coder':          '/audio/priya/step3.wav',
  'understood how do you prefer to learn do you like reading articles watching videos or writing code hands on':               '/audio/priya/step4.wav',
  'last question how many hours per week can you dedicate to learning five hours ten hours or more':                           '/audio/priya/step5.wav',
  'fantastic next let s load your identity discovery slides to establish your cognitive styles':                               '/audio/priya/step6.wav',
};

function normalizeText(text: string): string {
  return text.trim().toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ');
}

function lookupStatic(text: string): string | null {
  const key = normalizeText(text);
  return STATIC_AUDIO_MAP[key] ?? null;
}

// ── Audio Playback Helper ─────────────────────────────────────────────────────

function blobToAudio(blob: Blob): HTMLAudioElement {
  const url   = URL.createObjectURL(blob);
  const audio = new Audio(url);
  audio.onended = () => URL.revokeObjectURL(url);
  return audio;
}

function urlToAudio(url: string): HTMLAudioElement {
  return new Audio(url);
}

// ── Sentence-Level Batch Prefetch ─────────────────────────────────────────────

/**
 * Split text into sentences and prefetch each chunk into IndexedDB.
 * Call before a lesson begins to ensure near-instant sequential playback.
 */
export async function prefetchParagraph(
  text:    string,
  voice:   string,
  options: Partial<VoiceCacheRequest> = {},
): Promise<{ prefetched: number; cached: number }> {
  const sentences = splitSentences(text);
  let prefetched = 0;
  let cached     = 0;

  for (const sentence of sentences) {
    const hash = await computeVoiceHash(
      sentence,
      voice,
      options.language ?? 'en',
      options.speed    ?? 1.0,
      options.emotion  ?? 'neutral',
    );

    const existing = await getFromIDB(hash);
    if (existing) {
      cached++;
      continue;
    }

    try {
      const res = await fetch('/api/tts', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text:     sentence,
          voice,
          language: options.language ?? 'en',
          speed:    options.speed    ?? 1.0,
          emotion:  options.emotion  ?? 'neutral',
          context:  options.context  ?? 'lesson',
          cacheKey: hash,
        }),
        signal: AbortSignal.timeout(8000),
      });
      if (res.ok) {
        const blob = await res.blob();
        await saveToIDB(hash, blob);
        prefetched++;
      }
    } catch {
      // Background prefetch — silently ignore failures
    }
  }

  return { prefetched, cached };
}

function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(Boolean);
}

// ── Main Entry Point ──────────────────────────────────────────────────────────

let _activeCacheAudio: HTMLAudioElement | null = null;

export function stopCachedSpeech(): void {
  if (_activeCacheAudio) {
    try { _activeCacheAudio.pause(); } catch {}
    _activeCacheAudio = null;
  }
}

/**
 * playCachedSpeech — the single entry point for all TTS audio in PinIT.
 *
 * Checks all 4 tiers in order and plays audio from the first available tier.
 * Automatically saves newly generated audio to IndexedDB for future instant replay.
 *
 * @returns VoiceCacheResult with the audio element and cache status metadata
 */
export async function playCachedSpeech(
  req: VoiceCacheRequest,
): Promise<VoiceCacheResult> {
  const {
    text,
    voice,
    language  = 'en',
    speed     = 1.0,
    emotion   = 'neutral',
    context   = 'avatar',
    staticFile,
  } = req;

  if (!text?.trim()) throw new Error('Text cannot be empty.');

  // ── Tier 0: Static pre-rendered audio ────────────────────────────────────
  const staticPath = staticFile ?? lookupStatic(text);
  if (staticPath) {
    const audio = urlToAudio(staticPath);
    _activeCacheAudio = audio;
    return { audio, cacheStatus: 'STATIC', cacheKey: staticPath };
  }

  // Compute hash for Tier 1–3
  const cacheKey = await computeVoiceHash(text, voice, language, speed, emotion);

  // ── Tier 1: Browser IndexedDB ─────────────────────────────────────────────
  const idbBlob = await getFromIDB(cacheKey);
  if (idbBlob) {
    const audio = blobToAudio(idbBlob);
    _activeCacheAudio = audio;
    return { audio, cacheStatus: 'IDB_HIT', cacheKey };
  }

  // ── Tier 2 + 3: Next.js route → FastAPI (Redis → Kokoro) ─────────────────
  const res = await fetch('/api/tts', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text,
      voice,
      language,
      speed,
      emotion,
      context,
      cacheKey,   // Hint to skip recomputing server-side when possible
    }),
    signal: AbortSignal.timeout(10000),
  });

  if (!res.ok) {
    throw new Error(`TTS request failed: ${res.status} ${res.statusText}`);
  }

  const blob        = await res.blob();
  const cacheStatus = (res.headers.get('X-Cache-Status') ?? 'GENERATED') as VoiceCacheResult['cacheStatus'];
  const engine      = res.headers.get('X-Engine') ?? undefined;
  const duration    = parseFloat(res.headers.get('X-Duration') ?? '0') || undefined;

  // Save to IndexedDB for instant replay next time
  await saveToIDB(cacheKey, blob);

  const audio = blobToAudio(blob);
  _activeCacheAudio = audio;

  return { audio, cacheStatus, cacheKey, engine, duration };
}

// ── Cache Stats (from backend) ────────────────────────────────────────────────

export async function fetchCacheStats(): Promise<Record<string, unknown>> {
  try {
    // Correct path: /api/cache/stats (not /api/cache?action=stats)
    const res = await fetch('/api/cache/stats');
    return res.ok ? res.json() : {};
  } catch {
    return {};
  }
}

export async function checkCacheKey(key: string): Promise<boolean> {
  try {
    // Correct path: /api/cache/hash?key=... (not /api/cache?action=hash&key=...)
    const res  = await fetch(`/api/cache/hash?key=${encodeURIComponent(key)}`);
    const data = await res.json();
    return data?.exists === true && data?.file_exists === true;
  } catch {
    return false;
  }
}
