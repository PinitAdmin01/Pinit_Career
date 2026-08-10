"""
SHA256 hash service for voice cache key generation.

The key is computed from ALL parameters that affect audio output.
Changing any single field automatically creates a different cache key.

Hash payload:
  text (normalized) + voice + language + speed + emotion + version + sample_rate
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

    Example:
      compute_cache_key("Welcome to PinIT", "af_heart") → "49d61f8c..."

    Returns:
      64-character hex string (SHA256)
    """
    normalized = normalize_text(text)

    # Canonical payload — order matters for reproducibility across client and backend
    payload = f"pinit_v2::{voice.lower()}::{speed:.2f}::{normalized}"

    return hashlib.sha256(payload.encode("utf-8")).hexdigest()


def compute_sentence_keys(
    sentences: list[str],
    voice: str,
    language: str = "en",
    speed: float = 1.0,
    emotion: str = "neutral",
    version: str = "v2.0",
) -> list[dict]:
    """
    Compute cache keys for a list of sentences.
    Used by /api/tts for chunk-level analysis and pre-generation.

    Returns:
      List of { original, normalized, cache_key } dicts
    """
    results = []
    for sentence in sentences:
        normalized = normalize_text(sentence)
        if not normalized:
            continue
        key = compute_cache_key(sentence, voice, language, speed, emotion, version)
        results.append({
            "original_sentence": sentence,
            "normalized": normalized,
            "cache_key": key,
        })
    return results
