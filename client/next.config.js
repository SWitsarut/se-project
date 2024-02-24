/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    
    config.resolve.extensionAlias = {
      '.js': ['.js', '.ts', '.tsx'],
    };

    return config;
  },
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