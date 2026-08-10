import os
import logging
import base64
from typing import Optional
from config.settings import settings

logger = logging.getLogger("voice_service.cache.redis")

class RedisCacheManager:
    """Phase 5: Server Redis RAM Cache Manager."""

    def __init__(self):
        self.redis_client = None
        self.is_connected = False
        self._connect_redis()

    def _connect_redis(self):
        try:
            import redis
            # Connect to Redis server
            redis_host = os.getenv("REDIS_HOST", "localhost")
            redis_port = int(os.getenv("REDIS_PORT", 6379))
            
            self.redis_client = redis.Redis(
                host=redis_host,
                port=redis_port,
                db=0,
                socket_timeout=1.0,
                socket_connect_timeout=1.0
            )
            # Ping test
            self.redis_client.ping()
            self.is_connected = True
            logger.info(f"Connected to Redis Server RAM Cache at {redis_host}:{redis_port}")
        except Exception as e:
            self.is_connected = False
            logger.warning(f"Redis RAM Cache offline ({e}). Operating in memory-pass-through mode.")

    def get(self, cache_key: str) -> Optional[bytes]:
        """Retrieves audio bytes from Redis RAM cache."""
        if not self.is_connected or not self.redis_client:
            return None
        
        try:
            val = self.redis_client.get(f"tts:audio:{cache_key}")
            if val:
                logger.info(f"Redis RAM Cache HIT for key={cache_key[:8]}")
                return val
        except Exception as e:
            logger.warning(f"Redis read error: {e}")
        return None

    def set(self, cache_key: str, wav_bytes: bytes, ttl_seconds: int = 2592000) -> bool:
        """Saves audio bytes into Redis RAM cache with 30-day default TTL."""
        if not self.is_connected or not self.redis_client:
            return False
            
        try:
            self.redis_client.setex(f"tts:audio:{cache_key}", ttl_seconds, wav_bytes)
            return True
        except Exception as e:
            logger.warning(f"Redis write error: {e}")
            return False

    def get_stats(self) -> dict:
        """Returns Redis connection and RAM stats."""
        return {
            "connected": self.is_connected,
            "backend": "Redis-RAM"
        }

import os
redis_cache = RedisCacheManager()
