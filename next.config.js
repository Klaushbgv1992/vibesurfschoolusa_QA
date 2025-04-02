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
