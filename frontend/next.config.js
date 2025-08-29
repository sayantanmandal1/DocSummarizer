/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable standalone output for Docker
  output: 'standalone',
  
  // Optimize images
  images: {
    unoptimized: true,
  },
  
  // Environment variables
  env: {
    CUSTOM_KEY: 'my-value',
  },
  
  // Server external packages (moved from experimental)
  serverExternalPackages: [],
  
  // Experimental features
  experimental: {
    // Add any experimental features here
  },
  
  // Turbopack configuration (replaces webpack in Next.js 15)
  turbo: {
    rules: {
      // Add any custom Turbopack rules here
    },
  },
  
  // Headers for security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
  
  // Redirects
  async redirects() {
    return []
  },
  
  // Rewrites for API proxy in development
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8001/:path*',
      },
    ]
  },
}

module.exports = nextConfig