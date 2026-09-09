# Hosting headers vs. what the app does — generated, do not hand-edit

Regenerate: `node audit/check-headers.mjs`

Under static Firebase hosting `src/middleware.ts` does not run, so `firebase.json`
is the only thing setting response headers. A denied host or device produces the
same symptom as a stubbed handler — the feature silently does nothing — but the
cause is in `firebase.json`, not in `src/`.

- **findings**: 9 {"BROKEN":7,"SECURITY":2}
- **connect-src**: `'self' https://*.supabase.co wss://*.supabase.co https://api.razorpay.com https://openrouter.ai https://api.elevenlabs.io`
- **Permissions-Policy**: `camera=(), microphone=(), geolocation=(), browsing-topics=()`

## 1. [BROKEN] config — `NEXT_PUBLIC_FACE_API_URL`

points at http://localhost:3001. A plaintext http:// origin is blocked as mixed content on an https site, and localhost does not exist for a visitor.

**Fix:** Set NEXT_PUBLIC_FACE_API_URL to the deployed https origin, or remove the feature.

## 2. [BROKEN] csp — `NEXT_PUBLIC_TTS_API_URL`

https://pinit-voice-service.onrender.com is not in connect-src, so every request to it is blocked by CSP before it leaves the browser.

**Fix:** Add https://pinit-voice-service.onrender.com to connect-src in firebase.json.

## 3. [BROKEN] csp — `NEXT_PUBLIC_BACKEND_URL`

https://pinit-backend-v8pd.onrender.com is not in connect-src, so every request to it is blocked by CSP before it leaves the browser.

**Fix:** Add https://pinit-backend-v8pd.onrender.com to connect-src in firebase.json.

## 4. [BROKEN] csp — `https://api.groq.com`

called from src/app/api/group-discussion/bot-reply/route.ts but not in connect-src, so the request is blocked by CSP.

**Fix:** Add https://api.groq.com to connect-src in firebase.json, or route the call through the backend.

## 5. [BROKEN] csp — `https://api.github.com`

called from src/lib/github/githubIngestion.ts but not in connect-src, so the request is blocked by CSP.

**Fix:** Add https://api.github.com to connect-src in firebase.json, or route the call through the backend.

## 6. [BROKEN] permissions-policy — `camera`

Permissions-Policy sends camera=() — an empty allowlist disables it for the whole origin — but 4 file(s) request it: src/app/interview/page.tsx, src/app/_legacy/attendance/page.tsx, src/components/auth/FaceAnalyzer.tsx, src/components/student/StudentAttendanceView.tsx.

**Fix:** Change camera=() to camera=(self) in the Permissions-Policy header in firebase.json (src/middleware.ts already intends this, but middleware does not run on static hosting).

## 7. [BROKEN] permissions-policy — `microphone`

Permissions-Policy sends microphone=() — an empty allowlist disables it for the whole origin — but 3 file(s) request it: src/app/onboarding/page.tsx, src/components/avatar/AvatarMentorWidget.tsx, src/components/avatar/VoiceRegistrationModal.tsx.

**Fix:** Change microphone=() to microphone=(self) in the Permissions-Policy header in firebase.json (src/middleware.ts already intends this, but middleware does not run on static hosting).

## 8. [SECURITY] secrets — `NEXT_PUBLIC_GROQ_API_KEY`

NEXT_PUBLIC_ variables are inlined into the JavaScript bundle at build time. This key is readable by anyone who opens the site, and usable until it is rotated.

**Fix:** Move the call behind backend/ (NEXT_PUBLIC_BACKEND_URL), drop the NEXT_PUBLIC_ prefix, and rotate the key.

## 9. [SECURITY] secrets — `NEXT_PUBLIC_OPENROUTER_API_KEY`

NEXT_PUBLIC_ variables are inlined into the JavaScript bundle at build time. This key is readable by anyone who opens the site, and usable until it is rotated.

**Fix:** Move the call behind backend/ (NEXT_PUBLIC_BACKEND_URL), drop the NEXT_PUBLIC_ prefix, and rotate the key.
