/**
 * PinIT TTS Web Worker
 * Runs Kokoro TTS (primary) and KittenTTS (fallback) off the main thread.
 * Communicates via postMessage:
 *   IN:  { id, action: 'speak', text, voice }
 *   OUT: { id, action: 'audio', buffer: Float32Array, sampleRate } | { id, action: 'error', message }
 *       { id: '__status', action: 'ready', engine }  — sent once when engine is loaded
 */

// ── Engine state ───────────────────────────────────────────────────────────────
let kokoroTTS = null;
let kittenEngine = null;
let loadedEngine = null; // 'kokoro' | 'kitten' | null
let loading = false;

// ── Load Kokoro (primary, ~90–300MB quantized) ─────────────────────────────────
async function loadKokoro() {
  try {
    const module = await import('https://esm.sh/kokoro-js@1');
    const { KokoroTTS, env } = module;
    
    // Enable multi-threading for WASM execution to minimize CPU latency
    if (env && env.backends && env.backends.onnx && env.backends.onnx.wasm) {
      env.backends.onnx.wasm.numThreads = Math.min(4, navigator.hardwareConcurrency || 4);
    } else if (self.ort && self.ort.env && self.ort.env.wasm) {
      self.ort.env.wasm.numThreads = Math.min(4, navigator.hardwareConcurrency || 4);
    }

    try {
      kokoroTTS = await KokoroTTS.from_pretrained('onnx-community/Kokoro-82M-v1.0-ONNX', {
        dtype: 'q8',   // Best quality/size balance for browser
        device: 'webgpu',
      });
      console.log('[TTS Worker] Kokoro loaded successfully with WebGPU.');
    } catch (gpuErr) {
      console.warn('[TTS Worker] WebGPU not available, falling back to WASM CPU:', gpuErr.message);
      kokoroTTS = await KokoroTTS.from_pretrained('onnx-community/Kokoro-82M-v1.0-ONNX', {
        dtype: 'q8',
        device: 'wasm',
      });
    }

    // Warm up the ONNX session to compile WASM kernels
    try {
      await kokoroTTS.generate(' ', { voice: 'af_heart' });
    } catch (warmupErr) {
      console.warn('[TTS Worker] Kokoro warmup failed:', warmupErr.message);
    }

    loadedEngine = 'kokoro';
    self.postMessage({ id: '__status', action: 'ready', engine: 'kokoro' });
    return true;
  } catch (err) {
    console.warn('[TTS Worker] Kokoro load failed, trying KittenTTS:', err.message);
    return false;
  }
}

// ── Load KittenTTS (fallback, ~24MB Nano model) ────────────────────────────────
let voicesData = null;

async function loadKitten() {
  try {
    // KittenTTS uses ONNX Runtime Web — load via CDN
    const ort = await import('https://cdn.jsdelivr.net/npm/onnxruntime-web/dist/ort.mjs');
    ort.env.wasm.wasmPaths = 'https://cdn.jsdelivr.net/npm/onnxruntime-web/dist/';
    ort.env.wasm.numThreads = Math.min(4, navigator.hardwareConcurrency || 4);

    // Load the Nano model (~25MB) from HuggingFace
    const modelUrl = 'https://huggingface.co/KittenML/kitten-tts-nano-0.8-int8/resolve/main/kitten_tts_nano_v0_8.onnx';
    const session = await ort.InferenceSession.create(modelUrl, {
      executionProviders: ['wasm'],
    });

    // Load voices embeddings binary file
    const voicesRes = await fetch(new URL('./voices.bin', self.location.href));
    const voicesBuf = await voicesRes.arrayBuffer();
    voicesData = new Float32Array(voicesBuf);

    kittenEngine = { ort, session };
    loadedEngine = 'kitten';
    self.postMessage({ id: '__status', action: 'ready', engine: 'kitten' });
    return true;
  } catch (err) {
    console.warn('[TTS Worker] KittenTTS load failed:', err.message);
    return false;
  }
}

// ── Bootstrap: try Kokoro first (premium neural voice), then KittenTTS (fallback) ────
async function bootstrap() {
  if (loading || loadedEngine) return;
  loading = true;
  const kokoroOk = await loadKokoro();
  if (!kokoroOk) {
    await loadKitten();
  }
  loading = false;
}

// ── Kokoro voice map (teacher/mentor/interviewer ID → Kokoro voice name) ───────
const KOKORO_VOICE_MAP = {
  // Mentors (2)
  priya:    'af_heart',   // Warm, sweet US Female (Career Mentor)
  anish:    'am_liam',    // Clear, friendly US Male (Career Mentor)

  // Teachers (4)
  kashyap:  'am_fenrir',   // Clean US Male (matching sora.glb)
  karthic:  'am_liam',     // Clear, friendly US Male (matching sora.glb)
  maya:     'bf_emma',     // Professional UK Female (matching yuki.glb)
  divya:    'af_nicole',   // Creative US Female (matching mika.glb)
  
  // Legacy Teachers / Fallbacks
  aisha:    'af_sky',     // Friendly US Female
  rohan:    'am_fenrir',  // Clean US Male

  // Interviewers (7)
  vikram:   'bm_lewis',   // Serious UK Male (Strict & Time-conscious)
  shalini:  'bf_isabella',// Professional UK Female (Silent Observer)
  aditya:   'am_adam',    // Wise US Male (System Design Purist)
  neha:     'af_bella',   // Energetic US Female (High-Stress Driller)
  rajesh:   'am_liam',    // Friendly US Male (Legacy Defender)
  sneha:    'af_sarah',   // Warm, socratic US Female (Empathy-First Socratic)
  abhijit:  'bm_george',  // UK Male (Bored Executive)
};

// ── KittenTTS voice map (teacher/mentor/interviewer ID → voice index 0–7) ──────
// Voices: 0=Bella, 1=Jasper, 2=Luna, 3=Bruno, 4=Rosie, 5=Hugo, 6=Kiki, 7=Leo
const KITTEN_VOICE_MAP = {
  // Mentors (2)
  priya:    0,  // Bella  (Female)
  anish:    5,  // Hugo   (Male)

  // Teachers (4)
  kashyap:  1,  // Jasper (Male)
  karthic:  3,  // Bruno  (Male)
  maya:     2,  // Luna   (Female)
  divya:    4,  // Rosie  (Female)
  
  // Legacy Teachers / Fallbacks
  aisha:    2,  // Luna
  rohan:    1,  // Jasper

  // Interviewers (7)
  vikram:   3,  // Bruno
  shalini:  2,  // Luna
  aditya:   5,  // Hugo
  neha:     6,  // Kiki   (Female)
  rajesh:   7,  // Leo    (Male)
  sneha:    0,  // Bella
  abhijit:  1,  // Jasper
};

// ── Speak with Kokoro ──────────────────────────────────────────────────────────
async function speakKokoro(text, teacherId, vibe = 'neutral') {
  let voice = KOKORO_VOICE_MAP[teacherId] || 'af_heart';

  const audio = await kokoroTTS.generate(text.slice(0, 500), { voice });
  return { buffer: audio.audio, sampleRate: audio.sampling_rate };
}

// ── Speak with KittenTTS ───────────────────────────────────────────────────────
async function speakKitten(text, teacherId) {
  const voiceIdx = KITTEN_VOICE_MAP[teacherId] ?? 0;
  const { ort, session } = kittenEngine;

  // Simple char→token mapping (KittenTTS Nano uses byte-pair-like tokens)
  const tokens = Array.from(text.slice(0, 300))
    .map(c => c.charCodeAt(0))
    .filter(c => c < 256);

  if (tokens.length === 0) {
    tokens.push(32); // Fallback space if empty
  }

  const inputIds = new ort.Tensor('int64', BigInt64Array.from(tokens.map(BigInt)), [1, tokens.length]);

  // Extract correct style vector based on token count
  // Shape of each voice array is (400, 256)
  // Clamp token index to range 0-399
  const rowIndex = Math.min(399, Math.max(0, tokens.length));
  const voiceOffset = voiceIdx * 400 * 256;
  const rowOffset = rowIndex * 256;
  const offset = voiceOffset + rowOffset;

  const styleVector = voicesData.subarray(offset, offset + 256);
  const styleTensor = new ort.Tensor('float32', new Float32Array(styleVector), [1, 256]);
  const speedTensor = new ort.Tensor('float32', new Float32Array([1.0]), [1]);

  const results = await session.run({
    input_ids: inputIds,
    style: styleTensor,
    speed: speedTensor
  });

  const audioData = results.waveform?.data || results.audio?.data || results.output?.data;

  if (!audioData) throw new Error('KittenTTS returned no audio data');

  return { buffer: new Float32Array(audioData), sampleRate: 24000 };
}

// ── Message handler ────────────────────────────────────────────────────────────
self.onmessage = async (event) => {
  const { id, action, text, teacherId, vibe } = event.data;

  if (action === 'preload') {
    bootstrap();
    return;
  }

  if (action !== 'speak') return;

  // Trigger bootstrap if not yet loaded
  if (!loadedEngine && !loading) {
    bootstrap();
  }

  // Wait for engine to be ready (poll, max 60s)
  const MAX_WAIT = 60000;
  const POLL_INTERVAL = 500;
  let waited = 0;
  while (!loadedEngine && waited < MAX_WAIT) {
    await new Promise(r => setTimeout(r, POLL_INTERVAL));
    waited += POLL_INTERVAL;
  }

  if (!loadedEngine) {
    self.postMessage({ id, action: 'error', message: 'No TTS engine available after timeout' });
    return;
  }

  try {
    let result;
    if (loadedEngine === 'kokoro') {
      result = await speakKokoro(text, teacherId, vibe);
    } else {
      result = await speakKitten(text, teacherId);
    }

    // Transfer the buffer (zero-copy via Transferable)
    self.postMessage(
      { id, action: 'audio', buffer: result.buffer, sampleRate: result.sampleRate, engine: loadedEngine },
      [result.buffer.buffer]
    );
  } catch (err) {
    self.postMessage({ id, action: 'error', message: err.message });
  }
};

// ── Auto-preload on worker start ───────────────────────────────────────────────
bootstrap();
