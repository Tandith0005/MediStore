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
      {
        protocol: "https",
        hostname: "i.ibb.co.com",
        pathname: "/**",
      },
    ],
  },
  async rewrites() {
    const authDestination = process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:5000/api/auth";
    const apiDestination = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

    return [
      {
        source: "/api/auth/:path*",
        destination: `${authDestination}/:path*`,
      },
      {
        source: "/api/v1/:path*",
        destination: `${apiDestination}/:path*`,
      },
    ];
  },
}

module.exports = nextConfig