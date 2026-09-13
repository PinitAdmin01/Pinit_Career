import { NextRequest, NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { checkRateLimit, getClientIp } from '@/lib/server/rateLimit';

export const maxDuration = 30; // 30s timeout

export const MAX_STT_BYTES = 10 * 1024 * 1024; // 10MB — sufficient for 10-min audio
export const MIN_STT_BYTES = 1024; // 1KB

export const ALLOWED_MIME_PREFIXES = [
  'audio/webm',
  'audio/mp4',
  'audio/wav',
  'audio/ogg',
  'audio/aac',
  'audio/x-wav',
  'audio/mpeg',
  'audio/mp3',
  'video/webm',
];

// ── Observability & Health Metrics ──────────────────────────────────────────
export interface SttMetrics {
  totalFailures: number;
  consecutiveFailures: number;
  lastFailureTime: string | null;
  lastFailureReason: string | null;
  lastFailureEngine: string | null;
}

const sttMetrics: SttMetrics = {
  totalFailures: 0,
  consecutiveFailures: 0,
  lastFailureTime: null,
  lastFailureReason: null,
  lastFailureEngine: null,
};

export function getSttMetrics(): SttMetrics {
  return { ...sttMetrics };
}

export function resetSttMetrics(): void {
  sttMetrics.totalFailures = 0;
  sttMetrics.consecutiveFailures = 0;
  sttMetrics.lastFailureTime = null;
  sttMetrics.lastFailureReason = null;
  sttMetrics.lastFailureEngine = null;
}

export function recordSttFailure(engine: string, reason: string, status?: number) {
  sttMetrics.totalFailures += 1;
  sttMetrics.consecutiveFailures += 1;
  sttMetrics.lastFailureTime = new Date().toISOString();
  sttMetrics.lastFailureReason = reason;
  sttMetrics.lastFailureEngine = engine;

  // Structured JSON Log for CloudWatch / Datadog / GCP Logging
  console.error(
    JSON.stringify({
      event: 'STT_FAILURE',
      engine,
      reason,
      status: status || 500,
      consecutiveFailures: sttMetrics.consecutiveFailures,
      totalFailures: sttMetrics.totalFailures,
      timestamp: sttMetrics.lastFailureTime,
    })
  );

  // Sentry / Exception Capture
  try {
    const Sentry = (globalThis as any).Sentry;
    if (Sentry && typeof Sentry.captureException === 'function') {
      Sentry.captureException(new Error(`[STT_${engine}] ${reason}`), {
        tags: { engine, endpoint: '/api/stt' },
        extra: { status, consecutiveFailures: sttMetrics.consecutiveFailures },
      });
    }
  } catch {
    // Sentry capture failure should never throw
  }
}

export function recordSttSuccess() {
  sttMetrics.consecutiveFailures = 0;
}

/**
 * Validates leading magic bytes of candidate audio container formats.
 */
export function validateAudioMagicBytes(buffer: Uint8Array): boolean {
  if (buffer.length < 4) return false;

  // WebM / Matroska (EBML header): 1A 45 DF A3
  if (buffer[0] === 0x1a && buffer[1] === 0x45 && buffer[2] === 0xdf && buffer[3] === 0xa3) {
    return true;
  }

  // RIFF container (WAV / AVI): 'RIFF'
  if (buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46) {
    return true;
  }

  // Ogg container: 'OggS'
  if (buffer[0] === 0x4f && buffer[1] === 0x67 && buffer[2] === 0x67 && buffer[3] === 0x53) {
    return true;
  }

  // MP3: ID3 header 'ID3' or MPEG audio sync frame 0xFF 0xEx/0xFx
  if (buffer[0] === 0x49 && buffer[1] === 0x44 && buffer[2] === 0x33) {
    return true;
  }
  if (buffer[0] === 0xff && (buffer[1] & 0xe0) === 0xe0) {
    return true;
  }

  // MP4 / M4A / AAC: bytes 4..7 'ftyp' or byte 0..3 'moov'
  if (buffer.length >= 8) {
    const ftyp = String.fromCharCode(buffer[4], buffer[5], buffer[6], buffer[7]);
    if (ftyp === 'ftyp' || ftyp === 'moov') {
      return true;
    }
  }

  // FLAC: 'fLaC'
  if (buffer[0] === 0x66 && buffer[1] === 0x4c && buffer[2] === 0x61 && buffer[3] === 0x43) {
    return true;
  }

  return false;
}

export async function POST(req: NextRequest) {
  try {
    // ── Rate Limiting (must be FIRST, before auth) ─────────────────────────
    const clientIp = getClientIp(req);
    const rateCheck = checkRateLimit(`stt_${clientIp}`, { limit: 20, windowMs: 60_000 });
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'TOO_MANY_REQUESTS', message: 'STT rate limit exceeded. Max 20 requests/min.' },
        { status: 429, headers: { 'Retry-After': String(rateCheck.resetSec) } }
      );
    }

    // ── Auth Gate ──────────────────────────────────────────────────────────
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;

    const formData = await req.formData();
    const file = formData.get('file') as Blob | null;
    const requestedMime = (formData.get('mimeType') as string) || file?.type || 'audio/webm';

    if (!file || file.size === 0) {
      return NextResponse.json(
        { error: 'Audio file is required and cannot be empty.' },
        { status: 400 }
      );
    }

    // Size bounds check
    if (file.size < MIN_STT_BYTES) {
      return NextResponse.json(
        { error: 'INVALID_AUDIO_PAYLOAD', message: 'Audio file must be at least 1KB.' },
        { status: 415 }
      );
    }

    if (file.size > MAX_STT_BYTES) {
      return NextResponse.json(
        {
          error: 'PAYLOAD_TOO_LARGE',
          message: 'Audio file exceeds 25MB limit. Please keep response under 10 minutes.',
        },
        { status: 413 }
      );
    }

    // MIME type allowlist check
    const isAllowedMime = ALLOWED_MIME_PREFIXES.some(prefix =>
      requestedMime.toLowerCase().startsWith(prefix)
    );
    if (!isAllowedMime) {
      return NextResponse.json(
        { error: 'UNSUPPORTED_MEDIA_TYPE', message: `Unsupported audio MIME type: ${requestedMime}` },
        { status: 415 }
      );
    }

    // Magic bytes inspection
    const arrayBuffer = await file.arrayBuffer();
    const headerBytes = new Uint8Array(arrayBuffer.slice(0, 16));
    if (!validateAudioMagicBytes(headerBytes)) {
      return NextResponse.json(
        {
          error: 'UNSUPPORTED_MEDIA_TYPE',
          message: 'File header magic bytes do not match a valid audio container.',
        },
        { status: 415 }
      );
    }

    const backendUrl = process.env.STT_API_URL || process.env.NEXT_PUBLIC_STT_API_URL || '';

    // 1. Try Groq Whisper with Multi-Key Rotation Pool
    const keysStr = process.env.GROQ_API_KEYS || process.env.GROQ_API_KEY || '';
    const groqKeys = keysStr
      .split(',')
      .map((k: string) => k.trim())
      .filter(Boolean);

    for (let i = 0; i < groqKeys.length; i++) {
      const key = groqKeys[i];
      try {
        const groqForm = new FormData();
        groqForm.append('file', file, 'speech.webm');
        groqForm.append('model', 'whisper-large-v3');
        groqForm.append('language', 'en');

        const groqRes = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
          method: 'POST',
          headers: { Authorization: `Bearer ${key}` },
          body: groqForm,
          signal: AbortSignal.timeout(15000),
        });

        if (groqRes.ok) {
          const data = await groqRes.json();
          recordSttSuccess();
          return NextResponse.json({
            text: (data.text || '').trim(),
            confidence: 0.97,
            engine: 'groq-whisper-large-v3',
            durationSec: data.duration || 0,
          });
        }

        // Cycle upon rate limits (429) or server errors (5xx)
        if (groqRes.status === 429 || groqRes.status >= 500) {
          recordSttFailure(
            'groq-whisper',
            `Key ${i + 1}/${groqKeys.length} returned HTTP ${groqRes.status}`,
            groqRes.status
          );
          continue; // Try next key
        } else {
          // Other client errors (e.g. 401, 400)
          recordSttFailure(
            'groq-whisper',
            `Key ${i + 1}/${groqKeys.length} failed with HTTP ${groqRes.status}`,
            groqRes.status
          );
        }
      } catch (groqErr: any) {
        recordSttFailure(
          'groq-whisper',
          `Key ${i + 1}/${groqKeys.length} network error: ${groqErr?.message || String(groqErr)}`
        );
      }
    }

    // 2. If external Whisper/Vosk server endpoint is configured
    if (backendUrl) {
      try {
        const backendForm = new FormData();
        backendForm.append('file', file, 'audio.webm');

        const backendRes = await fetch(`${backendUrl}/transcribe`, {
          method: 'POST',
          body: backendForm,
          signal: AbortSignal.timeout(15000),
        });

        if (backendRes.ok) {
          const result = await backendRes.json();
          recordSttSuccess();
          return NextResponse.json({
            text: result.text || '',
            confidence: result.confidence || 0.95,
            engine: 'whisper-server',
            durationSec: result.duration || 0,
          });
        } else {
          recordSttFailure(
            'whisper-server',
            `External endpoint returned HTTP ${backendRes.status}`,
            backendRes.status
          );
        }
      } catch (backendErr: any) {
        recordSttFailure(
          'whisper-server',
          `External endpoint network failure: ${backendErr?.message || String(backendErr)}`
        );
      }
    }

    // 3. Fallback: Fail-Fast Error Reporting (NO FABRICATED SYNTHETIC TEXT)
    recordSttFailure('all-providers', 'All transcription providers exhausted or unreachable', 503);

    return NextResponse.json(
      {
        error: 'STT_FAILED',
        message: 'Audio processing unavailable. Please type your response.',
        retryable: true,
      },
      { status: 503 }
    );
  } catch (err: any) {
    recordSttFailure('stt-route-root', err.message || 'Internal STT server error', 500);
    return NextResponse.json({ error: err.message || 'Internal STT server error' }, { status: 500 });
  }
}
