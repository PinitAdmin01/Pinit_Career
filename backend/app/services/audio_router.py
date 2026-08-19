"""
Voice Router — decides which TTS engine to use based on request context.

Routing Matrix:
  context = lesson | course | avatar | mission → Kokoro 82M  (95% of traffic)
  context = interview                           → Premium TTS (5% — richer voice)
  context = gd                                 → Kokoro 82M
  fallback                                     → Kokoro 82M

Why this matters:
  Interview mode is the premium experience. All other narration uses Kokoro
  to minimize cost and maximize cache efficiency.
"""

from app.services.tts_service import (
    generate_kokoro,
    generate_premium,
    TTSResult,
)
from app.models.schemas import TTSRequest


# Contexts that use premium TTS (ElevenLabs / Cartesia)
PREMIUM_CONTEXTS = {"interview"}

# Kokoro voice map — mirrors src/lib/tts.ts KOKORO_VOICE_MAP exactly
KOKORO_VOICE_MAP: dict[str, str] = {
    # Mentors
    "priya": "af_heart",
    "anish": "am_liam",
    # Teachers
    "kashyap": "am_fenrir",
    "karthic": "am_karthic",
    "maya": "bf_emma",
    "divya": "af_nicole",
    # Legacy
    "aisha": "af_sky",
    "rohan": "am_fenrir",
    # Interviewers
    "vikram": "bm_lewis",
    "shalini": "bf_isabella",
    "aditya": "am_adam",
    "neha": "af_bella",
    "rajesh": "am_liam",
    "sneha": "af_sarah",
    "abhijit": "bm_george",
}


def resolve_voice(voice: str) -> str:
    """
    Resolve a mentor/teacher name to a Kokoro voice ID.
    If already a Kokoro ID (contains _), return as-is.
    """
    if "_" in voice:
        return voice  # Already a Kokoro voice ID like af_heart
    return KOKORO_VOICE_MAP.get(voice.lower(), "af_heart")


async def route_tts(request: TTSRequest) -> TTSResult:
    """
    Route TTS request 100% to Kokoro-82M engine.
    Zero external ElevenLabs API dependency; zero cost, maximum speed.

    Args:
        request: TTSRequest with text, voice, language, context, etc.

    Returns:
        TTSResult with audio bytes, duration, and engine used.
    """
    resolved_voice = resolve_voice(request.voice)
    print(f"[AudioRouter] Routing request -> voice={resolved_voice} (requested: {request.voice}) | context={request.context} | lang={request.language}")

    # 100% — Kokoro 82M (lesson, course, avatar, mission, interview, gd, fallback)
    result = await generate_kokoro(
        text=request.text,
        voice=resolved_voice,
        language=request.language,
        speed=request.speed,
        emotion=request.emotion,
        sample_rate=request.sample_rate,
    )
    result.engine = "kokoro"
    return result
