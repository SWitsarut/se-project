/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "files.edgestore.dev",
        pathname: "/*/**",
      },
      {
        protocol: "https",
        hostname: "cdn-local.mebmarket.com",
        pathname: "/*/**",
      },
    ],
  },
};

module.exports = nextConfig;