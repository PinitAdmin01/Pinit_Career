// src/lib/interview/speechDebounce.ts
/**
 * Speech-to-Text & Silence Debouncer for AI Mock Interviews.
 *
 * Provides deterministic buffering, silence debouncing, duplicate transcript
 * suppression, words-per-minute (WPM) calculation, and filler word detection.
 */

export interface SpeechCadenceMetrics {
  wordCount: number;
  durationSeconds: number;
  rawWpm: number;
  clampedWpm: number;
  fillerWordCount: number;
  detectedFillers: string[];
}

export interface SpeechDebounceConfig {
  /** Milliseconds of silence after speech to trigger final submission */
  silenceThresholdMs?: number;
  /** Milliseconds to suppress duplicate transcript submissions */
  duplicateWindowMs?: number;
  /** Minimum word count to trigger submission (prevents mic pops/coughs) */
  minWordCount?: number;
}

const DEFAULT_CONFIG: Required<SpeechDebounceConfig> = {
  silenceThresholdMs: 1800,
  duplicateWindowMs: 2500,
  minWordCount: 1,
};

const FILLER_REGEX = /\b(um|uh|like|you know|basically|actually|sort of|kind of|i mean)\b/gi;

export class SpeechDebounceManager {
  private config: Required<SpeechDebounceConfig>;
  private accumulatedText: string = '';
  private interimText: string = '';
  private lastSubmittedText: string = '';
  private lastSubmittedTimestamp: number = 0;
  private speechStartTimestamp: number = 0;
  private debounceTimer: any = null;
  private silenceNudgeTimer: any = null;

  constructor(config?: SpeechDebounceConfig) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Updates interim speech chunk received from STT engine.
   */
  public handleInterimChunk(chunk: string, onSilenceTrigger?: (fullText: string) => void): string {
    this.interimText = chunk.trim();
    if (!this.speechStartTimestamp && this.interimText) {
      this.speechStartTimestamp = Date.now();
    }

    this.resetDebounceTimer(onSilenceTrigger);
    return this.getCurrentTranscript();
  }

  /**
   * Finalizes an utterance segment (e.g. from isFinal=true).
   */
  public handleFinalChunk(chunk: string, onSilenceTrigger?: (fullText: string) => void): string {
    const trimmed = chunk.trim();
    if (trimmed) {
      this.accumulatedText = this.accumulatedText
        ? `${this.accumulatedText} ${trimmed}`
        : trimmed;
    }
    this.interimText = '';

    this.resetDebounceTimer(onSilenceTrigger);
    return this.getCurrentTranscript();
  }

  /**
   * Resets the silence debounce timer. When silence threshold expires,
   * invokes onSilenceTrigger with the accumulated speech.
   */
  private resetDebounceTimer(onSilenceTrigger?: (fullText: string) => void): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }

    if (!onSilenceTrigger) return;

    this.debounceTimer = setTimeout(() => {
      const full = this.getCurrentTranscript();
      if (this.canSubmit(full)) {
        onSilenceTrigger(full);
      }
    }, this.config.silenceThresholdMs);
  }

  /**
   * Gets the combined accumulated and interim transcript.
   */
  public getCurrentTranscript(): string {
    return `${this.accumulatedText} ${this.interimText}`.trim();
  }

  /**
   * Checks whether the current transcript qualifies for submission.
   */
  public canSubmit(text: string): boolean {
    const cleaned = text.trim();
    if (!cleaned) return false;

    const words = cleaned.split(/\s+/).filter(Boolean);
    if (words.length < this.config.minWordCount) return false;

    // Suppress identical submissions within the duplicate sliding window
    const now = Date.now();
    if (
      cleaned === this.lastSubmittedText &&
      now - this.lastSubmittedTimestamp < this.config.duplicateWindowMs
    ) {
      return false;
    }

    return true;
  }

  /**
   * Commits submission and computes cadence metrics.
   */
  public commitSubmission(): { text: string; metrics: SpeechCadenceMetrics } | null {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }

    const textToSubmit = this.getCurrentTranscript();
    if (!this.canSubmit(textToSubmit)) {
      return null;
    }

    const now = Date.now();
    this.lastSubmittedText = textToSubmit;
    this.lastSubmittedTimestamp = now;

    // Calculate cadence
    const duration = this.speechStartTimestamp > 0
      ? Math.max(1.0, (now - this.speechStartTimestamp) / 1000)
      : 1.0;

    const metrics = computeSpeechCadence(textToSubmit, duration);

    // Reset buffer
    this.accumulatedText = '';
    this.interimText = '';
    this.speechStartTimestamp = 0;

    return { text: textToSubmit, metrics };
  }

  /**
   * Flushes and clears any active buffers and timers.
   */
  public reset(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }
    if (this.silenceNudgeTimer) {
      clearTimeout(this.silenceNudgeTimer);
      this.silenceNudgeTimer = null;
    }
    this.accumulatedText = '';
    this.interimText = '';
    this.speechStartTimestamp = 0;
  }
}

/**
 * Computes words per minute and filler words from an utterance.
 */
export function computeSpeechCadence(text: string, durationSeconds: number): SpeechCadenceMetrics {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const safeDuration = Math.max(0.5, durationSeconds);
  const rawWpm = Math.round((wordCount / safeDuration) * 60);
  const clampedWpm = Math.min(240, Math.max(40, rawWpm));

  const fillerMatches = text.match(FILLER_REGEX) || [];
  const detectedFillers = fillerMatches.map(f => f.toLowerCase());

  return {
    wordCount,
    durationSeconds: safeDuration,
    rawWpm,
    clampedWpm,
    fillerWordCount: detectedFillers.length,
    detectedFillers,
  };
}
