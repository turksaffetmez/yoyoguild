/** @type {import('next').NextConfig} */

import { SpeedInsights } from "@vercel/speed-insights/next"

const nextConfig = {
  async redirects() {
    return [
      {
        source: '/.well-known/farcaster.json',
        destination: 'https://api.farcaster.xyz/miniapps/hosted-manifest/01998d9b-29dd-6311-a19f-86fb63ac8832',
        permanent: false,
        statusCode: 307
      }
    ]
  },
  async headers() {
    return [
      {
        source: '/.well-known/farcaster.json',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Cache-Control', value: 'public, max-age=3600' }
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', 'value': 'Content-Type' },
        ],
      },
    ]
  },
  images: {
    unoptimized: true,
    domains: ['yoyoguild.vercel.app'],
  },
}

module.exports = nextConfig