/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.pokemontcg.io'],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })
    return config
  },
}

module.exports = nextConfig
