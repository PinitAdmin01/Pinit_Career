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
  bypassCache?: boolean;
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
let activeWakePromise: Promise<boolean> | null = null;
const inFlightCloudRequests = new Map<string, Promise<{ audioBuffer: ArrayBuffer; durationSec: number; engine?: string }>>();

/** Free-tier Render sleeps ~15m — keep a generous client timeout. */
const FREE_TIER_TIMEOUT_MS = 90_000;
const PREMIUM_TIMEOUT_MS = 25_000;

/**
 * Non-blocking / blocking wake-up ping for Render Free Tier.
 * Uses silent mode to prevent Chrome CORS red errors during container boot.
 */
export async function pingRenderServer(waitForWarm = false): Promise<boolean> {
  if (isServerWarm && Date.now() - lastWarmAt < 10 * 60 * 1000) return true;
  if (activeWakePromise) return activeWakePromise;

  activeWakePromise = (async () => {
    isServerWarming = true;
    const endpoint = DEFAULT_CLOUD_ENDPOINT;
    const health = healthUrlFromTts(endpoint);
    const timeoutMs = waitForWarm ? FREE_TIER_TIMEOUT_MS : 8_000;

    const tryPing = async (mode: "cors" | "no-cors") => {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      try {
        const res = await fetch(health, { method: "GET", mode, signal: controller.signal });
        clearTimeout(timer);
        if (mode === "no-cors" || res.ok) {
          isServerWarm = true;
          lastWarmAt = Date.now();
          console.log("[SmartVoiceRouter] Render voice service is warm.");
          return true;
        }
      } catch {
        clearTimeout(timer);
      }
      return false;
    };

    // Try standard CORS ping first, silent no-cors fallback if container is booting
    let ok = await tryPing("cors");
    if (!ok) {
      ok = await tryPing("no-cors");
    }

    isServerWarming = false;
    activeWakePromise = null;
    return ok;
  })();

  return activeWakePromise;
}

// 9-minute client heartbeat to prevent Render 15-minute sleep policy.
// Registered once per page load; cleared on page unload to avoid accumulation.
if (typeof window !== "undefined") {
  // Guard against hot-module-reload registering a second interval
  const WIN = window as any;
  if (!WIN.__pinit_heartbeat_id) {
    WIN.__pinit_heartbeat_id = setInterval(() => {
      void pingRenderServer(false);
    }, 9 * 60 * 1000);

    window.addEventListener("beforeunload", () => {
      clearInterval(WIN.__pinit_heartbeat_id);
      WIN.__pinit_heartbeat_id = null;
    }, { once: true });
  }
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

  if (!options.bypassCache) {
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
  } else {
    console.log(`[SmartVoiceRouter] Bypassing IndexedDB & Server cache for fresh TTS generation.`);
  }

  // Wake free-tier instance before synthesis (blocks until warm or timeout)
  if (CURRENT_RENDER_TIER === "free") {
    await pingRenderServer(true);
  } else {
    void pingRenderServer(false);
  }

  const cloudResult = await fetchCloudFastAPI(endpoint, text, voice, speed, options.bypassCache);
  const latencyMs = Math.round(performance.now() - startTime);

  if (!options.bypassCache && cloudResult.audioBuffer && cloudResult.audioBuffer.byteLength > 800) {
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
  speed: number,
  bypassCache?: boolean
): Promise<{ audioBuffer: ArrayBuffer; durationSec: number; engine?: string }> {
  const requestKey = `${endpoint}::${voice}::${speed}::${text}::bypass=${Boolean(bypassCache)}`;
  if (inFlightCloudRequests.has(requestKey)) {
    return await inFlightCloudRequests.get(requestKey)!;
  }

  const cloudPromise = (async () => {
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
        const headers: Record<string, string> = { "Content-Type": "application/json" };
        if (bypassCache) {
          headers["X-Bypass-Cache"] = "true";
        }
        const response = await fetch(url, {
          method: "POST",
          headers,
          body: JSON.stringify({ text, voice, speed, language: "en-us", bypass_cache: Boolean(bypassCache) }),
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
      await pingRenderServer(true);
      return await attempt(DEFAULT_CLOUD_ENDPOINT);
    } finally {
      inFlightCloudRequests.delete(requestKey);
    }
  })();

  inFlightCloudRequests.set(requestKey, cloudPromise);
  return await cloudPromise;
}
