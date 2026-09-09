/** @type {import('next').NextConfig} */
const nextConfig = {
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
