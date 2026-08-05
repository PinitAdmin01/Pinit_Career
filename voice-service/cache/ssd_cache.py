import os
import json
import time
import logging
from typing import Optional, Tuple
from config.settings import settings

logger = logging.getLogger("voice_service.cache.ssd")

class SSDDiskCacheManager:
    """Phase 6: Server Local SSD Disk Cache Manager."""

    def __init__(self):
        self.cache_dir = settings.CACHE_DIR
        os.makedirs(self.cache_dir, exist_ok=True)
        logger.info(f"Initialized SSD Disk Cache Directory at: {self.cache_dir}")

    def _get_paths(self, cache_key: str) -> Tuple[str, str]:
        wav_path = os.path.join(self.cache_dir, f"{cache_key}.wav")
        meta_path = os.path.join(self.cache_dir, f"{cache_key}.json")
        return wav_path, meta_path

    def get(self, cache_key: str) -> Optional[bytes]:
        """Retrieves WAV audio file from SSD disk cache."""
        wav_path, meta_path = self._get_paths(cache_key)
        
        if not os.path.exists(wav_path):
            return None

        try:
            with open(wav_path, "rb") as f:
                wav_bytes = f.read()

            # Update sidecar metadata asynchronously
            if os.path.exists(meta_path):
                try:
                    with open(meta_path, "r", encoding="utf-8") as mf:
                        meta = json.load(mf)
                    meta["hit_count"] = meta.get("hit_count", 0) + 1
                    meta["last_accessed"] = time.time()
                    with open(meta_path, "w", encoding="utf-8") as mf:
                        json.dump(meta, mf)
                except Exception:
                    pass

            logger.info(f"SSD Disk Cache HIT for key={cache_key[:8]}")
            return wav_bytes
        except Exception as e:
            logger.error(f"Error reading SSD cache file {wav_path}: {e}")
            return None

    def set(self, cache_key: str, wav_bytes: bytes, text: str, voice: str, speed: float) -> bool:
        """Saves WAV audio file and sidecar metadata JSON to SSD disk cache."""
        wav_path, meta_path = self._get_paths(cache_key)

        try:
            with open(wav_path, "wb") as f:
                f.write(wav_bytes)

            meta = {
                "cache_key": cache_key,
                "text": text,
                "voice": voice,
                "speed": speed,
                "created_at": time.time(),
                "last_accessed": time.time(),
                "hit_count": 1,
                "byte_size": len(wav_bytes),
            }

            with open(meta_path, "w", encoding="utf-8") as mf:
                json.dump(meta, mf, indent=2)

            logger.info(f"Saved audio to SSD Disk Cache: {cache_key[:8]} ({len(wav_bytes)} bytes)")
            return True
        except Exception as e:
            logger.error(f"Error writing SSD cache file {wav_path}: {e}")
            return False

    def get_stats(self) -> dict:
        """Returns SSD Cache Directory metrics."""
        try:
            files = os.listdir(self.cache_dir)
            wav_files = [f for f in files if f.endswith(".wav")]
            total_bytes = sum(
                os.path.getsize(os.path.join(self.cache_dir, f)) for f in wav_files
            )
            return {
                "total_cached_files": len(wav_files),
                "total_size_bytes": total_bytes,
                "total_size_mb": round(total_bytes / (1024 * 1024), 2),
                "path": self.cache_dir,
            }
        except Exception:
            return {"total_cached_files": 0, "total_size_bytes": 0, "path": self.cache_dir}

ssd_cache = SSDDiskCacheManager()
