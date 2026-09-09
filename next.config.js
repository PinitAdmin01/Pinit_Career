// ── Security response headers ───────────────────────────────────────────────
// These duplicate the headers in firebase.json ON PURPOSE.
//
// firebase.json is read by Firebase Hosting and nothing else. Deploying to
// Vercel, Firebase App Hosting, Render or any other server host ignores it
// entirely, which would silently drop CSP, HSTS and clickjacking protection
// while everything still appeared to work. Defining them here means the
// hosting choice no longer decides whether the app is protected.
//
// Keep the two in sync. If you add a host the app must reach, add it to
// connect-src in BOTH files, then run `npm run audit:headers` to confirm.
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.supabase.co https://checkout.razorpay.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob: https://*.supabase.co https://api.dicebear.com https://avatars.githubusercontent.com",
  // Three.js GLTFLoader unpacks the textures inside each .glb into blob: URLs
  // and then FETCHES them, so blob: has to be allowed in connect-src as well as
  // img-src. Without it every texture fails with "THREE.GLTFLoader: Couldn't
  // load texture blob:..." and the 3D mentor renders as an empty black panel.
  "media-src 'self' blob: data: https://*.supabase.co https://pinit-voice-service.onrender.com",
  // Audio worklets and the TTS worker are constructed from blob: URLs. worker-src
  // has no default of its own — it falls back to script-src, which does not allow
  // blob: — so it must be stated explicitly or every worker is refused.
  "worker-src 'self' blob:",
  // Every origin the browser is allowed to call. Anything missing here fails
  // before the request leaves the page, with no network error to debug.
  [
    "connect-src 'self'",
    'blob:',
    'https://*.supabase.co',
    'wss://*.supabase.co',
    'https://api.razorpay.com',
    'https://openrouter.ai',
    'https://api.elevenlabs.io',
    'https://pinit-voice-service.onrender.com',
    'https://pinit-backend-v8pd.onrender.com',
    'https://api.groq.com',
    'https://api.github.com',
  ].join(' '),
  "frame-src 'self' https://api.razorpay.com",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ') + ';';

const SECURITY_HEADERS = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
  // camera/microphone must be (self): face login, proctored interviews, voice
  // onboarding and speech recognition all call getUserMedia. An empty
  // allowlist — camera=() — disables them for the whole origin, and the
  // browser refuses silently, which reads exactly like a broken feature.
  { key: 'Permissions-Policy', value: 'camera=(self), microphone=(self), geolocation=(), browsing-topics=()' },
  { key: 'Content-Security-Policy', value: CSP },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      { source: '/:path*', headers: SECURITY_HEADERS },
      // Build output is content-hashed, so it can be cached indefinitely.
      {
        source: '/_next/static/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ];
  },

  // Node.js deployment — API routes are active.
  // Do NOT add output: 'export' here; it silently removes all /api/* routes.
  reactStrictMode: false,
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol:'https', hostname:'firebasestorage.googleapis.com' },
      { protocol:'https', hostname:'*.supabase.co' },
      { protocol:'https', hostname:'cdn.jsdelivr.net' },
      { protocol:'https', hostname:'huggingface.co' },
      { protocol:'https', hostname:'*.huggingface.co' },
    ],
  },
  // Fail the build on type errors — do not ship broken TS silently.
  typescript: { ignoreBuildErrors: false },
  // Also fail the build on ESLint errors — consistent with TS strictness.
  eslint:     { ignoreDuringBuilds: false },

  // NOTE: experimental.cpus was briefly set to 4 while investigating an
  // intermittent build failure. The real cause turned out to be a Windows
  // filesystem race in build.js (it wiped .next and swallowed removal errors,
  // so builds could start against a half-deleted directory). That is fixed in
  // ensureBuildDirs(). Capping CPUs only slowed the build without addressing
  // the cause, so it has been left at the Next.js default.
  // If build-worker memory ever does become the bottleneck, add:
  //   experimental: { cpus: 4 }

  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'sharp$':             false,
        'onnxruntime-node$':  false,
        fs: false,
        path: false,
      };
    }
    return config;
  },
};
module.exports = nextConfig;
