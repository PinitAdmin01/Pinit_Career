"""
SHA256 hash service for voice cache key generation.

The key is computed from ALL parameters that affect audio output.
Changing any single field automatically creates a different cache key.

Hash payload:
  pinit_v2::{voice}::{language}::{speed:.2f}::{emotion}::{version}::{sample_rate}::{normalized_text}

NOTE: This format must stay in sync with:
  - src/lib/voiceCacheDB.ts → computeVoiceCacheKey()
  For the frontend we only use voice+speed+text (language/emotion/version are
  backend-only concerns), but the backend key always includes all fields.
"""

import hashlib
from app.utils.text_utils import normalize_text


def compute_cache_key(
    text: str,
    voice: str,
    language: str = "en",
    speed: float = 1.0,
    emotion: str = "neutral",
    version: str = "v2.0",
    sample_rate: int = 24000,
) -> str:
    """
    Compute a deterministic SHA256 cache key for the given TTS parameters.
    ALL parameters that affect audio output are included in the payload.

    Example:
      compute_cache_key("Welcome to PinIT", "af_heart") → "49d61f8c..."

    Returns:
      64-character hex string (SHA256)
    """
    normalized = normalize_text(text)

    # Canonical payload — includes every parameter that changes the output audio.
    # Order matters for reproducibility across restarts and deployments.
    payload = (
        f"pinit_v2::{voice.lower()}::{language.lower()}::{speed:.2f}"
        f"::{emotion.lower()}::{version}::{sample_rate}::{normalized}"
    )

    return hashlib.sha256(payload.encode("utf-8")).hexdigest()


def compute_sentence_keys(
    sentences: list[str],
    voice: str,
    language: str = "en",
    speed: float = 1.0,
    emotion: str = "neutral",
    version: str = "v2.0",
    sample_rate: int = 24000,
) -> list[dict]:
    """
    Compute cache keys for a list of sentences.
    Used by /api/tts for chunk-level analysis and pre-generation.

    Returns:
      List of { original_sentence, normalized, cache_key } dicts
    """
    results = []
    for sentence in sentences:
        normalized = normalize_text(sentence)
        if not normalized:
            continue
        key = compute_cache_key(sentence, voice, language, speed, emotion, version, sample_rate)
        results.append({
            "original_sentence": sentence,
            "normalized": normalized,
            "cache_key": key,
        })
    return results
