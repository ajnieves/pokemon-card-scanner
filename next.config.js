/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.pokemontcg.io'],
    unoptimized: true
  },
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  }
}

module.exports = nextConfig
