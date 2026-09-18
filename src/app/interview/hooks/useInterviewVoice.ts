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
  const [liveSpeechTranscript, setLiveSpeechTranscript] = useState<string>('');
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const [isAvatarSpeaking, setIsAvatarSpeaking] = useState(false);
  const isAvatarSpeakingRef = useRef<boolean>(false);
  const recognitionRef = useRef<any>(null);
  const autoRestartTimerRef = useRef<any>(null);
  const micRetryCountRef = useRef<number>(0);
  const lastSpokenEndTimeRef = useRef<number>(0);
  const speechStartTimeRef = useRef<number>(0);
  const lastSentTranscriptRef = useRef<string>('');

  const isMountedRef = useRef<boolean>(true);
  const isInterviewActiveRef = useRef<boolean>(false);

  const [wpmScore, setWpmScore] = useState<number | null>(null);
  const [fillerWordCount, setFillerWordCount] = useState(0);

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

  const stopVoiceListening = useCallback(() => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
    }
    setIsVoiceListening(false);
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    if (autoRestartTimerRef.current) clearTimeout(autoRestartTimerRef.current);
  }, []);

  const startVoiceListening = useCallback(() => {
    if (typeof window === 'undefined' || !isMountedRef.current || !isInterviewActiveRef.current) return;

    const now = Date.now();
    if (now - lastSpokenEndTimeRef.current < 400 && !isAvatarSpeakingRef.current) {
      setTimeout(() => {
        if (isMountedRef.current && isInterviewActiveRef.current) {
          startVoiceListening();
        }
      }, 400);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('[Speech STT] Web Speech recognition not supported in this browser.');
      return;
    }

    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
    }

    const rec = new SpeechRecognition();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = 'en-US';

    rec.onstart = () => {
      micRetryCountRef.current = 0;
      speechStartTimeRef.current = Date.now();
      setIsVoiceListening(true);

      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      if (activeStage === 'round1_behavioral' || activeStage === 'round4_star') {
        silenceTimerRef.current = setTimeout(() => {
          if (autoVoiceLoopRef.current && !isAvatarSpeakingRef.current) {
            const nudgeMsg = `Take all the time you need! When you're ready, feel free to share your thoughts or explain your approach for ${activeTopicName}.`;
            onSilenceNudge(nudgeMsg);
          }
        }, 45000);
      } else if (activeStage === 'round2_coding') {
        silenceTimerRef.current = setTimeout(() => {
          if (autoVoiceLoopRef.current && !isAvatarSpeakingRef.current) {
            const nudgeMsg = `How is your implementation coming along? Feel free to explain your data structures out loud, or check the hints toggle above if you would like a nudge!`;
            onSilenceNudge(nudgeMsg);
          }
        }, 90000);
      } else if (activeStage === 'round3_systems') {
        silenceTimerRef.current = setTimeout(() => {
          if (autoVoiceLoopRef.current && !isAvatarSpeakingRef.current) {
            const nudgeMsg = `As you lay out your architecture nodes for ${activeTopicName}, consider how traffic flows between your API gateway, cache layers, and primary database.`;
            onSilenceNudge(nudgeMsg);
          }
        }, 90000);
      }
    };

    rec.onresult = (e: any) => {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      let interim = '';
      let final = '';

      for (let i = e.resultIndex; i < e.results.length; ++i) {
        if (e.results[i].isFinal) {
          final += e.results[i][0].transcript;
        } else {
          interim += e.results[i][0].transcript;
        }
      }

      if (interim.trim().length > 6 && isAvatarSpeakingRef.current) {
        stopSpeaking();
        isAvatarSpeakingRef.current = false;
        setIsAvatarSpeaking(false);
      }

      if (interim) {
        setLiveSpeechTranscript(interim);
      }

      if (final.trim() && final.trim() !== lastSentTranscriptRef.current) {
        lastSentTranscriptRef.current = final.trim();
        setLiveSpeechTranscript('');
        try { rec.stop(); } catch (err) {}

        const words = final.trim().split(/\s+/).filter(Boolean);
        if (speechStartTimeRef.current > 0) {
          const durationSec = Math.max(1.0, (Date.now() - speechStartTimeRef.current) / 1000);
          const rawWpm = Math.round((words.length / durationSec) * 60);
          const boundedWpm = Math.min(220, Math.max(60, rawWpm));
          setWpmScore(prev => prev === null ? boundedWpm : Math.round(prev * 0.45 + boundedWpm * 0.55));
        }

        const fillers = final.trim().match(/\b(um|uh|like|you know|basically|actually|sort of|kind of)\b/gi);
        if (fillers) {
          setFillerWordCount(prev => prev + fillers.length);
        }

        onFinalTranscript(final.trim());
      }
    };

    rec.onerror = (e: any) => {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      setIsVoiceListening(false);

      const errType = e?.error || '';
      if (errType === 'not-allowed' || errType === 'service-not-allowed' || errType === 'audio-capture') {
        console.warn('[Speech STT] Microphone permission denied or capture error:', errType);
        return;
      }

      if (micRetryCountRef.current >= 3) {
        console.warn('[Speech STT] Max mic retries reached.');
        return;
      }
      micRetryCountRef.current += 1;

      if (autoVoiceLoopRef.current && !isAvatarSpeakingRef.current) {
        if (autoRestartTimerRef.current) clearTimeout(autoRestartTimerRef.current);
        autoRestartTimerRef.current = setTimeout(() => {
          startVoiceListening();
        }, 1200);
      }
    };

    rec.onend = () => {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      setIsVoiceListening(false);

      if (autoVoiceLoopRef.current && !isAvatarSpeakingRef.current) {
        if (autoRestartTimerRef.current) clearTimeout(autoRestartTimerRef.current);
        autoRestartTimerRef.current = setTimeout(() => {
          startVoiceListening();
        }, 1000);
      }
    };

    recognitionRef.current = rec;
    try {
      rec.start();
    } catch (e: any) {
      if (autoVoiceLoopRef.current && !isAvatarSpeakingRef.current && micRetryCountRef.current < 3) {
        micRetryCountRef.current += 1;
        setTimeout(() => {
          try { rec.start(); } catch (err) {}
        }, 800);
      }
    }
  }, [activeStage, activeTopicName, onFinalTranscript, onSilenceNudge]);

  const speakWithAvatar = useCallback((text: string, teacherId: string, onStart: () => void, onEnd: () => void) => {
    isAvatarSpeakingRef.current = true;
    setIsAvatarSpeaking(true);

    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
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
      if (autoVoiceLoopRef.current && isInterviewActiveRef.current && isMountedRef.current) {
        setTimeout(() => {
          if (isInterviewActiveRef.current && isMountedRef.current) {
            startVoiceListening();
          }
        }, 500);
      }
    }, false, true, difficulty);
  }, [difficulty, startVoiceListening]);

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
    speechStartTimeRef
  };
}
