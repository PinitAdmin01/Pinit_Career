import hashlib
import logging
from typing import Optional, Tuple
from cache.redis_cache import redis_cache
from cache.ssd_cache import ssd_cache
from cache.supabase_cache import supabase_cache
from config.settings import settings

logger = logging.getLogger("voice_service.cache_manager")

class ServerMultiTierCache:
    """Unified Server Multi-Tier Cache Manager (Redis RAM + SSD Disk + Supabase Storage)."""

    def compute_hash(self, text: str, voice: str = "af_bella", speed: float = 1.0) -> str:
        """Computes SHA-256 fingerprint key matching the frontend keying format."""
        normalized_text = " ".join(text.strip().lower().split())
        raw_str = f"pinit_v2::{voice.lower()}::{speed:.2f}::{normalized_text}"
        return hashlib.sha256(raw_str.encode("utf-8")).hexdigest()

    def get_audio(self, cache_key: str) -> Tuple[Optional[bytes], Optional[str]]:
        """
        Queries Tier 2 (Redis RAM), Tier 3 (SSD Disk), and Tier 4 (Supabase Storage) sequentially.
        Returns tuple of (wav_bytes, hit_source).
        """
        # Tier 2: Redis RAM Cache (<5ms)
        wav_bytes = redis_cache.get(cache_key)
        if wav_bytes:
            return wav_bytes, "REDIS_RAM_CACHE"

        # Tier 3: SSD Disk Cache (<15ms)
        wav_bytes = ssd_cache.get(cache_key)
        if wav_bytes:
            # Promote to Redis RAM Cache for faster subsequent lookups
            redis_cache.set(cache_key, wav_bytes)
            return wav_bytes, "SSD_DISK_CACHE"

        # Tier 4: Supabase Cloud Storage (<100ms)
        wav_bytes = supabase_cache.get(cache_key)
        if wav_bytes:
            # Promote to SSD Disk and Redis RAM Caches
            redis_cache.set(cache_key, wav_bytes)
            ssd_cache.set(cache_key, wav_bytes, "cached_text", "cached_voice", 1.0)
            return wav_bytes, "SUPABASE_CLOUD_CACHE"

        return None, None

    def save_audio(self, cache_key: str, wav_bytes: bytes, text: str, voice: str, speed: float):
        """Persists freshly synthesized audio across Redis RAM, SSD Disk, and Supabase Storage."""
        redis_cache.set(cache_key, wav_bytes)
        ssd_cache.set(cache_key, wav_bytes, text, voice, speed)
        supabase_cache.upload(cache_key, wav_bytes, text, voice, speed)

    def get_metrics(self) -> dict:
        """Aggregates cache system health metrics."""
        return {
            "redis": redis_cache.get_stats(),
            "ssd": ssd_cache.get_stats(),
            "supabase": supabase_cache.get_stats()
        }

server_cache = ServerMultiTierCache()
