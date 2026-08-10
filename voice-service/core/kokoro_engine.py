"""
Compatibility shim — production TTS uses services.kokoro_engine (edge-tts / ONNX).
"""
from services.kokoro_engine import KokoroEngine, NeuralTTSEngine, kokoro_engine  # noqa: F401

__all__ = ["KokoroEngine", "NeuralTTSEngine", "kokoro_engine"]
