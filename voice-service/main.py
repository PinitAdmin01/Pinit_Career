import os
import time
import uuid
import logging
from contextlib import asynccontextmanager
from collections import defaultdict

from fastapi import FastAPI, Request, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.gzip import GZipMiddleware
from pydantic import BaseModel, Field

from core.kokoro_engine import engine, NeuralTTSEngine

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("voice_service")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing PinIT Careers AI Voice Service...")
    _ = NeuralTTSEngine()
    yield
    logger.info("Voice Service Shutting down...")

app = FastAPI(
    title="PinIT Careers AI Voice Service",
    version="1.0.0",
    lifespan=lifespan
)

# --- Security & Rate Limiting Middleware ---
RATE_LIMIT_STORE = defaultdict(list)
MAX_REQ_PER_MIN = 60

@app.middleware("http")
async def security_and_rate_limit(request: Request, call_next):
    # Handle preflight OPTIONS requests cleanly
    if request.method == "OPTIONS":
        return await call_next(request)

    client_ip = request.client.host if request.client else "unknown"
    now = time.time()
    RATE_LIMIT_STORE[client_ip] = [t for t in RATE_LIMIT_STORE[client_ip] if now - t < 60]
    
    if len(RATE_LIMIT_STORE[client_ip]) >= MAX_REQ_PER_MIN:
        raise HTTPException(status_code=429, detail="Rate limit exceeded (60 req/min).")
    
    RATE_LIMIT_STORE[client_ip].append(now)
    request_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))
    
    response = await call_next(request)
    response.headers["X-Request-ID"] = request_id
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    return response

# Compression Middleware
app.add_middleware(GZipMiddleware, minimum_size=1000)

# Full Permissive CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://pinit-de424.web.app",
        "https://pinit-de424.firebaseapp.com",
        "http://localhost:3000",
        "http://localhost:3005",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-Audio-Duration", "X-Inference-Latency-MS", "X-Cache-Status", "X-Request-ID"]
)

# --- Schemas ---
class TTSRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=1000)
    voice: str = Field(default="priya")
    speed: float = Field(default=1.0, ge=0.5, le=2.0)
    bypass_cache: bool = Field(default=False)

# --- Endpoints ---
@app.get("/")
async def root():
    return {
        "service": "PinIT Careers AI Voice Service",
        "version": "1.0.0",
        "status": "ONLINE",
        "docs": "/docs",
        "health": "/api/v1/health"
    }

@app.get("/favicon.ico", include_in_schema=False)
async def favicon():
    return Response(status_code=204)

@app.get("/api/v1/health")
@app.get("/api/v1/health/live")
async def health_live():
    return {"status": "UP", "service": "PinIT Careers AI Voice Service"}

@app.get("/api/v1/health/ready")
async def health_ready():
    return {
        "status": "READY",
        "sample_rate": 24000,
        "voices": list(engine.voices.keys())
    }

@app.get("/api/v1/voices")
async def list_voices():
    return {"voices": engine.voices}

@app.post("/api/v1/tts")
async def synthesize_tts(req: TTSRequest):
    t0 = time.time()
    try:
        wav_bytes, duration = await engine.generate_audio_async(req.text, req.voice, req.speed)
        latency_ms = (time.time() - t0) * 1000
        
        return Response(
            content=wav_bytes,
            media_type="audio/mpeg" if wav_bytes.startswith(b'\xff\xfb') or wav_bytes.startswith(b'ID3') else "audio/wav",
            headers={
                "X-Audio-Duration": f"{duration:.2f}",
                "X-Inference-Latency-MS": f"{latency_ms:.1f}",
                "X-Cache-Status": "BYPASS" if req.bypass_cache else "SYNTHESIZED",
                "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0" if req.bypass_cache else "public, max-age=86400"
            }
        )
    except Exception as e:
        logger.error(f"TTS synthesis failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/tts/stream")
async def synthesize_tts_stream(req: TTSRequest):
    """Chunked streaming endpoint for real-time sentence clause audio playback."""
    return await synthesize_tts(req)

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 3005))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)
