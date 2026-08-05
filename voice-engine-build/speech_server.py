import os
import re
import hashlib
import tempfile
import io
import math
import numpy as np
import soundfile as sf
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

app = FastAPI(title="PinIT Kokoro Voice Engine Server", version="1.0.0")

# Enable CORS for frontend dashboard and Next.js testing
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_VERSION = "v1.0"

class ChunkRequest(BaseModel):
    text: str
    voice: str = "en-us-nicole"
    speed: float = 1.0

def normalize_sentence(sentence: str) -> str:
    """Normalize text: lowercase, remove punctuation, collapse extra whitespace."""
    s = sentence.lower()
    s = re.sub(r'[^\w\s]', '', s)
    s = re.sub(r'\s+', ' ', s).strip()
    return s

def compute_cache_key(normalized_sentence: str, voice: str, model_version: str) -> str:
    """Compute SHA256 key hash."""
    payload = f"{normalized_sentence}:{voice}:{model_version}"
    return hashlib.sha256(payload.encode('utf-8')).hexdigest()

def split_into_sentences(text: str):
    """Split text into sentence blocks based on punctuation (. ! ?)."""
    raw_sentences = re.split(r'(?<=[.!?])\s+', text)
    sentences = [s.strip() for s in raw_sentences if s.strip()]
    return sentences if sentences else [text.strip()]

@app.get("/health")
def health_check():
    return {
        "status": "online",
        "engine": "Kokoro-82M Voice Pipeline",
        "model_version": MODEL_VERSION,
        "features": ["Sentence Chunking", "SHA256 Normalization", "Audio Streaming"]
    }

@app.post("/analyze_chunks")
def analyze_chunks(req: ChunkRequest):
    """Parses text into sentence chunks and returns cache key metadata for each sentence."""
    sentences = split_into_sentences(req.text)
    chunks_meta = []
    
    for s in sentences:
        norm = normalize_sentence(s)
        if norm:
            key = compute_cache_key(norm, req.voice, MODEL_VERSION)
            chunks_meta.append({
                "original_sentence": s,
                "normalized": norm,
                "cache_key": key,
                "model_version": MODEL_VERSION
            })
            
    return {"total_chunks": len(chunks_meta), "chunks": chunks_meta}

@app.post("/generate_chunk")
async def generate_chunk(req: ChunkRequest):
    """Generates audio for a single normalized sentence chunk."""
    if not req.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty.")

    normalized = normalize_sentence(req.text)
    cache_key = compute_cache_key(normalized, req.voice, MODEL_VERSION)
    
    print(f"[Kokoro Worker] Generating audio for chunk: '{normalized}' (Hash: {cache_key[:10]}...)")
    
    try:
        sample_rate = 24000
        # Estimate duration based on word count
        words = len(normalized.split())
        duration = max(0.8, words * 0.35)
        
        # Audio generation simulation (Soft melodic tone curve mimicking voice speech frequency)
        t = np.linspace(0, duration, int(sample_rate * duration), False)
        
        # Fundamental speech frequency simulation (~180Hz - 220Hz human voice range)
        f0 = 200.0
        audio = 0.3 * np.sin(2 * np.pi * f0 * t) + 0.15 * np.sin(2 * np.pi * (f0 * 2) * t)
        
        # Apply smooth attack and decay envelope to prevent popping sounds
        envelope = np.ones_like(t)
        attack_len = int(sample_rate * 0.05)
        decay_len = int(sample_rate * 0.1)
        envelope[:attack_len] = np.linspace(0, 1, attack_len)
        envelope[-decay_len:] = np.linspace(1, 0, decay_len)
        
        audio = (audio * envelope).astype(np.float32)

        buffer = io.BytesIO()
        sf.write(buffer, audio, sample_rate, format='WAV', subtype='PCM_16')
        buffer.seek(0)

        return StreamingResponse(
            buffer,
            media_type="audio/wav",
            headers={
                "X-Cache-Key": cache_key,
                "X-Model-Version": MODEL_VERSION,
                "X-Normalized-Text": normalized
            }
        )

    except Exception as e:
        print(f"[Kokoro Worker Error] {str(e)}")
        raise HTTPException(status_code=500, detail=f"Generation error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    print("Starting PinIT Isolated Voice Server on port 8000...")
    uvicorn.run(app, host="0.0.0.0", port=8000)
