"""
Pydantic schemas for all API request/response models.
"""

from typing import Optional, List
from pydantic import BaseModel, Field


# ── TTS Request ───────────────────────────────────────────────────────────────

class TTSRequest(BaseModel):
    text: str = Field(..., description="Text to synthesize")
    voice: str = Field(default="af_heart", description="Kokoro voice ID")
    language: str = Field(default="en", description="Language code: en, hi, kn, ta, te")
    speed: float = Field(default=1.0, ge=0.5, le=2.0, description="Speech speed multiplier")
    emotion: str = Field(default="neutral", description="happy | motivational | teaching | neutral")
    version: str = Field(default="v2.0", description="Model version for cache key")
    sample_rate: int = Field(default=24000, description="Target sample rate")
    context: str = Field(default="avatar", description="avatar | lesson | interview | mission | gd")

    model_config = {"json_schema_extra": {
        "example": {
            "text": "Welcome to PinIT Careers",
            "voice": "af_heart",
            "language": "en",
            "speed": 1.0,
            "emotion": "happy",
            "version": "v2.0",
            "sample_rate": 24000,
            "context": "avatar"
        }
    }}


class TTSResponse(BaseModel):
    cached: bool
    audio_url: str
    cache_key: str
    duration: float
    cache_status: str  # MEMORY_HIT | DISK_HIT | GENERATED
    voice: str
    language: str


# ── Cache Schemas ─────────────────────────────────────────────────────────────

class CacheEntry(BaseModel):
    path: str
    duration: float
    voice: str
    language: str
    emotion: str
    created: str
    last_access: str
    hits: int


class CacheLookupResponse(BaseModel):
    exists: bool
    cache_key: Optional[str] = None
    file_exists: Optional[bool] = None
    metadata: Optional[CacheEntry] = None


class CacheStatsResponse(BaseModel):
    total_audio_files: int
    storage_used_mb: float
    hit_rate_percent: float
    miss_rate_percent: float
    top_voices: List[dict]
    average_duration_seconds: float
    total_hits: int
    total_misses: int


# ── Chat / LLM ────────────────────────────────────────────────────────────────

class ChatMessage(BaseModel):
    role: str   # "user" | "assistant" | "system"
    content: str


class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    model: str = Field(default="mistralai/mistral-7b-instruct", description="OpenRouter model ID")
    temperature: float = Field(default=0.7, ge=0.0, le=2.0)
    max_tokens: int = Field(default=512, ge=1, le=4096)
    stream: bool = Field(default=False)
    groq_slot: Optional[str] = Field(default=None, description="a or b for dual Groq keys in group discussion")


class ChatResponse(BaseModel):
    content: str
    model: str
    usage: Optional[dict] = None


# ── Chunk Analysis ────────────────────────────────────────────────────────────

class ChunkMeta(BaseModel):
    original_sentence: str
    normalized: str
    cache_key: str
    cached: bool


class ChunkAnalysisResponse(BaseModel):
    total_chunks: int
    cached_count: int
    miss_count: int
    chunks: List[ChunkMeta]
