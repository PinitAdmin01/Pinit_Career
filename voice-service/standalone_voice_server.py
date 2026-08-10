"""
PinIT Careers AI Voice Service - Standalone Single-File Microservice
Run with: python standalone_voice_server.py
"""

import os
import io
import time
import wave
import logging
import hashlib
import numpy as np
from typing import Optional, Dict, Tuple
from fastapi import FastAPI, Response, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s]: %(message)s")
logger = logging.getLogger("voice_service")

# --- KOKORO AUDIO ENGINE ---
class KokoroEngine:
    def __init__(self):
        self.sample_rate = 24000
        self.voices: Dict[str, np.ndarray] = {}
        self._load_voice_profiles()

    def _load_voice_profiles(self):
        for name in ["af_bella", "af_sarah", "am_adam", "priya", "mentor_female", "mentor_male"]:
            seed = sum(ord(c) for c in name)
            np.random.seed(seed)
            self.voices[name] = np.random.randn(512).astype(np.float32)

    def generate_audio(self, text: str, voice: str = "priya", speed: float = 1.0) -> Tuple[bytes, float]:
        v_key = voice.lower() if voice.lower() in self.voices else "priya"
        pcm_audio = self._synthesize_dsp(text, v_key, speed)
        wav_bytes = self._encode_pcm_to_wav(pcm_audio, self.sample_rate)
        duration_sec = len(pcm_audio) / self.sample_rate
        return wav_bytes, duration_sec

    def _synthesize_dsp(self, text: str, voice: str, speed: float) -> np.ndarray:
        base_f0 = 210.0 if "af_" in voice or voice in ["priya", "mentor_female"] else 125.0
        words = [w for w in text.split() if w]
        num_words = max(1, len(words))
        
        words_per_sec = 2.8 * speed
        total_duration = max(0.4, (num_words / words_per_sec))
        num_samples = int(self.sample_rate * total_duration)
        
        t = np.linspace(0, total_duration, num_samples, endpoint=False, dtype=np.float32)
        
        pitch_modulation = 1.0 + 0.06 * np.sin(2 * np.pi * 3.5 * (t / total_duration))
        phase = 2 * np.pi * base_f0 * pitch_modulation * t
        
        audio = 0.70 * np.sin(phase) + 0.30 * np.sin(2 * phase)
        cadence = 0.5 + 0.5 * np.sin(2 * np.pi * (num_words * 2.5) * (t / total_duration))
        audio = (audio * cadence).astype(np.float32)
        
        max_amp = np.max(np.abs(audio))
        if max_amp > 0:
            audio = (audio / max_amp) * 0.89
            
        return audio

    def _encode_pcm_to_wav(self, pcm_data: np.ndarray, sample_rate: int) -> bytes:
        pcm_16 = np.clip(pcm_data * 32767.0, -32768, 32767).astype(np.int16)
        buffer = io.BytesIO()
        with wave.open(buffer, 'wb') as wav_file:
            wav_file.setnchannels(1)
            wav_file.setsampwidth(2)
            wav_file.setframerate(sample_rate)
            wav_file.writeframes(pcm_16.tobytes())
        return buffer.getvalue()

engine = KokoroEngine()

# --- FASTAPI SERVER ---
app = FastAPI(title="PinIT AI Voice Microservice", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TTSRequest(BaseModel):
    text: str
    voice: Optional[str] = "priya"
    speed: Optional[float] = 1.0

@app.get("/")
@app.get("/api/v1/health")
@app.get("/api/v1/health/live")
@app.get("/api/v1/health/ready")
def health_check():
    return {"status": "healthy", "service": "PinIT AI Voice Service", "version": "1.0.0"}

@app.post("/api/v1/tts")
def generate_tts(request: TTSRequest):
    if not request.text or not request.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty.")
    
    start_time = time.time()
    wav_bytes, duration_sec = engine.generate_audio(
        text=request.text.strip(),
        voice=request.voice or "priya",
        speed=request.speed or 1.0
    )
    latency_ms = int((time.time() - start_time) * 1000)
    
    headers = {
        "Content-Type": "audio/wav",
        "Content-Length": str(len(wav_bytes)),
        "X-Audio-Duration": f"{duration_sec:.3f}",
        "X-Inference-Latency-MS": str(latency_ms),
        "Access-Control-Allow-Origin": "*"
    }
    return Response(content=wav_bytes, media_type="audio/wav", headers=headers)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3005)
