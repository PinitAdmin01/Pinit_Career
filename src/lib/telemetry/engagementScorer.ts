'use client';

import { RawLandmarkSignals, RawAudioCadenceSignals } from './practiceTelemetry';

export interface EngagementMetrics {
  attentionScore: number;    // 0 to 100
  eyeContactScore: number;   // 0 to 100
  speechPaceWPM: number;     // Words per minute
  energyLevel: 'Low' | 'Moderate' | 'High' | 'Dynamic';
  isAttentive: boolean;
}

/**
 * Computes live engagement and attention scores from physical telemetry frames
 */
export function computeLiveEngagement(
  landmark: RawLandmarkSignals,
  cadence: RawAudioCadenceSignals
): EngagementMetrics {
  if (!landmark.faceDetected) {
    return {
      attentionScore: 0,
      eyeContactScore: 0,
      speechPaceWPM: 0,
      energyLevel: 'Low',
      isAttentive: false
    };
  }

  // 1. Eye Contact & Alignment (Yaw < 15 deg & Pitch < 12 deg)
  const absYaw = Math.abs(landmark.yaw ?? 0);
  const absPitch = Math.abs(landmark.pitch ?? 0);
  const gazeAlignment = Math.max(0, 100 - (absYaw * 2.2 + absPitch * 1.8));

  // 2. Blink Rate & EAR (Eye Aspect Ratio healthy between 0.20 - 0.35)
  const ear = landmark.eyeAspectRatio ?? 0.28;
  const earScore = ear >= 0.18 && ear <= 0.38 ? 95 : 60;

  const eyeContactScore = Math.round((gazeAlignment * 0.7 + earScore * 0.3));

  // 3. Audio Cadence & Speaking Pace (WPM)
  const durationMin = Math.max(0.05, cadence.durationSeconds / 60);
  const speechPaceWPM = Math.round(cadence.wordCount / durationMin);

  // 4. Overall Attention Score (0-100)
  const movement = landmark.frameDeltaMovement ?? 0.05;
  const movementPenalty = movement > 0.6 ? 25 : 0; // Excessive jitter penalty
  const attentionScore = Math.max(0, Math.min(100, Math.round(eyeContactScore - movementPenalty)));

  // 5. Energy Level Classification
  const rms = cadence.audioEnergyRMS ?? 0.2;
  let energyLevel: 'Low' | 'Moderate' | 'High' | 'Dynamic' = 'Moderate';
  if (rms < 0.05 && speechPaceWPM < 80) energyLevel = 'Low';
  else if (rms > 0.45 || speechPaceWPM > 165) energyLevel = 'High';
  else if (movement > 0.3 && speechPaceWPM > 120) energyLevel = 'Dynamic';

  return {
    attentionScore,
    eyeContactScore,
    speechPaceWPM,
    energyLevel,
    isAttentive: attentionScore >= 60
  };
}
