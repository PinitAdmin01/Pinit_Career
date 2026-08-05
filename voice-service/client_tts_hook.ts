/**
 * PinIT Client-Side Voice TTS Hook (IndexedDB Caching Layer)
 * 
 * Safe isolated client hook that manages local browser audio caching
 * and proxies cache misses to the unified /api/tts endpoint.
 */

const DB_NAME = "PinIT_VoiceCacheDB";
const STORE_NAME = "audio_blobs";
const MODEL_VERSION = "v1.0";

/**
 * Text Normalization Engine
 * Strips punctuation, lowers case, collapses spaces.
 */
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s]|_/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Compute SHA-256 hash in browser
 */
export async function computeHash(text: string, voice: string): Promise<string> {
  const normalized = normalizeText(text);
  const rawPayload = `${normalized}:${voice}:${MODEL_VERSION}`;
  const encoder = new TextEncoder();
  const data = encoder.encode(rawPayload);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Open IndexedDB Database
 */
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Get Audio Blob from Local IndexedDB Cache
 */
async function getCachedAudio(cacheKey: string): Promise<Blob | null> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(cacheKey);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });
  } catch (err) {
    console.warn("[VoiceCache] Local read error:", err);
    return null;
  }
}

/**
 * Save Audio Blob to Local IndexedDB Cache
 */
async function saveCachedAudio(cacheKey: string, blob: Blob): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    store.put(blob, cacheKey);
  } catch (err) {
    console.warn("[VoiceCache] Local write error:", err);
  }
}

/**
 * Primary Voice Execution Function
 * Play speech using local cache or API fallback.
 */
export async function playSpeech(text: string, voice: string = "en-us-nicole"): Promise<HTMLAudioElement> {
  if (!text || !text.trim()) {
    throw new Error("Text parameter cannot be empty.");
  }

  const cacheKey = await computeHash(text, voice);

  // 1. Tier 1 Check: Browser IndexedDB Cache
  const cachedBlob = await getCachedAudio(cacheKey);
  if (cachedBlob) {
    console.log(`[VoiceCache] Tier 1 Hit! Playing from browser storage (${cacheKey.slice(0, 8)}...)`);
    const audioUrl = URL.createObjectURL(cachedBlob);
    const audio = new Audio(audioUrl);
    audio.play();
    return audio;
  }

  // 2. Tier 2/3 Fallback: Request from unified /api/tts endpoint
  console.log(`[VoiceCache] Tier 1 Miss. Fetching from /api/tts (${cacheKey.slice(0, 8)}...)`);
  const response = await fetch("/api/tts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, voice, cacheKey }),
  });

  if (!response.ok) {
    throw new Error(`Voice server error: ${response.statusText}`);
  }

  const audioBlob = await response.blob();

  // Save to local cache for instant replay next time
  await saveCachedAudio(cacheKey, audioBlob);

  const audioUrl = URL.createObjectURL(audioBlob);
  const audio = new Audio(audioUrl);
  audio.play();
  return audio;
}
