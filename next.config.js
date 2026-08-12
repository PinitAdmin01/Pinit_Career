/** @type {import('next').NextConfig} */
const nextConfig = {
  // NOTE: static export disables App Router API routes on Firebase Hosting.
  // Prefer a Node host for production APIs, or keep export only for demo static UI.
  output: 'export',
  trailingSlash: true,
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
  eslint:     { ignoreDuringBuilds: true },

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
