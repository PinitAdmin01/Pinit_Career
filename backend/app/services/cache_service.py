"""
Redis Cache Service — Layer 1 of the voice cache stack.

Schema per cache entry:
  Key:   voice:{sha256_hash}
  Value: JSON {
    path:        str   — relative path under storage/audio/
    duration:    float — audio duration in seconds
    voice:       str   — Kokoro voice ID
    language:    str   — language code
    emotion:     str   — emotion label
    created:     str   — ISO timestamp
    last_access: str   — ISO timestamp
    hits:        int   — total cache hit count
  }

Eviction Policy:
  Never delete by age. LRU eviction only when storage limit is reached.
  Redis is configured with maxmemory-policy allkeys-lru.
"""

import os
import json
import asyncio
from datetime import datetime, timezone
from typing import Optional

import redis.asyncio as aioredis

# ── Singleton Redis Connection ─────────────────────────────────────────────────
_redis_client: Optional[aioredis.Redis] = None

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")
KEY_PREFIX = "voice:"


async def get_redis() -> aioredis.Redis:
    """Return (or initialize) the shared async Redis client."""
    global _redis_client
    if _redis_client is None:
        _redis_client = await aioredis.from_url(
            REDIS_URL,
            encoding="utf-8",
            decode_responses=True,
        )
    return _redis_client


async def close_redis():
    """Close the Redis connection on shutdown."""
    global _redis_client
    if _redis_client:
        await _redis_client.aclose()
        _redis_client = None


def _rkey(cache_key: str) -> str:
    """Build the full Redis key from a hash."""
    return f"{KEY_PREFIX}{cache_key}"


# ── Core Operations ───────────────────────────────────────────────────────────

async def get_cached(cache_key: str) -> Optional[dict]:
    """
    Fetch cache entry by SHA256 key.
    Returns metadata dict or None if not cached.
    Updates lastAccess and hits on every hit (async, non-blocking fire-and-forget).
    """
    r = await get_redis()
    raw = await r.get(_rkey(cache_key))
    if not raw:
        return None

    entry = json.loads(raw)
    # Fire-and-forget access update
    asyncio.create_task(_update_access(cache_key, entry))
    return entry


async def _update_access(cache_key: str, entry: dict):
    """Increment hit count and update lastAccess timestamp."""
    try:
        r = await get_redis()
        entry["hits"] = entry.get("hits", 0) + 1
        entry["last_access"] = datetime.now(timezone.utc).isoformat()
        await r.set(_rkey(cache_key), json.dumps(entry))
    except Exception:
        pass  # Non-critical — never let a cache update crash the request


async def save_cached(
    cache_key: str,
    path: str,
    duration: float,
    voice: str,
    language: str,
    emotion: str,
) -> None:
    """
    Persist a new cache entry in Redis.
    TTL is 0 (never expires) — LRU eviction handles cleanup.
    """
    r = await get_redis()
    now = datetime.now(timezone.utc).isoformat()
    entry = {
        "path": path,
        "duration": duration,
        "voice": voice,
        "language": language,
        "emotion": emotion,
        "created": now,
        "last_access": now,
        "hits": 0,
    }
    await r.set(_rkey(cache_key), json.dumps(entry))


async def delete_cached(cache_key: str) -> bool:
    """Remove a cache entry (used by garbage collector)."""
    r = await get_redis()
    deleted = await r.delete(_rkey(cache_key))
    return deleted > 0


async def get_all_entries() -> list[dict]:
    """
    Scan all voice:* keys and return their metadata.
    Used for stats and garbage collection.
    """
    r = await get_redis()
    keys = []
    async for key in r.scan_iter(f"{KEY_PREFIX}*"):
        keys.append(key)

    if not keys:
        return []

    entries = []
    pipeline = r.pipeline()
    for key in keys:
        pipeline.get(key)
    raw_values = await pipeline.execute()

    for key, raw in zip(keys, raw_values):
        if raw:
            try:
                entry = json.loads(raw)
                entry["_key"] = key.replace(KEY_PREFIX, "")
                entries.append(entry)
            except Exception:
                pass
    return entries


# ── Statistics ────────────────────────────────────────────────────────────────

async def compute_stats(audio_storage_dir: str) -> dict:
    """
    Compute cache statistics across all Redis entries.
    Returns hit rate, miss rate, storage used, top voices, average duration.

    Definitions:
      total_hits   = sum of hit counts across all entries (re-serves after generation)
      total_misses = count of entries that were never re-served (hits == 0)
      hit_rate     = total_hits / (total_hits + total_misses) * 100
    """
    entries = await get_all_entries()
    total = len(entries)
    total_hits = sum(e.get("hits", 0) for e in entries)
    # An entry was a "miss" each time it was initially generated (hits==0 means served once, never re-cached)
    total_misses = sum(1 for e in entries if e.get("hits", 0) == 0)

    # Storage used
    storage_bytes = 0
    for e in entries:
        fpath = os.path.join(audio_storage_dir, e.get("path", ""))
        if os.path.isfile(fpath):
            storage_bytes += os.path.getsize(fpath)

    # Average duration
    durations = [e.get("duration", 0) for e in entries if e.get("duration")]
    avg_duration = sum(durations) / len(durations) if durations else 0.0

    # Top voices
    voice_counts: dict[str, int] = {}
    for e in entries:
        v = e.get("voice", "unknown")
        voice_counts[v] = voice_counts.get(v, 0) + 1
    top_voices = sorted(
        [{"voice": k, "count": v} for k, v in voice_counts.items()],
        key=lambda x: x["count"],
        reverse=True,
    )[:5]

    # Hit rate: hits re-served vs (hits re-served + entries never re-served)
    total_requests = total_hits + total_misses
    hit_rate = (total_hits / total_requests * 100) if total_requests > 0 else 0.0

    return {
        "total_audio_files": total,
        "storage_used_mb": round(storage_bytes / (1024 * 1024), 2),
        "hit_rate_percent": round(hit_rate, 1),
        "miss_rate_percent": round(100 - hit_rate, 1),
        "top_voices": top_voices,
        "average_duration_seconds": round(avg_duration, 2),
        "total_hits": total_hits,
        "total_misses": total_misses,
    }


# ── Garbage Collector ─────────────────────────────────────────────────────────

async def run_garbage_collection(
    audio_storage_dir: str,
    max_storage_mb: float = 2048.0,
) -> dict:
    """
    LRU garbage collector — runs when storage exceeds max_storage_mb.
    Sorts entries by (hits DESC, last_access DESC) and removes lowest-priority ones.
    Never deletes entries with hits > 100 (frequently used lessons).

    Returns:
      { deleted: int, freed_mb: float }
    """
    entries = await get_all_entries()
    if not entries:
        return {"deleted": 0, "freed_mb": 0.0}

    # Compute current storage
    total_bytes = 0
    for e in entries:
        fpath = os.path.join(audio_storage_dir, e.get("path", ""))
        if os.path.isfile(fpath):
            e["_size"] = os.path.getsize(fpath)
            total_bytes += e["_size"]
        else:
            e["_size"] = 0

    max_bytes = max_storage_mb * 1024 * 1024
    if total_bytes <= max_bytes:
        return {"deleted": 0, "freed_mb": 0.0}

    # Sort: lowest hits first, oldest access first — these go first
    candidates = sorted(
        [e for e in entries if e.get("hits", 0) <= 100],  # protect popular clips
        key=lambda x: (x.get("hits", 0), x.get("last_access", "")),
    )

    deleted = 0
    freed_bytes = 0

    for entry in candidates:
        if total_bytes <= max_bytes:
            break
        key = entry.get("_key")
        fpath = os.path.join(audio_storage_dir, entry.get("path", ""))
        size = entry.get("_size", 0)

        if key:
            await delete_cached(key)
        if os.path.isfile(fpath):
            try:
                os.remove(fpath)
            except OSError:
                pass

        total_bytes -= size
        freed_bytes += size
        deleted += 1

    return {"deleted": deleted, "freed_mb": round(freed_bytes / (1024 * 1024), 2)}
