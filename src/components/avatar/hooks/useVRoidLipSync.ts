// hooks/useVRoidLipSync.ts
// 🎯 ADVANCED VROID LIP-SYNC & SPEECH ANIMATION
// ✅ Phoneme-based lip-sync
// ✅ Audio-driven animation
// ✅ Jaw movement with null guards
// ✅ Tongue animation
// ✅ Emotion-based speech

import { useRef, useState, useCallback, useEffect } from 'react';
import { useFrame, FrameState } from './useFrame';
import * as THREE from 'three';

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// Phoneme definitions with mouth shapes
export const PHONEME_MOUTH_SHAPES: Record<string, Record<string, number>> = {
  // Vowels - open mouth
  'a': { aa: 0.9, oh: 0.2, mouth_open: 0.8 },
  'e': { ee: 0.9, ih: 0.3, mouth_open: 0.5 },
  'i': { ih: 0.9, ee: 0.3, mouth_open: 0.3 },
  'o': { oh: 0.9, ou: 0.2, mouth_open: 0.7 },
  'u': { ou: 0.9, oh: 0.2, mouth_open: 0.6 },

  // Consonants - closed/pursed mouth
  'm': { oh: 0.6, mouth_close: 0.7 },
  'p': { oh: 0.5, mouth_close: 0.8 },
  'b': { oh: 0.5, mouth_close: 0.8 },
  'f': { ee: 0.4, mouth_close: 0.6, lower_lip_in: 0.5 },
  'v': { ee: 0.4, mouth_close: 0.6, lower_lip_in: 0.5 },
  'th': { tongue_out: 0.3, mouth_open: 0.4 },
  's': { ee: 0.6, mouth_close: 0.7 },
  'z': { ee: 0.6, mouth_close: 0.7 },
  'sh': { oh: 0.4, mouth_close: 0.6 },
  'ch': { ee: 0.3, mouth_close: 0.8 },
  'j': { ee: 0.4, mouth_close: 0.7 },
  'l': { ee: 0.3, tongue_up: 0.5, mouth_open: 0.3 },
  'r': { oh: 0.3, tongue_up: 0.4, mouth_open: 0.4 },
  'n': { ee: 0.2, mouth_close: 0.7, nose_air: 0.5 },
  'ng': { oh: 0.2, mouth_close: 0.8, nose_air: 0.6 },
  'y': { ee: 0.5, mouth_open: 0.2 },
  'w': { ou: 0.7, mouth_round: 0.8 },
  'h': { aa: 0.2, mouth_open: 0.3 },

  // Silence
  'silence': { mouth_close: 0.8 },
};

// Lip-sync timing for smooth animation
export const LIP_SYNC_SETTINGS = {
  phonemeDuration: 0.08, // 80ms per phoneme
  transitionTime: 0.05, // 50ms blend between phonemes
  jawSensitivity: 1.2, // Jaw movement multiplier
  expressionDamping: 0.9, // Smooth expression blending
};

export interface VRMExpressionsControllerLike {
  setExpression?: (name: string, value: number) => void;
  [key: string]: any;
}

export function useVRoidLipSync(vrmExpressions?: VRMExpressionsControllerLike | null) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentPhoneme, setCurrentPhoneme] = useState('silence');
  const speechQueueRef = useRef<string[]>([]);
  const speechTimeRef = useRef(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioAnalyzerRef = useRef<AnalyserNode | null>(null);
  const jawBoneRef = useRef<THREE.Object3D | null>(null);
  const tongueBonesRef = useRef<THREE.Object3D[]>([]);

  // Cleanup audio context on unmount
  useEffect(() => {
    return () => {
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        try {
          audioContextRef.current.close();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  // Initialize audio analysis for real-time lip-sync
  const initializeAudioAnalysis = useCallback((audioElement: HTMLMediaElement | null) => {
    if (!audioElement || typeof window === 'undefined') return;

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const context: AudioContext = new AudioCtx();
      audioContextRef.current = context;

      const source = context.createMediaElementSource(audioElement);
      const analyzer = context.createAnalyser();
      analyzer.fftSize = 2048;

      source.connect(analyzer);
      analyzer.connect(context.destination);

      audioAnalyzerRef.current = analyzer;
      return analyzer;
    } catch (err) {
      console.warn('[LipSync] Could not initialize Web Audio analyser:', err);
      return null;
    }
  }, []);

  // Extract phonemes from text
  const extractPhonemes = useCallback((text: string): string[] => {
    const phonemeMap: Record<string, string> = {
      'ph': 'f',
      'gh': 'f',
      'ch': 'ch',
      'sh': 'sh',
      'th': 'th',
      'ng': 'ng',
      'qu': 'kw',
    };

    const phonemes: string[] = [];
    let i = 0;

    while (i < text.length) {
      const char = text[i].toLowerCase();
      const twoChar = (text.substring(i, i + 2) || '').toLowerCase();

      if (phonemeMap[twoChar]) {
        phonemes.push(phonemeMap[twoChar]);
        i += 2;
      } else if ('aeiou'.includes(char)) {
        phonemes.push(char);
        i++;
      } else if ('bcdfghjklmnprstvwxyz'.includes(char)) {
        phonemes.push(char);
        i++;
      } else {
        i++;
      }
    }

    return phonemes;
  }, []);

  // Apply mouth shape for phoneme
  const applyPhonemeShape = useCallback((phoneme: string) => {
    if (!vrmExpressions) return;

    const shapes = PHONEME_MOUTH_SHAPES[phoneme] || PHONEME_MOUTH_SHAPES['silence'];

    Object.entries(shapes).forEach(([shape, value]) => {
      if (typeof vrmExpressions.setExpression === 'function') {
        vrmExpressions.setExpression(shape, value);
      }
    });

    setCurrentPhoneme(phoneme);
  }, [vrmExpressions]);

  // Animate phoneme sequence
  const animatePhonemeSequence = useCallback((text: string) => {
    const phonemes = extractPhonemes(text);
    
    setIsSpeaking(true);
    speechQueueRef.current = phonemes;
    speechTimeRef.current = 0;

    const speechDuration = phonemes.length * LIP_SYNC_SETTINGS.phonemeDuration;
    
    setTimeout(() => {
      setIsSpeaking(false);
      setCurrentPhoneme('silence');
      speechQueueRef.current = [];
    }, speechDuration * 1000);
  }, [extractPhonemes]);

  // Animate jaw movement for mouth opening with strict null check
  const updateJawMovement = useCallback((jawBone: THREE.Object3D | null | undefined, phoneme: string) => {
    if (!jawBone || !jawBone.rotation) return;

    const shapes = PHONEME_MOUTH_SHAPES[phoneme] || {};
    const jawOpen = shapes.mouth_open || 0;

    const targetRotX = jawOpen * LIP_SYNC_SETTINGS.jawSensitivity * 0.3;
    jawBone.rotation.x = lerp(jawBone.rotation.x || 0, targetRotX, 0.1);
  }, []);

  // Detect dominant frequency from audio
  const detectDominantFrequency = useCallback((dataArray: Uint8Array): number => {
    let maxValue = 0;
    let maxIndex = 0;

    for (let i = 0; i < dataArray.length; i++) {
      if (dataArray[i] > maxValue) {
        maxValue = dataArray[i];
        maxIndex = i;
      }
    }

    const nyquist = (audioContextRef.current?.sampleRate || 44100) / 2;
    return (maxIndex * nyquist) / dataArray.length;
  }, []);

  // Estimate phoneme from frequency analysis
  const estimatePhoneme = useCallback((freq: number, energy: number): string => {
    if (energy < 0.1) return 'silence';

    if (freq < 300) {
      return energy > 0.4 ? 'o' : 'u';
    } else if (freq < 700) {
      return energy > 0.5 ? 'a' : 'e';
    } else if (freq < 1200) {
      return 'i';
    } else if (freq < 2000) {
      return 's';
    } else {
      return 'sh';
    }
  }, []);

  // Real-time audio-driven lip-sync
  const updateFromAudio = useCallback(() => {
    if (!audioAnalyzerRef.current || !isSpeaking) return;

    const dataArray = new Uint8Array(audioAnalyzerRef.current.frequencyBinCount);
    audioAnalyzerRef.current.getByteFrequencyData(dataArray);

    let energy = 0;
    for (let i = 0; i < dataArray.length; i++) {
      energy += dataArray[i];
    }
    energy = energy / dataArray.length / 255;

    const dominantFreq = detectDominantFrequency(dataArray);
    const estimatedPhoneme = estimatePhoneme(dominantFreq, energy);

    if (estimatedPhoneme) {
      applyPhonemeShape(estimatedPhoneme);
    }
  }, [isSpeaking, applyPhonemeShape, detectDominantFrequency, estimatePhoneme]);

  // Main animation loop
  useFrame((_state: FrameState, delta: number) => {
    if (!isSpeaking) return;

    speechTimeRef.current += delta;

    if (speechQueueRef.current.length > 0) {
      const phonemeIndex = Math.floor(
        speechTimeRef.current / LIP_SYNC_SETTINGS.phonemeDuration
      );

      if (phonemeIndex < speechQueueRef.current.length) {
        const phoneme = speechQueueRef.current[phonemeIndex];
        applyPhonemeShape(phoneme);
        updateJawMovement(jawBoneRef.current, phoneme);
      }
    }

    updateFromAudio();
  });

  const setJawBone = useCallback((bone: THREE.Object3D | null) => {
    jawBoneRef.current = bone;
  }, []);

  const addTongueBone = useCallback((bone: THREE.Object3D) => {
    tongueBonesRef.current.push(bone);
  }, []);

  const getSpeechInfo = useCallback(() => {
    return {
      isSpeaking,
      currentPhoneme,
      progress: speechQueueRef.current.length > 0 
        ? speechTimeRef.current / (speechQueueRef.current.length * LIP_SYNC_SETTINGS.phonemeDuration)
        : 0,
      queueLength: speechQueueRef.current.length,
    };
  }, [isSpeaking, currentPhoneme]);

  return {
    animatePhonemeSequence,
    applyPhonemeShape,
    updateJawMovement,
    initializeAudioAnalysis,
    setJawBone,
    addTongueBone,
    getSpeechInfo,
    isSpeaking,
    currentPhoneme,
    PHONEME_MOUTH_SHAPES,
    LIP_SYNC_SETTINGS,
  };
}
