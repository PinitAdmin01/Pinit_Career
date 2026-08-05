import os
import sys
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.dirname(__file__))

from main import app

client = TestClient(app)

def test_security_and_compression_middleware():
    print("==================================================")
    print("  Testing Phase 13 & 14 Security & Compression    ")
    print("==================================================")

    # 1. Health check & security headers test
    res = client.get("/api/v1/health")
    assert res.status_code == 200, f"Health check failed: {res.status_code}"
    
    headers = res.headers
    print(f"[OK] X-Content-Type-Options: {headers.get('x-content-type-options')}")
    print(f"[OK] X-Frame-Options: {headers.get('x-frame-options')}")
    print(f"[OK] X-RateLimit-Limit: {headers.get('x-ratelimit-limit')}")

    assert headers.get("x-content-type-options") == "nosniff", "Missing X-Content-Type-Options header"
    assert headers.get("x-frame-options") == "DENY", "Missing X-Frame-Options header"
    assert headers.get("x-ratelimit-limit") == "60", "Missing X-RateLimit-Limit header"

    # 2. Gzip compression test
    res_gzip = client.post(
        "/api/v1/tts",
        json={"text": "Testing Gzip audio response compression middleware payload.", "voice": "priya"},
        headers={"Accept-Encoding": "gzip"}
    )
    print(f"[OK] TTS Response Status: {res_gzip.status_code}")
    print(f"[OK] Content-Encoding Header: {res_gzip.headers.get('content-encoding')}")
    print(f"[OK] Content Length: {len(res_gzip.content)} bytes")

    assert res_gzip.status_code == 200, "TTS response status must be 200"
    assert res_gzip.headers.get("content-encoding") == "gzip", "Response must be gzip compressed"

    print("==================================================")
    print("[SUCCESS] Phase 13 & 14 Security & Compression Tests Passed!")

if __name__ == "__main__":
    test_security_and_compression_middleware()
