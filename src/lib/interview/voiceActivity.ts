/**
 * Voice Activity Detection (300-3400 Hz speech band RMS), Sustained Barge-In Detector,
 * and Browser Speech Synthesis Unlocker.
 */

export interface SpeechBandMetrics {
  speechRms: number;
  fullRms: number;
  normalizedLevel: number;
}

/**
 * Computes Root Mean Square (RMS) acoustic energy strictly within the 300-3400 Hz human vocal band,
 * isolating human speech from low-frequency fan/AC hum and high-frequency electrical noise.
 */
export function computeSpeechBandRms(
  freqData: Uint8Array,
  sampleRate: number,
  fftSize: number
): SpeechBandMetrics {
  if (!freqData || freqData.length === 0 || !sampleRate || !fftSize) {
    return { speechRms: 0, fullRms: 0, normalizedLevel: 0 };
  }

  const hzPerBin = sampleRate / fftSize;
  const loBin = Math.max(1, Math.floor(300 / hzPerBin));
  const hiBin = Math.min(freqData.length - 1, Math.ceil(3400 / hzPerBin));

  let speechSum = 0;
  let speechCount = 0;
  for (let i = loBin; i <= hiBin; i++) {
    const val = freqData[i];
    speechSum += val * val;
    speechCount++;
  }
  const speechRms = speechCount > 0 ? Math.sqrt(speechSum / speechCount) : 0;

  let fullSum = 0;
  for (let i = 0; i < freqData.length; i++) {
    const val = freqData[i];
    fullSum += val * val;
  }
  const fullRms = Math.sqrt(fullSum / freqData.length);

  // Map speech RMS (typically 0..90 on byte FFT bins) into a responsive 0..100 UI level
  const normalizedLevel = Math.min(100, Math.max(0, Math.round((speechRms / 65) * 100)));

  return { speechRms, fullRms, normalizedLevel };
}

export interface SpeechBargeInOptions {
  /** Minimum 300-3400 Hz speech RMS required to treat frame as active human speech (default 18). */
  speechThreshold?: number;
  /** Duration in ms of sustained speech required before interrupting avatar (default 360ms). */
  sustainedMs?: number;
  /** Invoked once when sustained human speech crosses threshold during avatar speaking. */
  onBargeIn: () => void;
  /** Optional listener receiving smoothed 0-100 level on every evaluated frame. */
  onLevel?: (normalizedLevel: number) => void;
}

export interface SpeechBargeInDetector {
  evaluate: (speechRms: number, nowMs?: number, normalizedLevel?: number) => boolean;
  reset: () => void;
}

/**
 * Creates a deterministic sustained-speech barge-in state machine that ignores transient
 * coughs, keyboard clicks, or sub-300ms background spikes before interrupting avatar playback.
 */
export function createSpeechBargeInDetector(options: SpeechBargeInOptions): SpeechBargeInDetector {
  const threshold = typeof options.speechThreshold === 'number' ? options.speechThreshold : 18;
  const sustainedMs = typeof options.sustainedMs === 'number' ? options.sustainedMs : 360;

  let speechActiveSince: number | null = null;
  let triggered = false;

  return {
    evaluate(speechRms: number, nowMs: number = Date.now(), normalizedLevel?: number): boolean {
      if (options.onLevel) {
        const lvl = typeof normalizedLevel === 'number'
          ? normalizedLevel
          : Math.min(100, Math.max(0, Math.round((speechRms / 65) * 100)));
        options.onLevel(lvl);
      }

      if (speechRms >= threshold) {
        if (speechActiveSince === null) {
          speechActiveSince = nowMs;
        }
        if (!triggered && nowMs - speechActiveSince >= sustainedMs) {
          triggered = true;
          options.onBargeIn();
          return true;
        }
      } else {
        speechActiveSince = null;
        triggered = false;
      }

      return false;
    },
    reset() {
      speechActiveSince = null;
      triggered = false;
    }
  };
}

/**
 * Unlocks browser Web Speech API synthesis synchronously inside a user-click gesture
 * so subsequent asynchronous LLM replies can speak aloud without Safari/Chrome autoplay blocks.
 */
export function unlockSpeechSynthesis(): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  try {
    if (window.speechSynthesis.speaking || window.speechSynthesis.pending) return;
    const utterance = new SpeechSynthesisUtterance(' ');
    utterance.volume = 0;
    utterance.rate = 10;
    window.speechSynthesis.speak(utterance);
  } catch {
    // Non-fatal in headless or restricted browsers
  }
}
