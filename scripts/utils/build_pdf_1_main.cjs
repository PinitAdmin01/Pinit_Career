const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const { DESKTOP_DIR, DOCS_DIR, COMMON_STYLES } = require('./pdf_shared.cjs');

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>PinIT Career OS — Main Orchestrator Executive Directive & Master Verification Architecture</title>
  <style>
    ${COMMON_STYLES}
  </style>
</head>
<body>

  <div class="header-card">
    <h1>🏛️ PinIT Career OS — Main Orchestrator Directive</h1>
    <div class="subtitle">Platform Architecture, Security Foundations, 3D Avatar/Voice Engines & Global Contract Parity</div>
    <div class="meta-grid">
      <div class="meta-item"><strong>Assigned Lead</strong><span>Antigravity (Orchestrator)</span></div>
      <div class="meta-item"><strong>Working Tree</strong><span>Present-Career-os (main)</span></div>
      <div class="meta-item"><strong>Base Commit</strong><span>5e07b9c1</span></div>
      <div class="meta-item"><strong>Total Scope</strong><span>28 Blocks (01-08, 15-33, 80)</span></div>
    </div>
  </div>

  <h2>1. Executive Mission & Strategic Context</h2>
  <p>
    <strong>The Core Problem:</strong> Multi-agent autonomous development fails when agents make unverified assumptions, mutate shared contracts, skip edge cases, or enter circular hallucination loops. To achieve institutional-grade perfection across PinIT Career OS, the <strong>Main Orchestrator Branch (<code>main</code>)</strong> holds sovereign authority over platform infrastructure, API contracts, security perimeters, and master test verification.
  </p>
  <p>
    <strong>Why This Structure:</strong> The application is partitioned into 1 Sovereign Main Orchestrator and 3 Specialized Sub-Branches. Branch 0 (Main) ensures that client-server contracts never break, 3D avatar assets are permanently protected, and all sub-branch pull requests are verified before merge.
  </p>

  <div class="alert-box alert-critical">
    <strong>🚨 SOVEREIGN BOUNDARY RULES (STRICTLY ENFORCED):</strong><br>
    1. <strong>0 Contract Parity Defects:</strong> Every single client <code>/api/*</code> call must have a corresponding route under <code>src/app/api/</code> that exports the exact HTTP method.<br>
    2. <strong>Zero Asset Deletion:</strong> Never delete or mutate 3D avatar assets (<code>public/avatar/*.glb</code>), Draco decoders, or audio caches.<br>
    3. <strong>Strict RLS Enforcement:</strong> Ensure every Supabase table enforces Row-Level Security by role and tenant.
  </div>

  <h2>2. Master Invariants & Pedagogical Standards</h2>
  <div class="grid-2">
    <div class="block-card">
      <div class="block-card-header">
        <span class="block-title">🎙️ 25–30 Minute Avatar Spoken Lesson Invariant</span>
        <span class="badge badge-purple">Mandatory</span>
      </div>
      <p>Every curriculum day across all 37 courses must deliver between <strong>25 and 30 minutes of continuous, high-fidelity spoken mentorship</strong>. At standard conversational cadence (110–120 wpm), each day must provide <strong>>= 2,900 words</strong> partitioned into exactly 5 parts (>= 580 words/part).</p>
    </div>
    <div class="block-card">
      <div class="block-card-header">
        <span class="block-title">🔒 Multi-Tenant Data Isolation Invariant</span>
        <span class="badge badge-blue">Security</span>
      </div>
      <p>Data from one college or university must be cryptographically and logically isolated from all others. Cross-tenant leakage via raw queries, missing where clauses, or unauthenticated API endpoints is treated as a P0 security defect.</p>
    </div>
  </div>

  <h2>3. Assigned Scope: 28 Forensic Verification Blocks</h2>
  <table>
    <thead>
      <tr>
        <th style="width: 10%;">Block</th>
        <th style="width: 25%;">Domain & Title</th>
        <th style="width: 35%;">Target Files & Modules</th>
        <th style="width: 30%;">Deterministic Verification</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Block 01</strong></td>
        <td>Next.js Root Layout & Telemetry</td>
        <td><code>src/app/layout.tsx</code>, <code>src/lib/telemetry/*</code>, <code>src/lib/fetchInterceptor.ts</code></td>
        <td><code>npm run audit:runtime</code>; verify 0 hydration mismatch</td>
      </tr>
      <tr>
        <td><strong>Block 02</strong></td>
        <td>Supabase Client & Session Lifecycle</td>
        <td><code>src/lib/supabaseClient.ts</code>, <code>src/lib/auth/session.ts</code></td>
        <td><code>npx tsx tests/avatar_chaos_resilience.test.ts</code></td>
      </tr>
      <tr>
        <td><strong>Block 03</strong></td>
        <td>Multi-Role Passcode Authentication</td>
        <td><code>src/lib/auth/passcode.ts</code>, <code>src/lib/context/AuthContext.tsx</code></td>
        <td><code>npx tsx audit/test_login_flow.cjs</code></td>
      </tr>
      <tr>
        <td><strong>Block 04</strong></td>
        <td>Route Middleware & Gatekeeping</td>
        <td><code>src/middleware.ts</code>, <code>src/lib/auth/jwt.ts</code></td>
        <td><code>npm run audit:headers</code>; test unauthenticated redirects</td>
      </tr>
      <tr>
        <td><strong>Block 05</strong></td>
        <td>Cryptographic Hashing & Argon2</td>
        <td><code>src/lib/auth/crypto.ts</code>, <code>backend/app/services/hash_service.py</code></td>
        <td><code>npm run test:security</code></td>
      </tr>
      <tr>
        <td><strong>Block 06</strong></td>
        <td>Security Headers, CSP & Rate Limiting</td>
        <td><code>src/middleware.ts</code>, <code>audit/check-headers.mjs</code></td>
        <td><code>npm run audit:headers</code> (Check CSP, HSTS, X-Frame)</td>
      </tr>
      <tr>
        <td><strong>Block 07</strong></td>
        <td>Supabase Row-Level Security (RLS)</td>
        <td><code>supabase/migrations/*</code>, <code>scripts/tests/test_student_privilege_rls.ts</code></td>
        <td><code>npx tsx scripts/tests/test_student_privilege_rls.ts</code></td>
      </tr>
      <tr>
        <td><strong>Block 08</strong></td>
        <td>Client-Server Contract Parity</td>
        <td><code>audit/extract-contracts.mjs</code>, <code>scripts/verify/verify_api_parity.ts</code></td>
        <td><code>npm run audit:contracts</code> (0 broken, 0 wrong method)</td>
      </tr>
      <tr>
        <td><strong>Block 15</strong></td>
        <td>Three.js WebGL Scene & Lighting</td>
        <td><code>src/components/avatar/ThreeScene.tsx</code>, <code>LightingRig.ts</code></td>
        <td><code>npx tsx --test tests/avatar_perf_optimization.test.ts</code></td>
      </tr>
      <tr>
        <td><strong>Block 16</strong></td>
        <td>VRM/GLTF Model Loader & Draco</td>
        <td><code>src/components/avatar/VRoidAvatarEngine.ts</code>, <code>public/avatar/*.glb</code></td>
        <td><code>npx tsx --test tests/avatar_mentor_suite.test.ts</code></td>
      </tr>
      <tr>
        <td><strong>Block 17</strong></td>
        <td>Facial Expression Morph Targets</td>
        <td><code>src/lib/avatar/visemeTypes.ts</code>, <code>MorphController.ts</code></td>
        <td>Morph target checks in <code>tests/avatar_voice_reliability.test.ts</code></td>
      </tr>
      <tr>
        <td><strong>Block 18</strong></td>
        <td>Real-Time Audio Streaming & Visemes</td>
        <td><code>src/lib/audio/streamingAudioQueue.ts</code>, <code>src/lib/tts.ts</code></td>
        <td><code>npx tsx --test tests/avatar_voice_reliability.test.ts</code></td>
      </tr>
      <tr>
        <td><strong>Block 19</strong></td>
        <td>Offline Voice Fallback & WebSpeech</td>
        <td><code>src/hooks/useTTS.js</code>, <code>src/lib/smartVoiceRouter.ts</code></td>
        <td><code>npx tsx --test tests/avatar_chaos_resilience.test.ts</code></td>
      </tr>
      <tr>
        <td><strong>Block 20</strong></td>
        <td>Floating Mentor HUD & Wake-Word</td>
        <td><code>src/components/mentor/FloatingAvatarMentor.tsx</code>, <code>wakeWordDetector.ts</code></td>
        <td>WakeWord suite in <code>tests/avatar_mentor_suite.test.ts</code></td>
      </tr>
      <tr>
        <td><strong>Block 21</strong></td>
        <td>FastAPI Voice Microservice</td>
        <td><code>backend/main.py</code>, <code>backend/app/api/tts.py</code></td>
        <td>FastAPI endpoint validation & schema checks</td>
      </tr>
      <tr>
        <td><strong>Block 22</strong></td>
        <td>Kokoro Neural TTS & ONNX Runtime</td>
        <td><code>voice-service/core/kokoro_engine.py</code>, <code>kokoro-v0_19.onnx</code></td>
        <td><code>python voice-service/test_tts.py</code></td>
      </tr>
      <tr>
        <td><strong>Block 23</strong></td>
        <td>Multi-Tier Voice Cache</td>
        <td><code>voice-service/cache/cache_manager.py</code>, <code>cache_service.py</code></td>
        <td><code>python voice-service/test_server_cache.py</code></td>
      </tr>
      <tr>
        <td><strong>Block 24</strong></td>
        <td>Audio Compression & Format Streaming</td>
        <td><code>voice-service/middleware/compression.py</code>, <code>tts.py</code></td>
        <td><code>python voice-service/test_stream.py</code></td>
      </tr>
      <tr>
        <td><strong>Block 25</strong></td>
        <td>Voice Telemetry & Worker Pool</td>
        <td><code>voice-service/telemetry/metrics.py</code>, <code>worker_pool.py</code></td>
        <td><code>python voice-service/test_workers.py</code></td>
      </tr>
      <tr>
        <td><strong>Block 26</strong></td>
        <td>Code Runner Architecture & Warmup</td>
        <td><code>src/lib/code/codeRunner.ts</code>, <code>src/lib/code/warmup.ts</code></td>
        <td><code>npx tsx tests/code_runner_dispatch.test.ts</code></td>
      </tr>
      <tr>
        <td><strong>Block 27</strong></td>
        <td>Pyodide Python WebAssembly Runtime</td>
        <td><code>public/python-worker.js</code>, <code>src/lib/code/pyodideRunner.ts</code></td>
        <td><code>npx tsx tests/all_nine_problems_cross_language_deep.test.ts</code></td>
      </tr>
      <tr>
        <td><strong>Block 28</strong></td>
        <td>In-Browser JS/TS Sandbox & Monaco</td>
        <td><code>src/lib/code/jsRunner.ts</code>, <code>public/esbuild/esbuild.wasm</code></td>
        <td>Sandbox security checks in <code>tests/verify_block8_snippets.ts</code></td>
      </tr>
      <tr>
        <td><strong>Block 29</strong></td>
        <td>Embedded PostgreSQL (PGlite) Worker</td>
        <td><code>src/lib/code/sql/sqlWorker.ts</code>, <code>public/sql/*</code></td>
        <td><code>npx tsx tests/db/production-inventory.test.ts</code></td>
      </tr>
      <tr>
        <td><strong>Block 30</strong></td>
        <td>Code Error Normalization & Watchdog</td>
        <td><code>src/lib/code/errorNormalizer.ts</code>, <code>sandboxTimeout.ts</code></td>
        <td>Timeout tests in <code>tests/systems_long_lessons_parity.test.ts</code></td>
      </tr>
      <tr>
        <td><strong>Block 31</strong></td>
        <td>Cloud Run Java Judge Container</td>
        <td><code>cloud-run/java-judge/server.js</code>, <code>Dockerfile</code></td>
        <td><code>node scripts/legacy_generators/audits/node_audit_java.cjs</code></td>
      </tr>
      <tr>
        <td><strong>Block 32</strong></td>
        <td>Cloud Run Node.js Judge Container</td>
        <td><code>cloud-run/js-judge/server.js</code>, <code>Dockerfile</code></td>
        <td>Cloud Run judge test runner suite</td>
      </tr>
      <tr>
        <td><strong>Block 33</strong></td>
        <td>Cloud Run Python Judge Container</td>
        <td><code>cloud-run/python-judge/server.js</code>, <code>Dockerfile</code></td>
        <td>Remote memory and timeout verification</td>
      </tr>
      <tr>
        <td><strong>Block 80</strong></td>
        <td>Multi-Tenant Branding & Master Smoke</td>
        <td><code>src/app/university/page.tsx</code>, <code>audit/walk-routes.mjs</code></td>
        <td><code>node audit/walk-routes.mjs && npm run audit:contracts</code></td>
      </tr>
    </tbody>
  </table>

  <h2>4. Central Memory Coordination Protocols</h2>
  <p>Before and after every block verification, update the central shared memory directory:</p>
  <ul>
    <li><strong>Active Control:</strong> Log state changes in <code>C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv</code>.</li>
    <li><strong>Tasks Ledger:</strong> Mark task IDs complete in <code>C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv</code>.</li>
    <li><strong>Architectural Memory:</strong> Append detailed milestone summaries to <code>C:\Users\Admin\Desktop\projects\memory of agent\PROJECT_MEMORY.md</code>.</li>
  </ul>

</body>
</html>
`;

(async () => {
  const htmlPath = path.join(DOCS_DIR, 'PINIT_BRANCH_MAIN_DIRECTIVE.html');
  fs.writeFileSync(htmlPath, htmlContent, 'utf8');
  console.log('HTML written to:', htmlPath);

  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('file:///' + htmlPath.replace(/\\/g, '/'), { waitUntil: 'networkidle' });

  const destPdfDocs = path.join(DOCS_DIR, 'PINIT_BRANCH_MAIN_DIRECTIVE.pdf');
  const destPdfDesktop = path.join(DESKTOP_DIR, 'PINIT_BRANCH_MAIN_DIRECTIVE.pdf');

  await page.pdf({
    path: destPdfDocs,
    format: 'A4',
    margin: { top: '10mm', right: '12mm', bottom: '10mm', left: '12mm' },
    printBackground: true
  });
  console.log('PDF 1 created in docs/directives:', destPdfDocs);

  fs.copyFileSync(destPdfDocs, destPdfDesktop);
  console.log('PDF 1 mirrored to Desktop:', destPdfDesktop);

  await browser.close();
})();
