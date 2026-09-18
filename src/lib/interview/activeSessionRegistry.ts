// src/lib/interview/activeSessionRegistry.ts
// Server-Authoritative Active Interview Registry
// Enforces anti-cheat integrity: teleprompter/assist endpoints cannot be tricked by client-sent flags.

interface ActiveLiveSession {
  userId: string;
  topic: string;
  stage: string;
  startedAt: number;
  lastActiveAt: number;
}

// In-memory process-level registry with 45-minute live interview window
const activeSessions = new Map<string, ActiveLiveSession>();
const ACTIVE_SESSION_TTL_MS = 45 * 60 * 1000; // 45 minutes

export function recordActiveLiveInterview(userId: string, topic: string, stage: string): void {
  if (!userId || userId === 'guest') return;
  const now = Date.now();
  const existing = activeSessions.get(userId);
  activeSessions.set(userId, {
    userId,
    topic: topic || existing?.topic || 'General',
    stage: stage || existing?.stage || 'round1_behavioral',
    startedAt: existing?.startedAt || now,
    lastActiveAt: now
  });
}

export function isUserInActiveLiveInterview(userId: string): boolean {
  if (!userId || userId === 'guest') return false;
  const session = activeSessions.get(userId);
  if (!session) return false;

  const now = Date.now();
  if (now - session.lastActiveAt > ACTIVE_SESSION_TTL_MS) {
    activeSessions.delete(userId);
    return false;
  }

  // Interview active if stage is not results/completed
  return session.stage !== 'results' && session.stage !== 'completed';
}

export function completeActiveLiveInterview(userId: string): void {
  if (!userId) return;
  activeSessions.delete(userId);
}

export function clearAllActiveSessionsForTesting(): void {
  activeSessions.clear();
}
