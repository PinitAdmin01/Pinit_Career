"""
Text normalization and sentence splitting utilities.
Used by hash_service and tts_service.
"""

import re
from typing import List


def normalize_text(text: str) -> str:
    """
    Normalize text for cache key generation:
    - Lowercase
    - Remove punctuation (keep word chars and spaces)
    - Collapse extra whitespace
    """
    text = text.lower()
    text = re.sub(r"[^\w\s]", "", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def split_sentences(text: str) -> List[str]:
    """
    Split paragraph into sentence-level chunks at sentence boundaries (. ! ?).
    Returns list of non-empty stripped sentences.
    """
    raw = re.split(r"(?<=[.!?])\s+", text)
    sentences = [s.strip() for s in raw if s.strip()]
    return sentences if sentences else [text.strip()]


def enhance_intonation(text: str) -> str:
    """
    Inject natural pauses (commas, ellipses) and pacing hints
    that make neural TTS sound more human.
    """
    enhanced = text

    # Natural pause before conjunctions
    enhanced = re.sub(
        r"\b(but|because|although|however|therefore)\b",
        r", \1",
        enhanced,
        flags=re.IGNORECASE,
    )

    # Replace double hyphens and colons with pause markers
    enhanced = re.sub(r"\s*--\s*", "... ", enhanced)
    enhanced = re.sub(r":\s+", "... ", enhanced)

    # Clean up double punctuation
    enhanced = re.sub(r",\s*,", ",", enhanced)
    enhanced = re.sub(r"\.\.\.\s*\.", "...", enhanced)

    return enhanced


def detect_emotion(text: str) -> str:
    """
    Detect appropriate emotion/vibe from text content.
    Returns: happy | motivational | teaching | neutral
    """
    lower = text.lower()

    if re.search(
        r"\b(congrats|congratulations|great|awesome|excellent|brilliant|correct|"
        r"success|perfect|wonderful|wow|hurray|nice job|spot on|superb|well done|"
        r"outstanding|delighted|perfectly)\b",
        lower,
    ):
        return "happy"

    if re.search(
        r"\b(try again|incorrect|wrong|mistake|no worries|keep going|almost|"
        r"close but|let's fix|correcting|improve|don't give up|challenge|difficult)\b",
        lower,
    ):
        return "motivational"

    if re.search(
        r"\b(define|definition|explanation|concept|learn|tutorial|study|exercise|"
        r"syntax|code|theory|fundamental|architect|module|lesson|training|teaching)\b",
        lower,
    ):
        return "teaching"

    return "neutral"


def strip_markdown(text: str) -> str:
    """Remove markdown symbols, role prefixes, and emoji from text before TTS."""
    # Remove role prefixes like "[Interviewer]:" or "Ms. Priya:"
    text = re.sub(r"^\[.*?\]:\s?", "", text)
    text = re.sub(r"^[a-zA-Z\s\.\-]+:\s?", "", text)
    # Remove markdown bold/italic/code
    text = re.sub(r"\*.*?\*", "", text)
    text = re.sub(r"\[.*?\]", "", text)
    text = re.sub(r"\(.*?\)", "", text)
    # Remove common emoji and special chars
    text = re.sub(r"[✦🤖👋🎯💼🔐🔬⚡✨✓⬡*`_#]", "", text)
    return text.strip()
