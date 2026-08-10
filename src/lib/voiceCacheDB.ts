/**
 * PinIT Careers AI Voice System - Phase 4: Browser IndexedDB Caching Engine
 * Storing pre-rendered WAV audio blobs locally in browser memory for 0ms playback.
 */

const DB_NAME = "PinITVoiceCacheDB";
const DB_VERSION = 1;
const STORE_NAME = "voice_audio_blobs";
const MODEL_VERSION = "pinit_v3";

export interface CachedAudioEntry {
  cacheKey: string;
  text: string;
  voice: string;
  speed: number;
  audioBuffer: ArrayBuffer;
  createdAt: number;
  hitCount: number;
  byteSize: number;
}

/**
 * Computes deterministic SHA-256 cache key for text, voice & playback speed.
 */
export async function computeVoiceCacheKey(
  text: string,
  voice: string = "af_bella",
  speed: number = 1.0
): Promise<string> {
  const normalizedText = text.trim().toLowerCase().replace(/\s+/g, " ");
  const rawString = `${MODEL_VERSION}::${voice.toLowerCase()}::${speed.toFixed(2)}::${normalizedText}`;
  
  if (typeof window !== "undefined" && window.crypto && window.crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(rawString);
    const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  }
  
  // Fallback hash for non-secure contexts
  let hash = 0;
  for (let i = 0; i < rawString.length; i++) {
    const char = rawString.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `fallback_${Math.abs(hash).toString(16)}`;
}

class VoiceCacheDB {
  private dbPromise: Promise<IDBDatabase> | null = null;

  private getDB(): Promise<IDBDatabase> {
    if (typeof window === "undefined" || !("indexedDB" in window)) {
      return Promise.reject(new Error("IndexedDB is not supported in this environment."));
    }

    if (!this.dbPromise) {
      this.dbPromise = new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            const store = db.createObjectStore(STORE_NAME, { keyPath: "cacheKey" });
            store.createIndex("voice", "voice", { unique: false });
            store.createIndex("createdAt", "createdAt", { unique: false });
          }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    }

    return this.dbPromise;
  }

  /**
   * Retrieves pre-rendered audio buffer from IndexedDB cache if present and valid.
   */
  async getAudio(cacheKey: string): Promise<ArrayBuffer | null> {
    try {
      const db = await this.getDB();
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        const store = tx.objectStore(STORE_NAME);
        const getReq = store.get(cacheKey);

        getReq.onsuccess = () => {
          const entry: CachedAudioEntry | undefined = getReq.result;
          if (entry && entry.audioBuffer && entry.audioBuffer.byteLength > 800) {
            // Increment hit count for valid audio
            entry.hitCount += 1;
            store.put(entry);
            resolve(entry.audioBuffer);
          } else {
            // Delete corrupt / too-small entries
            if (entry) {
              store.delete(cacheKey);
            }
            resolve(null);
          }
        };

        getReq.onerror = () => resolve(null);
      });
    } catch {
      return null;
    }
  }

  /**
   * Saves newly generated audio buffer into IndexedDB cache.
   */
  async saveAudio(
    cacheKey: string,
    text: string,
    voice: string,
    speed: number,
    audioBuffer: ArrayBuffer
  ): Promise<void> {
    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        const store = tx.objectStore(STORE_NAME);

        const entry: CachedAudioEntry = {
          cacheKey,
          text,
          voice,
          speed,
          audioBuffer,
          createdAt: Date.now(),
          hitCount: 1,
          byteSize: audioBuffer.byteLength,
        };

        const putReq = store.put(entry);
        putReq.onsuccess = () => resolve();
        putReq.onerror = () => reject(putReq.error);
      });
    } catch (e) {
      console.warn("Failed to write to IndexedDB Voice Cache:", e);
    }
  }

  /**
   * Returns cache metrics (count, total size in bytes).
   */
  async getCacheStats(): Promise<{ count: number; totalSizeBytes: number }> {
    try {
      const db = await this.getDB();
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, "readonly");
        const store = tx.objectStore(STORE_NAME);
        const getAllReq = store.getAll();

        getAllReq.onsuccess = () => {
          const entries: CachedAudioEntry[] = getAllReq.result || [];
          const count = entries.length;
          const totalSizeBytes = entries.reduce((acc, e) => acc + (e.byteSize || 0), 0);
          resolve({ count, totalSizeBytes });
        };

        getAllReq.onerror = () => resolve({ count: 0, totalSizeBytes: 0 });
      });
    } catch {
      return { count: 0, totalSizeBytes: 0 };
    }
  }

  /**
   * Clears all cached audio blobs.
   */
  async clearCache(): Promise<void> {
    try {
      const db = await this.getDB();
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        const store = tx.objectStore(STORE_NAME);
        const clearReq = store.clear();
        clearReq.onsuccess = () => resolve();
        clearReq.onerror = () => resolve();
      });
    } catch {
      // Ignore clear errors
    }
  }
}

export const voiceCacheDB = new VoiceCacheDB();
