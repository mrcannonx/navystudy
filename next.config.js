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
  // Fix CSS preload warnings
  onDemandEntries: {
    // Keep unused pages in memory for longer
    maxInactiveAge: 60 * 60 * 1000, // 1 hour
    // Number of pages to keep in memory
    pagesBufferLength: 5,
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
      },
      {
        protocol: 'https',
        hostname: 'randomuser.me',
        pathname: '/api/portraits/**',
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
