/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',           // Static HTML export for Firebase Hosting
  trailingSlash: true,        // Required for SPA routing on Firebase
  reactStrictMode: false,
  optimizeFonts: false,
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