import requests
import os
import time

print("=" * 60)
print("  PINIT CAREERS LIVE SYSTEM VALIDATION TEST")
print("=" * 60)

# 1. Health Probe Check
health_url = "https://pinit-voice-service.onrender.com/api/v1/health/live"
print(f"\n[Test 1] Querying Health Probe: {health_url}")
t0 = time.time()
try:
    h_res = requests.get(health_url, timeout=10)
    h_ms = int((time.time() - t0) * 1000)
    print(f"  -> HTTP Status: {h_res.status_code}")
    print(f"  -> Response Time: {h_ms}ms")
    print(f"  -> Body: {h_res.text}")
except Exception as e:
    print(f"  -> ERROR: {e}")

# 2. TTS Voice Generation Test for Ms. Priya
tts_url = "https://pinit-voice-service.onrender.com/api/v1/tts"
print(f"\n[Test 2] Querying Live TTS Service for Ms. Priya: {tts_url}")
payload_priya = {
    "text": "Hello! System validation passed successfully. Your Render AI Voice Service is one hundred percent live and operational!",
    "voice": "priya",
    "speed": 1.0
}
t0 = time.time()
try:
    r_priya = requests.post(tts_url, json=payload_priya, timeout=15)
    r_ms = int((time.time() - t0) * 1000)
    print(f"  -> HTTP Status: {r_priya.status_code}")
    print(f"  -> Response Time: {r_ms}ms")
    print(f"  -> Voice Engine Header: {r_priya.headers.get('X-Voice-Engine')}")
    print(f"  -> Audio Size: {len(r_priya.content)} bytes")
    
    if r_priya.status_code == 200 and len(r_priya.content) > 1000:
        file_path = "scratch/validation_priya.mp3"
        os.makedirs("scratch", exist_ok=True)
        with open(file_path, "wb") as f:
            f.write(r_priya.content)
        print(f"  -> SUCCESS: Saved speech to '{file_path}' ({os.path.getsize(file_path)} bytes)!")
        
        # Physical Speaker Playback on User's Computer!
        print("\n[Physical Proof] Launching Windows Media Player to play Priya's speech through your speakers...")
        os.system(f'start {file_path}')
    else:
        print(f"  -> FAIL: Response content: {r_priya.text[:200]}")
except Exception as e:
    print(f"  -> ERROR: {e}")

print("\n" + "=" * 60)
print("  VALIDATION TEST COMPLETE")
print("=" * 60)
