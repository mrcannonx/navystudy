/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true,
    serverActions: {
      bodySizeLimit: '2mb'
    },
    optimizeCss: true // Enable CSS optimization
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'krfijvkfyngcofhnmfhe.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      }
    ],
  },
  async rewrites() {
    return [
      {
        source: '/v1/:path*',
        destination: '/api/v1/:path*'
      }
    ]
  }
}

module.exports = nextConfig
