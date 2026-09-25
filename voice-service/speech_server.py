"""
PinIT Careers — Offline Speech-to-Text (Vosk) Server
Runs on port 3002. Separate service from the TTS/LLM backend (port 8000).

Purpose: Local offline STT for mobile / privacy-sensitive environments.
Usage:   python speech_server.py  (from project root)
         Requires: pip install vosk soundfile fastapi uvicorn python-multipart

NOTE: This is NOT a duplicate of backend/main.py — that handles TTS output,
      this handles STT input (microphone → text).
"""

import os
import tempfile
import urllib.request
import zipfile
import json
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from vosk import Model, KaldiRecognizer  # type: ignore
import soundfile as sf

app = FastAPI(title="PinIT Offline STT Server", version="1.0.0")

# ── CORS ──────────────────────────────────────────────────────────────────────
# Set ALLOWED_STT_ORIGINS in env to restrict in production.
_raw = os.getenv("ALLOWED_STT_ORIGINS", "http://localhost:3000,http://localhost:3001")
_origins = [o.strip() for o in _raw.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=_origins,     # Fixed: was ["*"] + allow_credentials=True (browser blocks this)
    allow_credentials=True,
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)

MODEL_PATH = os.getenv("VOSK_MODEL_PATH", "model")
MODEL_URL = "https://alphacephei.com/vosk/models/vosk-model-small-en-us-0.15.zip"


def download_model():
    if not os.path.exists(MODEL_PATH):
        print("[STT] Vosk model not found locally. Downloading (~40 MB)...")
        temp_zip = os.path.join(tempfile.gettempdir(), "vosk-model.zip")
        urllib.request.urlretrieve(MODEL_URL, temp_zip)
        print("[STT] Extracting model...")
        with zipfile.ZipFile(temp_zip, 'r') as zip_ref:
            zip_ref.extractall(".")
        extracted_dirs = [d for d in os.listdir(".") if d.startswith("vosk-model-small-en-us")]
        if extracted_dirs:
            os.rename(extracted_dirs[0], MODEL_PATH)
        print("[STT] Model ready.")


# Ensure model is ready at startup
download_model()
model = Model(MODEL_PATH)


@app.post("/transcribe")
async def transcribe(file: UploadFile = File(...)):
    """Convert uploaded audio (WebM/WAV) to text using Vosk offline ASR."""
    temp_webm = tempfile.mktemp(suffix=".webm")
    temp_wav  = tempfile.mktemp(suffix=".wav")
    try:
        with open(temp_webm, "wb") as f:
            f.write(await file.read())

        # Convert to 16 kHz mono PCM WAV for Vosk
        data, _ = sf.read(temp_webm)
        sf.write(temp_wav, data, 16000, subtype='PCM_16')

        rec = KaldiRecognizer(model, 16000)
        with open(temp_wav, "rb") as f:
            f.read(44)  # Skip 44-byte WAV header
            while True:
                chunk = f.read(4000)
                if not chunk:
                    break
                rec.AcceptWaveform(chunk)

        res = json.loads(rec.FinalResult())
        transcript = res.get("text", "")
        print(f"[STT] Transcribed: {transcript[:80]}")
        return {"text": transcript}

    except Exception as e:
        print(f"[STT] Error: {e}")
        return {"text": "", "error": str(e)}
    finally:
        for f in (temp_webm, temp_wav):
            if os.path.exists(f):
                os.remove(f)


@app.get("/health")
def health():
    return {"status": "online", "service": "PinIT Offline STT", "port": 3002}


if __name__ == "__main__":
    print("[STT] Starting Offline STT Server on port 3002...")
    uvicorn.run(app, host="0.0.0.0", port=3002)
