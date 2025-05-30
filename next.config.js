/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Disable ESLint during builds
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['via.placeholder.com'],
  },
  // Security headers to protect against common web vulnerabilities
  async headers() {
    return [
      {
        // Apply these headers to all routes
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://ssl.google-analytics.com https://www.youtube.com https://www.paypal.com https://www.paypalobjects.com https://www.sandbox.paypal.com; connect-src 'self' https://www.google-analytics.com https://api.sandbox.paypal.com https://api.paypal.com https://www.paypal.com https://www.paypalobjects.com https://api-m.sandbox.paypal.com https://www.sandbox.paypal.com; img-src 'self' data: https://www.google-analytics.com https://www.paypal.com https://www.paypalobjects.com https://www.sandbox.paypal.com; style-src 'self' 'unsafe-inline'; font-src 'self' data:; frame-src 'self' https://www.youtube.com https://www.paypal.com https://www.sandbox.paypal.com; object-src 'none';",
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(self), interest-cohort=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/blog',
        destination: '/vibe-surf-blog',
        permanent: true,
      },
      {
        source: '/blog/:slug',
        destination: '/vibe-surf-blog/:slug',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
