/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "**.playstation.com"
      },
      {
        protocol: "https",
        hostname: "**.playstation.com"
      },
      {
        protocol: "http",
        hostname: "**.playstation.net"
      },
      {
        protocol: "https",
        hostname: "**.playstation.net"
      },
      {
        protocol: "http",
        hostname: "tinfoil.media"
      },
      {
        protocol: "https",
        hostname: "tinfoil.media"
      }
    ]
  }
}

export default nextConfig
