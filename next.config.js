/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    styledComponents: {
      ssr: false,
      displayName: true,
    },
  },
}

module.exports = nextConfig
