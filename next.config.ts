import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'talent-trial-project.s3.ap-south-1.amazonaws.com',
    ],
  },
  bundlePagesRouterDependencies: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  distDir: "build",
  webpack: (config) => {
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    }
    
    // Add asset module rules for wasm files
    config.module.rules.push({
      test: /\.wasm$/,
      type: 'asset/resource',
    })

    return config
  },
};

export default nextConfig;