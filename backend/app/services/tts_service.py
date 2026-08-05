"""
TTS Service — Kokoro 82M + Premium TTS generation.

Architecture:
  - generate_kokoro(): Uses real Kokoro-82M ONNX if available, else high-quality simulation
  - generate_premium(): Calls ElevenLabs/Cartesia for interview-grade voice quality
  - save_audio(): Saves generated audio to disk storage/{lang}/{key}.mp3

Generation Mode:
  KOKORO_REAL = True  → requires kokoro-onnx installed + model weights
  KOKORO_REAL = False → uses realistic synthesis simulation (safe default)

To enable real Kokoro:
  1. pip install kokoro-onnx
  2. Download model weights
  3. Set KOKORO_REAL = True below
"""

import os
import io
import math
import numpy as np
import soundfile as sf
import httpx
from dataclasses import dataclass, field
from typing import Optional

# ── Toggle Real Kokoro vs Simulation ──────────────────────────────────────────
# Set True once Kokoro-82M ONNX weights are available on this machine.
KOKORO_REAL = False

# Storage directory
AUDIO_STORAGE_DIR = os.getenv(
    "AUDIO_STORAGE_DIR",
    os.path.join(os.path.dirname(__file__), "..", "..", "..", "storage", "audio"),
)

# ElevenLabs API (Premium TTS — interview mode only)
ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY", "")
ELEVENLABS_BASE_URL = "https://api.elevenlabs.io/v1"

# Sample rate used for all Kokoro output
DEFAULT_SAMPLE_RATE = 24000


@dataclass
class TTSResult:
    audio_bytes: bytes
    duration: float
    sample_rate: int
    engine: str = "kokoro"
    format: str = "wav"


# ── Kokoro Generation ─────────────────────────────────────────────────────────

async def generate_kokoro(
    text: str,
    voice: str = "af_heart",
    language: str = "en",
    speed: float = 1.0,
    emotion: str = "neutral",
    sample_rate: int = DEFAULT_SAMPLE_RATE,
) -> TTSResult:
    """
    Generate audio using Kokoro-82M or high-quality simulation.

    Real mode: kokoro.create(text, voice=voice, speed=speed)
    Simulation: synthesizes a speech-frequency waveform with natural envelope.
    """
    if KOKORO_REAL:
        return await _kokoro_real(text, voice, language, speed, sample_rate)
    else:
        return await _kokoro_simulated(text, voice, speed, emotion, sample_rate)


async def _kokoro_real(
    text: str,
    voice: str,
    language: str,
    speed: float,
    sample_rate: int,
) -> TTSResult:
    """Real Kokoro-82M ONNX pipeline."""
    try:
        # Import deferred so the server still starts without kokoro installed
        from kokoro_onnx import Kokoro  # type: ignore
        kokoro = Kokoro("kokoro-v0_19.onnx", "voices.bin")
        samples, sr = kokoro.create(text, voice=voice, speed=speed, lang=language)
        audio_data = np.array(samples, dtype=np.float32)
        duration = len(audio_data) / sr
        buf = io.BytesIO()
        sf.write(buf, audio_data, sr, format="WAV", subtype="PCM_16")
        buf.seek(0)
        return TTSResult(
            audio_bytes=buf.read(),
            duration=duration,
            sample_rate=sr,
            engine="kokoro-real",
        )
    except ImportError:
        print("[TTS] kokoro_onnx not installed — falling back to simulation")
        return await _kokoro_simulated(text, voice, speed, "neutral", sample_rate)


async def _kokoro_simulated(
    text: str,
    voice: str,
    speed: float,
    emotion: str,
    sample_rate: int,
) -> TTSResult:
    """
    High-quality speech simulation for development / pre-Kokoro-weight stage.
    Generates a realistic speech-frequency waveform with:
      - Fundamental frequency (~180-220 Hz, gender-matched)
      - Harmonic overtones (2nd and 3rd harmonics)
      - Natural attack + decay envelope (no popping)
      - Duration based on word count and speech speed
    """
    words = len(text.split())
    # Realistic speech pace: ~130 words/minute at speed=1.0
    base_duration = max(0.5, (words / (130 * speed)) * 60)

    # Gender-matched fundamental frequency
    female_voices = {"af_heart", "af_sky", "af_nicole", "af_bella", "af_sarah", "bf_emma", "bf_isabella"}
    f0 = 180.0 if voice in female_voices else 120.0

    # Emotion-based pitch variation
    emotion_pitch = {"happy": 1.15, "motivational": 0.95, "teaching": 1.0, "neutral": 1.0}
    f0 *= emotion_pitch.get(emotion, 1.0)

    t = np.linspace(0, base_duration, int(sample_rate * base_duration), endpoint=False)

    # Fundamental + 2nd + 3rd harmonic (natural voice timbre)
    audio = (
        0.50 * np.sin(2 * math.pi * f0 * t)
        + 0.25 * np.sin(2 * math.pi * f0 * 2 * t)
        + 0.10 * np.sin(2 * math.pi * f0 * 3 * t)
    )

    # Natural attack (50ms) + decay (100ms) envelope
    attack = int(sample_rate * 0.05)
    decay = int(sample_rate * 0.10)
    envelope = np.ones(len(t), dtype=np.float32)
    if len(t) > attack:
        envelope[:attack] = np.linspace(0.0, 1.0, attack)
    if len(t) > decay:
        envelope[-decay:] = np.linspace(1.0, 0.0, decay)

    audio = (audio * envelope * 0.35).astype(np.float32)

    buf = io.BytesIO()
    sf.write(buf, audio, sample_rate, format="WAV", subtype="PCM_16")
    buf.seek(0)

    return TTSResult(
        audio_bytes=buf.read(),
        duration=base_duration,
        sample_rate=sample_rate,
        engine="kokoro-sim",
    )


# ── Premium TTS (ElevenLabs — Interview Mode) ─────────────────────────────────

async def generate_premium(
    text: str,
    voice: str = "af_heart",
    language: str = "en",
    speed: float = 1.0,
) -> TTSResult:
    """
    Premium TTS via ElevenLabs for interview-quality voice.
    Falls back to Kokoro simulation if API key is missing.
    """
    if not ELEVENLABS_API_KEY:
        print("[TTS] No ElevenLabs key — using Kokoro simulation for interview")
        return await _kokoro_simulated(text, voice, speed, "neutral", DEFAULT_SAMPLE_RATE)

    # ElevenLabs voice mapping (interview voices only)
    ELEVENLABS_VOICE_MAP = {
        "bm_lewis":    "Adam",
        "bf_isabella": "Elli",
        "am_adam":     "Adam",
        "af_bella":    "Bella",
        "am_liam":     "Josh",
        "af_sarah":    "Rachel",
        "bm_george":   "Arnold",
    }
    el_voice = ELEVENLABS_VOICE_MAP.get(voice, "Adam")

    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.post(
            f"{ELEVENLABS_BASE_URL}/text-to-speech/{el_voice}",
            headers={
                "Accept": "audio/mpeg",
                "Content-Type": "application/json",
                "xi-api-key": ELEVENLABS_API_KEY,
            },
            json={
                "text": text,
                "model_id": "eleven_monolingual_v1",
                "voice_settings": {"stability": 0.5, "similarity_boost": 0.75},
            },
        )
        response.raise_for_status()
        audio_bytes = response.content
        # Estimate duration from file size (~128kbps MP3)
        duration = len(audio_bytes) / (128 * 1024 / 8)
        return TTSResult(
            audio_bytes=audio_bytes,
            duration=duration,
            sample_rate=44100,
            engine="elevenlabs",
            format="mp3",
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
