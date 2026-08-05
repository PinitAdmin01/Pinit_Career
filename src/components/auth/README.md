# Authentication Components (`src/components/auth/`)

---

## 1. What It Is
This folder houses the components coordinating student signup, login, registration, and password recovery.

## 2. Why It Exists (Non-Negotiable Purpose)
*   **Rule Met**: *Collect Human Signal*
*   **Purpose**: Initializing the user session. It captures the student's name, college, degree, and graduation year during signup, transitioning their state from `STATE_0` (Visitor) to `STATE_1` (Registered) in the lifecycle state machine.
