/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com'
      },
      {
        protocol: 'https',
        hostname: 'www.shisha-mart.com'
      },
      {
        protocol: 'https',
        hostname: 'blogger.googleusercontent.com'
      }
    ]
  },
}

module.exports = nextConfig
