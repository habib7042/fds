import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static export for Netlify
  output: 'export',
  trailingSlash: true,
  distDir: 'out',
  
  // Skip TypeScript errors during build
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Disable strict mode for better compatibility
  reactStrictMode: false,
  
  // Skip ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Optimize images for static export
  images: {
    unoptimized: true,
  },
  
  // Handle environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
};

export default nextConfig;
