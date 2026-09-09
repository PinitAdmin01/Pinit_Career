import * as THREE from 'three';
// D-03 FIX: shared avatar-voice analyser tap used to drive real lip sync.
// streamingAudioQueue imports nothing from components, so there is no cycle.
import { getExistingAvatarAnalyser } from '@/lib/audio/streamingAudioQueue';

export type AnimState = 'idle' | 'listening' | 'thinking' | 'talking' | 'wave' | 'nod' | 'shrug';

export interface PersonaConfig {
  name: string;
  domain?: string;
  expressiveness: number;
  blinkInterval: number; // in seconds
  swayAmp: number;
  headTiltAmp: number;
  gestureSpeed: number;
  warmth?: number; // subtle smile/warmth morph target [0, 1]
  /**
   * D-01 FIX: Presented gender for this persona.
   *
   * Used ONLY to pick a gender-appropriate substitute model when the persona's
   * own .glb fails to load. Previously the fallback chain began with
   * kashyap.glb (a male model), so any female persona whose model failed to
   * download — common on slow campus networks, since each model is ~6.5MB —
   * rendered a male body while keeping her own name and her own (correct)
   * neural voice from KOKORO_VOICE_MAP in tts.ts.
   *
   * Values below agree with KOKORO_VOICE_MAP for all 15 personas
   * (af_/bf_ = female voices, am_/bm_ = male voices).
   */
  gender: 'male' | 'female' | 'neutral';
}

export const PERSONA_CONFIGS: Record<string, PersonaConfig> = {
  priya:    { name: 'Ms. Priya',          domain: 'Full-Stack & Career Growth',   expressiveness: 0.88, blinkInterval: 3.4, swayAmp: 1.00, headTiltAmp: 1.05, gestureSpeed: 1.05, warmth: 0.22, gender: 'female' },
  anish:    { name: 'Mr. Anish',          domain: 'Systems & Backend Scale',      expressiveness: 0.72, blinkInterval: 4.4, swayAmp: 0.75, headTiltAmp: 0.80, gestureSpeed: 0.90, warmth: 0.12, gender: 'male' },
  aisha:    { name: 'Ms. Aisha',          domain: 'Data Science & AI/ML',         expressiveness: 0.82, blinkInterval: 3.8, swayAmp: 0.85, headTiltAmp: 1.00, gestureSpeed: 0.95, warmth: 0.18, gender: 'female' },
  vikram:   { name: 'Mr. Vikram',         domain: 'Finance, Commerce & Ethics',   expressiveness: 0.65, blinkInterval: 5.0, swayAmp: 0.50, headTiltAmp: 0.65, gestureSpeed: 0.75, warmth: 0.15, gender: 'male' },
  kashyap:  { name: 'Kashyap Sir',        domain: 'DSA & Mathematical Reasoning', expressiveness: 0.68, blinkInterval: 4.8, swayAmp: 0.60, headTiltAmp: 0.85, gestureSpeed: 0.80, warmth: 0.14, gender: 'male' },
  karthic:  { name: 'Karthic Sir "Nega"', domain: 'Competitive Arena & Speedrun', expressiveness: 0.95, blinkInterval: 2.8, swayAmp: 1.25, headTiltAmp: 1.10, gestureSpeed: 1.30, warmth: 0.08, gender: 'male' },
  maya:     { name: 'Ms. Maya',           domain: 'UI/UX & Product Design',       expressiveness: 0.75, blinkInterval: 4.0, swayAmp: 0.75, headTiltAmp: 0.90, gestureSpeed: 0.95, warmth: 0.20, gender: 'female' },
  divya:    { name: 'Ms. Divya',          domain: 'Cloud Infrastructure & DevOps', expressiveness: 0.90, blinkInterval: 3.2, swayAmp: 1.10, headTiltAmp: 1.15, gestureSpeed: 1.10, warmth: 0.16, gender: 'female' },
  rohan:    { name: 'Mr. Rohan',          domain: 'Cybersecurity & Networks',     expressiveness: 0.92, blinkInterval: 3.1, swayAmp: 1.15, headTiltAmp: 1.20, gestureSpeed: 1.20, warmth: 0.15, gender: 'male' },
  shalini:  { name: 'Ms. Shalini',        domain: 'Soft Skills & Communication',  expressiveness: 0.80, blinkInterval: 3.6, swayAmp: 0.90, headTiltAmp: 0.95, gestureSpeed: 1.00, warmth: 0.20, gender: 'female' },
  aditya:   { name: 'Mr. Aditya',         domain: 'IoT & Embedded Systems',       expressiveness: 0.74, blinkInterval: 4.1, swayAmp: 0.80, headTiltAmp: 1.00, gestureSpeed: 0.92, warmth: 0.14, gender: 'male' },
  neha:     { name: 'Ms. Neha',           domain: 'Product Strategy & Marketing', expressiveness: 0.82, blinkInterval: 3.5, swayAmp: 0.95, headTiltAmp: 1.00, gestureSpeed: 1.05, warmth: 0.22, gender: 'female' },
  rajesh:   { name: 'Mr. Rajesh',         domain: 'Operations & Supply Chain',    expressiveness: 0.68, blinkInterval: 4.6, swayAmp: 0.70, headTiltAmp: 0.75, gestureSpeed: 0.85, warmth: 0.12, gender: 'male' },
  sneha:    { name: 'Ms. Sneha',          domain: 'Human Resources & Talent',     expressiveness: 0.88, blinkInterval: 3.3, swayAmp: 1.05, headTiltAmp: 1.10, gestureSpeed: 1.10, warmth: 0.24, gender: 'female' },
  abhijit:  { name: 'Mr. Abhijit',        domain: 'Economics & Quantitative Data', expressiveness: 0.62, blinkInterval: 4.9, swayAmp: 0.55, headTiltAmp: 0.70, gestureSpeed: 0.78, warmth: 0.12, gender: 'male' },
  default:  { name: 'Mentor',             domain: 'Multidisciplinary Career OS',  expressiveness: 0.75, blinkInterval: 3.8, swayAmp: 0.90, headTiltAmp: 0.90, gestureSpeed: 1.00, warmth: 0.16, gender: 'neutral' }
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
  hipsRestPosition = new THREE.Vector3();
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

  // ── D-04 FIX: Load gating ────────────────────────────────────────────────
  // init() starts the render loop immediately while tryLoadVRM() is still
  // resolving asynchronously. Without this gate the loop writes rotations to a
  // partially-bound skeleton, and uses the isVRM=false rest angles (arms
  // horizontal) until the model resolves — then snaps to the VRM rest pose
  // (arms down at ~1.25 rad) the instant isVRM flips true. That snap is the
  // visible "arm flail" while an avatar loads.
  // `ready` is set true only after ALL bone binding and isVRM resolution
  // complete, on both the GLB path and the procedural fallback path.
  private ready = false;
  private restPoseApplied = false;

  // ── C-02 & T6: adaptive performance state ────────────────────────────────
  // Set during init() from device detection, then adjusted at runtime by the
  // frame-time watchdog in loop() so weak devices degrade smoothly instead of
  // stuttering at a fixed quality level they cannot sustain.
  isLowPowerDevice = false;
  private maxPixelRatio = 2;
  private currentPixelRatio = 1;
  private frameTimeAccumulator = 0;
  private frameTimeSamples = 0;
  private hasDownscaledForPerf = false;

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

  // Gaze & Cursor Tracking Controller (Active on Dashboard, Missions, Onboarding; Inactive in Story Mode & Lesson details)
  gazeTrackingEnabled = true;
  mouseNormalized = new THREE.Vector2(0, 0);
  mouseTargetOffset = new THREE.Vector2(0, 0);
  private onMouseMoveHandler?: (e: MouseEvent) => void;

  canvas?: HTMLCanvasElement;
  private onContextLost?: (e: Event) => void;
  private onContextRestored?: () => void;

  /**
   * Dynamically toggles interactive gaze tracking.
   * Scoped strictly: enabled in floating avatar & missions, disabled in story mode & teaching details.
   */
  setGazeTracking(enabled: boolean) {
    this.gazeTrackingEnabled = enabled;
    if (!enabled) {
      // Smoothly reset target offsets back to neutral forward pose
      this.mouseNormalized.set(0, 0);
    }
    console.log(`[VRoidAvatarEngine] Gaze tracking mode updated: ${enabled ? 'ENABLED' : 'DISABLED'}`);
  }

  init(canvas: HTMLCanvasElement, teacherId: string) {
    this.canvas = canvas;
    const personaKey = teacherId.toLowerCase();
    this.persona = PERSONA_CONFIGS[personaKey] || PERSONA_CONFIGS.default;
    this.nextBlinkTime = this.persona.blinkInterval * (0.8 + Math.random() * 0.4);

    const w = canvas.clientWidth || 280;
    const h = canvas.clientHeight || 360;

    // Attach global mousemove listener for subtle natural eye and head gaze parallax
    this.onMouseMoveHandler = (e: MouseEvent) => {
      if (!this.gazeTrackingEnabled || this.disposed) return;
      // Calculate normalized device coordinates [-1, 1] relative to window viewport
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -((e.clientY / window.innerHeight) * 2 - 1);
      this.mouseNormalized.set(nx, ny);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('mousemove', this.onMouseMoveHandler, { passive: true });
      console.log('[VRoidAvatarEngine] Gaze tracking mouse listener initialized successfully.');
    }

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

    // ── C-02 FIX: device-aware renderer settings ───────────────────────────
    // Fragment shading cost scales with the AREA of rendered pixels, so pixel
    // ratio is quadratic: DPR 2 = 4x the work of DPR 1, DPR 3 = 9x.
    // The previous cap of 2 meant a DPR-3 phone rendered 4x its CSS pixel
    // count every frame, with MSAA on top, on an integrated mobile GPU.
    // That is a large part of the reported lag on mid-range Android.
    const isMobileDevice =
      typeof navigator !== 'undefined' &&
      (/Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) ||
        (typeof window !== 'undefined' && window.innerWidth < 768));

    this.isLowPowerDevice = isMobileDevice;

    try {
      this.renderer = new THREE.WebGLRenderer({
        canvas,
        // MSAA is expensive on mobile GPUs and barely perceptible at these
        // canvas sizes. Keep it for desktop where it is effectively free.
        antialias: !isMobileDevice,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch (e1) {
      try {
        this.renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true });
      } catch (e2) {
        console.warn('[VRoidAvatarEngine] WebGL context creation failed:', e2);
        return;
      }
    }

    // 1.5 on mobile is a 44% reduction in fragment work versus the old cap of
    // 2, for a difference that is not perceptible on a ~6 inch screen.
    this.maxPixelRatio = isMobileDevice ? 1.5 : 2;
    this.currentPixelRatio = Math.min(window.devicePixelRatio, this.maxPixelRatio);
    this.renderer.setPixelRatio(this.currentPixelRatio);
    console.log(
      `[VRoidAvatarEngine] Renderer configured — mobile: ${isMobileDevice}, ` +
      `antialias: ${!isMobileDevice}, pixelRatio: ${this.currentPixelRatio.toFixed(2)} ` +
      `(device DPR ${window.devicePixelRatio}).`
    );
    this.renderer.setSize(w, h, false);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.setClearColor(0x000000, 0);

    this.scene = new THREE.Scene();
    const fov = (w / h > 1.8) ? 32 : 28;
    this.camera = new THREE.PerspectiveCamera(fov, w / h, 0.01, 20);

    this.camera.position.set(0, 1.38, 1.45);
    this.camera.lookAt(0, 1.44, 0);

    this.scene.add(new THREE.AmbientLight(0xffffff, 1.2));
    const key = new THREE.DirectionalLight(0xffffff, 1.6);
    key.position.set(0, 2.5, 2.5);
    this.scene.add(key);

    const fill = new THREE.DirectionalLight(0x90c0ff, 0.8);
    fill.position.set(-1.5, 1.5, 2);
    this.scene.add(fill);

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
    dracoLoader.setDecoderPath('/draco/gltf/');
    loader.setDRACOLoader(dracoLoader);

    const id = teacherId.toLowerCase().trim();

    // ── D-01 FIX: gender-matched fallback chain ────────────────────────────
    // The old chain was [own, kashyap, priya, hana]. kashyap.glb is a MALE
    // model, so whenever a female persona's own model failed to load — routine
    // on slow campus networks, because each model is ~6.5MB — the student saw
    // a male body under a female name, speaking with her correct female neural
    // voice. The bug looked random; it actually correlates with network speed.
    //
    // Now: retry the persona's own model once, then substitute only a model of
    // the same presented gender.
    const personaForModel = PERSONA_CONFIGS[id] || PERSONA_CONFIGS.default;
    const primaryPath = `/avatar/${id}.glb`;

    const FEMALE_FALLBACK_MODELS = ['/avatar/priya.glb', '/avatar/aisha.glb'];
    const MALE_FALLBACK_MODELS = ['/avatar/kashyap.glb', '/avatar/rohan.glb'];

    const genderMatchedFallbacks =
      personaForModel.gender === 'female' ? FEMALE_FALLBACK_MODELS
      : personaForModel.gender === 'male' ? MALE_FALLBACK_MODELS
      : ['/avatar/mentor.glb'];

    // First entry is retried once: a transient network timeout is the most
    // common failure mode, and a second attempt often succeeds where
    // substituting a different person never recovers the right identity.
    const paths = [primaryPath, primaryPath, ...genderMatchedFallbacks];

    console.log(
      `[VRoidAvatarEngine] Model chain for "${id}" (gender: ${personaForModel.gender}):`,
      paths.join(' -> ')
    );

    const loadAttempt = (idx: number): Promise<void> => {
      if (idx >= paths.length) return Promise.reject(new Error("No VRMs found"));
      return new Promise<void>((resolve, reject) => {
        const resolvedPath = paths[idx];
        console.log('[VRoidAvatarEngine] Attempting to load avatar GLB from:', resolvedPath);
        loader.load(resolvedPath, gltf => {
          console.log('[VRoidAvatarEngine] Successfully loaded 3D avatar:', resolvedPath);
          this.scene.add(gltf.scene);
          this.isVRM = true;
          this.faceMeshes = [];
          this.morphMaps.clear();
          this.blinkMorphMaps.clear();
          this.eyeLookMorphMaps.clear();

          // Auto-ground and center model
          gltf.scene.updateMatrixWorld(true);
          const bbox = new THREE.Box3().setFromObject(gltf.scene);
          const center = new THREE.Vector3();
          bbox.getCenter(center);
          gltf.scene.position.x = -center.x;
          gltf.scene.position.z = -center.z;
          gltf.scene.position.y = -bbox.min.y;
          gltf.scene.updateMatrixWorld(true);

          // 1. Identify Face & Head Meshes with Morph Targets, disable frustum culling & fix materials
          gltf.scene.traverse((obj: any) => {
            obj.matrixAutoUpdate = true;
            if (obj.isMesh) {
              obj.frustumCulled = false;
              obj.castShadow = true;
              obj.receiveShadow = true;
              if (obj.material) {
                if (Array.isArray(obj.material)) {
                  obj.material.forEach((m: any) => {
                    m.side = THREE.DoubleSide;
                    m.needsUpdate = true;
                  });
                } else {
                  obj.material.side = THREE.DoubleSide;
                  obj.material.needsUpdate = true;
                }
              }
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

          if (this.hips) {
            this.hipsRestPosition.copy(this.hips.position);
          }

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
          // D-04 FIX: all bones bound and isVRM resolved — safe to animate now.
          this.markReady(resolvedPath);
          resolve();
        }, undefined, () => {
          // D-01 FIX: make substitution visible instead of silent. If this
          // warning appears with a different persona's model on the next line,
          // that is the identity-mismatch bug happening in real time.
          console.warn(
            `[VRoidAvatarEngine] Failed to load "${resolvedPath}" (attempt ${idx + 1}/${paths.length}).` +
            (idx + 1 < paths.length ? ` Falling back to "${paths[idx + 1]}".` : ' No fallbacks remain.')
          );
          loadAttempt(idx + 1).then(resolve).catch(reject);
        });
      });
    };

    return loadAttempt(0);
  }

  centerCameraOnHead() {
    if (!this.camera) return;
    let headY = 1.40;
    let headX = 0;
    let headZ = 0;
    if (this.head) {
      this.head.updateMatrixWorld(true);
      const temp = new THREE.Vector3();
      this.head.getWorldPosition(temp);
      if (temp.y > 0.3) {
        headY = temp.y;
        headX = temp.x;
        headZ = temp.z;
      }
    } else {
      const bbox = new THREE.Box3().setFromObject(this.scene);
      if (bbox.max.y > 0.5) {
        headY = bbox.min.y + (bbox.max.y - bbox.min.y) * 0.85;
      }
    }

    const aspect = this.camera.aspect || 1.0;
    if (aspect < 0.95) {
      // Portrait / compact container (e.g. floating avatar 160px x 210px)
      this.camera.fov = 30;
      this.camera.position.set(headX, headY - 0.07, headZ + 1.40);
      this.camera.lookAt(headX, headY - 0.03, headZ);
    } else if (aspect > 1.6) {
      // Wide / landscape container (e.g. Story Mode right pane)
      this.camera.fov = 30;
      this.camera.position.set(headX, headY - 0.06, headZ + 1.50);
      this.camera.lookAt(headX, headY - 0.03, headZ);
    } else {
      // Standard medium container
      this.camera.fov = 28;
      this.camera.position.set(headX, headY - 0.06, headZ + 1.45);
      this.camera.lookAt(headX, headY - 0.03, headZ);
    }
    this.camera.updateProjectionMatrix();
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
    this.hips = pelvis;
    this.hipsRestPosition.copy(pelvis.position);

    g.updateMatrixWorld(true);
    this.scene.add(g);
    this.centerCameraOnHead();
    // D-04 FIX: procedural fallback is fully constructed — safe to animate now.
    this.markReady('procedural-fallback');
  }

  /**
   * D-04 FIX & T6 HARDENING: Snap every animated bone directly to its neutral rest pose.
   *
   * Called once on the first frame after loading completes. Without this the
   * loop damps each joint in from rotation 0 (a horizontal T-pose) toward the
   * VRM rest angles, which reads as the arms swinging down on entry.
   *
   * Rest values here MUST stay in sync with the defaults used in loop():
   *   hips     position    ->  this.hipsRestPosition (preserves model ground offset)
   *   hips     rotation    ->  (0, 0, 0)
   *   arms     rotation.z  ->  isVRM ? -1.25 / +1.25 : 0   (see "4. Arm Rotations")
   *   arms     rotation.x  ->  0
   *   arms     rotation.y  ->  0
   *   forearms rotation.y  ->  isVRM ? -0.32 / +0.32 : 0
   *   forearms rotation.x  ->  0
   *   forearms rotation.z  ->  0
   *   hands    rotation    ->  (0, 0, 0)
   *   shoulders rotation   ->  (0, 0, 0)
   *   spine    rotation    ->  (0, 0, 0)
   *   chest    rotation    ->  (0, 0, 0)
   *   neck     rotation    ->  (0, 0, 0)
   *   head     rotation    ->  (0, 0, 0)
   */
  applyRestPose() {
    if (this.hips) {
      this.hips.position.copy(this.hipsRestPosition);
      this.hips.rotation.set(0, 0, 0);
    }

    if (this.leftArm) {
      this.leftArm.rotation.z = this.isVRM ? -1.25 : 0;
      this.leftArm.rotation.x = 0;
      this.leftArm.rotation.y = 0;
    }
    if (this.rightArm) {
      this.rightArm.rotation.z = this.isVRM ? 1.25 : 0;
      this.rightArm.rotation.x = 0;
      this.rightArm.rotation.y = 0;
    }

    if (this.leftForearm) {
      this.leftForearm.rotation.y = this.isVRM ? -0.32 : 0;
      this.leftForearm.rotation.x = 0;
      this.leftForearm.rotation.z = 0;
    }
    if (this.rightForearm) {
      this.rightForearm.rotation.y = this.isVRM ? 0.32 : 0;
      this.rightForearm.rotation.x = 0;
      this.rightForearm.rotation.z = 0;
    }

    if (this.leftHand) {
      this.leftHand.rotation.set(0, 0, 0);
    }
    if (this.rightHand) {
      this.rightHand.rotation.set(0, 0, 0);
    }

    if (this.leftShoulder) {
      this.leftShoulder.rotation.set(0, 0, 0);
    }
    if (this.rightShoulder) {
      this.rightShoulder.rotation.set(0, 0, 0);
    }

    if (this.spine) {
      this.spine.rotation.set(0, 0, 0);
    }
    if (this.chest) {
      this.chest.rotation.set(0, 0, 0);
    }
    if (this.neck) {
      this.neck.rotation.set(0, 0, 0);
    }
    if (this.head) {
      this.head.rotation.set(0, 0, 0);
    }

    this.restPoseApplied = true;
    console.log('[VRoidAvatarEngine] Rest pose applied. Animation loop is now active.');
  }

  /**
   * D-04 FIX: Flip the engine into its animated state.
   * Called from BOTH load paths — successful GLB load and procedural fallback —
   * so the loop never animates a partially-bound skeleton.
   */
  private markReady(source: string) {
    if (this.ready) return;
    this.ready = true;
    console.log(`[VRoidAvatarEngine] Avatar ready (source: ${source}). Bones bound, isVRM=${this.isVRM}.`);
  }

  setState(s: AnimState) {
    if (this.animState === s) return;
    this.animState = s;
    this.animT = 0;
  }

  loop() {
    if (this.disposed || this._paused) return;
    this.raf = requestAnimationFrame(() => this.loop());

    // ── D-04 FIX ───────────────────────────────────────────────────────────
    // Do not drive any bone until loading and bone binding are complete.
    // We keep rendering so the model appears the moment it is added to the
    // scene, but we consume the clock delta so the first animated frame does
    // not receive one huge dt accumulated across the entire load duration.
    if (!this.ready) {
      this.clock.getDelta();
      if (this.renderer && this.scene && this.camera) {
        this.renderer.render(this.scene, this.camera);
      }
      return;
    }

    // On the first frame after becoming ready, place bones directly at rest
    // rather than letting them lerp in from rotation zero (the T-pose snap).
    if (!this.restPoseApplied) this.applyRestPose();

    const dt = this.clock.getDelta();

    // ── C-02 & T6: Two-Tier Performance Watchdog ───────────────────────────
    // Sample rolling average frame time over ~2s (120 frames).
    // Tier 1: if avgFrameMs > 28ms (< ~36fps), drop pixel ratio to reduce fillrate load.
    // Tier 2: if avgFrameMs > 35ms (< ~28fps), drop pixel ratio AND set isLowPowerDevice=true
    //         to disable secondary bone calculations (wrist follow-through, micro contrapposto).
    if (!this.hasDownscaledForPerf && dt > 0) {
      this.frameTimeAccumulator += dt * 1000;
      this.frameTimeSamples++;
      if (this.frameTimeSamples >= 120) {
        const avgFrameMs = this.frameTimeAccumulator / this.frameTimeSamples;
        if (avgFrameMs > 35) {
          this.currentPixelRatio = Math.max(1, this.currentPixelRatio - 0.5);
          if (this.renderer) this.renderer.setPixelRatio(this.currentPixelRatio);
          this.isLowPowerDevice = true;
          this.hasDownscaledForPerf = true;
          console.warn(
            `[VRoidAvatarEngine] Performance watchdog Tier 2: avg frame time ${avgFrameMs.toFixed(1)}ms. ` +
            `Reduced pixel ratio to ${this.currentPixelRatio.toFixed(2)} and activated low-power mode.`
          );
        } else if (avgFrameMs > 28 && this.currentPixelRatio > 1) {
          this.currentPixelRatio = Math.max(1, this.currentPixelRatio - 0.5);
          if (this.renderer) this.renderer.setPixelRatio(this.currentPixelRatio);
          this.hasDownscaledForPerf = true;
          console.warn(
            `[VRoidAvatarEngine] Performance watchdog Tier 1: avg frame time ${avgFrameMs.toFixed(1)}ms. ` +
            `Reduced pixel ratio to ${this.currentPixelRatio.toFixed(2)} to restore smoothness.`
          );
        } else {
          console.log(
            `[VRoidAvatarEngine] Performance watchdog: avg frame time ${avgFrameMs.toFixed(1)}ms — within budget.`
          );
          this.hasDownscaledForPerf = true;
        }
        this.frameTimeAccumulator = 0;
        this.frameTimeSamples = 0;
      }
    }
    const et = this.clock.getElapsedTime();
    this.animT += dt;

    const persona = this.persona;
    const speed = persona.gestureSpeed;
    const express = persona.expressiveness;

    // 1. Natural Breathing & Body Swaying (Persona-Driven)
    const breath = Math.sin(et * 1.5 * speed);
    const breathingSpineX = breath * 0.01 * express;
    const breathingShoulderZ = breath * 0.005 * express;

    // Body sway frequencies (using sine so at et=0 sway is 0, exactly matching rest pose)
    const swayX = Math.sin(et * 0.4 * speed) * 0.008 * persona.swayAmp;
    const swayY = Math.sin(et * 0.25 * speed) * 0.012 * persona.swayAmp;
    const swayZ = Math.sin(et * 0.3 * speed) * 0.006 * persona.swayAmp;

    // Contrapposto weight shift on hips & spine counter-balance
    let contraRoll = 0;
    if (this.hips) {
      if (!this.isLowPowerDevice) {
        // Slow natural weight shift between legs (10-14s period)
        const contraX = Math.sin(et * 0.2 * speed) * 0.012 * persona.swayAmp;
        contraRoll = Math.sin(et * 0.2 * speed) * 0.015 * persona.swayAmp;
        const breathHipsY = Math.sin(et * 1.5 * speed) * 0.003 * express;

        this.hips.position.x = THREE.MathUtils.damp(this.hips.position.x, this.hipsRestPosition.x + contraX, 4, dt);
        this.hips.position.y = THREE.MathUtils.damp(this.hips.position.y, this.hipsRestPosition.y + breathHipsY, 4, dt);
        this.hips.position.z = THREE.MathUtils.damp(this.hips.position.z, this.hipsRestPosition.z, 4, dt);
        this.hips.rotation.z = THREE.MathUtils.damp(this.hips.rotation.z, contraRoll, 4, dt);
        this.hips.rotation.x = THREE.MathUtils.damp(this.hips.rotation.x, 0, 4, dt);
        this.hips.rotation.y = THREE.MathUtils.damp(this.hips.rotation.y, 0, 4, dt);
      } else {
        // Low power mode: hold rest position with simple damping, bypass lateral contrapposto
        this.hips.position.x = THREE.MathUtils.damp(this.hips.position.x, this.hipsRestPosition.x, 4, dt);
        this.hips.position.y = THREE.MathUtils.damp(this.hips.position.y, this.hipsRestPosition.y, 4, dt);
        this.hips.position.z = THREE.MathUtils.damp(this.hips.position.z, this.hipsRestPosition.z, 4, dt);
        this.hips.rotation.set(0, 0, 0);
      }
    }

    if (this.spine) {
      // Spine counter-rotates contrapposto tilt to keep head and torso upright
      const spineCounterRoll = -contraRoll * 0.85;
      const targetSpineX = breathingSpineX + swayX;
      const targetSpineZ = spineCounterRoll + swayZ;
      this.spine.rotation.x = THREE.MathUtils.damp(this.spine.rotation.x, targetSpineX, 5, dt);
      this.spine.rotation.z = THREE.MathUtils.damp(this.spine.rotation.z, targetSpineZ, 5, dt);
      this.spine.rotation.y = THREE.MathUtils.damp(this.spine.rotation.y, 0, 5, dt);
    }
    if (this.chest) {
      const targetChestX = breathingSpineX * 0.5;
      this.chest.rotation.x = THREE.MathUtils.damp(this.chest.rotation.x, targetChestX, 5, dt);
    }

    // Clavicle elevation coupling with arm lift + shrug state + breathing
    const defaultLeftZ = this.isVRM ? -1.25 : 0;
    const defaultRightZ = this.isVRM ? 1.25 : 0;

    let armLiftLeft = 0;
    if (this.leftArm) {
      armLiftLeft = Math.max(0, this.leftArm.rotation.z - defaultLeftZ);
    }
    let armLiftRight = 0;
    if (this.rightArm) {
      armLiftRight = Math.max(0, defaultRightZ - this.rightArm.rotation.z);
    }

    const isShrug = this.animState === 'shrug';
    const shrugElevation = isShrug ? 0.08 * express : 0;
    const shrugForwardRoll = isShrug ? 0.03 : 0;

    if (this.leftShoulder) {
      // Preserve breathing coupling additively with arm lift and shrug
      const targetShoulderZ = -breathingShoulderZ - armLiftLeft * 0.12 - shrugElevation;
      this.leftShoulder.rotation.z = THREE.MathUtils.damp(this.leftShoulder.rotation.z, targetShoulderZ, 6, dt);
      this.leftShoulder.rotation.x = THREE.MathUtils.damp(this.leftShoulder.rotation.x, shrugForwardRoll, 6, dt);
    }
    if (this.rightShoulder) {
      // Preserve breathing coupling additively with arm lift and shrug
      const targetShoulderZ = breathingShoulderZ + armLiftRight * 0.12 + shrugElevation;
      this.rightShoulder.rotation.z = THREE.MathUtils.damp(this.rightShoulder.rotation.z, targetShoulderZ, 6, dt);
      this.rightShoulder.rotation.x = THREE.MathUtils.damp(this.rightShoulder.rotation.x, shrugForwardRoll, 6, dt);
    }

    // 2. Head & Neck Movement (State Machine + Persona)
    if (this.head) {
      const s = this.animState;
      const tiltAmp = persona.headTiltAmp;

      let targetHeadX = 0;
      let targetHeadY = 0;
      let targetHeadZ = 0;
      let targetNeckY = 0;

      if (s === 'idle') {
        if (this.gazeTrackingEnabled) {
          // Smoothly interpolate mouse target offset with organic damping
          this.mouseTargetOffset.x = THREE.MathUtils.damp(this.mouseTargetOffset.x, this.mouseNormalized.x, 6, dt);
          this.mouseTargetOffset.y = THREE.MathUtils.damp(this.mouseTargetOffset.y, this.mouseNormalized.y, 6, dt);

          // Subtle natural head gaze yaw and pitch towards cursor
          const gazeYaw = this.mouseTargetOffset.x * 0.20 * tiltAmp;
          const gazePitch = -this.mouseTargetOffset.y * 0.12 * tiltAmp;

          targetHeadY = swayY + gazeYaw + Math.sin(et * 0.13) * 0.02 * tiltAmp;
          targetHeadX = Math.sin(et * 0.11) * 0.012 * tiltAmp + gazePitch;
          targetHeadZ = Math.sin(et * 0.08) * 0.006 * tiltAmp;
          targetNeckY = gazeYaw * 0.35 + Math.sin(et * 0.13) * 0.008;
        } else {
          targetHeadY = swayY + Math.sin(et * 0.13) * 0.035 * tiltAmp;
          targetHeadX = Math.sin(et * 0.11) * 0.018 * tiltAmp;
          targetHeadZ = Math.sin(et * 0.08) * 0.008 * tiltAmp;
          targetNeckY = Math.sin(et * 0.13) * 0.01;
        }
      } else if (s === 'listening') {
        const listenTilt = 0.04 * tiltAmp;
        targetHeadX = 0.03;
        targetHeadY = listenTilt;
        targetHeadZ = -listenTilt;
      } else if (s === 'nod') {
        const nodFreq = 6.0 * speed;
        // Smoothly blend in nod over first 0.15s to eliminate rotational pops
        const nodEnvelope = Math.min(1, this.animT / 0.15);
        targetHeadX = Math.sin(this.animT * nodFreq) * 0.16 * express * nodEnvelope + 0.02;
        targetHeadY = 0;
        targetHeadZ = 0;
      } else if (s === 'thinking') {
        targetHeadX = 0.06 * tiltAmp + Math.sin(et * 0.6) * 0.01;
        targetHeadY = 0.14 * tiltAmp + Math.sin(et * 0.5) * 0.015;
        targetHeadZ = 0.06 * tiltAmp;
      } else if (s === 'shrug') {
        targetHeadX = -0.05;
        targetHeadY = 0;
        targetHeadZ = 0;
      } else {
        targetHeadX = 0.02;
        targetHeadY = 0;
        targetHeadZ = 0;
      }

      if (s === 'talking') {
        this.talkPhase += 0.18 * speed;
        targetHeadX += Math.sin(this.talkPhase) * 0.015 * express;
        targetHeadY += Math.sin(this.talkPhase * 0.5) * 0.01 * express;
      }

      const headDampLambda = (s === 'nod') ? 12 : 5;
      this.head.rotation.x = THREE.MathUtils.damp(this.head.rotation.x, targetHeadX, headDampLambda, dt);
      this.head.rotation.y = THREE.MathUtils.damp(this.head.rotation.y, targetHeadY, headDampLambda, dt);
      this.head.rotation.z = THREE.MathUtils.damp(this.head.rotation.z, targetHeadZ, headDampLambda, dt);

      if (this.neck) {
        this.neck.rotation.y = THREE.MathUtils.damp(this.neck.rotation.y, targetNeckY, 5, dt);
        this.neck.rotation.x = THREE.MathUtils.damp(this.neck.rotation.x, targetHeadX * 0.2, 5, dt);
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

    // Saccadic eye movement + gaze tracking when active
    if (this.gazeTrackingEnabled && this.animState === 'idle') {
      this.eyeTargetOffset.set(
        this.mouseTargetOffset.x * 0.38,
        this.mouseTargetOffset.y * 0.28
      );
    } else {
      this.eyeSaccadeTimer += dt;
      if (this.eyeSaccadeTimer > 2.5 + Math.random() * 2.0) {
        this.eyeSaccadeTimer = 0;
        this.eyeTargetOffset.set(
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.015
        );
      }
    }
    this.eyeCurrentOffset.x = THREE.MathUtils.damp(this.eyeCurrentOffset.x, this.eyeTargetOffset.x, 8, dt);
    this.eyeCurrentOffset.y = THREE.MathUtils.damp(this.eyeCurrentOffset.y, this.eyeTargetOffset.y, 8, dt);

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

    // 4. Arm Rotations with Conversational Gesture Phrasing
    let targetLeftZ = defaultLeftZ;
    let targetLeftX = 0;
    let targetLeftY = 0;

    let targetRightZ = defaultRightZ;
    let targetRightX = 0;
    let targetRightY = 0;

    let targetLeftForearmY = this.isVRM ? -0.32 : 0;
    let targetRightForearmY = this.isVRM ? 0.32 : 0;

    let targetLeftHandX = 0;
    let targetLeftHandZ = 0;
    let targetRightHandX = 0;
    let targetRightHandZ = 0;

    if (this.animState === 'wave') {
      targetLeftZ = Math.PI * 0.7 + Math.sin(et * 6 * speed) * 0.22;
      targetLeftX = 0.1;
      targetLeftForearmY = (this.isVRM ? -0.32 : 0) - 0.4;
      targetLeftHandZ = Math.sin(et * 6 * speed) * 0.15;
    } else if (this.animState === 'shrug') {
      targetLeftZ = defaultLeftZ + 0.25;
      targetRightZ = defaultRightZ - 0.25;
      targetLeftX = 0.1;
      targetRightX = 0.1;
      targetLeftForearmY = (this.isVRM ? -0.32 : 0) - 0.2;
      targetRightForearmY = (this.isVRM ? 0.32 : 0) + 0.2;
    } else if (this.animState === 'thinking') {
      targetRightZ = -1.05;
      targetRightX = 0.4;
      targetRightForearmY = (this.isVRM ? 0.32 : 0) + 0.7;
      targetRightHandX = 0.2;
      targetLeftZ = defaultLeftZ + Math.sin(et * 1.5 * speed) * 0.015;
    } else if (this.animState === 'talking') {
      // Conversational Gesture Phrasing:
      // A complete conversational phrase cycle runs over ~3.5s.
      // Phase 1 (0 to ~2.0s): Active multi-harmonic gesture beat with forearm & wrist inflection.
      // Phase 2 (~2.0s to 3.5s): Attentive resting hold while completing speech idea.
      const phrasePeriod = 3.5 / Math.max(0.5, speed);
      const phrasePhase = (this.animT % phrasePeriod) / phrasePeriod;

      if (phrasePhase < 0.58) {
        // Active gesture stroke with sinusoidal bell envelope
        const strokeEnv = Math.sin((phrasePhase / 0.58) * Math.PI);
        // Layered non-harmonic beats (2.5Hz primary and 1.3Hz secondary)
        const beatPrimary = Math.sin(et * 2.5 * speed) * 0.10 * express;
        const beatSecondary = Math.sin(et * 1.3 * speed) * 0.05 * express;
        const gestureLift = (beatPrimary + beatSecondary) * strokeEnv;

        // Dominant right arm gestures outward and forward
        targetRightZ = defaultRightZ - 0.28 * express * strokeEnv - gestureLift * 0.8;
        targetRightX = 0.18 * express * strokeEnv + Math.sin(et * 2.0 * speed) * 0.06 * strokeEnv;
        targetRightForearmY = (this.isVRM ? 0.32 : 0) + 0.25 * strokeEnv + gestureLift * 0.4;

        // Subtle follow-through on right hand
        targetRightHandX = -gestureLift * 0.5;
        targetRightHandZ = -0.12 * strokeEnv;

        // Relaxed counterbalance on left arm
        targetLeftZ = defaultLeftZ + 0.06 * express * strokeEnv + Math.sin(et * 1.8 * speed) * 0.02 * strokeEnv;
        targetLeftForearmY = (this.isVRM ? -0.32 : 0) - 0.08 * strokeEnv;
      } else {
        // Attentive resting hold: arm settles near rest pose with subtle breathing modulation
        targetRightZ = defaultRightZ - 0.06 * express;
        targetRightX = 0.04 * express;
        targetRightForearmY = this.isVRM ? 0.32 : 0;
        targetLeftZ = defaultLeftZ + Math.sin(et * 1.5 * speed) * 0.015;
      }
    } else {
      // Idle / Listening: subtle breathing sway on arms
      targetLeftZ = defaultLeftZ + Math.sin(et * 1.5 * speed) * 0.015;
      targetRightZ = defaultRightZ - Math.sin(et * 1.5 * speed) * 0.015;
    }

    if (this.leftArm) {
      this.leftArm.rotation.z = THREE.MathUtils.damp(this.leftArm.rotation.z, targetLeftZ, 6, dt);
      this.leftArm.rotation.x = THREE.MathUtils.damp(this.leftArm.rotation.x, targetLeftX, 6, dt);
      this.leftArm.rotation.y = THREE.MathUtils.damp(this.leftArm.rotation.y, targetLeftY, 6, dt);
    }
    if (this.rightArm) {
      this.rightArm.rotation.z = THREE.MathUtils.damp(this.rightArm.rotation.z, targetRightZ, 6, dt);
      this.rightArm.rotation.x = THREE.MathUtils.damp(this.rightArm.rotation.x, targetRightX, 6, dt);
      this.rightArm.rotation.y = THREE.MathUtils.damp(this.rightArm.rotation.y, targetRightY, 6, dt);
    }

    if (this.leftForearm) {
      this.leftForearm.rotation.y = THREE.MathUtils.damp(this.leftForearm.rotation.y, targetLeftForearmY, 6, dt);
    }
    if (this.rightForearm) {
      this.rightForearm.rotation.y = THREE.MathUtils.damp(this.rightForearm.rotation.y, targetRightForearmY, 6, dt);
    }

    // Secondary wrist / hand motion (gated on !isLowPowerDevice)
    if (this.leftHand) {
      if (!this.isLowPowerDevice) {
        this.leftHand.rotation.x = THREE.MathUtils.damp(this.leftHand.rotation.x, targetLeftHandX, 7, dt);
        this.leftHand.rotation.z = THREE.MathUtils.damp(this.leftHand.rotation.z, targetLeftHandZ, 7, dt);
        this.leftHand.rotation.y = THREE.MathUtils.damp(this.leftHand.rotation.y, 0, 7, dt);
      } else {
        this.leftHand.rotation.set(0, 0, 0);
      }
    }
    if (this.rightHand) {
      if (!this.isLowPowerDevice) {
        this.rightHand.rotation.x = THREE.MathUtils.damp(this.rightHand.rotation.x, targetRightHandX, 7, dt);
        this.rightHand.rotation.z = THREE.MathUtils.damp(this.rightHand.rotation.z, targetRightHandZ, 7, dt);
        this.rightHand.rotation.y = THREE.MathUtils.damp(this.rightHand.rotation.y, 0, 7, dt);
      } else {
        this.rightHand.rotation.set(0, 0, 0);
      }
    }

    // 5. Lip Sync & Morph Targets with Asymmetric Muscle Shaping
    const isTalking = this.animState === 'talking';

    // ── D-03 FIX ───────────────────────────────────────────────────────────
    // Lazily bind to the shared avatar-voice analyser the first time this
    // avatar speaks. We cannot do this in init(): the AudioContext is created
    // on demand at first playback, and browsers block context creation before
    // a user gesture. Checking here costs one null check per talking frame and
    // stops entirely once bound.
    if (isTalking && !this.audioAnalyser) {
      const sharedAnalyser = getExistingAvatarAnalyser();
      if (sharedAnalyser) {
        this.connectAudioAnalyser(sharedAnalyser);
        console.log('[VRoidAvatarEngine] Lip sync bound to shared avatar-voice analyser (audio-driven mouth active).');
      }
    }

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
      const targetA = audioAmp * 0.85;
      const targetO = audioAmp * 0.40;

      // Asymmetric muscle attack (~35ms, lambda=28) vs decay (~110ms, lambda=9)
      const lambdaA = targetA > (this.currentInfluences['A'] || 0) ? 28 : 9;
      const lambdaO = targetO > (this.currentInfluences['O'] || 0) ? 28 : 9;
      this.currentInfluences['A'] = THREE.MathUtils.damp(this.currentInfluences['A'] || 0, targetA, lambdaA, dt);
      this.currentInfluences['O'] = THREE.MathUtils.damp(this.currentInfluences['O'] || 0, targetO, lambdaO, dt);
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
        const lambda = targetValue > currentVal ? 28 : 9; // rapid attack (~35ms), gentle decay (~110ms)
        this.currentInfluences[v] = THREE.MathUtils.damp(currentVal, targetValue, lambda, dt);
      });
    } else {
      ['A', 'I', 'U', 'E', 'O'].forEach(v => {
        const currentVal = this.currentInfluences[v] || 0;
        this.currentInfluences[v] = THREE.MathUtils.damp(currentVal, 0, 10, dt);
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
      const targetScaleY = isTalking ? (0.6 + Math.abs(Math.sin(et * 7 * speed)) * 1.0 + Math.sin(et * 13) * 0.3) : 0.1;
      const mouthLambda = targetScaleY > this.proceduralMouth.scale.y ? 25 : 10;
      this.proceduralMouth.scale.y = THREE.MathUtils.damp(this.proceduralMouth.scale.y, targetScaleY, mouthLambda, dt);
    }

    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  resize(w: number, h: number) {
    if (!this.camera || !this.renderer || !w || !h || w <= 0 || h <= 0) return;
    this.camera.aspect = w / h;
    this.centerCameraOnHead();

    // C-02 FIX: re-clamp pixel ratio on resize. devicePixelRatio can change
    // at runtime — browser zoom, or dragging the window between a retina and
    // a standard monitor — and setSize() alone would keep a stale ratio.
    // If the watchdog has already downscaled for performance we honour its
    // decision rather than silently undoing it.
    if (!this.hasDownscaledForPerf) {
      const cap = this.isLowPowerDevice ? 1.5 : this.maxPixelRatio;
      const nextRatio = Math.min(window.devicePixelRatio, cap);
      if (Math.abs(nextRatio - this.currentPixelRatio) > 0.01) {
        this.currentPixelRatio = nextRatio;
        this.renderer.setPixelRatio(nextRatio);
      }
    }

    this.renderer.setSize(w, h, false);
  }

  dispose() {
    this.disposed = true;
    if (this.raf) cancelAnimationFrame(this.raf);

    if (this.onMouseMoveHandler && typeof window !== 'undefined') {
      window.removeEventListener('mousemove', this.onMouseMoveHandler);
      console.log('[VRoidAvatarEngine] Gaze tracking mouse listener detached on engine disposal.');
    }

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
