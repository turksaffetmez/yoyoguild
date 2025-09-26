/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['yoyoguild.vercel.app'],
  },
  webpack: (config, { isServer }) => {
    // WS modülü hatalarını çöz
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        bufferutil: false,
        'utf-8-validate': false,
        ws: false,
      };
    }
    
    // Optional: Bundle analyzer (production'da kapat)
    if (process.env.ANALYZE) {
      const withBundleAnalyzer = require('@next/bundle-analyzer')({
        enabled: true,
      });
      config = withBundleAnalyzer(config);
    }
    
    return config;
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'X-Requested-With, Content-Type, Authorization' }
        ]
      }
    ]
  },
  // Build optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
}

module.exports = nextConfig