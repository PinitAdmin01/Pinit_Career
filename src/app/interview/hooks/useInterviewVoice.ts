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
  domainStream?: 'tech' | 'non_tech';
  difficulty: 'easy' | 'normal' | 'hard';
  onFinalTranscript: (text: string) => void;
  onSilenceNudge: (text: string) => void;
  isTabInactive?: boolean;
  isSendingInterviewerReply?: boolean;
}

export function useInterviewVoice({
  isInterviewActive,
  activeStage,
  activeTopicName,
  domainStream = 'tech',
  difficulty,
  onFinalTranscript,
  onSilenceNudge,
  isTabInactive,
  isSendingInterviewerReply = false
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
  const isAwaitingReplyRef = useRef<boolean>(Boolean(isSendingInterviewerReply));
  const awaitingWatchdogRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const speechEpochRef = useRef<number>(0);
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
  const isInterviewActiveRef = useRef<boolean>(Boolean(isInterviewActive));
  isInterviewActiveRef.current = isInterviewActive;

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
      isAwaitingReplyRef.current = false;
      isAvatarSpeakingRef.current = false;
      setIsAvatarSpeaking(false);
      speechEpochRef.current += 1;
      if (awaitingWatchdogRef.current) {
        clearTimeout(awaitingWatchdogRef.current);
        awaitingWatchdogRef.current = null;
      }
      if (autoRestartTimerRef.current) {
        clearTimeout(autoRestartTimerRef.current);
        autoRestartTimerRef.current = null;
      }
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

  const isMicBlocked = useCallback(() => {
    return (
      !isMountedRef.current ||
      !isInterviewActiveRef.current ||
      isTabInactiveRef.current ||
      userPausedMicRef.current ||
      isAvatarSpeakingRef.current ||
      isAssistPreviewSpeakingRef.current ||
      isAwaitingReplyRef.current ||
      (typeof document !== 'undefined' && document.visibilityState === 'hidden')
    );
  }, []);

  const stopRecognitionOnly = useCallback(() => {
    debouncerRef.current.reset();
    setLiveSpeechTranscript('');
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    if (autoRestartTimerRef.current) {
      clearTimeout(autoRestartTimerRef.current);
      autoRestartTimerRef.current = null;
    }
    const activeRec = recognitionRef.current;
    recognitionRef.current = null;
    if (activeRec) {
      try {
        isStoppingRef.current = true;
        if (typeof activeRec.abort === 'function') {
          activeRec.abort();
        } else {
          activeRec.stop();
        }
      } catch {}
    }
    setIsVoiceListening(false);
    isVoiceListeningRef.current = false;
    isStartingRef.current = false;
  }, []);

  const flushAndSubmitTranscript = useCallback(() => {
    silenceNudgeFiredRef.current = false;
    const committed = debouncerRef.current.commitSubmission();
    setLiveSpeechTranscript('');
    if (!committed) {
      debouncerRef.current.reset();
      return;
    }

    // Lock microphone before stopping & dispatching so rec.onend cannot re-open it mid-turn
    isAwaitingReplyRef.current = true;
    if (awaitingWatchdogRef.current) clearTimeout(awaitingWatchdogRef.current);
    awaitingWatchdogRef.current = setTimeout(() => {
      awaitingWatchdogRef.current = null;
      isAwaitingReplyRef.current = false;
    }, 12000);

    if (autoRestartTimerRef.current) {
      clearTimeout(autoRestartTimerRef.current);
      autoRestartTimerRef.current = null;
    }
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }

    const activeRec = recognitionRef.current;
    recognitionRef.current = null;
    if (activeRec) {
      try {
        isStoppingRef.current = true;
        if (typeof activeRec.abort === 'function') {
          activeRec.abort();
        } else {
          activeRec.stop();
        }
      } catch {}
    }
    setIsVoiceListening(false);
    isVoiceListeningRef.current = false;
    isStartingRef.current = false;

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

  useEffect(() => {
    if (isSendingInterviewerReply) {
      isAwaitingReplyRef.current = true;
      if (awaitingWatchdogRef.current) {
        clearTimeout(awaitingWatchdogRef.current);
        awaitingWatchdogRef.current = null;
      }
      stopRecognitionOnly();
    } else {
      isAwaitingReplyRef.current = false;
      if (awaitingWatchdogRef.current) {
        clearTimeout(awaitingWatchdogRef.current);
        awaitingWatchdogRef.current = null;
      }
    }
  }, [isSendingInterviewerReply, stopRecognitionOnly]);

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
    if (!isInterviewActiveRef.current && !isInterviewActive) return;
    if (isMicBlocked() || isStartingRef.current) {
      if (autoRestartTimerRef.current) {
        clearTimeout(autoRestartTimerRef.current);
        autoRestartTimerRef.current = null;
      }
      return;
    }

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
        autoRestartTimerRef.current = null;
        if (!isMicBlocked()) startRecognitionInternalRef.current(false);
      }, 350);
      return;
    }

    isStartingRef.current = true;

    try {
      if (recognitionRef.current) {
        const oldRec = recognitionRef.current;
        recognitionRef.current = null;
        try {
          if (typeof oldRec.abort === 'function') oldRec.abort();
          else oldRec.stop();
        } catch {}
      }

      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'en-US';

      rec.onstart = () => {
        isStartingRef.current = false;
        // Abort immediately if interviewer started thinking/speaking while rec.start() was async
        if (isMicBlocked() || recognitionRef.current !== rec) {
          isVoiceListeningRef.current = false;
          setIsVoiceListening(false);
          try {
            isStoppingRef.current = true;
            if (typeof rec.abort === 'function') rec.abort();
            else rec.stop();
          } catch {}
          return;
        }
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
              if (autoVoiceLoopRef.current && !isMicBlocked() && !debouncerRef.current.getCurrentTranscript() && !silenceNudgeFiredRef.current) {
                silenceNudgeFiredRef.current = true;
                const nudgeMsg = `Take all the time you need! When you're ready, feel free to share your thoughts or explain your approach for ${activeTopicName}.`;
                onSilenceNudge(nudgeMsg);
              }
            }, 45000);
          } else if (activeStage === 'round2_coding') {
            silenceTimerRef.current = setTimeout(() => {
              if (autoVoiceLoopRef.current && !isMicBlocked() && !debouncerRef.current.getCurrentTranscript() && !silenceNudgeFiredRef.current) {
                silenceNudgeFiredRef.current = true;
                const nudgeMsg = domainStream === 'non_tech'
                  ? `How is your case analysis coming along? Feel free to walk me through your ratios out loud, ask a clarifying question, or toggle Formula Hints if needed.`
                  : `How is your implementation coming along? Feel free to explain your approach out loud, or check the hints toggle if you need a nudge!`;
                onSilenceNudge(nudgeMsg);
              }
            }, 90000);
          } else if (activeStage === 'round3_systems') {
            silenceTimerRef.current = setTimeout(() => {
              if (autoVoiceLoopRef.current && !isMicBlocked() && !debouncerRef.current.getCurrentTranscript() && !silenceNudgeFiredRef.current) {
                silenceNudgeFiredRef.current = true;
                const nudgeMsg = domainStream === 'non_tech'
                  ? `As you map the business workflow for ${activeTopicName}, feel free to explain how customers, orders, or financials move across each stage.`
                  : `As you lay out your architecture nodes for ${activeTopicName}, consider explaining how traffic flows across your tiers.`;
                onSilenceNudge(nudgeMsg);
              }
            }, 90000);
          }
        }
      };

      rec.onresult = (e: any) => {
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        silenceNudgeFiredRef.current = false;

        // Echo/overlap protection: ignore mic transcript when blocked or superseded
        if (isMicBlocked() || recognitionRef.current !== rec) {
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
          if (!isMicBlocked() && debouncerRef.current.getCurrentTranscript().trim().length > 2) {
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
        if (recognitionRef.current !== rec) return;
        isStartingRef.current = false;
        const errType = e?.error || '';

        if (errType === 'no-speech') {
          if (autoVoiceLoopRef.current && !isMicBlocked()) {
            if (autoRestartTimerRef.current) clearTimeout(autoRestartTimerRef.current);
            autoRestartTimerRef.current = setTimeout(() => {
              autoRestartTimerRef.current = null;
              if (!isMicBlocked()) {
                startRecognitionInternalRef.current(false);
              }
            }, 600);
          }
          return;
        }

        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        isVoiceListeningRef.current = false;
        setIsVoiceListening(false);

        if (errType === 'not-allowed' || errType === 'service-not-allowed' || errType === 'audio-capture' || errType === 'aborted') {
          if (errType !== 'aborted') {
            console.warn('[Speech STT] Microphone permission denied or capture error:', errType);
          }
          return;
        }

        if (micRetryCountRef.current >= 6) {
          console.warn('[Speech STT] Multiple audio recovery attempts made. Ready for user click.');
          return;
        }
        micRetryCountRef.current += 1;

        if (autoVoiceLoopRef.current && !isMicBlocked()) {
          if (autoRestartTimerRef.current) clearTimeout(autoRestartTimerRef.current);
          autoRestartTimerRef.current = setTimeout(() => {
            autoRestartTimerRef.current = null;
            if (!isMicBlocked()) {
              startRecognitionInternalRef.current(false);
            }
          }, 1200);
        }
      };

      rec.onend = () => {
        const wasIntentional = isStoppingRef.current;
        const isCurrentInstance = recognitionRef.current === rec;
        isStartingRef.current = false;
        isStoppingRef.current = false;

        if (!isCurrentInstance) {
          // Detached/superseded instance ending asynchronously; never flip or schedule restart
          return;
        }

        isVoiceListeningRef.current = false;
        setIsVoiceListening(false);
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
          silenceTimerRef.current = null;
        }

        if (wasIntentional || isMicBlocked()) return;

        if (debouncerRef.current.getCurrentTranscript().trim()) {
          flushAndSubmitTranscript();
          return;
        }

        if (autoVoiceLoopRef.current && !isMicBlocked()) {
          if (autoRestartTimerRef.current) clearTimeout(autoRestartTimerRef.current);
          autoRestartTimerRef.current = setTimeout(() => {
            autoRestartTimerRef.current = null;
            if (!isMicBlocked()) {
              startRecognitionInternalRef.current(false);
            }
          }, 700);
        }
      };

      recognitionRef.current = rec;
      rec.start();
    } catch {
      isStartingRef.current = false;
      if (autoVoiceLoopRef.current && !isMicBlocked() && micRetryCountRef.current < 4) {
        micRetryCountRef.current += 1;
        if (autoRestartTimerRef.current) clearTimeout(autoRestartTimerRef.current);
        autoRestartTimerRef.current = setTimeout(() => {
          autoRestartTimerRef.current = null;
          if (!isMicBlocked()) startRecognitionInternalRef.current(false);
        }, 800);
      }
    }
  }, [activeStage, activeTopicName, domainStream, onSilenceNudge, isInterviewActive, flushAndSubmitTranscript, isMicBlocked]);

  startRecognitionInternalRef.current = startRecognitionInternal;

  // Explicit user-initiated or button start clears any user pause lock
  const startVoiceListening = useCallback(() => {
    if (isAwaitingReplyRef.current || isAvatarSpeakingRef.current || isTabInactiveRef.current) {
      return;
    }
    startRecognitionInternal(true);
  }, [startRecognitionInternal]);

  const speakWithAvatar = useCallback((text: string, teacherId: string, onStart: () => void, onEnd: () => void) => {
    const epoch = ++speechEpochRef.current;
    isAssistPreviewSpeakingRef.current = false;
    isAwaitingReplyRef.current = false;
    if (awaitingWatchdogRef.current) {
      clearTimeout(awaitingWatchdogRef.current);
      awaitingWatchdogRef.current = null;
    }
    isAvatarSpeakingRef.current = true;
    setIsAvatarSpeaking(true);
    setIsVoiceListening(false);
    isVoiceListeningRef.current = false;
    isStartingRef.current = false;

    if (autoRestartTimerRef.current) {
      clearTimeout(autoRestartTimerRef.current);
      autoRestartTimerRef.current = null;
    }
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    debouncerRef.current.reset();
    setLiveSpeechTranscript('');

    const activeRec = recognitionRef.current;
    recognitionRef.current = null;
    if (activeRec) {
      try {
        isStoppingRef.current = true;
        if (typeof activeRec.abort === 'function') {
          activeRec.abort();
        } else {
          activeRec.stop();
        }
      } catch {}
    }

    speakWithAvatarRaw(text, teacherId, () => {
      if (epoch !== speechEpochRef.current) return;
      isAvatarSpeakingRef.current = true;
      avatarSpeechStartTimeRef.current = Date.now();
      setIsAvatarSpeaking(true);
      setSoundscapeDucking(true);
      onStart();
    }, () => {
      if (epoch !== speechEpochRef.current) return;
      isAvatarSpeakingRef.current = false;
      setIsAvatarSpeaking(false);
      setSoundscapeDucking(false);
      lastSpokenEndTimeRef.current = Date.now();
      onEnd();
      if (autoVoiceLoopRef.current && (isInterviewActiveRef.current || isInterviewActive) && isMountedRef.current && !userPausedMicRef.current && !isAssistPreviewSpeakingRef.current && !isAwaitingReplyRef.current) {
        if (autoRestartTimerRef.current) clearTimeout(autoRestartTimerRef.current);
        autoRestartTimerRef.current = setTimeout(() => {
          autoRestartTimerRef.current = null;
          if (!isMicBlocked()) {
            startRecognitionInternalRef.current(false);
          }
        }, 600);
      }
    }, false, true, difficulty, 1.0, 15000, { startDeadlineMs: 3500 });
  }, [difficulty, isInterviewActive, isMicBlocked]);

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
    const activeRec = recognitionRef.current;
    recognitionRef.current = null;
    if (activeRec) {
      try {
        isStoppingRef.current = true;
        if (typeof activeRec.abort === 'function') activeRec.abort();
        else activeRec.stop();
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
    speechEpochRef.current += 1;
    stopSpeaking();
    setSoundscapeDucking(false);
    isAssistPreviewSpeakingRef.current = false;
    isAvatarSpeakingRef.current = false;
    isAwaitingReplyRef.current = false;
    setIsAvatarSpeaking(false);
    if (!isTabInactiveRef.current) {
      startRecognitionInternalRef.current(true);
    }
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
        if (autoVoiceLoopRef.current && !isMicBlocked() && (isInterviewActiveRef.current || isInterviewActive)) {
          micRetryCountRef.current = 0;
          const shouldResume = wasListeningBeforeHiddenRef.current || autoVoiceLoopRef.current;
          wasListeningBeforeHiddenRef.current = false;
          if (shouldResume) {
            if (autoRestartTimerRef.current) clearTimeout(autoRestartTimerRef.current);
            autoRestartTimerRef.current = setTimeout(() => {
              autoRestartTimerRef.current = null;
              if (!isMicBlocked() && (isInterviewActiveRef.current || isInterviewActive)) {
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
  }, [isInterviewActive, isTabInactive, isMicBlocked]);

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
      if (wasListeningBeforeHiddenRef.current && !isMicBlocked() && (isInterviewActiveRef.current || isInterviewActive)) {
        wasListeningBeforeHiddenRef.current = false;
        micRetryCountRef.current = 0;
        if (autoRestartTimerRef.current) clearTimeout(autoRestartTimerRef.current);
        autoRestartTimerRef.current = setTimeout(() => {
          autoRestartTimerRef.current = null;
          if (!isMicBlocked() && (isInterviewActiveRef.current || isInterviewActive)) {
            startRecognitionInternalRef.current(false);
          }
        }, 300);
      }
    }
  }, [isTabInactive, stopRecognitionOnly, isInterviewActive, isMicBlocked]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      isInterviewActiveRef.current = false;
      isAwaitingReplyRef.current = false;
      isAvatarSpeakingRef.current = false;
      speechEpochRef.current += 1;
      stopSpeaking();
      debouncerRef.current.reset();
      if (recognitionRef.current) {
        try {
          if (typeof recognitionRef.current.abort === 'function') recognitionRef.current.abort();
          else recognitionRef.current.stop();
          recognitionRef.current = null;
        } catch {}
      }
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      if (autoRestartTimerRef.current) clearTimeout(autoRestartTimerRef.current);
      if (awaitingWatchdogRef.current) clearTimeout(awaitingWatchdogRef.current);
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
