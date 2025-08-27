/** @type {import('next').NextConfig} */
const nextConfig = {
  // App Directory is stable in Next.js 14, no need for experimental flag
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
        port: '',
        pathname: '/7.x/avataaars/svg**',
      },
    ],
  },
}

module.exports = nextConfig
