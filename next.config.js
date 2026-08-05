/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',           // Static HTML export for Firebase Hosting
  trailingSlash: true,        // Required for SPA routing on Firebase
  reactStrictMode: true,
  optimizeFonts: false,
  outputFileTracing: false,
  images: {
    unoptimized: true,        // Required for static export
    remotePatterns: [
      { protocol:'https', hostname:'firebasestorage.googleapis.com' },
      { protocol:'https', hostname:'*.supabase.co' },
      { protocol:'https', hostname:'cdn.jsdelivr.net' },        // Kokoro / ONNX CDN
      { protocol:'https', hostname:'huggingface.co' },          // KittenTTS models
      { protocol:'https', hostname:'*.huggingface.co' },
    ],
  },
  typescript: { ignoreBuildErrors: true },
  eslint:     { ignoreDuringBuilds: true },

  // ── Webpack: exclude Node.js-only packages from browser bundle ──────────────
  // onnxruntime-node is the server-side binary; browsers use onnxruntime-web instead.
  // sharp$ is a Node-only image library that Transformers.js may try to pull in.
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'sharp$':             false,
        'onnxruntime-node$':  false,
      };
    }
    return config;
  },
};
module.exports = nextConfig;