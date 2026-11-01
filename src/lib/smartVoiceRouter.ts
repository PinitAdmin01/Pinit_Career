/**
 * PinIT Careers AI Voice System - Smart Hybrid Voice Router
 * IndexedDB cache → Render FastAPI neural TTS (edge-tts / ONNX) → WebSpeech fallback.
 */

import { voiceCacheDB, computeVoiceCacheKey } from "./voiceCacheDB";
import { VisemeEvent } from "./avatar/visemeTypes";

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
  visemes?: VisemeEvent[];
}

export type RenderTier = "free" | "premium";
export const CURRENT_RENDER_TIER: RenderTier =
  (process.env.NEXT_PUBLIC_RENDER_TIER as RenderTier) || "free";

export function normalizeTtsEndpoint(rawEndpoint?: string): string {
  const fallback = "https://pinit-voice-service.onrender.com/api/v1/tts";
  if (!rawEndpoint || !rawEndpoint.trim()) return fallback;
  const trimmed = rawEndpoint.trim().replace(/\/+$/, '');
  if (trimmed.endsWith("/api/v1/tts") || trimmed.endsWith("/api/tts") || trimmed.endsWith("/tts")) {
    return trimmed;
  }
  return `${trimmed}/api/v1/tts`;
}

export function healthUrlFromTts(endpoint: string): string {
  const base = (endpoint || "https://pinit-voice-service.onrender.com")
    .replace(/\/+$/, '')
    .replace(/\/api(\/v\d+)?\/tts\/?$/i, '')
    .replace(/\/tts\/?$/i, '');
  return `${base}/api/v1/health`;
}

const DEFAULT_CLOUD_ENDPOINT = normalizeTtsEndpoint(process.env.NEXT_PUBLIC_TTS_API_URL);

let isServerWarming = false;
let isServerWarm = false;
let isCloudDisabled = false;
let lastWarmAt = 0;
let activeWakePromise: Promise<boolean> | null = null;
const inFlightCloudRequests = new Map<string, Promise<{ audioBuffer: ArrayBuffer; durationSec: number; engine?: string; visemes?: VisemeEvent[] }>>();

/** Free-tier Render sleeps after ~15m inactivity — cold instance boot takes 15-25s. */
const FREE_TIER_TIMEOUT_MS = 25_000;
const PREMIUM_TIMEOUT_MS = 10_000;

export function notifyVoiceStatus(status: 'warming' | 'neural_ready' | 'fallback') {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('pc_voice_status_changed', { detail: { status } }));
  }
}

/**
 * Non-blocking / blocking wake-up ping for Render Free Tier.
 * Uses silent mode to prevent Chrome CORS red errors during container boot.
 */
export async function pingRenderServer(waitForWarm = false): Promise<boolean> {
  if (isCloudDisabled) return false;
  if (isServerWarm && Date.now() - lastWarmAt < 10 * 60 * 1000) return true;
  if (activeWakePromise) return activeWakePromise;

  activeWakePromise = (async () => {
    isServerWarming = true;
    notifyVoiceStatus('warming');
    const endpoint = DEFAULT_CLOUD_ENDPOINT;
    const health = healthUrlFromTts(endpoint);
    const timeoutMs = waitForWarm ? FREE_TIER_TIMEOUT_MS : 4_000;

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
          notifyVoiceStatus('neural_ready');
          return true;
        }
      } catch {
        clearTimeout(timer);
      }
      return false;
    };

    // Try standard CORS ping first, silent no-cors fallback if container is booting
    let ok = await tryPing("cors");
    if (!ok && !isCloudDisabled) {
      ok = await tryPing("no-cors");
    }

    if (!ok) {
      notifyVoiceStatus('fallback');
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
    const cachedEntry = await voiceCacheDB.getAudioEntry(cacheKey);
    if (cachedEntry && cachedEntry.audioBuffer && cachedEntry.audioBuffer.byteLength > 800) {
      const latencyMs = Math.round(performance.now() - startTime);
      console.log(
        `[SmartVoiceRouter] IndexedDB HIT key=${cacheKey.slice(0, 8)}... (${latencyMs}ms)`
      );
      return {
        audioBuffer: cachedEntry.audioBuffer,
        source: "INDEXED_DB_CACHE",
        latencyMs,
        durationSec: estimateDuration(text, speed),
        cacheKey,
        engine: "cache",
        visemes: cachedEntry.visemes,
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

  try {
    const cloudResult = await fetchCloudFastAPI(endpoint, text, voice, speed, options.bypassCache);
    const latencyMs = Math.round(performance.now() - startTime);

    if (!options.bypassCache && cloudResult.audioBuffer && cloudResult.audioBuffer.byteLength > 800) {
      await voiceCacheDB.saveAudio(cacheKey, text, voice, speed, cloudResult.audioBuffer, cloudResult.visemes);
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
      visemes: cloudResult.visemes,
    };
  } catch (renderError) {
    console.warn('[SmartVoiceRouter] Render Cloud TTS failed:', renderError);
    throw renderError;
  }
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
): Promise<{ audioBuffer: ArrayBuffer; durationSec: number; engine?: string; visemes?: VisemeEvent[] }> {
  const requestKey = `${endpoint}::${voice}::${speed}::${text}::bypass=${Boolean(bypassCache)}`;
  if (inFlightCloudRequests.has(requestKey)) {
    return await inFlightCloudRequests.get(requestKey)!;
  }

  const cloudPromise = (async () => {
    const targetUrl = normalizeTtsEndpoint(
      endpoint && endpoint.startsWith("http")
        ? endpoint
        : DEFAULT_CLOUD_ENDPOINT
    );

    const timeoutMs =
      CURRENT_RENDER_TIER === "free" ? FREE_TIER_TIMEOUT_MS : PREMIUM_TIMEOUT_MS;

    const attempt = async (url: string) => {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      try {
        const safeText = text.length > 950 ? text.slice(0, 940) + "..." : text;
        console.log(`[SmartVoiceRouter] Initiating Cloud TTS -> ${url} | Voice: ${voice} | Speed: ${speed} | TextLen: ${safeText.length}`);
        const headers: Record<string, string> = { "Content-Type": "application/json" };
        if (bypassCache) {
          headers["X-Bypass-Cache"] = "true";
        }
        const response = await fetch(url, {
          method: "POST",
          headers,
          body: JSON.stringify({ text: safeText, voice, speed, language: "en-us", bypass_cache: Boolean(bypassCache) }),
          signal: controller.signal,
        });
        clearTimeout(timer);
        if (!response.ok) {
          const errText = await response.text().catch(() => "");
          console.error(`[SmartVoiceRouter] TTS HTTP ${response.status} Error:`, errText.slice(0, 200));
          throw new Error(`TTS HTTP ${response.status}: ${errText.slice(0, 180)}`);
        }
        const durationHeader =
          response.headers.get("X-Audio-Duration") || response.headers.get("X-Duration");
        const engine = response.headers.get("X-Voice-Engine") || response.headers.get("X-Engine") || undefined;
        const visemesHeader = response.headers.get("X-Visemes");
        let visemes: VisemeEvent[] | undefined;
        if (visemesHeader) {
          try {
            visemes = JSON.parse(visemesHeader);
          } catch (e) {
            console.warn("[SmartVoiceRouter] Failed to parse X-Visemes header:", e);
          }
        }
        const durationSec = durationHeader
          ? parseFloat(durationHeader)
          : estimateDuration(text, speed);
        const audioBuffer = await response.arrayBuffer();
        if (!audioBuffer || audioBuffer.byteLength < 800) {
          console.error(`[SmartVoiceRouter] Received corrupt/short audio buffer (${audioBuffer?.byteLength || 0} bytes)`);
          throw new Error("TTS returned empty/too-small audio");
        }
        console.log(`[SmartVoiceRouter] Cloud TTS Success -> Bytes: ${audioBuffer.byteLength} | Duration: ${durationSec.toFixed(1)}s | Engine: ${engine || 'kokoro'}`);
        isServerWarm = true;
        lastWarmAt = Date.now();
        return { audioBuffer, durationSec, engine, visemes };
      } catch (e) {
        clearTimeout(timer);
        throw e;
      }
    };

    if (isCloudDisabled) {
      throw new Error("Cloud TTS disabled for session (health check unavailable)");
    }

    try {
      return await attempt(targetUrl);
    } catch (primaryErr: any) {
      if (isCloudDisabled) {
        throw primaryErr;
      }
      console.warn("[SmartVoiceRouter] Primary TTS attempt failed:", primaryErr?.message || primaryErr, "Retrying with warm ping...");
      const warm = await pingRenderServer(true);
      if (!warm || isCloudDisabled) {
        throw primaryErr;
      }
      return await attempt(DEFAULT_CLOUD_ENDPOINT);
    } finally {
      inFlightCloudRequests.delete(requestKey);
    }
  })();

  inFlightCloudRequests.set(requestKey, cloudPromise);
  return await cloudPromise;
}
