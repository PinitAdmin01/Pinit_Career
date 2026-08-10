import os
import time
import logging
import requests
from typing import Optional, Tuple
from config.settings import settings

logger = logging.getLogger("voice_service.cache.supabase")

class SupabaseCacheManager:
    """Phase 7: Supabase Storage & Database Metadata Persistence Manager."""

    def __init__(self):
        self.url = settings.SUPABASE_URL
        self.key = settings.SUPABASE_KEY
        self.bucket = settings.SUPABASE_BUCKET
        self.is_configured = bool(self.url and self.key)

        if self.is_configured:
            logger.info(f"Initialized Supabase Cloud Storage Manager ({self.url}, Bucket: {self.bucket})")
        else:
            logger.warning("Supabase URL or Key not configured. Tier 4 Cloud Storage running in pass-through mode.")

    def _get_headers(self) -> dict:
        return {
            "apikey": self.key,
            "Authorization": f"Bearer {self.key}"
        }

    def get(self, cache_key: str) -> Optional[bytes]:
        """Downloads pre-rendered WAV file from Supabase Storage bucket."""
        if not self.is_configured:
            return None

        file_url = f"{self.url}/storage/v1/object/public/{self.bucket}/{cache_key}.mp3"
        try:
            res = requests.get(file_url, headers=self._get_headers(), timeout=8.0)
            if res.status_code == 200 and len(res.content) > 500:
                logger.info(f"Supabase Storage HIT (mp3) for key={cache_key[:8]}")
                return res.content
        except Exception as e:
            logger.warning(f"Supabase Storage mp3 read error for key {cache_key[:8]}: {e}")

        # Legacy wav objects
        file_url_wav = f"{self.url}/storage/v1/object/public/{self.bucket}/{cache_key}.wav"
        try:
            res = requests.get(file_url_wav, headers=self._get_headers(), timeout=8.0)
            if res.status_code == 200 and len(res.content) > 500:
                logger.info(f"Supabase Storage HIT (wav) for key={cache_key[:8]}")
                return res.content
        except Exception as e:
            logger.warning(f"Supabase Storage wav read error for key {cache_key[:8]}: {e}")

        return None

    def upload(self, cache_key: str, wav_bytes: bytes, text: str, voice: str, speed: float) -> Optional[str]:
        """Uploads WAV audio file to Supabase Storage bucket and upserts metadata record."""
        if not self.is_configured:
            return None

        is_mp3 = wav_bytes[:3] == b"ID3" or wav_bytes[:2] in (b"\xff\xfb", b"\xff\xf3", b"\xff\xf2")
        ext = "mp3" if is_mp3 else "wav"
        content_type = "audio/mpeg" if is_mp3 else "audio/wav"

        upload_url = f"{self.url}/storage/v1/object/{self.bucket}/{cache_key}.{ext}"
        headers = self._get_headers()
        headers["Content-Type"] = content_type
        headers["x-upsert"] = "true"

        try:
            upload_res = requests.post(upload_url, data=wav_bytes, headers=headers, timeout=12.0)
            if upload_res.status_code in [200, 201]:
                public_url = f"{self.url}/storage/v1/object/public/{self.bucket}/{cache_key}.{ext}"
                logger.info(f"Uploaded audio to Supabase Storage: {cache_key[:8]}.{ext}")
                
                self._upsert_metadata(cache_key, text, voice, speed, public_url, len(wav_bytes))
                return public_url
            else:
                logger.warning(f"Supabase upload returned status {upload_res.status_code}: {upload_res.text[:100]}")
        except Exception as e:
            logger.warning(f"Supabase upload exception for key {cache_key[:8]}: {e}")

        return None

    def _upsert_metadata(self, cache_key: str, text: str, voice: str, speed: float, public_url: str, byte_size: int):
        """Inserts/upserts metadata record into Supabase voice_cache_metadata table."""
        meta_url = f"{self.url}/rest/v1/voice_cache_metadata"
        headers = self._get_headers()
        headers["Content-Type"] = "application/json"
        headers["Prefer"] = "resolution=merge-duplicates"

        payload = {
            "cache_key": cache_key,
            "text": text,
            "voice": voice,
            "speed": speed,
            "public_url": public_url,
            "byte_size": byte_size,
            "created_at": "now()",
            "last_accessed": "now()"
        }

        try:
            requests.post(meta_url, json=payload, headers=headers, timeout=2.0)
        except Exception as e:
            logger.warning(f"Metadata upsert error: {e}")

    def get_stats(self) -> dict:
        """Returns Supabase Cloud Storage status."""
        return {
            "configured": self.is_configured,
            "url": self.url,
            "bucket": self.bucket
        }

supabase_cache = SupabaseCacheManager()
