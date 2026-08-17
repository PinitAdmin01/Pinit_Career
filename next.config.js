/** @type {import('next').NextConfig} */
const nextConfig = {
  // Node.js deployment — API routes are active.
  // Do NOT add output: 'export' here; it silently removes all /api/* routes.
  reactStrictMode: false,
  optimizeFonts: false,
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
