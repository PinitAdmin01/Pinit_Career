# PinIT Careers AI Voice System — API Specification (API.md)

> **Base URL**: `http://localhost:3005/api/v1`  
> **Protocol**: HTTP/1.1 REST & Binary Chunk Streaming

---

## 📡 Endpoints Specification

### 1. `POST /api/v1/tts`
Synthesizes text into 24kHz Mono 16-bit PCM WAV audio.
- **Request Body** (`application/json`):
  ```json
  {
    "text": "Welcome to PinIT Careers!",
    "voice": "priya",
    "speed": 1.0
  }
  ```
- **Response** (`audio/wav`): Binary PCM WAV buffer.
- **Headers**:
  - `X-Audio-Duration`: Duration in seconds (e.g. `2.14`)
  - `X-Inference-Latency-MS`: Processing time in milliseconds
  - `X-Cache-Status`: `REDIS_RAM_HIT`, `SSD_DISK_HIT`, `SUPABASE_HIT`, or `SYNTHESIZED`
  - `X-Request-ID`: Distributed tracing GUID

### 2. `POST /api/v1/tts/stream`
Streams sentence clause audio chunks as they render.
- **Response**: `audio/wav` chunked transfer stream.
- **SLO Target**: Time-To-First-Byte (TTFB) $\le 15\text{ms}$.

### 3. `POST /api/v1/tts/async`
Enqueues high-concurrency peak requests into Redis task queue.
- **Response**: `{"task_id": "guid", "status": "PENDING"}`.

### 4. `GET /api/v1/tts/task/{task_id}`
Polls task execution status and returns base64 WAV payload.

### 5. `GET /api/v1/health/live` & `GET /api/v1/health/ready`
Kubernetes Liveness & Readiness probes (`200 OK`).

### 6. `GET /api/v1/metrics`
Prometheus standard metrics text collector.
