/**
 * PinIT Careers AI Voice System — Browser IndexedDB Caching Engine
 *
 * Fixes applied:
 *  - DB_NAME and STORE_NAME unified with voiceCache.ts (single DB, no duplicates)
 *  - Cache key format unified: pinit_v2::{voice}::{speed}::{normalized_text}
 *    (matches backend hash_service.py exactly so server/client keys are identical)
 *  - getAudio uses "readonly" transaction; hitCount update is a separate "readwrite"
 *    to avoid buffer corruption on put failure
 */

// ── Canonical DB constants (must match voiceCache.ts) ─────────────────────────
export const DB_NAME    = 'PinIT_VoiceCacheDB';
const DB_VERSION        = 2; // bumped from 1 because store name changed
export const STORE_NAME = 'audio_blobs';

/** Must stay in sync with backend hash_service.py payload prefix. */
const MODEL_VERSION = 'pinit_v2';

export interface CachedAudioEntry {
  cacheKey:    string;
  text:        string;
  voice:       string;
  speed:       number;
  audioBuffer: ArrayBuffer;
  createdAt:   number;
  hitCount:    number;
  byteSize:    number;
}

// ── Cache Key ─────────────────────────────────────────────────────────────────

/**
 * Computes a deterministic SHA-256 cache key.
 * Format: pinit_v2::{voice}::{speed:.2f}::{normalized_text}
 * Matches backend/app/services/hash_service.py → compute_cache_key()
 */
export async function computeVoiceCacheKey(
  text:  string,
  voice: string = 'af_heart',
  speed: number = 1.0,
): Promise<string> {
  const normalizedText = text.trim().toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ');
  const rawString = `${MODEL_VERSION}::${voice.toLowerCase()}::${speed.toFixed(2)}::${normalizedText}`;

  if (typeof window !== 'undefined' && window.crypto?.subtle) {
    const data       = new TextEncoder().encode(rawString);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  // Fallback for non-secure contexts (should not occur in production)
  let hash = 0;
  for (let i = 0; i < rawString.length; i++) {
    hash = (hash << 5) - hash + rawString.charCodeAt(i);
    hash |= 0;
  }
  return `fallback_${Math.abs(hash).toString(16)}`;
}

// ── IndexedDB ─────────────────────────────────────────────────────────────────

class VoiceCacheDB {
  private dbPromise: Promise<IDBDatabase> | null = null;

  private getDB(): Promise<IDBDatabase> {
    if (typeof window === 'undefined' || !('indexedDB' in window)) {
      return Promise.reject(new Error('IndexedDB not supported in this environment.'));
    }

    if (!this.dbPromise) {
      this.dbPromise = new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          // Drop old store if it exists (version bump migration)
          if (db.objectStoreNames.contains('voice_audio_blobs')) {
            db.deleteObjectStore('voice_audio_blobs');
          }
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            const store = db.createObjectStore(STORE_NAME, { keyPath: 'cacheKey' });
            store.createIndex('voice',     'voice',     { unique: false });
            store.createIndex('createdAt', 'createdAt', { unique: false });
          }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror   = () => reject(request.error);
      });
    }

    return this.dbPromise;
  }

  /**
   * Retrieves pre-rendered audio buffer from IndexedDB if present and valid.
   * Fix 10: Uses "readonly" transaction for the read; hitCount update is a
   * separate fire-and-forget "readwrite" so a failed write never corrupts the
   * returned ArrayBuffer.
   */
  async getAudio(cacheKey: string): Promise<ArrayBuffer | null> {
    try {
      const db = await this.getDB();
      return new Promise((resolve) => {
        // readonly — safe and non-blocking for concurrent readers
        const tx      = db.transaction(STORE_NAME, 'readonly');
        const store   = tx.objectStore(STORE_NAME);
        const getReq  = store.get(cacheKey);

        getReq.onsuccess = () => {
          const entry: CachedAudioEntry | undefined = getReq.result;
          if (entry && entry.audioBuffer && entry.audioBuffer.byteLength > 800) {
            // Clone the buffer before returning so the stored copy stays intact
            const returnBuf = entry.audioBuffer.slice(0);
            // Fire-and-forget hitCount increment in its own transaction
            this._incrementHit(db, entry).catch(() => {});
            resolve(returnBuf);
          } else {
            if (entry) this._delete(db, cacheKey).catch(() => {});
            resolve(null);
          }
        };

        getReq.onerror = () => resolve(null);
      });
    } catch {
      return null;
    }
  }

  private _incrementHit(db: IDBDatabase, entry: CachedAudioEntry): Promise<void> {
    return new Promise((resolve) => {
      try {
        const tx    = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const updated = { ...entry, hitCount: (entry.hitCount || 0) + 1 };
        store.put(updated);
        tx.oncomplete = () => resolve();
        tx.onerror    = () => resolve(); // non-critical
      } catch {
        resolve();
      }
    });
  }

  private _delete(db: IDBDatabase, cacheKey: string): Promise<void> {
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        tx.objectStore(STORE_NAME).delete(cacheKey);
        tx.oncomplete = () => resolve();
        tx.onerror    = () => resolve();
      } catch {
        resolve();
      }
    });
  }

  /** Saves newly generated audio buffer into IndexedDB cache. */
  async saveAudio(
    cacheKey:    string,
    text:        string,
    voice:       string,
    speed:       number,
    audioBuffer: ArrayBuffer,
  ): Promise<void> {
    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const tx    = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);

        const entry: CachedAudioEntry = {
          cacheKey,
          text,
          voice,
          speed,
          audioBuffer,
          createdAt: Date.now(),
          hitCount:  1,
          byteSize:  audioBuffer.byteLength,
        };

        const putReq      = store.put(entry);
        putReq.onsuccess  = () => resolve();
        putReq.onerror    = () => reject(putReq.error);
      });
    } catch (e) {
      console.warn('[VoiceCacheDB] Failed to write to IndexedDB:', e);
    }
  }

  /** Returns cache metrics (count, total size in bytes). */
  async getCacheStats(): Promise<{ count: number; totalSizeBytes: number }> {
    try {
      const db = await this.getDB();
      return new Promise((resolve) => {
        const tx         = db.transaction(STORE_NAME, 'readonly');
        const getAllReq  = tx.objectStore(STORE_NAME).getAll();

        getAllReq.onsuccess = () => {
          const entries: CachedAudioEntry[] = getAllReq.result || [];
          resolve({
            count:          entries.length,
            totalSizeBytes: entries.reduce((acc, e) => acc + (e.byteSize || 0), 0),
          });
        };

        getAllReq.onerror = () => resolve({ count: 0, totalSizeBytes: 0 });
      });
    } catch {
      return { count: 0, totalSizeBytes: 0 };
    }
  }

  /** Clears all cached audio blobs. */
  async clearCache(): Promise<void> {
    try {
      const db    = await this.getDB();
      return new Promise((resolve) => {
        const tx        = db.transaction(STORE_NAME, 'readwrite');
        const clearReq  = tx.objectStore(STORE_NAME).clear();
        clearReq.onsuccess = () => resolve();
        clearReq.onerror   = () => resolve();
      });
    } catch {
      // Ignore clear errors
    }
  }
}

export const voiceCacheDB = new VoiceCacheDB();
