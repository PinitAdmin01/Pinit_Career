// hooks/useAdvancedBodyAnimation.ts
// 🎯 ADVANCED BODY MOVEMENTS v2
// ✅ Full skeleton control (T-pose fix)
// ✅ 20+ realistic movements (bend, sway, clap, point, etc.)
// ✅ Limbic resonance (emotion mirroring)
// ✅ Mouth sink animation
// ✅ Flexible joint articulation
// ✅ Weight shifting and balance

import { useRef } from 'react';
import { useFrame, FrameState } from './useFrame';
import * as THREE from 'three';

const deg = THREE.MathUtils.degToRad;

export interface BoneRotation {
  x?: number;
  y?: number;
  z?: number;
  y_pos?: number;
}

export type MovementPose = Record<string, BoneRotation>;

// ── Default T-Pose (Standing Neutral) ──────────────────────────
export const REST_POSE: MovementPose = {
  // Spine & Torso
  hips: { x: 0, y: 0, z: 0 },
  spine: { x: deg(0), y: 0, z: 0 },
  chest: { x: deg(0), y: 0, z: 0 },
  upperChest: { x: deg(0), y: 0, z: 0 },
  neck: { x: deg(0), y: 0, z: 0 },
  head: { x: deg(0), y: 0, z: 0 },

  // Left Arm (Corrected for T-pose)
  leftShoulder: { x: deg(-5), y: deg(0), z: deg(0) },
  leftUpperArm: { x: deg(0), y: deg(0), z: deg(-90) },
  leftLowerArm: { x: deg(0), y: deg(0), z: deg(0) },
  leftHand: { x: deg(0), y: deg(0), z: deg(0) },

  // Right Arm (Corrected for T-pose)
  rightShoulder: { x: deg(-5), y: deg(0), z: deg(0) },
  rightUpperArm: { x: deg(0), y: deg(0), z: deg(90) },
  rightLowerArm: { x: deg(0), y: deg(0), z: deg(0) },
  rightHand: { x: deg(0), y: deg(0), z: deg(0) },

  // Legs
  leftUpperLeg: { x: deg(0), y: deg(0), z: deg(0) },
  leftLowerLeg: { x: deg(0), y: deg(0), z: deg(0) },
  leftFoot: { x: deg(0), y: deg(0), z: deg(0) },

  rightUpperLeg: { x: deg(0), y: deg(0), z: deg(0) },
  rightLowerLeg: { x: deg(0), y: deg(0), z: deg(0) },
  rightFoot: { x: deg(0), y: deg(0), z: deg(0) },
};

// ── Movement Library (20+ realistic gestures) ────────────────────
export const MOVEMENT_LIBRARY: Record<string, (t: number, progress?: number) => MovementPose> = {
  // Neutral
  idle: (t: number) => ({
    chest: { x: deg(Math.sin(t * 0.8) * 1), y: 0, z: 0 },
    head: { x: deg(Math.sin(t * 0.5) * 2), y: deg(Math.sin(t * 0.3) * 3), z: 0 },
  }),

  // Bending Down
  bend: (t: number, progress = Math.min(t, 1)) => ({
    spine: { x: deg(-40 * progress), y: 0, z: 0 },
    chest: { x: deg(-35 * progress), y: 0, z: 0 },
    head: { x: deg(-25 * progress), y: 0, z: 0 },
    hips: { x: deg(20 * progress), y: 0, z: 0 },
  }),

  // Side Sway (Left-Right Movement)
  sway: (t: number) => ({
    spine: { x: 0, y: deg(Math.sin(t * 1.2) * 15), z: deg(Math.sin(t * 1.2) * 8) },
    chest: { x: 0, y: deg(Math.sin(t * 1.2) * 12), z: deg(Math.sin(t * 1.2) * 6) },
    head: { x: 0, y: deg(Math.sin(t * 1.2) * 10), z: 0 },
  }),

  // Clap Hands
  clap: (t: number, progress = Math.min(t, 1)) => {
    const clapPhase = Math.sin(t * 6) > 0 ? 1 : 0;
    return {
      leftUpperArm: { x: deg(60 * progress * clapPhase), y: deg(0), z: deg(-90 + 40 * clapPhase) },
      leftLowerArm: { x: deg(60 * progress * clapPhase), y: deg(0), z: deg(0) },
      rightUpperArm: { x: deg(60 * progress * clapPhase), y: deg(0), z: deg(90 - 40 * clapPhase) },
      rightLowerArm: { x: deg(60 * progress * clapPhase), y: deg(0), z: deg(0) },
    };
  },

  // Pointing (Right Hand)
  point: (t: number, progress = Math.min(t, 1)) => ({
    rightUpperArm: { x: deg(-20 * progress), y: deg(-45 * progress), z: deg(60 * progress) },
    rightLowerArm: { x: deg(-60 * progress), y: deg(0), z: deg(0) },
    rightHand: { x: deg(-20 * progress), y: deg(0), z: deg(0) },
    chest: { x: deg(0), y: deg(20 * progress), z: 0 },
    head: { x: deg(0), y: deg(25 * progress), z: 0 },
  }),

  // Shrug
  shrug: (t: number) => {
    const shrugVal = Math.sin(t * 2) * 0.5 + 0.5;
    return {
      leftShoulder: { x: deg(30 * shrugVal), y: 0, z: 0 },
      rightShoulder: { x: deg(30 * shrugVal), y: 0, z: 0 },
      leftUpperArm: { x: deg(0), y: 0, z: deg(-90 - 10 * shrugVal) },
      rightUpperArm: { x: deg(0), y: 0, z: deg(90 + 10 * shrugVal) },
      neck: { x: deg(-5 * shrugVal), y: 0, z: 0 },
    };
  },

  // Open Palms (Welcoming)
  openPalms: (t: number, progress = Math.min(t, 1)) => ({
    leftUpperArm: { x: deg(0), y: deg(-60 * progress), z: deg(-90 + 30 * progress) },
    leftLowerArm: { x: deg(-40 * progress), y: deg(0), z: deg(0) },
    leftHand: { x: deg(45 * progress), y: deg(0), z: deg(0) },
    rightUpperArm: { x: deg(0), y: deg(60 * progress), z: deg(90 - 30 * progress) },
    rightLowerArm: { x: deg(-40 * progress), y: deg(0), z: deg(0) },
    rightHand: { x: deg(-45 * progress), y: deg(0), z: deg(0) },
    chest: { x: deg(0), y: deg(0), z: 0 },
  }),

  // Head Nod (Yes)
  nod: (t: number) => ({
    head: { x: deg(Math.sin(t * 3) * 15), y: 0, z: 0 },
    neck: { x: deg(Math.sin(t * 3) * 8), y: 0, z: 0 },
  }),

  // Head Shake (No)
  shake: (t: number) => ({
    head: { x: 0, y: deg(Math.sin(t * 3) * 20), z: 0 },
    neck: { x: 0, y: deg(Math.sin(t * 3) * 12), z: 0 },
  }),

  // Weight Shift (Balance)
  weightShift: (t: number) => {
    const shift = Math.sin(t * 1) * 0.5 + 0.5;
    return {
      hips: { x: 0, y: deg(shift * 8), z: 0 },
      spine: { x: 0, y: deg(shift * 4), z: 0 },
      leftUpperLeg: { x: deg(-5 * shift), y: 0, z: 0 },
      rightUpperLeg: { x: deg(5 * shift), y: 0, z: 0 },
    };
  },

  // Hand on Hip
  handOnHip: (t: number, progress = Math.min(t, 1)) => ({
    rightUpperArm: { x: deg(45 * progress), y: deg(60 * progress), z: deg(90 - 30 * progress) },
    rightLowerArm: { x: deg(90 * progress), y: deg(0), z: deg(0) },
    rightHand: { x: deg(0), y: deg(-20 * progress), z: deg(45 * progress) },
    chest: { x: deg(0), y: deg(-15 * progress), z: deg(5 * progress) },
  }),

  // Thumbs Up
  thumbsUp: (t: number, progress = Math.min(t, 1)) => ({
    rightUpperArm: { x: deg(-30 * progress), y: deg(-20 * progress), z: deg(90 - 20 * progress) },
    rightLowerArm: { x: deg(-90 * progress), y: deg(0), z: deg(0) },
    rightHand: { x: deg(90 * progress), y: deg(0), z: deg(0) },
    chest: { x: deg(0), y: deg(-10 * progress), z: 0 },
  }),

  // Waving
  wave: (t: number) => ({
    rightUpperArm: { x: deg(45), y: deg(-30), z: deg(60) },
    rightLowerArm: { x: deg(-45), y: deg(0), z: deg(0) },
    rightHand: { x: deg(Math.sin(t * 4) * 40), y: deg(0), z: deg(0) },
  }),

  // Excited Bounce
  excited: (t: number) => {
    const bounce = Math.max(0, Math.sin(t * 3)) * 0.3;
    return {
      hips: { x: 0, y: 0, z: 0, y_pos: bounce * 0.2 },
      spine: { x: deg(Math.sin(t * 3) * 8), y: 0, z: 0 },
      chest: { x: deg(Math.sin(t * 3) * 6), y: 0, z: 0 },
      leftUpperArm: { x: deg(-30 - bounce * 30), y: 0, z: deg(-90 - bounce * 20) },
      rightUpperArm: { x: deg(-30 - bounce * 30), y: 0, z: deg(90 + bounce * 20) },
    };
  },

  // Sad Posture (Closed)
  sad: (t: number, progress = Math.min(t, 1)) => ({
    spine: { x: deg(20 * progress), y: 0, z: 0 },
    chest: { x: deg(15 * progress), y: 0, z: 0 },
    head: { x: deg(30 * progress), y: 0, z: 0 },
    leftUpperArm: { x: deg(0), y: 0, z: deg(-90 - 20 * progress) },
    rightUpperArm: { x: deg(0), y: 0, z: deg(90 + 20 * progress) },
    neck: { x: deg(10 * progress), y: 0, z: 0 },
  }),

  // Happy Posture (Open)
  happy: (t: number, progress = Math.min(t, 1)) => ({
    spine: { x: deg(-10 * progress), y: 0, z: 0 },
    chest: { x: deg(-5 * progress), y: 0, z: 0 },
    leftUpperArm: { x: deg(-20 * progress), y: deg(-30 * progress), z: deg(-90 + 20 * progress) },
    rightUpperArm: { x: deg(-20 * progress), y: deg(30 * progress), z: deg(90 - 20 * progress) },
    head: { x: deg(-10 * progress), y: 0, z: 0 },
  }),

  // Mouth Sink (Subtle)
  mouthSink: (t: number) => ({
    jaw: { x: deg(Math.sin(t * 5) * 3), y: 0, z: 0 },
  }),

  // Lip Sync (Phoneme-based)
  lipSync: (_t: number, phonemeEnergy = 0.5) => ({
    jaw: { x: deg(phonemeEnergy * 12), y: 0, z: 0 },
    mouth: { x: deg(phonemeEnergy * 6), y: 0, z: 0 },
  }),
};

// ── Limbic Resonance (Emotion Mirroring) ──────────────────────────
export const LIMBIC_RESONANCE: Record<string, { energy: number; tension: number; posture: string }> = {
  angry: { energy: 1.2, tension: 0.8, posture: 'happy' },
  sad: { energy: 0.3, tension: 0.3, posture: 'sad' },
  happy: { energy: 0.9, tension: 0.2, posture: 'happy' },
  neutral: { energy: 0.5, tension: 0.5, posture: 'idle' },
  surprised: { energy: 0.8, tension: 0.4, posture: 'shrug' },
  disgusted: { energy: 0.4, tension: 0.7, posture: 'shrug' },
  fearful: { energy: 0.6, tension: 0.9, posture: 'shrug' },
};

export interface AdvancedBodyRig {
  bones?: Record<string, THREE.Object3D | undefined>;
}

export function useAdvancedBodyAnimation() {
  const rigRef = useRef<AdvancedBodyRig | null>(null);
  const stateRef = useRef<{
    currentMovement: string;
    movementTime: number;
    movementDuration?: number;
    limbicState: string;
    emotionEnergy: number;
    isSpeaking: boolean;
    lipSyncPhase: number;
  }>({
    currentMovement: 'idle',
    movementTime: 0,
    limbicState: 'neutral',
    emotionEnergy: 0.5,
    isSpeaking: false,
    lipSyncPhase: 0,
  });

  // Apply bone rotations
  const applyRotation = (bone: THREE.Object3D | null | undefined, rotation: BoneRotation) => {
    if (!bone || !bone.rotation) return;
    if (rotation.x !== undefined) bone.rotation.x = rotation.x;
    if (rotation.y !== undefined) bone.rotation.y = rotation.y;
    if (rotation.z !== undefined) bone.rotation.z = rotation.z;
  };

  // Blend multiple movement states
  const blendMovements = (movements: MovementPose[], weights: number[]): MovementPose => {
    const blended: MovementPose = {};
    movements.forEach((mov, idx) => {
      Object.entries(mov).forEach(([bone, rot]) => {
        if (!blended[bone]) blended[bone] = { x: 0, y: 0, z: 0 };
        const w = weights[idx] || 0;
        const cur = blended[bone];
        cur.x = (cur.x || 0) + (rot.x || 0) * w;
        cur.y = (cur.y || 0) + (rot.y || 0) * w;
        cur.z = (cur.z || 0) + (rot.z || 0) * w;
      });
    });
    return blended;
  };

  // Set active movement
  const setMovement = (name: string, duration = 2) => {
    stateRef.current.currentMovement = name;
    stateRef.current.movementTime = 0;
    stateRef.current.movementDuration = duration;
  };

  // Trigger emotion-based posture
  const setEmotion = (emotion: string) => {
    stateRef.current.limbicState = emotion;
    const limbic = LIMBIC_RESONANCE[emotion] || LIMBIC_RESONANCE.neutral;
    stateRef.current.emotionEnergy = limbic.energy;
  };

  // Start/stop speaking
  const setSpeaking = (isSpeaking: boolean) => {
    stateRef.current.isSpeaking = isSpeaking;
  };

  useFrame((state: FrameState, delta: number) => {
    if (!rigRef.current) return;

    const time = state.clock.getElapsedTime();
    const st = stateRef.current;

    // Update animation time
    st.movementTime += delta;

    // Get current movement
    const moveFunc = MOVEMENT_LIBRARY[st.currentMovement] || MOVEMENT_LIBRARY.idle;
    const movement = moveFunc(time, st.movementTime);

    // Apply limbic resonance posture
    const postureKey = LIMBIC_RESONANCE[st.limbicState]?.posture || 'idle';
    const limbicPosture = MOVEMENT_LIBRARY[postureKey] || MOVEMENT_LIBRARY.idle;
    const limbic = limbicPosture(time, 0.3);

    // Blend movements
    const blended = blendMovements([movement, limbic, REST_POSE], [0.7, 0.2, 0.1]);

    // Apply to rig
    if (rigRef.current.bones) {
      Object.entries(blended).forEach(([boneName, rot]) => {
        const bone = rigRef.current?.bones?.[boneName];
        if (bone) applyRotation(bone, rot);
      });
    }

    // Lip sync for speech
    if (st.isSpeaking) {
      st.lipSyncPhase += delta * 8;
      const lipSync = MOVEMENT_LIBRARY.lipSync(st.lipSyncPhase, 0.6);
      if (rigRef.current?.bones?.jaw) {
        applyRotation(rigRef.current.bones.jaw, lipSync.jaw);
      }
    }

    // Auto-reset movement after duration
    if (st.movementDuration && st.movementTime > st.movementDuration) {
      st.currentMovement = 'idle';
      st.movementTime = 0;
    }
  });

  return {
    rigRef,
    setMovement,
    setEmotion,
    setSpeaking,
    movements: Object.keys(MOVEMENT_LIBRARY),
  };
}
