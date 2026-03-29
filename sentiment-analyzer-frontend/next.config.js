/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable strict mode for better React practices
  reactStrictMode: true,

  // Configure allowed image domains if needed
  images: {
    domains: ['localhost'],
  },

  // Environment variables exposed to browser
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  },
};

module.exports = nextConfig;
