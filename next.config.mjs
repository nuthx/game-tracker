/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.playstation.com',
      },
    ],
  },
};

export default nextConfig;
