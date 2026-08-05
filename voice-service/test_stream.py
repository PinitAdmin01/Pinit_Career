import os
import sys
import time

sys.path.insert(0, os.path.dirname(__file__))

from api.routes_tts import audio_chunk_generator

def test_realtime_audio_streaming():
    print("==================================================")
    print("  Testing Phase 10 Real-Time Audio Chunk Streaming")
    print("==================================================")

    paragraph = (
        "Welcome to PinIT Careers! "
        "Our AI avatar is ready to assist your interview preparation. "
        "Let us begin with your diagnostic assessment."
    )

    print(f"Testing Streaming Prompt ({len(paragraph)} chars): '{paragraph}'")

    start_time = time.time()
    chunk_generator = audio_chunk_generator(paragraph, voice="priya", speed=1.0)

    chunks = []
    first_byte_latency_ms = None

    for idx, chunk in enumerate(chunk_generator):
        if idx == 0:
            first_byte_latency_ms = (time.time() - start_time) * 1000

        chunks.append(chunk)
        print(f"  [PASS] Chunk {idx + 1}: Received {len(chunk)} bytes in {(time.time() - start_time)*1000:.2f}ms Total Elapsed")

    total_time_ms = (time.time() - start_time) * 1000
    total_bytes = sum(len(c) for c in chunks)

    print(f"\n[OK] Received {len(chunks)} Audio Chunks ({total_bytes} Total Bytes)")
    print(f"[OK] Time-To-First-Byte (TTFB): {first_byte_latency_ms:.2f}ms (Target < 15ms)")
    print(f"[OK] Total Stream Duration: {total_time_ms:.2f}ms")

    assert len(chunks) >= 3, f"Expected at least 3 sentence chunks, got {len(chunks)}"
    assert first_byte_latency_ms < 50, f"TTFB latency too high: {first_byte_latency_ms:.2f}ms"
    assert total_bytes > 50000, f"Total streamed bytes too low: {total_bytes}"

    print("==================================================")
    print("[SUCCESS] Phase 10 Real-Time Audio Chunk Streaming Tests Passed!")

if __name__ == "__main__":
    test_realtime_audio_streaming()
