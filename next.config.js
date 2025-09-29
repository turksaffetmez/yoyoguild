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
  // ✅ CRITICAL: AppKit için SSR'yi devre dışı bırak
  experimental: {
    esmExternals: 'loose'
  },
  webpack: (config) => {
    config.externals.push('pino-pretty', 'encoding');
    return config;
  }
}

module.exports = nextConfig