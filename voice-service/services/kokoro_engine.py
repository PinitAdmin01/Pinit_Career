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

    communicate = edge_tts.Communicate(text, edge_voice, rate=rate)
    chunks: list[bytes] = []
    async for chunk in communicate.stream():
        if chunk["type"] == "audio":
            chunks.append(chunk["data"])
    audio = b"".join(chunks)
    if len(audio) < 500:
        raise RuntimeError("edge-tts returned empty/too-small audio")
    return audio


def _run_async(coro):
    """Run async edge-tts from sync FastAPI threadpool workers."""
    try:
        loop = asyncio.get_event_loop()
        if loop.is_running():
            # Nested loop (rare) — use a fresh loop in this thread
            new_loop = asyncio.new_event_loop()
            try:
                return new_loop.run_until_complete(coro)
            finally:
                new_loop.close()
        return loop.run_until_complete(coro)
    except RuntimeError:
        return asyncio.run(coro)


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

    def generate_audio(self, text: str, voice: str = "af_bella", speed: float = 1.0) -> Tuple[bytes, float, str]:
        """
        Returns (audio_bytes, duration_sec, media_type).
        media_type is audio/mpeg (edge) or audio/wav (onnx).
        """
        clean = (text or "").strip()
        if not clean:
            raise ValueError("Text cannot be empty")

        voice_key = (voice or settings.DEFAULT_VOICE).lower()
        t0 = time.time()

        # 1) edge-tts first (real speech, free-tier friendly)
        if self.is_edge_available:
            edge_voice = EDGE_VOICE_MAP.get(voice_key, EDGE_VOICE_MAP.get("af_bella", "en-US-AriaNeural"))
            rate = _speed_to_edge_rate(speed)
            try:
                mp3 = _run_async(_edge_synthesize_mp3(clean, edge_voice, rate))
                # Rough duration estimate for UI timers (chars ≈ 14/sec at 1.0x)
                duration_sec = max(0.6, len(clean) / (14.0 * max(0.5, float(speed))))
                logger.info(
                    f"edge-tts ok voice={edge_voice} bytes={len(mp3)} "
                    f"est_dur={duration_sec:.2f}s latency={(time.time()-t0)*1000:.0f}ms"
                )
                return mp3, duration_sec, "audio/mpeg"
            except Exception as e:
                logger.error(f"edge-tts failed: {e}")
                if not self.is_onnx_loaded:
                    raise RuntimeError(f"Neural TTS failed (edge-tts): {e}") from e

        # 2) Local ONNX if present
        if self.is_onnx_loaded and self.session is not None:
            pcm = self._synthesize_onnx(clean, voice_key, speed)
            wav = self._encode_wav(pcm)
            duration_sec = len(pcm) / float(self.sample_rate)
            logger.info(f"onnx ok bytes={len(wav)} dur={duration_sec:.2f}s")
            return wav, duration_sec, "audio/wav"

        raise RuntimeError(
            "No neural TTS backend available on this instance. "
            "Install edge-tts in requirements and redeploy, or add kokoro ONNX weights."
        )

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


# Back-compat alias used by main.py lifespan
class KokoroEngine(NeuralTTSEngine):
    pass


kokoro_engine = NeuralTTSEngine()
