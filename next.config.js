/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['yoyoguild.vercel.app'],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        bufferutil: false,
        'utf-8-validate': false,
        ws: false,
      };
    }
    return config;
  },
  // Static export için
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig