# Hosting headers vs. what the app does — generated, do not hand-edit

Regenerate: `node audit/check-headers.mjs`

Under static Firebase hosting `src/middleware.ts` does not run, so `firebase.json`
is the only thing setting response headers. A denied host or device produces the
same symptom as a stubbed handler — the feature silently does nothing — but the
cause is in `firebase.json`, not in `src/`.

- **findings**: 0 {}
- **connect-src**: `'self' blob: https://*.supabase.co wss://*.supabase.co https://api.razorpay.com https://pinit-voice-service.onrender.com https://pinit-backend-v8pd.onrender.com https://api.github.com`
- **Permissions-Policy**: `camera=(self), microphone=(self), geolocation=(), browsing-topics=()`

_No header-level defects found._