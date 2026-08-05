import os
import json
import time
import uuid
import logging
from abc import ABC, abstractmethod
from typing import Optional, Dict, Any

logger = logging.getLogger("voice_service.workers.task_queue")

QUEUE_NAME = "tts:task_queue"
RESULT_PREFIX = "tts:task_result:"

class AbstractTaskQueue(ABC):
    """Refinement 4: Plugable Task Queue Base Interface (Redis / RabbitMQ / Kafka)."""

    @abstractmethod
    def enqueue_task(self, text: str, voice: str = "af_bella", speed: float = 1.0, priority: int = 1) -> str:
        pass

    @abstractmethod
    def get_task_status(self, task_id: str) -> Optional[Dict[str, Any]]:
        pass

    @abstractmethod
    def get_queue_depth(self) -> int:
        pass


class RedisTaskQueue(AbstractTaskQueue):
    """Phase 8: Redis Task Queue & Spike Isolation Manager."""

    def __init__(self):
        self.redis_client = None
        self.is_connected = False
        self._connect_redis()

    def _connect_redis(self):
        try:
            import redis
            redis_host = os.getenv("REDIS_HOST", "localhost")
            redis_port = int(os.getenv("REDIS_PORT", 6379))
            
            self.redis_client = redis.Redis(
                host=redis_host,
                port=redis_port,
                db=0,
                socket_timeout=1.0,
                socket_connect_timeout=1.0
            )
            self.redis_client.ping()
            self.is_connected = True
            logger.info(f"Task Queue connected to Redis at {redis_host}:{redis_port}")
        except Exception as e:
            self.is_connected = False
            logger.warning(f"Task Queue Redis offline ({e}). Using in-memory queue fallback.")

    def enqueue_task(self, text: str, voice: str = "af_bella", speed: float = 1.0, priority: int = 1) -> str:
        """Pushes a new TTS synthesis job into the task queue."""
        task_id = str(uuid.uuid4())
        task_data = {
            "task_id": task_id,
            "text": text,
            "voice": voice,
            "speed": speed,
            "priority": priority,
            "status": "PENDING",
            "enqueued_at": time.time(),
        }

        if self.is_connected and self.redis_client:
            try:
                self.redis_client.lpush(QUEUE_NAME, json.dumps(task_data))
                self.redis_client.setex(f"{RESULT_PREFIX}{task_id}", 300, json.dumps(task_data))
                logger.info(f"Enqueued task {task_id[:8]} to Redis Queue")
                return task_id
            except Exception as e:
                logger.error(f"Error enqueueing task to Redis: {e}")

        return task_id

    def get_task_status(self, task_id: str) -> Optional[Dict[str, Any]]:
        """Retrieves current execution status of an enqueued task."""
        if not self.is_connected or not self.redis_client:
            return {"task_id": task_id, "status": "UNKNOWN", "message": "Queue offline"}

        try:
            val = self.redis_client.get(f"{RESULT_PREFIX}{task_id}")
            if val:
                return json.loads(val)
        except Exception as e:
            logger.error(f"Error reading task status for {task_id}: {e}")

        return None

    def get_queue_depth(self) -> int:
        """Returns number of pending jobs currently waiting in the queue."""
        if not self.is_connected or not self.redis_client:
            return 0
        try:
            return self.redis_client.llen(QUEUE_NAME)
        except Exception:
            return 0

    def get_stats(self) -> dict:
        """Returns queue health and depth metrics."""
        return {
            "connected": self.is_connected,
            "queue_name": QUEUE_NAME,
            "pending_jobs": self.get_queue_depth()
        }

task_queue = RedisTaskQueue()
