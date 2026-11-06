# PinIT Voice Engine - Isolated Build Directory

This folder contains the standalone, fully-functional Phase 1 Voice & Caching MVP build. 

## Included Modules
- `speech_server.py`: FastAPI Python server featuring Sentence-Level Chunking, SHA256 Key Normalization, and WAV streaming.
- `index.html`: Interactive Browser Test Dashboard to test Tier-1 IndexedDB Caching vs API generation.
- `client_tts.js`: Pure JavaScript client library for browser IndexedDB caching, sentence splitting, and Web Audio API sequential playback.

## How to Run & Test
1. **Install Dependencies:**
   ```bash
   pip install fastapi uvicorn soundfile numpy pydantic
   ```
2. **Start Python Speech Server:**
   ```bash
   python speech_server.py
   ```
3. **Open `index.html`** in your browser or serve it via `python -m http.server 3000`.
