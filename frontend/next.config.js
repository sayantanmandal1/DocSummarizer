/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable standalone output for Docker
  output: 'standalone',

  // Set the correct workspace root to avoid lockfile warnings
  outputFileTracingRoot: require('path').join(__dirname, '../'),

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

  // Webpack configuration (if needed)
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Add any custom webpack configuration here
    return config
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

  // Rewrites for API proxy
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://docsummarizer.onrender.com/:path*',
      },
    ]
  },
}

module.exports = nextConfig