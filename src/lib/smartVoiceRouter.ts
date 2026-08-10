/**
 * PinIT Careers AI Voice System - Smart Hybrid Voice Router
 * IndexedDB cache → Render FastAPI neural TTS (edge-tts / ONNX). No WebSpeech.
 */

import { voiceCacheDB, computeVoiceCacheKey } from "./voiceCacheDB";

export interface VoiceSynthesizeOptions {
  text: string;
  voice?: string;
  speed?: number;
  language?: string;
  apiEndpoint?: string;
}

export interface VoiceSynthesizeResult {
  audioBuffer: ArrayBuffer;
  source: "INDEXED_DB_CACHE" | "CLOUD_FASTAPI";
  latencyMs: number;
  durationSec: number;
  cacheKey: string;
  engine?: string;
}

export type RenderTier = "free" | "premium";
export const CURRENT_RENDER_TIER: RenderTier =
  (process.env.NEXT_PUBLIC_RENDER_TIER as RenderTier) || "free";

const DEFAULT_CLOUD_ENDPOINT =
  process.env.NEXT_PUBLIC_TTS_API_URL ||
  "https://pinit-voice-service.onrender.com/api/v1/tts";

function healthUrlFromTts(endpoint: string): string {
  try {
    const u = new URL(endpoint);
    // .../api/v1/tts → .../api/v1/health/live
    return `${u.origin}/api/v1/health/live`;
  } catch {
    return "https://pinit-voice-service.onrender.com/api/v1/health/live";
  }
}

let isServerWarming = false;
let isServerWarm = false;
let lastWarmAt = 0;

/** Free-tier Render sleeps ~15m — keep a generous client timeout. */
const FREE_TIER_TIMEOUT_MS = 90_000;
const PREMIUM_TIMEOUT_MS = 25_000;

/**
 * Non-blocking / blocking wake-up ping for Render Free Tier.
 */
export async function pingRenderServer(waitForWarm = false): Promise<boolean> {
  if (isServerWarm && Date.now() - lastWarmAt < 10 * 60 * 1000) return true;
  if (isServerWarming && !waitForWarm) return false;

  isServerWarming = true;
  const endpoint = DEFAULT_CLOUD_ENDPOINT;
  const health = healthUrlFromTts(endpoint);
  const timeoutMs = waitForWarm ? FREE_TIER_TIMEOUT_MS : 8_000;

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const res = await fetch(health, { method: "GET", mode: "cors", signal: controller.signal });
    clearTimeout(timer);
    if (res.ok) {
      isServerWarm = true;
      lastWarmAt = Date.now();
      isServerWarming = false;
      console.log("[SmartVoiceRouter] Render voice service is warm.");
      return true;
    }
  } catch (e) {
    console.warn("[SmartVoiceRouter] Render wake ping failed / still cold:", e);
  }
  isServerWarming = false;
  return false;
}

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

  const cacheKey = await computeVoiceCacheKey(text, voice, speed);

  const cachedBuffer = await voiceCacheDB.getAudio(cacheKey);
  if (cachedBuffer && cachedBuffer.byteLength > 800) {
    const latencyMs = Math.round(performance.now() - startTime);
    console.log(
      `[SmartVoiceRouter] IndexedDB HIT key=${cacheKey.slice(0, 8)}... (${latencyMs}ms)`
    );
    return {
      audioBuffer: cachedBuffer,
      source: "INDEXED_DB_CACHE",
      latencyMs,
      durationSec: estimateDuration(text, speed),
      cacheKey,
      engine: "cache",
    };
  }

  // Wake free-tier instance before synthesis (blocks until warm or timeout)
  if (CURRENT_RENDER_TIER === "free") {
    await pingRenderServer(true);
  } else {
    void pingRenderServer(false);
  }

  const cloudResult = await fetchCloudFastAPI(endpoint, text, voice, speed);
  const latencyMs = Math.round(performance.now() - startTime);

  if (cloudResult.audioBuffer && cloudResult.audioBuffer.byteLength > 800) {
    await voiceCacheDB.saveAudio(cacheKey, text, voice, speed, cloudResult.audioBuffer);
  }

  console.log(
    `[SmartVoiceRouter] Cloud TTS ok (${latencyMs}ms, engine=${cloudResult.engine || "unknown"})`
  );
  return {
    audioBuffer: cloudResult.audioBuffer,
    source: "CLOUD_FASTAPI",
    latencyMs,
    durationSec: cloudResult.durationSec,
    cacheKey,
    engine: cloudResult.engine,
  };
}

function estimateDuration(text: string, speed: number): number {
  return Math.max(0.6, text.length / (14.0 * Math.max(0.5, speed)));
}

async function fetchCloudFastAPI(
  endpoint: string,
  text: string,
  voice: string,
  speed: number
): Promise<{ audioBuffer: ArrayBuffer; durationSec: number; engine?: string }> {
  const targetUrl =
    endpoint && endpoint.startsWith("http")
      ? endpoint
      : DEFAULT_CLOUD_ENDPOINT;

  const timeoutMs =
    CURRENT_RENDER_TIER === "free" ? FREE_TIER_TIMEOUT_MS : PREMIUM_TIMEOUT_MS;

  const attempt = async (url: string) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, voice, speed, language: "en-us" }),
        signal: controller.signal,
      });
      clearTimeout(timer);
      if (!response.ok) {
        const errText = await response.text().catch(() => "");
        throw new Error(`TTS HTTP ${response.status}: ${errText.slice(0, 180)}`);
      }
      const durationHeader =
        response.headers.get("X-Audio-Duration") || response.headers.get("X-Duration");
      const engine = response.headers.get("X-Voice-Engine") || undefined;
      const durationSec = durationHeader
        ? parseFloat(durationHeader)
        : estimateDuration(text, speed);
      const audioBuffer = await response.arrayBuffer();
      if (!audioBuffer || audioBuffer.byteLength < 800) {
        throw new Error("TTS returned empty/too-small audio");
      }
      isServerWarm = true;
      lastWarmAt = Date.now();
      return { audioBuffer, durationSec, engine };
    } catch (e) {
      clearTimeout(timer);
      throw e;
    }
  };

  try {
    return await attempt(targetUrl);
  } catch (primaryErr) {
    console.warn("[SmartVoiceRouter] Primary TTS attempt failed, retrying once...", primaryErr);
    // One retry after another wake ping (covers cold-start race)
    await pingRenderServer(true);
    return await attempt(DEFAULT_CLOUD_ENDPOINT);
  }
}
