/**
 * PinIT Career OS - Anti-Cheating Guardian Checkers
 *
 * Provides robust, deterministic, and non-intrusive heuristics to distinguish
 * between honest human mistakes (mis-clicks, thinking time, wrong answers)
 * and genuine cheating / automated spam across Lessons, Exams, Interviews, and Arena.
 */

export interface McqClickRecord {
  optionIndex: number;
  timestamp: number;
}

export interface McqVelocityTrackerOptions {
  mountTimestamp?: number;
  minReadTimeMs?: number;       // Minimum plausible time to read question before first click (default: 200ms)
  spamWindowMs?: number;        // Window to evaluate rapid cycling (default: 650ms)
  spamThresholdClicks?: number; // Clicks within window to constitute spam (default: 3)
  minInterClickMs?: number;     // Minimum human physical click-to-click interval (default: 220ms)
  onCheatingDetected: (violationType: string, details: Record<string, any>) => void;
}

/**
 * Creates a tracker for MCQ option clicks.
 *
 * Distinguishes:
 * - Honest Trial & Error: Student reads, clicks, sees hint, tries next option (>800ms) -> ALLOWED.
 * - Honest Mis-click: Student accidentally clicks option 1, then immediately clicks option 2 once -> ALLOWED.
 * - Brute-Force Cheating: Automated or robotic spam clicking through all options within milliseconds (<220ms per click or 3+ options in <650ms) -> FLAGGED.
 */
export function createMcqVelocityTracker(options: McqVelocityTrackerOptions) {
  const {
    mountTimestamp = Date.now(),
    minReadTimeMs = 200,
    spamWindowMs = 650,
    spamThresholdClicks = 3,
    minInterClickMs = 220,
    onCheatingDetected,
  } = options;

  let clickHistory: McqClickRecord[] = [];
  let isFlagged = false;
  let questionMountTime = mountTimestamp;

  return {
    reset(newMountTime: number = Date.now()) {
      clickHistory = [];
      isFlagged = false;
      questionMountTime = newMountTime;
    },

    recordClick(optionIndex: number): { isCheating: boolean; reason?: string } {
      if (isFlagged) {
        return { isCheating: false }; // Session/question already flagged
      }

      const now = Date.now();
      const timeSinceMount = now - questionMountTime;

      // 1. Robotic Instant Click Check: If first click occurs in < minReadTimeMs from question render
      if (clickHistory.length === 0 && timeSinceMount < minReadTimeMs) {
        isFlagged = true;
        const details = { timeSinceMount, minReadTimeMs, optionIndex };
        onCheatingDetected('mcq_instant_bot_click', details);
        return { isCheating: true, reason: 'Instant click detected before question could be read.' };
      }

      // Add to rolling history
      clickHistory.push({ optionIndex, timestamp: now });

      // Keep only recent history within spam window
      const cutoff = now - spamWindowMs;
      clickHistory = clickHistory.filter(c => c.timestamp >= cutoff);

      // 2. Inter-click Velocity Check: Check consecutive clicks
      if (clickHistory.length >= 2) {
        const last = clickHistory[clickHistory.length - 1];
        const prev = clickHistory[clickHistory.length - 2];
        const delta = last.timestamp - prev.timestamp;

        // If clicking different options with superhuman speed (< minInterClickMs)
        if (last.optionIndex !== prev.optionIndex && delta < minInterClickMs) {
          // If there's a third rapid click or 3 clicks within the spam window:
          if (clickHistory.length >= spamThresholdClicks) {
            isFlagged = true;
            const details = { delta, minInterClickMs, clicksInWindow: clickHistory.length };
            onCheatingDetected('mcq_rapid_brute_force', details);
            return { isCheating: true, reason: 'Rapid automated option cycling detected.' };
          }
        }
      }

      // 3. Brute Force Cycle Check: 3 or more distinct options clicked in under spamWindowMs (650ms)
      const uniqueOptions = new Set(clickHistory.map(c => c.optionIndex));
      if (uniqueOptions.size >= spamThresholdClicks && clickHistory.length >= spamThresholdClicks) {
        isFlagged = true;
        const details = { uniqueOptionsCount: uniqueOptions.size, windowMs: spamWindowMs };
        onCheatingDetected('mcq_rapid_brute_force', details);
        return { isCheating: true, reason: 'Brute-force rapid clicking detected.' };
      }

      // Legitimate attempt: honest trial-and-error or single accidental mis-click
      return { isCheating: false };
    },
  };
}

/**
 * Creates an event-driven proctoring tracker for timed exams, interviews, or arena matches.
 * Monitored violations:
 * - Hidden tab / tab switching (visibilityState === 'hidden') lasting longer than toleranceMs.
 * - Large chunk code paste into the workspace (> minCharsPasted in < 50ms).
 */
export function createSessionProctor({
  sessionId,
  feature,
  tabSwitchToleranceMs = 4000,
  maxPasteChars = 120,
  onViolation,
}: {
  sessionId: string;
  feature: 'exam' | 'interview' | 'arena';
  tabSwitchToleranceMs?: number;
  maxPasteChars?: number;
  onViolation: (violationType: string, details: Record<string, any>) => void;
}) {
  let blurTimer: NodeJS.Timeout | null = null;
  let blurTimestamp: number | null = null;
  let isDestroyed = false;

  const handleVisibilityChange = () => {
    if (isDestroyed) return;

    if (typeof document !== 'undefined' && document.visibilityState === 'hidden') {
      blurTimestamp = Date.now();
      blurTimer = setTimeout(() => {
        if (isDestroyed) return;
        onViolation('tab_switching_proctored', {
          sessionId,
          feature,
          hiddenDurationMs: Date.now() - (blurTimestamp || Date.now()),
        });
      }, tabSwitchToleranceMs);
    } else {
      if (blurTimer) {
        clearTimeout(blurTimer);
        blurTimer = null;
      }
      blurTimestamp = null;
    }
  };

  const handlePaste = (e: ClipboardEvent) => {
    if (isDestroyed) return;
    try {
      const text = e.clipboardData?.getData('text/plain') || '';
      if (text.length > maxPasteChars) {
        onViolation('bulk_code_paste', {
          sessionId,
          feature,
          pastedLength: text.length,
          maxAllowed: maxPasteChars,
        });
      }
    } catch {
      // Ignore clipboard read errors
    }
  };

  // Attach browser listeners if running in client
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('paste', handlePaste as any, true);
  }

  return {
    destroy() {
      isDestroyed = true;
      if (blurTimer) clearTimeout(blurTimer);
      if (typeof window !== 'undefined' && typeof document !== 'undefined') {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        window.removeEventListener('paste', handlePaste as any, true);
      }
    },
    inspectPasteLength(length: number) {
      if (length > maxPasteChars) {
        onViolation('bulk_code_paste', {
          sessionId,
          feature,
          pastedLength: length,
          maxAllowed: maxPasteChars,
        });
      }
    }
  };
}
