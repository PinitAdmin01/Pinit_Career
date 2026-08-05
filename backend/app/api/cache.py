"""
Cache API — lookup and statistics endpoints.

GET /api/cache/hash?key={sha256}  → Lookup a specific cache entry
GET /api/cache/stats               → Full cache statistics
POST /api/cache/gc                 → Run garbage collector
"""

import os
from fastapi import APIRouter, Query, HTTPException

from app.models.schemas import CacheLookupResponse, CacheEntry, CacheStatsResponse
from app.services.cache_service import get_cached, compute_stats, run_garbage_collection
from app.services.tts_service import AUDIO_STORAGE_DIR, get_audio_path

router = APIRouter(tags=["Cache"])

MAX_STORAGE_MB = float(os.getenv("MAX_STORAGE_MB", "2048"))


@router.get("/cache/hash", response_model=CacheLookupResponse)
async def cache_lookup(key: str = Query(..., description="SHA256 cache key to look up")):
    """
    Check if a specific cache key exists.
    Returns metadata if found, including whether the audio file is on disk.
    """
    entry = await get_cached(key)
    if not entry:
        return CacheLookupResponse(exists=False, cache_key=key)

    abs_path = get_audio_path(entry.get("path", ""))
    return CacheLookupResponse(
        exists=True,
        cache_key=key,
        file_exists=abs_path is not None,
        metadata=CacheEntry(
            path=entry.get("path", ""),
            duration=entry.get("duration", 0.0),
            voice=entry.get("voice", ""),
            language=entry.get("language", "en"),
            emotion=entry.get("emotion", "neutral"),
            created=entry.get("created", ""),
            last_access=entry.get("last_access", ""),
            hits=entry.get("hits", 0),
        ),
    )


@router.get("/cache/stats", response_model=CacheStatsResponse)
async def cache_stats():
    """
    Return full cache statistics:
    - Total audio clips stored
    - Storage used (MB)
    - Hit rate / miss rate
    - Top 5 voices by usage
    - Average audio duration
    """
    stats = await compute_stats(AUDIO_STORAGE_DIR)
    return CacheStatsResponse(**stats)


@router.post("/cache/gc")
async def garbage_collect():
    """
    Run LRU garbage collector.
    Deletes lowest-hit audio files when storage exceeds MAX_STORAGE_MB.
    Never deletes clips with > 100 hits (frequently used lessons).
    """
    result = await run_garbage_collection(AUDIO_STORAGE_DIR, MAX_STORAGE_MB)
    return {
        "status": "ok",
        "deleted": result["deleted"],
        "freed_mb": result["freed_mb"],
        "message": (
            f"Freed {result['freed_mb']} MB by deleting {result['deleted']} low-use audio files."
            if result["deleted"] > 0
            else "Storage within limits — no cleanup needed."
        ),
    }
