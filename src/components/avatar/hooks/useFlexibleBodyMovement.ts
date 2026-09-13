// hooks/useFlexibleBodyMovement.ts
// 🎭 FULL-BODY FLEXIBLE MOVEMENT SYSTEM
// ✅ All bone control
// ✅ Realistic posture
// ✅ Natural weight distribution
// ✅ Flexible spine
// ✅ T-pose correction

import { useRef, useState, useCallback } from 'react';
import * as THREE from 'three';

const deg = THREE.MathUtils.degToRad;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// Complete skeleton bone list with VRM naming
export const FULL_SKELETON: Record<string, string> = {
  // Core
  hips: 'Armature|Hips',
  spine: 'Armature|Spine',
  spine1: 'Armature|Spine1',
  spine2: 'Armature|Spine2',
  chest: 'Armature|Chest',
  neck: 'Armature|Neck',
  head: 'Armature|Head',

  // Left Arm (T-pose fix: arms down naturally)
  leftShoulder: 'Armature|LeftShoulder',
  leftUpperArm: 'Armature|LeftUpperArm',
  leftLowerArm: 'Armature|LeftForeArm',
  leftHand: 'Armature|LeftHand',
  leftThumbProximal: 'Armature|LeftThumbProximal',
  leftThumbIntermediate: 'Armature|LeftThumbIntermediate',
  leftIndexProximal: 'Armature|LeftIndexProximal',
  leftIndexIntermediate: 'Armature|LeftIndexIntermediate',
  leftIndexDistal: 'Armature|LeftIndexDistal',
  leftMiddleProximal: 'Armature|LeftMiddleProximal',
  leftMiddleIntermediate: 'Armature|LeftMiddleIntermediate',
  leftMiddleDistal: 'Armature|LeftMiddleDistal',
  leftRingProximal: 'Armature|LeftRingProximal',
  leftRingIntermediate: 'Armature|LeftRingIntermediate',
  leftRingDistal: 'Armature|LeftRingDistal',
  leftLittleProximal: 'Armature|LeftLittleProximal',
  leftLittleIntermediate: 'Armature|LeftLittleIntermediate',
  leftLittleDistal: 'Armature|LeftLittleDistal',

  // Right Arm (T-pose fix: arms down naturally)
  rightShoulder: 'Armature|RightShoulder',
  rightUpperArm: 'Armature|RightUpperArm',
  rightLowerArm: 'Armature|RightForeArm',
  rightHand: 'Armature|RightHand',
  rightThumbProximal: 'Armature|RightThumbProximal',
  rightThumbIntermediate: 'Armature|RightThumbIntermediate',
  rightIndexProximal: 'Armature|RightIndexProximal',
  rightIndexIntermediate: 'Armature|RightIndexIntermediate',
  rightIndexDistal: 'Armature|RightIndexDistal',
  rightMiddleProximal: 'Armature|RightMiddleProximal',
  rightMiddleIntermediate: 'Armature|RightMiddleIntermediate',
  rightMiddleDistal: 'Armature|RightMiddleDistal',
  rightRingProximal: 'Armature|RightRingProximal',
  rightRingIntermediate: 'Armature|RightRingIntermediate',
  rightRingDistal: 'Armature|RightRingDistal',
  rightLittleProximal: 'Armature|RightLittleProximal',
  rightLittleIntermediate: 'Armature|RightLittleIntermediate',
  rightLittleDistal: 'Armature|RightLittleDistal',

  // Left Leg
  leftUpperLeg: 'Armature|LeftUpperLeg',
  leftLowerLeg: 'Armature|LeftLowerLeg',
  leftFoot: 'Armature|LeftFoot',
  leftToes: 'Armature|LeftToes',

  // Right Leg
  rightUpperLeg: 'Armature|RightUpperLeg',
  rightLowerLeg: 'Armature|RightLowerLeg',
  rightFoot: 'Armature|RightFoot',
  rightToes: 'Armature|RightToes',
};

// Bone constraints and ranges
export const BONE_CONSTRAINTS: Record<string, { x?: [number, number]; y?: [number, number]; z?: [number, number] }> = {
  spine: { x: [-30, 30], y: [-20, 20], z: [-25, 25] },
  spine1: { x: [-25, 25], y: [-15, 15], z: [-20, 20] },
  spine2: { x: [-20, 20], y: [-15, 15], z: [-15, 15] },
  chest: { x: [-15, 15], y: [-10, 10], z: [-10, 10] },
  neck: { x: [-30, 30], y: [-40, 40], z: [-20, 20] },
  head: { x: [-25, 25], y: [-60, 60], z: [-20, 20] },
  leftUpperArm: { x: [-90, 160], y: [-90, 90], z: [-90, 90] },
  rightUpperArm: { x: [-90, 160], y: [-90, 90], z: [-90, 90] },
  leftLowerArm: { x: [0, 140], y: [-90, 90], z: [-90, 0] },
  rightLowerArm: { x: [0, 140], y: [-90, 90], z: [0, 90] },
  leftHand: { x: [-45, 45], y: [-40, 40], z: [-40, 40] },
  rightHand: { x: [-45, 45], y: [-40, 40], z: [-40, 40] },
  leftUpperLeg: { x: [-120, 120], y: [-40, 40], z: [-40, 40] },
  rightUpperLeg: { x: [-120, 120], y: [-40, 40], z: [-40, 40] },
  leftLowerLeg: { x: [0, 130], y: [0, 0], z: [0, 0] },
  rightLowerLeg: { x: [0, 130], y: [0, 0], z: [0, 0] },
};

export interface VRMModelLike {
  scene?: THREE.Group | THREE.Object3D;
  humanoid?: any;
}

export function useFlexibleBodyMovement(vrmModel?: VRMModelLike | null) {
  const bonesMapRef = useRef<Map<string, THREE.Object3D>>(new Map());
  const boneRotationRef = useRef<Map<string, { x: number; y: number; z: number }>>(new Map());
  const bodyStateRef = useRef({
    posture: 'standing', // standing, sitting, crouching
    weight: 'center', // center, left, right
    flexibility: 1, // 0-1 scale
  });

  const [bodyReady, setBodyReady] = useState(false);

  // Fix T-pose (arms naturally down instead of spread)
  const fixTPose = useCallback(() => {
    const leftShoulder = bonesMapRef.current.get('leftShoulder');
    const rightShoulder = bonesMapRef.current.get('rightShoulder');

    if (leftShoulder) {
      leftShoulder.rotation.z = deg(-10);
    }
    if (rightShoulder) {
      rightShoulder.rotation.z = deg(10);
    }

    const leftUpperArm = bonesMapRef.current.get('leftUpperArm');
    const rightUpperArm = bonesMapRef.current.get('rightUpperArm');

    if (leftUpperArm) {
      leftUpperArm.rotation.z = deg(-5);
      leftUpperArm.rotation.x = deg(0);
    }
    if (rightUpperArm) {
      rightUpperArm.rotation.z = deg(5);
      rightUpperArm.rotation.x = deg(0);
    }
  }, []);

  // Initialize body with T-pose fix
  const initializeBody = useCallback(() => {
    if (!vrmModel?.scene) return;

    try {
      vrmModel.scene.traverse((node: THREE.Object3D) => {
        for (const [boneName, vrmName] of Object.entries(FULL_SKELETON)) {
          if (node.name === vrmName || node.name.includes(boneName)) {
            bonesMapRef.current.set(boneName, node);
            boneRotationRef.current.set(boneName, { x: 0, y: 0, z: 0 });
          }
        }
      });

      fixTPose();
      setBodyReady(true);
      console.log('✅ Full body initialized with', bonesMapRef.current.size, 'bones');
    } catch (error) {
      console.error('❌ Error initializing body:', error);
    }
  }, [vrmModel, fixTPose]);

  // Update bone rotation with constraints
  const updateBoneRotation = useCallback((boneName: string, targetRotation: { x?: number; y?: number; z?: number }, smooth = 0.1) => {
    const bone = bonesMapRef.current.get(boneName);
    if (!bone) return;

    const constraints = BONE_CONSTRAINTS[boneName];
    const current = boneRotationRef.current.get(boneName) || { x: 0, y: 0, z: 0 };

    const clampVal = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

    const constrained = {
      x: constraints?.x ? deg(clampVal(targetRotation.x || 0, constraints.x[0], constraints.x[1])) : (targetRotation.x !== undefined ? deg(targetRotation.x) : 0),
      y: constraints?.y ? deg(clampVal(targetRotation.y || 0, constraints.y[0], constraints.y[1])) : (targetRotation.y !== undefined ? deg(targetRotation.y) : 0),
      z: constraints?.z ? deg(clampVal(targetRotation.z || 0, constraints.z[0], constraints.z[1])) : (targetRotation.z !== undefined ? deg(targetRotation.z) : 0),
    };

    const newRotation = {
      x: lerp(current.x, constrained.x, smooth),
      y: lerp(current.y, constrained.y, smooth),
      z: lerp(current.z, constrained.z, smooth),
    };

    boneRotationRef.current.set(boneName, newRotation);
    bone.rotation.x = newRotation.x;
    bone.rotation.y = newRotation.y;
    bone.rotation.z = newRotation.z;
  }, []);

  // Body bending (left-right movement)
  const bendBodyLeftRight = useCallback((direction: number, intensity = 0.5) => {
    const bendAmount = direction * intensity * 25;

    updateBoneRotation('spine', { z: bendAmount * 0.3 });
    updateBoneRotation('spine1', { z: bendAmount * 0.4 });
    updateBoneRotation('spine2', { z: bendAmount * 0.3 });
    updateBoneRotation('chest', { z: bendAmount * 0.2 });

    const hips = bonesMapRef.current.get('hips');
    if (hips) {
      hips.position.x = -direction * intensity * 0.05;
    }
  }, [updateBoneRotation]);

  // Forward/backward bending
  const bendBodyForwardBackward = useCallback((direction: number, intensity = 0.5) => {
    const bendAmount = direction * intensity * 30;

    updateBoneRotation('spine', { x: bendAmount * 0.3 });
    updateBoneRotation('spine1', { x: bendAmount * 0.4 });
    updateBoneRotation('spine2', { x: bendAmount * 0.3 });
    updateBoneRotation('chest', { x: bendAmount * 0.2 });
    updateBoneRotation('neck', { x: bendAmount * -0.3 });
  }, [updateBoneRotation]);

  // Hand clap animation
  const clap = useCallback((intensity = 1, duration = 0.5) => {
    const steps = 10;
    const stepDuration = duration / steps;

    for (let i = 0; i <= steps; i++) {
      setTimeout(() => {
        const progress = i / steps;
        const clapAmount = Math.sin(progress * Math.PI) * intensity;

        updateBoneRotation('leftLowerArm', { x: -90 * clapAmount, y: 45 * clapAmount });
        updateBoneRotation('rightLowerArm', { x: -90 * clapAmount, y: -45 * clapAmount });

        updateBoneRotation('leftHand', { x: 45 * clapAmount });
        updateBoneRotation('rightHand', { x: 45 * clapAmount });
      }, stepDuration * i * 1000);
    }
  }, [updateBoneRotation]);

  // Arm swinging (walking motion)
  const armSwing = useCallback((direction = 1, intensity = 0.5) => {
    const swingAmount = direction * intensity * 45;

    updateBoneRotation('leftUpperArm', { x: swingAmount });
    updateBoneRotation('leftLowerArm', { x: Math.max(0, swingAmount * 0.5) });

    updateBoneRotation('rightUpperArm', { x: -swingAmount });
    updateBoneRotation('rightLowerArm', { x: Math.max(0, -swingAmount * 0.5) });
  }, [updateBoneRotation]);

  // Shoulder shrug
  const shrug = useCallback((intensity = 1, direction = 1) => {
    updateBoneRotation('leftShoulder', { y: -5 * direction, z: 15 * intensity });
    updateBoneRotation('rightShoulder', { y: 5 * direction, z: -15 * intensity });
    updateBoneRotation('neck', { z: 10 * intensity * direction });
  }, [updateBoneRotation]);

  // Full body rotation
  const rotateBody = useCallback((yawAngle: number) => {
    const hips = bonesMapRef.current.get('hips');
    if (hips) {
      hips.rotation.y = deg(yawAngle);
    }

    updateBoneRotation('spine', { y: yawAngle * 0.3 });
    updateBoneRotation('chest', { y: yawAngle * 0.2 });
  }, [updateBoneRotation]);

  const getBone = useCallback((boneName: string) => bonesMapRef.current.get(boneName), []);
  const getAllBones = useCallback(() => Object.fromEntries(bonesMapRef.current), []);

  return {
    initializeBody,
    updateBoneRotation,
    bendBodyLeftRight,
    bendBodyForwardBackward,
    clap,
    armSwing,
    shrug,
    rotateBody,
    getBone,
    getAllBones,
    fixTPose,
    bonesMapRef,
    bodyReady,
    bodyStateRef,
    BONE_CONSTRAINTS,
  };
}
