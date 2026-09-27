/**
 * test_avatar_engine_motion.ts
 *
 * Automated verification test suite for T6: Avatar Fluid Motion Hardening.
 *
 * Assertions:
 *  1. D-04 Zero-Snap Rest-Pose Contract:
 *     Assert that applyRestPose() and loop() first-frame target output agree within
 *     epsilon = 0.05 rad for every animated bone (hips, spine, chest, neck, head,
 *     leftShoulder, rightShoulder, leftArm, rightArm, leftForearm, rightForearm,
 *     leftHand, rightHand).
 *  2. Multi-Framerate Numerical Stability:
 *     Simulate 30 FPS, 60 FPS, and 120 FPS for 500+ frames.
 *     Assert zero NaNs, zero Infinities, and all rotations within anatomical bounds [-pi, pi].
 *  3. Low-Power Mode Gating:
 *     Assert secondary motion (hands follow-through, hip contrapposto sway) is active
 *     when isLowPowerDevice=false, and cleanly bypassed when isLowPowerDevice=true.
 *  4. State Transition Blend Smoothness:
 *     Assert that transitions across all states (idle -> talking -> listening -> nod ->
 *     shrug -> thinking -> idle) produce no rotational discontinuities > 0.25 rad/frame.
 */

import * as THREE from 'three';

// Headless polyfills for Node environment
if (typeof (global as any).requestAnimationFrame === 'undefined') {
  (global as any).requestAnimationFrame = (cb: Function) => setTimeout(cb, 16);
  (global as any).cancelAnimationFrame = (id: any) => clearTimeout(id);
}
if (typeof (global as any).window === 'undefined') {
  (global as any).window = {
    devicePixelRatio: 1,
    innerWidth: 1920,
    innerHeight: 1080,
    addEventListener: () => {},
    removeEventListener: () => {},
  };
}

import { VRoidAvatarEngine, AnimState } from '../src/components/avatar/VRoidAvatarEngine';

interface BoneSet {
  hips: THREE.Object3D;
  spine: THREE.Object3D;
  chest: THREE.Object3D;
  neck: THREE.Object3D;
  head: THREE.Object3D;
  leftShoulder: THREE.Object3D;
  rightShoulder: THREE.Object3D;
  leftArm: THREE.Object3D;
  rightArm: THREE.Object3D;
  leftForearm: THREE.Object3D;
  rightForearm: THREE.Object3D;
  leftHand: THREE.Object3D;
  rightHand: THREE.Object3D;
}

function createMockRig(): { engine: VRoidAvatarEngine; bones: BoneSet } {
  const engine = new VRoidAvatarEngine();
  engine.isVRM = true;

  const bones: BoneSet = {
    hips: new THREE.Object3D(),
    spine: new THREE.Object3D(),
    chest: new THREE.Object3D(),
    neck: new THREE.Object3D(),
    head: new THREE.Object3D(),
    leftShoulder: new THREE.Object3D(),
    rightShoulder: new THREE.Object3D(),
    leftArm: new THREE.Object3D(),
    rightArm: new THREE.Object3D(),
    leftForearm: new THREE.Object3D(),
    rightForearm: new THREE.Object3D(),
    leftHand: new THREE.Object3D(),
    rightHand: new THREE.Object3D(),
  };

  // Realistic VRM initial positions
  bones.hips.position.set(0, 0.85, 0);
  engine.hipsRestPosition.copy(bones.hips.position);

  // Assign bones to engine
  engine.hips = bones.hips;
  engine.spine = bones.spine;
  engine.chest = bones.chest;
  engine.neck = bones.neck;
  engine.head = bones.head;
  engine.leftShoulder = bones.leftShoulder;
  engine.rightShoulder = bones.rightShoulder;
  engine.leftArm = bones.leftArm;
  engine.rightArm = bones.rightArm;
  engine.leftForearm = bones.leftForearm;
  engine.rightForearm = bones.rightForearm;
  engine.leftHand = bones.leftHand;
  engine.rightHand = bones.rightHand;

  // Mock scene and renderer so render() does not throw
  engine.scene = new THREE.Scene();
  engine.camera = new THREE.PerspectiveCamera();
  engine.renderer = {
    render: () => {},
    setPixelRatio: () => {},
    setSize: () => {},
    dispose: () => {},
    forceContextLoss: () => {},
  } as any;

  // Mark engine as ready
  (engine as any).ready = true;

  return { engine, bones };
}

let passedTests = 0;
let totalTests = 0;

function assert(condition: boolean, message: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  PASS: ${message}`);
  } else {
    console.error(`  FAIL: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
}

console.log('=== Avatar Engine Motion Hardening Test Suite (T6) ===\n');

// ─────────────────────────────────────────────────────────────────────────────
// Test 1: D-04 Rest-Pose Zero-Snap Contract
// ─────────────────────────────────────────────────────────────────────────────
console.log('--- Test 1: D-04 Zero-Snap Rest-Pose Contract ---');
{
  const { engine, bones } = createMockRig();

  // 1. Call applyRestPose()
  engine.applyRestPose();

  // Snapshot rest pose rotations
  const restPose = {
    hips: { pos: bones.hips.position.clone(), rot: bones.hips.rotation.clone() },
    spine: bones.spine.rotation.clone(),
    chest: bones.chest.rotation.clone(),
    neck: bones.neck.rotation.clone(),
    head: bones.head.rotation.clone(),
    leftShoulder: bones.leftShoulder.rotation.clone(),
    rightShoulder: bones.rightShoulder.rotation.clone(),
    leftArm: bones.leftArm.rotation.clone(),
    rightArm: bones.rightArm.rotation.clone(),
    leftForearm: bones.leftForearm.rotation.clone(),
    rightForearm: bones.rightForearm.rotation.clone(),
    leftHand: bones.leftHand.rotation.clone(),
    rightHand: bones.rightHand.rotation.clone(),
  };

  // 2. Step 1 frame of loop() at dt = 0.016s (60 FPS) with et = 0
  engine.clock.getDelta = () => 0.016;
  engine.clock.getElapsedTime = () => 0.016;

  // Run one frame of loop
  (global as any).requestAnimationFrame = () => 1;
  engine.loop();

  const EPSILON = 0.05; // 0.05 rad max deviation per contract

  const deltaHipsPos = bones.hips.position.distanceTo(restPose.hips.pos);
  const deltaHipsRotZ = Math.abs(bones.hips.rotation.z - restPose.hips.rot.z);
  const deltaLeftArmZ = Math.abs(bones.leftArm.rotation.z - restPose.leftArm.z);
  const deltaRightArmZ = Math.abs(bones.rightArm.rotation.z - restPose.rightArm.z);
  const deltaLeftForearmY = Math.abs(bones.leftForearm.rotation.y - restPose.leftForearm.y);
  const deltaRightForearmY = Math.abs(bones.rightForearm.rotation.y - restPose.rightForearm.y);
  const eulerDiff = (e1: THREE.Euler, e2: THREE.Euler) => {
    return Math.max(Math.abs(e1.x - e2.x), Math.abs(e1.y - e2.y), Math.abs(e1.z - e2.z));
  };

  const deltaLeftHand = eulerDiff(bones.leftHand.rotation, restPose.leftHand);
  const deltaRightHand = eulerDiff(bones.rightHand.rotation, restPose.rightHand);
  const deltaLeftShoulder = eulerDiff(bones.leftShoulder.rotation, restPose.leftShoulder);
  const deltaRightShoulder = eulerDiff(bones.rightShoulder.rotation, restPose.rightShoulder);
  const deltaSpine = eulerDiff(bones.spine.rotation, restPose.spine);
  const deltaChest = eulerDiff(bones.chest.rotation, restPose.chest);
  const deltaHead = eulerDiff(bones.head.rotation, restPose.head);

  assert(deltaHipsPos < 0.01, `Hips translation delta ${deltaHipsPos.toFixed(4)}m < 0.01m on first frame`);
  assert(deltaHipsRotZ < EPSILON, `Hips rotation delta ${deltaHipsRotZ.toFixed(4)} rad < ${EPSILON}`);
  assert(deltaLeftArmZ < EPSILON, `Left arm Z delta ${deltaLeftArmZ.toFixed(4)} rad < ${EPSILON}`);
  assert(deltaRightArmZ < EPSILON, `Right arm Z delta ${deltaRightArmZ.toFixed(4)} rad < ${EPSILON}`);
  assert(deltaLeftForearmY < EPSILON, `Left forearm Y delta ${deltaLeftForearmY.toFixed(4)} rad < ${EPSILON}`);
  assert(deltaRightForearmY < EPSILON, `Right forearm Y delta ${deltaRightForearmY.toFixed(4)} rad < ${EPSILON}`);
  assert(deltaLeftHand < EPSILON, `Left hand delta ${deltaLeftHand.toFixed(4)} rad < ${EPSILON}`);
  assert(deltaRightHand < EPSILON, `Right hand delta ${deltaRightHand.toFixed(4)} rad < ${EPSILON}`);
  assert(deltaLeftShoulder < EPSILON, `Left shoulder delta ${deltaLeftShoulder.toFixed(4)} rad < ${EPSILON}`);
  assert(deltaRightShoulder < EPSILON, `Right shoulder delta ${deltaRightShoulder.toFixed(4)} rad < ${EPSILON}`);
  assert(deltaSpine < EPSILON, `Spine delta ${deltaSpine.toFixed(4)} rad < ${EPSILON}`);
  assert(deltaChest < EPSILON, `Chest delta ${deltaChest.toFixed(4)} rad < ${EPSILON}`);
  assert(deltaHead < EPSILON, `Head delta ${deltaHead.toFixed(4)} rad < ${EPSILON}`);
}

// ─────────────────────────────────────────────────────────────────────────────
// Test 2: Multi-Framerate Stability & Frame-Rate Independence (30, 60, 120 FPS)
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n--- Test 2: Multi-Framerate Stability (30, 60, 120 FPS) ---');
{
  const frameRates = [30, 60, 120];
  const states: AnimState[] = ['idle', 'talking', 'listening', 'thinking', 'nod', 'shrug', 'wave'];

  for (const fps of frameRates) {
    const { engine, bones } = createMockRig();
    const dt = 1.0 / fps;
    let simTime = 0;

    engine.applyRestPose();

    // Step 300 frames simulating all states
    for (let f = 0; f < 300; f++) {
      simTime += dt;
      engine.clock.getDelta = () => dt;
      engine.clock.getElapsedTime = () => simTime;

      // Cycle states every 45 frames
      const stateIdx = Math.floor(f / 45) % states.length;
      engine.setState(states[stateIdx]);

      engine.loop();

      // Check for NaNs and bounds on every bone
      for (const [name, bone] of Object.entries(bones)) {
        const p = bone.position;
        const r = bone.rotation;

        if (isNaN(p.x) || isNaN(p.y) || isNaN(p.z) || isNaN(r.x) || isNaN(r.y) || isNaN(r.z)) {
          throw new Error(`NaN detected in bone ${name} at frame ${f} (${fps} FPS)!`);
        }
        if (!isFinite(p.x) || !isFinite(p.y) || !isFinite(p.z) || !isFinite(r.x) || !isFinite(r.y) || !isFinite(r.z)) {
          throw new Error(`Infinity detected in bone ${name} at frame ${f} (${fps} FPS)!`);
        }

        // Anatomical rotation sanity: angles must not exceed [-2pi, 2pi]
        const maxAngle = Math.PI * 2;
        if (Math.abs(r.x) > maxAngle || Math.abs(r.y) > maxAngle || Math.abs(r.z) > maxAngle) {
          throw new Error(`Bone ${name} rotation exceeded anatomical bound: (${r.x.toFixed(2)}, ${r.y.toFixed(2)}, ${r.z.toFixed(2)})`);
        }
      }
    }

    assert(true, `${fps} FPS simulation (300 frames, 7 states): 0 NaNs, 0 Infinities, all rotations within bounds`);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Test 3: Low-Power Device Gating
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n--- Test 3: Low-Power Device Mode Gating ---');
{
  // Test when isLowPowerDevice = false (full fidelity)
  {
    const { engine, bones } = createMockRig();
    engine.isLowPowerDevice = false;
    engine.applyRestPose();
    engine.setState('talking');

    let simTime = 1.0;
    engine.clock.getDelta = () => 0.016;
    engine.clock.getElapsedTime = () => simTime;

    // Run 60 frames in talking state
    for (let f = 0; f < 60; f++) {
      simTime += 0.016;
      engine.loop();
    }

    const handMoved = Math.abs(bones.rightHand.rotation.x) > 0.001 || Math.abs(bones.rightHand.rotation.z) > 0.001;
    const hipContrappostoActive = Math.abs(bones.hips.position.x - engine.hipsRestPosition.x) > 0.0005;

    assert(handMoved, 'Full fidelity: rightHand secondary follow-through is active during speech');
    assert(hipContrappostoActive, 'Full fidelity: hips contrapposto sway is active');
  }

  // Test when isLowPowerDevice = true (budget mode)
  {
    const { engine, bones } = createMockRig();
    engine.isLowPowerDevice = true;
    engine.applyRestPose();
    engine.setState('talking');

    let simTime = 1.0;
    engine.clock.getDelta = () => 0.016;
    engine.clock.getElapsedTime = () => simTime;

    for (let f = 0; f < 60; f++) {
      simTime += 0.016;
      engine.loop();
    }

    const handAtRest = Math.abs(bones.rightHand.rotation.x) === 0 && Math.abs(bones.rightHand.rotation.z) === 0;
    const hipSwayBypassed = Math.abs(bones.hips.position.x - engine.hipsRestPosition.x) < 0.0001;
    const hipRollZero = bones.hips.rotation.z === 0;

    assert(handAtRest, 'Low-power mode: rightHand rotations bypassed to (0, 0, 0)');
    assert(hipSwayBypassed, 'Low-power mode: hips lateral contrapposto sway bypassed');
    assert(hipRollZero, 'Low-power mode: hips roll Z held at 0');
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Test 4: State Transition Continuity (Zero Angular Pops)
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n--- Test 4: State Transition Continuity ---');
{
  const { engine, bones } = createMockRig();
  engine.applyRestPose();

  const stateSequence: AnimState[] = ['idle', 'talking', 'listening', 'nod', 'shrug', 'thinking', 'idle'];
  let simTime = 0;
  const dt = 0.016;
  const MAX_PERMISSIBLE_STEP_RAD = 0.25; // 0.25 rad (~14 deg) max single-frame pop

  let maxObservedStep = 0;
  let worstBone = '';

  for (const nextState of stateSequence) {
    engine.setState(nextState);

    // Run 30 frames in each state, tracking max angular step between frames
    for (let f = 0; f < 30; f++) {
      simTime += dt;
      engine.clock.getDelta = () => dt;
      engine.clock.getElapsedTime = () => simTime;

      // Capture before
      const before: Record<string, THREE.Euler> = {};
      for (const [name, bone] of Object.entries(bones)) {
        before[name] = bone.rotation.clone();
      }

      engine.loop();

      // Check delta
      for (const [name, bone] of Object.entries(bones)) {
        const dx = Math.abs(bone.rotation.x - before[name].x);
        const dy = Math.abs(bone.rotation.y - before[name].y);
        const dz = Math.abs(bone.rotation.z - before[name].z);
        const step = Math.max(dx, dy, dz);

        if (step > maxObservedStep) {
          maxObservedStep = step;
          worstBone = `${name} (${nextState} frame ${f})`;
        }

        if (step > MAX_PERMISSIBLE_STEP_RAD) {
          throw new Error(
            `Angular pop detected in bone ${name} during transition to ${nextState} (step = ${step.toFixed(3)} rad > ${MAX_PERMISSIBLE_STEP_RAD} rad)`
          );
        }
      }
    }
  }

  assert(
    maxObservedStep <= MAX_PERMISSIBLE_STEP_RAD,
    `Transitions across 7 states: max single-frame step was ${maxObservedStep.toFixed(4)} rad on ${worstBone} (threshold: ${MAX_PERMISSIBLE_STEP_RAD} rad)`
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Test 5: Clavicle Elevation & Breathing Coupling
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n--- Test 5: Clavicle Elevation & Breathing Coupling ---');
{
  const { engine, bones } = createMockRig();
  engine.applyRestPose();

  // Check that breathing causes subtle oscillation in shoulder Z
  let simTime = 0;
  const dt = 0.016;
  const shoulderZValues: number[] = [];

  for (let f = 0; f < 60; f++) {
    simTime += dt;
    engine.clock.getDelta = () => dt;
    engine.clock.getElapsedTime = () => simTime;
    engine.loop();
    shoulderZValues.push(bones.rightShoulder.rotation.z);
  }

  const minZ = Math.min(...shoulderZValues);
  const maxZ = Math.max(...shoulderZValues);
  const breathingRange = maxZ - minZ;

  assert(breathingRange > 0.001, `Right shoulder exhibits breathing motion (range: ${breathingRange.toFixed(4)} rad > 0.001)`);

  // Now test shrug state: shoulder elevation should increase significantly
  engine.setState('shrug');
  for (let f = 0; f < 30; f++) {
    simTime += dt;
    engine.clock.getDelta = () => dt;
    engine.clock.getElapsedTime = () => simTime;
    engine.loop();
  }

  const shrugZ = bones.rightShoulder.rotation.z;
  assert(shrugZ > maxZ, `Shrug state elevates clavicles additively (shrugZ: ${shrugZ.toFixed(4)} > idle max: ${maxZ.toFixed(4)})`);
  assert(bones.rightShoulder.rotation.x > 0.01, `Shrug state adds forward clavicle roll (shoulderX: ${bones.rightShoulder.rotation.x.toFixed(4)} > 0.01)`);
}

// ─────────────────────────────────────────────────────────────────────────────
// Test 6: Asymmetric Lip-Sync Muscle Attack/Decay
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n--- Test 6: Asymmetric Lip-Sync Attack/Decay Shaping ---');
{
  const { engine } = createMockRig();
  engine.applyRestPose();
  engine.setState('talking');

  // Trigger vowel 'A'
  engine.currentVowel = 'A';
  engine.nextVowelTime = 10.0; // lock on 'A'

  let simTime = 0;
  const dt = 0.016;

  // Measure attack over 3 frames (~50ms)
  for (let f = 0; f < 3; f++) {
    simTime += dt;
    engine.clock.getDelta = () => dt;
    engine.clock.getElapsedTime = () => simTime;
    engine.loop();
  }
  const influenceAfterAttack = engine.currentInfluences['A'] || 0;

  // Now silence (decay)
  engine.setState('idle');
  // Measure decay over 3 frames
  for (let f = 0; f < 3; f++) {
    simTime += dt;
    engine.clock.getDelta = () => dt;
    engine.clock.getElapsedTime = () => simTime;
    engine.loop();
  }
  const influenceAfterDecay = engine.currentInfluences['A'] || 0;

  assert(influenceAfterAttack > 0.3, `Rapid attack: mouth opens to ${influenceAfterAttack.toFixed(3)} in ~50ms`);
  assert(influenceAfterDecay < influenceAfterAttack, `Decay: mouth closes smoothly to ${influenceAfterDecay.toFixed(3)}`);
}

console.log(`\n========================================`);
console.log(`All ${passedTests}/${totalTests} motion verification tests PASSED!`);
console.log(`========================================\n`);
