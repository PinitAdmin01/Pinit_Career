import re
import time
import asyncio
from typing import Generator
from fastapi import APIRouter, Response, HTTPException
from pydantic import BaseModel, Field
from core.kokoro_engine import engine

router = APIRouter()

class TTSRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=1000)
    voice: str = Field(default="priya")
    speed: float = Field(default=1.0, ge=0.5, le=2.0)
    bypass_cache: bool = Field(default=False)

@router.post("/tts")
async def generate_tts(req: TTSRequest):
    t0 = time.time()
    try:
        wav_bytes, duration = await engine.generate_audio_async(req.text, req.voice, req.speed)
        latency_ms = (time.time() - t0) * 1000
        
        return Response(
            content=wav_bytes,
            media_type="audio/mpeg" if wav_bytes.startswith(b'\xff\xfb') or wav_bytes.startswith(b'ID3') else "audio/wav",
            headers={
                "X-Audio-Duration": f"{duration:.2f}",
                "X-Inference-Latency-MS": f"{latency_ms:.1f}",
                "X-Cache-Status": "BYPASS" if req.bypass_cache else "SYNTHESIZED",
                "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0" if req.bypass_cache else "public, max-age=86400"
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/tts/stream")
async def generate_tts_stream(req: TTSRequest):
    return await generate_tts(req)

@router.get("/voices")
async def get_voices():
    return {"voices": engine.voices}


def audio_chunk_generator(
    text: str,
    voice: str = "priya",
    speed: float = 1.0
) -> Generator[bytes, None, None]:
    """
    Split text into sentence clauses and yield synthesized WAV bytes per clause.
    Used for real-time streaming playback and tested by test_stream.py.
    """
    # Split on sentence boundaries, keeping the delimiter
    clauses = [c.strip() for c in re.split(r'(?<=[.!?])\s+', text) if c.strip()]
    if not clauses:
        clauses = [text]

    loop = asyncio.new_event_loop()
    try:
        for clause in clauses:
            try:
                wav_bytes, _duration = loop.run_until_complete(
                    engine.generate_audio_async(clause, voice, speed)
                )
                if wav_bytes:
                    yield wav_bytes
            except Exception:
                # Skip failed clause — don't break the entire stream
                continue
    finally:
        loop.close()
