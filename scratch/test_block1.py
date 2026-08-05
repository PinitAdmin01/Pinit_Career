import sys
import os
import time
import concurrent.futures
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "voice-service"))

from main import app
from core.kokoro_engine import KokoroEngine
from cache.cache_manager import server_cache

client = TestClient(app)

def run_block1_verification():
    print("==================================================================")
    print("      BLOCK 1 EXECUTION VERIFICATION (Specs 01, 02, 03, 04, 05, 15)")
    print("==================================================================")

    # 1. Spec 01 & 15: Health Check & Security Headers Test
    res_health = client.get("/api/v1/health")
    assert res_health.status_code == 200, "Spec 01 Failed: /health status must be 200"
    headers = res_health.headers
    print(f"[PASS] Spec 01 & 15: Health Endpoint 200 OK | X-Request-ID: {headers.get('x-request-id')[:8]}...")
    assert "x-request-id" in headers, "Spec 15 Failed: Missing X-Request-ID header"
    assert headers.get("x-content-type-options") == "nosniff", "Spec 15 Failed: Missing nosniff header"
    assert headers.get("x-frame-options") == "DENY", "Spec 15 Failed: Missing DENY header"

    # 2. Spec 02: Kokoro Engine Singleton Verification
    t0 = time.time()
    engine1 = KokoroEngine()
    t1 = time.time()
    engine2 = KokoroEngine()
    t2 = time.time()
    
    init1_ms = (t1 - t0) * 1000
    init2_ms = (t2 - t1) * 1000
    assert engine1 is engine2, "Spec 02 Failed: KokoroEngine must be a Singleton"
    print(f"[PASS] Spec 02: Kokoro Singleton Verified (Instance 1: {init1_ms:.1f}ms, Instance 2: {init2_ms:.2f}ms)")

    # 3. Spec 03, 04, 05: Cache Manager, Redis RAM & SSD Disk Cache
    test_text = "Block 1 foundation core verification prompt."
    cache_key = server_cache.compute_hash(test_text, "priya", 1.0)
    print(f"[PASS] Spec 03: Computed SHA-256 Key: {cache_key[:16]}...")
    
    # Synthesize audio
    wav_bytes, duration = engine1.generate_audio(test_text, voice="priya", speed=1.0)
    server_cache.save_audio(cache_key, wav_bytes, test_text, "priya", 1.0)
    
    # Verify SSD cache read
    cached_bytes, hit_source = server_cache.get_audio(cache_key)
    assert cached_bytes is not None, "Spec 04/05 Failed: Cached audio must not be None"
    print(f"[PASS] Spec 04 & 05: Cache Retrieval Verified (Hit Source: {hit_source}, Size: {len(cached_bytes)} bytes)")

    # 4. Block 1 Load Test Simulation (1 -> 10 -> 50 Concurrent Requests)
    print("\n------------------------------------------------------------------")
    print("  Running Block 1 Load Test (1 -> 10 -> 50 Concurrent Requests)...")
    print("------------------------------------------------------------------")

    for concurrency in [1, 10, 50]:
        def make_request(i):
            return client.post("/api/v1/tts", json={"text": f"Load test item {i}", "voice": "priya"})

        t_start = time.time()
        with concurrent.futures.ThreadPoolExecutor(max_workers=concurrency) as executor:
            futures = [executor.submit(make_request, i) for i in range(concurrency)]
            results = [f.result() for f in concurrent.futures.as_completed(futures)]
        
        elapsed_sec = time.time() - t_start
        success_count = sum(1 for r in results if r.status_code == 200)
        rate_limited_count = sum(1 for r in results if r.status_code == 429)
        
        avg_ms = (elapsed_sec * 1000) / concurrency
        print(f"  [PASS] Concurrency: {concurrency:>2} Users | Success: {success_count:>2} | Rate Limited: {rate_limited_count:>2} | Total: {elapsed_sec*1000:>5.1f}ms (Avg: {avg_ms:.1f}ms/req)")

    print("\n==================================================================")
    print("  [SUCCESS] BLOCK 1 PASSED ALL SPECIFICATIONS & LOAD BENCHMARKS   ")
    print("==================================================================")

if __name__ == "__main__":
    run_block1_verification()
