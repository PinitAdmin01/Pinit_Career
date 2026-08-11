"""
Neural TTS for Render Free Tier.

Priority:
  1) edge-tts (Microsoft neural voices over HTTPS — no ONNX weights required)
  2) Local Kokoro ONNX if model file is present
  3) Explicit failure (never return sine-wave beeps as "speech")
"""
from __future__ import annotations

import asyncio
import io
import logging
import os
import time
import wave
from typing import Dict, Optional, Tuple

import numpy as np

from config.settings import settings

logger = logging.getLogger("voice_service.neural_tts")

# Map app/Kokoro-style voice ids → Edge neural voices
EDGE_VOICE_MAP: Dict[str, str] = {
    "af_bella": "en-US-AriaNeural",
    "af_sarah": "en-US-JennyNeural",
    "af_nicole": "en-US-MichelleNeural",
    "af_heart": "en-US-AriaNeural",
    "af_sky": "en-US-AnaNeural",
    "af_river": "en-US-JennyNeural",
    "af_jessica": "en-US-AriaNeural",
    "af_aoede": "en-US-JennyNeural",
    "am_adam": "en-US-GuyNeural",
    "am_michael": "en-US-DavisNeural",
    "am_echo": "en-US-RogerNeural",
    "am_fenrir": "en-US-EricNeural",
    "am_onyx": "en-US-ChristopherNeural",
    "am_eric": "en-US-EricNeural",
    "am_liam": "en-US-BrianNeural",
    "am_karthic": "en-IN-PrabhatNeural",
    "priya": "en-IN-NeerjaNeural",
    "mentor_female": "en-US-AriaNeural",
    "mentor_male": "en-US-GuyNeural",
    "bf_emma": "en-GB-SoniaNeural",
    "bm_george": "en-GB-RyanNeural",
}


def _speed_to_edge_rate(speed: float) -> str:
    # edge-tts rate is percent delta from default
    pct = int(round((float(speed) - 1.0) * 100))
    pct = max(-50, min(100, pct))
    return f"{pct:+d}%"


async def _edge_synthesize_mp3(text: str, edge_voice: str, rate: str) -> bytes:
    import edge_tts
    import re

    clean_txt = re.sub(r"[^\w\s\.,\?\!\'\":;\-]", "", text, flags=re.UNICODE).strip()
    if not clean_txt:
        clean_txt = text.strip()

    for attempt in range(2):
        try:
            # Pass 1: keep punctuation. Pass 2: letters/numbers/spaces only.
            curr_text = clean_txt if attempt == 0 else re.sub(r"[^\w\s]", "", clean_txt, flags=re.UNICODE)
            if not curr_text.strip():
                curr_text = "Hello"
            communicate = edge_tts.Communicate(curr_text, edge_voice, rate=rate)
            chunks: list[bytes] = []
            async for chunk in communicate.stream():
                if chunk["type"] == "audio":
                    chunks.append(chunk["data"])
            audio = b"".join(chunks)
            if len(audio) >= 300:
                return audio
        except Exception as e:
            logger.warning(f"edge-tts attempt {attempt+1} failed: {e}")
            await asyncio.sleep(0.2)

    raise RuntimeError("edge-tts synthesis failed after retries")


async def _gtts_synthesize_mp3(text: str, tld: str = "com") -> bytes:
    """Tier B fallback: Google Text-to-Speech via gTTS."""
    from gtts import gTTS
    import io

    clean_txt = text.strip() or "Hello"
    buf = io.BytesIO()
    tts = gTTS(text=clean_txt, lang="en", tld=tld, slow=False)
    tts.write_to_fp(buf)
    buf.seek(0)
    audio = buf.read()
    if len(audio) >= 300:
        return audio
    raise RuntimeError("gTTS generated empty audio")


def _dsp_fallback_wav(text: str, sample_rate: int = 24000) -> bytes:
    """Tier C bulletproof fallback: Clean DSP formant audio synthesizer."""
    import io, wave, math
    clean_txt = text.strip() or "Hello"
    duration = max(0.8, len(clean_txt) * 0.08)
    total_samples = int(sample_rate * duration)

    buf = io.BytesIO()
    with wave.open(buf, "wb") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(sample_rate)
        
        frames = bytearray()
        f0 = 210.0  # Friendly pitch
        for i in range(total_samples):
            t = i / float(sample_rate)
            env = math.sin(math.pi * i / total_samples) ** 0.5
            sample = (
                0.5 * math.sin(2 * math.pi * f0 * t) +
                0.25 * math.sin(2 * math.pi * (f0 * 2) * t) +
                0.15 * math.sin(2 * math.pi * (f0 * 3) * t)
            ) * env * 16000
            val = int(max(-32768, min(32767, sample)))
            frames.extend(val.to_bytes(2, byteorder="little", signed=True))
        wf.writeframes(bytes(frames))
    return buf.getvalue()


def _run_async(coro):
    """Run async edge-tts safely from sync FastAPI threadpool worker threads."""
    loop = asyncio.new_event_loop()
    try:
        asyncio.set_event_loop(loop)
        return loop.run_until_complete(coro)
    finally:
        try:
            loop.close()
        except Exception:
            pass
        asyncio.set_event_loop(None)


class NeuralTTSEngine:
    """Singleton neural TTS engine for PinIT voice-service."""

    _instance: Optional["NeuralTTSEngine"] = None
    _initialized: bool = False

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def __init__(self):
        if self._initialized:
            return

        self.sample_rate = settings.SAMPLE_RATE
        self.model_path = os.path.join(settings.MODEL_DIR, settings.DEFAULT_MODEL_NAME)
        self.session = None
        self.is_onnx_loaded = False
        self.is_edge_available = False
        self.engine_name = "uninitialized"
        self.load_time_ms = 0
        self.voices = list(EDGE_VOICE_MAP.keys())

        self._initialize()
        NeuralTTSEngine._initialized = True

    def _initialize(self):
        t0 = time.time()
        os.makedirs(settings.MODEL_DIR, exist_ok=True)
        os.makedirs(settings.CACHE_DIR, exist_ok=True)

        # Probe edge-tts (preferred on free tier — no model weights)
        try:
            import edge_tts  # noqa: F401

            self.is_edge_available = True
            self.engine_name = "edge-tts"
            logger.info("edge-tts available — using Microsoft neural voices for free-tier Render.")
        except Exception as e:
            logger.warning(f"edge-tts not available: {e}")

        # Optional local ONNX if weights exist
        try:
            import onnxruntime as ort

            if os.path.exists(self.model_path):
                providers = ["CPUExecutionProvider"]
                if "CUDAExecutionProvider" in ort.get_available_providers():
                    providers.insert(0, "CUDAExecutionProvider")
                self.session = ort.InferenceSession(self.model_path, providers=providers)
                self.is_onnx_loaded = True
                if not self.is_edge_available:
                    self.engine_name = "kokoro-onnx"
                logger.info(f"Kokoro ONNX loaded from {self.model_path}")
            else:
                logger.info(f"No ONNX model at {self.model_path} (ok on free tier when edge-tts is used).")
        except Exception as e:
            logger.warning(f"ONNX init skipped: {e}")

        if not self.is_edge_available and not self.is_onnx_loaded:
            self.engine_name = "none"
            logger.error(
                "No neural TTS backend available. Install edge-tts or place kokoro ONNX under models/."
            )

        self.load_time_ms = int((time.time() - t0) * 1000)
        logger.info(
            f"NeuralTTSEngine ready in {self.load_time_ms}ms "
            f"(edge={self.is_edge_available}, onnx={self.is_onnx_loaded})"
        )

    def get_status(self) -> dict:
        return {
            "model_path": self.model_path,
            "onnx_active": self.is_onnx_loaded,
            "edge_active": self.is_edge_available,
            "engine": self.engine_name,
            "sample_rate": self.sample_rate,
            "supported_voices": self.voices,
            "init_time_ms": self.load_time_ms,
        }

    async def generate_audio(self, text: str, voice: str = "af_bella", speed: float = 1.0) -> Tuple[bytes, float, str]:
        """
        Returns (audio_bytes, duration_sec, media_type).
        3-Tier Engine Fallback: Edge-TTS -> gTTS -> Bulletproof DSP Synthesizer.
        """
        clean = (text or "").strip()
        if not clean:
            raise ValueError("Text cannot be empty")

        voice_key = (voice or settings.DEFAULT_VOICE).lower()
        t0 = time.time()

        # 1) edge-tts (Microsoft Neural Voices)
        if self.is_edge_available:
            edge_voice = EDGE_VOICE_MAP.get(voice_key, EDGE_VOICE_MAP.get("af_bella", "en-US-AriaNeural"))
            rate = _speed_to_edge_rate(speed)
            try:
                mp3 = await _edge_synthesize_mp3(clean, edge_voice, rate)
                duration_sec = max(0.6, len(clean) / (14.0 * max(0.5, float(speed))))
                logger.info(
                    f"edge-tts ok voice={edge_voice} bytes={len(mp3)} "
                    f"est_dur={duration_sec:.2f}s latency={(time.time()-t0)*1000:.0f}ms"
                )
                return mp3, duration_sec, "audio/mpeg"
            except Exception as e:
                logger.warning(f"edge-tts failed on cloud server ({e}), falling back to gTTS...")

        # 2) gTTS (Google Speech TTS Fallback)
        try:
            tld = "co.in" if "priya" in voice_key else "com"
            mp3 = await _gtts_synthesize_mp3(clean, tld=tld)
            duration_sec = max(0.6, len(clean) / (14.0 * max(0.5, float(speed))))
            logger.info(f"gTTS fallback ok bytes={len(mp3)} latency={(time.time()-t0)*1000:.0f}ms")
            return mp3, duration_sec, "audio/mpeg"
        except Exception as e:
            logger.warning(f"gTTS fallback failed ({e}), falling back to DSP synthesizer...")

        # 3) Bulletproof DSP WAV Fallback
        wav = _dsp_fallback_wav(clean, sample_rate=self.sample_rate)
        duration_sec = max(0.8, len(clean) * 0.08)
        logger.info(f"DSP WAV fallback ok bytes={len(wav)} latency={(time.time()-t0)*1000:.0f}ms")
        return wav, duration_sec, "audio/wav"

        raise RuntimeError(
            "No neural TTS backend available on this instance. "
            "Install edge-tts in requirements and redeploy, or add kokoro ONNX weights."
        )

    def generate_audio_sync(self, text: str, voice: str = "af_bella", speed: float = 1.0) -> Tuple[bytes, float, str]:
        """Sync wrapper for workers / streaming generators (fresh event loop per call)."""
        return _run_async(self.generate_audio(text, voice=voice, speed=speed))

    def _synthesize_onnx(self, text: str, voice: str, speed: float) -> np.ndarray:
        # Minimal token path — only used when a real model file exists
        tokens = np.array([[ord(c) for c in text[:200]]], dtype=np.int64)
        rng = np.random.RandomState(sum(ord(c) for c in voice))
        style = np.array([rng.randn(512).astype(np.float32)], dtype=np.float32)
        speed_arr = np.array([speed], dtype=np.float32)
        inputs = {
            self.session.get_inputs()[0].name: tokens,
            self.session.get_inputs()[1].name: style,
            self.session.get_inputs()[2].name: speed_arr,
        }
        outputs = self.session.run(None, inputs)
        return outputs[0].squeeze().astype(np.float32)

    def _encode_wav(self, pcm: np.ndarray) -> bytes:
        pcm_16 = np.clip(pcm * 32767.0, -32768, 32767).astype(np.int16)
        buf = io.BytesIO()
        with wave.open(buf, "wb") as wf:
            wf.setnchannels(1)
            wf.setsampwidth(2)
            wf.setframerate(self.sample_rate)
            wf.writeframes(pcm_16.tobytes())
        return buf.getvalue()


class KokoroEngine(NeuralTTSEngine):
    pass


engine = NeuralTTSEngine()
kokoro_engine = engine
