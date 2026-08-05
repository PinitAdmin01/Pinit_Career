import os
import sys
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.dirname(__file__))

from main import app

client = TestClient(app)

def test_health_probes_and_metrics():
    print("==================================================")
    print("  Testing Phase 15 & 16 Telemetry & Probes        ")
    print("==================================================")

    # 1. Liveness Probe Test
    res_live = client.get("/api/v1/health/live")
    print(f"[OK] Liveness Probe Status: {res_live.status_code}")
    print(f"[OK] Liveness Data: {res_live.json()}")
    assert res_live.status_code == 200, "Liveness probe must return 200 OK"
    assert res_live.json()["status"] == "UP", "Liveness status must be UP"

    # 2. Readiness Probe Test
    res_ready = client.get("/api/v1/health/ready")
    print(f"[OK] Readiness Probe Status: {res_ready.status_code}")
    print(f"[OK] Readiness Data: {res_ready.json()}")
    assert res_ready.status_code == 200, "Readiness probe must return 200 OK"
    assert res_ready.json()["status"] == "READY", "Readiness status must be READY"

    # 3. Prometheus Telemetry Endpoint Test
    res_metrics = client.get("/api/v1/metrics")
    print(f"[OK] Telemetry Endpoint Status: {res_metrics.status_code}")
    metrics_text = res_metrics.text
    print(f"[OK] Metrics Output Snippet:\n{metrics_text[:250]}")

    assert res_metrics.status_code == 200, "Metrics endpoint must return 200 OK"
    assert "tts_requests_total" in metrics_text, "Metrics text must contain tts_requests_total"
    assert "process_memory_rss_bytes" in metrics_text, "Metrics text must contain process_memory_rss_bytes"

    print("==================================================")
    print("[SUCCESS] Phase 15 & 16 Telemetry & Probes Passed!")

if __name__ == "__main__":
    test_health_probes_and_metrics()
