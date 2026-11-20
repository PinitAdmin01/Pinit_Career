// src/lib/avatar/speechRecognitionEngine.ts
/**
 * High-Accuracy Web Speech Recognition Engine for PinIT Career OS.
 *
 * Permanently solves common browser SpeechRecognition failure modes:
 * - Accurate Indian-English locale auto-resolution (`en-IN`) via locale + Asia/Kolkata timezone.
 * - Multi-alternative extraction (`maxAlternatives = 5`) scoped strictly to `event.resultIndex`.
 * - Silence-commit stabilization (`silenceCommitMs`) so Chrome interim delays never cut off commands.
 * - Exponential backoff auto-restart watchdog (`350ms -> 700ms -> 1400ms`, capped at `2000ms`).
 * - Acoustic TTS echo gate (`setTtsSpeaking`) with post-speech cooldown (`ttsCooldownMs`).
 * - Sliding-window utterance deduplication (`dedupeWindowMs`) and leak-free `destroy()`.
 */

export type SpeechEngineStatus =
  | 'idle'
  | 'listening'
  | 'hearing'
  | 'paused-tts'
  | 'unsupported'
  | 'denied';

export interface SpeechUtteranceEvent {
  primary: string;
  alternatives: string[];
  isFinal: boolean;
}

export interface SpeechEngineConfig {
  lang?: string;
  silenceCommitMs?: number;       // default 750
  ttsCooldownMs?: number;         // default 450
  dedupeWindowMs?: number;        // default 2200
  grammarWords?: string[];
  onUtterance: (event: SpeechUtteranceEvent) => void;
  onInterim?: (text: string) => void;
  onStatusChange?: (status: SpeechEngineStatus) => void;
  onPermissionDenied?: () => void;
}

export interface SpeechRecognitionController {
  start: () => void;
  stop: () => void;
  setTtsSpeaking: (speaking: boolean) => void;
  destroy: () => void;
}

interface SpeechRecognitionAlternativeLike {
  readonly transcript: string;
  readonly confidence?: number;
}

interface SpeechRecognitionResultLike {
  readonly isFinal: boolean;
  readonly length: number;
  [index: number]: SpeechRecognitionAlternativeLike | undefined;
}

interface SpeechRecognitionResultListLike {
  readonly length: number;
  [index: number]: SpeechRecognitionResultLike | undefined;
}

interface SpeechRecognitionEventLike {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultListLike;
}

interface SpeechRecognitionErrorEventLike {
  readonly error: string;
  readonly message?: string;
}

interface SpeechGrammarListLike {
  addFromString: (src: string, weight?: number) => void;
}

interface SpeechRecognitionInstance {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  grammars?: SpeechGrammarListLike;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;
type SpeechGrammarListConstructor = new () => SpeechGrammarListLike;

interface SpeechWindow extends Window {
  SpeechRecognition?: SpeechRecognitionConstructor;
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
  SpeechGrammarList?: SpeechGrammarListConstructor;
  webkitSpeechGrammarList?: SpeechGrammarListConstructor;
}

const DEFAULT_SILENCE_COMMIT_MS = 750;
const DEFAULT_TTS_COOLDOWN_MS = 450;
const DEFAULT_DEDUPE_WINDOW_MS = 2200;
const MAX_ALTERNATIVES = 5;
const INITIAL_BACKOFF_MS = 350;
const MAX_BACKOFF_MS = 2000;

const INDIAN_LOCALE_SUBTAGS = new Set([
  'hi',
  'ta',
  'te',
  'kn',
  'ml',
  'mr',
  'gu',
  'bn',
  'pa',
  'ur',
  'or',
]);

const INDIA_TIMEZONES = new Set(['Asia/Kolkata', 'Asia/Calcutta']);

function isIndianLocale(locale: string): boolean {
  const normalized = locale.trim().replace(/_/g, '-').toLowerCase();
  if (!normalized) return false;
  if (normalized === 'en-in') return true;
  const primarySubtag = normalized.split('-')[0];
  return INDIAN_LOCALE_SUBTAGS.has(primarySubtag);
}

function getBrowserTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || '';
  } catch {
    return '';
  }
}

/**
 * Resolves the highest-accuracy Web Speech locale for the current user.
 * Prioritizes `en-IN` for Indian locales and `Asia/Kolkata` / `Asia/Calcutta` timezones,
 * preserves valid `en-*` locales elsewhere, and defaults to `en-IN` when unspecified or non-English.
 */
export function resolveBestSpeechLocale(navLang?: string): string {
  const rawCandidate =
    navLang !== undefined
      ? navLang
      : typeof navigator !== 'undefined' && typeof navigator.language === 'string'
        ? navigator.language
        : '';
  const candidate = typeof rawCandidate === 'string' ? rawCandidate.trim() : '';

  if (isIndianLocale(candidate) || INDIA_TIMEZONES.has(getBrowserTimeZone())) {
    return 'en-IN';
  }

  const normalized = candidate.replace(/_/g, '-');
  const enRegionMatch = normalized.match(/^en-([a-z]{2}|[0-9]{3})$/i);
  if (enRegionMatch) {
    return `en-${enRegionMatch[1].toUpperCase()}`;
  }

  return 'en-IN';
}

function normalizeForDedupe(text: string): string {
  return text
    .toLowerCase()
    .replace(/[.,!?;:'"()[\]{}]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractUniqueAlternatives(
  slice: SpeechRecognitionResultLike[],
): { primary: string; alternatives: string[] } | null {
  if (slice.length === 0) return null;

  const seen = new Set<string>();
  const alternatives: string[] = [];

  const pushUnique = (raw: string): void => {
    const cleaned = raw.replace(/\s+/g, ' ').trim();
    if (!cleaned) return;
    const key = cleaned.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      alternatives.push(cleaned);
    }
  };

  if (slice.length === 1) {
    const res = slice[0];
    const limit = Math.min(res.length, MAX_ALTERNATIVES);
    for (let i = 0; i < limit; i += 1) {
      const alt = res[i];
      if (alt && typeof alt.transcript === 'string') {
        pushUnique(alt.transcript);
      }
    }
  } else {
    const maxAltCount = Math.min(
      MAX_ALTERNATIVES,
      slice.reduce((acc, res) => Math.max(acc, res.length), 0),
    );
    for (let altIdx = 0; altIdx < maxAltCount; altIdx += 1) {
      const parts: string[] = [];
      for (const res of slice) {
        const alt = res[altIdx] ?? res[0];
        if (alt && typeof alt.transcript === 'string') {
          const piece = alt.transcript.trim();
          if (piece) parts.push(piece);
        }
      }
      if (parts.length > 0) {
        pushUnique(parts.join(' '));
      }
    }
  }

  if (alternatives.length === 0) return null;
  return {
    primary: alternatives[0],
    alternatives,
  };
}

function attachGrammarBias(
  recognition: SpeechRecognitionInstance,
  win: SpeechWindow,
  grammarWords?: string[],
): void {
  if (!grammarWords || grammarWords.length === 0) return;
  const GrammarListCtor = win.SpeechGrammarList || win.webkitSpeechGrammarList;
  if (!GrammarListCtor) return;

  try {
    const cleanedWords = Array.from(
      new Set(
        grammarWords
          .map((w) => w.replace(/[^a-zA-Z0-9\s'-]/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase())
          .filter(Boolean),
      ),
    );
    if (cleanedWords.length === 0) return;

    const jsgf = `#JSGF V1.0; grammar pinitCommands; public <command> = ${cleanedWords.join(' | ')} ;`;
    const list = new GrammarListCtor();
    list.addFromString(jsgf, 1);
    recognition.grammars = list;
  } catch {
    // Gracefully skip grammar biasing when browser SpeechGrammarList is unavailable or throws.
  }
}

function getSpeechWindow(): SpeechWindow | null {
  if (typeof window === 'undefined') return null;
  return window as SpeechWindow;
}

function getRecognitionCtor(win: SpeechWindow | null): SpeechRecognitionConstructor | null {
  if (!win) return null;
  return win.SpeechRecognition || win.webkitSpeechRecognition || null;
}

function safeStopRecognition(rec: SpeechRecognitionInstance): void {
  try {
    if (typeof rec.stop === 'function') {
      rec.stop();
      return;
    }
  } catch {
    // Fall through to abort fallback.
  }
  try {
    if (typeof rec.abort === 'function') {
      rec.abort();
    }
  } catch {
    // Ignore stop/abort errors on closed sessions.
  }
}

function safeAbortRecognition(rec: SpeechRecognitionInstance): void {
  try {
    if (typeof rec.abort === 'function') {
      rec.abort();
      return;
    }
  } catch {
    // Fall through to stop fallback.
  }
  try {
    if (typeof rec.stop === 'function') {
      rec.stop();
    }
  } catch {
    // Ignore abort/stop errors on closed sessions.
  }
}

export function createSpeechRecognitionController(
  config: SpeechEngineConfig,
): SpeechRecognitionController {
  const silenceCommitMs = Math.max(0, config.silenceCommitMs ?? DEFAULT_SILENCE_COMMIT_MS);
  const ttsCooldownMs = Math.max(0, config.ttsCooldownMs ?? DEFAULT_TTS_COOLDOWN_MS);
  const dedupeWindowMs = Math.max(0, config.dedupeWindowMs ?? DEFAULT_DEDUPE_WINDOW_MS);

  let status: SpeechEngineStatus = 'idle';
  let active = false;
  let running = false;
  let starting = false;
  let ttsSpeaking = false;
  let denied = false;
  let destroyed = false;
  let restartAttempt = 0;

  let recognition: SpeechRecognitionInstance | null = null;
  let silenceTimer: ReturnType<typeof setTimeout> | null = null;
  let restartTimer: ReturnType<typeof setTimeout> | null = null;
  let ttsCooldownTimer: ReturnType<typeof setTimeout> | null = null;
  let startingWatchdog: ReturnType<typeof setTimeout> | null = null;
  let ttsSpeakingWatchdog: ReturnType<typeof setTimeout> | null = null;
  let pendingInterim: { primary: string; alternatives: string[] } | null = null;

  let lastDispatchedKey = '';
  let lastDispatchedAt = 0;

  const setStatus = (next: SpeechEngineStatus): void => {
    if (destroyed || next === status) return;
    status = next;
    config.onStatusChange?.(next);
  };

  const clearSilenceTimer = (): void => {
    if (silenceTimer !== null) {
      clearTimeout(silenceTimer);
      silenceTimer = null;
    }
  };

  const clearRestartTimer = (): void => {
    if (restartTimer !== null) {
      clearTimeout(restartTimer);
      restartTimer = null;
    }
  };

  const clearTtsCooldownTimer = (): void => {
    if (ttsCooldownTimer !== null) {
      clearTimeout(ttsCooldownTimer);
      ttsCooldownTimer = null;
    }
  };

  const clearStartingWatchdog = (): void => {
    if (startingWatchdog !== null) {
      clearTimeout(startingWatchdog);
      startingWatchdog = null;
    }
  };

  const clearTtsSpeakingWatchdog = (): void => {
    if (ttsSpeakingWatchdog !== null) {
      clearTimeout(ttsSpeakingWatchdog);
      ttsSpeakingWatchdog = null;
    }
  };

  const clearAllTimers = (): void => {
    clearSilenceTimer();
    clearRestartTimer();
    clearTtsCooldownTimer();
    clearStartingWatchdog();
    clearTtsSpeakingWatchdog();
  };

  const teardownInstance = (): void => {
    if (recognition) {
      const rec = recognition;
      recognition = null;
      rec.onstart = null;
      rec.onresult = null;
      rec.onerror = null;
      rec.onend = null;
      safeAbortRecognition(rec);
    }
  };

  const dispatchUtterance = (
    primary: string,
    alternatives: string[],
    isFinal: boolean,
  ): void => {
    if (destroyed || !active || ttsSpeaking) return;

    const cleanedPrimary = primary.replace(/\s+/g, ' ').trim();
    if (!cleanedPrimary) return;

    const dedupeKey = normalizeForDedupe(cleanedPrimary);
    if (!dedupeKey) return;

    const now = Date.now();
    if (
      dedupeWindowMs > 0 &&
      dedupeKey === lastDispatchedKey &&
      now - lastDispatchedAt < dedupeWindowMs
    ) {
      return;
    }

    lastDispatchedKey = dedupeKey;
    lastDispatchedAt = now;

    config.onUtterance({
      primary: cleanedPrimary,
      alternatives: alternatives.length > 0 ? alternatives : [cleanedPrimary],
      isFinal,
    });
  };

  const scheduleRestart = (): void => {
    if (destroyed || !active || ttsSpeaking || denied) return;
    clearRestartTimer();

    const delay = Math.min(MAX_BACKOFF_MS, INITIAL_BACKOFF_MS * Math.pow(2, restartAttempt));
    restartAttempt += 1;

    restartTimer = setTimeout(() => {
      restartTimer = null;
      startRecognitionNow();
    }, delay);
  };

  const createFreshRecognition = (): SpeechRecognitionInstance | null => {
    teardownInstance();

    const win = getSpeechWindow();
    const Ctor = getRecognitionCtor(win);
    if (!win || !Ctor) {
      setStatus('unsupported');
      return null;
    }

    const instance = new Ctor();
    const resolvedLang =
      typeof config.lang === 'string' && config.lang.trim().length > 0
        ? config.lang.trim()
        : resolveBestSpeechLocale();

    instance.lang = resolvedLang;
    instance.continuous = true;
    instance.interimResults = true;
    instance.maxAlternatives = MAX_ALTERNATIVES;
    attachGrammarBias(instance, win, config.grammarWords);

    instance.onstart = () => {
      clearStartingWatchdog();
      if (destroyed) return;
      starting = false;
      running = true;
      restartAttempt = 0;

      if (ttsSpeaking) {
        running = false;
        setStatus('paused-tts');
        teardownInstance();
        return;
      }

      if (!active) {
        running = false;
        setStatus('idle');
        teardownInstance();
        return;
      }

      setStatus('listening');
    };

    instance.onresult = (event: SpeechRecognitionEventLike) => {
      if (destroyed || !active || ttsSpeaking) return;
      const results = event?.results;
      if (!results || results.length === 0) return;

      const startIdx = Math.max(0, event.resultIndex ?? 0);
      if (startIdx >= results.length) return;

      const finalSlice: SpeechRecognitionResultLike[] = [];
      const interimSlice: SpeechRecognitionResultLike[] = [];

      for (let i = startIdx; i < results.length; i += 1) {
        const res = results[i];
        if (!res || res.length === 0) continue;
        if (res.isFinal) {
          finalSlice.push(res);
        } else {
          interimSlice.push(res);
        }
      }

      if (finalSlice.length > 0) {
        clearSilenceTimer();
        pendingInterim = null;
        const extractedFinal = extractUniqueAlternatives(finalSlice);
        if (extractedFinal) {
          dispatchUtterance(extractedFinal.primary, extractedFinal.alternatives, true);
        }
        if (interimSlice.length === 0 && active && !ttsSpeaking && !destroyed) {
          setStatus('listening');
        }
      }

      if (interimSlice.length > 0 && active && !ttsSpeaking && !destroyed) {
        const extractedInterim = extractUniqueAlternatives(interimSlice);
        if (extractedInterim) {
          pendingInterim = extractedInterim;
          setStatus('hearing');
          config.onInterim?.(extractedInterim.primary);

          clearSilenceTimer();
          silenceTimer = setTimeout(() => {
            silenceTimer = null;
            if (destroyed || !active || ttsSpeaking || !pendingInterim) return;
            const committed = pendingInterim;
            pendingInterim = null;
            dispatchUtterance(committed.primary, committed.alternatives, false);
            if (active && !ttsSpeaking && !destroyed) {
              setStatus('listening');
            }
          }, silenceCommitMs);
        }
      }
    };

    instance.onerror = (event: SpeechRecognitionErrorEventLike) => {
      clearStartingWatchdog();
      starting = false;
      if (destroyed) return;
      const errCode = event?.error || '';

      if (errCode === 'not-allowed' || errCode === 'service-not-allowed') {
        const alreadyDenied = denied;
        denied = true;
        active = false;
        running = false;
        pendingInterim = null;
        clearAllTimers();
        teardownInstance();
        setStatus('denied');
        if (!alreadyDenied) {
          config.onPermissionDenied?.();
        }
        return;
      }

      if (errCode === 'no-speech' || errCode === 'aborted') {
        return;
      }

      // Handle transient audio-capture/network drops by cycling instance cleanly
      console.warn(`[SpeechEngine] Transient recognition error: "${errCode}". Cycling session.`);
      running = false;
      teardownInstance();
      if (active && !ttsSpeaking && !denied) {
        scheduleRestart();
      }
    };

    instance.onend = () => {
      clearStartingWatchdog();
      if (destroyed) return;
      running = false;
      starting = false;

      if (active && !ttsSpeaking && !denied && pendingInterim) {
        clearSilenceTimer();
        const committed = pendingInterim;
        pendingInterim = null;
        dispatchUtterance(committed.primary, committed.alternatives, false);
      } else if (!active || ttsSpeaking || denied) {
        clearSilenceTimer();
        pendingInterim = null;
      }

      // Always tear down dead instance to prevent Chrome zombie states
      teardownInstance();

      if (active && !ttsSpeaking && !denied) {
        setStatus('listening');
        scheduleRestart();
      } else if (ttsSpeaking && !denied) {
        setStatus('paused-tts');
      } else if (!denied) {
        setStatus('idle');
      }
    };

    recognition = instance;
    return recognition;
  };

  const startRecognitionNow = (): void => {
    if (destroyed || !active || ttsSpeaking || denied || running || starting) return;
    const rec = createFreshRecognition();
    if (!rec) return;

    starting = true;
    clearStartingWatchdog();
    // Safety watchdog: Chrome SpeechRecognition must fire onstart within 1800ms
    startingWatchdog = setTimeout(() => {
      startingWatchdog = null;
      if (starting && !running && !destroyed && active && !ttsSpeaking) {
        console.warn('[SpeechEngine] Recognition start watchdog expired (no onstart within 1800ms). Cycling instance.');
        starting = false;
        teardownInstance();
        scheduleRestart();
      }
    }, 1800);

    try {
      rec.start();
    } catch (startErr) {
      clearStartingWatchdog();
      starting = false;
      teardownInstance();
      console.warn('[SpeechEngine] Synchronous start() error:', startErr);
      scheduleRestart();
    }
  };

  return {
    start: () => {
      if (destroyed) return;
      const win = getSpeechWindow();
      if (!getRecognitionCtor(win)) {
        setStatus('unsupported');
        return;
      }

      active = true;
      denied = false;
      restartAttempt = 0;
      clearRestartTimer();
      clearTtsCooldownTimer();
      clearStartingWatchdog();

      if (ttsSpeaking) {
        setStatus('paused-tts');
        return;
      }

      startRecognitionNow();
    },

    stop: () => {
      if (destroyed) return;
      active = false;
      pendingInterim = null;
      restartAttempt = 0;
      running = false;
      starting = false;
      clearAllTimers();
      teardownInstance();

      if (!denied && status !== 'unsupported') {
        setStatus('idle');
      }
    },

    setTtsSpeaking: (speaking: boolean) => {
      if (destroyed) return;

      if (speaking) {
        ttsSpeaking = true;
        pendingInterim = null;
        clearAllTimers();

        // 9-second failsafe watchdog: auto-resume if TTS was aborted or canceled without clear
        ttsSpeakingWatchdog = setTimeout(() => {
          ttsSpeakingWatchdog = null;
          if (ttsSpeaking && active && !destroyed && !denied) {
            console.warn('[SpeechEngine] TTS speaking watchdog expired (9s). Auto-resuming speech recognition.');
            ttsSpeaking = false;
            setStatus('listening');
            startRecognitionNow();
          }
        }, 9000);

        if (!denied && status !== 'unsupported') {
          setStatus('paused-tts');
        }

        running = false;
        starting = false;
        teardownInstance();
        return;
      }

      clearTtsSpeakingWatchdog();
      if (!ttsSpeaking && ttsCooldownTimer === null && (running || starting)) {
        return;
      }

      ttsSpeaking = false;
      clearTtsCooldownTimer();

      if (!active || denied) {
        if (!denied && status === 'paused-tts') {
          setStatus('idle');
        }
        return;
      }

      ttsCooldownTimer = setTimeout(() => {
        ttsCooldownTimer = null;
        if (destroyed || !active || ttsSpeaking || denied) return;
        restartAttempt = 0;
        startRecognitionNow();
      }, ttsCooldownMs);
    },

    destroy: () => {
      if (destroyed) return;
      destroyed = true;
      active = false;
      running = false;
      starting = false;
      ttsSpeaking = false;
      pendingInterim = null;
      clearAllTimers();
      teardownInstance();
    },
  };
}
