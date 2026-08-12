import os
import time
import io
import asyncio
import logging
from gtts import gTTS
import edge_tts

logger = logging.getLogger("voice_service.kokoro_engine")

class NeuralTTSEngine:
    """100% Human Neural Speech Engine (Edge-TTS + gTTS Fallback). Zero fan noise, zero ONNX weight files required."""

    _instance = None

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super(NeuralTTSEngine, cls).__new__(cls)
            cls._instance._init_voices()
        return cls._instance

    def _init_voices(self):
        self.sample_rate = 24000
        self.voices = {
            "priya": "en-IN-NeerjaNeural",
            "af_bella": "en-US-AvaNeural",
            "af_sarah": "en-US-EmmaNeural",
            "am_adam": "en-US-AndrewNeural",
            "bf_emma": "en-GB-SoniaNeural",
            "bm_george": "en-GB-RyanNeural",
            "mentor_female": "en-IN-NeerjaNeural",
            "mentor_male": "en-IN-PrabhatNeural",
        }
        logger.info("Initialized 100% Human Neural TTS Engine (Edge-TTS & gTTS).")

    def _get_edge_voice(self, voice_alias: str) -> str:
        return self.voices.get(voice_alias, "en-IN-NeerjaNeural")

    async def generate_audio_async(self, text: str, voice: str = "priya", speed: float = 1.0) -> tuple[bytes, float]:
        """Asynchronously synthesizes speech using Microsoft Edge Neural TTS with gTTS fallback."""
        t_start = time.time()
        edge_voice_name = self._get_edge_voice(voice)
        
        # Default rate boost (+12% for crisp 1.1x natural speech rate)
        effective_speed = speed * 1.12 if speed == 1.0 else speed
        rate_str = f"{int((effective_speed - 1.0) * 100):+d}%"

        try:
            communicate = edge_tts.Communicate(text, edge_voice_name, rate=rate_str)
            buffer = io.BytesIO()
            async for chunk in communicate.stream():
                if chunk["type"] == "audio":
                    buffer.write(chunk["data"])
            
            wav_bytes = buffer.getvalue()
            if len(wav_bytes) > 0:
                duration_sec = max(0.5, len(text) / 15.0)
                latency_ms = (time.time() - t_start) * 1000
                logger.info(f"Edge-TTS synthesized '{text[:30]}...' in {latency_ms:.1f}ms using voice={edge_voice_name}")
                return wav_bytes, duration_sec
        except Exception as e:
            logger.warning(f"Edge-TTS fallback to gTTS due to: {e}")

        # Fallback to gTTS if Edge-TTS network call fails
        try:
            lang_code = "en"
            tld = "co.in" if voice in ["priya", "mentor_female", "mentor_male"] else "com"
            tts = gTTS(text=text, lang=lang_code, tld=tld, slow=False)
            buffer = io.BytesIO()
            tts.write_to_fp(buffer)
            wav_bytes = buffer.getvalue()
            duration_sec = max(0.5, len(text) / 15.0)
            latency_ms = (time.time() - t_start) * 1000
            logger.info(f"gTTS synthesized '{text[:30]}...' in {latency_ms:.1f}ms")
            return wav_bytes, duration_sec
        except Exception as e:
            logger.error(f"gTTS synthesis failed: {e}")
            raise e

    def generate_audio(self, text: str, voice: str = "priya", speed: float = 1.0) -> tuple[bytes, float]:
        """Synchronous wrapper for generate_audio_async."""
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

# Alias export for backward compatibility
KokoroEngine = NeuralTTSEngine
kokoro_engine = NeuralTTSEngine()
engine = NeuralTTSEngine()
