import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  webpack(config, { isServer }) {
    if (!isServer) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    return config;
  },
};

export default nextConfig;
