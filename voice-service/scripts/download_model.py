import os
import urllib.request
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("download_kokoro_model")

MODELS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "models")
os.makedirs(MODELS_DIR, exist_ok=True)

MODEL_URL = "https://github.com/resemble-ai/kokoro-onnx/releases/download/v0.1.0/kokoro-v0_19.onnx"
VOICES_URL = "https://github.com/resemble-ai/kokoro-onnx/releases/download/v0.1.0/voices.bin"

# Alternative HuggingFace direct mirrors
HF_MODEL_URL = "https://huggingface.co/hexgrad/Kokoro-82M/resolve/main/kokoro-v0_19.onnx"

def download_file(url: str, dest_path: str):
    if os.path.exists(dest_path) and os.path.getsize(dest_path) > 1000000:
        logger.info(f"File already exists: {dest_path} ({os.path.getsize(dest_path)} bytes)")
        return
    logger.info(f"Downloading Kokoro Neural ONNX Model from {url} to {dest_path}...")
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response, open(dest_path, 'wb') as out_file:
            data = response.read()
            out_file.write(data)
        logger.info(f"Successfully downloaded {dest_path} ({os.path.getsize(dest_path)} bytes)")
    except Exception as e:
        logger.warning(f"Failed to download from primary URL {url}: {e}")
        if url != HF_MODEL_URL and "kokoro" in dest_path:
            logger.info(f"Retrying with fallback mirror {HF_MODEL_URL}...")
            download_file(HF_MODEL_URL, dest_path)

if __name__ == "__main__":
    model_path = os.path.join(MODELS_DIR, "kokoro-v0_19.onnx")
    voices_path = os.path.join(MODELS_DIR, "voices.bin")
    
    download_file(MODEL_URL, model_path)
    download_file(VOICES_URL, voices_path)
    logger.info("Kokoro Neural Model Download Complete!")
