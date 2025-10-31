/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true,
  },
  // Hostinger用の設定
  poweredByHeader: false,
}

module.exports = nextConfig

