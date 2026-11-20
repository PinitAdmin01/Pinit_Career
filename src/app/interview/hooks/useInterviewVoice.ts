'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { speakWithAvatar as speakWithAvatarRaw, stopSpeaking, getAvatarVoiceVolume, setAvatarVoiceVolume } from '@/lib/tts';
import { setSoundscapeDucking } from '@/lib/audio/soundscapes';
import { pingRenderServer } from '@/lib/smartVoiceRouter';
import { SpeechDebounceManager } from '@/lib/interview/speechDebounce';
import { computeSpeechBandRms, createSpeechBargeInDetector } from '@/lib/interview/voiceActivity';
import { Stage } from '../interviewTypes';

interface UseInterviewVoiceProps {
  isInterviewActive: boolean;
  activeStage: Stage;
  activeTopicName: string;
  activeTeacherId: string;
  difficulty: 'easy' | 'normal' | 'hard';
  onFinalTranscript: (text: string) => void;
  onSilenceNudge: (text: string) => void;
  isTabInactive?: boolean;
}

export function useInterviewVoice({
  isInterviewActive,
  activeStage,
  activeTopicName,
  difficulty,
  onFinalTranscript,
  onSilenceNudge,
  isTabInactive
}: UseInterviewVoiceProps) {
  const [autoVoiceLoop, setAutoVoiceLoop] = useState(true);
  const autoVoiceLoopRef = useRef(true);
  const silenceTimerRef = useRef<any>(null);
  const [liveSpeechTranscript, setLiveSpeechTranscript] = useState<string>('');
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const isVoiceListeningRef = useRef(false);
  const [isAvatarSpeaking, setIsAvatarSpeaking] = useState(false);
  const isAvatarSpeakingRef = useRef<boolean>(false);
  const recognitionRef = useRef<any>(null);
  const autoRestartTimerRef = useRef<any>(null);
  const micRetryCountRef = useRef<number>(0);
  const lastSpokenEndTimeRef = useRef<number>(0);
  const speechStartTimeRef = useRef<number>(0);
  const isStartingRef = useRef<boolean>(false);
  const isStoppingRef = useRef<boolean>(false);
  const userPausedMicRef = useRef<boolean>(false);
  const hasStartedMicOnceRef = useRef<boolean>(false);
  const [hasStartedMicOnce, setHasStartedMicOnce] = useState<boolean>(false);
  const avatarSpeechStartTimeRef = useRef<number>(0);
  const isAssistPreviewSpeakingRef = useRef<boolean>(false);
  const silenceNudgeFiredRef = useRef<boolean>(false);

  const debouncerRef = useRef<SpeechDebounceManager>(
    new SpeechDebounceManager({
      silenceThresholdMs: 2600,
      duplicateWindowMs: 2500,
      minWordCount: 1,
    })
  );

  const wasListeningBeforeHiddenRef = useRef<boolean>(false);
  const [isTabInactiveState, setIsTabInactiveState] = useState<boolean>(false);
  const isTabInactiveRef = useRef<boolean>(Boolean(isTabInactive));

  const isMountedRef = useRef<boolean>(true);
  const isInterviewActiveRef = useRef<boolean>(false);

  const [wpmScore, setWpmScore] = useState<number | null>(null);
  const [fillerWordCount, setFillerWordCount] = useState(0);
  const [isSpeechSupported, setIsSpeechSupported] = useState<boolean>(true);
  const [micAudioLevel, setMicAudioLevel] = useState<number>(0);
  const [bargeInEnabled, setBargeInEnabled] = useState<boolean>(false);
  const bargeInEnabledRef = useRef<boolean>(false);
  bargeInEnabledRef.current = bargeInEnabled;

  // Audio Volume Control State (0-100)
  const [avatarVolume, setAvatarVolumeState] = useState<number>(() => Math.round(getAvatarVoiceVolume() * 100));

  const handleVolumeChange = (newVol: number) => {
    setAvatarVolumeState(newVol);
    setAvatarVoiceVolume(newVol / 100);
  };

  useEffect(() => {
    isVoiceListeningRef.current = isVoiceListening;
  }, [isVoiceListening]);

  useEffect(() => {
    isInterviewActiveRef.current = isInterviewActive;
    if (isInterviewActive) {
      void pingRenderServer(false);
    } else {
      userPausedMicRef.current = false;
      isAssistPreviewSpeakingRef.current = false;
      hasStartedMicOnceRef.current = false;
      setHasStartedMicOnce(false);
      debouncerRef.current.reset();
      setLiveSpeechTranscript('');
      setMicAudioLevel(0);
    }
  }, [isInterviewActive]);

  useEffect(() => {
    autoVoiceLoopRef.current = autoVoiceLoop;
  }, [autoVoiceLoop]);

  // Cleanly clear unsubmitted utterances on round transitions
  useEffect(() => {
    debouncerRef.current.reset();
    setLiveSpeechTranscript('');
  }, [activeStage]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasSpeech = Boolean((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
      setIsSpeechSupported(hasSpeech);
    }
  }, []);

  const flushAndSubmitTranscript = useCallback(() => {
    silenceNudgeFiredRef.current = false;
    const committed = debouncerRef.current.commitSubmission();
    setLiveSpeechTranscript('');
    if (!committed) {
      debouncerRef.current.reset();
      return;
    }

    if (recognitionRef.current) {
      try {
        isStoppingRef.current = true;
        recognitionRef.current.stop();
      } catch {}
    }

    const { text: fullTranscript, metrics } = committed;
    const rawWpm = Math.min(220, Math.max(60, metrics.clampedWpm));
    if (metrics.wordCount >= 3) {
      setWpmScore(prev => (prev === null ? rawWpm : Math.round(prev * 0.45 + rawWpm * 0.55)));
    }
    if (metrics.fillerWordCount > 0) {
      setFillerWordCount(prev => prev + metrics.fillerWordCount);
    }

    console.log('[Speech STT] Submitting finalized candidate speech:', fullTranscript);
    onFinalTranscript(fullTranscript);
  }, [onFinalTranscript]);

  const stopRecognitionOnly = useCallback(() => {
    debouncerRef.current.reset();
    setLiveSpeechTranscript('');
    if (recognitionRef.current) {
      try {
        isStoppingRef.current = true;
        recognitionRef.current.stop();
      } catch {}
    }
    setIsVoiceListening(false);
    isVoiceListeningRef.current = false;
    isStartingRef.current = false;
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    if (autoRestartTimerRef.current) clearTimeout(autoRestartTimerRef.current);
  }, []);

  const stopVoiceListening = useCallback(() => {
    stopRecognitionOnly();
  }, [stopRecognitionOnly]);

  const pauseVoiceListening = useCallback(() => {
    userPausedMicRef.current = true;
    stopRecognitionOnly();
  }, [stopRecognitionOnly]);

  const startRecognitionInternalRef = useRef<(clearUserPause?: boolean) => void>(() => {});

  const startRecognitionInternal = useCallback((clearUserPause: boolean = false) => {
    if (clearUserPause) {
      userPausedMicRef.current = false;
      if (isAssistPreviewSpeakingRef.current) {
        isAssistPreviewSpeakingRef.current = false;
        stopSpeaking();
        setSoundscapeDucking(false);
      }
    }
    if (typeof window === 'undefined' || !isMountedRef.current) return;
    if (typeof document !== 'undefined' && document.visibilityState === 'hidden') return;
    if (isTabInactiveRef.current || userPausedMicRef.current) return;
    if (!isInterviewActiveRef.current && !isInterviewActive) return;

    if (isStartingRef.current || isAvatarSpeakingRef.current || isAssistPreviewSpeakingRef.current) return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSpeechSupported(false);
      return;
    }

    if (recognitionRef.current && isVoiceListeningRef.current) {
      return;
    }

    const now = Date.now();
    if (now - lastSpokenEndTimeRef.current < 350) {
      if (autoRestartTimerRef.current) clearTimeout(autoRestartTimerRef.current);
      autoRestartTimerRef.current = setTimeout(() => {
        if (isMountedRef.current && !userPausedMicRef.current) startRecognitionInternalRef.current(false);
      }, 350);
      return;
    }

    isStartingRef.current = true;

    try {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
        recognitionRef.current = null;
      }

      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'en-US';

      rec.onstart = () => {
        isStartingRef.current = false;
        isStoppingRef.current = false;
        micRetryCountRef.current = 0;
        if (!hasStartedMicOnceRef.current) {
          hasStartedMicOnceRef.current = true;
          setHasStartedMicOnce(true);
        }
        speechStartTimeRef.current = Date.now();
        isVoiceListeningRef.current = true;
        setIsVoiceListening(true);

        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        if (!silenceNudgeFiredRef.current) {
          if (activeStage === 'round1_behavioral' || activeStage === 'round4_star') {
            silenceTimerRef.current = setTimeout(() => {
              if (autoVoiceLoopRef.current && !isAvatarSpeakingRef.current && !userPausedMicRef.current && !debouncerRef.current.getCurrentTranscript() && !silenceNudgeFiredRef.current) {
                silenceNudgeFiredRef.current = true;
                const nudgeMsg = `Take all the time you need! When you're ready, feel free to share your thoughts or explain your approach for ${activeTopicName}.`;
                onSilenceNudge(nudgeMsg);
              }
            }, 45000);
          } else if (activeStage === 'round2_coding') {
            silenceTimerRef.current = setTimeout(() => {
              if (autoVoiceLoopRef.current && !isAvatarSpeakingRef.current && !userPausedMicRef.current && !debouncerRef.current.getCurrentTranscript() && !silenceNudgeFiredRef.current) {
                silenceNudgeFiredRef.current = true;
                const nudgeMsg = `How is your implementation coming along? Feel free to explain your approach out loud, or check the hints toggle if you need a nudge!`;
                onSilenceNudge(nudgeMsg);
              }
            }, 90000);
          } else if (activeStage === 'round3_systems') {
            silenceTimerRef.current = setTimeout(() => {
              if (autoVoiceLoopRef.current && !isAvatarSpeakingRef.current && !userPausedMicRef.current && !debouncerRef.current.getCurrentTranscript() && !silenceNudgeFiredRef.current) {
                silenceNudgeFiredRef.current = true;
                const nudgeMsg = `As you lay out your architecture nodes for ${activeTopicName}, consider explaining how traffic flows across your tiers.`;
                onSilenceNudge(nudgeMsg);
              }
            }, 90000);
          }
        }
      };

      rec.onresult = (e: any) => {
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        silenceNudgeFiredRef.current = false;

        // Echo protection: ignore mic transcript if avatar or assist preview is actively speaking
        if (isAvatarSpeakingRef.current || isAssistPreviewSpeakingRef.current) {
          return;
        }

        let interim = '';
        let newFinalChunk = '';

        for (let i = e.resultIndex; i < e.results.length; ++i) {
          if (e.results[i].isFinal) {
            newFinalChunk += ' ' + e.results[i][0].transcript;
          } else {
            interim += e.results[i][0].transcript;
          }
        }

        const triggerFlush = () => {
          if (!isAvatarSpeakingRef.current && !isAssistPreviewSpeakingRef.current && !userPausedMicRef.current && debouncerRef.current.getCurrentTranscript().trim().length > 2) {
            flushAndSubmitTranscript();
          }
        };

        let currentDisplay = debouncerRef.current.getCurrentTranscript();
        const hasFinal = Boolean(newFinalChunk.trim());
        const hasInterim = Boolean(interim.trim());
        if (hasFinal) {
          micRetryCountRef.current = 0;
          currentDisplay = debouncerRef.current.handleFinalChunk(
            newFinalChunk,
            hasInterim ? undefined : triggerFlush
          );
        }
        if (hasInterim) {
          currentDisplay = debouncerRef.current.handleInterimChunk(interim, triggerFlush);
        }

        if (currentDisplay) {
          setLiveSpeechTranscript(currentDisplay);
        }
      };

      rec.onerror = (e: any) => {
        isStartingRef.current = false;
        const errType = e?.error || '';

        if (errType === 'no-speech') {
          if (autoVoiceLoopRef.current && !isAvatarSpeakingRef.current && !isAssistPreviewSpeakingRef.current && !userPausedMicRef.current && isMountedRef.current) {
            if (autoRestartTimerRef.current) clearTimeout(autoRestartTimerRef.current);
            autoRestartTimerRef.current = setTimeout(() => {
              if (isMountedRef.current && !isAvatarSpeakingRef.current && !isAssistPreviewSpeakingRef.current && !userPausedMicRef.current) {
                startRecognitionInternalRef.current(false);
              }
            }, 600);
          }
          return;
        }

        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        isVoiceListeningRef.current = false;
        setIsVoiceListening(false);

        if (errType === 'not-allowed' || errType === 'service-not-allowed' || errType === 'audio-capture') {
          console.warn('[Speech STT] Microphone permission denied or capture error:', errType);
          return;
        }

        if (micRetryCountRef.current >= 6) {
          console.warn('[Speech STT] Multiple audio recovery attempts made. Ready for user click.');
          return;
        }
        micRetryCountRef.current += 1;

        if (typeof document !== 'undefined' && document.visibilityState === 'hidden') return;
        if (isTabInactiveRef.current || userPausedMicRef.current) return;

        if (autoVoiceLoopRef.current && !isAvatarSpeakingRef.current && !isAssistPreviewSpeakingRef.current) {
          if (autoRestartTimerRef.current) clearTimeout(autoRestartTimerRef.current);
          autoRestartTimerRef.current = setTimeout(() => {
            if (isMountedRef.current && !isAvatarSpeakingRef.current && !isAssistPreviewSpeakingRef.current && !userPausedMicRef.current) {
              startRecognitionInternalRef.current(false);
            }
          }, 1200);
        }
      };

      rec.onend = () => {
        isStartingRef.current = false;
        isStoppingRef.current = false;
        isVoiceListeningRef.current = false;
        setIsVoiceListening(false);

        if (typeof document !== 'undefined' && document.visibilityState === 'hidden') return;
        if (isTabInactiveRef.current || userPausedMicRef.current || isAssistPreviewSpeakingRef.current) return;

        if (debouncerRef.current.getCurrentTranscript().trim()) {
          flushAndSubmitTranscript();
          return;
        }

        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);

        if (autoVoiceLoopRef.current && !isAvatarSpeakingRef.current && !isAssistPreviewSpeakingRef.current && isMountedRef.current) {
          if (autoRestartTimerRef.current) clearTimeout(autoRestartTimerRef.current);
          autoRestartTimerRef.current = setTimeout(() => {
            if (isMountedRef.current && !isAvatarSpeakingRef.current && !isAssistPreviewSpeakingRef.current && isInterviewActiveRef.current && !userPausedMicRef.current) {
              startRecognitionInternalRef.current(false);
            }
          }, 700);
        }
      };

      recognitionRef.current = rec;
      rec.start();
    } catch {
      isStartingRef.current = false;
      if (autoVoiceLoopRef.current && !isAvatarSpeakingRef.current && !isAssistPreviewSpeakingRef.current && !userPausedMicRef.current && micRetryCountRef.current < 4) {
        micRetryCountRef.current += 1;
        setTimeout(() => {
          if (isMountedRef.current && !userPausedMicRef.current && !isAssistPreviewSpeakingRef.current) startRecognitionInternalRef.current(false);
        }, 800);
      }
    }
  }, [activeStage, activeTopicName, onSilenceNudge, isInterviewActive, flushAndSubmitTranscript]);

  startRecognitionInternalRef.current = startRecognitionInternal;

  // Explicit user-initiated or button start clears any user pause lock
  const startVoiceListening = useCallback(() => {
    startRecognitionInternal(true);
  }, [startRecognitionInternal]);

  const speakWithAvatar = useCallback((text: string, teacherId: string, onStart: () => void, onEnd: () => void) => {
    isAssistPreviewSpeakingRef.current = false;
    isAvatarSpeakingRef.current = true;
    setIsAvatarSpeaking(true);

    debouncerRef.current.reset();

    if (recognitionRef.current) {
      try {
        isStoppingRef.current = true;
        recognitionRef.current.stop();
      } catch {}
    }

    speakWithAvatarRaw(text, teacherId, () => {
      isAvatarSpeakingRef.current = true;
      avatarSpeechStartTimeRef.current = Date.now();
      setIsAvatarSpeaking(true);
      setSoundscapeDucking(true);
      onStart();
    }, () => {
      isAvatarSpeakingRef.current = false;
      setIsAvatarSpeaking(false);
      setSoundscapeDucking(false);
      lastSpokenEndTimeRef.current = Date.now();
      onEnd();
      if (autoVoiceLoopRef.current && (isInterviewActiveRef.current || isInterviewActive) && isMountedRef.current && !userPausedMicRef.current && !isAssistPreviewSpeakingRef.current) {
        setTimeout(() => {
          if (isMountedRef.current && !isAvatarSpeakingRef.current && !isAssistPreviewSpeakingRef.current && !userPausedMicRef.current) {
            startRecognitionInternalRef.current(false);
          }
        }, 500);
      }
    }, false, true, difficulty, 1.0, 15000, { startDeadlineMs: 3500 });
  }, [difficulty, isInterviewActive]);

  const previewAssistSpeech = useCallback((
    text: string,
    teacherId: string,
    onStart: () => void = () => {},
    onEnd: () => void = () => {},
    _allowMicRestart: boolean = false,
    _isAssistScript: boolean = true,
    diff: string = difficulty
  ) => {
    isAssistPreviewSpeakingRef.current = true;
    if (autoRestartTimerRef.current) {
      clearTimeout(autoRestartTimerRef.current);
      autoRestartTimerRef.current = null;
    }
    debouncerRef.current.reset();
    if (recognitionRef.current) {
      try {
        isStoppingRef.current = true;
        recognitionRef.current.stop();
      } catch {}
    }
    speakWithAvatarRaw(
      text,
      teacherId,
      () => {
        isAssistPreviewSpeakingRef.current = true;
        setSoundscapeDucking(true);
        onStart();
      },
      () => {
        isAssistPreviewSpeakingRef.current = false;
        setSoundscapeDucking(false);
        lastSpokenEndTimeRef.current = Date.now();
        onEnd();
      },
      false,
      true,
      (diff as 'easy' | 'normal' | 'hard') || difficulty,
      1.0,
      15000,
      { startDeadlineMs: 3500 }
    );
  }, [difficulty]);

  const interruptSpeech = useCallback(() => {
    stopSpeaking();
    setSoundscapeDucking(false);
    isAssistPreviewSpeakingRef.current = false;
    isAvatarSpeakingRef.current = false;
    setIsAvatarSpeaking(false);
    startRecognitionInternalRef.current(true);
  }, []);

  const interruptSpeechRef = useRef(interruptSpeech);
  interruptSpeechRef.current = interruptSpeech;

  // Lightweight 300-3400 Hz Speech-Band Audio Level & Barge-In Monitor (Single Session Lifecycle)
  useEffect(() => {
    if (typeof window === 'undefined' || !isInterviewActive || isTabInactive || !hasStartedMicOnce) {
      setMicAudioLevel(0);
      return;
    }

    let cancelled = false;
    let stream: MediaStream | null = null;
    let audioCtx: AudioContext | null = null;
    let pollTimer: any = null;

    const detector = createSpeechBargeInDetector({
      speechThreshold: 26,
      sustainedMs: 420,
      onBargeIn: () => {
        if (!cancelled && isAvatarSpeakingRef.current && bargeInEnabledRef.current && !userPausedMicRef.current) {
          interruptSpeechRef.current();
        }
      },
      onLevel: (lvl) => {
        if (!cancelled) {
          setMicAudioLevel(isVoiceListeningRef.current ? lvl : 0);
        }
      }
    });

    const startMonitor = async () => {
      try {
        if (!navigator.mediaDevices?.getUserMedia) return;
        if (!isVoiceListeningRef.current && (navigator as any).permissions?.query) {
          const perm = await (navigator as any).permissions.query({ name: 'microphone' }).catch(() => null);
          if (perm && perm.state !== 'granted') return;
        }
        stream = await navigator.mediaDevices.getUserMedia({
          audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
          video: false
        });
        if (cancelled) {
          stream.getTracks().forEach(t => t.stop());
          return;
        }
        const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioCtxClass) {
          stream.getTracks().forEach(t => t.stop());
          return;
        }
        audioCtx = new AudioCtxClass();
        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 1024;
        analyser.smoothingTimeConstant = 0.3;
        source.connect(analyser);

        const freqData = new Uint8Array(analyser.frequencyBinCount);
        pollTimer = setInterval(() => {
          if (cancelled) return;
          if (!isAvatarSpeakingRef.current && !isVoiceListeningRef.current) {
            detector.reset();
            setMicAudioLevel(0);
            return;
          }
          analyser.getByteFrequencyData(freqData);
          const { speechRms, normalizedLevel } = computeSpeechBandRms(
            freqData,
            audioCtx?.sampleRate || 48000,
            analyser.fftSize
          );
          const sinceAvatarSpeechStart = Date.now() - avatarSpeechStartTimeRef.current;
          if (
            isAvatarSpeakingRef.current &&
            bargeInEnabledRef.current &&
            !userPausedMicRef.current &&
            sinceAvatarSpeechStart >= 900
          ) {
            detector.evaluate(speechRms, Date.now(), normalizedLevel);
          } else {
            detector.reset();
            setMicAudioLevel(isVoiceListeningRef.current ? normalizedLevel : 0);
          }
        }, 75);
      } catch {
        // Gracefully degrade when microphone analyser is unavailable in test or locked environments
      }
    };

    void startMonitor();

    return () => {
      cancelled = true;
      detector.reset();
      if (pollTimer) clearInterval(pollTimer);
      if (audioCtx) {
        try { void audioCtx.close(); } catch {}
      }
      if (stream) {
        stream.getTracks().forEach(t => t.stop());
      }
      setMicAudioLevel(0);
    };
  }, [isInterviewActive, isTabInactive, hasStartedMicOnce]);

  // Tab Visibility & Backgrounded Inactivity Synchronization (stable single listener)
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const handleVisibilityChange = () => {
      const isHidden = document.visibilityState === 'hidden';
      setIsTabInactiveState(isHidden);
      isTabInactiveRef.current = Boolean(isTabInactive || isHidden);

      if (isHidden) {
        if (isVoiceListeningRef.current || isStartingRef.current) {
          wasListeningBeforeHiddenRef.current = true;
        }
        debouncerRef.current.reset();
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        if (autoRestartTimerRef.current) clearTimeout(autoRestartTimerRef.current);
        if (recognitionRef.current) {
          try {
            isStoppingRef.current = true;
            recognitionRef.current.stop();
          } catch {}
        }
        isVoiceListeningRef.current = false;
        setIsVoiceListening(false);
        isStartingRef.current = false;
      } else {
        if (isMountedRef.current && autoVoiceLoopRef.current && !isAvatarSpeakingRef.current && !userPausedMicRef.current && (isInterviewActiveRef.current || isInterviewActive)) {
          micRetryCountRef.current = 0;
          const shouldResume = wasListeningBeforeHiddenRef.current || autoVoiceLoopRef.current;
          wasListeningBeforeHiddenRef.current = false;
          if (shouldResume) {
            setTimeout(() => {
              if (isMountedRef.current && !isAvatarSpeakingRef.current && !userPausedMicRef.current && (isInterviewActiveRef.current || isInterviewActive)) {
                startRecognitionInternalRef.current(false);
              }
            }, 300);
          }
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isInterviewActive, isTabInactive]);

  // Sync prop changes for isTabInactive
  useEffect(() => {
    if (isTabInactive === undefined) return;
    isTabInactiveRef.current = isTabInactive;
    if (isTabInactive) {
      if (isVoiceListeningRef.current || isStartingRef.current) {
        wasListeningBeforeHiddenRef.current = true;
      }
      stopRecognitionOnly();
    } else {
      if (wasListeningBeforeHiddenRef.current && !isAvatarSpeakingRef.current && !userPausedMicRef.current && (isInterviewActiveRef.current || isInterviewActive)) {
        wasListeningBeforeHiddenRef.current = false;
        micRetryCountRef.current = 0;
        setTimeout(() => {
          if (isMountedRef.current && !isAvatarSpeakingRef.current && !userPausedMicRef.current && (isInterviewActiveRef.current || isInterviewActive)) {
            startRecognitionInternalRef.current(false);
          }
        }, 300);
      }
    }
  }, [isTabInactive, stopRecognitionOnly, isInterviewActive]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      isInterviewActiveRef.current = false;
      stopSpeaking();
      debouncerRef.current.reset();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
          recognitionRef.current = null;
        } catch {}
      }
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      if (autoRestartTimerRef.current) clearTimeout(autoRestartTimerRef.current);
    };
  }, []);

  return {
    autoVoiceLoop,
    setAutoVoiceLoop,
    isVoiceListening,
    isAvatarSpeaking,
    setIsAvatarSpeaking,
    isAvatarSpeakingRef,
    liveSpeechTranscript,
    wpmScore,
    setWpmScore,
    fillerWordCount,
    setFillerWordCount,
    micAudioLevel,
    bargeInEnabled,
    setBargeInEnabled,
    avatarVolume,
    handleVolumeChange,
    startVoiceListening,
    stopVoiceListening,
    speakWithAvatar,
    previewAssistSpeech,
    interruptSpeech,
    speechStartTimeRef,
    isSpeechSupported,
    flushAndSubmitTranscript,
    isTabInactive: Boolean(isTabInactive || isTabInactiveState),
    pauseVoiceListening,
    resumeVoiceListening: startVoiceListening
  };
}
