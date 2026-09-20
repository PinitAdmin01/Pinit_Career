"""
TTS Service — Kokoro 82M Neural Engine + Real Voice Service Proxy.

Architecture:
  - generate_kokoro(): Proxies to the live internal voice service (http://localhost:3005/api/v1/tts)
    via httpx. Returns real neural Kokoro-82M audio.
  - generate_premium(): Routes through the same voice service for interview-grade quality.
  - save_audio(): Saves generated audio to disk storage/{lang}/{key}.wav

NO local sine wave simulation. All speech routes through the real neural engine.
"""

import os
import io
import httpx
from dataclasses import dataclass
from typing import Optional

# ── Voice Service Configuration ───────────────────────────────────────────────
# The real neural TTS engine runs as a separate microservice at VOICE_SERVICE_URL.
# Default: http://localhost:3005 (voice-service/main.py)
VOICE_SERVICE_URL = os.getenv("VOICE_SERVICE_URL", "http://localhost:3005")
VOICE_SERVICE_SECRET = os.getenv("VOICE_SERVICE_SECRET", "")  # optional internal auth

# Storage directory
AUDIO_STORAGE_DIR = os.getenv(
    "AUDIO_STORAGE_DIR",
    os.path.join(os.path.dirname(__file__), "..", "..", "..", "storage", "audio"),
)

# Sample rate used for all Kokoro output
DEFAULT_SAMPLE_RATE = 24000


@dataclass
class TTSResult:
    audio_bytes: bytes
    duration: float
    sample_rate: int
    engine: str = "kokoro-real"
    format: str = "wav"


# ── Voice Service Proxy ───────────────────────────────────────────────────────

async def _call_voice_service(
    text: str,
    voice: str = "af_heart",
    language: str = "en",
    speed: float = 1.0,
    endpoint: str = "/api/v1/tts",
) -> TTSResult:
    """
    Call the live voice service for neural TTS generation.
    Returns real Kokoro-82M audio or raises an exception if unavailable.
    """
    url = f"{VOICE_SERVICE_URL}{endpoint}"
    headers = {"Content-Type": "application/json"}
    if VOICE_SERVICE_SECRET:
        headers["Authorization"] = f"Bearer {VOICE_SERVICE_SECRET}"

    payload = {
        "text": text,
        "voice": voice,
        "speed": speed,
        "bypass_cache": False,
    }

    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(url, headers=headers, json=payload)

    if response.status_code != 200:
        error_detail = response.text[:200] if response.text else "Unknown error"
        raise RuntimeError(f"Voice service returned {response.status_code}: {error_detail}")

    # Extract audio duration and latency from headers
    duration = float(response.headers.get("X-Audio-Duration", "0.0"))
    latency_ms = response.headers.get("X-Inference-Latency-MS", "0")
    cache_status = response.headers.get("X-Cache-Status", "SYNTHESIZED")

    audio_bytes = response.content
    if not audio_bytes:
        raise RuntimeError("Voice service returned empty audio payload")

    return TTSResult(
        audio_bytes=audio_bytes,
        duration=duration,
        sample_rate=DEFAULT_SAMPLE_RATE,
        engine="kokoro-real",
    )


async def generate_kokoro(
    text: str,
    voice: str = "af_heart",
    language: str = "en",
    speed: float = 1.0,
    emotion: str = "neutral",
    sample_rate: int = DEFAULT_SAMPLE_RATE,
) -> TTSResult:
    """
    Generate audio by proxying to the live voice service (real Kokoro-82M ONNX).

    Args:
        text: Text to synthesize
        voice: Voice ID (e.g., "af_heart", "am_michael", "priya")
        language: Language code (currently "en")
        speed: Speech speed multiplier (0.5-2.0)
        emotion: Emotional tone hint (neutral, teaching, motivational)
        sample_rate: Output sample rate (24000)

    Returns:
        TTSResult with real neural engine audio.

    Raises:
        RuntimeError: If voice service is unreachable or returns an error.
        The caller should catch this and return HTTP 503 to the student.
    """
    try:
        return await _call_voice_service(text, voice, language, speed, "/api/v1/tts")
    except httpx.ConnectError as e:
        raise RuntimeError(f"Voice engine unreachable: {e}")
    except httpx.TimeoutException:
        raise RuntimeError("Voice engine request timed out")
    except httpx.HTTPStatusError as e:
        raise RuntimeError(f"Voice engine error ({e.response.status_code})")


# ── Premium TTS (Routed 100% to Neural Kokoro) ──────────────────────────────

async def generate_premium(
    text: str,
    voice: str = "af_heart",
    language: str = "en",
    speed: float = 1.0,
) -> TTSResult:
    """
    All speech routes 100% through the neural Kokoro-82M engine via the voice service.
    Zero external ElevenLabs API dependencies.
    """
    return await generate_kokoro(
        text=text,
        voice=voice,
        language=language,
        speed=speed,
        emotion="neutral",
    )


# ── Disk Storage ──────────────────────────────────────────────────────────────

def save_audio(
    audio_bytes: bytes,
    cache_key: str,
    language: str = "en",
    fmt: str = "wav",
) -> str:
    """
    Save audio to disk under storage/audio/{language}/{cache_key}.{fmt}
    Returns the relative path stored in Redis.
    """
    lang_dir = os.path.join(AUDIO_STORAGE_DIR, language)
    os.makedirs(lang_dir, exist_ok=True)

    filename = f"{cache_key}.{fmt}"
    filepath = os.path.join(lang_dir, filename)

    with open(filepath, "wb") as f:
        f.write(audio_bytes)

    return os.path.join(language, filename)  # relative path for Redis storage


def get_audio_path(relative_path: str) -> Optional[str]:
    """Return absolute path to a stored audio file, or None if not found."""
    abs_path = os.path.join(AUDIO_STORAGE_DIR, relative_path)
    return abs_path if os.path.isfile(abs_path) else None


# ── Offline Fallback Message ──────────────────────────────────────────────────

OFFLINE_FALLBACK_MESSAGE = (
    "The live AI voice engine is temporarily unavailable. "
    "Please try again in a moment, or continue with text-based guidance."
)

def get_offline_fallback() -> TTSResult:
    """
    Return a minimal silent WAV with metadata indicating offline status.
    Caller should set HTTP 503 and include X-Voice-Status: OFFLINE header.
    """
    # 100ms of silence at 24kHz
    import struct
    silence_samples = int(DEFAULT_SAMPLE_RATE * 0.1)
    wav_header = struct.pack(
        '<4sI4s4sIHHIIHH4sI',
        b'RIFF', 36 + silence_samples * 2, b'WAVE',
        b'fmt ', 16, 1, 1, DEFAULT_SAMPLE_RATE,
        DEFAULT_SAMPLE_RATE * 2, 2, 16,
        b'data', silence_samples * 2
    )
    silence_data = b'\x00\x00' * silence_samples
    return TTSResult(
        audio_bytes=wav_header + silence_data,
        duration=0.1,
        sample_rate=DEFAULT_SAMPLE_RATE,
        engine="offline-fallback",
    )