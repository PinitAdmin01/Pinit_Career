import os
import sys
import time

sys.path.insert(0, os.path.dirname(__file__))

from cache.cache_manager import server_cache
from services.kokoro_engine import KokoroEngine

def test_server_cache_hierarchy():
    print("==================================================")
    print("  Testing Phase 5 & 6 Server Multi-Tier Caching   ")
    print("==================================================")

    engine = KokoroEngine()
    test_text = "Testing Phase 5 Redis RAM and Phase 6 SSD Disk caching layer."
    voice = "af_bella"
    speed = 1.0

    cache_key = server_cache.compute_hash(test_text, voice, speed)
    print(f"[OK] Computed SHA-256 Cache Key: {cache_key}")

    # 1. Initial lookup -> Expect Cache MISS
    cached_bytes_1, source_1 = server_cache.get_audio(cache_key)
    print(f"[OK] Initial Lookup: {source_1 or 'MISS (As Expected)'}")

    # 2. Synthesize audio via Kokoro Engine
    t0 = time.time()
    wav_bytes, duration = engine.generate_audio(test_text, voice, speed)
    synth_ms = (time.time() - t0) * 1000
    print(f"[OK] Synthesized audio ({len(wav_bytes)} bytes) in {synth_ms:.2f}ms")

    # 3. Save to Multi-Tier Cache (Redis RAM + SSD Disk)
    t_save = time.time()
    server_cache.save_audio(cache_key, wav_bytes, test_text, voice, speed)
    save_ms = (time.time() - t_save) * 1000
    print(f"[OK] Saved audio to Multi-Tier Cache in {save_ms:.2f}ms")

    # 4. Second lookup -> Expect Cache HIT (SSD_DISK_CACHE or REDIS_RAM_CACHE)
    t_hit = time.time()
    cached_bytes_2, source_2 = server_cache.get_audio(cache_key)
    hit_ms = (time.time() - t_hit) * 1000

    print(f"[OK] Second Lookup: HIT ({source_2}) in {hit_ms:.2f}ms")
    assert cached_bytes_2 is not None, "Cached bytes must not be None on 2nd lookup"
    assert len(cached_bytes_2) == len(wav_bytes), "Cached audio size must match synthesized size"
    assert source_2 in ["REDIS_RAM_CACHE", "SSD_DISK_CACHE"], "Cache hit source must be valid"

    metrics = server_cache.get_metrics()
    print(f"[INFO] Server Cache Metrics: {metrics}")

    print("==================================================")
    print("[SUCCESS] Phase 5 & 6 Server Cache Tests Passed!")

if __name__ == "__main__":
    test_server_cache_hierarchy()
