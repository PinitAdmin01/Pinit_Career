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

const rateLimitStore = new Map<string, number[]>();

export function resetRateLimitStore(): void {
  rateLimitStore.clear();
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

/**
 * Check rate limit for a given key using a sliding window algorithm
 */
export function checkRateLimit(key: string, options: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  const windowStart = now - options.windowMs;

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
