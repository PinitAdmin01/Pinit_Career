import os
import re
import hashlib
import tempfile
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, StreamingResponse
from pydantic import BaseModel
import soundfile as sf
import io

app = FastAPI(title="PinIT Kokoro Voice Service", version="1.0.0")

# Enable CORS for local Next.js dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_VERSION = "v1.0"

class TTSRequest(BaseModel):
    text: str
    voice: str = "en-us-nicole"
    speed: float = 1.0

def normalize_text(text: str) -> str:
    """Normalize text: lowercase, remove punctuation, collapse whitespace."""
    text = text.lower()
    text = re.sub(r'[^\w\s]', '', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def compute_cache_key(normalized_text: str, voice: str, model_version: str) -> str:
    """Compute SHA256 cache key hash."""
    payload = f"{normalized_text}:{voice}:{model_version}"
    return hashlib.sha256(payload.encode('utf-8')).hexdigest()

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "PinIT Kokoro Voice Engine", "version": MODEL_VERSION}

@app.post("/generate")
async def generate_tts(req: TTSRequest):
    if not req.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty.")
    
    normalized = normalize_text(req.text)
    cache_key = compute_cache_key(normalized, req.voice, MODEL_VERSION)
    
    print(f"[Kokoro TTS] Generating audio for hash: {cache_key} | Text: '{normalized}'")
    
    # Try Kokoro-ONNX / PyTorch TTS generation
    try:
        # Placeholder for Kokoro-82M pipeline execution
        # In actual deployment: kokoro.create(normalized, voice=req.voice, speed=req.speed)
        import numpy as np
        
        # Generate 1 second sample audio for MVP verification
        sample_rate = 24000
        duration = max(1.0, len(normalized) * 0.06)  # Approx duration based on length
        t = np.linspace(0, duration, int(sample_rate * duration), False)
        # Gentle audio tone simulation if Kokoro weights are downloading
        audio_data = (np.sin(2 * np.pi * 440 * t) * 0.1).astype(np.float32)
        
        buffer = io.BytesIO()
        sf.write(buffer, audio_data, sample_rate, format='WAV', subtype='PCM_16')
        buffer.seek(0)
        
        return StreamingResponse(
            buffer, 
            media_type="audio/wav",
            headers={"X-Cache-Key": cache_key, "X-Model-Version": MODEL_VERSION}
        )

    except Exception as e:
        print(f"[Kokoro Error] {str(e)}")
        raise HTTPException(status_code=500, detail=f"Generation failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    print("Starting PinIT Voice Engine Server on port 8000...")
    uvicorn.run(app, host="0.0.0.0", port=8000)
