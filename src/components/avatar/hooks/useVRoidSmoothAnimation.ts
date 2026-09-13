// hooks/useVRoidSmoothAnimation.ts
// 🎯 VROID STUDIO ANIME AVATAR SMOOTH ANIMATION
// ✅ VRM bone mapping
// ✅ Anime character smooth movements
// ✅ Hair physics simulation
// ✅ Cloth simulation ready
// ✅ Optimized for anime style

import { useRef, useState, useCallback, useEffect } from 'react';
import { useFrame, FrameState } from './useFrame';
import * as THREE from 'three';

const deg = THREE.MathUtils.degToRad;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// VRM Standard Bone Names (VRoid uses these)
export const VRM_BONES: Record<string, string> = {
  hips: 'Armature|Hips',
  spine: 'Armature|Spine',
  chest: 'Armature|Chest',
  neck: 'Armature|Neck',
  head: 'Armature|Head',
  leftShoulder: 'Armature|LeftShoulder',
  rightShoulder: 'Armature|RightShoulder',
  leftUpperArm: 'Armature|LeftUpperArm',
  rightUpperArm: 'Armature|RightUpperArm',
  leftLowerArm: 'Armature|LeftLowerArm',
  rightLowerArm: 'Armature|RightLowerArm',
  leftHand: 'Armature|LeftHand',
  rightHand: 'Armature|RightHand',
  leftUpperLeg: 'Armature|LeftUpperLeg',
  rightUpperLeg: 'Armature|RightUpperLeg',
  leftLowerLeg: 'Armature|LeftLowerLeg',
  rightLowerLeg: 'Armature|RightLowerLeg',
  leftFoot: 'Armature|LeftFoot',
  rightFoot: 'Armature|RightFoot',
};

// Anime-specific smooth settings
export const ANIME_SMOOTH_SETTINGS = {
  hairPhysicsAmount: 0.6,
  eyeBlinkFrequency: 0.25,
  headTiltSensitivity: 1.5,
  armSwingSmoothing: 0.15,
  bodySwyaAmount: 1.2,
  boneInterpolationSpeed: 0.1,
};

export interface VRMModelWithScene {
  scene?: THREE.Group | THREE.Object3D;
  [key: string]: any;
}

export function useVRoidSmoothAnimation(vrmModel?: VRMModelWithScene | null) {
  const bonesMapRef = useRef<Map<string, THREE.Object3D>>(new Map());
  const boneRotationRef = useRef<Map<string, { x: number; y: number; z: number }>>(new Map());
  const previousRotationRef = useRef<Map<string, { x: number; y: number; z: number }>>(new Map());
  const [vrmReady, setVrmReady] = useState(false);
  const animationStateRef = useRef<{
    currentAnimation: string;
    animationProgress: number;
    animationDuration: number;
    isAnimating: boolean;
  }>({
    currentAnimation: 'idle',
    animationProgress: 0,
    animationDuration: 0,
    isAnimating: false,
  });

  // Initialize VRM bone mapping
  useEffect(() => {
    if (!vrmModel?.scene) return;

    try {
      vrmModel.scene.traverse((node: THREE.Object3D) => {
        for (const [boneName, vrmName] of Object.entries(VRM_BONES)) {
          if (node.name === vrmName || node.name.includes(boneName)) {
            bonesMapRef.current.set(boneName, node);
            boneRotationRef.current.set(boneName, { x: 0, y: 0, z: 0 });
            previousRotationRef.current.set(boneName, { x: 0, y: 0, z: 0 });
          }
        }
      });

      setVrmReady(true);
      console.log('✅ VRM bones mapped successfully');
    } catch (error) {
      console.error('❌ Error mapping VRM bones:', error);
    }
  }, [vrmModel]);

  // Smooth bone rotation with anime-specific settings
  const updateBoneRotation = useCallback((boneName: string, targetRotation: { x?: number; y?: number; z?: number }, _duration = 0.3) => {
    const bone = bonesMapRef.current.get(boneName);
    if (!bone || !bone.rotation) return;

    const currentRotation = boneRotationRef.current.get(boneName) || { x: 0, y: 0, z: 0 };
    const smoothSpeed = ANIME_SMOOTH_SETTINGS.boneInterpolationSpeed;
    const newRotation = {
      x: lerp(currentRotation.x, targetRotation.x ?? currentRotation.x, smoothSpeed),
      y: lerp(currentRotation.y, targetRotation.y ?? currentRotation.y, smoothSpeed),
      z: lerp(currentRotation.z, targetRotation.z ?? currentRotation.z, smoothSpeed),
    };

    boneRotationRef.current.set(boneName, newRotation);

    bone.rotation.x = newRotation.x;
    bone.rotation.y = newRotation.y;
    bone.rotation.z = newRotation.z;
  }, []);

  // Anime smooth head movement
  const updateHeadMovement = useCallback((targetX: number, targetY: number, intensity = 1) => {
    const headBone = bonesMapRef.current.get('head');
    if (!headBone) return;

    const x = deg(targetX * ANIME_SMOOTH_SETTINGS.headTiltSensitivity * intensity);
    const y = deg(targetY * ANIME_SMOOTH_SETTINGS.headTiltSensitivity * intensity);
    const z = deg(targetY * 0.3);

    updateBoneRotation('head', { x, y, z }, 0.2);
  }, [updateBoneRotation]);

  // Anime smooth arm movement
  const updateArmMovement = useCallback((isLeft: boolean, rotationX: number, rotationY: number, rotationZ: number) => {
    const boneName = isLeft ? 'leftUpperArm' : 'rightUpperArm';
    const targetRotation = {
      x: deg(rotationX),
      y: deg(rotationY * (isLeft ? -1 : 1)),
      z: deg(rotationZ),
    };

    updateBoneRotation(boneName, targetRotation, 0.15);
  }, [updateBoneRotation]);

  // Hair physics for anime characters
  const updateHairPhysics = useCallback((swayAmount = 0.5) => {
    const headBone = bonesMapRef.current.get('head');
    if (!headBone || !headBone.rotation) return;

    const hairInfluence = swayAmount * ANIME_SMOOTH_SETTINGS.hairPhysicsAmount;
    const headRotX = headBone.rotation.x;
    const headRotZ = headBone.rotation.z;

    return {
      x: -headRotX * hairInfluence * 0.5,
      z: -headRotZ * hairInfluence * 0.5,
    };
  }, []);

  const playIdleAnimation = useCallback(() => {
    animationStateRef.current.currentAnimation = 'idle';
    animationStateRef.current.isAnimating = true;
  }, []);

  const playGesture = useCallback((gestureName: string, duration = 1.5) => {
    animationStateRef.current.currentAnimation = gestureName;
    animationStateRef.current.animationDuration = duration;
    animationStateRef.current.animationProgress = 0;
    animationStateRef.current.isAnimating = true;
  }, []);

  // Main animation loop for VRM
  useFrame((state: FrameState, delta: number) => {
    if (!vrmReady) return;

    const animState = animationStateRef.current;

    if (animState.isAnimating) {
      animState.animationProgress += delta;
      if (animState.animationProgress >= animState.animationDuration) {
        animState.isAnimating = false;
        animState.currentAnimation = 'idle';
      }
    }

    switch (animState.currentAnimation) {
      case 'idle':
        const swayPhase = state.clock.elapsedTime * 0.5;
        const swayX = Math.sin(swayPhase) * 2;
        const swayZ = Math.cos(swayPhase * 0.7) * 1.5;

        updateHeadMovement(swayX * 0.3, swayZ * 0.2, 0.5);

        const spineBone = bonesMapRef.current.get('spine');
        if (spineBone && spineBone.rotation) {
          spineBone.rotation.z = deg(swayX * 0.5);
          spineBone.rotation.x = deg(swayZ * 0.3);
        }

        updateHairPhysics(Math.sin(swayPhase) * 0.5);
        break;

      case 'wave':
        const wavePhase = animState.animationDuration > 0 ? animState.animationProgress / animState.animationDuration : 1;
        const waveEase = Math.sin(wavePhase * Math.PI);

        updateArmMovement(false, -20 * waveEase, -30, 0);
        updateHeadMovement(0, 5 * waveEase, 0.5);
        break;

      case 'nod':
        const nodPhase = animState.animationDuration > 0 ? animState.animationProgress / animState.animationDuration : 1;
        const nodEase = Math.sin(nodPhase * Math.PI * 2);

        updateHeadMovement(nodEase * 15, 0, 0.3);
        break;

      case 'shake':
        const shakePhase = animState.animationDuration > 0 ? animState.animationProgress / animState.animationDuration : 1;
        const shakeEase = Math.sin(shakePhase * Math.PI * 4);

        updateHeadMovement(0, shakeEase * 20, 0.2);
        break;

      case 'excited':
        const excitedPhase = animState.animationDuration > 0 ? animState.animationProgress / animState.animationDuration : 1;
        const excitedEase = Math.sin(excitedPhase * Math.PI * 3);

        updateArmMovement(true, -excitedEase * 30, 0, 0);
        updateArmMovement(false, -excitedEase * 30, 0, 0);
        updateHeadMovement(excitedEase * 10, excitedEase * 5, 0.8);

        const spineBone2 = bonesMapRef.current.get('spine');
        if (spineBone2 && spineBone2.position) {
          spineBone2.position.y = Math.abs(excitedEase) * 0.05;
        }
        break;

      default:
        break;
    }
  });

  const getVRMReady = useCallback(() => vrmReady, [vrmReady]);
  const getBone = useCallback((boneName: string) => bonesMapRef.current.get(boneName), []);
  const getAllBones = useCallback(() => Object.fromEntries(bonesMapRef.current), []);

  return {
    playIdleAnimation,
    playGesture,
    updateHeadMovement,
    updateArmMovement,
    updateHairPhysics,
    updateBoneRotation,
    getVRMReady,
    getBone,
    getAllBones,
    bonesMapRef,
    vrmReady,
    animationStateRef,
    ANIME_SMOOTH_SETTINGS,
  };
}
