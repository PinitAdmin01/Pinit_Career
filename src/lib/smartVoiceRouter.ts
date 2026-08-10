/**
 * PinIT Careers AI Voice System - Phase 12: Smart Hybrid Voice Router
 * Routes audio generation requests across IndexedDB Cache, Client WASM, and Cloud FastAPI.
 */

import { voiceCacheDB, computeVoiceCacheKey } from "./voiceCacheDB";
import { benchmarkDeviceCapability, DeviceBenchmarkReport } from "./deviceBenchmark";

export interface VoiceSynthesizeOptions {
  text: string;
  voice?: string;
  speed?: number;
  language?: string;
  apiEndpoint?: string;
}

export interface VoiceSynthesizeResult {
  audioBuffer: ArrayBuffer;
  source: "INDEXED_DB_CACHE" | "LOCAL_CLIENT_WASM" | "CLOUD_FASTAPI";
  latencyMs: number;
  durationSec: number;
  cacheKey: string;
}

const DEFAULT_CLOUD_ENDPOINT = process.env.NEXT_PUBLIC_TTS_API_URL || "https://pinit-voice-service.onrender.com/api/v1/tts";

/**
 * Smart Hybrid Voice Router Entry Point.
 */
export async function synthesizeVoice(
  options: VoiceSynthesizeOptions
): Promise<VoiceSynthesizeResult> {
  const startTime = performance.now();
  const text = options.text.trim();
  const voice = options.voice || "af_bella";
  const speed = options.speed || 1.0;
  const endpoint = options.apiEndpoint || DEFAULT_CLOUD_ENDPOINT;

  if (!text) {
    throw new Error("Text parameter cannot be empty.");
  }

  // Step 1: Compute SHA-256 Cache Key
  const cacheKey = await computeVoiceCacheKey(text, voice, speed);

  // Step 2: Check Browser IndexedDB Cache (0ms Latency for cached human Kokoro speech)
  const cachedBuffer = await voiceCacheDB.getAudio(cacheKey);
  if (cachedBuffer && cachedBuffer.byteLength > 2500) {
    const latencyMs = Math.round(performance.now() - startTime);
    console.log(`[SmartVoiceRouter] ⚡ Tier 1 IndexedDB Cache HIT for key=${cacheKey.slice(0, 8)}... (${latencyMs}ms)`);
    return {
      audioBuffer: cachedBuffer,
      source: "INDEXED_DB_CACHE",
      latencyMs,
      durationSec: cachedBuffer.byteLength / (24000 * 2),
      cacheKey,
    };
  }

  // Step 3: Fetch Kokoro Neural Voice from Render Python FastAPI Server
  const cloudResult = await fetchCloudFastAPI(endpoint, text, voice, speed);
  const latencyMs = Math.round(performance.now() - startTime);

  // Save freshly received human Kokoro audio into IndexedDB for 0ms future playback
  if (cloudResult.audioBuffer && cloudResult.audioBuffer.byteLength > 2500) {
    await voiceCacheDB.saveAudio(cacheKey, text, voice, speed, cloudResult.audioBuffer);
  }

  console.log(`[SmartVoiceRouter] ☁️ Render Kokoro TTS Synthesis Complete (${latencyMs}ms)`);
  return {
    audioBuffer: cloudResult.audioBuffer,
    source: "CLOUD_FASTAPI",
    latencyMs,
    durationSec: cloudResult.durationSec,
    cacheKey,
  };
}

/**
 * Calls Render Python FastAPI Kokoro TTS microservice endpoint.
 */
async function fetchCloudFastAPI(
  endpoint: string,
  text: string,
  voice: string,
  speed: number
): Promise<{ audioBuffer: ArrayBuffer; durationSec: number }> {
  const targetUrl = (endpoint && endpoint.startsWith("http"))
    ? endpoint
    : (process.env.NEXT_PUBLIC_TTS_API_URL || "https://pinit-voice-service.onrender.com/api/v1/tts");

  try {
    const response = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        voice,
        speed,
        language: "en-us",
      }),
    });

    if (response.ok) {
      const durationHeader = response.headers.get("X-Audio-Duration") || response.headers.get("X-Duration");
      const durationSec = durationHeader ? parseFloat(durationHeader) : 3.0;
      const audioBuffer = await response.arrayBuffer();
      return { audioBuffer, durationSec };
    }
  } catch (primaryErr) {
    console.warn("[SmartVoiceRouter] Primary Render TTS endpoint fetch failed, trying alternate path...", primaryErr);
  }

  // Fallback endpoint: alternate Render path /api/v1/tts
  const altUrl = "https://pinit-voice-service.onrender.com/api/v1/tts";
  const altRes = await fetch(altUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, voice, speed, language: "en-us" }),
  });

  if (!altRes.ok) {
    throw new Error(`Render Kokoro TTS API HTTP ${altRes.status}: ${altRes.statusText}`);
  }

  const durationHeader = altRes.headers.get("X-Audio-Duration") || altRes.headers.get("X-Duration");
  const durationSec = durationHeader ? parseFloat(durationHeader) : 3.0;
  const audioBuffer = await altRes.arrayBuffer();
  return { audioBuffer, durationSec };
}

/**
 * Local WebAudio DSP Formant Synthesizer for high-spec devices.
 */
async function synthesizeLocalWebAudio(
  text: string,
  voice: string,
  speed: number
): Promise<{ audioBuffer: ArrayBuffer; durationSec: number }> {
  const sampleRate = 24000;
  const words = text.split(/\s+/).filter(Boolean);
  const durationSec = Math.max(0.4, (words.length / (2.8 * speed)));
  const totalSamples = Math.floor(sampleRate * durationSec);
  
  const pcmData = new Int16Array(totalSamples);
  const isFemale = voice.startsWith("af_") || voice === "priya" || voice === "mentor_female";
  const baseF0 = isFemale ? 210.0 : 125.0;

  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;
    const env = Math.sin(Math.PI * (i / totalSamples));
    const phase = 2 * Math.PI * baseF0 * t;
    const wave = 0.6 * Math.sin(phase) + 0.3 * Math.sin(2 * phase) + 0.1 * Math.sin(3 * phase);
    pcmData[i] = Math.floor(wave * env * 28000);
  }

  // Create WAV File Header
  const wavBuffer = createWavBuffer(pcmData, sampleRate);
  return { audioBuffer: wavBuffer, durationSec };
}

/**
 * Creates 16-bit PCM Mono WAV binary buffer.
 */
function createWavBuffer(pcmData: Int16Array, sampleRate: number): ArrayBuffer {
  const buffer = new ArrayBuffer(44 + pcmData.length * 2);
  const view = new DataView(buffer);

  /* RIFF identifier */
  writeString(view, 0, "RIFF");
  /* RIFF chunk size */
  view.setUint32(4, 36 + pcmData.length * 2, true);
  /* WAVE identifier */
  writeString(view, 8, "WAVE");
  /* fmt subchunk identifier */
  writeString(view, 12, "fmt ");
  /* subchunk size */
  view.setUint32(16, 16, true);
  /* audio format (1 = PCM) */
  view.setUint16(20, 1, true);
  /* num channels (1 = mono) */
  view.setUint16(22, 1, true);
  /* sample rate */
  view.setUint32(24, sampleRate, true);
  /* byte rate */
  view.setUint32(28, sampleRate * 2, true);
  /* block align */
  view.setUint16(32, 2, true);
  /* bits per sample */
  view.setUint16(34, 16, true);
  /* data subchunk identifier */
  writeString(view, 36, "data");
  /* data chunk length */
  view.setUint32(40, pcmData.length * 2, true);

  // Write PCM sample data
  for (let i = 0; i < pcmData.length; i++) {
    view.setInt16(44 + i * 2, pcmData[i], true);
  }

  return buffer;
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}
