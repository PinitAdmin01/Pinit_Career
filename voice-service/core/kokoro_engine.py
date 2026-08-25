import os
import time
import io
import asyncio
import logging
import soundfile as sf
import urllib.request

logger = logging.getLogger("voice_service.kokoro_engine")

try:
    from kokoro_onnx import Kokoro
    HAS_KOKORO = True
except ImportError:
    HAS_KOKORO = False

class NeuralTTSEngine:
    """100% Pure Kokoro ONNX Neural Speech Engine with Auto-Downloader & Edge-TTS Fallback."""

    _instance = None

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super(NeuralTTSEngine, cls).__new__(cls)
            cls._instance._init_engine()
        return cls._instance

    def _init_engine(self):
        self.sample_rate = 24000
        self.kokoro = None
        self.voices = {
            "af_bella": "Bella (US Female)",
            "af_sarah": "Sarah (US Female)",
            "am_adam": "Adam (US Male)",
            "priya": "Priya (Indian Female)",
            "mentor_female": "AI Mentor Female",
            "mentor_male": "AI Mentor Male",
        }
        
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        models_dir = os.path.join(base_dir, "models")
        os.makedirs(models_dir, exist_ok=True)

        self.model_path = os.path.join(models_dir, "kokoro-v0_19.onnx")
        self.voices_path = os.path.join(models_dir, "voices.bin")

        # Auto-download model weights if missing
        self._ensure_model_files()

        if HAS_KOKORO and os.path.exists(self.model_path) and os.path.exists(self.voices_path):
            try:
                self.kokoro = Kokoro(self.model_path, self.voices_path)
                logger.info("Successfully loaded Kokoro ONNX Neural Engine into RAM!")
            except Exception as e:
                logger.error(f"Failed to load Kokoro ONNX: {e}")
        else:
            logger.warning("Kokoro ONNX model files missing or kokoro-onnx package not installed.")

    def get_status(self) -> dict:
        return {
            "status": "ready" if (self.kokoro is not None or HAS_KOKORO) else "fallback",
            "has_kokoro": HAS_KOKORO,
            "model_loaded": self.kokoro is not None,
            "sample_rate": self.sample_rate,
            "voices": list(self.voices.keys())
        }

    def _ensure_model_files(self):
        MODEL_URL = "https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files/kokoro-v0_19.onnx"
        VOICES_URL = "https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files/voices.bin"
        
        if not os.path.exists(self.model_path) or os.path.getsize(self.model_path) < 1000000:
            logger.info(f"Downloading Kokoro ONNX model weights from {MODEL_URL}...")
            try:
                urllib.request.urlretrieve(MODEL_URL, self.model_path)
                logger.info("Kokoro ONNX model download complete.")
            except Exception as e:
                logger.error(f"Failed to download Kokoro ONNX model: {e}")

        if not os.path.exists(self.voices_path) or os.path.getsize(self.voices_path) < 100000:
            logger.info(f"Downloading Kokoro voices weights from {VOICES_URL}...")
            try:
                urllib.request.urlretrieve(VOICES_URL, self.voices_path)
                logger.info("Kokoro voices download complete.")
            except Exception as e:
                logger.error(f"Failed to download Kokoro voices: {e}")

    async def generate_audio_async(self, text: str, voice: str = "priya", speed: float = 1.1) -> tuple[bytes, float]:
        """Synthesizes speech using Kokoro ONNX Neural Engine with automatic speed boost."""
        t_start = time.time()

        # Voice mapping for Kokoro ONNX style vectors
        kokoro_voice = "af_bella"
        lang = "en-us"
        if voice in ["priya", "mentor_female"]:
            kokoro_voice = "af_sarah"
        elif voice in ["am_adam", "mentor_male"]:
            kokoro_voice = "am_adam"
        elif voice == "af_bella":
            kokoro_voice = "af_bella"

        if self.kokoro is not None:
            try:
                samples, sample_rate = self.kokoro.create(
                    text,
                    voice=kokoro_voice,
                    speed=speed,
                    lang=lang
                )
                
                buffer = io.BytesIO()
                sf.write(buffer, samples, sample_rate, format='WAV', subtype='PCM_16')
                wav_bytes = buffer.getvalue()
                
                duration_sec = len(samples) / float(sample_rate)
                latency_ms = (time.time() - t_start) * 1000
                logger.info(f"Kokoro ONNX synthesized '{text[:30]}...' in {latency_ms:.1f}ms using voice={kokoro_voice} speed={speed}")
                return wav_bytes, duration_sec
            except Exception as e:
                logger.error(f"Kokoro ONNX synthesis error: {e}")

        # Edge-TTS fallback if Kokoro model fails
        import edge_tts
        communicate = edge_tts.Communicate(text, "en-IN-NeerjaNeural", rate="+12%")
        buffer = io.BytesIO()
        async for chunk in communicate.stream():
            if chunk["type"] == "audio":
                buffer.write(chunk["data"])
        wav_bytes = buffer.getvalue()
        duration_sec = max(0.5, len(text) / 15.0)
        return wav_bytes, duration_sec

    def generate_audio(self, text: str, voice: str = "priya", speed: float = 1.1) -> tuple[bytes, float]:
        try:
            loop = asyncio.get_event_loop()
            if loop.is_running():
                import nest_asyncio
                nest_asyncio.apply()
                return loop.run_until_complete(self.generate_audio_async(text, voice, speed))
            else:
                return loop.run_until_complete(self.generate_audio_async(text, voice, speed))
        except Exception:
            return asyncio.run(self.generate_audio_async(text, voice, speed))

KokoroEngine = NeuralTTSEngine
kokoro_engine = NeuralTTSEngine()
engine = NeuralTTSEngine()
