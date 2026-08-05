# PinIT Voice Cache Backend

FastAPI backend powering PinIT's production voice architecture. Built for **10,000+ concurrent users** with sub-5ms cache hits and near-instant TTS responses.

## Architecture

```
USER (Next.js)
     │
     ▼ POST /api/tts  (Next.js route)
     │
     ▼ POST /api/tts  (FastAPI — this server)
     │
     ├── SHA256 hash computed
     │
     ├── Redis lookup (1–5ms)
     │     ├── HIT  → stream file from disk  (< 300ms total)
     │     └── MISS → Voice Router
     │                   ├── lesson/avatar/mission → Kokoro 82M  (95%)
     │                   └── interview             → Premium TTS  (5%)
     │                              │
     │                         Save to disk
     │                         Save to Redis
     │                         Return stream
```

## Quick Start

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Start Redis (Windows)

**Option A — Windows Subsystem for Linux (WSL):**
```bash
wsl redis-server
```

**Option B — Native Windows (winget):**
```bash
winget install Redis.Redis
redis-server redis\redis.conf
```

**Option C — Docker:**
```bash
docker run -d -p 6379:6379 redis:alpine redis-server --maxmemory 512mb --maxmemory-policy allkeys-lru
```

### 3. Start the Backend

```bash
# From project root (one command):
start_backend.bat

# Or manually:
cd backend
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### 4. Configure Next.js

Copy `.env.example` to `.env.local` and set:
```
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/tts` | Generate or serve cached TTS audio |
| `POST` | `/api/tts/analyze-chunks` | Pre-check cache status per sentence |
| `GET`  | `/api/cache/hash?key={sha256}` | Cache key lookup |
| `GET`  | `/api/cache/stats` | Full cache statistics |
| `POST` | `/api/cache/gc` | Run LRU garbage collector |
| `POST` | `/api/chat` | LLM chat proxy (OpenRouter) |
| `GET`  | `/health` | Health check |

Interactive API docs: **http://localhost:8000/docs**

## Cache Key Design

Every TTS request is hashed from ALL parameters that affect audio output:

```python
SHA256(
  normalized_text +
  voice           +
  language        +
  speed           +
  emotion         +
  model_version   +
  sample_rate
)
```

Changing any single field automatically creates a different cache entry.

## Redis Schema

```
KEY:   voice:{sha256_64_chars}
VALUE: {
  "path":        "english/49d61f8c....wav",
  "duration":    18.3,
  "voice":       "af_heart",
  "language":    "en",
  "emotion":     "happy",
  "created":     "2026-07-31T13:00:00Z",
  "last_access": "2026-07-31T18:45:00Z",
  "hits":        1523
}
```

## Audio Storage

```
storage/audio/
  english/    ← {sha256}.wav or {sha256}.mp3
  hindi/
  kannada/
  tamil/
  telugu/
```

Files are **never deleted by age**. The LRU garbage collector only runs when storage exceeds `MAX_STORAGE_MB` (default 2048 MB = 2 GB). Clips with > 100 hits are protected from eviction.

## Performance Targets

| Scenario | Time |
|----------|------|
| Redis cache hit | 1–5 ms |
| IndexedDB hit (browser) | < 2 ms |
| Static pre-rendered file | 0 ms |
| Kokoro generation (simulation) | < 500 ms |
| Kokoro generation (real weights) | 1–4 s |
| Audio delivery | 100–300 ms |

## Enabling Real Kokoro-82M

1. Install the ONNX runtime package:
   ```bash
   pip install kokoro-onnx onnxruntime
   ```
2. Download model weights (`kokoro-v0_19.onnx` + `voices.bin`) into `backend/`
3. Set `KOKORO_REAL = True` in `backend/app/services/tts_service.py`

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `REDIS_URL` | `redis://localhost:6379` | Redis connection string |
| `AUDIO_STORAGE_DIR` | `./storage/audio` | Disk audio cache path |
| `MAX_STORAGE_MB` | `2048` | Max disk usage before GC |
| `MODEL_VERSION` | `v2.0` | Cache invalidation version |
| `OPENROUTER_API_KEY` | — | LLM proxy key |
| `ELEVENLABS_API_KEY` | — | Premium TTS (interview mode) |

## Voice Router Context Values

| Context | Engine | Use case |
|---------|--------|----------|
| `avatar` | Kokoro | AI mentor dialogue |
| `lesson` | Kokoro | Course narration |
| `mission` | Kokoro | Mission briefings |
| `gd` | Kokoro | Group discussion |
| `interview` | Premium (ElevenLabs) | Mock interview voices |

## What Should Be Cached

✅ **Cache:** Course narration, lesson explanations, tutorials, error explanations, FAQs, navigation prompts, common AI responses, motivation quotes, definitions, programming explanations, interview questions, grammar lessons, career tips

❌ **Never cache:** User names, OTPs, passwords, private data, live interview answers, real-time conversation responses, sensitive content
