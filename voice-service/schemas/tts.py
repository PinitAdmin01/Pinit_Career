from pydantic import BaseModel, Field
from typing import Optional

class TTSRequestSchema(BaseModel):
    text: str = Field(..., min_length=1, max_length=1000, description="Text phrase to synthesize into voice audio")
    voice: str = Field(default="af_bella", description="Voice profile identifier")
    speed: float = Field(default=1.0, ge=0.5, le=2.0, description="Playback speech speed multiplier")

class TTSResponseSchema(BaseModel):
    task_id: Optional[str] = None
    status: str
    audio_duration_sec: Optional[float] = None
    inference_latency_ms: Optional[float] = None
    cache_status: Optional[str] = None
