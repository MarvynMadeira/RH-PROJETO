import path from 'path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactCompiler: true,
  webpack(config) {
    // 🔹 Garante que o Next reconhece o alias @src em runtime
    config.resolve.alias = {
      ...config.resolve.alias,
      '@src': path.resolve(__dirname, 'src'),
    };
    return config;
  },
};

export default nextConfig;
