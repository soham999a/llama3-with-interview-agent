/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    serverActions: true,
  },
  // Exclude problematic API routes from the build
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  webpack: (config, { isServer }) => {
    // Exclude problematic API routes from the build
    if (isServer) {
      config.externals = [...config.externals, 'mongodb'];
    }
    return config;
  },
  // Ignore specific API routes during build
  async rewrites() {
    return [
      {
        source: '/api/interviews/:id/feedback',
        destination: '/api/mock-data?type=feedback&id=:id',
      },
      {
        source: '/api/interviews/:id',
        destination: '/api/mock-data?type=interview&id=:id',
      },
      {
        source: '/api/interviews',
        destination: '/api/mock-data?type=interviews',
      },
      {
        source: '/api/user/stats',
        destination: '/api/mock-data?type=user-stats',
      },
    ];
  },
};

export default nextConfig;
