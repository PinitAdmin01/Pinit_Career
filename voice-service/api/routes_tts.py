from fastapi import APIRouter, HTTPException, Response
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
from typing import Optional
import io
import logging
import re
import time

from services.kokoro_engine import KokoroEngine
from config.settings import settings
from cache.cache_manager import server_cache
from telemetry.metrics import telemetry

logger = logging.getLogger("voice_service.routes_tts")

router = APIRouter()
engine = KokoroEngine()


class TTSRequest(BaseModel):
    text: str = Field(..., max_length=1000, description="Text string to synthesize into voice audio")
    voice: Optional[str] = Field("af_bella", description="Voice profile identifier")
    speed: Optional[float] = Field(1.0, ge=0.5, le=2.0, description="Speech playback rate multiplier")
    language: Optional[str] = Field("en-us", description="Language code")


class QueueTaskResponse(BaseModel):
    task_id: str
    status: str
    message: str


@router.get("/voices")
def list_voices():
    """Lists all available voices and supported sample rates."""
    try:
        status_info = engine.get_status()
        return {
            "default_voice": settings.DEFAULT_VOICE,
            "sample_rate": settings.SAMPLE_RATE,
            "engine": status_info.get("engine"),
            "edge_active": status_info.get("edge_active"),
            "onnx_active": status_info.get("onnx_active"),
            "voices": status_info.get("supported_voices", []),
        }
    except Exception:
        return {
            "default_voice": settings.DEFAULT_VOICE,
            "sample_rate": settings.SAMPLE_RATE,
            "voices": ["af_bella", "af_sarah", "am_adam", "priya"],
        }


@router.post("/tts")
async def generate_tts(request: TTSRequest):
    """
    Main TTS endpoint. Uses edge-tts neural voices on free tier (or Kokoro ONNX if present).
    Cache order: Redis → SSD → Supabase → generate → save.
    """
    if not request.text or not request.text.strip():
        raise HTTPException(status_code=400, detail="Text parameter cannot be empty.")

    start_time = time.time()
    voice = request.voice or settings.DEFAULT_VOICE
    speed = request.speed or settings.DEFAULT_SPEED
    clean_text = request.text.strip()

    try:
        cache_key = server_cache.compute_hash(clean_text, voice, speed)

        cached_bytes = None
        hit_source = None
        try:
            cached_bytes, hit_source = server_cache.get_audio(cache_key)
        except Exception as c_err:
            logger.warning(f"Cache lookup non-fatal error: {c_err}")

        if cached_bytes and len(cached_bytes) > 500:
            latency_ms = int((time.time() - start_time) * 1000)
            # Prefer header estimate; byte-length for WAV 16-bit mono is approximate
            is_mp3 = cached_bytes[:3] == b"ID3" or cached_bytes[:2] == b"\xff\xfb" or cached_bytes[:2] == b"\xff\xf3"
            media_type = "audio/mpeg" if is_mp3 else "audio/wav"
            duration_sec = max(0.6, len(clean_text) / (14.0 * max(0.5, float(speed))))
            if not is_mp3:
                duration_sec = max(duration_sec, len(cached_bytes) / (settings.SAMPLE_RATE * 2))
            telemetry.record_request(duration_sec, latency_ms, hit_source or "CACHE")
            headers = {
                "Content-Type": media_type,
                "Content-Length": str(len(cached_bytes)),
                "X-Audio-Duration": f"{duration_sec:.3f}",
                "X-Inference-Latency-MS": str(latency_ms),
                "X-Cache-Status": f"HIT ({hit_source})",
                "X-Cache-Key": cache_key,
                "X-Voice-Engine": "Cache",
            }
            return Response(content=cached_bytes, media_type=media_type, headers=headers)

        audio_bytes, duration_sec, media_type = await engine.generate_audio(
            text=clean_text,
            voice=voice,
            speed=speed,
        )

        try:
            server_cache.save_audio(cache_key, audio_bytes, clean_text, voice, speed)
        except Exception as cache_err:
            logger.warning(f"Cache persistence non-fatal error: {cache_err}")

        latency_ms = int((time.time() - start_time) * 1000)
        telemetry.record_request(duration_sec, latency_ms, "MISS")
        status = engine.get_status()
        engine_label = "Edge-Neural" if status.get("edge_active") else (
            "Kokoro-ONNX" if status.get("onnx_active") else "Neural"
        )

        headers = {
            "Content-Type": media_type,
            "Content-Length": str(len(audio_bytes)),
            "X-Audio-Duration": f"{duration_sec:.3f}",
            "X-Inference-Latency-MS": str(latency_ms),
            "X-Cache-Status": "MISS",
            "X-Cache-Key": cache_key,
            "X-Voice-Engine": engine_label,
        }
        return Response(content=audio_bytes, media_type=media_type, headers=headers)
    except Exception as err:
        logger.error(f"TTS synthesis error: {err}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"TTS synthesis error: {str(err)}")


from workers.task_queue import task_queue


@router.post("/tts/async", response_model=QueueTaskResponse)
def generate_tts_async(request: TTSRequest):
    if not request.text or not request.text.strip():
        raise HTTPException(status_code=400, detail="Text parameter cannot be empty.")

    task_id = task_queue.enqueue_task(
        text=request.text.strip(),
        voice=request.voice or settings.DEFAULT_VOICE,
        speed=request.speed or settings.DEFAULT_SPEED,
    )
    return QueueTaskResponse(
        task_id=task_id,
        status="PENDING",
        message="Task enqueued successfully.",
    )


@router.get("/tts/task/{task_id}")
def get_tts_task_status(task_id: str):
    status_data = task_queue.get_task_status(task_id)
    if not status_data:
        raise HTTPException(status_code=404, detail=f"Task ID '{task_id}' not found or expired.")
    return status_data


@router.get("/tts/queue/stats")
def get_queue_stats():
    return task_queue.get_stats()


def audio_chunk_generator(text: str, voice: str, speed: float):
    sentences = [s.strip() for s in re.split(r"(?<=[.!?;,])\s+", text) if s.strip()]
    if not sentences:
        sentences = [text.strip()]
    for sentence in sentences:
        audio_bytes, _, _ = engine.generate_audio(sentence, voice=voice, speed=speed)
        yield audio_bytes


@router.post("/tts/stream")
def generate_tts_stream(request: TTSRequest):
    if not request.text or not request.text.strip():
        raise HTTPException(status_code=400, detail="Text parameter cannot be empty.")

    voice = request.voice or settings.DEFAULT_VOICE
    speed = request.speed or settings.DEFAULT_SPEED
    clean_text = request.text.strip()

    headers = {
        "X-Voice-Engine": "Neural-Stream",
        "X-Streaming-Mode": "Sentence-Clause",
    }
    return StreamingResponse(
        audio_chunk_generator(clean_text, voice, speed),
        media_type="audio/mpeg",
        headers=headers,
    )
