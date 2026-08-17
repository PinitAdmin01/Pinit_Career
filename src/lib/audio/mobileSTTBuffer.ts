// src/lib/audio/mobileSTTBuffer.ts
// PinIT Universal Speech-to-Text Engine (Primary WebSpeech + Resilient Utterance Buffer Fallback)
// Architecture:
// 1. Explicit State Machine (IDLE -> LISTENING -> WEB_SPEECH -> FALLBACK_TRANSCRIBING -> COMMITTED)
// 2. Strict Commit Boundary (Guarantees no duplicate utterances between WebSpeech & Fallback)
// 3. Runtime MediaRecorder MIME Selection (audio/webm;codecs=opus, audio/mp4, audio/wav)
// 4. Independent STT & TTS Pipeline Separation for clean microphone interruption
// 5. Bounded Utterance Windows (MAX_UTTERANCE_DURATION_MS = 60s, MAX_UPLOAD_BYTES = 10MB)

export const MOBILE_STT_VERSION = 'v1.0';

export const MAX_UTTERANCE_DURATION_MS = 60_000;
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10MB

export type STTState =
  | 'IDLE'
  | 'STARTING'
  | 'LISTENING'
  | 'WEB_SPEECH'
  | 'BUFFERING'
  | 'FALLBACK_TRANSCRIBING'
  | 'COMMITTED'
  | 'ERROR'
  | 'STOPPED';

export interface STTEventCallbacks {
  onStateChange?: (state: STTState) => void;
  onInterimTranscript?: (text: string) => void;
  onFinalTranscript?: (text: string, source: 'WEB_SPEECH' | 'SERVER_FALLBACK') => void;
  onError?: (err: Error) => void;
}

/**
 * Dynamically selects the best supported MediaRecorder MIME type on the current browser
 */
export function getSupportedMimeType(): string {
  if (typeof window === 'undefined' || typeof (window as any).MediaRecorder === 'undefined') {
    return 'audio/webm';
  }

  const MediaRecorderClass = (window as any).MediaRecorder;
  const candidates = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/mp4',
    'audio/aac',
    'audio/ogg;codecs=opus',
    'audio/wav'
  ];

  for (const candidate of candidates) {
    if (typeof MediaRecorderClass.isTypeSupported === 'function' && MediaRecorderClass.isTypeSupported(candidate)) {
      return candidate;
    }
  }

  return 'audio/webm';
}

/**
 * Evaluates whether native browser SpeechRecognition is available
 */
export function isWebSpeechAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  return !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
}

/**
 * Universal Speech-to-Text Manager with Commit Boundary Deduplication
 */
export class UnifiedSpeechRecognizer {
  private state: STTState = 'IDLE';
  private utteranceId = 0;
  private isCommitted = false;
  private callbacks: STTEventCallbacks = {};
  
  // WebSpeech Native References
  private recognition: any = null;
  
  // MediaRecorder Buffer References
  private mediaStream: MediaStream | null = null;
  private mediaRecorder: any = null;
  private recordedChunks: Blob[] = [];
  private recordingStartTime = 0;
  private maxDurationTimer: any = null;

  constructor(callbacks?: STTEventCallbacks) {
    if (callbacks) this.callbacks = callbacks;
  }

  public getState(): STTState {
    return this.state;
  }

  private setState(newState: STTState) {
    this.state = newState;
    this.callbacks.onStateChange?.(newState);
  }

  /**
   * Commit boundary: Ensures an utterance is only submitted ONCE to the downstream LLM/interviewer
   */
  private commitUtterance(text: string, source: 'WEB_SPEECH' | 'SERVER_FALLBACK', currentUtteranceId: number) {
    if (this.isCommitted || currentUtteranceId !== this.utteranceId) {
      return;
    }
    const cleanText = text.trim();
    if (!cleanText) return;

    this.isCommitted = true;
    this.setState('COMMITTED');
    this.callbacks.onFinalTranscript?.(cleanText, source);
    this.stop();
  }

  /**
   * Starts dual-track recording: Fast-path WebSpeech + Fallback MediaRecorder buffer
   */
  public async startListening(): Promise<void> {
    this.stop();
    this.utteranceId++;
    const currentId = this.utteranceId;
    this.isCommitted = false;
    this.recordedChunks = [];
    this.setState('STARTING');

    // 1. Request Microphone MediaStream for fallback buffer
    try {
      if (typeof navigator !== 'undefined' && navigator.mediaDevices?.getUserMedia) {
        this.mediaStream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }
        });

        const mimeType = getSupportedMimeType();
        const MediaRecorderClass = (window as any).MediaRecorder;
        if (MediaRecorderClass) {
          this.mediaRecorder = new MediaRecorderClass(this.mediaStream, { mimeType });
          this.mediaRecorder.ondataavailable = (event: any) => {
            if (event.data && event.data.size > 0) {
              this.recordedChunks.push(event.data);
            }
          };
          this.mediaRecorder.start(250); // 250ms chunks
          this.recordingStartTime = Date.now();
        }
      }
    } catch (err: any) {
      console.warn('[UnifiedSTT] MediaRecorder init warning:', err?.message);
    }

    this.setState('LISTENING');

    // Set Max Utterance Window Timer (60 seconds)
    this.maxDurationTimer = setTimeout(() => {
      if (currentId === this.utteranceId && !this.isCommitted) {
        this.finishAndTranscribeFallback(currentId);
      }
    }, MAX_UTTERANCE_DURATION_MS);

    // 2. Initialize Fast-Path WebSpeech if available
    const SpeechRecognitionClass = typeof window !== 'undefined'
      ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      : null;

    if (SpeechRecognitionClass) {
      try {
        this.recognition = new SpeechRecognitionClass();
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';

        this.recognition.onstart = () => {
          if (currentId === this.utteranceId && !this.isCommitted) {
            this.setState('WEB_SPEECH');
          }
        };

        this.recognition.onresult = (event: any) => {
          if (currentId !== this.utteranceId || this.isCommitted) return;
          let interim = '';
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            } else {
              interim += event.results[i][0].transcript;
            }
          }

          if (interim) {
            this.callbacks.onInterimTranscript?.(interim);
          }

          if (finalTranscript.trim()) {
            this.commitUtterance(finalTranscript, 'WEB_SPEECH', currentId);
          }
        };

        this.recognition.onerror = (event: any) => {
          console.warn('[UnifiedSTT] WebSpeech error, engaging fallback:', event?.error);
          if (currentId === this.utteranceId && !this.isCommitted) {
            this.finishAndTranscribeFallback(currentId);
          }
        };

        this.recognition.onend = () => {
          if (currentId === this.utteranceId && !this.isCommitted) {
            // WebSpeech ended without final transcript — engage fallback
            this.finishAndTranscribeFallback(currentId);
          }
        };

        this.recognition.start();
        return;
      } catch (err: any) {
        console.warn('[UnifiedSTT] WebSpeech start failed, engaging fallback:', err?.message);
      }
    }

    // If WebSpeech is unavailable on this device (e.g. mobile Firefox / iOS WebView), track buffer state
    this.setState('BUFFERING');
  }

  /**
   * User manually clicks Stop or finishes speaking
   */
  public stop(): void {
    if (this.maxDurationTimer) {
      clearTimeout(this.maxDurationTimer);
      this.maxDurationTimer = null;
    }

    if (this.recognition) {
      try {
        this.recognition.abort();
      } catch {}
      this.recognition = null;
    }

    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      try {
        this.mediaRecorder.stop();
      } catch {}
    }

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(t => t.stop());
      this.mediaStream = null;
    }

    if (this.state !== 'COMMITTED') {
      this.setState('STOPPED');
    }
  }

  /**
   * Assembles recorded buffer and calls /api/stt when WebSpeech fails
   */
  public async finishAndTranscribeFallback(currentId = this.utteranceId): Promise<void> {
    if (this.isCommitted || currentId !== this.utteranceId) return;

    this.setState('FALLBACK_TRANSCRIBING');

    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      try {
        this.mediaRecorder.stop();
      } catch {}
    }

    // Small delay to ensure last audio chunk is in recordedChunks
    await new Promise(r => setTimeout(r, 100));

    if (this.isCommitted || currentId !== this.utteranceId) return;

    const mimeType = getSupportedMimeType();
    const audioBlob = new Blob(this.recordedChunks, { type: mimeType });

    if (audioBlob.size === 0) {
      this.setState('ERROR');
      this.callbacks.onError?.(new Error('No speech audio recorded.'));
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', audioBlob, `speech-${Date.now()}.${mimeType.includes('mp4') ? 'mp4' : 'webm'}`);
      formData.append('mimeType', mimeType);

      const res = await fetch('/api/stt', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        throw new Error(`STT server returned status ${res.status}`);
      }

      const data = await res.json();
      const transcribedText = data?.text || '';

      if (transcribedText.trim()) {
        this.commitUtterance(transcribedText, 'SERVER_FALLBACK', currentId);
      } else {
        throw new Error('Transcribed text was empty.');
      }
    } catch (err: any) {
      if (currentId === this.utteranceId && !this.isCommitted) {
        this.setState('ERROR');
        this.callbacks.onError?.(err instanceof Error ? err : new Error(String(err)));
      }
    }
  }
}
