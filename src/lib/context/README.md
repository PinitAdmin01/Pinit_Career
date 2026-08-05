# State Contexts & Tokenomics Middleware (`src/lib/context/`)

---

## 1. What It Is
This folder holds the React contexts (`AuthContext`, `CareerOSContext`) managing user authorization, active profile caching, token decrements, and lifecycle state transitions.

## 2. Why It Exists (Non-Negotiable Purpose)
*   **Rule Met**: *Improve Human Potential*
*   **Purpose**: Tracks and enforces the master state machine (`STATE_0` to `STATE_8`) across all pages. It monitors daily login token increments and handles the daily 120-minute AI Use Token lockout limits.
