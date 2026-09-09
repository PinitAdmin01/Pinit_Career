# Hosting headers vs. what the app does — generated, do not hand-edit

Regenerate: `node audit/check-headers.mjs`

Under static Firebase hosting `src/middleware.ts` does not run, so `firebase.json`
is the only thing setting response headers. A denied host or device produces the
same symptom as a stubbed handler — the feature silently does nothing — but the
cause is in `firebase.json`, not in `src/`.

- **findings**: 3 {"BROKEN":1,"SECURITY":2}
- **connect-src**: `'self' https://*.supabase.co wss://*.supabase.co https://api.razorpay.com https://openrouter.ai https://api.elevenlabs.io https://pinit-voice-service.onrender.com https://pinit-backend-v8pd.onrender.com https://api.groq.com https://api.github.com`
- **Permissions-Policy**: `camera=(self), microphone=(self), geolocation=(), browsing-topics=()`

## 1. [BROKEN] config — `NEXT_PUBLIC_FACE_API_URL`

points at http://localhost:3001. A plaintext http:// origin is blocked as mixed content on an https site, and localhost does not exist for a visitor.

**Fix:** Set NEXT_PUBLIC_FACE_API_URL to the deployed https origin, or remove the feature.

## 2. [SECURITY] secrets — `NEXT_PUBLIC_GROQ_API_KEY`

NEXT_PUBLIC_ variables are inlined into the JavaScript bundle at build time. This key is readable by anyone who opens the site, and usable until it is rotated.

**Fix:** Move the call behind backend/ (NEXT_PUBLIC_BACKEND_URL), drop the NEXT_PUBLIC_ prefix, and rotate the key.

## 3. [SECURITY] secrets — `NEXT_PUBLIC_OPENROUTER_API_KEY`

NEXT_PUBLIC_ variables are inlined into the JavaScript bundle at build time. This key is readable by anyone who opens the site, and usable until it is rotated.

**Fix:** Move the call behind backend/ (NEXT_PUBLIC_BACKEND_URL), drop the NEXT_PUBLIC_ prefix, and rotate the key.
