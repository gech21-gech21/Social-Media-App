import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com", // Specific domain for Pexels
      },
      {
        protocol: "https",
        hostname: "img.clerk.com", // For Clerk avatars/images
      },
      // Add other domains as needed
    ],
  },
};

export default nextConfig;
