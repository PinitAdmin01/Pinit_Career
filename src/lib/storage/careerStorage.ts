/**
 * Storage resilient layer for PinIT CareerOS
 * DEF-071: Handles QuotaExceededError, automatic LRU cache pruning, and IndexedDB fallback.
 */

export function isQuotaExceededError(e: unknown): boolean {
  if (!e) return false;
  const err = e as any;
  return (
    err.name === 'QuotaExceededError' ||
    err.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
    err.code === 22 ||
    err.code === 1014 ||
    err.number === -2146828281 ||
    (typeof err.message === 'string' && err.message.toLowerCase().includes('quota'))
  );
}

/**
 * Scans localStorage and prunes disposable cache entries:
 * - pinit_cached_* (API response caches, voice preloads, preview items)
 * - pinit_temp_* (transient draft states)
 */
export function pruneStorageCache(): number {
  if (typeof window === 'undefined' || !window.localStorage) return 0;

  let prunedCount = 0;
  try {
    const keysToPrune: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;

      if (
        key.startsWith('pinit_cached_') ||
        key.startsWith('pinit_temp_') ||
        key.startsWith('pinit_voice_cache_') ||
        key.includes('_preview_')
      ) {
        keysToPrune.push(key);
      }
    }

    for (const key of keysToPrune) {
      localStorage.removeItem(key);
      prunedCount++;
    }

    if (prunedCount > 0) {
      console.warn(`[careerStorage] Emergency storage prune evicted ${prunedCount} cache entries.`);
    }
  } catch (err) {
    console.error('[careerStorage] Error during storage pruning:', err);
  }

  return prunedCount;
}

const IDB_DB_NAME = 'pinit_career_os_backup';
const IDB_STORE_NAME = 'kv_backup';

function openBackupDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !('indexedDB' in window)) {
      return reject(new Error('IndexedDB not supported'));
    }
    const req = window.indexedDB.open(IDB_DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(IDB_STORE_NAME)) {
        db.createObjectStore(IDB_STORE_NAME, { keyPath: 'key' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function saveToIndexedDB(key: string, value: unknown): Promise<boolean> {
  try {
    const db = await openBackupDB();
    return new Promise((resolve) => {
      const tx = db.transaction(IDB_STORE_NAME, 'readwrite');
      const store = tx.objectStore(IDB_STORE_NAME);
      store.put({ key, value, updatedAt: Date.now() });
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
    });
  } catch {
    return false;
  }
}

export async function getFromIndexedDB<T = unknown>(key: string): Promise<T | null> {
  try {
    const db = await openBackupDB();
    return new Promise((resolve) => {
      const tx = db.transaction(IDB_STORE_NAME, 'readonly');
      const store = tx.objectStore(IDB_STORE_NAME);
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result ? (req.result.value as T) : null);
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

export interface SafeStorageResult {
  success: boolean;
  pruned: boolean;
  fallbackToIdb: boolean;
}

/**
 * Safely writes to localStorage. If QuotaExceededError occurs:
 * 1. Prunes disposable cache entries (pinit_cached_*).
 * 2. Retries localStorage write.
 * 3. If storage remains full, backs up to IndexedDB to avoid silent data loss.
 */
export function safeLocalStorageSetItem(key: string, value: string): SafeStorageResult {
  if (typeof window === 'undefined' || !window.localStorage) {
    return { success: false, pruned: false, fallbackToIdb: false };
  }

  try {
    localStorage.setItem(key, value);
    return { success: true, pruned: false, fallbackToIdb: false };
  } catch (err) {
    if (isQuotaExceededError(err)) {
      const pruned = pruneStorageCache();
      try {
        localStorage.setItem(key, value);
        return { success: true, pruned: pruned > 0, fallbackToIdb: false };
      } catch (retryErr) {
        console.warn(`[careerStorage] Storage full after pruning ${pruned} entries. Backing up to IndexedDB.`);
        saveToIndexedDB(key, value).catch(() => {});
        return { success: false, pruned: pruned > 0, fallbackToIdb: true };
      }
    }

    return { success: false, pruned: false, fallbackToIdb: false };
  }
}
