import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["images.pexels.com"], // allow Next.js to load images from Pexels
  },
};

export default nextConfig;
