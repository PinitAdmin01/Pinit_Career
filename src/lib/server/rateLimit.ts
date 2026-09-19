/**
 * Server-Side In-Memory Sliding-Window Rate Limiter
 * Provides DDoS, brute force, and abuse mitigation for resource-intensive routes.
 */

export interface RateLimitOptions {
  limit: number;
  windowMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetSec: number;
}

const MAX_RATE_LIMIT_KEYS = 5000;
const rateLimitStore = new Map<string, number[]>();

export function resetRateLimitStore(): void {
  rateLimitStore.clear();
}

export function getRateLimitStoreSize(): number {
  return rateLimitStore.size;
}

/**
 * Periodically or when over capacity, purge expired entries across the store.
 * If still over MAX_RATE_LIMIT_KEYS, evict oldest entries (FIFO).
 */
function pruneRateLimitStore(now: number): void {
  for (const [k, timestamps] of rateLimitStore.entries()) {
    // Drop entries whose latest timestamp has completely aged out past a generous 15m window
    if (timestamps.length === 0 || now - timestamps[timestamps.length - 1] > 15 * 60 * 1000) {
      rateLimitStore.delete(k);
    }
  }

  if (rateLimitStore.size > MAX_RATE_LIMIT_KEYS) {
    const excess = rateLimitStore.size - MAX_RATE_LIMIT_KEYS;
    let dropped = 0;
    for (const k of rateLimitStore.keys()) {
      rateLimitStore.delete(k);
      dropped++;
      if (dropped >= excess) break;
    }
  }
}

/**
 * Safely extracts client IP from Request headers, parsing the first IP in comma-separated proxies.
 */
export function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    const firstIp = forwarded.split(',')[0].trim();
    if (firstIp) return firstIp;
  }
  const realIp = req.headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  const cfConnectingIp = req.headers.get('cf-connecting-ip');
  if (cfConnectingIp) return cfConnectingIp.trim();
  return 'unknown';
}

let checkCounter = 0;

/**
 * Check rate limit for a given key using a sliding window algorithm
 */
export function checkRateLimit(key: string, options: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  const windowStart = now - options.windowMs;

  checkCounter++;
  if (checkCounter % 200 === 0 || rateLimitStore.size > MAX_RATE_LIMIT_KEYS) {
    pruneRateLimitStore(now);
  }

  let timestamps = rateLimitStore.get(key) || [];
  // Evict timestamps outside the window
  timestamps = timestamps.filter(ts => ts > windowStart);

  if (timestamps.length >= options.limit) {
    const oldestTimestamp = timestamps[0];
    const resetTimeMs = oldestTimestamp + options.windowMs - now;
    const resetSec = Math.max(1, Math.ceil(resetTimeMs / 1000));
    rateLimitStore.set(key, timestamps);
    return {
      allowed: false,
      remaining: 0,
      resetSec,
    };
  }

  timestamps.push(now);
  rateLimitStore.set(key, timestamps);

  const remaining = Math.max(0, options.limit - timestamps.length);
  const oldestTimestamp = timestamps[0];
  const resetTimeMs = oldestTimestamp + options.windowMs - now;
  const resetSec = Math.max(1, Math.ceil(resetTimeMs / 1000));

  return {
    allowed: true,
    remaining,
    resetSec,
  };
}
