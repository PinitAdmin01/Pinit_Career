# Deploying the Java judge to Cloud Run

## Status as of this session

- Container **built and verified end-to-end locally** via Docker: real auth
  against the real Supabase project, real `javac`/`java` compile+execute, all
  4 required scenarios (valid+pass, valid+fail, syntax error, forbidden API)
  produced correct results over real HTTP.
- **Not deployed.** `gcloud` CLI in this environment has a broken Python
  auto-detection bootstrap (`gcloud.cmd`'s `where python` / `CLOUDSDK_PYTHON`
  handling does not resolve even with a working Python 3.12 on PATH and
  `CLOUDSDK_PYTHON` explicitly set — root cause not isolated further; likely
  interference from the Windows Store `python.exe` app-execution-alias stub
  also appearing on PATH). Deploy from a shell where `gcloud auth list` and
  `gcloud config get-value project` work.
- Firebase Hosting rewrite is already added in `firebase.json`, pointing
  `/api/code/run-java` at a Cloud Run service named `pinit-java-judge` in
  `us-central1` (chosen as a default — the project has no resource location
  set yet; change the region in both places below if you want a different one).

## One-time deploy

```bash
cd cloud-run/java-judge

gcloud run deploy pinit-java-judge \
  --source . \
  --project pinit-careers \
  --region us-central1 \
  --no-allow-unauthenticated \
  --set-env-vars NEXT_PUBLIC_SUPABASE_URL=<from .env>,NEXT_PUBLIC_SUPABASE_ANON_KEY=<from .env> \
  --set-secrets SUPABASE_SERVICE_ROLE_KEY=<secret-name>:latest \
  --memory 512Mi \
  --cpu 1 \
  --timeout 30s \
  --max-instances 10
```

`SUPABASE_SERVICE_ROLE_KEY` powers the server-authoritative completion write
(§3.5/§3.6 — ported into `server.js`'s `persistJavaCompletionServerSide`).
Store it in Secret Manager rather than `--set-env-vars` (it's the key that
bypasses RLS — see Risk 4). If omitted, the service degrades gracefully:
grading still works, completion just doesn't get server-persisted (same
fallback pattern as `src/lib/faceStore.ts`).

`--no-allow-unauthenticated`: the service enforces its own Supabase Auth check
(same as the Next.js route), but Cloud Run's own IAM layer should still not be
wide open to the public internet outside Hosting's rewrite path. If Firebase
Hosting rewrites require the service to allow unauthenticated invocation at
the Cloud Run IAM layer (Hosting calls it as an unauthenticated backend by
default), grant the specific Hosting service account invoker access instead of
using `--allow-unauthenticated` broadly:

```bash
gcloud run services add-iam-policy-binding pinit-java-judge \
  --project pinit-careers \
  --region us-central1 \
  --member="serviceAccount:firebase-hosting@pinit-careers.iam.gserviceaccount.com" \
  --role="roles/run.invoker"
```

Then deploy Hosting so the rewrite takes effect:

```bash
cd ../..
npm run build
firebase deploy --only hosting
```

## Verify after deploy

```bash
curl -s -w "\n%{http_code}\n" https://pinit-careers.web.app/api/code/run-java
# Expect: {"error":"UNAUTHORIZED","message":"Bearer session token required."}  401
# (NOT the static "Page not found" shell — if you still see that, the rewrite
# or the service isn't live yet.)
```

Then re-run, from a machine with a real logged-in student session:
`scripts/java-judge-compile.test.js` covers the compile pipeline; a full
browser-based re-check of the empirical proof in
`scripts/java-judge-routing.test.ts`'s header comment (this time against
`pinit-careers.web.app` instead of `localhost:3000`) is the way to confirm the
production path specifically.

## Known gaps not addressed by this service

- `run-python` has the exact same "route doesn't exist in production" problem
  and is not covered here — this was scoped to Java only, per the specific ask.
