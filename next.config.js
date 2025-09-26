/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['yoyoguild.vercel.app'],
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
  }
}

module.exports = nextConfig