"""
TTS API — POST /api/tts

Complete Request Flow:
  1. Receive TTSRequest
  2. Compute SHA256 cache key
  3. Check Redis → HIT: stream cached file
  4. MISS: route to Voice Router (Kokoro 95% / Premium 5%)
  5. Save audio to disk + Redis
  6. Stream audio back to client

Headers on response:
  X-Cache-Status: REDIS_HIT | DISK_HIT | GENERATED
  X-Cache-Key:    {sha256_hash}
  X-Engine:       kokoro-sim | kokoro-real | elevenlabs
  X-Duration:     {seconds}
"""

import os
import io
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse, FileResponse

from app.models.schemas import TTSRequest, TTSResponse, ChunkAnalysisResponse, ChunkMeta
from app.services.hash_service import compute_cache_key, compute_sentence_keys
from app.services.cache_service import get_cached, save_cached
from app.services.audio_router import route_tts
from app.services.tts_service import save_audio, get_audio_path, AUDIO_STORAGE_DIR
from app.utils.text_utils import split_sentences, strip_markdown, enhance_intonation, detect_emotion

router = APIRouter(tags=["TTS"])


@router.post("/tts")
async def generate_tts(req: TTSRequest):
    """
    Main TTS endpoint.
    Returns audio as a binary stream with cache metadata in headers.
    """
    if not req.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty.")

    # Strip markdown/emoji for clean TTS input
    clean_text = strip_markdown(req.text)
    if not clean_text:
        raise HTTPException(status_code=400, detail="Text is empty after cleaning.")

    # Enhance intonation for more natural speech
    enhanced_text = enhance_intonation(clean_text)

    # Auto-detect emotion if not provided
    emotion = req.emotion if req.emotion != "neutral" else detect_emotion(enhanced_text)

    # Compute cache key
    cache_key = compute_cache_key(
        text=enhanced_text,
        voice=req.voice,
        language=req.language,
        speed=req.speed,
        emotion=emotion,
        version=req.version,
        sample_rate=req.sample_rate,
    )

    # ── Layer 1: Redis Cache Check ────────────────────────────────────────────
    cached_entry = await get_cached(cache_key)
    if cached_entry:
        abs_path = get_audio_path(cached_entry["path"])
        if abs_path:
            # Serve from disk — cache hit
            content_type = "audio/mpeg" if cached_entry["path"].endswith(".mp3") else "audio/wav"
            return FileResponse(
                path=abs_path,
                media_type=content_type,
                headers={
                    "X-Cache-Status": "REDIS_HIT",
                    "X-Cache-Key": cache_key,
                    "X-Duration": str(cached_entry.get("duration", 0)),
                    "X-Engine": cached_entry.get("engine", "kokoro"),
                    "Cache-Control": "public, max-age=31536000, immutable",
                },
            )
        # Redis entry exists but file is missing — regenerate
        print(f"[TTS] Redis hit but file missing for {cache_key[:10]} — regenerating")

    # ── Layer 2: Generate → Save → Cache ─────────────────────────────────────
    # Build request with clean text for the voice router
    routed_req = TTSRequest(
        text=enhanced_text,
        voice=req.voice,
        language=req.language,
        speed=req.speed,
        emotion=emotion,
        version=req.version,
        sample_rate=req.sample_rate,
        context=req.context,
    )

    result = await route_tts(routed_req)

    # Save to disk
    fmt = result.format
    rel_path = save_audio(result.audio_bytes, cache_key, req.language, fmt)

    # Save metadata to Redis
    await save_cached(
        cache_key=cache_key,
        path=rel_path,
        duration=result.duration,
        voice=req.voice,
        language=req.language,
        emotion=emotion,
    )

    print(f"[TTS] Generated: {cache_key[:10]}... | Engine: {result.engine} | Duration: {result.duration:.1f}s")

    content_type = "audio/mpeg" if fmt == "mp3" else "audio/wav"
    return StreamingResponse(
        io.BytesIO(result.audio_bytes),
        media_type=content_type,
        headers={
            "X-Cache-Status": "GENERATED",
            "X-Cache-Key": cache_key,
            "X-Duration": str(round(result.duration, 2)),
            "X-Engine": result.engine,
            "Cache-Control": "public, max-age=31536000, immutable",
        },
    )


@router.post("/tts/analyze-chunks")
async def analyze_chunks(req: TTSRequest) -> ChunkAnalysisResponse:
    """
    Split text into sentence chunks and return cache key + hit/miss status for each.
    Applies symmetric intonation enhancement and emotion detection so hashes strictly match /api/tts.
    """
    clean_text = strip_markdown(req.text)
    raw_sentences = split_sentences(clean_text)
    
    # Symmetrically enhance each sentence chunk with intonation & emotion detection
    enhanced_sentences = [enhance_intonation(s) for s in raw_sentences if s.strip()]
    
    chunk_metas = compute_sentence_keys(
        enhanced_sentences,
        voice=req.voice,
        language=req.language,
        speed=req.speed,
        emotion=req.emotion if req.emotion != "neutral" else "neutral",
        version=req.version,
        sample_rate=req.sample_rate,
    )

    result = []
    cached_count = 0
    for i, meta in enumerate(chunk_metas):
        # Auto-detect emotion per chunk if neutral
        chunk_emotion = req.emotion if req.emotion != "neutral" else detect_emotion(meta["normalized"])
        exact_cache_key = compute_cache_key(
            text=meta["normalized"],
            voice=req.voice,
            language=req.language,
            speed=req.speed,
            emotion=chunk_emotion,
            version=req.version,
            sample_rate=req.sample_rate,
        )
        
        entry = await get_cached(exact_cache_key)
        is_cached = entry is not None and get_audio_path(entry.get("path", "")) is not None
        if is_cached:
            cached_count += 1
            
        orig = raw_sentences[i] if i < len(raw_sentences) else meta["normalized"]
        result.append(ChunkMeta(
            original_sentence=orig,
            normalized=meta["normalized"],
            cache_key=exact_cache_key,
            cached=is_cached,
        ))

    print(f"[TTS Chunk Analyzer] Total Chunks: {len(result)} | Cached: {cached_count} | Miss: {len(result) - cached_count}")

    return ChunkAnalysisResponse(
        total_chunks=len(result),
        cached_count=cached_count,
        miss_count=len(result) - cached_count,
        chunks=result,
    )
