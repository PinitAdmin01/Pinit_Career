// src/lib/telemetry/practiceTelemetry.ts
// PinIT Client-Side Practice Delivery & Expression Telemetry Engine
// Architecture & Ethical Guardrails:
// 1. 100% Client-Side Privacy Shield (Zero video frames or raw audio ever leave the browser)
// 2. Strict EEOC / ADA Separation (Never feeds into hiring, interview score, or pass/fail outcomes)
// 3. Descriptive Observation over Psychological Inference (Measures physical movement, not "emotion/honesty")
// 4. Uncertainty & Availability States (HIGH, LOW_CONFIDENCE, UNAVAILABLE - never penalizes missing camera)
// 5. Accessibility Overrides (Supports full opt-out and microphone/camera-disabled practice modes)

export const PRACTICE_TELEMETRY_VERSION = 'v1.0';

export type SignalConfidence = 'HIGH' | 'LOW_CONFIDENCE' | 'UNAVAILABLE';

export interface RawLandmarkSignals {
  yaw?: number;           // Head rotation (-45 to +45 deg)
  pitch?: number;         // Head tilt up/down (-30 to +30 deg)
  roll?: number;          // Head roll (-30 to +30 deg)
  eyeAspectRatio?: number;// EAR (0.15 - 0.40)
  faceDetected: boolean;
  lightingQuality?: 'Good' | 'Low' | 'Harsh' | 'Unknown';
  frameDeltaMovement?: number; // Normalized landmark displacement (0.0 to 1.0)
}

export interface RawAudioCadenceSignals {
  wordCount: number;
  durationSeconds: number;
  audioEnergyRMS?: number; // 0.0 to 1.0
  silenceRatio?: number;   // 0.0 to 1.0
  micActive: boolean;
}

export interface DeliveryObservation {
  metricName: string;
  measuredValue: string | number;
  observationNote: string;
  coachingSuggestion?: string;
  confidence: SignalConfidence;
}

export interface PracticeTelemetryReport {
  engineVersion: string;
  generatedAt: string;
  telemetryMode: 'Active' | 'Visual_Disabled' | 'Audio_Disabled' | 'Fully_Disabled';
  overallSignalConfidence: SignalConfidence;
  metrics: {
    cameraAlignmentStabilityPercent: number; // 0-100% (Neutral measure of gaze alignment)
    speakingPaceWPM: number;                 // Measured words per minute
    speakingPaceCategory: 'Slower' | 'Typical' | 'Faster' | 'Variable' | 'Unavailable';
    facialMovementActivity: 'Subtle' | 'Moderate' | 'Dynamic' | 'Unavailable';
    audioDeliveryFlow: 'Steady' | 'Intermittent' | 'Silent' | 'Unavailable';
  };
  observations: DeliveryObservation[];
  accessibilityNotes: string[];
  disclaimer: string;
}

export const TELEMETRY_PRIVACY_DISCLAIMER =
  'This practice telemetry is computed 100% locally in your browser to help you review delivery habits. No video or raw audio is ever recorded or transmitted. These observations are strictly non-penalizing self-practice tools and NEVER affect your technical interview score or hiring evaluation.';

/**
 * Computes camera-orientation alignment stability score (0-100%) from head pose landmarks
 */
export function calculateCameraAlignment(raw: RawLandmarkSignals): {
  stabilityPercent: number;
  confidence: SignalConfidence;
  observation: string;
} {
  if (!raw.faceDetected || raw.yaw === undefined || raw.pitch === undefined) {
    return {
      stabilityPercent: 0,
      confidence: 'UNAVAILABLE',
      observation: 'Face tracking unavailable or camera view obstructed.'
    };
  }

  const isLowLight = raw.lightingQuality === 'Low';
  const confidence: SignalConfidence = isLowLight ? 'LOW_CONFIDENCE' : 'HIGH';

  // Evaluate distance from centered camera orientation (0 deg yaw, 0 deg pitch)
  const yawDeviation = Math.abs(raw.yaw);
  const pitchDeviation = Math.abs(raw.pitch);

  // Normal centered orientation is within 15 degrees yaw and 12 degrees pitch
  let alignmentScore = 100;
  if (yawDeviation > 15) alignmentScore -= Math.min(60, (yawDeviation - 15) * 3);
  if (pitchDeviation > 12) alignmentScore -= Math.min(40, (pitchDeviation - 12) * 2.5);

  const boundedScore = Math.max(10, Math.min(100, Math.round(alignmentScore)));

  let observation = 'Gaze orientation centered toward camera.';
  if (boundedScore < 60) {
    observation = 'Gaze direction frequently angled away from camera window.';
  } else if (boundedScore < 80) {
    observation = 'Gaze direction generally aligned with occasional off-center shifts.';
  }

  return {
    stabilityPercent: boundedScore,
    confidence,
    observation
  };
}

/**
 * Evaluates speaking cadence and words-per-minute without rigid punitive constraints
 */
export function evaluateSpeakingPace(audio: RawAudioCadenceSignals): {
  wpm: number;
  category: 'Slower' | 'Typical' | 'Faster' | 'Variable' | 'Unavailable';
  observation: string;
  coachingSuggestion?: string;
  confidence: SignalConfidence;
} {
  if (!audio.micActive || audio.durationSeconds <= 2 || audio.wordCount === 0) {
    return {
      wpm: 0,
      category: 'Unavailable',
      observation: 'Audio signal too brief or microphone inactive.',
      confidence: 'UNAVAILABLE'
    };
  }

  const rawWpm = Math.round((audio.wordCount / Math.max(audio.durationSeconds, 1)) * 60);
  const boundedWpm = Math.max(0, Math.min(300, rawWpm));

  let category: 'Slower' | 'Typical' | 'Faster' | 'Variable' = 'Typical';
  let observation = `Speaking cadence averaged ${boundedWpm} WPM (typical conversational pacing).`;
  let coachingSuggestion: string | undefined = undefined;

  if (boundedWpm < 100) {
    category = 'Slower';
    observation = `Speaking cadence averaged ${boundedWpm} WPM (measured in a slower, deliberate pacing range).`;
    coachingSuggestion = 'Practice maintaining momentum during technical explanations.';
  } else if (boundedWpm > 175) {
    category = 'Faster';
    observation = `Speaking cadence averaged ${boundedWpm} WPM (measured in a fast-paced range).`;
    coachingSuggestion = 'Consider pausing between complex architectural points to let the interviewer absorb key ideas.';
  }

  return {
    wpm: boundedWpm,
    category,
    observation,
    coachingSuggestion,
    confidence: 'HIGH'
  };
}

/**
 * Categorizes observable facial movement and natural expression activity
 */
export function evaluateFacialMovement(raw: RawLandmarkSignals): {
  activity: 'Subtle' | 'Moderate' | 'Dynamic' | 'Unavailable';
  observation: string;
  confidence: SignalConfidence;
} {
  if (!raw.faceDetected || raw.frameDeltaMovement === undefined) {
    return {
      activity: 'Unavailable',
      observation: 'Visual motion tracking unavailable.',
      confidence: 'UNAVAILABLE'
    };
  }

  const delta = raw.frameDeltaMovement;
  let activity: 'Subtle' | 'Moderate' | 'Dynamic' = 'Moderate';
  let observation = 'Facial movement and natural head movement observed in a moderate range.';

  if (delta < 0.08) {
    activity = 'Subtle';
    observation = 'Facial positioning remained largely static during explanation.';
  } else if (delta > 0.35) {
    activity = 'Dynamic';
    observation = 'Active facial expressiveness and gestures observed.';
  }

  return {
    activity,
    observation,
    confidence: raw.lightingQuality === 'Low' ? 'LOW_CONFIDENCE' : 'HIGH'
  };
}

/**
 * Master synthesizer generating client-side practice report with accessibility overrides
 */
export function synthesizePracticeTelemetryReport(
  landmarkSignals: RawLandmarkSignals,
  audioSignals: RawAudioCadenceSignals,
  options?: {
    disableVisual?: boolean;
    disableAudio?: boolean;
  }
): PracticeTelemetryReport {
  const isVisualDisabled = !!options?.disableVisual;
  const isAudioDisabled = !!options?.disableAudio;

  let telemetryMode: 'Active' | 'Visual_Disabled' | 'Audio_Disabled' | 'Fully_Disabled' = 'Active';
  if (isVisualDisabled && isAudioDisabled) telemetryMode = 'Fully_Disabled';
  else if (isVisualDisabled) telemetryMode = 'Visual_Disabled';
  else if (isAudioDisabled) telemetryMode = 'Audio_Disabled';

  const observations: DeliveryObservation[] = [];
  const accessibilityNotes: string[] = [];

  // 1. Camera Alignment Evaluation
  let cameraAlignment = { stabilityPercent: 0, confidence: 'UNAVAILABLE' as SignalConfidence, observation: 'Visual telemetry disabled by user setting.' };
  if (!isVisualDisabled) {
    cameraAlignment = calculateCameraAlignment(landmarkSignals);
    observations.push({
      metricName: 'Camera Alignment Stability',
      measuredValue: `${cameraAlignment.stabilityPercent}%`,
      observationNote: cameraAlignment.observation,
      confidence: cameraAlignment.confidence,
      coachingSuggestion: cameraAlignment.stabilityPercent < 70
        ? 'Placing your browser window close to your camera lens can help maintain natural eye orientation.'
        : undefined
    });
  } else {
    accessibilityNotes.push('Visual camera telemetry is disabled (Accessibility mode).');
  }

  // 2. Speaking Pace Evaluation
  let speakingPace: {
    wpm: number;
    category: 'Slower' | 'Typical' | 'Faster' | 'Variable' | 'Unavailable';
    observation: string;
    confidence: SignalConfidence;
    coachingSuggestion?: string;
  } = { wpm: 0, category: 'Unavailable', observation: 'Audio telemetry disabled by user setting.', confidence: 'UNAVAILABLE', coachingSuggestion: undefined };

  if (!isAudioDisabled) {
    speakingPace = evaluateSpeakingPace(audioSignals);
    observations.push({
      metricName: 'Speaking Cadence',
      measuredValue: `${speakingPace.wpm} WPM`,
      observationNote: speakingPace.observation,
      coachingSuggestion: speakingPace.coachingSuggestion,
      confidence: speakingPace.confidence
    });
  } else {
    accessibilityNotes.push('Audio telemetry is disabled (Accessibility mode).');
  }

  // 3. Facial Movement Activity Evaluation
  let facialMovement: {
    activity: 'Subtle' | 'Moderate' | 'Dynamic' | 'Unavailable';
    observation: string;
    confidence: SignalConfidence;
  } = { activity: 'Unavailable', observation: 'Visual telemetry disabled.', confidence: 'UNAVAILABLE' };

  if (!isVisualDisabled) {
    facialMovement = evaluateFacialMovement(landmarkSignals);
    observations.push({
      metricName: 'Facial Movement Activity',
      measuredValue: facialMovement.activity,
      observationNote: facialMovement.observation,
      confidence: facialMovement.confidence
    });
  }

  // Overall confidence
  let overallConfidence: SignalConfidence = 'HIGH';
  if (telemetryMode === 'Fully_Disabled' || (!landmarkSignals.faceDetected && !audioSignals.micActive)) {
    overallConfidence = 'UNAVAILABLE';
  } else if (cameraAlignment.confidence === 'LOW_CONFIDENCE' || landmarkSignals.lightingQuality === 'Low') {
    overallConfidence = 'LOW_CONFIDENCE';
  }

  return {
    engineVersion: PRACTICE_TELEMETRY_VERSION,
    generatedAt: new Date().toISOString(),
    telemetryMode,
    overallSignalConfidence: overallConfidence,
    metrics: {
      cameraAlignmentStabilityPercent: cameraAlignment.stabilityPercent,
      speakingPaceWPM: speakingPace.wpm,
      speakingPaceCategory: speakingPace.category,
      facialMovementActivity: facialMovement.activity,
      audioDeliveryFlow: audioSignals.micActive ? 'Steady' : 'Unavailable'
    },
    observations,
    accessibilityNotes,
    disclaimer: TELEMETRY_PRIVACY_DISCLAIMER
  };
}
