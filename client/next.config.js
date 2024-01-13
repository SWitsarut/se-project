/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: [`cdn-local.mebmarket.com`, `img.freepik.com`]
  }
}

module.exports = nextConfig