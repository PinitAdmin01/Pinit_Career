# PinIT Master Quest Classroom Engine Documentation

The **Master Quest Classroom Engine** (`src/app/quests/lesson/page.tsx`) provides an immersive, personalized, 5-step flipped learning experience tailored to individual student mindset archetypes and AI teacher personas.

---

## 🚀 Key Modules & Capabilities

### 1. 🎵 Mindset Archetype Focus Soundscape Engine (`src/lib/audio/soundscapes.ts`)
- **Adaptive Music Mapping**:
  - 🧠 **Pattern Hunter**: Deep Alpha Wave Focus Synth (`pattern-hunter.mp3`).
  - 🚀 **Explorer**: Chill Lofi Beats (`explorer.mp3`).
  - 🤝 **Social IQ**: Soft Neo-Classical Piano (`social-iq.mp3`).
  - 🛡️ **Stabilizer**: Ambient Zen Zero-Anxiety Drone (`stabilizer.mp3`).
- **Real Audio Track & Web Audio Fallback**: Loads Suno AI MP3 files from `public/audio/soundscapes/` with zero-latency Web Audio oscillator fallback.
- **Smart Auto-Ducking**: Automatically lowers background audio to **3% volume** when the AI Avatar Teacher speaks (🗣️) and swells to **14% volume** during silent reading & code execution.
- **Volume Control System**: Persistent **0–100% Volume Slider** in Settings (`/profile?tab=preferences`) and quick inline control in the lesson header (`/quests/lesson`).

### 2. 🤖 Zero-Token Mindset & Teacher Persona Transformers
- **Zero Token Overhead**: Static slide speeches are dynamically transformed in pure client-side JavaScript (`getSpeakerText()`) with **$0 API cost and 0ms latency**.
- **Teacher Personas**:
  - **Kashyap Sir**: Kalam-inspired & wise.
  - **Karthic Sir "Nega"**: Hyper-active & energetic.
  - **Ms. Maya**: Strict security auditor.
  - **Ms. Divya**: Visual frontend wizard.

### 3. 🗣️ Out-Loud Line-by-Line Code Explanation
- Avatar walks through code blocks line-by-line out loud during slide lectures:
  > *"Now Vinay, look at the code sandbox below: On line 1, we define our function signature... On line 3, we validate input data..."*

### 4. 📝 Hybrid 5-Question Exam Deck
- **Questions 1–3 (Dynamic AI)**: Conceptual questions generated dynamically from syllabus topics.
- **Questions 4–5 (Canonical Benchmarks)**: High-bar production benchmark questions testing Big-O time complexity (`O(1)` lookups) and system safety.

### 5. 🛡️ Principal QA Reliability Features
- **Mobile Audio Unlock**: Pulsing `🔊 Tap to Unmute Teacher Voice` badge bypasses iOS Safari and Android Chrome audio lock.
- **State Reset Guard**: Automatically resets `examQuestionIndex` to `0` when stepping back to learning slides.
- **Hydration Guard**: Client hydration flag (`isHydrated`) prevents SSR text flashing.
