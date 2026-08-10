# PinIT Career OS — Full Ecosystem README

PinIT Career OS is an AI-powered, screen-optimized career evolution workspace and socratic learning platform. It combines client-side telemetry, real-time avatar pedagogy, mindset archetype adaptation, focus soundscapes, and AI technical interviews.

---

## 🛠️ Master Ecosystem Architecture

* **Frontend:** Next.js 14, React, Vanilla CSS.
* **Perception AI (Client):** Google MediaPipe Face Mesh (WebGL-accelerated 478 landmarks tracking).
* **Audio & Speech Engine:** Web Audio API, Web Speech API (`SpeechRecognition`), Synthesis Audio Ducking.
* **Focus Soundscape Engine:** Procedural Web Audio synthesis + Suno AI custom ambient MP3 track manager for student mindset archetypes (`public/audio/soundscapes/`).
* **LLM Brain & Orchestrator:** Groq API (Llama / Claude models) + Zero-Token JS Speech Transformers.
* **Database & Auth:** Supabase PostgreSQL + Auth Context + Local Storage Persistence.
* **Deployment:** Firebase Hosting (Local Static Export Builds via `node build.js`).

---

## 🚀 Key Modules & Capabilities

### 1. 🎵 Mindset Archetype Focus Soundscape Engine
- **Pattern Hunter**: 60 BPM Alpha Wave Focus Synth pads (`pattern-hunter.mp3`).
- **Explorer**: 85 BPM Warm Lofi Chillhop beats (`explorer.mp3`).
- **Social IQ**: 70 BPM Neo-Classical Piano & Strings (`social-iq.mp3`).
- **Stabilizer**: 55 BPM Zen Zero-Anxiety Drone pads (`stabilizer.mp3`).
- **Smart Auto-Ducking**: Automatically drops music volume to **3%** when the AI Avatar Teacher speaks (🗣️) and swells to **14%** during silent coding/reading.
- **Volume Control System**: Persistent 0-100% volume slider in Settings (`/profile?tab=preferences`) and an inline quick-slider in the classroom lesson header (`/quests/lesson`).

### 2. 🤖 Master Quest Classroom & Pedagogy Engine (`/quests/lesson`)
- **5-Step Flipped Pedagogy**: Real-world analogies (*Stripe, Uber, Instagram, Docker*) preceding theory and execution.
- **Zero-Token Speech Transformers**: Teacher Personas (*Kashyap Sir, Karthic Sir, Ms. Maya, Ms. Divya*) and Mindset Archetypes (*Pattern Hunter, Explorer, Social IQ, Stabilizer*) rendered in pure JS with **0 LLM tokens, $0 cost, and 0ms latency**.
- **Out-Loud Line-by-Line Code Speech**: AI Teacher walks through code sandboxes line-by-line out loud during slide lectures.
- **Hybrid 5-Question Evaluation Exam**: 3 Dynamic AI Questions + 2 Production Benchmark Questions.

### 3. 🎯 AI Technical Interview & Telemetry Portal (`/interview`)
- **Round 1 (Behavioral):** Socratic chat with 3-minute gate.
- **Round 2 (Coding):** Solve 3 progressive Java code challenges ($\ge 60\%$ pass threshold).
- **Round 3 (Systems Design):** Socratic scaling checks regarding distributed caching and sharding.
- **Round 4 (STAR Framework):** Stress-testing on production outages and incident post-mortems.
- **Outcomes Report:** Telemetry aggregation for gaze, blink, posture, and speaking pace.

---

## ⚡ Setup & Verification Commands

```bash
# Install dependencies
npm install

# Run TypeScript type check
npx tsc --noEmit

# Compile static export build (1,625 static pages)
node build.js
```
