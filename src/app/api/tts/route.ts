import { NextRequest, NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';

/**
 * PinIT Voice Cache — Next.js TTS Route
 *
 * Auth is required. Guest synthesis is not allowed (prevents open proxy abuse).
 */

const BACKEND_URL = process.env.NEXT_PUBLIC_TTS_API_URL
  ? process.env.NEXT_PUBLIC_TTS_API_URL.replace(/\/api\/.*$/, '')
  : 'https://pinit-voice-service.onrender.com';
const CDN_URL = process.env.NEXT_PUBLIC_CDN_VOICE_URL || '';

export async function POST(req: NextRequest) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;

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
      cacheKey,
    } = body;

    if (!text?.trim()) {
      return NextResponse.json({ error: 'Text is required.' }, { status: 400 });
    }

    console.log(`[/api/tts] Incoming proxy request -> user=${gated.user.id} | voice=${voice} | textLen=${text.length} | context=${context}`);

    if (CDN_URL && cacheKey) {
      const cdnUrl = `${CDN_URL}/${language}/${cacheKey}.mp3`;
      try {
        const cdnCheck = await fetch(cdnUrl, { method: 'HEAD' });
        if (cdnCheck.ok) {
          console.log(`[/api/tts] CDN HIT for key ${cacheKey}`);
          const audioRes = await fetch(cdnUrl);
          const audioBuffer = await audioRes.arrayBuffer();
          return new NextResponse(audioBuffer, {
            status: 200,
            headers: {
              'Content-Type': 'audio/mpeg',
              'X-Cache-Status': 'CDN_HIT',
              'X-Cache-Key': cacheKey,
              'Cache-Control': 'private, max-age=3600',
            },
          });
        }
      } catch (cdnErr: any) {
        console.warn(`[/api/tts] CDN lookup failed: ${cdnErr?.message}`);
      }
    }

    const ttsStart = Date.now();
    const backendUrl = `${BACKEND_URL}/api/tts`;
    console.log(`[/api/tts] Forwarding to Python Backend: ${backendUrl}`);

    const backendRes = await fetch(backendUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, voice, language, speed, emotion, version, sample_rate, context }),
      signal: AbortSignal.timeout(35000),
    });

    const roundtripMs = Date.now() - ttsStart;

    if (!backendRes.ok) {
      const errText = await backendRes.text();
      console.error(`[/api/tts] Backend returned error status ${backendRes.status} (${roundtripMs}ms):`, errText.slice(0, 300));
      return NextResponse.json(
        { error: `Voice backend error: ${backendRes.status}`, details: errText.slice(0, 180) },
        { status: backendRes.status },
      );
    }

    const audioBuffer = await backendRes.arrayBuffer();
    const cacheStatus = backendRes.headers.get('X-Cache-Status') ?? 'GENERATED';
    const returnedKey = backendRes.headers.get('X-Cache-Key') ?? cacheKey ?? '';
    const engine = backendRes.headers.get('X-Engine') ?? 'kokoro';
    const duration = backendRes.headers.get('X-Duration') ?? '0';
    const contentType = backendRes.headers.get('Content-Type') ?? 'audio/wav';

    console.log(`[/api/tts] Backend Response SUCCESS (${roundtripMs}ms) -> Status: ${cacheStatus} | Engine: ${engine} | Bytes: ${audioBuffer.byteLength}`);

    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'X-Cache-Status': cacheStatus,
        'X-Cache-Key': returnedKey,
        'X-Engine': engine,
        'X-Duration': duration,
        'Cache-Control': 'private, max-age=3600',
      },
    });
  } catch (err: any) {
    const isTimeout = err?.name === 'TimeoutError' || err?.name === 'AbortError';
    console.error(`[/api/tts] Proxy Execution Failure (${isTimeout ? 'TIMEOUT 35s' : 'ERROR'}):`, err?.message || err);
    return NextResponse.json(
      { error: isTimeout ? 'Voice server cold-start timeout (35s)' : (err.message || 'Internal error') },
      { status: isTimeout ? 408 : 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({ status: 'PinIT TTS route active', auth: 'required' });
}
