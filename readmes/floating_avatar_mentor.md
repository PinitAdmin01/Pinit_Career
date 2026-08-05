# Global Floating Avatar Mentor — Technical Reference

This document covers the full architecture, behaviour, and event protocol of the **GlobalAvatar** floating AI mentor widget that lives in the bottom-right corner across all student-facing pages of PinIT Career OS.

**Primary source file:** [`src/components/ui/AppShell.tsx`](../src/components/ui/AppShell.tsx) — `GlobalAvatar` function and supporting helpers.

---

## 1. Overview

The `GlobalAvatar` is a persistent, context-aware AI mentor widget rendered by the root `AppShell` shell on every authenticated student page. It serves three distinct roles depending on the student's current state:

| Mode | When | What It Does |
|---|---|---|
| **Onboarding Guide** | `onboardingStep` 0–5 | Walks the user step-by-step through Career Twin → roadmap generation |
| **Post-Onboarding Tab Tour** | First `/dashboard` visit after onboarding | 11-slide guided tour of every sidebar tab (fires once, 2s delay) |
| **Contextual Tab Explainer** | Normal daily use | Displays a guide for whichever tab the user is currently viewing |
| **Activity Congratulations** | After any quest/mission/interview/GD | Pops up with a personalised "Well done!" card showing score + feedback |
| **Tab-Shifting Commands** | User types/speaks navigation command | Intercepts client-side to instantly swap sidebar tabs |


---

## 2. System Architecture

```
AppShell.tsx
└── GlobalAvatar (always mounted, student only)
    ├── AvatarMentorWidget (Three.js / VRoid 3D canvas — lazy loaded)
    ├── TourOverlay         (absolute layer, rendered on top of canvas)
    └── CongratCard         (absolute layer, rendered on top of canvas)
```

### Render Hierarchy
```
<div style={{ position: 'relative' }}>   ← Main avatar container
  <div>                                   ← 3D canvas (AvatarMentorWidget)
  <TourOverlay />                         ← z-index: 10, absolute fill
  <CongratCard />                         ← z-index: 10, absolute fill
</div>
```

Overlays use `position: absolute; inset: 0` so they sit directly on top of the WebGL canvas without disrupting DOM layout.

---

## 3. Page Exclusions

`GlobalAvatar` returns `null` (hides completely) on the following pages to avoid visual conflicts with immersive full-screen modes:

| Page / Condition | Reason |
|---|---|
| `/quests/lesson` and all `/quests/*` detail pages | Full-screen lesson viewer |
| `/interview` and all `/interview/*` | Full-screen AI interview session |
| `/missions?roleplay=true` | Full-screen Socratic simulator |
| `/group-discussion?call=true` | Full-screen boardroom (excluded at AppShell level) |

---

## 4. Feature A — Post-Onboarding Tab Tour

### Trigger Conditions
All of the following must be true simultaneously:
1. Component has mounted (`mounted === true`)
2. `onboardingStep >= 3` (onboarding complete)
3. `pathname === '/dashboard'`
4. `localStorage.getItem('pinit_<userId>_tour_shown')` is `null`

### Timing
- A **2-second `setTimeout`** fires after mount/condition satisfaction
- On cleanup (route change before 2s), the timer is cancelled via the `useEffect` return

### Tour Slides (11 total)

| Slide | Emoji | Tab Covered |
|---|---|---|
| 1 | 👋 | Welcome greeting |
| 2 | 🏠 | Home Dashboard |
| 3 | 🛠️ | Career Builder |
| 4 | 🗺 | Quests |
| 5 | ⚡ | Daily Missions |
| 6 | 🎙 | AI Interview |
| 7 | 🧬 | Career Twin |
| 8 | 🔬 | Career DNA |
| 9 | 🎯 | Opportunities |
| 10 | 💬 | Group Discussion |
| 11 | 🚀 | Done — "Let's Go!" |

### UI Components
- Slide emoji (32px, drop-shadow)
- Slide counter `"3 / 11"` in monospace
- Animated progress bar (accent → teal gradient, `transition: width 0.35s`)
- Slide title (display font, 900 weight)
- Slide body text (11.5px, line-height 1.6)
- Two buttons:
  - **Skip Tour** — ghost style, calls `dismissTour()`
  - **Next →** / **Let's Go! 🚀** (last slide) — gradient primary, calls `nextTourSlide()`

### State
```ts
const [tourActive, setTourActive] = useState(false);
const [tourStep,   setTourStep]   = useState(0);
```

### localStorage Flag
```
Key:   pinit_<userId>_tour_shown
Value: "true"
Set:   on Skip Tour OR on final slide button click
```

### Behaviour During Tour
- `AvatarMentorWidget` has `showSpeechBubble={false}` — the widget's own speech bubble is suppressed so it doesn't overlap the tour overlay
- Avatar 3D canvas is still rendered behind the overlay (3D model remains visible as a backdrop)

### 🔊 Speech Synthesis Narrator
As the user navigates through the tour slides, a `useEffect` hook monitors `tourStep`. It cleanses the slide explanation text of markdown formatting (`**`) and emoji symbols, then invokes `speakWithAvatar()` to narrate the slide out loud using the selected teacher's custom vocal profile. Dismissing, skipping, or completing the tour instantly triggers `stopSpeaking()` to silence the audio.


---

## 5. Feature B — Activity Congratulations

### Event Protocol

Any page that completes a user activity dispatches a `pinit:activity_complete` CustomEvent on `window`:

```ts
window.dispatchEvent(new CustomEvent('pinit:activity_complete', {
  detail: {
    type: 'quest' | 'exam' | 'mission' | 'interview' | 'gd',
    title: string,         // human-readable label
    score?: number,        // 0–100
    passed?: boolean,      // defaults true if omitted
    verdict?: string,      // 'Hire' | 'No Hire' (interview only)
    strengths?: string[],  // what went well
    improvements?: string[], // what to work on
  }
}));
```

### Current Dispatchers

| File | Function | Event Type |
|---|---|---|
| `src/lib/context/CareerOSContext.tsx` | `addCompletedQuest()` | `quest` or `exam` |
| `src/lib/context/CareerOSContext.tsx` | `completeMission()` | `mission` |
| `src/app/interview/page.tsx` | `finishSTARAndShowResults()` | `interview` |
| `src/app/group-discussion/page.tsx` | `executeReportGeneration()` | `gd` |

### Listener (GlobalAvatar)
```ts
window.addEventListener('pinit:activity_complete', handler);
// Cleaned up on unmount via useEffect return
```

### Message Logic (`buildCongratMessage`)

Messages are built **client-side from the event payload** — no LLM call, instant.

| Event Type | Passed | Headline |
|---|---|---|
| `interview` | ✅ Hire | 🏆 Hire Verdict — Outstanding! |
| `interview` | ❌ No Hire | 💪 No Hire — But You're Growing! |
| `gd` | ✅ score ≥ 70 | 🎤 Great Boardroom Session! |
| `gd` | ❌ score < 70 | 💬 GD Session Complete! |
| `exam` | ✅ | 🧑‍💻 Exam Passed — Excellent! |
| `mission` | ✅ | ⚡ Daily Mission Complete! |
| `quest` | ✅ score ≥ 80 | 🗺 Quest Complete — Well Done! (with score) |
| `quest` | any | 🗺 Quest Complete — Well Done! (generic) |

Each message also renders:
- Score pill (if `score` is present) — `"85% score"` in monospace
- 💡 Tip line — next-step advice from `improvements[0]` or a default
- "Thanks, Priya! ✓" dismiss button

### CongratCard UI
- Fills the avatar container absolutely (`position: absolute; inset: 0`)
- **Passed** → green gradient `rgba(5,150,105,0.97) → rgba(16,185,129,0.97)` + green outer glow
- **Not passed** → indigo gradient `rgba(79,70,229,0.97) → rgba(124,58,237,0.97)` + purple glow
- Animated emoji: `bounce 0.6s ease infinite alternate`
- `backdropFilter: blur(8px)` for glass effect

### Auto-Dismiss
- Card auto-dismisses after **14 seconds** via `celebTimerRef` (`useRef<ReturnType<typeof setTimeout>>`)
- User can manually dismiss via "Thanks!" button
- If a second activity event fires before auto-dismiss, the timer resets and the new event replaces the old card

### 🔊 Speech Synthesis Narrator
Upon receiving the congratulations event, the avatar builds the text feedback showing what they did well and where they can improve, cleanses it of formatting tags, and calls `speakWithAvatar()` to read it out loud. Clicking the manual dismiss button or waiting for the 14-second auto-dismiss timeout triggers `stopSpeaking()` immediately to silence the speaker.


### State
```ts
const [celebEvent, setCelebEvent] = useState<any>(null);
const celebTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
```

### Avatar Pop-up Behaviour
When `celebEvent` is set:
- `setMinimized(false)` is called immediately — the avatar opens if it was minimized
- `showSpeechBubble` is set to `false` on `AvatarMentorWidget` — the widget's own bubble is suppressed

---

## 5.5. Feature C — Tab-Shifting Voice/Text Commands, Conversational Mode & Voice Lock

The AI Mentor can parse navigation, conversational, and query commands from text input or the wake-word microphone listener.

To keep the platform performant and avoid API overloading, all commands are parsed **entirely client-side** inside `AvatarMentorWidget.tsx` (`sendMessage()`):

### 1. Navigation Commands
* **Tab-Shifting**: Detects navigation indicators (`shift`, `switch`, `swap`, `go to`, `navigate`, `open`, `show`) and maps to target routes:
  * **Home / Dashboard**: `home`, `dashboard` ➔ `/dashboard`
  * **Career Builder**: `career-builder`, `builder`, `roadmap`, `resume` ➔ `/career-builder`
  * **Quests**: `quest`, `quests`, `learn` ➔ `/quests`
  * **Daily Missions**: `mission`, `missions`, `daily` ➔ `/missions`
  * **AI Interview**: `interview`, `mock` ➔ `/interview`
  * **Career Twin**: `twin` ➔ `/career-twin`
  * **Career DNA**: `dna` ➔ `/career-dna`
  * **Opportunities**: `opportunit`, `job` ➔ `/opportunities`
  * **Group Discussion**: `discussion`, `boardroom`, `debate` ➔ `/group-discussion`
  * **Vault**: `vault`, `document` ➔ `/vault`
  * **Pins & Plans**: `pricing`, `plan`, `pin` ➔ `/pricing`
  * **Profile**: `profile`, `settings` ➔ `/profile`
  * **Notifications**: `notification` ➔ `/notifications`
* **Direct Quest / Mission Launchers**:
  * Users can say `"start mission"`, `"begin mission"`, or `"play mission"` to directly load the Socratic crisis roleplay simulator (`/missions?roleplay=true`).
  * Users can say `"start quest"` or `"begin quest"` to open the learning roadmap (`/quests`).
* The system speaks a confirmation, triggers `onTabShift` after an `800ms` delay to allow TTS audio to play, and exits early to bypass external server LLM calls.

### 2. Personalised Priority Recommendations
* Triggered by voice queries like `"what is my priority"`, `"what should I do next"`, or *"what is my preyourity"*.
* The widget runs a client-side metrics check on `careerProfile` variables (checking streak count, trust level, and vault certificates count) and extracts the highest-impact action card.
* The avatar reads out the recommendation (e.g. *"Your top priority is to build your Trust Score. Verify a skill or add a document to your vault..."*), redirects to the relevant tab, and exits early.

### 3. Active Conversational Mode ("I want to talk with you")
* Triggered by voice requests containing: `"talk with u"`, `"want to talk"`, `"chat with u"`, or `"talk to you"`.
* Once matched, the system initializes conversational mode:
  1. **Spring-Loaded Sizing Animation**: Invokes `onEnlarge(true)`, expanding the avatar panel to **75%** of the viewport height and width. The transition uses a bouncy easing curve (`all 0.55s cubic-bezier(0.34, 1.56, 0.64, 1)`) and consistent bottom-right anchor targets (`bottom: 12.5%, right: 12.5%`) to animate smoothly from the docked corner.
  2. **Horizontal Split Layout**: Transforms the panel layout into a side-by-side split screen. The **Avatar 3D canvas is positioned on the left side** (`flex: 1.1`), and the **Chat feed is positioned on the right side** (`flex: 1.4`). This opens up massive visual space, preventing overlap and making chat bubbles easily readable.
  3. **Continuous Microphone Wake-Bypass**: Sets `isConversing = true`. Bypasses SpeechRecognition wake-word matching, allowing seamless continuous voice replies without saying *"Hey Priya"* every sentence.
  4. **Dynamic Peer-Like Dialogue**: Begins the conversation proactively using a warm, casual tone (asking *"How was your day?"*, *"What's up buddy?"*, or checking in). The AI is instructed to converse friendly like close developer peers.
  5. **Pure Technical Response Gating**: If the candidate asks a coding, algorithm, or system design query, the AI mentor immediately pivots to a **pure technical response mode**, stripping casual fluff to provide direct, clean code and architectural explanations.
* To exit conversational mode, the candidate says closing keywords (`bye`, `goodbye`, `stop talking`, `minimize`, `close`). The system sets `isConversing = false`, triggers the bouncy scale-down transition to standard docked dimensions via `onEnlarge(false)`, and speaks a casual farewell.


---

### 🔐 Owner Voice Signature Lock

To restrict voice navigation commands strictly to the account owner and reject other speakers, a lightweight Voice Biometrics lock is integrated:

1. **Autocorrelation Pitch Extraction**:
   For any discrete audio chunk $x(t)$, the system computes the fundamental frequency ($F_0$ in Hz) using autocorrelation:
   \[R(k) = \sum_{t=0}^{N-1-k} x(t) x(t+k)\]
   Pitch period $T_0$ corresponds to the lag index $k$ maximizing $R(k)$ within human voice limits ($75\text{ Hz} \le F_0 \le 350\text{ Hz}$), giving:
   \[F_0 = \frac{\text{sampleRate}}{T_0}\]
2. **Background Pitch Analyser**:
   On widget mount, a single persistent microphone listener context is opened. It polls the microphone every `100ms`, computes the pitch, and stores the values in a sliding window history (`pitchHistoryRef`) representing the last 2.5 seconds of ambient audio.
3. **Registration Flow**:
   * If no voice print is registered, the widget header displays a `🎙️ Register Voice` button.
   * Clicking it prompts the user to speak for 2.5 seconds. The system sorts the collected fundamental frequency ($F_0$) values, trims off the highest and lowest 20% (outliers/noise), averages the remaining core samples, and saves the baseline as `pinit_<uid>_voice_print_freq` in `localStorage`.
   * The header status updates to `🔐 Voice Lock`. Clicking it allows the owner to reset their voice signature.
4. **Verification Flow**:
   * When `SpeechRecognition` triggers `onresult` for a voice command, the system extracts the sliding window pitch profile of the voice input.
   * It sorts the pitch array, discards the highest 20% and lowest 20% pitch estimates to eliminate background clicks or silence frames, and computes the trimmed mean average pitch.
   * It calculates the percentage difference between the live trimmed average pitch and the stored owner voice signature:
     \[\text{diff} = \frac{|F_{0,\text{live}} - F_{0,\text{stored}}|}{F_{0,\text{stored}}}\]
   * If $\text{diff} \le 30\%$, the command is verified and executed.
   * If $\text{diff} > 30\%$ (or no pitch could be captured), the command is ignored, a red toast alert is triggered, and the avatar announces: *"Voice signature mismatch. I can only follow commands from my registered owner."*

---



## 6. State Machine Summary

```
onboardingStep < 3
    └─ Avatar hidden (redirect to /onboarding)

onboardingStep 0
    └─ Centered welcome modal (isCentered = true, backdrop overlay)

onboardingStep 1–4
    └─ Docked bottom-right, shows onboarding guidance text

onboardingStep >= 3 + first /dashboard visit
    └─ [after 2s] Tour activates → 11 slides → dismisses → localStorage flag set

Normal use (onboardingStep >= 5)
    └─ Docked, shows TAB_GUIDES text for current pathname

ANY time:
    window event pinit:activity_complete
    └─ CongratCard overlays avatar for 14s
```

---

## 7. Minimized State

When minimized (`minimized === true`):
- The main container is hidden (`display: 'none'`)
- A floating emoji circle button renders at `bottom: 24, right: 24`
- Clicking it sets `minimized = false`
- **Congratulations events always force `minimized = false`** — the avatar pops open automatically

---

## 8. localStorage Keys Reference

| Key | Value | Purpose |
|---|---|---|
| `pinit_<uid>_tour_shown` | `"true"` | Prevents tour from repeating after first completion |

---

## 9. How to Add a New Activity Dispatcher

To wire up any new page/action to show a congratulations card, add one line after the action completes:

```ts
if (typeof window !== 'undefined') {
  window.dispatchEvent(new CustomEvent('pinit:activity_complete', {
    detail: {
      type: 'quest',          // or 'exam' | 'mission' | 'interview' | 'gd'
      title: 'My Feature',
      score: 90,
      passed: true,
      strengths: ['Great logic flow'],
      improvements: ['Work on edge cases'],
    }
  }));
}
```

The `GlobalAvatar` listener in `AppShell.tsx` will pick it up automatically — no other changes needed.

---

## 10. How to Add a New Tour Slide

Edit the `TOUR_SLIDES` array at the top of `AppShell.tsx`:

```ts
const TOUR_SLIDES = [
  // ... existing slides ...
  {
    emoji: '📊',
    title: 'Analytics',
    text: 'Your **Analytics** tab shows a deep performance breakdown over time...',
  },
];
```

Slides render in array order. The progress bar and counter auto-update.

---

## 11. How to Reset the Tour (Testing / Debug)

Open browser DevTools console on `/dashboard`:

```js
localStorage.removeItem('pinit_<your-user-id>_tour_shown');
// Then reload — tour fires after 2 seconds
```

Or to test the congratulations card directly:
```js
window.dispatchEvent(new CustomEvent('pinit:activity_complete', {
  detail: { type: 'interview', title: 'Test Interview', score: 92, passed: true, verdict: 'Hire' }
}));
```

---

## 12. Related Files

| File | Role |
|---|---|
| [`src/components/ui/AppShell.tsx`](../src/components/ui/AppShell.tsx) | GlobalAvatar, TOUR_SLIDES, buildCongratMessage |
| [`src/components/avatar/AvatarMentorWidget.tsx`](../src/components/avatar/AvatarMentorWidget.tsx) | 3D VRoid canvas + chat UI rendered inside GlobalAvatar |
| [`src/lib/context/CareerOSContext.tsx`](../src/lib/context/CareerOSContext.tsx) | Quest + mission completion event dispatchers |
| [`src/app/interview/page.tsx`](../src/app/interview/page.tsx) | Interview evaluation event dispatcher |
| [`src/app/group-discussion/page.tsx`](../src/app/group-discussion/page.tsx) | GD report generation event dispatcher |
| [`readmes/avatar_readme.md`](./avatar_readme.md) | 3D model + voice mapping reference |
| [`readmes/kitten_voice.md`](./kitten_voice.md) | KittenTTS engine architecture |
