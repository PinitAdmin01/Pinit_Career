# Premium Cloud TTS Hosting (Render + Kokoro ONNX)

This document outlines the architecture, setup process, and integration plan for running a dedicated premium neural Text-to-Speech (TTS) engine on Render, bypassing the heavy RAM constraints of traditional PyTorch servers.

---

## 1. Core Architecture (FastAPI + Kokoro ONNX)

Instead of running PyTorch (which takes >2GB disk space and >1.5GB RAM just to initialize), we run a quantized version of the **Kokoro-82M** model in ONNX format via **FastAPI** and **ONNX Runtime CPU**.

* **Memory Footprint:** ~180MB RAM total (easily fits Render Free/Starter tiers).
* **Speed:** ~150ms generation time per sentence on CPU.
* **Concurrency:** Asynchronous queue handling via FastAPI thread pool execution.

---

## 2. Server Deployment Details

### dependencies (`requirements.txt`)
```text
fastapi>=0.100.0
uvicorn>=0.22.0
onnxruntime>=1.15.0
soundfile>=0.12.1
numpy>=1.24.0
kokoro-onnx>=0.1.0
```

### Server Script (`main.py`)
```python
import io
import soundfile as sf
from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from kokoro_onnx import Kokoro

app = FastAPI(title="PinIT Premium TTS Engine")

# Load model globally on startup (WASM/CPU optimized execution provider)
try:
    kokoro = Kokoro("model.onnx", "voices.json")
except Exception as e:
    print(f"Error loading model: {e}")
    kokoro = None

class TTSRequest(BaseModel):
    text: str
    voice: str = "af_heart"
    speed: float = 1.0

@app.post("/api/tts")
async def generate_speech(req: TTSRequest):
    if not kokoro:
        raise HTTPException(status_code=500, detail="TTS Engine not loaded")
    
    try:
        # Generate raw Float32 audio samples at 24kHz
        samples, sample_rate = kokoro.create(req.text, voice=req.voice, speed=req.speed)
        
        # Write to memory as standard WAV container
        wav_buf = io.BytesIO()
        sf.write(wav_buf, samples, sample_rate, format='WAV', subtype='PCM_16')
        wav_buf.seek(0)
        
        return StreamingResponse(wav_buf, media_type="audio/wav")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

### Docker container Configuration (`Dockerfile`)
```dockerfile
FROM python:3.10-slim

# Install system audio dependencies
RUN apt-get update && apt-get install -y \
    libsndfile1 \
    espeak-ng \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy model file and app
COPY model.onnx voices.json ./
COPY main.py .

EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

---

## 3. Web App Integration (`tts.ts`)

We configure the Next.js frontend to fetch audio binary streams directly from the Render URL, falling back instantly to local Web Speech Synthesis if the Render app is sleeping.

```typescript
export async function speakWithAvatar(
  text: string, 
  teacherId: string, 
  onStart: () => void, 
  onEnd: () => void
) {
  stopSpeaking();
  
  try {
    const response = await fetch('https://your-render-app.onrender.com/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, voice: KOKORO_VOICE_MAP[teacherId] })
    });
    
    if (!response.ok) throw new Error('Render TTS server error');

    const arrayBuffer = await response.arrayBuffer();
    const ctx = getAudioContext();
    const audioBuf = await ctx.decodeAudioData(arrayBuffer);

    const source = ctx.createBufferSource();
    activeSource = source;
    source.buffer = audioBuf;
    source.connect(ctx.destination);
    source.onended = onEnd;
    
    onStart();
    source.start(0);
  } catch (err) {
    console.warn('[TTS] Render request failed, falling back to local speech synthesis:', err);
    fallbackWebSpeech(text, teacherId, onStart, onEnd);
  }
}
```
