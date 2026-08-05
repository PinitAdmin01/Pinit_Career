# PinIT Careers AI Voice System — Architecture Decision Records (ADR)

> **Document Status**: Approved & Frozen  
> **Date**: August 2026  
> **Scope**: Voice Microservice Architectural Choices & Trade-offs

---

## 📄 ADR-001: Text-to-Speech Engine Selection (Why Kokoro?)

### Context
PinIT Careers requires an AI Voice service to convert text into natural-sounding voice audio for interactive AI Mentor avatars. The service must execute with low latency, low infrastructure cost, and support multiple distinct persona voices.

### Alternatives Evaluated
1. **ElevenLabs API**: High naturalness, but high variable API costs ($0.30 per 1,000 characters) and network latency spikes (300–800ms).
2. **Coqui XTTS v2**: Good quality, but massive GPU RAM footprint (4GB+ VRAM) and slow CPU inference times (1–3 seconds per sentence).
3. **Kokoro TTS (v0.19)**: Lightweight ONNX neural model (82M parameters), fast execution ($RTF < 0.010x$), low RAM usage (~200MB), high voice quality across 8 distinct profiles.

### Decision
Adopt **Kokoro TTS (v0.19)** as the primary neural text-to-speech engine.

---

## 📄 ADR-002: In-Memory RAM Caching & Task Queue Engine (Why Redis?)

### Context
High-concurrency bursts (e.g., 5,000 students starting diagnostic assessments simultaneously) can overwhelm the ONNX engine. A fast RAM cache and queue layer are required to isolate traffic spikes.

### Decision
Adopt **Redis** for both Tier 2 Server RAM Caching and Phase 8 Spike Isolation Task Queueing, encapsulated behind a pluggable `AbstractTaskQueue` interface.

---

## 📄 ADR-003: Cloud Backup Storage Engine (Why Supabase Storage & Postgres?)

### Context
If local server disk storage or Redis RAM is wiped during deployment upgrades, pre-rendered WAV files need a permanent cloud backup to avoid expensive neural model regeneration.

### Decision
Adopt **Supabase Storage & PostgreSQL** for Tier 4 Permanent Cloud Backup Storage.

---

## 📄 ADR-004: Client/Cloud Execution Routing (Why Smart Hybrid Voice Router?)

### Context
Students access PinIT Careers from a wide range of devices—from high-end laptops with WebGPU GPUs to budget mobile phones on mobile networks.

### Decision
Adopt a **Smart Hybrid Voice Router** with Tier 1 IndexedDB browser caching.

---

## 📄 ADR-005: Audio Format Specification (Why 24kHz Mono 16-Bit PCM WAV?)

### Context
Selecting an audio format that balances audio fidelity, browser playback compatibility, and encoding CPU overhead.

### Decision
Adopt **24kHz Mono 16-Bit PCM WAV** as the system-wide audio binary standard.
