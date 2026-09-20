/**
 * hooks/useFacialEmotionDetection.ts
 *
 * EMOTIONAL CONTEXT & SENTIMENT ANALYSIS ENGINE
 *
 * NOTE ON BIOMETRIC PRIVACY & DPDP ACT COMPLIANCE:
 * In strict adherence to the Digital Personal Data Protection (DPDP) Act, 2023,
 * Section 5 (Notice & Consent) and biometric student privacy standards, webcam
 * camera tracking and facial surveillance for emotion recognition are permanently
 * DISABLED. PinIT does NOT capture, stream, or analyze webcam imagery to infer
 * student emotional states.
 *
 * Conversational emotional context is derived ethically and transparently from
 * text sentiment and tone analysis of the student's typed or spoken messages.
 */

import { useRef, useState, useCallback } from 'react';

export const EMOTION_SIGNATURES: Record<string, any> = {
  happy: {
    intensity: 0.8,
    dominantMood: 'positive',
  },
  sad: {
    intensity: 0.6,
    dominantMood: 'negative',
  },
  concerned: {
    intensity: 0.7,
    dominantMood: 'supportive',
  },
  excited: {
    intensity: 0.9,
    dominantMood: 'energetic',
  },
  stressed: {
    intensity: 0.8,
    dominantMood: 'empathetic',
  },
  neutral: {
    intensity: 0.5,
    dominantMood: 'calm',
  },
};

// Conversational tone detection keywords
export const TONE_KEYWORDS: Record<string, string[]> = {
  positive: ['great', 'good', 'excellent', 'amazing', 'love', 'happy', 'wonderful', 'awesome', 'enjoy', 'proud'],
  negative: ['bad', 'terrible', 'hate', 'awful', 'horrible', 'sad', 'angry', 'failed', 'hopeless', 'disappointed'],
  uncertain: ['maybe', 'perhaps', 'not sure', 'confused', 'unsure', 'doubt', 'hesitant', 'stuck'],
  excited: ['wow', 'amazing', 'incredible', 'exciting', 'fantastic', 'eager', 'cant wait', "can't wait", 'thrilled'],
  calm: ['okay', 'fine', 'alright', 'peaceful', 'relaxed', 'ready', 'clear'],
  stressed: ['stressed', 'worried', 'anxious', 'frustrated', 'overwhelmed', 'nervous', 'panicking', 'scared', 'deadline'],
};

function toneToEmotion(tone: string): string {
  switch (tone) {
    case 'positive': return 'happy';
    case 'excited': return 'excited';
    case 'negative': return 'sad';
    case 'stressed': return 'stressed';
    case 'uncertain': return 'concerned';
    case 'calm': return 'neutral';
    default: return 'neutral';
  }
}

export function useFacialEmotionDetection() {
  const [faceDetected] = useState(false);
  const [detectedEmotion, setDetectedEmotion] = useState('neutral');
  const [emotionConfidence, setEmotionConfidence] = useState(0.5);
  const [detectedTone, setDetectedTone] = useState('neutral');
  const [faceMetrics] = useState<any>(null);

  // Safe ref stubs to prevent null pointer exceptions if unmounted/rendered
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  /**
   * Safe no-op camera initializer:
   * Camera surveillance is disabled by design for student data privacy and DPDP Act compliance.
   */
  const initializeCamera = useCallback(async (): Promise<MediaStream | null> => {
    return null;
  }, []);

  /**
   * Safe no-op camera teardown.
   */
  const stopCamera = useCallback(() => {
    // No camera tracks are opened
  }, []);

  /**
   * Safe no-op ML face detector:
   * ML face bounding box / class detection is disabled.
   */
  const detectFaceWithML = useCallback(async () => {
    return null;
  }, []);

  /**
   * Safe no-op face image analyzer:
   * Deceptive pixel-color averaging is removed.
   */
  const analyzeFaceEmotion = useCallback(async (_imageData: ImageData | null) => {
    return null;
  }, []);

  /**
   * Genuine text-based conversational sentiment analysis.
   * Analyzes lexical cues in the student's message to adjust mentor empathy and guidance.
   */
  const analyzeTone = useCallback((text: string | null | undefined): string => {
    if (!text || typeof text !== 'string') return 'neutral';

    const lowerText = text.toLowerCase();
    let maxScore = 0;
    let foundTone = 'neutral';

    for (const [tone, keywords] of Object.entries(TONE_KEYWORDS)) {
      const matches = keywords.filter(k => lowerText.includes(k)).length;
      const score = matches / keywords.length;

      if (score > maxScore) {
        maxScore = score;
        foundTone = tone;
      }
    }

    return foundTone;
  }, []);

  /**
   * Conversational resonance: adapt mentor tone and pacing based on dialogue sentiment.
   */
  const getLimbicResonance = useCallback((userEmotion: string, userTone: string) => {
    const responses: Record<string, string> = {
      happy: 'warmth_increased',
      sad: 'empathy_increased',
      concerned: 'support_increased',
      excited: 'encouragement_increased',
      stressed: 'calm_pacing_increased',
      neutral: 'attentive',
    };

    const toneAdjustments: Record<string, any> = {
      excited: { energy: 1.1, speed: 1.05 },
      calm: { energy: 0.9, speed: 0.95 },
      stressed: { energy: 0.85, pace: 'slower', empathy: 1.4 },
      uncertain: { confidence: 0.8, reassurance: 1.3 },
      negative: { empathy: 1.5, tone: 'supportive' },
      positive: { warmth: 1.2 },
    };

    const emotionResonance = {
      emotion: userEmotion,
      intensity: 0.6,
      response: responses[userEmotion] || 'attentive',
    };

    const toneResonance = {
      tone: userTone,
      matchLevel: 0.75,
      adjustments: toneAdjustments[userTone] || {},
    };

    return {
      emotionResonance,
      toneResonance,
      overallResonance: 0.75,
    };
  }, []);

  /**
   * Derives conversational emotional context from student message text.
   */
  const getEmotionalContext = useCallback((userMessage: string) => {
    const tone = analyzeTone(userMessage);
    const emotion = toneToEmotion(tone);
    const confidence = tone === 'neutral' ? 0.5 : 0.85;

    setDetectedTone(tone);
    setDetectedEmotion(emotion);
    setEmotionConfidence(confidence);

    return {
      detectedEmotion: emotion,
      emotionConfidence: confidence,
      analyzedTone: tone,
      limbicResonance: getLimbicResonance(emotion, tone),
      faceMetrics: null,
      faceDetected: false,
    };
  }, [analyzeTone, getLimbicResonance]);

  return {
    initializeCamera,
    stopCamera,
    detectFaceWithML,
    analyzeFaceEmotion,
    analyzeTone,
    getLimbicResonance,
    getEmotionalContext,
    videoRef,
    canvasRef,
    faceDetected,
    detectedEmotion,
    emotionConfidence,
    detectedTone,
    faceMetrics,
    EMOTION_SIGNATURES,
  };
}
