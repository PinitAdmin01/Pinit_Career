// src/lib/audio/streamingAudioQueue.ts
// PinIT Low-Latency Sentence-Level TTS Streaming & Audio Queue Scheduler
// Architecture:
// 1. Hierarchical Sentence Boundary Splitter (protects abbreviations, decimals, tech acronyms)
// 2. Bounded Concurrency Prefetch Pipeline (MAX_IN_FLIGHT_TTS = 2)
// 3. Gapless Web Audio API Queue Scheduler (AudioBufferSourceNode on AudioContext.currentTime)
// 4. Deterministic Hard Interruption (AbortController + Buffer Drain)

import { sanitizeForSpeech } from '../sanitizeLLM';
import { synthesizeVoice } from '../smartVoiceRouter';

export const TTS_STREAMING_VERSION = 'v1.0';
export const MAX_IN_FLIGHT_TTS = 2;

// Protected tokens that should not trigger sentence breaks
const PROTECTED_ABBREVIATIONS = [
  'e.g.', 'i.e.', 'dr.', 'mr.', 'ms.', 'mrs.', 'prof.', 'etc.', 'vs.',
  'v1.0', 'v2.0', 'c++', 'node.js', 'next.js', 'react.js', 'vue.js',
  'api', 'aws', 'gcp', 'sde', 'sql', 'ast', 'p95', 'p99'
];

/**
 * Splits text into natural vocal cadence chunks using a robust 4-tier hierarchy:
 * Tier 1: Paragraph boundaries (\n\n, \n)
 * Tier 2: Terminal punctuation (. ? !) with abbreviation protection
 * Tier 3: Comma / Semicolon / Colon / Dash fallback for long clauses
 * Tier 4: Safe word boundary wrapping (max 140 chars)
 */
export function splitIntoSentences(text: string): string[] {
  const sanitized = sanitizeForSpeech(text || '').trim();
  if (!sanitized) return [];

  // Protect decimals (e.g. 3.14 -> 3__DOT__14) and version strings
  let masked = sanitized.replace(/(\d+)\.(\d+)/g, '$1__DOT__$2');

  // Protect known abbreviations (e.g. e.g. -> e__DOT__g__DOT__)
  PROTECTED_ABBREVIATIONS.forEach(abbr => {
    const escaped = abbr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escaped, 'gi');
    masked = masked.replace(regex, match => match.replace(/\./g, '__DOT__'));
  });

  // Step 1: Split on terminal punctuation followed by space or end of string
  const rawSegments = masked
    .split(/(?<=[.?!])\s+(?=[A-Z0-9"']|$)/g)
    .map(s => s.trim())
    .filter(Boolean);

  const finalChunks: string[] = [];

  rawSegments.forEach(segment => {
    // Restore protected dots
    const unmasked = segment.replace(/__DOT__/g, '.');

    // If segment is reasonable length (<= 140 chars), keep as one chunk
    if (unmasked.length <= 140) {
      finalChunks.push(unmasked);
      return;
    }

    // Tier 3: Split long sentences at commas, semicolons, colons, or dashes
    const subClauses = unmasked.split(/(?<=[,;:\-–—])\s+/);
    let currentChunk = '';

    subClauses.forEach(clause => {
      if ((currentChunk + ' ' + clause).trim().length <= 140) {
        currentChunk = currentChunk ? `${currentChunk} ${clause}` : clause;
      } else {
        if (currentChunk) finalChunks.push(currentChunk);
        // Tier 4: If single clause itself exceeds 140 chars, split on word boundary
        if (clause.length > 140) {
          const words = clause.split(/\s+/);
          let wordChunk = '';
          words.forEach(w => {
            if ((wordChunk + ' ' + w).trim().length <= 140) {
              wordChunk = wordChunk ? `${wordChunk} ${w}` : w;
            } else {
              if (wordChunk) finalChunks.push(wordChunk);
              wordChunk = w;
            }
          });
          if (wordChunk) currentChunk = wordChunk;
          else currentChunk = '';
        } else {
          currentChunk = clause;
        }
      }
    });

    if (currentChunk) {
      finalChunks.push(currentChunk);
    }
  });

  return finalChunks.filter(c => c.trim().length > 0);
}

export interface StreamTTSCallbacks {
  onStart?: () => void;
  onSentenceStart?: (sentenceIndex: number, sentenceText: string) => void;
  onSentenceEnd?: (sentenceIndex: number) => void;
  onEnd?: () => void;
  onError?: (err: Error) => void;
}

export interface StreamTTSOptions {
  voice?: string;
  speed?: number;
  bypassCache?: boolean;
  minDurationMs?: number;
}

/**
 * High-precision Gapless Audio Queue Player for Web Audio API
 */
export class SentenceAudioQueuePlayer {
  private audioCtx: AudioContext | null = null;
  private activeSources: AudioBufferSourceNode[] = [];
  private abortController: AbortController = new AbortController();
  private isCancelled = false;
  private currentPlayId = 0;
  private scheduledPlaybackTime = 0;
  private isPlaying = false;

  constructor(audioCtx?: AudioContext) {
    if (audioCtx) {
      this.audioCtx = audioCtx;
    }
  }

  private getAudioContext(): AudioContext {
    if (!this.audioCtx) {
      const win = typeof window !== 'undefined' ? (window as any) : {};
      if (!win._sharedAudioCtx) {
        win._sharedAudioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      this.audioCtx = win._sharedAudioCtx;
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
    return this.audioCtx!;
  }

  public getAbortSignal(): AbortSignal {
    return this.abortController.signal;
  }

  public isCurrentlyPlaying(): boolean {
    return this.isPlaying;
  }

  public stopAll() {
    this.isCancelled = true;
    this.currentPlayId++;
    this.abortController.abort();
    this.abortController = new AbortController();

    this.activeSources.forEach(src => {
      try {
        src.stop();
        src.disconnect();
      } catch {}
    });
    this.activeSources = [];
    this.scheduledPlaybackTime = 0;
    this.isPlaying = false;
  }

  /**
   * Pipelined execution of sentence-by-sentence TTS synthesis and gapless scheduling
   */
  public async playSentenceStream(
    sentences: string[],
    options?: StreamTTSOptions,
    callbacks?: StreamTTSCallbacks
  ): Promise<void> {
    this.stopAll();
    this.isCancelled = false;
    const playId = ++this.currentPlayId;
    const ctx = this.getAudioContext();

    if (sentences.length === 0) {
      callbacks?.onEnd?.();
      return;
    }

    callbacks?.onStart?.();
    this.isPlaying = true;

    // Buffer map to hold synthesized AudioBuffers; null = pending, false = failed
    const decodedBuffers: (AudioBuffer | null | false)[] = new Array(sentences.length).fill(null);
    let nextChunkToFetch = 0;
    let nextChunkToSchedule = 0;
    let inFlightCount = 0;
    // Track how many sentences were actually scheduled on the AudioContext timeline
    let totalScheduled = 0;
    let completedSentencesCount = 0;

    // Helper: check if all scheduled sentences have finished (or if all chunks are done)
    const checkAllDone = () => {
      if (this.isCancelled || playId !== this.currentPlayId) return;
      const allFetched = nextChunkToFetch >= sentences.length && inFlightCount === 0;
      if (allFetched && completedSentencesCount >= totalScheduled) {
        this.isPlaying = false;
        callbacks?.onEnd?.();
      }
    };

    // Helper: Fetches and decodes a single sentence chunk
    const fetchChunk = async (index: number): Promise<void> => {
      if (this.isCancelled || playId !== this.currentPlayId) return;
      inFlightCount++;

      try {
        const sentenceText = sentences[index];
        const res = await synthesizeVoice({
          text: sentenceText,
          voice: options?.voice || 'af_bella',
          speed: options?.speed || 1.0,
          bypassCache: options?.bypassCache
        });

        if (this.isCancelled || playId !== this.currentPlayId) return;

        const audioBuf = await ctx.decodeAudioData(res.audioBuffer.slice(0));
        decodedBuffers[index] = audioBuf;
      } catch (err: any) {
        if (!this.isCancelled) {
          console.warn(`[SentenceAudioQueuePlayer] Error fetching chunk #${index}:`, err?.message);
        }
        // Mark as failed so scheduleReadyChunks skips it and checkAllDone counts correctly
        decodedBuffers[index] = false;
      } finally {
        inFlightCount--;
      }
    };

    // Helper: Pumps the prefetch queue maintaining MAX_IN_FLIGHT_TTS constraint
    const pumpPrefetch = () => {
      while (inFlightCount < MAX_IN_FLIGHT_TTS && nextChunkToFetch < sentences.length && !this.isCancelled) {
        const idx = nextChunkToFetch++;
        fetchChunk(idx).then(() => {
          if (!this.isCancelled && playId === this.currentPlayId) {
            scheduleReadyChunks();
            pumpPrefetch();
            // If no more chunks to fetch and none in-flight, verify completion
            if (inFlightCount === 0 && nextChunkToFetch >= sentences.length) {
              checkAllDone();
            }
          }
        });
      }
    };

    // Helper: Schedules decoded AudioBuffers on ctx.currentTime timeline
    const scheduleReadyChunks = () => {
      if (this.isCancelled || playId !== this.currentPlayId) return;

      while (nextChunkToSchedule < sentences.length) {
        const buf = decodedBuffers[nextChunkToSchedule];
        if (buf === null) break; // Still pending — stop and wait

        const idx = nextChunkToSchedule;
        nextChunkToSchedule++;

        if (buf === false) {
          // Chunk failed — skip but count as "done" so we don't hang
          completedSentencesCount++;
          checkAllDone();
          continue;
        }

        totalScheduled++;
        const now = ctx.currentTime;
        const startTime = Math.max(now + 0.03, this.scheduledPlaybackTime);
        const duration = buf.duration;
        this.scheduledPlaybackTime = startTime + duration;

        const source = ctx.createBufferSource();
        source.buffer = buf;
        source.connect(ctx.destination);
        this.activeSources.push(source);

        source.start(startTime);

        const delayToStartMs = Math.max(0, (startTime - now) * 1000);
        setTimeout(() => {
          if (!this.isCancelled && playId === this.currentPlayId) {
            callbacks?.onSentenceStart?.(idx, sentences[idx]);
          }
        }, delayToStartMs);

        source.onended = () => {
          if (this.isCancelled || playId !== this.currentPlayId) return;
          callbacks?.onSentenceEnd?.(idx);
          completedSentencesCount++;
          checkAllDone();
        };
      }
    };

    // Kick off initial prefetch window
    pumpPrefetch();
  }
}

// Global Singleton Audio Queue Instance
let _globalAudioQueue: SentenceAudioQueuePlayer | null = null;

export function getGlobalAudioQueue(): SentenceAudioQueuePlayer {
  if (typeof window === 'undefined') {
    return new SentenceAudioQueuePlayer();
  }
  if (!_globalAudioQueue) {
    _globalAudioQueue = new SentenceAudioQueuePlayer();
  }
  return _globalAudioQueue;
}
