/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: []
  },
  transpilePackages: ['@news/shared', '@news/rules', '@payloadcms/next'],
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/payload/:path*'
      }
    ];
  }
};

module.exports = nextConfig;
