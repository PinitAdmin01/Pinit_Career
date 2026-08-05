"""
PinIT Career OS — FastAPI Voice Cache Backend
Entry point: runs on port 8000 by default.

Endpoints:
  POST /api/tts          → Generate or serve cached TTS audio
  GET  /api/cache/hash   → Cache key lookup
  GET  /api/cache/stats  → Cache statistics
  POST /api/chat         → LLM chat proxy (OpenRouter)
  GET  /health           → Health check
"""

import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.api import tts, cache, chat
from app.services.cache_service import get_redis, close_redis


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup: connect Redis. Shutdown: close Redis."""
    await get_redis()
    print("[PinIT Backend] Redis connected.")
    yield
    await close_redis()
    print("[PinIT Backend] Redis connection closed.")


app = FastAPI(
    title="PinIT Career OS — Voice Cache Backend",
    description="Production TTS engine with Redis caching, sentence-level SHA256 hashing, multi-language support, and streaming delivery.",
    version="2.0.0",
    lifespan=lifespan,
)

# ── CORS ─────────────────────────────────────────────────────────────────────
# In production, restrict to your domain.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Static Audio Files ────────────────────────────────────────────────────────
# Serve generated audio directly at /audio/{lang}/{hash}.mp3
STORAGE_DIR = os.path.join(os.path.dirname(__file__), "storage", "audio")
os.makedirs(STORAGE_DIR, exist_ok=True)
app.mount("/audio", StaticFiles(directory=STORAGE_DIR), name="audio")

# ── API Routes ────────────────────────────────────────────────────────────────
app.include_router(tts.router,   prefix="/api")
app.include_router(cache.router, prefix="/api")
app.include_router(chat.router,  prefix="/api")


@app.get("/health")
def health_check():
    return {
        "status": "online",
        "service": "PinIT Voice Cache Backend",
        "version": "2.0.0",
        "features": [
            "Redis LRU Cache",
            "SHA256 Voice Hashing",
            "Sentence-Level Chunking",
            "Multi-Language Support",
            "Kokoro 82M TTS",
            "Audio Streaming",
        ],
    }


if __name__ == "__main__":
    import uvicorn
    print("Starting PinIT Voice Cache Backend on port 8000...")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
