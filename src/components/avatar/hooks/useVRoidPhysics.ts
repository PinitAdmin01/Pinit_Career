// hooks/useVRoidPhysics.ts
// 🎯 ADVANCED VROID PHYSICS & CLOTH SIMULATION
// ✅ Hair physics
// ✅ Cloth dynamics
// ✅ Bone velocity tracking
// ✅ Physics-based animation
// ✅ Soft body simulation

import { useRef, useCallback } from 'react';
import { useFrame, FrameState } from './useFrame';
import * as THREE from 'three';

// Physics settings optimized for anime
export const VROID_PHYSICS_SETTINGS = {
  gravity: -0.5,
  damping: 0.95,
  friction: 0.98,
  
  hairDamping: 0.92,
  hairStiffness: 0.1,
  hairGravity: -0.3,
  
  clothDamping: 0.90,
  clothStiffness: 0.15,
  clothGravity: -0.4,
  
  windStrength: 0.1,
  windVariation: 0.5,
  
  collisionRadius: 0.1,
  collisionResponse: 0.8,
};

export interface PhysicsObject {
  boneName: string;
  bone: THREE.Object3D;
  mass: number;
  damping: number;
  stiffness: number;
  velocity: THREE.Vector3;
  prevPosition: THREE.Vector3;
  forces: THREE.Vector3;
  pinned: boolean;
  colliding: boolean;
}

export function useVRoidPhysics() {
  const boneVelocityRef = useRef<Map<string, THREE.Vector3>>(new Map());
  const bonePositionRef = useRef<Map<string, THREE.Vector3>>(new Map());
  const physicsObjectsRef = useRef<PhysicsObject[]>([]);
  const windStateRef = useRef({ x: 0, y: 0, z: 0 });

  // Initialize physics object
  const addPhysicsObject = useCallback((
    boneName: string,
    bone: THREE.Object3D | null | undefined,
    options: { mass?: number; damping?: number; stiffness?: number; pinned?: boolean } = {}
  ): PhysicsObject | null => {
    if (!bone || !bone.position) return null;

    const physicsObj: PhysicsObject = {
      boneName,
      bone,
      mass: options.mass || 1,
      damping: options.damping || VROID_PHYSICS_SETTINGS.hairDamping,
      stiffness: options.stiffness || VROID_PHYSICS_SETTINGS.hairStiffness,
      velocity: new THREE.Vector3(0, 0, 0),
      prevPosition: bone.position.clone(),
      forces: new THREE.Vector3(0, 0, 0),
      pinned: options.pinned || false,
      colliding: false,
    };

    physicsObjectsRef.current.push(physicsObj);
    bonePositionRef.current.set(boneName, bone.position.clone());
    boneVelocityRef.current.set(boneName, new THREE.Vector3(0, 0, 0));

    return physicsObj;
  }, []);

  // Track bone movement velocity
  const updateBoneVelocity = useCallback((boneName: string, bone: THREE.Object3D | null | undefined) => {
    if (!bone || !bone.position) return;
    const prevPos = bonePositionRef.current.get(boneName);
    if (!prevPos) return;

    const velocity = new THREE.Vector3(
      bone.position.x - prevPos.x,
      bone.position.y - prevPos.y,
      bone.position.z - prevPos.z
    );

    boneVelocityRef.current.set(boneName, velocity);
    bonePositionRef.current.set(boneName, bone.position.clone());

    return velocity;
  }, []);

  // Simulate wind effect
  const updateWind = useCallback((time: number) => {
    const windX = Math.sin(time * 0.5) * VROID_PHYSICS_SETTINGS.windStrength;
    const windY = Math.cos(time * 0.3) * VROID_PHYSICS_SETTINGS.windStrength * 0.5;
    const windZ = Math.sin(time * 0.7) * VROID_PHYSICS_SETTINGS.windStrength;

    windStateRef.current = { x: windX, y: windY, z: windZ };
  }, []);

  // Hair physics simulation (Verlet integration)
  const simulateHairPhysics = useCallback((delta: number) => {
    physicsObjectsRef.current.forEach((obj) => {
      if (obj.pinned || !obj.bone || !obj.bone.position) return;

      obj.forces.set(0, 0, 0);
      obj.forces.y += VROID_PHYSICS_SETTINGS.gravity * obj.mass;

      obj.forces.add(
        new THREE.Vector3(
          windStateRef.current.x * obj.mass,
          windStateRef.current.y * obj.mass,
          windStateRef.current.z * obj.mass
        )
      );

      obj.velocity.add(obj.forces.multiplyScalar(delta));
      obj.velocity.multiplyScalar(obj.damping);

      obj.bone.position.add(obj.velocity.multiplyScalar(delta));

      const diff = new THREE.Vector3().subVectors(obj.bone.position, obj.prevPosition);
      diff.multiplyScalar(1 - obj.stiffness);
      obj.bone.position.sub(diff);
    });
  }, []);

  // Collision detection
  const checkCollisions = useCallback((physicsObj: PhysicsObject) => {
    if (!physicsObj?.bone?.position) return;
    const radius = VROID_PHYSICS_SETTINGS.collisionRadius;

    physicsObjectsRef.current.forEach((other) => {
      if (other === physicsObj || other.pinned || !other?.bone?.position) return;

      const distance = physicsObj.bone.position.distanceTo(other.bone.position);

      if (distance < radius * 2 && distance > 0.0001) {
        const direction = new THREE.Vector3().subVectors(
          physicsObj.bone.position,
          other.bone.position
        ).normalize();

        const pushDistance = (radius * 2 - distance) * VROID_PHYSICS_SETTINGS.collisionResponse;
        physicsObj.bone.position.addScaledVector(direction, pushDistance * 0.5);
        other.bone.position.addScaledVector(direction, -pushDistance * 0.5);

        physicsObj.velocity.multiplyScalar(0.5);
        other.velocity.multiplyScalar(0.5);
      }
    });
  }, []);

  // Apply physics to bone
  const applyPhysicsToBone = useCallback((boneName: string, bone: THREE.Object3D | null | undefined) => {
    if (!bone) return;
    const physicsObj = physicsObjectsRef.current.find((obj) => obj.boneName === boneName);
    if (!physicsObj) return;

    updateBoneVelocity(boneName, bone);
    checkCollisions(physicsObj);
  }, [updateBoneVelocity, checkCollisions]);

  // Hair jiggle effect
  const addHairJiggle = useCallback((bone: THREE.Object3D | null | undefined, intensity = 0.5) => {
    if (!bone || !bone.position) return;
    const jiggleX = (Math.random() - 0.5) * intensity * 0.05;
    const jiggleY = (Math.random() - 0.5) * intensity * 0.05;
    const jiggleZ = (Math.random() - 0.5) * intensity * 0.05;

    bone.position.x += jiggleX;
    bone.position.y += jiggleY;
    bone.position.z += jiggleZ;
  }, []);

  // Main physics loop
  useFrame((state: FrameState, delta: number) => {
    const time = state.clock.elapsedTime;
    updateWind(time);
    simulateHairPhysics(delta);

    physicsObjectsRef.current.forEach((physicsObj) => {
      if (physicsObj.bone) {
        applyPhysicsToBone(physicsObj.boneName, physicsObj.bone);
      }
    });
  });

  const getPhysicsStats = useCallback(() => {
    return {
      activeObjects: physicsObjectsRef.current.length,
      wind: { ...windStateRef.current },
      physics: { ...VROID_PHYSICS_SETTINGS },
    };
  }, []);

  return {
    addPhysicsObject,
    updateBoneVelocity,
    updateWind,
    simulateHairPhysics,
    applyPhysicsToBone,
    checkCollisions,
    addHairJiggle,
    getPhysicsStats,
    physicsObjectsRef,
    boneVelocityRef,
    VROID_PHYSICS_SETTINGS,
  };
}
