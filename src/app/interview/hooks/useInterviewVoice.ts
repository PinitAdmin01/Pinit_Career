'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { speakWithAvatar as speakWithAvatarRaw, stopSpeaking, getAvatarVoiceVolume, setAvatarVoiceVolume } from '@/lib/tts';
import { Stage } from '../interviewTypes';

interface UseInterviewVoiceProps {
  isInterviewActive: boolean;
  activeStage: Stage;
  activeTopicName: string;
  activeTeacherId: string;
  difficulty: 'easy' | 'normal' | 'hard';
  onFinalTranscript: (text: string) => void;
  onSilenceNudge: (text: string) => void;
}

export function useInterviewVoice({
  isInterviewActive,
  activeStage,
  activeTopicName,
  difficulty,
  onFinalTranscript,
  onSilenceNudge
}: UseInterviewVoiceProps) {
  const [autoVoiceLoop, setAutoVoiceLoop] = useState(true);
  const autoVoiceLoopRef = useRef(true);
  const silenceTimerRef = useRef<any>(null);
  const utteranceDebounceTimerRef = useRef<any>(null);
  const [liveSpeechTranscript, setLiveSpeechTranscript] = useState<string>('');
  const accumulatedTranscriptRef = useRef<string>('');
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const [isAvatarSpeaking, setIsAvatarSpeaking] = useState(false);
  const isAvatarSpeakingRef = useRef<boolean>(false);
  const recognitionRef = useRef<any>(null);
  const autoRestartTimerRef = useRef<any>(null);
  const micRetryCountRef = useRef<number>(0);
  const lastSpokenEndTimeRef = useRef<number>(0);
  const speechStartTimeRef = useRef<number>(0);
  const lastSentTranscriptRef = useRef<string>('');
  const isStartingRef = useRef<boolean>(false);
  const isStoppingRef = useRef<boolean>(false);

  const isMountedRef = useRef<boolean>(true);
  const isInterviewActiveRef = useRef<boolean>(false);

  const [wpmScore, setWpmScore] = useState<number | null>(null);
  const [fillerWordCount, setFillerWordCount] = useState(0);
  const [isSpeechSupported, setIsSpeechSupported] = useState<boolean>(true);

  // Audio Volume Control State (0-100)
  const [avatarVolume, setAvatarVolumeState] = useState<number>(() => Math.round(getAvatarVoiceVolume() * 100));

  const handleVolumeChange = (newVol: number) => {
    setAvatarVolumeState(newVol);
    setAvatarVoiceVolume(newVol / 100);
  };

  useEffect(() => {
    isInterviewActiveRef.current = isInterviewActive;
  }, [isInterviewActive]);

  useEffect(() => {
    autoVoiceLoopRef.current = autoVoiceLoop;
  }, [autoVoiceLoop]);

  // Cleanly clear unsubmitted utterances on round transitions
  useEffect(() => {
    if (utteranceDebounceTimerRef.current) {
      clearTimeout(utteranceDebounceTimerRef.current);
      utteranceDebounceTimerRef.current = null;
    }
    accumulatedTranscriptRef.current = '';
    setLiveSpeechTranscript('');
  }, [activeStage]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasSpeech = Boolean((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
      setIsSpeechSupported(hasSpeech);
    }
  }, []);

  const flushAndSubmitTranscript = useCallback(() => {
    if (utteranceDebounceTimerRef.current) {
      clearTimeout(utteranceDebounceTimerRef.current);
      utteranceDebounceTimerRef.current = null;
    }
    const fullTranscript = accumulatedTranscriptRef.current.trim();
    if (!fullTranscript || fullTranscript === lastSentTranscriptRef.current) {
      accumulatedTranscriptRef.current = '';
      setLiveSpeechTranscript('');
      return;
    }

    lastSentTranscriptRef.current = fullTranscript;
    accumulatedTranscriptRef.current = '';
    setLiveSpeechTranscript('');

    if (recognitionRef.current) {
      try {
        isStoppingRef.current = true;
        recognitionRef.current.stop();
      } catch (err) {}
    }

    const words = fullTranscript.split(/\s+/).filter(Boolean);
    if (speechStartTimeRef.current > 0) {
      const durationSec = Math.max(1.0, (Date.now() - speechStartTimeRef.current) / 1000);
      const rawWpm = Math.round((words.length / durationSec) * 60);
      const boundedWpm = Math.min(220, Math.max(60, rawWpm));
      setWpmScore(prev => prev === null ? boundedWpm : Math.round(prev * 0.45 + boundedWpm * 0.55));
    }

    const fillers = fullTranscript.match(/\b(um|uh|like|you know|basically|actually|sort of|kind of)\b/gi);
    if (fillers) {
      setFillerWordCount(prev => prev + fillers.length);
    }

    console.log('[Speech STT] 🎙️ Submitting finalized candidate speech:', fullTranscript);
    onFinalTranscript(fullTranscript);
  }, [onFinalTranscript]);

  const stopVoiceListening = useCallback(() => {
    if (utteranceDebounceTimerRef.current) {
      clearTimeout(utteranceDebounceTimerRef.current);
      utteranceDebounceTimerRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        isStoppingRef.current = true;
        recognitionRef.current.stop();
      } catch (e) {}
    }
    setIsVoiceListening(false);
    isStartingRef.current = false;
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    if (autoRestartTimerRef.current) clearTimeout(autoRestartTimerRef.current);
  }, []);

  const startVoiceListening = useCallback(() => {
    if (typeof window === 'undefined' || !isMountedRef.current) return;
    if (!isInterviewActiveRef.current && !isInterviewActive) return;

    if (isStartingRef.current || isAvatarSpeakingRef.current) return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSpeechSupported(false);
      return;
    }

    if (recognitionRef.current && isVoiceListening) {
      return;
    }

    const now = Date.now();
    if (now - lastSpokenEndTimeRef.current < 350) {
      setTimeout(() => {
        if (isMountedRef.current) startVoiceListening();
      }, 350);
      return;
    }

    isStartingRef.current = true;

    try {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
        recognitionRef.current = null;
      }

      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'en-US';

      rec.onstart = () => {
        isStartingRef.current = false;
        isStoppingRef.current = false;
        micRetryCountRef.current = 0; // reset on clean start
        speechStartTimeRef.current = Date.now();
        setIsVoiceListening(true);

        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        if (activeStage === 'round1_behavioral' || activeStage === 'round4_star') {
          silenceTimerRef.current = setTimeout(() => {
            if (autoVoiceLoopRef.current && !isAvatarSpeakingRef.current && !accumulatedTranscriptRef.current) {
              const nudgeMsg = `Take all the time you need! When you're ready, feel free to share your thoughts or explain your approach for ${activeTopicName}.`;
              onSilenceNudge(nudgeMsg);
            }
          }, 45000);
        } else if (activeStage === 'round2_coding') {
          silenceTimerRef.current = setTimeout(() => {
            if (autoVoiceLoopRef.current && !isAvatarSpeakingRef.current && !accumulatedTranscriptRef.current) {
              const nudgeMsg = `How is your implementation coming along? Feel free to explain your approach out loud, or check the hints toggle if you need a nudge!`;
              onSilenceNudge(nudgeMsg);
            }
          }, 90000);
        } else if (activeStage === 'round3_systems') {
          silenceTimerRef.current = setTimeout(() => {
            if (autoVoiceLoopRef.current && !isAvatarSpeakingRef.current && !accumulatedTranscriptRef.current) {
              const nudgeMsg = `As you lay out your architecture nodes for ${activeTopicName}, consider explaining how traffic flows across your tiers.`;
              onSilenceNudge(nudgeMsg);
            }
          }, 90000);
        }
      };

      rec.onresult = (e: any) => {
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);

        // Echo protection: ignore mic audio if avatar is actively speaking
        if (isAvatarSpeakingRef.current) {
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

        if (newFinalChunk.trim()) {
          accumulatedTranscriptRef.current = (accumulatedTranscriptRef.current + ' ' + newFinalChunk).trim();
          micRetryCountRef.current = 0; // successfully received speech
        }

        const currentDisplay = (accumulatedTranscriptRef.current + (interim ? ' ' + interim : '')).trim();
        if (currentDisplay) {
          setLiveSpeechTranscript(currentDisplay);
        }

        // Debounce before auto-submitting on natural speech completion (3.2s of silence after final word)
        // Gives the candidate natural breathing time between sentences while reading the teleprompter
        if (accumulatedTranscriptRef.current.trim().length > 3) {
          if (utteranceDebounceTimerRef.current) clearTimeout(utteranceDebounceTimerRef.current);
          utteranceDebounceTimerRef.current = setTimeout(() => {
            if (!isAvatarSpeakingRef.current && accumulatedTranscriptRef.current.trim()) {
              flushAndSubmitTranscript();
            }
          }, 3200);
        }
      };

      rec.onerror = (e: any) => {
        isStartingRef.current = false;
        const errType = e?.error || '';

        // Standard thinking pauses are NOT fatal errors
        if (errType === 'no-speech') {
          if (autoVoiceLoopRef.current && !isAvatarSpeakingRef.current && isMountedRef.current) {
            if (autoRestartTimerRef.current) clearTimeout(autoRestartTimerRef.current);
            autoRestartTimerRef.current = setTimeout(() => {
              if (isMountedRef.current && !isAvatarSpeakingRef.current) {
                startVoiceListening();
              }
            }, 600);
          }
          return;
        }

        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
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

        if (autoVoiceLoopRef.current && !isAvatarSpeakingRef.current) {
          if (autoRestartTimerRef.current) clearTimeout(autoRestartTimerRef.current);
          autoRestartTimerRef.current = setTimeout(() => {
            if (isMountedRef.current && !isAvatarSpeakingRef.current) {
              startVoiceListening();
            }
          }, 1200);
        }
      };

      rec.onend = () => {
        isStartingRef.current = false;
        isStoppingRef.current = false;
        setIsVoiceListening(false);

        // If candidate spoke and mic stopped before debounce fired, flush immediately
        if (accumulatedTranscriptRef.current.trim()) {
          flushAndSubmitTranscript();
          return;
        }

        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);

        // Auto restart loop if appropriate
        if (autoVoiceLoopRef.current && !isAvatarSpeakingRef.current && isMountedRef.current) {
          if (autoRestartTimerRef.current) clearTimeout(autoRestartTimerRef.current);
          autoRestartTimerRef.current = setTimeout(() => {
            if (isMountedRef.current && !isAvatarSpeakingRef.current && isInterviewActiveRef.current) {
              startVoiceListening();
            }
          }, 700);
        }
      };

      recognitionRef.current = rec;
      rec.start();
    } catch (e: any) {
      isStartingRef.current = false;
      if (autoVoiceLoopRef.current && !isAvatarSpeakingRef.current && micRetryCountRef.current < 4) {
        micRetryCountRef.current += 1;
        setTimeout(() => {
          if (isMountedRef.current) startVoiceListening();
        }, 800);
      }
    }
  }, [activeStage, activeTopicName, onSilenceNudge, isInterviewActive, flushAndSubmitTranscript]);

  const speakWithAvatar = useCallback((text: string, teacherId: string, onStart: () => void, onEnd: () => void) => {
    isAvatarSpeakingRef.current = true;
    setIsAvatarSpeaking(true);

    if (utteranceDebounceTimerRef.current) {
      clearTimeout(utteranceDebounceTimerRef.current);
      utteranceDebounceTimerRef.current = null;
    }

    if (recognitionRef.current) {
      try {
        isStoppingRef.current = true;
        recognitionRef.current.stop();
      } catch (e) {}
    }

    speakWithAvatarRaw(text, teacherId, () => {
      isAvatarSpeakingRef.current = true;
      setIsAvatarSpeaking(true);
      onStart();
    }, () => {
      isAvatarSpeakingRef.current = false;
      setIsAvatarSpeaking(false);
      lastSpokenEndTimeRef.current = Date.now();
      onEnd();
      if (autoVoiceLoopRef.current && (isInterviewActiveRef.current || isInterviewActive) && isMountedRef.current) {
        setTimeout(() => {
          if (isMountedRef.current && !isAvatarSpeakingRef.current) {
            startVoiceListening();
          }
        }, 500);
      }
    }, false, true, difficulty);
  }, [difficulty, startVoiceListening, isInterviewActive]);

  const interruptSpeech = useCallback(() => {
    stopSpeaking();
    isAvatarSpeakingRef.current = false;
    setIsAvatarSpeaking(false);
    startVoiceListening();
  }, [startVoiceListening]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      isInterviewActiveRef.current = false;
      stopSpeaking();
      if (utteranceDebounceTimerRef.current) clearTimeout(utteranceDebounceTimerRef.current);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
          recognitionRef.current = null;
        } catch (e) {}
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
    avatarVolume,
    handleVolumeChange,
    startVoiceListening,
    stopVoiceListening,
    speakWithAvatar,
    interruptSpeech,
    speechStartTimeRef,
    isSpeechSupported,
    flushAndSubmitTranscript
  };
}

