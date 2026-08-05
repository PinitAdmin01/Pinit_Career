# Collaborative SDE Group Discussion Boardroom — Technical Documentation

This document describes the design architecture, visual layouts, avatar mappings, and browser-native optimizations of the Group Discussion boardroom simulator (`/group-discussion`).

---

## 1. Feature Overview

The SDE Group Discussion simulator allows candidates to participate in immersive, hands-free technical design debates with up to 14 AI avatars representing distinct engineering roles.

* **Immersive 95% Viewport Layout**: When a discussion call starts (URL query parameter `?call=true` is synced), the sidebar collapses to `0px` width, the top header is hidden (`display: none`), and the main workspace is widened to cover **95% of the viewport area** to simulate a dedicated virtual meeting client.
* **Floating Mentor Excluded**: The main app guide avatar widget (`GlobalAvatar`) is dynamically hidden when the call is active to eliminate UI clutter.
* **Roster Filtering**: The candidate's currently active mentor (`user?.selectedTeacherId`) is automatically filtered out from the invite list to avoid dual-presence conflicts.

---

## 2. Avatar & Voice Cast Assignments

All 15 characters on the platform have unique role descriptions, specific humanoid GLB models, and preselected neural voices (Kokoro/KittenTTS):

| Character | Role / Characteristic | Gender | Model Assignment | Voice Assignment |
| --- | --- | --- | --- | --- |
| **Ms. Priya** | Friendly & encouraging Mentor | Female | `hana.glb` | `af_heart` (US Warm Female) |
| **Mr. Anish** | Casual, friendly Mentor | Male | `riku.glb` | `am_liam` (US Friendly Male) |
| **Ms. Aisha** | Structured & methodical Teacher | Female | `yuki.glb` | `af_sky` (US Clear Female) |
| **Mr. Rohan** | Energetic & tech-focused Teacher | Male | `akira.glb` | `am_fenrir` (US Clean Male) |
| **Mr. Kashyap** | Systems Architect Teacher | Male | `sora.glb` | `am_fenrir` (US Clean Male) |
| **Mr. Karthic** | Algorithmic Lead Teacher | Male | `sora.glb` | `am_liam` (US Friendly Male) |
| **Ms. Maya** | Security Auditor Teacher | Female | `yuki.glb` | `bf_emma` (UK Prof. Female) |
| **Ms. Divya** | UX Expert Teacher | Female | `mika.glb` | `af_nicole` (US Creative Female) |
| **Mr. Vikram** | Serious, strict UK Interviewer | Male | `kaito.glb` | `bm_lewis` (UK Strict Male) |
| **Ms. Shalini** | Silent UK observer Interviewer | Female | `rei.glb` | `bf_isabella` (UK Prof. Female) |
| **Mr. Aditya** | Wise System Design Purist | Male | `sora.glb` | `am_adam` (US Wise Male) |
| **Ms. Neha** | High-Stress Driller Interviewer | Female | `mika.glb` | `af_bella` (US Energetic Female) |
| **Mr. Rajesh** | Friendly Legacy Defender | Male | `riku.glb` | `am_liam` (US Friendly Male) |
| **Ms. Sneha** | Empathy-First Socratic Interviewer | Female | `hana.glb` | `af_sarah` (US Socratic Female) |
| **Mr. Abhijit** | Bored Executive Interviewer | Male | `kaito.glb` | `bm_george` (UK Bored Male) |

---

## 3. Zoom-Style Lag-Prevention Optimization

To prevent WebGL rendering lag when displaying multiple 3D avatars simultaneously, a custom pause state has been integrated:
* **Dynamic Pause State**: Each `VRoidInterviewAvatar` accepts a `paused?: boolean` prop mapped to the internal Three.js animation loop.
* **CPU/GPU Freezing**: When an avatar is silent (`paused={!isSpeaking}`), its render cycle returns instantly before recalculating skeletal structures or calling `renderer.render()`.
* **Visual Freeze**: The silent avatar freezes on its last rendered frame, dropping CPU/GPU usage to **absolute zero** for inactive participants, allowing 10+ concurrent tiles with no browser lag.

---

## 4. Hands-Free Voice-to-Voice Turn-Taking

The simulator utilizes a local, continuous turn-taking queue:
* **Speech-to-Text (STT)**: Uses browser-native `webkitSpeechRecognition`. Once an avatar finishes speaking, the candidate's mic is automatically activated.
* **Debate Timers**: The microphone captures candidate voice responses. It shuts off and processes the text once speech stops.
* **Difficulty Modes**:
  * **Easy**: Candidate has 16s to reply; avatars speak politely.
  * **Medium**: Candidate has 12s to reply; standard corporate speed.
  * **Hard**: Candidate has 8s to reply; avatars interrupt and critique aggressively.
* **Silent Reaction Fallback**: If the candidate remains silent and the timer expires, the loop automatically triggers the next random invited avatar to speak.

---

## 5. Custom Topics & Dialogue Fallbacks

Candidates can type **any custom SDE topic** in the setup panel (free-text entry). The simulator configures the socratic debate directly around this topic:
* **Production API Key Fallback**: The client resolves the `GROQ_API_KEY` from `window.__GROQ_KEY__` or `localStorage.getItem('pinit_groq_api_key')`, calling the active non-deprecated `llama-3.3-70b-versatile` model directly via client-side fetch.
* **Intelligent Local Dialogue**: If the external API fails, a character-specific, topic-focused local dialogue generator kicks in. Instead of repeating static fallbacks, characters debate the custom topic dynamically using their unique engineering personas (e.g. Mr. Kashyap arguing about JVM heap leaks on your custom topic).
* **Step 1 Topic & Objective Sync**: The debate topic and socratic system instructions are driven directly by the Room Name and Room Description/Objective entered by the user in Step 1, removing pre-canned placeholders.

