/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'randomuser.me',
        port: '',
        pathname: '/api/portraits/**',
      },
      {
        protocol: "https",
        hostname: "i.ibb.co",
        pathname: "/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/auth/:path*",
        destination: `https://medi-store-server-tau.vercel.app/api/auth/:path*`,
      },
      {
        source: "/api/:path*",
        destination: `https://medi-store-server-tau.vercel.app/api/:path*`,
      },
    ];
  },
}

module.exports = nextConfig