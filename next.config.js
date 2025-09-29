/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // ✅ CRITICAL: AppKit için SSR sorunlarını çöz
  experimental: {
    esmExternals: 'loose'
  },
  webpack: (config, { isServer }) => {
    // ✅ Client-side only modülleri handle et
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    // ✅ AppKit ve WalletConnect modüllerini external yap
    config.externals.push(
      'pino-pretty',
      'encoding',
      'node-fetch',
      'cross-fetch'
    );

    return config;
  }
}

module.exports = nextConfig