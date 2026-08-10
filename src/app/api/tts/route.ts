import { NextRequest, NextResponse } from 'next/server';

/**
 * PinIT Voice Cache — Next.js TTS Route
 * Upgraded from voice-service/api_tts_route.ts
 *
 * 4-Tier Cache Architecture:
 *   Tier 0 → Static pre-rendered files (handled client-side in voiceCache.ts)
 *   Tier 1 → Browser IndexedDB (handled client-side in voiceCache.ts)
 *   Tier 2 → Redis via FastAPI backend cache lookup   ← THIS ROUTE HANDLES
 *   Tier 3 → Kokoro / Premium TTS generation          ← THIS ROUTE HANDLES
 *
 * The client (voiceCache.ts) already handles Tier 0 and 1 before ever
 * reaching this route, so we only deal with Tier 2 and 3 here.
 */

const BACKEND_URL = process.env.NEXT_PUBLIC_TTS_API_URL ? process.env.NEXT_PUBLIC_TTS_API_URL.replace(/\/api\/.*$/, '') : 'https://pinit-voice-service.onrender.com';
const CDN_URL = process.env.NEXT_PUBLIC_CDN_VOICE_URL || '';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      text,
      voice = 'af_heart',
      language = 'en',
      speed = 1.0,
      emotion = 'neutral',
      version = 'v2.0',
      sample_rate = 24000,
      context = 'avatar',
      cacheKey,           // pre-computed SHA256 from client (optional optimisation)
    } = body;

    if (!text?.trim()) {
      return NextResponse.json({ error: 'Text is required.' }, { status: 400 });
    }

    // ── Tier 2: CDN Bucket check (optional — for multi-server setups) ─────────
    if (CDN_URL && cacheKey) {
      const cdnUrl = `${CDN_URL}/${language}/${cacheKey}.mp3`;
      try {
        const cdnCheck = await fetch(cdnUrl, { method: 'HEAD' });
        if (cdnCheck.ok) {
          const audioRes = await fetch(cdnUrl);
          const audioBuffer = await audioRes.arrayBuffer();
          return new NextResponse(audioBuffer, {
            status: 200,
            headers: {
              'Content-Type': 'audio/mpeg',
              'X-Cache-Status': 'CDN_HIT',
              'X-Cache-Key': cacheKey,
              'Cache-Control': 'public, max-age=31536000, immutable',
            },
          });
        }
      } catch {
        // CDN unreachable — continue to backend
      }
    }

    // ── Tier 3: FastAPI Backend (Redis → Kokoro generation) ───────────────────
    const backendRes = await fetch(`${BACKEND_URL}/api/v1/tts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, voice, language, speed, emotion, version, sample_rate, context }),
      // Allow up to 10s for first-time Kokoro generation
      signal: AbortSignal.timeout(10000),
    });

    if (!backendRes.ok) {
      const errText = await backendRes.text();
      console.error(`[/api/tts] Backend error: ${backendRes.status} — ${errText}`);
      return NextResponse.json(
        { error: `Voice backend error: ${backendRes.status}` },
        { status: backendRes.status },
      );
    }

    const audioBuffer = await backendRes.arrayBuffer();

    // Forward cache metadata headers from backend to client
    const cacheStatus = backendRes.headers.get('X-Cache-Status') ?? 'GENERATED';
    const returnedKey = backendRes.headers.get('X-Cache-Key') ?? cacheKey ?? '';
    const engine      = backendRes.headers.get('X-Engine') ?? 'kokoro';
    const duration    = backendRes.headers.get('X-Duration') ?? '0';
    const contentType = backendRes.headers.get('Content-Type') ?? 'audio/wav';

    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'X-Cache-Status': cacheStatus,
        'X-Cache-Key':   returnedKey,
        'X-Engine':      engine,
        'X-Duration':    duration,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });

  } catch (err: any) {
    // Timeout or network error — client will fall back to WebSpeech
    const isTimeout = err?.name === 'TimeoutError' || err?.name === 'AbortError';
    console.error(`[/api/tts] ${isTimeout ? 'Timeout' : 'Error'}: ${err.message}`);
    return NextResponse.json(
      { error: isTimeout ? 'Voice server timeout' : (err.message || 'Internal error') },
      { status: isTimeout ? 408 : 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({ status: 'PinIT TTS route active' });
}
