from fastapi import APIRouter, Response, HTTPException
from services.kokoro_engine import KokoroEngine
from telemetry.metrics import telemetry
from config.settings import settings

router = APIRouter()
engine = KokoroEngine()

@router.get("/health")
def get_main_health():
    """Returns 200 OK system health status."""
    return {
        "status": "healthy",
        "service": settings.APP_NAME,
        "version": settings.APP_VERSION
    }

@router.get("/health/live")
def get_liveness_probe():
    """
    Phase 16: Kubernetes Liveness Probe.
    Returns 200 OK if the FastAPI process is responsive.
    """
    return {
        "status": "UP",
        "probe": "liveness",
        "service": settings.APP_NAME
    }

@router.get("/health/ready")
def get_readiness_probe():
    """
    Phase 16: Kubernetes Readiness Probe.
    Returns 200 OK if Kokoro engine is warm and system memory has sufficient headroom.
    """
    engine_status = engine.get_status()
    system_metrics = telemetry.get_system_metrics()

    # Memory headroom check (< 90% RSS memory usage limit)
    memory_mb = system_metrics["memory_rss_mb"]
    if memory_mb > 2048: # 2GB threshold
        raise HTTPException(
            status_code=503,
            detail=f"Service Unavailable: High Memory Usage ({memory_mb} MB)"
        )

    return {
        "status": "READY",
        "probe": "readiness",
        "onnx_active": engine_status["onnx_active"],
        "sample_rate": engine_status["sample_rate"],
        "memory_rss_mb": memory_mb,
        "uptime_seconds": system_metrics["uptime_seconds"]
    }

@router.get("/metrics")
def get_prometheus_metrics():
    """
    Phase 15: Prometheus Telemetry Endpoint.
    Returns standard Prometheus metrics text format for Grafana / CloudWatch scraping.
    """
    metrics_text = telemetry.generate_prometheus_text()
    return Response(content=metrics_text, media_type="text/plain; version=0.0.4; charset=utf-8")
