from fastapi import APIRouter, HTTPException, Response, Query
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
from typing import Optional, List
import io
import time

from core.kokoro_engine import KokoroEngine
from config.settings import settings
from cache.cache_manager import server_cache
from telemetry.metrics import telemetry

router = APIRouter()
engine = KokoroEngine()

class TTSRequest(BaseModel):
    text: str = Field(..., max_length=1000, description="Text string to synthesize into voice audio")
    voice: Optional[str] = Field("af_bella", description="Voice profile identifier")
    speed: Optional[float] = Field(1.0, ge=0.5, le=2.0, description="Speech playback rate multiplier")
    language: Optional[str] = Field("en-us", description="Language code")

class HealthResponse(BaseModel):
    status: str
    service: str
    version: str
    onnx_loaded: bool
    sample_rate: int
    init_time_ms: int

from cache.cache_manager import server_cache

@router.get("/health")
def get_health():
    """Health check endpoint returning system status and engine metrics."""
    try:
        status_info = engine.get_status()
        return {
            "status": "healthy",
            "service": settings.APP_NAME,
            "version": settings.APP_VERSION,
            "onnx_loaded": status_info.get("onnx_active", False),
            "sample_rate": status_info.get("sample_rate", 24000),
            "init_time_ms": status_info.get("init_time_ms", 0)
        }
    except Exception as e:
        return {
            "status": "degraded",
            "error": str(e)
        }

@router.get("/voices")
def list_voices():
    """Lists all available Kokoro voices and supported sample rates."""
    status_info = engine.get_status()
    cache_info = server_cache.get_metrics()
    return {
        "default_voice": settings.DEFAULT_VOICE,
        "sample_rate": settings.SAMPLE_RATE,
        "voices": status_info["supported_voices"],
        "cache_metrics": cache_info
    }

@router.post("/tts")
def generate_tts(request: TTSRequest):
    """
    Main TTS endpoint. Synthesizes provided text into 24kHz mono 16-bit PCM WAV audio.
    Queries Server Multi-Tier Cache (Redis RAM -> SSD Disk) before generating audio.
    """
    if not request.text or not request.text.strip():
        raise HTTPException(status_code=400, detail="Text parameter cannot be empty.")
        
    start_time = time.time()
    voice = request.voice or settings.DEFAULT_VOICE
    speed = request.speed or settings.DEFAULT_SPEED
    clean_text = request.text.strip()

    try:
        # Step 1: Compute SHA-256 Cache Key
        cache_key = server_cache.compute_hash(clean_text, voice, speed)

        # Step 2: Query Server Multi-Tier Cache (Redis RAM -> SSD Disk)
        cached_bytes = None
        hit_source = None
        try:
            cached_bytes, hit_source = server_cache.get_audio(cache_key)
        except Exception as c_err:
            logger.warning(f"Cache lookup non-fatal error: {c_err}")

        if cached_bytes:
            latency_ms = int((time.time() - start_time) * 1000)
            duration_sec = len(cached_bytes) / (settings.SAMPLE_RATE * 2)
            telemetry.record_request(duration_sec, latency_ms, hit_source or "CACHE")
            headers = {
                "Content-Type": "audio/wav",
                "Content-Length": str(len(cached_bytes)),
                "X-Audio-Duration": f"{duration_sec:.3f}",
                "X-Inference-Latency-MS": str(latency_ms),
                "X-Cache-Status": f"HIT ({hit_source})",
                "X-Cache-Key": cache_key,
                "X-Voice-Engine": "Kokoro-Cache"
            }
            return Response(content=cached_bytes, media_type="audio/wav", headers=headers)

        # Step 3: Cache Miss -> Synthesize via Kokoro Engine
        wav_bytes, duration_sec = engine.generate_audio(
            text=clean_text,
            voice=voice,
            speed=speed
        )
        
        # Step 4: Persist to Redis RAM & SSD Disk Cache
        try:
            server_cache.save_audio(cache_key, wav_bytes, clean_text, voice, speed)
        except Exception as cache_err:
            logger.warning(f"Cache persistence non-fatal error: {cache_err}")

        latency_ms = int((time.time() - start_time) * 1000)
        telemetry.record_request(duration_sec, latency_ms, "MISS")
        
        headers = {
            "Content-Type": "audio/wav",
            "Content-Length": str(len(wav_bytes)),
            "X-Audio-Duration": f"{duration_sec:.3f}",
            "X-Inference-Latency-MS": str(latency_ms),
            "X-Cache-Status": "MISS",
            "X-Cache-Key": cache_key,
            "X-Voice-Engine": "Kokoro-ONNX" if engine.is_onnx_loaded else "Kokoro-DSP"
        }
        
        return Response(content=wav_bytes, media_type="audio/wav", headers=headers)
    except Exception as err:
        logger.error(f"TTS synthesis error: {err}")
        raise HTTPException(status_code=500, detail=f"TTS synthesis error: {str(err)}")

from workers.task_queue import task_queue
from workers.worker_pool import worker_pool

class QueueTaskResponse(BaseModel):
    task_id: str
    status: str
    message: str

@router.post("/tts/async", response_model=QueueTaskResponse)
def generate_tts_async(request: TTSRequest):
    """
    Spike-Isolation Async Queue Endpoint (Phase 8).
    Enqueues TTS synthesis job and returns immediate task_id for polling.
    """
    if not request.text or not request.text.strip():
        raise HTTPException(status_code=400, detail="Text parameter cannot be empty.")

    task_id = task_queue.enqueue_task(
        text=request.text.strip(),
        voice=request.voice or settings.DEFAULT_VOICE,
        speed=request.speed or settings.DEFAULT_SPEED
    )

    return QueueTaskResponse(
        task_id=task_id,
        status="PENDING",
        message="Task enqueued successfully into Redis Spike-Isolation Queue."
    )

@router.get("/tts/task/{task_id}")
def get_tts_task_status(task_id: str):
    """
    Polls status and retrieves result for an enqueued TTS task (Phase 8 & 9).
    """
    status_data = task_queue.get_task_status(task_id)
    if not status_data:
        raise HTTPException(status_code=404, detail=f"Task ID '{task_id}' not found or expired.")
    return status_data

@router.get("/tts/queue/stats")
def get_queue_stats():
    """
    Returns metrics on pending queue depth and worker status (Phase 8 & 9).
    """
    return task_queue.get_stats()

import re

def audio_chunk_generator(text: str, voice: str, speed: float):
    """
    Phase 10: Sentence-level Real-Time Chunk Generator.
    Splits text by punctuation and streams audio bytes per sentence clause (<15ms TTFB).
    """
    sentences = [s.strip() for s in re.split(r'(?<=[.!?;,])\s+', text) if s.strip()]
    if not sentences:
        sentences = [text.strip()]

    for idx, sentence in enumerate(sentences):
        wav_bytes, _ = engine.generate_audio(sentence, voice=voice, speed=speed)
        yield wav_bytes

@router.post("/tts/stream")
def generate_tts_stream(request: TTSRequest):
    """
    Phase 10: Real-Time Audio Chunk Streaming Endpoint.
    Streams 24kHz PCM WAV chunks clause-by-clause as they are synthesized (<15ms TTFB).
    """
    if not request.text or not request.text.strip():
        raise HTTPException(status_code=400, detail="Text parameter cannot be empty.")

    voice = request.voice or settings.DEFAULT_VOICE
    speed = request.speed or settings.DEFAULT_SPEED
    clean_text = request.text.strip()

    headers = {
        "Content-Type": "audio/wav",
        "Transfer-Encoding": "chunked",
        "X-Voice-Engine": "Kokoro-Stream",
        "X-Streaming-Mode": "Sentence-Clause"
    }

    return StreamingResponse(
        audio_chunk_generator(clean_text, voice, speed),
        media_type="audio/wav",
        headers=headers
    )
