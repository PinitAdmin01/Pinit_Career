# Claude Code Assistant Guidelines for PinIT Career OS

You are pair-programming with the user and the Antigravity agent on the **PinIT Career OS** platform.

---

## 🧠 Autonomous Skills & Self-Validation Engine (MANDATORY)

### 1. Continuous Work & Autonomous Loop
- When given a feature or multi-step assignment, work continuously through each sub-step until complete.
- Do not stop mid-task to ask confirmation for minor, routine actions. Follow the specifications, implement the code, and self-validate.

### 2. Mandatory Self-Validation Protocol (SOP)
Before declaring ANY task complete, you MUST execute:
```bash
node claude_self_validate.js
```
- **Exit Code 0**: Deliverable is valid, passes syntax and project TypeScript (`npx tsc --noEmit`) checks.
- **Exit Code 1**: Check failed. Read the failure logs immediately.
- **Self-Correction Loop**:
  1. Parse the exact file, line number, and error message.
  2. Diagnose the root cause (e.g. missing import, type mismatch, duplicate variable name).
  3. Apply the targeted fix.
  4. Re-run `node claude_self_validate.js`.
  5. Repeat until the validator outputs: `🏆 SELF-VALIDATION PASSED! ALL CHECKS 100% CLEAN.`

### 3. Task Queue & Automation Integration
- The project includes an automated task runner: `claude_task_scheduler.js`.
- You can inspect your queued tasks at any time:
  ```bash
  node claude_task_scheduler.js list
  ```
- Your completed work will be verified by the scheduler against `claude_self_validate.js`.

---

## 🛡️ Core Operational Rules

### 1. Sandbox Deliverable Boundary (CRITICAL)
- Always write new components or draft modifications into `claude_sandbox/` (e.g. `claude_sandbox/MyComponent.tsx`).
- Do NOT perform indiscriminate git commits or broad overwrites of core files without review.
- Antigravity will inspect your sandbox deliverables, merge them into `../src/`, type-check, and commit safely.

### 2. TypeScript & Build Quality Standards
- **Strict TypeScript**: Never declare duplicate block-scoped variables in the same scope (e.g. avoid duplicate `const targetRoute`).
- **Clean Inline Styles**: Avoid duplicate CSS object keys in inline style objects (e.g. do not specify `left` or `transform` twice; use clean conditionals).
- **No Implicit `any`**: Never use `any` when explicit types can be inferred or imported.

### 3. Design System & Sidebar Rules
- **Active (Expanded) Sidebar**: `15vw` (`--sidebar-w: 15vw;`).
- **Inactive (Collapsed) Sidebar**: `5vw` (`--sidebar-collapsed-w: 5vw;`).
- **Middle Content**: Fills the remaining 80% (or 90% when both collapsed) using `flex: 1; min-width: 0;`.
- **Mutual Exclusion**: At no point can both sidebars be open simultaneously. Expanding one must collapse the other.
- **Floating Avatar**: Resting position is bottom center (`left: 50%`, `transform: translateX(-50%)`, `bottom: 24px`) with `opacity: 0.4` idle, `1.0` hover. Shifts to `right: 24px` when Left sidebar is open, and `left: 88px` when Right sidebar is open.

### 4. Audio / TTS & Tour Rules
- `stopSpeaking()` must NEVER trigger fake completion callbacks (`activeOnEndCallback = null`).
- Tour auto-advance must be route-guarded (`cleanPath === expectedRoute`).

### 5. Resource & Quota Conservation
- Never run massive project-wide scans or heavy file crawls that burn OpenRouter rate limits.
- Target only the specific files relevant to your assigned task.
