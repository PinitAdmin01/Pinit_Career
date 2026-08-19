import * as THREE from 'three';

export type AnimState = 'idle' | 'listening' | 'thinking' | 'talking' | 'wave' | 'nod' | 'shrug';

export interface PersonaConfig {
  name: string;
  expressiveness: number;
  blinkInterval: number; // in seconds
  swayAmp: number;
  headTiltAmp: number;
  gestureSpeed: number;
}

export const PERSONA_CONFIGS: Record<string, PersonaConfig> = {
  priya:    { name: 'Ms. Priya',          expressiveness: 0.88, blinkInterval: 3.4, swayAmp: 1.00, headTiltAmp: 1.00, gestureSpeed: 1.05 },
  kashyap:  { name: 'Kashyap Sir',        expressiveness: 0.65, blinkInterval: 4.8, swayAmp: 0.60, headTiltAmp: 0.85, gestureSpeed: 0.80 },
  karthic:  { name: 'Karthic Sir "Nega"', expressiveness: 0.95, blinkInterval: 2.8, swayAmp: 1.25, headTiltAmp: 1.10, gestureSpeed: 1.30 },
  maya:     { name: 'Ms. Maya',           expressiveness: 0.72, blinkInterval: 4.2, swayAmp: 0.75, headTiltAmp: 0.90, gestureSpeed: 0.95 },
  divya:    { name: 'Ms. Divya',          expressiveness: 0.90, blinkInterval: 3.2, swayAmp: 1.10, headTiltAmp: 1.15, gestureSpeed: 1.10 },
  aisha:    { name: 'Ms. Aisha',          expressiveness: 0.78, blinkInterval: 3.8, swayAmp: 0.85, headTiltAmp: 1.05, gestureSpeed: 0.95 },
  rohan:    { name: 'Mr. Rohan',          expressiveness: 0.92, blinkInterval: 3.1, swayAmp: 1.15, headTiltAmp: 1.20, gestureSpeed: 1.20 },
  anish:    { name: 'Mr. Anish',          expressiveness: 0.70, blinkInterval: 4.4, swayAmp: 0.75, headTiltAmp: 0.80, gestureSpeed: 0.88 },
  vikram:   { name: 'Mr. Vikram',         expressiveness: 0.58, blinkInterval: 5.2, swayAmp: 0.45, headTiltAmp: 0.60, gestureSpeed: 0.72 },
  shalini:  { name: 'Ms. Shalini',        expressiveness: 0.80, blinkInterval: 3.6, swayAmp: 0.90, headTiltAmp: 0.95, gestureSpeed: 1.00 },
  aditya:   { name: 'Mr. Aditya',         expressiveness: 0.74, blinkInterval: 4.1, swayAmp: 0.80, headTiltAmp: 1.00, gestureSpeed: 0.92 },
  neha:     { name: 'Ms. Neha',           expressiveness: 0.82, blinkInterval: 3.5, swayAmp: 0.95, headTiltAmp: 1.00, gestureSpeed: 1.05 },
  rajesh:   { name: 'Mr. Rajesh',         expressiveness: 0.68, blinkInterval: 4.6, swayAmp: 0.70, headTiltAmp: 0.75, gestureSpeed: 0.85 },
  sneha:    { name: 'Ms. Sneha',          expressiveness: 0.88, blinkInterval: 3.3, swayAmp: 1.05, headTiltAmp: 1.10, gestureSpeed: 1.10 },
  abhijit:  { name: 'Mr. Abhijit',        expressiveness: 0.62, blinkInterval: 4.9, swayAmp: 0.55, headTiltAmp: 0.70, gestureSpeed: 0.78 },
  default:  { name: 'Mentor',             expressiveness: 0.75, blinkInterval: 3.8, swayAmp: 0.90, headTiltAmp: 0.90, gestureSpeed: 1.00 }
};

export class VRoidAvatarEngine {
  renderer!: THREE.WebGLRenderer;
  scene!: THREE.Scene;
  camera!: THREE.PerspectiveCamera;

  // Skeleton bones
  hips?: THREE.Object3D;
  spine?: THREE.Object3D;
  chest?: THREE.Object3D;
  neck?: THREE.Object3D;
  head?: THREE.Object3D;
  leftShoulder?: THREE.Object3D;
  rightShoulder?: THREE.Object3D;
  leftArm?: THREE.Object3D;
  rightArm?: THREE.Object3D;
  leftForearm?: THREE.Object3D;
  rightForearm?: THREE.Object3D;
  leftHand?: THREE.Object3D;
  rightHand?: THREE.Object3D;
  leftEyeSphere?: THREE.Mesh;
  rightEyeSphere?: THREE.Mesh;

  animState: AnimState = 'idle';
  animT = 0;
  talkPhase = 0;

  private _paused = false;
  get paused() { return this._paused; }
  set paused(v: boolean) {
    const wasPaused = this._paused;
    this._paused = v;
    if (wasPaused && !v) {
      this.clock.getDelta();
      this.loop();
    }
  }

  raf?: number;
  clock = new THREE.Clock();
  disposed = false;

  isVRM = false;
  faceMeshes: THREE.Mesh[] = [];
  morphMaps: Map<THREE.Mesh, Record<string, number>> = new Map();
  blinkMorphMaps: Map<THREE.Mesh, { blink?: number; blinkL?: number; blinkR?: number }> = new Map();
  eyeLookMorphMaps: Map<THREE.Mesh, { lookUp?: number; lookDown?: number; lookLeft?: number; lookRight?: number }> = new Map();

  // Persona
  persona: PersonaConfig = PERSONA_CONFIGS.default;

  // Lip Sync
  vowelTimer = 0;
  nextVowelTime = 0.11;
  currentVowel = 'silence';
  currentInfluences: Record<string, number> = { A: 0, I: 0, U: 0, E: 0, O: 0 };
  proceduralMouth?: THREE.Mesh;

  // Audio-driven Lip Sync
  audioAnalyser?: AnalyserNode;
  audioDataArray?: Float32Array;

  // Eye Control & Auto Blink
  blinkTimer = 0;
  nextBlinkTime = 3.5;
  blinkProgress = 0;
  isBlinking = false;
  eyeSaccadeTimer = 0;
  eyeTargetOffset = new THREE.Vector2(0, 0);
  eyeCurrentOffset = new THREE.Vector2(0, 0);

  canvas?: HTMLCanvasElement;
  private onContextLost?: (e: Event) => void;
  private onContextRestored?: () => void;

  init(canvas: HTMLCanvasElement, teacherId: string) {
    this.canvas = canvas;
    const personaKey = teacherId.toLowerCase();
    this.persona = PERSONA_CONFIGS[personaKey] || PERSONA_CONFIGS.default;
    this.nextBlinkTime = this.persona.blinkInterval * (0.8 + Math.random() * 0.4);

    const w = canvas.clientWidth || 280;
    const h = canvas.clientHeight || 360;

    // Attach WebGL context lifecycle listeners to prevent GPU state crashes
    this.onContextLost = (e: Event) => {
      e.preventDefault();
      console.warn('[VRoidAvatarEngine] WebGL context lost. Pausing avatar rendering loop.');
      this.paused = true;
    };
    this.onContextRestored = () => {
      console.log('[VRoidAvatarEngine] WebGL context restored. Resuming avatar rendering loop.');
      this.paused = false;
    };
    canvas.addEventListener('webglcontextlost', this.onContextLost, false);
    canvas.addEventListener('webglcontextrestored', this.onContextRestored, false);

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(w, h, false);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.setClearColor(0x000000, 0);

    this.scene = new THREE.Scene();
    const fov = (w / h > 1.8) ? 32 : 28;
    this.camera = new THREE.PerspectiveCamera(fov, w / h, 0.01, 20);

    this.camera.position.set(0, 1.43, 1.6);
    this.camera.lookAt(0, 1.48, 0);

    this.scene.add(new THREE.AmbientLight(0xffffff, 0.65));
    const key = new THREE.DirectionalLight(0xffffff, 1.4);
    key.position.set(1.5, 3, 2);
    this.scene.add(key);

    const rim = new THREE.DirectionalLight(0x88bbff, 0.6);
    rim.position.set(-1.5, 2, -2);
    this.scene.add(rim);

    this.tryLoadVRM(teacherId).catch(() => this.buildProceduralAvatar());
    this.loop();
  }

  setTeacherId(teacherId: string) {
    const personaKey = teacherId.toLowerCase();
    this.persona = PERSONA_CONFIGS[personaKey] || PERSONA_CONFIGS.default;
    this.nextBlinkTime = this.persona.blinkInterval * (0.8 + Math.random() * 0.4);
  }

  connectAudioAnalyser(analyser: AnalyserNode) {
    this.audioAnalyser = analyser;
    this.audioDataArray = new Float32Array(analyser.frequencyBinCount);
  }

  async tryLoadVRM(teacherId: string) {
    const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
    const { DRACOLoader } = await import('three/examples/jsm/loaders/DRACOLoader.js');
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
    loader.setDRACOLoader(dracoLoader);

    const id = teacherId.toLowerCase().trim();
    const paths = [
      `/avatar/${id}.glb`,
      '/avatar/priya.glb',
      '/avatar/hana.glb'
    ];

    const loadAttempt = (idx: number): Promise<void> => {
      if (idx >= paths.length) return Promise.reject(new Error("No VRMs found"));
      return new Promise<void>((resolve, reject) => {
        const resolvedPath = paths[idx];
        loader.load(resolvedPath, gltf => {
          this.scene.add(gltf.scene);
          this.isVRM = true;
          this.faceMeshes = [];
          this.morphMaps.clear();
          this.blinkMorphMaps.clear();
          this.eyeLookMorphMaps.clear();

          // 1. Identify Face & Head Meshes with Morph Targets
          gltf.scene.traverse((obj: any) => {
            obj.matrixAutoUpdate = true;
            if (obj.isMesh) {
              obj.castShadow = true;
              obj.receiveShadow = true;
              if (obj.morphTargetDictionary) {
                const keys = Object.keys(obj.morphTargetDictionary);
                const mouthKeys = keys.filter(k => {
                  const kl = k.toLowerCase();
                  return kl === 'a' || kl === 'i' || kl === 'u' || kl === 'e' || kl === 'o' ||
                         kl.includes('fcl_mth') || kl.includes('mouth') || kl.includes('mth_') ||
                         kl === 'あ' || kl === 'い' || kl === 'う' || kl === 'え' || kl === 'お' ||
                         kl === 'aa' || kl === 'ih' || kl === 'ou' || kl === 'ee' || kl === 'oh';
                });
                const hasMouth = mouthKeys.length >= 2;
                const isFaceMeshName = obj.name.toLowerCase().includes('face') || obj.name.toLowerCase().includes('head');
                if (hasMouth || isFaceMeshName) {
                  this.faceMeshes.push(obj);
                }
              }
            }
          });

          // 2. Discover Bones Across Entire Skeleton
          const candidateBones: any[] = [];
          gltf.scene.traverse((obj: any) => {
            if ((obj.isSkinnedMesh || obj.type === 'SkinnedMesh') && obj.skeleton && obj.skeleton.bones) {
              obj.skeleton.bones.forEach((bone: any) => {
                bone.matrixAutoUpdate = true;
                if (!candidateBones.includes(bone)) candidateBones.push(bone);
              });
            }
          });

          if (candidateBones.length === 0) {
            gltf.scene.traverse((obj: any) => {
              if (obj.isBone || obj.type === 'Bone') candidateBones.push(obj);
            });
          }

          candidateBones.forEach((obj: any) => {
            const nameLower = obj.name.toLowerCase().trim();

            if (nameLower.includes('hips') || nameLower.includes('pelvis')) this.hips = obj;
            if (nameLower.includes('spine') && !nameLower.includes('chest')) this.spine = obj;
            if (nameLower.includes('chest') || nameLower.includes('upperchest')) this.chest = obj;
            if (nameLower.includes('neck')) this.neck = obj;
            if (nameLower.includes('head') && !nameLower.includes('hair') && !nameLower.includes('forehead')) this.head = obj;

            if (nameLower.includes('shoulder') || nameLower.includes('clavicle')) {
              if (nameLower.includes('left') || nameLower.includes('.l') || nameLower.includes('_l') || nameLower.includes('bip_l') || nameLower.endsWith('l')) {
                this.leftShoulder = obj;
              } else if (nameLower.includes('right') || nameLower.includes('.r') || nameLower.includes('_r') || nameLower.includes('bip_r') || nameLower.endsWith('r')) {
                this.rightShoulder = obj;
              }
            }

            const isUpperArm = (nameLower.includes('arm') || nameLower.includes('upperarm')) &&
                               !nameLower.includes('forearm') && !nameLower.includes('lowerarm') &&
                               !nameLower.includes('hand') && !nameLower.includes('finger') &&
                               !nameLower.includes('shoulder') && !nameLower.includes('clavicle');

            if (isUpperArm) {
              if (nameLower.includes('left') || nameLower.includes('.l') || nameLower.includes('_l') || nameLower.includes('bip_l') || nameLower.endsWith('l')) {
                this.leftArm = obj;
              } else if (nameLower.includes('right') || nameLower.includes('.r') || nameLower.includes('_r') || nameLower.includes('bip_r') || nameLower.endsWith('r')) {
                this.rightArm = obj;
              }
            }

            if (nameLower.includes('forearm') || nameLower.includes('lowerarm')) {
              if (nameLower.includes('left') || nameLower.includes('.l') || nameLower.includes('_l') || nameLower.includes('bip_l')) {
                this.leftForearm = obj;
              } else if (nameLower.includes('right') || nameLower.includes('.r') || nameLower.includes('_r') || nameLower.includes('bip_r')) {
                this.rightForearm = obj;
              }
            }

            if (nameLower.includes('hand') && !nameLower.includes('handle') && !nameLower.includes('finger')) {
              if (nameLower.includes('left') || nameLower.includes('.l') || nameLower.includes('_l') || nameLower.includes('bip_l')) {
                this.leftHand = obj;
              } else if (nameLower.includes('right') || nameLower.includes('.r') || nameLower.includes('_r') || nameLower.includes('bip_r')) {
                this.rightHand = obj;
              }
            }
          });

          // 3. Resolve Morph Indices (Lip sync, Blink, Eye Look)
          this.faceMeshes.forEach(mesh => {
            if (mesh.morphTargetDictionary) {
              const dict = mesh.morphTargetDictionary;
              const vowels = ['A', 'I', 'U', 'E', 'O'];
              const meshMorphMap: Record<string, number> = {};

              vowels.forEach(v => {
                const foundKey = Object.keys(dict).find(k => {
                  const kl = k.toLowerCase();
                  const vl = v.toLowerCase();
                  if (kl === vl || kl === `fcl_mth_${vl}` || kl === `mouth_${vl}`) return true;
                  if (kl.endsWith(`_${vl}`) || kl.endsWith(`.${vl}`)) return true;
                  if (kl.includes(`blendshape.${vl}`) || kl.includes(`preset.${vl}`)) return true;
                  if (v === 'A' && (kl === 'あ' || kl === 'aa' || kl === 'open' || kl === 'mouth_open' || kl === 'mouthopen')) return true;
                  if (v === 'I' && (kl === 'い' || kl === 'ih' || kl === 'ii')) return true;
                  if (v === 'U' && (kl === 'う' || kl === 'ou' || kl === 'uu')) return true;
                  if (v === 'E' && (kl === 'え' || kl === 'ee')) return true;
                  if (v === 'O' && (kl === 'お' || kl === 'oh' || kl === 'oo')) return true;
                  return false;
                });
                if (foundKey) meshMorphMap[v] = dict[foundKey];
              });
              this.morphMaps.set(mesh, meshMorphMap);

              // Blink morphs
              const blinkMorphs: { blink?: number; blinkL?: number; blinkR?: number } = {};
              Object.keys(dict).forEach(k => {
                const kl = k.toLowerCase();
                if (kl.includes('blink') || kl.includes('eye_close') || kl.includes('fcl_eye_close')) {
                  if (kl.includes('left') || kl.includes('_l')) blinkMorphs.blinkL = dict[k];
                  else if (kl.includes('right') || kl.includes('_r')) blinkMorphs.blinkR = dict[k];
                  else blinkMorphs.blink = dict[k];
                }
              });
              this.blinkMorphMaps.set(mesh, blinkMorphs);

              // Eye Look morphs
              const lookMorphs: { lookUp?: number; lookDown?: number; lookLeft?: number; lookRight?: number } = {};
              Object.keys(dict).forEach(k => {
                const kl = k.toLowerCase();
                if (kl.includes('look')) {
                  if (kl.includes('up')) lookMorphs.lookUp = dict[k];
                  if (kl.includes('down')) lookMorphs.lookDown = dict[k];
                  if (kl.includes('left')) lookMorphs.lookLeft = dict[k];
                  if (kl.includes('right')) lookMorphs.lookRight = dict[k];
                }
              });
              this.eyeLookMorphMaps.set(mesh, lookMorphs);
            }
          });

          this.centerCameraOnHead();
          resolve();
        }, undefined, () => {
          loadAttempt(idx + 1).then(resolve).catch(reject);
        });
      });
    };

    return loadAttempt(0);
  }

  centerCameraOnHead() {
    if (!this.camera) return;
    let headPos = new THREE.Vector3(0, 1.43, 0);
    if (this.head) {
      this.head.updateMatrixWorld(true);
      const temp = new THREE.Vector3();
      this.head.getWorldPosition(temp);
      if (temp.y > 0.3) headPos.copy(temp);
    }
    this.camera.position.set(headPos.x, headPos.y - 0.05, headPos.z + 1.25);
    this.camera.lookAt(headPos.x, headPos.y + 0.07, headPos.z);
  }

  buildProceduralAvatar() {
    this.isVRM = false;
    const g = new THREE.Group();
    const mat = (c: number, r = 0.4, m = 0) => new THREE.MeshStandardMaterial({ color: c, roughness: r, metalness: m });
    const SKIN = 0xf5c8a8, SHIRT = 0x4f5fa8, HAIR = 0x1a1008, PANT = 0x2c2c3e;

    const spine = new THREE.Group();
    spine.position.y = 1.22;
    this.spine = spine;
    g.add(spine);

    const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.14, 0.36, 8, 12), mat(SHIRT, 0.7));
    spine.add(torso);

    const neck = new THREE.Group();
    neck.position.set(0, 0.24, 0);
    spine.add(neck);
    this.neck = neck;
    neck.add(Object.assign(new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.065, 0.12, 12), mat(SKIN, 0.5)), { position: new THREE.Vector3(0, 0.06, 0) }));

    const head = new THREE.Group();
    head.position.y = 0.18;
    neck.add(head);
    this.head = head;

    const skull = new THREE.Mesh(new THREE.SphereGeometry(0.13, 24, 20), mat(SKIN, 0.45));
    skull.scale.set(1, 1.08, 0.97);
    head.add(skull);

    const hair = new THREE.Mesh(new THREE.SphereGeometry(0.135, 24, 20), mat(HAIR, 0.8));
    hair.position.y = 0.04;
    head.add(hair);

    // Procedural Eye Spheres
    const leftEye = new THREE.Mesh(new THREE.SphereGeometry(0.018, 16, 12), mat(0x3a5fc8, 0.3));
    leftEye.position.set(-0.048, 0.02, 0.127);
    head.add(leftEye);
    this.leftEyeSphere = leftEye;

    const rightEye = new THREE.Mesh(new THREE.SphereGeometry(0.018, 16, 12), mat(0x3a5fc8, 0.3));
    rightEye.position.set(0.048, 0.02, 0.127);
    head.add(rightEye);
    this.rightEyeSphere = rightEye;

    const mouth = new THREE.Mesh(new THREE.CapsuleGeometry(0.02, 0.05, 4, 8), mat(0x9b1c1c, 0.5));
    mouth.position.set(0, -0.04, 0.125);
    mouth.rotation.z = Math.PI / 2;
    head.add(mouth);
    this.proceduralMouth = mouth;

    const makeArm = (side: number) => {
      const ag = new THREE.Group();
      ag.position.set(side * 0.2, 0.18, 0);
      spine.add(ag);
      if (side < 0) this.leftArm = ag; else this.rightArm = ag;

      const ua = new THREE.Mesh(new THREE.CapsuleGeometry(0.055, 0.22, 6, 8), mat(SHIRT, 0.7));
      ua.position.set(side * 0.1, -0.14, 0);
      ua.rotation.z = side * -0.25;
      ag.add(ua);
    };
    makeArm(-1);
    makeArm(1);

    const pelvis = new THREE.Mesh(new THREE.CapsuleGeometry(0.13, 0.06, 8, 10), mat(PANT, 0.8));
    pelvis.position.y = 1.01;
    g.add(pelvis);

    this.scene.add(g);
    this.centerCameraOnHead();
  }

  setState(s: AnimState) {
    if (this.animState === s) return;
    this.animState = s;
    this.animT = 0;
  }

  loop() {
    if (this.disposed || this._paused) return;
    this.raf = requestAnimationFrame(() => this.loop());

    const dt = this.clock.getDelta();
    const et = this.clock.getElapsedTime();
    this.animT += dt;

    const persona = this.persona;
    const speed = persona.gestureSpeed;
    const express = persona.expressiveness;

    // 1. Natural Breathing & Body Swaying (Persona-Driven)
    const breath = Math.sin(et * 1.5 * speed);
    const breathingSpineX = breath * 0.01 * express;
    const breathingShoulderZ = breath * 0.005 * express;

    const swayX = Math.sin(et * 0.4 * speed) * 0.008 * persona.swayAmp;
    const swayY = Math.cos(et * 0.25 * speed) * 0.012 * persona.swayAmp;
    const swayZ = Math.sin(et * 0.3 * speed) * 0.006 * persona.swayAmp;

    if (this.spine) {
      this.spine.rotation.x = breathingSpineX + swayX;
      this.spine.rotation.z = swayZ;
    }
    if (this.chest) {
      this.chest.rotation.x = breathingSpineX * 0.5;
    }
    if (this.leftShoulder) this.leftShoulder.rotation.z = -breathingShoulderZ;
    if (this.rightShoulder) this.rightShoulder.rotation.z = breathingShoulderZ;

    // 2. Head & Neck Movement (State Machine + Persona)
    if (this.head) {
      const s = this.animState;
      const tiltAmp = persona.headTiltAmp;

      if (s === 'idle') {
        this.head.rotation.y = swayY + Math.sin(et * 0.13) * 0.035 * tiltAmp;
        this.head.rotation.x = Math.cos(et * 0.11) * 0.018 * tiltAmp + 0.015;
        this.head.rotation.z = Math.sin(et * 0.08) * 0.008 * tiltAmp;
        if (this.neck) this.neck.rotation.y = Math.sin(et * 0.13) * 0.01;
      } else if (s === 'listening') {
        const listenTilt = 0.04 * tiltAmp;
        this.head.rotation.x = THREE.MathUtils.lerp(this.head.rotation.x, 0.03, 0.08);
        this.head.rotation.y = THREE.MathUtils.lerp(this.head.rotation.y, listenTilt, 0.08);
        this.head.rotation.z = THREE.MathUtils.lerp(this.head.rotation.z, -listenTilt, 0.08);
      } else if (s === 'nod') {
        this.head.rotation.x = Math.sin(this.animT * 6.5 * speed) * 0.16 * express + 0.02;
        this.head.rotation.y = THREE.MathUtils.lerp(this.head.rotation.y, 0, 0.1);
        this.head.rotation.z = THREE.MathUtils.lerp(this.head.rotation.z, 0, 0.1);
      } else if (s === 'thinking') {
        const targetX = 0.06 * tiltAmp + Math.sin(et * 0.6) * 0.01;
        const targetY = 0.14 * tiltAmp + Math.cos(et * 0.5) * 0.015;
        this.head.rotation.x = THREE.MathUtils.lerp(this.head.rotation.x, targetX, 0.08);
        this.head.rotation.y = THREE.MathUtils.lerp(this.head.rotation.y, targetY, 0.08);
        this.head.rotation.z = THREE.MathUtils.lerp(this.head.rotation.z, 0.06 * tiltAmp, 0.08);
      } else if (s === 'shrug') {
        this.head.rotation.x = THREE.MathUtils.lerp(this.head.rotation.x, -0.05, 0.08);
        this.head.rotation.y = THREE.MathUtils.lerp(this.head.rotation.y, 0, 0.08);
        this.head.rotation.z = THREE.MathUtils.lerp(this.head.rotation.z, 0, 0.08);
      } else {
        this.head.rotation.x = THREE.MathUtils.lerp(this.head.rotation.x, 0.02, 0.08);
        this.head.rotation.y = THREE.MathUtils.lerp(this.head.rotation.y, 0, 0.08);
        this.head.rotation.z = THREE.MathUtils.lerp(this.head.rotation.z, 0, 0.08);
      }

      if (s === 'talking') {
        this.talkPhase += 0.18 * speed;
        this.head.rotation.x += Math.sin(this.talkPhase) * 0.015 * express;
        this.head.rotation.y += Math.sin(this.talkPhase * 0.5) * 0.01 * express;
      }
    }

    // 3. Eye Saccades & Auto-Blink Controller
    this.blinkTimer += dt;
    if (this.blinkTimer > this.nextBlinkTime && !this.isBlinking) {
      this.isBlinking = true;
      this.blinkProgress = 0;
    }

    let blinkVal = 0;
    if (this.isBlinking) {
      this.blinkProgress += dt / 0.12; // 120ms total blink
      if (this.blinkProgress >= 1) {
        this.isBlinking = false;
        this.blinkTimer = 0;
        this.nextBlinkTime = persona.blinkInterval * (0.7 + Math.random() * 0.6);
        blinkVal = 0;
      } else {
        blinkVal = Math.sin(this.blinkProgress * Math.PI);
      }
    }

    // Saccadic eye movement
    this.eyeSaccadeTimer += dt;
    if (this.eyeSaccadeTimer > 2.5 + Math.random() * 2.0) {
      this.eyeSaccadeTimer = 0;
      this.eyeTargetOffset.set(
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.015
      );
    }
    this.eyeCurrentOffset.lerp(this.eyeTargetOffset, 0.1);

    // Apply Blink & Eye Look Morphs
    this.faceMeshes.forEach(mesh => {
      if (mesh.morphTargetInfluences) {
        const blinkMap = this.blinkMorphMaps.get(mesh);
        if (blinkMap) {
          if (blinkMap.blink !== undefined) mesh.morphTargetInfluences[blinkMap.blink] = blinkVal;
          if (blinkMap.blinkL !== undefined) mesh.morphTargetInfluences[blinkMap.blinkL] = blinkVal;
          if (blinkMap.blinkR !== undefined) mesh.morphTargetInfluences[blinkMap.blinkR] = blinkVal;
        }

        const lookMap = this.eyeLookMorphMaps.get(mesh);
        if (lookMap) {
          if (lookMap.lookRight !== undefined) mesh.morphTargetInfluences[lookMap.lookRight] = Math.max(0, this.eyeCurrentOffset.x);
          if (lookMap.lookLeft !== undefined) mesh.morphTargetInfluences[lookMap.lookLeft] = Math.max(0, -this.eyeCurrentOffset.x);
          if (lookMap.lookUp !== undefined) mesh.morphTargetInfluences[lookMap.lookUp] = Math.max(0, this.eyeCurrentOffset.y);
          if (lookMap.lookDown !== undefined) mesh.morphTargetInfluences[lookMap.lookDown] = Math.max(0, -this.eyeCurrentOffset.y);
        }
      }
    });

    if (this.leftEyeSphere && this.rightEyeSphere) {
      this.leftEyeSphere.position.x = -0.048 + this.eyeCurrentOffset.x * 0.5;
      this.leftEyeSphere.position.y = 0.02 + this.eyeCurrentOffset.y * 0.5;
      this.rightEyeSphere.position.x = 0.048 + this.eyeCurrentOffset.x * 0.5;
      this.rightEyeSphere.position.y = 0.02 + this.eyeCurrentOffset.y * 0.5;
      if (this.isBlinking) {
        this.leftEyeSphere.scale.y = 1 - blinkVal * 0.9;
        this.rightEyeSphere.scale.y = 1 - blinkVal * 0.9;
      } else {
        this.leftEyeSphere.scale.y = 1;
        this.rightEyeSphere.scale.y = 1;
      }
    }

    // 4. Arm Rotations
    const defaultLeftZ = this.isVRM ? -1.25 : 0;
    const defaultRightZ = this.isVRM ? 1.25 : 0;

    if (this.leftArm) {
      let targetLeftZ = defaultLeftZ;
      let targetLeftX = 0;

      if (this.animState === 'wave') {
        targetLeftZ = Math.PI * 0.7 + Math.sin(et * 6 * speed) * 0.22;
      } else if (this.animState === 'shrug') {
        targetLeftZ = defaultLeftZ + 0.25;
      } else if (this.animState === 'talking') {
        targetLeftZ = defaultLeftZ + Math.sin(et * 2 * speed) * 0.04 * express;
      } else {
        targetLeftZ += Math.sin(et * 1.5 * speed) * 0.015;
      }

      this.leftArm.rotation.z = THREE.MathUtils.lerp(this.leftArm.rotation.z, targetLeftZ, 0.08);
      this.leftArm.rotation.x = THREE.MathUtils.lerp(this.leftArm.rotation.x, targetLeftX, 0.08);
    }

    if (this.rightArm) {
      let targetRightZ = defaultRightZ;
      let targetRightX = 0;

      if (this.animState === 'thinking') {
        targetRightZ = -1.05;
        targetRightX = 0.4;
      } else if (this.animState === 'shrug') {
        targetRightZ = defaultRightZ - 0.25;
      } else if (this.animState === 'talking') {
        targetRightZ = defaultRightZ - 0.3 * express + Math.sin(et * 4 * speed) * 0.12 * express;
        targetRightX = 0.2 * express + Math.cos(et * 4 * speed) * 0.06 * express;
      } else {
        targetRightZ -= Math.sin(et * 1.5 * speed) * 0.015;
      }

      this.rightArm.rotation.z = THREE.MathUtils.lerp(this.rightArm.rotation.z, targetRightZ, 0.08);
      this.rightArm.rotation.x = THREE.MathUtils.lerp(this.rightArm.rotation.x, targetRightX, 0.08);
    }

    // Natural relaxed elbow flex
    if (this.leftForearm) {
      const targetLeftForearmY = this.isVRM ? -0.32 : 0;
      this.leftForearm.rotation.y = THREE.MathUtils.lerp(this.leftForearm.rotation.y, targetLeftForearmY, 0.08);
    }
    if (this.rightForearm) {
      const targetRightForearmY = this.isVRM ? 0.32 : 0;
      this.rightForearm.rotation.y = THREE.MathUtils.lerp(this.rightForearm.rotation.y, targetRightForearmY, 0.08);
    }

    // Subtle natural breathing S-curve on spine & chest
    if (this.chest) {
      this.chest.rotation.x = Math.sin(et * 1.4) * 0.012;
    }
    if (this.spine) {
      this.spine.rotation.z = Math.sin(et * 0.7) * 0.006 * express;
    }

    // 5. Lip Sync & Morph Targets
    const isTalking = this.animState === 'talking';

    // Audio-driven lip sync if Web Audio API Analyser is connected
    if (isTalking && this.audioAnalyser && this.audioDataArray) {
      this.audioAnalyser.getFloatFrequencyData(this.audioDataArray as any);
      let sum = 0;
      for (let i = 0; i < this.audioDataArray.length; i++) {
        if (this.audioDataArray[i] > -100) {
          sum += Math.pow(10, this.audioDataArray[i] / 20);
        }
      }
      const audioAmp = Math.min(1.0, sum * 15.0);
      this.currentInfluences['A'] = THREE.MathUtils.lerp(this.currentInfluences['A'] || 0, audioAmp * 0.85, 0.35);
      this.currentInfluences['O'] = THREE.MathUtils.lerp(this.currentInfluences['O'] || 0, audioAmp * 0.4, 0.35);
    } else if (isTalking) {
      this.vowelTimer += dt;
      if (this.vowelTimer > this.nextVowelTime) {
        this.vowelTimer = 0;
        this.nextVowelTime = 0.08 + Math.random() * 0.08;
        const speechVowels = ['A', 'A', 'I', 'U', 'E', 'O', 'O', 'silence'];
        this.currentVowel = speechVowels[Math.floor(Math.random() * speechVowels.length)];
      }

      const vowels = ['A', 'I', 'U', 'E', 'O'];
      vowels.forEach(v => {
        const targetValue = (v === this.currentVowel) ? (v === 'A' || v === 'O' ? 0.85 * express : 0.55 * express) : 0.0;
        const currentVal = this.currentInfluences[v] || 0;
        this.currentInfluences[v] = THREE.MathUtils.lerp(currentVal, targetValue, 0.32);
      });
    } else {
      ['A', 'I', 'U', 'E', 'O'].forEach(v => {
        this.currentInfluences[v] = THREE.MathUtils.lerp(this.currentInfluences[v] || 0, 0, 0.3);
      });
    }

    if (this.faceMeshes.length > 0) {
      const vowels = ['A', 'I', 'U', 'E', 'O'];
      vowels.forEach(v => {
        const newVal = this.currentInfluences[v] || 0;
        this.faceMeshes.forEach(mesh => {
          const meshMorphMap = this.morphMaps.get(mesh);
          if (meshMorphMap) {
            const idx = meshMorphMap[v];
            if (idx !== undefined && mesh.morphTargetInfluences) {
              mesh.morphTargetInfluences[idx] = newVal;
            }
          }
        });
      });
    }

    if (this.proceduralMouth) {
      const targetScaleY = isTalking ? (0.6 + Math.abs(Math.sin(et * 8 * speed)) * 1.2 + Math.sin(et * 19) * 0.4) : 0.1;
      this.proceduralMouth.scale.y = THREE.MathUtils.lerp(this.proceduralMouth.scale.y, targetScaleY, 0.3);
    }

    this.renderer.render(this.scene, this.camera);
  }

  resize(w: number, h: number) {
    if (!this.camera || !this.renderer) return;
    this.camera.aspect = w / h;
    if (this.camera.aspect > 1.8) {
      this.camera.fov = 32;
    } else {
      this.camera.fov = 28;
    }
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h, false);
  }

  dispose() {
    this.disposed = true;
    if (this.raf) cancelAnimationFrame(this.raf);

    if (this.canvas) {
      if (this.onContextLost) this.canvas.removeEventListener('webglcontextlost', this.onContextLost);
      if (this.onContextRestored) this.canvas.removeEventListener('webglcontextrestored', this.onContextRestored);
    }

    if (this.scene) {
      this.scene.traverse((obj) => {
        if ((obj as THREE.Mesh).geometry) {
          (obj as THREE.Mesh).geometry.dispose();
        }
        if ((obj as THREE.Mesh).material) {
          const mat = (obj as THREE.Mesh).material;
          if (Array.isArray(mat)) {
            mat.forEach(m => {
              if ((m as any)?.map) (m as any).map.dispose();
              m.dispose();
            });
          } else {
            if ((mat as any)?.map) (mat as any).map.dispose();
            mat.dispose();
          }
        }
      });
    }

    this.faceMeshes = [];
    this.morphMaps.clear();
    this.blinkMorphMaps.clear();
    this.eyeLookMorphMaps.clear();

    if (this.renderer) {
      try {
        this.renderer.forceContextLoss();
      } catch {}
      this.renderer.dispose();
    }
    console.log('[VRoidAvatarEngine] Successfully disposed 3D avatar scene and freed WebGL GPU memory.');
  }
}
