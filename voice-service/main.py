import os
import sys
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response

# Ensure voice-service directory is in sys.path
sys.path.insert(0, os.path.dirname(__file__))

from config.settings import settings
from api.routes_tts import router as tts_router
from services.kokoro_engine import KokoroEngine

# Setup logging configuration
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("voice_service")

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager for startup pre-warming & shutdown cleanup."""
    logger.info("Initializing PinIT Careers AI Voice Service...")
    engine = KokoroEngine()
    status = engine.get_status()
    logger.info(
        f"Neural TTS pre-warmed. engine={status.get('engine')} "
        f"edge={status.get('edge_active')} onnx={status.get('onnx_active')} "
        f"init_ms={status.get('init_time_ms')}"
    )
    if not status.get("edge_active") and not status.get("onnx_active"):
        logger.error(
            "CRITICAL: No neural TTS backend available. "
            "Install edge-tts (pip install edge-tts) and redeploy."
        )
    yield
    logger.info("Shutting down AI Voice Service...")

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Decoupled Text-to-Speech (TTS) Microservice for PinIT Careers AI Mentor Avatars (Edge-TTS Neural v3.0)",
    lifespan=lifespan
)

from middleware.security import SecurityAndRateLimitMiddleware
from starlette.middleware.gzip import GZipMiddleware

# Apply Security & Rate Limiting Middleware (Phase 13)
app.add_middleware(SecurityAndRateLimitMiddleware)

# Apply Gzip Response Compression Middleware (Phase 14 - minimum 1000 bytes)
app.add_middleware(GZipMiddleware, minimum_size=1000)

# Apply CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=[
        "X-Voice-Engine",
        "X-Audio-Duration",
        "X-Cache-Status",
        "X-Cache-Key",
        "X-Inference-Latency-MS",
    ],
)

from api.routes_health import router as health_router

# Register routes
app.include_router(tts_router, prefix="/api/v1")
app.include_router(health_router, prefix="/api/v1")

@app.get("/")
async def root():
    return {
        "service": "PinIT Careers AI Voice Service",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/api/v1/health"
    }

@app.get("/favicon.ico", include_in_schema=False)
async def favicon():
    return Response(status_code=204)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=False
    )
