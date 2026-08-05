/**
 * Client TTS Library with IndexedDB Caching & Web Audio API Sequential Playback
 */

const DB_NAME = "PinIT_VoiceCacheDB";
const STORE_NAME = "audio_blobs";
const MODEL_VERSION = "v1.0";
const SERVER_URL = "http://localhost:8000";

function normalizeSentence(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]|_/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

async function computeSHA256(str) {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function getCachedAudio(cacheKey) {
  try {
    const db = await openDB();
    return new Promise(resolve => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(cacheKey);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });
  } catch (err) {
    return null;
  }
}

async function saveCachedAudio(cacheKey, blob) {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    store.put(blob, cacheKey);
  } catch (err) {
    console.warn("IndexedDB Write Error:", err);
  }
}

function splitSentences(text) {
  const raw = text.split(/(?<=[.!?])\s+/);
  return raw.map(s => s.trim()).filter(Boolean);
}

/**
 * Main Execution Function
 * Split paragraph -> Check IndexedDB per chunk -> Fetch misses from server -> Play sequentially
 */
async function playParagraph(text, voice = "en-us-nicole", onProgress = null) {
  const sentences = splitSentences(text);
  let hits = 0;
  let misses = 0;
  
  const audioBlobs = [];

  for (let i = 0; i < sentences.length; i++) {
    const sentence = sentences[i];
    const norm = normalizeSentence(sentence);
    const key = await computeSHA256(`${norm}:${voice}:${MODEL_VERSION}`);
    
    // Check Tier 1 Browser Cache
    const cachedBlob = await getCachedAudio(key);
    
    if (cachedBlob) {
      hits++;
      audioBlobs.push({ sentence, blob: cachedBlob, status: "TIER1_CACHE_HIT" });
      if (onProgress) onProgress({ type: "chunk_status", chunk: i, sentence, status: "CACHE_HIT", hits, misses });
    } else {
      misses++;
      if (onProgress) onProgress({ type: "chunk_status", chunk: i, sentence, status: "GENERATING", hits, misses });
      
      const res = await fetch(`${SERVER_URL}/generate_chunk`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: sentence, voice })
      });
      
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const blob = await res.blob();
      await saveCachedAudio(key, blob);
      audioBlobs.push({ sentence, blob, status: "SERVER_GENERATED" });
    }
  }

  // Play Blobs Sequentially
  for (const item of audioBlobs) {
    const url = URL.createObjectURL(item.blob);
    const audio = new Audio(url);
    await new Promise((resolve) => {
      audio.onended = resolve;
      audio.onerror = resolve;
      audio.play().catch(resolve);
    });
  }

  return { hits, misses, total: sentences.length };
}

window.PinITVoice = { playParagraph, splitSentences, normalizeSentence, computeSHA256 };
