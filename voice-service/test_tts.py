import sys
import os
import time

sys.path.insert(0, os.path.dirname(__file__))

from services.kokoro_engine import KokoroEngine

def test_kokoro_service():
    print("==================================================")
    print("  Testing Kokoro Engine Singleton Initialization  ")
    print("==================================================")
    
    start_init = time.time()
    engine1 = KokoroEngine()
    init_time_1 = (time.time() - start_init) * 1000
    print(f"[OK] Engine Instance 1 initialized in {init_time_1:.2f}ms")
    
    start_init_2 = time.time()
    engine2 = KokoroEngine()
    init_time_2 = (time.time() - start_init_2) * 1000
    print(f"[OK] Engine Instance 2 fetched in {init_time_2:.2f}ms (Singleton verified: {engine1 is engine2})")
    
    status = engine1.get_status()
    print(f"[INFO] Engine Status: {status}")
    
    test_text = "Welcome to PinIT Careers! Your AI mentor avatar is ready to guide your journey."
    print(f"\nSynthesizing test prompt: '{test_text}'")
    
    start_synth = time.time()
    wav_bytes, duration_sec = engine1.generate_audio(test_text, voice="priya", speed=1.0)
    synth_time = (time.time() - start_synth) * 1000
    
    print(f"[OK] Generated {len(wav_bytes)} WAV bytes ({duration_sec:.2f}s audio) in {synth_time:.2f}ms!")
    print(f"[INFO] Real-Time Factor (RTF): {(synth_time / 1000) / duration_sec:.3f}x")
    print("==================================================")
    assert len(wav_bytes) > 1000, "WAV audio output size must be greater than 1000 bytes"
    assert engine1 is engine2, "KokoroEngine must strictly follow Singleton pattern"
    print("[SUCCESS] Phase 1 & Phase 2 Unit Tests Passed Successfully!")

if __name__ == "__main__":
    test_kokoro_service()
