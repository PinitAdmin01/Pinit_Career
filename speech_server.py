import os
import sys
import tempfile
import urllib.request
import zipfile
import json
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from vosk import Model, KaldiRecognizer
import soundfile as sf

app = FastAPI()

# Enable CORS so the web app can communicate with localhost:3002
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_PATH = "model"
MODEL_URL = "https://alphacephei.com/vosk/models/vosk-model-small-en-us-0.15.zip"

def download_model():
    if not os.path.exists(MODEL_PATH):
        print("Vosk offline model not found locally. Downloading model (approx 40MB)...")
        temp_zip = os.path.join(tempfile.gettempdir(), "vosk-model.zip")
        urllib.request.urlretrieve(MODEL_URL, temp_zip)
        print("Extracting model...")
        with zipfile.ZipFile(temp_zip, 'r') as zip_ref:
            zip_ref.extractall(".")
        
        # Find extracted folder and rename to model
        extracted_dirs = [d for d in os.listdir(".") if d.startswith("vosk-model-small-en-us")]
        if extracted_dirs:
            os.rename(extracted_dirs[0], MODEL_PATH)
        print("Model downloaded and configured successfully!")

# Ensure model is ready
download_model()
model = Model(MODEL_PATH)

@app.post("/transcribe")
async def transcribe(file: UploadFile = File(...)):
    # Save the incoming WebM blob to a temporary file
    temp_webm = tempfile.mktemp(suffix=".webm")
    temp_wav = tempfile.mktemp(suffix=".wav")
    try:
        with open(temp_webm, "wb") as f:
            f.write(await file.read())

        # Read audio using soundfile and convert it to 16kHz mono PCM WAV for Vosk
        data, samplerate = sf.read(temp_webm)
        sf.write(temp_wav, data, 16000, subtype='PCM_16')

        # Read back processed wav file for Vosk
        rec = KaldiRecognizer(model, 16000)
        with open(temp_wav, "rb") as f:
            f.read(44) # Skip 44-byte WAV header
            while True:
                chunk = f.read(4000)
                if len(chunk) == 0:
                    break
                rec.AcceptWaveform(chunk)

        res = json.loads(rec.FinalResult())
        transcript = res.get("text", "")
        print(f"[Speech Server] Transcribed text: {transcript}")
        return {"text": transcript}

    except Exception as e:
        print(f"[Speech Server] Error processing audio: {str(e)}")
        return {"text": "", "error": str(e)}
    finally:
        # Clean up temporary files
        if os.path.exists(temp_webm):
            os.remove(temp_webm)
        if os.path.exists(temp_wav):
            os.remove(temp_wav)

if __name__ == "__main__":
    print("Starting Offline Python Speech Recognition Server on port 3002...")
    uvicorn.run(app, host="0.0.0.0", port=3002)
