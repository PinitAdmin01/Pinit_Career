import os
import sys
import base64
import time

sys.path.insert(0, os.path.dirname(__file__))

from workers.task_queue import task_queue
from workers.worker_pool import worker_pool

def test_worker_queue_system():
    print("==================================================")
    print("  Testing Phase 8 & 9 Task Queue & Worker Pool   ")
    print("==================================================")

    # 1. Enqueue task
    test_text = "Testing spike isolation Redis queue and pre-warmed Kokoro worker pool."
    task_id = task_queue.enqueue_task(text=test_text, voice="priya", speed=1.0)
    print(f"[OK] Enqueued Task ID: {task_id}")
    assert task_id is not None, "Enqueued task_id must not be None"

    # 2. Process job via worker pool
    job_payload = {
        "task_id": task_id,
        "text": test_text,
        "voice": "priya",
        "speed": 1.0,
    }
    
    t0 = time.time()
    result = worker_pool.process_single_job(job_payload)
    elapsed_ms = (time.time() - t0) * 1000

    print(f"[OK] Worker Executed Job {task_id[:8]} in {elapsed_ms:.2f}ms")
    print(f"[OK] Result Status: {result['status']} | Audio Size: {result['byte_size']} bytes")
    
    assert result["status"] == "COMPLETED", "Worker execution status must be COMPLETED"
    assert result["byte_size"] > 2000, "Audio byte size must be greater than 2000"
    
    # Decode audio base64 to verify binary structure
    wav_bytes = base64.b64decode(result["audio_base64"])
    assert len(wav_bytes) == result["byte_size"], "Decoded audio size must match payload byte_size"

    print("==================================================")
    print("[SUCCESS] Phase 8 & 9 Task Queue & Worker Pool Tests Passed!")

if __name__ == "__main__":
    test_worker_queue_system()
