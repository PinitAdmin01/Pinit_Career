import os
import sys
import json
import time
import base64
import logging

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from services.kokoro_engine import KokoroEngine
from cache.cache_manager import server_cache
from workers.task_queue import task_queue, RESULT_PREFIX

logger = logging.getLogger("voice_service.workers.worker_pool")


class KokoroWorkerPool:
    """Pre-warmed worker pool for async TTS jobs."""

    def __init__(self, num_workers: int = 2):
        self.num_workers = num_workers
        self.engine = KokoroEngine()
        self.is_running = False
        logger.info(f"Initialized Worker Pool with {num_workers} workers")

    def process_single_job(self, task_data: dict) -> dict:
        task_id = task_data["task_id"]
        text = task_data["text"]
        voice = task_data.get("voice", "af_bella")
        speed = task_data.get("speed", 1.0)

        start_time = time.time()
        logger.info(f"Worker processing task {task_id[:8]}: '{text[:30]}...'")

        cache_key = server_cache.compute_hash(text, voice, speed)
        wav_bytes, hit_source = server_cache.get_audio(cache_key)

        if not wav_bytes:
            wav_bytes, duration_sec, _media = self.engine.generate_audio_sync(text, voice, speed)
            server_cache.save_audio(cache_key, wav_bytes, text, voice, speed)
            source = "SYNTHESIZED"
        else:
            duration_sec = max(0.6, len(text) / (14.0 * max(0.5, float(speed))))
            source = f"CACHE ({hit_source})"

        latency_ms = int((time.time() - start_time) * 1000)
        encoded_audio = base64.b64encode(wav_bytes).decode("utf-8")

        result_payload = {
            "task_id": task_id,
            "status": "COMPLETED",
            "voice": voice,
            "speed": speed,
            "duration_sec": duration_sec,
            "latency_ms": latency_ms,
            "source": source,
            "audio_base64": encoded_audio,
            "byte_size": len(wav_bytes),
            "completed_at": time.time(),
        }

        if task_queue.is_connected and task_queue.redis_client:
            try:
                task_queue.redis_client.setex(
                    f"{RESULT_PREFIX}{task_id}",
                    600,
                    json.dumps(result_payload),
                )
            except Exception as e:
                logger.error(f"Error writing worker result to Redis: {e}")

        logger.info(f"Worker completed task {task_id[:8]} in {latency_ms}ms ({source})")
        return result_payload


worker_pool = KokoroWorkerPool()
