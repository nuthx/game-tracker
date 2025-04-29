/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '**.playstation.com',
      },
      {
        protocol: 'https',
        hostname: '**.playstation.com',
      },
      {
        protocol: 'http',
        hostname: '**.playstation.net',
      },
      {
        protocol: 'https',
        hostname: '**.playstation.net',
      },
    ],
  },
};

export default nextConfig;
