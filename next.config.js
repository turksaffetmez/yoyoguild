/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // veya 'server'
  trailingSlash: true,
  images: {
    unoptimized: true,
    domains: ['yoyoguild.vercel.app'],
  },
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig