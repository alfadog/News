/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: []
  },
  transpilePackages: ['@news/shared', '@news/rules'],
  async rewrites() {
    const destination = process.env.PAYLOAD_PUBLIC_SERVER_URL
      ? `${process.env.PAYLOAD_PUBLIC_SERVER_URL.replace(/\/$/, '')}/api/:path*`
      : undefined;

    if (!destination) return [];

    return [
      {
        source: '/api/:path*',
        destination
      }
    ];
  }
};

module.exports = nextConfig;
